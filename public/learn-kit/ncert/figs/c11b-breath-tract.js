// Class 11 Biology, Breathing and Exchange of Gases (step player): the path of air from the nostrils to the alveoli. The conducting part (nose to terminal bronchioles) warms, moistens and filters the air;
// the respiratory part (alveoli) is where gases are exchanged. The airway divides about 23 times, ending in some 300 million alveoli.
import { flowPlayer } from '../c11b-flow15.js';

export default function (host) {
  return flowPlayer(host, {
    label: 'Steps along the human respiratory tract from the nostrils to the alveoli', title: 'Air on its way in', aspect: 1.0,
    nodes: [
      { id: 'n', x: 0.5, y: 0.05, w: 0.5, t: 'Nostrils and nasal chamber', c: 0 }, { id: 'p', x: 0.5, y: 0.22, w: 0.5, t: 'Pharynx and larynx', c: 4 },
      { id: 't', x: 0.5, y: 0.39, w: 0.5, t: 'Trachea (C-shaped rings)', c: 2 }, { id: 'b', x: 0.5, y: 0.56, w: 0.5, t: 'Bronchi (right and left)', c: 2 },
      { id: 'bl', x: 0.5, y: 0.73, w: 0.5, t: 'Bronchioles (branching)', c: 3 }, { id: 'a', x: 0.5, y: 0.9, w: 0.5, t: 'Alveoli (gas exchange)', c: 1 },
    ],
    arrows: [{ a: 'n', b: 'p' }, { a: 'p', b: 't' }, { a: 't', b: 'b' }, { a: 'b', b: 'bl' }, { a: 'bl', b: 'a' }],
    steps: [
      { on: ['n'], note: 'Air enters through the nostrils. Hairs and mucus trap dust; the nasal chamber warms and moistens the air.', tally: 'Conducting part: cleans, warms, moistens' },
      { on: ['n', 'p'], arr: [0], note: 'The pharynx is shared by food and air. The larynx (voice box) has a flap, the epiglottis, which closes the airway while we swallow so that food does not go down the wrong way.' },
      { on: ['p', 't'], arr: [1], note: 'The trachea is a tube kept open by C-shaped cartilage rings. Its lining has cilia and mucus, which sweep dust up and out.' },
      { on: ['t', 'b'], arr: [2], note: 'The trachea divides at the level of the 5th rib into the right and left primary bronchi, one for each lung.' },
      { on: ['b', 'bl'], arr: [3], note: 'Each bronchus divides again and again (secondary, tertiary bronchi) into very fine bronchioles. About 23 divisions in all.' },
      { on: ['bl', 'a'], arr: [4], note: 'The bronchioles end in thin-walled, grape-like alveoli, about 300 million in two lungs, giving an area of some 70 m² for exchange.', tally: 'Respiratory part: alveoli, with capillaries' },
    ],
  });
}
