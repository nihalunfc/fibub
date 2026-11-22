---
title: Transistors and amplifiers
seoTitle: Transistors and amplifiers for IIT JAM Physics
summary: 'How a bipolar transistor turns a small base current into a large collector current, how to bias it with a load line and a stable Q-point, how to get the gain of common-emitter, common-base and emitter-follower stages in one line, and how JFETs and MOSFETs differ.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'An npn transistor has α = 0.99. What is its common-emitter current gain β?'
    choices: ['99', '100', '0.99', '1.01']
    ans: 0
    why: 'β = α/(1 − α) = 0.99/0.01 = 99. The value 100 is 1/(1 − α), which is I_E/I_B = β + 1.'
  - q: 'In a fixed-bias common-emitter stage, the transistor is swapped for one with a much larger β. What happens to the Q-point?'
    choices: ['It moves towards saturation, because I_C = βI_B grows and V_CE = V_CC − I_C R_C falls', 'It moves towards cut-off', 'It does not move, because the base current is fixed', 'Only the voltage gain changes, not the Q-point']
    ans: 0
    why: 'Fixed bias fixes I_B, not I_C. A larger β gives a larger I_C, a bigger drop across R_C and a smaller V_CE. Voltage-divider bias with an emitter resistor is used precisely to stop this.'
  - q: 'Which single-transistor stage has the lowest output impedance and a voltage gain just under 1?'
    choices: ['The emitter follower (common collector)', 'The common-emitter amplifier', 'The common-base amplifier', 'All three have the same output impedance']
    ans: 0
    why: 'Looking back into the emitter you see about r_e plus the source resistance divided by (β + 1): a few ohms to a few hundred ohms. That is why the follower is used as a buffer.'
sources:
  - 'A. S. Sedra and K. C. Smith, Microelectronic Circuits, 7th ed. (2015), chapters 6 and 7: bipolar junction transistors and amplifier basics'
  - 'P. Horowitz and W. Hill, The Art of Electronics, 3rd ed. (2015), chapters 2 and 3: bipolar transistors and field-effect transistors'
  - 'J. Millman, C. Halkias and S. Jit, Electronic Devices and Circuits, 4th ed. (2015), transistor biasing and small-signal chapters'
  - 'IIT JAM Physics syllabus (Solid State Physics, Devices and Electronics section), published by the organising IIT each year'
---

**Module 7 · about 45 minutes.** By the end you will be able to explain transistor action from the physics of a p-n junction, use α and β without mixing them up, draw a load line and place a Q-point, tell at a glance whether a transistor is active, saturated or cut off, and write down the gain and impedances of the common-emitter, common-base and common-collector stages. A short section on JFETs and MOSFETs closes the lesson.

<div class="bigidea">A transistor is a valve: a small current into the base (or a small voltage on the gate) controls a much larger current through the device, and a resistor turns that controlled current into an amplified voltage.</div>

## 1. Two junctions, one very thin layer

A bipolar junction transistor (BJT) is a sandwich of three doped regions: n-p-n or p-n-p. The three regions are

| Region | Doping | Size | Job |
|---|---|---|---|
| Emitter | heavy | medium | injects carriers into the base |
| Base | light | **very thin** | lets almost all of them pass |
| Collector | moderate | largest | collects them and gets rid of the heat |

There are two p-n junctions: base-emitter (BE) and base-collector (BC). In the npn transistor the arrow on the emitter of the circuit symbol points out (current leaves the emitter); in the pnp it points in. Everything below is for npn; for pnp reverse every voltage and current.

## 2. Transistor action

Here is what happens inside an npn transistor biased for amplification, with the BE junction forward biased and the BC junction reverse biased:

<div class="steps">
<div class="step"><p><b>Injection.</b> The forward-biased BE junction lets the heavily doped emitter push a flood of electrons into the base. (Holes from the base also cross into the emitter, but the base is lightly doped, so they are few.)</p></div>
<div class="step"><p><b>Diffusion across a thin base.</b> In the p-type base the electrons are minority carriers. They spread out by diffusion. The base is so thin, and has so few holes, that only about 1 in 100 of them meets a hole and recombines.</p></div>
<div class="step"><p><b>Collection.</b> At the far side the reverse-biased BC junction has a strong electric field pointing from collector to base. It sweeps every electron that arrives into the collector. A reverse bias does not stop minority carriers; it helps them.</p></div>
<div class="step"><p><b>Bookkeeping.</b> The few electrons that recombine in the base must be replaced through the base lead: that is the small base current I_B. The rest form the collector current I_C. So I_E = I_B + I_C, with I_C close to I_E.</p></div>
<div class="step"><p><b>Control.</b> The base current sets how hard the BE junction is driven, and so how many electrons are injected. A small change in I_B gives a change in I_C about β times larger. That is amplification.</p></div>
</div>

Two numbers describe the current split:

```math
\alpha = \frac{I_C}{I_E}\ (\text{just under }1), \qquad \beta = \frac{I_C}{I_B}\ (\text{typically 50 to 300}), \qquad \beta = \frac{\alpha}{1 - \alpha}, \qquad \alpha = \frac{\beta}{1 + \beta}
```

Kirchhoff's current law for the whole device gives `$I_E = I_B + I_C = (\beta + 1)I_B$`. A tiny leakage `$I_{CBO}$` flows across the reverse-biased BC junction even with the emitter open; with the base open it is amplified to `$I_{CEO} = (\beta + 1)I_{CBO}$`.

<div class="meaning">

<dl>
<dt>α</dt><dd>the fraction of the emitter current that reaches the collector (common-base current gain)</dd>
<dt>β</dt><dd>how many times larger the collector current is than the base current (common-emitter current gain)</dd>
<dt>I_E = I_B + I_C</dt><dd>charge is conserved: what goes in through base and collector comes out of the emitter</dd>
<dt>Physical meaning</dt><dd>β is huge because recombination in the base is rare. A change of α from 0.99 to 0.995 doubles β, so β varies a lot between transistors while α hardly moves. Good circuits are designed not to depend on β.</dd>
</dl>

</div>

**Worked example.** A transistor has `$\beta = 150$` and carries `$I_E = 4.53$` mA. Find `$I_B$`, `$I_C$` and `$\alpha$`.

1. `$I_B = I_E/(\beta + 1) = 4.53/151 = 0.030$` mA `$= 30\ \mu$`A.
2. `$I_C = \beta I_B = 150\times30\ \mu\text{A} = 4.50$` mA. Check: `$4.50 + 0.03 = 4.53$` mA.
3. `$\alpha = \beta/(1+\beta) = 150/151 = 0.9934$`.

The usual slip is dividing `$I_E$` by `$\beta$` instead of `$\beta + 1$`.

## 3. The four modes

The two junctions can each be forward or reverse biased, giving four modes:

| BE junction | BC junction | Mode | Behaviour |
|---|---|---|---|
| forward | reverse | **active** | `$I_C = \beta I_B$`: amplifier |
| forward | forward | **saturation** | `$V_{CE} \approx 0.2$` V, `$I_C < \beta I_B$`: closed switch |
| reverse | reverse | **cut-off** | `$I_C \approx 0$`: open switch |
| reverse | forward | inverse active | rarely used; poor gain |

The test in a problem: assume active, work out `$I_C = \beta I_B$` and then `$V_{CE}$`. If `$V_{CE}$` comes out above about 0.2 V, the assumption holds. If it comes out negative, the transistor is saturated and `$I_C$` is set by the outside circuit instead: `$I_C \approx (V_{CC} - V_{CE,sat})/R_C$`.

## 4. Characteristics, the load line and the Q-point

The **input characteristic** (I_B against V_BE) is just a forward-biased diode: almost nothing below 0.6 V, then a steep rise. The **output characteristics** are a family of curves of I_C against V_CE, one for each I_B. Each curve rises steeply for the first few tenths of a volt (saturation), then runs almost flat (active region) at `$I_C \approx \beta I_B$`.

The curves are not perfectly flat. As V_CE grows, the BC depletion layer widens into the base and makes it thinner, so fewer carriers recombine and I_C creeps up. This is **base-width modulation**, the **Early effect**. Extended backwards, the sloping lines meet the V_CE axis near `$-V_A$`, the Early voltage (tens to hundreds of volts).

The resistor `$R_C$` adds a second rule. Kirchhoff's voltage law round the collector loop gives the **DC load line**:

```math
V_{CE} = V_{CC} - I_CR_C
```

It is a straight line from `$(V_{CC}, 0)$` on the voltage axis to `$(0, V_{CC}/R_C)$` on the current axis. The transistor must sit on its own curve AND on the load line, so the operating point, the **Q-point** (quiescent point), is where they cross.

<figure class="fig" data-fig="bjt-load-line"><figcaption>Move the base current and the Q-point slides along the load line. Push I_B high (or R_C large) and Q runs into saturation at the left; set I_B to zero and it drops to cut-off at V_CE = V_CC. Changing R_C pivots the line about its V_CC end.</figcaption></figure>

For an amplifier the Q-point should sit near the middle of the active region, so the signal can swing both ways without hitting saturation (the bottom of the output is flattened) or cut-off (the top is flattened). Because a CE stage inverts, a Q-point too close to cut-off clips the **positive** half of the output, which comes from the **negative** half of the input.

**Worked example.** A CE stage has `$V_{CC} = 10$` V and `$R_C = 2$` kΩ, and the transistor (β = 100) gets `$I_B = 30\ \mu$`A. Find the Q-point.

1. Assume active: `$I_C = 100\times30\ \mu\text{A} = 3$` mA.
2. `$V_{CE} = 10 - 3\times2 = 4$` V, comfortably above 0.2 V, so active it is.
3. If instead `$I_B = 60\ \mu$`A, the formula gives `$I_C = 6$` mA and `$V_{CE} = -2$` V: impossible, so the transistor saturates with `$I_C \approx (10 - 0.2)/2 = 4.9$` mA.

## 5. Biasing for a Q-point that stays put

**Fixed bias** (one resistor `$R_B$` from `$V_{CC}$` to the base) sets `$I_B = (V_{CC} - 0.7)/R_B$`. But `$I_C = \beta I_B$`, and β changes from one transistor to the next and rises with temperature. So the Q-point wanders. Its **stability factor** `$S = \partial I_C/\partial I_{CBO} = 1 + \beta$` is as bad as it gets.

**Voltage-divider bias** fixes the base VOLTAGE with two resistors `$R_1$` (top) and `$R_2$` (bottom), and puts a resistor `$R_E$` in the emitter. If `$I_C$` tries to rise, the emitter voltage rises, `$V_{BE}$` falls and pushes `$I_C$` back: negative feedback. When the divider current is much larger than `$I_B$`:

```math
V_B = V_{CC}\frac{R_2}{R_1 + R_2}, \qquad I_C \approx I_E = \frac{V_B - V_{BE}}{R_E}, \qquad V_{CE} = V_{CC} - I_C(R_C + R_E)
```

None of these contains β. The stability factor is `$S = (1+\beta)\dfrac{1 + R_{th}/R_E}{1 + \beta + R_{th}/R_E}$`, close to 1 when the Thevenin resistance of the divider `$R_{th} = R_1\parallel R_2$` is small compared with `$R_E$`.

**Worked example.** `$V_{CC} = 12$` V, `$R_1 = 47$` kΩ, `$R_2 = 10$` kΩ, `$R_E = 1$` kΩ, `$R_C = 2.2$` kΩ, β large.

1. `$V_B = 12\times10/57 = 2.105$` V.
2. `$V_E = 2.105 - 0.7 = 1.405$` V, so `$I_C \approx 1.405$` mA.
3. `$V_{CE} = 12 - 1.405\times(2.2 + 1) = 7.50$` V. Active, near the middle of the 12 V supply.

If β is only about 100, treat the divider as its Thevenin equivalent (`$V_{th}$` in series with `$R_{th}$`) and solve `$V_{th} = I_BR_{th} + V_{BE} + (\beta + 1)I_BR_E$`; the answer drops by a few per cent. Try your own numbers here:

<div class="problem" data-problem="divider-bias"></div>

## 6. The transistor as a small-signal amplifier

Around the Q-point a small signal sees a simple linear model. Because `$I_C = I_Se^{V_{BE}/V_T}$` (with `$V_T = kT/e \approx 25$` mV at room temperature), a small change in `$V_{BE}$` changes `$I_C$` at the rate

```math
g_m = \frac{\partial I_C}{\partial V_{BE}} = \frac{I_C}{V_T}, \qquad r_e = \frac{V_T}{I_E} \approx \frac{1}{g_m}, \qquad r_\pi = \frac{\beta}{g_m} = (\beta + 1)r_e
```

`$g_m$` is the transconductance (40 mA/V at 1 mA), `$r_e$` the resistance looking into the emitter (25 Ω at 1 mA) and `$r_\pi$` the resistance looking into the base. In h-parameter language `$h_{fe} = \beta$`, `$h_{ie} = r_\pi$`, and `$h_{oe}$` is the small slope of the output curves caused by the Early effect.

**Common-emitter gain.** A signal `$v_{in}$` on the base changes the collector current by `$g_mv_{in}$`. That current flows through `$R_C$` in parallel with any capacitively coupled load `$R_L$`:

```math
A_v = -g_m(R_C\parallel R_L) \qquad\text{(emitter bypassed)}, \qquad A_v \approx -\frac{R_C\parallel R_L}{r_e + R_E} \qquad (R_E\text{ unbypassed})
```

The minus sign is the 180° phase reversal. An unbypassed `$R_E$` lowers the gain but makes it depend on resistors instead of the transistor, raises the input resistance to `$(\beta + 1)(r_e + R_E)$` and widens the bandwidth: the classic trade of gain for stability.

**Worked example.** A CE stage at `$I_C = 2$` mA has `$R_C = 4.7$` kΩ, a 10 kΩ load, and an unbypassed 100 Ω emitter resistor.

1. `$r_e = 25/2 = 12.5\ \Omega$`; `$R_C\parallel R_L = 4.7\times10/14.7 = 3.20$` kΩ.
2. Bypassed, the gain would be `$-3200/12.5 = -256$`.
3. With the 100 Ω left in: `$A_v = -3200/(12.5 + 100) = -28.4$`. Smaller, but a 20% change in `$I_C$` now barely moves it.

<div class="problem" data-problem="ce-gain"></div>

## 7. Three ways to connect one transistor

The terminal shared by input and output names the configuration:

| | Common emitter | Common base | Common collector (emitter follower) |
|---|---|---|---|
| Input at / output at | base / collector | emitter / collector | base / emitter |
| Voltage gain | large, inverted: `$-g_mR_C$` | large, not inverted: `$+g_mR_C$` | just under 1: `$R_E/(R_E + r_e)$` |
| Current gain | β | α (just under 1) | `$\beta + 1$` |
| Input resistance | medium, `$r_\pi$` | low, `$r_e$` | high, `$(\beta+1)(r_e + R_E)$` |
| Output resistance | high, about `$R_C$` | high | low, `$r_e + R_s/(\beta + 1)$` |
| Used for | general voltage gain | high frequencies, current buffer | buffer: weak source, heavy load |

A surprise examiners like: for the same `$g_m$` and `$R_C$`, common base has the **same** size of voltage gain as common emitter. Its current gain is below 1, but its tiny input resistance makes up for it.

Two transistors can be combined: a **Darlington pair** (emitter of the first into the base of the second) behaves like one transistor with `$\beta \approx \beta_1\beta_2$`.

## 8. Frequency response in brief

An RC-coupled amplifier has a flat **mid-band**. At low frequencies the coupling and bypass capacitors stop being short circuits: each forms a high-pass filter with the resistance it sees, `$f_L = 1/(2\pi RC)$`. At high frequencies the transistor's own junction capacitances short the signal. The worst is the base-collector capacitance `$C_\mu$`: it sits between the input and an inverted, amplified output, so the input sees it multiplied, `$C_M = C_\mu(1 + |A_v|)$`, the **Miller effect**. Gain times bandwidth stays roughly constant, which is the first hint of the gain-bandwidth product you will meet in the [op-amp lesson](/learn/courses/iit-jam-physics/op-amps/).

<div class="myth">

**"A transistor is just two diodes back to back."** No. Two separate diodes joined at their anodes cannot amplify: an electron entering one diode recombines long before it could reach the other. Transistor action needs the two junctions to share a base thinner than the distance a minority carrier diffuses before it recombines, so carriers injected by one junction are collected by the other. The "two diodes" picture is useful only for testing a transistor with a meter, never for understanding gain.

</div>

## 9. Field-effect transistors

A **JFET** is a bar of n-type silicon (the channel) with p-type gates on its sides. The gate junction is kept **reverse biased**, so almost no gate current flows (input resistance of `$10^9\ \Omega$` or more). A more negative gate voltage widens the depletion layers and squeezes the channel. Beyond a small drain voltage the channel pinches off at the drain end and the current saturates at a value set by `$V_{GS}$` alone (Shockley's equation):

```math
I_D = I_{DSS}\left(1 - \frac{V_{GS}}{V_P}\right)^2, \qquad g_m = \frac{2I_{DSS}}{|V_P|}\left(1 - \frac{V_{GS}}{V_P}\right)
```

where `$I_{DSS}$` is the current at `$V_{GS} = 0$` and `$V_P$` (negative for n-channel) is the pinch-off voltage.

A **MOSFET** insulates the gate from the channel with a thin oxide, so the DC gate current is essentially zero. An **enhancement** n-MOSFET has no channel until `$V_{GS}$` exceeds a positive threshold `$V_T$`; in saturation `$I_D = K(V_{GS} - V_T)^2$`. A **depletion** MOSFET is built with a channel and conducts at `$V_{GS} = 0$`. FETs are unipolar (only majority carriers carry the current) and voltage controlled; BJTs are bipolar and current controlled.

Watch the word "saturation": in a FET it means the current has levelled off (the amplifying region); in a BJT it means `$V_{CE}$` has collapsed (the switch-on region).

**Worked example.** An n-channel JFET with `$I_{DSS} = 10$` mA and `$V_P = -4$` V has `$V_{GS} = -1$` V.

1. `$I_D = 10(1 - 0.25)^2 = 10\times0.5625 = 5.63$` mA.
2. `$g_m = (2\times10/4)(0.75) = 3.75$` mS.
3. With a 2 kΩ drain resistor the small-signal gain is `$-g_mR_D = -7.5$`: FETs give less voltage gain than BJTs at similar currents, in exchange for their enormous input resistance.

To explore real device curves, the [p-n junction](/learn/pn-junction/) tool shows the depletion layer and diode curve that the BE junction follows, the [I-V characteristics](/learn/iv-characteristics/) tool builds a current-voltage graph point by point, and the [circuit simulator](/science/circuit-simulator/) solves the DC operating point and AC response of any resistor network you type in.

<div class="keypoints">

- BJT action: the BE junction (forward) injects carriers, the thin, lightly doped base lets them through, the BC junction (reverse) collects them. `$I_E = I_B + I_C$`, `$\beta = \alpha/(1-\alpha)$`, `$I_B = I_E/(\beta+1)$`.
- Modes: active (BE forward, BC reverse) amplifies; saturation (both forward) and cut-off (both reverse) make a switch. Check `$V_{CE}$` to know which.
- DC load line `$V_{CE} = V_{CC} - I_CR_C$`; the Q-point is where it meets the transistor's curve. Put it mid-way for the biggest undistorted swing.
- Voltage-divider bias with `$R_E$` makes the Q-point nearly independent of β; fixed bias has `$S = 1 + \beta$`.
- Small signal: `$g_m = I_C/V_T$`, `$r_e = V_T/I_E$`, `$r_\pi = \beta/g_m$`. CE gain `$-g_m(R_C\parallel R_L)$`, or `$-(R_C\parallel R_L)/(r_e + R_E)$` with an unbypassed `$R_E$`.
- CE inverts with high gain; CB has the same gain magnitude but low input resistance; the emitter follower has gain just under 1, high input and low output resistance.
- JFET: `$I_D = I_{DSS}(1 - V_{GS}/V_P)^2$` with the gate reverse biased; MOSFETs have an insulated gate and come as enhancement or depletion types.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. There are more on the [transistors practice page](/learn/courses/iit-jam-physics/practice/transistors/).

<div class="qbank" data-bank="physics" data-topics="transistors" data-exam="jam" data-n="10"></div>

**Next:** [lesson 7.6](/learn/courses/iit-jam-physics/op-amps/) packs dozens of transistors into one chip, the operational amplifier, and shows how feedback makes its gain depend only on two resistors. Then [lesson 7.7](/learn/courses/iit-jam-physics/digital-logic/) uses transistors as switches to build logic gates. The GATE Physics course takes amplifiers further, with [feedback topologies](/learn/courses/gate-physics/amplifiers-feedback/) and multistage design, and puts BJTs beside FETs and MOSFETs in [semiconductor devices](/learn/courses/gate-physics/semiconductor-devices/).
