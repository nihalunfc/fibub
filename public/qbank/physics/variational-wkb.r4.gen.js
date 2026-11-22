// Round 4 extras for variational-wkb: original questions, written 2026-11-22.
import { int, choose, round } from '../_util.js';
const R = String.raw;
const RY = 13.606, A0 = 0.0529177;

export default {
  items: [
    { id: 'qvw-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'variational principle',
      q: R`A student uses a trial function for the hydrogen ground state (exact energy $-13.6$ eV) and reports a minimised $\langle H\rangle = -14.1$ eV. The right conclusion is that`,
      options: [R`the trial function is better than the exact one`, R`there is a mistake: the calculation is wrong or the trial function breaks the rules (not normalised, wrong boundary behaviour)`, R`the method has found an excited state`, R`nothing is wrong, since variational energies can lie on either side of the true value`], answer: 1,
      sol: R`For any acceptable normalised trial state, $\langle H\rangle \ge E_0$. A value below $-13.6$ eV is impossible, so something is wrong: a lost normalisation factor, an arithmetic slip, or a function that is not in the domain of $H$. Excited states lie higher, not lower.`,
      trap: R`The variational energy is one-sided: it can only be too high.` },
    { id: 'qvw-r4-02', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'wkb wavefunction',
      q: R`At a soft turning point $x = a$ the allowed region is $x < a$. The WKB solution that decays as $\dfrac{C}{\sqrt{|p|}}\exp\left(-\dfrac1\hbar\int_a^x|p|\,dx'\right)$ in the forbidden region matches, in the allowed region, onto`,
      options: [R`$\dfrac{2C}{\sqrt p}\sin\left(\dfrac1\hbar\int_x^ap\,dx'\right)$`, R`$\dfrac{2C}{\sqrt p}\cos\left(\dfrac1\hbar\int_x^ap\,dx' + \dfrac\pi2\right)$`, R`$\dfrac{C}{\sqrt p}\exp\left(\dfrac i\hbar\int_x^ap\,dx'\right)$`, R`$\dfrac{2C}{\sqrt p}\cos\left(\dfrac1\hbar\int_x^ap\,dx' - \dfrac\pi4\right)$`], answer: 3,
      sol: R`Near the turning point the potential is linear and the exact solution is an Airy function; its decaying branch behaves on the allowed side as $\cos(\zeta - \pi/4)$ with $\zeta = \tfrac1\hbar\int_x^ap\,dx'$. This is the connection formula. A standing wave (real cosine) is needed because a decaying solution carries no current. Two soft turning points each contribute $\pi/4$, which is where the $\tfrac12$ in $\oint p\,dx = (n + \tfrac12)h$ comes from.`,
      trap: R`A running wave $e^{i\zeta}$ would carry a current into the barrier, which a purely decaying wave cannot absorb.` },
    { id: 'qvw-r4-03', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'wkb quantisation',
      q: R`A harmonic oscillator has $\hbar\omega = 0.40$ eV. Bohr-Sommerfeld (WKB) quantisation, which is exact here, gives the number of states with energy at or below $5.0$ eV (measured from the bottom of the well) as ______.`,
      answer: 13, tol: 0,
      sol: R`$\oint p\,dx = 2\pi E/\omega = (n + \tfrac12)h$ gives $E_n = (n + \tfrac12)\hbar\omega$. We need $(n + \tfrac12)\times0.40 \le 5.0$, i.e. $n \le 12$. With $n = 0, 1, \dots, 12$ there are 13 states. (Each state takes up an area $h$ of phase space.)`,
      trap: R`$5.0/0.40 = 12.5$ suggests 12; counting must start from $n = 0$ and include the zero-point offset.` },
    { id: 'qvw-r4-04', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'trial functions',
      q: R`For the half oscillator ($V = \tfrac12m\omega^2x^2$ for $x > 0$, a hard wall at $x = 0$), the trial family $\psi = xe^{-\beta x^2}$ ($x > 0$) is used. Minimising $\langle H\rangle$ over $\beta$ gives`,
      options: [R`exactly $\tfrac32\hbar\omega$, because the family contains the true ground state`, R`exactly $\tfrac12\hbar\omega$`, R`a value above $\tfrac32\hbar\omega$`, R`a value below $\tfrac32\hbar\omega$`], answer: 0,
      sol: R`The wall needs $\psi(0) = 0$. On $x > 0$ the true ground state is the first excited state of the full oscillator, $xe^{-m\omega x^2/2\hbar}$, with energy $\tfrac32\hbar\omega$. The trial family contains it at $\beta = m\omega/2\hbar$, so the minimum is exactly $\tfrac32\hbar\omega$. A value below is impossible, and $\tfrac12\hbar\omega$ belongs to a state that does not vanish at the wall.`,
      trap: R`The full oscillator's ground state violates the boundary condition at the wall, so its energy is not available.` },
    { id: 'qvw-r4-05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'hydrogen',
      q: R`An exciton in a semiconductor is modelled as hydrogen with reduced mass $\mu = 0.060\,m_e$ and dielectric constant $\varepsilon_r = 12$. With the trial function $e^{-r/b}$, $\langle H\rangle(b) = \dfrac{\hbar^2}{2\mu b^2} - \dfrac{e^2}{4\pi\varepsilon_0\varepsilon_rb}$. The minimum of $\langle H\rangle$ is ______ meV (two decimal places). (For $\mu = m_e$, $\varepsilon_r = 1$ it would be $-13.606$ eV.)`,
      answer: -5.67, tol: 0.03, unit: 'meV', calc: () => -RY * 0.06 / 144 * 1000,
      sol: R`$\langle H\rangle = A/b^2 - B/b$ is least at $b = 2A/B$, where it equals $-B^2/4A = -\dfrac{\mu(e^2/4\pi\varepsilon_0)^2}{2\hbar^2\varepsilon_r^2}$. This is hydrogen's $-13.606$ eV scaled by $\mu/m_e$ and by $1/\varepsilon_r^2$: $-13.606\times0.060/144$ eV $= -5.67$ meV. The size is $b = a_0\varepsilon_r(m_e/\mu) = 10.6$ nm, many lattice spacings, which justifies a continuum dielectric. The trial family contains the exact $1s$ state, so this is exact for the model.`,
      trap: R`Dividing by $\varepsilon_r$ once instead of twice.` },
    { id: 'qvw-r4-06', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'double well', format: 'statements',
      q: R`A symmetric double well has a tunnelling doublet: two nearly degenerate lowest states split by $\Delta E$. Which statements are correct?`,
      options: [R`The lower state of the doublet is even (symmetric)`, R`Raising the barrier makes the splitting larger`, R`A particle started in one well moves to the other and back with period $2\pi\hbar/\Delta E$`, R`In ammonia the inversion splitting corresponds to microwaves near 24 GHz`], answer: [0, 2, 3],
      sol: R`The even combination has no node under the barrier and lies lower. The splitting goes as $e^{-\int\kappa\,dx/\hbar}$ through the barrier, so a higher barrier makes it exponentially smaller. Starting in one well means starting in $(|+\rangle + |-\rangle)/\sqrt2$; the relative phase $\Delta E\,t/\hbar$ makes it reach the other well at $\pi\hbar/\Delta E$ and return at $2\pi\hbar/\Delta E$. For NH$_3$, $\Delta E/h \approx 23.9$ GHz (1.25 cm), the transition used in the first maser.`,
      trap: R`Tunnelling rates are exponentially sensitive to barrier height and width, never linearly.` },
    { id: 'qvw-r4-07', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'tunnelling',
      q: R`In the WKB (Gamow) theory of alpha decay, for daughter nuclei of charge $Z$ and decay energy $Q$, the half-life follows roughly`,
      options: [R`$t_{1/2} \propto Q^2$`, R`$t_{1/2} \propto 1/Q$`, R`$\ln t_{1/2}$ grows roughly linearly with $Z/\sqrt Q$`, R`$\ln t_{1/2}$ does not depend on $Q$`], answer: 2,
      sol: R`The barrier factor is $T \approx e^{-2G}$ with $2G \approx 2\pi\eta$ and $\eta = \dfrac{2Ze^2}{4\pi\varepsilon_0\hbar v}$ (Sommerfeld parameter), and $v \propto \sqrt Q$. So $\ln t_{1/2} \approx aZ/\sqrt Q + b$: the Geiger-Nuttall law. Doubling $Q$ from about 4 to 9 MeV changes half-lives from billions of years to microseconds.`,
      trap: R`Expecting a power law; the exponential barrier factor makes the dependence enormous.` },
    { id: 'qvw-r4-08', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'wkb quantisation',
      q: R`In Bohr-Sommerfeld (WKB) quantisation for a one-dimensional bound particle, the phase-space area enclosed between the orbits of two neighbouring levels is`,
      options: [R`$\hbar$`, R`$h$`, R`$h/2$`, R`$2\pi h$`], answer: 1,
      sol: R`$\oint p\,dx = (n + \gamma)h$, so neighbouring orbits differ by exactly $h$ in enclosed area. Each quantum state "occupies" an area $h$ of phase space, the rule used to count states in statistical mechanics.`,
      trap: R`Mixing $h$ and $\hbar$; the area is $2\pi\hbar = h$.` },
    { id: 'qvw-r4-09', type: 'mcq', level: 5, exams: ['net', 'gate'], sub: 'variational principle',
      q: R`Temple's inequality states $E_0 \ge \langle H\rangle - \dfrac{\langle H^2\rangle - \langle H\rangle^2}{E_1 - \langle H\rangle}$ for a trial state with $\langle H\rangle < E_1$. What does it supply?`,
      options: [R`an upper bound on $E_0$ that needs no information about other levels`, R`an upper bound on $E_1$`, R`a lower bound on $E_0$, which needs a lower estimate of $E_1$ and the energy variance of the trial state`, R`the exact $E_0$ whenever the trial state is normalised`], answer: 2,
      sol: R`Every eigenvalue is either $E_0$ or at least $E_1$, so $(E_n - E_0)(E_n - E_1) \ge 0$ for all $n$, and $\langle(H - E_0)(H - E_1)\rangle \ge 0$. Expanding and solving for $E_0$ gives the inequality, a lower bound. It still holds if $E_1$ is replaced by any lower estimate above $\langle H\rangle$. Together with the variational upper bound $\langle H\rangle$ it brackets $E_0$, tightly when the variance is small.`,
      trap: R`Assuming every variational-type formula gives an upper bound.` },
    { id: 'qvw-r4-10', type: 'nat', level: 5, exams: ['net', 'gate'], sub: 'wkb quantisation',
      q: R`For the well $V = -V_0\,\mathrm{sech}^2(x/a)$, one finds $\int p\,dx = \pi a\left(\sqrt{2mV_0} - \sqrt{2m|E|}\right)$ between the turning points of a level $E < 0$. With $2mV_0a^2/\hbar^2 = 30$, WKB ($\int p\,dx = (n + \tfrac12)\pi\hbar$) predicts ______ bound states.`,
      answer: 5, tol: 0, calc: () => Math.floor(Math.sqrt(30) - 0.5) + 1,
      sol: R`The rule gives $\dfrac{a\sqrt{2m|E_n|}}{\hbar} = \sqrt{30} - (n + \tfrac12) = 5.477 - n - 0.5$. A level is bound while this is positive: $n + 0.5 < 5.477$, so $n = 0, 1, 2, 3, 4$: five states. The exact solution has $\kappa_na = s - n$ with $s(s + 1) = 30$, i.e. $s = 5$, so also five bound states ($n = 5$ sits exactly at threshold). WKB here differs from the exact energies only by replacing $s$ with $\sqrt{s(s + 1)} - \tfrac12$.`,
      trap: R`Counting $n = 5$ as well: $5.5 > 5.477$, so it is not bound.` },
    { id: 'qvw-r4-11', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'wkb quantisation',
      q: R`A Morse oscillator with well depth $D_e = 4.75$ eV and $\hbar\omega = 0.55$ eV has levels $E_n = \hbar\omega(n + \tfrac12) - \dfrac{[\hbar\omega(n + \frac12)]^2}{4D_e}$ (from the bottom; WKB gives this exactly). Levels exist as long as $E_n$ still increases with $n$. The number of bound vibrational levels is ______.`,
      answer: 17, tol: 0, calc: () => Math.floor(2 * 4.75 / 0.55 - 0.5) + 1,
      sol: R`$E_n$ is a downward parabola in $u = n + \tfrac12$, peaking at $u = 2D_e/\hbar\omega = 17.27$, where $E = D_e$ (the dissociation limit). Bound levels need $n + \tfrac12 < 17.27$, so $n = 0, \dots, 16$: 17 levels. Their spacing shrinks steadily, $E_{n+1} - E_n = \hbar\omega - (\hbar\omega)^2(n + 1)/2D_e$, as in real molecular spectra.`,
      trap: R`Dividing $D_e$ by $\hbar\omega$ (8.6) assumes equal spacing; the anharmonic levels crowd together and twice as many fit.` },
    { id: 'qvw-r4-12', type: 'msq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'variational principle', format: 'statements',
      q: R`Which statements about the variational method for the ground state are correct?`,
      options: [R`Enlarging the trial family (keeping the old one as a special case) cannot raise the minimum of $\langle H\rangle$`, R`The minimum of $\langle H\rangle$ is an upper bound on the true ground-state energy`, R`The best trial function gives an upper bound on the exact $\langle x^2\rangle$`, R`If the family contains the exact ground state, the minimum equals $E_0$`], answer: [0, 1, 3],
      sol: R`A larger family includes all the old trial states, so its minimum is at most the old one. Every $\langle H\rangle \ge E_0$, with equality only for the exact ground state. Nothing bounds other quantities: the optimised function can give $\langle x^2\rangle$ too large or too small, and its error is first order in the wavefunction error while the energy error is second order.`,
      trap: R`The bound property belongs only to the energy (the quantity being minimised).` },
  ],
  gens: [
    { id: 'qvw-r4g1', type: 'nat', level: 3, exams: ['gate', 'net', 'jam'], sub: 'anharmonic levels',
      make(r) {
        const De = choose(r, [2, 3, 4, 4.75, 5]), hw = choose(r, [0.2, 0.25, 0.3, 0.4, 0.5]), n = int(r, 0, 5), ask = choose(r, ['level', 'gap']);
        const E = (k) => hw * (k + 0.5) - (hw * (k + 0.5)) ** 2 / (4 * De);
        const ans = ask === 'level' ? E(n) : E(n + 1) - E(n);
        return { q: R`A Morse oscillator has $D_e = ${De}$ eV and $\hbar\omega = ${hw}$ eV, with $E_n = \hbar\omega(n + \tfrac12) - \dfrac{[\hbar\omega(n + \frac12)]^2}{4D_e}$ measured from the bottom of the well. ${ask === 'level' ? `The energy of the level $n = ${n}$ is` : `The photon energy for $n = ${n} \\to ${n + 1}$ is`} ______ eV (four decimal places).`,
          answer: round(ans, 4), tol: 0.0005, De, hw, n, ask,
          sol: ask === 'level' ? R`$\hbar\omega(n + \tfrac12) = ${round(hw * (n + 0.5), 4)}$ eV and the anharmonic term is $${round(hw * (n + 0.5), 4)}^2/(4\times${De}) = ${round((hw * (n + 0.5)) ** 2 / (4 * De), 4)}$ eV, so $E_${n} = ${round(ans, 4)}$ eV.` : R`$E_{n+1} - E_n = \hbar\omega - \dfrac{(\hbar\omega)^2(n + 1)}{2D_e} = ${hw} - \dfrac{${hw}^2\times${n + 1}}{${2 * De}} = ${round(ans, 4)}$ eV. The gaps shrink linearly with $n$.`,
          trap: R`Dropping the anharmonic term gives equally spaced levels.` };
      },
      verify: (p) => { const E = (k) => p.hw * (k + 0.5) - (p.hw * (k + 0.5)) ** 2 / (4 * p.De); return p.ask === 'level' ? E(p.n) : E(p.n + 1) - E(p.n); } },
    { id: 'qvw-r4g2', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'hydrogen',
      make(r) {
        const eps = choose(r, [8, 10, 11.7, 12.9, 13.1, 16]), mu = choose(r, [0.05, 0.06, 0.08, 0.1, 0.15, 0.2]), ask = choose(r, ['E', 'b']);
        const E = RY * mu / (eps * eps) * 1000, b = A0 * eps / mu, ans = ask === 'E' ? E : b;
        return { q: R`An exciton is treated as hydrogen with reduced mass $${mu}\,m_e$ in a medium of dielectric constant $${eps}$. The trial function $e^{-r/b}$ gives $\langle H\rangle(b) = \dfrac{\hbar^2}{2\mu b^2} - \dfrac{e^2}{4\pi\varepsilon_0\varepsilon_rb}$. ${ask === 'E' ? 'The binding energy (minus the minimum of $\\langle H\\rangle$) is ______ meV' : 'The optimal $b$ is ______ nm'} (three significant figures). Use $13.606$ eV and $a_0 = 0.05292$ nm for hydrogen.`,
          answer: +ans.toPrecision(3), tol: +(ans * 0.01).toPrecision(2), eps, mu, ask,
          sol: R`For $A/b^2 - B/b$ the minimum is at $b = 2A/B$ with value $-B^2/4A$. Scaling hydrogen: $b = a_0\varepsilon_r(m_e/\mu) = 0.05292\times${eps}/${mu} = ${+b.toPrecision(3)}$ nm and binding energy $13.606\,\dfrac{\mu/m_e}{\varepsilon_r^2}$ eV $= ${+E.toPrecision(3)}$ meV.`,
          trap: R`The energy scales as $1/\varepsilon_r^2$ but the size as $\varepsilon_r$.` };
      },
      verify: (p) => (p.ask === 'E' ? RY * p.mu / p.eps ** 2 * 1000 : A0 * p.eps / p.mu) },
    { id: 'qvw-r4g3', type: 'nat', level: 4, exams: ['net', 'gate'], sub: 'wkb quantisation',
      make(r) {
        const lam = choose(r, [6, 10, 15, 20, 30, 40, 50, 70, 90, 120, 150]), ask = choose(r, ['count', 'E0']);
        const s = Math.sqrt(lam), count = Math.floor(s - 0.5) + 1, E0 = -((s - 0.5) ** 2), ans = ask === 'count' ? count : E0;
        return { q: R`For $V = -V_0\,\mathrm{sech}^2(x/a)$ with $2mV_0a^2/\hbar^2 = ${lam}$, WKB gives $\dfrac{a\sqrt{2m|E_n|}}{\hbar} = \sqrt{2mV_0a^2/\hbar^2} - (n + \tfrac12)$. ${ask === 'count' ? 'The number of bound states it predicts is ______.' : 'Its ground-state energy, in units of $\\hbar^2/2ma^2$, is ______ (two decimal places).'}`,
          answer: ask === 'count' ? count : round(E0, 2), tol: ask === 'count' ? 0 : Math.max(0.02, round(Math.abs(E0) * 0.002, 2)), lam, ask,
          sol: R`$\sqrt{${lam}} = ${round(s, 4)}$. ${ask === 'count' ? `Levels are bound while $${round(s, 4)} - (n + \\tfrac12) > 0$, i.e. $n \\le ${count - 1}$: ${count} states.` : `For $n = 0$: $a\\sqrt{2m|E_0|}/\\hbar = ${round(s - 0.5, 4)}$, so $E_0 = -${round(s - 0.5, 4)}^2 = ${round(E0, 2)}$ in units of $\\hbar^2/2ma^2$.`} (The exact result replaces $\sqrt{\lambda} - \tfrac12$ by $s$ with $s(s + 1) = \lambda$, almost the same.)`,
          trap: R`Forgetting the $\tfrac12$ (the Maslov term from two soft turning points).` };
      },
      verify: (p) => { const s = Math.sqrt(p.lam); return p.ask === 'count' ? Math.floor(s - 0.5) + 1 : -((s - 0.5) ** 2); } },
  ],
};
