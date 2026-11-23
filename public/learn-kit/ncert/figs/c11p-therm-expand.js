// Class 11 Thermal Properties of Matter: thermal expansion. A bimetallic strip: two metals of the same length at 20 degC (brass alpha = 19e-6 per degC, steel alpha = 12e-6). Heated, brass lengthens more, so the strip bends with brass on the OUTSIDE
// (bends toward steel); cooled it bends the other way. Bend: curvature k = (a1 - a2) dT / d (d = strip thickness, simple two-layer model). Also a railway rail with a gap: dL = alpha L dT. Gaps close when it gets hot.
import { canvas, text, title, line, dot, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let T = 20, mode = 'strip';
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 300, label: 'A bimetallic strip that bends when heated, and a railway track with an expansion gap' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Show', [['strip', 'bimetal strip'], ['rail', 'rail gap']], mode, (v) => { mode = v; go(); });
  slider(ctl, { label: 'temperature (°C)', min: -20, max: 180, step: 5, value: T, fmt: (v) => v + ' °C', oninput: (v) => { T = v; go(); } });
  const go = () => { const dT = T - 20; ro.textContent = mode === 'strip' ? `ΔT = ${dT} °C. Brass grows by ${(19e-6 * dT * 1e6 / 1000).toFixed(2)} mm per metre, steel by ${(12e-6 * dT * 1e6 / 1000).toFixed(2)} mm per metre. ${dT === 0 ? 'Same length: the strip is straight.' : dT > 0 ? 'Brass is longer, so the strip bends with brass on the outside.' : 'Brass shrinks more, so it bends the other way.'}` : `A 20 m steel rail changes length by ΔL = αLΔT = 12×10⁻⁶ × 20 × ${dT} = ${(12e-6 * 20 * dT * 1000).toFixed(1)} mm. ${dT > 40 ? 'Without a gap the rails would buckle.' : 'The gap absorbs the change.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mode === 'strip' ? 'Bimetallic strip: two metals, two expansions' : 'Railway rail: why there is a gap', col) + 16, cy = top + (h - top) / 2 - 6, dT = T - 20;
    if (mode === 'strip') {
      const Lp = w * 0.62, th = 8, x0 = w * 0.2, R = Math.abs(dT) < 1 ? 1e6 : (Lp * 1.1 * 160) / dT;
      const pts = (off) => { const p = []; for (let i = 0; i <= 40; i++) { const a = (i / 40) * Lp / R; p.push([x0 + R * Math.sin(a) + off * Math.sin(a), cy - 30 + R * (1 - Math.cos(a)) - off * Math.cos(a)]); } return p; };
      const a = pts(0), b = pts(th), c = pts(-th);
      ctx.fillStyle = col.s[2]; ctx.beginPath(); b.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); a.slice().reverse().forEach(([x, y]) => ctx.lineTo(x, y)); ctx.fill();
      ctx.fillStyle = col.s[0]; ctx.beginPath(); a.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); c.slice().reverse().forEach(([x, y]) => ctx.lineTo(x, y)); ctx.fill();
      ctx.fillStyle = col.ink; ctx.fillRect(x0 - 8, cy - 30 - th - 14, 8, 2 * th + 28);
      text(ctx, 'brass (expands more)', w - 10, h - 36, { color: col.s[2], size: 11, weight: 700, align: 'right' }); text(ctx, 'steel', w - 10, h - 18, { color: col.s[0], size: 11, weight: 700, align: 'right' });
      text(ctx, 'T = ' + T + ' °C', w / 2, top + 4, { color: col.ink, size: 12, weight: 700, align: 'center' });
    } else {
      const gap = Math.max(0, 18 - dT * 0.18), rw = (w - 40 - 18) / 2, y = cy;
      ctx.fillStyle = col.s[0]; ctx.fillRect(10, y - 8, w / 2 - 9 - gap / 2, 16); ctx.fillRect(w / 2 + gap / 2, y - 8, w / 2 - 9 - gap / 2, 16);
      line(ctx, [[w / 2 - gap / 2, y - 22], [w / 2 - gap / 2, y + 22]], col.muted, 1, [3, 3]); line(ctx, [[w / 2 + gap / 2, y - 22], [w / 2 + gap / 2, y + 22]], col.muted, 1, [3, 3]);
      text(ctx, 'gap ' + (gap * 0.55).toFixed(1) + ' mm', w / 2, y + 38, { color: col.s[3], size: 12, weight: 700, align: 'center' });
      for (let i = 0; i < 9; i++) { ctx.fillStyle = col.line; ctx.fillRect(18 + i * (w - 36) / 8 - 6, y + 8, 12, 8); }
      text(ctx, gap < 1 ? 'gap closed: rails press together!' : 'the gap shrinks as the rails expand', w / 2, y - 40, { color: gap < 1 ? col.bad : col.muted, size: 11.5, weight: 700, align: 'center' });
    }
  };
  go();
}
