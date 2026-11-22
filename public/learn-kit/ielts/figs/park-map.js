// 2.6 A plan of a park for map labelling. In a step player (data-fig="park-map") each step moves the
// visitor along the route the speaker describes, so you see how direction language maps onto the plan.
import { canvas, text, dot, line, colors } from '../../kit.js';

// Places on a 100 x 70 grid. Letters are what the questions use; names are revealed by the route.
const P = {
  gate: [50, 66], fountain: [50, 40], cafe: [22, 52], pond: [78, 24], playground: [80, 54], garden: [20, 18], toilets: [50, 12], bandstand: [64, 40],
};
const LABEL = { cafe: 'A', playground: 'B', garden: 'C', pond: 'D', toilets: 'E', bandstand: 'F' };
const ROUTE = [
  ['gate', 'Start at the main gate, at the bottom of the plan (the south).'],
  ['fountain', 'Walk straight ahead (north) along the main path to the fountain, in the centre.'],
  ['cafe', 'Turn left at the fountain and the café is on your left, in the south-west corner: A.'],
  ['fountain', 'Go back to the fountain.'],
  ['bandstand', 'The bandstand is just to the right (east) of the fountain: F.'],
  ['pond', 'Carry on past the bandstand and bear left: the pond is in the north-east corner, D.'],
  ['toilets', 'Follow the top path west. Opposite the far end of the main path, at the top, are the toilets: E.'],
  ['garden', 'Keep going west to the corner: the rose garden, C.'],
];
export default function (host) {
  let at = -1;
  const cv = canvas(host, { aspect: 0.72, max: 380, min: 260, label: 'Plan of a park with places marked A to F and a main gate at the bottom' });
  cv.draw = (ctx, w, h, col) => {
    const sx = (x) => 14 + (x / 100) * (w - 28), sy = (y) => 26 + (y / 70) * (h - 40);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(sx(2), sy(4), sx(98) - sx(2), sy(68) - sy(4));
    // paths
    const paths = [[[50, 68], [50, 12]], [[20, 12], [82, 12]], [[22, 40], [80, 40]], [[80, 12], [80, 60]], [[20, 12], [20, 52]]];
    for (const p of paths) line(ctx, p.map(([x, y]) => [sx(x), sy(y)]), col.line, 8);
    // pond
    ctx.beginPath(); ctx.ellipse(sx(80), sy(24), 26, 14, 0, 0, Math.PI * 2); ctx.fillStyle = col.s[0] + '55'; ctx.fill();
    for (const [k, [x, y]] of Object.entries(P)) {
      if (k === 'gate') { text(ctx, 'Main gate', sx(x), sy(70) + 4, { color: col.ink, size: 12, weight: 700, align: 'center' }); continue; }
      if (k === 'fountain') { dot(ctx, sx(x), sy(y), 8, col.s[0]); text(ctx, 'Fountain', sx(x) - 10, sy(y) + 16, { color: col.muted, size: 11, align: 'right' }); continue; }
      dot(ctx, sx(x), sy(y), 12, col.panel, col.ink);
      text(ctx, LABEL[k], sx(x), sy(y), { color: col.ink, size: 13, weight: 700, align: 'center' });
    }
    text(ctx, 'N ↑', 16, 12, { color: col.ink, size: 12, weight: 700 });
    if (at >= 0) {
      const pts = ROUTE.slice(0, at + 1).map(([k]) => [sx(P[k][0]), sy(P[k][1])]);
      line(ctx, pts, col.s[3], 3, [6, 4]);
      const [x, y] = pts[pts.length - 1];
      dot(ctx, x, y, 6, col.s[3]);
    }
  };
  cv.redraw();
  return { step(i) { at = i; cv.redraw(); } };
}
export { ROUTE };
