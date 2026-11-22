// Round 4 extras for diodes: original questions, written 2026-11-22.
import { int, choose, round, C } from '../_util.js';
const R = String.raw;
const A = ['jam', 'gate', 'net'];
const G = ['gate', 'net'];
const vbr = (er, Ec, Nd) => er * C.eps0 * 1e-2 * Ec ** 2 / (2 * C.e * Nd); // Ec V/cm, Nd cm^-3 -> V

export default {
  items: [
    { id: 'dio-r4-01', type: 'mcq', level: 1, exams: A, sub: 'LEDs',
      q: R`At a typical operating current of about $10$ mA, which of these has the largest forward voltage?`,
      options: [R`a silicon rectifier diode`, R`a germanium diode`, R`a red LED`, R`a blue LED`],
      answer: 3,
      sol: R`The forward voltage is roughly the band gap in electron-volts divided by $e$, plus a little: germanium about $0.3$ V, silicon about $0.7$ V, a red LED ($E_g\approx1.9$ eV) about $1.8$-$2$ V and a blue LED ($E_g\approx2.7$ eV, InGaN) about $3$ V. Bluer light means bigger photons, so a bigger gap and a bigger voltage.`,
      trap: R`Thinking all diodes drop about $0.7$ V: that figure is specific to silicon.` },
    { id: 'dio-r4-02', type: 'nat', level: 2, exams: A, sub: 'LEDs', unit: R`$\Omega$`,
      q: R`An LED that drops $2.0$ V at its rated current of $15$ mA is run from a $5.0$ V supply through a series resistor. The resistor needed is ______ $\Omega$ (to the nearest whole number).`,
      answer: 200, tol: 1, calc: () => (5 - 2) / 0.015,
      sol: R`The resistor takes the rest of the supply voltage: $5.0 - 2.0 = 3.0$ V at $15$ mA, so $R = 3.0/0.015 = 200\ \Omega$. It dissipates $3.0\times0.015 = 45$ mW, so a $\tfrac14$ W part is fine.`,
      trap: R`Using the whole $5.0$ V ($333\ \Omega$): the LED's own drop must be subtracted first.` },
    { id: 'dio-r4-03', type: 'mcq', level: 2, exams: A, sub: 'schottky diodes',
      q: R`A Schottky (metal-semiconductor) diode is preferred over a p-n diode in fast switching circuits mainly because`,
      options: [R`it has a higher reverse breakdown voltage`, R`current is carried by majority carriers, so almost no minority charge is stored and it switches off almost at once`, R`its reverse leakage current is smaller`, R`it emits light when forward biased`],
      answer: 1,
      sol: R`In a forward-biased p-n diode, minority carriers are injected and stored on each side; switching off means removing that charge, which takes time (reverse recovery). A Schottky diode conducts by majority carriers crossing the metal-semiconductor barrier, so there is almost no stored charge. It also has a lower forward drop (about $0.2$-$0.4$ V). Its drawbacks are a larger reverse leakage and usually a lower breakdown voltage.`,
      trap: R`Choosing "lower leakage": Schottky diodes leak more than p-n diodes.` },
    { id: 'dio-r4-04', type: 'nat', level: 3, exams: A, sub: 'solar cells',
      q: R`A solar cell has open-circuit voltage $0.60$ V and short-circuit current $3.0$ A. At its maximum-power point it delivers $2.7$ A at $0.50$ V. Its fill factor is ______ (to two decimal places).`,
      answer: 0.75, tol: 0.005, calc: () => (0.5 * 2.7) / (0.6 * 3.0),
      sol: R`The fill factor compares the real maximum power with the rectangle $V_{oc}I_{sc}$: $FF = \dfrac{V_{mp}I_{mp}}{V_{oc}I_{sc}} = \dfrac{0.50\times2.7}{0.60\times3.0} = \dfrac{1.35}{1.80} = 0.75$. Good silicon cells reach about $0.8$; series resistance and shunt leakage lower it.`,
      trap: R`Dividing $V_{mp}/V_{oc}$ only ($0.83$): the fill factor includes the current ratio too.` },
    { id: 'dio-r4-05', type: 'msq', level: 3, exams: A, sub: 'special diodes', format: 'statements',
      q: R`Which statements about the tunnel diode are correct?`,
      options: [R`Its depletion region is only a few nanometres wide.`, R`Part of its forward characteristic shows negative differential resistance.`, R`It is used mainly as a high-voltage power rectifier.`, R`Both sides are doped so heavily that they are degenerate.`],
      answer: [0, 1, 3],
      sol: R`Very heavy doping puts the Fermi level inside the bands on both sides and makes the junction extremely thin, so electrons can tunnel straight through. As forward bias rises, the filled states on one side first line up with empty states on the other (current rises), then slide past them into the gap (current falls: negative resistance), before normal diffusion current takes over. It is used in very fast oscillators and switches; its heavy doping gives it almost no reverse blocking ability, the opposite of a power rectifier.`,
      trap: R`Expecting a heavily doped junction to block well: heavy doping makes breakdown (here, tunnelling) happen at very low reverse voltage.` },
    { id: 'dio-r4-06', type: 'mcq', level: 3, exams: A, sub: 'switching',
      q: R`A p-n diode carrying a forward current is suddenly reverse biased. For a short "storage time" a large reverse current flows before the diode blocks. This storage time is set mainly by`,
      options: [R`the minority-carrier lifetime (and the ratio of forward to reverse current)`, R`the depletion capacitance at zero bias only`, R`the thermal voltage $kT/e$ alone`, R`the breakdown voltage`],
      answer: 0,
      sol: R`Forward current builds up stored minority charge $Q\approx I_F\tau$, with $\tau$ the minority-carrier lifetime. On reversal this charge must be swept out by the reverse current or recombine; until it is gone the junction stays forward biased and conducts backwards. A standard estimate is $t_s\approx\tau\ln(1 + I_F/I_R)$. Fast-recovery diodes are made with short lifetimes (e.g. gold doping).`,
      trap: R`Blaming the depletion capacitance: it matters after the stored charge is gone, during the final, shorter part of turn-off.` },
    { id: 'dio-r4-07', type: 'nat', level: 4, exams: A, sub: 'breakdown', unit: 'V',
      q: R`A one-sided silicon p$^+$-n junction ($\varepsilon_r = 11.7$) has $N_d = 10^{16}$ cm$^{-3}$ on the n side. Avalanche breakdown occurs when the peak field reaches $4.0\times10^5$ V/cm. Neglecting the built-in potential, the breakdown voltage is ______ V (to one decimal place).`,
      answer: 51.7, tol: 0.5, calc: () => vbr(11.7, 4e5, 1e16),
      sol: R`In a one-sided junction the depletion region lies in the n side; the field falls linearly from its peak $E_m = eN_dW/\varepsilon$ to zero, and the voltage is the triangle's area, $V = \tfrac12E_mW = \dfrac{\varepsilon E_m^2}{2eN_d}$. In cm units: $\varepsilon = 11.7\times8.854\times10^{-14}$ F/cm, so $V_{BR} = \dfrac{(1.036\times10^{-12})(4.0\times10^5)^2}{2(1.602\times10^{-19})(10^{16})} = 51.7$ V.`,
      trap: R`Mixing F/m with cm$^{-3}$; keep every quantity in cm (or every one in m).` },
    { id: 'dio-r4-08', type: 'mcq', level: 4, exams: A, sub: 'breakdown',
      q: R`For a one-sided abrupt junction whose breakdown happens at a fixed critical field, doubling the doping on the lightly doped side changes the breakdown voltage by a factor of about`,
      options: [R`$2$ (it doubles)`, R`$1$ (no change)`, R`$1/2$ (it halves)`, R`$1/\sqrt2$`],
      answer: 2,
      sol: R`$V_{BR} = \dfrac{\varepsilon E_c^2}{2eN}$: at fixed $E_c$ it is inversely proportional to the light-side doping, so it halves. (In real silicon $E_c$ itself creeps up slowly with doping, so the drop is a bit less than half.) High-voltage devices therefore use lightly doped, thick regions.`,
      trap: R`Thinking heavier doping makes a junction "stronger": it makes the depletion region thinner and the field rise faster with voltage.` },
    { id: 'dio-r4-09', type: 'msq', level: 4, exams: G, sub: 'real diodes', format: 'statements',
      q: R`Which statements about how real silicon diodes depart from the ideal $I = I_s(e^{V/V_T} - 1)$ are correct?`,
      options: [R`At low forward current, recombination in the depletion region gives an ideality factor near 2.`, R`At high forward current, series resistance makes the $\log I$ versus $V$ plot bend over.`, R`In reverse bias the current settles at exactly $I_s$ whatever the voltage.`, R`At high-level injection the ideality factor again approaches 2.`],
      answer: [0, 1, 3],
      sol: R`Recombination through traps in the depletion region gives a current $\propto e^{V/2V_T}$, dominating at low current. At high current the ohmic drop $IR_s$ steals voltage from the junction, and high-level injection (injected density comparable to the doping) also changes the slope to about $e^{V/2V_T}$. In reverse bias, generation in the depletion region adds a current that grows with the depletion width, roughly as $\sqrt{V_R}$, so the reverse current keeps creeping up rather than saturating.`,
      trap: R`Taking "reverse saturation current" literally: in silicon the generation current is usually larger than $I_s$ and does not saturate.` },
    { id: 'dio-r4-10', type: 'nat', level: 5, exams: A, sub: 'rectifiers', unit: 'ms',
      q: R`A full-wave rectifier with a large reservoir capacitor runs from $50$ Hz mains. The output peaks at $20$ V and the ripple is $1.0$ V peak to peak. Assuming the diodes conduct only while the rectified sine rises from the trough of the ripple to its peak, each conduction interval lasts ______ ms (to two decimal places).`,
      answer: 1.01, tol: 0.01, calc: () => Math.acos(0.95) / (2 * Math.PI * 50) * 1e3,
      sol: R`The diodes switch on when the rectified sine climbs back to the capacitor voltage, $20 - 1.0 = 19$ V, and off at the peak. Measured back from the peak, $V_m\cos\theta = 19$, so $\cos\theta = 0.95$ and $\theta = 18.2^\circ = 0.318$ rad. With $\omega = 2\pi\times50 = 314$ rad/s, the interval is $0.318/314 = 1.01$ ms, out of each $10$ ms half cycle. All the charge for the next $9$ ms is delivered in this short burst, so the diode peak current is roughly ten times the load current.`,
      trap: R`Using the full $20$ ms mains period, or measuring the angle with $\sin\theta = 0.95$ (which gives the switch-on instant from the zero crossing, not the interval).` },
  ],
  gens: [
    { id: 'dio-r4g1', type: 'nat', level: 2, exams: A, sub: 'LEDs',
      make(r) {
        const [col, Vf] = choose(r, [['red', 1.8], ['yellow', 2.0], ['green', 2.2], ['blue', 3.0], ['white', 3.1]]);
        const n = int(r, 1, 3), Vs = choose(r, [9, 12, 15, 24].filter((v) => v > n * Vf + 1)), I = choose(r, [5, 10, 15, 20, 25]);
        const Rr = (Vs - n * Vf) / (I * 1e-3);
        return { q: R`${n === 1 ? 'One' : n === 2 ? 'Two' : 'Three'} ${col} LED${n > 1 ? 's' : ''} (${n > 1 ? 'each dropping' : 'dropping'} $${Vf}$ V) ${n > 1 ? 'are' : 'is'} run in series from a $${Vs}$ V supply at $${I}$ mA. The series resistor needed is ______ $\Omega$ (to the nearest whole number).`,
          answer: Math.round(Rr), tol: Math.max(1, Math.round(Rr * 0.005)), unit: R`$\Omega$`, n, Vf, Vs, I,
          sol: R`The LEDs take $${n}\times${Vf} = ${round(n * Vf, 2)}$ V, leaving $${round(Vs - n * Vf, 2)}$ V for the resistor at $${I}$ mA: $R = ${round(Vs - n * Vf, 2)}/${I / 1000} = ${Math.round(Rr)}\ \Omega$.`,
          trap: 'Subtract every LED drop before applying Ohm\'s law to the resistor.' };
      },
      verify: (p) => (p.Vs - p.n * p.Vf) / (p.I * 1e-3) },
    { id: 'dio-r4g2', type: 'nat', level: 4, exams: A, sub: 'breakdown',
      make(r) {
        const m = choose(r, [1, 2, 5]), e = choose(r, [14, 15, 16, 17]), Ec = { 14: 2.5, 15: 3, 16: 4, 17: 6 }[e] * 1e5; // rough critical fields for silicon
        const Nd = m * 10 ** e, V = vbr(11.7, Ec, Nd);
        return { q: R`A silicon p$^+$-n junction ($\varepsilon_r = 11.7$) has $N_d = ${m === 1 ? '' : `${m}\\times`}10^{${e}}$ cm$^{-3}$. Taking a critical field of $${Ec / 1e5}\times10^5$ V/cm and neglecting the built-in potential, the breakdown voltage is ______ V (to three significant figures).`,
          answer: +V.toPrecision(3), tol: +(V * 0.01).toPrecision(2), unit: 'V', Nd, Ec,
          sol: R`$V_{BR} = \dfrac{\varepsilon E_c^2}{2eN_d} = \dfrac{(1.036\times10^{-12}\ \text{F/cm})(${Ec / 1e5}\times10^5)^2}{2(1.602\times10^{-19})(${m === 1 ? '' : `${m}\\times`}10^{${e}})} = ${+V.toPrecision(3)}$ V.`,
          trap: 'Breakdown voltage is inversely proportional to the light-side doping.' };
      },
      verify: (p) => vbr(11.7, p.Ec, p.Nd) },
    { id: 'dio-r4g3', type: 'nat', level: 5, exams: A, sub: 'rectifiers',
      make(r) {
        const f = choose(r, [50, 60]), full = r() < 0.5, Vm = choose(r, [10, 12, 15, 20, 24, 30]), Vr = choose(r, [0.5, 1, 1.5, 2]);
        const th = Math.acos(1 - Vr / Vm), t = th / (2 * Math.PI * f) * 1e3;
        return { q: R`A ${full ? 'full' : 'half'}-wave rectifier with a large reservoir capacitor runs from $${f}$ Hz mains. Its output peaks at $${Vm}$ V with $${Vr}$ V peak-to-peak ripple. Each diode conduction interval (from the ripple trough back up to the peak) lasts ______ ms (to three decimal places).`,
          answer: round(t, 3), tol: Math.max(0.002, round(t * 0.005, 3)), unit: 'ms', f, Vm, Vr,
          sol: R`Conduction starts when the sine regains $${Vm} - ${Vr} = ${round(Vm - Vr, 2)}$ V: $\cos\theta = ${round(1 - Vr / Vm, 4)}$, $\theta = ${round(th, 4)}$ rad. Time $= \theta/\omega = ${round(th, 4)}/(2\pi\times${f}) = ${round(t, 3)}$ ms. (Full- or half-wave changes how often this happens, not how long each burst lasts for a given ripple.)`,
          trap: 'The interval is measured back from the peak, so it uses cos θ = 1 − V_r/V_m.' };
      },
      verify: (p) => Math.acos(1 - p.Vr / p.Vm) / (2 * Math.PI * p.f) * 1e3 },
  ],
};
