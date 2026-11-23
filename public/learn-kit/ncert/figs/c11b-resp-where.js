// Class 11 Biology, Respiration in Plants (step player): the big picture of aerobic respiration. Glycolysis in the cytoplasm; pyruvate to acetyl CoA and the Krebs cycle in the
// mitochondrial matrix; the electron transport chain on the inner membrane. Running tally of ATP using the textbook count (3 ATP per NADH, 2 per FADH2), 38 ATP in all.
import { flowPlayer } from '../c11b-flow15.js';

export default function (host) {
  return flowPlayer(host, {
    label: 'Four stages of aerobic respiration with places and an ATP tally', title: 'Glucose to ATP: where each stage happens', aspect: 1.05,
    nodes: [
      { id: 'g', x: 0.18, y: 0.06, w: 0.3, t: 'Glucose (6 C)', c: 0 }, { id: 'gl', x: 0.18, y: 0.3, w: 0.32, h: 34, t: 'Glycolysis\n(cytoplasm)', c: 3 },
      { id: 'p', x: 0.72, y: 0.3, w: 0.34, t: '2 pyruvate (3 C)', c: 4 }, { id: 'a', x: 0.72, y: 0.52, w: 0.34, t: '2 acetyl CoA (2 C)', c: 4 },
      { id: 'k', x: 0.5, y: 0.74, w: 0.34, h: 34, t: 'Krebs cycle\n(matrix)', c: 2 }, { id: 'e', x: 0.17, y: 0.88, w: 0.3, h: 34, t: 'ETC (inner\nmembrane)', c: 5 }, { id: 'o', x: 0.83, y: 0.88, w: 0.3, t: 'CO₂ + H₂O', c: 1 },
    ],
    arrows: [{ a: 'g', b: 'gl' }, { a: 'gl', b: 'p' }, { a: 'p', b: 'a' }, { a: 'a', b: 'k' }, { a: 'k', b: 'e' }, { a: 'k', b: 'o' }],
    steps: [
      { on: ['g'], hot: ['g'], arr: [], note: 'Glucose has 6 carbons and a lot of stored energy. Respiration releases it slowly in many small steps, so that the energy can be caught in ATP.', tally: 'ATP so far: 0' },
      { on: ['g', 'gl', 'p'], arr: [0, 1], note: 'Glycolysis, in the cytoplasm and without oxygen, splits glucose into 2 pyruvate. Net gain: 2 ATP and 2 NADH (worth 6 ATP).', tally: 'ATP so far: 2 + 6 = 8' },
      { on: ['p', 'a'], arr: [2], note: 'Pyruvate enters the mitochondrion and loses one carbon as CO₂, giving acetyl CoA and NADH. For 2 pyruvate: 2 CO₂ and 2 NADH (6 ATP).', tally: 'ATP so far: 8 + 6 = 14' },
      { on: ['a', 'k', 'o'], arr: [3, 5], note: 'Each acetyl CoA turns the Krebs cycle once. Two turns give 4 CO₂, 2 ATP, 6 NADH and 2 FADH₂ (18 + 4 ATP).', tally: 'ATP so far: 14 + 2 + 18 + 4 = 38' },
      { on: ['k', 'e', 'o'], arr: [4, 5], note: 'The electron transport chain passes the electrons from NADH and FADH₂ to O₂, making water. The ATP counted in the tally is made here, by ATP synthase. Without O₂ the chain stops.', tally: 'Total: about 38 ATP per glucose (textbook count)' },
    ],
  });
}
