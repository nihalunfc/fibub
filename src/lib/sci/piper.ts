// Major-ion water chemistry for Piper and Stiff diagrams: mg/L to meq/L, ion balance, percentages, diamond position
// and water type. Plain maths; no DOM.

import { toXY } from './ternary.ts';

/** Molar mass (g/mol, from standard atomic weights) and charge of each major ion. */
export const IONS = {
  Ca: { m: 40.078, z: 2 }, Mg: { m: 24.305, z: 2 }, Na: { m: 22.98977, z: 1 }, K: { m: 39.0983, z: 1 },
  HCO3: { m: 61.0168, z: 1 }, CO3: { m: 60.0089, z: 2 }, SO4: { m: 96.0626, z: 2 }, Cl: { m: 35.453, z: 1 }, NO3: { m: 62.0049, z: 1 },
} as const;
export type Ion = keyof typeof IONS;
/** Equivalent weight of CaCO3 (g per equivalent), for alkalinity and hardness "as CaCO3". */
export const CACO3_EQ = 100.0869 / 2;

/** mg/L to meq/L. */
export const meq = (mgL: number, ion: Ion) => (mgL * IONS[ion].z) / IONS[ion].m;
/** mmol/L to meq/L. */
export const meqFromMmol = (mmol: number, ion: Ion) => mmol * IONS[ion].z;

export type Meq = Partial<Record<Ion, number>>;

/** Sums, ion balance error (%), Piper percentages and diamond position for one sample in meq/L. */
export function analyse(s: Meq) {
  const v = (k: Ion) => (s[k] && s[k]! > 0 ? s[k]! : 0);
  const cat = v('Ca') + v('Mg') + v('Na') + v('K'), an = v('HCO3') + v('CO3') + v('SO4') + v('Cl') + v('NO3');
  const ibe = cat + an > 0 ? ((cat - an) / (cat + an)) * 100 : NaN;
  const c3 = v('Ca') + v('Mg') + v('Na') + v('K'), a3 = v('HCO3') + v('CO3') + v('SO4') + v('Cl');
  const cp = c3 > 0 ? { Ca: v('Ca') / c3, Mg: v('Mg') / c3, NaK: (v('Na') + v('K')) / c3 } : null;
  const ap = a3 > 0 ? { HCO3: (v('HCO3') + v('CO3')) / a3, SO4: v('SO4') / a3, Cl: v('Cl') / a3 } : null;
  return { cat, an, ibe, cp, ap };
}

/**
 * Piper layout with triangle side 1 and a gap g between the triangles. Cations on the left (Ca bottom left, Na+K bottom
 * right, Mg top), anions on the right (HCO3+CO3 bottom left, Cl bottom right, SO4 top). The diamond sits above, with its
 * bottom corner at Na-HCO3, left Ca+Mg-HCO3, right Na-Cl and top Ca+Mg with SO4+Cl. Coordinates have y up.
 */
export function piperXY(cp: { Ca: number; Mg: number; NaK: number }, ap: { HCO3: number; SO4: number; Cl: number }, g = 0.2) {
  const cat = toXY(cp.Mg, cp.Ca, cp.NaK), an = toXY(ap.SO4, ap.HCO3, ap.Cl);
  const h = Math.sqrt(3) / 2, bx = 1 + g / 2, by = g * h;
  const caMg = cp.Ca + cp.Mg, so4cl = ap.SO4 + ap.Cl;
  // Up-right along (0.5, h) by SO4+Cl, up-left along (-0.5, h) by Ca+Mg.
  const dia: [number, number] = [bx + 0.5 * so4cl - 0.5 * caMg, by + h * (so4cl + caMg)];
  return { cat, an: [an[0] + 1 + g, an[1]] as [number, number], dia };
}

/** The classic four fields of the Piper diamond, split at 50 %. */
export function diamondField(cp: { Ca: number; Mg: number; NaK: number }, ap: { HCO3: number; SO4: number; Cl: number }) {
  const hard = cp.Ca + cp.Mg >= 0.5, salty = ap.SO4 + ap.Cl >= 0.5;
  return hard ? (salty ? 'Ca-Mg-Cl-SO4' : 'Ca-Mg-HCO3') : salty ? 'Na-K-Cl-SO4' : 'Na-K-HCO3';
}

/** Water type: the cations and anions holding at least `cut` of their side (in meq), largest first. */
export function waterType(s: Meq, cut = 0.2) {
  const v = (k: Ion) => (s[k] && s[k]! > 0 ? s[k]! : 0);
  const name = (list: [string, number][]) => {
    const t = list.reduce((a, [, x]) => a + x, 0); if (!(t > 0)) return '';
    const keep = list.filter(([, x]) => x / t >= cut).sort((a, b) => b[1] - a[1]);
    return keep.map(([n]) => n).join('-');
  };
  const c = name([['Ca', v('Ca')], ['Mg', v('Mg')], ['Na', v('Na') + v('K')]]);
  const a = name([['HCO3', v('HCO3') + v('CO3')], ['SO4', v('SO4')], ['Cl', v('Cl')], ['NO3', v('NO3')]]);
  return c && a ? `${c}-${a}` : '';
}

/** Total hardness as CaCO3 (mg/L) from Ca and Mg in meq/L. */
export const hardness = (caMeq: number, mgMeq: number) => ((caMeq > 0 ? caMeq : 0) + (mgMeq > 0 ? mgMeq : 0)) * CACO3_EQ;
