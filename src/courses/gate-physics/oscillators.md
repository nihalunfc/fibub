---
title: Oscillators
summary: 'Sinusoidal and relaxation oscillators at GATE depth: the Barkhausen criterion as a pole pair on the imaginary axis, the RC phase-shift oscillator (gain 29), the Wien bridge (gain 3, unequal parts), LC oscillators (Colpitts, Hartley, Clapp), quartz crystals with series and parallel resonance and huge Q, amplitude stabilisation, and relaxation oscillators.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: 'A three-section RC phase-shift oscillator (equal R and C, high-pass ladder) oscillates at'
    choices: ['1/(2π√6 RC), with amplifier gain at least 29', '1/(2πRC), with gain at least 3', '√6/(2πRC), with gain at least 29', '1/(2π√3 RC), with gain at least 8']
    ans: 0
    why: 'The ladder gives 180° of phase at ω = 1/(√6 RC), where it attenuates by 29; an inverting amplifier supplies the other 180° and must have gain at least 29.'
  - q: 'A Colpitts oscillator has L = 100 µH and C₁ = C₂ = 2 nF. Its frequency is about'
    choices: ['503 kHz', '356 kHz', '252 kHz', '1.0 MHz']
    ans: 0
    why: 'The capacitors are in series: C = 1 nF. f = 1/(2π√(10⁻⁴ × 10⁻⁹)) = 503 kHz.'
  - q: 'Why does a practical Wien bridge oscillator need an amplitude-control element (a lamp, thermistor, diodes or an AGC loop)?'
    choices: ['Gain exactly 3 cannot be held; slightly more grows, slightly less dies, so the gain must fall as the amplitude rises', 'to set the frequency', 'to supply the 180° phase shift', 'to remove the need for an amplifier']
    ans: 0
    why: 'Starting needs loop gain above 1; a steady amplitude needs exactly 1. A non-linear element that lowers the gain at large amplitude settles it at exactly 1, with little distortion if it acts slowly.'
sources:
  - 'A. S. Sedra and K. C. Smith, Microelectronic Circuits, 7th ed. (2015), chapter 18'
  - 'P. Horowitz and W. Hill, The Art of Electronics, 3rd ed. (2015), chapter 7'
  - 'J. Millman and C. C. Halkias, Integrated Electronics (1972), chapter 14'
  - 'GATE Physics (PH) syllabus, Electronics section, published by the organising IIT each year'
---

**Module 9 · about 40 minutes.** [Lesson 9.2](/learn/courses/gate-physics/amplifiers-feedback/) warned that a feedback loop whose phase reaches −180° with gain above 1 oscillates. An oscillator is that loop built on purpose, with a frequency-selective network that makes it happen at exactly one frequency. The relaxation oscillators of [lesson 9.3](/learn/courses/gate-physics/op-amp-circuits/) are the other family.

<div class="bigidea">A sinusoidal oscillator is an amplifier A and a filter β in a loop. It oscillates at the frequency where the loop phase is a whole number of turns, provided the loop gain there is at least 1. Starting needs a little more than 1; a steady amplitude needs exactly 1, so every real oscillator has some non-linearity that lowers the gain as the amplitude grows.</div>

## 1. The Barkhausen criterion

With positive feedback the closed-loop gain is `$A/(1 - A\beta)$`. It becomes infinite, an output with no input, when

```math
A(j\omega_0)\beta(j\omega_0) = 1 \quad\Longleftrightarrow\quad |A\beta| = 1 \ \text{ and } \ \angle A\beta = 0^\circ \ (\text{or } 360^\circ n)
```

<div class="steps">
<div class="step"><p><b>Phase picks the frequency.</b> The filter network's phase changes with ω; only at ω₀ does the loop phase come back to zero. A sharper phase change (higher Q) means a more stable frequency.</p></div>
<div class="step"><p><b>Gain decides whether it runs.</b> Seen as a differential equation, the loop has a pair of complex poles at σ ± jω₀ with σ ∝ (Aβ − 1). Loop gain above 1 puts them in the right half-plane: the oscillation grows as e^{σt}. Below 1, it dies.</p></div>
<div class="step"><p><b>Non-linearity fixes the amplitude.</b> As the amplitude grows, the amplifier begins to saturate and its average gain falls, until the poles sit exactly on the imaginary axis. Gentle limiting gives a cleaner sine than hard clipping.</p></div>
</div>

**Start-up comes from noise.** No input is needed: thermal noise and the switch-on transient contain every frequency, and the one that satisfies the criterion grows.

## 2. RC oscillators

**RC phase shift.** An inverting amplifier (180°) drives three identical RC sections, which must supply the other 180°. Solving the ladder:

```math
\frac{V_{out}}{V_{in}} = \frac1{1 - 5/x^2 - j(6/x - 1/x^3)}, \quad x = \omega RC \quad\Rightarrow\quad \omega_0 = \frac1{\sqrt6\,RC}, \quad |\beta| = \frac1{29}
```

so the amplifier needs a gain of at least 29. (With low-pass sections, series R and shunt C, the frequency is `$\sqrt6/RC$` and the gain is still 29.) With `$R = 10$` kΩ and `$C = 10$` nF: `$f_0 = 650$` Hz.

**Wien bridge.** A series RC and a parallel RC form a band-pass divider with zero phase at its peak; a non-inverting amplifier closes the loop. For equal parts:

```math
\beta(j\omega) = \frac1{3 + j(\omega RC - 1/\omega RC)}, \qquad \omega_0 = \frac1{RC}, \qquad |\beta(\omega_0)| = \frac13
```

The amplifier needs gain 3, usually `$1 + R_f/R_1$` with `$R_f = 2R_1$`. With `$R = 10$` kΩ and `$C = 16$` nF: `$f_0 = 995$` Hz. Tuning both capacitors together (a ganged capacitor) sweeps the frequency over a decade with constant amplitude, which made the Wien bridge the classic audio oscillator. With unequal parts, `$\omega_0 = 1/\sqrt{R_1R_2C_1C_2}$` and the gain needed is `$1 + R_1/R_2 + C_2/C_1$`.

<div class="problem" data-problem="wien-unequal"></div>

<figure class="fig" data-fig="wien-oscillator"><figcaption>Top: phase and magnitude of the Wien loop gain Kβ; the phase crosses zero only at ω₀, where |Kβ| = K/3. Bottom: the output after a tiny kick, integrated numerically. With an ideal amplifier it grows for K &gt; 3 and decays for K &lt; 3; with soft limiting it settles to a fixed amplitude that grows with the excess gain.</figcaption></figure>

## 3. LC oscillators

For radio frequencies an LC tank replaces the RC network. In the general three-reactance circuit, the tank is `$X_1$` from input to ground, `$X_2$` from output to ground and `$X_3$` between them; oscillation needs `$X_1 + X_2 + X_3 = 0$`, with `$X_1, X_2$` of the same kind and `$X_3$` of the other.

Watch an LC tank ring and see what loop gain does to its amplitude.

<figure class="fig" data-fig="@sx-lc-tank"><figcaption>Below G = 1 the ringing dies; above it a tiny kick grows until the amplifier saturates and the gain drops back to 1. Higher Q grows more slowly but gives a purer frequency.</figcaption></figure>

| Oscillator | Tank | Frequency | Gain condition |
|---|---|---|---|
| Colpitts | two capacitors, one inductor | `$\dfrac1{2\pi\sqrt{LC_1C_2/(C_1 + C_2)}}$` | `$g_mR \ge C_2/C_1$` |
| Hartley | two inductors (mutual `$M$`), one capacitor | `$\dfrac1{2\pi\sqrt{(L_1 + L_2 + 2M)C}}$` | `$g_mR \ge (L_1 + M)/(L_2 + M)$` |
| Clapp | Colpitts with a small `$C_3$` in series with `$L$` | `$\approx\dfrac1{2\pi\sqrt{LC_3}}$` when `$C_3 \ll C_1, C_2$` | as Colpitts |

**Worked example.** `$L = 100$` µH with `$C_1 = C_2 = 2$` nF: series capacitance 1 nF, `$f_0 = 503$` kHz. A Hartley tank with `$L_1 = L_2 = 50$` µH (no coupling) and `$C = 1$` nF gives the same frequency. The Clapp version is less sensitive to the transistor's own capacitances, which sit across `$C_1$` and `$C_2$` and are swamped there.

<div class="problem" data-problem="colpitts-frequency"></div>

## 4. Crystal oscillators

A quartz crystal is a piezoelectric resonator. Its electrical equivalent is a series `$L$`, `$C$`, `$R$` (the mechanical resonance) in parallel with the holder capacitance `$C_0$`:

```math
f_s = \frac1{2\pi\sqrt{LC}}, \qquad f_p = f_s\sqrt{1 + \frac C{C_0}} \approx f_s\left(1 + \frac C{2C_0}\right), \qquad Q = \frac1R\sqrt{\frac LC}
```

<div class="meaning">

<dl>
<dt>`$f_s$`</dt><dd>series resonance: the impedance is a minimum, just `$R$`</dd>
<dt>`$f_p$`</dt><dd>parallel (anti-)resonance: the impedance is a maximum; between `$f_s$` and `$f_p$` the crystal is inductive, and a Pierce or Colpitts circuit uses it as the inductor there</dd>
<dt>`$C/C_0$`</dt><dd>tiny (around 10⁻³), so `$f_p$` is only a fraction of a percent above `$f_s$` and the crystal fixes the frequency whatever the rest of the circuit does</dd>
<dt>`$Q$`</dt><dd>10⁴ to 10⁶, compared with about 100 for an LC tank: the phase changes so steeply with frequency that the oscillator cannot drift far</dd>
</dl>

</div>

**Worked example.** `$L = 0.5$` H, `$C = 0.05$` pF, `$R = 50$` Ω, `$C_0 = 5$` pF: `$f_s = 1.0066$` MHz, `$f_p - f_s = 5.0$` kHz, and `$Q = 63\,000$`. Watch crystals use 32 768 Hz = 2¹⁵ Hz, so a chain of 15 flip-flops ([lesson 9.6](/learn/courses/gate-physics/sequential-logic/)) divides it to exactly 1 Hz.

**Relaxation oscillators** (astable multivibrators, 555 timers, the UJT oscillator) charge a capacitor until a threshold switches the circuit, then discharge it. They give square or triangle waves, and their frequency depends on an RC time constant and two thresholds rather than on a resonance; their frequency stability is much worse than a crystal's. A **voltage-controlled oscillator** makes the charging current proportional to an input voltage, so the frequency follows the voltage.

<div class="myth">

**"Set the loop gain to exactly 1 and the oscillator will run with a steady amplitude."** A linear loop with gain exactly 1 is marginal: any drift in the components makes the amplitude grow without limit or die away. Real oscillators start with gain above 1 and rely on a non-linearity (saturation, a thermistor, a lamp, diodes, or an automatic gain control loop) to bring the average gain down to 1 at the operating amplitude. The figure shows both cases.

</div>

<div class="keypoints">

- Barkhausen: `$A\beta = 1$`; phase sets `$\omega_0$`, gain at least 1 to start, exactly 1 (by non-linearity) to run steadily.
- RC phase shift: `$\omega_0 = 1/\sqrt6RC$` (high-pass ladder), gain 29.
- Wien: `$\omega_0 = 1/RC$`, gain 3; unequal parts `$1/\sqrt{R_1R_2C_1C_2}$` and `$1 + R_1/R_2 + C_2/C_1$`.
- Colpitts: `$C = C_1C_2/(C_1 + C_2)$`; Hartley: `$L = L_1 + L_2 + 2M$`; Clapp: `$\approx 1/2\pi\sqrt{LC_3}$`.
- Crystal: `$f_p \approx f_s(1 + C/2C_0)$`, `$Q = \sqrt{L/C}/R \sim 10^4$`–`$10^6$`; inductive between `$f_s$` and `$f_p$`.

</div>

## Practise: exam questions on this lesson

<div class="qbank" data-bank="physics" data-topics="oscillators" data-exam="gate" data-n="10"></div>

**Next:** [lesson 9.5](/learn/courses/gate-physics/combinational-logic/) leaves analogue circuits for logic: Boolean algebra, Karnaugh maps, adders and multiplexers.
