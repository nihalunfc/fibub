// Class 11 Biology, Breathing and Exchange of Gases: a spirogram. The trace of lung volume against time shows the tidal volume (TV), inspiratory reserve volume (IRV), expiratory reserve volume (ERV) and the residual volume (RV)
// that cannot be breathed out. Capacities add volumes: IC = TV + IRV, EC = TV + ERV, FRC = ERV + RV, VC = ERV + TV + IRV, TLC = VC + RV. Typical adult values in mL: TV 500, IRV 2500-3000, ERV 1000-1100, RV 1100-1200.
import { canvas, text, title, axes, line, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let tv = 500, irv = 2600, erv = 1100, rv = 1200, mode = 'quiet', ph = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'A spirogram of lung volume against time with tidal volume, reserve volumes and residual volume' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Breathing', [['quiet', 'Quiet'], ['deep', 'Deep (max)']], mode, (v) => { mode = v; go(); });
  slider(ctl, { label: 'Tidal volume', min: 300, max: 800, step: 50, value: tv, fmt: (v) => v + ' mL', oninput: (v) => { tv = v; go(); } });
  slider(ctl, { label: 'Residual volume', min: 800, max: 1600, step: 100, value: rv, fmt: (v) => v + ' mL', oninput: (v) => { rv = v; go(); } });
  const anim = loop(host, (dt) => { ph += dt * 0.9; cv.redraw(); }); anim.button(ctl);
  const lo = () => rv + erv, hiq = () => rv + erv + tv, top = () => rv + erv + tv + irv;
  const go = () => { const vc = erv + tv + irv; ro.textContent = `Vital capacity VC = ERV + TV + IRV = ${erv} + ${tv} + ${irv} = ${vc} mL. Total lung capacity TLC = VC + RV = ${vc + rv} mL. Functional residual capacity FRC = ERV + RV = ${erv + rv} mL. Inspiratory capacity IC = TV + IRV = ${tv + irv} mL. The residual volume stays in the lungs even after the strongest breath out.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Spirogram: volumes and capacities', col), mx = 5600;
    const A = axes(ctx, w, h, col, { x: [0, 10], y: [0, mx], xlabel: 'time', ylabel: 'lung volume (mL)', l: 56, t: t0 + 10, b: 38, xt: [], yt: [0, 1000, 2000, 3000, 4000, 5000] });
    // simple, explicit trace: quiet breaths, then one maximal breath in and out
    const trace = (x) => { const p = (Math.sin(x * 2 * Math.PI / 2.5 - Math.PI / 2) + 1) / 2, quiet = rv + erv + tv * p; if (mode === 'quiet') return quiet; if (x < 2.5) return quiet; if (x < 5) { const u = (x - 2.5) / 2.5; return quiet + (top() - quiet) * Math.sin(u * Math.PI / 2) ** 2; } if (x < 7.5) { const u = (x - 5) / 2.5; return top() + (rv - top()) * Math.sin(u * Math.PI / 2) ** 2; } if (x < 8.5) return rv + (rv + erv + tv * 0.5 - rv) * ((x - 7.5)); return quiet; };
    const pts = []; for (let x = 0; x <= 10; x += 0.1) pts.push([A.X(x), A.Y(Math.min(mx, trace(x)))]);
    line(ctx, pts, col.s[0], 2.5);
    const lv = [[rv, 'RV', col.s[5]], [rv + erv, 'ERV ↑', col.s[2]], [rv + erv + tv, 'TV ↑', col.s[0]], [top(), 'IRV ↑', col.s[3]]];
    lv.forEach(([v, n, c]) => { line(ctx, [[A.L, A.Y(v)], [A.R, A.Y(v)]], c, 1, [3, 3]); });
    const seg = [[0, rv, 'RV', col.s[5]], [rv, rv + erv, 'ERV', col.s[2]], [rv + erv, rv + erv + tv, 'TV', col.s[0]], [rv + erv + tv, top(), 'IRV', col.s[3]]];
    seg.forEach(([a, b, n, c]) => { ctx.fillStyle = c; ctx.globalAlpha = 0.25; ctx.fillRect(A.R - 52, A.Y(b), 46, A.Y(a) - A.Y(b)); ctx.globalAlpha = 1; if (A.Y(a) - A.Y(b) > 11) text(ctx, n, A.R - 29, (A.Y(a) + A.Y(b)) / 2, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); else text(ctx, n, A.R - 29, (A.Y(a) + A.Y(b)) / 2 - 6, { color: col.ink, size: 10, weight: 700, align: 'center' }); });
    const t = (ph % 10); const px = A.X(t); line(ctx, [[px, A.T], [px, A.B]], col.muted, 1); ctx.beginPath(); ctx.arc(px, A.Y(Math.min(mx, trace(t))), 5, 0, 7); ctx.fillStyle = col.s[3]; ctx.fill();
  };
  go();
}
