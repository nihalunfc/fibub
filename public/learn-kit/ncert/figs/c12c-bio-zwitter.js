// Class 12 Chemistry, Biomolecules: what an amino acid looks like at different pH. Slide the pH and watch the groups gain or lose H+.
// At low pH both the COOH and NH3+ are protonated (net +1). Near the isoelectric point (pI) the molecule is a zwitterion, -COO- and -NH3+ (net 0), and it moves least in an electric field. At high pH the NH3+ also loses H+ (net -1).
// Group pKa values (CRC Handbook): glycine COOH 2.34, NH3+ 9.60; aspartic acid COOH 1.88, side-chain COOH 3.65, NH3+ 9.60; lysine COOH 2.18, alpha-NH3+ 8.95, side-chain NH3+ 10.53.
// Net charge = sum over groups of -1/(1 + 10^(pKa - pH)) for acids and +1/(1 + 10^(pH - pKa)) for bases; pI is the pH where the net charge is zero.
import { canvas, text, title, axes, line, dot, row, choice, slider, readout } from '../../kit.js';

const AA = { gly: ['glycine', [['a', 2.34], ['b', 9.6]], 'CH₂'], asp: ['aspartic acid', [['a', 1.88], ['a', 3.65], ['b', 9.6]], 'CH₂COOH side chain'], lys: ['lysine', [['a', 2.18], ['b', 8.95], ['b', 10.53]], '(CH₂)₄NH₂ side chain'] };
const charge = (aa, pH) => AA[aa][1].reduce((s, [t, p]) => s + (t === 'a' ? -1 / (1 + Math.pow(10, p - pH)) : 1 / (1 + Math.pow(10, pH - p))), 0);
const pI = (aa) => { let lo = 0, hi = 14; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; charge(aa, m) > 0 ? (lo = m) : (hi = m); } return (lo + hi) / 2; };
export default function (host) {
  let aa = 'gly', pH = 7;
  const cv = canvas(host, { aspect: 0.95, max: 400, min: 330, label: 'Net charge of an amino acid against pH, with the form it takes' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'amino acid', Object.entries(AA).map(([id, o]) => [id, o[0]]), aa, (v) => { aa = v; go(); });
  slider(ctl, { label: 'pH', min: 0, max: 14, step: 0.1, value: pH, fmt: (v) => v.toFixed(1), oninput: (v) => { pH = v; go(); } });
  const go = () => { const q = charge(aa, pH), p = pI(aa); ro.textContent = `${AA[aa][0]} at pH ${pH.toFixed(1)}: net charge ${q >= 0 ? '+' : '−'}${Math.abs(q).toFixed(2)}. Isoelectric point pI = ${p.toFixed(2)}. ${Math.abs(pH - p) < 0.6 ? 'Close to pI: mostly the neutral zwitterion, so it dissolves least and moves least in an electric field.' : pH < p ? 'Below pI it is positive: it would move towards the negative electrode.' : 'Above pI it is negative: it would move towards the positive electrode.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, AA[aa][0] + ': charge against pH', col), A = axes(ctx, w, h * 0.62, col, { x: [0, 14], y: [-2.2, 2.2], xlabel: 'pH', ylabel: 'net charge', l: 40, t: top + 4, b: 34, fx: (v) => String(v) });
    const pts = []; for (let i = 0; i <= 140; i++) pts.push([A.X(i / 10), A.Y(charge(aa, i / 10))]);
    ctx.save(); A.clip(); line(ctx, pts, col.s[0], 3); ctx.restore();
    const p = pI(aa); ctx.save(); ctx.setLineDash([4, 3]); ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(A.X(p), A.T); ctx.lineTo(A.X(p), A.B); ctx.stroke(); ctx.restore(); text(ctx, 'pI ' + p.toFixed(2), A.X(p) + 4, A.T + 10, { color: col.muted, size: 10.5 });
    dot(ctx, A.X(pH), A.Y(charge(aa, pH)), 6.5, col.s[3], col.panel);
    // structure strip
    const y = h * 0.62 + 34, q = charge(aa, pH), cx = w / 2;
    const am = AA[aa][1].filter((g) => g[0] === 'b')[0][1];
    const fa = 1 / (1 + Math.pow(10, AA[aa][1][0][1] - pH)), fb = 1 / (1 + Math.pow(10, pH - am));
    const left = fb > 0.5 ? 'H₃N⁺' : 'H₂N', right = fa > 0.5 ? 'COO⁻' : 'COOH';
    text(ctx, `${left}–CH(R)–${right}`, cx, y + 6, { color: col.ink, size: 16, weight: 700, align: 'center' });
    text(ctx, 'R = ' + (aa === 'gly' ? 'H' : AA[aa][2]), cx, y + 28, { color: col.muted, size: 11, align: 'center' });
    const form = left === 'H₃N⁺' && right === 'COO⁻' ? 'zwitterion (net charge about 0)' : left === 'H₃N⁺' ? 'cation: both groups protonated' : 'anion: both groups deprotonated';
    text(ctx, form, cx, y + 50, { color: col.s[3], size: 12, weight: 700, align: 'center' });
  };
  go();
}
