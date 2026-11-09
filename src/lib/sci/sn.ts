// SN1 or SN2? A school-level rule model: substrate class, nucleophile strength, solvent and leaving group each
// push towards one mechanism; the totals decide, with reasons. Also schematic energy profiles and the 3D geometry
// of backside attack (Walden inversion) and of the planar carbocation (racemisation). Teaching model, no DOM.
// Used by the #1108 SN1 vs SN2 tool.

export type Substrate = 'methyl' | 'primary' | 'secondary' | 'tertiary' | 'benzylic';
export type Nuc = 'strong' | 'weak';
export type Solvent = 'aprotic' | 'protic';
export type Leaving = 'I' | 'Br' | 'Cl' | 'F';

export const SUBSTRATES: { id: Substrate; label: string; example: string }[] = [
  { id: 'methyl', label: 'Methyl', example: 'CH₃–Br' },
  { id: 'primary', label: 'Primary (1°)', example: 'CH₃CH₂–Br' },
  { id: 'secondary', label: 'Secondary (2°)', example: 'CH₃CH₂CH(CH₃)–Br (2-bromobutane)' },
  { id: 'tertiary', label: 'Tertiary (3°)', example: '(CH₃)₃C–Br' },
  { id: 'benzylic', label: 'Benzylic (1°, next to a benzene ring)', example: 'C₆H₅CH₂–Br' },
];
export const NUCS: { id: Nuc; label: string; examples: string }[] = [
  { id: 'strong', label: 'Strong, charged', examples: 'OH⁻, CN⁻, I⁻, CH₃O⁻' },
  { id: 'weak', label: 'Weak, neutral', examples: 'H₂O, CH₃OH, C₂H₅OH' },
];

export type Verdict = { sn1: number; sn2: number; winner: 'SN1' | 'SN2' | 'both'; reasons: string[]; elimination: boolean; rate: string };

export function predict(s: Substrate, n: Nuc, v: Solvent, lg: Leaving = 'Br'): Verdict {
  const reasons: string[] = [];
  let sn1 = 0, sn2 = 0;
  const S2 = { methyl: 3, primary: 2, secondary: 0, tertiary: -4, benzylic: 2 }[s];
  const S1 = { methyl: -4, primary: -3, secondary: 0, tertiary: 3, benzylic: 2 }[s];
  sn2 += S2; sn1 += S1;
  reasons.push({
    methyl: 'Methyl: the back of the carbon is wide open for SN2, and a CH₃⁺ cation is far too unstable for SN1.',
    primary: 'Primary: little crowding, so SN2 is easy; a primary carbocation is too unstable for SN1.',
    secondary: 'Secondary: some crowding and a fairly stable carbocation, so either can happen: the other conditions decide.',
    tertiary: 'Tertiary: three groups block the back of the carbon (no SN2), and the tertiary carbocation is stable (SN1).',
    benzylic: 'Benzylic: open for SN2, and the carbocation is stabilised by the ring (resonance), so SN1 is possible too.',
  }[s]);
  if (n === 'strong') { sn2 += 2; reasons.push('A strong, charged nucleophile pushes in fast: it favours SN2 (it takes part in the slow step).'); }
  else { sn1 += 1; sn2 -= 1; reasons.push('A weak, neutral nucleophile waits for the carbocation to form: it favours SN1.'); }
  if (v === 'protic') { sn1 += 2; reasons.push('A polar protic solvent (water, alcohols) surrounds and stabilises the ions formed in SN1, and holds back the nucleophile.'); }
  else { sn2 += 1; sn1 -= 1; reasons.push('A polar aprotic solvent (acetone, DMSO) leaves the nucleophile free and reactive: it favours SN2.'); }
  const rate = { I: 'fastest', Br: 'fast', Cl: 'slower', F: 'very slow' }[lg];
  reasons.push(`Leaving group ${lg}⁻: ${rate}. The C–X bond strength goes C–I < C–Br < C–Cl < C–F, so iodides react fastest by both routes; it changes the speed, not the choice.`);
  const winner = sn2 - sn1 >= 2 ? 'SN2' : sn1 - sn2 >= 2 ? 'SN1' : 'both';
  const elimination = s === 'tertiary' && n === 'strong' || s === 'secondary' && n === 'strong' && v === 'protic';
  return { sn1, sn2, winner, reasons, elimination, rate };
}

/** Schematic energy profiles (arbitrary units, not to scale): points [x, E] for each mechanism. Lower barriers for the favoured route. */
export function profile(mech: 'SN1' | 'SN2', vd: Verdict, lg: Leaving = 'Br'): [number, number][] {
  const lgShift = { I: -6, Br: 0, Cl: 6, F: 16 }[lg];
  if (mech === 'SN2') { const ts = 80 - 6 * vd.sn2 + lgShift; return [[0, 0], [0.5, ts], [1, -15]]; }
  const ts1 = 85 - 6 * vd.sn1 + lgShift, mid = ts1 - 25, ts2 = mid + 10;
  return [[0, 0], [0.33, ts1], [0.55, mid], [0.72, ts2], [1, -15]];
}

/** Smooth curve through profile points (cosine joins between maxima and minima). */
export function curve(pts: [number, number][], steps = 200): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const x = i / steps; let k = 0; while (k < pts.length - 2 && x > pts[k + 1][0]) k++;
    const [x0, y0] = pts[k], [x1, y1] = pts[k + 1], t = (x - x0) / (x1 - x0);
    out.push([x, y0 + (y1 - y0) * (1 - Math.cos(Math.PI * Math.max(0, Math.min(1, t)))) / 2]);
  }
  return out;
}

export type P3 = [number, number, number];
/**
 * Geometry along the reaction (t from 0 to 1). The carbon is at the origin, the leaving group X starts on +x.
 * SN2: Nu comes in from −x; the three other groups flip like an umbrella (x from −1/3 through 0 to +1/3).
 * SN1: X leaves first (t < 0.5) through a flat carbocation; then Nu attacks from the chosen side.
 */
export function geometry(mech: 'SN1' | 'SN2', t: number, side: 1 | -1 = -1) {
  const ring = (ax: number): P3[] => [0, 1, 2].map((k) => { const a = (k * 2 * Math.PI) / 3 + Math.PI / 2, r = Math.sqrt(Math.max(0, 1 - ax * ax)); return [ax, r * Math.cos(a), r * Math.sin(a)]; });
  const u = Math.max(0, Math.min(1, t));
  if (mech === 'SN2') {
    const a = Math.min(1, u / 0.5), b = Math.max(0, (u - 0.5) / 0.5);
    return { groups: ring(-1 / 3 + (2 / 3) * u), x: u < 0.5 ? 1 + 0.3 * a : 1.3 + 1.9 * b, nu: -(u < 0.5 ? 3.2 - 1.9 * a : 1.3 - 0.3 * b), ts: Math.abs(u - 0.5) < 0.06, cation: false };
  }
  if (u < 0.5) { const f = u / 0.5; return { groups: ring(-1 / 3 + f / 3), x: 1 + 2.4 * f, nu: side * 3.4, ts: false, cation: f > 0.9 }; }
  const f = (u - 0.5) / 0.5;
  // Nu comes in on the chosen side; the groups bend away from it.
  return { groups: ring((-side / 3) * f), x: 3.4 + f, nu: side * (3.4 - 2.4 * f), ts: false, cation: f < 0.1 };
}

/** Starting and product arrangements for the secondary example (groups H, CH₃, C₂H₅ round the carbon). */
export function arrangement(mech: 'SN2' | 'SN1start' | 'SN1front' | 'SN1back'): P3[] {
  // Returns [site of X or Nu, H, CH₃, C₂H₅] directions.
  const g = (ax: number) => geometry('SN2', 0).groups.map((p) => [ax, p[1] * Math.sqrt(1 - ax * ax) / Math.sqrt(8 / 9), p[2] * Math.sqrt(1 - ax * ax) / Math.sqrt(8 / 9)] as P3);
  if (mech === 'SN1start') return [[1, 0, 0], ...g(-1 / 3)];
  if (mech === 'SN2' || mech === 'SN1back') return [[-1, 0, 0], ...g(1 / 3)];
  return [[1, 0, 0], ...g(-1 / 3)];
}
