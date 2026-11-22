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

const normText = (s) => String(s).trim().toLowerCase().replace(/[‘’]/g, "'").replace(/[.,;:!?"]+$/g, '').replace(/\s+/g, ' ').trim();

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
 * Check a response. `resp`: mcq → index, msq → array of indices, nat → string or number, text → string.
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
    const mk = (it) => sec.anyLevel || marksOf(it) === sec.marks;
    const fits = (it) => it.type === sec.type && mk(it) && !used.has(it.id) && it.type !== 'open';
    // round-robin over topics so one topic cannot fill a section
    const byTopic = new Map();
    for (const it of shuffle(pool.filter(fits), r)) { if (!byTopic.has(it.topic)) byTopic.set(it.topic, []); byTopic.get(it.topic).push(it); }
    const gfits = shuffle(gens.filter((g) => g.type === sec.type && mk(g)), r);
    for (const g of gfits) { if (!byTopic.has(g.topic)) byTopic.set(g.topic, []); byTopic.get(g.topic).push({ __gen: g }); }
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
  'sat-math': { name: 'SAT Math practice (both modules, not adaptive)', minutes: 70, scheme: 'sat', sections: [
    { name: 'Multiple choice', type: 'mcq', marks: 1, count: 33, anyLevel: true, repeat: true },
    { name: 'Student-produced response (type your answer)', type: 'nat', marks: 1, count: 11, anyLevel: true, repeat: true },
  ] },
  'lsat-lr': { name: 'LSAT Logical Reasoning practice section', minutes: 35, scheme: 'lsat', sections: [
    { name: 'Logical Reasoning', type: 'mcq', marks: 1, count: 25, anyLevel: true },
  ] },
  // CUET (UG): every test is 50 compulsory MCQs in 60 minutes, +5/−1 (NTA bulletin, checked 2026-11-22). The two
  // sections only mix easier and harder questions; every question is worth 5 marks (marksMap).
  cuet: { name: 'CUET (UG) test', minutes: 60, scheme: 'cuet', sections: [
    { name: 'Standard questions', type: 'mcq', marks: 1, count: 30 },
    { name: 'Harder questions', type: 'mcq', marks: 2, count: 20 },
  ], marksMap: { 1: 5, 2: 5 } },
  net: { name: 'CSIR NET Physical Sciences (Parts B and C)', minutes: 150, scheme: 'net', sections: [
    { name: 'Part B: 3.5 marks each', type: 'mcq', marks: 1, count: 25 },
    { name: 'Part C: 5 marks each', type: 'mcq', marks: 2, count: 20 },
  ], marksMap: { 1: 3.5, 2: 5 } },
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
