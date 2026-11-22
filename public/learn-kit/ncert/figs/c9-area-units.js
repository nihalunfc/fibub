// Class 9 Area: perimeter is the distance round the edge (a length, in m); area is the surface inside, counted in
// unit squares (m squared). A rectangle l by b has perimeter 2(l + b) and area l x b.
import { canvas, text, title, row, slider, choice, readout, loop, dot } from '../../kit.js';

export default function (host) {
  let L = 7, B = 4, mode = 'area', pos = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A rectangle on a grid with its area counted in squares or its perimeter walked' });
  const ctl = row(host);
  slider(ctl, { label: 'Length', min: 1, max: 12, step: 1, value: L, fmt: (v) => v + ' m', oninput: (v) => { L = v; pos = 0; sync(); } });
  slider(ctl, { label: 'Breadth', min: 1, max: 8, step: 1, value: B, fmt: (v) => v + ' m', oninput: (v) => { B = v; pos = 0; sync(); } });
  const c2 = row(host);
  choice(c2, 'Show', [['area', 'Area (tiles)'], ['perim', 'Perimeter (walk)']], mode, (v) => { mode = v; pos = 0; sync(); });
  loop(host, (dt) => { if (mode === 'perim') { pos = (pos + 4 * dt) % (2 * (L + B)); cv.redraw(); } });
  const out = readout(host);
  function sync() {
    out.innerHTML = mode === 'area' ? `Tiles: ${B} rows of ${L} = <b>${L * B} square metres</b>. Area = length × breadth = ${L} × ${B}. Area is measured in square units.` : `Walk round the edge: ${L} + ${B} + ${L} + ${B} = <b>${2 * (L + B)} metres</b>. Perimeter = 2 × (${L} + ${B}). Perimeter is a length.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mode === 'area' ? 'Area = squares inside' : 'Perimeter = distance round the edge', col), s = Math.min((w - 40) / L, (h - top - 40) / B, 36), ox = (w - s * L) / 2, oy = top + 14 + (h - top - 40 - s * B) / 2;
    if (mode === 'area') {
      for (let i = 0; i < L; i++) for (let j = 0; j < B; j++) { ctx.fillStyle = (i + j) % 2 ? col.s[0] : col.s[1]; ctx.globalAlpha = 0.35; ctx.fillRect(ox + i * s, oy + j * s, s, s); ctx.globalAlpha = 1; }
    }
    ctx.strokeStyle = col.line; ctx.lineWidth = 1;
    for (let i = 0; i <= L; i++) { ctx.beginPath(); ctx.moveTo(ox + i * s, oy); ctx.lineTo(ox + i * s, oy + B * s); ctx.stroke(); }
    for (let j = 0; j <= B; j++) { ctx.beginPath(); ctx.moveTo(ox, oy + j * s); ctx.lineTo(ox + L * s, oy + j * s); ctx.stroke(); }
    ctx.strokeStyle = mode === 'perim' ? col.s[2] : col.ink; ctx.lineWidth = mode === 'perim' ? 4 : 2.5; ctx.strokeRect(ox, oy, L * s, B * s);
    text(ctx, L + ' m', ox + (L * s) / 2, oy - 8, { color: col.ink, size: 12, weight: 700, align: 'center' });
    text(ctx, B + ' m', ox + L * s + 6, oy + (B * s) / 2, { color: col.ink, size: 12, weight: 700 });
    if (mode === 'area') text(ctx, L * B + ' m²', ox + (L * s) / 2, oy + (B * s) / 2, { color: col.ink, size: Math.min(22, s * 0.7 + 6), weight: 700, align: 'center', halo: col.panel });
    else {
      const p = pos, e = [L, B, L, B]; let x = ox, y = oy, d = p;
      const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
      for (let k = 0; k < 4; k++) { const take = Math.min(d, e[k]); x += dirs[k][0] * take * s; y += dirs[k][1] * take * s; d -= take; if (d <= 0) break; }
      dot(ctx, x, y, 7, col.s[2], col.ink);
      text(ctx, 'walked ' + p.toFixed(1) + ' m of ' + 2 * (L + B) + ' m', w / 2, h - 18, { color: col.s[2], size: 12, weight: 700, align: 'center' });
    }
  };
  sync();
}
