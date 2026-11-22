---
title: ADCs and DACs
summary: 'Data converters at GATE depth: weighted-resistor and R-2R ladder DACs, resolution, LSB and full scale, DAC errors (offset, gain, DNL, INL, monotonicity), sampling and the Nyquist rate, aliasing and sample-and-hold, quantisation error and the 6.02n + 1.76 dB rule, and the main ADC architectures: flash, successive approximation, counter ramp, dual slope and sigma-delta, with their conversion times.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: 'A 10-bit successive-approximation ADC is clocked at 2 MHz and takes one clock per bit. Its conversion time is'
    choices: ['5 µs', '512 µs', '0.5 µs', '1024 µs']
    ans: 0
    why: 'A SAR converter decides one bit per clock by binary search: 10 clocks of 0.5 µs = 5 µs, whatever the input. A counter-ramp ADC could need up to 2¹⁰ clocks.'
  - q: 'A 7 kHz sine is sampled at 10 kHz without an anti-alias filter. The reconstructed signal appears at'
    choices: ['3 kHz', '7 kHz', '17 kHz', '10 kHz']
    ans: 0
    why: 'Above f_s/2 = 5 kHz a frequency folds to |f − f_s| = 3 kHz. The samples fit a 3 kHz sine exactly as well as the 7 kHz one.'
  - q: 'How many comparators does a 6-bit flash ADC need?'
    choices: ['63', '64', '6', '32']
    ans: 0
    why: 'A flash converter compares the input with every one of the 2ⁿ − 1 thresholds at once: 63 comparators for 6 bits. That is why flash converters are fast but rarely exceed 8 bits.'
sources:
  - 'W. Kester (ed.), Data Conversion Handbook, Analog Devices (2005), chapters 2, 3 and 6'
  - 'P. Horowitz and W. Hill, The Art of Electronics, 3rd ed. (2015), chapter 13'
  - 'R. J. Tocci, N. S. Widmer and G. L. Moss, Digital Systems, 12th ed. (2017), chapter 11'
  - 'GATE Physics (PH) syllabus, Electronics section, published by the organising IIT each year'
---

**Module 9 · about 40 minutes.** A digital system meets the physical world through converters. A DAC is a weighted sum of reference currents, which uses the op-amp summer of [lesson 9.3](/learn/courses/gate-physics/op-amp-circuits/); most ADCs are a comparator, a DAC and the registers and counters of [lesson 9.6](/learn/courses/gate-physics/sequential-logic/) in a loop.

<div class="bigidea">An n-bit converter divides its full-scale range into 2ⁿ steps of one LSB. Two separate approximations happen when a signal is digitised: sampling in time, which is exact if the signal has no frequencies above half the sampling rate, and rounding in amplitude, which always loses information and adds noise of power LSB²/12. Each extra bit buys 6 dB of signal-to-noise ratio.</div>

## 1. Digital-to-analogue converters

For an `$n$`-bit code `$D = b_{n-1}2^{n-1} + \cdots + b_0$` and reference `$V_{ref}$`:

Set the bits of an R-2R ladder and see the output voltage.

<figure class="fig" data-fig="@sx-dac-ladder"><figcaption>Each bit adds V<sub>ref</sub>/2, /4, /8, /16. The staircase of all sixteen outputs shows why a counter gives a ramp.</figcaption></figure>

```math
V_{out} = V_{ref}\frac D{2^n}, \qquad 1\ \text{LSB} = \frac{V_{ref}}{2^n}, \qquad V_{FS} = V_{ref}\frac{2^n - 1}{2^n}
```

**Weighted-resistor DAC.** Bit `$k$` switches a resistor `$2^{n-1-k}R$` into the virtual ground of an inverting summer (the MSB gets `$R$`). Simple, but an 8-bit design needs resistors spanning a ratio of 128, each accurate to better than half an LSB, which is impractical.

**R-2R ladder.** Only two values. At every node the current meets two paths of `$2R$` each: the switched `$2R$` leg, and the rest of the ladder, which is a series `$R$` followed by an equivalent `$R$` (two `$2R$` in parallel). So the current halves at every node: the MSB branch carries `$V_{ref}/2R$`, the next `$V_{ref}/4R$`, and so on. Into a summer with feedback `$R$`, the output is `$-V_{ref}D/2^n$`.

**Worked example.** An 8-bit DAC with `$V_{ref} = 5$` V: 1 LSB = 19.5 mV, full scale 4.980 V. The code 10110100 = 180 gives `$5\times180/256 = 3.516$` V.

<div class="problem" data-problem="r2r-output"></div>

<div class="meaning">

<dl>
<dt>resolution</dt><dd>1 LSB, often quoted as a percentage of full scale: `$1/(2^n - 1)$`, 0.39% for 8 bits</dd>
<dt>offset and gain errors</dt><dd>a shift and a slope error of the whole transfer line; trimmed out by calibration</dd>
<dt>DNL</dt><dd>differential non-linearity: how far each step differs from 1 LSB. If any step is negative (DNL &lt; −1 LSB) the DAC is **non-monotonic**: a larger code gives a smaller output, which is fatal inside a feedback loop</dd>
<dt>INL</dt><dd>integral non-linearity: the largest distance of the transfer curve from a straight line</dd>
<dt>settling time</dt><dd>time to come within ±½ LSB of the final value after a code change; the worst case is the mid-scale transition 0111… → 1000…, where every bit switches</dd>
</dl>

</div>

## 2. Sampling and quantisation

**Sampling.** A signal with no frequency content above `$f_{max}$` is fully determined by samples taken at `$f_s > 2f_{max}$` (Nyquist-Shannon). A frequency `$f$` above `$f_s/2$` produces exactly the same samples as its **alias** at `$|f - kf_s|$`, folded into `$0$` to `$f_s/2$`. Once sampled, an alias cannot be told apart from a real signal, so the analogue **anti-alias filter** must remove it before the converter. A **sample-and-hold** freezes the input while the conversion runs; without it, a signal that moves by more than 1 LSB during the conversion is converted wrongly.

**Quantisation.** Rounding to the nearest level leaves an error between `$-q/2$` and `$+q/2$`. For a busy signal this error is roughly uniform, with mean-square value

```math
\overline{e^2} = \frac1q\int_{-q/2}^{q/2}e^2\,de = \frac{q^2}{12}, \qquad \text{SQNR} = \frac{A^2/2}{q^2/12} \ \text{ with } \ q = \frac{2A}{2^n} \ \Rightarrow\ \text{SQNR} = 6.02n + 1.76\ \text{dB}
```

for a full-scale sine of amplitude `$A$`. A 12-bit converter gives at most 74.0 dB, a 16-bit one 98.1 dB. A signal at one tenth of full scale loses 20 dB. Real converters add noise and distortion, and their **effective number of bits** is ENOB = (SINAD − 1.76)/6.02 from the measured signal-to-noise-and-distortion ratio.

<figure class="fig" data-fig="adc-quantisation"><figcaption>A sine (grey), its samples (dots) and the n-bit staircase a converter reports (blue), with the quantisation error below, which stays within ±½ LSB. The readout compares the measured SQNR with the 6.02n + 1.76 dB rule, which fails for very few bits, where the error is far from uniform. Drop below two samples per cycle and the dashed alias appears.</figcaption></figure>

**Worked example.** A 7 kHz tone sampled at 10 kHz aliases to 3 kHz; sampled at 6 kHz it aliases to `$|7 - 6| = 1$` kHz. To digitise audio up to 20 kHz at 44.1 kHz, the anti-alias filter has only the band from 20 to 22.05 kHz to fall by roughly 96 dB, which is why audio converters oversample and filter digitally instead.

<div class="problem" data-problem="sqnr-bits"></div>

## 3. ADC architectures

| Type | How it works | Conversion time | Typical use |
|---|---|---|---|
| flash | `$2^n - 1$` comparators against a resistor ladder, then an encoder | one clock | GHz rates, up to ~8 bits |
| successive approximation (SAR) | binary search with a DAC and one comparator | `$n$` clocks | 8 to 18 bits, up to MHz |
| counter ramp | counter drives a DAC until it passes the input | up to `$2^n$` clocks | simple, slow |
| tracking | up/down counter follows the input | one step per clock once locked | slowly varying inputs |
| dual slope (integrating) | integrate the input for a fixed time, then a reference down to zero | `$2^{n+1}$` clocks or more | multimeters, high accuracy |
| sigma-delta | 1-bit converter at a very high rate in a feedback loop, then digital filtering | many clocks per output | audio, sensors, 16 to 24 bits |

**Successive approximation.** Try the MSB: set it to 1, compare the DAC output with the input, keep it if the DAC is below, clear it otherwise; then the next bit. A 4-bit SAR with a 0 to 8 V range (LSB = 0.5 V) converting 5.3 V tries 1000 (4 V, keep), 1100 (6 V, clear), 1010 (5 V, keep), 1011 (5.5 V, clear): the result is 1010 = 5.0 V, the input truncated to a whole LSB. (Adding half an LSB of offset to the DAC makes it round instead.)

Step through a successive-approximation conversion: it is a binary search.

<div class="steps" data-fig="@sx-sar-adc">
<div class="step"><b>Start.</b> All bits 0. The input voltage is held steady.</div>
<div class="step"><b>Top bit.</b> Try half of full scale and compare.</div>
<div class="step"><b>Next bit.</b> Keep or drop the previous bit, then try the next one down.</div>
<div class="step"><b>Continue.</b> Each comparison halves the remaining range.</div>
<div class="step"><b>Done.</b> n bits need n comparisons; the result is within one LSB of the input.</div>
</div>

**Dual slope.** Integrate `$V_{in}$` for a fixed time `$T_1$` (a fixed count), then integrate `$-V_{ref}$` until the integrator returns to zero, which takes `$T_2$`:

```math
\frac{V_{in}T_1}{RC} = \frac{V_{ref}T_2}{RC} \quad\Rightarrow\quad V_{in} = V_{ref}\frac{T_2}{T_1}
```

`$R$`, `$C$` and the clock frequency cancel, so only `$V_{ref}$` must be accurate. With `$T_1$` equal to a whole number of mains periods (20 ms at 50 Hz), hum integrates to zero. With a 100 kHz clock, `$T_1 = 2000$` counts and `$V_{ref} = 2$` V, an input of 1.234 V takes 1234 counts to discharge: the count reads directly in millivolts.

**Sigma-delta.** Oversampling by a ratio `$M$` spreads the quantisation noise over a band `$M$` times wider than the signal, and filtering keeps only the signal band: plain oversampling gains half a bit per doubling of `$M$`. The feedback loop also pushes the noise towards high frequencies (noise shaping), so a first-order modulator gains 1.5 bits per doubling, which is how a 1-bit comparator yields 24-bit audio.

<div class="myth">

**"Sampling at twice the highest frequency of interest is enough."** The Nyquist condition concerns the highest frequency present at the converter input, not the highest one you care about. Noise or interference above `$f_s/2$` folds down on top of the wanted band and cannot be removed afterwards. And exactly `$2f_{max}$` is not enough: a sine sampled at exactly twice its frequency can land on its zero crossings every time.

</div>

<div class="keypoints">

- 1 LSB = `$V_{ref}/2^n$`; `$V_{out} = V_{ref}D/2^n$`; full scale is one LSB below `$V_{ref}$`.
- R-2R ladder: two resistor values, current halves at each node; weighted resistors need a `$2^{n-1}$` spread.
- Non-monotonic if DNL &lt; −1 LSB; settling is worst at mid-scale.
- Nyquist `$f_s > 2f_{max}$`; aliases at `$|f - kf_s|$`; filter before sampling.
- Quantisation noise `$q^2/12$`; SQNR = 6.02n + 1.76 dB (full-scale sine).
- Flash `$2^n - 1$` comparators, one clock; SAR `$n$` clocks; ramp up to `$2^n$`; dual slope `$V_{in} = V_{ref}T_2/T_1$`.

</div>

## Practise: exam questions on this lesson

<div class="qbank" data-bank="physics" data-topics="adc-dac" data-exam="gate" data-n="10"></div>

**Next:** that completes the electronics module. [Lesson 10.1](/learn/courses/gate-physics/gate-exam-pattern/) explains the GATE PH paper itself: sections, marking and timing.

**Going on to CSIR NET?** [Noise, filtering and lock-in detection](/learn/courses/csir-net-physics/noise-lock-in/) covers aliasing and sizing an ADC against the noise.
