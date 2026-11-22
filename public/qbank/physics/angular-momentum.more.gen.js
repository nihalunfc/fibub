// Extra question shapes for angular-momentum (templates qam-m31..m35). Imported by angular-momentum.js.
import { int, choose, round, fmt } from '../_util.js';
import { msqOf, pickMcq, factMcq, oomMcq } from './_more.js';

export default [
  { id: 'qam-m31', type: 'mcq', level: 3, exams: ['gate', 'net', 'jam'], sub: 'measuring L_z',
    make(r) {
      const SETS = { 0: '$\\{0\\}$', p1: '$\\{+\\hbar\\}$', m1: '$\\{-\\hbar\\}$', pm1: '$\\{-\\hbar, +\\hbar\\}$', all1: '$\\{-\\hbar, 0, +\\hbar\\}$', pm2: '$\\{-2\\hbar, +2\\hbar\\}$', p2: '$\\{+2\\hbar\\}$', m2: '$\\{-2\\hbar\\}$' };
      const F = choose(r, [
        ['x', 'pm1', '$x = r\\sin\\theta\\cos\\phi = \\tfrac{r}{2}\\sin\\theta(e^{i\\phi} + e^{-i\\phi})$: equal parts $m = +1$ and $m = -1$.'],
        ['z', '0', '$z = r\\cos\\theta$ has no $\\phi$ dependence: $m = 0$ only.'],
        ['(x + iy)', 'p1', '$x + iy = r\\sin\\theta\\,e^{i\\phi}$: pure $m = +1$.'],
        ['(x - iy)', 'm1', '$x - iy = r\\sin\\theta\\,e^{-i\\phi}$: pure $m = -1$.'],
        ['xy', 'pm2', '$xy = \\tfrac{r^2}{2}\\sin^2\\theta\\sin2\\phi = \\tfrac{r^2}{4i}\\sin^2\\theta(e^{2i\\phi} - e^{-2i\\phi})$: $m = \\pm2$.'],
        ['(x^2 - y^2)', 'pm2', '$x^2 - y^2 = r^2\\sin^2\\theta\\cos2\\phi$: $m = \\pm2$.'],
        ['xz', 'pm1', '$xz = r^2\\sin\\theta\\cos\\theta\\cos\\phi$: $m = \\pm1$.'],
        ['(x + iy)z', 'p1', '$(x + iy)z = r^2\\sin\\theta\\cos\\theta\\,e^{i\\phi}$: pure $m = +1$.'],
        ['(x - iy)^2', 'm2', '$(x - iy)^2 = r^2\\sin^2\\theta\\,e^{-2i\\phi}$: pure $m = -2$.'],
        ['(x + iy)^2', 'p2', '$(x + iy)^2 = r^2\\sin^2\\theta\\,e^{2i\\phi}$: pure $m = +2$.'],
        ['(x + z)', 'all1', '$x$ gives $m = \\pm1$ and $z$ gives $m = 0$: all three values occur.'],
      ]);
      const o = pickMcq(r, SETS[F[1]], Object.keys(SETS).filter((k) => k !== F[1]).map((k) => SETS[k]));
      return { q: `A particle has wavefunction $\\psi \\propto ${F[0]}\\,f(r)$. The possible results of a measurement of $L_z$ are`, ...o,
        sol: `Write the angular part in terms of $e^{im\\phi}$; each power $e^{im\\phi}$ is an eigenfunction of $L_z = -i\\hbar\\,\\partial_\\phi$ with eigenvalue $m\\hbar$. ${F[2]}`,
        trap: 'Real combinations such as $\\cos\\phi$ are not $L_z$ eigenfunctions; they mix $+m$ and $-m$.' };
    } },
  { id: 'qam-m32', type: 'msq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'allowed quantum numbers', format: 'statements',
    make(r) {
      const l1 = int(r, 0, 3), m1 = int(r, -l1, l1), l2 = int(r, 1, 4), m2 = int(r, -l2, l2), l3 = int(r, 0, 2), bad = choose(r, [3, 4, 5, 8, 10, 14]);
      const hb = (m) => (m === 0 ? '0' : m === 1 ? '\\hbar' : m === -1 ? '-\\hbar' : `${m}\\hbar`);
      const pair = (lam, m) => `$L^2 = ${lam === 0 ? '0' : `${lam}\\hbar^2`}$, $L_z = ${hb(m)}$`;
      const not = r() < 0.4;
      const m = msqOf(r, [
        [pair(l1 * (l1 + 1), m1), true, `$${l1 * (l1 + 1)} = l(l+1)$ with $l = ${l1}$, and $|m| = ${Math.abs(m1)} \\le ${l1}$.`],
        [pair(l2 * (l2 + 1), m2), true, `$l = ${l2}$ and $|m| = ${Math.abs(m2)} \\le ${l2}$.`],
        [pair(l3 * (l3 + 1), l3 + 1), false, `$l = ${l3}$ allows only $|m| \\le ${l3}$.`],
        [pair(bad, 1), false, `$${bad}$ is not of the form $l(l+1)$ for integer $l$ (0, 2, 6, 12, 20, ...).`],
        ['$L^2 = \\tfrac34\\hbar^2$, $L_z = \\tfrac12\\hbar$', false, 'This is spin $\\tfrac12$; orbital angular momentum needs integer $l$ because the wavefunction must be single-valued in $\\phi$.'],
      ], { not });
      return { q: `Which of the following pairs ${not ? 'can <b>NOT</b> be' : 'can be'} simultaneous eigenvalues of $L^2$ and $L_z$ for the <b>orbital</b> angular momentum of a particle?`, ...m,
        trap: 'Check both conditions: $L^2/\\hbar^2 = l(l+1)$ for an integer $l$, and then $|m| \\le l$.' };
    } },
  { id: 'qam-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'spherical harmonics', format: 'which is NOT',
    make(r) {
      const lz = r() < 0.5;
      const L2eig = [['$\\cos\\theta$', '$\\propto Y_{10}$, $l = 1$.'], ['$\\sin\\theta\\,e^{i\\phi}$', '$\\propto Y_{11}$, $l = 1$.'], ['$3\\cos^2\\theta - 1$', '$\\propto Y_{20}$, $l = 2$.'], ['$\\sin\\theta\\cos\\theta\\,e^{-i\\phi}$', '$\\propto Y_{2,-1}$, $l = 2$.'], ['$\\sin^2\\theta\\,e^{2i\\phi}$', '$\\propto Y_{22}$, $l = 2$.'], ['$\\sin\\theta\\cos\\phi$', 'A sum of $Y_{1,1}$ and $Y_{1,-1}$: both have $l = 1$, so it is still an $L^2$ eigenfunction.']];
      const L2not = [['$\\cos^2\\theta$', '$\\cos^2\\theta = \\tfrac13 + \\tfrac13(3\\cos^2\\theta - 1)$ mixes $l = 0$ and $l = 2$.'], ['$\\sin^2\\theta$', '$1 - \\cos^2\\theta$ also mixes $l = 0$ and $l = 2$.'], ['$\\cos\\theta + \\cos^2\\theta$', 'It mixes $l = 0$, $1$ and $2$.']];
      const Lzeig = [['$\\cos^2\\theta$', 'No $\\phi$ dependence: $m = 0$.'], ['$\\sin\\theta\\,e^{i\\phi}$', '$m = 1$.'], ['$\\sin^3\\theta\\,e^{-3i\\phi}$', '$m = -3$.'], ['$\\cos\\theta$', '$m = 0$.'], ['$f(\\theta)\\,e^{2i\\phi}$ for any $f$', '$m = 2$ whatever $f$ is.']];
      const Lznot = [['$\\sin\\theta\\cos\\phi$', '$\\cos\\phi$ mixes $m = +1$ and $m = -1$.'], ['$\\sin^2\\theta\\sin2\\phi$', '$\\sin2\\phi$ mixes $m = \\pm2$.'], ['$e^{i\\phi} + e^{2i\\phi}$', 'Mixes $m = 1$ and $m = 2$.']];
      const [good, bad] = lz ? [Lzeig, Lznot] : [L2eig, L2not];
      const c = choose(r, bad), ws = good;
      const o = pickMcq(r, c[0], ws.map((w) => w[0]));
      return { q: `Which ONE of these angular functions is <b>NOT</b> an eigenfunction of ${lz ? '$L_z = -i\\hbar\\,\\partial/\\partial\\phi$' : '$L^2$'}?`, ...o,
        sol: `${c[0]}: ${c[1]}<br>The others are eigenfunctions:<ul>${o.options.filter((x) => x !== c[0]).map((x) => `<li>${x}: ${ws.find((w) => w[0] === x)[1]}</li>`).join('')}</ul>`,
        trap: lz ? 'Any $\\theta$ dependence is allowed for an $L_z$ eigenfunction; only the $\\phi$ dependence must be a single $e^{im\\phi}$.' : 'A combination of different $m$ with the same $l$ is still an $L^2$ eigenfunction; mixing different $l$ is not.' };
    } },
  { id: 'qam-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'expectation values', format: 'which is NOT',
    make(r) {
      const l = int(r, 2, 4), m = int(r, 1 - l, l - 1) || 1;
      const L2 = l * (l + 1), lx2 = (L2 - m * m) / 2, pm = (l + m) * (l - m + 1), mp = (l - m) * (l + m + 1);
      const v = (x) => `${round(x, 2)}\\hbar^2`;
      const T = [
        ['$\\langle L_x\\rangle = 0$', '$L_x = (L_+ + L_-)/2$ changes $m$, so its diagonal element vanishes.'],
        [`$\\langle L_x^2\\rangle = ${v(lx2)}$`, `$\\tfrac12[l(l+1) - m^2]\\hbar^2 = \\tfrac12(${L2} - ${m * m})\\hbar^2$.`],
        [`$\\langle L_+L_-\\rangle = ${v(pm)}$`, `$L_+L_- = L^2 - L_z^2 + \\hbar L_z$, giving $(l + m)(l - m + 1)\\hbar^2 = ${pm}\\hbar^2$.`],
        [`$\\langle L_-L_+\\rangle = ${v(mp)}$`, `$L_-L_+ = L^2 - L_z^2 - \\hbar L_z$, giving $(l - m)(l + m + 1)\\hbar^2 = ${mp}\\hbar^2$.`],
        [`$\\langle L_x^2 + L_y^2\\rangle = ${v(L2 - m * m)}$`, `$L^2 - L_z^2 = (${L2} - ${m * m})\\hbar^2$.`],
      ];
      const F = [
        [`$\\langle L_x^2\\rangle = ${v(L2 - m * m)}$`, 'This is $\\langle L_x^2 + L_y^2\\rangle$; by symmetry $L_x^2$ gets half of it.'],
        [`$\\langle L^2\\rangle = ${v(l * l)}$`, `$\\langle L^2\\rangle = l(l+1)\\hbar^2 = ${L2}\\hbar^2$, not $l^2\\hbar^2$.`],
        [`$\\langle L_x\\rangle = ${m}\\hbar/2$`.replace('1\\hbar', '\\hbar'), 'The diagonal element of $L_x$ is zero in any $|l, m\\rangle$.'],
        ...(pm !== mp ? [[`$\\langle L_+L_-\\rangle = ${v(mp)}$`, `That is $\\langle L_-L_+\\rangle$; $\\langle L_+L_-\\rangle = (l + m)(l - m + 1)\\hbar^2 = ${pm}\\hbar^2$.`]] : []),
        [`$\\langle L_z^2\\rangle = ${v(L2)}$`, `$\\langle L_z^2\\rangle = m^2\\hbar^2 = ${m * m}\\hbar^2$.`],
      ];
      const not = r() < 0.5;
      const o = factMcq(r, T, F, not);
      return { q: `A particle is in the state $|l = ${l}, m = ${m}\\rangle$. Which ONE statement is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...o,
        trap: 'Remember $L_+L_- - L_-L_+ = 2\\hbar L_z$: the two orderings differ unless $m = 0$.' };
    } },
  { id: 'qam-m35', type: 'mcq', level: 1, exams: ['jam', 'gate'], sub: 'classical limit', format: 'order of magnitude',
    make(r) {
      const S = choose(r, [
        ['a spinning top', 'moment of inertia $10^{-4}$ kg m$^2$ spinning at', 1e-4, 10, 'rev/s'],
        ['a bicycle wheel', 'moment of inertia $0.1$ kg m$^2$ spinning at', 0.1, 5, 'rev/s'],
        ['a CO molecule', 'moment of inertia $1.45\\times10^{-46}$ kg m$^2$ rotating at', 1.45e-46, 1e11, 'rev/s'],
        ['a hard disk platter', 'moment of inertia $5\\times10^{-5}$ kg m$^2$ spinning at', 5e-5, 120, 'rev/s'],
        ['a dust grain', 'moment of inertia $10^{-30}$ kg m$^2$ spinning at', 1e-30, 1e5, 'rev/s'],
      ]);
      const f = choose(r, [1, 2, 3]), w = 2 * Math.PI * S[3] * f, Lq = S[2] * w / 1.0546e-34;
      const o = oomMcq(r, Lq);
      return { q: `For ${S[0]} (${S[1]} $${fmt(S[3] * f, 3)}$ ${S[4]}), the orbital quantum number $l$ with $\\sqrt{l(l+1)}\\,\\hbar \\approx L$ is closest to`, ...o,
        sol: `$L = I\\omega = ${fmt(S[2], 3)}\\times2\\pi\\times${fmt(S[3] * f, 3)} = ${fmt(S[2] * w, 3)}$ J s, and for large $l$, $l \\approx L/\\hbar = ${fmt(Lq, 2)}$, nearest power of ten $10^{${o.k}}$. ${Lq > 1e6 ? 'Such huge $l$ is why angular momentum looks continuous for everyday objects.' : 'Small $l$: the rotation is truly quantum.'}`,
        trap: 'Using revolutions per second as $\\omega$ leaves out the factor $2\\pi$.' };
    } },
];
