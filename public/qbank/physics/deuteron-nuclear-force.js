// The deuteron and the nuclear force (CSIR NET Part C / GATE level): deuteron quantum numbers, binding energy and
// size, the square-well model (depth, tail, probability outside the range), S-D mixing from the magnetic moment and
// quadrupole moment, the tensor force, the generalised Pauli principle and allowed two-nucleon states, isospin and
// charge independence, spin dependence, low-energy n-p scattering (scattering lengths, effective range, Wigner's
// argument), photodisintegration and radiative capture, Yukawa's meson theory, the repulsive core and saturation.
// Original questions for fibub.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
import more from './deuteron-nuclear-force.more.gen.js';
import more2 from './deuteron-nuclear-force.more2.gen.js';
import r4 from './deuteron-nuclear-force.r4.gen.js';

const R = String.raw;
const HC = 197.327, MN = 938.92, MU = MN / 2;     // MeV fm; nucleon mass (average) and n-p reduced mass in MeV
const MUP = 2.7928, MUN = -1.9130;                // nucleon moments in nuclear magnetons
const kap = (B) => Math.sqrt(2 * MU * B) / HC;    // fm^-1
/** Square-well (radius Rw fm) bound S state of binding B MeV: wave number inside, depth and probability outside. */
function well(Rw, B) {
  const ka = kap(B);
  let lo = Math.PI / (2 * Rw), hi = Math.PI / Rw - 1e-9;
  for (let i = 0; i < 80; i++) { const k = (lo + hi) / 2; if (k / Math.tan(k * Rw) + ka > 0) lo = k; else hi = k; }
  const k = lo, s = Math.sin(k * Rw) ** 2 / (2 * ka), inn = Rw / 2 - Math.sin(2 * k * Rw) / (4 * k);
  return { k, ka, V0: (HC * k) ** 2 / (2 * MU) + B, pout: s / (s + inn) };
}
const W = well(2.1, 2.2246);

export default {
  topic: 'deuteron-nuclear-force',
  items: [
    // ---------- level 1 ----------
    { id: 'deut-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'deuteron',
      q: R`The spin and parity $J^\pi$ of the deuteron ground state are`,
      options: [R`$0^+$`, R`$1^+$`, R`$1^-$`, R`$2^+$`], answer: 1,
      sol: R`Measured $J = 1$. Proton and neutron spins are parallel ($S = 1$) in a mainly $L = 0$ state, with a little $L = 2$; both have parity $(-1)^L = +1$. So $J^\pi = 1^+$.`,
      trap: R`$0^+$ would be the spin-singlet np state, which is not bound.` },
    { id: 'deut-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'deuteron',
      q: 'How many bound excited states does the deuteron have?',
      options: ['One, at 2.2 MeV', 'Two', 'None: the ground state is its only bound state', 'Infinitely many, as in hydrogen'], answer: 2,
      sol: R`The deuteron is bound by only 2.22 MeV, a few per cent of the well depth. There is no room for a second bound level, and the spin-singlet np state just misses binding (a virtual state about 66 keV above threshold). Everything about the deuteron is learned from its ground state and from scattering.`,
      trap: 'The short-range nuclear well has finitely many levels, unlike the Coulomb potential.' },
    { id: 'deut-003', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'binding energy', unit: 'MeV',
      q: R`Using $m_p = 1.007276$ u, $m_n = 1.008665$ u and the deuteron (nucleus) mass $2.013553$ u, with $1$ u $= 931.494$ MeV/$c^2$, the deuteron binding energy is ______ MeV (three decimal places).`,
      answer: 2.224, tol: 0.002, calc: () => (1.007276 + 1.008665 - 2.013553) * 931.494,
      sol: R`$\Delta m = 1.007276 + 1.008665 - 2.013553 = 0.002388$ u. $B = 0.002388\times931.494 = 2.224$ MeV: about 1.1 MeV per nucleon, far below the 8 MeV typical of heavier nuclei.`,
      trap: 'With atomic masses, use hydrogen (not the bare proton) so the electron masses cancel.' },
    { id: 'deut-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'Yukawa theory',
      q: 'In Yukawa\'s picture the long-range part of the nuclear force comes from exchange of pions. The range this gives is about',
      options: ['0.01 fm', '1.4 fm', '14 fm', '140 fm'], answer: 1,
      sol: R`A virtual particle of mass $m$ can exist for $\Delta t\sim\hbar/mc^2$ and travel about $\hbar/mc$. For the pion, $\hbar c/m_\pi c^2 = 197.3/139.6 = 1.41$ fm, the range of the nuclear force.`,
      trap: 'Using the nucleon mass instead of the pion mass gives 0.21 fm.' },
    { id: 'deut-005', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'tensor force',
      q: 'The deuteron has a small positive electric quadrupole moment. This shows that',
      options: ['the nuclear force is purely central', 'the proton and neutron are in a pure S state', 'the deuteron is spherical', 'the nuclear force has a non-central (tensor) part that mixes in a D state'], answer: 3,
      sol: R`A pure $L = 0$ state is spherical: zero quadrupole moment. A central force conserves $L$, so it cannot mix in $L = 2$. The measured $Q = +0.286$ fm$^2$ (a slightly prolate, cigar shape along the spin) needs a force that depends on the angle between the spins and $\hat r$: the tensor force.`,
      trap: 'A positive Q means prolate (elongated along the spin), not oblate.' },
    { id: 'deut-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'charge independence',
      q: 'Charge independence of the nuclear force means that',
      options: ['the force between two nucleons does not depend on whether they are pp, nn or np, in the same quantum state', 'the nuclear force ignores electric charge but depends on spin only', 'protons and neutrons have the same charge inside nuclei', 'the Coulomb force is negligible in all nuclei'], answer: 0,
      sol: R`Compared in the same space-spin state (e.g. $^1S_0$), the pp, nn and np nuclear forces are nearly equal once the Coulomb force is removed. In isospin language the force depends on total isospin $T$ but not on $T_3$. (Charge symmetry is the weaker statement pp = nn.)`,
      trap: 'The np force in the deuteron (triplet) differs from pp because the state differs, not because of charge.' },

    // ---------- level 2 ----------
    { id: 'deut-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Yukawa theory', unit: 'fm',
      q: R`Estimate the range $\hbar/m_\pi c$ of the force from charged-pion exchange ($m_{\pi^\pm}c^2 = 139.57$ MeV, $\hbar c = 197.33$ MeV fm), to three decimal places.`,
      answer: 1.414, tol: 0.002, calc: () => 197.33 / 139.57,
      sol: R`$\hbar/m_\pi c = \hbar c/m_\pi c^2 = 197.33/139.57 = 1.414$ fm, the Compton wavelength (divided by $2\pi$) of the pion.`,
      trap: R`Using $hc$ instead of $\hbar c$ gives $2\pi$ times too long a range.` },
    { id: 'deut-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'deuteron size', unit: 'fm',
      q: R`Outside the range of the force the deuteron wavefunction falls as $u(r)\propto e^{-\kappa r}$ with $\kappa = \sqrt{2\mu B}/\hbar$, where $\mu = m_N/2$ ($m_Nc^2 = 938.9$ MeV) and $B = 2.225$ MeV. The decay length $1/\kappa$ is ______ fm (two decimal places).`,
      answer: 4.32, tol: 0.01, calc: () => HC / Math.sqrt(938.9 * 2.225),
      sol: R`$2\mu c^2 = m_Nc^2 = 938.9$ MeV, so $\hbar c\,\kappa = \sqrt{938.9\times2.225} = 45.71$ MeV and $1/\kappa = 197.33/45.71 = 4.32$ fm, about three times the range of the force: the deuteron is a loose, extended system.`,
      trap: R`The reduced mass is $m_N/2$; with the full nucleon mass in place of $2\mu$ you would be off by $\sqrt2$.` },
    { id: 'deut-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'two-nucleon states',
      q: R`Which orbital-spin states can combine to give the deuteron's $J^\pi = 1^+$ with $T = 0$?`,
      options: [R`$^1S_0$ and $^3P_1$`, R`$^3S_1$ and $^1P_1$`, R`$^3S_1$ and $^3D_1$`, R`$^3P_1$ and $^1D_2$`], answer: 2,
      sol: R`Parity $+$ needs even $L$. For np with $T = 0$, the generalised Pauli principle $(-1)^{L+S+T} = -1$ needs $L + S$ odd: with even $L$, $S = 1$. Then $J = 1$ allows $L = 0$ or $2$: $^3S_1$ and $^3D_1$. The tensor force mixes them.`,
      trap: R`$^1P_1$ has $J = 1$ but odd parity.` },
    { id: 'deut-010', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'spin dependence',
      q: 'There is no bound dineutron (nn). The main reason is that',
      options: ['the Pauli principle forbids the nn ³S₁ state, and the ¹S₀ force is just too weak to bind', 'neutrons do not feel the nuclear force', 'the Coulomb force pushes the neutrons apart', 'the nn force is always repulsive'], answer: 0,
      sol: R`Two identical neutrons in a relative S state must have an antisymmetric spin state, $S = 0$. The $^1S_0$ nuclear force is strongly attractive but just fails to bind (scattering length $-18.9$ fm, a virtual state). The binding $^3S_1$ state is available only to np, which is why the deuteron exists. This is spin dependence of the nuclear force.`,
      trap: 'Neutrons are neutral; the Coulomb force plays no role for nn.' },
    { id: 'deut-011', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'photodisintegration', unit: 'keV',
      q: R`A gamma ray splits a deuteron at rest ($B = 2.2246$ MeV, $M_dc^2 = 1875.6$ MeV). The threshold photon energy exceeds $B$ by the recoil term $B^2/2M_dc^2$, which is ______ keV (two decimal places).`,
      answer: 1.32, tol: 0.01, calc: () => 2.2246 ** 2 / (2 * 1875.6) * 1000,
      sol: R`At threshold the products move off together with the photon's momentum $E_\gamma/c$, carrying kinetic energy $E_\gamma^2/2M_dc^2 \approx B^2/2M_dc^2 = 4.949/3751.2$ MeV $= 1.32$ keV. So $E_\gamma^{th} = 2.2259$ MeV.`,
      trap: 'Recoil is small but measurable; the 2.22 MeV capture gamma from n + p → d + γ is lower by the same amount.' },
    { id: 'deut-012', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'spin dependence',
      q: R`For two spin-1/2 nucleons, the operator $\vec\sigma_1\cdot\vec\sigma_2$ has eigenvalues`,
      options: [R`$+1$ in the triplet and $-3$ in the singlet`, R`$+3$ in the triplet and $-1$ in the singlet`, R`$1/4$ in the triplet and $-3/4$ in the singlet`, R`$0$ in both`], answer: 0,
      sol: R`$\vec S = \tfrac\hbar2(\vec\sigma_1 + \vec\sigma_2)$, so $\vec\sigma_1\cdot\vec\sigma_2 = \tfrac2{\hbar^2}S^2 - 3 = 2S(S+1) - 3$: $+1$ for $S = 1$, $-3$ for $S = 0$. A term $V_\sigma(r)\vec\sigma_1\cdot\vec\sigma_2$ makes the force spin dependent.`,
      trap: R`$1/4$ and $-3/4$ are the eigenvalues of $\vec s_1\cdot\vec s_2/\hbar^2$, a quarter of these.` },
    { id: 'deut-013', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'nuclear force', format: 'multi',
      q: 'Which are properties of the nucleon-nucleon force?',
      options: ['It has a short range, of order 1 to 2 fm.', 'It is independent of the spins of the nucleons.', 'It saturates: each nucleon binds only to a few neighbours.', 'It becomes strongly repulsive at separations below about 0.5 fm.'], answer: [0, 2, 3],
      sol: R`Short range: nuclei barely feel each other beyond a few fm, and the force falls off as $e^{-r/1.4\text{ fm}}$. Saturation: $B/A \approx 8$ MeV for all but light nuclei and the density is constant, which needs a repulsive core and exchange character. Spin dependence is clear: the np triplet is bound, the singlet is not.`,
      trap: 'Spin independence is ruled out by the deuteron itself (bound only in S = 1).' },
    { id: 'deut-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'magnetic moment', unit: 'μN',
      q: R`If the deuteron were a pure $^3S_1$ state, its magnetic moment would be $\mu_p + \mu_n$. With $\mu_p = 2.7928\,\mu_N$ and $\mu_n = -1.9130\,\mu_N$, this is ______ $\mu_N$ (three decimal places).`,
      answer: 0.880, tol: 0.001, calc: () => MUP + MUN,
      sol: R`With $L = 0$ only the spins contribute, and with both spins aligned along $J$: $\mu = \mu_p + \mu_n = 2.7928 - 1.9130 = 0.8798\,\mu_N$. The measured $0.8574\,\mu_N$ is 2.5% smaller, a sign of the D state.`,
      trap: 'The neutron moment is negative; adding magnitudes gives 4.7 μN.' },
    { id: 'deut-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'radiative capture',
      q: 'Slow neutrons are captured by protons in water: n + p → d + γ. The gamma ray energy is close to',
      options: ['0.511 MeV', '1.11 MeV', '2.22 MeV', '4.45 MeV'], answer: 2,
      sol: R`The neutron brings almost no kinetic energy, so the photon carries the binding energy, $2.224$ MeV, less a recoil of about 1.3 keV. This line is used to calibrate gamma detectors and to measure the deuteron binding energy precisely.`,
      trap: 'Half the binding energy (1.11 MeV) is the binding per nucleon.' },
    { id: 'deut-016', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'isospin',
      q: 'The total isospin of the deuteron is',
      options: ['T = 1, like the pp and nn systems', 'T = 0', 'T = 1/2, like a single nucleon', 'not defined, because the deuteron contains different particles'], answer: 1,
      sol: R`The two-nucleon state must be antisymmetric overall: $(-1)^{L+S+T} = -1$. The deuteron has $L = 0$ (mainly) and $S = 1$, so $T$ must be even: $T = 0$, the antisymmetric isospin singlet $(pn - np)/\sqrt2$. There are no $T = 0$ pp or nn states, so no partners exist.`,
      trap: R`$T_3 = 0$ for any np pair, but $T$ can be 0 or 1; the deuteron is $T = 0$.` },

    // ---------- level 3 ----------
    { id: 'deut-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'square well', unit: 'MeV',
      q: R`Model the np force as an attractive square well of radius $2.0$ fm. The smallest depth that can hold an $L = 0$ bound state (binding energy tending to zero) is ______ MeV (one decimal place). Use $\mu c^2 = 469.5$ MeV and $\hbar c = 197.3$ MeV fm.`,
      answer: 25.6, tol: 0.1, calc: () => Math.PI ** 2 * 197.3 ** 2 / (8 * 469.5 * 4),
      sol: R`Inside $u = A\sin kr$; at zero binding the outside solution is flat, so $u'(R) = 0$: $kR = \pi/2$. With $k = \sqrt{2\mu V_0}/\hbar$: $V_0 = \dfrac{\pi^2(\hbar c)^2}{8\mu c^2R^2} = \dfrac{9.870\times38927}{8\times469.5\times4.0} = 25.6$ MeV.`,
      trap: R`A 3D well, unlike a 1D one, needs a minimum depth to bind: $kR$ must reach $\pi/2$.` },
    { id: 'deut-018', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'square well',
      q: R`For a square well of radius about 2.1 fm that reproduces $B = 2.22$ MeV, the depth comes out near 34 MeV, and the inside wave number satisfies $kR$ slightly above $\pi/2$. What does this say?`,
      options: ['The deuteron is deeply bound, with most of its wavefunction inside the well', 'The deuteron is barely bound: the well only just manages to turn the wavefunction over, and most of the probability lies outside the range of the force', 'The well must be repulsive', 'There must be a second bound state'], answer: 1,
      sol: R`A second level would need $kR \ge 3\pi/2$, far away. With $kR$ just past $\pi/2$ the wavefunction hardly bends down inside, joins a slowly decaying tail ($1/\kappa = 4.3$ fm) and spends about 60% of its time outside $r = R$. A loose system: the deuteron's rms radius (about 2 fm for the matter, 4 fm for np separation) is large.`,
      trap: 'A 34 MeV well with a 2.2 MeV binding means the state is near the top, not the bottom.' },
    { id: 'deut-019', type: 'nat', level: 3, exams: ['net'], sub: 'D state', unit: '%',
      q: R`For a $^3S_1$ + $^3D_1$ mixture with D probability $P_D$, the deuteron moment is $\mu_d = \mu_S - \tfrac32P_D(\mu_S - \tfrac12)$, with $\mu_S = \mu_p + \mu_n = 0.8798\,\mu_N$. The measured value is $0.8574\,\mu_N$. Then $P_D$ = ______ % (one decimal place).`,
      answer: 3.9, tol: 0.05, calc: () => (0.8798 - 0.8574) / (1.5 * (0.8798 - 0.5)) * 100,
      sol: R`$P_D = \dfrac{\mu_S - \mu_d}{\tfrac32(\mu_S - \tfrac12)} = \dfrac{0.0224}{1.5\times0.3798} = 0.039$: about 4% D state. (In the D state with $L = 2$, $S = 1$, $J = 1$ the spins point partly against $J$ and the orbital part contributes $g_L = 1/2$ for the proton's share.) Meson-exchange currents make this only an estimate, but the quadrupole moment points to the same few per cent.`,
      trap: 'The measured moment is smaller than μp + μn; a positive P_D lowers it.' },
    { id: 'deut-020', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'n-p scattering', unit: 'b',
      q: R`The np scattering lengths are $a_s = -23.7$ fm (singlet) and $a_t = 5.4$ fm (triplet). Weighting the spin states statistically, the zero-energy np cross section is ______ barn (one decimal place).`,
      answer: 20.4, tol: 0.1, calc: () => 4 * Math.PI * (0.25 * 23.7 ** 2 + 0.75 * 5.4 ** 2) / 100,
      sol: R`At zero energy $\sigma = 4\pi a^2$ for each channel. Unpolarised: $\tfrac14$ singlet and $\tfrac34$ triplet, $\sigma = \pi(a_s^2 + 3a_t^2) = \pi(561.7 + 87.5) = 2039$ fm$^2 = 20.4$ b (1 b $= 100$ fm$^2$). The large value comes from the singlet: Wigner's evidence for spin dependence.`,
      trap: 'Averaging the scattering lengths before squaring, or forgetting the 1/4 and 3/4 weights.' },
    { id: 'deut-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'n-p scattering',
      q: R`The np singlet scattering length is large and negative ($-23.7$ fm). This means that the $^1S_0$ np system`,
      options: ['is strongly repulsive', 'has a deeply bound state', 'is not bound, but has a virtual state just above zero energy (the attraction just fails to bind)', 'has no interaction at low energy'], answer: 2,
      sol: R`For an attractive well, $a$ goes from small negative values (weak), through $-\infty$ as the well becomes just strong enough to bind, to large positive values (a weakly bound state with $a\approx1/\kappa$). Large negative $a$ means just short of binding: a virtual state. The triplet $a_t = +5.4$ fm goes with the bound deuteron.`,
      trap: 'The sign of a, not its size, tells bound (positive) from unbound (negative) for an attractive well.' },
    { id: 'deut-022', type: 'mcq', level: 3, exams: ['net'], sub: 'tensor force',
      q: R`The tensor operator in the nucleon-nucleon potential is`,
      options: [R`$S_{12} = \vec\sigma_1\cdot\vec\sigma_2$`, R`$S_{12} = \vec L\cdot\vec S$`, R`$S_{12} = (\vec\sigma_1\cdot\hat r)(\vec\sigma_2\cdot\hat r)$`, R`$S_{12} = 3(\vec\sigma_1\cdot\hat r)(\vec\sigma_2\cdot\hat r) - \vec\sigma_1\cdot\vec\sigma_2$`], answer: 3,
      sol: R`$S_{12}$ has the same form as the interaction of two magnetic dipoles. Subtracting $\vec\sigma_1\cdot\vec\sigma_2$ makes its average over all directions $\hat r$ vanish, so it is a pure rank-2 tensor in the space variables: it acts only for $S = 1$, connects $L$ with $L\pm2$ and conserves $J$ and parity. One-pion exchange contains it with strength comparable to its central part.`,
      trap: R`$(\vec\sigma_1\cdot\hat r)(\vec\sigma_2\cdot\hat r)$ alone has a non-zero angular average (a central piece).` },
    { id: 'deut-023', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'Yukawa theory', unit: 'fm',
      q: R`The short-range repulsion is often modelled by exchange of the $\omega$ meson ($m_\omega c^2 = 782.7$ MeV). The range $\hbar/m_\omega c$ is ______ fm (three decimal places).`,
      answer: 0.252, tol: 0.001, calc: () => 197.327 / 782.7,
      sol: R`$\hbar c/m_\omega c^2 = 197.33/782.7 = 0.252$ fm. Heavier mesons act at shorter distances: pion (1.4 fm, long-range attraction and tensor force), two-pion/$\sigma$ (about 0.4 to 0.7 fm, mid-range attraction), $\omega$ (0.25 fm, repulsion).`,
      trap: 'The vector meson ω gives repulsion between nucleons, unlike the scalar exchange.' },
    { id: 'deut-024', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'deuteron', format: 'multi',
      q: 'Which statements about the deuteron are correct?',
      options: ['Its wavefunction is mostly ³S₁, with a few per cent ³D₁.', 'Its magnetic moment equals μp + μn exactly.', 'Its size is larger than the range of the nuclear force.', 'Its quadrupole moment is positive, so the charge distribution is elongated along the spin (prolate).'], answer: [0, 2, 3],
      sol: R`The tensor force mixes about 4 to 6% $^3D_1$ into the $^3S_1$; this lowers $\mu_d$ to $0.857\,\mu_N$ (below $0.880$) and gives $Q = +0.286$ fm$^2$, prolate. The wavefunction tail $e^{-r/4.3\text{ fm}}$ reaches well beyond the 1.4 fm range.`,
      trap: 'The difference 0.880 − 0.857 is small but well outside the measurement error.' },
    { id: 'deut-025', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'two-nucleon states',
      q: 'Two neutrons scatter at very low energy (relative S wave only). Their spin-orbital state must be',
      options: [R`$^3S_1$`, R`$^1P_1$`, R`$^3D_1$`, R`$^1S_0$`], answer: 3,
      sol: R`Identical fermions need an antisymmetric total state. With $L = 0$ (symmetric in space) the spin state must be antisymmetric: $S = 0$, $^1S_0$. Equivalently $T = 1$ for nn and $(-1)^{L+S+T} = -1$ gives $L + S$ even.`,
      trap: R`$^3S_1$ is the deuteron channel; it needs $T = 0$, which nn cannot have.` },
    { id: 'deut-026', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'two-nucleon states',
      q: R`How many distinct $^{2S+1}L_J$ states are allowed for two protons in a relative $L = 1$ (P-wave) state?`,
      answer: 3, tol: 0, calc: () => 3,
      sol: R`pp has $T = 1$. $(-1)^{L+S+T} = -1$ with $L = 1$, $T = 1$ needs $S$ odd: $S = 1$. Then $J = 0, 1, 2$: $^3P_0$, $^3P_1$, $^3P_2$, three states. ($^1P_1$ is allowed only for np with $T = 0$.)`,
      trap: R`Including $^1P_1$ gives 4, but that state is symmetric in spin and space combined.` },
    { id: 'deut-027', type: 'mcq', level: 3, exams: ['net'], sub: 'isospin',
      q: R`The one-pion-exchange central potential is proportional to $(\vec\tau_1\cdot\vec\tau_2)(\vec\sigma_1\cdot\vec\sigma_2)$. In the deuteron ($S = 1$, $T = 0$) this product equals`,
      options: [R`$+1$`, R`$+9$`, R`$-3$`, R`$-1$`], answer: 2,
      sol: R`Both operators have eigenvalue $2X(X+1) - 3$: $\vec\sigma_1\cdot\vec\sigma_2 = +1$ for $S = 1$ and $\vec\tau_1\cdot\vec\tau_2 = -3$ for $T = 0$. Product $-3$. In the $^1S_0$, $T = 1$ channel it is $(-3)(+1) = -3$ too; in $S = 1$, $T = 1$ it is $+1$; in $S = 0$, $T = 0$ it is $+9$.`,
      trap: 'Isospin enters exactly like spin, with T in place of S.' },
    { id: 'deut-028', type: 'nat', level: 3, exams: ['net'], sub: 'square well', unit: 'MeV',
      q: R`Take the np well radius as $2.1$ fm and $B = 2.2246$ MeV ($\mu c^2 = 469.46$ MeV, $\hbar c = 197.327$ MeV fm). Matching $u = A\sin kr$ to $u = Ce^{-\kappa r}$ at $r = R$ gives $k\cot kR = -\kappa$. Solving, the well depth $V_0$ is ______ MeV (one decimal place).`,
      answer: 33.7, tol: 0.1, calc: () => W.V0,
      sol: R`$\kappa = \sqrt{2\mu B}/\hbar c = 0.2316$ fm$^{-1}$. Solve $k\cot(2.1k) = -0.2316$ numerically: $kR$ is just above $\pi/2$; $k = 0.8717$ fm$^{-1}$ ($kR = 1.830$ against $\pi/2 = 1.571$). Then $V_0 = (\hbar ck)^2/2\mu c^2 + B = 31.51 + 2.22 = 33.7$ MeV.`,
      trap: R`$V_0$ is $\hbar^2k^2/2\mu$ plus $B$: the inside kinetic energy is measured from the bottom of the well, at $-V_0$.` },
    { id: 'deut-029', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'saturation',
      q: 'Binding energy per nucleon is roughly constant (about 8 MeV) and nuclear density is the same in all heavy nuclei. If every nucleon attracted every other with a long-range force, the total binding would instead grow as',
      options: ['A', 'A²', 'A^{1/3}', 'A^{2/3}'], answer: 1,
      sol: R`With $A(A-1)/2$ attracting pairs, $B\propto A^2$ and nuclei would shrink as $A$ grows. The observed $B\propto A$ (saturation) means each nucleon interacts only with its near neighbours: a short-range force with a repulsive core (and exchange character) that stops collapse.`,
      trap: R`$A^{2/3}$ is the surface correction, not the all-pairs result.` },

    // ---------- level 4 ----------
    { id: 'deut-030', type: 'nat', level: 4, exams: ['net'], sub: 'square well',
      q: R`In the square-well deuteron of the previous model ($R = 2.1$ fm, $B = 2.2246$ MeV, $k = 0.8717$ fm$^{-1}$, $\kappa = 0.2316$ fm$^{-1}$), what fraction of the probability lies outside the well, $r > R$? (Two decimal places.)`,
      answer: 0.63, tol: 0.01, calc: () => W.pout,
      sol: R`With $u = A\sin kr$ inside and $u = A\sin kR\,e^{-\kappa(r-R)}$ outside: $\int_0^R\sin^2kr\,dr = \tfrac R2 - \tfrac{\sin2kR}{4k} = 1.05 + 0.142 = 1.192$ fm and $\int_R^\infty = \sin^2kR/2\kappa = 0.9341/0.4632 = 2.016$ fm. Fraction outside $= 2.016/(1.192 + 2.016) = 0.63$.`,
      trap: R`$\sin2kR$ is negative here (kR > π/2), which adds to the inside integral.` },
    { id: 'deut-031', type: 'nat', level: 4, exams: ['net'], sub: 'D state', unit: 'μN',
      q: R`If the deuteron had a 6.0% D-state probability, what would its magnetic moment be? Use $\mu_d = \mu_S - \tfrac32P_D(\mu_S - \tfrac12)$ with $\mu_S = 0.8798\,\mu_N$. (Three decimal places.)`,
      answer: 0.846, tol: 0.001, calc: () => 0.8798 - 1.5 * 0.06 * (0.8798 - 0.5),
      sol: R`$\mu_d = 0.8798 - 1.5\times0.060\times0.3798 = 0.8798 - 0.0342 = 0.846\,\mu_N$, below the measured 0.857: exchange currents and relativistic corrections are why the moment gives a smaller $P_D$ than potential models (5 to 6%).`,
      trap: 'Each per cent of D state lowers the moment by about 0.0057 μN.' },
    { id: 'deut-032', type: 'mcq', level: 4, exams: ['net'], sub: 'effective range',
      q: R`In the zero-range approximation, a weakly bound S state of binding $B$ and the scattering length $a$ in the same channel are related by`,
      options: [R`$a = 1/\kappa$ with $\kappa = \sqrt{2\mu B}/\hbar$`, R`$a = -1/\kappa$`, R`$a = \kappa$`, R`$a = \hbar/\sqrt{2\mu B}\times2$`], answer: 0,
      sol: R`For $r$ beyond the force, the zero-energy wavefunction is $u\propto(r - a)$ and the bound one $u\propto e^{-\kappa r}$. If the binding is weak, both have nearly the same logarithmic derivative at the edge of the force, $-1/a\approx-\kappa$. For the deuteron $1/\kappa = 4.32$ fm against $a_t = 5.42$ fm; the effective-range correction $\kappa = 1/a + \tfrac12r_0\kappa^2$ closes the gap.`,
      trap: 'A bound state gives a positive scattering length (for an attractive well).' },
    { id: 'deut-033', type: 'mcq', level: 4, exams: ['net'], sub: 'n-p scattering',
      q: R`Before 1935 the deuteron data fixed the triplet np interaction ($a_t\approx5$ fm), which predicts a zero-energy np cross section of about $3$ b if the singlet were the same. The measured value is about 20 b. Wigner concluded that`,
      options: ['the measurements were wrong', 'neutrons scatter mostly from electrons in the target', 'the force depends on spin: the singlet scattering length must be much larger in size than the triplet one', 'the force must be long range'], answer: 2,
      sol: R`$\sigma = \pi(a_s^2 + 3a_t^2)$. With $a_s = a_t = 5.4$ fm, $\sigma = 4\pi(5.4)^2 = 3.7$ b. To reach 20.4 b needs $|a_s| \approx 23.7$ fm, so the two spin channels interact very differently. The sign of $a_s$ (negative: unbound) came later from coherent scattering on ortho- and para-hydrogen.`,
      trap: 'Cross sections give only |a|; the sign needs interference experiments.' },
    { id: 'deut-034', type: 'msq', level: 4, exams: ['net'], sub: 'charge independence', format: 'multi',
      q: 'Which observations support charge symmetry or charge independence of the nuclear force?',
      options: ['Mirror nuclei such as ³H and ³He have nearly the same levels once the Coulomb energy is removed.', 'The deuteron is bound while the diproton is not, which proves the np force is stronger because of charge.', 'The nn, pp and np ¹S₀ scattering lengths are similar after Coulomb corrections.', 'Isobaric analogue states with the same T appear in neighbouring isobars at matching excitation (Coulomb-shifted).'], answer: [0, 2, 3],
      sol: R`Mirror levels and analogue states show the nuclear force respects isospin. The $^1S_0$ scattering lengths ($-18.9$, $-17.3$ after Coulomb, $-23.7$ fm) are close; the small np excess is a mild charge-independence breaking from the $\pi^\pm$/$\pi^0$ mass difference. The deuteron-diproton difference is spin and Pauli: pp cannot be in $^3S_1$.`,
      trap: 'Comparing the deuteron with the diproton compares different spin states.' },
    { id: 'deut-035', type: 'mcq', level: 4, exams: ['net'], sub: 'repulsive core',
      q: R`The $^1S_0$ nucleon-nucleon phase shift is positive at low energy but turns negative above about 250 MeV laboratory energy. This is evidence for`,
      options: ['a long-range Coulomb attraction', 'a repulsive core at short distance surrounded by attraction', 'the absence of any spin dependence', 'a bound state in the singlet channel'], answer: 1,
      sol: R`Attraction gives positive phase shifts, repulsion negative. Low-energy (long-wavelength) nucleons feel the outer attraction; at higher energy the wave probes $r \lesssim 0.5$ fm where a strong repulsion dominates and the phase shift changes sign. A hard core of radius $c$ gives $\delta_0 \approx -kc$ at high $k$.`,
      trap: 'A bound singlet state would show up in the low-energy phase shift as δ starting at π (Levinson), not as a sign change at high energy.' },
    { id: 'deut-036', type: 'nat', level: 4, exams: ['net'], sub: 'two-nucleon states',
      q: R`Counting all isospin channels, how many distinct two-nucleon states $^{2S+1}L_J$ have $J = 2$ and positive parity?`,
      answer: 2, tol: 0, calc: () => 2,
      sol: R`Positive parity: $L$ even. $J = 2$ with $S \le 1$: $L = 2$ (with $S = 0$ or $1$); $L = 0$ cannot reach $J = 2$, and $L = 4$ with $S = 1$ gives only $J = 3, 4, 5$. Pauli: $L + S + T$ odd. $^1D_2$: $2 + 0 + T$ odd needs $T = 1$. $^3D_2$: $2 + 1 + T$ odd needs $T = 0$. Two states.`,
      trap: R`$^3S_1$ and $^3D_1$ have $J = 1$; and $^3D_3$ has $J = 3$.` },
    { id: 'deut-037', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Yukawa theory',
      q: R`A static, massive scalar field $\phi$ obeying $(\nabla^2 - \mu^2)\phi = -g\,\delta^3(\vec r)$ produces, around a point source,`,
      options: [R`$\phi = \dfrac{g}{4\pi}\dfrac{e^{-\mu r}}r$, a Yukawa potential with range $1/\mu = \hbar/mc$`, R`$\phi = \dfrac g{4\pi r}$, the Coulomb form`, R`$\phi = g e^{-\mu r}$, with no $1/r$`, R`$\phi = \dfrac g{4\pi}\dfrac{e^{+\mu r}}r$`], answer: 0,
      sol: R`The static Klein-Gordon equation has the Green's function $e^{-\mu r}/4\pi r$ (check: for $r > 0$, $\nabla^2(e^{-\mu r}/r) = \mu^2e^{-\mu r}/r$, and near $r = 0$ it reduces to the Coulomb delta function). With $\mu = mc/\hbar$ the range is the reduced Compton wavelength of the exchanged particle; $m = 0$ gives back Coulomb.`,
      trap: 'The growing exponential is not normalisable and is rejected.' },
    { id: 'deut-038', type: 'mcq', level: 4, exams: ['net'], sub: 'two-nucleon states',
      q: R`A neutron and a proton are in a $^1P_1$ state. Their total isospin must be`,
      options: [R`$T = 1$`, R`$T = 0$`, R`$T = 1/2$`, R`either 0 or 1`], answer: 1,
      sol: R`$(-1)^{L+S+T} = -1$ with $L = 1$, $S = 0$: $1 + T$ must be odd, so $T$ is even: $T = 0$. Hence the $^1P_1$ state exists only for np, never for pp or nn.`,
      trap: R`Being np does not mean $T = 1$ ($T_3 = 0$ allows both).` },

    // ---------- level 5 ----------
    { id: 'deut-039', type: 'nat', level: 5, exams: ['net'], sub: 'n-p scattering', unit: 'fm',
      q: R`The zero-energy np cross section is $20.40$ b and the triplet scattering length is $5.42$ fm. Using $\sigma = \pi(a_s^2 + 3a_t^2)$, the magnitude of the singlet scattering length is ______ fm (one decimal place).`,
      answer: 23.7, tol: 0.1, calc: () => Math.sqrt(2040 / Math.PI - 3 * 5.42 ** 2),
      sol: R`$\sigma/\pi = 2040/\pi = 649.4$ fm$^2$. $a_s^2 = 649.4 - 3\times29.38 = 561.2$ fm$^2$, $|a_s| = 23.7$ fm. Its sign (negative) comes from coherent scattering experiments.`,
      trap: '1 barn = 100 fm², not 10 fm².' },
    { id: 'deut-040', type: 'nat', level: 5, exams: ['net'], sub: 'effective range', unit: 'fm',
      q: R`The shape-independent effective-range relation for the bound triplet state is $\kappa = 1/a_t + \tfrac12r_t\kappa^2$. With $\kappa = 0.2316$ fm$^{-1}$ and $a_t = 5.42$ fm, the triplet effective range $r_t$ is ______ fm (two decimal places).`,
      answer: 1.76, tol: 0.01, calc: () => 2 * (0.2316 - 1 / 5.42) / 0.2316 ** 2,
      sol: R`$r_t = 2(\kappa - 1/a_t)/\kappa^2 = 2(0.2316 - 0.1845)/0.05364 = 1.76$ fm, close to the range of the force, as it should be. The zero-range estimate $a_t = 1/\kappa = 4.32$ fm misses by 25%; one more parameter fixes it.`,
      trap: R`Using $1/\kappa$ for $a_t$ makes $r_t = 0$, the zero-range limit.` },
    { id: 'deut-041', type: 'msq', level: 5, exams: ['net'], sub: 'tensor force', format: 'multi',
      q: R`Which statements about the nuclear tensor force $V_T(r)S_{12}$ are correct?`,
      options: ['It vanishes for spin-singlet pairs.', 'It conserves the orbital angular momentum L.', 'It averages to zero over all orientations of r̂.', 'It connects states with L and L ± 2 of the same J and parity.'], answer: [0, 2, 3],
      sol: R`$S_{12}$ acting on $S = 0$ gives zero (it is built from the total spin, $S_{12} = 2[3(\vec S\cdot\hat r)^2/\hbar^2 - S^2/\hbar^2]$). It is a rank-2 tensor in space and in spin, so it changes $L$ by 0 or $\pm2$ while conserving $J$ and parity: $^3S_1\leftrightarrow{}^3D_1$ in the deuteron. Its angular average is zero by construction.`,
      trap: 'A force that mixes S and D cannot conserve L.' },
    { id: 'deut-042', type: 'mcq', level: 5, exams: ['net'], sub: 'square well',
      q: R`For an $L = 0$ square-well bound state, the depth needed grows as the well narrows. Holding $B = 2.22$ MeV fixed and halving the radius from 2 fm to 1 fm, the required depth`,
      options: ['halves', 'stays the same', 'roughly quadruples (to over 100 MeV), because V₀R² must stay above π²ħ²/8μ', 'doubles exactly'], answer: 2,
      sol: R`The condition $kR\gtrsim\pi/2$ fixes $V_0R^2 \gtrsim \pi^2\hbar^2/8\mu = 102$ MeV fm$^2$. At $R = 2$ fm, $V_0 \approx 37$ MeV; at $R = 1$ fm, $V_0 \approx 123$ MeV (solving $k\cot kR = -\kappa$). Only the product $V_0R^2$ (the well's "strength") is fixed by a weakly bound state, which is why low-energy data cannot fix the shape.`,
      trap: R`It is $V_0R^2$, not $V_0R$, that stays roughly constant.` },
    ...more2,
    ...r4.items,
  ],
  gens: [
    { id: 'deut-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'Yukawa theory',
      make(r) {
        const mode = choose(r, ['range', 'mass']);
        if (mode === 'range') {
          const [nm, m] = choose(r, [['π⁰', 134.98], ['π±', 139.57], ['η', 547.9], ['ρ', 775.3], ['ω', 782.7], ['σ (f₀(500))', 500], ['K', 493.7]]);
          const v = HC / m;
          return { q: R`Estimate the range of a force carried by the ${nm} meson ($mc^2 = ${m}$ MeV) as $\hbar/mc$, in fm (three decimal places).`, answer: round(v, 3), tol: Math.max(0.001, round(v * 0.002, 4)), unit: 'fm', m, mode,
            sol: R`$\hbar/mc = \hbar c/mc^2 = 197.327/${m} = ${round(v, 3)}$ fm.`, trap: 'Heavier exchanged particles give shorter ranges.' };
        }
        const Rg = pick(r, 0.2, 2.5, 0.05), m = HC / Rg;
        return { q: R`If a force of range $${Rg}$ fm were due to exchange of a single particle, Yukawa's argument gives its rest energy as ______ MeV (nearest whole number).`, answer: Math.round(m), tol: Math.max(1, Math.round(m * 0.002)), unit: 'MeV', Rg, mode,
          sol: R`$mc^2 = \hbar c/R = 197.327/${Rg} = ${Math.round(m)}$ MeV.`, trap: R`Use $\hbar c = 197.3$ MeV fm, not $hc$.` };
      },
      verify: (p) => (p.mode === 'range' ? HC / p.m : HC / p.Rg) },
    { id: 'deut-g02', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'square well', unit: 'MeV',
      make(r) {
        const Rw = pick(r, 0.8, 3.0, 0.1), n = choose(r, [1, 1, 1, 2]), V = (2 * n - 1) ** 2 * Math.PI ** 2 * HC ** 2 / (8 * MU * Rw * Rw);
        return { q: R`An attractive square well of radius $${Rw}$ fm acts between a neutron and a proton ($\mu c^2 = ${MU}$ MeV, $\hbar c = 197.327$ MeV fm). The smallest depth for which it holds ${n === 1 ? 'an $L = 0$ bound state' : 'two $L = 0$ bound states'} is ______ MeV (one decimal place).`,
          answer: round(V, 1), tol: Math.max(0.1, round(V * 0.002, 2)), Rw, n,
          sol: R`At zero binding $u'(R) = 0$, so $kR = (2n - 1)\pi/2$; for ${n === 1 ? 'one state $kR = \\pi/2$' : 'two states $kR = 3\\pi/2$'}. $V_0 = \dfrac{(kR)^2(\hbar c)^2}{2\mu c^2R^2} = ${round(V, 1)}$ MeV.`,
          trap: R`The second $L = 0$ state needs $kR = 3\pi/2$, nine times the depth for the first.` };
      },
      verify: (p) => (2 * p.n - 1) ** 2 * Math.PI ** 2 * HC ** 2 / (8 * MU * p.Rw * p.Rw) },
    { id: 'deut-g03', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'deuteron size', unit: 'fm',
      make(r) {
        const B = pick(r, 0.5, 8, 0.1), sys = choose(r, ['np', 'a hypothetical bound dineutron']), v = 1 / kap(B);
        return { q: R`A two-nucleon S-state bound by $${B}$ MeV (${sys}, $\mu c^2 = ${MU}$ MeV) has an outer wavefunction $u\propto e^{-\kappa r}$. Its decay length $1/\kappa$ is ______ fm (two decimal places).`,
          answer: round(v, 2), tol: Math.max(0.01, round(v * 0.003, 3)), B,
          sol: R`$\kappa = \sqrt{2\mu B}/\hbar = \sqrt{2\times${MU}\times${B}}/197.327 = ${round(kap(B), 4)}$ fm$^{-1}$, so $1/\kappa = ${round(v, 2)}$ fm.`,
          trap: R`$1/\kappa$ scales as $B^{-1/2}$: weaker binding, larger system.` };
      },
      verify: (p) => 1 / kap(p.B) },
    { id: 'deut-g04', type: 'nat', level: 3, exams: ['net'], sub: 'D state',
      make(r) {
        const mode = choose(r, ['PD', 'mu']);
        if (mode === 'PD') { const mu = pick(r, 0.83, 0.875, 0.001), P = (0.8798 - mu) / (1.5 * 0.3798) * 100; return { q: R`Suppose the deuteron magnetic moment were measured as $${mu}\,\mu_N$. With $\mu_d = \mu_S - \tfrac32P_D(\mu_S - \tfrac12)$ and $\mu_S = 0.8798\,\mu_N$, the D-state probability is ______ % (two decimal places).`, answer: round(P, 2), tol: Math.max(0.01, round(P * 0.003, 3)), unit: '%', mu, mode,
          sol: R`$P_D = (0.8798 - ${mu})/(1.5\times0.3798) = ${round(P / 100, 4)}$, i.e. ${round(P, 2)}%.`, trap: 'μS − 1/2 = 0.3798, then times 3/2.' }; }
        const P = pick(r, 1, 8, 0.5), mu = 0.8798 - 1.5 * P / 100 * 0.3798;
        return { q: R`A deuteron model gives a D-state probability of $${P}$%. Using $\mu_d = \mu_S - \tfrac32P_D(\mu_S - \tfrac12)$, $\mu_S = 0.8798\,\mu_N$, it predicts $\mu_d$ = ______ $\mu_N$ (four decimal places).`, answer: round(mu, 4), tol: 0.0002, unit: 'μN', P, mode,
          sol: R`$\mu_d = 0.8798 - 1.5\times${P / 100}\times0.3798 = ${round(mu, 4)}\,\mu_N$.`, trap: 'The D admixture lowers the moment.' };
      },
      verify: (p) => (p.mode === 'PD' ? (0.8798 - p.mu) / (1.5 * 0.3798) * 100 : 0.8798 - 1.5 * p.P / 100 * 0.3798) },
    { id: 'deut-g05', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'n-p scattering',
      make(r) {
        const as = pick(r, 5, 30, 0.1), at = pick(r, 2, 8, 0.1), mode = choose(r, ['sigma', 'as']);
        const s = Math.PI * (as * as + 3 * at * at) / 100;
        if (mode === 'sigma') return { q: R`Two nucleons have zero-energy scattering lengths $a_s = -${as}$ fm (singlet) and $a_t = ${at}$ fm (triplet). The unpolarised zero-energy cross section is ______ b (two decimal places).`, answer: round(s, 2), tol: Math.max(0.01, round(s * 0.002, 3)), unit: 'b', as, at, mode,
          sol: R`$\sigma = 4\pi(\tfrac14a_s^2 + \tfrac34a_t^2) = \pi(${round(as * as, 2)} + ${round(3 * at * at, 2)})$ fm$^2 = ${round(s * 100, 1)}$ fm$^2 = ${round(s, 2)}$ b.`, trap: 'Weights 1/4 (singlet) and 3/4 (triplet); 1 b = 100 fm².' };
        const s2 = round(s, 2), as2 = Math.sqrt(s2 * 100 / Math.PI - 3 * at * at);
        return { q: R`The zero-energy cross section of an np-like system is $${s2}$ b and its triplet scattering length is $${at}$ fm. The magnitude of the singlet scattering length is ______ fm (two decimal places).`, answer: round(as2, 2), tol: Math.max(0.01, round(as2 * 0.003, 3)), unit: 'fm', s2, at, mode,
          sol: R`$a_s^2 = \sigma/\pi - 3a_t^2 = ${round(s2 * 100 / Math.PI, 2)} - ${round(3 * at * at, 2)}$ fm$^2$, so $|a_s| = ${round(as2, 2)}$ fm.`, trap: 'Convert barns to fm² (×100) first.' };
      },
      verify: (p) => (p.mode === 'sigma' ? Math.PI * (p.as ** 2 + 3 * p.at ** 2) / 100 : Math.sqrt(p.s2 * 100 / Math.PI - 3 * p.at ** 2)) },
    { id: 'deut-g06', type: 'nat', level: 4, exams: ['net'], sub: 'two-nucleon states',
      make(r) {
        const sys = choose(r, ['pp', 'nn', 'np']), L = int(r, 0, 4), count = (Ts) => { let c = 0; for (const T of Ts) for (const S of [0, 1]) if ((L + S + T) % 2 === 1) c += S === 0 ? 1 : L === 0 ? 1 : 3; return c; };
        const n = count(sys === 'np' ? [0, 1] : [1]);
        return { q: R`Counting every allowed $^{2S+1}L_J$ term, how many two-nucleon states with orbital angular momentum $L = ${L}$ are possible for the ${sys} system?`,
          answer: n, tol: 0, sys, L,
          sol: R`The generalised Pauli principle needs $L + S + T$ odd. ${sys === 'np' ? 'np can have T = 0 or 1' : `${sys} has only T = 1`}. For $L = ${L}$: ${[0, 1].flatMap((S) => (sys === 'np' ? [0, 1] : [1]).filter((T) => (L + S + T) % 2 === 1).map((T) => (S === 0 ? `S = 0 (T = ${T}) gives ¹L_J with J = L, one term` : L === 0 ? `S = 1 (T = ${T}) gives one term, J = 1` : `S = 1 (T = ${T}) gives J = L − 1, L, L + 1, three terms`))).join('; ')}. Total ${n}.`,
          trap: 'For identical nucleons only half the spin choices survive at each L.' };
      },
      verify: (p) => { let c = 0; for (const T of p.sys === 'np' ? [0, 1] : [1]) for (const S of [0, 1]) if ((p.L + S + T) % 2 === 1) c += S === 0 ? 1 : p.L === 0 ? 1 : 3; return c; } },
    { id: 'deut-g07', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'two-nucleon states',
      make(r) {
        const ST = ['¹S₀', '³S₁', '¹P₁', '³P₁', '¹D₂', '³D₂', '³P₂', '³D₁'], LS = { '¹S₀': [0, 0], '³S₁': [0, 1], '¹P₁': [1, 0], '³P₁': [1, 1], '¹D₂': [2, 0], '³D₂': [2, 1], '³P₂': [1, 1], '³D₁': [2, 1] };
        const sys = choose(r, ['two protons', 'two neutrons', 'an np pair with T = 0', 'an np pair with T = 1']), T = sys.includes('T = 0') ? 0 : 1;
        const ok = ST.filter((s) => (LS[s][0] + LS[s][1] + T) % 2 === 1), bad = ST.filter((s) => !ok.includes(s));
        const right = choose(r, ok), o = mcqOptions(r, right, [choose(r, bad), ...bad]);
        return { q: `Which of these two-nucleon states is allowed for ${sys}?`, ...o,
          sol: R`Antisymmetry of the full state needs $(-1)^{L+S+T} = -1$, i.e. $L + S + T$ odd, with $T = ${T}$ here. ${right}: $L = ${LS[right][0]}$, $S = ${LS[right][1]}$, sum $${LS[right][0] + LS[right][1] + T}$, odd. The others give an even sum.`,
          trap: 'np pairs are not automatically T = 1; T = 0 and T = 1 allow complementary sets of states.' };
      } },
    { id: 'deut-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'photodisintegration', unit: 'MeV',
      make(r) {
        const Eg = pick(r, 2.5, 12, 0.1), mode = choose(r, ['Tn', 'Trel']);
        const Q = Eg - 2.2246, v = mode === 'Tn' ? Q / 2 : Q;
        return { q: R`A gamma ray of $${Eg}$ MeV is absorbed by a deuteron at rest ($B = 2.2246$ MeV). Neglecting the small recoil of the centre of mass, ${mode === 'Tn' ? 'the kinetic energy of the neutron (shared equally with the proton)' : 'the total kinetic energy of the neutron and proton'} is ______ MeV (three decimal places).`,
          answer: round(v, 3), tol: 0.003, Eg, mode,
          sol: R`Energy left after breaking the bond: $E_\gamma - B = ${round(Q, 4)}$ MeV.${mode === 'Tn' ? R` Nearly equal masses, so each nucleon takes half: $${round(v, 3)}$ MeV.` : ''} (The centre-of-mass recoil, $E_\gamma^2/2M_dc^2 \approx ${round(Eg * Eg / 3751.2 * 1000, 1)}$ keV, is neglected.)`,
          trap: 'The binding energy is paid first; the rest is kinetic energy.' };
      },
      verify: (p) => (p.mode === 'Tn' ? (p.Eg - 2.2246) / 2 : p.Eg - 2.2246) },
    { id: 'deut-g09', type: 'nat', level: 4, exams: ['net'], sub: 'square well', unit: 'MeV',
      make(r) {
        const Rw = pick(r, 1.2, 3.0, 0.1), B = choose(r, [2.2246, 2.2246, 1.0, 3.0, 5.0]), w = well(Rw, B);
        return { q: R`A square well of radius $${Rw}$ fm binds an np S state by $${B}$ MeV ($\mu c^2 = ${MU}$ MeV, $\hbar c = 197.327$ MeV fm). Solving $k\cot kR = -\kappa$, the well depth is ______ MeV (one decimal place).`,
          answer: round(w.V0, 1), tol: Math.max(0.1, round(w.V0 * 0.002, 2)), Rw, B,
          sol: R`$\kappa = \sqrt{2\mu B}/\hbar c = ${round(w.ka, 4)}$ fm$^{-1}$. The root with $\pi/2 < kR < \pi$ is $k = ${round(w.k, 4)}$ fm$^{-1}$ ($kR = ${round(w.k * Rw, 3)}$). $V_0 = (\hbar ck)^2/2\mu c^2 + B = ${round(w.V0 - B, 2)} + ${B} = ${round(w.V0, 1)}$ MeV.`,
          trap: 'The depth is the inside kinetic energy plus the binding energy.' };
      },
      verify: (p) => well(p.Rw, p.B).V0 },
    { id: 'deut-g10', type: 'mcq', level: 3, exams: ['net'], sub: 'isospin',
      make(r) {
        const S = int(r, 0, 1), T = int(r, 0, 1), sd = 2 * S * (S + 1) - 3, td = 2 * T * (T + 1) - 3, ask = choose(r, ['prod', 'sigma', 'tau']);
        const val = ask === 'prod' ? sd * td : ask === 'sigma' ? sd : td;
        const expr = ask === 'prod' ? R`(\vec\sigma_1\cdot\vec\sigma_2)(\vec\tau_1\cdot\vec\tau_2)` : ask === 'sigma' ? R`\vec\sigma_1\cdot\vec\sigma_2` : R`\vec\tau_1\cdot\vec\tau_2`;
        const o = mcqOptions(r, val, [9, -3, 1, -1, 3, -9, 0].filter((v) => v !== val), (v) => R`$${v}$`);
        return { q: R`For a two-nucleon state with total spin $S = ${S}$ and total isospin $T = ${T}$, the operator $${expr}$ has the value`, ...o,
          sol: R`$\vec\sigma_1\cdot\vec\sigma_2 = 2S(S+1) - 3 = ${sd}$ and $\vec\tau_1\cdot\vec\tau_2 = 2T(T+1) - 3 = ${td}$, so the requested value is $${val}$.`,
          trap: 'Both are +1 for the triplet and −3 for the singlet.' };
      } },
    { id: 'deut-g11', type: 'nat', level: 5, exams: ['net'], sub: 'effective range', unit: 'fm',
      make(r) {
        const B = pick(r, 1, 4, 0.1), ka = kap(B), a = round(1 / ka * pick(r, 1.1, 1.4, 0.01), 2), r0 = 2 * (ka - 1 / a) / (ka * ka);
        return { q: R`An np-like S state is bound by $${B}$ MeV ($\mu c^2 = ${MU}$ MeV) and the scattering length in that channel is $${a}$ fm. Using $\kappa = 1/a + \tfrac12r_0\kappa^2$, the effective range $r_0$ is ______ fm (two decimal places).`,
          answer: round(r0, 2), tol: Math.max(0.01, round(r0 * 0.004, 3)), B, a,
          sol: R`$\kappa = \sqrt{2\mu B}/\hbar c = ${round(ka, 4)}$ fm$^{-1}$; $1/a = ${round(1 / a, 4)}$ fm$^{-1}$. $r_0 = 2(\kappa - 1/a)/\kappa^2 = ${round(r0, 2)}$ fm.`,
          trap: R`If $a$ were exactly $1/\kappa$, $r_0$ would be zero (zero-range limit).` };
      },
      verify: (p) => { const ka = kap(p.B); return 2 * (ka - 1 / p.a) / (ka * ka); } },
    { id: 'deut-g12', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'nuclear force',
      make(r) {
        const P = [
          ['The deuteron has a non-zero electric quadrupole moment.', 'a tensor (non-central) component'],
          ['The np spin-singlet state is unbound while the triplet is bound.', 'spin dependence'],
          ['Binding energy per nucleon and nuclear density are nearly the same for all heavy nuclei.', 'saturation (short range plus a repulsive core)'],
          ['³H and ³He have nearly identical level schemes after removing the Coulomb energy.', 'charge symmetry'],
          ['The ¹S₀ phase shift turns negative at a few hundred MeV.', 'a strongly repulsive core'],
          ['Nuclear sizes grow as A^{1/3} while the force between nuclei vanishes beyond a few fm.', 'a short range of about 1 to 2 fm'],
          ['Doublet splittings in nuclear shell levels (e.g. p₃/₂ below p₁/₂) are large.', 'a strong spin-orbit component'],
        ];
        const [obs, prop] = choose(r, P), o = mcqOptions(r, prop, P.map((x) => x[1]).filter((x) => x !== prop));
        return { q: `${obs} Which property of the nuclear force does this observation mainly reveal?`, ...o,
          sol: `${obs} This points to ${prop}. Each listed property is tied to a distinct observation: quadrupole moment (tensor force), singlet versus triplet binding (spin dependence), constant B/A and density (saturation), mirror nuclei (charge symmetry), high-energy phase shifts (repulsive core), nuclear sizes (short range), shell-model doublets (spin-orbit force).`,
          trap: 'Several properties act together; ask which one this particular observation could not exist without.' };
      } },
    ...more,
    ...r4.gens,
  ],
};
