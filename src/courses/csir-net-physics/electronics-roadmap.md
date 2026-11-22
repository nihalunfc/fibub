---
title: 'Electronics: what NET asks and where to study it'
seoTitle: CSIR NET Physics electronics and experimental roadmap
summary: 'What CSIR NET asks from electronics and experimental methods in Part B (semiconductor and opto-electronic devices, op-amps, digital circuits, ADCs and DACs, error analysis and least squares) and Part C (curve fitting and chi-square, transducers and detectors, signal conditioning, noise, lock-in detection, high-frequency devices), the study order, the lessons to use, a self-check list and a worked error-propagation example.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'g is found from a pendulum as 4π²L/T². L has a 0.2% error and T a 0.2% error, independent and random. The error in g is about'
    choices: ['0.45%', '0.4%', '0.6%', '0.2%']
    ans: 0
    why: 'Independent errors add in quadrature, and T enters squared: √(0.2² + (2 × 0.2)²)% = √0.2 % ≈ 0.45%.'
  - q: 'An ideal inverting amplifier has R_f = 100 kΩ and R_in = 10 kΩ. Its voltage gain is'
    choices: ['−10', '+11', '+10', '−11']
    ans: 0
    why: 'The inverting input is a virtual ground: the gain is −R_f/R_in = −10. The non-inverting circuit would give +11.'
  - q: 'An 8-bit ADC has a full-scale input of 5.12 V. Its resolution (one least significant bit) is'
    choices: ['20 mV', '0.64 V', '5 mV', '40 mV']
    ans: 0
    why: '5.12 V / 2⁸ = 5.12/256 V = 20 mV.'
sources:
  - 'CSIR-UGC NET Physical Sciences syllabus: Electronics and Experimental Methods (core and advanced), CSIR HRDG / National Testing Agency, checked 2026-11-22'
  - 'P. Horowitz and W. Hill, The Art of Electronics, 3rd ed. (Cambridge, 2015)'
  - 'J. R. Taylor, An Introduction to Error Analysis, 2nd ed. (University Science Books, 1997)'
  - 'P. R. Bevington and D. K. Robinson, Data Reduction and Error Analysis for the Physical Sciences, 3rd ed. (McGraw-Hill, 2003)'
---

**Module 7 · about 30 minutes to read, 2 weeks to work through.** This unit mixes circuits with laboratory method: how devices behave, how op-amp and digital circuits work, and how measurements, errors and noise are handled. This roadmap shows what is asked, the order, the lessons, a worked example and a checklist.

<div class="bigidea">Electronics questions reward a few golden rules used without hesitation: an ideal op-amp draws no current and holds its inputs equal; a diode is a switch with a 0.7 V drop; logic is Boolean algebra; independent errors add in quadrature. Most questions are two lines once the rule is chosen.</div>

## 1. What NET asks

Described from the published syllabus (check the current one):

**Part B (core):**
- Semiconductor devices: diodes, junctions, bipolar transistors, field-effect devices, homo- and heterojunction devices; their structure, characteristics, frequency response and uses.
- Opto-electronic devices: solar cells, photodetectors, LEDs.
- Operational amplifiers and their applications.
- Digital techniques: registers, counters, comparators and similar circuits; A/D and D/A converters; microprocessor and microcontroller basics.
- Data interpretation and analysis; precision and accuracy; error analysis and propagation; least-squares fitting.

**Part C (advanced):**
- Linear and nonlinear curve fitting; the chi-square test.
- Transducers for temperature, pressure and vacuum, magnetic fields, vibration, light, and particle detectors.
- Measurement and control; signal conditioning and recovery: impedance matching, amplification (op-amp, instrumentation amplifier, feedback), filtering and noise reduction, shielding and grounding.
- Fourier methods, lock-in detection, box-car integration, modulation; high-frequency devices.

<div class="meaning">

<dl>
<dt>Virtual short</dt><dd>with negative feedback, an ideal op-amp keeps V₊ = V₋ and draws no input current</dd>
<dt>Quadrature</dt><dd>for q = xᵃyᵇ with independent errors, (δq/q)² = (a δx/x)² + (b δy/y)²</dd>
<dt>Resolution of an n-bit converter</dt><dd>full scale / 2ⁿ</dd>
<dt>Lock-in detection</dt><dd>multiply by a reference at the signal frequency and average: only the component at that frequency and phase survives</dd>
<dt>Physical meaning</dt><dd>Every measurement is a signal plus noise. Good design (feedback, filtering, modulation) and honest error analysis are two halves of the same job.</dd>
</dl>

</div>

## 2. The order to study it

1. **Devices**: JAM [semiconductors and the Fermi level](/learn/courses/iit-jam-physics/semiconductors/), [p-n junctions and diodes](/learn/courses/iit-jam-physics/diodes/) and [transistors](/learn/courses/iit-jam-physics/transistors/); then the GATE lesson on diodes, BJTs, FETs and MOSFETs. For the band picture behind them, GATE [semiconductors and the Hall effect](/learn/courses/gate-physics/semiconductors-hall/).
2. **Op-amps**: JAM [operational amplifiers](/learn/courses/iit-jam-physics/op-amps/), then the GATE lessons on amplifiers and feedback, op-amp circuits and oscillators.
3. **Digital**: JAM [logic gates and Boolean algebra](/learn/courses/iit-jam-physics/digital-logic/), then the GATE lessons on combinational logic, flip-flops and counters, and ADCs and DACs.
4. **Circuits** refresher where needed: JAM [DC transients and AC circuits](/learn/courses/iit-jam-physics/circuits/) (filters and time constants).
5. **Errors and statistics**: GATE [probability and statistics](/learn/courses/gate-physics/probability/), then [lesson 7.2](/learn/courses/csir-net-physics/errors-data-fitting/) of this course (measurement, errors and fitting data).
6. **NET extras in this course**: [lesson 7.3](/learn/courses/csir-net-physics/transducers-detectors/) (transducers and detectors) and [lesson 7.4](/learn/courses/csir-net-physics/noise-lock-in/) (noise, filtering and lock-in detection).

## 3. Where each topic is taught

| Topic | Learn it from | NET emphasis |
|---|---|---|
| Diodes, rectifiers, Zener | [JAM diodes](/learn/courses/iit-jam-physics/diodes/) | ripple, regulation, junction capacitance |
| BJTs, FETs | [JAM transistors](/learn/courses/iit-jam-physics/transistors/), GATE devices lesson | biasing, small-signal gain, MOSFET regions |
| Opto-electronics | [JAM semiconductors](/learn/courses/iit-jam-physics/semiconductors/), [GATE Hall effect](/learn/courses/gate-physics/semiconductors-hall/) | band gap and wavelength, solar-cell fill factor |
| Op-amps | [JAM op-amps](/learn/courses/iit-jam-physics/op-amps/), GATE op-amp lessons | summers, integrators, differentiators, active filters, comparators |
| Digital circuits, converters | [JAM logic](/learn/courses/iit-jam-physics/digital-logic/), GATE digital lessons | Karnaugh maps, counters, R-2R DAC, ADC resolution |
| Filters, time constants | [JAM circuits](/learn/courses/iit-jam-physics/circuits/) | RC cut-off frequency, phase shift |
| Errors, least squares, chi-square | [GATE probability](/learn/courses/gate-physics/probability/), [lesson 7.2](/learn/courses/csir-net-physics/errors-data-fitting/) | propagation, weighted fits, degrees of freedom |
| Transducers, detectors | [lesson 7.3](/learn/courses/csir-net-physics/transducers-detectors/) | thermocouples, RTDs, Hall probes, photomultipliers, vacuum gauges |
| Noise, lock-in | [lesson 7.4](/learn/courses/csir-net-physics/noise-lock-in/) | Johnson noise `$4kTR\Delta f$`, signal-to-noise gain from averaging |

## 4. A worked NET-style example

**Question (Part B style).** A student finds `$g$` from a simple pendulum, `$g = 4\pi^2L/T^2$`, with `$L = 1.000 \pm 0.002$` m and `$T = 2.006 \pm 0.004$` s (independent random errors). The result, with its error, is

(a) `$9.81 \pm 0.04$` m/s² (b) `$9.81 \pm 0.06$` m/s² (c) `$9.81 \pm 0.03$` m/s² (d) `$9.81 \pm 0.01$` m/s².

**Solution.**

1. Value: `$g = 39.478/2.006^2 = 39.478/4.024 = 9.811$` m/s².
2. Relative errors: `$\delta L/L = 0.002$`, `$\delta T/T = 0.004/2.006 = 0.0020$`. Since `$T$` appears squared, its contribution doubles:

```math
\frac{\delta g}{g} = \sqrt{\left(\frac{\delta L}{L}\right)^2 + \left(2\frac{\delta T}{T}\right)^2} = \sqrt{(0.002)^2 + (0.0040)^2} = 0.0045
```

3. `$\delta g = 0.0045\times9.81 = 0.044$` m/s², so `$g = 9.81 \pm 0.04$` m/s²: option (a).

**Traps.** Adding the relative errors linearly (0.2% + 0.4%) gives 0.06, option (b): that is the worst case, not the standard error for independent errors. Forgetting the factor 2 on `$T$` gives about 0.03, option (c).

**A circuit companion.** The virtual ground makes summing amplifiers one-liners:

<div class="problem" data-problem="net-summing-amp"></div>

## 5. Self-check before moving on

You are ready for the Part C units when you can, without notes:

- sketch a diode's I-V curve and find the output of a half-wave rectifier with a capacitor filter;
- find the voltage gain of a common-emitter amplifier from `$g_m$` and the load;
- name the three regions of a MOSFET and the condition for saturation;
- write the output of inverting, non-inverting, summing, difference, integrator and differentiator op-amp circuits;
- find the cut-off frequency of an RC filter and of a first-order active filter;
- simplify a Boolean expression with a Karnaugh map and build it from NAND gates only;
- give the count sequence of a ripple counter and the output of an R-2R DAC for a given input;
- propagate independent errors through products, powers and sums;
- fit a straight line by least squares and say what a reduced chi-square near 1 means;
- explain why a lock-in amplifier can pull a signal out of noise much larger than itself.

<div class="myth">

**"Experimental methods is just common sense."** It is examined precisely: quadrature versus linear addition, degrees of freedom in a chi-square, the bandwidth in Johnson noise, the resolution of a converter. Learn the formulas and the one-line reason behind each.

</div>

<div class="keypoints">

- Part B: devices and opto-electronics, op-amps, digital circuits and converters, error analysis and least squares.
- Part C: curve fitting and chi-square, transducers and detectors, signal conditioning, noise and lock-in detection, high-frequency devices.
- Order: devices, op-amps, digital, circuits refresher, errors and statistics, lessons 7.2 to 7.4.
- Op-amp golden rules, diode as a switch, Boolean algebra, quadrature for independent errors.

</div>

## Practise: a mixed electronics set

<div class="qbank" data-bank="physics" data-topics="semiconductors,diodes,transistors,op-amps,digital-logic,circuits,probability,semiconductors-hall" data-exam="net" data-n="10"></div>

**Next:** the Part C units begin with the [atomic and molecular physics roadmap](/learn/courses/csir-net-physics/atomic-roadmap/).
