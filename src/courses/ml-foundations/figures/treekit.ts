// Drawing helpers for the tree simulations (Modules 5-6): paint a tree's leaf boxes on a 2D plot, and write
// its questions out as an indented list.
import type { Plot } from './kit';
import { classColour, fmt } from './kit';
import type { Node } from '../../../lib/ml/trees';

/** Shade each leaf's box by its share of class 1 (or a number's colour scale) and draw the split lines. */
export function regions(p: Plot, root: Node, opts: { strength?: number; lines?: boolean; highlight?: Node | null } = {}) {
  const st = opts.strength ?? 0.4;
  const walk = (nd: Node, x0: number, x1: number, y0: number, y1: number) => {
    if (nd.l && nd.r) {
      if (nd.f === 0) { walk(nd.l, x0, nd.t!, y0, y1); walk(nd.r, nd.t!, x1, y0, y1); }
      else { walk(nd.l, x0, x1, y0, nd.t!); walk(nd.r, x0, x1, nd.t!, y1); }
      return;
    }
    const v = nd.value;
    p.rect(x0, y0, x1 - x0, y1 - y0, { fill: classColour(p.pal, v > 0.5 ? 1 : 0), alpha: st * Math.max(0.15, Math.abs(v - 0.5) * 2) });
  };
  walk(root, p.x0, p.x1, p.y0, p.y1);
  if (opts.lines === false) return;
  const lines = (nd: Node, x0: number, x1: number, y0: number, y1: number) => {
    if (!(nd.l && nd.r)) return;
    const hot = opts.highlight === nd, s = { color: hot ? p.pal.ink : p.pal.muted, width: hot ? 2.5 : 1.3 };
    if (nd.f === 0) { p.line(nd.t!, y0, nd.t!, y1, s); lines(nd.l, x0, nd.t!, y0, y1); lines(nd.r, nd.t!, x1, y0, y1); }
    else { p.line(x0, nd.t!, x1, nd.t!, s); lines(nd.l, x0, x1, y0, nd.t!); lines(nd.r, x0, x1, nd.t!, y1); }
  };
  lines(root, p.x0, p.x1, p.y0, p.y1);
}

/** The tree as nested lists of yes/no questions, with a leaf's answer at the end of each path. */
export function treeList(root: Node, names: string[], leafText: (nd: Node) => string, units: string[] = []) {
  const li = (nd: Node): HTMLLIElement => {
    const el = document.createElement('li');
    if (nd.l && nd.r) {
      el.textContent = `${names[nd.f!]} ≤ ${fmt(nd.t!, 1)}${units[nd.f!] ?? ''}?`;
      const ul = document.createElement('ul');
      const yes = li(nd.l), no = li(nd.r);
      yes.prepend('yes: '); no.prepend('no: ');
      ul.append(yes, no); el.append(ul);
    } else {
      const b = document.createElement('strong'); b.textContent = leafText(nd); el.append(b);
    }
    return el;
  };
  const ul = document.createElement('ul'); ul.className = 'mlf-tree'; ul.append(li(root));
  return ul;
}
