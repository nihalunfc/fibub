// Round 4 extras for differential-equations: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'de-r4-01', type: 'mcq', level: 1, exams: ['jam'], sub: 'linearity',
      q: R`Two different functions $y_1$ and $y_2$ both satisfy $y'' + y = x$. Their difference $y_1 - y_2$ satisfies`,
      options: [R`$y'' + y = x$`, R`$y'' + y = 2x$`, R`$y'' + y = 0$`, 'no particular equation'], answer: 2,
      sol: R`Subtract the two equations: $(y_1 - y_2)'' + (y_1 - y_2) = x - x = 0$. This works because the left side is linear. It is why the general solution is one particular solution plus the general solution of the homogeneous equation.`,
      trap: R`The sum $y_1 + y_2$ would satisfy the equation with $2x$; the difference cancels the forcing.` },
    { id: 'de-r4-02', type: 'mcq', level: 2, exams: ['jam'], sub: 'non-linear',
      q: R`For $\dfrac{dy}{dt} = y^2 - 4$, the constant (equilibrium) solutions and their stability are`,
      options: [R`$y = 2$ stable and $y = -2$ unstable`, R`only $y = 0$, stable`, R`$y = \pm2$, both stable`, R`$y = -2$ stable and $y = 2$ unstable`], answer: 3,
      sol: R`Equilibria are where $y^2 - 4 = 0$: $y = \pm2$. Just above $y = 2$ the slope is positive, so $y$ runs away upward; just below, it is negative, so $y$ runs away downward: unstable. Near $y = -2$: for $-2 < y < 2$ the slope is negative (falls towards $-2$), for $y < -2$ it is positive (rises towards $-2$): stable. Test: $f'(y) = 2y$ is negative at $-2$ (stable) and positive at $2$ (unstable).`,
      trap: R`Stability is decided by the sign of $f'(y^*)$, not by the sign of $y^*$ alone.` },
    { id: 'de-r4-03', type: 'nat', level: 2, exams: ['jam'], sub: 'physical models',
      q: R`A 12 V battery is switched on at $t = 0$ across a 4 Ω resistor in series with a 2 H inductor, so $L\dfrac{di}{dt} + Ri = V$ with $i(0) = 0$. The current at $t = 0.5$ s is ______ A (to two decimal places).`,
      answer: 1.9, tol: 0.01, unit: 'A', calc: () => 3 * (1 - Math.exp(-1)),
      sol: R`The solution is $i(t) = \dfrac VR\left(1 - e^{-t/\tau}\right)$ with $\tau = L/R = 0.5$ s. At $t = \tau$: $i = 3\times(1 - e^{-1}) = 3\times0.632 = 1.90$ A.`,
      trap: R`The time constant of an RL circuit is $L/R$, not $LR$ (that would be 8 s).` },
    { id: 'de-r4-04', type: 'msq', level: 3, exams: ['jam'], sub: 'constant coefficients', format: 'statements',
      q: R`The function $y = x\,e^{2x}$ is a solution of which equations?`,
      options: [R`$y'' - 4y' + 4y = 0$`, R`$y'' - 4y = 0$`, R`$y' - 2y = e^{2x}$`, R`$y''' - 6y'' + 12y' - 8y = 0$`], answer: [0, 2, 3],
      sol: R`$y' = e^{2x}(1 + 2x)$, $y'' = e^{2x}(4 + 4x)$. Then $y'' - 4y' + 4y = e^{2x}(4 + 4x - 4 - 8x + 4x) = 0$: yes (double root $m = 2$). $y'' - 4y = 4e^{2x} \ne 0$: no. $y' - 2y = e^{2x}$: yes. The last equation is $(D - 2)^3y = 0$ with a triple root 2, whose solutions are $(A + Bx + Cx^2)e^{2x}$: yes.`,
      trap: R`$x\,e^{2x}$ needs a repeated root at 2; $y'' - 4y = 0$ has 2 only as a single root.` },
    { id: 'de-r4-05', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'wronskian',
      q: R`For $y'' + \dfrac2x\,y' + y = 0$ ($x > 0$), the Wronskian of any two solutions is (with $C$ a constant)`,
      options: [R`$Cx^2$`, R`$C/x^2$`, R`$Ce^{-x^2}$`, R`a constant`], answer: 1,
      sol: R`Abel's identity for $y'' + p(x)y' + q(x)y = 0$: $W = C\exp\left(-\displaystyle\int p\,dx\right) = C\exp(-2\ln x) = C/x^2$. Check with the solutions $\sin x/x$ and $\cos x/x$: their Wronskian is $-1/x^2$.`,
      trap: R`Abel's formula has a minus sign in the exponent; dropping it gives $Cx^2$.` },
    { id: 'de-r4-06', type: 'nat', level: 3, exams: ['jam'], sub: 'integrating factor',
      q: R`Solve $y' + 2y = 4x$ with $y(0) = 0$. The value of $y(1)$ is ______ (to three decimal places).`,
      answer: 1.135, tol: 0.002, calc: () => 1 + Math.exp(-2),
      sol: R`Integrating factor $e^{2x}$: $(ye^{2x})' = 4xe^{2x}$, so $ye^{2x} = (2x - 1)e^{2x} + C$ and $y = 2x - 1 + Ce^{-2x}$. $y(0) = -1 + C = 0$ gives $C = 1$. Then $y(1) = 1 + e^{-2} = 1.135$.`,
      trap: R`Leaving out the constant of integration makes $y(0) = -1$, which breaks the initial condition.` },
    { id: 'de-r4-07', type: 'mcq', level: 3, exams: ['jam'], sub: 'separable',
      q: R`The curves that cross every parabola $y = cx^2$ at right angles (orthogonal trajectories) are`,
      options: [R`ellipses $x^2 + 2y^2 = k$`, R`hyperbolas $x^2 - 2y^2 = k$`, R`circles $x^2 + y^2 = k$`, R`ellipses $2x^2 + y^2 = k$`], answer: 0,
      sol: R`Remove $c$: $y' = 2cx = 2y/x$. Orthogonal curves have the negative reciprocal slope, $y' = -\dfrac{x}{2y}$. Separate: $2y\,dy = -x\,dx$, so $y^2 = -x^2/2 + \text{const}$, i.e. $x^2 + 2y^2 = k$.`,
      trap: R`Put the slope in terms of $x$ and $y$ first; keeping $c$ makes the family depend on which parabola you started from.` },
    { id: 'de-r4-08', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'resonance',
      q: R`An undamped oscillator obeys $\ddot y + 4y = 4\cos2t$ and starts from rest at $y = 0$. The value of $y$ at $t = \pi/4$ is ______ (to three decimal places).`,
      answer: 0.785, tol: 0.002, calc: () => Math.PI / 4,
      sol: R`The forcing is at resonance, so try $y_p = a\,t\sin2t$: $\ddot y_p = 4a\cos2t - 4a\,t\sin2t$, and $\ddot y_p + 4y_p = 4a\cos2t$, giving $a = 1$. This $y_p$ already has $y(0) = 0$ and $\dot y(0) = 0$, so no homogeneous part is needed: $y = t\sin2t$, and $y(\pi/4) = \tfrac\pi4\sin\tfrac\pi2 = 0.785$. The amplitude grows linearly in time.`,
      trap: R`$A\cos2t$ cannot be a particular solution here: it solves the homogeneous equation.` },
    { id: 'de-r4-09', type: 'msq', level: 4, exams: ['jam', 'gate'], sub: 'initial value problems', format: 'statements',
      q: R`Consider $\dfrac{dy}{dx} = 3y^{2/3}$ with $y(0) = 0$. Which statements are true?`,
      options: [R`$y \equiv 0$ is a solution`, R`$y = x^3$ is a solution`, R`The solution through $(0, 0)$ is unique`, R`$\partial f/\partial y$ is unbounded near $y = 0$, so the uniqueness theorem does not apply there`], answer: [0, 1, 3],
      sol: R`$y = 0$ gives $0 = 0$. $y = x^3$: $y' = 3x^2$ and $3(x^3)^{2/3} = 3x^2$. So two different solutions pass through the origin (in fact infinitely many: stay at 0 until any $x = a$, then follow $(x - a)^3$). Uniqueness fails because $f = 3y^{2/3}$ has $\partial f/\partial y = 2y^{-1/3}$, which blows up at $y = 0$: $f$ is not Lipschitz there.`,
      trap: R`Continuity of $f$ guarantees a solution exists, not that it is unique.` },
    { id: 'de-r4-10', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'systems',
      q: R`A radioactive parent A (decay constant $0.3$ h⁻¹) feeds a daughter B (decay constant $0.1$ h⁻¹): $\dot N_A = -0.3N_A$, $\dot N_B = 0.3N_A - 0.1N_B$, with $N_B(0) = 0$. The amount of B is largest at $t =$ ______ h (to two decimal places).`,
      answer: 5.49, tol: 0.02, unit: 'h', calc: () => Math.log(3) / 0.2,
      sol: R`$N_A = N_0e^{-0.3t}$. The B equation is linear first order; with integrating factor $e^{0.1t}$ it gives $N_B = \dfrac{0.3N_0}{0.3 - 0.1}\left(e^{-0.1t} - e^{-0.3t}\right)$. Set $\dot N_B = 0$: $0.1e^{-0.1t} = 0.3e^{-0.3t}$, so $e^{0.2t} = 3$ and $t = \dfrac{\ln3}{0.2} = 5.49$ h.`,
      trap: R`At the maximum, $\dot N_B = 0$ means production equals decay, $\lambda_AN_A = \lambda_BN_B$, not $N_A = N_B$.` },
  ],
  gens: [
    { id: 'de-r4g1', type: 'nat', level: 2, exams: ['jam'], sub: 'physical models',
      make(r) {
        const V = choose(r, [5, 6, 9, 12, 24]), Rr = choose(r, [2, 4, 5, 8, 10]), L = choose(r, [0.1, 0.5, 1, 2, 4]), t = pick(r, 0.05, 1, 0.05);
        const tau = L / Rr, answer = round((V / Rr) * (1 - Math.exp(-t / tau)), 4);
        return { q: R`A ${V} V battery is switched on at $t = 0$ across a ${Rr} Ω resistor in series with a ${L} H inductor ($i(0) = 0$). Find the current in A at $t = ${t}$ s (to four decimal places).`,
          answer, tol: Math.max(0.0005, answer * 0.002), unit: 'A', V, Rr, L, t,
          sol: R`$L\,di/dt + Ri = V$ gives $i = \dfrac VR\left(1 - e^{-t/\tau}\right)$ with $\tau = L/R = ${round(tau, 4)}$ s. So $i = ${round(V / Rr, 4)}\left(1 - e^{-${t}/${round(tau, 4)}}\right) = ${answer}$ A.`,
          trap: 'The RL time constant is $L/R$.' };
      },
      verify: (p) => (p.V / p.Rr) * (1 - Math.exp(-p.t * p.Rr / p.L)) },
    { id: 'de-r4g2', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'resonance',
      make(r) {
        const w = int(r, 1, 4), F = int(r, 1, 6) * w, t = pick(r, 0.2, 3, 0.1);
        const answer = round((F / (2 * w)) * t * Math.sin(w * t), 4);
        return { q: R`An undamped oscillator obeys $\ddot y + ${w === 1 ? "" : w * w}y = ${F}\cos ${w === 1 ? '' : w}t$ and starts from rest at $y = 0$. Find $y$ at $t = ${t}$ (to four decimal places; angles in radians).`,
          answer, tol: Math.max(0.0005, Math.abs(answer) * 0.002), w, F, t,
          sol: R`The drive is at the natural frequency $\omega = ${w}$, so $y = \dfrac{F}{2\omega}\,t\sin\omega t = ${round(F / (2 * w), 4)}\,t\sin ${w === 1 ? '' : w}t$ (it meets both initial conditions on its own). At $t = ${t}$: $y = ${answer}$.`,
          trap: 'At resonance the trial solution needs the extra factor $t$.' };
      },
      verify: (p) => (p.F / (2 * p.w)) * p.t * Math.sin(p.w * p.t) },
    { id: 'de-r4g3', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'systems',
      make(r) {
        const [Ta, Tb] = choose(r, [[1, 3], [2, 5], [3, 1], [6, 2], [4, 10], [8, 3], [5, 12], [10, 4]]);
        const la = Math.LN2 / Ta, lb = Math.LN2 / Tb, answer = round(Math.log(la / lb) / (la - lb), 3);
        return { q: R`A pure sample of parent A (half-life ${Ta} h) decays into daughter B (half-life ${Tb} h), which decays further; at $t = 0$ there is no B. After how many hours is the amount of B largest (to three decimal places)?`,
          answer, tol: Math.max(0.005, answer * 0.002), unit: 'h', Ta, Tb,
          sol: R`$\lambda_A = \ln2/${Ta} = ${round(la, 4)}$ h⁻¹, $\lambda_B = \ln2/${Tb} = ${round(lb, 4)}$ h⁻¹. Solving $\dot N_B = \lambda_AN_A - \lambda_BN_B$ gives $N_B \propto e^{-\lambda_Bt} - e^{-\lambda_At}$, which peaks at $t = \dfrac{\ln(\lambda_A/\lambda_B)}{\lambda_A - \lambda_B} = ${answer}$ h.`,
          trap: 'The formula is symmetric in A and B, so it holds whichever decays faster.' };
      },
      verify: (p) => { const a = Math.LN2 / p.Ta, b = Math.LN2 / p.Tb; return Math.log(a / b) / (a - b); } },
  ],
};
