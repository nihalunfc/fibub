// "Solve my numbers" sets for eight Learn tools: sound-wave-visualiser (SOUND), magnetic-field-mapper (MAGNET),
// fleming-rule (FLEMING), cardiac-cycle (HEART), oxygen-dissociation (OXYGEN), photosynthesis-lab (PHOTO),
// transpiration-lab (TRANSP) and natural-selection (SELECT). Plain TypeScript, no DOM. Same shape as phys-a.ts: each
// problem gets the typed numbers already converted to the first (base) unit of each field and returns the answer sentence
// and the working an exam would mark. Drawn UI: phys-a-ui.ts. Hand-checked in tests/tools/<id>.mjs. School maths only.
import { sg as sgBase, type Field, type SolverSet, type Unit } from './phys-a';
import { satStandard } from '../sci/hbcurve';

/** phys-a's sg shows anything under 1e-12 as 0; charges and masses of single particles need to show. */
function sg(x: number, n = 3): string {
  if (Number.isFinite(x) && x !== 0 && Math.abs(x) < 1e-12) { const [m, e] = Math.abs(x).toExponential(n - 1).split('e'); return `${x < 0 ? '−' : ''}${m} × 10^${Number(e)}`; }
  return sgBase(x, n);
}
const sgn = (x: number) => (x < 0 ? `(${sg(x)})` : sg(x));
const PI = Math.PI;
const MU0 = 4 * PI * 1e-7; // T m/A, the school value (CODATA 2018: 1.25663706212e-6, the same to 9 figures)
const E = 1.602176634e-19; // C, exact
const tes = (b: number) => { const a = Math.abs(b); return a >= 1 ? `${sg(b)} T` : a >= 1e-3 ? `${sg(b * 1e3)} mT` : a >= 1e-6 ? `${sg(b * 1e6)} µT` : `${sg(b * 1e9)} nT`; };
const lenS = (m: number) => (Math.abs(m) >= 1 ? `${sg(m)} m` : Math.abs(m) >= 0.01 ? `${sg(m * 100)} cm` : `${sg(m * 1000)} mm`);
const pc = (x: number) => `${sg(x * 100)} %`;
const sinD = (d: number) => { const x = Math.sin((d * PI) / 180); return Math.abs(x) < 1e-12 ? 0 : x; };
const cosD = (d: number) => { const x = Math.cos((d * PI) / 180); return Math.abs(x) < 1e-12 ? 0 : x; };

const U = {
  deg: [['°', 1], ['rad', 180 / PI]] as Unit[],
  len: [['m', 1], ['cm', 0.01], ['mm', 0.001]] as Unit[],
  amp: [['A', 1], ['mA', 0.001]] as Unit[],
  tesla: [['T', 1], ['mT', 0.001], ['µT', 1e-6]] as Unit[],
  speed: [['m/s', 1], ['km/h', 1 / 3.6]] as Unit[],
  time: [['s', 1], ['ms', 0.001], ['min', 60]] as Unit[],
  frac: [['fraction', 1], ['%', 0.01]] as Unit[],
  min: [['min', 1], ['s', 1 / 60], ['h', 60]] as Unit[],
  mL: [['mL', 1], ['cm³', 1], ['L', 1000]] as Unit[],
  mm: [['mm', 1], ['cm', 10]] as Unit[],
  hr: [['h', 1], ['min', 1 / 60]] as Unit[],
  Hb: [['g/dL', 1], ['g/L', 0.1]] as Unit[],
};
const angle = (def = '90'): Field => ({ k: 'th', label: 'Angle θ between the wire (or velocity) and the field', def, units: U.deg, min: 0, max: 180, hint: '90° means at right angles: the biggest effect' });
const BF: Field = { k: 'B', label: 'Magnetic field B', def: '0.2', units: U.tesla, min: 0 };

// ---------------------------------------------------------------------------------------------------------
// Sound
export const SOUND: SolverSet = {
  probs: [
    { id: 'v', label: 'Wave speed: v = f λ', fields: [
      { k: 'f', label: 'Frequency f', def: '256', units: [['Hz', 1], ['kHz', 1000]], gt: 0 }, { k: 'lam', label: 'Wavelength λ', def: '1.33', units: U.len, gt: 0 }],
      tip: 'Wavelength must be in metres before you multiply. If it is in cm, the unit box divides by 100 for you.',
      solve: ({ f, lam }) => ({ ans: `The speed of the wave is ${sg(f * lam)} m/s.`, work: ['v = f λ', `v = ${sg(f)} Hz × ${sg(lam)} m`, `v = ${sg(f * lam)} m/s`] }) },
    { id: 'f', label: 'Frequency: f = v / λ', fields: [
      { k: 'v', label: 'Speed v', def: '340', units: [['m/s', 1], ['km/h', 1 / 3.6]], gt: 0 }, { k: 'lam', label: 'Wavelength λ', def: '0.68', units: U.len, gt: 0 }],
      tip: 'The speed of sound in air is about 340 m/s, but 1,480 m/s in water and 5,900 m/s in steel. Use the speed of the medium the sound is in.',
      solve: ({ v, lam }) => ({ ans: `The frequency is ${sg(v / lam)} Hz.`, work: ['f = v / λ', `f = ${sg(v)} m/s ÷ ${sg(lam)} m`, `f = ${sg(v / lam)} Hz`, `Time period T = 1 / f = ${sg(1000 / (v / lam))} ms`] }) },
    { id: 'lam', label: 'Wavelength: λ = v / f', fields: [
      { k: 'v', label: 'Speed v', def: '340', units: [['m/s', 1], ['km/h', 1 / 3.6]], gt: 0 }, { k: 'f', label: 'Frequency f', def: '500', units: [['Hz', 1], ['kHz', 1000]], gt: 0 }],
      tip: 'Higher frequency means a shorter wavelength at the same speed. Do not mix kHz with m/s: change kHz to Hz first.',
      solve: ({ v, f }) => ({ ans: `The wavelength is ${lenS(v / f)}.`, work: ['λ = v / f', `λ = ${sg(v)} m/s ÷ ${sg(f)} Hz`, `λ = ${sg(v / f)} m = ${sg((v / f) * 100)} cm`] }) },
    { id: 'T', label: 'Time period: T = 1 / f', fields: [
      { k: 'f', label: 'Frequency f', def: '250', units: [['Hz', 1], ['kHz', 1000]], gt: 0 }],
      tip: 'T is in seconds when f is in hertz. 4 ms is 0.004 s, not 4 s.',
      solve: ({ f }) => ({ ans: `The time period is ${sg(1 / f)} s (${sg(1000 / f)} ms).`, work: ['T = 1 / f', `T = 1 ÷ ${sg(f)} Hz`, `T = ${sg(1 / f)} s = ${sg(1000 / f)} ms`] }) },
    { id: 'echo', label: 'Distance from an echo: d = v t / 2', fields: [
      { k: 'v', label: 'Speed of sound v', def: '340', units: [['m/s', 1]], gt: 0 }, { k: 't', label: 'Time until the echo t', def: '1.5', units: U.time, gt: 0 }],
      tip: 'The sound goes there and back, so divide by 2. Forgetting the 2 doubles the distance.',
      solve: ({ v, t }) => ({ ans: `The distance is ${sg((v * t) / 2)} m.${t < 0.1 ? ' (Echo too quick: under 0.1 s you cannot hear it as a separate sound.)' : ''}`, work: ['Distance there and back = v t', `d = v t / 2 = ${sg(v)} × ${sg(t)} ÷ 2`, `d = ${sg((v * t) / 2)} m`] }) },
    { id: 'sonar', label: 'Sea depth from SONAR: d = v t / 2', fields: [
      { k: 'v', label: 'Speed of sound in sea water v', def: '1500', units: [['m/s', 1]], gt: 0 }, { k: 't', label: 'Time until the echo t', def: '2', units: U.time, gt: 0 }],
      tip: 'Use the speed in water (about 1,500 m/s), not 340 m/s, and halve the time: the pulse goes down and comes back.',
      solve: ({ v, t }) => ({ ans: `The sea is ${sg((v * t) / 2)} m deep.`, work: ['depth = v t / 2', `depth = ${sg(v)} m/s × ${sg(t)} s ÷ 2`, `depth = ${sg((v * t) / 2)} m`] }) },
    { id: 'air', label: 'Speed of sound in air at a temperature', fields: [
      { k: 'T', label: 'Air temperature', def: '20', units: [['°C', 1]], min: -50, max: 60 }],
      tip: 'Sound travels faster in warm air: about 0.6 m/s more for each degree. This is the school rule of thumb v ≈ 331 + 0.6 T; the tool above uses the exact gas formula, which agrees to within about 0.5 %.',
      solve: ({ T }) => ({ ans: `The speed of sound is about ${sg(331 + 0.6 * T)} m/s.`, work: ['v ≈ 331 + 0.6 T (T in °C, school rule of thumb)', `v ≈ 331 + 0.6 × ${sgn(T)}`, `v ≈ ${sg(331 + 0.6 * T)} m/s`] }) },
  ],
  presets: [
    { label: 'Tuning fork', prob: 'v', v: { f: '256', lam: '1.33' } },
    { label: 'Echo off a cliff', prob: 'echo', v: { v: '340', t: '1.5' } },
    { label: 'Sea depth', prob: 'sonar', v: { v: '1500', t: '2' } },
    { label: 'Wavelength of a note', prob: 'lam', v: { v: '340', f: '500' } },
    { label: 'Hot day', prob: 'air', v: { T: '35' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Magnetic fields (field mapper)
export const MAGNET: SolverSet = {
  probs: [
    { id: 'wire', label: 'Field near a long straight wire: B = μ₀ I / 2π r', fields: [
      { k: 'I', label: 'Current I', def: '10', units: U.amp, gt: 0 }, { k: 'r', label: 'Distance from the wire r', def: '5', units: [['cm', 0.01], ['m', 1], ['mm', 0.001]], gt: 0 }],
      tip: 'r is the distance from the middle of the wire, in metres. Using cm without converting makes B 100 times too big. Direction: right-hand grip rule.',
      solve: ({ I, r }) => { const B = (MU0 * I) / (2 * PI * r); return { ans: `The field is ${tes(B)}.`, work: ['B = μ₀ I / (2π r), with μ₀ = 4π × 10^-7 T m/A', `B = (4π × 10^-7 × ${sg(I)}) ÷ (2π × ${sg(r)})`, `B = ${sg(B)} T = ${tes(B)}`] }; } },
    { id: 'loop', label: 'Field at the centre of a circular coil: B = μ₀ N I / 2R', fields: [
      { k: 'N', label: 'Number of turns N', def: '1', gt: 0 }, { k: 'I', label: 'Current I', def: '5', units: U.amp, gt: 0 }, { k: 'R', label: 'Radius R', def: '10', units: [['cm', 0.01], ['m', 1], ['mm', 0.001]], gt: 0 }],
      tip: 'N turns add up: 50 turns gives 50 times the field of one. R is the radius, not the diameter.',
      solve: ({ N, I, R }) => { const B = (MU0 * N * I) / (2 * R); return { ans: `The field at the centre is ${tes(B)}.`, work: ['B = μ₀ N I / (2R)', `B = (4π × 10^-7 × ${sg(N)} × ${sg(I)}) ÷ (2 × ${sg(R)})`, `B = ${sg(B)} T = ${tes(B)}`] }; } },
    { id: 'sol', label: 'Field inside a long solenoid: B = μ₀ N I / L', fields: [
      { k: 'N', label: 'Total turns N', def: '500', gt: 0 }, { k: 'L', label: 'Length of the solenoid L', def: '25', units: [['cm', 0.01], ['m', 1]], gt: 0 }, { k: 'I', label: 'Current I', def: '2', units: U.amp, gt: 0 }],
      tip: 'n = N / L is the turns per metre. If the problem gives turns per cm, multiply by 100 first.',
      solve: ({ N, L, I }) => { const n = N / L, B = MU0 * n * I; return { ans: `The field inside is ${tes(B)}.`, work: [`Turns per metre n = N / L = ${sg(N)} ÷ ${sg(L)} = ${sg(n)} per m`, 'B = μ₀ n I', `B = 4π × 10^-7 × ${sg(n)} × ${sg(I)} = ${sg(B)} T`, `B = ${tes(B)}`] }; } },
    { id: 'force', label: 'Force on a current in a field: F = B I L sin θ', fields: [BF, { k: 'I', label: 'Current I', def: '5', units: U.amp, gt: 0 }, { k: 'L', label: 'Length of wire in the field L', def: '30', units: [['cm', 0.01], ['m', 1]], gt: 0 }, angle()],
      tip: 'If the wire is parallel to the field (θ = 0°) there is no force. Direction: Fleming\'s left-hand rule.',
      solve: ({ B, I, L, th }) => { const F = B * I * L * sinD(th); return { ans: F === 0 ? 'The force is 0 N: the wire runs along the field, so it feels no push.' : `The force is ${sg(F)} N.`, work: ['F = B I L sin θ', `F = ${sg(B)} T × ${sg(I)} A × ${sg(L)} m × sin ${sg(th)}°`, `F = ${sg(F)} N`] }; } },
    { id: 'par', label: 'Force between two parallel wires: F/L = μ₀ I₁ I₂ / 2π d', fields: [
      { k: 'I1', label: 'Current in wire 1', def: '10', units: U.amp, gt: 0 }, { k: 'I2', label: 'Current in wire 2', def: '10', units: U.amp, gt: 0 }, { k: 'd', label: 'Gap between the wires d', def: '10', units: [['cm', 0.01], ['m', 1]], gt: 0 }],
      tip: 'Currents in the same direction attract; opposite directions repel. This force per metre defines the ampere.',
      solve: ({ I1, I2, d }) => { const f = (MU0 * I1 * I2) / (2 * PI * d); return { ans: `The force is ${sg(f)} N on each metre of wire.`, work: ['F/L = μ₀ I₁ I₂ / (2π d)', `F/L = (4π × 10^-7 × ${sg(I1)} × ${sg(I2)}) ÷ (2π × ${sg(d)})`, `F/L = ${sg(f)} N/m`] }; } },
  ],
  presets: [
    { label: 'Wire at 5 cm', prob: 'wire', v: { I: '10', r: '5' } },
    { label: 'Single coil', prob: 'loop', v: { N: '1', I: '5', R: '10' } },
    { label: 'Solenoid', prob: 'sol', v: { N: '500', L: '25', I: '2' } },
    { label: 'Wire in a field', prob: 'force', v: { B: '0.2', I: '5', L: '30', th: '90' } },
    { label: 'Two wires', prob: 'par', v: { I1: '10', I2: '10', d: '10' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Fleming's rules, motors and generators
export const FLEMING: SolverSet = {
  probs: [
    { id: 'force', label: 'Motor force on a wire: F = B I L sin θ', fields: [BF, { k: 'I', label: 'Current I', def: '5', units: U.amp, gt: 0 }, { k: 'L', label: 'Length of wire in the field L', def: '30', units: [['cm', 0.01], ['m', 1]], gt: 0 }, angle()],
      tip: 'Point the first finger along the field, the second finger along the current: the thumb shows the force (left hand). Only the part of the wire inside the field counts.',
      solve: ({ B, I, L, th }) => { const F = B * I * L * sinD(th); return { ans: F === 0 ? 'The force is 0 N: the wire runs along the field.' : `The force is ${sg(F)} N.`, work: ['F = B I L sin θ', `F = ${sg(B)} T × ${sg(I)} A × ${sg(L)} m × sin ${sg(th)}°`, `F = ${sg(F)} N`] }; } },
    { id: 'emf', label: 'Generator: emf of a moving rod, ε = B L v sin θ', fields: [{ ...BF, def: '0.5' }, { k: 'L', label: 'Length of the rod L', def: '40', units: [['cm', 0.01], ['m', 1]], gt: 0 }, { k: 'v', label: 'Speed of the rod v', def: '3', units: U.speed, gt: 0 }, angle()],
      tip: 'v must be in m/s: divide km/h by 3.6. The rod, the field and its motion are at right angles for the biggest emf. Direction: Fleming\'s right-hand rule.',
      solve: ({ B, L, v, th }) => { const e = B * L * v * sinD(th); return { ans: e === 0 ? 'The emf is 0 V: the rod moves along the field, so it cuts no field lines.' : `The induced emf is ${sg(e)} V.`, work: ['ε = B L v sin θ', `ε = ${sg(B)} T × ${sg(L)} m × ${sg(v)} m/s × sin ${sg(th)}°`, `ε = ${sg(e)} V`] }; } },
    { id: 'cur', label: 'Induced current and the force that opposes the motion', fields: [{ ...BF, def: '0.5' }, { k: 'L', label: 'Length of the rod L', def: '40', units: [['cm', 0.01], ['m', 1]], gt: 0 }, { k: 'v', label: 'Speed of the rod v', def: '3', units: U.speed, gt: 0 }, { k: 'R', label: 'Resistance of the circuit R', def: '2', units: [['Ω', 1]], gt: 0 }],
      tip: 'The rod, field and motion are taken at right angles. The magnetic force on the induced current always opposes the motion (Lenz\'s law), so you must keep pulling.',
      solve: ({ B, L, v, R }) => { const e = B * L * v, I = e / R, F = B * I * L; return { ans: `The induced current is ${sg(I)} A, and the magnetic force opposing the motion is ${sg(F)} N.`, work: [`ε = B L v = ${sg(B)} × ${sg(L)} × ${sg(v)} = ${sg(e)} V`, `I = ε / R = ${sg(e)} ÷ ${sg(R)} = ${sg(I)} A`, `F = B I L = ${sg(B)} × ${sg(I)} × ${sg(L)} = ${sg(F)} N`, `Power you put in = F v = ${sg(F)} × ${sg(v)} = ${sg(F * v)} W = ε I (energy is conserved)`] }; } },
    { id: 'torque', label: 'Motor coil torque: τ = N B I A sin θ', fields: [
      { k: 'N', label: 'Turns in the coil N', def: '100', gt: 0 }, { ...BF, def: '0.5' }, { k: 'I', label: 'Current I', def: '2', units: U.amp, gt: 0 },
      { k: 'A', label: 'Area of the coil A', def: '200', units: [['cm²', 1e-4], ['m²', 1]], gt: 0 },
      { k: 'th', label: 'Angle between the coil\'s normal and the field θ', def: '90', units: U.deg, min: 0, max: 180, hint: '90° means the coil lies along the field: the biggest torque' }],
      tip: 'The torque is biggest when the coil plane is along the field and falls to zero when it is face-on to the field. That is why a motor needs a commutator.',
      solve: ({ N, B, I, A, th }) => { const t = N * B * I * A * sinD(th); return { ans: t === 0 ? 'The torque is 0 N m: the coil is face-on to the field.' : `The torque is ${sg(t)} N m.`, work: ['τ = N B I A sin θ', `τ = ${sg(N)} × ${sg(B)} T × ${sg(I)} A × ${sg(A)} m² × sin ${sg(th)}°`, `τ = ${sg(t)} N m`] }; } },
    { id: 'charge', label: 'Force on a moving charge: F = q v B sin θ', fields: [
      { k: 'q', label: 'Charge q', def: '1', units: [['e', E], ['C', 1], ['µC', 1e-6]], gt: 0, hint: '1 e is the charge of a proton, 1.602 × 10^-19 C' },
      { k: 'v', label: 'Speed v', def: '1e6', units: [['m/s', 1], ['km/s', 1000]], gt: 0 }, { ...BF, def: '0.01' }, angle()],
      tip: 'The force is sideways to the velocity, so it bends the path without changing the speed. For a negative charge, the direction is reversed.',
      solve: ({ q, v, B, th }) => { const F = q * v * B * sinD(th); return { ans: F === 0 ? 'The force is 0 N: the charge moves along the field.' : `The force is ${sg(F)} N.`, work: ['F = q v B sin θ', `F = ${sg(q)} C × ${sg(v)} m/s × ${sg(B)} T × sin ${sg(th)}°`, `F = ${sg(F)} N`] }; } },
    { id: 'radius', label: 'Circle made by a charge in a field: r = m v / q B', fields: [
      { k: 'm', label: 'Mass m', def: '1.67e-27', units: [['kg', 1], ['g', 0.001]], gt: 0, hint: 'a proton is 1.67 × 10^-27 kg' }, { k: 'q', label: 'Charge q', def: '1', units: [['e', E], ['C', 1]], gt: 0 },
      { k: 'v', label: 'Speed v', def: '1e6', units: [['m/s', 1], ['km/s', 1000]], gt: 0 }, { ...BF, def: '0.5', gt: 0 }],
      tip: 'This is for a charge moving at right angles to the field. A heavier or faster particle makes a bigger circle; a stronger field makes a smaller one.',
      solve: ({ m, q, v, B }) => { const r = (m * v) / (q * B); return { ans: `The radius of the circle is ${lenS(r)}.`, work: ['The magnetic force provides the centripetal force: q v B = m v² / r', 'r = m v / (q B)', `r = (${sg(m)} × ${sg(v)}) ÷ (${sg(q)} × ${sg(B)})`, `r = ${sg(r)} m`] }; } },
  ],
  presets: [
    { label: 'Wire in a field', prob: 'force', v: { B: '0.2', I: '5', L: '30', th: '90' } },
    { label: 'Rod generator', prob: 'emf', v: { B: '0.5', L: '40', v: '3', th: '90' } },
    { label: 'Motor coil', prob: 'torque', v: { N: '100', B: '0.5', I: '2', A: '200', th: '90' } },
    { label: 'Proton in a field', prob: 'radius', v: { m: '1.67e-27', q: '1', v: '1e6', B: '0.5' } },
    { label: 'Induced current', prob: 'cur', v: { B: '0.5', L: '40', v: '3', R: '2' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// The heart (cardiac cycle). School arithmetic only, never medical advice.
export const HEART: SolverSet = {
  probs: [
    { id: 'co', label: 'Cardiac output: CO = stroke volume × heart rate', fields: [
      { k: 'sv', label: 'Stroke volume SV', def: '70', units: [['mL', 1], ['L', 1000]], gt: 0 }, { k: 'hr', label: 'Heart rate HR', def: '72', units: [['beats/min', 1]], gt: 0 }],
      tip: 'Stroke volume is per beat, in mL. Multiply by beats per minute, then divide by 1000 to get litres per minute.',
      solve: ({ sv, hr }) => { const c = sv * hr; return { ans: `The cardiac output is ${sg(c / 1000)} L/min.`, work: ['CO = SV × HR', `CO = ${sg(sv)} mL × ${sg(hr)} beats/min = ${sg(c)} mL/min`, `CO = ${sg(c)} ÷ 1000 = ${sg(c / 1000)} L/min`] }; } },
    { id: 'sv', label: 'Stroke volume and ejection fraction from EDV and ESV', fields: [
      { k: 'edv', label: 'End-diastolic volume EDV (full)', def: '120', units: [['mL', 1]], gt: 0 }, { k: 'esv', label: 'End-systolic volume ESV (what is left)', def: '50', units: [['mL', 1]], min: 0 }],
      tip: 'EDV is the volume when the ventricle is fullest; ESV is what is left after it squeezes. ESV must be smaller than EDV.',
      solve: ({ edv, esv }) => {
        if (esv >= edv) return { err: 'The volume left after the beat (ESV) must be smaller than the full volume (EDV).' };
        const sv = edv - esv, ef = sv / edv;
        return { ans: `The stroke volume is ${sg(sv)} mL and the ejection fraction is ${pc(ef)}.`, work: ['SV = EDV − ESV', `SV = ${sg(edv)} − ${sg(esv)} = ${sg(sv)} mL`, 'EF = SV / EDV × 100', `EF = ${sg(sv)} ÷ ${sg(edv)} × 100 = ${pc(ef)}`] };
      } },
    { id: 'svco', label: 'Stroke volume from cardiac output: SV = CO / HR', fields: [
      { k: 'co', label: 'Cardiac output CO', def: '5', units: [['L/min', 1000], ['mL/min', 1]], gt: 0 }, { k: 'hr', label: 'Heart rate HR', def: '75', units: [['beats/min', 1]], gt: 0 }],
      tip: 'Put CO in mL/min (1 L = 1000 mL) before dividing by the rate. The answer is mL per beat.',
      solve: ({ co, hr }) => ({ ans: `The stroke volume is ${sg(co / hr)} mL per beat.`, work: ['SV = CO / HR', `SV = ${sg(co)} mL/min ÷ ${sg(hr)} beats/min`, `SV = ${sg(co / hr)} mL`] }) },
    { id: 'hr', label: 'Heart rate from the length of one cycle: HR = 60 / T', fields: [
      { k: 'T', label: 'Time for one cardiac cycle T', def: '0.8', units: U.time, gt: 0 }],
      tip: 'T must be in seconds, because the 60 is the seconds in a minute. 0.8 s per beat is 75 beats per minute.',
      solve: ({ T }) => ({ ans: `The heart rate is ${sg(60 / T)} beats per minute.`, work: ['HR = 60 / T', `HR = 60 ÷ ${sg(T)} s`, `HR = ${sg(60 / T)} beats/min`] }) },
    { id: 'ecg', label: 'Heart rate from an ECG strip (25 mm/s paper)', fields: [
      { k: 'sq', label: 'Large squares between two R peaks', def: '4', gt: 0, hint: 'each large square is 5 mm = 0.2 s at 25 mm/s' }],
      tip: 'This only works for the usual paper speed of 25 mm/s, so check the strip says so. It is a school skill, not a way to check a real heart.',
      solve: ({ sq }) => ({ ans: `The heart rate is ${sg(300 / sq)} beats per minute.`, work: [`One R–R gap = ${sg(sq)} × 0.2 s = ${sg(sq * 0.2)} s`, `HR = 60 ÷ ${sg(sq * 0.2)} = ${sg(300 / sq)} beats/min`, 'Shortcut: HR = 300 ÷ number of large squares'] }) },
    { id: 'pct', label: 'Percentage change (e.g. heart rate after exercise)', fields: [
      { k: 'a', label: 'Value before', def: '70', gt: 0 }, { k: 'b', label: 'Value after', def: '140', min: 0 }],
      tip: 'Divide the change by the value BEFORE, not after. A rise from 70 to 140 is +100 %, but a fall from 140 to 70 is only −50 %.',
      solve: ({ a, b }) => { const p = ((b - a) / a) * 100; return { ans: `${p >= 0 ? 'An increase' : 'A decrease'} of ${sg(Math.abs(p))} %.`, work: ['% change = (after − before) / before × 100', `% change = (${sg(b)} − ${sg(a)}) ÷ ${sg(a)} × 100`, `% change = ${sg(p)} %`] }; } },
  ],
  presets: [
    { label: 'Resting adult', prob: 'co', v: { sv: '70', hr: '72' } },
    { label: 'Ejection fraction', prob: 'sv', v: { edv: '120', esv: '50' } },
    { label: 'Find stroke volume', prob: 'svco', v: { co: '5', hr: '75' } },
    { label: 'Cycle of 0.8 s', prob: 'hr', v: { T: '0.8' } },
    { label: 'ECG strip', prob: 'ecg', v: { sq: '4' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Oxygen and haemoglobin. Hufner's constant 1.34 mL O2 per g Hb, dissolved oxygen 0.003 mL per dL per mmHg.
const mmHg = [['mmHg', 1], ['kPa', 7.50062]] as Unit[];
const hbF: Field = { k: 'hb', label: 'Haemoglobin concentration', def: '15', units: U.Hb, gt: 0 };
const satF = (k: string, label: string, def: string): Field => ({ k, label, def, units: [['%', 1]], min: 0, max: 100 });
export const OXYGEN: SolverSet = {
  probs: [
    { id: 'content', label: 'Oxygen content of blood: 1.34 × Hb × saturation + 0.003 × PO₂', fields: [hbF, satF('sat', 'Saturation of haemoglobin', '97.5'), { k: 'po2', label: 'PO₂ of the blood', def: '100', units: mmHg, min: 0 }],
      tip: 'Saturation goes into the formula as a fraction (97.5 % is 0.975). The dissolved part (0.003 × PO₂) is small, but exam questions often ask for it.',
      solve: ({ hb, sat, po2 }) => { const bound = 1.34 * hb * (sat / 100), diss = 0.003 * po2, c = bound + diss; return { ans: `The blood carries ${sg(c)} mL of oxygen per 100 mL.`, work: [`Bound to haemoglobin = 1.34 × ${sg(hb)} × ${sg(sat / 100)} = ${sg(bound)} mL per 100 mL`, `Dissolved = 0.003 × ${sg(po2)} = ${sg(diss)} mL per 100 mL`, `Total = ${sg(bound)} + ${sg(diss)} = ${sg(c)} mL per 100 mL`] }; } },
    { id: 'sat', label: 'Saturation at a given PO₂ (normal blood, 37 °C, pH 7.4)', fields: [{ k: 'po2', label: 'PO₂', def: '40', units: mmHg, gt: 0 }],
      tip: 'This uses the standard curve (Severinghaus equation) for normal blood, the same as the picture above. A shifted curve (more CO₂ or acid, higher temperature) gives lower saturation at the same PO₂.',
      solve: ({ po2 }) => { const s = satStandard(po2); return { ans: `Haemoglobin is about ${sg(s * 100)} % saturated.`, work: ['Read from the standard S-shaped curve for normal blood:', `S = 1 ÷ (23400 ÷ (PO₂³ + 150 PO₂) + 1), PO₂ = ${sg(po2)} mmHg`, `S = ${sg(s)} = ${sg(s * 100)} %`] }; } },
    { id: 'unload', label: 'Oxygen unloaded to the tissues', fields: [hbF, satF('sa', 'Saturation leaving the lungs (arterial)', '97'), satF('sv', 'Saturation returning (venous)', '75')],
      tip: 'The oxygen given up is the DIFFERENCE between the two saturations. The percentage is a share of what was carried, not of 100.',
      solve: ({ hb, sa, sv }) => {
        if (sv > sa) return { err: 'The blood coming back cannot hold more oxygen than the blood that left the lungs. Swap the two saturations.' };
        const d = sa - sv, ml = 1.34 * hb * (d / 100);
        return { ans: `Each 100 mL of blood gives up ${sg(ml)} mL of oxygen, which is ${sg((d / sa) * 100)} % of the oxygen it carried.`, work: [`Saturation drop = ${sg(sa)} − ${sg(sv)} = ${sg(d)} %`, `O₂ unloaded = 1.34 × ${sg(hb)} × ${sg(d / 100)} = ${sg(ml)} mL per 100 mL`, `Share unloaded = ${sg(d)} ÷ ${sg(sa)} × 100 = ${sg((d / sa) * 100)} %`] };
      } },
    { id: 'deliv', label: 'Oxygen delivered per minute: cardiac output × content', fields: [
      { k: 'co', label: 'Cardiac output', def: '5', units: [['L/min', 1], ['mL/min', 0.001]], gt: 0 }, hbF, satF('sat', 'Saturation of the arterial blood', '97.5'), { k: 'po2', label: 'PO₂ of the arterial blood', def: '100', units: mmHg, min: 0 }],
      tip: 'Content is per 100 mL (1 dL). A litre is 10 dL, so multiply content by 10 to get mL per litre.',
      solve: ({ co, hb, sat, po2 }) => { const c = 1.34 * hb * (sat / 100) + 0.003 * po2, d = co * c * 10; return { ans: `About ${sg(d)} mL of oxygen is delivered each minute.`, work: [`Content = 1.34 × ${sg(hb)} × ${sg(sat / 100)} + 0.003 × ${sg(po2)} = ${sg(c)} mL per 100 mL`, `Delivery = cardiac output × content × 10 = ${sg(co)} L/min × ${sg(c)} × 10`, `Delivery = ${sg(d)} mL/min`] }; } },
    { id: 'po2', label: 'Pressure from percentage: PO₂ = % of the gas × total pressure', fields: [
      { k: 'pct', label: 'Share of oxygen in the gas', def: '21', units: [['%', 1]], gt: 0, max: 100 }, { k: 'P', label: 'Total pressure', def: '101.3', units: [['kPa', 1], ['mmHg', 1 / 7.50062], ['atm', 101.325]], gt: 0 }],
      tip: 'Partial pressure is the gas\'s share of the total pressure. Air has about 21 % oxygen; on a mountain the share is the same but the total pressure is lower, so PO₂ falls.',
      solve: ({ pct, P }) => { const p = (pct / 100) * P; return { ans: `PO₂ is ${sg(p)} kPa (${sg(p * 7.50062)} mmHg).`, work: ['PO₂ = fraction of oxygen × total pressure', `PO₂ = ${sg(pct / 100)} × ${sg(P, 4)} kPa = ${sg(p)} kPa`, `1 kPa = 7.50 mmHg, so PO₂ = ${sg(p * 7.50062)} mmHg`] }; } },
  ],
  presets: [
    { label: 'Arterial blood', prob: 'content', v: { hb: '15', sat: '97.5', po2: '100' } },
    { label: 'Resting tissues', prob: 'sat', v: { po2: '40' } },
    { label: 'Oxygen unloaded', prob: 'unload', v: { hb: '15', sa: '97', sv: '75' } },
    { label: 'Oxygen delivery', prob: 'deliv', v: { co: '5', hb: '15', sat: '97.5', po2: '100' } },
    { label: 'Air at sea level', prob: 'po2', v: { pct: '21', P: '101.3' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Photosynthesis practicals
export const PHOTO: SolverSet = {
  probs: [
    { id: 'bub', label: 'Rate from counting bubbles: rate = bubbles / time', fields: [
      { k: 'n', label: 'Bubbles counted', def: '24', gt: 0 }, { k: 't', label: 'Time taken', def: '2', units: U.min, gt: 0 }],
      tip: 'Say the rate per minute: 24 bubbles in 2 minutes is 12 per minute, not 24. Repeat the count and take the mean.',
      solve: ({ n, t }) => ({ ans: `The rate is ${sg(n / t)} bubbles per minute.`, work: ['rate = number of bubbles / time', `rate = ${sg(n)} ÷ ${sg(t)} min`, `rate = ${sg(n / t)} bubbles per minute`] }) },
    { id: 'vol', label: 'Rate from gas collected: rate = volume / time', fields: [
      { k: 'v', label: 'Volume of oxygen collected', def: '0.6', units: U.mL, gt: 0 }, { k: 't', label: 'Time taken', def: '10', units: U.min, gt: 0 }],
      tip: 'Keep the same units for every reading so rates can be compared. mL per minute and mL per hour differ by 60 times.',
      solve: ({ v, t }) => ({ ans: `The rate is ${sg(v / t)} mL per minute (${sg((v / t) * 60)} mL per hour).`, work: ['rate = volume / time', `rate = ${sg(v)} mL ÷ ${sg(t)} min`, `rate = ${sg(v / t)} mL/min = ${sg((v / t) * 60)} mL/h`] }) },
    { id: 'light', label: 'Light at a different distance (inverse square law)', fields: [
      { k: 'd1', label: 'First distance of the lamp', def: '10', units: [['cm', 1], ['m', 100]], gt: 0 }, { k: 'd2', label: 'New distance of the lamp', def: '20', units: [['cm', 1], ['m', 100]], gt: 0 }],
      tip: 'Light intensity is proportional to 1 / distance². Double the distance and the light is a quarter, not a half.',
      solve: ({ d1, d2 }) => { const r = (d1 / d2) ** 2; return { ans: `The light is ${sg(r)} times as bright (${sg(r * 100)} % of the first). ${r < 1 ? 'It is dimmer.' : r > 1 ? 'It is brighter.' : 'It is the same.'}`, work: ['I ∝ 1 / d², so I₂ / I₁ = (d₁ / d₂)²', `I₂ / I₁ = (${sg(d1)} ÷ ${sg(d2)})² = ${sg(r)}`] }; } },
    { id: 'q10', label: 'Temperature coefficient: Q₁₀', fields: [
      { k: 'r1', label: 'Rate at the lower temperature', def: '12', gt: 0 }, { k: 'r2', label: 'Rate at the higher temperature', def: '24', gt: 0 },
      { k: 't1', label: 'Lower temperature', def: '20', units: [['°C', 1]] }, { k: 't2', label: 'Higher temperature', def: '30', units: [['°C', 1]] }],
      tip: 'Q₁₀ tells you how many times faster the rate gets for a 10 °C rise. A value near 2 is typical of enzyme-controlled steps. Above the optimum temperature the rate falls and Q₁₀ is no use.',
      solve: ({ r1, r2, t1, t2 }) => {
        if (t2 === t1) return { err: 'The two temperatures must be different.' };
        const q = (r2 / r1) ** (10 / (t2 - t1));
        return { ans: `Q₁₀ is ${sg(q)}.`, work: ['Q₁₀ = (R₂ / R₁)^(10 / (T₂ − T₁))', `Q₁₀ = (${sg(r2)} ÷ ${sg(r1)})^(10 ÷ ${sg(t2 - t1)})`, `Q₁₀ = ${sg(q)}`] };
      } },
    { id: 'gross', label: 'Net and gross photosynthesis: gross = net + respiration', fields: [
      { k: 'net', label: 'Net rate (oxygen given out)', def: '8', min: 0 }, { k: 'resp', label: 'Respiration rate (oxygen used)', def: '2', min: 0 }],
      tip: 'The plant also respires and uses up some of the oxygen it makes. What you collect is the NET rate. Add respiration back to get the gross rate. At the compensation point, net is zero.',
      solve: ({ net, resp }) => ({ ans: `The gross rate of photosynthesis is ${sg(net + resp)}, in the same units as you typed.`, work: ['gross = net + respiration', `gross = ${sg(net)} + ${sg(resp)} = ${sg(net + resp)}`, net === 0 ? 'Net = 0: this is the compensation point (photosynthesis equals respiration).' : 'Use the same units (for example bubbles per minute) for all three.'] }) },
    { id: 'pct', label: 'Percentage change in rate', fields: [
      { k: 'a', label: 'Rate before', def: '12', gt: 0 }, { k: 'b', label: 'Rate after', def: '30', min: 0 }],
      tip: 'Divide by the rate BEFORE the change. From 12 to 30 is +150 %; the rate went up by 2.5 times.',
      solve: ({ a, b }) => { const p = ((b - a) / a) * 100; return { ans: `${p >= 0 ? 'An increase' : 'A decrease'} of ${sg(Math.abs(p))} %.`, work: ['% change = (after − before) / before × 100', `% change = (${sg(b)} − ${sg(a)}) ÷ ${sg(a)} × 100 = ${sg(p)} %`] }; } },
  ],
  presets: [
    { label: 'Pondweed bubbles', prob: 'bub', v: { n: '24', t: '2' } },
    { label: 'Gas syringe', prob: 'vol', v: { v: '0.6', t: '10' } },
    { label: 'Lamp moved away', prob: 'light', v: { d1: '10', d2: '20' } },
    { label: 'Warmer water', prob: 'q10', v: { r1: '12', r2: '24', t1: '20', t2: '30' } },
    { label: 'Gross rate', prob: 'gross', v: { net: '8', resp: '2' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Transpiration practicals (potometer, leaf area, stomatal density)
export const TRANSP: SolverSet = {
  probs: [
    { id: 'pot', label: 'Potometer: rate of water uptake from the bubble', fields: [
      { k: 'r', label: 'Radius of the capillary tube', def: '0.5', units: [['mm', 1], ['cm', 10]], gt: 0, hint: 'if you are given the diameter, halve it' }, { k: 'd', label: 'Distance the bubble moved', def: '30', units: U.mm, gt: 0 }, { k: 't', label: 'Time taken', def: '5', units: U.min, gt: 0 }],
      tip: 'The water that moved is a thin cylinder: volume = π r² × distance. 1 mm³ is 1 µL. Use the RADIUS, not the diameter.',
      solve: ({ r, d, t }) => { const V = PI * r * r * d, rt = V / t; return { ans: `Water is taken up at ${sg(rt)} mm³ per minute (${sg((rt * 60) / 1000)} mL per hour).`, work: ['Volume = π r² × distance', `V = π × ${sg(r)}² × ${sg(d)} = ${sg(V)} mm³`, 'rate = volume / time', `rate = ${sg(V)} ÷ ${sg(t)} min = ${sg(rt)} mm³/min`, `1 mm³ = 0.001 mL, so rate = ${sg((rt * 60) / 1000)} mL/h`] }; } },
    { id: 'leaf', label: 'Rate of water loss per unit leaf area', fields: [
      { k: 'v', label: 'Water lost or taken up', def: '2.4', units: [['mL', 1], ['mm³', 0.001]], gt: 0 }, { k: 'a', label: 'Leaf area', def: '120', units: [['cm²', 1], ['m²', 1e4]], gt: 0 }, { k: 't', label: 'Time', def: '3', units: U.hr, gt: 0 }],
      tip: 'Compare plants fairly by dividing by leaf area as well as time: a bigger shoot loses more water just because it has more leaf.',
      solve: ({ v, a, t }) => { const x = v / (a * t); return { ans: `The rate is ${sg(x)} mL per cm² per hour.`, work: ['rate = volume ÷ (area × time)', `rate = ${sg(v)} mL ÷ (${sg(a)} cm² × ${sg(t)} h)`, `rate = ${sg(x)} mL cm⁻² h⁻¹`] }; } },
    { id: 'stoma', label: 'Stomatal density from a microscope view', fields: [
      { k: 'n', label: 'Stomata counted in the view', def: '24', gt: 0 }, { k: 'dia', label: 'Diameter of the field of view', def: '0.5', units: [['mm', 1], ['µm', 0.001]], gt: 0 }],
      tip: 'The field of view is a circle: area = π × (diameter / 2)². Count the same area on several leaves and take the mean.',
      solve: ({ n, dia }) => { const A = PI * (dia / 2) ** 2, dn = n / A; return { ans: `There are about ${sg(dn)} stomata per mm².`, work: ['Area of view = π (d / 2)²', `A = π × (${sg(dia)} ÷ 2)² = ${sg(A)} mm²`, `density = ${sg(n)} ÷ ${sg(A)} = ${sg(dn)} per mm²`] }; } },
    { id: 'pct', label: 'Percentage change (rate or mass)', fields: [
      { k: 'a', label: 'Value before (still air, control...)', def: '5', gt: 0 }, { k: 'b', label: 'Value after (fan, heat...)', def: '8', min: 0 }],
      tip: 'Divide the change by the value BEFORE. A fan that raises the rate from 5 to 8 gives +60 %.',
      solve: ({ a, b }) => { const p = ((b - a) / a) * 100; return { ans: `${p >= 0 ? 'An increase' : 'A decrease'} of ${sg(Math.abs(p))} %.`, work: ['% change = (after − before) / before × 100', `% change = (${sg(b)} − ${sg(a)}) ÷ ${sg(a)} × 100 = ${sg(p)} %`] }; } },
    { id: 'bub', label: 'Bubble distance for a given water uptake', fields: [
      { k: 'v', label: 'Volume of water taken up', def: '20', units: [['mm³', 1], ['µL', 1], ['mL', 1000]], gt: 0 }, { k: 'r', label: 'Radius of the capillary tube', def: '0.5', units: [['mm', 1]], gt: 0 }],
      tip: 'Work backwards from V = π r² × distance. A thinner tube makes the bubble move further for the same water, which is why potometers use fine tubes.',
      solve: ({ v, r }) => { const d = v / (PI * r * r); return { ans: `The bubble moves ${sg(d)} mm.`, work: ['distance = V / (π r²)', `distance = ${sg(v)} ÷ (π × ${sg(r)}²)`, `distance = ${sg(d)} mm`] }; } },
  ],
  presets: [
    { label: 'Potometer', prob: 'pot', v: { r: '0.5', d: '30', t: '5' } },
    { label: 'Per cm² of leaf', prob: 'leaf', v: { v: '2.4', a: '120', t: '3' } },
    { label: 'Stomata count', prob: 'stoma', v: { n: '24', dia: '0.5' } },
    { label: 'Fan on', prob: 'pct', v: { a: '5', b: '8' } },
    { label: 'Bubble distance', prob: 'bub', v: { v: '20', r: '0.5' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Genes in populations (natural selection)
const fq = (k: string, label: string, def: string): Field => ({ k, label, def, units: U.frac, min: 0, max: 1 });
export const SELECT: SolverSet = {
  probs: [
    { id: 'cnt', label: 'Allele frequency from counting genotypes', fields: [
      { k: 'AA', label: 'Number of AA (two dominant alleles)', def: '30', min: 0 }, { k: 'Aa', label: 'Number of Aa', def: '50', min: 0 }, { k: 'aa', label: 'Number of aa (two recessive alleles)', def: '20', min: 0 }],
      tip: 'Every person or moth has TWO alleles, so count 2 per AA, 1 for each A in Aa, and divide by 2 × the number of individuals.',
      solve: ({ AA, Aa, aa }) => {
        const N = AA + Aa + aa; if (N <= 0) return { err: 'Enter at least one individual.' };
        const p = (2 * AA + Aa) / (2 * N);
        return { ans: `The frequency of A is p = ${sg(p)} and of a is q = ${sg(1 - p)}.`, work: [`Individuals N = ${sg(AA)} + ${sg(Aa)} + ${sg(aa)} = ${sg(N)}; alleles = 2N = ${sg(2 * N)}`, `p = (2 × ${sg(AA)} + ${sg(Aa)}) ÷ ${sg(2 * N)} = ${sg(p)}`, `q = 1 − p = ${sg(1 - p)}`] };
      } },
    { id: 'hwq', label: 'Hardy–Weinberg from the recessive group (q²)', fields: [fq('q2', 'Frequency of the recessive phenotype (aa), q²', '0.04')],
      tip: 'Only the recessive phenotype shows its genotype, so q² is the one frequency you can read straight from the population. Take the square root for q, never half of it.',
      solve: ({ q2 }) => { const q = Math.sqrt(q2), p = 1 - q; return { ans: `q = ${sg(q)}, p = ${sg(p)}; carriers (Aa) make up ${pc(2 * p * q)} of the population.`, work: [`q² = ${sg(q2)}, so q = √${sg(q2)} = ${sg(q)}`, `p = 1 − q = ${sg(p)}`, `AA = p² = ${sg(p * p)}, Aa = 2pq = ${sg(2 * p * q)}, aa = q² = ${sg(q2)}`, `Check: ${sg(p * p)} + ${sg(2 * p * q)} + ${sg(q2)} = ${sg(p * p + 2 * p * q + q2)}`] }; } },
    { id: 'hwp', label: 'Hardy–Weinberg from an allele frequency (p)', fields: [fq('p', 'Frequency of the dominant allele A, p', '0.7')],
      tip: 'p + q = 1 for alleles, and p² + 2pq + q² = 1 for genotypes. The heterozygotes 2pq have the factor 2 because Aa can form two ways.',
      solve: ({ p }) => { const q = 1 - p; return { ans: `q = ${sg(q)}; AA ${pc(p * p)}, Aa ${pc(2 * p * q)}, aa ${pc(q * q)}.`, work: [`q = 1 − p = ${sg(q)}`, `AA = p² = ${sg(p)}² = ${sg(p * p)}`, `Aa = 2pq = 2 × ${sg(p)} × ${sg(q)} = ${sg(2 * p * q)}`, `aa = q² = ${sg(q)}² = ${sg(q * q)}`] }; } },
    { id: 'car', label: 'How many carriers in a population?', fields: [fq('q2', 'Frequency of the recessive phenotype (aa), q²', '0.0004'), { k: 'N', label: 'Population size', def: '10000', gt: 0 }],
      tip: 'Carriers are the Aa people (2pq), not the aa people. Many more carry a rare recessive allele than show it.',
      solve: ({ q2, N }) => { const q = Math.sqrt(q2), p = 1 - q, c = 2 * p * q * N; return { ans: `About ${sg(c, 3)} carriers (${sg(q2 * N)} with the trait).`, work: [`q = √${q2} = ${sg(q)}, p = ${sg(p)}`, `Carrier frequency 2pq = 2 × ${sg(p)} × ${sg(q)} = ${sg(2 * p * q)}`, `Carriers = ${sg(2 * p * q)} × ${sg(N)} = ${sg(c)}`] }; } },
    { id: 'sel', label: 'One generation of selection against the recessive', fields: [fq('q', 'Frequency of the recessive allele now, q', '0.5'), fq('s', 'Selection coefficient s (how much aa loses)', '0.2')],
      tip: 'If aa has fitness 1 − s, only the aa group loses out. The recessive allele hides in Aa, so selection against it is slow once it is rare.',
      solve: ({ q, s }) => {
        const w = 1 - s * q * q; if (w <= 0) return { err: 'Everyone would die out with those numbers. Lower s.' };
        const q1 = (q - s * q * q) / w;
        return { ans: `After one generation q falls from ${sg(q)} to ${sg(q1)} (a change of ${sg(q1 - q)}).`, work: ['Fitness: AA = 1, Aa = 1, aa = 1 − s', `Mean fitness w̄ = 1 − s q² = 1 − ${sg(s)} × ${sg(q)}² = ${sg(w)}`, `q′ = (q − s q²) ÷ w̄ = (${sg(q)} − ${sg(s * q * q)}) ÷ ${sg(w)} = ${sg(q1)}`] };
      } },
    { id: 'fit', label: 'Relative fitness and selection coefficient', fields: [
      { k: 'o', label: 'Average offspring of this type', def: '8', min: 0 }, { k: 'best', label: 'Average offspring of the fittest type', def: '10', gt: 0 }],
      tip: 'Relative fitness compares each type with the BEST type, which is set to 1. Then s = 1 − w.',
      solve: ({ o, best }) => { const w = o / best; return { ans: `Relative fitness w = ${sg(w)}, so s = ${sg(1 - w)}.`, work: ['w = offspring of this type ÷ offspring of the fittest type', `w = ${sg(o)} ÷ ${sg(best)} = ${sg(w)}`, `s = 1 − w = ${sg(1 - w)}`] }; } },
  ],
  presets: [
    { label: 'Count the alleles', prob: 'cnt', v: { AA: '30', Aa: '50', aa: '20' } },
    { label: '4 % show the trait', prob: 'hwq', v: { q2: '0.04' } },
    { label: 'p = 0.7', prob: 'hwp', v: { p: '0.7' } },
    { label: 'Rare trait, carriers', prob: 'car', v: { q2: '0.0004', N: '10000' } },
    { label: 'Selection', prob: 'sel', v: { q: '0.5', s: '0.2' } },
  ],
};
