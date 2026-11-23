// Class 11 Biology, Photosynthesis (step player): how the light reactions make ATP by chemiosmosis. Water splitting and the electron carriers load H+ into the thylakoid lumen;
// the H+ gradient drives ATP synthase; the electrons end on NADP+ to give NADPH.
import { flowPlayer } from '../c11b-flow15.js';

export default function (host) {
  return flowPlayer(host, {
    label: 'Steps of the light reactions: water splitting, photosystems, proton gradient, ATP synthase and NADPH', title: 'Light reactions: electrons and protons', aspect: 1.08,
    nodes: [
      { id: 'w', x: 0.17, y: 0.07, w: 0.28, t: 'H₂O', c: 0 }, { id: 'p2', x: 0.17, y: 0.3, w: 0.3, h: 34, t: 'Photosystem II\n(P680)', c: 3 },
      { id: 'cy', x: 0.5, y: 0.5, w: 0.3, t: 'PQ and\ncytochrome b6f', c: 4 }, { id: 'p1', x: 0.83, y: 0.3, w: 0.3, h: 34, t: 'Photosystem I\n(P700)', c: 3 },
      { id: 'nd', x: 0.83, y: 0.07, w: 0.28, t: 'NADPH', c: 1 }, { id: 'hl', x: 0.5, y: 0.76, w: 0.34, h: 30, t: 'H⁺ crowd in lumen', c: 2 },
      { id: 'as', x: 0.18, y: 0.92, w: 0.3, t: 'ATP synthase', c: 5 }, { id: 'at', x: 0.82, y: 0.92, w: 0.28, t: 'ATP', c: 1 },
    ],
    arrows: [{ a: 'w', b: 'p2' }, { a: 'p2', b: 'cy' }, { a: 'cy', b: 'p1' }, { a: 'p1', b: 'nd' }, { a: 'cy', b: 'hl' }, { a: 'hl', b: 'as' }, { a: 'as', b: 'at' }, { a: 'p2', b: 'hl' }],
    steps: [
      { on: ['w', 'p2'], arr: [0], note: 'Light excites photosystem II. It takes electrons from water, which splits into O₂, H⁺ and electrons. The H⁺ are released inside the thylakoid (the lumen).' },
      { on: ['p2', 'cy', 'hl'], arr: [1, 4, 7], note: 'The excited electron runs downhill through plastoquinone and the cytochrome b6f complex. The energy released pumps more H⁺ into the lumen.' },
      { on: ['cy', 'p1', 'nd'], arr: [2, 3], note: 'Photosystem I is excited by light too. Its electron is passed on, and NADP⁺ picks it up (with H⁺ from the stroma) to make NADPH.' },
      { on: ['hl', 'as', 'at'], arr: [5, 6], note: 'The crowded H⁺ flow back out through ATP synthase, like water through a turbine, and the flow makes ATP from ADP and Pi (photophosphorylation).', tally: 'Output: O₂ + ATP + NADPH' },
    ],
  });
}
