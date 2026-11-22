// First and second order ordinary differential equations: separable, linear (integrating factor), exact,
// constant-coefficient homogeneous and forced equations, damping, resonance, Euler-Cauchy, physical models.
// Original questions for IIT JAM, GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import more from './differential-equations.more.gen.js';
import more2 from './differential-equations.more2.gen.js';

export default {
  topic: 'differential-equations',
  items: [
    // ---- level 1 ----
    { id: 'de-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'order and degree',
      q: 'The order and degree of $\\left(\\dfrac{d^2y}{dx^2}\\right)^3 + \\left(\\dfrac{dy}{dx}\\right)^4 + y = 0$ are',
      options: ['order 2, degree 3', 'order 2, degree 4', 'order 3, degree 2', 'order 4, degree 2'], answer: 0,
      sol: 'The order is the highest derivative present: the second. The degree is the power of that highest derivative (once the equation is polynomial in derivatives): 3. The power 4 belongs to a lower derivative and does not count.',
      trap: 'Picking the largest power anywhere (4) instead of the power of the highest derivative.' },
    { id: 'de-002', type: 'nat', level: 1, exams: ['jam'], sub: 'separable',
      q: 'If $\\dfrac{dy}{dx} = -2y$ and $y(0) = 3$, then $y(0.5)$ is ______ (to two decimal places).',
      answer: 1.10, tol: 0.01, calc: () => 3 * Math.exp(-1),
      sol: 'Separate: $dy/y = -2\\,dx$, so $\\ln y = -2x + c$ and $y = 3e^{-2x}$. At $x = 0.5$: $3e^{-1} \\approx 1.10$.' },
    { id: 'de-003', type: 'mcq', level: 1, exams: ['jam'], sub: 'linearity',
      q: 'Which of these differential equations is linear in $y$?',
      options: ['$y\\,y\' + x = 0$', '$y\'\' + \\sin y = 0$', '$y\'\' + x^2 y = \\sin x$', '$(y\')^2 + y = x$'], answer: 2,
      sol: 'Linear means $y$ and its derivatives appear only to the first power, not multiplied together and not inside functions. C qualifies: the coefficient $x^2$ and the right side $\\sin x$ may depend on $x$ freely. A has $yy\'$, B has $\\sin y$ (the full pendulum), D has $(y\')^2$.',
      trap: '$x^2$ and $\\sin x$ look non-linear, but linearity is about $y$, not $x$.' },
    { id: 'de-004', type: 'mcq', level: 1, exams: ['jam', 'gate'], sub: 'constant coefficients',
      q: 'The general solution of $y\'\' + 4y = 0$ is',
      options: ['$Ae^{2x} + Be^{-2x}$', '$A\\cos4x + B\\sin4x$', '$(A + Bx)e^{2x}$', '$A\\cos2x + B\\sin2x$'], answer: 3,
      sol: 'Try $y = e^{mx}$: $m^2 + 4 = 0$, $m = \\pm2i$. Purely imaginary roots give oscillation: $y = A\\cos2x + B\\sin2x$ (simple harmonic motion with $\\omega = 2$).',
      trap: 'Option B uses $\\omega = 4$; the frequency is the square root of 4.' },
    { id: 'de-005', type: 'nat', level: 1, exams: ['jam'], sub: 'constant coefficients',
      q: 'For $y\'\' - 5y\' + 6y = 0$, solutions of the form $y = e^{mx}$ exist for two values of $m$. The larger value is ______.',
      answer: 3, tol: 0, calc: () => (5 + Math.sqrt(25 - 24)) / 2,
      sol: 'Substituting gives the auxiliary equation $m^2 - 5m + 6 = 0 = (m - 2)(m - 3)$. So $m = 2$ or $3$; the general solution is $Ae^{2x} + Be^{3x}$.' },
    { id: 'de-006', type: 'msq', level: 1, exams: ['jam'], sub: 'constant coefficients',
      q: 'Which functions are solutions of $y\'\' - y = 0$?',
      options: ['$e^{x}$', '$e^{-x}$', '$\\cosh x$', '$\\sin x$'], answer: [0, 1, 2],
      sol: 'The auxiliary equation $m^2 - 1 = 0$ gives $e^{\\pm x}$, and any combination works, including $\\cosh x = \\tfrac12(e^x + e^{-x})$. For $\\sin x$, $y\'\' - y = -2\\sin x \\ne 0$.' },

    // ---- level 2 ----
    { id: 'de-007', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'integrating factor',
      q: 'Solve $y\' + \\dfrac{y}{x} = x^2$ for $x > 0$ with $y(1) = 1$. The value of $y(2)$ is ______ (to three decimal places).',
      answer: 2.375, tol: 0.005, calc: () => (2 ** 4 / 4 + 3 / 4) / 2,
      sol: 'Integrating factor $e^{\\int dx/x} = x$. Then $(xy)\' = x^3$, so $xy = \\tfrac{x^4}{4} + C$. From $y(1) = 1$: $C = \\tfrac34$. At $x = 2$: $2y = 4 + \\tfrac34$, $y = 2.375$.',
      trap: 'Forgetting to multiply the right side by the integrating factor: $(xy)\' = x\\cdot x^2$, not $x^2$.' },
    { id: 'de-008', type: 'mcq', level: 2, exams: ['jam'], sub: 'exact equations',
      q: 'The solution of $(2xy + 3)\\,dx + (x^2 + 4y)\\,dy = 0$ is',
      options: ['$x^2y + 2y^2 = C$', '$x^2y + 3x + 2y^2 = C$', '$2xy + 3x + 4y = C$', '$x^2y + 3x + 4y^2 = C$'], answer: 1,
      sol: '$\\partial_y(2xy + 3) = 2x = \\partial_x(x^2 + 4y)$, so it is exact: $d\\phi = 0$ with $\\phi_x = 2xy + 3$, $\\phi_y = x^2 + 4y$. Integrating: $\\phi = x^2y + 3x + 2y^2$. Check: $\\phi_y = x^2 + 4y$ ✓.',
      trap: 'Option A drops the $3x$ term; D integrates $4y$ wrongly.' },
    { id: 'de-009', type: 'nat', level: 2, exams: ['jam'], sub: 'physical models',
      q: 'A quantity decays as $\\dfrac{dN}{dt} = -\\lambda N$ with $\\lambda = 0.1\\ \\mathrm{s^{-1}}$. Its half-life is ______ s (to two decimal places).',
      answer: 6.93, tol: 0.01, calc: () => Math.log(2) / 0.1, unit: 's',
      sol: '$N = N_0e^{-\\lambda t}$. Half remains when $e^{-\\lambda t} = \\tfrac12$: $t_{1/2} = \\ln2/\\lambda = 0.693/0.1 = 6.93$ s.',
      trap: '$1/\\lambda = 10$ s is the mean life, not the half-life.' },
    { id: 'de-010', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'constant coefficients',
      q: 'The general solution of $y\'\' + 2y\' + y = 0$ is',
      options: ['$Ae^{-x} + Be^{-x}$', '$(A + Bx)e^{-x}$', '$Ae^{x} + Bxe^{x}$', '$e^{-x}(A\\cos x + B\\sin x)$'], answer: 1,
      sol: '$m^2 + 2m + 1 = (m + 1)^2$: a double root $m = -1$. The second solution is $x$ times the first: $y = (A + Bx)e^{-x}$.',
      trap: 'Option A is really one constant ($A + B$) times one function, so it cannot fit two initial conditions.' },
    { id: 'de-011', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'damping',
      q: 'The oscillator $\\ddot x + b\\dot x + 9x = 0$ is critically damped when $b =$ ______.',
      answer: 6, tol: 0, calc: () => 2 * Math.sqrt(9),
      sol: 'Roots $m = \\tfrac12\\left(-b \\pm\\sqrt{b^2 - 36}\\right)$. Critical damping is the double root: $b^2 = 36$, $b = 6$ (that is $2\\omega_0$ with $\\omega_0 = 3$).',
      trap: 'Answering 3 ($\\omega_0$) instead of $2\\omega_0$.' },
    { id: 'de-012', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'wronskian',
      q: 'The Wronskian $W = y_1y_2\' - y_2y_1\'$ of $y_1 = e^{x}$ and $y_2 = e^{2x}$ is',
      options: ['$e^{3x}$', '$0$', '$3e^{3x}$', '$-e^{3x}$'], answer: 0,
      sol: '$W = e^x\\cdot2e^{2x} - e^{2x}\\cdot e^x = e^{3x}$. It is never zero, so the two solutions are independent.' },
    { id: 'de-013', type: 'nat', level: 2, exams: ['jam'], sub: 'physical models',
      q: 'A cup of tea cools from $100^\\circ$C to $60^\\circ$C in 10 minutes in a room at $20^\\circ$C (Newton\'s law: $\\dot T = -k(T - 20)$). After 20 minutes in total, its temperature is ______ $^\\circ$C.',
      answer: 40, tol: 0.1, calc: () => 20 + 80 * (40 / 80) ** 2, unit: '°C',
      sol: '$T - 20 = 80e^{-kt}$. After 10 min: $40 = 80e^{-10k}$, so $e^{-10k} = \\tfrac12$. After 20 min: $80\\times\\tfrac14 = 20$ above room temperature, so $40^\\circ$C.',
      trap: 'Assuming a steady fall of $40^\\circ$ per 10 minutes, which would give $20^\\circ$C. It is the excess over the room that halves.' },
    { id: 'de-014', type: 'mcq', level: 2, exams: ['jam'], sub: 'separable',
      q: 'The solution of $\\dfrac{dy}{dx} = xy$ with $y(0) = 1$ is',
      options: ['$y = e^{x^2}$', '$y = 1 + \\tfrac{x^2}{2}$', '$y = e^{x^2/2}$', '$y = e^{x}$'], answer: 2,
      sol: 'Separate: $\\int dy/y = \\int x\\,dx$, so $\\ln y = \\tfrac{x^2}{2} + c$; $y(0) = 1$ gives $c = 0$, so $y = e^{x^2/2}$. Check: $y\' = xe^{x^2/2} = xy$ ✓.' },
    { id: 'de-015', type: 'msq', level: 2, exams: ['jam', 'gate'], sub: 'constant coefficients',
      q: 'Which of these (complex-valued solutions allowed) satisfy $y\'\' + 9y = 0$?',
      options: ['$\\sin3x$', '$\\cos3x + 2\\sin3x$', '$e^{3ix}$', '$\\cos9x$'], answer: [0, 1, 2],
      sol: 'The roots are $m = \\pm3i$, so $e^{\\pm3ix}$ and every combination, such as $\\sin3x$ and $\\cos3x + 2\\sin3x$, are solutions. $\\cos9x$ gives $y\'\' + 9y = (-81 + 9)\\cos9x \\ne 0$.' },
    { id: 'de-016', type: 'nat', level: 2, exams: ['jam'], sub: 'non-linear',
      q: 'For $\\dfrac{dy}{dx} = y^2$ with $y(0) = 1$, the value of $y(0.5)$ is ______.',
      answer: 2, tol: 0.01, calc: () => 1 / (1 - 0.5),
      sol: 'Separate: $\\int y^{-2}dy = \\int dx$, so $-\\tfrac1y = x + c$; $y(0) = 1$ gives $c = -1$, so $y = \\dfrac{1}{1 - x}$. At $x = 0.5$, $y = 2$. (The solution blows up at $x = 1$: non-linear equations can do that.)' },

    // ---- level 3 ----
    { id: 'de-017', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'forced equations',
      q: 'A particular solution of $y\'\' + y = 3e^{2x}$ is $Ae^{2x}$. The value of $A$ is ______ (to one decimal place).',
      answer: 0.6, tol: 0.01, calc: () => 3 / (4 + 1),
      sol: 'Substitute $y = Ae^{2x}$: $4Ae^{2x} + Ae^{2x} = 3e^{2x}$, so $5A = 3$, $A = 0.6$.' },
    { id: 'de-018', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'resonance',
      q: 'A particular solution of $y\'\' + 4y = \\sin2x$ is',
      options: ['$-\\tfrac{1}{4}x\\cos2x$', '$\\tfrac{1}{4}\\sin2x$', '$-\\tfrac{1}{2}x\\cos2x$', '$\\tfrac{1}{4}x\\sin2x$'], answer: 0,
      sol: 'The forcing frequency equals the natural one, so $A\\sin2x$ fails (it solves the homogeneous equation). Try $y = Bx\\cos2x$: $y\'\' = -4B\\sin2x - 4Bx\\cos2x$, so $y\'\' + 4y = -4B\\sin2x$. Set $-4B = 1$: $B = -\\tfrac14$. The amplitude grows with $x$: resonance.',
      trap: 'Option B gives $y\'\' + 4y = 0$, not $\\sin2x$.' },
    { id: 'de-019', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'damping',
      q: 'The solutions of $\\ddot x + 2\\dot x + 10x = 0$ oscillate with angular frequency ______ rad/s.',
      answer: 3, tol: 0, calc: () => Math.sqrt(10 - 1), unit: 'rad/s',
      sol: '$m^2 + 2m + 10 = 0$ gives $m = -1 \\pm 3i$. So $x = e^{-t}(A\\cos3t + B\\sin3t)$: angular frequency 3 rad/s, decay rate 1 s$^{-1}$.',
      trap: '$\\sqrt{10} \\approx 3.16$ is the undamped frequency; damping lowers it to $\\sqrt{\\omega_0^2 - \\gamma^2}$.' },
    { id: 'de-020', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'euler-cauchy',
      q: 'The general solution of $x^2y\'\' - 2xy\' + 2y = 0$ ($x > 0$) is',
      options: ['$Ae^{x} + Be^{2x}$', '$Ax + Bx^2$', '$Ax^{-1} + Bx^{-2}$', '$(A + B\\ln x)x$'], answer: 1,
      sol: 'For an Euler-Cauchy equation try $y = x^m$: $m(m - 1) - 2m + 2 = m^2 - 3m + 2 = 0$, so $m = 1, 2$. Hence $y = Ax + Bx^2$. Check $y = x^2$: $2x^2 - 4x^2 + 2x^2 = 0$ ✓.',
      trap: 'Option A treats it as constant-coefficient, but the coefficients $x^2$ and $x$ change the trial function to a power.' },
    { id: 'de-021', type: 'nat', level: 3, exams: ['jam'], sub: 'physical models',
      q: 'A capacitor charges through a resistor with time constant $RC = 2$ ms. The time for its charge to reach 90% of the final value is ______ ms (to two decimal places).',
      answer: 4.61, tol: 0.01, calc: () => 2 * Math.log(10), unit: 'ms',
      sol: '$R\\dot q + q/C = V$ gives $q = CV(1 - e^{-t/RC})$. 90% means $e^{-t/RC} = 0.1$, so $t = RC\\ln10 = 2\\times2.303 = 4.61$ ms.',
      trap: '$RC\\ln0.9$ is the time for the remaining gap to fall by 10%, which is the wrong way round.' },
    { id: 'de-022', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'damping',
      q: 'For $y\'\' + py\' + qy = 0$ with constants $p > 0$ and $q > 0$, which are true?',
      options: ['Every solution tends to 0 as $x\\to\\infty$.', 'Solutions oscillate if $p^2 < 4q$.', 'If $p^2 > 4q$, no solution oscillates.', 'If $p^2 \\ge 4q$, a solution can cross zero infinitely many times.'], answer: [0, 1, 2],
      sol: 'Roots $m = \\tfrac12(-p \\pm\\sqrt{p^2 - 4q})$. With $p, q > 0$ both roots have negative real part (A). $p^2 < 4q$: complex roots, decaying oscillation (B). $p^2 > 4q$: two negative real roots, an overdamped decay (C). With real roots a solution $Ae^{m_1x} + Be^{m_2x}$ (or $(A + Bx)e^{mx}$) crosses zero at most once, so D is false.' },
    { id: 'de-023', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'resonance',
      q: 'The steady-state amplitude of $\\ddot x + 2\\dot x + 25x = 10\\cos5t$ is ______.',
      answer: 1, tol: 0.01, calc: () => 10 / Math.sqrt((25 - 25) ** 2 + (2 * 5) ** 2),
      sol: 'For $\\ddot x + 2\\beta\\dot x + \\omega_0^2x = F\\cos\\omega t$ the steady amplitude is $\\dfrac{F}{\\sqrt{(\\omega_0^2 - \\omega^2)^2 + (2\\beta\\omega)^2}}$. Here $\\omega_0^2 = \\omega^2 = 25$ and $2\\beta\\omega = 2\\times5 = 10$, so the amplitude is $10/10 = 1$. Damping keeps it finite at resonance.',
      trap: 'Without damping the formula blows up; with it, the amplitude at resonance is $F/(2\\beta\\omega_0)$.' },
    { id: 'de-024', type: 'mcq', level: 3, exams: ['jam'], sub: 'integrating factor',
      q: 'The general solution of $y\' = \\dfrac{y}{x} + 1$ for $x > 0$ is',
      options: ['$y = x\\ln x + Cx$', '$y = x + C$', '$y = Cx - 1$', '$y = \\ln x + Cx$'], answer: 0,
      sol: 'Write it as $y\' - y/x = 1$; integrating factor $e^{-\\ln x} = 1/x$. Then $(y/x)\' = 1/x$, so $y/x = \\ln x + C$ and $y = x\\ln x + Cx$. Check: $y\' = \\ln x + 1 + C = y/x + 1$ ✓.' },
    { id: 'de-025', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'initial value problems',
      q: 'Solve $y\'\' - 3y\' + 2y = 0$ with $y(0) = 0$, $y\'(0) = 1$. The value of $y(\\ln2)$ is ______.',
      answer: 2, tol: 0, calc: () => Math.exp(2 * Math.log(2)) - Math.exp(Math.log(2)),
      sol: 'Roots 1 and 2: $y = Ae^x + Be^{2x}$. $A + B = 0$ and $A + 2B = 1$ give $B = 1$, $A = -1$: $y = e^{2x} - e^x$. At $x = \\ln2$: $4 - 2 = 2$.' },
    { id: 'de-026', type: 'mcq', level: 3, exams: ['jam'], sub: 'integrating factor',
      q: 'An integrating factor for $y\' + (\\tan x)\\,y = \\cos x$ is',
      options: ['$\\cos x$', '$e^{\\tan x}$', '$\\sec x$', '$\\ln\\sec x$'], answer: 2,
      sol: '$e^{\\int\\tan x\\,dx} = e^{\\ln\\sec x} = \\sec x$. Then $(y\\sec x)\' = 1$ and $y = (x + C)\\cos x$.',
      trap: '$e^{\\tan x}$ forgets to integrate $\\tan x$ first.' },
    { id: 'de-027', type: 'nat', level: 3, exams: ['jam'], sub: 'physical models',
      q: 'A body falls from rest with linear drag: $m\\dot v = mg - bv$, with $m/b = 3$ s. The time for it to reach half its terminal speed is ______ s (to two decimal places).',
      answer: 2.08, tol: 0.01, calc: () => 3 * Math.log(2), unit: 's',
      sol: '$v = v_t(1 - e^{-bt/m})$ with $v_t = mg/b$. Half the terminal speed: $e^{-t/3} = \\tfrac12$, so $t = 3\\ln2 \\approx 2.08$ s.' },
    { id: 'de-028', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'forced equations',
      q: 'For $y\'\' - 2y\' + y = e^{x}$, which statements are correct?',
      options: ['A trial $y_p = Ae^{x}$ cannot work.', 'A trial $y_p = Axe^{x}$ cannot work either.', '$y_p = \\tfrac12x^2e^{x}$ is a particular solution.', '$y_p = x^2e^{x}$ is a particular solution.'], answer: [0, 1, 2],
      sol: 'The auxiliary equation $(m - 1)^2 = 0$ has the double root 1, so $e^x$ and $xe^x$ both solve the homogeneous equation and give 0 on the left (A, B). For $y = u(x)e^x$ the left side becomes $u\'\'e^x$, so we need $u\'\' = 1$: $u = \\tfrac12x^2$ (C, not D).' },

    // ---- level 4 ----
    { id: 'de-029', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'initial value problems',
      q: 'Solve $y\'\' + y = x^2$ with $y(0) = 0$, $y\'(0) = 0$. The value of $y(\\pi)$ is ______ (to two decimal places).',
      answer: 5.87, tol: 0.01, calc: () => Math.PI ** 2 - 2 + 2 * Math.cos(Math.PI),
      sol: 'Try $y_p = ax^2 + bx + c$: $2a + ax^2 + bx + c = x^2$ gives $a = 1$, $b = 0$, $c = -2$. So $y = x^2 - 2 + A\\cos x + B\\sin x$. $y(0) = 0$: $A = 2$. $y\'(0) = 0$: $B = 0$. $y(\\pi) = \\pi^2 - 2 - 2 = \\pi^2 - 4 \\approx 5.87$.',
      trap: 'Forgetting the constant $-2$ in $y_p$ (the $2a$ from $y_p\'\'$).' },
    { id: 'de-030', type: 'mcq', level: 4, exams: ['gate', 'jam'], sub: 'variation of parameters',
      q: 'A particular solution of $y\'\' + y = \\sec x$ on $|x| < \\pi/2$ is',
      options: ['$x\\cos x + \\sin x\\ln|\\cos x|$', '$x\\sin x + \\cos x\\ln|\\cos x|$', '$\\sec x\\tan x$', '$x\\sin x - \\cos x\\ln|\\cos x|$'], answer: 1,
      sol: 'Variation of parameters with $y_1 = \\cos x$, $y_2 = \\sin x$, $W = 1$: $y_p = -y_1\\int y_2\\sec x\\,dx + y_2\\int y_1\\sec x\\,dx = -\\cos x\\int\\tan x\\,dx + \\sin x\\int1\\,dx = \\cos x\\ln|\\cos x| + x\\sin x$.',
      trap: 'Undetermined coefficients cannot handle $\\sec x$; that is why this needs variation of parameters.' },
    { id: 'de-031', type: 'nat', level: 4, exams: ['jam'], sub: 'damping',
      q: 'A series LCR circuit has $L = 0.1$ H and $C = 10\\ \\mu$F. The resistance that makes it critically damped is ______ $\\Omega$.',
      answer: 200, tol: 0.5, calc: () => 2 * Math.sqrt(0.1 / 10e-6), unit: 'Ω',
      sol: '$L\\ddot q + R\\dot q + q/C = 0$, auxiliary equation $Lm^2 + Rm + 1/C = 0$. Critical: $R^2 = 4L/C$, so $R = 2\\sqrt{L/C} = 2\\sqrt{0.1/10^{-5}} = 2\\sqrt{10^4} = 200\\ \\Omega$.',
      trap: 'Using $\\mu$F as $10^{-3}$ or forgetting the factor 2.' },
    { id: 'de-032', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'non-linear',
      q: 'For the non-linear equation $y\' = y^2$, which are true?',
      options: ['The sum of two solutions is in general not a solution.', '$y = 0$ is a solution.', 'The solution with $y(0) = 1$ exists for all real $x$.', 'Every non-zero solution has the form $y = -1/(x + C)$.'], answer: [0, 1, 3],
      sol: 'D: separating gives $-1/y = x + C$. A: $(y_1 + y_2)\' = y_1^2 + y_2^2 \\ne (y_1 + y_2)^2$, so superposition fails. B: trivially. C: false; $y = 1/(1 - x)$ blows up at $x = 1$.' },
    { id: 'de-033', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'forced equations',
      q: 'The amplitude of the particular solution of $\\ddot x + 9x = \\cos2t$ (of the form $A\\cos2t$) is ______ (to one decimal place).',
      answer: 0.2, tol: 0.01, calc: () => 1 / (9 - 4),
      sol: 'Substitute $x = A\\cos2t$: $-4A + 9A = 1$, so $A = \\tfrac15 = 0.2$. In general $A = F/(\\omega_0^2 - \\omega^2)$ for an undamped oscillator driven off resonance.' },
    { id: 'de-034', type: 'mcq', level: 4, exams: ['gate', 'net', 'jam'], sub: 'series solutions',
      q: 'For Bessel\'s equation $x^2y\'\' + xy\' + (x^2 - n^2)y = 0$, the point $x = 0$ is',
      options: ['an ordinary point', 'a regular singular point', 'an irregular singular point', 'not a singular point for $n = 0$'], answer: 1,
      sol: 'In standard form $y\'\' + \\tfrac1x y\' + \\tfrac{x^2 - n^2}{x^2}y = 0$. The coefficients blow up at 0, so it is singular, but $x\\cdot\\tfrac1x = 1$ and $x^2\\cdot\\tfrac{x^2 - n^2}{x^2} = x^2 - n^2$ are finite: a regular singular point. That is why a Frobenius series $x^s\\sum a_kx^k$ works there.' },
    { id: 'de-035', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'systems',
      q: 'The system $\\dot x = 3x + y$, $\\dot y = x + 3y$ has solutions of the form $e^{\\lambda t}\\vec v$. The largest growth rate $\\lambda$ is ______.',
      answer: 4, tol: 0, calc: () => 3 + 1,
      sol: 'The matrix $\\begin{pmatrix} 3 & 1 \\\\ 1 & 3 \\end{pmatrix}$ has eigenvalues $3\\pm1$: 4 (along $(1,1)$) and 2 (along $(1,-1)$). Largest: 4. (See the matrices lesson: a linear system is solved by the eigenvalues of its matrix.)' },
    { id: 'de-036', type: 'mcq', level: 4, exams: ['jam'], sub: 'damping',
      q: 'For $\\ddot x + 0.2\\dot x + x = 0$ (time in seconds), the amplitude of the oscillation halves in about',
      options: ['$3.47$ s', '$6.93$ s', '$0.35$ s', '$13.9$ s'], answer: 1,
      sol: 'With $2\\gamma = 0.2$ the solution is $e^{-0.1t}\\times$(oscillation). The envelope halves when $e^{-0.1t} = \\tfrac12$: $t = 10\\ln2 \\approx 6.93$ s.',
      trap: 'Using $e^{-0.2t}$ (the full coefficient) gives 3.47 s; the decay rate is half the coefficient of $\\dot x$.' },
    { id: 'de-039', type: 'nat', level: 4, exams: ['jam'], sub: 'non-linear',
      q: 'A body slows under quadratic drag: $\\dot v = -0.1\\,v^2$ (SI), starting at $v = 10$ m/s. The time for its speed to halve is ______ s.',
      answer: 1, tol: 0.01, calc: () => (1 / 5 - 1 / 10) / 0.1, unit: 's',
      sol: 'Separate: $\\int v^{-2}dv = -0.1\\int dt$, so $\\tfrac1v - \\tfrac1{10} = 0.1t$. At $v = 5$: $0.2 - 0.1 = 0.1t$, $t = 1$ s. Note the decay is not exponential: halving again takes 2 s more.',
      trap: 'Treating it like linear drag and using $\\ln2$ gives a wrong time.' },
    { id: 'de-042', type: 'mcq', level: 4, exams: ['jam', 'gate'], sub: 'euler-cauchy',
      q: 'Which equation has general solution $y = Ax + \\dfrac{B}{x}$?',
      options: ['$x^2y\'\' + xy\' - y = 0$', '$x^2y\'\' - xy\' + y = 0$', '$y\'\' - y = 0$', '$x^2y\'\' + 2xy\' - 2y = 0$'], answer: 0,
      sol: 'For $y = x^m$ the Euler-Cauchy equation $x^2y\'\' + axy\' + by = 0$ gives $m(m-1) + am + b = 0$. We need $m = \\pm1$, i.e. $m^2 - 1 = 0$: $a = 1$, $b = -1$. Option B gives $(m - 1)^2 = 0$; D gives $m = 1, -2$.' },

    // ---- level 5 ----
    { id: 'de-037', type: 'nat', level: 5, exams: ['gate', 'net', 'jam'], sub: 'initial value problems',
      q: 'Solve $y\'\' + 4y\' + 13y = 0$ with $y(0) = 1$, $y\'(0) = 0$. The first positive $x$ where $y = 0$ is ______ (to two decimal places).',
      answer: 0.72, tol: 0.01, calc: () => (Math.PI - Math.atan(1.5)) / 3,
      sol: 'Roots $-2 \\pm 3i$: $y = e^{-2x}(A\\cos3x + B\\sin3x)$. $y(0) = 1$ gives $A = 1$; $y\'(0) = -2A + 3B = 0$ gives $B = \\tfrac23$. Zero when $\\cos3x + \\tfrac23\\sin3x = 0$, i.e. $\\tan3x = -\\tfrac32$. The first positive solution has $3x$ in the second quadrant: $3x = \\pi - \\tan^{-1}1.5 = 3.1416 - 0.9828 = 2.1588$, so $x \\approx 0.72$.',
      trap: 'Taking $3x = \\tan^{-1}(-1.5) < 0$, or forgetting the $-2A$ from differentiating $e^{-2x}$, which would make $B = 0$.' },
    { id: 'de-038', type: 'mcq', level: 5, exams: ['gate', 'jam'], sub: 'exact equations',
      q: 'The equation $(3xy + y^2)\\,dx + (x^2 + xy)\\,dy = 0$ becomes exact after multiplying by an integrating factor. Its general solution is',
      options: ['$x^3y + \\tfrac12x^2y^2 = C$', '$x^2y + xy^2 = C$', '$3x^2y + y^3 = C$', '$xy(x + y) = C$'], answer: 0,
      sol: '$M_y = 3x + 2y$, $N_x = 2x + y$: not exact. $(M_y - N_x)/N = (x + y)/(x(x + y)) = 1/x$ depends on $x$ only, so the factor is $e^{\\int dx/x} = x$. Then $(3x^2y + xy^2)dx + (x^3 + x^2y)dy = 0$ is exact with $\\phi = x^3y + \\tfrac12x^2y^2$. Check: $\\phi_y = x^3 + x^2y$ ✓.',
      trap: 'Option D integrates the original (non-exact) form, which does not satisfy the equation.' },
    { id: 'de-040', type: 'msq', level: 5, exams: ['gate', 'net', 'jam'], sub: 'resonance',
      q: 'For the undamped driven oscillator $\\ddot y + \\omega_0^2y = F\\cos\\omega t$ with $\\omega \\ne \\omega_0$ and $y(0) = \\dot y(0) = 0$, which are true?',
      options: ['$y = \\dfrac{F(\\cos\\omega t - \\cos\\omega_0t)}{\\omega_0^2 - \\omega^2}$', '$y$ stays bounded for all $t$.', 'As $\\omega\\to\\omega_0$, $y\\to\\dfrac{Ft\\sin\\omega_0t}{2\\omega_0}$.', 'The $\\cos\\omega_0t$ part is a transient that dies away.'], answer: [0, 1, 2],
      sol: 'A: the particular part is $F\\cos\\omega t/(\\omega_0^2 - \\omega^2)$; the homogeneous part $-F\\cos\\omega_0t/(\\omega_0^2 - \\omega^2)$ makes $y(0) = 0$, and $\\dot y(0) = 0$ automatically. B: a sum of two bounded cosines (it shows beats). C: write $\\omega = \\omega_0 + \\epsilon$; the top is $\\approx -\\epsilon t\\sin\\omega_0t$ and the bottom $\\approx -2\\omega_0\\epsilon$. D: false; with no damping nothing dies away.' },
    { id: 'de-041', type: 'nat', level: 5, exams: ['gate', 'net', 'jam'], sub: 'euler-cauchy',
      q: 'Solve $x^2y\'\' - 3xy\' + 4y = 0$ with $y(1) = 1$, $y\'(1) = 0$. The value of $y(e)$ is ______ (to two decimal places).',
      answer: -7.39, tol: 0.01, calc: () => Math.E ** 2 * (1 - 2),
      sol: 'Try $x^m$: $m(m-1) - 3m + 4 = (m - 2)^2 = 0$, a double root. So $y = x^2(A + B\\ln x)$. $y(1) = A = 1$. $y\' = 2x(A + B\\ln x) + Bx$, so $y\'(1) = 2 + B = 0$, $B = -2$. $y(e) = e^2(1 - 2) = -e^2 \\approx -7.39$.',
      trap: 'For a double root of an Euler-Cauchy equation the second solution is $x^m\\ln x$, not $x\\cdot x^m$.' },
    { id: 'de-043', type: 'nat', level: 5, exams: ['gate', 'net', 'jam'], sub: 'resonance',
      q: 'For $\\ddot x + 2\\dot x + 10x = F\\cos\\omega t$, the steady-state amplitude is largest at $\\omega =$ ______ rad/s (to two decimal places).',
      answer: 2.83, tol: 0.01, calc: () => Math.sqrt(10 - 2 * 1 ** 2), unit: 'rad/s',
      sol: 'The amplitude is $F/\\sqrt{(\\omega_0^2 - \\omega^2)^2 + 4\\beta^2\\omega^2}$ with $\\omega_0^2 = 10$, $\\beta = 1$. Minimise the square root\'s argument in $u = \\omega^2$: derivative $-2(\\omega_0^2 - u) + 4\\beta^2 = 0$, so $u = \\omega_0^2 - 2\\beta^2 = 8$ and $\\omega = \\sqrt8 \\approx 2.83$.',
      trap: 'Three different frequencies: natural $\\sqrt{10} = 3.16$, free damped $\\sqrt{10 - 1} = 3$, and amplitude resonance $\\sqrt{10 - 2} = 2.83$.' },
    ...more2,
  ],
  gens: [
    { id: 'de-g01', type: 'nat', level: 1, exams: ['jam'], sub: 'separable',
      make(r) {
        const k = pick(r, 0.1, 1, 0.1), y0 = int(r, 2, 20), t = int(r, 1, 6);
        const answer = round(y0 * Math.exp(-k * t), 3);
        return { q: `If $\\dfrac{dy}{dt} = -${k}\\,y$ and $y(0) = ${y0}$, then $y(${t})$ is ______ (to three decimal places).`,
          answer, tol: Math.max(0.002, answer * 0.005), k, y0, t,
          sol: `Separating gives $y = y_0e^{-kt} = ${y0}e^{-${k}\\times${t}} = ${y0}e^{-${round(k * t, 2)}} = ${answer}$.` };
      },
      verify: (p) => p.y0 * Math.exp(-p.k * p.t) },
    { id: 'de-g02', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'initial value problems',
      make(r) {
        const m1 = int(r, 1, 4), m2 = -int(r, 1, 4), x = choose(r, [0.25, 0.5, 1]);
        const S = m1 + m2, P = m1 * m2;
        const answer = round((Math.exp(m1 * x) - Math.exp(m2 * x)) / (m1 - m2), 3);
        const mid = S === 0 ? '' : ` ${S > 0 ? '-' : '+'} ${Math.abs(S) === 1 ? '' : Math.abs(S)}y'`;
        return { q: `Solve $y''${mid} - ${-P}y = 0$ with $y(0) = 0$, $y'(0) = 1$. The value of $y(${x})$ is ______ (to three decimal places).`,
          answer, tol: 0.003, m1, m2, x,
          sol: `Auxiliary equation $m^2 ${S === 0 ? '' : (S > 0 ? `- ${S}m` : `+ ${-S}m`)} - ${-P} = (m - ${m1})(m + ${-m2}) = 0$: $m = ${m1}, ${m2}$. With $y = Ae^{${m1}x} + Be^{${m2}x}$, $A + B = 0$ and $${m1}A ${m2 < 0 ? '-' : '+'} ${Math.abs(m2)}B = 1$ give $A = -B = \\tfrac{1}{${m1 - m2}}$. So $y(${x}) = \\dfrac{e^{${round(m1 * x, 2)}} - e^{${round(m2 * x, 2)}}}{${m1 - m2}} = ${answer}$.` };
      },
      verify: (p) => (Math.exp(p.m1 * p.x) - Math.exp(p.m2 * p.x)) / (p.m1 - p.m2) },
    { id: 'de-g03', type: 'nat', level: 2, exams: ['jam', 'gate'], sub: 'damping',
      make(r) {
        const m = choose(r, [1, 2, 4, 0.5]), k = choose(r, [2, 8, 18, 32, 50]);
        const answer = round(2 * Math.sqrt(m * k), 2);
        return { q: `A mass $m = ${m}$ kg on a spring $k = ${k}$ N/m moves as $m\\ddot x + b\\dot x + kx = 0$. The value of $b$ for critical damping is ______ kg/s (to two decimal places).`,
          answer, tol: 0.01, unit: 'kg/s', m, k,
          sol: `Auxiliary equation $mr^2 + br + k = 0$ has a double root when $b^2 = 4mk$: $b = 2\\sqrt{mk} = 2\\sqrt{${m}\\times${k}} = ${answer}$ kg/s.`,
          trap: 'The condition is on $b^2 = 4mk$, not $b = \\omega_0$.' };
      },
      verify: (p) => 2 * Math.sqrt(p.m * p.k) },
    { id: 'de-g04', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'damping',
      make(r) {
        const g = int(r, 1, 3), w0 = int(r, g + 1, 8);
        const answer = round(Math.sqrt(w0 * w0 - g * g), 3);
        return { q: `The solutions of $\\ddot x + ${2 * g}\\dot x + ${w0 * w0}x = 0$ oscillate with angular frequency ______ rad/s (to three decimal places).`,
          answer, tol: 0.002, unit: 'rad/s', g, w0,
          sol: `$m^2 + ${2 * g}m + ${w0 * w0} = 0$ gives $m = -${g} \\pm i\\sqrt{${w0 * w0} - ${g * g}}$. The oscillation frequency is $\\sqrt{${w0 * w0 - g * g}} = ${answer}$ rad/s, below the undamped value $${w0}$.`,
          trap: 'Use half the coefficient of $\\dot x$: $\\gamma = ' + g + '$, not ' + 2 * g + '.' };
      },
      verify: (p) => Math.sqrt(p.w0 ** 2 - p.g ** 2) },
    { id: 'de-g05', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'forced equations',
      make(r) {
        let a, b, k, D;
        do { a = int(r, -3, 3); b = int(r, -4, 6); k = int(r, 1, 3); D = k * k + a * k + b; } while (D === 0);
        const c = int(r, 1, 9);
        const answer = round(c / D, 3);
        const ay = a === 0 ? '' : ` ${a < 0 ? '-' : '+'} ${Math.abs(a) === 1 ? '' : Math.abs(a)}y'`;
        const by = b === 0 ? '' : ` ${b < 0 ? '-' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}y`;
        return { q: `A particular solution of $y''${ay}${by} = ${c}e^{${k === 1 ? '' : k}x}$ has the form $Ae^{${k === 1 ? '' : k}x}$. Find $A$ (to three decimal places).`,
          answer, tol: 0.002, a, b, c, k,
          sol: `Substituting $y = Ae^{${k}x}$ gives $A(${k}^2 + (${a})(${k}) + (${b}))e^{${k}x} = ${c}e^{${k}x}$, so $A = ${c}/${D} = ${answer}$.` };
      },
      verify: (p) => p.c / (p.k * p.k + p.a * p.k + p.b) },
    { id: 'de-g06', type: 'nat', level: 2, exams: ['jam'], sub: 'physical models',
      make(r) {
        const RC = choose(r, [0.5, 1, 2, 4.7, 10]), f = choose(r, [50, 63, 75, 90, 95, 99]);
        const answer = round(-RC * Math.log(1 - f / 100), 3);
        return { q: `A capacitor charges through a resistor with time constant $RC = ${RC}$ ms. The time for it to reach ${f}% of its final charge is ______ ms (to three decimal places).`,
          answer, tol: Math.max(0.002, answer * 0.003), unit: 'ms', RC, f,
          sol: `$q = q_\\infty(1 - e^{-t/RC})$. Setting $1 - e^{-t/RC} = ${f / 100}$: $t = -RC\\ln(1 - ${f / 100}) = ${RC}\\times${round(-Math.log(1 - f / 100), 4)} = ${answer}$ ms.` };
      },
      verify: (p) => -p.RC * Math.log(1 - p.f / 100) },
    { id: 'de-g07', type: 'nat', level: 3, exams: ['jam'], sub: 'physical models',
      make(r) {
        const Ta = int(r, 15, 30), T0 = int(r, 70, 100), t1 = int(r, 5, 15), n = choose(r, [2, 3]);
        const ex1 = choose(r, [0.5, 0.6, 0.75, 0.8]);
        const T1 = round(Ta + (T0 - Ta) * ex1, 1);
        const ratio = (T1 - Ta) / (T0 - Ta);
        const answer = round(Ta + (T0 - Ta) * ratio ** n, 2);
        return { q: `An object at $${T0}^\\circ$C cools in a room at $${Ta}^\\circ$C following Newton's law $\\dot T = -k(T - T_a)$. After ${t1} minutes it is at $${T1}^\\circ$C. Its temperature after ${n * t1} minutes is ______ $^\\circ$C (to two decimal places).`,
          answer, tol: 0.05, unit: '°C', Ta, T0, T1, n,
          sol: `$T - ${Ta} = ${T0 - Ta}e^{-kt}$. After ${t1} min the excess has fallen by the factor $${round(T1 - Ta, 1)}/${T0 - Ta} = ${round(ratio, 4)}$. After ${n} such intervals it is $${T0 - Ta}\\times${round(ratio, 4)}^{${n}}$, so $T = ${Ta} + ${round((T0 - Ta) * ratio ** n, 2)} = ${answer}^\\circ$C.`,
          trap: 'The temperature does not fall by equal steps; the excess over the room shrinks by equal factors.' };
      },
      verify: (p) => p.Ta + (p.T0 - p.Ta) * ((p.T1 - p.Ta) / (p.T0 - p.Ta)) ** p.n },
    { id: 'de-g08', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'integrating factor',
      make(r) {
        const n = int(r, 1, 3), m = int(r, 0, 3), y1 = int(r, 0, 4);
        const s = m + n + 1, C = y1 - 1 / s;
        const answer = round(2 ** (m + 1) / s + C * 2 ** -n, 3);
        return { q: `Solve $y' + \\dfrac{${n}}{x}y = x^{${m}}$ for $x > 0$ with $y(1) = ${y1}$. The value of $y(2)$ is ______ (to three decimal places).`,
          answer, tol: 0.002, n, m, y1,
          sol: `Integrating factor $e^{\\int ${n}\\,dx/x} = x^{${n}}$. Then $(x^{${n}}y)' = x^{${m + n}}$, so $x^{${n}}y = \\dfrac{x^{${s}}}{${s}} + C$. From $y(1) = ${y1}$: $C = ${y1} - \\tfrac{1}{${s}} = ${round(C, 4)}$. At $x = 2$: $y = \\dfrac{2^{${m + 1}}}{${s}} + ${round(C, 4)}\\cdot2^{-${n}} = ${answer}$.`,
          trap: 'Multiply the right side by the integrating factor too: $x^' + n + '\\cdot x^' + m + '$.' };
      },
      verify: (p) => 2 ** (p.m + 1) / (p.m + p.n + 1) + (p.y1 - 1 / (p.m + p.n + 1)) * 2 ** -p.n },
    ...more,
  ],
};
