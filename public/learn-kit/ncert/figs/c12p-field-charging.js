// Class 12 Electric Charges and Fields: charging by rubbing. Electrons (not protons) move from one object to the other,
// so one object ends up with a surplus (negative) and the other with a deficit (positive) of exactly the same size.
// Total charge is conserved and every net charge is a whole number of e = 1.6e-19 C (quantisation).
import { canvas, text, title, dot, row, button, readout } from '../../kit.js';

export default function (host) {
  let n = 0;
  const N = 8, E = 1.6e-19;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 280, label: 'A glass rod and a silk cloth: electrons move from the rod to the cloth when they are rubbed' });
  const ctl = row(host), ro = readout(host);
  button(ctl, 'Rub: move 1 electron', () => { n = Math.min(N, n + 1); upd(); });
  button(ctl, 'Rub back', () => { n = Math.max(-N, n - 1); upd(); });
  button(ctl, 'Reset', () => { n = 0; upd(); });
  const upd = () => {
    const q = n * E;
    ro.textContent = `Rod: ${n > 0 ? '+' : ''}${n}e = ${(n * 1.6).toFixed(1)} × 10⁻¹⁹ C   |   Cloth: ${n > 0 ? '−' : n < 0 ? '+' : ''}${Math.abs(n)}e   |   total = 0 (conserved)`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Rub two neutral objects together', col) + 6;
    const bw = (w - 36) / 2, bh = h - top - 70;
    [[12, 'Glass rod', -n], [w - 12 - bw, 'Silk cloth', n]].forEach(([x, name, extra], k) => {
      ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(x, top, bw, bh);
      text(ctx, name, x + bw / 2, top + bh + 14, { color: col.ink, size: 12, weight: 700, align: 'center' });
      const ne = N + extra;
      for (let i = 0; i < N; i++) {
        const cx = x + bw * (0.25 + 0.5 * (i % 2)), cy = top + bh * (0.12 + 0.76 * Math.floor(i / 2) / 3.2);
        dot(ctx, cx, cy, 8, col.s[2]); text(ctx, '+', cx, cy, { color: col.panel, size: 13, weight: 700, align: 'center' });
        if (i < ne) { const ex = cx + 18, ey = cy + 1; dot(ctx, ex, ey, 6, col.s[0]); text(ctx, '−', ex, ey, { color: col.panel, size: 12, weight: 700, align: 'center' }); }
      }
      if (extra > 0) for (let i = N; i < ne; i++) { const j = i - N, ex = x + bw * 0.1 + (j % 4) * 14, ey = top + bh - 10 - Math.floor(j / 4) * 14; dot(ctx, ex, ey, 6, col.s[0]); text(ctx, '−', ex, ey, { color: col.panel, size: 12, weight: 700, align: 'center' }); }
    });
    const net = (v) => (v === 0 ? 'neutral' : v > 0 ? `+${v}e` : `−${-v}e`);
    text(ctx, 'net: ' + net(n), 12 + bw / 2, h - 18, { color: n > 0 ? col.s[2] : n < 0 ? col.s[0] : col.muted, size: 12, weight: 700, align: 'center' });
    text(ctx, 'net: ' + net(-n), w - 12 - bw / 2, h - 18, { color: n < 0 ? col.s[2] : n > 0 ? col.s[0] : col.muted, size: 12, weight: 700, align: 'center' });
  };
  upd();
}
