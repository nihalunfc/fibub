// Lab report template and marking rubric. The section prompts, checklist and rubric wording are fibub's own.
// The score is a weighted mean: each criterion's level points over the top level's points, weighted by the
// criterion's weight over the sum of weights. Plain TypeScript, no DOM.

export type RSection = { id: string; name: string; prompts: string[]; on: boolean };
export type Preset = { id: string; name: string; sections: RSection[] };
export type Level = { name: string; points: number };
export type Criterion = { name: string; weight: number; desc: string[] };
export type Rubric = { title: string; levels: Level[]; criteria: Criterion[] };
export type Meta = { title: string; author: string; course: string; date: string };

const S = (id: string, name: string, prompts: string[], on = true): RSection => ({ id, name, prompts, on });

export const PRESETS: Preset[] = [
  {
    id: 'school', name: 'School practical', sections: [
      S('aim', 'Aim', ['In one sentence, what are you trying to find out?']),
      S('hypothesis', 'Hypothesis', ['What do you expect to happen, and why? Use the science you know.', 'Write it so a result could show it wrong: "If ... then ... because ...".']),
      S('variables', 'Variables', ['Independent variable: what you change, and the values you use.', 'Dependent variable: what you measure, how, and in what unit.', 'Control variables: what you keep the same, and how.']),
      S('equipment', 'Equipment', ['List each item with its size or range, such as "100 mL measuring cylinder (±1 mL)".']),
      S('safety', 'Safety', ['Name each hazard, the risk it brings and what you did to reduce it.']),
      S('method', 'Method', ['Numbered steps that someone else could follow to get the same results.', 'Say how many times you repeated each measurement.']),
      S('results', 'Results', ['A table of raw data, with the quantity and unit in each column heading.', 'A graph of the dependent variable against the independent variable.', 'Means of repeats, and any results you left out, with the reason.']),
      S('analysis', 'Analysis', ['Describe the pattern in your results, quoting numbers.', 'Show one example of each calculation.']),
      S('conclusion', 'Conclusion', ['Answer the aim. Do the results support the hypothesis?', 'Explain the pattern using science ideas.']),
      S('evaluation', 'Evaluation', ['How reliable and accurate were the results? Point to the spread of repeats and any odd results.', 'What were the main sources of error, and which way would each push the result?', 'Suggest specific improvements and further work.']),
    ],
  },
  {
    id: 'full', name: 'University lab report', sections: [
      S('abstract', 'Abstract', ['About 150 to 250 words: purpose, method in one or two sentences, key results with numbers and uncertainties, main conclusion.', 'Write it last.']),
      S('introduction', 'Introduction', ['The background and theory needed to follow the report, with references.', 'The question or aim, and the hypothesis or expected result.', 'Equations you will use later, numbered.']),
      S('methods', 'Materials and methods', ['Materials with suppliers, grades or concentrations where they matter.', 'The procedure in past tense and prose, detailed enough to repeat.', 'How data were processed and which statistical tests were used.']),
      S('results', 'Results', ['Present the data in numbered figures and tables, each referred to in the text.', 'Report values with uncertainties and units, to a sensible number of significant figures.', 'State results without explaining them yet.']),
      S('discussion', 'Discussion', ['What the results mean, and how they compare with theory or published values (with references).', 'Sources of error and uncertainty, and how large each is.', 'Limitations and what could be done next.']),
      S('conclusion', 'Conclusion', ['A short paragraph answering the aim with the key numbers.']),
      S('references', 'References', ['Every source cited in the text, in one consistent style.']),
      S('appendix', 'Appendices', ['Raw data, long calculations, code or extra figures not needed in the main text.'], false),
    ],
  },
  {
    id: 'short', name: 'Short report (one page)', sections: [
      S('aim', 'Aim', ['What were you trying to find out?']),
      S('method', 'Method', ['A brief summary of what you did, with the key equipment.']),
      S('results', 'Results', ['One table or graph of the main results, with units.']),
      S('conclusion', 'Conclusion', ['What the results show, with one source of error and one improvement.']),
    ],
  },
];

export const CHECKLIST = [
  'Every figure and table has a number and a caption that says what it shows.',
  'Captions go below figures and above tables.',
  'Every figure and table is referred to in the text, in number order.',
  'Axes are labelled with the quantity and the unit, such as "Temperature (°C)".',
  'Table column headings give the quantity and the unit, so the cells hold numbers only.',
  'Error bars or ± values are shown, and the caption says what they are (SD, SE, range or uncertainty).',
  'The number of repeats (n) is given.',
  'Values in a column have the same number of decimal places.',
  'Lines of best fit are only drawn where a trend is expected, and the fit is stated.',
  'Colours and symbols can be told apart in black and white and by colour-blind readers.',
];

export const DEFAULT_RUBRIC: Rubric = {
  title: 'Lab report marking rubric',
  levels: [{ name: 'Excellent', points: 4 }, { name: 'Good', points: 3 }, { name: 'Developing', points: 2 }, { name: 'Beginning', points: 1 }],
  criteria: [
    { name: 'Aim and hypothesis', weight: 10, desc: ['Clear, focused aim; testable hypothesis explained with relevant science.', 'Clear aim; testable hypothesis with some explanation.', 'Aim given; hypothesis vague or not explained.', 'Aim or hypothesis missing or unclear.'] },
    { name: 'Method', weight: 15, desc: ['Complete and repeatable; variables, controls and repeats all stated; hazards managed.', 'Mostly repeatable; variables and repeats stated; small gaps.', 'Some steps missing; variables or controls unclear.', 'Not possible to repeat from the description.'] },
    { name: 'Results presentation', weight: 20, desc: ['Tables and graphs correct and well labelled with units; captions and numbering throughout.', 'Tables and graphs mostly correct; a few labels or units missing.', 'Data shown but poorly organised or often missing units.', 'Data missing, wrong or hard to read.'] },
    { name: 'Analysis', weight: 20, desc: ['Correct calculations with working; trends described with numbers; uncertainty handled.', 'Calculations mostly correct; trends described.', 'Some calculation errors; trend described only in general words.', 'Little or no analysis, or major errors.'] },
    { name: 'Discussion and evaluation', weight: 20, desc: ['Results explained with science; errors identified with their effect; specific improvements.', 'Results explained; main errors identified; sensible improvements.', 'Some explanation; errors listed but not linked to results.', 'Little explanation or evaluation.'] },
    { name: 'Conclusion', weight: 5, desc: ['Answers the aim with key numbers; consistent with the data.', 'Answers the aim; consistent with the data.', 'Partly answers the aim.', 'Missing or not supported by the data.'] },
    { name: 'Communication and references', weight: 10, desc: ['Clear, concise scientific writing; correct units and significant figures; sources cited consistently.', 'Mostly clear; minor errors in units or citations.', 'Hard to follow in places; several errors.', 'Unclear; sources not cited.'] },
  ],
};

export const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x));

// ---------- scoring ----------
export type Score = { complete: boolean; marked: number; percent: number; parts: { name: string; weight: number; share: number; level: string; points: number; max: number; contrib: number }[]; weightSum: number };
/** picks[i] is the chosen level index for criterion i, or -1 when not marked yet. The percent counts only the
 *  marked criteria's weights, so a part-marked report shows a running score. */
export function score(r: Rubric, picks: number[]): Score {
  const max = Math.max(0, ...r.levels.map((l) => l.points));
  const weightSum = r.criteria.reduce((a, c) => a + Math.max(0, c.weight), 0);
  let num = 0, den = 0, marked = 0;
  const parts = r.criteria.map((c, i) => {
    const k = picks[i] ?? -1, w = Math.max(0, c.weight);
    const lv = k >= 0 && k < r.levels.length ? r.levels[k] : null;
    const share = weightSum > 0 ? (100 * w) / weightSum : 0;
    const frac = lv && max > 0 ? lv.points / max : 0;
    if (lv) { marked++; num += w * frac; den += w; }
    return { name: c.name, weight: c.weight, share, level: lv?.name ?? '', points: lv?.points ?? NaN, max, contrib: lv ? share * frac : 0 };
  });
  return { complete: marked === r.criteria.length && r.criteria.length > 0, marked, percent: den > 0 ? (100 * num) / den : NaN, parts, weightSum };
}

/** Problems with a rubric that stop a fair score. */
export function rubricProblems(r: Rubric): string[] {
  const out: string[] = [];
  if (!r.criteria.length) out.push('Add at least one criterion.');
  if (r.levels.length < 2) out.push('Add at least two levels.');
  if (r.levels.some((l) => !Number.isFinite(l.points) || l.points < 0)) out.push('Level points must be numbers of 0 or more.');
  if (r.levels.length && Math.max(...r.levels.map((l) => l.points)) <= 0) out.push('At least one level needs more than 0 points.');
  if (r.criteria.some((c) => !Number.isFinite(c.weight) || c.weight < 0)) out.push('Weights must be numbers of 0 or more.');
  else if (r.criteria.length && r.criteria.every((c) => c.weight === 0)) out.push('At least one criterion needs a weight above 0.');
  return out;
}

// ---------- reading a saved rubric ----------
export function readRubric(text: string): Rubric {
  let j: any;
  try { j = JSON.parse(text); } catch { throw new Error('This file is not JSON. Open a rubric saved from this page (.json).'); }
  if (!j || !Array.isArray(j.levels) || !Array.isArray(j.criteria)) throw new Error('This JSON has no "levels" and "criteria" lists, so it is not a rubric saved from this page.');
  if (j.levels.length > 8 || j.criteria.length > 30) throw new Error('This rubric is larger than the page allows (up to 8 levels and 30 criteria).');
  const str = (x: unknown, n = 2000) => String(x ?? '').slice(0, n);
  const levels: Level[] = j.levels.map((l: any) => ({ name: str(l?.name, 60), points: Number(l?.points) }));
  const criteria: Criterion[] = j.criteria.map((c: any) => ({ name: str(c?.name, 120), weight: Number(c?.weight), desc: levels.map((_, k) => str(Array.isArray(c?.desc) ? c.desc[k] : '')) }));
  return { title: str(j.title, 120) || 'Marking rubric', levels, criteria };
}
export const rubricJson = (r: Rubric) => JSON.stringify({ fibub: 'lab-report-rubric', version: 1, ...r }, null, 2) + '\n';

// ---------- Markdown ----------
const mdCell = (s: string) => s.replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>').trim() || ' ';
const mdLine = (s: string) => s.replace(/([\\`*_#\[\]])/g, '\\$1');

export function templateMarkdown(m: Meta, secs: RSection[], figures: string[], checks: string[]): string {
  const out: string[] = [`# ${mdLine(m.title.trim() || 'Lab report')}`, ''];
  const info = ([['Author', m.author], ['Course', m.course], ['Date', m.date]] as const).filter(([, v]) => v.trim());
  for (const [k, v] of info) out.push(`**${k}:** ${mdLine(v.trim())}  `);
  if (info.length) out.push('');
  for (const s of secs.filter((x) => x.on)) {
    out.push(`## ${mdLine(s.name)}`, '');
    for (const p of s.prompts.filter((x) => x.trim())) out.push(`> ${mdLine(p.trim())}`, '>');
    if (s.prompts.some((x) => x.trim())) out.pop();
    out.push('', '_Write here._', '');
  }
  if (figures.length || checks.length) {
    out.push('## Figures and tables checklist', '');
    if (figures.length) { out.push('Planned figures and tables:', ''); for (const f of figures) out.push(`- ${mdLine(f)}`); out.push(''); }
    for (const c of checks) out.push(`- [ ] ${mdLine(c)}`);
    out.push('');
  }
  return out.join('\n');
}

export function rubricMarkdown(r: Rubric, picks?: number[], outOf?: number): string {
  const sc = picks ? score(r, picks) : null;
  const marking = !!sc && sc.marked > 0;
  const head = ['Criterion', 'Weight', ...r.levels.map((l) => `${l.name} (${l.points})`), ...(marking ? ['Mark'] : [])];
  const out = [`# ${mdLine(r.title)}`, '', `| ${head.map(mdCell).join(' | ')} |`, `|${head.map((_, i) => (i === 1 ? ' ---: ' : ' --- ')).join('|')}|`];
  const ws = sc?.weightSum ?? r.criteria.reduce((a, c) => a + Math.max(0, c.weight), 0);
  r.criteria.forEach((c, i) => {
    const share = ws > 0 ? (100 * Math.max(0, c.weight)) / ws : 0;
    const mark = marking ? [sc!.parts[i].level ? `${sc!.parts[i].level} (${sc!.parts[i].points})` : 'not marked'] : [];
    out.push(`| ${[c.name, `${fmt(share)} %`, ...r.levels.map((_, k) => c.desc[k] ?? ''), ...mark].map(mdCell).join(' | ')} |`);
  });
  if (marking) {
    out.push('', `**Score:** ${scoreLine(sc!, outOf)}`);
  }
  return out.join('\n') + '\n';
}
export const fmt = (x: number, d = 1) => (Number.isFinite(x) ? (Math.round(x * 10 ** d) / 10 ** d).toFixed(d).replace(/\.0+$/, '') : '–');
export function scoreLine(sc: Score, outOf?: number): string {
  if (!sc.marked) return 'not marked yet';
  const marks = outOf && outOf > 0 ? `, ${fmt((sc.percent / 100) * outOf)} out of ${fmt(outOf)}` : '';
  return `${fmt(sc.percent)} %${marks}${sc.complete ? '' : ` (${sc.marked} of ${sc.parts.length} criteria marked so far)`}`;
}
