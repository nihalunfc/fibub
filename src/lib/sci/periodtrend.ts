// Periodic trends for the school periodic-trends tool: atomic radius, first ionisation energy and electronegativity
// across a period and down a group, with the textbook exceptions flagged. Electronegativity and ionisation energy
// come from ptable.ts (rounded textbook / NIST values). Plain TypeScript, no DOM.
import { TABLE, type ElementInfo } from './ptable.ts';
import { type Question, one, n } from './h4quiz.ts';

/** Approximate single-bond covalent radii in pm, rounded to 5 pm, for the s- and p-block elements of periods 1 to 6
 *  (noble gases left out: they form almost no bonds, so their sizes are measured differently). Sources differ by
 *  5 to 10 pm, so read the trends, not the last digit. */
export const RADIUS: Record<number, number> = {
  1: 30,
  3: 130, 4: 95, 5: 85, 6: 75, 7: 70, 8: 65, 9: 55,
  11: 165, 12: 140, 13: 120, 14: 110, 15: 105, 16: 105, 17: 100,
  19: 205, 20: 175, 31: 120, 32: 120, 33: 120, 34: 120, 35: 120,
  37: 220, 38: 195, 49: 140, 50: 140, 51: 140, 52: 140, 53: 140,
  55: 245, 56: 215, 81: 145, 82: 145, 83: 150, 84: 140, 85: 150,
};
export const EV_TO_KJ = 96.485; // kJ/mol per eV

export type Prop = 'radius' | 'ie' | 'en';
export const PROPS: { id: Prop; name: string; unit: string; short: string }[] = [
  { id: 'radius', name: 'Atomic radius', unit: 'pm', short: 'radius' },
  { id: 'ie', name: 'First ionisation energy', unit: 'kJ/mol', short: 'ionisation energy' },
  { id: 'en', name: 'Electronegativity (Pauling)', unit: '', short: 'electronegativity' },
];
export function value(e: ElementInfo, p: Prop): number {
  if (p === 'radius') return RADIUS[e.z] ?? NaN;
  if (p === 'ie') return Math.round(e.ie * EV_TO_KJ);
  return e.en;
}

/** Elements on the drawn table (periods 1 to 6, no f-block). */
export const MAIN = TABLE.filter((e) => e.z <= 86 && e.group !== null);
export const inPeriod = (p: number) => MAIN.filter((e) => e.period === p).sort((a, b) => a.group! - b.group!);
export const inGroup = (g: number) => MAIN.filter((e) => e.group === g).sort((a, b) => a.z - b.z);

export type Flag = { from: ElementInfo; to: ElementInfo; why: string };
/** Places where a trend breaks its usual direction, with the reason a textbook gives. */
export function exceptions(list: ElementInfo[], p: Prop, along: 'period' | 'group'): Flag[] {
  const out: Flag[] = [];
  for (let i = 1; i < list.length; i++) {
    const a = list[i - 1], b = list[i], va = value(a, p), vb = value(b, p);
    if (!Number.isFinite(va) || !Number.isFinite(vb)) continue;
    if (along === 'period' && p === 'ie' && vb < va && a.group !== null && b.group !== null) {
      if (a.group === 2 && b.group === 13) out.push({ from: a, to: b, why: `${b.symbol}'s outer electron is alone in a p subshell, a little higher in energy and better shielded than ${a.symbol}'s full s subshell, so it is easier to remove.` });
      else if (a.group === 15 && b.group === 16) out.push({ from: a, to: b, why: `${a.symbol} has a half-full p subshell (one electron in each orbital). ${b.symbol}'s extra electron has to pair up, and the two repel, so one is easier to remove.` });
      else if (a.group === 12 && b.group === 13) out.push({ from: a, to: b, why: `${a.symbol} has full s and d subshells; ${b.symbol}'s single p electron is easier to remove.` });
      else if (a.group < 3 || b.group > 12) out.push({ from: a, to: b, why: 'a small dip across the period.' });
    }
    if (along === 'group' && p === 'radius' && vb <= va && a.period > 1) out.push({ from: a, to: b, why: `${b.symbol} is hardly bigger than ${a.symbol}: the d (and f) electrons filled in between shield the nucleus poorly, so the extra protons pull the shells in.` });
    if (along === 'group' && p === 'ie' && vb > va && a.period > 1) out.push({ from: a, to: b, why: `${b.symbol}'s first ionisation energy is a little higher than ${a.symbol}'s: poor shielding by the inner d and f electrons.` });
    if (along === 'group' && p === 'en' && vb > va + 0.05 && a.period > 1) out.push({ from: a, to: b, why: `${b.symbol} is a little more electronegative than ${a.symbol}: poor shielding by the filled d and f subshells.` });
  }
  return out;
}

// ---- Check yourself ---------------------------------------------------------------------------------
const byZ = (z: number) => TABLE[z - 1];
export function questions(rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  { const [a, b] = one(rng, [[4, 5], [7, 8], [12, 13], [15, 16], [3, 9], [11, 17], [3, 11], [9, 17]] as const).map(byZ), big = value(a, 'ie') > value(b, 'ie') ? a : b;
    qs.push({ text: `Which has the higher first ionisation energy, ${a.name} (Z = ${a.z}) or ${b.name} (Z = ${b.z})? Type its atomic number.`, ans: big.z, unit: '', work: `${a.symbol}: ${value(a, 'ie')} kJ/mol, ${b.symbol}: ${value(b, 'ie')} kJ/mol, so ${big.name}.${(a.z === 4 || a.z === 7 || a.z === 12 || a.z === 15) && b.z === a.z + 1 ? ' This is one of the exceptions to the rising trend across a period.' : ''}`, tol: 0.01 }); }
  { const [a, b] = one(rng, [[3, 4], [11, 17], [3, 19], [9, 53], [12, 20], [6, 14], [13, 15]] as const).map(byZ), big = value(a, 'radius') > value(b, 'radius') ? a : b;
    qs.push({ text: `Which atom is bigger, ${a.name} (Z = ${a.z}) or ${b.name} (Z = ${b.z})? Type its atomic number.`, ans: big.z, unit: '', work: `Radius ${a.symbol} ≈ ${value(a, 'radius')} pm, ${b.symbol} ≈ ${value(b, 'radius')} pm. Atoms shrink across a period (more protons pull the same shell in) and grow down a group (more shells).`, tol: 0.01 }); }
  { const z = one(rng, [1, 3, 6, 7, 8, 11, 17, 19]), e = byZ(z), kj = e.ie * EV_TO_KJ;
    qs.push({ text: `The first ionisation energy of ${e.name} is ${e.ie} eV per atom. What is it in kJ/mol? (1 eV per atom = 96.485 kJ/mol)`, ans: kj, unit: 'kJ/mol', work: `${e.ie} × 96.485 = ${n(kj, 0)} kJ/mol.`, tol: Math.max(1, kj * 0.005) }); }
  { const [a, b] = one(rng, [[6, 7], [8, 9], [9, 17], [15, 16], [11, 12], [3, 11], [7, 15]] as const).map(byZ), big = value(a, 'en') > value(b, 'en') ? a : b;
    qs.push({ text: `Which is more electronegative, ${a.name} (Z = ${a.z}) or ${b.name} (Z = ${b.z})? Type its atomic number.`, ans: big.z, unit: '', work: `${a.symbol}: ${value(a, 'en')}, ${b.symbol}: ${value(b, 'en')} on the Pauling scale. Electronegativity rises across a period and falls down a group; fluorine is the highest of all.`, tol: 0.01 }); }
  return qs;
}
