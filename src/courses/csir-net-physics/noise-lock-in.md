---
title: Noise, filtering and lock-in detection
summary: 'Where noise comes from and how to beat it: Johnson, shot and 1/f noise, spectral density and noise-equivalent bandwidth, kT/C noise, decibels, noise figure and the Friis formula, RC filters, sampling, aliasing and ADC quantisation, signal averaging, boxcar integrators and the lock-in amplifier (mixing, phase, X/Y/R, time constant, square-wave references and dynamic reserve).'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'What is the rms Johnson noise of a 1 MΩ resistor at 300 K in a 10 kHz bandwidth?'
    choices: ['12.9 μV', '1.29 μV', '129 μV', '4.1 μV']
    ans: 0
    why: 'v = √(4k_BTRB) = √(4 × 1.381×10⁻²³ × 300 × 10⁶ × 10⁴) = 12.9 μV.'
  - q: 'A signal V cos(ωt + φ) is multiplied by cos ωt and averaged. What is the result?'
    choices: ['(V/2) cos φ', 'V cos φ', 'V sin φ', '(V/2) sin φ']
    ans: 0
    why: 'cos(ωt + φ) cos ωt = ½[cos φ + cos(2ωt + φ)], and the 2ω term averages to zero.'
  - q: 'Averaging 100 sweeps of a repetitive signal in white noise improves the signal-to-noise ratio by'
    choices: ['10', '100', '50', '√10']
    ans: 0
    why: 'The signal adds as N and uncorrelated noise as √N, so the amplitude SNR grows as √N = 10.'
sources:
  - 'P. Horowitz and W. Hill, The Art of Electronics, 3rd ed. (2015), chapters 8 and 15'
  - 'J. H. Moore, C. C. Davis, M. A. Coplan and S. C. Greer, Building Scientific Apparatus, 4th ed. (2009), chapter 6'
  - 'C. D. Motchenbacher and J. A. Connelly, Low-Noise Electronic System Design (1993), chapters 1 to 3'
  - 'Stanford Research Systems, About Lock-In Amplifiers, Application Note 3 (open access)'
  - 'CSIR-UGC NET Physical Sciences syllabus, Part C unit on experimental techniques (noise, signal recovery)'
---

**Module 7 · about 55 minutes.** By the end you will be able to compute Johnson, shot and kT/C noise, convert between noise densities and rms noise with the right bandwidth, use decibels, noise figures and the Friis formula, design an RC filter, avoid aliasing and size an ADC, decide how many sweeps to average, and explain exactly what a lock-in amplifier does and why chopping helps. For filter circuits and amplifiers see the JAM lessons on [AC circuits](/learn/courses/iit-jam-physics/circuits/) and [op-amps](/learn/courses/iit-jam-physics/op-amps/).

<div class="bigidea">Noise is spread over frequency; a signal usually is not. Every technique in this lesson, from an RC filter to a lock-in amplifier, wins the same way: accept only the narrow band of frequencies where the signal lives, because the noise you collect grows only as the square root of the bandwidth.</div>

## 1. The three fundamental noises

Noise is described by its **spectral density**: `$S_v(f)$` in V²/Hz, or its square root in V/√Hz. The rms noise in a band is

```math
v_{rms} = \sqrt{\int S_v(f)\,df} \;=\; \sqrt{S_v B} \quad\text{(white noise, bandwidth } B)
```

- **Johnson-Nyquist noise.** Any resistance at temperature `$T$`: `$S_v = 4k_BTR$`. A 1 kΩ resistor at 300 K gives 4.1 nV/√Hz. It needs no current and is set only by `$T$`, `$R$` and `$B$`. The available noise power into a matched load is `$k_BTB$`: −174 dBm per hertz at 290 K.
- **Shot noise.** Current made of independent charges crossing a barrier (a junction, a vacuum gap): `$S_i = 2eI$`. 1 mA carries 17.9 pA/√Hz. The signal-to-noise ratio of a shot-noise-limited current grows as `$\sqrt I$`.
- **1/f (flicker) noise.** Density `$\propto 1/f$`, equal power per decade, from slow fluctuations in materials and contacts. It dominates below the **corner frequency** where it meets the white floor: `$S(f) = S_w(1 + f_c/f)$`.

**kT/C noise.** A resistor across a capacitor: the density `$4k_BTR$` filtered by the RC (noise bandwidth `$1/4RC$`) gives `$\overline{v^2} = k_BT/C$`, independent of `$R$`, as equipartition (`$\tfrac12C\overline{v^2} = \tfrac12k_BT$`) demands. 1 pF at 300 K: 64 μV. It sets the floor of sample-and-hold circuits and CCD pixels.

**Worked example.** A photodiode feeds a 1 MΩ load at 300 K. When is it shot-noise limited? Shot noise `$2eI$` equals the load's Johnson current noise `$4k_BT/R$` when `$I = 2k_BT/(eR) = 2\times0.0259/10^6 = 52$` nA. Above that, the detector's own photon statistics dominate.

<div class="problem" data-problem="johnson-noise"></div>

<div class="meaning">

<dl>
<dt>V/√Hz</dt><dd>noise per root hertz: multiply by the square root of the bandwidth to get volts rms</dd>
<dt>noise-equivalent bandwidth</dt><dd>the width of an ideal rectangular filter that passes the same white-noise power as the real one</dd>
<dt>corner frequency</dt><dd>where 1/f noise and white noise are equal; work above it</dd>
<dt>noise figure</dt><dd>how much an amplifier degrades the signal-to-noise ratio, F = SNR_in/SNR_out, often in dB</dd>
</dl>

</div>

<figure class="fig" data-fig="noise-spectrum"><figcaption>Noise density with a 1/f corner. A DC measurement collects the large low-frequency noise; a lock-in at the chopping frequency collects only the shaded band. Move the chopping frequency above the corner and narrow the bandwidth to see the rms noise fall.</figcaption></figure>

## 2. Filters, bandwidth and decibels

A first-order RC low-pass has `$|H| = 1/\sqrt{1 + (f/f_c)^2}$` with `$f_c = 1/(2\pi RC)$`: −3 dB at `$f_c$`, then −20 dB per decade (6 dB per octave), with a phase lag `$\tan^{-1}(f/f_c)$`. Its **noise-equivalent bandwidth** is

```math
B_{eq} = \int_0^\infty |H|^2 df = \frac{\pi}{2}f_c = \frac{1}{4RC}, \qquad \text{two identical sections: } \frac{1}{8RC}
```

Decibels: `$10\log_{10}$` for power ratios, `$20\log_{10}$` for voltage ratios. A noise figure of 3 dB means `$F = 2$`, an equivalent input noise temperature `$T_e = (F - 1)290 = 290$` K. For a chain of amplifiers (powers as ratios),

```math
F = F_1 + \frac{F_2 - 1}{G_1} + \frac{F_3 - 1}{G_1G_2} + \dots
```

so the first stage decides: a low-noise preamplifier with 20 dB gain makes the next stage's noise a hundred times less important.

**Sampling.** Sample faster than twice the highest frequency present (Nyquist), or frequencies above `$f_s/2$` fold back to `$|f - kf_s|$` (aliasing); an analogue low-pass filter goes before the ADC. An ideal `$N$`-bit ADC has quantisation noise `$\Delta/\sqrt{12}$` and a full-scale sine-wave SNR of `$6.02N + 1.76$` dB: 74 dB for 12 bits.

## 3. Averaging

A repetitive signal (triggered by the experiment) averaged over `$N$` sweeps adds coherently (`$\propto N$`) while uncorrelated noise adds in quadrature (`$\propto\sqrt N$`):

Average more and more sweeps and measure the signal-to-noise ratio.

<figure class="fig" data-fig="@sx-signal-average"><figcaption>Averaging N sweeps improves the SNR by √N. Compare it with a lock-in, which narrows the bandwidth instead.</figcaption></figure>

```math
\text{SNR}_N = \sqrt N\,\text{SNR}_1
```

Going from SNR 0.5 to 20 needs `$(40)^2 = 1600$` sweeps. A **boxcar integrator** does this for short pulses: it opens a gate only while the pulse is there (rejecting the noise between pulses), then averages many pulses.

## 4. The lock-in amplifier

Make the signal periodic at a reference frequency `$f_r$` (chop the light, modulate the field or the current), well above the 1/f corner. The lock-in multiplies the input by the reference and low-pass filters the product:

<div class="steps">
<div class="step"><p><b>Mix.</b> Input V_s cos(ωt + φ) plus noise, times reference cos ωt, gives ½V_s cos φ + ½V_s cos(2ωt + φ) + (noise × reference).</p></div>
<div class="step"><p><b>Shift.</b> Mixing moves every input component at f_r + Δf to Δf (and 2f_r + Δf). The signal lands at zero frequency; noise at other frequencies lands elsewhere.</p></div>
<div class="step"><p><b>Filter.</b> An RC filter of time constant τ keeps only |Δf| ≲ 1/(4τ): the output is ½V_s cos φ with the noise of a band only 1/(4τ) wide, centred on f_r.</p></div>
</div>

```math
X = \tfrac12V_s\cos\phi, \quad Y = \tfrac12V_s\sin\phi, \qquad R = \sqrt{X^2 + Y^2}, \quad \phi = \tan^{-1}(Y/X)
```

(Commercial lock-ins display rms values, `$X = V_{rms}\cos\phi$`.) A dual-phase lock-in uses a second reference shifted by 90° to give `$Y$`, so the magnitude does not depend on getting the phase right. A component at `$f_r + \Delta f$` comes through attenuated by `$1/\sqrt{1 + (2\pi\Delta f\tau)^2}$`; a longer `$\tau$` rejects more but settles more slowly (about `$5\tau$`).

**Worked example.** A 1 μV signal sits in 1 μV/√Hz of white noise across a 100 kHz amplifier: broadband SNR = `$1/316$`. A lock-in with `$\tau = 1$` s has `$B_{eq} = 0.25$` Hz, so the output noise is 0.5 μV and the SNR is 2, a gain of `$\sqrt{10^5/0.25} \approx 630$`.

<div class="problem" data-problem="lockin-snr"></div>

<figure class="fig" data-fig="lock-in-average"><figcaption>A lock-in at work. The input (top) is a sine buried in noise; multiplied by the reference (middle) it is still a mess, but its average is (V_s/2) cos φ. The low-pass output (bottom) settles towards the dashed line, with fluctuations that shrink as the time constant grows. Try φ = 90°: the in-phase output goes to zero.</figcaption></figure>

**Two details NET likes.** A square-wave (switching) demodulator multiplies by `$\tfrac4\pi(\sin\omega t + \tfrac13\sin3\omega t + \dots)$`, so it also responds to odd harmonics of the reference, weighted `$1/n$`; a square-wave signal read with a sine reference gives `$2V/\pi$` (its fundamental, `$4V/\pi$`, times ½). **Dynamic reserve** is how much larger than full scale the interference can be without overloading: 1 mV of noise on a 1 μV range is 60 dB.

<div class="myth">

**"A lock-in removes all the noise."** It removes the noise outside its narrow band. The noise inside the band, at the reference frequency, stays; that is why you chop where the noise density is lowest and wait long enough.

**"Use the −3 dB frequency as the noise bandwidth."** For a single RC section the noise bandwidth is π/2 times larger, 1/(4RC); for two sections 1/(8RC). Using f_c underestimates the noise.

</div>

<div class="keypoints">

- Johnson `$4k_BTR$` (V²/Hz); shot `$2eI$` (A²/Hz); 1/f with corner `$f_c$`; kT/C noise `$\sqrt{k_BT/C}$`, independent of R.
- rms noise = density × √(bandwidth); RC noise bandwidth `$1/4RC$` (two sections `$1/8RC$`).
- dB: 10 log for power, 20 log for voltage; `$T_e = (F - 1)290$` K; Friis: the first stage dominates.
- Nyquist `$f_s > 2f_{max}$`; aliases at `$|f - kf_s|$`; ADC SNR `$6.02N + 1.76$` dB.
- Averaging: SNR ∝ √N. Lock-in: output `$\tfrac12V_s\cos\phi$`, bandwidth `$1/4\tau$`, R and φ from X and Y; square-wave references see odd harmonics as 1/n.

</div>

## Practise: exam questions on this lesson

NET Part C style, with full solutions. More on the [CSIR NET practice page](/learn/courses/csir-net-physics/practice/). The [Analog filter designer](/science/filter-designer/) and the [Fourier visualiser](/science/fourier-visualiser/) let you see filters and harmonics at work.

<div class="qbank" data-bank="physics" data-topics="noise-lock-in" data-exam="net" data-n="10"></div>

**End of Module 7.** Go back to [lesson 7.2](/learn/courses/csir-net-physics/errors-data-fitting/) to analyse the data your lock-in produces, or practise the whole module with the [experimental methods questions](/learn/courses/csir-net-physics/practice/).

**Next:** module 8 begins with the [atomic and molecular physics roadmap](/learn/courses/csir-net-physics/atomic-roadmap/).
