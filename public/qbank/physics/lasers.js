// Einstein coefficients and lasers: absorption, spontaneous and stimulated emission, A/B relations, population
// inversion in two-, three- and four-level systems, rate equations and gain clamping, threshold gain, cavity modes,
// photon lifetime, line broadening, coherence, Gaussian beams, Q-switching and mode locking, common lasers.
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';
import more from './lasers.more.gen.js';
import more2 from './lasers.more2.gen.js';
import r4 from './lasers.r4.gen.js';
import r5 from './lasers.r5.gen.js';

const H = 6.62607015e-34, CL = 2.99792458e8, KB = 1.380649e-23, U = 1.66053907e-27;
const C2 = 1.438777e-2;   // hc/k in m K
const LINES = [['He-Ne', 632.8], ['ruby', 694.3], ['Nd:YAG', 1064], ['argon ion', 514.5], ['CO$_2$', 10600], ['He-Cd', 441.6], ['GaAs diode', 850], ['Ti:sapphire', 800], ['KrF excimer', 248], ['erbium fibre', 1550]];
const sci = (x, d = 3) => { const e = Math.floor(Math.log10(Math.abs(x))), m = x / 10 ** e; return `${+m.toFixed(d - 1)}\\times10^{${e}}`; };

export default {
  topic: 'lasers',
  items: [
    // ---------- level 1 ----------
    { id: 'lsr-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'stimulated emission',
      q: 'A photon produced by stimulated emission, compared with the photon that stimulated it, has',
      options: ['the same frequency, phase, direction and polarisation', 'the same frequency but a random direction', 'twice the frequency', 'the same direction but a random phase'], answer: 0,
      sol: 'Stimulated emission adds a photon to the same mode of the field: identical frequency, direction, polarisation and phase. This is why a laser beam is coherent and directional.',
      trap: 'Random direction and phase describe spontaneous emission.' },
    { id: 'lsr-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'population inversion',
      q: 'For two levels of equal degeneracy, light is amplified rather than absorbed when',
      options: ['$N_2 = N_1$', '$N_2 > N_1$ (population inversion)', '$N_2 < N_1$', '$N_1 = 0$ is required'], answer: 1,
      sol: 'Stimulated emission rate $\\propto B_{21}N_2$, absorption $\\propto B_{12}N_1$, with $B_{12} = B_{21}$ for equal degeneracies. Net gain needs $N_2 > N_1$, the opposite of thermal equilibrium.',
      trap: '$N_2 = N_1$ is transparency, not gain.' },
    { id: 'lsr-003', type: 'msq', level: 1, exams: ['gate', 'net'], sub: 'common lasers',
      q: 'Which statements about the ruby laser are correct?',
      options: ['It is a three-level laser', 'The active ions are Cr$^{3+}$ in sapphire (Al$_2$O$_3$)', 'It emits at 694.3 nm', 'It was the first laser and was continuous-wave from the start'], answer: [0, 1, 2],
      sol: 'Maiman\'s 1960 ruby laser was flash-lamp pumped and pulsed. Cr$^{3+}$ ions absorb green and blue light, relax to the metastable $^2E$ level (lifetime about 3 ms) and lase to the ground state at 694.3 nm: a three-level scheme.',
      trap: 'Three-level lasers are hard to run continuously; ruby is normally pulsed.' },
    { id: 'lsr-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'einstein coefficients',
      q: 'For a transition of frequency $\\nu$, the ratio of the Einstein coefficients $A_{21}/B_{21}$ (with $B$ defined for energy density per unit frequency) is',
      options: ['$h\\nu/kT$', '$8\\pi h\\nu/c$', '$8\\pi h\\nu^3/c^3$', 'independent of $\\nu$'], answer: 2,
      sol: 'Balancing absorption against spontaneous plus stimulated emission in blackbody radiation (Planck\'s law) gives $A_{21}/B_{21} = 8\\pi h\\nu^3/c^3$ and $g_1B_{12} = g_2B_{21}$. Spontaneous emission grows as $\\nu^3$ relative to stimulated emission.',
      trap: 'The ratio contains no temperature: the coefficients are atomic properties.' },
    { id: 'lsr-005', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'photon energy',
      q: 'The photon energy of the He-Ne laser line at 632.8 nm is ______ eV (to two decimal places). Use $hc = 1239.8$ eV nm.',
      answer: 1.96, tol: 0.01, unit: 'eV', calc: () => 1239.8 / 632.8,
      sol: '$E = hc/\\lambda = 1239.8/632.8 = 1.959$ eV.',
      trap: 'Keep $\\lambda$ in nm with $hc$ in eV nm.' },
    { id: 'lsr-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'population inversion',
      q: 'Why can steady optical pumping never produce a population inversion in a pure two-level system?',
      options: ['The upper level has no lifetime', 'Spontaneous emission is forbidden', 'The photons are absorbed by the walls', 'The pump light stimulates emission as fast as it causes absorption once $N_2 \\to N_1$, so the populations can at most become equal'], answer: 3,
      sol: 'The same pump light drives both $1\\to2$ and $2\\to1$ with equal coefficients (for equal $g$). As $N_2$ approaches $N_1$ the net absorption vanishes: the medium saturates and becomes transparent, never inverted. A third (or fourth) level is needed.',
      trap: 'Saturation gives transparency, not gain.' },

    // ---------- level 2 ----------
    { id: 'lsr-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'thermal populations',
      q: 'For two levels of equal degeneracy separated by the ruby photon energy (694.3 nm), the thermal population ratio at 300 K is $N_2/N_1 = 10^x$. The value of $x$ is ______ (to one decimal place). Use $hc/k = 1.4388\\times10^{-2}$ m K.',
      answer: -30.0, tol: 0.1, calc: () => -(1.4388e-2 / (694.3e-9 * 300)) / Math.LN10,
      sol: '$h\\nu/kT = 1.4388\\times10^{-2}/(694.3\\times10^{-9}\\times300) = 69.08$. $N_2/N_1 = e^{-69.08} = 10^{-69.08/2.3026} = 10^{-30.0}$. Thermal excitation of optical levels is negligible; inversion must be pumped.',
      trap: 'Convert from $e$ to 10 by dividing by $\\ln 10 = 2.303$.' },
    { id: 'lsr-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'cavity modes',
      q: 'A He-Ne laser has mirrors 30 cm apart (gas, $n \\approx 1$). The frequency spacing of its longitudinal modes is ______ MHz (to the nearest integer). Use $c = 3.00\\times10^8$ m/s.',
      answer: 500, tol: 1, unit: 'MHz', calc: () => 3e8 / (2 * 0.3) / 1e6,
      sol: 'Standing waves need $L = q\\lambda/2$, so $\\nu_q = qc/2L$ and $\\Delta\\nu = c/2L = 3.00\\times10^8/0.60 = 5.00\\times10^8$ Hz $= 500$ MHz.',
      trap: 'The round trip is $2L$; using $c/L$ doubles the answer.' },
    { id: 'lsr-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'level schemes',
      q: 'The main advantage of a four-level laser over a three-level laser is that',
      options: ['the lower laser level lies above the ground state and empties quickly, so inversion is reached with very little pumping', 'it needs no pumping at all', 'it gives shorter wavelengths', 'its upper level has no spontaneous emission'], answer: 0,
      sol: 'In a three-level laser the lower laser level is the ground state, so more than half of all atoms must be pumped up before there is gain. In a four-level laser the lower level is nearly empty (well above the ground state and quickly drained), so any population in the upper level is already an inversion.',
      trap: 'Both schemes still need pumping and have spontaneous emission.' },
    { id: 'lsr-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'cavity modes',
      q: 'The He-Ne gain curve (Doppler broadened) is about 1.5 GHz wide and the mode spacing of a 30 cm cavity is 500 MHz. About how many longitudinal modes fit under the gain curve? ______',
      answer: 3, tol: 0,
      sol: '$1.5\\text{ GHz}/0.5\\text{ GHz} = 3$. Such a laser typically runs on two or three longitudinal modes; a much shorter cavity (or an etalon) is needed for single-mode operation.',
      trap: 'The number of modes is gain bandwidth divided by mode spacing.' },
    { id: 'lsr-011', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'common lasers',
      q: 'Which statements about the Nd:YAG laser are correct?',
      options: ['It is a four-level laser', 'Its main line is at 1064 nm', 'The active ions are Nd$^{3+}$ in yttrium aluminium garnet', 'It is a three-level laser like ruby'], answer: [0, 1, 2],
      sol: 'Nd$^{3+}$ is pumped (by lamps or 808 nm diodes) into bands that relax to $^4F_{3/2}$. Lasing to $^4I_{11/2}$, about 2000 cm$^{-1}$ above the ground state, gives 1064 nm; $^4I_{11/2}$ empties in nanoseconds. A textbook four-level system.',
      trap: 'The lower level is thermally almost empty at room temperature because $2000$ cm$^{-1}$ $\\gg kT/hc \\approx 200$ cm$^{-1}$.' },
    { id: 'lsr-012', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'einstein coefficients',
      q: 'In blackbody radiation the ratio of stimulated to spontaneous emission rates is $1/(e^{h\\nu/kT} - 1)$. For $\\lambda = 10.6\\,\\mu$m at 1000 K this ratio is ______ (to three decimal places). Use $hc/k = 1.4388\\times10^{-2}$ m K.',
      answer: 0.346, tol: 0.003, calc: () => 1 / (Math.exp(1.4388e-2 / (10.6e-6 * 1000)) - 1),
      sol: '$h\\nu/kT = 1.4388\\times10^{-2}/(10.6\\times10^{-6}\\times1000) = 1.357$. $e^{1.357} = 3.886$, so the ratio is $1/2.886 = 0.346$. In the infrared at high temperature stimulated emission is significant; in the visible at room temperature it is about $e^{-80}$.',
      trap: 'The ratio is the mean photon number per mode, $\\bar n = 1/(e^{h\\nu/kT} - 1)$.' },
    { id: 'lsr-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'coherence',
      q: 'A single-frequency laser has a linewidth of 1 MHz. Its coherence length is roughly',
      options: ['3 mm', '300 m', '3 km', '30 cm'], answer: 1,
      sol: 'Coherence time $\\tau_c \\approx 1/\\Delta\\nu = 1\\,\\mu$s; coherence length $c\\tau_c = 3\\times10^8\\times10^{-6} = 300$ m. Thermal sources ($\\Delta\\nu \\sim 10^{14}$ Hz) have coherence lengths of micrometres.',
      trap: 'Narrow linewidth means long coherence: $l_c = c/\\Delta\\nu$.' },
    { id: 'lsr-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'linewidth',
      q: 'An excited level decays with lifetime $\\tau = 10$ ns (and the lower level is stable). The natural (Lorentzian) linewidth $\\Delta\\nu = 1/2\\pi\\tau$ is ______ MHz (to one decimal place).',
      answer: 15.9, tol: 0.1, unit: 'MHz', calc: () => 1 / (2 * Math.PI * 1e-8) / 1e6,
      sol: '$\\Delta\\nu = 1/(2\\pi\\times10^{-8}) = 1.59\\times10^7$ Hz $= 15.9$ MHz (full width at half maximum).',
      trap: '$1/\\tau$ is the angular width $\\Delta\\omega$; divide by $2\\pi$ for $\\Delta\\nu$.' },
    { id: 'lsr-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'common lasers',
      q: 'In the He-Ne laser, the role of the helium is',
      options: ['to emit the laser light at 632.8 nm', 'to cool the neon', 'to transfer energy to neon by resonant collisions, from its long-lived metastable levels to nearly coincident neon levels', 'to absorb the infrared lines'], answer: 2,
      sol: 'Electron impact puts He into metastable $2\\,^1S$ (20.61 eV) and $2\\,^3S$ (19.82 eV) levels. These nearly coincide with Ne levels (the 3s and 2s groups), so collisions hand the energy over selectively, building an inversion in neon. The laser transitions are in neon.',
      trap: 'Helium never lases in a He-Ne laser.' },
    { id: 'lsr-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'threshold',
      q: 'A laser medium of length $L$ with gain coefficient $g$ and loss coefficient $\\alpha$ sits between mirrors of reflectance $R_1$ and $R_2$. The threshold condition is',
      options: ['$g = \\alpha$', '$R_1R_2e^{(g - \\alpha)L} = 2$', '$g = \\alpha R_1R_2$', '$R_1R_2e^{2(g - \\alpha)L} = 1$'], answer: 3,
      sol: 'After one round trip (length $2L$) the intensity is multiplied by $R_1R_2e^{2(g - \\alpha)L}$. Oscillation starts when this is 1: $g_{th} = \\alpha + \\dfrac{1}{2L}\\ln\\dfrac{1}{R_1R_2}$.',
      trap: 'The light crosses the medium twice per round trip, hence $2L$.' },

    // ---------- level 3 ----------
    { id: 'lsr-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'threshold',
      q: 'A laser has mirrors with $R_1 = 1.00$ and $R_2 = 0.98$, a 0.50 m gain medium and negligible internal loss. The threshold gain coefficient is ______ m$^{-1}$ (to four decimal places).',
      answer: 0.0202, tol: 0.0003, unit: 'm⁻¹', calc: () => (1 / (2 * 0.5)) * Math.log(1 / 0.98),
      sol: '$g_{th} = \\dfrac{1}{2L}\\ln\\dfrac{1}{R_1R_2} = \\dfrac{1}{1.0}\\ln\\dfrac{1}{0.98} = 0.0202$ m$^{-1}$. A gain of only 2% per round trip is enough with such good mirrors.',
      trap: 'Use $\\ln(1/R_1R_2)$, not $1 - R_1R_2$ (close here, but not for lossy mirrors).' },
    { id: 'lsr-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'einstein coefficients',
      q: 'For a transition at 500 nm, $A_{21}/B_{21} = 8\\pi h/\\lambda^3$ (with $B$ per unit frequency) is ______ $\\times10^{-13}$ J s m$^{-3}$ (to two decimal places). Use $h = 6.626\\times10^{-34}$ J s.',
      answer: 1.33, tol: 0.01, calc: () => 8 * Math.PI * 6.626e-34 / (500e-9) ** 3 / 1e-13,
      sol: '$8\\pi h\\nu^3/c^3 = 8\\pi h/\\lambda^3 = 8\\pi\\times6.626\\times10^{-34}/(5\\times10^{-7})^3 = 1.665\\times10^{-32}/1.25\\times10^{-19} = 1.33\\times10^{-13}$ J s m$^{-3}$.',
      trap: '$\\nu^3/c^3 = 1/\\lambda^3$; do not leave an extra $c$.' },
    { id: 'lsr-019', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'level schemes',
      q: 'For a three-level laser such as ruby, which statements are correct?',
      options: ['More than half of the active ions must be pumped out of the ground state before there is gain (for equal degeneracies)', 'The lower laser level is the ground state', 'The upper laser level is metastable, with a lifetime of milliseconds', 'It runs continuously with very little pump power'], answer: [0, 1, 2],
      sol: 'Gain needs $N_2 > N_1$ where level 1 is the ground state, so over half the ions must be moved; that needs intense pumping, which is why ruby is usually pulsed. The long-lived $^2E$ level (about 3 ms) stores the energy.',
      trap: 'Long upper-level lifetimes help store energy, but the ground-state lower level is the weakness.' },
    { id: 'lsr-020', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'linewidth',
      q: 'The Doppler width (FWHM) of a line is $\\Delta\\nu_D = \\dfrac{2}{\\lambda}\\sqrt{\\dfrac{2kT\\ln2}{m}}$. For the 632.8 nm neon line ($m = 20$ u) at 400 K it is ______ GHz (to two decimal places). Use $k = 1.381\\times10^{-23}$ J/K, $1\\text{ u} = 1.661\\times10^{-27}$ kg.',
      answer: 1.52, tol: 0.02, unit: 'GHz', calc: () => (2 / 632.8e-9) * Math.sqrt(2 * 1.381e-23 * 400 * Math.LN2 / (20 * 1.661e-27)) / 1e9,
      sol: '$2kT\\ln2/m = 2\\times1.381\\times10^{-23}\\times400\\times0.693/(3.322\\times10^{-26}) = 2.305\\times10^5$ m$^2$/s$^2$; square root 480 m/s. $\\Delta\\nu_D = 2\\times480/632.8\\times10^{-9} = 1.52\\times10^9$ Hz.',
      trap: 'Doppler width grows as $\\sqrt{T/m}$ and is far larger than the natural width (about 20 MHz here).' },
    { id: 'lsr-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'cavity modes',
      q: 'To make a gas laser oscillate on a single longitudinal mode without extra optics, one should',
      options: ['shorten the cavity so that the mode spacing $c/2L$ exceeds the gain bandwidth', 'lengthen the cavity', 'use mirrors of higher reflectance', 'raise the gas temperature'], answer: 0,
      sol: 'Only modes inside the gain curve above threshold can lase. If $c/2L$ is larger than that region, just one mode fits. For He-Ne (1.5 GHz) this needs $L$ below about 10 cm, which limits the power.',
      trap: 'A longer cavity packs more modes under the gain curve.' },
    { id: 'lsr-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'photon flux',
      q: 'A 1.0 mW He-Ne laser (632.8 nm) emits ______ $\\times10^{15}$ photons per second (to two decimal places). Use $h = 6.626\\times10^{-34}$ J s, $c = 2.998\\times10^8$ m/s.',
      answer: 3.19, tol: 0.02, calc: () => 1e-3 * 632.8e-9 / (6.626e-34 * 2.998e8) / 1e15,
      sol: 'Photon energy $hc/\\lambda = 1.986\\times10^{-25}/6.328\\times10^{-7} = 3.139\\times10^{-19}$ J. Rate $= 10^{-3}/3.139\\times10^{-19} = 3.19\\times10^{15}$ s$^{-1}$.',
      trap: 'Watt means joule per second; divide by the energy of one photon.' },
    { id: 'lsr-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'gaussian beams',
      q: 'A Nd:YAG beam (1064 nm) has a Gaussian waist radius $w_0 = 0.50$ mm. Its far-field half-angle divergence $\\theta = \\lambda/\\pi w_0$ is ______ mrad (to three decimal places).',
      answer: 0.677, tol: 0.003, unit: 'mrad', calc: () => 1064e-9 / (Math.PI * 0.5e-3) * 1e3,
      sol: '$\\theta = 1.064\\times10^{-6}/(\\pi\\times5.0\\times10^{-4}) = 6.77\\times10^{-4}$ rad $= 0.677$ mrad. At 1 km the beam radius is about 0.68 m.',
      trap: 'A wider waist gives a smaller divergence: $\\theta \\propto \\lambda/w_0$.' },
    { id: 'lsr-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'pulsed lasers',
      q: 'Q-switching produces short, intense pulses by',
      options: ['locking the phases of many longitudinal modes', 'keeping the cavity losses high while the pump builds a large inversion, then suddenly lowering them', 'cooling the laser medium', 'doubling the frequency'], answer: 1,
      sol: 'With the cavity "spoiled" (low $Q$), the inversion grows far above the normal threshold, storing energy in the medium. Switching the $Q$ high releases it in one giant pulse lasting a few cavity lifetimes (typically nanoseconds). Mode locking is the other technique, giving much shorter pulses.',
      trap: 'Phase locking of modes is mode locking, not Q-switching.' },
    { id: 'lsr-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'pulsed lasers',
      q: 'A mode-locked laser has a 1.5 m long linear cavity ($n \\approx 1$). Its pulse repetition rate is ______ MHz (to the nearest integer). Use $c = 3.00\\times10^8$ m/s.',
      answer: 100, tol: 1, unit: 'MHz', calc: () => 3e8 / 3 / 1e6,
      sol: 'One pulse circulates; it reaches the output mirror once per round trip $2L/c = 3.0/3.00\\times10^8 = 10$ ns. Rate $= c/2L = 100$ MHz, equal to the mode spacing.',
      trap: 'Repetition rate equals the mode spacing $c/2L$.' },
    { id: 'lsr-026', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'einstein coefficients',
      q: 'Which statements about the Einstein coefficients are correct?',
      options: ['$g_1B_{12} = g_2B_{21}$', '$A_{21}/B_{21} \\propto \\nu^3$', 'The coefficients depend on the temperature of the radiation', 'For microwave transitions in thermal radiation at room temperature, stimulated emission is faster than spontaneous emission'], answer: [0, 1, 3],
      sol: 'The relations follow from equilibrium with blackbody radiation but hold always, since $A$ and $B$ are properties of the atom. For microwaves, $h\\nu \\ll kT$ so $\\bar n = 1/(e^{h\\nu/kT} - 1) \\gg 1$: stimulated emission dominates (the basis of the maser).',
      trap: 'Temperature enters the rates through the radiation density, not through $A$ and $B$.' },
    { id: 'lsr-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'rate equations',
      q: 'In a four-level laser below threshold, the upper-level population density obeys $dN_2/dt = R - N_2/\\tau$. With pump rate $R = 2.0\\times10^{21}$ m$^{-3}$ s$^{-1}$ and $\\tau = 230\\,\\mu$s, the steady-state $N_2$ is ______ $\\times10^{17}$ m$^{-3}$ (to one decimal place).',
      answer: 4.6, tol: 0.05, calc: () => 2e21 * 230e-6 / 1e17,
      sol: 'Steady state: $N_2 = R\\tau = 2.0\\times10^{21}\\times2.30\\times10^{-4} = 4.6\\times10^{17}$ m$^{-3}$. Since the lower laser level is empty, this is also the inversion.',
      trap: 'Long upper-state lifetimes give large stored inversion for the same pump.' },
    { id: 'lsr-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'common lasers',
      q: 'In a semiconductor diode laser, the output wavelength is set mainly by',
      options: ['the length of the chip', 'the doping level only', 'the band gap of the active region', 'the drive current only'], answer: 2,
      sol: 'Forward bias injects electrons and holes into the junction region, giving an inversion between conduction and valence band states; photons have energy just above $E_g$. GaAs ($E_g \\approx 1.42$ eV) lases near 850 nm; InGaAsP alloys near 1310 and 1550 nm. The cleaved facets form the cavity.',
      trap: 'Current and temperature tune the wavelength slightly; the band gap fixes it.' },

    // ---------- level 4 ----------
    { id: 'lsr-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'photon lifetime',
      q: 'A 0.30 m cavity ($n = 1$) has $R_1 = 1.00$, $R_2 = 0.97$ and no other losses. The photon lifetime $\\tau_p = \\dfrac{2L}{c\\ln(1/R_1R_2)}$ is ______ ns (to one decimal place). Use $c = 2.998\\times10^8$ m/s.',
      answer: 65.7, tol: 0.3, unit: 'ns', calc: () => 0.6 / (2.998e8 * Math.log(1 / 0.97)) * 1e9,
      sol: '$\\ln(1/0.97) = 0.03046$. Round-trip time $2L/c = 2.001$ ns. $\\tau_p = 2.001/0.03046 = 65.7$ ns: a photon makes about 33 round trips before it escapes.',
      trap: 'Divide the round-trip time by the fractional loss per round trip.' },
    { id: 'lsr-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'threshold',
      q: 'A 10 cm gain medium has internal loss $\\alpha = 0.50$ m$^{-1}$ and sits between mirrors of reflectance 0.99 and 0.95. The threshold gain coefficient is ______ m$^{-1}$ (to three decimal places).',
      answer: 0.807, tol: 0.003, unit: 'm⁻¹', calc: () => 0.5 + (1 / 0.2) * Math.log(1 / (0.99 * 0.95)),
      sol: '$R_1R_2 = 0.9405$, $\\ln(1/0.9405) = 0.06134$. $g_{th} = 0.50 + 0.06134/(2\\times0.10) = 0.50 + 0.307 = 0.807$ m$^{-1}$.',
      trap: 'Mirror losses are spread over $2L = 0.20$ m.' },
    { id: 'lsr-031', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'laser light',
      q: 'Which properties distinguish laser light from the light of a thermal source of the same power?',
      options: ['Much greater spectral purity (narrow linewidth)', 'High spatial coherence, giving low divergence', 'Very high radiance (power per unit area per solid angle)', 'Laser light is always visible'], answer: [0, 1, 2],
      sol: 'Stimulated emission into one or a few cavity modes gives narrow lines, a well-defined wavefront and a nearly diffraction-limited beam. Many lasers emit in the IR (CO$_2$, Nd:YAG) or UV (excimers).',
      trap: 'Visibility has nothing to do with being a laser.' },
    { id: 'lsr-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'cavity modes',
      q: 'A Nd:YAG rod fills a 10.0 cm cavity completely (refractive index 1.82). The longitudinal mode spacing is ______ MHz (to the nearest integer). Use $c = 2.998\\times10^8$ m/s.',
      answer: 824, tol: 2, unit: 'MHz', calc: () => 2.998e8 / (2 * 1.82 * 0.1) / 1e6,
      sol: 'The optical path length is $nL$: $\\Delta\\nu = c/2nL = 2.998\\times10^8/(2\\times1.82\\times0.100) = 8.24\\times10^8$ Hz $= 824$ MHz.',
      trap: 'Inside a medium the mode spacing uses the optical length $nL$.' },
    { id: 'lsr-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'einstein coefficients',
      q: 'Two transitions have the same transition dipole moment, one at 500 nm and one at 10 $\\mu$m. The ratio of their spontaneous emission rates $A(10\\,\\mu\\text{m})/A(500\\text{ nm})$ is',
      options: ['$20$', '$1/20$', '$1/400$', '$1.25\\times10^{-4}$'], answer: 3,
      sol: '$A = \\dfrac{\\omega^3|d|^2}{3\\pi\\varepsilon_0\\hbar c^3} \\propto \\nu^3|d|^2$. The frequency ratio is $500/10000 = 1/20$, so $A$ falls by $(1/20)^3 = 1.25\\times10^{-4}$. Infrared levels live much longer.',
      trap: 'With equal dipoles, $B$ is the same but $A \\propto \\nu^3 B$.' },
    { id: 'lsr-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'pulsed lasers',
      q: 'A Ti:sapphire laser at 800 nm is mode-locked over a 100 nm bandwidth. For a transform-limited Gaussian pulse, $\\Delta\\tau\\,\\Delta\\nu \\approx 0.441$. The shortest pulse duration is about ______ fs (to one decimal place). Use $c = 2.998\\times10^8$ m/s.',
      answer: 9.4, tol: 0.2, unit: 'fs', calc: () => 0.441 / (2.998e8 * 100e-9 / (800e-9) ** 2) * 1e15,
      sol: '$\\Delta\\nu = c\\Delta\\lambda/\\lambda^2 = 2.998\\times10^8\\times10^{-7}/(8\\times10^{-7})^2 = 4.68\\times10^{13}$ Hz. $\\Delta\\tau = 0.441/4.68\\times10^{13} = 9.4\\times10^{-15}$ s, a few optical cycles.',
      trap: 'Convert the wavelength bandwidth to frequency before using the time-bandwidth product.' },
    { id: 'lsr-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'common lasers',
      q: 'Which statement correctly describes the energy transfer that makes the He-Ne laser work?',
      options: ['Helium\'s metastable $2\\,^1S$ level (20.61 eV) nearly coincides with a neon 3s level (about 20.66 eV), so collisions transfer energy selectively to that neon level', 'Neon transfers energy to helium, which emits the red line', 'Helium ions recombine with neon to form excited HeNe molecules', 'The helium absorbs the 3.39 $\\mu$m competing line'], answer: 0,
      sol: 'The small energy mismatch (about 0.05 eV) is made up from the kinetic energy of the colliding atoms. The neon 3s level then lases to a 2p level at 632.8 nm, and the 2p level empties quickly by spontaneous emission to the 1s levels.',
      trap: 'Helium only stores and hands over the energy; neon lases.' },
    { id: 'lsr-036', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'gain saturation',
      q: 'A homogeneously broadened laser has small-signal gain $g_0 = 2.0$ m$^{-1}$ and threshold gain $g_{th} = 0.50$ m$^{-1}$. With $g = g_0/(1 + I/I_{sat})$, in steady operation the circulating intensity is $I = $ ______ $I_{sat}$.',
      answer: 3, tol: 0.01,
      sol: 'Above threshold the gain clamps at $g_{th}$: $0.50 = 2.0/(1 + I/I_{sat})$, so $1 + I/I_{sat} = 4$ and $I = 3I_{sat}$.',
      trap: 'In steady state gain equals loss; the intensity grows until saturation pulls the gain down to $g_{th}$.' },

    // ---------- level 5 ----------
    { id: 'lsr-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'level schemes',
      q: 'In ruby the ground level ($^4A_2$) has degeneracy 4 and the upper laser level ($\\bar E$ of $^2E$) has degeneracy 2. Treating only these two levels as populated, the fraction of Cr$^{3+}$ ions that must be in the upper level for transparency ($N_2/g_2 = N_1/g_1$) is ______ (to three decimal places).',
      answer: 0.333, tol: 0.002, calc: () => 1 / 3,
      sol: 'Transparency: $N_2/2 = N_1/4$, so $N_1 = 2N_2$. With $N_1 + N_2 = N$: $N_2 = N/3$, a fraction of 0.333. (Including the second $^2E$ component, $2\\bar A$, raises the requirement a little.)',
      trap: 'With unequal degeneracies the inversion condition is $N_2/g_2 > N_1/g_1$, not $N_2 > N_1$.' },
    { id: 'lsr-038', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'rate equations',
      q: 'For a homogeneously broadened four-level laser operating in steady state above threshold, which statements are correct?',
      options: ['The population inversion is clamped at its threshold value', 'Extra pump power above threshold goes into extra laser photons', 'The output power rises linearly with pump power above threshold', 'The upper-level population keeps rising in proportion to the pump'], answer: [0, 1, 2],
      sol: 'The steady-state photon equation requires gain = loss, which fixes the inversion at $N_{th}$. The atom equation $R = N_{th}/\\tau + (\\text{stimulated rate})$ then makes the stimulated rate, and so the output, grow as $R - R_{th}$.',
      trap: 'Below threshold $N_2 = R\\tau$ grows with pumping; above it, $N_2$ stops growing.' },
    { id: 'lsr-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'gain',
      q: 'The stimulated emission cross section of Nd:YAG at 1064 nm is about $2.8\\times10^{-23}$ m$^2$. The inversion density needed for a gain coefficient of 1.0 m$^{-1}$ ($g = \\sigma\\Delta N$) is ______ $\\times10^{22}$ m$^{-3}$ (to two decimal places).',
      answer: 3.57, tol: 0.02, calc: () => 1 / 2.8e-23 / 1e22,
      sol: '$\\Delta N = g/\\sigma = 1.0/2.8\\times10^{-23} = 3.57\\times10^{22}$ m$^{-3}$, a tiny fraction of the $1.4\\times10^{26}$ m$^{-3}$ Nd ions in 1% doped YAG.',
      trap: 'Gain coefficient is cross section times inversion density, with consistent units (m$^2$ and m$^{-3}$).' },
    { id: 'lsr-040', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'einstein coefficients',
      q: 'Why are X-ray lasers far harder to build than visible lasers?',
      options: ['X-ray photons cannot cause stimulated emission', 'Spontaneous emission rates grow roughly as $\\nu^3$, so upper levels empty extremely fast and the pump power needed to keep an inversion becomes enormous; good X-ray mirrors are also lacking', 'X-rays travel slower than light', 'The Einstein relations fail for X-rays'], answer: 1,
      sol: '$A \\propto \\nu^3|d|^2$: lifetimes of X-ray transitions are femtoseconds to picoseconds, and the pump power per unit volume needed for a given gain rises roughly as $\\nu^4$ or faster. With no efficient mirrors, X-ray lasers work in single-pass amplified spontaneous emission (e.g. free-electron lasers).',
      trap: 'Stimulated emission works at any frequency; it is the competition with spontaneous decay that hurts.' },
    ...more2,
    ...r4.items,
    ...r5.items,
  ],

  gens: [
    { id: 'lsr-g01', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'einstein coefficients',
      make(r) {
        const [name, lam] = choose(r, LINES);
        const v = 8 * Math.PI * H / (lam * 1e-9) ** 3, e = Math.floor(Math.log10(v)), m = v / 10 ** e;
        return { q: `For the ${name} laser transition at ${lam} nm, $A_{21}/B_{21} = 8\\pi h\\nu^3/c^3$ (with $B$ defined per unit frequency) equals $k\\times10^{${e}}$ J s m$^{-3}$. The value of $k$ is ______ (to three significant figures). Use $h = 6.626\\times10^{-34}$ J s.`,
          answer: +m.toPrecision(3), tol: +(m * 0.006).toPrecision(2), lam, e,
          sol: `$8\\pi h/\\lambda^3 = 8\\pi\\times6.626\\times10^{-34}/(${lam}\\times10^{-9})^3 = ${sci(v, 4)}$ J s m$^{-3}$, so $k = ${+m.toPrecision(4)}$.`,
          trap: 'Long wavelengths give a much smaller ratio: spontaneous emission is weak in the IR.' };
      },
      verify: (p) => 8 * Math.PI * H / (p.lam * 1e-9) ** 3 / 10 ** p.e },
    { id: 'lsr-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'einstein coefficients',
      make(r) {
        const [name, lam] = choose(r, LINES.concat([['hydrogen 21 cm', 2.11e8], ['ammonia maser', 1.2563e7]]));
        const T = choose(r, [300, 1000, 3000, 5800, 10000]);
        const x = C2 / (lam * 1e-9 * T), ans = 1 / Math.expm1(x);
        const big = ans > 0.01;
        return { q: `For radiation at ${lam >= 1e6 ? `${round(lam / 1e7, 3)} cm` : `${lam} nm`} (${name}) in thermal equilibrium at ${T} K, the ratio of stimulated to spontaneous emission rates, $1/(e^{h\\nu/kT} - 1)$, is ${big ? '______ (to three significant figures)' : 'tiny; its $\\log_{10}$ is ______ (to two decimal places)'}. Use $hc/k = 1.4388\\times10^{-2}$ m K.`,
          answer: big ? +ans.toPrecision(3) : round(-x / Math.LN10 + Math.log10(1 / (1 - Math.exp(-x))), 2), tol: big ? +(ans * 0.01).toPrecision(2) : 0.02, lam, T, big,
          sol: `$h\\nu/kT = 1.4388\\times10^{-2}/(${lam >= 1e6 ? round(lam / 1e9, 5) : lam + '\\times10^{-9}'}\\times${T}) = ${+x.toPrecision(4)}$. ${big ? `Ratio $= 1/(e^{${+x.toPrecision(4)}} - 1) = ${+ans.toPrecision(4)}$.` : `Ratio $\\approx e^{-${+x.toPrecision(4)}}$, so $\\log_{10} = -${+x.toPrecision(4)}/2.3026 = ${round(-x / Math.LN10, 2)}$.`}`,
          trap: 'When $h\\nu \\ll kT$ the ratio is about $kT/h\\nu$, much larger than 1.' };
      },
      verify: (p) => { const x = C2 / (p.lam * 1e-9 * p.T); return p.big ? 1 / Math.expm1(x) : -x / Math.LN10 + Math.log10(1 / (1 - Math.exp(-x))); } },
    { id: 'lsr-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'thermal populations',
      make(r) {
        const dE = pick(r, 0.01, 0.3, 0.005), T = choose(r, [77, 200, 300, 500, 1000, 2000]), g1 = int(r, 1, 4), g2 = int(r, 1, 6);
        const ans = (g2 / g1) * Math.exp(-dE / (8.617333e-5 * T));
        return { q: `Two levels are ${dE} eV apart; the lower has degeneracy ${g1} and the upper ${g2}. In thermal equilibrium at ${T} K, $N_2/N_1$ is ______ (to three significant figures). Use $k = 8.617\\times10^{-5}$ eV/K.`,
          answer: +ans.toPrecision(3), tol: +(ans * 0.01).toPrecision(2), dE, T, g1, g2,
          sol: `$N_2/N_1 = (g_2/g_1)e^{-\\Delta E/kT} = (${g2}/${g1})\\exp[-${dE}/(8.617\\times10^{-5}\\times${T})] = (${round(g2 / g1, 4)})\\times${+Math.exp(-dE / (8.617333e-5 * T)).toPrecision(4)} = ${+ans.toPrecision(4)}$.`,
          trap: 'Degeneracies multiply the Boltzmann factor.' };
      },
      verify: (p) => (p.g2 / p.g1) * Math.exp(-p.dE / (8.617333e-5 * p.T)) },
    { id: 'lsr-g04', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'cavity modes',
      make(r) {
        const L = pick(r, 0.05, 2, 0.01), n = choose(r, [1, 1, 1.5, 1.82, 1.76, 3.6]), bw = pick(r, 0.5, 300, 0.5);
        const mode = choose(r, ['spacing', 'count']);
        const dn = CL / (2 * n * L), cnt = Math.floor(bw * 1e9 / dn);
        return { q: mode === 'spacing'
          ? `A laser cavity is ${L} m long and filled with a medium of refractive index ${n}. The longitudinal mode spacing is ______ MHz (to three significant figures). Use $c = 2.998\\times10^8$ m/s.`
          : `A laser cavity ${L} m long (refractive index ${n}) has a gain bandwidth (above threshold) of ${bw} GHz. The largest whole number of mode spacings $c/2nL$ that fits inside this bandwidth is ______. Use $c = 2.998\\times10^8$ m/s.`,
          answer: mode === 'spacing' ? +(dn / 1e6).toPrecision(3) : cnt, tol: mode === 'spacing' ? +(dn / 1e6 * 0.005).toPrecision(2) : 0, unit: mode === 'spacing' ? 'MHz' : undefined, L, n, bw, mode,
          sol: `$\\Delta\\nu = c/2nL = 2.998\\times10^8/(2\\times${n}\\times${L}) = ${+(dn / 1e6).toPrecision(4)}$ MHz.${mode === 'count' ? ` $${bw}\\times10^9/${+(dn).toPrecision(4)} = ${round(bw * 1e9 / dn, 2)}$, so ${cnt} spacings (about ${cnt} or ${cnt + 1} modes, depending on where the modes fall).` : ''}`,
          trap: 'Use the optical length $nL$ and the round trip $2nL$.' };
      },
      verify: (p) => { const dn = CL / (2 * p.n * p.L); return p.mode === 'spacing' ? dn / 1e6 : Math.floor(p.bw * 1e9 / dn); } },
    { id: 'lsr-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'threshold',
      make(r) {
        const R1 = choose(r, [1, 0.999, 0.995, 0.99]), R2 = pick(r, 0.5, 0.99, 0.01), L = pick(r, 0.05, 1, 0.01), a = pick(r, 0, 2, 0.05);
        const g = a + Math.log(1 / (R1 * R2)) / (2 * L);
        return { q: `A gain medium ${L} m long with internal loss coefficient ${a} m$^{-1}$ fills a cavity whose mirrors have reflectances ${R1} and ${R2}. The threshold gain coefficient is ______ m$^{-1}$ (to three significant figures).`,
          answer: +g.toPrecision(3), tol: +(g * 0.006).toPrecision(2), unit: 'm⁻¹', R1, R2, L, a,
          sol: `$g_{th} = \\alpha + \\dfrac{1}{2L}\\ln\\dfrac{1}{R_1R_2} = ${a} + \\dfrac{1}{${round(2 * L, 3)}}\\ln\\dfrac{1}{${round(R1 * R2, 5)}} = ${a} + ${round(Math.log(1 / (R1 * R2)) / (2 * L), 4)} = ${+g.toPrecision(4)}$ m$^{-1}$.`,
          trap: 'Mirror losses are shared over the round-trip length $2L$.' };
      },
      verify: (p) => p.a + Math.log(1 / (p.R1 * p.R2)) / (2 * p.L) },
    { id: 'lsr-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'linewidth',
      make(r) {
        const [name, lam, m] = choose(r, [['He-Ne (Ne)', 632.8, 20.18], ['argon ion (Ar)', 514.5, 39.95], ['CO$_2$', 10600, 44.01], ['He-Cd (Cd)', 441.6, 112.4], ['sodium D', 589.0, 22.99], ['hydrogen H$\\alpha$', 656.3, 1.008], ['mercury', 546.1, 200.6]]);
        const T = choose(r, [300, 400, 500, 1000, 3000]);
        const d = (2 / (lam * 1e-9)) * Math.sqrt(2 * KB * T * Math.LN2 / (m * U));
        return { q: `The Doppler width (FWHM) of a line is $\\Delta\\nu_D = \\dfrac{2}{\\lambda}\\sqrt{\\dfrac{2kT\\ln2}{m}}$. For the ${name} line at ${lam} nm (emitter mass ${m} u) at ${T} K it is ______ MHz (to three significant figures).`,
          answer: +(d / 1e6).toPrecision(3), tol: +(d / 1e6 * 0.006).toPrecision(2), unit: 'MHz', lam, m, T,
          sol: `$\\sqrt{2kT\\ln2/m} = \\sqrt{2\\times1.381\\times10^{-23}\\times${T}\\times0.693/(${m}\\times1.661\\times10^{-27})} = ${round(Math.sqrt(2 * KB * T * Math.LN2 / (m * U)), 1)}$ m/s. $\\Delta\\nu_D = 2\\times${round(Math.sqrt(2 * KB * T * Math.LN2 / (m * U)), 1)}/(${lam}\\times10^{-9}) = ${+(d / 1e6).toPrecision(4)}$ MHz.`,
          trap: 'Light, hot emitters and short wavelengths give the widest Doppler lines.' };
      },
      verify: (p) => (2 / (p.lam * 1e-9)) * Math.sqrt(2 * KB * p.T * Math.LN2 / (p.m * U)) / 1e6 },
    { id: 'lsr-g07', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'coherence',
      make(r) {
        const mode = choose(r, ['nat', 'coh', 'cohlam']);
        const tau = pick(r, 1, 500, 1), dnu = pick(r, 0.1, 1000, 0.1), lam = pick(r, 400, 1600, 1), dl = pick(r, 0.001, 10, 0.001);
        const ans = mode === 'nat' ? 1 / (2 * Math.PI * tau * 1e-9) / 1e6 : mode === 'coh' ? CL / (dnu * 1e6) : (lam * 1e-9) ** 2 / (dl * 1e-9) * 1e3;
        return { q: mode === 'nat' ? `An excited level has radiative lifetime ${tau} ns (lower level stable). Its natural linewidth $\\Delta\\nu = 1/2\\pi\\tau$ is ______ MHz (to three significant figures).`
          : mode === 'coh' ? `A laser has a linewidth of ${dnu} MHz. Its coherence length $l_c = c/\\Delta\\nu$ is ______ m (to three significant figures). Use $c = 2.998\\times10^8$ m/s.`
          : `A source at ${lam} nm has a spectral width of ${dl} nm. Its coherence length $l_c \\approx \\lambda^2/\\Delta\\lambda$ is ______ mm (to three significant figures).`,
          answer: +ans.toPrecision(3), tol: +(ans * 0.006).toPrecision(2), unit: mode === 'nat' ? 'MHz' : mode === 'coh' ? 'm' : 'mm', tau, dnu, lam, dl, mode,
          sol: mode === 'nat' ? `$\\Delta\\nu = 1/(2\\pi\\times${tau}\\times10^{-9}) = ${+ans.toPrecision(4)}$ MHz.` : mode === 'coh' ? `$l_c = 2.998\\times10^8/(${dnu}\\times10^6) = ${+ans.toPrecision(4)}$ m.` : `$l_c = (${lam}\\times10^{-9})^2/(${dl}\\times10^{-9}) = ${+ans.toPrecision(4)}$ mm.`,
          trap: mode === 'nat' ? 'Divide by $2\\pi$.' : 'Narrower lines have longer coherence lengths.' };
      },
      verify: (p) => (p.mode === 'nat' ? 1 / (2 * Math.PI * p.tau * 1e-9) / 1e6 : p.mode === 'coh' ? CL / (p.dnu * 1e6) : (p.lam * 1e-9) ** 2 / (p.dl * 1e-9) * 1e3) },
    { id: 'lsr-g08', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'photon flux',
      make(r) {
        const [name, lam] = choose(r, LINES), mode = choose(r, ['cw', 'pulse']);
        const P = pick(r, 0.5, 50, 0.5), E = pick(r, 0.1, 500, 0.1);
        const ph = H * CL / (lam * 1e-9), n = mode === 'cw' ? P * 1e-3 / ph : E * 1e-3 / ph;
        const e = Math.floor(Math.log10(n)), m = n / 10 ** e;
        return { q: mode === 'cw' ? `A ${P} mW ${name} laser at ${lam} nm emits $k\\times10^{${e}}$ photons per second. The value of $k$ is ______ (to three significant figures). Use $h = 6.626\\times10^{-34}$ J s, $c = 2.998\\times10^8$ m/s.`
          : `A ${name} pulse at ${lam} nm carries ${E} mJ. It contains $k\\times10^{${e}}$ photons. The value of $k$ is ______ (to three significant figures). Use $h = 6.626\\times10^{-34}$ J s, $c = 2.998\\times10^8$ m/s.`,
          answer: +m.toPrecision(3), tol: +(m * 0.006).toPrecision(2), lam, P, E, mode, e,
          sol: `Photon energy $hc/\\lambda = ${sci(ph, 4)}$ J. Number $= ${mode === 'cw' ? `${P}\\times10^{-3}` : `${E}\\times10^{-3}`}/${sci(ph, 4)} = ${sci(n, 4)}$${mode === 'cw' ? ' s$^{-1}$' : ''}.`,
          trap: 'Infrared photons carry less energy, so the same power means more photons.' };
      },
      verify: (p) => { const ph = H * CL / (p.lam * 1e-9); return (p.mode === 'cw' ? p.P : p.E) * 1e-3 / ph / 10 ** p.e; } },
    { id: 'lsr-g09', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'gaussian beams',
      make(r) {
        const [name, lam] = choose(r, LINES), w0 = pick(r, 0.1, 5, 0.05), mode = choose(r, ['theta', 'size']), z = pick(r, 10, 2000, 10);
        const th = lam * 1e-9 / (Math.PI * w0 * 1e-3), zr = Math.PI * (w0 * 1e-3) ** 2 / (lam * 1e-9), w = w0 * Math.sqrt(1 + (z / zr) ** 2);
        return { q: mode === 'theta' ? `A Gaussian ${name} beam (${lam} nm) has waist radius $w_0 = ${w0}$ mm. Its far-field half-angle divergence $\\theta = \\lambda/\\pi w_0$ is ______ mrad (to three significant figures).`
          : `A Gaussian ${name} beam (${lam} nm) has waist radius $w_0 = ${w0}$ mm. Using $w(z) = w_0\\sqrt{1 + (z/z_R)^2}$ with $z_R = \\pi w_0^2/\\lambda$, the beam radius ${z} m from the waist is ______ mm (to three significant figures).`,
          answer: mode === 'theta' ? +(th * 1e3).toPrecision(3) : +w.toPrecision(3), tol: mode === 'theta' ? +(th * 1e3 * 0.006).toPrecision(2) : +(w * 0.006).toPrecision(2), unit: mode === 'theta' ? 'mrad' : 'mm', lam, w0, z, mode,
          sol: mode === 'theta' ? `$\\theta = ${lam}\\times10^{-9}/(\\pi\\times${w0}\\times10^{-3}) = ${+(th * 1e3).toPrecision(4)}$ mrad.` : `$z_R = \\pi(${w0}\\times10^{-3})^2/(${lam}\\times10^{-9}) = ${+zr.toPrecision(4)}$ m. $w = ${w0}\\sqrt{1 + (${z}/${+zr.toPrecision(4)})^2} = ${+w.toPrecision(4)}$ mm.`,
          trap: 'Inside the Rayleigh range the beam hardly grows; far beyond it, $w \\approx \\theta z$.' };
      },
      verify: (p) => { const th = p.lam * 1e-9 / (Math.PI * p.w0 * 1e-3), zr = Math.PI * (p.w0 * 1e-3) ** 2 / (p.lam * 1e-9); return p.mode === 'theta' ? th * 1e3 : p.w0 * Math.sqrt(1 + (p.z / zr) ** 2); } },
    { id: 'lsr-g10', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'pulsed lasers',
      make(r) {
        const L = pick(r, 0.3, 3, 0.05), mode = choose(r, ['rate', 'width', 'modes']);
        const lam = pick(r, 700, 1100, 10), dl = pick(r, 1, 120, 1);
        const rate = CL / (2 * L) / 1e6, dnu = CL * dl * 1e-9 / (lam * 1e-9) ** 2, tau = 0.441 / dnu * 1e15, nm = Math.round(dnu / (CL / (2 * L)));
        return { q: mode === 'rate' ? `A mode-locked laser has a linear cavity ${L} m long ($n = 1$). Its pulse repetition rate is ______ MHz (to three significant figures). Use $c = 2.998\\times10^8$ m/s.`
          : mode === 'width' ? `A mode-locked laser centred at ${lam} nm has a locked bandwidth of ${dl} nm. With $\\Delta\\tau\\Delta\\nu = 0.441$ (transform-limited Gaussian), the pulse duration is ______ fs (to three significant figures). Use $c = 2.998\\times10^8$ m/s.`
          : `A mode-locked laser with a ${L} m linear cavity ($n = 1$) at ${lam} nm locks a ${dl} nm bandwidth. About how many longitudinal modes are locked (bandwidth in Hz divided by mode spacing, to the nearest integer)? ______ Use $c = 2.998\\times10^8$ m/s.`,
          answer: mode === 'rate' ? +rate.toPrecision(3) : mode === 'width' ? +tau.toPrecision(3) : nm, tol: mode === 'rate' ? +(rate * 0.006).toPrecision(2) : mode === 'width' ? +(tau * 0.006).toPrecision(2) : Math.max(1, Math.round(nm * 0.003)), unit: mode === 'rate' ? 'MHz' : mode === 'width' ? 'fs' : undefined, L, lam, dl, mode,
          sol: mode === 'rate' ? `Repetition rate $= c/2L = 2.998\\times10^8/${round(2 * L, 3)} = ${+rate.toPrecision(4)}$ MHz.`
            : mode === 'width' ? `$\\Delta\\nu = c\\Delta\\lambda/\\lambda^2 = ${sci(dnu, 4)}$ Hz; $\\Delta\\tau = 0.441/\\Delta\\nu = ${+tau.toPrecision(4)}$ fs.`
            : `$\\Delta\\nu = c\\Delta\\lambda/\\lambda^2 = ${sci(dnu, 4)}$ Hz; spacing $c/2L = ${sci(CL / (2 * L), 4)}$ Hz; ratio $\\approx ${nm}$.`,
          trap: 'Repetition rate depends on the cavity; pulse duration on the locked bandwidth.' };
      },
      verify: (p) => { const dnu = CL * p.dl * 1e-9 / (p.lam * 1e-9) ** 2; return p.mode === 'rate' ? CL / (2 * p.L) / 1e6 : p.mode === 'width' ? 0.441 / dnu * 1e15 : Math.round(dnu / (CL / (2 * p.L))); } },
    { id: 'lsr-g11', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'level schemes',
      make(r) {
        const pool = [
          ['In a three-level laser the lower laser level is the ground state', 1], ['In a four-level laser the lower laser level must empty quickly', 1], ['A two-level system can be inverted by strong steady optical pumping', 0],
          ['Ruby and Nd:YAG are both four-level lasers', 0], ['The He-Ne laser lases on transitions of neon', 1], ['The CO$_2$ laser at 10.6 $\\mu$m uses vibrational levels of CO$_2$', 1],
          ['A three-level laser needs less pump power than a four-level laser with similar parameters', 0], ['Above threshold the inversion of a steady laser is clamped', 1], ['Inversion means more atoms in the lower level than the upper', 0],
          ['With unequal degeneracies the condition for gain is $N_2/g_2 > N_1/g_1$', 1], ['A long upper-level lifetime helps store energy for Q-switching', 1], ['The gain of a laser medium rises without limit as the intracavity intensity grows', 0]];
        const yes = pool.filter((x) => x[1]), no = pool.filter((x) => !x[1]);
        const k = int(r, 1, 3), ch = shuffle(r, [...shuffle(r, yes).slice(0, k), ...shuffle(r, no).slice(0, 4 - k)]);
        return { q: 'Which of these statements about lasers are correct?',
          options: ch.map((x) => x[0]), answer: ch.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0),
          sol: ch.map((x) => `"${x[0]}": ${x[1] ? 'true' : 'false'}.`).join(' ') + ' Inversion needs $N_2/g_2 > N_1/g_1$; three-level schemes must lift over half the atoms; gain saturates and clamps at threshold.',
          trap: 'Ruby is three-level; Nd:YAG is four-level.' };
      } },
    { id: 'lsr-g12', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'photon lifetime',
      make(r) {
        const L = pick(r, 0.1, 2, 0.05), R1 = choose(r, [1, 0.999, 0.99]), R2 = pick(r, 0.8, 0.995, 0.005), lam = choose(r, [632.8, 1064, 514.5, 10600]);
        const mode = choose(r, ['tau', 'Q']);
        const tau = 2 * L / (CL * Math.log(1 / (R1 * R2))), Q = 2 * Math.PI * (CL / (lam * 1e-9)) * tau;
        const ans = mode === 'tau' ? tau * 1e9 : Q / 1e6;
        return { q: mode === 'tau' ? `A cavity of length ${L} m ($n = 1$) has mirrors with reflectances ${R1} and ${R2} and no other loss. The photon lifetime $\\tau_p = 2L/[c\\ln(1/R_1R_2)]$ is ______ ns (to three significant figures). Use $c = 2.998\\times10^8$ m/s.`
          : `A cavity of length ${L} m ($n = 1$) with mirror reflectances ${R1} and ${R2} supports light at ${lam} nm. With $\\tau_p = 2L/[c\\ln(1/R_1R_2)]$ and $Q = 2\\pi\\nu\\tau_p$, the quality factor is ______ $\\times10^6$ (to three significant figures). Use $c = 2.998\\times10^8$ m/s.`,
          answer: +ans.toPrecision(3), tol: +(ans * 0.006).toPrecision(2), unit: mode === 'tau' ? 'ns' : undefined, L, R1, R2, lam, mode,
          sol: `$\\ln(1/R_1R_2) = ${round(Math.log(1 / (R1 * R2)), 5)}$; round trip $2L/c = ${round(2 * L / CL * 1e9, 4)}$ ns; $\\tau_p = ${+(tau * 1e9).toPrecision(4)}$ ns.${mode === 'Q' ? ` $\\nu = c/\\lambda = ${sci(CL / (lam * 1e-9), 4)}$ Hz; $Q = 2\\pi\\nu\\tau_p = ${sci(Q, 4)}$.` : ''}`,
          trap: 'Better mirrors (smaller loss) mean longer photon lifetime and higher $Q$.' };
      },
      verify: (p) => { const tau = 2 * p.L / (CL * Math.log(1 / (p.R1 * p.R2))); return p.mode === 'tau' ? tau * 1e9 : 2 * Math.PI * (CL / (p.lam * 1e-9)) * tau / 1e6; } },
    ...more,
    ...r4.gens,
    ...r5.gens,
  ],
};
