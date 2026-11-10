// Capacitor networks (school level): reduce series and parallel groups step by step to one equivalent
// capacitance, then share the battery's charge and voltage back out to each capacitor. Capacitances in µF,
// voltages in V, charges in µC, energies in µJ. No DOM.
import { pick, type Question } from './elec-quiz.ts';
import { n3 } from './em-p34.ts';

export type Net = { kind: 'C'; id: number; c: number } | { kind: 'S' | 'P'; kids: Net[]; gid?: number };

export function ceq(n: Net): number {
  if (n.kind === 'C') return n.c;
  if (n.kind === 'P') return n.kids.reduce((s, k) => s + ceq(k), 0);
  return 1 / n.kids.reduce((s, k) => s + 1 / ceq(k), 0);
}

/** All capacitor ids inside a part of the network. */
export const leaves = (n: Net): number[] => (n.kind === 'C' ? [n.id] : n.kids.flatMap(leaves));
const sub = (s: string) => s.replace(/\d/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[+d]);
export const label = (n: Net) => `C${sub(leaves(n).join(''))}`;
const fmt = (x: number) => n3(x);

/** Number the groups in the order they are reduced (innermost first) and describe each step. */
export function steps(root: Net) {
  const out: { gid: number; text: string; value: number }[] = [];
  const walk = (n: Net) => {
    if (n.kind === 'C') return;
    n.kids.forEach(walk);
    const parts = n.kids.map((k) => ({ name: label(k), v: ceq(k) })), v = ceq(n);
    n.gid = out.length;
    const text = n.kind === 'P'
      ? `${parts.map((p) => p.name).join(' and ')} are in parallel (same voltage), so the capacitances add: ${parts.map((p) => fmt(p.v)).join(' + ')} = ${fmt(v)} µF. Call it ${label(n)}.`
      : `${parts.map((p) => p.name).join(' and ')} are in series (same charge), so 1/C = ${parts.map((p) => `1/${fmt(p.v)}`).join(' + ')}, giving ${fmt(v)} µF. Call it ${label(n)}.`;
    out.push({ gid: n.gid, text, value: v });
  };
  walk(root);
  return out;
}

/** Charge (µC), voltage (V) and energy (µJ) on every capacitor when the network sits across V volts. */
export function share(root: Net, V: number) {
  const res: Record<number, { c: number; Q: number; V: number; U: number }> = {};
  const go = (n: Net, v: number) => {
    if (n.kind === 'C') { res[n.id] = { c: n.c, Q: n.c * v, V: v, U: 0.5 * n.c * v * v }; return; }
    if (n.kind === 'P') { for (const k of n.kids) go(k, v); return; }
    const Q = ceq(n) * v; // series: the same charge on each part
    for (const k of n.kids) go(k, Q / ceq(k));
  };
  go(root, V);
  return res;
}

export function questions(rng: () => number = Math.random): Question[] {
  const a = pick(rng, [2, 3, 4, 6]), b = pick(rng, [3, 6, 12]), s = (a * b) / (a + b);
  const p1 = pick(rng, [1, 2, 5]), p2 = pick(rng, [3, 4]), p3 = pick(rng, [6, 10]);
  const C = pick(rng, [2, 5, 10]), V = pick(rng, [6, 9, 12, 24]);
  const c1 = pick(rng, [2, 4]), c2 = pick(rng, [6, 12]), V2 = pick(rng, [10, 12, 30]), Q2 = ((c1 * c2) / (c1 + c2)) * V2;
  return [
    { text: `What is the total capacitance of ${a} µF and ${b} µF in series, in µF?`, answer: s, unit: 'µF', tol: 0.02,
      steps: ['In series: 1/C = 1/C₁ + 1/C₂, or C = C₁C₂/(C₁ + C₂) for two.', `C = ${a} × ${b} / (${a} + ${b}) = ${fmt(s)} µF`] },
    { text: `What is the total capacitance of ${p1} µF, ${p2} µF and ${p3} µF in parallel, in µF?`, answer: p1 + p2 + p3, unit: 'µF', tol: 0.02,
      steps: ['In parallel the capacitances add.', `C = ${p1} + ${p2} + ${p3} = ${p1 + p2 + p3} µF`] },
    { text: `A ${C} µF capacitor is charged to ${V} V. How much energy does it store, in µJ?`, answer: 0.5 * C * V * V, unit: 'µJ', tol: 0.02,
      steps: ['U = ½ C V²', `U = ½ × ${C} µF × ${V}² = ${fmt(0.5 * C * V * V)} µJ`] },
    { text: `${c1} µF and ${c2} µF in series are joined to a ${V2} V battery. What is the voltage across the ${c1} µF capacitor, in volts?`, answer: Q2 / c1, unit: 'V', tol: 0.02,
      steps: [`C = ${c1} × ${c2} / (${c1} + ${c2}) = ${fmt((c1 * c2) / (c1 + c2))} µF, so Q = C V = ${fmt(Q2)} µC on each.`, `V₁ = Q / C₁ = ${fmt(Q2)} / ${c1} = ${fmt(Q2 / c1)} V (the smaller capacitor takes the bigger share).`] },
  ];
}
