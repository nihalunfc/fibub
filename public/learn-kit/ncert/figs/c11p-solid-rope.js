// Class 11 Mechanical Properties of Solids: choosing a safe cable. Each steel strand of diameter d breaks at a stress of about 500 MPa (a typical breaking stress), so the breaking force is
// n x (500e6 x pi d^2/4). The safety factor = breaking force / load. Engineers keep it well above 1 (5 or more for lifts and cranes) so the stress stays in the elastic region, far from the breaking stress.
import { canvas, text, title, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let tonnes = 3, n = 7, d = 3;
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 280, label: 'A crane cable made of several strands with its safety factor against the load' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'load (tonnes)', min: 0.5, max: 10, step: 0.5, value: tonnes, fmt: (v) => v + ' t', oninput: (v) => { tonnes = v; go(); } });
  slider(ctl, { label: 'strands', min: 1, max: 19, step: 1, value: n, fmt: (v) => v, oninput: (v) => { n = v; go(); } });
  slider(ctl, { label: 'strand diameter (mm)', min: 1, max: 6, step: 0.5, value: d, fmt: (v) => v + ' mm', oninput: (v) => { d = v; go(); } });
  const calc = () => { const Fb = n * 500e6 * Math.PI * (d / 2000) ** 2, F = tonnes * 1000 * 9.8; return { Fb, F, sf: Fb / F, stress: F / (n * Math.PI * (d / 2000) ** 2) }; };
  const go = () => { const c = calc(); ro.textContent = `Load ${(c.F / 1000).toFixed(1)} kN, breaking force ${(c.Fb / 1000).toFixed(0)} kN, safety factor ${c.sf.toFixed(1)}. Stress in the steel is ${(c.stress / 1e6).toFixed(0)} MPa. ${c.sf < 1 ? 'The cable snaps.' : c.sf < 5 ? 'Holds, but too close to the limit for a crane.' : 'Safe by the usual rule of thumb (5 or more).'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Crane cable: how many strands do you need?', col), c = calc(), cx = w * 0.3, cy = top + 70;
    const R = Math.min(44, w * 0.12), r = Math.max(2.5, Math.min(9, R / Math.sqrt(n) * 0.9 * d / 3));
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, R + 4, 0, 7); ctx.stroke();
    for (let i = 0; i < n; i++) { const ring = i === 0 ? 0 : i < 7 ? 1 : 2, k = i === 0 ? 0 : i < 7 ? i - 1 : i - 7, cnt = ring === 1 ? 6 : 12, rad = ring === 0 ? 0 : ring === 1 ? R * 0.42 : R * 0.78, an = (k / cnt) * Math.PI * 2; dot(ctx, cx + Math.cos(an) * rad, cy + Math.sin(an) * rad, r, col.s[0], col.panel); }
    text(ctx, n + (n === 1 ? ' strand of ' : ' strands of ') + d + ' mm', cx, cy + R + 22, { color: col.ink, size: 11, align: 'center' });
    const bx = w * 0.56, bw = w * 0.36, by = top + 20, bh = h - by - 50, mx = Math.max(c.Fb, c.F) * 1.1;
    ctx.fillStyle = col.line; ctx.fillRect(bx, by, bw * 0.4, bh); ctx.fillRect(bx + bw * 0.55, by, bw * 0.4, bh);
    ctx.fillStyle = col.s[3]; const lh = bh * c.F / mx; ctx.fillRect(bx, by + bh - lh, bw * 0.4, lh);
    ctx.fillStyle = c.sf >= 5 ? col.good : c.sf >= 1 ? col.warn : col.bad; const bh2 = bh * c.Fb / mx; ctx.fillRect(bx + bw * 0.55, by + bh - bh2, bw * 0.4, bh2);
    text(ctx, 'load', bx + bw * 0.2, by + bh + 14, { color: col.ink, size: 11, align: 'center' }); text(ctx, 'breaks at', bx + bw * 0.75, by + bh + 14, { color: col.ink, size: 11, align: 'center' });
    text(ctx, 'safety factor ' + c.sf.toFixed(1), w / 2, h - 12, { color: col.ink, size: 13, weight: 700, align: 'center' });
  };
  go();
}
