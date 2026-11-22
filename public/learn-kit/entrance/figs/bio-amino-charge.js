// Net charge of an amino acid against pH, from its pKa values (Henderson-Hasselbalch for each ionisable group).
// The isoelectric point pI is where the net charge is zero: there the molecule is mostly a zwitterion and does not
// move in an electric field. pKa values at 25 °C, rounded (CRC Handbook).
import { canvas, axes, line, dot, text, row, slider, choice, readout, fmt } from '../../kit.js';

// acid groups (lose H⁺ to go from 0 to −1) and base groups (lose H⁺ to go from +1 to 0)
const AA = {
  gly: { name: 'Glycine', acid: [2.34], base: [9.6], side: 'neutral (H)' },
  ala: { name: 'Alanine', acid: [2.34], base: [9.69], side: 'neutral (CH₃)' },
  asp: { name: 'Aspartic acid', acid: [1.88, 3.65], base: [9.6], side: 'acidic (CH₂COOH)' },
  lys: { name: 'Lysine', acid: [2.18], base: [8.95, 10.53], side: 'basic ((CH₂)₄NH₂)' },
};
const charge = (a, pH) => a.base.reduce((s, p) => s + 1 / (1 + 10 ** (pH - p)), 0) - a.acid.reduce((s, p) => s + 1 / (1 + 10 ** (p - pH)), 0);
const pI = (a) => { let lo = 0, hi = 14; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; charge(a, m) > 0 ? (lo = m) : (hi = m); } return (lo + hi) / 2; };
export default function (host) {
  let key = 'gly', pH = 7;
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 260, label: 'Net charge of an amino acid against pH' });
  const ctl = row(host);
  choice(ctl, 'Amino acid', Object.entries(AA).map(([k, a]) => [k, a.name]), key, (v) => { key = v; upd(); });
  slider(ctl, { label: 'pH', min: 0, max: 14, step: 0.1, value: pH, fmt: (v) => v.toFixed(1), oninput: (v) => { pH = v; upd(); } });
  const out = readout(host);
  const upd = () => { cv.redraw(); show(); };
  const show = () => {
    const a = AA[key], q = charge(a, pH), p = pI(a);
    const where = Math.abs(pH - p) < 0.3 ? 'at its isoelectric point: mostly the zwitterion, it does not move in an electric field' : pH < p ? 'below pI: net positive, it moves to the cathode' : 'above pI: net negative, it moves to the anode';
    out.innerHTML = `${a.name}, side chain ${a.side}; pKa values ${[...a.acid, ...a.base].sort((x, y) => x - y).join(', ')}. At pH ${pH.toFixed(1)} the net charge is <b>${q >= 0 ? '+' : '−'}${fmt(Math.abs(q), 2)}</b>, ${where}. pI = ${p.toFixed(2)}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const a = AA[key], top = a.base.length, bot = -a.acid.length;
    const { X, Y } = axes(ctx, w, h, col, { x: [0, 14], y: [bot - 0.2, top + 0.2], xlabel: 'pH', ylabel: 'net charge', t: 28, yt: Array.from({ length: top - bot + 1 }, (_, i) => bot + i) });
    line(ctx, [[X(0), Y(0)], [X(14), Y(0)]], col.muted, 1, [4, 4]);
    const pts = Array.from({ length: 281 }, (_, i) => { const x = i / 20; return [X(x), Y(charge(a, x))]; });
    line(ctx, pts, col.s[0], 2.5);
    const p = pI(a);
    dot(ctx, X(p), Y(0), 5, col.panel, col.s[2]);
    text(ctx, `pI ${p.toFixed(2)}`, X(p), Y(0) + 16, { color: col.s[2], size: 11, weight: 600, align: 'center', halo: col.panel });
    dot(ctx, X(pH), Y(charge(a, pH)), 5, col.s[1]);
    text(ctx, `${a.name}: charge falls as each group loses H⁺`, 10, 14, { color: col.ink, size: 12, weight: 700 });
  };
  upd();
}
