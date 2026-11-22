---
title: p-n junctions, diodes and Zener diodes
seoTitle: p-n junctions, diodes and Zener diodes for IIT JAM
summary: 'How a p-n junction forms its depletion layer and built-in potential, why it conducts one way, the diode equation, load lines and dynamic resistance, junction capacitance, Zener and avalanche breakdown, Zener regulators, rectifiers and filters, and LEDs, photodiodes and solar cells.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'In a p⁺-n junction (acceptors far more than donors), where is most of the depletion region?'
    choices: ['On the lightly doped n side', 'On the heavily doped p side', 'Equally on both sides', 'Outside the junction']
    ans: 0
    why: 'The charges on the two sides balance: N_a x_p = N_d x_n. With N_a much larger, x_n must be much wider.'
  - q: 'An ideal diode at room temperature (V_T ≈ 25 mV) carries 1 mA. What is its dynamic resistance?'
    choices: ['About 25 Ω', 'About 700 Ω', 'About 0.025 Ω', 'Infinite']
    ans: 0
    why: 'r_d = V_T/I = 25 mV/1 mA = 25 Ω. The 700 Ω figure is the static ratio V/I at 0.7 V, which is not the small-signal resistance.'
  - q: 'A Zener regulator holds 9 V across a load. If the load is disconnected, what happens to the Zener current?'
    choices: ['It rises to the whole series-resistor current', 'It falls to zero', 'It stays the same', 'It halves']
    ans: 0
    why: 'The series current (V_in − V_Z)/R does not depend on the load. Without a load all of it flows through the Zener, which is the worst case for its power rating.'
sources:
  - 'B. G. Streetman and S. K. Banerjee, Solid State Electronic Devices, 7th ed. (2015), chapter 5'
  - 'S. M. Sze and K. K. Ng, Physics of Semiconductor Devices, 3rd ed. (2007), chapter 2'
  - 'A. S. Sedra and K. C. Smith, Microelectronic Circuits, 7th ed. (2014), chapter 4'
  - 'IIT JAM Physics syllabus (Solid State Physics, Devices and Electronics section), published by the organising IIT each year'
---

**Module 7 · about 50 minutes.** By the end you will be able to explain how a p-n junction works from the carriers up, compute its built-in potential, depletion width and capacitance, use the diode equation and load lines, design a Zener regulator and analyse rectifiers with filters, and say how LEDs, photodiodes and solar cells use the same junction. You need electrons, holes and the Fermi level from [lesson 7.3](/learn/courses/iit-jam-physics/semiconductors/).

<div class="bigidea">Put p-type next to n-type and carriers rush across until the charge they leave behind builds a wall of voltage. Push against the wall and it shrinks, letting current flood through; push with it and it grows, stopping almost everything. That one-way wall is the diode.</div>

## 1. Making the junction

Picture n-type silicon (many electrons) touching p-type silicon (many holes). Electrons diffuse into the p side and holes into the n side, where each recombines. They leave behind the ions they came from: positive donor ions on the n side, negative acceptor ions on the p side. This layer, emptied of free carriers, is the **depletion region**. Its ions make an electric field pointing from n to p, which pushes carriers back. Equilibrium comes when this **drift** exactly balances the **diffusion**, for electrons and holes separately, and the Fermi level is flat across the whole device.

Step through the formation of the junction, then move the bias slider in the last stage.

<div class="steps" data-fig="@sx-pn-junction">
<div class="step"><b>Before contact.</b> p-type with holes, n-type with electrons.</div>
<div class="step"><b>Diffusion.</b> Carriers spread across the boundary from high to low concentration.</div>
<div class="step"><b>Depletion region.</b> Uncovered donor and acceptor ions are left behind.</div>
<div class="step"><b>Equilibrium.</b> Field and drift balance diffusion; the built-in voltage is V<sub>bi</sub> = (kT/q) ln(N<sub>a</sub>N<sub>d</sub>/n<sub>i</sub>²).</div>
<div class="step"><b>Applying a bias.</b> The barrier is V<sub>bi</sub> − V and the width follows √(V<sub>bi</sub> − V).</div>
</div>

The field corresponds to a potential step, the **built-in potential**:

```math
V_0 = \frac{kT}{e}\ln\frac{N_aN_d}{n_i^2}
```

<div class="meaning">

<dl>
<dt>V<sub>0</sub></dt><dd>the potential step across the junction at zero bias (about 0.6 to 0.9 V for silicon); it cannot be measured with a voltmeter, because contact potentials at the metal leads cancel it</dd>
<dt>N<sub>a</sub>, N<sub>d</sub></dt><dd>doping on the p and n sides: heavier doping, larger V<sub>0</sub></dd>
<dt>n<sub>i</sub></dt><dd>intrinsic density: a wider gap means smaller n<sub>i</sub> and larger V<sub>0</sub></dd>
<dt>Physical meaning</dt><dd>An electron on the n side would have to climb eV<sub>0</sub> to reach the p side. Only the few with that much thermal energy diffuse across, exactly as many as the field sweeps back.</dd>
</dl>

</div>

**Worked example.** `$N_a = 10^{17}$`, `$N_d = 10^{15}$` cm⁻³, `$n_i = 10^{10}$` cm⁻³ at 300 K: `$V_0 = 0.02585\ln(10^{32}/10^{20}) = 0.02585\times27.63 = 0.714$` V.

## 2. The depletion region

Treat the depletion region as uniformly charged slabs (the abrupt approximation). Charge balance fixes the shares, and Gauss's law ([lesson 4.1](/learn/courses/iit-jam-physics/electrostatics-gauss/)) gives a field rising linearly to a peak at the junction:

```math
N_ax_p = N_dx_n, \qquad W = x_n + x_p = \sqrt{\frac{2\varepsilon(V_0 - V)}{e}\left(\frac1{N_a} + \frac1{N_d}\right)}, \qquad E_{\max} = \frac{eN_dx_n}{\varepsilon}
```

where `$V$` is the applied forward voltage (negative for reverse bias). The region lies mostly on the **lightly doped** side. Width and field grow as the square root of the total potential across the junction.

**Worked example.** For the junction above (`$\varepsilon_r = 11.7$`), at zero bias, working in SI units (`$N_d = 10^{21}$` m⁻³):

1. `$\dfrac{2\varepsilon V_0}{e} = \dfrac{2\times11.7\times8.854\times10^{-12}\times0.714}{1.602\times10^{-19}} = 9.23\times10^8$`.
2. Times `$(1/N_a + 1/N_d) = 1.01\times10^{-21}$` m³: `$9.33\times10^{-13}$` m², so `$W = 0.97$` μm, almost all on the n side.

The depletion region is also a capacitor: two layers of opposite charge a distance `$W$` apart, `$C_j = \varepsilon A/W \propto (V_0 + V_R)^{-1/2}$` for an abrupt junction under reverse bias `$V_R$`. **Varactor** diodes use this voltage-controlled capacitance to tune radio circuits. A plot of `$1/C^2$` against `$V_R$` is a straight line that meets the axis at `$-V_0$`.

## 3. Bias and the diode equation

**Forward bias** (p side positive) lowers the barrier to `$V_0 - V$`. The number of carriers able to climb it grows as `$e^{eV/kT}$`, so the diffusion current grows exponentially while the small drift current stays put. **Reverse bias** raises the barrier: diffusion stops and only the tiny drift of minority carriers remains, the **reverse saturation current** `$I_s$`. Together they give the Shockley equation:

```math
I = I_s\left(e^{V/\eta V_T} - 1\right), \qquad V_T = \frac{kT}{e} = 25.85\ \text{mV at 300 K}
```

with ideality factor `$\eta$` between 1 (ideal diffusion) and 2 (recombination in the depletion region). Useful consequences:

- **60 mV per decade.** Ten times the current needs only `$\eta V_T\ln10 = 59.5\eta$` mV more. That is why a silicon diode "sits at about 0.7 V" over a wide range of currents.
- **Dynamic resistance** `$r_d = dV/dI = \eta V_T/I$`: 25.85 Ω at 1 mA. It is the resistance a small ac signal sees.
- **Temperature.** `$I_s \propto n_i^2$` roughly doubles every 10 K in silicon, so at fixed current the forward voltage falls by about 2 mV/K. Germanium, with its smaller gap, has a far larger `$I_s$` and a cut-in of about 0.3 V.

## 4. Load lines: finding the operating point

A diode in series with a resistor `$R$` on a supply `$V_s$` must satisfy two equations at once: the diode curve and Kirchhoff's law `$V_s = IR + V$`. The second is a straight line, the **load line**, from `$(0, V_s/R)$` to `$(V_s, 0)$`. The operating point `$Q$` is where they cross.

<figure class="fig" data-fig="diode-load-line"><figcaption>The blue curve is the diode, the straight line the resistor. Raise V<sub>s</sub> and the line moves out parallel to itself; raise R and it gets flatter. The diode voltage barely changes while the current changes a lot.</figcaption></figure>

**Worked example.** `$V_s = 5$` V, `$R = 1$` kΩ, silicon diode. Constant-drop model: `$I = (5 - 0.7)/1000 = 4.3$` mA. With the exponential equation (`$I_s = 10^{-14}$` A) iterate `$V = V_T\ln(I/I_s + 1)$`, `$I = (5 - V)/R$`: starting from `$V = 0.7$` V it settles in two steps at `$V = 0.69$` V, `$I = 4.31$` mA. The simple model is excellent here.

## 5. Breakdown and the Zener regulator

Raise the reverse voltage far enough and the current suddenly shoots up: **breakdown**. Two mechanisms do it:

| | Zener breakdown | Avalanche breakdown |
|---|---|---|
| Doping | heavy on both sides | lighter |
| Depletion layer | very thin | wider |
| Mechanism | electrons tunnel straight through the thin barrier | carriers gain enough energy to knock out new pairs, which multiply |
| Breakdown voltage | below about 5 V | above about 6 V |
| Temperature coefficient | negative | positive |

Near 5 to 6 V the two coefficients cancel, which makes such diodes good voltage references. (Most "Zener diodes" above 6 V actually work by avalanche.)

In breakdown the voltage hardly changes over a wide current range, which is what a **Zener regulator** uses: a series resistor `$R$` from the supply, the Zener across the load.

<div class="steps">
<div class="step"><p><b>The Zener fixes the output.</b> As long as it stays in breakdown, the load sees V<sub>Z</sub>.</p></div>
<div class="step"><p><b>Series current.</b> I<sub>S</sub> = (V<sub>in</sub> − V<sub>Z</sub>)/R, whatever the load does.</p></div>
<div class="step"><p><b>Load current.</b> I<sub>L</sub> = V<sub>Z</sub>/R<sub>L</sub>.</p></div>
<div class="step"><p><b>The Zener takes the rest.</b> I<sub>Z</sub> = I<sub>S</sub> − I<sub>L</sub>. It must stay above its minimum (to stay in breakdown) and below its maximum (P = V<sub>Z</sub>I<sub>Z</sub> within rating).</p></div>
<div class="step"><p><b>Check both extremes.</b> Lowest supply with the heaviest load sets the largest allowed R; highest supply with no load sets the smallest.</p></div>
</div>

**Worked example.** 15 V supply, 9 V Zener, `$R = 200$` Ω, load 1 kΩ: `$I_S = 30$` mA, `$I_L = 9$` mA, `$I_Z = 21$` mA. Remove the load and the Zener must take all 30 mA.

<div class="problem" data-problem="zener-current"></div>

<div class="myth">

**"A diode drops 0.7 V, so it behaves like a 0.7 V battery whatever happens."** The 0.7 V figure is a shortcut for milliamp currents in silicon. The real rule is exponential: at microamps the drop is much less, at large currents more, and it falls 2 mV for every degree of warming. Two back-to-back diodes with 5 V across them pass only the tiny reverse current `$I_s$`, and the forward one then drops just a few tens of millivolts, not 0.7 V. Use the shortcut where it applies; use `$I = I_s(e^{V/\eta V_T} - 1)$` when the question gives `$I_s$`.

</div>

Now use the breakdown: a Zener diode across the load holds the output at V<sub>Z</sub>. Change the input, the ripple and the load.

<figure class="fig" data-fig="@sx-zener-regulator"><figcaption>The output stays near V<sub>Z</sub> = 6.8 V while the input swings. When the load takes so much current that the Zener drops out of breakdown, regulation is lost. The I-V curve shows the operating point sliding up the breakdown knee.</figcaption></figure>

## 6. Rectifiers and filters

Diodes turn ac into dc. For a sine input of peak `$V_m$` and ideal diodes:

| | Half wave | Centre-tap full wave | Bridge full wave |
|---|---|---|---|
| Diodes | 1 | 2 | 4 |
| `$V_{\rm dc}$` | `$V_m/\pi$` | `$2V_m/\pi$` | `$2V_m/\pi$` |
| `$V_{\rm rms}$` | `$V_m/2$` | `$V_m/\sqrt2$` | `$V_m/\sqrt2$` |
| Ripple factor | 1.21 | 0.48 | 0.48 |
| Maximum efficiency | 40.6% | 81.2% | 81.2% |
| Peak inverse voltage per diode | `$V_m$` | `$2V_m$` | `$V_m$` |
| Ripple frequency | `$f$` | `$2f$` | `$2f$` |

The ripple factor is `$\sqrt{(V_{\rm rms}/V_{\rm dc})^2 - 1}$`; for half wave `$\sqrt{\pi^2/4 - 1} = 1.21$`. A bridge with real silicon diodes loses two drops (1.4 V), because two diodes conduct in series.

A **capacitor across the load** smooths the output. The capacitor charges to the peak, then supplies the load until the next peak, losing

```math
\Delta V \approx \frac{I_{\rm dc}}{fC}\ \text{(half wave)}, \qquad \Delta V \approx \frac{I_{\rm dc}}{2fC}\ \text{(full wave)}
```

**Worked example.** Full wave, `$V_m = 20$` V, 1 kΩ load (20 mA), 1000 μF, 50 Hz: `$\Delta V = 0.02/(2\times50\times10^{-3}) = 0.2$` V. The diodes now conduct only in short bursts near each peak, so their peak current is much larger than the load current.

Diodes also shape signals: a **clipper** cuts off part of a waveform (a diode and a reference voltage in shunt), and a **clamper** (series capacitor, shunt diode) shifts the whole waveform up or down without changing its shape, for example turning `$5\sin\omega t$` into a wave from 0 to 10 V.

## 7. Diodes and light

The same junction talks to light in three ways:

Pick an LED colour or drag the band gap and watch the photons come out.

<figure class="fig" data-fig="@sx-led-gap"><figcaption>λ = 1240/E<sub>g</sub> nm. A wider gap gives a shorter wavelength; the gap also sets the turn-on voltage (about E<sub>g</sub>/q).</figcaption></figure>

- **LED (forward bias).** Injected electrons and holes recombine in the junction and emit photons of energy near `$E_g$`: `$\lambda \approx hc/E_g$`. Efficient LEDs need direct-gap materials (GaAs, GaN, InGaN).
- **Photodiode (reverse bias).** A photon makes a pair in or near the depletion region; the field sweeps it out as a current proportional to the light intensity (third quadrant of the I-V graph).
- **Solar cell (no external bias).** The same photocurrent `$I_L$` flows through a load. The cell works in the fourth quadrant, delivering power, with open-circuit voltage `$V_{oc} = \eta V_T\ln(1 + I_L/I_s)$`, which grows only logarithmically with light.

**Worked example.** `$I_L = 30$` mA, `$I_s = 10^{-10}$` A: `$V_{oc} = 0.02585\ln(3\times10^8) = 0.50$` V.

To experiment, the [PN junction](/learn/pn-junction/) tool shows the depletion layer change with bias, [I-V characteristics](/learn/iv-characteristics/) lets you record a diode's curve point by point, the [Rectifier lab](/learn/rectifier-lab/) animates which diodes conduct in each half cycle, the [Circuit simulator](/science/circuit-simulator/) solves your own diode circuits, and the [Solar cell IV](/science/solar-cell-iv/) tool extracts `$V_{oc}$`, fill factor and efficiency from a measured curve.

<div class="keypoints">

- Equilibrium junction: diffusion balanced by drift, flat Fermi level, `$V_0 = (kT/e)\ln(N_aN_d/n_i^2)$`.
- Depletion width `$W \propto \sqrt{V_0 - V}$`, mostly on the lightly doped side (`$N_ax_p = N_dx_n$`); `$C_j = \varepsilon A/W \propto (V_0 + V_R)^{-1/2}$`.
- `$I = I_s(e^{V/\eta V_T} - 1)$`; 60η mV per decade; `$r_d = \eta V_T/I$`; about −2 mV/K at fixed current.
- Operating point: where the load line `$V_s = IR + V$` meets the diode curve.
- Zener (tunnelling, heavy doping, below ~5 V, negative coefficient) vs avalanche (above ~6 V, positive). Regulator: `$I_Z = (V_{in} - V_Z)/R - V_Z/R_L$`.
- Rectifiers: `$V_m/\pi$` or `$2V_m/\pi$`; ripple factors 1.21 and 0.48; PIV `$V_m$`, `$2V_m$` (centre tap), `$V_m$` (bridge). Filter ripple `$I/(fC)$` or `$I/(2fC)$`.
- LED forward, photodiode reverse, solar cell fourth quadrant with `$V_{oc} = \eta V_T\ln(1 + I_L/I_s)$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. There are more on the [diodes practice page](/learn/courses/iit-jam-physics/practice/diodes/).

<div class="qbank" data-bank="physics" data-topics="diodes" data-exam="jam" data-n="10"></div>

**Next:** add a third layer and a junction becomes a [transistor](/learn/courses/iit-jam-physics/transistors/), the amplifier and switch of all electronics. The GATE Physics course treats [diodes, BJTs, FETs and MOSFETs](/learn/courses/gate-physics/semiconductor-devices/) together.
