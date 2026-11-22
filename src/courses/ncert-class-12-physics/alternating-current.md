---
title: Alternating Current
seoTitle: 'Alternating Current Class 12 notes: LCR, resonance, power'
summary: 'Class 12 Alternating Current with animations: rms values, phasors, reactance, series LCR, resonance and Q, power factor, transformers and power transmission.'
minutes: 60
updated: 2026-11-22
quiz:
  - q: 'An AC supply has a peak voltage of 311 V. Its rms voltage is about:'
    choices: ['311 V', '220 V', '440 V', '155 V']
    ans: 1
    why: 'V_rms = V₀/√2 = 311/1.414 ≈ 220 V. The rms value is the steady DC voltage that would heat a heater equally.'
  - q: 'A pure capacitor is connected to an AC source. The current:'
    choices: ['lags the voltage by 90°', 'leads the voltage by 90°', 'is in phase with the voltage', 'is zero']
    ans: 1
    why: 'i = dq/dt = C dv/dt, so the current is greatest when the voltage is changing fastest, a quarter cycle before the voltage peaks: i leads v by 90°.'
  - q: 'In a series LCR circuit at resonance, which statement is true?'
    choices: ['X_L = X_C and the impedance is smallest, equal to R', 'X_L = 0', 'The current is zero', 'The power factor is zero']
    ans: 0
    why: 'At resonance the two reactances cancel, so Z = R (its minimum), the current is largest and in phase with the voltage, and cos φ = 1.'
sources:
  - 'NCERT Class 12 Physics, Chapter 7 “Alternating Current” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Mains voltage and frequency in India: Central Electricity Authority, Indian Electricity Rules (230 V, 50 Hz nominal supply)'
  - 'Transmission voltages: Power Grid Corporation of India, public descriptions of 400 kV and 765 kV lines'
---

**Physics · Class 12 · Chapter 7 · about 60 minutes.** By the end you will be able to explain what rms values and phasors are, find the reactance and impedance of an R, L, C circuit, work out resonance, Q and power factor, and explain how a transformer and high-voltage lines bring power to your home.

<div class="bigidea">The mains is a voltage that swings back and forth 50 times a second. A resistor does not mind, but a coil and a capacitor store and return energy, so their current runs a quarter-cycle behind or ahead of the voltage. Draw each voltage as a turning arrow (a phasor), add the arrows, and the whole circuit is just Pythagoras.</div>

## 1. AC voltage across a resistor

A cell gives **direct current (DC)**: the push is always the same way. The socket on your wall gives **alternating current (AC)**: the voltage keeps reversing, following a sine curve.

```math
v = V_0 \sin \omega t, \qquad \omega = 2\pi f
```

Here `$V_0$` is the **peak** (maximum) voltage, `$f$` the frequency (50 Hz in India, so one cycle takes 20 ms) and `$\omega$` the angular frequency. Put this across a resistor `$R$`. Ohm's law holds at every instant, so

```math
i = \frac{v}{R} = \frac{V_0}{R}\sin\omega t = I_0 \sin\omega t
```

The current rises and falls **exactly with** the voltage: they are **in phase**. The current reverses 100 times a second but the heater still gets hot, because the heat `$i^2R$` is never negative.

<figure class="fig" data-fig="c12p-ac-wave"><figcaption>Change the peak voltage and the frequency. The dashed lines mark the peak and the rms value. Compare with a DC supply that heats equally.</figcaption></figure>

**Why not just average?** Over a full cycle the average of `$v$` is zero, which tells us nothing about heating. Heating goes as `$v^2$`, so we average the square instead. The **rms (root mean square) value** is the square root of the mean of the square.

<div class="steps" data-fig="c12p-ac-rms">
<div class="step">Start with the voltage v = V₀ sin ωt: half the time positive, half negative.</div>
<div class="step">Square it. Now it is never negative, and it swings between 0 and V₀².</div>
<div class="step">Over a whole number of cycles sin² has an average of exactly ½ (sin² + cos² = 1 and each averages the same), so the mean of v² is V₀²/2.</div>
<div class="step">Take the square root: V<sub>rms</sub> = V₀/√2 ≈ 0.707 V₀. The same for current: I<sub>rms</sub> = I₀/√2. The 230 V on a socket is rms, so its peak is about 325 V.</div>
</div>

```math
V_{rms} = \frac{V_0}{\sqrt 2}, \qquad I_{rms} = \frac{I_0}{\sqrt 2}, \qquad P_{avg} = I_{rms}^2 R = V_{rms} I_{rms}
```

<div class="meaning">
<dl>
<dt>V₀, I₀</dt><dd>peak (maximum) voltage and current</dd>
<dt>V<sub>rms</sub>, I<sub>rms</sub></dt><dd>the steady DC values that would give the same heating in a resistor; what meters and labels show</dd>
<dt>ω</dt><dd>angular frequency, 2πf, in radians per second (about 314 rad/s for 50 Hz)</dd>
<dt>Physical meaning</dt><dd>An AC ammeter reads I<sub>rms</sub>, not the peak, because what matters for energy is the heating effect.</dd>
</dl>
</div>

<div class="problem" data-problem="c12p-ac-rms"></div>

<div class="myth">

**“A 230 V AC supply is 230 V at every instant.”** 230 V is the rms value. The voltage actually swings between +325 V and −325 V, passing through zero twice every cycle.

</div>

Compare AC and DC and test other waveforms in the rms tool: [RMS waveform](/learn/rms-waveform/).

## 2. Phasors: voltage and current as turning arrows

Sines are awkward to add. A **phasor** is an arrow of length `$V_0$` turning anticlockwise at angular speed `$\omega$`. Its **vertical shadow** is `$V_0 \sin(\omega t)$`. To compare a voltage and a current we draw two arrows with the angle between them, the **phase difference** `$\varphi$`. Two sines of the same frequency can then be added as two arrows, tip to tail.

<figure class="fig" data-fig="c12p-ac-phasor"><figcaption>Choose a resistor, inductor or capacitor. The arrows turn; the curves on the right are their vertical shadows. The current arrow is level with the voltage for R, 90° behind for L, 90° ahead for C.</figcaption></figure>

## 3. AC across an inductor

An inductor of inductance `$L$` opposes change in current. With a changing current the induced emf is `$-L\,di/dt$`, and for an ideal coil (no resistance) the source voltage must balance it:

```math
v = L\frac{di}{dt} = V_0\sin\omega t \;\Longrightarrow\; \frac{di}{dt} = \frac{V_0}{L}\sin\omega t
```

Integrating, with no steady current:

```math
i = -\frac{V_0}{\omega L}\cos\omega t = \frac{V_0}{\omega L}\sin\!\left(\omega t - \frac{\pi}{2}\right)
```

The peak current is `$I_0 = V_0/\omega L$`, so the coil behaves like a resistance called the **inductive reactance**:

```math
X_L = \omega L = 2\pi f L \quad(\text{unit: ohm})
```

The current **lags** the voltage by 90° (a quarter cycle). The reactance grows with frequency: a coil lets slow AC (and DC, where `$f=0$`) pass but chokes fast AC. That is why a coil is called a **choke**.

<figure class="fig" data-fig="c12p-ac-slope"><figcaption>Why 90°? For the inductor the voltage is the <i>slope</i> of the current curve. Drag the time slider: where the current curve climbs fastest, the voltage is at its peak, and the current peak comes a quarter cycle later. Switch to the capacitor to see the roles swap.</figcaption></figure>

**Energy:** the coil takes energy while the current rises and gives it all back while it falls, so its average power is zero.

## 4. AC across a capacitor

A capacitor of capacitance `$C$` holds charge `$q = Cv$`. A current flows only while the charge changes:

```math
i = \frac{dq}{dt} = C\frac{dv}{dt} = \omega C V_0 \cos\omega t = \omega C V_0 \sin\!\left(\omega t + \frac{\pi}{2}\right)
```

So `$I_0 = \omega C V_0 = V_0 / X_C$` with the **capacitive reactance**

```math
X_C = \frac{1}{\omega C} = \frac{1}{2\pi f C}
```

The current **leads** the voltage by 90°. Reactance falls as frequency rises: a capacitor blocks DC (`$f = 0$`, `$X_C \to \infty$`) and passes fast AC. Like the coil, it uses no average power.

<figure class="fig" data-fig="c12p-ac-reactance"><figcaption>X<sub>L</sub> climbs in a straight line with frequency; X<sub>C</sub> falls as 1/f. Change L and C to move the crossing point f₀.</figcaption></figure>

<div class="problem" data-problem="c12p-ac-reactance"></div>

<div class="myth">

**“A capacitor lets current flow through the gap.”** No charge crosses the gap between the plates. The AC current in the wires is the charge piling up and draining away again each half cycle. (Chapter 8 shows how the changing field in the gap continues the current.)

</div>

**Memory aid: ELI the ICE man.** With L (inductance) the voltage E comes before the current I (ELI); with C the current I comes before E (ICE).

## 5. Series LCR circuit

Now join `$R$`, `$L$` and `$C$` in series to an AC source. In series the **same current** flows through all three, so we draw the current phasor `$I$` as the reference and put each voltage relative to it:

- `$V_R = IR$` along `$I$` (in phase);
- `$V_L = IX_L$` **90° ahead** of `$I$`;
- `$V_C = IX_C$` **90° behind** `$I$`.

The source voltage is the arrow sum of the three.

<div class="steps" data-fig="c12p-ac-lcrsteps">
<div class="step">In a series circuit the current is the same in R, L and C, so take the current phasor as the reference arrow.</div>
<div class="step">V_R points along I; V_L is drawn 90° ahead of I; V_C is drawn 90° behind. Here I = 1 A, R = 3 Ω, X_L = 7 Ω, X_C = 3 Ω.</div>
<div class="step">V_L and V_C lie on the same line but point opposite ways, so they partly cancel: the net is V_L − V_C = 4 V.</div>
<div class="step">V_R and (V_L − V_C) are at right angles, so V = √(V_R² + (V_L − V_C)²). Here it is √(3² + 4²) = 5 V.</div>
<div class="step">Divide every side by I: the impedance triangle with sides R, X = X_L − X_C and hypotenuse Z. Z = 5 Ω and tan φ = 4/3.</div>
</div>

```math
V = I\sqrt{R^2 + (X_L - X_C)^2} \;\Longrightarrow\; Z = \sqrt{R^2 + (X_L - X_C)^2}, \qquad I_0 = \frac{V_0}{Z}
```

```math
\tan\varphi = \frac{X_L - X_C}{R}
```

<div class="meaning">
<dl>
<dt>Z</dt><dd>impedance, in ohms: the total opposition to AC; the smallest it can be is R</dd>
<dt>X = X_L − X_C</dt><dd>net reactance; positive means inductive</dd>
<dt>φ</dt><dd>angle by which the voltage is ahead of the current (positive when X_L &gt; X_C, so the current lags)</dd>
<dt>Physical meaning</dt><dd>L and C push the current in opposite directions in time, so their effects partly cancel; only R wastes energy.</dd>
</dl>
</div>

<figure class="fig" data-fig="@em-phasor-rlc"><figcaption>The full series LCR with turning phasors: change R, L, C and the frequency and watch the phase angle and impedance.</figcaption></figure>

<!--fig:tool lcr-phasors-->

<div class="problem" data-problem="c12p-ac-impedance"></div>

## 6. Resonance, Q factor and bandwidth

Sweep the supply frequency. `$X_L$` rises and `$X_C$` falls, so at one frequency they are equal. There `$X_L = X_C$`, the impedance is `$Z = R$` (its minimum), the current is largest and **in phase** with the voltage. This is **resonance**:

```math
\omega_0 L = \frac{1}{\omega_0 C}\;\Longrightarrow\; \omega_0 = \frac{1}{\sqrt{LC}},\qquad f_0 = \frac{1}{2\pi\sqrt{LC}}
```

<figure class="fig" data-fig="c12p-ac-resonance"><figcaption>The resonance curve of current against frequency. A small R gives a tall, narrow peak; a large R a low, wide one. The shaded band is where the current is at least 1/√2 of the peak: the bandwidth.</figcaption></figure>

The sharpness of the peak is measured by the **quality factor**:

```math
Q = \frac{\omega_0 L}{R} = \frac{1}{\omega_0 C R} = \frac{1}{R}\sqrt{\frac{L}{C}}, \qquad \text{bandwidth } \Delta f = \frac{f_0}{Q}
```

A large `$Q$` means a narrow band: a good tuner. **Radio tuning** is resonance: turning the dial of an old radio changes `$C$`, and the circuit responds strongly only to the station whose frequency equals `$f_0$` (for example, a 98.3 MHz FM station) while the others give almost no current.

<div class="problem" data-problem="c12p-ac-resonance"></div>

## 7. Power in an AC circuit

The instantaneous power is `$p = vi$`. If the current lags by `$\varphi$`, then `$v = V_0\sin\omega t$` and `$i = I_0\sin(\omega t - \varphi)$`, and

```math
p = V_0 I_0 \sin\omega t\,\sin(\omega t-\varphi) = \tfrac12 V_0 I_0\left[\cos\varphi - \cos(2\omega t - \varphi)\right]
```

The second term averages to zero, so the average power is

```math
P = \tfrac12 V_0I_0\cos\varphi = V_{rms}I_{rms}\cos\varphi
```

`$\cos\varphi$` is the **power factor**. For the series circuit `$\cos\varphi = R/Z$`.

<figure class="fig" data-fig="c12p-ac-power"><figcaption>Slide φ. The green area is energy flowing to the load; the orange area is energy flowing back. At φ = 0 only green: all the energy is used. At φ = 90° the two areas are equal: nothing is used up.</figcaption></figure>

- **Resistor or resonance:** φ = 0, cos φ = 1, full power.
- **Pure L or pure C:** φ = ±90°, cos φ = 0, no power used. The current is called **wattless (idle) current**: it flows, but does no net work.
- **Why power factor matters:** to deliver a given power `$P$` at voltage `$V$` needs `$I = P/(V\cos\varphi)$`. A low power factor (like a big motor) needs more current, so more heat loss in the lines. Factories fit capacitors to bring cos φ back near 1, and electricity boards charge a penalty for a low power factor.

<div class="problem" data-problem="c12p-ac-power"></div>

## 8. Transformers

A **transformer** changes an AC voltage up or down. Two coils (primary with `$N_p$` turns, secondary with `$N_s$` turns) are wound on one **soft iron core**. AC in the primary makes an alternating magnetic flux in the core; nearly all of it passes through the secondary and induces an emf there (Faraday's law).

<div class="steps" data-fig="c12p-ac-transformer">
<div class="step">AC in the primary coil sets up a magnetic flux in the iron core that rises, falls and reverses with the supply.</div>
<div class="step">The core guides the flux through the secondary coil too, so the same changing flux links both coils.</div>
<div class="step">Faraday's law: each turn has the same emf, so V<sub>s</sub>/V<sub>p</sub> = N<sub>s</sub>/N<sub>p</sub>. Here 200/100 turns: 230 V in, 460 V out. More secondary turns: step-up. Fewer: step-down.</div>
<div class="step">An ideal transformer wastes nothing, so V<sub>p</sub>I<sub>p</sub> = V<sub>s</sub>I<sub>s</sub>. When the voltage doubles the current halves.</div>
<div class="step">Real losses: copper loss in the windings (use thick wire), eddy currents in the core (use thin insulated laminations), hysteresis (use soft iron) and flux leakage. Efficiency 95 to 99 %.</div>
</div>

```math
\frac{V_s}{V_p} = \frac{N_s}{N_p} = \frac{I_p}{I_s}\quad(\text{ideal})
```

<!--fig:tool transformer-calculator-->

<div class="problem" data-problem="c12p-ac-transformer"></div>

**Why AC wins for power supply.** Power plants send energy over hundreds of kilometres. The power lost in the line is `$I^2R$` and `$I = P/V$`, so sending at a **higher voltage** cuts the current and the loss enormously. Stations generate at about 11 kV, transformers raise it to 220 or 400 kV for the long line, and transformers near your town bring it down to 11 kV, then to 230 V at the pole outside your home. This only works because a transformer needs AC.

<figure class="fig" data-fig="c12p-ac-grid"><figcaption>Send 10 MW along the same line at higher and higher voltage. The current falls in proportion and the heat lost falls with its square.</figcaption></figure>

<div class="problem" data-problem="c12p-ac-loss"></div>

<div class="history">

<ul class="timeline">
<li><b>1831</b> Michael Faraday discovers electromagnetic induction, the basis of the generator and the transformer.</li>
<li><b>1880s</b> The “war of the currents”: Edison’s DC against Tesla and Westinghouse’s AC; AC wins because transformers make long-distance transmission cheap.</li>
<li><b>1902</b> India’s first large hydro-electric station at Shivanasamudram (Karnataka) sends power over a long high-voltage line to the Kolar Gold Fields.</li>
</ul>

</div>

> **Beyond the syllabus.** LC oscillations: a charged capacitor joined to a coil swings its energy back and forth at `$f_0 = 1/(2\pi\sqrt{LC})$`, like a mass on a spring. The 2023 book does not examine it, but see it in action below.

<figure class="fig" data-fig="@em-lc-swing"><figcaption>Beyond the syllabus: energy sloshing between a capacitor and an inductor.</figcaption></figure>

<div class="keypoints">

- Mains: v = V₀ sin ωt with ω = 2πf. V<sub>rms</sub> = V₀/√2 and I<sub>rms</sub> = I₀/√2; meters show rms. India: 230 V, 50 Hz (peak ≈ 325 V).
- Resistor: i in phase with v. Inductor: X_L = ωL, i lags by 90°. Capacitor: X_C = 1/ωC, i leads by 90°. L and C use no average power.
- Series LCR: Z = √(R² + (X_L − X_C)²), I = V/Z, tan φ = (X_L − X_C)/R.
- Resonance: X_L = X_C, Z = R, f₀ = 1/(2π√LC), current maximum and in phase.
- Q = ω₀L/R = (1/R)√(L/C); bandwidth Δf = f₀/Q. High Q means sharp tuning.
- Average power P = V_rms I_rms cos φ; cos φ = R/Z is the power factor. Pure L or C: cos φ = 0, wattless current.
- Transformer: V_s/V_p = N_s/N_p = I_p/I_s (ideal). Step-up has N_s &gt; N_p. Losses: copper, eddy current, hysteresis, flux leakage.
- Long-distance lines use high voltage to cut I²R loss.

</div>

Going further for JEE/NEET: [Alternating current (engineering entrance)](/learn/courses/engineering-entrance/alternating-current/) for exam-level problems. Also try the [circuit simulator](/science/circuit-simulator/) for your own LCR circuits.
