---
title: Waves
seoTitle: 'Waves Class 11 notes: standing waves, beats, Doppler'
summary: 'Class 11 Waves with animations: transverse and longitudinal waves, wave speed, superposition, reflection, standing waves, pipes, beats and the Doppler effect.'
minutes: 85
updated: 2026-11-23
quiz:
  - q: 'A wave has frequency 200 Hz and wavelength 1.7 m. Its speed is:'
    choices: ['117.6 m/s', '340 m/s', '34 m/s', '3400 m/s']
    ans: 1
    why: 'v = fλ = 200 × 1.7 = 340 m/s, the speed of sound in air.'
  - q: 'A pipe closed at one end has a fundamental frequency of 100 Hz. The next frequency it can sound is:'
    choices: ['200 Hz', '300 Hz', '150 Hz', '400 Hz']
    ans: 1
    why: 'A closed pipe has only odd harmonics: f, 3f, 5f, … so after 100 Hz comes 300 Hz.'
  - q: 'Two sources of 512 Hz and 516 Hz sound together. The beat frequency is:'
    choices: ['2 Hz', '4 Hz', '514 Hz', '1028 Hz']
    ans: 1
    why: 'Beat frequency = difference of frequencies = 516 − 512 = 4 beats per second.'
sources:
  - 'NCERT Class 11 Physics, Chapter 14 “Waves” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Speed of sound in air at 0 C (331.3 m/s): CRC Handbook of Chemistry and Physics, section “Speed of sound in various media”'
  - 'Laplace, P.-S. (1816), correction to Newton’s speed of sound, Annales de Chimie et de Physique 3 (history box)'
---

**Physics · Class 11 · Chapter 14 · about 85 minutes.** By the end you will be able to describe waves by their wavelength, frequency and speed, write the equation of a travelling wave, find the speed of waves on a string and in air, explain superposition, reflection, standing waves, resonance in strings and pipes, beats and the Doppler effect.

<div class="bigidea">A wave is a disturbance that carries energy from one place to another without carrying matter. The audience’s “Mexican wave” in a stadium travels all round the ground, but each person only stands up and sits down. Everything about waves comes from this: the pattern moves at a speed v set by the medium, repeats with a wavelength λ and a frequency f, and when two waves meet they simply add.</div>

## 1. Transverse and longitudinal waves

Shake the end of a long rope up and down and a bump runs along it. Each bit of the rope goes up and down while the bump travels along: a **transverse wave**, where the particles move perpendicular to the direction of travel. Waves on a string and light are transverse. They need a medium that resists shearing (a string, or a solid), so they do not travel through the inside of a liquid or gas.

Push and pull the end of a slinky along its length: bunches (compressions) and gaps (rarefactions) run along it. This is a **longitudinal wave**: the particles move to and fro along the direction of travel. Sound in air is longitudinal, and so are the waves that travel through water or solids from earthquakes as P-waves.

<div class="steps" data-fig="c11p-waves-build">
<div class="step">A row of beads joined by springs, at rest. Nothing travels yet.</div>
<div class="step">Shake the first bead up and down. It drags its neighbour along with it.</div>
<div class="step">The second bead copies the first, a moment later; the third copies the second. Each bead is only repeating its left neighbour, delayed.</div>
<div class="step">The pattern now runs along the row at a speed v. No bead moves along the row, each only moves up and down: the wave carries energy and shape, not matter.</div>
<div class="step">The distance between two beads that are in the same state of motion is the wavelength λ. The wave travels λ in one period T, so v = λ/T = fλ.</div>
</div>

<figure class="fig" data-fig="c11p-waves-travel"><figcaption>Switch between the transverse and longitudinal waves. In the transverse wave only the dots move, up and down. In the sound wave the layers of air move to and fro: dense (compression) where the pressure curve peaks. Change λ and f and check v = fλ.</figcaption></figure>

Test your picture of how a travelling wave moves with the tool:

<!--fig:tool travelling-wave-->

<div class="myth">

**“In a wave, the water (or air) travels along with the wave.”** The medium only oscillates about its place. A cork on a pond bobs up and down as ripples pass but stays where it is. Sound travels from a loudspeaker to you without any air going all the way.

</div>

## 2. Displacement relation for a progressive wave

A wave travelling in the +x direction can be written as

```math
y(x,t) = A\sin(kx - \omega t + \varphi)
```

<div class="meaning">

<dl>
<dt>A</dt><dd>amplitude: the maximum displacement of a particle</dd>
<dt>k = 2π/λ</dt><dd>angular wave number (rad/m): how many radians of phase per metre</dd>
<dt>ω = 2πf = 2π/T</dt><dd>angular frequency (rad/s)</dd>
<dt>(kx − ωt + φ)</dt><dd>the phase: points with the same phase are in the same state</dd>
<dt>Physical meaning</dt><dd>At a fixed time the equation gives the shape in space (period λ); at a fixed place it gives the SHM of that particle in time (period T). For a travelling wave kx − ωt must stay constant, so x moves with speed v = ω/k = fλ. A wave moving to the left is sin(kx + ωt).</dd>
</dl>

</div>

The particle at any x performs SHM with amplitude A. Its maximum speed (ωA) is quite different from the wave speed v. Particles that are one wavelength apart are in phase; those half a wavelength apart are in opposite phase.

<div class="problem" data-problem="c11p-waves-fv"></div>

<div class="problem" data-problem="c11p-waves-eq"></div>

## 3. Speed of a travelling wave

The speed depends only on the medium: how strongly it pulls back (elasticity or tension) and how heavy it is (inertia).

### On a stretched string

```math
v = \sqrt{\frac{T}{\mu}}
```

T is the tension and μ the mass per unit length. A tighter string is quicker and a thicker (heavier) string is slower, which is why the thick strings of a guitar give low notes. You can derive this by dimensional analysis: only T (N = kg m s⁻²) and μ (kg m⁻¹) can combine to give a speed, and `$\sqrt{T/\mu}$` is the only way.

<figure class="fig" data-fig="c11p-waves-pulse"><figcaption>Send a pulse down 10 m of string and watch the clock. Raise the tension (faster) or the mass per metre (slower). The reading agrees with 10 ÷ √(T/μ).</figcaption></figure>

<div class="problem" data-problem="c11p-waves-string"></div>

### Sound in a fluid: Newton and Laplace

In a gas the speed of a longitudinal wave is `$v = \sqrt{B/\rho}$`, with B the bulk modulus and ρ the density. **Newton** supposed the squeezing happens slowly, at constant temperature, which gives `$v = \sqrt{P/\rho}$`. For air at 0 °C this is 280 m/s, 15 % below the measured 331 m/s. **Laplace** pointed out (1816) that in a sound wave the compressions and rarefactions are far too quick for heat to flow, so the changes are adiabatic and `$B = \gamma P$`:

```math
v = \sqrt{\frac{\gamma P}{\rho}} = \sqrt{\frac{\gamma RT}{M}}
```

This matches experiment. It shows: (i) v ∝ √T, about +0.6 m/s per °C in air; (ii) v is independent of the pressure (at a fixed temperature, density changes in the same ratio); (iii) lighter gases carry sound faster (hydrogen, helium); (iv) humid air is a little faster (water vapour is lighter than the air it replaces). In water v is about 1480 m/s, and in steel about 5000 m/s, because they are far harder to compress.

<figure class="fig" data-fig="c11p-waves-sound"><figcaption>Compare the Newton and Laplace results for air, helium, hydrogen and carbon dioxide, and raise the temperature to see v grow as √T.</figcaption></figure>

<div class="problem" data-problem="c11p-waves-air"></div>

## 4. The principle of superposition of waves

When two or more waves meet in the same place the displacement is the **sum** of the displacements the waves would give separately:

```math
y = y_1 + y_2 + \cdots
```

and afterwards each wave carries on as if nothing had happened. Two equal waves, with a phase difference φ, give

```math
A\sin(kx-\omega t) + A\sin(kx-\omega t+\varphi) = 2A\cos\tfrac\varphi2\,\sin\!\left(kx-\omega t+\tfrac\varphi2\right)
```

so the combined amplitude is `$2A\cos(\varphi/2)$`. If φ = 0 (or 2π, 4π, … a path difference of whole wavelengths) the amplitude is 2A: **constructive interference**. If φ = π (path difference λ/2, 3λ/2, …) it is zero: **destructive interference**. Noise-cancelling headphones use this: they send out the opposite phase of the noise.

<figure class="fig" data-fig="c11p-waves-superpose"><figcaption>Two equal waves (thin lines) and their sum (thick). Slide the phase difference from 0 to 360° and watch the sum grow to 2A and vanish at 180°.</figcaption></figure>

## 5. Reflection of waves

A pulse that runs along a string meets the end and bounces back. At a **fixed end** the string cannot move, so the reflected pulse is turned upside down (phase change of π). At a **free end** (a ring sliding on a rod) it comes back the same way up. If the string is joined to a heavier or lighter string, part of the wave goes on (transmitted) and part is reflected. The same happens for sound: an echo is a reflected sound wave. At a closed end of a pipe the air cannot move and has a displacement node (pressure antinode); at an open end the air moves freely (displacement antinode).

<figure class="fig" data-fig="@wt-wave-reflection"><figcaption>Send a pulse to a fixed end, a free end, or a joint with a heavier or lighter string, and see how much is reflected and transmitted.</figcaption></figure>

The amplitude of a plane wave falls with distance because the energy spreads over a bigger area, and the intensity of sound from a small source falls as 1/r², so doubling the distance gives one quarter of the intensity.

## 6. Standing waves and normal modes

If a wave travelling to the right meets its own reflection travelling to the left, the two add and make a pattern that does not travel: a **standing wave**.

<div class="steps" data-fig="c11p-waves-standing">
<div class="step">A wave travelling to the right on a string: y₁ = A sin(kx − ωt).</div>
<div class="step">It reflects at the far end and returns, travelling to the left: y₂ = A sin(kx + ωt) (the sign change at a fixed end is taken care of by the choice of x = 0).</div>
<div class="step">Add them using sin a + sin b = 2 sin((a+b)/2) cos((a−b)/2): y = 2A sin(kx) cos(ωt). The shape sin(kx) stays in place and only its height changes with time.</div>
<div class="step">Where sin kx = 0 (x = 0, λ/2, λ, …) the string never moves: <b>nodes</b>, half a wavelength apart. Where |sin kx| = 1 it swings with amplitude 2A: <b>antinodes</b>, midway between nodes.</div>
<div class="step">If both ends are fixed, they must be nodes, so the string length is a whole number of half wavelengths: L = nλ/2. Slide the harmonic n to see the allowed modes.</div>
</div>

```math
L = n\frac\lambda2, \qquad f_n = \frac{nv}{2L} = \frac n{2L}\sqrt{\frac T\mu}\qquad(n = 1, 2, 3,\ldots)
```

These allowed patterns are the **normal modes**. The lowest, n = 1, is the **fundamental** (first harmonic); n = 2 is the second harmonic (the first overtone), and so on. A plucked string is a mixture of many harmonics; the mixture gives the instrument its character (timbre). The player changes the pitch by pressing the string to shorten L, or tightening it to raise T.

<div class="problem" data-problem="c11p-waves-string-f"></div>

### Air columns: pipes

In a pipe, sound waves reflect at the ends and make standing waves of air. An **open end** is an antinode of displacement; a **closed end** is a node.

- **Open pipe** (both ends open, a flute): antinodes at both ends, `$L = n\lambda/2$`, so `$f_n = \dfrac{nv}{2L}$` with all harmonics n = 1, 2, 3, …
- **Closed pipe** (one end closed, a clarinet or a bottle): a node at the closed end and an antinode at the open end, so `$L = (2n-1)\lambda/4$` and `$f = \dfrac{(2n-1)v}{4L}$`: only **odd** harmonics, f₁, 3f₁, 5f₁, …, and the fundamental v/4L is half that of an open pipe of the same length.

<figure class="fig" data-fig="c11p-waves-modes"><figcaption>The notes each of the three systems can sound for the same length. Strings and open pipes have all harmonics. The closed pipe has half the fundamental and only the odd ones.</figcaption></figure>

<figure class="fig" data-fig="@wt-pipe-resonance"><figcaption>Air moving in an open or a closed pipe for harmonics 1 to 4: air molecules and pressure shading, nodes (N) and antinodes (A).</figcaption></figure>

<div class="problem" data-problem="c11p-waves-pipe"></div>

Measure the speed of sound the way a laboratory does, by finding the lengths of an air column at which a tuning fork makes the loudest sound:

<!--fig:tool resonance-tube-->

See the fixed-end string modes with the [Standing waves tool](/science/standing-waves/).

## 7. Beats

When two waves of nearly the same frequency f₁ and f₂ are heard together, the loudness rises and falls regularly. These swells are called **beats**. Add two waves of equal amplitude at one point:

```math
\cos 2\pi f_1t + \cos2\pi f_2t = 2\cos\!\left(2\pi\frac{f_1-f_2}2t\right)\cos\!\left(2\pi\frac{f_1+f_2}2t\right)
```

The pitch you hear is the average (f₁ + f₂)/2, and its amplitude is shaped by the slow factor `$2\cos(\pi(f_1-f_2)t)$`. Loud twice per cycle of that factor, so the **beat frequency** is the difference:

```math
f_{\text{beat}} = |f_1 - f_2|
```

Musicians tune two strings by listening to the beats and tightening one until they vanish. Beats are also used to find an unknown frequency from a known fork.

<figure class="fig" data-fig="@wt-beats"><figcaption>Two close frequencies and their sum with the beat envelope. Bring the frequencies closer and the beats slow down, moving further apart makes them faster.</figcaption></figure>

<div class="problem" data-problem="c11p-waves-beats"></div>

More practice: the [Beats lab](/learn/beats-lab/).

## 8. Doppler effect

An ambulance siren sounds higher as it comes to you and lower as it goes away. This change of the frequency you receive, because the source or you (the listener) are moving, is the **Doppler effect**.

<div class="steps" data-fig="c11p-waves-doppler">
<div class="step">Source at rest: every crest spreads out in circles around the same point, so all listeners find the same wavelength, and hear f₀.</div>
<div class="step">A moving source emits each crest from a new place, a little nearer to the front. In front the crests bunch up: the wavelength is shorter, λ′ = (v − v<sub>s</sub>)/f₀, so the frequency is higher. Behind, the wavelength is longer and the pitch lower.</div>
<div class="step">If instead the observer moves towards a still source, she meets the crests more often, as if the sound travelled at v + v<sub>o</sub> relative to her: f′ = f₀(v + v<sub>o</sub>)/v.</div>
<div class="step">Putting both together: f′ = f₀ (v ± v<sub>o</sub>) / (v ∓ v<sub>s</sub>). Use the upper signs (+ in the numerator, − in the denominator) when the source and observer move towards each other, the lower signs when they move apart.</div>
</div>

```math
f' = f_0\,\frac{v + v_o}{v - v_s}\quad(\text{toward each other})
```

<div class="meaning">

<dl>
<dt>v</dt><dd>speed of sound in the medium (about 340 m/s)</dd>
<dt>v<sub>o</sub>, v<sub>s</sub></dt><dd>speeds of the observer and the source, measured relative to the medium (air), as positive numbers</dd>
<dt>Physical meaning</dt><dd>Approach squeezes the crests together (higher f); retreat spreads them apart (lower f). The pitch changes, not the speed of sound, which belongs to the air. The siren’s own pitch does not change.</dd>
</dl>

</div>

<div class="problem" data-problem="c11p-waves-doppler"></div>

Passing trains and cars give the drop in pitch as they pass; the same effect for light gives the red shift used to find out how fast stars move, and in Doppler radar to measure the speed of a cricket ball or a cloud.

<!--fig:tool doppler-beats-->

<div class="myth">

**“The Doppler effect happens because the speed of sound changes.”** The speed of sound stays fixed in the air. What changes is the number of crests that reach your ear each second, as the source or you move.

</div>

<div class="history">

<ul class="timeline">
<li><b>1687</b> Isaac Newton publishes the first theory of the speed of sound; it comes out about 15 % too low.</li>
<li><b>1816</b> Pierre-Simon Laplace corrects it with the adiabatic idea, giving 331 m/s.</li>
<li><b>1842</b> Christian Doppler predicts the change of frequency of waves from moving sources.</li>
<li><b>1845</b> Buys Ballot tests it with a trumpet on a moving train in the Netherlands, listeners standing by the track.</li>
<li><b>1863</b> Helmholtz explains the timbre of instruments by the mixture of harmonics.</li>
</ul>

</div>

<div class="keypoints">

- Wave: energy moves, the medium does not. Transverse (string, light), longitudinal (sound). v = fλ = ω/k.
- Progressive wave y = A sin(kx − ωt + φ), k = 2π/λ, ω = 2πf; moves to +x. Each particle does SHM.
- String: v = √(T/μ). Sound in a gas: v = √(γP/ρ) = √(γRT/M) (Laplace), ∝ √T, independent of P.
- Superposition: y = y₁ + y₂. Constructive for phase difference 0, 2π, …; destructive for π, 3π, … (path difference λ/2).
- Reflection: fixed end inverts the pulse; free end does not.
- Standing wave y = 2A sin kx cos ωt: nodes λ/2 apart. String (both ends fixed) and open pipe: f<sub>n</sub> = nv/2L (all harmonics). Closed pipe: f = (2n − 1)v/4L (odd only).
- Beats: f<sub>beat</sub> = |f₁ − f₂|. Doppler: f′ = f₀(v ± v<sub>o</sub>)/(v ∓ v<sub>s</sub>), upper signs for approach.

</div>

Going further for JEE/NEET: the exam-level problems (intensity and decibels, end correction, harmonics of strings with a changed tension, Doppler with reflection and wind) are in [Waves and sound (JEE)](/learn/courses/engineering-entrance/waves/).
