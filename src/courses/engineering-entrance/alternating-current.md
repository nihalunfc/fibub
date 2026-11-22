---
title: 'Alternating current'
seoTitle: 'Alternating current: JEE and NEET physics'
summary: 'Peak, rms and average values, R, L and C on AC with reactance and phase, phasors, series LCR circuits, impedance, resonance, Q factor and bandwidth, power and power factor, wattless current, LC oscillations and the transformer with transmission losses.'
minutes: 32
updated: 2026-11-22
quiz:
  - q: 'In a series LCR circuit at resonance, the current is:'
    choices: ['zero', 'in phase with the voltage and largest', 'lagging by 90°', 'leading by 90°']
    ans: 1
    why: 'At resonance X_L = X_C, so Z = R (its smallest value) and φ = 0: the current is largest and in phase with the supply.'
  - q: 'An ideal inductor on an AC supply consumes an average power of:'
    choices: ['V_rms I_rms', 'zero', 'I²X_L', 'half of V_rms I_rms']
    ans: 1
    why: 'The current lags the voltage by 90°, so cos φ = 0. The inductor takes energy in one quarter cycle and returns it in the next.'
  - q: 'The rms value of the mains in India is 230 V. Its peak value is about:'
    choices: ['230 V', '325 V', '163 V', '460 V']
    ans: 1
    why: 'V₀ = √2 × V_rms = 1.414 × 230 ≈ 325 V.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Alternating currents'
  - 'Indian mains supply 230 V, 50 Hz: Bureau of Indian Standards IS 12360 (voltage bands) https://www.bis.gov.in'
---

**Physics · Class 12 · about 32 minutes.** By the end you will be able to find currents, phases and power in any series AC circuit, use resonance, and solve LC and transformer problems.

<div class="bigidea">On AC, resistors fight current in step with the voltage, while inductors and capacitors fight it a quarter cycle out of step. Draw each voltage as a rotating arrow (a phasor), add the arrows, and every series AC circuit becomes a right-angled triangle.</div>

## 1. Peak, rms and average

AC voltage `$v = V_0\sin\omega t$`, with ω = 2πf. Indian mains: f = 50 Hz.

- **rms value** (the steady DC value that heats a resistor equally): `$V_{\text{rms}} = V_0/\sqrt2$` for a sine wave. Meters read rms.
- **Average over a full cycle:** zero. Over half a cycle: `$2V_0/\pi \approx 0.637V_0$`.
- Other waves: square wave rms = peak; triangular wave rms = `$V_0/\sqrt3$`; half-wave rectified rms = V₀/2.

<div class="myth">

**"AC current averages to zero, so it cannot heat anything."** Heating goes as I², which is never negative. The average of I² is I₀²/2, so AC heats just like a DC current of I₀/√2.

</div>

Change N, B and the turning rate. Watch flux (cosine) and EMF (sine) as the coil turns; drag the picture to look from other angles.

<figure class="fig" data-fig="@em-generator"><figcaption>The EMF is largest when the coil is edge-on to B and zero when face-on, a quarter-turn out of step with the flux.</figcaption></figure>

## 2. R, L and C on AC

| Element | Opposition | Phase of current |
|---|---|---|
| Resistor | R | in phase with V |
| Inductor | `$X_L = \omega L$` | **lags** V by 90° |
| Capacitor | `$X_C = \dfrac{1}{\omega C}$` | **leads** V by 90° |

X_L grows with frequency (an inductor blocks high frequencies); X_C falls with frequency (a capacitor blocks DC completely and passes high frequencies). A handy memory: **ELI the ICE man**: in L, E (voltage) comes before I; in C, I comes before E.

Choose R, L, C or the series circuit and slide the frequency across 1. Compare the turning arrows with the two waves.

<figure class="fig" data-fig="@em-phasor-rlc"><figcaption>For L the voltage leads the current by 90°, for C it lags by 90°; in the series circuit the phase flips from lagging to leading as ω crosses ω₀.</figcaption></figure>

## 3. Series LCR: impedance and phase

The same current flows through all three. Their voltages are phasors at right angles: V_R along I, V_L 90° ahead, V_C 90° behind. Adding them:

```math
V = \sqrt{V_R^2 + (V_L - V_C)^2}, \qquad Z = \sqrt{R^2 + (X_L - X_C)^2}, \qquad \tan\varphi = \frac{X_L - X_C}{R}
```

<div class="meaning">
<dl>
<dt>Z</dt><dd>impedance, the total opposition (Ω); I_rms = V_rms/Z</dd>
<dt>φ</dt><dd>phase angle by which the current lags the voltage (negative means it leads)</dd>
<dt>X_L, X_C</dt><dd>reactances of the inductor and capacitor (Ω)</dd>
<dt>Physical meaning</dt><dd>The inductor and capacitor voltages point in opposite directions, so they partly cancel. That is why the separate voltages can add up to more than the supply voltage.</dd>
</dl>
</div>

<div class="problem" data-problem="ac-lcr-current"></div>

## 4. Resonance

When `$X_L = X_C$`, the reactances cancel, Z = R and the current is largest. This happens at

```math
\omega_0 = \frac{1}{\sqrt{LC}}, \qquad f_0 = \frac{1}{2\pi\sqrt{LC}}
```

Move the frequency and the parts below to see the peak.

<figure class="fig" data-fig="lcr-resonance"><figcaption>rms current in a series LCR circuit on a 10 V supply as the frequency changes. The peak is at f₀, where the current is V/R and in phase with the voltage. Lower R gives a taller, sharper peak.</figcaption></figure>

<div class="problem" data-problem="ac-resonance"></div>

**Sharpness.** The quality factor `$Q = \dfrac{\omega_0 L}{R} = \dfrac1R\sqrt{\dfrac LC}$`. The half-power frequencies (current = I_max/√2) are ω₀ ± R/2L, so the bandwidth is `$\Delta\omega = R/L$` and `$Q = \omega_0/\Delta\omega$`. At resonance the voltage across L (or C) is Q times the supply voltage, which can be dangerously large. A radio tunes to a station by changing C until f₀ matches the station.

Parallel LC resonance is the opposite: the current from the supply is **smallest** (ideally zero) at f₀.

## 5. Power and power factor

Average power in an AC circuit:

```math
P = V_{\text{rms}}I_{\text{rms}}\cos\varphi = I_{\text{rms}}^2 R
```

cos φ = R/Z is the **power factor**. Only the resistor uses energy; L and C store and return it. The part of the current at 90° to the voltage, `$I_{\text{rms}}\sin\varphi$`, is the **wattless current**. Factories add capacitors to bring cos φ close to 1, cutting the current (and line losses) for the same useful power. A **choke coil** (an inductor) limits current in a tube light with almost no power loss, unlike a resistor.

## 6. LC oscillations

A charged capacitor joined to an inductor swaps energy back and forth between electric (q²/2C) and magnetic (½LI²) forms, like a mass on a spring:

```math
q = Q_0\cos\omega t, \qquad \omega = \frac{1}{\sqrt{LC}}, \qquad I_{\max} = \omega Q_0 = \frac{Q_0}{\sqrt{LC}}
```

L plays the part of mass, 1/C of the spring constant, q of displacement and I of velocity. Energy is all magnetic at a quarter period. A resistor in the circuit makes the oscillation die away (damping).

Change L and C and press play; then add resistance. Follow the energy as it passes between the capacitor and the coil.

<figure class="fig" data-fig="@em-lc-swing"><figcaption>Electric and magnetic energy trade places while the total stays fixed. Resistance makes the swings die away.</figcaption></figure>

## 7. Transformers

Two coils on one iron core. For an ideal transformer, `$\dfrac{V_s}{V_p} = \dfrac{N_s}{N_p} = \dfrac{I_p}{I_s}$`. Step-up raises voltage and lowers current; power in = power out. Real losses: copper (I²R in windings), eddy currents (reduced by laminated cores), hysteresis (soft iron), and flux leakage. Efficiency η = P_out/P_in.

<div class="problem" data-problem="ac-transformer"></div>

**Why high-voltage transmission?** For the same power P, line current is P/V, so the line loss I²R falls as 1/V². Stepping 11 kV up to 220 kV cuts the loss 400 times.

**Worked example (level 4).** R = 30 Ω, X_L = 80 Ω, X_C = 40 Ω on 200 V rms. Z = √(900 + 1600) = 50 Ω. I = 4 A. cos φ = 30/50 = 0.6, current lags by 53°. Power = 200 × 4 × 0.6 = 480 W = I²R = 16 × 30 ✓. Voltmeters read V_R = 120 V, V_L = 320 V, V_C = 160 V: V_L alone is more than the supply.

Change the number of turns, the load and the efficiency. Compare the two voltages and currents.

<figure class="fig" data-fig="@em-transformer"><figcaption>The voltage ratio equals the turns ratio; the current ratio is the opposite, so power in is power out (less any losses).</figcaption></figure>

<div class="keypoints">

- V_rms = V₀/√2; half-cycle average 2V₀/π; full-cycle average zero.
- X_L = ωL (current lags 90°); X_C = 1/ωC (current leads 90°).
- Z = √(R² + (X_L − X_C)²), tan φ = (X_L − X_C)/R; add voltages as phasors, not numbers.
- Resonance f₀ = 1/2π√(LC): Z = R, φ = 0, current largest; Q = ω₀L/R, bandwidth R/L.
- P = V_rms I_rms cos φ = I²R; ideal L or C use no power; wattless current I sin φ.
- LC: ω = 1/√(LC), I_max = Q₀/√(LC); L ↔ mass, 1/C ↔ spring constant.
- Transformer V_s/V_p = N_s/N_p = I_p/I_s; line loss ∝ 1/V².

</div>
