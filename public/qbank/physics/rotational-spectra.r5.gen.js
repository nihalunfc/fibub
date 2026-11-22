// Round 5 extras for rotational-spectra: original questions, written 2026-11-22.
import { int, choose, round } from '../_util.js';
const R = String.raw;

const KT = 0.6950348; // k/hc in cm^-1 per K
/** J with the largest population (2J+1)exp(-BJ(J+1)/kT). */
const jmax = (B, T) => { let best = 0, bv = -1; for (let J = 0; J < 200; J++) { const v = (2 * J + 1) * Math.exp(-B * J * (J + 1) / (KT * T)); if (v > bv) { bv = v; best = J; } } return best; };

export default {
  items: [
    { id: 'rots-r5-01', type: 'nat', level: 1, exams: ['jam', 'gate', 'net'], sub: 'units', unit: 'GHz',
      q: R`A diatomic molecule has rotational constant $B = 1.9225$ cm$^{-1}$. The same constant in frequency units, $Bc$, is ______ GHz (two decimal places; $c = 2.9979\times10^{10}$ cm/s).`,
      answer: 57.64, tol: 0.05, calc: () => 1.9225 * 2.9979e10 / 1e9,
      sol: R`A wavenumber times the speed of light in cm/s gives a frequency: $1.9225\times2.9979\times10^{10} = 5.764\times10^{10}$ Hz $= 57.64$ GHz. The $J = 0\to1$ line is at $2B$, so about $115$ GHz.`,
      trap: R`Using $c$ in m/s with a constant in cm$^{-1}$ gives a number 100 times too small.` },
    { id: 'rots-r5-02', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'isotope effects',
      q: R`$^1$H$^{35}$Cl ($\mu = 0.980$ u) is replaced by $^2$D$^{35}$Cl ($\mu = 1.904$ u) with the same bond length. The ratio $B(\text{HCl})/B(\text{DCl})$ is closest to`,
      options: [R`$2.00$`, R`$1.39$`, R`$1.94$`, R`$0.51$`], answer: 2,
      sol: R`$B = \dfrac{h}{8\pi^2c\mu r^2}$, so at fixed $r$, $B\propto1/\mu$: $1.904/0.980 = 1.94$. Because chlorine is heavy, the reduced mass nearly doubles when H becomes D, but not exactly.`,
      trap: R`$1.39\approx\sqrt{1.94}$ is the ratio of the vibrational frequencies, not of $B$.` },
    { id: 'rots-r5-03', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'populations',
      q: R`HCl ($B = 10.59$ cm$^{-1}$) is at $500$ K ($kT/hc = 347.5$ cm$^{-1}$). The rotational level $J$ with the largest population is $J = $ ______.`,
      answer: 4, tol: 0, calc: () => jmax(10.59, 500),
      sol: R`Population $\propto(2J + 1)e^{-BJ(J + 1)/(kT/hc)}$. The smooth maximum is at $J = \sqrt{kT/(2hcB)} - \tfrac12 = \sqrt{347.5/21.18} - 0.5 = 3.55$. Check the neighbours: $J = 3$: $7e^{-0.366} = 4.86$; $J = 4$: $9e^{-0.610} = 4.89$; $J = 5$: $11e^{-0.914} = 4.41$. So $J = 4$, narrowly.`,
      trap: R`Truncating 3.55 to 3 without checking the neighbours gives the wrong level here.` },
    { id: 'rots-r5-04', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'centrifugal distortion', format: 'statements',
      q: R`For a non-rigid diatomic with $F(J) = BJ(J + 1) - DJ^2(J + 1)^2$, which statements are correct?`,
      options: [R`The pure rotational lines get closer together as $J$ grows`, R`$D = 4B^3/\tilde\omega^2$ for a harmonic bond`,
        R`A stiffer bond (larger $\tilde\omega$) gives a larger $D$`, R`If $D$ were zero the lines would be spaced exactly $2B$ apart`], answer: [0, 1, 3],
      sol: R`Line positions: $\tilde\nu = 2B(J + 1) - 4D(J + 1)^3$, so the spacing $2B - 4D[(J + 2)^3 - (J + 1)^3]$ shrinks with $J$. For a harmonic bond $D = 4B^3/\tilde\omega^2$: a stiffer bond stretches less, so $D$ is SMALLER. With $D = 0$ the spacing is $2B$.`,
      trap: R`$D$ measures how much the bond stretches when spinning; stiff bonds stretch less.` },
    { id: 'rots-r5-05', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'bond length', unit: 'pm',
      q: R`Gas-phase $^{39}$K$^{35}$Cl has $B = 0.1286$ cm$^{-1}$; the atomic masses are $38.964$ u and $34.969$ u. Its bond length is ______ pm (to the nearest pm; $h = 6.626\times10^{-34}$ J s, $c = 2.998\times10^{10}$ cm/s, $1$ u $= 1.6605\times10^{-27}$ kg).`,
      answer: 267, tol: 1.5, calc: () => Math.sqrt(6.626e-34 / (8 * Math.PI ** 2 * 2.998e10 * 0.1286) / (38.964 * 34.969 / 73.933 * 1.6605e-27)) * 1e12,
      sol: R`$I = \dfrac{h}{8\pi^2cB} = \dfrac{6.626\times10^{-34}}{78.96\times2.998\times10^{10}\times0.1286} = 2.177\times10^{-45}$ kg m$^2$. $\mu = \dfrac{38.964\times34.969}{73.933} = 18.43$ u $= 3.060\times10^{-26}$ kg. $r = \sqrt{I/\mu} = \sqrt{7.11\times10^{-20}} = 2.667\times10^{-10}$ m $\approx267$ pm.`,
      trap: R`$c$ must be in cm/s when $B$ is in cm$^{-1}$.` },
    { id: 'rots-r5-06', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'line assignment',
      q: R`Three consecutive pure rotational absorption lines of a rigid diatomic are found at $34.59$, $46.12$ and $57.65$ GHz. The line at $34.59$ GHz is the transition`,
      options: [R`$J = 3\to4$`, R`$J = 2\to3$`, R`$J = 1\to2$`, R`$J = 0\to1$`], answer: 1,
      sol: R`The spacing is $11.53$ GHz $= 2B$. Lines sit at $2B(J + 1)$, so $J + 1 = 34.59/11.53 = 3.0$: the line is $J = 2\to3$. The first line, $0\to1$, would be at $11.53$ GHz.`,
      trap: R`Dividing by $B$ instead of $2B$ gives $J + 1 = 6$.` },
    { id: 'rots-r5-07', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'partition function',
      q: R`In the high-temperature limit the rotational partition function of a heteronuclear diatomic is $q\approx kT/(hcB)$. For HCl ($B = 10.59$ cm$^{-1}$) at $300$ K ($kT/hc = 208.5$ cm$^{-1}$), $q$ is ______ (one decimal place).`,
      answer: 19.7, tol: 0.2, calc: () => 208.5 / 10.59,
      sol: R`$q = 208.5/10.59 = 19.7$. The exact sum $\sum(2J + 1)e^{-BJ(J + 1)/(kT/hc)}$ is about $q + \tfrac13 = 20.0$; the limit works because $kT\gg hcB$. A homonuclear molecule would need a symmetry number 2 in the denominator.`,
      trap: R`Dividing by 2 (symmetry number) is only for homonuclear molecules such as N$_2$.` },
    { id: 'rots-r5-08', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'populations', unit: 'K',
      q: R`In the rotational spectrum of a gas of diatomics with $B = 2.00$ cm$^{-1}$, the most populated level (treating $J$ as continuous) is at $J = 5$. The gas temperature is about ______ K (to the nearest kelvin; $k/hc = 0.695$ cm$^{-1}$/K).`,
      answer: 174, tol: 2, calc: () => 2 * 2 * 5.5 ** 2 / 0.695,
      sol: R`$J_\text{max} = \sqrt{kT/(2hcB)} - \tfrac12$, so $kT/hc = 2B(J_\text{max} + \tfrac12)^2 = 2\times2\times5.5^2 = 121$ cm$^{-1}$ and $T = 121/0.695 = 174$ K.`,
      trap: R`Leaving out the $\tfrac12$ gives $kT/hc = 100$ cm$^{-1}$, $T = 144$ K.` },
    { id: 'rots-r5-09', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'line positions', unit: 'mm',
      q: R`A rigid linear molecule has $B = 0.200$ cm$^{-1}$. The wavelength of its $J = 2\to3$ absorption line is ______ mm (two decimal places).`,
      answer: 8.33, tol: 0.02, calc: () => 10 / (2 * 0.2 * 3),
      sol: R`$\tilde\nu = 2B(J + 1)$ with lower $J = 2$: $2\times0.200\times3 = 1.20$ cm$^{-1}$. $\lambda = 1/1.20$ cm $= 0.833$ cm $= 8.33$ mm: microwaves.`,
      trap: R`Using the upper $J$ in $2B(J + 1)$ gives $1.6$ cm$^{-1}$.` },
    { id: 'rots-r5-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'selection rules', format: 'not',
      q: R`Which statement about rotational spectra is NOT correct?`,
      options: [R`CH$_4$ and SF$_6$ (spherical tops) show no ordinary pure rotational absorption spectrum`,
        R`O$_2$, though non-polar, absorbs near $60$ GHz through magnetic-dipole transitions`,
        R`HD has an exactly zero dipole moment, so it has no pure rotational spectrum at all`,
        R`NH$_3$ shows an inversion transition near $24$ GHz used in the first maser`], answer: 2,
      sol: R`Spherical tops have no permanent dipole (centrifugal distortion gives only extremely weak lines). O$_2$ has electron spin $S = 1$, and its spin-rotation structure gives magnetic-dipole lines near $60$ GHz (and 119 GHz). In HD the electrons do not follow the two nuclei equally (different masses), so a tiny dipole of about $10^{-3}$ D appears and weak rotational lines exist, seen in astronomy. NH$_3$ inversion at 23.87 GHz powered the 1954 maser.`,
      trap: R`Symmetric charge from symmetric nuclei is only true for H$_2$ and D$_2$; isotopic asymmetry breaks it.` },
  ],
  gens: [
    { id: 'rots-r5g1', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'line assignment',
      make(r) {
        const B = choose(r, [1.9225, 0.2029, 10.59, 0.1286, 1.6961, 20.56, 0.5]);
        const J = int(r, 0, 9), Bg = B * 29.9792458;
        const f = (k) => round(2 * Bg * (k + 1), 2);
        return { q: R`Three consecutive lines in the pure rotational spectrum of a rigid diatomic are at $${f(J)}$, $${f(J + 1)}$ and $${f(J + 2)}$ GHz. The lower level $J$ of the line at $${f(J)}$ GHz is ______.`,
          answer: J, tol: 0, J,
          sol: R`Lines sit at $2B(J + 1)$, spaced by $2B = ${round(2 * Bg, 2)}$ GHz. So $J + 1 = ${f(J)}/${round(2 * Bg, 2)} = ${J + 1}$, and $J = ${J}$.`,
          trap: 'The first line of the series (J = 0 to 1) is at 2B, not at B.' };
      },
      verify: (p) => p.J },
    { id: 'rots-r5g2', type: 'nat', level: 3, exams: ['jam', 'gate', 'net'], sub: 'populations',
      make(r) {
        const [name, B] = choose(r, [['CO', 1.9225], ['HCl', 10.59], ['HF', 20.56], ['NO', 1.6961], ['HBr', 8.465]]);
        const T = choose(r, [100, 200, 300, 500, 800, 1000, 1500]);
        const J = jmax(B, T), c = Math.sqrt(KT * T / (2 * B)) - 0.5;
        return { q: R`${name} ($B = ${B}$ cm$^{-1}$) is at $${T}$ K ($k/hc = 0.695$ cm$^{-1}$/K). The rotational level with the largest population is $J = $ ______.`,
          answer: J, tol: 0, B, T,
          sol: R`Population $\propto(2J + 1)e^{-BJ(J + 1)hc/kT}$, with $kT/hc = ${round(KT * T, 1)}$ cm$^{-1}$. The smooth maximum is at $\sqrt{kT/(2hcB)} - \tfrac12 = ${round(c, 2)}$; comparing the neighbouring integers gives $J = ${J}$.`,
          trap: 'Check the integers on both sides of the smooth maximum instead of truncating.' };
      },
      verify: (p) => jmax(p.B, p.T) },
    { id: 'rots-r5g3', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'partition function',
      make(r) {
        const [name, B, s] = choose(r, [['N$_2$', 1.998, 2], ['O$_2$', 1.4377, 2], ['Cl$_2$', 0.2440, 2], ['CO', 1.9225, 1], ['HCl', 10.59, 1], ['NO', 1.6961, 1]]);
        const T = choose(r, [200, 300, 400, 600, 1000]);
        const q = KT * T / (s * B), v = +q.toPrecision(3);
        return { q: R`Using $q_\text{rot}\approx\dfrac{kT}{\sigma hcB}$, the rotational partition function of ${name} ($B = ${B}$ cm$^{-1}$) at $${T}$ K is ______ (three significant figures; $k/hc = 0.695$ cm$^{-1}$/K).`,
          answer: v, tol: +(v * 0.01).toPrecision(2), B, T, s,
          sol: R`${s === 2 ? 'Homonuclear, so the symmetry number is $\\sigma = 2$.' : 'Heteronuclear, so $\\sigma = 1$.'} $kT/hc = ${round(KT * T, 1)}$ cm$^{-1}$, and $q = ${round(KT * T, 1)}/(${s}\times${B}) = ${v}$.`,
          trap: 'Homonuclear diatomics need the symmetry number 2.' };
      },
      verify: (p) => KT * p.T / (p.s * p.B) },
  ],
};
