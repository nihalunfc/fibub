// p-n junctions and diodes: equilibrium junction (built-in potential, depletion width, field), bias, the Shockley
// equation, dynamic resistance, ideality factor, temperature effects, junction capacitance and varactors, breakdown
// (Zener and avalanche), Zener regulators, load lines, rectifiers and filters, clippers and clampers, LEDs, photodiodes
// and solar cells. Original questions for IIT JAM, GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round, C } from '../_util.js';

const VT = 0.02585;                       // thermal voltage at 300 K, V
const EPS_SI = 11.7 * C.eps0;
// operating point of a resistor R (ohm) + diode (Is, n) on a supply Vs, solved by iteration
const opPoint = (Vs, R, Is, n = 1) => { let V = 0.6; for (let i = 0; i < 200; i++) V = n * VT * Math.log((Vs - V) / R / Is + 1); return (Vs - V) / R; };

export default {
  topic: 'diodes',
  items: [
    // ---------- level 1 ----------
    { id: 'dio-001', type: 'mcq', level: 1, exams: ['jam'], sub: 'bias',
      q: 'When a p-n junction is forward biased, its depletion region',
      options: ['becomes wider', 'becomes narrower', 'stays the same width', 'moves entirely into the p side'], answer: 1,
      sol: 'Forward bias (p side positive) opposes the built-in potential, so the barrier falls from $V_0$ to $V_0 - V$. Less uncovered charge is needed to hold a smaller potential step, and the width $W \\propto \\sqrt{V_0 - V}$ shrinks. Reverse bias does the opposite.',
      trap: 'Thinking the applied voltage adds to the barrier in forward bias. Forward bias lowers it.' },
    { id: 'dio-002', type: 'nat', level: 1, exams: ['jam'], sub: 'dynamic resistance', unit: 'Ω',
      q: 'An ideal diode (ideality factor 1) carries a forward current of $2$ mA at room temperature, where $V_T = kT/e = 25$ mV. Its dynamic (small-signal) resistance is ______ $\\Omega$ (to one decimal place).',
      answer: 12.5, tol: 0.1, calc: () => 0.025 / 0.002,
      sol: 'Differentiate $I = I_s(e^{V/V_T} - 1)$: $\\dfrac{dI}{dV} \\approx \\dfrac{I}{V_T}$ in forward bias. So $r_d = \\dfrac{V_T}{I} = \\dfrac{25\\text{ mV}}{2\\text{ mA}} = 12.5$ $\\Omega$.',
      trap: 'Using $V/I$ at the operating point (the static resistance), which is much larger.' },
    { id: 'dio-003', type: 'mcq', level: 1, exams: ['jam'], sub: 'Zener diode',
      q: 'A Zener diode used to hold a voltage steady is operated',
      options: ['in forward bias above its cut-in voltage', 'with zero bias', 'in reverse bias below breakdown', 'in reverse bias, in its breakdown region'], answer: 3,
      sol: 'In reverse breakdown the voltage across a Zener diode stays almost fixed at $V_Z$ while the current changes over a wide range. A series resistor takes up the difference between the supply and $V_Z$.',
      trap: 'Thinking breakdown destroys the diode. Zener diodes are designed to work there, as long as the power rating is not exceeded.' },
    { id: 'dio-004', type: 'mcq', level: 1, exams: ['jam'], sub: 'rectifiers',
      q: 'An ideal half-wave rectifier is fed a sine wave of peak $V_m$. The average (dc) voltage across the load is',
      options: ['$V_m/\\pi$', '$2V_m/\\pi$', '$V_m/\\sqrt2$', '$V_m/2$'], answer: 0,
      sol: 'Over one period the output is the positive half-sine and then zero: $V_{\\rm dc} = \\dfrac1{2\\pi}\\int_0^\\pi V_m\\sin\\theta\\,d\\theta = \\dfrac{2V_m}{2\\pi} = \\dfrac{V_m}{\\pi} = 0.318V_m$.',
      trap: '$2V_m/\\pi$ is the full-wave value; $V_m/\\sqrt2$ is the rms of the full sine.' },
    { id: 'dio-005', type: 'msq', level: 1, exams: ['jam'], sub: 'equilibrium junction', format: 'statements',
      q: 'For an unbiased p-n junction in thermal equilibrium, which statements are correct?',
      options: ['The Fermi level is the same throughout.', 'The diffusion current of each carrier is balanced by its drift current.', 'The net current is zero.', 'There is no electric field in the depletion region.'], answer: [0, 1, 2],
      sol: '<b>Flat Fermi level:</b> true: in equilibrium no net energy flows. <b>Diffusion balanced by drift:</b> true, for electrons and holes separately. <b>Zero current:</b> true. <b>No field:</b> false. The uncovered donor and acceptor ions create a strong field (often $10^6$ to $10^7$ V/m) pointing from n to p; it is what drives the drift current.',
      trap: 'Zero current does not mean no field: two equal and opposite currents flow.' },
    { id: 'dio-006', type: 'nat', level: 1, exams: ['jam'], sub: 'LED', unit: 'nm',
      q: 'An LED made of a semiconductor with band gap $1.9$ eV emits light of wavelength about ______ nm (to the nearest nm). Take $hc = 1240$ eV nm.',
      answer: 653, tol: 2, calc: () => 1240 / 1.9,
      sol: 'Electrons dropping across the gap emit photons of energy close to $E_g$: $\\lambda = hc/E_g = 1240/1.9 = 653$ nm, red light.',
      trap: 'Inverting the relation: a larger gap gives a shorter wavelength (towards blue).' },

    // ---------- level 2 ----------
    { id: 'dio-007', type: 'nat', level: 2, exams: ['jam'], sub: 'built-in potential', unit: 'V',
      q: 'A silicon junction has $N_a = 10^{17}$ cm$^{-3}$ and $N_d = 10^{15}$ cm$^{-3}$, with $n_i = 10^{10}$ cm$^{-3}$ and $kT/e = 0.02585$ V. Its built-in potential is ______ V (to three decimal places).',
      answer: 0.714, tol: 0.003, calc: () => 0.02585 * Math.log(1e17 * 1e15 / 1e20),
      sol: '$V_0 = \\dfrac{kT}{e}\\ln\\dfrac{N_aN_d}{n_i^2} = 0.02585\\ln\\dfrac{10^{32}}{10^{20}} = 0.02585\\times\\ln10^{12} = 0.02585\\times27.63 = 0.714$ V.',
      trap: 'Using $\\ln(N_aN_d/n_i)$ without squaring $n_i$, or $\\log_{10}$.' },
    { id: 'dio-008', type: 'mcq', level: 2, exams: ['jam'], sub: 'depletion region',
      q: 'In a p$^+$-n junction ($N_a \\gg N_d$), the depletion region lies',
      options: ['equally on both sides', 'mostly on the p side', 'mostly on the n side', 'outside the junction'], answer: 2,
      sol: 'The uncovered charge must balance: $N_ax_p = N_dx_n$. If $N_a \\gg N_d$, then $x_n \\gg x_p$: the depletion region spreads into the lightly doped side, which needs a wider region to uncover the same charge.',
      trap: 'Expecting the region to be wider on the heavily doped side. Heavy doping packs the charge into a thin layer.' },
    { id: 'dio-009', type: 'nat', level: 2, exams: ['jam'], sub: 'Zener regulator', unit: 'mA',
      q: 'A $15$ V supply feeds a $9$ V Zener diode through a $200$ $\\Omega$ series resistor; a $1$ k$\\Omega$ load is connected across the Zener. The Zener current is ______ mA.',
      answer: 21, tol: 0.1, calc: () => ((15 - 9) / 200 - 9 / 1000) * 1000,
      sol: 'The Zener holds the load at $9$ V. Series current $I_S = (15 - 9)/200 = 30$ mA. Load current $I_L = 9/1000 = 9$ mA. The Zener takes the rest: $I_Z = 30 - 9 = 21$ mA.',
      trap: 'Forgetting that the load draws part of the series current.' },
    { id: 'dio-010', type: 'mcq', level: 2, exams: ['jam'], sub: 'rectifiers',
      q: 'The maximum possible efficiency (dc output power over ac input power) of an ideal full-wave rectifier with a resistive load is',
      options: ['$40.6\\%$', '$100\\%$', '$81.2\\%$', '$63.7\\%$'], answer: 2,
      sol: 'Full wave: $I_{\\rm dc} = 2I_m/\\pi$ and $I_{\\rm rms} = I_m/\\sqrt2$. Efficiency $= \\dfrac{I_{\\rm dc}^2R}{I_{\\rm rms}^2R} = \\dfrac{4/\\pi^2}{1/2} = \\dfrac{8}{\\pi^2} = 81.2\\%$. Half wave gives exactly half, $40.6\\%$. The rest is ripple power, not loss.',
      trap: '$63.7\\%$ is $2/\\pi$, the ratio $V_{\\rm dc}/V_m$, not a power ratio.' },
    { id: 'dio-011', type: 'nat', level: 2, exams: ['jam'], sub: 'Shockley equation', unit: 'mA',
      q: 'A diode with reverse saturation current $10^{-12}$ A and ideality factor 1 is forward biased at $0.60$ V, with $V_T = 25.85$ mV. The current is ______ mA (to one decimal place).',
      answer: 12.0, tol: 0.15, calc: () => 1e-12 * (Math.exp(0.6 / 0.02585) - 1) * 1e3,
      sol: '$I = I_s(e^{V/V_T} - 1)$. $V/V_T = 0.60/0.02585 = 23.21$, $e^{23.21} = 1.20\\times10^{10}$. So $I = 10^{-12}\\times1.20\\times10^{10} = 0.0120$ A $= 12.0$ mA.',
      trap: 'Tiny changes in $V$ matter: at $0.62$ V the current would already be $26$ mA.' },
    { id: 'dio-012', type: 'mcq', level: 2, exams: ['jam'], sub: 'rectifiers',
      q: 'In a centre-tapped full-wave rectifier, each half of the secondary has peak voltage $V_m$. The peak inverse voltage across each (ideal) diode is',
      options: ['$2V_m$', '$V_m/2$', '$V_m$', '$\\sqrt2V_m$'], answer: 0,
      sol: 'When one diode conducts, the output sits at $+V_m$ (its half of the winding) while the other diode\'s anode is at $-V_m$ (the other half). The reverse voltage across the non-conducting diode is $V_m - (-V_m) = 2V_m$. A bridge rectifier needs diodes rated only for $V_m$.',
      trap: 'Taking $V_m$, the bridge value. The centre-tap circuit stresses its diodes twice as much.' },
    { id: 'dio-013', type: 'mcq', level: 2, exams: ['jam'], sub: 'rectifiers',
      q: 'The ripple factor (rms of the ac part over the dc value) of an unfiltered half-wave rectifier output is',
      options: ['$1.21$', '$0.48$', '$0.0$', '$1.57$'], answer: 0,
      sol: 'For half wave, $V_{\\rm rms} = V_m/2$ and $V_{\\rm dc} = V_m/\\pi$. Ripple factor $= \\sqrt{(V_{\\rm rms}/V_{\\rm dc})^2 - 1} = \\sqrt{(\\pi/2)^2 - 1} = \\sqrt{2.467 - 1} = 1.21$. Full wave gives $0.48$. The ac part is larger than the dc part, which is why filters are needed.',
      trap: '$1.57 = \\pi/2$ is the form factor $V_{\\rm rms}/V_{\\rm dc}$, not the ripple factor.' },
    { id: 'dio-014', type: 'msq', level: 2, exams: ['jam', 'gate'], sub: 'breakdown', format: 'statements',
      q: 'Which statements about breakdown in p-n junctions are correct?',
      options: ['Zener breakdown happens in heavily doped junctions.', 'The Zener mechanism is quantum-mechanical tunnelling of electrons across a very thin barrier.', 'The avalanche breakdown voltage decreases as temperature rises.', 'Diodes that break down near 5 to 6 V have a temperature coefficient close to zero.'], answer: [0, 1, 3],
      sol: '<b>Heavily doped:</b> true: the depletion layer is thin and the field enormous. <b>Tunnelling:</b> true. <b>Avalanche falls with $T$:</b> false. Hotter lattices vibrate more, carriers lose energy in more collisions and need a higher field to start an avalanche, so the avalanche voltage rises (positive coefficient). Zener breakdown has a negative coefficient (the gap shrinks with $T$). <b>Near 5 to 6 V:</b> true: both mechanisms share the work and the two effects nearly cancel.',
      trap: 'Remembering only that "Zener diodes" break down; most Zener diodes above about 6 V actually work by avalanche.' },
    { id: 'dio-015', type: 'mcq', level: 2, exams: ['jam'], sub: 'load line',
      q: 'A $5$ V source drives a silicon diode through a $1$ k$\\Omega$ resistor. Using the constant-voltage model (0.7 V drop when conducting), the diode current is',
      options: ['$5.0$ mA', '$5.7$ mA', '$4.3$ mA', '$0.7$ mA'], answer: 2,
      sol: 'Kirchhoff: $5 = I(1000) + 0.7$, so $I = 4.3/1000 = 4.3$ mA. On the I-V graph this is where the load line from $(0, 5\\text{ mA})$ to $(5\\text{ V}, 0)$ meets the diode curve.',
      trap: 'Adding the diode drop instead of subtracting it (5.7 mA), or ignoring it (5.0 mA).' },
    { id: 'dio-016', type: 'mcq', level: 2, exams: ['jam', 'gate'], sub: 'junction capacitance',
      q: 'For an abrupt junction with built-in potential $V_0$ under reverse bias $V_R$, the depletion (junction) capacitance varies as',
      options: ['$(V_0 + V_R)^{-1}$', '$(V_0 + V_R)^{-1/2}$', '$(V_0 + V_R)^{1/2}$', '$(V_0 + V_R)^{-1/3}$'], answer: 1,
      sol: 'The depletion layer acts like a parallel-plate capacitor of gap $W$: $C = \\varepsilon A/W$, with $W \\propto (V_0 + V_R)^{1/2}$ for an abrupt junction. So $C \\propto (V_0 + V_R)^{-1/2}$. A linearly graded junction gives the $-1/3$ power. Varactor diodes use this voltage-controlled capacitance to tune circuits.',
      trap: 'The $-1/3$ law belongs to a graded junction, not an abrupt one.' },

    // ---------- level 3 ----------
    { id: 'dio-017', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'depletion width', unit: 'μm',
      q: 'A silicon junction ($\\varepsilon_r = 11.7$) has $N_a = 10^{17}$ cm$^{-3}$, $N_d = 10^{15}$ cm$^{-3}$ and built-in potential $0.714$ V. At zero bias its depletion width is ______ μm (to two decimal places).',
      answer: 0.97, tol: 0.01, calc: () => Math.sqrt(2 * EPS_SI * 0.714 / C.e * (1 / 1e23 + 1 / 1e21)) * 1e6,
      sol: '$W = \\sqrt{\\dfrac{2\\varepsilon V_0}{e}\\left(\\dfrac1{N_a} + \\dfrac1{N_d}\\right)}$ in SI units: $N_a = 10^{23}$, $N_d = 10^{21}$ m$^{-3}$. $\\dfrac{2\\times11.7\\times8.854\\times10^{-12}\\times0.714}{1.602\\times10^{-19}} = 9.23\\times10^8$; times $1.01\\times10^{-21}$ gives $9.33\\times10^{-13}$ m$^2$; root: $W = 0.97$ μm, almost all on the lightly doped n side.',
      trap: 'Leaving densities in cm$^{-3}$ inside an SI formula changes the result by a factor of 1000.' },
    { id: 'dio-018', type: 'nat', level: 3, exams: ['jam'], sub: 'Shockley equation', unit: 'mV',
      q: 'For an ideal diode (ideality factor 1) at room temperature ($V_T = 25.85$ mV) in forward bias, the extra voltage needed to raise the current tenfold is ______ mV (to one decimal place).',
      answer: 59.5, tol: 0.3, calc: () => 25.85 * Math.log(10),
      sol: 'Well above $I_s$, $I \\approx I_se^{V/V_T}$, so $V_2 - V_1 = V_T\\ln(I_2/I_1) = 25.85\\times\\ln10 = 25.85\\times2.303 = 59.5$ mV. Roughly 60 mV per decade of current; a diode with ideality factor $\\eta$ needs $\\eta$ times as much.',
      trap: 'Thinking ten times the current needs ten times the voltage. Diode current is exponential in voltage.' },
    { id: 'dio-019', type: 'mcq', level: 3, exams: ['jam'], sub: 'temperature',
      q: 'At a fixed forward current, the voltage across a silicon diode changes with temperature by about',
      options: ['$+2$ mV per kelvin', '$-2$ mV per kelvin', '$-20$ mV per kelvin', 'it does not change'], answer: 1,
      sol: '$I_s \\propto n_i^2$ grows very fast with temperature, so less forward voltage is needed for the same current. The net change is about $-2$ mV/K for silicon. This is used in simple temperature sensors and is why transistor circuits drift when warm.',
      trap: 'The thermal voltage $kT/e$ grows with $T$, which suggests a positive change, but the rise of $I_s$ wins.' },
    { id: 'dio-020', type: 'nat', level: 3, exams: ['jam'], sub: 'filters', unit: 'V',
      q: 'A full-wave rectifier with peak output $20$ V feeds a $1$ k$\\Omega$ load in parallel with a $1000$ μF capacitor. The supply is $50$ Hz. The approximate peak-to-peak ripple voltage is ______ V (to two decimal places).',
      answer: 0.20, tol: 0.005, calc: () => 20 / (2 * 50 * 1000 * 1000e-6),
      sol: 'The capacitor is topped up twice per cycle (every $1/2f = 10$ ms) and in between discharges through the load at almost constant current $I \\approx V_m/R = 20$ mA. Ripple $\\Delta V \\approx \\dfrac{I}{2fC} = \\dfrac{V_m}{2fRC} = \\dfrac{20}{2\\times50\\times1000\\times10^{-3}} = 0.20$ V.',
      trap: 'Using $f$ instead of $2f$ (half-wave formula) doubles the ripple.' },
    { id: 'dio-021', type: 'msq', level: 3, exams: ['jam', 'gate'], sub: 'saturation current', format: 'statements',
      q: 'Which statements about the reverse saturation current $I_s$ of a p-n junction diode are correct?',
      options: ['It depends strongly on temperature.', 'It is larger for a germanium diode than for a similar silicon diode.', 'It is proportional to $n_i^2$.', 'Below breakdown, it grows steeply with the reverse voltage.'], answer: [0, 1, 2],
      sol: '<b>Temperature:</b> true: roughly doubling every 10 K in Si. <b>Ge larger:</b> true: Ge has a smaller gap and $n_i$ about $10^3$ times larger. <b>$\\propto n_i^2$:</b> true: $I_s = eAn_i^2\\left(\\dfrac{D_p}{L_pN_d} + \\dfrac{D_n}{L_nN_a}\\right)$, from minority carriers $n_i^2/N$ diffusing to the junction. <b>Grows with $V_R$:</b> false: it saturates, because it is limited by how many minority carriers reach the junction, not by the voltage.',
      trap: 'The word "saturation" is the clue: past a few $kT/e$ of reverse bias, the ideal reverse current stops growing.' },
    { id: 'dio-022', type: 'nat', level: 3, exams: ['jam'], sub: 'Zener regulator', unit: 'Ω',
      q: 'A $12$ V supply feeds a $6.0$ V Zener through a $100$ $\\Omega$ resistor. The Zener needs at least $5$ mA to stay in breakdown. The smallest load resistance that still keeps the output regulated is ______ $\\Omega$ (to the nearest ohm).',
      answer: 109, tol: 1, calc: () => 6 / ((12 - 6) / 100 - 0.005),
      sol: 'Series current $I_S = (12 - 6)/100 = 60$ mA, whatever the load. The load can take at most $60 - 5 = 55$ mA. So $R_{L,\\min} = 6.0/0.055 = 109$ $\\Omega$. A smaller load would starve the Zener and the output would fall below 6 V.',
      trap: 'Ignoring the minimum Zener current gives $100$ $\\Omega$.' },
    { id: 'dio-023', type: 'mcq', level: 3, exams: ['jam'], sub: 'clampers',
      q: 'The signal $5\\sin\\omega t$ V goes through a series capacitor to the output; an ideal diode connects the output to ground with its cathode at the output and anode at ground. After the first few cycles, the output swings between',
      options: ['$-5$ V and $+5$ V', '$0$ and $+5$ V', '$-10$ V and $0$', '$0$ and $+10$ V'], answer: 3,
      sol: 'Whenever the output tries to go below 0 the diode conducts and charges the capacitor, until the capacitor holds 5 V that lifts the whole wave. Then the most negative point of the output is 0 and the wave swings from 0 to $+10$ V. This is a positive clamper (dc restorer): the shape is unchanged, only shifted.',
      trap: 'Confusing a clamper with a clipper: a clipper would cut the wave to 0 to $+5$ V.' },
    { id: 'dio-024', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'solar cell', unit: 'V',
      q: 'A solar cell gives a photocurrent of $30$ mA, has reverse saturation current $10^{-10}$ A and ideality factor 1, at $V_T = 25.85$ mV. Its open-circuit voltage is ______ V (to three decimal places).',
      answer: 0.505, tol: 0.003, calc: () => 0.02585 * Math.log(1 + 30e-3 / 1e-10),
      sol: 'With the photocurrent, $I = I_s(e^{V/V_T} - 1) - I_L$. Open circuit means $I = 0$: $V_{oc} = V_T\\ln(1 + I_L/I_s) = 0.02585\\ln(3\\times10^8 + 1) = 0.02585\\times19.52 = 0.505$ V.',
      trap: 'Expecting $V_{oc}$ to grow in proportion to the light. It grows only logarithmically.' },
    { id: 'dio-025', type: 'mcq', level: 3, exams: ['jam', 'gate'], sub: 'depletion region',
      q: 'For an abrupt p-n junction, the ratio of the depletion widths on the two sides, $x_n/x_p$, equals',
      options: ['$N_a/N_d$', '$N_d/N_a$', '$\\sqrt{N_a/N_d}$', '$1$'], answer: 0,
      sol: 'The total charge on the two sides must cancel: $eN_dx_nA = eN_ax_pA$. So $x_n/x_p = N_a/N_d$. The region is wider on the less doped side.',
      trap: '$N_d/N_a$ inverts it. Think of balancing charges: low density needs more width.' },
    { id: 'dio-026', type: 'mcq', level: 3, exams: ['jam'], sub: 'solar cell',
      q: 'Taking current into the p side as positive, a solar cell delivering power to a load works in which quadrant of its I-V graph?',
      options: ['first ($V > 0$, $I > 0$)', 'second ($V < 0$, $I > 0$)', 'third ($V < 0$, $I < 0$)', 'fourth ($V > 0$, $I < 0$)'], answer: 3,
      sol: 'A device delivers power when $VI < 0$ with this convention. The illuminated cell has a forward voltage across it ($V > 0$) while the photocurrent flows out of the p side ($I < 0$): the fourth quadrant. A photodiode used as a detector sits in the third quadrant (reverse bias), and a forward-biased LED in the first.',
      trap: 'Picturing the solar cell as a forward-biased diode with forward current: the current is reversed.' },
    { id: 'dio-027', type: 'nat', level: 3, exams: ['jam'], sub: 'dynamic resistance', unit: 'Ω',
      q: 'A diode with ideality factor $2$ carries $5$ mA, with $V_T = 25.85$ mV. Its dynamic resistance is ______ $\\Omega$ (to two decimal places).',
      answer: 10.34, tol: 0.05, calc: () => 2 * 0.02585 / 0.005,
      sol: '$I = I_s(e^{V/\\eta V_T} - 1)$ gives $r_d = \\dfrac{\\eta V_T}{I} = \\dfrac{2\\times0.02585}{0.005} = 10.34$ $\\Omega$.',
      trap: 'Leaving out $\\eta$ halves the answer.' },
    { id: 'dio-028', type: 'msq', level: 3, exams: ['jam'], sub: 'optoelectronics', format: 'statements',
      q: 'Which statements about optoelectronic diodes are correct?',
      options: ['A photodiode used as a light detector is operated in reverse bias.', 'The photocurrent of a photodiode is proportional to the light intensity.', 'An LED emits light when reverse biased.', 'The colour of an LED is set by the band gap of its semiconductor.'], answer: [0, 1, 3],
      sol: '<b>Reverse bias:</b> true: the wide depletion region collects the light-made pairs quickly and the dark current is small. <b>Proportional:</b> true: each absorbed photon gives at most one electron-hole pair. <b>Reverse-biased LED:</b> false: light comes from recombination of injected carriers, which needs forward bias. <b>Colour from gap:</b> true: $\\lambda \\approx hc/E_g$.',
      trap: 'Mixing up the two: detectors work in reverse bias, emitters in forward bias.' },
    { id: 'dio-029', type: 'msq', level: 3, exams: ['jam'], sub: 'filters', format: 'statements',
      q: 'A rectifier feeds a load through a large capacitor across the load. Which statements are correct?',
      options: ['A larger capacitance reduces the ripple.', 'A larger load current increases the ripple.', 'The diodes conduct during the whole of each half cycle.', 'The peak diode current is much larger than the dc load current.'], answer: [0, 1, 3],
      sol: 'Ripple $\\approx I_{\\rm dc}/(fC)$ (half wave) or $I_{\\rm dc}/(2fC)$ (full wave): <b>larger $C$</b> reduces it (true), <b>larger current</b> raises it (true). <b>Whole half cycle:</b> false: the diodes conduct only briefly near each peak, when the input climbs above the capacitor voltage. <b>Peak current:</b> true: all the charge the load used during the cycle must be put back in that short burst.',
      trap: 'Forgetting the current spikes: diodes and transformers in capacitor-filter supplies must handle them.' },

    // ---------- level 4 ----------
    { id: 'dio-030', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'junction capacitance',
      q: 'An abrupt junction with built-in potential $0.80$ V has capacitance $C_0$ at zero bias. At a reverse bias of $7.2$ V its capacitance is ______ $C_0$ (to three decimal places).',
      answer: 0.316, tol: 0.003, calc: () => Math.sqrt(0.8 / 8.0),
      sol: '$C \\propto (V_0 + V_R)^{-1/2}$, so $\\dfrac{C}{C_0} = \\sqrt{\\dfrac{V_0}{V_0 + V_R}} = \\sqrt{\\dfrac{0.80}{8.0}} = \\sqrt{0.1} = 0.316$.',
      trap: 'Using $V_R$ alone ($\\sqrt{0.8/7.2} = 0.333$) forgets that the built-in potential adds to the reverse bias.' },
    { id: 'dio-031', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'junction field', unit: 'kV/cm',
      q: 'In a silicon p$^+$-n junction ($\\varepsilon_r = 11.7$) the n side has $N_d = 10^{16}$ cm$^{-3}$ and the depletion region (practically all on the n side) is $1.0$ μm wide. The peak electric field is ______ kV/cm (to the nearest unit).',
      answer: 155, tol: 1.5, calc: () => C.e * 1e22 * 1e-6 / EPS_SI / 1e5,
      sol: 'Gauss\'s law through the uniformly charged n region: the field grows linearly from zero at the edge to its peak at the junction, $E_{\\max} = \\dfrac{eN_dx_n}{\\varepsilon} = \\dfrac{1.602\\times10^{-19}\\times10^{22}\\times10^{-6}}{11.7\\times8.854\\times10^{-12}} = 1.55\\times10^7$ V/m $= 155$ kV/cm (1 kV/cm $= 10^5$ V/m).',
      trap: 'Using $N_d$ in cm$^{-3}$ inside SI units, or confusing V/m with V/cm.' },
    { id: 'dio-032', type: 'mcq', level: 4, exams: ['jam'], sub: 'temperature',
      q: 'The reverse saturation current of a diode roughly doubles for every $10$ K rise. If it is $5$ nA at $300$ K, at $330$ K it is about',
      options: ['$15$ nA', '$10$ nA', '$80$ nA', '$40$ nA'], answer: 3,
      sol: 'A 30 K rise is three doublings: $5\\times2^3 = 40$ nA. Growth is multiplicative, not additive.',
      trap: '$15$ nA treats each 10 K step as adding 5 nA.' },
    { id: 'dio-033', type: 'nat', level: 4, exams: ['jam', 'gate'], sub: 'load line', unit: 'mA',
      q: 'A $2.0$ V source drives a diode ($I_s = 10^{-14}$ A, ideality factor 1, $V_T = 25.85$ mV) through a $1.0$ k$\\Omega$ resistor. Solving the exponential diode equation (not the 0.7 V model), the current is ______ mA (to two decimal places).',
      answer: 1.34, tol: 0.01, calc: () => opPoint(2, 1000, 1e-14) * 1e3,
      sol: 'Solve $I = (2 - V)/1000$ and $V = V_T\\ln(I/I_s + 1)$ together by iteration. Start with $V = 0.7$: $I = 1.30$ mA, $V = 0.02585\\ln(1.30\\times10^{11}) = 0.6619$ V. Then $I = 1.338$ mA, $V = 0.6626$ V; then $I = 1.337$ mA. It settles at $V = 0.662$ V and $I = 1.34$ mA, where the load line crosses the diode curve.',
      trap: 'Stopping at the 0.7 V model (1.30 mA). The iteration converges in two or three steps because the log changes slowly.' },
    { id: 'dio-034', type: 'msq', level: 4, exams: ['jam'], sub: 'rectifiers', format: 'statements',
      q: 'Comparing rectifier circuits with ideal diodes, which statements are correct?',
      options: ['The peak inverse voltage across each diode of a bridge rectifier is $V_m$.', 'A bridge rectifier needs a centre-tapped transformer.', 'The ripple frequency of a full-wave rectifier is twice the supply frequency.', 'A half-wave rectifier uses its transformer less efficiently, and the dc in the secondary can saturate the core.'], answer: [0, 2, 3],
      sol: '<b>Bridge PIV $V_m$:</b> true: the two non-conducting diodes share the reverse voltage across the secondary. <b>Centre tap:</b> false: that is the two-diode full-wave circuit; the bridge works on a plain secondary. <b>Ripple at $2f$:</b> true: two output pulses per cycle. <b>Half-wave transformer:</b> true: its current flows one way only, so it has a dc part (low transformer utilisation factor, about 0.29).',
      trap: 'Mixing up the two full-wave circuits: centre-tap uses 2 diodes and a tapped winding; bridge uses 4 diodes and no tap.' },
    { id: 'dio-035', type: 'mcq', level: 4, exams: ['jam'], sub: 'rectifiers',
      q: 'An ideal half-wave rectifier gets a sine wave of peak $10$ V and feeds a $1$ k$\\Omega$ resistor. The dc power in the load, $V_{\\rm dc}^2/R$, is about',
      options: ['$25$ mW', '$50$ mW', '$10.1$ mW', '$40.5$ mW'], answer: 2,
      sol: '$V_{\\rm dc} = V_m/\\pi = 3.183$ V, so $P_{\\rm dc} = 3.183^2/1000 = 10.1$ mW. The total power delivered, $V_{\\rm rms}^2/R = (V_m/2)^2/R = 25$ mW, is larger; their ratio, $40.5\\%$, is the rectification efficiency.',
      trap: '$25$ mW is the total (rms) power, not the dc part.' },
    { id: 'dio-036', type: 'mcq', level: 4, exams: ['jam'], sub: 'Zener regulator',
      q: 'In a working Zener regulator, the load is suddenly disconnected while the supply stays the same. The Zener current',
      options: ['falls to zero', 'rises to the full series-resistor current', 'stays the same', 'halves'], answer: 1,
      sol: 'The series current $(V_{\\rm in} - V_Z)/R$ depends only on the supply, the Zener voltage and $R$. With no load, all of it flows through the Zener. This is the worst case for Zener power, $P = V_ZI_S$, and decides the Zener rating.',
      trap: 'Thinking the Zener only carries current when a load needs it. It carries whatever the load does not take.' },
    { id: 'dio-037', type: 'nat', level: 4, exams: ['jam'], sub: 'temperature', unit: 'V',
      q: 'A silicon diode drops $0.650$ V at $25^\\circ$C at a fixed current. With a temperature coefficient of $-2.1$ mV/$^\\circ$C, the drop at $85^\\circ$C (same current) is ______ V (to three decimal places).',
      answer: 0.524, tol: 0.002, calc: () => 0.65 - 0.0021 * 60,
      sol: '$\\Delta V = -2.1\\text{ mV}/^\\circ\\text{C}\\times60^\\circ\\text{C} = -126$ mV. So $V = 0.650 - 0.126 = 0.524$ V.',
      trap: 'Adding the change because the temperature went up: the coefficient is negative.' },

    // ---------- level 5 ----------
    { id: 'dio-038', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'depletion width', unit: 'V',
      q: 'An abrupt junction has built-in potential $0.75$ V. The reverse bias needed to make its depletion width three times its zero-bias value is ______ V (to two decimal places).',
      answer: 6.00, tol: 0.02, calc: () => 8 * 0.75,
      sol: '$W \\propto \\sqrt{V_0 + V_R}$. Three times the width needs nine times the total potential: $V_0 + V_R = 9V_0$, so $V_R = 8V_0 = 8\\times0.75 = 6.00$ V.',
      trap: 'Answering $3V_0$ or $2V_0$: the width goes as the square root, and the built-in part is already there at zero bias.' },
    { id: 'dio-039', type: 'mcq', level: 5, exams: ['jam', 'gate'], sub: 'bias',
      q: 'Two identical silicon diodes are connected in series with their cathodes joined (back to back), and $5$ V is applied across the pair. Which is correct?',
      options: ['Each diode drops 2.5 V and about 2 mA flows.', 'One diode is forward biased, the current is about the forward current at 0.7 V, and 4.3 V appears across the other.', 'Almost all of the 5 V appears across the reverse-biased diode, and the current is about the reverse saturation current.', 'Both diodes are in breakdown.'], answer: 2,
      sol: 'Whichever way the voltage is applied, one diode is reverse biased. Only its tiny saturation current $I_s$ can flow, and the forward diode needs just $V_T\\ln 2 \\approx 18$ mV to pass that current. So nearly the whole 5 V sits across the reverse diode and $I \\approx I_s$ (nanoamps or less). Unless 5 V exceeds the breakdown voltage, the pair blocks in both directions.',
      trap: 'Assuming the forward diode takes 0.7 V. That drop belongs to milliamp currents; at $I_s$ the forward drop is only tens of mV.' },
    { id: 'dio-040', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'ideality factor',
      q: 'A diode drops $0.62$ V at $1.0$ mA and $0.74$ V at $10$ mA (both well above $I_s$), at $V_T = 25.85$ mV. Its ideality factor is ______ (to two decimal places).',
      answer: 2.02, tol: 0.02, calc: () => 0.12 / (0.02585 * Math.log(10)),
      sol: 'For $I \\approx I_se^{V/\\eta V_T}$: $V_2 - V_1 = \\eta V_T\\ln(I_2/I_1)$. So $\\eta = \\dfrac{0.12}{0.02585\\times\\ln10} = \\dfrac{0.12}{0.05952} = 2.02$. An ideality factor near 2 suggests that recombination in the depletion region dominates, or that series resistance adds to the drop.',
      trap: 'Using $\\log_{10}$ (gives $\\eta = 4.6$).' },
    { id: 'dio-041', type: 'msq', level: 5, exams: ['jam', 'gate'], sub: 'Zener regulator', format: 'statements',
      q: 'A Zener regulator must give $10$ V to a $500$ $\\Omega$ load (20 mA) from a supply that varies from $15$ V to $20$ V. The Zener needs at least $2$ mA and may carry at most $50$ mA. Which choices of series resistor $R$ are correct?',
      options: ['$R = 150$ $\\Omega$ works over the whole supply range with the load connected.', '$R = 250$ $\\Omega$ works over the whole supply range with the load connected.', '$R = 220$ $\\Omega$ also keeps the Zener safe if the load is disconnected at a 20 V supply.', '$R = 180$ $\\Omega$ also keeps the Zener safe if the load is disconnected at a 20 V supply.'], answer: [0, 2],
      sol: 'Regulation at the lowest supply: $(15 - 10)/R \\ge 22$ mA, so $R \\le 227$ $\\Omega$. Zener limit at the highest supply with load: $(20 - 10)/R - 20 \\le 50$ mA, so $R \\ge 143$ $\\Omega$; without load: $10/R \\le 50$ mA, so $R \\ge 200$ $\\Omega$. <b>150:</b> 33 mA and 67 mA series current, Zener 13 to 47 mA: works. <b>250:</b> only 20 mA at 15 V, less than load plus 2 mA: fails. <b>220 unloaded:</b> $10/220 = 45$ mA $\\le 50$: safe. <b>180 unloaded:</b> $10/180 = 56$ mA: too much.',
      trap: 'Checking only one end of the supply range. The lowest supply limits $R$ from above, the highest supply (and no load) from below.' },
    { id: 'dio-042', type: 'nat', level: 5, exams: ['jam', 'gate'], sub: 'filters', unit: 'μF',
      q: 'A half-wave rectifier with a capacitor filter runs from a $60$ Hz supply and must deliver a steady $50$ mA with no more than $1.0$ V peak-to-peak ripple. The smallest capacitance needed is about ______ μF (to the nearest μF).',
      answer: 833, tol: 8, calc: () => 0.05 / (60 * 1.0) * 1e6,
      sol: 'Between peaks (one per cycle in half wave, $1/f$ apart) the capacitor alone supplies the load: $\\Delta V = \\dfrac{I}{fC}$. So $C = \\dfrac{I}{f\\Delta V} = \\dfrac{0.050}{60\\times1.0} = 8.33\\times10^{-4}$ F $= 833$ μF. A full-wave rectifier would need half of this.',
      trap: 'Using $2f$ (the full-wave case) gives 417 μF, which is not enough here.' },
    { id: 'dio-043', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'junction capacitance', unit: 'V',
      q: 'An abrupt junction has capacitance $24$ pF at a reverse bias of $1.25$ V and $12$ pF at $7.25$ V. Its built-in potential is ______ V (to two decimal places).',
      answer: 0.75, tol: 0.01, calc: () => (7.25 - 4 * 1.25) / 3,
      sol: '$C \\propto (V_0 + V_R)^{-1/2}$, so $\\left(\\dfrac{C_1}{C_2}\\right)^2 = \\dfrac{V_0 + V_{R2}}{V_0 + V_{R1}}$: $4 = \\dfrac{V_0 + 7.25}{V_0 + 1.25}$. Then $4V_0 + 5 = V_0 + 7.25$, so $V_0 = 0.75$ V. In the lab this is done by plotting $1/C^2$ against $V_R$: a straight line that meets the axis at $V_R = -V_0$, with a slope that gives the doping.',
      trap: 'Using the capacitance ratio 2 instead of its square 4.' },
  ],

  gens: [
    { id: 'dio-g01', type: 'nat', level: 2, exams: ['jam'], sub: 'built-in potential',
      make(r) {
        const [mat, ni, niTex] = choose(r, [['silicon', 1e10, '10^{10}'], ['silicon', 1.5e10, '1.5\\times10^{10}'], ['germanium', 2.4e13, '2.4\\times10^{13}'], ['GaAs', 2.1e6, '2.1\\times10^{6}']]);
        const ea = int(r, 15, 18), ed = int(r, 14, 17), ma = int(r, 1, 9), md = int(r, 1, 9);
        const Na = ma * 10 ** ea, Nd = md * 10 ** ed, V0 = VT * Math.log(Na * Nd / ni ** 2);
        return { q: `A ${mat} p-n junction has $N_a = ${ma}\\times10^{${ea}}$ cm$^{-3}$ and $N_d = ${md}\\times10^{${ed}}$ cm$^{-3}$, with $n_i = ${niTex}$ cm$^{-3}$ and $kT/e = 0.02585$ V. Its built-in potential is ______ V (to three decimal places).`,
          answer: round(V0, 3), tol: 0.003, unit: 'V', Na, Nd, ni,
          sol: `$V_0 = \\dfrac{kT}{e}\\ln\\dfrac{N_aN_d}{n_i^2} = 0.02585\\times\\ln(${(Na * Nd / ni ** 2).toExponential(3).replace(/e\+?(-?\d+)/, '\\times10^{$1}')}) = ${round(V0, 3)}$ V.`,
          trap: 'Forgetting to square $n_i$.' };
      },
      verify: (p) => VT * Math.log(p.Na * p.Nd / p.ni ** 2) },
    { id: 'dio-g02', type: 'nat', level: 2, exams: ['jam'], sub: 'Shockley equation',
      make(r) {
        const e = int(r, 9, 15), Is = 10 ** -e, n = choose(r, [1, 1, 1.5, 2]);
        const target = pick(r, 0.5, 50, 0.5) * 1e-3, V = round(n * VT * Math.log(target / Is + 1), 3);
        const I = Is * (Math.exp(V / (n * VT)) - 1) * 1e3;
        return { q: `A diode with $I_s = 10^{-${e}}$ A and ideality factor $${n}$ is forward biased at $${V}$ V, with $V_T = 25.85$ mV. The current is ______ mA (3 significant figures).`,
          answer: +I.toPrecision(3), tol: +(I * 0.01).toPrecision(2), unit: 'mA', Is, n, V,
          sol: `$I = I_s(e^{V/\\eta V_T} - 1)$ with $V/\\eta V_T = ${V}/(${n}\\times0.02585) = ${round(V / (n * VT), 3)}$. So $I = 10^{-${e}}\\times e^{${round(V / (n * VT), 3)}} = ${I.toPrecision(3)}$ mA.`,
          trap: 'Leaving out the ideality factor.' };
      },
      verify: (p) => p.Is * (Math.exp(p.V / (p.n * VT)) - 1) * 1e3 },
    { id: 'dio-g03', type: 'nat', level: 1, exams: ['jam'], sub: 'dynamic resistance',
      make(r) {
        const I = pick(r, 0.1, 20, 0.1), n = choose(r, [1, 1, 1.5, 2]), rd = n * VT / (I * 1e-3);
        return { q: `A diode with ideality factor $${n}$ carries $${I}$ mA at $V_T = 25.85$ mV. Its dynamic resistance is ______ $\\Omega$ (to two decimal places).`,
          answer: round(rd, 2), tol: Math.max(0.01, round(rd * 0.005, 2)), unit: 'Ω', I, n,
          sol: `$r_d = \\eta V_T/I = ${n}\\times0.02585/${round(I * 1e-3, 5)} = ${round(rd, 2)}$ $\\Omega$.`,
          trap: 'Using the static ratio $V/I$.' };
      },
      verify: (p) => p.n * VT / (p.I * 1e-3) },
    { id: 'dio-g04', type: 'nat', level: 2, exams: ['jam'], sub: 'Zener regulator',
      make(r) {
        let Vin, Vz, R, RL, Iz;
        do {
          Vz = choose(r, [3.3, 4.7, 5.1, 6.2, 7.5, 9.1, 12]); Vin = round(Vz + pick(r, 3, 15, 0.5), 1);
          R = choose(r, [100, 150, 220, 270, 330, 470]); RL = choose(r, [470, 680, 1000, 1500, 2200, 4700]);
          Iz = (Vin - Vz) / R - Vz / RL;
        } while (Iz < 0.002);
        return { q: `A $${Vin}$ V supply feeds a $${Vz}$ V Zener through $${R}$ $\\Omega$; a $${RL}$ $\\Omega$ load is across the Zener. The Zener current is ______ mA (to two decimal places).`,
          answer: round(Iz * 1e3, 2), tol: 0.02, unit: 'mA', Vin, Vz, R, RL,
          sol: `$I_S = (${Vin} - ${Vz})/${R} = ${round((Vin - Vz) / R * 1e3, 3)}$ mA, $I_L = ${Vz}/${RL} = ${round(Vz / RL * 1e3, 3)}$ mA, so $I_Z = ${round(Iz * 1e3, 2)}$ mA.`,
          trap: 'Forgetting the load current.' };
      },
      verify: (p) => ((p.Vin - p.Vz) / p.R - p.Vz / p.RL) * 1e3 },
    { id: 'dio-g05', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'depletion width',
      make(r) {
        const Nd = int(r, 1, 9) * 10 ** int(r, 14, 16), V0 = pick(r, 0.6, 0.9, 0.01), VR = pick(r, 0, 20, 0.5);
        const W = Math.sqrt(2 * EPS_SI * (V0 + VR) / (C.e * Nd * 1e6)) * 1e6;
        return { q: `A silicon p$^+$-n junction ($\\varepsilon_r = 11.7$) has $N_d = ${String(Nd.toExponential(0)).replace(/e\+?(\d+)/, '\\times10^{$1}')}$ cm$^{-3}$ on the n side and built-in potential $${V0}$ V. At a reverse bias of $${VR}$ V the depletion width (all on the n side) is ______ μm (3 significant figures).`,
          answer: +W.toPrecision(3), tol: +(W * 0.01).toPrecision(2), unit: 'μm', Nd, V0, VR,
          sol: `One-sided junction: $W = \\sqrt{\\dfrac{2\\varepsilon(V_0 + V_R)}{eN_d}}$ with $N_d$ in m$^{-3}$ ($\\times10^6$). $W = \\sqrt{\\dfrac{2\\times11.7\\times8.854\\times10^{-12}\\times${round(V0 + VR, 2)}}{1.602\\times10^{-19}\\times${(Nd * 1e6).toExponential(2).replace(/e\+?(-?\d+)/, '\\times10^{$1}')}}} = ${W.toPrecision(3)}$ μm.`,
          trap: 'Forgetting $V_0$, or the cm$^{-3}$ to m$^{-3}$ conversion.' };
      },
      verify: (p) => Math.sqrt(2 * EPS_SI * (p.V0 + p.VR) / (C.e * p.Nd * 1e6)) * 1e6 },
    { id: 'dio-g06', type: 'nat', level: 1, exams: ['jam'], sub: 'rectifiers',
      make(r) {
        const Vrms = choose(r, [6, 9, 12, 15, 18, 24, 30]), full = r() < 0.5, drop = choose(r, [0, 0.7]);
        const nd = full ? 2 : 1; // bridge: two drops
        const Vm = Vrms * Math.SQRT2 - nd * drop, Vdc = (full ? 2 : 1) * Vm / Math.PI;
        return { q: `A ${full ? 'bridge (full-wave)' : 'half-wave'} rectifier is fed $${Vrms}$ V rms from a transformer and drives a resistive load. ${drop ? 'Each conducting silicon diode drops 0.7 V.' : 'Treat the diodes as ideal.'} The dc output voltage is ______ V (to two decimal places).`,
          answer: round(Vdc, 2), tol: 0.03, unit: 'V', Vrms, full, nd, drop,
          sol: `Peak of the input: $${Vrms}\\sqrt2 = ${round(Vrms * Math.SQRT2, 3)}$ V${drop ? `, minus ${nd === 2 ? 'two diode drops (two diodes conduct in series in a bridge)' : 'one diode drop'}: $V_m = ${round(Vm, 3)}$ V` : ` $= V_m$`}. ${full ? 'Full wave' : 'Half wave'}: $V_{\\rm dc} = ${full ? '2' : ''}V_m/\\pi = ${round(Vdc, 2)}$ V.`,
          trap: 'Using the rms value as the peak, or forgetting that a bridge has two diodes in the current path.' };
      },
      verify: (p) => (p.full ? 2 : 1) * (p.Vrms * Math.SQRT2 - p.nd * p.drop) / Math.PI },
    { id: 'dio-g07', type: 'nat', level: 3, exams: ['jam', 'gate'], sub: 'junction capacitance',
      make(r) {
        const V0 = pick(r, 0.5, 0.9, 0.05), V1 = pick(r, 0, 3, 0.5), V2 = pick(r, V1 + 1, 25, 0.5), C1 = int(r, 5, 100);
        const C2 = C1 * Math.sqrt((V0 + V1) / (V0 + V2));
        return { q: `An abrupt junction with built-in potential $${V0}$ V has capacitance $${C1}$ pF at a reverse bias of $${V1}$ V. At $${V2}$ V reverse bias its capacitance is ______ pF (to two decimal places).`,
          answer: round(C2, 2), tol: Math.max(0.01, round(C2 * 0.005, 2)), unit: 'pF', V0, V1, V2, C1,
          sol: `$C \\propto (V_0 + V_R)^{-1/2}$: $C_2 = ${C1}\\sqrt{\\dfrac{${V0} + ${V1}}{${V0} + ${V2}}} = ${round(C2, 2)}$ pF.`,
          trap: 'Leaving out the built-in potential, or using the power $-1$.' };
      },
      verify: (p) => p.C1 * Math.sqrt((p.V0 + p.V1) / (p.V0 + p.V2)) },
    { id: 'dio-g08', type: 'mcq', level: 3, exams: ['jam'], sub: 'Shockley equation',
      make(r) {
        const ratio = choose(r, [2, 3, 5, 10, 20, 100]), n = choose(r, [1, 2]);
        const dV = n * VT * Math.log(ratio) * 1e3;
        const show = (v) => `$${round(v, 1)}$ mV`;
        const o = mcqOptions(r, dV, [n * VT * ratio * 1e3, n * VT * Math.log10(ratio) * 1e3, (3 - n) * VT * Math.log(ratio) * 1e3, n * VT * 1e3 / ratio, n * VT * (ratio - 1) * 1e3], show);
        return { q: `A diode with ideality factor $${n}$, well above its saturation current, has its forward current multiplied by $${ratio}$. With $V_T = 25.85$ mV, its voltage rises by`, ...o,
          sol: `$\\Delta V = \\eta V_T\\ln(I_2/I_1) = ${n}\\times25.85\\times\\ln${ratio} = ${round(dV, 1)}$ mV.`,
          trap: 'Using $\\log_{10}$, or assuming the voltage scales with the current.' };
      } },
  ],
};
