---
title: Electromagnetic Waves
seoTitle: 'Electromagnetic Waves Class 12 notes: spectrum, displacement'
summary: 'Class 12 Electromagnetic Waves with animations: displacement current, Maxwell’s fix to Ampère’s law, how EM waves are made, E and B, intensity and the spectrum.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'In a plane electromagnetic wave travelling in vacuum, the amplitudes of E and B are related by:'
    choices: ['E₀ = cB₀', 'E₀ = B₀/c', 'E₀ = B₀', 'E₀ = c²B₀']
    ans: 0
    why: 'The ratio of the amplitudes is the speed of the wave: E₀/B₀ = c = 3 × 10⁸ m/s.'
  - q: 'Displacement current exists between the plates of a capacitor while it is charging because:'
    choices: ['charges cross the gap', 'the electric field between the plates is changing', 'the magnetic field is constant', 'the plates are heated']
    ans: 1
    why: 'I_d = ε₀ dΦ_E/dt. No charge crosses the gap, but the changing electric flux produces a magnetic field just as a conduction current would.'
  - q: 'Which of these has the shortest wavelength?'
    choices: ['microwaves', 'infrared', 'ultraviolet', 'radio waves']
    ans: 2
    why: 'The order of increasing wavelength is gamma, X-ray, ultraviolet, visible, infrared, microwave, radio. Of these four, ultraviolet is the shortest.'
sources:
  - 'NCERT Class 12 Physics, Chapter 8 “Electromagnetic Waves” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Constants: CODATA 2018 values of ε₀, μ₀, c and h (NIST); solar constant about 1361 W/m² from the TSIS-1 and SORCE satellite records'
  - 'Satellite altitude: ISRO public pages on INSAT/GSAT geostationary satellites (about 35,786 km above the equator)'
---

**Physics · Class 12 · Chapter 8 · about 45 minutes.** By the end you will be able to explain why Maxwell added a displacement current, describe an electromagnetic wave and how it is made, use `$c = 1/\sqrt{\mu_0\varepsilon_0}$`, `$E_0 = cB_0$` and intensity, and describe each part of the electromagnetic spectrum.

<div class="bigidea">A changing magnetic field makes an electric field (Faraday). Maxwell found that a changing electric field makes a magnetic field. Each keeps recreating the other, so the pair can travel through empty space on their own at the speed of light. Light, radio, X-rays: all the same kind of wave, differing only in frequency.</div>

## 1. Displacement current: the missing piece

Ampère's circuital law says that the magnetic field around a loop is set by the current through any surface bounded by the loop:

```math
\oint \vec B\cdot d\vec l = \mu_0 I
```

Now charge a capacitor from a battery. Draw a loop around the wire. Two surfaces have this loop as their edge: a flat disc that the wire cuts, and a bag-shaped surface that passes **between the plates**, where there is no wire. The first gives `$\mu_0 I$`; the second gives zero. The same loop cannot have two different answers.

<div class="steps" data-fig="c12p-emw-paradox">
<div class="step">Ampère's law: the line integral of B around the loop equals μ₀ times the current through any surface that has the loop as its edge.</div>
<div class="step">A flat disc: the wire cuts it, so a current I passes through. The law gives ∮B·dl = μ₀I.</div>
<div class="step">A bowl through the gap: no wire, no charge crosses the gap, so the law gives zero. Same loop, two answers: something is missing.</div>
<div class="step">Maxwell noticed that while the plates charge, the electric field between them grows. Its flux Φ<sub>E</sub> = EA = Q/ε₀, so ε₀ dΦ<sub>E</sub>/dt = dQ/dt = I. A changing electric flux behaves like a current: the displacement current.</div>
<div class="step">The corrected law: ∮B·dl = μ₀(I + I<sub>d</sub>), with I<sub>d</sub> = ε₀ dΦ<sub>E</sub>/dt. The flat disc has I, the bowl has I<sub>d</sub> = I. Both give μ₀I.</div>
</div>

```math
I_d = \varepsilon_0\frac{d\Phi_E}{dt}, \qquad \oint\vec B\cdot d\vec l = \mu_0\,(I + I_d)
```

<div class="meaning">
<dl>
<dt>I<sub>d</sub></dt><dd>displacement current, in amperes: not a flow of charge but a changing electric field</dd>
<dt>Φ<sub>E</sub></dt><dd>electric flux through the surface, E × A for a uniform field</dd>
<dt>ε₀</dt><dd>permittivity of free space, 8.85 × 10⁻¹² F/m</dd>
<dt>Physical meaning</dt><dd>A changing E acts as a source of B, in the same way that a current does. In the wire the current is carried by moving charges; in the gap by the changing field. The sum I + I<sub>d</sub> is continuous round the circuit.</dd>
</dl>
</div>

<figure class="fig" data-fig="c12p-emw-displacement"><figcaption>A capacitor charging and discharging. The red dots are the conduction current in the wires; between the plates the field E grows and falls. For any plate area the numbers match: ε₀A dE/dt equals the current in the wire.</figcaption></figure>

<div class="problem" data-problem="c12p-emw-displ"></div>

Maxwell's four equations, in words: (1) Gauss's law: electric charges are the source of E; (2) Gauss's law for magnetism: there are no magnetic monopoles; (3) Faraday's law: a changing B gives an E; (4) the Ampère–Maxwell law: currents **and** changing E give a B. These four describe all of classical electricity, magnetism and light.

<div class="myth">

**“Displacement current is a flow of charge across the gap.”** No charge crosses the gap. “Displacement current” is the name for ε₀ times the rate of change of electric flux. It is real in the sense that it produces a magnetic field exactly like a conduction current does.

</div>

See Ampère's loop and the field around a charging capacitor in this shared figure, or in the tool [Displacement current](/learn/displacement-current/):

<figure class="fig" data-fig="@em-displacement"><figcaption>Ampère's law with a flat and a bag-shaped surface, and B against the loop radius.</figcaption></figure>

## 2. Electromagnetic waves

Put the two laws together. A changing E makes a B; if that B is itself changing it makes a new E, and so on. The pair **sustains itself** and moves outwards. Maxwell worked out the speed of this wave from two constants measured in the lab, one electrical and one magnetic:

```math
c = \frac{1}{\sqrt{\mu_0\varepsilon_0}} = \frac{1}{\sqrt{(4\pi\times10^{-7})(8.85\times10^{-12})}} \approx 3\times10^{8}\ \text{m/s}
```

<div class="steps" data-fig="c12p-emw-speed">
<div class="step">Electricity gives ε₀ = 8.854 × 10⁻¹² F/m (from Coulomb's law). Magnetism gives μ₀ = 1.257 × 10⁻⁶ N/A² (from the force between currents).</div>
<div class="step">Multiply them: μ₀ε₀ = 1.113 × 10⁻¹⁷ s²/m².</div>
<div class="step">Take the reciprocal: 1/(μ₀ε₀) = 8.988 × 10¹⁶ m²/s².</div>
<div class="step">Take the square root: c = 2.998 × 10⁸ m/s.</div>
<div class="step">That is the speed of light measured by Fizeau in 1849. Maxwell concluded (1865) that light is an electromagnetic wave.</div>
</div>

<div class="problem" data-problem="c12p-emw-speed"></div>

**How fast is that?** The figure compares a radio signal with a jet, sound and a car over some real journeys:

<figure class="fig" data-fig="c12p-emw-race"><figcaption>Pick a journey. On a log scale all four fit on one picture. Light goes from Delhi to Chennai in about 7 ms but a jet takes nearly 2.5 hours.</figcaption></figure>

### Nature of the wave

For a wave travelling along `$x$` in vacuum, with the electric field along `$y$` and the magnetic field along `$z$`:

```math
E_y = E_0\sin(kx - \omega t), \qquad B_z = B_0\sin(kx - \omega t)
```

with `$\omega = 2\pi f$`, `$k = 2\pi/\lambda$` and `$c = \omega/k = f\lambda$`. The key properties:

- The wave is **transverse**: **E ⟂ B ⟂ direction of travel**, and the direction is that of **E × B**.
- E and B oscillate **in phase** and their amplitudes are related by `$E_0 / B_0 = c$`.
- It needs **no medium**: it travels through a vacuum (sunlight crosses space).
- The speed in vacuum is the same for all frequencies: `$c$`. In a material of permittivity `$\varepsilon$` and permeability `$\mu$` it is `$v = 1/\sqrt{\mu\varepsilon}$`, smaller than `$c$`.
- It is not deflected by electric or magnetic fields, since it carries no charge.

<figure class="fig" data-fig="c12p-emw-wave"><figcaption>Choose a real wave (FM, Wi-Fi, red light, X-rays) and see its wavelength, then switch E or B off. The two fields rise and fall together, at right angles.</figcaption></figure>

<figure class="fig" data-fig="@em-wave-3d"><figcaption>The same wave in 3D: drag to turn it, and switch to circular polarisation.</figcaption></figure>

<div class="problem" data-problem="c12p-emw-bfield"></div>

<div class="problem" data-problem="c12p-emw-wavelength"></div>

To see the travelling wave equation `$y = A\sin(kx - \omega t)$` for yourself, try [Travelling wave](/learn/travelling-wave/) after this section.

### How a wave is made

A charge at rest gives a steady field. A charge moving at steady velocity just carries its field along. Only **accelerated charges** radiate. When a charge is jerked, the news can only spread outward at the speed `$c$`, so a kink in the field lines travels out as a shell. A charge that oscillates (current oscillating in an antenna) sends out a train of kinks: an electromagnetic wave. The strength is greatest sideways to the antenna and zero along it.

<div class="steps" data-fig="c12p-emw-antenna">
<div class="step">A charge at rest: field lines point straight out. Nothing travels.</div>
<div class="step">A charge moving at steady velocity: the whole pattern moves with it. No acceleration, no wave.</div>
<div class="step">A sudden kick: inside the shell of radius ct the lines point at the charge's new position, outside they still point to where it was. The kink spreads at c and carries the sideways field of the radiation.</div>
<div class="step">A charge shaken up and down continuously: a train of kinks, ring after ring: the wave of a radio antenna, with E pointing alternately up and down and no wave along the rod.</div>
</div>

<figure class="fig" data-fig="@em-radiation-kink"><figcaption>The radiation kink in more detail: a time slider shows it moving out.</figcaption></figure>

### Energy, intensity and momentum

An EM wave carries energy: the energy density in E and B are equal, and the total is `$u = \varepsilon_0E^2$`. The **intensity** (energy per second per unit area) for a plane wave is

```math
I = \tfrac12\varepsilon_0 c E_0^2 = \frac{cB_0^2}{2\mu_0}
```

A source of power `$P$` spreads out over a sphere, so `$I = P/(4\pi r^2)$`: the intensity falls as `$1/r^2$`. The wave also carries **momentum**: the energy `$U$` it delivers brings momentum `$p = U/c$`, so a surface that absorbs it feels a **radiation pressure** `$I/c$` (and `$2I/c$` if it reflects perfectly). It is tiny: sunlight, 1361 W/m², pushes with only about 4.5 × 10⁻⁶ Pa, but over years it can steer a solar sail in space.

<figure class="fig" data-fig="c12p-emw-intensity"><figcaption>Pick a source and a distance. The curve is I ∝ 1/r². The readout gives the field strengths E₀ and B₀ and the radiation pressure at that point.</figcaption></figure>

<div class="problem" data-problem="c12p-emw-intensity"></div>

<div class="problem" data-problem="c12p-emw-pressure"></div>

## 3. The electromagnetic spectrum

The whole range of EM waves, from long radio waves to gamma rays, is the **electromagnetic spectrum**. They differ only in frequency and wavelength, so also in photon energy `$E = hf$`. In vacuum they all travel at `$c$`.

| Band | Wavelength (about) | Frequency (about) | Made by | Used for |
|---|---|---|---|---|
| Radio | &gt; 0.1 m | &lt; 3 GHz | charges accelerated in antenna wires | AM/FM radio, TV, mobile phones |
| Microwaves | 1 mm to 0.1 m | 3 GHz to 300 GHz | special tubes (magnetron, klystron) | radar, Wi-Fi, microwave ovens, satellites |
| Infrared | 700 nm to 1 mm | 300 GHz to 430 THz | hot bodies, vibrating molecules | remotes, night vision, heating, thermal cameras |
| Visible | 400 to 700 nm | 430 to 750 THz | atomic electrons, hot filaments | seeing, photography, fibre-optic links |
| Ultraviolet | 1 to 400 nm | 750 THz to 300 PHz | the Sun, special lamps, arcs | sterilising water, forged-note detection, vitamin D |
| X-rays | 0.01 to 10 nm | 30 PHz to 30 EHz | electrons hitting a metal target | medical imaging, airport baggage scans, crystal study |
| Gamma | &lt; 0.01 nm | &gt; 30 EHz | atomic nuclei, radioactive decay | cancer treatment, sterilising equipment |

<figure class="fig" data-fig="c12p-emw-spectrum"><figcaption>Slide through real examples on one log scale: AM radio, FM, mobile, Wi-Fi, a TV remote, red and violet light, a UV sterilizer, a dental X-ray, gamma rays. See the wavelength and the photon energy of each.</figcaption></figure>

<!--fig:tool em-spectrum-->

**Short notes for each band**

- **Radio waves** are produced by accelerated charges in conducting wires. AM uses 530 kHz to 1710 kHz; FM uses 88 to 108 MHz; mobile phones use about 0.8 to 3.5 GHz.
- **Microwaves** have short wavelengths, so they suit radar and satellite links. A **microwave oven** uses 2.45 GHz, a frequency that makes water molecules in food rotate and warm.
- **Infrared** is felt as heat. All warm bodies emit it, including you; a thermal camera reads it. Infrared waves are the main part of the greenhouse effect.
- **Visible light** (about 400 to 700 nm) is the narrow band our eyes detect.
- **Ultraviolet** is mostly absorbed by the ozone layer. Too much damages skin and eyes; it is used in water purifiers and to detect forged notes.
- **X-rays** pass through soft tissue but not bone. Always shielded with lead; unnecessary exposure is harmful.
- **Gamma rays** come from nuclei and are the most penetrating; they destroy cancer cells and sterilise surgical instruments.

<figure class="fig" data-fig="c12p-emw-atmosphere"><figcaption>What happens to each wave when it meets the atmosphere: reflected by the ionosphere, passed through to a satellite, or absorbed by water vapour, ozone or high-altitude gas.</figcaption></figure>

<div class="problem" data-problem="c12p-emw-photon"></div>

<div class="history">

<ul class="timeline">
<li><b>1820</b> Hans Christian Ørsted finds that a current makes a magnetic field.</li>
<li><b>1831</b> Michael Faraday shows that a changing magnetic field makes an electric field.</li>
<li><b>1865</b> James Clerk Maxwell adds the displacement current, predicts EM waves and says light is one.</li>
<li><b>1887</b> Heinrich Hertz makes and detects radio waves in the lab.</li>
<li><b>1895</b> Jagadish Chandra Bose, in Kolkata, demonstrates wireless signals using millimetre-wave radio, years before Marconi’s radio becomes famous.</li>
</ul>

</div>

> **Beyond the syllabus.** The **Poynting vector** `$\vec S = \vec E\times\vec B/\mu_0$` gives the direction and rate of flow of energy per unit area. Its magnitude averages to the intensity.

<div class="keypoints">

- Displacement current I<sub>d</sub> = ε₀ dΦ<sub>E</sub>/dt; Ampère–Maxwell law: ∮B·dl = μ₀(I + I<sub>d</sub>). It makes the total current continuous through a charging capacitor.
- Maxwell's equations: Gauss (E), Gauss for B (no monopoles), Faraday, Ampère–Maxwell.
- EM waves are transverse: E ⟂ B ⟂ direction of travel; E and B in phase; E₀/B₀ = c; they need no medium.
- c = 1/√(μ₀ε₀) = 3 × 10⁸ m/s = fλ in vacuum; in a medium v = 1/√(με).
- Only accelerated charges radiate. Intensity I = ½ε₀cE₀² = P/(4πr²); momentum p = U/c; radiation pressure I/c.
- Spectrum, long to short wavelength: radio, microwave, infrared, visible, ultraviolet, X-ray, gamma; photon energy E = hf rises as wavelength falls.

</div>

Going further for JEE/NEET: [Electromagnetic waves (engineering entrance)](/learn/courses/engineering-entrance/em-waves/) for exam-level problems on waves in media, energy density and the spectrum. For blackbody radiation see the [Blackbody calculator](/science/blackbody-calculator/).
