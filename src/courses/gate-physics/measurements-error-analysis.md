---
title: Measurements and error analysis
seoTitle: Measurements, errors and lock-in amplifiers | GATE Physics
summary: 'The experimental-physics toolkit of GATE 2027: units and dimensional analysis, least count and significant figures, systematic and random errors, propagation of errors, two-probe against four-probe resistance, grounding and ground loops, the design of a DC power supply (rectifier, filter, regulator) and the principle of the lock-in amplifier.'
minutes: 55
updated: 2026-11-24
quiz:
  - q: 'A small resistance is measured with two leads and two contacts that each add some resistance. Why does a four-probe measurement avoid this error?'
    choices: ['The current flows through the outer pair and the voltage is read by the inner pair, which draws almost no current, so the lead and contact drops never enter the reading', 'Four probes average out random noise four times better than two', 'The extra probes cool the sample, so its resistance falls', 'The extra probes cancel the zero error of the ohmmeter']
    ans: 0
    why: 'A high-impedance voltmeter on the inner pair carries almost no current, so there is no voltage drop across its leads or contacts. Only the voltage across the sample itself is read, while the outer pair carries the current. Averaging, cooling and zero errors have nothing to do with it.'
  - q: 'Q = a²b/c, where a, b and c have independent relative uncertainties of 1 %, 2 % and 3 %. What is the combined relative uncertainty of Q?'
    choices: ['4.1 %', '7 %', '6 %', '3.7 %']
    ans: 0
    why: 'For a product of powers the relative errors add in quadrature after multiplying by the powers: sqrt((2 × 1)² + 2² + 3²) = sqrt(17) = 4.1 %. Simply adding the percentages would give 2 + 2 + 3 = 7 %, which is the worst-case limit. Forgetting the square on a gives 3.7 %.'
  - q: 'A full-wave rectifier on 50 Hz mains feeds a 1000 µF smoothing capacitor and draws 0.2 A. What is the peak-to-peak ripple, to a good approximation?'
    choices: ['2 V', '4 V', '1 V', '0.2 V']
    ans: 0
    why: 'The capacitor is topped up 100 times a second, so the ripple is ΔV = I/(f_r C) = 0.2/(100 × 1000×10⁻⁶) = 2 V. A half-wave rectifier would recharge only 50 times a second and give 4 V; that is the usual mistake.'
sources:
  - 'J. R. Taylor, An Introduction to Error Analysis, 2nd ed. (1997), chapters 1 to 5'
  - 'P. Horowitz and W. Hill, The Art of Electronics, 3rd ed. (2015), chapters 1, 2 and 8 (power supplies) and chapter 7 (noise and grounding)'
  - 'H. W. Ott, Electromagnetic Compatibility Engineering (2009), chapter 3 on grounding'
  - 'D. K. Schroder, Semiconductor Material and Device Characterization, 3rd ed. (2006), chapter 1 (four-point probe)'
  - 'GATE 2027 Physics (PH) syllabus, section on Measurements and Error Analysis, https://gate2027.iitm.ac.in/static/doc/GATE2027_Syllabus/PH_GATE2027_Syllabus.pdf (checked 2026-11-24)'
---

**Module 9 · about 55 minutes.** New in the GATE 2027 PH syllabus. By the end you will be able to check a formula by its dimensions, read an instrument and quote the result with the right number of figures, separate systematic from random errors, propagate uncertainties through a formula, choose between two-probe and four-probe resistance measurements, avoid ground loops, size the parts of a simple DC power supply and explain how a lock-in amplifier pulls a tiny signal out of noise.

<div class="bigidea">A number without an uncertainty is only half a measurement. Every instrument has a smallest step, every setup has a few biases that push all readings the same way, and every reading jumps about by chance. Good experimental physics means knowing the size of each, shrinking the ones you can, and saying honestly what is left.</div>

## 1. Units and dimensions

The SI has seven base quantities: length (m), mass (kg), time (s), electric current (A), temperature (K), amount of substance (mol) and luminous intensity (cd). Since 2019 all seven are fixed by exact values of constants such as `$h$`, `$e$`, `$k_B$` and the speed of light. Every other unit is a product of powers of these. The **dimension** of a quantity records those powers: force is `$[MLT^{-2}]$`, energy `$[ML^2T^{-2}]$`, magnetic field `$[MT^{-2}A^{-1}]$`.

Two rules do most of the work:

- You can only add, subtract or equate quantities with the same dimensions. Arguments of `$\sin$`, `$\exp$` and `$\ln$` must be dimensionless.
- A power law `$f = k\,x^a y^b z^c$` can often be found by matching dimensions on both sides. The pure number `$k$` has to come from the physics.

**Worked example.** A small liquid drop vibrates with frequency `$f$`. Guess that it depends only on the surface tension `$\sigma$` (`$[MT^{-2}]$`), the density `$\rho$` (`$[ML^{-3}]$`) and the radius `$r$` (`$[L]$`). Write `$f \propto \sigma^a\rho^b r^c$`.

<div class="steps">
<div class="step"><p><b>Mass.</b> `$a + b = 0$`, so `$b = -a$`.</p></div>
<div class="step"><p><b>Time.</b> `$f$` has `$T^{-1}$` and `$\sigma$` has `$T^{-2}$`, so `$-2a = -1$` and `$a = \tfrac12$`, `$b = -\tfrac12$`.</p></div>
<div class="step"><p><b>Length.</b> `$-3b + c = 0$`, so `$c = -\tfrac32$`. Therefore `$f \propto \sqrt{\sigma/(\rho r^3)}$`.</p></div>
<div class="step"><p><b>The constant.</b> Dimensions cannot give it. For the lowest mode, Rayleigh's solution has `$\omega^2 = 8\sigma/\rho r^3$`. For a water drop of radius 1 mm (`$\sigma = 0.072$` N/m, `$\rho = 1000$` kg/m³): `$\omega = \sqrt{8\times0.072/(1000\times10^{-9})} = 759$` rad/s, so `$f = 121$` Hz.</p></div>
</div>

<div class="meaning">

<dl>
<dt>dimension</dt><dd>which base quantities a quantity is made of, written like [ML²T⁻²]; it does not depend on the unit system</dd>
<dt>unit</dt><dd>the agreed size of a quantity: the joule, the erg and the electron volt all have the dimensions of energy</dd>
<dt>dimensionless group</dt><dd>a ratio such as the Reynolds number that has no units; its value, not the unit system, decides the physics</dd>
</dl>

</div>

## 2. Least count and significant figures

The **least count** (LC) is the smallest difference an instrument can show. For a metre rule it is 1 mm. For a **vernier** it is one main-scale division minus one vernier division. For a **screw gauge** it is the pitch divided by the number of circular divisions. Readings cannot honestly be finer than the least count.

**Worked example (screw gauge).** Pitch 0.5 mm, 50 circular divisions, so LC = 0.5/50 = 0.01 mm. With the jaws closed the gauge reads −0.03 mm (a negative zero error). A wire gives main-scale reading 2.5 mm and circular reading 37 divisions.

1. Observed reading: `$2.5 + 37\times0.01 = 2.87$` mm.
2. Zero correction: subtract the zero error, `$2.87 - (-0.03) = 2.90$` mm.
3. The diameter is 2.90 mm, with an uncertainty of about one least count, 0.01 mm.

**Significant figures** show how well a number is known:

- Leading zeros do not count (0.00250 has three), trailing zeros after a decimal point do.
- In a product or quotient the result keeps as many figures as the factor with the fewest.
- In a sum or difference the result keeps as many decimal places as the term with the fewest.
- Quote the uncertainty with one or two figures and round the value to the same decimal place: 9.80 ± 0.03, never 9.8017 ± 0.03.
- Do not round in the middle of a calculation; round once at the end.

## 3. Systematic and random errors

<div class="meaning">

<dl>
<dt>systematic error</dt><dd>pushes every reading the same way: a zero error, a mis-calibrated scale, parallax, a meter that loads the circuit. Repeating the measurement does not reveal it; only a better method or a calibration against a standard does</dd>
<dt>random error</dt><dd>readings scatter up and down by chance (noise, timing reflexes, thermal drift). Averaging many readings shrinks it</dd>
<dt>accuracy</dt><dd>closeness to the true value (small systematic error)</dd>
<dt>precision</dt><dd>closeness of repeated readings to each other (small random error). A set of readings can be precise yet inaccurate</dd>
</dl>

</div>

For `$N$` repeated readings `$x_i$` the best estimate is the mean `$\bar x$`. The scatter is the sample standard deviation and the uncertainty of the mean is the **standard error**:

```math
s = \sqrt{\frac{\sum(x_i - \bar x)^2}{N - 1}}, \qquad \sigma_{\bar x} = \frac{s}{\sqrt N}
```

Taking four times as many readings halves the random error, which is a slow return, and does nothing to a systematic one.

**Worked example.** Five timings of 20 swings of a pendulum: 40.1, 40.2, 40.1, 40.3 and 40.0 s.

1. Mean: 40.14 s. Deviations: −0.04, +0.06, −0.04, +0.16, −0.14 s.
2. Sum of squares: 0.0016 + 0.0036 + 0.0016 + 0.0256 + 0.0196 = 0.052 s², so `$s = \sqrt{0.052/4} = 0.114$` s.
3. Standard error `$= 0.114/\sqrt5 = 0.051$` s. The period is `$T = 40.14/20 = 2.007$` s with `$\delta T = 0.051/20 = 0.0026$` s.

## 4. Propagation of errors

If `$f(x, y, \dots)$` is computed from measured values with independent uncertainties, the uncertainty of `$f$` is

```math
\delta f = \sqrt{\left(\frac{\partial f}{\partial x}\delta x\right)^2 + \left(\frac{\partial f}{\partial y}\delta y\right)^2 + \cdots}
```

Special cases worth knowing by heart:

- Sum or difference: `$\delta f = \sqrt{\delta x^2 + \delta y^2}$` (absolute errors in quadrature).
- Product or quotient of powers, `$f = x^p y^q$`: `$\dfrac{\delta f}{f} = \sqrt{\left(p\dfrac{\delta x}{x}\right)^2 + \left(q\dfrac{\delta y}{y}\right)^2}$`.
- If you cannot assume independence, or want a safe upper limit, add the absolute contributions linearly instead (the **maximum error**).

**Worked example.** From the pendulum, `$g = 4\pi^2L/T^2$`, with `$L = 1.000 \pm 0.002$` m and `$T = 2.007 \pm 0.0026$` s.

1. `$g = 4\pi^2(1.000)/(2.007)^2 = 9.80$` m/s².
2. Relative errors: `$\delta L/L = 0.0020$`, and the square makes `$2\,\delta T/T = 2(0.0026/2.007) = 0.0025$`.
3. In quadrature: `$\sqrt{0.0020^2 + 0.0025^2} = 0.0032$`, so `$\delta g = 0.0032\times9.80 = 0.03$` m/s². Maximum-error version: `$0.0020 + 0.0025 = 0.0045$`, i.e. 0.04 m/s².
4. Result: `$g = 9.80 \pm 0.03$` m/s². The period, with its power of 2, contributes more than the length, so improving the timing is worth more than a better ruler.

## 5. Resistance measurement: two probes against four

A **two-probe** measurement uses one pair of wires both to push the current and to read the voltage, so the meter sees `$R_{\text{sample}} + 2R_{\text{lead}} + 2R_{\text{contact}}$`. When the sample resistance is large this does not matter. When it is small (a metal wire, a superconducting film, a good contact) the parasitic terms swamp it.

A **four-probe** (Kelvin) setup separates the jobs. Current enters and leaves through the outer pair. The voltmeter, of very high input resistance, is connected to the inner pair, so almost no current flows in its leads and contacts, and it reads only the drop across the sample between the inner probes.

**Worked example.** A metal strip has `$R = 0.050$` Ω. Each lead plus contact adds 0.35 Ω.

1. Two-probe reading: `$0.050 + 2(0.35) = 0.75$` Ω, fifteen times too large.
2. Four-probe reading: `$V/I = 0.050$` Ω, because the 0.35 Ω drops are outside the voltmeter loop.

For a thin film much larger than the probe spacing, with four collinear equally spaced probes, the **sheet resistance** is `$R_s = (\pi/\ln 2)\,V/I = 4.532\,V/I$` (in ohms per square), and the resistivity is `$\rho = R_s t$`. For `$V = 2.0$` mV and `$I = 1.0$` mA you get `$R_s = 9.06$` Ω per square; with a thickness of 200 nm, `$\rho = 9.06\times2.0\times10^{-5}\ \text{cm} = 1.8\times10^{-4}$` Ω cm. Four-probe methods also keep self-heating small by using a low current, and the same idea is used in the van der Pauw and Hall measurements of [lesson 7.8](/learn/courses/gate-physics/semiconductors-hall/).

## 6. Grounding and ground loops

Three different things are called "ground": the **safety earth** (a wire to the building's earth that carries fault currents), the **signal reference** (the 0 V that voltages are measured from) and the **chassis** (the metal case, shielding the electronics). A clean measurement keeps these purposes in mind.

A **ground loop** appears when two instruments are joined by a signal cable and are also each connected to earth. The two ground paths and the cable shield enclose a loop. Mains-frequency magnetic flux through it induces an emf, and mains currents flowing through the small resistance of the shield add a voltage that looks to the amplifier like part of the signal. The result is the familiar 50 Hz hum.

**Worked example.** A loop of area 0.1 m² sits in a stray 50 Hz magnetic field of rms 1 µT, which is plausible near a transformer. The induced rms emf is `$2\pi fBA = 2\pi(50)(10^{-6})(0.1) = 31$` µV. A thermocouple signal of 10 µV is buried.

What helps:

- **One ground point.** Connect every signal return to a single "star" point, so no loop exists.
- **Shrink the loop area.** Twist the signal and return wires; run them together.
- **Break the loop.** Use a differential input, an isolation transformer or an optical isolator, or lift the shield at one end (the instrument end, never both).
- **Keep high-current returns away** from sensitive low-level returns (power ground and analogue ground meet only at the supply).

Never remove the safety earth plug to cure hum: it is the safety path.

## 7. Designing a DC power supply

A linear DC supply has four stages: a **transformer** lowers the mains voltage, a **rectifier** turns AC into pulsating DC, a **filter** capacitor smooths it, and a **regulator** holds the output steady whatever the mains and load do. The rectifier diodes come from [lesson 9.1](/learn/courses/gate-physics/semiconductor-devices/).

- **Rectifier.** A bridge of four diodes gives full-wave output with two diode drops (about 1.4 V). The peak voltage is `$V_p = \sqrt2\,V_{\text{rms}} - 1.4$ V`, and each diode must withstand a reverse voltage of about `$\sqrt2\,V_{\text{rms}}$`.
- **Filter.** The capacitor supplies the load between peaks. The peak-to-peak ripple is `$\Delta V \approx I/(f_rC)$`, where `$f_r$` is the ripple frequency: the mains frequency for half-wave, twice that for full-wave. The diodes conduct only for short pulses, so they carry current peaks several times the average.
- **Regulator.** A Zener diode with a series resistor is the simplest: `$R = (V_{\text{in,min}} - V_Z)/(I_Z + I_L)$`. A three-terminal regulator (7805 for +5 V) needs the input to stay about 2 V above the output at all times (its dropout) and rejects ripple by typically 60 to 80 dB.

**Worked example.** A 5 V, 0.5 A supply is built from a 12 V rms transformer, a bridge, a 2200 µF capacitor and a 7805 on 50 Hz mains.

<div class="steps">
<div class="step"><p><b>Peak.</b> `$12\sqrt2 - 1.4 = 15.6$` V after the diodes.</p></div>
<div class="step"><p><b>Ripple.</b> `$\Delta V = 0.5/(100\times2200\times10^{-6}) = 2.27$` V peak to peak.</p></div>
<div class="step"><p><b>Headroom.</b> The lowest input is `$15.6 - 2.27 = 13.3$` V, well above the 7 V the regulator needs for 5 V out. Even with the mains 10 % low (peak 13.9 V, valley about 11.6 V) the input stays above 7 V.</p></div>
<div class="step"><p><b>Output ripple.</b> With 70 dB of rejection (a factor of about 3200), `$2.27/3162 = 0.7$` mV remains.</p></div>
</div>

For a Zener stage fed from at least 12 V, with `$V_Z = 5.1$` V, `$I_L = 20$` mA and a minimum Zener current of 5 mA, `$R = 6.9/25\ \text{mA} = 276$` Ω, so a 270 Ω resistor is the next standard value. Check the power rating of both the resistor and the Zener at the highest input voltage.

## 8. The lock-in amplifier

Small signals often sit under noise much larger than themselves, most of it at low frequencies (1/f noise and drift). A **lock-in amplifier** exploits the fact that you can choose the frequency of the signal. Modulate the experiment (a chopped light beam, an AC bridge current) at a reference frequency `$f_r$`, then:

1. Multiply the input by a reference sine wave at `$f_r$` (a phase-sensitive detector).
2. Pass the product through a low-pass filter of time constant `$\tau$`.

If the signal is `$V_s\sin(\omega t + \phi)$` and the reference is `$V_r\sin\omega t$`, the product contains a DC part `$\tfrac12V_sV_r\cos\phi$` and a part at `$2\omega$` that the filter removes. Noise at other frequencies averages to zero. A second channel using a reference shifted by 90° gives `$\tfrac12V_sV_r\sin\phi$`, so the amplitude and the phase can both be found: the output is an extremely narrow band-pass filter centred on `$f_r$`, whose width is set by the filter, not by the input.

For a single-pole RC filter the equivalent noise bandwidth is `$\Delta f = 1/(4\tau)$`. Longer `$\tau$` means narrower bandwidth and less noise, at the price of a slower response.

**Worked example.** A signal of 100 nV at 1 kHz is hidden in white noise of 10 nV/√Hz at the input. The lock-in uses `$\tau = 1$` s.

1. Noise bandwidth: `$1/(4\times1) = 0.25$` Hz.
2. Noise at the output: `$10\ \text{nV}/\sqrt{\text{Hz}}\times\sqrt{0.25\ \text{Hz}} = 5$` nV.
3. Signal to noise: 100/5 = 20. Raising `$\tau$` to 4 s halves the noise to 2.5 nV and doubles the ratio to 40.

Choosing `$f_r$` at a few hundred hertz to kilohertz, away from 50 Hz and its harmonics and above the 1/f noise corner, is part of the art.

<div class="myth">

**"Averaging more readings always makes the result more accurate."** Averaging shrinks only random error. A zero error or a mis-calibrated scale is the same in every reading and survives any amount of averaging.

**"A lock-in amplifier removes noise at the signal frequency."** It cannot. It rejects noise at other frequencies; the noise that falls within the narrow band around `$f_r$` stays. That is why narrow bands (long time constants) help.

**"Grounding everything everywhere is the safe choice."** Every extra ground connection can close another loop. Ground each circuit at one well-chosen point.

</div>

<div class="keypoints">

- Dimensions must match on both sides of an equation; arguments of sin, exp and ln are dimensionless. Power laws can be found by matching base-quantity exponents, but the constant needs physics.
- Least count: vernier = 1 MSD − 1 VSD; screw gauge = pitch / divisions. Correct for zero error before using a reading.
- Quote the uncertainty to one or two figures and match the decimal place of the value. Multiply: fewest figures. Add: fewest decimal places.
- Systematic errors shift all readings; random errors scatter them. `$\sigma_{\bar x} = s/\sqrt N$`.
- Independent errors combine in quadrature; for `$x^py^q$`, `$(\delta f/f)^2 = (p\,\delta x/x)^2 + (q\,\delta y/y)^2$`. The linear sum is the maximum error.
- Four-probe: current in the outer pair, voltage on the inner pair, so lead and contact resistance drop out. Thin film: `$R_s = 4.532\,V/I$`.
- Ground loop: two ground paths enclose flux; use a single-point ground, twisted pairs, and isolation. Never remove the safety earth.
- Supply: `$V_p = \sqrt2V_{\text{rms}} - 1.4$` V, ripple `$\Delta V = I/(f_rC)$` with `$f_r = 2f$` for full-wave; keep the regulator's dropout (about 2 V) satisfied at the lowest ripple valley.
- Lock-in: multiply by the reference, low-pass; DC output `$\tfrac12V_sV_r\cos\phi$`; noise bandwidth `$1/4\tau$` for one RC stage.

</div>

## Practise: exam questions on this lesson

From the definitions up to GATE top-rank level, with full solutions. More on the [errors and data fitting practice page](/learn/courses/gate-physics/practice/errors-data-fitting/) and the [lock-in and noise practice page](/learn/courses/gate-physics/practice/noise-lock-in/).

<div class="qbank" data-bank="physics" data-topics="errors-data-fitting,noise-lock-in" data-exam="gate" data-n="10"></div>

**Before this:** [lesson 9.7, ADCs and DACs](/learn/courses/gate-physics/adc-dac/), whose quantisation error is one more source of uncertainty; the rectifier and Zener diodes are in [lesson 9.1](/learn/courses/gate-physics/semiconductor-devices/). **Next:** [lesson 10.1](/learn/courses/gate-physics/gate-exam-pattern/) explains the GATE PH paper itself. Back to the [GATE Physics course](/learn/courses/gate-physics/).
