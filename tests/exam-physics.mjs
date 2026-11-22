// Checks for the university physics exam courses (IIT JAM, GATE, CSIR NET Physics): every lesson's front matter and
// boxes, that every figure, live problem and question bank topic it names exists, and every live problem's answer
// against its own verify(). The question bank itself is checked by tests/qbank.mjs. Run: node tests/exam-physics.mjs
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import yaml from 'js-yaml';

let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : (fail++, console.error('FAIL ' + name)); };
const idx = (await import('../public/qbank/physics/index.js')).default;
const topics = new Set(idx.units.flatMap((u) => u.topics.map((t) => t.id)));

for (const id of ['iit-jam-physics', 'gate-physics', 'csir-net-physics']) {
  const kit = new URL(`../public/learn-kit/${id}/`, import.meta.url);
  const probFile = new URL('problems.js', kit);
  const PROBLEMS = existsSync(probFile) ? (await import(probFile.href)).default : {};
  const rnds = [() => 0, () => 0.5, () => 0.999, Math.random];
  for (const [pid, pr] of Object.entries(PROBLEMS)) {
    ok(`${id} problem ${pid} has a title`, typeof pr.title === 'string' && pr.title.length > 3);
    for (const r of rnds) {
      const p = pr.make(r);
      ok(`${id} problem ${pid} answer finite`, Number.isFinite(p.answer));
      ok(`${id} problem ${pid} has question, hint and solution`, [p.q, p.hint, p.solution].every((s) => typeof s === 'string' && s.length > 10 && !/undefined|NaN/.test(s)));
      if (pr.verify) { const v = pr.verify(p); ok(`${id} problem ${pid} verify ${v} vs ${p.answer}`, Math.abs(v - p.answer) <= Math.max(1e-9, Math.abs(v) * 0.005)); }
    }
  }
  const syl = readFileSync(new URL(`../src/courses/${id}/syllabus.ts`, import.meta.url), 'utf8');
  const dir = new URL(`../src/courses/${id}/`, import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const w = `${id}/${f}`;
    const md = readFileSync(new URL(f, dir), 'utf8');
    ok(`${w}: listed in syllabus`, syl.includes(`'${f.slice(0, -3)}'`));
    for (const m of md.matchAll(/data-fig="([a-z0-9-]+)"/g)) ok(`${w}: figure ${m[1]} exists`, existsSync(new URL(`figs/${m[1]}.js`, kit)));
    for (const m of md.matchAll(/data-problem="([a-z0-9-]+)"/g)) ok(`${w}: problem ${m[1]} exists`, !!PROBLEMS[m[1]]);
    for (const m of md.matchAll(/data-topics="([^"]+)"/g)) for (const t of m[1].split(',')) ok(`${w}: bank topic ${t} exists`, topics.has(t.trim()));
    let fm = null; try { fm = yaml.load(md.split('\n---\n')[0].replace(/^---\n/, '')); } catch (e) { console.error(w, String(e).split('\n')[0]); }
    ok(`${w}: front matter valid with a 3-question quiz`, fm?.quiz?.length === 3 && fm.quiz.every((q) => q.ans < q.choices.length));
    ok(`${w}: seoTitle at most 60`, !fm?.seoTitle || fm.seoTitle.length <= 60);
    ok(`${w}: has key points`, md.includes('class="keypoints"'));
    ok(`${w}: has a meaning box`, md.includes('class="meaning"'));
    ok(`${w}: has practice from the bank`, md.includes('class="qbank"'));
    ok(`${w}: has sources`, /\nsources:\n\s+- /.test(md));
    ok(`${w}: images have alt text`, !/<img(?![^>]*alt=)/.test(md));
  }
}
console.log(`exam physics courses: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
