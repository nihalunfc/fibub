// A tree or dendrogram as a report Figure (page canvas, PNG, PDF, Word), drawn with the tree viewer's layout
// (newick.ts drawTree). Used by the community ordination and tree builder tools.
import { drawTree, type Tree, type Shape } from './newick.ts';
import type { Figure, Palette } from '../report';

const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

function drawShapes(ctx: CanvasRenderingContext2D, shapes: Shape[], pal: Palette, muted: string) {
  const col = (c: string) => (pal.red ? (c === muted ? pal.muted : pal.ink) : c);
  ctx.lineCap = 'square';
  for (const s of shapes) {
    if (s.t === 'line') { ctx.strokeStyle = col(s.color); ctx.lineWidth = s.w; ctx.setLineDash(s.dash ? [2, 3] : []); ctx.beginPath(); ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x2, s.y2); ctx.stroke(); }
    else if (s.t === 'arc') { ctx.strokeStyle = col(s.color); ctx.lineWidth = s.w; ctx.setLineDash([]); ctx.beginPath(); ctx.arc(s.cx, s.cy, s.r, s.a0, s.a1); ctx.stroke(); }
    else {
      ctx.save(); ctx.fillStyle = col(s.color); ctx.font = `${s.italic ? 'italic ' : ''}${s.size}px ${FONT}`;
      ctx.textAlign = s.anchor === 'middle' ? 'center' : s.anchor === 'end' ? 'right' : 'left'; ctx.textBaseline = 'middle';
      ctx.translate(s.x, s.y); if (s.rot) ctx.rotate((s.rot * Math.PI) / 180); ctx.fillText(s.s, 0, 0); ctx.restore();
    }
  }
  ctx.setLineDash([]);
}

/** A rectangular tree figure `width` px wide. Tip colours come from node.color (set them before calling);
 *  lengths = false draws a cladogram. `support` shows inner-node labels. */
export function treeFigure(t: Tree, alt: string, o: { width?: number; lengths?: boolean; support?: boolean; font?: number } = {}): Figure {
  const width = o.width ?? 640, font = o.font ?? 13;
  const opts = (ink: string, muted: string) => ({ layout: 'rect' as const, lengths: o.lengths ?? true, align: false, support: o.support ?? false, branchLabels: false, font, line: 1.5, italic: false, ink, muted, width });
  const h = drawTree(t, opts('#000', '#666')).h;
  return {
    w: width, h, alt,
    draw: (ctx, _w, _h, pal) => {
      ctx.font = `100px ${FONT}`;
      const measure = (s: string) => ctx.measureText(s).width / 100;
      // Leaf colours were chosen for a white page; on dark or red pages the ink colour is used for uncoloured parts.
      const d = drawTree(t, opts(pal.ink, pal.muted), measure);
      drawShapes(ctx, d.shapes, pal, pal.muted);
    },
  };
}
