// Class 12 Chemistry, Solutions: Henry's law. The mole fraction of a gas dissolved in a liquid is proportional to the partial pressure of the gas above it: x = p / K_H.
// A bigger K_H means a less soluble gas; K_H grows with temperature, so a warm drink goes flat. K_H at 298 K in kbar (water): He 145, N2 76.5, O2 34.9, CO2 1.67.
// The temperature factor used here is a gentle approximation (K_H doubles about every 30 degrees), not a measured table. Gas dots bounce above; dissolved dots wander below.
import { canvas, text, title, row, slider, choice, readout, loop, rng } from '../../kit.js';

const GAS = { co2: ['CO₂', 1.67], o2: ['O₂', 34.9], n2: ['N₂', 76.5], he: ['He', 145] };
export default function (host) {
  let g = 'co2', p = 3, T = 25;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'Gas above water and dissolved gas molecules for different pressure, gas and temperature' });
  const ctl = row(host), ro = readout(host), R = rng(7);
  choice(ctl, 'gas', [['co2', 'CO₂'], ['o2', 'O₂'], ['n2', 'N₂'], ['he', 'He']], g, (v) => { g = v; go(); });
  slider(ctl, { label: 'pressure of the gas (bar)', min: 0.5, max: 10, step: 0.5, value: p, fmt: (v) => v.toFixed(1), oninput: (v) => { p = v; go(); } });
  slider(ctl, { label: 'temperature (°C)', min: 0, max: 60, step: 1, value: T, fmt: (v) => v.toFixed(0), oninput: (v) => { T = v; go(); } });
  const KH = () => GAS[g][1] * 1000 * Math.pow(2, (T - 25) / 30);
  const xs = () => p / KH();
  const ng = () => Math.round(p * 4), nd = () => Math.min(70, Math.round(xs() * 2e4));
  const gp = Array.from({ length: 50 }, () => ({ x: R(), y: R(), vx: (R() - 0.5) * 0.5, vy: (R() - 0.5) * 0.5 }));
  const dp = Array.from({ length: 70 }, () => ({ x: R(), y: R(), vx: (R() - 0.5) * 0.2, vy: (R() - 0.5) * 0.2 }));
  const go = () => { ro.textContent = `K_H = ${KH().toFixed(0)} bar, so x = p/K_H = ${xs().toExponential(2)} (about ${(xs() * 55.5 * 1000).toFixed(2)} millimol of gas per litre of water). Double p and x doubles; raise T and K_H rises, so x falls.`; };
  loop(host, (dt) => { for (const a of [gp, dp]) for (const q of a) { q.x += q.vx * dt; q.y += q.vy * dt; if (q.x < 0 || q.x > 1) q.vx *= -1; if (q.y < 0 || q.y > 1) q.vy *= -1; } cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, `Henry's law: ${GAS[g][0]} over water`, col) + 6, L = 30, W = w - 60, mid = t0 + (h - t0) * 0.45, B = h - 22;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.18; ctx.fillRect(L, mid, W, B - mid); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(L, t0 + 8, W, B - t0 - 8);
    ctx.strokeStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(L, mid); ctx.lineTo(L + W, mid); ctx.stroke();
    ctx.fillStyle = col.s[2]; for (let i = 0; i < ng(); i++) { const q = gp[i]; ctx.beginPath(); ctx.arc(L + 6 + q.x * (W - 12), t0 + 16 + q.y * (mid - t0 - 24), 3.5, 0, 7); ctx.fill(); }
    ctx.fillStyle = col.s[3]; for (let i = 0; i < nd(); i++) { const q = dp[i]; ctx.beginPath(); ctx.arc(L + 6 + q.x * (W - 12), mid + 8 + q.y * (B - mid - 16), 3.5, 0, 7); ctx.fill(); }
    text(ctx, `gas: ${ng()} dots (p = ${p} bar)`, L + 6, t0 + 22, { color: col.s[2], size: 11, weight: 700, halo: col.panel });
    text(ctx, `dissolved: ${nd()} dots`, L + 6, B - 10, { color: col.s[3], size: 11, weight: 700, halo: col.panel });
  };
  go();
}
