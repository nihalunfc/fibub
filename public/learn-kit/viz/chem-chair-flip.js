// Cyclohexane chair and ring flip in 3D. Axial bonds (up/down) and equatorial bonds (round the edge) swap places when the
// ring flips. Drag to turn it; slide "Flip" to move between the two chairs (a simplified path: the real one goes through
// half-chair and twist-boat forms with a 45 kJ/mol barrier). A methyl group prefers the roomier equatorial position.
import { canvas, text, row, slider, button, readout, title } from '../kit.js';
import { orbit } from './_3d.js';

export default function (host) {
  let f = 0, show = true;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'A cyclohexane chair in 3D that flips between its two chair forms' });
  const cam = orbit(cv, { yaw: 0.8, pitch: 0.28 });
  const c = row(host);
  const s = slider(c, { label: 'Ring flip', min: 0, max: 1, step: 0.01, value: 0, fmt: (v) => (v < 0.02 ? 'chair A' : v > 0.98 ? 'chair B' : Math.round(v * 100) + '%'), oninput: (v) => { f = v; set(); } });
  button(c, 'Flip', () => { let t = 0; const to = f < 0.5 ? 1 : 0, from = f; const id = setInterval(() => { t += 0.04; f = from + (to - from) * Math.min(1, t); s.set(f); set(); if (t >= 1) clearInterval(id); }, 30); });
  const out = readout(host);
  function set() {
    const eqMe = f < 0.5, dG = 7.3, ratio = Math.exp(dG * 1000 / (8.314 * 298));
    out.innerHTML = `The methyl group (orange) is now <b>${eqMe ? 'equatorial' : 'axial'}</b>. ${eqMe ? 'This is the stable chair.' : 'Axial CH₃ bumps into the two axial H atoms on the same side (1,3-diaxial strain, about 7.3 kJ/mol).'} At 298 K the ratio equatorial : axial is e<sup>ΔG/RT</sup> ≈ <b>${ratio.toFixed(0)} : 1</b> (about ${(ratio / (1 + ratio) * 100).toFixed(0)}% equatorial). Every C has one axial and one equatorial H; after a flip all swap.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Cyclohexane: chair ⇄ chair', col);
    const P = cam.proj(w, h, Math.min(w, h) * 0.3, w / 2, h / 2 + 10), cs = Math.cos(Math.PI * f), ring = [];
    for (let i = 0; i < 6; i++) { const a = (i * Math.PI) / 3, s = i % 2 ? -1 : 1; ring.push({ a, s, p: [Math.cos(a), 0.26 * s * cs, Math.sin(a)] }); }
    const segs = [];
    ring.forEach((r, i) => segs.push({ a: r.p, b: ring[(i + 1) % 6].p, c: col.ink, w: 3 }));
    ring.forEach((r, i) => {
      const ax = r.s * cs >= 0 ? 1 : -1, out = [Math.cos(r.a) * 0.9, 0, Math.sin(r.a) * 0.9];
      const axV = [0, r.s * 0.95, 0], eqV = [out[0] * 0.95, -r.s * 0.3, out[2] * 0.95];
      // blend between the two flip states: the bond that was axial becomes equatorial and vice versa
      const A0 = axV, E0 = eqV, A1 = eqV.map((v, k) => (k === 1 ? r.s * 0.3 : v)), E1 = [0, -r.s * 0.95, 0];
      const mix = (u, v) => u.map((x, k) => x + (v[k] - x) * f);
      const aV = mix(A0, A1), eV = mix(E0, E1);
      const addB = (V, kind) => segs.push({ a: r.p, b: r.p.map((x, k) => x + V[k]), c: i === 0 && kind === 'eq0' ? col.s[1] : col.muted, w: i === 0 && kind === 'eq0' ? 4 : 1.8, h: true, hot: i === 0 && kind === 'eq0', lab: i === 0 && kind === 'eq0' ? 'CH₃' : '' });
      addB(aV, 'ax'); addB(eV, 'eq0');
    });
    const draws = segs.map((sg) => ({ ...sg, A: P(sg.a), B: P(sg.b) })).sort((x, y) => x.A[2] + x.B[2] - y.A[2] - y.B[2]);
    draws.forEach((d) => {
      ctx.strokeStyle = d.c; ctx.lineWidth = d.w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(d.A[0], d.A[1]); ctx.lineTo(d.B[0], d.B[1]); ctx.stroke();
      if (d.h) { ctx.beginPath(); ctx.arc(d.B[0], d.B[1], d.hot ? 8 : 3.5, 0, 7); ctx.fillStyle = d.hot ? col.s[1] : col.s[0]; ctx.globalAlpha = 0.9; ctx.fill(); ctx.globalAlpha = 1; if (d.lab) text(ctx, d.lab, d.B[0], d.B[1], { color: col.bg, size: 8, weight: 700, align: 'center', fit: false }); }
    });
    text(ctx, 'blue dots: H · orange: CH₃ on C1', 10, h - 22, { color: col.muted, size: 10 });
    text(ctx, 'Drag to turn', w - 8, h - 8, { color: col.muted, size: 10, align: 'right' });
  };
  set();
}
