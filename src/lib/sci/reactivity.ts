// Reactivity series lab (school level): does a metal displace another metal (or hydrogen) from a solution of its
// salt, the balanced equation and what you would see, a series built from the results, and how each metal is
// extracted from its ore. Pure functions, no DOM; equations are balanced by chem.ts.
import { parseEquation, balance } from './chem.ts';

export type Metal = { sym: string; name: string; v: number; water: string; acid: string; extraction: string; ext: 'electrolysis' | 'carbon' | 'heat' | 'native' };

/** The usual school reactivity series, most reactive first (hydrogen included for comparison). */
export const SERIES: Metal[] = [
  { sym: 'K', name: 'potassium', v: 1, water: 'reacts violently with cold water; the hydrogen catches fire', acid: 'explosive: never try it', extraction: 'electrolysis of its molten chloride', ext: 'electrolysis' },
  { sym: 'Na', name: 'sodium', v: 1, water: 'reacts violently with cold water', acid: 'explosive: never try it', extraction: 'electrolysis of molten sodium chloride', ext: 'electrolysis' },
  { sym: 'Ca', name: 'calcium', v: 2, water: 'reacts steadily with cold water; floats on the bubbles', acid: 'reacts vigorously, giving hydrogen', extraction: 'electrolysis of molten calcium chloride', ext: 'electrolysis' },
  { sym: 'Mg', name: 'magnesium', v: 2, water: 'barely with cold water; reacts with hot water and burns in steam', acid: 'fizzes quickly, giving hydrogen', extraction: 'electrolysis of molten magnesium chloride', ext: 'electrolysis' },
  { sym: 'Al', name: 'aluminium', v: 3, water: 'reacts with steam (its oxide layer protects it from water)', acid: 'reacts once the oxide layer is gone, giving hydrogen', extraction: 'electrolysis of aluminium oxide dissolved in molten cryolite', ext: 'electrolysis' },
  { sym: 'Zn', name: 'zinc', v: 2, water: 'reacts with steam', acid: 'fizzes steadily, giving hydrogen', extraction: 'roasting the sulfide ore to the oxide, then heating with carbon (coke)', ext: 'carbon' },
  { sym: 'Fe', name: 'iron', v: 2, water: 'reacts with steam (slowly rusts in moist air)', acid: 'reacts slowly, giving hydrogen', extraction: 'heating the oxide ore with carbon (coke) in a blast furnace', ext: 'carbon' },
  { sym: 'Pb', name: 'lead', v: 2, water: 'no reaction', acid: 'reacts very slowly with dilute acid', extraction: 'roasting the sulfide ore, then heating the oxide with carbon', ext: 'carbon' },
  { sym: 'H', name: 'hydrogen', v: 1, water: '', acid: '', extraction: '', ext: 'carbon' },
  { sym: 'Cu', name: 'copper', v: 2, water: 'no reaction', acid: 'no reaction with dilute hydrochloric or sulfuric acid', extraction: 'heating the sulfide ore in air (self-reduction), then purifying by electrolysis', ext: 'heat' },
  { sym: 'Hg', name: 'mercury', v: 2, water: 'no reaction', acid: 'no reaction', extraction: 'heating its sulfide ore (cinnabar) in air', ext: 'heat' },
  { sym: 'Ag', name: 'silver', v: 1, water: 'no reaction', acid: 'no reaction', extraction: 'found free (native) or recovered from other ores', ext: 'native' },
  { sym: 'Au', name: 'gold', v: 3, water: 'no reaction', acid: 'no reaction', extraction: 'found free (native) as nuggets and grains', ext: 'native' },
];
export const METAL = (sym: string) => SERIES.find((m) => m.sym === sym)!;
export const rank = (sym: string) => SERIES.findIndex((m) => m.sym === sym);

export type Solution = { id: string; formula: string; text: string; metal: string; anion: 'SO4' | 'NO3' | 'Cl'; colour: string; colourName: string };
/** Salt solutions for the lab, with the colour of the dissolved ion (only copper(II) blue and iron(II) pale green). */
export const SOLUTIONS: Solution[] = [
  { id: 'MgSO4', formula: 'MgSO4', text: 'magnesium sulfate', metal: 'Mg', anion: 'SO4', colour: '#eef3f6', colourName: 'colourless' },
  { id: 'Al2(SO4)3', formula: 'Al2(SO4)3', text: 'aluminium sulfate', metal: 'Al', anion: 'SO4', colour: '#eef3f6', colourName: 'colourless' },
  { id: 'ZnSO4', formula: 'ZnSO4', text: 'zinc sulfate', metal: 'Zn', anion: 'SO4', colour: '#eef3f6', colourName: 'colourless' },
  { id: 'FeSO4', formula: 'FeSO4', text: 'iron(II) sulfate', metal: 'Fe', anion: 'SO4', colour: '#cfe8c4', colourName: 'pale green' },
  { id: 'Pb(NO3)2', formula: 'Pb(NO3)2', text: 'lead(II) nitrate', metal: 'Pb', anion: 'NO3', colour: '#eef3f6', colourName: 'colourless' },
  { id: 'HCl', formula: 'HCl', text: 'dilute hydrochloric acid', metal: 'H', anion: 'Cl', colour: '#eef3f6', colourName: 'colourless' },
  { id: 'CuSO4', formula: 'CuSO4', text: 'copper(II) sulfate', metal: 'Cu', anion: 'SO4', colour: '#5aa7de', colourName: 'blue' },
  { id: 'AgNO3', formula: 'AgNO3', text: 'silver nitrate', metal: 'Ag', anion: 'NO3', colour: '#eef3f6', colourName: 'colourless' },
];
/** Metals you can drop in (the most reactive three react with the water itself, so they are flagged). */
export const STRIPS = ['K', 'Na', 'Ca', 'Mg', 'Al', 'Zn', 'Fe', 'Pb', 'Cu', 'Ag', 'Au'];
const COLOUR: Record<string, [string, string]> = { Cu: ['#5aa7de', 'blue'], Fe: ['#cfe8c4', 'pale green'] };

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
/** Formula of the salt of a metal with valency v and an anion. */
export function salt(sym: string, v: number, anion: 'SO4' | 'NO3' | 'Cl'): string {
  const av = anion === 'SO4' ? 2 : 1, g = gcd(v, av), x = av / g, y = v / g;
  const an = y === 1 ? anion : anion === 'Cl' ? `Cl${y}` : `(${anion})${y}`;
  return `${sym}${x === 1 ? '' : x}${an}`;
}

const SUBD = '₀₁₂₃₄₅₆₇₈₉';
export const pretty = (f: string) => f.replace(/([A-Za-z)])(\d+)/g, (_, c, d: string) => c + d.replace(/\d/g, (x) => SUBD[+x]));

export type Result = {
  metal: Metal; sol: Solution; reacts: boolean; waterFirst: boolean;
  equation: string | null; seen: string[]; after: { colour: string; colourName: string };
};

/** What happens when a strip of metal goes into a solution. */
export function test(metalSym: string, solId: string): Result {
  const metal = METAL(metalSym), sol = SOLUTIONS.find((s) => s.id === solId);
  if (!metal || metal.sym === 'H' || !sol) throw new Error('Pick a metal and a solution.');
  const waterFirst = rank(metal.sym) <= rank('Ca');
  const same = metal.sym === sol.metal;
  const reacts = !same && rank(metal.sym) < rank(sol.metal);
  const seen: string[] = [];
  let equation: string | null = null, after = { colour: sol.colour, colourName: sol.colourName };
  if (waterFirst) {
    seen.push(`${cap(metal.name)} ${metal.water}. It reacts with the water before it can displace anything, so it is not used for this test.`);
    return { metal, sol, reacts: false, waterFirst, equation: null, seen, after };
  }
  if (same) { seen.push(`Nothing happens: ${metal.name} cannot displace itself.`); return { metal, sol, reacts: false, waterFirst, equation, seen, after }; }
  if (reacts) {
    const product = salt(metal.sym, metal.v, sol.anion), freed = sol.metal === 'H' ? 'H2' : sol.metal;
    const b = balance(parseEquation(`${metal.sym} + ${sol.formula} -> ${product} + ${freed}`));
    equation = b.species.map((s, i) => `${b.coefficients[i] === 1 ? '' : b.coefficients[i]}${s.text}`).reduce((acc, t, i) => acc + (i === 0 ? '' : i === b.species.findIndex((s) => s.side === 'product') ? ' → ' : ' + ') + t, '');
    const c = COLOUR[metal.sym]; after = c ? { colour: c[0], colourName: c[1] } : { colour: '#eef3f6', colourName: 'colourless' };
    if (sol.metal === 'H') seen.push(`Bubbles of hydrogen gas form on the ${metal.name}${metal.sym === 'Pb' ? ' (very slowly)' : ''}.`);
    else seen.push(`A coating of ${METAL(sol.metal).name} forms on the ${metal.name} strip${sol.metal === 'Cu' ? ' (reddish-brown)' : sol.metal === 'Ag' ? ' (shiny grey crystals)' : ''}.`);
    if (after.colourName !== sol.colourName) seen.push(`The solution changes from ${sol.colourName} to ${after.colourName}.`);
    if (metal.sym === 'Al') seen.push('In a real lab aluminium can be slow to start, because a thin oxide layer protects it.');
  } else seen.push(`No change: ${metal.name} is less reactive than ${sol.metal === 'H' ? 'hydrogen' : METAL(sol.metal).name}, so it cannot push it out of the solution.`);
  return { metal, sol, reacts, waterFirst, equation, seen, after };
}
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/** Order the metals from a set of results: a metal that displaced another sits above it, and one that failed to sits
 *  below it. Metals are ranked by how many others are known to be below them; ties stay together. Only results without waterFirst count. */
export function seriesFrom(results: { metal: string; solMetal: string; reacts: boolean }[]): { sym: string; wins: number; tested: boolean }[] {
  const syms = new Set<string>();
  for (const r of results) { syms.add(r.metal); syms.add(r.solMetal); }
  const beats = new Map<string, Set<string>>();
  // A displaces B: A is above B. A fails to displace B: B is above A.
  const above = (a: string, b: string) => { if (!beats.has(a)) beats.set(a, new Set()); beats.get(a)!.add(b); };
  for (const r of results) if (r.reacts) above(r.metal, r.solMetal); else above(r.solMetal, r.metal);
  // transitive closure so A > B and B > C gives A > C
  let grew = true;
  while (grew) { grew = false; for (const [a, s] of beats) for (const b of [...s]) for (const c of beats.get(b) ?? []) if (!s.has(c)) { s.add(c); grew = true; } }
  return [...syms].map((sym) => ({ sym, wins: beats.get(sym)?.size ?? 0, tested: true })).sort((a, b) => b.wins - a.wins);
}
