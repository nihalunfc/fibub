// Extra question shapes for relativistic-kinematics (templates rk-m31..m35). Imported by relativistic-kinematics.js.
import { int, choose, mcqOptions, shuffle } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, matchOne, orderOpts } from './_odd.js';

export default [
  { id: 'rk-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'four-vectors', format: 'statements',
    make(r) {
      let v;
      if (r() < 0.35) { const q = choose(r, [[3, 1, 2, 2], [5, 3, 4, 0], [5, 0, 3, 4], [7, 2, 3, 6], [9, 4, 4, 7]]); const sp = shuffle(r, q.slice(1)).map((x) => (r() < 0.5 ? -x : x)); v = [q[0], ...sp]; }
      else v = [int(r, 1, 6), int(r, -3, 3), int(r, -3, 3), int(r, -3, 3)];
      const sp2 = v[1] ** 2 + v[2] ** 2 + v[3] ** 2, s = v[0] ** 2 - sp2, not = r() < 0.5;
      const kind = s > 0 ? 'timelike' : s === 0 ? 'lightlike (null)' : 'spacelike';
      const m = msqOf(r, [
        [`$A^\\mu A_\\mu = ${s}$`, true, `$A^\\mu A_\\mu = (A^0)^2 - |\\vec A|^2 = ${v[0] ** 2} - ${sp2} = ${s}$.`],
        [`$A^\\mu A_\\mu = ${v[0] ** 2 + sp2}$`, sp2 === 0, 'With signature $(+, -, -, -)$ the spatial part enters with a minus sign.'],
        ['$A$ is timelike', s > 0, `$A^\\mu A_\\mu = ${s}$, so $A$ is ${kind}.`],
        ['$A$ is lightlike (null)', s === 0, `$A^\\mu A_\\mu = ${s}$, so $A$ is ${kind}.`],
        ['$A$ is spacelike', s < 0, `$A^\\mu A_\\mu = ${s}$, so $A$ is ${kind}.`],
        ['$A$ could be the four-momentum of a massive particle', s > 0, s > 0 ? `It is timelike with $A^0 \\gt 0$: mass $\\sqrt{${s}}$ in these units.` : 'A massive particle needs a timelike four-momentum.'],
        ['$A$ could be the four-momentum of a photon', s === 0 && sp2 > 0, s === 0 ? 'Null with positive energy: yes.' : 'A photon needs $A^\\mu A_\\mu = 0$.'],
        ['some inertial frame sees all three spatial components of $A$ as zero', s > 0, s > 0 ? 'Boost to the rest frame of a timelike vector.' : 'Only a timelike vector can be boosted to zero spatial part.'],
        ['some inertial frame sees the time component of $A$ as zero', s < 0, s < 0 ? 'A spacelike vector can be boosted so that its events are simultaneous.' : 'Only a spacelike vector can have its time component boosted to zero.'],
      ], { not });
      return { q: `With signature $(+, -, -, -)$ and $c = 1$, a four-vector has components $A^\\mu = (${v.join(', ')})$. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'The invariant is $(A^0)^2 - |\\vec A|^2$, and its sign decides what can be boosted away.' };
    } },
  { id: 'rk-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'allowed processes', format: 'which is NOT',
    make(r) {
      const not = r() < 0.6;
      const m = oneOf(r, [
        ['$\\pi^0 \\to \\gamma + \\gamma$', true, 'In the pion rest frame two photons go back to back, each with 67.5 MeV.'],
        ['$n \\to p + e^- + \\bar\\nu_e$ (free neutron)', true, '$m_n = 939.6$ MeV exceeds $m_p + m_e = 938.8$ MeV.'],
        ['$\\Lambda \\to p + \\pi^-$', true, '$1115.7$ MeV exceeds $938.3 + 139.6 = 1077.9$ MeV.'],
        ['$K^+ \\to \\pi^+ + \\pi^0$', true, '$493.7$ MeV exceeds $139.6 + 135.0 = 274.6$ MeV.'],
        ['$\\gamma + \\gamma \\to e^+ + e^-$ (energetic photons colliding head-on)', true, 'Two photons can have invariant mass above $2m_ec^2$; then pair creation is allowed.'],
        ['$\\gamma \\to e^+ + e^-$ (a single photon in empty space)', false, 'The photon has $p^\\mu p_\\mu = 0$ but the pair has at least $(2m_e)^2 \\gt 0$; a nucleus is needed to take up momentum.'],
        ['$e^- \\to e^- + \\gamma$ (a free electron)', false, 'In the electron\'s rest frame it would have to lose energy while staying at rest: impossible.'],
        ['$p \\to n + e^+ + \\nu_e$ (a free proton)', false, '$m_p = 938.3$ MeV is less than $m_n + m_e = 940.1$ MeV.'],
        ['$K^0 \\to \\pi^+ + \\pi^- + \\pi^0 + \\pi^0$', false, '$497.6$ MeV is less than $2(139.6) + 2(135.0) = 549.2$ MeV.'],
      ], not);
      return { q: `Considering only energy-momentum conservation (ignore other conservation laws), which process is ${not ? '<b>NOT</b> possible' : 'possible'}?`, ...m,
        trap: 'A decay at rest needs the parent mass to exceed the sum of the daughter masses; a single massless particle cannot make a massive pair.' };
    } },
  { id: 'rk-m33', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'checking formulas', format: 'limiting case',
    make(r) {
      const S = choose(r, [
        ['the speed in $S$ of an object moving at $u$ along $x$ in a frame $S\'$ that itself moves at $v$ along $x$',
          '$\\dfrac{u + v}{1 + uv/c^2}$', ['$\\dfrac{u + v}{1 - uv/c^2}$', '$\\dfrac{u + v}{\\sqrt{1 + uv/c^2}}$', '$\\dfrac{u + v}{1 + uv}$', '$u + v$'],
          'Checks: for $u, v \\ll c$ it must reduce to $u + v$; for $u = c$ it must give $c$ (light speed is the same for all); it must never exceed $c$; and $uv/c^2$ must be dimensionless. Only the answer passes all four.'],
        ['the frequency received from a source of frequency $f_0$ approaching at speed $\\beta c$ along the line of sight',
          '$f_0\\sqrt{\\dfrac{1 + \\beta}{1 - \\beta}}$', ['$f_0\\sqrt{\\dfrac{1 - \\beta}{1 + \\beta}}$', '$f_0(1 + \\beta)$', '$\\dfrac{f_0}{\\sqrt{1 - \\beta^2}}$', '$f_0\\sqrt{1 - \\beta^2}$'],
          'Checks: an approaching source must be blueshifted ($f \\gt f_0$); to first order in $\\beta$ it must match the classical $f_0(1 + \\beta)$; as $\\beta \\to 1$ it must grow without bound; and reversing the motion ($\\beta \\to -\\beta$) must give the reciprocal factor. The pure time-dilation factor $\\gamma f_0$ fails the first-order test, and $f_0(1 + \\beta)$ fails the reciprocity test.'],
        ['the momentum $p$ of a particle of mass $m$ in terms of its kinetic energy $K$',
          '$\\dfrac{1}{c}\\sqrt{K^2 + 2Kmc^2}$', ['$\\dfrac{1}{c}\\sqrt{K^2 - 2Kmc^2}$', '$\\sqrt{2mK}$', '$\\dfrac{1}{c}\\sqrt{K^2 + Kmc^2}$', '$\\dfrac{K}{c}$'],
          'Checks: for $K \\ll mc^2$ it must reduce to $\\sqrt{2mK}$; for $K \\gg mc^2$ (or $m = 0$) it must give $K/c$; it must be real for every $K \\gt 0$. $\\sqrt{2mK}$ fails the ultra-relativistic limit and $K/c$ the slow limit; the answer follows from $E^2 = p^2c^2 + m^2c^4$ with $E = K + mc^2$.'],
      ]);
      const o = mcqOptions(r, S[1], shuffle(r, S[2]));
      return { q: `Without deriving it, use limiting cases and dimensions to pick the correct expression for ${S[0]}.`, ...o, sol: S[3],
        trap: 'A relativistic formula must reduce to the Newtonian one for small speeds and respect the speed of light.' };
    } },
  { id: 'rk-m34', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Lorentz factor', format: 'order of magnitude',
    make(r) {
      const C = choose(r, [['a proton in the LHC with total energy 6.5 TeV', 6.5e6, 938.3, 'm_pc^2'], ['an electron with total energy 1 GeV', 1000, 0.511, 'm_ec^2'], ['an electron at LEP with total energy 100 GeV', 1e5, 0.511, 'm_ec^2'], ['a cosmic-ray muon with total energy 10 GeV', 1e4, 105.7, 'm_\\mu c^2'], ['a proton with kinetic energy 1 GeV', 1938.3, 938.3, 'm_pc^2'], ['an alpha particle with kinetic energy 5 MeV', 3732, 3727, 'm_\\alpha c^2']]);
      const g = C[1] / C[2], o = orderOpts(r, g);
      return { q: `The Lorentz factor $\\gamma$ of ${C[0]} is of order`, ...o,
        sol: `$\\gamma = E/mc^2$. Here the total energy is $E = ${C[1]}$ MeV and $${C[3]} = ${C[2]}$ MeV, so $\\gamma = ${g < 10 ? g.toFixed(4) : Math.round(g)}$, of order $10^{${o.n}}$.`,
        trap: 'Divide the total energy (kinetic plus rest energy) by the rest energy; light particles reach huge $\\gamma$ at modest energies.' };
    } },
  { id: 'rk-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'spacetime diagrams', format: 'graph in words',
    make(r) {
      const a = int(r, 1, 5), b = choose(r, [0.3, 0.5, 0.8]);
      const L = { rest: 'a vertical straight line', unif: 'a straight line steeper than the light-cone lines', light: 'a straight line at $45^\\circ$', hyp: 'a hyperbola whose asymptotes are light-cone lines', tach: 'a straight line flatter than $45^\\circ$ (not possible for a real particle)' };
      const cas = choose(r, [
        [`a particle at rest at $x = ${a}$`, 'rest', 'Its position never changes: $x = $ const for all $t$.'],
        [`a particle moving at constant speed ${b}$c$`, 'unif', `$x = ${b}ct$: slope $dt/dx = 1/${b}$ in units where light lines are at $45^\\circ$, steeper than light.`],
        ['a light pulse', 'light', '$x = \\pm ct$: the light cone.'],
        [`a rocket with constant proper acceleration ${a} (in units $c = 1$), starting from rest`, 'hyp', `Hyperbolic motion: $x^2 - t^2 = 1/${a * a}$ (with the origin chosen suitably). It approaches but never reaches the speed of light, so the asymptotes are light lines.`],
      ]);
      return { q: `On a spacetime diagram ($ct$ vertical, $x$ horizontal), the world line of ${cas[0]} is`, ...matchOne(r, L, cas),
        trap: 'Slower than light means steeper than $45^\\circ$; constant acceleration gives a hyperbola, not a parabola.' };
    } },
];
