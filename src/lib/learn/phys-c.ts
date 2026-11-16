// "Solve my numbers" sets for eight Class 10-12 physics Learn tools (faraday-induction, motional-emf, gauss-law,
// potential-map, drift-velocity, galvanometer-conversion, inductance-lab, microscope-telescope). Plain TypeScript, no
// DOM. Same shape as phys-a.ts: each problem gets the typed numbers already converted to base units by phys-a-ui.ts and
// returns the answer sentence and the working an exam marks. Drawn UI: phys-a-ui.ts. Hand-checked in tests/tools/<id>.mjs.
import { sg as sgBase, type Field, type SolverSet, type Unit } from './phys-a';

/** phys-a's sg shows anything under 1e-12 as 0; charges, fluxes and tiny currents need to show. */
function sg(x: number, n = 3): string {
  if (Number.isFinite(x) && x !== 0 && Math.abs(x) < 1e-12) { const [m, e] = Math.abs(x).toExponential(n - 1).split('e'); return `${x < 0 ? '−' : ''}${m} × 10^${Number(e)}`; }
  return sgBase(x, n);
}
const sgn = (x: number) => (x < 0 ? `(${sg(x)})` : sg(x));
const PRE: [number, string][] = [[1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'µ'], [1e-9, 'n'], [1e-12, 'p']];
/** A number with an SI prefix that reads well: en(0.0025, 'A') is "2.5 mA". */
const en = (x: number, unit: string, n = 3): string => {
  if (!Number.isFinite(x)) return `— ${unit}`;
  if (x === 0) return `0 ${unit}`;
  const a = Math.abs(x), [f, p] = PRE.find(([f]) => a >= f * 0.9995) ?? PRE[PRE.length - 1];
  return `${sg(x / f, n)} ${p}${unit}`;
};

const EPS0 = 8.8541878188e-12; // F/m, CODATA 2022
const K = 1 / (4 * Math.PI * EPS0); // 8.9875517874e9 N m²/C²
const MU0 = 1.25663706127e-6; // N/A², CODATA 2022
const QE = 1.602176634e-19; // C, exact
const ME = 9.1093837139e-31; // kg
const NA = 6.02214076e23; // 1/mol, exact
const D_NEAR = 25; // cm, the standard near point

const U = {
  wb: [['Wb', 1], ['mWb', 1e-3], ['µWb', 1e-6]] as Unit[],
  T: [['T', 1], ['mT', 1e-3], ['µT', 1e-6]] as Unit[],
  area: [['cm²', 1e-4], ['m²', 1], ['mm²', 1e-6]] as Unit[],
  areaMm: [['mm²', 1e-6], ['cm²', 1e-4], ['m²', 1]] as Unit[],
  time: [['s', 1], ['ms', 1e-3], ['min', 60]] as Unit[],
  deg: [['°', 1], ['rad', 180 / Math.PI]] as Unit[],
  len: [['m', 1], ['cm', 0.01], ['mm', 1e-3], ['km', 1000]] as Unit[],
  lenCm: [['cm', 0.01], ['m', 1], ['mm', 1e-3]] as Unit[],
  speed: [['m/s', 1], ['km/h', 1 / 3.6], ['cm/s', 0.01]] as Unit[],
  ohm: [['Ω', 1], ['kΩ', 1e3]] as Unit[],
  chg: [['C', 1], ['mC', 1e-3], ['µC', 1e-6], ['nC', 1e-9], ['pC', 1e-12]] as Unit[],
  chgN: [['nC', 1e-9], ['µC', 1e-6], ['pC', 1e-12], ['C', 1]] as Unit[],
  curr: [['A', 1], ['mA', 1e-3], ['µA', 1e-6]] as Unit[],
  ind: [['H', 1], ['mH', 1e-3], ['µH', 1e-6]] as Unit[],
};
const posF = (k: string, label: string, def: string, units: Unit[], hint?: string): Field => ({ k, label, def, units, gt: 0, hint });
const turns = (k = 'N', label = 'Number of turns N', def = '200'): Field => ({ k, label, def, gt: 0 });
const dir = (d: number, up: string, down: string) => (d > 0 ? up : d < 0 ? down : '');

// ---------------------------------------------------------------------------------------------------------
// Faraday's law
export const FARADAY: SolverSet = {
  probs: [
    { id: 'emf', label: "Induced emf from the change in flux: ε = N ΔΦ / Δt", fields: [
      turns(), { k: 'p1', label: 'Starting flux Φ₁', def: '2', units: [['mWb', 1e-3], ['Wb', 1], ['µWb', 1e-6]] },
      { k: 'p2', label: 'Final flux Φ₂', def: '10', units: [['mWb', 1e-3], ['Wb', 1], ['µWb', 1e-6]] }, posF('t', 'Time taken Δt', '0.4', U.time)],
      tip: 'Use the change in flux (final − starting), not the flux itself, and multiply by the number of turns N.',
      solve: ({ N, p1, p2, t }) => {
        const d = p2 - p1, e = (-N * d) / t;
        return { ans: d === 0 ? 'The flux does not change, so no emf is induced: 0 V.' : `The average induced emf is ${en(Math.abs(e), 'V')}, ${d > 0 ? 'in the direction that opposes the rise in flux (Lenz)' : 'in the direction that opposes the fall in flux (Lenz)'}.`,
          work: ['ε = −N ΔΦ / Δt (the minus sign is Lenz\'s law)', `ΔΦ = Φ₂ − Φ₁ = ${sg(p2)} − ${sgn(p1)} = ${sg(d)} Wb`, `ε = −${sg(N)} × ${sgn(d)} Wb ÷ ${sg(t)} s`, `ε = ${sg(e)} V, so its size is ${en(Math.abs(e), 'V')}`] };
      } },
    { id: 'flux', label: 'Magnetic flux through a coil: Φ = B A cos θ', fields: [
      posF('B', 'Magnetic field B', '0.4', U.T), posF('A', 'Area of the coil A', '25', U.area),
      { k: 'th', label: 'Angle θ between B and the coil\'s normal', def: '60', units: U.deg, min: 0, max: 180, hint: '0° means the field goes straight through the coil' }],
      tip: 'θ is measured from the normal (the line at right angles to the coil), not from the coil\'s surface. A field along the surface gives zero flux.',
      solve: ({ B, A, th }) => {
        const c = Math.cos((th * Math.PI) / 180), p = B * A * c;
        return { ans: `The flux is ${en(p, 'Wb')}${Math.abs(c) < 1e-9 ? ' (none: the field runs along the coil, not through it)' : ''}.`, work: ['Φ = B A cos θ', `Φ = ${sg(B)} T × ${sg(A)} m² × cos ${sg(th)}°`, `cos ${sg(th)}° = ${sg(c)}`, `Φ = ${sg(p)} Wb`] };
      } },
    { id: 'field', label: 'Coil in a changing field: ε = N A ΔB / Δt', fields: [
      turns('N', 'Number of turns N', '50'), posF('A', 'Area of the coil A', '20', U.area),
      { k: 'b1', label: 'Starting field B₁', def: '0.5', units: U.T }, { k: 'b2', label: 'Final field B₂', def: '0.1', units: U.T }, posF('t', 'Time taken Δt', '0.2', U.time)],
      tip: 'Change cm² to m² (divide by 10 000) and use the change in field B₂ − B₁. The unit boxes do the conversion for you.',
      solve: ({ N, A, b1, b2, t }) => {
        const d = b2 - b1, e = (N * A * d) / t;
        return { ans: d === 0 ? 'The field does not change, so no emf is induced: 0 V.' : `The average induced emf is ${en(Math.abs(e), 'V')}.`, work: ['ε = N A (B₂ − B₁) / Δt (field at right angles to the coil)', `B₂ − B₁ = ${sg(b2)} − ${sgn(b1)} = ${sg(d)} T`, `ε = ${sg(N)} × ${sg(A)} m² × ${sgn(d)} T ÷ ${sg(t)} s`, `ε = ${sg(e)} V, size ${en(Math.abs(e), 'V')}`] };
      } },
    { id: 'gen', label: 'AC generator: peak emf ε₀ = N B A ω', fields: [
      turns('N', 'Number of turns N', '100'), posF('B', 'Magnetic field B', '0.2', U.T), posF('A', 'Area of the coil A', '50', U.area),
      posF('f', 'Rotation frequency f', '50', [['Hz', 1], ['rpm', 1 / 60]], 'Mains in India, the UK and the Gulf is 50 Hz; USA and Canada 60 Hz')],
      tip: 'ω = 2π f in rad/s. If the speed is in rpm, divide by 60 first (the unit box does it). The rms value is the peak ÷ √2.',
      solve: ({ N, B, A, f }) => {
        const w = 2 * Math.PI * f, e0 = N * B * A * w;
        return { ans: `The peak emf is ${en(e0, 'V')} (rms ${en(e0 / Math.SQRT2, 'V')}).`, work: ['ω = 2π f', `ω = 2π × ${sg(f)} = ${sg(w)} rad/s`, 'ε₀ = N B A ω', `ε₀ = ${sg(N)} × ${sg(B)} T × ${sg(A)} m² × ${sg(w)} rad/s = ${sg(e0)} V`, `ε rms = ε₀ ÷ √2 = ${sg(e0 / Math.SQRT2)} V`] };
      } },
    { id: 'cur', label: 'Induced current and charge: I = ε / R, Q = N ΔΦ / R', fields: [
      turns('N', 'Number of turns N', '100'), { k: 'p1', label: 'Starting flux Φ₁', def: '0', units: [['mWb', 1e-3], ['Wb', 1], ['µWb', 1e-6]] },
      { k: 'p2', label: 'Final flux Φ₂', def: '4', units: [['mWb', 1e-3], ['Wb', 1], ['µWb', 1e-6]] }, posF('t', 'Time taken Δt', '0.5', U.time), posF('R', 'Resistance of the circuit R', '8', U.ohm)],
      tip: 'The charge that flows, Q = N ΔΦ / R, does not depend on how fast the flux changes; only the current does.',
      solve: ({ N, p1, p2, t, R }) => {
        const d = p2 - p1, e = Math.abs((N * d) / t), i = e / R, q = (N * Math.abs(d)) / R;
        return { ans: `The average current is ${en(i, 'A')} and the charge that flows is ${en(q, 'C')}.`, work: [`ε = N |ΔΦ| / Δt = ${sg(N)} × ${sg(Math.abs(d))} ÷ ${sg(t)} = ${sg(e)} V`, `I = ε ÷ R = ${sg(e)} ÷ ${sg(R)} = ${sg(i)} A`, `Q = I Δt = N |ΔΦ| ÷ R = ${sg(q)} C`] };
      } },
  ],
  presets: [
    { label: '200 turns, flux rises', prob: 'emf', v: { N: '200', p1: '2', p2: '10', t: '0.4' } },
    { label: 'Flux through a tilted coil', prob: 'flux', v: { B: '0.4', A: '25', th: '60' } },
    { label: 'Field falls to 0.1 T', prob: 'field', v: { N: '50', A: '20', b1: '0.5', b2: '0.1', t: '0.2' } },
    { label: 'Simple 50 Hz generator', prob: 'gen', v: { N: '100', B: '0.2', A: '50', f: '50' } },
    { label: 'Current and charge', prob: 'cur', v: { N: '100', p1: '0', p2: '4', t: '0.5', R: '8' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Motional emf
export const MOTIONAL: SolverSet = {
  probs: [
    { id: 'emf', label: 'Motional emf: ε = B ℓ v', fields: [posF('B', 'Magnetic field B', '0.5', U.T), posF('l', 'Length ℓ of the conductor', '40', U.lenCm), posF('v', 'Speed v', '5', U.speed)],
      tip: 'B, ℓ and v must be at right angles to each other. If v is in km/h, divide by 3.6 to get m/s.',
      solve: ({ B, l, v }) => ({ ans: `The induced emf is ${en(B * l * v, 'V')}.`, work: ['ε = B ℓ v', `ε = ${sg(B)} T × ${sg(l)} m × ${sg(v)} m/s`, `ε = ${sg(B * l * v)} V`] }) },
    { id: 'rail', label: 'Rod on rails: emf, current, force and power', fields: [posF('B', 'Magnetic field B', '0.2', U.T), posF('l', 'Length ℓ of the rod between the rails', '50', U.lenCm), posF('v', 'Speed v', '4', U.speed), posF('R', 'Resistance of the circuit R', '2', U.ohm)],
      tip: 'The force you must push with equals the magnetic drag B I ℓ, and the power you put in equals the heat I² R. Both are the same number.',
      solve: ({ B, l, v, R }) => {
        const e = B * l * v, i = e / R, F = B * i * l, P = F * v;
        return { ans: `The emf is ${en(e, 'V')}, the current ${en(i, 'A')}, the drag force ${en(F, 'N')} and the power ${en(P, 'W')}.`, work: [`ε = B ℓ v = ${sg(B)} × ${sg(l)} × ${sg(v)} = ${sg(e)} V`, `I = ε ÷ R = ${sg(e)} ÷ ${sg(R)} = ${sg(i)} A`, `F = B I ℓ = ${sg(B)} × ${sg(i)} × ${sg(l)} = ${sg(F)} N (it opposes the motion, Lenz)`, `P = F v = ${sg(F)} × ${sg(v)} = ${sg(P)} W (check: I² R = ${sg(i * i * R)} W)`] };
      } },
    { id: 'v', label: 'Speed needed for a given emf: v = ε / (B ℓ)', fields: [posF('e', 'Emf wanted ε', '1', [['V', 1], ['mV', 1e-3]]), posF('B', 'Magnetic field B', '0.25', U.T), posF('l', 'Length ℓ', '20', U.lenCm)],
      tip: 'Rearrange ε = B ℓ v and keep ℓ in metres: 20 cm is 0.2 m, not 20 m.',
      solve: ({ e, B, l }) => ({ ans: `The speed needed is ${sg(e / (B * l))} m/s (${sg((3.6 * e) / (B * l))} km/h).`, work: ['v = ε ÷ (B ℓ)', `v = ${sg(e)} V ÷ (${sg(B)} T × ${sg(l)} m)`, `v = ${sg(e / (B * l))} m/s`] }) },
    { id: 'rot', label: 'Rotating rod or wheel spoke: ε = ½ B ω ℓ²', fields: [posF('B', 'Magnetic field B', '0.1', U.T), posF('l', 'Length ℓ (the radius)', '1', U.len),
      posF('w', 'Angular speed ω', '10', [['rad/s', 1], ['rpm', (2 * Math.PI) / 60], ['rev/s', 2 * Math.PI]])],
      tip: 'The ℓ is squared, and the factor ½ is there because the rod\'s speed grows from 0 at the pivot to ωℓ at the tip (the average is ½ωℓ).',
      solve: ({ B, l, w }) => ({ ans: `The emf between the centre and the rim is ${en(0.5 * B * w * l * l, 'V')}.`, work: ['ε = ½ B ω ℓ²', `ε = ½ × ${sg(B)} T × ${sg(w)} rad/s × (${sg(l)} m)²`, `ε = ${sg(0.5 * B * w * l * l)} V`] }) },
  ],
  presets: [
    { label: 'Rod at 5 m/s', prob: 'emf', v: { B: '0.5', l: '40', v: '5' } },
    { label: 'Aeroplane wings', prob: 'emf', v: { B: '50', l: '40', v: '900' }, u: { B: 'µT', l: 'm', v: 'km/h' } },
    { label: 'Rod with a 2 Ω circuit', prob: 'rail', v: { B: '0.2', l: '50', v: '4', R: '2' } },
    { label: 'Speed for 1 V', prob: 'v', v: { e: '1', B: '0.25', l: '20' } },
    { label: 'Spinning 1 m rod', prob: 'rot', v: { B: '0.1', l: '1', w: '10' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Gauss's law
const sigF = (def: string): Field => ({ k: 's', label: 'Surface charge density σ', def, units: [['µC/m²', 1e-6], ['nC/m²', 1e-9], ['C/m²', 1]] });
export const GAUSS: SolverSet = {
  probs: [
    { id: 'flux', label: 'Flux through a closed surface: Φ = q / ε₀', fields: [{ k: 'q', label: 'Charge inside the surface q', def: '1', units: [['µC', 1e-6], ['nC', 1e-9], ['mC', 1e-3], ['C', 1]] }],
      tip: 'Only the charge inside the surface counts. Charges outside add nothing to the net flux, whatever their size.',
      solve: ({ q }) => ({ ans: `The net flux is ${sg(q / EPS0)} N m²/C${q < 0 ? ' (negative: more field lines enter than leave)' : ''}.`, work: ['Φ = q_inside ÷ ε₀', `Φ = ${sgn(q)} C ÷ 8.854 × 10^-12 C²/(N m²)`, `Φ = ${sg(q / EPS0)} N m²/C`] }) },
    { id: 'q', label: 'Charge inside from a measured flux: q = ε₀ Φ', fields: [{ k: 'p', label: 'Net flux Φ', def: '5', units: [['×10⁴ N m²/C', 1e4], ['N m²/C', 1]] }],
      tip: 'The sign of the flux is the sign of the enclosed charge: outward flux means positive charge.',
      solve: ({ p }) => ({ ans: `The charge inside is ${en(EPS0 * p, 'C')}.`, work: ['q = ε₀ Φ', `q = 8.854 × 10^-12 × ${sgn(p)}`, `q = ${sg(EPS0 * p)} C`] }) },
    { id: 'shell', label: 'Field of a charged sphere (inside or outside)', fields: [
      { k: 'type', label: 'Kind of sphere', def: '0', sel: ['Hollow shell or metal sphere', 'Solid sphere, charge spread evenly'] },
      { k: 'Q', label: 'Total charge Q', def: '5', units: U.chgN }, posF('R', 'Radius of the sphere R', '10', U.lenCm), posF('r', 'Distance r from the centre', '30', U.lenCm)],
      tip: 'Outside, any charged sphere acts like all its charge at the centre. Inside a hollow shell the field is zero.',
      solve: ({ type, Q, R, r }) => {
        if (r >= R) { const E = (K * Q) / (r * r); return { ans: `The field at ${sg(r * 100)} cm is ${sg(E)} N/C${Q < 0 ? ' (pointing inwards)' : ' (pointing outwards)'}.`, work: ['Outside (r ≥ R) Gauss gives E = Q / (4π ε₀ r²)', `E = 8.99 × 10^9 × ${sgn(Q)} ÷ (${sg(r)})²`, `E = ${sg(E)} N/C`] }; }
        if (type === 0) return { ans: 'The field inside is 0 N/C: no charge is enclosed.', work: ['Inside a hollow shell (r < R) the Gaussian sphere holds no charge, so E × 4π r² = 0', 'E = 0'] };
        const E = (K * Q * r) / (R * R * R);
        return { ans: `The field inside the solid sphere at ${sg(r * 100)} cm is ${sg(E)} N/C.`, work: ['Inside an evenly charged sphere only the fraction (r/R)³ of Q is enclosed', 'E = Q r / (4π ε₀ R³)', `E = 8.99 × 10^9 × ${sgn(Q)} × ${sg(r)} ÷ (${sg(R)})³ = ${sg(E)} N/C`] };
      } },
    { id: 'wire', label: 'Long straight charged wire: E = λ / (2π ε₀ r)', fields: [{ k: 'lam', label: 'Charge per length λ', def: '2', units: [['µC/m', 1e-6], ['nC/m', 1e-9], ['C/m', 1]] }, posF('r', 'Distance r from the wire', '50', U.lenCm)],
      tip: 'The field falls as 1/r (not 1/r²) and only works for a very long wire, far from its ends.',
      solve: ({ lam, r }) => { const E = lam / (2 * Math.PI * EPS0 * r); return { ans: `The field is ${sg(E)} N/C${lam < 0 ? ', pointing towards the wire' : ', pointing away from the wire'}.`, work: ['Gaussian cylinder of radius r: E × 2π r L = λ L ÷ ε₀', 'E = λ ÷ (2π ε₀ r)', `E = ${sgn(lam)} ÷ (2π × 8.854 × 10^-12 × ${sg(r)})`, `E = ${sg(E)} N/C`] }; } },
    { id: 'sheet', label: 'Large flat sheet or conductor surface', fields: [
      { k: 'type', label: 'Kind of surface', def: '0', sel: ['Thin sheet of charge: σ / 2ε₀', 'Surface of a conductor: σ / ε₀'] }, sigF('10')],
      tip: 'A thin sheet has field on both faces, so it is σ/2ε₀ each side. Next to a conductor the field is outside only, so it is σ/ε₀. The distance does not matter for a large sheet.',
      solve: ({ type, s }) => { const E = type === 0 ? s / (2 * EPS0) : s / EPS0; return { ans: `The field is ${sg(E)} N/C, the same at every distance (for a large sheet).`, work: [type === 0 ? 'E = σ ÷ (2 ε₀)' : 'E = σ ÷ ε₀', `E = ${sgn(s)} ÷ ${type === 0 ? '(2 × ' : '('}8.854 × 10^-12)`, `E = ${sg(E)} N/C`] }; } },
  ],
  presets: [
    { label: '1 µC inside a surface', prob: 'flux', v: { q: '1' } },
    { label: 'Charge from the flux', prob: 'q', v: { p: '5' } },
    { label: 'Outside a 5 nC shell', prob: 'shell', v: { type: '0', Q: '5', R: '10', r: '30' } },
    { label: 'Inside a hollow shell', prob: 'shell', v: { type: '0', Q: '5', R: '10', r: '5' } },
    { label: 'Long charged wire', prob: 'wire', v: { lam: '2', r: '50' } },
    { label: 'Large charged sheet', prob: 'sheet', v: { type: '0', s: '10' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Potential
export const POTENTIAL: SolverSet = {
  probs: [
    { id: 'V', label: 'Potential of a point charge: V = k q / r', fields: [{ k: 'q', label: 'Charge q', def: '5', units: U.chgN }, posF('r', 'Distance r', '10', U.lenCm)],
      tip: 'Use the charge with its sign: positive charges give a positive potential, negative a negative one. It falls as 1/r, not 1/r².',
      solve: ({ q, r }) => { const V = (K * q) / r; return { ans: `The potential is ${en(V, 'V')}.`, work: ['V = q / (4π ε₀ r) = k q / r, with k = 8.99 × 10^9 N m²/C²', `V = 8.99 × 10^9 × ${sgn(q)} ÷ ${sg(r)}`, `V = ${sg(V)} V`] }; } },
    { id: 'two', label: 'Potential at a point from two charges', fields: [{ k: 'q1', label: 'First charge q₁', def: '4', units: U.chgN }, posF('r1', 'Distance from q₁', '5', U.lenCm),
      { k: 'q2', label: 'Second charge q₂', def: '-4', units: U.chgN }, posF('r2', 'Distance from q₂', '15', U.lenCm)],
      tip: 'Potential is a plain number (not a vector): add the two potentials with their signs. Do not add them like arrows.',
      solve: ({ q1, r1, q2, r2 }) => { const a = (K * q1) / r1, b = (K * q2) / r2, V = a + b; return { ans: `The potential at that point is ${en(V, 'V')}.`, work: [`V₁ = k q₁ / r₁ = 8.99 × 10^9 × ${sgn(q1)} ÷ ${sg(r1)} = ${sg(a)} V`, `V₂ = k q₂ / r₂ = 8.99 × 10^9 × ${sgn(q2)} ÷ ${sg(r2)} = ${sg(b)} V`, `V = V₁ + V₂ = ${sg(V)} V`] }; } },
    { id: 'W', label: 'Work to move a test charge from A to B', fields: [{ k: 'Q', label: 'Source charge Q', def: '5', units: U.chgN }, { k: 'q', label: 'Test charge q', def: '2', units: U.chgN },
      posF('ra', 'Start A, distance from Q', '20', U.lenCm), posF('rb', 'End B, distance from Q', '10', U.lenCm)],
      tip: 'Work by the field = q (V_A − V_B). If it is negative, you must do that much work against the field to push the charge there.',
      solve: ({ Q, q, ra, rb }) => {
        const va = (K * Q) / ra, vb = (K * Q) / rb, W = q * (va - vb);
        return { ans: `The potential difference V_B − V_A is ${en(vb - va, 'V')}. The field does ${en(W, 'J')} of work${W < 0 ? ' (negative: you must supply ' + en(-W, 'J') + ' to push the charge there)' : ''}.`, work: [`V_A = k Q / r_A = ${sg(va)} V and V_B = k Q / r_B = ${sg(vb)} V`, `V_B − V_A = ${sg(vb - va)} V`, `Work by the field = q (V_A − V_B) = ${sgn(q)} × ${sg(va - vb)} = ${sg(W)} J`, `Work you do = q (V_B − V_A) = ${sg(-W)} J`] };
      } },
    { id: 'E', label: 'Uniform field from a potential difference: E = ΔV / d', fields: [posF('V', 'Potential difference ΔV', '200', [['V', 1], ['kV', 1e3], ['mV', 1e-3]]), posF('d', 'Distance d (along the field)', '4', U.lenCm)],
      tip: 'The field points from high to low potential, and d is the distance along the field, not sideways. 1 V/m = 1 N/C.',
      solve: ({ V, d }) => ({ ans: `The field is ${sg(V / d)} V/m (the same as ${sg(V / d)} N/C).`, work: ['E = ΔV ÷ d', `E = ${sg(V)} V ÷ ${sg(d)} m`, `E = ${sg(V / d)} V/m`] }) },
    { id: 'e', label: 'Electron accelerated through a voltage', fields: [posF('V', 'Accelerating voltage V', '100', [['V', 1], ['kV', 1e3]])],
      tip: 'Energy gained = e V, which is exactly V electron-volts. Set that equal to ½ m v² and solve for v.',
      solve: ({ V }) => {
        if (V > 50000) return { err: 'Above about 50 kV an electron goes so fast that this simple formula is no longer accurate. Try a smaller voltage.' };
        const E = QE * V, v = Math.sqrt((2 * E) / ME);
        return { ans: `The electron reaches ${sg(v)} m/s (${sg(v / 299792458 * 100)}% of the speed of light) and gains ${sg(V)} eV.`, work: ['e V = ½ m v², with e = 1.602 × 10^-19 C and m = 9.109 × 10^-31 kg', `Energy gained = ${sg(E)} J = ${sg(V)} eV`, `v = √(2 e V ÷ m) = √(2 × ${sg(E)} ÷ 9.109 × 10^-31) = ${sg(v)} m/s`] };
      } },
  ],
  presets: [
    { label: '5 nC at 10 cm', prob: 'V', v: { q: '5', r: '10' } },
    { label: 'Two opposite charges', prob: 'two', v: { q1: '4', r1: '5', q2: '-4', r2: '15' } },
    { label: 'Work to bring a charge closer', prob: 'W', v: { Q: '5', q: '2', ra: '20', rb: '10' } },
    { label: 'Field between plates', prob: 'E', v: { V: '200', d: '4' } },
    { label: 'Electron through 100 V', prob: 'e', v: { V: '100' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Drift velocity
const nF = (def = '8.49'): Field => ({ k: 'n', label: 'Free electrons per m³, n', def, units: [['×10²⁸ m⁻³', 1e28], ['m⁻³', 1]], gt: 0, hint: 'Copper 8.49, silver 5.86, aluminium 18.1 (×10²⁸ m⁻³)' });
const dur = (s: number) => (s >= 7200 ? `${sg(s / 3600)} hours` : s >= 120 ? `${sg(s / 60)} minutes` : `${sg(s)} s`);
export const DRIFT: SolverSet = {
  probs: [
    { id: 'vd', label: 'Drift speed from the current: v_d = I / (n e A)', fields: [posF('I', 'Current I', '1', U.curr), posF('A', 'Cross-section area A', '1', U.areaMm), nF()],
      tip: 'Area in m²: 1 mm² is 10⁻⁶ m², not 10⁻³. That one slip makes the answer a million times too big.',
      solve: ({ I, A, n }) => { const v = I / (n * QE * A); return { ans: `The drift speed is ${sg(v)} m/s (${sg(v * 1000)} mm/s).`, work: ['v_d = I ÷ (n e A)', `v_d = ${sg(I)} ÷ (${sg(n)} × 1.602 × 10^-19 × ${sg(A)})`, `v_d = ${sg(v)} m/s`] }; } },
    { id: 'vdD', label: 'Drift speed from the wire\'s diameter', fields: [posF('I', 'Current I', '2', U.curr), posF('d', 'Wire diameter d', '1.5', [['mm', 1e-3], ['cm', 0.01]]), nF()],
      tip: 'The area is π d² / 4 (a circle), not d². Work in metres: 1.5 mm = 0.0015 m.',
      solve: ({ I, d, n }) => { const A = (Math.PI * d * d) / 4, v = I / (n * QE * A); return { ans: `The drift speed is ${sg(v)} m/s (${sg(v * 1000)} mm/s).`, work: [`A = π d² / 4 = π × (${sg(d)} m)² ÷ 4 = ${sg(A)} m²`, 'v_d = I ÷ (n e A)', `v_d = ${sg(I)} ÷ (${sg(n)} × 1.602 × 10^-19 × ${sg(A)}) = ${sg(v)} m/s`] }; } },
    { id: 'I', label: 'Current from the drift speed: I = n e A v_d', fields: [nF(), posF('A', 'Cross-section area A', '2', U.areaMm), posF('v', 'Drift speed v_d', '0.1', [['mm/s', 1e-3], ['m/s', 1], ['cm/s', 0.01]])],
      tip: 'Check the unit of v_d: a drift of 0.1 mm/s is 10⁻⁴ m/s.',
      solve: ({ n, A, v }) => { const I = n * QE * A * v; return { ans: `The current is ${en(I, 'A')}.`, work: ['I = n e A v_d', `I = ${sg(n)} × 1.602 × 10^-19 × ${sg(A)} × ${sg(v)}`, `I = ${sg(I)} A`] }; } },
    { id: 'n', label: 'Free electron density of a metal: n = z ρ N_A / M', fields: [
      posF('rho', 'Density ρ', '8.96', [['g/cm³', 1000], ['kg/m³', 1]]), posF('M', 'Molar mass M', '63.5', [['g/mol', 1]]), { k: 'z', label: 'Free electrons per atom z', def: '1', gt: 0 }],
      tip: 'Density in kg/m³ and molar mass in kg/mol (or both in grams) must match. 8.96 g/cm³ is 8960 kg/m³.',
      solve: ({ rho, M, z }) => { const n = (z * rho * 1000 * NA) / M; return { ans: `The free electron density is ${sg(n)} m⁻³ (${sg(n / 1e28)} × 10²⁸ m⁻³).`, work: ['Atoms per m³ = ρ N_A ÷ M (ρ in g/m³, M in g/mol)', `ρ = ${sg(rho)} kg/m³ = ${sg(rho * 1000)} g/m³`, `n = z ρ N_A ÷ M = ${sg(z)} × ${sg(rho * 1000)} × 6.022 × 10^23 ÷ ${sg(M)}`, `n = ${sg(n)} m⁻³`] }; } },
    { id: 'time', label: 'Time for an electron to travel along a wire', fields: [posF('L', 'Length of wire L', '1', U.len), posF('I', 'Current I', '1', U.curr), posF('A', 'Cross-section area A', '1', U.areaMm), nF()],
      tip: 'The lamp lights at once because the field travels almost at light speed. Each electron itself takes hours to cross a metre.',
      solve: ({ L, I, A, n }) => { const v = I / (n * QE * A), t = L / v; return { ans: `An electron takes ${dur(t)} to travel ${sg(L)} m (drift speed ${sg(v)} m/s).`, work: [`v_d = I ÷ (n e A) = ${sg(v)} m/s`, 't = L ÷ v_d', `t = ${sg(L)} ÷ ${sg(v)} = ${sg(t)} s`] }; } },
    { id: 'tau', label: 'Relaxation time and mobility', fields: [nF(), { k: 'rho', label: 'Resistivity ρ', def: '1.68', units: [['×10⁻⁸ Ω m', 1e-8], ['Ω m', 1]], gt: 0, hint: 'Copper 1.68, silver 1.59, aluminium 2.65 (×10⁻⁸ Ω m)' }],
      tip: 'τ = m / (n e² ρ). It comes out near 10⁻¹⁴ s: the time between collisions of an electron with the lattice.',
      solve: ({ n, rho }) => { const t = ME / (n * QE * QE * rho), mu = (QE * t) / ME; return { ans: `The relaxation time is ${sg(t)} s and the mobility ${sg(mu)} m²/(V s).`, work: ['τ = m ÷ (n e² ρ)', `τ = 9.109 × 10^-31 ÷ (${sg(n)} × (1.602 × 10^-19)² × ${sg(rho)})`, `τ = ${sg(t)} s`, `Mobility μ = e τ ÷ m = ${sg(mu)} m²/(V s)`] }; } },
  ],
  presets: [
    { label: 'Copper, 1 A in 1 mm²', prob: 'vd', v: { I: '1', A: '1', n: '8.49' } },
    { label: '2 A in a 1.5 mm wire', prob: 'vdD', v: { I: '2', d: '1.5', n: '8.49' } },
    { label: 'Electron density of copper', prob: 'n', v: { rho: '8.96', M: '63.5', z: '1' } },
    { label: '1 metre of copper wire', prob: 'time', v: { L: '1', I: '1', A: '1', n: '8.49' } },
    { label: 'Relaxation time of copper', prob: 'tau', v: { n: '8.49', rho: '1.68' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Galvanometer conversion
const gF: Field = { k: 'G', label: 'Galvanometer resistance G', def: '50', units: [['Ω', 1]], gt: 0 };
const igF = (def = '1'): Field => ({ k: 'Ig', label: 'Full-scale current Ig', def, units: [['mA', 1e-3], ['µA', 1e-6], ['A', 1]], gt: 0 });
const ohm = (x: number) => { const a = Math.abs(x); return a >= 1e3 ? `${sg(x / 1e3)} kΩ` : a >= 1 ? `${sg(x)} Ω` : `${sg(x * 1e3)} mΩ`; };
export const GALVO: SolverSet = {
  probs: [
    { id: 'shunt', label: 'Make an ammeter: find the shunt S', fields: [gF, igF(), posF('I0', 'Range wanted (full-scale current)', '2', [['A', 1], ['mA', 1e-3]])],
      tip: 'The shunt goes in parallel and carries I − Ig, not I. Its value is tiny, so it is usually quoted in milliohms.',
      solve: ({ G, Ig, I0 }) => {
        if (I0 <= Ig) return { err: 'The new range must be bigger than the full-scale current of the galvanometer itself.' };
        const S = (Ig * G) / (I0 - Ig), RA = (G * S) / (G + S);
        return { ans: `Connect a shunt of ${ohm(S)} in parallel. The ammeter then reads up to ${sg(I0)} A and its resistance is ${ohm(RA)}.`, work: ['Ig G = (I − Ig) S, because the shunt and the coil share the same voltage', `S = Ig G ÷ (I − Ig) = ${sg(Ig)} × ${sg(G)} ÷ (${sg(I0)} − ${sg(Ig)})`, `S = ${sg(S)} Ω`, `Ammeter resistance = G S ÷ (G + S) = ${sg(RA)} Ω (almost zero, as an ammeter should be)`] };
      } },
    { id: 'series', label: 'Make a voltmeter: find the series resistance R', fields: [gF, igF(), posF('V0', 'Range wanted (full-scale voltage)', '10', [['V', 1], ['mV', 1e-3]])],
      tip: 'R is added in series with the coil, so the total is V ÷ Ig. Subtract G at the end: R = V/Ig − G.',
      solve: ({ G, Ig, V0 }) => {
        const tot = V0 / Ig;
        if (tot <= G) return { err: `That range is too small: the galvanometer alone already reads up to ${sg(Ig * G)} V. Choose a bigger voltage.` };
        const R = tot - G;
        return { ans: `Connect ${ohm(R)} in series. The voltmeter then reads up to ${sg(V0)} V and its resistance is ${ohm(tot)}.`, work: ['V = Ig (G + R)', `G + R = V ÷ Ig = ${sg(V0)} ÷ ${sg(Ig)} = ${sg(tot)} Ω`, `R = ${sg(tot)} − ${sg(G)} = ${sg(R)} Ω`, `Voltmeter resistance = G + R = ${sg(tot)} Ω (large, as a voltmeter should be)`] };
      } },
    { id: 'irange', label: 'Find the ammeter range from a shunt: I = Ig (1 + G / S)', fields: [gF, igF(), { k: 'S', label: 'Shunt S', def: '0.025', units: [['Ω', 1], ['mΩ', 1e-3]], gt: 0 }],
      tip: 'Do not forget the Ig that goes through the coil itself: the total is Ig + the current in the shunt.',
      solve: ({ G, Ig, S }) => { const I = Ig * (1 + G / S); return { ans: `The ammeter reads up to ${sg(I)} A.`, work: ['Ig G = (I − Ig) S, so I = Ig (1 + G ÷ S)', `I = ${sg(Ig)} × (1 + ${sg(G)} ÷ ${sg(S)})`, `I = ${sg(I)} A`] }; } },
    { id: 'vrange', label: 'Find the voltmeter range from a series resistance', fields: [gF, igF(), posF('R', 'Series resistance R', '9950', U.ohm)],
      tip: 'The range is Ig times the total resistance G + R, not Ig times R.',
      solve: ({ G, Ig, R }) => { const V = Ig * (G + R); return { ans: `The voltmeter reads up to ${sg(V)} V.`, work: ['V = Ig (G + R)', `V = ${sg(Ig)} × (${sg(G)} + ${sg(R)})`, `V = ${sg(V)} V`] }; } },
  ],
  presets: [
    { label: '2 A ammeter', prob: 'shunt', v: { G: '50', Ig: '1', I0: '2' } },
    { label: '0 to 1 A ammeter', prob: 'shunt', v: { G: '100', Ig: '0.5', I0: '1' } },
    { label: '10 V voltmeter', prob: 'series', v: { G: '50', Ig: '1', V0: '10' } },
    { label: '3 V voltmeter, 100 µA', prob: 'series', v: { G: '200', Ig: '100', V0: '3' }, u: { Ig: 'µA' } },
    { label: 'What does this shunt give?', prob: 'irange', v: { G: '50', Ig: '1', S: '0.025' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Inductance
const muF: Field = { k: 'mu', label: 'Core material μr', def: '1', gt: 0, hint: 'Air or vacuum 1; a soft-iron core is often taken as about 1000' };
const hy = (x: number) => en(x, 'H');
export const INDUCT: SolverSet = {
  probs: [
    { id: 'L', label: 'Self-inductance of a long solenoid: L = μ₀ μr N² A / ℓ', fields: [turns('N', 'Number of turns N', '500'), posF('A', 'Cross-section area A', '4', U.area), posF('l', 'Length ℓ', '25', U.lenCm), muF],
      tip: 'N is squared: doubling the turns makes L four times bigger. Convert cm² to m² before you multiply.',
      solve: ({ N, A, l, mu }) => { const L = (MU0 * mu * N * N * A) / l; return { ans: `The self-inductance is ${hy(L)}.`, work: ['L = μ₀ μr N² A ÷ ℓ', `L = 1.257 × 10^-6 × ${sg(mu)} × (${sg(N)})² × ${sg(A)} m² ÷ ${sg(l)} m`, `L = ${sg(L)} H`] }; } },
    { id: 'M', label: 'Mutual inductance of two coaxial solenoids: M = μ₀ μr N₁ N₂ A / ℓ', fields: [turns('N1', 'Turns on the outer coil N₁', '300'), turns('N2', 'Turns on the inner coil N₂', '100'), posF('A', 'Area of the inner coil A', '2', U.area), posF('l', 'Length ℓ', '30', U.lenCm), muF],
      tip: 'The area is the inner coil\'s (where the flux really is), not the outer one\'s, when the inner coil is wound through the outer.',
      solve: ({ N1, N2, A, l, mu }) => { const M = (MU0 * mu * N1 * N2 * A) / l; return { ans: `The mutual inductance is ${hy(M)}.`, work: ['M = μ₀ μr N₁ N₂ A ÷ ℓ', `M = 1.257 × 10^-6 × ${sg(mu)} × ${sg(N1)} × ${sg(N2)} × ${sg(A)} m² ÷ ${sg(l)} m`, `M = ${sg(M)} H`] }; } },
    { id: 'emf', label: 'Induced emf: ε = L ΔI / Δt (or M ΔI / Δt)', fields: [posF('L', 'Inductance L (or M)', '0.5', U.ind), { k: 'dI', label: 'Change in current ΔI', def: '2', units: U.curr }, posF('t', 'Time taken Δt', '0.1', U.time)],
      tip: 'The minus sign in ε = −L ΔI/Δt only gives the direction: the emf opposes the change in current.',
      solve: ({ L, dI, t }) => { const e = -L * (dI / t); return { ans: dI === 0 ? 'The current does not change, so there is no induced emf: 0 V.' : `The induced emf is ${en(Math.abs(e), 'V')}, ${dir(dI, 'opposing the rise in current', 'opposing the fall in current')}.`, work: ['ε = −L ΔI ÷ Δt', `ε = −${sg(L)} H × ${sgn(dI)} A ÷ ${sg(t)} s`, `ε = ${sg(e)} V, size ${en(Math.abs(e), 'V')}`] }; } },
    { id: 'U', label: 'Energy stored in an inductor: U = ½ L I²', fields: [posF('L', 'Inductance L', '0.2', U.ind), { k: 'I', label: 'Current I', def: '3', units: U.curr }],
      tip: 'Square the current first, then multiply by half of L: a common slip is squaring the whole ½LI.',
      solve: ({ L, I }) => { const U_ = 0.5 * L * I * I; return { ans: `The stored energy is ${en(U_, 'J')}.`, work: ['U = ½ L I²', `U = ½ × ${sg(L)} H × (${sgn(I)} A)²`, `U = ${sg(U_)} J`] }; } },
    { id: 'tau', label: 'Time constant of an L-R circuit: τ = L / R', fields: [posF('L', 'Inductance L', '0.5', U.ind), posF('R', 'Resistance R', '25', U.ohm)],
      tip: 'After one τ the current has reached about 63% of its final value; after 5τ it is about 99%.',
      solve: ({ L, R }) => { const t = L / R; return { ans: `The time constant is ${en(t, 's')}; the current is about 63% of its final value after one τ and about 99% after ${en(5 * t, 's')}.`, work: ['τ = L ÷ R', `τ = ${sg(L)} H ÷ ${sg(R)} Ω`, `τ = ${sg(t)} s`] }; } },
  ],
  presets: [
    { label: '500-turn air solenoid', prob: 'L', v: { N: '500', A: '4', l: '25', mu: '1' } },
    { label: 'Same solenoid with iron', prob: 'L', v: { N: '500', A: '4', l: '25', mu: '1000' } },
    { label: 'Two coaxial coils', prob: 'M', v: { N1: '300', N2: '100', A: '2', l: '30', mu: '1' } },
    { label: 'Current drops quickly', prob: 'emf', v: { L: '0.5', dI: '-2', t: '0.1' } },
    { label: 'Energy in a 0.2 H coil', prob: 'U', v: { L: '0.2', I: '3' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Microscope and telescope (lengths in metres: the unit boxes show cm)
const fcm = (k: string, label: string, def: string): Field => ({ k, label, def, units: [['cm', 0.01], ['mm', 1e-3], ['m', 1]], gt: 0 });
const Dm = D_NEAR / 100;
const cm = (m: number) => `${sg(m * 100)} cm`;
const mode: Field = { k: 'mode', label: 'Final image', def: '0', sel: ['At infinity (normal adjustment)', 'At the near point (25 cm)'] };
export const OPTICS: SolverSet = {
  probs: [
    { id: 'lens', label: 'Magnifying glass: M = D / f or 1 + D / f', fields: [fcm('f', 'Focal length f', '5'), mode],
      tip: 'Normal adjustment (relaxed eye) gives D/f; the image at the near point gives 1 + D/f, one more. D = 25 cm.',
      solve: ({ f, mode: m }) => { const M = m === 0 ? Dm / f : 1 + Dm / f; return { ans: `The magnifying power is ${sg(M)}×.`, work: m === 0 ? ['Image at infinity: M = D ÷ f', `M = ${sg(D_NEAR)} cm ÷ ${cm(f)} = ${sg(M)}`] : ['Image at the near point: M = 1 + D ÷ f', `M = 1 + ${sg(D_NEAR)} ÷ ${sg(f * 100)} = ${sg(M)}`] }; } },
    { id: 'micro', label: 'Compound microscope from the object distance', fields: [fcm('fo', 'Objective focal length f₀', '1'), fcm('fe', 'Eyepiece focal length fₑ', '5'), fcm('uo', 'Object distance from the objective', '1.1'), mode],
      tip: 'The object must sit just outside f₀ (u₀ > f₀) so the objective makes a real, enlarged image. M is the product of the two magnifications.',
      solve: ({ fo, fe, uo, mode: m }) => {
        if (uo <= fo) return { err: 'The object must be farther from the objective than its focal length, otherwise the objective makes no real image.' };
        const vo = (fo * uo) / (uo - fo), mo = vo / uo, me = m === 0 ? Dm / fe : 1 + Dm / fe, L = m === 0 ? vo + fe : vo + (Dm * fe) / (Dm + fe), M = mo * me;
        return { ans: `The total magnification is ${sg(M)}× (image inverted), and the lenses are ${cm(L)} apart.`, work: ['Objective: 1/v₀ = 1/f₀ − 1/u₀', `v₀ = f₀ u₀ ÷ (u₀ − f₀) = ${cm(vo)}`, `m₀ = v₀ ÷ u₀ = ${sg(mo)}`, m === 0 ? `Eyepiece (image at infinity): mₑ = D ÷ fₑ = ${sg(me)}` : `Eyepiece (image at the near point): mₑ = 1 + D ÷ fₑ = ${sg(me)}`, `M = m₀ × mₑ = ${sg(M)}`, `Distance between lenses = ${cm(L)}`] };
      } },
    { id: 'microL', label: 'Compound microscope from the tube length (approximate)', fields: [fcm('fo', 'Objective focal length f₀', '1.25'), fcm('fe', 'Eyepiece focal length fₑ', '5'), fcm('L', 'Tube length L (between the lenses)', '15')],
      tip: 'This textbook shortcut M ≈ (L / f₀)(D / fₑ) works when the object is very close to f₀ and the final image is at infinity.',
      solve: ({ fo, fe, L }) => { const M = (L / fo) * (Dm / fe); return { ans: `The magnifying power is about ${sg(M)}×.`, work: ['M ≈ (L ÷ f₀) × (D ÷ fₑ)', `M ≈ (${sg(L * 100)} ÷ ${sg(fo * 100)}) × (${sg(D_NEAR)} ÷ ${sg(fe * 100)})`, `M ≈ ${sg(L / fo)} × ${sg(Dm / fe)} = ${sg(M)}`] }; } },
    { id: 'tele', label: 'Refracting telescope: M = f₀ / fₑ', fields: [fcm('fo', 'Objective focal length f₀', '100'), fcm('fe', 'Eyepiece focal length fₑ', '2'), mode],
      tip: 'The long lens is the objective. Normal adjustment: M = f₀/fₑ and length f₀ + fₑ. Image at the near point: M = (f₀/fₑ)(1 + fₑ/D).',
      solve: ({ fo, fe, mode: m }) => {
        const M = m === 0 ? fo / fe : (fo / fe) * (1 + fe / Dm), L = m === 0 ? fo + fe : fo + (Dm * fe) / (Dm + fe);
        return { ans: `The angular magnification is ${sg(M)}× and the tube is ${cm(L)} long.`, work: m === 0 ? ['Normal adjustment: M = f₀ ÷ fₑ', `M = ${sg(fo * 100)} ÷ ${sg(fe * 100)} = ${sg(M)}`, `Length = f₀ + fₑ = ${cm(L)}`] : ['Image at the near point: M = (f₀ ÷ fₑ)(1 + fₑ ÷ D)', `M = (${sg(fo * 100)} ÷ ${sg(fe * 100)}) × (1 + ${sg(fe * 100)} ÷ ${sg(D_NEAR)}) = ${sg(M)}`, `Length = f₀ + uₑ = ${cm(L)}`] };
      } },
    { id: 'teleF', label: 'Telescope: find the eyepiece from the magnification', fields: [{ k: 'M', label: 'Magnification wanted M', def: '50', gt: 0 }, fcm('fo', 'Objective focal length f₀', '100')],
      tip: 'A bigger M needs a longer objective or a shorter eyepiece. Here the final image is at infinity (normal adjustment).',
      solve: ({ M, fo }) => { const fe = fo / M; return { ans: `The eyepiece needs a focal length of ${cm(fe)}; the tube length is ${cm(fo + fe)}.`, work: ['M = f₀ ÷ fₑ, so fₑ = f₀ ÷ M', `fₑ = ${sg(fo * 100)} cm ÷ ${sg(M)} = ${cm(fe)}`, `Length = f₀ + fₑ = ${cm(fo + fe)}`] }; } },
  ],
  presets: [
    { label: 'Magnifying glass, f = 5 cm', prob: 'lens', v: { f: '5', mode: '0' } },
    { label: 'Microscope, object at 1.1 cm', prob: 'micro', v: { fo: '1', fe: '5', uo: '1.1', mode: '0' } },
    { label: 'Microscope by tube length', prob: 'microL', v: { fo: '1.25', fe: '5', L: '15' } },
    { label: 'Telescope 100 cm and 2 cm', prob: 'tele', v: { fo: '100', fe: '2', mode: '0' } },
    { label: 'Eyepiece for 50×', prob: 'teleF', v: { M: '50', fo: '100' } },
  ],
};
