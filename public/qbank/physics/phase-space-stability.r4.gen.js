// Round 4 extras for phase-space-stability: original questions, written 2026-11-22.
import { int, pick, choose, round } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'pss-r4-01', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'one-dimensional flows',
      q: R`The flow $\dot x = \sin x$ has exactly one stable fixed point between $x = 1$ and $x = 5$. It is at $x = $ ______ (to two decimal places).`,
      answer: 3.14, tol: 0.01, calc: () => Math.PI,
      sol: R`Fixed points: $\sin x = 0$, so $x = 0, \pi, 2\pi, \dots$; only $\pi$ lies between 1 and 5. Stability: $f'(x) = \cos x$, and $f'(\pi) = -1 < 0$, so it is stable. (Just below $\pi$, $\sin x > 0$ pushes $x$ up; just above, $\sin x < 0$ pushes it down.)`,
      trap: R`$x = 0$ and $2\pi$ have $f' = +1$: they are unstable, and they lie outside the range anyway.` },
    { id: 'pss-r4-02', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'one-dimensional flows',
      q: R`The fixed point $x = 0$ of the flow $\dot x = x^2$ is`,
      options: ['stable', 'unstable from both sides', 'half-stable: it attracts from one side and repels on the other', 'a centre'], answer: 2,
      sol: R`For $x < 0$, $\dot x = x^2 > 0$, so $x$ rises towards 0; for $x > 0$, $\dot x > 0$ too, so $x$ moves away. The point attracts from the left and repels on the right. Here $f'(0) = 0$, so linear analysis is silent and the sign of $f$ on each side decides.`,
      trap: R`$f'(0) = 0$ does not mean "stable": the next term in the expansion decides.` },
    { id: 'pss-r4-03', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'one-dimensional flows', format: 'statements',
      q: R`For a smooth one-dimensional autonomous flow $\dot x = f(x)$, which statements are correct?`,
      options: ['No solution can oscillate', 'Every solution is monotonic in time (or constant)', 'If all fixed points are non-degenerate ($f\' \\ne 0$ there), neighbouring fixed points have opposite stability', 'A solution can overshoot a stable fixed point and then come back to it'], answer: [0, 1, 2],
      sol: R`$\dot x$ has the sign of $f(x)$, and $x$ cannot cross a zero of $f$ (uniqueness), so each solution moves one way only: no oscillation, no overshoot. With simple zeros, $f$ changes sign at each fixed point, so the slopes $f'$ alternate in sign along the line: stable and unstable points alternate.`,
      trap: R`Overshoot and oscillation need at least two dimensions (for example, position and velocity).` },
    { id: 'pss-r4-04', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'linearisation',
      q: R`For $\dot x = -y + x(x^2 + y^2)$, $\dot y = x + y(x^2 + y^2)$, the origin is`,
      options: ['an unstable spiral, although the linearisation predicts a centre', 'a centre, as the linearisation predicts', 'a stable spiral', 'a saddle'], answer: 0,
      sol: R`The linear part $\dot x = -y$, $\dot y = x$ has eigenvalues $\pm i$: a centre. But in polar form, $r\dot r = x\dot x + y\dot y = r^2\cdot r^2$, so $\dot r = r^3 > 0$, while $\dot\theta = 1$. Orbits spiral slowly outwards: an unstable spiral. Linearisation is reliable only when no eigenvalue has zero real part (a hyperbolic point); a linear centre can turn into either kind of spiral.`,
      trap: R`A linear centre is the borderline case where small nonlinear terms decide the stability.` },
    { id: 'pss-r4-05', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'limit cycles',
      q: R`Which of these smooth systems can have an isolated closed orbit (a limit cycle)?`,
      options: [R`A gradient system $\dot{\mathbf x} = -\nabla V(\mathbf x)$ in the plane`, R`The van der Pol oscillator $\ddot x - \mu(1 - x^2)\dot x + x = 0$ with $\mu > 0$`, R`A flow $\dot x = f(x)$ on a line`, R`A Hamiltonian system $\dot q = \partial H/\partial p$, $\dot p = -\partial H/\partial q$ with one degree of freedom`], answer: 1,
      sol: R`In a gradient system $V$ decreases along every non-constant orbit ($\dot V = -|\nabla V|^2$), so no orbit can return to its start. A line flow is monotonic. A Hamiltonian system conserves $H$, so closed orbits come in continuous families (nested level curves), never isolated. Van der Pol pumps energy in at small $|x|$ and removes it at large $|x|$, and the balance selects one isolated attracting cycle.`,
      trap: R`Closed orbits in a conservative system are not limit cycles: their neighbours are closed too.` },
    { id: 'pss-r4-06', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'separatrices',
      q: R`A frictionless pendulum is started at the bottom with exactly the energy needed to reach the inverted position (it moves on the separatrix). The time it takes to reach the top is`,
      options: ['finite, about one small-oscillation period', 'infinite: it creeps ever more slowly towards the top', 'half a small-oscillation period', 'zero, by energy conservation'], answer: 1,
      sol: R`On the separatrix $\dot\theta = 2\omega_0\cos(\theta/2)$. Near the top write $\theta = \pi - u$: $\cos(\theta/2) = \sin(u/2) \approx u/2$, so $\dot u \approx -\omega_0u$ and $u \propto e^{-\omega_0t}$. The angle approaches $\pi$ exponentially and never arrives: the inverted position is a saddle, and the separatrix is its stable manifold.`,
      trap: R`Reaching a saddle along its stable direction always takes infinite time; this is why the pendulum's period diverges as its energy approaches the separatrix.` },
    { id: 'pss-r4-07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Lotka-Volterra',
      q: R`Prey $x$ and predators $y$ obey $\dot x = x(1 - 0.5y)$, $\dot y = y(-4 + 2x)$, with time in years. The period of small oscillations about the coexistence point is ______ years (to two decimal places).`,
      answer: 3.14, tol: 0.02, calc: () => 2 * Math.PI / Math.sqrt(1 * 4), unit: 'years',
      sol: R`For $\dot x = x(a - by)$, $\dot y = y(-c + dx)$ the coexistence point is $(c/d, a/b) = (2, 2)$. Put $x = 2 + u$, $y = 2 + v$ and keep linear terms: $\dot u = -b\dfrac cd v = -2v$, $\dot v = d\dfrac ab u = 2u$. So $\ddot u = -4u$: $\omega = \sqrt{ac} = 2$ per year and the period is $2\pi/2 = \pi \approx 3.14$ years.`,
      trap: R`The frequency $\sqrt{ac}$ does not depend on $b$ and $d$; those only set where the fixed point is.` },
    { id: 'pss-r4-08', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Lyapunov functions', format: 'statements',
      q: R`Consider $\dot x = y$, $\dot y = -x - y^3$. Which statements are correct?`,
      options: ['The linearisation at the origin is a centre', '$V = x^2 + y^2$ satisfies $\\dot V = -2y^4 \\le 0$', 'The origin is asymptotically stable', 'There is a limit cycle around the origin'], answer: [0, 1, 2],
      sol: R`Linear part: $\dot x = y$, $\dot y = -x$, eigenvalues $\pm i$. $\dot V = 2x\dot x + 2y\dot y = 2xy - 2xy - 2y^4 = -2y^4$. $\dot V = 0$ only on the line $y = 0$, and there $\dot y = -x \ne 0$ unless $x = 0$, so no orbit can stay on that line except the origin. By LaSalle's principle every orbit tends to the origin: asymptotically stable (slowly, because the damping is cubic). Since $V$ falls along every other orbit, no closed orbit exists.`,
      trap: R`$\dot V \le 0$ alone gives only stability; the extra LaSalle argument upgrades it to asymptotic stability.` },
    { id: 'pss-r4-09', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'bifurcations',
      q: R`The flow $\dot x = h + 3x - x^3$ has three fixed points when the constant $|h|$ is small and only one when $|h|$ is large. The largest $|h|$ for which there are three fixed points is ______ (to two decimal places).`,
      answer: 2, tol: 0.01, calc: () => 2 * Math.pow(3 / 3, 1.5),
      sol: R`Fixed points solve $h = x^3 - 3x$. The cubic $g(x) = x^3 - 3x$ has turning points where $g'(x) = 3x^2 - 3 = 0$, at $x = \pm1$, with $g(\pm1) = \mp2$. The horizontal line $g = h$ cuts the cubic three times only for $-2 < h < 2$. At $|h| = 2$ two fixed points merge (a saddle-node bifurcation); beyond it one remains. In general for $\dot x = h + rx - x^3$, $|h_c| = 2(r/3)^{3/2}$.`,
      trap: R`The folds are where $g'(x) = 0$; reading off $x = \pm1$ instead of the values $g(\pm1)$ gives 1.` },
    { id: 'pss-r4-10', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'linear systems',
      q: R`A three-dimensional linear system $\dot{\mathbf x} = A\mathbf x$ has eigenvalues $-2$ and $1 \pm 3i$. The dimensions of the stable and the unstable subspaces of the origin are, in that order,`,
      options: ['2 and 1', '1 and 1, with one neutral direction', '0 and 3', '1 and 2'], answer: 3,
      sol: R`The real eigenvalue $-2$ gives one decaying direction (stable subspace of dimension 1). The complex pair $1 \pm 3i$ has positive real part and spans a plane in which orbits spiral outwards (unstable subspace of dimension 2). Together they fill the 3 dimensions: the origin is a saddle-focus, with orbits coming in along a line and spiralling out in a plane.`,
      trap: R`A complex pair counts as two dimensions, not one.` },
    { id: 'pss-r4-11', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'structural stability',
      q: R`Which kind of fixed point of a planar linear system is structurally unstable, so that an arbitrarily small change of the matrix can change its type?`,
      options: ['a stable node with distinct eigenvalues', 'a saddle', 'a stable spiral', 'a centre'], answer: 3,
      sol: R`A centre needs trace exactly zero (with positive determinant). Any perturbation that makes the trace slightly negative or positive turns it into a stable or unstable spiral. Nodes with distinct eigenvalues, saddles and spirals have eigenvalues with non-zero real parts (they are hyperbolic), and small perturbations move the eigenvalues only slightly, keeping their type.`,
      trap: R`The borderline cases in the trace-determinant plane (centres, and also degenerate nodes and zero eigenvalues) are the fragile ones.` },
    { id: 'pss-r4-12', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'index theory',
      q: R`A smooth vector field on the surface of a sphere has only non-degenerate fixed points: 3 sources, 4 sinks, and the rest are saddles. The number of saddles is ______.`,
      answer: 5, tol: 0, calc: () => 3 + 4 - 2,
      sol: R`By the Poincaré-Hopf theorem the indices of the fixed points add up to the Euler characteristic of the surface, which is 2 for a sphere. Sources and sinks (and spirals, centres) have index $+1$; saddles $-1$. So $3 + 4 - s = 2$, giving $s = 5$. (The "hairy ball" theorem is the special case: a field on a sphere must vanish somewhere.)`,
      trap: R`On a plane region the sum relates to the boundary; on a closed sphere it is fixed at 2.` },
  ],
  gens: [
    { id: 'pss-r4g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Lotka-Volterra',
      make(r) {
        const a = pick(r, 0.5, 3, 0.5), b = pick(r, 0.1, 1, 0.1), c = pick(r, 0.5, 4, 0.5), d = pick(r, 0.5, 3, 0.5);
        const answer = round(2 * Math.PI / Math.sqrt(a * c), 3);
        return { q: R`Prey $x$ and predators $y$ obey $\dot x = x(${a} - ${b}y)$, $\dot y = y(-${c} + ${d}x)$ (time in years). Find the period, in years, of small oscillations about the coexistence fixed point.`,
          answer, tol: Math.max(0.01, answer * 0.01), unit: 'years', a, c,
          sol: R`The coexistence point is $(c/d, a/b) = (${round(c / d, 3)}, ${round(a / b, 3)})$. Linearising: $\dot u = -\dfrac{bc}{d}v$, $\dot v = \dfrac{ad}{b}u$, so $\ddot u = -ac\,u$ and $\omega = \sqrt{ac} = ${round(Math.sqrt(a * c), 4)}$ per year. Period $= 2\pi/\omega = ${answer}$ years.`,
          trap: 'Only $a$ and $c$ set the small-oscillation frequency.' };
      },
      verify: (p) => 2 * Math.PI / Math.sqrt(p.a * p.c) },
    { id: 'pss-r4g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'bifurcations',
      make(r) {
        const rr = choose(r, [0.75, 1.5, 2, 3, 4.5, 6, 12]), want = choose(r, ['h', 'x']);
        const xc = Math.sqrt(rr / 3), hc = 2 * Math.pow(rr / 3, 1.5), answer = round(want === 'h' ? hc : xc, 4);
        return { q: R`For $\dot x = h + ${rr}x - x^3$, two fixed points merge and vanish as $|h|$ is raised past a critical value. Find ${want === 'h' ? 'that critical value of $|h|$' : 'the value of $|x|$ at which the two fixed points merge'}.`,
          answer, tol: Math.max(0.005, answer * 0.005), rr, want,
          sol: R`Fixed points solve $h = x^3 - ${rr}x$. Merging happens at the turning points of this cubic: $3x^2 = ${rr}$, so $|x| = \sqrt{${rr}/3} = ${round(xc, 4)}$, where $|h| = |x^3 - ${rr}x| = 2(${rr}/3)^{3/2} = ${round(hc, 4)}$.`,
          trap: 'The merger (saddle-node) is where the cubic has zero slope.' };
      },
      verify: (p) => (p.want === 'h' ? 2 * Math.pow(p.rr / 3, 1.5) : Math.sqrt(p.rr / 3)) },
    { id: 'pss-r4g3', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'index theory',
      make(r) {
        const [surf, chi] = choose(r, [['sphere', 2], ['sphere', 2], ['torus (doughnut surface)', 0]]);
        const so = int(r, 1, 5), si = int(r, 1, 5), sp = int(r, 0, 2), answer = so + si + sp - chi;
        return { q: R`A smooth vector field on a ${surf} has only non-degenerate fixed points: the numbers of sources, sinks and spirals are ${so}, ${si} and ${sp}, and all the others are saddles. How many saddles are there?`,
          answer, tol: 0, chi, so, si, sp,
          sol: R`Poincaré-Hopf: the indices add up to the Euler characteristic, $\chi = ${chi}$ for a ${surf}. Sources, sinks and spirals have index $+1$, saddles $-1$: $${so} + ${si} + ${sp} - s = ${chi}$, so $s = ${answer}$.`,
          trap: 'Spirals count $+1$ like nodes; only saddles count $-1$.' };
      },
      verify: (p) => p.so + p.si + p.sp - p.chi },
  ],
};
