// Checks for the Sky watching and Astronomy lesson kit: every live problem (its numbers and its own answer), and that
// every kit figure and problem a lesson names exists. Lessons on the new standard (they contain a class="bigidea" box)
// must also have key points, a physical-meaning box, a step player, a live problem, a mix-up box and sources.
// Run: node tests/astro-kit.mjs (part of npm test).
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import yaml from 'js-yaml';

let pass = 0, fail = 0;
const near = (name, got, want, tol = 0.005) => {
  const ok = Math.abs(got - want) <= Math.max(Math.abs(want) * tol, 1e-9);
  ok ? pass++ : fail++;
  if (!ok) console.error(`FAIL ${name}: got ${got}, want ${want} (±${tol * 100}%)`);
};
const ok = (name, cond) => { cond ? pass++ : (fail++, console.error('FAIL ' + name)); };
const rnds = [() => 0, () => 0.5, () => 0.999, Math.random, Math.random];

for (const course of ['astronomy', 'sky-watching']) {
  const PROBLEMS = (await import(`../public/learn-kit/${course}/problems.js`)).default;
  for (const [id, pr] of Object.entries(PROBLEMS)) {
    ok(`${course} problem ${id} has a title`, typeof pr.title === 'string' && pr.title.length > 3);
    for (const r of rnds) {
      const p = pr.make(r);
      ok(`${course} problem ${id} answer is a finite number`, Number.isFinite(p.answer));
      ok(`${course} problem ${id} has question, hint and solution`, [p.q, p.hint, p.solution].every((s) => typeof s === 'string' && s.length > 10 && !/undefined|NaN|Infinity/.test(s)));
      if (pr.verify) near(`${course} problem ${id} independent answer`, p.answer, pr.verify(p), p.vtol ?? 0.005);
      else ok(`${course} problem ${id} has verify`, false);
    }
  }
  const dir = new URL(`../src/courses/${course}/`, import.meta.url);
  const figDir = new URL(`../public/learn-kit/${course}/figs/`, import.meta.url);
  let upgraded = 0, total = 0;
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    total++;
    const md = readFileSync(new URL(f, dir), 'utf8');
    for (const m of md.matchAll(/data-fig="([a-z0-9-]+)"/g)) ok(`${course}/${f}: kit figure ${m[1]} exists`, existsSync(new URL(m[1] + '.js', figDir)));
    for (const m of md.matchAll(/data-problem="([a-z0-9-]+)"/g)) ok(`${course}/${f}: problem ${m[1]} exists`, !!PROBLEMS[m[1]]);
    let fm = null; try { fm = yaml.load(md.split('\n---\n')[0].replace(/^---\n/, '')); } catch (e) { console.log(f, String(e).split('\n')[0]); }
    ok(`${course}/${f}: front matter is valid YAML with a 3-question quiz`, fm?.quiz?.length === 3 && (!fm.seoTitle || fm.seoTitle.length <= 60));
    ok(`${course}/${f}: every image has alt text`, !/<img(?![^>]*alt=)/.test(md));
    if (!md.includes('class="bigidea"')) continue;
    upgraded++;
    for (const [cls, label] of [['keypoints', 'key points'], ['meaning', 'a physical-meaning box'], ['steps', 'a step player'], ['myth', 'a common mix-up box']])
      ok(`${course}/${f}: has ${label}`, md.includes(`class="${cls}"`));
    ok(`${course}/${f}: has a live problem`, /data-problem="/.test(md));
    ok(`${course}/${f}: has sources`, /\nsources:\n\s+- /.test(md));
    ok(`${course}/${f}: says what to read first`, /read first/i.test(md.slice(0, md.indexOf('class="bigidea"'))));
  }

  // Glossary and cheat sheet: every term and formula must point at a real lesson.
  const syl = readFileSync(new URL(`../src/courses/${course}/syllabus.ts`, import.meta.url), 'utf8');
  const slugs = new Set([...syl.matchAll(/\['[\d.]+', '([a-z0-9-]+)'/g)].map((m) => m[1]));
  const gl = readFileSync(new URL(`../src/courses/${course}/glossary.ts`, import.meta.url), 'utf8');
  const glSlugs = [...gl.matchAll(/'([a-z0-9-]+)'\],\n/g)].map((m) => m[1]);
  ok(`${course} glossary has terms`, glSlugs.length > 50);
  for (const s of glSlugs) ok(`${course} glossary lesson ${s} exists`, slugs.has(s));
  const cs = readFileSync(new URL(`../src/pages/learn/courses/${course}/cheat-sheet.astro`, import.meta.url), 'utf8');
  const csSlugs = [...cs.matchAll(/"([a-z0-9-]+)"\],\n/g)].map((m) => m[1]);
  ok(`${course} cheat sheet has formulas`, csSlugs.length > 30);
  for (const s of csSlugs) ok(`${course} cheat sheet lesson ${s} exists`, slugs.has(s));
  console.log(`astro-kit ${course}: ${upgraded}/${total} lessons upgraded, ${glSlugs.length} glossary terms, ${csSlugs.length} formulas`);
}
console.log(`astro-kit: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
