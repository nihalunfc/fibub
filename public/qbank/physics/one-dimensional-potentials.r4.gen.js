// Round 4 extras for one-dimensional-potentials: original questions, written 2026-11-22.
import { int, choose, round } from '../_util.js';
const R = String.raw;
const E1NM = 0.0381 * Math.PI ** 2; // ground energy of an electron in a 1 nm infinite well, eV
const H_EVFS = 4.1357; // h in eV fs
const rootZ = (z0) => { let lo = 1e-9, hi = Math.min(z0, Math.PI / 2 - 1e-9); for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (m * Math.tan(m) - Math.sqrt(z0 * z0 - m * m) > 0) hi = m; else lo = m; } return lo; };
const fr = { 0: '0', 0.25: 'L/4', [1 / 3]: 'L/3', 0.5: 'L/2', [2 / 3]: '2L/3', 0.75: '3L/4', 1: 'L' };

export default {
  items: [
    { id: 'q1d-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'infinite well',
      q: R`The width of an infinite square well is doubled. Every energy level`,
      options: [R`is divided by 4`, R`is halved`, R`is unchanged`, R`is doubled`], answer: 0,
      sol: R`$E_n = \dfrac{n^2\pi^2\hbar^2}{2mL^2}$, so $L \to 2L$ divides every level by 4. A wider box allows longer wavelengths, hence smaller momenta and kinetic energies.`,
      trap: R`The energy goes as $1/L^2$, not $1/L$.` },
    { id: 'q1d-r4-02', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'infinite well',
      q: R`A particle is in the ground state of an infinite well $0 < x < L$. The probability of finding it in the middle third, $L/3 < x < 2L/3$, is ______ (three decimal places).`,
      answer: 0.609, tol: 0.002, calc: () => 1 / 3 + Math.sqrt(3) / (2 * Math.PI),
      sol: R`$P = \dfrac2L\int_{L/3}^{2L/3}\sin^2\dfrac{\pi x}{L}dx = \left[\dfrac xL - \dfrac{1}{2\pi}\sin\dfrac{2\pi x}{L}\right]_{L/3}^{2L/3} = \dfrac13 - \dfrac{1}{2\pi}\left(\sin\dfrac{4\pi}{3} - \sin\dfrac{2\pi}{3}\right) = \dfrac13 + \dfrac{\sqrt3}{2\pi} = 0.609$. The ground state piles up in the middle, well above the classical $\tfrac13$.`,
      trap: R`Answering $\tfrac13$, the classical value for a particle bouncing at constant speed.` },
    { id: 'q1d-r4-03', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'steps',
      q: R`An electron with energy $1.0$ eV below the top of a high potential step enters the step region. The distance over which $|\psi|^2$ falls by a factor $e$ is about ($\hbar^2/2m_e = 0.0381$ eV nm$^2$)`,
      options: [R`0.39 nm`, R`0.098 nm`, R`0.195 nm`, R`1.95 nm`], answer: 1,
      sol: R`Inside, $\psi \propto e^{-\kappa x}$ with $\kappa = \sqrt{2m(V_0 - E)}/\hbar = \sqrt{1.0/0.0381}$ nm$^{-1} = 5.12$ nm$^{-1}$. Then $|\psi|^2 \propto e^{-2\kappa x}$ falls by $e$ over $1/2\kappa = 0.098$ nm. The amplitude itself falls by $e$ over $1/\kappa = 0.195$ nm.`,
      trap: R`$1/\kappa = 0.195$ nm is the decay length of $\psi$, not of the probability density $|\psi|^2$.` },
    { id: 'q1d-r4-04', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'steps',
      q: R`Particles with energy $E = \tfrac43V_0$ meet a potential step that rises from $0$ to $V_0$. The reflection probability is ______ (three decimal places).`,
      answer: 0.111, tol: 0.002, calc: () => ((1 - 0.5) / 1.5) ** 2,
      sol: R`$k_1 \propto \sqrt E$ and $k_2 \propto \sqrt{E - V_0}$, so $k_2/k_1 = \sqrt{(4/3 - 1)/(4/3)} = \sqrt{1/4} = \tfrac12$. $R = \left(\dfrac{k_1 - k_2}{k_1 + k_2}\right)^2 = \left(\dfrac{1 - 1/2}{1 + 1/2}\right)^2 = \dfrac19 = 0.111$. Classically every particle would pass.`,
      trap: R`Taking $T = |C/A|^2 = (2k_1/(k_1 + k_2))^2$ without the velocity factor $k_2/k_1$ gives $T > 1$, a sign the current was not used.` },
    { id: 'q1d-r4-05', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'infinite well',
      q: R`A particle in an infinite well is in $(\psi_1 + \psi_2)/\sqrt2$, where $E_1$ is the ground energy. Its mean position $\langle x\rangle$ oscillates with period`,
      options: [R`$h/E_1$`, R`$h/2E_1$`, R`$h/3E_1$`, R`$h/4E_1$`], answer: 2,
      sol: R`$\langle x\rangle(t)$ contains the cross term $\cos[(E_2 - E_1)t/\hbar]$. With $E_2 = 4E_1$ the angular frequency is $3E_1/\hbar$, so the period is $\dfrac{2\pi\hbar}{3E_1} = \dfrac{h}{3E_1}$.`,
      trap: R`Using $E_2$ alone ($h/4E_1$) or $E_1$ alone; only energy differences show up in observables.` },
    { id: 'q1d-r4-06', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'linear potentials', format: 'statements',
      q: R`A particle moves in the "triangular" well $V = Fx$ for $x > 0$ ($F > 0$) with an impenetrable wall at $x = 0$. With $\ell = (\hbar^2/2mF)^{1/3}$, which statements are correct?`,
      options: [R`The eigenfunctions are $\psi \propto \mathrm{Ai}\!\left(\dfrac{x - E/F}{\ell}\right)$ for $x > 0$`, R`All energies scale as $F^{2/3}$`, R`The levels are equally spaced`, R`$E_n = -a_n\left(\dfrac{\hbar^2F^2}{2m}\right)^{1/3}$, where $a_n < 0$ are the zeros of $\mathrm{Ai}$ ($a_1 = -2.338$)`], answer: [0, 1, 3],
      sol: R`With $u = (x - E/F)/\ell$ the Schrödinger equation becomes Airy's equation $\psi'' = u\psi$; the solution that decays at large $x$ is $\mathrm{Ai}(u)$. The wall needs $\mathrm{Ai}(-E/F\ell) = 0$, so $E_n = -a_nF\ell = -a_n(\hbar^2F^2/2m)^{1/3}$, which scales as $F^{2/3}$. The zeros $-2.338, -4.088, -5.521, \dots$ get closer together, so the levels are not equally spaced (spacing shrinks like $n^{-1/3}$).`,
      trap: R`Equal spacing belongs to the quadratic potential; for a linear one the spacing decreases.` },
    { id: 'q1d-r4-07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'finite well',
      q: R`A finite square well has $z_0 = \tfrac a2\sqrt{2mV_0}/\hbar = 2$. Its ground state satisfies $z\tan z = \sqrt{z_0^2 - z^2}$ with $z = \tfrac a2\sqrt{2m(E + V_0)}/\hbar$ (energy $E$ measured from the top of the well). The ground-state energy measured from the bottom of the well is ______ $V_0$ (three decimal places).`,
      answer: 0.265, tol: 0.003, calc: () => (rootZ(2) / 2) ** 2,
      sol: R`Solve $f(z) = z\tan z - \sqrt{4 - z^2} = 0$ on $(0, \pi/2)$: $f(1.00) = 1.557 - 1.732 = -0.17$, $f(1.05) = 1.83 - 1.71 = +0.12$, and bisecting gives $z = 1.030$. Energy above the bottom: $E + V_0 = (z/z_0)^2V_0 = (1.030/2)^2V_0 = 0.265V_0$. An infinite well of the same width would give $(\pi/2z_0)^2V_0 = 0.617V_0$: leaking into the walls lowers the energy a lot.`,
      trap: R`Reporting $z/z_0$ (0.515) instead of its square.` },
    { id: 'q1d-r4-08', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'delta potentials',
      q: R`An electron moves in $V = \infty$ for $x < 0$ and $V = -\alpha\,\delta(x - a)$ for $x > 0$, with $\alpha = 0.381$ eV nm. A bound state exists only if $a$ exceeds ______ nm (three decimal places). Use $\hbar^2/2m_e = 0.0381$ eV nm$^2$.`,
      answer: 0.1, tol: 0.002, calc: () => 0.0381 / 0.381,
      sol: R`For $E = -\hbar^2\kappa^2/2m$: $\psi = A\sinh\kappa x$ for $0 < x < a$ (zero at the wall) and $Be^{-\kappa x}$ beyond. The delta makes $\psi'$ jump: $\psi'(a^+) - \psi'(a^-) = -g\psi(a)$ with $g = 2m\alpha/\hbar^2$. Dividing by $\psi(a)$: $-\kappa - \kappa\coth\kappa a = -g$, so $\kappa(1 + \coth\kappa a) = g$. The left side rises from $1/a$ (as $\kappa \to 0$) upward, so a root exists only if $g > 1/a$, i.e. $a > \dfrac{\hbar^2}{2m\alpha} = \dfrac{0.0381}{0.381} = 0.100$ nm. The wall's image (an odd state of a double delta) explains why a free delta always binds but this one may not.`,
      trap: R`A lone attractive delta always has a bound state; the hard wall forces a node and can remove it.` },
    { id: 'q1d-r4-09', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'infinite well',
      q: R`Any state of a particle in an infinite well (ground energy $E_1$) is left to evolve. After what time is the wavefunction certainly back to its initial form (up to a global phase)?`,
      options: [R`$h/2E_1$`, R`$h/E_1$`, R`$2h/E_1$`, R`it never returns`], answer: 1,
      sol: R`$\psi(t) = \sum_nc_n\psi_ne^{-in^2E_1t/\hbar}$. All phases equal 1 again when $E_1t/\hbar = 2\pi$, i.e. $t = 2\pi\hbar/E_1 = h/E_1$, because every $n^2$ is an integer. This is a quantum revival. (At $t = h/2E_1$, $e^{-i\pi n^2} = (-1)^n$, which reflects the state about the centre rather than restoring it.)`,
      trap: R`A classical particle has a period that depends on its speed; the quantum revival time does not depend on the state.` },
    { id: 'q1d-r4-10', type: 'mcq', level: 5, exams: ['net', 'gate'], sub: 'steps',
      q: R`Particles with $E > V_0$ meet a smooth step $V = \tfrac12V_0[1 + \tanh(x/d)]$ that rises over a length $d$. Compared with the sharp step ($d = 0$) at the same energy, when $kd \gg 1$ ($k$ is the incoming wavenumber) the reflection probability`,
      options: [R`is the same, since only $V$ far away matters`, R`is larger, because the step is wider`, R`is exactly zero`, R`becomes exponentially small in $kd$`], answer: 3,
      sol: R`Reflection needs the potential to change appreciably within a wavelength. When the step is smooth on the scale of $1/k$, the WKB wave follows it adiabatically and the reflected amplitude is exponentially small (for the tanh step $R = \left[\dfrac{\sinh(\pi d(k_1 - k_2)/2)}{\sinh(\pi d(k_1 + k_2)/2)}\right]^2 \approx e^{-2\pi k_2d}$, with $k_2$ the wavenumber on the high side). The sharp-step formula $R = ((k_1 - k_2)/(k_1 + k_2))^2$ is the opposite limit, $kd \ll 1$. It is never exactly zero for finite $d$.`,
      trap: R`Assuming reflection depends only on the asymptotic values of $V$; that is true only for a step much sharper than the wavelength.` },
    { id: 'q1d-r4-11', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'steps',
      q: R`Particles with $E < V_0$ meet a potential step of height $V_0$. Which statement is NOT correct?`,
      options: [R`All of them are reflected: $R = 1$`, R`$\psi$ is non-zero inside the step, decaying as $e^{-\kappa x}$`, R`A net probability current flows into the step region`, R`The reflected wave is phase-shifted relative to the incident wave`], answer: 2,
      sol: R`Inside, $\psi = Ce^{-\kappa x}$ with a constant phase, so $j = \tfrac{\hbar}{m}\mathrm{Im}(\psi^*\psi') = 0$: no current flows in, and $R = 1$. The particle still has a non-zero probability of being found in the step. Matching at $x = 0$ gives $B/A = (k - i\kappa)/(k + i\kappa)$, a pure phase (modulus 1, not 1 or $-1$ in general).`,
      trap: R`Non-zero probability density in a region does not mean probability flows through it.` },
    { id: 'q1d-r4-12', type: 'msq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'matching conditions',
      q: R`At a point where $V(x)$ has a finite jump (a step), which quantities must be continuous for a stationary state?`,
      options: [R`$\psi$`, R`$\psi'$`, R`$\psi''$`, R`the probability current $j$`], answer: [0, 1, 3],
      sol: R`Integrating $\psi'' = \tfrac{2m}{\hbar^2}(V - E)\psi$ across the jump over a vanishing width gives zero for a finite $V$, so $\psi'$ is continuous; $\psi$ is continuous too. Then $j \propto \mathrm{Im}(\psi^*\psi')$ is continuous. But $\psi''$ is proportional to $(V - E)\psi$, which jumps with $V$.`,
      trap: R`$\psi'$ jumps only at a delta function (infinite spike) or fails at an infinite wall; a finite step keeps it continuous.` },
  ],
  gens: [
    { id: 'q1d-r4g1', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'steps',
      make(r) {
        const ratio = choose(r, [1.1, 1.2, 1.25, 1.5, 2, 3, 4, 5]), ask = choose(r, ['R', 'T']);
        const s = Math.sqrt(1 - 1 / ratio), Rr = ((1 - s) / (1 + s)) ** 2, ans = ask === 'R' ? Rr : 1 - Rr;
        return { q: R`Particles with energy $E = ${ratio}V_0$ meet a potential step rising from $0$ to $V_0$. The ${ask === 'R' ? 'reflection' : 'transmission'} probability is ______ (three decimal places).`,
          answer: round(ans, 3), tol: 0.002, ratio, ask,
          sol: R`$k_2/k_1 = \sqrt{(E - V_0)/E} = \sqrt{1 - 1/${ratio}} = ${round(s, 4)}$. $R = \left(\dfrac{1 - k_2/k_1}{1 + k_2/k_1}\right)^2 = ${round(Rr, 4)}$ and $T = \dfrac{4k_1k_2}{(k_1 + k_2)^2} = 1 - R = ${round(1 - Rr, 4)}$. The answer is $${round(ans, 3)}$.`,
          trap: R`The transmitted amplitude squared must be multiplied by $k_2/k_1$ (the speed ratio) to get $T$.` };
      },
      verify: (p) => { const s = Math.sqrt(1 - 1 / p.ratio), Rr = ((1 - s) / (1 + s)) ** 2; return p.ask === 'R' ? Rr : 1 - Rr; } },
    { id: 'q1d-r4g2', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'infinite well',
      make(r) {
        const n = int(r, 1, 4);
        const [u1, u2] = choose(r, [[0, 0.25], [0, 1 / 3], [0.25, 0.5], [0.25, 0.75], [1 / 3, 2 / 3], [0, 0.5], [0.5, 0.75], [1 / 3, 0.5]]);
        const F = (u) => u - Math.sin(2 * n * Math.PI * u) / (2 * n * Math.PI), ans = F(u2) - F(u1);
        return { q: R`A particle is in the state $n = ${n}$ of an infinite well $0 < x < L$. The probability of finding it between $x = ${fr[u1]}$ and $x = ${fr[u2]}$ is ______ (three decimal places).`,
          answer: round(ans, 3), tol: 0.002, n, u1, u2,
          sol: R`$P = \dfrac2L\int\sin^2\dfrac{${n}\pi x}{L}dx = \left[u - \dfrac{\sin(${2 * n}\pi u)}{${2 * n}\pi}\right]$ evaluated between $u = x/L = ${round(u1, 4)}$ and $${round(u2, 4)}$. This gives $${round(F(u2), 4)} - ${round(F(u1), 4)} = ${round(ans, 3)}$.`,
          trap: R`Using the classical answer (the length fraction $${round(u2 - u1, 3)}$) ignores the nodes and peaks of $|\psi_n|^2$.` };
      },
      verify: (p) => { const F = (u) => u - Math.sin(2 * p.n * Math.PI * u) / (2 * p.n * Math.PI); return F(p.u2) - F(p.u1); } },
    { id: 'q1d-r4g3', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'infinite well',
      make(r) {
        const L = choose(r, [0.5, 1, 1.5, 2, 3, 5]), [n, m] = choose(r, [[1, 2], [1, 3], [2, 3], [1, 4], [2, 4], [3, 4]]);
        const dE = (m * m - n * n) * E1NM / (L * L), ans = H_EVFS / dE;
        return { q: R`An electron in an infinite well of width $${L}$ nm is in $(\psi_${n} + \psi_${m})/\sqrt2$. The period of the oscillation of $|\psi(x, t)|^2$ is ______ fs (three significant figures). Use $\hbar^2/2m_e = 0.0381$ eV nm$^2$ and $h = 4.1357$ eV fs.`,
          answer: +ans.toPrecision(3), tol: +(ans * 0.01).toPrecision(2), L, n, m,
          sol: R`$E_1 = \dfrac{\pi^2\hbar^2}{2mL^2} = \dfrac{0.0381\pi^2}{${L}^2} = ${round(E1NM / (L * L), 4)}$ eV and $E_n = n^2E_1$. The density oscillates at $(E_${m} - E_${n})/\hbar$ with $E_${m} - E_${n} = ${m * m - n * n}E_1 = ${round(dE, 4)}$ eV, so the period is $h/(E_${m} - E_${n}) = ${+ans.toPrecision(3)}$ fs.`,
          trap: R`Using $\hbar$ instead of $h$ gives a value $2\pi$ too small.` };
      },
      verify: (p) => H_EVFS / ((p.m ** 2 - p.n ** 2) * E1NM / p.L ** 2) },
  ],
};
