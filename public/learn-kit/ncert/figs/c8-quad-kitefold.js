// Class 8 Quadrilaterals: a kite is symmetric about one diagonal. Fold along that diagonal and the two halves match, so the
// angles at the two ends of the cross-diagonal are equal and the symmetry diagonal cuts the other diagonal at a right angle.
import { canvas, text, title, row, slider, readout } from '../../kit.js';
import { view, grid } from './c8-lib.js';

export default function (host) {
  let f = 0, up = 3, dn = 5;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'A kite folded along its line of symmetry' });
  const out = readout(host); const ctl = row(host);
  slider(ctl, { label: 'Fold', min: 0, max: 1, step: 0.01, value: 0, fmt: (v) => Math.round(v * 100) + '%', oninput: (v) => { f = v; sync(); } });
  slider(ctl, { label: 'Upper part', min: 2, max: 5, step: 1, value: up, fmt: (v) => v, oninput: (v) => { up = Math.round(v); sync(); } });
  function sync() { const s1 = Math.hypot(2.5, up), s2 = Math.hypot(2.5, dn); out.innerHTML = `Kite with two short sides of ${s1.toFixed(2)} and two long sides of ${s2.toFixed(2)}. ${f > 0.97 ? 'Folded flat: the halves match exactly, so the two side angles are equal and the diagonals cross at 90°.' : 'Fold along the vertical diagonal to test the symmetry.'}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Fold a kite along its axis', col), V = view(w, h, top, 7, 9, 8), cx = 3.5, by = 1, ty = by + dn + up, my = by + dn;
    grid(ctx, V, col);
    const X = (x) => V.X(cx + (x - cx) * Math.cos(Math.PI * f)), poly = (pts) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(X(p[0]), V.Y(p[1])) : ctx.moveTo(X(p[0]), V.Y(p[1])))); ctx.closePath(); };
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.3; poly([[cx, by], [cx, ty], [cx - 2.5, my]]); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.3; poly([[cx, by], [cx, ty], [cx + 2.5, my]]); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.setLineDash([5, 4]); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(V.X(cx), V.Y(by)); ctx.lineTo(V.X(cx), V.Y(ty)); ctx.stroke(); ctx.setLineDash([]);
    [[cx, by, 'A'], [cx + 2.5, my, 'B'], [cx, ty, 'C'], [cx - 2.5, my, 'D']].forEach(([x, y, t]) => text(ctx, t, V.X(x) + (t === 'B' ? 12 : t === 'D' ? -12 : 0), V.Y(y) + (t === 'A' ? 12 : t === 'C' ? -12 : 0), { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel }));
    text(ctx, 'line of symmetry AC', V.X(cx) + 6, V.Y(by + 1.2), { color: col.muted, size: 10.5 });
  };
  sync();
}
