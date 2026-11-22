// A p-n junction forming, step by step. 1: p and n pieces before contact. 2: holes and electrons diffuse across.
// 3: they leave bare ionised dopants behind, a depletion region. 4: the charge makes a field and the built-in potential
// that stops diffusion. 5: forward or reverse bias moves the barrier and the width. Slider: bias (V); doping sets V_bi.
import { canvas, axes, line, dot, text, row, slider, choice, readout, loop, title, arrow, rng, fmt } from '../kit.js';

const KT = 0.02585, NI = 1e10;
export default function (host) {
  let st = 4, bias = 0;
  const R = rng(11), pts = Array.from({ length: 34 }, () => [R(), R(), R() * 6.3]);
  const cv = canvas(host, { aspect: 0.95, max: 400, min: 320, label: 'A p-n junction with charges, field and potential' });
  const ctl = row(host);
  choice(ctl, 'Stage', [[1, '1 Apart'], [2, '2 Diffusion'], [3, '3 Depletion'], [4, '4 Equilibrium'], [5, '5 Biased']], st, (v) => { st = v; show(); });
  const sb = slider(ctl, { label: 'Bias V (+ forward)', min: -1, max: 0.6, step: 0.01, value: 0, fmt: (v) => v.toFixed(2) + ' V', oninput: (v) => { bias = v; if (st < 5) st = 5; show(); } });
  const sd = slider(ctl, { label: 'Doping (log₁₀ N, cm⁻³)', min: 15, max: 18, step: 0.1, value: 16, fmt: (v) => '10^' + v.toFixed(1), oninput: () => show() });
  const out = readout(host);
  const vbi = () => KT * Math.log((10 ** sd.value * 10 ** sd.value) / NI ** 2);
  const Wd = (V) => Math.sqrt((2 * 11.7 * 8.85e-14 * (vbi() - V)) / (1.6e-19 * 10 ** sd.value / 2)) * 1e4; // um, symmetric N_a = N_d
  loop(host, () => cv.redraw());
  function show() {
    const V = st === 5 ? sb.value : 0, vb = vbi();
    const msg = ['p-type (holes, with fixed negative acceptors) and n-type (electrons, with fixed positive donors) are neutral before they meet.', 'The moment they meet, holes diffuse to n and electrons to p, because each side has far more of them. Each carrier that leaves is neutralised on the other side.', 'Near the junction the carriers have gone, and what is left is bare charge: negative acceptors in p, positive donors in n. This is the depletion region.', `The charged layers make a field E that points from n to p and pushes carriers back (drift). Drift balances diffusion: built-in potential V_bi = (kT/q) ln(N_aN_d/n_i²) = ${vb.toFixed(2)} V.`, `Bias ${V.toFixed(2)} V: the barrier is V_bi − V = ${(vb - V).toFixed(2)} V and the depletion width W = ${Wd(V).toFixed(2)} µm. Forward bias narrows it and lets current flow; reverse bias widens it.`];
    out.innerHTML = `<b>Stage ${st}.</b> ${msg[st - 1]}`;
  }
  cv.draw = (ctx, w, h, col) => {
    const V = st === 5 ? bias : 0, vb = vbi(), t = performance.now() / 1000, mid = w / 2, bw = (st < 3 ? 0 : st === 3 ? 0.45 : Wd(V) / Wd(0)) * w * 0.13 * (st === 3 ? 1 : 1);
    const top = 46, bh = h * 0.3, sep = st === 1 ? 14 : 0;
    // bar of material
    const xl = 16, xr = w - 16, bx = (side) => (side < 0 ? [xl, mid - sep - bw] : [mid + sep + bw, xr]);
    ctx.fillStyle = col.soft; ctx.fillRect(xl, top, mid - sep - xl, bh); ctx.fillRect(mid + sep, top, xr - mid - sep, bh);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1.2; ctx.strokeRect(xl, top, mid - sep - xl, bh); ctx.strokeRect(mid + sep, top, xr - mid - sep, bh);
    if (bw > 1) { ctx.fillStyle = col.line; ctx.globalAlpha = 0.6; ctx.fillRect(mid - bw, top, 2 * bw, bh); ctx.globalAlpha = 1; }
    text(ctx, 'p', xl + 8, top + 12, { color: col.s[5], size: 13, weight: 700 }); text(ctx, 'n', xr - 8, top + 12, { color: col.s[0], size: 13, weight: 700, align: 'right' });
    // fixed ions in depletion layer and carriers
    if (st >= 3) for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const y = top + 14 + j * (bh - 24) / 3; if (bw > 6) { text(ctx, '−', mid - bw + 8 + (i % 2) * 0 + (bw - 12) * (i / 3) * 0.5, y, { color: col.s[5], size: 13, weight: 700, align: 'center' }); text(ctx, '+', mid + bw - 8 - (bw - 12) * (i / 3) * 0.5, y, { color: col.s[0], size: 13, weight: 700, align: 'center' }); } }
    pts.forEach(([a, b, ph], i) => {
      const hole = i % 2 === 0, y = top + 8 + b * (bh - 16), wob = Math.sin(t * 2 + ph) * 4;
      let x;
      if (hole) { x = st === 1 ? xl + 10 + a * (mid - sep - xl - 20) : st === 2 ? xl + 10 + a * (xr - xl - 20) * (0.5 + 0.5 * ((Math.sin(t + ph) + 1) / 2)) * 0.9 : xl + 10 + a * (mid - bw - xl - 16); }
      else { x = st === 1 ? mid + sep + 10 + a * (xr - mid - sep - 20) : st === 2 ? xr - 10 - a * (xr - xl - 20) * (0.5 + 0.5 * ((Math.sin(t + ph) + 1) / 2)) * 0.9 : mid + bw + 10 + a * (xr - mid - bw - 20); }
      if (st === 2) { x = hole ? xl + 10 + a * (xr - xl - 20) * 0.95 * (0.35 + 0.65 * a) : xr - 10 - a * (xr - xl - 20) * 0.95 * (0.35 + 0.65 * a); const sh = (Math.sin(t * 0.9 + ph) + 1) / 2; x = hole ? xl + 10 + a * (mid - xl) + sh * (mid - xl) * a : xr - 10 - a * (xr - mid) - sh * (xr - mid) * a; }
      x += wob * 0.5; const yy = y + Math.cos(t * 2 + ph) * 3;
      if (x < xl || x > xr) return;
      if (hole) { ctx.beginPath(); ctx.arc(x, yy, 4, 0, 7); ctx.lineWidth = 1.6; ctx.strokeStyle = col.s[5]; ctx.stroke(); } else dot(ctx, x, yy, 3.8, col.s[0]);
    });
    if (st >= 4) { arrow(ctx, mid + bw * 0.6, top + bh + 14, mid - bw * 0.6, top + bh + 14, col.s[1], 2.5, 8); text(ctx, 'E', mid, top + bh + 26, { color: col.s[1], size: 11, weight: 700, align: 'center' }); }
    if (st === 4 || st === 5) text(ctx, `W = ${Wd(V).toFixed(2)} µm`, mid, top - 8, { color: col.ink, size: 11, weight: 600, align: 'center' });
    // potential energy graph
    const gy = top + bh + 36, gh = h - gy - 10;
    ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(xl, gy + gh); ctx.lineTo(xr, gy + gh); ctx.stroke();
    const barrier = st >= 4 ? vb - V : 0, Hh = Math.max(0, barrier) * gh * 0.8, sp = (u) => (u < 0 ? 1 : 0);
    const path = []; for (let i = 0; i <= 60; i++) { const u = -1 + (i / 60) * 2, x = mid + u * (xr - xl) / 2; let hgt; const a = bw / ((xr - xl) / 2) || 1e-6; if (st < 3 || a < 0.01) hgt = u < 0 ? 0 : 0; else { const z = Math.max(-1, Math.min(1, u / a)); hgt = 0.5 * (1 + Math.sin(z * Math.PI / 2)); if (u < -a || u > a) hgt = u < 0 ? 0 : 1; } path.push([x, gy + gh - 4 - (1 - hgt) * Math.max(Hh, st === 3 ? gh * 0.25 : 0)]); }
    line(ctx, path, col.s[2], 2.5);
    text(ctx, 'electron energy (high on the p side, low on the n side)', xl + 2, gy + 8, { color: col.muted, size: 10.5 });
    if (st >= 4) text(ctx, `barrier q(V_bi − V) = ${(vb - V).toFixed(2)} eV`, mid, gy + gh - Hh / 2 - 12, { color: col.s[2], size: 11, weight: 600, align: 'center' });
    title(ctx, 'p-n junction', col);
  };
  show();
  return { step(i) { st = Math.min(5, Math.max(1, i + 1)); show(); } };
}
