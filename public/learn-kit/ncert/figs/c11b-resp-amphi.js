// Class 11 Biology, Respiration in Plants (step player): respiration is an amphibolic pathway. Carbohydrates, fats and proteins all feed into the same hub (pyruvate, acetyl CoA, Krebs cycle intermediates),
// and the intermediates can also be drawn off to build fats, amino acids and other molecules.
import { flowPlayer } from '../c11b-flow15.js';

export default function (host) {
  return flowPlayer(host, {
    label: 'How carbohydrates, fats and proteins enter respiration and how the pathway also supplies building blocks', title: 'One hub, many fuels', aspect: 1.05,
    nodes: [
      { id: 'cb', x: 0.17, y: 0.06, w: 0.28, t: 'Carbohydrates', c: 0 }, { id: 'pr', x: 0.5, y: 0.34, w: 0.26, t: 'Pyruvate', c: 4 }, { id: 'ac', x: 0.5, y: 0.56, w: 0.26, t: 'Acetyl CoA', c: 4 },
      { id: 'kc', x: 0.5, y: 0.8, w: 0.3, h: 34, t: 'Krebs cycle', c: 2 }, { id: 'ft', x: 0.83, y: 0.45, w: 0.28, h: 34, t: 'Fats\n(fatty acids)', c: 3 }, { id: 'pt', x: 0.84, y: 0.8, w: 0.28, h: 34, t: 'Proteins\n(amino acids)', c: 1 },
      { id: 'sy', x: 0.15, y: 0.78, w: 0.26, h: 34, t: 'Building\nblocks', c: 5 },
    ],
    arrows: [{ a: 'cb', b: 'pr' }, { a: 'pr', b: 'ac' }, { a: 'ac', b: 'kc' }, { a: 'ft', b: 'ac' }, { a: 'pt', b: 'kc' }, { a: 'kc', b: 'sy' }, { a: 'ac', b: 'sy' }],
    steps: [
      { on: ['cb', 'pr', 'ac', 'kc'], arr: [0, 1, 2], note: 'Carbohydrates are the usual fuel: glucose goes by glycolysis to pyruvate, then acetyl CoA, then the Krebs cycle.' },
      { on: ['ft', 'ac'], arr: [3], note: 'Fats are broken into glycerol and fatty acids. Fatty acids are cut into 2-carbon pieces that enter as acetyl CoA (so fat gives a lot of energy per gram).' },
      { on: ['pt', 'kc'], arr: [4], note: 'Proteins are broken into amino acids. After the amino group is removed, their carbon skeletons enter at pyruvate, acetyl CoA or a Krebs cycle acid.' },
      { on: ['kc', 'ac', 'sy'], arr: [5, 6], note: 'The pathway also runs the other way: intermediates are drawn off to make fatty acids, amino acids and other molecules. Because it both breaks down and builds up, it is called amphibolic.' },
    ],
  });
}
