// "Solve my numbers" sets for eight Class 11-12 physics Learn tools (travelling-wave, shm-circle, stress-strain-test,
// capillary-rise, stokes-terminal-velocity, carnot-engine, kinetic-theory, heating-curve). Plain TypeScript, no DOM.
// Same shape as phys-a.ts / phys-b.ts: each problem gets the typed numbers already converted to base units by
// phys-a-ui.ts and returns the answer sentence and the working an exam would mark. Hand-checked in tests/tools/<id>.mjs.
import { sg as sgBase, G, type Field, type SolverSet, type Unit } from './phys-a';

/** phys-a's sg shows anything under 1e-12 as 0; molecule energies (about 6 × 10^-21 J) need to show. */
function sg(x: number, n = 3): string {
  if (Number.isFinite(x) && x !== 0 && Math.abs(x) < 1e-12) { const [m, e] = Math.abs(x).toExponential(n - 1).split('e'); return `${x < 0 ? '−' : ''}${m} × 10^${Number(e)}`; }
  return sgBase(x, n);
}
const sgn = (x: number) => (x < 0 ? `(${sg(x)})` : sg(x));
const PI = Math.PI;
/** sin or cos of a clean angle can come out as 1e-17 instead of 0. */
const clean = (x: number) => (Math.abs(x) < 1e-12 ? 0 : x);
/** Lengths: cm below 1 m, mm below 1 cm. */
const cmOrM = (m: number) => (Math.abs(m) >= 1 ? `${sg(m)} m` : `${sg(m * 100)} cm`);
const mmOrM = (m: number) => (Math.abs(m) >= 1 ? `${sg(m)} m` : Math.abs(m) >= 0.01 ? `${sg(m * 100)} cm` : `${sg(m * 1000)} mm`);
const hz = (f: number) => (f >= 1e9 ? `${sg(f / 1e9)} GHz` : f >= 1e6 ? `${sg(f / 1e6)} MHz` : f >= 1e3 ? `${sg(f / 1e3)} kHz` : `${sg(f)} Hz`);
const en = (j: number) => { const a = Math.abs(j); return a >= 1e6 ? `${sg(j / 1e6)} MJ` : a >= 1e3 ? `${sg(j / 1e3)} kJ` : `${sg(j)} J`; };
const dur = (s: number) => (s >= 7200 ? `${sg(s / 3600)} hours` : s >= 120 ? `${sg(s / 60)} minutes` : `${sg(s)} s`);
const pa = (p: number) => { const a = Math.abs(p); return a >= 1e9 ? `${sg(p / 1e9)} GPa` : a >= 1e6 ? `${sg(p / 1e6)} MPa` : a >= 1e3 ? `${sg(p / 1e3)} kPa` : `${sg(p)} Pa`; };
const speedS = (v: number) => { const a = Math.abs(v); return a >= 1 ? `${sg(v)} m/s` : a >= 0.01 ? `${sg(v * 100)} cm/s` : `${sg(v * 1000)} mm/s`; };

const U = {
  len: [['m', 1], ['cm', 0.01], ['mm', 0.001], ['km', 1000]] as Unit[],
  lenCm: [['cm', 0.01], ['mm', 0.001], ['m', 1]] as Unit[],
  lenMm: [['mm', 0.001], ['cm', 0.01], ['m', 1]] as Unit[],
  mass: [['kg', 1], ['g', 0.001]] as Unit[],
  force: [['N', 1], ['kN', 1000]] as Unit[],
  speed: [['m/s', 1], ['cm/s', 0.01], ['km/h', 1 / 3.6]] as Unit[],
  time: [['s', 1], ['ms', 0.001], ['min', 60]] as Unit[],
  hz: [['Hz', 1], ['kHz', 1e3], ['MHz', 1e6], ['GHz', 1e9]] as Unit[],
  deg: [['°', 1], ['rad', 180 / PI]] as Unit[],
  energy: [['J', 1], ['kJ', 1e3], ['MJ', 1e6]] as Unit[],
  dens: [['kg/m³', 1], ['g/cm³', 1000]] as Unit[],
  press: [['Pa', 1], ['kPa', 1e3], ['atm', 101325]] as Unit[],
  stressU: [['GPa', 1e9], ['MPa', 1e6], ['Pa', 1]] as Unit[],
  eta: [['Pa·s', 1], ['mPa·s', 0.001], ['poise', 0.1]] as Unit[],
  molar: [['g/mol', 0.001], ['kg/mol', 1]] as Unit[],
  cap: [['J/(kg·K)', 1], ['kJ/(kg·K)', 1000], ['cal/(g·°C)', 4186.8]] as Unit[],
  lat: [['J/kg', 1], ['kJ/kg', 1000], ['cal/g', 4186.8]] as Unit[],
};
const gField: Field = { k: 'g', label: 'g (gravity)', def: '9.8', units: [['m/s²', 1]], gt: 0 };

// ---------------------------------------------------------------------------------------------------------
// Travelling wave
const dirF: Field = { k: 'd', label: 'Direction of travel', def: '0', sel: ['To the right: y = A sin(kx − ωt)', 'To the left: y = A sin(kx + ωt)'] };
const ampF = (def = '5'): Field => ({ k: 'A', label: 'Amplitude A', def, units: [['cm', 0.01], ['mm', 0.001], ['m', 1]], gt: 0 });
export const WAVE: SolverSet = {
  probs: [
    { id: 'v', label: 'Wave speed: v = f λ', fields: [{ k: 'f', label: 'Frequency f', def: '256', units: U.hz, gt: 0 }, { k: 'l', label: 'Wavelength λ', def: '1.3', units: U.len, gt: 0 }],
      tip: 'Use the wavelength in metres (cm ÷ 100) and the frequency in hertz. The speed of a wave depends on the medium, so if the frequency doubles the wavelength halves.',
      solve: ({ f, l }) => ({ ans: `The wave speed is ${sg(f * l)} m/s.`, work: ['v = f λ', `v = ${sg(f)} Hz × ${sg(l)} m`, `v = ${sg(f * l)} m/s`] }) },
    { id: 'vT', label: 'Wave speed from the period: v = λ / T', fields: [{ k: 'l', label: 'Wavelength λ', def: '2', units: U.len, gt: 0 }, { k: 'T', label: 'Period T', def: '0.5', units: U.time, gt: 0 }],
      tip: 'T is the time for one full wave to pass a point, not the time for the whole wave train. Frequency is f = 1 ÷ T.',
      solve: ({ l, T }) => ({ ans: `The wave speed is ${sg(l / T)} m/s (frequency ${hz(1 / T)}).`, work: ['v = λ / T', `v = ${sg(l)} m ÷ ${sg(T)} s`, `v = ${sg(l / T)} m/s`, `f = 1 ÷ T = ${sg(1 / T)} Hz`] }) },
    { id: 'l', label: 'Wavelength: λ = v / f', fields: [{ k: 'v', label: 'Wave speed v', def: '340', units: U.speed, gt: 0 }, { k: 'f', label: 'Frequency f', def: '512', units: U.hz, gt: 0 }],
      tip: 'Sound in air travels at about 340 m/s, light at 3 × 10⁸ m/s. Make sure the speed is in m/s before you divide.',
      solve: ({ v, f }) => ({ ans: `The wavelength is ${mmOrM(v / f)}.`, work: ['λ = v / f', `λ = ${sg(v)} m/s ÷ ${sg(f)} Hz`, `λ = ${sg(v / f)} m = ${sg((v / f) * 100)} cm`] }) },
    { id: 'f', label: 'Frequency and period: f = v / λ', fields: [{ k: 'v', label: 'Wave speed v', def: '3e8', units: U.speed, gt: 0 }, { k: 'l', label: 'Wavelength λ', def: '3', units: U.len, gt: 0 }],
      tip: 'A short wavelength means a high frequency for the same speed. Radio waves travel at the speed of light, 3 × 10⁸ m/s.',
      solve: ({ v, l }) => ({ ans: `The frequency is ${hz(v / l)} and the period is ${sg(l / v)} s.`, work: ['f = v / λ', `f = ${sg(v)} m/s ÷ ${sg(l)} m = ${sg(v / l)} Hz`, `T = 1 / f = ${sg(l / v)} s`] }) },
    { id: 'eq', label: 'Write the wave equation y = A sin(kx ∓ ωt)', fields: [ampF(), { k: 'l', label: 'Wavelength λ', def: '2', units: U.len, gt: 0 }, { k: 'T', label: 'Period T', def: '1', units: U.time, gt: 0 }, dirF],
      tip: 'k = 2π ÷ λ (not 1 ÷ λ) and ω = 2π ÷ T. Put A in metres if x is in metres. A wave moving to the right has a minus sign between kx and ωt.',
      solve: ({ A, l, T, d }) => {
        const k = (2 * PI) / l, w = (2 * PI) / T, right = d === 0;
        return { ans: `y = ${sg(A)} sin(${sg(k)} x ${right ? '−' : '+'} ${sg(w)} t) with y, x in metres and t in seconds; the wave speed is ${sg(w / k)} m/s.`,
          work: ['k = 2π / λ', `k = 2π ÷ ${sg(l)} m = ${sg(k)} rad/m`, 'ω = 2π / T', `ω = 2π ÷ ${sg(T)} s = ${sg(w)} rad/s`, `v = ω / k = ${sg(w)} ÷ ${sg(k)} = ${sg(w / k)} m/s`, `f = 1 / T = ${sg(1 / T)} Hz`, `The wave moves ${right ? 'in the +x direction (kx − ωt)' : 'in the −x direction (kx + ωt)'}.`] };
      } },
    { id: 'yp', label: 'One particle: its displacement and velocity at x and t', fields: [ampF(), { k: 'l', label: 'Wavelength λ', def: '2', units: U.len, gt: 0 }, { k: 'T', label: 'Period T', def: '1', units: U.time, gt: 0 },
      { k: 'x', label: 'Position x', def: '0.5', units: [['m', 1], ['cm', 0.01]] }, { k: 't', label: 'Time t', def: '0.25', units: [['s', 1], ['ms', 0.001]] }, dirF],
      tip: 'Put your calculator in radian mode: the phase kx − ωt is in radians. The particle moves up and down only; the wave speed v = ω/k is a different thing from the particle velocity.',
      solve: ({ A, l, T, x, t, d }) => {
        const k = (2 * PI) / l, w = (2 * PI) / T, s = d === 0 ? -1 : 1, ph = k * x + s * w * t, y = A * clean(Math.sin(ph)), vp = s * A * w * clean(Math.cos(ph));
        const dirTxt = vp === 0 ? 'momentarily at rest' : vp > 0 ? `moving up at ${sg(Math.abs(vp) * 100)} cm/s` : `moving down at ${sg(Math.abs(vp) * 100)} cm/s`;
        return { ans: `At x = ${sg(x)} m and t = ${sg(t)} s the particle is at y = ${sg(y * 100)} cm, ${dirTxt}.`,
          work: ['k = 2π/λ, ω = 2π/T', `k = ${sg(k)} rad/m, ω = ${sg(w)} rad/s`, `phase = kx ${s < 0 ? '−' : '+'} ωt = ${sg(k)} × ${sgn(x)} ${s < 0 ? '−' : '+'} ${sg(w)} × ${sg(t)} = ${sg(ph)} rad`,
            `y = A sin(phase) = ${sg(A)} × sin(${sg(ph)}) = ${sg(y)} m = ${sg(y * 100)} cm`, `v_particle = ∂y/∂t = ${s < 0 ? '−' : '+'}A ω cos(phase) = ${sg(vp)} m/s`, `Largest particle speed = A ω = ${sg(A * w)} m/s`] };
      } },
    { id: 'beat', label: 'Beats between two tones', fields: [{ k: 'a', label: 'First frequency', def: '440', units: U.hz, gt: 0 }, { k: 'b', label: 'Second frequency', def: '444', units: U.hz, gt: 0 }],
      tip: 'The beat frequency is the difference of the two frequencies, not the sum or the average (the average is the pitch you hear).',
      solve: ({ a, b }) => {
        const fb = Math.abs(a - b);
        if (fb < 1e-12) return { ans: 'No beats: the two frequencies are the same, so the sound is steady.', work: ['f_beat = |f₁ − f₂| = 0 Hz'] };
        return { ans: `You hear ${sg(fb)} beats per second (one every ${sg(1 / fb)} s) on a tone of ${sg((a + b) / 2)} Hz.`, work: ['f_beat = |f₁ − f₂|', `f_beat = |${sg(a)} − ${sg(b)}| = ${sg(fb)} Hz`, `Beat period = 1 ÷ ${sg(fb)} = ${sg(1 / fb)} s`, `Pitch heard = (f₁ + f₂) ÷ 2 = ${sg((a + b) / 2)} Hz`] };
      } },
    { id: 'stand', label: 'Standing wave on a string fixed at both ends', fields: [{ k: 'L', label: 'String length L', def: '0.65', units: U.len, gt: 0 }, { k: 'v', label: 'Wave speed v', def: '260', units: U.speed, gt: 0 }, { k: 'n', label: 'Harmonic n (1 = fundamental)', def: '3', gt: 0 }],
      tip: 'The string holds a whole number of half-wavelengths: L = n λ/2. The ends are always nodes, so n loops have n + 1 nodes counting the two ends.',
      solve: ({ L, v, n }) => {
        if (!Number.isInteger(n)) return { err: 'The harmonic number n must be a whole number: 1, 2, 3 ...' };
        const l = (2 * L) / n, f = (n * v) / (2 * L);
        return { ans: `Harmonic ${n} has frequency ${hz(f)} and wavelength ${mmOrM(l)}, with ${n + 1} nodes (ends included) and ${n} antinodes.`,
          work: ['L = n λ / 2, so λ = 2L / n', `λ = 2 × ${sg(L)} ÷ ${sg(n)} = ${sg(l)} m`, 'f = v / λ = n v / (2L)', `f = ${sg(f)} Hz`, `Fundamental f₁ = v / (2L) = ${sg(v / (2 * L))} Hz`] };
      } },
    { id: 'string', label: 'Stretched string: v = √(tension / μ) and its notes', fields: [{ k: 'F', label: 'Tension F', def: '80', units: U.force, gt: 0 }, { k: 'mu', label: 'Mass per metre μ', def: '0.5', units: [['g/m', 0.001], ['kg/m', 1]], gt: 0 },
      { k: 'L', label: 'String length L', def: '0.5', units: U.len, gt: 0 }, { k: 'n', label: 'Harmonic n (1 = fundamental)', def: '1', gt: 0 }],
      tip: 'μ must be in kg per metre: 0.5 g/m is 0.0005 kg/m. A tighter or lighter string gives a faster wave and a higher note.',
      solve: ({ F, mu, L, n }) => {
        if (!Number.isInteger(n)) return { err: 'The harmonic number n must be a whole number: 1, 2, 3 ...' };
        const v = Math.sqrt(F / mu), f1 = v / (2 * L);
        return { ans: `The wave speed on the string is ${sg(v)} m/s and harmonic ${n} is ${hz(n * f1)}.`, work: ['v = √(F / μ)', `v = √(${sg(F)} N ÷ ${sg(mu)} kg/m) = ${sg(v)} m/s`, 'f₁ = v / (2L)', `f₁ = ${sg(v)} ÷ (2 × ${sg(L)}) = ${sg(f1)} Hz`, `f${n} = ${sg(n)} × f₁ = ${sg(n * f1)} Hz`] };
      } },
  ],
  presets: [
    { label: 'Sound in a hall', prob: 'v', v: { f: '256', l: '1.3' } },
    { label: 'Wave equation', prob: 'eq', v: { A: '5', l: '2', T: '1', d: '0' }, u: { A: 'cm' } },
    { label: 'Particle on the wave', prob: 'yp', v: { A: '5', l: '2', T: '1', x: '0.5', t: '0.25', d: '0' }, u: { A: 'cm' } },
    { label: 'Beats on a guitar', prob: 'beat', v: { a: '440', b: '444' } },
    { label: 'Guitar string', prob: 'string', v: { F: '80', mu: '0.5', L: '0.5', n: '1' }, u: { mu: 'g/m' } },
    { label: 'Third harmonic', prob: 'stand', v: { L: '0.65', v: '260', n: '3' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Simple harmonic motion
const aF = (def = '10'): Field => ({ k: 'A', label: 'Amplitude A', def, units: [['cm', 0.01], ['mm', 0.001], ['m', 1]], gt: 0 });
const TF = (def = '2', label = 'Period T'): Field => ({ k: 'T', label: label, def, units: [['s', 1], ['ms', 0.001]], gt: 0 });
export const SHM: SolverSet = {
  probs: [
    { id: 'w', label: 'From the period: f and ω', fields: [TF('2')],
      tip: 'f = 1 ÷ T and ω = 2π ÷ T = 2πf. ω is in radians per second, not hertz: ω is 2π times bigger than f.',
      solve: ({ T }) => ({ ans: `The frequency is ${sg(1 / T)} Hz and ω = ${sg((2 * PI) / T)} rad/s.`, work: ['f = 1 / T', `f = 1 ÷ ${sg(T)} s = ${sg(1 / T)} Hz`, 'ω = 2π / T = 2πf', `ω = 2π ÷ ${sg(T)} = ${sg((2 * PI) / T)} rad/s`] }) },
    { id: 'wf', label: 'From the frequency: T and ω', fields: [{ k: 'f', label: 'Frequency f', def: '50', units: U.hz, gt: 0 }],
      tip: 'ω = 2π f. If the frequency is in rpm, divide by 60 first to get hertz.',
      solve: ({ f }) => ({ ans: `The period is ${sg(1 / f)} s and ω = ${sg(2 * PI * f)} rad/s.`, work: ['T = 1 / f', `T = 1 ÷ ${sg(f)} Hz = ${sg(1 / f)} s`, 'ω = 2π f', `ω = 2π × ${sg(f)} = ${sg(2 * PI * f)} rad/s`] }) },
    { id: 'x', label: 'Position, velocity and acceleration at time t', fields: [aF(), TF('2'), { k: 'p', label: 'Starting phase φ', def: '0', units: U.deg }, { k: 't', label: 'Time t', def: '0.25', units: [['s', 1], ['ms', 0.001]], min: 0 }],
      tip: 'This uses x = A sin(ωt + φ). If your book writes x = A cos(ωt + φ), φ is 90° different. Use radian mode on the calculator, and remember a = −ω² x always points back to the centre.',
      solve: ({ A, T, p, t }) => {
        const w = (2 * PI) / T, ph = w * t + (p * PI) / 180, sn = clean(Math.sin(ph)), cs = clean(Math.cos(ph)), x = A * sn, v = A * w * cs, a = -w * w * x;
        return { ans: `At t = ${sg(t)} s: x = ${cmOrM(x)}, v = ${sg(v)} m/s and a = ${sg(a)} m/s².`,
          work: ['ω = 2π / T', `ω = 2π ÷ ${sg(T)} = ${sg(w)} rad/s`, `phase = ωt + φ = ${sg(w)} × ${sg(t)} + ${sg((p * PI) / 180)} = ${sg(ph)} rad`, `x = A sin(phase) = ${sg(A)} × ${sgn(sn)} = ${sg(x)} m`, `v = A ω cos(phase) = ${sg(A)} × ${sg(w)} × ${sgn(cs)} = ${sg(v)} m/s`, `a = −ω² x = −(${sg(w)})² × ${sgn(x)} = ${sg(a)} m/s²`] };
      } },
    { id: 'vx', label: 'Speed and acceleration at a displacement x', fields: [aF(), TF('2'), { k: 'x', label: 'Displacement x', def: '6', units: [['cm', 0.01], ['mm', 0.001], ['m', 1]] }],
      tip: 'The displacement can never be bigger than the amplitude. Speed is largest at the centre (x = 0) and zero at the ends (x = ±A); the acceleration is the other way round.',
      solve: ({ A, T, x }) => {
        if (Math.abs(x) > A * (1 + 1e-12)) return { err: `The displacement (${cmOrM(Math.abs(x))}) cannot be more than the amplitude (${cmOrM(A)}).` };
        const w = (2 * PI) / T, v = w * Math.sqrt(Math.max(0, A * A - x * x)), a = w * w * x;
        return { ans: `At x = ${cmOrM(x)} the speed is ${sg(v)} m/s and the acceleration is ${sg(w * w * Math.abs(x))} m/s² towards the centre.`,
          work: ['ω = 2π / T', `ω = 2π ÷ ${sg(T)} = ${sg(w)} rad/s`, 'v = ω √(A² − x²)', `v = ${sg(w)} × √(${sg(A)}² − ${sg(x)}²) = ${sg(v)} m/s`, '|a| = ω² |x|', `|a| = (${sg(w)})² × ${sg(Math.abs(x))} = ${sg(Math.abs(a))} m/s²`] };
      } },
    { id: 'max', label: 'Largest speed and acceleration', fields: [aF('1'), TF('0.02')],
      tip: 'Largest speed is A ω (at the centre) and largest acceleration is A ω² (at the ends). A in metres, T in seconds.',
      solve: ({ A, T }) => {
        const w = (2 * PI) / T;
        return { ans: `The largest speed is ${sg(A * w)} m/s and the largest acceleration is ${sg(A * w * w)} m/s².`, work: ['ω = 2π / T', `ω = 2π ÷ ${sg(T)} = ${sg(w)} rad/s`, 'v_max = A ω', `v_max = ${sg(A)} × ${sg(w)} = ${sg(A * w)} m/s`, 'a_max = A ω²', `a_max = ${sg(A)} × (${sg(w)})² = ${sg(A * w * w)} m/s²`] };
      } },
    { id: 'spring', label: 'Spring: T = 2π√(m / k)', fields: [{ k: 'm', label: 'Mass m', def: '0.5', units: U.mass, gt: 0 }, { k: 'k', label: 'Spring constant k', def: '20', units: [['N/m', 1], ['N/cm', 100]], gt: 0 }],
      tip: 'k is in N per metre: a spring that stretches 5 cm under 2 N has k = 2 ÷ 0.05 = 40 N/m. The amplitude does not change the period.',
      solve: ({ m, k }) => { const T = 2 * PI * Math.sqrt(m / k); return { ans: `The period is ${sg(T)} s (frequency ${sg(1 / T)} Hz).`, work: ['T = 2π √(m / k)', `T = 2π × √(${sg(m)} kg ÷ ${sg(k)} N/m)`, `T = ${sg(T)} s`, `f = 1 / T = ${sg(1 / T)} Hz`] }; } },
    { id: 'k', label: 'Spring constant from the period: k = 4π² m / T²', fields: [{ k: 'm', label: 'Mass m', def: '0.2', units: U.mass, gt: 0 }, TF('0.8')],
      tip: 'Square the period, do not double it. Time for one swing, not for ten swings: divide a timed set of swings by the number of swings first.',
      solve: ({ m, T }) => { const k = (4 * PI * PI * m) / (T * T); return { ans: `The spring constant is ${sg(k)} N/m.`, work: ['k = 4π² m / T²', `k = 4π² × ${sg(m)} ÷ (${sg(T)})²`, `k = ${sg(k)} N/m`] }; } },
    { id: 'pend', label: 'Pendulum: T = 2π√(L / g)', fields: [{ k: 'L', label: 'Length L (to the middle of the bob)', def: '1', units: U.len, gt: 0 }, gField],
      tip: 'L is from the support to the centre of the bob. The mass of the bob does not matter, and the formula only works for small swings (under about 10°).',
      solve: ({ L, g }) => { const T = 2 * PI * Math.sqrt(L / g); return { ans: `The period is ${sg(T)} s (frequency ${sg(1 / T)} Hz).`, work: ['T = 2π √(L / g)', `T = 2π × √(${sg(L)} m ÷ ${sg(g)} m/s²)`, `T = ${sg(T)} s`] }; } },
    { id: 'Lp', label: 'Pendulum length for a wanted period', fields: [TF('2', 'Wanted period T'), gField],
      tip: 'A "seconds pendulum" ticks once every second, so its full period is 2 s. Its length is close to 1 m.',
      solve: ({ T, g }) => { const L = (g * T * T) / (4 * PI * PI); return { ans: `The pendulum must be ${sg(L)} m (${sg(L * 100)} cm) long.`, work: ['T = 2π √(L / g), so L = g T² / (4π²)', `L = ${sg(g)} × (${sg(T)})² ÷ (4π²)`, `L = ${sg(L)} m`] }; } },
    { id: 'g', label: 'Find g from a pendulum experiment', fields: [{ k: 'L', label: 'Length L (to the middle of the bob)', def: '0.9', units: U.len, gt: 0 }, TF('1.92', 'Time for one swing T')],
      tip: 'Time 20 swings and divide by 20 to get T. Measure L to the centre of the bob (string plus the bob\'s radius).',
      solve: ({ L, T }) => { const g = (4 * PI * PI * L) / (T * T); return { ans: `g = ${sg(g)} m/s².`, work: ['g = 4π² L / T²', `g = 4π² × ${sg(L)} ÷ (${sg(T)})²`, `g = ${sg(g)} m/s²`] }; } },
    { id: 'E', label: 'Energy in SHM (spring)', fields: [{ k: 'k', label: 'Spring constant k', def: '50', units: [['N/m', 1], ['N/cm', 100]], gt: 0 }, aF('10'), { k: 'x', label: 'Displacement x', def: '6', units: [['cm', 0.01], ['mm', 0.001], ['m', 1]] }],
      tip: 'Total energy ½kA² stays the same all the time; only the split between kinetic and potential changes. At the ends it is all potential, at the centre all kinetic.',
      solve: ({ k, A, x }) => {
        if (Math.abs(x) > A * (1 + 1e-12)) return { err: `The displacement (${cmOrM(Math.abs(x))}) cannot be more than the amplitude (${cmOrM(A)}).` };
        const E = 0.5 * k * A * A, pe = 0.5 * k * x * x, ke = E - pe;
        return { ans: `The total energy is ${sg(E)} J; at this point ${sg(ke)} J is kinetic and ${sg(pe)} J is potential.`, work: ['E = ½ k A²', `E = ½ × ${sg(k)} × (${sg(A)})² = ${sg(E)} J`, 'PE = ½ k x²', `PE = ½ × ${sg(k)} × (${sg(x)})² = ${sg(pe)} J`, `KE = E − PE = ${sg(E)} − ${sg(pe)} = ${sg(ke)} J`] };
      } },
  ],
  presets: [
    { label: 'Mains 50 Hz', prob: 'wf', v: { f: '50' } },
    { label: 'Spring at 0.25 s', prob: 'x', v: { A: '10', T: '2', p: '0', t: '0.25' }, u: { A: 'cm' } },
    { label: 'Speed at 6 cm', prob: 'vx', v: { A: '10', T: '2', x: '6' }, u: { A: 'cm', x: 'cm' } },
    { label: 'Mass on a spring', prob: 'spring', v: { m: '0.5', k: '20' } },
    { label: 'Pendulum 1 m', prob: 'pend', v: { L: '1', g: '9.8' } },
    { label: 'Lab: find g', prob: 'g', v: { L: '0.9', T: '1.92' } },
    { label: 'Energy split', prob: 'E', v: { k: '50', A: '10', x: '6' }, u: { A: 'cm', x: 'cm' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Stress and strain
const dwF: Field = { k: 'd', label: 'Wire diameter d (not radius)', def: '1', units: [['mm', 0.001], ['cm', 0.01], ['m', 1]], gt: 0 };
const area = (d: number) => (PI * d * d) / 4;
const YF = (def = '200'): Field => ({ k: 'Y', label: "Young's modulus Y", def, units: U.stressU, gt: 0, hint: 'Typical: steel 200, copper 120, aluminium 70 (GPa); use your book\'s value' });
export const STRESS: SolverSet = {
  probs: [
    { id: 'stress', label: 'Stress: σ = F / A', fields: [{ k: 'F', label: 'Pulling force F', def: '50', units: U.force, gt: 0 }, dwF],
      tip: 'A = πd²/4 uses the diameter. A wire of 1 mm diameter has area 0.785 mm² = 7.85 × 10⁻⁷ m², not 3.14 mm². Pa and N/m² are the same unit.',
      solve: ({ F, d }) => { const A = area(d), s = F / A; return { ans: `The stress is ${pa(s)} (${sg(s)} N/m²).`, work: ['A = π d² / 4', `A = π × (${sg(d)} m)² ÷ 4 = ${sg(A)} m²`, 'σ = F / A', `σ = ${sg(F)} N ÷ ${sg(A)} m² = ${sg(s)} Pa`] }; } },
    { id: 'strain', label: 'Strain: ε = ΔL / L', fields: [{ k: 'dL', label: 'Extension ΔL', def: '1.5', units: U.lenMm, gt: 0 }, { k: 'L', label: 'Original length L', def: '2', units: U.len, gt: 0 }],
      tip: 'Strain has no unit: ΔL and L must be in the same unit. It is usually a tiny number; multiply by 100 for a percentage.',
      solve: ({ dL, L }) => ({ ans: `The strain is ${sg(dL / L)} (${sg((dL / L) * 100)} %).`, work: ['ε = ΔL / L', `ε = ${sg(dL)} m ÷ ${sg(L)} m`, `ε = ${sg(dL / L)}`] }) },
    { id: 'Y', label: "Find Young's modulus (Searle's experiment)", fields: [{ k: 'F', label: 'Load F', def: '100', units: U.force, gt: 0 }, { k: 'L', label: 'Original length L', def: '2', units: U.len, gt: 0 }, dwF, { k: 'dL', label: 'Extension ΔL', def: '1.27', units: U.lenMm, gt: 0 }],
      tip: 'Use the original length, the diameter (not radius) and the extension caused by the load, all converted to metres. A load of m kg is F = m × 9.8 N.',
      solve: ({ F, L, d, dL }) => {
        const A = area(d), Y = (F * L) / (A * dL);
        return { ans: `Young's modulus is ${pa(Y)} (${sg(Y)} N/m²).`, work: ['A = π d² / 4', `A = ${sg(A)} m²`, 'Stress σ = F / A', `σ = ${sg(F)} ÷ ${sg(A)} = ${sg(F / A)} Pa`, 'Strain ε = ΔL / L', `ε = ${sg(dL)} ÷ ${sg(L)} = ${sg(dL / L)}`, 'Y = σ / ε = F L / (A ΔL)', `Y = ${sg(F / A)} ÷ ${sg(dL / L)} = ${sg(Y)} Pa`] };
      } },
    { id: 'ext', label: 'Extension: ΔL = F L / (A Y)', fields: [{ k: 'F', label: 'Load F', def: '100', units: U.force, gt: 0 }, { k: 'L', label: 'Original length L', def: '2', units: U.len, gt: 0 }, dwF, YF()],
      tip: 'Y in pascals: 200 GPa = 2 × 10¹¹ Pa. The answer is small: expect millimetres, not metres. It is only valid below the elastic limit.',
      solve: ({ F, L, d, Y }) => { const A = area(d), dL = (F * L) / (A * Y); return { ans: `The wire stretches by ${mmOrM(dL)}.`, work: ['A = π d² / 4', `A = ${sg(A)} m²`, 'ΔL = F L / (A Y)', `ΔL = ${sg(F)} × ${sg(L)} ÷ (${sg(A)} × ${sg(Y)})`, `ΔL = ${sg(dL)} m = ${sg(dL * 1000)} mm`] }; } },
    { id: 'mass', label: 'Extension when a mass hangs on the wire', fields: [{ k: 'm', label: 'Hanging mass m', def: '10', units: U.mass, gt: 0 }, { k: 'L', label: 'Original length L', def: '3', units: U.len, gt: 0 }, dwF, YF('120'), gField],
      tip: 'The pull on the wire is the weight m g (in newtons), not the mass. A 10 kg load is about 98 N.',
      solve: ({ m, L, d, Y, g }) => { const F = m * g, A = area(d), dL = (F * L) / (A * Y); return { ans: `The wire stretches by ${mmOrM(dL)} under a ${sg(F)} N pull.`, work: ['F = m g', `F = ${sg(m)} × ${sg(g)} = ${sg(F)} N`, `A = π d² / 4 = ${sg(A)} m²`, 'ΔL = F L / (A Y)', `ΔL = ${sg(F)} × ${sg(L)} ÷ (${sg(A)} × ${sg(Y)}) = ${sg(dL)} m = ${sg(dL * 1000)} mm`] }; } },
    { id: 'break', label: 'Largest safe load from the breaking stress', fields: [{ k: 's', label: 'Breaking stress σ_b', def: '420', units: [['MPa', 1e6], ['GPa', 1e9], ['Pa', 1]], gt: 0, hint: 'Steel about 400 to 500 MPa (use your book\'s value)' }, dwF, { k: 'sf', label: 'Safety factor (1 = none)', def: '4', min: 1 }],
      tip: 'The wire breaks at breaking stress × area. A safety factor of 4 means you only load it to a quarter of that. Divide by g to turn newtons into kilograms.',
      solve: ({ s, d, sf }) => { const A = area(d), Fb = s * A, Fs = Fb / sf; return { ans: `It breaks at ${sg(Fb)} N; the largest safe load is ${sg(Fs)} N (about ${sg(Fs / G)} kg).`, work: [`A = π d² / 4 = ${sg(A)} m²`, 'F_break = σ_b × A', `F_break = ${sg(s)} × ${sg(A)} = ${sg(Fb)} N`, `Safe load = F_break ÷ ${sg(sf)} = ${sg(Fs)} N`, `Mass = ${sg(Fs)} ÷ ${sg(G)} = ${sg(Fs / G)} kg`] }; } },
    { id: 'elastic', label: 'Will it stay elastic? (stress against yield)', fields: [{ k: 'F', label: 'Load F', def: '1000', units: U.force, gt: 0 }, { ...dwF, def: '2' }, { k: 'sy', label: 'Yield strength σ_y', def: '250', units: [['MPa', 1e6], ['GPa', 1e9], ['Pa', 1]], gt: 0, hint: 'Mild steel about 250 MPa, copper about 70 MPa (use your book\'s value)' }],
      tip: 'Below the yield (elastic limit) the wire springs back; above it part of the stretch is permanent. Engineers keep the stress well below it.',
      solve: ({ F, d, sy }) => {
        const A = area(d), s = F / A, r = sy / s;
        return { ans: s <= sy ? `The stress (${pa(s)}) is below the yield strength (${pa(sy)}): it stays elastic, with a safety factor of ${sg(r)}.` : `The stress (${pa(s)}) is above the yield strength (${pa(sy)}): part of the stretch would be permanent.`,
          work: [`A = π d² / 4 = ${sg(A)} m²`, 'σ = F / A', `σ = ${sg(F)} ÷ ${sg(A)} = ${sg(s)} Pa`, `σ ÷ σ_y = ${sg(s / sy)}; σ_y ÷ σ = ${sg(r)}`] };
      } },
    { id: 'U', label: 'Elastic energy stored: U = ½ F ΔL', fields: [{ k: 'F', label: 'Load F', def: '100', units: U.force, gt: 0 }, { k: 'dL', label: 'Extension ΔL', def: '1.27', units: U.lenMm, gt: 0 }],
      tip: 'The force rose from 0 to F, so use half of F × ΔL, not the whole of it. It is the area under the straight part of the graph.',
      solve: ({ F, dL }) => ({ ans: `The wire stores ${sg(0.5 * F * dL)} J of elastic energy.`, work: ['U = ½ F ΔL', `U = ½ × ${sg(F)} N × ${sg(dL)} m`, `U = ${sg(0.5 * F * dL)} J`] }) },
  ],
  presets: [
    { label: 'Steel wire stress', prob: 'stress', v: { F: '50', d: '1' }, u: { d: 'mm' } },
    { label: "Searle's Y", prob: 'Y', v: { F: '100', L: '2', d: '1', dL: '1.27' }, u: { d: 'mm', dL: 'mm' } },
    { label: 'Copper, 10 kg load', prob: 'mass', v: { m: '10', L: '3', d: '1', Y: '120', g: '9.8' }, u: { d: 'mm', Y: 'GPa' } },
    { label: 'Safe load', prob: 'break', v: { s: '420', d: '2', sf: '4' }, u: { s: 'MPa', d: 'mm' } },
    { label: 'Past the yield', prob: 'elastic', v: { F: '1000', d: '2', sy: '250' }, u: { d: 'mm', sy: 'MPa' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Capillary rise (Jurin's law)
const TsF: Field = { k: 'T', label: 'Surface tension T', def: '0.073', units: [['N/m', 1], ['mN/m', 0.001]], gt: 0, hint: 'Water about 0.073 N/m, soapy water 0.03, mercury 0.48 (use your book\'s value)' };
const thF: Field = { k: 'th', label: 'Contact angle θ', def: '0', units: U.deg, min: 0, max: 180, hint: 'Water on clean glass about 0°, mercury on glass about 140°' };
const rhoF = (def = '1000'): Field => ({ k: 'rho', label: 'Liquid density ρ', def, units: U.dens, gt: 0, hint: 'Water 1000, mercury 13600 kg/m³' });
const rF = (def = '0.5'): Field => ({ k: 'r', label: 'Tube radius r (inside)', def, units: U.lenMm, gt: 0 });
const cosd = (deg: number) => { const c = Math.cos((deg * PI) / 180); return Math.abs(c) < 1e-9 ? 0 : c; };
const rise = (h: number) => `${h >= 0 ? 'rises' : 'is pushed down'} by ${mmOrM(Math.abs(h))}`;
export const CAPILLARY: SolverSet = {
  probs: [
    { id: 'h', label: "Height: h = 2T cos θ / (r ρ g)", fields: [TsF, thF, rF(), rhoF(), gField],
      tip: 'r is the inner RADIUS in metres (0.5 mm = 0.0005 m), not the diameter. A negative h means the liquid is pushed down (mercury), because cos θ is negative above 90°.',
      solve: ({ T, th, r, rho, g }) => {
        const c = cosd(th), h = (2 * T * c) / (r * rho * g);
        if (c === 0) return { ans: 'The liquid stays level with the surface outside (contact angle 90°, cos 90° = 0).', work: ['h = 2T cos θ / (r ρ g)', 'cos 90° = 0, so h = 0'] };
        return { ans: `The liquid ${rise(h)} in the tube.`, work: ['h = 2T cos θ / (r ρ g)', `h = 2 × ${sg(T)} × cos ${sg(th)}° ÷ (${sg(r)} × ${sg(rho)} × ${sg(g)})`, `h = ${sg(2 * T * c)} ÷ ${sg(r * rho * g)} = ${sg(h)} m = ${sg(h * 1000)} mm`, h < 0 ? 'Negative h: the surface inside is lower than outside (the liquid does not wet the glass).' : 'Positive h: the liquid climbs (it wets the glass).'] };
      } },
    { id: 'r', label: 'Tube radius for a given rise', fields: [{ k: 'h', label: 'Height h (minus if it falls)', def: '30', units: U.lenMm }, TsF, thF, rhoF(), gField],
      tip: 'The narrower the tube the higher the rise (h ∝ 1/r). h and cos θ must have the same sign: a rise needs θ below 90°.',
      solve: ({ h, T, th, rho, g }) => {
        const c = cosd(th);
        if (h === 0) return { err: 'The height h cannot be 0: a tube of any width would give some rise unless θ is 90°.' };
        if (c === 0) return { err: 'At a contact angle of 90° the liquid does not rise or fall, so there is no radius to find.' };
        const r = (2 * T * c) / (h * rho * g);
        if (r <= 0) return { err: 'h and cos θ must have the same sign: a rise (h above 0) needs θ below 90°, a fall (h below 0) needs θ above 90°.' };
        return { ans: `The tube's inner radius is ${sg(r * 1000)} mm (diameter ${sg(r * 2000)} mm).`, work: ['r = 2T cos θ / (h ρ g)', `r = 2 × ${sg(T)} × cos ${sg(th)}° ÷ (${sg(h)} × ${sg(rho)} × ${sg(g)})`, `r = ${sg(r)} m = ${sg(r * 1000)} mm`] };
      } },
    { id: 'T', label: 'Find surface tension from a measured rise', fields: [{ k: 'h', label: 'Height h (minus if it falls)', def: '29.8', units: U.lenMm }, rF(), thF, rhoF(), gField],
      tip: 'Measure the rise from the level of the liquid outside the tube. If the angle is 0°, T = r ρ g h / 2 (the 2 and cos 0° = 1 are easy to forget).',
      solve: ({ h, r, th, rho, g }) => {
        const c = cosd(th);
        if (c === 0) return { err: 'At a contact angle of 90° cos θ = 0, so the height does not depend on T and T cannot be found.' };
        const T = (r * rho * g * h) / (2 * c);
        if (T <= 0) return { err: 'h and cos θ must have the same sign (a rise needs θ below 90°; a fall needs θ above 90°).' };
        return { ans: `The surface tension is ${sg(T)} N/m (${sg(T * 1000)} mN/m).`, work: ['T = r ρ g h / (2 cos θ)', `T = ${sg(r)} × ${sg(rho)} × ${sg(g)} × ${sg(h)} ÷ (2 × cos ${sg(th)}°)`, `T = ${sg(T)} N/m`] };
      } },
    { id: 'th', label: 'Find the contact angle', fields: [{ k: 'h', label: 'Height h (minus if it falls)', def: '-5.52', units: U.lenMm }, { ...TsF, def: '0.48' }, rF('1'), rhoF('13600'), gField],
      tip: 'cos θ = h r ρ g / (2T) must lie between −1 and 1. A negative answer means θ is above 90° (the liquid does not wet the glass).',
      solve: ({ h, T, r, rho, g }) => {
        const c = (h * r * rho * g) / (2 * T);
        if (Math.abs(c) > 1) return { err: `cos θ would be ${sg(c)}, which is impossible (it must be between −1 and 1). Check h, r and T.` };
        const th = (Math.acos(c) * 180) / PI;
        return { ans: `The contact angle is ${sg(th)}°.`, work: ['cos θ = h r ρ g / (2T)', `cos θ = ${sg(h)} × ${sg(r)} × ${sg(rho)} × ${sg(g)} ÷ (2 × ${sg(T)}) = ${sg(c)}`, `θ = cos⁻¹(${sg(c)}) = ${sg(th)}°`] };
      } },
    { id: 'cmp', label: 'Same liquid, different tube', fields: [{ k: 'h1', label: 'Rise in the first tube h₁', def: '30', units: U.lenMm, gt: 0 }, { k: 'r1', label: 'First tube radius r₁', def: '0.5', units: U.lenMm, gt: 0 }, { k: 'r2', label: 'Second tube radius r₂', def: '1.5', units: U.lenMm, gt: 0 }],
      tip: 'h is inversely proportional to r, so tripling the radius cuts the rise to a third. It also works for several tubes of one liquid at one angle.',
      solve: ({ h1, r1, r2 }) => { const h2 = (h1 * r1) / r2; return { ans: `In the second tube the liquid rises ${mmOrM(h2)}.`, work: ['h ∝ 1 / r, so h₁ r₁ = h₂ r₂', `h₂ = h₁ × r₁ ÷ r₂ = ${sg(h1 * 1000)} mm × ${sg(r1 * 1000)} ÷ ${sg(r2 * 1000)}`, `h₂ = ${sg(h2 * 1000)} mm`] }; } },
  ],
  presets: [
    { label: 'Water in 0.5 mm tube', prob: 'h', v: { T: '0.073', th: '0', r: '0.5', rho: '1000', g: '9.8' }, u: { r: 'mm' } },
    { label: 'Mercury in glass', prob: 'h', v: { T: '0.48', th: '140', r: '1', rho: '13600', g: '9.8' }, u: { r: 'mm' } },
    { label: 'Tube for 3 cm rise', prob: 'r', v: { h: '30', T: '0.073', th: '0', rho: '1000', g: '9.8' }, u: { h: 'mm' } },
    { label: 'Measure T', prob: 'T', v: { h: '29.8', r: '0.5', th: '0', rho: '1000', g: '9.8' }, u: { h: 'mm', r: 'mm' } },
    { label: 'Wider tube', prob: 'cmp', v: { h1: '30', r1: '0.5', r2: '1.5' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Stokes' law and terminal velocity
const rBall = (def = '1'): Field => ({ k: 'r', label: 'Ball radius r (not diameter)', def, units: U.lenMm, gt: 0 });
const rhoB = (def = '7800'): Field => ({ k: 'rb', label: 'Ball density ρ', def, units: U.dens, gt: 0, hint: 'Steel about 7800, glass 2500, aluminium 2700 kg/m³' });
const rhoL = (def = '1260'): Field => ({ k: 'rl', label: 'Liquid density σ', def, units: U.dens, gt: 0, hint: 'Glycerine about 1260, water 1000 kg/m³' });
const etaF = (def = '1.4'): Field => ({ k: 'eta', label: 'Viscosity η', def, units: U.eta, gt: 0, hint: 'Glycerine about 1.4, honey about 10, water 0.001 Pa·s (varies with temperature)' });
export const STOKES: SolverSet = {
  probs: [
    { id: 'vt', label: 'Terminal velocity: v = 2r²(ρ − σ)g / 9η', fields: [rBall(), rhoB(), rhoL(), etaF(), gField],
      tip: 'Use the radius, not the diameter, and put it in metres (1 mm = 0.001 m): the radius is squared, so a slip costs you a factor of 4. Subtract the liquid density (buoyancy).',
      solve: ({ r, rb, rl, eta, g }) => {
        const d = rb - rl, v = (2 * r * r * d * g) / (9 * eta), re = (rl * Math.abs(v) * 2 * r) / eta, drag = 6 * PI * eta * r * Math.abs(v);
        if (d === 0) return { ans: 'The ball neither sinks nor rises: its density equals the liquid\'s, so the terminal velocity is 0.', work: ['v = 2r²(ρ − σ)g / 9η', 'ρ − σ = 0, so v = 0'] };
        const reNote = re < 1 ? `Re = ${sg(re)} is below 1, so Stokes' law is a good model.` : `Re = ${sg(re)} is above 1: the flow is no longer smooth, so Stokes' law over-estimates the speed.`;
        return { ans: `The ${d > 0 ? 'terminal (falling)' : 'rising'} speed is ${speedS(Math.abs(v))} (${sg(Math.abs(v))} m/s)${d < 0 ? '; the ball floats up because it is lighter than the liquid' : ''}.`,
          work: ['v = 2 r² (ρ − σ) g / (9 η)', `v = 2 × (${sg(r)})² × (${sg(rb)} − ${sg(rl)}) × ${sg(g)} ÷ (9 × ${sg(eta)})`, `v = ${sg(2 * r * r * d * g)} ÷ ${sg(9 * eta)} = ${sg(Math.abs(v))} m/s`, `Drag at that speed = 6π η r v = ${sg(drag)} N (it balances weight minus buoyancy)`, `Reynolds number Re = σ v (2r) / η = ${sg(re)}. ${reNote}`] };
      } },
    { id: 'eta', label: 'Find the liquid\'s viscosity from a measured speed', fields: [{ k: 'v', label: 'Steady falling speed v', def: '1.02', units: [['cm/s', 0.01], ['m/s', 1], ['mm/s', 0.001]], gt: 0 }, rBall(), rhoB(), rhoL(), gField],
      tip: 'Time the ball only after it has reached a steady speed (between two marks low down). η = 2r²(ρ − σ)g ÷ 9v; the ball must be denser than the liquid.',
      solve: ({ v, r, rb, rl, g }) => {
        if (rb <= rl) return { err: 'The ball must be denser than the liquid to sink at a steady speed.' };
        const eta = (2 * r * r * (rb - rl) * g) / (9 * v);
        return { ans: `The viscosity is ${sg(eta)} Pa·s (${sg(eta * 10)} poise).`, work: ['η = 2 r² (ρ − σ) g / (9 v)', `η = 2 × (${sg(r)})² × (${sg(rb)} − ${sg(rl)}) × ${sg(g)} ÷ (9 × ${sg(v)})`, `η = ${sg(eta)} Pa·s`] };
      } },
    { id: 'rad', label: 'Find the radius from the terminal speed', fields: [{ k: 'v', label: 'Terminal speed v', def: '1.2', units: [['cm/s', 0.01], ['m/s', 1], ['mm/s', 0.001]], gt: 0 }, rhoB('1000'), rhoL('1.2'), etaF('1.8e-5'), gField],
      tip: 'r = √(9ηv ÷ 2(ρ − σ)g): square root at the end. The answer is a radius, not a diameter. This example is a fog droplet falling in air.',
      solve: ({ v, rb, rl, eta, g }) => {
        if (rb <= rl) return { err: 'The ball must be denser than the liquid to sink at a steady speed.' };
        const r = Math.sqrt((9 * eta * v) / (2 * (rb - rl) * g));
        return { ans: `The radius is ${sg(r * 1000)} mm (${sg(r * 1e6)} µm), a diameter of ${sg(r * 2000)} mm.`, work: ['r = √( 9 η v / (2 (ρ − σ) g) )', `r = √( 9 × ${sg(eta)} × ${sg(v)} ÷ (2 × (${sg(rb)} − ${sg(rl)}) × ${sg(g)}) )`, `r = ${sg(r)} m`] };
      } },
    { id: 'time', label: 'How long to fall a distance (and how fast it settles)', fields: [rBall(), rhoB(), rhoL(), etaF(), { k: 's', label: 'Distance fallen', def: '20', units: [['cm', 0.01], ['m', 1], ['mm', 0.001]], gt: 0 }, gField],
      tip: 'This assumes the ball is already at its terminal speed. It speeds up for the first few time constants τ, so the real time is a little longer.',
      solve: ({ r, rb, rl, eta, s, g }) => {
        if (rb <= rl) return { err: 'The ball must be denser than the liquid to sink.' };
        const v = (2 * r * r * (rb - rl) * g) / (9 * eta), t = s / v, tau = (2 * rb * r * r) / (9 * eta);
        return { ans: `At terminal speed the ball takes ${dur(t)} to fall ${sg(s * 100)} cm.`, work: [`v = 2 r² (ρ − σ) g / (9 η) = ${sg(v)} m/s`, 'time = distance ÷ speed', `time = ${sg(s)} m ÷ ${sg(v)} m/s = ${sg(t)} s`, `Start-up time constant τ = 2ρr² / 9η = ${sg(tau)} s (about 95 % of v after 3τ = ${sg(3 * tau)} s)`] };
      } },
  ],
  presets: [
    { label: 'Steel ball in glycerine', prob: 'vt', v: { r: '1', rb: '7800', rl: '1260', eta: '1.4', g: '9.8' }, u: { r: 'mm' } },
    { label: 'Glass in castor oil', prob: 'vt', v: { r: '1.5', rb: '2500', rl: '960', eta: '1', g: '9.8' }, u: { r: 'mm' } },
    { label: 'Fog droplet in air', prob: 'rad', v: { v: '1.2', rb: '1000', rl: '1.2', eta: '1.8e-5', g: '9.8' }, u: { v: 'cm/s' } },
    { label: 'Measure viscosity', prob: 'eta', v: { v: '1.02', r: '1', rb: '7800', rl: '1260', g: '9.8' }, u: { v: 'cm/s', r: 'mm' } },
    { label: 'Fall 20 cm', prob: 'time', v: { r: '1', rb: '7800', rl: '1260', eta: '1.4', s: '20', g: '9.8' }, u: { r: 'mm', s: 'cm' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Carnot engine, refrigerator and heat pump
const tU: Field = { k: 'u', label: 'Temperatures are in', def: '0', sel: ['kelvin (K)', 'degrees Celsius (°C)'] };
const toK = (x: number, u: number) => (u === 1 ? x + 273.15 : x);
const tTxt = (K: number) => `${sg(K)} K (${sg(K - 273.15)} °C)`;
const bad = (Th: number, Tc: number) => (!(Tc > 0) ? 'Temperatures must be above absolute zero (0 K = −273.15 °C).' : !(Th > Tc) ? 'The hot side must be hotter than the cold side.' : '');
const ThF = (def: string, label = 'Hot side T₁'): Field => ({ k: 'Th', label, def, hint: 'in the unit chosen above' });
const TcF = (def: string, label = 'Cold side T₂'): Field => ({ k: 'Tc', label, def, hint: 'in the unit chosen above' });
export const CARNOT: SolverSet = {
  probs: [
    { id: 'eff', label: 'Best possible efficiency: η = 1 − T₂ / T₁', fields: [tU, ThF('500'), TcF('300')],
      tip: 'Always use kelvin in the formula: add 273 (273.15) to a Celsius temperature. A real engine is always below this limit.',
      solve: ({ u, Th, Tc }) => {
        const h = toK(Th, u), c = toK(Tc, u), m = bad(h, c); if (m) return { err: m };
        const e = 1 - c / h;
        return { ans: `The best possible efficiency is ${sg(e * 100)} % (η = ${sg(e)}).`, work: [`T₁ = ${tTxt(h)}, T₂ = ${tTxt(c)}`, 'η = 1 − T₂ / T₁', `η = 1 − ${sg(c)} ÷ ${sg(h)} = ${sg(e)}`, `η = ${sg(e * 100)} %`] };
      } },
    { id: 'work', label: 'Work and heat rejected per cycle', fields: [tU, ThF('500'), TcF('300'), { k: 'Q', label: 'Heat taken in Q₁', def: '1000', units: U.energy, gt: 0 }],
      tip: 'W = η Q₁ and Q₂ = Q₁ − W. Q₂ is the heat thrown away to the cold side; it is never zero, whatever the engine.',
      solve: ({ u, Th, Tc, Q }) => {
        const h = toK(Th, u), c = toK(Tc, u), m = bad(h, c); if (m) return { err: m };
        const e = 1 - c / h, W = e * Q, Q2 = Q - W;
        return { ans: `It can do at most ${en(W)} of work per cycle and must reject ${en(Q2)} to the cold side.`, work: [`η = 1 − ${sg(c)} ÷ ${sg(h)} = ${sg(e)}`, 'W = η Q₁', `W = ${sg(e)} × ${sg(Q)} J = ${sg(W)} J`, 'Q₂ = Q₁ − W', `Q₂ = ${sg(Q)} − ${sg(W)} = ${sg(Q2)} J`, `Check: Q₂ / Q₁ = T₂ / T₁ = ${sg(c / h)}`] };
      } },
    { id: 'Th', label: 'Hot temperature needed for a wanted efficiency', fields: [tU, TcF('300', 'Cold side T₂'), { k: 'e', label: 'Wanted efficiency η', def: '60', units: [['%', 1]], gt: 0, max: 99.99 }],
      tip: 'T₁ = T₂ ÷ (1 − η) with η as a fraction (60 % is 0.6). No engine can reach 100 %: that would need T₂ = 0 K.',
      solve: ({ u, Tc, e }) => {
        const c = toK(Tc, u); if (!(c > 0)) return { err: 'The cold side must be above absolute zero (0 K = −273.15 °C).' };
        const h = c / (1 - e / 100);
        return { ans: `The hot side must be at ${tTxt(h)}.`, work: ['η = 1 − T₂/T₁, so T₁ = T₂ / (1 − η)', `T₁ = ${sg(c)} K ÷ (1 − ${sg(e / 100)}) = ${sg(h)} K`, `${sg(h)} − 273.15 = ${sg(h - 273.15)} °C`] };
      } },
    { id: 'fridge', label: 'Refrigerator: COP = T₂ / (T₁ − T₂)', fields: [tU, ThF('300', 'Room (hot side) T₁'), TcF('270', 'Inside the fridge (cold side) T₂'), { k: 'Q', label: 'Heat to remove Q₂', def: '600', units: U.energy, gt: 0 }],
      tip: 'The temperature difference is the same in kelvin and °C, but T₂ itself must be in kelvin. A fridge moves heat; it does not make cold. COP can be more than 1.',
      solve: ({ u, Th, Tc, Q }) => {
        const h = toK(Th, u), c = toK(Tc, u), m = bad(h, c); if (m) return { err: m };
        const cop = c / (h - c), W = Q / cop;
        return { ans: `The best possible COP is ${sg(cop)}; removing ${en(Q)} needs at least ${en(W)} of work (and ${en(Q + W)} is dumped into the room).`, work: ['COP = Q₂ / W = T₂ / (T₁ − T₂)', `COP = ${sg(c)} ÷ (${sg(h)} − ${sg(c)}) = ${sg(cop)}`, 'W = Q₂ / COP', `W = ${sg(Q)} ÷ ${sg(cop)} = ${sg(W)} J`, `Q₁ = Q₂ + W = ${sg(Q + W)} J`] };
      } },
    { id: 'hp', label: 'Heat pump: COP = T₁ / (T₁ − T₂)', fields: [tU, ThF('295', 'Warm room T₁'), TcF('275', 'Outside T₂'), { k: 'W', label: 'Electrical work W put in', def: '1', units: [['kJ', 1e3], ['J', 1], ['MJ', 1e6]], gt: 0 }],
      tip: 'A heat pump delivers more heat than the work it uses because it moves heat from outside. The COP for heating is one more than the COP for cooling.',
      solve: ({ u, Th, Tc, W }) => {
        const h = toK(Th, u), c = toK(Tc, u), m = bad(h, c); if (m) return { err: m };
        const cop = h / (h - c), Q1 = cop * W;
        return { ans: `The best possible COP is ${sg(cop)}: ${en(W)} of work delivers up to ${en(Q1)} of heat (${en(Q1 - W)} comes from outside).`, work: ['COP = Q₁ / W = T₁ / (T₁ − T₂)', `COP = ${sg(h)} ÷ (${sg(h)} − ${sg(c)}) = ${sg(cop)}`, 'Q₁ = COP × W', `Q₁ = ${sg(cop)} × ${sg(W)} J = ${sg(Q1)} J`] };
      } },
    { id: 'claim', label: 'Is an inventor\'s claimed efficiency possible?', fields: [tU, ThF('500'), TcF('300'), { k: 'e', label: 'Claimed efficiency', def: '45', units: [['%', 1]], gt: 0, max: 100 }],
      tip: 'Compare with the Carnot limit for the same two temperatures. Above it, the claim breaks the second law of thermodynamics.',
      solve: ({ u, Th, Tc, e }) => {
        const h = toK(Th, u), c = toK(Tc, u), m = bad(h, c); if (m) return { err: m };
        const lim = (1 - c / h) * 100;
        return { ans: e <= lim + 1e-9 ? `Possible: ${sg(e)} % is not above the limit of ${sg(lim)} %. A real engine would still be a bit lower.` : `Impossible: ${sg(e)} % is above the Carnot limit of ${sg(lim)} % between these temperatures.`, work: [`Limit η = 1 − ${sg(c)} ÷ ${sg(h)} = ${sg(lim / 100)} = ${sg(lim)} %`, `Claim ${sg(e)} % ${e <= lim + 1e-9 ? '≤' : '>'} ${sg(lim)} %`] };
      } },
    { id: 'real', label: 'A real engine: how close to Carnot?', fields: [tU, ThF('500'), TcF('300'), { k: 'Q', label: 'Heat taken in Q₁', def: '1000', units: U.energy, gt: 0 }, { k: 'W', label: 'Work done W', def: '300', units: U.energy, gt: 0 }],
      tip: 'Efficiency is W ÷ Q₁ (work out per heat in). W cannot be more than Q₁, and a real engine always falls short of the Carnot value.',
      solve: ({ u, Th, Tc, Q, W }) => {
        const h = toK(Th, u), c = toK(Tc, u), m = bad(h, c); if (m) return { err: m };
        if (W > Q) return { err: 'W cannot be more than Q₁: that would create energy.' };
        const e = W / Q, lim = 1 - c / h;
        return { ans: `This engine is ${sg(e * 100)} % efficient, ${sg((e / lim) * 100)} % of the Carnot limit (${sg(lim * 100)} %)${e > lim + 1e-9 ? ' — which is impossible: check the numbers' : ''}.`, work: ['η = W / Q₁', `η = ${sg(W)} ÷ ${sg(Q)} = ${sg(e)} = ${sg(e * 100)} %`, `η_Carnot = 1 − ${sg(c)} ÷ ${sg(h)} = ${sg(lim)}`, `η ÷ η_Carnot = ${sg(e / lim)}`, `Heat rejected Q₂ = Q₁ − W = ${sg(Q - W)} J`] };
      } },
  ],
  presets: [
    { label: 'Steam engine', prob: 'eff', v: { u: '1', Th: '150', Tc: '30' } },
    { label: 'Work per cycle', prob: 'work', v: { u: '0', Th: '500', Tc: '300', Q: '1000' }, u: { Q: 'J' } },
    { label: 'Fridge', prob: 'fridge', v: { u: '0', Th: '300', Tc: '270', Q: '600' }, u: { Q: 'J' } },
    { label: 'Heat pump', prob: 'hp', v: { u: '1', Th: '22', Tc: '2', W: '1' }, u: { W: 'kJ' } },
    { label: 'Inventor claims 45 %', prob: 'claim', v: { u: '0', Th: '500', Tc: '300', e: '45' } },
    { label: 'Real engine', prob: 'real', v: { u: '0', Th: '500', Tc: '300', Q: '1000', W: '300' }, u: { Q: 'J', W: 'J' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Kinetic theory of gases
const R = 8.314462618, KB = 1.380649e-23, NA = 6.02214076e23;
const molF = (def = '28'): Field => ({ k: 'M', label: 'Molar mass M', def, units: U.molar, gt: 0, hint: 'H₂ 2, He 4, N₂ 28, O₂ 32, CO₂ 44 g/mol' });
const TkF = (def = '300', label = 'Temperature T'): Field => ({ k: 'T', label, def, hint: 'in the unit chosen above' });
const tOK = (T: number) => (T > 0 ? '' : 'The temperature must be above absolute zero (0 K = −273.15 °C).');
export const KINETIC: SolverSet = {
  probs: [
    { id: 'vrms', label: 'Speed of molecules: v_rms = √(3RT / M)', fields: [tU, TkF(), molF()],
      tip: 'Use T in kelvin and M in kg per mole (28 g/mol = 0.028 kg/mol). The root-mean-square speed is a little above the mean speed.',
      solve: ({ u, T, M }) => {
        const K = toK(T, u), m = tOK(K); if (m) return { err: m };
        const v = Math.sqrt((3 * R * K) / M), vm = Math.sqrt((8 * R * K) / (PI * M)), vp = Math.sqrt((2 * R * K) / M);
        return { ans: `The root-mean-square speed is ${sg(v)} m/s (${sg(v * 3.6)} km/h).`, work: [`T = ${sg(K)} K, M = ${sg(M)} kg/mol`, 'v_rms = √(3 R T / M)', `v_rms = √(3 × 8.314 × ${sg(K)} ÷ ${sg(M)}) = ${sg(v)} m/s`, `Mean speed = √(8RT/πM) = ${sg(vm)} m/s; most probable = √(2RT/M) = ${sg(vp)} m/s`] };
      } },
    { id: 'ke', label: 'Average kinetic energy: ½mv² = (3/2) k T', fields: [tU, TkF()],
      tip: 'The average energy depends only on temperature, not on the gas: hydrogen and oxygen molecules at the same T have the same average KE (the lighter ones are faster).',
      solve: ({ u, T }) => {
        const K = toK(T, u), m = tOK(K); if (m) return { err: m };
        const e = 1.5 * KB * K, mol = 1.5 * R * K;
        return { ans: `Each molecule has an average kinetic energy of ${sg(e)} J (${sg(e / 1.602176634e-19)} eV); a mole has ${sg(mol)} J.`, work: ['KE = (3/2) k T', `KE = 1.5 × 1.38 × 10^-23 × ${sg(K)} = ${sg(e)} J`, 'Per mole: (3/2) R T', `= 1.5 × 8.314 × ${sg(K)} = ${sg(mol)} J/mol`] };
      } },
    { id: 'T', label: 'Temperature from the molecule speed', fields: [{ k: 'v', label: 'rms speed v', def: '517', units: [['m/s', 1], ['km/s', 1000]], gt: 0 }, molF()],
      tip: 'T = M v² ÷ 3R. Do not forget to square v, and use M in kg/mol.',
      solve: ({ v, M }) => { const T = (M * v * v) / (3 * R); return { ans: `The temperature is ${sg(T)} K (${sg(T - 273.15)} °C).`, work: ['T = M v² / (3 R)', `T = ${sg(M)} × (${sg(v)})² ÷ (3 × 8.314)`, `T = ${sg(T)} K = ${sg(T - 273.15)} °C`] }; } },
    { id: 'ratio', label: 'Compare two gases at the same temperature', fields: [{ k: 'M1', label: 'Molar mass of gas 1', def: '2', units: U.molar, gt: 0 }, { k: 'M2', label: 'Molar mass of gas 2', def: '32', units: U.molar, gt: 0 }],
      tip: 'The lighter gas is faster: v₁ / v₂ = √(M₂ / M₁). The square root is easy to forget; a gas 16 times heavier is only 4 times slower.',
      solve: ({ M1, M2 }) => { const r = Math.sqrt(M2 / M1); return { ans: `Gas 1 molecules move ${sg(r)} times as fast as gas 2 molecules (rms speed).`, work: ['v ∝ 1 / √M at the same T', 'v₁ / v₂ = √(M₂ / M₁)', `v₁ / v₂ = √(${sg(M2 * 1000)} ÷ ${sg(M1 * 1000)}) = ${sg(r)}`] }; } },
    { id: 'P', label: 'Pressure from density: P = ⅓ ρ v²', fields: [{ k: 'rho', label: 'Gas density ρ', def: '1.25', units: [['kg/m³', 1], ['g/L', 1]], gt: 0 }, { k: 'v', label: 'rms speed v', def: '500', units: [['m/s', 1], ['km/s', 1000]], gt: 0 }],
      tip: 'P = ⅓ ρ v², with v squared. 1 atm is 101 325 Pa, so a pressure near 10⁵ Pa is about one atmosphere.',
      solve: ({ rho, v }) => { const P = (rho * v * v) / 3; return { ans: `The pressure is ${pa(P)} (${sg(P / 101325)} atm).`, work: ['P = ⅓ ρ v²', `P = ⅓ × ${sg(rho)} × (${sg(v)})²`, `P = ${sg(P)} Pa`] }; } },
    { id: 'vP', label: 'Speed from pressure and density: v = √(3P / ρ)', fields: [{ k: 'P', label: 'Pressure P', def: '1', units: [['atm', 101325], ['Pa', 1], ['kPa', 1000]], gt: 0 }, { k: 'rho', label: 'Gas density ρ', def: '1.25', units: [['kg/m³', 1], ['g/L', 1]], gt: 0 }],
      tip: 'Convert the pressure to pascals (1 atm = 101 325 Pa) before you put it in. The answer is the rms speed, not the mean speed.',
      solve: ({ P, rho }) => { const v = Math.sqrt((3 * P) / rho); return { ans: `The rms speed is ${sg(v)} m/s.`, work: ['v_rms = √(3 P / ρ)', `v_rms = √(3 × ${sg(P)} ÷ ${sg(rho)})`, `v_rms = ${sg(v)} m/s`] }; } },
    { id: 'gas', label: 'Ideal gas: P = nRT / V and number of molecules', fields: [tU, { k: 'n', label: 'Amount n', def: '1', units: [['mol', 1], ['mmol', 0.001]], gt: 0 }, TkF('273'), { k: 'V', label: 'Volume V', def: '22.4', units: [['L', 0.001], ['m³', 1], ['cm³', 1e-6]], gt: 0 }],
      tip: 'V in cubic metres: 1 L = 0.001 m³. The molecule count is n × 6.022 × 10²³.',
      solve: ({ u, n, T, V }) => {
        const K = toK(T, u), m = tOK(K); if (m) return { err: m };
        const P = (n * R * K) / V, N = n * NA;
        return { ans: `The pressure is ${pa(P)} (${sg(P / 101325)} atm), from ${sg(N)} molecules.`, work: ['P = n R T / V', `P = ${sg(n)} × 8.314 × ${sg(K)} ÷ ${sg(V)} m³`, `P = ${sg(P)} Pa = ${sg(P / 101325)} atm`, `N = n N_A = ${sg(n)} × 6.022 × 10^23 = ${sg(N)}`] };
      } },
  ],
  presets: [
    { label: 'Nitrogen at 27 °C', prob: 'vrms', v: { u: '1', T: '27', M: '28' }, u: { M: 'g/mol' } },
    { label: 'Hydrogen vs oxygen', prob: 'ratio', v: { M1: '2', M2: '32' }, u: { M1: 'g/mol', M2: 'g/mol' } },
    { label: 'Energy of a molecule', prob: 'ke', v: { u: '1', T: '27' } },
    { label: 'Speed at STP', prob: 'vP', v: { P: '1', rho: '1.25' }, u: { P: 'atm' } },
    { label: 'Gas in a flask', prob: 'gas', v: { u: '0', n: '1', T: '273', V: '22.4' }, u: { V: 'L' } },
  ],
};

// ---------------------------------------------------------------------------------------------------------
// Heating curve and calorimetry
const cI = 2100, cW = 4200, cS = 2000, LF = 3.34e5, LV = 2.26e6;
const cF = (def = '4200', k = 'c', label = 'Specific heat c'): Field => ({ k, label, def, units: U.cap, gt: 0, hint: 'Water 4200 (4186), ice 2100, steam 2000, iron 450, copper 385, aluminium 900 J/(kg·K)' });
const tC = (k: string, label: string, def: string): Field => ({ k, label, def, units: [['°C', 1]] });
export const HEAT: SolverSet = {
  probs: [
    { id: 'Q', label: 'Heat for a temperature change: Q = m c ΔT', fields: [{ k: 'm', label: 'Mass m', def: '2', units: U.mass, gt: 0 }, cF(), tC('T1', 'Starting temperature', '20'), tC('T2', 'Final temperature', '70')],
      tip: 'Mass in kg (grams ÷ 1000) when c is per kg. ΔT is final minus start; a cooling gives a negative Q (heat given out).',
      solve: ({ m, c, T1, T2 }) => { const Q = m * c * (T2 - T1); return { ans: Q >= 0 ? `It needs ${en(Q)} of heat.` : `It gives out ${en(-Q)} of heat as it cools.`, work: ['Q = m c ΔT', `Q = ${sg(m)} kg × ${sg(c)} J/(kg·K) × (${sg(T2)} − ${sgn(T1)}) °C`, `Q = ${sg(Q)} J`] }; } },
    { id: 'QL', label: 'Heat for melting or boiling: Q = m L', fields: [{ k: 'm', label: 'Mass m', def: '0.25', units: U.mass, gt: 0 }, { k: 'L', label: 'Latent heat L', def: '334000', units: U.lat, gt: 0, hint: 'Melting ice 3.34 × 10⁵ J/kg; boiling water 2.26 × 10⁶ J/kg' }],
      tip: 'While a substance melts or boils its temperature stays the same: Q = mL has no ΔT. Do not multiply by a temperature change.',
      solve: ({ m, L }) => ({ ans: `It needs ${en(m * L)} of heat to change state, with no change in temperature.`, work: ['Q = m L', `Q = ${sg(m)} kg × ${sg(L)} J/kg`, `Q = ${sg(m * L)} J`] }) },
    { id: 'full', label: 'Ice to water to steam: total heat and time', fields: [{ k: 'm', label: 'Mass of ice m', def: '0.5', units: U.mass, gt: 0 }, tC('T0', 'Ice starts at (0 or below)', '-20'), tC('Tf', 'Heated until', '120'), { k: 'P', label: 'Heater power P', def: '1000', units: [['W', 1], ['kW', 1000]], gt: 0 }],
      tip: 'Do the stages in order: warm the ice to 0 °C, melt it, warm the water to 100 °C, boil it, then warm the steam. The melting and boiling stages have no temperature change.',
      solve: ({ m, T0, Tf, P }) => {
        if (T0 > 0) return { err: 'The ice must start at 0 °C or colder.' };
        if (Tf <= T0) return { err: 'The final temperature must be above the starting temperature.' };
        const w: string[] = [`Constants: c_ice = ${cI}, c_water = ${cW}, c_steam = ${cS} J/(kg·K); L_melt = ${sg(LF)}, L_boil = ${sg(LV)} J/kg`];
        let tot = 0;
        const add = (name: string, q: number, how: string) => { tot += q; w.push(`${name}: ${how} = ${sg(q)} J`); };
        add('Warm the ice', m * cI * (Math.min(Tf, 0) - T0), `${sg(m)} × ${cI} × (${sg(Math.min(Tf, 0))} − ${sgn(T0)})`);
        if (Tf > 0) { add('Melt it', m * LF, `${sg(m)} × ${sg(LF)}`); add('Warm the water', m * cW * (Math.min(Tf, 100)), `${sg(m)} × ${cW} × ${sg(Math.min(Tf, 100))}`); }
        if (Tf > 100) { add('Boil it', m * LV, `${sg(m)} × ${sg(LV)}`); add('Warm the steam', m * cS * (Tf - 100), `${sg(m)} × ${cS} × ${sg(Tf - 100)}`); }
        w.push(`Total Q = ${sg(tot)} J = ${en(tot)}`, `Time = Q ÷ P = ${sg(tot)} ÷ ${sg(P)} = ${sg(tot / P)} s`);
        if (Tf === 0) w.push('It stops at 0 °C: the ice is warm but has not started to melt.');
        if (Tf === 100) w.push('It stops at 100 °C: the water is hot but has not started to boil.');
        return { ans: `The total heat is ${en(tot)}, which takes ${dur(tot / P)} at ${sg(P)} W.`, work: w };
      } },
    { id: 'time', label: 'Heating time (kettle or heater)', fields: [{ k: 'm', label: 'Mass m', def: '1.5', units: U.mass, gt: 0 }, cF(), tC('T1', 'Starting temperature', '20'), tC('T2', 'Final temperature', '100'), { k: 'P', label: 'Heater power P', def: '2000', units: [['W', 1], ['kW', 1000]], gt: 0 }, { k: 'e', label: 'Heater efficiency', def: '90', units: [['%', 1]], gt: 0, max: 100 }],
      tip: 'Power is energy per second, so time = energy ÷ power. If some heat is lost, the heater must supply more: divide by the efficiency.',
      solve: ({ m, c, T1, T2, P, e }) => {
        const Q = m * c * (T2 - T1); if (Q <= 0) return { err: 'The final temperature must be above the start for a heater to take time.' };
        const Ee = Q / (e / 100), t = Ee / P;
        return { ans: `It takes ${dur(t)} (${sg(t)} s).`, work: ['Q = m c ΔT', `Q = ${sg(m)} × ${sg(c)} × (${sg(T2)} − ${sgn(T1)}) = ${sg(Q)} J`, `Energy supplied = Q ÷ efficiency = ${sg(Q)} ÷ ${sg(e / 100)} = ${sg(Ee)} J`, 'time = energy ÷ P', `time = ${sg(Ee)} ÷ ${sg(P)} = ${sg(t)} s`] };
      } },
    { id: 'mix', label: 'Mixing two things: final temperature', fields: [{ k: 'm1', label: 'Mass of hot object m₁', def: '0.2', units: U.mass, gt: 0 }, cF('450', 'c1', 'Specific heat c₁'), tC('T1', 'Its temperature T₁', '100'), { k: 'm2', label: 'Mass of water m₂', def: '0.5', units: U.mass, gt: 0 }, cF('4200', 'c2', 'Specific heat c₂'), tC('T2', 'Its temperature T₂', '20')],
      tip: 'Heat lost by the hot one equals heat gained by the cold one, so T = (m₁c₁T₁ + m₂c₂T₂) ÷ (m₁c₁ + m₂c₂). The result is always between T₁ and T₂. This assumes no heat is lost to the cup.',
      solve: ({ m1, c1, T1, m2, c2, T2 }) => {
        const C1 = m1 * c1, C2 = m2 * c2, T = (C1 * T1 + C2 * T2) / (C1 + C2);
        return { ans: `The final temperature is ${sg(T)} °C.`, work: ['Heat lost = heat gained: m₁c₁(T₁ − T) = m₂c₂(T − T₂)', 'T = (m₁c₁T₁ + m₂c₂T₂) / (m₁c₁ + m₂c₂)', `T = (${sg(C1)} × ${sgn(T1)} + ${sg(C2)} × ${sgn(T2)}) ÷ (${sg(C1)} + ${sg(C2)})`, `T = ${sg(C1 * T1 + C2 * T2)} ÷ ${sg(C1 + C2)} = ${sg(T)} °C`] };
      } },
    { id: 'ice', label: 'Ice (at 0 °C) dropped into warm water', fields: [{ k: 'mw', label: 'Mass of water', def: '0.3', units: U.mass, gt: 0 }, tC('Tw', 'Water temperature', '40'), { k: 'mi', label: 'Mass of ice', def: '0.05', units: U.mass, gt: 0 }, cF('4200', 'c', 'Specific heat of water'), { k: 'L', label: 'Latent heat of melting', def: '334000', units: U.lat, gt: 0 }],
      tip: 'First check whether the water has enough heat to melt all the ice (m_w c T_w against m_i L). If not, the mixture ends at 0 °C with some ice left.',
      solve: ({ mw, Tw, mi, c, L }) => {
        if (Tw <= 0) return { err: 'The water must be warmer than 0 °C for the ice to melt.' };
        const avail = mw * c * Tw, need = mi * L;
        if (avail <= need) { const x = avail / L; return { ans: `Not all the ice melts: the final temperature is 0 °C, with ${sg(x * 1000)} g melted and ${sg((mi - x) * 1000)} g of ice left.`, work: [`Heat the water can give up cooling to 0 °C = ${sg(mw)} × ${sg(c)} × ${sg(Tw)} = ${sg(avail)} J`, `Heat to melt all the ice = ${sg(mi)} × ${sg(L)} = ${sg(need)} J`, `${sg(avail)} < ${sg(need)}, so only ${sg(x)} kg melts (${sg(avail)} ÷ ${sg(L)}).`] }; }
        const T = (avail - need) / ((mw + mi) * c);
        return { ans: `All the ice melts and the final temperature is ${sg(T)} °C.`, work: [`Water cooling to 0 °C could give ${sg(avail)} J; melting the ice takes ${sg(need)} J, so all of it melts.`, 'm_w c (T_w − T) = m_i L + m_i c T', `T = (m_w c T_w − m_i L) ÷ ((m_w + m_i) c)`, `T = (${sg(avail)} − ${sg(need)}) ÷ (${sg(mw + mi)} × ${sg(c)}) = ${sg(T)} °C`] };
      } },
    { id: 'cal', label: 'Specific heat of a metal (method of mixtures)', fields: [{ k: 'm1', label: 'Mass of hot metal', def: '0.1', units: U.mass, gt: 0 }, tC('T1', 'Metal temperature before', '100'), { k: 'm2', label: 'Mass of water', def: '0.2', units: U.mass, gt: 0 }, tC('T2', 'Water temperature before', '20'), tC('Tf', 'Final temperature of both', '25'), cF('4200', 'cw', 'Specific heat of water')],
      tip: 'The final temperature must be between the two starting ones. This ignores the heat taken by the calorimeter cup, so the answer is a little low if the cup is metal.',
      solve: ({ m1, T1, m2, T2, Tf, cw }) => {
        if (!(T1 > Tf && Tf > T2)) return { err: 'The final temperature must be between the water start and the metal start (metal hotter than final, final hotter than the cold water).' };
        const c1 = (m2 * cw * (Tf - T2)) / (m1 * (T1 - Tf));
        return { ans: `The specific heat of the metal is ${sg(c1)} J/(kg·K).`, work: ['Heat lost by metal = heat gained by water', 'm₁ c₁ (T₁ − T) = m₂ c_w (T − T₂)', 'c₁ = m₂ c_w (T − T₂) / (m₁ (T₁ − T))', `c₁ = ${sg(m2)} × ${sg(cw)} × ${sg(Tf - T2)} ÷ (${sg(m1)} × ${sg(T1 - Tf)}) = ${sg(c1)} J/(kg·K)`] };
      } },
  ],
  presets: [
    { label: 'Heat 2 kg water', prob: 'Q', v: { m: '2', c: '4200', T1: '20', T2: '70' }, u: { c: 'J/(kg·K)' } },
    { label: 'Ice to steam', prob: 'full', v: { m: '0.5', T0: '-20', Tf: '120', P: '1000' } },
    { label: 'Kettle', prob: 'time', v: { m: '1.5', c: '4200', T1: '20', T2: '100', P: '2000', e: '90' } },
    { label: 'Hot iron in water', prob: 'mix', v: { m1: '0.2', c1: '450', T1: '100', m2: '0.5', c2: '4200', T2: '20' } },
    { label: 'Ice in a drink', prob: 'ice', v: { mw: '0.3', Tw: '40', mi: '0.05', c: '4200', L: '334000' } },
    { label: 'Find c of a metal', prob: 'cal', v: { m1: '0.1', T1: '100', m2: '0.2', T2: '20', Tf: '25', cw: '4200' } },
  ],
};
