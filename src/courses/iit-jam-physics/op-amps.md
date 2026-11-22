---
title: Operational amplifiers
seoTitle: Operational amplifiers (op-amps) for IIT JAM Physics
summary: 'The two golden rules that solve almost every op-amp circuit, the inverting, non-inverting, summing, difference, integrator and differentiator circuits, what real op-amps get wrong (gain-bandwidth, slew rate, offsets, CMRR), and comparators, Schmitt triggers and oscillators.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'An inverting amplifier has R_in = 10 kΩ and R_f = 100 kΩ. What input resistance does the signal source see?'
    choices: ['10 kΩ', 'Infinite, because the op-amp draws no input current', '100 kΩ', '110 kΩ']
    ans: 0
    why: 'The far end of R_in sits at the virtual ground, so the source simply drives R_in = 10 kΩ. Only the non-inverting circuit gives a very high input resistance.'
  - q: 'An op-amp with a gain-bandwidth product of 1 MHz is used as a non-inverting amplifier of gain 50. What is its bandwidth?'
    choices: ['20 kHz', '1 MHz', '50 MHz', '50 kHz']
    ans: 0
    why: 'Gain × bandwidth stays at the gain-bandwidth product: 1 MHz / 50 = 20 kHz.'
  - q: 'When can you assume that the two input terminals of an op-amp are at the same voltage?'
    choices: ['Only when there is negative feedback and the output is not saturated', 'Always, because the op-amp has infinite gain', 'Only when there is positive feedback', 'Only when both inputs are grounded']
    ans: 0
    why: 'The virtual short comes from negative feedback: the output adjusts itself until the difference is almost zero. In a comparator or Schmitt trigger, or a saturated amplifier, the inputs can differ by volts.'
sources:
  - 'P. Horowitz and W. Hill, The Art of Electronics, 3rd ed. (2015), chapter 4: operational amplifiers'
  - 'S. Franco, Design with Operational Amplifiers and Analog Integrated Circuits, 4th ed. (2015), chapters 1 to 6'
  - 'A. S. Sedra and K. C. Smith, Microelectronic Circuits, 7th ed. (2015), chapter 2: operational amplifiers'
  - 'IIT JAM Physics syllabus (Solid State Physics, Devices and Electronics section), published by the organising IIT each year'
---

**Module 7 · about 45 minutes.** By the end you will be able to solve any linear op-amp circuit with two rules and Kirchhoff's current law, write the output of summing, difference, integrating and differentiating circuits, predict when a real op-amp will saturate, slew or lose bandwidth, and work out the thresholds of a Schmitt trigger and the conditions for an oscillator.

<div class="bigidea">An op-amp has so much gain that, with negative feedback, it does whatever it takes to make its two inputs equal; the resistors around it, not the chip, decide what the circuit does.</div>

## 1. What an op-amp is

An operational amplifier is a high-gain differential amplifier on a chip (inside are a few dozen transistors of the kind met in [lesson 7.5](/learn/courses/iit-jam-physics/transistors/)). It has two inputs, inverting (−) and non-inverting (+), one output, and power supply pins, often ±15 V. Its output is

```math
V_o = A(V_+ - V_-), \qquad A \sim 10^5\text{ to }10^6\ \text{(open-loop gain)}
```

limited to just inside the supply rails. Used like this, "open loop", a difference of 0.1 mV is enough to slam the output to a rail. So op-amps are almost always used with **negative feedback**: part of the output is fed back to the inverting input.

The ideal op-amp has infinite gain, infinite input resistance, zero output resistance and infinite bandwidth. From these come the **two golden rules** (for a circuit with negative feedback that is not saturated):

1. **No current flows into either input.**
2. **The output does whatever it must to make `$V_+ = V_-$`** (the virtual short).

Rule 2 is a consequence of feedback: if `$V_-$` were a little below `$V_+$`, the huge gain would push the output up, which (through the feedback) raises `$V_-$` until the difference is a few microvolts.

## 2. The inverting amplifier

The signal goes through `$R_{in}$` to the inverting input; `$R_f$` connects the output back to that input; the non-inverting input is grounded. Apply the rules step by step:

<div class="steps">
<div class="step"><p><b>Virtual ground.</b> V₊ = 0, so rule 2 says V₋ = 0 too. The inverting input is at ground potential without being connected to ground.</p></div>
<div class="step"><p><b>Input current.</b> The current through R_in is (V_in − 0)/R_in = V_in/R_in.</p></div>
<div class="step"><p><b>Nowhere else to go.</b> Rule 1: no current enters the op-amp, so the same current must flow on through R_f.</p></div>
<div class="step"><p><b>Output.</b> Across R_f the voltage drops from 0 to V_o, so V_in/R_in = (0 − V_o)/R_f.</p></div>
<div class="step"><p><b>Result.</b> V_o = −(R_f/R_in)V_in. The gain is set by two resistors only, and the minus sign means the output is inverted.</p></div>
</div>

```math
\frac{V_o}{V_{in}} = -\frac{R_f}{R_{in}}, \qquad R_{\text{in, seen by source}} = R_{in}
```

The source sees just `$R_{in}$`, because its far end sits at 0 V. Note that the gain can be smaller than 1 in size.

<figure class="fig" data-fig="opamp-gain"><figcaption>Switch between the inverting and non-inverting circuits and change the resistors. The transfer curve is a straight line through the origin until the output reaches the ±11 V it can swing to, then it flattens: the op-amp saturates and the golden rules stop working.</figcaption></figure>

**Worked example.** An inverting amplifier has `$R_{in} = 4.7$` kΩ and `$R_f = 47$` kΩ, on ±12 V supplies (output swing ±11 V).

1. Gain `$= -47/4.7 = -10$`.
2. For `$V_{in} = 0.5$` V: `$V_o = -5$` V. For `$V_{in} = 1.5$` V: the formula says −15 V, but the output stops at **−11 V** (saturated).
3. The source delivers `$0.5\text{ V}/4.7\text{ kΩ} = 0.106$` mA, whatever the op-amp is like.

## 3. Non-inverting amplifier and voltage follower

Now the signal goes straight to the + input, and the − input sits on a divider: `$R_f$` from the output, `$R_1$` to ground. Rule 2 says `$V_- = V_{in}$`, and the divider says `$V_- = V_oR_1/(R_1 + R_f)$`. So

```math
\frac{V_o}{V_{in}} = 1 + \frac{R_f}{R_1}
```

The gain is at least 1 and positive (no inversion), and the source sees the op-amp's own huge input resistance. Remove `$R_1$` (or make `$R_f = 0$`) and the gain is exactly 1: the **voltage follower**, a buffer that copies a voltage from a weak source to a heavy load.

<div class="meaning">

<dl>
<dt>A</dt><dd>open-loop gain: how strongly the output reacts to a difference between the inputs</dd>
<dt>β = R₁/(R₁ + R_f)</dt><dd>the fraction of the output fed back to the inverting input</dd>
<dt>Closed-loop gain ≈ 1/β</dt><dd>the gain with feedback: set by the resistors, not by A</dd>
<dt>Virtual short</dt><dd>V₊ ≈ V₋, true only with negative feedback and an unsaturated output</dd>
<dt>Physical meaning</dt><dd>The op-amp trades its enormous, unreliable gain for a smaller, precise one. The extra gain it does not use (the loop gain Aβ) is what keeps the inputs equal and the result accurate.</dd>
</dl>

</div>

**Worked example.** A thermocouple gives 2.4 mV and must be amplified to 1.2 V without loading it.

1. Needed gain: `$1.2/0.0024 = 500$`; it must be positive and draw no current, so use a non-inverting stage.
2. `$1 + R_f/R_1 = 500$`: with `$R_1 = 1$` kΩ, `$R_f = 499$` kΩ.
3. An inverting stage would need `$R_{in}$` very large to avoid loading the sensor, and would invert the signal.

## 4. Summing and difference amplifiers

Add more input resistors to the virtual ground of an inverting amplifier and their currents add in `$R_f$`:

```math
V_o = -R_f\left(\frac{V_1}{R_1} + \frac{V_2}{R_2} + \frac{V_3}{R_3}\right)
```

Equal resistors give `$-(V_1 + V_2 + V_3)$`; `$R_f = R/n$` gives minus the average. Audio mixers and simple digital-to-analogue converters (binary-weighted resistors) are summing amplifiers.

For circuits with signals on both inputs, use **superposition**: switch on one input at a time (grounding the others), find the output from the inverting or non-inverting formula, and add. With `$V_1$` through `$R_1$` to the − input, feedback `$R_2$`, and `$V_2$` through `$R_3$` to the + input with `$R_4$` to ground:

```math
V_o = -\frac{R_2}{R_1}V_1 + \left(1 + \frac{R_2}{R_1}\right)\frac{R_4}{R_3 + R_4}V_2 \;=\; \frac{R_2}{R_1}(V_2 - V_1)\ \text{ when } \frac{R_4}{R_3} = \frac{R_2}{R_1}
```

That is the **difference amplifier**. It ignores anything common to both inputs, such as mains hum picked up equally on two wires, but only if the resistor ratios match. A mismatch lets the common-mode signal through, and the circuit's **common-mode rejection ratio** (CMRR `$= A_d/A_{cm}$`, often quoted in dB as `$20\log_{10}$` of the ratio) is set by resistor matching as much as by the op-amp. The **instrumentation amplifier** puts a follower-type stage in front of each input (very high input resistance) with gain `$1 + 2R/R_G$` set by one resistor.

**Worked example.** `$V_1 = 1$` V goes through 10 kΩ to the inverting input, `$R_f = 20$` kΩ, and `$V_2 = 0.5$` V goes straight to the non-inverting input.

1. From `$V_1$` alone: inverting, `$-(20/10)\times1 = -2$` V.
2. From `$V_2$` alone: non-inverting, `$(1 + 20/10)\times0.5 = 1.5$` V.
3. Together: `$V_o = -2 + 1.5 = -0.5$` V. The common slip is to give `$V_2$` a gain of 2 instead of 3.

## 5. Integrator and differentiator

Replace `$R_f$` by a capacitor `$C$`. The input current `$V_{in}/R$` still flows on, now charging the capacitor, and `$C\,dV_o/dt = -V_{in}/R$`:

```math
V_o = -\frac{1}{RC}\int V_{in}\,dt \quad\text{(integrator)}, \qquad V_o = -RC\frac{dV_{in}}{dt} \quad\text{(differentiator: } C \text{ and } R \text{ swapped)}
```

| Input | Integrator output | Differentiator output |
|---|---|---|
| constant | ramp (opposite sign) | zero |
| square wave | triangle wave | spikes at the edges |
| triangle wave | parabolic arcs | square wave |
| `$\sin\omega t$` | `$\cos\omega t/(\omega RC)$`, gain falls with frequency | `$-\omega RC\cos\omega t$`, gain rises with frequency |

The integrator is a low-pass circuit: its gain is unlimited at DC, so a tiny offset slowly drives it into saturation. A large resistor across `$C$` caps the DC gain. The differentiator boosts high-frequency noise; a small resistor in series with its capacitor tames it. With both `$R_f$` and `$C_f$` in parallel in the feedback path you get a first-order active low-pass filter with corner `$f_c = 1/(2\pi R_fC_f)$`.

**Worked example.** A ±1 V, 1 kHz square wave drives an integrator with `$R = 10$` kΩ, `$C = 0.1\ \mu$`F (`$RC = 1$` ms).

1. During each half-period (0.5 ms) the input is constant, so the output ramps at `$1\text{ V}/1\text{ ms} = 1000$` V/s.
2. In 0.5 ms it moves 0.5 V, then ramps back.
3. The output is a triangle wave of 0.5 V peak-to-peak (centred wherever the starting condition left it).

## 6. What real op-amps get wrong

<div class="myth">

**"The two inputs of an op-amp are always at the same voltage."** Only with negative feedback, and only while the output is inside its range. In a comparator (no feedback) or a Schmitt trigger (positive feedback), the inputs differ by volts and the output sits at a rail. In an amplifier whose formula asks for more than the supply allows, the output saturates, the feedback can no longer keep up, and `$V_+ \neq V_-$`. Always check the output is within the rails before using the virtual short.

</div>

- **Finite gain.** With feedback fraction `$\beta$`, the gain is `$A_{cl} = A/(1 + A\beta)$`, not quite `$1/\beta$`. The fractional error is about `$1/(A\beta)$`, so high-gain stages are the least accurate.
- **Gain-bandwidth product.** The open-loop gain falls as `$1/f$` above a few hertz. A stage with "noise gain" `$1/\beta$` (`$= 1 + R_f/R_{in}$`, for inverting and non-inverting stages alike) has bandwidth `$f_{3dB} = \text{GBW}\times\beta$`. A 1 MHz op-amp at gain 100 gives 10 kHz.
- **Slew rate.** The output cannot change faster than the slew rate SR (e.g. 0.5 V/μs). A sine of peak `$V_p$` has a largest slope `$2\pi fV_p$`, so large signals are limited to the **full-power bandwidth** `$f_{max} = SR/(2\pi V_p)$`, often far below the small-signal bandwidth.
- **Offset voltage and bias currents.** A few millivolts of input offset is amplified by the noise gain `$1 + R_f/R_{in}$`. Bias currents flowing through unequal resistances add more offset; a resistor equal to `$R_{in}\parallel R_f$` on the + input balances them.
- **Output limits.** The output swings only to within a volt or two of the supplies (rail-to-rail types do better) and can supply only tens of milliamps.

**Worked example.** An op-amp with GBW = 2 MHz and SR = 1 V/μs is used at a gain of 10 with a 1 V peak input.

1. Small-signal bandwidth: `$2\text{ MHz}/10 = 200$` kHz.
2. The output is 10 V peak, so the slew limit is `$10^6/(2\pi\times10) = 15.9$` kHz.
3. Above 15.9 kHz the sine output turns into a triangle; the slew rate, not the bandwidth, sets the limit here.

<div class="problem" data-problem="opamp-output"></div>

<div class="problem" data-problem="slew-limit"></div>

## 7. Positive feedback: comparators, Schmitt triggers and oscillators

A **comparator** is an op-amp with no feedback: the output goes to `$+V_{sat}$` when `$V_+ > V_-$` and to `$-V_{sat}$` otherwise. With a slowly varying noisy input it chatters back and forth near the switching point.

A **Schmitt trigger** cures this with positive feedback. In the inverting version the input goes to the − terminal, and the output is fed back to the + terminal through `$R_2$`, with `$R_1$` from the + terminal to ground (or to a reference `$V_{ref}$`). The + terminal then sits at

```math
V_+ = V_{ref}\frac{R_2}{R_1 + R_2} + V_o\frac{R_1}{R_1 + R_2}
```

which depends on which rail the output is at. So there are two thresholds, `$V_{UT}$` and `$V_{LT}$`, and a **hysteresis** gap `$V_{UT} - V_{LT} = 2V_{sat}R_1/(R_1 + R_2)$`. Noise smaller than the gap cannot make the output switch back.

**Worked example.** `$V_{sat} = \pm12$` V, `$R_1 = 10$` kΩ, `$R_2 = 20$` kΩ, `$V_{ref} = 0$`.

1. `$V_+ = V_o\times10/30 = V_o/3$`.
2. Output high: the input must rise above +4 V to switch it low. Output low: the input must fall below −4 V to switch it high.
3. Hysteresis: 8 V. A signal wobbling by ±1 V about 3 V can never cause a false switch.

**Oscillators** feed back in phase on purpose. The Barkhausen condition: around the loop the gain must be 1 and the phase shift a whole number of cycles. A **Wien bridge** network passes 1/3 of the voltage with zero phase at `$f = 1/(2\pi RC)$`, so it needs a non-inverting amplifier of gain 3 (`$R_f = 2R_1$`). Three RC sections give 180° at `$f = 1/(2\pi\sqrt6RC)$` with a loss of 1/29, so a **phase-shift oscillator** needs an inverting amplifier of gain 29.

To try real component values, the [op-amp circuit calculator](/science/op-amp-calculator/) works out gain, bandwidth and clipping for the classic circuits, the [analog filter designer](/science/filter-designer/) builds active filters from op-amp stages, and the [circuit simulator](/science/circuit-simulator/) gives the AC response of any network. The phasor arithmetic behind filters and the integrator's `$1/(j\omega RC)$` is in the [complex numbers lesson](/learn/courses/iit-jam-physics/complex-numbers/).

<div class="keypoints">

- With negative feedback and an unsaturated output: no input current, and `$V_+ = V_-$` (virtual short). Then use Kirchhoff's current law at the inverting input.
- Inverting: `$-R_f/R_{in}$`, input resistance `$R_{in}$`. Non-inverting: `$1 + R_f/R_1$`, input resistance very high. Follower: gain 1, a buffer.
- Summing: `$-R_f\sum V_i/R_i$`. Two inputs on both terminals: superposition. Difference amplifier `$(R_2/R_1)(V_2 - V_1)$` only with matched ratios.
- Integrator `$-\frac{1}{RC}\int V\,dt$` (square in, triangle out); differentiator `$-RC\,dV/dt$` (triangle in, square out).
- Real limits: `$A/(1 + A\beta)$`, bandwidth = GBW / noise gain, `$f_{max} = SR/(2\pi V_p)$`, offsets times the noise gain, output saturation.
- Positive feedback: comparators and Schmitt triggers (hysteresis `$2V_{sat}R_1/(R_1 + R_2)$`); oscillators need loop gain 1 (Wien: 3, phase shift: 29).

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. There are more on the [op-amps practice page](/learn/courses/iit-jam-physics/practice/op-amps/).

<div class="qbank" data-bank="physics" data-topics="op-amps" data-exam="jam" data-n="10"></div>

**Next:** [lesson 7.7](/learn/courses/iit-jam-physics/digital-logic/) leaves the analogue world for logic gates, where transistors are only ever fully on or fully off. The GATE Physics course treats [feedback amplifiers](/learn/courses/gate-physics/amplifiers-feedback/), [active filters](/learn/courses/gate-physics/op-amp-circuits/) and [oscillators](/learn/courses/gate-physics/oscillators/) in more depth.
