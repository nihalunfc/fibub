// Class 11 Biology, Body Fluids and Circulation (step player): blood clotting. An injury makes platelets (and damaged tissue) release thromboplastin (thrombokinase); with Ca2+ it changes
// inactive prothrombin into active thrombin; thrombin turns soluble fibrinogen into insoluble fibrin threads, which trap red cells to make the clot.
import { flowPlayer } from '../c11b-flow15.js';

export default function (host) {
  return flowPlayer(host, {
    label: 'Steps of blood clotting from injury to clot', title: 'How a cut stops bleeding', aspect: 1.0,
    nodes: [
      { id: 'i', x: 0.5, y: 0.05, w: 0.44, t: 'Injury: platelets and\ntissue damaged', c: 3, h: 34 }, { id: 't', x: 0.5, y: 0.25, w: 0.44, t: 'Thromboplastin released', c: 4 },
      { id: 'p', x: 0.18, y: 0.47, w: 0.3, t: 'Prothrombin', c: 0 }, { id: 'th', x: 0.78, y: 0.47, w: 0.34, t: 'Thrombin (active)', c: 2 },
      { id: 'f', x: 0.18, y: 0.69, w: 0.3, t: 'Fibrinogen', c: 0 }, { id: 'fi', x: 0.78, y: 0.69, w: 0.34, t: 'Fibrin threads', c: 5 }, { id: 'c', x: 0.5, y: 0.9, w: 0.46, t: 'Clot (with red cells)', c: 1 },
    ],
    arrows: [{ a: 'i', b: 't' }, { a: 't', b: 'p' }, { a: 'p', b: 'th', t: '+ Ca²⁺' }, { a: 'f', b: 'fi', t: 'thrombin' }, { a: 'th', b: 'f' }, { a: 'fi', b: 'c' }],
    steps: [
      { on: ['i'], note: 'A cut damages vessels and tissue. Platelets stick to the wound and break open. This is the signal.' },
      { on: ['t'], arr: [0], note: 'Platelets and the injured tissue release the enzyme-like factor thromboplastin (thrombokinase).' },
      { on: ['p', 'th'], arr: [1, 2], note: 'In the presence of Ca²⁺, thromboplastin changes the inactive plasma protein prothrombin into active thrombin.' },
      { on: ['th', 'f', 'fi'], arr: [4, 3], note: 'Thrombin acts on the soluble plasma protein fibrinogen and turns it into insoluble fibrin threads.' },
      { on: ['fi', 'c'], arr: [5], note: 'Fibrin threads form a net, trapping red cells, white cells and platelets. The clot seals the wound. In the body, this happens only when a vessel is injured, so the blood does not clot inside healthy vessels.', tally: 'Without Ca²⁺ blood does not clot' },
    ],
  });
}
