// Converts the lesson drill sets of the CELPIP and TOEFL courses (public/learn-kit/<course>/sets/*.js) into qbank banks
// (public/qbank/<course>/index.js + one topic file per set). The drill sets stay where they are: lessons keep using
// them (they have exam-once and transcript lock); the banks feed the practice rooms.
// Topic id = set id. Units = the course's modules (src/courses/<course>/syllabus.ts); a set goes under the module of the
// first lesson (in syllabus order) that embeds it with data-set="<id>". Item ids are kept. Levels are kept where the
// source has one, else 2. `$` is written as \$ (the bank treats $...$ as maths). Group `audio` keeps { who, text }.
// Run: node scripts/courses/sets-to-qbank.mjs [celpip|toefl]
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const root = new URL('../../', import.meta.url);
const only = process.argv.slice(2);

// ---- where each set belongs: skill and part (CELPIP) or task (TOEFL) ----
const SKILL = { listening: 'Listening', reading: 'Reading', writing: 'Writing', speaking: 'Speaking', test: 'The test, scores and test week' };
const CONF = {
  celpip: {
    name: 'CELPIP practice', header: [
      'CELPIP question bank (fibub, original practice material; nothing is copied from the official test or its practice material).',
      'Used by the CELPIP course (/learn/courses/celpip/) and its practice room. Made from the lesson drill sets in public/learn-kit/celpip/sets/',
      'by scripts/courses/sets-to-qbank.mjs. Levels: 1 about CLB 5, 2 about CLB 6, 3 about CLB 7, 4 about CLB 9, 5 about CLB 10 and above.',
    ],
    exams: { general: 'CELPIP-General', ls: 'CELPIP-General LS' }, examTags: ['general', 'ls'],
    facetKey: 'part', facetLabel: 'Part or task',
    facetValues: { 1: 'Part or task 1', 2: 'Part or task 2', 3: 'Part or task 3', 4: 'Part or task 4', 5: 'Part or task 5', 6: 'Part or task 6', 7: 'Task 7', 8: 'Task 8' },
    map: {
      canadian: ['test'], diagnostic: ['test'], format: ['test'], taste: ['test'], testday: ['test'], scores: ['test'],
      'm6-after': ['test'], 'm6-mock': ['test'], 'm6-score': ['test'], 'm6-week': ['test'],
      lp1: ['listening', 1], lp2: ['listening', 2], lp3: ['listening', 3], lp4: ['listening', 4], lp5: ['listening', 5], lp6: ['listening', 6],
      lstrat: ['listening'], ltraps: ['listening'],
      rp1: ['reading', 1], rp2: ['reading', 2], rp3: ['reading', 3], rp4: ['reading', 4], rstrat: ['reading'], rvocab: ['reading'],
      'w-email': ['writing', 1], 'w-tone': ['writing', 1], 'w-survey': ['writing', 2],
      'w-grammar': ['writing'], 'w-link': ['writing'], 'w-rating': ['writing'], 'w-timing': ['writing'], 'w-vocab': ['writing'],
      's-advice': ['speaking', 1], 's-exp': ['speaking', 2], 's-scene': ['speaking', 3], 's-pred': ['speaking', 4],
      's-compare': ['speaking', 5], 's-difficult': ['speaking', 6], 's-opinion': ['speaking', 7], 's-unusual': ['speaking', 8],
      's-fluency': ['speaking'], 's-rating': ['speaking'],
    },
  },
  toefl: {
    name: 'TOEFL practice', header: [
      'TOEFL iBT question bank (fibub, original practice material; nothing is copied from ETS tests or practice material).',
      'Used by the TOEFL course (/learn/courses/toefl/) and its practice room. Made from the lesson drill sets in public/learn-kit/toefl/sets/',
      'by scripts/courses/sets-to-qbank.mjs. Levels follow the 2026 band scale: 1 about band 2 to 3, 2 about band 3 to 4, 3 about band 4 to 5, 4 about band 5, 5 about band 6.',
    ],
    exams: { ibt: 'TOEFL iBT' }, examTags: ['ibt'],
    facetKey: 'task', facetLabel: 'Task',
    facetValues: {
      'complete-words': 'Complete the Words', 'daily-life': 'Read in Daily Life', 'academic-passage': 'Read an Academic Passage',
      'choose-response': 'Listen and Choose a Response', conversation: 'Listen to a Conversation', announcement: 'Listen to an Announcement', 'academic-talk': 'Listen to an Academic Talk',
      'build-sentence': 'Build a Sentence', email: 'Write an Email', discussion: 'Write for an Academic Discussion',
      'listen-repeat': 'Listen and Repeat', interview: 'Take an Interview',
    },
    map: {
      adaptive: ['test'], bands: ['test'], diagnostic: ['test'], format: ['test'], taste: ['test'], testday: ['test'],
      'm6-mock': ['test'], 'm6-send': ['test'], 'm6-week': ['test'],
      rcw: ['reading', 'complete-words'], rcwp: ['reading', 'complete-words'], rwb: ['reading', 'complete-words'],
      rdl: ['reading', 'daily-life'], rap: ['reading', 'academic-passage'], rqt: ['reading'], rspeed: ['reading'],
      lcr: ['listening', 'choose-response'], lconv: ['listening', 'conversation'], lann: ['listening', 'announcement'], ltalk: ['listening', 'academic-talk'],
      lnotes: ['listening'], lskills: ['listening'],
      'w-bas': ['writing', 'build-sentence'], 'w-qwo': ['writing', 'build-sentence'], 'w-email': ['writing', 'email'], 'w-disc': ['writing', 'discussion'],
      'w-grammar': ['writing'], 'w-score': ['writing'],
      's-lr': ['speaking', 'listen-repeat'], 's-int': ['speaking', 'interview'], 's-pron': ['speaking'], 's-struct': ['speaking'], 's-score': ['speaking'],
    },
  },
};

// `$` would start maths; the bank wants a real dollar sign written \$
const esc = (s) => (typeof s === 'string' ? s.replace(/(^|[^\\])\$/g, '$1\\$').replace(/(^|[^\\])\$/g, '$1\\$') : s);

// ---- syllabus: modules and lesson order (read as text) ----
function readSyllabus(course) {
  const src = readFileSync(new URL(`src/courses/${course}/syllabus.ts`, root), 'utf8');
  const modules = []; let cur = null;
  for (const line of src.split('\n')) {
    const m = line.match(/\{\s*n:\s*(\d+),\s*name:\s*'((?:[^'\\]|\\.)*)'/);
    if (m) { cur = { n: +m[1], name: m[2].replace(/\\'/g, "'"), lessons: [] }; modules.push(cur); continue; }
    const l = line.match(/^\s*\['([\d.]+)',\s*'([a-z0-9-]+)',/);
    if (l && cur) cur.lessons.push(l[2]);
  }
  return modules;
}
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const NAMES = { 'celpip/taste': 'A first taste of CELPIP listening', 'toefl/taste': 'A first taste: choose a response', 'toefl/s-int': 'Take an Interview' };
const topicName = (course, id, title) => {
  let t = NAMES[`${course}/${id}`] ?? title;
  if (course === 'celpip') t = t.replace(/^Part (\d) practice: /, 'Listening Part $1: ').replace(/^Task (\d): /, 'Speaking Task $1: ');
  return t.charAt(0).toUpperCase() + t.slice(1);
};

const report = {};
for (const course of Object.keys(CONF)) {
  if (only.length && !only.includes(course)) continue;
  const C = CONF[course];
  const modules = readSyllabus(course);
  const order = modules.flatMap((m) => m.lessons.map((l) => [l, m]));
  const pos = new Map(order.map(([l], i) => [l, i]));
  // which lessons embed which set
  const embeds = {};
  const lessonDir = new URL(`src/courses/${course}/`, root);
  for (const f of readdirSync(lessonDir).filter((f) => f.endsWith('.md'))) {
    for (const m of readFileSync(new URL(f, lessonDir), 'utf8').matchAll(/data-set="([a-z0-9-]+)"/g)) (embeds[m[1]] ??= new Set()).add(f.slice(0, -3));
  }
  const setDir = new URL(`public/learn-kit/${course}/sets/`, root);
  const outDir = new URL(`public/qbank/${course}/`, root);
  mkdirSync(outDir, { recursive: true });
  const topics = []; const skipped = []; let total = 0; const seenIds = new Set();
  for (const f of readdirSync(setDir).filter((f) => f.endsWith('.js')).sort()) {
    const id = f.slice(0, -3);
    const set = (await import(pathToFileURL(new URL(f, setDir).pathname).href)).default;
    const [skill, part] = C.map[id] ?? (() => { throw new Error(`${course}/${id}: no skill mapping`); })();
    const lessons = [...(embeds[id] ?? [])].filter((l) => pos.has(l)).sort((a, b) => pos.get(a) - pos.get(b));
    const first = lessons[0];
    const mod = first ? order[pos.get(first)][1] : modules[modules.length - 1];
    if (!first) skipped.push(`${id}: not embedded in any lesson; placed in the last module`);
    // groups
    const groups = {};
    for (const [k, g] of Object.entries(set.groups ?? {})) {
      const o = {};
      if (g.title) o.title = esc(g.title);
      if (g.passage) o.passage = esc(g.passage);
      if (g.audio) o.audio = g.audio.map((l) => ({ who: l.who, text: l.text }));
      groups[k] = o;
    }
    const items = [];
    for (const it of set.items) {
      if (seenIds.has(it.id)) { skipped.push(`${it.id}: duplicate id`); continue; }
      if (!['mcq', 'text', 'order'].includes(it.type)) { skipped.push(`${it.id}: unknown type ${it.type}`); continue; }
      seenIds.add(it.id);
      const o = { id: it.id, type: it.type, level: [1, 2, 3, 4, 5].includes(it.level) ? it.level : 2, exams: C.examTags,
        facets: { skill, ...(part != null ? { [C.facetKey]: String(part) } : {}) } };
      if (it.group) o.group = it.group;
      o.q = esc(it.q);
      if (it.options) o.options = it.type === 'order' ? it.options : it.options.map(esc);
      o.answer = it.type === 'text' && it.maxWords ? it.answer.filter((a) => String(a).trim().split(/\s+/).length <= it.maxWords) : it.answer;
      if (it.maxWords) o.maxWords = it.maxWords;
      o.sol = esc(it.sol);
      if (it.trap) o.trap = esc(it.trap);
      items.push(o);
    }
    // spread MCQ answer letters: rotate each MCQ's options (deterministically) so no letter dominates.
    // Skipped for items whose wording depends on option order (above/below, both, none, letters).
    const mcq = items.filter((i) => i.type === 'mcq' && !i.group?.startsWith('\u0000'));
    if (mcq.length >= 8) {
      const fixed = (i) => i.options.some((x) => /\b(above|below|both|none of|all of|neither|either)\b|^[A-D]\)|^Option [A-D]/i.test(x)) || /\b(option|choice|letter) [A-D]\b/i.test(i.q + i.sol);
      const movable = mcq.filter((i) => !fixed(i));
      const count = [0, 0, 0, 0, 0, 0];
      for (const i of mcq) if (fixed(i)) count[i.answer]++;
      let k = 0;
      for (const i of movable) {
        const n = i.options.length; const from = i.answer;
        // the least-used letter so far that this item has an option for (ties go round in turn)
        let to = 0, best = Infinity;
        for (let j = 0; j < n; j++) { const c = count[j] * 10 + ((j - k) % 4 + 4) % 4; if (c < best) { best = c; to = j; } }
        k++; count[to]++;
        if (to === from) continue;
        const correct = i.options[from]; const rest = i.options.filter((_, j) => j !== from);
        rest.splice(to, 0, correct); i.options = rest; i.answer = to;
      }
    }
    total += items.length;
    const file = [
      `// ${course === 'celpip' ? 'CELPIP' : 'TOEFL'} drills: ${set.title}`,
      `// Made from public/learn-kit/${course}/sets/${f} by scripts/courses/sets-to-qbank.mjs. Original material written for fibub.`,
      'export default {',
      `  topic: ${JSON.stringify(id)},`,
      Object.keys(groups).length ? `  groups: {\n${Object.entries(groups).map(([k, g]) => `    ${JSON.stringify(k)}: ${JSON.stringify(g)},`).join('\n')}\n  },` : null,
      `  items: [\n${items.map((i) => `    ${JSON.stringify(i)},`).join('\n')}\n  ],`,
      '};', '',
    ].filter((x) => x != null).join('\n');
    writeFileSync(new URL(`${id}.js`, outDir), file);
    topics.push({ id, name: topicName(course, id, set.title), mod, pos: first ? pos.get(first) : 1e9, count: items.length });
  }
  // index
  const units = modules.map((m) => ({ id: slug(m.name), name: m.name, topics: topics.filter((t) => t.mod === m).sort((a, b) => a.pos - b.pos || a.id.localeCompare(b.id)).map((t) => ({ id: t.id, name: t.name })) })).filter((u) => u.topics.length);
  const idx = [
    ...C.header.map((l) => `// ${l}`),
    'export default {',
    `  id: ${JSON.stringify(course)}, name: ${JSON.stringify(C.name)},`,
    `  exams: ${JSON.stringify(C.exams).replace(/"([a-z]+)":/g, '$1:').replace(/"/g, "'")},`,
    '  facets: {',
    `    skill: { label: 'Skill', values: ${JSON.stringify(SKILL).replace(/"([a-z]+)":/g, '$1:').replace(/"/g, "'")} },`,
    `    ${C.facetKey}: { label: ${JSON.stringify(C.facetLabel)}, values: ${JSON.stringify(C.facetValues).replace(/"([0-9]+)":/g, '$1:').replace(/"([a-z]+)":/g, '$1:').replace(/"([a-z-]+)":/g, "'$1':")} },`,
    '  },',
    '  units: [',
    ...units.map((u) => `    { id: ${JSON.stringify(u.id)}, name: ${JSON.stringify(u.name)}, topics: [\n${u.topics.map((t) => `      { id: ${JSON.stringify(t.id)}, name: ${JSON.stringify(t.name)} },`).join('\n')}\n    ] },`),
    '  ],',
    '};', '',
  ].join('\n');
  writeFileSync(new URL('index.js', outDir), idx);
  report[course] = { topics: topics.length, items: total, skipped };
}
console.log(JSON.stringify(report, null, 2));
