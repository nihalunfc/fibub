// Checks for the NCERT study courses (src/courses/ncert.ts): every live problem (4 seeds + verify), unique problem
// ids, and every lesson: figures, problems and embedded tools exist (tools must be live), the lesson boxes, the quiz
// and seoTitle, and how rich a chapter lesson is (at least 6 figures, step players or tools, and 2 live problems).
// Practice pages must carry the chapter's question bank set. The banks themselves are checked by tests/qbank.mjs.
// Run: node tests/ncert.mjs (part of npm test).
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import yaml from 'js-yaml';

let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : (fail++, console.error('FAIL ' + name)); };
const near = (name, got, want, tol = 0.005) => ok(`${name}: got ${got}, want ${want}`, Math.abs(got - want) <= Math.max(1e-9, Math.abs(want) * tol));

// Live problems: ids unique across chapter files, every file listed in the index.
const pdir = new URL('../public/learn-kit/ncert/problems/', import.meta.url);
const pfiles = readdirSync(pdir).filter((f) => f.endsWith('.js') && f !== 'index.js' && !f.startsWith('_'));
const index = readFileSync(new URL('index.js', pdir), 'utf8');
const PROBLEMS = {};
for (const f of pfiles) {
  ok(`problems/${f} is listed in problems/index.js (run node scripts/ncert-index.mjs)`, index.includes(`'./${f}'`));
  const mod = (await import(new URL(f, pdir))).default;
  for (const [id, pr] of Object.entries(mod)) { ok(`problem ${id} is defined once (${f})`, !PROBLEMS[id]); PROBLEMS[id] = pr; }
}
for (const [id, pr] of Object.entries(PROBLEMS)) {
  ok(`problem ${id} has a title`, typeof pr.title === 'string' && pr.title.length > 3);
  for (const r of [() => 0, () => 0.5, () => 0.999, Math.random]) {
    let p;
    try { p = pr.make(r); } catch (e) { ok(`problem ${id} runs: ${e.message}`, false); continue; }
    ok(`problem ${id} answer is a finite number`, Number.isFinite(p.answer));
    ok(`problem ${id} has question, hint and solution`, [p.q, p.hint, p.solution].every((s) => typeof s === 'string' && s.length > 10 && !/undefined|NaN/.test(s)));
    if (pr.verify) near(`problem ${id} independent answer`, p.answer, pr.verify(p));
  }
}

// Which tools are live (src/tools/<id>/guide.md: status: live).
const liveTool = (id) => { const f = new URL(`../src/tools/${id}/guide.md`, import.meta.url); return existsSync(f) && /\nstatus:\s*live/.test(readFileSync(f, 'utf8')); };

const figDir = new URL('../public/learn-kit/ncert/figs/', import.meta.url);
for (const f of readdirSync(figDir).filter((f) => f.endsWith('.js'))) ok(`figs/${f} has a default export`, /export default/.test(readFileSync(new URL(f, figDir), 'utf8')));
const courses = readdirSync(new URL('../src/courses/', import.meta.url)).filter((d) => d.startsWith('ncert-class-'));
let lessons = 0;
for (const course of courses) {
  const dir = new URL(`../src/courses/${course}/`, import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    lessons++;
    const md = readFileSync(new URL(f, dir), 'utf8'), where = `${course}/${f}`, practice = f.endsWith('-practice.md');
    for (const m of md.matchAll(/data-fig="(@?)([a-z0-9-]+)"/g)) ok(`${where}: figure ${m[1]}${m[2]} exists`, existsSync(new URL(m[2] + '.js', m[1] ? new URL('../public/learn-kit/viz/', import.meta.url) : figDir)));
    for (const m of md.matchAll(/data-problem="([a-z0-9-]+)"/g)) ok(`${where}: problem ${m[1]} exists`, !!PROBLEMS[m[1]]);
    const tools = [...md.matchAll(/<!--\s*fig:tool\s+([a-z0-9-]+)\s*-->/g)].map((m) => m[1]);
    for (const t of tools) ok(`${where}: embedded tool ${t} is live`, liveTool(t));
    for (const m of md.matchAll(/<!--\s*fig:([a-z0-9-]+)/g)) ok(`${where}: <!--fig:${m[1]}--> is a known Astro figure (only "tool")`, m[1] === 'tool');
    let fm = null; try { fm = yaml.load(md.split('\n---\n')[0].replace(/^---\n/, '')); } catch (e) { console.log(where, String(e).split('\n')[0]); }
    ok(`${where}: front matter is valid YAML with a 3-question quiz and a seoTitle up to 60`, fm?.quiz?.length >= 3 && fm.seoTitle?.length <= 60);
    ok(`${where}: summary up to 160 characters`, fm?.summary?.length <= 160);
    ok(`${where}: has key points`, md.includes('class="keypoints"'));
    ok(`${where}: has sources`, /\nsources:\n\s+- /.test(md));
    ok(`${where}: every image has alt text`, !/<img(?![^>]*alt=)/.test(md));
    const visuals = (md.match(/data-fig="|class="steps"/g) ?? []).length + tools.length;
    const problems = (md.match(/data-problem="/g) ?? []).length;
    if (practice) {
      const q = md.match(/<div class="qbank" data-bank="([a-z0-9-]+)" data-topics="([a-z0-9-,]+)"/);
      ok(`${where}: practice page has a question bank set`, !!q);
      if (q) {
        const bank = new URL(`../public/qbank/${q[1]}/`, import.meta.url);
        for (const t of q[2].split(',')) ok(`${where}: bank ${q[1]} has topic ${t}`, existsSync(new URL(`${t}.js`, bank)));
      }
      ok(`${where}: practice page has at least 2 live problems`, problems >= 2);
    } else {
      ok(`${where}: chapter has at least 6 figures, step players or tools (has ${visuals})`, visuals >= 6);
      ok(`${where}: chapter has at least 2 live problems (has ${problems})`, problems >= 2);
      ok(`${where}: chapter has a physical-meaning or big-idea box`, /class="(meaning|bigidea)"/.test(md));
    }
  }
}
console.log(`ncert: ${pass} checks passed, ${fail} failed (${lessons} lessons, ${Object.keys(PROBLEMS).length} problems)`);
if (fail) process.exit(1);
