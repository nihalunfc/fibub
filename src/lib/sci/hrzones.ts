// Heart rate and cycling power training zones. Plain maths, no DOM.
// Maximum heart rate from age (four published equations), zones as % of HRmax or Karvonen % of heart rate
// reserve, and power zones as % of functional threshold power (FTP).

export type MaxEq = 'fox' | 'tanaka' | 'gellish' | 'nes';
export const MAX_EQS: { id: MaxEq; name: string; a: number; b: number; cite: string }[] = [
  { id: 'fox', name: '220 − age', a: 220, b: 1, cite: 'Fox, Naughton and Haskell, 1971' },
  { id: 'tanaka', name: 'Tanaka: 208 − 0.7 × age', a: 208, b: 0.7, cite: 'Tanaka, Monahan and Seals, J Am Coll Cardiol 2001' },
  { id: 'gellish', name: 'Gellish: 207 − 0.7 × age', a: 207, b: 0.7, cite: 'Gellish et al., Med Sci Sports Exerc 2007' },
  { id: 'nes', name: 'Nes: 211 − 0.64 × age', a: 211, b: 0.64, cite: 'Nes et al., Scand J Med Sci Sports 2013' },
];

/** Estimated maximum heart rate (beats/min) from age in years. */
export function maxHR(age: number, eq: MaxEq): number {
  const e = MAX_EQS.find((m) => m.id === eq);
  if (!e) throw new Error('Unknown equation');
  return e.a - e.b * age;
}

/** Heart rate (beats/min) at a fraction of HRmax, or of the heart rate reserve (Karvonen) when rest is given. */
export function hrAt(frac: number, hrMax: number, hrRest?: number): number {
  return hrRest == null ? frac * hrMax : hrRest + frac * (hrMax - hrRest);
}

/** Zone boundaries in per cent, e.g. "50, 60, 70, 80, 90, 100": rising numbers, at least two. */
export function parseBounds(s: string, lo = 0, hi = 1000): number[] {
  const parts = s.split(/[,;\s]+/).map((t) => t.trim()).filter(Boolean);
  const v = parts.map((t) => Number(t.replace('%', '').replace(',', '.')));
  if (v.length < 2) throw new Error('Type at least two boundaries, such as 50, 60, 70, 80, 90, 100.');
  if (v.some((x) => !Number.isFinite(x))) throw new Error(`"${parts[v.findIndex((x) => !Number.isFinite(x))]}" is not a number.`);
  for (let i = 1; i < v.length; i++) if (!(v[i] > v[i - 1])) throw new Error('Zone boundaries must rise from left to right.');
  if (v[0] < lo || v[v.length - 1] > hi) throw new Error(`Boundaries must be between ${lo} and ${hi} %.`);
  return v;
}

export type Zone = { n: number; loPct: number; hiPct: number; lo: number; hi: number };

/** Heart rate zones between consecutive boundaries (per cent). */
export function hrZones(bounds: number[], hrMax: number, hrRest?: number): Zone[] {
  const out: Zone[] = [];
  for (let i = 0; i + 1 < bounds.length; i++) out.push({ n: i + 1, loPct: bounds[i], hiPct: bounds[i + 1], lo: hrAt(bounds[i] / 100, hrMax, hrRest), hi: hrAt(bounds[i + 1] / 100, hrMax, hrRest) });
  return out;
}

/** Power zones (watts) from FTP: the first zone starts at 0, the last is open-ended (hi = Infinity). */
export function powerZones(bounds: number[], ftp: number): Zone[] {
  const b = [0, ...bounds, Infinity];
  const out: Zone[] = [];
  for (let i = 0; i + 1 < b.length; i++) out.push({ n: i + 1, loPct: b[i], hiPct: b[i + 1], lo: (b[i] / 100) * ftp, hi: (b[i + 1] / 100) * ftp });
  return out;
}
