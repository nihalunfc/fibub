---
title: 'Photons: the photoelectric and Compton effects'
seoTitle: Photoelectric and Compton effects for IIT JAM Physics
summary: 'Why light comes in lumps of energy hν and momentum h/λ, how the photoelectric effect and Compton scattering prove it, and how to solve every standard question on stopping potential, work function, photon counting, radiation pressure and the Compton shift.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: 'Light above the threshold frequency falls on a metal. Its intensity is doubled at the same frequency. What happens to the stopping potential?'
    choices: ['It stays the same', 'It doubles', 'It halves', 'It rises by a factor √2']
    ans: 0
    why: 'The stopping potential measures the energy of the fastest electron, hν − φ, which depends only on the frequency. Brighter light frees more electrons per second (a bigger current), each with the same maximum energy.'
  - q: 'X-rays are Compton-scattered by free electrons. At which scattering angle is the wavelength shift largest?'
    choices: ['180°, straight back', '90°', '45°', '0°, straight on']
    ans: 0
    why: 'Δλ = (h/mc)(1 − cos θ). The factor 1 − cos θ is largest, 2, at θ = 180°, giving a shift of twice the Compton wavelength, about 4.85 pm.'
  - q: 'A graph of stopping potential against frequency is drawn for two different metals. How do the two lines compare?'
    choices: ['Parallel, with slope h/e, but cutting the frequency axis at different thresholds', 'Same intercept, different slopes', 'They cross at the origin', 'They coincide, because the slope is universal']
    ans: 0
    why: 'eV₀ = hν − φ, so every metal gives slope h/e. The work function only shifts the line sideways: the threshold frequency φ/h is where it meets the axis.'
sources:
  - 'A. Beiser, Concepts of Modern Physics, 6th ed. (2003), chapter 2: particle properties of waves'
  - 'K. S. Krane, Modern Physics, 3rd ed. (2012), chapter 3: the particle-like properties of electromagnetic radiation'
  - 'R. Eisberg and R. Resnick, Quantum Physics of Atoms, Molecules, Solids, Nuclei and Particles, 2nd ed. (1985), chapter 2'
  - 'IIT JAM Physics syllabus (Modern Physics section), published by the organising IIT each year'
---

**Module 6 · about 40 minutes.** By the end you will be able to explain why the wave picture of light fails in the photoelectric effect, use Einstein's equation in eV without unit slips, read a stopping-potential graph, count photons, work out radiation pressure, and solve Compton problems in wavelength or energy form, including the recoil electron.

<div class="bigidea">Light delivers its energy in indivisible packets. Each photon of frequency ν carries energy hν and momentum h/λ, and it gives them to one electron at a time.</div>

## 1. What you already know, and the one new idea

From optics you know light is a wave: it interferes and diffracts. From the blackbody lesson (5.6) you met Planck's idea that the walls of an oven exchange energy with light only in steps of `$h\nu$`. Einstein (1905) went one step further: the light itself is made of quanta, now called **photons**:

```math
E = h\nu = \frac{hc}{\lambda}, \qquad p = \frac{E}{c} = \frac{h}{\lambda}
```

Here `$h = 6.626\times10^{-34}$` J s is Planck's constant. For quick work in exams, remember one number:

```math
hc \approx 1240\ \text{eV nm}
```

so a photon of wavelength `$\lambda$` in nanometres has energy `$1240/\lambda$` electronvolts. Green light at 500 nm: 2.48 eV. X-rays at 0.1 nm: 12.4 keV.

<div class="meaning">

<dl>
<dt>E = hν</dt><dd>the energy of one photon; higher frequency (bluer) light has more energetic photons</dd>
<dt>p = h/λ</dt><dd>the momentum of one photon; light pushes on what it hits</dd>
<dt>1 eV</dt><dd>1.602 × 10⁻¹⁹ J, the energy an electron gains crossing 1 volt</dd>
<dt>Intensity</dt><dd>energy per second per area = (photons per second per area) × hν. Brightness counts photons; colour sets the energy of each.</dd>
</dl>

</div>

**Worked example.** A 5.0 mW green laser (532 nm) shines for one second. How many photons leave it?

1. Energy of one photon: `$1240/532 = 2.33$` eV `$= 2.33\times1.602\times10^{-19} = 3.73\times10^{-19}$` J.
2. Energy per second: `$5.0\times10^{-3}$` J.
3. Photons per second: `$5.0\times10^{-3}/3.73\times10^{-19} = 1.34\times10^{16}$`. Light is lumpy, but the lumps are tiny and very many.

## 2. The photoelectric effect

Shine ultraviolet light on a clean metal plate in a vacuum tube, and electrons fly out. Put a second plate (the collector) opposite and measure the current while you vary the voltage between them. Four facts come out of such experiments, and the wave theory of light cannot explain any of the first three:

1. **Threshold.** Below a certain frequency `$\nu_0$`, no electrons come out, however bright the light.
2. **Energy depends on frequency, not brightness.** The fastest electrons have a kinetic energy that rises in a straight line with `$\nu$`, and does not change with intensity.
3. **No delay.** Electrons appear within about a nanosecond, even in very dim light.
4. **Current follows intensity.** Twice the brightness (at the same frequency) gives twice the current.

Einstein's explanation is one line of energy bookkeeping. A photon gives all its energy to one electron. The electron must spend at least the **work function** `$\phi$` (the energy that binds it to the metal) to get out:

```math
K_{\max} = h\nu - \phi = eV_0
```

The stopping potential `$V_0$` is the retarding voltage that just stops the fastest electrons. Threshold: `$h\nu_0 = \phi$`, or `$\lambda_0 = hc/\phi$`.

<figure class="fig" data-fig="photoelectric-line"><figcaption>Stopping potential against frequency for three metals. Every line has the same slope, h/e; the work function only moves the line sideways. Below its threshold a metal emits nothing at all.</figcaption></figure>

Try it: pick zinc and slide the frequency down past `$10.4\times10^{14}$` Hz. The readout says "no electrons", even though caesium, with its smaller work function, still emits. Millikan used exactly this straight line (1916) to measure `$h$`, trying hard to prove Einstein wrong and finding him right.

**Worked example.** Light of 300 nm falls on sodium (`$\phi = 2.3$` eV). Find the stopping potential and the threshold wavelength.

1. Photon energy `$1240/300 = 4.13$` eV.
2. `$K_{\max} = 4.13 - 2.3 = 1.83$` eV, so `$V_0 = 1.83$` V. (An electron with 1.83 eV of kinetic energy is stopped by 1.83 V: no conversion needed.)
3. `$\lambda_0 = 1240/2.3 = 539$` nm: sodium responds to green light and anything bluer.

<div class="problem" data-problem="stopping-potential"></div>

### Reading photocurrent graphs

JAM likes to describe graphs of photocurrent `$I$` against collector voltage `$V$` in words. The curve levels off (saturates) at large positive `$V$`, when every freed electron is collected, and falls to zero at `$V = -V_0$`.

| What changed | Saturation current | Stopping potential |
|---|---|---|
| Intensity up, same frequency | up (more photons) | same |
| Frequency up, same photon rate | same | up (more energy per photon) |
| Frequency up, same intensity (power) | down (fewer photons) | up |
| Metal with larger `$\phi$`, same light | same or less | down |

The third row is the classic trap: at fixed power, bluer photons each carry more energy, so there are fewer of them.

### Using two readings

If you know the stopping potential at two frequencies, subtract the two Einstein equations and the work function cancels:

```math
e(V_1 - V_2) = h(\nu_1 - \nu_2)
```

That is how `$h$` is measured, and it is also the quick way to answer "by how much does the stopping potential change" questions. The [Photoelectric lab](/learn/photoelectric-lab/) lets you take such readings on caesium, sodium and zinc and fit the line yourself.

## 3. Photons push: momentum and radiation pressure

A photon has no rest mass but carries momentum `$p = h/\lambda = E/c$`. A beam of intensity `$I$` falling on a surface delivers momentum `$I/c$` per second per square metre if absorbed, and `$2I/c$` if reflected straight back (the photon's momentum reverses). So the radiation pressure is

```math
P_{\text{abs}} = \frac{I}{c}, \qquad P_{\text{mirror}} = \frac{2I}{c}
```

Sunlight (about 1.36 kW/m² above the atmosphere) presses on a mirror with only about 9 μPa, yet that is enough to steer solar sails and to shape comet tails.

**Worked example.** A 2.0 W laser beam is fully absorbed by a small black disc. What force acts on it? `$F = P/c = 2.0/(3\times10^8) = 6.7\times10^{-9}$` N. Reflected, it would be twice that.

## 4. Compton scattering: photons collide like billiard balls

In 1923 Compton sent X-rays of a single wavelength into graphite and looked at what came out at an angle `$\theta$`. Besides X-rays of the original wavelength, he found a second peak at a **longer** wavelength, shifted more at larger angles. A classical wave would make the electrons vibrate at its own frequency and re-radiate at that same frequency: no shift.

Treat the X-ray as a particle of energy `$hc/\lambda$` and momentum `$h/\lambda$` hitting a free electron at rest, and use relativistic energy and momentum conservation:

<div class="steps">
<div class="step"><p><b>Momentum.</b> The electron's momentum is the difference of the photon's: <b>p</b><sub>e</sub> = <b>p</b> − <b>p</b>′. Square it: p<sub>e</sub>² = p² + p′² − 2pp′ cos θ.</p></div>
<div class="step"><p><b>Energy.</b> pc + mc² = p′c + E<sub>e</sub>, so E<sub>e</sub> = (p − p′)c + mc².</p></div>
<div class="step"><p><b>Relativity links them.</b> E<sub>e</sub>² = p<sub>e</sub>²c² + m²c⁴. Square the energy line and put in p<sub>e</sub>² from the momentum line.</p></div>
<div class="step"><p><b>Simplify.</b> The p² and p′² terms cancel, leaving mc(p − p′) = pp′(1 − cos θ).</p></div>
<div class="step"><p><b>Turn into wavelengths.</b> Divide by mc·pp′ and use p = h/λ: 1/p′ − 1/p = (1 − cos θ)/(mc), that is λ′ − λ = (h/mc)(1 − cos θ).</p></div>
</div>

```math
\Delta\lambda = \lambda' - \lambda = \frac{h}{m_ec}(1 - \cos\theta), \qquad \frac{h}{m_ec} = 2.426\ \text{pm}
```

The quantity `$h/m_ec$` is the **Compton wavelength** of the electron. Three things to notice:

- The shift does **not** depend on `$\lambda$`. It is at most `$2h/m_ec = 4.85$` pm (at 180°). That is a big fraction of an X-ray wavelength but a hopelessly small fraction of a visible one, which is why you need X-rays or gamma rays to see it.
- The unshifted peak comes from electrons bound tightly to the atom: then the whole atom recoils, its mass is thousands of times bigger, and its "Compton wavelength" is negligible.
- In energy form (best for gamma rays), with `$\alpha = E/m_ec^2$`:

```math
E' = \frac{E}{1 + \alpha(1 - \cos\theta)}, \qquad K_e = E - E'
```

<figure class="fig" data-fig="compton-shift"><figcaption>Top: the wavelength shift, the same curve for every photon. Bottom: how the energy is shared between the scattered photon and the recoil electron. Slide the photon energy up to a few MeV and watch the photon lose most of its energy at large angles.</figcaption></figure>

**Worked example.** A 662 keV gamma photon (from caesium-137) is scattered at 180° in a detector. Find the energy of the scattered photon and of the electron.

1. `$\alpha = 662/511 = 1.296$`.
2. `$E' = 662/(1 + 1.296\times2) = 662/3.591 = 184$` keV.
3. The electron gets `$662 - 184 = 478$` keV. This is the most a Compton electron can get from these photons: the **Compton edge** seen in gamma-ray spectra, always below the full-energy peak.

The electron always moves forward, at an angle `$\varphi$` with `$\cot\varphi = (1 + \alpha)\tan(\theta/2)$`: when the photon goes straight back, the electron goes straight ahead.

<div class="problem" data-problem="compton-scatter"></div>

<div class="myth">

**"Brighter light gives faster photoelectrons."** It does not. Brightness is the number of photons; each photon still delivers the same `$h\nu$` to one electron. A dim violet lamp ejects electrons from potassium; a floodlight of red light does not, however long you wait.

**"A free electron can swallow a photon."** It cannot. If it did, energy and momentum could not both be conserved (try it: you get `$2E_\gamma m c^2 = 0$`). That is why the photoelectric effect needs electrons bound in a metal, where the lattice takes up the extra momentum, and why free electrons only *scatter* photons (Compton).

</div>

## 5. Wave or particle?

Neither picture alone is complete. Light spreading through two slits makes fringes (wave); but with a very dim source the fringes build up one dot at a time on a detector (particle). The rule is: light *travels* like a wave and is *detected* like a particle, in lumps of `$h\nu$`. The next lesson turns this round: electrons, which we think of as particles, travel like waves too. To see where photons sit across the whole spectrum, from radio to gamma rays, try the [EM spectrum explorer](/learn/em-spectrum/); for the X-ray side and the atomic origin of spectral lines, see [lesson 6.4](/learn/courses/iit-jam-physics/atoms-x-rays/).

<div class="keypoints">

- A photon has `$E = h\nu = hc/\lambda$` and `$p = h/\lambda$`; use `$hc = 1240$` eV nm.
- Photoelectric effect: `$K_{\max} = h\nu - \phi = eV_0$`; threshold `$\nu_0 = \phi/h$`, `$\lambda_0 = hc/\phi$`. Intensity sets the current, frequency sets the energy.
- `$V_0$` against `$\nu$` is a straight line of slope `$h/e$` for every metal; the work function cancels when you subtract two readings.
- Radiation pressure: `$I/c$` absorbed, `$2I/c$` reflected. Photon rate = power ÷ `$h\nu$`.
- Compton: `$\Delta\lambda = (h/m_ec)(1 - \cos\theta)$`, at most `$4.85$` pm, independent of `$\lambda$`. In energy form `$1/E' = 1/E + (1 - \cos\theta)/m_ec^2$`; the electron gets the most at `$180^\circ$`.
- A free electron cannot absorb a photon; bound electrons give the photoelectric effect and the unshifted Compton line.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. There are more on the [photons practice page](/learn/courses/iit-jam-physics/practice/photons/).

<div class="qbank" data-bank="physics" data-topics="photons" data-exam="jam" data-n="10"></div>

**Next:** [lesson 6.2](/learn/courses/iit-jam-physics/matter-waves/) gives particles a wavelength `$h/p$` and meets the uncertainty principle. The GATE Physics course builds [the full quantum theory](/learn/courses/gate-physics/postulates-operators/) of light and matter from here, and treats Compton scattering with [four-vectors](/learn/courses/gate-physics/relativistic-kinematics/).
