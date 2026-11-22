import { pick, int, choose, fmt, shuffleOpts, numOpts } from '../_entrance.js';

const r = String.raw;
const EXB = {
  1: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  2: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'],
  3: ['jee-main', 'neet', 'keam', 'comedk'],
  4: ['jee-main', 'jee-adv', 'neet'],
  5: ['jee-adv'],
};
const exFor = (level, type) => (type === 'mcq' && level <= 3 ? [...EXB[level], 'cuet'] : EXB[level]);
const S = (x, sig = 3) => String(+Number(x).toPrecision(sig));
const N = (x, dp) => +x.toFixed(dp);
const PI = Math.PI; const SQ2 = Math.SQRT2;
const H = 6.63e-34; const C0 = 3e8; const QE = 1.6e-19; const ME = 9.1e-31; const MP = 1.67e-27; const MN = 1.675e-27; const MA = 6.64e-27; const KB = 1.38e-23;
const HC = 1240; // eV nm
const lamE = (nm) => HC / nm; // photon energy in eV
const TL = (a, dp) => Math.max(0.5 * 10 ** -dp, Math.abs(a) * 0.01);
let k = 0; let c = 0;
const nid = () => `dn-${String(++k).padStart(3, '0')}`;
const base = (level, sub, o) => ({ id: nid(), level, exams: exFor(level, o.type), sub, ...o });
const mcq = (level, sub, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 1) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return base(level, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o });
};
const nat = (level, sub, q, value, tol, dp, sol, o = {}) => {
  const answer = +value.toFixed(dp);
  return base(level, sub, { type: 'nat', format: tol === 0 ? 'integer' : 'numeric', q, answer, tol, calc: () => answer, sol, ...o });
};
const msq = (level, sub, q, options, answer, sol, o = {}) =>
  base(level, sub, { type: 'msq', format: 'multi', q, options, answer, sol, ...o });
const AOPT = [
  'Both A and R are true and R is the correct explanation of A',
  'Both A and R are true but R is not the correct explanation of A',
  'A is true but R is false',
  'A is false but R is true',
];
const asrt = (level, sub, A, R, answer, sol, o = {}) =>
  base(level, sub, { type: 'mcq', format: 'assertion', q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: AOPT, answer, sol, ...o });
const SOPT = [
  'Both Statement I and Statement II are true',
  'Both Statement I and Statement II are false',
  'Statement I is true but Statement II is false',
  'Statement I is false but Statement II is true',
];
const stm = (level, sub, I, II, answer, sol, o = {}) =>
  base(level, sub, { type: 'mcq', format: 'statements', q: `<b>Statement I:</b> ${I}<br><b>Statement II:</b> ${II}`, options: SOPT, answer, sol, ...o });
const cnt = (level, sub, q, list, n, sol, o = {}) => {
  const opts = ['Only one', 'Only two', 'Only three', 'All four'];
  return base(level, sub, { type: 'mcq', format: 'statements', q: `${q}<br>${list.map((s, i) => `(${i + 1}) ${s}`).join('<br>')}`, options: opts, answer: n - 1, sol, ...o });
};
const mat = (level, sub, group, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 2) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return { id: nid(), type: 'mcq', level, format: 'match', exams: exFor(level, 'mcq'), sub, group, q, options, answer: pos, sol, ...o };
};
const pas = (level, sub, group, q, value, tol, dp, sol, o = {}) => {
  const answer = +value.toFixed(dp);
  return { id: nid(), type: 'nat', level, format: 'passage', exams: exFor(level, 'nat'), sub, group, q, answer, tol, calc: () => answer, sol, ...o };
};
const pasm = (level, sub, group, q, correct, wrongs, sol, o = {}) => {
  const pos = (c++ * 3 + 1) % 4; const options = [...wrongs]; options.splice(pos, 0, correct);
  return { id: nid(), type: 'mcq', level, format: 'passage', exams: exFor(level, 'mcq'), sub, group, q, options, answer: pos, sol, ...o };
};
const items = [
  // ---------- Level 1 ----------
  mcq(1, 'Einstein equation', r`Einstein's photoelectric equation, in terms of the frequency $f$ of the light and the work function $\phi$, is`, r`$K_{max} = hf - \phi$`, [r`$K_{max} = hf + \phi$`, r`$K_{max} = \phi - hf$`, r`$K_{max} = h/f - \phi$`],
    r`One photon gives all its energy $hf$ to one electron. Part of it, $\phi$, is spent in leaving the metal; the rest is the maximum kinetic energy. So $K_{max} = hf - \phi$.`),
  nat(1, 'photon energy', r`Find the energy of a photon of wavelength 500 nm (in eV, 2 decimals). Use $hc = 1240$ eV nm.`, lamE(500), 0.01, 2,
    r`$E = \dfrac{hc}{\lambda} = \dfrac{1240}{500} = 2.48$ eV.`, { unit: 'eV' }),
  mcq(1, 'nature of light', r`The photoelectric effect gives evidence for the`, 'particle nature of light', ['wave nature of light', 'wave nature of electrons', 'nuclear structure of the atom'],
    r`Light must come in packets (photons) of energy $hf$, each ejecting one electron at once. The wave theory could not explain the threshold frequency and the instant emission.`),
  mcq(1, 'work function', r`The work function of a metal is`, 'the minimum energy needed to remove an electron from its surface', ['the maximum kinetic energy of the emitted electrons', 'the energy of the incident photon', 'the stopping potential in volts'],
    r`Electrons are bound to the metal. $\phi$ is the least energy that frees the most loosely held electron. The photon energy beyond that becomes kinetic energy.`),
  nat(1, 'threshold frequency', r`The work function of a metal is 2.07 eV. Find its threshold frequency (in units of $10^{14}$ Hz, 2 decimals). Use $h = 6.63\times10^{-34}$ J s and $e = 1.6\times10^{-19}$ C.`, 2.07 * QE / H / 1e14, 0.05, 2,
    r`$f_0 = \dfrac{\phi}{h} = \dfrac{2.07\times1.6\times10^{-19}}{6.63\times10^{-34}} = 4.99\times10^{14}$ Hz, i.e. 5.00 in these units.`, { unit: '×10¹⁴ Hz' }),
  mcq(1, 'stopping potential', r`The stopping potential in a photoelectric experiment is`, 'the reverse voltage that just stops the fastest photoelectrons reaching the collector', ['the voltage that gives the largest photocurrent', 'the voltage at which the first photoelectron is emitted', 'the potential of the light source'],
    r`With the collector made negative, photoelectrons are slowed down. At the stopping potential $V_s$ even the fastest one is turned back: $eV_s = K_{max}$.`),
  nat(1, 'maximum kinetic energy', r`A photon of energy 3.5 eV falls on a metal of work function 2.0 eV. Find the maximum kinetic energy of the photoelectrons (in eV, 1 decimal).`, 1.5, 0.05, 1,
    r`$K_{max} = E - \phi = 3.5 - 2.0 = 1.5$ eV.`, { unit: 'eV' }),
  mcq(1, 'de Broglie', r`The de Broglie wavelength of a particle of momentum $p$ is`, r`$h/p$`, [r`$hp$`, r`$p/h$`, r`$h/p^2$`],
    r`De Broglie said every moving particle has a wave of wavelength $\lambda = h/p = h/mv$. Heavy, slow things have tiny wavelengths.`),
  nat(1, 'electron wavelength', r`An electron is accelerated from rest through 100 V. Find its de Broglie wavelength (in angstrom, 2 decimals). Use $\lambda = \dfrac{12.27}{\sqrt V}$ Å.`, 12.27 / 10, 0.02, 2,
    r`$\lambda = \dfrac{12.27}{\sqrt{100}} = 1.227$ Å $= 0.1227$ nm, comparable to the spacing of atoms in a crystal.`, { unit: 'Å' }),
  mcq(1, 'Davisson-Germer', r`The Davisson-Germer experiment demonstrated`, 'the wave nature of electrons (diffraction by a nickel crystal)', ['the photoelectric effect', 'the quantisation of charge', 'the existence of the neutron'],
    r`A beam of 54 eV electrons scattered from a nickel crystal showed a strong peak at $50^\circ$, as for X-ray diffraction, matching the de Broglie wavelength.`),
  mcq(1, 'photon', r`The rest mass of a photon is`, 'zero', [r`$h/c$`, r`$hf/c^2$`, r`$9.1\times10^{-31}$ kg`],
    r`A photon always moves at $c$, so it has no rest frame. Its energy is $hf$ and its momentum $hf/c$. The mass $hf/c^2$ is the equivalent mass of its energy, not a rest mass.`, { trap: 'Photon mass-equivalent is not rest mass.' }),
  mcq(1, 'photon momentum', r`The momentum of a photon of wavelength $\lambda$ is`, r`$h/\lambda$`, [r`$h\lambda$`, r`$hc/\lambda$`, r`$\lambda/h$`],
    r`$p = E/c = hf/c = h/\lambda$. ($hc/\lambda$ is the energy, not the momentum.)`),
  mcq(1, 'intensity and photocurrent', r`In a photoelectric experiment, with the frequency fixed above the threshold, the saturation photocurrent is`, 'proportional to the intensity of the light', ['independent of the intensity', 'inversely proportional to the intensity', 'proportional to the square of the stopping potential'],
    r`More intensity means more photons per second, hence more photoelectrons per second, hence a larger saturation current. The maximum kinetic energy does not change.`),
  mcq(1, 'time lag', r`Photoelectric emission from a metal, once the light is above threshold frequency, begins`, 'almost instantly, even with very dim light', ['only after the metal has absorbed enough energy over several seconds', 'after a delay that grows as the intensity falls', 'only after the metal is heated'],
    r`The delay is less than about $10^{-9}$ s. A single photon hands its energy to a single electron at once, so no build-up time is needed. The wave theory predicted a long delay for dim light.`),
  nat(1, 'wavelength of one eV', r`Find the wavelength of a photon of energy 1 eV (in nm). Use $hc = 1240$ eV nm.`, 1240, 0, 0,
    r`$\lambda = hc/E = 1240/1 = 1240$ nm, in the infrared.`, { unit: 'nm' }),
  mcq(1, 'stopping potential and intensity', r`If the intensity of the light falling on a photocell is doubled at the same frequency, the stopping potential`, 'stays the same', ['doubles', 'becomes half', 'becomes four times'],
    r`$eV_s = hf - \phi$ depends only on the frequency and the metal, not on the intensity.`),
  mcq(1, 'unit of h', r`The SI unit of Planck's constant is`, 'J s', [r`J s$^{-1}$`, 'J m', r`kg m s$^{-1}$`],
    r`$E = hf$, so $h = E/f$ has unit J per hertz $=$ J s. The same as the unit of angular momentum.`),
  nat(1, 'frequency of light', r`Find the frequency of light of wavelength 600 nm (in units of $10^{14}$ Hz). Use $c = 3\times10^8\ \mathrm{m\,s^{-1}}$.`, C0 / 600e-9 / 1e14, 0.01, 2,
    r`$f = c/\lambda = \dfrac{3\times10^8}{600\times10^{-9}} = 5.0\times10^{14}$ Hz.`, { unit: '×10¹⁴ Hz' }),
  mcq(1, 'below threshold', r`Light of frequency below the threshold frequency falls on a metal. Increasing its intensity a thousand times will`, 'still not release any photoelectron', ['release electrons with a small kinetic energy', 'release electrons only after a few minutes', 'release many electrons at rest'],
    r`Each electron absorbs one photon. If one photon cannot supply $\phi$, nothing is emitted, however many photons arrive.`),
  mcq(1, 'matter waves', r`An electron and a proton move with the same speed. The de Broglie wavelength is`, 'longer for the electron', ['longer for the proton', 'the same for both', 'zero for the proton'],
    r`$\lambda = h/mv$. Same $v$, smaller mass gives a larger $\lambda$. The electron is about 1836 times lighter, so its wavelength is about 1836 times longer.`),
  nat(1, 'photon energy in eV', r`Find the energy of a photon of frequency $6\times10^{14}$ Hz (in eV, 2 decimals). Use $h = 6.63\times10^{-34}$ J s and $e = 1.6\times10^{-19}$ C.`, 6e14 * H / QE, 0.02, 2,
    r`$E = hf = 6.63\times10^{-34}\times6\times10^{14} = 3.98\times10^{-19}$ J. In eV: $3.98\times10^{-19}/1.6\times10^{-19} = 2.49$ eV.`, { unit: 'eV' }),
  // ---------- Level 2 ----------
  nat(2, 'photoelectric equation', r`Light of wavelength 300 nm falls on a metal of work function 2.3 eV. Find the maximum kinetic energy of the photoelectrons (in eV, 2 decimals). Use $hc = 1240$ eV nm.`, lamE(300) - 2.3, 0.01, 2,
    r`$E = 1240/300 = 4.133$ eV. $K_{max} = E - \phi = 4.133 - 2.3 = 1.83$ eV.`, { unit: 'eV' }),
  nat(2, 'stopping potential', r`For the same set-up (300 nm light, work function 2.3 eV), find the stopping potential (in V, 2 decimals).`, lamE(300) - 2.3, 0.01, 2,
    r`$eV_s = K_{max} = 1.83$ eV, so $V_s = 1.83$ V. (A kinetic energy of $x$ eV needs a stopping potential of $x$ volts.)`, { unit: 'V' }),
  nat(2, 'threshold wavelength', r`The work function of a metal is 2.5 eV. Find its threshold wavelength (in nm). Use $hc = 1240$ eV nm.`, 1240 / 2.5, 0.5, 0,
    r`$\lambda_0 = hc/\phi = 1240/2.5 = 496$ nm. Light of longer wavelength cannot eject electrons.`, { unit: 'nm' }),
  nat(2, 'low kinetic energy', r`Light of wavelength 250 nm falls on a metal of work function 4.7 eV. Find the stopping potential (in V, 2 decimals). Use $hc = 1240$ eV nm.`, lamE(250) - 4.7, 0.01, 2,
    r`$E = 1240/250 = 4.96$ eV. $eV_s = 4.96 - 4.7 = 0.26$ eV, so $V_s = 0.26$ V.`, { unit: 'V' }),
  nat(2, 'speed of photoelectrons', r`Photoelectrons are emitted with a maximum kinetic energy of 2 eV. Find their maximum speed (in units of $10^5\ \mathrm{m\,s^{-1}}$, 2 decimals). Use $m = 9.1\times10^{-31}$ kg.`, Math.sqrt(2 * 2 * QE / ME) / 1e5, 0.04, 2,
    r`$K = 2\times1.6\times10^{-19} = 3.2\times10^{-19}$ J. $v = \sqrt{2K/m} = \sqrt{\dfrac{6.4\times10^{-19}}{9.1\times10^{-31}}} = 8.39\times10^5\ \mathrm{m\,s^{-1}}$.`, { unit: '×10⁵ m/s' }),
  nat(2, 'photons per second', r`A laser of power 5 mW emits light of wavelength 633 nm. Find the number of photons emitted per second (in units of $10^{16}$, 2 decimals). Use $h = 6.63\times10^{-34}$ J s, $c = 3\times10^8$ m/s.`, 5e-3 * 633e-9 / (H * C0) / 1e16, 0.02, 2,
    r`Energy per photon $= hc/\lambda = \dfrac{6.63\times10^{-34}\times3\times10^8}{633\times10^{-9}} = 3.14\times10^{-19}$ J. Photons per second $= P/E = \dfrac{5\times10^{-3}}{3.14\times10^{-19}} = 1.59\times10^{16}$.`, { unit: '×10¹⁶ /s' }),
  nat(2, 'photon momentum', r`Find the momentum of a photon of wavelength 400 nm (in units of $10^{-27}\ \mathrm{kg\,m\,s^{-1}}$, 2 decimals). Use $h = 6.63\times10^{-34}$ J s.`, H / 400e-9 / 1e-27, 0.02, 2,
    r`$p = h/\lambda = \dfrac{6.63\times10^{-34}}{4\times10^{-7}} = 1.66\times10^{-27}\ \mathrm{kg\,m\,s^{-1}}$.`, { unit: '×10⁻²⁷ kg m/s' }),
  nat(2, 'radiation pressure', r`Sunlight of intensity $1500\ \mathrm{W\,m^{-2}}$ falls normally on a perfectly absorbing surface. Find the radiation pressure (in $\mu$Pa). Use $c = 3\times10^8$ m/s.`, 1500 / C0 * 1e6, 0.05, 2,
    r`For a perfect absorber $P = I/c = \dfrac{1500}{3\times10^8} = 5\times10^{-6}$ Pa $= 5.00\ \mu$Pa.`, { unit: 'μPa' }),
  nat(2, 'pressure on a mirror', r`The same sunlight (1500 W/m²) falls normally on a perfectly reflecting mirror. Find the radiation pressure (in $\mu$Pa).`, 2 * 1500 / C0 * 1e6, 0.05, 2,
    r`Each photon bounces back, so the momentum change is $2p$, double that for absorption: $P = 2I/c = 2\times5\ \mu\mathrm{Pa} = 10.0\ \mu$Pa.`, { unit: 'μPa', trap: 'Reflection doubles the pressure.' }),
  nat(2, 'force by light', r`Light of intensity $1500\ \mathrm{W\,m^{-2}}$ falls normally on a perfectly absorbing plate of area $2\ \mathrm{m^2}$. Find the force on it (in $\mu$N).`, 1500 / C0 * 2 * 1e6, 0.05, 1,
    r`$F = PA = \dfrac{I}{c}A = 5\times10^{-6}\times2 = 1.0\times10^{-5}$ N $= 10.0\ \mu$N.`, { unit: 'μN' }),
  nat(2, 'electron wavelength', r`Find the de Broglie wavelength of an electron accelerated from rest through 150 V (in Å, 2 decimals). Use $\lambda = \dfrac{12.27}{\sqrt V}$ Å.`, 12.27 / Math.sqrt(150), 0.02, 2,
    r`$\lambda = \dfrac{12.27}{\sqrt{150}} = \dfrac{12.27}{12.25} = 1.00$ Å.`, { unit: 'Å' }),
  nat(2, 'proton wavelength', r`Find the de Broglie wavelength of a proton of kinetic energy 1 keV (in pm, 2 decimals). Use $m_p = 1.67\times10^{-27}$ kg, $h = 6.63\times10^{-34}$ J s.`, H / Math.sqrt(2 * MP * 1e3 * QE) * 1e12, 0.01, 2,
    r`$p = \sqrt{2mK} = \sqrt{2\times1.67\times10^{-27}\times1.6\times10^{-16}} = 7.31\times10^{-22}$ kg m/s. $\lambda = h/p = \dfrac{6.63\times10^{-34}}{7.31\times10^{-22}} = 9.07\times10^{-13}$ m $= 0.91$ pm.`, { unit: 'pm' }),
  nat(2, 'moving electron', r`An electron moves at $1\times10^6\ \mathrm{m\,s^{-1}}$. Find its de Broglie wavelength (in Å, 2 decimals). Use $m = 9.1\times10^{-31}$ kg.`, H / (ME * 1e6) * 1e10, 0.03, 2,
    r`$\lambda = \dfrac{h}{mv} = \dfrac{6.63\times10^{-34}}{9.1\times10^{-31}\times10^6} = 7.29\times10^{-10}$ m $= 7.29$ Å.`, { unit: 'Å' }),
  nat(2, 'a cricket ball', r`A ball of mass 0.1 kg moves at $10\ \mathrm{m\,s^{-1}}$. Find its de Broglie wavelength (in units of $10^{-34}$ m, 2 decimals).`, H / (0.1 * 10) / 1e-34, 0.01, 2,
    r`$\lambda = h/mv = \dfrac{6.63\times10^{-34}}{1} = 6.63\times10^{-34}$ m. It is far too small to show any wave effect, which is why we never see matter waves for everyday objects.`, { unit: '×10⁻³⁴ m' }),
  nat(2, 'Davisson-Germer', r`In a Davisson-Germer type experiment, electrons of 54 eV are scattered from a nickel crystal whose surface atoms are 2.15 Å apart. The first-order peak is at an angle $\phi = 50^\circ$ from the incident direction. Find the wavelength from $\lambda = d\sin\phi$ (in Å, 2 decimals).`, 2.15 * Math.sin(50 * PI / 180), 0.01, 2,
    r`$\lambda = d\sin\phi = 2.15\times\sin50^\circ = 2.15\times0.766 = 1.65$ Å. De Broglie: $12.27/\sqrt{54} = 1.67$ Å. The two agree to within 1 %.`, { unit: 'Å' }),
  nat(2, 'accelerating voltage', r`Through what potential difference must an electron be accelerated to have a de Broglie wavelength of 1 Å (in V, nearest whole number)? Use $\lambda = \dfrac{12.27}{\sqrt V}$ Å.`, (12.27 / 1) ** 2, 2, 0,
    r`$\sqrt V = 12.27/1$, so $V = 12.27^2 = 150.6 \approx 151$ V.`, { unit: 'V' }),
  nat(2, 'X-ray photon', r`Find the energy of an X-ray photon of wavelength 0.1 nm (in keV, 1 decimal). Use $hc = 1240$ eV nm.`, 12.4, 0.05, 1,
    r`$E = 1240/0.1 = 12\,400$ eV $= 12.4$ keV.`, { unit: 'keV' }),
  nat(2, 'power of a beam', r`A beam delivers $10^{18}$ photons per second, each of energy 2 eV. Find the power of the beam (in W, 2 decimals).`, 1e18 * 2 * QE, 0.005, 2,
    r`$P = N\times E = 10^{18}\times2\times1.6\times10^{-19} = 0.32$ W.`, { unit: 'W' }),
  nat(2, 'alpha particle', r`An alpha particle is accelerated from rest through 100 V. Find its de Broglie wavelength (in pm, 2 decimals). Use $m_\alpha = 6.64\times10^{-27}$ kg, charge $2e$.`, H / Math.sqrt(2 * MA * 2 * QE * 100) * 1e12, 0.02, 2,
    r`$K = qV = 2\times1.6\times10^{-19}\times100 = 3.2\times10^{-17}$ J. $p = \sqrt{2mK} = \sqrt{2\times6.64\times10^{-27}\times3.2\times10^{-17}} = 6.52\times10^{-22}$. $\lambda = 6.63\times10^{-34}/6.52\times10^{-22} = 1.02$ pm.`, { unit: 'pm', trap: 'The alpha particle has charge 2e, so its kinetic energy is 2eV.' }),
  nat(2, 'thermal neutron', r`Find the de Broglie wavelength of a thermal neutron at 300 K, taking $K = \tfrac32k_BT$ (in Å, 2 decimals). Use $m_n = 1.675\times10^{-27}$ kg, $k_B = 1.38\times10^{-23}$ J/K.`, H / Math.sqrt(3 * MN * KB * 300) * 1e10, 0.02, 2,
    r`$\lambda = \dfrac{h}{\sqrt{2mK}} = \dfrac{h}{\sqrt{3mk_BT}} = \dfrac{6.63\times10^{-34}}{\sqrt{3\times1.675\times10^{-27}\times1.38\times10^{-23}\times300}} = 1.45$ Å, the size of an atomic spacing, so neutrons diffract from crystals.`, { unit: 'Å' }),
  nat(2, 'ratio of wavelengths', r`An electron and a proton have the same kinetic energy. Find the ratio $\lambda_e/\lambda_p$ (2 decimals). Use $m_p/m_e = 1836$.`, Math.sqrt(1836), 0.05, 2,
    r`$\lambda = h/\sqrt{2mK}\propto 1/\sqrt m$. So $\dfrac{\lambda_e}{\lambda_p} = \sqrt{\dfrac{m_p}{m_e}} = \sqrt{1836} = 42.85$.`, { trap: 'Same kinetic energy gives the square-root of the mass ratio, not the mass ratio.' }),
  nat(2, 'photocurrent', r`A beam sends $10^{15}$ photons per second on to a metal and 10 % of the photons each liberate one electron, all collected. Find the saturation current (in $\mu$A, 1 decimal).`, 1e15 * 0.1 * QE * 1e6, 0.05, 1,
    r`Electrons per second $= 0.1\times10^{15} = 10^{14}$. $I = Ne = 10^{14}\times1.6\times10^{-19} = 1.6\times10^{-5}$ A $= 16.0\ \mu$A.`, { unit: 'μA' }),
  nat(2, 'work function from threshold', r`The threshold frequency of a metal is $1\times10^{15}$ Hz. Find its work function (in eV, 2 decimals). Use $h = 6.63\times10^{-34}$ J s and $e = 1.6\times10^{-19}$ C.`, H * 1e15 / QE, 0.02, 2,
    r`$\phi = hf_0 = 6.63\times10^{-34}\times10^{15} = 6.63\times10^{-19}$ J $= 4.14$ eV.`, { unit: 'eV' }),
  mcq(2, 'effect of frequency', r`In the photoelectric effect, if the frequency of the incident light is increased while the intensity (energy per second) is kept constant, the maximum kinetic energy of the photoelectrons`, 'increases', ['decreases', 'stays the same', 'first increases then decreases'],
    r`$K_{max} = hf - \phi$ rises with $f$. (The number of photons per second would fall since each carries more energy, so the saturation current would fall.)`),
  mcq(2, 'effect of wavelength', r`Photoelectrons are emitted when light of wavelength $\lambda$ falls on a metal. If the wavelength is halved (still above threshold), the maximum kinetic energy becomes`, 'more than double the earlier value', ['exactly double', 'exactly half', 'unchanged'],
    r`$K_{max} = hc/\lambda - \phi$. Halving $\lambda$ doubles $hc/\lambda$, giving $K' = 2hc/\lambda - \phi = 2K + \phi > 2K$.`, { trap: 'K is not proportional to frequency: the work function is subtracted.' }),
  mcq(2, 'graph', r`In a plot of stopping potential against frequency of the incident light, the slope of the straight line is`, r`$h/e$`, [r`$e/h$`, r`$h$`, r`$\phi/e$`],
    r`$V_s = \dfrac{h}{e}f - \dfrac{\phi}{e}$. The slope is $h/e$ for every metal. It is the same for all metals, and the intercept on the voltage axis is $-\phi/e$.`),
  mcq(2, 'photon number', r`Two beams of light, red and blue, have the same power. The beam with more photons per second is`, 'red', ['blue', 'both have the same number', 'it depends on the intensity only'],
    r`$N = P/hf$. For equal power, the smaller photon energy (red) gives more photons per second.`),
  mcq(2, 'work function and wavelength', r`A metal has a work function of 3.0 eV. Which light can release electrons from it? ($hc = 1240$ eV nm)`, r`ultraviolet of 300 nm`, [r`red light of 700 nm`, r`green light of 530 nm`, r`infrared of 1000 nm`],
    r`The threshold wavelength is $1240/3.0 = 413$ nm. Only light with $\lambda < 413$ nm works: 300 nm (4.13 eV) does; 530, 700 and 1000 nm (2.34, 1.77, 1.24 eV) do not.`),
  mcq(2, 'wave theory failure', r`Which observation could NOT be explained by the wave theory of light?`, 'a threshold frequency below which there is no emission at any intensity', ['light bending around an obstacle', 'light interfering in Young\'s double slit experiment', 'light being polarised'],
    r`Interference, diffraction and polarisation are wave properties. The threshold frequency, the independence of $K_{max}$ from intensity, and instant emission all need photons.`),
  mcq(2, 'de Broglie and momentum', r`When the momentum of a particle is doubled, its de Broglie wavelength`, 'becomes half', ['doubles', 'becomes four times', 'is unchanged'],
    r`$\lambda = h/p$, so $\lambda\propto1/p$.`),
  mcq(2, 'de Broglie and voltage', r`An electron is accelerated through $V$ volts and has wavelength $\lambda$. If it is accelerated through $4V$ volts instead, its wavelength becomes`, r`$\lambda/2$`, [r`$2\lambda$`, r`$\lambda/4$`, r`$4\lambda$`],
    r`$\lambda = \dfrac{h}{\sqrt{2meV}}\propto V^{-1/2}$. Four times the voltage halves the wavelength.`),
  mcq(2, 'photon energy and wavelength', r`The energy of a photon is 3.1 eV. It corresponds to light of wavelength about ($hc = 1240$ eV nm)`, '400 nm', ['4000 nm', '40 nm', '2400 nm'],
    r`$\lambda = 1240/3.1 = 400$ nm, in the violet.`),
  // ---------- Level 3 ----------
  nat(3, 'Planck constant from data', r`In a photoelectric experiment the stopping potential is 0.48 V for light of frequency $6.0\times10^{14}$ Hz and 1.31 V for $8.0\times10^{14}$ Hz. Find Planck's constant (in units of $10^{-34}$ J s, 2 decimals). Use $e = 1.6\times10^{-19}$ C.`, QE * 0.83 / 2e14 / 1e-34, 0.1, 2,
    r`$V_s = \dfrac{h}{e}f - \dfrac{\phi}{e}$, so the slope $\dfrac{\Delta V_s}{\Delta f} = \dfrac{h}{e}$. $h = e\,\dfrac{1.31 - 0.48}{(8.0 - 6.0)\times10^{14}} = 1.6\times10^{-19}\times\dfrac{0.83}{2\times10^{14}} = 6.64\times10^{-34}$ J s.`, { unit: '×10⁻³⁴ J s', trap: 'Use the slope between two points, not V divided by f.' }),
  nat(3, 'work function from the graph', r`The graph of stopping potential against frequency for a metal cuts the frequency axis at $5.0\times10^{14}$ Hz. Find the work function (in eV, 2 decimals). Use $h = 6.63\times10^{-34}$ J s, $e = 1.6\times10^{-19}$ C.`, H * 5e14 / QE, 0.03, 2,
    r`$V_s = 0$ when $hf = \phi$, so the intercept on the frequency axis is the threshold frequency. $\phi = hf_0 = 6.63\times10^{-34}\times5\times10^{14} = 3.315\times10^{-19}$ J $= 2.07$ eV.`, { unit: 'eV' }),
  nat(3, 'doubling the frequency', r`Light of photon energy 5 eV gives a stopping potential of 2 V on a metal. If the frequency of the light is doubled, find the new stopping potential (in V).`, 7, 0, 0,
    r`$\phi = 5 - 2 = 3$ eV. With the frequency doubled the photon energy is 10 eV, so $eV_s = 10 - 3 = 7$ eV and $V_s = 7$ V (not 4 V).`, { unit: 'V', trap: 'Doubling the frequency does not double the stopping potential.' }),
  nat(3, 'two metals', r`The same light of photon energy 5 eV falls on two metals A and B of work functions 2 eV and 4 eV. Find the ratio of the maximum kinetic energies, $K_A/K_B$.`, 3, 0, 0,
    r`$K_A = 5 - 2 = 3$ eV and $K_B = 5 - 4 = 1$ eV. The ratio is 3.`, { trap: 'The ratio of kinetic energies is not the ratio of work functions.' }),
  nat(3, 'retarding potential', r`Photoelectrons are emitted with a maximum kinetic energy of 3 eV. A retarding potential of 2 V is applied to the collector. Find the maximum kinetic energy with which an electron reaches the collector (in eV).`, 1, 0, 0,
    r`Work done against the field is $eV = 2$ eV. $K = 3 - 2 = 1$ eV. (At 3 V the current would stop.)`, { unit: 'eV' }),
  nat(3, 'accelerating potential', r`Photoelectrons with a maximum kinetic energy of 1.5 eV are accelerated towards an anode that is 5 V positive with respect to the cathode. Find the maximum kinetic energy with which they hit the anode (in eV, 1 decimal).`, 6.5, 0.05, 1,
    r`Gain of energy $= eV = 5$ eV. $K = 1.5 + 5 = 6.5$ eV.`, { unit: 'eV' }),
  nat(3, 'oblique incidence', r`Light of intensity $3000\ \mathrm{W\,m^{-2}}$ falls on a perfectly absorbing surface at an angle of incidence of $60^\circ$ (measured from the normal). Find the radiation pressure, meaning the normal force per unit area (in $\mu$Pa, 2 decimals). Use $c = 3\times10^8$ m/s.`, 3000 / C0 * 0.25 * 1e6, 0.02, 2,
    r`The momentum arriving per second per unit surface area is $\dfrac{I\cos\theta}{c}$, and its normal component is $\dfrac{I\cos\theta}{c}\cos\theta$. $P = \dfrac{I\cos^2\theta}{c} = \dfrac{3000\times0.25}{3\times10^8} = 2.50\times10^{-6}$ Pa.`, { unit: 'μPa', trap: 'Two factors of cos(theta): one for the area, one for the normal component.' }),
  nat(3, 'force on an oblique mirror', r`Light of intensity $3000\ \mathrm{W\,m^{-2}}$ falls at $60^\circ$ to the normal on a perfectly reflecting mirror of area $0.5\ \mathrm{m^2}$. Find the force on the mirror (in $\mu$N, 2 decimals).`, 2 * 3000 * 0.5 * 0.25 / C0 * 1e6, 0.02, 2,
    r`Each photon's normal momentum reverses, so the force is along the normal: $F = \dfrac{2IA\cos^2\theta}{c} = \dfrac{2\times3000\times0.5\times0.25}{3\times10^8} = 2.5\times10^{-6}$ N $= 2.50\ \mu$N.`, { unit: 'μN' }),
  nat(3, 'laser on a mirror', r`A 3 W laser beam falls normally on a perfectly reflecting mirror. Find the force on the mirror (in nN). Use $c = 3\times10^8$ m/s.`, 2 * 3 / C0 * 1e9, 0.05, 1,
    r`Momentum flow in the beam per second $= P/c$. Reflection doubles the change: $F = 2P/c = \dfrac{2\times3}{3\times10^8} = 2.0\times10^{-8}$ N $= 20.0$ nN.`, { unit: 'nN' }),
  nat(3, 'photon and electron, same energy', r`A photon and an electron each have an energy of 100 eV (the electron's is kinetic). Find the ratio $\lambda_{photon}/\lambda_{electron}$ (nearest whole number). Use $\lambda_{ph} = 1240/E$ nm and $\lambda_e = 1.227/\sqrt{E}$ nm with $E$ in eV.`, (1240 / 100) / (1.227 / 10), 1, 0,
    r`$\lambda_{ph} = 1240/100 = 12.4$ nm. $\lambda_e = 1.227/10 = 0.1227$ nm. Ratio $= 12.4/0.1227 = 101$. At the same energy, the photon's wavelength is far longer.`),
  nat(3, 'neutrons at two temperatures', r`Thermal neutrons at 300 K are heated so that their temperature becomes 1200 K. By what factor does their de Broglie wavelength change, $\lambda_{300}/\lambda_{1200}$?`, 2, 0, 0,
    r`$\lambda = h/\sqrt{3mk_BT}\propto T^{-1/2}$. $\dfrac{\lambda_{300}}{\lambda_{1200}} = \sqrt{\dfrac{1200}{300}} = 2$.`),
  nat(3, 'proton and alpha', r`A proton and an alpha particle are accelerated through the same potential difference. Find the ratio of their de Broglie wavelengths, $\lambda_p/\lambda_\alpha$ (2 decimals). Take $m_\alpha = 4m_p$ and $q_\alpha = 2q_p$.`, Math.sqrt(8), 0.01, 2,
    r`$\lambda = \dfrac{h}{\sqrt{2mqV}}$. $\dfrac{\lambda_p}{\lambda_\alpha} = \sqrt{\dfrac{m_\alpha q_\alpha}{m_pq_p}} = \sqrt{4\times2} = 2.83$.`),
  nat(3, 'same wavelength', r`An electron and a proton have the same de Broglie wavelength. Find the ratio of their kinetic energies $K_e/K_p$. Use $m_p/m_e = 1836$.`, 1836, 0, 0,
    r`With $\lambda$ equal, $p$ is equal, and $K = p^2/2m$. So $K_e/K_p = m_p/m_e = 1836$.`, { trap: 'Same momentum gives K inversely proportional to mass.' }),
  nat(3, 'Bohr orbit and de Broglie', r`The electron in the $n = 2$ orbit of hydrogen is in a circular orbit of radius 2.116 Å. Using the condition that the orbit circumference holds a whole number of de Broglie wavelengths, find the wavelength (in Å, 2 decimals).`, 2 * PI * 2.116 / 2, 0.02, 2,
    r`$2\pi r = n\lambda$ gives $\lambda = \dfrac{2\pi\times2.116}{2} = 6.65$ Å. This standing-wave picture reproduces Bohr's rule $mvr = nh/2\pi$.`, { unit: 'Å' }),
  nat(3, 'electron microscope', r`An electron microscope uses electrons accelerated through 100 kV. Ignoring relativity, find their de Broglie wavelength (in pm, 2 decimals). Use $\lambda = 1.227/\sqrt V$ nm.`, 1.227 / Math.sqrt(1e5) * 1e3, 0.04, 2,
    r`$\lambda = \dfrac{1.227}{\sqrt{10^5}} = \dfrac{1.227}{316.2} = 3.88\times10^{-3}$ nm $= 3.88$ pm. Visible light of 500 nm is 100 000 times longer, so electrons resolve far finer detail.`, { unit: 'pm' }),
  nat(3, 'mass equivalent of a photon', r`Find the mass equivalent $h/(\lambda c)$ of a photon of wavelength 500 nm (in units of $10^{-36}$ kg, 2 decimals). Use $h = 6.63\times10^{-34}$ J s.`, H / (500e-9 * C0) / 1e-36, 0.02, 2,
    r`$m = \dfrac{E}{c^2} = \dfrac{h}{\lambda c} = \dfrac{6.63\times10^{-34}}{5\times10^{-7}\times3\times10^8} = 4.42\times10^{-36}$ kg. About $5\times10^{-6}$ of an electron's mass.`, { unit: '×10⁻³⁶ kg' }),
  nat(3, 'momentum of a 1 eV photon', r`Find the momentum of a photon of energy 1 eV (in units of $10^{-28}\ \mathrm{kg\,m\,s^{-1}}$, 2 decimals).`, QE / C0 / 1e-28, 0.02, 2,
    r`$p = E/c = \dfrac{1.6\times10^{-19}}{3\times10^8} = 5.33\times10^{-28}\ \mathrm{kg\,m\,s^{-1}}$.`, { unit: '×10⁻²⁸ kg m/s' }),
  nat(3, 'sensitivity of a photocell', r`A photocell has a quantum efficiency of 0.1 % at 400 nm (one electron per 1000 photons). Find the photocurrent when 1 W of such light falls on it (in $\mu$A, nearest whole number). Use $h = 6.63\times10^{-34}$ J s, $c = 3\times10^8$ m/s, $e = 1.6\times10^{-19}$ C.`, 1 * 400e-9 * QE * 1e-3 / (H * C0) * 1e6, 3, 0,
    r`Photons per second $= \dfrac{P\lambda}{hc} = \dfrac{1\times4\times10^{-7}}{6.63\times10^{-34}\times3\times10^8} = 2.01\times10^{18}$. Electrons per second $= 10^{-3}\times2.01\times10^{18} = 2.01\times10^{15}$. $I = Ne = 2.01\times10^{15}\times1.6\times10^{-19} = 3.2\times10^{-4}$ A $\approx 322\ \mu$A.`, { unit: 'μA' }),
  nat(3, 'distance and photocurrent', r`A point source is 10 cm from a photocell and the saturation current is 80 $\mu$A. The source is moved to 20 cm. Find the new saturation current (in $\mu$A).`, 20, 0, 0,
    r`The intensity falls as $1/d^2$, so with twice the distance it is a quarter. The number of photons per second falls to a quarter, and so does the saturation current: $80/4 = 20\ \mu$A. The stopping potential is unchanged.`, { unit: 'μA' }),
  nat(3, 'intensity from photon flux', r`A light beam carries $10^{20}$ photons per square metre per second, each of energy 2 eV. Find its intensity (in $\mathrm{W\,m^{-2}}$).`, 1e20 * 2 * QE, 0.05, 1,
    r`$I = \Phi E = 10^{20}\times2\times1.6\times10^{-19} = 32\ \mathrm{W\,m^{-2}}$.`, { unit: 'W/m²' }),
  nat(3, 'a bullet', r`A bullet of mass 10 g moves at $500\ \mathrm{m\,s^{-1}}$. Find its de Broglie wavelength (in units of $10^{-34}$ m, 2 decimals).`, H / (0.01 * 500) / 1e-34, 0.01, 2,
    r`$\lambda = \dfrac{h}{mv} = \dfrac{6.63\times10^{-34}}{0.01\times500} = 1.33\times10^{-34}$ m, about $10^{-24}$ times the size of a nucleus: no wave effects can ever be seen.`, { unit: '×10⁻³⁴ m' }),
  nat(3, 'energy of thermal neutrons', r`Find the average kinetic energy $\tfrac32k_BT$ of a thermal neutron at 300 K (in meV, 1 decimal). Use $k_B = 1.38\times10^{-23}$ J/K and $e = 1.6\times10^{-19}$ C.`, 1.5 * KB * 300 / QE * 1e3, 0.3, 1,
    r`$K = 1.5\times1.38\times10^{-23}\times300 = 6.21\times10^{-21}$ J $= 0.0388$ eV $= 38.8$ meV.`, { unit: 'meV' }),
  nat(3, 'neutron wavelength', r`Find the de Broglie wavelength of a neutron of kinetic energy 1 eV (in Å, 2 decimals). Use $m_n = 1.675\times10^{-27}$ kg.`, H / Math.sqrt(2 * MN * QE) * 1e10, 0.01, 2,
    r`$p = \sqrt{2mK} = \sqrt{2\times1.675\times10^{-27}\times1.6\times10^{-19}} = 2.315\times10^{-23}$. $\lambda = 6.63\times10^{-34}/2.315\times10^{-23} = 2.86\times10^{-11}$ m $= 0.29$ Å.`, { unit: 'Å' }),
  nat(3, 'energy conversion efficiency', r`Light of wavelength 400 nm falls on a metal of work function 2.28 eV. What percentage of the photon's energy becomes the maximum kinetic energy of the photoelectron (1 decimal)? Use $hc = 1240$ eV nm.`, (lamE(400) - 2.28) / lamE(400) * 100, 0.1, 1,
    r`$E = 1240/400 = 3.10$ eV. $K = 3.10 - 2.28 = 0.82$ eV. Fraction $= 0.82/3.10 = 26.5$ %.`, { unit: '%' }),
  nat(3, 'radio photons', r`A radio station radiates 1000 W at 880 kHz. Find the number of photons emitted per second (in units of $10^{30}$, 2 decimals). Use $h = 6.63\times10^{-34}$ J s.`, 1000 / (H * 8.8e5) / 1e30, 0.02, 2,
    r`$E = hf = 6.63\times10^{-34}\times8.8\times10^5 = 5.83\times10^{-28}$ J. $N = P/E = 1000/5.83\times10^{-28} = 1.71\times10^{30}$ per second. So many that the radiation seems perfectly continuous.`, { unit: '×10³⁰ /s' }),
  mcq(3, 'which metal emits', r`Light of wavelength 450 nm ($hc = 1240$ eV nm) falls on three metals: sodium ($\phi = 2.3$ eV), copper ($\phi = 4.7$ eV) and caesium ($\phi = 2.1$ eV). Photoelectrons are emitted from`, 'sodium and caesium only', ['copper only', 'all three metals', 'caesium only'],
    r`$E = 1240/450 = 2.76$ eV. It exceeds 2.3 eV and 2.1 eV, so Na and Cs emit. It is below 4.7 eV, so copper does not.`),
  mcq(3, 'photoelectron speeds', r`When monochromatic light of frequency above threshold falls on a metal, the emitted electrons have`, r`speeds from zero up to a maximum value`, ['all the same speed', 'speeds above the maximum only', 'speeds proportional to the intensity'],
    r`Electrons deep in the metal lose energy on the way out, so only the surface ones come out with $K_{max} = hf - \phi$. The others have less energy. The maximum is fixed by the frequency.`),
  mcq(3, 'same wavelength', r`An electron and a photon have the same wavelength of 1 Å. Which has the greater energy?`, 'the photon (12.4 keV against 150 eV)', ['the electron', 'both have the same energy', 'it depends on the metal'],
    r`Photon: $E = hc/\lambda = 12.4$ keV. Electron: $K = \dfrac{h^2}{2m\lambda^2} = \dfrac{150}{1}$ eV. The photon's energy is $pc$, while the electron's is $p^2/2m = pv/2$ with $v\ll c$.`),
  mcq(3, 'K-f graph', r`In a plot of the maximum kinetic energy of photoelectrons against the frequency of the light, a straight line is obtained. Which statement is correct?`, r`The slope is $h$ and the intercept on the energy axis is $-\phi$.`, [r`The slope is $h/e$ and the intercept on the frequency axis is $\phi$.`, r`The slope is $\phi$ and the line passes through the origin.`, r`The slope depends on the metal used.`],
    r`$K_{max} = hf - \phi$. A line with slope $h$ (the same for all metals) and intercept $-\phi$ on the energy axis. The intercept on the frequency axis is $\phi/h$.`),
  mcq(3, 'different metals graph', r`Stopping potential is plotted against frequency for two metals A and B, with $\phi_A < \phi_B$. The two lines are`, 'parallel, with A cutting the frequency axis at a lower value', ['not parallel, with A steeper', 'parallel, with B cutting the frequency axis at a lower value', 'the same line'],
    r`The slope $h/e$ is universal, so the lines are parallel. The threshold frequency is $\phi/h$, which is lower for A.`),
  mcq(3, 'saturation current graph', r`Photocurrent is plotted against anode potential for light of the same frequency but two intensities, $I_2 > I_1$. The two curves have`, 'the same stopping potential but different saturation currents', ['different stopping potentials but the same saturation current', 'the same stopping potential and the same saturation current', 'different stopping potentials and different saturation currents'],
    r`Intensity changes the number of photons, so it changes the saturation current. The photon energy is unchanged, so the stopping potential is unchanged.`),
  mcq(3, 'wave properties of matter', r`A car is not seen to show wave behaviour because`, 'its de Broglie wavelength is extremely small', ['a car has no momentum', 'matter waves exist only for charged particles', 'a car is a macroscopic charged object'],
    r`$\lambda = h/mv$ with $h \sim 10^{-34}$ J s and a large $mv$ gives a wavelength smaller than any structure it could diffract from. Matter waves exist for every moving object.`),
  mcq(3, 'photon recoil', r`A photon is absorbed by an atom initially at rest. Which quantity of the photon is transferred to the atom as well as its energy?`, 'momentum', ['charge', 'mass', 'spin only'],
    r`The photon carries momentum $h/\lambda$, so the atom recoils. Energy and momentum are both conserved in the absorption.`),
  nat(3, 'mixed with potential', r`An electron starting from rest is accelerated between two plates by an electric field of $5\times10^4\ \mathrm{V\,m^{-1}}$ over a distance of 2 mm. Find its de Broglie wavelength afterwards (in Å, 2 decimals). Use $\lambda = 12.27/\sqrt V$ Å.`, 12.27 / Math.sqrt(5e4 * 2e-3), 0.02, 2,
    r`Potential difference $V = Ed = 5\times10^4\times2\times10^{-3} = 100$ V. $\lambda = 12.27/\sqrt{100} = 1.23$ Å.`, { unit: 'Å', sub: 'mixed' }),
  // ---------- Level 4 ----------
  nat(4, 'threshold from two wavelengths', r`When light of wavelength $\lambda$ falls on a metal the stopping potential is $V$. When the wavelength is $\lambda/2$ the stopping potential is $3V$. If $\lambda = 300$ nm, find the threshold wavelength of the metal (in nm).`, 600, 0, 0,
    r`$eV = \dfrac{hc}{\lambda} - \phi$ and $3eV = \dfrac{2hc}{\lambda} - \phi$. Multiply the first by 3: $3eV = \dfrac{3hc}{\lambda} - 3\phi$. Equate: $\dfrac{3hc}{\lambda} - 3\phi = \dfrac{2hc}{\lambda} - \phi$, so $\dfrac{hc}{\lambda} = 2\phi$, $\phi = \dfrac{hc}{2\lambda} = \dfrac{hc}{\lambda_0}$ with $\lambda_0 = 2\lambda = 600$ nm.`, { unit: 'nm', trap: 'Write both equations, do not guess proportionality.' }),
  nat(4, 'photoelectrons in a magnetic field', r`Light of wavelength 200 nm falls on a metal of work function 4.0 eV. The fastest photoelectrons enter a region of uniform magnetic field of $1.0\times10^{-3}$ T perpendicular to their velocity. Find the radius of their circular path (in mm, 2 decimals). Use $hc = 1240$ eV nm, $m = 9.1\times10^{-31}$ kg, $e = 1.6\times10^{-19}$ C.`, ME * Math.sqrt(2 * (1240 / 200 - 4.0) * QE / ME) / (QE * 1e-3) * 1e3, 0.05, 2,
    r`$K_{max} = 1240/200 - 4.0 = 2.2$ eV $= 3.52\times10^{-19}$ J. $v = \sqrt{2K/m} = 8.80\times10^5\ \mathrm{m\,s^{-1}}$. In the field $r = \dfrac{mv}{eB} = \dfrac{9.1\times10^{-31}\times8.80\times10^5}{1.6\times10^{-19}\times10^{-3}} = 5.0\times10^{-3}$ m $= 5.00$ mm.`, { unit: 'mm', sub: 'mixed' }),
  nat(4, 'charging of an isolated sphere', r`An isolated metal sphere of radius 1 cm is illuminated with light of photon energy 6.2 eV. Its work function is 4.7 eV. Emission stops when the sphere reaches a certain potential. Find the number of electrons lost by then (in units of $10^7$, 2 decimals). Use $\dfrac{1}{4\pi\varepsilon_0} = 9\times10^9\ \mathrm{N\,m^2\,C^{-2}}$, $e = 1.6\times10^{-19}$ C.`, (1.5 * 0.01 / 9e9) / QE / 1e7, 0.05, 2,
    r`The sphere becomes positive as electrons leave and finally reaches the stopping potential $V_s = (6.2 - 4.7) = 1.5$ V. $V = \dfrac{kq}{R}$ gives $q = \dfrac{VR}{k} = \dfrac{1.5\times0.01}{9\times10^9} = 1.67\times10^{-12}$ C. Number $= q/e = 1.04\times10^7$.`, { unit: '×10⁷', sub: 'mixed' }),
  nat(4, 'classical delay', r`Classically, light of intensity $0.01\ \mathrm{W\,m^{-2}}$ falls on a metal. Suppose an electron absorbs the energy that falls on an area of $10^{-19}\ \mathrm{m^2}$ (about an atom's cross-section). How long would it need to collect a work function of 2 eV (in s, nearest whole number)? Use $e = 1.6\times10^{-19}$ C.`, 2 * QE / (0.01 * 1e-19), 2, 0,
    r`Power absorbed $= IA = 0.01\times10^{-19} = 10^{-21}$ W. Energy needed $= 2\times1.6\times10^{-19} = 3.2\times10^{-19}$ J. $t = 3.2\times10^{-19}/10^{-21} = 320$ s. In reality emission begins in under $10^{-9}$ s, so the wave picture fails, and the photon picture succeeds.`, { unit: 's' }),
  nat(4, 'photons from a bulb', r`A 100 W lamp gives 5 % of its power as visible light of wavelength 550 nm, spread uniformly in all directions. Find the number of photons entering an eye pupil of area $0.5\ \mathrm{cm^2}$ at a distance of 10 m each second (in units of $10^{11}$, 2 decimals). Use $h = 6.63\times10^{-34}$ J s, $c = 3\times10^8$ m/s.`, 5 * 550e-9 / (H * C0) / (4 * PI * 100) * 5e-5 / 1e11, 0.05, 2,
    r`Visible power $= 5$ W. Photons per second $= \dfrac{P\lambda}{hc} = \dfrac{5\times5.5\times10^{-7}}{1.989\times10^{-25}} = 1.38\times10^{19}$. At 10 m they spread over $4\pi r^2 = 1257\ \mathrm{m^2}$: $1.1\times10^{16}$ per $\mathrm{m^2}$ per second. Area of pupil $= 0.5\times10^{-4}\ \mathrm{m^2}$: $5.5\times10^{11}$ per second.`, { unit: '×10¹¹ /s' }),
  nat(4, 'force on a reflecting sphere', r`Light of intensity $1500\ \mathrm{W\,m^{-2}}$ falls on a perfectly and specularly reflecting sphere of radius 5 cm. Find the force on it (in nN, 1 decimal). Use $c = 3\times10^8$ m/s.`, 1500 * PI * 0.05 ** 2 / C0 * 1e9, 0.2, 1,
    r`For a specular sphere, integrating the force over the surface (each element gives $\dfrac{2I\cos^3\theta}{c}$ along the beam) gives $F = \dfrac{I\pi r^2}{c}$, exactly the same as for a perfect absorber of the same cross-section. $F = \dfrac{1500\times\pi\times0.0025}{3\times10^8} = 3.93\times10^{-8}$ N $= 39.3$ nN.`, { unit: 'nN', trap: 'A reflecting sphere does not feel double the force of an absorbing sphere.' }),
  nat(4, 'photon recoil', r`A stationary hydrogen atom (mass $1.67\times10^{-27}$ kg) emits a photon of wavelength 600 nm. Find its recoil speed (in $\mathrm{m\,s^{-1}}$, 2 decimals). Use $h = 6.63\times10^{-34}$ J s.`, H / (600e-9 * MP), 0.01, 2,
    r`Momentum is conserved: $mv = h/\lambda$. $v = \dfrac{6.63\times10^{-34}}{6\times10^{-7}\times1.67\times10^{-27}} = 0.66\ \mathrm{m\,s^{-1}}$.`, { unit: 'm/s' }),
  nat(4, 'solar sail', r`A perfectly reflecting solar sail of area $100\ \mathrm{m^2}$ faces the sun, where the intensity is $1400\ \mathrm{W\,m^{-2}}$. Find the force on it (in mN, 3 decimals). Use $c = 3\times10^8$ m/s.`, 2 * 1400 * 100 / C0 * 1e3, 0.002, 3,
    r`$F = \dfrac{2IA}{c} = \dfrac{2\times1400\times100}{3\times10^8} = 9.33\times10^{-4}$ N $= 0.933$ mN.`, { unit: 'mN' }),
  nat(4, 'Duane-Hunt limit', r`In an X-ray tube the electrons are accelerated through 20 kV. Find the shortest wavelength of the X-rays emitted (in pm). Use $hc = 1240$ eV nm.`, 1240 / 20000 * 1e3, 0.5, 0,
    r`The most energetic photon takes the whole kinetic energy of an electron: $eV = hc/\lambda_{min}$. $\lambda_{min} = \dfrac{1240}{20\,000} = 0.062$ nm $= 62$ pm. This is the photoelectric effect run backwards.`, { unit: 'pm', sub: 'mixed' }),
  nat(4, 'Balmer photon on a metal', r`The photon emitted when the electron of a hydrogen atom drops from $n = 3$ to $n = 2$ falls on a metal of work function 1.2 eV. Find the maximum kinetic energy of the photoelectrons (in eV, 2 decimals). Use $E_n = -13.6/n^2$ eV.`, 13.6 * (1 / 4 - 1 / 9) - 1.2, 0.01, 2,
    r`$E = 13.6\left(\dfrac14 - \dfrac19\right) = 13.6\times\dfrac{5}{36} = 1.889$ eV. $K = 1.889 - 1.2 = 0.69$ eV.`, { unit: 'eV', sub: 'mixed' }),
  nat(4, 'tiny photocurrent', r`Light of wavelength 400 nm and intensity $10^{-3}\ \mathrm{W\,m^{-2}}$ falls on a cathode of area $1\ \mathrm{cm^2}$. One photon in 1000 releases an electron. Find the photocurrent (in pA, 1 decimal). Use $h = 6.63\times10^{-34}$ J s, $c = 3\times10^8$ m/s, $e = 1.6\times10^{-19}$ C.`, 1e-3 * 1e-4 * 400e-9 / (H * C0) * 1e-3 * QE * 1e12, 0.5, 1,
    r`Power on cathode $= 10^{-3}\times10^{-4} = 10^{-7}$ W. Photons per second $= \dfrac{10^{-7}\times4\times10^{-7}}{1.989\times10^{-25}} = 2.01\times10^{11}$. Electrons per second $= 2.01\times10^8$. $I = 2.01\times10^8\times1.6\times10^{-19} = 3.2\times10^{-11}$ A $= 32.2$ pA.`, { unit: 'pA' }),
  nat(4, 'single slit for electrons', r`An electron beam of wavelength 1.00 Å (about 150 V) falls on a single slit 0.5 nm wide. Find the angle of the first diffraction minimum (in degrees, 1 decimal).`, Math.asin(0.1 / 0.5) * 180 / PI, 0.1, 1,
    r`First minimum: $a\sin\theta = \lambda$, so $\sin\theta = \dfrac{1.00\ \text{Å}}{5\ \text{Å}} = 0.2$ and $\theta = 11.5^\circ$.`, { unit: '°', sub: 'mixed' }),
  nat(4, 'fringes of electrons', r`Electrons of wavelength 1.00 Å pass through two narrow slits 0.5 $\mu$m apart and fall on a screen 0.5 m away. Find the fringe width (in mm, 2 decimals).`, 1e-10 * 0.5 / 5e-7 * 1e3, 0.01, 2,
    r`$\beta = \dfrac{\lambda D}{d} = \dfrac{10^{-10}\times0.5}{5\times10^{-7}} = 10^{-4}$ m $= 0.10$ mm. Electron interference was seen in this way (Jönsson, 1961).`, { unit: 'mm', sub: 'mixed' }),
  nat(4, 'ratio of K when frequency changes', r`Light of frequency $f_1$ gives a maximum kinetic energy of 1.0 eV on a metal. Light of frequency $2f_1$ gives 3.2 eV. Find the work function (in eV, 1 decimal).`, 3.2 - 2 * 1.0, 0.05, 1,
    r`$hf_1 = 1.0 + \phi$ and $2hf_1 = 3.2 + \phi$. Eliminate $hf_1$: $2(1.0 + \phi) = 3.2 + \phi$ gives $\phi = 1.2$ eV.`, { unit: 'eV' }),
  nat(4, 'stopping potentials of two wavelengths', r`The stopping potentials for light of wavelengths 400 nm and 300 nm on a metal are 0.80 V and 1.83 V respectively. Estimate Planck's constant (in units of $10^{-34}$ J s, 2 decimals). Use $c = 3\times10^8$ m/s, $e = 1.6\times10^{-19}$ C.`, QE * (1.83 - 0.8) / (C0 * (1 / 300e-9 - 1 / 400e-9)) / 1e-34, 0.1, 2,
    r`$eV_2 - eV_1 = hc\left(\dfrac1{\lambda_2} - \dfrac1{\lambda_1}\right)$. $\dfrac{1}{3\times10^{-7}} - \dfrac{1}{4\times10^{-7}} = 8.33\times10^5\ \mathrm{m^{-1}}$. $h = \dfrac{1.6\times10^{-19}\times1.03}{3\times10^8\times8.33\times10^5} = 6.59\times10^{-34}$ J s (close to the accepted $6.63\times10^{-34}$; the data are rounded).`, { unit: '×10⁻³⁴ J s' }),
  // ---------- Level 5 ----------
  nat(5, 'retarding field and angle', r`Photoelectrons of maximum kinetic energy 2 eV leave a plate and move against a uniform retarding electric field of $100\ \mathrm{V\,m^{-1}}$ directed along the normal to the plate. Find the greatest distance from the plate, measured along the normal, reached by an electron emitted at $60^\circ$ to the normal (in mm).`, 2 * 0.25 / 100 * 1e3, 0.05, 1,
    r`Only the normal component of velocity is opposed by the field. Its kinetic energy is $K\cos^2\theta = 2\times\cos^260^\circ = 0.5$ eV. The field does work $eEd$: $d = \dfrac{0.5\ \mathrm{eV}}{e\times100\ \mathrm{V/m}} = 0.005$ m $= 5.0$ mm. (For emission along the normal it would be 20 mm.)`, { unit: 'mm', trap: 'cos squared, not cos: the energy involves the velocity squared.' }),
  nat(5, 'magnetic cut-off', r`Photoelectrons with a maximum kinetic energy of 3.2 eV leave a plate with velocity along the normal. A parallel anode lies 1 cm away. A uniform magnetic field parallel to the plates is applied. Find the smallest field that stops these electrons reaching the anode (in mT, 2 decimals). Use $m = 9.1\times10^{-31}$ kg and $e = 1.6\times10^{-19}$ C.`, 2 * ME * Math.sqrt(2 * 3.2 * QE / ME) / (QE * 0.01) * 1e3, 0.03, 2,
    r`$v = \sqrt{2K/m} = \sqrt{\dfrac{2\times3.2\times1.6\times10^{-19}}{9.1\times10^{-31}}} = 1.06\times10^6\ \mathrm{m\,s^{-1}}$. The electron moves on a circle of radius $r = mv/eB$ starting from the plate, with the plate's normal along the diameter direction. It just fails to reach the anode when its greatest height $2r$ equals $d$: $B = \dfrac{2mv}{ed} = \dfrac{2\times9.1\times10^{-31}\times1.06\times10^6}{1.6\times10^{-19}\times10^{-2}} = 1.21\times10^{-3}$ T $= 1.21$ mT.`, { unit: 'mT', sub: 'mixed', trap: 'The height reached is the diameter 2r, not the radius.' }),
  nat(5, 'relativistic electron', r`An electron of kinetic energy 1 MeV is used in a diffraction experiment. Find its de Broglie wavelength from $pc = \sqrt{K^2 + 2Kmc^2}$ (in pm, 3 decimals). Use $mc^2 = 0.511$ MeV and $hc = 1.24$ MeV pm.`, 1.24 / Math.sqrt(1 + 2 * 0.511), 0.005, 3,
    r`$pc = \sqrt{1^2 + 2\times1\times0.511} = \sqrt{2.022} = 1.422$ MeV. $\lambda = \dfrac{hc}{pc} = \dfrac{1.24}{1.422} = 0.872$ pm. The non-relativistic formula $12.27/\sqrt V$ would give 1.23 pm, 40 % too long.`, { unit: 'pm', trap: 'The formula 12.27/sqrt(V) fails at MeV energies.' }),
  nat(5, 'force by a lamp', r`A 100 W lamp radiates uniformly in all directions. A perfectly absorbing disc of radius 1 cm is held 1 m away, facing the lamp. Find the force of the light on the disc (in units of $10^{-12}$ N, 2 decimals). Use $c = 3\times10^8$ m/s.`, 100 / (4 * PI) * PI * 1e-4 / C0 / 1e-12, 0.02, 2,
    r`Intensity at 1 m $= \dfrac{100}{4\pi\times1^2} = 7.96\ \mathrm{W\,m^{-2}}$. Disc area $= \pi\times10^{-4}$. $F = \dfrac{IA}{c} = \dfrac{7.96\times3.14\times10^{-4}}{3\times10^8} = 8.33\times10^{-12}$ N.`, { unit: '×10⁻¹² N' }),
  nat(5, 'light pulse absorbed', r`A short pulse of light carrying 300 J of energy is completely absorbed by a free block of mass 0.1 kg, initially at rest. Find the speed it acquires (in $\mu\mathrm{m\,s^{-1}}$, ignoring the tiny energy it gains). Use $c = 3\times10^8$ m/s.`, 300 / (0.1 * C0) * 1e6, 0.2, 1,
    r`Momentum of the pulse $= U/c = 300/(3\times10^8) = 10^{-6}$ kg m/s. $v = \dfrac{U}{Mc} = \dfrac{10^{-6}}{0.1} = 10^{-5}$ m/s $= 10\ \mu$m/s.`, { unit: 'μm/s' }),
  nat(5, 'light-emitting diode', r`A red LED emits light of wavelength 650 nm when a current flows. Each electron-hole recombination gives one photon whose energy equals the energy gained by the electron across the diode. Find the minimum forward voltage (in V, 2 decimals). Use $hc = 1240$ eV nm.`, 1240 / 650, 0.01, 2,
    r`$eV = hc/\lambda$, so $V = \dfrac{1240}{650} = 1.91$ V. A real diode switches on at a little above this.`, { unit: 'V', sub: 'mixed' }),
  // ---------- assertion / reason ----------
  asrt(2, 'instant emission', r`Photoelectric emission starts with no measurable delay, even for very dim light of frequency above threshold.`, r`Each photon gives all its energy to a single electron at once.`, 0,
    r`A is true (delay under $10^{-9}$ s). R explains it: no energy has to be gathered over time, because one photon carries a full quantum $hf$.`),
  asrt(3, 'intensity and kinetic energy', r`Doubling the intensity of the light doubles the maximum kinetic energy of the photoelectrons.`, r`The saturation photocurrent is proportional to the intensity of the light.`, 3,
    r`A is false: $K_{max} = hf - \phi$ does not depend on intensity. R is true: more photons per second means more electrons per second.`),
  asrt(3, 'threshold frequency', r`No photoelectrons are emitted if the frequency of light is below a certain value, whatever the intensity.`, r`A photon gives all its energy to one electron, and the energy $hf$ must be at least the work function $\phi$.`, 0,
    r`Many low-energy photons cannot combine, because the electron absorbs one photon at a time. R explains A.`),
  asrt(3, 'stopping potential and metals', r`For light of a given frequency, the stopping potential is the same for all metals.`, r`The graph of stopping potential against frequency has the same slope $h/e$ for all metals.`, 3,
    r`A is false: $V_s = (hf - \phi)/e$ and $\phi$ differs from metal to metal. R is true. The lines are parallel but shifted along the frequency axis.`, { trap: 'Same slope does not mean same value.' }),
  asrt(3, 'photon momentum', r`A photon has momentum even though its rest mass is zero.`, r`The energy of a photon is $hf$ and its momentum is $p = E/c$.`, 0,
    r`For a massless particle $E = pc$. So $p = hf/c = h/\lambda \ne 0$. R gives the reason.`),
  asrt(4, 'radiation pressure', r`For normal incidence, the radiation pressure on a perfectly reflecting surface is twice that on a perfectly absorbing surface.`, r`A reflected photon has its momentum reversed, so the change of momentum is double.`, 0,
    r`Absorption changes the momentum by $p$. Reflection changes it from $+p$ to $-p$, a change of $2p$. Hence $P = 2I/c$ against $I/c$.`),
  asrt(4, 'free electron and photon', r`A free electron cannot completely absorb a photon.`, r`Energy and momentum cannot both be conserved when a free electron absorbs a photon.`, 0,
    r`Try it: if the electron absorbs the photon fully, its final speed would need $\tfrac12mv^2 = hf$ and $mv = hf/c$, which together need $v = 2c$. Impossible. That is why photoelectric emission needs a bound electron, with the metal taking the extra momentum.`),
  asrt(4, 'wavelength of proton and electron', r`An electron and a proton accelerated through the same potential difference have the same de Broglie wavelength.`, r`They gain the same kinetic energy, $eV$.`, 3,
    r`A is false. The kinetic energy is equal, but $\lambda = h/\sqrt{2mK}$ depends on the mass, so $\lambda_e/\lambda_p = \sqrt{m_p/m_e} \approx 43$. R is true.`, { trap: 'Same energy does not mean same momentum.' }),
  asrt(3, 'photon wavelength', r`The de Broglie wavelength of a photon equals $hc/E$.`, r`The rest mass of a photon is zero.`, 1,
    r`A is true: $p = E/c$ so $\lambda = h/p = hc/E$. R is also true, but it is not what gives $\lambda = hc/E$. That follows from the relations $E = hf$ and $c = f\lambda$.`),
  asrt(5, 'stopping potential and intensity', r`The stopping potentials for two beams of the same frequency but different intensities are equal.`, r`The stopping potential depends on the number of photons striking the metal each second.`, 2,
    r`A is true. R is false: the stopping potential depends only on the frequency and the metal ($eV_s = hf - \phi$), not on the photon count.`),

  // ---------- statements ----------
  stm(2, 'particle and wave', r`The photoelectric effect supports the particle nature of light.`, r`The Davisson-Germer experiment supports the wave nature of electrons.`, 0,
    r`Both true: the photoelectric effect shows light acting as photons, and electron diffraction shows matter behaving as a wave. This is the idea of wave-particle duality.`),
  stm(3, 'stopping potential and frequency', r`The stopping potential increases linearly with the frequency of light above the threshold.`, r`The stopping potential does not depend on the intensity of light.`, 0,
    r`$V_s = (h/e)f - \phi/e$ is linear in $f$, and has no intensity term. Both true.`),
  stm(3, 'proportional', r`The maximum kinetic energy of photoelectrons is directly proportional to the frequency of the light.`, r`$K_{max} = hf - \phi$.`, 3,
    r`II is true. I is false: $K_{max}$ is a linear function of $f$ with a negative intercept, so it is not proportional to $f$ (doubling $f$ more than doubles $K_{max}$).`, { trap: 'Linear is not the same as proportional.' }),
  stm(3, 'photon momentum', r`A photon of wavelength $\lambda$ has momentum $h/\lambda$.`, r`A photon has no mass, so it has no momentum.`, 2,
    r`I is true. II is false: massless particles can have momentum. $p = E/c$.`),
  stm(4, 'radiation pressure', r`The pressure of a light beam falling normally on a perfect absorber equals its energy density.`, r`The pressure on a perfect mirror at normal incidence is $2I/c$.`, 0,
    r`Energy density $u = I/c$ for a beam, and $P_{abs} = I/c = u$. For a mirror $P = 2I/c = 2u$. Both true.`),
  stm(4, 'voltage and wavelength', r`An electron accelerated through a larger potential difference has a longer de Broglie wavelength.`, r`The de Broglie wavelength of an electron accelerated through $V$ is $h/\sqrt{2meV}$.`, 3,
    r`II is true. From it, $\lambda\propto V^{-1/2}$, so a larger $V$ gives a shorter wavelength. I is false.`),
  stm(4, 'heavy particles', r`Of two particles of the same kinetic energy, the heavier one has the shorter de Broglie wavelength.`, r`$\lambda = h/\sqrt{2mK}$.`, 0,
    r`With $K$ equal, $\lambda\propto m^{-1/2}$. Both true.`),
  stm(3, 'wrong effects of intensity and wavelength', r`Increasing the intensity of light above the threshold frequency increases the maximum kinetic energy of the photoelectrons.`, r`Decreasing the wavelength of the light decreases the maximum kinetic energy.`, 1,
    r`Both false. $K_{max}$ is independent of intensity, and a shorter wavelength means a larger photon energy, so $K_{max}$ increases.`),
  stm(5, 'threshold', r`At the threshold frequency, photoelectrons are emitted with zero kinetic energy.`, r`Below the threshold frequency, an electron can absorb several photons one after another to escape.`, 2,
    r`I is true: $hf_0 = \phi$. II is false for ordinary intensities: an electron loses the energy of one photon long before the next one arrives (only with extremely intense laser light can multiphoton emission happen).`),
  cnt(3, 'photoelectric facts', r`Which of the following statements about the photoelectric effect are correct?`,
    [r`The stopping potential does not depend on the intensity of light.`, r`The saturation current is proportional to the intensity at fixed frequency.`, r`$K_{max}$ depends on the frequency of the light.`, r`At low intensity there is a delay before emission starts.`], 3,
    r`(1), (2) and (3) are correct. (4) is false: there is no delay, because one photon is enough.`),
  cnt(4, 'matter waves', r`How many of the following statements are correct?`,
    [r`The wavelength of a particle is inversely proportional to its momentum.`, r`For the same kinetic energy, a proton has a shorter wavelength than an electron.`, r`An electron accelerated through 100 V has $\lambda = 12.27$ Å.`, r`The wavelength of a photon is $h/mv$ with $m$ its rest mass.`], 2,
    r`(1) True. (2) True: heavier means shorter $\lambda$. (3) False: it is 1.227 Å (12.27 Å would need 1 V). (4) False: a photon's rest mass is zero; $\lambda = h/p$. Two are correct.`),
  cnt(5, 'radiation pressure', r`How many of the following are correct?`,
    [r`The pressure on a perfectly absorbing surface at normal incidence is $I/c$.`, r`The pressure on a perfectly reflecting surface at normal incidence is $2I/c$.`, r`A perfectly reflecting sphere feels twice the force of a perfectly absorbing sphere of the same size.`, r`On a perfect absorber the normal pressure at angle of incidence $\theta$ is $I\cos^2\theta/c$.`], 3,
    r`(1), (2), (4) are true. (3) is false: for a specular sphere, summing over the surface gives $F = I\pi r^2/c$, the same as for an absorber of that size, because the reflected light is sent in many directions, which cancels part of the doubling. Three are correct.`),

  // ---------- multiple correct ----------
  msq(4, 'photoelectric effect', r`In the photoelectric effect with frequency above threshold, which are correct?`, [r`$K_{max}$ increases with the frequency of the light.`, r`The saturation current increases with the intensity at fixed frequency.`, r`The stopping potential increases with the intensity of the light.`, r`Emission begins only after a delay when the light is dim.`], [0, 1],
    r`$K_{max} = hf - \phi$ rises with $f$. The saturation current counts electrons per second, which follows photons per second, i.e. intensity. The stopping potential depends only on $f$ and the metal. There is no delay.`),
  msq(4, 'stopping potential graph', r`A graph of stopping potential $V_s$ against frequency $f$ is drawn for several metals. Which are correct?`, [r`The slope is $h/e$.`, r`The slope is the same for all the metals.`, r`The intercept on the frequency axis is the threshold frequency.`, r`The intercept on the $V_s$ axis is $+\phi/e$.`], [0, 1, 2],
    r`$V_s = (h/e)f - \phi/e$. The intercept on the voltage axis is $-\phi/e$ (negative), so the last option is false.`),
  msq(4, 'matter waves', r`Which are correct?`, [r`The de Broglie wavelength is $h/p$.`, r`An electron accelerated through $V$ volts has $\lambda = 12.27/\sqrt V$ Å (non-relativistic).`, r`A photon and an electron of the same wavelength have the same energy.`, r`For the same kinetic energy, an electron has a longer wavelength than a proton.`], [0, 1, 3],
    r`For equal $\lambda$ the photon has energy $pc$ and the electron has $p^2/2m$: very different. For equal $K$, $\lambda\propto m^{-1/2}$, so the lighter electron has the longer wavelength.`),
  msq(5, 'light and momentum', r`Light falls normally on a surface. Which are correct?`, [r`Perfect absorber: pressure $I/c$.`, r`Perfect mirror: pressure $2I/c$.`, r`Each photon of energy $E$ carries momentum $E/c$.`, r`The pressure on a mirror does not depend on the intensity.`], [0, 1, 2],
    r`Momentum per photon $E/c$. Flux of photons $I/E$ gives momentum flow $I/c$. Reflection doubles the change. The pressure is proportional to the intensity.`),
  msq(4, 'Davisson-Germer', r`Which are correct about the Davisson-Germer experiment?`, [r`It showed the wave nature of electrons.`, r`A nickel crystal was used as the diffraction grating.`, r`For 54 V electrons the strong peak was at $50^\circ$.`, r`The peak position was independent of the accelerating voltage.`], [0, 1, 2],
    r`The wavelength depends on the voltage ($\lambda\propto V^{-1/2}$), so the angle of the peak changes as the voltage is changed.`),
  msq(5, 'two metals', r`The same light falls on metals A and B with $\phi_A < \phi_B$ and both emit photoelectrons. Which must be correct?`, [r`$K_{max}$ for A is greater than for B.`, r`The stopping potential of A is greater than that of B.`, r`The threshold wavelength of A is longer than that of B.`, r`The saturation current from A is greater than from B.`], [0, 1, 2],
    r`$K = hf - \phi$ is larger for the smaller $\phi$, so $V_s$ is larger for A and the threshold wavelength $hc/\phi$ is longer. The saturation current depends on the photon flux and the efficiency, which this information does not decide.`),
  msq(5, 'raising the frequency', r`The frequency of a light beam is increased while its power is kept the same (frequency stays above threshold, the same fraction of photons ejects an electron). Which are correct?`, [r`$K_{max}$ increases.`, r`The number of photons per second decreases.`, r`The saturation current decreases.`, r`The stopping potential does not change.`], [0, 1, 2],
    r`Each photon carries more energy, so fewer photons arrive each second (the same power), giving fewer electrons per second and a smaller saturation current. The stopping potential rises with $f$.`, { trap: 'Same power is not the same as same number of photons.' }),
  msq(3, '400 nm on a metal', r`Light of wavelength 400 nm ($hc = 1240$ eV nm) falls on a metal of work function 2.5 eV. Which are correct?`, [r`$K_{max} = 0.6$ eV`, r`The stopping potential is 0.6 V.`, r`The threshold wavelength is about 496 nm.`, r`Every emitted electron has kinetic energy exactly 0.6 eV.`], [0, 1, 2],
    r`$E = 3.1$ eV, $K_{max} = 3.1 - 2.5 = 0.6$ eV, $V_s = 0.6$ V and $\lambda_0 = 1240/2.5 = 496$ nm. Electrons come out with a range of energies up to 0.6 eV.`),

  // ---------- match ----------
  mat(2, 'quantities of a photon', 'm1', r`Match each quantity with its expression.`, 'A-r, B-s, C-p, D-q', ['A-r, B-p, C-s, D-q', 'A-s, B-r, C-p, D-q', 'A-r, B-s, C-q, D-p'],
    r`Photon energy $hf$ (r). Photon momentum $h/\lambda$ (s). De Broglie wavelength $h/p$ (p). Threshold frequency $\phi/h$ (q).`),
  mat(3, 'experiments and ideas', 'm2', r`Match each item with the idea it shows.`, 'A-s, B-p, C-q, D-r', ['A-p, B-s, C-q, D-r', 'A-s, B-p, C-r, D-q', 'A-s, B-q, C-p, D-r'],
    r`The photoelectric effect shows the particle nature of light (s). Davisson-Germer shows electron diffraction (p). Radiation pressure shows photons carry momentum (q). The stopping potential is $K_{max}/e$ (r).`),
  mat(3, 'wavelengths at V volts', 'm3', r`Particles are accelerated from rest through $V$ volts. Match each with its de Broglie wavelength in angstrom.`, 'A-q, B-r, C-p, D-s', ['A-q, B-r, C-s, D-p', 'A-r, B-q, C-p, D-s', 'A-q, B-p, C-r, D-s'],
    r`Electron $12.27/\sqrt V$ (q). Proton: $\lambda\propto m^{-1/2}$ gives $12.27/\sqrt{1836}/\sqrt V = 0.286/\sqrt V$ (r). Alpha particle: mass $4m_p$ and charge $2e$ so $\lambda\propto(mq)^{-1/2}$: $0.286/\sqrt8 = 0.101/\sqrt V$ (p). Deuteron: mass $2m_p$, charge $e$: $0.286/\sqrt2 = 0.202/\sqrt V$ (s).`),
  mat(3, 'photon energies', 'm4', r`Using $hc = 1240$ eV nm, match each wavelength with the energy of its photon.`, 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-q, B-r, C-p, D-s'],
    r`$1240/620 = 2$ eV (q). $1240/413 = 3$ eV (p). $1240/310 = 4$ eV (r). $1240/124 = 10$ eV (s).`),
  mat(4, 'changes in an experiment', 'm5', r`In a photocell experiment above threshold, match each change with its effect.`, 'A-q, B-p, C-r, D-s', ['A-p, B-q, C-r, D-s', 'A-q, B-p, C-s, D-r', 'A-q, B-r, C-p, D-s'],
    r`Doubling the intensity doubles the saturation current (q). A higher frequency raises the stopping potential (p). A metal of larger work function lowers the stopping potential for the same light (r). A larger retarding voltage lowers the current (s).`),

  // ---------- passages ----------
  pas(2, 'work function', 'p1', r`Find the work function of the metal (in eV, 1 decimal).`, 3.0, 0.05, 1,
    r`$\phi = hc/\lambda_0 = 1240/413 = 3.0$ eV.`, { unit: 'eV' }),
  pas(3, 'maximum kinetic energy', 'p1', r`Find the maximum kinetic energy of the photoelectrons (in eV, 2 decimals).`, 1240 / 300 - 3.0, 0.02, 2,
    r`$E = 1240/300 = 4.13$ eV. $K_{max} = 4.13 - 3.0 = 1.13$ eV.`, { unit: 'eV' }),
  pasm(3, 'stopping potential', 'p1', r`The stopping potential is`, '1.13 V', ['3.0 V', '4.13 V', '0.80 V'],
    r`$eV_s = K_{max} = 1.13$ eV gives $V_s = 1.13$ V.`),
  pas(4, 'shorter wavelength', 'p1', r`The wavelength is reduced to 200 nm (same metal). Find the new stopping potential (in V, 1 decimal).`, 1240 / 200 - 3.0, 0.05, 1,
    r`$E = 1240/200 = 6.2$ eV. $eV_s = 6.2 - 3.0 = 3.2$ eV, so $V_s = 3.2$ V. (It is not three times larger: the wavelength has fallen to two-thirds, but $K$ changes from 1.13 to 3.2 eV, a factor of 2.8.)`, { unit: 'V' }),
  pas(2, 'wavelength', 'p2', r`Find the de Broglie wavelength of the electrons (in Å, 2 decimals). Use $\lambda = 12.27/\sqrt V$ Å.`, 12.27 / Math.sqrt(150), 0.02, 2,
    r`$\lambda = \dfrac{12.27}{\sqrt{150}} = 1.00$ Å.`, { unit: 'Å' }),
  pas(3, 'speed', 'p2', r`Find the speed of the electrons (in units of $10^6\ \mathrm{m\,s^{-1}}$, 2 decimals). Use $m = 9.1\times10^{-31}$ kg, $e = 1.6\times10^{-19}$ C.`, Math.sqrt(2 * QE * 150 / ME) / 1e6, 0.08, 2,
    r`$\tfrac12mv^2 = eV$ so $v = \sqrt{\dfrac{2\times1.6\times10^{-19}\times150}{9.1\times10^{-31}}} = 7.26\times10^6\ \mathrm{m\,s^{-1}}$ (about 2.4 % of $c$, so non-relativistic is acceptable).`, { unit: '×10⁶ m/s' }),
  pas(4, 'a proton', 'p2', r`A proton is accelerated through the same 150 V. Find its de Broglie wavelength (in pm, 2 decimals). Use $m_p = 1.67\times10^{-27}$ kg, $h = 6.63\times10^{-34}$ J s.`, H / Math.sqrt(2 * MP * QE * 150) * 1e12, 0.03, 2,
    r`$p = \sqrt{2m_peV} = \sqrt{2\times1.67\times10^{-27}\times1.6\times10^{-19}\times150} = 2.83\times10^{-22}$. $\lambda = 6.63\times10^{-34}/2.83\times10^{-22} = 2.34\times10^{-12}$ m $= 2.34$ pm.`, { unit: 'pm' }),
  pas(2, 'photon rate', 'p3', r`Find the number of photons striking the mirror each second (in units of $10^{16}$, 2 decimals). Use $h = 6.63\times10^{-34}$ J s, $c = 3\times10^8$ m/s.`, 5e-3 * 650e-9 / (H * C0) / 1e16, 0.02, 2,
    r`$N = \dfrac{P\lambda}{hc} = \dfrac{5\times10^{-3}\times6.5\times10^{-7}}{1.989\times10^{-25}} = 1.63\times10^{16}$ per second.`, { unit: '×10¹⁶ /s' }),
  pas(3, 'photon momentum', 'p3', r`Find the momentum of one photon (in units of $10^{-27}\ \mathrm{kg\,m\,s^{-1}}$, 2 decimals).`, H / 650e-9 / 1e-27, 0.02, 2,
    r`$p = h/\lambda = 6.63\times10^{-34}/6.5\times10^{-7} = 1.02\times10^{-27}\ \mathrm{kg\,m\,s^{-1}}$.`, { unit: '×10⁻²⁷ kg m/s' }),
  pas(4, 'force on the mirror', 'p3', r`Find the force on the mirror (in pN, 1 decimal).`, 2 * 5e-3 / C0 * 1e12, 0.2, 1,
    r`Each photon's momentum change is $2p = 2.04\times10^{-27}$. Force $= N\times2p = 1.63\times10^{16}\times2.04\times10^{-27} = 3.33\times10^{-11}$ N. Check: $2P/c = 2\times5\times10^{-3}/3\times10^8 = 33.3$ pN.`, { unit: 'pN' }),
];
const groups = {
  m1: { title: 'Quantities of a photon',
    list1: ['A. Photon energy', 'B. Photon momentum', 'C. De Broglie wavelength of a particle', 'D. Threshold frequency'],
    list2: [r`p. $h/p$`, r`q. $\phi/h$`, r`r. $hf$`, r`s. $h/\lambda$`] },
  m2: { title: 'Experiments and ideas',
    list1: ['A. Photoelectric effect', 'B. Davisson-Germer experiment', 'C. Radiation pressure', 'D. Stopping potential'],
    list2: ['p. Electron diffraction', 'q. Photons carry momentum', r`r. $K_{max}/e$`, 's. Particle nature of light'] },
  m3: { title: 'De Broglie wavelengths at V volts',
    list1: ['A. Electron', 'B. Proton', 'C. Alpha particle', 'D. Deuteron (mass $2m_p$, charge $e$)'],
    list2: [r`p. $0.101/\sqrt V$ Å`, r`q. $12.27/\sqrt V$ Å`, r`r. $0.286/\sqrt V$ Å`, r`s. $0.202/\sqrt V$ Å`] },
  m4: { title: 'Photon energies',
    list1: ['A. 620 nm', 'B. 413 nm', 'C. 310 nm', 'D. 124 nm'],
    list2: ['p. 3 eV', 'q. 2 eV', 'r. 4 eV', 's. 10 eV'] },
  m5: { title: 'Changes in a photocell experiment',
    list1: ['A. Intensity doubled, same frequency', 'B. Frequency increased', 'C. A metal of larger work function is used', 'D. Retarding voltage increased'],
    list2: ['p. Stopping potential increases', 'q. Saturation current doubles', 'r. Stopping potential decreases', 's. Photocurrent at that voltage decreases'] },
  p1: { title: 'A photocell',
    passage: r`<p>A metal has a threshold wavelength of 413 nm. Light of wavelength 300 nm falls on it. Use $hc = 1240$ eV nm.</p>` },
  p2: { title: 'Electrons accelerated through 150 V',
    passage: r`<p>A beam of electrons is accelerated from rest through a potential difference of 150 V in a vacuum tube.</p>` },
  p3: { title: 'A laser pointer and a mirror',
    passage: r`<p>A laser of power 5 mW and wavelength 650 nm sends a narrow beam normally on to a small perfectly reflecting mirror.</p>` },
};
const cm = (a, b) => Math.hypot(a, b);
const PARTS = { electron: ['an electron', ME, 1], proton: ['a proton', MP, 1], alpha: ['an alpha particle', MA, 2], neutron: ['a neutron', MN, 0] };
const gens = [
  { id: 'dn-g01', type: 'nat', level: 1, exams: exFor(1, 'nat'), sub: 'photon energy',
    make(rng) {
      const v = int(rng, 0, 3); let q; let ans; let unit; let sol; let x; let dp = 2;
      if (v === 0) { x = choose(rng, [200, 250, 300, 400, 450, 500, 600, 700]); ans = lamE(x); unit = 'eV'; q = `Find the energy of a photon of wavelength ${x} nm (in eV, 2 decimals). Use $hc = 1240$ eV nm.`; sol = `$E = hc/\\lambda = 1240/${x} = ${S(ans, 4)}$ eV.`; }
      else if (v === 1) { x = choose(rng, [1.5, 2, 2.5, 3, 3.1, 4, 5, 6.2]); ans = 1240 / x; unit = 'nm'; q = `Find the wavelength of a photon of energy ${x} eV (in nm, 1 decimal). Use $hc = 1240$ eV nm.`; sol = `$\\lambda = hc/E = 1240/${x} = ${S(ans, 4)}$ nm.`; dp = 1; }
      else if (v === 2) { x = choose(rng, [4, 5, 6, 7, 8, 9]); ans = x * 1e14 * H / QE; unit = 'eV'; q = `Find the energy of a photon of frequency $${x}\\times10^{14}$ Hz (in eV, 2 decimals). Use $h = 6.63\\times10^{-34}$ J s, $e = 1.6\\times10^{-19}$ C.`; sol = `$E = hf = 6.63\\times10^{-34}\\times${x}\\times10^{14} = ${S(x * 1e14 * H * 1e19, 4)}\\times10^{-19}$ J $= ${S(ans, 4)}$ eV.`; }
      else { x = choose(rng, [1.5, 2, 2.5, 3, 4]); ans = x * QE / H / 1e14; unit = '×10¹⁴ Hz'; q = `A photon has an energy of ${x} eV. Find its frequency (in units of $10^{14}$ Hz, 2 decimals). Use $h = 6.63\\times10^{-34}$ J s, $e = 1.6\\times10^{-19}$ C.`; sol = `$f = E/h = \\dfrac{${x}\\times1.6\\times10^{-19}}{6.63\\times10^{-34}} = ${S(ans, 4)}\\times10^{14}$ Hz.`; }
      return { v, x, q, answer: N(ans, dp), tol: TL(ans, dp), unit, sol, trap: v === 3 || v === 2 ? 'Keep the powers of ten and convert eV and joule carefully.' : undefined };
    },
    verify: (p) => (p.v === 0 ? H * C0 / (p.x * 1e-9) / QE : p.v === 1 ? H * C0 / (p.x * QE) * 1e9 : p.v === 2 ? p.x * 1e14 * H / QE : p.x * QE / H / 1e14) },
  { id: 'dn-g02', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'work function and threshold',
    make(rng) {
      const v = int(rng, 0, 3); const phi = choose(rng, [1.9, 2.1, 2.3, 2.5, 3.0, 3.5, 4.1, 4.7]); const f0 = phi * QE / H;
      let q; let ans; let unit; let sol; let dp = 1; let x;
      if (v === 0) { x = 1240 / phi; ans = phi; unit = 'eV'; q = `The threshold wavelength of a metal is ${S(x, 4)} nm. Find its work function (in eV, 2 decimals). Use $hc = 1240$ eV nm.`; sol = `$\\phi = hc/\\lambda_0 = 1240/${S(x, 4)} = ${S(phi, 3)}$ eV.`; dp = 2; }
      else if (v === 1) { ans = 1240 / phi; unit = 'nm'; q = `The work function of a metal is ${phi} eV. Find its threshold wavelength (in nm, nearest whole number). Use $hc = 1240$ eV nm.`; sol = `$\\lambda_0 = hc/\\phi = 1240/${phi} = ${S(ans, 4)}$ nm.`; dp = 0; }
      else if (v === 2) { ans = f0 / 1e14; unit = '×10¹⁴ Hz'; q = `The work function of a metal is ${phi} eV. Find its threshold frequency (in units of $10^{14}$ Hz, 2 decimals). Use $h = 6.63\\times10^{-34}$ J s, $e = 1.6\\times10^{-19}$ C.`; sol = `$f_0 = \\phi/h = \\dfrac{${phi}\\times1.6\\times10^{-19}}{6.63\\times10^{-34}} = ${S(ans, 4)}\\times10^{14}$ Hz.`; dp = 2; }
      else { x = f0 / 1e14; ans = phi; unit = 'eV'; q = `The threshold frequency of a metal is $${S(x, 4)}\\times10^{14}$ Hz. Find its work function (in eV, 2 decimals). Use $h = 6.63\\times10^{-34}$ J s, $e = 1.6\\times10^{-19}$ C.`; sol = `$\\phi = hf_0 = 6.63\\times10^{-34}\\times${S(x, 4)}\\times10^{14} = ${S(H * f0 * 1e19, 4)}\\times10^{-19}$ J $= ${phi}$ eV.`; dp = 2; }
      return { v, phi, x, q, answer: N(ans, dp), tol: TL(ans, dp), unit, sol };
    },
    verify: (p) => (p.v === 0 ? H * C0 / (p.x * 1e-9) / QE : p.v === 1 ? H * C0 / (p.phi * QE) * 1e9 : p.v === 2 ? p.phi * QE / H / 1e14 : H * p.x * 1e14 / QE) },
  { id: 'dn-g03', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'photoelectric equation',
    make(rng) {
      const lam = choose(rng, [200, 250, 300, 350, 400, 450]); const E = 1240 / lam; const opts = [1.9, 2.1, 2.3, 2.5, 3.0, 3.5, 4.1, 4.7].filter((x) => x < E - 0.2); const phi = choose(rng, opts.length ? opts : [1.5]);
      const K = E - phi; const v = int(rng, 0, 1);
      return { v, lam, phi, q: `Light of wavelength ${lam} nm falls on a metal of work function ${phi} eV. Find the ${v === 0 ? 'maximum kinetic energy of the photoelectrons (in eV, 2 decimals)' : 'stopping potential (in V, 2 decimals)'}. Use $hc = 1240$ eV nm.`, answer: N(K, 2), tol: 0.011, unit: v === 0 ? 'eV' : 'V',
        sol: `$E = 1240/${lam} = ${S(E, 4)}$ eV. $K_{max} = E - \\phi = ${S(E, 4)} - ${phi} = ${S(K, 3)}$ eV.${v === 1 ? ` $eV_s = K_{max}$, so $V_s = ${S(K, 3)}$ V.` : ''}`, trap: v === 1 ? 'Kinetic energy in eV has the same number as the stopping potential in volts.' : undefined };
    },
    verify: (p) => 1240 / p.lam - p.phi },
  { id: 'dn-g04', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'stopping potential relations',
    make(rng) {
      const lam = choose(rng, [200, 248, 310, 350, 400]); const E = 1240 / lam; const phi = choose(rng, [1.5, 1.8, 2.0, 2.3, 2.5]); const Vs = E - phi; const v = int(rng, 0, 2);
      let q; let ans; let unit; let sol; let dp = 2;
      if (v === 0) { ans = Vs; unit = 'V'; q = `A metal has work function ${phi} eV. Find the stopping potential for light of wavelength ${lam} nm (in V, 2 decimals). Use $hc = 1240$ eV nm.`; sol = `$E = ${S(E, 4)}$ eV. $eV_s = E - \\phi$, so $V_s = ${S(E, 4)} - ${phi} = ${S(Vs, 3)}$ V.`; }
      else if (v === 1) { ans = 1240 / (Vs + phi); unit = 'nm'; q = `For a metal of work function ${phi} eV, the stopping potential is ${S(Vs, 4)} V. Find the wavelength of the light (in nm, nearest whole number). Use $hc = 1240$ eV nm.`; sol = `$hc/\\lambda = eV_s + \\phi = ${S(Vs, 4)} + ${phi} = ${S(Vs + phi, 4)}$ eV. $\\lambda = 1240/${S(Vs + phi, 4)} = ${S(ans, 4)}$ nm.`; dp = 0; }
      else { ans = E - Vs; unit = 'eV'; q = `Light of wavelength ${lam} nm gives a stopping potential of ${S(Vs, 4)} V on a metal. Find the work function (in eV, 2 decimals). Use $hc = 1240$ eV nm.`; sol = `$\\phi = hc/\\lambda - eV_s = ${S(E, 4)} - ${S(Vs, 4)} = ${S(phi, 3)}$ eV.`; }
      return { v, lam, phi, Vs, q, answer: N(ans, dp), tol: dp === 0 ? 1 : 0.011, unit, sol };
    },
    verify: (p) => (p.v === 0 ? 1240 / p.lam - p.phi : p.v === 1 ? p.lam : 1240 / p.lam - p.Vs) },
  { id: 'dn-g05', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'speed of photoelectrons',
    make(rng) {
      const K = choose(rng, [0.5, 1, 1.5, 2, 3, 4.5]); const v = int(rng, 0, 1); const lam = choose(rng, [200, 250, 300]); const phi = choose(rng, [2.0, 3.0, 4.0]); const Kl = 1240 / lam - phi;
      const KK = v === 0 ? K : Kl; const sp = Math.sqrt(2 * KK * QE / ME) / 1e5;
      return { v, K, lam, phi, q: v === 0 ? `Photoelectrons are emitted with a maximum kinetic energy of ${K} eV. Find their maximum speed (in units of $10^5\\ \\mathrm{m\\,s^{-1}}$, 2 decimals). Use $m = 9.1\\times10^{-31}$ kg, $e = 1.6\\times10^{-19}$ C.` : `Light of wavelength ${lam} nm falls on a metal of work function ${phi} eV. Find the maximum speed of the photoelectrons (in units of $10^5\\ \\mathrm{m\\,s^{-1}}$, 2 decimals). Use $hc = 1240$ eV nm, $m = 9.1\\times10^{-31}$ kg.`, answer: N(sp, 2), tol: TL(sp, 2), unit: '×10⁵ m/s',
        sol: `${v === 1 ? `$K = 1240/${lam} - ${phi} = ${S(Kl, 4)}$ eV. ` : ''}$K = ${S(KK, 4)}\\times1.6\\times10^{-19} = ${S(KK * QE * 1e19, 4)}\\times10^{-19}$ J. $v = \\sqrt{2K/m} = \\sqrt{\\dfrac{2\\times${S(KK * QE, 4)}}{9.1\\times10^{-31}}} = ${S(sp, 4)}\\times10^5\\ \\mathrm{m\\,s^{-1}}$.`, trap: 'Convert eV to joule before using the mass in kg.' };
    },
    verify: (p) => Math.sqrt(2 * (p.v === 0 ? p.K : 1240 / p.lam - p.phi) * QE / ME) / 1e5 },
  { id: 'dn-g06', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'photons per second',
    make(rng) {
      const v = int(rng, 0, 2); const lam = choose(rng, [400, 500, 550, 633, 650, 700]); const P = choose(rng, [1, 2, 5, 10]) * 1e-3; const eff = choose(rng, [0.02, 0.05, 0.1]); const Pb = choose(rng, [40, 60, 100]);
      let q; let ans; let unit; let sol; let dp = 2;
      const Nps = P * lam * 1e-9 / (H * C0);
      if (v === 0) { ans = Nps / 1e16; unit = '×10¹⁶ /s'; q = `A laser of power ${P * 1e3} mW emits light of wavelength ${lam} nm. Find the number of photons emitted per second (in units of $10^{16}$, 2 decimals). Use $h = 6.63\\times10^{-34}$ J s, $c = 3\\times10^8$ m/s.`; sol = `$E_{ph} = hc/\\lambda = ${S(H * C0 / (lam * 1e-9) * 1e19, 4)}\\times10^{-19}$ J. $N = P/E_{ph} = ${S(Nps / 1e16, 4)}\\times10^{16}$ per second.`; }
      else if (v === 1) { unit = 'mW'; const N16 = +S(Nps / 1e16, 3); ans = N16 * 1e16 * (H * C0 / (lam * 1e-9)) * 1e3; q = `A source emits $${S(N16, 3)}\\times10^{16}$ photons per second at ${lam} nm. Find its power (in mW, 2 decimals). Use $h = 6.63\\times10^{-34}$ J s, $c = 3\\times10^8$ m/s.`; sol = `$E_{ph} = hc/\\lambda = ${S(H * C0 / (lam * 1e-9) * 1e19, 4)}\\times10^{-19}$ J. $P = NE_{ph} = ${S(N16, 3)}\\times10^{16}\\times${S(H * C0 / (lam * 1e-9) * 1e19, 4)}\\times10^{-19} = ${S(ans / 1e3, 4)}$ W $= ${S(ans, 4)}$ mW.`; }
      else { ans = Pb * eff * lam * 1e-9 / (H * C0) / 1e18; unit = '×10¹⁸ /s'; q = `A ${Pb} W lamp turns ${S(eff * 100)} % of its power into light of wavelength ${lam} nm. Find the number of photons emitted per second (in units of $10^{18}$, 2 decimals). Use $h = 6.63\\times10^{-34}$ J s, $c = 3\\times10^8$ m/s.`; sol = `Light power $= ${Pb}\\times${eff} = ${S(Pb * eff, 4)}$ W. $N = \\dfrac{P\\lambda}{hc} = \\dfrac{${S(Pb * eff, 4)}\\times${lam}\\times10^{-9}}{1.989\\times10^{-25}} = ${S(ans, 4)}\\times10^{18}$ per second.`; }
      const dpp = v === 2 ? 2 : 2;
      return { v, lam, P, eff, Pb, q, answer: N(ans, dpp), tol: TL(ans, dpp), unit, sol, trap: 'Use the light power, not the electrical power.' };
    },
    verify: (p) => { const E = H * C0 / (p.lam * 1e-9); return p.v === 0 ? p.P / E / 1e16 : p.v === 1 ? p.P * 1e3 : p.Pb * p.eff / E / 1e18; } },
  /* g06 note: variant 1 returns the power rebuilt from the rounded photon count */
  { id: 'dn-g07', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'photon momentum and radiation pressure',
    make(rng) {
      const v = int(rng, 0, 3); const lam = choose(rng, [300, 400, 500, 600, 700]); const I = choose(rng, [500, 1000, 1400, 2000, 3000]); const A = choose(rng, [0.5, 1, 2, 4]);
      let q; let ans; let unit; let sol; let dp = 2;
      if (v === 0) { ans = H / (lam * 1e-9) / 1e-27; unit = '×10⁻²⁷ kg m/s'; q = `Find the momentum of a photon of wavelength ${lam} nm (in units of $10^{-27}\\ \\mathrm{kg\\,m\\,s^{-1}}$, 2 decimals). Use $h = 6.63\\times10^{-34}$ J s.`; sol = `$p = h/\\lambda = \\dfrac{6.63\\times10^{-34}}{${lam}\\times10^{-9}} = ${S(ans, 4)}\\times10^{-27}\\ \\mathrm{kg\\,m\\,s^{-1}}$.`; }
      else if (v === 1) { ans = I / C0 * 1e6; unit = 'μPa'; q = `Light of intensity ${I} $\\mathrm{W\\,m^{-2}}$ falls normally on a perfectly absorbing surface. Find the radiation pressure (in $\\mu$Pa, 2 decimals). Use $c = 3\\times10^8$ m/s.`; sol = `$P = I/c = ${I}/(3\\times10^8) = ${S(I / C0, 4)}$ Pa $= ${S(ans, 4)}\\ \\mu$Pa.`; }
      else if (v === 2) { ans = 2 * I / C0 * 1e6; unit = 'μPa'; q = `Light of intensity ${I} $\\mathrm{W\\,m^{-2}}$ falls normally on a perfectly reflecting mirror. Find the radiation pressure (in $\\mu$Pa, 2 decimals). Use $c = 3\\times10^8$ m/s.`; sol = `Reflection doubles the momentum change: $P = 2I/c = 2\\times${I}/(3\\times10^8) = ${S(ans, 4)}\\ \\mu$Pa.`; }
      else { ans = I * A / C0 * 1e6; unit = 'μN'; q = `Light of intensity ${I} $\\mathrm{W\\,m^{-2}}$ falls normally on a perfectly absorbing plate of area ${A} $\\mathrm{m^2}$. Find the force on it (in $\\mu$N, 2 decimals). Use $c = 3\\times10^8$ m/s.`; sol = `$F = PA = \\dfrac{I}{c}A = \\dfrac{${I}\\times${A}}{3\\times10^8} = ${S(ans, 4)}\\ \\mu$N.`; }
      return { v, lam, I, A, q, answer: N(ans, dp), tol: TL(ans, dp), unit, sol, trap: v === 2 ? 'A mirror gives twice the pressure of an absorber.' : undefined };
    },
    verify: (p) => (p.v === 0 ? H / (p.lam * 1e-9) * 1e27 : p.v === 1 ? p.I / C0 * 1e6 : p.v === 2 ? 2 * p.I / C0 * 1e6 : p.I * p.A / C0 * 1e6) },
  { id: 'dn-g08', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'oblique radiation pressure',
    make(rng) {
      const th = choose(rng, [30, 37, 45, 53, 60]); const I = choose(rng, [1000, 1500, 2000, 3000]); const A = choose(rng, [0.5, 1, 2]); const mirror = int(rng, 0, 1); const v = int(rng, 0, 1);
      const c2 = Math.cos(th * PI / 180) ** 2; const P = (mirror ? 2 : 1) * I * c2 / C0;
      const ans = v === 0 ? P * 1e6 : P * A * 1e6;
      return { th, I, A, mirror, v, q: `Light of intensity ${I} $\\mathrm{W\\,m^{-2}}$ falls on a perfectly ${mirror ? 'reflecting' : 'absorbing'} surface at an angle of incidence of $${th}^\\circ$ (from the normal)${v === 0 ? '. Find the normal radiation pressure (in $\\mu$Pa, 2 decimals).' : ` on an area of ${A} $\\mathrm{m^2}$. Find the force on it (in $\\mu$N, 2 decimals).`} Use $c = 3\\times10^8$ m/s.`, answer: N(ans, 2), tol: TL(ans, 2), unit: v === 0 ? 'μPa' : 'μN',
        sol: `Per unit area the light arriving carries momentum $\\dfrac{I\\cos\\theta}{c}$ per second, and the normal component is another factor $\\cos\\theta$ (${mirror ? 'doubled by reflection' : 'absorbed'}). $P = ${mirror ? '2' : ''}\\dfrac{I\\cos^2\\theta}{c} = ${mirror ? '2\\times' : ''}\\dfrac{${I}\\times${S(c2, 4)}}{3\\times10^8} = ${S(P * 1e6, 4)}\\ \\mu$Pa.${v === 1 ? ` $F = PA = ${S(P * 1e6, 4)}\\times${A} = ${S(ans, 4)}\\ \\mu$N.` : ''}`, trap: 'Use cos squared of the angle from the normal.' };
    },
    verify: (p) => { const c = Math.cos(p.th * PI / 180); return (p.mirror ? 2 : 1) * p.I * c * c / C0 * 1e6 * (p.v === 1 ? p.A : 1); } },
  { id: 'dn-g09', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'photocurrent',
    make(rng) {
      const v = int(rng, 0, 2); const lam = choose(rng, [300, 400, 500]); const Pw = choose(rng, [0.1, 0.5, 1, 2]); const eta = choose(rng, [0.001, 0.002, 0.005, 0.01]); const I1 = choose(rng, [20, 40, 80, 120]); const kd = choose(rng, [2, 3, 4]); const kI = choose(rng, [2, 3, 5]);
      let q; let ans; let unit; let sol; let dp = 1;
      if (v === 0) { const Nps = Pw * lam * 1e-9 / (H * C0); ans = Nps * eta * QE * 1e6; unit = 'μA'; q = `${Pw} W of light of wavelength ${lam} nm falls on a photocell. One photon in ${S(1 / eta)} liberates an electron, all of which are collected. Find the photocurrent (in $\\mu$A, 1 decimal). Use $h = 6.63\\times10^{-34}$ J s, $c = 3\\times10^8$ m/s, $e = 1.6\\times10^{-19}$ C.`; sol = `Photons per second $= \\dfrac{P\\lambda}{hc} = ${S(Nps, 4)}$. Electrons per second $= ${S(Nps, 4)}\\times${eta} = ${S(Nps * eta, 4)}$. $I = Ne = ${S(ans, 4)}\\ \\mu$A.`; }
      else if (v === 1) { ans = I1 / (kd * kd); unit = 'μA'; q = `A point source is at a certain distance from a photocell and the saturation current is ${I1} $\\mu$A. The source is moved to ${kd} times the distance. Find the new saturation current (in $\\mu$A, 2 decimals).`; sol = `Intensity $\\propto 1/d^2$, so the saturation current falls to $1/${kd * kd}$: $${I1}/${kd * kd} = ${S(ans, 4)}\\ \\mu$A. The stopping potential stays the same.`; dp = 2; }
      else { ans = I1 * kI; unit = 'μA'; q = `The saturation current of a photocell is ${I1} $\\mu$A. The intensity of the light (same frequency) is made ${kI} times larger. Find the new saturation current (in $\\mu$A).`; sol = `Saturation current $\\propto$ intensity, so $I = ${kI}\\times${I1} = ${ans}\\ \\mu$A. $K_{max}$ and $V_s$ do not change.`; dp = 0; }
      return { v, lam, Pw, eta, I1, kd, kI, q, answer: N(ans, dp), tol: TL(ans, dp), unit, sol };
    },
    verify: (p) => (p.v === 0 ? p.Pw * p.lam * 1e-9 / (H * C0) * p.eta * QE * 1e6 : p.v === 1 ? p.I1 / p.kd ** 2 : p.I1 * p.kI) },
  { id: 'dn-g10', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'Planck constant from a graph',
    make(rng) {
      const phi = choose(rng, [1.8, 2.0, 2.3, 2.5]); const f1 = choose(rng, [6, 6.5, 7]); const f2 = f1 + choose(rng, [1.5, 2, 2.5]);
      const V = (f) => H * f * 1e14 / QE - phi; const V1 = +V(f1).toFixed(2); const V2 = +V(f2).toFixed(2);
      const h = QE * (V2 - V1) / ((f2 - f1) * 1e14) / 1e-34;
      return { phi, f1, f2, V1, V2, q: `The stopping potential for a metal is ${V1} V at a frequency of $${f1}\\times10^{14}$ Hz and ${V2} V at $${f2}\\times10^{14}$ Hz. Find Planck's constant (in units of $10^{-34}$ J s, 2 decimals). Use $e = 1.6\\times10^{-19}$ C.`, answer: N(h, 2), tol: 0.15, unit: '×10⁻³⁴ J s',
        sol: `$V_s = (h/e)f - \\phi/e$, so the slope $= \\dfrac{V_2 - V_1}{f_2 - f_1} = \\dfrac{${S(V2 - V1, 4)}}{${S(f2 - f1)}\\times10^{14}} = ${S((V2 - V1) / (f2 - f1), 4)}\\times10^{-14}$ V s. $h = e\\times$ slope $= 1.6\\times10^{-19}\\times${S((V2 - V1) / (f2 - f1), 4)}\\times10^{-14} = ${S(h, 4)}\\times10^{-34}$ J s.`, trap: 'The slope uses the difference between the two points.' };
    },
    verify: () => 6.63 },
  { id: 'dn-g11', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'electron de Broglie wavelength',
    make(rng) {
      const v = int(rng, 0, 2); const V = choose(rng, [25, 50, 100, 150, 225, 400, 900, 2500]); const lamA = 12.27 / Math.sqrt(V);
      let q; let ans; let unit; let sol; let dp = 3;
      if (v === 0) { ans = lamA; unit = 'Å'; q = `An electron is accelerated from rest through ${V} V. Find its de Broglie wavelength (in Å, 3 decimals). Use $\\lambda = 12.27/\\sqrt V$ Å.`; sol = `$\\lambda = \\dfrac{12.27}{\\sqrt{${V}}} = \\dfrac{12.27}{${S(Math.sqrt(V), 4)}} = ${S(lamA, 4)}$ Å.`; }
      else if (v === 1) { ans = V; unit = 'V'; q = `An electron has a de Broglie wavelength of ${S(lamA, 4)} Å. Through what potential difference was it accelerated (in V, nearest whole number)? Use $\\lambda = 12.27/\\sqrt V$ Å.`; sol = `$\\sqrt V = 12.27/${S(lamA, 4)} = ${S(12.27 / lamA, 4)}$, so $V = ${S((12.27 / lamA) ** 2, 4)}$ V $\\approx ${V}$ V.`; dp = 0; }
      else { ans = lamA / 2; unit = 'Å'; q = `An electron accelerated through ${V} V has wavelength $\\lambda$. Through ${4 * V} V, what is the wavelength (in Å, 3 decimals)? Use $\\lambda = 12.27/\\sqrt V$ Å.`; sol = `$\\lambda\\propto V^{-1/2}$. For ${4 * V} V: $\\dfrac{12.27}{\\sqrt{${4 * V}}} = ${S(lamA / 2, 4)}$ Å, half of the earlier ${S(lamA, 4)} Å.`; }
      return { v, V, lamA, q, answer: N(ans, dp), tol: v === 1 ? Math.max(2, V * 0.01) : TL(ans, dp), unit, sol };
    },
    verify: (p) => (p.v === 0 ? H / Math.sqrt(2 * ME * QE * p.V) * 1e10 : p.v === 1 ? p.V : H / Math.sqrt(2 * ME * QE * 4 * p.V) * 1e10) },
  { id: 'dn-g12', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'de Broglie wavelength from energy',
    make(rng) {
      const pk = choose(rng, ['electron', 'proton', 'alpha', 'neutron']); const [name, m] = PARTS[pk]; const K = choose(rng, [10, 50, 100, 500, 1000]);
      const lam = H / Math.sqrt(2 * m * K * QE) * 1e12;
      return { pk, K, q: `Find the de Broglie wavelength of ${name} of kinetic energy ${K} eV (in pm, 3 significant figures). Use $h = 6.63\\times10^{-34}$ J s, $m = ${S(m * 1e27, 4)}\\times10^{-27}$ kg.`, answer: +S(lam, 3), tol: lam * 0.01, unit: 'pm',
        sol: `$p = \\sqrt{2mK} = \\sqrt{2\\times${S(m * 1e27, 4)}\\times10^{-27}\\times${K}\\times1.6\\times10^{-19}} = ${S(Math.sqrt(2 * m * K * QE) * 1e24, 4)}\\times10^{-24}$ kg m/s. $\\lambda = h/p = ${S(lam, 4)}$ pm.`, trap: 'Convert eV to joule and use the particle\'s own mass.' };
    },
    verify: (p) => { const m = PARTS[p.pk][1]; return Math.sqrt(H * H / (2 * m * p.K * QE)) * 1e12; } },
  { id: 'dn-g13', type: 'nat', level: 2, exams: exFor(2, 'nat'), sub: 'de Broglie from speed',
    make(rng) {
      const v = int(rng, 0, 2); let sp = choose(rng, [1, 2, 3, 5]) * 1e6;
      let q; let ans; let unit; let sol; let m;
      if (v === 0) { m = ME; ans = H / (m * sp) * 1e10; unit = 'Å'; q = `An electron moves at $${sp / 1e6}\\times10^6\\ \\mathrm{m\\,s^{-1}}$. Find its de Broglie wavelength (in Å, 3 decimals). Use $m = 9.1\\times10^{-31}$ kg, $h = 6.63\\times10^{-34}$ J s.`; sol = `$\\lambda = \\dfrac{h}{mv} = \\dfrac{6.63\\times10^{-34}}{9.1\\times10^{-31}\\times${sp / 1e6}\\times10^6} = ${S(ans, 4)}\\times10^{-10}$ m.`; }
      else if (v === 1) { m = MP; const sp2 = sp / 10; ans = H / (m * sp2) * 1e12; unit = 'pm'; q = `A proton moves at $${sp2 / 1e5}\\times10^5\\ \\mathrm{m\\,s^{-1}}$. Find its de Broglie wavelength (in pm, 3 decimals). Use $m_p = 1.67\\times10^{-27}$ kg, $h = 6.63\\times10^{-34}$ J s.`; sol = `$\\lambda = \\dfrac{h}{mv} = \\dfrac{6.63\\times10^{-34}}{1.67\\times10^{-27}\\times${sp2 / 1e5}\\times10^5} = ${S(ans, 4)}\\times10^{-12}$ m.`; sp = sp2; }
      else { m = choose(rng, [0.01, 0.05, 0.1, 0.2]); const s2 = choose(rng, [5, 10, 20, 40]); ans = H / (m * s2) / 1e-34; unit = '×10⁻³⁴ m'; q = `A ball of mass ${m} kg moves at ${s2} $\\mathrm{m\\,s^{-1}}$. Find its de Broglie wavelength (in units of $10^{-34}$ m, 2 decimals). Use $h = 6.63\\times10^{-34}$ J s.`; sol = `$\\lambda = \\dfrac{h}{mv} = \\dfrac{6.63\\times10^{-34}}{${m}\\times${s2}} = ${S(ans, 4)}\\times10^{-34}$ m, far too small to observe.`; sp = s2; }
      return { v, sp, m, q, answer: +S(ans, 3), tol: ans * 0.01, unit, sol };
    },
    verify: (p) => (p.v === 0 ? H / (ME * p.sp) * 1e10 : p.v === 1 ? H / (MP * p.sp) * 1e12 : H / (p.m * p.sp) / 1e-34) },
  { id: 'dn-g14', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'thermal de Broglie wavelength',
    make(rng) {
      const kind = choose(rng, ['neutron', 'helium']); const m = kind === 'neutron' ? MN : MA; const T = choose(rng, [77, 150, 300, 450, 600]);
      const lam = H / Math.sqrt(3 * m * KB * T) * 1e10;
      return { kind, T, q: `Find the de Broglie wavelength of ${kind === 'neutron' ? 'a thermal neutron' : 'a helium atom'} at ${T} K, taking its kinetic energy as $\\tfrac32k_BT$ (in Å, 3 decimals). Use $m = ${S(m * 1e27, 4)}\\times10^{-27}$ kg, $k_B = 1.38\\times10^{-23}$ J/K, $h = 6.63\\times10^{-34}$ J s.`, answer: +S(lam, 3), tol: lam * 0.01, unit: 'Å',
        sol: `$\\lambda = \\dfrac{h}{\\sqrt{2mK}} = \\dfrac{h}{\\sqrt{3mk_BT}} = \\dfrac{6.63\\times10^{-34}}{\\sqrt{3\\times${S(m * 1e27, 4)}\\times10^{-27}\\times1.38\\times10^{-23}\\times${T}}} = ${S(lam, 4)}$ Å.` };
    },
    verify: (p) => { const m = p.kind === 'neutron' ? MN : MA; const K = 1.5 * KB * p.T; return H / Math.sqrt(2 * m * K) * 1e10; } },
  { id: 'dn-g15', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'comparing de Broglie wavelengths',
    make(rng) {
      const pairs = [['a proton', 'an alpha particle', 1, 1, 4, 2], ['a proton', 'a deuteron', 1, 1, 2, 1], ['a deuteron', 'an alpha particle', 2, 1, 4, 2], ['an electron', 'a proton', 1, 1, 1836, 1]];
      const [n1, n2, m1, q1, m2, q2] = choose(rng, pairs); const mode = int(rng, 0, 2);
      let ans; let q; let sol;
      if (mode === 0) { ans = Math.sqrt(m2 * q2 / (m1 * q1)); q = `${n1[0].toUpperCase()}${n1.slice(1)} and ${n2} are each accelerated from rest through the same potential difference. Find $\\lambda_1/\\lambda_2$, the ratio of the wavelengths of the first to the second (2 decimals). Take the mass ratio $m_2/m_1 = ${m2 / m1}$ and charge ratio $q_2/q_1 = ${q2 / q1}$.`; sol = `$\\lambda = \\dfrac{h}{\\sqrt{2mqV}}$. $\\dfrac{\\lambda_1}{\\lambda_2} = \\sqrt{\\dfrac{m_2q_2}{m_1q_1}} = \\sqrt{${S(m2 / m1)}\\times${S(q2 / q1)}} = ${S(ans, 4)}$.`; }
      else if (mode === 1) { ans = Math.sqrt(m2 / m1); q = `${n1[0].toUpperCase()}${n1.slice(1)} and ${n2} have the same kinetic energy. Find $\\lambda_1/\\lambda_2$ (2 decimals). Take the mass ratio $m_2/m_1 = ${m2 / m1}$.`; sol = `$\\lambda = h/\\sqrt{2mK}\\propto m^{-1/2}$ at equal $K$. $\\dfrac{\\lambda_1}{\\lambda_2} = \\sqrt{\\dfrac{m_2}{m_1}} = \\sqrt{${S(m2 / m1)}} = ${S(ans, 4)}$.`; }
      else { ans = m2 / m1; q = `${n1[0].toUpperCase()}${n1.slice(1)} and ${n2} move with the same speed. Find $\\lambda_1/\\lambda_2$ (2 decimals). Take the mass ratio $m_2/m_1 = ${m2 / m1}$.`; sol = `$\\lambda = h/mv$ and $v$ is equal, so $\\lambda_1/\\lambda_2 = m_2/m_1 = ${S(ans, 4)}$.`; }
      return { mode, m1, q1, m2, q2, q, answer: N(ans, 2), tol: TL(ans, 2), sol, trap: 'Same speed, same energy and same voltage give different mass dependences.' };
    },
    verify: (p) => (p.mode === 0 ? Math.sqrt(p.m2 * p.q2) / Math.sqrt(p.m1 * p.q1) : p.mode === 1 ? Math.sqrt(p.m2) / Math.sqrt(p.m1) : p.m2 / p.m1) },
  { id: 'dn-g16', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'electron diffraction',
    make(rng) {
      const v = int(rng, 0, 2); const d = choose(rng, [2.15, 2.0, 2.5, 3.0]); const ph = choose(rng, [30, 40, 50, 60]); const th = choose(rng, [55, 60, 65, 70]); const dd = choose(rng, [0.9, 1.0, 1.2, 2.0]);
      let q; let ans; let unit; let sol;
      if (v === 0) { ans = d * Math.sin(ph * PI / 180); unit = 'Å'; q = `Electrons are scattered from rows of surface atoms spaced ${d} Å apart and the first-order maximum appears at ${ph}° from the incident direction. Using $\\lambda = d\\sin\\phi$, find the wavelength (in Å, 3 decimals).`; sol = `$\\lambda = d\\sin\\phi = ${d}\\times\\sin${ph}^\\circ = ${d}\\times${S(Math.sin(ph * PI / 180), 4)} = ${S(ans, 4)}$ Å.`; }
      else if (v === 1) { const lam = d * Math.sin(ph * PI / 180); ans = d; unit = 'Å'; q = `Electrons of wavelength ${S(lam, 4)} Å give a first-order maximum at ${ph}° when scattered from surface rows. Find the row spacing (in Å, 2 decimals), using $\\lambda = d\\sin\\phi$.`; sol = `$d = \\dfrac{\\lambda}{\\sin\\phi} = \\dfrac{${S(lam, 4)}}{\\sin${ph}^\\circ} = \\dfrac{${S(lam, 4)}}{${S(Math.sin(ph * PI / 180), 4)}} = ${S(ans, 4)}$ Å.`; }
      else { ans = 2 * dd * Math.sin(th * PI / 180); unit = 'Å'; q = `Electrons are diffracted from crystal planes of spacing ${dd} Å and the first-order Bragg maximum occurs at a glancing angle of ${th}°. Using $2d\\sin\\theta = \\lambda$, find the wavelength (in Å, 3 decimals).`; sol = `$\\lambda = 2d\\sin\\theta = 2\\times${dd}\\times\\sin${th}^\\circ = 2\\times${dd}\\times${S(Math.sin(th * PI / 180), 4)} = ${S(ans, 4)}$ Å.`; }
      return { v, d, ph, th, dd, q, answer: N(ans, v === 1 ? 2 : 3), tol: v === 1 ? 0.011 : TL(ans, 3), unit, sol, trap: v === 2 ? 'In Bragg diffraction the angle is measured from the planes, and there is a factor 2.' : undefined };
    },
    verify: (p) => (p.v === 0 ? p.d * Math.sin(p.ph * PI / 180) : p.v === 1 ? p.d * Math.sin(p.ph * PI / 180) / Math.sin(p.ph * PI / 180) : 2 * p.dd * Math.sin(p.th * PI / 180)) },
  { id: 'dn-g17', type: 'mcq', level: 2, exams: exFor(2, 'mcq'), sub: 'effects of changing the light',
    make(rng) {
      const v = int(rng, 0, 3); const k = choose(rng, [2, 3, 4]);
      let q; let correct; let wrongs; let sol;
      if (v === 0) { q = `In a photocell the intensity of the light is made ${k} times larger (same frequency, above threshold). The stopping potential`; correct = 'stays the same'; wrongs = [`becomes ${k} times larger`, `becomes $1/${k}$ as large`, `becomes ${k * k} times larger`]; sol = `$eV_s = hf - \\phi$ has no intensity term, so the stopping potential is unchanged. (The saturation current becomes ${k} times larger.)`; }
      else if (v === 1) { q = `In a photocell the intensity of the light is made ${k} times larger (same frequency, above threshold). The saturation current`; correct = `becomes ${k} times larger`; wrongs = ['stays the same', `becomes $1/${k}$ as large`, `becomes ${k * k} times larger`]; sol = `The number of photons per second is ${k} times larger, so ${k} times as many electrons are released each second: the saturation current is ${k} times larger.`; }
      else if (v === 2) { q = `A point source of light illuminates a photocell. The source is moved to ${k} times the distance. The maximum kinetic energy of the photoelectrons`; correct = 'stays the same'; wrongs = [`becomes $1/${k}^2$ as large`, `becomes $1/${k}$ as large`, `becomes ${k} times larger`]; sol = `Moving the source changes the intensity (by $1/${k}^2$) and so the number of photons per second, but not the energy of each photon. $K_{max} = hf - \\phi$ is unchanged.`; }
      else { q = `A point source of light illuminates a photocell. The source is moved to ${k} times the distance. The saturation current`; correct = `becomes $1/${k * k}$ as large`; wrongs = [`becomes $1/${k}$ as large`, 'stays the same', `becomes ${k * k} times larger`]; sol = `Intensity $\\propto 1/d^2$. The number of photons per second hitting the cathode falls by a factor ${k * k}, so the saturation current falls by that factor.`; }
      const o = shuffleOpts(rng, correct, wrongs);
      return { v, k, correct, q, options: o.options, answer: o.answer, sol, trap: 'Intensity changes the number of photons, not the energy of each photon.' };
    },
    verify: (p) => p.options.indexOf(p.correct) },
  { id: 'dn-g18', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'photon and electron of the same energy',
    make(rng) {
      const E = choose(rng, [1, 10, 25, 50, 100, 400]); const rat = (1240 / E) / (1.227 / Math.sqrt(E)); const v = int(rng, 0, 1);
      const lph = 1240 / E; const le = 1.227 / Math.sqrt(E);
      return { E, v, q: v === 0 ? `A photon and an electron each have an energy of ${E} eV (kinetic, for the electron). Find the ratio $\\lambda_{photon}/\\lambda_{electron}$ (nearest whole number or 1 decimal). Use $\\lambda_{ph} = 1240/E$ nm and $\\lambda_e = 1.227/\\sqrt E$ nm with $E$ in eV.` : `A photon and an electron each have an energy of ${E} eV (kinetic, for the electron). Find the difference $\\lambda_{photon} - \\lambda_{electron}$ (in nm, 2 decimals). Use $\\lambda_{ph} = 1240/E$ nm and $\\lambda_e = 1.227/\\sqrt E$ nm with $E$ in eV.`, answer: N(v === 0 ? rat : lph - le, v === 0 ? 1 : 2), tol: v === 0 ? Math.max(0.1, rat * 0.01) : Math.max(0.02, (lph - le) * 0.01), unit: v === 0 ? undefined : 'nm',
        sol: `$\\lambda_{ph} = 1240/${E} = ${S(lph, 4)}$ nm. $\\lambda_e = 1.227/\\sqrt{${E}} = ${S(le, 4)}$ nm. ${v === 0 ? `Ratio $= ${S(rat, 4)}$.` : `Difference $= ${S(lph - le, 4)}$ nm.`}`, trap: 'The photon wavelength goes as 1/E; the electron wavelength as 1/sqrt(E).' };
    },
    verify: (p) => { const hcE = H * C0 / (p.E * QE) * 1e9; const le = H / Math.sqrt(2 * ME * p.E * QE) * 1e9; return p.v === 0 ? hcE / le : hcE - le; } },
  { id: 'dn-g19', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'photoelectrons in a magnetic field',
    make(rng) {
      const lam = choose(rng, [150, 200, 250, 300]); const phi = choose(rng, [2.0, 3.0, 4.0]); const B = choose(rng, [0.5, 1, 2, 5]) * 1e-3; const E = 1240 / lam; const K = E - phi;
      const v = Math.sqrt(2 * K * QE / ME); const r = ME * v / (QE * B) * 1e3;
      return { lam, phi, B, q: `Light of wavelength ${lam} nm falls on a metal of work function ${phi} eV. The fastest photoelectrons enter a uniform magnetic field of ${B * 1e3} mT perpendicular to their velocity. Find the radius of their circular path (in mm, 2 decimals). Use $hc = 1240$ eV nm, $m = 9.1\\times10^{-31}$ kg, $e = 1.6\\times10^{-19}$ C.`, answer: N(r, 2), tol: TL(r, 2), unit: 'mm',
        sol: `$K_{max} = 1240/${lam} - ${phi} = ${S(K, 4)}$ eV. $v = \\sqrt{2K/m} = ${S(v / 1e5, 4)}\\times10^5\\ \\mathrm{m\\,s^{-1}}$. $r = \\dfrac{mv}{eB} = \\dfrac{9.1\\times10^{-31}\\times${S(v, 4)}}{1.6\\times10^{-19}\\times${S(B, 3)}} = ${S(r / 1e3, 4)}$ m $= ${S(r, 4)}$ mm.` };
    },
    verify: (p) => { const K = 1240 / p.lam - p.phi; return Math.sqrt(2 * ME * K * QE) / (QE * p.B) * 1e3; } },
  { id: 'dn-g20', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'charging of an isolated sphere',
    make(rng) {
      const R = choose(rng, [0.5, 1, 2, 5]) * 1e-2; const E = choose(rng, [5, 5.5, 6, 6.2]); const phi = choose(rng, [4.0, 4.5, 4.7]); const Vs = E - phi; const qq = Vs * R / 9e9; const v = int(rng, 0, 2);
      const ans = v === 0 ? Vs : v === 1 ? qq * 1e12 : qq / QE / 1e7;
      const what = v === 0 ? 'the final potential of the sphere (in V, 2 decimals)' : v === 1 ? 'the final charge on the sphere (in pC, 2 decimals)' : 'the number of electrons lost (in units of $10^7$, 2 decimals)';
      return { R, E, phi, v, q: `An isolated metal sphere of radius ${R * 100} cm and work function ${phi} eV is illuminated with photons of energy ${E} eV until the emission stops. Find ${what}. Use $\\dfrac{1}{4\\pi\\varepsilon_0} = 9\\times10^9\\ \\mathrm{N\\,m^2\\,C^{-2}}$, $e = 1.6\\times10^{-19}$ C.`, answer: N(ans, 2), tol: TL(ans, 2), unit: v === 0 ? 'V' : v === 1 ? 'pC' : '×10⁷',
        sol: `Emission stops when the sphere's potential equals the stopping potential: $V = (${E} - ${phi}) = ${S(Vs, 3)}$ V. $q = \\dfrac{VR}{k} = \\dfrac{${S(Vs, 3)}\\times${R}}{9\\times10^9} = ${S(qq * 1e12, 4)}$ pC. Electrons lost $= q/e = ${S(qq / QE / 1e7, 4)}\\times10^7$.`, trap: 'The sphere charges up until the potential equals the stopping potential.' };
    },
    verify: (p) => { const Vs = p.E - p.phi; return p.v === 0 ? Vs : p.v === 1 ? p.R * Vs / 9e9 * 1e12 : p.R * Vs / 9e9 / QE / 1e7; } },
  { id: 'dn-g21', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'work function from two stopping potentials',
    make(rng) {
      const lams = [620, 496, 400, 310, 248, 200]; const i = int(rng, 0, 3); const j = i + int(rng, 1, 2); const l1 = lams[i]; const l2 = lams[Math.min(j, 5)]; const phi = choose(rng, [1.2, 1.5, 1.8, 1.9]);
      const E1 = 1240 / l1; const E2 = 1240 / l2; const ok = E1 - phi > 0.05; const ph = ok ? phi : Math.max(0.5, E1 - 0.3);
      const V1 = +(E1 - ph).toFixed(2); const V2 = +(E2 - ph).toFixed(2); const v = int(rng, 0, 1);
      const phiAns = (V2 * l2 - V1 * l1) / (l1 - l2); const lam0 = 1240 / phiAns;
      return { l1, l2, V1, V2, v, ph, q: `For a metal, the stopping potential is ${V1} V for light of wavelength ${l1} nm and ${V2} V for ${l2} nm. Without using the value of $hc$, find the ${v === 0 ? 'work function (in eV, 2 decimals)' : 'threshold wavelength (in nm, nearest whole number; take $hc = 1240$ eV nm for the last step)'}.`, answer: N(v === 0 ? phiAns : lam0, v === 0 ? 2 : 0), tol: v === 0 ? 0.03 : Math.max(2, lam0 * 0.01), unit: v === 0 ? 'eV' : 'nm',
        sol: `$\\dfrac{hc}{\\lambda_1} = eV_1 + \\phi$ and $\\dfrac{hc}{\\lambda_2} = eV_2 + \\phi$. Multiply by the wavelengths and equate $hc$: $\\lambda_1(V_1 + \\phi) = \\lambda_2(V_2 + \\phi)$, so $\\phi = \\dfrac{V_2\\lambda_2 - V_1\\lambda_1}{\\lambda_1 - \\lambda_2} = \\dfrac{${V2}\\times${l2} - ${V1}\\times${l1}}{${l1} - ${l2}} = ${S(phiAns, 4)}$ eV.${v === 1 ? ` $\\lambda_0 = 1240/${S(phiAns, 4)} = ${S(lam0, 4)}$ nm.` : ''}`, trap: 'Eliminate hc between the two equations; do not guess it.' };
    },
    verify: (p) => { const hc = (p.V2 - p.V1) / (1 / p.l2 - 1 / p.l1); const phi = hc / p.l1 - p.V1; return p.v === 0 ? phi : 1240 / phi; } },
  { id: 'dn-g22', type: 'mcq', level: 3, exams: exFor(3, 'mcq'), sub: 'which metals emit',
    make(rng) {
      const lam = choose(rng, [300, 350, 400, 450, 500, 550]); const E = 1240 / lam;
      const set = choose(rng, [[['sodium', 2.3], ['zinc', 4.3], ['caesium', 2.1]], [['potassium', 2.3], ['platinum', 5.6], ['calcium', 2.9]], [['lithium', 2.9], ['aluminium', 4.1], ['barium', 2.5]], [['copper', 4.7], ['magnesium', 3.7], ['rubidium', 2.2]]]);
      const em = set.filter(([, f]) => f < E).map(([n]) => n); const names = set.map(([n]) => n);
      const lab = (a) => (a.length ? (a.length === 3 ? 'all three metals' : `${a.join(' and ')} only`) : 'none of the metals');
      const correct = lab(em);
      const cands = [lab([names[0]]), lab([names[1]]), lab([names[2]]), lab([names[0], names[1]]), lab([names[0], names[2]]), lab([names[1], names[2]]), lab(names), lab([])];
      const wrongs = [...new Set(cands.filter((c) => c !== correct))].slice(0, 3);
      const o = shuffleOpts(rng, correct, wrongs);
      return { lam, set, correct, q: `Light of wavelength ${lam} nm ($hc = 1240$ eV nm) falls on three metals: ${set.map(([n, f]) => `${n} ($\\phi = ${f}$ eV)`).join(', ')}. Photoelectrons are emitted from`, options: o.options, answer: o.answer,
        sol: `$E = 1240/${lam} = ${S(E, 4)}$ eV. A metal emits if $\\phi < E$: ${set.map(([n, f]) => `${n} ${f < E ? '(yes)' : '(no)'}`).join(', ')}.`, trap: 'Compare the photon energy with each work function.' };
    },
    verify: (p) => { const E = 1240 / p.lam; const em = p.set.filter(([, f]) => f < E).map(([n]) => n); const names = p.set.map(([n]) => n); const lab = (a) => (a.length ? (a.length === 3 ? 'all three metals' : `${a.join(' and ')} only`) : 'none of the metals'); return p.options.indexOf(lab(em)); } },
  { id: 'dn-g23', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'scaling the photon energy',
    make(rng) {
      const E = choose(rng, [4, 5, 6, 7.5]); const Vs = choose(rng, [1, 1.5, 2, 2.5]); const phi = E - Vs; const k = choose(rng, [1.5, 2, 3]); const Vn = k * E - phi;
      return { E, Vs, k, q: `Photons of energy ${E} eV give a stopping potential of ${Vs} V on a metal. If the frequency of the light is made ${k} times larger, find the new stopping potential (in V, 2 decimals).`, answer: N(Vn, 2), tol: 0.011, unit: 'V',
        sol: `$\\phi = E - eV_s = ${E} - ${Vs} = ${S(phi, 3)}$ eV. New photon energy $= ${k}\\times${E} = ${S(k * E, 4)}$ eV. $eV_s' = ${S(k * E, 4)} - ${S(phi, 3)} = ${S(Vn, 4)}$ eV, so $V_s' = ${S(Vn, 4)}$ V.`, trap: `The stopping potential is not ${k} times larger; the work function is subtracted.` };
    },
    verify: (p) => p.k * p.E - (p.E - p.Vs) },
  { id: 'dn-g24', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'mixed',
    make(rng) {
      const nf = choose(rng, [1, 2, 2, 3]); const ni = nf + choose(rng, [1, 2]); const E = 13.6 * (1 / (nf * nf) - 1 / (ni * ni)); const phi = choose(rng, [1.0, 1.5, 2.0, 4.0, 5.0]);
      const ok = E > phi + 0.05; const ph = ok ? phi : Math.max(0.5, +(E - 1.0).toFixed(1)); const K = E - ph;
      return { ni, nf, ph, q: `The photon emitted when the electron of a hydrogen atom falls from $n = ${ni}$ to $n = ${nf}$ falls on a metal of work function ${ph} eV. Find the maximum kinetic energy of the photoelectrons (in eV, 2 decimals). Use $E_n = -13.6/n^2$ eV.`, answer: N(K, 2), tol: 0.011, unit: 'eV',
        sol: `$E = 13.6\\left(\\dfrac{1}{${nf}^2} - \\dfrac{1}{${ni}^2}\\right) = ${S(E, 4)}$ eV. $K_{max} = ${S(E, 4)} - ${ph} = ${S(K, 4)}$ eV.` };
    },
    verify: (p) => 13.6 * (1 / (p.nf * p.nf) - 1 / (p.ni * p.ni)) - p.ph },
  { id: 'dn-g25', type: 'nat', level: 4, exams: exFor(4, 'nat'), sub: 'light pressure with partial reflection',
    make(rng) {
      const r0 = choose(rng, [0.2, 0.4, 0.5, 0.8]); const I = choose(rng, [1000, 1400, 2000]); const A = choose(rng, [10, 25, 50, 100]); const v = int(rng, 0, 1);
      const P = (1 + r0) * I / C0; const F = P * A;
      const ans = v === 0 ? P * 1e6 : F * 1e3;
      return { r0, I, A, v, q: `A surface reflects a fraction ${r0} of the light falling normally on it and absorbs the rest. Intensity is ${I} $\\mathrm{W\\,m^{-2}}$. ${v === 0 ? 'Find the radiation pressure (in $\\mu$Pa, 2 decimals).' : `The area is ${A} $\\mathrm{m^2}$. Find the force (in mN, 3 decimals).`} Use $c = 3\\times10^8$ m/s.`, answer: N(ans, v === 0 ? 2 : 3), tol: TL(ans, v === 0 ? 2 : 3), unit: v === 0 ? 'μPa' : 'mN',
        sol: `Absorbed light gives momentum $I(1 - r)/c$ per second per area; reflected light gives $2Ir/c$. Total pressure $= \\dfrac{I}{c}\\left[(1 - r) + 2r\\right] = \\dfrac{(1 + r)I}{c} = \\dfrac{${S(1 + r0)}\\times${I}}{3\\times10^8} = ${S(P * 1e6, 4)}\\ \\mu$Pa.${v === 1 ? ` $F = PA = ${S(F * 1e3, 4)}$ mN.` : ''}`, trap: 'Partial reflection: pressure is (1 + r) I / c.' };
    },
    verify: (p) => { const a = p.I * (1 - p.r0) / C0 + 2 * p.I * p.r0 / C0; return p.v === 0 ? a * 1e6 : a * p.A * 1e3; } },
  { id: 'dn-g26', type: 'nat', level: 3, exams: exFor(3, 'nat'), sub: 'X-ray cut-off',
    make(rng) {
      const V = choose(rng, [10, 15, 20, 30, 40, 50, 100]) * 1e3; const v = int(rng, 0, 2); const lam = 1240 / V * 1e3;
      let q; let ans; let unit; let sol; let dp = 2;
      if (v === 0) { ans = lam; unit = 'pm'; q = `Electrons accelerated through ${V / 1e3} kV strike a target and produce X-rays. Find the shortest wavelength emitted (in pm, 2 decimals). Use $hc = 1240$ eV nm.`; sol = `The most energetic photon takes all the electron's energy: $eV = hc/\\lambda_{min}$. $\\lambda_{min} = \\dfrac{1240}{${V}}$ nm $= ${S(1240 / V, 4)}$ nm $= ${S(lam, 4)}$ pm.`; }
      else if (v === 1) { ans = V / 1e3; unit = 'kV'; q = `An X-ray tube has a minimum wavelength of ${S(lam, 4)} pm. Find the accelerating voltage (in kV, 1 decimal). Use $hc = 1240$ eV nm.`; sol = `$V = \\dfrac{hc}{e\\lambda_{min}} = \\dfrac{1240\\ \\mathrm{eV\\,nm}}{${S(lam / 1e3, 4)}\\ \\mathrm{nm}} = ${S(V, 4)}$ V $= ${S(V / 1e3, 4)}$ kV.`; dp = 1; }
      else { ans = V / 1e3; unit = 'keV'; q = `Find the greatest photon energy (in keV) produced when electrons are accelerated through ${V / 1e3} kV.`; sol = `The photon energy cannot exceed the kinetic energy of one electron, $eV = ${V / 1e3}$ keV.`; dp = 1; }
      return { v, V, q, answer: N(ans, dp), tol: TL(ans, dp), unit, sol };
    },
    verify: (p) => (p.v === 0 ? H * C0 / (p.V * QE) * 1e12 : p.V / 1e3) },
];
// ---------- expansion block: more hard items, matches, multi-correct, passages and templates ----------
{
const XR = String.raw;
const XEXB = { 1: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'], 2: ['keam', 'cusat', 'comedk', 'jee-main', 'neet'], 3: ['jee-main', 'neet', 'keam', 'comedk'], 4: ['jee-main', 'jee-adv', 'neet'], 5: ['jee-adv'] };
let xk = 153; let xc = 0;
const xid = () => `dn-${String(++xk).padStart(3, '0')}`;
const XPOS = [2, 0, 3, 1, 1, 3, 0, 2];
const xex = (level, type, sub) => (type === 'mcq' && level <= 3 && ((s)=>true)(sub) ? [...XEXB[level], 'cuet'] : XEXB[level]);
const xb = (level, sub, o) => ({ id: xid(), level, exams: xex(level, o.type, sub), sub, ...o });
const xm = (level, sub, q, correct, wrongs, sol, o = {}) => {
  const pos = XPOS[xc++ % 8]; const options = [...wrongs]; options.splice(pos, 0, correct);
  return xb(level, sub, { type: 'mcq', format: 'single', q, options, answer: pos, sol, ...o });
};
const xi = (level, sub, q, value, sol, o = {}) => {
  const answer = Math.round(value); if (Math.abs(value - answer) > 1e-6) throw new Error('not an integer: ' + value + ' ' + q.slice(0, 60));
  return xb(level, sub, { type: 'nat', format: 'integer', q, answer, tol: 0, calc: () => answer, sol, ...o });
};
const xn = (level, sub, q, value, tol, dp, sol, o = {}) => {
  const answer = +value.toFixed(dp);
  return xb(level, sub, { type: 'nat', format: 'numeric', q, answer, tol, calc: () => answer, sol, ...o });
};
const xs = (level, sub, q, options, answer, sol, o = {}) => xb(level, sub, { type: 'msq', format: 'multi', q, options, answer, sol, ...o });
const XA = ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'];
const xa = (level, sub, A, R, answer, sol, o = {}) => xb(level, sub, { type: 'mcq', format: 'assertion', q: `<b>Assertion (A):</b> ${A}<br><b>Reason (R):</b> ${R}`, options: XA, answer, sol, ...o });
const XS = ['Both Statement I and Statement II are true', 'Both Statement I and Statement II are false', 'Statement I is true but Statement II is false', 'Statement I is false but Statement II is true'];
const xt = (level, sub, I, II, answer, sol, o = {}) => xb(level, sub, { type: 'mcq', format: 'statements', q: `<b>Statement I:</b> ${I}<br><b>Statement II:</b> ${II}`, options: XS, answer, sol, ...o });
const xmatch = (level, sub, group, q, correct, sol, o = {}) => {
  const L = correct.split(', ').map((s) => s.split('-')); const rs = L.map((x) => x[1]);
  const mk = (p) => L.map((x, i) => `${x[0]}-${p[i]}`).join(', ');
  const swaps = [[0, 1], [2, 3], [1, 2], [0, 3], [0, 2], [1, 3]]; const wr = [];
  for (let t = 0; t < 6 && wr.length < 3; t++) { const [i, j] = swaps[(t + xc) % 6]; const p = [...rs]; [p[i], p[j]] = [p[j], p[i]]; const s = mk(p); if (s !== correct && !wr.includes(s)) wr.push(s); }
  if (wr.length < 3) throw new Error('match options');
  const pos = XPOS[xc++ % 8]; const options = [...wr]; options.splice(pos, 0, correct);
  return xb(level, sub, { type: 'mcq', format: 'match', group, q, options, answer: pos, sol, ...o });
};
const xp = (extra) => (level, sub, group, q, ...rest) => extra(level, sub, q, ...rest);
const XG = (n, level, type, sub, make, verify) => ({ id: `dn-g${n}`, type, level, exams: xex(level, type, sub), sub, make, verify });
const f3 = (v) => fmt(v, 3);
const sg = (x, sig = 3) => String(+Number(x).toPrecision(sig));
const XPY = (o) => ({ format: 'passage', ...o });
const XH = 6.63e-34; const XCL = 3e8; const XQE = 1.6e-19; const XME = 9.1e-31; const XMP = 1.67e-27; const XHC = 1240; const XE0 = 8.85e-12; const tx = (x) => { const e = Math.floor(Math.log10(Math.abs(x))); return `${+(x / 10 ** e).toPrecision(3)}\\times10^{${e}}`; }; const XPI = Math.PI;
const HCN = XR`$hc = 1240$ eV nm`;
Object.assign(groups, {
  xm1: { title: 'Stopping potential against frequency (one metal, work function phi)',
    list1: ['A. Slope of the straight line', 'B. Intercept on the frequency axis', 'C. Intercept on the potential axis (line extended)', 'D. Using a metal of larger work function'],
    list2: [r`p. $\dfrac he$`, r`q. threshold frequency $f_0$`, r`r. $-\dfrac{\phi}{e}$`, r`s. a parallel line shifted to the right`] },
  xm2: { title: 'de Broglie wavelength in different forms',
    list1: ['A. Electron accelerated through $V$ volts', 'B. Particle of mass $m$ and kinetic energy $K$', 'C. Particle of momentum $p$', 'D. Gas atom of mass $m$ at temperature $T$ (rms speed)'],
    list2: [r`p. $\dfrac{12.27}{\sqrt V}$ angstrom`, r`q. $\dfrac{h}{\sqrt{2mK}}$`, r`r. $\dfrac hp$`, r`s. $\dfrac{h}{\sqrt{3mk_BT}}$`] },
  xm3: { title: 'Effect of changing the light (same metal, frequency above threshold)',
    list1: ['A. Intensity doubled', 'B. Frequency increased', 'C. Wavelength decreased', 'D. Frequency made less than threshold'],
    list2: [r`p. saturation current doubles; stopping potential unchanged`, r`q. stopping potential rises; maximum kinetic energy rises`, r`r. maximum kinetic energy rises (same as for frequency)`, r`s. no emission at any intensity`] },
  xm4: { title: 'Momentum and force of light (beam power P, wavelength lambda)',
    list1: ['A. Momentum of one photon', 'B. Force on a perfect absorber (normal incidence)', 'C. Force on a perfect reflector (normal incidence)', 'D. Pressure on a perfect absorber at intensity $I$'],
    list2: [r`p. $\dfrac h\lambda$`, r`q. $\dfrac Pc$`, r`r. $\dfrac{2P}{c}$`, r`s. $\dfrac Ic$`] },
  xm5: { title: 'Two metals A and B with work functions phi_A < phi_B, lit by the same light that ejects electrons from both',
    list1: ['A. Maximum kinetic energy of the photoelectrons', 'B. Threshold frequency', 'C. Slope of the $V_0$ against $f$ graph', 'D. Work function'],
    list2: [r`p. greater for A`, r`q. greater for B`, r`r. the same for both`, r`s. smaller for A`] },
  xm6: { title: 'Matter waves',
    list1: ['A. Electron accelerated through 100 V', 'B. Proton and electron with equal speeds', 'C. Doubling the speed of a particle', 'D. Doubling the mass at the same speed'],
    list2: [r`p. $\lambda\approx0.123$ nm`, r`q. electron wavelength is larger by about 1836`, r`r. $\lambda$ halves`, r`s. $\lambda$ halves (same as for speed)`] },
  xm7: { title: 'Photon and particle of the same wavelength (lambda)',
    list1: ['A. Momentum', 'B. Energy of the photon', 'C. Kinetic energy of the (non-relativistic) particle', 'D. Speed of the photon'],
    list2: [r`p. $\dfrac h\lambda$ for both`, r`q. $\dfrac{hc}{\lambda}$`, r`r. $\dfrac{h^2}{2m\lambda^2}$`, r`s. $c$`] },
  xm8: { title: 'Photoelectric emission: statements and their physical cause',
    list1: ['A. Maximum kinetic energy rises with frequency', 'B. No emission below threshold', 'C. Emission is instantaneous', 'D. Saturation current is proportional to intensity'],
    list2: [r`p. $K_{\max} = hf - \phi$`, r`q. a photon cannot give an electron less than $\phi$`, r`r. one photon gives all its energy to one electron`, r`s. more photons per second free more electrons`] },
  xp1: { title: 'A photocell',
    passage: r`<p>Light of wavelength 400 nm and intensity $2.0\ \mathrm{W\,m^{-2}}$ falls on a metal plate of area $1.0\times10^{-4}\ \mathrm{m^2}$ with work function 2.3 eV. On average one electron is emitted for every 100 photons absorbed. Take $h = 6.63\times10^{-34}$ J s, $c = 3\times10^{8}$ m/s, $e = 1.6\times10^{-19}$ C.</p>` },
  xp2: { title: 'Electron diffraction',
    passage: r`<p>Electrons accelerated from rest through 100 V strike a crystal whose planes are 0.20 nm apart. Use $h = 6.63\times10^{-34}$ J s, $m_e = 9.1\times10^{-31}$ kg and $e = 1.6\times10^{-19}$ C.</p>` },
});

// ---------- L2 ----------
items.push(
  xm(2, 'photon energy in eV', XR`The energy of a photon of wavelength 620 nm is about (${HCN}).`, '2.0 eV', ['3.1 eV', '1.0 eV', '0.5 eV'],
    XR`$E = \dfrac{hc}{\lambda} = \dfrac{1240\ \mathrm{eV\,nm}}{620\ \mathrm{nm}} = 2.0$ eV.`),
  xm(2, 'stopping potential', XR`Light of photon energy 4.0 eV falls on a metal of work function 2.0 eV. The stopping potential is`, '2.0 V', ['4.0 V', '6.0 V', '1.0 V'],
    XR`$eV_0 = K_{\max} = E-\phi = 4.0-2.0 = 2.0$ eV, so $V_0 = 2.0$ V.`),
  xn(2, 'de Broglie', XR`An electron is accelerated from rest through 150 V. Find its de Broglie wavelength in angstrom ($1\ \text{Å} = 10^{-10}$ m).`, 12.27 / Math.sqrt(150), 0.02, 2,
    XR`$\lambda = \dfrac{12.27}{\sqrt V}$ Å $=\dfrac{12.27}{\sqrt{150}} = 1.00$ Å.`, { unit: 'Å' }),
  xa(2, 'time lag', XR`Photoelectric emission from a metal starts instantly when light of suitable frequency falls on it.`, XR`A photon gives all its energy to a single electron in one event.`, 0,
    XR`The energy needed is delivered in one step by one photon, with no need to build up energy gradually, so there is no time lag. R explains A.`),
  xt(2, 'photon', XR`A photon has zero rest mass.`, XR`A photon has momentum $h/\lambda$.`, 0,
    XR`Both are true: $E = pc$ for a massless particle, so $p = \dfrac{E}{c} = \dfrac{h}{\lambda}$.`),
  xm(2, 'intensity and photocurrent', XR`The intensity of light of a fixed frequency (above threshold) is doubled. The stopping potential and the saturation current change as`, 'stopping potential unchanged, saturation current doubled', ['stopping potential doubled, saturation current unchanged', 'both doubled', 'both unchanged'],
    XR`$K_{\max}$ (hence $V_0$) depends only on frequency and the metal. The number of photons per second doubles, so twice as many electrons are emitted per second: the saturation current doubles.`),
  xmatch(2, 'effects of changing the light', 'xm3', XR`Match each change in List I with its effect in List II.`, 'A-p, B-q, C-r, D-s',
    XR`Intensity doubled: more electrons, same $K_{\max}$ (p). Higher frequency: larger $K_{\max}$ and $V_0$ (q). Shorter wavelength is higher frequency: $K_{\max}$ larger (r). Below threshold: nothing at any intensity (s).`),
);

// ---------- L3 ----------
items.push(
  xn(3, 'threshold wavelength', XR`The work function of a metal is 2.3 eV. Find its threshold wavelength, in nm (${HCN}).`, 1240 / 2.3, 1, 0,
    XR`$\lambda_0 = \dfrac{hc}{\phi} = \dfrac{1240}{2.3} = 539$ nm.`, { unit: 'nm' }),
  xi(3, 'stopping potential', XR`Light of wavelength 400 nm falls on a metal of work function 2.1 eV. The stopping potential in volts is (${HCN})`, 1240 / 400 - 2.1,
    XR`Photon energy $=\dfrac{1240}{400} = 3.1$ eV. $eV_0 = 3.1-2.1 = 1.0$ eV, so $V_0 = 1$ V.`, { unit: 'V' }),
  xm(3, 'photon momentum', XR`The momentum of a photon of wavelength 500 nm is ($h = 6.63\times10^{-34}$ J s)`, XR`$1.33\times10^{-27}$ kg m/s`, [XR`$4.0\times10^{-19}$ kg m/s`, XR`$1.33\times10^{-18}$ kg m/s`, XR`$3.3\times10^{-28}$ kg m/s`],
    XR`$p = \dfrac h\lambda = \dfrac{6.63\times10^{-34}}{5\times10^{-7}} = 1.33\times10^{-27}$ kg m/s. ($4.0\times10^{-19}$ is the energy in joules, not the momentum.)`),
  xi(3, 'photons per second', XR`A light source of wavelength 1.0 $\mu$m radiates 19.89 W. The number of photons emitted per second is $n\times10^{19}$. Find $n$ ($h = 6.63\times10^{-34}$ J s, $c = 3\times10^{8}$ m/s).`, 19.89 / (XH * XCL / 1e-6) / 1e19,
    XR`Photon energy $= \dfrac{hc}{\lambda} = \dfrac{6.63\times10^{-34}\times3\times10^{8}}{10^{-6}} = 1.989\times10^{-19}$ J. Number per second $=\dfrac{19.89}{1.989\times10^{-19}} = 10^{20} = 10\times10^{19}$.`),
  xm(3, 'de Broglie', XR`A proton and an alpha particle have the same kinetic energy. The ratio $\lambda_p/\lambda_\alpha$ is`, '2', ['1/2', '4', '$2\\sqrt2$'],
    XR`$\lambda = \dfrac{h}{\sqrt{2mK}}\propto\dfrac{1}{\sqrt m}$ at equal $K$. $\dfrac{\lambda_p}{\lambda_\alpha} = \sqrt{\dfrac{m_\alpha}{m_p}} = \sqrt4 = 2$. (The charge does not enter when $K$ is the same.)`,
    { trap: 'Equal potential difference would bring in the charge; equal kinetic energy does not.' }),
  xa(3, 'stopping potential and intensity', XR`The stopping potential of a photoelectric cell does not change when the intensity of the light is raised.`, XR`The maximum kinetic energy of photoelectrons depends only on the frequency of the light and the metal.`, 0,
    XR`$eV_0 = K_{\max} = hf-\phi$. Intensity changes only the number of photons, not the energy of each. R explains A.`),
  xt(3, 'saturation', XR`The photoelectric current saturates when the anode is made sufficiently positive.`, XR`At saturation every emitted electron reaches the anode.`, 0,
    XR`Raising the anode voltage collects more of the emitted electrons until all are collected; beyond that the current cannot rise. Both statements are true.`),
  xt(3, 'de Broglie', XR`The de Broglie wavelength of a particle increases when its speed increases.`, XR`The de Broglie wavelength is $\lambda = \dfrac{h}{mv}$.`, 3,
    XR`Statement II is true, and it shows $\lambda\propto\dfrac1v$: a faster particle has a shorter wavelength. Statement I is false.`),
  xmatch(3, 'stopping potential and frequency', 'xm1', XR`Match each feature of the $V_0$ against $f$ graph in List I with List II.`, 'A-p, B-q, C-r, D-s',
    XR`$V_0 = \dfrac he f-\dfrac\phi e$: slope $\dfrac he$ (p), axis intercept $f_0=\dfrac{\phi}{h}$ (q), intercept on the potential axis $-\dfrac\phi e$ (r). A larger $\phi$ moves the intercept right but keeps the same slope (s).`),
  xmatch(3, 'de Broglie', 'xm2', XR`Match each case in List I with the wavelength in List II.`, 'A-p, B-q, C-r, D-s',
    XR`Electron through $V$ volts: $\dfrac{12.27}{\sqrt V}$ Å (p). From $K$: $\dfrac{h}{\sqrt{2mK}}$ (q). From momentum: $\dfrac hp$ (r). Gas atom with $\tfrac12mv^2_{\mathrm{rms}} = \tfrac32k_BT$: $v_{\mathrm{rms}} = \sqrt{3k_BT/m}$, $\lambda = \dfrac{h}{\sqrt{3mk_BT}}$ (s).`),
  xn(3, 'speed of photoelectrons', XR`Photoelectrons are emitted with a maximum kinetic energy of 1.0 eV. Find their maximum speed, in units of $10^{5}$ m/s ($m_e=9.1\times10^{-31}$ kg, $e=1.6\times10^{-19}$ C).`, Math.sqrt(2 * XQE / XME) / 1e5, 0.03, 2,
    XR`$v = \sqrt{\dfrac{2K}{m}} = \sqrt{\dfrac{2\times1.6\times10^{-19}}{9.1\times10^{-31}}} = 5.93\times10^{5}$ m/s.`, { unit: '×10⁵ m/s' }),
  xm(3, 'radiation pressure', XR`Light of intensity $300\ \mathrm{W\,m^{-2}}$ falls normally on a perfectly reflecting surface. The pressure on it is`, XR`$2\times10^{-6}$ Pa`, [XR`$1\times10^{-6}$ Pa`, XR`$4\times10^{-6}$ Pa`, XR`$9\times10^{4}$ Pa`],
    XR`For a reflector the pressure is $\dfrac{2I}{c} = \dfrac{2\times300}{3\times10^{8}} = 2\times10^{-6}$ Pa. (A perfect absorber would feel half of this.)`),
  xn(3, 'electron wavelength', XR`Electrons of 54 eV are used in a diffraction experiment. Find their de Broglie wavelength in nm.`, 1.227 / Math.sqrt(54), 0.004, 3,
    XR`$\lambda = \dfrac{1.227}{\sqrt V}$ nm $=\dfrac{1.227}{\sqrt{54}} = 0.167$ nm.`, { unit: 'nm' }),
  xi(3, 'ratio of kinetic energies', XR`A metal has work function 2.0 eV. Photons of 3.0 eV are replaced by photons of 6.0 eV. The maximum kinetic energy increases by what factor?`, (6 - 2) / (3 - 2),
    XR`$K_1 = 3.0-2.0 = 1.0$ eV; $K_2 = 6.0-2.0 = 4.0$ eV. The ratio is 4, not 2.`, { trap: 'Doubling the photon energy does not double $K_{\\max}$.' }),
  xi(3, 'radiation force', XR`A laser beam of power 3.0 W is completely absorbed by a surface. The force on the surface is $n\times10^{-9}$ N. Find $n$ ($c = 3\times10^{8}$ m/s).`, 3.0 / 3e8 / 1e-9,
    XR`For absorption $F = \dfrac Pc = \dfrac{3.0}{3\times10^{8}} = 10^{-8}$ N $= 10\times10^{-9}$ N.`),
  xn(3, 'photon number', XR`Light of wavelength 500 nm and intensity $1.0\ \mathrm{W\,m^{-2}}$ falls on a surface. Find the number of photons striking each square metre per second, in units of $10^{18}$ ($h = 6.63\times10^{-34}$ J s, $c = 3\times10^{8}$ m/s).`, 1 / (XH * XCL / 500e-9) / 1e18, 0.02, 2,
    XR`Photon energy $= \dfrac{hc}{\lambda} = 3.98\times10^{-19}$ J. Photons per square metre per second $= \dfrac{1.0}{3.98\times10^{-19}} = 2.51\times10^{18}$.`, { unit: '×10¹⁸' }),
  xi(3, 'Bohr and de Broglie', XR`How many de Broglie wavelengths fit around the circumference of the electron's orbit in the fourth Bohr orbit?`, 4,
    XR`Bohr's quantisation $mvr = \dfrac{nh}{2\pi}$ means $2\pi r = n\dfrac{h}{mv} = n\lambda$. For $n=4$, four wavelengths fit.`),
  xi(3, 'classical time lag', XR`Classically, an atom of cross-section area $1\times10^{-20}\ \mathrm{m^2}$ absorbs light of intensity $1\ \mathrm{W\,m^{-2}}$. The time in seconds it would take to collect the 2.0 eV work function ($e = 1.6\times10^{-19}$ C) is`, 2.0 * 1.6e-19 / (1e-20 * 1),
    XR`Power absorbed $=IA = 1\times10^{-20}$ W. Energy needed $=2.0\times1.6\times10^{-19} = 3.2\times10^{-19}$ J. $t = \dfrac{3.2\times10^{-19}}{10^{-20}} = 32$ s. Experiments show emission in less than $10^{-9}$ s: the wave picture fails.`, { unit: 's' }),
);

// ---------- L4 ----------
items.push(
  xi(4, 'stopping potential and frequency', XR`A metal has work function 2.0 eV. Photons of energy 4.0 eV give a stopping potential $V_1$ and photons of 3.0 eV give $V_2$. Find $V_1/V_2$.`, (4 - 2) / (3 - 2),
    XR`$V_1 = 4.0-2.0 = 2.0$ V, $V_2 = 3.0-2.0 = 1.0$ V. Ratio $=2$, not $4/3$.`, { trap: 'The stopping potential is proportional to $hf-\\phi$, not to $f$.' }),
  xi(4, 'accelerating potential', XR`A proton is accelerated through 200 V and an alpha particle through 100 V. Find $\lambda_p/\lambda_\alpha$.`, Math.sqrt(4 * 1.67e-27 / 1.67e-27),
    XR`Kinetic energies: proton $e\times200 = 200$ eV; alpha $2e\times100 = 200$ eV. They are equal, so $\dfrac{\lambda_p}{\lambda_\alpha} = \sqrt{\dfrac{m_\alpha}{m_p}} = 2$.`),
  xi(4, 'photocurrent', XR`A beam of 0.20 W of 4.0 eV photons falls on a metal. One electron is emitted for every 100 photons. The photocurrent at saturation is $n\ \mu$A. Find $n$ ($e = 1.6\times10^{-19}$ C).`, 0.2 / 4.0 * 0.01 * 1e6,
    XR`Photons per second $=\dfrac{0.20}{4.0\times1.6\times10^{-19}}$. Electrons per second $= 0.01\times$ that. Current $= e\times$ electrons per second $= \dfrac{0.20}{4.0}\times0.01 = 5\times10^{-4}$ A $= 500\ \mu$A. (Power in watts divided by photon energy in volts gives amperes.)`),
  xi(4, 'isolated sphere', XR`An isolated metal sphere of radius 9.0 cm is lit by light that gives photoelectrons of maximum energy 2.0 eV. After a long time it carries a charge of $n$ pC. Find $n$ ($\dfrac{1}{4\pi\varepsilon_0} = 9\times10^{9}$ SI).`, 0.09 * 2.0 / 9e9 / 1e-12,
    XR`Electrons leave until the sphere's potential reaches the stopping value: $V = \dfrac{K_{\max}}{e} = 2.0$ V. $Q = 4\pi\varepsilon_0RV = \dfrac{0.09\times2.0}{9\times10^{9}} = 2\times10^{-11}$ C $= 20$ pC.`),
  xi(4, 'work function from two wavelengths', XR`Light of wavelength $\lambda$ gives a stopping potential of 3.0 V and light of wavelength $2\lambda$ gives 0.5 V on the same metal. The work function, in eV, is`, 2 * (3.0 - 0.5) - 3.0,
    XR`$eV_1 = \dfrac{hc}{\lambda}-\phi$ and $eV_2 = \dfrac{hc}{2\lambda}-\phi$. Subtract: $e(V_1-V_2) = \dfrac{hc}{2\lambda}$, so $\dfrac{hc}{\lambda} = 2e(V_1-V_2) = 5.0$ eV. Then $\phi = 5.0-3.0 = 2.0$ eV.`, { unit: 'eV' }),
  xi(4, 'solar sail', XR`A perfectly reflecting sail of area $100\ \mathrm{m^2}$ faces sunlight of intensity $1500\ \mathrm{W\,m^{-2}}$ at normal incidence. The force on it is $n$ mN. Find $n$ ($c=3\times10^{8}$ m/s).`, 2 * 1500 * 100 / 3e8 / 1e-3,
    XR`$F = \dfrac{2IA}{c} = \dfrac{2\times1500\times100}{3\times10^{8}} = 10^{-3}$ N $= 1$ mN.`, { unit: 'mN' }),
  xn(4, 'photon and electron', XR`A photon and an electron have the same wavelength 0.10 nm. Find the ratio (photon energy)/(electron kinetic energy). ($hc = 12398$ eV Å, electron energy $=150.4/\lambda^2$ eV with $\lambda$ in Å.)`, (12398 / 1) / (150.4 / 1), 0.5, 1,
    XR`Photon: $E = \dfrac{12398}{1.0} = 12398$ eV for $\lambda = 1$ Å. Electron: $K = \dfrac{150.4}{1.0^2} = 150.4$ eV. Ratio $= 82.4$. The photon is far more energetic.`, { trap: 'Equal wavelength means equal momentum, not equal energy.' }),
  xn(4, 'electron diffraction', XR`Electrons are diffracted from a crystal whose planes are 0.20 nm apart. The first-order maximum appears at a glancing angle of $30^\circ$. Find the accelerating voltage, in volts.`, (1.227 / (2 * 0.2 * Math.sin(XPI / 6))) ** 2 / 1, 0.3, 1,
    XR`Bragg: $2d\sin\theta = \lambda$, so $\lambda = 2\times0.20\times0.5 = 0.20$ nm. $\lambda = \dfrac{1.227}{\sqrt V}$ nm gives $V = \left(\dfrac{1.227}{0.20}\right)^2 = 37.6$ V.`, { unit: 'V' }),
  xn(4, 'photoelectrons in a magnetic field', XR`Photoelectrons of maximum energy 2.0 eV enter a uniform field of $1.0\times10^{-4}$ T perpendicular to their velocity. The largest radius of their path, in cm ($m_e=9.1\times10^{-31}$ kg, $e = 1.6\times10^{-19}$ C), is`, Math.sqrt(2 * 2.0 * XQE * XME) / (XQE * 1e-4) * 100, 0.1, 2,
    XR`$p = \sqrt{2mK} = \sqrt{2\times9.1\times10^{-31}\times3.2\times10^{-19}} = 7.63\times10^{-25}$ kg m/s. $r = \dfrac{p}{eB} = \dfrac{7.63\times10^{-25}}{1.6\times10^{-19}\times10^{-4}} = 0.0477$ m $=4.77$ cm.`, { unit: 'cm' }),
  xs(4, 'photoelectric effect', XR`Choose the correct statements about the photoelectric effect.`,
    [XR`The maximum kinetic energy of the electrons does not depend on the intensity.`, XR`Below the threshold frequency there is no emission, however intense the light.`, XR`Emission begins with no measurable delay.`, XR`The saturation current depends on the frequency but not on the intensity.`],
    [0, 1, 2],
    XR`Intensity sets the number of photons, so it sets the saturation current (D false). $K_{\max}$, the threshold and the lack of delay all follow from one photon giving energy to one electron.`),
  xs(4, 'matter waves', XR`Choose the correct statements.`,
    [XR`The de Broglie wavelength of a particle is $h/p$.`, XR`A particle at rest has an infinitely long de Broglie wavelength.`, XR`Electrons show diffraction.`, XR`The wavelength of a moving cricket ball is easily measured.`],
    [0, 1, 2],
    XR`$\lambda = \dfrac hp$ so $p=0$ gives $\lambda\to\infty$. Electron diffraction (Davisson-Germer) confirms the wave nature. A ball has $\lambda\sim10^{-34}$ m, far too small to measure (D false).`),
  xs(4, 'photon', XR`Choose the correct statements about photons.`,
    [XR`The energy of a photon is $hf$.`, XR`The rest mass of a photon is zero.`, XR`The momentum of a photon is $h/\lambda$.`, XR`Photons are deflected by an electric field.`],
    [0, 1, 2],
    XR`Photons carry no charge, so electric and magnetic fields do not deflect them (D false).`),
  xs(4, 'K-f graph', XR`A graph of maximum kinetic energy of photoelectrons against the frequency of incident light is a straight line. Choose the correct statements.`,
    [XR`Its slope is $h$.`, XR`The intercept on the frequency axis is the threshold frequency.`, XR`Its extension meets the energy axis at $-\phi$.`, XR`Its slope depends on the metal.`],
    [0, 1, 2],
    XR`$K_{\max} = hf-\phi$: slope $h$ (universal), $f$-intercept $\phi/h$, $K$-intercept $-\phi$. All metals give parallel lines (D false).`),
  xs(4, 'radiation pressure', XR`A beam of light of power $P$ falls normally on a surface. Choose the correct statements.`,
    [XR`The force on a perfect absorber is $P/c$.`, XR`The force on a perfect reflector is $2P/c$.`, XR`The pressure on a perfect absorber is $I/c$.`, XR`The force on a reflector equals the force on an absorber.`],
    [0, 1, 2],
    XR`An absorber takes the photons' momentum $P/c$ per second. A reflector reverses it, so the change is $2P/c$ (D false).`),
  xa(4, 'work function', XR`The work function of a metal depends on the frequency of the light falling on it.`, XR`The work function is the least energy needed to take an electron out of the metal.`, 3,
    XR`A is false: $\phi$ is a property of the metal (and its surface). R is true and is the definition.`),
  xa(4, 'photoelectron energy', XR`Photoelectrons are emitted with kinetic energies from 0 up to a maximum.`, XR`Electrons at different depths lose different amounts of energy in collisions before reaching the surface.`, 0,
    XR`Electrons freed near the surface carry $K_{\max}$; deeper ones lose energy on the way out. R explains the spread.`),
  xt(4, 'intensity', XR`The stopping potential of a photocell at a given frequency does not depend on the intensity.`, XR`The saturation current of a photocell is proportional to the intensity of the light.`, 0,
    XR`$V_0 = (hf-\phi)/e$ has no intensity. The saturation current counts electrons per second, which follows photons per second. Both are true.`),
  xm(4, 'photoelectric effect', XR`The threshold wavelength of metal A is longer than that of metal B. Which statement is correct?`, 'A has the smaller work function', ['A has the larger work function', 'A has the larger threshold frequency', 'both have the same work function'],
    XR`$\phi = \dfrac{hc}{\lambda_0}$: the longer $\lambda_0$, the smaller $\phi$ (and the smaller $f_0$).`),
);

// ---------- L5 ----------
items.push(
  xs(5, 'photoelectrons', XR`Photoelectrons of maximum energy $K$ enter a uniform magnetic field $B$ perpendicular to their velocities. Choose the correct statements.`,
    [XR`The largest radius is $\dfrac{\sqrt{2mK}}{eB}$.`, XR`Slower electrons move in circles of smaller radius.`, XR`Electrons of different energies follow circles of different radii.`, XR`The radius depends on the intensity of the light.`],
    [0, 1, 2],
    XR`$r = \dfrac{mv}{eB} = \dfrac{\sqrt{2mK}}{eB}\propto\sqrt K$. Intensity changes the count, not the speeds (D false).`),
  xs(5, 'photon absorption', XR`Choose the correct statements.`,
    [XR`A free electron cannot completely absorb a photon.`, XR`In the photoelectric effect the lattice takes up some momentum.`, XR`A photon gives its energy to a single electron.`, XR`A photon shares its energy among many electrons.`],
    [0, 1, 2],
    XR`For a free electron, energy and momentum cannot both be conserved if it absorbs the photon completely. In a metal the lattice absorbs the leftover momentum. One photon, one electron (D false).`),
  xs(5, 'two metals', XR`The same light ejects electrons from metals A and B with $\phi_A<\phi_B$. Choose the correct statements.`,
    [XR`The maximum kinetic energy is greater for A.`, XR`The stopping potential is greater for A.`, XR`The threshold wavelength is longer for A.`, XR`The threshold frequency is smaller for B.`],
    [0, 1, 2],
    XR`$K_{\max} = hf-\phi$ is larger for the smaller $\phi$, so is $V_0$. $\lambda_0 = hc/\phi$ is longer for A. $f_0 = \phi/h$ is larger for B (D false).`),
  xs(5, 'isolated body', XR`An isolated, initially neutral metal sphere is lit by light of a frequency that ejects electrons with maximum energy $K$. Choose the correct statements.`,
    [XR`It becomes positively charged.`, XR`Its potential rises until it reaches $K/e$.`, XR`Its potential stops rising once emission stops.`, XR`Its potential rises without limit.`],
    [0, 1, 2],
    XR`Each electron leaving makes the sphere more positive. The sphere's potential retards later electrons. When $V = K/e$ even the fastest electron cannot escape, so the charging stops (D false).`),
  xs(5, 'photon and electron', XR`A photon and a non-relativistic electron have the same wavelength. Choose the correct statements.`,
    [XR`They have the same momentum.`, XR`The photon has more energy.`, XR`The electron's kinetic energy is $p^2/2m$.`, XR`They have the same speed.`],
    [0, 1, 2],
    XR`$p = h/\lambda$ for both. Photon: $E = pc$; electron: $K = p^2/2m = \dfrac{pv}{2}$, and $v<c$, so $E>K$. The photon moves at $c$, not at the electron's $v$ (D false).`),
  xm(5, 'photon and electron', XR`The wavelength of a photon equals that of an electron of kinetic energy $K$. The photon energy is $E$. Then $E/K$ is proportional to`, XR`$\dfrac{1}{v}$ (the electron's speed)`, [XR`$v$`, XR`$v^2$`, XR`$\dfrac{1}{v^2}$`],
    XR`Equal momentum $p$: $E = pc$ and $K = \dfrac p{2}v$ ($K = \dfrac{p^2}{2m}$, $p = mv$). So $\dfrac EK = \dfrac{2c}{v}\propto\dfrac1v$.`),
  xm(5, 'matter waves', XR`The kinetic energy of a particle of wavelength $\lambda$ and mass $m$ is proportional to`, XR`$\dfrac{1}{m\lambda^2}$`, [XR`$\dfrac{1}{m\lambda}$`, XR`$\dfrac{m}{\lambda^2}$`, XR`$\dfrac{1}{\sqrt m\,\lambda}$`],
    XR`$K = \dfrac{p^2}{2m} = \dfrac{h^2}{2m\lambda^2}$.`),
  xa(5, 'heavy particles', XR`A heavy particle moving at the same speed as an electron has a much shorter de Broglie wavelength.`, XR`The de Broglie wavelength is $\lambda = h/mv$.`, 0,
    XR`At equal $v$, $\lambda\propto\dfrac1m$. R explains A.`),
  xt(5, 'free electron', XR`A free electron at rest cannot completely absorb a photon.`, XR`Energy and momentum cannot both be conserved if a free electron absorbs a photon completely.`, 0,
    XR`Suppose it did. Momentum: $mv = E/c$. Energy (non-relativistic): $\tfrac12mv^2 = E$. Eliminating $E$: $\tfrac12mv^2 = mvc$, so $v = 2c$, which is impossible. So the two conservation laws cannot both hold, and the absorption cannot happen. Both statements are true.`),
  xt(5, 'free electron', XR`A free electron at rest can completely absorb a photon.`, XR`Energy and momentum cannot both be conserved in that process.`, 3,
    XR`Statement II is true (see the argument above). Statement I contradicts it, so it is false.`),
  xmatch(5, 'photoelectric emission', 'xm8', XR`Match each feature in List I with its cause in List II.`, 'A-p, B-q, C-r, D-s',
    XR`$K_{\max} = hf-\phi$ (p). Photon energy below $\phi$ cannot free an electron (q). One photon gives its energy to one electron at once: instantaneous (r). More photons per second free more electrons: saturation current $\propto$ intensity (s).`),
  xmatch(5, 'light and momentum', 'xm4', XR`Match each item in List I with List II.`, 'A-p, B-q, C-r, D-s',
    XR`Photon momentum $h/\lambda$ (p). Absorber: $F = P/c$ (q). Reflector: $2P/c$ (r). Pressure on an absorber $= I/c$ (s).`),
  xmatch(5, 'two metals', 'xm5', XR`Match each quantity in List I with the correct statement in List II.`, 'A-p, B-s, C-r, D-q',
    XR`$K_{\max} = hf-\phi$ is greater for A, the metal with the smaller work function (p). $f_0 = \phi/h$ is smaller for A (s). The slope $h/e$ is the same for all metals (r). The work function is greater for B (q).`),
  xmatch(5, 'matter waves', 'xm6', XR`Match each case in List I with the result in List II.`, 'A-p, B-q, C-r, D-s',
    XR`100 V electron: $12.27/10 = 1.227$ Å $=0.123$ nm (p). Same speed: $\lambda\propto1/m$, so the electron's is $\approx1836$ times the proton's (q). Doubling $v$ halves $\lambda$ (r). Doubling $m$ halves $\lambda$ (s).`),
  xmatch(5, 'photon and particle', 'xm7', XR`A photon and a non-relativistic particle of mass $m$ have the same wavelength $\lambda$. Match each item in List I with List II.`, 'A-p, B-q, C-r, D-s',
    XR`Momentum is $h/\lambda$ for both (p). Photon energy $hc/\lambda$ (q). Particle kinetic energy $p^2/2m = \dfrac{h^2}{2m\lambda^2}$ (r). Photon speed $c$ (s).`),
);

// ---------- passages ----------
items.push(
  xn(3, 'photon energy', XR`Find the energy of one photon, in eV.`, XH * XCL / 400e-9 / XQE, 0.02, 2,
    XR`$E = \dfrac{hc}{\lambda} = \dfrac{6.63\times10^{-34}\times3\times10^{8}}{400\times10^{-9}} = 4.97\times10^{-19}$ J $= 3.11$ eV.`, XPY({ group: 'xp1', unit: 'eV' })),
  xn(4, 'stopping potential', XR`Find the stopping potential, in volts.`, XH * XCL / 400e-9 / XQE - 2.3, 0.02, 2,
    XR`$eV_0 = 3.11-2.3 = 0.81$ eV, so $V_0 = 0.81$ V.`, XPY({ group: 'xp1', unit: 'V' })),
  xn(5, 'photocurrent', XR`Find the saturation photocurrent, in $\mu$A.`, 2.0 * 1e-4 / (XH * XCL / 400e-9) * 0.01 * XQE * 1e6, 0.01, 3,
    XR`Power on the plate $= IA = 2.0\times10^{-4}$ W. Photons per second $=\dfrac{2.0\times10^{-4}}{4.97\times10^{-19}} = 4.02\times10^{14}$. Electrons per second $=0.01\times4.02\times10^{14} = 4.02\times10^{12}$. $I = 4.02\times10^{12}\times1.6\times10^{-19} = 6.44\times10^{-7}$ A $= 0.644\ \mu$A.`, XPY({ group: 'xp1', unit: 'µA', trap: 'Only 1% of the photons produce an electron.' })),
  xn(3, 'electron wavelength', XR`Find the de Broglie wavelength of the electrons, in nm.`, XH / Math.sqrt(2 * XME * 100 * XQE) * 1e9, 0.002, 4,
    XR`$p = \sqrt{2meV} = \sqrt{2\times9.1\times10^{-31}\times1.6\times10^{-19}\times100} = 5.40\times10^{-24}$ kg m/s. $\lambda = \dfrac hp = \dfrac{6.63\times10^{-34}}{5.40\times10^{-24}} = 1.228\times10^{-10}$ m $=0.123$ nm.`, XPY({ group: 'xp2', unit: 'nm' })),
  xn(4, 'electron momentum', XR`Find the momentum of the electrons, in units of $10^{-24}$ kg m/s.`, Math.sqrt(2 * XME * 100 * XQE) / 1e-24, 0.02, 2,
    XR`$p = \sqrt{2meV} = 5.40\times10^{-24}$ kg m/s.`, XPY({ group: 'xp2', unit: '×10⁻²⁴ kg m/s' })),
  xn(5, 'Bragg diffraction', XR`Find the glancing angle (in degrees) for the first-order maximum.`, Math.asin(XH / Math.sqrt(2 * XME * 100 * XQE) / (2 * 0.2e-9)) * 180 / XPI, 0.2, 1,
    XR`Bragg: $2d\sin\theta = \lambda$. $\sin\theta = \dfrac{0.1228}{2\times0.20} = 0.307$, so $\theta = 17.9^\circ$.`, XPY({ group: 'xp2', unit: '°' })),
);

// ---------- templates ----------
gens.push(
  XG(27, 3, 'mcq', 'stopping potential', (rng) => {
    const lam = choose(rng, [200, 250, 300, 310, 400, 500]); const phi = pick(rng, 1.5, 4.5, 0.1);
    const E = 1240 / lam; const V = E - phi;
    if (V <= 0.05) return { lam, phi, ok: 0, q: XR`Light of wavelength ${lam} nm falls on a metal of work function ${phi} eV (${HCN}). The stopping potential is`, options: ['0 (no emission)', f3(E + phi) + ' V', f3(E + phi + 1) + ' V', f3(Math.abs(V) + 0.5) + ' V'], answer: 0, sol: XR`Photon energy $= ${f3(E)}$ eV is less than $\phi$, so no electrons are emitted and there is no stopping potential to measure.`, trap: 'Check that the photon energy exceeds the work function first.' };
    const o = numOpts(rng, V, [E, phi, E + phi], 'V', 3);
    return { lam, phi, ok: 1, q: XR`Light of wavelength ${lam} nm falls on a metal of work function ${phi} eV (${HCN}). The stopping potential is`, options: o.options, answer: o.answer, sol: XR`Photon energy $=\dfrac{1240}{${lam}} = ${f3(E)}$ eV. $eV_0 = ${f3(E)}-${phi}$, so $V_0 = ${f3(V)}$ V.`, trap: 'Subtract the work function from the photon energy.' };
  }, (p) => { const V = 1240 / p.lam - p.phi; return V <= 0.05 ? 0 : p.options.findIndex((o) => o === `${f3(V)} V`); }),
  XG(28, 4, 'nat', 'photocurrent', (rng) => {
    const P = choose(rng, [0.1, 0.2, 0.5, 1]); const lam = choose(rng, [250, 300, 400, 500]); const eta = choose(rng, [0.001, 0.005, 0.01, 0.02]);
    const I = P / (1240 / lam) * eta * 1e6;
    return { P, lam, eta, q: XR`A beam of ${P} W of light of wavelength ${lam} nm falls on a metal. A fraction ${eta} of the photons each release one electron, and all electrons are collected. Find the saturation current, in $\mu$A (${HCN}).`, answer: +I.toFixed(3), tol: Math.max(0.01, I * 0.01), unit: 'µA',
      sol: XR`Photon energy $=\dfrac{1240}{${lam}} = ${f3(1240 / lam)}$ eV. Photons per second $=\dfrac{${P}}{${f3(1240 / lam)}\times1.6\times10^{-19}}$. Current $=\eta\,e\times$ that $= ${eta}\times\dfrac{${P}}{${f3(1240 / lam)}} = ${f3(I)}\ \mu$A.` };
  }, (p) => { const N = p.P / (1240 / p.lam * 1.6e-19); return N * p.eta * 1.6e-19 * 1e6; }),
  XG(29, 4, 'nat', 'photoelectrons in a magnetic field', (rng) => {
    const K = choose(rng, [0.5, 1, 2, 3, 4]); const B = choose(rng, [0.5, 1, 2, 5]) * 1e-4;
    const r = Math.sqrt(2 * XME * K * XQE) / (XQE * B) * 100;
    return { K, B, q: XR`Photoelectrons of maximum kinetic energy ${K} eV enter a uniform field of $${B * 1e4}\times10^{-4}$ T perpendicular to their velocity. Find the largest radius of their path, in cm ($m_e = 9.1\times10^{-31}$ kg, $e = 1.6\times10^{-19}$ C).`, answer: +r.toFixed(3), tol: Math.max(0.02, r * 0.005), unit: 'cm',
      sol: XR`$v = \sqrt{\dfrac{2K}{m}} = ${f3(Math.sqrt(2 * K * XQE / XME))}$ m/s. $r = \dfrac{mv}{eB} = ${f3(r)}$ cm.` };
  }, (p) => { const v = Math.sqrt(2 * p.K * XQE / XME); return XME * v / (XQE * p.B) * 100; }),
  XG(30, 3, 'mcq', 'comparing de Broglie wavelengths', (rng) => {
    const v = int(rng, 0, 3); const w = choose(rng, [{ n: 'deuteron', m: 2, q: 1 }, { n: 'alpha particle', m: 4, q: 2 }]);
    const cond = ['the same speed', 'the same kinetic energy', 'the same accelerating voltage', 'the same momentum'][v];
    const ratio = [1 * 1 / w.m, 1 / Math.sqrt(w.m), 1 / Math.sqrt(w.m * w.q), 1][v];
    const why = [XR`$\lambda = \dfrac{h}{mv}\propto\dfrac1m$`, XR`$\lambda = \dfrac{h}{\sqrt{2mK}}\propto\dfrac{1}{\sqrt m}$`, XR`$\lambda = \dfrac{h}{\sqrt{2mqV}}\propto\dfrac{1}{\sqrt{mq}}$`, XR`$\lambda = \dfrac hp$ is the same`][v];
    const pool = [1 / w.m, 1 / Math.sqrt(w.m), 1 / Math.sqrt(w.m * w.q), 1, w.m, Math.sqrt(w.m), 1 / (w.m * w.q)];
    const wr = []; for (const x of pool) { if (Math.abs(x - ratio) > 1e-9 && !wr.some((y) => Math.abs(y - x) < 1e-9)) wr.push(x); if (wr.length === 3) break; }
    const o = numOpts(rng, ratio, wr, '', 3);
    return { v, wm: w.m, wq: w.q, q: XR`A proton and a ${w.n} have ${cond}. The ratio of the ${w.n}'s de Broglie wavelength to the proton's is`, options: o.options, answer: o.answer, sol: XR`${why}. For the ${w.n} ($m=${w.m}m_p$, $q=${w.q}q_p$) the ratio is $${f3(ratio)}$.`, trap: 'Find which quantity is held equal.' };
  }, (p) => { const ratio = [1 / p.wm, 1 / Math.sqrt(p.wm), 1 / Math.sqrt(p.wm * p.wq), 1][p.v]; return p.options.findIndex((o) => o === f3(ratio)); }),
  XG(31, 4, 'nat', 'electron diffraction', (rng) => {
    const d = choose(rng, [0.15, 0.2, 0.25, 0.3]); const n = choose(rng, [1, 2]); const th = choose(rng, [20, 30, 40, 60]);
    const lam = 2 * d * Math.sin(th * XPI / 180) / n; const V = (1.227 / lam) ** 2;
    return { d, n, th, q: XR`Electrons are diffracted from planes 0.${String(d * 100).padStart(2, '0')} nm apart. An order-${n} maximum is seen at a glancing angle of ${th}°. Find the accelerating voltage, in volts.`, answer: +V.toFixed(2), tol: Math.max(0.2, V * 0.01), unit: 'V',
      sol: XR`Bragg: $n\lambda = 2d\sin\theta$, so $\lambda = \dfrac{2\times${d}\times\sin${th}^\circ}{${n}} = ${f3(lam)}$ nm. $V = \left(\dfrac{1.227}{\lambda}\right)^2 = ${f3(V)}$ V.` };
  }, (p) => { const lam = 2 * p.d * Math.sin(p.th * XPI / 180) / p.n * 1e-9; const pm = XH / lam; return pm * pm / (2 * XME * XQE); }),
  XG(32, 5, 'nat', 'charging of an isolated sphere', (rng) => {
    const R = choose(rng, [0.03, 0.05, 0.09, 0.1]); const K = choose(rng, [1, 1.5, 2, 3]);
    const Q = 4 * XPI * XE0 * R * K / 1e-12; const n = Q * 1e-12 / XQE;
    return { R, K, q: XR`An isolated sphere of radius ${R * 100} cm is lit by light whose photoelectrons have maximum energy ${K} eV. What charge, in pC, does the sphere finally carry ($\varepsilon_0 = 8.85\times10^{-12}$ SI)?`, answer: +Q.toFixed(3), tol: Math.max(0.01, Q * 0.01), unit: 'pC',
      sol: XR`The sphere charges until $V = K/e = ${K}$ V. $Q = 4\pi\varepsilon_0RV = ${f3(Q)}$ pC (about $${tx(n)}$ electrons lost).` };
  }, (p) => p.R * p.K / 9e9 / 1e-12),
  XG(33, 4, 'nat', 'ratio of kinetic energies', (rng) => {
    const phi = pick(rng, 1.5, 3, 0.5); const E1 = +(phi + pick(rng, 0.5, 1.5, 0.5)).toFixed(2); const k = choose(rng, [1.5, 2, 3]); const E2 = E1 * k;
    const r = (E2 - phi) / (E1 - phi);
    return { phi, E1, E2, q: XR`A metal has work function ${phi} eV. When the photon energy is changed from ${E1} eV to ${f3(E2)} eV, by what factor does the maximum kinetic energy change?`, answer: +r.toFixed(3), tol: Math.max(0.01, r * 0.01),
      sol: XR`$K_1 = ${E1}-${phi} = ${f3(E1 - phi)}$ eV; $K_2 = ${f3(E2)}-${phi} = ${f3(E2 - phi)}$ eV. Ratio $= ${f3(r)}$, not ${k}.`, trap: 'The factor on $K_{\\max}$ is not the factor on the photon energy.' };
  }, (p) => (p.E2 - p.phi) / (p.E1 - p.phi)),
  XG(34, 4, 'nat', 'retarding field', (rng) => {
    const K = choose(rng, [1, 2, 3, 4]); const E = choose(rng, [50, 100, 200, 500]);
    const d = K / E * 100;
    return { K, E, q: XR`A photoelectron of kinetic energy ${K} eV leaves a plate perpendicular to it, into a uniform retarding field of ${E} V/m. How far does it travel before stopping, in cm?`, answer: +d.toFixed(3), tol: Math.max(0.01, d * 0.01), unit: 'cm',
      sol: XR`Work done by the field $= eEd = K$, so $d = \dfrac{K\ \text{(in eV)}}{E\ \text{(in V/m)}} = \dfrac{${K}}{${E}} = ${f3(K / E)}$ m $= ${f3(d)}$ cm.` };
  }, (p) => { const F = XQE * p.E; return p.K * XQE / F * 100; }),
  XG(35, 4, 'mcq', 'photon number', (rng) => {
    const l1 = choose(rng, [300, 400, 500]); const l2 = choose(rng, [600, 700, 800]);
    const rat = l1 / l2; const o = numOpts(rng, rat, [l2 / l1, (l1 / l2) ** 2, 1], '', 3);
    return { l1, l2, q: XR`Two sources of the same power emit light of wavelengths ${l1} nm and ${l2} nm. The ratio of the numbers of photons per second (first : second) is`, options: o.options, answer: o.answer, sol: XR`Photons per second $=\dfrac{P}{hc/\lambda}\propto\lambda$ at equal power. Ratio $=\dfrac{${l1}}{${l2}} = ${f3(rat)}$.`, trap: 'Longer wavelength means lower photon energy, hence more photons.' };
  }, (p) => p.options.findIndex((o) => o === f3(p.l1 / p.l2))),
);

}

export default { topic: 'dual-nature', groups, items, gens };
