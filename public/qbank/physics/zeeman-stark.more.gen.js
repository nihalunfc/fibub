// Extra question shapes for zeeman-stark (templates zst-m31..m35). Imported by zeeman-stark.js.
import { int, choose, round, fmt } from '../_util.js';
import { msqOf, pickMcq, oomMcq } from './_more.js';

const LL = 'SPDFG';
const hf = (x) => (Number.isInteger(x) ? `${x}` : `${x < 0 ? '-' : ''}\\tfrac{${Math.abs(2 * x)}}{2}`);
const term = (S, L, J) => `{}^{${2 * S + 1}}\\mathrm{${LL[L]}}_{${hf(J)}}`;
const gJ = (S, L, J) => 1 + (J * (J + 1) + S * (S + 1) - L * (L + 1)) / (2 * J * (J + 1));

export default [
  { id: 'zst-m31', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'normal and anomalous Zeeman effect',
    make(r) {
      const normal = [[0, 2, 2, 0, 1, 1], [0, 1, 1, 0, 0, 0], [0, 3, 3, 0, 2, 2], [0, 2, 2, 0, 3, 3]];
      const anom = [[0.5, 1, 1.5, 0.5, 0, 0.5], [0.5, 1, 0.5, 0.5, 0, 0.5], [0.5, 2, 1.5, 0.5, 1, 0.5], [1, 1, 1, 1, 0, 1], [1, 1, 2, 1, 2, 3], [0.5, 2, 2.5, 0.5, 1, 1.5]];
      const lab = (t) => `$${term(t[0], t[1], t[2])} \\to ${term(t[3], t[4], t[5])}$`;
      const askN = r() < 0.6;
      const c = choose(r, askN ? normal : anom);
      const o = pickMcq(r, lab(c), (askN ? anom : normal).map(lab));
      return { q: `In a weak magnetic field, which ONE of these transitions shows ${askN ? 'the <b>normal</b> Zeeman pattern (three equally spaced lines, spacing $\\mu_BB$)' : 'an <b>anomalous</b> Zeeman pattern'}?`, ...o,
        sol: `With $S = 0$ both levels have $g_J = 1$, so every $\\Delta M = 0, \\pm1$ component is shifted by $0$ or $\\pm\\mu_BB$: three lines (the normal effect). If $S \\ne 0$ the two levels generally have different $g_J$, and the components spread into more lines. Here ${lab(c)} has ${c[0] === 0 ? '$S = 0$: normal' : `$g_J = ${round(gJ(c[0], c[1], c[2]), 3)}$ and $${round(gJ(c[3], c[4], c[5]), 3)}$: anomalous`}.`,
        trap: '"Normal" is the special case (singlets); most atoms with spin show the anomalous effect.' };
    } },
  { id: 'zst-m32', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Zeeman splitting of a level', format: 'statements',
    make(r) {
      const T = choose(r, [[0.5, 1, 1.5], [0.5, 1, 0.5], [1, 1, 1], [1, 1, 2], [0.5, 2, 1.5], [0.5, 2, 2.5], [1.5, 3, 1.5], [1, 2, 3], [1, 2, 1]]), [S, L, J] = T;
      const g = gJ(S, L, J), gw = 1 + (J * (J + 1) + L * (L + 1) - S * (S + 1)) / (2 * J * (J + 1)); // L and S swapped
      const B = choose(r, [0.5, 1, 2]), sp = g * 0.05788 * B;
      const not = r() < 0.4;
      const m = msqOf(r, [
        [`The level splits into $${2 * J + 1}$ sublevels`, true, `$M_J = -J, \\ldots, J$: $2J + 1 = ${2 * J + 1}$.`],
        ...(2 * L + 1 !== 2 * J + 1 ? [[`The level splits into $${2 * L + 1}$ sublevels`, false, 'In a weak field the sublevels are labelled by $M_J$, not $M_L$.']] : []),
        [`The Landé factor is $g_J = ${round(g, 3)}$`, true, `$g_J = 1 + \\dfrac{J(J+1) + S(S+1) - L(L+1)}{2J(J+1)} = ${round(g, 3)}$.`],
        ...(Math.abs(gw - g) > 1e-3 ? [[`The Landé factor is $g_J = ${round(gw, 3)}$`, false, `This swaps $L$ and $S$ in the Landé formula; the correct value is $${round(g, 3)}$.`]] : []),
        [`In $B = ${B}$ T adjacent sublevels are $${round(sp, 4)}$ meV apart`, true, `$g_J\\mu_BB = ${round(g, 3)}\\times0.05788\\text{ meV/T}\\times${B}$ T.`],
        ['The sublevels are equally spaced', true, 'In the weak-field limit $\\Delta E = g_J\\mu_BBM_J$ is linear in $M_J$.'],
        ['The centre of gravity of the sublevels shifts linearly with $B$', false, '$\\sum_{M_J}M_J = 0$, so the mean energy is unchanged to first order.'],
      ], { not });
      return { q: `An atomic level $${term(S, L, J)}$ is placed in a weak magnetic field (anomalous Zeeman regime, $g_s = 2$, $\\mu_B = 0.05788$ meV/T). Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Use $g_s = 2$ in the Landé formula; with $g_s = 1$ every $g_J$ would be 1.' };
    } },
  { id: 'zst-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'weak and strong field', format: 'classification',
    make(r) {
      const AT = [['the hydrogen 2p doublet', 0.0453], ['the lithium 2p doublet', 0.0415], ['the sodium 3p doublet', 2.13], ['the potassium 4p doublet', 7.16], ['the rubidium 5p doublet', 29.5]];
      const reg = choose(r, ['weak', 'mid', 'strong']);
      const A = choose(r, reg === 'weak' ? AT : reg === 'mid' ? AT.slice(0, 3) : AT.slice(0, 2));
      const t = { weak: choose(r, [0.01, 0.03]), mid: 1, strong: choose(r, [30, 100]) }[reg];
      const B = +(A[1] * t / 0.05788).toPrecision(2), rr = 0.05788 * B / A[1];
      const O = {
        weak: 'weak field (anomalous Zeeman): $J$ and $M_J$ are good; shifts $g_J\\mu_BBM_J$',
        strong: 'strong field (Paschen-Back): $m_l$ and $m_s$ are good; shifts $\\mu_BB(m_l + 2m_s)$',
        mid: 'intermediate: neither set is good; the $2\\times2$ blocks must be diagonalised (Breit-Rabi-like)',
        lin: 'linear Stark regime: the levels shift in proportion to $B^2$',
      };
      const key = rr < 0.2 ? 'weak' : rr > 5 ? 'strong' : 'mid';
      const o = pickMcq(r, O[key], Object.keys(O).filter((k) => k !== key).map((k) => O[k]));
      return { q: `The fine-structure splitting of ${A[0]} is $${A[1]}$ meV. A magnetic field of $${fmt(B, 2)}$ T is applied ($\\mu_B = 0.05788$ meV/T). Which regime applies?`, ...o,
        sol: `Compare $\\mu_BB = ${fmt(0.05788 * B, 3)}$ meV with the fine-structure splitting $${A[1]}$ meV: the ratio is $${fmt(rr, 2)}$. ${{ weak: 'The Zeeman energy is a small perturbation on the fine-structure levels.', strong: 'The Zeeman energy dominates, decoupling $\\vec L$ and $\\vec S$.', mid: 'They are comparable, so neither basis diagonalises the Hamiltonian.' }[key]}`,
        trap: 'The same field can be "weak" for a heavy alkali and "strong" for hydrogen: it is the ratio to the fine-structure splitting that counts.' };
    } },
  { id: 'zst-m34', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'polarisation of Zeeman components', format: 'match the system',
    make(r) {
      const comp = choose(r, [['$\\pi$ ($\\Delta M = 0$)', 'pi'], ['$\\sigma^+$ ($\\Delta M = +1$)', 'sig'], ['$\\sigma^-$ ($\\Delta M = -1$)', 'sig']]);
      const along = r() < 0.5;
      const O = { abs: 'absent', par: 'linearly polarised parallel to $\\vec B$', perp: 'linearly polarised perpendicular to $\\vec B$', circ: 'circularly polarised' };
      const key = comp[1] === 'pi' ? (along ? 'abs' : 'par') : (along ? 'circ' : 'perp');
      const o = pickMcq(r, O[key], Object.keys(O).filter((k) => k !== key).map((k) => O[k]));
      return { q: `A Zeeman pattern is viewed ${along ? '<b>along</b> the magnetic field' : '<b>perpendicular</b> to the magnetic field'}. The ${comp[0]} component is`, ...o,
        sol: `The $\\pi$ component radiates like a dipole oscillating along $\\vec B$: it is linearly polarised along $\\vec B$ when seen from the side and emits nothing along the axis. A $\\sigma^\\pm$ component radiates like a dipole rotating in the plane perpendicular to $\\vec B$: circular (opposite senses for $\\pm$) along the axis, and linear perpendicular to $\\vec B$ from the side.`,
        trap: 'An oscillating dipole emits nothing along its own axis, so $\\pi$ light vanishes in the longitudinal view.' };
    } },
  { id: 'zst-m35', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'size of Zeeman splittings', format: 'order of magnitude',
    make(r) {
      const F = choose(r, [['the Earth\'s field ($50$ μT)', 5e-5], ['a laboratory magnet ($1$ T)', 1], ['an NMR magnet ($20$ T)', 20], ['a magnetar surface field ($10^{10}$ T)', 1e10], ['a fridge magnet ($5$ mT)', 5e-3]]);
      const hz = r() < 0.5, E = 5.788e-5 * F[1];
      const val = hz ? 2.8025e10 * F[1] : E;
      const o = oomMcq(r, val, hz ? 'Hz' : 'eV');
      return { q: hz
        ? `A free electron spin ($g \\approx 2$) sits in ${F[0]}. Its spin-flip (resonance) frequency $g\\mu_BB/h$ is closest to`
        : `An atomic level with $g_J = 1$ is placed in ${F[0]}. The energy spacing $\\mu_BB$ between adjacent Zeeman sublevels is closest to`, ...o,
        sol: hz
          ? `$g\\mu_B/h \\approx 28.0$ GHz/T, so $\\nu = 28.0\\text{ GHz/T}\\times${fmt(F[1], 2)}\\text{ T} = ${fmt(val, 2)}$ Hz, nearest $10^{${o.k}}$ Hz.`
          : `$\\mu_B = 5.788\\times10^{-5}$ eV/T, so $\\mu_BB = ${fmt(val, 2)}$ eV, nearest $10^{${o.k}}$ eV.`,
        trap: 'Remember $\\mu_B \\approx 58$ μeV per tesla and 14 GHz per tesla (28 GHz per tesla for an electron spin flip with $g = 2$).' };
    } },
];
