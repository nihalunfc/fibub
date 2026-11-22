---
title: 'Experimental skills and practical physics'
seoTitle: 'Experimental skills and practicals: JEE and NEET physics'
summary: 'Every practical in the JEE and NEET syllabus: vernier, screw gauge and least count, error and significant figures in results, the pendulum, Young''s modulus, capillary rise, viscosity, specific heat, resonance tube, metre bridge, Ohm''s law, galvanometer, mirrors, lenses and prisms, the travelling microscope, and diode and Zener characteristics, with the graph to draw and the main error in each.'
minutes: 34
updated: 2026-11-22
quiz:
  - q: 'A screw gauge has pitch 0.5 mm and 50 circular divisions. Its least count is:'
    choices: ['0.1 mm', '0.01 mm', '0.05 mm', '0.001 mm']
    ans: 1
    why: 'Least count = pitch / number of divisions = 0.5/50 = 0.01 mm.'
  - q: 'In the resonance tube experiment, the first two resonance lengths are 16 cm and 50 cm. The end correction is:'
    choices: ['1 cm', '2 cm', '3 cm', '0.5 cm']
    ans: 0
    why: 'l₁ + e = λ/4 and l₂ + e = 3λ/4, so λ/2 = 34 cm, λ/4 = 17 cm, and e = 17 − 16 = 1 cm. In general e = (l₂ − 3l₁)/2.'
  - q: 'To find g from a pendulum, the best graph to plot is:'
    choices: ['T against L', 'T² against L', 'T against L²', 'log T against L']
    ans: 1
    why: 'T² = (4π²/g)L is a straight line through the origin with slope 4π²/g. A straight line averages out random errors and shows a constant error in L as an intercept.'
sources:
  - 'National Medical Commission NEET (UG) syllabus and JEE Main / JEE Advanced 2026 syllabi: Experimental skills'
  - 'Speed of sound in air about 343 m/s at 20 °C (rises about 0.6 m/s per °C): NPL (UK) acoustics guidance https://www.npl.co.uk'
---

**Physics · Class 12 · about 34 minutes.** By the end you will know, for every experiment in the syllabus, what is measured, the formula used, the graph to draw and the main source of error, and you will be able to read a screw gauge with a zero error.

<div class="bigidea">An experiment is a formula plus a measurement plan. Know which quantity is hardest to measure precisely (it dominates the error), which graph turns the formula into a straight line, and which correction removes a fixed mistake. Exams test exactly those three things.</div>

## 1. Measuring lengths

The lesson [Units and measurements](/learn/courses/engineering-entrance/units-measurements/) covers the vernier caliper, significant figures and error rules in detail. Here is the screw gauge.

- **Least count** of a screw gauge = pitch / number of circular divisions. Pitch is the distance the spindle moves in one full turn.
- **Reading** = main scale reading (MSR) + circular scale reading (CSR) × least count.
- **Zero error:** if, with the jaws closed, the circular scale's zero is **below** the reference line, the error is positive; above, negative. **True value = reading − zero error** (with its sign).
- **Backlash error:** a loose screw gives a different reading when turned back; always turn in one direction, using the ratchet.

<figure class="fig" data-fig="screw-gauge"><figcaption>A screw gauge with pitch 0.5 mm and 50 circular divisions (least count 0.01 mm). Read the last visible mark on the sleeve, then the circular division on the reference line, and subtract any zero error.</figcaption></figure>

<div class="problem" data-problem="ex-screw-gauge"></div>

Every repeated reading carries random error. Press Play to average more and more sweeps of a noisy signal and see how fast the scatter shrinks.

<figure class="fig" data-fig="@sx-signal-average"><figcaption>Averaging N readings cuts the random error by √N: 100 readings are 10 times better than one. Systematic errors (a zero error, a wrong scale) do not average away.</figcaption></figure>

## 2. Mechanics and properties of matter

| Experiment | Formula | Graph and key error |
|---|---|---|
| Simple pendulum | `$T = 2\pi\sqrt{L/g}$` | T² against L, slope 4π²/g; L is to the bob's centre; time 20 or more swings; small angles |
| Young's modulus (Searle) | `$Y = \dfrac{MgL}{\pi r^2\,\Delta l}$` | load against extension; the radius (squared) and the tiny Δl dominate the error |
| Surface tension (capillary) | `$T = \dfrac{rh\rho g}{2\cos\theta}$` | radius r needs a travelling microscope; clean tube |
| Viscosity (falling ball) | `$\eta = \dfrac{2r^2(\rho - \sigma)g}{9v_t}$` | measure v_t only after the ball stops speeding up; wall effects |
| Specific heat (mixtures) | heat lost = heat gained | heat loss to the room; transfer quickly |

<div class="problem" data-problem="ex-pendulum-slope"></div>

**Error in a result.** For `$Y = \dfrac{MgL}{\pi r^2\Delta l}$`, the fractional error is `$\dfrac{\Delta M}{M} + \dfrac{\Delta L}{L} + 2\dfrac{\Delta r}{r} + \dfrac{\Delta(\Delta l)}{\Delta l}$`. The quantity with the largest fractional error should be measured most carefully, and a power doubles its share.

## 3. Sound and heat

**Resonance tube.** A tuning fork over a tube of air closed at the bottom by water gives loud resonance at lengths l₁ and l₂:

```math
l_1 + e = \frac\lambda4, \qquad l_2 + e = \frac{3\lambda}4, \qquad v = 2f(l_2 - l_1), \qquad e = \frac{l_2 - 3l_1}{2} \approx 0.3d
```

The end correction e accounts for the air just above the open end vibrating too; d is the tube's inner diameter. Using the difference l₂ − l₁ removes e from v.

## 4. Electricity

<div class="meaning">
<dl>
<dt>Metre bridge</dt><dd>X = S l/(100 − l); swap X and S and average to cancel end resistance; best balance near the middle</dd>
<dt>Resistivity</dt><dd>ρ = XA/L = Xπd²/(4L); the diameter, squared, dominates the error</dd>
<dt>Ohm's law</dt><dd>V against I is a straight line, slope R; keep the current small so the wire does not heat</dd>
<dt>Galvanometer (half deflection)</dt><dd>G = RS/(R − S), with R in series and S the shunt that halves the deflection; for R much larger than S, G ≈ S</dd>
<dt>Physical meaning</dt><dd>Bridge methods measure resistance at balance, when no current flows through the detector, so the detector's own resistance and sensitivity drop out of the answer.</dd>
</dl>
</div>

<div class="problem" data-problem="ex-resistivity"></div>

**Diode and Zener characteristics.** For a p-n junction diode, forward current stays tiny until about 0.7 V (silicon), then rises steeply; reverse current is microamperes. A Zener in reverse shows a sharp breakdown at V_z where the voltage stays nearly fixed. Use a milliammeter for the forward curve and a microammeter for the reverse curve.

<div class="myth">

**"More readings always reduce every error."** Repeating a measurement reduces **random** errors only. A **systematic** error, such as a zero error, a wrong scale or a constant end correction, is the same every time; averaging cannot remove it. You must correct it, or design it away (two-point slopes, swapping positions).

</div>

The resistance of a strain gauge changes by a tiny fraction; a bridge circuit turns that into a measurable voltage. Bend the beam and compare one, two and four active gauges.

<figure class="fig" data-fig="@sx-wheatstone-strain"><figcaption>The bridge is balanced (zero output) with no load. Bending changes only the gauge arms, so V<sub>out</sub> appears. More active gauges give a larger signal, and equal temperature changes in every arm cancel.</figcaption></figure>

## 5. Optics

- **Concave mirror and convex lens (u-v method):** find v for several u; plot 1/v against 1/u (a straight line with both intercepts 1/f), or u + v against uv. Check with the u = v = 2f point.
- **Convex lens by parallax:** move a pin until its image and the pin show no relative movement as you move your eye: no parallax means same position.
- **Prism (i-δ curve):** deviation falls, reaches a minimum δ_m, then rises; at minimum the ray passes symmetrically and `$\mu = \dfrac{\sin\frac{A + \delta_m}{2}}{\sin\frac A2}$`.
- **Refractive index of a slab (travelling microscope):** read a mark directly (R₁), through the slab (R₂), and the slab's top surface (R₃): `$\mu = \dfrac{R_3 - R_1}{R_3 - R_2}$` = real thickness / apparent thickness.

<div class="steps">
<div class="step"><b>1. Identify the formula.</b> Every practical answer starts from one formula you already know from theory.</div>
<div class="step"><b>2. Make it straight.</b> Choose the axes so the formula becomes y = mx + c: T² vs L, 1/v vs 1/u, V vs I.</div>
<div class="step"><b>3. Find the dominant error.</b> The smallest measured quantity, or the one raised to the highest power.</div>
<div class="step"><b>4. Remove fixed errors.</b> Zero errors, end corrections and end resistances by subtraction, two-point slopes or swapping.</div>
<div class="step"><b>5. Report sensibly.</b> Round the result to match the least precise measurement and quote the error to one or two significant figures.</div>
</div>

**Worked example (level 4).** In Searle's experiment, L = 2.000 m, wire diameter 0.50 mm (least count 0.01 mm), load 4.0 kg, extension 2.00 mm (least count 0.01 mm). Y = (4 × 9.8 × 2)/(π × (0.25 × 10⁻³)² × 2.00 × 10⁻³) ≈ **2.0 × 10¹¹ Pa**. Error: 2 × (0.01/0.50) + 0.01/2.00 = 4% + 0.5% = 4.5% (ignoring the small errors in M and L). The diameter, not the extension, is the weakest link.

<div class="keypoints">

- Screw gauge LC = pitch/divisions; true reading = observed − zero error; zero below the line is positive.
- Pendulum: T² vs L, slope 4π²/g. Searle: error dominated by 2Δr/r.
- Capillary T = rhρg/(2 cos θ); viscosity η = 2r²(ρ − σ)g/(9v_t).
- Resonance tube v = 2f(l₂ − l₁); end correction e = (l₂ − 3l₁)/2 ≈ 0.3d.
- Metre bridge X = S l/(100 − l), swap to remove end errors; ρ = Xπd²/4L.
- Half deflection G = RS/(R − S).
- u-v graphs for f; i-δ curve for μ; travelling microscope μ = real/apparent thickness.
- Averaging cuts random error only; correct systematic errors.

</div>
