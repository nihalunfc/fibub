---
title: Op-amp circuits
summary: 'Op-amp circuits at GATE depth: the two golden rules and the noise gain, inverting, non-inverting, summing, difference and instrumentation amplifiers, integrators, differentiators and active filters, real limits (gain-bandwidth product, slew rate, offset voltage and bias currents), and non-linear circuits: comparators, Schmitt triggers, precision rectifiers, log amplifiers and the astable multivibrator.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'An op-amp with a gain-bandwidth product of 2 MHz is used as an inverting amplifier with gain −9. Its closed-loop bandwidth is about'
    choices: ['200 kHz', '222 kHz', '2 MHz', '18 MHz']
    ans: 0
    why: 'The bandwidth is GBW divided by the noise gain 1 + R_f/R_in = 10, not by the signal gain 9: 2 MHz/10 = 200 kHz.'
  - q: 'An op-amp with slew rate 1 V/µs must deliver an undistorted sine of 5 V peak. The highest frequency it can reproduce is about'
    choices: ['32 kHz', '200 kHz', '64 kHz', '1 MHz']
    ans: 0
    why: 'The steepest slope of V_p sin ωt is ωV_p. Setting 2πfV_p = SR gives f = 10⁶/(2π × 5) ≈ 32 kHz.'
  - q: 'In an inverting Schmitt trigger with ±10 V output and feedback divider R₁ = 1 kΩ (to ground), R₂ = 9 kΩ (to the output), the hysteresis width is'
    choices: ['2 V', '1 V', '20 V', '0.2 V']
    ans: 0
    why: 'The thresholds are ±V_sat R₁/(R₁ + R₂) = ±1 V, so the width is 2 V.'
sources:
  - 'A. S. Sedra and K. C. Smith, Microelectronic Circuits, 7th ed. (2015), chapters 2 and 17'
  - 'P. Horowitz and W. Hill, The Art of Electronics, 3rd ed. (2015), chapters 4 and 5'
  - 'S. Franco, Design with Operational Amplifiers and Analog Integrated Circuits, 4th ed. (2015), chapters 1 to 6'
  - 'GATE Physics (PH) syllabus, Electronics section, published by the organising IIT each year'
---

**Module 9 · about 45 minutes.** The JAM [op-amps lesson](/learn/courses/iit-jam-physics/op-amps/) covers the standard amplifiers. GATE adds the non-ideal limits and the non-linear circuits, and expects you to see each one as the feedback system of [lesson 9.2](/learn/courses/gate-physics/amplifiers-feedback/) with a huge forward gain.

<div class="bigidea">With negative feedback and a very large gain, the op-amp does whatever it must at its output to make its two inputs equal. Every linear circuit follows from that and from "no current into the inputs". Remove the negative feedback, or add positive feedback, and the same chip becomes a comparator, a memory (Schmitt trigger) or an oscillator.</div>

## 1. Linear circuits

**The golden rules** (ideal op-amp, negative feedback, output not saturated): `$V_+ = V_-$`, and no current flows into either input. Write KCL at the inverting input and the gain drops out.

See the outputs of the linear circuits for different input shapes.

<figure class="fig" data-fig="@sx-opamp-waves"><figcaption>Inverting and non-inverting gain, the integrator (−1/RC ∫V<sub>in</sub> dt) and the differentiator (−RC dV<sub>in</sub>/dt) with live waveforms and rail clipping.</figcaption></figure>

| Circuit | Output | Input resistance |
|---|---|---|
| inverting | `$-\dfrac{R_f}{R_1}V_{in}$` | `$R_1$` |
| non-inverting | `$\left(1 + \dfrac{R_f}{R_1}\right)V_{in}$` | very high |
| summing (inverting) | `$-R_f\left(\dfrac{V_1}{R_1} + \dfrac{V_2}{R_2} + \cdots\right)$` | `$R_k$` for input `$k$` |
| difference (matched ratio `$R_2/R_1$`) | `$\dfrac{R_2}{R_1}(V_2 - V_1)$` | unequal at the two inputs |
| instrumentation (three op-amps) | `$\left(1 + \dfrac{2R}{R_G}\right)\dfrac{R_3}{R_2}(V_2 - V_1)$` | very high at both |
| integrator | `$-\dfrac1{RC}\displaystyle\int V_{in}\,dt$` | `$R$` |
| differentiator | `$-RC\,\dfrac{dV_{in}}{dt}$` | falls with frequency |

**Worked examples.** A difference amplifier with `$R_1 = 10$` kΩ, `$R_2 = 100$` kΩ gives `$10(V_2 - V_1)$`; a 1% mismatch in one resistor lets a common-mode signal through with gain of order `$0.01\times R_2/(R_1 + R_2) \approx 0.009$`, so CMRR is only about 60 dB. That is why the instrumentation amplifier, whose gain is set by one resistor `$R_G$` and whose first stage passes common-mode signals at unity gain, is used for small differential signals. An integrator with `$R = 10$` kΩ and `$C = 0.1$` µF fed a 1 V step ramps at −1000 V/s and reaches −10 V after 10 ms. A real integrator needs a large resistor across `$C$`, or its own offset ramps it into saturation.

**Active filters.** A resistor `$R_f$` in parallel with `$C$` in the feedback path of an inverting amplifier makes a first-order low-pass with DC gain `$-R_f/R_1$` and corner `$1/2\pi R_fC$`. Second-order sections such as the **Sallen-Key** low-pass place the poles anywhere: with equal resistors `$R$` and capacitors `$C$` and amplifier gain `$K$`, `$\omega_0 = 1/RC$` and `$Q = 1/(3 - K)$`. At `$K = 3$` the poles reach the imaginary axis: the same condition as the Wien oscillator of [lesson 9.4](/learn/courses/gate-physics/oscillators/).

## 2. Real op-amps

<div class="meaning">

<dl>
<dt>noise gain `$1 + R_f/R_1$`</dt><dd>the gain `$1/\beta$` seen by the loop; it sets bandwidth, offset errors and stability, whatever the signal gain is (the inverting amplifier's signal gain is `$-R_f/R_1$`, one less in size)</dd>
<dt>gain-bandwidth product</dt><dd>an internally compensated op-amp has one dominant pole, so closed-loop bandwidth = GBW/(noise gain)</dd>
<dt>slew rate SR</dt><dd>the largest `$dV_{out}/dt$` the output can manage (a fixed current charging the compensation capacitor); full-power bandwidth `$f_p = \text{SR}/2\pi V_p$`</dd>
<dt>input offset voltage `$V_{os}$`</dt><dd>a small voltage in series with one input; appears at the output multiplied by the noise gain</dd>
<dt>bias current `$I_B$`</dt><dd>flows into each input; through `$R_f$` it makes an error `$I_BR_f$`, cancelled to first order by putting `$R_1\parallel R_f$` in series with the + input, leaving only the offset current `$I_{os}R_f$`</dd>
</dl>

</div>

**Worked example.** An op-amp with GBW = 1 MHz, SR = 0.5 V/µs and `$V_{os} = 2$` mV is used as a non-inverting amplifier of gain 101. Bandwidth: 1 MHz/101 ≈ 9.9 kHz. Output offset: 2 mV × 101 = 0.20 V. Full-power bandwidth at 10 V peak: `$0.5\times10^6/(2\pi\times10) = 8.0$` kHz. Above that a sine output turns into a triangle, whatever the small-signal bandwidth says.

## 3. Non-linear circuits

**Comparator.** No feedback: the output saturates at `$+V_{sat}$` when `$V_+ > V_-$` and at `$-V_{sat}$` otherwise. A noisy input near the threshold makes it chatter.

**Schmitt trigger.** Positive feedback through a divider gives two thresholds. For the inverting form (input on −, divider `$R_1$` to a reference, `$R_2$` to the output):

```math
V_{T\pm} = \frac{V_{ref}R_2 \pm V_{sat}R_1}{R_1 + R_2}, \qquad \Delta V_H = \frac{2V_{sat}R_1}{R_1 + R_2}
```

The output remembers which threshold it last crossed: the circuit has two stable states, and noise smaller than `$\Delta V_H$` cannot make it chatter.

<div class="problem" data-problem="schmitt-thresholds"></div>

**Precision rectifier (super-diode).** A diode inside the feedback loop: the op-amp raises its output by one diode drop more than needed, so the circuit rectifies millivolt signals that an ordinary diode would ignore. Adding a second stage gives a precision full-wave rectifier (absolute-value circuit).

**Log and antilog amplifiers.** A diode or transistor in the feedback path of an inverting amplifier:

```math
V_{out} = -V_T\ln\frac{V_{in}}{RI_s}
```

Each decade of input changes the output by `$V_T\ln10 = 59.5$` mV at 300 K. Swap the diode and the resistor for an exponential (antilog) amplifier; log, add and antilog to multiply. `$I_s$` and `$V_T$` both depend on temperature, so real log amps use matched pairs.

<figure class="fig" data-fig="opamp-picker"><figcaption>Transfer curves V_out against V_in for six op-amp circuits with the output limited at ±12 V. Choose the Schmitt trigger and sweep the input up and down to trace its hysteresis loop; choose the log amplifier to see a straight line on a logarithmic input axis.</figcaption></figure>

**Astable multivibrator.** A Schmitt trigger whose own output charges a capacitor on its inverting input through `$R$`. The capacitor swings between `$\pm\beta V_{sat}$` with `$\beta = R_1/(R_1 + R_2)$`, and each half period is the time to charge from `$-\beta V_{sat}$` to `$+\beta V_{sat}$` towards `$+V_{sat}$`:

```math
T = 2RC\ln\frac{1 + \beta}{1 - \beta} = 2RC\ln\left(1 + \frac{2R_1}{R_2}\right)
```

For `$R_1 = 0.86R_2$`, `$\ln(2.72) \approx 1$` and `$T \approx 2RC$`. A **monostable** adds a diode that clamps the capacitor in one state, so a trigger pulse produces one output pulse of fixed length. The 555 timer does the same jobs with two comparators and thresholds at `$V_{CC}/3$` and `$2V_{CC}/3$`: `$T = 0.693(R_A + 2R_B)C$`.

<div class="problem" data-problem="astable-frequency"></div>

<div class="myth">

**"V₊ = V₋ always holds for an op-amp."** It holds only with negative feedback, inside the linear range. In a comparator or Schmitt trigger the inputs differ by volts and the output sits at a rail. Even with negative feedback the rule fails when the output saturates or the signal changes faster than the slew rate allows: then the loop is broken and the inputs separate.

</div>

<div class="keypoints">

- Golden rules: `$V_+ = V_-$` and no input current, only with negative feedback in the linear range.
- Inverting `$-R_f/R_1$`, non-inverting `$1 + R_f/R_1$`, difference `$(R_2/R_1)(V_2 - V_1)$`, integrator `$-\frac1{RC}\int V\,dt$`.
- Bandwidth = GBW/noise gain; offset at output = `$V_{os}\times$` noise gain; `$f_p = \text{SR}/2\pi V_p$`.
- Schmitt: thresholds `$(V_{ref}R_2 \pm V_{sat}R_1)/(R_1 + R_2)$`, width `$2V_{sat}R_1/(R_1 + R_2)$`.
- Log amp: 59.5 mV per decade at 300 K; astable `$T = 2RC\ln(1 + 2R_1/R_2)$`; 555 astable `$0.693(R_A + 2R_B)C$`.

</div>

## Practise: exam questions on this lesson

<div class="qbank" data-bank="physics" data-topics="op-amp-circuits" data-exam="gate" data-n="10"></div>

**Next:** [lesson 9.4](/learn/courses/gate-physics/oscillators/) turns the stability question round and builds oscillators on purpose. The [op-amp calculator](/science/op-amp-calculator/) works out gains and resistor values for the standard circuits.
