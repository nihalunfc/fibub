// The DNA double helix in 3D and how base pairing decides its stability. A pairs with T through 2 hydrogen bonds, G with C
// through 3. Drag to turn it; choose an AT-rich, balanced or GC-rich piece and slide the temperature: the strands come apart
// (melt) at a temperature that rises with GC content, and the absorbance at 260 nm rises as the bases unstack.
import { canvas, axes, line, dot, text, row, slider, choice, readout, loop, title } from '../kit.js';
import { orbit } from './_3d.js';

const SEQ = { at: 'ATATTAATTATAATTACATA', mid: 'ATGCATGCCATGGTACATGC', gc: 'GCGCATGCGCCGGCGGCTCA' };
const COMP = { A: 'T', T: 'A', G: 'C', C: 'G' };
export default function (host) {
  let id = 'mid', T = 40, spin = true;
  const cv = canvas(host, { aspect: 0.95, max: 470, min: 340, label: 'A DNA double helix in 3D with base pairs and a melting curve' });
  const cam = orbit(cv, { yaw: 0.3, pitch: 0.15 });
  choice(row(host), 'Sequence (20 pairs)', [['at', 'AT-rich'], ['mid', 'Balanced'], ['gc', 'GC-rich']], id, (v) => { id = v; set(); });
  const c1 = row(host);
  slider(c1, { label: 'Temperature (°C)', min: 40, max: 110, step: 1, value: T, oninput: (v) => { T = v; set(); } });
  loop(host, (dt) => { if (spin && !cam.dragging) { cam.yaw += dt * 0.35; cv.redraw(); } });
  const out = readout(host);
  const gcPct = (s) => (s.split('').filter((b) => 'GC'.includes(b)).length / s.length) * 100;
  const Tm = (s) => 69.3 + 0.41 * gcPct(s);
  const thr = (s, i) => Tm(s) + ((s[i] === 'G' || s[i] === 'C' ? 4 : -4)) + (Math.min(i, s.length - 1 - i) < 3 ? -(3 - Math.min(i, s.length - 1 - i)) * 3 : 0) + Math.sin(i * 2.3) * 1.2; // ends fray first
  const frac = (s, t) => s.split('').filter((_, i) => t > thr(s, i)).length / s.length;
  function set() {
    const s = SEQ[id], melted = Math.round(frac(s, T) * s.length), hb = s.split('').reduce((a, b, i) => a + (T > thr(s, i) ? 0 : 'GC'.includes(b) ? 3 : 2), 0);
    out.innerHTML = `GC content <b>${gcPct(s).toFixed(0)}%</b>, so Tm ≈ 69.3 + 0.41 × %GC = <b>${Tm(s).toFixed(1)} °C</b>. At ${T} °C: ${melted} of ${s.length} pairs open, ${hb} hydrogen bonds still hold the strands (A–T 2, G–C 3). Absorbance at 260 nm ≈ ${(1 + 0.4 * frac(s, T)).toFixed(2)} × the cold value (hyperchromic effect). Higher GC means more H-bonds and stronger stacking, so a higher Tm.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const s = SEQ[id], n = s.length, mh = h * 0.68, P = cam.proj(w, mh, Math.min(w, mh) * 0.36, w * 0.5, mh * 0.5 + 16), cb = [col.s[0], col.s[1], col.s[2], col.s[3]], bi = { A: 0, T: 1, G: 2, C: 3 };
    title(ctx, 'DNA double helix and melting', col);
    const segs = [], dy = 1.9 / n, p1 = [], p2 = [];
    for (let i = 0; i < n; i++) {
      const th = i * 0.6283, m = T > thr(s, i) ? 1 : 0, r = 0.55 * (1 + 1.1 * m), y = (n / 2 - i) * dy;
      p1.push([r * Math.cos(th), y, r * Math.sin(th)]); p2.push([-r * Math.cos(th), y, -r * Math.sin(th)]);
      segs.push({ i, m });
    }
    const items = [];
    for (let i = 0; i < n; i++) {
      const b1 = s[i], b2 = COMP[b1], A = P(p1[i]), B = P(p2[i]), M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
      items.push({ z: (A[2] + B[2]) / 2, f: () => {
        const open = segs[i].m;
        ctx.lineWidth = 3.5; ctx.strokeStyle = cb[bi[b1]]; ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(open ? A[0] + (M[0] - A[0]) * 0.7 : M[0], open ? A[1] + (M[1] - A[1]) * 0.7 : M[1]); ctx.stroke();
        ctx.strokeStyle = cb[bi[b2]]; ctx.beginPath(); ctx.moveTo(B[0], B[1]); ctx.lineTo(open ? B[0] + (M[0] - B[0]) * 0.7 : M[0], open ? B[1] + (M[1] - B[1]) * 0.7 : M[1]); ctx.stroke();
        if (!open) { ctx.save(); ctx.setLineDash([2, 2]); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.2; const nb = 'GC'.includes(b1) ? 3 : 2; for (let k = 0; k < nb; k++) { const o = (k - (nb - 1) / 2) * 3; ctx.beginPath(); ctx.moveTo(M[0] - 3, M[1] + o); ctx.lineTo(M[0] + 3, M[1] + o); ctx.stroke(); } ctx.restore(); }
        dot(ctx, A[0], A[1], 4.2, col.muted); dot(ctx, B[0], B[1], 4.2, col.muted);
        if (A[2] > 0 || B[2] > 0) { text(ctx, b1, (A[0] + M[0]) / 2, (A[1] + M[1]) / 2 - 7, { color: col.ink, size: 9, weight: 700, align: 'center', fit: false }); }
      } });
    }
    items.sort((a, b) => a.z - b.z).forEach((it) => it.f());
    // backbone lines
    [p1, p2].forEach((pp) => { ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.globalAlpha = 0.7; ctx.beginPath(); pp.forEach((p, i) => { const q = P(p); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }); ctx.stroke(); ctx.globalAlpha = 1; });
    const lg = [['A', 0], ['T', 1], ['G', 2], ['C', 3]]; lg.forEach(([b, k], j) => text(ctx, b, 12 + j * 18, mh - 14, { color: cb[k], size: 12, weight: 800 }));
    text(ctx, 'Drag to turn', w - 8, mh - 4, { color: col.muted, size: 10, align: 'right' });
    // melting curve
    const AX = axes(ctx, w, h, col, { x: [40, 110], y: [1, 1.45], t: mh + 8, l: 44, xlabel: '°C', ylabel: 'A₂₆₀ (relative)', fx: (v) => v, yt: [1, 1.2, 1.4], fy: (v) => v.toFixed(1) });
    const pts = []; for (let t = 40; t <= 110; t += 1) pts.push([AX.X(t), AX.Y(1 + 0.4 * frac(s, t))]); line(ctx, pts, col.s[0], 2.5);
    dot(ctx, AX.X(T), AX.Y(1 + 0.4 * frac(s, T)), 6, col.s[1], col.panel);
    ctx.strokeStyle = col.muted; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(AX.X(Tm(s)), AX.T); ctx.lineTo(AX.X(Tm(s)), AX.B); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'Tm', AX.X(Tm(s)) + 4, AX.T + 8, { color: col.muted, size: 10 });
  };
  set();
}
