// Checks for the Plus Two entrance courses (engineering-entrance, medical-entrance): every live problem, every
// figure and problem a lesson names, the lesson boxes, and every question in public/qbank/entrance-*/ (answer keys
// in range, distinct options, maths that parses, templates that run for 200 seeds and agree with their verify).
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

// Question banks
const LV = new Set([1, 2, 3, 4, 5]), TYPES = new Set(['mcq', 'msq', 'nat']);
const FORMATS = new Set(['single', 'multi', 'integer', 'numeric', 'assertion', 'statements', 'match', 'passage']);
const EX = new Set(['keam', 'cusat', 'comedk', 'jee-main', 'jee-adv', 'neet']);
let nItems = 0, nGens = 0;
function maths(where, html) {
  if (typeof html !== 'string') return;
  const s = html.replace(/\\\$/g, ''), re = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g;
  ok(`${where}: $ signs pair up`, !(s.replace(re, '').match(/\$/g) || []).length);
  let m; while ((m = re.exec(s))) { let good = true; try { temml.renderToString(m[1] ?? m[2], { throwOnError: true }); } catch { good = false; } ok(`${where}: TeX parses: ${(m[1] ?? m[2]).slice(0, 50)}`, good); }
}
for (const bank of readdirSync(new URL('../public/qbank/', import.meta.url)).filter((d) => d.startsWith('entrance-'))) {
  const dir = new URL(`../public/qbank/${bank}/`, import.meta.url);
  const index = (await import(new URL('index.js', dir))).default;
  const topics = new Set(index.units.flatMap((u) => u.topics.map((t) => t.id)));
  const ids = new Set();
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.js') && f !== 'index.js' && !f.startsWith('_') && !f.endsWith('.gen.js'))) {
    const mod = (await import(pathToFileURL(new URL(f, dir).pathname).href)).default, topic = f.replace(/\.js$/, '');
    ok(`${bank}/${f}: topic matches file and index`, mod.topic === topic && topics.has(topic));
    const item = (it, where, isGen) => {
      if (!isGen) { ok(`${where}: unique id`, it.id && !ids.has(it.id)); ids.add(it.id); ok(`${where}: level`, LV.has(it.level)); }
      ok(`${where}: type`, TYPES.has(it.type));
      ok(`${where}: format`, !it.format || FORMATS.has(it.format));
      ok(`${where}: exam tags`, (it.exams ?? []).every((e) => EX.has(e)));
      ok(`${where}: question and solution`, !!it.q && !!it.sol);
      const opts = it.options ?? (it.group && mod.groups?.[it.group]?.options);
      if (it.type === 'mcq' || it.type === 'msq') {
        const ans = it.type === 'mcq' ? [it.answer] : it.answer;
        ok(`${where}: options distinct`, Array.isArray(opts) && opts.length >= 2 && new Set(opts.map(String)).size === opts.length);
        ok(`${where}: answer key in range`, (it.type === 'msq' ? Array.isArray(ans) && ans.length > 0 : Number.isInteger(it.answer)) && ans.every((a) => a >= 0 && a < (opts?.length ?? 0)));
        (opts ?? []).forEach((o, i) => maths(`${where} option ${i}`, o));
      }
      if (it.type === 'nat') ok(`${where}: numeric answer and tolerance`, Number.isFinite(it.answer) && typeof it.tol === 'number');
      ok(`${where}: no NaN or undefined`, !/NaN|undefined/.test(JSON.stringify([it.q, it.sol, opts])));
      maths(`${where} q`, it.q); maths(`${where} sol`, it.sol);
    };
    for (const [k, g] of Object.entries(mod.groups ?? {})) [g.passage, ...(g.list1 ?? []), ...(g.list2 ?? [])].forEach((x) => maths(`${bank}/${f} group ${k}`, x));
    for (const it of mod.items ?? []) { item(it, `${bank}/${f} ${it.id}`, false); if (it.group) ok(`${bank}/${f} ${it.id}: group exists`, !!mod.groups?.[it.group]); nItems++; }
    for (const gen of mod.gens ?? []) {
      ok(`${bank}/${f} ${gen.id}: unique id and level`, gen.id && !ids.has(gen.id) && LV.has(gen.level)); ids.add(gen.id); nGens++;
      for (let seed = 1; seed <= 200; seed++) {
        let s = (seed * 2654435761) % 4294967296; const rng = () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
        let p; try { p = gen.make(rng); } catch (e) { ok(`${bank}/${f} ${gen.id}~${seed} runs: ${e.message}`, false); break; }
        const before = fail; item({ ...gen, ...p }, `${bank}/${f} ${gen.id}~${seed}`, true);
        if (gen.verify) { let v; try { v = gen.verify(p); } catch (e) { v = `error: ${e.message}`; } ok(`${bank}/${f} ${gen.id}~${seed}: verify agrees`, gen.type === 'nat' ? Math.abs(v - p.answer) <= (p.tol ?? 0) + 1e-9 : JSON.stringify(v) === JSON.stringify(p.answer)); }
        if (fail > before) break;
      }
    }
  }
}
console.log(`entrance: ${pass} checks passed, ${fail} failed (${nItems} questions, ${nGens} templates)`);
if (fail) process.exit(1);
