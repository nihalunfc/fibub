// Class 11 Biology, Breathing and Exchange of Gases (step player): how CO2 travels. About 70 % is carried as bicarbonate (formed in the red cell by carbonic anhydrase, then moved into plasma in exchange for chloride),
// 20-25 % as carbamino-haemoglobin and about 7 % dissolved in plasma. In the lungs the reactions run backwards and CO2 is breathed out.
import { flowPlayer } from '../c11b-flow15.js';

export default function (host) {
  return flowPlayer(host, {
    label: 'Steps of carbon dioxide transport in blood from tissues to lungs', title: 'Carbon dioxide on the way out', aspect: 1.05,
    nodes: [
      { id: 't', x: 0.17, y: 0.07, w: 0.28, t: 'Tissue cells\n(CO₂ made)', c: 3, h: 34 }, { id: 'd', x: 0.82, y: 0.07, w: 0.3, t: 'Dissolved in\nplasma: 7 %', c: 0, h: 34 },
      { id: 'c', x: 0.5, y: 0.4, w: 0.34, t: 'Red cell:\nCO₂ + H₂O', c: 4, h: 34 }, { id: 'h', x: 0.15, y: 0.62, w: 0.28, t: 'Carbamino-Hb\n20-25 %', c: 2, h: 34 },
      { id: 'b', x: 0.84, y: 0.62, w: 0.3, t: 'HCO₃⁻ to plasma\n70 % (Cl⁻ shift)', c: 1, h: 34 }, { id: 'l', x: 0.5, y: 0.9, w: 0.34, t: 'Lungs: CO₂ out', c: 5 },
    ],
    arrows: [{ a: 't', b: 'd' }, { a: 't', b: 'c' }, { a: 'c', b: 'h' }, { a: 'c', b: 'b' }, { a: 'h', b: 'l' }, { a: 'b', b: 'l' }, { a: 'd', b: 'l' }],
    steps: [
      { on: ['t'], note: 'Cells make CO₂ in respiration. The pCO₂ of the tissues (45 mm Hg) is higher than in the blood (40), so CO₂ diffuses into the capillary.' },
      { on: ['t', 'd'], arr: [0], note: 'About 7 % of the CO₂ simply dissolves in the plasma. (CO₂ is about 20 to 25 times more soluble in water than O₂.)', tally: '7 % dissolved' },
      { on: ['t', 'c', 'h'], arr: [1, 2], note: 'Most CO₂ enters the red cells. About 20 to 25 % binds to the amino groups of haemoglobin to form carbamino-haemoglobin. High pCO₂ and low pO₂ favour this.', tally: '20-25 % carbamino-Hb' },
      { on: ['c', 'b'], arr: [3], note: 'Inside the red cell the enzyme carbonic anhydrase makes CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻ very fast. HCO₃⁻ leaves into the plasma while Cl⁻ moves in (chloride shift). About 70 % travels this way.', tally: '70 % as bicarbonate' },
      { on: ['h', 'b', 'd', 'l'], arr: [4, 5, 6], note: 'In the lung capillaries pCO₂ is lower, so the reactions run in reverse: CO₂ is freed from all three forms and diffuses into the alveoli to be breathed out. Every 100 mL of blood delivers about 4 mL of CO₂.', tally: 'Reversed in the lungs' },
    ],
  });
}
