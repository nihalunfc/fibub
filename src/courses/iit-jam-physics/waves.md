---
title: 'Waves: the wave equation, standing waves and group velocity'
seoTitle: Wave equation, standing waves and group velocity for JAM
summary: 'Travelling waves and the one-dimensional wave equation, wave speed on a string, energy and power, reflection and transmission at a joint, standing waves and the harmonics of strings, dispersion, and the difference between phase velocity and group velocity.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'A wave is y = 0.01 sin(5x + 100t) in SI units. Which way and how fast does it travel?'
    choices: ['20 m/s towards −x', '20 m/s towards +x', '500 m/s towards −x', '0.01 m/s towards +x']
    ans: 0
    why: 'Speed is ω/k = 100/5 = 20 m/s. A plus sign between the x and t terms means the shape moves towards −x.'
  - q: 'The tension in a string fixed at both ends is made 9 times larger. What happens to its fundamental frequency?'
    choices: ['It becomes 3 times larger', 'It becomes 9 times larger', 'It becomes 81 times larger', 'It does not change']
    ans: 0
    why: 'f = (1/2L)√(T/μ), so f grows as the square root of the tension: √9 = 3.'
  - q: 'For deep-water waves, ω² = gk. How does the group velocity compare with the phase velocity?'
    choices: ['It is half the phase velocity', 'It equals the phase velocity', 'It is twice the phase velocity', 'It is zero']
    ans: 0
    why: 'v_p = √(g/k) and v_g = dω/dk = ½√(g/k): the energy moves at half the speed of the crests.'
sources:
  - 'A. P. French, Vibrations and Waves, MIT Introductory Physics Series (1971), chapters 6 to 8'
  - 'H. J. Pain and P. Rankin, Introduction to Vibrations and Waves (2015), chapters 5 and 6'
  - 'F. S. Crawford, Waves, Berkeley Physics Course vol. 3 (1968), chapters 2 to 6'
  - 'IIT JAM Physics syllabus (Oscillations, Waves and Optics section), published by the organising IIT each year'
---

**Module 3 · about 50 minutes.** By the end you will be able to read speed and direction off any wave formula, find the speed of waves on a string and the power they carry, predict what happens when a wave meets a joint or an end, find every harmonic of a string, and tell phase velocity from group velocity for any dispersion relation.

<div class="bigidea">A wave is a pattern that moves while the medium only wobbles in place. Its speed is set by the medium (stiffness against inertia), and when different wavelengths travel at different speeds, the pattern and the energy part company: crests move at the phase velocity, groups and energy at the group velocity.</div>

## 1. From coupled masses to the wave equation

In lesson 3.3 a chain of masses joined by springs had normal modes. Make the masses smaller and closer, keeping the mass per unit length `$\mu$` and the tension `$T$` fixed, and the chain becomes a string. Newton's law for a short piece of string at small slope gives the **one-dimensional wave equation**:

```math
\frac{\partial^2y}{\partial x^2} = \frac{1}{v^2}\frac{\partial^2y}{\partial t^2}, \qquad v = \sqrt{\frac{T}{\mu}}
```

<div class="meaning">

<dl>
<dt>y(x, t)</dt><dd>sideways displacement of the string at position x and time t</dd>
<dt>T</dt><dd>tension: the restoring "stiffness"</dd>
<dt>μ</dt><dd>mass per unit length: the inertia</dd>
<dt>v = √(T/μ)</dt><dd>the speed at which any shape travels along the string</dd>
<dt>Physical meaning</dt><dd>The left side is how curved the string is; the right side is how fast it accelerates. A curved bit of string is pulled back towards straight, faster for a tighter, lighter string. The same form, with different v, describes sound (v = √(B/ρ)), light (v = c) and waves on a long chain of atoms.</dd>
</dl>

</div>

**D'Alembert's solution.** Any function of `$x - vt$`, any function of `$x + vt$`, and any sum of them solves the equation:

```math
y(x, t) = f(x - vt) + g(x + vt)
```

`$f(x - vt)$` is the shape `$f$` sliding towards `$+x$` at speed `$v$`; `$g(x + vt)$` slides towards `$-x$`. A pulse `$4/[2 + (x + 3t)^2]$` moves towards `$-x$` at 3 m/s. But `$e^{-x^2 - v^2t^2}$` is not a solution, because `$x$` and `$t$` do not appear in the combination `$x \pm vt$`. A string released from rest with shape `$f(x)$` splits into two half-height copies running apart.

## 2. Sine waves and their vocabulary

The most important travelling wave is `$y = A\sin(kx - \omega t + \phi)$`:

- wavenumber `$k = 2\pi/\lambda$`, angular frequency `$\omega = 2\pi f$`, speed `$v = \omega/k = f\lambda$`;
- the phase difference between two points `$\Delta x$` apart is `$k\Delta x$`;
- each bit of medium moves with velocity `$\partial y/\partial t$`, at most `$A\omega$`. This particle speed is not the wave speed.

**Worked example.** `$y = 0.05\sin[2\pi(x/0.4 - t/0.01)]$`: `$\lambda = 0.4$` m, `$T = 0.01$` s, so the wave moves at `$40$` m/s while the largest particle speed is `$A\omega = 0.05\times628 = 31.4$` m/s.

<figure class="fig" data-fig="standing-wave"><figcaption>"Travelling wave": the crest moves, the marked bit of string only goes up and down. "Wave + reflection": a wave and its reflection from a fixed end add to a standing wave with nodes that never move. Lower the reflected amplitude and the nodes fill in.</figcaption></figure>

## 3. Energy and power

A sine wave on a string carries energy. Per unit length, on average, it holds `$\tfrac12\mu\omega^2A^2$` (half kinetic, half potential), and this is carried along at `$v$`:

```math
P = \tfrac12\mu\omega^2A^2v = \tfrac12Z\omega^2A^2, \qquad Z = \sqrt{T\mu} = \mu v
```

`$Z$` is the string's **impedance**. Unlike a mass on a spring, a bit of string has its kinetic and potential energy at their largest together (when it passes through equilibrium, where the slope is steepest) and both zero at a crest.

**Worked example.** `$\mu = 0.04$` kg/m, `$T = 64$` N, `$A = 1$` cm, `$f = 50$` Hz: `$v = 40$` m/s, `$\omega = 314$` rad/s, `$P = \tfrac12(0.04)(314)^2(10^{-4})(40) = 7.9$` W.

## 4. Reflection and transmission

When a wave on one string meets a second string (impedances `$Z_1$`, `$Z_2$`), part reflects and part goes on. The string must stay joined and its slope must match at the joint, which gives

```math
r = \frac{Z_1 - Z_2}{Z_1 + Z_2}, \qquad t = \frac{2Z_1}{Z_1 + Z_2}, \qquad 1 + r = t
```

for the amplitudes. The fractions of **power** are `$r^2$` and `$(Z_2/Z_1)t^2$`, which add to 1.

| Case | Reflection |
|---|---|
| into a heavier string (`$Z_2 > Z_1$`) | inverted (`$r < 0$`) |
| into a lighter string | upright, and the transmitted pulse is taller than the incident one |
| fixed end (`$Z_2 \to \infty$`) | `$r = -1$`: inverted, phase change `$\pi$` |
| free end (ring on a smooth rod, `$Z_2 = 0$`) | `$r = +1$`: upright |

**Worked example.** Into a string with four times the mass per unit length: `$Z_2 = 2Z_1$`, `$r = -1/3$`, `$t = 2/3$`. Power reflected `$1/9$`, transmitted `$2\times(2/3)^2 = 8/9$`. The trap is using `$\mu$` instead of `$\sqrt\mu$`.

## 5. Standing waves and the harmonics of a string

A wave and its reflection, running opposite ways with equal amplitude, add to

```math
y = A\sin(kx - \omega t) + A\sin(kx + \omega t) = 2A\sin kx\cos\omega t
```

This does not travel. **Nodes** (no motion) sit at `$kx = n\pi$`, `$\lambda/2$` apart; **antinodes** halfway between. All points between two nodes move in step; neighbouring loops move opposite. Equal energy flows both ways, so on average none is carried.

A string of length `$L$` fixed at both ends must have nodes at both ends, so only whole numbers of half-wavelengths fit:

```math
L = n\frac{\lambda}{2}, \qquad f_n = \frac{n}{2L}\sqrt{\frac{T}{\mu}}, \quad n = 1, 2, 3, \dots
```

**Worked example.** A string `$1.2$` m long, `$\mu = 0.01$` kg/m, `$T = 90$` N: `$v = 94.9$` m/s, `$f_1 = 39.5$` Hz, third harmonic `$118.6$` Hz. Neighbouring resonances differ by `$f_1$`, so resonances at 420 Hz and 490 Hz mean `$f_1 = 70$` Hz.

<div class="problem" data-problem="string-harmonic"></div>

Variations examiners like:

- **One end free** (a ring on a rod): `$L = (2n - 1)\lambda/4$`, only odd harmonics `$1 : 3 : 5$`.
- **Plucking point**: a string plucked at `$L/4$` cannot sound harmonics with a node there (4, 8, 12, ...).
- **Melde's experiment**: at fixed frequency the number of loops `$n$` obeys `$n\sqrt T$` = constant, so `$T \propto 1/n^2$`.
- **Hanging rope**: the tension grows with height, `$v = \sqrt{gy}$`, and a pulse climbs a rope of length `$L$` in `$2\sqrt{L/g}$`.

The [Standing waves calculator](/science/standing-waves/) works out modes for strings and pipes, and the [Travelling wave](/learn/travelling-wave/) tool shows `$k$`, `$\omega$` and direction changing live.

## 6. Dispersion, phase velocity and group velocity

So far every wavelength travelled at the same speed. In most media it does not: `$\omega$` is a more complicated function of `$k$`, the **dispersion relation**. Then there are two speeds:

```math
v_p = \frac{\omega}{k}\ \ (\text{phase velocity}), \qquad v_g = \frac{d\omega}{dk} = v_p - \lambda\frac{dv_p}{d\lambda}\ \ (\text{group velocity})
```

To see why, add two waves with nearby `$k$` and `$\omega$`. As with beats (lesson 3.3) you get a fast carrier inside a slow envelope: `$2A\cos\left(\frac{\Delta k}{2}x - \frac{\Delta\omega}{2}t\right)\cos(\bar kx - \bar\omega t)$`. The carrier crests move at `$\bar\omega/\bar k = v_p$`; the envelope moves at `$\Delta\omega/\Delta k \to d\omega/dk = v_g$`. Energy and information travel with the envelope.

<figure class="fig" data-fig="group-phase"><figcaption>The red dot rides a crest, the blue dot the top of a group. With no dispersion they move together; on deep water the groups move at half the crest speed; for ripples they move faster.</figcaption></figure>

| Medium | Dispersion relation | Result |
|---|---|---|
| string, sound, light in vacuum | `$\omega = vk$` | `$v_g = v_p$`: no dispersion |
| deep water | `$\omega^2 = gk$` | `$v_g = v_p/2$` |
| capillary ripples | `$\omega^2 = (\sigma/\rho)k^3$` | `$v_g = \tfrac32v_p$` |
| shallow water (`$kh \ll 1$`) | `$\omega^2 = ghk^2$` | non-dispersive, `$v = \sqrt{gh}$` (a tsunami: about 200 m/s) |
| plasma | `$\omega^2 = \omega_p^2 + c^2k^2$` | `$v_pv_g = c^2$`, `$v_p > c > v_g$` |
| free quantum particle | `$\omega = \hbar k^2/2m$` | `$v_g = 2v_p = \hbar k/m$` |
| chain of atoms | `$\omega = 2\sqrt{K/m}\,\lvert\sin(ka/2)\rvert$` | `$v_g = 0$` at `$k = \pi/a$` |

**Worked example.** For `$\omega = 3k + 2k^3$` at `$k = 1$`: `$v_g = 3 + 6k^2 = 9$` and `$v_p = 3 + 2k^2 = 5$`. From two measured points, `$\omega = 2.00$` at `$k = 1.00$` and `$2.06$` at `$1.02$`: `$v_g \approx 0.06/0.02 = 3$`.

<div class="problem" data-problem="group-velocity"></div>

A short pulse needs a spread of wavenumbers, `$\Delta x\,\Delta k \gtrsim 1$`. If `$d^2\omega/dk^2 \ne 0$`, those wavenumbers travel at different group speeds and the pulse spreads out, which is what happens to a quantum wave packet ([lesson 6.2](/learn/courses/iit-jam-physics/matter-waves/)).

<div class="myth">

**"A phase velocity faster than light breaks relativity."** In a plasma or a waveguide `$v_p = \omega/k$` can exceed `$c$`, and that is fine. A single endless sine wave carries no message; to send a signal you must switch the wave on and off, and that shape (the envelope) travels at the group velocity, which stays below `$c$`. Crests moving faster than `$c$` are like the spot of a searchlight swept across distant clouds: nothing material travels with them.

</div>

<div class="keypoints">

- `$f(x - vt)$` moves towards `$+x$`, `$f(x + vt)$` towards `$-x$`; the wave equation is solved by any sum of the two. On a string `$v = \sqrt{T/\mu}$`.
- For `$A\sin(kx - \omega t)$`: `$v = \omega/k$`; particle speed at most `$A\omega$`; phase difference `$k\Delta x$`.
- Power `$\tfrac12\mu\omega^2A^2v$`. Impedance `$Z = \sqrt{T\mu}$`: `$r = (Z_1 - Z_2)/(Z_1 + Z_2)$`, `$t = 2Z_1/(Z_1 + Z_2)$`; a fixed end inverts.
- Standing wave `$2A\sin kx\cos\omega t$`: nodes `$\lambda/2$` apart, no net energy flow. Fixed ends: `$f_n = n v/2L$`; one free end: odd harmonics only.
- Phase velocity `$\omega/k$`, group velocity `$d\omega/dk$`. Deep water `$v_g = v_p/2$`, ripples `$\tfrac32v_p$`, plasma `$v_pv_g = c^2$`. Signals and energy go at `$v_g$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. More on the [waves practice page](/learn/courses/iit-jam-physics/practice/waves/).

<div class="qbank" data-bank="physics" data-topics="waves" data-exam="jam" data-n="10"></div>

**Next:** [lesson 3.5](/learn/courses/iit-jam-physics/sound-doppler/) applies all of this to sound: the speed of sound in gases, pipes, beats and the Doppler effect. The standing-wave idea returns in [interference](/learn/courses/iit-jam-physics/interference/) and in the quantum particle in a box.
