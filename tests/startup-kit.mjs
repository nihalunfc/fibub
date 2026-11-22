// Checks for the Start a startup lesson kit: every live problem (its numbers and its own answer), and that every
// kit figure and problem a lesson names exists. Lessons upgraded to the new standard (they contain a
// class="bigidea" box) must also have key points, a physical-meaning box, a step player and a live problem.
// Run: node tests/startup-kit.mjs (part of npm test).
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import yaml from 'js-yaml';
const PROBLEMS = (await import('../public/learn-kit/startup/problems.js')).default;

let pass = 0, fail = 0;
const near = (name, got, want, tol = 0.01) => {
  const ok = Math.abs(got - want) <= Math.max(Math.abs(want) * tol, 1e-9);
  ok ? pass++ : fail++;
  if (!ok) console.error(`FAIL ${name}: got ${got}, want ${want} (±${tol * 100}%)`);
};
const ok = (name, cond) => { cond ? pass++ : (fail++, console.error('FAIL ' + name)); };

const rnds = [() => 0, () => 0.5, () => 0.999, Math.random];
for (const [id, pr] of Object.entries(PROBLEMS)) {
  ok(`problem ${id} has a title`, typeof pr.title === 'string' && pr.title.length > 3);
  for (const r of rnds) {
    const p = pr.make(r);
    ok(`problem ${id} answer is a finite number`, Number.isFinite(p.answer));
    ok(`problem ${id} has question, hint and solution`, [p.q, p.hint, p.solution].every((s) => typeof s === 'string' && s.length > 10 && !/undefined|NaN/.test(s)));
    if (pr.verify) near(`problem ${id} independent answer`, p.answer, pr.verify(p), 0.005);
  }
}

const dir = new URL('../src/courses/startup/', import.meta.url);
const figDir = new URL('../public/learn-kit/startup/figs/', import.meta.url);
let upgraded = 0;
for (const f of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const md = readFileSync(new URL(f, dir), 'utf8');
  for (const m of md.matchAll(/data-fig="([a-z0-9-]+)"/g)) ok(`${f}: kit figure ${m[1]} exists`, existsSync(new URL(m[1] + '.js', figDir)));
  for (const m of md.matchAll(/data-problem="([a-z0-9-]+)"/g)) ok(`${f}: problem ${m[1]} exists`, !!PROBLEMS[m[1]]);
  let fm = null; try { fm = yaml.load(md.split('\n---\n')[0].replace(/^---\n/, '')); } catch (e) { console.log(f, String(e).split('\n')[0]); }
  ok(`${f}: front matter is valid YAML with a 3-question quiz`, fm?.quiz?.length === 3 && (!fm.seoTitle || fm.seoTitle.length <= 60));
  ok(`${f}: every image has alt text`, !/<img(?![^>]*alt=)/.test(md));
  if (!md.includes('class="bigidea"')) continue;
  upgraded++;
  ok(`${f}: has key points`, md.includes('class="keypoints"'));
  ok(`${f}: has a meaning box`, md.includes('class="meaning"'));
  ok(`${f}: has a step player (kit steps or su-steps)`, md.includes('class="steps"') || md.includes('class="su-steps"'));
  ok(`${f}: has a common mix-up box`, md.includes('class="myth"'));
  ok(`${f}: has an interactive figure`, /<!--fig:(?!country)[a-z0-9-]+-->/.test(md) || md.includes('class="su-check"'));
  ok(`${f}: has a live problem`, /data-problem="/.test(md));
  ok(`${f}: has sources`, /\nsources:\n\s+- /.test(md));
}
console.log(`startup-kit: ${upgraded} upgraded lessons; ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
