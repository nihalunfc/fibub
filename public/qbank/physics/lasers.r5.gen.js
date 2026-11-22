// Round 5 extras for lasers: original questions, written 2026-11-22.
import { pick, choose, round } from '../_util.js';
const R = String.raw;

const CL = 2.99792458e8;

export default {
  items: [
    { id: 'lsr-r5-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'photon energy',
      q: R`The CO$_2$ laser emits at $10.6\ \mu$m. Its photon energy is about`,
      options: [R`$1.17$ eV`, R`$11.7$ meV`, R`$0.117$ eV`, R`$117$ eV`], answer: 2,
      sol: R`$E = hc/\lambda = 1239.8\ \text{eV nm}/10\,600\ \text{nm} = 0.117$ eV, about 4.5 times $kT$ at room temperature. Such low-energy photons come from vibrational transitions of the molecule, not electronic ones.`,
      trap: R`$1.17$ eV belongs to $1.06\ \mu$m (Nd:YAG), ten times shorter in wavelength.` },
    { id: 'lsr-r5-02', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'quantum defect', unit: '%',
      q: R`A Yb:YAG laser is pumped at $940$ nm and lases at $1030$ nm. Even if every pump photon produced one laser photon, the efficiency could not exceed ______ % (one decimal place).`,
      answer: 91.3, tol: 0.15, calc: () => 940 / 1030 * 100,
      sol: R`Each pump photon gives at most one laser photon, so the best ratio of output to input energy is $\lambda_p/\lambda_L = 940/1030 = 0.913$, that is $91.3$%. The missing $8.7$% (the quantum defect) heats the crystal; Yb:YAG's small quantum defect is why it handles high powers well.`,
      trap: R`The ratio is pump wavelength over laser wavelength; inverting it gives a number above 100%.` },
    { id: 'lsr-r5-03', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'cavity modes', unit: 'MHz',
      q: R`A ring laser cavity has a total round-trip path of $0.60$ m (in air, $n = 1$). The frequency spacing of its longitudinal modes is ______ MHz.`,
      answer: 500, tol: 2, calc: () => CL / 0.6 / 1e6,
      sol: R`A mode needs a whole number of wavelengths around the closed path $P$, so the spacing is $c/P = 3.0\times10^8/0.60 = 5.0\times10^8$ Hz $= 500$ MHz. For a linear cavity of length $L$ the round trip is $2L$, which gives the familiar $c/2L$.`,
      trap: R`Writing $c/2L$ with $L = 0.60$ m treats the ring's full loop as a one-way length.` },
    { id: 'lsr-r5-04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'cavity losses',
      q: R`An empty laser cavity has mirrors of reflectivity $R_1 = 1.00$ and $R_2 = 0.95$ and no other losses. The light intensity falls by a factor $e$ after ______ round trips (one decimal place).`,
      answer: 19.5, tol: 0.1, calc: () => 1 / -Math.log(0.95),
      sol: R`After $m$ round trips the intensity is $(R_1R_2)^m = 0.95^m$. Setting $0.95^m = e^{-1}$: $m = 1/\ln(1/0.95) = 1/0.0513 = 19.5$. For a 0.5 m cavity each round trip takes 3.3 ns, so the photon lifetime is about 65 ns.`,
      trap: R`Using $1/(1 - R) = 20$ is a fair estimate, but the exact count uses the logarithm.` },
    { id: 'lsr-r5-05', type: 'msq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'semiconductor lasers', format: 'statements',
      q: R`Compared with a He-Ne laser, which statements about a typical edge-emitting diode laser are correct?`,
      options: [R`Its beam diverges much more, because it comes from an aperture only a few micrometres high`,
        R`Its wavelength is set mainly by the band gap of the active layer`,
        R`Its population inversion is produced by an electric current through a p-n junction`,
        R`Its linewidth is always narrower, because a semiconductor has sharper levels than a gas`], answer: [0, 1, 2],
      sol: R`Diffraction from a tiny emitting stripe gives divergences of tens of degrees (an elliptical beam). The photon energy is close to the band gap of the active layer. Injected electrons and holes in the junction form the inversion. Gain in a semiconductor spans bands, not sharp levels, and free-running diode lasers usually have broader linewidths (MHz or more) than a stabilised He-Ne.`,
      trap: R`Solid does not mean sharp: in a semiconductor the gain comes from bands.` },
    { id: 'lsr-r5-06', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Q-switching', unit: 'MW',
      q: R`A Nd:YAG rod of volume $1.0$ cm$^3$ holds a population inversion of $1.0\times10^{17}$ cm$^{-3}$ when the Q-switch opens. If every inverted ion gives one $1064$ nm photon and the pulse lasts $10$ ns, the average power during the pulse is ______ MW (two decimal places).`,
      answer: 1.87, tol: 0.02, calc: () => 1e17 * 6.62607e-34 * CL / 1064e-9 / 10e-9 / 1e6,
      sol: R`Step 1: photon energy $hc/\lambda = 1.867\times10^{-19}$ J. Step 2: energy $= 10^{17}\times1.867\times10^{-19} = 18.7$ mJ. Step 3: power $= 18.7\times10^{-3}/10^{-8} = 1.87\times10^6$ W. Q-switching stores energy in the inversion while the cavity is blocked and releases it in one short burst.`,
      trap: R`Energy and power differ by the pulse duration; 18.7 mJ is the energy, not the power.` },
    { id: 'lsr-r5-07', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'harmonic generation',
      q: R`The Nd:YAG laser ($1064$ nm) is frequency tripled in nonlinear crystals. The output wavelength is`,
      options: [R`$532$ nm`, R`$266$ nm`, R`$3192$ nm`, R`$355$ nm`], answer: 3,
      sol: R`Tripling the frequency divides the wavelength by 3: $1064/3 = 354.7\approx355$ nm, in the ultraviolet. Doubling gives the familiar green $532$ nm, quadrupling $266$ nm.`,
      trap: R`Multiplying the frequency shortens the wavelength; $3192$ nm goes the wrong way.` },
    { id: 'lsr-r5-08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Gaussian beams',
      q: R`A $5.0$ W Gaussian beam is focused to a spot of $1/e^2$ intensity radius $w = 20\ \mu$m. The peak intensity at the centre, $I_0 = 2P/(\pi w^2)$, is $k\times10^5$ W/cm$^2$ with $k = $ ______ (two decimal places).`,
      answer: 7.96, tol: 0.05, calc: () => 2 * 5 / (Math.PI * (20e-4) ** 2) / 1e5,
      sol: R`$w = 20\ \mu$m $= 2.0\times10^{-3}$ cm, $\pi w^2 = 1.257\times10^{-5}$ cm$^2$. $I_0 = 2\times5.0/1.257\times10^{-5} = 7.96\times10^5$ W/cm$^2$. The factor 2 appears because a Gaussian packs its power towards the centre: its peak is twice the average over a disc of radius $w$.`,
      trap: R`$P/(\pi w^2)$ gives $3.98$: the flat-top average, not the Gaussian peak.` },
    { id: 'lsr-r5-09', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'threshold', unit: '×10¹⁶ cm⁻³',
      q: R`A Ti:sapphire crystal $2.0$ cm long has stimulated emission cross section $3.0\times10^{-19}$ cm$^2$. The cavity mirrors have $R_1 = 1.00$ and $R_2 = 0.90$; other losses are negligible. The threshold population inversion is $k\times10^{16}$ cm$^{-3}$ with $k = $ ______ (two decimal places).`,
      answer: 8.78, tol: 0.06, calc: () => -Math.log(0.9) / (2 * 3e-19 * 2) / 1e16,
      sol: R`At threshold the round-trip gain balances the mirror loss: $e^{2\sigma\Delta N L}R_1R_2 = 1$, so $\Delta N = \dfrac{\ln(1/R_1R_2)}{2\sigma L} = \dfrac{0.1054}{2\times3.0\times10^{-19}\times2.0} = 8.78\times10^{16}$ cm$^{-3}$.`,
      trap: R`Light passes the crystal twice per round trip; dropping the 2 doubles the answer.` },
    { id: 'lsr-r5-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'Einstein coefficients', format: 'not',
      q: R`Which statement about the Einstein coefficients of a transition is NOT correct?`,
      options: [R`$g_1B_{12} = g_2B_{21}$`, R`$A_{21}/B_{21}\propto\nu^3$`,
        R`The relations between them, though derived for thermal equilibrium, hold for an atom in any radiation field`,
        R`The spontaneous rate $A_{21}$ is fixed by the atom alone and cannot be changed by placing the atom in a small optical cavity`], answer: 3,
      sol: R`The first two are Einstein's relations ($A_{21}/B_{21} = 8\pi h\nu^3/c^3$ for energy density per unit frequency). They are properties of the atom, so they hold outside equilibrium too. But spontaneous emission depends on the density of electromagnetic modes the atom can emit into: a small cavity can enhance it (Purcell effect) or suppress it. $A_{21}$ quoted in tables is for free space.`,
      trap: R`"Spontaneous" does not mean independent of surroundings: the vacuum modes matter.` },
  ],
  gens: [
    { id: 'lsr-r5g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Gaussian beams',
      make(r) {
        const P = choose(r, [0.01, 0.1, 0.5, 1, 2, 5, 10]), w = pick(r, 5, 500, 5);
        const I = 2 * P / (Math.PI * (w * 1e-4) ** 2), v = +I.toPrecision(3);
        return { q: R`A $${P}$ W Gaussian laser beam is focused to a $1/e^2$ radius $w = ${w}\ \mu$m. Its peak intensity $I_0 = 2P/(\pi w^2)$ is ______ W/cm$^2$ (three significant figures).`,
          answer: v, tol: +(v * 0.01).toPrecision(2), unit: 'W/cm²', P, w,
          sol: R`$w = ${w}\times10^{-4}$ cm, $\pi w^2 = ${+(Math.PI * (w * 1e-4) ** 2).toPrecision(4)}$ cm$^2$. $I_0 = 2\times${P}/${+(Math.PI * (w * 1e-4) ** 2).toPrecision(4)} = ${v}$ W/cm$^2$.`,
          trap: 'Convert micrometres to centimetres before squaring; the Gaussian peak has a factor 2.' };
      },
      verify: (p) => 2 * p.P / (Math.PI * (p.w * 1e-4) ** 2) },
    { id: 'lsr-r5g2', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'cavity losses',
      make(r) {
        const L = pick(r, 0.1, 1.5, 0.05), R2 = choose(r, [0.8, 0.9, 0.95, 0.98, 0.99, 0.995]), R1 = choose(r, [1, 0.999, 0.99]);
        const t = 2 * L / (CL * -Math.log(R1 * R2)) * 1e9, v = +t.toPrecision(3);
        return { q: R`A linear laser cavity ${L} m long (in air) has mirror reflectivities $R_1 = ${R1}$ and $R_2 = ${R2}$ and no other losses. The photon lifetime $\tau_c = \dfrac{2L}{c\ln[1/(R_1R_2)]}$ is ______ ns (three significant figures).`,
          answer: v, tol: +(v * 0.01).toPrecision(2), unit: 'ns', L, R1, R2,
          sol: R`One round trip takes $2L/c = ${round(2 * L / CL * 1e9, 3)}$ ns and keeps a fraction $R_1R_2 = ${round(R1 * R2, 6)}$ of the light; $\ln[1/(R_1R_2)] = ${+(-Math.log(R1 * R2)).toPrecision(4)}$. So $\tau_c = ${round(2 * L / CL * 1e9, 3)}/${+(-Math.log(R1 * R2)).toPrecision(4)} = ${v}$ ns.`,
          trap: 'The round trip is 2L, not L.' };
      },
      verify: (p) => 2 * p.L / (CL * -Math.log(p.R1 * p.R2)) * 1e9 },
    { id: 'lsr-r5g3', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'threshold',
      make(r) {
        const [name, s] = choose(r, [['Nd:YAG', 2.8e-19], ['Ti:sapphire', 3.0e-19], ['Nd:glass', 4.0e-20], ['ruby', 2.5e-20], ['Er:glass', 6.0e-21]]);
        const L = pick(r, 0.5, 10, 0.5), R2 = choose(r, [0.8, 0.9, 0.95, 0.98]), a = choose(r, [0, 0.01, 0.02, 0.05]);
        const N = (a + Math.log(1 / R2) / (2 * L)) / s, v = +(N / 1e16).toPrecision(3);
        return { q: R`A ${name} gain medium ($\sigma = ${+(s / 10 ** Math.floor(Math.log10(s))).toFixed(1)}\times10^{${Math.floor(Math.log10(s))}}$ cm$^2$) of length ${L} cm fills a cavity with $R_1 = 1$ and $R_2 = ${R2}$. The internal loss is $${a}$ cm$^{-1}$. The threshold inversion is $k\times10^{16}$ cm$^{-3}$ with $k = $ ______ (three significant figures).`,
          answer: v, tol: +(v * 0.01).toPrecision(2), s, L, R2, a,
          sol: R`Threshold gain $g_\text{th} = \alpha + \dfrac{1}{2L}\ln\dfrac1{R_1R_2} = ${a} + ${+(Math.log(1 / R2) / (2 * L)).toPrecision(4)} = ${+(a + Math.log(1 / R2) / (2 * L)).toPrecision(4)}$ cm$^{-1}$. $\Delta N = g_\text{th}/\sigma = ${v}\times10^{16}$ cm$^{-3}$.`,
          trap: 'Spread the mirror loss over the round trip, 2L.' };
      },
      verify: (p) => (p.a + Math.log(1 / p.R2) / (2 * p.L)) / p.s / 1e16 },
  ],
};
