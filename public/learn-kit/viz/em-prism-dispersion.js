// A prism splits white light because the refractive index is a little larger for violet than for red (Cauchy: n = A + B/λ²).
// Slide the angle of incidence and the apex angle: the deviation δ = i₁ + i₂ − A is smallest when the ray passes symmetrically
// through the prism (i₁ = i₂). "Dispersion" exaggerates the colour spread so you can see it; 1× is ordinary crown glass.
// Seven colours are traced with the full law of refraction at both faces.
import { canvas, text, row, slider, button, readout, line } from '../kit.js';

const COL = [[0.65, 5, 'red'], [0.60, 1, 'orange'], [0.575, 6, 'yellow'], [0.53, 2, 'green'], [0.49, 4, 'cyan'], [0.45, 0, 'blue'], [0.41, 3, 'violet']];
export default function (host) {
  let A = 60, i1 = 50, k = 3;
  const cv = canvas(host, { aspect: 0.8, max: 380, min: 270, label: 'White light splitting into colours through a glass prism' });
  const ctl = row(host), c2 = row(host);
  slider(ctl, { label: 'Apex angle A', min: 30, max: 75, value: A, step: 1, fmt: (x) => x + '°', oninput: (x) => { A = x; upd(); } });
  const sl = slider(ctl, { label: 'Incidence i₁', min: 20, max: 80, value: i1, step: 1, fmt: (x) => x + '°', oninput: (x) => { i1 = x; upd(); } });
  slider(c2, { label: 'Dispersion', min: 0.5, max: 6, value: k, step: 0.25, fmt: (x) => x.toFixed(2) + '×', oninput: (x) => { k = x; upd(); } });
  button(c2, 'Minimum deviation', () => { const n = nOf(0.53); i1 = Math.round(Math.asin(Math.min(1, n * Math.sin(A * Math.PI / 360))) * 180 / Math.PI); sl.set(i1); upd(); });
  const out = readout(host);
  const nOf = (lam) => 1.5 + k * 0.0045 / (lam * lam) - k * 0.0045 / (0.53 * 0.53) + 0.0045 / (0.53 * 0.53);
  const dev = (n) => { const a = A * Math.PI / 180, r1 = Math.asin(Math.sin(i1 * Math.PI / 180) / n), r2 = a - r1, s = n * Math.sin(r2); if (s >= 1) return null; return i1 + Math.asin(s) * 180 / Math.PI - A; };
  function upd() { const dr = dev(nOf(0.65)), dv = dev(nOf(0.41)), dg = dev(nOf(0.53)); out.innerHTML = dg === null ? 'Total internal reflection at the second face: the light cannot leave. Reduce i₁ or A.' : `Green: n = ${nOf(0.53).toFixed(3)}, δ = <b>${dg.toFixed(1)}°</b>. Red δ = ${dr === null ? '—' : dr.toFixed(2)}°, violet δ = ${dv === null ? '—' : dv.toFixed(2)}°: violet bends more, spread ${dr !== null && dv !== null ? (dv - dr).toFixed(2) : '—'}°. Minimum deviation occurs at i₁ = i₂; try the button.`; cv.redraw(); }
  const refract = (d, N, a, b) => { const c = -(d[0] * N[0] + d[1] * N[1]), r = a / b, q = 1 - r * r * (1 - c * c); if (q < 0) return null; const f = r * c - Math.sqrt(q); return [r * d[0] + f * N[0], r * d[1] + f * N[1]]; };
  cv.draw = (ctx, w, h, col) => {
    const cx = w * 0.42, yt = 50, yb = h - 70, H = yb - yt, hw = H * Math.tan(A * Math.PI / 360), Nn = Math.hypot(H, hw), nL = [-H / Nn, -hw / Nn], nR = [H / Nn, -hw / Nn];
    ctx.beginPath(); ctx.moveTo(cx, yt); ctx.lineTo(cx + hw, yb); ctx.lineTo(cx - hw, yb); ctx.closePath(); ctx.globalAlpha = 0.14; ctx.fillStyle = col.s[4]; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke();
    const f = 0.5, M = [cx - hw * f, yt + H * f], inD = (() => { const a = -i1 * Math.PI / 180, v = [-nL[0], -nL[1]]; return [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)]; })();
    const st = [M[0] - inD[0] * 150, M[1] - inD[1] * 150]; ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(st[0], st[1]); ctx.lineTo(M[0], M[1]); ctx.stroke();
    text(ctx, 'white light', Math.max(6, st[0]), st[1] - 10, { color: col.ink, size: 10.5 });
    const sx = w - 26; line(ctx, [[sx, 20], [sx, h - 20]], col.muted, 1.5, [4, 3]); text(ctx, 'screen', sx - 4, h - 10, { color: col.muted, size: 10, align: 'right' });
    COL.forEach(([lam, ci, name]) => { const n = nOf(lam), d1 = refract(inD, nL, 1, n); if (!d1) return;
      // hit right face: right face line through apex (cx,yt) with direction (hw,H); solve M + t d1
      const ex = hw, ey = H, det = d1[0] * -ey - d1[1] * -ex; const t = ((cx - M[0]) * -ey - (yt - M[1]) * -ex) / (det || 1e-9), Q = [M[0] + d1[0] * t, M[1] + d1[1] * t];
      const d2 = refract(d1, [-nR[0], -nR[1]], n, 1); ctx.strokeStyle = col.s[ci]; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(M[0], M[1]); ctx.lineTo(Q[0], Q[1]); ctx.stroke();
      if (!d2 || d2[0] <= 0.02) return; const tt = (sx - Q[0]) / d2[0]; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(Q[0], Q[1]); ctx.lineTo(sx, Q[1] + d2[1] * tt); ctx.stroke(); text(ctx, name[0], sx - 12, Q[1] + d2[1] * tt, { color: col.s[ci], size: 10, weight: 700, align: 'right', halo: col.panel }); });
    text(ctx, `A = ${A}°   i₁ = ${i1}°`, 10, 16, { color: col.ink, size: 12, weight: 700 });
  };
  upd();
}
