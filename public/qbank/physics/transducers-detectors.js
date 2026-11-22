// Transducers and detectors (CSIR NET Part C experimental methods): thermocouples, RTDs and thermistors, strain
// gauges and Wheatstone bridges, piezoelectric, capacitive, Hall and LVDT sensors, first-order response, photodiodes,
// photoconductors, photomultipliers, thermal detectors, radiation detectors (gas counters, GM dead time,
// scintillators, semiconductor detectors and the Fano factor), vacuum gauges, pumps and pump-down time.
// Original questions for CSIR NET (and GATE) practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import more from './transducers-detectors.more.gen.js';
import more2 from './transducers-detectors.more2.gen.js';
import r4 from './transducers-detectors.r4.gen.js';
import r5 from './transducers-detectors.r5.gen.js';

const HC = 1239.84;          // eV nm
const QE = 1.602176634e-19;  // C
const s3 = (x) => +x.toPrecision(3), t6 = (x) => +(Math.abs(x) * 0.006).toPrecision(2);

export default {
  topic: 'transducers-detectors',
  items: [
    // ---------- level 1 ----------
    { id: 'trd-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'thermocouples',
      q: 'A thermocouple produces a voltage because',
      options: ['its resistance changes with temperature', 'a current is passed through it and it heats up', 'two junctions of dissimilar metals are at different temperatures', 'the metal emits electrons when heated'], answer: 2,
      sol: 'The Seebeck effect: a temperature gradient along a conductor drives charge carriers, and two different metals do so by different amounts. Closing the loop with two junctions at different temperatures leaves a net EMF, roughly proportional to the temperature difference.',
      trap: 'A thermocouple needs no excitation current; resistance thermometers do.' },
    { id: 'trd-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'resistance thermometers',
      q: 'The standard platinum resistance thermometer called Pt100 has a resistance of',
      options: ['0 Ω at 0 °C', '100 Ω at 0 °C', '100 Ω at 100 °C', '100 Ω at 25 °C'], answer: 1,
      sol: 'The name gives the resistance at the ice point: 100 Ω at 0 °C, rising by about 0.385 Ω per kelvin (α = 0.00385 K⁻¹), so about 138.5 Ω at 100 °C.',
      trap: 'Thermistors are usually specified at 25 °C; Pt100 at 0 °C.' },
    { id: 'trd-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'strain gauges',
      q: 'The gauge factor $(\\Delta R/R)/\\varepsilon$ of an ordinary metal-foil strain gauge is',
      options: ['about 2', 'about 0.3', 'about 100', 'about 1000'], answer: 0,
      sol: 'For a metal, stretching lengthens and thins the wire, giving $1 + 2\\nu \\approx 1.6$, and the resistivity changes a little, bringing the total to about 2. Semiconductor gauges reach 100 or more through the piezoresistive effect.',
      trap: '0.3 is the Poisson ratio, not the gauge factor.' },
    { id: 'trd-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'photodetectors',
      q: 'Which detector is the natural choice for light at 1550 nm (the fibre-optic window)?',
      options: ['A silicon photodiode', 'A bialkali photomultiplier', 'A cadmium sulphide photoresistor', 'An InGaAs photodiode'], answer: 3,
      sol: 'A 1550 nm photon carries $1239.8/1550 = 0.80$ eV. Silicon ($E_g = 1.12$ eV) stops near 1.1 μm, and bialkali photocathodes and CdS respond to visible light. In$_{0.53}$Ga$_{0.47}$As ($E_g \\approx 0.75$ eV) responds out to about 1.7 μm.',
      trap: 'A detector responds only to photons above its band gap (or work function).' },
    { id: 'trd-005', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'photodetectors',
      q: 'A photodiode has quantum efficiency 0.80 at 800 nm. Its responsivity is ______ A/W (to three decimal places). Use $hc = 1239.8$ eV nm.',
      answer: 0.516, tol: 0.003, unit: 'A/W', calc: () => 0.8 * 800 / 1239.8,
      sol: 'Responsivity $= \\eta e/(h\\nu) = \\eta\\lambda/(hc/e)$. A photon at 800 nm carries $1239.8/800 = 1.550$ eV, so one watt is $1/(1.550e)$ photons per second, each giving 0.8 electrons: $0.8/1.550 = 0.516$ A/W.',
      trap: 'At fixed quantum efficiency the responsivity grows with wavelength, because each watt carries more photons.' },
    { id: 'trd-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'vacuum',
      q: 'A Pirani gauge measures pressure through',
      options: ['the ionisation of gas by electrons', 'the compression of a sample of gas', 'the deflection of a thin diaphragm', 'the heat carried away from a hot wire by the gas'], answer: 3,
      sol: 'A heated wire loses heat by conduction through the gas. In the range about $10^{-3}$ to 10 mbar the gas conductivity depends on pressure, so the wire temperature (its resistance) gives the pressure. The reading depends on the gas species.',
      trap: 'Ionisation gauges work at much lower pressures.' },

    // ---------- level 2 ----------
    { id: 'trd-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'thermocouples',
      q: 'A type K thermocouple (take a constant 41 μV/°C) has its hot junction at 400 °C and its reference junction at 25 °C. The EMF is ______ mV (to one decimal place).',
      answer: 15.4, tol: 0.05, unit: 'mV', calc: () => 0.041 * 375,
      sol: 'The EMF depends on the difference of the junction temperatures: $41\\ \\mu\\text{V/°C}\\times(400 - 25) = 15.375$ mV $\\approx 15.4$ mV.',
      trap: 'Using 400 °C alone assumes the reference is at 0 °C.' },
    { id: 'trd-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'resistance thermometers',
      q: 'A Pt100 sensor ($\\alpha = 0.00385$ K$^{-1}$, linear) is at 80 °C. Its resistance is',
      options: ['108.0 Ω', '130.8 Ω', '138.5 Ω', '100.3 Ω'], answer: 1,
      sol: '$R = R_0(1 + \\alpha T) = 100(1 + 0.00385\\times80) = 100\\times1.308 = 130.8$ Ω.',
      trap: '100.3 Ω forgets to multiply $\\alpha T$ by $R_0$ properly; 138.5 Ω is the value at 100 °C.' },
    { id: 'trd-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'strain gauges',
      q: 'A 120 Ω strain gauge with gauge factor 2.1 is stretched by a strain of 500 microstrain. Its change in resistance is',
      options: ['0.126 Ω', '1.26 Ω', '0.0126 Ω', '0.252 Ω'], answer: 0,
      sol: '$\\Delta R = R\\cdot GF\\cdot\\varepsilon = 120\\times2.1\\times500\\times10^{-6} = 0.126$ Ω, about 0.1% of the gauge resistance: why a bridge is needed to see it.',
      trap: 'One microstrain is $10^{-6}$; 500 microstrain is $5\\times10^{-4}$.' },
    { id: 'trd-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'bridges',
      q: 'One arm of a Wheatstone bridge (all four arms equal, supply 10 V) is a strain gauge of gauge factor 2 under a strain of $10^{-3}$. The bridge output is about',
      options: ['10 mV', '20 mV', '5 mV', '2.5 mV'], answer: 2,
      sol: 'For a small fractional change $x = \\Delta R/R$ in one arm, $V_{out} \\approx V_s x/4$. Here $x = GF\\,\\varepsilon = 2\\times10^{-3}$, so $V_{out} = 10\\times2\\times10^{-3}/4 = 5$ mV.',
      trap: 'A quarter bridge gives a quarter of $V_sx$; two active arms give half, four give all of it.' },
    { id: 'trd-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'photomultipliers',
      q: 'A photomultiplier has 10 dynodes, each with secondary emission ratio 4. Its gain is about',
      options: ['40', '$1.0\\times10^{4}$', '$1.0\\times10^{10}$', '$1.0\\times10^{6}$'], answer: 3,
      sol: 'Each dynode multiplies the electron number by $\\delta$, so the gain is $\\delta^n = 4^{10} = 1.05\\times10^6$.',
      trap: 'The gains multiply, not add: $4\\times10 = 40$ is wrong.' },
    { id: 'trd-012', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'semiconductor detectors',
      q: 'Which statements about high-purity germanium (HPGe) gamma-ray detectors are correct?',
      options: ['They are operated cooled, near liquid-nitrogen temperature', 'Their energy resolution is far better than that of NaI(Tl) scintillators', 'An electron-hole pair costs about 3 eV of deposited energy', 'They are scintillators read out by photomultipliers'], answer: [0, 1, 2],
      sol: 'Germanium has a small gap (0.67 eV), so it must be cooled to keep the leakage current low. About 2.96 eV per pair means hundreds of thousands of carriers per MeV and small statistical spread: about 0.2% FWHM at 1.33 MeV against about 6 to 7% for NaI(Tl). The charge is collected directly; no light is involved.',
      trap: 'Semiconductor detectors collect charge directly; scintillators convert to light first.' },
    { id: 'trd-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'gas detectors',
      q: 'The pulse height from a Geiger-Müller counter',
      options: ['is proportional to the energy deposited', 'is the same for every ionising event, whatever its energy', 'is proportional to the square root of the energy', 'is zero for electrons'], answer: 1,
      sol: 'In the Geiger region one primary ion pair triggers an avalanche that spreads along the whole anode wire until the space charge stops it. Every discharge is the same size, so a GM counter counts events but cannot measure energy.',
      trap: 'Ionisation chambers and proportional counters do give energy information.' },
    { id: 'trd-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'resistance thermometers',
      q: 'Compared with a platinum resistance thermometer, an NTC thermistor',
      options: ['is more linear and works to higher temperatures', 'has a resistance that rises with temperature', 'has a positive coefficient about ten times larger', 'is far more sensitive near room temperature but strongly non-linear'], answer: 3,
      sol: 'An NTC thermistor is a semiconductor: $R \\propto e^{B/T}$, so $R$ falls steeply as $T$ rises (about $-4\\%$ per kelvin near room temperature, ten times Pt). The exponential makes it non-linear and its range is limited, typically to below about 150 °C.',
      trap: 'NTC means negative temperature coefficient.' },
    { id: 'trd-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'vacuum',
      q: 'An oil diffusion pump is always backed by a rotary pump because',
      options: ['its vapour jet works only when the outlet pressure is already low (about 0.1 mbar or less)', 'it cannot pump light gases', 'it needs the rotary pump to cool its oil', 'it pumps only when rotating'], answer: 0,
      sol: 'The jet of oil vapour drives gas molecules towards the outlet by momentum transfer. Against atmospheric pressure the jet collapses; it needs a forevacuum below its critical backing pressure, supplied by a rotary (or scroll) pump.',
      trap: 'Diffusion pumps have no moving parts at all.' },
    { id: 'trd-016', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'sensor response',
      q: 'A thermometer with time constant 4.0 s, initially at 20 °C, is plunged into a bath at 80 °C. Its reading after 6.0 s is ______ °C (to one decimal place).',
      answer: 66.6, tol: 0.1, unit: '°C', calc: () => 80 - 60 * Math.exp(-1.5),
      sol: 'A first-order sensor obeys $\\tau\\,dT/dt = T_{bath} - T$, so $T = T_{bath} - (T_{bath} - T_0)e^{-t/\\tau} = 80 - 60e^{-1.5} = 80 - 13.4 = 66.6$ °C.',
      trap: 'After one time constant the sensor has covered 63%, not 50% or 100%, of the step.' },

    // ---------- level 3 ----------
    { id: 'trd-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'thermocouples',
      q: 'Tables for a type K thermocouple (reference 0 °C) give 12.209 mV at 300 °C and 1.000 mV at 25 °C. If the reference junction sits at 25 °C and the hot junction at 300 °C, the measured EMF is ______ mV (to three decimal places).',
      answer: 11.209, tol: 0.002, unit: 'mV', calc: () => 12.209 - 1.0,
      sol: 'Law of intermediate temperatures: $E(300, 0) = E(300, 25) + E(25, 0)$, so $E(300, 25) = 12.209 - 1.000 = 11.209$ mV. Cold-junction compensation adds back the 1.000 mV before the table is used.',
      trap: 'Subtract EMFs, not temperatures, when the EMF-temperature curve is not linear.' },
    { id: 'trd-018', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'resistance thermometers',
      q: 'A Pt100 is read with four wires (two carry the current, two sense the voltage) instead of two. The main gain is that',
      options: ['the self-heating disappears', 'the sensor becomes linear', 'the resistance of the connecting leads no longer adds to the reading', 'the sensitivity doubles'], answer: 2,
      sol: 'With two wires the meter sees $R_{sensor} + 2R_{lead}$; 1 Ω of leads is a 2.6 °C error. With four, the sensing pair carries almost no current, so there is no drop along it and the voltage is measured right at the sensor.',
      trap: 'Self-heating depends on the current, which is the same in both arrangements.' },
    { id: 'trd-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'resistance thermometers',
      q: 'An NTC thermistor follows $R = R_{25}\\exp[B(1/T - 1/T_{25})]$ with $R_{25} = 10.0$ kΩ at 298.15 K and $B = 3950$ K. At 50 °C its resistance is ______ kΩ (to two decimal places).',
      answer: 3.59, tol: 0.01, unit: 'kΩ', calc: () => 10 * Math.exp(3950 * (1 / 323.15 - 1 / 298.15)),
      sol: '$1/323.15 - 1/298.15 = 0.0030945 - 0.0033540 = -2.595\\times10^{-4}$ K$^{-1}$. Times $B$: $-1.025$. $R = 10.0\\,e^{-1.025} = 3.59$ kΩ.',
      trap: 'Use kelvin in the exponent.' },
    { id: 'trd-020', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'photodetectors',
      q: 'The responsivity of a silicon photodiode rises with wavelength through the visible, peaks near 900 nm, then falls sharply beyond about 1100 nm. The sharp fall is due to',
      options: ['photons below the band gap (1.12 eV) no longer creating electron-hole pairs', 'absorption in the glass window', 'the photons becoming too energetic', 'the junction capacitance'], answer: 0,
      sol: 'The rise follows $R = \\eta\\lambda/1239.8$ (more photons per watt). The cut-off is the band gap: $\\lambda_c = 1239.8/1.12 = 1107$ nm. Beyond it silicon is transparent.',
      trap: 'The fall at short wavelengths (UV) comes from absorption near the surface, a different effect.' },
    { id: 'trd-021', type: 'nat', level: 3, exams: ['net'], sub: 'semiconductor detectors',
      q: 'Germanium needs 2.96 eV per electron-hole pair and has a Fano factor of 0.12. The statistical limit to the energy resolution (FWHM) for 662 keV gamma rays fully absorbed is ______ keV (to two decimal places).',
      answer: 1.14, tol: 0.02, unit: 'keV', calc: () => 2.355 * Math.sqrt(0.12 * 662000 * 2.96) / 1000,
      sol: 'Number of pairs $N = E/w = 662000/2.96 = 2.24\\times10^5$. Variance $FN$, so $\\sigma_E = w\\sqrt{FN} = \\sqrt{FEw} = \\sqrt{0.12\\times662000\\times2.96} = 485$ eV. FWHM $= 2.355\\sigma = 1.14$ keV. Electronic noise adds to this in quadrature.',
      trap: 'The Fano factor makes the spread smaller than Poisson ($F < 1$); FWHM is 2.355 σ.' },
    { id: 'trd-022', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'dead time',
      q: 'A GM counter with a dead time of 200 μs (non-paralysable) records 500 counts/s. The true count rate is about',
      options: ['450 s$^{-1}$', '500 s$^{-1}$', '556 s$^{-1}$', '600 s$^{-1}$'], answer: 2,
      sol: 'The counter is dead for a fraction $m\\tau = 500\\times2\\times10^{-4} = 0.10$ of the time. True rate $n = m/(1 - m\\tau) = 500/0.90 = 556$ s$^{-1}$.',
      trap: 'Dead time loses counts, so the true rate is higher than the observed one.' },
    { id: 'trd-023', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'gas detectors',
      q: 'As the voltage on a gas-filled detector is raised, the collected charge per event passes through several regions. In which region is the charge larger than the primary ionisation yet still proportional to it?',
      options: ['Recombination region', 'Ionisation-chamber region', 'Geiger-Müller region', 'Proportional region'], answer: 3,
      sol: 'In the proportional region electrons gain enough energy near the anode to ionise further, giving a gas gain of $10^2$ to $10^5$ that is the same for every event, so the pulse is still proportional to the deposited energy. In the ionisation region the gain is 1; in the GM region all pulses are equal.',
      trap: 'The ionisation chamber is proportional too, but without gain.' },
    { id: 'trd-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Hall sensors',
      q: 'A Hall probe is a semiconductor slab 0.10 mm thick with $n = 1.0\\times10^{21}$ m$^{-3}$ carrying 1.0 mA. In a field of 0.50 T perpendicular to the slab, the Hall voltage is about',
      options: ['3.1 μV', '31 μV', '0.31 mV', '3.1 mV'], answer: 1,
      sol: '$V_H = IB/(net) = (10^{-3}\\times0.50)/(10^{21}\\times1.60\\times10^{-19}\\times10^{-4}) = 5\\times10^{-4}/16.0 = 3.1\\times10^{-5}$ V $= 31$ μV.',
      trap: 'Thin, lightly doped material gives the largest Hall voltage: that is why probes use semiconductors, not metals.' },
    { id: 'trd-025', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'photodetectors',
      q: 'A photodiode can be used with reverse bias (photoconductive mode) or at zero bias (photovoltaic mode). Compared with zero bias, reverse bias gives',
      options: ['a faster response, because the wider depletion layer lowers the capacitance', 'a larger dark current', 'a photocurrent proportional to the light power over a wide range', 'the lowest noise for very weak, slowly varying light'], answer: [0, 1, 2],
      sol: 'Reverse bias widens the depletion region: lower capacitance (faster) and quick carrier collection, with a linear photocurrent. But the bias drives a dark (leakage) current whose shot noise matters for faint light; at zero bias there is no dark current, so photovoltaic mode is preferred for weak, slow signals.',
      trap: 'Speed and linearity favour reverse bias; ultimate low-light noise favours zero bias.' },
    { id: 'trd-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'displacement sensors',
      q: 'Which statement about a linear variable differential transformer (LVDT) is correct?',
      options: ['It works with a DC excitation', 'Its output amplitude grows with core displacement, and the phase relative to the excitation flips by 180° as the core passes the centre', 'Its output is largest with the core at the centre', 'It measures velocity rather than displacement'], answer: 1,
      sol: 'Two secondaries wound in opposition pick up equal voltages with the core centred, so the output is zero. Moving the core increases one and decreases the other: amplitude ∝ displacement, sign shown by the phase. A phase-sensitive detector (like a lock-in) turns this into a signed DC voltage.',
      trap: 'An amplitude-only meter cannot tell left from right; the phase carries the direction.' },
    { id: 'trd-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'vacuum',
      q: 'A 50 L chamber is pumped with a constant effective speed of 5.0 L/s, ignoring outgassing. The time to go from 1000 mbar to 0.10 mbar is ______ s (to the nearest whole number).',
      answer: 92, tol: 1, unit: 's', calc: () => 10 * Math.log(1e4),
      sol: '$V\\,dp/dt = -Sp$ gives $p = p_0e^{-St/V}$, so $t = (V/S)\\ln(p_0/p) = 10\\ \\text{s}\\times\\ln(10^4) = 10\\times9.21 = 92$ s.',
      trap: 'Each factor of 10 in pressure costs the same time, $(V/S)\\ln10$.' },
    { id: 'trd-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'vacuum',
      q: 'Which gauge would you use to measure a pressure of $10^{-8}$ mbar?',
      options: ['A Pirani gauge', 'A Bourdon gauge', 'A Bayard-Alpert hot-cathode ionisation gauge', 'A mercury U-tube manometer'], answer: 2,
      sol: 'At $10^{-8}$ mbar only ionisation gauges have enough sensitivity: electrons from a hot filament ionise the residual gas and the ion current is proportional to the gas density. The Bayard-Alpert design (thin collector inside the grid) reaches about $10^{-10}$ mbar. Pirani gauges stop near $10^{-3}$ mbar.',
      trap: 'Mechanical and thermal-conductivity gauges lose all sensitivity long before ultrahigh vacuum.' },

    // ---------- level 4 ----------
    { id: 'trd-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'piezoelectric sensors',
      q: 'A quartz force sensor ($d = 2.3$ pC/N) is connected by a cable; the sensor plus cable capacitance is 100 pF. A sudden force of 50 N produces a voltage of ______ V (to two decimal places).',
      answer: 1.15, tol: 0.01, unit: 'V', calc: () => 2.3e-12 * 50 / 100e-12,
      sol: 'Charge $q = dF = 2.3\\times50 = 115$ pC. $V = q/C = 115\\ \\text{pC}/100\\ \\text{pF} = 1.15$ V. A longer cable (more capacitance) lowers the voltage, which is why charge amplifiers are used.',
      trap: 'The voltage depends on the total capacitance, cable included.' },
    { id: 'trd-030', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'piezoelectric sensors',
      q: 'A piezoelectric accelerometer cannot measure a constant (DC) acceleration because',
      options: ['quartz loses its piezoelectricity under a steady stress', 'the charge leaks away through the finite insulation and input resistance with time constant $RC$', 'a constant acceleration produces no stress', 'piezoelectric crystals respond only above their resonance'], answer: 1,
      sol: 'A steady force produces a fixed charge, but that charge drains through the leakage and amplifier input resistance: the signal decays as $e^{-t/RC}$. The sensor acts as a high-pass filter with corner $1/(2\\pi RC)$; it is used below its mechanical resonance and above this corner.',
      trap: 'The crystal keeps working; the electronics cannot hold the charge.' },
    { id: 'trd-031', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'bridges',
      q: 'Two identical gauges (gauge factor 2.0) are bonded on the top and bottom faces of a bending beam and wired in adjacent arms of a bridge with 5.0 V supply. The surface strain is $\\pm400$ microstrain. The output is about',
      options: ['1.0 mV', '2.0 mV', '4.0 mV', '0.5 mV'], answer: 1,
      sol: 'In adjacent arms, opposite strains $+\\varepsilon$ and $-\\varepsilon$ add: $V_{out} = V_s\\,GF\\,\\varepsilon/2 = 5.0\\times2.0\\times4\\times10^{-4}/2 = 2.0$ mV. A temperature change affects both gauges equally and cancels, and the half bridge is linear.',
      trap: 'If the two gauges had the same strain in adjacent arms the outputs would cancel.' },
    { id: 'trd-032', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'strain gauges',
      q: 'For a wire of Poisson ratio 0.30 whose resistivity does not change with strain, the gauge factor would be',
      options: ['2.0', '1.3', '1.6', '0.4'], answer: 2,
      sol: '$R = \\rho L/A$, so $\\Delta R/R = \\Delta\\rho/\\rho + \\varepsilon + 2\\nu\\varepsilon$ (the area shrinks by $2\\nu\\varepsilon$). With $\\Delta\\rho = 0$: $GF = 1 + 2\\nu = 1.6$. The rest of a metal gauge\'s factor (to about 2) comes from the resistivity change.',
      trap: 'The cross-section shrinks in two directions, hence $2\\nu$.' },
    { id: 'trd-033', type: 'nat', level: 4, exams: ['net'], sub: 'scintillators',
      q: 'A NaI(Tl) crystal yields 38 photons per keV. For a 662 keV gamma ray, 50% of the light reaches a photocathode of quantum efficiency 25%. The photoelectron statistics alone limit the resolution (FWHM) to ______ % (to one decimal place).',
      answer: 4.2, tol: 0.05, unit: '%', calc: () => 235.5 / Math.sqrt(38 * 662 * 0.5 * 0.25),
      sol: 'Photoelectrons $N = 38\\times662\\times0.5\\times0.25 = 3145$. Poisson: $\\sigma/N = 1/\\sqrt N = 1.78\\%$, FWHM $= 2.355\\times1.78\\% = 4.2\\%$. Real crystals give about 6 to 7% (non-proportional light yield adds to this).',
      trap: 'The statistics are set by the smallest number in the chain: the photoelectrons, not the photons.' },
    { id: 'trd-034', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'photodetectors',
      q: 'A photoconductor 1.0 mm long has carrier mobility 0.10 m$^2$ V$^{-1}$ s$^{-1}$, carrier lifetime 1.0 ms and 10 V across it. Its photoconductive gain is',
      options: ['1', '$10^{3}$', '$10^{6}$', '$10^{-3}$'], answer: 1,
      sol: 'Transit time $t_{tr} = L/(\\mu E) = L^2/(\\mu V) = 10^{-6}/(0.10\\times10) = 1.0$ μs. Gain $= \\tau/t_{tr} = 10^{-3}/10^{-6} = 10^3$: each absorbed photon lets about a thousand electrons through before its carrier pair recombines.',
      trap: 'Gain above 1 is possible because the contacts replace every carrier that leaves.' },
    { id: 'trd-035', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'thermal detectors',
      q: 'Comparing thermal detectors (bolometers, thermopiles, pyroelectrics) with photon detectors (photodiodes), which statements are true?',
      options: ['Thermal detectors respond to absorbed power almost independently of wavelength', 'Thermal detectors are generally slower', 'Photon detectors have a long-wavelength cut-off', 'A thermal detector\'s signal is proportional to the number of photons per second, whatever their energy'], answer: [0, 1, 2],
      sol: 'A thermal detector measures the temperature rise of an absorber: power in, whatever the wavelength, with a thermal time constant (ms to s). A photon detector counts photons above its gap: cut-off wavelength, response $\\propto$ photon rate, fast.',
      trap: 'Photon detectors count photons; thermal detectors weigh energy.' },
    { id: 'trd-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'vacuum',
      q: 'For air at room temperature the mean free path is about $\\lambda\\,p \\approx 6.6\\times10^{-3}$ Pa m. To make it 1 m (molecular flow in a typical chamber) the pressure must be below about',
      options: ['$6.6\\times10^{-3}$ mbar', '$6.6\\times10^{-5}$ Pa', '$6.6\\times10^{-5}$ mbar', '0.66 Pa'], answer: 2,
      sol: '$p = 6.6\\times10^{-3}\\ \\text{Pa m}/1\\ \\text{m} = 6.6\\times10^{-3}$ Pa. Since 1 mbar = 100 Pa, that is $6.6\\times10^{-5}$ mbar.',
      trap: 'Check the units: Pa and mbar differ by a factor of 100.' },

    // ---------- level 5 ----------
    { id: 'trd-037', type: 'nat', level: 5, exams: ['net'], sub: 'dead time',
      q: 'For a paralysable detector with dead time 100 μs, the observed rate $m = ne^{-n\\tau}$ cannot exceed a maximum, however strong the source. That maximum is ______ counts/s (to the nearest whole number).',
      answer: 3679, tol: 2, unit: 's⁻¹', calc: () => 1 / (Math.E * 1e-4),
      sol: '$dm/dn = e^{-n\\tau}(1 - n\\tau) = 0$ at $n = 1/\\tau$, giving $m_{max} = 1/(e\\tau) = 10^4/2.718 = 3679$ s$^{-1}$. Beyond that, a stronger source gives a lower reading, so each observed rate corresponds to two true rates.',
      trap: 'A non-paralysable counter saturates at $1/\\tau$ instead, and never turns over.' },
    { id: 'trd-038', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'resistance thermometers',
      q: 'A Pt100 at 0 °C carries 1.0 mA; its dissipation constant (power per kelvin of self-heating) is 2.0 mW/K. The self-heating error is',
      options: ['0.5 K', '0.005 K', '0.05 K', '5 K'], answer: 2,
      sol: '$P = I^2R = (10^{-3})^2\\times100 = 0.10$ mW. Temperature rise $= P/\\delta = 0.10/2.0 = 0.05$ K. Halving the current cuts the error by four, but also halves the signal.',
      trap: 'Keep mW with mW: mixing W and mW gives answers a thousand times off.' },
    { id: 'trd-039', type: 'nat', level: 5, exams: ['net'], sub: 'photodetectors',
      q: 'An unbiased photodiode at 300 K has saturation (dark) current $I_0 = 1.0$ nA. Under illumination giving a photocurrent of 10 μA, its open-circuit voltage is ______ V (to three decimal places). Use $k_BT/e = 0.02585$ V.',
      answer: 0.238, tol: 0.002, unit: 'V', calc: () => 0.02585 * Math.log(1 + 1e-5 / 1e-9),
      sol: 'With no current flowing out, the photocurrent is balanced by the diode forward current: $I_0(e^{eV/k_BT} - 1) = I_{ph}$. So $V_{oc} = (k_BT/e)\\ln(1 + I_{ph}/I_0) = 0.02585\\ln(10001) = 0.02585\\times9.210 = 0.238$ V.',
      trap: 'The open-circuit voltage grows only logarithmically with light; the short-circuit current is the linear measure.' },
    { id: 'trd-040', type: 'mcq', level: 5, exams: ['net'], sub: 'bridges',
      q: 'The exact output of a quarter bridge is $V_s\\,x/(4 + 2x)$ for a fractional change $x$ in one arm. A semiconductor gauge with gauge factor 100 under 100 microstrain gives an output that falls short of the linear estimate $V_sx/4$ by about',
      options: ['0.5%', '1%', '0.1%', '5%'], answer: 0,
      sol: '$x = 100\\times10^{-4} = 0.01$. The ratio exact/linear $= 4/(4 + 2x) = 1/(1 + x/2) \\approx 1 - x/2$, a shortfall of $x/2 = 0.5\\%$. High-gauge-factor sensors make the bridge non-linearity noticeable; a half or full bridge removes it.',
      trap: 'The non-linearity is set by $\\Delta R/R$, not by the strain alone.' },
    ...more2,
    ...r4.items,
    ...r5.items,
  ],
  gens: [
    { id: 'trd-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'thermocouples',
      make(r) {
        const [name, S] = choose(r, [['K', 41], ['J', 52], ['T', 43], ['E', 68], ['N', 39]]);
        const Tr = choose(r, [0, 20, 25, 30]), mode = choose(r, ['emf', 'temp']);
        const Th = int(r, 60, 700), emf = S * (Th - Tr) / 1000;
        const E = round(emf, 3);
        return { q: mode === 'emf'
          ? `A type ${name} thermocouple (take a constant Seebeck coefficient of ${S} μV/°C) has its measuring junction at ${Th} °C and its reference junction at ${Tr} °C. The EMF is ______ mV (to two decimal places).`
          : `A type ${name} thermocouple (constant ${S} μV/°C) reads ${E} mV with its reference junction at ${Tr} °C. The measuring junction is at ______ °C (to the nearest degree).`,
          answer: mode === 'emf' ? round(emf, 2) : Math.round(Tr + E * 1000 / S), tol: mode === 'emf' ? 0.01 : 1, unit: mode === 'emf' ? 'mV' : '°C', S, Tr, Th, E, mode,
          sol: mode === 'emf' ? `$E = S(T_h - T_r) = ${S}\\ \\mu\\text{V/°C}\\times(${Th} - ${Tr}) = ${round(emf * 1000, 1)}\\ \\mu$V $= ${round(emf, 3)}$ mV.` : `$T_h = T_r + E/S = ${Tr} + ${E * 1000}/${S} = ${round(Tr + E * 1000 / S, 2)}$ °C.`,
          trap: 'The EMF measures the difference between the junctions, not the hot temperature itself.' };
      },
      verify: (p) => (p.mode === 'emf' ? p.S * (p.Th - p.Tr) / 1000 : Math.round(p.Tr + p.E * 1000 / p.S)) },
    { id: 'trd-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'resistance thermometers',
      make(r) {
        const R0 = choose(r, [100, 1000]), mode = choose(r, ['R', 'T']), T = int(r, -50, 400);
        const R = R0 * (1 + 0.00385 * T), Rr = round(R, 2);
        return { q: mode === 'R'
          ? `A Pt${R0} sensor ($R_0 = ${R0}$ Ω at 0 °C, $\\alpha = 0.00385$ K$^{-1}$, treat as linear) is at ${T} °C. Its resistance is ______ Ω (to one decimal place).`
          : `A Pt${R0} sensor ($R_0 = ${R0}$ Ω at 0 °C, $\\alpha = 0.00385$ K$^{-1}$, linear) reads ${Rr} Ω. Its temperature is ______ °C (to one decimal place).`,
          answer: mode === 'R' ? round(R, 1) : round((Rr / R0 - 1) / 0.00385, 1), tol: mode === 'R' ? (R0 === 100 ? 0.1 : 0.5) : 0.15, unit: mode === 'R' ? 'Ω' : '°C', R0, T, Rr, mode,
          sol: mode === 'R' ? `$R = R_0(1 + \\alpha T) = ${R0}(1 + 0.00385\\times${T}) = ${round(R, 3)}$ Ω.` : `$T = (R/R_0 - 1)/\\alpha = (${Rr}/${R0} - 1)/0.00385 = ${round((Rr / R0 - 1) / 0.00385, 2)}$ °C.`,
          trap: 'Below 0 °C the resistance drops below $R_0$; the formula still works (approximately).' };
      },
      verify: (p) => (p.mode === 'R' ? p.R0 * (1 + 0.00385 * p.T) : (p.Rr / p.R0 - 1) / 0.00385) },
    { id: 'trd-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'resistance thermometers',
      make(r) {
        const R25 = choose(r, [2.2, 5, 10, 47, 100]), B = choose(r, [3380, 3435, 3950, 4250, 3500]), mode = choose(r, ['R', 'T', 'alpha']);
        const tC = int(r, -20, 120), T = tC + 273.15, R = R25 * Math.exp(B * (1 / T - 1 / 298.15)), Rr = +R.toPrecision(4);
        let ans, q, sol, unit;
        if (mode === 'R') { ans = R; unit = 'kΩ'; q = `its resistance at ${tC} °C is ______ kΩ (to three significant figures)`; sol = `$R = ${R25}\\exp[${B}(1/${round(T, 2)} - 1/298.15)] = ${R25}\\times e^{${round(B * (1 / T - 1 / 298.15), 4)}} = ${+R.toPrecision(4)}$ kΩ.`; }
        else if (mode === 'T') { ans = 1 / (1 / 298.15 + Math.log(Rr / R25) / B) - 273.15; unit = '°C'; q = `when it reads ${Rr} kΩ its temperature is ______ °C (to one decimal place)`; sol = `$1/T = 1/298.15 + \\ln(R/R_{25})/B = 0.0033540 + \\ln(${Rr}/${R25})/${B}$, so $T = ${round(ans + 273.15, 2)}$ K $= ${round(ans, 2)}$ °C.`; }
        else { ans = -B / T ** 2 * 100; unit = '%/K'; q = `its temperature coefficient $\\alpha = (1/R)\\,dR/dT$ at ${tC} °C is ______ %/K (to two decimal places)`; sol = `$\\alpha = -B/T^2 = -${B}/${round(T, 2)}^2 = ${round(-B / T ** 2, 5)}$ K$^{-1}$ $= ${round(ans, 3)}$ %/K.`; }
        return { q: `An NTC thermistor follows $R = R_{25}\\exp[B(1/T - 1/298.15\\,\\text{K})]$ with $R_{25} = ${R25}$ kΩ and $B = ${B}$ K: ${q}.`,
          answer: mode === 'R' ? s3(ans) : round(ans, mode === 'T' ? 1 : 2), tol: mode === 'R' ? t6(ans) : mode === 'T' ? 0.15 : 0.02, unit, R25, B, T, Rr, mode, sol,
          trap: 'Temperatures in the exponent must be in kelvin.' };
      },
      verify: (p) => (p.mode === 'R' ? p.R25 * Math.exp(p.B * (1 / p.T - 1 / 298.15)) : p.mode === 'T' ? 1 / (1 / 298.15 + Math.log(p.Rr / p.R25) / p.B) - 273.15 : -p.B / p.T ** 2 * 100) },
    { id: 'trd-g04', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'bridges',
      make(r) {
        const [kind, k, desc] = choose(r, [['quarter', 0.25, 'one active gauge'], ['half', 0.5, 'two active gauges with opposite strains in adjacent arms'], ['full', 1, 'four active gauges, two in tension and two in compression']]);
        const Vs = choose(r, [2, 3, 5, 10, 12]), GF = choose(r, [2, 2.1, 2.05]), eps = choose(r, [100, 200, 250, 400, 500, 800, 1000]);
        const V = Vs * GF * eps * 1e-6 * k * 1000;
        const show = (v) => `${+v.toPrecision(3)} mV`;
        const o = mcqOptions(r, V, [V * 2, V / 2, V * 4, V / 4], show);
        return { q: `A Wheatstone bridge with ${Vs} V supply uses ${desc} (gauge factor ${GF}, strain magnitude ${eps} microstrain), the remaining arms being fixed equal resistors. The output voltage is about`, options: o.options, answer: o.answer,
          sol: `A ${kind} bridge gives $V_{out} \\approx ${k === 1 ? '' : k === 0.5 ? '\\tfrac12' : '\\tfrac14'}V_s\\,GF\\,\\varepsilon = ${k}\\times${Vs}\\times${GF}\\times${eps}\\times10^{-6}$ V $=$ ${show(V)}.`,
          trap: 'Count the active arms: each adds a quarter of $V_s\\,GF\\,\\varepsilon$ when the strains are arranged to add.' };
      } },
    { id: 'trd-g05', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'photodetectors',
      make(r) {
        const lam = choose(r, [405, 450, 532, 633, 780, 850, 905, 980, 1064]), eta = pick(r, 0.3, 0.95, 0.05), P = choose(r, [0.1, 0.5, 1, 2, 5, 10, 50, 100]);
        const mode = choose(r, ['I', 'rate', 'R']);
        const Rsp = eta * lam / HC, I = Rsp * P, rate = P * 1e-6 / (HC / lam * QE);
        const ans = mode === 'I' ? I : mode === 'rate' ? rate / 1e12 : Rsp;
        return { q: mode === 'I' ? `Light of ${lam} nm and power ${P} μW falls on a photodiode of quantum efficiency ${eta}. The photocurrent is ______ μA (to three significant figures). Use $hc = 1239.84$ eV nm.`
          : mode === 'rate' ? `A beam of ${lam} nm light carries ${P} μW. It delivers $k\\times10^{12}$ photons per second; $k$ is ______ (to three significant figures). Use $hc = 1239.84$ eV nm, $e = 1.602\\times10^{-19}$ C.`
          : `The responsivity of a photodiode of quantum efficiency ${eta} at ${lam} nm is ______ A/W (to three significant figures). Use $hc = 1239.84$ eV nm.`,
          answer: s3(ans), tol: t6(ans), unit: mode === 'I' ? 'μA' : mode === 'R' ? 'A/W' : undefined, lam, eta, P, mode,
          sol: `Photon energy $= 1239.84/${lam} = ${round(HC / lam, 4)}$ eV. ${mode === 'rate' ? `Photons per second $= ${P}\\times10^{-6}/(${round(HC / lam, 4)}\\times1.602\\times10^{-19}) = ${+rate.toPrecision(4)}$.` : `Responsivity $= \\eta/(E_{ph}/e) = ${eta}/${round(HC / lam, 4)} = ${+Rsp.toPrecision(4)}$ A/W${mode === 'I' ? `; photocurrent $= ${+Rsp.toPrecision(4)}\\times${P} = ${+I.toPrecision(4)}$ μA` : ''}.`}`,
          trap: 'Responsivity in A/W is the quantum efficiency divided by the photon energy in eV.' };
      },
      verify: (p) => { const R = p.eta * p.lam / HC; return p.mode === 'I' ? R * p.P : p.mode === 'R' ? R : p.P * 1e-6 / (HC / p.lam * QE) / 1e12; } },
    { id: 'trd-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'photomultipliers',
      make(r) {
        const d = choose(r, [3, 3.5, 4, 4.5, 5, 6]), n = int(r, 8, 14), mode = choose(r, ['gain', 'charge', 'delta']);
        const G = d ** n;
        let ans, q, sol;
        if (mode === 'gain') { ans = Math.log10(G); q = `A photomultiplier has ${n} dynodes, each with secondary emission ratio ${d}. Its gain is $10^x$; $x$ is ______ (to two decimal places).`; sol = `$G = \\delta^n = ${d}^{${n}}$, so $x = ${n}\\log_{10}${d} = ${round(ans, 3)}$.`; }
        else if (mode === 'charge') { ans = G * QE * 1e12; q = `A photomultiplier has ${n} dynodes with secondary emission ratio ${d}. One photoelectron produces an anode charge of ______ pC (to three significant figures).`; sol = `$G = ${d}^{${n}} = ${+G.toPrecision(4)}$; charge $= Ge = ${+G.toPrecision(4)}\\times1.602\\times10^{-19}$ C $= ${+(G * QE * 1e12).toPrecision(4)}$ pC.`; }
        else { ans = G ** (1 / n); q = `A photomultiplier with ${n} identical dynodes has a gain of ${+G.toPrecision(4)}. The secondary emission ratio per dynode is ______ (to two decimal places).`; sol = `$\\delta = G^{1/n} = (${+G.toPrecision(4)})^{1/${n}} = ${round(ans, 3)}$.`; }
        return { q, answer: mode === 'charge' ? s3(ans) : round(ans, 2), tol: mode === 'charge' ? t6(ans) : 0.01, unit: mode === 'charge' ? 'pC' : undefined, d, n, mode, sol,
          trap: 'Gains of successive stages multiply.' };
      },
      verify: (p) => { const G = p.d ** p.n; return p.mode === 'gain' ? Math.log10(G) : p.mode === 'charge' ? G * QE * 1e12 : (+G.toPrecision(4)) ** (1 / p.n); } },
    { id: 'trd-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'dead time',
      make(r) {
        const tau = choose(r, [10, 50, 100, 150, 200, 300]), m = int(r, 2, 40) * 50, mode = choose(r, ['true', 'obs', 'loss']);
        const x = m * tau * 1e-6, n = m / (1 - x), nt = int(r, 2, 30) * 100, mo = nt / (1 + nt * tau * 1e-6);
        const ok = x < 0.6;
        const mm = ok ? m : 200;
        const nn = mm / (1 - mm * tau * 1e-6);
        const ans = mode === 'true' ? nn : mode === 'obs' ? mo : (1 - mm / nn) * 100;
        return { q: mode === 'true' ? `A counter with a non-paralysable dead time of ${tau} μs records ${mm} counts/s. The true rate is ______ counts/s (to three significant figures).`
          : mode === 'obs' ? `A source would give ${nt} counts/s in an ideal detector. A counter with a non-paralysable dead time of ${tau} μs records ______ counts/s (to three significant figures).`
          : `A counter with a non-paralysable dead time of ${tau} μs records ${mm} counts/s. The percentage of true events it misses is ______ % (to three significant figures).`,
          answer: s3(ans), tol: t6(ans), unit: mode === 'loss' ? '%' : 's⁻¹', tau, mm, nt, mode,
          sol: mode === 'obs' ? `$m = n/(1 + n\\tau) = ${nt}/(1 + ${nt}\\times${tau}\\times10^{-6}) = ${+mo.toPrecision(4)}$ s$^{-1}$.` : `Dead fraction $m\\tau = ${mm}\\times${tau}\\times10^{-6} = ${round(mm * tau * 1e-6, 4)}$. $n = m/(1 - m\\tau) = ${+nn.toPrecision(4)}$ s$^{-1}$.${mode === 'loss' ? ` Missed fraction $= 1 - m/n = m\\tau = ${round(mm * tau * 1e-4, 3)}\\%$.` : ''}`,
          trap: 'The fraction of events lost equals the fraction of time the counter is dead, $m\\tau$.' };
      },
      verify: (p) => { const t = p.tau * 1e-6; return p.mode === 'obs' ? p.nt / (1 + p.nt * t) : p.mode === 'true' ? p.mm / (1 - p.mm * t) : p.mm * t * 100; } },
    { id: 'trd-g08', type: 'nat', level: 4, exams: ['net'], sub: 'semiconductor detectors',
      make(r) {
        const [mat, w, F] = choose(r, [['silicon', 3.62, 0.115], ['germanium', 2.96, 0.13], ['CdTe', 4.43, 0.15], ['diamond', 13.0, 0.08]]);
        const [src, E] = choose(r, [['$^{55}$Fe X-rays', 5.9], ['$^{241}$Am gamma rays', 59.5], ['$^{57}$Co gamma rays', 122], ['$^{137}$Cs gamma rays', 662], ['$^{60}$Co gamma rays', 1332]]);
        const mode = choose(r, ['fwhm', 'pairs']);
        const fw = 2.355 * Math.sqrt(F * E * 1000 * w), N = E * 1000 / w;
        const ans = mode === 'fwhm' ? fw : N / 1000;
        return { q: mode === 'fwhm'
          ? `In ${mat} an electron-hole pair costs ${w} eV and the Fano factor is ${F}. For ${src} of ${E} keV, fully absorbed, the statistical limit to the energy resolution (FWHM) is ______ eV (to three significant figures).`
          : `In ${mat} an electron-hole pair costs ${w} eV. A ${E} keV photon (${src}) absorbed fully creates $k\\times10^3$ pairs on average; $k$ is ______ (to three significant figures).`,
          answer: s3(ans), tol: t6(ans), unit: mode === 'fwhm' ? 'eV' : undefined, w, F, E, mode,
          sol: `$N = E/w = ${E * 1000}/${w} = ${+N.toPrecision(4)}$.${mode === 'fwhm' ? ` $\\sigma_E = w\\sqrt{FN} = \\sqrt{FEw} = ${round(Math.sqrt(F * E * 1000 * w), 2)}$ eV, FWHM $= 2.355\\sigma_E = ${+fw.toPrecision(4)}$ eV.` : ''}`,
          trap: 'The Fano factor multiplies the Poisson variance; take its square root for the spread.' };
      },
      verify: (p) => (p.mode === 'fwhm' ? 2.355 * Math.sqrt(p.F * p.E * 1000 * p.w) : p.E / p.w) },
    { id: 'trd-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'sensor response',
      make(r) {
        const tau = pick(r, 0.5, 20, 0.5), T0 = choose(r, [0, 15, 20, 25]), Tf = choose(r, [60, 80, 100, 150, -10]), mode = choose(r, ['read', 'time', 'ramp']);
        const t = round(tau * pick(r, 0.3, 4, 0.1), 2), frac = choose(r, [90, 95, 99, 99.9]), a = pick(r, 0.1, 5, 0.1);
        let ans, q, sol, unit;
        if (mode === 'read') { ans = Tf + (T0 - Tf) * Math.exp(-t / tau); unit = '°C'; q = `A thermometer with time constant ${tau} s, initially at ${T0} °C, is moved into a fluid at ${Tf} °C. Its reading after ${t} s is ______ °C (to one decimal place).`; sol = `$T = T_f + (T_0 - T_f)e^{-t/\\tau} = ${Tf} + (${T0 - Tf})e^{-${round(t / tau, 4)}} = ${round(ans, 2)}$ °C.`; }
        else if (mode === 'time') { ans = tau * Math.log(100 / (100 - frac)); unit = 's'; q = `A first-order sensor has time constant ${tau} s. After a step change, it reaches ${frac}% of the final change after ______ s (to three significant figures).`; sol = `$1 - e^{-t/\\tau} = ${round(frac / 100, 4)}$ gives $t = \\tau\\ln[1/(1 - ${round(frac / 100, 4)})] = ${tau}\\ln(${round(100 / (100 - frac), 3)}) = ${+ans.toPrecision(4)}$ s.`; }
        else { ans = a * tau; unit = 'K'; q = `A first-order temperature sensor with time constant ${tau} s follows a temperature rising steadily at ${a} K/s. After the start-up transient, its reading lags the true temperature by ______ K (to three significant figures).`; sol = `For a ramp $T = at$, the solution of $\\tau\\dot T_s = T - T_s$ settles to $T_s = a(t - \\tau)$: a constant lag $a\\tau = ${a}\\times${tau} = ${+ans.toPrecision(4)}$ K.`; }
        return { q, answer: mode === 'read' ? round(ans, 1) : s3(ans), tol: mode === 'read' ? 0.1 : t6(ans), unit, tau, T0, Tf, t, frac, a, mode, sol,
          trap: 'One time constant brings the sensor 63.2% of the way; it never quite arrives.' };
      },
      verify: (p) => (p.mode === 'read' ? p.Tf + (p.T0 - p.Tf) * Math.exp(-p.t / p.tau) : p.mode === 'time' ? -p.tau * Math.log(1 - p.frac / 100) : p.a * p.tau) },
    { id: 'trd-g10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'piezoelectric sensors',
      make(r) {
        const [mat, d] = choose(r, [['quartz', 2.3], ['PZT ceramic', 300], ['PVDF film', 20], ['lithium niobate', 6]]);
        const F = choose(r, [0.5, 1, 2, 5, 10, 20, 50]), Cs = choose(r, [50, 100, 200, 500, 1000]), Cc = choose(r, [0, 100, 300, 1000]), mode = choose(r, ['V', 'tau']);
        const R = choose(r, [1e9, 1e10, 1e11, 1e12]);
        const V = d * F / (Cs + Cc), tau = R * (Cs + Cc) * 1e-12, RT = `10^{${Math.round(Math.log10(R))}}`;
        const ans = mode === 'V' ? V : tau;
        return { q: mode === 'V'
          ? `A ${mat} force sensor ($d = ${d}$ pC/N, capacitance ${Cs} pF) is connected through a cable of capacitance ${Cc} pF to a high-impedance voltmeter. A sudden force of ${F} N gives a voltage of ______ V (to three significant figures).`
          : `A piezoelectric sensor of capacitance ${Cs} pF with ${Cc} pF of cable feeds an amplifier whose input resistance (with leakage) is $${RT}$ Ω. A steady force's signal decays with a time constant of ______ s (to three significant figures).`,
          answer: s3(ans), tol: t6(ans), unit: mode === 'V' ? 'V' : 's', d, F, Cs, Cc, R, mode,
          sol: mode === 'V' ? `$q = dF = ${round(d * F, 3)}$ pC; $V = q/(C_s + C_c) = ${round(d * F, 3)}/${Cs + Cc}$ V $= ${+V.toPrecision(4)}$ V.` : `$\\tau = R(C_s + C_c) = ${RT}\\times${Cs + Cc}\\times10^{-12} = ${+tau.toPrecision(4)}$ s.`,
          trap: 'The cable capacitance is in parallel with the sensor: it lowers the voltage but lengthens the time constant.' };
      },
      verify: (p) => (p.mode === 'V' ? p.d * p.F / (p.Cs + p.Cc) : p.R * (p.Cs + p.Cc) * 1e-12) },
    { id: 'trd-g11', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Hall sensors',
      make(r) {
        const n = choose(r, [1e20, 5e20, 1e21, 2e21, 1e22]), t = choose(r, [10, 20, 50, 100, 200]), I = choose(r, [0.5, 1, 2, 5, 10]);
        const mode = choose(r, ['V', 'B']), B = pick(r, 0.01, 1.5, 0.01);
        const V = I * 1e-3 * B / (n * QE * t * 1e-6) * 1e3;    // mV
        const Vr = +V.toPrecision(3);
        const ans = mode === 'V' ? V : Vr * 1e-3 * n * QE * t * 1e-6 / (I * 1e-3);
        const nTeX = `${+(n / 10 ** Math.floor(Math.log10(n))).toFixed(1)}\\times10^{${Math.floor(Math.log10(n))}}`;
        return { q: mode === 'V'
          ? `A Hall plate ${t} μm thick with carrier density $${nTeX}$ m$^{-3}$ carries ${I} mA in a perpendicular field of ${B} T. The Hall voltage is ______ mV (to three significant figures).`
          : `A Hall plate ${t} μm thick with carrier density $${nTeX}$ m$^{-3}$ carries ${I} mA and shows a Hall voltage of ${Vr} mV. The perpendicular field is ______ T (to three significant figures).`,
          answer: s3(ans), tol: t6(ans), unit: mode === 'V' ? 'mV' : 'T', n, t, I, B, Vr, mode,
          sol: `$V_H = IB/(net)$ with $net = ${nTeX}\\times1.602\\times10^{-19}\\times${t}\\times10^{-6} = ${+(n * QE * t * 1e-6).toPrecision(4)}$ C m$^{-2}$. ${mode === 'V' ? `$V_H = ${I}\\times10^{-3}\\times${B}/${+(n * QE * t * 1e-6).toPrecision(4)} = ${+V.toPrecision(4)}$ mV.` : `$B = V_Hnet/I = ${Vr}\\times10^{-3}\\times${+(n * QE * t * 1e-6).toPrecision(4)}/(${I}\\times10^{-3}) = ${+ans.toPrecision(4)}$ T.`}`,
          trap: 'Use the thickness along the field, not the width.' };
      },
      verify: (p) => (p.mode === 'V' ? p.I * 1e-3 * p.B / (p.n * QE * p.t * 1e-6) * 1e3 : p.Vr * 1e-3 * p.n * QE * p.t * 1e-6 / (p.I * 1e-3)) },
    { id: 'trd-g12', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'vacuum',
      make(r) {
        const G = [
          ['a Bourdon tube or capacitance diaphragm gauge', ['500 mbar', '200 mbar', '50 mbar', '800 mbar']],
          ['a Pirani (thermal conductivity) gauge', ['0.05 mbar', '0.01 mbar', '0.2 mbar', '1 mbar']],
          ['a Bayard-Alpert hot-cathode ionisation gauge', ['$10^{-7}$ mbar', '$10^{-8}$ mbar', '$10^{-9}$ mbar', '$5\\times10^{-8}$ mbar']],
        ];
        const k = int(r, 0, 2), p = choose(r, G[k][1]);
        const wrong = G.filter((_, i) => i !== k).map((g) => g[0]).concat(['a thermocouple placed in the gas to read its temperature']);
        const o = mcqOptions(r, G[k][0], wrong);
        return { q: `Which gauge is suited to reading a pressure of about ${p} in a vacuum system?`, options: o.options, answer: o.answer,
          sol: 'Rough ranges: mechanical (Bourdon, diaphragm, capacitance manometer) from atmosphere down to about 1 mbar or below; Pirani about $10^{-3}$ to 10 mbar; hot-cathode ionisation $10^{-3}$ down to about $10^{-10}$ mbar. ' + `At ${p} the right choice is ${G[k][0]}.`,
          trap: 'No single gauge covers atmosphere to ultrahigh vacuum; systems carry two or three.' };
      } },
    { id: 'trd-g13', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'vacuum',
      make(r) {
        const V = choose(r, [5, 10, 20, 50, 100, 200]), S = choose(r, [1, 2, 4, 5, 10, 16]), p0 = choose(r, [1000, 100, 10]), e = int(r, 1, 4);
        const p = p0 / 10 ** e, mode = choose(r, ['t', 'S']);
        const t = (V / S) * Math.log(p0 / p), tr = round(t, 1);
        const ans = mode === 't' ? t : V * Math.log(p0 / p) / tr;
        return { q: mode === 't'
          ? `A ${V} L chamber is pumped at a constant effective speed of ${S} L/s (no outgassing). Going from ${p0} mbar to ${+p.toPrecision(3)} mbar takes ______ s (to three significant figures).`
          : `A ${V} L chamber falls from ${p0} mbar to ${+p.toPrecision(3)} mbar in ${tr} s at constant pumping speed (no outgassing). The effective pumping speed is ______ L/s (to three significant figures).`,
          answer: s3(ans), tol: t6(ans), unit: mode === 't' ? 's' : 'L/s', V, S, p0, e, tr, mode,
          sol: `$p = p_0e^{-St/V}$, so $t = (V/S)\\ln(p_0/p)$ with $\\ln(p_0/p) = ${e}\\ln10 = ${round(e * Math.LN10, 4)}$. ${mode === 't' ? `$t = (${V}/${S})\\times${round(e * Math.LN10, 4)} = ${+t.toPrecision(4)}$ s.` : `$S = V\\ln(p_0/p)/t = ${V}\\times${round(e * Math.LN10, 4)}/${tr} = ${+ans.toPrecision(4)}$ L/s.`}`,
          trap: 'Pressure falls exponentially, so each decade takes the same time.' };
      },
      verify: (p) => (p.mode === 't' ? (p.V / p.S) * p.e * Math.LN10 : p.V * p.e * Math.LN10 / p.tr) },
    ...more,
    ...r4.gens,
    ...r5.gens,
  ],
};
