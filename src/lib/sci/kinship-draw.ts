// Draws a kinship diagram through a plot.ts Painter (canvas or SVG): triangle = male, circle = female,
// square = sex unknown, "=" marriage, single line for unmarried parents, // for divorce, a slash for deceased,
// a vertical descent line to a siblings bar, and Ego filled in.
import type { Painter } from './plot.ts';
import type { Kin, Layout, Relation } from './kinship.ts';

export type DrawOpts = { ink: string; bg: string; muted: string; names: boolean; codes: boolean; slot?: number; rowH?: number; margin?: number; size?: number };

export function diagramSize(L: Layout, o: Partial<DrawOpts> = {}) {
  const m = o.margin ?? 24, rowH = o.rowH ?? 130;
  return { w: Math.ceil(L.width + 2 * m), h: Math.ceil(m * 2 + (L.gens - 1) * rowH + (o.size ?? 32) + 44) };
}

export function drawKinship(P: Painter, k: Kin, L: Layout, rel: Map<string, Relation>, o: DrawOpts) {
  const slot = o.slot ?? 100, rowH = o.rowH ?? 130, m = o.margin ?? 24, s = o.size ?? 32, h = s / 2;
  const X = (id: string) => m + L.pos.get(id)!.x, Y = (id: string) => m + h + L.pos.get(id)!.gen * rowH;
  const lw = 2;

  // Marriages and descent first, so the symbols sit on top of the lines.
  const rowOrder = new Map<string, string[]>();
  for (const p of L.pos.values()) { const key = String(p.gen); rowOrder.set(key, [...(rowOrder.get(key) ?? []), p.id]); }
  for (const ids of rowOrder.values()) ids.sort((a, b) => X(a) - X(b));
  const adjacent = (a: string, b: string) => { const ids = rowOrder.get(String(L.pos.get(a)!.gen))!; return L.pos.get(a)!.gen === L.pos.get(b)!.gen && Math.abs(ids.indexOf(a) - ids.indexOf(b)) === 1; };

  L.unions.forEach((u, idx) => {
    let dropX: number, dropY: number;
    if (u.b) {
      const [a, b] = X(u.a) <= X(u.b) ? [u.a, u.b] : [u.b, u.a];
      const xa = X(a) + h + 2, xb = X(b) - h - 2, y = Y(a);
      if (adjacent(a, b) || L.pos.get(a)!.gen !== L.pos.get(b)!.gen) {
        if (L.pos.get(a)!.gen !== L.pos.get(b)!.gen) {
          P.line([[X(a), Y(a)], [X(b), Y(b)]], o.muted, 1.5, [4, 3]);
        } else if (u.married) {
          P.line([[xa, y - 3], [xb, y - 3]], o.ink, lw); P.line([[xa, y + 3], [xb, y + 3]], o.ink, lw);
        } else P.line([[xa, y], [xb, y]], o.ink, lw);
        dropX = (X(a) + X(b)) / 2; dropY = y + (u.married ? 3 : 0);
      } else {
        // Not side by side: a bracket over the people in between.
        const top = y - h - 12;
        P.line([[X(a), y - h - 2], [X(a), top], [X(b), top], [X(b), y - h - 2]], o.ink, lw);
        if (u.married) P.line([[X(a) + 6, top - 5], [X(b) - 6, top - 5]], o.ink, lw);
        dropX = (X(a) + X(b)) / 2; dropY = top;
      }
      if (u.divorced) { const mx = (X(a) + X(b)) / 2, my = adjacent(a, b) ? y : y - h - 14; for (const dx of [-4, 3]) P.line([[mx + dx - 3, my + 8], [mx + dx + 3, my - 8]], o.ink, lw); }
    } else {
      // One known parent: the line leaves from the side of the symbol.
      dropX = X(u.a) + h + 10; dropY = Y(u.a);
      P.line([[X(u.a) + h + 2, dropY], [dropX, dropY]], o.ink, lw);
    }
    const kids = u.children.filter((c) => L.pos.has(c));
    if (!kids.length) return;
    const childTop = Math.min(...kids.map((c) => Y(c) - h));
    const barY = childTop - 16 - (idx % 3) * 5;
    P.line([[dropX, dropY], [dropX, barY]], o.ink, lw);
    const xs = [...kids.map(X), dropX];
    P.line([[Math.min(...xs), barY], [Math.max(...xs), barY]], o.ink, lw);
    for (const c of kids) P.line([[X(c), barY], [X(c), Y(c) - h - 1]], o.ink, lw);
  });

  for (const p of k.people) {
    if (!L.pos.has(p.id)) continue;
    const cx = X(p.id), cy = Y(p.id), ego = p.id === k.ego, fill = ego ? o.ink : o.bg;
    if (p.sex === 'm') P.poly([[cx, cy - h], [cx + h + 2, cy + h], [cx - h - 2, cy + h]], fill, o.ink, lw);
    else if (p.sex === 'f') P.circle(cx, cy, h, fill, o.ink, lw);
    else P.poly([[cx - h + 1, cy - h + 1], [cx + h - 1, cy - h + 1], [cx + h - 1, cy + h - 1], [cx - h + 1, cy + h - 1]], fill, o.ink, lw);
    if (p.dead) P.line([[cx - h - 5, cy + h + 5], [cx + h + 5, cy - h - 5]], ego ? o.bg : o.ink, lw);
    if (p.dead && ego) P.line([[cx - h - 5, cy + h + 5], [cx - h + 3, cy + h - 3]], o.ink, lw);
    let ty = cy + h + 6;
    const fit = (t: string, size: number, bold?: boolean) => { let x = t; while (x.length > 2 && P.measure(x, size, bold) > slot - 16) x = x.slice(0, -2) + '…'; return x; };
    if (o.codes) { const r = rel.get(p.id); const c = r?.code || '–'; P.text(cx, ty, fit(c, 13, true), 13, o.ink, 'middle', 'top', 0, true); ty += 17; }
    if (o.names && p.name) P.text(cx, ty, fit(p.name, 12), 12, o.muted, 'middle', 'top');
  }
}
