// Extra question shapes for transducers-detectors (templates trd-m31..m35). Imported by transducers-detectors.js.
import { int, choose } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { vs, nt, sci } from './_vary.js';

export default [
  { id: 'trd-m31', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'resistance thermometers', format: 'statements',
    make(r) {
      const T = choose(r, [50, 100, 150, 200]), R = 100 * (1 + 0.00385 * T), not = r() < 0.5;
      const m = msqOf(r, [
        vs(r, `a Pt100 sensor ($\\alpha = 0.00385$ K$^{-1}$) reads about ${R.toFixed(1)} Ω at ${T} °C`, `a Pt100 sensor ($\\alpha = 0.00385$ K$^{-1}$) reads about ${(100 * (1 + 0.0385 * T)).toFixed(0)} Ω at ${T} °C`, `$R = R_0(1 + \\alpha T) = 100(1 + 0.00385\\times${T}) = ${R.toFixed(1)}$ Ω.`),
        ['a thermocouple responds to the temperature difference between its two junctions', true, 'The Seebeck emf depends on both junction temperatures, hence cold-junction compensation.'],
        ['an NTC thermistor\'s resistance falls as temperature rises', true, 'More carriers are thermally excited in the semiconductor.'],
        ['a semiconductor strain gauge has a much larger gauge factor than a metal-foil gauge', true, 'About 100 against about 2, thanks to piezoresistance.'],
        ['a piezoelectric sensor is well suited to measuring a constant (static) force', false, 'Its charge leaks away; it suits dynamic forces and vibration.'],
        ['the phase of an LVDT output tells the direction of displacement', true, 'The output reverses phase as the core passes the null position.'],
        ['a thermocouple needs no reference-junction correction because its emf depends only on the hot junction', false, 'It depends on the difference; the reference junction temperature must be known.'],
      ], { not });
      return { q: `Which of the following statements about sensors are ${nt(not)}?`, ...m,
        trap: 'Thermocouples measure differences; piezoelectric sensors measure changes.' };
    } },
  { id: 'trd-m32', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'semiconductor detectors',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['a Geiger-Müller counter gives no information on the energy of the radiation', true, 'Every pulse grows into a full discharge of the same size.'],
        ['the pulse height of a proportional counter is proportional to the energy deposited', true, 'Gas multiplication is kept in the proportional region.'],
        ['an ionisation chamber has no internal gas gain', true, 'It collects only the primary ion pairs.'],
        ['an HPGe detector has far better energy resolution than a NaI(Tl) scintillator', true, 'Only about 3 eV per electron-hole pair, so many carriers and small statistical spread.'],
        ['an HPGe detector must be cooled (usually to liquid-nitrogen temperature) when operated', true, 'Its small band gap gives too much leakage current at room temperature.'],
        ['a Geiger-Müller counter can record a gamma-ray energy spectrum', false, 'All its pulses are the same size.'],
        ['NaI(Tl) gives better energy resolution than HPGe', false, 'Roughly 7% against 0.2% at 662 keV.'],
        ['an ionisation chamber multiplies the charge by about $10^6$', false, 'That is typical of a GM tube or photomultiplier; an ion chamber has gain 1.'],
      ], not);
      return { q: `Which statement about radiation detectors is ${nt(not)}?`, ...m,
        trap: 'GM counters count; they do not measure energy.' };
    } },
  { id: 'trd-m33', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'sensor choice', format: 'match',
    make(r) {
      const L = { tc: 'a thermocouple', rtd: 'a platinum resistance thermometer', lvdt: 'an LVDT', piezo: 'a piezoelectric accelerometer', hall: 'a Hall-effect sensor', pmt: 'a photomultiplier tube', ion: 'an ionisation (Bayard-Alpert) gauge', pir: 'a Pirani gauge' };
      const cas = choose(r, [
        ['Measure the temperature inside a furnace at about 1500 °C', 'tc', 'Noble-metal thermocouples (types R, S, B) work to about 1700 °C.'],
        ['Measure 0-400 °C with an accuracy of 0.01 °C in a calibration lab', 'rtd', 'Platinum resistance thermometers are the most stable and reproducible.'],
        ['Measure a small linear displacement and its direction, without contact wear', 'lvdt', 'A moving core changes the coupling of two secondaries; frictionless.'],
        ['Measure vibration of a machine at hundreds of hertz', 'piezo', 'High sensitivity for dynamic accelerations.'],
        ['Measure a steady magnetic field of a few millitesla', 'hall', 'The Hall voltage is proportional to $B$, including DC fields.'],
        ['Count single photons of faint blue light', 'pmt', 'Gains of about $10^6$ make single photoelectrons visible.'],
        ['Measure a pressure of about $10^{-6}$ Pa', 'ion', 'Ionisation gauges cover high and ultra-high vacuum.'],
        ['Measure a pressure between about 0.1 Pa and 1000 Pa', 'pir', 'Heat conduction of the gas changes a heated wire\'s temperature in this range.'],
      ]);
      return { q: `Job: ${cas[0]}. The most suitable transducer is`, ...matchOne(r, L, cas),
        trap: 'Pirani gauges stop working in high vacuum, where ionisation gauges take over.' };
    } },
  { id: 'trd-m34', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'gas detectors', format: 'graph in words',
    make(r) {
      const L = {
        plat: 'rises, then stays nearly flat over a wide range (a plateau), then rises steeply',
        expdec: 'falls steeply and nonlinearly (roughly exponentially)',
        lin: 'nearly a straight line through zero at equal junction temperatures',
        sat: 'rises in proportion at first and then levels off toward a maximum',
        peak: 'rises, reaches a maximum and then falls as the true rate keeps increasing',
      };
      const cas = choose(r, [
        ['the count rate of a GM tube against applied voltage (fixed source)', 'plat', 'Above the starting voltage every ionising event gives a full discharge; at too high voltage continuous discharge sets in.'],
        ['the resistance of an NTC thermistor against temperature', 'expdec', '$R \\approx R_0e^{B(1/T - 1/T_0)}$.'],
        ['the emf of a type K thermocouple against the hot-junction temperature (cold junction fixed)', 'lin', 'About 41 µV/K, nearly linear, zero when both junctions are at the same temperature.', ['sat']],
        ['the measured count rate against the true rate for a non-paralysable detector with dead time $\\tau$', 'sat', '$m = n/(1 + n\\tau)$ approaches $1/\\tau$.'],
        ['the measured count rate against the true rate for a paralysable detector with dead time $\\tau$', 'peak', '$m = ne^{-n\\tau}$ peaks at $n = 1/\\tau$ and then falls.'],
      ]);
      return { q: `Plotted on linear axes, ${cas[0]}`, ...matchOne(r, L, cas),
        trap: 'Only a paralysable detector shows a falling measured rate at very high true rates.' };
    } },
  { id: 'trd-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'photodetectors', format: 'order of magnitude',
    make(r) {
      const kind = int(r, 0, 1);
      let q, x, unit, sol;
      if (kind === 0) {
        const P = choose(r, [1e-9, 1e-6, 1e-3, 1]), lam = choose(r, [450, 532, 633, 1064]);
        x = (P * lam * 1e-9) / (6.626e-34 * 2.998e8); unit = '\\text{s}^{-1}';
        q = `A light beam of power $${sci(P)}$ W at ${lam} nm carries about how many photons per second?`;
        sol = `Photon energy $hc/\\lambda = ${sci((6.626e-34 * 2.998e8) / (lam * 1e-9))}$ J, so the rate is $P\\lambda/(hc) = ${sci(x)}$ per second.`;
      } else {
        const dT = choose(r, [1, 10, 100, 1000]);
        x = 41e-6 * dT; unit = '\\text{V}';
        q = `A type K thermocouple (about 41 µV/K) has its junctions ${dT} K apart. Its emf is about`;
        sol = `$V \\approx 41\\times10^{-6}\\times${dT} = ${sci(x)}$ V: thermocouple signals are millivolts at most, so they need careful amplification.`;
      }
      const o = orderOpts(r, x, unit);
      return { q, options: o.options, answer: o.answer, sol, trap: 'A milliwatt of visible light is about $3\\times10^{15}$ photons per second.' };
    } },
];
