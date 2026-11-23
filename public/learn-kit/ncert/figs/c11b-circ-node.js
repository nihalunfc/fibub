// Class 11 Biology, Body Fluids and Circulation (step player): the nodal conduction system. The sinoatrial node (SAN, the pacemaker) starts each beat; the wave spreads over both atria, reaches the atrioventricular node (AVN),
// pauses briefly, then runs down the bundle of His and its branches to the Purkinje fibres, so the ventricles contract from the apex upward. The heart is myogenic: the beat starts in the heart muscle itself.
import { flowPlayer } from '../c11b-flow15.js';

export default function (host) {
  return flowPlayer(host, {
    label: 'Steps of the heart conduction system from the SA node to the Purkinje fibres', title: 'How a heartbeat travels', aspect: 1.0,
    nodes: [
      { id: 's', x: 0.5, y: 0.06, w: 0.5, t: 'SA node (pacemaker)', c: 3 }, { id: 'a', x: 0.5, y: 0.23, w: 0.5, t: 'Both atria contract', c: 4 },
      { id: 'v', x: 0.5, y: 0.4, w: 0.5, t: 'AV node (short delay)', c: 3 }, { id: 'h', x: 0.5, y: 0.57, w: 0.5, t: 'Bundle of His → right, left branches', c: 2 },
      { id: 'p', x: 0.5, y: 0.74, w: 0.5, t: 'Purkinje fibres', c: 2 }, { id: 've', x: 0.5, y: 0.91, w: 0.5, t: 'Both ventricles contract', c: 1 },
    ],
    arrows: [{ a: 's', b: 'a' }, { a: 'a', b: 'v' }, { a: 'v', b: 'h' }, { a: 'h', b: 'p' }, { a: 'p', b: 've' }],
    steps: [
      { on: ['s'], note: 'The SA node, a patch of special muscle in the right atrium, fires about 70 to 75 times a minute without any outside order. This is why the heart is called myogenic.' },
      { on: ['s', 'a'], arr: [0], note: 'The impulse spreads across both atria, which contract together (atrial systole) and push the last blood into the ventricles.' },
      { on: ['a', 'v'], arr: [1], note: 'The AV node, in the lower right atrium, picks up the wave and holds it for about 0.1 s, so the ventricles fill before they squeeze.' },
      { on: ['v', 'h'], arr: [2], note: 'The bundle of His carries the impulse down the septum between the ventricles and splits into right and left branches.' },
      { on: ['h', 'p'], arr: [3], note: 'The branches end in a network of Purkinje fibres in the ventricle walls.' },
      { on: ['p', 've'], arr: [4], note: 'The ventricles contract from the apex upward and push blood into the arteries (ventricular systole). The nerves of the autonomic system and adrenaline can only speed up or slow down this rhythm.', tally: 'Beat: SAN → AVN → His → Purkinje' },
    ],
  });
}
