// Extra question shapes for hamiltonian-mechanics (templates ham-m31..m35). Imported by hamiltonian-mechanics.js.
import { int, choose, mcqOptions, shuffle } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, matchOne, orderOpts } from './_odd.js';

export default [
  { id: 'ham-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'charged particles and gauges', format: 'statements',
    make(r) {
      const G = choose(r, [
        ['$\\vec A = (-By, 0, 0)$', 'H = \\dfrac{(p_x + qBy)^2 + p_y^2 + p_z^2}{2m}', 1],
        ['$\\vec A = (0, Bx, 0)$', 'H = \\dfrac{p_x^2 + (p_y - qBx)^2 + p_z^2}{2m}', 2],
        ['$\\vec A = \\tfrac12B(-y, x, 0)$', 'H = \\dfrac{(p_x + \\frac12qBy)^2 + (p_y - \\frac12qBx)^2 + p_z^2}{2m}', 3],
      ]);
      const [Atx, Ht, g] = G, not = r() < 0.5;
      const m = msqOf(r, [
        ['$x$ is a cyclic coordinate', g === 1, g === 1 ? `$x$ does not appear in $${Ht}$.` : `$x$ appears in $${Ht}$.`],
        ['$y$ is a cyclic coordinate', g === 2, g === 2 ? `$y$ does not appear in $${Ht}$.` : `$y$ appears in $${Ht}$.`],
        ['$z$ is a cyclic coordinate', true, 'The field is uniform along $z$ and $A$ has no $z$-dependence.'],
        ['the canonical momentum $p_x$ equals $m\\dot x$', g === 2, g === 2 ? 'Here $A_x = 0$, so $p_x = m\\dot x + qA_x = m\\dot x$.' : 'The canonical momentum is $m\\dot x + qA_x$, and $A_x \\ne 0$ in this gauge.'],
        ['the kinetic energy $\\tfrac12mv^2$ is conserved', true, 'The magnetic force $q\\vec v\\times\\vec B$ is perpendicular to $\\vec v$ and does no work; $H$ equals $\\tfrac12mv^2$ here.'],
        ['the motion projected on the $xy$-plane is a circle traversed at angular frequency $qB/m$', true, 'Cyclotron motion, the same in every gauge.'],
        ['the physical trajectory depends on which vector potential is chosen', false, 'Gauge choices give the same $\\vec B$ and the same trajectories; only canonical momenta change.'],
      ], { not });
      return { q: `A charge $q$ (mass $m$) moves in a uniform field $\\vec B = B\\hat z$, described with ${Atx}, so that $${Ht}$. Which statements are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Canonical momentum is $m\\vec v + q\\vec A$, which depends on the gauge; the motion does not.' };
    } },
  { id: 'ham-m32', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'phase portraits', format: 'graph in words',
    make(r) {
      const k = int(r, 1, 5), m = int(r, 1, 3), F = int(r, 1, 4);
      const L = {
        osc: 'closed ellipses around the origin',
        inv: 'hyperbolas with straight asymptotes through the origin (a saddle)',
        grav: 'parabolas, each opening towards negative $q$',
        free: 'horizontal straight lines $p = $ const',
        pend: 'closed loops around $q = 0$ inside a separatrix, and wavy open curves outside it',
        abs: 'closed curves made of two parabolic arcs meeting on the $p$-axis',
      };
      const cas = choose(r, [
        [`\\dfrac{p^2}{${2 * m}} + \\dfrac{${k}}{2}q^2`, 'osc', `Each energy level $E$ gives $\\dfrac{p^2}{${2 * m}E} + \\dfrac{q^2}{2E/${k}} = 1$, an ellipse.`],
        [`\\dfrac{p^2}{${2 * m}} - \\dfrac{${k}}{2}q^2`, 'inv', `Levels $p^2/${2 * m} - ${k}q^2/2 = E$ are hyperbolas; $E = 0$ gives the asymptotes $p = \\pm\\sqrt{${m * k}}\\,q$, the stable and unstable directions of the saddle.`],
        [`\\dfrac{p^2}{${2 * m}} + ${m * 10}q`, 'grav', `Uniform force: $q = (E - p^2/${2 * m})/${m * 10}$, a parabola opening towards negative $q$ (the particle goes up, stops and comes back).`],
        [`\\dfrac{p^2}{${2 * m}}`, 'free', 'No force: $p$ is constant and $q$ grows steadily.'],
        [`\\dfrac{p^2}{${2 * m}} - ${k}\\cos q`, 'pend', `A pendulum: for $E \\lt ${k}$ the motion librates about $q = 0$; for $E \\gt ${k}$ it rotates, and $p$ oscillates without changing sign. The separatrix $E = ${k}$ joins the unstable points $q = \\pm\\pi$.`],
        [`\\dfrac{p^2}{${2 * m}} + ${F}|q|`, 'abs', `For $q \\gt 0$, $q = (E - p^2/${2 * m})/${F}$; for $q \\lt 0$ the mirror image. Two parabolic arcs join at $q = 0$, where $p = \\pm\\sqrt{${2 * m}E}$, with a corner there.`],
      ]);
      return { q: `The phase-space trajectories $(q, p)$ for $H = ${cas[0]}$ are`, ...matchOne(r, L, cas),
        trap: 'Trajectories are the level curves $H(q, p) = E$: sketch them for a few energies.' };
    } },
  { id: 'ham-m33', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'adiabatic invariants',
    make(r) {
      const n = choose(r, ['box', 1, 2, 4]);
      if (n === 'box') {
        const k = int(r, 2, 3);
        const o = mcqOptions(r, `$E/${k * k}$`, shuffle(r, [`$E/${k}$`, `$${k}E$`, `$E/${k ** 3}$`, `$E/\\sqrt{${k}}$`]));
        return { q: `A particle bounces between two walls a distance $L$ apart with energy $E$. One wall is moved outward very slowly (over many bounces) until the gap is $${k}L$. The energy becomes`, ...o,
          sol: `The action $J = \\oint p\\,dq = 2Lp$ is an adiabatic invariant, so $p \\propto 1/L$ and $E = p^2/2m \\propto 1/L^2$. With the gap ${k} times larger, $E \\to E/${k * k}$. (Each bounce off the receding wall lowers the speed slightly; the slow limit makes the product $Lp$ exact.)`,
          trap: 'Energy is not conserved when a parameter changes; the action is.' };
      }
      const K = n === 2 ? choose(r, [4, 9]) : choose(r, [8, 27]);
      const pw = { 1: '2/3', 2: '1/2', 4: '1/3' }[n], val = Math.round(K ** ({ 1: 2 / 3, 2: 0.5, 4: 1 / 3 }[n]));
      const ws = ['2/3', '1/2', '1/3', '1', '3/2'].filter((x) => x !== pw).map((x) => (x === '1' ? `$${K}E$` : `$${K}^{${x}}E$`));
      const o = mcqOptions(r, `$${K}^{${pw}}E$`, shuffle(r, ws));
      const V = { 1: 'c|q|', 2: 'cq^2', 4: 'cq^4' }[n];
      return { q: `A particle oscillates in $V(q) = ${V}$ with energy $E$. The constant $c$ is increased very slowly to $${K}c$. The energy becomes`, ...o,
        sol: `The action $J = \\oint p\\,dq$ stays fixed. For $V = c|q|^n$ the turning point is $q_0 = (E/c)^{1/n}$ and $J \\propto \\sqrt E\\,q_0 \\propto E^{1/2 + 1/n}c^{-1/n}$. Keeping $J$ fixed gives $E \\propto c^{2/(n + 2)}$; here $n = ${n}$, so $E \\propto c^{${pw}}$ and $E \\to ${K}^{${pw}}E = ${val}E$.${n === 2 ? ' (For the oscillator this is the familiar $E/\\omega$ = const with $\\omega \\propto \\sqrt c$.)' : ''}`,
        trap: 'Hold the action $\\oint p\\,dq$ fixed, not the energy or the amplitude.' };
    } },
  { id: 'ham-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'classical limit', format: 'order of magnitude',
    make(r) {
      const hbar = 1.054571817e-34;
      const S = choose(r, [
        ['a 1 kg pendulum bob on a 1 m string swinging with amplitude 0.1 rad', () => { const E = 0.5 * 1 * 9.8 * 1 * 0.01; return E / Math.sqrt(9.8); }, '$E = \\tfrac12mgl\\theta_0^2 = 0.049$ J and $\\omega = \\sqrt{g/l} = 3.13$ s$^{-1}$'],
        ['a 0.1 kg mass on a spring of stiffness 10 N/m oscillating with amplitude 1 cm', () => (0.5 * 10 * 1e-4) / 10, '$E = \\tfrac12kA^2 = 5\\times10^{-4}$ J and $\\omega = \\sqrt{k/m} = 10$ s$^{-1}$'],
        ['a 30 kg child on a 3 m swing with amplitude 0.3 rad', () => (0.5 * 30 * 9.8 * 3 * 0.09) / Math.sqrt(9.8 / 3), '$E = \\tfrac12mgl\\theta_0^2 \\approx 40$ J and $\\omega = \\sqrt{g/l} = 1.81$ s$^{-1}$'],
        ['the Earth going round the Sun (mass $6\\times10^{24}$ kg, speed 30 km/s, radius $1.5\\times10^{11}$ m), taking $J$ as the orbital angular momentum', () => 6e24 * 3e4 * 1.5e11, '$J = L = mvr = 2.7\\times10^{40}$ J s'],
      ]);
      const J = S[1](), x = J / hbar, o = orderOpts(r, x);
      return { q: `For ${S[0]}, estimate the action divided by $\\hbar$ (roughly the quantum number of the motion). It is of order`, ...o,
        sol: `For an oscillator the action is $J = E/\\omega$. Here ${S[2]}, so $J \\approx ${J.toExponential(1).replace(/e\+?(-?\d+)/, '\\times10^{$1}')}$ J s and $J/\\hbar \\approx ${x.toExponential(1).replace(/e\+?(-?\d+)/, '\\times10^{$1}')}$, of order $10^{${o.n}}$. Such huge quantum numbers are why everyday motion looks classical: neighbouring quantum levels are far too close to resolve.`,
        trap: 'Divide by $\\hbar \\approx 10^{-34}$ J s: everyday actions of order $10^{-2}$ to $10^{2}$ J s give $10^{32}$ to $10^{36}$.' };
    } },
  { id: 'ham-m35', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Liouville theorem', format: 'which is NOT',
    make(r) {
      const a = int(r, 2, 5), g = int(r, 1, 3), not = r() < 0.5;
      const m = oneOf(r, [
        [`$\\dot q = p,\\ \\dot p = -${a}q$`, true, `$H = p^2/2 + ${a}q^2/2$; divergence $0 + 0 = 0$.`],
        [`$\\dot q = ${a}q,\\ \\dot p = -${a}p$`, true, `$H = ${a}qp$; divergence $${a} - ${a} = 0$.`],
        ['$\\dot q = p + q^2,\\ \\dot p = -2qp$', true, '$H = p^2/2 + q^2p$; divergence $2q - 2q = 0$.'],
        [`$\\dot q = \\sin p,\\ \\dot p = -${a}q$`, true, `$H = -\\cos p + ${a}q^2/2$; divergence 0.`],
        ['$\\dot q = p,\\ \\dot p = q^2$', true, '$H = p^2/2 - q^3/3$; divergence 0.'],
        [`$\\dot q = p,\\ \\dot p = -${a}q - ${g === 1 ? '' : g}p$`, false, `Divergence $\\partial\\dot q/\\partial q + \\partial\\dot p/\\partial p = -${g} \\ne 0$: friction shrinks phase-space area.`],
        [`$\\dot q = ${a}q,\\ \\dot p = ${a}p$`, false, `Divergence $${2 * a} \\ne 0$: areas grow.`],
        ['$\\dot q = qp,\\ \\dot p = -q^2$', false, 'Divergence $p + 0 = p$, not identically zero.'],
        [`$\\dot q = -p,\\ \\dot p = q^3 + ${g === 1 ? '' : g}p$`, false, `Divergence $${g} \\ne 0$.`],
      ], not);
      return { q: `A flow in the $(q, p)$ plane is Hamiltonian ($\\dot q = \\partial H/\\partial p$, $\\dot p = -\\partial H/\\partial q$ for some $H$) exactly when it preserves area. Which flow is ${not ? '<b>NOT</b> Hamiltonian' : 'Hamiltonian'}?`, ...m,
        trap: 'Test the divergence $\\partial\\dot q/\\partial q + \\partial\\dot p/\\partial p$; it must vanish identically.' };
    } },
];
