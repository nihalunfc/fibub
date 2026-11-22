// Moving charges and magnetic fields: charged particles accelerated through V volts enter a uniform field B
// (into the screen). Each moves in a circle of radius r = mv/(qB) = √(2mV/q)/B, period 2πm/(qB). Positive charges
// curve one way, the electron the other. The picture is 24 cm tall, so big circles leave the screen.
import { canvas, row, slider, readout, text, line, dot, loop, fmt } from '../../kit.js';

const QE = 1.6e-19, MP = 1.67e-27;
const P = [
  { k: 'p', name: 'proton', m: MP, q: QE },
  { k: 'd', name: 'deuteron', m: 2 * MP, q: QE },
  { k: 'a', name: 'alpha', m: 4 * MP, q: 2 * QE },
  { k: 'e', name: 'electron', m: 9.1e-31, q: -QE },
];
export default function (host) {
  let V = 1000, B = 0.1, t = 0;
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 250, label: 'Circular paths of charged particles in a magnetic field' });
  const ctl = row(host);
  slider(ctl, { label: 'Accelerating V', min: 100, max: 20000, value: V, log: true, fmt: (v) => `${fmt(v, 2)} V`, oninput: (v) => { V = v; upd(); } });
  slider(ctl, { label: 'Field B', min: 0.02, max: 1, value: B, log: true, fmt: (v) => `${fmt(v, 2)} T`, oninput: (v) => { B = v; upd(); } });
  const out = readout(host);
  const r = (p) => Math.sqrt((2 * p.m * V) / Math.abs(p.q)) / B;
  const T = (p) => (2 * Math.PI * p.m) / (Math.abs(p.q) * B);
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); });
  anim.button(ctl);
  const upd = () => {
    cv.redraw();
    out.innerHTML = P.map((p) => `${p.name}: r = <b>${fmt(r(p) * 100, 3)} cm</b>, T = ${fmt(T(p), 3)} s`).join(' · ') + '. Note T does not depend on V: faster particles take bigger circles in the same time.';
  };
  cv.draw = (ctx, w, h, col) => {
    const S = h / 0.24, x0 = w * 0.18, y0 = h / 2;
    ctx.fillStyle = col.muted;
    for (let x = 14; x < w; x += 28) for (let y = 14; y < h; y += 28) text(ctx, '×', x, y, { color: col.line, size: 12, align: 'center' });
    line(ctx, [[0, y0], [x0, y0]], col.muted, 1.5, [4, 4]);
    text(ctx, 'B into screen', w - 10, h - 12, { color: col.muted, size: 11, align: 'right' });
    P.forEach((p, i) => {
      const R = r(p) * S, s = Math.sign(p.q), cy = y0 - s * R, c = col.s[i];
      ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x0, cy, Math.max(R, 0.5), 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      // moving dot: visual period scaled so the proton takes 3 s; the electron is shown still (it would be a blur)
      if (p.k !== 'e') {
        const ph = (2 * Math.PI * t) / (3 * (T(p) / T(P[0]))), a = s > 0 ? Math.PI / 2 - ph : -Math.PI / 2 + ph;
        dot(ctx, x0 + R * Math.cos(a), cy + R * Math.sin(a), 4.5, c, col.panel);
      }
      const ly = s > 0 ? Math.max(14, cy - R - 8) : Math.min(h - 26, cy + R + 10);
      text(ctx, p.name, x0 + 6 + i * 4, ly + (i % 2) * 12 * (s > 0 ? 1 : -1), { color: c, size: 11, weight: 600, halo: col.panel });
    });
    dot(ctx, x0, y0, 4, col.ink);
    line(ctx, [[10, h - 26], [10 + 0.05 * S, h - 26]], col.ink, 2);
    text(ctx, '5 cm', 10, h - 14, { color: col.ink, size: 11 });
  };
  upd();
}
