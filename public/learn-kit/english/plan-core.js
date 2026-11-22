// Study plan maths for the English exam courses (no page code, so tests/english.mjs can check it).
export const MODS = {
  celpip: { start: 'Module 1: Start here', listening: 'Module 2: Listening', reading: 'Module 3: Reading', writing: 'Module 4: Writing', speaking: 'Module 5: Speaking', mock: 'Module 6: Mock tests and final week', order: ['listening', 'reading', 'writing', 'speaking'] },
  toefl: { start: 'Module 1: Start here', reading: 'Module 2: Reading', listening: 'Module 3: Listening', writing: 'Module 4: Writing', speaking: 'Module 5: Speaking', mock: 'Module 6: Mock tests and final week', order: ['reading', 'listening', 'writing', 'speaking'] },
};

/** Split the weeks into phases. Exported for tests. */
export function makePlan(weeks, hours, weak, mode = 'celpip') {
  const M = MODS[mode];
  const out = [];
  const mockWeeks = weeks >= 6 ? 2 : 1;
  const skillWeeks = Math.max(1, weeks - mockWeeks - (weeks >= 4 ? 1 : 0));
  if (weeks >= 4) out.push({ week: 1, phase: 'start', focus: M.start, task: `Learn the test format and take one timed practice set in each skill to find your level (${hours} h).` });
  // Weak skill gets a double share of the skill weeks (largest remainder, ties to the weak skill first).
  const order = [weak, ...M.order.filter((s) => s !== weak)];
  const wt = order.map((s) => (s === weak ? 2 : 1));
  const tot = wt.reduce((x, y) => x + y, 0);
  const raw = wt.map((x) => (x / tot) * skillWeeks);
  const alloc = raw.map(Math.floor);
  let left = skillWeeks - alloc.reduce((x, y) => x + y, 0);
  const byRem = raw.map((r, i) => [r - Math.floor(r) + (i === 0 ? 1e-6 : 0), i]).sort((x, y) => y[0] - x[0]);
  for (const [, i] of byRem) { if (left <= 0) break; alloc[i]++; left--; }
  let w = out.length + 1;
  for (const s of M.order) {
    const k = order.indexOf(s);
    for (let j = 0; j < alloc[k]; j++) out.push({ week: w++, phase: s, focus: M[s], task: `${s === weak ? 'Your focus skill. ' : ''}${Math.round(hours * 0.7)} h on the ${s} lessons and drills, ${Math.round(hours * 0.3)} h keeping the other skills warm (one drill each).` });
  }
  for (let k = 0; k < mockWeeks && w <= weeks + 1; k++) out.push({ week: w++, phase: 'mock', focus: M.mock, task: k === mockWeeks - 1 ? 'Final week: one full mock early in the week, review mistakes, light practice, sleep well before test day.' : 'Take a full timed mock test, mark it with the checklists, and redo every question you missed.' });
  return out.filter((r) => r.week <= weeks);
}

