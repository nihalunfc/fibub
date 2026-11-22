---
title: 'Physics: electromagnetic induction and AC'
seoTitle: 'Electromagnetic induction and AC for CUET Physics'
summary: 'Faraday''s and Lenz''s laws, motional emf, self and mutual inductance, AC with resistors, inductors and capacitors, resonance, power factor and the transformer, with a live transformer problem.'
minutes: 22
updated: 2026-11-22
quiz:
  - q: 'Lenz''s law is a consequence of conservation of:'
    choices: ['energy', 'charge', 'mass']
    ans: 0
    why: 'The induced current opposes the change that causes it. If it helped the change, you would get energy from nothing.'
  - q: 'At resonance in a series LCR circuit:'
    choices: ['X_L = X_C and the current is largest', 'X_L = 0', 'the impedance is largest']
    ans: 0
    why: 'The inductor''s and capacitor''s reactances cancel, so impedance falls to R and current peaks. That is how a radio tunes in a station.'
  - q: 'The rms value of an AC voltage with peak 311 V is about:'
    choices: ['220 V', '311 V', '440 V']
    ans: 0
    why: 'V_rms = V₀/√2 = 311/1.414 ≈ 220 V, the figure printed for Indian household supply.'
sources:
  - 'NCERT, Physics Part I (Class 12), Electromagnetic Induction; Alternating Current'
  - 'National Testing Agency, CUET (UG) Physics syllabus https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 6 · about 22 minutes.** By the end you will find induced emfs and directions and solve LCR and transformer questions. Read first: [moving charges and magnetism](/learn/courses/cuet/physics-magnetism/).

<div class="bigidea">A changing magnetic flux makes an emf, and the induced current always fights the change. Every generator, transformer and induction cooktop runs on this one idea.</div>

**Everyday picture:** drop a magnet down a copper pipe and it falls slowly, as if through honey. The falling magnet changes the flux through rings of the pipe, currents swirl in the copper, and their field pushes back on the magnet.

## 1. Faraday and Lenz

```math
\varepsilon = -N\frac{d\Phi_B}{dt} \qquad \varepsilon_{\text{motional}} = Blv \qquad \varepsilon = -L\frac{dI}{dt}
```

<div class="meaning">

<dl>
<dt>Φ_B = BA cos θ</dt><dd>magnetic flux, in weber. Change B, the area, or the angle and you induce an emf.</dd>
<dt>minus sign</dt><dd>Lenz's law: the induced current makes a field that opposes the change in flux.</dd>
<dt>L (self-inductance)</dt><dd>a coil's "inertia" for current, in henry. It resists changes in current the way mass resists changes in velocity. Energy stored = ½LI².</dd>
</dl>

</div>

<div class="steps" data-title="Finding the direction with Lenz">
<div class="step"><b>Step 1:</b> which way does the field through the loop point, and is the flux growing or shrinking?</div>
<div class="step"><b>Step 2:</b> the induced field points opposite if the flux grows, the same way if it shrinks.</div>
<div class="step"><b>Step 3:</b> curl your right-hand fingers so your thumb points along that induced field. Your fingers give the current.</div>
<div class="step"><b>Check:</b> a magnet's N pole approaching a loop makes the near face of the loop an N pole too, so they repel.</div>
</div>

## 2. Alternating current

| Element | Reactance | Phase of current |
|---|---|---|
| Resistor | R | in step with voltage |
| Inductor | X_L = ωL | lags voltage by 90° |
| Capacitor | X_C = 1/(ωC) | leads voltage by 90° |
| Series LCR | Z = √(R² + (X_L − X_C)²) | resonance at ω₀ = 1/√(LC) |

Average power P = V_rms I_rms cos φ, where cos φ = R/Z is the power factor. A pure inductor or capacitor draws current but uses no average power ("wattless current").

## 3. Transformer

An ideal transformer keeps power the same: V_s/V_p = N_s/N_p = I_p/I_s. Power lines step voltage up to cut the current, and so the I²R loss, then step it down near homes. Real transformers lose a little energy to eddy currents (cut by laminating the core), hysteresis and resistance.

<div class="problem" data-problem="transformer"></div>

<div class="myth">

**"A step-up transformer gives you more energy."** It raises the voltage but lowers the current by the same factor. Power in = power out at best.

</div>

**Try it:** Watch the oscillation build.

<figure class="fig" data-fig="@sx-lc-tank"><figcaption>Energy swings between the coil and the capacitor.</figcaption></figure>

## 4. Practice

<div class="qbank" data-bank="entrance-physics" data-topics="electromagnetic-induction,alternating-current" data-exam="cuet" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- ε = −N dΦ/dt; motional emf Blv; Lenz = energy conservation.
- Self-inductance: ε = −L dI/dt, energy ½LI².
- X_L = ωL (current lags), X_C = 1/ωC (current leads); resonance at ω₀ = 1/√(LC).
- V_rms = V₀/√2; P = V_rms I_rms cos φ.
- Transformer: V_s/V_p = N_s/N_p, power stays the same.

</div>
