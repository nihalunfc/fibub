// Round 4 extras for transducers-detectors: original questions, written 2026-11-22.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;
const G = ['gate', 'net'];
const A = ['jam', 'gate', 'net'];
const E = 1.602176634e-19;

export default {
  items: [
    { id: 'trd-r4-01', type: 'mcq', level: 1, exams: A, sub: 'sensor types',
      q: R`Which of these transducers is self-generating (active), producing its electrical signal without any external excitation?`,
      options: [R`a metal-foil strain gauge`, R`a thermistor`, R`a piezoelectric crystal`, R`a linear variable differential transformer (LVDT)`], answer: 2,
      sol: R`A piezoelectric crystal produces charge directly when stressed. A strain gauge and a thermistor only change resistance, which must be read with a current or bridge supply, and an LVDT needs an AC excitation on its primary. Thermocouples and photovoltaic cells are other self-generating sensors.`,
      trap: R`An LVDT has an output coil, but it delivers nothing until its primary is driven.` },
    { id: 'trd-r4-02', type: 'mcq', level: 2, exams: G, sub: 'scintillators',
      q: R`A NaI(Tl) detector has an energy resolution (FWHM/E) of $7.0\%$ at $662$ keV. If the resolution is set by photoelectron statistics alone, at $1332$ keV it is about`,
      options: [R`$3.5\%$`, R`$4.9\%$`, R`$7.0\%$`, R`$14\%$`], answer: 1,
      sol: R`The number of photoelectrons is proportional to $E$, so the relative spread goes as $1/\sqrt E$: $7.0\%\times\sqrt{662/1332} = 7.0\%\times0.705 = 4.9\%$. The absolute width (in keV) grows as $\sqrt E$.`,
      trap: R`Scaling as $1/E$ (giving $3.5\%$) treats the width in keV as constant.` },
    { id: 'trd-r4-03', type: 'nat', level: 2, exams: G, sub: 'position sensors',
      q: R`An incremental optical encoder has $1000$ lines per revolution and its two quadrature channels are decoded on every edge of both (4x decoding). Its angular resolution is ______ degrees.`,
      answer: 0.09, tol: 0.001, calc: () => 360 / (4 * 1000),
      sol: R`Two channels $90^\circ$ apart (electrically) give four edges per line: $4\times1000 = 4000$ counts per revolution, so $360^\circ/4000 = 0.09^\circ$. The order in which the two channels change also tells the direction of rotation.`,
      trap: R`Counting lines only ($0.36^\circ$) wastes the resolution of quadrature decoding.` },
    { id: 'trd-r4-04', type: 'nat', level: 3, exams: G, sub: 'gas detectors',
      q: R`An ionisation chamber filled with air ($W = 34$ eV per ion pair) contains an alpha source of activity $1000$ Bq; every alpha particle deposits its full $5.0$ MeV in the gas. With complete charge collection, the chamber current is ______ pA (to one decimal place).`,
      answer: 23.6, tol: 0.2, calc: () => 1000 * (5.0e6 / 34) * E * 1e12,
      sol: R`Ion pairs per alpha: $5.0\times10^6/34 = 1.47\times10^5$. Charge per second: $1000\times1.47\times10^5\times1.602\times10^{-19} = 2.36\times10^{-11}$ A $= 23.6$ pA. Such small currents are why chambers need electrometers; there is no gas gain in the ionisation region.`,
      trap: R`Counting the charge of both the electron and the ion of each pair doubles the current; the external circuit carries $e$ per pair.` },
    { id: 'trd-r4-05', type: 'mcq', level: 3, exams: G, sub: 'semiconductor detectors',
      q: R`A silicon detector needs $3.6$ eV per electron-hole pair; an argon-based gas detector needs about $26$ eV per ion pair. If both had the same Fano factor and no electronic noise, the silicon detector's statistical energy resolution (FWHM) for the same deposited energy would be`,
      options: [R`about 2.7 times narrower`, R`about 7.2 times narrower`, R`the same`, R`about 2.7 times wider`], answer: 0,
      sol: R`The number of carriers is $N = E/\varepsilon$, and the FWHM is $2.355\sqrt{FN}\,\varepsilon = 2.355\sqrt{FE\varepsilon}$, so it scales as $\sqrt\varepsilon$: $\sqrt{3.6/26} = 0.37$, about 2.7 times narrower. (In practice silicon wins by even more, because gas multiplication adds fluctuations of its own.)`,
      trap: R`The ratio of energies per pair (7.2) is the ratio of carrier numbers; resolution follows its square root.` },
    { id: 'trd-r4-06', type: 'mcq', level: 2, exams: A, sub: 'gas detectors',
      q: R`A small amount of a halogen or organic vapour is added to the gas of a Geiger-Müller tube. Its purpose is`,
      options: [R`to raise the gas gain`, R`to absorb gamma rays`, R`to make the tube sensitive to slow neutrons`, R`to stop each discharge so the tube can reset after a pulse`], answer: 3,
      sol: R`After an avalanche, positive ions drifting to the cathode, and UV photons from the discharge, could free new electrons and restart the discharge endlessly. The quench molecules absorb the UV photons and take over the ions' charge, then dissociate harmlessly, so each event gives one pulse. Halogen quenchers recombine, so halogen tubes last much longer than organic-quenched ones.`,
      trap: R`The gain in a GM tube is already saturated; the quench gas controls the end of the discharge, not its size.` },
    { id: 'trd-r4-07', type: 'msq', level: 3, exams: A, sub: 'temperature sensors', format: 'statements',
      q: R`Which statements about temperature sensors are correct?`,
      options: [R`Some thermocouples can measure well above $1000\,^\circ$C, beyond the range of platinum resistance thermometers in normal use.`, R`Near room temperature an NTC thermistor's resistance changes by a few percent per kelvin.`, R`A platinum resistance thermometer's resistance rises by about $0.4\%$ per kelvin.`, R`A thermocouple's output depends only on the temperature of its hot junction.`], answer: [0, 1, 2],
      sol: R`Type B, R and S thermocouples work up to about $1600$ to $1800\,^\circ$C. A thermistor with $B\approx3500$ K has $\alpha = -B/T^2\approx-3.9\%$ per kelvin at 300 K. Platinum has $\alpha = 0.00385$ K$^{-1}$. A thermocouple measures the difference between its two junctions, so the reference junction temperature must be known or compensated.`,
      trap: R`Forgetting the reference junction: a thermocouple is a differential thermometer.` },
    { id: 'trd-r4-08', type: 'msq', level: 4, exams: G, sub: 'scintillators', format: 'statements',
      q: R`Comparing an inorganic NaI(Tl) crystal with a plastic (organic) scintillator, which statements are correct?`,
      options: [R`NaI(Tl) has a much higher photopeak efficiency for gamma rays, because of its high atomic number and density.`, R`Plastic scintillators are faster, with decay times of a few nanoseconds against about $230$ ns for NaI(Tl).`, R`NaI(Tl) is hygroscopic and must be sealed in a can.`, R`Plastic scintillators give better gamma-ray energy resolution than NaI(Tl).`], answer: [0, 1, 2],
      sol: R`Photoabsorption rises steeply with $Z$ (about $Z^{4}$ to $Z^5$); iodine ($Z = 53$) gives NaI a strong photopeak, while plastic (C and H) mostly Compton scatters gamma rays and shows almost no photopeak. Organic scintillators are fast (ns), useful for timing. NaI absorbs water and turns yellow, so it is canned. With less light and few photopeak events, plastic is poor for gamma spectroscopy.`,
      trap: R`Speed and resolution are separate virtues: plastic wins on timing, NaI on gamma spectroscopy.` },
    { id: 'trd-r4-09', type: 'mcq', level: 3, exams: G, sub: 'strain gauges',
      q: R`Silicon strain gauges have gauge factors near 100, compared with about 2 for metal foil gauges. The main reason is that in silicon`,
      options: [R`the geometry changes far more under the same strain`, R`the resistivity itself changes strongly with strain (piezoresistance)`, R`thermal expansion adds to the signal`, R`the Poisson ratio is much larger`], answer: 1,
      sol: R`The gauge factor is $1 + 2\nu + (\Delta\rho/\rho)/\varepsilon$. For metals the geometric part $1 + 2\nu\approx1.6$ dominates. In silicon, strain shifts the conduction-band valleys and changes carrier masses and populations, so $\Delta\rho/\rho$ per unit strain is of order 100. The price is a strong temperature dependence and some non-linearity.`,
      trap: R`The Poisson ratio of every solid lies below 0.5, so geometry alone can never give more than about 2.` },
    { id: 'trd-r4-10', type: 'nat', level: 4, exams: G, sub: 'photomultipliers',
      q: R`A photomultiplier with gain $1.0\times10^6$ detects a single photoelectron. Its anode pulse lasts about $5.0$ ns (take it as rectangular) and flows through a $50\ \Omega$ load. The pulse height is ______ mV (to two decimal places).`,
      answer: 1.6, tol: 0.02, calc: () => 1e6 * E / 5e-9 * 50 * 1e3,
      sol: R`Charge $= 10^6\times1.602\times10^{-19} = 1.60\times10^{-13}$ C. Over $5.0$ ns the current is $1.60\times10^{-13}/5.0\times10^{-9} = 32\ \mu$A, and across $50\ \Omega$ that is $1.60$ mV. Single photons are thus easily seen above the noise of a fast amplifier.`,
      trap: R`Multiplying the charge directly by $50\ \Omega$, without dividing by the pulse length, gives a meaningless tiny number.` },
    { id: 'trd-r4-11', type: 'mcq', level: 4, exams: G, sub: 'photodetectors',
      q: R`A photodiode with responsivity $0.50$ A/W has a dark current of $1.0$ nA, and the shot noise of that dark current is its only noise. Its noise-equivalent power is about`,
      options: [R`$3.6\times10^{-14}$ W Hz$^{-1/2}$`, R`$1.8\times10^{-14}$ W Hz$^{-1/2}$`, R`$6.4\times10^{-28}$ W Hz$^{-1/2}$`, R`$2.0\times10^{-9}$ W Hz$^{-1/2}$`], answer: 0,
      sol: R`Shot noise current density $i_n = \sqrt{2eI_d} = \sqrt{2\times1.602\times10^{-19}\times10^{-9}} = 1.79\times10^{-14}$ A Hz$^{-1/2}$. The NEP is the optical power that gives a signal current equal to this: $i_n/\mathcal R = 1.79\times10^{-14}/0.50 = 3.6\times10^{-14}$ W Hz$^{-1/2}$.`,
      trap: R`$1.8\times10^{-14}$ is the noise current in A Hz$^{-1/2}$; it must still be divided by the responsivity.` },
    { id: 'trd-r4-12', type: 'nat', level: 5, exams: G, sub: 'thermal detectors',
      q: R`A thermistor bolometer has thermal conductance $G = 1.0\times10^{-7}$ W/K to its heat sink, resistance $1.0$ M$\Omega$ and temperature coefficient $\alpha = -0.040$ K$^{-1}$, and is biased with a constant $10\ \mu$A. A steady $10$ nW of absorbed radiation changes its voltage by ______ mV in magnitude (ignore electrothermal feedback).`,
      answer: 40, tol: 0.2, calc: () => 10e-6 * 1e6 * 0.04 * (10e-9 / 1e-7) * 1e3,
      sol: R`In steady state the absorbed power flows out through $G$: $\Delta T = P/G = 10^{-8}/10^{-7} = 0.10$ K. Then $\Delta R = \alpha R\,\Delta T = -0.040\times10^6\times0.10 = -4.0$ k$\Omega$, and at constant current $\Delta V = I\Delta R = 10^{-5}\times4.0\times10^3 = 40$ mV. (With a heat capacity $C$ the response time would be $C/G$.)`,
      trap: R`Using the heat capacity instead of the thermal conductance: a steady signal is set by $G$.` },
  ],
  gens: [
    { id: 'trd-r4g1', type: 'nat', level: 2, exams: G, sub: 'position sensors',
      make(r) {
        const N = choose(r, [100, 200, 360, 500, 1000, 1024, 2048, 2500, 5000]), m = choose(r, [1, 2, 4]), ask = choose(r, ['deg', 'rate']), rpm = choose(r, [60, 300, 600, 1200, 3000, 6000]);
        const counts = N * m, val = ask === 'deg' ? 360 / counts : counts * rpm / 60 / 1000;
        return { q: `An incremental encoder has $${N}$ lines per revolution and is decoded ${m === 1 ? 'on one edge per line of one channel (1x)' : m === 2 ? 'on both edges of one channel (2x)' : 'on every edge of both quadrature channels (4x)'}. ${ask === 'deg' ? 'Its angular resolution is ______ degrees (to four decimal places).' : `On a shaft turning at $${rpm}$ rpm, the count rate is ______ kHz (to two decimal places).`}`,
          answer: ask === 'deg' ? round(val, 4) : round(val, 2), tol: ask === 'deg' ? 0.0001 : Math.max(0.01, round(val * 0.002, 2)), N, m, rpm, ask,
          sol: `Counts per revolution $= ${N}\\times${m} = ${counts}$. ${ask === 'deg' ? `Resolution $= 360^\\circ/${counts} = ${round(val, 4)}^\\circ$.` : `Rate $= ${counts}\\times${rpm}/60 = ${round(counts * rpm / 60, 1)}$ counts/s $= ${round(val, 2)}$ kHz.`}`,
          trap: 'Forgetting the decoding factor (1x, 2x or 4x) that multiplies the line count.' };
      },
      verify: (p) => (p.ask === 'deg' ? 360 / (p.N * p.m) : p.N * p.m * p.rpm / 60 / 1000) },
    { id: 'trd-r4g2', type: 'nat', level: 3, exams: G, sub: 'gas detectors',
      make(r) {
        const [gas, W] = choose(r, [['air', 34], ['argon', 26], ['methane', 30]]), Emev = pick(r, 3, 8, 0.1), act = choose(r, [100, 200, 500, 1000, 2000, 5000]);
        const I = act * (Emev * 1e6 / W) * E * 1e12;
        return { q: `An ionisation chamber filled with ${gas} ($W = ${W}$ eV per ion pair) contains an alpha source of $${act}$ Bq whose $${Emev}$ MeV particles stop completely in the gas. With full charge collection and no gas gain, the current is ______ pA (to two decimal places).`,
          answer: round(I, 2), tol: Math.max(0.01, round(I * 0.003, 2)), W, Emev, act,
          sol: `Pairs per alpha $= ${Emev}\\times10^6/${W} = ${round(Emev * 1e6 / W, 0)}$. Current $= ${act}\\times${round(Emev * 1e6 / W, 0)}\\times1.602\\times10^{-19}$ A $= ${round(I, 2)}$ pA.`,
          trap: 'Counting the charge of both members of each pair; the external circuit carries one $e$ per pair.' };
      },
      verify: (p) => p.act * (p.Emev * 1e6 / p.W) * E * 1e12 },
    { id: 'trd-r4g3', type: 'mcq', level: 3, exams: G, sub: 'scintillators',
      make(r) {
        const R1 = pick(r, 5, 12, 0.5), E1 = choose(r, [122, 356, 511, 662]), E2 = choose(r, [1173, 1332, 1460, 2614, 60, 81]);
        const R2 = R1 * Math.sqrt(E1 / E2);
        const o = mcqOptions(r, round(R2, 1), [round(R1 * E1 / E2, 1), round(R1 * Math.sqrt(E2 / E1), 1), R1, round(R1 * (E1 / E2) ** 2, 1)], (v) => `$${v.toFixed(1)}\\%$`);
        return { q: `A scintillation detector has energy resolution (FWHM/E) $${R1}\\%$ at $${E1}$ keV. If photoelectron statistics alone set the resolution, at $${E2}$ keV it is`, ...o,
          sol: `The number of photoelectrons is proportional to $E$, so $\\text{FWHM}/E\\propto1/\\sqrt E$: $${R1}\\%\\times\\sqrt{${E1}/${E2}} = ${round(R2, 1)}\\%$.`,
          trap: 'The width in keV grows as $\\sqrt E$; the fractional width falls as $1/\\sqrt E$.' };
      } },
  ],
};
