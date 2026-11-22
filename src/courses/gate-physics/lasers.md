---
title: Einstein coefficients and lasers
seoTitle: Einstein coefficients and how lasers work for GATE Physics
summary: 'Absorption, spontaneous and stimulated emission and the Einstein A and B coefficients from Planck''s law, lifetimes and line widths, gain and population inversion, why two levels cannot lase and how three- and four-level schemes do, the threshold condition, cavity modes, coherence, and the ruby, He-Ne, Nd:YAG, CO₂ and diode lasers.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'How does the ratio A₂₁/B₂₁ of the Einstein coefficients depend on the transition frequency ν?'
    choices: ['As ν³', 'As ν', 'As ν²', 'It does not depend on ν']
    ans: 0
    why: 'A₂₁/B₂₁ = 8πhν³/c³ (with B defined per unit energy density per unit frequency). Spontaneous emission takes over at high frequency, which is why X-ray lasers are so hard to build.'
  - q: 'Why can a laser not work with only two energy levels and optical pumping?'
    choices: ['Pumping also drives stimulated emission, so N₂ can at best equal N₁', 'Spontaneous emission is forbidden between two levels', 'The two levels must have different degeneracies', 'Two-level systems have no gain bandwidth']
    ans: 0
    why: 'The pump light causes absorption and stimulated emission at the same rate per atom, so the populations approach equality (transparency) but never invert.'
  - q: 'A laser cavity of length L in air supports longitudinal modes separated in frequency by'
    choices: ['c/(2L)', 'c/L', '2c/L', 'c/(4L)']
    ans: 0
    why: 'Standing waves need a whole number of half-wavelengths in L: ν = qc/(2L), so neighbouring modes are c/(2L) apart; 500 MHz for a 30 cm cavity.'
sources:
  - 'A. Einstein, Zur Quantentheorie der Strahlung, Physikalische Zeitschrift 18, 121 (1917)'
  - 'O. Svelto, Principles of Lasers, 5th ed. (2010), chapters 1, 2 and 7'
  - 'A. E. Siegman, Lasers (1986), chapters 1 to 3'
  - 'K. Thyagarajan and A. Ghatak, Lasers: Fundamentals and Applications, 2nd ed. (2010), chapters 4 to 7'
  - 'GATE Physics syllabus (Atomic and Molecular Physics), published by the organising IIT each year'
---

**Module 6 · about 50 minutes.** By the end you will be able to derive the relations between the Einstein coefficients, compare spontaneous and stimulated rates, estimate natural and Doppler widths, explain population inversion in three- and four-level lasers, compute the threshold gain, count cavity modes and coherence lengths, and describe the common lasers.

<div class="bigidea">A photon passing an excited atom can make it emit an identical photon. If more atoms are up than down, light grows as it travels instead of fading: that is all a laser is, plus two mirrors to keep the light going back and forth.</div>

## 1. Three processes and Einstein's argument

Take two levels, 1 (lower, degeneracy `$g_1$`) and 2 (upper, `$g_2$`), separated by `$h\nu$`, in radiation of spectral energy density `$\rho(\nu)$`. Einstein (1917) said three things happen:

| Process | Rate per unit volume |
|---|---|
| absorption | `$B_{12}\,\rho(\nu)\,N_1$` |
| spontaneous emission | `$A_{21}\,N_2$` |
| stimulated emission | `$B_{21}\,\rho(\nu)\,N_2$` |

Stimulated emission was his addition: without it, the balance below does not give Planck's law.

<div class="steps">
<div class="step"><p><b>Balance.</b> In equilibrium, B₁₂ρN₁ = A₂₁N₂ + B₂₁ρN₂, so ρ = A₂₁/(B₁₂N₁/N₂ − B₂₁).</p></div>
<div class="step"><p><b>Boltzmann.</b> N₁/N₂ = (g₁/g₂)e^{hν/kT}.</p></div>
<div class="step"><p><b>Match Planck.</b> ρ = (8πhν³/c³)/(e^{hν/kT} − 1) for every T. This needs g₁B₁₂ = g₂B₂₁ (so ρ → ∞ as T → ∞) and A₂₁/B₂₁ = 8πhν³/c³.</p></div>
</div>

```math
g_1B_{12} = g_2B_{21}, \qquad \frac{A_{21}}{B_{21}} = \frac{8\pi h\nu^3}{c^3}, \qquad \frac{\text{spontaneous}}{\text{stimulated}} = e^{h\nu/kT} - 1
```

The coefficients are properties of the atom, not of the radiation, so these relations hold even far from equilibrium. They follow from the [blackbody spectrum](/learn/courses/iit-jam-physics/photons/) alone; the [Blackbody calculator](/science/blackbody-calculator/) gives `$\rho(\nu)$` at any temperature.

<div class="meaning">

<dl>
<dt>A₂₁</dt><dd>the spontaneous emission rate per atom (s⁻¹); its inverse is the radiative lifetime of level 2</dd>
<dt>B₁₂, B₂₁</dt><dd>absorption and stimulated emission coefficients: rate per atom per unit spectral energy density</dd>
<dt>ν³</dt><dd>the density of field modes a photon can go into grows as ν², and each photon carries hν; spontaneous emission, which feeds all those modes, wins at high ν</dd>
<dt>stimulated photon</dt><dd>same frequency, direction, phase and polarisation as the one that triggered it, which is what makes laser light coherent</dd>
</dl>

</div>

**Worked example.** At what temperature are spontaneous and stimulated emission equally fast for red light at 632.8 nm in thermal radiation?

1. `$e^{h\nu/kT} - 1 = 1$`, so `$h\nu/kT = \ln2$`.
2. `$T = hc/(\lambda k\ln2) = (1.4388\times10^{-2}\ \text{m K})/(632.8\times10^{-9}\ \text{m}\times0.693) = 3.3\times10^4$` K.
3. At room temperature spontaneous emission wins by `$e^{75.8}$`: thermal light is all spontaneous. For microwaves (`$h\nu \ll kT$`) the opposite holds, which is why the first device (the ammonia maser, 1954) worked there.

## 2. Lifetimes and line shapes

An excited level decays as `$e^{-t/\tau}$` with `$1/\tau = \sum A$` over all lower levels. `$A$` grows as `$\nu^3|\langle2|\mathbf d|1\rangle|^2$`: allowed visible transitions have `$\tau \sim 10$` ns, forbidden ones milliseconds or longer (metastable levels, the ones lasers like).

- **Natural width.** A level that lives `$\tau$` has an energy spread `$\hbar/\tau$`: a Lorentzian line of full width `$\Delta\nu_N = 1/(2\pi\tau)$`. For `$\tau = 16$` ns (sodium D), 10 MHz.
- **Doppler width.** Atoms moving at `$v_x$` emit at `$\nu_0(1 + v_x/c)$`; a Maxwell distribution gives a Gaussian:

```math
\Delta\nu_D = \frac{\nu_0}{c}\sqrt{\frac{8kT\ln2}{m}}
```

For neon at 400 K emitting 632.8 nm this is about 1.5 GHz, a hundred times the natural width. Doppler broadening is **inhomogeneous** (each atom has its own centre); natural and collision broadening are **homogeneous** (all atoms the same). The difference decides whether a laser runs on one mode or many.

## 3. Gain needs inversion

A beam of intensity `$I$` passing through the medium changes as `$dI/dz = \gamma I$`, with

```math
\gamma(\nu) = \sigma(\nu)\left(N_2 - \frac{g_2}{g_1}N_1\right)
```

`$\sigma$` being the stimulated emission cross-section. Normally `$N_1$` dominates and `$\gamma < 0$` (absorption). Gain requires a **population inversion**, `$N_2 > (g_2/g_1)N_1$`, which no thermal equilibrium can give (it would need a negative temperature).

**Two levels are not enough.** Optical pumping drives absorption and stimulated emission with the same coefficient, so the populations approach `$N_2 = N_1$` (for equal degeneracies) and stop: the medium becomes transparent but never amplifies.

**Three levels (ruby).** Pump 1 → 3; level 3 drops quickly to 2; 2 is metastable and lases to 1, the ground state. In steady state (equal degeneracies, fast 3 → 2) `$N_2/N_1 = W\tau$`, with `$W$` the pump rate and `$\tau$` the lifetime of 2. Inversion needs `$W\tau > 1$`: more than half of all atoms must be lifted out of the ground state before there is any gain. Ruby works only in intense flash-lamp pulses.

**Four levels (Nd:YAG, He-Ne).** Lasing ends on a level 1 above the ground state 0, which empties quickly. Level 1 is almost always empty, so any population in 2 is an inversion:

```math
\text{three-level: } \frac{N_2 - N_1}{N} = \frac{W\tau - 1}{W\tau + 1}, \qquad \text{four-level: } \frac{N_2}{N} = \frac{W\tau}{1 + W\tau}
```

<figure class="fig" data-fig="laser-rates"><figcaption>Steady-state inversion against pump rate for three-level and four-level schemes. The three-level curve stays negative until Wτ = 1; the four-level curve is positive from the start. Move the threshold line to see how much more pumping the three-level laser needs.</figcaption></figure>

**Worked example.** A laser needs an inversion of 1% of all atoms. Compare the pumping.

1. Four-level: `$W\tau/(1 + W\tau) = 0.01$`, so `$W\tau = 0.0101$`.
2. Three-level: `$(W\tau - 1)/(W\tau + 1) = 0.01$`, so `$W\tau = 1.01/0.99 = 1.020$`.
3. About a hundred times more pump rate for the three-level system, which is why almost every continuous laser is four-level.

## 4. The cavity and the threshold

Mirrors of reflectance `$R_1$`, `$R_2$` at the ends of a gain medium of length `$L$` with internal loss `$\alpha$`. After one round trip the intensity is multiplied by `$R_1R_2e^{2(\gamma - \alpha)L}$`. The laser starts when that reaches 1:

```math
\gamma_{\text{th}} = \alpha + \frac{1}{2L}\ln\frac{1}{R_1R_2}
```

Above threshold the gain clamps at `$\gamma_{\text{th}}$`: extra pumping goes into more output power, not more inversion.

**Worked example.** A He-Ne tube has `$L = 0.30$` m, `$R_1 = 0.999$`, `$R_2 = 0.98$`, internal loss `$0.01$` m⁻¹.

1. `$\ln(1/(0.999\times0.98)) = \ln(1.0214) = 0.0212$`.
2. Divide by `$2L = 0.60$` m: 0.0353 m⁻¹; add `$\alpha$`: `$\gamma_{\text{th}} = 0.045$` m⁻¹, a gain of only about 4.5% per metre. He-Ne gain is small, so its mirrors must be very good.

<div class="problem" data-problem="laser-threshold"></div>

**Longitudinal modes.** The light must form standing waves: a whole number of half-wavelengths in the optical length `$nL$`, so

```math
\nu_q = q\,\frac{c}{2nL}, \qquad \Delta\nu = \frac{c}{2nL}
```

A 30 cm He-Ne cavity has modes 500 MHz apart; under its 1.5 GHz Doppler gain curve about three of them lase. One mode can be selected with a short cavity or an etalon.

<div class="problem" data-problem="laser-modes"></div>

**Properties of the light.** Coherence time `$\sim 1/\Delta\nu$` and coherence length `$c/\Delta\nu$`: 0.2 m for a multimode He-Ne, kilometres for a stabilised single-mode laser, a few micrometres for sunlight. Divergence is set by diffraction, about `$\lambda/(\pi w_0)$` for a Gaussian beam of waist `$w_0$`: a He-Ne beam with a 1 mm waist radius spreads by only 0.2 mrad.

**Pulses.** Q-switching holds the cavity loss high while the inversion builds, then drops it: one giant pulse of nanoseconds. Mode-locking fixes the phases of many modes so they add into a train of pulses, each about `$1/(\text{gain bandwidth})$` long, separated by the round-trip time `$2nL/c$`. Ti:sapphire, with a gain bandwidth of 100 THz, gives pulses under 10 fs.

## 5. The common lasers

| Laser | Wavelength | Scheme | Notes |
|---|---|---|---|
| ruby (Cr³⁺ in Al₂O₃) | 694.3 nm | three-level | the first laser (Maiman, 1960); pulsed |
| He-Ne | 632.8 nm | four-level, in neon | helium's metastable levels pass energy to neon by collision |
| Nd:YAG | 1064 nm | four-level | diode-pumped, often frequency-doubled to 532 nm |
| CO₂ | 10.6 μm | vibrational levels (001 → 100) | efficient and powerful; N₂ helps pump, as He does in He-Ne |
| argon ion | 488, 514.5 nm | ion levels | Raman spectroscopy, older labs |
| semiconductor diode | 0.4 to 2 μm | electrons and holes in a p-n junction | inversion by current; reflecting crystal faces as mirrors |

The CO₂ laser links back to [lesson 6.5](/learn/courses/gate-physics/vibrational-spectra/): its 10.6 μm line is a vibration-rotation transition between two normal-mode levels, with P and R branch lines that can be tuned one at a time.

<div class="myth">

**"A population inversion means most atoms are excited."** In a four-level laser only a tiny fraction of atoms needs to be in the upper level, as long as the lower laser level is even emptier. Only the three-level laser needs more than half.

**"Laser light is special because it is bright."** Many lamps put out more watts. What sets laser light apart is that the photons are in a few modes of the field: narrow in frequency, coherent, and in a beam limited only by diffraction.

</div>

<div class="keypoints">

- Einstein: `$g_1B_{12} = g_2B_{21}$`, `$A_{21}/B_{21} = 8\pi h\nu^3/c^3$`; spontaneous/stimulated `$= e^{h\nu/kT} - 1$`.
- `$\tau = 1/\sum A$`; natural width `$1/(2\pi\tau)$` (Lorentzian, homogeneous); Doppler `$(\nu_0/c)\sqrt{8kT\ln2/m}$` (Gaussian, inhomogeneous).
- Gain `$\gamma = \sigma(N_2 - g_2N_1/g_1)$`: needs inversion. Two levels cannot invert by optical pumping.
- Three-level: `$(N_2-N_1)/N = (W\tau-1)/(W\tau+1)$`, needs `$W\tau > 1$`. Four-level: `$N_2/N = W\tau/(1+W\tau)$`.
- Threshold `$\gamma_{\text{th}} = \alpha + \ln(1/R_1R_2)/2L$`; gain clamps above it.
- Modes `$\Delta\nu = c/2nL$`; coherence length `$c/\Delta\nu$`; divergence `$\approx \lambda/\pi w_0$`.
- Ruby 694.3 nm (3-level), He-Ne 632.8 nm, Nd:YAG 1064 nm, CO₂ 10.6 μm, diodes.

</div>

## Practise: exam questions on this lesson

They start at the definitions and climb to GATE top-rank level. Check each answer, then read the full solution. There are more on the [lasers practice page](/learn/courses/gate-physics/practice/lasers/).

<div class="qbank" data-bank="physics" data-topics="lasers" data-exam="gate" data-n="10"></div>

**End of Module 6.** Go back to [lesson 6.1](/learn/courses/gate-physics/fine-structure/) for the atomic levels that every laser transition starts from, or try the mixed practice on the [GATE Physics practice page](/learn/courses/gate-physics/practice/). **Next:** Module 7 begins with [Bravais lattices and the reciprocal lattice](/learn/courses/gate-physics/reciprocal-lattice/).
