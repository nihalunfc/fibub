// Slope fields and first-order differential equations (Class 12 maths): ready-made equations with stories
// (growth and decay, cooling, a mixing tank, two linear equations solved by an integrating factor, two separable
// ones), their exact solutions through a chosen point with the working, and a fourth-order Runge-Kutta solver
// for any dy/dx = f(x, y). Plain TypeScript, no DOM.

export type Param = { key: string; label: string; min: number; max: number; step: number; value: number };
export type OdePreset = {
  id: string; name: string; eq: string; story: string;
  win: [number, number, number, number]; // x0, x1, y0, y1 of the picture
  xName: string; yName: string; start: [number, number];
  params: Param[];
  f: (x: number, y: number, p: Record<string, number>) => number;
  exact: (x: number, x0: number, y0: number, p: Record<string, number>) => number;
  work: (x0: number, y0: number, p: Record<string, number>) => { kind: 'separable' | 'linear'; steps: string[]; answer: string };
};

const n = (x: number, d = 4) => { const s = (Math.abs(x) < 1e-12 ? 0 : x).toFixed(d).replace(/\.?0+$/, ''); return (s === '-0' ? '0' : s).replace('-', '−'); };
const sg = (x: number, d = 4) => (x < 0 ? `− ${n(-x, d)}` : `+ ${n(x, d)}`);

export const ODE_PRESETS: OdePreset[] = [
  {
    id: 'growth', name: 'Growth and decay', eq: 'dy/dt = k y', xName: 't', yName: 'y',
    story: 'A population (or money, or a radioactive sample) changes at a rate proportional to its size. k > 0 grows, k < 0 decays. Made-up numbers.',
    win: [0, 6, 0, 12], start: [0, 2],
    params: [{ key: 'k', label: 'k (rate per unit time)', min: -1, max: 1, step: 0.05, value: 0.3 }],
    f: (x, y, p) => p.k * y,
    exact: (x, x0, y0, p) => y0 * Math.exp(p.k * (x - x0)),
    work: (x0, y0, p) => ({ kind: 'separable', steps: [
      `Separate the variables: dy / y = ${n(p.k)} dt.`,
      `Integrate both sides: ln|y| = ${n(p.k)} t + c.`,
      `So y = C e^(${n(p.k)} t), where C = ±eᶜ.`,
      `Through (${n(x0)}, ${n(y0)}): ${n(y0)} = C e^(${n(p.k * x0)}), so C = ${n(y0 * Math.exp(-p.k * x0))}.`,
    ], answer: `y = ${n(y0 * Math.exp(-p.k * x0))} e^(${n(p.k)} t)` }),
  },
  {
    id: 'cooling', name: "Newton's law of cooling", eq: 'dT/dt = −k (T − Tₛ)', xName: 't (min)', yName: 'T (°C)',
    story: 'A cup of tea cools in a room: it loses heat faster when it is much hotter than the room. Made-up numbers.',
    win: [0, 40, 0, 100], start: [0, 90],
    params: [{ key: 'k', label: 'k (per minute)', min: 0.01, max: 0.3, step: 0.01, value: 0.08 }, { key: 'Ts', label: 'Room temperature Tₛ (°C)', min: 0, max: 40, step: 1, value: 25 }],
    f: (x, y, p) => -p.k * (y - p.Ts),
    exact: (x, x0, y0, p) => p.Ts + (y0 - p.Ts) * Math.exp(-p.k * (x - x0)),
    work: (x0, y0, p) => ({ kind: 'separable', steps: [
      `Separate: dT / (T − ${n(p.Ts)}) = −${n(p.k)} dt.`,
      `Integrate: ln|T − ${n(p.Ts)}| = −${n(p.k)} t + c.`,
      `So T = ${n(p.Ts)} + C e^(−${n(p.k)} t).`,
      `Through (${n(x0)}, ${n(y0)}): C = (${n(y0)} − ${n(p.Ts)}) e^(${n(p.k * x0)}) = ${n((y0 - p.Ts) * Math.exp(p.k * x0))}.`,
    ], answer: `T = ${n(p.Ts)} ${sg((y0 - p.Ts) * Math.exp(p.k * x0))} e^(−${n(p.k)} t)` }),
  },
  {
    id: 'tank', name: 'Mixing tank', eq: 'dy/dt = r c − (r/V) y', xName: 't (min)', yName: 'salt (g)',
    story: 'Salty water (c grams per litre) flows into a well-stirred tank of V litres at r litres a minute, and the mixture flows out at the same rate. y is the salt in the tank. Made-up numbers.',
    win: [0, 120, 0, 120], start: [0, 0],
    params: [{ key: 'r', label: 'Flow r (L/min)', min: 0.5, max: 5, step: 0.5, value: 2 }, { key: 'c', label: 'Inflow c (g/L)', min: 0, max: 2, step: 0.1, value: 1 }, { key: 'V', label: 'Tank V (L)', min: 20, max: 200, step: 10, value: 100 }],
    f: (x, y, p) => p.r * p.c - (p.r / p.V) * y,
    exact: (x, x0, y0, p) => p.c * p.V + (y0 - p.c * p.V) * Math.exp(-(p.r / p.V) * (x - x0)),
    work: (x0, y0, p) => { const b = p.r / p.V, a = p.r * p.c, C = (y0 - a / b) * Math.exp(b * x0); return { kind: 'linear', steps: [
      `Write it as dy/dt + ${n(b)} y = ${n(a)}: linear, with P = ${n(b)} and Q = ${n(a)}.`,
      `Integrating factor: e^(∫P dt) = e^(${n(b)} t).`,
      `Multiply through: d/dt [y e^(${n(b)} t)] = ${n(a)} e^(${n(b)} t).`,
      `Integrate: y e^(${n(b)} t) = ${n(a / b)} e^(${n(b)} t) + C, so y = ${n(a / b)} + C e^(−${n(b)} t).`,
      `Through (${n(x0)}, ${n(y0)}): C = ${n(C)}. In the long run y → ${n(a / b)} g, that is c × V.`,
    ], answer: `y = ${n(a / b)} ${sg(C)} e^(−${n(b)} t)` }; },
  },
  {
    id: 'lin1', name: 'Linear: dy/dx = x + y', eq: 'dy/dx = x + y', xName: 'x', yName: 'y',
    story: 'A linear equation that is not separable: solve it with an integrating factor.',
    win: [-3, 3, -4, 4], start: [0, 0],
    params: [],
    f: (x, y) => x + y,
    exact: (x, x0, y0) => -x - 1 + (y0 + x0 + 1) * Math.exp(x - x0),
    work: (x0, y0) => { const C = (y0 + x0 + 1) * Math.exp(-x0); return { kind: 'linear', steps: [
      'Write it as dy/dx − y = x: P = −1, Q = x.',
      'Integrating factor: e^(∫−1 dx) = e^(−x).',
      'Multiply through: d/dx [y e^(−x)] = x e^(−x).',
      'Integrate by parts: ∫x e^(−x) dx = −x e^(−x) − e^(−x) + C.',
      'So y = −x − 1 + C eˣ.',
      `Through (${n(x0)}, ${n(y0)}): C = (${n(y0)} + ${n(x0)} + 1) e^(${n(-x0)}) = ${n(C)}.`,
    ], answer: `y = −x − 1 ${sg(C)} eˣ` }; },
  },
  {
    id: 'lin2', name: 'Linear: dy/dx + y/x = x²', eq: 'dy/dx = x² − y/x', xName: 'x', yName: 'y',
    story: 'A linear equation with a variable P(x) = 1/x, for x > 0.',
    win: [0.1, 3, -4, 6], start: [1, 1],
    params: [],
    f: (x, y) => x * x - y / x,
    exact: (x, x0, y0) => (x <= 0 ? NaN : x ** 3 / 4 + (x0 * y0 - x0 ** 4 / 4) / x),
    work: (x0, y0) => { const C = x0 * y0 - x0 ** 4 / 4; return { kind: 'linear', steps: [
      'P = 1/x, Q = x².',
      'Integrating factor: e^(∫dx/x) = e^(ln x) = x (x > 0).',
      'Multiply through: d/dx [x y] = x³.',
      'Integrate: x y = x⁴/4 + C, so y = x³/4 + C/x.',
      `Through (${n(x0)}, ${n(y0)}): C = ${n(x0)} × ${n(y0)} − ${n(x0)}⁴/4 = ${n(C)}.`,
    ], answer: `y = x³/4 ${sg(C)}/x` }; },
  },
  {
    id: 'circ', name: 'Separable: dy/dx = −x/y', eq: 'dy/dx = −x/y', xName: 'x', yName: 'y',
    story: 'Every solution is part of a circle round the origin.',
    win: [-4, 4, -4, 4], start: [0, 2],
    params: [],
    f: (x, y) => -x / y,
    exact: (x, x0, y0) => { const r2 = x0 * x0 + y0 * y0 - x * x; return r2 < 0 ? NaN : Math.sign(y0) * Math.sqrt(r2); },
    work: (x0, y0) => ({ kind: 'separable', steps: [
      'Separate: y dy = −x dx.',
      'Integrate: y²/2 = −x²/2 + c.',
      'So x² + y² = C: circles round the origin.',
      `Through (${n(x0)}, ${n(y0)}): C = ${n(x0 * x0 + y0 * y0)}, a circle of radius ${n(Math.hypot(x0, y0))}. The solution is the ${y0 >= 0 ? 'upper' : 'lower'} half, and it stops where y = 0 (the slope is undefined there).`,
    ], answer: `x² + y² = ${n(x0 * x0 + y0 * y0)}` }),
  },
  {
    id: 'xy', name: 'Separable: dy/dx = x y', eq: 'dy/dx = x y', xName: 'x', yName: 'y',
    story: 'Separable, with a bell-shaped family of solutions.',
    win: [-3, 3, -4, 4], start: [0, 0.5],
    params: [],
    f: (x, y) => x * y,
    exact: (x, x0, y0) => y0 * Math.exp((x * x - x0 * x0) / 2),
    work: (x0, y0) => ({ kind: 'separable', steps: [
      'Separate: dy / y = x dx.',
      'Integrate: ln|y| = x²/2 + c.',
      'So y = C e^(x²/2).',
      `Through (${n(x0)}, ${n(y0)}): C = ${n(y0)} e^(${n(-x0 * x0 / 2)}) = ${n(y0 * Math.exp(-x0 * x0 / 2))}.`,
    ], answer: `y = ${n(y0 * Math.exp(-x0 * x0 / 2))} e^(x²/2)` }),
  },
];

export const paramsOf = (p: OdePreset) => Object.fromEntries(p.params.map((q) => [q.key, q.value]));

/** One RK4 step. */
export function rk4(f: (x: number, y: number) => number, x: number, y: number, h: number): number {
  const k1 = f(x, y), k2 = f(x + h / 2, y + (h / 2) * k1), k3 = f(x + h / 2, y + (h / 2) * k2), k4 = f(x + h, y + h * k3);
  return y + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
}

/**
 * The solution curve through (x0, y0), traced with RK4 both ways until it leaves the box [x0..x1] × [y0..y1]
 * (with some room), blows up or meets a point where the slope is undefined.
 */
export function trace(f: (x: number, y: number) => number, x0: number, y0: number, box: [number, number, number, number], steps = 600): [number, number][] {
  const [a, b, c, d] = box, h = (b - a) / steps, ry = (d - c) * 2;
  const run = (dir: number) => {
    const pts: [number, number][] = [];
    let x = x0, y = y0;
    for (let i = 0; i < steps * 2; i++) {
      const s = f(x, y);
      if (!Number.isFinite(s)) break;
      const yn = rk4(f, x, y, dir * h), s2 = f(x + dir * h, yn), tall = 0.05 * (d - c);
      // stop where the curve turns (nearly) vertical: the slope is undefined there and steps would jump across
      if (!Number.isFinite(yn) || !Number.isFinite(s2) || Math.abs(s) * h > tall || Math.abs(s2) * h > tall || Math.abs(s2 - s) * h > tall || Math.abs(yn - y) > ry) break;
      x += dir * h; y = yn;
      if (x < a - h || x > b + h || y < c - ry || y > d + ry) { pts.push([x, y]); break; }
      pts.push([x, y]);
    }
    return pts;
  };
  return [...run(-1).reverse(), [x0, y0], ...run(1)];
}

/** RK4 from x0 to x1 in n equal steps. */
export function solveTo(f: (x: number, y: number) => number, x0: number, y0: number, x1: number, n = 1000): number {
  let x = x0, y = y0; const h = (x1 - x0) / n;
  for (let i = 0; i < n; i++) { y = rk4(f, x, y, h); x += h; }
  return y;
}
