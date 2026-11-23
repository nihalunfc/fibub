// Quantum scattering, NET depth: scattering amplitude and cross-section, the Born approximation (Yukawa, Coulomb,
// square well, Gaussian and exponential potentials), momentum transfer and form factors, partial waves and phase
// shifts, the optical theorem and unitarity, hard spheres, scattering length and low-energy cross-sections,
// resonances (Breit-Wigner), Ramsauer-Townsend, Levinson's theorem and identical particles.
// (Classical Rutherford scattering and cross-section geometry are in central-force-scattering.)
// Original questions (fibub) for CSIR NET Part C and GATE. Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import more from './scattering-theory.more.gen.js';
import more2 from './scattering-theory.more2.gen.js';
import r4 from './scattering-theory.r4.gen.js';

const PI = Math.PI, HBC = 197.3269804, MN = 939.565, MPc = 938.272, MEc = 0.51099895, D = PI / 180;

import { tidyPhys } from './_signs.js';

const topicBank = {
  topic: 'scattering-theory',
  items: [
    // ---------- level 1 ----------
    { id: 'netsc-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'scattering amplitude',
      q: 'Far from a short-range potential, the scattering wavefunction has the form $\\psi\\to e^{ikz} + f(\\theta)\\dfrac{e^{ikr}}{r}$. The differential cross-section is',
      options: ['$f(\\theta)$', '$|f(\\theta)|^2/r^2$', '$|f(\\theta)|^2$', '$\\text{Im}\\,f(\\theta)$'], answer: 2,
      sol: 'The incident probability current is $\\hbar k/m$ per unit area; the scattered current through $r^2d\\Omega$ is $(\\hbar k/m)|f|^2d\\Omega$. Their ratio is $d\\sigma/d\\Omega = |f(\\theta)|^2$, an area per solid angle with no $r$ dependence.' },
    { id: 'netsc-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Born approximation',
      q: 'In the first Born approximation, the scattering amplitude for a potential $V(\\vec r)$ is proportional to',
      options: ['the Fourier transform of $V$ at the momentum transfer $\\vec q = \\vec k\' - \\vec k$', 'the integral of $|V|^2$ over all space', 'the value of $V$ at the classical turning point', 'the Laplace transform of $V$ in energy'], answer: 0,
      sol: '$f_B(\\vec k\', \\vec k) = -\\dfrac{m}{2\\pi\\hbar^2}\\displaystyle\\int e^{-i\\vec q\\cdot\\vec r}V(\\vec r)\\,d^3r$, with $\\hbar\\vec q$ the momentum transferred. For a central potential this becomes $-\\dfrac{2m}{\\hbar^2q}\\displaystyle\\int_0^\\infty rV(r)\\sin(qr)\\,dr$.' },
    { id: 'netsc-003', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'momentum transfer',
      q: 'A particle with wavenumber $k = 2.0$ fm$^{-1}$ scatters elastically through $60^\\circ$. The magnitude of the momentum transfer $q$ is ______ fm$^{-1}$.',
      answer: 2, tol: 0.01, calc: () => 2 * 2 * Math.sin(30 * D),
      sol: 'Elastic scattering: $|\\vec k\'| = |\\vec k| = k$, so $q = 2k\\sin(\\theta/2) = 2\\times2.0\\times\\sin30^\\circ = 2.0$ fm$^{-1}$.',
      trap: 'Use half the scattering angle.' },
    { id: 'netsc-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'partial waves',
      q: 'At very low energy, scattering from a short-range potential is dominated by the $l = 0$ partial wave. The angular distribution is then',
      options: ['peaked forward', 'peaked backward', '$\\propto\\cos^2\\theta$', 'isotropic'], answer: 3,
      sol: 'Phase shifts behave as $\\delta_l\\propto k^{2l+1}$ at low $k$, because the centrifugal barrier keeps slow particles with $l\\ge1$ away from the potential. Only $\\delta_0$ survives, and $P_0 = 1$: the distribution is isotropic.' },
    { id: 'netsc-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'optical theorem',
      q: 'The optical theorem relates the total cross-section to',
      options: ['the real part of the backward amplitude', 'the imaginary part of the forward amplitude: $\\sigma = \\dfrac{4\\pi}{k}\\,\\text{Im}\\,f(0)$', 'the modulus of $f$ at $90^\\circ$', 'the derivative of $f$ with respect to energy'], answer: 1,
      sol: 'Flux removed from the beam must come from interference between the incident and forward-scattered waves, which gives $\\sigma_{tot} = \\dfrac{4\\pi}{k}\\text{Im}\\,f(0)$. It follows from probability conservation (unitarity), whatever the potential.' },
    { id: 'netsc-006', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'hard sphere',
      q: 'Slow particles ($ka\\ll1$) scatter from an impenetrable sphere of radius $a = 2.0$ fm. The total cross-section is ______ fm$^2$ (to one decimal place).',
      answer: 50.3, tol: 0.1, calc: () => 4 * PI * 4,
      sol: 'For a hard sphere $\\delta_0 = -ka$, so at low energy $\\sigma = \\dfrac{4\\pi}{k^2}\\sin^2(ka)\\to4\\pi a^2 = 4\\pi\\times4.0 = 50.3$ fm$^2$: four times the geometric area $\\pi a^2$.',
      trap: 'Quoting the classical $\\pi a^2 = 12.6$ fm$^2$ ignores wave diffraction.' },

    // ---------- level 2 ----------
    { id: 'netsc-007', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Born approximation',
      q: 'For the Yukawa potential $V(r) = \\beta\\dfrac{e^{-\\mu r}}{r}$, the first Born amplitude is',
      options: ['$-\\dfrac{2m\\beta}{\\hbar^2(\\mu^2 + q^2)}$', '$-\\dfrac{2m\\beta}{\\hbar^2q^2}e^{-\\mu/q}$', '$-\\dfrac{m\\beta}{2\\pi\\hbar^2\\mu^2}$', '$-\\dfrac{2m\\beta\\mu}{\\hbar^2(\\mu^2 + q^2)^2}$'], answer: 0,
      sol: '$f = -\\dfrac{2m\\beta}{\\hbar^2q}\\displaystyle\\int_0^\\infty e^{-\\mu r}\\sin qr\\,dr = -\\dfrac{2m\\beta}{\\hbar^2q}\\cdot\\dfrac{q}{\\mu^2 + q^2} = -\\dfrac{2m\\beta}{\\hbar^2(\\mu^2 + q^2)}$. Setting $\\mu\\to0$, $\\beta = Z_1Z_2e^2/4\\pi\\epsilon_0$ gives exactly the Rutherford cross-section.' },
    { id: 'netsc-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Born approximation',
      q: 'For Yukawa scattering in the Born approximation at $k = \\mu$, the ratio of the differential cross-section at $\\theta = 0$ to that at $\\theta = 180^\\circ$ is ______.',
      answer: 25, tol: 0, calc: () => (1 + 4) ** 2,
      sol: '$d\\sigma/d\\Omega\\propto(\\mu^2 + q^2)^{-2}$. Forward $q = 0$; backward $q = 2k = 2\\mu$, so $\\mu^2 + q^2 = 5\\mu^2$. Ratio $= (5\\mu^2/\\mu^2)^2 = 25$.' },
    { id: 'netsc-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'partial waves',
      q: 'In terms of phase shifts $\\delta_l$, the total elastic cross-section is',
      options: ['$\\dfrac{4\\pi}{k^2}\\displaystyle\\sum_l\\sin^2\\delta_l$', '$\\dfrac{\\pi}{k^2}\\displaystyle\\sum_l(2l + 1)\\sin^2\\delta_l$', '$\\dfrac{4\\pi}{k^2}\\displaystyle\\sum_l(2l + 1)\\sin^2\\delta_l$', '$\\dfrac{4\\pi}{k}\\displaystyle\\sum_l(2l + 1)\\delta_l$'], answer: 2,
      sol: '$f(\\theta) = \\dfrac1k\\sum(2l + 1)e^{i\\delta_l}\\sin\\delta_l\\,P_l(\\cos\\theta)$. Integrating $|f|^2$ with $\\int P_lP_{l\'}d\\Omega = \\dfrac{4\\pi}{2l + 1}\\delta_{ll\'}$ gives $\\sigma = \\dfrac{4\\pi}{k^2}\\sum(2l + 1)\\sin^2\\delta_l$.' },
    { id: 'netsc-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'partial waves',
      q: 'At $k = 0.50$ fm$^{-1}$ the only appreciable phase shifts are $\\delta_0 = 30^\\circ$ and $\\delta_1 = 10^\\circ$. The total cross-section is ______ fm$^2$ (to one decimal place).',
      answer: 17.1, tol: 0.1, calc: () => 4 * PI / 0.25 * (Math.sin(30 * D) ** 2 + 3 * Math.sin(10 * D) ** 2),
      sol: '$\\sigma = \\dfrac{4\\pi}{k^2}[\\sin^2\\delta_0 + 3\\sin^2\\delta_1] = 50.27\\times[0.2500 + 3\\times0.03015] = 50.27\\times0.3405 = 17.1$ fm$^2$.',
      trap: 'Forgetting the $(2l + 1) = 3$ weight of the $p$ wave gives 15.1 fm$^2$.' },
    { id: 'netsc-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'optical theorem',
      q: 'At $k = 1.0$ fm$^{-1}$ the forward elastic amplitude has $\\text{Im}\\,f(0) = 2.0$ fm. The total cross-section is ______ fm$^2$ (to one decimal place).',
      answer: 25.1, tol: 0.1, calc: () => 4 * PI * 2 / 1,
      sol: '$\\sigma_{tot} = \\dfrac{4\\pi}{k}\\text{Im}\\,f(0) = \\dfrac{4\\pi\\times2.0}{1.0} = 25.1$ fm$^2$ = 0.251 b. If there are inelastic channels, this is elastic plus inelastic together.' },
    { id: 'netsc-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'unitarity',
      q: 'The largest possible contribution of the partial wave $l$ to the elastic cross-section is',
      options: ['$\\pi(2l + 1)/k^2$', '$4\\pi(2l + 1)/k^2$, reached when $\\delta_l = \\pi/2$', '$4\\pi/k^2$, independent of $l$', 'unbounded, if the potential is strong enough'], answer: 1,
      sol: '$\\sigma_l = \\dfrac{4\\pi}{k^2}(2l + 1)\\sin^2\\delta_l\\le\\dfrac{4\\pi}{k^2}(2l + 1)$, with equality at $\\delta_l = \\pi/2$ (mod $\\pi$). This unitarity limit is reached at the peak of a resonance.' },
    { id: 'netsc-013', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'phase shifts',
      q: 'Which statements about phase shifts are correct?',
      options: ['An attractive potential gives positive phase shifts (at least at low energy)', 'A repulsive potential gives negative phase shifts', 'For a hard sphere, $\\delta_0 = -ka$', 'A phase shift of exactly $\\pi$ in the $s$ wave makes the $s$-wave cross-section maximal'], answer: [0, 1, 2],
      sol: 'Attraction pulls the wavefunction in, advancing its phase ($\\delta > 0$); repulsion pushes it out ($\\delta < 0$). For a hard sphere $u_0\\propto\\sin(kr - ka)$, so $\\delta_0 = -ka$. $\\delta_0 = \\pi$ gives $\\sin^2\\delta_0 = 0$: the $s$ wave does not scatter at all (Ramsauer-Townsend), the opposite of maximal.' },
    { id: 'netsc-014', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Born approximation',
      q: 'At low energy ($q\\to0$), the Born amplitude of any short-range potential tends to',
      options: ['zero', '$-\\dfrac{2m}{\\hbar^2}V(0)$', '$-\\dfrac{m}{2\\pi\\hbar^2}\\displaystyle\\int V(\\vec r)\\,d^3r$, the same in every direction', '$-\\dfrac{m}{2\\pi\\hbar^2}\\displaystyle\\int V(\\vec r)\\cos\\theta\\,d^3r$'], answer: 2,
      sol: 'With $q = 0$ the exponential in $f_B = -\\dfrac{m}{2\\pi\\hbar^2}\\int e^{-i\\vec q\\cdot\\vec r}V\\,d^3r$ is 1. The amplitude is constant (isotropic $s$-wave scattering), with scattering length $a = \\dfrac{m}{2\\pi\\hbar^2}\\int V\\,d^3r$ in Born approximation.' },
    { id: 'netsc-015', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'partial waves',
      q: 'Protons with $k = 1.2$ fm$^{-1}$ scatter from a nucleus of radius 5.0 fm. Semiclassically, partial waves up to about $l_{max}\\approx ka$ contribute. The value of $l_{max}$ is ______.',
      answer: 6, tol: 0, calc: () => 1.2 * 5,
      sol: 'A particle with angular momentum $\\hbar l$ has impact parameter $b = l/k$. It feels the potential only if $b\\lesssim a$, so $l\\lesssim ka = 1.2\\times5.0 = 6$. Partial-wave sums are useful when $ka$ is small; for $ka\\gg1$ the Born or eikonal methods are better.' },
    { id: 'netsc-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Green\'s function',
      q: 'The outgoing-wave Green\'s function used in the Lippmann-Schwinger equation $(\\nabla^2 + k^2)G = \\delta^3(\\vec r - \\vec r\\,\')$ is',
      options: ['$-\\dfrac{e^{-ik|\\vec r - \\vec r\\,\'|}}{4\\pi|\\vec r - \\vec r\\,\'|}$', '$-\\dfrac{\\cos(k|\\vec r - \\vec r\\,\'|)}{4\\pi|\\vec r - \\vec r\\,\'|}$', '$\\dfrac{1}{4\\pi|\\vec r - \\vec r\\,\'|}$', '$-\\dfrac{e^{ik|\\vec r - \\vec r\\,\'|}}{4\\pi|\\vec r - \\vec r\\,\'|}$'], answer: 3,
      sol: 'Near the source $G\\to-1/4\\pi R$ (Coulomb\'s Green\'s function), and the $e^{ikR}$ factor with time dependence $e^{-iEt/\\hbar}$ gives waves moving outward. $e^{-ikR}$ is incoming, and the cosine is the standing-wave (principal value) solution.' },

    // ---------- level 3 ----------
    { id: 'netsc-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Born approximation',
      q: 'A weak attractive square well has depth $V_0$ and radius $a$ with $2mV_0a^2/\\hbar^2 = 0.30$. In the low-energy Born approximation the total cross-section is ______ $a^2$ (to three decimal places).',
      answer: 0.126, tol: 0.002, calc: () => 4 * PI * 0.01,
      sol: '$f(0) = -\\dfrac{m}{2\\pi\\hbar^2}\\cdot\\left(-V_0\\cdot\\tfrac43\\pi a^3\\right) = \\dfrac{2mV_0a^3}{3\\hbar^2} = \\dfrac{0.30}{3}a = 0.10a$. Isotropic, so $\\sigma = 4\\pi|f|^2 = 4\\pi\\times0.010\\,a^2 = 0.126\\,a^2$.',
      trap: 'In Born approximation the sign of $V_0$ does not affect the cross-section.' },
    { id: 'netsc-018', type: 'mcq', level: 3, exams: ['net'], sub: 'Born approximation',
      q: 'The first Born approximation for a square well $V = -V_0$ ($r < a$) gives $f(q) = \\dfrac{2mV_0}{\\hbar^2q^3}(\\sin qa - qa\\cos qa)$. The differential cross-section has its first zero (diffraction minimum) where',
      options: ['$qa = \\pi$', '$\\tan qa = qa$, i.e. $qa\\approx4.49$', '$qa = \\pi/2$', '$\\sin qa = 0$ and $qa = 2\\pi$'], answer: 1,
      sol: 'The zeros need $\\sin qa = qa\\cos qa$, i.e. $\\tan qa = qa$. The first nonzero root is $qa = 4.493$. This is the same function that appears in the form factor of a uniform sphere; such minima in electron scattering from nuclei reveal the nuclear radius.' },
    { id: 'netsc-019', type: 'nat', level: 3, exams: ['net'], sub: 'unitarity',
      q: 'For 1.0 eV neutrons ($m_nc^2 = 939.6$ MeV, $\\hbar c = 197.3$ MeV fm), the maximum possible $s$-wave cross-section $4\\pi/k^2$ is ______ $\\times10^6$ barn (to two decimal places).',
      answer: 2.60, tol: 0.01, calc: () => { const k = Math.sqrt(2 * MN * 1e-6) / HBC; return 4 * PI / k / k / 100 / 1e6; },
      sol: '$k = \\sqrt{2m_nc^2E}/\\hbar c = \\sqrt{2\\times939.6\\times10^{-6}}/197.3 = 2.197\\times10^{-4}$ fm$^{-1}$. $4\\pi/k^2 = 2.60\\times10^8$ fm$^2$ $= 2.60\\times10^6$ b (1 b = 100 fm$^2$). Slow-neutron resonance cross-sections can indeed reach $10^4$ to $10^6$ b, far above geometric sizes.' },
    { id: 'netsc-020', type: 'mcq', level: 3, exams: ['net'], sub: 'hard sphere',
      q: 'For scattering from a hard sphere of radius $a$ at very high energy ($ka\\gg1$), the total cross-section tends to',
      options: ['$\\pi a^2$', '$4\\pi a^2$', '$2\\pi a^2$', 'zero'], answer: 2,
      sol: 'Summing $\\tfrac{4\\pi}{k^2}\\sum_{l\\le ka}(2l + 1)\\sin^2\\delta_l$ with random-looking phases ($\\langle\\sin^2\\rangle = \\tfrac12$) gives $\\tfrac{4\\pi}{k^2}\\cdot\\tfrac12(ka)^2 = 2\\pi a^2$. Half is reflection ($\\pi a^2$), half the forward diffraction peak that forms the shadow ($\\pi a^2$).',
      trap: 'The shadow-forming peak is real scattering, even though it is confined to angles $\\sim1/ka$.' },
    { id: 'netsc-021', type: 'nat', level: 3, exams: ['net'], sub: 'form factors',
      q: 'Electron scattering gives a charge form factor $F(q) = 0.90$ at $q = 0.50$ fm$^{-1}$. Using $F(q)\\approx1 - q^2\\langle r^2\\rangle/6$, the rms charge radius is ______ fm (to two decimal places).',
      answer: 1.55, tol: 0.01, calc: () => Math.sqrt(6 * 0.1 / 0.25),
      sol: 'Expanding $F(q) = \\int\\rho(r)\\dfrac{\\sin qr}{qr}d^3r = 1 - \\dfrac{q^2\\langle r^2\\rangle}{6} + \\dots$: $\\langle r^2\\rangle = \\dfrac{6\\times0.10}{0.25} = 2.4$ fm$^2$, so $r_{rms} = 1.55$ fm.' },
    { id: 'netsc-022', type: 'mcq', level: 3, exams: ['net'], sub: 'identical particles',
      q: 'Two identical spin-0 bosons scatter. Compared with the classical sum $|f(\\theta)|^2 + |f(\\pi - \\theta)|^2$ for distinguishable particles, the cross-section at $\\theta = 90^\\circ$ (CM) is',
      options: ['the same', 'zero', 'half', 'twice as large'], answer: 3,
      sol: 'For bosons $d\\sigma/d\\Omega = |f(\\theta) + f(\\pi - \\theta)|^2$. At $90^\\circ$ both terms are equal: $|2f|^2 = 4|f|^2$, against $2|f|^2$ for distinguishable particles. Twice as large. (For two $\\alpha$ particles in Mott scattering this shows clearly.)' },
    { id: 'netsc-023', type: 'nat', level: 3, exams: ['net'], sub: 'scattering length',
      q: 'The singlet and triplet neutron-proton scattering lengths are $a_s = -23.74$ fm and $a_t = 5.42$ fm. For unpolarised slow neutrons on free protons, $\\sigma = \\tfrac14(4\\pi a_s^2) + \\tfrac34(4\\pi a_t^2)$ is ______ b (to one decimal place).',
      answer: 20.5, tol: 0.1, calc: () => (0.25 * 4 * PI * 23.74 ** 2 + 0.75 * 4 * PI * 5.42 ** 2) / 100,
      sol: 'Spin weights: 1 singlet and 3 triplet states out of 4. $4\\pi a_s^2 = 7082$ fm$^2$ = 70.8 b and $4\\pi a_t^2 = 369$ fm$^2$ = 3.69 b. $\\sigma = 17.7 + 2.77 = 20.5$ b, close to the measured 20.4 b. The huge singlet length reflects a virtual state just above threshold.',
      trap: 'Averaging the scattering lengths before squaring gives a far smaller number.' },
    { id: 'netsc-024', type: 'mcq', level: 3, exams: ['net'], sub: 'Born validity',
      q: 'For a potential of depth $V_0$ and range $a$, the Born approximation is reliable at low energy when',
      options: ['$\\dfrac{m|V_0|a^2}{\\hbar^2}\\ll1$: the potential is far too weak to bind', '$ka\\gg1$ only', '$|V_0|\\gg E$', '$\\dfrac{m|V_0|a^2}{\\hbar^2}\\gg1$'], answer: 0,
      sol: 'Born assumes the wave inside the potential is barely changed from the plane wave. At low energy that needs $m|V_0|a^2/\\hbar^2\\ll1$; such a well is far too weak to bind (a 3D square well first binds when $2mV_0a^2/\\hbar^2 = \\pi^2/4$). At high energy the condition relaxes to $m|V_0|a/\\hbar^2k\\ll1$.' },
    { id: 'netsc-025', type: 'nat', level: 3, exams: ['net'], sub: 'form factors',
      q: 'A nucleus is modelled as a uniformly charged sphere of radius 5.0 fm. Its rms charge radius is ______ fm (to two decimal places).',
      answer: 3.87, tol: 0.01, calc: () => Math.sqrt(0.6) * 5,
      sol: '$\\langle r^2\\rangle = \\dfrac{\\int_0^Rr^2\\cdot r^2dr}{\\int_0^Rr^2dr} = \\dfrac{R^5/5}{R^3/3} = \\dfrac35R^2 = 15$ fm$^2$, so $r_{rms} = 3.87$ fm. Its form factor is $F(q) = 3(\\sin x - x\\cos x)/x^3$ with $x = qR$.' },
    { id: 'netsc-026', type: 'msq', level: 3, exams: ['net'], sub: 'resonances',
      q: 'Near an isolated resonance in partial wave $l$, $\\tan\\delta_l = \\dfrac{\\Gamma/2}{E_R - E}$. Which statements are correct?',
      options: ['$\\delta_l$ rises through $\\pi/2$ at $E = E_R$', '$\\sigma_l$ reaches the unitarity limit $4\\pi(2l + 1)/k^2$ at $E_R$', 'The full width at half maximum of $\\sigma_l(E)$ is $\\Gamma$', 'The quasi-bound state lives for about $\\Gamma/\\hbar$'], answer: [0, 1, 2],
      sol: '$\\sin^2\\delta_l = \\dfrac{(\\Gamma/2)^2}{(E - E_R)^2 + (\\Gamma/2)^2}$: the Breit-Wigner shape, equal to 1 at $E_R$ (where $\\delta_l = \\pi/2$) and $\\tfrac12$ at $E_R\\pm\\Gamma/2$, so FWHM $= \\Gamma$. The lifetime is $\\tau = \\hbar/\\Gamma$, not $\\Gamma/\\hbar$.' },
    { id: 'netsc-027', type: 'nat', level: 3, exams: ['net'], sub: 'Born approximation',
      q: 'For a Gaussian potential $V = V_0e^{-r^2/b^2}$, the Born cross-section is $\\propto e^{-q^2b^2/2}$. With $b = 1.0$ fm, at what momentum transfer $q$ (in fm$^{-1}$) has $d\\sigma/d\\Omega$ fallen to $1/e$ of its forward value? Answer to three decimal places.',
      answer: 1.414, tol: 0.002, calc: () => Math.SQRT2,
      sol: '$f\\propto\\int e^{-r^2/b^2}e^{-i\\vec q\\cdot\\vec r}d^3r = \\pi^{3/2}b^3e^{-q^2b^2/4}$, so $|f|^2\\propto e^{-q^2b^2/2}$. Setting $q^2b^2/2 = 1$: $q = \\sqrt2/b = 1.414$ fm$^{-1}$.' },
    { id: 'netsc-028', type: 'mcq', level: 3, exams: ['net'], sub: 'Coulomb scattering',
      q: 'Which statement about quantum Coulomb scattering of distinguishable charges is correct?',
      options: ['The first Born approximation (as the $\\mu\\to0$ limit of Yukawa) gives exactly the classical Rutherford cross-section', 'Quantum mechanics predicts a finite total cross-section for the bare Coulomb potential', 'The Born result for Coulomb scattering depends on $\\hbar$', 'Coulomb scattering is isotropic at low energy'], answer: 0,
      sol: 'Born: $f = -\\dfrac{2m\\beta}{\\hbar^2q^2}$, $|f|^2 = \\dfrac{4m^2\\beta^2}{\\hbar^4\\cdot16k^4\\sin^4(\\theta/2)} = \\left(\\dfrac{\\beta}{4E}\\right)^2\\dfrac{1}{\\sin^4(\\theta/2)}$ with $E = \\hbar^2k^2/2m$: $\\hbar$ cancels and this equals Rutherford (the exact solution only adds a phase). The forward divergence makes the total cross-section infinite; real atoms are screened.' },

    // ---------- level 4 ----------
    { id: 'netsc-029', type: 'nat', level: 4, exams: ['net'], sub: 'zero-energy resonance',
      q: 'Two nucleons (reduced mass $469.5$ MeV/$c^2$) interact through an attractive square well of radius 2.0 fm. The depth at which a bound $s$ state just appears at zero energy (where $Ka = \\pi/2$) is ______ MeV (to one decimal place). ($\\hbar c = 197.3$ MeV fm.)',
      answer: 25.6, tol: 0.1, calc: () => PI * PI * HBC * HBC / (8 * 469.46 * 4),
      sol: 'Inside, $u = \\sin Kr$ with $K = \\sqrt{2\\mu V_0}/\\hbar$ at $E = 0$. Outside, a zero-energy bound state needs $u$ flat: $u\'(a) = 0$, so $Ka = \\pi/2$. $V_0 = \\dfrac{\\pi^2(\\hbar c)^2}{8\\mu c^2a^2} = \\dfrac{9.870\\times38940}{8\\times469.5\\times4.0} = 25.6$ MeV. At this depth the scattering length diverges.' },
    { id: 'netsc-030', type: 'mcq', level: 4, exams: ['net'], sub: 'Levinson\'s theorem',
      q: 'For an attractive potential, the $s$-wave phase shift is found to go from $2\\pi$ at $k\\to0$ to $0$ at $k\\to\\infty$. By Levinson\'s theorem, the potential has',
      options: ['no bound states', 'one bound $s$ state', 'two bound $s$ states', 'infinitely many bound states'], answer: 2,
      sol: 'Levinson: $\\delta_l(0) - \\delta_l(\\infty) = N_l\\pi$, the number of bound states in that partial wave (with a special case for a zero-energy $s$ state). Here $2\\pi = N_0\\pi$, so $N_0 = 2$.' },
    { id: 'netsc-031', type: 'mcq', level: 4, exams: ['net'], sub: 'Ramsauer-Townsend',
      q: 'Electrons of about 0.7 eV pass through argon almost without scattering (Ramsauer-Townsend effect). In partial-wave language this happens because',
      options: ['the electrons are too slow to feel the atom', '$\\delta_0$ passes through $\\pi$ while higher phase shifts are still small', 'the atom is repulsive and $\\delta_0 = -\\pi/2$', 'Born approximation becomes exact at this energy'], answer: 1,
      sol: 'The atomic potential is strongly attractive and deep enough that $\\delta_0$ reaches $\\pi$ at a low energy, where $\\sin^2\\delta_0 = 0$; $\\delta_1, \\delta_2$ are still small because of the centrifugal barrier. The $s$ wave emerges with its phase shifted by exactly one half-wavelength, as if nothing were there.' },
    { id: 'netsc-032', type: 'nat', level: 4, exams: ['net'], sub: 'Born approximation',
      q: 'In the Born approximation, the total cross-section for $V = \\beta e^{-\\mu r}/r$ is $\\sigma = \\dfrac{16\\pi m^2\\beta^2}{\\hbar^4\\mu^2(\\mu^2 + 4k^2)}$. At low energy ($k\\to0$) the ratio $\\sigma(k = \\mu)/\\sigma(k = 0)$ is ______ (to one decimal place).',
      answer: 0.2, tol: 0.01, calc: () => 1 / 5,
      sol: '$\\sigma\\propto\\dfrac{1}{\\mu^2 + 4k^2}$ at fixed $\\mu$. At $k = 0$: $1/\\mu^2$. At $k = \\mu$: $1/5\\mu^2$. Ratio $1/5 = 0.2$. Check of the formula: $\\int\\dfrac{2\\pi\\sin\\theta\\,d\\theta}{(\\mu^2 + 4k^2\\sin^2\\theta/2)^2} = \\dfrac{4\\pi}{\\mu^2(\\mu^2 + 4k^2)}$, times $(2m\\beta/\\hbar^2)^2$.' },
    { id: 'netsc-033', type: 'mcq', level: 4, exams: ['net'], sub: 'identical particles',
      q: 'Two identical spin-$\\tfrac12$ fermions in an unpolarised beam scatter through a spin-independent interaction. At $\\theta = 90^\\circ$ (CM), $d\\sigma/d\\Omega$ equals',
      options: ['$|f(90^\\circ)|^2$', '$4|f(90^\\circ)|^2$', '$2|f(90^\\circ)|^2$', 'zero'], answer: 0,
      sol: 'Singlet (weight $\\tfrac14$): symmetric space part, $|f(\\theta) + f(\\pi - \\theta)|^2 = 4|f|^2$ at $90^\\circ$. Triplet (weight $\\tfrac34$): antisymmetric, $|f - f|^2 = 0$. Total $\\tfrac14\\times4|f|^2 = |f|^2$, half the distinguishable value $2|f|^2$.' },
    { id: 'netsc-034', type: 'nat', level: 4, exams: ['net'], sub: 'partial waves',
      q: 'Only $s$ and $p$ waves contribute, with $\\delta_0 = 90^\\circ$ and $\\delta_1 = 90^\\circ$. The ratio $\\dfrac{d\\sigma/d\\Omega(0^\\circ)}{d\\sigma/d\\Omega(180^\\circ)}$ is ______.',
      answer: 4, tol: 0, calc: () => (1 + 3) ** 2 / (1 - 3) ** 2,
      sol: 'With $\\delta = 90^\\circ$, $e^{i\\delta}\\sin\\delta = i$, so $f = \\dfrac ik(1 + 3\\cos\\theta)$. $|f(0)|^2\\propto16$ and $|f(\\pi)|^2\\propto(1 - 3)^2 = 4$. Ratio 4: $s$-$p$ interference produces forward-backward asymmetry, which pure $s$ or pure $p$ waves cannot.' },
    { id: 'netsc-035', type: 'mcq', level: 4, exams: ['net'], sub: 'low-energy scattering',
      q: 'At low energy the effective-range expansion reads $k\\cot\\delta_0 = -\\dfrac1a + \\dfrac12r_0k^2$. To lowest order the $s$-wave cross-section is',
      options: ['$4\\pi a^2$ for $a > 0$ only', '$\\pi a^2$', '$\\dfrac{4\\pi a^2}{1 + k^2a^2}$ exactly for any potential', '$4\\pi a^2$, whatever the sign of $a$'], answer: 3,
      sol: 'For $k\\to0$, $\\cot\\delta_0\\to-1/ka$, so $\\delta_0\\approx-ka$ and $\\sigma = \\dfrac{4\\pi}{k^2}\\sin^2\\delta_0\\to4\\pi a^2$. The sign of $a$ (bound state vs virtual state for strong attraction, or a repulsive core) cannot be read from the cross-section alone. The $1/(1 + k^2a^2)$ form holds only when $r_0$ is negligible.' },
    { id: 'netsc-036', type: 'nat', level: 4, exams: ['net'], sub: 'Born approximation',
      q: 'For $V = V_0e^{-r/a}$ the Born amplitude is $f = -\\dfrac{4mV_0a^3}{\\hbar^2(1 + q^2a^2)^2}$. At $ka = 1$, the ratio of $d\\sigma/d\\Omega$ at $90^\\circ$ to that at $0^\\circ$ is ______ (to four decimal places).',
      answer: 0.0123, tol: 0.0002, calc: () => 1 / (1 + 2) ** 4,
      sol: 'At $0^\\circ$, $q = 0$. At $90^\\circ$: $q = 2k\\sin45^\\circ = \\sqrt2\\,k$, so $q^2a^2 = 2k^2a^2 = 2$. Since $|f|^2\\propto(1 + q^2a^2)^{-4}$, the ratio is $(1 + 2)^{-4} = 1/81 = 0.0123$.',
      trap: 'The amplitude goes as $(1 + q^2a^2)^{-2}$, so the cross-section goes as the fourth power; stopping at the square gives 1/9.' },
    { id: 'netsc-037', type: 'nat', level: 5, exams: ['net'], sub: 'square well',
      q: 'For an attractive square well of radius $a$, the exact $s$-wave phase shift obeys $\\tan(ka + \\delta_0) = \\dfrac{k}{K}\\tan(Ka)$ with $K^2 = k^2 + 2mV_0/\\hbar^2$. For $ka = 0.50$ and $Ka = 1.20$, $\\delta_0$ is ______ degrees (to one decimal place).',
      answer: 18.3, tol: 0.1, calc: () => (Math.atan(0.5 / 1.2 * Math.tan(1.2)) - 0.5) * 180 / PI,
      sol: 'Matching $u = A\\sin Kr$ inside to $u = B\\sin(kr + \\delta_0)$ outside through $u\'/u$ at $r = a$: $K\\cot Ka = k\\cot(ka + \\delta_0)$, i.e. the given relation. $\\tan1.20 = 2.572$, times $0.5/1.2$ gives 1.0717, so $ka + \\delta_0 = \\arctan1.0717 = 0.8202$ rad and $\\delta_0 = 0.3202$ rad $= 18.3^\\circ$. Positive, as an attractive well should give.',
      trap: 'The calculator must be in radians for $\\tan(Ka)$; the angles here are dimensionless products, not degrees.' },
    { id: 'netsc-038', type: 'mcq', level: 5, exams: ['net'], sub: 'atomic scattering',
      q: 'Fast electrons scatter elastically from ground-state hydrogen. The Born amplitude is $f(q) = 2a_0\\dfrac{8 + q^2a_0^2}{(4 + q^2a_0^2)^2}$. In the forward direction it is',
      options: ['infinite, as for any Coulomb potential', 'zero, since the atom is neutral', '$a_0$', '$2a_0$'], answer: 2,
      sol: 'At $q = 0$: $f = 2a_0\\times8/16 = a_0$. The electron cloud screens the proton, so the potential falls off faster than $1/r$ and the forward amplitude is finite. At large $q$ the amplitude tends to $2/(q^2a_0)$, the bare Rutherford value from the nucleus alone.' },
    { id: 'netsc-039', type: 'nat', level: 5, exams: ['net'], sub: 'absorption',
      q: 'High-energy neutrons see a $^{208}$Pb nucleus ($R = 1.2A^{1/3}$ fm) as a black disc. Its total cross-section, elastic plus absorption, is ______ b (to two decimal places).',
      answer: 3.18, tol: 0.02, calc: () => 2 * PI * (1.2 * Math.cbrt(208)) ** 2 / 100,
      sol: 'For a black disc every partial wave with $l\\lesssim kR$ has $S_l = 0$: $\\sigma_{abs} = \\pi R^2$ and $\\sigma_{el} = \\pi R^2$ (shadow scattering), so $\\sigma_{tot} = 2\\pi R^2$. $R = 1.2\\times208^{1/3} = 7.11$ fm, $2\\pi R^2 = 317.6$ fm$^2$ $= 3.18$ b.',
      trap: 'Absorption always brings elastic (diffractive) scattering with it.' },
    { id: 'netsc-040', type: 'msq', level: 5, exams: ['net'], sub: 'absorption',
      q: 'With inelastic channels, each partial wave has $S_l = \\eta_le^{2i\\delta_l}$, $0\\le\\eta_l\\le1$, so $\\sigma_{el,l} = \\dfrac{\\pi}{k^2}(2l + 1)|1 - S_l|^2$ and $\\sigma_{inel,l} = \\dfrac{\\pi}{k^2}(2l + 1)(1 - \\eta_l^2)$. Which statements are correct?',
      options: ['Total absorption ($\\eta_l = 0$) gives equal elastic and inelastic cross-sections in that wave', 'Inelastic scattering can occur with no elastic scattering in that wave', 'Elastic scattering can occur with no inelastic scattering', 'The inelastic cross-section in one wave is at most $\\pi(2l + 1)/k^2$'], answer: [0, 2, 3],
      sol: 'For $\\eta = 0$: $|1 - 0|^2 = 1$ and $1 - 0 = 1$, equal. Zero elastic needs $S_l = 1$, i.e. $\\eta_l = 1$, which kills the inelastic part, so inelastic without elastic is impossible. $\\eta_l = 1$ with $\\delta_l\\ne0$ is pure elastic. $(1 - \\eta^2)\\le1$ caps the inelastic part at $\\pi(2l + 1)/k^2$, a quarter of the elastic unitarity limit.' },
    { id: 'netsc-041', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'scattering amplitude',
      q: 'The scattering amplitude $f(\\theta)$ has the dimensions of',
      options: ['area', 'inverse length', 'a pure number', 'length'], answer: 3,
      sol: 'In $e^{ikz} + f\\,e^{ikr}/r$ both terms are dimensionless, so $f$ is a length; $|f|^2$ is an area per steradian. A useful scale: nuclear amplitudes are a few fm.' },
    { id: 'netsc-042', type: 'nat', level: 3, exams: ['net'], sub: 'Born approximation',
      q: 'A nucleon scatters from a Yukawa potential with $2m\\beta/\\hbar^2 = 0.40$ fm$^{-1}$ and $\\mu = 0.70$ fm$^{-1}$. In Born approximation, the forward differential cross-section is ______ fm$^2$/sr (to two decimal places).',
      answer: 0.67, tol: 0.01, calc: () => (0.4 / 0.49) ** 2,
      sol: 'At $q = 0$: $|f| = \\dfrac{2m\\beta}{\\hbar^2\\mu^2} = \\dfrac{0.40}{0.49} = 0.816$ fm, so $d\\sigma/d\\Omega = 0.666$ fm$^2$/sr $= 6.7$ mb/sr.' },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'netsc-g01', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'momentum transfer',
      make(r) {
        const P = choose(r, [['electrons', MEc], ['protons', MPc], ['neutrons', MN]]), T = choose(r, P[1] < 1 ? [100, 200, 500, 1000] : [10, 20, 50, 100]), th = choose(r, [20, 30, 45, 60, 90, 120]);
        const pc = Math.sqrt(T * T + 2 * T * P[1]), k = pc / HBC, q = 2 * k * Math.sin(th * D / 2);
        return { q: `${P[0][0].toUpperCase() + P[0].slice(1)} of kinetic energy ${T} MeV scatter elastically through ${th}$^\\circ$ (CM, target recoil ignored). The momentum transfer $q$ is ______ fm$^{-1}$ (three significant figures). Use $\\hbar c = 197.3$ MeV fm.`,
          answer: +q.toPrecision(3), tol: q * 0.01, unit: 'fm⁻¹', m: P[1], T, th,
          sol: `Relativistic momentum: $pc = \\sqrt{T^2 + 2Tmc^2} = ${pc.toPrecision(4)}$ MeV, $k = pc/\\hbar c = ${k.toPrecision(4)}$ fm$^{-1}$. $q = 2k\\sin(\\theta/2) = ${q.toPrecision(4)}$ fm$^{-1}$.`,
          trap: 'For electrons at these energies use $pc\\approx T$, not $\\sqrt{2mc^2T}$.' };
      },
      verify: (p) => 2 * Math.sqrt(p.T ** 2 + 2 * p.T * p.m) / HBC * Math.sin(p.th * D / 2) },
    { id: 'netsc-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'partial waves',
      make(r) {
        const k = choose(r, [0.2, 0.3, 0.5, 0.8, 1]), d0 = choose(r, [15, 30, 45, 60, 75, 90, 120, -20]), d1 = choose(r, [0, 5, 10, 20, -10]), d2 = choose(r, [0, 0, 2, 5]);
        const val = 4 * PI / (k * k) * (Math.sin(d0 * D) ** 2 + 3 * Math.sin(d1 * D) ** 2 + 5 * Math.sin(d2 * D) ** 2);
        return { q: `At $k = ${k}$ fm$^{-1}$ the phase shifts are $\\delta_0 = ${d0}^\\circ$, $\\delta_1 = ${d1}^\\circ$, $\\delta_2 = ${d2}^\\circ$ (higher ones negligible). The total elastic cross-section is ______ fm$^2$ (three significant figures).`,
          answer: +val.toPrecision(3), tol: val * 0.01, k, d0, d1, d2,
          sol: `$\\sigma = \\dfrac{4\\pi}{k^2}\\sum(2l + 1)\\sin^2\\delta_l = ${round(4 * PI / (k * k), 3)}\\times(${round(Math.sin(d0 * D) ** 2, 4)} + 3\\times${round(Math.sin(d1 * D) ** 2, 4)} + 5\\times${round(Math.sin(d2 * D) ** 2, 4)}) = ${val.toPrecision(4)}$ fm$^2$.`,
          trap: 'Weight each wave by $2l + 1$; a negative phase shift contributes just as much as a positive one.' };
      },
      verify: (p) => 4 * PI / p.k ** 2 * (Math.sin(p.d0 * D) ** 2 + 3 * Math.sin(p.d1 * D) ** 2 + 5 * Math.sin(p.d2 * D) ** 2) },
    { id: 'netsc-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'optical theorem',
      make(r) {
        const k = choose(r, [0.5, 1, 1.5, 2, 3]), im = choose(r, [0.5, 1, 2, 3, 5]), ask = choose(r, ['sig', 'im']);
        const sig = 4 * PI * im / k;
        if (ask === 'im') {
          const s = round(sig / 100, 3);
          return { q: `At $k = ${k}$ fm$^{-1}$ a total cross-section of ${s} b is measured. Find $\\text{Im}\\,f(0)$ in fm (three significant figures).`,
            answer: +(s * 100 * k / (4 * PI)).toPrecision(3), tol: im * 0.01, ask, s, k,
            sol: `$\\text{Im}\\,f(0) = \\dfrac{k\\sigma}{4\\pi} = \\dfrac{${k}\\times${round(s * 100, 2)}\\text{ fm}^2}{4\\pi} = ${(s * 100 * k / (4 * PI)).toPrecision(4)}$ fm (1 b = 100 fm$^2$).`,
            trap: 'Convert barns to fm$^2$ first.' };
        }
        return { q: `At $k = ${k}$ fm$^{-1}$ the forward elastic amplitude has $\\text{Im}\\,f(0) = ${im}$ fm. The total cross-section is ______ fm$^2$ (three significant figures).`,
          answer: +sig.toPrecision(3), tol: sig * 0.01, ask, k, im,
          sol: `Optical theorem: $\\sigma_{tot} = \\dfrac{4\\pi}{k}\\text{Im}\\,f(0) = \\dfrac{4\\pi\\times${im}}{${k}} = ${sig.toPrecision(4)}$ fm$^2$.`,
          trap: 'Divide by $k$, not $k^2$.' };
      },
      verify: (p) => p.ask === 'sig' ? 4 * PI * p.im / p.k : p.s * 100 * p.k / (4 * PI) },
    { id: 'netsc-g04', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'hard sphere',
      make(r) {
        const a = choose(r, [0.5, 1, 1.5, 2, 3, 5]), reg = choose(r, ['low', 'high']);
        const val = (reg === 'low' ? 4 : 2) * PI * a * a;
        return { q: `Particles scatter from an impenetrable sphere of radius ${a} fm at ${reg === 'low' ? 'very low energy ($ka\\ll1$)' : 'very high energy ($ka\\gg1$)'}. The total cross-section is ______ fm$^2$ (three significant figures).`,
          answer: +val.toPrecision(3), tol: val * 0.01, a, reg,
          sol: reg === 'low' ? `Only $\\delta_0 = -ka$ matters: $\\sigma = \\dfrac{4\\pi}{k^2}\\sin^2ka\\to4\\pi a^2 = ${val.toPrecision(4)}$ fm$^2$.` : `About $ka$ partial waves with $\\langle\\sin^2\\delta_l\\rangle = \\tfrac12$: $\\sigma\\to2\\pi a^2 = ${val.toPrecision(4)}$ fm$^2$ (reflection plus shadow diffraction).`,
          trap: 'Neither limit is the classical $\\pi a^2$.' };
      },
      verify: (p) => (p.reg === 'low' ? 4 : 2) * PI * p.a ** 2 },
    { id: 'netsc-g05', type: 'nat', level: 3, exams: ['net'], sub: 'Born approximation',
      make(r) {
        const x = choose(r, [0.5, 1, 1.5, 2]), t1 = choose(r, [0, 30, 45]), t2 = choose(r, [60, 90, 120, 180]);
        const q2 = (t) => (2 * x * Math.sin(t * D / 2)) ** 2, val = ((1 + q2(t2)) / (1 + q2(t1))) ** 2;
        return { q: `In Born approximation a Yukawa potential with range parameter $\\mu$ is probed at $k = ${x}\\mu$. Find $\\dfrac{d\\sigma/d\\Omega(${t1}^\\circ)}{d\\sigma/d\\Omega(${t2}^\\circ)}$ (three significant figures).`,
          answer: +val.toPrecision(3), tol: val * 0.01, x, t1, t2,
          sol: `$d\\sigma/d\\Omega\\propto(\\mu^2 + q^2)^{-2}$ with $q^2/\\mu^2 = 4(k/\\mu)^2\\sin^2(\\theta/2)$: ${round(q2(t1), 4)} at ${t1}$^\\circ$ and ${round(q2(t2), 4)} at ${t2}$^\\circ$. Ratio $= \\left(\\dfrac{1 + ${round(q2(t2), 4)}}{1 + ${round(q2(t1), 4)}}\\right)^2 = ${val.toPrecision(4)}$.`,
          trap: 'Square the ratio of $(\\mu^2 + q^2)$: the cross-section is the amplitude squared.' };
      },
      verify: (p) => { const q2 = (t) => (2 * p.x * Math.sin(t * D / 2)) ** 2; return ((1 + q2(p.t2)) / (1 + q2(p.t1))) ** 2; } },
    { id: 'netsc-g06', type: 'nat', level: 3, exams: ['net'], sub: 'unitarity',
      make(r) {
        const T = choose(r, [0.01, 0.1, 1, 10, 100]), l = choose(r, [0, 0, 1, 2]);
        const k = Math.sqrt(2 * MN * T * 1e-6) / HBC, val = 4 * PI * (2 * l + 1) / (k * k) / 100, e10 = Math.floor(Math.log10(val)), man = val / 10 ** e10;
        return { q: `Neutrons of ${T} eV ($m_nc^2 = 939.6$ MeV) scatter from a heavy nucleus (treat the nucleus as fixed). The unitarity limit on the $l = ${l}$ elastic cross-section is ______ $\\times10^{${e10}}$ b (two decimal places).`,
          answer: round(man, 2), tol: Math.max(0.01, man * 0.006), T, l, e10,
          sol: `$k = \\sqrt{2m_nc^2E}/\\hbar c = ${k.toExponential(3)}$ fm$^{-1}$. Limit $= 4\\pi(2l + 1)/k^2 = ${(val * 100).toExponential(3)}$ fm$^2$ $= ${man.toFixed(3)}\\times10^{${e10}}$ b.`,
          trap: '1 b = 100 fm$^2$; and include the $2l + 1$.' };
      },
      verify: (p) => { const k = Math.sqrt(2 * MN * p.T * 1e-6) / HBC; return 4 * PI * (2 * p.l + 1) / k ** 2 / 100 / 10 ** p.e10; } },
    { id: 'netsc-g07', type: 'nat', level: 3, exams: ['net'], sub: 'form factors',
      make(r) {
        const ask = choose(r, ['slope', 'sphere']);
        if (ask === 'sphere') {
          const R = choose(r, [3, 4, 5, 6, 7]), val = Math.sqrt(0.6) * R;
          return { q: `A nucleus is modelled as a uniformly charged sphere of radius ${R} fm. Its rms charge radius is ______ fm (three decimal places).`,
            answer: round(val, 3), tol: 0.005, ask, R,
            sol: `$\\langle r^2\\rangle = \\tfrac35R^2 = ${round(0.6 * R * R, 3)}$ fm$^2$, so $r_{rms} = ${round(val, 4)}$ fm.`, trap: 'The rms radius is smaller than the edge radius $R$.' };
        }
        const F = choose(r, [0.95, 0.9, 0.85, 0.8]), q = choose(r, [0.2, 0.3, 0.4, 0.5]), val = Math.sqrt(6 * (1 - F) / (q * q));
        return { q: `Low-$q$ electron scattering gives a charge form factor $F = ${F}$ at $q = ${q}$ fm$^{-1}$. Using $F\\approx1 - q^2\\langle r^2\\rangle/6$, estimate the rms charge radius in fm (three decimal places).`,
          answer: round(val, 3), tol: Math.max(0.005, val * 0.003), ask, F, qq: q,
          sol: `$\\langle r^2\\rangle = 6(1 - F)/q^2 = 6\\times${round(1 - F, 2)}/${q * q} = ${round(6 * (1 - F) / (q * q), 4)}$ fm$^2$, so $r_{rms} = ${round(val, 4)}$ fm.`, trap: 'The 6 comes from averaging $\\sin(qr)/qr\\approx1 - q^2r^2/6$ over the distribution.' };
      },
      verify: (p) => p.ask === "sphere" ? Math.sqrt(0.6) * p.R : Math.sqrt(6 * (1 - p.F) / p.qq ** 2) },
    { id: 'netsc-g08', type: 'nat', level: 3, exams: ['net'], sub: 'scattering length',
      make(r) {
        const as = choose(r, [-23.7, -18.5, -10, 5, 10]), at = choose(r, [2, 4, 5.4, 8]), ask = choose(r, ['single', 'spin']);
        const val = ask === 'single' ? 4 * PI * as * as / 100 : (0.25 * 4 * PI * as * as + 0.75 * 4 * PI * at * at) / 100;
        return { q: ask === 'single' ? `A low-energy $s$-wave interaction has scattering length ${as} fm. The zero-energy cross-section is ______ b (three significant figures).` : `Spin-1/2 neutrons scatter from spin-1/2 targets with singlet scattering length ${as} fm and triplet ${at} fm. For an unpolarised beam at zero energy, the cross-section is ______ b (three significant figures).`,
          answer: +val.toPrecision(3), tol: val * 0.01, as, at, ask,
          sol: ask === 'single' ? `$\\sigma = 4\\pi a^2 = 4\\pi\\times${as}^2$ fm$^2$ $= ${(val * 100).toPrecision(4)}$ fm$^2$ $= ${val.toPrecision(4)}$ b.` : `Weights $\\tfrac14$ (singlet) and $\\tfrac34$ (triplet): $\\sigma = \\pi(a_s^2 + 3a_t^2) = \\pi(${round(as * as, 2)} + ${round(3 * at * at, 2)})$ fm$^2$ $= ${val.toPrecision(4)}$ b.`,
          trap: 'Square the scattering lengths before averaging over spin states.' };
      },
      verify: (p) => p.ask === 'single' ? 4 * PI * p.as ** 2 / 100 : PI * (p.as ** 2 + 3 * p.at ** 2) / 100 },
    { id: 'netsc-g09', type: 'mcq', level: 3, exams: ['net'], sub: 'Levinson\'s theorem',
      make(r) {
        const N = int(r, 0, 3), l = choose(r, [0, 1, 2]);
        const o = mcqOptions(r, `${N}`, [`${N + 1}`, `${Math.max(0, N - 1) === N ? N + 2 : N - 1}`, `${2 * N + 2}`, `${N + 3}`], (v) => v);
        return { q: `For a potential that has no zero-energy bound state, the $l = ${l}$ phase shift falls from ${N === 0 ? '$0$' : N === 1 ? '$\\pi$' : `$${N}\\pi$`} at $k\\to0$ to $0$ at $k\\to\\infty$. How many bound states with $l = ${l}$ does the potential have?`, ...o,
          sol: `Levinson's theorem: $\\delta_l(0) - \\delta_l(\\infty) = N_l\\pi$, so $N_l = ${N}$${l > 0 ? ` (each a $(2l + 1) = ${2 * l + 1}$-fold multiplet)` : ''}.`,
          trap: 'Count multiples of $\\pi$, not of $2\\pi$.' };
      } },
    { id: 'netsc-g10', type: 'mcq', level: 3, exams: ['net'], sub: 'identical particles',
      make(r) {
        const K = choose(r, [['two identical spin-0 bosons', '$4|f|^2$'], ['two identical spin-1/2 fermions, unpolarised', '$|f|^2$'], ['two identical spin-1/2 fermions in a spin triplet', 'zero'], ['two identical spin-1/2 fermions in the spin singlet', '$4|f|^2$'], ['two distinguishable particles (counting both in the detector)', '$2|f|^2$']]);
        const o = mcqOptions(r, K[1], ['$4|f|^2$', '$|f|^2$', 'zero', '$2|f|^2$', '$3|f|^2$'].filter((x) => x !== K[1]), (v) => v);
        return { q: `For ${K[0]}, with a spin-independent interaction, what is $d\\sigma/d\\Omega$ at $\\theta = 90^\\circ$ (CM)? Here $f = f(90^\\circ)$.`, ...o,
          sol: `At $90^\\circ$, $f(\\theta) = f(\\pi - \\theta) = f$. Symmetric space states give $|f + f|^2 = 4|f|^2$; antisymmetric give 0; distinguishable give $|f|^2 + |f|^2$; unpolarised fermions are $\\tfrac14$ singlet and $\\tfrac34$ triplet, giving $|f|^2$. Answer: ${K[1]}.`,
          trap: 'Spin-1/2 fermions in the singlet have a symmetric spatial wavefunction and behave like bosons.' };
      } },
    { id: 'netsc-g11', type: 'nat', level: 4, exams: ['net'], sub: 'square well',
      make(r) {
        const ka = choose(r, [0.1, 0.2, 0.3, 0.5]), Ka = choose(r, [0.6, 0.8, 1.0, 1.2, 1.4]);
        const val = (Math.atan(ka / Ka * Math.tan(Ka)) - ka) * 180 / PI;
        return { q: `For an attractive square well, $\\tan(ka + \\delta_0) = \\dfrac kK\\tan Ka$. With $ka = ${ka}$ and $Ka = ${Ka}$, find $\\delta_0$ in degrees (two decimal places).`,
          answer: round(val, 2), tol: Math.max(0.02, Math.abs(val) * 0.003), ka, Ka,
          sol: `$\\tan${Ka} = ${round(Math.tan(Ka), 4)}$ (radians). $\\tan(ka + \\delta_0) = ${round(ka / Ka * Math.tan(Ka), 5)}$, so $ka + \\delta_0 = ${round(Math.atan(ka / Ka * Math.tan(Ka)), 5)}$ rad and $\\delta_0 = ${round(val * PI / 180, 5)}$ rad $= ${round(val, 3)}^\\circ$.`,
          trap: '$Ka$ and $ka$ are in radians.' };
      },
      verify: (p) => (Math.atan(p.ka / p.Ka * Math.tan(p.Ka)) - p.ka) * 180 / PI },
    { id: 'netsc-g12', type: 'nat', level: 3, exams: ['net'], sub: 'resonances',
      make(r) {
        const ER = choose(r, [1, 2, 5, 10]), G = choose(r, [0.1, 0.2, 0.5]), dE = choose(r, [0.05, 0.1, 0.25, 0.5, 1]) * G * 2, sgn = r() < 0.5 ? 1 : -1;
        const Ex = round(ER + sgn * dE, 3), val = (G / 2) ** 2 / ((Ex - ER) ** 2 + (G / 2) ** 2);
        return { q: `An $s$-wave resonance has $E_R = ${ER}$ MeV and $\\Gamma = ${G}$ MeV. At $E = ${Ex}$ MeV, what fraction of the peak resonant cross-section remains (ignore the slow change of $k$; three decimal places)?`,
          answer: round(val, 3), tol: 0.002, ER, G, Ex,
          sol: `Breit-Wigner: $\\sigma/\\sigma_{peak} = \\dfrac{(\\Gamma/2)^2}{(E - E_R)^2 + (\\Gamma/2)^2} = \\dfrac{${round((G / 2) ** 2, 5)}}{${round((Ex - ER) ** 2, 5)} + ${round((G / 2) ** 2, 5)}} = ${round(val, 4)}$.`,
          trap: 'Half the peak is reached at $E_R\\pm\\Gamma/2$, not $\\pm\\Gamma$.' };
      },
      verify: (p) => (p.G / 2) ** 2 / ((p.Ex - p.ER) ** 2 + (p.G / 2) ** 2) },
    { id: 'netsc-g13', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'concepts',
      make(r) {
        const P = choose(r, [
          ['As $k\\to0$, the phase shift $\\delta_l$ of a short-range potential behaves as', '$k^{2l+1}$', ['$k^{l}$', '$k^{2l}$', 'a constant for every $l$'], 'Near the origin $u_l\\propto r^{l+1}$; matching to the free solutions gives $\\tan\\delta_l\\propto(ka)^{2l+1}$.'],
          ['The Born approximation works best for', 'weak potentials or high energies', ['strong potentials at low energy', 'resonant scattering', 'potentials with bound states near threshold'], 'Born treats $V$ to first order; it fails when the wave is strongly distorted.'],
          ['A resonance appears in the cross-section as', 'a peak where a phase shift rises rapidly through $\\pi/2$', ['a dip where all phase shifts vanish', 'a step where $\\delta_l$ falls by $\\pi$', 'a divergence of the total cross-section'], 'Breit-Wigner: $\\sin^2\\delta = 1$ at $E_R$, with width $\\Gamma$.'],
          ['In Born approximation, reversing the sign of the potential', 'leaves $d\\sigma/d\\Omega$ unchanged', ['reverses the angular distribution', 'doubles the cross-section', 'makes the cross-section vanish'], '$f_B$ is linear in $V$, so only its sign flips and $|f_B|^2$ is unchanged.'],
          ['The total cross-section of a purely elastic, real (non-absorbing) potential is related to the forward amplitude by', '$\\sigma = (4\\pi/k)\\,\\text{Im}\\,f(0)$', ['$\\sigma = 4\\pi|f(0)|^2$', '$\\sigma = (4\\pi/k)\\,\\text{Re}\\,f(0)$', '$\\sigma = \\pi|f(0)|^2/k^2$'], 'This is the optical theorem; $4\\pi|f(0)|^2$ holds only for pure isotropic scattering.'],
        ]);
        const o = mcqOptions(r, P[1], P[2], (v) => v);
        return { q: P[0], ...o, sol: `The answer is ${P[1]}. ${P[3]}` };
      } },
    ...more,
    ...r4.gens,
  ],
};

// Tidy signs in generated text ("+ -3" -> "- 3", "1x" -> "x"); see _signs.js.
export default tidyPhys(topicBank, ["netsc-g08","netsc-r4g3"], { neg: ["netsc-g08"] });
