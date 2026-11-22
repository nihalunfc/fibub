---
title: 'Waves and sound: question types and traps'
seoTitle: 'Waves and sound questions for JEE and NEET'
summary: 'Every way entrance exams ask about waves: reading wave equations, speeds on strings and in gases, intensity and decibels, interference, standing waves on strings, open and closed pipes, resonance tubes and end correction, beats with loading and filing, and the Doppler effect with wind and echoes, each with a method and its trap.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'y = 0.02 sin(4πx − 200πt) (SI units). The wave speed is:'
    choices: ['50 m/s', '100 m/s', '200 m/s', '0.02 m/s']
    ans: 0
    why: 'v = ω/k = 200π/4π = 50 m/s. It travels in +x because x and t have opposite signs.'
  - q: 'A sound level rises from 40 dB to 60 dB. The intensity becomes:'
    choices: ['1.5 times', '20 times', '100 times', '2 times']
    ans: 2
    why: 'Each 10 dB is a factor of 10 in intensity; 20 dB is 10 × 10 = 100.'
  - q: 'A closed pipe has fundamental 200 Hz. Which of these can it also produce?'
    choices: ['400 Hz', '600 Hz', '800 Hz', '300 Hz']
    ans: 1
    why: 'Closed pipes have only odd harmonics: 200, 600, 1000 Hz, and so on.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Waves; question patterns studied from the exams'' published papers (no questions copied)'
---

**Physics · Class 11 · about 30 minutes.** Read the lesson [Waves and sound](/learn/courses/engineering-entrance/waves/) first. Here you meet every question type, with a worked example and the trap, then practise.

<div class="bigidea">Waves questions test four skills: reading an equation (k, ω and the direction), fitting waves to boundaries (strings and pipes), adding waves (interference and beats), and moving frames (Doppler). Sketch the nodes and antinodes before doing any algebra.</div>

## The ten question types

<div class="steps" data-ms="9000">
<div class="step"><b>1. Read a wave equation.</b> A, k, ω, v = ω/k, direction from the signs. <i>Trap:</i> confusing the maximum particle speed Aω with the wave speed.</div>
<div class="step"><b>2. Wave speed.</b> √(T/μ) on strings, √(γRT/M) in gases. <i>Trap:</i> using √(RT/M) (Newton's value) or forgetting that pressure alone does not change v.</div>
<div class="step"><b>3. Intensity and decibels.</b> I ∝ A²f², ∝ 1/r²; Δβ = 10 log(I₂/I₁). <i>Trap:</i> adding decibels directly for two sources.</div>
<div class="step"><b>4. Interference.</b> Path difference → phase difference → resultant amplitude; I_max/I_min ratios.</div>
<div class="step"><b>5. Standing waves on strings.</b> f = nv/2L; sonometer laws; a string with a hanging block in a liquid has less tension.</div>
<div class="step"><b>6. Pipes.</b> Open nv/2L, closed odd harmonics. <i>Trap:</i> calling the closed pipe's 3v/4L the "second harmonic" (it is the third harmonic, the first overtone).</div>
<div class="step"><b>7. Resonance tubes and end correction.</b> v = 2f(L₂ − L₁); e = (L₂ − 3L₁)/2. <i>Trap:</i> using v = 4fL₁ without end correction.</div>
<div class="step"><b>8. Beats.</b> |f₁ − f₂|; wax lowers a fork's frequency, filing raises it. Decide the sign of the unknown from the change in beat rate.</div>
<div class="step"><b>9. Doppler effect.</b> f(v + v_o)/(v − v_s); signs positive towards. <i>Trap:</i> wind changes v, but a moving medium with no relative motion gives no shift.</div>
<div class="step"><b>10. Doppler with echoes and beats.</b> Reflection: wall as listener, then as source. Beats between direct and reflected sound.</div>
</div>

## Worked examples

**Example 1 (level 3, beats with wax).** A fork A gives 5 beats per second with a 256 Hz fork. When A is loaded with wax, the beats fall to 3 per second. Find A's frequency.

*Solution.* A is 251 or 261 Hz. Wax lowers A's frequency. If A were 251, lowering it would increase the beats; if 261, lowering it towards 256 reduces them. So **A = 261 Hz**.

**Example 2 (level 3, resonance tube).** With a 512 Hz fork, resonance occurs at 15.5 cm and 48.5 cm. Find the speed of sound and the end correction.

*Solution.* λ/2 = 33 cm, so λ = 66 cm and **v = 512 × 0.66 ≈ 338 m/s**. First resonance: L₁ + e = λ/4 = 16.5 cm, so **e = 1.0 cm**.

**Example 3 (level 4, pipe and string in unison).** A 1 m string of mass 10 g, under tension, is in unison with a closed pipe of length 85 cm sounding its fundamental. The string vibrates in its fundamental. Find the tension. (v_sound = 340 m/s)

*Solution.* Pipe: f = 340/(4 × 0.85) = 100 Hz. String: `$100 = \dfrac{1}{2}\sqrt{\dfrac{T}{0.01}}$`, so `$\sqrt{T/0.01} = 200$` and **T = 400 N**.

**Example 4 (level 5, Doppler echo and beats).** A car moving at 20 m/s towards a wall sounds a 500 Hz horn. The driver hears both the horn and its echo. How many beats per second? (v = 340 m/s)

*Solution.* The echo reaching the driver: `$f'' = 500\,\dfrac{340 + 20}{340 - 20} = 500 \times \dfrac{360}{320}$` = 562.5 Hz. The driver hears his own horn at 500 Hz (no relative motion). **Beats = 62.5 per second.**

<div class="myth">

**"Two 60 dB sources together make 120 dB."** Intensities add, not decibels. Two equal sources double the intensity, adding only 3 dB: 63 dB in all.

</div>

<div class="meaning">
<dl>
<dt>Boundary rule</dt><dd>fixed string end and closed pipe end: node; open pipe end: antinode (displacement)</dd>
<dt>Overtone vs harmonic</dt><dd>overtones count the notes above the fundamental; harmonics count multiples of it. For a closed pipe, first overtone = 3rd harmonic.</dd>
<dt>Physical meaning</dt><dd>The Doppler shift comes from motion relative to the air: a moving source squeezes the wavelength; a moving listener meets the crests more often.</dd>
</dl>
</div>

## Practise

The set climbs from level 1 to level 5 and includes numericals, assertion-reason, statements, matching lists, multi-correct and passage questions. Templates give new numbers each time.

<div class="qbank" data-bank="entrance-physics" data-topics="waves" data-mode="practice"></div>

<div class="keypoints">

- Ten types: wave equation, speed, decibels, interference, strings, pipes, resonance tubes, beats, Doppler, echoes.
- Wax lowers, filing raises a fork's frequency; check which way the beats change.
- Resonance tube: λ/2 = L₂ − L₁; end correction from the first length.
- Closed pipe: odd harmonics; its first overtone is the 3rd harmonic.
- Echo from a wall: f(v + u)/(v − u); decibels never add directly.

</div>
