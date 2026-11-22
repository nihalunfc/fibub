// Damped and forced oscillations: under-, critical and over-damping, logarithmic decrement, Q factor, relaxation
// time, steady-state amplitude and phase, amplitude and velocity (power) resonance, bandwidth, transients, Coulomb
// friction and the LCR analogue. Convention used everywhere: m x'' + b x' + k x = F0 cos(wt), beta = b/(2m),
// w0^2 = k/m, Q = w0/(2 beta). Original questions for IIT JAM, GATE and CSIR NET practice (fibub).
import { pick, int, choose, mcqOptions, round } from '../_util.js';

const CONV = 'Take the equation of motion as $m\\ddot x + b\\dot x + kx = F_0\\cos\\omega t$, with $\\beta = b/2m$ and $\\omega_0 = \\sqrt{k/m}$.';

import * as Q5 from '../_util.js';

// Helpers for the variety templates (ids ending -t21 to -t25).
// q5msq: a statement MSQ with a random mix of true lines (from good) and false lines (from bad), at least one of each.
function q5msq(r, good, bad, n = 4) {
  const lo = Math.max(1, n - bad.length), hi = Math.max(lo, Math.min(good.length, n - 1));
  const k = Q5.int(r, lo, hi);
  const all = Q5.shuffle(r, [...Q5.shuffle(r, good).slice(0, k).map((s) => [s, 1]), ...Q5.shuffle(r, bad).slice(0, n - k).map((s) => [s, 0])]);
  return { options: all.map((x) => x[0]), answer: all.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0) };
}
// q5odd: an MCQ whose answer is the one line from `odd` placed among three lines from `rest`.
const q5odd = (r, odd, rest) => Q5.mcqOptions(r, Q5.choose(r, odd), Q5.shuffle(r, rest));
// q5frac: a fraction n/d (integers) in lowest terms, as TeX.
function q5frac(n, d) {
  const g = (a, b) => (b ? g(b, a % b) : Math.abs(a));
  const k = g(n, d) * Math.sign(d); const a = n / k, b = d / k;
  return b === 1 ? String(a) : `${a < 0 ? '-' : ''}\\tfrac{${Math.abs(a)}}{${b}}`;
}

export default {
  topic: 'damped-forced-oscillations',
  items: [
    // ---------- level 1 ----------
    { id: 'dfo-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'types of damping',
      q: 'An oscillator obeys $m\\ddot x + b\\dot x + kx = 0$. It is critically damped when',
      options: ['$b^2 = 2mk$', '$b^2 = 4mk$', '$b^2 = mk$', '$b = 2k/m$'], answer: 1,
      sol: 'Try $x = e^{st}$: $ms^2 + bs + k = 0$, so $s = [-b \\pm \\sqrt{b^2 - 4mk}]/(2m)$. The two roots merge when $b^2 = 4mk$, i.e. $\\beta = b/2m = \\omega_0$. Smaller $b$: complex roots (underdamped); larger $b$: two real roots (overdamped).' },
    { id: 'dfo-002', type: 'nat', level: 1, exams: ['jam'], sub: 'underdamped motion', unit: 'rad/s',
      q: 'A $0.5$ kg mass on a spring of force constant $50$ N/m moves through oil with damping constant $b = 2$ kg/s. Its damped angular frequency is ______ rad/s (to two decimal places).',
      answer: 9.80, tol: 0.01, calc: () => Math.sqrt(100 - 4),
      sol: '$\\omega_0^2 = k/m = 100$, $\\beta = b/2m = 2$ s$^{-1}$. $\\omega_d = \\sqrt{\\omega_0^2 - \\beta^2} = \\sqrt{96} = 9.80$ rad/s, slightly less than $\\omega_0 = 10$.',
      trap: 'Using $\\beta = b/m = 4$ gives $\\sqrt{84} = 9.17$; the damping rate in the exponent is $b/2m$.' },
    { id: 'dfo-003', type: 'mcq', level: 1, exams: ['jam'], sub: 'steady state',
      q: 'A damped oscillator of natural frequency $\\omega_0$ is driven by a force $F_0\\cos\\omega t$. After the transients die out it oscillates at',
      options: ['$\\sqrt{\\omega_0^2 - \\beta^2}$', 'a mixture of $\\omega$ and $\\omega_0$ for ever', '$\\omega_0$', '$\\omega$'], answer: 3,
      sol: 'The steady-state solution is the particular solution $x = A\\cos(\\omega t - \\phi)$, at the driving frequency. The natural (homogeneous) part decays as $e^{-\\beta t}$, so only $\\omega$ survives.',
      trap: 'The mixture with $\\omega_0$ exists only during the transient.' },
    { id: 'dfo-004', type: 'mcq', level: 1, exams: ['jam'], sub: 'energy decay',
      q: 'In a lightly damped oscillator the amplitude decays as $e^{-\\beta t}$. The energy decays as',
      options: ['$e^{-2\\beta t}$', '$e^{-\\beta t/2}$', '$e^{-\\beta^2 t}$', '$e^{-\\beta t}$'], answer: 0,
      sol: 'Energy is proportional to amplitude squared: $(e^{-\\beta t})^2 = e^{-2\\beta t}$. So the energy relaxation time is $1/(2\\beta) = m/b$, half the amplitude decay time.' },
    { id: 'dfo-005', type: 'nat', level: 1, exams: ['jam'], sub: 'quality factor',
      q: 'An oscillator has natural angular frequency $100$ rad/s and amplitude decay rate $\\beta = 0.5$ s$^{-1}$. Its quality factor $Q = \\omega_0/2\\beta$ is ______.',
      answer: 100, tol: 0, calc: () => 100 / (2 * 0.5),
      sol: '$Q = \\omega_0/(2\\beta) = 100/1 = 100$. A large $Q$ means light damping: about $Q/\\pi \\approx 32$ oscillations before the amplitude falls by $e$.' },
    { id: 'dfo-006', type: 'mcq', level: 1, exams: ['jam'], sub: 'phase',
      q: 'A damped oscillator is driven exactly at its natural frequency $\\omega_0$. In the steady state, the displacement',
      options: ['leads the force by $\\pi/2$', 'is in phase with the force', 'lags the force by $\\pi/2$', 'lags the force by $\\pi$'], answer: 2,
      sol: '$\\tan\\phi = 2\\beta\\omega/(\\omega_0^2 - \\omega^2)$ becomes infinite at $\\omega = \\omega_0$, so $\\phi = \\pi/2$: the displacement lags by $\\pi/2$, which puts the velocity exactly in phase with the force.',
      trap: 'It is the velocity, not the displacement, that is in phase with the force at $\\omega_0$.' },

    // ---------- level 2 ----------
    { id: 'dfo-007', type: 'nat', level: 2, exams: ['jam'], sub: 'energy decay', unit: 's',
      q: 'The amplitude of a lightly damped oscillator falls to half its initial value in $10$ s. The time for its energy to fall to half is ______ s.',
      answer: 5, tol: 0, calc: () => 10 * Math.log(Math.SQRT2) / Math.log(2),
      sol: 'Amplitude: $e^{-\\beta\\cdot10} = 1/2$, so $\\beta = \\ln2/10$. Energy $\\propto e^{-2\\beta t} = 1/2$ needs $t = \\ln2/(2\\beta) = 5$ s.',
      trap: 'Energy halves when the amplitude has fallen only to $1/\\sqrt2$, which takes half the time.' },
    { id: 'dfo-008', type: 'msq', level: 2, exams: ['jam'], sub: 'types of damping', format: 'statements',
      q: 'Which statements about free damped oscillators are correct?',
      options: ['From a given displacement released at rest, a critically damped system returns towards equilibrium fastest without oscillating.', 'An overdamped system can pass through the equilibrium position at most once.', 'The period of an underdamped oscillator is shorter than its undamped period.', 'For critical damping $x(t) = (C_1 + C_2t)e^{-\\omega_0 t}$.'], answer: [0, 1, 3],
      sol: 'A: true; that is why door closers and meters are set near critical damping. B: true: $x$ is a sum of two decaying exponentials, which can change sign at most once. C: false: $\\omega_d = \\sqrt{\\omega_0^2 - \\beta^2} < \\omega_0$, so the damped period is longer. D: true: the repeated root $s = -\\omega_0$ gives the $t e^{-\\omega_0 t}$ solution.',
      trap: 'Damping slows each swing, so the period grows, not shrinks.' },
    { id: 'dfo-009', type: 'nat', level: 2, exams: ['jam'], sub: 'logarithmic decrement',
      q: 'Two successive maxima (on the same side) of a damped oscillation are $10.0$ cm and $8.0$ cm. The logarithmic decrement is ______ (to three decimal places).',
      answer: 0.223, tol: 0.002, calc: () => Math.log(10 / 8),
      sol: '$\\delta = \\ln(x_n/x_{n+1}) = \\ln(10/8) = \\ln1.25 = 0.223$. It equals $\\beta T_d$.',
      trap: 'Using the ratio $8/10$ gives a negative number; the decrement is defined with the larger one on top.' },
    { id: 'dfo-010', type: 'mcq', level: 2, exams: ['jam'], sub: 'response curve',
      q: 'A damped oscillator ($m$, $b$, $k$) is driven by $F_0\\cos\\omega t$. As $\\omega \\to 0$, its steady-state amplitude tends to',
      options: ['$0$', '$F_0/k$', '$F_0/b\\omega_0$', 'infinity'], answer: 1,
      sol: 'Amplitude $A = (F_0/m)/\\sqrt{(\\omega_0^2 - \\omega^2)^2 + 4\\beta^2\\omega^2}$. At $\\omega = 0$: $A = (F_0/m)/\\omega_0^2 = F_0/k$, the static stretch under a steady force $F_0$.' },
    { id: 'dfo-011', type: 'mcq', level: 2, exams: ['jam'], sub: 'response curve',
      q: 'For driving frequencies far above resonance ($\\omega \\gg \\omega_0$), the steady-state displacement of a damped driven oscillator',
      options: ['lags by $\\pi/2$ and has amplitude $F_0/(b\\omega)$', 'leads the force by $\\pi/2$', 'is in phase with the force and has amplitude $F_0/k$', 'lags the force by nearly $\\pi$ and has amplitude about $F_0/(m\\omega^2)$'], answer: 3,
      sol: 'For $\\omega \\gg \\omega_0$ the inertia term dominates: $-m\\omega^2A \\approx F_0$, so $A \\approx F_0/(m\\omega^2)$ and the displacement is opposite to the force ($\\phi \\to \\pi$). The spring and the damper hardly matter.' },
    { id: 'dfo-012', type: 'nat', level: 2, exams: ['jam'], sub: 'bandwidth', unit: 'Hz',
      q: 'A lightly damped oscillator with $Q = 50$ resonates at $500$ Hz. The full width of its power resonance curve at half maximum is ______ Hz.',
      answer: 10, tol: 0, calc: () => 500 / 50,
      sol: 'For the power curve, $\\Delta\\omega = 2\\beta = \\omega_0/Q$, so $\\Delta f = f_0/Q = 500/50 = 10$ Hz.' },
    { id: 'dfo-013', type: 'mcq', level: 2, exams: ['jam'], sub: 'energy decay',
      q: 'For $m\\ddot x + b\\dot x + kx = 0$ with light damping, the time in which the energy falls to $1/e$ of its value is',
      options: ['$m/b$', '$2m/b$', '$b/m$', '$m/(2b)$'], answer: 0,
      sol: 'Energy $\\propto e^{-2\\beta t} = e^{-(b/m)t}$, so it falls by $e$ in $\\tau = m/b$. The amplitude falls by $e$ in $2m/b$.',
      trap: '$2m/b$ is the amplitude decay time.' },
    { id: 'dfo-014', type: 'msq', level: 2, exams: ['jam'], sub: 'quality factor', format: 'multi',
      q: 'For a spring-mass-damper with $Q = \\sqrt{mk}/b$, which changes (each made alone) increase $Q$?',
      options: ['Increasing $m$', 'Increasing $k$', 'Increasing $b$', 'Halving $b$'], answer: [0, 1, 3],
      sol: '$Q = \\omega_0/(2\\beta) = \\sqrt{k/m}\\cdot m/b = \\sqrt{mk}/b$. It grows with $m$ and with $k$ and falls as $b$ grows; halving $b$ doubles $Q$.' },
    { id: 'dfo-015', type: 'nat', level: 2, exams: ['jam'], sub: 'quality factor', unit: '%',
      q: 'An oscillator has $Q = 20\\pi$. The percentage of its stored energy lost in one cycle is ______ %.',
      answer: 10, tol: 0.1, calc: () => 100 * 2 * Math.PI / (20 * Math.PI),
      sol: 'For light damping $Q = 2\\pi\\times$ (energy stored)/(energy lost per cycle). So $\\Delta E/E = 2\\pi/Q = 2\\pi/(20\\pi) = 0.1$, i.e. $10\\%$.' },
    { id: 'dfo-016', type: 'mcq', level: 2, exams: ['jam'], sub: 'units',
      q: 'The damping constant $b$ in the drag force $-b\\dot x$ has SI units of',
      options: ['kg/s$^2$', 's$^{-1}$', 'kg/s', 'N/m'], answer: 2,
      sol: '$b = $ force/velocity $=$ N/(m/s) $=$ (kg m/s$^2$)(s/m) $=$ kg/s. $\\beta = b/2m$ then has units s$^{-1}$, a rate.',
      trap: 's$^{-1}$ is the unit of $\\beta = b/2m$, not of $b$.' },
    { id: 'dfo-017', type: 'msq', level: 2, exams: ['jam'], sub: 'underdamped motion', format: 'statements',
      q: 'A system obeys $\\ddot x + 6\\dot x + 25x = 0$ (SI units). Which statements are correct?',
      options: ['It is underdamped.', 'Its damped angular frequency is $4$ rad/s.', 'Its amplitude decays as $e^{-6t}$.', 'Its quality factor is $5/6$.'], answer: [0, 1, 3],
      sol: 'Compare with $\\ddot x + 2\\beta\\dot x + \\omega_0^2x = 0$: $\\beta = 3$, $\\omega_0 = 5$. Since $\\beta < \\omega_0$ it is underdamped (A). $\\omega_d = \\sqrt{25 - 9} = 4$ (B). The amplitude decays as $e^{-3t}$, not $e^{-6t}$ (C false). $Q = \\omega_0/2\\beta = 5/6$ (D).',
      trap: 'The coefficient of $\\dot x$ is $2\\beta$, so the decay rate is half of it.' },

    // ---------- level 3 ----------
    { id: 'dfo-018', type: 'nat', level: 3, exams: ['jam'], sub: 'amplitude resonance', unit: 'rad/s',
      q: 'A driven oscillator has $\\omega_0 = 10$ rad/s and $\\beta = 3$ s$^{-1}$. Its displacement amplitude is largest at a driving angular frequency of ______ rad/s (to two decimal places).',
      answer: 9.06, tol: 0.01, calc: () => Math.sqrt(100 - 2 * 9),
      sol: 'Minimise $D(\\omega^2) = (\\omega_0^2 - \\omega^2)^2 + 4\\beta^2\\omega^2$: $dD/d(\\omega^2) = -2(\\omega_0^2 - \\omega^2) + 4\\beta^2 = 0$, so $\\omega_r^2 = \\omega_0^2 - 2\\beta^2 = 100 - 18 = 82$ and $\\omega_r = 9.06$ rad/s.',
      trap: '$\\sqrt{\\omega_0^2 - \\beta^2} = 9.54$ is the free damped frequency, which is a different thing.' },
    { id: 'dfo-019', type: 'nat', level: 3, exams: ['jam'], sub: 'steady state', unit: 'm',
      q: 'A $1$ kg mass on a spring with $k = 100$ N/m and damping $b = 4$ kg/s is driven by $10\\cos 8t$ N. The steady-state amplitude is ______ m (to three decimal places).',
      answer: 0.208, tol: 0.002, calc: () => 10 / Math.hypot(100 - 64, 4 * 8),
      sol: '$\\omega_0^2 = 100$, $2\\beta = b/m = 4$. $A = (F_0/m)/\\sqrt{(\\omega_0^2 - \\omega^2)^2 + (2\\beta\\omega)^2} = 10/\\sqrt{36^2 + 32^2} = 10/\\sqrt{2320} = 10/48.17 = 0.208$ m.',
      trap: 'Writing $\\beta\\omega$ instead of $2\\beta\\omega$ (i.e. $b\\omega/m$) in the denominator.' },
    { id: 'dfo-020', type: 'mcq', level: 3, exams: ['jam'], sub: 'phase',
      q: 'For an oscillator with $m = 1$ kg, $k = 100$ N/m and $b = 4$ kg/s, driven at $\\omega = 8$ rad/s, the steady-state displacement lags the force by about',
      options: ['$90^\\circ$', '$41.6^\\circ$', '$48.4^\\circ$', '$138.4^\\circ$'], answer: 1,
      sol: '$\\tan\\phi = (b\\omega/m)/(\\omega_0^2 - \\omega^2) = 32/36 = 0.889$, so $\\phi = 41.6^\\circ$. Below resonance the lag is less than $90^\\circ$.',
      trap: '$48.4^\\circ$ is the complement (it inverts the ratio); $138.4^\\circ$ would be the lag above resonance.' },
    { id: 'dfo-021', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'resonance', format: 'statements',
      q: 'A lightly damped oscillator is driven at exactly $\\omega = \\omega_0$. Which statements are correct?',
      options: ['The velocity amplitude is the largest it can be for any $\\omega$.', 'The average power absorbed from the driver is the largest it can be.', 'The displacement amplitude is the largest it can be.', 'The velocity is in phase with the driving force.'], answer: [0, 1, 3],
      sol: 'Velocity amplitude $\\omega A = (F_0/m)/\\sqrt{(\\omega_0^2/\\omega - \\omega)^2 + 4\\beta^2}$, largest when $\\omega = \\omega_0$ (A), where the velocity is in phase with the force (D) and so the power $\\tfrac12F_0v_0\\cos(0)$ is largest (B). The displacement amplitude peaks a little lower, at $\\sqrt{\\omega_0^2 - 2\\beta^2}$ (C false).',
      trap: 'Displacement resonance and velocity (energy) resonance are at slightly different frequencies.' },
    { id: 'dfo-022', type: 'nat', level: 3, exams: ['jam'], sub: 'power', unit: 'W',
      q: 'An oscillator with damping constant $b = 0.5$ kg/s is driven at its natural frequency by a force of amplitude $2$ N. The average power absorbed is ______ W.',
      answer: 4, tol: 0, calc: () => 2 ** 2 / (2 * 0.5),
      sol: 'At $\\omega_0$ the driving force balances the drag: velocity amplitude $v_0 = F_0/b = 4$ m/s, in phase with the force. Average power $= \\tfrac12F_0v_0 = F_0^2/(2b) = 4/1 = 4$ W.',
      trap: 'Forgetting the $\\tfrac12$ from averaging $\\cos^2$ gives 8 W.' },
    { id: 'dfo-023', type: 'mcq', level: 3, exams: ['jam'], sub: 'resonance',
      q: 'For a lightly damped oscillator, the ratio of the displacement amplitude at resonance to the static displacement $F_0/k$ is approximately',
      options: ['$Q^2$', '$1/Q$', '$2Q$', '$Q$'], answer: 3,
      sol: 'At $\\omega = \\omega_0$: $A = (F_0/m)/(2\\beta\\omega_0)$. Divide by $F_0/k = F_0/(m\\omega_0^2)$: the ratio is $\\omega_0/(2\\beta) = Q$. That is why a high-$Q$ system can be shaken violently by a small periodic push.' },
    { id: 'dfo-024', type: 'nat', level: 3, exams: ['jam'], sub: 'critical damping', unit: 'cm',
      q: 'A critically damped system with $\\omega_0 = 5$ rad/s is released from rest at $x = 10$ cm. Its displacement at $t = 0.4$ s is ______ cm (to two decimal places).',
      answer: 4.06, tol: 0.02, calc: () => 10 * (1 + 5 * 0.4) * Math.exp(-2),
      sol: 'Critical damping: $x = (C_1 + C_2t)e^{-\\omega_0 t}$. $x(0) = 10$ gives $C_1 = 10$; $\\dot x(0) = 0$ gives $C_2 - \\omega_0C_1 = 0$, so $C_2 = 50$. At $t = 0.4$: $x = (10 + 20)e^{-2} = 30\\times0.1353 = 4.06$ cm.',
      trap: 'Dropping the $C_2t$ term ($x = 10e^{-2} = 1.35$ cm) ignores the release-from-rest condition.' },
    { id: 'dfo-025', type: 'mcq', level: 3, exams: ['jam'], sub: 'response curve',
      q: 'Curves of steady-state displacement amplitude against driving frequency are drawn for the same oscillator with increasing damping. As damping increases, the peak',
      options: ['gets lower and moves to a lower frequency', 'gets lower and stays exactly at $\\omega_0$', 'gets higher and narrower', 'gets lower and moves to a higher frequency'], answer: 0,
      sol: 'The peak height is $F_0/(2m\\beta\\sqrt{\\omega_0^2 - \\beta^2})$, which falls as $\\beta$ grows, and its position $\\sqrt{\\omega_0^2 - 2\\beta^2}$ moves down. Beyond $\\beta = \\omega_0/\\sqrt2$ there is no peak at all.',
      trap: 'The power (velocity) peak stays at $\\omega_0$; the displacement peak does not.' },
    { id: 'dfo-026', type: 'nat', level: 3, exams: ['jam'], sub: 'energy decay',
      q: 'A lightly damped oscillator has $\\beta = 0.2$ s$^{-1}$ and period $0.5$ s. The number of complete oscillations in which its amplitude falls to $1/e$ of the initial value is ______.',
      answer: 10, tol: 0, calc: () => 1 / (0.2 * 0.5),
      sol: 'The amplitude falls by $e$ in $1/\\beta = 5$ s, which is $5/0.5 = 10$ periods. In general this number is $1/(\\beta T) \\approx Q/\\pi$.' },
    { id: 'dfo-027', type: 'nat', level: 3, exams: ['jam'], sub: 'LCR analogue',
      q: 'A series LCR circuit has $L = 0.1$ H, $C = 10\\ \\mu$F and $R = 10\\ \\Omega$. Its quality factor is ______.',
      answer: 10, tol: 0, calc: () => Math.sqrt(0.1 / 1e-5) / 10,
      sol: '$L\\ddot q + R\\dot q + q/C = \\mathcal E$ matches $m\\ddot x + b\\dot x + kx$ with $m \\to L$, $b \\to R$, $k \\to 1/C$. So $Q = \\sqrt{mk}/b \\to (1/R)\\sqrt{L/C} = (1/10)\\sqrt{0.1/10^{-5}} = 100/10 = 10$.',
      trap: 'Forgetting to convert microfarads: $C = 10^{-5}$ F.' },
    { id: 'dfo-028', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'transients', format: 'statements',
      q: 'An underdamped oscillator at rest is suddenly driven by $F_0\\cos\\omega t$. Which statements are correct?',
      options: ['The transient part of the motion decays as $e^{-\\beta t}$.', 'The steady state does not depend on the initial conditions.', 'With light damping and $\\omega$ close to $\\omega_0$, beats can be seen while the transient lasts.', 'The steady-state amplitude depends on the initial displacement.'], answer: [0, 1, 2],
      sol: 'The full solution is the steady state plus a free damped oscillation $Ce^{-\\beta t}\\cos(\\omega_dt + \\alpha)$; $C$ and $\\alpha$ carry the initial conditions and die away (A, B; D false). While both parts are present, frequencies $\\omega$ and $\\omega_d$ add and beat (C).' },
    { id: 'dfo-029', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'bandwidth',
      q: 'For a lightly damped oscillator, the two frequencies at which the absorbed power is half its maximum differ by',
      options: ['$\\beta/2$', '$4\\beta$', '$2\\beta$', '$\\beta$'], answer: 2,
      sol: 'Half power occurs where $(\\omega_0^2 - \\omega^2)^2 = (2\\beta\\omega)^2$, i.e. $\\omega_0^2 - \\omega^2 = \\pm2\\beta\\omega$. The positive roots are $\\omega = \\mp\\beta + \\sqrt{\\omega_0^2 + \\beta^2}$, so $\\omega_2 - \\omega_1 = 2\\beta = \\omega_0/Q$ (exactly, in fact).' },
    { id: 'dfo-030', type: 'msq', level: 3, exams: ['jam'], sub: 'LCR analogue', format: 'multi',
      q: 'Which of these are described by the same equation as a damped, driven mass on a spring?',
      options: ['The charge on the capacitor in a series LCR circuit with an AC source', 'A torsion pendulum in a viscous liquid given a periodic torque', 'The charge on the capacitor in an RC circuit with an AC source', 'A pendulum swinging with small amplitude in air and pushed periodically'], answer: [0, 1, 3],
      sol: 'A: $L\\ddot q + R\\dot q + q/C = \\mathcal E_0\\cos\\omega t$. B: $I\\ddot\\theta + c\\dot\\theta + \\kappa\\theta = \\tau_0\\cos\\omega t$. D: $ml\\ddot\\theta + bl\\dot\\theta + mg\\theta = F$ for small angles. C has no inductance, so the equation is first order: it cannot oscillate or resonate.',
      trap: 'An RC circuit responds to frequency but has no natural oscillation, so no resonance.' },

    // ---------- level 4 ----------
    { id: 'dfo-031', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'amplitude resonance', unit: 'mm',
      q: '$1$ kg mass, $\\omega_0 = 10$ rad/s, $\\beta = 1$ s$^{-1}$, driven by a force of amplitude $1$ N at whatever frequency makes the displacement amplitude largest. That largest amplitude is ______ mm (to one decimal place).',
      answer: 50.3, tol: 0.2, calc: () => 1000 / (2 * 1 * Math.sqrt(100 - 1)),
      sol: 'At $\\omega_r^2 = \\omega_0^2 - 2\\beta^2$: $(\\omega_0^2 - \\omega_r^2)^2 + 4\\beta^2\\omega_r^2 = 4\\beta^4 + 4\\beta^2(\\omega_0^2 - 2\\beta^2) = 4\\beta^2(\\omega_0^2 - \\beta^2)$. So $A_{\\max} = F_0/(2m\\beta\\sqrt{\\omega_0^2 - \\beta^2}) = 1/(2\\sqrt{99}) = 0.05025$ m $= 50.3$ mm.',
      trap: 'Evaluating at $\\omega_0$ instead gives $F_0/(2m\\beta\\omega_0) = 50.0$ mm, close but not the maximum.' },
    { id: 'dfo-032', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'amplitude resonance',
      q: 'The steady-state displacement amplitude of a driven damped oscillator has a maximum at some non-zero driving frequency only if',
      options: ['always, for any damping', '$Q > 1/\\sqrt2$', '$Q > 1/2$', '$Q > 1$'], answer: 1,
      sol: '$\\omega_r^2 = \\omega_0^2 - 2\\beta^2$ must be positive: $\\beta < \\omega_0/\\sqrt2$, i.e. $Q = \\omega_0/(2\\beta) > 1/\\sqrt2$. For heavier damping the amplitude just falls steadily from $F_0/k$ as $\\omega$ rises.',
      trap: '$Q > 1/2$ is the condition for free oscillation (underdamping), which is weaker.' },
    { id: 'dfo-033', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'amplitude resonance',
      q: 'The displacement amplitude of a driven oscillator peaks at $0.98\\,\\omega_0$. Its quality factor is ______ (to two decimal places).',
      answer: 3.55, tol: 0.03, calc: () => 1 / (2 * Math.sqrt((1 - 0.98 ** 2) / 2)),
      sol: '$\\omega_r^2/\\omega_0^2 = 1 - 2(\\beta/\\omega_0)^2 = 0.9604$, so $(\\beta/\\omega_0)^2 = 0.0198$ and $\\beta/\\omega_0 = 0.1407$. $Q = \\omega_0/(2\\beta) = 1/0.2814 = 3.55$.' },
    { id: 'dfo-034', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'power', format: 'statements',
      q: 'The average power absorbed by a driven damped oscillator is $P(\\omega) = \\dfrac{F_0^2}{2m}\\,\\dfrac{2\\beta\\omega^2}{(\\omega_0^2 - \\omega^2)^2 + 4\\beta^2\\omega^2}$. Which statements are correct?',
      options: ['The curve is exactly symmetric about $\\omega_0$ on a linear frequency axis.', 'Its maximum is exactly at $\\omega = \\omega_0$, for any damping.', 'Its full width at half maximum is exactly $2\\beta$, for any damping.', '$P \\to 0$ as $\\omega \\to 0$.'], answer: [1, 2, 3],
      sol: 'Divide top and bottom by $\\omega^2$: $P \\propto 2\\beta/[(\\omega_0^2/\\omega - \\omega)^2 + 4\\beta^2]$, largest when $\\omega = \\omega_0$ (B). Half maximum when $|\\omega_0^2/\\omega - \\omega| = 2\\beta$, whose positive roots differ by exactly $2\\beta$ (C). At $\\omega \\to 0$ the numerator $\\omega^2 \\to 0$ (D). A is false: the curve is symmetric in $\\ln\\omega$ (the roots multiply to $\\omega_0^2$), not in $\\omega$; it looks symmetric only near a sharp peak.',
      trap: 'Many students "know" the width is $2\\beta$ only approximately; for the power curve it is exact, while the symmetry is the approximate part.' },
    { id: 'dfo-035', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'Coulomb friction',
      q: 'A block on a spring slides on a rough horizontal floor (coefficient of kinetic friction $\\mu$). Its amplitude decreases',
      options: ['by an amount proportional to the amplitude squared', 'only during the first half cycle', 'by the same fraction every cycle', 'by the same amount, $4\\mu mg/k$, every cycle'], answer: 3,
      sol: 'In each half cycle the friction force has constant size $\\mu mg$, so the motion is SHM about a shifted centre $\\pm\\mu mg/k$. Each half swing ends $2\\mu mg/k$ closer to the origin than it began, so the amplitude falls by $4\\mu mg/k$ per full cycle: a linear, not exponential, decay.',
      trap: '"The same fraction" (exponential decay) is the signature of viscous damping, $-b\\dot x$.' },
    { id: 'dfo-036', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'Coulomb friction', unit: 'cm',
      q: 'A $0.5$ kg block on a spring ($k = 20$ N/m) on a floor with $\\mu = 0.1$ (same value for static and kinetic friction; $g = 9.8$ m/s$^2$) is released from rest $20$ cm from the unstretched position. It finally stops ______ cm from the unstretched position (to one decimal place).',
      answer: 0.4, tol: 0.05, calc: () => 100 * Math.abs(0.2 - 4 * 2 * 0.1 * 0.5 * 9.8 / 20),
      sol: '$\\mu mg/k = 0.49/20 = 0.0245$ m, so each half swing loses $2\\times0.0245 = 0.049$ m. Turning points: $+0.200$, $-0.151$, $+0.102$, $-0.053$, $+0.004$ m. At each of the first four the spring force ($kx \\ge 1.06$ N) beats the friction limit $0.49$ N, so the block moves on. At $0.004$ m the spring force is only $0.08$ N, so it stays: $0.4$ cm.',
      trap: 'Stopping as soon as the amplitude is "small": you must compare $k|x|$ with $\\mu mg$ at each turning point.' },
    { id: 'dfo-037', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'response curve',
      q: 'For an undamped oscillator ($b = 0$) driven by $F_0\\cos\\omega t$, the steady-state response as $\\omega$ is swept through $\\omega_0$',
      options: ['has an amplitude that grows without limit near $\\omega_0$, and a phase that jumps suddenly from $0$ to $\\pi$', 'has a finite peak at $\\omega_0$ and a phase that rises smoothly through $\\pi/2$', 'has zero amplitude at $\\omega_0$', 'is the same at all frequencies'], answer: 0,
      sol: '$A = (F_0/m)/(\\omega_0^2 - \\omega^2)$: positive (in phase) below $\\omega_0$, negative (phase $\\pi$) above, and infinite at $\\omega_0$ itself, where the amplitude actually grows linearly in time. Damping is what rounds this off into a finite peak with a smooth phase change.' },
    { id: 'dfo-038', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'power', unit: 'J',
      q: 'In steady state an oscillator with $b = 0.2$ kg/s moves with amplitude $0.1$ m at $\\omega = 5$ rad/s. The work done by the driving force in one cycle is ______ J (to four decimal places).',
      answer: 0.0314, tol: 0.0005, calc: () => Math.PI * 0.2 * 5 * 0.01,
      sol: 'In steady state the driver\'s work per cycle equals the energy dissipated: $\\oint b\\dot x^2\\,dt = b\\omega^2A^2\\cdot(T/2) = b\\omega^2A^2\\cdot\\pi/\\omega = \\pi b\\omega A^2 = \\pi\\times0.2\\times5\\times0.01 = 0.0314$ J.' },
    { id: 'dfo-039', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'impulse response',
      q: 'An underdamped oscillator of mass $m$ at rest at $x = 0$ receives a sharp impulse $J$ at $t = 0$. For $t > 0$ its displacement is',
      options: ['$\\dfrac{J}{m}e^{-\\beta t}\\sin\\omega_d t$', '$\\dfrac{J}{m\\omega_d}\\sin\\omega_0 t$', '$\\dfrac{J}{m\\omega_d}e^{-\\beta t}\\sin\\omega_d t$', '$\\dfrac{J}{m\\omega_0}e^{-\\beta t}\\cos\\omega_d t$'], answer: 2,
      sol: 'The impulse gives $x(0) = 0$, $\\dot x(0) = J/m$. The free solution $x = Ce^{-\\beta t}\\sin\\omega_dt$ meets $x(0) = 0$, and $\\dot x(0) = C\\omega_d = J/m$ fixes $C = J/(m\\omega_d)$. This is the Green\'s function of the oscillator (times $J$).',
      trap: 'The option $(J/m)e^{-\\beta t}\\sin\\omega_d t$ has the wrong units: $J/m$ is a speed, so it must be divided by a frequency.' },

    // ---------- level 5 ----------
    { id: 'dfo-040', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'energy decay',
      q: 'An oscillator with $Q = 5$ is released from rest. The fraction of its initial energy left after exactly three damped periods is ______ (to four decimal places).',
      answer: 0.0226, tol: 0.0005, calc: () => Math.exp(-6 * 2 * Math.PI * 0.1 / Math.sqrt(0.99)),
      sol: 'Released from rest, $x = x_0e^{-\\beta t}(\\cos\\omega_dt + (\\beta/\\omega_d)\\sin\\omega_dt)$ and $\\dot x \\propto e^{-\\beta t}\\sin\\omega_dt$. After each full period $T_d$ the mass is again at rest, so all energy is $\\tfrac12kx^2$ with $x = x_0e^{-\\beta T_d}$. Energy ratio after three periods: $e^{-6\\beta T_d}$. With $\\beta/\\omega_0 = 1/(2Q) = 0.1$ and $\\omega_d = \\omega_0\\sqrt{0.99}$: $\\beta T_d = 2\\pi(0.1)/0.99499 = 0.6315$, so the fraction is $e^{-3.789} = 0.0226$.',
      trap: 'Using $\\omega_0$ instead of $\\omega_d$ in the period gives $e^{-1.2\\pi} = 0.0230$: close, but outside the tolerance.' },
    { id: 'dfo-041', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'energy in steady state', format: 'statements',
      q: 'A lightly damped oscillator is in steady state under $F_0\\cos\\omega t$. Which statements are correct?',
      options: ['The time-averaged kinetic and potential energies are equal only when $\\omega = \\omega_0$.', 'For $\\omega < \\omega_0$ the average potential energy exceeds the average kinetic energy.', 'The displacement amplitude is largest exactly at $\\omega = \\omega_0$.', 'At the two half-power frequencies the displacement lags the force by $\\pi/4$ and $3\\pi/4$.'], answer: [0, 1, 3],
      sol: '$\\langle KE\\rangle = \\tfrac14m\\omega^2A^2$ and $\\langle PE\\rangle = \\tfrac14m\\omega_0^2A^2$: equal only at $\\omega = \\omega_0$ (A), and $PE > KE$ below it (B). C is false: the displacement peak is at $\\sqrt{\\omega_0^2 - 2\\beta^2}$. D: at the half-power points $|\\omega_0^2 - \\omega^2| = 2\\beta\\omega$, so $\\tan\\phi = \\pm1$: $\\phi = \\pi/4$ below and $3\\pi/4$ above resonance.' },
    { id: 'dfo-042', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'amplitude resonance',
      q: 'For an oscillator with $Q = 1$, the displacement amplitude when driven at $\\omega_0$ is a fraction $f$ of the largest displacement amplitude (reached at $\\omega_r$). The value of $f$ is ______ (to three decimal places).',
      answer: 0.866, tol: 0.003, calc: () => Math.sqrt(1 - 1 / 4),
      sol: '$A(\\omega_0) = F_0/(2m\\beta\\omega_0)$ and $A_{\\max} = F_0/(2m\\beta\\sqrt{\\omega_0^2 - \\beta^2})$. Ratio $= \\sqrt{1 - (\\beta/\\omega_0)^2} = \\sqrt{1 - 1/(4Q^2)} = \\sqrt{3/4} = 0.866$.',
      trap: 'For high $Q$ this ratio is almost 1, which is why the two resonances are often treated as the same; at $Q = 1$ they are not.' },
  ],
  gens: [
    { id: 'dfo-t21', type: 'mcq', level: 2, exams: ['jam'], sub: 'phase', format: 'limiting case',
      make(r) {
        const reg = Q5.int(r, 0, 2), phase = r() < 0.5;
        const where = ['much lower than', 'equal to', 'much higher than'][reg];
        let o, sol;
        if (phase) {
          o = Q5.mcqOptions(r, ['$0$', '$\\pi/2$', '$\\pi$'][reg], ['$0$', '$\\pi/2$', '$\\pi$', '$\\pi/4$']);
          sol = `$\\tan\\delta = \\dfrac{2\\beta\\omega}{\\omega_0^2 - \\omega^2}$. For $\\omega \\ll \\omega_0$, $\\tan\\delta \\to 0^+$: $\\delta \\to 0$ (the mass follows the force). At $\\omega = \\omega_0$ the denominator vanishes: $\\delta = \\pi/2$ whatever the damping. For $\\omega \\gg \\omega_0$, $\\tan\\delta \\to 0^-$: $\\delta \\to \\pi$ (the motion is opposite to the force).`;
        } else {
          o = Q5.mcqOptions(r, ['$F_0/k$', '$F_0/(b\\,\\omega_0)$', '$F_0/(m\\omega^2)$, falling towards zero'][reg], ['$F_0/k$', '$F_0/(b\\,\\omega_0)$', '$F_0/(m\\omega^2)$, falling towards zero', 'infinite, whatever the damping']);
          sol = `$A(\\omega) = \\dfrac{F_0/m}{\\sqrt{(\\omega_0^2 - \\omega^2)^2 + (b\\omega/m)^2}}$. For $\\omega \\ll \\omega_0$ this is $F_0/(m\\omega_0^2) = F_0/k$ (the static stretch). At $\\omega = \\omega_0$ only the damping term is left: $A = F_0/(b\\omega_0)$, finite for any $b > 0$. For $\\omega \\gg \\omega_0$ the $\\omega^4$ term wins: $A \\approx F_0/(m\\omega^2) \\to 0$ (inertia controls).`;
        }
        return { q: `A mass $m$ on a spring of constant $k$ (natural frequency $\\omega_0$) with damping constant $b$ is driven by $F_0\\cos\\omega t$, with $\\omega$ ${where} $\\omega_0$. In the steady state, ${phase ? 'by what phase does the displacement lag behind the force?' : 'the amplitude is about'}`, ...o, sol,
          trap: phase ? 'The lag at exact resonance is $\\pi/2$ for every damping, not 0.' : 'Resonance amplitude is limited by damping; it is infinite only when $b = 0$.' };
      } },
    { id: 'dfo-t22', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'quality factor',
      make(r) {
        const N = Q5.int(r, 5, 60), [p, ps] = Q5.choose(r, [[0.5, '1/2'], [1 / 3, '1/3'], [0.25, '1/4'], [0.2, '1/5'], [0.1, '1/10']]), f = Q5.int(r, 50, 900);
        const Q = Math.PI * N / Math.log(1 / p);
        return { q: `A lightly damped tuning fork of frequency $${f}$ Hz is struck. Its amplitude falls to $${ps}$ of the starting value in $${N}$ oscillations. Its quality factor $Q$ is ______ (to one decimal place).`,
          answer: Q5.round(Q, 1), tol: 0.15, N, p,
          sol: `The amplitude falls as $e^{-\\beta t}$. After $N$ periods ($t = N/f$): $e^{-\\beta N/f} = ${ps}$, so $\\beta = f\\ln(1/p)/N$. With $Q = \\omega_0/(2\\beta) = \\dfrac{2\\pi f}{2\\beta} = \\dfrac{\\pi N}{\\ln(1/p)} = \\dfrac{\\pi\\times${N}}{${Q5.round(Math.log(1 / p), 4)}} = ${Q5.round(Q, 1)}$. The frequency cancels.`,
          trap: 'The frequency is a distractor: counting cycles already measures time in periods.' };
      },
      verify: (p) => { const delta = -Math.log(p.p) / p.N; return Math.PI / delta; } },
    { id: 'dfo-t23', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'bandwidth', format: 'statements',
      make(r) {
        const f0 = Q5.int(r, 10, 90) * 10, Q = Q5.int(r, 10, 100), yes = r() < 0.5;
        const bw = Q5.round(f0 / Q, 2), tE = Q5.round(1000 * Q / (2 * Math.PI * f0), 2);
        const T = [`The half-power bandwidth is about $${bw}$ Hz.`, `The stored energy falls by a factor $e$ in about $${tE}$ ms once the drive is removed.`, 'The amplitude resonance is slightly below the natural frequency.', 'The velocity (and power) resonance is exactly at the natural frequency.'];
        const F = [`The half-power bandwidth is about $${f0 * Q}$ Hz.`, `The half-power bandwidth is about $${Q5.round(bw / 2, 2)}$ Hz.`, 'The amplitude resonance is slightly above the natural frequency.', 'The velocity resonance is slightly below the natural frequency.', 'The displacement lags the force by $\\pi$ at the natural frequency.'];
        const o = yes ? q5msq(r, T, F) : q5msq(r, F, T);
        return { q: `A driven oscillator has natural frequency $${f0}$ Hz and quality factor $${Q}$. Which statements are ${yes ? 'correct' : '<b>NOT</b> correct'}?`, ...o,
          sol: `Half-power bandwidth $\\Delta f = f_0/Q = ${f0}/${Q} = ${bw}$ Hz. Energy decays as $e^{-2\\beta t}$ with $2\\beta = \\omega_0/Q$, so the $1/e$ time is $Q/\\omega_0 = ${Q}/(2\\pi\\times${f0})$ s $= ${tE}$ ms. Amplitude resonance is at $\\sqrt{\\omega_0^2 - 2\\beta^2}$, a little below $\\omega_0$; velocity resonance is exactly at $\\omega_0$, where the displacement lags by $\\pi/2$.`,
          trap: 'Energy decays twice as fast as amplitude; the bandwidth is $f_0/Q$, not $f_0/(2Q)$.' };
      } },
    { id: 'dfo-t24', type: 'mcq', level: 3, exams: ['jam'], sub: 'response curve', format: 'graph',
      make(r) {
        const k = Q5.int(r, 2, 6), ask = Q5.int(r, 0, 2);
        const what = ['$b_P/b_Q$ of their damping constants', '$\\Delta\\omega_P/\\Delta\\omega_Q$ of their half-power widths', '$Q_P/Q_Q$ of their quality factors'][ask];
        const right = ask === 2 ? `$${k}$` : `$1/${k}$`;
        const o = Q5.mcqOptions(r, right, [`$${k}$`, `$1/${k}$`, `$${k * k}$`, `$1/${k * k}$`]);
        return { q: `Two lightly damped oscillators P and Q have the same mass, the same natural frequency and the same driving-force amplitude. On a graph of steady-state amplitude against driving frequency, the peak of P is $${k}$ times as high as the peak of Q. The ratio ${what} is`, ...o,
          sol: `For light damping the peak amplitude is $F_0/(b\\omega_0)$, so peak height $\\propto 1/b$: $b_P/b_Q = 1/${k}$. The half-power width is $\\Delta\\omega = b/m$, also $\\propto b$: ratio $1/${k}$. $Q = m\\omega_0/b \\propto 1/b$: ratio $${k}$.`,
          trap: 'A taller peak means less damping, a narrower curve and a larger $Q$, all by the same factor.' };
      } },
    { id: 'dfo-t25', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'energy decay', unit: '%',
      make(r) {
        const m = Q5.pick(r, 0.2, 2, 0.1), k = Q5.int(r, 10, 200), b = Q5.pick(r, 0.05, 0.5, 0.05);
        const beta = b / (2 * m), wd = Math.sqrt(k / m - beta * beta), Td = 2 * Math.PI / wd;
        const loss = 100 * (1 - Math.exp(-2 * beta * Td));
        return { q: `A mass of $${m}$ kg on a spring of constant $${k}$ N/m moves with damping constant $b = ${b}$ kg/s. The percentage of its mechanical energy lost in one complete (damped) oscillation is ______ % (to two decimal places).`,
          answer: Q5.round(loss, 2), tol: 0.02, m, k, b,
          sol: `$\\beta = b/2m = ${Q5.round(beta, 4)}$ s$^{-1}$, $\\omega_d = \\sqrt{k/m - \\beta^2} = ${Q5.round(wd, 4)}$ rad/s, $T_d = 2\\pi/\\omega_d = ${Q5.round(Td, 4)}$ s. The amplitude falls by $e^{-\\beta T_d}$ per cycle, so the energy (amplitude squared) falls by $e^{-2\\beta T_d}$. Fraction lost $= 1 - e^{-2\\beta T_d} = ${Q5.round(loss, 2)}\\%$.`,
          trap: 'Square the amplitude ratio to get the energy ratio.' };
      },
      verify: (p) => { const be = p.b / (2 * p.m), T = 2 * Math.PI / Math.sqrt(p.k / p.m - be * be); const ratio = Math.exp(-be * T); return 100 * (1 - ratio * ratio); } },
    { id: 'dfo-g01', type: 'nat', level: 2, exams: ['jam'], sub: 'underdamped motion',
      make(r) {
        const m = choose(r, [0.25, 0.5, 1, 2]), k = choose(r, [25, 50, 100, 200, 400]), w0 = Math.sqrt(k / m);
        const b = round(pick(r, 0.1, 0.9, 0.1) * 2 * m * w0, 1);
        const beta = b / (2 * m), wd = Math.sqrt(w0 * w0 - beta * beta);
        return { q: `A $${m}$ kg mass on a spring with $k = ${k}$ N/m has damping constant $b = ${b}$ kg/s. Its damped angular frequency is ______ rad/s (to two decimal places).`,
          answer: round(wd, 2), tol: Math.max(0.02, round(wd * 0.005, 2)), unit: 'rad/s', m, k, b,
          sol: `$\\omega_0^2 = k/m = ${round(w0 * w0, 3)}$, $\\beta = b/2m = ${round(beta, 4)}$ s$^{-1}$. $\\omega_d = \\sqrt{\\omega_0^2 - \\beta^2} = \\sqrt{${round(w0 * w0, 3)} - ${round(beta * beta, 4)}} = ${round(wd, 2)}$ rad/s.`,
          trap: 'Using $b/m$ instead of $b/2m$ for $\\beta$.' };
      },
      verify: (p) => Math.sqrt(p.k / p.m - (p.b / (2 * p.m)) ** 2) },
    { id: 'dfo-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'logarithmic decrement',
      make(r) {
        const a1 = int(r, 8, 20), a2 = int(r, 3, a1 - 1);
        const d = Math.log(a1 / a2);
        return { q: `Successive maxima on the same side of a damped oscillation are $${a1}$ mm and $${a2}$ mm. The logarithmic decrement is ______ (to three decimal places).`,
          answer: round(d, 3), tol: 0.002, a1, a2,
          sol: `$\\delta = \\ln(${a1}/${a2}) = ${round(d, 3)}$.`, trap: 'Taking the ratio upside down gives a negative decrement.' };
      },
      verify: (p) => Math.log(p.a1 / p.a2) },
    { id: 'dfo-g03', type: 'nat', level: 2, exams: ['jam'], sub: 'bandwidth',
      make(r) {
        const f0 = choose(r, [50, 100, 256, 440, 500, 1000, 2000]), df = choose(r, [0.5, 1, 2, 4, 5, 8, 10]);
        const Q = f0 / df;
        return { q: `A resonator at $${f0}$ Hz has a power resonance curve $${df}$ Hz wide at half maximum. Its quality factor is ______ (to one decimal place).`,
          answer: round(Q, 1), tol: Math.max(0.1, round(Q * 0.005, 1)), f0, df,
          sol: `$Q = f_0/\\Delta f = ${f0}/${df} = ${round(Q, 1)}$.` };
      },
      verify: (p) => p.f0 / p.df },
    { id: 'dfo-g04', type: 'nat', level: 3, exams: ['jam'], sub: 'steady state',
      make(r) {
        const m = choose(r, [0.5, 1, 2]), k = choose(r, [50, 100, 200]), b = choose(r, [1, 2, 4, 5]), F = int(r, 1, 10);
        const w0 = Math.sqrt(k / m), w = round(w0 * pick(r, 0.5, 1.5, 0.1), 1);
        const A = (F / m) / Math.hypot(w0 * w0 - w * w, (b / m) * w);
        return { q: `A $${m}$ kg mass ($k = ${k}$ N/m, $b = ${b}$ kg/s) is driven by $${F}\\cos(${w}t)$ N. Its steady-state amplitude is ______ cm (to two decimal places).`,
          answer: round(A * 100, 2), tol: Math.max(0.02, round(A * 100 * 0.01, 2)), unit: 'cm', m, k, b, F, w,
          sol: `$\\omega_0^2 = ${round(w0 * w0, 2)}$, $b\\omega/m = ${round(b * w / m, 3)}$. $A = (F_0/m)/\\sqrt{(\\omega_0^2 - \\omega^2)^2 + (b\\omega/m)^2} = ${round(F / m, 3)}/\\sqrt{(${round(w0 * w0 - w * w, 3)})^2 + (${round(b * w / m, 3)})^2} = ${round(A, 5)}$ m $= ${round(A * 100, 2)}$ cm.`,
          trap: 'Using $\\beta\\omega$ instead of $2\\beta\\omega = b\\omega/m$ in the root.' };
      },
      verify: (p) => 100 * (p.F / p.m) / Math.hypot(p.k / p.m - p.w * p.w, (p.b / p.m) * p.w) },
    { id: 'dfo-g05', type: 'nat', level: 3, exams: ['jam'], sub: 'amplitude resonance',
      make(r) {
        const w0 = int(r, 5, 40), beta = round(w0 * pick(r, 0.05, 0.6, 0.05), 2);
        const wr = Math.sqrt(w0 * w0 - 2 * beta * beta);
        return { q: `A driven oscillator has $\\omega_0 = ${w0}$ rad/s and $\\beta = ${beta}$ s$^{-1}$. ${CONV} The displacement amplitude peaks at ______ rad/s (to two decimal places).`,
          answer: round(wr, 2), tol: 0.02, unit: 'rad/s', w0, beta,
          sol: `$\\omega_r = \\sqrt{\\omega_0^2 - 2\\beta^2} = \\sqrt{${w0 * w0} - 2(${beta})^2} = ${round(wr, 2)}$ rad/s.`,
          trap: '$\\sqrt{\\omega_0^2 - \\beta^2}$ is the free damped frequency, not the amplitude peak.' };
      },
      verify: (p) => Math.sqrt(p.w0 ** 2 - 2 * p.beta ** 2) },
    { id: 'dfo-g06', type: 'nat', level: 3, exams: ['jam'], sub: 'power',
      make(r) {
        const F = pick(r, 0.5, 5, 0.5), b = choose(r, [0.1, 0.2, 0.25, 0.5, 1, 2]);
        const P = F * F / (2 * b);
        return { q: `An oscillator with damping constant $${b}$ kg/s is driven at its natural frequency by a force of amplitude $${F}$ N. The average power it absorbs is ______ W (to two decimal places).`,
          answer: round(P, 2), tol: Math.max(0.01, round(P * 0.005, 2)), unit: 'W', F, b,
          sol: `At resonance $v_0 = F_0/b = ${round(F / b, 3)}$ m/s, in phase with the force, so $\\langle P\\rangle = \\tfrac12F_0v_0 = F_0^2/2b = ${round(P, 2)}$ W.`,
          trap: 'Leaving out the factor $\\tfrac12$ from the time average.' };
      },
      verify: (p) => p.F ** 2 / (2 * p.b) },
    { id: 'dfo-g07', type: 'mcq', level: 2, exams: ['jam'], sub: 'types of damping',
      make(r) {
        const m = choose(r, [1, 4]), k = choose(r, [4, 9, 16, 25, 36]);
        const bc = 2 * Math.sqrt(m * k), kind = choose(r, ['under', 'critical', 'over']);
        const b = kind === 'critical' ? bc : kind === 'under' ? round(bc * choose(r, [0.25, 0.5, 0.75]), 2) : round(bc * choose(r, [1.5, 2, 3]), 2);
        const opts = ['underdamped (it oscillates with decaying amplitude)', 'critically damped', 'overdamped (it creeps back without oscillating)', 'undamped (it oscillates for ever)'];
        const answer = { under: 0, critical: 1, over: 2 }[kind];
        return { q: `A system obeys $${m}\\ddot x + ${b}\\dot x + ${k}x = 0$ (SI units). It is`, options: opts, answer,
          sol: `Critical damping needs $b^2 = 4mk$, i.e. $b_c = 2\\sqrt{${m}\\times${k}} = ${round(bc, 2)}$. Here $b = ${b}$, which is ${kind === 'critical' ? 'equal to' : kind === 'under' ? 'less than' : 'more than'} $b_c$, so the system is ${opts[answer].split(' (')[0]}.`,
          trap: 'Comparing $b$ with $\\sqrt{mk}$ instead of $2\\sqrt{mk}$.' };
      } },
    { id: 'dfo-g08', type: 'nat', level: 2, exams: ['jam'], sub: 'energy decay',
      make(r) {
        const m = choose(r, [0.2, 0.5, 1, 2, 5]), b = choose(r, [0.01, 0.02, 0.05, 0.1, 0.2]);
        const t = m * Math.log(2) / b;
        return { q: `A lightly damped oscillator has mass $${m}$ kg and damping constant $${b}$ kg/s. The time for its energy to fall to half is ______ s (to one decimal place).`,
          answer: round(t, 1), tol: Math.max(0.1, round(t * 0.005, 1)), unit: 's', m, b,
          sol: `Energy $\\propto e^{-2\\beta t} = e^{-(b/m)t}$. Half when $t = (m/b)\\ln2 = (${m}/${b})\\times0.693 = ${round(t, 1)}$ s.`,
          trap: 'Using the amplitude decay rate $b/2m$ gives twice the answer.' };
      },
      verify: (p) => p.m * Math.log(2) / p.b },
  ],
};
