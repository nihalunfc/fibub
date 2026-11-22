// Round 4 extras for fluctuations-brownian: original questions, written 2026-11-22.
import { choose, C } from '../_util.js';
const R = String.raw;
const KT300 = C.kB * 300;
const oscVar = (t) => { const x = 1 / t; return Math.exp(x) / (Math.exp(x) - 1) ** 2; };
const sig3 = (x) => +x.toPrecision(3);

export default {
  items: [
    { id: 'netfb-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'energy fluctuations',
      q: R`For a system of $N$ weakly interacting particles in contact with a heat bath, the relative energy fluctuation $\Delta E/\langle E\rangle$`,
      options: [R`grows like $\sqrt N$`, R`falls like $1/N$`, R`falls like $1/\sqrt N$`, R`does not depend on $N$`], answer: 2,
      sol: R`$\langle(\Delta E)^2\rangle = kT^2C_V$ and both $C_V$ and $\langle E\rangle$ are proportional to $N$. So $\Delta E \propto \sqrt N$ and $\Delta E/\langle E\rangle \propto 1/\sqrt N$. For $N \sim 10^{23}$ this is about $10^{-12}$, which is why canonical and microcanonical ensembles agree for large systems.`,
      trap: R`The absolute spread grows with $N$; only the relative spread shrinks.` },
    { id: 'netfb-r4-02', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Johnson noise',
      q: R`The Johnson-Nyquist voltage noise of a resistor at $300$ K has the flat spectrum $4kTR$ only up to a frequency where quantum effects cut it off. That frequency is about`,
      options: [R`6 THz`, R`6 MHz`, R`6 GHz`, R`60 Hz`], answer: 0,
      sol: R`Each mode carries the Planck energy $\dfrac{hf}{e^{hf/kT} - 1}$ instead of $kT$; the two agree only while $hf \ll kT$. The cut-off is at $f \sim kT/h = \dfrac{1.38\times10^{-23}\times300}{6.63\times10^{-34}} = 6\times10^{12}$ Hz. Electronics never reaches it at room temperature, but at millikelvin temperatures it falls into the GHz range used by quantum circuits.`,
      trap: R`The noise is white for all practical electronics, but not to infinite frequency (that would give infinite power).` },
    { id: 'netfb-r4-03', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'equipartition fluctuations',
      q: R`A sphere of radius $1.0\ \mu$m and density $1000$ kg/m$^3$ is in water at $300$ K. Its rms velocity along one axis is ______ mm/s (two decimal places). Use $k = 1.381\times10^{-23}$ J/K.`,
      answer: 0.99, tol: 0.01, unit: 'mm/s', calc: () => Math.sqrt(KT300 / (4 / 3 * Math.PI * 1e-18 * 1000)) * 1000,
      sol: R`Equipartition: $\tfrac12m\langle v_x^2\rangle = \tfrac12kT$. $m = \tfrac43\pi(10^{-6})^3\times1000 = 4.19\times10^{-15}$ kg, so $v_{\rm rms} = \sqrt{kT/m} = \sqrt{4.14\times10^{-21}/4.19\times10^{-15}} = 9.9\times10^{-4}$ m/s $= 0.99$ mm/s. This speed lasts only about $m/6\pi\eta a \approx 0.2\ \mu$s before friction randomises it, so the observed motion is the slow diffusive drift, not this speed.`,
      trap: R`Using $3kT$ (all three components) or forgetting the cube of the radius.` },
    { id: 'netfb-r4-04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'number fluctuations',
      q: R`A single-particle state of an ideal Bose gas has mean occupation $\langle n\rangle = 2$. The relative fluctuation $\Delta n/\langle n\rangle$ of its occupation is ______ (three decimal places).`,
      answer: 1.225, tol: 0.003, calc: () => Math.sqrt(2 * 3) / 2,
      sol: R`For one bosonic mode, $P(n) \propto e^{-n x}$ (geometric), which gives $\langle(\Delta n)^2\rangle = \langle n\rangle(1 + \langle n\rangle) = 2\times3 = 6$. So $\Delta n/\langle n\rangle = \sqrt6/2 = 1.225$: larger than 1, the "bunching" of bosons. A fermion mode has $\langle n\rangle(1 - \langle n\rangle)$ and a classical (Poisson) one $\langle n\rangle$.`,
      trap: R`Using the Poisson value $\sqrt{\langle n\rangle}$, which holds only when $\langle n\rangle \ll 1$.` },
    { id: 'netfb-r4-05', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'velocity autocorrelation', format: 'statements',
      q: R`The velocity of a free Brownian particle obeying $m\dot v = -\gamma v + F(t)$ with white-noise $F$ (an Ornstein-Uhlenbeck process). In equilibrium, which statements are correct?`,
      options: [R`It is a stationary Gaussian process`, R`It is Markovian: its future depends only on the present velocity`, R`Its correlation time is $m/\gamma$`, R`Its variance $\langle v^2\rangle$ grows linearly with time forever`], answer: [0, 1, 2],
      sol: R`A linear equation driven by Gaussian white noise gives a Gaussian process; in equilibrium its statistics do not change in time, with $\langle v^2\rangle = kT/m$ fixed. White noise has no memory, so the first-order equation makes $v$ Markovian. $\langle v(0)v(t)\rangle = \dfrac{kT}{m}e^{-\gamma t/m}$, so the correlation time is $m/\gamma$. It is the position, not the velocity, whose variance grows linearly.`,
      trap: R`Confusing the velocity (bounded variance) with the position (diffusing).` },
    { id: 'netfb-r4-06', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'activated escape',
      q: R`In Kramers' theory of escape over a barrier, in the strongly overdamped (high-friction) regime the escape rate`,
      options: [R`grows linearly with the friction $\gamma$`, R`does not depend on $\gamma$`, R`is proportional to $e^{-\gamma}$`, R`is proportional to $1/\gamma$`], answer: 3,
      sol: R`High friction makes the motion over the barrier top diffusive, with $D = kT/\gamma$. Kramers' result is $k = \dfrac{\omega_a\omega_b}{2\pi\gamma/m}e^{-\Delta U/kT}$, proportional to $1/\gamma$. At very low friction the rate is limited by energy supply and grows with $\gamma$; in between it peaks (the Kramers turnover). The Arrhenius factor $e^{-\Delta U/kT}$ is the same in all regimes.`,
      trap: R`Transition-state theory ignores friction; it is the upper limit near the turnover, not the overdamped answer.` },
    { id: 'netfb-r4-07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'first passage',
      q: R`A particle with $D = 1.0\times10^{-12}$ m$^2$/s starts at a reflecting wall at $x = 0$ and diffuses along $x$ until it first reaches $x = L = 10\ \mu$m, where it is absorbed. Its mean first-passage time is ______ s.`,
      answer: 50, tol: 0.5, unit: 's', calc: () => (10e-6) ** 2 / (2 * 1e-12),
      sol: R`The mean first-passage time $T(x)$ from position $x$ obeys $DT'' = -1$ with $T'(0) = 0$ (reflecting) and $T(L) = 0$ (absorbing). So $T(x) = \dfrac{L^2 - x^2}{2D}$, and from the wall $T = \dfrac{L^2}{2D} = \dfrac{10^{-10}}{2\times10^{-12}} = 50$ s. It matches the scaling $\langle x^2\rangle = 2Dt$ but the exact factor needs this equation.`,
      trap: R`Setting $2Dt = L^2$ happens to agree here, but it is not a derivation: starting at $x \ne 0$ the time is $(L^2 - x^2)/2D$, and in 3D the factors change.` },
    { id: 'netfb-r4-08', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'Johnson noise',
      q: R`An inductor $L$ is part of a circuit in equilibrium at temperature $T$. The mean square thermal current through it is`,
      options: [R`$kT/2L$`, R`$kT/L$`, R`$\sqrt{kTL}$`, R`$kTL$`], answer: 1,
      sol: R`The magnetic energy $\tfrac12LI^2$ is quadratic in one variable, so equipartition gives $\tfrac12L\langle I^2\rangle = \tfrac12kT$ and $\langle I^2\rangle = kT/L$, whatever the resistors. This is the twin of $\langle V^2\rangle = kT/C$ for a capacitor.`,
      trap: R`Dropping the $\tfrac12$ on only one side gives $kT/2L$.` },
    { id: 'netfb-r4-09', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'velocity autocorrelation',
      q: R`A Brownian particle has $\langle v_x^2\rangle^{1/2} = 1.0$ mm/s and velocity autocorrelation $\langle v_x(0)v_x(t)\rangle = \langle v_x^2\rangle e^{-t/\tau}$ with $\tau = 0.10\ \mu$s. Using $D = \int_0^\infty\langle v_x(0)v_x(t)\rangle\,dt$ (Green-Kubo), its diffusion constant is`,
      options: [R`$1.0\times10^{-13}$ m$^2$/s`, R`$2.0\times10^{-13}$ m$^2$/s`, R`$1.0\times10^{-7}$ m$^2$/s`, R`$5.0\times10^{-14}$ m$^2$/s`], answer: 0,
      sol: R`$D = \langle v_x^2\rangle\tau = (10^{-3})^2\times10^{-7} = 1.0\times10^{-13}$ m$^2$/s. With $\langle v^2\rangle = kT/m$ and $\tau = m/\gamma$ this is the Einstein relation $D = kT/\gamma$. The mass cancels: diffusion does not depend on inertia.`,
      trap: R`Doubling the integral (as if from $-\infty$ to $\infty$) gives $2\times10^{-13}$; that is $\langle x^2\rangle/t$, not $D$.` },
    { id: 'netfb-r4-10', type: 'mcq', level: 5, exams: ['net', 'gate'], sub: 'fluctuation theorems',
      q: R`Crooks' theorem relates the work distributions of a forward protocol and its time reverse: $P_F(W)/P_R(-W) = e^{(W - \Delta F)/kT}$. Plotted on the same axis ($P_F(W)$ and $P_R(-W)$), the two curves cross`,
      options: [R`at $W = 0$`, R`at the mean forward work $\langle W\rangle_F$`, R`at $W = \Delta F$`, R`nowhere: the curves never cross`], answer: 2,
      sol: R`The ratio is 1 exactly when $W = \Delta F$, so the curves cross there. This is used in single-molecule pulling experiments to measure free-energy differences from irreversible work data. Since $\langle W\rangle_F \ge \Delta F$ (second law), the crossing lies below the forward mean; integrating Crooks' relation gives Jarzynski's $\langle e^{-W/kT}\rangle = e^{-\Delta F/kT}$.`,
      trap: R`Taking the mean work as the free-energy change; it overestimates by the dissipated work.` },
    { id: 'netfb-r4-11', type: 'nat', level: 5, exams: ['net', 'gate'], sub: 'energy fluctuations',
      q: R`A quantum harmonic oscillator is in equilibrium at $kT = \hbar\omega$. Its energy variance $\langle(\Delta E)^2\rangle$ is ______ $(\hbar\omega)^2$ (three decimal places).`,
      answer: 0.921, tol: 0.003, calc: () => oscVar(1),
      sol: R`$\langle(\Delta E)^2\rangle = kT^2C_V$, or directly: $E = \hbar\omega(n + \tfrac12)$ with geometric $P(n)$, so $\langle(\Delta E)^2\rangle = (\hbar\omega)^2\langle n\rangle(\langle n\rangle + 1) = (\hbar\omega)^2\dfrac{e^x}{(e^x - 1)^2}$ with $x = \hbar\omega/kT = 1$. That is $2.718/1.718^2 = 0.921$. The classical value would be $(kT)^2 = 1$.`,
      trap: R`The zero-point energy shifts $E$ but not its variance.` },
    { id: 'netfb-r4-12', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'shot noise', format: 'statements',
      q: R`Which noise spectra are flat (white) at low frequencies?`,
      options: [R`Johnson noise of a resistor`, R`Shot noise of a current of independent electrons`, R`Flicker ($1/f$) noise`, R`The thermal voltage across a capacitor $C$ fed by a resistor $R$, at frequencies far above $1/RC$`], answer: [0, 1],
      sol: R`Johnson noise ($4kTR$ per hertz) and shot noise ($2eI$ per hertz) come from uncorrelated events on short time scales, so they are white up to very high frequencies. Flicker noise grows at low frequency as $1/f$. The capacitor voltage is Johnson noise filtered by the $RC$ low-pass: flat below $1/RC$, falling as $1/f^2$ above.`,
      trap: R`Total capacitor noise $kT/C$ is finite precisely because the spectrum is cut off above $1/RC$.` },
  ],
  gens: [
    { id: 'netfb-r4g1', type: 'nat', level: 4, exams: ['net', 'gate'], sub: 'energy fluctuations',
      make(r) {
        const t = choose(r, [0.25, 0.5, 1, 2, 3, 5]), ans = oscVar(t);
        return { q: R`A quantum harmonic oscillator is in equilibrium at $kT = ${t}\,\hbar\omega$. Its energy variance $\langle(\Delta E)^2\rangle$ is ______ $(\hbar\omega)^2$ (three significant figures).`,
          answer: sig3(ans), tol: sig3(ans * 0.01), t,
          sol: R`With $x = \hbar\omega/kT = ${sig3(1 / t)}$: $\langle(\Delta E)^2\rangle = (\hbar\omega)^2\dfrac{e^x}{(e^x - 1)^2} = ${sig3(ans)}(\hbar\omega)^2$. Compare the classical $(kT)^2 = ${t * t}(\hbar\omega)^2$: the quantum value is smaller, and approaches it as $kT \gg \hbar\omega$ (it equals $(kT)^2 - (\hbar\omega)^2/12 + \dots$).`,
          trap: R`Including the zero-point energy in the variance; a constant shift does not fluctuate.` };
      },
      verify: (p) => oscVar(p.t) },
    { id: 'netfb-r4g2', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'first passage',
      make(r) {
        const [D, Dt] = choose(r, [[1e-9, '1.0\\times10^{-9}'], [1e-11, '1.0\\times10^{-11}'], [1e-12, '1.0\\times10^{-12}'], [4.4e-13, '4.4\\times10^{-13}']]);
        const L = choose(r, [1, 2, 5, 10, 20]), ans = (L * 1e-6) ** 2 / (2 * D);
        return { q: R`A particle with $D = ${Dt}$ m$^2$/s starts at a reflecting wall at $x = 0$ and diffuses along $x$. Its mean time to first reach $x = ${L}\ \mu$m (where it is absorbed) is ______ s (three significant figures).`,
          answer: sig3(ans), tol: sig3(ans * 0.01), D, L,
          sol: R`$T(x)$ solves $DT'' = -1$ with $T'(0) = 0$ and $T(L) = 0$, so $T(0) = \dfrac{L^2}{2D} = \dfrac{(${L}\times10^{-6})^2}{2\times${Dt}} = ${sig3(ans)}$ s. Doubling the distance takes four times as long.`,
          trap: R`Using $L^2/D$ or $L^2/6D$ (the 3D formula) instead of solving the 1D problem.` };
      },
      verify: (p) => (p.L * 1e-6) ** 2 / (2 * p.D) },
    { id: 'netfb-r4g3', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Johnson noise',
      make(r) {
        const [Lh, Lt] = choose(r, [[1e-9, '1 nH'], [1e-8, '10 nH'], [1e-6, '1 $\\mu$H'], [1e-4, '100 $\\mu$H'], [1e-3, '1 mH']]);
        const T = choose(r, [4.2, 77, 300]), ans = Math.sqrt(C.kB * T / Lh) * 1e9;
        return { q: R`An inductor of ${Lt} is part of a circuit in equilibrium at $${T}$ K. The rms thermal current through it is ______ nA (three significant figures). Use $k = 1.381\times10^{-23}$ J/K.`,
          answer: sig3(ans), tol: sig3(ans * 0.01), Lh, T,
          sol: R`Equipartition for the magnetic energy: $\tfrac12L\langle I^2\rangle = \tfrac12kT$, so $I_{\rm rms} = \sqrt{kT/L} = \sqrt{\dfrac{1.381\times10^{-23}\times${T}}{${Lh.toExponential(0).replace(/e([-+]\d+)/, '\\times10^{$1}')}}}$ A $= ${sig3(ans)}$ nA. It does not depend on the resistance in the circuit.`,
          trap: R`Expecting the resistance to appear: it sets the noise bandwidth, but the total is fixed by equipartition.` };
      },
      verify: (p) => Math.sqrt(C.kB * p.T / p.Lh) * 1e9 },
  ],
};
