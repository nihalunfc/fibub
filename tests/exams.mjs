// Checks for the SAT and LSAT courses: every question bank file (public/qbank/sat, public/qbank/lsat) in the shared
// qbank v1 format, every templated question over 200 seeds (no NaN or undefined, distinct options, valid answer,
// `verify` agrees), the live problems built from them, and every lesson's front matter, figures and boxes.
// Run: node tests/exams.mjs (part of npm test). Prints how many distinct questions the banks can make.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import yaml from 'js-yaml';

let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : (fail++, console.error('FAIL ' + name)); };
const seeded = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const bad = (s) => typeof s !== 'string' || /undefined|NaN|\[object/.test(s);

function checkItem(where, it) {
  ok(`${where}: type`, ['mcq', 'msq', 'nat', 'text', 'open'].includes(it.type));
  ok(`${where}: question text`, !bad(it.q) && it.q.length > 10);
  ok(`${where}: solution`, !bad(it.sol) && it.sol.length > 10);
  if (it.type === 'mcq') {
    ok(`${where}: 4 or 5 options`, Array.isArray(it.options) && it.options.length >= 4 && it.options.length <= 5);
    ok(`${where}: options distinct`, new Set(it.options.map(String)).size === it.options.length);
    ok(`${where}: options readable`, it.options.every((o) => !bad(String(o))));
    ok(`${where}: answer index`, Number.isInteger(it.answer) && it.answer >= 0 && it.answer < it.options.length);
  }
  if (it.type === 'nat') ok(`${where}: numeric answer and tol`, Number.isFinite(it.answer) && Number.isFinite(it.tol));
}

const banks = {};
for (const bank of ['sat', 'lsat']) {
  const dir = new URL(`../public/qbank/${bank}/`, import.meta.url);
  if (!existsSync(new URL('index.js', dir))) continue;
  const index = (await import(new URL('index.js', dir))).default;
  ok(`${bank}: index id`, index.id === bank);
  const ids = new Set();
  let distinct = 0, fixed = 0;
  const topics = index.units.flatMap((u) => u.topics.map((t) => t.id));
  for (const t of topics) {
    const file = new URL(`${t}.js`, dir);
    if (!existsSync(file)) { ok(`${bank}/${t}.js exists`, false); continue; }
    const mod = (await import(file)).default;
    banks[`${bank}/${t}`] = mod;
    ok(`${bank}/${t}: topic name`, mod.topic === t);
    for (const it of mod.items || []) {
      ok(`${bank}/${it.id}: unique id`, !ids.has(it.id)); ids.add(it.id);
      if (it.group) ok(`${bank}/${it.id}: group exists`, !!mod.groups?.[it.group]);
      checkItem(`${bank}/${it.id}`, it.group && !it.options ? { ...it, options: mod.groups[it.group].options } : it);
      fixed++;
    }
    for (const g of mod.gens || []) {
      ok(`${bank}/${g.id}: unique id`, !ids.has(g.id)); ids.add(g.id);
      const seen = new Set();
      for (let s = 1; s <= 200; s++) {
        let p;
        try { p = g.make(seeded(s)); } catch (e) { ok(`${bank}/${g.id}~${s}: runs (${e.message})`, false); break; }
        checkItem(`${bank}/${g.id}~${s}`, { ...p, type: g.type });
        if (g.verify) { const w = g.verify(p); ok(`${bank}/${g.id}~${s}: verify (${w} vs ${p.answer})`, Math.abs(w - p.answer) <= Math.max(1e-6, (p.tol || 0))); }
        seen.add(p.q + (p.options || []).join('|'));
      }
      ok(`${bank}/${g.id}: makes varied questions (${seen.size} of 200)`, seen.size >= 8);
      distinct += seen.size;
    }
  }
  console.log(`${bank}: ${fixed} written questions + ${distinct} distinct generated ones in 200 seeds per template`);
}

// Live problems in the lessons (the kit's numeric problems, built from the bank's numeric templates).
for (const c of ['sat', 'lsat']) {
  const pf = new URL(`../public/learn-kit/${c}/problems.js`, import.meta.url);
  const PROBLEMS = existsSync(pf) ? (await import(pf)).default : {};
  for (const [id, pr] of Object.entries(PROBLEMS)) {
    for (const s of [1, 2, 3, 4]) {
      const p = pr.make(seeded(s));
      ok(`${c} problem ${id}: finite answer`, Number.isFinite(p.answer));
      ok(`${c} problem ${id}: question, hint, solution`, [p.q, p.hint, p.solution].every((x) => !bad(x) && x.length > 10));
    }
  }
  const dir = new URL(`../src/courses/${c}/`, import.meta.url);
  if (!existsSync(dir)) continue;
  const figDir = new URL(`../public/learn-kit/${c}/figs/`, import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const md = readFileSync(new URL(f, dir), 'utf8');
    for (const m of md.matchAll(/data-fig="([a-z0-9-]+)"/g)) ok(`${c}/${f}: figure ${m[1]} exists`, existsSync(new URL(m[1] + '.js', figDir)));
    for (const m of md.matchAll(/data-problem="([a-z0-9-]+)"/g)) ok(`${c}/${f}: problem ${m[1]} exists`, !!PROBLEMS[m[1]]);
    for (const m of md.matchAll(/data-qbank="([a-z0-9-]+)\/([a-z0-9-]+)"/g)) ok(`${c}/${f}: bank topic ${m[1]}/${m[2]} exists`, !!banks[`${m[1]}/${m[2]}`]);
    let fm = null; try { fm = yaml.load(md.split('\n---\n')[0].replace(/^---\n/, '')); } catch (e) { console.log(f, String(e).split('\n')[0]); }
    ok(`${c}/${f}: front matter with a 3-question quiz and a short seoTitle`, fm?.quiz?.length === 3 && (!fm.seoTitle || fm.seoTitle.length <= 60));
    ok(`${c}/${f}: quiz answers valid`, (fm?.quiz || []).every((q) => q.ans < q.choices.length));
    ok(`${c}/${f}: has key points`, md.includes('class="keypoints"'));
    ok(`${c}/${f}: has a figure or a step player`, /data-fig="|class="steps"/.test(md));
    ok(`${c}/${f}: has sources`, /\nsources:\n\s+- /.test(md));
    ok(`${c}/${f}: every image has alt text`, !/<img(?![^>]*alt=)/.test(md));
  }
}
console.log(`exams (SAT, LSAT): ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
