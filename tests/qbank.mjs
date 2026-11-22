// Checks every question bank in public/qbank/ (shared engine, spec /mnt/project-files/qbank/spec.md):
// index topics exist, ids unique per bank, required fields, mcq exactly one valid answer, msq at least one,
// options distinct, nat tolerance set, text answers present, TeX parses with temml, and every template runs
// 200 seeds with no NaN/undefined and agrees with its own verify(). Also checks the engine's answer checking
// and marking. Run: node tests/qbank.mjs [bank ...]   (part of npm test)
import { readdirSync, existsSync, statSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import temml from 'temml';
import * as Q from '../src/lib/qbank/core.mjs';

let pass = 0, fail = 0;
const errs = [];
const ok = (name, cond) => { if (cond) pass++; else { fail++; errs.push(name); } };

// ---- engine self-checks ----
ok('readNumber 3e8', Q.readNumber('3e8') === 3e8);
ok('readNumber 3×10^8', Q.readNumber('3×10^8') === 3e8);
ok('readNumber 1,234.5', Q.readNumber('1,234.5') === 1234.5);
ok('readNumber −2.5', Q.readNumber('−2.5') === -2.5);
ok('readNumber 1/4', Q.readNumber('1/4') === 0.25);
ok('readNumber junk', Number.isNaN(Q.readNumber('abc')));
ok('nat tol', Q.check({ type: 'nat', answer: 2, tol: 0.05 }, '2.04').right && !Q.check({ type: 'nat', answer: 2, tol: 0.05 }, '2.06').right);
ok('msq exact', Q.check({ type: 'msq', answer: [0, 2] }, [2, 0]).right && !Q.check({ type: 'msq', answer: [0, 2] }, [0]).right);
ok('order', Q.check({ type: 'order', answer: ['I think it is in room 204'] }, ['I', 'think', 'it', 'is', 'in', 'room', '204']).right && !Q.check({ type: 'order', answer: ['I think it is in room 204'] }, ['think', 'I', 'it', 'is', 'in', 'room', '204']).right);
ok('text', Q.check({ type: 'text', answer: ['Blue whale'] }, ' blue  WHALE. ').right);
ok('jam mcq negative', Q.score('jam', { type: 'mcq', answer: 1, level: 3 }, 0).marks === -0.67);
ok('jam msq no negative', Q.score('jam', { type: 'msq', answer: [1], level: 3 }, [0]).marks === 0);
ok('jee-adv msq partial', Q.score('jee-adv', { type: 'msq', answer: [0, 1, 2], level: 3 }, [0, 1]).marks === 2);
ok('rng repeatable', Q.rng(42)() === Q.rng(42)());
ok('text maxWords', !Q.check({ type: 'text', answer: ['old bridge'], maxWords: 2 }, 'the old bridge').right && Q.check({ type: 'text', answer: ['old bridge'], maxWords: 2 }, 'Old Bridge').right);
ok('open is not scored', Q.check({ type: 'open' }, 'anything').unscored === true);

// ---- banks ----
const root = new URL('../public/qbank/', import.meta.url);
const only = process.argv.slice(2);
const banks = readdirSync(root).filter((d) => !d.startsWith('_') && statSync(new URL(d, root)).isDirectory() && (!only.length || only.includes(d)));
const texOk = (s, where) => {
  if (typeof s !== 'string') return;
  const parts = [...s.matchAll(/\$\$([\s\S]+?)\$\$/g)].map((m) => [m[1], true]).concat([...s.replace(/\$\$[\s\S]+?\$\$/g, '').matchAll(/(^|[^\\])\$([^$]+?)\$/g)].map((m) => [m[2], false]));
  for (const [t, d] of parts) { try { temml.renderToString(t, { displayMode: d, throwOnError: true }); pass++; } catch (e) { fail++; errs.push(`${where}: bad TeX "${t}": ${e.message.slice(0, 80)}`); } }
};
const checkItem = (it, where, groups = {}) => {
  ok(`${where}: id`, typeof it.id === 'string' && it.id.length > 0);
  ok(`${where}: type`, typeof it.type === 'string');
  ok(`${where}: level 1-5`, [1, 2, 3, 4, 5].includes(it.level));
  ok(`${where}: q`, typeof it.q === 'string' && it.q.trim().length > 0);
  ok(`${where}: sol`, it.type === 'open' || (typeof it.sol === 'string' && it.sol.trim().length > 0));
  const opts = it.options ?? (it.group ? groups[it.group]?.options : undefined);
  if (it.group) ok(`${where}: group ${it.group} exists`, !!groups[it.group]);
  if (it.type === 'mcq' || it.type === 'msq') {
    ok(`${where}: options`, Array.isArray(opts) && opts.length >= 2);
    if (Array.isArray(opts)) ok(`${where}: options distinct`, new Set(opts.map((o) => String(o).trim())).size === opts.length);
    if (it.type === 'mcq') ok(`${where}: mcq answer index`, Number.isInteger(it.answer) && it.answer >= 0 && it.answer < (opts?.length ?? 0));
    else ok(`${where}: msq answers`, Array.isArray(it.answer) && it.answer.length >= 1 && new Set(it.answer).size === it.answer.length && it.answer.every((a) => Number.isInteger(a) && a >= 0 && a < (opts?.length ?? 0)));
  }
  if (it.type === 'nat') {
    ok(`${where}: nat answer number`, typeof it.answer === 'number' && Number.isFinite(it.answer));
    ok(`${where}: nat tol set`, typeof it.tol === 'number' && it.tol >= 0 && Number.isFinite(it.tol));
  }
  if (it.type === 'text') ok(`${where}: text answers`, Array.isArray(it.answer) && it.answer.length > 0);
  if (it.type === 'order') {
    const chips = (it.options ?? []).map((w) => Q.normText(w)).sort().join('|');
    ok(`${where}: order chips and answers`, Array.isArray(it.options) && it.options.length >= 2 && Array.isArray(it.answer) && it.answer.length > 0 && it.answer.every((a) => Q.normText(a).split(' ').sort().join('|') === chips));
  }
  for (const k of ['q', 'sol', 'trap']) texOk(it[k], `${where}.${k}`);
  (opts ?? []).forEach((o, i) => texOk(o, `${where}.options[${i}]`));
  // listening scripts (group or item `audio`) and open writing/speaking tasks
  const audioOk = (a, w) => ok(`${w}: audio is a list of { who, text } lines`, Array.isArray(a) && a.length > 0 && a.every((l) => typeof l.text === 'string' && l.text.trim() && (l.who == null || /^[A-DN]$/.test(l.who))));
  if (it.audio) audioOk(it.audio, where);
  if (it.group && groups[it.group]?.audio) audioOk(groups[it.group].audio, `${where} group ${it.group}`);
  if (it.type === 'open') {
    ok(`${where}: open has a model answer or checklist`, typeof it.model === 'string' || (Array.isArray(it.checklist) && it.checklist.length > 0));
    if (it.timers) ok(`${where}: open timers are seconds or a word target`, Object.values(it.timers).every((v) => Number.isFinite(v) && v > 0));
  }
  if (it.type === 'text' && it.maxWords) ok(`${where}: every accepted answer fits maxWords ${it.maxWords}`, it.answer.every((a) => String(a).trim().split(/\s+/).length <= it.maxWords));
  const str = JSON.stringify(it);
  ok(`${where}: no NaN/undefined text`, !/\bNaN\b|undefined|Infinity/.test(str));
};

let totals = { items: 0, gens: 0 };
for (const bank of banks) {
  const idxUrl = new URL(`${bank}/index.js`, root);
  if (!existsSync(idxUrl)) { ok(`${bank}: index.js missing`, false); continue; }
  const idx = (await import(idxUrl.href)).default;
  const ids = new Set();
  let bi = 0, bg = 0;
  const listed = new Set(idx.units.flatMap((u) => u.topics.map((t) => t.id)));
  const files = readdirSync(new URL(`${bank}/`, root)).filter((f) => f.endsWith('.js') && f !== 'index.js' && !f.startsWith('_') && !f.endsWith('.gen.js'));
  for (const f of files) ok(`${bank}/${f}: listed in index.js`, listed.has(f.slice(0, -3)));
  for (const t of listed) {
    const fu = new URL(`${bank}/${t}.js`, root);
    if (!existsSync(fu)) { ok(`${bank}/${t}.js missing (listed in index)`, false); continue; }
    const file = (await import(fu.href)).default;
    ok(`${bank}/${t}: topic field matches file name`, file.topic === t);
    for (const it of file.items ?? []) {
      const w = `${bank}/${t}#${it.id}`;
      ok(`${w}: id unique in bank`, !ids.has(it.id)); ids.add(it.id);
      checkItem(it, w, file.groups);
      if (typeof it.calc === 'function') ok(`${w}: calc() ${it.calc()} agrees with answer ${it.answer}`, Math.abs(it.calc() - it.answer) <= Math.max(it.tol ?? 0, 1e-9));
      if (it.exams && idx.exams) ok(`${w}: exam tags known`, it.exams.every((e) => e in idx.exams));
      bi++;
    }
    for (const g of Q.topicGens(file, t)) {
      const w = `${bank}/${t}#${g.id}`;
      ok(`${w}: id unique in bank`, !ids.has(g.id)); ids.add(g.id);
      ok(`${w}: make()`, typeof g.make === 'function');
      bg++;
      let bad = 0;
      for (let s = 1; s <= 200 && bad < 3; s++) {
        let inst;
        try { inst = Q.instantiate(g, s * 7919); } catch (e) { bad++; ok(`${w} seed ${s}: throws ${e.message}`, false); continue; }
        const before = fail;
        checkItem(inst, `${w}~${s * 7919}`, file.groups);
        if (g.verify && inst.type === 'nat') {
          const v = g.verify(inst);
          const good = Math.abs(v - inst.answer) <= Math.max(inst.tol ?? 0, 1e-6 * Math.abs(v));
          ok(`${w}~${s * 7919}: verify ${v} vs answer ${inst.answer}`, good);
        }
        if (inst.type === 'nat' && s === 1) ok(`${w}: answer within tol of itself after rounding`, Q.check(inst, String(inst.answer)).right);
        if (fail > before) bad++;
      }
      ok(`${w}: repeatable seed`, JSON.stringify(Q.instantiate(g, 99).q) === JSON.stringify(Q.instantiate(g, 99).q));
    }
  }
  // Answer letters spread out: in a topic with 8+ written MCQs, no letter holds more than half and none is unused
  // among the first four (otherwise students learn "it's usually A").
  for (const t of listed) {
    const fu = new URL(`${bank}/${t}.js`, root); if (!existsSync(fu)) continue;
    const mcq = ((await import(fu.href)).default.items ?? []).filter((i) => i.type === 'mcq' && Number.isInteger(i.answer));
    if (mcq.length < 8) continue;
    const c = [0, 0, 0, 0]; for (const i of mcq) if (i.answer < 4) c[i.answer]++;
    const spread = Math.max(...c) <= mcq.length / 2 && c.every((x) => x > 0);
    // Enforced for banks listed here; others get a warning until their threads fix them (2026-11-22).
    if (['physics'].includes(bank)) ok(`${bank}/${t}: MCQ answer letters spread (${c.join('/')})`, spread);
    else if (!spread) console.warn(`WARN ${bank}/${t}: MCQ answer letters bunched (${c.join('/')}); spread them over A-D`);
  }
  console.log(`${bank}: ${bi} written questions, ${bg} templates`);
  totals.items += bi; totals.gens += bg;
}
for (const e of errs.slice(0, 40)) console.error('FAIL ' + e);
if (errs.length > 40) console.error(`... and ${errs.length - 40} more`);
console.log(`qbank: ${pass} passed, ${fail} failed (${totals.items} written questions, ${totals.gens} templates in ${banks.length} banks)`);
process.exit(fail ? 1 : 0);
