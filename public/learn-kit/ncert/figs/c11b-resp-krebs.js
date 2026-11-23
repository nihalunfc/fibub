// Class 11 Biology, Respiration in Plants (step player): one turn of the Krebs (citric acid) cycle. Acetyl CoA (2 C) joins oxaloacetic acid (4 C) to make citric acid (6 C); two CO2 are lost,
// giving a 4-carbon acid again, and the turn yields 3 NADH, 1 FADH2 and 1 ATP (GTP). The cycle runs twice per glucose.
import { flowPlayer } from '../c11b-flow15.js';

export default function (host) {
  return flowPlayer(host, {
    label: 'One turn of the Krebs cycle with carbon counts and the products of each step', title: 'The Krebs cycle: one turn', aspect: 1.05,
    nodes: [
      { id: 'ac', x: 0.17, y: 0.04, w: 0.28, t: 'acetyl CoA (2 C)', c: 0 }, { id: 'c', x: 0.74, y: 0.17, w: 0.34, t: 'citric acid\n(6 C)', c: 4, h: 34 },
      { id: 'k', x: 0.8, y: 0.45, w: 0.34, t: 'α-ketoglutaric\nacid (5 C)', c: 4, h: 34 }, { id: 's', x: 0.74, y: 0.72, w: 0.34, t: 'succinyl CoA\n(4 C)', c: 4, h: 34 },
      { id: 'm', x: 0.24, y: 0.82, w: 0.3, t: 'succinic → malic\nacid (4 C)', c: 4, h: 34 }, { id: 'o', x: 0.22, y: 0.4, w: 0.3, t: 'oxaloacetic acid\n(4 C)', c: 2, h: 34 },
      { id: 'co', x: 0.52, y: 0.46, w: 0.18, t: 'CO₂', c: 5 },
    ],
    arrows: [{ a: 'ac', b: 'o' }, { a: 'o', b: 'c' }, { a: 'c', b: 'k' }, { a: 'k', b: 's' }, { a: 's', b: 'm' }, { a: 'm', b: 'o' }, { a: 'k', b: 'co' }],
    steps: [
      { on: ['ac', 'o'], arr: [0], note: 'Acetyl CoA, made from pyruvate, carries a 2-carbon acetyl group to the cycle in the mitochondrial matrix. Waiting for it: oxaloacetic acid (4 C).', tally: 'Count carbons: 2 + 4 = 6' },
      { on: ['o', 'c'], arr: [1], note: 'Condensation: the acetyl group joins oxaloacetic acid to make 6-carbon citric acid. This is why it is also called the citric acid cycle.', tally: 'Carbons in the ring: 6' },
      { on: ['c', 'k', 'co'], arr: [2, 6], note: 'Citric acid loses a CO₂ (first decarboxylation) and one NAD⁺ becomes NADH. We are left with 5-carbon α-ketoglutaric acid.', tally: 'Carbons: 5, NADH: 1' },
      { on: ['k', 's', 'co'], arr: [3, 6], note: 'A second CO₂ is lost (second decarboxylation) and another NADH forms: 4-carbon succinyl CoA. The two carbons that left are not the ones that just came in, but the count balances.', tally: 'Carbons: 4, NADH: 2, CO₂ lost: 2' },
      { on: ['s', 'm'], arr: [4], note: 'Succinyl CoA gives its energy to make one ATP (substrate-level phosphorylation); succinic acid is oxidised, giving FADH₂; malic acid follows.', tally: 'ATP: 1, FADH₂: 1' },
      { on: ['m', 'o'], arr: [5], note: 'Malic acid is oxidised back to oxaloacetic acid, giving one more NADH. The cycle is ready again. Per turn: 3 NADH, 1 FADH₂, 1 ATP, 2 CO₂.', tally: 'Per glucose (2 turns): 6 NADH, 2 FADH₂, 2 ATP, 4 CO₂' },
    ],
  });
}
