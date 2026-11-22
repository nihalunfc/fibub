// Round 4 extras for circuits: original questions, written 2026-11-22.
import { int, choose, round } from '../_util.js';
const R = String.raw;

export default {
  items: [
    { id: 'cir-r4-01', type: 'nat', level: 4, exams: ['jam'], sub: 'ac power',
      q: R`A motor takes $2.0$ kW from a $230$ V rms, $50$ Hz supply at a power factor of $0.80$ (lagging). The capacitor that, placed in parallel with the motor, raises the power factor to $1$ is ______ $\mu$F (one decimal place).`,
      answer: 90.3, tol: 0.5, unit: 'μF', calc: () => 2000 * 0.75 / (2 * Math.PI * 50 * 230 ** 2) * 1e6,
      sol: R`The motor draws reactive power $Q = P\tan\varphi$ with $\cos\varphi = 0.80$, $\tan\varphi = 0.75$: $Q = 1500$ var. A capacitor across the supply supplies reactive power $\omega CV^2$. Setting $\omega CV^2 = Q$: $C = \frac{1500}{2\pi\times50\times230^2} = 9.03\times10^{-5}$ F $= 90.3\ \mu$F. The real power (2.0 kW) is unchanged; the supply current drops from 10.9 A to 8.7 A.`,
      trap: R`Using $P\sin\varphi$ for the reactive power; it is $P\tan\varphi$ (or $VI\sin\varphi$).` },
    { id: 'cir-r4-02', type: 'mcq', level: 2, exams: ['jam'], sub: 'network theorems',
      q: R`A $12$ V ideal battery drives two $4\ \Omega$ resistors in series. Seen from the two ends of the second resistor, the circuit's Thevenin equivalent is`,
      options: [R`$6$ V in series with $2\ \Omega$`, R`$12$ V in series with $8\ \Omega$`, R`$6$ V in series with $4\ \Omega$`, R`$12$ V in series with $2\ \Omega$`], answer: 0,
      sol: R`Open-circuit voltage: the divider gives $12\times\frac{4}{4 + 4} = 6$ V. Thevenin resistance: replace the battery by a wire, so the two resistors appear in parallel between the terminals: $4\parallel4 = 2\ \Omega$.`,
      trap: R`Adding the resistors in series for $R_{\rm th}$; with the source shorted they are in parallel.` },
    { id: 'cir-r4-03', type: 'msq', level: 3, exams: ['jam'], sub: 'rl transients', format: 'statements',
      q: R`A steady current $I_0$ flows through an inductor $L$ and resistor $R$ in series with a battery. At $t = 0$ the battery is replaced instantly by a plain wire, leaving an $LR$ loop. Which statements are true?`,
      options: [R`The current then falls as $I_0e^{-Rt/L}$`, R`The total heat produced in the resistor afterwards is $\tfrac12LI_0^2$`, R`Just after $t = 0$ the voltage across the inductor has magnitude $I_0R$`, R`The current reverses direction before dying out`],
      answer: [0, 1, 2],
      sol: R`Around the loop, $L\frac{dI}{dt} + IR = 0$, so $I = I_0e^{-Rt/L}$, which never changes sign (no capacitor, so no oscillation). The inductor's stored energy $\frac12LI_0^2$ ends up as heat in $R$. At $t = 0^+$ the current is still $I_0$, so $|L\,dI/dt| = I_0R$.`,
      trap: R`Expecting an oscillation; an $LR$ circuit only decays.` },
    { id: 'cir-r4-04', type: 'nat', level: 3, exams: ['jam'], sub: 'kirchhoff',
      q: R`Two batteries feed one load. A $12$ V battery in series with $2\ \Omega$ and a $6$ V battery in series with $3\ \Omega$ are both connected (positive terminals towards the load) to the top of a $6\ \Omega$ load resistor; all negative terminals and the bottom of the load are joined. The current in the load is ______ A (two decimal places).`,
      answer: 1.33, tol: 0.01, unit: 'A', calc: () => 8 / 6,
      sol: R`Call the top node voltage $V$. Kirchhoff's current law: $\frac{12 - V}{2} + \frac{6 - V}{3} = \frac{V}{6}$. Multiply by 6: $36 - 3V + 12 - 2V = V$, so $V = 8$ V. The load current is $8/6 = 1.33$ A. (The $6$ V battery is actually being charged: $(6 - 8)/3 = -0.67$ A flows into it.)`,
      trap: R`Assuming both batteries must supply current; the weaker one can be driven backwards.` },
    { id: 'cir-r4-05', type: 'nat', level: 3, exams: ['jam'], sub: 'ac circuits',
      q: R`A $100\ \Omega$ resistor and a capacitor of reactance $100\ \Omega$ are connected in parallel across a $100$ V rms AC supply. The rms current drawn from the supply is ______ A (two decimal places).`,
      answer: 1.41, tol: 0.01, unit: 'A', calc: () => Math.SQRT2,
      sol: R`Each branch has the full $100$ V across it: $1.0$ A through the resistor (in phase with $V$) and $1.0$ A through the capacitor (leading by $90^\circ$). Phasors add at right angles: $I = \sqrt{1^2 + 1^2} = 1.41$ A, leading the voltage by $45^\circ$.`,
      trap: R`Adding the branch currents as plain numbers (2 A).` },
    { id: 'cir-r4-06', type: 'mcq', level: 4, exams: ['jam'], sub: 'networks',
      q: R`An infinite ladder is built from identical $1\ \Omega$ resistors: each step has one resistor along the top rail followed by one resistor across to the bottom rail, repeated forever. The resistance seen at the input terminals is`,
      options: [R`$1\ \Omega$`, R`$\dfrac{1 + \sqrt5}{2}\ \Omega$`, R`$2\ \Omega$`, R`$\dfrac{\sqrt5 - 1}{2}\ \Omega$`], answer: 1,
      sol: R`Removing the first step leaves the same infinite ladder, with resistance $R$. So $R = 1 + \frac{1\cdot R}{1 + R}$, giving $R^2 - R - 1 = 0$ and $R = \frac{1 + \sqrt5}{2}\approx1.618\ \Omega$ (the positive root).`,
      trap: R`Taking the negative root's magnitude, $0.618\ \Omega$; the input already has $1\ \Omega$ in series, so $R > 1$.` },
    { id: 'cir-r4-07', type: 'nat', level: 3, exams: ['jam'], sub: 'mutual inductance',
      q: R`Two coils of $4.0$ mH and $9.0$ mH have coupling coefficient $0.50$. Connected in series so that their fluxes add, they act as a single inductance of ______ mH.`,
      answer: 19, tol: 0.05, unit: 'mH', calc: () => 4 + 9 + 2 * 0.5 * Math.sqrt(36),
      sol: R`$M = k\sqrt{L_1L_2} = 0.50\times\sqrt{36} = 3.0$ mH. In series aiding, $L = L_1 + L_2 + 2M = 4 + 9 + 6 = 19$ mH. (Reversing one coil gives $4 + 9 - 6 = 7$ mH.)`,
      trap: R`Adding $M$ only once; each coil links the other's flux, so it appears twice.` },
    { id: 'cir-r4-08', type: 'msq', level: 4, exams: ['jam'], sub: 'resonance', format: 'statements',
      q: R`A series LCR circuit is driven at a frequency below its resonant frequency. Which statements are true?`,
      options: [R`The current leads the source voltage`, R`The rms voltage across the capacitor is larger than that across the inductor`, R`The impedance is larger than $R$`, R`The power factor is 1`],
      answer: [0, 1, 2],
      sol: R`Below resonance $\omega L < \frac{1}{\omega C}$, so $X_C > X_L$: the net reactance is capacitive and the current leads. With the same current in both, $V_C = IX_C > V_L = IX_L$. $Z = \sqrt{R^2 + (X_L - X_C)^2} > R$, and the power factor $R/Z$ is below 1; it reaches 1 only at resonance.`,
      trap: R`Mixing up which reactance wins below resonance: at low frequency the capacitor dominates.` },
    { id: 'cir-r4-09', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'lcr transients',
      q: R`A charged $1.0\ \mu$F capacitor discharges through a $10$ mH inductor and a $100\ \Omega$ resistor in series. The frequency of the damped oscillation is ______ Hz (to the nearest whole number).`,
      answer: 1378, tol: 3, unit: 'Hz', calc: () => Math.sqrt(1 / (10e-3 * 1e-6) - (100 / (2 * 10e-3)) ** 2) / (2 * Math.PI),
      sol: R`$\omega_d = \sqrt{\omega_0^2 - \gamma^2}$ with $\omega_0^2 = \frac{1}{LC} = 10^8$ s⁻² and $\gamma = \frac{R}{2L} = 5000$ s⁻¹. So $\omega_d = \sqrt{10^8 - 2.5\times10^7} = 8660$ rad/s and $f = \frac{8660}{2\pi} = 1378$ Hz, noticeably below the undamped $1592$ Hz.`,
      trap: R`Using $\gamma = R/L$ instead of $R/2L$.` },
    { id: 'cir-r4-10', type: 'mcq', level: 1, exams: ['jam'], sub: 'kirchhoff',
      q: R`Kirchhoff's loop rule (the sum of potential changes around any closed loop is zero) rests on`,
      options: [R`conservation of charge`, R`Ohm's law`, R`Lenz's law`, R`the electrostatic field being conservative, so the work around a closed path is zero`], answer: 3,
      sol: R`Going round a loop and back to the start, the potential must return to its starting value; that is true because a static (or slowly varying) electric field is conservative, $\oint\vec E\cdot d\vec l = 0$, which is energy conservation for a test charge. The junction rule is the one that rests on charge conservation.`,
      trap: R`Swapping the two rules: junction rule = charge, loop rule = energy.` },
    { id: 'cir-r4-11', type: 'mcq', level: 4, exams: ['jam'], sub: 'ac circuits',
      q: R`In a series circuit of a resistor $R$ and an ideal inductor driven by a sine wave, an oscilloscope shows that the voltage across the resistor lags the supply voltage by $60^\circ$. The inductive reactance is`,
      options: [R`$R/\sqrt3$`, R`$R$`, R`$\sqrt3\,R$`, R`$2R$`], answer: 2,
      sol: R`The voltage across $R$ is in phase with the current, so the current lags the supply by $60^\circ$. For a series RL circuit $\tan\varphi = \frac{X_L}{R}$, so $X_L = R\tan60^\circ = \sqrt3\,R$.`,
      trap: R`Using $\tan30^\circ$ by measuring the angle from the inductor voltage instead of the resistor voltage.` },
    { id: 'cir-r4-12', type: 'msq', level: 5, exams: ['jam', 'gate'], sub: 'network theorems', format: 'statements',
      q: R`Which statements about Thevenin and Norton equivalents of a linear network are true?`,
      options: [R`The Norton current equals the Thevenin voltage divided by the Thevenin resistance`, R`With only independent sources, $R_{\rm th}$ is found by replacing voltage sources with shorts and current sources with open circuits`, R`Dependent (controlled) sources are also switched off when finding $R_{\rm th}$`, R`When the load is matched for maximum power, the network delivers that power at 50% efficiency (counting the Thevenin resistance)`],
      answer: [0, 1, 3],
      sol: R`Shorting the output of the Thevenin circuit gives $I_N = V_{\rm th}/R_{\rm th}$. Independent sources are switched off as stated, but a dependent source depends on voltages or currents inside the network and must be left in place (find $R_{\rm th}$ with a test source instead). At $R_L = R_{\rm th}$ the same current flows through equal resistances, so half the power is lost in $R_{\rm th}$.`,
      trap: R`Switching off dependent sources too; they are part of the network's response.` },
  ],
  gens: [
    { id: 'cir-r4g1', type: 'nat', level: 4, exams: ['jam'], sub: 'ac power',
      make(r) {
        const P = choose(r, [1, 1.5, 2, 3, 5]), pf1 = choose(r, [0.6, 0.7, 0.75, 0.8]), pf2 = choose(r, [1, 0.95, 0.9]), V = choose(r, [120, 230, 240]), f = choose(r, [50, 60]);
        const t = (p) => Math.sqrt(1 - p * p) / p, Cc = P * 1e3 * (t(pf1) - t(pf2)) / (2 * Math.PI * f * V * V) * 1e6;
        return { q: `A load takes $${P}$ kW from a $${V}$ V rms, $${f}$ Hz supply at power factor $${pf1}$ (lagging). The capacitor needed in parallel to raise the power factor to $${pf2}$ is ______ $\\mu$F (one decimal place).`,
          answer: round(Cc, 1), tol: Math.max(0.1, round(Cc * 0.005, 1)), unit: 'μF', P, pf1, pf2, V, f,
          sol: `Reactive power drawn: $P\\tan\\varphi_1 = ${P * 1e3}\\times${round(t(pf1), 4)} = ${round(P * 1e3 * t(pf1), 1)}$ var. Reactive power allowed afterwards: $P\\tan\\varphi_2 = ${round(P * 1e3 * t(pf2), 1)}$ var. The capacitor supplies the difference, $\\omega CV^2$: $C = \\frac{${round(P * 1e3 * (t(pf1) - t(pf2)), 1)}}{2\\pi\\times${f}\\times${V}^2} = ${round(Cc, 1)}\\ \\mu$F.`,
          trap: 'Reactive power is $P\\tan\\varphi$ when the real power $P$ is given.' };
      },
      verify: (p) => { const t = (x) => Math.sqrt(1 - x * x) / x; return p.P * 1e3 * (t(p.pf1) - t(p.pf2)) / (2 * Math.PI * p.f * p.V * p.V) * 1e6; } },
    { id: 'cir-r4g2', type: 'nat', level: 3, exams: ['jam'], sub: 'kirchhoff',
      make(r) {
        const E1 = int(r, 6, 24), E2 = int(r, 2, 18), R1 = int(r, 1, 6), R2 = int(r, 1, 6), R3 = int(r, 2, 12);
        const V = (E1 / R1 + E2 / R2) / (1 / R1 + 1 / R2 + 1 / R3), I = V / R3;
        return { q: `A $${E1}$ V battery in series with $${R1}\\ \\Omega$ and a $${E2}$ V battery in series with $${R2}\\ \\Omega$ both feed the top of a $${R3}\\ \\Omega$ load (positive terminals towards the load; all negative terminals and the bottom of the load joined). The load current is ______ A (three decimal places).`,
          answer: round(I, 3), tol: 0.002, unit: 'A', E1, E2, R1, R2, R3,
          sol: `With top-node voltage $V$: $\\frac{${E1} - V}{${R1}} + \\frac{${E2} - V}{${R2}} = \\frac{V}{${R3}}$, so $V = \\frac{${E1}/${R1} + ${E2}/${R2}}{1/${R1} + 1/${R2} + 1/${R3}} = ${round(V, 4)}$ V (Millman's theorem). Load current $= V/${R3} = ${round(I, 3)}$ A.`,
          trap: 'Solve for the shared node voltage first; one battery may even be charged.' };
      },
      verify: (p) => (p.E1 / p.R1 + p.E2 / p.R2) / (1 / p.R1 + 1 / p.R2 + 1 / p.R3) / p.R3 },
    { id: 'cir-r4g3', type: 'nat', level: 3, exams: ['jam'], sub: 'mutual inductance',
      make(r) {
        const L1 = int(r, 1, 20), L2 = int(r, 1, 20), k = choose(r, [0.2, 0.3, 0.5, 0.6, 0.8, 0.9]), aid = r() < 0.5;
        const M = k * Math.sqrt(L1 * L2), L = L1 + L2 + (aid ? 2 : -2) * M;
        return { q: `Coils of $${L1}$ mH and $${L2}$ mH with coupling coefficient $${k}$ are connected in series so that their fluxes ${aid ? 'add' : 'oppose'}. The total inductance is ______ mH (two decimal places).`,
          answer: round(L, 2), tol: 0.02, unit: 'mH', L1, L2, k, aid,
          sol: `$M = k\\sqrt{L_1L_2} = ${k}\\times\\sqrt{${L1 * L2}} = ${round(M, 3)}$ mH. Series ${aid ? 'aiding' : 'opposing'}: $L = L_1 + L_2 ${aid ? '+' : '-'} 2M = ${round(L, 2)}$ mH.`,
          trap: 'The mutual term appears twice: $\\pm2M$.' };
      },
      verify: (p) => p.L1 + p.L2 + (p.aid ? 2 : -2) * p.k * Math.sqrt(p.L1 * p.L2) },
  ],
};
