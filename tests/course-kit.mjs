// Checks for the rebuilt kit courses (Pipeline to Dashboard, Data at Scale) and any later kit course added to IDS: every live problem (its numbers and its own answer), and that every
// kit figure and problem a lesson names exists. Lessons upgraded to the new standard (they contain a
// class="bigidea" box) must also have key points, a physical-meaning box, a step player and a live problem.
// Run: node tests/ml-kit.mjs (part of npm test).
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import yaml from 'js-yaml';

const near = (name, got, want, tol = 0.01) => {
  const ok = Math.abs(got - want) <= Math.max(Math.abs(want) * tol, 1e-9);
  ok ? pass++ : fail++;
  if (!ok) console.error(`FAIL ${name}: got ${got}, want ${want} (±${tol * 100}%)`);
};
const ok = (name, cond) => { cond ? pass++ : (fail++, console.error('FAIL ' + name)); };
const IDS = ['etl', 'data-at-scale', 'offline-ai'];
// Courses being upgraded in place: only lessons that already have a big idea box get the full checks.
const PARTIAL = new Set([]);
let pass = 0, fail = 0;
let lessons = 0;
for (const id of IDS) {
const PROBLEMS = (await import(`../public/learn-kit/${id}/problems.js`)).default;
const rnds = [() => 0, () => 0.5, () => 0.999, Math.random];
for (const [pid, pr] of Object.entries(PROBLEMS)) {
  ok(`problem ${pid} has a title`, typeof pr.title === 'string' && pr.title.length > 3);
  for (const r of rnds) {
    const p = pr.make(r);
    ok(`problem ${pid} answer is a finite number`, Number.isFinite(p.answer));
    ok(`problem ${pid} has question, hint and solution`, [p.q, p.hint, p.solution].every((s) => typeof s === 'string' && s.length > 10 && !/undefined|NaN/.test(s)));
    if (pr.verify) near(`problem ${pid} independent answer`, p.answer, pr.verify(p), 0.005);
  }
}

const dir = new URL(`../src/courses/${id}/`, import.meta.url);
const figDir = new URL(`../public/learn-kit/${id}/figs/`, import.meta.url);
for (const f of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  lessons++;
  const md = readFileSync(new URL(f, dir), 'utf8');
  for (const m of md.matchAll(/data-fig="([a-z0-9-]+)"/g)) ok(`${id}/${f}: kit figure ${m[1]} exists`, existsSync(new URL(m[1] + '.js', figDir)));
  for (const m of md.matchAll(/data-problem="([a-z0-9-]+)"/g)) ok(`${id}/${f}: problem ${m[1]} exists`, !!PROBLEMS[m[1]]);
  let fm = null; try { fm = yaml.load(md.split('\n---\n')[0].replace(/^---\n/, '')); } catch (e) { console.log(f, String(e).split('\n')[0]); }
  ok(`${id}/${f}: front matter is valid YAML with a 3-question quiz`, fm?.quiz?.length === 3 && (!fm.seoTitle || fm.seoTitle.length <= 60));
  ok(`${id}/${f}: every image has alt text`, !/<img(?![^>]*alt=)/.test(md));
  if (PARTIAL.has(id) && !md.includes('class="bigidea"')) continue;
  ok(`${id}/${f}: has a big idea`, md.includes('class="bigidea"'));
  ok(`${id}/${f}: has key points`, md.includes('class="keypoints"'));
  ok(`${id}/${f}: has a physical-meaning box`, md.includes('class="meaning"'));
  ok(`${id}/${f}: has a step player`, md.includes('class="steps"'));
  ok(`${id}/${f}: has a live problem`, /data-problem="/.test(md));
  ok(`${id}/${f}: has sources`, /\nsources:\n\s+- /.test(md));
}
}
console.log(`course-kit: ${lessons} lessons; ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
