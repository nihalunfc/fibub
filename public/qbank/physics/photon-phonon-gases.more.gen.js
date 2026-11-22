// Extra question shapes for photon-phonon-gases (templates phgas-m31..m35). Imported by photon-phonon-gases.js.
import { int, choose, round, fmt } from '../_util.js';
import { msqOf, pickMcq, factMcq } from './_more.js';

export default [
  { id: 'phgas-m31', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'temperature scaling', format: 'scaling',
    make(r) {
      const d = choose(r, [1, 2, 3]);
      const C = choose(r, [
        [`the energy density of blackbody radiation in a ${d}-dimensional cavity`, d + 1, `Each mode holds energy $\\sim kT$ up to $\\omega \\sim kT/\\hbar$, and the number of modes per volume up to $\\omega$ grows as $\\omega^${d}$: $u \\propto T^{${d}}\\cdot T = T^{${d + 1}}$.`],
        [`the photon number density in a ${d}-dimensional cavity`, d, `The number of thermally excited modes per volume grows as $(kT/\\hbar c)^${d}$.`],
        [`the low-temperature lattice heat capacity of a ${d}-dimensional crystal (Debye)`, d, `$U \\propto T^{${d + 1}}$, so $C \\propto T^{${d}}$.`],
        ['the frequency at which the 3D blackbody spectrum $u_\\nu$ peaks', 1, "Wien's law: $h\\nu_{max} = 2.82\\,kT$."],
        ['the radiation pressure of 3D blackbody radiation', 4, '$P = u/3 \\propto T^4$.'],
        ['the mean energy per photon in 3D blackbody radiation', 1, '$\\langle E\\rangle = u/n \\approx 2.70\\,kT$.'],
      ]);
      const sh = (k) => (k === 1 ? '$T$' : `$T^{${k}}$`);
      const o = pickMcq(r, sh(C[1]), [1, 2, 3, 4, 5].filter((k) => k !== C[1]).map(sh));
      return { q: `How does ${C[0]} depend on temperature?`, ...o, sol: C[2],
        trap: 'In $d$ dimensions the number of modes below $\\omega$ goes as $\\omega^d$, so Stefan-Boltzmann becomes $T^{d+1}$.' };
    } },
  { id: 'phgas-m32', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Bose-Einstein condensation', format: 'statements',
    make(r) {
      const k = int(r, 2, 3);
      const not = r() < 0.4;
      const m = msqOf(r, [
        ['An ideal Bose gas in a 3D box condenses at a finite temperature', true, 'In 3D the excited states can hold only a finite number of particles at given $T$.'],
        ['An ideal Bose gas in a 2D box condenses at a finite temperature', false, 'The 2D density of states is constant, so the excited states can absorb any number of particles: no BEC at $T > 0$.'],
        ['An ideal Bose gas in a 3D harmonic trap condenses at a finite temperature', true, 'The trap density of states $\\propto E^2$ makes the excited-state capacity finite.'],
        ['Blackbody photons in a cavity form a condensate at low temperature', false, 'Photon number is not conserved and $\\mu = 0$; cooling simply removes photons.'],
        ['BEC needs attractive interactions between the bosons', false, 'It is a purely statistical effect, present for an ideal gas.'],
        [`If the density is multiplied by ${k ** 3}, $T_c$ is multiplied by ${k * k}`, true, `$T_c \\propto n^{2/3}$, and $(${k ** 3})^{2/3} = ${k * k}$.`],
        [`If the density is multiplied by ${k ** 3}, $T_c$ is multiplied by ${k ** 3}`, false, `$T_c \\propto n^{2/3}$ gives the factor $${k * k}$.`],
        ['Below $T_c$ in a 3D box the condensate fraction is $1 - (T/T_c)^{3/2}$', true, 'The excited states hold $N(T/T_c)^{3/2}$.'],
      ], { not });
      return { q: `Which statements about Bose-Einstein condensation are ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...m,
        trap: 'Whether an ideal gas condenses depends on the density of states: box in 3D yes, box in 2D no.' };
    } },
  { id: 'phgas-m33', type: 'mcq', level: 3, exams: ['gate', 'net', 'jam'], sub: 'Planck spectrum', format: 'graph in words',
    make(r) {
      const f = choose(r, [2, 3]), mode = int(r, 0, 3);
      const C = [
        ['At frequencies with $h\\nu \\ll kT$, the spectral energy density $u_\\nu$ grows as', '$\\nu^2$ (proportional to $T$)', ['$\\nu^3$', '$\\nu^3e^{-h\\nu/kT}$', '$\\nu$ (independent of $T$)', '$\\nu^4$'], 'For $h\\nu \\ll kT$, $1/(e^{h\\nu/kT} - 1) \\approx kT/h\\nu$, giving the Rayleigh-Jeans law $u_\\nu = 8\\pi\\nu^2kT/c^3$.'],
        ['At frequencies with $h\\nu \\gg kT$, the spectral energy density $u_\\nu$ behaves as', '$\\nu^3e^{-h\\nu/kT}$', ['$\\nu^2$ (proportional to $T$)', '$\\nu^{-2}$', '$e^{-h\\nu/kT}$ with no power of $\\nu$', '$\\nu^3$'], 'For $h\\nu \\gg kT$, $1/(e^{h\\nu/kT} - 1) \\approx e^{-h\\nu/kT}$: the Wien tail.'],
        [`If the temperature is multiplied by ${f}, the peak value of $u_\\nu$ is multiplied by`, `$${f ** 3}$`, [`$${f}$`, `$${f ** 4}$`, `$${f ** 5}$`, `$${f ** 2}$`], `$u_\\nu = \\tfrac{8\\pi h\\nu^3}{c^3}\\tfrac{1}{e^{h\\nu/kT} - 1}$; at the peak $h\\nu \\propto T$, so the peak value scales as $T^3 = ${f ** 3}$. (For $u_\\lambda$ the peak scales as $T^5$.)`],
        [`If the temperature is multiplied by ${f}, the peak value of $u_\\lambda$ (per unit wavelength) is multiplied by`, `$${f ** 5}$`, [`$${f}$`, `$${f ** 4}$`, `$${f ** 3}$`, `$${f ** 2}$`], `$u_\\lambda \\propto \\lambda^{-5}/(e^{hc/\\lambda kT} - 1)$; the peak wavelength scales as $1/T$, so the peak value scales as $T^5 = ${f ** 5}$.`],
      ][mode];
      const o = pickMcq(r, C[1], C[2]);
      return { q: `For blackbody radiation: ${C[0]}`, ...o, sol: C[3],
        trap: 'The total grows as $T^4$, but a peak value depends on whether the spectrum is per unit frequency ($T^3$) or per unit wavelength ($T^5$).' };
    } },
  { id: 'phgas-m34', type: 'mcq', level: 2, exams: ['gate', 'net', 'jam'], sub: 'photons and phonons', format: 'which is NOT',
    make(r) {
      const T = [
        ['Both have zero chemical potential in thermal equilibrium', 'Their numbers are not conserved.'],
        ['Both obey Bose-Einstein statistics', 'They are bosonic modes.'],
        ['The phonon spectrum has a maximum frequency, the photon spectrum does not', 'The lattice spacing cuts off phonon wavelengths.'],
        ['Phonons have three polarisations per wave vector, photons two', 'One longitudinal plus two transverse sound modes; light is purely transverse.'],
        ['At low temperature both give an energy density proportional to $T^4$', 'Both have linear dispersion at low frequency in 3D.'],
      ];
      const F = [
        ['The phonon heat capacity is proportional to $T^3$ at all temperatures', 'Only well below $\\theta_D$; at high $T$ it saturates at $3Nk$.'],
        ['The number of photons in a cavity is fixed', 'Walls absorb and emit photons, so the number adjusts to $T$.'],
        ['Phonons carry true momentum $\\hbar\\vec k$', 'They carry crystal momentum, defined only up to a reciprocal lattice vector.'],
        ['The blackbody energy density depends on the material of the cavity walls', 'Equilibrium radiation depends only on $T$ (Kirchhoff).'],
      ];
      const not = r() < 0.65;
      const o = factMcq(r, T, F, not);
      return { q: `Comparing a photon gas in a cavity with the phonon gas of a crystal, which ONE statement is ${not ? '<b>NOT</b> correct' : 'correct'}?`, ...o,
        trap: 'The $T^3$ law for phonons is a low-temperature result; photons have no Debye cut-off, so for them it holds at every $T$.' };
    } },
  { id: 'phgas-m35', type: 'mcq', level: 1, exams: ['jam', 'gate'], sub: "Wien's law", format: 'match the system',
    make(r) {
      const S = choose(r, [
        ['a cold interstellar dust cloud', 1, 'microwave'], ['a dust disc around a young star', 30, 'infrared'], ['a human body', 310, 'infrared'],
        ['a red dwarf star', 3000, 'infrared'], ['the solar surface', 5800, 'visible'], ['a hot blue star', 20000, 'ultraviolet'], ['the solar corona', 2e6, 'X-ray'], ['a cluster of galaxies (hot gas)', 1e8, 'X-ray'],
      ]);
      const lam = 2.898e-3 / S[1];
      const B = ['radio', 'microwave', 'infrared', 'visible', 'ultraviolet', 'X-ray'];
      const o = pickMcq(r, S[2], B.filter((b) => b !== S[2]));
      return { q: `Treat ${S[0]} as a blackbody at about $${fmt(S[1], 2)}$ K. In which band does its spectrum $u_\\lambda$ peak?`, ...o,
        sol: `Wien: $\\lambda_{max} = (2.898\\times10^{-3}\\text{ m K})/T = ${fmt(lam, 2)}$ m, which lies in the ${S[2]} band (radio above about 30 cm, microwave 1 mm to 30 cm, infrared 0.7 μm to 1 mm, visible 400 to 700 nm, ultraviolet 10 to 400 nm, X-ray below 10 nm).`,
        trap: 'A red dwarf still peaks in the infrared; "red" describes the visible tail, not the peak.' };
    } },
];
