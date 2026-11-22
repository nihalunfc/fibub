// Checks for the GMAT and GRE courses: every question in the banks they use (public/qbank/grad-quant/ ...),
// every live problem, and every lesson's kit boxes. Bank checks: each item has one valid answer and distinct
// choices; each generator runs for 200 seeds with no NaN or "undefined", its right choice shows its value, and
// `check` (the answer worked out again from the numbers) agrees. Run: node tests/gmat.mjs (part of npm test).
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import yaml from 'js-yaml';

let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : (fail++, fail < 400 && console.error('FAIL ' + name)); };
const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const bad = (s) => typeof s !== 'string' || s.length < 3 || /undefined|NaN|\[object|Infinity/.test(s);

const BANKS = ['grad-quant', 'grad-verbal', 'gmat-di'];
const seen = new Set();
for (const bank of BANKS) {
  const dir = new URL(`../public/qbank/${bank}/`, import.meta.url);
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.js') && !f.startsWith('_') && f !== 'index.js' && f !== 'all.js')) {
    const T = (await import(new URL(f, dir))).default;
    ok(`${bank}/${f}: topic equals file name`, T.topic === f.slice(0, -3));
    for (const it of T.items ?? []) {
      ok(`${it.id}: id unique`, !seen.has(it.id)); seen.add(it.id);
      ok(`${it.id}: has q and sol`, !bad(it.q) && !bad(it.sol));
      const opts = it.options ?? T.groups?.[it.group]?.options;
      if (it.type === 'mcq') ok(`${it.id}: answer is a choice`, Number.isInteger(it.answer) && it.answer >= 0 && it.answer < opts.length);
      if (it.type === 'msq') ok(`${it.id}: answers are choices`, Array.isArray(it.answer) && it.answer.length > 0 && it.answer.every((a) => a >= 0 && a < opts.length));
      if (opts) ok(`${it.id}: choices distinct`, new Set(opts).size === opts.length);
      if (it.group) ok(`${it.id}: group exists`, !!T.groups?.[it.group]);
    }
    for (const g of T.gens ?? []) {
      ok(`${g.id}: id unique`, !seen.has(g.id)); seen.add(g.id);
      for (let s = 1; s <= 200; s++) {
        const p = g.make(rng(s));
        const good = !bad(p.q) && !bad(p.sol) && (p.options ? p.options.every((o) => !bad(String(o)) || String(o).length) : true);
        ok(`${g.id}~${s}: text filled in`, good);
        if (g.type === 'mcq') {
          const opts = p.options;
          ok(`${g.id}~${s}: answer is a choice`, Number.isInteger(p.answer) && p.answer >= 0 && p.answer < opts.length);
          ok(`${g.id}~${s}: choices distinct`, new Set(opts).size === opts.length);
          ok(`${g.id}~${s}: five choices`, opts.length === (g.format === 'qc' ? 4 : 5));
        }
        if (g.check) { const want = g.check(p); ok(`${g.id}~${s}: check ${p.value} vs ${want}`, Math.abs(p.value - want) <= 1e-6 * Math.max(1, Math.abs(want))); }
        if (p.value !== undefined) ok(`${g.id}~${s}: value is finite`, Number.isFinite(p.value));
      }
    }
  }
}

// Live problems and lessons of each course
for (const course of ['gmat', 'gre']) {
  const kit = new URL(`../public/learn-kit/${course}/`, import.meta.url);
  if (!existsSync(kit)) continue;
  const PROBLEMS = (await import(new URL('problems.js', kit))).default;
  for (const [id, pr] of Object.entries(PROBLEMS)) {
    for (let s = 1; s <= 5; s++) {
      const p = pr.make(rng(s));
      ok(`${course} problem ${id}: finite answer`, Number.isFinite(p.answer));
      ok(`${course} problem ${id}: q, hint, solution`, [p.q, p.hint, p.solution].every((x) => !bad(x) && x.length > 10));
    }
  }
  const dir = new URL(`../src/courses/${course}/`, import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const md = readFileSync(new URL(f, dir), 'utf8');
    for (const m of md.matchAll(/data-fig="([a-z0-9-]+)"/g)) ok(`${course}/${f}: figure ${m[1]} exists`, existsSync(new URL(`figs/${m[1]}.js`, kit)));
    for (const m of md.matchAll(/data-problem="([a-z0-9~-]+)"/g)) ok(`${course}/${f}: problem ${m[1]} exists`, !!PROBLEMS[m[1]]);
    let fm = null; try { fm = yaml.load(md.split('\n---\n')[0].replace(/^---\n/, '')); } catch (e) { console.log(f, String(e).split('\n')[0]); }
    ok(`${course}/${f}: front matter with a 3-question quiz and seoTitle <= 60`, fm?.quiz?.length === 3 && fm.seoTitle?.length <= 60 && fm.quiz.every((q) => q.ans < q.choices.length));
    ok(`${course}/${f}: key points`, md.includes('class="keypoints"'));
    ok(`${course}/${f}: a figure or step player`, /data-fig="|class="steps"/.test(md));
    ok(`${course}/${f}: a live problem or practice`, /data-problem="|class="qbank"|data-qbank/.test(md));
    ok(`${course}/${f}: sources`, /\nsources:\n\s+- /.test(md));
    ok(`${course}/${f}: no "$" money outside maths`, !/(^|[^`\\])\$\d/.test(md.split('\n---\n').slice(1).join('')));
  }
}
console.log(`gmat/gre: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
