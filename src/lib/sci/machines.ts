// Simple machines for the school simple-machines tool: levers (three classes), pulley systems with 1 to 4
// supporting strands, the inclined plane and the wheel and axle. Mechanical advantage MA = load ÷ effort,
// velocity ratio VR = effort distance ÷ load distance, efficiency = MA ÷ VR. Plain TypeScript, no DOM.

export const G = 9.8; // m/s², rounded school value

export type Machine = { effort: number; ma: number; vr: number; eff: number; idealEffort: number };
const out = (load: number, effort: number, vr: number, idealEffort: number): Machine => ({ effort, ma: load / effort, vr, eff: load / effort / vr, idealEffort });

/**
 * Lever: load (N) at distance loadArm (m) from the fulcrum, effort at effortArm. Class 1, 2 and 3 differ
 * only in where things sit (fulcrum, load or effort in the middle); the moments rule is the same.
 * eff is the fraction of the work that is not lost to friction at the pivot (1 = ideal).
 */
export function lever(load: number, loadArm: number, effortArm: number, eff = 1): Machine {
  const vr = effortArm / loadArm, ideal = load / vr;
  return out(load, ideal / eff, vr, ideal);
}

/** The class of a lever from the positions (m along the beam) of fulcrum, load and effort. */
export function leverClass(fulcrum: number, loadAt: number, effortAt: number): 1 | 2 | 3 {
  const between = (a: number, b: number, c: number) => (a - b) * (a - c) < 0;
  if (between(fulcrum, loadAt, effortAt)) return 1;
  if (between(loadAt, fulcrum, effortAt)) return 2;
  return 3;
}

/**
 * Pulley system with n supporting strands (1 = a single fixed pulley; 2 to 4 = blocks with moving
 * pulleys). blockWeight (N) is the weight of the moving pulleys, lifted with the load; friction is the
 * fraction of the effort lost in the pulleys.
 */
export function pulleys(load: number, n: number, blockWeight = 0, friction = 0): Machine {
  const moving = n === 1 ? 0 : blockWeight, ideal = load / n;
  const effort = (load + moving) / n / (1 - friction);
  return out(load, effort, n, ideal);
}

/** Inclined plane of length L (m) and height h (m), pushing the load along the slope with friction μ. */
export function incline(load: number, L: number, h: number, mu = 0): Machine {
  const s = h / L, c = Math.sqrt(Math.max(0, 1 - s * s)), vr = L / h;
  return out(load, load * (s + mu * c), vr, load * s);
}

/** Wheel and axle: effort on the rim of radius R, load on the axle of radius r. */
export function wheelAxle(load: number, R: number, r: number, eff = 1): Machine {
  const vr = R / r, ideal = load / vr;
  return out(load, ideal / eff, vr, ideal);
}

// ---- Check yourself ----------------------------------------------------------------------------------
export type Question = { text: string; ans: number; unit: string; work: string };
const pick = (rng: () => number, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));
const n = (x: number) => String(Math.round(x * 100) / 100).replace('-', '−');

export function questions(rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  { const W = pick(rng, 2, 20) * 50, a = pick(rng, 1, 4) * 0.25, b = a * pick(rng, 2, 6), E = (W * a) / b;
    qs.push({ text: `A crowbar lifts a ${W} N rock. The rock is ${n(a)} m from the pivot and you push ${n(b)} m from the pivot. What effort is needed (no friction)?`, ans: E, unit: 'N', work: `Moments balance: effort × ${n(b)} = ${W} × ${n(a)}, so effort = ${n(W * a)} ÷ ${n(b)} = ${n(E)} N.` }); }
  { const k = pick(rng, 2, 4), W = pick(rng, 4, 30) * 20, E = W / k;
    qs.push({ text: `A pulley block has ${k} rope strands holding up a ${W} N load. Ignoring friction and the pulleys' weight, what effort lifts it?`, ans: E, unit: 'N', work: `Each strand carries an equal share: effort = ${W} ÷ ${k} = ${n(E)} N. You pull ${k} m of rope for every 1 m the load rises (VR = ${k}).` }); }
  { const L = pick(rng, 3, 10), h = pick(rng, 1, L - 1), vr = L / h;
    qs.push({ text: `A ramp is ${L} m long and rises ${h} m. What is its velocity ratio?`, ans: vr, unit: '', work: `VR = distance moved by the effort ÷ distance the load rises = ${L} ÷ ${h} = ${n(vr)}.` }); }
  { const W = pick(rng, 4, 20) * 50, E = pick(rng, 3, 10) * 25, vr = pick(rng, 4, 8), ma = W / E, eff = (ma / vr) * 100;
    if (eff >= 100 || eff < 20) return questions(rng);
    qs.push({ text: `A machine lifts ${W} N with an effort of ${E} N. Its velocity ratio is ${vr}. What is its efficiency in percent?`, ans: eff, unit: '%', work: `MA = load ÷ effort = ${W} ÷ ${E} = ${n(ma)}. Efficiency = MA ÷ VR × 100 = ${n(ma)} ÷ ${vr} × 100 = ${n(eff)} %.` }); }
  return qs;
}
