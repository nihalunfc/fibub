// 8.3 Shell-model level scheme. Single-particle levels of a harmonic oscillator with an l^2 term and a spin-orbit term
// (Nilsson-type energies, kappa = 0.0637, mu by shell). The slider turns the spin-orbit strength from 0 (oscillator magic
// numbers 2, 8, 20, 40, 70, 112) up to full strength (2, 8, 20, 28, 50, 82, 126). Choose a nucleon number: levels fill
// from the bottom, the last (partly) filled level is marked, and for an odd number the ground-state j^pi is read out.
import { canvas, row, slider, readout, line, text, fmt } from '../../kit.js';

const L = 'spdfghi', MU = [0, 0, 0, 0.35, 0.625, 0.63, 0.448], K = 0.0637;
const LEV = [];
for (let N = 0; N <= 6; N++) for (let l = N; l >= 0; l -= 2) { const n = (N - l) / 2 + 1; for (const j2 of l ? [2 * l + 1, 2 * l - 1] : [1]) LEV.push({ N, l, n, j2 }); }
const energy = (o, s) => { const ls = o.j2 === 2 * o.l + 1 ? o.l / 2 : -(o.l + 1) / 2; return o.N + 1.5 - K * s * 2 * ls - K * MU[o.N] * (o.l * (o.l + 1) - o.N * (o.N + 3) / 2); };
const MAGIC = [2, 8, 20, 28, 50, 82, 126], HO = [2, 8, 20, 40, 70, 112];

export default function (host) {
  const cv = canvas(host, { aspect: 1.15, max: 470, min: 300, label: 'Nuclear shell-model levels with a spin-orbit strength slider and a nucleon-number readout' });
  let s = 1, k = 51;
  const ctl = row(host), out = readout(host);
  const re = () => { cv.redraw(); show(); };
  slider(ctl, { label: 'Spin-orbit strength', min: 0, max: 1.4, step: 0.01, value: s, fmt: (v) => fmt(v, 2), oninput: (v) => { s = v; re(); } });
  slider(ctl, { label: 'Number of protons (or neutrons)', min: 1, max: 126, step: 1, value: k, fmt: (v) => String(v), oninput: (v) => { k = v; re(); } });
  const sorted = () => LEV.map((o) => ({ ...o, e: energy(o, s) })).sort((a, b) => a.e - b.e);
  const name = (o) => `${o.n}${L[o.l]}${o.j2}/2`;
  const show = () => {
    const lv = sorted(); let c = 0, last = null, before = 0;
    for (const o of lv) { if (k <= c + o.j2 + 1) { last = o; before = c; break; } c += o.j2 + 1; }
    if (!last) return;
    const inLev = k - before, full = last.j2 + 1, par = last.l % 2 ? '−' : '+';
    let msg = `${k} nucleons: the last one is in ${name(last)} (${inLev} of ${full} places filled).`;
    if (k % 2) msg += ` Odd number: the paired-off nucleons give 0⁺, so the ground state is j<sup>π</sup> = <b>${last.j2}/2${par}</b> (parity (−1)<sup>l</sup>, l = ${last.l}).`;
    else msg += ' Even number: all nucleons pair to 0⁺.';
    if (inLev === full && MAGIC.includes(k) && s > 0.7) msg += ' A closed shell: a magic number.';
    out.innerHTML = msg;
  };
  cv.draw = (ctx, W, H, col) => {
    const lv = sorted(), e0 = 1.2, e1 = 8.6, T = 16, B = H - 14, Y = (e) => B - (e - e0) / (e1 - e0) * (B - T);
    const x0 = 64, x1 = W * 0.5;
    text(ctx, 'energy', 6, T, { color: col.muted, size: 11 });
    let c = 0, prevTop = null;
    for (let i = 0; i < lv.length; i++) {
      const o = lv[i], lo = c; c += o.j2 + 1;
      const y = Y(o.e), filled = Math.max(0, Math.min(o.j2 + 1, k - lo));
      const colr = filled === o.j2 + 1 ? col.s[0] : filled > 0 ? col.s[2] : col.muted;
      line(ctx, [[x0, y], [x1, y]], colr, filled > 0 ? 2.6 : 1.4);
      // occupancy marks
      const w = (x1 - x0) / 15;
      for (let m = 0; m < o.j2 + 1 && m < 14; m++) if (m < filled) { ctx.fillStyle = colr; ctx.beginPath(); ctx.arc(x0 + w * (m + 0.8), y - 4, 2.2, 0, 7); ctx.fill(); }
      text(ctx, name(o), x1 + 6, y, { color: colr, size: 10.5, weight: filled > 0 && filled < o.j2 + 1 ? 700 : 400, halo: col.panel });
      text(ctx, `${c}`, W - 8, y, { color: col.muted, size: 10, align: 'right', halo: col.panel });
      // gap labels between this level and the next
      const nxt = lv[i + 1];
      const list = s > 0.7 ? MAGIC : s < 0.05 ? HO : [];
      if (nxt && list.includes(c) && nxt.e - o.e > 0.06) {
        const ym = (Y(o.e) + Y(nxt.e)) / 2;
        line(ctx, [[x0 - 34, ym], [x0 - 4, ym]], col.ink, 1, [3, 2]);
        text(ctx, String(c), x0 - 38, ym, { color: col.ink, size: 12, weight: 700, align: 'right', halo: col.panel });
      }
      prevTop = o.e;
    }
    text(ctx, 'levels fill from the bottom; numbers at the right count places so far', x0, B + 7, { color: col.muted, size: 10 });
    return prevTop;
  };
  re();
}
