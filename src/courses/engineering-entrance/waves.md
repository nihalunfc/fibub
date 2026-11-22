---
title: Waves and sound
seoTitle: 'Waves and sound: JEE and NEET physics'
summary: 'Transverse and longitudinal waves, the wave equation and its terms, speed on a string and in gases, energy and intensity, decibels, reflection, superposition and interference, standing waves on strings and in open and closed pipes, resonance tubes and end correction, beats and the Doppler effect.'
minutes: 38
updated: 2026-11-22
quiz:
  - q: 'A pipe open at both ends and a pipe closed at one end have the same length. The ratio of their fundamental frequencies (open : closed) is:'
    choices: ['1 : 2', '2 : 1', '1 : 1', '4 : 1']
    ans: 1
    why: 'Open: f = v/2L. Closed: f = v/4L. So open : closed = 2 : 1.'
  - q: 'The speed of sound in air is affected by:'
    choices: ['pressure at constant temperature', 'temperature', 'loudness', 'frequency']
    ans: 1
    why: 'v = √(γRT/M). At fixed temperature, changing the pressure changes the density in the same ratio, so the speed does not change. Heating the air speeds sound up (v ∝ √T).'
  - q: 'Two tuning forks of 256 Hz and 260 Hz sound together. You hear:'
    choices: ['a note of 516 Hz', '4 beats per second', '2 beats per second', 'silence']
    ans: 1
    why: 'The beat frequency is the difference: 260 − 256 = 4 beats per second. The pitch heard is the average, 258 Hz, rising and falling in loudness.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Waves'
  - 'Speed of sound in dry air ≈ 343 m/s at 20 °C (about 331 m/s at 0 °C); exams often use 330 or 340 m/s'
---

**Physics · Class 11 · about 38 minutes.** By the end you will be able to read a wave equation, find wave speeds on strings and in gases, handle intensity and decibels, explain interference and standing waves, find the harmonics of strings and pipes, and solve beats and Doppler problems.

<div class="bigidea">A wave carries energy from place to place while the medium only jiggles about where it is. Where two waves meet, they simply add. Trap a wave between two ends and only the wavelengths that fit survive: these are the notes an instrument can play.</div>

## 1. What a wave is

In a **transverse** wave the medium moves at right angles to the wave's travel (a string, ripples, light). In a **longitudinal** wave it moves along the travel direction, in compressions and rarefactions (sound). Mechanical waves need a medium; sound cannot cross a vacuum.

A sine wave travelling in the +x direction:

```math
y(x, t) = A\sin(kx - \omega t + \phi), \qquad k = \frac{2\pi}{\lambda}, \quad \omega = 2\pi f, \quad v = f\lambda = \frac{\omega}{k}
```

<div class="meaning">
<dl>
<dt>A</dt><dd>amplitude, the largest displacement of a particle</dd>
<dt>λ, k</dt><dd>wavelength, and wave number 2π/λ (rad/m)</dd>
<dt>f, ω</dt><dd>frequency (Hz) and angular frequency 2πf</dd>
<dt>v</dt><dd>wave speed, set by the medium, not by the source</dd>
<dt>Physical meaning</dt><dd>Each particle does SHM at frequency f. The wave is the pattern of their phases, sliding along at v.</dd>
</dl>
</div>

`$kx + \omega t$` means travel in −x. The particle velocity `$\partial y/\partial t$` is not the wave velocity; its maximum is Aω. Also `$\dfrac{\partial y}{\partial t} = -v\dfrac{\partial y}{\partial x}$`: particle velocity = −(wave speed) × (slope of the string). Phase difference between two points: `$\Delta\phi = \dfrac{2\pi}{\lambda}\Delta x$`.

## 2. Wave speed

- **String** with tension T and mass per length μ: `$v = \sqrt{T/\mu}$`.
- **Sound in a gas:** `$v = \sqrt{\dfrac{\gamma P}{\rho}} = \sqrt{\dfrac{\gamma RT}{M}}$`. (Newton used γ = 1 and got 280 m/s; Laplace saw that sound compressions are adiabatic.)
- **Liquids and solids:** `$v = \sqrt{B/\rho}$` and `$v = \sqrt{Y/\rho}$` for a rod.

Sound in air: v ∝ √T (about +0.6 m/s per °C), does not change with pressure at fixed T, and rises with humidity (moist air is lighter).

<div class="problem" data-problem="wv-string-fundamental"></div>

## 3. Energy, intensity and loudness

A wave carries power `$P = \tfrac12\mu\omega^2A^2v$` on a string. **Intensity** I = power per area (W/m²), ∝ A²f². From a point source, `$I = P/(4\pi r^2)$`, so I ∝ 1/r² and A ∝ 1/r.

**Sound level** in decibels: `$\beta = 10\log_{10}\dfrac{I}{I_0}$`, with `$I_0 = 10^{-12}$` W/m² (the faintest sound we hear). Ten times the intensity adds 10 dB; doubling adds 3 dB.

## 4. Reflection and superposition

At a **fixed end** (or a denser medium) a wave reflects upside down: a phase change of π. At a **free end** (or a rarer medium) it reflects upright. Transmitted waves never flip.

**Superposition:** where waves meet, their displacements add. Two waves of the same frequency with phase difference φ give amplitude `$A = \sqrt{A_1^2 + A_2^2 + 2A_1A_2\cos\phi}$`.

- **Constructive:** path difference = nλ (phase 2nπ), `$A = A_1 + A_2$`.
- **Destructive:** path difference = (n + ½)λ, `$A = |A_1 - A_2|$`.
- Intensities: `$I_{max}/I_{min} = \left(\dfrac{\sqrt{I_1} + \sqrt{I_2}}{\sqrt{I_1} - \sqrt{I_2}}\right)^2$`.

Send a pulse down a string and watch what the end does to it, then change the end.

<figure class="fig" data-fig="@wt-wave-reflection"><figcaption>At a fixed end the string cannot move, so the reflected pulse is inverted; at a free end it returns the same way up. Notice that a pulse going into a heavier string partly reflects inverted and partly goes on, slower.</figcaption></figure>


## 5. Standing waves: strings and pipes

Two equal waves travelling opposite ways make a **standing wave**, `$y = 2A\sin kx\cos\omega t$`. **Nodes** never move; **antinodes** swing the most. Neighbouring nodes are λ/2 apart, and a node and the next antinode λ/4. No energy flows along a standing wave.

The ends fix the pattern. Choose a system and a mode below.

<figure class="fig" data-fig="wave-harmonics"><figcaption>Standing waves. A string has nodes (N) at both ends; an open pipe has antinodes (A) of air displacement at both ends; a closed pipe has a node at the closed end and an antinode at the open end, so only odd harmonics fit.</figcaption></figure>

| System | Allowed frequencies | Harmonics present |
|---|---|---|
| String fixed at both ends | `$f_n = \dfrac{n v}{2L}$` | all: 1, 2, 3, … |
| Pipe open at both ends | `$f_n = \dfrac{n v}{2L}$` | all |
| Pipe closed at one end | `$f = \dfrac{(2n - 1) v}{4L}$` | odd only: 1, 3, 5, … |

- **Sonometer laws:** `$f = \dfrac{1}{2L}\sqrt{\dfrac{T}{\mu}}$`: f ∝ 1/L, ∝ √T, ∝ 1/√μ.
- **End correction:** the antinode sits a little beyond the open end, about 0.6r for a tube of radius r. A closed pipe's effective length is L + 0.6r; an open pipe's is L + 1.2r.
- **Resonance tube:** successive resonance lengths differ by λ/2, so `$v = 2f(L_2 - L_1)$`, and the end correction cancels out.

<div class="problem" data-problem="wv-closed-pipe"></div>

<div class="myth">

**"In a pipe, the air is still at the open end."** The open end is a displacement **antinode**: the air moves most there, and the pressure stays near atmospheric (a pressure node). The closed end is the opposite: air cannot move (displacement node), and pressure swings most.

</div>

Choose a pipe and a harmonic and watch the air itself move, then change the length.

<figure class="fig" data-fig="@wt-pipe-resonance"><figcaption>Nodes are where the air does not move and antinodes where it moves most; the pressure pattern is the other way round. Notice that the open pipe fits every harmonic but the closed pipe only odd multiples, and that a longer pipe gives a lower note.</figcaption></figure>

A string can be plucked in any shape. See how it is built from the harmonics you just met.

<figure class="fig" data-fig="@wt-string-modes"><figcaption>A plucked string is a sum of its harmonics, each at n times the fundamental frequency. Notice that adding more harmonics sharpens the corner of the pluck, and that plucking at the middle removes the even harmonics.</figcaption></figure>



## 6. Beats

Two sounds of nearly equal frequencies f₁ and f₂ drift in and out of step. The loudness rises and falls `$f_{beat} = |f_1 - f_2|$` times per second. To find an unknown frequency: load a tuning fork with wax (its frequency falls) or file it (it rises) and see whether the beat rate goes up or down.

Bring the two frequencies close together and listen with your eyes: the loudness throbs at the difference frequency.

<figure class="fig" data-fig="@wt-beats"><figcaption>Two nearly equal frequencies drift in and out of step: the sum swells and fades |f₁ − f₂| times a second. Notice that equal frequencies give no beats and that the dashed envelope is what you hear as loudness.</figcaption></figure>


## 7. The Doppler effect

When source and listener move along the line joining them, in still air:

```math
f' = f\,\frac{v + v_o}{v - v_s}
```

with v_o positive when the listener moves towards the source, and v_s positive when the source moves towards the listener. Approaching raises the pitch; going away lowers it.

<div class="problem" data-problem="wv-doppler"></div>

- **Wind** at speed w blowing from source to listener: replace v by v + w.
- **Echo from a wall** when a car drives at u towards it: `$f'' = f\,\dfrac{v + u}{v - u}$`.
- If the motion is at an angle, use only the velocity components along the line joining source and listener.
- When `$v_s > v$`, the waves pile up into a **shock wave** (a sonic boom), in a cone of half-angle `$\sin\theta = v/v_s$`.

<div class="myth">

**"The pitch of an approaching train keeps rising as it gets closer."** At constant speed, the pitch heard is steady and high while it approaches, then drops suddenly as it passes, and stays steady and low as it goes away. It is the loudness that keeps rising.

</div>

Move the source and the observer separately and see the two different formulas at work.

<figure class="fig" data-fig="@wt-doppler-observer"><figcaption>The wavefronts travel at the speed of sound relative to the air. Notice that a moving source squeezes the wavelength, while a moving observer only meets the fronts more often, so the two cases are not symmetric.</figcaption></figure>

<div class="keypoints">

- y = A sin(kx − ωt); v = fλ = ω/k; particle speed is not wave speed; Δφ = (2π/λ)Δx.
- String v = √(T/μ); gas v = √(γRT/M), ∝ √T, independent of pressure.
- I ∝ A²f², point source I ∝ 1/r²; β = 10 log(I/I₀); ×10 intensity = +10 dB.
- Fixed end reflects with phase π; superposition A² = A₁² + A₂² + 2A₁A₂ cos φ.
- Standing waves: nodes λ/2 apart; string and open pipe nv/2L, closed pipe odd harmonics (2n − 1)v/4L.
- Resonance tube v = 2f(L₂ − L₁); end correction 0.6r.
- Beats |f₁ − f₂|; Doppler f' = f(v + v_o)/(v − v_s).

</div>
