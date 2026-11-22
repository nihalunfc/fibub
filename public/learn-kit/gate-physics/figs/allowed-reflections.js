// 7.2 Allowed reflections. Pick a structure and two form factors. Top: the (hk0) and (hk1) layers of the reciprocal
// lattice in simple cubic indexing, each point drawn with area proportional to |F|^2 (open rings mark F = 0).
// Bottom: the powder "stick pattern" against h^2+k^2+l^2, with multiplicity included. The missing points of bcc and
// fcc form an fcc and a bcc reciprocal lattice; rock salt with equal ions (like KCl) looks simple cubic of half the size.
import { canvas, row, slider, choice, readout, line, dot, text, fmt } from '../../kit.js';

const FCC = [[0, 0, 0], [0, 0.5, 0.5], [0.5, 0, 0.5], [0.5, 0.5, 0]];
const sh = (p, s) => [p[0] + s[0], p[1] + s[1], p[2] + s[2]];
const S = {
  sc: { name: 'simple cubic', sites: [['A', [0, 0, 0]]] },
  bcc: { name: 'bcc', sites: [['A', [0, 0, 0]], ['A', [0.5, 0.5, 0.5]]] },
  fcc: { name: 'fcc', sites: FCC.map((p) => ['A', p]) },
  diamond: { name: 'diamond', sites: [...FCC.map((p) => ['A', p]), ...FCC.map((p) => ['A', sh(p, [0.25, 0.25, 0.25])])] },
  nacl: { name: 'rock salt', sites: [...FCC.map((p) => ['A', p]), ...FCC.map((p) => ['B', sh(p, [0.5, 0.5, 0.5])])] },
  cscl: { name: 'CsCl', sites: [['A', [0, 0, 0]], ['B', [0.5, 0.5, 0.5]]] },
};
const F2 = (st, h, k, l, fA, fB) => { let re = 0, im = 0; for (const [s, p] of st.sites) { const f = s === 'A' ? fA : fB, ph = 2 * Math.PI * (h * p[0] + k * p[1] + l * p[2]); re += f * Math.cos(ph); im += f * Math.sin(ph); } const v = re * re + im * im; return v < 1e-8 ? 0 : v; };
const families = () => { const out = []; for (let h = 0; h <= 4; h++) for (let k = 0; k <= h; k++) for (let l = 0; l <= k; l++) { const N = h * h + k * k + l * l; if (N && N <= 24) out.push([h, k, l, N]); } return out.sort((a, b) => a[3] - b[3]); };
const mult = (h, k, l) => { const s = new Set(); const t = [h, k, l]; for (const p of [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]]) for (const a of [1, -1]) for (const b of [1, -1]) for (const c of [1, -1]) s.add([t[p[0]] * a, t[p[1]] * b, t[p[2]] * c].join()); return s.size; };

export default function (host) {
  const cv = canvas(host, { aspect: 0.8, max: 520, min: 360, label: 'Reciprocal lattice layers with spot sizes proportional to the structure factor, and the powder stick pattern' });
  let key = 'fcc', fA = 20, fB = 10;
  const ctl = row(host), out = readout(host);
  const re = () => { cv.redraw(); show(); };
  choice(ctl, 'Structure', Object.entries(S).map(([k, v]) => [k, v.name]), key, (v) => { key = v; re(); });
  slider(ctl, { label: 'f of atom A', min: 1, max: 40, step: 1, value: fA, fmt: (v) => String(v), oninput: (v) => { fA = v; re(); } });
  slider(ctl, { label: 'f of atom B (rock salt, CsCl)', min: 0, max: 40, step: 1, value: fB, fmt: (v) => String(v), oninput: (v) => { fB = v; re(); } });
  const show = () => {
    const st = S[key], on = families().filter(([h, k, l]) => F2(st, h, k, l, fA, fB) > 0).slice(0, 6);
    out.innerHTML = `${st.name}: first lines ${on.map(([h, k, l]) => `(${h}${k}${l})`).join(', ')}. ${key === 'nacl' && fA === fB ? 'Equal ions: the all-odd lines vanish and the pattern looks simple cubic with half the cell (the KCl case).' : key === 'cscl' && fA === fB ? 'Equal ions: CsCl turns into bcc, so h + k + l odd vanish.' : ''}`;
  };
  cv.draw = (ctx, W, H, col) => {
    const st = S[key], topH = H * 0.52;
    let maxF = 1; for (let h = -4; h <= 4; h++) for (let k = -4; k <= 4; k++) for (const l of [0, 1]) maxF = Math.max(maxF, F2(st, h, k, l, fA, fB));
    for (const [li, l] of [[0, 0], [1, 1]]) {
      const x0 = li * W / 2, w = W / 2, cx = x0 + w / 2, cy = 22 + (topH - 22) / 2, s = Math.min(w, topH - 28) / 9.2;
      text(ctx, `layer l = ${l}  (h, k from −4 to 4)`, x0 + 8, 14, { color: col.ink, size: 11.5, weight: 700, fit: false });
      for (let h = -4; h <= 4; h++) for (let k = -4; k <= 4; k++) {
        const v = F2(st, h, k, l, fA, fB), px = cx + h * s, py = cy - k * s;
        if (v > 0) dot(ctx, px, py, Math.max(1.5, 0.48 * s * Math.sqrt(v / maxF)), (h + k + l) % 2 ? col.s[2] : col.s[0]);
        else { ctx.beginPath(); ctx.arc(px, py, 2.2, 0, 2 * Math.PI); ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.stroke(); }
      }
    }
    line(ctx, [[W / 2, 6], [W / 2, topH - 4]], col.line, 1);
    // stick pattern
    const L = 40, R = W - 12, T = topH + 26, B = H - 30;
    text(ctx, 'Powder lines: height ∝ multiplicity × |F|²', 10, topH + 12, { color: col.ink, size: 11.5, weight: 700 });
    const fam = families(), vals = fam.map(([h, k, l, N]) => [N, mult(h, k, l) * F2(st, h, k, l, fA, fB), `${h}${k}${l}`]);
    const vmax = Math.max(1, ...vals.map((v) => v[1]));
    line(ctx, [[L, B], [R, B]], col.muted, 1);
    for (let N = 1; N <= 24; N++) { const x = L + (N - 0.5) / 24 * (R - L); if (N % 2 === 0) text(ctx, String(N), x, B + 10, { color: col.muted, size: 10, align: 'center' }); }
    text(ctx, 'h² + k² + l²', (L + R) / 2, H - 6, { color: col.ink, size: 11, align: 'center', weight: 600 });
    const seen = new Map();
    for (const [N, v, lab] of vals) {
      const x = L + (N - 0.5) / 24 * (R - L), prev = seen.get(N) || 0;
      if (v > 0) { const hgt = (B - T) * v / vmax; line(ctx, [[x, B - prev], [x, B - prev - hgt]], col.s[0], 3); if (hgt > 14 && !prev) text(ctx, lab, x, B - prev - hgt - 7, { color: col.ink, size: 9.5, align: 'center', halo: col.panel }); seen.set(N, prev + hgt); }
      else if (!seen.has(N)) { dot(ctx, x, B - 3, 1.8, col.muted); }
    }
  };
  re();
}
