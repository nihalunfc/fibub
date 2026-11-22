// Electric potential and capacitors: a parallel plate capacitor (plate area 100 cm²) charged to 12 V at 5 mm.
// Change the gap, slide in a dielectric slab and choose whether the battery stays connected (V fixed) or was
// removed first (Q fixed). C = ε₀A/(d − t + t/K); the readout shows C, Q, V, the fields and the stored energy.
import { canvas, row, slider, choice, readout, text, line, arrow, fmt } from '../../kit.js';

const E0 = 8.85e-12, A = 0.01, V0 = 12, Q0 = (E0 * A / 0.005) * V0;
export default function (host) {
  let d = 5, K = 4, fill = 0, mode = 'battery';
  const cv = canvas(host, { aspect: 0.55, max: 320, min: 230, label: 'Parallel plate capacitor with a dielectric slab' });
  const ctl = row(host);
  choice(ctl, 'Battery', [['battery', 'Kept connected (V fixed)'], ['isolated', 'Removed (Q fixed)']], mode, (v) => { mode = v; upd(); });
  slider(ctl, { label: 'Gap d', min: 1, max: 10, step: 0.5, value: d, fmt: (v) => `${v} mm`, oninput: (v) => { d = v; upd(); } });
  slider(ctl, { label: 'Slab fills', min: 0, max: 1, step: 0.05, value: fill, fmt: (v) => `${Math.round(v * 100)}% of gap`, oninput: (v) => { fill = v; upd(); } });
  slider(ctl, { label: 'Slab K', min: 1, max: 10, step: 0.5, value: K, fmt: (v) => String(v), oninput: (v) => { K = v; upd(); } });
  const out = readout(host);
  const calc = () => {
    const dm = d / 1000, t = fill * dm, C = (E0 * A) / (dm - t + t / K);
    const Q = mode === 'battery' ? C * V0 : Q0, V = Q / C, Ea = Q / (E0 * A), Ed = Ea / K, U = (Q * Q) / (2 * C);
    return { C, Q, V, Ea, Ed, U, t };
  };
  const upd = () => { cv.redraw(); const s = calc(); out.innerHTML = `C = <b>${fmt(s.C * 1e12, 3)} pF</b> · Q = ${fmt(s.Q * 1e9, 3)} nC · V = ${fmt(s.V, 3)} V · E in air = ${fmt(s.Ea / 1000, 3)} kV/m${fill > 0 ? `, in slab ${fmt(s.Ed / 1000, 3)} kV/m` : ''} · energy U = ${fmt(s.U * 1e9, 3)} nJ.`; };
  cv.draw = (ctx, w, h, col) => {
    const s = calc(), cx = w / 2, top = 30, bot = h - 34, gap = Math.max(18, (d / 10) * Math.min(w * 0.6, 300));
    const xl = cx - gap / 2, xr = cx + gap / 2, slabW = fill * gap;
    if (slabW > 0) { ctx.fillStyle = col.soft; ctx.fillRect(xr - slabW, top + 8, slabW, bot - top - 16); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 1; ctx.strokeRect(xr - slabW, top + 8, slabW, bot - top - 16); text(ctx, `K = ${K}`, xr - slabW / 2, bot + 8, { color: col.s[2], size: 11, align: 'center' }); }
    ctx.fillStyle = col.s[3]; ctx.fillRect(xl - 6, top, 6, bot - top);
    ctx.fillStyle = col.s[0]; ctx.fillRect(xr, top, 6, bot - top);
    const nq = Math.max(1, Math.min(14, Math.round((s.Q / Q0) * 6)));
    for (let i = 0; i < nq; i++) {
      const y = top + ((i + 0.5) / nq) * (bot - top);
      text(ctx, '+', xl - 16, y, { color: col.s[3], size: 13, weight: 700, align: 'center' });
      text(ctx, '−', xr + 16, y, { color: col.s[0], size: 13, weight: 700, align: 'center' });
      // field lines: all reach the slab, but the slab's bound charges cancel part of the field (drawn fainter)
      line(ctx, [[xl + 2, y], [xr - slabW, y]], col.muted, 1.4);
      if (slabW > 0) line(ctx, [[xr - slabW, y], [xr - 2, y]], col.muted, 1.4, [3, 4]);
      if (gap - slabW > 16) arrow(ctx, xl + (gap - slabW) / 2 - 4, y, xl + (gap - slabW) / 2 + 4, y, col.muted, 1.4, 6);
    }
    text(ctx, `d = ${d} mm`, cx, 14, { color: col.ink, size: 12, weight: 600, align: 'center' });
    text(ctx, mode === 'battery' ? 'V stays 12 V' : `Q stays ${fmt(Q0 * 1e9, 3)} nC`, 10, h - 12, { color: col.muted, size: 11 });
    text(ctx, 'dashed = weaker field E/K', w - 10, h - 12, { color: col.muted, size: 11, align: 'right' });
  };
  upd();
}
