// Pressure explorer (Learn #1219): pressure = force ÷ area for everyday objects pressing on soft clay.
// Plain TypeScript, no DOM. The contact areas and the clay limits are made-up, rounded teaching values.

export const G = 9.8; // m/s², rounded school value

export type Thing = { id: string; name: string; area: number; note: string };
/** Contact areas in m² (rounded teaching values). */
export const THINGS: Thing[] = [
  { id: 'needle', name: 'Needle point', area: 1e-8, note: '0.01 mm²' },
  { id: 'nail', name: 'Nail tip', area: 1e-6, note: '1 mm²' },
  { id: 'knife', name: 'Knife edge', area: 1e-5, note: '10 mm²: 50 mm long, 0.2 mm wide' },
  { id: 'finger', name: 'Fingertip', area: 1e-4, note: '1 cm²' },
  { id: 'brick-end', name: 'Brick on its end', area: 5e-3, note: '10 cm × 5 cm = 50 cm²' },
  { id: 'palm', name: 'Flat palm', area: 1e-2, note: '100 cm²' },
  { id: 'brick-flat', name: 'Brick lying flat', area: 2e-2, note: '20 cm × 10 cm = 200 cm²' },
  { id: 'shoe', name: 'School shoe', area: 2.5e-2, note: '250 cm²' },
  { id: 'snowshoe', name: 'Snowshoe', area: 1e-1, note: '0.1 m² = 1,000 cm²' },
];

/** Pressure in pascals (N/m²) from force in newtons and area in m². */
export const pressure = (F: number, A: number) => F / A;
/** Weight in newtons of a mass in kg. */
export const weight = (m: number) => m * G;

/** Made-up limits for soft modelling clay: no mark below 5 kPa, a dent up to 500 kPa, then it goes in. */
export const CLAY = { mark: 5e3, pierce: 5e5 };
export type Effect = 'none' | 'dent' | 'pierce';
export const effect = (P: number): Effect => (P < CLAY.mark ? 'none' : P < CLAY.pierce ? 'dent' : 'pierce');
/** How far into the clay the object goes, 0 to 1 (picture only): grows with log10 of the pressure. */
export const depth = (P: number) => Math.max(0, Math.min(1, Math.log10(Math.max(P, 1) / CLAY.mark) / Math.log10(CLAY.pierce / CLAY.mark * 10)));

/** A pressure in Pa written for school, with its best unit: "2,500 Pa", "25 kPa", "1.2 MPa", "3 GPa". */
export function showP(P: number): string {
  if (!Number.isFinite(P)) return '–';
  const u: [number, string][] = [[1e9, 'GPa'], [1e6, 'MPa'], [1e3, 'kPa']];
  for (const [k, s] of u) if (P >= k * 0.99995 && P >= 1e4) return `${nice(P / k)} ${s}`;
  return `${nice(P)} Pa`;
}
/** 3 significant figures, thousands commas, minus sign as −. */
export function nice(x: number, n = 3): string {
  if (!Number.isFinite(x)) return '–';
  if (x === 0) return '0';
  const a = Math.abs(x), d = Math.max(0, n - 1 - Math.floor(Math.log10(a) + 1e-9));
  const s = (Math.round(a * 10 ** d) / 10 ** d).toLocaleString('en', { maximumFractionDigits: d });
  return (x < 0 ? '−' : '') + s;
}
/** An area in m² written in the handiest unit (mm², cm² or m²). */
export function showA(A: number): string {
  if (A < 1e-4 * 0.99995) return `${nice(A * 1e6)} mm²`;
  if (A < 1 * 0.99995) return `${nice(A * 1e4)} cm²`;
  return `${nice(A)} m²`;
}
/** Power of ten for log axes: 1e-6 → "10⁻⁶". */
export function pow10(e: number): string {
  const sup: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  return '10' + String(e).split('').map((c) => sup[c]).join('');
}

/** Area slider position (0 to 800) ↔ area in m², from 10⁻⁸ to 1 m² on a log scale. */
export const sliderToArea = (s: number) => 10 ** (-8 + s / 100);
export const areaToSlider = (A: number) => Math.round((Math.log10(A) + 8) * 100);

export type Q = { q: string; ans: number; unit?: string; tol?: number; choices?: string[]; work: string };
/** Fresh "Check yourself" questions; `lvl` is '8' or '11'; `rnd` gives numbers in [0, 1). */
export function questions(lvl: string, rnd: () => number = Math.random): Q[] {
  const ri = (lo: number, hi: number) => lo + Math.floor(rnd() * (hi - lo + 1));
  const F1 = ri(2, 30) * 10, A1 = ri(2, 20) * 5; // N, cm²
  const P1 = F1 / (A1 * 1e-4);
  const F2 = ri(2, 20), A2 = ri(1, 9) / 10; // N, mm²
  const P2 = F2 / (A2 * 1e-6) / 1e3; // kPa
  const P3 = ri(2, 40) * 5, A3 = ri(2, 30) * 10; // kPa, cm²
  const F3 = P3 * 1e3 * A3 * 1e-4;
  const out: Q[] = [
    { q: `A force of ${F1} N presses on an area of ${A1} cm². What is the pressure in pascals? (1 cm² = 0.0001 m²)`, ans: P1, unit: 'Pa', work: `Area = ${A1} × 0.0001 = ${nice(A1 * 1e-4)} m². Pressure = force ÷ area = ${F1} ÷ ${nice(A1 * 1e-4)} = ${nice(P1, 4)} Pa.` },
    { q: `A pin is pushed with ${F2} N. Its point has an area of ${A2} mm². What is the pressure in kilopascals? (1 mm² = 0.000001 m²)`, ans: P2, unit: 'kPa', work: `Area = ${A2} × 10⁻⁶ m². Pressure = ${F2} ÷ (${A2} × 10⁻⁶) = ${nice(P2 * 1e3, 4)} Pa = ${nice(P2, 4)} kPa.` },
    { q: `A pressure of ${P3} kPa acts on an area of ${A3} cm². What force does it make, in newtons?`, ans: F3, unit: 'N', work: `Force = pressure × area = ${P3 * 1000} Pa × ${nice(A3 * 1e-4)} m² = ${nice(F3, 4)} N.` },
  ];
  if (lvl === '11') {
    const m = ri(2, 12) / 2, a = ri(2, 5) * 5, b = ri(1, 4) * 5, W = weight(m), P = W / (a * b * 1e-4);
    out.push({ q: `A box of mass ${m} kg rests on a face ${a} cm by ${b} cm. What pressure does it put on the floor, in pascals? (g = 9.8 m/s²)`, ans: P, unit: 'Pa', work: `Thrust = weight = mg = ${m} × 9.8 = ${nice(W, 4)} N. Area = ${a} × ${b} = ${a * b} cm² = ${nice(a * b * 1e-4)} m². Pressure = ${nice(W, 4)} ÷ ${nice(a * b * 1e-4)} = ${nice(P, 4)} Pa.` });
  }
  const k = ri(2, 5);
  out.push({ q: `The same force is spread over an area ${k} times smaller. What happens to the pressure?`, ans: 1, choices: [`It becomes ${k} times smaller`, `It becomes ${k} times bigger`, 'It stays the same'], work: `Pressure = force ÷ area. Dividing by a number ${k} times smaller gives an answer ${k} times bigger.` });
  return out;
}
