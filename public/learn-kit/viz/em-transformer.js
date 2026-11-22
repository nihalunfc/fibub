// A transformer. The alternating current in the primary makes a changing flux in the iron core; the same flux threads the
// secondary, so each turn has the same EMF and V_s/V_p = N_s/N_p. Change the turns and the load. For an ideal transformer
// power in = power out, so more voltage means less current. Lower the efficiency to see the losses (heat in the core and
// windings). Flux arrows in the core change direction with the AC.
import { canvas, axes, line, text, row, slider, readout, loop } from '../kit.js';

export default function (host) {
  let Np = 100, Ns = 300, Vp = 230, RL = 50, eff = 100, t = 0;
  const cv = canvas(host, { aspect: 1.0, max: 420, min: 330, label: 'A transformer with primary and secondary coils on an iron core' });
  const ctl = row(host), c2 = row(host);
  slider(ctl, { label: 'Primary turns', min: 20, max: 500, value: Np, step: 10, fmt: (x) => x, oninput: (x) => { Np = x; upd(); } });
  slider(ctl, { label: 'Secondary turns', min: 20, max: 500, value: Ns, step: 10, fmt: (x) => x, oninput: (x) => { Ns = x; upd(); } });
  slider(c2, { label: 'Primary V', min: 10, max: 400, value: Vp, step: 10, fmt: (x) => x + ' V', oninput: (x) => { Vp = x; upd(); } });
  slider(c2, { label: 'Load R', min: 5, max: 200, value: RL, step: 5, fmt: (x) => x + ' Ω', oninput: (x) => { RL = x; upd(); } });
  slider(c2, { label: 'Efficiency', min: 70, max: 100, value: eff, step: 1, fmt: (x) => x + '%', oninput: (x) => { eff = x; upd(); } });
  const out = readout(host);
  const anim = loop(host, (dt) => { t += dt * 2.2; cv.redraw(); }); anim.button(c2);
  const sol = () => { const Vs = Vp * Ns / Np, Is = Vs / RL, Pout = Vs * Is, Pin = Pout / (eff / 100); return { Vs, Is, Pout, Pin, Ip: Pin / Vp }; };
  function upd() { const s = sol(); out.innerHTML = `V<sub>s</sub> = V<sub>p</sub>N<sub>s</sub>/N<sub>p</sub> = <b>${s.Vs.toFixed(0)} V</b> (${Ns > Np ? 'step-up' : Ns < Np ? 'step-down' : '1 : 1'}). I<sub>s</sub> = ${s.Is.toFixed(2)} A, P<sub>out</sub> = ${s.Pout.toFixed(0)} W. I<sub>p</sub> = P<sub>in</sub>/V<sub>p</sub> = <b>${s.Ip.toFixed(2)} A</b>${eff === 100 ? ` (ideal: I<sub>p</sub>/I<sub>s</sub> = N<sub>s</sub>/N<sub>p</sub> = ${(Ns / Np).toFixed(2)}).` : `; lost as heat: ${(s.Pin - s.Pout).toFixed(0)} W.`} Step-up raises voltage but lowers current: power is not created.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const L = 40, R = w - 40, T = 40, B = 150, wd = 26, f = Math.sin(t);
    ctx.fillStyle = col.soft; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.fillRect(L, T, R - L, B - T); ctx.clearRect; ctx.fillStyle = col.panel; ctx.fillRect(L + wd, T + wd, R - L - 2 * wd, B - T - 2 * wd); ctx.strokeRect(L, T, R - L, B - T); ctx.strokeRect(L + wd, T + wd, R - L - 2 * wd, B - T - 2 * wd);
    const turns = (x0, n, c) => { const k = Math.min(14, Math.max(2, Math.round(n / 25))); ctx.strokeStyle = c; ctx.lineWidth = 2.4; for (let i = 0; i < k; i++) { const y = T + 10 + i * (B - T - 20) / (k - 1); ctx.beginPath(); ctx.moveTo(x0 - wd / 2 - 6, y); ctx.lineTo(x0 + wd / 2 + 6, y + 4); ctx.stroke(); } };
    turns(L + wd / 2, Np, col.s[0]); turns(R - wd / 2, Ns, col.s[5]);
    text(ctx, `Np = ${Np}`, L + wd / 2, T - 10, { color: col.s[0], size: 11, weight: 700, align: 'center' }); text(ctx, `Ns = ${Ns}`, R - wd / 2, T - 10, { color: col.s[5], size: 11, weight: 700, align: 'center' });
    // flux arrows around the core
    const cx = w / 2, cy = (T + B) / 2, pts = [[L + wd / 2, T + wd / 2], [R - wd / 2, T + wd / 2], [R - wd / 2, B - wd / 2], [L + wd / 2, B - wd / 2], [L + wd / 2, T + wd / 2]];
    ctx.globalAlpha = Math.min(1, Math.abs(f) + 0.1); ctx.fillStyle = col.s[2];
    for (let k = 0; k < 14; k++) { let d = ((k / 14 + (f > 0 ? 1 : -1) * 0) % 1) * 1; const seg = [[pts[0], pts[1]], [pts[1], pts[2]], [pts[2], pts[3]], [pts[3], pts[4]]]; const tot = 2 * (R - L - wd) + 2 * (B - T - wd); let s = (k / 14) * tot; let i = 0; const ln = seg.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1])); while (s > ln[i]) { s -= ln[i]; i++; } const [a, b] = seg[i], u = s / ln[i]; const x = a[0] + (b[0] - a[0]) * u, y = a[1] + (b[1] - a[1]) * u; ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 7); ctx.fill(); }
    ctx.globalAlpha = 1; text(ctx, `core flux ${f >= 0 ? '↻' : '↺'}`, cx, cy, { color: col.s[2], size: 12, weight: 700, align: 'center' });
    // waveforms
    const G = axes(ctx, w, h, col, { x: [0, 4 * Math.PI], y: [-1, 1], xlabel: 'time', ylabel: 'voltage', l: 40, t: 170, b: 32, xt: [0, 2 * Math.PI, 4 * Math.PI], fx: () => '', yt: [0], fy: () => '0' });
    const s = sol(), vm = Math.max(Vp, s.Vs);
    line(ctx, Array.from({ length: 161 }, (_, i) => { const x = i / 160 * 4 * Math.PI; return [G.X(x), G.Y(Vp / vm * Math.sin(x))]; }), col.s[0], 2.2);
    line(ctx, Array.from({ length: 161 }, (_, i) => { const x = i / 160 * 4 * Math.PI; return [G.X(x), G.Y(s.Vs / vm * Math.sin(x))]; }), col.s[5], 2.2);
    const a = ((t % (4 * Math.PI)) + 4 * Math.PI) % (4 * Math.PI); line(ctx, [[G.X(a), G.T], [G.X(a), G.B]], col.muted, 1, [3, 3]);
    text(ctx, 'V primary', G.R - 4, G.T + 8, { color: col.s[0], size: 10.5, weight: 700, align: 'right' }); text(ctx, 'V secondary (same scale)', G.R - 4, G.T + 24, { color: col.s[5], size: 10.5, weight: 700, align: 'right' });
  };
  upd();
}
