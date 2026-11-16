// "Solve my numbers" for the reactivity series lab: will metal A displace metal B, which is more reactive, how is a
// metal extracted, and a typed list put in order. Built on reactivity.ts. No DOM. Engine: solvecore-b.ts.
import type { SSpec, SOut } from '../learn/solvecore-b.ts';
import { SERIES, SOLUTIONS, STRIPS, METAL, rank, test, pretty } from './reactivity.ts';

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const nm = (sym: string) => (sym === 'H' ? 'hydrogen' : METAL(sym).name);

const WHY: Record<string, string> = {
  electrolysis: 'It is more reactive than carbon, so carbon cannot take the oxygen away from its oxide. Its molten compound is split with electricity instead (electrolysis), which is costly.',
  carbon: 'It is below aluminium and the carbon in coke can pull the oxygen off its oxide, so heating the oxide with carbon (a reduction) frees the metal. This is cheaper than electrolysis.',
  heat: 'It is so low in the series that its compound breaks down or reacts with air just by heating, with no carbon needed.',
  native: 'It is so unreactive that it is found as the free metal, or it is recovered with little chemistry.',
};

export function reactivity(c: { find: string; ch: Record<string, string> }): SOut {
  const m = c.ch.m, s = c.ch.s, m2 = c.ch.m2;
  if (c.find === 'disp') {
    const r = test(m, s);
    const lines = [`Rule: a more reactive metal displaces a less reactive one from a solution of its salt (or hydrogen from an acid).`, `Series: ${m} is number ${rank(m) + 1} and ${r.sol.metal} is number ${rank(r.sol.metal) + 1} in the series below (1 is the most reactive).`];
    if (r.waterFirst) return { answer: `${cap(r.metal.name)} reacts with the water itself, so it is not used for this test.`, lines: [...lines, ...r.seen], tip: 'Potassium, sodium and calcium are above the usual displacement test: they react with water first. Never try them in a school lab.' };
    const what = r.sol.metal === 'H' ? 'hydrogen from dilute acid' : `${nm(r.sol.metal)} from ${r.sol.text}`;
    const answer = r.reacts ? `Yes: ${r.metal.name} displaces ${what}.` : r.metal.sym === r.sol.metal ? `No change: ${r.metal.name} cannot displace itself.` : `No reaction: ${r.metal.name} is less reactive than ${nm(r.sol.metal)}.`;
    if (r.equation) lines.push(`Equation: ${pretty(r.equation)}`);
    lines.push(...r.seen);
    return { answer, lines, tip: 'Common mistake: judging by the colour of the metal. Compare positions in the series: the metal higher up always wins. Aluminium can look slow because of its oxide layer, but it does displace copper.' };
  }
  if (c.find === 'cmp') {
    if (m === m2) return { error: 'Pick two different metals to compare.' };
    const hi = rank(m) < rank(m2) ? m : m2, lo = hi === m ? m2 : m;
    const lines = [`${cap(nm(hi))} (${hi}) is number ${rank(hi) + 1} and ${nm(lo)} (${lo}) is number ${rank(lo) + 1} in the series.`, `The lower the number, the more reactive the metal.`];
    if (lo !== 'H') lines.push(`So ${hi} displaces ${lo} from solutions of its salts; ${lo} cannot displace ${hi}.`);
    else lines.push(`${cap(nm(hi))} is above hydrogen, so it reacts with dilute acid and gives hydrogen.`);
    if (hi === 'H') lines.push(`${cap(nm(lo))} is below hydrogen, so it does not react with dilute acid.`);
    return { answer: `${cap(nm(hi))} is more reactive than ${nm(lo)}.`, lines, tip: 'Hydrogen is not a metal but is placed in the series as a marker: metals above it fizz in dilute acid, those below it do not.' };
  }
  if (c.find === 'extract') {
    const mt = METAL(m);
    return { answer: `${cap(mt.name)} is extracted by ${mt.extraction}.`, lines: [`Position: number ${rank(m) + 1} in the series (1 is the most reactive).`, WHY[mt.ext]], tip: 'Rule of thumb: above aluminium (and aluminium itself) means electrolysis; between aluminium and copper means heating with carbon; copper and below needs little more than heat.' };
  }
  const mt = METAL(m);
  return { answer: `${cap(mt.name)}: ${mt.water ? `with water it ${mt.water}` : 'no data'}.`, lines: [`With water: ${mt.water}.`, `With dilute acid: ${mt.acid}.`, `Position: number ${rank(m) + 1} in the series.`], tip: 'Never put potassium, sodium or calcium in water or acid yourself. These notes are for understanding, not for trying.' };
}

const metalOpts = (xs: string[]): [string, string][] => xs.map((s) => [s, `${s}: ${nm(s)}`]);
export const REACT_SPEC: SSpec = {
  id: 'react',
  finds: [['disp', 'Will a metal displace another?'], ['cmp', 'Which of two metals is more reactive?'], ['extract', 'How is a metal extracted?'], ['water', 'Reaction with water and acid']],
  fields: [
    { k: 'm', label: 'The metal', kind: 'choice', options: metalOpts(STRIPS), def: 'Fe' },
    { k: 's', label: 'Dropped into a solution of', kind: 'choice', options: SOLUTIONS.map((x) => [x.id, `${pretty(x.formula)}: ${x.text}`] as [string, string]), def: 'CuSO4', show: (c) => c.find === 'disp' },
    { k: 'm2', label: 'Compared with', kind: 'choice', options: metalOpts(SERIES.map((x) => x.sym)), def: 'Cu', show: (c) => c.find === 'cmp' },
  ],
  presets: [
    { name: 'Iron in copper(II) sulfate', find: 'disp', vals: {}, ch: { m: 'Fe', s: 'CuSO4' } },
    { name: 'Copper in iron(II) sulfate', find: 'disp', vals: {}, ch: { m: 'Cu', s: 'FeSO4' } },
    { name: 'Zinc in dilute hydrochloric acid', find: 'disp', vals: {}, ch: { m: 'Zn', s: 'HCl' } },
    { name: 'Magnesium or lead: which is more reactive?', find: 'cmp', vals: {}, ch: { m: 'Mg', m2: 'Pb' } },
    { name: 'How is aluminium extracted?', find: 'extract', vals: {}, ch: { m: 'Al' } },
  ],
  solve: (_i, c) => reactivity(c),
};

const ALIAS: Record<string, string> = { aluminum: 'Al' };
/** Put metals typed as symbols or names (Mg, zinc, Cu ...) in order, most reactive first. */
export function orderMetals(text: string): { ordered: string[]; unknown: string[]; dup: boolean } {
  const tokens = text.split(/[\s,;>]+/).filter(Boolean);
  const found: string[] = [], unknown: string[] = [];
  for (const t of tokens) {
    const low = t.toLowerCase();
    const hit = SERIES.find((x) => x.sym.toLowerCase() === low || x.name === low) ?? (ALIAS[low] ? SERIES.find((x) => x.sym === ALIAS[low]) : undefined);
    if (hit) found.push(hit.sym); else unknown.push(t);
  }
  const uniq = [...new Set(found)];
  return { ordered: uniq.sort((a, b) => rank(a) - rank(b)), unknown, dup: uniq.length < found.length };
}
