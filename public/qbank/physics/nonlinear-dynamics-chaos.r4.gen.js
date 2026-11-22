// Round 4 extras for nonlinear-dynamics-chaos: original questions, written 2026-11-22.
import { int, pick, choose, round } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'chs-r4-01', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Lyapunov exponents',
      q: R`Which of these maps has a positive Lyapunov exponent for almost every starting point?`,
      options: [R`$x \mapsto x/2$`, R`$x \mapsto x + \alpha \bmod 1$ with $\alpha$ irrational`, R`$x \mapsto 2x \bmod 1$`, R`$x \mapsto x^2$ on $[0, 1)$`], answer: 2,
      sol: R`The exponent is the average of $\ln|f'(x)|$ along the orbit. $x/2$: $\ln\tfrac12 < 0$. The rotation $x + \alpha$: $f' = 1$, exponent 0 (nearby points stay the same distance apart, even though the orbit never repeats). $2x \bmod 1$: $\ln2 > 0$, so nearby points separate by a factor 2 each step. $x^2$: every orbit falls to 0, where $f' \to 0$, so the exponent is negative.`,
      trap: R`A never-repeating orbit (irrational rotation) is not chaotic: there is no stretching.` },
    { id: 'chs-r4-02', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'Lyapunov exponents',
      q: R`The Lyapunov exponent of the map $x_{n+1} = 3x_n \bmod 1$ is ______ per iteration (to three decimal places).`,
      answer: 1.099, tol: 0.003, calc: () => Math.log(3),
      sol: R`$|f'(x)| = 3$ everywhere (the jumps of the "mod 1" do not affect the slope), so $\lambda = \lim\tfrac1n\sum\ln|f'(x_i)| = \ln3 = 1.099$. A small error triples each step.`,
      trap: R`The exponent is $\ln3$, not 3: it is a rate of exponential growth.` },
    { id: 'chs-r4-03', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'signatures of chaos',
      q: R`The power spectrum of a signal recorded on a chaotic attractor typically shows`,
      options: ['a few sharp lines at one frequency and its harmonics', 'sharp lines at two incommensurate frequencies and their combinations', 'a single sharp line', 'a broad continuous band, possibly with some peaks on top'], answer: 3,
      sol: R`A periodic signal has lines at $f_0, 2f_0, 3f_0, \dots$ A quasi-periodic one (motion on a torus) has lines at $mf_1 + nf_2$. Chaos never repeats and loses memory of its past (correlations decay), which spreads power over a continuous band. Broadband spectra are one of the classic experimental signatures of the onset of chaos, for example in convection experiments.`,
      trap: R`Many lines from two incommensurate frequencies can look busy, but they are still sharp lines, not a continuum.` },
    { id: 'chs-r4-04', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'dissipation',
      q: R`A driven, damped pendulum obeys $\ddot\theta + \gamma\dot\theta + \sin\theta = A\cos\omega t$ with $\gamma = 0.5$ s⁻¹. In its three-dimensional phase space $(\theta, \dot\theta, \omega t)$, a small blob of initial conditions shrinks in volume by the factor ______ in 2 s (to three decimal places).`,
      answer: 0.368, tol: 0.003, calc: () => Math.exp(-1),
      sol: R`Write the flow as $\dot\theta = v$, $\dot v = -\gamma v - \sin\theta + A\cos\phi$, $\dot\phi = \omega$. Its divergence is $\partial\dot\theta/\partial\theta + \partial\dot v/\partial v + \partial\dot\phi/\partial\phi = 0 - \gamma + 0 = -\gamma$, a constant. So volumes shrink as $e^{-\gamma t} = e^{-0.5\times2} = e^{-1} = 0.368$, whether the motion is regular or chaotic.`,
      trap: R`Only the damping term depends on its own variable; the forcing and $\sin\theta$ do not contribute to the divergence.` },
    { id: 'chs-r4-05', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Poincaré sections',
      q: R`On a Poincaré section of a three-dimensional flow, a quasi-periodic orbit (winding round a torus with an irrational ratio of its two frequencies) appears as`,
      options: ['a finite set of points', 'a closed curve, filled in densely by the crossing points', 'points scattered over a region with fractal fine structure', 'a single point'], answer: 1,
      sol: R`The section cuts the torus in a closed curve. Each return lands on that curve, rotated by a fixed irrational fraction of a turn, so the points never repeat and fill the curve densely. A periodic orbit gives a finite set of points, and a strange attractor gives a fractal set of points.`,
      trap: R`A finite set of points means periodic motion; a dense curve means quasi-periodic motion.` },
    { id: 'chs-r4-06', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'dissipation', format: 'statements',
      q: R`Which statements about dissipative and conservative systems are correct?`,
      options: [R`The Hénon map $x' = 1 - ax^2 + y$, $y' = bx$ with $|b| < 1$ shrinks areas at every step`, 'A Hamiltonian flow cannot have an attractor, because it preserves phase-space volume', 'The attractor of a dissipative three-dimensional flow has zero volume', 'Area-preserving maps such as the standard map can have strange attractors'], answer: [0, 1, 2],
      sol: R`The Hénon Jacobian is $\begin{pmatrix}-2ax & 1\\ b & 0\end{pmatrix}$ with determinant $-b$, so areas are multiplied by $|b| < 1$ each step. Liouville's theorem forbids a Hamiltonian flow from squeezing a region of initial conditions onto a smaller set, so there are no attractors. Dissipative flows shrink every volume to zero, so their attractors have zero volume (and can be fractal). Area-preserving maps can be chaotic, with chaotic seas, but those seas are not attractors.`,
      trap: R`Chaos and attractors are separate ideas: conservative chaos exists, conservative attractors do not.` },
    { id: 'chs-r4-07', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'horseshoes',
      q: R`Smale's horseshoe map stretches a square, folds it into a horseshoe and lays it back over the square. The set of points that stay in the square for all forward and backward iterations is`,
      options: ['a Cantor set, on which the map acts like a shift on two-symbol sequences', 'a single fixed point', 'a smooth closed curve', 'the whole square'], answer: 0,
      sol: R`Each forward step keeps two vertical strips and each backward step two horizontal strips; repeating forever leaves the product of two Cantor sets. Label each point by which strip it visits at each time (0 or 1): the map shifts this two-sided sequence by one place. Hence there are periodic orbits of every period, a dense orbit and sensitive dependence: the horseshoe is the basic mechanism of chaos.`,
      trap: R`Most points leave the square; the ones that stay form a set of zero area.` },
    { id: 'chs-r4-08', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Lyapunov exponents', format: 'statements',
      q: R`Which statements about Lyapunov exponents of continuous-time systems are correct?`,
      options: ['The sum of all the exponents equals the long-time average of the divergence of the velocity field', 'For a Hamiltonian system the exponents come in pairs $\\pm\\lambda$', 'For a bounded attractor other than a fixed point, one exponent is zero', 'A positive exponent means the separation of two nearby orbits on a bounded attractor keeps growing exponentially for ever'], answer: [0, 1, 2],
      sol: R`Volumes change at the rate of the divergence, and the volume of a small blob grows as $e^{(\lambda_1 + \lambda_2 + \dots)t}$, so the sum is the average divergence (negative for dissipative systems, zero for Hamiltonian ones). The symplectic structure pairs the exponents as $\pm\lambda$. A small shift along the orbit itself neither grows nor decays on average, which gives the zero exponent. On a bounded attractor the separation grows exponentially only until it reaches the size of the attractor, then saturates.`,
      trap: R`Exponential growth of separations holds only for infinitesimal separations; finite ones saturate.` },
    { id: 'chs-r4-09', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'fractal dimensions', format: 'numeric',
      q: R`For the Hénon map with $b = 0.3$, the largest Lyapunov exponent is $\lambda_1 = 0.42$ per iteration. The Kaplan-Yorke dimension of the attractor is ______ (to two decimal places).`,
      answer: 1.26, tol: 0.01, calc: () => 1 + 0.42 / Math.abs(Math.log(0.3) - 0.42),
      sol: R`The Jacobian determinant is $-b$, so $\lambda_1 + \lambda_2 = \ln|b| = \ln0.3 = -1.204$, giving $\lambda_2 = -1.204 - 0.42 = -1.624$. Kaplan-Yorke: $D = 1 + \dfrac{\lambda_1}{|\lambda_2|} = 1 + \dfrac{0.42}{1.624} = 1.26$.`,
      trap: R`Using $\ln b$ itself as $\lambda_2$ (forgetting to subtract $\lambda_1$) gives 1.35.` },
    { id: 'chs-r4-10', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Lyapunov exponents', format: 'numeric',
      q: R`The cat map on the unit torus is $(x, y) \mapsto (2x + y,\ x + y) \bmod 1$. Its largest Lyapunov exponent is ______ per iteration (to three decimal places).`,
      answer: 0.962, tol: 0.003, calc: () => Math.log((3 + Math.sqrt(5)) / 2),
      sol: R`The map is linear with matrix $\begin{pmatrix}2 & 1\\ 1 & 1\end{pmatrix}$: trace 3, determinant 1. Eigenvalues solve $\mu^2 - 3\mu + 1 = 0$: $\mu = \dfrac{3 \pm \sqrt5}{2} = 2.618$ and $0.382$. Separations along the first eigenvector grow by 2.618 each step, so $\lambda_1 = \ln2.618 = 0.962$; since the map preserves area, $\lambda_2 = -0.962$.`,
      trap: R`The exponent is the log of the eigenvalue, not the eigenvalue itself.` },
    { id: 'chs-r4-11', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'circle maps',
      q: R`For the sine circle map $\theta_{n+1} = \theta_n + \Omega - \dfrac{K}{2\pi}\sin2\pi\theta_n$ at the critical coupling $K = 1$, which statement about the rotation number as a function of $\Omega$ is correct?`,
      options: [R`Every $\Omega$ gives a rational rotation number`, R`Irrational rotation numbers occur for a set of $\Omega$ of positive measure, just as at $K = 0$`, R`The $\Omega$ values with irrational rotation numbers form a fractal set of zero measure: the mode-locked steps (a "devil's staircase") fill almost all of the $\Omega$ axis`, R`The rotation number is not defined at $K = 1$`], answer: 2,
      sol: R`At $K = 0$ the rotation number equals $\Omega$, so locking never happens. As $K$ grows, each rational $p/q$ is locked over an interval of $\Omega$ (an Arnold tongue), and the intervals widen. At $K = 1$ (where the map just stops being invertible) the locked intervals together have full measure; the leftover irrational set is a fractal of measure zero (dimension about 0.87). The rotation number is still defined for every $\Omega$; it is a continuous, increasing "complete devil's staircase".`,
      trap: R`Measure zero is not the same as empty: irrational rotation numbers still occur, on a fractal set.` },
    { id: 'chs-r4-12', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'homoclinic chaos',
      q: R`A pendulum-like system with a saddle is given weak damping and weak periodic forcing. The Melnikov function, which measures the gap between the stable and unstable manifolds of the saddle, turns out to have simple zeros. This means`,
      options: ['the separatrix survives unbroken, so the motion stays regular', 'the stable and unstable manifolds of the saddle cross transversally, giving a homoclinic tangle with horseshoe dynamics', 'the saddle turns into a stable spiral', 'a stable limit cycle is born from the saddle'], answer: 1,
      sol: R`Without perturbation the unstable and stable manifolds of the saddle coincide (the separatrix). The Melnikov integral is, to first order, the signed distance between them on a section. A simple zero means they intersect and cross transversally; then they must intersect infinitely often, forming a homoclinic tangle. The Smale-Birkhoff theorem shows that horseshoes sit inside such a tangle, so there is chaotic motion (at least transient chaos, with fractal basin boundaries).`,
      trap: R`If the Melnikov function never vanishes, the manifolds separate without crossing and no tangle forms.` },
  ],
  gens: [
    { id: 'chs-r4g1', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'fractal dimensions',
      make(r) {
        const b = choose(r, [0.1, 0.2, 0.3, 0.4, 0.5, 0.6]), l1 = pick(r, 0.1, 0.6, 0.05);
        const sum = Math.log(b), l2 = sum - l1, answer = round(1 + l1 / Math.abs(l2), 3);
        return { q: R`A two-dimensional map has a constant Jacobian determinant of magnitude ${b} and, on its chaotic attractor, largest Lyapunov exponent ${l1} per iteration. Find the Kaplan-Yorke dimension of the attractor.`,
          answer, tol: Math.max(0.005, answer * 0.005), b, l1,
          sol: R`The exponents add up to the log of the area factor: $\lambda_1 + \lambda_2 = \ln${b} = ${round(sum, 4)}$, so $\lambda_2 = ${round(l2, 4)}$. Then $D = 1 + \lambda_1/|\lambda_2| = 1 + ${l1}/${round(-l2, 4)} = ${answer}$.`,
          trap: 'The second exponent is $\\ln|\\det J| - \\lambda_1$, not $\\ln|\\det J|$ alone.' };
      },
      verify: (p) => 1 + p.l1 / Math.abs(Math.log(p.b) - p.l1) },
    { id: 'chs-r4g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Lyapunov exponents',
      make(r) {
        const k = int(r, 1, 5), tr = k + 2;
        const mu = (tr + Math.sqrt(tr * tr - 4)) / 2, answer = round(Math.log(mu), 4);
        return { q: R`The torus map $(x, y) \mapsto (${k + 1}x + y,\ ${k === 1 ? '' : k}x + y) \bmod 1$ preserves area. Find its largest Lyapunov exponent per iteration.`,
          answer, tol: Math.max(0.002, answer * 0.003), k,
          sol: R`Matrix $\begin{pmatrix}${k + 1} & 1\\ ${k} & 1\end{pmatrix}$: trace ${tr}, determinant ${k + 1} - ${k} = 1$. Eigenvalues $\mu = \dfrac{${tr} \pm \sqrt{${tr * tr - 4}}}{2}$; the larger is ${round(mu, 4)}. So $\lambda_1 = \ln${round(mu, 4)} = ${answer}$ (and $\lambda_2 = -\lambda_1$).`,
          trap: 'Take the logarithm of the larger eigenvalue.' };
      },
      verify: (p) => { const t = p.k + 2; return Math.log((t + Math.sqrt(t * t - 4)) / 2); } },
    { id: 'chs-r4g3', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'dissipation',
      make(r) {
        const lorenz = choose(r, [true, false]);
        if (lorenz) {
          const s = choose(r, [10, 12, 16]), b = choose(r, [8 / 3, 2, 1]), t = pick(r, 0.05, 0.3, 0.05);
          const rate = s + 1 + b, answer = round(Math.exp(-rate * t), 4);
          return { q: R`For the Lorenz system $\dot x = ${s}(y - x)$, $\dot y = rx - y - xz$, $\dot z = xy - ${round(b, 4)}z$, by what factor does a small volume of initial conditions shrink in a time ${t}?`,
            answer, tol: Math.max(0.0005, answer * 0.01), rate, t,
            sol: R`The divergence is $-\sigma - 1 - b = -${round(rate, 4)}$, constant everywhere, so volumes shrink as $e^{-${round(rate, 4)}t} = e^{-${round(rate * t, 4)}} = ${answer}$.`,
            trap: 'Each diagonal term contributes: $-\\sigma$ from $\\dot x$, $-1$ from $\\dot y$, $-b$ from $\\dot z$.' };
        }
        const g = pick(r, 0.1, 1, 0.1), t = pick(r, 1, 5, 0.5), rate = g, answer = round(Math.exp(-g * t), 4);
        return { q: R`A driven, damped pendulum $\ddot\theta + ${g}\dot\theta + \sin\theta = A\cos\omega t$ (time in seconds) is followed in its phase space $(\theta, \dot\theta, \omega t)$. By what factor does a small volume of initial conditions shrink in ${t} s?`,
          answer, tol: Math.max(0.0005, answer * 0.01), rate, t,
          sol: R`The divergence of the flow is $-\gamma = -${g}$ s⁻¹ everywhere, so volumes shrink as $e^{-${g}\times${t}} = ${answer}$.`,
          trap: 'The forcing and the $\\sin\\theta$ term do not change volumes; only the damping does.' };
      },
      verify: (p) => Math.exp(-p.rate * p.t) },
  ],
};
