// Raman spectroscopy: Stokes and anti-Stokes lines, polarisability and selection rules, rotational Raman (S branch,
// 4B spacing, nuclear-spin alternation), vibrational Raman (O, Q, S branches), mutual exclusion, depolarisation,
// intensity ratios and Raman thermometry, the nu^4 law, resonance and coherent Raman.
// Original questions for GATE and CSIR NET practice (fibub). Levels: 1 warm-up ... 5 top rank.
import { pick, int, choose, mcqOptions, round, shuffle } from '../_util.js';
import more from './raman.more.gen.js';

const C2 = 1.438777;   // hc/k, cm K
const IB = 16.8576;    // I (u Å^2) = IB / B (cm^-1)
const LASERS = [['Nd:YAG (frequency doubled)', 532.0], ['argon ion', 514.5], ['argon ion', 488.0], ['He-Ne', 632.8], ['diode', 785.0], ['Nd:YAG', 1064.0], ['frequency-tripled Nd:YAG', 355.0], ['He-Cd', 441.6]];
const MODES = [['CCl$_4$', 459], ['CCl$_4$', 314], ['benzene ring breathing', 992], ['N$_2$', 2331], ['O$_2$', 1556], ['H$_2$', 4161], ['silicon optical phonon', 520], ['diamond', 1332], ['CO$_2$ (upper Fermi band)', 1388], ['CH$_4$ symmetric stretch', 2917], ['SO$_4^{2-}$ symmetric stretch', 981], ['graphite G band', 1582]];

export default {
  topic: 'raman',
  items: [
    // ---------- level 1 ----------
    { id: 'rmn-001', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'stokes and anti-stokes',
      q: 'In Raman scattering, the Stokes lines are',
      options: ['at lower frequency than the exciting light; the molecule gains energy', 'at higher frequency than the exciting light; the molecule gains energy', 'at the same frequency as the exciting light', 'at lower frequency; the molecule loses energy'], answer: 0,
      sol: 'Stokes: the photon leaves part of its energy in the molecule (e.g. $v = 0\\to1$), so it comes out at $\\nu_0 - \\nu_{vib}$. Anti-Stokes: the molecule was already excited and gives energy to the photon, $\\nu_0 + \\nu_{vib}$.',
      trap: 'Same naming as in fluorescence: Stokes means shifted to longer wavelength.' },
    { id: 'rmn-002', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'selection rules',
      q: 'A molecular vibration is Raman active if during the vibration',
      options: ['the dipole moment changes', 'the polarisability changes', 'the bond length stays fixed', 'the molecule has a permanent dipole moment'], answer: 1,
      sol: 'The light induces a dipole $\\vec p = \\alpha\\vec E$. If $\\alpha$ oscillates with the vibration, $\\alpha = \\alpha_0 + (\\partial\\alpha/\\partial q)q_0\\cos\\omega_vt$, the induced dipole has sidebands at $\\omega_0 \\pm \\omega_v$: Raman lines. So $(\\partial\\alpha/\\partial q)_0 \\ne 0$ is needed.',
      trap: 'A change in dipole moment is the IR rule; the Raman rule is about polarisability.' },
    { id: 'rmn-003', type: 'msq', level: 1, exams: ['gate', 'net'], sub: 'raman activity',
      q: 'Which of these give Raman lines?',
      options: ['The N$_2$ stretching vibration', 'The O$_2$ stretching vibration', 'The pure rotation of H$_2$', 'The pure rotation of CH$_4$'], answer: [0, 1, 2],
      sol: 'Stretching any diatomic bond changes its polarisability, so N$_2$ and O$_2$ vibrations are Raman active (though IR inactive). H$_2$ has an anisotropic polarisability (larger along the bond), so its rotation modulates $\\alpha$: rotational Raman lines. CH$_4$ is a spherical top with isotropic $\\alpha$: rotation changes nothing.',
      trap: 'Rotational Raman needs an anisotropic polarisability, not a dipole.' },
    { id: 'rmn-004', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'rotational raman',
      q: 'The selection rule for the pure rotational Raman spectrum of a linear molecule is',
      options: ['$\\Delta J = \\pm1$', '$\\Delta J = 0$ only', '$\\Delta J = 0, \\pm2$', '$\\Delta J = \\pm1, \\pm2$'], answer: 2,
      sol: 'Raman is a two-photon process, so each photon brings one unit of angular momentum and the total change can be 0 or $\\pm2$ (parity unchanged). $\\Delta J = 0$ is the Rayleigh line; $\\Delta J = +2$ gives the Stokes S branch and $-2$ the anti-Stokes lines.',
      trap: '$\\Delta J = \\pm1$ is the microwave (one-photon) rule.' },
    { id: 'rmn-005', type: 'nat', level: 1, exams: ['gate', 'net'], sub: 'stokes and anti-stokes',
      q: 'A sample is excited at 532.0 nm and shows a Raman band shifted by 1000 cm$^{-1}$. The Stokes line is at ______ nm (to one decimal place).',
      answer: 561.9, tol: 0.2, unit: 'nm', calc: () => 1e7 / (1e7 / 532 - 1000),
      sol: '$\\tilde\\nu_0 = 10^7/532.0 = 18797.0$ cm$^{-1}$. Stokes: $18797.0 - 1000 = 17797.0$ cm$^{-1}$, so $\\lambda = 10^7/17797.0 = 561.9$ nm.',
      trap: 'Shifts are added or subtracted in wavenumbers, never in nanometres.' },
    { id: 'rmn-006', type: 'mcq', level: 1, exams: ['gate', 'net'], sub: 'stokes and anti-stokes',
      q: 'At room temperature the anti-Stokes vibrational Raman lines are much weaker than the Stokes lines because',
      options: ['the polarisability is smaller at higher frequency', 'anti-Stokes scattering violates energy conservation', 'anti-Stokes light is absorbed by the sample', 'few molecules are in the excited vibrational level needed to start anti-Stokes scattering'], answer: 3,
      sol: 'Anti-Stokes scattering starts from $v = 1$, whose population relative to $v = 0$ is $e^{-hc\\tilde\\nu/kT}$, small for most vibrations at 300 K. Stokes scattering starts from the well-populated $v = 0$.',
      trap: 'Classical theory predicts equal sidebands; the asymmetry is a quantum (Boltzmann) effect.' },

    // ---------- level 2 ----------
    { id: 'rmn-007', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'rotational raman',
      q: 'For N$_2$, $B = 1.998$ cm$^{-1}$. The first Stokes rotational Raman line, S(0), is shifted from the Rayleigh line by ______ cm$^{-1}$ (to two decimal places).',
      answer: 11.99, tol: 0.01, unit: 'cm⁻¹', calc: () => 6 * 1.998,
      sol: 'S($J$): $J\\to J+2$, shift $F(J+2) - F(J) = B(4J + 6) = 4B(J + \\tfrac32)$. For $J = 0$: $6B = 11.99$ cm$^{-1}$.',
      trap: 'The first rotational Raman line is at $6B$, the next ones $4B$ further apart.' },
    { id: 'rmn-008', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'rotational raman',
      q: 'For H$_2$, $B = 60.85$ cm$^{-1}$. The spacing between adjacent Stokes lines in the rotational Raman spectrum (ignoring nuclear spin effects on intensity) is ______ cm$^{-1}$ (to one decimal place).',
      answer: 243.4, tol: 0.1, unit: 'cm⁻¹', calc: () => 4 * 60.85,
      sol: 'S($J$) shifts are $4B(J + \\tfrac32)$, so consecutive lines differ by $4B = 243.4$ cm$^{-1}$. (In H$_2$ both even and odd $J$ exist, so no line is missing; they alternate in intensity.)',
      trap: 'The spacing is $4B$, twice the microwave spacing $2B$.' },
    { id: 'rmn-009', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'mutual exclusion',
      q: 'The rule of mutual exclusion (no vibration is both IR and Raman active) applies to molecules that',
      options: ['have a centre of inversion', 'are linear', 'are polar', 'have no symmetry at all'], answer: 0,
      sol: 'With a centre of inversion every mode is either gerade or ungerade. The dipole is ungerade, so only $u$ modes are IR active; the polarisability is gerade, so only $g$ modes are Raman active. No mode can be both.',
      trap: 'Linear but not centrosymmetric molecules (HCN, N$_2$O) do have modes active in both.' },
    { id: 'rmn-010', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'stokes and anti-stokes',
      q: 'Nitrogen gas is excited with 488.0 nm light. The N$_2$ vibrational Raman shift is 2331 cm$^{-1}$. The Stokes line is at ______ nm (to one decimal place).',
      answer: 550.6, tol: 0.2, unit: 'nm', calc: () => 1e7 / (1e7 / 488 - 2331),
      sol: '$\\tilde\\nu_0 = 10^7/488.0 = 20491.8$ cm$^{-1}$. Stokes: $20491.8 - 2331 = 18160.8$ cm$^{-1}$, $\\lambda = 550.6$ nm.',
      trap: 'Do not subtract a shift from a wavelength.' },
    { id: 'rmn-011', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'raman activity',
      q: 'For the vibrations of CO$_2$, which statements are correct?',
      options: ['The symmetric stretch is Raman active', 'The antisymmetric stretch is Raman active', 'The bending mode is Raman active', 'The Raman spectrum shows a doublet near 1285 and 1388 cm$^{-1}$ from Fermi resonance'], answer: [0, 3],
      sol: 'Only the symmetric ($g$) stretch modulates the polarisability. Its frequency is almost exactly twice the bend (667 cm$^{-1}$), so it mixes with the bend overtone ($2\\nu_2$) and the two share intensity: the Fermi dyad at 1285 and 1388 cm$^{-1}$. The bend and antisymmetric stretch are $u$ modes: IR active, Raman inactive.',
      trap: 'Expecting one Raman line for CO$_2$ misses the Fermi resonance.' },
    { id: 'rmn-012', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'nu^4 law',
      q: 'The scattered intensity of Raman (and Rayleigh) light scales as $\\nu^4$. Ignoring the small shift, changing the excitation from 800 nm to 400 nm (same power) increases the scattered intensity by a factor of ______.',
      answer: 16, tol: 0,
      sol: 'Halving the wavelength doubles $\\nu$, and $2^4 = 16$. This is why blue and UV lasers give stronger Raman signals, and why the sky is blue (Rayleigh scattering).',
      trap: 'A factor of 2 or 4 forgets the fourth power.' },
    { id: 'rmn-013', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'rayleigh',
      q: 'The strongest line in the light scattered by a transparent gas is',
      options: ['the first Stokes vibrational line', 'the Rayleigh line, at the exciting frequency', 'the first anti-Stokes line', 'the Q branch of the vibrational band'], answer: 1,
      sol: 'Elastic (Rayleigh) scattering is typically $10^3$ to $10^4$ times stronger than Raman scattering. That is why Raman spectrometers need good filters to reject the laser line.',
      trap: 'Raman lines are weak: about one photon in $10^6$ to $10^8$ is Raman scattered.' },
    { id: 'rmn-014', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'intensity ratio',
      q: 'For the 459 cm$^{-1}$ band of CCl$_4$ at 300 K, the Boltzmann factor $N_{v=1}/N_{v=0}$, which sets the anti-Stokes to Stokes ratio apart from the $\\nu^4$ factor, is ______ (to three decimal places). Use $hc/k = 1.4388$ cm K.',
      answer: 0.111, tol: 0.002, calc: () => Math.exp(-1.4388 * 459 / 300),
      sol: '$hc\\tilde\\nu/kT = 1.4388\\times459/300 = 2.201$; $e^{-2.201} = 0.111$. Low-frequency modes show clear anti-Stokes lines at room temperature.',
      trap: 'High-frequency modes (like N$_2$ at 2331 cm$^{-1}$) have almost no anti-Stokes line at 300 K.' },
    { id: 'rmn-015', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'stokes and anti-stokes',
      q: 'A Raman band is measured once with a 532 nm laser and once with a 785 nm laser. Its Raman shift (in cm$^{-1}$)',
      options: ['scales with the laser frequency', 'scales with the laser wavelength', 'is the same in both, because it equals the molecular energy level spacing', 'is larger with 785 nm because the light is less energetic'], answer: 2,
      sol: 'The shift $\\tilde\\nu_0 - \\tilde\\nu_s$ is the vibrational energy in wavenumbers, a property of the molecule. The absolute wavelengths of the Raman lines do move with the laser, but the shift does not.',
      trap: 'Fluorescence peaks stay at fixed wavelength; Raman peaks stay at fixed shift. Changing the laser tells them apart.' },
    { id: 'rmn-016', type: 'msq', level: 2, exams: ['gate', 'net'], sub: 'raman vs ir',
      q: 'Which statements comparing Raman and infrared spectroscopy are correct?',
      options: ['Raman spectra of aqueous solutions are easy because water is a weak Raman scatterer', 'Vibrations of homonuclear diatomic molecules are seen only in Raman', 'Raman spectroscopy needs an intense monochromatic source, usually a laser', 'Raman lines are stronger than the Rayleigh line'], answer: [0, 1, 2],
      sol: 'Water absorbs IR strongly but scatters Raman weakly. N$_2$, O$_2$, H$_2$ have no dipole change (IR silent) but a polarisability change (Raman active). The weak effect needs a strong, narrow source. The Rayleigh line is by far the strongest.',
      trap: 'Raman is a scattering technique, measured in the visible or near IR even for IR-region shifts.' },

    // ---------- level 3 ----------
    { id: 'rmn-017', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'rotational raman',
      q: 'For O$_2$, $B = 1.4377$ cm$^{-1}$. The rotational Raman line S(3) is shifted from the exciting line by ______ cm$^{-1}$ (to two decimal places).',
      answer: 25.88, tol: 0.02, unit: 'cm⁻¹', calc: () => 4 * 1.4377 * 4.5,
      sol: 'Shift $= 4B(J + \\tfrac32) = 4\\times1.4377\\times4.5 = 18B = 25.88$ cm$^{-1}$.',
      trap: '$4B(J + \\tfrac32)$, not $2B(J+1)$.' },
    { id: 'rmn-018', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'nuclear spin statistics',
      q: 'In the rotational Raman spectrum of $^{16}$O$_2$, alternate lines are missing. The reason is',
      options: ['O$_2$ is paramagnetic', 'the odd-$J$ lines are too weak to see', 'the polarisability of O$_2$ is isotropic', '$^{16}$O nuclei have spin zero, so only rotational levels of one exchange symmetry (odd $N$ for the $^3\\Sigma_g^-$ ground state) exist'], answer: 3,
      sol: 'Spin-0 nuclei are bosons with a single, symmetric spin state, so the rotational part times the electronic part must be symmetric. For the $^3\\Sigma_g^-$ ground state this leaves only odd $N$. Lines from even $N$ are absent, and the observed lines are $8B$ apart.',
      trap: 'Missing lines are not weak lines: those levels simply do not exist.' },
    { id: 'rmn-019', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'nuclear spin statistics',
      q: '$^{14}$N has nuclear spin 1. In the rotational Raman spectrum of $^{14}$N$_2$, the ratio of statistical weights of even-$J$ to odd-$J$ levels is ______.',
      answer: 2, tol: 0,
      sol: 'Two spin-1 nuclei: $(2I+1)^2 = 9$ spin states, of which $(I+1)(2I+1) = 6$ are symmetric and $I(2I+1) = 3$ antisymmetric. For bosons in a $^1\\Sigma_g^+$ state, even $J$ goes with symmetric spin: even : odd $= 6 : 3 = 2 : 1$. The lines alternate strong, weak.',
      trap: 'For spin-1/2 nuclei (H$_2$) the ratio is 1 : 3 the other way round.' },
    { id: 'rmn-020', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'raman thermometry',
      q: 'The silicon optical phonon (520 cm$^{-1}$) is excited at 532.0 nm. Including the $\\nu^4$ factor, $I_{AS}/I_S = \\left(\\dfrac{\\tilde\\nu_0 + \\tilde\\nu_v}{\\tilde\\nu_0 - \\tilde\\nu_v}\\right)^4 e^{-hc\\tilde\\nu_v/kT}$. At 300 K this ratio is ______ (to three decimal places). Use $hc/k = 1.4388$ cm K.',
      answer: 0.103, tol: 0.002, calc: () => ((1e7 / 532 + 520) / (1e7 / 532 - 520)) ** 4 * Math.exp(-1.4388 * 520 / 300),
      sol: '$\\tilde\\nu_0 = 18797$ cm$^{-1}$. $(19317/18277)^4 = 1.0569^4 = 1.248$. $e^{-1.4388\\times520/300} = e^{-2.494} = 0.0826$. Product: 0.103.',
      trap: 'The $\\nu^4$ factor slightly favours the anti-Stokes line; leaving it out gives 0.083.' },
    { id: 'rmn-021', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'depolarisation',
      q: 'With linearly polarised excitation, a Raman band has depolarisation ratio $\\rho = I_\\perp/I_\\parallel = 0.05$. This band most likely comes from',
      options: ['a totally symmetric vibration', 'a non-totally symmetric vibration', 'a pure rotational transition', 'fluorescence'], answer: 0,
      sol: 'For non-totally symmetric modes the polarisability change is purely anisotropic, giving $\\rho = 3/4$ (depolarised). Totally symmetric modes have an isotropic part as well, giving $0 \\le \\rho < 3/4$ (polarised). A value near zero is typical of a symmetric breathing mode.',
      trap: 'The value 3/4 applies to linearly polarised excitation; with natural light it is 6/7.' },
    { id: 'rmn-022', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'rotational raman',
      q: 'Adjacent lines in the rotational Raman spectrum of $^{14}$N$_2$ are 7.990 cm$^{-1}$ apart. With $\\mu = 7.0015$ u and $I\\,(\\text{u Å}^2) = 16.858/B\\,(\\text{cm}^{-1})$, the bond length is ______ pm (to one decimal place).',
      answer: 109.8, tol: 0.2, unit: 'pm', calc: () => Math.sqrt(16.858 / (7.99 / 4) / 7.0015) * 100,
      sol: 'Spacing $4B = 7.990$, so $B = 1.9975$ cm$^{-1}$. $I = 16.858/1.9975 = 8.440$ u Å$^2$. $r = \\sqrt{8.440/7.0015} = \\sqrt{1.2054} = 1.0979$ Å $= 109.8$ pm.',
      trap: 'Divide by 4, not 2: Raman spacing is $4B$. Raman is the only way to get this for N$_2$, which has no microwave spectrum.' },
    { id: 'rmn-023', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'rotational raman',
      q: 'Which statements about pure rotational Raman spectra are correct?',
      options: ['Spherical tops such as CH$_4$ and SF$_6$ show none', 'Linear molecules show S-branch lines at shifts $4B(J + \\tfrac32)$', 'In $^{12}$C$^{16}$O$_2$ only lines from even $J$ appear', 'HCl shows no rotational Raman spectrum because it is polar'], answer: [0, 1, 2],
      sol: 'Isotropic polarisability (spherical tops) means rotation changes nothing. In CO$_2$ the two $^{16}$O are spin-0 bosons in a $^1\\Sigma_g^+$ state, so only even $J$ levels exist. Polar molecules like HCl have anisotropic polarisability too and do show rotational Raman lines.',
      trap: 'A molecule can be both microwave and Raman active; the rules are independent.' },
    { id: 'rmn-024', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'classical theory',
      q: 'In the classical theory of Raman scattering, with $\\alpha = \\alpha_0 + \\alpha_1\\cos\\omega_vt$ and $E = E_0\\cos\\omega_0t$, the predicted ratio of anti-Stokes to Stokes intensity (ignoring $\\nu^4$) is',
      options: ['$e^{-\\hbar\\omega_v/kT}$', '1', '0', '$\\omega_0/\\omega_v$'], answer: 1,
      sol: '$p = \\alpha_0E_0\\cos\\omega_0t + \\tfrac12\\alpha_1E_0[\\cos(\\omega_0 - \\omega_v)t + \\cos(\\omega_0 + \\omega_v)t]$: the two sidebands have equal amplitude. The observed weakness of anti-Stokes lines needs quantum mechanics (populations of the vibrational levels).',
      trap: 'The classical picture gets the frequencies right but not the intensity ratio.' },
    { id: 'rmn-025', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'stokes and anti-stokes',
      q: 'Hydrogen gas is excited at 355.0 nm. The H$_2$ vibrational Raman shift is 4161 cm$^{-1}$. The first Stokes line is at ______ nm (to one decimal place).',
      answer: 416.5, tol: 0.2, unit: 'nm', calc: () => 1e7 / (1e7 / 355 - 4161),
      sol: '$\\tilde\\nu_0 = 10^7/355.0 = 28169.0$ cm$^{-1}$. $28169.0 - 4161 = 24008.0$ cm$^{-1}$, $\\lambda = 416.5$ nm. (Raman shifting in H$_2$ cells is a common way to make new laser wavelengths.)',
      trap: 'A large shift moves the line a long way: 61.5 nm here.' },
    { id: 'rmn-026', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'vibrational raman',
      q: 'The vibrational Raman band of a diatomic gas at high resolution consists of',
      options: ['P and R branches only', 'a single line', 'O ($\\Delta J = -2$), Q ($\\Delta J = 0$) and S ($\\Delta J = +2$) branches, with a strong Q branch', 'P, Q and R branches like an IR band'], answer: 2,
      sol: 'Raman rotational selection rules ($\\Delta J = 0, \\pm2$) apply on top of $\\Delta v = 1$. $\\Delta J = 0$ lines from all $J$ pile up near the origin (strong Q branch); O and S branches stretch out on either side with spacing about $4B$.',
      trap: 'P and R branches ($\\Delta J = \\pm1$) belong to IR absorption.' },
    { id: 'rmn-027', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'raman shift',
      q: 'A sample excited at 514.5 nm shows a Raman line at 529.4 nm. The Raman shift is ______ cm$^{-1}$ (to the nearest integer).',
      answer: 547, tol: 1, unit: 'cm⁻¹', calc: () => 1e7 / 514.5 - 1e7 / 529.4,
      sol: '$10^7/514.5 - 10^7/529.4 = 19436.3 - 18889.3 = 547$ cm$^{-1}$, a Stokes line (longer wavelength).',
      trap: 'Using $\\Delta\\lambda/\\lambda^2$ with rounded numbers can lose a few cm$^{-1}$; subtract wavenumbers directly.' },
    { id: 'rmn-028', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'nu^4 law',
      q: 'Why do many Raman spectrometers use near-infrared (785 or 1064 nm) lasers even though shorter wavelengths give a stronger Raman signal?',
      options: ['Raman shifts are larger in the near IR', 'Near-IR light gives a narrower Rayleigh line', 'The $\\nu^4$ law does not apply in the near IR', 'Visible light can excite fluorescence in many samples, which swamps the weak Raman signal'], answer: 3,
      sol: 'The $\\nu^4$ law favours short wavelengths, but visible light excites electronic transitions in impurities and dyes, whose fluorescence can be millions of times stronger than Raman. Near-IR photons are below most electronic absorptions.',
      trap: 'The Raman shift itself does not depend on the laser.' },

    // ---------- level 4 ----------
    { id: 'rmn-029', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'raman thermometry',
      q: 'For the 459 cm$^{-1}$ band of CCl$_4$, the measured anti-Stokes to Stokes intensity ratio, after correcting for the $\\nu^4$ factor, is 0.200. The sample temperature is ______ K (to the nearest integer). Use $hc/k = 1.4388$ cm K.',
      answer: 410, tol: 2, unit: 'K', calc: () => 1.4388 * 459 / Math.log(5),
      sol: '$0.200 = e^{-hc\\tilde\\nu/kT}$, so $T = \\dfrac{1.4388\\times459}{\\ln5} = \\dfrac{660.4}{1.6094} = 410$ K.',
      trap: 'Correcting for $\\nu^4$ first is essential in real Raman thermometry.' },
    { id: 'rmn-030', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'rotational raman',
      q: 'A linear molecule with $B = 2.000$ cm$^{-1}$ is excited at exactly 20000 cm$^{-1}$. The Stokes rotational line S(2) appears at an absolute wavenumber of ______ cm$^{-1}$.',
      answer: 19972, tol: 0, unit: 'cm⁻¹',
      sol: 'Shift $= 4B(J + \\tfrac32) = 8\\times3.5 = 28$ cm$^{-1}$. Stokes lines lie below the laser: $20000 - 28 = 19972$ cm$^{-1}$.',
      trap: 'Stokes is lower in wavenumber; anti-Stokes S(2) would be at 20028 cm$^{-1}$.' },
    { id: 'rmn-031', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'polarisability',
      q: 'Which statements about the polarisability picture of Raman scattering are correct?',
      options: ['A diatomic molecule rotating at $\\omega_r$ presents the same polarisability after half a turn, so $\\alpha$ oscillates at $2\\omega_r$, consistent with $\\Delta J = \\pm2$', 'A vibration at $\\omega_v$ modulates $\\alpha$ at $\\omega_v$, consistent with $\\Delta v = \\pm1$', 'A molecule with isotropic polarisability has no rotational Raman spectrum', 'An IR-active mode is Raman inactive in every molecule'], answer: [0, 1, 2],
      sol: 'The polarisability ellipsoid of a linear molecule looks the same after a $180^\\circ$ turn, so the scattered light carries sidebands at $\\omega_0 \\pm 2\\omega_r$. Vibrations modulate $\\alpha$ once per period. Mutual exclusion holds only for centrosymmetric molecules; in H$_2$O or HCl modes are active in both.',
      trap: 'Mutual exclusion is not a general rule.' },
    { id: 'rmn-032', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'rotational raman',
      q: 'A heteronuclear linear molecule has $B = 2.00$ cm$^{-1}$. How many Stokes rotational Raman lines (S branch) lie at shifts below 95 cm$^{-1}$? ______',
      answer: 11, tol: 0,
      sol: 'S($J$) shift $= 8(J + 1.5)$ cm$^{-1}$ $< 95$ means $J + 1.5 < 11.875$, so $J \\le 10$: $J = 0, 1, \\dots, 10$, eleven lines (at 12, 20, ..., 92 cm$^{-1}$).',
      trap: 'Start counting at $J = 0$; S(0) is at $6B$, not $4B$.' },
    { id: 'rmn-033', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'nuclear spin statistics',
      q: 'In the rotational Raman spectrum of H$_2$ at room temperature, the lines alternate in intensity. Which lines are stronger (apart from the smooth Boltzmann envelope)?',
      options: ['Lines from odd $J$ (ortho), by a factor of about 3', 'Lines from even $J$ (para), by a factor of about 3', 'Lines from even $J$, by a factor of 2', 'They are equal; the alternation is due to the Boltzmann factor'], answer: 0,
      sol: 'Protons are spin-1/2 fermions: odd $J$ pairs with the 3 symmetric (triplet) spin states, even $J$ with the 1 antisymmetric (singlet) state. Statistical weights odd : even $= 3 : 1$.',
      trap: 'For spin-1 $^{14}$N$_2$ it is even : odd $= 2 : 1$, the other way round.' },
    { id: 'rmn-034', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'raman thermometry',
      q: 'In a flame at 1000 K, N$_2$ (2331 cm$^{-1}$) is probed with 532.0 nm light. With $I_{AS}/I_S = \\left(\\dfrac{\\tilde\\nu_0 + \\tilde\\nu_v}{\\tilde\\nu_0 - \\tilde\\nu_v}\\right)^4 e^{-hc\\tilde\\nu_v/kT}$, the ratio is ______ (to three decimal places). Use $hc/k = 1.4388$ cm K.',
      answer: 0.095, tol: 0.002, calc: () => ((1e7 / 532 + 2331) / (1e7 / 532 - 2331)) ** 4 * Math.exp(-1.4388 * 2331 / 1000),
      sol: '$\\tilde\\nu_0 = 18797$; $(21128/16466)^4 = 1.2831^4 = 2.711$. $e^{-1.4388\\times2331/1000} = e^{-3.354} = 0.0350$. Product: 0.095. At 300 K the same ratio would be about $3\\times10^{-5}$.',
      trap: 'For large shifts the $\\nu^4$ factor is far from 1 (here 2.7).' },
    { id: 'rmn-035', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'resonance raman',
      q: 'In resonance Raman spectroscopy the excitation wavelength is tuned into an electronic absorption band. The main effect is',
      options: ['all Raman lines disappear', 'vibrations coupled to the electronic transition are enhanced by factors of $10^3$ to $10^6$', 'only anti-Stokes lines are seen', 'the Raman shifts change'], answer: 1,
      sol: 'The scattering amplitude has denominators $(\\omega_{e} - \\omega_0 - i\\Gamma)$; near resonance one term dominates and modes that distort the molecule along the electronic transition (large Franck-Condon displacement) are hugely enhanced. Shifts stay the same; fluorescence can be a problem.',
      trap: 'The shifts are vibrational energies and never depend on the excitation.' },
    { id: 'rmn-036', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'vibrational raman',
      q: 'For N$_2$ take the vibrational Raman Q-branch origin at 2329.9 cm$^{-1}$ and $B = 1.99$ cm$^{-1}$ in both levels. The S(4) line of the vibrational Raman band is shifted by ______ cm$^{-1}$ (to one decimal place).',
      answer: 2373.7, tol: 0.1, unit: 'cm⁻¹', calc: () => 2329.9 + 4 * 1.99 * 5.5,
      sol: 'S($J$): $\\Delta v = 1$, $\\Delta J = +2$: shift $= \\tilde\\nu_0 + 4B(J + \\tfrac32) = 2329.9 + 4\\times1.99\\times5.5 = 2329.9 + 43.78 = 2373.7$ cm$^{-1}$.',
      trap: 'The rotational part is the same $4B(J + \\tfrac32)$ as in pure rotational Raman (when $B_1 = B_0$).' },

    // ---------- level 5 ----------
    { id: 'rmn-037', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'nuclear spin statistics',
      q: 'Two adjacent lines in the Stokes rotational Raman spectrum of $^{16}$O$_2$ are at 14.38 and 25.88 cm$^{-1}$; there are no lines between them because only odd $N$ exist. Treating $N$ like $J$ in $4B(J + \\tfrac32)$, the rotational constant is ______ cm$^{-1}$ (to three decimal places).',
      answer: 1.438, tol: 0.002, unit: 'cm⁻¹', calc: () => (25.88 - 14.38) / 8,
      sol: 'Only odd $N$, so adjacent observed lines are S(1) and S(3), $8B$ apart: $B = 11.50/8 = 1.4375 \\approx 1.438$ cm$^{-1}$. Check: S(1) $= 10B = 14.38$ ✓, S(3) $= 18B = 25.88$ ✓.',
      trap: 'Dividing by $4B$ (as if all $J$ were present) gives twice the true $B$.' },
    { id: 'rmn-038', type: 'msq', level: 5, exams: ['gate', 'net'], sub: 'rotational raman',
      q: 'Which statements about the rotational Raman spectrum of $^{12}$C$^{16}$O$_2$ are correct?',
      options: ['Only lines starting from even $J$ appear', 'Adjacent lines are $8B$ apart', 'The first Stokes line is at a shift of $6B$', 'There is no rotational Raman spectrum because CO$_2$ has no dipole moment'], answer: [0, 1, 2],
      sol: 'Both $^{16}$O are spin-0 bosons and the ground state is $^1\\Sigma_g^+$: only even $J$ exist. Lines S(0), S(2), S(4) are at $6B$, $14B$, $22B$: spacing $8B$. Raman needs an anisotropic polarisability, which CO$_2$ has; the dipole moment is irrelevant.',
      trap: 'No microwave spectrum does not mean no rotational Raman spectrum.' },
    { id: 'rmn-039', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'isotope effect',
      q: 'The Raman line of diamond ($^{12}$C) is at 1332 cm$^{-1}$. Assuming the frequency scales as $m^{-1/2}$ with the same force constants, isotopically pure $^{13}$C diamond (atomic mass 13.003) has its line at ______ cm$^{-1}$ (to one decimal place).',
      answer: 1279.6, tol: 0.5, unit: 'cm⁻¹', calc: () => 1332 * Math.sqrt(12 / 13.00335),
      sol: '$1332\\times\\sqrt{12/13.003} = 1332\\times0.96064 = 1279.6$ cm$^{-1}$ (measured about 1281 cm$^{-1}$). Raman isotope shifts are used to check isotopic purity.',
      trap: 'Optical phonon frequencies scale with $m^{-1/2}$, like molecular vibrations.' },
    { id: 'rmn-040', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'coherent raman',
      q: 'In coherent anti-Stokes Raman scattering (CARS), pump and Stokes beams at $\\omega_p$ and $\\omega_s$ drive a Raman mode when $\\omega_p - \\omega_s = \\omega_v$. The signal appears at',
      options: ['$\\omega_p + \\omega_s$', '$\\omega_p - \\omega_v$', '$2\\omega_p - \\omega_s$', '$2\\omega_s - \\omega_p$'], answer: 2,
      sol: 'The beat between pump and Stokes drives the vibration coherently; a second pump photon scatters off it to $\\omega_p + \\omega_v = 2\\omega_p - \\omega_s$. The signal is a laser-like beam on the anti-Stokes side, free of fluorescence (which is red-shifted).',
      trap: '$2\\omega_s - \\omega_p$ is the coherent Stokes (CSRS) signal.' },
  ],

  gens: [
    { id: 'rmn-g01', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'stokes and anti-stokes',
      make(r) {
        const [lname, lam] = choose(r, LASERS), [mname, sh] = choose(r, MODES), side = choose(r, ['Stokes', 'anti-Stokes']);
        const v0 = 1e7 / lam, v = side === 'Stokes' ? v0 - sh : v0 + sh, L = 1e7 / v;
        return { q: `Laser light at ${lam} nm (${lname}) excites the ${sh} cm$^{-1}$ Raman band of ${mname}. The ${side} line is at ______ nm (to one decimal place).`,
          answer: round(L, 1), tol: 0.2, unit: 'nm', lam, sh, side,
          sol: `$\\tilde\\nu_0 = 10^7/${lam} = ${round(v0, 1)}$ cm$^{-1}$. ${side}: $${round(v0, 1)} ${side === 'Stokes' ? '-' : '+'} ${sh} = ${round(v, 1)}$ cm$^{-1}$, so $\\lambda = 10^7/${round(v, 1)} = ${round(L, 1)}$ nm.`,
          trap: 'Add or subtract the shift in wavenumbers, then convert back.' };
      },
      verify: (p) => 1e7 / (1e7 / p.lam + (p.side === 'Stokes' ? -p.sh : p.sh)) },
    { id: 'rmn-g02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'rotational raman',
      make(r) {
        const B = pick(r, 0.1, 20, 0.001), mode = choose(r, ['line', 'spacing', 'B']), J = int(r, 0, 10);
        const ans = mode === 'line' ? 4 * B * (J + 1.5) : mode === 'spacing' ? 4 * B : B;
        const first = round(6 * B, 3);
        return { q: mode === 'line' ? `A linear molecule (all $J$ present) has $B = ${B}$ cm$^{-1}$. The rotational Raman line S(${J}) is shifted by ______ cm$^{-1}$ (to three significant figures).`
          : mode === 'spacing' ? `For a heteronuclear linear molecule with $B = ${B}$ cm$^{-1}$, adjacent rotational Raman Stokes lines are ______ cm$^{-1}$ apart (to three significant figures).`
          : `The first Stokes line of the pure rotational Raman spectrum of a heteronuclear linear molecule is shifted by ${first} cm$^{-1}$ from the exciting line. Its rotational constant $B$ is ______ cm$^{-1}$ (to three significant figures).`,
          answer: mode === 'B' ? +(first / 6).toPrecision(3) : +ans.toPrecision(3), tol: +(Math.abs(ans) * 0.005).toPrecision(2), unit: 'cm⁻¹', B, J, mode, first,
          sol: mode === 'line' ? `S($J$) shift $= 4B(J + \\tfrac32) = 4\\times${B}\\times${J + 1.5} = ${round(ans, 4)}$ cm$^{-1}$.` : mode === 'spacing' ? `S($J$) shifts are $4B(J + \\tfrac32)$, so the spacing is $4B = ${round(4 * B, 4)}$ cm$^{-1}$.` : `S(0) is at $6B$, so $B = ${first}/6 = ${round(first / 6, 4)}$ cm$^{-1}$.`,
          trap: 'Raman: first line $6B$, spacing $4B$ (microwave: first line $2B$, spacing $2B$).' };
      },
      verify: (p) => (p.mode === 'line' ? 4 * p.B * (p.J + 1.5) : p.mode === 'spacing' ? 4 * p.B : p.first / 6) },
    { id: 'rmn-g03', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'intensity ratio',
      make(r) {
        const [mname, sh] = choose(r, MODES), [, lam] = choose(r, LASERS), T = choose(r, [77, 200, 300, 400, 600, 800, 1000, 1500]);
        const nu4 = choose(r, [true, false]);
        const v0 = 1e7 / lam, b = Math.exp(-C2 * sh / T), f = ((v0 + sh) / (v0 - sh)) ** 4, ans = nu4 ? f * b : b;
        return { q: `For the ${sh} cm$^{-1}$ Raman band of ${mname} at ${T} K${nu4 ? `, excited at ${lam} nm,` : ''} the anti-Stokes to Stokes intensity ratio ${nu4 ? 'including the $\\nu^4$ factor, $\\left(\\dfrac{\\tilde\\nu_0 + \\tilde\\nu_v}{\\tilde\\nu_0 - \\tilde\\nu_v}\\right)^4e^{-hc\\tilde\\nu_v/kT}$,' : 'from the Boltzmann factor alone'} is ______ (to three significant figures). Use $hc/k = 1.4388$ cm K.`,
          answer: +ans.toPrecision(3), tol: +(ans * 0.01).toPrecision(2), sh, T, lam, nu4,
          sol: `$hc\\tilde\\nu_v/kT = 1.4388\\times${sh}/${T} = ${round(C2 * sh / T, 4)}$, Boltzmann factor $${(+b.toPrecision(4))}$.${nu4 ? ` $\\tilde\\nu_0 = ${round(v0, 1)}$ cm$^{-1}$; $(${round(v0 + sh, 1)}/${round(v0 - sh, 1)})^4 = ${round(f, 4)}$. Product: ${+ans.toPrecision(4)}.` : ''}`,
          trap: 'Anti-Stokes starts from $v = 1$: its relative population is the Boltzmann factor.' };
      },
      verify: (p) => { const v0 = 1e7 / p.lam, b = Math.exp(-C2 * p.sh / p.T); return p.nu4 ? ((v0 + p.sh) / (v0 - p.sh)) ** 4 * b : b; } },
    { id: 'rmn-g04', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'raman thermometry',
      make(r) {
        const [mname, sh] = choose(r, MODES.filter((m) => m[1] < 1600)), T = pick(r, 250, 1200, 10);
        const ratio = +Math.exp(-C2 * sh / T).toPrecision(3);
        const Tc = C2 * sh / Math.log(1 / ratio);
        return { q: `For the ${sh} cm$^{-1}$ band of ${mname}, the anti-Stokes to Stokes intensity ratio, already corrected for the $\\nu^4$ factor, is measured as ${ratio}. The temperature is ______ K (to three significant figures). Use $hc/k = 1.4388$ cm K.`,
          answer: +Tc.toPrecision(3), tol: +(Tc * 0.006).toPrecision(2), unit: 'K', sh, ratio,
          sol: `$${ratio} = e^{-hc\\tilde\\nu/kT}$, so $T = \\dfrac{1.4388\\times${sh}}{\\ln(1/${ratio})} = \\dfrac{${round(C2 * sh, 2)}}{${round(Math.log(1 / ratio), 4)}} = ${+Tc.toPrecision(4)}$ K.`,
          trap: 'Take the logarithm of $1/\\text{ratio}$ (a positive number).' };
      },
      verify: (p) => C2 * p.sh / Math.log(1 / p.ratio) },
    { id: 'rmn-g05', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'raman shift',
      make(r) {
        const [, lam] = choose(r, LASERS), sh = pick(r, 100, 3500, 1), side = choose(r, ['Stokes', 'anti-Stokes']);
        const L = round(1e7 / (1e7 / lam + (side === 'Stokes' ? -sh : sh)), 2);
        const d = Math.abs(1e7 / lam - 1e7 / L);
        return { q: `A Raman spectrum excited at ${lam} nm shows a line at ${L} nm. The Raman shift of this ${side} line is ______ cm$^{-1}$ (to the nearest integer).`,
          answer: Math.round(d), tol: 1, unit: 'cm⁻¹', lam, L,
          sol: `$|10^7/${lam} - 10^7/${L}| = |${round(1e7 / lam, 2)} - ${round(1e7 / L, 2)}| = ${round(d, 1)}$ cm$^{-1}$.`,
          trap: 'Convert both wavelengths to wavenumbers before subtracting.' };
      },
      verify: (p) => Math.abs(1e7 / p.lam - 1e7 / p.L) },
    { id: 'rmn-g06', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'raman activity',
      make(r) {
        const pool = [['the N$_2$ stretch', 1], ['the HCl stretch', 1], ['the CO$_2$ symmetric stretch', 1], ['the CO$_2$ antisymmetric stretch', 0], ['the CO$_2$ bend', 0], ['the H$_2$O bend', 1], ['the CH$_4$ symmetric (breathing) stretch', 1], ['the O$_2$ stretch', 1], ['the C≡C stretch of acetylene (symmetric)', 1], ['the antisymmetric C-H stretch of acetylene', 0], ['the ring-breathing mode of benzene', 1], ['the $T_{1u}$ S-F stretch of SF$_6$', 0], ['the trans-bend of acetylene ($\\pi_g$)', 1], ['the cis-bend of acetylene ($\\pi_u$)', 0]];
        const yes = pool.filter((x) => x[1]), no = pool.filter((x) => !x[1]);
        const k = int(r, 1, 3), ch = shuffle(r, [...shuffle(r, yes).slice(0, k), ...shuffle(r, no).slice(0, 4 - k)]);
        return { q: 'Which of these vibrations are Raman active?',
          options: ch.map((x) => x[0][0].toUpperCase() + x[0].slice(1)), answer: ch.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0),
          sol: 'Raman activity needs a change in polarisability; in centrosymmetric molecules that means gerade modes only (mutual exclusion). ' + ch.map((x) => `${x[0][0].toUpperCase() + x[0].slice(1)}: ${x[1] ? 'Raman active' : 'Raman inactive (ungerade, IR active)'}.`).join(' '),
          trap: 'For centrosymmetric molecules, a mode that is IR active cannot be Raman active.' };
      } },
    { id: 'rmn-g07', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'nu^4 law',
      make(r) {
        const ls = shuffle(r, LASERS.map((x) => x[1])).slice(0, 2), sh = pick(r, 200, 3000, 1);
        const [l1, l2] = ls, f = ((1e7 / l2 - sh) / (1e7 / l1 - sh)) ** 4;
        return { q: `A Raman band at ${sh} cm$^{-1}$ is recorded with equal laser power first at ${l1} nm and then at ${l2} nm. Using the $\\nu^4$ law for the scattered (Stokes) frequency, the second signal is ______ times the first (to three significant figures), ignoring detector response and resonance effects.`,
          answer: +f.toPrecision(3), tol: +(f * 0.006).toPrecision(2), l1, l2, sh,
          sol: `Scattered wavenumbers: $10^7/${l1} - ${sh} = ${round(1e7 / l1 - sh, 1)}$ and $10^7/${l2} - ${sh} = ${round(1e7 / l2 - sh, 1)}$ cm$^{-1}$. Ratio $(${round(1e7 / l2 - sh, 1)}/${round(1e7 / l1 - sh, 1)})^4 = ${+f.toPrecision(4)}$.`,
          trap: 'Use the frequency of the scattered light, not just the laser (the difference matters for large shifts).' };
      },
      verify: (p) => ((1e7 / p.l2 - p.sh) / (1e7 / p.l1 - p.sh)) ** 4 },
    { id: 'rmn-g08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'rotational raman',
      make(r) {
        const v0 = pick(r, 9000, 30000, 1), B = pick(r, 0.2, 10, 0.01), J = int(r, 0, 8), side = choose(r, ['Stokes', 'anti-Stokes']);
        const s = 4 * B * (J + 1.5), v = side === 'Stokes' ? v0 - s : v0 + s;
        return { q: `A linear molecule with $B = ${B}$ cm$^{-1}$ is excited at ${v0} cm$^{-1}$. The ${side} rotational Raman line involving the levels $J = ${J}$ and $J = ${J + 2}$ appears at an absolute wavenumber of ______ cm$^{-1}$ (to two decimal places).`,
          answer: round(v, 2), tol: 0.02, unit: 'cm⁻¹', v0, B, J, side,
          sol: `The shift is $F(${J + 2}) - F(${J}) = 4B(J + \\tfrac32) = ${round(s, 3)}$ cm$^{-1}$. ${side === 'Stokes' ? `Stokes ($${J}\\to${J + 2}$): $${v0} - ${round(s, 3)}$` : `Anti-Stokes ($${J + 2}\\to${J}$): $${v0} + ${round(s, 3)}$`} $= ${round(v, 2)}$ cm$^{-1}$.`,
          trap: 'Anti-Stokes lines start from the upper level and lie above the laser.' };
      },
      verify: (p) => p.v0 + (p.side === 'Stokes' ? -1 : 1) * 4 * p.B * (p.J + 1.5) },
    { id: 'rmn-g09', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'mutual exclusion',
      make(r) {
        const [name, centro] = choose(r, [['CO$_2$', 1], ['C$_2$H$_2$ (acetylene)', 1], ['benzene', 1], ['SF$_6$', 1], ['trans-N$_2$F$_2$', 1], ['ethylene', 1], ['H$_2$O', 0], ['NH$_3$', 0], ['CH$_4$', 0], ['HCN', 0], ['N$_2$O (N-N-O)', 0], ['SO$_2$', 0], ['CH$_3$Cl', 0]]);
        const right = centro ? 'No vibration is both IR and Raman active (mutual exclusion holds)' : 'Some vibrations can be both IR and Raman active';
        const all = ['No vibration is both IR and Raman active (mutual exclusion holds)', 'Some vibrations can be both IR and Raman active', 'All its vibrations are Raman inactive', 'All its vibrations are IR inactive'];
        const o = mcqOptions(r, right, all.filter((x) => x !== right), (v) => v);
        return { q: `Which statement is true for the vibrations of ${name}?`, options: o.options, answer: o.answer,
          sol: `${name} ${centro ? 'has a centre of inversion, so every mode is $g$ (Raman active only) or $u$ (IR active only)' : 'has no centre of inversion, so a mode can change both the dipole moment and the polarisability'}. Every polyatomic molecule has at least one IR-active and at least one Raman-active mode (the totally symmetric stretch is always Raman active).`,
          trap: 'Linear is not enough: N$_2$O and HCN are linear but not centrosymmetric.' };
      } },
    { id: 'rmn-g10', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'depolarisation',
      make(r) {
        const Ipar = pick(r, 20, 200, 1), rho = choose(r, [0.01, 0.02, 0.05, 0.1, 0.2, 0.3, 0.5, 0.6, 0.75, 0.75, 0.75]);
        const Iper = round(Ipar * rho, 2), ratio = round(Iper / Ipar, 3);
        const right = ratio < 0.74 ? `$\\rho = ${ratio}$: polarised, a totally symmetric vibration` : `$\\rho = ${ratio}$: depolarised, a non-totally symmetric vibration`;
        const wrong = [ratio < 0.74 ? `$\\rho = ${ratio}$: depolarised, a non-totally symmetric vibration` : `$\\rho = ${ratio}$: polarised, a totally symmetric vibration`, `$\\rho = ${round(Ipar / Iper, 3)}$: polarised, a totally symmetric vibration`, `$\\rho = ${round(Ipar / Iper, 3)}$: depolarised, a non-totally symmetric vibration`];
        const o = mcqOptions(r, right, wrong, (v) => v);
        return { q: `With linearly polarised excitation, a Raman band gives intensity ${Ipar} (analyser parallel to the laser polarisation) and ${Iper} (perpendicular), in the same units. The depolarisation ratio and its meaning are`, options: o.options, answer: o.answer,
          sol: `$\\rho = I_\\perp/I_\\parallel = ${Iper}/${Ipar} = ${ratio}$. Non-totally symmetric modes give exactly $\\rho = 3/4$; totally symmetric modes give $\\rho < 3/4$. So the band is ${ratio < 0.74 ? 'polarised: totally symmetric' : 'depolarised: non-totally symmetric'}.`,
          trap: '$\\rho$ is perpendicular over parallel, never the other way.' };
      } },
    { id: 'rmn-g11', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'rotational raman',
      make(r) {
        const [name, m, rr, spin] = choose(r, [['$^{14}$N$_2$', 14.003074, 109.77, 0], ['$^{35}$Cl$_2$', 34.968853, 198.8, 0], ['$^{1}$H$_2$', 1.007825, 74.14, 0], ['$^{16}$O$_2$', 15.994915, 120.75, 1], ['$^{19}$F$_2$', 18.998403, 141.2, 0]]);
        const mu = m / 2, B = IB / (mu * (rr / 100) ** 2), sp = round((spin ? 8 : 4) * B, 3);
        const ans = Math.sqrt(IB / ((sp / (spin ? 8 : 4)) * mu)) * 100;
        return { q: `Adjacent observed lines in the rotational Raman spectrum of ${name} are ${sp} cm$^{-1}$ apart${spin ? ' (only odd rotational levels exist, so alternate lines are missing)' : ' (all $J$ appear, alternating in intensity)'}. With atomic mass ${m} u and $I\\,(\\text{u Å}^2) = 16.858/B$, the bond length is ______ pm (to one decimal place).`,
          answer: round(ans, 1), tol: Math.max(0.2, round(ans * 0.002, 1)), unit: 'pm', sp, m, spin,
          sol: `${spin ? 'Only every other line is present, so the spacing is $8B$' : 'The spacing is $4B$'}: $B = ${sp}/${spin ? 8 : 4} = ${round(sp / (spin ? 8 : 4), 4)}$ cm$^{-1}$. $\\mu = m/2 = ${round(mu, 4)}$ u. $I = 16.858/B = ${round(IB / (sp / (spin ? 8 : 4)), 4)}$ u Å$^2$, $r = \\sqrt{I/\\mu} = ${round(ans / 100, 4)}$ Å $= ${round(ans, 1)}$ pm.`,
          trap: 'Homonuclear: $\\mu = m/2$. And check whether alternate lines are missing.' };
      },
      verify: (p) => Math.sqrt(IB / ((p.sp / (p.spin ? 8 : 4)) * (p.m / 2))) * 100 },
    { id: 'rmn-g12', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'vibrational raman',
      make(r) {
        const v0 = pick(r, 500, 4200, 0.1), B = pick(r, 0.5, 15, 0.01), br = choose(r, ['S', 'O']), J = br === 'S' ? int(r, 0, 8) : int(r, 2, 10);
        const s = br === 'S' ? v0 + 4 * B * (J + 1.5) : v0 - 4 * B * (J - 0.5);
        return { q: `In the vibrational Raman band of a diatomic molecule the Q-branch origin is at a shift of ${v0} cm$^{-1}$, and $B = ${B}$ cm$^{-1}$ in both vibrational levels. The ${br}(${J}) line is at a Raman shift of ______ cm$^{-1}$ (to two decimal places).`,
          answer: round(s, 2), tol: 0.02, unit: 'cm⁻¹', v0, B, J, br,
          sol: br === 'S' ? `S($J$): $J\\to J+2$, shift $= \\tilde\\nu_0 + B[(J+2)(J+3) - J(J+1)] = \\tilde\\nu_0 + 4B(J + \\tfrac32) = ${v0} + ${round(4 * B * (J + 1.5), 3)} = ${round(s, 2)}$ cm$^{-1}$.`
            : `O($J$): $J\\to J-2$, shift $= \\tilde\\nu_0 + B[(J-2)(J-1) - J(J+1)] = \\tilde\\nu_0 - 4B(J - \\tfrac12) = ${v0} - ${round(4 * B * (J - 0.5), 3)} = ${round(s, 2)}$ cm$^{-1}$.`,
          trap: 'O(0) and O(1) do not exist; the label is the lower-level $J$.' };
      },
      verify: (p) => (p.br === 'S' ? p.v0 + p.B * ((p.J + 2) * (p.J + 3) - p.J * (p.J + 1)) : p.v0 + p.B * ((p.J - 2) * (p.J - 1) - p.J * (p.J + 1))) },
    ...more,
  ],
};
