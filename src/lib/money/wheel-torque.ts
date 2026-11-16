// #T1010 Wheel nut torque: unit conversions, the push needed on a brace (F = T / L) and the star tightening order.
// Plain maths, no DOM, so tests/tools/wheel-nut-torque.mjs can check it against a hand-worked example.

export type TorqueUnit = 'nm' | 'lbfft' | 'kgfm';
export const NM_PER: Record<TorqueUnit, number> = { nm: 1, lbfft: 1.3558179483314004, kgfm: 9.80665 };
export const G = 9.80665;               // N per kgf
export const N_PER_LBF = 4.4482216152605;
export const M_PER_IN = 0.0254;

/** Torque in N·m from a value in any unit. */
export const toNm = (v: number, u: TorqueUnit) => v * NM_PER[u];
/** Torque in a unit from N·m. */
export const fromNm = (nm: number, u: TorqueUnit) => nm / NM_PER[u];

/** Brace or wrench length in metres, from cm or inches (measured from the nut centre to where you push). */
export const lengthM = (v: number, u: 'cm' | 'in') => (u === 'cm' ? v / 100 : v * M_PER_IN);

/** The push at right angles to the handle that gives torque `nm` on a lever `m` metres long: F = T / L, in N, kgf and lbf. */
export function pushForce(nm: number, m: number) {
  const N = nm / m;
  return { N, kgf: N / G, lbf: N / N_PER_LBF };
}

/** Share of a body weight (mass in kg) that a push of N newtons equals, as a fraction (0.4 = 40 %). */
export const shareOfWeight = (N: number, kg: number) => N / (kg * G);

/**
 * Star (criss-cross) tightening order for n nuts set evenly round the hub. Returns the nut positions, counted
 * clockwise from the top (0), in the order to tighten them. 4: 0,2,1,3. 5: every other nut. 6: 0,3,4,1,2,5.
 * 8: 0,4,2,6,1,5,3,7. Any other n: every other nut for odd n, opposite pairs for even n.
 */
export function starOrder(n: number): number[] {
  if (n === 6) return [0, 3, 4, 1, 2, 5];
  if (n === 8) return [0, 4, 2, 6, 1, 5, 3, 7];
  if (n % 2 === 1) return Array.from({ length: n }, (_, i) => (i * 2) % n);
  const h = n / 2;
  return Array.from({ length: h }, (_, i) => [i, i + h]).flat();
}

/**
 * Typical wheel nut torque ranges in N·m, rounded from the spread of values printed in car makers' handbooks for
 * each kind of vehicle and stud thread. These are TYPICAL only: the figure in your own handbook always wins.
 */
export const TYPICAL: { id: string; name: string; lo: number; hi: number; note: string }[] = [
  { id: 'small', name: 'Small car or city car', lo: 80, hi: 110, note: 'Usually M12 studs or bolts.' },
  { id: 'family', name: 'Family car, estate or small SUV', lo: 100, hi: 140, note: 'M12 x 1.5 or M14 x 1.5 are common.' },
  { id: 'suv', name: 'Large SUV or 4x4', lo: 130, hi: 180, note: 'Often M14 x 1.5.' },
  { id: 'pickup', name: 'Pickup or light van', lo: 140, hi: 220, note: 'Often M14 x 1.5 or 9/16-18 studs.' },
  { id: 'hd', name: 'Heavy-duty pickup or large van', lo: 200, hi: 260, note: 'Often 9/16-18 or M14 x 2.0; some use more.' },
  { id: 'trailer', name: 'Small car trailer or caravan', lo: 70, hi: 120, note: 'Check the axle maker\'s plate or manual.' },
  { id: 'M10', name: 'M10 x 1.25 studs (quads, small trailers)', lo: 45, hi: 75, note: 'Light vehicles only.' },
  { id: 'M12x1.25', name: 'M12 x 1.25 studs', lo: 80, hi: 120, note: 'Fine thread used by some Japanese makers.' },
  { id: 'M12x1.5', name: 'M12 x 1.5 studs or bolts', lo: 90, hi: 130, note: 'Very common on small and family cars.' },
  { id: 'M14x1.5', name: 'M14 x 1.5 studs or bolts', lo: 120, hi: 190, note: 'Common on larger cars, SUVs and pickups.' },
  { id: '1/2-20', name: '1/2-20 UNF studs', lo: 100, hi: 140, note: 'Older North American cars and Jeeps (75 to 100 lbf·ft).' },
  { id: '9/16-18', name: '9/16-18 UNF studs', lo: 160, hi: 220, note: 'Larger pickups and vans (120 to 160 lbf·ft).' },
];
