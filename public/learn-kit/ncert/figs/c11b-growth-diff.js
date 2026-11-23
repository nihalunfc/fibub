// Class 11 Biology, Plant Growth and Development (step player): differentiation, dedifferentiation and redifferentiation. Meristem cells divide, daughter cells differentiate into specialised cells;
// a mature living cell can become meristematic again (dedifferentiation, e.g. cork cambium, interfascicular cambium, callus), and then specialise again (redifferentiation).
import { flowPlayer } from '../c11b-flow15.js';

export default function (host) {
  return flowPlayer(host, {
    label: 'Steps of differentiation, dedifferentiation and redifferentiation in plant cells', title: 'Cells that can change their job', aspect: 0.95,
    nodes: [
      { id: 'm', x: 0.2, y: 0.08, w: 0.32, t: 'Meristem cell\n(divides)', c: 4, h: 34 }, { id: 'd', x: 0.2, y: 0.4, w: 0.32, t: 'Differentiated\ncell (e.g. xylem)', c: 2, h: 34 },
      { id: 'r', x: 0.78, y: 0.08, w: 0.34, t: 'Living parenchyma\nin a stem', c: 2, h: 34 }, { id: 'x', x: 0.78, y: 0.4, w: 0.34, t: 'New meristem\n(cambium, callus)', c: 3, h: 34 },
      { id: 'n', x: 0.68, y: 0.74, w: 0.6, t: 'Redifferentiated cells\n(new tissue, e.g. wood, cork)', c: 1, h: 34 },
    ],
    arrows: [{ a: 'm', b: 'd' }, { a: 'r', b: 'x' }, { a: 'x', b: 'n' }],
    steps: [
      { on: ['m'], arr: [], note: 'In animals, cells that have specialised mostly stay that way. A plant keeps meristems (cells that divide) at its tips and in its cambium all its life.' },
      { on: ['m', 'd'], arr: [0], note: 'Differentiation: daughter cells of the meristem change shape and wall and take on a job. A xylem vessel element loses its cell contents and becomes a hollow tube.' },
      { on: ['r', 'x'], arr: [1], note: 'Dedifferentiation: a mature living cell that had lost the ability to divide becomes meristematic again, for example parenchyma between vascular bundles forms the interfascicular cambium, or a wound makes callus.' },
      { on: ['x', 'n'], arr: [2], note: 'Redifferentiation: the new cells divide and then specialise again, giving secondary xylem, phloem or cork. This is why a tree trunk thickens, and why tissue culture works.' },
    ],
  });
}
