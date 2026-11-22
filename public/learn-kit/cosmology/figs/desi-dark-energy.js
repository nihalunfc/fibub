// 9.6 The w0-wa plane. Each point is one possible kind of dark energy, w(a) = w0 + wa(1 − a); a cosmological
// constant is the star at (−1, 0). The three crosses are the PUBLISHED best fits with ±1σ bars from DESI's second
// data release combined with the CMB and one of three supernova samples (DESI Collaboration 2025,
// arXiv:2503.14738): Pantheon+ w0 = −0.838 ± 0.055, wa = −0.62 +0.22/−0.19; Union3 −0.667 ± 0.088,
// −1.09 +0.31/−0.27; DES-SN5YR −0.752 ± 0.057, −0.86 +0.23/−0.20. They are not the full probability contours
// (which are tilted ellipses). The reader's own point (sliders) is drawn with its w(z) curve underneath.
import { canvas, axes, text, title, line, dot, row, slider, choice, readout } from '../../kit.js';

const FITS = [
  { name: 'with Pantheon+', w0: -0.838, e0: 0.055, wa: -0.62, up: 0.22, dn: 0.19, sig: 2.8 },
  { name: 'with Union3', w0: -0.667, e0: 0.088, wa: -1.09, up: 0.31, dn: 0.27, sig: 3.8 },
  { name: 'with DES-SN5YR', w0: -0.752, e0: 0.057, wa: -0.86, up: 0.23, dn: 0.20, sig: 4.2 },
];

export default function (host) {
  const cv = canvas(host, { aspect: 0.78, max: 430, min: 320, label: 'The w0-wa plane with DESI 2025 best fits and the cosmological constant' });
  const cz = canvas(host, { aspect: 0.42, max: 240, min: 190, label: 'Dark energy equation of state against redshift for the chosen point' });
  let w0 = -0.75, wa = -0.86;
  const ctl = row(host);
  const s0 = slider(ctl, { label: 'w₀', min: -1.4, max: -0.4, step: 0.01, value: w0, fmt: (v) => v.toFixed(2), oninput: (v) => { w0 = v; upd(); } });
  const s1 = slider(ctl, { label: 'wₐ', min: -2.2, max: 0.8, step: 0.01, value: wa, fmt: (v) => v.toFixed(2), oninput: (v) => { wa = v; upd(); } });
  const ctl2 = row(host);
  choice(ctl2, 'Jump to', [['l', 'Λ (−1, 0)'], ['d', 'DESI + DES-SN5YR'], ['p', 'DESI + Pantheon+']], 'd', (k) => {
    const f = { l: [-1, 0], d: [FITS[2].w0, FITS[2].wa], p: [FITS[0].w0, FITS[0].wa] }[k];
    w0 = f[0]; wa = f[1]; s0.set(w0); s1.set(wa); upd();
  });
  const key = readout(host), out = readout(host);
  const mk = (i) => `<b style="color:var(--s${[4, 3, 6][i]})">✚</b>`;
  key.style.fontSize = '13.5px';
  key.innerHTML = `<b>★</b> cosmological constant · <b style="color:var(--s1)">○</b> your choice<br>Published best fits ±1σ, DESI DR2 BAO + CMB + supernovae (2025):<br>${FITS.map((f, i) => `${mk(i)} ${f.name}: w₀ = ${f.w0}, wₐ = ${f.wa} (${f.sig}σ from Λ)`).join('<br>')}`;
  const upd = () => { show(); cv.redraw(); cz.redraw(); };
  const show = () => {
    const wz1 = w0 + wa * 0.5, cross = wa !== 0 ? 1 / (1 + (1 + w0) / wa) - 1 : NaN;
    const crosses = Number.isFinite(cross) && cross > 0 && 1 + (1 + w0) / wa > 0;
    out.innerHTML = `Today w = <b>${w0.toFixed(2)}</b>; at z = 1 (about 8 billion years ago) w = <b>${wz1.toFixed(2)}</b>. ${crosses ? `It crosses w = −1 at z ≈ <b>${cross.toFixed(2)}</b>: ${w0 > -1 ? 'phantom long ago, weakening now' : 'weakening long ago, phantom now'}.` : Math.abs(w0 + 1) < 0.005 && Math.abs(wa) < 0.005 ? 'A cosmological constant: the same at all times.' : 'It never crosses −1 after z = 0.'}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Kinds of dark energy: the w₀-wₐ plane', col);
    const A = axes(ctx, w, h, col, { x: [-1.3, -0.45], y: [-2.0, 0.6], t: top + 10, l: 46, xlabel: 'w₀ (today)', ylabel: 'wₐ (change)', xt: [-1.2, -1, -0.8, -0.6], yt: [-2, -1.5, -1, -0.5, 0, 0.5] });
    ctx.save(); A.clip();
    line(ctx, [[A.X(-1), A.T], [A.X(-1), A.B]], col.muted, 1.2, [5, 4]);
    line(ctx, [[A.L, A.Y(0)], [A.R, A.Y(0)]], col.muted, 1.2, [5, 4]);
    FITS.forEach((f, i) => {
      const c = col.s[[3, 2, 5][i]];
      ctx.strokeStyle = c; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(A.X(f.w0 - f.e0), A.Y(f.wa)); ctx.lineTo(A.X(f.w0 + f.e0), A.Y(f.wa));
      ctx.moveTo(A.X(f.w0), A.Y(f.wa - f.dn)); ctx.lineTo(A.X(f.w0), A.Y(f.wa + f.up)); ctx.stroke();
      dot(ctx, A.X(f.w0), A.Y(f.wa), 4.5, c, col.panel);
    });
    // the reader's point
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(A.X(w0), A.Y(wa), 9, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
    // star for Λ
    const sx = A.X(-1), sy = A.Y(0);
    ctx.save(); ctx.fillStyle = col.ink; ctx.beginPath();
    for (let i = 0; i < 10; i++) { const r = i % 2 ? 3.5 : 8, t = -Math.PI / 2 + i * Math.PI / 5; ctx.lineTo(sx + r * Math.cos(t), sy + r * Math.sin(t)); }
    ctx.closePath(); ctx.fill(); ctx.restore();
    text(ctx, 'Λ: w = −1 always', sx + 10, sy - 12, { color: col.ink, size: 11.5, weight: 700, halo: col.panel });
    text(ctx, 'phantom ←', A.X(-1) - 6, A.B - 10, { color: col.muted, size: 11, align: 'right', halo: col.panel });
    text(ctx, '→ weaker than Λ', A.X(-1) + 6, A.B - 10, { color: col.muted, size: 11, halo: col.panel });
  };
  cz.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [0, 3], y: [-2, -0.2], t: 14, b: 36, l: 46, xlabel: 'Redshift z (back in time →)', ylabel: 'w', xt: [0, 1, 2, 3], yt: [-2, -1.5, -1, -0.5] });
    ctx.save(); A.clip();
    line(ctx, [[A.L, A.Y(-1)], [A.R, A.Y(-1)]], col.ink, 1.5, [7, 4]);
    const zs = []; for (let z = 0; z <= 3.0001; z += 0.03) zs.push(z);
    line(ctx, zs.map((z) => [A.X(z), A.Y(w0 + wa * z / (1 + z))]), col.s[0], 3);
    ctx.restore();
    text(ctx, 'Λ', A.R - 6, A.Y(-1) - 9, { color: col.ink, size: 11.5, weight: 700, align: 'right', halo: col.panel });
  };
  upd();
}
