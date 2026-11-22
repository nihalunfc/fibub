// 8.7 Conservation-law checker. Pick a decay or reaction: the table adds up charge, baryon number, the three lepton
// numbers and strangeness on each side and marks what balances, checks energy for decays (parent mass against the
// sum of product masses), and gives the verdict and the force responsible.
import { canvas, row, readout, text } from '../../kit.js';

// name: [Q, B, Le, Lmu, Ltau, S, mass MeV]
const P = {
  'p': [1, 1, 0, 0, 0, 0, 938.27], 'n': [0, 1, 0, 0, 0, 0, 939.57], 'p̄': [-1, -1, 0, 0, 0, 0, 938.27], 'Λ⁰': [0, 1, 0, 0, 0, -1, 1115.68], 'Σ⁺': [1, 1, 0, 0, 0, -1, 1189.37],
  'Σ⁰': [0, 1, 0, 0, 0, -1, 1192.64], 'Ξ⁻': [-1, 1, 0, 0, 0, -2, 1321.71], 'Ω⁻': [-1, 1, 0, 0, 0, -3, 1672.45], 'π⁺': [1, 0, 0, 0, 0, 0, 139.57], 'π⁻': [-1, 0, 0, 0, 0, 0, 139.57],
  'π⁰': [0, 0, 0, 0, 0, 0, 134.98], 'K⁺': [1, 0, 0, 0, 0, 1, 493.68], 'K⁻': [-1, 0, 0, 0, 0, -1, 493.68], 'K⁰': [0, 0, 0, 0, 0, 1, 497.61], 'K̄⁰': [0, 0, 0, 0, 0, -1, 497.61],
  'e⁻': [-1, 0, 1, 0, 0, 0, 0.511], 'e⁺': [1, 0, -1, 0, 0, 0, 0.511], 'μ⁻': [-1, 0, 0, 1, 0, 0, 105.66], 'μ⁺': [1, 0, 0, -1, 0, 0, 105.66], 'τ⁻': [-1, 0, 0, 0, 1, 0, 1776.9],
  'νe': [0, 0, 1, 0, 0, 0, 0], 'ν̄e': [0, 0, -1, 0, 0, 0, 0], 'νμ': [0, 0, 0, 1, 0, 0, 0], 'ν̄μ': [0, 0, 0, -1, 0, 0, 0], 'ντ': [0, 0, 0, 0, 1, 0, 0], 'γ': [0, 0, 0, 0, 0, 0, 0],
};
// [left, right, kind]: kind 'decay' checks energy; force for allowed processes
const PROC = [
  [['n'], ['p', 'e⁻', 'ν̄e'], 'weak'], [['n'], ['p', 'e⁻', 'νe'], null], [['Λ⁰'], ['p', 'π⁻'], 'weak'], [['Λ⁰'], ['p', 'K⁻'], null],
  [['Σ⁰'], ['Λ⁰', 'γ'], 'electromagnetic'], [['μ⁻'], ['e⁻', 'ν̄e', 'νμ'], 'weak'], [['μ⁻'], ['e⁻', 'γ'], null], [['π⁺'], ['μ⁺', 'νμ'], 'weak'],
  [['π⁻', 'p'], ['K⁰', 'Λ⁰'], 'strong'], [['π⁻', 'p'], ['K̄⁰', 'Λ⁰'], null], [['p', 'p̄'], ['n', 'n'], null], [['Ω⁻'], ['Ξ⁻', 'π⁰'], 'weak'],
  [['τ⁻'], ['π⁻', 'ντ'], 'weak'], [['p'], ['e⁺', 'π⁰'], null], [['Ξ⁻'], ['n', 'π⁻'], null], [['K⁺'], ['π⁺', 'π⁰'], 'weak'],
];
const ROWS = ['charge Q', 'baryon number B', 'L_e', 'L_μ', 'L_τ', 'strangeness S'];

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 470, min: 260, label: 'Table of conserved quantities before and after a chosen process' });
  let idx = 0;
  const ctl = row(host), out = readout(host);
  const sel = document.createElement('select');
  sel.setAttribute('aria-label', 'Process to check');
  PROC.forEach(([l, r], i) => { const o = document.createElement('option'); o.value = String(i); o.textContent = `${l.join(' + ')} → ${r.join(' + ')}`; sel.appendChild(o); });
  sel.addEventListener('change', () => { idx = +sel.value; cv.redraw(); show(); });
  const lab = document.createElement('label'); lab.className = 'lk-slider'; const sp = document.createElement('span'); sp.textContent = 'Process'; lab.append(sp, sel); ctl.appendChild(lab);
  const sum = (side, k) => side.reduce((s, x) => s + P[x][k], 0);
  const check = () => {
    const [l, r] = PROC[idx], bad = [];
    for (let k = 0; k < 6; k++) if (sum(l, k) !== sum(r, k)) bad.push(k);
    const decay = l.length === 1, mi = sum(l, 6), mf = sum(r, 6), eOK = !decay || mi > mf;
    return { l, r, bad, decay, mi, mf, eOK };
  };
  const show = () => {
    const c = check(), force = PROC[idx][2];
    const strong = force === null && c.bad.length === 1 && c.bad[0] === 5 && c.l.length === 2;
    let msg;
    if (c.bad.length === 0 && c.eOK) {
      msg = `<b>Allowed</b>, by the ${force} interaction. ${force === 'weak' ? (c.l.some((x) => P[x][5]) || c.r.some((x) => P[x][5])) && sum(c.l, 5) !== sum(c.r, 5) ? 'Strangeness changes by one unit, which only the weak force can do.' : 'Neutrinos or a flavour change mark it as weak.' : force === 'electromagnetic' ? 'A photon, no flavour change.' : 'Strangeness is conserved, so the strong force can do it.'}`;
    } else if (c.bad.length === 0) msg = `<b>Forbidden by energy</b>: the products weigh ${c.mf.toFixed(1)} MeV, more than the parent (${c.mi.toFixed(1)} MeV).`;
    else if (strong) msg = '<b>Forbidden</b> as a strong reaction: strangeness is not conserved. (The weak force could change it, but in a collision the strong channels win by far.)';
    else if (c.bad.length === 1 && c.bad[0] === 5 && c.decay) msg = `<b>Forbidden</b>: strangeness changes by ${Math.abs(sum(c.r, 5) - sum(c.l, 5))}; even the weak force changes it by at most one unit per decay.`;
    else msg = `<b>Forbidden</b>: ${c.bad.map((k) => ROWS[k]).join(', ')} not conserved.`;
    if (c.decay && c.bad.length === 0 && c.eOK) msg += ` Energy: ${c.mi.toFixed(1)} MeV in, ${c.mf.toFixed(1)} MeV of rest mass out, ${(c.mi - c.mf).toFixed(1)} MeV shared as kinetic energy.`;
    out.innerHTML = msg;
  };
  cv.draw = (ctx, W, H, col) => {
    const c = check(), n = ROWS.length + (c.decay ? 1 : 0), rh = Math.min(30, (H - 40) / n), x1 = W * 0.44, x2 = W * 0.64, x3 = W * 0.86;
    text(ctx, `${c.l.join(' + ')}  →  ${c.r.join(' + ')}`, W / 2, 14, { color: col.ink, size: 14, weight: 700, align: 'center' });
    const y0 = 38;
    text(ctx, 'before', x1, y0, { color: col.muted, size: 11, align: 'center' }); text(ctx, 'after', x2, y0, { color: col.muted, size: 11, align: 'center' });
    ROWS.forEach((nm, k) => {
      const y = y0 + rh * (k + 1), a = sum(c.l, k), b = sum(c.r, k), ok = a === b;
      text(ctx, nm, 10, y, { color: col.ink, size: 12 });
      text(ctx, String(a), x1, y, { color: col.ink, size: 13, align: 'center' }); text(ctx, String(b), x2, y, { color: col.ink, size: 13, align: 'center' });
      text(ctx, ok ? '✓' : '✗', x3, y, { color: ok ? (col.good || col.s[0]) : (col.bad || col.s[2]), size: 15, weight: 700, align: 'center' });
    });
    if (c.decay) {
      const y = y0 + rh * (ROWS.length + 1);
      text(ctx, 'mass (MeV)', 10, y, { color: col.ink, size: 12 });
      text(ctx, c.mi.toFixed(1), x1, y, { color: col.ink, size: 13, align: 'center' }); text(ctx, c.mf.toFixed(1), x2, y, { color: col.ink, size: 13, align: 'center' });
      text(ctx, c.eOK ? '✓' : '✗', x3, y, { color: c.eOK ? (col.good || col.s[0]) : (col.bad || col.s[2]), size: 15, weight: 700, align: 'center' });
    }
  };
  cv.redraw(); show();
}
