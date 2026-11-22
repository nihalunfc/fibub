// Round 4 extras for hamilton-jacobi: original questions, written 2026-11-22.
import { pick, int, choose, round, C } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'hjt-r4-01', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: "Hamilton's principal function",
      q: R`Hamilton's principal function $S(q, \alpha, t)$ has the dimension of`,
      options: ['energy', 'action (energy times time)', 'momentum', 'power'], answer: 1,
      sol: R`$\partial S/\partial t = -H$ is an energy, so $S$ is energy times time. Equivalently $\partial S/\partial q = p$, and $pq$ is an action. Along the motion $S$ equals the action integral $\int L\,dt$, measured in J s like Planck's constant.`,
      trap: R`$\partial S/\partial t$ is an energy; $S$ itself carries one more power of time.` },
    { id: 'hjt-r4-02', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Hamilton-Jacobi equation',
      q: R`A charge $q$ (mass $m$) moves in fields with potentials $\phi(\mathbf r, t)$ and $\mathbf A(\mathbf r, t)$. Its Hamilton-Jacobi equation is`,
      options: [R`$\dfrac{(\nabla S + q\mathbf A)^2}{2m} + q\phi + \dfrac{\partial S}{\partial t} = 0$`, R`$\dfrac{(\nabla S)^2}{2m} + q\phi + \dfrac{\partial S}{\partial t} = 0$, since $\mathbf A$ does no work`, R`$\dfrac{(\nabla S - q\mathbf A)^2}{2m} + q\phi - \dfrac{\partial S}{\partial t} = 0$`, R`$\dfrac{(\nabla S - q\mathbf A)^2}{2m} + q\phi + \dfrac{\partial S}{\partial t} = 0$`], answer: 3,
      sol: R`$H = \dfrac{(\mathbf p - q\mathbf A)^2}{2m} + q\phi$. The Hamilton-Jacobi equation is $H(\mathbf r, \nabla S, t) + \partial S/\partial t = 0$, with the canonical momentum replaced by $\nabla S$. So $(\nabla S - q\mathbf A)^2/2m + q\phi + \partial S/\partial t = 0$. The magnetic force does no work, but $\mathbf A$ still enters the Hamiltonian through the canonical momentum.`,
      trap: R`Both signs matter: $\mathbf p - q\mathbf A$ is the kinetic momentum, and the equation is $H + \partial S/\partial t = 0$.` },
    { id: 'hjt-r4-03', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'adiabatic invariants',
      q: R`A photon (or any particle moving at the speed of light) bounces back and forth along the axis between two parallel mirrors. The mirrors are moved apart very slowly from a distance $L$ to $2L$. If its energy was $E$, it becomes`,
      options: [R`$E/2$`, R`$E/4$`, R`$E$, since the photon speed cannot change`, R`$E/\sqrt2$`], answer: 0,
      sol: R`The action $J = \oint p\,dx = 2Lp$ is an adiabatic invariant, and for a photon $p = E/c$. So $2LE/c$ stays fixed and $E \propto 1/L$: doubling $L$ halves $E$ (and doubles the wavelength, keeping the same number of half-waves between the mirrors). Each reflection from the receding mirror lowers the energy by a tiny Doppler shift.`,
      trap: R`$E/4$ is the answer for a slow (non-relativistic) particle, where $p = \sqrt{2mE}$.` },
    { id: 'hjt-r4-04', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'separation of variables',
      q: R`A particle moves in the field of two fixed point charges a distance $2a$ apart, $V = -\dfrac{k_1}{r_1} - \dfrac{k_2}{r_2}$. Its Hamilton-Jacobi equation separates completely in`,
      options: ['spherical polar coordinates centred on one of the charges', 'parabolic coordinates', 'elliptic (prolate spheroidal) coordinates with the two charges at the foci', 'no coordinate system, since the problem is not integrable'], answer: 2,
      sol: R`Use $\xi = \dfrac{r_1 + r_2}{2a}$, $\eta = \dfrac{r_1 - r_2}{2a}$ and the azimuth $\phi$ about the line of the charges. Then $\dfrac{k_1}{r_1} + \dfrac{k_2}{r_2} = \dfrac{(k_1 + k_2)\xi + (k_1 - k_2)\eta}{a(\xi^2 - \eta^2)}$, and the kinetic term also carries the factor $1/(\xi^2 - \eta^2)$. Multiplying the equation by $\xi^2 - \eta^2$ splits it into a $\xi$ part and an $\eta$ part: the two-centre problem is integrable. Parabolic coordinates are the limit for one charge in a uniform field.`,
      trap: R`Two centres break spherical symmetry, but the problem still separates, in coordinates whose foci are the centres.` },
    { id: 'hjt-r4-05', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: "Hamilton's principal function",
      q: R`For a harmonic oscillator (mass $m$, angular frequency $\omega$), Hamilton's principal function for the path that starts at $x_0$ at $t = 0$ and reaches $x_1$ at $t = T$ (with $\omega T$ not a multiple of $\pi$) is`,
      options: [R`$\dfrac{m(x_1 - x_0)^2}{2T}$`, R`$\dfrac{m\omega}{2\sin\omega T}\left[(x_0^2 + x_1^2)\cos\omega T - 2x_0x_1\right]$`, R`$\dfrac{m\omega}{2\sin\omega T}\left[x_0^2 + x_1^2 - 2x_0x_1\cos\omega T\right]$`, R`$\dfrac{m\omega}{2\cos\omega T}\left[(x_0^2 + x_1^2)\sin\omega T - 2x_0x_1\right]$`], answer: 1,
      sol: R`Test with $x_0 = 0$: the path is $x = A\sin\omega t$ with $x_1 = A\sin\omega T$, so the final momentum is $p_1 = m\omega A\cos\omega T = m\omega x_1\cot\omega T$. The correct $S$ must give $p_1 = \partial S/\partial x_1$. The second option gives $\partial S/\partial x_1 = \dfrac{m\omega}{\sin\omega T}(x_1\cos\omega T - x_0) = m\omega x_1\cot\omega T$. The third gives $m\omega x_1/\sin\omega T$ (wrong: it is not zero at a quarter period, where the particle must be at a turning point), and the fourth $m\omega x_1\tan\omega T$. The first is the free-particle result, which the correct answer reduces to as $\omega \to 0$.`,
      trap: R`Two options share the free-particle limit; a second check (momentum at a turning point) is needed to tell them apart.` },
    { id: 'hjt-r4-06', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'semiclassical quantisation',
      q: R`A particle moves in $V = \tfrac12m\omega^2q^2$ for $q > 0$ with a hard wall at $q = 0$. Semiclassical quantisation with the usual corrections ($\oint p\,dq = (n + \tfrac14)h$ for one smooth turning point plus $\tfrac12h$ for one hard wall, $n = 0, 1, 2, \dots$) gives the energies`,
      options: [R`$(n + \tfrac12)\hbar\omega$`, R`$(2n + \tfrac12)\hbar\omega$`, R`$(n + \tfrac34)\hbar\omega$`, R`$(2n + \tfrac32)\hbar\omega$`], answer: 3,
      sol: R`The orbit is half the oscillator ellipse plus the straight bounce, so $\oint p\,dq = \tfrac12\times\dfrac{2\pi E}{\omega} = \dfrac{\pi E}{\omega}$. Setting it equal to $(n + \tfrac14 + \tfrac12)h = (n + \tfrac34)2\pi\hbar$ gives $E = (2n + \tfrac32)\hbar\omega$: $\tfrac32, \tfrac72, \tfrac{11}2, \dots$ times $\hbar\omega$. These are exactly the odd states of the full oscillator, the ones with a node at $q = 0$, as the wall demands.`,
      trap: R`Halving the well halves the action, so the level spacing doubles to $2\hbar\omega$.` },
    { id: 'hjt-r4-07', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'adiabatic invariants', format: 'statements',
      q: R`Which of these stay (very nearly) constant when the named parameter is changed slowly compared with the period of the motion?`,
      options: [R`$E/\omega$ of a harmonic oscillator whose spring is slowly stiffened`, R`The magnetic flux through the circular orbit of an ion in a slowly strengthening uniform magnetic field`, R`The energy of a pendulum whose string is slowly shortened`, R`The energy multiplied by the period, for a small-amplitude pendulum whose length is slowly changed`], answer: [0, 1, 3],
      sol: R`For an oscillator $J = \oint p\,dq = 2\pi E/\omega = E\cdot T$, so $E/\omega$ and $E\times$ period are the same invariant. For a gyrating ion, $J \propto p_\perp^2/B$, and the orbit radius is $r = p_\perp/qB$, so the flux $\pi r^2B = \pi p_\perp^2/(q^2B)$ is invariant too. The energy itself is not invariant: shortening the string raises $\omega$ and hence $E$ (work is done pulling the string against its tension).`,
      trap: R`Slow change keeps the action fixed, not the energy.` },
    { id: 'hjt-r4-08', type: 'msq', level: 4, exams: ['gate', 'net'], sub: "Hamilton's characteristic function",
      q: R`For a time-independent $H$, Hamilton's characteristic function $W(q, \alpha)$ with $S = W - \alpha_1t$ (so $\alpha_1 = E$) is used as a type-2 generating function. Which statements are correct?`,
      options: [R`$W$ satisfies $H(q, \partial W/\partial q) = \alpha_1$`, R`The new Hamiltonian equals $\alpha_1$, so all new momenta $\alpha_i$ are constant`, R`The coordinate conjugate to $\alpha_1$ grows as $t + $ constant, while the other new coordinates are constant`, R`$W$ is always a single-valued function of the coordinates`], answer: [0, 1, 2],
      sol: R`Putting $S = W - \alpha_1t$ into $H + \partial S/\partial t = 0$ gives $H(q, \partial W/\partial q) = \alpha_1$. Since $W$ has no explicit $t$, the new Hamiltonian is $K = H = \alpha_1$, a function of the new momenta only, so they are all constant. Then $\dot\beta_i = \partial K/\partial\alpha_i$ is 1 for $i = 1$ and 0 otherwise. For periodic motion $W$ is many-valued: it grows by $J = \oint p\,dq$ each cycle, which is exactly why action-angle variables work.`,
      trap: R`The new momenta are constants, but one new coordinate is time itself (up to a constant).` },
    { id: 'hjt-r4-09', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'semiclassical quantisation', format: 'numeric',
      q: R`A diatomic molecule rotates freely in a plane with moment of inertia $1.5\times10^{-47}$ kg m². Applying $\oint p_\phi\,d\phi = nh$, its $n = 1$ energy is ______ meV (to two decimal places).`,
      answer: 2.31, tol: 0.02, calc: () => C.hbar ** 2 / (2 * 1.5e-47) / C.e * 1000, unit: 'meV',
      sol: R`Free rotation: $p_\phi$ is constant, so $\oint p_\phi\,d\phi = 2\pi p_\phi = nh$ gives $p_\phi = n\hbar$. Then $E = \dfrac{p_\phi^2}{2I} = \dfrac{n^2\hbar^2}{2I} = \dfrac{(1.0546\times10^{-34})^2}{3\times10^{-47}} = 3.71\times10^{-22}$ J $= 2.31$ meV for $n = 1$.`,
      trap: R`Using $h$ instead of $\hbar$ gives a value $4\pi^2$ times too large.` },
    { id: 'hjt-r4-10', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'action variables', format: 'numeric',
      q: R`A particle moves in a central potential with total angular momentum $L = 3$ J s (in some units). For its angular motion in spherical polar coordinates, the sum of action variables $J_\theta + J_\phi$ is ______ J s (to two decimal places).`,
      answer: 18.85, tol: 0.03, calc: () => 2 * Math.PI * 3, unit: 'J s',
      sol: R`The angular part separates as $p_\theta^2 + \dfrac{p_\phi^2}{\sin^2\theta} = L^2$, with $p_\phi$ constant. $J_\phi = \oint p_\phi\,d\phi = 2\pi|p_\phi|$. $J_\theta = \oint\sqrt{L^2 - p_\phi^2/\sin^2\theta}\,d\theta = 2\pi(L - |p_\phi|)$ (a standard integral). So $J_\theta + J_\phi = 2\pi L = 6\pi = 18.85$ J s, whatever the orbit's tilt. Only this sum enters $H$, which is why the two angular frequencies are equal.`,
      trap: R`Each action alone depends on the tilt of the orbit plane ($p_\phi = L\cos i$); only the sum is fixed by $L$.` },
    { id: 'hjt-r4-11', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'semiclassical quantisation', format: 'numeric',
      q: R`A photon bounces back and forth between two parallel mirrors 1.00 μm apart ($p = E/c$). Applying the old quantum rule $\oint p\,dx = nh$ with $n = 1$ gives the photon energy ______ eV (to three decimal places). Use $hc = 1239.84$ eV nm.`,
      answer: 0.620, tol: 0.003, calc: () => 1239.84 / 2000, unit: 'eV',
      sol: R`Over one round trip $\oint p\,dx = 2Lp = 2LE/c$. Setting it to $h$: $E = \dfrac{hc}{2L} = \dfrac{1239.84}{2\times1000}$ eV $= 0.620$ eV. This is the lowest standing-wave mode of the cavity, $L = \lambda/2$, so the old rule reproduces the wave result exactly here.`,
      trap: R`The loop integral covers the round trip $2L$, not $L$.` },
    { id: 'hjt-r4-12', type: 'nat', level: 5, exams: ['gate', 'net'], sub: "Hamilton's principal function", format: 'numeric',
      q: R`For an oscillator with $m = \omega = 1$, Hamilton's principal function between $x_0$ at $t = 0$ and $x_1$ at $t = T$ is $S = \dfrac{(x_0^2 + x_1^2)\cos T - 2x_0x_1}{2\sin T}$. For $x_0 = 0$, $x_1 = 1$ and $T = \pi/3$, the initial momentum $p_0 = -\partial S/\partial x_0$ is ______ (to three decimal places).`,
      answer: 1.155, tol: 0.003, calc: () => 1 / Math.sin(Math.PI / 3),
      sol: R`$p_0 = -\dfrac{\partial S}{\partial x_0} = -\dfrac{2x_0\cos T - 2x_1}{2\sin T} = \dfrac{x_1 - x_0\cos T}{\sin T} = \dfrac{1}{\sin(\pi/3)} = 1.155$. Check: the path is $x = A\sin t$ with $A\sin(\pi/3) = 1$, so $A = 1.155$ and $p_0 = \dot x(0) = A = 1.155$.`,
      trap: R`The initial momentum carries a minus sign ($p_0 = -\partial S/\partial x_0$), the final one does not.` },
  ],
  gens: [
    { id: 'hjt-r4g1', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'semiclassical quantisation',
      make(r) {
        const m = pick(r, 1, 9, 0.5), ex = choose(r, [-47, -46]), I = m * 10 ** ex, n = int(r, 1, 4);
        const answer = round(n * n * C.hbar ** 2 / (2 * I) / C.e * 1000, 4);
        return { q: R`A molecule rotates freely in a plane with moment of inertia $${m}\times10^{${ex}}$ kg m². Using $\oint p_\phi\,d\phi = nh$, find its energy in meV for $n = ${n}$.`,
          answer, tol: Math.max(0.0005, answer * 0.01), unit: 'meV', I, n,
          sol: R`$2\pi p_\phi = nh$ gives $p_\phi = n\hbar$, so $E = \dfrac{n^2\hbar^2}{2I} = \dfrac{${n * n}\times(1.0546\times10^{-34})^2}{2\times${m}\times10^{${ex}}}$ J $= ${answer}$ meV.`,
          trap: 'The quantum of $p_\\phi$ is $\\hbar$, not $h$.' };
      },
      verify: (p) => p.n * p.n * C.hbar ** 2 / (2 * p.I) / C.e * 1000 },
    { id: 'hjt-r4g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'action variables',
      make(r) {
        const L = int(r, 2, 9), pphi = int(r, 1, L - 1), want = choose(r, ['theta', 'sum', 'phi']);
        const v = want === 'theta' ? 2 * Math.PI * (L - pphi) : want === 'phi' ? 2 * Math.PI * pphi : 2 * Math.PI * L;
        const answer = round(v, 3);
        const tex = want === 'theta' ? 'J_\\theta' : want === 'phi' ? 'J_\\phi' : 'J_\\theta + J_\\phi';
        return { q: R`A particle in a central potential has total angular momentum $L = ${L}$ and $z$-component $p_\phi = ${pphi}$ (same units). Find $${tex}$ for its angular motion in spherical polar coordinates.`,
          answer, tol: Math.max(0.01, answer * 0.005), L, pphi, want,
          sol: R`$J_\phi = 2\pi|p_\phi| = ${round(2 * Math.PI * pphi, 3)}$ and $J_\theta = \oint\sqrt{L^2 - p_\phi^2/\sin^2\theta}\,d\theta = 2\pi(L - |p_\phi|) = ${round(2 * Math.PI * (L - pphi), 3)}$; their sum is $2\pi L = ${round(2 * Math.PI * L, 3)}$. So $${tex} = ${answer}$.`,
          trap: 'The split between $J_\\theta$ and $J_\\phi$ depends on the tilt of the orbit; only the sum is $2\\pi L$.' };
      },
      verify: (p) => (p.want === 'theta' ? 2 * Math.PI * (p.L - p.pphi) : p.want === 'phi' ? 2 * Math.PI * p.pphi : 2 * Math.PI * p.L) },
    { id: 'hjt-r4g3', type: 'nat', level: 5, exams: ['gate', 'net'], sub: "Hamilton's principal function",
      make(r) {
        const x0 = pick(r, -1, 1, 0.5), x1 = pick(r, 0.5, 2, 0.5), deg = choose(r, [30, 45, 60, 120, 135, 150]), first = choose(r, [true, false]);
        const T = deg * Math.PI / 180, s = Math.sin(T), c = Math.cos(T);
        const v = first ? (x1 - x0 * c) / s : (x1 * c - x0) / s, answer = round(v, 4);
        return { q: R`For an oscillator with $m = \omega = 1$, $S = \dfrac{(x_0^2 + x_1^2)\cos T - 2x_0x_1}{2\sin T}$ is Hamilton's principal function between $x_0$ at $t = 0$ and $x_1$ at $t = T$. For $x_0 = ${x0}$, $x_1 = ${x1}$ and $T = ${round(T, 4)}$ (a phase of ${deg}°), find the ${first ? 'initial momentum $p_0 = -\\partial S/\\partial x_0$' : 'final momentum $p_1 = \\partial S/\\partial x_1$'}.`,
          answer, tol: Math.max(0.005, Math.abs(answer) * 0.005), x0, x1, T, first,
          sol: R`$p_0 = -\dfrac{\partial S}{\partial x_0} = \dfrac{x_1 - x_0\cos T}{\sin T} = ${round((x1 - x0 * c) / s, 4)}$ and $p_1 = \dfrac{\partial S}{\partial x_1} = \dfrac{x_1\cos T - x_0}{\sin T} = ${round((x1 * c - x0) / s, 4)}$, with $\cos T = ${round(c, 4)}$, $\sin T = ${round(s, 4)}$.`,
          trap: 'Initial momentum: minus the derivative with respect to $x_0$; final momentum: plus the derivative with respect to $x_1$.' };
      },
      verify: (p) => (p.first ? (p.x1 - p.x0 * Math.cos(p.T)) / Math.sin(p.T) : (p.x1 * Math.cos(p.T) - p.x0) / Math.sin(p.T)) },
  ],
};
