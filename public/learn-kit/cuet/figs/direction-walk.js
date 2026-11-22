// 4.5 Walk a path on a grid: each leg turns left or right. The straight-line distance back home comes from
// Pythagoras; the direction from where you end relative to the start.
import { canvas, text, row, button, readout, line, dot } from '../../kit.js';

export const WALKS = [
  { start: 'N', legs: [[3, 'start'], [4, 'R'], [6, 'R'], [4, 'R']], say: 'North 3, right (East) 4, right (South) 6, right (West) 4' },
  { start: 'E', legs: [[5, 'start'], [12, 'L']], say: 'East 5, left (North) 12' },
  { start: 'S', legs: [[6, 'start'], [3, 'L'], [2, 'L'], [5, 'R']], say: 'South 6, left (East) 3, left (North) 2, right (East) 5' },
];
const DIRS = ['N', 'E', 'S', 'W'], V = { N: [0, 1], E: [1, 0], S: [0, -1], W: [-1, 0] };
export function walk(w) {
  let d = DIRS.indexOf(w.start), p = [0, 0]; const pts = [[0, 0]];
  for (const [n, t] of w.legs) { if (t === 'R') d = (d + 1) % 4; if (t === 'L') d = (d + 3) % 4; const v = V[DIRS[d]]; p = [p[0] + v[0] * n, p[1] + v[1] * n]; pts.push(p); }
  return pts;
}
export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 360, min: 240, label: 'A walk drawn on a grid with the straight line back to the start' });
  let k = 0;
  const ctl = row(host); button(ctl, 'Next walk', () => { k = (k + 1) % WALKS.length; cv.redraw(); say(); });
  const out = readout(host);
  const say = () => {
    const pts = walk(WALKS[k]), [x, y] = pts.at(-1), d = Math.hypot(x, y);
    const dir = `${y > 0 ? 'North' : y < 0 ? 'South' : ''}${x && y ? '-' : ''}${x > 0 ? 'East' : x < 0 ? 'West' : ''}` || 'at the start';
    out.innerHTML = `${WALKS[k].say}. You end ${Math.abs(x)} ${x >= 0 ? 'east' : 'west'} and ${Math.abs(y)} ${y >= 0 ? 'north' : 'south'} of the start: √(${x * x} + ${y * y}) = <b>${+d.toFixed(2)} km</b>, to the <b>${dir}</b>.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const pts = walk(WALKS[k]), xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const minx = Math.min(...xs) - 1, maxx = Math.max(...xs) + 1, miny = Math.min(...ys) - 1, maxy = Math.max(...ys) + 1;
    const s = Math.min((w - 40) / (maxx - minx), (h - 40) / (maxy - miny)), X = (x) => 20 + (x - minx) * s, Y = (y) => h - 20 - (y - miny) * s;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1;
    for (let x = Math.ceil(minx); x <= maxx; x++) { ctx.beginPath(); ctx.moveTo(X(x), Y(miny)); ctx.lineTo(X(x), Y(maxy)); ctx.stroke(); }
    for (let y = Math.ceil(miny); y <= maxy; y++) { ctx.beginPath(); ctx.moveTo(X(minx), Y(y)); ctx.lineTo(X(maxx), Y(y)); ctx.stroke(); }
    line(ctx, pts.map(([x, y]) => [X(x), Y(y)]), col.s[0], 3);
    line(ctx, [[X(0), Y(0)], [X(pts.at(-1)[0]), Y(pts.at(-1)[1])]], col.s[3], 2, [6, 4]);
    dot(ctx, X(0), Y(0), 6, col.s[2]); text(ctx, 'start', X(0) + 8, Y(0) + 12, { color: col.ink, size: 11, weight: 600 });
    dot(ctx, X(pts.at(-1)[0]), Y(pts.at(-1)[1]), 6, col.s[1]); text(ctx, 'end', X(pts.at(-1)[0]) + 8, Y(pts.at(-1)[1]) - 10, { color: col.ink, size: 11, weight: 600 });
    text(ctx, 'N ↑', w - 14, 14, { color: col.ink, size: 12, weight: 700, align: 'right' });
  };
  cv.redraw(); say();
}
