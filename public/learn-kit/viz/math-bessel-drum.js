// Vibrating drum modes. A circular drum vibrates as J_m(k r) cos(mθ) cos(ωt), where J_m is a Bessel function and k is
// chosen so that the edge stays still (J_m(kR) = 0, a zero of J_m). Pick m (the number of nodal diameters) and n (the
// number of nodal circles, counting the rim). Blue and orange are up and down; the lines where the colour fades are
// the nodes that do not move. The bottom curve is the radial shape J_m(kr).
import { canvas, axes, row, choice, button, readout, loop, line, text } from '../kit.js';
import { curve, f2 } from './_math.js';

const ZERO = { 0: [2.4048, 5.5201, 8.6537], 1: [3.8317, 7.0156, 10.1735], 2: [5.1356, 8.4172, 11.6198], 3: [6.3802, 9.7610, 13.0152] };
const J = (m, x) => { let s = 0; const N = 48; for (let i = 0; i < N; i++) { const t = ((i + 0.5) * Math.PI) / N; s += Math.cos(m * t - x * Math.sin(t)); } return s / N; };
export default function (host) {
  let m = 0, n = 1, ph = 0;
  const cv = canvas(host, { aspect: 1.0, max: 400, min: 300, label: 'A circular drum vibrating in one mode' });
  const c = row(host), c2 = row(host);
  choice(c, 'm (diameters)', [0, 1, 2, 3].map((v) => [v, String(v)]), m, (v) => { m = v; grid(); }); choice(c, 'n (circles)', [1, 2, 3].map((v) => [v, String(v)]), n, (v) => { n = v; grid(); });
  const anim = loop(host, (dt) => { ph += dt * 3; cv.redraw(); }); anim.button(c2);
  const out = readout(host);
  let G = null;
  const kk = () => ZERO[m][n - 1];
  function grid() { const S = 56; G = []; for (let i = 0; i < S; i++) { G[i] = []; for (let j = 0; j < S; j++) { const x = (i + 0.5) / S * 2 - 1, y = 1 - (j + 0.5) / S * 2, r = Math.hypot(x, y); G[i][j] = r > 1 ? null : J(m, kk() * r) * Math.cos(m * Math.atan2(y, x)); } } G.S = S; out.innerHTML = `Mode (m = ${m}, n = ${n}): k·R = ${f2(kk(), 4)}, the ${n}${['st', 'nd', 'rd'][n - 1]} zero of J<sub>${m}</sub>. ${m} nodal diameter${m === 1 ? '' : 's'}, ${n - 1} inner nodal circle${n === 2 ? '' : 's'}. Frequency ω = c·k/R, so higher modes ring higher: relative frequency ${f2(kk() / ZERO[0][0], 3)} × the fundamental.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    if (!G) return; const S = G.S, top = Math.round(h * 0.68), R = Math.min(w / 2 - 12, top / 2 - 10), cx = w / 2, cy = top / 2 + 6, amp = Math.cos(ph), cell = (2 * R) / S;
    for (let i = 0; i < S; i++) for (let j = 0; j < S; j++) { const v = G[i][j]; if (v === null) continue; ctx.globalAlpha = Math.min(1, Math.abs(v * amp) * 1.3 + 0.03); ctx.fillStyle = v * amp >= 0 ? col.s[0] : col.s[1]; ctx.fillRect(cx - R + i * cell, cy - R + j * cell, cell + 0.6, cell + 0.6); }
    ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke();
    text(ctx, 'blue up · orange down (swaps as it vibrates)', 10, 14, { color: col.muted, size: 10 });
    ctx.save(); ctx.translate(0, top); ctx.beginPath(); ctx.rect(0, 0, w, h - top); ctx.clip();
    const B = axes(ctx, w, h - top, col, { x: [0, 1], y: [-0.6, 1.1], l: 30, b: 36, t: 6, r: 10, xlabel: 'r / R', yt: [0], xt: [0, 0.5, 1] });
    curve(ctx, B, (r) => J(m, kk() * r), 0, 1, col.s[2], 2.5, { n: 120 }); ctx.restore();
  };
  grid();
}
