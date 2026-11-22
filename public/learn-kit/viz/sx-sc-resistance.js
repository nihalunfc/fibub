// Why resistance vanishes. Top: electrons driven through a lattice of vibrating ions. In the normal state they bump into the
// ions and each other (bigger vibrations when hotter), so they drift slowly and lose energy: resistance. Below T_c (and
// below the critical field B_c(T) = B_c0[1 − (T/T_c)²]) they form Cooper pairs (linked dots) that move through together
// without scattering. Bottom: R against T with your point marked. Pick a material, then slide T and B across the transition.
import { canvas, axes, line, dot, text, row, slider, choice, readout, loop, title, rng } from '../kit.js';

const MAT = { hg: ['Hg', 4.15, 0.041], nb: ['Nb', 9.2, 0.2], pb: ['Pb', 7.2, 0.08], ybco: ['YBCO', 92, 100] };
export default function (host) {
  let mat = 'hg';
  const R = rng(13), E = Array.from({ length: 16 }, () => ({ x: R(), y: R(), vy: 0, tx: 0 }));
  const cv = canvas(host, { aspect: 0.95, max: 400, min: 320, label: 'Electrons moving through a lattice, and resistance against temperature' });
  const ctl = row(host);
  choice(ctl, 'Material', Object.entries(MAT).map(([k, v]) => [k, `${v[0]} (T_c ${v[1]} K)`]), mat, (v) => { mat = v; sT.set(Math.min(sT.value, 2 * MAT[v][1])); fix(); show(); });
  const sT = slider(ctl, { label: 'Temperature T', min: 0.5, max: 200, log: true, value: 6, fmt: (v) => v.toFixed(1) + ' K', oninput: () => show() });
  const sB = slider(ctl, { label: 'Field B (fraction of B_c0)', min: 0, max: 1.2, step: 0.02, value: 0, fmt: (v) => v.toFixed(2), oninput: () => show() });
  function fix() { sT.set(MAT[mat][1] * 0.6); }
  const sc = () => { const [, Tc] = MAT[mat], T = sT.value, Bc = Math.max(0, 1 - (T / Tc) ** 2); return T < Tc && sB.value < Bc; };
  loop(host, (dt) => { const s = sc(), T = sT.value, Tc = MAT[mat][1], heat = Math.min(1, 0.25 + T / (2.5 * Tc)); E.forEach((e) => { const sp = s ? 0.55 : 0.12 + 0.05 * (1 - heat); e.x += dt * (s ? 0.35 : 0.06 + 0.12 * (1 - heat)); if (!s) { e.y += (R() - 0.5) * dt * 3 * heat; e.y = Math.min(1, Math.max(0, e.y)); if (R() < dt * 6 * heat) e.x -= 0.03; } if (e.x > 1) { e.x = 0; } }); cv.redraw(); }).button(row(host));
  const out = readout(host);
  function show() { const [nm, Tc] = MAT[mat], s = sc(), T = sT.value, Bc = Math.max(0, 1 - (T / Tc) ** 2); queueMicrotask(() => cv.redraw()); out.innerHTML = `<b>${nm}: T = ${T.toFixed(1)} K, T_c = ${Tc} K, field ${(sB.value).toFixed(2)} B_c0.</b> ${s ? `Superconducting: R = 0 exactly. Electrons are in Cooper pairs and nothing scatters them. The field this temperature allows is B_c(T) = ${Bc.toFixed(2)} B_c0 (yours is lower).` : T >= Tc ? `Normal: above T_c the resistance is that of an ordinary metal, and grows roughly in proportion to T, because hotter ions vibrate more and scatter more.` : `Normal again: at ${T.toFixed(1)} K the critical field is only ${Bc.toFixed(2)} B_c0, and your field is bigger, so superconductivity is destroyed (a Type I picture).`}`; }
  cv.draw = (ctx, w, h, col) => {
    const [, Tc] = MAT[mat], T = sT.value, s = sc(), top = 40, bh = h * 0.4, L = 12, Rr = w - 12, heat = Math.min(1, 0.25 + T / (2.5 * Tc)), t = performance.now() / 1000;
    ctx.fillStyle = col.soft; ctx.fillRect(L, top, Rr - L, bh); ctx.strokeStyle = col.muted; ctx.lineWidth = 1.2; ctx.strokeRect(L, top, Rr - L, bh);
    const nx = 9, ny = 4;
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) { const a = s ? 0.5 : 4 * heat, x = L + 18 + i * ((Rr - L - 36) / (nx - 1)) + Math.sin(t * 9 + i * 1.7 + j * 2.3) * a, y = top + 16 + j * ((bh - 32) / (ny - 1)) + Math.cos(t * 8 + j * 1.9 + i) * a; dot(ctx, x, y, 5, col.s[2]); }
    E.forEach((e, k) => { const x = L + 8 + e.x * (Rr - L - 16), y = top + 8 + e.y * (bh - 16); dot(ctx, x, y, 3.6, col.s[0]); if (s && k % 2 === 0) { const f = E[k + 1], x2 = L + 8 + f.x * (Rr - L - 16); line(ctx, [[x, y], [x2 + 9, top + 8 + e.y * (bh - 16)]], col.s[1], 1.5); dot(ctx, x + 9, y, 3.6, col.s[0]); } });
    text(ctx, s ? 'Cooper pairs glide through: no scattering' : 'electrons scatter off vibrating ions', L + 4, top + bh + 12, { color: s ? col.good : col.bad, size: 11, weight: 700 });
    title(ctx, s ? 'Superconducting state' : 'Normal state', col);
    const gy = top + bh + 22, A = axes(ctx, w, h, col, { x: [0, Math.max(2 * Tc, 1)], y: [0, 2.2], xlabel: 'temperature (K)', ylabel: 'R / R(T_c)', l: 40, t: gy + 6, b: 34, yt: [0, 1, 2], xt: [0, Tc, 2 * Tc], fx: (v) => (+v.toFixed(1)).toString() });
    A.clip();
    const sB_ = sB.value;
    line(ctx, [[A.X(0), A.Y(0)], [A.X(Tc), A.Y(0)], [A.X(Tc), A.Y(1)], [A.X(2 * Tc), A.Y(2)]].map((p, i) => p), col.s[0], 2.5);
    ctx.restore();
    const r = s ? 0 : T < Tc ? 1 : T / Tc; if (T <= 2 * Tc) dot(ctx, A.X(T), A.Y(Math.min(r, 2.2)), 6, s ? col.good : col.s[1], col.ink);
    text(ctx, `T_c = ${Tc} K`, A.X(Tc) + 6, A.Y(1.4), { color: col.muted, size: 10.5 });
  };
  fix(); show();
}
