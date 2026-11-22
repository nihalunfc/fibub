// Round 4 extras for hamiltonian-mechanics: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'ham-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'canonical variables',
      q: R`Whatever generalised coordinate $q$ is chosen (a length, an angle, an area ...), the product $qp$ of the coordinate and its conjugate momentum always has the dimension of`,
      options: ['energy (J)', 'momentum (N s)', 'action (J s)', 'power times length (W m)'], answer: 2,
      sol: R`$H = \sum p\dot q - L$, so every product $p\dot q$ is an energy. Since $\dot q = q/\text{time}$ in dimensions, $pq$ is energy times time: J s, the dimension of action (and of Planck's constant). For a length, $p$ is a momentum; for an angle, $p$ is an angular momentum; in both cases $pq$ is in J s.`,
      trap: R`$p$ itself changes dimension with the choice of $q$; only the product is fixed.` },
    { id: 'ham-r4-02', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: "Hamilton's equations", format: 'numeric',
      q: R`A particle of mass 2 kg moves in a plane with $H = \dfrac{p_r^2}{2m} + \dfrac{p_\theta^2}{2mr^2} + \tfrac12kr^2$, where $k = 1$ N/m. At an instant when $r = 3$ m and $p_\theta = 6$ kg m²/s, the value of $\dot p_r$ is ______ N (to two decimal places).`,
      answer: -2.33, tol: 0.01, calc: () => 36 / (2 * 27) - 3, unit: 'N',
      sol: R`$\dot p_r = -\dfrac{\partial H}{\partial r} = \dfrac{p_\theta^2}{mr^3} - kr = \dfrac{36}{2\times27} - 1\times3 = 0.667 - 3 = -2.33$ N. The first term is the centrifugal push, the second the spring pull.`,
      trap: R`Differentiating $1/r^2$ gives $-2/r^3$, and the minus sign of Hamilton's equation turns it positive; dropping either sign gives the wrong answer.` },
    { id: 'ham-r4-03', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'first-order Lagrangians',
      q: R`A system has the Lagrangian $L = q_2\dot q_1 - V(q_1, q_2)$, which is linear in the velocities. What do its Euler-Lagrange equations say?`,
      options: [R`$\dot q_1 = \partial V/\partial q_2$ and $\dot q_2 = -\partial V/\partial q_1$: Hamilton's equations with $q_1$ as the coordinate, $q_2$ as its momentum and $V$ as the Hamiltonian`, R`Nothing: since $\partial L/\partial\dot q_2 = 0$ there is no equation of motion`, R`Two second-order equations, as for any Lagrangian`, R`$\dot q_1 = -\partial V/\partial q_2$ and $\dot q_2 = \partial V/\partial q_1$`], answer: 0,
      sol: R`For $q_1$: $\dfrac{d}{dt}\dfrac{\partial L}{\partial\dot q_1} = \dot q_2$ and $\dfrac{\partial L}{\partial q_1} = -\dfrac{\partial V}{\partial q_1}$, so $\dot q_2 = -\partial V/\partial q_1$. For $q_2$: $\partial L/\partial\dot q_2 = 0$, so $0 = \partial L/\partial q_2 = \dot q_1 - \partial V/\partial q_2$. These are $\dot q = \partial H/\partial p$, $\dot p = -\partial H/\partial q$ with $(q, p, H) = (q_1, q_2, V)$. Indeed the phase-space action $\int(p\dot q - H)\,dt$ is exactly a Lagrangian of this form.`,
      trap: R`A zero conjugate momentum still gives an equation: $\partial L/\partial q_2 = 0$ is a (first-order) equation of motion.` },
    { id: 'ham-r4-04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: "Hamilton's equations", format: 'numeric',
      q: R`A bead's effective mass depends on position: $H = \dfrac{p^2}{2m(q)}$ with $m(q) = m_0(1 + q^2)$ and $m_0 = 1$ (consistent units). At the instant when $q = 1$ and $p = 4$, the value of $\dot p$ is ______.`,
      answer: 4, tol: 0, calc: () => 16 * 2 / (2 * 4),
      sol: R`$\dot p = -\dfrac{\partial H}{\partial q} = \dfrac{p^2}{2m^2}\dfrac{dm}{dq}$. At $q = 1$: $m = 2$, $dm/dq = 2m_0q = 2$. So $\dot p = \dfrac{16\times2}{2\times4} = 4$. The momentum grows as the bead moves towards heavier regions, while $\dot q = p/m$ falls, so the energy $p^2/2m$ stays fixed.`,
      trap: R`Treating $m$ as constant gives $\dot p = 0$; and $\partial(1/m)/\partial q = -m'/m^2$ carries a sign that the minus in Hamilton's equation cancels.` },
    { id: 'ham-r4-05', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'time-dependent Hamiltonians', format: 'statements',
      q: R`The spring of an oscillator is changed with time in a prescribed way: $H = \dfrac{p^2}{2m} + \tfrac12k(t)q^2$. Which statements are correct?`,
      options: [R`Along the motion $\dfrac{dH}{dt} = \dfrac{\partial H}{\partial t} = \tfrac12\dot k\,q^2$`, R`$H$ is in general not conserved`, R`A cloud of phase points still keeps its phase-space area as it moves`, R`Every orbit in the $(q, p)$ plane is a closed ellipse of fixed area`], answer: [0, 1, 2],
      sol: R`For any Hamiltonian, $\dfrac{dH}{dt} = \{H, H\} + \dfrac{\partial H}{\partial t} = \dfrac{\partial H}{\partial t}$, here $\tfrac12\dot kq^2$, which is non-zero in general, so $H$ changes (the agent turning the knob does work). Liouville's theorem needs only Hamilton's equations, not a time-independent $H$: $\partial\dot q/\partial q + \partial\dot p/\partial p = 0$ still holds. Orbits are not fixed ellipses, since the shape of the energy contours changes with time; only for very slow changes is the area $\oint p\,dq$ nearly constant (an adiabatic invariant).`,
      trap: R`Phase-space volume conservation and energy conservation are different things: the first survives a time-dependent $H$.` },
    { id: 'ham-r4-06', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'charged particles',
      q: R`A charge $q$ (mass $m$) in a uniform electric field $E\hat x$ is described in the gauge $\phi = 0$, $\mathbf A = -Et\,\hat x$, so that $H = \dfrac{(p_x + qEt)^2}{2m}$ for motion along $x$. Which quantity is conserved?`,
      options: [R`The Hamiltonian $H$`, R`The canonical momentum $p_x$`, R`The kinetic momentum $mv_x$`, R`Nothing, since the field does work on the charge`], answer: 1,
      sol: R`The field is $\mathbf E = -\nabla\phi - \partial\mathbf A/\partial t = E\hat x$, as required. $x$ does not appear in $H$, so $\dot p_x = -\partial H/\partial x = 0$: $p_x$ is conserved. $mv_x = p_x + qEt$ grows linearly, as it must under a constant force. $H$ depends on $t$ explicitly, so it is not conserved (here it equals the kinetic energy, which grows).`,
      trap: R`In this gauge the canonical momentum is not $mv_x$; it differs by $qA_x = -qEt$.` },
    { id: 'ham-r4-07', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: "Hamilton's equations",
      q: R`A system has $H = ap^2 + bq^2$ with constants $a, b > 0$. The angular frequency of its motion is`,
      options: [R`$\sqrt{ab}$`, R`$\sqrt{a/b}$`, R`$4ab$`, R`$2\sqrt{ab}$`], answer: 3,
      sol: R`$\dot q = \partial H/\partial p = 2ap$ and $\dot p = -\partial H/\partial q = -2bq$. Then $\ddot q = 2a\dot p = -4ab\,q$, so $\omega^2 = 4ab$ and $\omega = 2\sqrt{ab}$. Check with $a = 1/2m$, $b = k/2$: $\omega = 2\sqrt{k/4m} = \sqrt{k/m}$.`,
      trap: R`Forgetting the factors of 2 from differentiating the squares gives $\sqrt{ab}$.` },
    { id: 'ham-r4-08', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'relativistic Hamiltonian', format: 'statements',
      q: R`A charge $q$ moves in static fields with $H = \sqrt{(\mathbf p - q\mathbf A)^2c^2 + m^2c^4} + q\phi$. Which statements are correct?`,
      options: [R`The velocity is $\dot{\mathbf r} = \dfrac{c^2(\mathbf p - q\mathbf A)}{H - q\phi}$`, R`The canonical momentum $\mathbf p$ equals $\gamma m\mathbf v$`, R`For $|\mathbf p - q\mathbf A| \ll mc$, $H \approx mc^2 + \dfrac{(\mathbf p - q\mathbf A)^2}{2m} + q\phi$`, R`$H$ is a constant of the motion`], answer: [0, 2, 3],
      sol: R`$\dot{\mathbf r} = \partial H/\partial\mathbf p = \dfrac{c^2(\mathbf p - q\mathbf A)}{\sqrt{\dots}}$, and the square root equals $H - q\phi$. Writing $H - q\phi = \gamma mc^2$ gives $\mathbf p - q\mathbf A = \gamma m\mathbf v$, so $\mathbf p = \gamma m\mathbf v + q\mathbf A$, not $\gamma m\mathbf v$. Expanding $\sqrt{m^2c^4 + x^2c^2} \approx mc^2 + x^2/2m$ gives the non-relativistic form plus the rest energy. With static potentials $H$ has no explicit $t$, so it is conserved (it is $\gamma mc^2 + q\phi$).`,
      trap: R`Canonical and kinetic momentum differ by $q\mathbf A$ in relativity too.` },
    { id: 'ham-r4-09', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'reduced dynamics', format: 'numeric',
      q: R`In units with $m = k = 1$, a particle has $H = \dfrac{p_r^2}{2} + \dfrac{p_\theta^2}{2r^2} - \dfrac1r$ with $p_\theta = 1$ and energy $E = -0.375$. The time for one full radial oscillation ($r_{\min} \to r_{\max} \to r_{\min}$) is ______ (to two decimal places).`,
      answer: 9.67, tol: 0.05, calc: () => 2 * Math.PI * Math.pow(4 / 3, 1.5),
      sol: R`Turning points have $p_r = 0$: $\dfrac{1}{2r^2} - \dfrac1r = -\dfrac38$. Multiply by $8r^2$: $3r^2 - 8r + 4 = 0$, so $r = 2/3$ or $2$. The orbit is a Kepler ellipse with semi-major axis $a = (2/3 + 2)/2 = 4/3$ (check: $a = -k/2E = 1/0.75$). The radial period equals the orbital period, $T = 2\pi\sqrt{a^3/k} = 2\pi(4/3)^{3/2} = 2\pi\times1.540 = 9.67$.`,
      trap: R`For the $1/r$ potential the radial and angular periods are equal (closed orbits); using $r_{\max}$ instead of $a$ in Kepler's law gives 17.8.` },
    { id: 'ham-r4-10', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'constants of motion',
      q: R`For the two-dimensional isotropic oscillator $H = \tfrac12(p_1^2 + p_2^2 + q_1^2 + q_2^2)$, which quantity is NOT a constant of the motion?`,
      options: [R`$q_1p_2 - q_2p_1$`, R`$p_1^2 + q_1^2$`, R`$q_1q_2 + p_1p_2$`, R`$q_1p_1 + q_2p_2$`], answer: 3,
      sol: R`Use $\dot q_i = p_i$, $\dot p_i = -q_i$. $\dfrac{d}{dt}(q_1p_2 - q_2p_1) = p_1p_2 - q_1q_2 - p_2p_1 + q_2q_1 = 0$. $\dfrac{d}{dt}(p_1^2 + q_1^2) = -2p_1q_1 + 2q_1p_1 = 0$. $\dfrac{d}{dt}(q_1q_2 + p_1p_2) = p_1q_2 + q_1p_2 - q_1p_2 - p_1q_2 = 0$. But $\dfrac{d}{dt}(q_1p_1 + q_2p_2) = p_1^2 - q_1^2 + p_2^2 - q_2^2$, which is not zero in general: the virial $\mathbf q\cdot\mathbf p$ oscillates.`,
      trap: R`The isotropic oscillator has extra conserved quantities (each energy separately and the cross term), so the odd one out is the virial.` },
    { id: 'ham-r4-11', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: "Hamilton's equations",
      q: R`A ball of mass 0.5 kg has $H = \dfrac{p^2}{2m} + mgq$. At an instant when $p = 3$ kg m/s, Hamilton's equations give $\dot q = $ ______ m/s.`,
      answer: 6, tol: 0, calc: () => 3 / 0.5, unit: 'm/s',
      sol: R`$\dot q = \partial H/\partial p = p/m = 3/0.5 = 6$ m/s. The potential term does not depend on $p$, so it does not enter $\dot q$.`,
      trap: R`$\partial H/\partial p$ of $p^2/2m$ is $p/m$, not $p/2m$.` },
    { id: 'ham-r4-12', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'phase portraits',
      q: R`For $H = \dfrac{p^2}{2m} + V(q)$, a closed phase orbit crosses the $q$ axis ($p = 0$) at a turning point where $V'(q) \ne 0$. There the orbit is`,
      options: [R`tangent to the $q$ axis`, R`perpendicular to the $q$ axis`, R`at $45^\circ$ to the axes`, R`not smooth: it has a corner`], answer: 1,
      sol: R`At $p = 0$, $\dot q = p/m = 0$ while $\dot p = -V'(q) \ne 0$. The phase point moves straight along the $p$ direction, so the orbit crosses the $q$ axis at right angles. (Only at a fixed point, where $V' = 0$ too, can orbits meet the axis differently, as at a saddle.)`,
      trap: R`The orbit is smooth at turning points; corners appear only for potentials with kinks or walls.` },
  ],
  gens: [
    { id: 'ham-r4g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: "Hamilton's equations",
      make(r) {
        const m0 = choose(r, [0.5, 1, 2]), q = pick(r, 0.5, 2, 0.5), p = int(r, 1, 6);
        const mq = m0 * (1 + q * q), answer = round(p * p * q / (m0 * (1 + q * q) ** 2), 3);
        return { q: R`A system has $H = \dfrac{p^2}{2m(q)}$ with $m(q) = ${m0}(1 + q^2)$ (consistent units). Find $\dot p$ at the instant when $q = ${q}$ and $p = ${p}$.`,
          answer, tol: Math.max(0.01, Math.abs(answer) * 0.01), m0, qv: q, pv: p,
          sol: R`$\dot p = -\partial H/\partial q = \dfrac{p^2}{2m^2}\dfrac{dm}{dq}$ with $m = ${round(mq, 4)}$ and $dm/dq = 2\times${m0}\times${q} = ${round(2 * m0 * q, 4)}$. So $\dot p = \dfrac{${p * p}\times${round(2 * m0 * q, 4)}}{2\times${round(mq, 4)}^2} = ${answer}$.`,
          trap: 'The minus sign in $\\dot p = -\\partial H/\\partial q$ and the minus from differentiating $1/m$ cancel.' };
      },
      verify: (p) => p.pv * p.pv * p.qv / (p.m0 * (1 + p.qv * p.qv) ** 2) },
    { id: 'ham-r4g2', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: "Hamilton's equations",
      make(r) {
        const a = choose(r, [0.5, 1, 1.5, 2, 3]), b = choose(r, [1, 2, 3, 5, 6, 8]);
        const answer = round(Math.PI / Math.sqrt(a * b), 3);
        return { q: R`A system has $H = ${a}p^2 + ${b}q^2$ (time in seconds). Find the period of its motion in seconds.`,
          answer, tol: Math.max(0.01, answer * 0.01), unit: 's', a, b,
          sol: R`$\dot q = 2ap$, $\dot p = -2bq$, so $\ddot q = -4ab\,q$ and $\omega = 2\sqrt{ab} = ${round(2 * Math.sqrt(a * b), 4)}$ rad/s. Period $T = 2\pi/\omega = \pi/\sqrt{ab} = ${answer}$ s.`,
          trap: 'The squares give factors of 2 in both equations: $\\omega = 2\\sqrt{ab}$, not $\\sqrt{ab}$.' };
      },
      verify: (p) => Math.PI / Math.sqrt(p.a * p.b) },
    { id: 'ham-r4g3', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'reduced dynamics',
      make(r) {
        const l = choose(r, [0.5, 1, 1.5, 2]), f = choose(r, [0.36, 0.51, 0.64, 0.75, 0.84, 0.91]);
        const E = -f / (2 * l * l), s = Math.sqrt(1 - f), wantMin = choose(r, [true, false]);
        const rmin = (1 - s) / (2 * -E), rmax = (1 + s) / (2 * -E), answer = round(wantMin ? rmin : rmax, 3);
        return { q: R`In units with $m = k = 1$, a particle has $H = \dfrac{p_r^2}{2} + \dfrac{p_\theta^2}{2r^2} - \dfrac1r$ with $p_\theta = ${l}$ and energy $E = ${round(E, 5)}$. Find the ${wantMin ? 'smallest' : 'largest'} distance $r$ it reaches.`,
          answer, tol: Math.max(0.01, answer * 0.01), l, E, wantMin,
          sol: R`Turning points have $p_r = 0$: $\dfrac{${l}^2}{2r^2} - \dfrac1r = E$, i.e. $Er^2 + r - ${round(l * l / 2, 4)} = 0$. With $E < 0$: $r = \dfrac{1 \mp \sqrt{1 + 2E p_\theta^2}}{2|E|} = \dfrac{1 \mp ${round(s, 4)}}{${round(-2 * E, 5)}}$, giving $r_{\min} = ${round(rmin, 3)}$ and $r_{\max} = ${round(rmax, 3)}$.`,
          trap: 'Both roots are physical for a bound orbit; the smaller is the closest approach, the larger the farthest point.' };
      },
      verify: (p) => { const s = Math.sqrt(1 + 2 * p.E * p.l * p.l); return (p.wantMin ? 1 - s : 1 + s) / (-2 * p.E); } },
  ],
};
