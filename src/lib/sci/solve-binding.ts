// "Solve my numbers" for binding energy: mass defect and binding energy from a nuclear or atomic mass, energy from a mass
// (E = mc²), binding energy per nucleon, and the energy released by a reaction from masses before and after. No DOM.
import { eng, sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';
import { U_MEV, M_H, M_N } from './learnbinding.ts';

export const M_P = 1.007276; // proton mass, u (CODATA 2018, rounded)
const KG_U = 1.66053906660e-27, J_MEV = 1.602176634e-13;
const conv = (i: SIn, base: string, what: string) => (i.u !== base && i.typed !== i.v ? [`Convert ${what}: ${sf(i.typed)} ${i.u} = ${sf(i.v, 4)} ${base}`] : []);
const whole = (x: number) => Number.isInteger(x) && x >= 1;

export function binding(i: Record<string, SIn>, find: string, kind: string): SOut {
  const lines: string[] = [];
  if (find === 'B') {
    const Z = i.Z.v, A = i.A.v, M = i.M.v, nuclear = kind === 'nuclear';
    if (!whole(Z) || !whole(A)) return { error: 'Z and A must be whole numbers, 1 or more.' };
    if (Z > A) return { error: 'The number of protons Z cannot be bigger than the mass number A.' };
    if (A < 2) return { error: 'A single proton has no binding energy. Use A of 2 or more.' };
    if (!(M > 0) || Math.abs(M - A) > 0.5) return { error: `The mass should be close to A = ${A} u (within 0.5 u). Check you typed it in u, not in kg.` };
    const N = A - Z, mp = nuclear ? M_P : M_H, dm = Z * mp + N * M_N - M, B = dm * U_MEV;
    lines.push(...conv(i.M, 'u', 'the mass'), `Neutrons: N = A − Z = ${A} − ${Z} = ${N}`, 'Mass defect: Δm = Z mₚ + N mₙ − M' + (nuclear ? '' : ' (mₚ is the mass of a hydrogen atom, so the electrons cancel)'),
      `Δm = ${Z} × ${sf(mp, 7)} + ${N} × ${sf(M_N, 7)} − ${sf(M, 8)} = ${sf(dm, 4)} u`,
      `Binding energy: B = Δm × 931.5 MeV/u = ${sf(dm, 4)} × 931.5 = ${sf(B, 4)} MeV`, `Per nucleon: B / A = ${sf(B, 4)} / ${A} = ${sf(B / A, 3)} MeV`);
    if (dm <= 0) return { error: `That mass gives a mass defect of ${sf(dm, 3)} u, which is not above zero, so the nucleus would not be bound. Check the mass and whether it is an atomic or a nuclear mass.`, lines };
    return { answer: `The mass defect is ${sf(dm, 3)} u, the binding energy is ${sf(B, 4)} MeV, and that is ${sf(B / A, 3)} MeV per nucleon.`, lines,
      tip: 'Common mistake: using an atomic mass with the proton mass, or a nuclear mass with the hydrogen-atom mass. Pick the right type above. Atomic mass includes the Z electrons; nuclear mass does not.' };
  }
  if (find === 'E') {
    const dm = i.dm.v;
    if (dm < 0) return { error: 'A mass cannot be negative. If mass is lost in a reaction, type the amount lost as a positive number.' };
    const MeV = dm * U_MEV, J = dm * KG_U * 299792458 ** 2;
    lines.push(...conv(i.dm, 'u', 'the mass'), 'Einstein: E = m c², and 1 u = 931.5 MeV/c²', `E = ${sf(dm, 4)} u × 931.5 MeV/u = ${sf(MeV, 4)} MeV`,
      `In joules: m = ${sf(dm * KG_U, 4)} kg, E = ${sf(dm * KG_U, 4)} × (3 × 10⁸)² = ${sf(J, 3)} J`);
    return { answer: `A mass of ${sf(dm, 4)} u is equivalent to ${sf(MeV, 4)} MeV (${sf(J, 3)} J).`, lines, tip: 'Mass in kg uses c² = 9 × 10¹⁶ m²/s² and gives joules. Mass in u uses 931.5 MeV per u and gives MeV. Do not mix the two.' };
  }
  if (find === 'perN') {
    const B = i.B.v, A = i.A.v;
    if (!whole(A)) return { error: 'The mass number A must be a whole number, 1 or more.' };
    if (!(B > 0)) return { error: 'The binding energy must be above zero.' };
    lines.push(...conv(i.B, 'MeV', 'the energy'), 'Binding energy per nucleon = B / A', `= ${sf(B, 4)} MeV ÷ ${A} = ${sf(B / A, 3)} MeV per nucleon`);
    return { answer: `The binding energy per nucleon is ${sf(B / A, 3)} MeV.${B / A > 9 ? ' That is higher than any real nucleus (the peak is about 8.8 MeV), so check the numbers.' : ''}`, lines,
      tip: 'The higher the binding energy per nucleon, the more tightly bound (more stable) the nucleus. The curve peaks near iron-56 at about 8.8 MeV.' };
  }
  // Q value
  const before = i.mi.v, after = i.mo.v;
  if (!(before > 0) || !(after > 0)) return { error: 'Both total masses must be above zero.' };
  const dm = before - after, Q = dm * U_MEV;
  lines.push(...conv(i.mi, 'u', 'the mass before'), ...conv(i.mo, 'u', 'the mass after'), 'Q = (mass before − mass after) × 931.5 MeV/u', `Δm = ${sf(before, 8)} − ${sf(after, 8)} = ${sf(dm, 4)} u`, `Q = ${sf(dm, 4)} × 931.5 = ${sf(Q, 4)} MeV = ${eng(Q * J_MEV, 'J')}`);
  if (Math.abs(Q) < 1e-9) return { answer: 'The masses are equal, so no energy is given out or needed (Q = 0).', lines };
  return { answer: Q > 0 ? `The reaction gives out ${sf(Q, 4)} MeV (mass is lost, so energy is released).` : `The reaction needs ${sf(-Q, 4)} MeV put in (the products are heavier), so it does not happen by itself.`, lines,
    tip: 'Add up all the masses on each side first, including any neutrons, and count the same number of nucleons on both sides.' };
}

export const BINDING_SPEC: SSpec = {
  id: 'binding',
  finds: [['B', 'Binding energy of a nucleus'], ['perN', 'Binding energy per nucleon'], ['E', 'Energy from a mass'], ['Q', 'Energy of a reaction']],
  fields: [
    { k: 'kind', kind: 'choice', label: 'The mass you have is', def: 'atomic', show: (c) => c.find === 'B', options: [['atomic', 'Atomic mass (with electrons)'], ['nuclear', 'Nuclear mass (nucleus only)']] },
    { k: 'Z', label: 'Protons Z', show: (c) => c.find === 'B', ph: 'e.g. 2' },
    { k: 'A', label: 'Mass number A', show: (c) => c.find === 'B' || c.find === 'perN', ph: 'e.g. 4' },
    { k: 'M', label: 'Mass of the nucleus M', units: [['u', 1]], show: (c) => c.find === 'B', ph: 'e.g. 4.002603' },
    { k: 'B', label: 'Binding energy B', units: [['MeV', 1], ['GeV', 1e3], ['keV', 1e-3]], show: (c) => c.find === 'perN', ph: 'e.g. 28.3' },
    { k: 'dm', label: 'Mass', units: [['u', 1], ['kg', 1 / KG_U], ['g', 1e-3 / KG_U]], show: (c) => c.find === 'E', ph: 'e.g. 0.0304' },
    { k: 'mi', label: 'Total mass before', units: [['u', 1]], show: (c) => c.find === 'Q', ph: 'e.g. 5.030151' },
    { k: 'mo', label: 'Total mass after', units: [['u', 1]], show: (c) => c.find === 'Q', ph: 'e.g. 5.011270' },
  ],
  presets: [
    { name: 'Helium-4 (atomic mass 4.002603 u)', find: 'B', vals: { Z: '2', A: '4', M: '4.002603' }, ch: { kind: 'atomic' } },
    { name: 'Deuteron (nuclear mass 2.013553 u)', find: 'B', vals: { Z: '1', A: '2', M: '2.013553' }, ch: { kind: 'nuclear' } },
    { name: 'A mass defect of 0.0304 u: find the energy', find: 'E', vals: { dm: '0.0304' } },
    { name: 'Total binding energy 492.3 MeV for A = 56', find: 'perN', vals: { B: '492.3', A: '56' } },
    { name: 'Fusion: 2H + 3H (5.030151 u) to 4He + n (5.011268 u)', find: 'Q', vals: { mi: '5.030151', mo: '5.011268' } },
  ],
  solve: (i, c) => binding(i, c.find, c.ch.kind ?? 'atomic'),
};
