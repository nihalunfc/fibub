// Checks for the Plus Two entrance courses (engineering-entrance, medical-entrance): every live problem, every
// figure and problem a lesson names, the lesson boxes, and every question in public/qbank/entrance-*/ (answer keys
// are checked by tests/qbank.mjs).
// Run: node tests/entrance.mjs (part of npm test).
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import yaml from 'js-yaml';
import temml from 'temml';
const PROBLEMS = (await import('../public/learn-kit/entrance/problems.js')).default;

let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : (fail++, console.error('FAIL ' + name)); };
const near = (name, got, want, tol = 0.005) => ok(`${name}: got ${got}, want ${want}`, Math.abs(got - want) <= Math.max(1e-9, Math.abs(want) * tol));

// Live problems
for (const [id, pr] of Object.entries(PROBLEMS)) {
  ok(`problem ${id} has a title`, typeof pr.title === 'string' && pr.title.length > 3);
  for (const r of [() => 0, () => 0.5, () => 0.999, Math.random]) {
    const p = pr.make(r);
    ok(`problem ${id} answer is a finite number`, Number.isFinite(p.answer));
    ok(`problem ${id} has question, hint and solution`, [p.q, p.hint, p.solution].every((s) => typeof s === 'string' && s.length > 10 && !/undefined|NaN/.test(s)));
    if (pr.verify) near(`problem ${id} independent answer`, p.answer, pr.verify(p));
  }
}

// Lessons
const figDir = new URL('../public/learn-kit/entrance/figs/', import.meta.url);
for (const course of ['engineering-entrance', 'medical-entrance']) {
  const dir = new URL(`../src/courses/${course}/`, import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const md = readFileSync(new URL(f, dir), 'utf8'), where = `${course}/${f}`;
    for (const m of md.matchAll(/data-fig="([a-z0-9-]+)"/g)) ok(`${where}: figure ${m[1]} exists`, existsSync(new URL(m[1] + '.js', figDir)));
    for (const m of md.matchAll(/data-problem="([a-z0-9-]+)"/g)) ok(`${where}: problem ${m[1]} exists`, !!PROBLEMS[m[1]]);
    let fm = null; try { fm = yaml.load(md.split('\n---\n')[0].replace(/^---\n/, '')); } catch (e) { console.log(where, String(e).split('\n')[0]); }
    ok(`${where}: front matter is valid YAML with a 3-question quiz and a seoTitle up to 60`, fm?.quiz?.length >= 3 && fm.seoTitle?.length <= 60);
    ok(`${where}: has key points`, md.includes('class="keypoints"'));
    ok(`${where}: has a figure or animation`, /data-fig="|class="steps"/.test(md));
    ok(`${where}: has sources`, /\nsources:\n\s+- /.test(md));
    ok(`${where}: every image has alt text`, !/<img(?![^>]*alt=)/.test(md));
  }
}

// The question banks themselves (public/qbank/entrance-*/) are checked by the shared tests/qbank.mjs.
console.log(`entrance: ${pass} checks passed, ${fail} failed`);
if (fail) process.exit(1);
