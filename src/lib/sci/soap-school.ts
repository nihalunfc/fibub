// #1297 Soap, micelles and hard water: a counting model. Each Ca²⁺ or Mg²⁺ ion in hard water takes two soap
// anions out as insoluble scum (Ca(RCOO)₂); only the soap left over can make lather and wrap oil into micelles.
// Detergent anions do not form scum. Teaching model with small whole numbers, not lab data. Pure maths, no DOM.

export type Cleaner = 'soap' | 'detergent';
export type Wash = { scum: number; free: number; lather: number; micelles: boolean };

/** Free surface-active molecules needed before micelles (and lasting lather) form, in this model. */
export const CMC = 3;

/** What happens when `n` cleaner molecules meet `ions` hardness ions. */
export function wash(n: number, ions: number, kind: Cleaner): Wash {
  const N = Math.max(0, Math.floor(n)), I = Math.max(0, Math.floor(ions));
  const scum = kind === 'soap' ? Math.min(I, Math.floor(N / 2)) : 0;
  const free = N - 2 * scum;
  return { scum, free, lather: Math.max(0, free - CMC + 1), micelles: free >= CMC };
}

/** Molecules (drops) needed before lather first appears. */
export const dropsForLather = (ions: number, kind: Cleaner) => (kind === 'soap' ? 2 * Math.max(0, Math.floor(ions)) : 0) + CMC;

export type Tube = { id: string; name: string; ions: number };
export const TUBES: Tube[] = [
  { id: 'dist', name: 'Distilled water', ions: 0 },
  { id: 'tap', name: 'Tap water (slightly hard)', ions: 2 },
  { id: 'hard', name: 'Hard water', ions: 6 },
];

/** Points on a circle round (cx, cy): the heads of a micelle, tails pointing in. */
export function ring(k: number, cx: number, cy: number, r: number): { x: number; y: number; angle: number }[] {
  return Array.from({ length: k }, (_, i) => { const a = (2 * Math.PI * i) / Math.max(1, k) - Math.PI / 2; return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), angle: a }; });
}
