// #1333 Free-body diagram builder: six school set-ups (floor pull, slope, lift, two blocks pushed, block on a
// table pulled by a hanging block, Atwood machine). For each body: the forces on it and the acceleration.
// Plain maths, no DOM. SI units; g = 9.8 m/s². Directions in degrees anticlockwise from +x (right).
export const G = 9.8;
const RAD = Math.PI / 180;

export type ForceKey = 'weight' | 'normal' | 'friction' | 'tension' | 'applied' | 'contact';
export type Force = { key: ForceKey; mag: number; dir: number; label: string };
export type Body = { name: string; m: number; forces: Force[]; a: number; aDir: number };
export type Setup = 'floor' | 'slope' | 'lift' | 'push2' | 'table' | 'atwood';
export type Params = { m1: number; m2: number; F: number; angle: number; mu: number; liftA: number };
export type Solution = { bodies: Body[]; a: number; T?: number; N?: number; friction?: number; contact?: number; moving: boolean; note: string };

/** Solve a set-up: forces on each body, the acceleration (size, in the direction of motion) and the key forces. */
export function solve(s: Setup, p: Params, g = G): Solution {
  const W1 = p.m1 * g, W2 = p.m2 * g;
  if (s === 'floor') {
    // Pull with force F at angle above the horizontal; kinetic and static friction both μ.
    const Fx = p.F * Math.cos(p.angle * RAD), Fy = p.F * Math.sin(p.angle * RAD), N = Math.max(0, W1 - Fy);
    const lim = p.mu * N, moving = Fx > lim + 1e-12, fr = moving ? lim : Fx, a = moving ? (Fx - lim) / p.m1 : 0;
    const forces: Force[] = [{ key: 'weight', mag: W1, dir: 270, label: 'weight mg' }, { key: 'normal', mag: N, dir: 90, label: 'normal N' }, { key: 'applied', mag: p.F, dir: p.angle, label: 'pull F' }];
    if (fr > 1e-9) forces.push({ key: 'friction', mag: fr, dir: 180, label: 'friction' });
    return { bodies: [{ name: 'Block', m: p.m1, forces, a, aDir: 0 }], a, N, friction: fr, moving, note: W1 - Fy < 0 ? 'lifts off' : '' };
  }
  if (s === 'slope') {
    const th = p.angle * RAD, along = W1 * Math.sin(th), N = W1 * Math.cos(th), lim = p.mu * N, moving = along > lim + 1e-12;
    const fr = moving ? lim : along, a = moving ? (along - lim) / p.m1 : 0;
    const forces: Force[] = [{ key: 'weight', mag: W1, dir: 270, label: 'weight mg' }, { key: 'normal', mag: N, dir: 90 + p.angle, label: 'normal N' }];
    if (fr > 1e-9) forces.push({ key: 'friction', mag: fr, dir: p.angle, label: 'friction' });
    return { bodies: [{ name: 'Block', m: p.m1, forces, a, aDir: 180 + p.angle }], a, N, friction: fr, moving, note: '' };
  }
  if (s === 'lift') {
    // A person stands on scales in a lift accelerating at liftA (+ up).
    const N = p.m1 * (g + p.liftA);
    return { bodies: [{ name: 'Person', m: p.m1, forces: [{ key: 'weight', mag: W1, dir: 270, label: 'weight mg' }, { key: 'normal', mag: Math.max(0, N), dir: 90, label: 'scale push N' }], a: Math.abs(p.liftA), aDir: p.liftA >= 0 ? 90 : 270 }], a: Math.abs(p.liftA), N: Math.max(0, N), moving: p.liftA !== 0, note: N <= 0 ? 'weightless' : '' };
  }
  if (s === 'push2') {
    // Push F on block A, which pushes block B; smooth floor.
    const a = p.F / (p.m1 + p.m2), C = p.m2 * a;
    return {
      bodies: [
        { name: 'Block A', m: p.m1, a, aDir: 0, forces: [{ key: 'weight', mag: W1, dir: 270, label: 'weight' }, { key: 'normal', mag: W1, dir: 90, label: 'normal' }, { key: 'applied', mag: p.F, dir: 0, label: 'push F' }, { key: 'contact', mag: C, dir: 180, label: 'B pushes back' }] },
        { name: 'Block B', m: p.m2, a, aDir: 0, forces: [{ key: 'weight', mag: W2, dir: 270, label: 'weight' }, { key: 'normal', mag: W2, dir: 90, label: 'normal' }, { key: 'contact', mag: C, dir: 0, label: 'A pushes' }] },
      ], a, contact: C, moving: p.F > 0, note: '',
    };
  }
  if (s === 'table') {
    // Block A on a table (friction μ) tied over a smooth pulley to block B hanging.
    const lim = p.mu * W1, moving = W2 > lim + 1e-12, a = moving ? (W2 - lim) / (p.m1 + p.m2) : 0, T = W2 - p.m2 * a, fr = moving ? lim : W2;
    const fa: Force[] = [{ key: 'weight', mag: W1, dir: 270, label: 'weight' }, { key: 'normal', mag: W1, dir: 90, label: 'normal' }, { key: 'tension', mag: T, dir: 0, label: 'tension T' }];
    if (fr > 1e-9) fa.push({ key: 'friction', mag: fr, dir: 180, label: 'friction' });
    return { bodies: [{ name: 'Block A (table)', m: p.m1, a, aDir: 0, forces: fa }, { name: 'Block B (hanging)', m: p.m2, a, aDir: 270, forces: [{ key: 'weight', mag: W2, dir: 270, label: 'weight' }, { key: 'tension', mag: T, dir: 90, label: 'tension T' }] }], a, T, friction: fr, moving, note: '' };
  }
  // Atwood: A on the left, B on the right of a smooth, light pulley.
  const a = ((p.m2 - p.m1) * g) / (p.m1 + p.m2), T = (2 * p.m1 * p.m2 * g) / (p.m1 + p.m2);
  return { bodies: [{ name: 'Block A (left)', m: p.m1, a: Math.abs(a), aDir: a >= 0 ? 90 : 270, forces: [{ key: 'weight', mag: W1, dir: 270, label: 'weight' }, { key: 'tension', mag: T, dir: 90, label: 'tension T' }] }, { name: 'Block B (right)', m: p.m2, a: Math.abs(a), aDir: a >= 0 ? 270 : 90, forces: [{ key: 'weight', mag: W2, dir: 270, label: 'weight' }, { key: 'tension', mag: T, dir: 90, label: 'tension T' }] }], a: Math.abs(a), T, moving: p.m1 !== p.m2, note: '' };
}

/** Net force on a body from its forces (x, y). */
export function net(b: Body) {
  let x = 0, y = 0; for (const f of b.forces) { x += f.mag * Math.cos(f.dir * RAD); y += f.mag * Math.sin(f.dir * RAD); }
  return { x, y };
}

// ---- Check yourself ----------------------------------------------------------------------------------
export type Question = { text: string; ans: number; unit: string; work: string };
const pick = (rng: () => number, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));
const n = (x: number) => String(Math.round(x * 100) / 100).replace('-', '−');

export function questions(rng: () => number = Math.random): Question[] {
  const qs: Question[] = [];
  { const m1 = pick(rng, 1, 5), m2 = m1 + pick(rng, 1, 5), a = ((m2 - m1) * G) / (m1 + m2);
    qs.push({ text: `Masses of ${m1} kg and ${m2} kg hang on either side of a light, smooth pulley. What is their acceleration? (g = 9.8 m/s²)`, ans: a, unit: 'm/s²', work: `a = (m₂ − m₁)g ÷ (m₁ + m₂) = (${m2} − ${m1}) × 9.8 ÷ ${m1 + m2} = ${n(a)} m/s².` }); }
  { const m1 = pick(rng, 1, 5), m2 = m1 + pick(rng, 1, 5), T = (2 * m1 * m2 * G) / (m1 + m2);
    qs.push({ text: `In the same kind of machine with ${m1} kg and ${m2} kg, what is the tension in the string?`, ans: T, unit: 'N', work: `T = 2m₁m₂g ÷ (m₁ + m₂) = 2 × ${m1} × ${m2} × 9.8 ÷ ${m1 + m2} = ${n(T)} N. It lies between the two weights, ${n(m1 * G)} N and ${n(m2 * G)} N.` }); }
  { const m = pick(rng, 40, 80), a = pick(rng, 1, 3) * (rng() < 0.5 ? 1 : -1), N = m * (G + a);
    qs.push({ text: `A ${m} kg student stands on bathroom scales in a lift that is ${a > 0 ? 'speeding up going up' : 'speeding up going down'} at ${Math.abs(a)} m/s². What force does the scale push up with? (g = 9.8 m/s²)`, ans: N, unit: 'N', work: `N − mg = ma with a = ${a > 0 ? '+' : '−'}${Math.abs(a)} (up is +): N = m(g + a) = ${m} × ${n(G + a)} = ${n(N)} N.` }); }
  { const F = pick(rng, 6, 30), m1 = pick(rng, 1, 5), m2 = pick(rng, 1, 5), C = (m2 * F) / (m1 + m2);
    qs.push({ text: `On a smooth floor you push a ${m1} kg block with ${F} N, and it pushes a ${m2} kg block in front of it. How hard does the first block push the second?`, ans: C, unit: 'N', work: `Both move together: a = ${F} ÷ ${m1 + m2} = ${n(F / (m1 + m2))} m/s². The front block needs F = m₂a = ${m2} × ${n(F / (m1 + m2))} = ${n(C)} N.` }); }
  return qs;
}
