// Glucose ring flipper (Learn, #1437): Fischer projection → Haworth ring for aldohexoses, α and β anomers, D and L,
// and mutarotation of glucose as a first-order approach to equilibrium. Plain data and maths, no DOM.

export type Side = 'R' | 'L';
export type Sugar = { id: string; name: string; fischer: [Side, Side, Side, Side]; note: string };
/** Side of the –OH on C2, C3, C4 and C5 in the Fischer projection (aldehyde at the top). */
export const SUGARS: Sugar[] = [
  { id: 'glucose', name: 'D-glucose', fischer: ['R', 'L', 'R', 'R'], note: 'the sugar in your blood; every –OH of β-D-glucose sits round the ring’s edge (equatorial)' },
  { id: 'galactose', name: 'D-galactose', fischer: ['R', 'L', 'L', 'R'], note: 'differs from glucose only at C4 (a C4 epimer); part of milk sugar, lactose' },
  { id: 'mannose', name: 'D-mannose', fischer: ['L', 'L', 'R', 'R'], note: 'differs from glucose only at C2 (a C2 epimer)' },
  { id: 'l-glucose', name: 'L-glucose', fischer: ['L', 'R', 'L', 'L'], note: 'the mirror image of D-glucose; every –OH swaps side' },
];
export const sugarById = (id: string) => SUGARS.find((s) => s.id === id)!;
/** D or L from the side of the –OH on the last stereocentre (C5). */
export const family = (s: Sugar): 'D' | 'L' => (s.fischer[3] === 'R' ? 'D' : 'L');

export type Anomer = 'alpha' | 'beta';
export type RingGroup = { c: number; up: string; down: string };
/** Groups above and below the ring in the standard Haworth drawing (ring O at the back right, C1 on the right).
 * C2 to C4: right in Fischer → down. C5: CH₂OH up for D, down for L. C1: α has the –OH on the opposite face to
 * CH₂OH (trans), β on the same face (cis). */
export function haworth(s: Sugar, a: Anomer): RingGroup[] {
  const d = family(s) === 'D';
  const out: RingGroup[] = [];
  const ohUpC1 = a === 'beta' ? d : !d;
  out.push({ c: 1, up: ohUpC1 ? 'OH' : 'H', down: ohUpC1 ? 'H' : 'OH' });
  for (let k = 0; k < 3; k++) { const right = s.fischer[k] === 'R'; out.push({ c: k + 2, up: right ? 'H' : 'OH', down: right ? 'OH' : 'H' }); }
  out.push({ c: 5, up: d ? 'CH₂OH' : 'H', down: d ? 'H' : 'CH₂OH' });
  return out;
}
/** Stereocentres: 4 in the open chain (C2 to C5), 5 in the ring (C1 becomes one). */
export const stereocentres = (ring: boolean) => (ring ? 5 : 4);

// ---------- Mutarotation of D-glucose (rounded textbook values, degrees for the specific rotation) ----------
export const ROT = { alpha: 112, beta: 18.7, eq: 52.7 };
/** Fraction of α at equilibrium from the three rotations (ignoring the tiny open-chain share). */
export const eqAlpha = (r = ROT) => (r.eq - r.beta) / (r.alpha - r.beta);
/** Specific rotation of a mixture with fraction a of α. */
export const mixRotation = (a: number, r = ROT) => a * r.alpha + (1 - a) * r.beta;
/** Fraction of α from a measured rotation. */
export const alphaFromRotation = (obs: number, r = ROT) => (obs - r.beta) / (r.alpha - r.beta);
/** Fraction of α after t minutes, starting pure α or pure β, approaching equilibrium with rate constant k
 * (k = k₁ + k₋₁ per minute; an illustrative value is used on the page). */
export const alphaAt = (t: number, start: Anomer, k: number, r = ROT) => { const e = eqAlpha(r), a0 = start === 'alpha' ? 1 : 0; return e + (a0 - e) * Math.exp(-k * t); };
/** Minutes for half the change. */
export const halfTime = (k: number) => Math.log(2) / k;
