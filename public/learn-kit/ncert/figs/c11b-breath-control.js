// Class 11 Biology, Breathing and Exchange of Gases (step player): control of breathing. The respiratory rhythm centre in the medulla sets the rhythm; the pneumotaxic centre in the pons can shorten inspiration;
// a chemosensitive area near the rhythm centre is very sensitive to CO2 and H+; receptors in the aortic arch and carotid artery sense CO2, H+ and O2 (only strongly low O2). More CO2 makes breathing faster and deeper.
import { flowPlayer } from '../c11b-flow15.js';

export default function (host) {
  return flowPlayer(host, {
    label: 'Steps of the control of breathing by CO2 through the brain centres', title: 'What makes us breathe faster?', aspect: 1.05,
    nodes: [
      { id: 'c', x: 0.2, y: 0.07, w: 0.3, t: 'CO₂ and H⁺\nrise in blood', c: 3, h: 34 }, { id: 'r', x: 0.78, y: 0.07, w: 0.34, t: 'Aortic and\ncarotid receptors', c: 0, h: 34 },
      { id: 'cs', x: 0.2, y: 0.38, w: 0.3, t: 'Chemosensitive\narea (medulla)', c: 4, h: 34 }, { id: 'rc', x: 0.5, y: 0.6, w: 0.34, t: 'Rhythm centre\n(medulla)', c: 2, h: 34 },
      { id: 'pn', x: 0.84, y: 0.6, w: 0.28, t: 'Pneumotaxic\ncentre (pons)', c: 5, h: 34 }, { id: 'm', x: 0.5, y: 0.88, w: 0.5, t: 'Diaphragm and rib muscles', c: 1 },
    ],
    arrows: [{ a: 'c', b: 'cs' }, { a: 'c', b: 'r' }, { a: 'cs', b: 'rc' }, { a: 'r', b: 'rc' }, { a: 'pn', b: 'rc' }, { a: 'rc', b: 'm' }],
    steps: [
      { on: ['c'], note: 'Exercise raises CO₂ in the blood, and the extra CO₂ makes H⁺ (carbonic acid). The body must breathe more to remove it.' },
      { on: ['c', 'cs', 'r'], arr: [0, 1], note: 'The chemosensitive area of the medulla is highly sensitive to CO₂ and H⁺. Receptors in the aortic arch and carotid artery also sense the change.' },
      { on: ['cs', 'r', 'rc'], arr: [2, 3], note: 'Both send signals to the rhythm centre, which increases the rate and depth of the breathing rhythm. (Oxygen is hardly a trigger: only a big fall in O₂ is sensed.)' },
      { on: ['pn', 'rc', 'm'], arr: [4, 5], note: 'The rhythm centre drives the diaphragm and external intercostal muscles. The pneumotaxic centre in the pons can switch inspiration off sooner, so the rhythm can be made faster. We can also override it briefly, but not for long.', tally: 'More CO₂ → faster, deeper breathing' },
    ],
  });
}
