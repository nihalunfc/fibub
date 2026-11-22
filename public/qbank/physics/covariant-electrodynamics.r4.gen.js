// Round 4 extras for covariant-electrodynamics: original questions, written 2026-11-22.
import { choose, round, C } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const MEC2 = 0.51099895; // MeV

export default {
  items: [
    { id: 'ced-r4-01', type: 'mcq', level: 1, exams: G, sub: 'four-vectors',
      q: R`With $x^\mu = (ct, \vec x)$ and metric signature $(+,-,-,-)$, the d'Alembertian $\Box = \partial_\mu\partial^\mu$ is`,
      options: [R`$\nabla^2 - \dfrac1{c^2}\dfrac{\partial^2}{\partial t^2}$`, R`$\dfrac1{c^2}\dfrac{\partial^2}{\partial t^2} - \nabla^2$`, R`$\dfrac1{c^2}\dfrac{\partial^2}{\partial t^2} + \nabla^2$`, R`$\dfrac{\partial^2}{\partial t^2} - \nabla^2$`],
      answer: 1,
      sol: R`$\partial_\mu = (\tfrac1c\partial_t, \nabla)$ and $\partial^\mu = (\tfrac1c\partial_t, -\nabla)$. Their contraction is $\tfrac1{c^2}\partial_t^2 - \nabla^2$. Books with the opposite signature $(-,+,+,+)$ get the first option; the wave equation $\Box A^\mu = \mu_0J^\mu$ then changes sign accordingly.`,
      trap: R`The overall sign depends on the metric convention, but the relative minus sign between time and space never does; the last option also fails a units check.` },
    { id: 'ced-r4-02', type: 'nat', level: 2, exams: G, sub: 'four-current', unit: R`$\mu$C/m$^3$`,
      q: R`In the lab a cloud of charge has density $\rho = 5.0\ \mu$C/m$^3$ and current density $J = 1.2\times10^3$ A/m$^2$ along $x$. Taking $c = 3.0\times10^8$ m/s, its charge density in its own rest frame is ______ $\mu$C/m$^3$ (to two decimal places).`,
      answer: 3.0, tol: 0.02, calc: () => Math.sqrt(5 ** 2 - (1.2e3 / 3e8 * 1e6) ** 2),
      sol: R`$J^\mu = (c\rho, \vec J)$ is a four-vector, so $J^\mu J_\mu = c^2\rho^2 - J^2$ is the same in every frame. In the rest frame $\vec J = 0$, so $\rho_0 = \sqrt{\rho^2 - J^2/c^2}$. $J/c = 1.2\times10^3/3.0\times10^8 = 4.0\times10^{-6}$ C/m$^3$, so $\rho_0 = \sqrt{5.0^2 - 4.0^2} = 3.0\ \mu$C/m$^3$. The cloud moves at $J/\rho = 0.8c$, and the lab density is $\gamma\rho_0 = \tfrac53\times3.0 = 5.0$, as it should be.`,
      trap: R`Subtracting instead of using the invariant ($5.0 - 4.0 = 1.0$), or adding the squares.` },
    { id: 'ced-r4-03', type: 'mcq', level: 2, exams: G, sub: 'field tensor',
      q: R`In SI units with $F^{0i} = -E^i/c$, the invariant $F_{\mu\nu}F^{\mu\nu}$ for a region with a pure magnetic field $\vec B$ (no electric field) is`,
      options: [R`$-2B^2$`, R`$B^2$`, R`$2B^2/c^2$`, R`$2B^2$`],
      answer: 3,
      sol: R`In general $F_{\mu\nu}F^{\mu\nu} = 2\left(B^2 - \dfrac{E^2}{c^2}\right)$: each field component appears twice in the antisymmetric tensor, and the time-space entries pick up one minus sign from lowering a single time index. With $E = 0$ it is $2B^2$. Its sign tells which field "wins": positive here, so there is no frame in which the field is purely electric.`,
      trap: R`Forgetting the factor 2 from the two entries $F^{ij}$ and $F^{ji}$, or putting the $1/c^2$ on $B$ instead of on $E$.` },
    { id: 'ced-r4-04', type: 'nat', level: 3, exams: G, sub: 'motion in fields', unit: 'GHz',
      q: R`An electron with kinetic energy $1.0$ MeV moves in a circle at right angles to a uniform $0.10$ T magnetic field ($m_ec^2 = 0.511$ MeV). Its revolution frequency is ______ GHz (to three decimal places).`,
      answer: 0.947, tol: 0.003, calc: () => { const g = 1 + 1 / MEC2; return C.e * 0.1 / (2 * Math.PI * g * C.me) / 1e9; },
      sol: R`From $d\vec p/dt = q\vec v\times\vec B$ with $\vec p = \gamma m\vec v$ and constant $\gamma$ (a magnetic force does no work): $\omega = \dfrac{qB}{\gamma m}$. $\gamma = 1 + K/mc^2 = 1 + 1.0/0.511 = 2.957$. The non-relativistic value is $\dfrac{eB}{2\pi m_e} = 2.80$ GHz, so $f = 2.80/2.957 = 0.947$ GHz.`,
      trap: R`Using the rest-mass cyclotron frequency ($2.80$ GHz): at relativistic energies the orbit frequency falls by $\gamma$, which is why cyclotrons fail for electrons.` },
    { id: 'ced-r4-05', type: 'msq', level: 3, exams: G, sub: 'field tensor', format: 'statements',
      q: R`Let $G^{\mu\nu} = \tfrac12\epsilon^{\mu\nu\alpha\beta}F_{\alpha\beta}$ be the dual of the field tensor. Which statements are correct?`,
      options: [R`$G^{\mu\nu}$ is obtained from $F^{\mu\nu}$ by replacing $\vec E/c\to\vec B$ and $\vec B\to-\vec E/c$.`, R`$\partial_\mu G^{\mu\nu} = 0$ contains both $\nabla\cdot\vec B = 0$ and Faraday's law.`, R`$F_{\mu\nu}G^{\mu\nu}$ is proportional to $\vec E\cdot\vec B$.`, R`$G_{\mu\nu}G^{\mu\nu} = F_{\mu\nu}F^{\mu\nu}$.`],
      answer: [0, 1, 2],
      sol: R`The duality swap $\vec E/c\to\vec B$, $\vec B\to-\vec E/c$ turns $F$ into $G$. The homogeneous Maxwell equations are $\partial_\mu G^{\mu\nu} = 0$: the $\nu = 0$ component is $\nabla\cdot\vec B = 0$ and the spatial ones give $\nabla\times\vec E + \partial_t\vec B = 0$. $F_{\mu\nu}G^{\mu\nu} = -\tfrac4c\vec E\cdot\vec B$, the second invariant. Applying the swap to $2(B^2 - E^2/c^2)$ gives $2(E^2/c^2 - B^2)$, so $G\cdot G = -F\cdot F$.`,
      trap: R`Treating duality as leaving every invariant unchanged: it flips the sign of the first one.` },
    { id: 'ced-r4-06', type: 'mcq', level: 3, exams: G, sub: 'lagrangian',
      q: R`A charge $q$ of mass $m$ moves at velocity $\vec v$ in potentials $\phi$, $\vec A$, with Lagrangian $L = -mc^2\sqrt{1 - v^2/c^2} - q\phi + q\vec v\cdot\vec A$. Its canonical momentum $\partial L/\partial\vec v$ is`,
      options: [R`$\gamma m\vec v + q\vec A$`, R`$\gamma m\vec v - q\vec A$`, R`$m\vec v + q\vec A$`, R`$\gamma m\vec v + q\phi\vec v/c^2$`],
      answer: 0,
      sol: R`$\dfrac{\partial}{\partial\vec v}\left(-mc^2\sqrt{1 - v^2/c^2}\right) = \dfrac{m\vec v}{\sqrt{1 - v^2/c^2}} = \gamma m\vec v$, and $\dfrac{\partial}{\partial\vec v}(q\vec v\cdot\vec A) = q\vec A$; $\phi$ does not depend on $\vec v$. So $\vec P = \gamma m\vec v + q\vec A$. It is this canonical momentum, not the kinetic one, that becomes $-i\hbar\nabla$ in quantum mechanics.`,
      trap: R`$m\vec v + q\vec A$ is the slow-speed limit only; the sign of $q\vec A$ follows from the $+q\vec v\cdot\vec A$ term.` },
    { id: 'ced-r4-07', type: 'nat', level: 4, exams: G, sub: 'motion in fields', unit: R`$\mu$s`,
      q: R`A proton starts from rest in a uniform electric field of $1.0$ MV/m (no magnetic field). The time it takes to reach $0.90c$ is ______ $\mu$s (to two decimal places). ($m_pc^2 = 938.3$ MeV.)`,
      answer: 6.46, tol: 0.03, calc: () => { const b = 0.9; return b / Math.sqrt(1 - b * b) * C.mp * C.c / (C.e * 1e6) * 1e6; },
      sol: R`The relativistic second law $dp/dt = qE$ still holds with $p = \gamma mv$, so $p = qEt$ grows linearly (hyperbolic motion). At $\beta = 0.90$, $\gamma\beta = 0.90/\sqrt{0.19} = 2.065$, so $t = \dfrac{\gamma\beta\,mc}{qE} = \dfrac{\gamma\beta\,(mc^2/e)}{cE} = \dfrac{2.065\times938.3\times10^6\ \text{V}}{(3.00\times10^8)(1.0\times10^6\ \text{V/m})} = 6.46\ \mu$s.`,
      trap: R`Using $v = at$ with $a = qE/m$ gives $2.82\ \mu$s: the speed would keep growing past $c$.` },
    { id: 'ced-r4-08', type: 'mcq', level: 4, exams: G, sub: 'stress-energy tensor',
      q: R`The trace $T^\mu{}_\mu$ of the stress-energy tensor of the electromagnetic field (energy density $u$) is`,
      options: [R`$u$`, R`$-u$`, R`$0$`, R`$2u$`],
      answer: 2,
      sol: R`$T^{\mu\nu} = \dfrac1{\mu_0}\left(F^{\mu\alpha}F^\nu{}_\alpha - \tfrac14g^{\mu\nu}F_{\alpha\beta}F^{\alpha\beta}\right)$ (up to an overall sign convention). Taking the trace, $g_{\mu\nu}g^{\mu\nu} = 4$, so the two terms are $F^{\mu\alpha}F_{\mu\alpha}$ and $-\tfrac14\cdot4\,F_{\alpha\beta}F^{\alpha\beta}$, which cancel. Physically: $T^\mu{}_\mu = T^{00} - (T^{11} + T^{22} + T^{33})$. $T^{00} = u$, and the spatial diagonal entries are the field's pressures, which add up to $u$ for any field (the Maxwell stress has trace $-u$). So the trace is $u - u = 0$. A traceless $T$ goes with massless photons and radiation pressure $p = u/3$.`,
      trap: R`Thinking the trace is the energy density: the pressures cancel it exactly.` },
    { id: 'ced-r4-09', type: 'msq', level: 4, exams: G, sub: 'field transformations', format: 'statements',
      q: R`In frame S there is only a uniform magnetic field $\vec B = B\hat z$. Frame S' moves at velocity $v\hat x$ relative to S. Which statements about the fields in S' are correct ($\gamma = 1/\sqrt{1 - v^2/c^2}$)?`,
      options: [R`$B'_z = \gamma B$`, R`$\vec E'\cdot\vec B' = 0$`, R`$|\vec B'| < |\vec B|$`, R`$\vec E' = -\gamma vB\,\hat y$`],
      answer: [0, 1, 3],
      sol: R`Components along the boost are unchanged; perpendicular ones transform as $\vec E'_\perp = \gamma(\vec E + \vec v\times\vec B)_\perp$ and $\vec B'_\perp = \gamma(\vec B - \vec v\times\vec E/c^2)_\perp$. With $\vec E = 0$: $\vec v\times\vec B = vB(\hat x\times\hat z) = -vB\hat y$, so $\vec E' = -\gamma vB\hat y$, and $\vec B' = \gamma B\hat z$, larger than $B$. $\vec E\cdot\vec B = 0$ is invariant, so it stays zero; and $B'^2 - E'^2/c^2 = \gamma^2B^2(1 - v^2/c^2) = B^2$, as the other invariant demands.`,
      trap: R`Expecting $B$ to shrink because some of it "turns into" $E$; in fact both grow, keeping $B^2 - E^2/c^2$ fixed.` },
    { id: 'ced-r4-10', type: 'nat', level: 5, exams: G, sub: 'motion in fields', unit: 'cm',
      q: R`In the lab, uniform fields $\vec B = 0.010$ T along $z$ and $\vec E = \tfrac12cB$ along $y$ fill space. An electron is released from rest. In the frame moving at the drift velocity $\vec E\times\vec B/B^2$, where the field is purely magnetic, the electron moves on a circle of radius ______ cm (to one decimal place).`,
      answer: 11.4, tol: 0.1, calc: () => { const g = 1 / Math.sqrt(0.75); return g * C.me * (C.c / 2) / (C.e * 0.01 * Math.sqrt(0.75)) * 100; },
      sol: R`The drift speed is $E/B = c/2$, so $\gamma_d = 1/\sqrt{1 - 1/4} = 1.155$. In that frame $\vec E' = 0$ and $B' = B/\gamma_d = \sqrt{B^2 - E^2/c^2} = 0.00866$ T. The electron, at rest in the lab, moves at $c/2$ in this frame (opposite to the drift), with $\gamma = 1.155$. Its circle has radius $r' = \dfrac{\gamma m_ev}{eB'} = \dfrac{1.155\times9.11\times10^{-31}\times1.50\times10^8}{1.60\times10^{-19}\times0.00866} = 0.114$ m $= 11.4$ cm. Back in the lab this circle plus the drift makes a cycloid-like path.`,
      trap: R`Using the lab field $B$ and the non-relativistic radius $mv/eB$ gives $8.5$ cm; both $\gamma$ and the reduced $B'$ matter.` },
  ],
  gens: [
    { id: 'ced-r4g1', type: 'nat', level: 2, exams: G, sub: 'four-current',
      make(r) {
        const [b, g] = choose(r, [[0.6, 1.25], [0.8, 5 / 3], [0.28, 25 / 24], [0.96, 25 / 7], [5 / 13, 13 / 12], [12 / 13, 13 / 5]]);
        const r0 = choose(r, [1, 2, 3, 4, 5, 6, 8, 10]);
        const rho = round(g * r0, 3), J = round(g * r0 * b * 3e8 * 1e-6, 1);
        const ask = r() < 0.5 ? 'rho0' : 'v';
        const r0c = Math.sqrt(rho ** 2 - (J / 3e8 * 1e6) ** 2), vc = J / 3e8 * 1e6 / rho;
        const ans = ask === 'rho0' ? r0c : vc;
        return { q: R`In the lab a charge cloud has density $${rho}\ \mu$C/m$^3$ and current density $${J}$ A/m$^2$ along $x$. Take $c = 3.0\times10^8$ m/s. ${ask === 'rho0' ? R`Its density in its own rest frame is ______ $\mu$C/m$^3$ (to two decimal places).` : R`Its speed is ______ $c$ (to three decimal places).`}`,
          answer: round(ans, ask === 'rho0' ? 2 : 3), tol: ask === 'rho0' ? Math.max(0.01, round(ans * 0.005, 2)) : 0.003, rho, J, ask,
          sol: R`$J/c = ${J}/(3.0\times10^8) = ${round(J / 3e8 * 1e6, 4)}\ \mu$C/m$^3$. ${ask === 'rho0' ? R`The invariant $c^2\rho^2 - J^2$ gives $\rho_0 = \sqrt{\rho^2 - (J/c)^2} = \sqrt{${rho}^2 - ${round(J / 3e8 * 1e6, 4)}^2} = ${round(r0c, 2)}\ \mu$C/m$^3$.` : R`The charge moves at $v = J/\rho$, so $\beta = \dfrac{J/c}{\rho} = \dfrac{${round(J / 3e8 * 1e6, 4)}}{${rho}} = ${round(vc, 3)}$.`}`,
          trap: '(cρ, J) is a four-vector: the rest density comes from the invariant length, not from a difference.' };
      },
      verify: (p) => { const jc = p.J / 3e8 * 1e6; return p.ask === 'rho0' ? Math.sqrt(p.rho ** 2 - jc ** 2) : jc / p.rho; } },
    { id: 'ced-r4g2', type: 'nat', level: 3, exams: G, sub: 'motion in fields',
      make(r) {
        const K = choose(r, [0.1, 0.25, 0.5, 1, 2, 5, 10]), B = choose(r, [0.01, 0.02, 0.05, 0.1, 0.2, 0.5]);
        const g = 1 + K / MEC2, f = C.e * B / (2 * Math.PI * g * C.me) / 1e6;
        return { q: R`An electron of kinetic energy $${K}$ MeV circles at right angles to a uniform $${B}$ T field ($m_ec^2 = 0.511$ MeV). Its revolution frequency is ______ MHz (to the nearest whole number).`,
          answer: Math.round(f), tol: Math.max(1, Math.round(f * 0.005)), unit: 'MHz', K, B,
          sol: R`$\gamma = 1 + K/m_ec^2 = ${round(g, 4)}$ and $f = \dfrac{eB}{2\pi\gamma m_e} = \dfrac{${round(C.e * B / (2 * Math.PI * C.me) / 1e6, 1)}\ \text{MHz}}{${round(g, 4)}} = ${Math.round(f)}$ MHz.`,
          trap: 'The orbital frequency falls by γ at relativistic energies.' };
      },
      verify: (p) => C.e * p.B / (2 * Math.PI * (1 + p.K / MEC2) * C.me) / 1e6 },
    { id: 'ced-r4g3', type: 'nat', level: 4, exams: G, sub: 'motion in fields',
      make(r) {
        const pr = r() < 0.5, b = choose(r, [0.5, 0.6, 0.8, 0.9, 0.95, 0.99]), E = choose(r, [0.1, 0.5, 1, 2, 5, 10]);
        const m = pr ? C.mp : C.me, gb = b / Math.sqrt(1 - b * b);
        const t = gb * m * C.c / (C.e * E * 1e6) * (pr ? 1e6 : 1e9);
        return { q: R`${pr ? 'A proton' : 'An electron'} starts from rest in a uniform electric field of $${E}$ MV/m. The time it takes to reach $${b}c$ is ______ ${pr ? R`$\mu$s` : 'ns'} (to three decimal places).`,
          answer: round(t, 3), tol: Math.max(0.001, round(t * 0.005, 3)), unit: pr ? R`$\mu$s` : 'ns', pr, b, E,
          sol: R`$p = qEt$ with $p = \gamma mv$, so $t = \dfrac{\gamma\beta\,mc}{qE}$. $\gamma\beta = ${b}/\sqrt{1 - ${b}^2} = ${round(gb, 4)}$, and $mc/e = ${pr ? '3.13' : '1.70\\times10^{-3}'}$ V s/m, so $t = ${round(gb, 4)}\times\dfrac{mc/e}{${E}\times10^6} = ${round(t, 3)}$ ${pr ? R`$\mu$s` : 'ns'}.`,
          trap: 'Newtonian v = (qE/m)t underestimates the time and would pass c.' };
      },
      verify: (p) => (p.b / Math.sqrt(1 - p.b * p.b)) * (p.pr ? C.mp : C.me) * C.c / (C.e * p.E * 1e6) * (p.pr ? 1e6 : 1e9) },
  ],
};
