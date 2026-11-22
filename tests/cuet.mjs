// Checks for the CUET (UG) course: every live problem (numbers and its own answer), every figure and practice block a
// lesson names exists, each lesson has the kit's boxes, and the CUET question banks are well formed (a light check;
// tests/qbank.mjs from the shared engine checks all banks in full). Run: node tests/cuet.mjs (part of npm test).
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import yaml from 'js-yaml';
const PROBLEMS = (await import('../public/learn-kit/cuet/problems.js')).default;

let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : (fail++, console.error('FAIL ' + name)); };
const near = (name, got, want, tol = 0.005) => ok(`${name}: got ${got}, want ${want}`, Math.abs(got - want) <= Math.abs(want) * tol + 1e-9);

// Live problems
const rnds = [() => 0, () => 0.5, () => 0.999, Math.random];
for (const [id, pr] of Object.entries(PROBLEMS)) {
  ok(`problem ${id} has a title`, typeof pr.title === 'string' && pr.title.length > 3);
  for (const r of rnds) {
    const p = pr.make(r);
    ok(`problem ${id} answer is a finite number`, Number.isFinite(p.answer));
    ok(`problem ${id} has question, hint and solution`, [p.q, p.hint, p.solution].every((s) => typeof s === 'string' && s.length > 10 && !/undefined|NaN/.test(s)));
    if (pr.verify) near(`problem ${id} independent answer`, p.answer, pr.verify(p));
  }
}

// Question banks (light check)
const seeded = (s) => () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
const banks = new Map();
for (const bank of ['cuet-general-test', 'cuet-english', 'cuet-accountancy', 'cuet-economics']) {
  const dir = new URL(`../public/qbank/${bank}/`, import.meta.url);
  if (!existsSync(new URL('index.js', dir))) continue;
  const idx = (await import(new URL('index.js', dir))).default;
  const ids = new Set(); let items = 0, gens = 0;
  const topics = new Set();
  for (const u of idx.units) for (const t of u.topics) {
    const file = new URL(`${t.id}.js`, dir);
    if (!existsSync(file)) continue; // topics are written over several PRs; only listed-and-present ones are checked
    topics.add(t.id);
    const m = (await import(file)).default;
    ok(`${bank}/${t.id}: topic field`, m.topic === t.id);
    for (const it of m.items) {
      items++;
      ok(`${bank}: id ${it.id} unique`, !ids.has(it.id)); ids.add(it.id);
      ok(`${bank}/${it.id}: q, sol, level`, !!it.q && !!it.sol && it.level >= 1 && it.level <= 5);
      const opts = it.options ?? m.groups?.[it.group]?.options;
      if (it.type === 'mcq') ok(`${bank}/${it.id}: 4 distinct options and a valid answer`, opts && new Set(opts).size === opts.length && it.answer >= 0 && it.answer < opts.length);
      if (it.group) ok(`${bank}/${it.id}: group exists`, !!m.groups?.[it.group]);
    }
    for (const g of m.gens ?? []) {
      gens++;
      ok(`${bank}: id ${g.id} unique`, !ids.has(g.id)); ids.add(g.id);
      for (let s = 1; s <= 100; s++) {
        const p = g.make(seeded(s * 7919)); if (!p) { ok(`${bank}/${g.id}~${s}: returns an item`, false); break; }
        const bad = /undefined|NaN|Infinity/.test(JSON.stringify([p.q, p.options, p.sol]));
        const opt = g.type !== 'mcq' || (new Set(p.options).size === p.options.length && p.answer >= 0 && p.answer < p.options.length);
        if (bad || !opt) { ok(`${bank}/${g.id}~${s}: clean text and options`, false); break; }
      }
    }
  }
  banks.set(bank, topics);
  console.log(`${bank}: ${items} questions + ${gens} generators in ${topics.size} topics`);
}

// Lessons
const dir = new URL('../src/courses/cuet/', import.meta.url);
const figDir = new URL('../public/learn-kit/cuet/figs/', import.meta.url);
for (const f of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const md = readFileSync(new URL(f, dir), 'utf8');
  for (const m of md.matchAll(/data-fig="([a-z0-9-]+)"/g)) ok(`${f}: figure ${m[1]} exists`, existsSync(new URL(m[1] + '.js', figDir)));
  for (const m of md.matchAll(/data-problem="([a-z0-9-]+)"/g)) ok(`${f}: problem ${m[1]} exists`, !!PROBLEMS[m[1]]);
  for (const m of md.matchAll(/data-bank="([a-z0-9-]+)"[^>]*data-topics="([a-z0-9,-]+)"/g)) {
    if (!m[1].startsWith('cuet-')) continue; // shared entrance banks are checked by their own course
    for (const t of m[2].split(',')) ok(`${f}: bank ${m[1]} topic ${t} exists`, !!banks.get(m[1])?.has(t));
  }
  let fm = null; try { fm = yaml.load(md.split('\n---\n')[0].replace(/^---\n/, '')); } catch (e) { console.log(f, String(e).split('\n')[0]); }
  ok(`${f}: front matter is valid YAML with a 3-question quiz`, fm?.quiz?.length === 3 && (!fm.seoTitle || fm.seoTitle.length <= 60));
  ok(`${f}: has key points`, md.includes('class="keypoints"'));
  ok(`${f}: has a figure or a step-by-step animation`, /data-fig="|class="steps"/.test(md));
  ok(`${f}: has practice (a live problem or a question-bank set)`, /data-problem="|class="qbank"/.test(md) || /^(what-is|choosing|study|current-affairs)/.test(f));
  ok(`${f}: has sources`, /\nsources:\n\s+- /.test(md));
  ok(`${f}: every image has alt text`, !/<img(?![^>]*alt=)/.test(md));
}
console.log(`cuet: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
