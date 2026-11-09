// Cardiac cycle (school biology): the timing of one heartbeat, valve states, left ventricle volume, a
// teaching ECG-like trace and cardiac output. Plain maths, no DOM. A teaching model: shapes are smooth
// made-up curves, not a medical ECG, and the numbers are typical round resting values.

export type Phase = 'atrial-systole' | 'isovolumetric-contraction' | 'ejection' | 'isovolumetric-relaxation' | 'filling';
export const PHASE_NAMES: Record<Phase, string> = {
  'atrial-systole': 'Atria contract', 'isovolumetric-contraction': 'Ventricles tighten (all valves shut)', ejection: 'Ventricles push blood out',
  'isovolumetric-relaxation': 'Ventricles relax (all valves shut)', filling: 'Heart fills (joint diastole)',
};

/** Durations (s) at a heart rate (beats/min). At 75 /min: atrial systole 0.1 s, ventricular systole 0.3 s, joint
 *  diastole 0.4 s. Systole shortens only with the square root of the cycle (as QT does); diastole takes the rest. */
export function timing(hr: number) {
  const T = 60 / hr, k = Math.sqrt(T / 0.8);
  const atrial = 0.1 * k, vSys = 0.3 * k, iso = 0.05 * k, relax = 0.06 * k;
  return { T, atrial, vSys, iso, eject: vSys - iso, relax, diastole: T - atrial - vSys, k };
}

/** Phase at time t (s) after the start of atrial systole. */
export function phaseAt(hr: number, t: number): Phase {
  const d = timing(hr), x = ((t % d.T) + d.T) % d.T;
  if (x < d.atrial) return 'atrial-systole';
  if (x < d.atrial + d.iso) return 'isovolumetric-contraction';
  if (x < d.atrial + d.vSys) return 'ejection';
  if (x < d.atrial + d.vSys + d.relax) return 'isovolumetric-relaxation';
  return 'filling';
}
/** Which valves are open: AV (tricuspid and bicuspid/mitral) and semilunar (pulmonary and aortic). */
export function valves(p: Phase) {
  return { av: p === 'atrial-systole' || p === 'filling', semilunar: p === 'ejection' };
}

const smooth = (u: number) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
/** Left ventricle volume (mL) at time t, for end-diastolic volume edv and end-systolic volume esv. */
export function lvVolume(hr: number, t: number, edv: number, esv: number): number {
  const d = timing(hr), x = ((t % d.T) + d.T) % d.T, sv = edv - esv;
  const kick = 0.2 * sv; // the atria top up the last fifth of the filling
  const preAtrial = edv - kick;
  if (x < d.atrial) return preAtrial + kick * smooth(x / d.atrial);
  if (x < d.atrial + d.iso) return edv;
  if (x < d.atrial + d.vSys) return edv - sv * smooth((x - d.atrial - d.iso) / d.eject);
  if (x < d.atrial + d.vSys + d.relax) return esv;
  const fill = d.T - (d.atrial + d.vSys + d.relax);
  const u = (x - d.atrial - d.vSys - d.relax) / fill;
  return esv + (preAtrial - esv) * (1 - Math.exp(-4 * u)) / (1 - Math.exp(-4)); // fast early filling, then slow
}

/** Teaching ECG-like trace (mV-ish units): P wave in atrial systole, QRS as the ventricles start, T near the end. */
export function ecg(hr: number, t: number): number {
  const d = timing(hr), x = ((t % d.T) + d.T) % d.T;
  const g = (c: number, w: number, a: number) => a * Math.exp(-(((x - c) / w) ** 2));
  const g2 = (c: number, w: number, a: number) => a * Math.exp(-(((x - c - d.T) / w) ** 2)) + g(c, w, a);
  const q = d.atrial + 0.005, tEnd = d.atrial + d.vSys - 0.05 * d.k;
  return g2(0.04 * d.k, 0.022 * d.k, 0.15) + g2(q - 0.012, 0.007, -0.12) + g2(q, 0.01, 1.1) + g2(q + 0.014, 0.008, -0.25) + g2(tEnd, 0.04 * d.k, 0.3);
}

/** Heart sounds: "lub" as the AV valves shut (start of ventricular systole), "dub" as the semilunar valves shut. */
export function sounds(hr: number) { const d = timing(hr); return { lub: d.atrial, dub: d.atrial + d.vSys }; }

export const strokeVolume = (edv: number, esv: number) => edv - esv;
/** Cardiac output in L/min = stroke volume (mL) × heart rate (/min) ÷ 1000. */
export const cardiacOutput = (sv: number, hr: number) => (sv * hr) / 1000;
export const ejectionFraction = (edv: number, esv: number) => (edv - esv) / edv;
/** Heart rate from the time between two R peaks (s). */
export const rateFromRR = (rr: number) => 60 / rr;
