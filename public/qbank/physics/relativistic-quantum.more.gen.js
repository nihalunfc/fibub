// Extra question shapes for relativistic-quantum (templates netrq-m31..m35). Imported by relativistic-quantum.js.
import { int, choose, mcqOptions } from '../_util.js';
import { msqOf } from './_more.js';
import { oneOf, orderOpts, matchOne } from './_odd.js';
import { vs, nt, sci } from './_vary.js';

export default [
  { id: 'netrq-m31', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'Dirac matrices', format: 'statements',
    make(r) {
      const N = int(r, 3, 7), odd = N % 2 === 1, not = r() < 0.5;
      const m = msqOf(r, [
        [`the trace of a product of ${N} gamma matrices $\\gamma^{\\mu_1}\\cdots\\gamma^{\\mu_{${N}}}$ vanishes identically`, odd, odd ? `For an odd number insert $\\gamma_5^2 = 1$ and anticommute $\\gamma_5$ through: the trace equals minus itself.` : 'For an even number the trace is a sum of products of metric tensors, generally nonzero (e.g. $\\text{Tr}\\,\\gamma^\\mu\\gamma^\\nu = 4g^{\\mu\\nu}$).'],
        ['$\\{\\gamma^\\mu, \\gamma^\\nu\\} = 2g^{\\mu\\nu}$', true, 'The defining Clifford algebra.'],
        ['the smallest gamma matrices in 3+1 dimensions are $4\\times4$', true, 'Four mutually anticommuting matrices with squares $\\pm1$ need dimension at least 4.'],
        ['the Dirac equation predicts $g = 2$ for the electron', true, 'Its non-relativistic limit is the Pauli equation with $g = 2$.'],
        ['the Klein-Gordon probability density can be negative', true, '$\\rho \\propto i(\\phi^*\\dot\\phi - \\phi\\dot\\phi^*)$ is not positive definite.'],
        ['the free Dirac Hamiltonian commutes with the orbital angular momentum $\\vec L$', false, 'Only $\\vec J = \\vec L + \\tfrac12\\vec\\Sigma$ commutes with it.'],
        ['the Klein-Gordon equation describes spin-1/2 particles', false, 'It is the equation for spin 0.'],
        ['the helicity operator commutes with the free Dirac Hamiltonian', true, '$\\vec\\Sigma\\cdot\\hat p$ commutes with $\\vec\\alpha\\cdot\\vec p + \\beta m$.'],
      ], { not });
      return { q: `Which of the following statements about relativistic wave equations are ${nt(not)}?`, ...m,
        trap: 'Traces of an odd number of gamma matrices vanish; spin is conserved only together with orbital angular momentum.' };
    } },
  { id: 'netrq-m32', type: 'mcq', level: 4, exams: ['net'], sub: 'fine structure',
    make(r) {
      const not = r() < 0.5;
      const m = oneOf(r, [
        ['the non-relativistic limit of the Dirac equation gives a spin-orbit term with the Thomas factor already included', true, 'The factor 1/2 comes out automatically.'],
        ['the Darwin term shifts only s states', true, 'It is proportional to $\\nabla^2V \\propto \\delta^3(\\vec r)$ for a Coulomb potential.'],
        ['fine-structure splittings scale as $\\alpha^2$ times the Bohr energies', true, 'They are of order $(Z\\alpha)^2$ relative to the gross structure.'],
        ['in Dirac\'s theory $2s_{1/2}$ and $2p_{1/2}$ of hydrogen are degenerate', true, 'Dirac energies depend only on $n$ and $j$.'],
        ['Dirac theory predicts the Lamb shift between $2s_{1/2}$ and $2p_{1/2}$', false, 'That splitting comes from QED (vacuum fluctuations), not the Dirac equation.'],
        ['Dirac hydrogen energies depend on $l$ as well as on $n$ and $j$', false, 'They depend on $n$ and $j$ only.'],
        ['the relativistic kinetic correction raises all levels of hydrogen', false, 'The $-p^4/(8m^3c^2)$ term lowers them.'],
      ], not);
      return { q: `Which statement about the fine structure of hydrogen-like atoms is ${nt(not)}?`, ...m,
        trap: 'Dirac: degenerate in $l$ for fixed $j$. QED breaks it (Lamb shift).' };
    } },
  { id: 'netrq-m33', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'interpretation', format: 'match',
    make(r) {
      const L = { kg: 'a spin-0 particle such as the pion', dirac: 'a massive spin-1/2 particle such as the electron', weyl: 'a massless spin-1/2 particle of definite chirality', proca: 'a massive spin-1 particle such as the W or Z', maxwell: 'a massless spin-1 particle (the photon)' };
      const cas = choose(r, [
        ['the Klein-Gordon equation $(\\Box + m^2)\\phi = 0$', 'kg', 'A scalar field: no spin degrees of freedom.'],
        ['the Dirac equation $(i\\gamma^\\mu\\partial_\\mu - m)\\psi = 0$', 'dirac', 'Four components: spin up/down for particle and antiparticle.'],
        ['the Weyl equation $i\\bar\\sigma^\\mu\\partial_\\mu\\psi_L = 0$', 'weyl', 'Two components, one helicity; massless.'],
        ['the Proca equation $\\partial_\\mu F^{\\mu\\nu} + m^2A^\\nu = 0$', 'proca', 'A vector field with mass: three polarisations.'],
        ['the source-free equation $\\partial_\\mu F^{\\mu\\nu} = 0$', 'maxwell', 'Gauge-invariant massless vector field: two polarisations.'],
      ]);
      return { q: `Which particle is described by ${cas[0]}?`, ...matchOne(r, L, cas),
        trap: 'Match the number of components to spin, and the mass term to massive particles.' };
    } },
  { id: 'netrq-m34', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Dirac hydrogen', format: 'limiting case',
    make(r) {
      const Z = choose(r, [20, 40, 60, 80, 92]), a = 1 / 137.036, za = Z * a, mc2 = 511.0;
      const ex = mc2 * (1 - Math.sqrt(1 - za * za)), nr = (mc2 * za * za) / 2, f = (x) => `${x.toFixed(1)} keV`;
      const o = mcqOptions(r, ex, [nr, mc2 * za * za, nr / 2, mc2 * za], f);
      return { q: `For a hydrogen-like ion with $Z = ${Z}$ (point nucleus), the Dirac equation gives the $1s_{1/2}$ energy $E = mc^2\\sqrt{1 - (Z\\alpha)^2}$. The binding energy of the electron is`,
        options: o.options, answer: o.answer,
        sol: `$Z\\alpha = ${za.toFixed(4)}$. $B = mc^2[1 - \\sqrt{1 - (Z\\alpha)^2}] = 511\\times${(1 - Math.sqrt(1 - za * za)).toFixed(5)} = ${ex.toFixed(1)}$ keV. Expanding the root gives the Bohr value $\\tfrac12mc^2(Z\\alpha)^2 = ${nr.toFixed(1)}$ keV, which underestimates the binding more and more as $Z\\alpha$ grows.`,
        trap: 'At large $Z$ the Bohr formula is noticeably low; the exact Dirac value includes the $(Z\\alpha)^4$ fine-structure term and higher.' };
    } },
  { id: 'netrq-m35', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Compton wavelength', format: 'order of magnitude',
    make(r) {
      const kind = int(r, 0, 1);
      let q, x, unit, sol;
      if (kind === 0) {
        const [m, nm] = choose(r, [[0.511, 'an electron'], [105.66, 'a muon'], [938.27, 'a proton'], [139.57, 'a pion']]);
        x = (197.33 / (2 * m)) * 1e-15; unit = '\\text{m}';
        q = `The amplitude of the zitterbewegung of ${nm}, of order $\\hbar/(2mc)$, is about`;
        sol = `$\\hbar/(2mc) = \\hbar c/(2mc^2) = 197.3/(2\\times${m})$ fm $= ${sci(x)}$ m: half the reduced Compton wavelength.`;
      } else {
        const [m, nm] = choose(r, [[9.109e-31, 'electrons'], [1.884e-28, 'muons']]);
        x = (m * m * 2.998e8 ** 3) / (1.602e-19 * 1.0546e-34); unit = '\\text{V/m}';
        q = `The Schwinger critical field $E_c = m^2c^3/(e\\hbar)$, above which the vacuum creates pairs of ${nm} copiously, is about`;
        sol = `$E_c = m^2c^3/(e\\hbar) = ${sci(x)}$ V/m: the field that does work $mc^2$ on a charge over one reduced Compton wavelength.`;
      }
      const o = orderOpts(r, x, unit);
      return { q, options: o.options, answer: o.answer, sol, trap: 'Relativistic quantum effects live at the Compton scale $\\hbar/mc$, about $4\\times10^{-13}$ m for the electron.' };
    } },
];
