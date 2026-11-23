// Class 11 Chemistry, Structure of Atom: radial probability and nodes of hydrogen orbitals. P(r) = r^2 R(r)^2 is the chance of finding the electron
// in a thin shell at distance r (in units of the Bohr radius a0 = 52.9 pm). Radial nodes = n - l - 1, angular nodes = l, total nodes = n - 1.
// R(r) for 1s, 2s, 2p, 3s, 3p, 3d from the hydrogen solutions (unnormalised polynomials times exponentials, normalised numerically here).
import { canvas, text, title, row, choice, readout } from '../../kit.js';

const R = { '1s': [1, 0, (r) => Math.exp(-r)], '2s': [2, 0, (r) => (2 - r) * Math.exp(-r / 2)], '2p': [2, 1, (r) => r * Math.exp(-r / 2)], '3s': [3, 0, (r) => (27 - 18 * r + 2 * r * r) * Math.exp(-r / 3)], '3p': [3, 1, (r) => (6 - r) * r * Math.exp(-r / 3)], '3d': [3, 2, (r) => r * r * Math.exp(-r / 3)] };
export default function (host) {
  let k = '2s';
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 300, label: 'Radial probability curve of a hydrogen orbital with its radial nodes marked' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'orbital', Object.keys(R).map((x) => [x, x]), k, (v) => { k = v; go(); });
  const curve = () => { const f = R[k][2], N = 400, rm = 26, xs = [], ys = []; let a = 0; for (let i = 0; i <= N; i++) { const r = rm * i / N, y = r * r * f(r) ** 2; xs.push(r); ys.push(y); a += y * rm / N; } return { xs, ys: ys.map((y) => y / a), nodes: xs.filter((r, i) => i > 1 && i < N && Math.sign(f(r)) !== Math.sign(f(xs[i - 1])) && Math.abs(f(r)) > 0 || false) }; };
  const go = () => { const [n, l] = R[k]; ro.textContent = `${k}: n = ${n}, l = ${l}. Radial nodes = n − l − 1 = ${n - l - 1}; angular nodes = l = ${l}; total = n − 1 = ${n - 1}. A node is a surface where the electron is never found. The more nodes, the farther the electron usually is.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, `radial probability of ${k}`, col) + 8, c = curve(), L = 34, B = h - 34, T = t0 + 10, W = w - L - 12, mx = Math.max(...c.ys) * 1.1;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(L + W, B); ctx.stroke();
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.beginPath(); c.xs.forEach((r, i) => { const x = L + W * r / 26, y = B - (B - T) * c.ys[i] / mx; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke();
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.15; ctx.lineTo(L + W, B); ctx.lineTo(L, B); ctx.fill(); ctx.globalAlpha = 1;
    c.nodes.forEach((r) => { const x = L + W * r / 26; ctx.strokeStyle = col.s[3]; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(x, T); ctx.lineTo(x, B); ctx.stroke(); ctx.setLineDash([]); text(ctx, 'node', x + 3, T + 8, { color: col.s[3], size: 10, weight: 700 }); });
    let pk = 0; c.ys.forEach((y, i) => { if (y > c.ys[pk]) pk = i; }); text(ctx, `peak at r ≈ ${c.xs[pk].toFixed(1)} a₀ (${(c.xs[pk] * 52.9).toFixed(0)} pm)`, L + W, T + 22, { color: col.ink, size: 11, weight: 700, align: 'right' });
    text(ctx, 'distance r from nucleus (a₀ = 52.9 pm)', L + W / 2, B + 22, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, 'P(r)', 6, T + 2, { color: col.muted, size: 10.5 });
    [0, 5, 10, 15, 20, 25].forEach((r) => text(ctx, String(r), L + W * r / 26, B + 10, { color: col.muted, size: 9.5, align: 'center' }));
  };
  go();
}
