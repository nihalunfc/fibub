// Dielectric and optical properties of solids (CSIR NET Part C / GATE level): the Lorentz local field and the
// Clausius-Mossotti relation, electronic, ionic and orientational polarisability and their frequency ranges, Debye
// relaxation and dielectric loss, the Lorentz oscillator and anomalous dispersion, the Drude model of metals (plasma
// frequency, transparency, skin depth, sum rule), optical constants, reflectance and absorption, the reststrahlen band
// and Lyddane-Sachs-Teller, ferroelectrics and the Curie-Weiss law, crystal classes (piezo-, pyro-, ferroelectric),
// semiconductor absorption edges and excitons. Original questions for fibub.
import { pick, int, choose, mcqOptions, round, C } from '../_util.js';
import more from './dielectric-optical.more.gen.js';

const R = String.raw;
const EPS0 = C.eps0, E = C.e, ME = C.me, HBAR = C.hbar;
const wp = (n) => Math.sqrt(n * E * E / (EPS0 * ME));          // plasma angular frequency for n per m^3
const sci = (v, d = 3) => { const [m, e] = v.toExponential(d).split('e'); return (+m === 1 ? '' : m + R`\times`) + `10^{${+e}}`; };

export default {
  topic: 'dielectric-optical',
  items: [
    // ---------- level 1 ----------
    { id: 'diel-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'local field',
      q: R`In a cubic crystal (or an isotropic medium) with macroscopic field $\vec E$ and polarisation $\vec P$, the Lorentz local field acting on an atom is`,
      options: [R`$\vec E$`, R`$\vec E + \vec P/\varepsilon_0$`, R`$\vec E + \vec P/3\varepsilon_0$`, R`$\vec E - \vec P/3\varepsilon_0$`], answer: 2,
      sol: R`Cut a small sphere round the atom. The rest of the medium acts through the macroscopic field plus the field of the charges on the sphere's surface, $+\vec P/3\varepsilon_0$. In a cubic arrangement the dipoles inside the sphere give zero net field. So $\vec E_{loc} = \vec E + \vec P/3\varepsilon_0$.`,
      trap: R`$-\vec P/3\varepsilon_0$ is the depolarising field inside a uniformly polarised sphere; the cavity field has the opposite sign.` },
    { id: 'diel-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'polarisation mechanisms',
      q: R`Which polarisation mechanism still responds to visible light (about $5\times10^{14}$ Hz)?`,
      options: ['Orientational (permanent dipoles turning)', 'Ionic (ions moving against each other)', 'Electronic (electron clouds shifting against nuclei)', 'Space charge (carriers piling up at interfaces)'], answer: 2,
      sol: 'Each mechanism can follow the field only below its own natural frequency. Orientation of molecules relaxes at about 10⁹ to 10¹¹ Hz (microwaves), ions vibrate at 10¹² to 10¹³ Hz (infrared), and electron clouds resonate in the ultraviolet (10¹⁵ to 10¹⁶ Hz). At optical frequencies only the electronic part is left, so ε(optical) = n².',
      trap: 'Ionic polarisation dies out above the infrared phonon frequencies, well below visible light.' },
    { id: 'diel-003', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Drude model',
      q: R`For light of angular frequency $\omega$ above the plasma frequency $\omega_p$, a free-electron metal`,
      options: ['reflects almost all the light', 'becomes transparent', 'absorbs all the light within one wavelength', 'becomes a superconductor'], answer: 1,
      sol: R`With negligible damping, $\varepsilon(\omega) = 1 - \omega_p^2/\omega^2$. Below $\omega_p$ it is negative, $n$ is imaginary and the wave is reflected. Above $\omega_p$, $\varepsilon > 0$, $n$ is real and the wave propagates: alkali metals become transparent in the ultraviolet.`,
      trap: 'Metals reflect visible light because visible frequencies lie below ωp, not because metals always reflect.' },
    { id: 'diel-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Drude model',
      q: 'The plasma frequency of a free-electron gas depends on the electron density $n$ as',
      options: [R`$n$`, R`$\sqrt n$`, R`$n^2$`, R`$n^{1/3}$`], answer: 1,
      sol: R`$\omega_p^2 = ne^2/\varepsilon_0m$: a slab of electrons displaced by $x$ leaves surface charges that give a field $nex/\varepsilon_0$ and a restoring force $ne^2x/\varepsilon_0$ per electron. So $\omega_p \propto \sqrt n$.`,
      trap: R`$n^{1/3}$ is how the Fermi wave vector scales, not the plasma frequency.` },
    { id: 'diel-005', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'optical constants', unit: '× 10⁵ m⁻¹',
      q: R`A material has extinction coefficient $\kappa = 0.010$ at a wavelength of $500$ nm (in vacuum). Its intensity absorption coefficient $\alpha$ is ______ $\times10^5$ m$^{-1}$ (two decimal places).`,
      answer: 2.51, tol: 0.01, calc: () => 4 * Math.PI * 0.01 / 500e-9 / 1e5,
      sol: R`The field decays as $e^{-\kappa\omega z/c}$, so the intensity decays as $e^{-2\kappa\omega z/c}$: $\alpha = 2\kappa\omega/c = 4\pi\kappa/\lambda = 4\pi\times0.010/(5.0\times10^{-7}) = 2.51\times10^5$ m$^{-1}$. The light falls to $1/e$ in about 4 μm.`,
      trap: 'Forgetting the factor 2 between field and intensity.' },
    { id: 'diel-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'polarisation mechanisms',
      q: 'Water has a static dielectric constant near 80, yet its refractive index for visible light is only 1.33. The reason is that',
      options: ['the refractive index is measured at a different temperature', 'water is magnetic at optical frequencies', 'the electronic polarisability of water is negative', 'the permanent dipoles of water molecules cannot turn fast enough to follow optical fields'], answer: 3,
      sol: R`$n^2 = \varepsilon_r(\omega)$ at the frequency of the light. The huge static value comes from orientational polarisation of the permanent dipoles, which relaxes at about $2\times10^{10}$ Hz. At $10^{15}$ Hz only electronic polarisation remains, giving $\varepsilon_r \approx 1.77 = 1.33^2$.`,
      trap: R`Maxwell's relation $n = \sqrt{\varepsilon_r}$ holds, but with $\varepsilon_r$ taken at the same frequency.` },

    // ---------- level 2 ----------
    { id: 'diel-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Clausius-Mossotti',
      q: R`For a cubic dielectric, $N\alpha/3\varepsilon_0 = 0.20$, where $N$ is the number density of atoms and $\alpha$ their polarisability. Using the Clausius-Mossotti relation, its dielectric constant is ______ (two decimal places).`,
      answer: 1.75, tol: 0.01, calc: () => (1 + 2 * 0.2) / (1 - 0.2),
      sol: R`$\dfrac{\varepsilon_r - 1}{\varepsilon_r + 2} = \dfrac{N\alpha}{3\varepsilon_0} = x$, so $\varepsilon_r = \dfrac{1 + 2x}{1 - x} = \dfrac{1.4}{0.8} = 1.75$. Without the local-field correction one would get $1 + 3x = 1.60$.`,
      trap: R`Using $\varepsilon_r = 1 + N\alpha/\varepsilon_0$ ignores the Lorentz field, valid only for dilute gases.` },
    { id: 'diel-008', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'orientational polarisation',
      q: R`Molecules with permanent dipole moment $p$ in a weak field at temperature $T$ contribute an orientational polarisability (Langevin-Debye) of`,
      options: [R`$p^2/3k_BT$`, R`$p^2/k_BT$`, R`$p/3k_BT$`, R`$3p^2/k_BT$`], answer: 0,
      sol: R`The mean dipole along the field is $p\,L(pE/k_BT)$ with the Langevin function $L(x) = \coth x - 1/x \approx x/3$ for small $x$. So $\langle p_z\rangle = p^2E/3k_BT$ and $\alpha_{or} = p^2/3k_BT$, falling as $1/T$ because heat randomises the dipoles.`,
      trap: 'The 1/3 comes from averaging cos²θ over all directions in 3D.' },
    { id: 'diel-009', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Drude model', unit: 'eV',
      q: R`Copper has $8.5\times10^{28}$ conduction electrons per m$^3$. Treating them as free electrons, the plasmon energy $\hbar\omega_p$ is ______ eV (one decimal place).`,
      answer: 10.8, tol: 0.1, calc: () => HBAR * wp(8.5e28) / E,
      sol: R`$\omega_p = \sqrt{ne^2/\varepsilon_0m} = \sqrt{8.5\times10^{28}\times(1.602\times10^{-19})^2/(8.854\times10^{-12}\times9.109\times10^{-31})} = 1.64\times10^{16}$ rad/s. $\hbar\omega_p = 1.055\times10^{-34}\times1.64\times10^{16}/1.602\times10^{-19} = 10.8$ eV. (Copper's red colour comes from d-band transitions near 2 eV, not from the free-electron edge.)`,
      trap: R`Dividing by $2\pi$: $\hbar\omega$ uses the angular frequency.` },
    { id: 'diel-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Drude model',
      q: R`In the Drude model with collision rate $\gamma$, the dielectric function of a metal is $\varepsilon(\omega) = 1 - \omega_p^2/(\omega^2 + i\gamma\omega)$. In the limit $\omega \gg \gamma$ it becomes`,
      options: [R`$1 + \omega_p^2/\omega^2$`, R`$1 - \omega^2/\omega_p^2$`, R`$1 - \omega_p^2/\omega^2$`, R`$\omega_p^2/\omega^2$`], answer: 2,
      sol: R`Dropping $i\gamma\omega$ against $\omega^2$ leaves $\varepsilon = 1 - \omega_p^2/\omega^2$: real, negative below $\omega_p$, zero at $\omega_p$ (where longitudinal plasma oscillations live) and positive above.`,
      trap: 'The free-electron term lowers ε; electrons respond out of phase above their (zero) natural frequency.' },
    { id: 'diel-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'reflectance', unit: '%',
      q: R`Silicon has refractive index $3.4$ and negligible absorption at $1.5\ \mu$m. The fraction of light reflected at normal incidence from air is ______ % (one decimal place).`,
      answer: 29.8, tol: 0.1, calc: () => ((3.4 - 1) / (3.4 + 1)) ** 2 * 100,
      sol: R`$R = \left(\dfrac{n-1}{n+1}\right)^2 = (2.4/4.4)^2 = 0.2975$: about 30%, which is why silicon solar cells need anti-reflection coatings.`,
      trap: R`Forgetting to square $(n-1)/(n+1)$, which gives the amplitude ratio (55%).` },
    { id: 'diel-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Debye relaxation',
      q: R`For Debye relaxation, $\varepsilon(\omega) = \varepsilon_\infty + \dfrac{\varepsilon_s - \varepsilon_\infty}{1 + i\omega\tau}$ (sign convention aside). The imaginary part (dielectric loss) is largest when`,
      options: [R`$\omega\tau = 1$`, R`$\omega = 0$`, R`$\omega\tau = \sqrt2$`, R`$\omega\to\infty$`], answer: 0,
      sol: R`$\varepsilon'' = (\varepsilon_s - \varepsilon_\infty)\dfrac{\omega\tau}{1 + \omega^2\tau^2}$. With $x = \omega\tau$, $d/dx[x/(1 + x^2)] = (1 - x^2)/(1 + x^2)^2 = 0$ at $x = 1$. The peak value is $(\varepsilon_s - \varepsilon_\infty)/2$, and there $\varepsilon'$ is halfway between $\varepsilon_s$ and $\varepsilon_\infty$.`,
      trap: 'At very low or very high frequency there is no loss: the dipoles either follow perfectly or do not move at all.' },
    { id: 'diel-013', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'polarisation mechanisms', format: 'multi',
      q: R`For a polar ionic solid, which statements about $\varepsilon_r(\omega)$ from DC to the ultraviolet are correct?`,
      options: [R`$\varepsilon_r$ rises in steps as the frequency increases.`, R`Each drop in $\varepsilon'$ comes with a peak in the loss $\varepsilon''$.`, R`At visible frequencies, $\varepsilon'$ is close to $n^2$.`, R`Orientational polarisation is the last mechanism to drop out.`], answer: [1, 2],
      sol: R`As frequency rises, mechanisms drop out one by one (orientational near microwaves, ionic in the infrared, electronic in the ultraviolet), so $\varepsilon'$ falls in steps, each marked by absorption (Kramers-Kronig ties every change in $\varepsilon'$ to a loss feature). At optical frequencies only electrons respond, so $\varepsilon' \approx n^2$. Orientation is the slowest, so it is the first to go, not the last.`,
      trap: 'The steps go down, not up, as frequency rises.' },
    { id: 'diel-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'electronic polarisability', unit: '× 10⁻⁴⁰ F m²',
      q: R`In the simplest model an atom is a point nucleus inside a uniform electron cloud of radius $R$, which gives $\alpha = 4\pi\varepsilon_0R^3$. For $R = 0.10$ nm, $\alpha$ is ______ $\times10^{-40}$ F m$^2$ (two decimal places).`,
      answer: 1.11, tol: 0.01, calc: () => 4 * Math.PI * EPS0 * 1e-30 / 1e-40,
      sol: R`Shifting the nucleus by $d$ inside a uniform sphere of charge $-Ze$ gives a restoring field $Zed/4\pi\varepsilon_0R^3$; balance with $E$: $p = Zed = 4\pi\varepsilon_0R^3E$. So $\alpha = 4\pi\times8.854\times10^{-12}\times10^{-30} = 1.11\times10^{-40}$ F m$^2$.`,
      trap: R`Often quoted as the "polarisability volume" $\alpha/4\pi\varepsilon_0 = R^3$; do not mix the two.` },
    { id: 'diel-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'ferroelectrics',
      q: 'Which statement about piezoelectric, pyroelectric and ferroelectric crystals is correct?',
      options: ['Every piezoelectric crystal is ferroelectric.', 'Every pyroelectric crystal is ferroelectric.', 'A crystal with a centre of inversion can be piezoelectric.', 'Every ferroelectric crystal is both pyroelectric and piezoelectric.'], answer: 3,
      sol: 'A ferroelectric has a spontaneous polarisation that can be reversed by a field. Spontaneous polarisation makes it pyroelectric (P changes with T), and a polar crystal lacks inversion symmetry, so it is piezoelectric. The reverse fails: quartz is piezoelectric but not pyroelectric, and tourmaline is pyroelectric but its polarisation cannot be switched.',
      trap: 'The sets nest: ferroelectric ⊂ pyroelectric ⊂ piezoelectric ⊂ non-centrosymmetric.' },
    { id: 'diel-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'absorption edge',
      q: R`Just above the band gap $E_g$ of a direct-gap semiconductor (allowed transitions), the absorption coefficient varies with photon energy as`,
      options: [R`$(\hbar\omega - E_g)^2$`, R`$(\hbar\omega - E_g)^{1/2}$`, R`$(\hbar\omega - E_g)^{3/2}$`, R`$e^{-(\hbar\omega - E_g)/k_BT}$`], answer: 1,
      sol: R`Vertical transitions connect states with the same $k$; the joint density of states of two parabolic bands grows as $\sqrt{\hbar\omega - E_g}$, like a 3D density of states. With a constant matrix element, $\alpha \propto (\hbar\omega - E_g)^{1/2}$.`,
      trap: R`$(\hbar\omega - E_g \pm\hbar\Omega)^2$ is the phonon-assisted indirect edge; $3/2$ is the direct but forbidden case.` },

    // ---------- level 3 ----------
    { id: 'diel-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Clausius-Mossotti',
      q: R`A non-polar liquid has $2.0\times10^{28}$ molecules per m$^3$, each of polarisability $2.0\times10^{-40}$ F m$^2$. Using the Clausius-Mossotti relation, its dielectric constant is ______ (three decimal places).`,
      answer: 1.532, tol: 0.002, calc: () => { const x = 2e28 * 2e-40 / (3 * EPS0); return (1 + 2 * x) / (1 - x); },
      sol: R`$x = N\alpha/3\varepsilon_0 = 4.0\times10^{-12}/(2.656\times10^{-11}) = 0.1506$. $\varepsilon_r = (1 + 2x)/(1 - x) = 1.3012/0.8494 = 1.532$. Ignoring the local field would give $1 + 3x = 1.452$: the correction matters in dense media.`,
      trap: R`Using $N\alpha/\varepsilon_0$ alone ($\varepsilon_r = 1.452$) is the dilute-gas formula.` },
    { id: 'diel-018', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Drude model', unit: 'nm',
      q: R`Sodium has $2.65\times10^{28}$ free electrons per m$^3$. In the free-electron model it becomes transparent for wavelengths shorter than ______ nm (nearest whole number).`,
      answer: 205, tol: 2, calc: () => 2 * Math.PI * C.c / wp(2.65e28) * 1e9,
      sol: R`$\omega_p = \sqrt{ne^2/\varepsilon_0m} = 9.18\times10^{15}$ rad/s, so $\lambda_p = 2\pi c/\omega_p = 2\pi\times3.00\times10^8/9.18\times10^{15} = 2.05\times10^{-7}$ m $= 205$ nm, close to the measured 210 nm: alkali metals are transparent in the ultraviolet.`,
      trap: R`Using $c/\omega_p$ without the $2\pi$ gives 33 nm.` },
    { id: 'diel-019', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'reststrahlen',
      q: R`An ionic crystal has dielectric function $\varepsilon(\omega) = \varepsilon_\infty\dfrac{\omega_L^2 - \omega^2}{\omega_T^2 - \omega^2}$ (no damping). For $\omega_T < \omega < \omega_L$, infrared light at normal incidence is`,
      options: ['transmitted with no loss', 'totally reflected, because ε is negative and the refractive index is purely imaginary', 'absorbed only at exactly ω = ω_L', 'reflected with R = ((√ε∞ − 1)/(√ε∞ + 1))²'], answer: 1,
      sol: R`Between the poles and zeros, numerator and denominator have opposite signs, so $\varepsilon < 0$. Then $n = i\kappa$ and $r = (i\kappa - 1)/(i\kappa + 1)$ has $|r| = 1$: total reflection. This "reststrahlen" band was used to make narrow-band infrared filters by multiple reflections.`,
      trap: R`At $\omega_L$, $\varepsilon = 0$ (a longitudinal mode), not a peak in absorption; the absorption peak is at $\omega_T$.` },
    { id: 'diel-020', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Lyddane-Sachs-Teller', unit: 'THz',
      q: R`GaAs has $\varepsilon(0) = 12.9$, $\varepsilon(\infty) = 10.9$ and a transverse optical phonon at $8.00$ THz. By the Lyddane-Sachs-Teller relation, the longitudinal optical phonon frequency is ______ THz (two decimal places).`,
      answer: 8.70, tol: 0.01, calc: () => 8 * Math.sqrt(12.9 / 10.9),
      sol: R`$\omega_L^2/\omega_T^2 = \varepsilon(0)/\varepsilon(\infty)$, so $\nu_L = 8.00\sqrt{12.9/10.9} = 8.00\times1.0879 = 8.70$ THz. The split is small because GaAs is only weakly ionic.`,
      trap: 'The ratio of the dielectric constants equals the ratio of squared frequencies.' },
    { id: 'diel-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Kramers-Kronig',
      q: R`The Kramers-Kronig relations connect $\varepsilon'(\omega)$ and $\varepsilon''(\omega)$. They follow from`,
      options: ['energy conservation in the absorber', 'time-reversal symmetry of the microscopic equations', 'causality: the polarisation cannot respond before the field is applied', 'the Lorentz local-field correction'], answer: 2,
      sol: R`Causality makes the response function $\chi(t)$ vanish for $t < 0$, so $\chi(\omega)$ is analytic in the upper half of the complex $\omega$ plane. Cauchy's theorem then gives each part as a principal-value integral of the other, e.g. $\varepsilon'(\omega) - 1 = \dfrac2\pi P\!\int_0^\infty\dfrac{\omega'\varepsilon''(\omega')}{\omega'^2 - \omega^2}d\omega'$.`,
      trap: 'Time reversal gives the parity of each part (ε′ even, ε″ odd in ω), not the integral relations.' },
    { id: 'diel-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'skin depth', unit: 'μm',
      q: R`Copper has DC conductivity $5.8\times10^7$ S/m. At $1.0$ GHz, where $\omega\tau \ll 1$, the skin depth is ______ $\mu$m (two decimal places).`,
      answer: 2.09, tol: 0.01, calc: () => Math.sqrt(2 / (C.mu0 * 5.8e7 * 2 * Math.PI * 1e9)) * 1e6,
      sol: R`$\delta = \sqrt{2/\mu_0\sigma\omega}$. $\mu_0\sigma\omega = 1.2566\times10^{-6}\times5.8\times10^7\times6.283\times10^9 = 4.58\times10^{11}$, so $\delta = \sqrt{4.37\times10^{-12}} = 2.09\times10^{-6}$ m.`,
      trap: 'Using f instead of ω = 2πf makes δ √(2π) times too large.' },
    { id: 'diel-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Debye relaxation',
      q: R`A polar liquid follows Debye relaxation with $\varepsilon_s = 80$ and $\varepsilon_\infty = 5$. The loss tangent $\tan\delta = \varepsilon''/\varepsilon'$ at the frequency where $\varepsilon''$ is largest is ______ (two decimal places).`,
      answer: 0.88, tol: 0.01, calc: () => 37.5 / 42.5,
      sol: R`At $\omega\tau = 1$: $\varepsilon' = \varepsilon_\infty + (\varepsilon_s - \varepsilon_\infty)/2 = 42.5$ and $\varepsilon'' = (\varepsilon_s - \varepsilon_\infty)/2 = 37.5$. $\tan\delta = 37.5/42.5 = 0.88$.`,
      trap: R`$\tan\delta$ is not largest at $\omega\tau = 1$ (it peaks at $\omega\tau = \sqrt{\varepsilon_s/\varepsilon_\infty}$); the question asks at the $\varepsilon''$ peak.` },
    { id: 'diel-024', type: 'mcq', level: 3, exams: ['net'], sub: 'ferroelectrics',
      q: R`In Landau theory of a second-order ferroelectric transition, $F = F_0 + \tfrac12a(T - T_c)P^2 + \tfrac14bP^4 - EP$. At the same distance $|T - T_c|$ below and above $T_c$, the ratio $\chi_{below}/\chi_{above}$ of the susceptibilities is`,
      options: ['2', '1/2', '1', '1/4'], answer: 1,
      sol: R`Above $T_c$: $P = 0$, $1/\chi = \partial^2F/\partial P^2 = a(T - T_c)$. Below: $P_0^2 = a(T_c - T)/b$, and $\partial^2F/\partial P^2 = a(T - T_c) + 3bP_0^2 = 2a(T_c - T)$. So $1/\chi$ has twice the slope below $T_c$, and at equal distance $\chi_{below}/\chi_{above} = 1/2$.`,
      trap: R`The curvature below $T_c$ includes $3bP_0^2$, not $bP_0^2$.` },
    { id: 'diel-025', type: 'msq', level: 3, exams: ['net'], sub: 'crystal classes', format: 'multi',
      q: 'Of the 32 crystallographic point groups, which statements are correct?',
      options: ['Every piezoelectric class is also ferroelectric.', '21 lack a centre of inversion.', '20 of these allow piezoelectricity.', '10 are polar and allow pyroelectricity.'], answer: [1, 2, 3],
      sol: 'A centre of symmetry forbids any property described by an odd-rank tensor, such as piezoelectricity (rank 3) or a spontaneous polarisation (rank 1). Of the 21 non-centrosymmetric classes, 432 has piezoelectric coefficients that vanish by symmetry, leaving 20 piezoelectric classes; the 10 with a unique polar axis can be pyroelectric. Ferroelectricity needs, in addition, a switchable polarisation, which symmetry alone cannot decide.',
      trap: 'Class 432 is non-centrosymmetric but not piezoelectric.' },
    { id: 'diel-026', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'excitons', unit: 'meV',
      q: R`In a semiconductor with $\varepsilon_r = 12.5$ and electron-hole reduced mass $0.060\,m_e$, the hydrogen-like (Wannier) exciton ground-state binding energy is ______ meV (two decimal places).`,
      answer: 5.22, tol: 0.02, calc: () => 13.6057 * 0.06 / 12.5 ** 2 * 1000,
      sol: R`Scale hydrogen: $E_b = 13.606\text{ eV}\times\dfrac{\mu/m_e}{\varepsilon_r^2} = 13.606\times0.060/156.25 = 5.22$ meV. The Bohr radius grows by $\varepsilon_r m_e/\mu = 208$, to 11 nm, so the exciton spans many cells and the continuum model is consistent.`,
      trap: R`The dielectric constant enters squared in the energy (once from each factor of $e^2$ in $\mu e^4/\varepsilon^2$).` },
    { id: 'diel-027', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Lorentz oscillator',
      q: R`For a Lorentz oscillator medium, $\varepsilon(\omega) = 1 + \dfrac{\omega_p^2}{\omega_0^2 - \omega^2 - i\gamma\omega}$. In the narrow band around $\omega_0$ (of width about $\gamma$),`,
      options: ['the refractive index rises with frequency and absorption is negligible', 'the medium is perfectly transparent', 'the refractive index falls with increasing frequency (anomalous dispersion) and absorption is strong', 'the group velocity equals c exactly'], answer: 2,
      sol: R`Away from resonance $n$ rises with $\omega$ (normal dispersion). Within about $\gamma$ of $\omega_0$, $\varepsilon'$ swings from its maximum down through its minimum as $\omega$ increases, so $n$ falls with frequency, while $\varepsilon''$ (absorption) peaks at $\omega_0$. Anomalous dispersion and absorption always go together, as Kramers-Kronig requires.`,
      trap: 'Normal dispersion (n rising with ω, as in glass in the visible) is the behaviour far below an ultraviolet resonance.' },
    { id: 'diel-028', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Clausius-Mossotti',
      q: R`A cubic glass has refractive index $1.50$ in the visible. Using the Lorentz-Lorenz form of the Clausius-Mossotti relation, $N\alpha_e/3\varepsilon_0$ for its electronic polarisability is ______ (three decimal places).`,
      answer: 0.294, tol: 0.001, calc: () => (1.5 ** 2 - 1) / (1.5 ** 2 + 2),
      sol: R`At optical frequencies $\varepsilon_r = n^2 = 2.25$, so $N\alpha_e/3\varepsilon_0 = (n^2 - 1)/(n^2 + 2) = 1.25/4.25 = 0.294$.`,
      trap: R`Putting $n$ instead of $n^2$ into the relation.` },
    { id: 'diel-029', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Lyddane-Sachs-Teller',
      q: R`An ionic crystal has $\varepsilon(\infty) = 3.0$ and its LO phonon frequency is exactly twice its TO phonon frequency. Its static dielectric constant is`,
      options: ['6', '12', '1.5', '0.75'], answer: 1,
      sol: R`LST: $\varepsilon(0) = \varepsilon(\infty)(\omega_L/\omega_T)^2 = 3.0\times4 = 12$. The ionic displacement adds $9$ to the electronic 3 at low frequency.`,
      trap: 'Forgetting to square the frequency ratio gives 6.' },

    // ---------- level 4 ----------
    { id: 'diel-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Drude model', unit: '× 10⁻¹⁴ s',
      q: R`A metal with $8.5\times10^{28}$ free electrons per m$^3$ has DC conductivity $5.9\times10^7$ S/m. The Drude relaxation time is ______ $\times10^{-14}$ s (two decimal places).`,
      answer: 2.46, tol: 0.01, calc: () => ME * 5.9e7 / (8.5e28 * E * E) / 1e-14,
      sol: R`$\sigma_0 = ne^2\tau/m$, so $\tau = m\sigma_0/ne^2 = 9.109\times10^{-31}\times5.9\times10^7/(8.5\times10^{28}\times2.567\times10^{-38}) = 2.46\times10^{-14}$ s. Then $\gamma = 1/\tau = 4.1\times10^{13}$ s$^{-1}$, far below $\omega$ for visible light ($3\times10^{15}$): the "$\omega \gg \gamma$" limit holds in the optical range.`,
      trap: 'Squaring the charge is easy to forget.' },
    { id: 'diel-031', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Debye relaxation', unit: 'GHz',
      q: R`A polar liquid has a Debye relaxation time of $1.0\times10^{-11}$ s. Its dielectric loss is largest at a frequency $f$ = ______ GHz (one decimal place).`,
      answer: 15.9, tol: 0.1, calc: () => 1 / (2 * Math.PI * 1e-11) / 1e9,
      sol: R`The loss peaks at $\omega\tau = 1$: $f = 1/(2\pi\tau) = 1/(6.283\times10^{-11}) = 1.59\times10^{10}$ Hz $= 15.9$ GHz.`,
      trap: R`Reporting $1/\tau$ (100 GHz) mixes angular frequency with frequency.` },
    { id: 'diel-032', type: 'mcq', level: 4, exams: ['net'], sub: 'Debye relaxation',
      q: R`A plot of $\varepsilon''$ against $\varepsilon'$ (Cole-Cole plot) for a single Debye relaxation, as $\omega$ runs from 0 to $\infty$, is`,
      options: [R`a straight line from $\varepsilon_s$ to $\varepsilon_\infty$`, R`a full circle through the origin`, R`a parabola with vertex at $\varepsilon_s$`, R`a semicircle centred at $\left(\tfrac{\varepsilon_s + \varepsilon_\infty}2, 0\right)$ of radius $\tfrac{\varepsilon_s - \varepsilon_\infty}2$`], answer: 3,
      sol: R`Write $x = \omega\tau$: $\varepsilon' - \varepsilon_\infty = \Delta/(1 + x^2)$ and $\varepsilon'' = \Delta x/(1 + x^2)$ with $\Delta = \varepsilon_s - \varepsilon_\infty$. Then $(\varepsilon' - \varepsilon_\infty - \Delta/2)^2 + \varepsilon''^2 = (\Delta/2)^2$: a semicircle from $\varepsilon_s$ (at $\omega = 0$) to $\varepsilon_\infty$ (at $\omega\to\infty$), with its top at $\omega\tau = 1$. A depressed arc signals a spread of relaxation times.`,
      trap: 'Only the upper half is traced because the loss is never negative.' },
    { id: 'diel-033', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'Drude model', format: 'multi',
      q: R`For a Drude metal with $\gamma \ll \omega_p$, which statements are correct?`,
      options: [R`At $\omega = \omega_p$, $\varepsilon' = 1$.`, R`For $\gamma \ll \omega < \omega_p$, $\varepsilon' < 0$.`, R`For $\gamma \ll \omega < \omega_p$, the reflectivity is close to 1.`, R`For $\omega \gg \gamma$, $\varepsilon''$ falls off as $1/\omega^3$.`], answer: [1, 2, 3],
      sol: R`$\varepsilon = 1 - \dfrac{\omega_p^2}{\omega^2 + \gamma^2} + i\dfrac{\omega_p^2\gamma}{\omega(\omega^2 + \gamma^2)}$. For $\omega \gg \gamma$: $\varepsilon' \approx 1 - \omega_p^2/\omega^2$, negative below $\omega_p$ and zero (not 1) at $\omega_p$, while $\varepsilon'' \approx \omega_p^2\gamma/\omega^3$. With $\varepsilon'$ large and negative, $n$ is nearly imaginary and $R \approx 1$.`,
      trap: 'At the plasma frequency ε′ vanishes; that zero is what allows a longitudinal plasma oscillation.' },
    { id: 'diel-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'absorption edge', unit: 'eV',
      q: R`Silicon has an indirect gap of $1.12$ eV; the phonon that supplies the missing crystal momentum has energy $60$ meV. At room temperature, the lowest photon energy that can create an electron-hole pair (by absorbing a phonon) is ______ eV (two decimal places).`,
      answer: 1.06, tol: 0.005, calc: () => 1.12 - 0.06,
      sol: R`Energy: $\hbar\omega \pm \hbar\Omega = E_g$. Absorbing a phonon adds its energy, so $\hbar\omega = E_g - \hbar\Omega = 1.12 - 0.06 = 1.06$ eV. Emitting one needs $1.18$ eV. The absorption branch dies out as $T\to0$ because no phonons are left to absorb.`,
      trap: 'Adding the phonon energy gives the emission threshold, which works at any temperature but is higher.' },
    { id: 'diel-035', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'electronic polarisability', unit: '× 10⁻⁴⁰ F m²',
      q: R`Argon gas at STP ($2.687\times10^{25}$ atoms per m$^3$) has $\varepsilon_r - 1 = 5.2\times10^{-4}$. The polarisability of one argon atom is ______ $\times10^{-40}$ F m$^2$ (two decimal places).`,
      answer: 1.71, tol: 0.01, calc: () => EPS0 * 5.2e-4 / 2.687e25 / 1e-40,
      sol: R`In a dilute gas the local-field correction is negligible: $\varepsilon_r - 1 = N\alpha/\varepsilon_0$, so $\alpha = \varepsilon_0(\varepsilon_r - 1)/N = 8.854\times10^{-12}\times5.2\times10^{-4}/2.687\times10^{25} = 1.71\times10^{-40}$ F m$^2$. As a polarisability volume, $\alpha/4\pi\varepsilon_0 = 1.54\times10^{-30}$ m$^3$, a radius of 0.115 nm.`,
      trap: 'The Clausius-Mossotti factor (εr + 2)/3 is 1.0002 here, so it changes nothing.' },
    { id: 'diel-036', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Drude model',
      q: R`Transverse electromagnetic waves in a collisionless free-electron plasma obey $\omega^2 = \omega_p^2 + c^2k^2$. For $\omega > \omega_p$, the group velocity is`,
      options: [R`$c\sqrt{1 - \omega_p^2/\omega^2}$`, R`$c/\sqrt{1 - \omega_p^2/\omega^2}$`, R`$c$`, R`$c\,\omega_p/\omega$`], answer: 0,
      sol: R`$v_g = d\omega/dk = c^2k/\omega = c\sqrt{\omega^2 - \omega_p^2}/\omega = c\sqrt{1 - \omega_p^2/\omega^2} < c$. The phase velocity is the reciprocal form, greater than $c$, and $v_pv_g = c^2$.`,
      trap: 'The expression larger than c is the phase velocity, which carries no signal.' },
    { id: 'diel-037', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'ferroelectrics', unit: 'K',
      q: R`Above its transition a ferroelectric obeys the Curie-Weiss law $\varepsilon_r \approx C/(T - T_0)$. Measurements give $\varepsilon_r = 1000$ at $410$ K and $500$ at $420$ K. The Curie-Weiss temperature $T_0$ is ______ K.`,
      answer: 400, tol: 0.5, calc: () => (1000 * 410 - 500 * 420) / (1000 - 500),
      sol: R`$C = 1000(410 - T_0) = 500(420 - T_0)$, so $410000 - 1000T_0 = 210000 - 500T_0$ and $T_0 = 400$ K; then $C = 10^4$ K. Plotting $1/\varepsilon_r$ against $T$ gives a straight line hitting zero at $T_0$.`,
      trap: 'The ratio of εr values (2) is the inverse ratio of the distances from T₀, not of the temperatures.' },
    { id: 'diel-038', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'absorption edge', format: 'multi',
      q: 'Which statements about the optical absorption of a pure semiconductor are correct?',
      options: ['An indirect-gap edge needs no phonon, because a photon carries a large momentum.', 'Excitons can produce sharp absorption lines just below the band gap.', 'Phonon-assisted (indirect) absorption is much weaker than direct absorption.', 'For photon energies well below the gap, a thick crystal is transparent.'], answer: [1, 2, 3],
      sol: R`Photons carry tiny momentum ($k \approx 10^7$ m$^{-1}$ against $\pi/a \approx 10^{10}$ m$^{-1}$), so an indirect transition needs a phonon: a second-order process, hence weak (silicon: about $10^3$ to $10^5$ m$^{-1}$ in the first few tenths of an eV above its edge, against about $10^6$ m$^{-1}$ just above the gap of direct-gap GaAs). Bound electron-hole pairs (excitons) absorb at $E_g - E_b/n^2$. Below the gap no transitions are possible, so the crystal is transparent apart from weak free-carrier and phonon absorption.`,
      trap: 'Photon momentum is negligible on the scale of the Brillouin zone.' },

    // ---------- level 5 ----------
    { id: 'diel-039', type: 'nat', level: 5, exams: ['net'], sub: 'Lorentz oscillator',
      q: R`A transparent insulator is modelled by a single undamped Lorentz oscillator: $\varepsilon(\omega) = 1 + \dfrac{\omega_p^2}{\omega_0^2 - \omega^2}$ with $\hbar\omega_p = 15$ eV and $\hbar\omega_0 = 10$ eV. Its refractive index for $5.0$ eV photons is ______ (two decimal places).`,
      answer: 2.00, tol: 0.01, calc: () => Math.sqrt(1 + 225 / (100 - 25)),
      sol: R`$\varepsilon = 1 + 15^2/(10^2 - 5^2) = 1 + 225/75 = 4$, so $n = 2.00$. At zero frequency $\varepsilon = 1 + 2.25 = 3.25$ ($n = 1.80$): the index rises towards the resonance (normal dispersion).`,
      trap: 'The energies can be used directly because only ratios of frequencies appear.' },
    { id: 'diel-040', type: 'nat', level: 5, exams: ['net'], sub: 'Clausius-Mossotti',
      q: R`A non-polar dielectric has $\varepsilon_r = 2.000$. It is compressed so that its density rises by 10%, with the molecular polarisability unchanged. Using the Clausius-Mossotti relation, the new dielectric constant is ______ (three decimal places).`,
      answer: 2.138, tol: 0.001, calc: () => { const x = 1.1 * (1 / 4); return (1 + 2 * x) / (1 - x); },
      sol: R`Before: $x = (\varepsilon_r - 1)/(\varepsilon_r + 2) = 1/4$. $x \propto N$, so after: $x' = 0.275$. $\varepsilon_r' = (1 + 2x')/(1 - x') = 1.55/0.725 = 2.138$. A linear rule $\varepsilon_r - 1\propto N$ would give 2.100; the local field makes the response grow faster than the density.`,
      trap: R`Scaling $\varepsilon_r - 1$ by 1.1 ignores the local field.` },
    { id: 'diel-041', type: 'mcq', level: 5, exams: ['net'], sub: 'sum rules',
      q: R`For any material, the oscillator-strength (f) sum rule for the imaginary part of the dielectric function reads $\displaystyle\int_0^\infty\omega\,\varepsilon''(\omega)\,d\omega = $`,
      options: [R`$\omega_p^2$`, R`$\pi\omega_p^2$`, R`$0$`, R`$\tfrac\pi2\omega_p^2$, with $\omega_p^2 = ne^2/\varepsilon_0m$ for all $n$ electrons per unit volume`], answer: 3,
      sol: R`At very high frequency every electron responds freely, so $\varepsilon \to 1 - \omega_p^2/\omega^2$. Kramers-Kronig, $\varepsilon'(\omega) - 1 = \frac2\pi P\!\int\frac{\omega'\varepsilon''}{\omega'^2 - \omega^2}d\omega'$, behaves as $-\frac2{\pi\omega^2}\int\omega'\varepsilon''d\omega'$ for large $\omega$. Matching gives $\int_0^\infty\omega\varepsilon''d\omega = \frac\pi2\omega_p^2$. It counts electrons: a check on measured optical spectra.`,
      trap: R`For a Drude metal, $\varepsilon''$ alone has a delta function at $\omega = 0$ as $\gamma\to0$; the sum rule still holds with the weight counted there.` },
    { id: 'diel-042', type: 'mcq', level: 5, exams: ['net'], sub: 'reststrahlen',
      q: R`An undamped polar crystal has $\varepsilon(0) = 10$, $\varepsilon(\infty) = 4$ and TO frequency $\omega_T$. The band of total reflection extends from $\omega_T$ to`,
      options: [R`$2.5\,\omega_T$`, R`$1.58\,\omega_T$`, R`$0.63\,\omega_T$`, R`$1.25\,\omega_T$`], answer: 1,
      sol: R`Reflection is total where $\varepsilon < 0$: from the pole at $\omega_T$ to the zero at $\omega_L$. LST: $\omega_L = \omega_T\sqrt{\varepsilon(0)/\varepsilon(\infty)} = \omega_T\sqrt{2.5} = 1.58\,\omega_T$.`,
      trap: R`2.5 is $\omega_L^2/\omega_T^2$; take the square root.` },
  ],
  gens: [
    { id: 'diel-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Clausius-Mossotti',
      make(r) {
        const mode = choose(r, ['eps', 'x', 'alpha']);
        if (mode === 'eps') {
          const x = pick(r, 0.05, 0.6, 0.01), e = (1 + 2 * x) / (1 - x);
          return { q: R`A cubic dielectric has $N\alpha/3\varepsilon_0 = ${x}$. By the Clausius-Mossotti relation its dielectric constant is ______ (three decimal places).`, answer: round(e, 3), tol: Math.max(0.002, round(e * 0.001, 4)), x, mode,
            sol: R`$\varepsilon_r = \dfrac{1 + 2x}{1 - x} = \dfrac{${round(1 + 2 * x, 2)}}{${round(1 - x, 2)}} = ${round(e, 3)}$.`, trap: R`$1 + 3x$ is the answer without the local field.` };
        }
        const e = pick(r, 1.5, 12, 0.1), x = (e - 1) / (e + 2);
        if (mode === 'x') return { q: R`A cubic crystal has static dielectric constant $${e}$. The quantity $N\alpha/3\varepsilon_0$ is ______ (three decimal places).`, answer: round(x, 3), tol: 0.001, e, mode,
          sol: R`$N\alpha/3\varepsilon_0 = (\varepsilon_r - 1)/(\varepsilon_r + 2) = ${round(e - 1, 1)}/${round(e + 2, 1)} = ${round(x, 3)}$. It can never exceed 1; as it nears 1 the crystal approaches the "polarisation catastrophe" of a ferroelectric.`, trap: R`$(\varepsilon_r - 1)/3$ ignores the local field.` };
        const N = pick(r, 1, 9, 0.5), al = 3 * EPS0 * x / (N * 1e28);
        return { q: R`A cubic crystal with $${N}\times10^{28}$ polarisable units per m$^3$ has $\varepsilon_r = ${e}$. By Clausius-Mossotti, the polarisability of one unit is ______ $\times10^{-40}$ F m$^2$ (two decimal places).`, answer: round(al / 1e-40, 2), tol: Math.max(0.01, round(al / 1e-40 * 0.005, 3)), unit: '× 10⁻⁴⁰ F m²', e, N, mode,
          sol: R`$\alpha = \dfrac{3\varepsilon_0}N\,\dfrac{\varepsilon_r - 1}{\varepsilon_r + 2} = \dfrac{3\times8.854\times10^{-12}}{${N}\times10^{28}}\times${round(x, 4)} = ${round(al / 1e-40, 2)}\times10^{-40}$ F m$^2$.`, trap: 'Forgetting the factor 3.' };
      },
      verify: (p) => (p.mode === 'eps' ? (1 + 2 * p.x) / (1 - p.x) : p.mode === 'x' ? (p.e - 1) / (p.e + 2) : 3 * EPS0 * (p.e - 1) / (p.e + 2) / (p.N * 1e28) / 1e-40) },
    { id: 'diel-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Drude model',
      make(r) {
        const n = pick(r, 0.9, 25, 0.1), w = wp(n * 1e28), mode = choose(r, ['E', 'lambda']);
        if (mode === 'E') { const v = HBAR * w / E; return { q: R`A metal has $${n}\times10^{28}$ free electrons per m$^3$. Its free-electron plasmon energy $\hbar\omega_p$ is ______ eV (two decimal places).`, answer: round(v, 2), tol: Math.max(0.01, round(v * 0.004, 3)), unit: 'eV', n, mode,
          sol: R`$\omega_p = \sqrt{ne^2/\varepsilon_0m} = ${sci(w)}$ rad/s; $\hbar\omega_p = ${round(v, 2)}$ eV.`, trap: R`$\hbar\omega_p$, not $h\omega_p$.` }; }
        const l = 2 * Math.PI * C.c / w * 1e9;
        return { q: R`A metal has $${n}\times10^{28}$ free electrons per m$^3$. In the free-electron model it is transparent for wavelengths below ______ nm (nearest whole number).`, answer: Math.round(l), tol: Math.max(1, Math.round(l * 0.004)), unit: 'nm', n, mode,
          sol: R`$\omega_p = \sqrt{ne^2/\varepsilon_0m} = ${sci(w)}$ rad/s, so $\lambda_p = 2\pi c/\omega_p = ${Math.round(l)}$ nm. Shorter wavelengths have $\omega > \omega_p$ and propagate.`, trap: 'Transparency is on the short-wavelength (high-frequency) side.' };
      },
      verify: (p) => (p.mode === 'E' ? HBAR * wp(p.n * 1e28) / E : 2 * Math.PI * C.c / wp(p.n * 1e28) * 1e9) },
    { id: 'diel-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'reflectance', unit: '%',
      make(r) {
        const n = pick(r, 1.3, 4.5, 0.05), k = choose(r, [0, 0, 0.1, 0.5, 1, 2, 3]), Rr = ((n - 1) ** 2 + k * k) / ((n + 1) ** 2 + k * k) * 100;
        return { q: R`A material has complex refractive index $\tilde n = ${n}${k ? R` + ${k}i` : ''}$ at some wavelength. The reflectance at normal incidence from air is ______ % (one decimal place).`,
          answer: round(Rr, 1), tol: Math.max(0.1, round(Rr * 0.005, 2)), n, k,
          sol: R`$R = \dfrac{(n - 1)^2 + \kappa^2}{(n + 1)^2 + \kappa^2} = \dfrac{${round((n - 1) ** 2 + k * k, 4)}}{${round((n + 1) ** 2 + k * k, 4)}} = ${round(Rr / 100, 4)}$, i.e. ${round(Rr, 1)}%.`,
          trap: R`The extinction coefficient adds $\kappa^2$ to both numerator and denominator; strong absorbers reflect strongly.` };
      },
      verify: (p) => ((p.n - 1) ** 2 + p.k ** 2) / ((p.n + 1) ** 2 + p.k ** 2) * 100 },
    { id: 'diel-g04', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Debye relaxation',
      make(r) {
        const es = pick(r, 10, 90, 1), ei = pick(r, 2, 9, 0.5), x = choose(r, [0.25, 0.5, 1, 2, 3, 4]), part = choose(r, ['re', 'im']);
        const d = es - ei, v = part === 're' ? ei + d / (1 + x * x) : d * x / (1 + x * x);
        return { q: R`A dielectric shows a single Debye relaxation with $\varepsilon_s = ${es}$ and $\varepsilon_\infty = ${ei}$. At the frequency where $\omega\tau = ${x}$, the ${part === 're' ? R`real part $\varepsilon'$` : R`loss $\varepsilon''$`} is ______ (two decimal places).`,
          answer: round(v, 2), tol: Math.max(0.01, round(Math.abs(v) * 0.003, 3)), es, ei, x, part,
          sol: R`$\varepsilon' = \varepsilon_\infty + \dfrac{\varepsilon_s - \varepsilon_\infty}{1 + \omega^2\tau^2}$ and $\varepsilon'' = (\varepsilon_s - \varepsilon_\infty)\dfrac{\omega\tau}{1 + \omega^2\tau^2}$. With $\omega\tau = ${x}$, $1 + \omega^2\tau^2 = ${1 + x * x}$, so ${part === 're' ? R`$\varepsilon' = ${ei} + ${d}/${1 + x * x}$` : R`$\varepsilon'' = ${d}\times${x}/${1 + x * x}$`} $= ${round(v, 2)}$.`,
          trap: R`$\varepsilon'$ falls from $\varepsilon_s$ to $\varepsilon_\infty$; $\varepsilon''$ peaks at $\omega\tau = 1$ with height $(\varepsilon_s - \varepsilon_\infty)/2$.` };
      },
      verify: (p) => { const d = p.es - p.ei; return p.part === 're' ? p.ei + d / (1 + p.x * p.x) : d * p.x / (1 + p.x * p.x); } },
    { id: 'diel-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Lyddane-Sachs-Teller',
      make(r) {
        const e0 = pick(r, 4, 30, 0.1), ei = Math.max(1.5, round(e0 / pick(r, 1.1, 3, 0.05), 1)), nT = pick(r, 2, 15, 0.1), mode = choose(r, ['L', 'e0']);
        const nL = nT * Math.sqrt(e0 / ei);
        if (mode === 'L') return { q: R`A polar crystal has $\varepsilon(0) = ${e0}$, $\varepsilon(\infty) = ${ei}$ and a TO phonon at $${nT}$ THz. Its LO phonon frequency is ______ THz (two decimal places).`, answer: round(nL, 2), tol: Math.max(0.01, round(nL * 0.003, 3)), unit: 'THz', e0, ei, nT, mode,
          sol: R`LST: $\nu_L = \nu_T\sqrt{\varepsilon(0)/\varepsilon(\infty)} = ${nT}\times\sqrt{${round(e0 / ei, 4)}} = ${round(nL, 2)}$ THz.`, trap: 'Square root of the ratio of dielectric constants.' };
        const nL2 = round(nL, 2), e02 = ei * (nL2 / nT) ** 2;
        return { q: R`Infrared reflectivity of a polar crystal shows a reststrahlen band from $${nT}$ THz to $${nL2}$ THz, and its high-frequency dielectric constant is $${ei}$. Its static dielectric constant is ______ (two decimal places).`, answer: round(e02, 2), tol: Math.max(0.01, round(e02 * 0.003, 3)), ei, nT, nL2, mode,
          sol: R`The band runs from $\omega_T$ to $\omega_L$. LST: $\varepsilon(0) = \varepsilon(\infty)(\nu_L/\nu_T)^2 = ${ei}\times(${nL2}/${nT})^2 = ${round(e02, 2)}$.`, trap: 'The band edges are the TO (lower) and LO (upper) frequencies.' };
      },
      verify: (p) => (p.mode === 'L' ? p.nT * Math.sqrt(p.e0 / p.ei) : p.ei * (p.nL2 / p.nT) ** 2) },
    { id: 'diel-g06', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'excitons',
      make(r) {
        const er = pick(r, 5, 16, 0.1), mu = pick(r, 0.03, 0.4, 0.01), mode = choose(r, ['E', 'a']);
        if (mode === 'E') { const v = 13.6057 * mu / er ** 2 * 1000; return { q: R`A semiconductor has $\varepsilon_r = ${er}$ and exciton reduced mass $${mu}\,m_e$. The 1s Wannier exciton binding energy is ______ meV (two decimal places).`, answer: round(v, 2), tol: Math.max(0.01, round(v * 0.004, 3)), unit: 'meV', er, mu, mode,
          sol: R`$E_b = 13.606\text{ eV}\times(\mu/m_e)/\varepsilon_r^2 = 13.606\times${mu}/${round(er * er, 2)} = ${round(v, 2)}$ meV.`, trap: R`$\varepsilon_r$ appears squared in the energy.` }; }
        const v = 0.0529177 * er / mu;
        return { q: R`A semiconductor has $\varepsilon_r = ${er}$ and exciton reduced mass $${mu}\,m_e$. The exciton Bohr radius is ______ nm (two decimal places).`, answer: round(v, 2), tol: Math.max(0.01, round(v * 0.004, 3)), unit: 'nm', er, mu, mode,
          sol: R`$a^* = a_0\,\varepsilon_r\,m_e/\mu = 0.0529\times${er}/${mu} = ${round(v, 2)}$ nm, many lattice constants: a Wannier (large) exciton.`, trap: R`The radius grows with $\varepsilon_r$ to the first power only.` };
      },
      verify: (p) => (p.mode === 'E' ? 13.6057 * p.mu / p.er ** 2 * 1000 : 0.0529177 * p.er / p.mu) },
    { id: 'diel-g07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'skin depth', unit: 'μm',
      make(r) {
        const [name, s] = choose(r, [['copper', 5.96e7], ['aluminium', 3.77e7], ['silver', 6.30e7], ['gold', 4.10e7], ['brass', 1.5e7], ['stainless steel', 1.4e6]]);
        const [fl, f] = choose(r, [['50 Hz', 50], ['10 kHz', 1e4], ['1 MHz', 1e6], ['100 MHz', 1e8], ['1 GHz', 1e9], ['10 GHz', 1e10]]);
        const d = Math.sqrt(2 / (C.mu0 * s * 2 * Math.PI * f)) * 1e6;
        return { q: R`The DC conductivity of ${name} is $${sci(s, 2)}$ S/m. At ${fl} (well below the plasma and collision frequencies), the skin depth is ______ $\mu$m (three significant figures).`,
          answer: +d.toPrecision(3), tol: +(d * 0.006).toPrecision(2), s, f,
          sol: R`$\delta = \sqrt{2/\mu_0\sigma\omega}$ with $\omega = 2\pi\times${sci(f, 0)}$ rad/s: $\delta = \sqrt{2/(1.2566\times10^{-6}\times${sci(s, 2)}\times${sci(2 * Math.PI * f, 3)})} = ${d.toPrecision(3)}\ \mu$m.`,
          trap: R`Use $\omega = 2\pi f$; and $\delta \propto 1/\sqrt f$, so a hundred times the frequency gives a tenth of the depth.` };
      },
      verify: (p) => Math.sqrt(2 / (C.mu0 * p.s * 2 * Math.PI * p.f)) * 1e6 },
    { id: 'diel-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'ferroelectrics', unit: 'K',
      make(r) {
        const T0 = pick(r, 280, 750, 5), Cc = pick(r, 0.5, 2, 0.1) * 1e5, d1 = pick(r, 5, 30, 1), d2 = d1 + pick(r, 5, 40, 1);
        const e1 = Math.round(Cc / d1), e2 = Math.round(Cc / d2), T1 = T0 + d1, T2 = T0 + d2;
        const T0c = (e1 * T1 - e2 * T2) / (e1 - e2);
        return { q: R`Above its Curie point a ferroelectric has $\varepsilon_r = ${e1}$ at $${T1}$ K and $\varepsilon_r = ${e2}$ at $${T2}$ K. Assuming the Curie-Weiss law $\varepsilon_r = C/(T - T_0)$, $T_0$ is ______ K (one decimal place).`,
          answer: round(T0c, 1), tol: 0.3, e1, e2, T1, T2,
          sol: R`$e_1(T_1 - T_0) = e_2(T_2 - T_0)$ gives $T_0 = \dfrac{e_1T_1 - e_2T_2}{e_1 - e_2} = \dfrac{${e1}\times${T1} - ${e2}\times${T2}}{${e1 - e2}} = ${round(T0c, 1)}$ K.`,
          trap: R`It is $1/\varepsilon_r$, not $\varepsilon_r$, that is linear in $T$.` };
      },
      verify: (p) => (p.e1 * p.T1 - p.e2 * p.T2) / (p.e1 - p.e2) },
    { id: 'diel-g09', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'polarisation mechanisms',
      make(r) {
        const [fl, ans] = choose(r, [['1 kHz', 'electronic, ionic and orientational'], ['1 MHz', 'electronic, ionic and orientational'], ['100 THz (infrared above the phonon bands)', 'electronic only'], ['600 THz (visible light)', 'electronic only'], ['5 THz (in the far infrared, below the TO phonon)', 'electronic and ionic'], ['10¹⁹ Hz (hard X-rays)', 'essentially none: εr is very close to 1']]);
        const all = ['electronic, ionic and orientational', 'electronic and ionic', 'electronic only', 'essentially none: εr is very close to 1', 'ionic and orientational only', 'orientational only'];
        const o = mcqOptions(r, ans, all.filter((a) => a !== ans));
        return { q: `A polar ionic solid (with permanent molecular dipoles that can rotate, relaxing near 10 GHz) is placed in an alternating field of ${fl}. Which polarisation mechanisms contribute to its dielectric constant?`, ...o,
          sol: 'A mechanism contributes only below its natural frequency: orientation relaxes near 10⁹ to 10¹¹ Hz, ionic vibrations resonate at 10¹² to 10¹³ Hz (the TO phonons) and electrons in the ultraviolet near 10¹⁵ to 10¹⁶ Hz. Far above all of them (X-rays) every charge is effectively free and εr = 1 − ωp²/ω² is just below 1. So at ' + fl + ' the answer is: ' + ans + '.',
          trap: 'The slowest mechanism (orientation) is the first to drop out as frequency rises.' };
      } },
    { id: 'diel-g10', type: 'nat', level: 4, exams: ['net'], sub: 'Lorentz oscillator',
      make(r) {
        const Ep = pick(r, 8, 25, 0.5), E0 = pick(r, 6, 15, 0.5), f = choose(r, [0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]), Eph = round(E0 * f, 2);
        const eps = 1 + Ep * Ep / (E0 * E0 - Eph * Eph), n = Math.sqrt(eps);
        return { q: R`An insulator is described by one undamped Lorentz oscillator with $\hbar\omega_0 = ${E0}$ eV and oscillator plasma energy $\hbar\omega_p = ${Ep}$ eV: $\varepsilon = 1 + \omega_p^2/(\omega_0^2 - \omega^2)$. Its refractive index ${Eph ? R`for $${Eph}$ eV photons` : 'at low frequency (static limit)'} is ______ (three decimal places).`,
          answer: round(n, 3), tol: Math.max(0.002, round(n * 0.001, 4)), Ep, E0, Eph,
          sol: R`$\varepsilon = 1 + \dfrac{${Ep}^2}{${E0}^2 - ${Eph}^2} = 1 + \dfrac{${round(Ep * Ep, 2)}}{${round(E0 * E0 - Eph * Eph, 4)}} = ${round(eps, 4)}$, so $n = \sqrt\varepsilon = ${round(n, 3)}$.`,
          trap: 'Energies stand in for frequencies because only ratios enter.' };
      },
      verify: (p) => Math.sqrt(1 + p.Ep ** 2 / (p.E0 ** 2 - p.Eph ** 2)) },
    { id: 'diel-g11', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'optical constants',
      make(r) {
        const lam = pick(r, 300, 1200, 10), mode = choose(r, ['alpha', 'kappa', 'depth']);
        if (mode === 'kappa') { const a = pick(r, 1, 90, 1) * 1e5, k = a * lam * 1e-9 / (4 * Math.PI); return { q: R`At a vacuum wavelength of $${lam}$ nm a semiconductor has intensity absorption coefficient $${sci(a, 1)}$ m$^{-1}$. Its extinction coefficient $\kappa$ is ______ (four decimal places).`, answer: round(k, 4), tol: Math.max(0.0001, round(k * 0.004, 5)), lam, a, mode,
          sol: R`$\alpha = 4\pi\kappa/\lambda$, so $\kappa = \alpha\lambda/4\pi = ${sci(a, 1)}\times${lam}\times10^{-9}/4\pi = ${round(k, 4)}$.`, trap: 'Use the vacuum wavelength.' }; }
        const k = pick(r, 0.001, 0.5, 0.001), a = 4 * Math.PI * k / (lam * 1e-9);
        if (mode === 'alpha') return { q: R`A material has extinction coefficient $\kappa = ${k}$ at $${lam}$ nm (vacuum). Its intensity absorption coefficient is ______ $\times10^6$ m$^{-1}$ (three decimal places).`, answer: round(a / 1e6, 3), tol: Math.max(0.001, round(a / 1e6 * 0.003, 4)), unit: '× 10⁶ m⁻¹', lam, k, mode,
          sol: R`$\alpha = 4\pi\kappa/\lambda = 4\pi\times${k}/(${lam}\times10^{-9}) = ${round(a / 1e6, 3)}\times10^6$ m$^{-1}$.`, trap: 'Intensity decays twice as fast as the field.' };
        const dd = 1 / a * 1e9;
        return { q: R`A material has extinction coefficient $\kappa = ${k}$ at $${lam}$ nm (vacuum). The depth at which the light intensity falls to $1/e$ of its value just inside the surface is ______ nm (one decimal place).`, answer: round(dd, 1), tol: Math.max(0.1, round(dd * 0.003, 2)), unit: 'nm', lam, k, mode,
          sol: R`Intensity falls as $e^{-\alpha z}$ with $\alpha = 4\pi\kappa/\lambda$, so the $1/e$ depth is $\lambda/4\pi\kappa = ${lam}/(4\pi\times${k}) = ${round(dd, 1)}$ nm.`, trap: R`$\lambda/2\pi\kappa$ is the field's decay length, twice as long.` };
      },
      verify: (p) => (p.mode === 'kappa' ? p.a * p.lam * 1e-9 / (4 * Math.PI) : p.mode === 'alpha' ? 4 * Math.PI * p.k / (p.lam * 1e-9) / 1e6 : p.lam / (4 * Math.PI * p.k)) },
    { id: 'diel-g12', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'Drude model',
      make(r) {
        const n = pick(r, 1, 20, 0.5), lp = 2 * Math.PI * C.c / wp(n * 1e28) * 1e9, lam = choose(r, [Math.round(lp * pick(r, 0.4, 0.8, 0.1)), Math.round(lp * pick(r, 1.3, 3, 0.1))]);
        const tr = lam < lp, ans = tr ? 'transmitted (the metal is transparent at this wavelength)' : 'almost totally reflected';
        const o = mcqOptions(r, ans, [tr ? 'almost totally reflected' : 'transmitted (the metal is transparent at this wavelength)', 'totally absorbed at the surface, with no reflection', 'reflected only if the electrons collide often (large γ)']);
        return { q: R`A thin film of a free-electron metal has $${n}\times10^{28}$ conduction electrons per m$^3$ and negligible damping. Light of vacuum wavelength $${lam}$ nm falls on it. The light is mainly`, ...o,
          sol: R`$\lambda_p = 2\pi c/\omega_p$ with $\omega_p = \sqrt{ne^2/\varepsilon_0m}$ gives $\lambda_p = ${Math.round(lp)}$ nm. ${tr ? R`Here $\lambda < \lambda_p$, so $\omega > \omega_p$, $\varepsilon > 0$ and the wave propagates.` : R`Here $\lambda > \lambda_p$, so $\omega < \omega_p$, $\varepsilon < 0$, $n$ is imaginary and $R\approx1$.`}`,
          trap: 'Short wavelengths (high frequencies) get through; long ones are reflected.' };
      } },
    ...more,
  ],
};
