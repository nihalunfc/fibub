// Round 4 extras for lasers: original questions, written 2026-11-22.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;

const H = 6.62607015e-34, CL = 2.99792458e8;
/** Optically pumped lasers: name, pump nm, laser nm. */
const QD = [['Nd:YAG', 808, 1064], ['Yb:YAG', 940, 1030], ['Er:glass', 980, 1550], ['Ti:sapphire', 532, 800], ['Tm:YAG', 785, 2010], ['Nd:YVO$_4$', 880, 1064]];
/** Gain media: name, wavelength nm, cross section m^2, upper-level lifetime s. */
const SAT = [['Nd:YAG', 1064, 2.8e-23, 230e-6], ['Ti:sapphire', 800, 3.0e-23, 3.2e-6], ['ruby', 694.3, 2.5e-24, 3.0e-3], ['Yb:YAG', 1030, 2.1e-24, 0.95e-3], ['a dye (rhodamine 6G)', 590, 2.0e-20, 5e-9], ['Er:glass', 1550, 7e-25, 8e-3]];
const isat = (lam, s, t) => H * CL / (lam * 1e-9) / (s * t);

export default {
  items: [
    { id: 'lsr-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'optical cavity',
      q: R`The main job of the two mirrors of a laser (the optical resonator) is to`,
      options: [R`pump atoms into the upper laser level`, R`feed light back through the gain medium many times, so that stimulated emission builds up in a few selected modes`,
        R`cool the gain medium`, R`absorb the spontaneous emission`], answer: 1,
      sol: R`A single pass through the gain medium amplifies light only a little. The mirrors send the light back and forth, so each round trip is amplified again; once the round-trip gain beats the losses, oscillation starts. The resonator also selects the allowed frequencies (longitudinal modes) and the beam shape (transverse modes). Pumping is done by a lamp, a diode or a discharge, not by the mirrors.`,
      trap: R`Mirrors do not create the inversion; they provide feedback.` },
    { id: 'lsr-r4-02', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'intensity',
      q: R`A $1.0$ W laser beam is focused to a uniform spot of radius $10\ \mu$m. The intensity is ______ $\times10^9$ W/m$^2$ (two decimal places).`,
      answer: 3.18, tol: 0.02, calc: () => 1 / (Math.PI * 1e-10) / 1e9,
      sol: R`$I = P/(\pi r^2) = 1.0/(\pi\times(1.0\times10^{-5})^2) = 1.0/(3.14\times10^{-10}) = 3.18\times10^9$ W/m$^2$, about 300 kW/cm$^2$: thirty million times the intensity of sunlight at the ground. That is why even modest lasers can cut and why they are dangerous to eyes.`,
      trap: R`Squaring the radius in micrometres and forgetting to convert ($10^{-5}$ m) gives an error of $10^{10}$.` },
    { id: 'lsr-r4-03', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'excimer lasers',
      q: R`In an excimer laser such as KrF (248 nm), population inversion is unusually easy to keep because`,
      options: [R`the upper level has a very short lifetime`, R`krypton fluoride is a stable molecule in its ground state`,
        R`the photon energy is low`, R`the lower level is repulsive (the KrF ground state is unbound), so molecules that reach it fly apart within picoseconds`], answer: 3,
      sol: R`An excimer exists only in an excited, bound state. After emitting, the molecule lands on a repulsive ground-state curve and dissociates almost at once, so the lower laser level is always nearly empty. Any excited molecule is therefore part of an inversion. The lower level being "unbound" also makes the emission a broad band, useful for UV lithography and eye surgery (ArF, 193 nm).`,
      trap: R`A short upper-level lifetime makes lasing harder, not easier.` },
    { id: 'lsr-r4-04', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'gain',
      q: R`A gain medium of length $20$ cm has small-signal gain coefficient $g = 5.0$ m$^{-1}$. The single-pass power gain, in decibels, is about`,
      options: [R`$4.3$ dB`, R`$10$ dB`, R`$1.0$ dB`, R`$2.7$ dB`], answer: 0,
      sol: R`$P_\text{out}/P_\text{in} = e^{gL} = e^{5.0\times0.20} = e^{1} = 2.718$. In decibels: $10\log_{10}(2.718) = 4.34$ dB. (Each unit of $gL$ is 4.34 dB.)`,
      trap: R`$2.7$ is the gain as a plain ratio, not in dB.` },
    { id: 'lsr-r4-05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'quantum defect', unit: '%',
      q: R`A Nd:YAG laser is pumped by diodes at $808$ nm and lases at $1064$ nm. Even if every pump photon gave one laser photon, the largest possible fraction of absorbed pump power that leaves as laser light is ______ % (one decimal place).`,
      answer: 75.9, tol: 0.2, calc: () => 808 / 1064 * 100,
      sol: R`Each pump photon carries $hc/808$ nm and each laser photon $hc/1064$ nm. The ratio of energies is $808/1064 = 0.759$, so at best $75.9\%$ of the pump power can come out; the rest ($24.1\%$, the quantum defect) heats the crystal. This is why lasers pumped close to the laser wavelength (Yb at 940 nm to 1030 nm) run cooler.`,
      trap: R`Taking the ratio upside down ($1064/808 > 1$) would mean the laser makes energy.` },
    { id: 'lsr-r4-06', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'cavity modes',
      q: R`A He-Ne laser (632.8 nm) has mirrors $30$ cm apart. The longitudinal mode it oscillates on has a mode number $q$ (number of half-wavelengths between the mirrors) of the order of`,
      options: [R`$10^3$`, R`$10^6$`, R`$10^9$`, R`$10$`], answer: 1,
      sol: R`Standing waves need $L = q\lambda/2$, so $q = 2L/\lambda = 0.60/(632.8\times10^{-9}) = 9.5\times10^5\approx10^6$. Neighbouring modes ($q$ and $q + 1$) differ in frequency by only $c/2L = 500$ MHz, a tiny fraction of the optical frequency.`,
      trap: R`$q$ is not the number of modes that lase (a handful); it is the index of each one.` },
    { id: 'lsr-r4-07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'saturation',
      q: R`For a four-level gain medium the saturation intensity is $I_\text{sat} = h\nu/(\sigma\tau)$. For Nd:YAG at 1064 nm, $\sigma = 2.8\times10^{-23}$ m$^2$ and $\tau = 230\ \mu$s. $I_\text{sat}$ is ______ $\times10^7$ W/m$^2$ (two decimal places).`,
      answer: 2.9, tol: 0.03, calc: () => H * CL / 1064e-9 / (2.8e-23 * 230e-6) / 1e7,
      sol: R`$h\nu = hc/\lambda = 1.867\times10^{-19}$ J. $\sigma\tau = 2.8\times10^{-23}\times2.3\times10^{-4} = 6.44\times10^{-27}$ m$^2$ s. $I_\text{sat} = 1.867\times10^{-19}/6.44\times10^{-27} = 2.90\times10^7$ W/m$^2$ (2.9 kW/cm$^2$). At this intensity stimulated emission empties the upper level as fast as spontaneous decay, and the gain falls to half.`,
      trap: R`Using the photon energy in eV with SI units elsewhere gives a wrong power of ten.` },
    { id: 'lsr-r4-08', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'gaussian beams', format: 'statements',
      q: R`For a Gaussian laser beam with waist $w_0$ and Rayleigh range $z_R$, which statements are correct?`,
      options: [R`At $z = z_R$ the beam radius is $\sqrt2\,w_0$`, R`The far-field divergence angle is inversely proportional to $w_0$`,
        R`The wavefront is most strongly curved at the waist`, R`Passing from far before to far after the focus, the beam picks up an extra (Gouy) phase of $\pi$`], answer: [0, 1, 3],
      sol: R`$w(z) = w_0\sqrt{1 + (z/z_R)^2}$, so $w(z_R) = \sqrt2w_0$. Far away $w\approx w_0z/z_R = \lambda z/\pi w_0$: divergence $\lambda/\pi w_0$. The radius of curvature $R(z) = z + z_R^2/z$ is infinite at the waist (flat wavefronts) and smallest at $z = \pm z_R$. The Gouy phase $\arctan(z/z_R)$ runs from $-\pi/2$ to $+\pi/2$, a total of $\pi$.`,
      trap: R`At the waist the wavefront is flat, like a plane wave; the strongest curvature is one Rayleigh range away.` },
    { id: 'lsr-r4-09', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'broadening',
      q: R`A strong single-frequency beam passes through an inhomogeneously (Doppler) broadened gain medium. A weak probe then scans the gain profile. The probe finds`,
      options: [R`the whole gain curve reduced by the same factor`, R`no change at all`, R`a narrow dip (hole) in the gain near the strong beam's frequency (and its Doppler mirror image), the rest of the curve unchanged`, R`the gain curve shifted to higher frequency`], answer: 2,
      sol: R`In an inhomogeneous line, different atoms (different velocities) have different resonance frequencies. The strong beam saturates only the atoms within about one homogeneous width of its frequency, burning a spectral hole. In a standing-wave cavity the beam also saturates atoms with the opposite velocity, so a second hole appears symmetrically. In a homogeneously broadened medium every atom sees the beam the same way and the whole curve drops instead.`,
      trap: R`Uniform saturation of the whole curve is the homogeneous case.` },
    { id: 'lsr-r4-10', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'photon lifetime',
      q: R`A He-Ne laser (632.8 nm) has a $0.50$ m cavity ($n = 1$), one mirror with $R = 1.00$ and the other with $R = 0.99$, and no other losses. Using $\tau_p = 2L/(c\ln(1/R_1R_2))$ and $Q = 2\pi\nu\tau_p$, the quality factor of the cavity is ______ $\times10^8$ (two decimal places).`,
      answer: 9.88, tol: 0.05, calc: () => 2 * Math.PI * CL / 632.8e-9 * (1 / (CL * Math.log(1 / 0.99))) / 1e8,
      sol: R`$\ln(1/0.99) = 0.01005$. $\tau_p = 2\times0.50/(2.998\times10^8\times0.01005) = 3.32\times10^{-7}$ s. $\nu = c/\lambda = 4.738\times10^{14}$ Hz. $Q = 2\pi\times4.738\times10^{14}\times3.32\times10^{-7} = 9.88\times10^8$. The cold-cavity linewidth $\nu/Q = 1/(2\pi\tau_p)\approx0.48$ MHz.`,
      trap: R`$Q = \nu\tau_p$ (without $2\pi$) gives $1.6\times10^8$.` },
    { id: 'lsr-r4-11', type: 'msq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'laser types',
      q: R`Which pairings of laser and output wavelength are correct?`,
      options: [R`ArF excimer: 694 nm`, R`He-Ne: 632.8 nm`, R`Nd:YAG: 1064 nm`, R`CO$_2$: 10.6 $\mu$m`], answer: [1, 2, 3],
      sol: R`He-Ne gives red 632.8 nm (neon $3s\to2p$), Nd:YAG 1064 nm (Nd$^{3+}$ $^4F_{3/2}\to{}^4I_{11/2}$), CO$_2$ 10.6 $\mu$m (a vibrational transition). ArF is a deep-UV excimer at 193 nm; 694.3 nm is ruby.`,
      trap: R`694 nm belongs to ruby, the first laser (1960).` },
    { id: 'lsr-r4-12', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'degeneracy',
      q: R`A laser transition joins a lower level of degeneracy $g_1 = 1$ to an upper level of degeneracy $g_2 = 3$. The populations are $N_2 = 2N_1$. A weak beam at the transition frequency is`,
      options: [R`absorbed, because $N_2/g_2 < N_1/g_1$`, R`amplified, because $N_2 > N_1$`, R`amplified, because $g_2 > g_1$`, R`neither absorbed nor amplified`], answer: 0,
      sol: R`With $g_1B_{12} = g_2B_{21}$, the net gain is proportional to $N_2 - (g_2/g_1)N_1$, i.e. to $N_2/g_2 - N_1/g_1$. Here $N_2/g_2 = \tfrac23N_1$, which is less than $N_1/g_1 = N_1$. The populations per state are not inverted, so the beam is absorbed. Inversion needs $N_2 > 3N_1$ here.`,
      trap: R`More atoms in the upper level is not enough when the upper level has more states.` },
  ],
  gens: [
    { id: 'lsr-r4g1', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'quantum defect',
      make(r) {
        const [name, p, l] = choose(r, QD);
        const heat = r() < 0.5;
        const f = heat ? (1 - p / l) * 100 : (p / l) * 100;
        return { q: R`${/^[AEIOU]/.test(name) ? 'An' : 'A'} ${name} laser is pumped at $${p}$ nm and lases at $${l}$ nm. If every absorbed pump photon produced one laser photon, the fraction of absorbed pump power ${heat ? 'left in the crystal as heat (the quantum defect)' : 'that could leave as laser light'} would be ______ % (one decimal place).`,
          answer: round(f, 1), tol: 0.2, unit: '%', p, l, heat,
          sol: R`Photon energy $\propto1/\lambda$, so one laser photon carries $${p}/${l} = ${round(p / l, 4)}$ of a pump photon's energy. ${heat ? R`The remainder, $1 - ${round(p / l, 4)} = ${round(1 - p / l, 4)}$, i.e. $${round(f, 1)}\%$, becomes heat.` : R`At most $${round(f, 1)}\%$ of the pump power can come out as laser light.`}`,
          trap: 'Photon energy goes as 1/wavelength: the longer laser wavelength carries less energy.' };
      },
      verify: (p) => (p.heat ? (1 - p.p / p.l) * 100 : (p.p / p.l) * 100) },
    { id: 'lsr-r4g2', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'saturation',
      make(r) {
        const [name, lam, s, t] = choose(r, SAT);
        const I = isat(lam, s, t);
        const e = Math.floor(Math.log10(I)), m = I / 10 ** e;
        return { q: R`For ${name} at $${lam}$ nm, take $\sigma = ${+(s / 10 ** Math.floor(Math.log10(s))).toFixed(1)}\times10^{${Math.floor(Math.log10(s))}}$ m$^2$ and upper-level lifetime $\tau = ${t >= 1e-3 ? `${+(t * 1e3).toPrecision(3)}` : t >= 1e-6 ? `${+(t * 1e6).toPrecision(3)}` : `${+(t * 1e9).toPrecision(3)}`}$ ${t >= 1e-3 ? 'ms' : t >= 1e-6 ? R`$\mu$s` : 'ns'}. The saturation intensity $I_\text{sat} = h\nu/(\sigma\tau)$ is ______ $\times10^{${e}}$ W/m$^2$ (three significant figures).`,
          answer: +m.toPrecision(3), tol: +(m * 0.01).toPrecision(2), lam, s, t, e,
          sol: R`$h\nu = hc/\lambda = ${+(H * CL / (lam * 1e-9) * 1e19).toPrecision(4)}\times10^{-19}$ J. $\sigma\tau = ${+(s * t / 10 ** Math.floor(Math.log10(s * t))).toPrecision(3)}\times10^{${Math.floor(Math.log10(s * t))}}$ m$^2$ s. $I_\text{sat} = ${+m.toPrecision(3)}\times10^{${e}}$ W/m$^2$. Media with small $\sigma\tau$ (dyes) need far higher intensity to saturate than storage media such as Nd or Er.`,
          trap: 'Keep the lifetime in seconds and the cross section in square metres.' };
      },
      verify: (p) => isat(p.lam, p.s, p.t) / 10 ** p.e },
    { id: 'lsr-r4g3', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'degeneracy',
      make(r) {
        const g1 = int(r, 1, 5), g2 = int(r, 1, 5);
        let k = pick(r, 0.3, 4, 0.1);
        if (Math.abs(k - g2 / g1) < 0.05) k = round(k + 0.2, 1);
        const amp = k / g2 > 1 / g1;
        const opts = [R`amplified, because $N_2/g_2 > N_1/g_1$`, R`absorbed, because $N_2/g_2 < N_1/g_1$`,
          k > 1 ? R`amplified, because $N_2 > N_1$, whatever the degeneracies` : R`absorbed, because $N_2 < N_1$, whatever the degeneracies`, R`neither: stimulated emission and absorption always cancel`];
        const o = mcqOptions(r, opts[amp ? 0 : 1], opts.filter((_, i) => i !== (amp ? 0 : 1)), (v) => v);
        return { q: R`A transition has lower-level degeneracy $g_1 = ${g1}$ and upper-level degeneracy $g_2 = ${g2}$, with populations $N_2 = ${k}N_1$. A weak beam at this frequency is`,
          ...o,
          sol: R`Net gain $\propto N_2 - (g_2/g_1)N_1 = (${k} - ${round(g2 / g1, 3)})N_1$. Equivalently compare per-state populations: $N_2/g_2 = ${round(k / g2, 3)}N_1$ and $N_1/g_1 = ${round(1 / g1, 3)}N_1$. ${amp ? 'The upper states are more populated per state, so the beam is amplified.' : 'The lower states are more populated per state, so the beam is absorbed.'}`,
          trap: 'Inversion is about population per state, N/g, not total population.' };
      } },
  ],
};
