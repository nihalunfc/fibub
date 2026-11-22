---
title: Diodes, BJTs, FETs and MOSFETs
summary: 'Semiconductor devices at GATE depth: the p-n junction (built-in potential, depletion width, junction capacitance, breakdown), the bipolar transistor (regions, Early effect, small-signal gm, rπ and ro), the JFET and the MOSFET (square law, triode and saturation, transconductance, CMOS), and the optoelectronic devices on the syllabus: LEDs, photodiodes and solar cells.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'Raising the reverse bias on an abrupt p-n junction from 0 to a value that makes V_bi − V eight times larger changes the junction capacitance by a factor of'
    choices: ['1/(2√2)', '1/8', '1/2', '√8']
    ans: 0
    why: 'For an abrupt junction W ∝ (V_bi − V)^½ and C = εA/W, so C ∝ (V_bi − V)^(−½). Eight times larger gives C/√8 = C/(2√2).'
  - q: 'A BJT is biased at I_C = 2 mA with V_T = 25 mV, β = 150 and Early voltage 60 V. Its intrinsic voltage gain g_m r_o is'
    choices: ['2400', '4800', '1200', '150']
    ans: 0
    why: 'g_m r_o = (I_C/V_T)(V_A/I_C) = V_A/V_T = 60/0.025 = 2400, independent of the bias current and of β.'
  - q: 'An n-channel MOSFET in saturation has its overdrive V_GS − V_T doubled at fixed W/L. Its drain current and transconductance change by'
    choices: ['×4 and ×2', '×2 and ×2', '×4 and ×4', '×2 and ×4']
    ans: 0
    why: 'I_D = ½k(V_GS − V_T)² rises four times; g_m = k(V_GS − V_T) doubles. Equivalently g_m = 2I_D/V_ov: 4/2 = 2.'
sources:
  - 'S. M. Sze and K. K. Ng, Physics of Semiconductor Devices, 3rd ed. (2007), chapters 2, 5, 6 and 13'
  - 'A. S. Sedra and K. C. Smith, Microelectronic Circuits, 7th ed. (2015), chapters 4 to 7'
  - 'B. G. Streetman and S. K. Banerjee, Solid State Electronic Devices, 7th ed. (2015), chapters 5 to 8'
  - 'GATE Physics (PH) syllabus, Electronics section, published by the organising IIT each year'
---

**Module 9 · about 50 minutes.** This lesson assumes the JAM basics: [semiconductors](/learn/courses/iit-jam-physics/semiconductors/) (carriers, doping, the Fermi level), [diodes](/learn/courses/iit-jam-physics/diodes/) (rectifiers, Zener regulators) and [transistors](/learn/courses/iit-jam-physics/transistors/) (configurations and biasing). GATE asks for the physics behind the device equations and for small-signal numbers you can compute in a minute.

<div class="bigidea">Every device here is a junction or a channel whose carrier density is set exponentially or quadratically by a control voltage. The diode and the BJT follow e^{V/V_T}: a 60 mV step multiplies the current by ten. The FET follows a square law in the overdrive V_GS − V_T. Small-signal parameters are just the slopes of these laws at the operating point.</div>

## 1. The p-n junction

Bring p-type (acceptors `$N_a$`) and n-type (donors `$N_d$`) silicon together. Carriers diffuse across, leave behind fixed ionised dopants, and build up a field that stops further diffusion. In equilibrium the Fermi level is flat, and the potential step is

```math
V_{bi} = \frac{k_BT}{q}\ln\frac{N_aN_d}{n_i^2}, \qquad W = \sqrt{\frac{2\varepsilon_s(V_{bi} - V)}{q}\left(\frac1{N_a} + \frac1{N_d}\right)}, \qquad \frac{x_n}{x_p} = \frac{N_a}{N_d}
```

<div class="steps">
<div class="step"><p><b>Depletion approximation.</b> Inside the depletion region all dopants are ionised and there are no free carriers; outside it the material is neutral. Charge density is −qN_a on the p side, +qN_d on the n side.</p></div>
<div class="step"><p><b>Charge balance.</b> The total charge is zero, so N_a x_p = N_d x_n: the depletion region reaches further into the lighter-doped side.</p></div>
<div class="step"><p><b>Poisson.</b> Integrating once gives a triangular field with peak E_max = qN_d x_n/ε_s at the junction; integrating again gives the potential drop ½E_max W = V_bi − V.</p></div>
<div class="step"><p><b>Bias.</b> A forward bias V lowers the barrier and narrows W; a reverse bias (V &lt; 0) widens it. The stored charge changes with V, so the junction is a voltage-dependent capacitor.</p></div>
</div>

<div class="meaning">

<dl>
<dt>`$C_j = \varepsilon_sA/W$`</dt><dd>depletion capacitance; for an abrupt junction `$C_j \propto (V_{bi} - V)^{-1/2}$`, for a linearly graded one `$\propto (V_{bi} - V)^{-1/3}$`. A plot of `$1/C_j^2$` against `$V$` is a straight line whose slope gives the lighter doping and whose intercept gives `$V_{bi}$`. Varactor diodes use this.</dd>
<dt>`$C_d = \tau I/V_T$`</dt><dd>diffusion capacitance of minority carriers stored under forward bias (`$\tau$` = lifetime); it dominates in forward bias, `$C_j$` in reverse bias</dd>
<dt>`$I = I_s(e^{V/\eta V_T} - 1)$`</dt><dd>the diode law, with `$V_T = k_BT/q = 25.9$` mV at 300 K and ideality `$\eta$` between 1 (diffusion) and 2 (recombination in the depletion region)</dd>
<dt>`$r_d = \eta V_T/I$`</dt><dd>small-signal resistance: 26 Ω at 1 mA</dd>
</dl>

</div>

**Worked example.** Silicon at 300 K, `$N_a = 10^{17}$` cm⁻³, `$N_d = 10^{16}$` cm⁻³, `$n_i = 10^{10}$` cm⁻³, `$\varepsilon_s = 11.7\varepsilon_0$`. Then `$V_{bi} = 0.02586\ln(10^{13}) = 0.774$` V. At zero bias `$W = 0.332$` µm, of which `$x_n = 0.302$` µm lies on the lightly doped n side, and `$E_{max} = 2V_{bi}/W = 4.7\times10^6$` V/m. At 5 V reverse bias `$W = 0.906$` µm, so the capacitance falls to 0.37 of its zero-bias value (312 pF per mm² at zero bias).

**Temperature and breakdown.** `$I_s \propto n_i^2 \propto T^3e^{-E_g/k_BT}$` roughly doubles every 5 K in silicon, so at fixed current the forward voltage falls by about 2 mV/K. Under large reverse bias the junction breaks down: by **Zener tunnelling** in heavily doped junctions (below about 5 V, negative temperature coefficient, since the gap shrinks when hot) or by **avalanche multiplication** in lighter ones (above about 7 V, positive coefficient, since phonons shorten the free path). Diodes near 5.6 V have almost no drift.

## 2. The bipolar transistor

An npn transistor is two junctions sharing a thin, lightly doped base. With the base-emitter junction forward biased and the base-collector junction reverse biased (**forward active**), electrons injected from the emitter diffuse across the base and are swept into the collector:

```math
I_C = I_Se^{V_{BE}/V_T}\left(1 + \frac{V_{CE}}{V_A}\right), \qquad I_C = \beta I_B, \qquad \alpha = \frac{I_C}{I_E} = \frac\beta{\beta + 1}
```

β is large because the base is thin compared with the diffusion length (few electrons recombine there) and because the emitter is much more heavily doped than the base (few holes are injected back). The Early voltage `$V_A$` comes from **base-width modulation**: more collector voltage widens the collector depletion region, thins the neutral base and steepens the electron gradient.

| Region | B-E junction | B-C junction | Use |
|---|---|---|---|
| forward active | forward | reverse | amplifier |
| saturation | forward | forward | closed switch, `$V_{CE} \approx 0.2$` V |
| cut-off | reverse | reverse | open switch |
| reverse active | reverse | forward | rarely used (low β) |

The hybrid-π model linearises this at the bias point:

```math
g_m = \frac{I_C}{V_T}, \qquad r_\pi = \frac\beta{g_m}, \qquad r_o = \frac{V_A}{I_C}, \qquad g_mr_o = \frac{V_A}{V_T}
```

**Worked example.** `$I_C = 1$` mA, `$\beta = 100$`, `$V_A = 50$` V, `$V_T = 25$` mV: `$g_m = 40$` mS, `$r_\pi = 2.5$` kΩ, `$r_o = 50$` kΩ. A common-emitter stage with a 5 kΩ collector load has gain `$-g_m(R_C\parallel r_o) = -40\times4.55 = -182$`. The largest gain any single transistor can give, with an ideal current-source load, is `$g_mr_o = 2000$`.

## 3. Field-effect transistors

**JFET.** A reverse-biased gate junction pinches an n channel. Shockley's equation in saturation:

```math
I_D = I_{DSS}\left(1 - \frac{V_{GS}}{V_P}\right)^2, \qquad g_m = \frac{2I_{DSS}}{|V_P|}\left(1 - \frac{V_{GS}}{V_P}\right) = g_{m0}\sqrt{\frac{I_D}{I_{DSS}}}
```

In **self-bias** a source resistor sets `$V_{GS} = -I_DR_S$`; substituting gives a quadratic, and only the root with `$|V_{GS}| < |V_P|$` is physical.

<div class="problem" data-problem="jfet-self-bias"></div>

**MOSFET.** In an n-channel enhancement device a gate voltage above the threshold `$V_T$` inverts the p surface and forms an electron channel. With `$k_n = \mu_nC_{ox}W/L$`:

```math
I_D = \begin{cases} k_n\left[(V_{GS} - V_T)V_{DS} - \tfrac12V_{DS}^2\right] & V_{DS} < V_{GS} - V_T \ \text{(triode)}\\[4pt] \tfrac12k_n(V_{GS} - V_T)^2(1 + \lambda V_{DS}) & V_{DS} \ge V_{GS} - V_T \ \text{(saturation)}\end{cases}
```

<div class="meaning">

<dl>
<dt>`$V_{ov} = V_{GS} - V_T$`</dt><dd>overdrive; the channel pinches off at the drain end when `$V_{DS}$` reaches it</dd>
<dt>`$g_m = k_nV_{ov} = 2I_D/V_{ov} = \sqrt{2k_nI_D}$`</dt><dd>transconductance; it grows only as the square root of current, whereas a BJT's grows linearly, so at equal current a BJT has more `$g_m$`</dd>
<dt>`$r_o = 1/\lambda I_D$`</dt><dd>output resistance from channel-length modulation</dd>
<dt>`$r_{DS} = 1/k_nV_{ov}$`</dt><dd>resistance near `$V_{DS} = 0$`: a voltage-controlled resistor</dd>
<dt>body effect</dt><dd>a source above the substrate raises `$V_T$` by `$\gamma(\sqrt{2\phi_F + V_{SB}} - \sqrt{2\phi_F})$`</dd>
</dl>

</div>

**Worked example.** `$k_n = 2$` mA/V², `$V_T = 1$` V, `$V_{GS} = 2.5$` V: `$V_{ov} = 1.5$` V, `$I_D = 2.25$` mA, `$g_m = 3$` mS. Saturation needs `$V_{DS} \ge 1.5$` V. With `$V_{DD} = 10$` V the drain resistor must be at most `$8.5/2.25 = 3.8$` kΩ. Move the sliders in the figure to see the operating point slide off the flat part of the curve when `$R_D$` is too large.

<figure class="fig" data-fig="mosfet-characteristics"><figcaption>MOSFET output curves with the dashed boundary V_DS = V_GS − V_T between triode and saturation, a load line from V_DD through R_D and the operating point; switch to the transfer view to see the square law and the slope g_m at the bias.</figcaption></figure>

<div class="problem" data-problem="mosfet-bias"></div>

A depletion-mode MOSFET has a channel built in, so it conducts at `$V_{GS} = 0$` and its `$V_T$` is negative. **CMOS** pairs an n-channel and a p-channel device: in either logic state one is off, so the static current is only leakage, and power is spent mainly in charging load capacitance ([lesson 9.5](/learn/courses/gate-physics/combinational-logic/)).

## 4. Optoelectronic devices

| Device | Bias | Key relation |
|---|---|---|
| LED | forward | photon energy ≈ `$E_g$`, so `$\lambda(\text{nm}) \approx 1240/E_g(\text{eV})$`; needs a direct gap (GaAs, GaN), not Si |
| photodiode | reverse | responsivity `$R = \eta q\lambda/hc = \eta\lambda(\mu\text{m})/1.24$` A/W; zero response for `$\lambda > hc/E_g$` |
| solar cell | none (fourth quadrant) | `$I = I_0(e^{V/V_T} - 1) - I_L$`; `$V_{oc} = V_T\ln(1 + I_L/I_0)$` |

**Worked example.** A GaAs LED (`$E_g = 1.42$` eV) emits near 873 nm. A silicon photodiode with quantum efficiency 0.8 at 850 nm has `$R = 0.8\times0.85/1.24 = 0.55$` A/W. A solar cell with `$I_L = 35$` mA and `$I_0 = 10^{-12}$` A gives `$V_{oc} = 0.02585\ln(3.5\times10^{10}) = 0.63$` V. Doubling the light adds only `$V_T\ln2 = 18$` mV: the open-circuit voltage is logarithmic in intensity, the short-circuit current linear.

**Heterojunctions** join materials with different gaps (AlGaAs/GaAs). The band offsets confine carriers and light, which makes efficient lasers possible, and they let an emitter inject electrons without receiving holes back, which gives heterojunction bipolar transistors their high β and speed.

<div class="myth">

**"The base current controls the collector current, so a BJT is a current amplifier."** The physics is voltage control: `$V_{BE}$` sets the electron injection exponentially, and `$I_B$` is a by-product (holes injected into the emitter plus recombination in the base). β is a ratio of two currents that both follow `$e^{V_{BE}/V_T}$`, and it varies by a factor of two between nominally identical transistors, which is why good bias circuits fix `$V_{BE}$` and emitter current, not base current.

</div>

<div class="keypoints">

- Junction: `$V_{bi} = V_T\ln(N_aN_d/n_i^2)$`, `$W \propto \sqrt{V_{bi} - V}$`, depletion mostly on the lightly doped side, `$C_j \propto (V_{bi} - V)^{-1/2}$` (abrupt).
- Diode: `$I = I_s(e^{V/\eta V_T} - 1)$`, `$r_d = \eta V_T/I$`, about −2 mV/K at fixed current; Zener below ~5 V (negative tempco), avalanche above ~7 V (positive).
- BJT: `$g_m = I_C/V_T$`, `$r_\pi = \beta/g_m$`, `$r_o = V_A/I_C$`, intrinsic gain `$V_A/V_T$`; active = BE forward, BC reverse.
- JFET: `$I_D = I_{DSS}(1 - V_{GS}/V_P)^2$`; self-bias gives a quadratic, keep `$|V_{GS}| < |V_P|$`.
- MOSFET: saturation when `$V_{DS} \ge V_{GS} - V_T$`, `$I_D = \tfrac12k_nV_{ov}^2$`, `$g_m = 2I_D/V_{ov}$`.
- LED `$\lambda \approx 1240/E_g$` nm; photodiode `$R = \eta\lambda/1.24$` A/W; solar cell `$V_{oc} = V_T\ln(1 + I_L/I_0)$`.

</div>

## Practise: exam questions on this lesson

<div class="qbank" data-bank="physics" data-topics="semiconductor-devices" data-exam="gate" data-n="10"></div>

**Next:** [lesson 9.2](/learn/courses/gate-physics/amplifiers-feedback/) builds amplifiers from these small-signal models and shows how feedback trades gain for bandwidth and stability. Try circuits like these in the [circuit simulator](/science/circuit-simulator/).

**Going on to CSIR NET?** [Transducers and detectors](/learn/courses/csir-net-physics/transducers-detectors/) puts photodiodes and other junction devices to work as sensors.
