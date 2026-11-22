---
title: Sound, beats and the Doppler effect
seoTitle: Sound, beats and the Doppler effect for IIT JAM Physics
summary: 'The speed of sound in gases and solids (and why Newton was wrong), pressure and displacement waves, intensity and decibels, open and closed pipes with end corrections, beats and tuning forks, the Doppler effect for moving sources, listeners, wind and echoes, shock waves, and the Doppler effect for light.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'A source moves at 34 m/s towards you, then you move at 34 m/s towards the same source at rest (speed of sound 340 m/s). Which gives the higher pitch?'
    choices: ['The moving source (555.6 Hz for a 500 Hz source, against 550 Hz)', 'Moving yourself', 'They are exactly equal', 'Neither changes the pitch']
    ans: 0
    why: 'Moving source: f v/(v − u) = 500 × 340/306 = 555.6 Hz. Moving listener: f (v + u)/v = 550 Hz. Sound travels in air, so who moves relative to the air matters.'
  - q: 'An open pipe has a fundamental of 300 Hz. What is its fundamental if one end is closed?'
    choices: ['150 Hz', '600 Hz', '300 Hz', '100 Hz']
    ans: 0
    why: 'Open: f = v/2L. Closed at one end: f = v/4L, half as much.'
  - q: 'Two independent machines each make 70 dB at a point. What level do they make together?'
    choices: ['About 73 dB', '140 dB', '70 dB', '76 dB']
    ans: 0
    why: 'Incoherent intensities add: twice the intensity is 10 log₁₀ 2 = 3 dB more.'
sources:
  - 'D. Halliday, R. Resnick and J. Walker, Fundamentals of Physics, 10th ed. (2014), chapter 17: waves II'
  - 'A. P. French, Vibrations and Waves, MIT Introductory Physics Series (1971), chapter 7'
  - 'L. E. Kinsler, A. R. Frey, A. B. Coppens and J. V. Sanders, Fundamentals of Acoustics, 4th ed. (2000), chapters 5 and 10'
  - 'IIT JAM Physics syllabus (Oscillations, Waves and Optics section), published by the organising IIT each year'
---

**Module 3 · about 45 minutes.** By the end you will be able to work out the speed of sound in any gas or rod, convert between pressure amplitude, intensity and decibels, find the resonances of pipes and correct for their ends, solve every tuning-fork beats puzzle, and get Doppler problems right with moving sources, moving listeners, wind and echoes, including shock waves and light.

<div class="bigidea">Sound is a pressure wave in a medium, so its speed is set by the medium and every Doppler problem depends on who moves relative to the air. Pipes and strings pick out the frequencies that fit; two close frequencies beat; and a source that outruns its own sound drags a shock cone behind it.</div>

## 1. The speed of sound

Sound is a longitudinal wave: layers of gas move back and forth along the direction of travel, making compressions and rarefactions. As for a string, speed is stiffness against inertia:

```math
v = \sqrt{\frac{B}{\rho}} \ \text{(fluid)}, \qquad v = \sqrt{\frac{\gamma P}{\rho}} = \sqrt{\frac{\gamma RT}{M}} \ \text{(ideal gas)}, \qquad v = \sqrt{\frac{Y}{\rho}} \ \text{(thin rod)}
```

<div class="meaning">

<dl>
<dt>B</dt><dd>bulk modulus: how hard the medium resists being squeezed</dd>
<dt>γ</dt><dd>ratio of heat capacities (1.4 for air, 5/3 for helium)</dd>
<dt>M</dt><dd>molar mass in kg/mol (0.029 for air)</dd>
<dt>Y</dt><dd>Young's modulus of a solid rod</dd>
<dt>Physical meaning</dt><dd>Newton assumed the squeezing was isothermal (B = P) and got 280 m/s for air, 15% too low. Laplace saw that the compressions are too quick for heat to flow, so they are adiabatic (B = γP), which gives the measured 343 m/s at 20 °C.</dd>
</dl>

</div>

Consequences: `$v \propto \sqrt T$` (kelvin); at fixed temperature `$v$` does not depend on pressure (density rises with it); light gases carry sound fast (helium about 1000 m/s), and humid air slightly faster than dry. In steel, `$\sqrt{2\times10^{11}/8000} = 5000$` m/s.

**Worked example.** Helium at 300 K: `$v = \sqrt{(5/3)(8.314)(300)/0.004} = 1019$` m/s. The trap is grams instead of kilograms per mole.

## 2. Pressure, intensity and decibels

If the displacement is `$s = s_0\sin(kx - \omega t)$`, the pressure change is `$p = -B\,\partial s/\partial x$`, a quarter cycle out of step, with amplitude `$p_0 = \rho v\omega s_0$`. The intensity and the level in decibels are

```math
I = \frac{p_0^2}{2\rho v} = \tfrac12\rho v\omega^2s_0^2, \qquad \beta = 10\log_{10}\frac{I}{I_0}, \quad I_0 = 10^{-12}\ \text{W/m}^2
```

- Twice the intensity: `$+3$` dB. Ten times: `$+10$` dB. Twice the pressure amplitude: `$+6$` dB.
- Independent sources add intensities: two 60 dB machines make 63 dB, not 120.
- A small source spreads over a sphere, `$I \propto 1/r^2$`: ten times further is `$-20$` dB.

**Worked example.** `$p_0 = 0.02$` Pa in air (`$\rho = 1.2$`, `$v = 340$`): `$I = 4\times10^{-4}/816 = 4.9\times10^{-7}$` W/m², `$\beta = 56.9$` dB. The [Decibel distance calculator](/science/decibel-distance/) does the spreading for you.

## 3. Pipes and air columns

In a pipe the air at a **closed end** cannot move (displacement node, pressure antinode); at an **open end** the pressure stays atmospheric (pressure node, displacement antinode).

| Pipe | Fits | Frequencies |
|---|---|---|
| open at both ends | `$L = n\lambda/2$` | `$f_n = nv/2L$`, all harmonics |
| closed at one end | `$L = (2n - 1)\lambda/4$` | `$f = (2n - 1)v/4L$`, odd harmonics only |

Closing one end of an open pipe halves its fundamental. In a closed pipe the overtones are the 3rd, 5th, ... harmonics, so the "second overtone" is the fifth harmonic.

**End correction.** The antinode sits a little outside an open end, about `$0.6r$` for a pipe of radius `$r$`, so the effective length is `$L + e$` (or `$L + 2e$` for two open ends). In a **resonance tube** with a fork of frequency `$f$`, the first two resonances `$l_1$` and `$l_2$` give

```math
v = 2f(l_2 - l_1), \qquad e = \frac{l_2 - 3l_1}{2}
```

**Worked example.** `$f = 500$` Hz, `$l_1 = 16.0$` cm, `$l_2 = 50.0$` cm: `$v = 2(500)(0.34) = 340$` m/s and `$e = (50 - 48)/2 = 1.0$` cm. Taking `$v = 4fl_1$` ignores the end correction and gives 320 m/s. Try it in the [Resonance tube practical](/learn/resonance-tube/).

<div class="problem" data-problem="pipe-resonance"></div>

**Kundt's tube.** A rod clamped at its middle rings in its fundamental (`$\lambda_{rod} = 2L$`) and drives the air in a tube, where powder gathers at displacement nodes `$\lambda_{air}/2$` apart. Same frequency in both, so `$v_{rod}/v_{air} = \lambda_{rod}/\lambda_{air}$`.

## 4. Beats and tuning forks

Two sounds of frequencies `$f_1$` and `$f_2$` give `$|f_1 - f_2|$` beats per second (lesson 3.3). The classic puzzle: a 512 Hz fork and an unknown give 4 beats; with wax on the unknown, 6 beats. The unknown was 508 or 516 Hz. **Wax lowers** a fork's frequency (more mass) and **filing raises** it. Lowering 516 would bring it closer to 512 and reduce the beats; the beats grew, so it was **508 Hz**.

## 5. The Doppler effect for sound

Let `$v$` be the speed of sound in still air, `$u_s$` the source's speed and `$u_o$` the listener's, both measured along the line joining them:

```math
f' = f\,\frac{v \pm u_o}{v \mp u_s}
```

Use the upper signs when moving **towards** the other, the lower signs when moving away. The two speeds are not interchangeable:

- A **moving source** changes the wavelength in the air: crests in front are bunched, `$\lambda' = (v - u_s)/f$`.
- A **moving listener** leaves the wavelength alone but meets crests faster, at relative speed `$v + u_o$`.

<figure class="fig" data-fig="doppler-source"><figcaption>Each circle is a crest, spreading from where the source was when it left. Raise the speed: crests bunch up ahead and spread out behind; at Mach 1 they pile into a wall; beyond it they lie inside a cone.</figcaption></figure>

**Worked example.** A 500 Hz source moving at 34 m/s towards a listener at rest: `$500\times340/306 = 555.6$` Hz. A listener moving at 34 m/s towards the source at rest: `$500\times374/340 = 550$` Hz.

<div class="problem" data-problem="doppler-shift"></div>

### Echoes, wind and other variations

- **Echo from a wall you drive towards** at `$u$`: two steps (the wall listens, then re-emits), `$f'' = f(v + u)/(v - u)$`. A 400 Hz horn at 20 m/s gives a 450 Hz echo.
- **Speed from the change in pitch**: a passing train heard at `$f_a$` and then `$f_r$` has `$(v + u)/(v - u) = f_a/f_r$`.
- **Beats from one moving source**: a microphone hearing both the emitted sound and its echo from an approaching car records `$2fu/(v - u)$` beats.
- **Wind** `$w$` changes the speed of sound relative to the ground: replace `$v$` by `$v \pm w$`. With source and listener both at rest, wind changes nothing about the frequency.
- **Not along the line**: use the component of velocity along the line of sight at the moment of emission. A whistle whirled in a circle round you gives no shift; a train at closest approach is still heard slightly high (that sound left earlier).

The [Doppler and beats](/science/doppler-beats/) tool works these out with your own numbers.

## 6. Shock waves

If `$u_s > v$`, the source outruns its crests. They all lie inside a cone of half-angle `$\theta$`:

```math
\sin\theta = \frac{v}{u_s} = \frac{1}{M}
```

where `$M$` is the Mach number. The cone sweeping over the ground is the sonic boom. A jet at Mach 2 has `$\theta = 30^\circ$`; flying at height `$h$`, it has gone `$h\sqrt{M^2 - 1}$` past you when the boom arrives (8.7 s later for `$h = 3400$` m, `$v = 340$` m/s).

## 7. The Doppler effect for light

Light needs no medium, so only the relative velocity `$\beta c$` matters, and relativity adds time dilation:

```math
f' = f\sqrt{\frac{1 - \beta}{1 + \beta}} \ \text{(receding)}, \qquad \frac{\Delta\lambda}{\lambda} \approx \beta \ \text{for}\ \beta \ll 1
```

Even a source moving across the line of sight is shifted, by `$\sqrt{1 - \beta^2}$` (the transverse Doppler effect). A hydrogen line at 656.3 nm seen at 662.9 nm means a galaxy receding at about 3000 km/s: the start of the expanding universe in our [cosmology course](/learn/courses/cosmology/).

<div class="myth">

**"Only the relative speed matters, so a moving source and a moving listener give the same shift."** True for light, false for sound. Sound is carried by the air, which gives a preferred frame. A source moving at `$u$` towards you squashes the wavelength; you moving at `$u$` towards the source does not. At low speeds the two agree to first order in `$u/v$`, which is why the difference is easy to forget, but JAM numbers (`$u/v = 0.1$`) are large enough to separate them.

</div>

<div class="keypoints">

- `$v = \sqrt{\gamma P/\rho} = \sqrt{\gamma RT/M}$` (adiabatic, Laplace); `$v \propto \sqrt T$`, independent of pressure at fixed `$T$`; rods `$\sqrt{Y/\rho}$`.
- `$I = p_0^2/(2\rho v)$`; `$\beta = 10\log(I/I_0)$`: `$\times2 \to +3$` dB, `$\times10 \to +10$` dB; incoherent sources add intensities.
- Open pipe `$nv/2L$` (all harmonics); closed pipe `$(2n - 1)v/4L$` (odd only). Resonance tube: `$v = 2f(l_2 - l_1)$`, `$e = (l_2 - 3l_1)/2$`.
- Beats `$|f_1 - f_2|$`; wax lowers, filing raises a fork's frequency.
- Doppler: `$f' = f(v \pm u_o)/(v \mp u_s)$`; echoes need two steps; wind shifts `$v$`; light uses `$\sqrt{(1 - \beta)/(1 + \beta)}$`.
- Mach cone `$\sin\theta = 1/M$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [sound and Doppler practice page](/learn/courses/iit-jam-physics/practice/sound-doppler/).

<div class="qbank" data-bank="physics" data-topics="sound-doppler" data-exam="jam" data-n="10"></div>

**Next:** [lesson 3.6](/learn/courses/iit-jam-physics/geometrical-optics/) turns from sound to light, starting with rays, mirrors and lenses. Look back at [waves](/learn/courses/iit-jam-physics/waves/) for standing waves on strings, the same physics as pipes.
