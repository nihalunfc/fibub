---
title: Electronic spectra and the Franck-Condon principle
seoTitle: Electronic spectra and Franck-Condon for CSIR NET Physics
summary: 'Electronic spectra of diatomic molecules: the Born-Oppenheimer separation, vibronic band positions, progressions, sequences and Deslandres tables, the Franck-Condon principle and Huang-Rhys factor, Birge-Sponer and thermochemical dissociation energies, P, Q and R branches, band heads and shading, term symbols, selection rules and MO bond orders, predissociation, fluorescence and phosphorescence.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'Why are electronic transitions drawn as vertical arrows on a potential-energy diagram?'
    choices: ['The nuclei barely move during the fast electronic jump', 'The vibrational quantum number cannot change', 'The molecule must dissociate', 'The two curves always have the same minimum']
    ans: 0
    why: 'The Franck-Condon principle: an electronic transition takes about 10⁻¹⁵ s, a vibration about 10⁻¹³ s, so the internuclear distance is unchanged during the jump.'
  - q: 'For equal-frequency displaced oscillators with Huang-Rhys factor S = 3.4, which band of the absorption progression from v″ = 0 is strongest?'
    choices: ["3 ← 0", "4 ← 0", "0 ← 0", "2 ← 0"]
    ans: 0
    why: 'The Franck-Condon factors are Poisson, e^(−S)S^v′/v′!, which peaks at the integer part of S.'
  - q: 'In a ¹Σ–¹Σ band with B′ < B″, where is the band head and which way is the band shaded?'
    choices: ['R branch; shaded to the red', 'P branch; shaded to the violet', 'R branch; shaded to the violet', 'There is no head']
    ans: 0
    why: 'With B′ < B″ the (B′ − B″)m² term turns the R branch back on itself: the head is on the high-wavenumber side and the lines run off to the red.'
sources:
  - 'G. Herzberg, Molecular Spectra and Molecular Structure I: Spectra of Diatomic Molecules, 2nd ed. (1950), chapters IV, V and VII'
  - 'C. N. Banwell and E. M. McCash, Fundamentals of Molecular Spectroscopy, 4th ed. (1994), chapter 6'
  - 'J. M. Hollas, Modern Spectroscopy, 4th ed. (2004), chapter 7'
  - 'P. F. Bernath, Spectra of Atoms and Molecules, 3rd ed. (2016), chapter 9'
  - 'CSIR-UGC NET Physical Sciences syllabus, Part C unit on atomic and molecular physics (electronic spectra, Franck-Condon principle)'
---

**Module 8 · about 55 minutes.** By the end you will be able to place any vibronic band of a diatomic molecule, read progressions and sequences, explain band intensities with the Franck-Condon principle and compute Franck-Condon factors for displaced oscillators, find dissociation energies by the Birge-Sponer method and by energy cycles, work out the rotational structure, band heads and shading, apply term symbols and selection rules, and describe what happens after absorption (fluorescence, phosphorescence, predissociation). Vibrational and rotational constants are taken from the GATE lessons on [rotational spectra](/learn/courses/gate-physics/rotational-spectra/) and [vibrational spectra](/learn/courses/gate-physics/vibrational-spectra/).

<div class="bigidea">An electronic transition lifts the molecule from one potential curve to another in an instant, too fast for the nuclei to move. The molecule lands wherever the vertical line meets the upper curve, and the vibrational bands it shows are a picture of how much its old vibrational wavefunction overlaps each new one.</div>

## 1. Energies: electronic + vibrational + rotational

The Born-Oppenheimer approximation separates the slow nuclei from the fast electrons: each electronic state gives a potential curve `$U(R)$`, and the nuclei vibrate and rotate on it. A level of the molecule has term value `$T = T_e + G(v) + F(J)$` with

```math
G(v) = \omega_e(v + \tfrac12) - \omega_ex_e(v + \tfrac12)^2, \qquad F(J) = BJ(J + 1)
```

Electronic energies are a few eV (visible and UV), vibrational quanta about 0.1 eV, rotational ones about 1 meV. A band `$v' \leftarrow v''$` lies at `$\nu = T_e + G'(v') - G''(v'')$`, and in particular

```math
\nu_{00} = T_e + \left(\tfrac12\omega_e' - \tfrac14\omega_e'x_e'\right) - \left(\tfrac12\omega_e'' - \tfrac14\omega_e''x_e''\right)
```

There is **no selection rule on** `$v$` in an electronic transition: all bands can appear. Arranged in a **Deslandres table** (rows `$v''$`, columns `$v'$`), the rows and columns are **progressions** (one level in common) and the diagonals are **sequences** (fixed `$\Delta v$`). Cold absorption shows the `$v'' = 0$` progression, whose spacings `$\Delta G'(v + \tfrac12) = \omega_e' - 2\omega_e'x_e'(v + 1)$` map the upper curve; emission from a fixed `$v'$` maps the lower one. Bands from `$v'' \ge 1$` (hot bands) grow with temperature as `$e^{-hc\omega''v''/k_BT}$`.

**Worked example.** Bands at 20 000, 20 480 and 20 940 cm⁻¹ from `$v'' = 0$`: intervals 480 and 460, so `$2\omega_e'x_e' = 20$`, `$\omega_e'x_e' = 10$` and `$\omega_e' = 480 + 20 = 500$` cm⁻¹.

<div class="problem" data-problem="vibronic-band"></div>

## 2. The Franck-Condon principle

The electronic jump takes about `$10^{-15}$` s, a vibration about `$10^{-13}$` s, so `$R$` does not change: transitions are **vertical**. Quantum mechanically, the transition moment factorises into an electronic part (the same for all bands) and the overlap of the vibrational functions, so band intensities follow the **Franck-Condon factors**

```math
q_{v'v''} = |\langle v'|v''\rangle|^2, \qquad \sum_{v'} q_{v'v''} = 1
```

- Equal equilibrium distances (`$r_e' \approx r_e''$`): the 0-0 band dominates, as in many emission lines of small molecules.
- Upper curve displaced to larger `$R$` (the usual case after exciting a bonding electron): a long progression whose maximum lies at `$v' > 0$`; if the vertical line reaches above the upper dissociation limit, a continuum.

For two harmonic curves of the same frequency displaced by `$\Delta r$`, the factors from `$v'' = 0$` are a Poisson distribution:

```math
q_{v'0} = e^{-S}\frac{S^{v'}}{v'!}, \qquad S = \frac{\mu\omega(\Delta r)^2}{2\hbar} \quad (\text{Huang-Rhys factor})
```

The progression peaks at `$v' = \lfloor S\rfloor$`, and the 0-0 band carries a fraction `$e^{-S}$`.

**Worked example.** `$\mu = 7.00$` u, `$\tilde\nu = 1500$` cm⁻¹, `$\Delta r = 0.100$` Å. `$\omega = 2\pi c\tilde\nu = 2.83\times10^{14}$` rad/s, so `$S = 1.162\times10^{-26}\times2.83\times10^{14}\times10^{-22}/(2\times1.055\times10^{-34}) = 1.56$`. The 1-0 band is strongest (`$q = 0.33$`), the 0-0 band has `$e^{-1.56} = 0.21$`.

<figure class="fig" data-fig="franck-condon"><figcaption>Two harmonic potential curves of equal frequency. Slide the upper curve sideways: with no displacement only the 0-0 band appears; as the Huang-Rhys factor S = d²/2 grows, the intensity spreads into a long progression that peaks near v′ = S, always adding up to 1.</figcaption></figure>

<div class="problem" data-problem="fc-poisson"></div>

<div class="meaning">

<dl>
<dt>progression</dt><dd>bands sharing one vibrational level (in cold absorption, v″ = 0); its spacing maps the other curve</dd>
<dt>sequence</dt><dd>bands with the same Δv = v′ − v″, close together when ω′ ≈ ω″</dd>
<dt>Franck-Condon factor</dt><dd>the squared overlap of the two vibrational wavefunctions: the share of the electronic intensity a band gets</dd>
<dt>Huang-Rhys factor S</dt><dd>the displacement of the curves in units that make the progression Poisson; the average number of vibrational quanta excited</dd>
</dl>

</div>

## 3. Dissociation energies

**Birge-Sponer.** The intervals `$\Delta G(v + \tfrac12)$` shrink as the levels crowd towards the dissociation limit; summing them (the area under `$\Delta G$` against `$v$`) gives `$D_0$`. For a linear fall (Morse), `$D_e = \omega_e^2/4\omega_ex_e$`, `$D_0 = D_e - G(0)$`, and the last bound level is near `$v = \omega_e/2\omega_ex_e - \tfrac12$`. Real curves fall faster near the top, so the linear extrapolation usually overestimates.

**Energy cycle.** An absorption progression converges, then turns into a continuum at the upper dissociation limit. Measured from `$v'' = 0$`:

```math
\nu_{\text{limit}} = \nu_{00} + D_0' = D_0'' + E_{\text{exc}}
```

where `$E_{exc}$` is the excitation of the atomic fragment (the upper state often dissociates into one excited atom). For a progression converging at 56 900 cm⁻¹ into a ground atom plus one 15 870 cm⁻¹ up, `$D_0'' = 41\,030$` cm⁻¹ `$= 5.09$` eV.

## 4. Rotational structure, band heads and shading

For a `$^1\Sigma - {}^1\Sigma$` band, `$\Delta J = \pm1$` only, and both branches lie on one parabola (the Fortrat parabola):

```math
\nu = \nu_0 + (B' + B'')m + (B' - B'')m^2, \qquad m = J'' + 1\ (\text{R}), \quad m = -J''\ (\text{P})
```

There is no line at `$m = 0$`: a gap of `$2(B' + B'')$` between R(0) and P(1). Because `$B' \neq B''$`, one branch turns back on itself, forming a **band head** at `$m_h = -(B' + B'')/2(B' - B'')$`, a distance `$-(B' + B'')^2/4(B' - B'')$` from the origin. If `$B' < B''$` (longer bond in the upper state, the usual case) the head is in the R branch and the band is **shaded to the red**; if `$B' > B''$` it is in the P branch and shaded to the violet. A Q branch (`$\Delta J = 0$`) appears only when `$\Lambda \neq 0$` in one of the states (`$\Pi - \Sigma$`, `$\Pi - \Pi$`).

**Worked example.** `$B' = 1.6$`, `$B'' = 1.9$` cm⁻¹: `$m_h = 3.5/0.6 = 5.8$`, so the head is near R(5), `$3.5^2/1.2 = 10.2$` cm⁻¹ above the origin, and the band is shaded to the red.

## 5. Term symbols, selection rules and what happens next

Diatomic states are labelled `$^{2S+1}\Lambda_{g/u}^{\pm}$` with `$\Lambda = 0, 1, 2 \to \Sigma, \Pi, \Delta$`. Electric-dipole rules: `$\Delta\Lambda = 0, \pm1$`; `$\Delta S = 0$`; `$g \leftrightarrow u$` (homonuclear); `$\Sigma^+ \leftrightarrow \Sigma^+$`, `$\Sigma^- \leftrightarrow \Sigma^-$`. Molecular-orbital filling gives the ground states and bond orders: H₂ and N₂ `$^1\Sigma_g^+$` (bond orders 1 and 3); O₂ `$^3\Sigma_g^-$` (bond order 2, paramagnetic, two electrons in `$\pi_g^*$`), whose strong Schumann-Runge bands (`$B\,^3\Sigma_u^- \leftarrow X\,^3\Sigma_g^-$`) converge into the continuum that photodissociates O₂ in the upper atmosphere. B₂ is paramagnetic because its `$\pi_u$` orbitals lie below `$\sigma_g2p$`.

After absorption, large molecules relax in picoseconds to `$v = 0$` of `$S_1$` (Kasha's rule) and then **fluoresce** (nanoseconds, red-shifted from the absorption: the Stokes shift; often a mirror image of the absorption band), lose energy by internal conversion, or cross to the triplet `$T_1$` and **phosphoresce** (spin-forbidden, milliseconds to seconds). **Predissociation**: where a repulsive curve crosses a bound one, levels above the crossing leak away, and their bands turn diffuse below the true convergence limit. Electronic bands are also the starting point of lasers ([lesson 6.7 of GATE Physics](/learn/courses/gate-physics/lasers/)) and of resonance [Raman scattering](/learn/courses/gate-physics/raman/).

<div class="myth">

**"Electronic transitions obey Δv = ±1."** That rule belongs to infrared transitions within one electronic state. Between two different curves, any Δv is allowed; the Franck-Condon factors decide which bands are strong.

**"The strongest band shows where the upper minimum is."** It shows where the vertical line from the ground state meets the upper curve. The 0-0 band, often weak, is what fixes the energy difference of the two minima (with the zero-point energies).

</div>

<div class="keypoints">

- `$\nu = T_e + G'(v') - G''(v'')$`; `$\nu_{00}$` includes the zero-point difference; no rule on Δv; progressions (one level shared) and sequences (fixed Δv).
- Franck-Condon: vertical transitions, intensities `$|\langle v'|v''\rangle|^2$` summing to 1; equal-frequency displaced curves give Poisson factors with `$S = \mu\omega\Delta r^2/2\hbar$`, peak at `$\lfloor S\rfloor$`.
- `$D_e = \omega_e^2/4\omega_ex_e$`, `$D_0 = D_e - G(0)$`; cycle `$\nu_{00} + D_0' = D_0'' + E_{exc}$`.
- Fortrat: `$\nu = \nu_0 + (B' + B'')m + (B' - B'')m^2$`; head at `$m_h = -(B' + B'')/2(B' - B'')$`; `$B' < B''$`: R head, red-shaded; Q branch needs `$\Lambda \ne 0$`.
- Rules `$\Delta\Lambda = 0, \pm1$`, `$\Delta S = 0$`, `$g \leftrightarrow u$`, `$+ \leftrightarrow +$`; O₂ `$^3\Sigma_g^-$`; fluorescence vs phosphorescence; predissociation gives diffuse bands.

</div>

## Practise: exam questions on this lesson

NET Part C style, with full solutions. More on the [CSIR NET practice page](/learn/courses/csir-net-physics/practice/); the [Diatomic spectroscopy calculator](/science/diatomic-spectroscopy/) works out band positions and constants for real molecules.

<div class="qbank" data-bank="physics" data-topics="electronic-spectra" data-exam="net" data-n="10"></div>

**End of Module 8.** Go back to [lesson 8.2](/learn/courses/csir-net-physics/esr-nmr/) for spin resonance, or revise the vibrational structure in the GATE lesson on [vibrational spectra](/learn/courses/gate-physics/vibrational-spectra/).
