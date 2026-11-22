---
title: 'Physics: dual nature of radiation and matter'
seoTitle: 'Photoelectric effect and de Broglie waves for CUET Physics'
summary: 'Why light behaves like particles in the photoelectric effect, Einstein''s equation, stopping potential and threshold frequency, and de Broglie''s matter waves, with a live photoelectric problem.'
minutes: 16
updated: 2026-11-22
quiz:
  - q: 'Raising the intensity of light (above threshold) in the photoelectric effect increases:'
    choices: ['the number of electrons emitted per second', 'the maximum kinetic energy', 'the threshold frequency']
    ans: 0
    why: 'More photons per second free more electrons, but each photon still has energy hf, so the maximum kinetic energy is unchanged.'
  - q: 'The stopping potential depends on:'
    choices: ['the frequency of the light and the metal', 'the intensity only', 'the distance of the lamp']
    ans: 0
    why: 'eV₀ = hf − φ: only frequency and the work function matter.'
  - q: 'An electron and a proton have the same de Broglie wavelength. They have the same:'
    choices: ['momentum', 'speed', 'kinetic energy']
    ans: 0
    why: 'λ = h/p, so the same λ means the same momentum. The lighter electron must move faster.'
sources:
  - 'NCERT, Physics Part II (Class 12), Dual Nature of Radiation and Matter'
  - 'National Testing Agency, CUET (UG) Physics syllabus https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 6 · about 16 minutes.** By the end you will use Einstein's photoelectric equation and the de Broglie wavelength. Read first: [electromagnetic waves](/learn/courses/cuet/physics-em-waves/).

<div class="bigidea">Light arrives in packets (photons) of energy hf. One photon frees at most one electron, and only if hf beats the metal's grip. Matter also has a wave side: every moving particle has a wavelength h/p.</div>

**Everyday picture:** a coconut tree and a pile of small stones. A thousand tiny pebbles (many low-frequency photons) cannot knock a coconut down, however many you throw; one heavy stone thrown hard (a single high-frequency photon) can. What matters is the energy of each throw, not how many throws.

## 1. The photoelectric effect

```math
E = hf = \frac{hc}{\lambda} \qquad K_{\max} = hf - \phi = eV_0 \qquad f_0 = \frac{\phi}{h}
```

<div class="meaning">

<dl>
<dt>φ (work function)</dt><dd>the least energy needed to pull an electron out of the metal surface, a few eV (caesium ~2.1 eV, so it works with visible light).</dd>
<dt>V₀ (stopping potential)</dt><dd>the reverse voltage that just stops the fastest electrons: eV₀ = K_max.</dd>
<dt>hc ≈ 1240 eV nm</dt><dd>a shortcut: photon energy in eV = 1240 ÷ wavelength in nm. 620 nm red light is 2 eV.</dd>
</dl>

</div>

<div class="steps" data-title="What the wave picture could not explain">
<div class="step"><b>Threshold:</b> below a frequency f₀ no electrons come out, however bright the light. Waves would deliver energy eventually.</div>
<div class="step"><b>No delay:</b> emission starts instantly even in dim light. Waves would need time to build up energy.</div>
<div class="step"><b>K_max depends on frequency, not intensity.</b> Brighter light only gives more electrons.</div>
<div class="step"><b>Einstein:</b> each photon gives all its energy hf to one electron. All three facts follow. (Nobel Prize, 1921.)</div>
</div>

<div class="problem" data-problem="photoelectric"></div>

## 2. Matter waves

| Particle | de Broglie wavelength |
|---|---|
| Any particle | λ = h/p = h/(mv) |
| Kinetic energy K | λ = h/√(2mK) |
| Electron through V volts | λ ≈ 1.227/√V nm |

The Davisson-Germer experiment saw electrons diffract off a nickel crystal exactly as waves of this wavelength would. Electron microscopes use the tiny wavelength of fast electrons to see far finer detail than light allows.

<div class="myth">

**"Brighter light means faster photoelectrons."** Brightness sets how many photons arrive, so it sets the current. Each electron's maximum energy is set by the colour (frequency) alone.

</div>

## See it move

Play with these before you practise. Each one runs in your browser; move the sliders and press the buttons.

<figure class="fig" data-fig="@qm-photo-gun"><figcaption>A photocell: electrons leave a chosen metal with K = hf − φ; metal, colour, brightness and collector voltage, with the I-V graph; 5-step player.</figcaption></figure>

<figure class="fig" data-fig="@qm-double-slit"><figcaption>Electrons arriving one at a time through two slits build up the fringe pattern; change slit gap and wavelength, or watch which slit.</figcaption></figure>

## 3. Practice

<div class="qbank" data-bank="entrance-physics" data-topics="dual-nature" data-exam="cuet" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- Photon E = hf = 1240/λ(nm) eV.
- K_max = hf − φ = eV₀; threshold f₀ = φ/h.
- Intensity changes current, frequency changes K_max.
- de Broglie λ = h/p; electron λ ≈ 1.227/√V nm.

</div>
