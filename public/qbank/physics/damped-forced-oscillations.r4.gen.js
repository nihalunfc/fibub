// Round 4 extras for damped-forced-oscillations: original questions, written 2026-11-22.
// Convention as in the topic file: m x'' + b x' + k x = F0 cos(wt), beta = b/(2m), w0^2 = k/m, Q = w0/(2 beta).
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;

// Exact ratio of steady-state displacement amplitude at w to that at w0, for quality factor Q.
const ampRatio = (Q, w0, w) => { const b = w0 / (2 * Q); return (2 * b * w0) / Math.sqrt((w0 * w0 - w * w) ** 2 + 4 * b * b * w * w); };

export default {
  items: [
    { id: 'dfo-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'types of damping',
      q: R`An automatic door closer is usually adjusted to be close to critically damped. The main reason is that a critically damped door`,
      options: ['never loses energy', 'swings shut and bounces open a few times, which shows it works', 'returns to the closed position in the shortest time without swinging past it', 'closes at a constant speed'], answer: 2,
      sol: R`Less damping (underdamped) makes the door overshoot and swing back and forth; more damping (overdamped) makes it creep slowly shut. Critical damping, $\beta = \omega_0$, is the boundary: the fastest return to equilibrium with no overshoot. Car suspensions and meter needles are tuned near it for the same reason.`,
      trap: R`Heavier damping is not faster: an overdamped door creeps.` },
    { id: 'dfo-r4-02', type: 'nat', level: 2, exams: ['jam'], sub: 'quality factor',
      q: R`An oscillator with $Q = 200$ and natural frequency 50 Hz stores 0.50 J of energy. To keep its amplitude steady, a drive must feed it an average power of ______ W (three decimal places).`,
      answer: 0.785, tol: 0.003, unit: 'W', calc: () => (2 * Math.PI * 50 * 0.5) / 200,
      sol: R`By definition $Q = \omega_0\dfrac{E}{P_{\rm loss}}$ ($2\pi$ times the energy stored over the energy lost per cycle). So $P = \dfrac{\omega_0E}{Q} = \dfrac{2\pi\times50\times0.5}{200} = 0.785$ W. In the steady state the drive must replace exactly this loss.`,
      trap: R`Using $f$ instead of $\omega_0 = 2\pi f$ gives 0.125 W.` },
    { id: 'dfo-r4-03', type: 'mcq', level: 2, exams: ['jam'], sub: 'logarithmic decrement', format: 'graph',
      q: R`For a lightly damped free oscillator, the natural logarithm of the height of each successive peak is plotted against the time of that peak. The points lie on`,
      options: [R`a straight line of slope $-\beta$`, R`a straight line of slope $-2\beta$`, 'a falling exponential curve', 'a downward parabola'], answer: 0,
      sol: R`The peaks follow the envelope $A_0e^{-\beta t}$, so $\ln A = \ln A_0 - \beta t$: a straight line of slope $-\beta$. Its slope times the period gives the logarithmic decrement $\delta = \beta T_d$. A plot of the log of the energy would have slope $-2\beta$.`,
      trap: R`$-2\beta$ belongs to the energy, which goes as the amplitude squared.` },
    { id: 'dfo-r4-04', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'response curve',
      q: R`A resonator has natural frequency 800 Hz and $Q = 40$. Driven at 805 Hz with the same force amplitude, its steady-state displacement amplitude is ______ times its amplitude when driven at exactly 800 Hz (two decimal places).`,
      answer: 0.89, tol: 0.006, calc: () => ampRatio(40, 2 * Math.PI * 800, 2 * Math.PI * 805),
      sol: R`$A(\omega) = \dfrac{F_0/m}{\sqrt{(\omega_0^2 - \omega^2)^2 + 4\beta^2\omega^2}}$ with $2\beta = \omega_0/Q$. Near resonance, $\omega_0^2 - \omega^2 \approx 2\omega_0(\omega_0 - \omega)$, so $\dfrac{A(\omega)}{A(\omega_0)} \approx \dfrac{1}{\sqrt{1 + (2Q\,\Delta f/f_0)^2}} = \dfrac{1}{\sqrt{1 + (2\times40\times5/800)^2}} = \dfrac{1}{\sqrt{1.25}} = 0.89$. The exact formula gives 0.889.`,
      trap: R`The half-power points are at $\Delta f = f_0/(2Q) = 10$ Hz; 5 Hz off is only halfway there.` },
    { id: 'dfo-r4-05', type: 'msq', level: 3, exams: ['jam'], sub: 'types of damping', format: 'statements',
      q: R`For a free oscillator $m\ddot x + b\dot x + kx = 0$ that is critically damped or overdamped, which statements are correct?`,
      options: ['A critically damped system released from rest away from equilibrium never crosses the equilibrium position', 'An overdamped system can pass through the equilibrium position at most once', 'An overdamped system always settles faster than a critically damped one with the same $k$ and $m$', R`A critically damped system moves as $x = Ae^{-\beta t}\cos\omega_0t$`], answer: [0, 1],
      sol: R`Critical damping: $x = (A + Bt)e^{-\beta t}$. Released from rest at $x_0$: $A = x_0$, $B = \beta x_0$, so $x = x_0(1 + \beta t)e^{-\beta t} > 0$ always. Overdamped: $x = C_1e^{-\lambda_1t} + C_2e^{-\lambda_2t}$, which can vanish at most once (a strong kick towards equilibrium makes it cross once). The slower exponent $\lambda_1 = \beta - \sqrt{\beta^2 - \omega_0^2}$ is smaller than $\omega_0$, so overdamping settles more slowly, not faster. There is no oscillating cosine in either case.`,
      trap: R`"No oscillation" does not mean "no crossing": a hard kick can still carry it once past zero.` },
    { id: 'dfo-r4-06', type: 'nat', level: 3, exams: ['jam'], sub: 'energy decay',
      q: R`A tuning fork vibrates at 440 Hz with $Q = 1000$. After it is struck, the time for its sound level to fall by 60 dB (amplitude to one thousandth) is ______ s (one decimal place).`,
      answer: 5.0, tol: 0.05, unit: 's', calc: () => Math.log(1000) / ((2 * Math.PI * 440) / 2000),
      sol: R`The amplitude decays as $e^{-\beta t}$ with $\beta = \omega_0/(2Q) = 2\pi\times440/2000 = 1.382$ s⁻¹. A fall of 60 dB in intensity is a factor $10^6$ in intensity, $10^3$ in amplitude: $t = \ln1000/\beta = 6.908/1.382 = 5.0$ s.`,
      trap: R`60 dB is a factor $10^6$ in intensity but only $10^3$ in amplitude.` },
    { id: 'dfo-r4-07', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'amplitude resonance',
      q: R`A damped oscillator is driven at various frequencies with the same force amplitude. Its time-averaged kinetic energy in the steady state is largest when the driving frequency is`,
      options: [R`$\sqrt{\omega_0^2 - 2\beta^2}$`, R`$\omega_0$, whatever the damping`, R`$\sqrt{\omega_0^2 - \beta^2}$`, R`$\sqrt{\omega_0^2 + 2\beta^2}$`], answer: 1,
      sol: R`The velocity amplitude is $\omega A = \dfrac{F_0/m}{\sqrt{(\omega_0^2 - \omega^2)^2/\omega^2 + 4\beta^2}}$, largest when $\omega_0^2 - \omega^2 = 0$. So the kinetic energy (and the power absorbed) peaks exactly at $\omega_0$. The displacement amplitude, and with it the potential energy, peaks lower, at $\sqrt{\omega_0^2 - 2\beta^2}$.`,
      trap: R`Displacement resonance and velocity resonance are at different frequencies when there is damping.` },
    { id: 'dfo-r4-08', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'transients',
      q: R`A very lightly damped oscillator with $\omega_0 = 10$ rad/s starts at rest and is driven by $F_0\cos(9t)$. Until the transient dies out, its amplitude swells and shrinks periodically. The period of this swelling is ______ s (two decimal places).`,
      answer: 6.28, tol: 0.01, unit: 's', calc: () => (2 * Math.PI) / (10 - 9),
      sol: R`Starting from rest, the motion is the steady-state response at 9 rad/s plus a free (transient) oscillation at about 10 rad/s, of similar size at first. Two oscillations at nearby frequencies beat: their sum swells and shrinks with period $2\pi/|\omega_0 - \omega| = 2\pi/1 = 6.28$ s. As the free part decays, the beats fade and only the steady response is left.`,
      trap: R`$2\pi/\omega_0$ or $2\pi/\omega$ (about 0.6 s) is the period of the fast oscillation inside the envelope, not of the swelling.` },
    { id: 'dfo-r4-09', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'phase', format: 'statements',
      q: R`A damped oscillator is in steady state under the force $F_0\cos\omega t$. Which statements about phases are correct?`,
      options: [R`At $\omega = \omega_0$ the velocity is in phase with the force`, R`Below resonance the displacement lags the force by less than $90^\circ$`, 'Far above resonance the displacement is nearly opposite in phase to the force', R`The power absorbed is largest where the displacement lags the force by $45^\circ$`], answer: [0, 1, 2],
      sol: R`$\tan\phi = \dfrac{2\beta\omega}{\omega_0^2 - \omega^2}$ for the lag $\phi$ of $x$ behind $F$. Below $\omega_0$, $\phi < 90^\circ$; at $\omega_0$, $\phi = 90^\circ$, so the velocity (which leads $x$ by $90^\circ$) is in phase with $F$; far above, $\phi \to 180^\circ$. The power $\langle F\dot x\rangle$ is largest when $F$ and $\dot x$ are in phase, i.e. at $\phi = 90^\circ$, not $45^\circ$.`,
      trap: R`$45^\circ$ marks the half-power points (for light damping), not the peak.` },
    { id: 'dfo-r4-10', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'amplitude resonance',
      q: R`The peak of a driven oscillator's displacement-amplitude curve is exactly twice its displacement for a very slow (static) drive of the same force amplitude. Without assuming light damping, its quality factor $Q = \omega_0/(2\beta)$ is ______ (three decimal places).`,
      answer: 1.932, tol: 0.003, calc: () => 1 / (2 * Math.sqrt((1 - Math.sqrt(0.75)) / 2)),
      sol: R`With $\zeta = \beta/\omega_0 = 1/(2Q)$, the peak (at $\omega^2 = \omega_0^2 - 2\beta^2$) is $\dfrac{A_{\max}}{F_0/k} = \dfrac{1}{2\zeta\sqrt{1 - \zeta^2}}$. Setting this to 2: $4\zeta^2(1 - \zeta^2) = \tfrac14$, so $\zeta^2 = \dfrac{1 - \sqrt{3}/2}{2} = 0.06699$ and $\zeta = 0.2588$. Then $Q = 1/(2\zeta) = 1.932$.`,
      trap: R`The light-damping rule "peak/static = $Q$" gives 2, which is not accurate when $Q$ is this small.` },
  ],
  gens: [
    { id: 'dfo-r4g1', type: 'nat', level: 3, exams: ['jam'], sub: 'energy decay',
      make(r) {
        const f = choose(r, [128, 256, 261.6, 320, 440, 512]), Q = pick(r, 300, 3000, 100), dB = choose(r, [20, 30, 40, 60]);
        const beta = (2 * Math.PI * f) / (2 * Q), answer = round(Math.log(10 ** (dB / 20)) / beta, 3);
        return { q: R`A tuning fork of frequency ${f} Hz has $Q = ${Q}$. After it is struck, how many seconds does its sound level take to fall by ${dB} dB?`,
          answer, tol: Math.max(0.005, answer * 0.01), unit: 's', f, Q, dB,
          sol: R`$\beta = \omega_0/(2Q) = ${round(beta, 4)}$ s⁻¹. A fall of ${dB} dB is a factor $10^{${dB / 20}}$ in amplitude, so $t = \ln(10^{${dB / 20}})/\beta = ${answer}$ s.`,
          trap: 'Decibels measure intensity, which goes as amplitude squared: divide the dB by 20, not 10, to get the amplitude factor.' };
      },
      verify: (p) => Math.log(10 ** (p.dB / 20)) / ((2 * Math.PI * p.f) / (2 * p.Q)) },
    { id: 'dfo-r4g2', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'response curve',
      make(r) {
        const f0 = pick(r, 200, 2000, 100), Q = choose(r, [20, 25, 40, 50, 80, 100]), df = choose(r, [0.25, 0.5, 0.75, 1, 1.5]) * (f0 / (2 * Q));
        const ratio = ampRatio(Q, 2 * Math.PI * f0, 2 * Math.PI * (f0 + df)), approx = 1 / Math.sqrt(1 + ((2 * Q * df) / f0) ** 2), answer = round(ratio, 3);
        return { q: R`A resonator has natural frequency ${f0} Hz and $Q = ${Q}$. Driven at ${round(f0 + df, 3)} Hz, its steady-state displacement amplitude is what fraction of its amplitude when driven at exactly ${f0} Hz (same force amplitude)?`,
          answer, tol: Math.max(0.002, Math.abs(ratio - approx) + 0.002), f0, Q, df,
          sol: R`Near resonance, $\dfrac{A(\omega)}{A(\omega_0)} \approx \dfrac{1}{\sqrt{1 + (2Q\Delta f/f_0)^2}} = \dfrac{1}{\sqrt{1 + ${round(((2 * Q * df) / f0) ** 2, 4)}}} = ${round(approx, 3)}$ (exact formula: ${answer}).`,
          trap: 'The half-power width is $f_0/Q$, so the amplitude falls to 0.707 at $\\Delta f = f_0/(2Q)$.' };
      },
      verify: (p) => ampRatio(p.Q, 2 * Math.PI * p.f0, 2 * Math.PI * (p.f0 + p.df)) },
    { id: 'dfo-r4g3', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'amplitude resonance',
      make(r) {
        const k = choose(r, [1.5, 2, 2.5, 3, 4, 5]);
        const z2 = (1 - Math.sqrt(1 - 1 / k ** 2)) / 2, answer = round(1 / (2 * Math.sqrt(z2)), 3);
        return { q: R`The peak of a driven oscillator's displacement-amplitude curve is ${k} times its displacement under a very slow drive of the same force amplitude. Without assuming light damping, find $Q = \omega_0/(2\beta)$.`,
          answer, tol: Math.max(0.002, answer * 0.002), k,
          sol: R`$\dfrac{A_{\max}}{F_0/k} = \dfrac{1}{2\zeta\sqrt{1 - \zeta^2}}$ with $\zeta = 1/(2Q)$. Setting it to ${k}: $\zeta^2 = \dfrac{1 - \sqrt{1 - 1/${k}^2}}{2} = ${round(z2, 5)}$, so $Q = \dfrac{1}{2\zeta} = ${answer}$.`,
          trap: 'Peak over static equals Q only for light damping.' };
      },
      verify: (p) => 1 / (2 * Math.sqrt((1 - Math.sqrt(1 - 1 / p.k ** 2)) / 2)) },
  ],
};
