// Round 4 extras for electronic-spectra: original questions, written 2026-11-22.
import { pick, int, choose, round } from '../_util.js';
const R = String.raw;

const RY = 109737.3, EVCM = 1.239842e-4; // eV per cm^-1
/** Second-row diatomics: label, valence electrons (2s and 2p shells). */
const MOL = [['Li$_2$', 2], ['Be$_2$', 4], ['B$_2$', 6], ['C$_2$', 8], ['N$_2$', 10], ['N$_2^+$', 9], ['O$_2$', 12], ['O$_2^+$', 11], ['O$_2^-$', 13], ['O$_2^{2-}$', 14],
  ['F$_2$', 14], ['F$_2^+$', 13], ['CN', 9], ['CN$^-$', 10], ['NO', 11], ['NO$^+$', 10], ['NO$^-$', 12], ['CO', 10], ['C$_2^{2-}$', 10], ['Ne$_2$', 16]];
/** Bond order by filling sigma2s(b) sigma*2s(a) [pi2p sigma2p](b, 6) pi*2p(a, 4) sigma*2p(a, 2). */
const bo = (n) => { const cap = [[2, 1], [2, -1], [6, 1], [4, -1], [2, -1]]; let left = n, s = 0; for (const [c, w] of cap) { const k = Math.min(c, left); s += w * k; left -= k; } return s / 2; };

export default {
  items: [
    { id: 'els-r4-01', type: 'mcq', level: 1, exams: ['jam', 'gate', 'net'], sub: 'energy scales',
      q: R`When a gas-phase diatomic molecule absorbs an ultraviolet photon and jumps to an excited electronic state,`,
      options: [R`only the electronic state can change`, R`the electronic and rotational states can change, but never the vibrational state`,
        R`the electronic, vibrational and rotational states can all change together`, R`the molecule must dissociate`], answer: 2,
      sol: R`The excited electronic state has its own potential curve, so the vibrational overlap (Franck-Condon factors) lets many $v'$ be reached, and each vibronic band has rotational branches. That is why an electronic band system contains progressions of bands, each with fine rotational structure. Dissociation happens only for transitions above the upper state's dissociation limit or to repulsive states.`,
      trap: R`The $\Delta v = \pm1$ rule belongs to pure vibrational (infrared) spectra; in electronic transitions $\Delta v$ is not restricted.` },
    { id: 'els-r4-02', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'molecular orbitals',
      q: R`Using molecular orbital theory, the bond order of the superoxide ion O$_2^-$ is ______.`,
      answer: 1.5, tol: 0,
      sol: R`O$_2^-$ has 13 valence electrons: $\sigma_{2s}^2\sigma_{2s}^{*2}\sigma_{2p}^2\pi_{2p}^4\pi_{2p}^{*3}$. Bonding electrons $2 + 2 + 4 = 8$, antibonding $2 + 3 = 5$. Bond order $= (8 - 5)/2 = 1.5$. The extra electron enters $\pi^*$, so the bond is weaker and longer than in O$_2$ (bond order 2).`,
      trap: R`Adding an electron to O$_2$ does not strengthen the bond: it goes into an antibonding orbital.` },
    { id: 'els-r4-03', type: 'mcq', level: 2, exams: ['gate', 'net'], sub: 'Franck-Condon principle',
      q: R`In the absorption spectrum of a cold diatomic gas, the $0\leftarrow0$ band is by far the strongest member of the progression. This shows that`,
      options: [R`the equilibrium bond lengths of the two electronic states are nearly equal`, R`the upper state has a much longer bond`,
        R`the upper state is repulsive`, R`the transition is spin-forbidden`], answer: 0,
      sol: R`Electronic jumps are vertical (nuclei frozen). From $v'' = 0$, centred at $r_e''$, the overlap is largest with the $v'$ state centred at the same $r$. If $r_e'\approx r_e''$, the $v' = 0$ wavefunction overlaps best, so the $0-0$ band dominates and the progression is short. A much longer upper bond shifts the maximum to high $v'$; a repulsive upper state gives a continuum.`,
      trap: R`A strong $0-0$ band says nothing about spin; it is about the geometry of the two curves.` },
    { id: 'els-r4-04', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'Stokes shift', unit: 'cm⁻¹',
      q: R`A dye in solution absorbs most strongly at $490$ nm and fluoresces most strongly at $520$ nm. Its Stokes shift is ______ cm$^{-1}$ (nearest whole number).`,
      answer: 1177, tol: 3, calc: () => 1e7 / 490 - 1e7 / 520,
      sol: R`$10^7/490 = 20\,408$ cm$^{-1}$ and $10^7/520 = 19\,231$ cm$^{-1}$. Difference $= 1177$ cm$^{-1}$ (about 0.15 eV). It is the energy lost to vibrational relaxation and solvent rearrangement in the excited and ground states.`,
      trap: R`$520 - 490 = 30$ nm is a wavelength difference, not an energy; convert each to wavenumbers first.` },
    { id: 'els-r4-05', type: 'mcq', level: 3, exams: ['gate', 'net'], sub: 'molecular orbitals',
      q: R`Removing one electron (ionising) makes the chemical bond STRONGER for which of these molecules?`,
      options: [R`H$_2$`, R`N$_2$`, R`Li$_2$`, R`O$_2$`], answer: 3,
      sol: R`In O$_2$ the highest occupied orbital is the antibonding $\pi^*$. Removing an electron from it raises the bond order from 2 to 2.5, so O$_2^+$ has a shorter, stiffer bond (112 pm vs 121 pm). In H$_2$, N$_2$ and Li$_2$ the highest occupied orbital is bonding, so ionising weakens the bond.`,
      trap: R`Ionisation weakens a bond only when the electron comes from a bonding orbital.` },
    { id: 'els-r4-06', type: 'msq', level: 4, exams: ['gate', 'net'], sub: 'photoelectron spectra', format: 'statements',
      q: R`In the photoelectron spectrum of a diatomic molecule, each band corresponds to removing an electron from one molecular orbital. Which statements are correct?`,
      options: [R`Removing an electron from a strongly bonding orbital gives a long vibrational progression`,
        R`When a bonding electron is removed, the vibrational spacing in the band is smaller than in the neutral molecule`,
        R`By Koopmans' theorem, each ionisation energy is roughly the negative of the orbital energy`,
        R`The adiabatic ionisation energy is never smaller than the vertical one`], answer: [0, 1, 2],
      sol: R`Losing a bonding electron lengthens the bond, so by Franck-Condon many cation $v^+$ levels are reached (long progression) and the weaker bond vibrates more slowly. A non-bonding electron gives mostly the $0-0$ line. Koopmans' theorem (frozen orbitals) gives $I_k\approx-\epsilon_k$. The adiabatic energy (to $v^+ = 0$) is the lowest ionisation energy of a band; the vertical one (the most intense line) is equal or higher.`,
      trap: R`Adiabatic is the band's onset, vertical its peak: adiabatic $\le$ vertical.` },
    { id: 'els-r4-07', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'fluorescence kinetics',
      q: R`An excited molecule has a radiative lifetime of $5.0$ ns, but its measured fluorescence lifetime is $4.0$ ns. The non-radiative decay rate is ______ $\times10^7$ s$^{-1}$ (two decimal places).`,
      answer: 5, tol: 0.02, calc: () => (1 / 4e-9 - 1 / 5e-9) / 1e7,
      sol: R`Rates add: $1/\tau = k_r + k_{nr}$ with $k_r = 1/\tau_\text{rad} = 2.0\times10^8$ s$^{-1}$ and $1/\tau = 2.5\times10^8$ s$^{-1}$. So $k_{nr} = 0.5\times10^8 = 5.00\times10^7$ s$^{-1}$. The fluorescence quantum yield is $k_r/(k_r + k_{nr}) = \tau/\tau_\text{rad} = 0.80$.`,
      trap: R`Lifetimes do not subtract ($5 - 4 = 1$ ns); rates do.` },
    { id: 'els-r4-08', type: 'mcq', level: 4, exams: ['gate', 'net'], sub: 'Lambda doubling',
      q: R`In a $^1\Pi$ electronic state of a diatomic molecule, high-resolution spectra show each rotational level $J$ as a close pair. This $\Lambda$-doubling arises because`,
      options: [R`the two nuclei have different masses`, R`the two states with $\Lambda = +1$ and $\Lambda = -1$, degenerate for a non-rotating molecule, are split slightly by the interaction of rotation with the electronic motion, giving levels of opposite parity`,
        R`the electron spin couples to the rotation`, R`the nuclear spin splits each level`], answer: 1,
      sol: R`For $\Lambda\ne0$ the electronic angular momentum can point either way along the axis ($\pm\Lambda$), giving a two-fold degeneracy. Rotation mixes the electronic states (Coriolis-type coupling with $\Sigma$ states), splitting each $J$ into two levels of opposite parity (the $e/f$ components). It grows roughly as $J(J+1)$. A singlet has no spin, so spin-rotation cannot be the cause; Σ states ($\Lambda = 0$) have no $\Lambda$-doubling.`,
      trap: R`A $^1\Pi$ state has $S = 0$, so spin cannot split it.` },
    { id: 'els-r4-09', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'spin-orbit in molecules',
      q: R`The ground state of NO is $X\,^2\Pi$, split by spin-orbit coupling into $^2\Pi_{1/2}$ (lower) and $^2\Pi_{3/2}$, about $120$ cm$^{-1}$ apart. Taking the two components to have equal degeneracy, the population ratio $N(^2\Pi_{3/2})/N(^2\Pi_{1/2})$ at $300$ K ($kT/hc = 208.5$ cm$^{-1}$) is ______ (three decimal places).`,
      answer: 0.563, tol: 0.003, calc: () => Math.exp(-120 / 208.5),
      sol: R`$N_{3/2}/N_{1/2} = e^{-120/208.5} = e^{-0.5755} = 0.563$. So at room temperature over a third of NO molecules are in the upper component, and both appear in its spectra. The doublet is regular ($\Omega = \tfrac12$ lower) because the single $\pi^*$ electron gives a positive spin-orbit constant.`,
      trap: R`Using $kT$ in eV with a splitting in cm$^{-1}$ gives nonsense; keep both in wavenumbers.` },
    { id: 'els-r4-10', type: 'mcq', level: 5, exams: ['gate', 'net'], sub: 'vibronic coupling',
      q: R`The weak benzene absorption near 260 nm ($^1B_{2u}\leftarrow{}^1A_{1g}$) is forbidden by electronic symmetry, yet it is clearly observed, and its $0-0$ band is missing. The best explanation is`,
      options: [R`the transition is magnetic dipole`, R`spin-orbit coupling mixes in triplet character`,
        R`vibronic (Herzberg-Teller) coupling: a non-totally-symmetric vibration mixes the excited state with an allowed one, so bands appear only with one quantum of that vibration`, R`collisions in the liquid break the symmetry`], answer: 2,
      sol: R`The transition moment depends on nuclear coordinates. Expanding it to first order in a non-totally-symmetric normal coordinate (in benzene the $e_{2g}$ mode $\nu_6$) borrows intensity from an allowed transition. The vibronic symmetry then makes bands with one quantum of $\nu_6$ allowed, while the pure electronic $0-0$ band stays forbidden. The 260 nm system is also seen in the gas phase, so collisions are not needed, and it is a singlet-singlet band.`,
      trap: R`A missing $0-0$ band with strong vibronic bands is the fingerprint of Herzberg-Teller borrowing, not of a spin effect.` },
    { id: 'els-r4-11', type: 'nat', level: 5, exams: ['gate', 'net'], sub: 'Rydberg series', unit: 'eV',
      q: R`A molecule shows a Rydberg series $\tilde\nu_n = \tilde\nu_\infty - R/(n - \delta)^2$ with $R = 109\,737$ cm$^{-1}$ and quantum defect $\delta = 0.08$. The member with $n = 5$ is at $70\,000$ cm$^{-1}$. The ionisation energy is ______ eV (two decimal places). Use $1$ cm$^{-1} = 1.2398\times10^{-4}$ eV.`,
      answer: 9.24, tol: 0.01, calc: () => (70000 + RY / 4.92 ** 2) * EVCM,
      sol: R`$n - \delta = 4.92$, $(4.92)^2 = 24.21$, $R/24.21 = 4533$ cm$^{-1}$. $\tilde\nu_\infty = 70\,000 + 4533 = 74\,533$ cm$^{-1}$. In eV: $74\,533\times1.2398\times10^{-4} = 9.24$ eV. Rydberg series converge on the ionisation limit, so even one assigned member with a known defect gives the ionisation energy.`,
      trap: R`Forgetting the quantum defect ($n = 5$ exactly) gives 74 389 cm$^{-1}$, 9.22 eV.` },
    { id: 'els-r4-12', type: 'msq', level: 3, exams: ['gate', 'net'], sub: 'molecular orbitals',
      q: R`Which of these species have a bond order of 2.5?`,
      options: [R`NO`, R`O$_2$`, R`O$_2^+$`, R`N$_2^+$`], answer: [0, 2, 3],
      sol: R`Count valence electrons and fill $\sigma_{2s}$, $\sigma_{2s}^*$, $\pi_{2p}$/$\sigma_{2p}$ (6 bonding), $\pi_{2p}^*$, $\sigma_{2p}^*$. NO (11): bonding 8, antibonding 3, order 2.5. O$_2$ (12): $8 - 4$, order 2. O$_2^+$ (11): 2.5. N$_2^+$ (9): bonding 7, antibonding 2, order 2.5.`,
      trap: R`N$_2^+$ and O$_2^+$ both have order 2.5, but for opposite reasons: one lost a bonding electron, the other an antibonding one.` },
  ],
  gens: [
    { id: 'els-r4g1', type: 'nat', level: 4, exams: ['gate', 'net'], sub: 'Rydberg series',
      make(r) {
        const n = int(r, 3, 9), d = pick(r, 0.0, 1.0, 0.01), nu = pick(r, 60000, 110000, 10);
        const ie = (nu + RY / (n - d) ** 2) * EVCM;
        return { q: R`A Rydberg series $\tilde\nu_n = \tilde\nu_\infty - R/(n - \delta)^2$ ($R = 109\,737$ cm$^{-1}$, $\delta = ${d}$) has its $n = ${n}$ member at $${nu}$ cm$^{-1}$. The ionisation energy is ______ eV (three decimal places). Use $1$ cm$^{-1} = 1.2398\times10^{-4}$ eV.`,
          answer: round(ie, 3), tol: 0.005, unit: 'eV', n, d, nu,
          sol: R`$n - \delta = ${round(n - d, 2)}$, $R/(n - \delta)^2 = ${round(RY / (n - d) ** 2, 1)}$ cm$^{-1}$. $\tilde\nu_\infty = ${nu} + ${round(RY / (n - d) ** 2, 1)} = ${round(nu + RY / (n - d) ** 2, 1)}$ cm$^{-1}$ $= ${round(ie, 3)}$ eV.`,
          trap: 'The term R/(n - delta)^2 is added to the line to reach the limit.' };
      },
      verify: (p) => (p.nu + RY / (p.n - p.d) ** 2) * EVCM },
    { id: 'els-r4g2', type: 'nat', level: 3, exams: ['gate', 'net'], sub: 'fluorescence kinetics',
      make(r) {
        const trad = pick(r, 2, 40, 0.5), phi = pick(r, 0.05, 0.95, 0.01);
        const tau = trad * phi;
        const ask = choose(r, ['knr', 'tau', 'phi']);
        const taus = round(tau, 3);
        const ans = ask === 'knr' ? (1 / taus - 1 / trad) * 100 : ask === 'tau' ? tau : taus / trad;
        return { q: ask === 'knr'
          ? R`A fluorophore has a radiative lifetime of $${trad}$ ns and a measured fluorescence lifetime of $${taus}$ ns. Its non-radiative decay rate is ______ $\times10^7$ s$^{-1}$ (three significant figures).`
          : ask === 'tau'
            ? R`A fluorophore has a radiative lifetime of $${trad}$ ns and a fluorescence quantum yield of $${phi}$. Its measured fluorescence lifetime is ______ ns (three significant figures).`
            : R`A fluorophore has a radiative lifetime of $${trad}$ ns and a measured fluorescence lifetime of $${taus}$ ns. Its fluorescence quantum yield is ______ (three decimal places).`,
          answer: ask === 'phi' ? round(ans, 3) : +ans.toPrecision(3), tol: ask === 'phi' ? 0.003 : +(Math.abs(ans) * 0.01).toPrecision(2) || 0.01, trad, phi, taus, ask,
          sol: R`Rates add: $1/\tau = k_r + k_{nr}$ with $k_r = 1/\tau_\text{rad}$; the quantum yield is $\Phi = k_r\tau = \tau/\tau_\text{rad}$. ${ask === 'knr' ? R`$k_{nr} = 1/${taus} - 1/${trad}$ ns$^{-1}$ $= ${+ans.toPrecision(3)}\times10^7$ s$^{-1}$.` : ask === 'tau' ? R`$\tau = \Phi\tau_\text{rad} = ${phi}\times${trad} = ${+ans.toPrecision(3)}$ ns.` : R`$\Phi = ${taus}/${trad} = ${round(ans, 3)}$.`}`,
          trap: 'Lifetimes combine as reciprocals; the quantum yield is the ratio of measured to radiative lifetime.' };
      },
      verify: (p) => (p.ask === 'knr' ? (1 / p.taus - 1 / p.trad) * 100 : p.ask === 'tau' ? p.trad * p.phi : p.taus / p.trad) },
    { id: 'els-r4g3', type: 'nat', level: 2, exams: ['jam', 'gate', 'net'], sub: 'molecular orbitals',
      make(r) {
        const [name, n] = choose(r, MOL);
        const b = bo(n);
        return { q: R`Using the molecular orbital filling of second-row diatomics (valence orbitals only), the bond order of ${name} is ______.`,
          answer: b, tol: 0, n,
          sol: R`${name} has ${n} valence electrons. Fill $\sigma_{2s}$ (2, bonding), $\sigma_{2s}^*$ (2, antibonding), $\pi_{2p}$ and $\sigma_{2p}$ (6, bonding), $\pi_{2p}^*$ (4, antibonding), $\sigma_{2p}^*$ (2, antibonding). Bond order $= (\text{bonding} - \text{antibonding})/2 = ${b}$.`,
          trap: 'Count only valence electrons; the order of the pi and sigma 2p orbitals does not change the bond order.' };
      },
      verify: (p) => {
        const n = p.n; const bond = Math.min(n, 2) + Math.max(0, Math.min(n - 4, 6)); return (bond - (n - bond)) / 2;
      } },
  ],
};
