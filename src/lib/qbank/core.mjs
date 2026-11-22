// Shared question bank engine (qbank): the pure part, with no DOM, used by the browser UI (src/scripts/qbank.ts),
// by build-time pages (src/components/qbank/) and by the checks (tests/qbank.mjs).
// Format: /mnt/project-files/qbank/spec.md and src/lib/qbank/types.ts. Data: public/qbank/<bank>/index.js + <topic>.js.

/** A small seeded random number generator (mulberry32): the same seed always gives the same numbers. */
export function rng(seed) {
  let a = seed >>> 0 || 0x9e3779b9;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const newSeed = () => 1 + Math.floor(Math.random() * 2 ** 31);

/** Default marks: warm-up and standard questions carry 1 mark, harder ones 2. */
export const marksOf = (it) => it.marks ?? (it.level <= 2 ? 1 : 2);

/** Make one concrete question from a template (gen) and a seed. Keeps the template's metadata. */
export function instantiate(gen, seed) {
  const made = gen.make(rng(seed));
  const { make, verify, ...meta } = gen;
  return { ...meta, ...made, id: `${gen.id}~${seed}`, gen: gen.id, seed };
}

/** All fixed items of a topic file, with topic id and group material attached. */
export function topicItems(file, topicId = file.topic) {
  const groups = file.groups ?? {};
  return (file.items ?? []).map((it) => ({ ...it, topic: topicId, grp: it.group ? groups[it.group] : undefined }));
}

/** The templates of a topic file, as an array, with topic id attached. */
export function topicGens(file, topicId = file.topic) {
  const g = file.gens ?? [];
  const arr = Array.isArray(g) ? g : Object.entries(g).map(([id, v]) => ({ id, ...v }));
  return arr.map((x) => ({ ...x, topic: topicId }));
}

/** Options of an item: its own, or its group's shared list. */
export const optionsOf = (it) => it.options ?? it.grp?.options ?? [];

export const normText = (s) => String(s).trim().toLowerCase().replace(/[‘’]/g, "'").replace(/[.,;:!?"]+$/g, '').replace(/\s+/g, ' ').trim();

/** Read a typed number: accepts 3e8, 3×10^8, 3x10^8, 3*10^8, commas as thousands, a leading + or −, and fractions a/b. */
export function readNumber(s) {
  if (typeof s === 'number') return s;
  let t = String(s ?? '').trim().replace(/[−–]/g, '-').replace(/\s+/g, '');
  if (!t) return NaN;
  t = t.replace(/,(?=\d{3}(\D|$))/g, '').replace(',', '.');
  let m = t.match(/^([-+]?\d*\.?\d+)(?:[x×*·]10\^?\(?([-+]?\d+)\)?)$/i);
  if (m) return parseFloat(m[1]) * 10 ** parseInt(m[2], 10);
  m = t.match(/^([-+]?\d*\.?\d+)\/(\d*\.?\d+)$/);
  if (m) return parseFloat(m[1]) / parseFloat(m[2]);
  if (/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(t)) return parseFloat(t);
  return NaN;
}

/**
 * Check a response. `resp`: mcq → index, msq → array of indices, nat → string or number, text → string,
 * order → the chips in the learner's order (array or one string).
 * Returns { right, partial (0..1 share of correct options picked, msq only), wrongPick (msq: picked a wrong option) }.
 */
export function check(it, resp) {
  if (resp == null || resp === '' || (Array.isArray(resp) && !resp.length)) return { right: false, blank: true };
  switch (it.type) {
    case 'mcq': return { right: Number(resp) === it.answer };
    case 'msq': {
      const want = new Set(it.answer), got = new Set(resp.map(Number));
      const wrongPick = [...got].some((g) => !want.has(g));
      const hits = [...got].filter((g) => want.has(g)).length;
      return { right: !wrongPick && hits === want.size, partial: wrongPick ? 0 : hits / want.size, hits, wrongPick };
    }
    case 'nat': {
      const x = readNumber(resp);
      if (!Number.isFinite(x)) return { right: false, unreadable: true };
      const tol = it.tol ?? 0;
      return { right: Math.abs(x - it.answer) <= tol + 1e-9 * Math.max(1, Math.abs(it.answer)) };
    }
    case 'text': {
      const s = normText(resp);
      if (it.maxWords && s.split(' ').filter(Boolean).length > it.maxWords) return { right: false, tooLong: true };
      return { right: (it.answer ?? []).some((a) => normText(a) === s) };
    }
    case 'order': {
      // Word chips put in order (TOEFL Build a Sentence): resp is the built sentence or the list of chips.
      const s = normText(Array.isArray(resp) ? resp.join(' ') : resp);
      return { right: (it.answer ?? []).some((a) => normText(a) === s) };
    }
    default: return { right: false, unscored: true };
  }
}

/**
 * Marking schemes. Each gives the marks for one question from its marks value and the check result.
 * Add new exams here (keys are the exam tags used in banks).
 */
export const SCHEMES = {
  // IIT JAM and GATE: MCQ wrong costs a third of its marks; MSQ and NAT have no negative and no partial marks.
  jam: { name: 'IIT JAM', score: (it, r, m) => (r.right ? m : r.blank || it.type !== 'mcq' ? 0 : -m / 3) },
  gate: { name: 'GATE', score: (it, r, m) => (r.right ? m : r.blank || it.type !== 'mcq' ? 0 : -m / 3) },
  // CSIR NET Physical Sciences: Part A/B wrong −25% of marks; Part C (marks 5) also −25%.
  net: { name: 'CSIR NET', score: (it, r, m) => (r.right ? m : r.blank ? 0 : -m / 4) },
  'jee-main': { name: 'JEE Main', score: (it, r) => (r.right ? 4 : r.blank ? 0 : -1) },
  'jee-adv': { name: 'JEE Advanced', score: (it, r) => {
    if (r.blank) return 0;
    if (it.type === 'msq') return r.right ? 4 : r.wrongPick ? -2 : r.hits;
    if (it.type === 'mcq') return r.right ? 3 : -1;
    return r.right ? 4 : 0;
  } },
  cuet: { name: 'CUET (UG)', score: (it, r) => (r.right ? 5 : r.blank ? 0 : -1) },
  neet: { name: 'NEET', score: (it, r) => (r.right ? 4 : r.blank ? 0 : -1) },
  keam: { name: 'KEAM', score: (it, r) => (r.right ? 4 : r.blank ? 0 : -1) },
  // No negative marking: raw count of marks for right answers.
  none: { name: 'No negative marking', score: (it, r, m) => (r.right ? m : 0) },
  sat: { name: 'SAT', score: (it, r, m) => (r.right ? m : 0) },
  lsat: { name: 'LSAT', score: (it, r, m) => (r.right ? m : 0) },
  gmat: { name: 'GMAT', score: (it, r, m) => (r.right ? m : 0) },
  gre: { name: 'GRE', score: (it, r, m) => (r.right ? m : 0) },
  practice: { name: 'Practice', score: (it, r, m) => (r.right ? m : 0) },
};

export function score(scheme, it, resp, marks = marksOf(it)) {
  const r = check(it, resp);
  const s = (SCHEMES[scheme] ?? SCHEMES.practice).score(it, r, marks);
  return { ...r, marks: Math.round(s * 100) / 100 };
}

/** Fisher-Yates shuffle with a given rng. */
export function shuffle(arr, r = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Does an item pass a filter { exam, type, level (array or number), format, sub, facets: {k: v} }? */
export function matches(it, f = {}) {
  if (f.exam && it.exams && !it.exams.includes(f.exam)) return false;
  if (f.type && it.type !== f.type) return false;
  if (f.level && !(Array.isArray(f.level) ? f.level.includes(it.level) : it.level === Number(f.level))) return false;
  if (f.format && it.format !== f.format) return false;
  if (f.sub && it.sub !== f.sub) return false;
  if (f.facets) for (const [k, v] of Object.entries(f.facets)) if (v && it.facets?.[k] !== v) return false;
  return true;
}

/**
 * Build a mock paper from a pool of items and templates following a pattern:
 * pattern.sections = [{ name, type, marks, count }]. Fixed items are preferred; templates fill gaps with fresh seeds.
 * Picks spread across topics. Returns { sections: [{ name, items }] } or throws if the pool is too small.
 */
export function buildPaper(pattern, pool, gens, r = Math.random) {
  const used = new Set();
  const sections = pattern.sections.map((sec) => {
    // anyLevel: take every level (marks per question stay sec.marks); exams like the SAT and LSAT give every question one mark.
    // only: { facet: value } keeps a section to part of a bank (e.g. the SAT Math test uses only section: 'math').
    const only = sec.only || pattern.only;
    // topics: keep a section to these topics; skipTopics (pattern-wide) keeps them out of every other section.
    const skip = sec.topics ? [] : pattern.skipTopics || [];
    const tp = (it) => (!sec.topics || sec.topics.includes(it.topic)) && !skip.includes(it.topic);
    // bank: in a paper drawn from several banks (items carry __bank), keep the section to one bank (e.g. JEE Main's
    // Physics part); levels and formats keep it to exam depth and answer style (e.g. integer answers only).
    const fromBank = (it) => !sec.bank || it.__bank === sec.bank;
    const depth = (it) => (!sec.levels || sec.levels.includes(it.level)) && (!sec.formats || sec.formats.includes(it.format));
    const mk = (it) => (sec.anyLevel || marksOf(it) === sec.marks) && tp(it) && fromBank(it) && depth(it) && (!only || Object.entries(only).every(([k, v]) => it.facets?.[k] === v));
    const fits = (it) => it.type === sec.type && mk(it) && !used.has(it.id) && it.type !== 'open';
    // round-robin over topics so one topic cannot fill a section
    const byTopic = new Map();
    for (const it of shuffle(pool.filter(fits), r)) { if (!byTopic.has(it.topic)) byTopic.set(it.topic, []); byTopic.get(it.topic).push(it); }
    const gfits = shuffle(gens.filter((g) => g.type === sec.type && mk(g)), r);
    for (const g of gfits) { if (!byTopic.has(g.topic)) byTopic.set(g.topic, []); byTopic.get(g.topic).push({ __gen: g }); }
    // sets: items that share a group (one passage or recording) are taken whole, in their own order, never split.
    if (sec.sets) {
      const units = new Map();
      for (const it of pool) if (fits(it)) { const k = it.group ? `${it.topic}/${it.group}` : it.id; if (!units.has(k)) units.set(k, []); units.get(k).push(it); }
      // a few random draws, keeping the first that fills the section exactly (else the fullest)
      let out = [];
      for (let t = 0; t < 60 && out.length < sec.count; t++) {
        const pick = [];
        for (const u of shuffle([...units.values()], r)) {
          if (pick.length + u.length > sec.count) continue;
          pick.push(...u);
          if (pick.length === sec.count) break;
        }
        if (pick.length > out.length) out = pick;
      }
      for (const it of out) used.add(it.id);
      return { name: sec.name, type: sec.type, marks: sec.marks, items: out, short: sec.count - out.length };
    }
    // passages: N draws N whole shared-passage sets (every question of each passage, in its own order) instead of
    // single questions, as on the LSAT Reading Comprehension section. The count is then whatever those passages hold.
    if (sec.passages) {
      const sets = new Map();
      for (const it of pool) if (it.group && fits(it)) { const key = `${it.topic}/${it.group}`; if (!sets.has(key)) sets.set(key, []); sets.get(key).push(it); }
      const out = shuffle([...sets.values()], r).slice(0, sec.passages).flat();
      for (const it of out) used.add(it.id);
      return { name: sec.name, type: sec.type, marks: sec.marks, items: out, short: 0 };
    }
    const lists = shuffle([...byTopic.values()], r);
    const out = [];
    let k = 0, empty = 0;
    while (out.length < sec.count && lists.length && empty < lists.length) {
      const l = lists[k % lists.length]; k++;
      if (!l.length) { empty++; continue; }
      empty = 0;
      const x = l.shift();
      const it = x.__gen ? instantiate(x.__gen, 1 + Math.floor(r() * 2 ** 31)) : x;
      if (x.__gen && sec.repeat) l.push(x); // repeat: a template may give several fresh questions in one paper
      used.add(it.id); out.push(it);
    }
    return { name: sec.name, type: sec.type, marks: sec.marks, items: out, short: sec.count - out.length };
  });
  return { sections };
}

/** Exam patterns used by the mock-test page. Counts follow the published exam patterns (types and marks only). */
export const PATTERNS = {
  // Plus Two entrance tests: one paper from several banks (the page passes data-bank="a,b,c"); each section names its
  // bank. Counts follow the 2025-26 notices (types and marks only); every question is worth the exam's 4 marks.
  'jee-main': { name: 'JEE Main Paper 1 (B.E./B.Tech.)', minutes: 180, scheme: 'jee-main', sections: [
    ...['physics', 'chemistry', 'maths'].flatMap((b) => [
      { name: `${b[0].toUpperCase() + b.slice(1)}: multiple choice`, bank: `entrance-${b}`, type: 'mcq', marks: 4, count: 20, anyLevel: true, levels: [2, 3, 4] },
      { name: `${b[0].toUpperCase() + b.slice(1)}: numerical answer`, bank: `entrance-${b}`, type: 'nat', marks: 4, count: 5, anyLevel: true, levels: [2, 3, 4], formats: ['integer'] },
    ]),
  ] },
  neet: { name: 'NEET (UG)', minutes: 180, scheme: 'neet', sections: [
    { name: 'Physics', bank: 'entrance-physics', type: 'mcq', marks: 4, count: 45, anyLevel: true, levels: [1, 2, 3, 4] },
    { name: 'Chemistry', bank: 'entrance-chemistry', type: 'mcq', marks: 4, count: 45, anyLevel: true, levels: [1, 2, 3, 4] },
    { name: 'Biology', bank: 'entrance-biology', type: 'mcq', marks: 4, count: 90, anyLevel: true, levels: [1, 2, 3, 4] },
  ] },
  keam: { name: 'KEAM engineering', minutes: 180, scheme: 'keam', sections: [
    { name: 'Physics', bank: 'entrance-physics', type: 'mcq', marks: 4, count: 45, anyLevel: true, levels: [1, 2, 3] },
    { name: 'Chemistry', bank: 'entrance-chemistry', type: 'mcq', marks: 4, count: 30, anyLevel: true, levels: [1, 2, 3] },
    { name: 'Maths', bank: 'entrance-maths', type: 'mcq', marks: 4, count: 75, anyLevel: true, levels: [1, 2, 3] },
  ] },
  comedk: { name: 'COMEDK UGET', minutes: 180, scheme: 'none', sections: [
    ...['physics', 'chemistry', 'maths'].map((b) => ({ name: b[0].toUpperCase() + b.slice(1), bank: `entrance-${b}`, type: 'mcq', marks: 1, count: 60, anyLevel: true, levels: [1, 2, 3] })),
  ] },
  jam: { name: 'IIT JAM Physics', minutes: 180, scheme: 'jam', sections: [
    { name: 'Section A: MCQ, 1 mark', type: 'mcq', marks: 1, count: 10 },
    { name: 'Section A: MCQ, 2 marks', type: 'mcq', marks: 2, count: 20 },
    { name: 'Section B: MSQ, 2 marks', type: 'msq', marks: 2, count: 10 },
    { name: 'Section C: NAT, 1 mark', type: 'nat', marks: 1, count: 10 },
    { name: 'Section C: NAT, 2 marks', type: 'nat', marks: 2, count: 10 },
  ] },
  gate: { name: 'GATE Physics (subject part, 85 marks)', minutes: 150, scheme: 'gate', sections: [
    { name: 'MCQ, 1 mark', type: 'mcq', marks: 1, count: 15 },
    { name: 'MCQ, 2 marks', type: 'mcq', marks: 2, count: 15 },
    { name: 'MSQ, 1 mark', type: 'msq', marks: 1, count: 3 },
    { name: 'MSQ, 2 marks', type: 'msq', marks: 2, count: 5 },
    { name: 'NAT, 1 mark', type: 'nat', marks: 1, count: 7 },
    { name: 'NAT, 2 marks', type: 'nat', marks: 2, count: 10 },
  ] },
  // SAT Math, both modules together (44 questions in 70 minutes; about three quarters multiple choice). The real test
  // adapts its second module; this practice paper does not.
  'sat-math': { name: 'SAT Math practice (both modules, not adaptive)', minutes: 70, scheme: 'sat', only: { section: 'math' }, sections: [
    { name: 'Multiple choice', type: 'mcq', marks: 1, count: 33, anyLevel: true, repeat: true },
    { name: 'Student-produced response (type your answer)', type: 'nat', marks: 1, count: 11, anyLevel: true, repeat: true },
  ] },
  'sat-rw': { name: 'SAT Reading and Writing practice (both modules, not adaptive)', minutes: 64, scheme: 'sat', only: { section: 'rw' }, sections: [
    { name: 'Reading and Writing', type: 'mcq', marks: 1, count: 54, anyLevel: true, repeat: true },
  ] },
  'sat-rw-module': { name: 'SAT Reading and Writing, one module (not adaptive)', minutes: 32, scheme: 'sat', only: { section: 'rw' }, sections: [
    { name: 'Reading and Writing', type: 'mcq', marks: 1, count: 27, anyLevel: true, repeat: true },
  ] },
  'sat-math-module': { name: 'SAT Math, one module (not adaptive)', minutes: 35, scheme: 'sat', only: { section: 'math' }, sections: [
    { name: 'Multiple choice', type: 'mcq', marks: 1, count: 17, anyLevel: true, repeat: true },
    { name: 'Student-produced response (type your answer)', type: 'nat', marks: 1, count: 5, anyLevel: true, repeat: true },
  ] },
  'lsat-lr': { name: 'LSAT Logical Reasoning practice section', minutes: 35, scheme: 'lsat', only: { section: 'lr' }, sections: [
    { name: 'Logical Reasoning', type: 'mcq', marks: 1, count: 25, anyLevel: true },
  ] },
  'lsat-rc': { name: 'LSAT Reading Comprehension practice section (4 passages)', minutes: 35, scheme: 'lsat', only: { section: 'rc' }, sections: [
    { name: 'Reading Comprehension', type: 'mcq', marks: 1, count: 27, passages: 4, anyLevel: true },
  ] },
  // CUET (UG): every test is 50 compulsory MCQs in 60 minutes, +5/−1 (NTA bulletin, checked 2026-11-22). The two
  // sections only mix easier and harder questions; every question is worth 5 marks (marksMap).
  cuet: { name: 'CUET (UG) test', minutes: 60, scheme: 'cuet', sections: [
    { name: 'Standard questions', type: 'mcq', marks: 1, count: 30 },
    { name: 'Harder questions', type: 'mcq', marks: 2, count: 20 },
  ], marksMap: { 1: 5, 2: 5 } },
  // Parts as answered (the real paper shows 20/25/30 and counts 15/20/20): 15×2 + 20×3.5 + 20×5 = 200 marks.
  net: { name: 'CSIR NET Physical Sciences (Parts A, B and C)', minutes: 180, scheme: 'net', skipTopics: ['part-a-aptitude'], sections: [
    { name: 'Part A: general aptitude, 2 marks each', type: 'mcq', marks: 3, count: 15, anyLevel: true, topics: ['part-a-aptitude'] },
    { name: 'Part B: 3.5 marks each', type: 'mcq', marks: 1, count: 20 },
    { name: 'Part C: 5 marks each', type: 'mcq', marks: 2, count: 20 },
  ], marksMap: { 1: 3.5, 2: 5, 3: 2 } },
  // CELPIP and TOEFL: one mark a question, no negative marks. Counts follow each part's usual size and the bank's sets
  // (a recording or passage is never split), so a paper can be a question or two off the real one; not adaptive.
  'celpip-listening': { name: 'CELPIP-General Listening practice (Parts 1-6)', minutes: 47, scheme: 'none', sections: [
    { name: 'Part 1: Problem solving', type: 'mcq', marks: 1, count: 8, anyLevel: true, sets: true, only: { skill: 'listening', part: '1' } },
    { name: 'Part 2: Daily life conversation', type: 'mcq', marks: 1, count: 5, anyLevel: true, sets: true, only: { skill: 'listening', part: '2' } },
    { name: 'Part 3: Information', type: 'mcq', marks: 1, count: 6, anyLevel: true, sets: true, only: { skill: 'listening', part: '3' } },
    { name: 'Part 4: News item', type: 'mcq', marks: 1, count: 5, anyLevel: true, sets: true, only: { skill: 'listening', part: '4' } },
    { name: 'Part 5: Discussion', type: 'mcq', marks: 1, count: 8, anyLevel: true, sets: true, only: { skill: 'listening', part: '5' } },
    { name: 'Part 6: Viewpoints', type: 'mcq', marks: 1, count: 6, anyLevel: true, sets: true, only: { skill: 'listening', part: '6' } },
  ] },
  'celpip-reading': { name: 'CELPIP-General Reading practice (Parts 1-4)', minutes: 50, scheme: 'none', sections: [
    { name: 'Part 1: Correspondence', type: 'mcq', marks: 1, count: 9, anyLevel: true, sets: true, only: { skill: 'reading', part: '1' } },
    { name: 'Part 2: Diagram', type: 'mcq', marks: 1, count: 8, anyLevel: true, sets: true, only: { skill: 'reading', part: '2' } },
    { name: 'Part 3: Information', type: 'text', marks: 1, count: 9, anyLevel: true, sets: true, only: { skill: 'reading', part: '3' } },
    { name: 'Part 4: Viewpoints', type: 'mcq', marks: 1, count: 9, anyLevel: true, sets: true, only: { skill: 'reading', part: '4' } },
  ] },
  'toefl-reading': { name: 'TOEFL iBT Reading practice (2026 format, not adaptive)', minutes: 30, scheme: 'none', sections: [
    { name: 'Complete the Words', type: 'text', marks: 1, count: 20, anyLevel: true, sets: true, only: { skill: 'reading', task: 'complete-words' } },
    { name: 'Read in Daily Life', type: 'mcq', marks: 1, count: 15, anyLevel: true, sets: true, only: { skill: 'reading', task: 'daily-life' } },
    { name: 'Read an Academic Passage', type: 'mcq', marks: 1, count: 15, anyLevel: true, sets: true, only: { skill: 'reading', task: 'academic-passage' } },
  ] },
  'toefl-listening': { name: 'TOEFL iBT Listening practice (2026 format, not adaptive)', minutes: 29, scheme: 'none', sections: [
    { name: 'Listen and Choose a Response', type: 'mcq', marks: 1, count: 16, anyLevel: true, sets: true, only: { skill: 'listening', task: 'choose-response' } },
    { name: 'Listen to a Conversation', type: 'mcq', marks: 1, count: 12, anyLevel: true, sets: true, only: { skill: 'listening', task: 'conversation' } },
    { name: 'Listen to an Announcement', type: 'mcq', marks: 1, count: 11, anyLevel: true, sets: true, only: { skill: 'listening', task: 'announcement' } },
    { name: 'Listen to an Academic Talk', type: 'mcq', marks: 1, count: 8, anyLevel: true, sets: true, only: { skill: 'listening', task: 'academic-talk' } },
  ] },
  'gmat-quant': { name: 'GMAT-style Quantitative Reasoning (not adaptive)', minutes: 45, scheme: 'gmat', sections: [
    { name: 'Warm-up and standard questions', type: 'mcq', marks: 1, count: 8 },
    { name: 'Exam-level and harder questions', type: 'mcq', marks: 2, count: 13 },
  ], marksMap: { 1: 1, 2: 1 } },
  'gmat-verbal': { name: 'GMAT-style Verbal Reasoning (not adaptive)', minutes: 45, scheme: 'gmat', sections: [
    { name: 'Warm-up and standard questions', type: 'mcq', marks: 1, count: 7 },
    { name: 'Exam-level and harder questions', type: 'mcq', marks: 2, count: 16 },
  ], marksMap: { 1: 1, 2: 1 } },
  'gmat-di': { name: 'GMAT-style Data Insights (not adaptive)', minutes: 45, scheme: 'gmat', sections: [
    { name: 'Standard questions', type: 'mcq', marks: 1, count: 2 },
    { name: 'Data Sufficiency, graphs and two-part questions', type: 'mcq', marks: 2, count: 14 },
    { name: 'Select-all questions (tables and multi-source)', type: 'msq', marks: 2, count: 4 },
  ], marksMap: { 1: 1, 2: 1 } },
  // GRE (shorter test since Sept 2023): Verbal 12 q / 18 min + 15 q / 23 min; Quant 12 q / 21 min + 15 q / 26 min.
  // Section 1 of each draws on the GRE-only formats (gre-quant, gre-verbal banks), section 2 on the shared banks
  // (grad-quant, grad-verbal). Every question counts one mark; the real test adapts section 2, these do not.
  'gre-verbal-1': { name: 'GRE-style Verbal section 1 (not adaptive)', minutes: 18, scheme: 'gre', sections: [
    { name: 'Text Completion, one blank', type: 'mcq', marks: 1, count: 5, anyLevel: true },
    { name: 'Text Completion (two or three blanks) and Sentence Equivalence', type: 'msq', marks: 1, count: 7, anyLevel: true },
  ] },
  'gre-verbal-2': { name: 'GRE-style Verbal section 2 (not adaptive)', minutes: 23, scheme: 'gre', sections: [
    { name: 'Reading passages and arguments', type: 'mcq', marks: 1, count: 15, anyLevel: true },
  ] },
  'gre-quant-1': { name: 'GRE-style Quant section 1 (not adaptive)', minutes: 21, scheme: 'gre', sections: [
    { name: 'Quantitative Comparison and multiple choice', type: 'mcq', marks: 1, count: 7, anyLevel: true, repeat: true },
    { name: 'Numeric entry (type your answer)', type: 'nat', marks: 1, count: 3, anyLevel: true, repeat: true },
    { name: 'Select all that apply', type: 'msq', marks: 1, count: 2, anyLevel: true, repeat: true },
  ] },
  'gre-quant-2': { name: 'GRE-style Quant section 2 (not adaptive)', minutes: 26, scheme: 'gre', sections: [
    { name: 'Arithmetic, algebra, word problems and data', type: 'mcq', marks: 1, count: 15, anyLevel: true, repeat: true },
  ] },
};

/** Counts for a bank: fixed items and templates by type and level. */
export function countBank(files) {
  const c = { items: 0, gens: 0, byType: {}, byLevel: {} };
  for (const f of files) {
    for (const it of f.items ?? []) { c.items++; c.byType[it.type] = (c.byType[it.type] ?? 0) + 1; c.byLevel[it.level] = (c.byLevel[it.level] ?? 0) + 1; }
    c.gens += topicGens(f).length;
  }
  return c;
}
