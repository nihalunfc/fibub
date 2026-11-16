// "Solve my numbers" for series LCR circuits on AC: reactances, impedance, current, phase angle, power factor, resonant
// frequency with Q, and the capacitor or coil needed to tune to a frequency. rms values throughout. No DOM.
import { eng, sf, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';

const HENRY: [string, number][] = [['H', 1], ['mH', 1e-3], ['µH', 1e-6]];
const FARAD: [string, number][] = [['µF', 1e-6], ['nF', 1e-9], ['pF', 1e-12], ['mF', 1e-3], ['F', 1]];
const HZ: [string, number][] = [['Hz', 1], ['kHz', 1e3], ['MHz', 1e6]];
const conv = (i: SIn | undefined, base: string, what: string) => (i && !i.blank && i.u !== base && i.typed !== i.v ? [`Convert ${what}: ${sf(i.typed)} ${i.u} = ${sf(i.v, 4)} ${base}`] : []);
const NAMES: Record<string, string> = { R: 'The resistance', L: 'The inductance', C: 'The capacitance', f: 'The frequency', V: 'The supply voltage', f0: 'The frequency' };
const p = (x: number, n = 3) => { const t = sf(x, n); return t.includes('×') ? `(${t})` : t; };
const has = (x: SIn | undefined) => !!x && !x.blank;

export function lcr(i: Record<string, SIn>, find: string): SOut {
  const lines: string[] = [];
  for (const k of ['R', 'L', 'C', 'f', 'V', 'f0']) { const x = i[k]; if (has(x) && !(x.v > 0) && !(k === 'R' && x.v === 0)) return { error: `${NAMES[k]} must be above zero.` }; }
  const w = (f: number) => 2 * Math.PI * f;
  if (find === 'Z') {
    const R = i.R.v, f = i.f.v, L = has(i.L) ? i.L.v : 0, C = has(i.C) ? i.C.v : Infinity, V = has(i.V) ? i.V.v : NaN;
    const XL = w(f) * L, XC = Number.isFinite(C) ? 1 / (w(f) * C) : 0, X = XL - XC, Z = Math.hypot(R, X);
    if (Z === 0) return { error: 'The impedance works out to 0 Ω (no resistance and the reactances cancel). Add some resistance to find the current.' };
    const phi = Math.atan2(X, R) * 180 / Math.PI, pf = R / Z;
    lines.push(...conv(i.L, 'H', 'the inductance'), ...conv(i.C, 'F', 'the capacitance'), ...conv(i.f, 'Hz', 'the frequency'));
    lines.push(has(i.L) ? `Inductive reactance: X_L = 2π f L = 2π × ${p(f)} × ${p(L)} = ${sf(XL)} Ω` : 'No inductor, so X_L = 0');
    lines.push(Number.isFinite(C) ? `Capacitive reactance: X_C = 1 / (2π f C) = 1 / (2π × ${p(f)} × ${p(C)}) = ${sf(XC)} Ω` : 'No capacitor, so X_C = 0');
    lines.push(`Impedance: Z = √(R² + (X_L − X_C)²) = √(${sf(R)}² + (${sf(XL)} − ${sf(XC)})²) = ${sf(Z)} Ω`);
    lines.push(`Phase angle: tan φ = (X_L − X_C) / R, so φ = ${sf(phi, 3)}° (${X > 0 ? 'positive: voltage leads current, the circuit is inductive' : X < 0 ? 'negative: current leads voltage, the circuit is capacitive' : 'zero: voltage and current are in step'}). Power factor cos φ = R / Z = ${sf(pf, 3)}`);
    let ans = `The impedance is ${eng(Z, 'Ω')}, the phase angle is ${sf(phi, 3)}° (${X > 0 ? 'inductive' : X < 0 ? 'capacitive' : 'voltage and current in step'}) and the power factor is ${sf(pf, 3)}.`;
    if (Number.isFinite(V)) {
      const I = V / Z, P = V * I * pf;
      lines.push(`Current: I = V / Z = ${sf(V)} ÷ ${sf(Z)} = ${eng(I, 'A')} (rms)`, `Average power: P = V I cos φ = ${sf(V)} × ${sf(I)} × ${sf(pf, 3)} = ${eng(P, 'W')} (also I² R = ${sf(I)}² × ${sf(R)})`,
        `Voltages: V_R = I R = ${sf(I * R)} V, V_L = I X_L = ${sf(I * XL)} V, V_C = I X_C = ${sf(I * XC)} V`);
      ans = `The impedance is ${eng(Z, 'Ω')}, the current is ${eng(I, 'A')} rms, and the phase angle is ${sf(phi, 3)}° (${X > 0 ? 'voltage leads' : X < 0 ? 'current leads' : 'in step'}). Power used: ${eng(P, 'W')}.`;
    }
    return { answer: ans, lines, tip: 'Common mistake: adding R, X_L and X_C directly. They are at right angles, so use Z = √(R² + X²) with X = X_L − X_C. Also convert mH and µF to H and F first.' };
  }
  if (find === 'XL' || find === 'XC') {
    const f = i.f.v;
    if (find === 'XL') { const X = w(f) * i.L.v; lines.push(...conv(i.L, 'H', 'the inductance'), ...conv(i.f, 'Hz', 'the frequency'), 'X_L = 2π f L', `X_L = 2π × ${p(f)} × ${p(i.L.v)} = ${sf(X)} Ω`); return { answer: `The inductive reactance is ${eng(X, 'Ω')}.`, lines, tip: 'A coil opposes AC more at higher frequency: X_L grows with f. For DC (f = 0) it is zero.' }; }
    const X = 1 / (w(f) * i.C.v); lines.push(...conv(i.C, 'F', 'the capacitance'), ...conv(i.f, 'Hz', 'the frequency'), 'X_C = 1 / (2π f C)', `X_C = 1 / (2π × ${p(f)} × ${p(i.C.v)}) = ${sf(X)} Ω`);
    return { answer: `The capacitive reactance is ${eng(X, 'Ω')}.`, lines, tip: 'A capacitor blocks low frequencies: X_C falls as f or C grows. Common mistake: leaving C in µF.' };
  }
  if (find === 'f0') {
    const L = i.L.v, C = i.C.v, f0 = 1 / (2 * Math.PI * Math.sqrt(L * C));
    lines.push(...conv(i.L, 'H', 'the inductance'), ...conv(i.C, 'F', 'the capacitance'), 'At resonance X_L = X_C, which gives f₀ = 1 / (2π √(L C))', `f₀ = 1 / (2π × √(${p(L)} × ${p(C)})) = ${sf(f0)} Hz`);
    let ans = `The resonant frequency is ${eng(f0, 'Hz')}.`;
    if (has(i.R)) {
      const R = i.R.v, Q = Math.sqrt(L / C) / R, bw = f0 / Q;
      lines.push(`At resonance Z = R = ${sf(R)} Ω and the current is largest, I = V / R, in step with the voltage`, `Quality factor: Q = (1/R) √(L/C) = (1 / ${p(R)}) × √(${p(L)} ÷ ${p(C)}) = ${sf(Q)}`, `Bandwidth: Δf = f₀ / Q = ${sf(f0)} ÷ ${sf(Q)} = ${eng(bw, 'Hz')}`);
      ans += ` With R = ${sf(R)} Ω, Q is ${sf(Q)} and the bandwidth ${eng(bw, 'Hz')}.`;
    }
    return { answer: ans, lines, tip: 'Resonance does not depend on R. R only sets how tall and narrow the peak is (the Q factor).' };
  }
  const f = i.f0.v;
  if (find === 'Cres') {
    const L = i.L.v, C = 1 / (4 * Math.PI ** 2 * f * f * L);
    lines.push(...conv(i.L, 'H', 'the inductance'), ...conv(i.f0, 'Hz', 'the frequency'), 'From f₀ = 1 / (2π √(L C)): C = 1 / (4π² f₀² L)', `C = 1 / (4π² × ${p(f)}² × ${p(L)}) = ${sf(C)} F = ${eng(C, 'F')}`);
    return { answer: `You need a capacitor of ${eng(C, 'F')} to resonate at ${eng(f, 'Hz')}.`, lines, tip: 'Squaring f₀ is the step people forget: C is proportional to 1/f₀². Doubling the frequency needs a quarter of the capacitance.' };
  }
  const C = i.C.v, L = 1 / (4 * Math.PI ** 2 * f * f * C);
  lines.push(...conv(i.C, 'F', 'the capacitance'), ...conv(i.f0, 'Hz', 'the frequency'), 'From f₀ = 1 / (2π √(L C)): L = 1 / (4π² f₀² C)', `L = 1 / (4π² × ${p(f)}² × ${p(C)}) = ${sf(L)} H = ${eng(L, 'H')}`);
  return { answer: `You need an inductor of ${eng(L, 'H')} to resonate at ${eng(f, 'Hz')}.`, lines, tip: 'Square f₀ before dividing. Doubling the frequency needs a quarter of the inductance.' };
}

export const LCR_SPEC: SSpec = {
  id: 'lcr',
  finds: [['Z', 'Impedance, current and phase'], ['f0', 'Resonant frequency and Q'], ['XL', 'Reactance of a coil'], ['XC', 'Reactance of a capacitor'], ['Cres', 'Capacitor to tune to a frequency'], ['Lres', 'Inductor to tune to a frequency']],
  fields: [
    { k: 'R', label: 'Resistance R', units: [['Ω', 1], ['kΩ', 1e3]], show: (c) => c.find === 'Z', ph: 'e.g. 20' },
    { k: 'R2', label: 'Resistance R (optional, for Q)', units: [['Ω', 1], ['kΩ', 1e3]], optional: true, show: (c) => c.find === 'f0', ph: 'optional' },
    { k: 'L', label: 'Inductance L', units: HENRY, optional: true, show: (c) => c.find === 'Z', ph: 'blank = no coil' },
    { k: 'L2', label: 'Inductance L', units: HENRY, show: (c) => c.find === 'f0' || c.find === 'XL' || c.find === 'Cres', ph: 'e.g. 100' },
    { k: 'C', label: 'Capacitance C', units: FARAD, optional: true, show: (c) => c.find === 'Z', ph: 'blank = no capacitor' },
    { k: 'C2', label: 'Capacitance C', units: FARAD, show: (c) => c.find === 'f0' || c.find === 'XC' || c.find === 'Lres', ph: 'e.g. 10' },
    { k: 'f', label: 'Frequency f', units: HZ, show: (c) => c.find === 'Z' || c.find === 'XL' || c.find === 'XC', ph: 'e.g. 50' },
    { k: 'f0', label: 'Frequency to tune to', units: HZ, show: (c) => c.find === 'Cres' || c.find === 'Lres', ph: 'e.g. 1' },
    { k: 'V', label: 'Supply voltage, rms (optional)', units: [['V', 1], ['mV', 1e-3], ['kV', 1e3]], optional: true, show: (c) => c.find === 'Z', ph: 'optional' },
  ],
  presets: [
    { name: 'R = 20 Ω, L = 100 mH, C = 10 µF at 50 Hz on 10 V', find: 'Z', vals: { R: '20', L: ['100', 'mH'], C: ['10', 'µF'], f: '50', V: '10' } },
    { name: 'A coil and resistor only (R = 40 Ω, L = 0.2 H) at 50 Hz, 230 V', find: 'Z', vals: { R: '40', L: '0.2', f: '50', V: '230' } },
    { name: 'Resonance of 200 mH and 5 µF with R = 10 Ω', find: 'f0', vals: { L2: ['200', 'mH'], C2: ['5', 'µF'], R2: '10' } },
    { name: 'Reactance of a 22 µF capacitor at 50 Hz', find: 'XC', vals: { C2: ['22', 'µF'], f: '50' } },
    { name: 'Capacitor to tune a 250 µH coil to 1 MHz', find: 'Cres', vals: { L2: ['250', 'µH'], f0: ['1', 'MHz'] } },
  ],
  solve: (i, c) => lcr({ ...i, R: i.R2 && c.find === 'f0' ? i.R2 : i.R, L: c.find === 'Z' ? i.L : i.L2, C: c.find === 'Z' ? i.C : i.C2 }, c.find),
};
