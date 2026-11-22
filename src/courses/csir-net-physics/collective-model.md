---
title: The collective model and nuclear deformation
seoTitle: Collective model and nuclear deformation | CSIR NET
summary: 'When nucleons move together: the evidence for deformed nuclei, the deformation parameter β and the intrinsic quadrupole moment, the spectroscopic quadrupole moment Q = Q₀[3K² − I(I+1)]/[(I+1)(2I+3)], rotational bands E = (ħ²/2𝓘)I(I+1) with gamma-ray ladders and K bands in odd-A nuclei, the moment of inertia between rigid and irrotational values, quadrupole vibrations and phonon multiplets, and the ratio E(4⁺)/E(2⁺) that tells a rotor from a vibrator.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'An even-even nucleus has levels 0⁺ (0), 2⁺ (92 keV), 4⁺ (305 keV), 6⁺ (640 keV). It is best described as'
    choices: ['a deformed rotor, since E(4⁺)/E(2⁺) ≈ 3.3', 'a spherical vibrator, since E(4⁺)/E(2⁺) ≈ 2', 'a closed-shell nucleus', 'a rotor with K = 2']
    ans: 0
    why: '305/92 = 3.32, close to the rotor value 10/3. A vibrator would give 2.0, and a closed-shell nucleus would have its first 2⁺ at an MeV or more.'
  - q: 'The ground state of an even-even deformed nucleus has intrinsic quadrupole moment Q₀ = 6 b. The measured (spectroscopic) quadrupole moment of that 0⁺ ground state is'
    choices: ['0', '6 b', '−1.7 b', '2.6 b']
    ans: 0
    why: 'A state with I = 0 (or I = ½) has no orientation in space, so its spectroscopic quadrupole moment is zero whatever the intrinsic shape. The first 2⁺ state shows Q = −(2/7)Q₀ = −1.7 b.'
  - q: 'In an odd-A nucleus with a band built on K = 5/2, the band members have spins'
    choices: ['5/2, 7/2, 9/2, 11/2, ...', '5/2, 9/2, 13/2, ...', '1/2, 3/2, 5/2, ...', '0, 2, 4, ...']
    ans: 0
    why: 'For K ≠ 0 every I ≥ K occurs: I = K, K + 1, K + 2, ... Only K = 0 bands of even-even nuclei are limited to even I (by the reflection symmetry of the intrinsic state).'
sources:
  - 'A. Bohr and B. R. Mottelson, Nuclear Structure, vol. II (1975), chapters 4 and 6'
  - 'K. S. Krane, Introductory Nuclear Physics (1988), chapter 5'
  - 'K. Heyde, Basic Ideas and Concepts in Nuclear Physics, 3rd ed. (2004), chapters 12 and 13'
  - 'CSIR-UGC NET Physical Sciences syllabus, Part C nuclear and particle physics, published by the National Testing Agency'
---

**Module 10 · about 45 minutes.** The shell model treats each nucleon as moving alone in an average potential. It works superbly near magic numbers, and fails between them: rare-earth and actinide nuclei have quadrupole moments 20 times larger than one proton could give, and their low levels form ladders with energies that go like `$I(I+1)$`. The collective model of Bohr and Mottelson explains both. The nucleus as a whole takes a deformed shape, and that shape can rotate and vibrate.

<div class="bigidea">Far from closed shells, many nucleons outside the core polarise it into a spheroid. A deformed body has a direction, so it can rotate, and the rotational levels E = (ħ²/2𝓘)I(I+1) are low (tens of keV) because 𝓘 is large. A spherical nucleus cannot rotate in the quantum sense, but its surface can vibrate, giving equally spaced phonon levels. One number, E(4⁺)/E(2⁺), tells the two apart: 10/3 for a rotor, 2 for a vibrator.</div>

## 1. Describing the shape

Write the nuclear surface as a multipole expansion and keep the quadrupole term for an axially symmetric shape:

```math
R(\theta) = R_0\left[1 + \beta\,Y_{20}(\theta)\right], \qquad Q_0 = \frac{3}{\sqrt{5\pi}}\,ZR_0^2\,\beta\,(1 + 0.16\beta)
```

<div class="meaning">

<dl>
<dt>`$\beta > 0$`</dt><dd>prolate (cigar), the usual case in rare earths and actinides, `$\beta \approx 0.2$` to `$0.35$`</dd>
<dt>`$\beta < 0$`</dt><dd>oblate (disc)</dd>
<dt>`$Q_0$`</dt><dd>intrinsic quadrupole moment, measured in the body frame: `$Q_0 = \int\rho(3z'^2 - r^2)\,d\tau/e$`</dd>
<dt>`$\gamma$`</dt><dd>a second parameter for non-axial (triaxial) shapes; `$\gamma = 0$` is axial</dd>
</dl>

</div>

**Worked example.** Take `$Z = 68$`, `$A = 170$`, `$\beta = 0.30$`. `$R_0 = 1.2\times170^{1/3} = 6.65$` fm, `$R_0^2 = 44.2$` fm². `$Q_0 = 0.757\times68\times44.2\times0.30\times1.048 = 715$` fm² = 7.2 b. One proton in an orbit of radius `$R_0$` gives at most about `$R_0^2 = 0.44$` b, so 7 b is a clear sign of many nucleons moving together.

### What the lab measures

The lab sees the intrinsic shape averaged over the rotation. For a state of spin `$I$` in a band with projection `$K$` on the symmetry axis:

```math
Q = Q_0\,\frac{3K^2 - I(I+1)}{(I+1)(2I+3)}
```

<div class="steps">
<div class="step"><p><b>I = 0 or ½.</b> Q = 0 always: no direction in space to measure. Every even-even ground state has Q = 0, deformed or not.</p></div>
<div class="step"><p><b>First 2⁺ in a K = 0 band.</b> Q = Q₀(0 − 6)/(3 × 7) = −(2/7)Q₀: negative for a prolate nucleus, because the rotation axis is perpendicular to the long axis.</p></div>
<div class="step"><p><b>Odd-A band head, I = K.</b> Q = Q₀ I(2I − 1)/[(I + 1)(2I + 3)], always smaller than Q₀ and approaching it only for large I.</p></div>
<div class="step"><p><b>B(E2).</b> The reduced transition rate 2⁺ → 0⁺ is B(E2) = (5/16π)e²Q₀², often 100 to 300 single-particle (Weisskopf) units in deformed nuclei: the cleanest measure of collectivity.</p></div>
</div>

**Worked example.** An odd-A nucleus with `$Q_0 = 7.0$` b and ground state `$I = K = 7/2$`: `$Q = 7.0\times(7/2)(6)/[(9/2)(10)] = 7.0\times21/45 = 3.3$` b.

<div class="problem" data-problem="spectroscopic-q"></div>

## 2. Rotational bands

A rigid symmetric top with moment of inertia `$\mathcal I$` about an axis perpendicular to the symmetry axis has `$E = \hbar^2[I(I+1) - K^2]/2\mathcal I$` plus intrinsic energy (see [rotational spectra](/learn/courses/gate-physics/rotational-spectra/) for the same physics in molecules). A quantum system cannot rotate about its own symmetry axis collectively, so `$K$` comes from the intrinsic (single-particle) motion.

```math
E_I = \frac{\hbar^2}{2\mathcal I}I(I+1)\ \ (K = 0:\ I = 0, 2, 4, \ldots), \qquad E_I = E_K + \frac{\hbar^2}{2\mathcal I}\left[I(I+1) - K(K+1)\right]\ \ (I = K, K+1, \ldots)
```

<div class="meaning">

<dl>
<dt>Ratios in a K = 0 band</dt><dd>`$E_4/E_2 = 20/6 = 3.33$`, `$E_6/E_2 = 7$`, `$E_8/E_2 = 12$`</dd>
<dt>E2 gamma rays</dt><dd>`$I \to I - 2$` has `$E_\gamma = (\hbar^2/2\mathcal I)(4I - 2)$`: 6, 14, 22, 30, ... units, rising in equal steps of `$8\hbar^2/2\mathcal I$`</dd>
<dt>Only even I for K = 0</dt><dd>the intrinsic state is symmetric under a 180° turn about an axis perpendicular to the symmetry axis, which removes the odd spins</dd>
<dt>K = ½ bands</dt><dd>Coriolis coupling adds a decoupling term `$a(-1)^{I+1/2}(I + \tfrac12)$`, which staggers the levels</dd>
</dl>

</div>

**Worked example.** A deformed nucleus has its 2⁺ at 80 keV. Then `$\hbar^2/2\mathcal I = 13.3$` keV and the band should run 4⁺ 267, 6⁺ 560, 8⁺ 960 keV, with gamma rays of 80, 187, 293, 400 keV. In ¹⁶⁶Er the measured levels are 81, 265, 545 and 911 keV: close, and slightly low at high spin. That is centrifugal stretching: the faster rotation deforms the nucleus a little more, raising `$\mathcal I$`. A two-term fit `$E = AI(I+1) - BI^2(I+1)^2$` with `$B \sim 10^{-3}A$` captures it.

<div class="problem" data-problem="rotor-gamma-ladder"></div>

### How big is 𝓘?

Two classical limits bracket the measured value.

```math
\mathcal I_{\text{rigid}} = \tfrac25 AmR_0^2(1 + 0.31\beta), \qquad \mathcal I_{\text{irrot}} = \frac{9}{8\pi}AmR_0^2\beta^2
```

For `$A = 170$`, `$R_0 = 6.65$` fm: `$\hbar^2/2\mathcal I_{\text{rigid}} = (197.33)^2/(2\times0.4\times170\times931.5\times44.2) \approx 7$` keV (6.4 keV with the `$1 + 0.31\beta$` factor), while the irrotational value with `$\beta = 0.3$` is about 13 times smaller in `$\mathcal I$` (so about 85 keV). The measured 13 keV sits in between: about half the rigid value. Pairing makes the nucleus partly superfluid, so not all nucleons follow the rotation. At high spin, pairs break (the Coriolis force aligns a pair of high-`$j$` nucleons) and `$\mathcal I$` jumps up: backbending.

## 3. Vibrations of a spherical nucleus

Near closed shells the nucleus stays spherical on average but its surface can oscillate. The lowest mode is quadrupole (`$\lambda = 2$`, the `$\lambda = 1$` mode would move the centre of mass). Each quantum, a phonon, carries `$2^+$`:

<div class="steps">
<div class="step"><p><b>One phonon.</b> A 2⁺ state at ħω (typically 0.5 to 1.5 MeV).</p></div>
<div class="step"><p><b>Two phonons.</b> Two identical bosons of spin 2 couple only to symmetric states: total I = 0, 2, 4 (not 1 or 3), all at 2ħω.</p></div>
<div class="step"><p><b>Three phonons.</b> I = 0, 2, 3, 4, 6 at 3ħω.</p></div>
<div class="step"><p><b>Ratio.</b> E(4⁺)/E(2⁺) = 2. Real vibrational nuclei (Cd, Te isotopes) show a triplet near 2ħω, split by anharmonic terms. Octupole (3⁻) phonons appear higher, near 2 to 3 MeV.</p></div>
</div>

<figure class="fig" data-fig="rotational-band"><figcaption>Rotor and vibrator built from the same first 2⁺ energy. Left: a K = 0 band with its E2 gamma rays rising in equal steps. Middle (optional): an odd-A band on K = 3/2 or 7/2, with every spin from K upward. Right: harmonic quadrupole phonon multiplets. The 4⁺ sits at 10/3 of the 2⁺ for the rotor and at 2 for the vibrator.</figcaption></figure>

**Telling them apart in an exam.** Look at, in order: the energy of the first 2⁺ (low, below 100 keV, means deformed); `$E(4^+)/E(2^+)$` (3.33 rotor, 2.0 vibrator, around 2.5 in between, `$\gamma$`-soft); the existence of a 0⁺, 2⁺, 4⁺ triplet near `$2E(2^+)$`; large B(E2) values. Nuclei between the limits are described by the interacting boson model, which interpolates with symmetry labels.

## 4. Deformed single-particle levels

In a deformed well the `$(2j+1)$`-fold degeneracy of each shell-model level splits by `$|\Omega|$`, the projection of `$j$` on the symmetry axis, each `$\pm\Omega$` pair twofold (the Nilsson model). For prolate shapes, low `$|\Omega|$` orbits (which lie along the long axis) go down in energy. The odd nucleon's `$\Omega$` becomes the band's `$K$`, and its parity the band's parity. This explains the ground-state spins of odd-A deformed nuclei, which the spherical shell model often gets wrong.

<div class="myth">

**"A nucleus with Q = 0 in its ground state must be spherical."** Every even-even ground state is `$0^+$` and has `$Q = 0$` in the lab, even ¹⁶⁶Er with `$Q_0 \approx 7$` b. Deformation shows up in the low 2⁺ energy, the `$I(I+1)$` band, the large B(E2), and the measured `$Q(2^+) \approx -(2/7)Q_0$`. The same averaging is why odd-A nuclei with `$I = \tfrac12$` never show a quadrupole moment.

</div>

<div class="keypoints">

- Shape: `$R = R_0(1 + \beta Y_{20})$`; `$Q_0 = (3/\sqrt{5\pi})ZR_0^2\beta(1 + 0.16\beta)$`; prolate `$\beta > 0$`.
- Lab moment `$Q = Q_0[3K^2 - I(I+1)]/[(I+1)(2I+3)]$`: zero for `$I = 0, \tfrac12$`; `$-\tfrac27Q_0$` for the 2⁺ of a K = 0 band.
- K = 0 band: `$E = (\hbar^2/2\mathcal I)I(I+1)$`, even I, `$E_4/E_2 = 10/3$`; gamma rays `$(\hbar^2/2\mathcal I)(4I-2)$`; odd-A: `$I = K, K+1, \ldots$` with `$I(I+1) - K(K+1)$`.
- `$\mathcal I_{\text{irrot}} < \mathcal I_{\text{exp}} \approx \tfrac12\mathcal I_{\text{rigid}}$`; pairing; centrifugal stretching; backbending.
- Vibrator: 2⁺ phonons; two-phonon 0⁺, 2⁺, 4⁺ at `$2\hbar\omega$`; three-phonon 0, 2, 3, 4, 6; `$E_4/E_2 = 2$`.
- B(E2) `$= (5/16\pi)e^2Q_0^2$` measures collectivity; Nilsson levels labelled by `$\Omega$` give K.

</div>

## Practise: exam questions on this lesson

<div class="qbank" data-bank="physics" data-topics="collective-model" data-exam="net" data-n="10"></div>

**Next:** [lesson 10.4](/learn/courses/csir-net-physics/quark-model/) goes inside the nucleon: isospin, strangeness and the quark model. For coupling angular momenta in these bands, see [LS and jj coupling](/learn/courses/gate-physics/ls-jj-coupling/); for the nuclear radius and binding used here, see the JAM lesson on [nuclei and radioactivity](/learn/courses/iit-jam-physics/nuclei-radioactivity/).
