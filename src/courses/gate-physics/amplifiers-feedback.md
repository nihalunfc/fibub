---
title: Amplifiers and feedback
summary: 'Transistor amplifiers and negative feedback at GATE depth: common-emitter, common-base and follower stages, emitter degeneration, the differential pair and CMRR, low- and high-frequency cut-offs with the Miller effect, the feedback equation with desensitivity and the constant gain-bandwidth product, the four feedback topologies and their input and output resistances, and stability through the loop gain and phase margin.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'An amplifier with open-loop gain 10⁴ is placed in a loop with β = 0.01. If the open-loop gain falls by 20%, the closed-loop gain falls by about'
    choices: ['0.2%', '2%', '20%', '0.02%']
    ans: 0
    why: 'Desensitivity: dA_f/A_f = (dA/A)/(1 + Aβ) = 20%/101 ≈ 0.2%.'
  - q: 'Series (voltage) feedback at the input and shunt (voltage) sampling at the output, with loop gain 1 + Aβ = 50, change the input and output resistances by'
    choices: ['R_in × 50, R_out ÷ 50', 'R_in ÷ 50, R_out × 50', 'both × 50', 'both ÷ 50']
    ans: 0
    why: 'Series mixing raises the input resistance by the loop factor; shunt sampling of the output voltage lowers the output resistance by the same factor. This is the ideal voltage amplifier.'
  - q: 'A common-emitter stage has gain −100 and C_μ = 2 pF between base and collector. The Miller capacitance seen at the base is'
    choices: ['202 pF', '200 pF', '2 pF', '98 pF']
    ans: 0
    why: 'C_M = C_μ(1 − A_v) = 2 × (1 + 100) = 202 pF, added to C_π at the input.'
sources:
  - 'A. S. Sedra and K. C. Smith, Microelectronic Circuits, 7th ed. (2015), chapters 7, 9, 10 and 11'
  - 'P. Horowitz and W. Hill, The Art of Electronics, 3rd ed. (2015), chapters 2 and 4'
  - 'P. R. Gray, P. J. Hurst, S. H. Lewis and R. G. Meyer, Analysis and Design of Analog Integrated Circuits, 5th ed. (2009), chapters 8 and 9'
  - 'GATE Physics (PH) syllabus, Electronics section, published by the organising IIT each year'
---

**Module 9 · about 45 minutes.** [Lesson 9.1](/learn/courses/gate-physics/semiconductor-devices/) gave the small-signal parameters `$g_m$`, `$r_\pi$` and `$r_o$`. Here they become amplifiers, and then feedback turns an amplifier with a large but unreliable gain into one with a smaller, precise gain. The JAM [transistors lesson](/learn/courses/iit-jam-physics/transistors/) covers biasing and the load line.

<div class="bigidea">Negative feedback spends gain to buy almost everything else. Divide the gain by the loop factor 1 + Aβ, and the gain becomes insensitive to the transistor, the bandwidth grows by the same factor, distortion shrinks by it, and input and output resistances move by it in the useful direction. The price is a risk: if the loop phase reaches −180° while the loop gain is still above 1, the amplifier oscillates.</div>

## 1. Single-transistor stages

With the hybrid-π model, three BJT configurations (and their FET twins) cover nearly every question:

Change the Q-point and the input size and watch a common-emitter stage start to clip.

<figure class="fig" data-fig="@sx-amp-clip"><figcaption>A larger bias current gives a larger g<sub>m</sub> and gain but moves V<sub>CE</sub> towards saturation; the exponential characteristic also distorts large inputs.</figcaption></figure>

| Stage | Voltage gain | Input resistance | Output resistance | Use |
|---|---|---|---|---|
| common emitter (source) | `$-g_m(R_C\parallel r_o)$` | `$r_\pi$` (FET: ∞) | `$R_C\parallel r_o$` | voltage gain |
| common base (gate) | `$+g_mR_C$` | `$\approx 1/g_m$` | `$\approx R_C$` | low input resistance, wide bandwidth |
| common collector (drain), follower | `$\dfrac{g_mR_E}{1 + g_mR_E} \approx 1$` | `$r_\pi + (\beta + 1)R_E$` | `$\approx 1/g_m + R_s/(\beta + 1)$` | buffer |

**Emitter degeneration.** An unbypassed resistor `$R_E$` in the emitter is local series feedback:

```math
A_v = -\frac{g_mR_C}{1 + g_mR_E} \approx -\frac{R_C}{R_E} \quad (g_mR_E \gg 1), \qquad R_{in} = r_\pi + (\beta + 1)R_E
```

**Worked example.** `$I_C = 1$` mA (`$g_m = 40$` mS), `$R_C = 5$` kΩ, `$R_E = 200$` Ω: `$A_v = -200/9 = -22.2$`, close to `$-R_C/R_E = -25$`. Without `$R_E$` the gain is −200, but it would change with temperature and with every transistor; with `$R_E$` it depends mostly on two resistors.

**The differential pair.** Two matched transistors share a tail current source of resistance `$R_{EE}$`. A difference signal sees the emitters as a virtual ground; a common signal sees `$2R_{EE}$` in each emitter:

```math
A_d = \frac{g_mR_C}2 \ \ (\text{single-ended}), \qquad A_{cm} \approx -\frac{R_C}{2R_{EE}}, \qquad \text{CMRR} = \left|\frac{A_d}{A_{cm}}\right| \approx g_mR_{EE}
```

With `$I_C = 0.5$` mA per side (`$g_m = 20$` mS), `$R_C = 10$` kΩ and `$R_{EE} = 50$` kΩ: `$A_d = 100$`, `$A_{cm} = 0.1$`, CMRR ≈ 1000 = 60 dB. A transistor current source in the tail makes `$R_{EE}$` huge, which is why op-amp input stages reject common-mode signals so well.

## 2. Frequency response

**Low frequencies.** Coupling and bypass capacitors make high-pass corners at `$f = 1/2\pi R_{seen}C$`, with `$R_{seen}$` the resistance the capacitor sees with the signal sources set to zero. The emitter bypass capacitor sees the small resistance `$1/g_m + R_s/(\beta + 1)$` and usually sets `$f_L$`.

**High frequencies.** The device capacitances `$C_\pi$` and `$C_\mu$` make low-pass poles. `$C_\mu$` connects the input to an output that swings `$-A_v$` times as much, so the current through it is `$(1 + A_v)$` times larger than for a grounded capacitor. This is the **Miller effect**:

```math
C_{in} = C_\pi + C_\mu(1 + |A_v|), \qquad f_H \approx \frac1{2\pi R_s'C_{in}}
```

A common-base stage or a cascode (common emitter feeding common base) avoids it: the input transistor then sees a gain of only about −1, so its `$C_\mu$` is barely multiplied.

<div class="problem" data-problem="miller-pole"></div>

## 3. The feedback equation

Feed a fraction β of the output back and subtract it from the input. With forward gain `$A$`:

See what negative feedback does to gain and distortion.

<figure class="fig" data-fig="@sx-feedback-distortion"><figcaption>Closed-loop gain A/(1 + Aβ) and distortion both fall by about the same factor 1 + Aβ. Raise β and the waveform becomes cleaner but needs more drive.</figcaption></figure>

```math
A_f = \frac A{1 + A\beta} \xrightarrow{A\beta \gg 1} \frac1\beta, \qquad \frac{dA_f}{A_f} = \frac1{1 + A\beta}\frac{dA}A
```

<div class="meaning">

<dl>
<dt>`$T = A\beta$`</dt><dd>loop gain: the gain around the loop with the input set to zero</dd>
<dt>`$1 + A\beta$`</dt><dd>the amount of feedback, or desensitivity factor: everything good about feedback scales with it</dd>
<dt>`$A_f \approx 1/\beta$`</dt><dd>the closed-loop gain is set by the feedback network, usually two resistors</dd>
<dt>bandwidth</dt><dd>for a single-pole amplifier, `$f_{H,f} = f_H(1 + A_0\beta)$` while the gain falls by the same factor: the gain-bandwidth product `$A_0f_H$` is constant</dd>
<dt>distortion and interference</dt><dd>disturbances added inside the loop are divided by `$1 + A\beta$`; noise added at the input is amplified like the signal and is not reduced</dd>
</dl>

</div>

**Worked example.** `$A = 10^5$`, `$\beta = 0.01$`: `$A_f = 10^5/1001 = 99.90$`. Halve `$A$` to `$5\times10^4$`: `$A_f = 99.80$`, a change of 0.1% for a 50% change in `$A$`. If the amplifier has a single pole at 10 Hz, the closed-loop bandwidth is `$10\times1001 \approx 10$` kHz, and the product 1 MHz is unchanged.

<div class="problem" data-problem="feedback-bandwidth"></div>

**Four topologies.** Feedback can sample the output voltage (shunt at the output) or current (series), and mix at the input as a voltage (series) or a current (shunt). Each moves the resistances by `$1 + A\beta$`:

| Topology (mixing-sampling) | Stabilises | `$R_{in}$` | `$R_{out}$` | Ideal amplifier |
|---|---|---|---|---|
| series-shunt | voltage gain | × (1 + Aβ) | ÷ (1 + Aβ) | voltage amplifier |
| shunt-series | current gain | ÷ | × | current amplifier |
| series-series | transconductance | × | × | voltage to current |
| shunt-shunt | transresistance | ÷ | ÷ | current to voltage |

The rule: series connections raise the resistance at that port, shunt connections lower it. A non-inverting op-amp amplifier is series-shunt; an inverting one with its input resistor removed is shunt-shunt (a transimpedance amplifier); the degenerated common emitter is series-series.

## 4. Stability

A real amplifier has several poles. Each contributes up to −90° of phase, so with two or more the loop gain `$A(j\omega)\beta$` can reach −180°. There the "negative" feedback has become positive. If `$|A\beta| \ge 1$` at that frequency, the loop sustains a signal by itself: oscillation ([lesson 9.4](/learn/courses/gate-physics/oscillators/) uses this on purpose).

```math
\text{phase margin} = 180^\circ + \angle A\beta \ \text{ at } |A\beta| = 1, \qquad \text{gain margin} = -20\log_{10}|A\beta| \ \text{ at } \angle A\beta = -180^\circ
```

On a Bode plot the loop gain is the distance between the `$|A|$` curve and the horizontal line `$1/\beta$` (in dB). They cross where `$|A\beta| = 1$`. If they cross on a −20 dB/decade stretch, the phase there is near −90° and the margin is comfortable; on a −40 dB/decade stretch, the margin is small and the closed-loop response peaks.

**Worked example.** `$A_0 = 10^5$` with poles at 10 Hz and 1 MHz. For a gain of 100 (`$1/\beta$` = 40 dB) the crossover is at 10 kHz, where the second pole adds only 0.6°: phase margin 89°. For a unity-gain follower (`$\beta = 1$`) the crossover moves to 786 kHz, and the phase margin drops to 52°. Op-amps are **compensated** with a dominant pole low enough that even the follower, the hardest case, has a margin of about 45° or more.

<figure class="fig" data-fig="bode-feedback"><figcaption>Bode plot of an amplifier with two or three poles: open-loop gain, the line 1/β, and the closed-loop gain, which follows 1/β until it meets the open-loop curve. The lower panel shows the loop phase and the phase margin at the crossing. Lower the closed-loop target or bring the second pole down to see the margin collapse and the closed-loop response peak.</figcaption></figure>

<div class="myth">

**"More feedback is always better."** More loop gain gives more precision, but it pushes the crossover frequency up into the region where the higher poles add phase. A follower is the most demanding configuration for stability, not the easiest: it has the largest loop gain. Capacitive loads, which add a pole at the output, make it worse.

</div>

<div class="keypoints">

- CE: `$-g_m(R_C\parallel r_o)$`; degenerated `$-g_mR_C/(1 + g_mR_E) \approx -R_C/R_E$`; CB: input `$1/g_m$`; follower: gain ≈ 1, input `$(\beta + 1)R_E$`.
- Differential pair: `$A_d = g_mR_C/2$` single-ended, CMRR ≈ `$g_mR_{EE}$`.
- Miller: `$C_{in} = C_\pi + C_\mu(1 + |A_v|)$`; cascode and CB avoid it.
- `$A_f = A/(1 + A\beta) \to 1/\beta$`; sensitivity divided by `$1 + A\beta$`; single pole: gain × bandwidth constant.
- Series raises, shunt lowers the resistance at that port, by `$1 + A\beta$`.
- Phase margin = 180° + ∠Aβ where `$|A\beta| = 1$`; the follower is the worst case.

</div>

## Practise: exam questions on this lesson

<div class="qbank" data-bank="physics" data-topics="amplifiers-feedback" data-exam="gate" data-n="10"></div>

**Next:** [lesson 9.3](/learn/courses/gate-physics/op-amp-circuits/) applies these ideas to the op-amp, where `$A\beta$` is so large that the closed-loop gain is set by the resistors alone. The [filter designer](/science/filter-designer/) shows Bode plots of real filters.

**Going on to CSIR NET?** [Noise, filtering and lock-in detection](/learn/courses/csir-net-physics/noise-lock-in/) asks how small a signal these amplifiers can recover.
