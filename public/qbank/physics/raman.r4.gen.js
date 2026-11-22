// Round 4 extras for raman: original questions, written 2026-11-22.
import { pick, int, choose, mcqOptions, round } from '../_util.js';
const R = String.raw;

const LASERS = [405, 457.9, 488, 514.5, 532, 632.8, 785, 1064];
const wn = (nm) => 1e7 / nm;
/** Raman-shifter gases: name, shift (cm^-1). */
const GAS = [['H$_2$', 4155], ['D$_2$', 2987], ['CH$_4$', 2917], ['N$_2$', 2331]];

export default {
  items: [
    { id: 'rmn-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'raman shift',
      q: R`The horizontal axis of a Raman spectrum is usually labelled "Raman shift (cm$^{-1}$)". This quantity is`,
      options: [R`the wavenumber of the scattered light`, R`the wavelength difference between laser and scattered light, in cm`,
        R`the wavenumber of the laser minus the wavenumber of the scattered light`, R`the frequency of the laser divided by $c$`], answer: 2,
      sol: R`Raman shift $\Delta\tilde\nu = \tilde\nu_\text{laser} - \tilde\nu_\text{scattered}$ (with $\tilde\nu = 1/\lambda$). It equals the energy given to (Stokes, positive) or taken from (anti-Stokes, negative) the molecule, in wavenumbers, and does not depend on which laser is used.`,
      trap: R`A difference of wavelengths is not proportional to an energy difference; only wavenumbers subtract simply.` },
    { id: 'rmn-r4-02', type: 'nat', level: 2, exams: ['gate', 'net'], sub: 'units', unit: 'nm',
      q: R`Near a wavelength of $550$ nm, a spectral interval of $1$ cm$^{-1}$ corresponds to ______ nm (three significant figures).`,
      answer: 0.0303, tol: 0.0003, calc: () => (550e-7) ** 2 * 1 * 1e7,
      sol: R`From $\tilde\nu = 1/\lambda$: $|d\lambda| = \lambda^2|d\tilde\nu|$. $\lambda = 5.50\times10^{-5}$ cm, so $\lambda^2 = 3.025\times10^{-9}$ cm$^2$; times 1 cm$^{-1}$ gives $3.025\times10^{-9}$ cm $= 0.0303$ nm. A Raman spectrometer that must resolve a few cm$^{-1}$ in the visible therefore needs about 0.1 nm resolution.`,
      trap: R`$1/(1\ \text{cm}^{-1}) = 1$ cm is not a wavelength interval; use the derivative $\lambda^2\,d\tilde\nu$.` },
    { id: 'rmn-r4-03', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'raman and fluorescence',
      q: R`A sample shows a band in the scattered light. Which test best decides whether the band is Raman scattering or fluorescence?`,
      options: [R`Change the laser wavelength: a Raman band moves with the laser (same shift in cm$^{-1}$), a fluorescence band stays at the same wavelength`,
        R`Measure the band's width: Raman bands are always broader`, R`Cool the sample: Raman bands disappear`, R`Raise the laser power: only fluorescence grows`], answer: 0,
      sol: R`Raman scattering keeps a fixed energy difference from the laser, so if the laser moves by 10 nm the band moves by about the same amount. Fluorescence comes from a fixed excited state and stays at the same absolute wavelength. Both grow with laser power; Raman bands are usually narrower; Stokes Raman lines survive cooling.`,
      trap: R`Intensity tests do not separate them; the dependence on excitation wavelength does.` },
    { id: 'rmn-r4-04', type: 'mcq', level: 3, exams: ['jam', 'gate', 'net'], sub: 'stokes and anti-stokes',
      q: R`A polymer is excited at $785.0$ nm. Its strong band has a Raman shift of $1001$ cm$^{-1}$. The corresponding anti-Stokes line is at`,
      options: [R`$852.0$ nm`, R`$727.8$ nm`, R`$722.0$ nm`, R`$784.0$ nm`], answer: 1,
      sol: R`$\tilde\nu_\text{laser} = 10^7/785.0 = 12\,738.9$ cm$^{-1}$. Anti-Stokes: $12\,738.9 + 1001 = 13\,739.9$ cm$^{-1}$, so $\lambda = 10^7/13\,739.9 = 727.8$ nm. (The Stokes line is at $10^7/11\,737.9 = 852.0$ nm.)`,
      trap: R`$852.0$ nm is the Stokes line; anti-Stokes lies on the blue side.` },
    { id: 'rmn-r4-05', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'raman in crystals',
      q: R`First-order Raman scattering from a crystal such as silicon gives a single sharp line (520 cm$^{-1}$) rather than a band covering all optical phonon energies. The reason is that`,
      options: [R`silicon has only one optical phonon energy at all wavevectors`, R`only acoustic phonons are Raman active`,
        R`the laser heats the crystal to a single temperature`, R`momentum conservation limits the phonon wavevector to about that of light, tiny next to the Brillouin zone, so only zone-centre phonons are seen`], answer: 3,
      sol: R`In one-phonon scattering $\vec k_i = \vec k_s + \vec q$, so $|\vec q|\le2k_i\approx2\times10^7$ m$^{-1}$, while the zone boundary is near $\pi/a\approx6\times10^9$ m$^{-1}$. The phonon is effectively at $q = 0$, where the optical branch has one energy. Second-order (two-phonon) scattering can use $\vec q$ and $-\vec q$ anywhere in the zone, which is why it gives broad bands.`,
      trap: R`Optical phonon branches do disperse across the zone; the single line comes from the selection of $q\approx0$.` },
    { id: 'rmn-r4-06', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'light scattering', format: 'statements',
      q: R`Which statements about light scattering from a solid or liquid are correct?`,
      options: [R`Brillouin scattering comes from acoustic waves and gives shifts of order GHz, far below typical Raman shifts`,
        R`Rayleigh scattering is elastic: no energy is exchanged with the material`,
        R`First-order Raman scattering in a crystal comes from optical phonons`,
        R`Brillouin shifts do not depend on the scattering angle`], answer: [0, 1, 2],
      sol: R`Brillouin scattering is a Doppler shift from sound waves: $\Delta\nu = 2nv_s\sin(\theta/2)/\lambda$, a few to tens of GHz (well under 1 cm$^{-1}$) and it clearly depends on the angle $\theta$. Rayleigh light keeps the laser frequency. Raman in crystals probes optical phonons at the zone centre (hundreds of cm$^{-1}$).`,
      trap: R`The acoustic wavevector probed is fixed by the geometry, so changing the angle changes the Brillouin shift.` },
    { id: 'rmn-r4-07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'raman shifters', unit: 'nm',
      q: R`A cell of compressed H$_2$ pumped by a $532.0$ nm laser produces stimulated Raman lines shifted by multiples of $4155$ cm$^{-1}$. The second Stokes line is at ______ nm (one decimal place).`,
      answer: 953.6, tol: 0.2, calc: () => 1e7 / (1e7 / 532 - 2 * 4155),
      sol: R`$\tilde\nu_\text{pump} = 10^7/532.0 = 18\,797.0$ cm$^{-1}$. The first Stokes beam ($14\,642.0$ cm$^{-1}$) is strong enough to be shifted again, giving $18\,797.0 - 2\times4155 = 10\,487.0$ cm$^{-1}$, i.e. $953.6$ nm. Such cells turn one laser into a ladder of wavelengths.`,
      trap: R`Subtracting $2\times4155$ cm$^{-1}$ as a wavelength (or doubling the first-Stokes wavelength) gives nonsense; work in wavenumbers.` },
    { id: 'rmn-r4-08', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'spectrometer range', unit: 'cm⁻¹',
      q: R`A Raman spectrometer with $532.0$ nm excitation has a detector covering $540.0$ to $600.0$ nm. The largest Stokes Raman shift it can record is ______ cm$^{-1}$ (nearest whole number).`,
      answer: 2130, tol: 2, calc: () => 1e7 / 532 - 1e7 / 600,
      sol: R`The largest shift corresponds to the longest wavelength: $\Delta\tilde\nu = 10^7/532.0 - 10^7/600.0 = 18\,797.0 - 16\,666.7 = 2130$ cm$^{-1}$. (The short end, 540 nm, sets the smallest shift: $278$ cm$^{-1}$.) To see C-H stretches near 2900 cm$^{-1}$ the window must reach about 630 nm.`,
      trap: R`$600 - 532 = 68$ nm is not proportional to a shift; convert each end to wavenumbers.` },
    { id: 'rmn-r4-09', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'nuclear spin statistics',
      q: R`In the pure rotational Raman spectrum of $^{16}$O$_2$ alternate lines are missing. For the isotopologue $^{16}$O$^{18}$O,`,
      options: [R`alternate lines are still missing, and the line spacing is larger`, R`no lines are missing, and the line spacing is slightly smaller`,
        R`alternate lines are still missing, with the same spacing`, R`there is no rotational Raman spectrum`], answer: 1,
      sol: R`The missing lines in $^{16}$O$_2$ come from exchanging two identical spin-0 nuclei: only levels of one exchange symmetry exist. In $^{16}$O$^{18}$O the nuclei differ, so there is no exchange restriction and every rotational level exists. The reduced mass rises from 8.00 to 8.47 u, so $B$ and the line spacing ($4B$) drop by about 6%. The polarisability is still anisotropic, so the spectrum is there.`,
      trap: R`Missing lines are a symmetry effect of identical nuclei, not a property of oxygen atoms as such.` },
    { id: 'rmn-r4-10', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'vibrational raman', unit: 'cm⁻¹',
      q: R`In the vibrational Raman band of N$_2$, take $B = 1.99$ cm$^{-1}$ in both vibrational levels. The O($J$) lines have $\Delta J = -2$ and the S($J$) lines $\Delta J = +2$. The gap between the lines O(2) and S(0) is ______ cm$^{-1}$ (two decimal places).`,
      answer: 23.88, tol: 0.03, calc: () => 12 * 1.99,
      sol: R`Shift $= \tilde\nu_0 + B[J'(J'+1) - J(J+1)]$. S(0): $J = 0\to J' = 2$: $\tilde\nu_0 + 6B$. O(2): $J = 2\to J' = 0$: $\tilde\nu_0 - 6B$. Gap $= 12B = 23.88$ cm$^{-1}$. The Q branch ($\Delta J = 0$) sits in between, at $\tilde\nu_0$, since the two $B$ values are taken equal.`,
      trap: R`Using $4B$, the spacing between neighbouring S lines, gives the wrong gap; across the Q branch the first lines are $12B$ apart.` },
    { id: 'rmn-r4-11', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'raman activity',
      q: R`Acetylene, H-C$\equiv$C-H (linear, centre of symmetry), has five distinct fundamentals: two $\Sigma_g^+$ stretches, one $\Sigma_u^+$ stretch, one $\Pi_g$ bend and one $\Pi_u$ bend. How many of these five are Raman active?`,
      options: [R`$2$`, R`$5$`, R`$3$`, R`$4$`], answer: 2,
      sol: R`The polarisability transforms like products $x^2$, $z^2$, $xz$, ..., which are all even ($g$) under inversion. So only $g$ modes can be Raman active: the two $\Sigma_g^+$ stretches and the $\Pi_g$ trans-bend, three in all. The $u$ modes ($\Sigma_u^+$ and $\Pi_u$) are infrared active instead (mutual exclusion).`,
      trap: R`A doubly degenerate $\Pi$ mode counts once as a fundamental frequency.` },
    { id: 'rmn-r4-12', type: 'msq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'raman activity',
      q: R`Which of these can be measured with Raman spectroscopy?`,
      options: [R`The vibration of N$_2$ molecules in air`, R`The rotational constant of CO$_2$`, R`The optical phonon of silicon`, R`The bending fundamental of CO$_2$ at 667 cm$^{-1}$`], answer: [0, 1, 2],
      sol: R`N$_2$'s stretch changes its polarisability (Raman active, 2331 cm$^{-1}$), though it has no IR band. CO$_2$ has an anisotropic polarisability, so it has a rotational Raman spectrum (lines $4B$ apart, $B = 0.390$ cm$^{-1}$). Silicon's 520 cm$^{-1}$ optical phonon is the standard Raman calibration line. The CO$_2$ bend is antisymmetric under inversion ($\Pi_u$): IR active, Raman inactive.`,
      trap: R`CO$_2$ has no rotational microwave spectrum but does have a rotational Raman spectrum.` },
  ],
  gens: [
    { id: 'rmn-r4g1', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'spectrometer range',
      make(r) {
        const L = choose(r, LASERS), lo = round(L + pick(r, 3, 15, 0.5), 1), hi = round(L * pick(r, 1.06, 1.25, 0.01), 1);
        const big = r() < 0.6;
        const ans = wn(L) - wn(big ? hi : lo);
        return { q: R`A Raman spectrometer uses a $${L}$ nm laser and records Stokes light from $${lo}$ to $${hi}$ nm. The ${big ? 'largest' : 'smallest'} Raman shift it can record is ______ cm$^{-1}$ (nearest whole number).`,
          answer: Math.round(ans), tol: 2, unit: 'cm⁻¹', L, lo, hi, big,
          sol: R`Shift $= 10^7/\lambda_\text{laser} - 10^7/\lambda$. The ${big ? 'largest' : 'smallest'} shift goes with the ${big ? 'longest' : 'shortest'} wavelength, $${big ? hi : lo}$ nm: $${round(wn(L), 1)} - ${round(wn(big ? hi : lo), 1)} = ${Math.round(ans)}$ cm$^{-1}$.`,
          trap: 'Convert each wavelength to wavenumbers before subtracting.' };
      },
      verify: (p) => wn(p.L) - wn(p.big ? p.hi : p.lo) },
    { id: 'rmn-r4g2', type: 'mcq', level: 2, exams: ['jam', 'gate', 'net'], sub: 'stokes and anti-stokes',
      make(r) {
        const L = choose(r, LASERS), shift = pick(r, 200, 3200, 1), stokes = r() < 0.5;
        const lam = round(1e7 / (wn(L) + (stokes ? -shift : shift)), 2);
        const s = Math.round(Math.abs(wn(L) - wn(lam)));
        const lab = (k, v) => `${k}, $${v}$ cm$^{-1}$`;
        const right = lab(stokes ? 'Stokes' : 'anti-Stokes', s);
        const naive = Math.round(Math.abs(lam - L) * 1e7 / (L * L)) === s ? Math.round(s * 1.1) : Math.round(Math.abs(lam - L) * 1e7 / (L * L));
        const o = mcqOptions(r, right, [lab(stokes ? 'anti-Stokes' : 'Stokes', s), lab(stokes ? 'Stokes' : 'anti-Stokes', naive), lab(stokes ? 'anti-Stokes' : 'Stokes', naive), lab(stokes ? 'Stokes' : 'anti-Stokes', Math.round(s / 2))]);
        return { q: R`With $${L}$ nm excitation, a Raman line is observed at $${lam}$ nm. The line is`, ...o,
          sol: R`$10^7/${L} = ${round(wn(L), 1)}$ cm$^{-1}$ and $10^7/${lam} = ${round(wn(lam), 1)}$ cm$^{-1}$. The scattered light is at ${stokes ? 'longer wavelength (lower energy): Stokes' : 'shorter wavelength (higher energy): anti-Stokes'}, shifted by $${s}$ cm$^{-1}$.`,
          trap: 'Stokes lines are on the red (long-wavelength) side; compute the shift in wavenumbers, not from the nm difference with the laser wavelength alone.' };
      } },
    { id: 'rmn-r4g3', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'raman shifters',
      make(r) {
        const L = choose(r, [355, 532, 1064, 308, 266]), [gas, sh] = choose(r, GAS), n = int(r, 1, 3);
        const stokes = L === 1064 ? false : r() < 0.6;
        const nu = wn(L) + (stokes ? -n : n) * sh;
        const lam = 1e7 / nu;
        const ord = ['first', 'second', 'third'][n - 1];
        return { q: R`A ${gas} Raman cell (shift $${sh}$ cm$^{-1}$) is pumped at $${L}$ nm. The ${ord} ${stokes ? 'Stokes' : 'anti-Stokes'} line is at ______ nm (one decimal place).`,
          answer: round(lam, 1), tol: Math.max(0.2, round(lam * 0.0003, 1)), unit: 'nm', L, sh, n, stokes,
          sol: R`$\tilde\nu = 10^7/${L} ${stokes ? '-' : '+'} ${n}\times${sh} = ${round(wn(L), 1)} ${stokes ? '-' : '+'} ${n * sh} = ${round(nu, 1)}$ cm$^{-1}$, so $\lambda = 10^7/${round(nu, 1)} = ${round(lam, 1)}$ nm.`,
          trap: 'Each order adds the same shift in wavenumbers, not the same step in wavelength.' };
      },
      verify: (p) => 1e7 / (1e7 / p.L + (p.stokes ? -p.n : p.n) * p.sh) },
  ],
};
