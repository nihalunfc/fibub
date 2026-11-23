// Class 11 Biology, Respiration in Plants (step player): glycolysis. Two ATP are invested to prepare glucose, the 6-carbon sugar is split into two 3-carbon sugars,
// and each of those is turned into pyruvate, giving 4 ATP and 2 NADH. Net: 2 ATP, 2 NADH, 2 pyruvate.
import { flowPlayer } from '../c11b-flow15.js';

export default function (host) {
  return flowPlayer(host, {
    label: 'Steps of glycolysis from glucose to two pyruvate with ATP and NADH counts', title: 'Glycolysis: the ten-step path in five frames', aspect: 1.0,
    nodes: [
      { id: 'g', x: 0.3, y: 0.05, w: 0.38, t: 'Glucose (6 C)', c: 0 }, { id: 'g6', x: 0.3, y: 0.25, w: 0.42, t: 'Glucose 6-phosphate', c: 4 }, { id: 'f', x: 0.3, y: 0.45, w: 0.5, t: 'Fructose 1,6-bisphosphate', c: 4 },
      { id: 't', x: 0.3, y: 0.65, w: 0.5, t: '2 × glyceraldehyde 3-P (3 C)', c: 2 }, { id: 'pg', x: 0.3, y: 0.85, w: 0.4, t: '2 × pyruvate (3 C)', c: 3 },
      { id: 'a1', x: 0.82, y: 0.15, w: 0.26, t: '2 ATP\nused', c: 3 }, { id: 'n', x: 0.82, y: 0.65, w: 0.26, t: '2 NADH', c: 1 }, { id: 'a2', x: 0.82, y: 0.85, w: 0.26, t: '4 ATP\nmade', c: 5 },
    ],
    arrows: [{ a: 'g', b: 'g6' }, { a: 'g6', b: 'f' }, { a: 'f', b: 't' }, { a: 't', b: 'pg' }, { a: 'a1', b: 'g6' }, { a: 't', b: 'n' }, { a: 'pg', b: 'a2' }],
    steps: [
      { on: ['g'], note: 'Glycolysis (Greek: splitting of sugar) starts with one glucose in the cytoplasm. It needs no oxygen, and every cell does it.', tally: 'ATP: 0' },
      { on: ['g6', 'a1'], arr: [0, 4], note: 'Step 1: an ATP gives a phosphate to glucose (enzyme: hexokinase). The sugar is now trapped in the cell and "charged".', tally: 'ATP: −1' },
      { on: ['f', 'a1'], arr: [1, 4], note: 'Steps 2 and 3: glucose 6-phosphate is rearranged to fructose 6-phosphate and a second ATP adds another phosphate. This is the investment phase.', tally: 'ATP: −2' },
      { on: ['t', 'n'], arr: [2, 5], note: 'Step 4 and onwards: the 6-carbon sugar splits into two 3-carbon sugars. Each is oxidised: 2 NAD⁺ become 2 NADH.', tally: 'ATP: −2, NADH: +2' },
      { on: ['pg', 'a2'], arr: [3, 6], note: 'Each 3-carbon sugar passes its phosphates to ADP twice. That makes 4 ATP and 2 pyruvate. Net: 4 − 2 = 2 ATP, plus 2 NADH.', tally: 'Net: 2 ATP, 2 NADH, 2 pyruvate' },
    ],
  });
}
