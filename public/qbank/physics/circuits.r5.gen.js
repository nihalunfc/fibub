// Round 5 extras for circuits: original questions, written 2026-11-22.
import { int, choose, round } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'cir-r5-01', type: 'nat', level: 3, exams: ['jam'], sub: 'rc transients',
      q: R`An uncharged $47\ \mu$F capacitor is charged from a battery through a $10$ k$\Omega$ resistor. It reaches $90\%$ of its final voltage after ______ s (two decimal places).`,
      answer: 1.08, tol: 0.01, unit: 's', calc: () => 10e3 * 47e-6 * Math.log(10),
      sol: R`$V(t) = V_0(1 - e^{-t/RC})$ with $RC = 10^4\times47\times10^{-6} = 0.47$ s. Setting $1 - e^{-t/RC} = 0.9$: $e^{-t/RC} = 0.1$, so $t = RC\ln10 = 0.47\times2.303 = 1.08$ s.`,
      trap: R`Using $t = RC\ln0.9$ (the time to reach $10\%$ of the way is $RC\ln(1/0.9)$, much shorter).` },
    { id: 'cir-r5-02', type: 'mcq', level: 1, exams: ['jam'], sub: 'bridges',
      q: R`A Wheatstone bridge has $P = 10\ \Omega$ and $Q = 20\ \Omega$ in the ratio arms and $R = 15\ \Omega$ in the third arm. The galvanometer reads zero when the unknown $S$ is`,
      options: [R`$7.5\ \Omega$`, R`$13.3\ \Omega$`, R`$45\ \Omega$`, R`$30\ \Omega$`], answer: 3,
      sol: R`Balance needs $\frac PQ = \frac RS$, so $S = R\frac QP = 15\times\frac{20}{10} = 30\ \Omega$.`,
      trap: R`Inverting the ratio and getting $7.5\ \Omega$.` },
    { id: 'cir-r5-03', type: 'msq', level: 3, exams: ['jam'], sub: 'resonance', format: 'statements',
      q: R`An ideal inductor and an ideal capacitor are joined in parallel and driven by an AC source at their resonant frequency $1/\sqrt{LC}$. Which statements are true?`,
      options: [R`The current drawn from the source is at its minimum`, R`The pair behaves like a short circuit`, R`The impedance of the pair is at its maximum`, R`The current in each branch can be much larger than the source current`],
      answer: [0, 2, 3],
      sol: R`At resonance the inductor and capacitor currents are equal in size and opposite in phase, so they cancel in the supply line: the source current is minimum (zero for ideal parts) and the impedance maximum (infinite). Meanwhile a large current circulates between $L$ and $C$. It is the series pair that acts like a short circuit at resonance.`,
      trap: R`Carrying the series-resonance picture (minimum impedance) over to the parallel tank.` },
    { id: 'cir-r5-04', type: 'nat', level: 4, exams: ['jam'], sub: 'quality factor',
      q: R`A series circuit has $L = 20$ mH, $C = 0.50\ \mu$F and $R = 10\ \Omega$. Its quality factor $Q$ is ______.`,
      answer: 20, tol: 0.1, calc: () => Math.sqrt(20e-3 / 0.5e-6) / 10,
      sol: R`$\omega_0 = 1/\sqrt{LC} = 1/\sqrt{10^{-8}} = 10^4$ rad/s. $Q = \frac{\omega_0L}{R} = \frac{10^4\times0.020}{10} = 20$ (equivalently $\frac1R\sqrt{L/C}$). The half-power bandwidth is $\omega_0/Q = 500$ rad/s.`,
      trap: R`Using $f_0$ in hertz instead of $\omega_0$ in $\omega_0L/R$, which gives $3.2$.` },
    { id: 'cir-r5-05', type: 'mcq', level: 3, exams: ['jam'], sub: 'networks',
      q: R`Three $6\ \Omega$ resistors are connected in a delta (triangle). The equivalent star (Y) network has, in each arm,`,
      options: [R`$2\ \Omega$`, R`$18\ \Omega$`, R`$3\ \Omega$`, R`$6\ \Omega$`], answer: 0,
      sol: R`Delta to star: each star arm is the product of the two delta resistors meeting at that node divided by their sum: $\frac{6\times6}{6 + 6 + 6} = 2\ \Omega$. Check: between two terminals the delta gives $6\parallel12 = 4\ \Omega$, and the star gives $2 + 2 = 4\ \Omega$.`,
      trap: R`Using the star-to-delta rule ($3R$) in the wrong direction.` },
    { id: 'cir-r5-06', type: 'nat', level: 4, exams: ['jam'], sub: 'power transfer',
      q: R`A $12$ V battery with internal resistance $2\ \Omega$ has a fixed $4\ \Omega$ resistor across its terminals. A variable load resistor is also connected across the terminals. The greatest power the load can take is ______ W.`,
      answer: 12, tol: 0.05, unit: 'W', calc: () => 8 ** 2 / (4 * 4 / 3),
      sol: R`Replace everything except the load by its Thevenin equivalent. Open-circuit voltage: $12\times\frac{4}{2 + 4} = 8$ V. Resistance with the battery shorted: $2\parallel4 = \frac43\ \Omega$. Maximum power when $R_L = \frac43\ \Omega$: $P = \frac{V_{\rm th}^2}{4R_{\rm th}} = \frac{64}{16/3} = 12$ W.`,
      trap: R`Matching the load to the $2\ \Omega$ internal resistance alone, ignoring the fixed resistor.` },
    { id: 'cir-r5-07', type: 'mcq', level: 3, exams: ['jam'], sub: 'rc transients', format: 'graph in words',
      q: R`A charged capacitor discharges through a resistor. The natural logarithm of the current, $\ln I$, is plotted against time. The graph is`,
      options: [R`a parabola opening downwards`, R`a straight line with slope $-1/RC$`, R`a straight line with slope $-RC$`, R`a horizontal line, because the current is constant`], answer: 1,
      sol: R`$I = I_0e^{-t/RC}$, so $\ln I = \ln I_0 - \frac{t}{RC}$: a straight line whose slope is $-1/RC$ and whose intercept is $\ln I_0$. This is how $RC$ is found from data.`,
      trap: R`Writing the slope as $-RC$; the exponent is $t/RC$.` },
    { id: 'cir-r5-08', type: 'nat', level: 4, exams: ['jam'], sub: 'capacitors',
      q: R`A $4.0\ \mu$F capacitor charged to $50$ V is connected across an uncharged $6.0\ \mu$F capacitor. The energy lost in the connecting wires is ______ mJ (two decimal places).`,
      answer: 3, tol: 0.01, unit: 'mJ', calc: () => 0.5 * (4e-6 * 6e-6 / 10e-6) * 50 ** 2 * 1e3,
      sol: R`Charge $Q = 4\times50 = 200\ \mu$C is shared at a common voltage $\frac{200}{10} = 20$ V. Before: $\frac12(4\times10^{-6})(50)^2 = 5.0$ mJ. After: $\frac12(10\times10^{-6})(20)^2 = 2.0$ mJ. Lost: $3.0$ mJ, matching $\frac12\frac{C_1C_2}{C_1 + C_2}V^2$, whatever the wire resistance.`,
      trap: R`Expecting no loss because the wires have small resistance; the loss does not depend on $R$.` },
    { id: 'cir-r5-09', type: 'mcq', level: 3, exams: ['jam'], sub: 'meters',
      q: R`A galvanometer of resistance $50\ \Omega$ gives full-scale deflection at $2.0$ mA. To use it as an ammeter reading up to $1.0$ A, one connects`,
      options: [R`about $0.10\ \Omega$ in series`, R`about $450\ \Omega$ in series`, R`about $0.10\ \Omega$ in parallel`, R`about $450\ \Omega$ in parallel`], answer: 2,
      sol: R`An ammeter needs a low-resistance shunt in parallel to carry most of the current. At full scale $2.0$ mA goes through the galvanometer and $0.998$ A through the shunt, with the same voltage $0.002\times50 = 0.10$ V. So $S = 0.10/0.998 = 0.100\ \Omega$.`,
      trap: R`Putting the resistor in series; that makes a voltmeter.` },
    { id: 'cir-r5-10', type: 'msq', level: 2, exams: ['jam'], sub: 'ac circuits', format: 'statements',
      q: R`Which statements about an ideal inductor in a sinusoidal AC circuit are true?`,
      options: [R`The average power it takes is zero`, R`The current through it lags the voltage across it by $90^\circ$`, R`Its reactance is proportional to the frequency`, R`At very low frequency it acts like an open circuit`],
      answer: [0, 1, 2],
      sol: R`$V = L\,dI/dt$: for $I = I_0\sin\omega t$, $V = \omega LI_0\cos\omega t$, which leads $I$ by $90^\circ$. With $V$ and $I$ a quarter cycle apart, the average of $VI$ is zero. $X_L = \omega L$ grows with frequency; as $\omega\to0$ it vanishes, so the inductor acts like a short circuit, not an open one.`,
      trap: R`Mixing the low-frequency limits: an inductor shorts at DC, a capacitor opens.` },
  ],
  gens: [
    { id: 'cir-r5g1', type: 'nat', level: 3, exams: ['jam'], sub: 'rc transients',
      make(r) {
        const Rk = choose(r, [1, 2.2, 4.7, 10, 22, 47]), Cu = choose(r, [10, 22, 47, 100, 220]), p = choose(r, [50, 63, 75, 80, 90, 95, 99]);
        const tau = Rk * 1e3 * Cu * 1e-6, t = tau * Math.log(100 / (100 - p));
        return { q: `An uncharged $${Cu}\\ \\mu$F capacitor charges through $${Rk}$ k$\\Omega$ from a battery. It reaches $${p}\\%$ of its final voltage after ______ s (three decimal places).`,
          answer: round(t, 3), tol: Math.max(0.001, round(t * 0.003, 3)), unit: 's', Rk, Cu, p,
          sol: `$RC = ${round(tau, 4)}$ s. $1 - e^{-t/RC} = ${p / 100}$ gives $t = RC\\ln\\frac{1}{1 - ${p / 100}} = ${round(tau, 4)}\\times${round(Math.log(100 / (100 - p)), 4)} = ${round(t, 3)}$ s.`,
          trap: 'Solve $e^{-t/RC} = 1 - $ fraction, not $=$ fraction.' };
      },
      verify: (p) => p.Rk * 1e3 * p.Cu * 1e-6 * Math.log(100 / (100 - p.p)) },
    { id: 'cir-r5g2', type: 'nat', level: 3, exams: ['jam'], sub: 'quality factor',
      make(r) {
        const L = choose(r, [1, 2, 5, 10, 20, 50, 100]), Cn = choose(r, [10, 47, 100, 220, 470, 1000]), Rr = choose(r, [1, 2, 5, 10, 20, 50]);
        const Q = Math.sqrt(L * 1e-3 / (Cn * 1e-9)) / Rr;
        return { q: `A series LCR circuit has $L = ${L}$ mH, $C = ${Cn}$ nF and $R = ${Rr}\\ \\Omega$. Its quality factor is ______ (two decimal places).`,
          answer: round(Q, 2), tol: Math.max(0.01, round(Q * 0.003, 2)), L, Cn, Rr,
          sol: `$Q = \\frac1R\\sqrt{\\frac LC} = \\frac{1}{${Rr}}\\sqrt{\\frac{${L}\\times10^{-3}}{${Cn}\\times10^{-9}}} = ${round(Q, 2)}$.`,
          trap: 'Convert mH and nF to SI before taking the square root.' };
      },
      verify: (p) => Math.sqrt(p.L * 1e-3 / (p.Cn * 1e-9)) / p.Rr },
    { id: 'cir-r5g3', type: 'nat', level: 4, exams: ['jam'], sub: 'capacitors',
      make(r) {
        const C1 = int(r, 1, 10), C2 = int(r, 1, 10), V = choose(r, [10, 20, 50, 100, 200]), E = 0.5 * C1 * C2 / (C1 + C2) * V * V / 1000;
        return { q: `A $${C1}\\ \\mu$F capacitor charged to $${V}$ V is connected across an uncharged $${C2}\\ \\mu$F capacitor. The energy turned into heat (and radiation) is ______ mJ (three decimal places).`,
          answer: round(E, 3), tol: Math.max(0.001, round(E * 0.002, 3)), unit: 'mJ', C1, C2, V,
          sol: `Common voltage $\\frac{${C1}\\times${V}}{${C1 + C2}} = ${round(C1 * V / (C1 + C2), 3)}$ V. Loss $= \\frac12\\frac{C_1C_2}{C_1 + C_2}V^2 = \\frac12\\times${round(C1 * C2 / (C1 + C2), 4)}\\times10^{-6}\\times${V * V} = ${round(E, 3)}$ mJ.`,
          trap: 'Charge is conserved when capacitors share charge; energy is not.' };
      },
      verify: (p) => 0.5 * p.C1 * p.C2 / (p.C1 + p.C2) * p.V * p.V / 1000 },
  ],
};
