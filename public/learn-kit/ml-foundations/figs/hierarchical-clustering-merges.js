// 8.3 Watch it happen: average-linkage clustering of five shops (weekly sales in $1,000s: A 10, B 12, C 30,
// D 33, E 60). Each step adds one merge to the dendrogram; the last step cuts it at height 10.
import { canvas, text, title, line, dot, ease, loop, calm } from '../../kit.js';

const LEAVES = [['A', 10], ['B', 12], ['C', 30], ['D', 33], ['E', 60]];
// merges: [left node, right node, height]; nodes 0-4 are leaves, 5+ are merges in order
const MERGES = [[0, 1, 2], [2, 3, 3], [5, 6, 20.5], [7, 4, 38.75]];
const NOTES = ['Every shop starts as its own cluster.', 'Closest pair: A and B, 2 apart. Join at height 2.', 'Next: C and D, 3 apart. Join at 3.',
  '{A,B} to {C,D}: average of 20, 23, 18, 21 = 20.5', 'E joins last at (50+48+30+27) ÷ 4 = 38.75', 'Cut at 10: three clusters, {A,B}, {C,D}, {E}'];

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 320, min: 260, label: 'A dendrogram of five shops being built merge by merge' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 0.7); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Average linkage, merge by merge', col);
    const L = 46, R = w - 18, T = 44, B = h - 64;
    const Y = (v) => B - (v / 40) * (B - T);
    // height axis
    line(ctx, [[L - 8, T], [L - 8, B]], col.muted, 1);
    for (const v of [0, 10, 20, 30, 40]) { line(ctx, [[L - 12, Y(v)], [L - 8, Y(v)]], col.muted, 1); text(ctx, String(v), L - 15, Y(v), { color: col.muted, size: 10, align: 'right' }); }
    const nodes = LEAVES.map((_, i) => ({ x: L + 12 + (i * (R - L - 24)) / 4, y: B }));
    const shown = Math.min(step, 4);
    MERGES.forEach(([a, b, ht], i) => { nodes.push({ x: (nodes[a].x + nodes[b].x) / 2, y: Y(ht) }); });
    const clusterOf = (leaf) => (step === 5 ? (leaf < 2 ? 0 : leaf < 4 ? 1 : 2) : -1);
    for (let i = 0; i < shown; i++) {
      const [a, b] = MERGES[i], m = nodes[5 + i], A = nodes[a], Bn = nodes[b];
      const t = i === shown - 1 && step <= 4 ? ease(k) : 1;
      const top = A.y + (m.y - A.y) * t, topB = Bn.y + (m.y - Bn.y) * t;
      const c = step === 5 && i < 2 ? col.s[i] : col.ink;
      line(ctx, [[A.x, A.y], [A.x, top]], c, 2);
      line(ctx, [[Bn.x, Bn.y], [Bn.x, topB]], c, 2);
      if (t === 1) { line(ctx, [[A.x, m.y], [Bn.x, m.y]], c, 2); text(ctx, String(MERGES[i][2]), m.x + 5, m.y - 8, { color: col.muted, size: 10.5, halo: col.panel }); }
    }
    LEAVES.forEach(([nm, v], i) => {
      const c = clusterOf(i), fill = c < 0 ? col.ink : col.s[c];
      dot(ctx, nodes[i].x, B, 5, fill);
      text(ctx, nm, nodes[i].x, B + 14, { color: fill, size: 12.5, weight: 700, align: 'center' });
      text(ctx, '$' + v + 'k', nodes[i].x, B + 29, { color: col.muted, size: 10.5, align: 'center' });
    });
    if (step === 5) { line(ctx, [[L - 8, Y(10)], [R, Y(10)]], col.bad || col.s[1], 2, [6, 4]); text(ctx, 'cut', (nodes[3].x + nodes[4].x) / 2, Y(10) - 9, { color: col.bad || col.s[1], size: 11, weight: 700, align: 'center', halo: col.panel }); }
    text(ctx, NOTES[step], 10, h - 10, { color: col.ink, size: 11.5, weight: 600 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); k = calm() ? 1 : 0; cv.redraw(); if (!calm()) anim.play(); } };
}
