// Checks for the IELTS course: band arithmetic against worked examples, every live problem with 4 seeds,
// and every lesson's front matter, kit boxes, figures and problems. Run: node tests/ielts.mjs (part of npm test).
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import yaml from 'js-yaml';
const B = await import('../public/learn-kit/ielts/bands.js');
const PROBLEMS = (await import('../public/learn-kit/ielts/problems.js')).default;

let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : (fail++, console.error('FAIL ' + name)); };
const eq = (name, got, want) => ok(`${name}: got ${got}, want ${want}`, got === want);

// Overall band rounding (official worked examples: .25 up to .5, .75 up to the next band)
eq('6.5 6.5 5 7', B.overall(6.5, 6.5, 5, 7), 6.5);
eq('4 3.5 4 4', B.overall(4, 3.5, 4, 4), 4);
eq('7 6.5 6 6', B.overall(7, 6.5, 6, 6), 6.5);
eq('6 6 6 6.5', B.overall(6, 6, 6, 6.5), 6);
eq('6.5 6.5 6.5 7 (6.625)', B.overall(6.5, 6.5, 6.5, 7), 6.5);
eq('7 7 7 7.5 (7.125)', B.overall(7, 7, 7, 7.5), 7);
eq('6.75 rounds up', B.overall(7, 7, 6.5, 6.5 + 0.5), 7);
// Raw scores
eq('listening 30', B.rawToBand(30, 'listening'), 7);
eq('listening 29', B.rawToBand(29, 'listening'), 6.5);
eq('academic 30', B.rawToBand(30, 'academic'), 7);
eq('general 30', B.rawToBand(30, 'general'), 6);
eq('general 40', B.rawToBand(40, 'general'), 9);
eq('rawFor 7 listening', B.rawFor(7, 'listening'), 30);
// CLB (IRCC chart)
eq('CLB L 8', B.clbFor('listening', 8), 9);
eq('CLB L 7.5', B.clbFor('listening', 7.5), 8);
eq('CLB R 7', B.clbFor('reading', 7), 9);
eq('CLB W 6', B.clbFor('writing', 6), 7);
eq('CLB S 5.5', B.clbFor('speaking', 5.5), 6);
eq('CLB L 4', B.clbFor('listening', 4), 0);

const rnds = [() => 0, () => 0.5, () => 0.999, Math.random];
for (const [id, pr] of Object.entries(PROBLEMS)) {
  ok(`problem ${id} has a title`, typeof pr.title === 'string' && pr.title.length > 3);
  for (const r of rnds) {
    const p = pr.make(r);
    ok(`problem ${id} answer is a finite number`, Number.isFinite(p.answer));
    ok(`problem ${id} has question, hint and solution`, [p.q, p.hint, p.solution].every((s) => typeof s === 'string' && s.length > 10 && !/undefined|NaN/.test(s)));
    if (pr.verify) ok(`problem ${id} independent answer (${p.answer} vs ${pr.verify(p)})`, Math.abs(p.answer - pr.verify(p)) <= Math.abs(p.answer) * 0.005 + 1e-9);
  }
}

const dir = new URL('../src/courses/ielts/', import.meta.url);
const figDir = new URL('../public/learn-kit/ielts/figs/', import.meta.url);
const syl = readFileSync(new URL('syllabus.ts', dir), 'utf8');
for (const f of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
  const md = readFileSync(new URL(f, dir), 'utf8');
  ok(`${f}: listed in the syllabus`, syl.includes(`'${f.replace(/\.md$/, '')}'`));
  for (const m of md.matchAll(/data-fig="([a-z0-9-]+)"/g)) ok(`${f}: figure ${m[1]} exists`, existsSync(new URL(m[1] + '.js', figDir)));
  for (const m of md.matchAll(/data-problem="([a-z0-9-]+)"/g)) ok(`${f}: problem ${m[1]} exists`, !!PROBLEMS[m[1]]);
  let fm = null; try { fm = yaml.load(md.split('\n---\n')[0].replace(/^---\n/, '')); } catch (e) { console.log(f, String(e).split('\n')[0]); }
  ok(`${f}: front matter is valid YAML with a 3-question quiz`, fm?.quiz?.length === 3 && (!fm.seoTitle || fm.seoTitle.length <= 60));
  fm?.quiz?.forEach((q, i) => ok(`${f}: quiz ${i + 1} answer exists`, q.ans < q.choices.length));
  ok(`${f}: summary fits a search snippet`, fm?.summary?.length <= 160);
  ok(`${f}: has key points`, md.includes('class="keypoints"'));
  ok(`${f}: has something to do (figure, steps, problem or practice)`, /data-fig="|class="steps"|data-problem="|class="qbank"/.test(md));
  for (const m of md.matchAll(/data-bank="([a-z-]+)"[^>]*data-topics="([a-z0-9,-]+)"/g)) for (const t of m[2].split(',')) ok(`${f}: bank topic ${m[1]}/${t} exists`, existsSync(new URL(`../public/qbank/${m[1]}/${t}.js`, import.meta.url)));
  ok(`${f}: has sources`, /\nsources:\n\s+- /.test(md));
  ok(`${f}: every image has alt text`, !/<img(?![^>]*alt=)/.test(md));
}
console.log(`ielts: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
