// Relativistic quantum mechanics, NET depth: the Klein-Gordon equation and its density, negative energies, Yukawa
// range of a massive field, the Dirac equation and the algebra of alpha, beta and gamma matrices, traces, spin and
// g = 2, conserved quantities (J, helicity), zitterbewegung, the non-relativistic limit (Pauli, spin-orbit, Darwin),
// the Dirac hydrogen atom and fine structure, hole theory, the Klein paradox and bilinear covariants.
// Original questions (fibub) for CSIR NET Part C and GATE. Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import more from './relativistic-quantum.more.gen.js';

const ALPHA = 1 / 137.035999, MEC2 = 0.51099895, HBC = 197.3269804, HBAR_MEVS = 6.582119569e-22, RY = 13.605693;
const diracE = (n, j, Z) => { const k = j + 0.5, Za = Z * ALPHA; return 1 / Math.sqrt(1 + (Za / (n - k + Math.sqrt(k * k - Za * Za))) ** 2); };

export default {
  topic: 'relativistic-quantum',
  items: [
    // ---------- level 1 ----------
    { id: 'netrq-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Klein-Gordon equation',
      q: 'The Klein-Gordon equation for a free particle of mass $m$ follows from which energy-momentum relation with $E\\to i\\hbar\\partial_t$, $\\vec p\\to-i\\hbar\\nabla$?',
      options: ['$E = p^2/2m$', '$E = pc$', '$E = mc^2 + p^2/2m$', '$E^2 = p^2c^2 + m^2c^4$'], answer: 3,
      sol: 'Substituting into $E^2 = p^2c^2 + m^2c^4$ gives $-\\hbar^2\\partial_t^2\\psi = (-\\hbar^2c^2\\nabla^2 + m^2c^4)\\psi$, i.e. $\\left(\\Box + \\dfrac{m^2c^2}{\\hbar^2}\\right)\\psi = 0$ with $\\Box = \\dfrac{1}{c^2}\\partial_t^2 - \\nabla^2$. It is second order in time.' },
    { id: 'netrq-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Dirac equation',
      q: 'The smallest dimension of the matrices $\\alpha_x, \\alpha_y, \\alpha_z, \\beta$ in the Dirac Hamiltonian $H = c\\,\\vec\\alpha\\cdot\\vec p + \\beta mc^2$ is',
      options: ['2', '3', '4', '8'], answer: 2,
      sol: 'They must be Hermitian, square to 1 and mutually anticommute. Then each is traceless with eigenvalues $\\pm1$, so the dimension is even. In two dimensions only three anticommuting matrices exist (the Pauli matrices), but four are needed. So the minimum is 4, and the Dirac wavefunction has four components.' },
    { id: 'netrq-003', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'Yukawa range',
      q: 'A force carried by a massive spin-0 field obeying the static Klein-Gordon equation has the Yukawa form $e^{-r/R}/r$ with $R = \\hbar/mc$. For the pion ($mc^2 = 139.6$ MeV), $R$ is ______ fm (to two decimal places). ($\\hbar c = 197.3$ MeV fm.)',
      answer: 1.41, tol: 0.01, calc: () => HBC / 139.57039,
      sol: 'Static KG with a point source: $(\\nabla^2 - m^2c^2/\\hbar^2)\\phi = -g\\delta^3(\\vec r)$, solved by $\\phi\\propto e^{-r/R}/r$, $R = \\hbar/mc = \\hbar c/mc^2 = 197.3/139.6 = 1.41$ fm: the range of the nuclear force, as Yukawa predicted.' },
    { id: 'netrq-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'spin',
      q: 'The Dirac equation for an electron in a magnetic field predicts a spin $g$-factor of',
      options: ['1', '2', '$2 + \\alpha/\\pi$', '0'], answer: 1,
      sol: 'The non-relativistic limit gives the Pauli equation with the term $-\\dfrac{e\\hbar}{2m}\\vec\\sigma\\cdot\\vec B$, i.e. $\\vec\\mu = -g\\mu_B\\vec S/\\hbar$ with $g = 2$ exactly. The measured $g - 2\\approx\\alpha/\\pi$ comes from quantum field theory (radiative corrections), beyond the Dirac equation.' },
    { id: 'netrq-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'negative energy',
      q: 'For a free particle, the relativistic wave equations give energies',
      options: ['$E = +\\sqrt{p^2c^2 + m^2c^4}$ only', '$E\\ge0$ for Klein-Gordon and $E\\le0$ for Dirac', '$E = \\pm\\sqrt{p^2c^2 + m^2c^4}$, with a gap of $2mc^2$ between the branches', 'any real value'], answer: 2,
      sol: 'Both KG and Dirac admit plane waves with $E = \\pm\\sqrt{p^2c^2 + m^2c^4}$. The negative branch cannot simply be discarded (interactions mix them). Dirac reinterpreted a filled negative-energy sea with holes as antiparticles; the gap $2mc^2$ = 1.022 MeV for electrons is the pair-creation threshold.' },
    { id: 'netrq-006', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'Compton wavelength',
      q: 'Relativistic effects become unavoidable when an electron is confined to less than its reduced Compton wavelength $\\hbar/m_ec$. This length is ______ fm (to the nearest whole number). ($m_ec^2 = 0.511$ MeV, $\\hbar c = 197.3$ MeV fm.)',
      answer: 386, tol: 1, calc: () => HBC / MEC2,
      sol: '$\\hbar/m_ec = \\hbar c/m_ec^2 = 197.33/0.511 = 386$ fm. Localising more tightly gives $\\Delta p\\gtrsim m_ec$, enough energy to create pairs, so a single-particle description breaks down.' },

    // ---------- level 2 ----------
    { id: 'netrq-007', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Klein-Gordon density',
      q: 'The conserved density of the Klein-Gordon equation is $\\rho = \\dfrac{i\\hbar}{2mc^2}\\left(\\psi^*\\dfrac{\\partial\\psi}{\\partial t} - \\psi\\dfrac{\\partial\\psi^*}{\\partial t}\\right)$. Why can it not be a probability density?',
      options: ['It is not conserved', 'It is not Lorentz covariant', 'It vanishes for plane waves', 'It can be negative, for example for negative-energy solutions'], answer: 3,
      sol: 'For $\\psi = e^{-iEt/\\hbar}$, $\\rho = \\dfrac{E}{mc^2}|\\psi|^2$, negative when $E < 0$. Because the equation is second order in time, $\\psi$ and $\\partial_t\\psi$ can be chosen independently, so $\\rho$ can have either sign. Pauli and Weisskopf reinterpreted $e\\rho$ as a charge density.' },
    { id: 'netrq-008', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'Dirac matrices',
      q: 'The Dirac matrices satisfy $\\alpha_i\\alpha_j + \\alpha_j\\alpha_i = 2\\delta_{ij}$, $\\alpha_i\\beta + \\beta\\alpha_i = 0$, $\\beta^2 = 1$, all Hermitian. Which follow?',
      options: ['Each has eigenvalues $\\pm1$ only', 'Each is traceless', '$\\text{Tr}(\\alpha_x\\alpha_y) = 0$', '$\\det\\beta = 0$'], answer: [0, 1, 2],
      sol: 'Hermitian and squaring to 1: eigenvalues $\\pm1$. $\\text{Tr}\\,\\alpha_i = \\text{Tr}(\\alpha_i\\beta\\beta) = -\\text{Tr}(\\beta\\alpha_i\\beta) = -\\text{Tr}(\\alpha_i\\beta\\beta) = -\\text{Tr}\\,\\alpha_i$ (cyclicity), so zero. $\\text{Tr}(\\alpha_x\\alpha_y) = -\\text{Tr}(\\alpha_y\\alpha_x) = -\\text{Tr}(\\alpha_x\\alpha_y)$, zero. $\\beta^2 = 1$ means $\\det\\beta = \\pm1$, never zero.' },
    { id: 'netrq-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Dirac density',
      q: 'For the Dirac equation, the conserved probability density is',
      options: ['$\\psi^\\dagger\\psi$, which is never negative', '$\\bar\\psi\\psi$, which can be negative', '$\\dfrac{i\\hbar}{2mc^2}(\\psi^\\dagger\\dot\\psi - \\dot\\psi^\\dagger\\psi)$', '$|\\psi_1|^2 - |\\psi_3|^2$'], answer: 0,
      sol: 'Being first order in time, the Dirac equation gives $\\partial_t(\\psi^\\dagger\\psi) + \\nabla\\cdot(c\\psi^\\dagger\\vec\\alpha\\psi) = 0$, with $\\rho = \\psi^\\dagger\\psi = \\sum|\\psi_i|^2\\ge0$. This was Dirac\'s motivation. $\\bar\\psi\\psi = \\psi^\\dagger\\gamma^0\\psi$ is the Lorentz scalar, not the density.' },
    { id: 'netrq-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'wave packets',
      q: 'An electron wave packet has central momentum $1.0$ MeV/$c$. Its group velocity, from $E = \\sqrt{p^2c^2 + m^2c^4}$, is ______ $c$ (to three decimal places).',
      answer: 0.890, tol: 0.002, calc: () => 1 / Math.sqrt(1 + MEC2 ** 2),
      sol: '$v_g = \\dfrac{dE}{dp} = \\dfrac{pc^2}{E}$. $E = \\sqrt{1.0^2 + 0.511^2} = 1.123$ MeV, so $v_g = 1.0/1.123\\,c = 0.890c$, the classical particle velocity. The phase velocity is $E/p = 1.123c$.' },
    { id: 'netrq-011', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'gamma matrices',
      q: 'With $\\gamma^0 = \\beta$, $\\gamma^i = \\beta\\alpha_i$ and metric $(+,-,-,-)$, the gamma matrices obey',
      options: ['$[\\gamma^\\mu, \\gamma^\\nu] = 2g^{\\mu\\nu}$', '$\\{\\gamma^\\mu, \\gamma^\\nu\\} = 2g^{\\mu\\nu}$', '$\\{\\gamma^\\mu, \\gamma^\\nu\\} = 2\\delta^{\\mu\\nu}$', '$\\gamma^\\mu\\gamma^\\nu = g^{\\mu\\nu}$'], answer: 1,
      sol: '$(\\gamma^0)^2 = 1$. $(\\gamma^i)^2 = \\beta\\alpha_i\\beta\\alpha_i = -\\beta\\beta\\alpha_i\\alpha_i = -1$. Mixed pairs anticommute. Together: $\\{\\gamma^\\mu, \\gamma^\\nu\\} = 2g^{\\mu\\nu}$ with $g = \\text{diag}(1, -1, -1, -1)$. The Dirac equation becomes $(i\\hbar\\gamma^\\mu\\partial_\\mu - mc)\\psi = 0$.' },
    { id: 'netrq-012', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'traces',
      q: 'Using $\\{\\gamma^\\mu, \\gamma^\\nu\\} = 2g^{\\mu\\nu}$ in four dimensions, the contraction $\\gamma^\\mu\\gamma_\\mu$ (summed over $\\mu$) equals ______ times the identity.',
      answer: 4, tol: 0, calc: () => 4,
      sol: '$\\gamma^\\mu\\gamma_\\mu = g_{\\mu\\nu}\\gamma^\\mu\\gamma^\\nu = \\tfrac12g_{\\mu\\nu}\\{\\gamma^\\mu, \\gamma^\\nu\\} = g_{\\mu\\nu}g^{\\mu\\nu} = \\delta^\\mu_\\mu = 4$. Explicitly: $\\gamma^0\\gamma_0 = (\\gamma^0)^2 = 1$ and $\\gamma^i\\gamma_i = -(\\gamma^i)^2 = +1$ for each $i$, so the sum is $1 + 1 + 1 + 1$.' },
    { id: 'netrq-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'hole theory',
      q: 'In Dirac\'s hole theory, a vacancy in the filled sea of negative-energy electron states behaves as',
      options: ['a particle with charge $+e$, positive energy and the electron\'s mass: the positron', 'a negative-energy electron', 'a massless neutral particle', 'a proton'], answer: 0,
      sol: 'Removing an electron of energy $-|E|$, momentum $\\vec p$ and charge $-e$ leaves the system with energy $+|E|$, momentum $-\\vec p$ and charge $+e$, relative to the vacuum. Dirac first hoped it was the proton, but the hole must have the electron\'s mass. Anderson found the positron in 1932.' },
    { id: 'netrq-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Weyl equation',
      q: 'For a massless spin-1/2 particle, the Dirac equation splits into two two-component Weyl equations, $i\\hbar\\partial_t\\chi = \\pm c\\,\\vec\\sigma\\cdot\\vec p\\,\\chi$. Their solutions have',
      options: ['no spin', 'spin 1', 'definite helicity $\\pm\\tfrac12$, the same as their chirality', 'only negative energies'], answer: 2,
      sol: 'With $m = 0$ no $\\beta$ is needed, so $2\\times2$ Pauli matrices suffice. $E = \\pm cp$ and $\\vec\\sigma\\cdot\\hat p\\chi = \\pm\\chi$: each Weyl field describes particles of one helicity (and antiparticles of the other). Neutrinos in the Standard Model were written this way (left-handed).' },
    { id: 'netrq-015', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'pair creation',
      q: 'A photon creates an electron-positron pair in the field of a heavy nucleus (nuclear recoil negligible). The threshold photon energy is ______ MeV (to three decimal places).',
      answer: 1.022, tol: 0.001, calc: () => 2 * MEC2,
      sol: 'The photon must lift an electron across the $2mc^2$ gap: $E_\\gamma = 2\\times0.511 = 1.022$ MeV. In the field of a free electron the threshold is $4mc^2$, because the recoiling target must share momentum.' },
    { id: 'netrq-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'free solutions',
      q: 'For a Dirac particle at rest ($\\vec p = 0$), $H = \\beta mc^2$ with $\\beta = \\text{diag}(1, 1, -1, -1)$. The four independent solutions are',
      options: ['four positive-energy states with spins $\\pm\\tfrac12, \\pm\\tfrac32$', 'one positive- and three negative-energy states', 'two positive-energy (spin up, down) and two negative-energy (spin up, down) states', 'two states, since two components vanish'], answer: 2,
      sol: '$\\psi = e^{-imc^2t/\\hbar}(1, 0, 0, 0)$ and $(0, 1, 0, 0)$ have $E = +mc^2$; $\\psi = e^{+imc^2t/\\hbar}(0, 0, 1, 0)$ and $(0, 0, 0, 1)$ have $E = -mc^2$. Within each pair, $\\Sigma_z = \\text{diag}(\\sigma_z, \\sigma_z)$ gives spin $\\pm\\tfrac12$.' },

    // ---------- level 3 ----------
    { id: 'netrq-017', type: 'mcq', level: 3, exams: ['net'], sub: 'conserved quantities',
      q: 'For a free Dirac particle, which operator commutes with $H = c\\,\\vec\\alpha\\cdot\\vec p + \\beta mc^2$?',
      options: ['$\\vec L = \\vec r\\times\\vec p$', '$\\vec S = \\tfrac\\hbar2\\vec\\Sigma$', '$\\vec J = \\vec L + \\tfrac\\hbar2\\vec\\Sigma$', '$\\vec r$'], answer: 2,
      sol: '$[L_i, H] = i\\hbar c(\\vec\\alpha\\times\\vec p)_i \\ne 0$ and $[S_i, H] = -i\\hbar c(\\vec\\alpha\\times\\vec p)_i$. They cancel in $\\vec J$, which is conserved. So the Dirac equation automatically contains spin $\\tfrac12$: orbital angular momentum alone is not conserved.' },
    { id: 'netrq-018', type: 'nat', level: 3, exams: ['net'], sub: 'zitterbewegung',
      q: 'Interference between positive- and negative-energy components makes the position of a free Dirac electron jitter (zitterbewegung) at angular frequency $2mc^2/\\hbar$. This frequency is ______ $\\times10^{21}$ s$^{-1}$ (to two decimal places). ($\\hbar = 6.582\\times10^{-22}$ MeV s.)',
      answer: 1.55, tol: 0.01, calc: () => 2 * MEC2 / HBAR_MEVS / 1e21,
      sol: '$\\omega = 2m_ec^2/\\hbar = 1.022\\text{ MeV}/6.582\\times10^{-22}\\text{ MeV s} = 1.55\\times10^{21}$ s$^{-1}$. The amplitude is about $\\hbar/2mc = 193$ fm. Wave packets built from positive energies only show no jitter.' },
    { id: 'netrq-019', type: 'mcq', level: 3, exams: ['net'], sub: 'velocity operator',
      q: 'In Dirac theory the velocity operator is $\\dot{\\vec r} = \\dfrac{i}{\\hbar}[H, \\vec r] = c\\vec\\alpha$. A measurement of one velocity component therefore gives',
      options: ['$\\pm c$', '$p_x/m$', '$p_xc^2/E$', 'any value between $-c$ and $c$'], answer: 0,
      sol: '$[H, x] = c\\alpha_x[p_x, x] = -i\\hbar c\\alpha_x$, so $\\dot x = c\\alpha_x$, whose eigenvalues are $\\pm1$ times $c$. The expectation value in a positive-energy packet is the ordinary $p_xc^2/E$; the instantaneous $\\pm c$ reflects zitterbewegung and is a sign that Dirac theory is not a one-particle theory.' },
    { id: 'netrq-020', type: 'nat', level: 3, exams: ['net'], sub: 'Dirac hydrogen',
      q: 'The Dirac ground-state energy of a hydrogen-like ion is $E = m_ec^2\\sqrt{1 - (Z\\alpha)^2}$. For mercury ($Z = 80$, point nucleus), the 1s binding energy $m_ec^2 - E$ is ______ keV (to one decimal place). ($m_ec^2 = 511.0$ keV, $\\alpha = 1/137.036$.)',
      answer: 96.1, tol: 0.1, calc: () => 510.99895 * (1 - Math.sqrt(1 - (80 * ALPHA) ** 2)),
      sol: '$Z\\alpha = 80/137.036 = 0.5838$, $(Z\\alpha)^2 = 0.3408$, $\\sqrt{0.6592} = 0.8119$. Binding $= 511.0\\times(1 - 0.8119) = 96.1$ keV, compared with $Z^2\\times13.6$ eV $= 87.1$ keV non-relativistically: a 10% relativistic increase.',
      trap: 'For small $Z\\alpha$ the expansion gives $\\tfrac12(Z\\alpha)^2mc^2$, the Bohr value; at $Z = 80$ that is no longer accurate.' },
    { id: 'netrq-021', type: 'mcq', level: 3, exams: ['net'], sub: 'Dirac hydrogen',
      q: 'In the Dirac theory of hydrogen (no QED), the energy depends on $n$ and $j$ only. Which pair of levels is therefore exactly degenerate?',
      options: ['$2s_{1/2}$ and $2p_{3/2}$', '$2p_{1/2}$ and $2p_{3/2}$', '$1s_{1/2}$ and $2s_{1/2}$', '$2s_{1/2}$ and $2p_{1/2}$'], answer: 3,
      sol: '$E_{nj} = mc^2\\left[1 + \\left(\\dfrac{Z\\alpha}{n - (j + \\tfrac12) + \\sqrt{(j + \\tfrac12)^2 - Z^2\\alpha^2}}\\right)^2\\right]^{-1/2}$ has no $l$. $2s_{1/2}$ and $2p_{1/2}$ share $n = 2$, $j = \\tfrac12$. Lamb and Retherford (1947) found them split by 1058 MHz, explained by QED.' },
    { id: 'netrq-022', type: 'nat', level: 3, exams: ['net'], sub: 'fine structure',
      q: 'From the Dirac formula, the hydrogen $2p_{3/2}$-$2p_{1/2}$ splitting is $\\alpha^2R_\\infty hc/16$ to leading order. In frequency units this is ______ GHz (to one decimal place). ($R_\\infty hc = 13.606$ eV.)',
      answer: 10.9, tol: 0.1, calc: () => RY * ALPHA ** 2 / 16 * 1.602176634e-19 / 6.62607015e-34 / 1e9,
      sol: 'Leading order: $E_{nj} = -\\dfrac{R}{n^2}\\left[1 + \\dfrac{\\alpha^2}{n^2}\\left(\\dfrac{n}{j + \\tfrac12} - \\dfrac34\\right)\\right]$. For $n = 2$ the bracket terms are $2$ ($j = \\tfrac12$) and $1$ ($j = \\tfrac32$), so $\\Delta E = \\dfrac R4\\cdot\\dfrac{\\alpha^2}{4} = \\dfrac{13.606\\times5.325\\times10^{-5}}{16} = 4.53\\times10^{-5}$ eV $= 10.9$ GHz.' },
    { id: 'netrq-023', type: 'msq', level: 3, exams: ['net'], sub: 'non-relativistic limit',
      q: 'Expanding the Dirac equation for an electron in a potential $V(r)$ to order $v^2/c^2$ gives the Pauli Hamiltonian plus corrections. Which terms appear?',
      options: ['$-\\dfrac{p^4}{8m^3c^2}$ (relativistic kinetic energy)', '$\\dfrac{1}{2m^2c^2}\\dfrac1r\\dfrac{dV}{dr}\\vec L\\cdot\\vec S$ (spin-orbit, with the Thomas factor already included)', '$\\dfrac{\\hbar^2}{8m^2c^2}\\nabla^2V$ (Darwin term), which shifts only $s$ states in hydrogen', 'a term $\\propto\\vec L\\cdot\\vec B$ with $g_L = 2$'], answer: [0, 1, 2],
      sol: 'The Foldy-Wouthuysen expansion gives exactly the first three. The spin-orbit coefficient is half the naive rest-frame value: the Thomas precession comes out automatically. For hydrogen $\\nabla^2V\\propto\\delta^3(\\vec r)$, so the Darwin term acts only where $\\psi(0)\\ne0$: $l = 0$. The orbital $g$-factor stays 1; it is the spin that has $g = 2$.' },
    { id: 'netrq-024', type: 'nat', level: 3, exams: ['net'], sub: 'non-relativistic limit',
      q: 'In the non-relativistic limit the lower (small) components of a positive-energy Dirac spinor are about $\\dfrac{\\vec\\sigma\\cdot\\vec p}{2mc}$ times the upper ones. For the hydrogen ground state ($v\\approx\\alpha c$), the ratio of small to large components is about ______ $\\times10^{-3}$ (to two decimal places).',
      answer: 3.65, tol: 0.02, calc: () => ALPHA / 2 * 1e3,
      sol: 'From the lower half of the Dirac equation, $\\chi\\approx\\dfrac{\\vec\\sigma\\cdot\\vec p}{2mc}\\phi$, of size $\\dfrac{p}{2mc} = \\dfrac{v}{2c}$. With $v = \\alpha c$: $\\alpha/2 = 3.65\\times10^{-3}$. Relativistic corrections are of order the square, $\\alpha^2\\sim5\\times10^{-5}$.' },
    { id: 'netrq-025', type: 'mcq', level: 3, exams: ['net'], sub: 'bilinear covariants',
      q: 'Under Lorentz transformations and parity, $\\bar\\psi\\gamma^5\\psi$ (with $\\gamma^5 = i\\gamma^0\\gamma^1\\gamma^2\\gamma^3$) transforms as a',
      options: ['scalar', 'vector', 'axial vector', 'pseudoscalar'], answer: 3,
      sol: 'The five bilinears: $\\bar\\psi\\psi$ scalar, $\\bar\\psi\\gamma^5\\psi$ pseudoscalar (invariant under rotations and boosts, odd under parity), $\\bar\\psi\\gamma^\\mu\\psi$ vector, $\\bar\\psi\\gamma^\\mu\\gamma^5\\psi$ axial vector, $\\bar\\psi\\sigma^{\\mu\\nu}\\psi$ antisymmetric tensor. Together they span the 16 products of gamma matrices.' },
    { id: 'netrq-026', type: 'nat', level: 3, exams: ['net'], sub: 'traces',
      q: 'Using the trace rules, $\\text{Tr}(\\gamma^\\mu\\gamma^\\nu\\gamma^\\rho\\gamma^\\sigma) = 4(g^{\\mu\\nu}g^{\\rho\\sigma} - g^{\\mu\\rho}g^{\\nu\\sigma} + g^{\\mu\\sigma}g^{\\nu\\rho})$ with $g = \\text{diag}(1, -1, -1, -1)$, the value of $\\text{Tr}(\\gamma^0\\gamma^1\\gamma^0\\gamma^1)$ is ______.',
      answer: 4, tol: 0, calc: () => 4 * (0 * 0 - 1 * (-1) + 0),
      sol: '$\\mu = \\rho = 0$, $\\nu = \\sigma = 1$: $g^{01}g^{01} = 0$, $g^{00}g^{11} = (1)(-1) = -1$, $g^{01}g^{10} = 0$. Trace $= 4(0 - (-1) + 0) = 4$. Directly: $\\gamma^0\\gamma^1\\gamma^0\\gamma^1 = -(\\gamma^0)^2(\\gamma^1)^2 = -(1)(-1) = 1$, whose trace is 4.' },
    { id: 'netrq-027', type: 'mcq', level: 3, exams: ['net'], sub: 'helicity',
      q: 'For a free Dirac particle with momentum $\\vec p$, which spin observable has a sharp value in an energy eigenstate?',
      options: ['$\\Sigma_z$, whatever the direction of $\\vec p$', 'the helicity $\\vec\\Sigma\\cdot\\hat p$', '$\\Sigma_x$ and $\\Sigma_y$ together', 'none: spin never commutes with $H$'], answer: 1,
      sol: '$[\\vec\\Sigma\\cdot\\vec p, H] = 0$ because $\\vec\\Sigma\\cdot\\vec p$ commutes with $\\vec\\alpha\\cdot\\vec p$ (as $\\Sigma_i$ and $\\alpha_j$ share the algebra of Pauli matrices) and with $\\beta$. $\\Sigma_z$ commutes with $H$ only if $\\vec p\\parallel\\hat z$. So free spinors are labelled by $E$, $\\vec p$ and helicity.' },
    { id: 'netrq-028', type: 'mcq', level: 3, exams: ['net'], sub: 'Klein-Gordon atoms',
      q: 'The Klein-Gordon equation with a Coulomb potential gives hydrogen-like levels that, at order $(Z\\alpha)^4$, depend on',
      options: ['$n$ and $l$, and do not match the electron\'s observed fine structure', '$n$ and $j$, exactly as Dirac', '$n$ only', '$l$ only'], answer: 0,
      sol: 'KG: $E_{nl} = mc^2\\left[1 + \\left(\\dfrac{Z\\alpha}{n - l - \\tfrac12 + \\sqrt{(l + \\tfrac12)^2 - Z^2\\alpha^2}}\\right)^2\\right]^{-1/2}$, i.e. Dirac\'s formula with $j$ replaced by $l$. It describes spinless particles such as pions in pionic atoms, and gives the wrong fine-structure splittings for electrons.' },

    // ---------- level 4 ----------
    { id: 'netrq-029', type: 'mcq', level: 4, exams: ['net'], sub: 'Klein paradox',
      q: 'A Dirac electron of energy $E$ meets a potential step of height $V_0$. Which statement describes the Klein paradox?',
      options: ['For $V_0 > E + mc^2$ the transmitted wave is oscillatory and the reflection coefficient can exceed 1 (or the transmission is large), signalling pair creation at the step', 'For any $V_0 > E$ the wave is totally reflected, as in non-relativistic QM', 'The transmission vanishes when $V_0 = 2mc^2$', 'The step reflects negative-energy states only'], answer: 0,
      sol: 'For $E - mc^2 < V_0 < E + mc^2$ the wave inside is evanescent. For $V_0 > E + mc^2$, $(E - V_0)^2 > m^2c^4$ again and the transmitted wave propagates, being a negative-energy (positron) state inside the barrier. The one-particle currents then give $R > 1$ (or large $T$, depending on the group-velocity choice): the strong field creates pairs. It needs a step of over $2mc^2$ within a Compton wavelength.' },
    { id: 'netrq-030', type: 'nat', level: 4, exams: ['net'], sub: 'Dirac hydrogen',
      q: 'Using $E_{nj} = m_ec^2\\left[1 + \\left(\\dfrac{Z\\alpha}{n - (j + \\tfrac12) + \\sqrt{(j + \\tfrac12)^2 - Z^2\\alpha^2}}\\right)^2\\right]^{-1/2}$, the $1s_{1/2}$ binding energy of hydrogen ($Z = 1$) exceeds the Bohr value $\\tfrac12\\alpha^2m_ec^2 = 13.6057$ eV by ______ $\\times10^{-4}$ eV (to two decimal places).',
      answer: 1.81, tol: 0.02, calc: () => (510998.95 * (1 - Math.sqrt(1 - ALPHA ** 2)) - 0.5 * ALPHA ** 2 * 510998.95) * 1e4,
      sol: 'For $n = 1$, $j = \\tfrac12$: $E = mc^2\\sqrt{1 - \\alpha^2}$. Expanding $1 - \\sqrt{1 - x} = \\tfrac x2 + \\tfrac{x^2}{8}$ with $x = \\alpha^2 = 5.325\\times10^{-5}$: the extra binding is $\\tfrac18\\alpha^4mc^2 = 0.125\\times2.836\\times10^{-9}\\times511{,}000$ eV $= 1.81\\times10^{-4}$ eV. This matches the fine-structure formula for $n = 1$: $\\tfrac{R\\alpha^2}{n^4}(\\tfrac{n}{j + 1/2} - \\tfrac34) = \\tfrac14R\\alpha^2$.' },
    { id: 'netrq-031', type: 'mcq', level: 4, exams: ['net'], sub: 'critical charge',
      q: 'For a point nucleus, the Dirac $1s_{1/2}$ energy $mc^2\\sqrt{1 - (Z\\alpha)^2}$ becomes complex when',
      options: ['$Z > 68$', '$Z\\alpha > 1$, i.e. $Z > 137$', '$Z\\alpha > 1/2$', 'never'], answer: 1,
      sol: 'The square root turns imaginary for $Z\\alpha > 1$, $Z > 137$: the point-Coulomb Dirac problem breaks down. With a finite nucleus the 1s level instead dives into the negative-energy continuum near $Z\\approx170$, where spontaneous positron emission is predicted. (For a spin-0 particle obeying the Klein-Gordon equation the 1s level fails earlier, at $Z\\alpha = 1/2$.)' },
    { id: 'netrq-032', type: 'nat', level: 4, exams: ['net'], sub: 'traces',
      q: 'Evaluate $\\text{Tr}(\\gamma^\\mu\\gamma^\\nu)\\,\\text{Tr}(\\gamma_\\mu\\gamma_\\nu)$, summed over $\\mu$ and $\\nu$ (four dimensions).',
      answer: 64, tol: 0, calc: () => 16 * 4,
      sol: '$\\text{Tr}(\\gamma^\\mu\\gamma^\\nu) = 4g^{\\mu\\nu}$ and $\\text{Tr}(\\gamma_\\mu\\gamma_\\nu) = 4g_{\\mu\\nu}$. The product summed is $16g^{\\mu\\nu}g_{\\mu\\nu} = 16\\delta^\\mu_\\mu = 16\\times4 = 64$.',
      trap: 'Each trace carries a factor 4 (the dimension of the matrices), and $g^{\\mu\\nu}g_{\\mu\\nu} = 4$, not 1.' },
    { id: 'netrq-033', type: 'mcq', level: 4, exams: ['net'], sub: 'gamma matrices',
      q: 'Which identity is correct (four dimensions, $\\{\\gamma^\\mu, \\gamma^\\nu\\} = 2g^{\\mu\\nu}$)?',
      options: ['$\\gamma^\\mu\\gamma^\\nu\\gamma_\\mu = 2\\gamma^\\nu$', '$\\gamma^\\mu\\gamma^\\nu\\gamma_\\mu = 4\\gamma^\\nu$', '$\\gamma^\\mu\\gamma^\\nu\\gamma_\\mu = -2\\gamma^\\nu$', '$\\gamma^\\mu\\gamma^\\nu\\gamma_\\mu = 0$'], answer: 2,
      sol: '$\\gamma^\\mu\\gamma^\\nu\\gamma_\\mu = \\gamma^\\mu(2\\delta^\\nu_\\mu - \\gamma_\\mu\\gamma^\\nu) = 2\\gamma^\\nu - 4\\gamma^\\nu = -2\\gamma^\\nu$. Check with $\\nu = 0$: $\\gamma^0\\gamma^0\\gamma^0 + \\sum_i\\gamma^i\\gamma^0\\gamma_i = \\gamma^0 + \\sum_i(-\\gamma^i\\gamma^0\\gamma^i) = \\gamma^0 + \\sum_i\\gamma^0(\\gamma^i)^2 = \\gamma^0 - 3\\gamma^0 = -2\\gamma^0$.' },
    { id: 'netrq-034', type: 'nat', level: 4, exams: ['net'], sub: 'zitterbewegung',
      q: 'The zitterbewegung amplitude of an electron is about $\\hbar/2m_ec$. In fm, this is ______ (to the nearest whole number). ($\\hbar c = 197.33$ MeV fm, $m_ec^2 = 0.511$ MeV.)',
      answer: 193, tol: 1, calc: () => HBC / (2 * MEC2),
      sol: '$\\hbar/2m_ec = 197.33/(2\\times0.511) = 193$ fm, half the reduced Compton wavelength. Averaging the Coulomb potential over this smearing produces the Darwin term, $\\propto\\langle\\delta r^2\\rangle\\nabla^2V$, which is why it affects $s$ states only.' },
    { id: 'netrq-035', type: 'msq', level: 4, exams: ['net'], sub: 'gamma5 and chirality',
      q: 'With $\\gamma^5 = i\\gamma^0\\gamma^1\\gamma^2\\gamma^3$, which statements are correct?',
      options: ['$(\\gamma^5)^2 = 1$', '$\\{\\gamma^5, \\gamma^\\mu\\} = 0$ for every $\\mu$', '$\\text{Tr}\\,\\gamma^5 = 0$', 'The chiral projectors $\\tfrac12(1\\pm\\gamma^5)$ commute with the Dirac Hamiltonian when $m\\ne0$'], answer: [0, 1, 2],
      sol: 'Moving $\\gamma$\'s through each other gives $(\\gamma^5)^2 = 1$; $\\gamma^5$ contains each $\\gamma^\\mu$ once; moving $\\gamma^\\mu$ through the product passes three factors that anticommute with it and one that commutes, an odd number of sign changes, so they anticommute. $\\text{Tr}\\gamma^5 = \\text{Tr}(\\gamma^5\\gamma^0\\gamma^0) = -\\text{Tr}(\\gamma^0\\gamma^5\\gamma^0) = -\\text{Tr}\\gamma^5 = 0$. The mass term $\\beta mc^2$ anticommutes with $\\gamma^5$, so chirality is conserved only for massless particles.' },
    { id: 'netrq-036', type: 'nat', level: 4, exams: ['net'], sub: 'anomalous moment',
      q: 'The leading QED correction to the Dirac value $g = 2$ is $a_e = (g - 2)/2 = \\alpha/2\\pi$. Its value is ______ $\\times10^{-3}$ (to three decimal places).',
      answer: 1.161, tol: 0.001, calc: () => ALPHA / (2 * Math.PI) * 1e3,
      sol: '$a_e = \\dfrac{1}{2\\pi\\times137.036} = 1.161\\times10^{-3}$ (Schwinger, 1948). The measured value is $1.15965\\times10^{-3}$, matched by higher orders. The Dirac equation alone gives exactly $a_e = 0$.' },
    // ---------- level 5 ----------
    { id: 'netrq-037', type: 'nat', level: 5, exams: ['net'], sub: 'Dirac hydrogen',
      q: 'Using the exact Dirac formula $E_{nj}$ above, find the binding energy $m_ec^2 - E$ of the $2p_{3/2}$ level of a hydrogen-like ion with $Z = 50$, in keV (to two decimal places). ($m_ec^2 = 510.999$ keV, $\\alpha = 1/137.036$.)',
      answer: 8.58, tol: 0.02, calc: () => 510.99895 * (1 - diracE(2, 1.5, 50)),
      sol: 'For $j = \\tfrac32$, $j + \\tfrac12 = 2$ and $n - 2 = 0$, so the denominator is $\\sqrt{4 - (Z\\alpha)^2}$ and $E = mc^2\\left[1 + \\dfrac{(Z\\alpha)^2}{4 - (Z\\alpha)^2}\\right]^{-1/2} = mc^2\\sqrt{1 - (Z\\alpha)^2/4}$. $Z\\alpha = 0.36487$, $(Z\\alpha)^2/4 = 0.033282$, $\\sqrt{0.966718} = 0.983218$. Binding $= 510.999\\times0.016782 = 8.58$ keV (Bohr: $Z^2R/4 = 8.50$ keV).',
      trap: 'For the $n = j + \\tfrac12$ (circular) states the Dirac formula collapses to $\\sqrt{1 - (Z\\alpha/n)^2}$; use it as a check.' },
    { id: 'netrq-038', type: 'mcq', level: 5, exams: ['net'], sub: 'minimal coupling',
      q: 'Squaring the Dirac operator with minimal coupling, $(\\vec\\sigma\\cdot\\vec\\pi)^2$ with $\\vec\\pi = \\vec p + e\\vec A$ for an electron, equals',
      options: ['$\\pi^2$', '$\\pi^2 + e\\hbar\\,\\vec\\sigma\\cdot\\vec B$', '$\\pi^2 - e\\hbar\\,\\vec\\sigma\\cdot\\vec B$', '$\\pi^2 + 2e\\hbar\\,\\vec\\sigma\\cdot\\vec B$'], answer: 1,
      sol: '$(\\vec\\sigma\\cdot\\vec\\pi)^2 = \\pi^2 + i\\vec\\sigma\\cdot(\\vec\\pi\\times\\vec\\pi)$. With $\\vec\\pi = \\vec p + e\\vec A$: $\\vec\\pi\\times\\vec\\pi = e(\\vec p\\times\\vec A + \\vec A\\times\\vec p) = -i\\hbar e\\nabla\\times\\vec A = -i\\hbar e\\vec B$. So $(\\vec\\sigma\\cdot\\vec\\pi)^2 = \\pi^2 + e\\hbar\\vec\\sigma\\cdot\\vec B$, and $H = \\pi^2/2m + \\dfrac{e\\hbar}{2m}\\vec\\sigma\\cdot\\vec B$: an electron moment $-2\\mu_B\\vec S/\\hbar$, $g = 2$.' },
    { id: 'netrq-039', type: 'nat', level: 5, exams: ['net'], sub: 'Klein-Gordon atoms',
      q: 'For a spinless particle in a Coulomb field, the KG formula gives $E_{nl} = mc^2\\left[1 + \\left(\\dfrac{Z\\alpha}{n - l - \\tfrac12 + \\sqrt{(l + \\tfrac12)^2 - Z^2\\alpha^2}}\\right)^2\\right]^{-1/2}$. For which largest integer $Z$ does the $1s$ ($l = 0$) level remain real (point nucleus)?',
      answer: 68, tol: 0, calc: () => Math.floor(0.5 / ALPHA),
      sol: 'Reality needs $(l + \\tfrac12)^2\\ge Z^2\\alpha^2$; for $l = 0$, $Z\\alpha\\le\\tfrac12$, so $Z\\le137.036/2 = 68.5$: the largest integer is 68. (Dirac\'s $1s_{1/2}$ survives to 137 because $j + \\tfrac12 = 1$.)' },
    { id: 'netrq-040', type: 'msq', level: 5, exams: ['net'], sub: 'interpretation',
      q: 'Which statements about relativistic one-particle wave equations are correct?',
      options: ['Both KG and Dirac become consistent only as quantum field theories, where negative-energy solutions describe antiparticles', 'The Dirac equation describes spin-$\\tfrac12$ particles; the KG equation spin-0 particles', 'In Dirac theory the Hamiltonian is bounded below, so atoms are stable without hole theory', 'The KG current $j^\\mu$ becomes the electric current of a charged scalar field, with particles and antiparticles contributing opposite signs'], answer: [0, 1, 3],
      sol: 'The Dirac spectrum extends to $-\\infty$; without the filled sea (or field quantisation) an electron could radiate down forever, so C is false. In field theory both equations are fine: the KG field describes charged pions ($j^\\mu$ is a charge current with $\\pi^+$ and $\\pi^-$ contributing oppositely), the Dirac field electrons and positrons.' },
    { id: 'netrq-041', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Dirac equation',
      q: 'Which feature of the Schrödinger equation did Dirac insist on keeping, which the Klein-Gordon equation lacks?',
      options: ['First order in time derivatives (so a positive conserved density exists)', 'Second order in space derivatives', 'A one-component wavefunction', 'Galilean invariance'], answer: 0,
      sol: 'A first-order time evolution $i\\hbar\\partial_t\\psi = H\\psi$ fixes $\\psi$ from its initial value and gives a positive density $\\psi^\\dagger\\psi$. Lorentz symmetry then forces first order in space too: $H = c\\vec\\alpha\\cdot\\vec p + \\beta mc^2$, linear in $\\vec p$, with matrix coefficients and a multi-component $\\psi$.' },
    { id: 'netrq-042', type: 'nat', level: 3, exams: ['net'], sub: 'Yukawa range',
      q: 'The weak interaction is carried by the $W$ boson, $m_Wc^2 = 80.4$ GeV. The range $\\hbar/m_Wc$ is ______ $\\times10^{-3}$ fm (to two decimal places).',
      answer: 2.45, tol: 0.01, calc: () => HBC / 80400 * 1e3,
      sol: '$\\hbar c/m_Wc^2 = 197.3\\text{ MeV fm}/80{,}400\\text{ MeV} = 2.45\\times10^{-3}$ fm. The heavy carrier explains why the weak force is so short-ranged (and so weak at low energy).' },
  ],
  gens: [
    { id: 'netrq-g01', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'Yukawa range',
      make(r) {
        const P = choose(r, [['pion', 139.57], ['kaon', 493.68], ['rho meson', 775.3], ['omega meson', 782.7], ['$W$ boson', 80379], ['$Z$ boson', 91188]]), ask = choose(r, ['R', 'R', 'm']);
        const R = HBC / P[1];
        if (ask === 'm') {
          const Rg = +R.toPrecision(3);
          return { q: `A force has Yukawa range $R = ${P[1] > 1e4 ? `${(Rg * 1e3).toPrecision(3)}\\times10^{-3}` : Rg}$ fm. What mass (in MeV/$c^2$, three significant figures) must the exchanged spin-0 or spin-1 quantum have? ($\\hbar c = 197.33$ MeV fm.)`,
            answer: +(HBC / Rg).toPrecision(3), tol: HBC / Rg * 0.01, ask, Rg,
            sol: `$mc^2 = \\hbar c/R = 197.33/${Rg} = ${(HBC / Rg).toPrecision(4)}$ MeV.`, trap: 'Heavier carriers give shorter ranges: $R\\propto1/m$.' };
        }
        const big = P[1] > 1e4, val = big ? R * 1e3 : R;
        return { q: `The static Klein-Gordon equation gives a Yukawa potential with range $\\hbar/mc$. For exchange of a ${P[0]} ($mc^2 = ${P[1]}$ MeV), the range is ______ ${big ? '$\\times10^{-3}$ fm' : 'fm'} (three significant figures). ($\\hbar c = 197.33$ MeV fm.)`,
          answer: +val.toPrecision(3), tol: val * 0.01, ask, m: P[1], big,
          sol: `$R = \\hbar c/mc^2 = 197.33/${P[1]} = ${R.toPrecision(4)}$ fm.`, trap: 'Use $\\hbar c$, not $hc$ (which would be $2\\pi$ times larger).' };
      },
      verify: (p) => p.ask === 'm' ? HBC / p.Rg : (p.big ? 1e3 : 1) * HBC / p.m },
    { id: 'netrq-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'wave packets',
      make(r) {
        const P = choose(r, [['electron', MEC2], ['muon', 105.658], ['proton', 938.272], ['pion', 139.57]]), pc = choose(r, [0.1, 0.5, 1, 2, 5, 10]) * P[1], ask = choose(r, ['vg', 'vp']);
        const E = Math.hypot(pc, P[1]), val = ask === 'vg' ? pc / E : E / pc;
        return { q: `A free ${P[0]} wave packet ($mc^2 = ${P[1]}$ MeV) has central momentum $${round(pc, 4)}$ MeV/$c$. Find its ${ask === 'vg' ? 'group' : 'phase'} velocity in units of $c$ (four decimal places).`,
          answer: round(val, 4), tol: Math.max(0.0005, val * 0.0005), pc, m: P[1], ask,
          sol: `$E = \\sqrt{(pc)^2 + (mc^2)^2} = ${E.toPrecision(5)}$ MeV. $v_g = pc^2/E$ and $v_p = E/p$, so $v_gv_p = c^2$. Answer: $${round(val, 5)}c$.`,
          trap: 'The phase velocity exceeds $c$; only the group velocity is the particle velocity.' };
      },
      verify: (p) => { const E = Math.hypot(p.pc, p.m); return p.ask === 'vg' ? p.pc / E : E / p.pc; } },
    { id: 'netrq-g03', type: 'nat', level: 3, exams: ['net'], sub: 'Dirac hydrogen',
      make(r) {
        const Z = choose(r, [1, 2, 10, 20, 30, 40, 50, 60, 70, 82, 92]), ask = choose(r, ['bind', 'excess']);
        const b = 510.99895 * (1 - Math.sqrt(1 - (Z * ALPHA) ** 2)), bohr = Z * Z * RY / 1e3;
        const val = ask === 'bind' ? (Z < 5 ? b * 1e3 : b) : (b / bohr - 1) * 100;
        return { q: ask === 'bind' ? `For a point nucleus of charge $Z = ${Z}$, the Dirac $1s_{1/2}$ energy is $m_ec^2\\sqrt{1 - (Z\\alpha)^2}$. The binding energy is ______ ${Z < 5 ? 'eV' : 'keV'} (${Z < 5 ? 'four' : 'three'} significant figures).` : `For a hydrogen-like ion with $Z = ${Z}$, by what percentage does the Dirac $1s$ binding energy $m_ec^2(1 - \\sqrt{1 - Z^2\\alpha^2})$ exceed the Bohr value $Z^2\\times13.606$ eV? (two decimal places)`,
          answer: ask === 'bind' ? +val.toPrecision(Z < 5 ? 4 : 3) : round(val, 2), tol: ask === 'bind' ? val * 0.005 : Math.max(0.01, val * 0.01), Z, ask,
          sol: `$Z\\alpha = ${round(Z * ALPHA, 5)}$, $\\sqrt{1 - (Z\\alpha)^2} = ${(Math.sqrt(1 - (Z * ALPHA) ** 2)).toFixed(7)}$. Binding $= 510.999\\text{ keV}\\times${(1 - Math.sqrt(1 - (Z * ALPHA) ** 2)).toExponential(4)} = ${b.toPrecision(5)}$ keV; Bohr gives ${bohr.toPrecision(5)} keV.${ask === 'excess' ? ` Excess $= ${round(val, 3)}$%, about $(Z\\alpha)^2/4$ for small $Z$.` : ''}`,
          trap: 'For light ions the relativistic excess is tiny, about $(Z\\alpha)^2/4$.' };
      },
      verify: (p) => { const b = 510.99895 * (1 - Math.sqrt(1 - (p.Z * ALPHA) ** 2)); return p.ask === 'bind' ? (p.Z < 5 ? b * 1e3 : b) : (b / (p.Z * p.Z * RY / 1e3) - 1) * 100; } },
    { id: 'netrq-g04', type: 'nat', level: 4, exams: ['net'], sub: 'Dirac hydrogen',
      make(r) {
        const L = choose(r, [[2, 0.5, '2s_{1/2}'], [2, 1.5, '2p_{3/2}'], [3, 0.5, '3s_{1/2}'], [3, 1.5, '3d_{3/2}'], [3, 2.5, '3d_{5/2}']]), Z = choose(r, [20, 40, 60, 80]);
        const val = 510.99895 * (1 - diracE(L[0], L[1], Z));
        return { q: `Using the exact Dirac energy $E_{nj} = m_ec^2\\left[1 + \\left(\\dfrac{Z\\alpha}{n - (j + \\tfrac12) + \\sqrt{(j + \\tfrac12)^2 - Z^2\\alpha^2}}\\right)^2\\right]^{-1/2}$, find the binding energy of the $${L[2]}$ level for $Z = ${Z}$, in keV (three significant figures).`,
          answer: +val.toPrecision(3), tol: val * 0.003, n: L[0], j: L[1], Z,
          sol: `$n = ${L[0]}$, $j + \\tfrac12 = ${L[1] + 0.5}$, $Z\\alpha = ${round(Z * ALPHA, 5)}$. Denominator $= ${L[0] - L[1] - 0.5} + \\sqrt{${(L[1] + 0.5) ** 2} - ${round((Z * ALPHA) ** 2, 5)}} = ${round(L[0] - L[1] - 0.5 + Math.sqrt((L[1] + 0.5) ** 2 - (Z * ALPHA) ** 2), 5)}$. $E/mc^2 = ${diracE(L[0], L[1], Z).toFixed(6)}$, binding $= ${val.toPrecision(4)}$ keV (Bohr: ${(Z * Z * RY / L[0] ** 2 / 1e3).toPrecision(4)} keV).`,
          trap: 'Levels with the same $n$ and $j$ (e.g. $2s_{1/2}$, $2p_{1/2}$) have the same Dirac energy.' };
      },
      verify: (p) => 510.99895 * (1 - diracE(p.n, p.j, p.Z)) },
    { id: 'netrq-g05', type: 'nat', level: 3, exams: ['net'], sub: 'fine structure',
      make(r) {
        const n = choose(r, [2, 3, 4]), Z = choose(r, [1, 2, 3, 6]), j1 = 0.5, j2 = choose(r, [1.5, 2.5].filter((j) => j < n));
        const dE = Z ** 4 * ALPHA ** 2 * RY / n ** 3 * (1 / (j1 + 0.5) - 1 / (j2 + 0.5)), val = dE * 1e6;
        return { q: `To leading order, $E_{nj} = -\\dfrac{Z^2R}{n^2}\\left[1 + \\dfrac{(Z\\alpha)^2}{n^2}\\left(\\dfrac{n}{j + \\tfrac12} - \\dfrac34\\right)\\right]$ with $R = 13.606$ eV. For $Z = ${Z}$, $n = ${n}$, find $E(j = ${j2}) - E(j = \\tfrac12)$ in $\\mu$eV (three significant figures).`,
          answer: +val.toPrecision(3), tol: val * 0.01, n, Z, j2,
          sol: `$\\Delta E = \\dfrac{Z^4\\alpha^2R}{n^3}\\left(\\dfrac{1}{j_1 + \\tfrac12} - \\dfrac{1}{j_2 + \\tfrac12}\\right) = \\dfrac{${Z ** 4}\\times5.325\\times10^{-5}\\times13.606}{${n ** 3}}\\times(1 - ${round(1 / (j2 + 0.5), 4)}) = ${val.toPrecision(4)}\\ \\mu$eV. Higher $j$ lies higher.`,
          trap: 'The splitting grows as $Z^4$ and falls as $n^{-3}$.' };
      },
      verify: (p) => p.Z ** 4 * ALPHA ** 2 * RY / p.n ** 3 * (1 - 1 / (p.j2 + 0.5)) * 1e6 },
    { id: 'netrq-g06', type: 'nat', level: 3, exams: ['net'], sub: 'zitterbewegung',
      make(r) {
        const P = choose(r, [['electron', MEC2], ['muon', 105.658], ['proton', 938.272]]), ask = choose(r, ['w', 'amp']);
        const val = ask === 'w' ? 2 * P[1] / HBAR_MEVS : HBC / (2 * P[1]), e10 = Math.floor(Math.log10(val)), man = val / 10 ** e10;
        return { q: ask === 'w' ? `The zitterbewegung angular frequency of a free ${P[0]} ($mc^2 = ${P[1]}$ MeV) is $2mc^2/\\hbar$. It is ______ $\\times10^{${e10}}$ s$^{-1}$ (two decimal places). ($\\hbar = 6.582\\times10^{-22}$ MeV s.)` : `The zitterbewegung amplitude of a free ${P[0]} ($mc^2 = ${P[1]}$ MeV) is about $\\hbar/2mc$. It is ______ $\\times10^{${e10}}$ fm (two decimal places). ($\\hbar c = 197.33$ MeV fm.)`,
          answer: round(man, 2), tol: Math.max(0.01, man * 0.006), m: P[1], ask, e10,
          sol: ask === 'w' ? `$2mc^2/\\hbar = ${2 * P[1]}/6.582\\times10^{-22} = ${val.toExponential(3)}$ s$^{-1}$.` : `$\\hbar c/2mc^2 = 197.33/${2 * P[1]} = ${val.toPrecision(4)}$ fm.`,
          trap: 'The scale is set by the Compton wavelength: heavier particles jitter faster over smaller distances.' };
      },
      verify: (p) => (p.ask === 'w' ? 2 * p.m / HBAR_MEVS : HBC / (2 * p.m)) / 10 ** p.e10 },
    { id: 'netrq-g07', type: 'mcq', level: 3, exams: ['net'], sub: 'traces',
      make(r) {
        const P = choose(r, [
          ['$\\text{Tr}(\\gamma^\\mu\\gamma^\\nu)$', '$4g^{\\mu\\nu}$', ['$g^{\\mu\\nu}$', '$0$', '$2g^{\\mu\\nu}$']],
          ['$\\text{Tr}(\\gamma^\\mu\\gamma^\\nu\\gamma^\\rho)$', '$0$', ['$4g^{\\mu\\nu}\\gamma^\\rho$', '$4\\epsilon^{\\mu\\nu\\rho}$', '$4g^{\\mu\\rho}$']],
          ['$\\gamma^\\mu\\gamma_\\mu$', '$4$', ['$1$', '$0$', '$-2$']],
          ['$\\gamma^\\mu\\gamma^\\nu\\gamma_\\mu$', '$-2\\gamma^\\nu$', ['$4\\gamma^\\nu$', '$2\\gamma^\\nu$', '$0$']],
          ['$\\text{Tr}\\,\\gamma^5$', '$0$', ['$4$', '$1$', '$-4$']],
          ['$\\gamma^\\mu\\gamma^\\nu\\gamma^\\rho\\gamma_\\mu$', '$4g^{\\nu\\rho}$', ['$-2\\gamma^\\rho\\gamma^\\nu$', '$-4g^{\\nu\\rho}$', '$2g^{\\nu\\rho}$']],
          ['$\\text{Tr}(\\gamma^5\\gamma^\\mu\\gamma^\\nu)$', '$0$', ['$4g^{\\mu\\nu}$', '$4i\\epsilon^{\\mu\\nu}$', '$-4g^{\\mu\\nu}$']],
        ]);
        const o = mcqOptions(r, P[1], P[2], (v) => v);
        return { q: `In four dimensions with $\\{\\gamma^\\mu, \\gamma^\\nu\\} = 2g^{\\mu\\nu}$ (sum over repeated indices), ${P[0]} equals`, ...o,
          sol: `${P[0]} $=$ ${P[1]}. Rules: the trace of an odd number of $\\gamma$\'s vanishes; $\\text{Tr}(\\gamma^\\mu\\gamma^\\nu) = 4g^{\\mu\\nu}$; $\\gamma^\\mu\\gamma_\\mu = 4$; $\\gamma^\\mu\\gamma^\\nu\\gamma_\\mu = -2\\gamma^\\nu$; $\\gamma^\\mu\\gamma^\\nu\\gamma^\\rho\\gamma_\\mu = 4g^{\\nu\\rho}$; $\\gamma^5$ with fewer than four other $\\gamma$\'s is traceless.`,
          trap: 'Anticommute one $\\gamma$ through the others and use $\\{\\gamma^\\mu, \\gamma^\\nu\\} = 2g^{\\mu\\nu}$ at each step.' };
      } },
    { id: 'netrq-g08', type: 'nat', level: 3, exams: ['net'], sub: 'non-relativistic limit',
      make(r) {
        const Z = choose(r, [1, 2, 10, 26, 50, 79]), val = Z * ALPHA / 2;
        return { q: `In a hydrogen-like ion with $Z = ${Z}$, the 1s electron has $v\\approx Z\\alpha c$. Estimate the ratio of the small to large components of its Dirac spinor, $v/2c$ (four decimal places).`,
          answer: round(val, 4), tol: Math.max(0.0002, val * 0.002), Z,
          sol: `$\\chi\\approx\\dfrac{\\vec\\sigma\\cdot\\vec p}{2mc}\\phi$, so the ratio is $v/2c = Z\\alpha/2 = ${Z}/(2\\times137.036) = ${round(val, 5)}$.${Z > 40 ? ' At this $Z$ the small component is no longer small: heavy atoms need fully relativistic treatment.' : ''}`,
          trap: 'Relativistic energy corrections scale as the square of this ratio.' };
      },
      verify: (p) => p.Z * ALPHA / 2 },
    { id: 'netrq-g09', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'pair creation',
      make(r) {
        const T = choose(r, [['a free electron', MEC2], ['a free proton', 938.272], ['a carbon-12 nucleus', 11174.9], ['a lead-208 nucleus', 193729]]);
        const val = 2 * MEC2 * (1 + MEC2 / T[1]);
        return { q: `A photon creates an electron-positron pair on ${T[0]} at rest (rest energy ${T[1]} MeV). The threshold photon energy, $E_{th} = 2m_ec^2(1 + m_e/M)$, is ______ MeV (four significant figures).`,
          answer: +val.toPrecision(4), tol: val * 0.0005, M: T[1],
          sol: `At threshold all final particles move together; invariant mass gives $E_{th} = \\dfrac{(M + 2m_e)^2 - M^2}{2M}c^2 = 2m_ec^2(1 + m_e/M) = ${val.toPrecision(5)}$ MeV.`,
          trap: 'On a free electron the threshold is $4m_ec^2$, twice the naive gap.' };
      },
      verify: (p) => 2 * MEC2 * (1 + MEC2 / p.M) },
    { id: 'netrq-g10', type: 'mcq', level: 3, exams: ['net'], sub: 'conserved quantities',
      make(r) {
        const P = choose(r, [
          ['a free Dirac particle', '$\\vec J = \\vec L + \\tfrac\\hbar2\\vec\\Sigma$', ['$\\vec L$', '$\\vec\\Sigma$', '$\\beta$']],
          ['a free Dirac particle', 'the helicity $\\vec\\Sigma\\cdot\\vec p$', ['$\\Sigma_z$', '$L_z$', '$\\beta$']],
          ['a Dirac electron in a central potential $V(r)$', '$K = \\beta(\\vec\\Sigma\\cdot\\vec L + \\hbar)$', ['$\\vec L^2$', '$\\vec\\Sigma\\cdot\\vec p$', '$\\vec p$']],
          ['a Dirac electron in a central potential $V(r)$', '$\\vec J^2$ and $J_z$', ['$\\vec L^2$ and $L_z$', '$\\vec S^2$ and $S_z$ separately with $\\vec L$', '$\\vec p^2$']],
          ['a massless Dirac particle', 'the chirality $\\gamma^5$', ['$\\beta$', '$\\vec L$', '$\\vec r$']],
        ]);
        const o = mcqOptions(r, P[1], P[2], (v) => v);
        return { q: `Which operator commutes with the Hamiltonian of ${P[0]}?`, ...o,
          sol: `${P[1]}. For the free particle $\\vec L$ and $\\vec\\Sigma$ separately fail ($[\\vec L, H] = -[\\tfrac\\hbar2\\vec\\Sigma, H] = i\\hbar c\\vec\\alpha\\times\\vec p$); helicity commutes; in a central field $\\vec p$ and $\\vec L^2$ fail but $\\vec J$ and Dirac\'s $K$ (eigenvalues $\\mp(j + \\tfrac12)$) survive; $\\gamma^5$ commutes with $\\vec\\alpha\\cdot\\vec p$ but anticommutes with $\\beta$, so only for $m = 0$.`,
          trap: 'In relativistic quantum mechanics, orbital angular momentum alone is never conserved for a spin-1/2 particle.' };
      } },
    { id: 'netrq-g11', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Compton wavelength',
      make(r) {
        const P = choose(r, [['electron', MEC2], ['muon', 105.658], ['pion', 139.57], ['proton', 938.272], ['tau lepton', 1776.9]]), red = r() < 0.5;
        const val = (red ? 1 : 2 * Math.PI) * HBC / P[1];
        return { q: `Find the ${red ? 'reduced Compton wavelength $\\hbar/mc$' : 'Compton wavelength $h/mc$'} of the ${P[0]} ($mc^2 = ${P[1]}$ MeV), in fm (three significant figures). ($\\hbar c = 197.33$ MeV fm.)`,
          answer: +val.toPrecision(3), tol: val * 0.01, m: P[1], red,
          sol: `$\\hbar/mc = \\hbar c/mc^2 = 197.33/${P[1]} = ${(HBC / P[1]).toPrecision(4)}$ fm${red ? '' : `; times $2\\pi$: $h/mc = ${val.toPrecision(4)}$ fm`}.`,
          trap: '$h/mc$ is $2\\pi$ times $\\hbar/mc$.' };
      },
      verify: (p) => (p.red ? 1 : 2 * Math.PI) * HBC / p.m },
    { id: 'netrq-g12', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'concepts',
      make(r) {
        const P = choose(r, [
          ['The Klein-Gordon equation describes particles of spin', '0', ['1/2', '1', '3/2'], 'It is a single-component scalar equation; spin requires components.'],
          ['Why does the Dirac wavefunction have four components rather than two?', 'it must describe two spin states for each sign of the energy', ['it describes four spin states', 'space has four dimensions in Minkowski geometry only for bosons', 'two components are always zero'], 'Spin up and down, for positive and negative energy (particle and antiparticle).'],
          ['The minimum energy a photon needs to create an electron-positron pair near a heavy nucleus is', '$2m_ec^2 = 1.022$ MeV', ['$m_ec^2 = 0.511$ MeV', '$4m_ec^2 = 2.044$ MeV', '13.6 eV'], 'It must bridge the gap between the negative- and positive-energy continua.'],
          ['In the non-relativistic limit of the Dirac equation, the spin-orbit term comes out with', 'the Thomas half already included', ['twice the naive value', 'no spin-orbit term at all', 'a sign opposite to experiment'], 'The Foldy-Wouthuysen expansion gives $\\tfrac{1}{2m^2c^2}\\tfrac1r\\tfrac{dV}{dr}\\vec L\\cdot\\vec S$, half the rest-frame estimate.'],
          ['The Darwin term in hydrogen affects', 'only $s$ states', ['only $p$ states', 'all states equally', 'only states with $j = 3/2$'], 'It is proportional to $\\nabla^2V\\propto\\delta^3(\\vec r)$, nonzero only where the wavefunction is nonzero at the origin.'],
        ]);
        const o = mcqOptions(r, P[1], P[2], (v) => v);
        return { q: P[0], ...o, sol: `The answer is ${P[1]}. ${P[3]}` };
      } },
    ...more,
  ],
};
