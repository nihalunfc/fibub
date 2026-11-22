// Extra question shapes for nuclear-properties (templates npr-m31..m35). Imported by nuclear-properties.js.
import { int, choose } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { vs, nt, sci } from './_vary.js';

export default [
  { id: 'npr-m31', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'density', format: 'statements',
    make(r) {
      const A = choose(r, [8, 12, 16, 20, 24, 27]), k = choose(r, [8, 27, 64]), kr = Math.round(Math.cbrt(k)), not = r() < 0.5;
      const m = msqOf(r, [
        vs(r, `a nucleus with $A = ${k * A}$ has a radius about ${kr} times that of a nucleus with $A = ${A}$`, `a nucleus with $A = ${k * A}$ has a radius about ${k} times that of a nucleus with $A = ${A}$`, `$R = r_0A^{1/3}$, so the radius ratio is $${k}^{1/3} = ${kr}$.`),
        ['the central nucleon density is roughly the same for all but the lightest nuclei', true, 'Saturation: the volume grows in proportion to $A$, so $A/V$ is nearly constant, about $0.16\\text{ fm}^{-3}$.'],
        ['the mass density of nuclear matter is of order $10^{17}\\text{ kg/m}^3$', true, '$\\rho \\approx m_u \\times 0.16\\times10^{45}\\text{ m}^{-3} \\approx 2.7\\times10^{17}\\text{ kg/m}^3$.'],
        ['the surface thickness (90% to 10% of the central density) is about 2.3 fm, nearly the same for all heavy nuclei', true, 'Electron scattering fits to a Fermi shape give a skin $t \\approx 4.4a \\approx 2.3$ fm, independent of $A$.'],
        ['the central density grows in proportion to $A^{1/3}$', false, 'It is the radius that grows as $A^{1/3}$; the density stays nearly constant.'],
        ['the nuclear volume is proportional to $A$', true, '$V = \\tfrac43\\pi r_0^3A$.'],
        ['the charge radius and the matter radius of a heavy neutron-rich nucleus are exactly equal', false, 'The extra neutrons form a thin neutron skin: the matter (neutron) radius is slightly larger.'],
        ['the radius grows in proportion to $A$', false, 'Constant density means volume, not radius, is proportional to $A$.'],
      ], { not });
      return { q: `Which of the following statements about nuclear sizes are ${nt(not)}?`, ...m,
        trap: 'Constant density means $R \\propto A^{1/3}$: multiplying $A$ by 8 only doubles the radius.' };
    } },
  { id: 'npr-m32', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'quadrupole moment',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['every even-even nucleus has ground-state spin and parity $0^+$', true, 'Pairing couples like nucleons to zero.'],
        ['a nucleus with spin $I = 1/2$ has zero spectroscopic quadrupole moment', true, 'A quadrupole moment needs $I \\ge 1$ (the Wigner-Eckart theorem).'],
        ['a prolate (cigar-shaped) charge distribution has $Q \\gt 0$', true, 'With the convention $Q = \\langle 3z^2 - r^2\\rangle$, elongation along $z$ makes $Q$ positive.'],
        ['the neutron has a negative magnetic moment, about $-1.91\\,\\mu_N$', true, 'Its moment is opposite its spin, a sign of its internal quark structure.'],
        ['the nuclear magneton is about $1/1836$ of the Bohr magneton', true, '$\\mu_N/\\mu_B = m_e/m_p$.'],
        ['a nucleus in a state of definite parity has a nonzero static electric dipole moment', false, 'The dipole operator is odd under parity, so its expectation value vanishes in a state of definite parity (and time reversal forbids it too).'],
        ['a nucleus with spin $I = 1/2$ can have a nonzero quadrupole moment', false, 'Only $I \\ge 1$ allows a spectroscopic $Q$.'],
        ['an oblate (disc-shaped) charge distribution has $Q \\gt 0$', false, 'Flattening along the symmetry axis gives $Q \\lt 0$.'],
        ['the deuteron magnetic moment equals $\\mu_p + \\mu_n$ exactly', false, 'It is $0.857\\,\\mu_N$ against $\\mu_p + \\mu_n = 0.880\\,\\mu_N$: the small difference (and $Q \\ne 0$) shows a D-state admixture.'],
      ], not);
      return { q: `Which statement about nuclear spins and moments is ${nt(not)}?`, ...m,
        trap: 'Check the selection rules: no static electric dipole moment at all, and no quadrupole moment below $I = 1$.' };
    } },
  { id: 'npr-m33', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'electron scattering', format: 'match',
    make(r) {
      const L = {
        dist: 'the radial shape of the charge distribution $\\rho(r)$',
        rad: 'the rms charge radius',
        spin: 'the nuclear spin $I$',
        mu: 'the magnetic dipole moment',
        Q: 'the electric quadrupole moment',
        dR: 'the change in charge radius from one isotope to the next',
      };
      const cas = choose(r, [
        ['the elastic electron-scattering cross-section measured over a wide range of momentum transfer', 'dist', 'The form factor $F(q)$ over many $q$ is the Fourier transform of $\\rho(r)$, so it fixes the whole shape, not just the radius.', ['rad']],
        ['the energies of the K X-rays of a muonic atom', 'rad', 'The muon orbit is about 200 times smaller than the electron orbit, so the 1s level overlaps the nucleus and shifts by an amount set mainly by the rms charge radius.'],
        ['the number of hyperfine components of an atomic level with large electronic $J$', 'spin', 'With $J \\ge I$, $F$ runs over $2I + 1$ values, so counting the components gives $I$.'],
        ['the NMR frequency of the nucleus in a known magnetic field, its spin being known', 'mu', '$h\\nu = \\mu B/I$, so the frequency gives $\\mu$.'],
        ['a departure of the hyperfine splittings from the Landé interval rule', 'Q', 'The magnetic dipole term alone obeys the interval rule; a term quadratic in $\\vec I\\cdot\\vec J$ comes from the electric quadrupole interaction.'],
        ['the isotope shift of an optical line between neighbouring isotopes of a heavy element', 'dR', 'For heavy elements the field shift dominates: it measures $\\delta\\langle r^2\\rangle$ between the isotopes.', ['rad']],
        ['the Coulomb energy difference between the ground states of a pair of mirror nuclei', 'rad', 'The difference $\\Delta E_C = \\tfrac35\\tfrac{e^2}{4\\pi\\varepsilon_0R}(Z_>^2 - Z_<^2)$ gives the radius $R$.', ['dist']],
      ]);
      return { q: `The main nuclear property obtained from ${cas[0]} is`, ...matchOne(r, L, cas),
        trap: 'Each probe sees one thing best: electron scattering the shape, muonic atoms the radius, hyperfine structure the spin and moments.' };
    } },
  { id: 'npr-m34', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'form factor', format: 'graph in words',
    make(r) {
      const R = int(r, 3, 7), q1 = (4.493 / R).toFixed(2);
      const L = {
        flat: '$|F(q)|^2 = 1$ at every $q$',
        sphere: `falls from 1 with a series of diffraction zeros, the first at $q \\approx ${q1}\\text{ fm}^{-1}$`,
        gauss: 'falls as a Gaussian in $q$, with no zeros',
        dipole: 'falls smoothly as $(1 + q^2a^2)^{-4}$, with no zeros',
        fermi: 'has diffraction minima that do not reach zero and an envelope that falls faster than for a sharp sphere',
      };
      const cas = choose(r, [
        ['a point charge', 'flat', 'The Fourier transform of a delta function is a constant, so $F(q) = 1$.'],
        [`a uniformly charged sphere of radius ${R} fm`, 'sphere', `$F(q) = 3[\\sin qR - qR\\cos qR]/(qR)^3$, whose first zero is at $qR = 4.493$, that is $q = 4.493/${R} = ${q1}\\text{ fm}^{-1}$.`],
        ['a Gaussian charge distribution', 'gauss', 'The Fourier transform of a Gaussian is a Gaussian: $F(q) = e^{-q^2\\langle r^2\\rangle/6}$, positive everywhere.'],
        ['an exponential charge distribution $\\rho \\propto e^{-r/a}$ (like the proton)', 'dipole', 'Its transform is the dipole form $F = (1 + q^2a^2)^{-2}$, so $|F|^2 \\propto (1 + q^2a^2)^{-4}$: smooth, no zeros.'],
        ['a Fermi distribution with a diffuse surface (a real heavy nucleus)', 'fermi', 'The sharp-sphere zeros are filled in (and the surface diffuseness damps the envelope), so the minima stay above zero.'],
      ]);
      return { q: `The squared form factor $|F(q)|^2$ seen in elastic electron scattering, as a function of momentum transfer $q$, for ${cas[0]}`, ...matchOne(r, L, cas),
        trap: 'Sharp edges in $\\rho(r)$ give zeros in $F(q)$; smooth distributions give smooth, zero-free form factors.' };
    } },
  { id: 'npr-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'order of magnitude',
    make(r) {
      const kind = int(r, 0, 2);
      let q, x, unit, sol;
      if (kind === 0) {
        const V = choose(r, [1, 2, 5, 10]);
        x = 2.3e17 * V * 1e-6; unit = '\\text{kg}';
        q = `The mass of ${V} cm$^3$ of nuclear matter (nucleons packed at nuclear density) is about`;
        sol = `Density $\\rho = 3m_u/(4\\pi r_0^3) \\approx 3(1.66\\times10^{-27})/(4\\pi(1.2\\times10^{-15})^3) \\approx 2.3\\times10^{17}\\text{ kg/m}^3$. Times $${V}\\times10^{-6}\\text{ m}^3$: $${sci(x)}$ kg.`;
      } else if (kind === 1) {
        const A = choose(r, [40, 64, 120, 208, 238]), Rf = 1.2 * Math.cbrt(A);
        x = 1240 / Rf; unit = '\\text{MeV}';
        q = `To resolve detail on the scale of the radius of a nucleus with $A = ${A}$, an electron's de Broglie wavelength must be no larger than that radius. The electron energy needed is about`;
        sol = `$R = 1.2(${A})^{1/3} = ${Rf.toFixed(2)}$ fm. For an ultra-relativistic electron $E \\approx hc/\\lambda = 1240\\text{ MeV fm}/${Rf.toFixed(2)}\\text{ fm} \\approx ${sci(x)}$ MeV.`;
      } else {
        const B = choose(r, [1, 2, 5, 10]), mu = choose(r, [[2.79, 'proton (${}^1$H)'], [0.70, '${}^{13}$C']]);
        x = mu[0] * 3.152e-8 * B; unit = '\\text{eV}';
        q = `The energy $\\mu B$ of the ${mu[1]} magnetic moment ($\\mu = ${mu[0]}\\,\\mu_N$) in a ${B} T field is about`;
        sol = `$\\mu_N = 3.152\\times10^{-8}$ eV/T, so $\\mu B = ${mu[0]}\\times3.152\\times10^{-8}\\times${B} \\approx ${sci(x)}$ eV: tiny next to $kT \\approx 0.025$ eV at room temperature, which is why NMR signals are weak.`;
      }
      const o = orderOpts(r, x, unit);
      return { q, options: o.options, answer: o.answer, sol, trap: 'Keep the femtometre and MeV scales in mind: $\\hbar c \\approx 197$ MeV fm, $r_0 \\approx 1.2$ fm.' };
    } },
];
