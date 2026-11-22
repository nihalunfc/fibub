---
title: DC transients and AC circuits
seoTitle: RC, RL, LCR and AC circuits for IIT JAM Physics
summary: 'RC and RL charging and decay with the energy bookkeeping examiners love, LC oscillations, damped LCR circuits (under-, critically and overdamped), reactance and impedance with phasors, series and parallel resonance, Q and bandwidth, rms values, power factor and maximum power transfer.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: A capacitor is charged from a battery through a resistor. What fraction of the battery's energy ends up stored in the capacitor?
    choices: ['Exactly half, whatever the resistance', 'All of it if the resistance is tiny', '63%', 'It depends on the capacitance']
    ans: 0
    why: The battery gives QV = CV²; the capacitor stores ½CV². The other half is lost in the resistor, whatever its value. A small resistor carries a large current for a short time and wastes the same.
  - q: In a series LCR circuit driven above its resonant frequency, how is the current related to the source voltage?
    choices: ['It lags, because the inductive reactance is larger', 'It leads, because the capacitive reactance is larger', 'It is in phase', 'It lags by exactly 90°']
    ans: 0
    why: Above resonance ωL > 1/ωC, so the circuit is inductive and the current lags. Below resonance it is capacitive and leads; exactly at resonance it is in phase.
  - q: At resonance, a series LCR circuit with Q = 20 is driven by 1 V rms. What is the rms voltage across the capacitor?
    choices: ['20 V', '1 V', 'Zero', '0.05 V']
    ans: 0
    why: At resonance I = V/R and V_C = I/(ω0C) = QV. The capacitor and inductor voltages cancel each other, but each alone is Q times the source.
sources:
  - 'E. M. Purcell and D. J. Morin, Electricity and Magnetism, 3rd ed. (2013), chapters 4 and 8'
  - 'D. J. Griffiths, Introduction to Electrodynamics, 4th ed. (2017), chapter 7.2 (RL circuits and energy)'
  - 'H. C. Verma, Concepts of Physics, Part 2 (1993), chapters 32 and 39'
  - 'IIT JAM Physics syllabus (Electricity and Magnetism section), published by the organising IIT each year'
---

**Module 4 · about 50 minutes.** By the end you will be able to write down any RC or RL transient in one line, track where the energy goes, classify a free LCR circuit as under-, critically or overdamped, draw phasor diagrams, find impedance, phase, resonance, Q, bandwidth and average power, and match a load for maximum power.

<div class="bigidea">Capacitors resist sudden changes of voltage and inductors resist sudden changes of current; every transient is the circuit relaxing exponentially to its new steady state, and every AC circuit is the same idea run at one frequency, where L and C become frequency-dependent resistances.</div>

## 1. RC circuits

A battery `$V_0$` charges a capacitor `$C$` through `$R$`. Kirchhoff's loop rule gives `$V_0 = IR + q/C$` with `$I = dq/dt$`, a first-order equation:

```math
V_C(t) = V_0\left(1 - e^{-t/\tau}\right), \qquad I(t) = \frac{V_0}{R}e^{-t/\tau}, \qquad \tau = RC
```

Discharging from `$V_0$`: `$V_C = V_0e^{-t/\tau}$`. After one `$\tau$` a charging capacitor is at 63%, after `$5\tau$` past 99%; a discharging one halves in `$\tau\ln2$`. At the instant of switching an uncharged capacitor acts as a wire; after a long time it acts as a break.

**Short cut for any RC circuit with one capacitor.** Replace the rest of the circuit, as the capacitor sees it, by its Thevenin equivalent `$V_{th}$`, `$R_{th}$`. Then `$V_C$` goes exponentially from its start value to `$V_{th}$` with `$\tau = R_{th}C$`. Example: 12 V through 2 kΩ, with 4 kΩ across a 3 µF capacitor: `$V_{th} = 8$` V, `$R_{th} = 1.33$` kΩ, `$\tau = 4$` ms.

<figure class="fig" data-fig="rc-transient"><figcaption>Charging and discharging curves of an RC or RL circuit. Change R and C (or L) to see τ change, and move the probe in units of τ. The dashed curve is the stored energy, which moves twice as fast on decay.</figcaption></figure>

**Energy bookkeeping.** Charging from zero, the battery delivers `$QV_0 = CV_0^2$`, the capacitor stores `$\tfrac12CV_0^2$`, and `$\int I^2R\,dt = \tfrac12CV_0^2$` is heat, **independent of R**. Joining a charged capacitor to an identical empty one loses `$\tfrac14CV^2$`, again for any `$R$`. Because energy goes as `$V^2$`, a discharging capacitor's energy halves at `$\tfrac12\tau\ln2$`, and a charging one reaches half its final energy only at `$1.23\tau$`.

<div class="problem" data-problem="rc-charge-time"></div>

## 2. RL circuits

Switch a battery onto `$R$` and `$L$` in series: `$V_0 = IR + L\,dI/dt$`, so

```math
I(t) = \frac{V_0}{R}\left(1 - e^{-t/\tau}\right), \qquad \tau = \frac LR
```

At `$t = 0^+$` the current is zero and the whole `$V_0$` sits across the inductor; after a long time the inductor is a plain wire. Short out the battery and `$I = I_0e^{-t/\tau}$`, the energy `$\tfrac12LI_0^2$` turning into heat. (Lesson 4.7 on [induction](/learn/courses/iit-jam-physics/induction/) covered this in detail.)

**Worked example.** 10 V, 100 Ω, 0.50 H: `$\tau = 5$` ms, `$I_\infty = 100$` mA, and at 10 ms `$I = 100(1 - e^{-2}) = 86.5$` mA.

## 3. LC and LCR: free oscillations

Connect a charged capacitor across an inductor. `$L\ddot q + q/C = 0$`: simple harmonic motion with `$\omega_0 = 1/\sqrt{LC}$`. Energy sloshes between `$\tfrac12q^2/C$` and `$\tfrac12LI^2$` (each oscillating at `$2\omega_0$`), so `$I_{\max} = V_0\sqrt{C/L}$`. A 4 µF capacitor at 50 V into 1 mH gives `$I_{\max} = 3.16$` A.

Add resistance: `$L\ddot q + R\dot q + q/C = 0$`, the damped oscillator of [lesson 3.2](/learn/courses/iit-jam-physics/damped-forced-oscillations/) with `$\gamma = R/2L$`:

| Condition | Behaviour |
|---|---|
| `$R < 2\sqrt{L/C}$` (underdamped) | oscillates at `$\omega_d = \sqrt{\omega_0^2 - R^2/4L^2}$`, amplitude `$\propto e^{-Rt/2L}$` |
| `$R = 2\sqrt{L/C}$` (critical) | fastest return to zero without overshoot |
| `$R > 2\sqrt{L/C}$` (overdamped) | slow creep back, no oscillation |

**Worked example.** `$L = 0.20$` H and `$C = 5.0$` µF: critical at `$R = 2\sqrt{4\times10^4} = 400\ \Omega$`. With `$L = 1$` H, `$C = 1$` µF and `$R = 200\ \Omega$`: `$\omega_d = \sqrt{10^6 - 10^4} = 995$` rad/s, just below `$\omega_0$`.

## 4. AC: reactance, impedance and phasors

With a sinusoidal source, every voltage and current oscillates at the same `$\omega$` and differs only in size and phase. Represent each as an arrow (phasor) rotating at `$\omega$`, or as a complex number (lesson 1.9 on [complex numbers](/learn/courses/iit-jam-physics/complex-numbers/)):

| Element | Impedance | Phase of current |
|---|---|---|
| `$R$` | `$R$` | in phase with `$V$` |
| `$L$` | `$j\omega L$` (reactance `$X_L = \omega L$`) | lags by `$90^\circ$` |
| `$C$` | `$1/(j\omega C)$` (reactance `$X_C = 1/\omega C$`) | leads by `$90^\circ$` |

Impedances combine like resistances. For `$R$`, `$L$`, `$C$` in series:

```math
Z = \sqrt{R^2 + (X_L - X_C)^2}, \qquad \tan\phi = \frac{X_L - X_C}{R}
```

with the current lagging the voltage by `$\phi$` (leading if `$\phi < 0$`). The component voltages add as **phasors**, not as numbers: with `$V_R = 30$`, `$V_L = 80$`, `$V_C = 40$` V, the source is `$\sqrt{30^2 + 40^2} = 50$` V, not 150 V.

<div class="meaning">

<dl>
<dt>X_L = ωL</dt><dd>an inductor opposes fast changes, so its "resistance" grows with frequency</dd>
<dt>X_C = 1/ωC</dt><dd>a capacitor passes fast changes easily, so its "resistance" falls with frequency</dd>
<dt>Z</dt><dd>the ratio of voltage to current amplitude, combining R with the net reactance at right angles</dd>
<dt>φ</dt><dd>how far the current lags the voltage; positive for an inductive circuit</dd>
<dt>Physical meaning</dt><dd>L and C store energy and give it back each cycle; only R takes energy away for good. The phase angle measures how much of the current is just sloshing energy back and forth.</dd>
</dl>

</div>

## 5. Resonance, Q and bandwidth

At `$\omega_0 = 1/\sqrt{LC}$`, `$X_L = X_C$`: the series impedance is just `$R$`, the current peaks at `$V/R$` and is in phase with the source, and `$V_L$`, `$V_C$` cancel. Each of them alone is `$Q$` times the source voltage, where

```math
Q = \frac{\omega_0L}{R} = \frac1R\sqrt{\frac LC} = \frac{\omega_0}{\Delta\omega}, \qquad \Delta\omega = \frac RL
```

`$\Delta\omega$` is the full width between the half-power points, where `$|X_L - X_C| = R$`. Those points are `$\omega_\pm = \sqrt{\omega_0^2 + (R/2L)^2} \pm R/2L$`: their product is `$\omega_0^2$`, so they are symmetric about `$\omega_0$` on a log scale.

<figure class="fig" data-fig="lcr-phasor"><figcaption>The phasor diagram of a series LCR circuit above its resonance curve. Below resonance V_C wins and the current leads; above, V_L wins and it lags; at resonance V_L and V_C cancel and each is Q times the source.</figcaption></figure>

Two facts that catch people: driven at resonance, the **total stored energy is constant** (it just moves between L and C while the source feeds the resistor), and the **capacitor voltage peaks slightly below** `$\omega_0$` (the inductor's slightly above), while current and power peak exactly at `$\omega_0$`.

**Parallel resonance.** An ideal `$L$` and `$C$` in parallel at `$\omega_0$` have infinite impedance: their currents cancel and the source supplies nothing while current circulates round the loop. With a coil of resistance `$R$` in parallel with `$C$`, unity power factor comes at `$\omega = \sqrt{1/LC - R^2/L^2}$`.

<div class="problem" data-problem="lcr-current"></div>

<div class="myth">

**"At resonance the capacitor and inductor voltages cancel, so they are small."** They cancel *each other*, but each is `$Q$` times the source. A 2 V signal into a circuit with `$Q = 50$` puts 100 V across the capacitor. That is how a radio tuner magnifies a weak station, and why capacitors in resonant circuits must be rated far above the supply voltage.

</div>

## 6. Power in AC circuits

For a sine wave, `$V_{\text{rms}} = V_0/\sqrt2$` (311 V peak mains is 220 V rms). Only resistance absorbs power on average:

```math
\langle P\rangle = V_{\text{rms}}I_{\text{rms}}\cos\phi = I_{\text{rms}}^2R
```

`$\cos\phi = R/Z$` is the **power factor**: 1 at resonance, 0 for a pure `$L$` or `$C$`. With `$R = 100\ \Omega$` on 200 V rms, the power is 400 W at resonance but 200 W where `$|X_L - X_C| = 100\ \Omega$` (a half-power point). For a mixed waveform `$v = a + b\sin\omega t$`, `$V_{\text{rms}} = \sqrt{a^2 + b^2/2}$`.

**Maximum power transfer.** A source of internal resistance `$r$` gives most power to a load `$R_L = r$`: `$P_{\max} = V^2/4r$`, at 50% efficiency. With a complex source impedance `$Z_s$`, the load must be its complex conjugate `$Z_s^*$` so the reactances cancel: for `$Z_s = 30 + 40j\ \Omega$` at 100 V, `$P_{\max} = 100^2/120 = 83.3$` W.

The [circuit simulator](/science/circuit-simulator/) runs transients and AC sweeps of any RLC netlist, the [analog filter designer](/science/filter-designer/) builds RC and LC filters from these ideas, and the [capacitor inductor calculator](/science/capacitor-inductor-calculator/) gives RC and RL time constants.

<div class="keypoints">

- RC: `$\tau = RC$`, `$V_C = V_0(1 - e^{-t/\tau})$`; RL: `$\tau = L/R$`. Half-life `$\tau\ln2$`; energy decays twice as fast. Use Thevenin for one-capacitor circuits.
- Charging from a battery always wastes half the energy; sharing between equal capacitors loses `$\tfrac14CV^2$`, whatever R.
- LC: `$\omega_0 = 1/\sqrt{LC}$`, `$I_{\max} = V_0\sqrt{C/L}$`. LCR critical at `$R = 2\sqrt{L/C}$`; `$\omega_d = \sqrt{\omega_0^2 - R^2/4L^2}$`.
- `$X_L = \omega L$` (current lags), `$X_C = 1/\omega C$` (current leads), `$Z = \sqrt{R^2 + (X_L - X_C)^2}$`, `$\tan\phi = (X_L - X_C)/R$`; voltages add as phasors.
- Resonance: `$Z = R$`, in phase, `$V_L = V_C = QV$`; `$Q = \omega_0L/R = \omega_0/\Delta\omega$`, `$\Delta\omega = R/L$`. Parallel LC: infinite impedance.
- `$\langle P\rangle = V_{\text{rms}}I_{\text{rms}}\cos\phi = I^2R$`; `$V_{\text{rms}} = V_0/\sqrt2$`. Max power: `$R_L = r$` (or `$Z_L = Z_s^*$`), `$P = V^2/4r$`.

</div>

## Practise: exam questions on this lesson

These start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [circuits practice page](/learn/courses/iit-jam-physics/practice/circuits/).

<div class="qbank" data-bank="physics" data-topics="circuits" data-exam="jam" data-n="10"></div>

**Next:** [Maxwell's equations and electromagnetic waves](/learn/courses/iit-jam-physics/maxwell-em-waves/), where the displacement current between capacitor plates completes the theory. The mechanical twin of the LCR circuit is in [damped and forced oscillations](/learn/courses/iit-jam-physics/damped-forced-oscillations/). Op-amp circuits are in [operational amplifiers](/learn/courses/iit-jam-physics/op-amps/). For network theorems and transmission lines at MSc level, see the GATE Physics course, from [amplifiers and feedback](/learn/courses/gate-physics/amplifiers-feedback/) to [waveguides](/learn/courses/gate-physics/waveguides/).
