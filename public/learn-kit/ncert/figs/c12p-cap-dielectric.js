// Class 12 Electrostatic Potential and Capacitance: a dielectric slab in a capacitor. Polarisation puts bound charges on the slab faces that weaken the field:
// E = E0/k inside. Battery CONNECTED (V fixed): C = kC0, Q = kQ0 (more charge flows in), E = V/d unchanged. Battery REMOVED (Q fixed): C = kC0, V = V0/k,
// E = E0/k, energy U = U0/k (the slab is pulled in and does work). C0 = 50 pF, V0 = 12 V.
import { canvas, text, title, line, arrow, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let kap = 4, inn = false, bat = true;
  const C0 = 50e-12, V0 = 12;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A parallel-plate capacitor with a dielectric slab, with the battery connected or removed' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Slab', [[false, 'Out'], [true, 'In']], false, (v) => { inn = v; go(); });
  choice(ctl, 'Battery', [[true, 'Connected'], [false, 'Removed']], true, (v) => { bat = v; go(); });
  slider(ctl, { label: 'dielectric constant κ', min: 1, max: 10, step: 0.5, value: kap, fmt: (v) => v.toFixed(1), oninput: (v) => { kap = v; go(); } });
  const st = () => { const k = inn ? kap : 1, C = k * C0, Q = bat ? C * V0 : C0 * V0, V = Q / C, E = V / 1, U = 0.5 * Q * V; return { k, C, Q, V, U, E: V / V0 }; };
  const go = () => { const s = st(); ro.textContent = `C = ${(s.C * 1e12).toFixed(0)} pF,  Q = ${(s.Q * 1e12).toFixed(0)} pC,  V = ${s.V.toFixed(2)} V,  field = ${(s.E).toFixed(2)} × E₀,  energy = ${(s.U * 1e9).toFixed(2)} nJ.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, bat ? 'Battery connected: V stays 12 V' : 'Battery removed: Q stays fixed', col) + 22, cx = w / 2, pw = Math.min(w - 90, 250), y1 = top + 30, y2 = h - 56, s = st();
    ctx.fillStyle = col.s[2]; ctx.fillRect(cx - pw / 2, y1 - 6, pw, 6); ctx.fillStyle = col.s[0]; ctx.fillRect(cx - pw / 2, y2, pw, 6);
    if (inn) { ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.25; ctx.fillRect(cx - pw / 2 + 12, y1 + 2, pw - 24, y2 - y1 - 4); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[3]; ctx.strokeRect(cx - pw / 2 + 12, y1 + 2, pw - 24, y2 - y1 - 4); }
    const nq = Math.max(2, Math.min(12, Math.round(s.Q / (C0 * V0) * 5))), bound = inn ? Math.round(nq * (1 - 1 / kap)) : 0;
    for (let i = 0; i < nq; i++) { const x = cx - pw / 2 + (i + 0.5) * pw / nq; text(ctx, '+', x, y1 - 15, { color: col.s[2], size: 13, weight: 700, align: 'center' }); text(ctx, '−', x, y2 + 17, { color: col.s[0], size: 14, weight: 700, align: 'center' }); }
    for (let i = 0; i < bound; i++) { const x = cx - pw / 2 + 20 + (i + 0.5) * (pw - 40) / Math.max(1, bound); text(ctx, '−', x, y1 + 12, { color: col.s[0], size: 12, weight: 700, align: 'center' }); text(ctx, '+', x, y2 - 10, { color: col.s[2], size: 12, weight: 700, align: 'center' }); }
    const na = 5, len = (y2 - y1 - 12) * Math.max(0.15, s.E);
    for (let i = 0; i < na; i++) { const x = cx - pw / 2 + (i + 0.5) * pw / na, mid = (y1 + y2) / 2; arrow(ctx, x, mid - len / 2, x, mid + len / 2, col.ink, 2, 6); }
    text(ctx, 'E = ' + s.E.toFixed(2) + ' E₀', cx + pw / 2 - 4, (y1 + y2) / 2, { color: col.ink, size: 11, weight: 700, align: 'right', halo: col.panel });
    if (bat) { line(ctx, [[cx - pw / 2 - 10, y1 - 3], [cx - pw / 2 - 10, top - 6], [cx, top - 6]], col.ink, 1.5); line(ctx, [[cx - pw / 2 - 10, y2 + 3], [cx - pw / 2 - 10, h - 10], [cx, h - 10]], col.ink, 1.5); text(ctx, '12 V', cx + 6, top - 6, { color: col.s[3], size: 12, weight: 700 }); }
    if (inn) text(ctx, 'bound charges on the slab', cx - pw / 2 + 16, (y1 + y2) / 2 + 22, { color: col.s[3], size: 10.5, weight: 700, halo: col.panel });
  };
  go();
}
