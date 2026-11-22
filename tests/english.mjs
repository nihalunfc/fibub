// Checks for the English exam courses (CELPIP, TOEFL): score and plan rules, every practice set (ids, answers,
// options, groups, word-order chips), and every lesson (figures and sets exist, quiz, key points, sources).
// Run: node tests/english.mjs (part of npm test).
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import yaml from 'js-yaml';
const S = await import('../public/learn-kit/english/scores.js');
const { makePlan } = await import('../public/learn-kit/english/plan-core.js');
const { checkItem, norm } = await import('../public/learn-kit/english/check.js');

let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : (fail++, console.error('FAIL ' + name)); };
const eq = (name, got, want) => ok(`${name}: got ${got}, want ${want}`, got === want);

// Score rules (IRCC CRS table, ETS overall-band rule)
eq('CELPIP 11 → CLB', S.celpipToClb(11), 10);
eq('CELPIP 7 → CLB', S.celpipToClb(7), 7);
eq('CELPIP 3 → CLB', S.celpipToClb(3), 0);
eq('CRS CLB 9 single', S.crsFirstLanguage(9), 31);
eq('CRS CLB 10 spouse', S.crsFirstLanguage(10, true), 32);
eq('CRS max single', S.crsTotal([10, 10, 10, 10]), 136);
eq('CRS max spouse', S.crsTotal([10, 10, 10, 10], true), 128);
eq('CRS CLB 7 x4', S.crsTotal([7, 7, 7, 7]), 68);
eq('TOEFL ETS example 5.125', S.toeflOverall([5.5, 5, 5, 5]), 5);
eq('TOEFL 4.625 → 4.5', S.toeflOverall([5, 4.5, 4, 5]), 4.5);
eq('TOEFL 4.25 → 4.5', S.toeflOverall([4, 4.5, 4, 4.5]), 4.5);
eq('CEFR for 4', S.toeflCefr(4), 'B2');
eq('CEFR for 5.5', S.toeflCefr(5.5), 'C1');

// Study plans: one row per week, weeks 1..n in order, weakest skill gets at least as many weeks as any other
for (const mode of ['celpip', 'toefl']) for (const weeks of [2, 3, 4, 6, 8, 12, 16]) for (const weak of ['listening', 'reading', 'writing', 'speaking']) {
  const p = makePlan(weeks, 6, weak, mode);
  ok(`${mode} plan ${weeks}w ${weak}: one row per week`, p.length === weeks && p.every((r, i) => r.week === i + 1));
  const count = (s) => p.filter((r) => r.phase === s).length;
  ok(`${mode} plan ${weeks}w ${weak}: weakest skill gets the most weeks`, ['listening', 'reading', 'writing', 'speaking'].every((s) => count(weak) >= count(s)));
}

// Answer checking
ok('text check ignores case and full stop', checkItem({ type: 'text', answer: ['Grade'] }, 'grade.'));
ok('text check respects maxWords', !checkItem({ type: 'text', answer: ['T4'], maxWords: 1 }, 'a T4 slip'));
ok('order check', checkItem({ type: 'order', answer: ['I think it is in room 204'] }, 'I think it is in room 204'));

// Practice sets
const courses = ['celpip', 'toefl'];
for (const c of courses) {
  const setDir = new URL(`../public/learn-kit/${c}/sets/`, import.meta.url);
  const ids = new Set();
  for (const f of readdirSync(setDir).filter((f) => f.endsWith('.js'))) {
    const set = (await import(new URL(f, setDir))).default;
    ok(`${c}/${f}: has a title and items`, typeof set.title === 'string' && set.items?.length >= 4);
    for (const it of set.items) {
      const tag = `${c}/${f} ${it.id}`;
      ok(`${tag}: unique id`, !ids.has(it.id)); ids.add(it.id);
      ok(`${tag}: has question and solution`, [it.q, it.sol].every((s) => typeof s === 'string' && s.length > 3 && !/undefined|NaN/.test(s)));
      if (it.group) ok(`${tag}: group exists`, !!set.groups?.[it.group]);
      if (it.type === 'mcq') {
        ok(`${tag}: mcq answer is a valid index`, Number.isInteger(it.answer) && it.answer >= 0 && it.answer < it.options.length);
        ok(`${tag}: mcq options distinct`, new Set(it.options.map(norm)).size === it.options.length && it.options.length >= 2);
      } else if (it.type === 'text') {
        ok(`${tag}: text answers`, Array.isArray(it.answer) && it.answer.length > 0 && it.answer.every((a) => norm(a)));
        if (it.maxWords) ok(`${tag}: first answer fits maxWords`, norm(it.answer[0]).split(' ').length <= it.maxWords);
      } else if (it.type === 'order') {
        const chips = it.options.map(norm).sort().join('|');
        ok(`${tag}: every accepted sentence uses exactly the chips`, it.answer.every((a) => norm(a).split(' ').sort().join('|') === chips));
      } else ok(`${tag}: known type`, false);
    }
    for (const [k, g] of Object.entries(set.groups || {})) {
      ok(`${c}/${f} group ${k}: has a passage or audio`, !!(g.passage || g.audio?.length));
      if (g.audio) ok(`${c}/${f} group ${k}: audio lines have text`, g.audio.every((l) => typeof l.text === 'string' && l.text.length > 2));
      ok(`${c}/${f} group ${k}: used by an item`, set.items.some((it) => it.group === k));
    }
  }
  // Lessons
  const dir = new URL(`../src/courses/${c}/`, import.meta.url);
  const figDir = new URL(`../public/learn-kit/${c}/figs/`, import.meta.url);
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const md = readFileSync(new URL(f, dir), 'utf8');
    for (const m of md.matchAll(/data-fig="([a-z0-9-]+)"/g)) ok(`${c}/${f}: figure ${m[1]} exists`, existsSync(new URL(m[1] + '.js', figDir)));
    for (const m of md.matchAll(/data-set="([a-z0-9-]+)"/g)) ok(`${c}/${f}: set ${m[1]} exists`, existsSync(new URL(m[1] + '.js', setDir)));
    let fm = null; try { fm = yaml.load(md.split('\n---\n')[0].replace(/^---\n/, '')); } catch (e) { console.log(String(e).split('\n')[0]); }
    ok(`${c}/${f}: front matter is valid YAML with a 3-question quiz`, fm?.quiz?.length === 3 && fm.seoTitle?.length <= 60 && fm.quiz.every((q) => q.ans < q.choices.length));
    ok(`${c}/${f}: has key points`, md.includes('class="keypoints"'));
    ok(`${c}/${f}: has practice (a drill, timer or writing pad)`, /data-fig="(drill|speak|write)"/.test(md));
    ok(`${c}/${f}: has sources`, /\nsources:\n\s+- /.test(md));
    ok(`${c}/${f}: every image has alt text`, !/<img(?![^>]*alt=)/.test(md));
  }
}
console.log(`english courses: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
