// Round 4 extras for induction: original questions, written 2026-11-22.
import { choose, round } from '../_util.js';
const R = String.raw;
const A = ['jam', 'gate', 'net'];

export default {
  items: [
    { id: 'ind-r4-01', type: 'mcq', level: 1, exams: A, sub: "faraday's law",
      q: R`A fixed circular loop of area $0.010$ m$^2$ sits at rest in a steady, uniform $2.0$ T field perpendicular to its plane. The emf induced in the loop is`,
      options: [R`$0.020$ V, because the flux is $0.020$ Wb`, R`zero only if the loop has no resistance`, R`zero`, R`$0.020$ V divided by the loop's resistance`],
      answer: 2,
      sol: R`Faraday's law: $\mathcal E = -d\Phi/dt$. The flux is $BA = 0.020$ Wb, but it is not changing, so the emf is zero however large the flux is.`,
      trap: R`Mixing up flux with rate of change of flux: a large steady flux induces nothing.` },
    { id: 'ind-r4-02', type: 'nat', level: 2, exams: A, sub: 'motional emf', unit: 'mN',
      q: R`A rectangular wire loop of resistance $0.50\ \Omega$ is being pulled out of a region of uniform $0.30$ T field (perpendicular to the loop) at a steady $2.0$ m/s. The side still inside the field, perpendicular to the velocity, is $10$ cm long. The pulling force needed to keep the speed steady is ______ mN (to one decimal place).`,
      answer: 3.6, tol: 0.05, calc: () => 0.3 ** 2 * 0.1 ** 2 * 2 / 0.5 * 1e3,
      sol: R`The emf is $\mathcal E = Bwv = (0.30)(0.10)(2.0) = 0.060$ V, so $I = \mathcal E/R = 0.12$ A. The field acts on the side inside it with force $BIw = (0.30)(0.12)(0.10) = 3.6\times10^{-3}$ N, opposing the motion (Lenz). A steady speed needs an equal pull: $F = \dfrac{B^2w^2v}{R} = 3.6$ mN. The two long sides feel equal and opposite forces that cancel.`,
      trap: R`Stopping at the emf or the current; or forgetting that the force is quadratic in $B$ (once to make the current, once to push on it).` },
    { id: 'ind-r4-03', type: 'mcq', level: 2, exams: A, sub: 'inductance',
      q: R`Inductors of $6.0$ mH and $3.0$ mH, far apart so they do not affect each other, are connected in parallel. The equivalent inductance is`,
      options: [R`$2.0$ mH`, R`$9.0$ mH`, R`$4.5$ mH`, R`$18$ mH`],
      answer: 0,
      sol: R`In parallel both inductors have the same voltage $V = L\,dI/dt$, and the currents add: $\dfrac{dI}{dt} = V\left(\dfrac1{L_1} + \dfrac1{L_2}\right)$. So $\dfrac1L = \dfrac16 + \dfrac13 = \dfrac12$ per mH and $L = 2.0$ mH, combining like resistors.`,
      trap: R`$9.0$ mH is the series value; uncoupled inductors combine like resistors, not like capacitors.` },
    { id: 'ind-r4-04', type: 'nat', level: 3, exams: A, sub: 'induced electric field', unit: 'mV',
      q: R`A long solenoid of radius $2.0$ cm has its internal field rising at $0.50$ T/s. A circular wire loop of radius $10$ cm surrounds it coaxially. The emf induced in the loop is ______ mV (to three decimal places).`,
      answer: 0.628, tol: 0.005, calc: () => Math.PI * 0.02 ** 2 * 0.5 * 1e3,
      sol: R`Only the flux through the loop matters, and outside the solenoid $B \approx 0$, so the flux is that of the solenoid alone: $\Phi = \pi a^2B$. $\mathcal E = \pi a^2\,dB/dt = \pi(0.020)^2(0.50) = 6.28\times10^{-4}$ V $= 0.628$ mV. The loop's own radius does not appear: a bigger loop enclosing the same solenoid gets the same emf, even though there is no magnetic field at the wire.`,
      trap: R`Using the loop's area $\pi(0.10)^2$ gives 25 times too much; the field is confined to the solenoid.` },
    { id: 'ind-r4-05', type: 'msq', level: 3, exams: A, sub: "faraday's law", format: 'statements',
      q: R`Which statements about induced emf are correct?`,
      options: [R`A rigid loop moving at constant velocity while staying entirely inside a uniform magnetic field has zero emf.`, R`A rigid loop turning about a diameter perpendicular to a uniform steady field has an emf.`, R`The electric field induced by a changing magnetic field is conservative, so its line integral round a closed loop is zero.`, R`An induced electric field exists only at points where the magnetic field is non-zero.`],
      answer: [0, 1],
      sol: R`Moving without turning inside a uniform field leaves the flux unchanged, so $\mathcal E = 0$ (the motional emfs on opposite sides cancel). Turning changes the angle between $\vec B$ and the loop's normal, so the flux changes and there is an emf. $\nabla\times\vec E = -\partial\vec B/\partial t \ne 0$, so the induced field is not conservative: its loop integral is the emf. And the induced field reaches outside the region of changing $\vec B$, as round a solenoid.`,
      trap: R`Thinking "no B at the wire, so no emf": the field outside a long solenoid is zero but the induced $\vec E$ there is not.` },
    { id: 'ind-r4-06', type: 'mcq', level: 3, exams: A, sub: 'LC circuits',
      q: R`A $25$ mH inductor carries $0.30$ A when, at $t = 0$, it is switched across an uncharged $4.0\ \mu$F capacitor (no resistance anywhere). The largest voltage the capacitor reaches is about`,
      options: [R`$16.8$ V`, R`$23.7$ V`, R`$1.9$ kV`, R`$3.8$ mV`],
      answer: 1,
      sol: R`Energy is conserved as it moves from the inductor to the capacitor: $\tfrac12LI_0^2 = \tfrac12CV_{\max}^2$, so $V_{\max} = I_0\sqrt{L/C} = 0.30\sqrt{\dfrac{0.025}{4.0\times10^{-6}}} = 0.30\times79.1 = 23.7$ V, reached a quarter period ($\tfrac{\pi}{2}\sqrt{LC} = 0.50$ ms) later.`,
      trap: R`Dropping the $\tfrac12$ on one side of the energy balance gives $16.8$ V; $I_0L/C$ and $I_0\sqrt{C/L}$ fail a units check (only $\sqrt{L/C}$ is a resistance).` },
    { id: 'ind-r4-07', type: 'nat', level: 4, exams: A, sub: 'RL circuits', unit: 'ms',
      q: R`A $12$ V battery is switched at $t = 0$ onto a $20\ \Omega$ resistor in series with a $0.50$ H ideal inductor. The rate at which energy is being stored in the inductor's magnetic field is largest at $t = $ ______ ms (to two decimal places).`,
      answer: 17.33, tol: 0.05, calc: () => 0.5 / 20 * Math.log(2) * 1e3,
      sol: R`$I = I_0(1 - e^{-t/\tau})$ with $\tau = L/R = 25$ ms. The power into the inductor is $P_L = LI\,\dfrac{dI}{dt} = \dfrac{LI_0^2}{\tau}(1 - e^{-t/\tau})e^{-t/\tau}$. With $x = e^{-t/\tau}$ this is $\propto x(1 - x)$, largest at $x = \tfrac12$: $t = \tau\ln2 = 25\times0.693 = 17.33$ ms. At that moment $P_L = \dfrac{V^2}{4R} = 1.8$ W, the same as the power heating the resistor.`,
      trap: R`Choosing $t = 0$ (largest $dI/dt$, but zero current) or $t = \tau$; the product $I\,dI/dt$ peaks in between.` },
    { id: 'ind-r4-08', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'motional emf', format: 'statements',
      q: R`A rod of mass $m$ and length $L$ slides without friction on horizontal rails in a vertical uniform field $B$. The rails are joined by an ideal capacitor $C$ (no resistance), and a constant force $F$ pulls the rod from rest. Which statements are correct?`,
      options: [R`The current in the circuit is constant.`, R`The rod approaches a terminal speed, as it would with a resistor.`, R`The rod moves as if its mass were increased by $B^2L^2C$.`, R`The rod's acceleration is constant.`],
      answer: [0, 2, 3],
      sol: R`The capacitor voltage equals the emf: $q = CBLv$, so $I = dq/dt = CBLa$. The magnetic force on the rod is $BIL = B^2L^2Ca$, opposing the pull: $F - B^2L^2Ca = ma$, so $a = \dfrac{F}{m + B^2L^2C}$, a constant. Then $I = CBLa$ is constant too, and the speed grows without limit. The term $B^2L^2C$ acts as extra inertia: energy goes into both kinetic energy and the capacitor's field.`,
      trap: R`Carrying over the resistor result (terminal speed $FR/B^2L^2$): with a capacitor the opposing force depends on the acceleration, not the speed.` },
    { id: 'ind-r4-09', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'motional emf',
      q: R`In the rod-and-capacitor set-up (rod on frictionless horizontal rails in a vertical field, rails joined by a capacitor, no resistance), $m = 0.10$ kg, $B = 1.0$ T, rail spacing $L = 0.50$ m, $C = 0.20$ F and a constant $0.30$ N pull acts from rest. The rod's acceleration is`,
      options: [R`$3.0$ m/s$^2$`, R`$6.0$ m/s$^2$`, R`$1.5$ m/s$^2$`, R`$2.0$ m/s$^2$`],
      answer: 3,
      sol: R`$B^2L^2C = (1.0)^2(0.50)^2(0.20) = 0.050$ kg. $a = \dfrac{F}{m + B^2L^2C} = \dfrac{0.30}{0.10 + 0.050} = 2.0$ m/s$^2$. The capacitor current is $CBLa = (0.20)(1.0)(0.50)(2.0) = 0.20$ A, steady.`,
      trap: R`$3.0$ m/s$^2$ ignores the induced current; $6.0$ divides by $B^2L^2C$ alone.` },
    { id: 'ind-r4-10', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'self-inductance', unit: 'A',
      q: R`A thick copper ring of radius $5.0$ cm has resistance $0.010\ \Omega$ and self-inductance $0.20\ \mu$H. It sits in a uniform field normal to its plane, $B = B_0\sin\omega t$, with $B_0 = 0.010$ T and frequency $1.0$ kHz. The amplitude of the current in the ring is ______ A (to one decimal place).`,
      answer: 49.0, tol: 0.3, calc: () => { const w = 2 * Math.PI * 1000; return w * Math.PI * 0.05 ** 2 * 0.01 / Math.hypot(0.01, w * 2e-7); },
      sol: R`The applied emf has amplitude $\mathcal E_0 = \omega\pi a^2B_0 = (6283)(7.854\times10^{-3})(0.010) = 0.493$ V. The ring's own inductance opposes changes in its current, so it acts as an $L$-$R$ series circuit: $I_0 = \dfrac{\mathcal E_0}{\sqrt{R^2 + \omega^2L^2}}$. $\omega L = 6283\times2.0\times10^{-7} = 1.26\times10^{-3}\ \Omega$, so $|Z| = \sqrt{(0.010)^2 + (0.00126)^2} = 0.01008\ \Omega$ and $I_0 = 0.493/0.01008 = 49.0$ A. Here self-inductance trims the current by under 1%; at much higher frequency ($\omega L \gg R$) the ring's own flux would almost cancel the applied flux.`,
      trap: R`Ignoring the ring's self-inductance gives $49.3$ A, close here; adding $R + \omega L$ directly instead of in quadrature gives $43.8$ A.` },
  ],
  gens: [
    { id: 'ind-r4g1', type: 'nat', level: 3, exams: A, sub: 'induced electric field',
      make(r) {
        const a = choose(r, [1, 1.5, 2, 2.5, 3, 4]), b = round(a * choose(r, [0.5, 0.75, 2, 3, 5]), 2), dB = choose(r, [0.05, 0.1, 0.2, 0.4, 0.5, 0.8, 1.5]);
        const Ae = Math.PI * (Math.min(a, b) / 100) ** 2, emf = Ae * dB * 1e3;
        return { q: R`A long solenoid of radius $${a}$ cm has its uniform internal field changing at $${dB}$ T/s. A circular loop of radius $${b}$ cm is placed coaxially ${b > a ? 'around it' : 'inside it'}. The emf in the loop is ______ mV (to three decimal places).`,
          answer: round(emf, 3), tol: Math.max(0.001, round(emf * 0.01, 3)), unit: 'mV', a, b, dB,
          sol: R`$\mathcal E = A_{\rm field}\,dB/dt$, where $A_{\rm field}$ is the area of the loop that actually holds field: ${b > a ? R`the loop is bigger than the solenoid, so only the solenoid's area $\pi(${round(a / 100, 4)})^2$ counts` : R`the loop is inside the solenoid, so its own area $\pi(${round(b / 100, 4)})^2$ counts`}. $\mathcal E = ${round(Ae * 1e4, 4)}\times10^{-4}\times${dB} = ${round(emf, 3)}$ mV.`,
          trap: 'For a loop outside the solenoid the emf does not depend on the loop size.' };
      },
      verify: (p) => Math.PI * (Math.min(p.a, p.b) / 100) ** 2 * p.dB * 1e3 },
    { id: 'ind-r4g2', type: 'nat', level: 4, exams: A, sub: 'RL circuits',
      make(r) {
        const V = choose(r, [6, 9, 12, 18, 24]), Rr = choose(r, [5, 10, 20, 40, 50]), L = choose(r, [0.1, 0.2, 0.5, 1, 2]);
        const ask = r() < 0.5 ? 't' : 'P';
        const tau = L / Rr, t = tau * Math.log(2) * 1e3, P = V * V / (4 * Rr);
        const ans = ask === 't' ? t : P;
        return { q: R`A $${V}$ V battery is switched at $t = 0$ onto a $${Rr}\ \Omega$ resistor in series with a $${L}$ H ideal inductor. ${ask === 't' ? 'The power flowing into the inductor\'s magnetic field is largest at $t = $ ______ ms (to two decimal places).' : 'The largest rate at which energy is stored in the inductor is ______ W (to two decimal places).'}`,
          answer: round(ans, 2), tol: Math.max(0.01, round(ans * 0.005, 2)), unit: ask === 't' ? 'ms' : 'W', V, Rr, L, ask,
          sol: R`$\tau = L/R = ${round(tau * 1e3, 3)}$ ms, $I = \dfrac VR(1 - x)$ with $x = e^{-t/\tau}$, and $P_L = LI\dfrac{dI}{dt} = \dfrac{V^2}{R}x(1 - x)$, largest at $x = \tfrac12$: $t = \tau\ln2 = ${round(t, 2)}$ ms, where $P_L = \dfrac{V^2}{4R} = ${round(P, 2)}$ W.`,
          trap: 'The power into the inductor is zero at t = 0 (no current) and at large t (no change); it peaks at t = τ ln 2.' };
      },
      verify: (p) => (p.ask === 't' ? p.L / p.Rr * Math.log(2) * 1e3 : p.V * p.V / (4 * p.Rr)) },
    { id: 'ind-r4g3', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'motional emf',
      make(r) {
        const m = choose(r, [0.05, 0.1, 0.2, 0.4]), B = choose(r, [0.5, 1, 1.5, 2]), L = choose(r, [0.2, 0.4, 0.5, 1]), Cc = choose(r, [0.1, 0.2, 0.5, 1]), F = choose(r, [0.1, 0.2, 0.3, 0.5, 1]);
        const extra = B * B * L * L * Cc, a = F / (m + extra);
        return { q: R`A rod of mass $${m}$ kg slides without friction on horizontal rails $${L}$ m apart in a vertical $${B}$ T field. The rails are joined by an uncharged $${Cc}$ F capacitor (no resistance). A constant $${F}$ N force pulls the rod from rest. Its acceleration is ______ m/s$^2$ (to three decimal places).`,
          answer: round(a, 3), tol: Math.max(0.002, round(a * 0.005, 3)), unit: R`m/s$^2$`, m, B, L, Cc, F,
          sol: R`$q = CBLv$, so $I = CBLa$ and the opposing force is $B^2L^2Ca$. $F = (m + B^2L^2C)a$ with $B^2L^2C = ${round(extra, 4)}$ kg, so $a = \dfrac{${F}}{${m} + ${round(extra, 4)}} = ${round(a, 3)}$ m/s$^2$, constant.`,
          trap: 'There is no terminal speed: the opposing force depends on the acceleration.' };
      },
      verify: (p) => p.F / (p.m + p.B * p.B * p.L * p.L * p.Cc) },
  ],
};
