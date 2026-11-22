---
title: Dual Nature of Radiation and Matter
seoTitle: 'Dual Nature Class 12 notes: photoelectric effect, de Broglie'
summary: 'Class 12 Dual Nature with animations: photoelectric effect, stopping potential, Einstein’s equation, photons, de Broglie waves, the Davisson-Germer experiment.'
minutes: 80
updated: 2026-11-22
quiz:
  - q: 'In the photoelectric effect, doubling the intensity of light of a fixed frequency above the threshold:'
    choices: ['doubles the maximum kinetic energy of the electrons', 'doubles the saturation photocurrent', 'doubles the stopping potential', 'doubles the threshold frequency']
    ans: 1
    why: 'Twice the intensity means twice as many photons per second, so twice as many electrons. Each photon has the same energy hν, so K_max and V₀ do not change.'
  - q: 'The de Broglie wavelength of a particle of mass m and kinetic energy K is:'
    choices: ['h/(mK)', 'h/√(2mK)', 'h√(2mK)', 'hK/m']
    ans: 1
    why: 'p = √(2mK) and λ = h/p, so λ = h/√(2mK).'
  - q: 'A metal has work function 2.0 eV. Light of wavelength 400 nm (photon energy 3.1 eV) falls on it. The stopping potential is:'
    choices: ['1.1 V', '2.0 V', '3.1 V', '5.1 V']
    ans: 0
    why: 'K_max = hν − φ = 3.1 − 2.0 = 1.1 eV, and eV₀ = K_max, so V₀ = 1.1 V.'
sources:
  - 'NCERT Class 12 Physics, Chapter 11 “Dual Nature of Radiation and Matter” (topic list only; all text, figures and questions here are original fibub work)'
  - 'A. Einstein (1905), “Über einen die Erzeugung und Verwandlung des Lichtes betreffenden heuristischen Gesichtspunkt”, Annalen der Physik 17, 132–148'
  - 'R. A. Millikan (1916), “A direct photoelectric determination of Planck’s h”, Physical Review 7, 355–388'
  - 'L. de Broglie (1924), doctoral thesis “Recherches sur la théorie des quanta”; C. Davisson and L. H. Germer (1927), “Diffraction of electrons by a crystal of nickel”, Physical Review 30, 705–740'
  - 'Constants (exact SI values): h = 6.62607015 × 10⁻³⁴ J s, e = 1.602176634 × 10⁻¹⁹ C, c = 299 792 458 m/s. Typical work functions: H. B. Michaelson (1950), Journal of Applied Physics 21, 536 (values depend on the surface)'
---

**Physics · Class 12 · Chapter 11 · about 80 minutes.** By the end you will be able to explain the photoelectric effect and why the wave picture of light could not explain it, use Einstein’s equation to find the stopping potential and threshold frequency, treat light as photons, and find the de Broglie wavelength of an electron or any other particle.

<div class="bigidea">Light behaves like a wave (it interferes and diffracts, Chapter 10) but, in the photoelectric effect, it behaves like a stream of particles called photons. And particles such as electrons behave like waves. Nature does not have separate “wave stuff” and “particle stuff”: everything shows both faces, depending on how we look.</div>

## 1. Electron emission

A piece of metal has many **free electrons** moving about inside it, yet they do not leave the metal. Something holds them in. It is like a ball in a well: to get it out you must give it enough energy to climb to the top. The least energy an electron needs to escape from the surface of the metal is called the **work function** φ₀ (also written φ). It depends on the metal and its surface. It is measured in **electron volts**:

```math
1\ \text{eV} = 1.6\times10^{-19}\ \text{J}
```

(1 eV is the energy an electron gains when it moves through a potential difference of 1 volt.) For most metals φ₀ is a few eV.

| Metal | Work function φ₀ (eV, typical) |
|---|---|
| Caesium | 2.1 |
| Potassium | 2.3 |
| Sodium | 2.3 |
| Zinc | 4.3 |
| Copper | 4.7 |
| Platinum | 5.6 |

Values vary with the surface and the source; these are typical. Caesium and the alkali metals have the lowest, so they emit electrons most easily.

There are three ways to give the electrons the energy they need:

1. **Thermionic emission**: heat the metal. Hot electrons gain energy; a few have more than φ₀ and escape. (Old TV tubes and valves.)
2. **Field emission**: apply a very strong electric field (about 10⁸ V/m) that pulls the electrons out. (Sharp tips in electron microscopes.)
3. **Photoelectric emission**: shine light of suitable frequency on the metal. This is the subject of the rest of the chapter.

<figure class="fig" data-fig="c12p-dual-emission"><figcaption>Choose the method and watch one electron (orange ring) leave the metal. Whatever the method, it must gain at least the work function φ₀.</figcaption></figure>

## 2. The photoelectric effect

In 1887 Heinrich Hertz noticed that a spark jumps more easily between two metal balls when ultraviolet light falls on them. Hallwachs and Lenard studied this soon afterwards. The explanation: light of high enough frequency knocks electrons out of the metal. These are called **photoelectrons**, and the effect is called **photoelectric emission**.

**Everyday uses.** Automatic doors and burglar alarms (a beam falls on a photocell; when you break the beam, the current stops), solar panels, the sound track of old films, and light meters in cameras all work on this effect.

### 2.1 The experiment

A glass tube with no air has two metal plates: the **emitter** (cathode) where light falls, and a **collector** (anode). A battery and a variable voltage source (with a reversing key) put a voltage V on the collector, and a micro-ammeter measures the **photocurrent**. Light of known frequency ν and intensity falls on the emitter through a quartz window.

Try it. Pick a metal, a frequency, a brightness and a collector voltage. At negative voltages the collector repels the electrons, and only the energetic ones reach it.

<figure class="fig" data-fig="c12p-dual-lab"><figcaption>A photocell. The graph shows photocurrent against collector voltage. Move ν below the threshold and the current vanishes whatever the brightness. Above it: more brightness lifts the whole curve (more electrons), but the cut-off voltage −V₀ does not move. Raise the frequency and −V₀ moves left.</figcaption></figure>

<!--fig:tool photoelectric-lab-->

### 2.2 What the experiment shows

1. **Photocurrent and intensity.** For light of a fixed frequency (above the threshold), the photocurrent is **proportional to the intensity**: more light, more electrons per second. When the collector is made positive enough, the current reaches a **saturation value**, because all the emitted electrons are collected.
2. **Stopping potential and intensity.** As you make the collector negative, the current falls. At a certain negative voltage, −V₀, it becomes zero: no electron, not even the fastest, can reach the collector. V₀ is the **stopping potential**. It does **not depend on the intensity** of the light. So the maximum kinetic energy of the photoelectrons is `$K_{max} = eV_0$` and it does not depend on intensity.
3. **Stopping potential and frequency.** V₀ rises as the frequency rises: for a given metal, `$K_{max}$` increases linearly with ν. For each metal there is a **threshold frequency** ν₀ below which there is **no emission at all**, however intense the light is, or however long we wait.
4. **No time lag.** The emission starts at once, within about 10⁻⁹ s of the light being switched on, even for extremely dim light.

<div class="meaning">
<dl>
<dt>φ₀</dt><dd>work function: the least energy to remove an electron from the metal (eV)</dd>
<dt>ν₀</dt><dd>threshold frequency: the lowest frequency that can cause emission; ν₀ = φ₀/h</dd>
<dt>V₀</dt><dd>stopping potential: the retarding voltage that just stops the fastest photoelectrons</dd>
<dt>K_max</dt><dd>maximum kinetic energy of the photoelectrons = eV₀</dd>
<dt>Physical meaning</dt><dd>Brightness decides how <i>many</i> electrons come out; colour (frequency) decides how <i>energetic</i> each one is. This is the opposite of what the wave theory of light expects.</dd>
</dl>
</div>

<div class="myth">

**“Brighter light gives faster photoelectrons.”** No. Brighter light gives <i>more</i> photoelectrons, not faster ones. The speed depends on the frequency of the light. A faint ultraviolet torch can knock out faster electrons than a blazing red floodlight, which knocks out none at all.

</div>

## 3. Why the wave theory could not explain it

In the wave picture, the energy of light is spread smoothly over the whole wavefront. A bright light has a large amplitude and a strong electric field, so one expects that:

- the electrons should be thrown out with a larger energy when the light is more intense (but experiments show V₀ does not depend on intensity);
- light of <i>any</i> frequency should work if it is bright enough or if we wait long enough (but there is a sharp threshold ν₀);
- very dim light should need a long time before an electron collects enough energy (a time lag of seconds or minutes) (but emission is instantaneous).

Compare the two theories in the figure. In the wave picture the electron must soak up energy slowly; in the photon picture a single photon delivers all the energy at once.

<figure class="fig" data-fig="c12p-dual-timelag"><figcaption>Energy in one electron. Wave theory (left button): the bar fills slowly, more slowly for dim light, and eventually at any frequency. Photon theory: one photon of energy hν pays at once if hν is at least φ₀, and never otherwise. The experiments agree with the photon theory.</figcaption></figure>

## 4. Einstein’s photoelectric equation

In 1905 Albert Einstein used an idea of Max Planck’s from 1900. Planck had found that the radiation from a hot body behaves as if its energy came in small packets. Einstein proposed that light itself travels as a stream of packets of energy, called **light quanta** (now **photons**). A photon of frequency ν has energy

```math
E = h\nu
```

where h is **Planck’s constant**, 6.63 × 10⁻³⁴ J s. In the photoelectric effect one photon is absorbed by one electron, and gives it all its energy. This is an “all or nothing” event.

The electron uses part of this energy, φ₀, to get out of the metal. The rest becomes its kinetic energy:

<div class="steps" data-fig="c12p-dual-einstein">
<div class="step">A single photon of energy hν (here 4.1 eV, ultraviolet) is absorbed by a single electron near the surface of the metal. The photon is completely absorbed: it gives all of hν to the electron.</div>
<div class="step">The electron has to pay the work function φ₀ (here 2.3 eV for sodium) to escape from the metal.</div>
<div class="step">What is left is the kinetic energy of the electron outside. This is the <b>maximum</b> kinetic energy (K_max), the value for electrons right at the surface. Electrons from deeper inside lose some energy on the way and come out slower. So hν = φ₀ + K_max, i.e. K_max = hν − φ₀ = 1.8 eV.</div>
<div class="step">The stopping potential V₀ is exactly the voltage that removes this kinetic energy: eV₀ = K_max. So eV₀ = hν − φ₀. (Here 1.8 V.)</div>
<div class="step">Divide by e: V₀ = (h/e)ν − φ₀/e. This is the equation of a straight line in the plane of V₀ against ν. The slope is h/e, which is the same for every metal. The intercept on the V₀ axis is −φ₀/e.</div>
<div class="step">At the threshold K_max is zero: hν₀ = φ₀, so ν₀ = φ₀/h. Below ν₀, a photon is too small to free any electron, however many photons arrive.</div>
</div>

```math
K_{max} = h\nu - \varphi_0 = h(\nu - \nu_0), \qquad eV_0 = h\nu - \varphi_0
```

**Everything now fits:**

1. Light of greater intensity means more photons per second, so more electrons per second: the saturation current is proportional to intensity.
2. Each photon has energy hν no matter how bright the light is, so K_max and V₀ depend only on ν.
3. If hν &lt; φ₀ no photon can free an electron: the threshold ν₀ = φ₀/h.
4. An electron takes all the energy from one photon at once: no time lag.

<div class="myth">

**“Two weak photons can add up to free an electron.”** In ordinary light the chance that one electron absorbs two photons at the same instant is vanishingly small. Each electron gets its energy from one photon, so red light, however bright, cannot free an electron from a metal whose ν₀ is in the ultraviolet.

</div>

**Millikan’s test.** Robert Millikan, who had expected Einstein to be wrong, spent ten years measuring V₀ against ν for several metals (1916). He found straight lines, all with the same slope, exactly as predicted. From the slope he got h = 6.57 × 10⁻³⁴ J s, within 1 % of today’s value. Move the frequency and compare metals:

<figure class="fig" data-fig="c12p-dual-graph"><figcaption>V₀ against ν for sodium, zinc and copper: parallel lines. Each crosses the frequency axis at its own threshold ν₀ = φ₀/h and the V₀ axis at −φ₀/e. The common slope is h/e, which gives Planck’s constant.</figcaption></figure>

**Reading h and φ₀ from a graph.** In a school lab you would measure V₀ for several frequencies and plot them. Here is how to get Planck’s constant and the work function from your points:

<div class="steps" data-fig="c12p-dual-millikan">
<div class="step">Shine light of five known frequencies on a metal and find the stopping potential for each: V₀ = 0.21, 0.58, 1.03, 1.40 and 1.87 V for ν = 6, 7, 8, 9 and 10 × 10¹⁴ Hz.</div>
<div class="step">Plot V₀ (up) against ν (across). The points lie close to a straight line, as Einstein’s equation V₀ = (h/e)ν − φ₀/e predicts. The small scatter is measurement error.</div>
<div class="step">Draw the best straight line through the points. Do not join the dots: the line should have about as many points above as below.</div>
<div class="step">Pick two far-apart points on the line and find the slope: (1.66 V) ÷ (4 × 10¹⁴ Hz) = 4.14 × 10⁻¹⁵ V s. This is h/e.</div>
<div class="step">Multiply by the charge of the electron: h = e × slope = 1.6 × 10⁻¹⁹ × 4.14 × 10⁻¹⁵ = 6.6 × 10⁻³⁴ J s.</div>
<div class="step">Extend the line until V₀ = 0: it meets the frequency axis at the threshold ν₀ = 5.6 × 10¹⁴ Hz. The work function is φ₀ = hν₀ = 4.14 × 10⁻¹⁵ × 5.6 × 10¹⁴ = 2.3 eV.</div>
</div>

<div class="problem" data-problem="c12p-dual-kmax"></div>

<div class="problem" data-problem="c12p-dual-stop"></div>

<div class="problem" data-problem="c12p-dual-threshold"></div>

## 5. The particle nature of light: the photon

Einstein’s idea was only the beginning. The properties of a photon:

- It is a packet of energy `$E = h\nu = hc/\lambda$`. A handy form: `$E\,(\text{eV}) = 1240/\lambda\,(\text{nm})$`.
- It moves at the speed of light c, has **zero rest mass**, and carries momentum `$p = E/c = h/\lambda$`.
- It has no charge and is not deflected by electric or magnetic fields.
- In a collision with an electron, energy and momentum are conserved, as for any particle (this is the Compton effect, which shows that light has momentum).
- The photon energy depends on the frequency alone, not on the intensity. The **intensity** is the number of photons crossing unit area in unit time, times the photon energy.

A 60 W bulb sending out light of about 550 nm gives off about 10¹⁹ photons of visible light every second. So many that light looks like a smooth flow, like the grains of sand on a beach look like a smooth surface from far away.

<figure class="fig" data-fig="c12p-dual-photon"><figcaption>Photons of the chosen colour. The energy of each is hc/λ and the number per second is the power divided by that energy. Even a one-microwatt beam carries trillions of photons per second.</figcaption></figure>

<div class="problem" data-problem="c12p-dual-photons"></div>

## 6. The wave nature of matter: de Broglie’s idea

If light, a wave, can behave as particles, then maybe particles can behave as waves. In 1924 Louis de Broglie, a young French prince studying physics, proposed exactly this. Nature likes symmetry. For a photon p = h/λ; he suggested that for any particle of momentum p there is a wave with wavelength

```math
\lambda = \frac{h}{p} = \frac{h}{mv}
```

<div class="meaning">
<dl>
<dt>λ</dt><dd>de Broglie wavelength of the particle</dd>
<dt>h</dt><dd>Planck’s constant, 6.63 × 10⁻³⁴ J s</dd>
<dt>p = mv</dt><dd>momentum of the particle</dd>
<dt>Physical meaning</dt><dd>A moving particle has a wave aspect. The bigger the momentum, the shorter the wavelength. Because h is so tiny, the wavelength is noticeable only for very light particles such as electrons.</dd>
</dl>
</div>

If we know the kinetic energy K, `$p = \sqrt{2mK}$` and so `$\lambda = h/\sqrt{2mK}$`.

How big are these wavelengths? Slide through different objects:

<figure class="fig" data-fig="c12p-dual-debroglie"><figcaption>The de Broglie wavelength on a ruler of powers of ten. An electron at 10⁶ m/s has λ ≈ 0.7 nm, bigger than an atom. A cricket ball has λ ≈ 10⁻³⁴ m: undetectably small, so balls never show wave behaviour.</figcaption></figure>

**An electron accelerated through a potential difference V.** This is the most common exam case. Watch the algebra:

<div class="steps" data-fig="c12p-dual-accel">
<div class="step">An electron (charge e, mass m) starts from rest and is accelerated through a potential difference V.</div>
<div class="step">The work done by the field, eV, becomes its kinetic energy: eV = ½mv².</div>
<div class="step">Solve for the momentum: p = mv = √(2meV).</div>
<div class="step">Put this into de Broglie’s formula: λ = h/p = h/√(2meV).</div>
<div class="step">Put in the numbers h = 6.63×10⁻³⁴ J s, m = 9.11×10⁻³¹ kg, e = 1.6×10⁻¹⁹ C: λ = 1.227/√V nm, with V in volts. (Or 12.27/√V in ångström.)</div>
<div class="step">For V = 150 V the wavelength is 1.227/12.25 = 0.100 nm: about the spacing between atoms in a crystal. That is why a crystal can diffract electrons.</div>
</div>

```math
\lambda = \frac{h}{\sqrt{2meV}} = \frac{1.227}{\sqrt{V}}\ \text{nm}
```

<div class="problem" data-problem="c12p-dual-electron"></div>

<div class="problem" data-problem="c12p-dual-ball"></div>

## 7. Evidence for matter waves: the Davisson–Germer experiment

If electrons really are waves they should diffract from the atoms of a crystal, just as X-rays do. In 1927 Clinton Davisson and Lester Germer at Bell Labs fired a beam of electrons at a nickel crystal and measured the number scattered at different angles. By accident they had made the surface of the nickel crystal very regular by heating it.

They found that the number of scattered electrons was not smooth: it had a strong **peak** at a particular angle, and the peak was largest at 54 V, at about 50° (the angle φ is measured from the normal to the crystal face). The Bragg-style condition for the rows of atoms (spacing d = 0.215 nm) is `$d\sin\varphi = \lambda$`. For 54 V the de Broglie wavelength is 1.227/√54 = 0.167 nm, which gives sin φ = 0.78, φ ≈ 51°: it matched. Independently, G. P. Thomson in Scotland found ring-shaped diffraction patterns by sending electrons through thin metal foil. Davisson and Thomson shared the 1937 Nobel Prize for this.

<figure class="fig" data-fig="c12p-dual-dg"><figcaption>Change the accelerating voltage and the peak moves to the angle predicted by d sin φ = λ. At 54 V the peak sits at about 51°, close to what Davisson and Germer measured.</figcaption></figure>

The same thing happens with electrons passing one at a time through two slits: each lands as a single dot, like a particle, but after thousands of electrons the dots build up a Young’s fringe pattern, like a wave.

<figure class="fig" data-fig="@qm-double-slit"><figcaption>Electrons arriving one at a time through two slits build up an interference pattern. Change the slit gap and the wavelength and compare with the fringe width λD/d of Chapter 10.</figcaption></figure>

**What does the wave mean?** The wave associated with a particle is not a physical ripple. Its strength at a place tells the <i>chance</i> of finding the particle there: strong where fringes are bright, zero where they are dark. A single electron seems to go through both slits “as a wave” but is always found “as a particle”. This is called **wave-particle duality**. It is not that electrons switch between being waves and particles: they are something new that shows one face or the other, depending on the experiment.

<div class="myth">

**“A photon is a tiny ball and a wave is a ripple, and light is sometimes one and sometimes the other.”** The better statement: light is neither of the everyday things. In an interference experiment it shows wave behaviour (fringes); in a photoelectric experiment it shows particle behaviour (single, all-or-nothing absorptions). Both pictures are needed, but we never see both aspects in one experiment.

</div>

<div class="history">

**Beyond the syllabus (not examined in Class 12 boards).** In the Compton effect (1923) X-ray photons scatter from free electrons and lose energy: the wavelength shifts by `$\Delta\lambda = \frac{h}{mc}(1-\cos\theta)$`, which proves that photons have momentum. The Heisenberg uncertainty principle, `$\Delta x\,\Delta p \ge \hbar/2$`, says we cannot know a particle’s position and momentum exactly at the same time. Check your board’s syllabus before spending time on them.

</div>

<div class="history">

<ul class="timeline">
<li><b>1887</b> Hertz sees that ultraviolet light helps a spark jump; Hallwachs and Lenard study the photoelectric effect.</li>
<li><b>1900</b> Max Planck explains the spectrum of hot bodies with energy packets of size hν.</li>
<li><b>1905</b> Einstein explains the photoelectric effect with light quanta.</li>
<li><b>1916</b> Millikan confirms the equation and measures h.</li>
<li><b>1924</b> De Broglie proposes matter waves.</li>
<li><b>1927</b> Davisson and Germer, and G. P. Thomson, diffract electrons from crystals.</li>
</ul>

</div>

<div class="keypoints">

- Work function φ₀ is the least energy to free an electron from a metal (a few eV; 1 eV = 1.6 × 10⁻¹⁹ J). Emission can be thermionic, by a strong field, or photoelectric.
- Photoelectric effect: current is proportional to intensity; V₀ and K_max depend on frequency only; there is a threshold ν₀; there is no time lag.
- The wave theory fails on three counts: intensity-dependent energy, no threshold, a time lag. Photon theory explains all.
- Photon: E = hν = hc/λ = 1240/λ(nm) eV; p = h/λ; zero rest mass; intensity is the number of photons per second per area.
- Einstein: hν = φ₀ + K_max, K_max = eV₀. V₀ against ν is a straight line with slope h/e; intercepts ν₀ = φ₀/h and −φ₀/e.
- de Broglie: λ = h/p = h/mv = h/√(2mK). For an electron through V volts, λ = 1.227/√V nm.
- Davisson–Germer: electrons diffract from a nickel crystal, confirming matter waves (d sin φ = λ). Wave-particle duality applies to light and to matter.

</div>

Going further for JEE/NEET: Compton scattering, the uncertainty principle and harder photocell problems are in [Dual nature of radiation and matter (JEE)](/learn/courses/engineering-entrance/dual-nature/), with extra questions in [its question set](/learn/courses/engineering-entrance/dual-nature-questions/).
