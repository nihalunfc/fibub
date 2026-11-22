---
title: Binding energy and the semi-empirical mass formula
seoTitle: 'Binding energy and the SEMF | GATE Physics'
summary: 'Binding energy from atomic masses, mass excess and separation energies; the liquid-drop (Weizsäcker) mass formula term by term, with the reasons for each term and its coefficient; the valley of stability, mass parabolas for odd and even A, beta-decay Q values, double beta decay, and the energy and stability limits of fission.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'In the semi-empirical mass formula, which term makes heavy nuclei prefer more neutrons than protons?'
    choices: ['the Coulomb term', 'the asymmetry term', 'the surface term', 'the pairing term']
    ans: 0
    why: 'The asymmetry term alone would make N = Z best. The Coulomb repulsion, growing as Z²/A^(1/3), pushes the minimum to Z₀ = A/(2 + 0.0154A^(2/3)), below A/2, more so for heavy nuclei.'
  - q: 'For an isobar chain with odd A, how many beta-stable nuclides does the mass formula predict?'
    choices: ['exactly one', 'two or three', 'none', 'one for every even Z']
    ans: 0
    why: 'With odd A the pairing term is zero and all isobars lie on one parabola, so each can beta decay down to the single lowest one.'
  - q: 'Fission of a nucleus into two equal halves becomes energetically possible when'
    choices: ['the Coulomb energy saved exceeds the surface energy added', 'the asymmetry energy is zero', 'Z²/A is below 18', 'the pairing energy is positive']
    ans: 0
    why: 'Splitting reduces the Coulomb energy (by a factor 0.63) but increases the surface (by 1.26). The balance gives release for Z²/A above about 18; spontaneous fission with no barrier needs Z²/A above about 51.'
sources:
  - 'K. S. Krane, Introductory Nuclear Physics (1988), chapters 3 and 13'
  - 'B. Povh, K. Rith, C. Scholz, F. Zetsche and W. Rodejohann, Particles and Nuclei, 7th ed. (2015), chapter 2'
  - 'M. Wang et al., The AME 2020 atomic mass evaluation, Chinese Physics C 45, 030003 (2021)'
  - 'GATE Physics (PH) syllabus, Nuclear and Particle Physics section, published by the organising IIT each year'
---

**Module 8 · about 50 minutes.** The [JAM lesson](/learn/courses/iit-jam-physics/nuclei-radioactivity/) showed the binding curve and why fission and fusion both release energy. Here we build the curve from a model: the nucleus as a charged liquid drop, with two quantum corrections. Five terms and five numbers reproduce the masses of about 3000 nuclides to within a few MeV.

<div class="bigidea">The binding energy of a nucleus is mostly proportional to A, because each nucleon bonds only with its neighbours. The corrections are a surface (nucleons at the edge have fewer bonds), the Coulomb repulsion of the protons, a quantum cost for unequal N and Z, and a bonus for pairs. Together they explain the binding curve, the valley of stability, which nuclei beta decay, and why heavy nuclei fission.</div>

## 1. Binding energy from masses

Tables list **atomic** masses, so use the hydrogen atom for each proton; the electron masses cancel (electron binding is negligible here).

```math
B(Z, A) = \left[Z\,M(^1\text{H}) + N\,m_n - M(Z, A)\right]c^2, \qquad 1\ \text{u}\,c^2 = 931.494\ \text{MeV}
```

<div class="meaning">

<dl>
<dt>Mass excess</dt><dd>`$\Delta = [M - A\,\text{u}]c^2$`; tables list it, and `$Q$` values are differences of `$\Delta$`: `$\Delta(^1\text{H}) = 7.289$` MeV, `$\Delta(n) = 8.071$` MeV, `$\Delta(^{12}\text{C}) = 0$` by definition</dd>
<dt>Neutron separation energy</dt><dd>`$S_n = B(Z, A) - B(Z, A-1)$`: energy to pull out the last neutron; similarly `$S_p$` with `$Z - 1$`</dd>
<dt>`$B/A$`</dt><dd>rises steeply to about 8 MeV by `$A = 20$`, peaks at 8.79 MeV near `$^{56}$`Fe and `$^{62}$`Ni, then falls slowly to 7.6 MeV for uranium</dd>
</dl>

</div>

**Worked example.** `$^{56}$`Fe has `$M = 55.934936$` u. Then `$B = (26\times1.007825 + 30\times1.008665 - 55.934936)\times931.494 = 492.3$` MeV, or 8.79 MeV per nucleon. Separation energies jump at magic numbers: `$S_n(^{17}$`O`$) = 4.14$` MeV, but `$S_n(^{16}$`O`$) = 15.7$` MeV, a clue to the shell structure of [lesson 8.3](/learn/courses/gate-physics/shell-model/).

## 2. The liquid-drop mass formula

```math
B(Z, A) = a_VA - a_SA^{2/3} - a_C\frac{Z(Z-1)}{A^{1/3}} - a_A\frac{(A - 2Z)^2}{A} + \delta(A, Z)
```

with, in one common fit, `$a_V = 15.8$`, `$a_S = 18.3$`, `$a_C = 0.714$`, `$a_A = 23.2$` MeV and `$\delta = +12/\sqrt A$` MeV for even-even nuclei, `$-12/\sqrt A$` for odd-odd and 0 for odd A. (Other fits differ by a few percent; GATE questions give the coefficients.)

<div class="steps">
<div class="step"><p><b>Volume.</b> Short-range forces saturate: each nucleon binds to a fixed number of neighbours, so B ∝ A. (With long-range forces every pair would count and B would grow as A².)</p></div>
<div class="step"><p><b>Surface.</b> Nucleons at the surface have fewer neighbours. The surface area is 4πR² ∝ A^(2/3). This is the surface tension of the drop, and it matters most for light nuclei.</p></div>
<div class="step"><p><b>Coulomb.</b> Z protons spread uniformly through a sphere of radius R = r₀A^(1/3) have energy (3/5)Z(Z − 1)e²/(4πε₀R). With r₀ = 1.2 fm this gives a_C = (3/5)(1.44/1.2) = 0.72 MeV, close to the fitted value: a check from first principles.</p></div>
<div class="step"><p><b>Asymmetry.</b> In the Fermi gas of lesson 8.1, protons and neutrons fill separate ladders of levels. Moving nucleons from one ladder to the other to make N ≠ Z costs kinetic energy ∝ (N − Z)²/A. It is a quantum effect (the Pauli principle), with no classical drop analogue.</p></div>
<div class="step"><p><b>Pairing.</b> Like nucleons in time-reversed orbits (j, m and j, −m) bind extra strongly. Even-even nuclei gain, odd-odd nuclei lose, and odd-A nuclei sit in between.</p></div>
</div>

<figure class="fig" data-fig="semf-terms"><figcaption>Terms against A: start from the volume term (15.8 MeV per nucleon) and subtract the surface, Coulomb and asymmetry losses along the valley of stability; what is left is the binding curve. Mass parabola: masses of the isobars of the chosen A against Z, with the even-even and odd-odd sheets split by pairing.</figcaption></figure>

**Worked example.** `$^{56}$`Fe from the formula: volume 884.8, surface −267.9, Coulomb `$-0.714\times26\times25/56^{1/3} = -121.3$`, asymmetry `$-23.2\times4^2/56 = -6.6$`, pairing `$+12/\sqrt{56} = +1.6$`; total 490.6 MeV, 8.76 MeV per nucleon, within 0.4% of the measured 492.3 MeV. The surface term is the biggest correction for iron; in uranium the Coulomb term overtakes it (965 MeV against 703 MeV), which is why the curve falls at large A.

## 3. The valley of stability and mass parabolas

At fixed A the formula is a quadratic in Z. Setting `$\partial B/\partial Z = 0$` (and using `$Z^2$` for `$Z(Z-1)$`):

```math
Z_0 = \frac{A}{2 + (a_C/2a_A)\,A^{2/3}} \approx \frac{A}{2 + 0.0154\,A^{2/3}}
```

For A = 56 this gives 25.2 (iron has 26); for A = 238, 91.9 (uranium has 92). Including the neutron-hydrogen mass difference moves `$Z_0$` up slightly. The mass of the isobars is then a parabola in Z:

- **Odd A:** one parabola. Nuclides on the neutron-rich side `$\beta^-$` decay toward `$Z_0$`, those on the proton-rich side decay by `$\beta^+$` or electron capture. Exactly one isobar is stable (with rare near-degenerate exceptions).
- **Even A:** two parabolas `$2\delta$` apart, the odd-odd one above. An odd-odd nucleus near the bottom can often decay both ways (`$^{64}$`Cu does `$\beta^-$` and `$\beta^+$`), and two even-even isobars can both be stable, because the single-beta step between them goes up to the odd-odd sheet. They can still change into each other by **double beta decay**, `$2n \to 2p + 2e^- + 2\bar\nu$`, with half-lives above `$10^{18}$` years (`$^{76}$`Ge to `$^{76}$`Se, `$^{130}$`Te to `$^{130}$`Xe).

**Beta Q values** come straight from atomic masses:

```math
Q_{\beta^-} = [M(Z, A) - M(Z+1, A)]c^2, \quad Q_{\beta^+} = [M(Z, A) - M(Z-1, A) - 2m_e]c^2, \quad Q_{EC} = [M(Z, A) - M(Z-1, A)]c^2
```

The `$2m_e$` in `$\beta^+$` is why some proton-rich nuclei can only decay by electron capture: they need at least 1.022 MeV of mass difference to emit a positron.

Click cells in the three regions, or pick an example such as C-14 or U-238.

<figure class="fig" data-fig="@qm-nuclide-chart"><figcaption>The stable band bends away from N = Z because of proton repulsion. Colours show the predicted decay, and the dashed lines mark the magic numbers the plain formula cannot explain.</figcaption></figure>

<div class="problem" data-problem="semf-most-stable"></div>

## 4. Fission and the limits of stability

Split a nucleus (Z, A) into two halves. The volume and asymmetry terms do not change; the surface grows by a factor `$2\times2^{-2/3} = 1.26$` and the Coulomb energy falls by `$2\times2^{-5/3} = 0.63$`. The energy released is

```math
Q_{\text{sym}} \approx 0.37\,a_C\frac{Z^2}{A^{1/3}} - 0.26\,a_SA^{2/3} > 0 \iff \frac{Z^2}{A} > 0.70\,\frac{a_S}{a_C} \approx 18
```

So fission releases energy for everything heavier than about silver, but a barrier holds it back. The barrier vanishes when a small elongation lowers the energy at once. For a spheroid of small eccentricity `$\varepsilon$`, the surface energy grows as `$1 + \tfrac25\varepsilon^2$` and the Coulomb energy falls as `$1 - \tfrac15\varepsilon^2$`, so the sphere is unstable when

```math
E_C^{(0)} > 2E_S^{(0)} \iff \frac{Z^2}{A} > \frac{2a_S}{a_C} \approx 51
```

Uranium (`$Z^2/A = 35.9$` for `$^{236}$`U) is well below this limit: its fission barrier is about 6 MeV. Capturing a slow neutron adds `$S_n \approx 6.5$` MeV to `$^{236}$`U, enough to go over the barrier; `$^{238}$`U capturing a neutron gets only 4.8 MeV (odd N, no pairing bonus), which is why `$^{235}$`U is the fissile isotope.

Step through it with the buttons below, or press Play, and use the controls on the picture to try your own values.

<div class="steps" data-fig="@qm-fission-steps"><div class="step">A slow neutron approaches U-235 and is absorbed.</div><div class="step">U-236 forms in an excited state and starts to wobble like a charged liquid drop.</div><div class="step">The drop stretches into a peanut: surface tension pulls back, Coulomb repulsion pushes out.</div><div class="step">Past the fission barrier the neck thins out.</div><div class="step">Scission: the neck snaps and two fragments form.</div><div class="step">The fragments fly apart and 2 to 3 prompt neutrons escape to carry on the chain.</div><div class="step">Energy tally: about 200 MeV per fission, mostly fragment motion.</div></div>

**Worked example.** `$^{236}$`U `$\to$` 2 `$^{118}$`Pd from the formula: surface `$2\times440.3 - 698.9 = +181.7$` MeV cost, Coulomb `$967.3 - 2\times301.3 = 364.6$` MeV gained, asymmetry unchanged, pairing `$+1.4$`. Net `$Q \approx 184$` MeV, close to the 200 MeV measured for real (asymmetric) fission, most of it as kinetic energy of the fragments.

**Fusion** is the other side of the curve: light nuclei gain binding by joining because the surface term per nucleon falls. `$^2$`H + `$^3$`H `$\to$` `$^4$`He + n releases 17.6 MeV, much of it from the exceptionally tight `$^4$`He (28.3 MeV, 7.07 MeV per nucleon), which the smooth formula does not capture.

<div class="myth">

**"The mass formula gives exact Q values, so it can replace a mass table."** It is a smooth average, good to a few MeV for heavy nuclei and much worse for light ones and near magic numbers, where shell effects add or remove several MeV. For a Q value that decides whether a decay happens, use measured masses; use the formula for trends, estimates and understanding.

</div>

<div class="keypoints">

- `$B = [ZM(^1\text{H}) + Nm_n - M]c^2$` with atomic masses; `$S_n = B(Z, A) - B(Z, A-1)$`.
- SEMF: `$a_VA - a_SA^{2/3} - a_CZ(Z-1)/A^{1/3} - a_A(A-2Z)^2/A + \delta$`; typical 15.8, 18.3, 0.714, 23.2 MeV and `$\delta = \pm12/\sqrt A$`.
- `$a_C = \tfrac35e^2/(4\pi\varepsilon_0r_0)$`; the asymmetry term comes from the Pauli principle, pairing from time-reversed pairs.
- `$Z_0 = A/(2 + 0.0154A^{2/3})$`; odd A: one parabola, one stable isobar; even A: two parabolas `$2\delta$` apart.
- `$Q_{\beta^-} = \Delta M c^2$`, `$Q_{\beta^+} = \Delta Mc^2 - 2m_ec^2$`, `$Q_{EC} = \Delta Mc^2$` (atomic masses).
- Symmetric fission releases energy for `$Z^2/A > 18$`; no barrier for `$Z^2/A > 2a_S/a_C \approx 51$`; about 200 MeV per fission.

</div>

## Practise: exam questions on this lesson

<div class="qbank" data-bank="physics" data-topics="binding-energy-semf" data-exam="gate" data-n="10"></div>

**Next:** [lesson 8.3](/learn/courses/gate-physics/shell-model/) explains what the liquid drop cannot: the magic numbers, the jumps in separation energy and the spins and moments of nuclei.
