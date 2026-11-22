---
title: Atoms
seoTitle: 'Atoms Class 12 notes: Rutherford and Bohr model'
summary: 'Class 12 Atoms with animations: alpha scattering, Rutherford’s nuclear model, atomic spectra, Bohr’s model of hydrogen, energy levels and spectral series.'
minutes: 80
updated: 2026-11-22
quiz:
  - q: 'In Rutherford’s experiment a very small fraction of alpha particles was turned back through more than 90°. This showed that:'
    choices: ['atoms are mostly solid', 'the positive charge and most of the mass are concentrated in a tiny nucleus', 'electrons are heavier than alpha particles', 'the alpha particles were absorbed']
    ans: 1
    why: 'Only a very small, very heavy, positively charged centre could repel an alpha particle backwards. Since only about 1 in 8000 was reflected, the nucleus must be tiny compared with the atom.'
  - q: 'The energy of the electron in the n-th orbit of hydrogen is −13.6/n² eV. The energy needed to move it from n = 2 to n = 3 is about:'
    choices: ['1.9 eV', '3.4 eV', '10.2 eV', '12.1 eV']
    ans: 0
    why: 'E₃ − E₂ = −1.51 − (−3.40) = 1.89 eV.'
  - q: 'An electron in a hydrogen atom jumps from n = 4 to n = 2. The line belongs to the:'
    choices: ['Lyman series', 'Balmer series', 'Paschen series', 'Brackett series']
    ans: 1
    why: 'The series is named after the lower level: ending at n = 2 is the Balmer series (visible light).'
sources:
  - 'NCERT Class 12 Physics, Chapter 12 “Atoms” (topic list only; all text, figures and questions here are original fibub work)'
  - 'H. Geiger and E. Marsden (1909), “On a diffuse reflection of the α-particles”, Proceedings of the Royal Society A 82, 495; E. Rutherford (1911), “The scattering of α and β particles by matter and the structure of the atom”, Philosophical Magazine 21, 669'
  - 'N. Bohr (1913), “On the constitution of atoms and molecules”, Philosophical Magazine 26, 1; J. J. Balmer (1885), Annalen der Physik und Chemie 25, 80'
  - 'Rydberg constant R∞ = 10 973 731.568 m⁻¹ and Bohr radius a₀ = 0.0529177 nm (CODATA 2018); the course uses the school values R = 1.097 × 10⁷ m⁻¹ and 0.529 Å'
  - 'Hydrogen line wavelengths (656.3, 486.1, 434.0, 410.2 nm; Lyman alpha 121.6 nm): NIST Atomic Spectra Database (air or vacuum values rounded)'
---

**Physics · Class 12 · Chapter 12 · about 80 minutes.** By the end you will be able to explain how Rutherford found the nucleus, use the distance of closest approach, explain why atoms give line spectra, derive the radius and energy of hydrogen’s orbits from Bohr’s postulates, and work out the wavelengths of the spectral series.

<div class="bigidea">An atom is almost entirely empty space with a tiny, heavy, positive nucleus at its centre; electrons are somewhere outside. Old physics says such an atom should collapse in a flash and glow with every colour. Real atoms are stable and glow only in sharp, fixed colours. Bohr’s fix: the electron can only be in certain orbits with certain energies, and light comes out only when it jumps between them.</div>

## 1. Early ideas about the atom

By 1900 the atom was no longer “indivisible”. In 1897 J. J. Thomson discovered the **electron**, a very light particle with negative charge. Since atoms are neutral, they must contain an equal amount of positive charge. How are they arranged?

Thomson’s **plum-pudding model** (1904) pictured the atom as a ball of positive charge, about 10⁻¹⁰ m across, with the electrons stuck inside like raisins in a pudding or seeds in a watermelon. It looked reasonable: it gave a neutral atom and let the electrons vibrate and give out light. A test was needed, and it came from an experiment with alpha particles.

## 2. Alpha-particle scattering and Rutherford’s nuclear model

An **alpha particle** is a helium nucleus (charge +2e, mass about 7300 times that of an electron) given out by some radioactive substances. In 1909, in Ernest Rutherford’s lab in Manchester, Hans Geiger and Ernest Marsden fired alpha particles of about 5.5 MeV at a very thin gold foil (about 10⁻⁷ m thick, a few hundred atoms) and counted how many were scattered at each angle using a screen coated with zinc sulphide that flashed when hit.

**What they found**

1. Most alpha particles went straight through, or were deflected only slightly (a degree or so).
2. A small number were scattered through large angles.
3. About 1 particle in 8000 bounced right back: it was deflected through more than 90°.

Rutherford said later that it was “as if you fired a 15-inch shell at a piece of tissue paper and it came back and hit you”.

**What this means.** In the plum-pudding atom the positive charge is spread out, so the electric force on an alpha particle is weak, and a pass through gives a deflection of well under 0.01°. To throw back a fast, heavy alpha particle you need a strong force, so a lot of positive charge and a lot of mass must be packed into a very small space. Electrons, being 7300 times lighter, cannot turn the alpha particle much, just as a bus is not turned by a sparrow.

Try it yourself. Choose a nucleus (or plum pudding) and shoot alpha particles at it. The thick curve is the one you control with the impact parameter b: the distance by which it misses the nucleus if there were no force.

<figure class="fig" data-fig="c12p-atom-scatter"><figcaption>Alpha particles passing a nucleus. Those aimed straight at it (small b) are turned back; those that miss by a long way bend only a little. This is what Geiger and Marsden saw. Switch to the plum-pudding model: the paths stay almost straight, which is wrong.</figcaption></figure>

The picture that fits is **Rutherford’s nuclear model** (1911):

- Nearly all of an atom’s positive charge and almost all its mass sit in a tiny central **nucleus**, about 10⁻¹⁵ to 10⁻¹⁴ m across, which is 10⁴ to 10⁵ times smaller than the atom (10⁻¹⁰ m).
- The electrons move around it at a relatively large distance, like planets round the Sun, held by the electrical attraction.
- An atom is mostly empty space. If the nucleus were a marble, the atom would be a football field.

<figure class="fig" data-fig="@qm-rutherford"><figcaption>Many alpha particles at once: the numbers at each angle fall off very fast with angle, in the way Rutherford’s theory predicts (the count goes as 1/sin⁴(θ/2)).</figcaption></figure>

<!--fig:tool rutherford-scattering-->

### 2.1 Distance of closest approach

An alpha particle aimed straight at the nucleus slows down because the nucleus repels it. It stops for an instant at a distance r₀ from the nucleus (the **distance of closest approach**) and then turns back. All its kinetic energy K has become electric potential energy:

```math
K = \frac{1}{4\pi\varepsilon_0}\,\frac{(2e)(Ze)}{r_0} \quad\Longrightarrow\quad r_0 = \frac{1}{4\pi\varepsilon_0}\,\frac{2Ze^2}{K}
```

<div class="meaning">
<dl>
<dt>K</dt><dd>kinetic energy of the alpha particle far away</dd>
<dt>2e, Ze</dt><dd>charge of the alpha particle and of the nucleus (Z is the atomic number, 79 for gold)</dd>
<dt>r₀</dt><dd>distance of closest approach; it gives an upper limit on the nuclear radius</dd>
<dt>Physical meaning</dt><dd>It is like a ball thrown up: it rises until all its kinetic energy has become potential energy. Here the “hill” is the electric repulsion of the nucleus. A faster alpha particle climbs closer.</dd>
</dl>
</div>

A handy number: `$\dfrac{e^2}{4\pi\varepsilon_0} = 1.44$` MeV fm, so for K in MeV, `$r_0 = 2.88\,Z/K$` fm (1 fm = 10⁻¹⁵ m). For a 5.5 MeV alpha particle on gold, r₀ = 2.88 × 79/5.5 = 41 fm = 4.1 × 10⁻¹⁴ m. The nucleus must be smaller than this; it is in fact about 7 fm.

<figure class="fig" data-fig="c12p-atom-closest"><figcaption>The potential energy U = 2.88Z/r (MeV, r in fm) of an alpha particle near a nucleus. The orange line is the alpha particle’s total energy E. Slide the particle in: its kinetic energy is E − U and it reaches zero at r₀. The green bar shows the real size of the nucleus: far inside.</figcaption></figure>

<div class="problem" data-problem="c12p-atom-closest"></div>

### 2.2 Where Rutherford’s model fails

Rutherford’s atom has two serious problems:

1. **Stability.** An electron going round in a circle is always accelerating. By Maxwell’s theory an accelerating charge radiates energy. The electron would lose energy and spiral into the nucleus in about 10⁻¹¹ s. But atoms last for ever.
2. **Spectra.** As the electron spirals in, the light it gives out would change smoothly, and we should see a continuous spectrum. But atoms give out light only at certain exact wavelengths (line spectra).

<figure class="fig" data-fig="c12p-atom-collapse"><figcaption>Switch between the classical (Rutherford) atom and Bohr’s. In the classical atom the electron radiates, spirals in and is gone. In Bohr’s atom certain orbits are stable.</figcaption></figure>

<div class="myth">

**“Electrons orbit the nucleus exactly like planets orbit the Sun.”** Only as a rough picture. A planet can have any orbit, but an electron in an atom can only be found with certain allowed energies. And the planets’ orbits do not collapse because gravity radiates almost nothing, while an electron’s would, by classical physics.

</div>

## 3. Atomic spectra

When an element is heated or excited by an electric discharge (as in a neon sign or a sodium street lamp), it gives off light. Pass that light through a prism or a grating and you see not a rainbow but a set of bright lines on a dark background: its **emission line spectrum**. Each element has its own pattern of lines, like a fingerprint. Hydrogen’s four visible lines are red (656 nm), blue-green (486 nm), blue (434 nm) and violet (410 nm).

If white light is passed through a cool gas, dark lines appear at exactly the same wavelengths: an **absorption spectrum**. The dark lines in sunlight (Fraunhofer lines) tell us which elements are in the Sun’s atmosphere. Helium was found in the Sun (1868) before it was found on Earth.

<figure class="fig" data-fig="c12p-atom-spectra"><figcaption>Choose the spectrum and the gas. A hot solid gives every colour; a glowing gas gives only a few bright lines; the same gas, cool, takes the same lines out of white light.</figcaption></figure>

### 3.1 The hydrogen series

Hydrogen is the simplest atom and has the simplest spectrum. In 1885 a Swiss schoolteacher, Johann Balmer, found a formula that fitted the four visible lines. Later Johannes Rydberg generalised it to all the lines of hydrogen:

```math
\frac{1}{\lambda} = R\left(\frac{1}{n_f^{\,2}} - \frac{1}{n_i^{\,2}}\right), \qquad n_i = n_f + 1,\ n_f + 2,\ \dots
```

where R = 1.097 × 10⁷ m⁻¹ is the **Rydberg constant**. Each value of n_f gives a **series**:

| Series | n_f | n_i | Region | Wavelengths |
|---|---|---|---|---|
| Lyman | 1 | 2, 3, 4 … | ultraviolet | 91 to 122 nm |
| Balmer | 2 | 3, 4, 5 … | visible and near UV | 365 to 656 nm |
| Paschen | 3 | 4, 5, 6 … | infrared | 820 to 1875 nm |
| Brackett | 4 | 5, 6, 7 … | infrared | 1458 to 4051 nm |
| Pfund | 5 | 6, 7, 8 … | far infrared | 2280 to 7458 nm |

The **longest wavelength** of a series comes from n_i = n_f + 1 (the smallest energy jump). The **shortest wavelength** (series limit) comes from n_i = ∞: `$\lambda_{min} = n_f^2/R$`. For the Balmer series: λ_max = 656 nm and λ_min = 4/1.097×10⁷ = 365 nm.

<div class="problem" data-problem="c12p-atom-wavelength"></div>

<div class="problem" data-problem="c12p-atom-limit"></div>

The formula worked, but nobody knew why. Why only these wavelengths? That needed a new idea.

## 4. The Bohr model of the hydrogen atom

In 1913 the Danish physicist Niels Bohr kept Rutherford’s nuclear atom and added three bold postulates. They break the rules of classical physics on purpose, because classical physics had failed:

1. **Stationary orbits.** An electron in an atom can revolve in certain circular orbits without radiating energy. These “stationary” orbits are stable.
2. **Quantisation of angular momentum.** The allowed orbits are those in which the electron’s angular momentum is a whole-number multiple of h/2π:

```math
mvr = \frac{nh}{2\pi}, \qquad n = 1, 2, 3, \dots
```

3. **Jumps.** The atom radiates (or absorbs) energy only when the electron jumps from one allowed orbit to another. The photon has energy equal to the difference:

```math
h\nu = E_i - E_f
```

Here n is called the **principal quantum number**.

### 4.1 Radius, speed and energy of the orbits

The electron (charge −e, mass m) goes round the proton (charge +e) in a circle of radius r at speed v. Let `$k = 1/4\pi\varepsilon_0$`. Follow the algebra:

<div class="steps" data-fig="c12p-atom-bohr">
<div class="step">An electron of mass m and charge −e circles a stationary proton at a radius r with speed v. The attraction of the proton, ke²/r², points towards the centre.</div>
<div class="step">This electrical force provides the centripetal force: mv²/r = ke²/r². Multiply by r: mv² = ke²/r. (1)</div>
<div class="step">Bohr’s second postulate: the angular momentum is quantised, mvr = nh/2π. (2)</div>
<div class="step">Divide (1) by the square of (2) to remove v: r = n²h²/(4π²mke²). Put in the constants: r = 0.0529 n² nm (a₀ = 0.0529 nm is the Bohr radius). Substituting back into (2): v = 2πke²/(nh) = 2.19 × 10⁶/n m/s.</div>
<div class="step">The energy. Kinetic: K = ½mv² = ke²/2r (from (1)). Potential: U = −ke²/r. So the total E = K + U = −ke²/2r. It is negative: the electron is bound.</div>
<div class="step">Put r = 0.0529 n² nm into E = −ke²/2r. The result, in electron volts, is E_n = −13.6/n² eV. The ground state (n = 1) has E = −13.6 eV; the energy needed to remove the electron altogether is +13.6 eV, the <b>ionisation energy</b>.</div>
</div>

```math
r_n = 0.0529\,n^2\ \text{nm}, \qquad v_n = \frac{2.19\times10^{6}}{n}\ \text{m/s}, \qquad E_n = -\frac{13.6}{n^2}\ \text{eV}
```

<div class="meaning">
<dl>
<dt>n</dt><dd>principal quantum number (1, 2, 3 …); n = 1 is the ground state, larger n are excited states</dd>
<dt>r_n</dt><dd>radius of the n-th orbit; grows as n²</dd>
<dt>v_n</dt><dd>speed in that orbit; falls as 1/n (outer electrons are slower)</dd>
<dt>E_n</dt><dd>total energy; −13.6 eV for n = 1, −3.40 eV for n = 2, −1.51 eV for n = 3, nearly 0 for large n</dd>
<dt>Physical meaning</dt><dd>Energy is “quantised”: only certain values are allowed. The negative sign means the electron is bound; the closer to zero, the less tightly it is held, and E = 0 means just free.</dd>
</dl>
</div>

For a **hydrogen-like ion** (a nucleus of charge Ze with one electron, such as He⁺ with Z = 2 or Li²⁺ with Z = 3), replace e² by Ze² in the force: `$r_n = 0.0529\,n^2/Z$` nm, `$v_n = 2.19\times10^6\,Z/n$` m/s and `$E_n = -13.6\,Z^2/n^2$` eV.

Now ride the electron. The orbits are drawn to scale (radius ∝ n²), and when you pick a new n the electron jumps and a photon is emitted (going down) or absorbed (going up).

<figure class="fig" data-fig="c12p-atom-orbit"><figcaption>Pick an orbit with the buttons. A jump down gives out a photon of energy E_i − E_f; its wavelength and colour are shown. A jump up needs a photon of exactly that energy. Jumps to n = 1 make ultraviolet light; to n = 2, visible light (for the first few lines).</figcaption></figure>

<div class="problem" data-problem="c12p-atom-radius"></div>

### 4.2 Energy levels and the spectrum

When the electron jumps from the level n_i to the lower level n_f, it gives out a photon of energy `$h\nu = E_i - E_f = 13.6\left(\frac{1}{n_f^2}-\frac{1}{n_i^2}\right)$` eV. Since ν = c/λ,

```math
\frac{1}{\lambda} = \frac{13.6\ \text{eV}}{hc}\left(\frac{1}{n_f^2}-\frac{1}{n_i^2}\right)
```

This is **exactly Rydberg’s formula**, with `$R = 13.6\,\text{eV}/hc = 1.097\times10^7$` m⁻¹: Bohr’s model reproduces R from the constants h, m, e and c, which is why it was a triumph. Each series is the set of all jumps that end at one level. Absorption is the reverse: only photons whose energy equals the gap between two levels are absorbed, so the dark lines fall exactly where the bright lines were.

**A worked jump.** To find the wavelength of one line, follow the steps for the electron falling from n = 4 to n = 2:

<div class="steps" data-fig="c12p-atom-jump">
<div class="step">First write the energies of the levels: E_n = −13.6/n² eV gives −13.6, −3.40, −1.51, −0.85, −0.54 eV for n = 1 to 5. Higher levels lie closer to zero.</div>
<div class="step">The electron sits in the level n = 4, with E₄ = −0.85 eV (an excited state).</div>
<div class="step">It jumps down to n = 2, where E₂ = −3.40 eV. The atom loses energy, so the energy must leave as a photon.</div>
<div class="step">The photon carries exactly the difference: hν = E₄ − E₂ = −0.85 − (−3.40) = 2.55 eV.</div>
<div class="step">From E = hc/λ = 1240/λ (nm): λ = 1240/2.55 = 486 nm. This is blue-green light.</div>
<div class="step">The jump ends at n = 2, so it belongs to the Balmer series. It is the second line of the series, called H-β.</div>
</div>

<figure class="fig" data-fig="c12p-atom-levels"><figcaption>The levels of hydrogen and one series at a time. Press a series: the arrows are the jumps that end at that level, and the strip below shows the lines they make, from the longest wavelength (first line) to the series limit.</figcaption></figure>

<!--fig:tool hydrogen-spectrum-->

<div class="problem" data-problem="c12p-atom-lines"></div>

**Excited states and ionisation.** To raise the electron from n = 1 to a higher level you must supply energy: 10.2 eV to reach n = 2, 12.09 eV to reach n = 3, and 13.6 eV to remove it completely (ionisation). The atom gets this energy from collisions or from photons of exactly the right size. An excited atom returns to the ground state in about 10⁻⁸ s, in one jump or in several.

**How many lines?** If hydrogen atoms are excited to the level n, the electrons can come down in many ways. The number of different lines possible is `$n(n-1)/2$`. For n = 4 there are 6 lines.

## 5. De Broglie’s explanation of Bohr’s second postulate

Why should the angular momentum be exactly nh/2π? Louis de Broglie (1924) had an answer using the idea of matter waves from the last chapter. An electron moving in a circle is a wave that goes round the orbit. The wave must fit the orbit: if it did not, it would not repeat itself after one turn, and after many turns it would cancel itself out. So the circumference must hold a whole number of wavelengths, like a standing wave on a guitar string bent into a ring:

```math
2\pi r = n\lambda = n\,\frac{h}{mv} \quad\Longrightarrow\quad mvr = \frac{nh}{2\pi}
```

which is exactly Bohr’s condition. The quantisation of the orbits is the quantisation of waves that fit.

<figure class="fig" data-fig="@qm-bohr-standing"><figcaption>An electron standing wave round a Bohr orbit: for n = 1, 2, 3 … a whole number of wavelengths fits. Choose a non-whole number and the wave cancels itself.</figcaption></figure>

## 6. Limitations of the Bohr model

- It works only for hydrogen and hydrogen-like ions (one electron). It fails for helium and every atom with two or more electrons.
- It cannot explain the relative <b>brightness</b> of the spectral lines, or why some jumps are more likely than others.
- It cannot explain the splitting of lines in a magnetic field or the finer structure of lines.
- It mixes classical ideas (circular orbits) with quantum ones (quantised angular momentum) without a reason. Today we know that electrons do not follow orbits: the full quantum theory gives each electron a cloud of probability.

Nevertheless the Bohr model gave the right energy levels for hydrogen, and it was the first successful step towards quantum mechanics.

<div class="history">

**Beyond the syllabus (not examined in Class 12 boards).** With the impact parameter b (the distance by which an alpha particle would miss the nucleus), Rutherford’s theory gives `$b = \dfrac{Ze^2}{4\pi\varepsilon_0K}\cot\dfrac{\theta}{2}$` for the scattering angle θ. Using the correct (reduced) mass of the electron and the proton changes the hydrogen wavelengths a little: R_H = 1.09678 × 10⁷ m⁻¹ instead of R∞ = 1.09737 × 10⁷ m⁻¹. Heavy hydrogen (deuterium) has a slightly different spectrum, and that is how it was discovered in 1931.

</div>

<div class="history">

<ul class="timeline">
<li><b>1885</b> Balmer finds the formula for the visible lines of hydrogen.</li>
<li><b>1897</b> J. J. Thomson discovers the electron.</li>
<li><b>1904</b> Thomson’s plum-pudding model.</li>
<li><b>1909</b> Geiger and Marsden’s scattering experiment.</li>
<li><b>1911</b> Rutherford proposes the nuclear atom.</li>
<li><b>1913</b> Bohr’s model of hydrogen.</li>
<li><b>1914</b> The Franck–Hertz experiment confirms that atoms have energy levels.</li>
<li><b>1924</b> De Broglie explains Bohr’s orbits with standing waves.</li>
</ul>

</div>

<div class="keypoints">

- Rutherford: most alpha particles pass straight through; a few (about 1 in 8000) rebound. The atom has a tiny, dense, positive nucleus (about 10⁻¹⁵ m) and is mostly empty space.
- Distance of closest approach: K = (1/4πε₀)(2Ze²)/r₀, so r₀ = 2.88Z/K fm (K in MeV).
- Classical failures: an orbiting electron would radiate and spiral into the nucleus, and give a continuous spectrum. Real atoms are stable and give line spectra.
- Hydrogen lines: 1/λ = R(1/n_f² − 1/n_i²), R = 1.097 × 10⁷ m⁻¹. Series: Lyman (n_f = 1, UV), Balmer (2, visible), Paschen (3), Brackett (4), Pfund (5) (infrared).
- Bohr’s postulates: stable orbits; mvr = nh/2π; radiation only in jumps with hν = E_i − E_f.
- r_n = 0.0529 n² nm, v_n = 2.19 × 10⁶/n m/s, E_n = −13.6/n² eV. For hydrogen-like ions: r ∝ n²/Z, E ∝ Z²/n².
- Ionisation energy of hydrogen is 13.6 eV. Number of lines from level n is n(n − 1)/2.
- De Broglie: the orbit holds a whole number of wavelengths, 2πr = nλ, which gives mvr = nh/2π. Limits of the model: one-electron atoms only, no intensities, no fine structure.

</div>

Going further for JEE/NEET: hydrogen-like ions, the number of lines, recoil of the atom and harder spectral-series problems are in [Atoms (JEE)](/learn/courses/engineering-entrance/atoms/), with extra questions in [its question set](/learn/courses/engineering-entrance/atoms-questions/).
