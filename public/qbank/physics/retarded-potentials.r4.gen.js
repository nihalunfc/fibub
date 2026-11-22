// Round 4 extras for retarded-potentials: original questions, written 2026-11-22.
import { choose, round, C } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const K = 1 / (4 * Math.PI * C.eps0);

export default {
  items: [
    { id: 'netrp-r4-01', type: 'mcq', level: 1, exams: G, sub: 'retarded time',
      q: R`The potentials at point $\vec r$ and time $t$ are built from the sources at $\vec r'$ evaluated at the retarded time`,
      options: [R`$t + |\vec r - \vec r'|/c$`, R`$t - |\vec r - \vec r'|/c$`, R`$t - c|\vec r - \vec r'|$`, R`$t$ itself, since potentials act instantly`],
      answer: 1,
      sol: R`News from $\vec r'$ travels at $c$, so what arrives at $\vec r$ at time $t$ left $\vec r'$ a time $|\vec r - \vec r'|/c$ earlier: $t_r = t - |\vec r - \vec r'|/c$. The plus sign gives the advanced solution, which also solves the wave equation but is rejected on causal grounds.`,
      trap: R`$t - c|\vec r - \vec r'|$ fails a units check: distance divided by speed is a time.` },
    { id: 'netrp-r4-02', type: 'nat', level: 2, exams: G, sub: 'liénard-wiechert',
      q: R`A point charge moves straight towards an observer at $0.50c$. Its Liénard-Wiechert scalar potential at the observer is larger than the Coulomb value $\dfrac{q}{4\pi\epsilon_0\mathscr r}$ (with $\mathscr r$ the distance from the retarded position) by a factor of ______ (to two decimal places).`,
      answer: 2.0, tol: 0.01, calc: () => 1 / (1 - 0.5),
      sol: R`$V = \dfrac{q}{4\pi\epsilon_0\mathscr r(1 - \hat{\mathscr r}\cdot\vec\beta)}$. Heading straight at the observer, $\hat{\mathscr r}\cdot\vec\beta = 0.50$, so the factor is $1/(1 - 0.50) = 2.00$. Moving straight away it would be $1/1.5 = 0.67$.`,
      trap: R`Using $\gamma = 1.155$: the factor comes from retardation geometry, not from time dilation.` },
    { id: 'netrp-r4-03', type: 'mcq', level: 2, exams: G, sub: 'retarded potentials',
      q: R`A steady current $I_0$ is switched on at $t = 0$ in an infinitely long straight wire (it was zero before). At distance $s$, long after the switch-on ($ct\gg s$),`,
      options: [R`both $E$ and $B$ grow without limit`, R`$E$ settles at a steady non-zero value along the wire`, R`$B$ stays zero, since the retarded current never reaches $s$`, R`$E\to0$ and $B\to\dfrac{\mu_0I_0}{2\pi s}$`],
      answer: 3,
      sol: R`For $t < s/c$ nothing has arrived and both fields are zero. Afterwards a growing length of wire contributes to $\vec A$; $E = -\partial A/\partial t$ falls as $1/\sqrt{c^2t^2 - s^2}$, and $B = \nabla\times\vec A$ approaches the static Biot-Savart value $\mu_0I_0/2\pi s$. Retarded solutions settle into the static ones once the news from every relevant part of the source has arrived.`,
      trap: R`Thinking $B$ jumps straight to its final value at $t = s/c$: only the nearest part of the wire has been heard from then.` },
    { id: 'netrp-r4-04', type: 'nat', level: 3, exams: G, sub: 'uniform motion', unit: 'V',
      q: R`A $1.0$ nC charge moves with constant velocity $0.60c$. At an instant when it is $1.0$ m from an observer, with the line from its <b>present</b> position to the observer at right angles to its velocity, the scalar potential at the observer is ______ V (to two decimal places).`,
      answer: 11.23, tol: 0.05, calc: () => K * 1e-9 / Math.sqrt(1 - 0.36),
      sol: R`For uniform motion the Liénard-Wiechert potential can be written with the present position: $V = \dfrac{q}{4\pi\epsilon_0R\sqrt{1 - \beta^2\sin^2\theta}}$, with $R$ the present distance and $\theta$ the angle between $\vec R$ and $\vec v$. Here $\theta = 90^\circ$: $V = \dfrac{8.99}{1.0\times\sqrt{1 - 0.36}} = \dfrac{8.99}{0.80} = 11.23$ V, $\gamma$ times the static value.`,
      trap: R`Using the retarded distance in the plain Coulomb formula; the factor $(1 - \hat{\mathscr r}\cdot\vec\beta)$ is needed as well, and together they give the present-position form.` },
    { id: 'netrp-r4-05', type: 'msq', level: 3, exams: G, sub: 'gauges', format: 'statements',
      q: R`Which statements about potentials and gauges are correct?`,
      options: [R`In the Coulomb gauge the scalar potential is the instantaneous Coulomb potential of the present charge distribution.`, R`Even in the Coulomb gauge, the electric field at a distance changes only after a light-travel delay.`, R`In the Coulomb gauge the vector potential is also given by an instantaneous (unretarded) integral.`, R`The retarded potentials satisfy the Lorenz gauge condition, given that charge is conserved.`],
      answer: [0, 1, 3],
      sol: R`Differentiating the retarded integrals and using $\nabla\cdot\vec J + \partial_t\rho = 0$ gives $\nabla\cdot\vec A + \tfrac1{c^2}\partial_tV = 0$. In the Coulomb gauge $\nabla^2V = -\rho/\epsilon_0$ has no time derivatives, so $V$ responds at once everywhere; but $\vec A$ then obeys a wave equation driven by the transverse current, which contains non-local parts that exactly cancel the instantaneous part of $-\nabla V$. Fields are gauge-independent, so $\vec E$ stays causal.`,
      trap: R`Taking the instantaneous scalar potential as a signal faster than light: potentials are not measurable on their own, fields are.` },
    { id: 'netrp-r4-06', type: 'mcq', level: 3, exams: G, sub: 'liénard-wiechert',
      q: R`In the Liénard-Wiechert potentials, a moving point charge gets the extra factor $1/(1 - \hat{\mathscr r}\cdot\vec\beta)$. The physical origin of this factor is that`,
      options: [R`a moving charge is Lorentz-contracted, which raises its density`, R`the charge's mass grows by $\gamma$, which strengthens its field`, R`the backward light cone sweeping over a moving charge spends longer on it when it approaches (shorter when it recedes), so it is counted with that weight`, R`the observer's clock runs slow relative to the charge's clock`],
      answer: 2,
      sol: R`The retarded integral collects the charge on the observer's backward light cone. As that cone sweeps over a charge moving towards the observer, the charge travels along with the sweep, so the cone spends longer crossing it and it counts as an apparent volume larger by $1/(1 - \hat{\mathscr r}\cdot\vec\beta)$. The same factor ($dt/dt_r$) appears in the Doppler effect. It has nothing to do with contraction or mass; even a slow, rigid sound-emitting source shows it.`,
      trap: R`Reaching for relativity: the factor is pure geometry and holds even to first order in $v/c$.` },
    { id: 'netrp-r4-07', type: 'nat', level: 4, exams: G, sub: 'retarded potentials', unit: 'ns',
      q: R`A current of $1.0$ A is switched on at $t = 0$ in an infinitely long straight wire. At distance $s = 3.0$ m the induced electric field has magnitude $E = \dfrac{\mu_0I_0c}{2\pi\sqrt{c^2t^2 - s^2}}$ for $t > s/c$. It has fallen to $1.0$ V/m at $t = $ ______ ns (to the nearest whole number).`,
      answer: 200, tol: 1, calc: () => Math.sqrt((2e-7 * C.c) ** 2 + 9) / C.c * 1e9,
      sol: R`Set $\sqrt{c^2t^2 - s^2} = \dfrac{\mu_0I_0c}{2\pi E} = \dfrac{(2\times10^{-7})(1.0)(3.00\times10^8)}{1.0} = 59.96$ m. Then $ct = \sqrt{59.96^2 + 3.0^2} = 60.03$ m and $t = 60.03/(3.00\times10^8) = 200$ ns. The field is infinite at the instant the news arrives ($t = s/c = 10$ ns) for an ideally sudden switch-on, then dies away slowly.`,
      trap: R`Forgetting the $s^2$ term changes the answer only a little here, but ignoring it near $t = s/c$ gives nonsense.` },
    { id: 'netrp-r4-08', type: 'mcq', level: 4, exams: G, sub: 'uniform motion',
      q: R`A charge $q$ moves with constant velocity $\vec v$. At a point straight ahead of it on its line of motion, a present distance $R$ away, the scalar potential is`,
      options: [R`$\dfrac{q}{4\pi\epsilon_0R}$, whatever the speed`, R`$\dfrac{\gamma q}{4\pi\epsilon_0R}$`, R`$\dfrac{q}{4\pi\epsilon_0\gamma^2R}$`, R`$\dfrac{q}{4\pi\epsilon_0R(1 - v/c)}$`],
      answer: 0,
      sol: R`$V = \dfrac{q}{4\pi\epsilon_0R\sqrt{1 - \beta^2\sin^2\theta}}$ with $\theta$ the angle from the velocity to the present position vector. On the line of motion $\sin\theta = 0$, so $V$ equals the static value at the present distance for any $v$. The field there is weaker by $\gamma^2$ (the pancake), because $\vec E = -\nabla V - \partial_t\vec A$ includes the $\vec A$ term.`,
      trap: R`$1/(1 - v/c)$ uses the retarded distance's factor with the present distance; the two corrections cancel on the axis.` },
    { id: 'netrp-r4-09', type: 'msq', level: 4, exams: G, sub: 'multipole expansion', format: 'statements',
      q: R`A localised source oscillates at angular frequency $\omega$ ($k = \omega/c$). Which statements are correct?`,
      options: [R`Its vector potential is $\vec A(\vec r) = \dfrac{\mu_0}{4\pi}\displaystyle\int\vec J(\vec r')\dfrac{e^{ik|\vec r - \vec r'|}}{|\vec r - \vec r'|}d^3r'$ (time factor $e^{-i\omega t}$).`, R`When the source is much smaller than $\lambda$, the leading radiation is electric dipole radiation (if the dipole moment oscillates).`, R`A spherically symmetric, radially pulsating current distribution radiates.`, R`Magnetic dipole and electric quadrupole fields are smaller than electric dipole ones by roughly (source size)/$\lambda$.`],
      answer: [0, 1, 3],
      sol: R`Writing $\vec J(\vec r', t_r) = \vec J(\vec r')e^{-i\omega(t - |\vec r - \vec r'|/c)}$ in the retarded integral gives the first expression. Across a source of size $d\ll\lambda$ the phase $k|\vec r - \vec r'|$ hardly varies; expanding it in $kd$ gives dipole, then magnetic-dipole and quadrupole terms, each smaller by about $kd$. A spherically symmetric source has only a monopole, and the total charge cannot oscillate, so it does not radiate (Birkhoff-like result for electromagnetism).`,
      trap: R`A "breathing" sphere of charge looks as if it should radiate, but its field outside is just Coulomb's, fixed by the unchanging total charge.` },
    { id: 'netrp-r4-10', type: 'nat', level: 5, exams: G, sub: 'liénard-wiechert', unit: 'm',
      q: R`A charge moves along the $x$ axis as $x = vt$ with $v = 0.60c$. An observer sits at $(0, 4.0\ \text{m})$. For the field the observer sees at $t = 0$, the effective distance $\mathscr r(1 - \hat{\mathscr r}\cdot\vec\beta)$ that appears in the Liénard-Wiechert potential is ______ m (to two decimal places).`,
      answer: 3.2, tol: 0.02, calc: () => { const b = 0.6, d = 4, g = 1 / Math.sqrt(1 - b * b), xr = -b * g * d, rr = Math.hypot(xr, d); return rr * (1 - (-xr / rr) * b); },
      sol: R`Retarded time: $c(0 - t_r) = \sqrt{(vt_r)^2 + d^2}$, so $c^2t_r^2(1 - \beta^2) = d^2$ and $t_r = -\gamma d/c$ ($\gamma = 1.25$). The retarded position is $x_r = vt_r = -\beta\gamma d = -3.0$ m, so $\mathscr r = \sqrt{3.0^2 + 4.0^2} = 5.0$ m and $\hat{\mathscr r} = (3.0, 4.0)/5.0$. Then $\hat{\mathscr r}\cdot\vec\beta = 0.60\times0.60 = 0.36$ and $\mathscr r(1 - 0.36) = 3.20$ m. Check: the present-position form $R\sqrt{1 - \beta^2\sin^2\theta} = 4.0\times0.80 = 3.20$ m agrees.`,
      trap: R`Using the present distance $4.0$ m or the retarded distance $5.0$ m alone; the potential needs their particular combination.` },
  ],
  gens: [
    { id: 'netrp-r4g1', type: 'nat', level: 3, exams: G, sub: 'retarded potentials',
      make(r) {
        const s = choose(r, [1, 2, 3, 5, 10]), k = choose(r, [1.25, 1.5, 2, 3, 5]), I = choose(r, [0.5, 1, 2, 5, 10]);
        const ct = s * k, t = ct / C.c * 1e9, E = 2e-7 * I * C.c / Math.sqrt(ct * ct - s * s);
        return { q: R`A current of $${I}$ A is switched on at $t = 0$ in an infinitely long straight wire. At distance $${s}$ m, the induced field is $E = \dfrac{\mu_0I_0c}{2\pi\sqrt{c^2t^2 - s^2}}$ for $t > s/c$. At $t = ${round(t, 2)}$ ns it is ______ V/m (to two decimal places).`,
          answer: round(E, 2), tol: Math.max(0.01, round(E * 0.01, 2)), unit: 'V/m', I, s, t,
          sol: R`$ct = ${round(ct, 3)}$ m, so $\sqrt{c^2t^2 - s^2} = \sqrt{${round(ct, 3)}^2 - ${s}^2} = ${round(Math.sqrt(ct * ct - s * s), 3)}$ m. $E = \dfrac{(2\times10^{-7})(${I})(3.00\times10^8)}{${round(Math.sqrt(ct * ct - s * s), 3)}} = ${round(E, 2)}$ V/m.`,
          trap: 'Nothing arrives before t = s/c; just after, the field is huge, then it decays.' };
      },
      verify: (p) => { const ct = p.t * 1e-9 * C.c; return 2e-7 * p.I * C.c / Math.sqrt(ct * ct - p.s * p.s); } },
    { id: 'netrp-r4g2', type: 'nat', level: 4, exams: G, sub: 'retarded time',
      make(r) {
        const b = choose(r, [0.3, 0.5, 0.6, 0.8, 0.9, 0.95]), d = choose(r, [1, 2, 3, 4, 5, 10]);
        const g = 1 / Math.sqrt(1 - b * b), x = b * g * d;
        return { q: R`A charge moves along the $x$ axis as $x = vt$ with $v = ${b}c$. An observer is at $(0, ${d}\ \text{m})$. The distance between the charge's retarded position (for the field seen at $t = 0$) and its present position is ______ m (to two decimal places).`,
          answer: round(x, 2), tol: Math.max(0.01, round(x * 0.005, 2)), unit: 'm', b, d,
          sol: R`$c^2t_r^2 = v^2t_r^2 + d^2$ with $t_r < 0$, so $t_r = -\gamma d/c$ with $\gamma = ${round(g, 4)}$. In that time the charge moves $v|t_r| = \beta\gamma d = ${b}\times${round(g, 4)}\times${d} = ${round(x, 2)}$ m.`,
          trap: 'The light-travel time uses the retarded distance, which itself depends on the retarded time: solve, do not guess d/c.' };
      },
      verify: (p) => p.b * p.d / Math.sqrt(1 - p.b * p.b) },
    { id: 'netrp-r4g3', type: 'nat', level: 3, exams: G, sub: 'uniform motion',
      make(r) {
        const qn = choose(r, [1, 2, 5, 10]), b = choose(r, [0.3, 0.5, 0.6, 0.8, 0.9]), th = choose(r, [30, 45, 60, 90, 120, 150]), Rr = choose(r, [0.5, 1, 2, 5]);
        const s = Math.sin(th * Math.PI / 180), V = K * qn * 1e-9 / (Rr * Math.sqrt(1 - b * b * s * s));
        return { q: R`A $${qn}$ nC charge moves with constant velocity $${b}c$. At one instant it is $${Rr}$ m from an observer, and the line from its present position to the observer makes $${th}^\circ$ with its velocity. The scalar potential at the observer is ______ V (to two decimal places).`,
          answer: round(V, 2), tol: Math.max(0.01, round(V * 0.005, 2)), unit: 'V', qn, b, th, Rr,
          sol: R`$V = \dfrac{q}{4\pi\epsilon_0R\sqrt{1 - \beta^2\sin^2\theta}} = \dfrac{8.99\times${qn}}{${Rr}\sqrt{1 - ${b}^2\sin^2${th}^\circ}} = \dfrac{${round(8.98755 * qn / Rr, 3)}}{${round(Math.sqrt(1 - b * b * s * s), 4)}} = ${round(V, 2)}$ V.`,
          trap: 'Ahead or behind (θ = 0 or 180°) the potential is static-like; sideways it is raised by up to γ.' };
      },
      verify: (p) => { const s = Math.sin(p.th * Math.PI / 180); return K * p.qn * 1e-9 / (p.Rr * Math.sqrt(1 - p.b * p.b * s * s)); } },
  ],
};
