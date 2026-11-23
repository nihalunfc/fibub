---
title: 'Waves: practice questions'
seoTitle: 'Waves Class 11 questions with answers'
summary: 'Class 11 Waves practice: 1, 2, 3 and 5 mark questions, a case study and assertion-reason questions with full worked answers.'
minutes: 60
updated: 2026-11-23
quiz:
  - q: 'The speed of sound in air at 20 °C is about 343 m/s. At 80 °C it is about:'
    choices: ['343 m/s', '377 m/s', '404 m/s', '686 m/s']
    ans: 1
    why: 'v ∝ √T: 343 × √(353/293) = 343 × 1.098 = 377 m/s.'
  - q: 'A string fixed at both ends vibrates in its fundamental mode with a node at each end and one antinode. Its wavelength is:'
    choices: ['L/2', 'L', '2L', '4L']
    ans: 2
    why: 'L = λ/2 for the fundamental, so λ = 2L.'
  - q: 'A source of frequency 500 Hz moves towards a stationary listener at 34 m/s (v = 340 m/s). The listener hears:'
    choices: ['450 Hz', '500 Hz', '556 Hz', '550 Hz']
    ans: 2
    why: 'f′ = 500 × 340/(340 − 34) = 500 × 1.111 = 556 Hz.'
sources:
  - 'CBSE Class 11 Physics question paper design (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 11 Physics · Chapter 14.** Read the lesson, [Waves](/learn/courses/ncert-class-11-physics/waves/), first. Try each question on paper before opening the answer. Marks go for the law, the formula, the substitution with units and the final answer.

<div class="bigidea">Wave problems come in a few families: v = fλ for any wave, v = √(T/μ) for strings, the harmonics of a string or pipe (draw the pattern of nodes and antinodes first!), beats (a difference), and the Doppler effect (a ratio of speeds). Draw a picture, then write the formula.</div>

## How to set out a numerical

1. State the system (string, open pipe, closed pipe, moving source) and draw the node and antinode pattern.
2. Write the formula, convert to SI units (g/m to kg/m, cm to m), and substitute with units.
3. Sanity check: a closed pipe sounds an octave below an open one of the same length; the Doppler pitch is higher on approach.

<div class="problem" data-problem="c11p-waves-pipe"></div>

<div class="problem" data-problem="c11p-waves-doppler"></div>

## 1-mark questions

1. What type of wave is sound in air?

<details><summary>Answer</summary>Longitudinal.</details>

2. Define the wavelength of a wave.

<details><summary>Answer</summary>The distance between two successive points in the same phase (for example two crests), or the distance the wave travels in one time period.</details>

3. What is the phase difference between two points half a wavelength apart on a travelling wave?

<details><summary>Answer</summary>π (180°).</details>

4. Why can transverse waves not travel in a gas?

<details><summary>Answer</summary>A gas cannot sustain a shear (sideways) force; it has no rigidity, so there is nothing to pull a particle back sideways.</details>

## 2- and 3-mark questions

5. (2) A wave of frequency 500 Hz travels at 350 m/s. How far apart are two points whose phases differ by 60°?

<details><summary>Answer</summary>

`$\lambda = v/f = 0.7$` m. A phase difference of 60° = π/3 corresponds to a path difference of `$\lambda/6 = 0.7/6 = 0.117$` m (11.7 cm).

</details>

6. (2) Why is the speed of sound in air independent of the pressure at constant temperature?

<details><summary>Answer</summary>

`$v = \sqrt{\gamma P/\rho}$`. At constant temperature, P/ρ is constant (Boyle’s law), so raising P raises ρ in the same ratio and v is unchanged.

</details>

7. (3) Explain why Newton’s formula for the speed of sound in air gave a value that is too low, and how Laplace corrected it.

<details><summary>Answer</summary>

Newton assumed the compressions and rarefactions are isothermal, v = √(P/ρ) ≈ 280 m/s at 0 °C. Laplace argued that the vibrations are so fast that heat has no time to flow, so the changes are adiabatic: the bulk modulus is γP, not P, so `$v = \sqrt{\gamma P/\rho}$`. With γ = 1.4 for air this is 331 m/s, as measured.

</details>

8. (3) Two sound waves reach a point with equal amplitude A and a phase difference of 120°. What is the amplitude of the resultant wave?

<details><summary>Answer</summary>

`$R = 2A\cos(\varphi/2) = 2A\cos 60° = A$`. The resultant amplitude equals A.

</details>

9. (3) A string of linear mass density 5 g/m and length 1 m is under a tension of 20 N. Find its fundamental frequency.

<details><summary>Answer</summary>

`$v = \sqrt{T/\mu} = \sqrt{20/0.005} = 63.2$` m/s. `$f_1 = v/2L = 63.2/2 = 31.6$` Hz.

</details>

## 5-mark questions

10. (5) Show that stationary waves are formed when a wave is reflected. Find the positions of the nodes and antinodes, and derive the frequencies of the modes of a string fixed at both ends.

<details><summary>Answer</summary>

Incident `$y_1 = A\sin(kx-\omega t)$`, reflected `$y_2 = A\sin(kx+\omega t)$`. Sum: `$y = 2A\sin kx\cos\omega t$`. This has a fixed shape `$\sin kx$` whose amplitude varies with time: a stationary (standing) wave.

Nodes: `$\sin kx = 0$`, `$x = n\lambda/2$`; antinodes: `$\sin kx = \pm1$`, `$x = (2n+1)\lambda/4$` (maximum amplitude 2A).

Both ends fixed must be nodes: `$L = n\lambda/2$`, so `$\lambda = 2L/n$` and `$f_n = v/\lambda = nv/2L = \dfrac n{2L}\sqrt{T/\mu}$`, n = 1, 2, 3, …

</details>

11. (5) What is meant by beats? Show that the beat frequency equals the difference of the two frequencies. A tuning fork of 256 Hz gives 4 beats per second with another fork. When the other fork is loaded with wax the beat rate falls to 2. Find its original frequency.

<details><summary>Answer</summary>

Beats are the rise and fall of loudness heard when two sounds of nearly the same frequency are superposed. For equal amplitudes, `$\cos2\pi f_1t+\cos2\pi f_2t = 2\cos(\pi(f_1-f_2)t)\cos(\pi(f_1+f_2)t)$`. The amplitude factor reaches a maximum magnitude twice per cycle of the first cosine, so there are `$|f_1-f_2|$` beats per second.

The unknown fork has 256 ± 4 = 260 or 252 Hz. Waxing lowers its frequency. If it were 252 Hz, going lower would increase the beats, but they fall to 2, so the original was **260 Hz** (now 258 Hz, 2 beats).

</details>

## Case-based question

12. (4) **The tabla and the flute.** A flute is a pipe open at both ends and 34 cm long. A school student blows across it and a clear note is heard. Take the speed of sound as 340 m/s.

(a) Find the fundamental frequency. (b) What is the next-higher frequency the flute can sound? (c) The student puts a cork at one end, so it is closed. What is the new fundamental frequency? (d) Name the effect that lets a tabla player “tune” the skin by tapping the rim and listening for beats between two tablas.

<details><summary>Answer</summary>

(a) `$f_1 = v/2L = 340/(2 \times 0.34) = 500$` Hz.

(b) Open pipe: all harmonics, so the next is `$2f_1 = 1000$` Hz.

(c) Closed pipe: `$f_1 = v/4L = 340/1.36 = 250$` Hz, half the open value, an octave lower.

(d) Beats: two sources of nearly equal frequency produce a slow pulsing of loudness; no beats means perfectly in tune.

</details>

## Assertion and reason

13. **Assertion (A):** A closed organ pipe of length L has a fundamental frequency half that of an open pipe of the same length. **Reason (R):** The closed pipe has a node at one end and an antinode at the other, so L = λ/4 instead of λ/2.

<details><summary>Answer</summary>(a) Both true and R explains A: λ doubles for the same L, so f halves.</details>

14. **Assertion (A):** In a standing wave, all particles of the medium vibrate with the same amplitude. **Reason (R):** Energy is transmitted along the medium by a standing wave.

<details><summary>Answer</summary>(d) Both false. The amplitude varies from zero (nodes) to a maximum (antinodes), and a standing wave does not transmit energy along the string.</details>

15. **Assertion (A):** When a source of sound moves towards a stationary listener, the listener hears a higher pitch. **Reason (R):** The speed of sound in air increases when the source is moving.

<details><summary>Answer</summary>(c) A is true. R is false: the speed of sound depends only on the medium. The wavelength is shortened in front of the source.</details>

## Mix of questions from the bank

<div class="qbank" data-bank="ncert-class-11-physics" data-topics="waves" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- v = fλ; y = A sin(kx − ωt); v = √(T/μ) (string); v = √(γRT/M) (gas).
- Superposition: constructive at path difference nλ, destructive at (n + ½)λ.
- String and open pipe: f<sub>n</sub> = nv/2L; closed pipe: f = (2n − 1)v/4L.
- Beats: |f₁ − f₂|. Doppler: f′ = f(v ± v<sub>o</sub>)/(v ∓ v<sub>s</sub>).

</div>
