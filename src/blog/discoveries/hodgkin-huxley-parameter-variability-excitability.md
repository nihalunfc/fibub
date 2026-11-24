---
title: "How often does a jittered Hodgkin-Huxley axon fire on its own?"
summary: "A 2026 PLOS Computational Biology study ran 300,000 Hodgkin-Huxley parameter sets and found 7.2 % fired with no stimulus. We repeat the experiment on the space-clamped model in fibub's Hodgkin-Huxley simulator and map where the firing region is."
tools: [hodgkin-huxley-simulator, membrane-potential, spike-train-analyser]
updated: 2026-11-24
sources:
  - "Korngreen, A. (2026), Neuronal excitability and parameter variability in the Hodgkin-Huxley model, PLOS Computational Biology 22(6): e1014458, doi:10.1371/journal.pcbi.1014458. Licence CC BY 4.0 (Creative Commons Attribution), checked on the PLOS article page, 2026-11-24. Values used here: a 10 cm cable of 0.025 cm radius in 80 compartments (320 coupled equations), axial resistivity 35.4 ohm cm; a main ensemble of 300,000 parameter sets, repeated with 800,000 and 1,200,000; rate-constant parameters drawn within the mean plus or minus 2 standard deviations from 4,000 bootstrap resamples of the digitised 1952 rate data, offset to a resting potential of -65 mV; spike detection at -20 mV; propagation counted only when the distal spike reached at least 70 mV; 7.2 % of simulations fired spontaneously; at 8 microamps about 14 % fired regularly and 77.7 % were phasic; conduction velocity in the phasic group about 5 to 15 m/s."
  - "The model and its canonical constants: A. L. Hodgkin and A. F. Huxley (1952), J. Physiol. 117: 500-544 (g-bar Na 120, g-bar K 36, g-bar L 0.3 mS/cm², Cm 1 µF/cm², Q10 = 3). Equations only."
paper:
  title: "Neuronal excitability and parameter variability in the Hodgkin-Huxley model"
  authors: "Korngreen A"
  journal: "PLOS Computational Biology"
  year: 2026
  doi: "10.1371/journal.pcbi.1014458"
  url: "https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1014458"
  licence: "CC BY 4.0"
  reviewed: true
---

The Hodgkin-Huxley equations are usually taught as a single fixed set of numbers: sodium conductance 120, potassium 36, leak 0.3. But those numbers came from fitting curves to noisy voltage-clamp recordings in 1952, and every fitted number has an error bar. A 2026 paper in *PLOS Computational Biology* asked the obvious follow-up question: if you draw the rate-constant parameters from inside their own error bars, how does the model behave? Across **300,000 parameter sets**, **7.2 % fired action potentials with nothing injected at all**. This article repeats that experiment, in a smaller way, with the [[hodgkin-huxley-simulator]], and maps the region of conductances where a quiet axon becomes a pacemaker. Work out the reversal potentials that go into the model with the [[membrane-potential]], and measure the spike trains that come out with the [[spike-train-analyser]].

## The paper in brief

The author rebuilt the Hodgkin-Huxley rate functions from the digitised 1952 data, bootstrapped each fit 4,000 times to get the spread of every parameter, and then drew whole parameter sets at random from within the mean ± 2 standard deviations. Each set was run in a **10 cm cable of axon** split into 80 compartments (320 coupled differential equations), with current injected 0.4 cm from one end and the response recorded 8 cm away.

The results are not the tidy picture of the textbook. **7.2 % of parameter sets fired spontaneously**, with no stimulus. Of the rest, a stimulus of 8 µA left only about **14 % firing regularly** while **77.7 % were phasic**, firing at the onset of the step and then falling silent. Conduction velocity in the phasic group ranged over about **5 to 15 m/s**, a factor of three. A spike counted as propagating only if it still measured at least **70 mV** at the far electrode. The message is that the canonical 1952 parameter set is one point in a space where behaviour changes qualitatively, not a robust description of a whole family.

## Checked with the tools

fibub's Hodgkin-Huxley simulator is **space-clamped**: it solves the four equations for one patch of membrane, not a cable. So it cannot reproduce the paper's conduction velocities or its distal recordings. What it can do is test the paper's central idea on the reduced model, and that turns out to be enough to recover the same numbers. We varied the **three maximal conductances** (g̅Na, g̅K, g̅L) rather than the paper's 22 rate-constant parameters, because those are the knobs the tool exposes. Everything below is **our own ensemble**, not the paper's data.

**Step 1: the canonical set is quiet, and jumps when pushed.** With the 1952 values at 6.3 °C the tool fires nothing at all with no current. The smallest 1 ms pulse that fires a single spike is **6.9107 µA/cm²** (2.3476 µA/cm² for a 5 ms pulse). On the f–I curve the firing rate does not creep up from zero: it is zero up to **6.75 µA/cm²** and then jumps straight to **57.5 Hz**, reaching 70 Hz at 10 µA/cm², 87.5 Hz at 20 and 100 Hz at 30. At 18.3 °C (the Q₁₀ of 3 gives a factor of 3.5) the same 10 µA/cm² step fires at **185 Hz**, and the 1 ms threshold rises to 8.8352 µA/cm².

<!-- fig:fi -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="The firing rate of the space-clamped Hodgkin-Huxley model against injected current, at 6.3 and 18.3 degrees C. The rate jumps from zero straight to about 50 Hz instead of rising from zero." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Firing rate against injected current</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Firing rate against injected current</text><line x1="58" x2="546" y1="241.2" y2="241.2" style="stroke:var(--line)"/><text x="52" y="245.2" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="179.5" y2="179.5" style="stroke:var(--line)"/><text x="52" y="183.5" text-anchor="end" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="117.9" y2="117.9" style="stroke:var(--line)"/><text x="52" y="121.9" text-anchor="end" style="fill:var(--muted)">200</text><line x1="58" x2="546" y1="56.2" y2="56.2" style="stroke:var(--line)"/><text x="52" y="60.2" text-anchor="end" style="fill:var(--muted)">300</text><line x1="58" x2="58" y1="252" y2="256" style="stroke:var(--muted)"/><text x="58" y="269" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="139.3" x2="139.3" y1="252" y2="256" style="stroke:var(--muted)"/><text x="139.3" y="269" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="220.7" x2="220.7" y1="252" y2="256" style="stroke:var(--muted)"/><text x="220.7" y="269" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="302" x2="302" y1="252" y2="256" style="stroke:var(--muted)"/><text x="302" y="269" text-anchor="middle" style="fill:var(--muted)">15</text><line x1="383.3" x2="383.3" y1="252" y2="256" style="stroke:var(--muted)"/><text x="383.3" y="269" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="464.7" x2="464.7" y1="252" y2="256" style="stroke:var(--muted)"/><text x="464.7" y="269" text-anchor="middle" style="fill:var(--muted)">25</text><line x1="546" x2="546" y1="252" y2="256" style="stroke:var(--muted)"/><text x="546" y="269" text-anchor="middle" style="fill:var(--muted)">30</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Step current (µA/cm²)</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Firing rate (Hz)</text><line x1="167.8" x2="167.8" y1="50" y2="252" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="171.8" y="62" text-anchor="start" style="fill:var(--muted)">jump at 6.75 µA/cm²</text><path d="M58 241.2L70.2 241.2L82.4 241.2L94.6 241.2L106.8 241.2L119 241.2L131.2 241.2L143.4 241.2L155.6 241.2L167.8 205.7L180 202.6L192.2 202.6L204.4 201.1L216.6 199.6L228.8 198L241 196.5L253.2 196.5L265.4 194.9L277.6 194.9L289.8 193.4L302 191.9L314.2 191.9L326.4 190.3L338.6 190.3L350.8 190.3L363 188.8L375.2 188.8L387.4 187.2L399.6 187.2L411.8 185.7L424 185.7L436.2 184.1L448.4 185.7L460.6 184.1L472.8 184.1L485 182.6L497.2 182.6L509.4 182.6L521.6 181.1L533.8 181.1L546 179.5" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 241.2L70.2 241.2L82.4 241.2L94.6 241.2L106.8 241.2L119 241.2L131.2 241.2L143.4 241.2L155.6 241.2L167.8 241.2L180 241.2L192.2 141L204.4 133.3L216.6 128.6L228.8 122.5L241 119.4L253.2 116.3L265.4 111.7L277.6 110.1L289.8 105.5L302 104L314.2 100.9L326.4 97.8L338.6 96.3L350.8 93.2L363 91.7L375.2 88.6L387.4 85.5L399.6 83.9L411.8 82.4L424 79.3L436.2 77.8L448.4 76.2L460.6 73.2L472.8 73.2L485 70.1L497.2 68.5L509.4 67L521.6 65.4L533.8 63.9L546 60.8" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round;stroke-dasharray:5 3"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">6.3 °C (the 1952 fit)</text><line x1="235.2" x2="247.2" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2;stroke-dasharray:5 3"/><text x="251.2" y="40" style="fill:var(--muted)">18.3 °C</text><text class="fibub-mark" x="546" y="290" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The f-I curve of the space-clamped 1952 parameter set, drawn with the Hodgkin-Huxley simulator's own maths at two temperatures. The rate does not rise from zero: it jumps, the type II behaviour the paper relies on when it sorts responses into regular and phasic.</figcaption></figure>
<!-- /fig:fi -->

That jump is why the paper can sort its cable runs into "regular" and "phasic" classes at all: there is no smooth continuum of slow firing to fall into. A model that crosses the boundary does not fire slowly, it fires at 50 Hz or more.

**Step 2: the firing region is a band, not a half-space.** We ran a grid of 720 parameter sets with no stimulus, sweeping g̅Na from 60 to 400 and g̅K from 1 to 40 mS/cm², and asked which ones fired repeatedly after a 50 ms settling time. The answer is a **band** in g̅K that widens as g̅Na rises: at the canonical g̅Na of 120 the model fires on its own for g̅K between about **4 and 22 mS/cm²**, at g̅Na 200 between 6 and 36, and at g̅Na 400 between 11 and 40. Below the band there is too little potassium current to repolarise, and the membrane simply sits depolarised without spiking; above it, the canonical quiet state.

<!-- fig:band -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 308" role="img" aria-label="In the plane of the two maximal conductances, the band of values at which the space-clamped model fires repeatedly with no current injected. The 1952 values sit just above the band." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Where the model never stops firing</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Where the model never stops firing</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--line)"/><text x="52" y="266" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="211.5" y2="211.5" style="stroke:var(--line)"/><text x="52" y="215.5" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="161" y2="161" style="stroke:var(--line)"/><text x="52" y="165" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="110.6" y2="110.6" style="stroke:var(--line)"/><text x="52" y="114.6" text-anchor="end" style="fill:var(--muted)">30</text><line x1="58" x2="546" y1="60.1" y2="60.1" style="stroke:var(--line)"/><text x="52" y="64.1" text-anchor="end" style="fill:var(--muted)">40</text><line x1="115.4" x2="115.4" y1="262" y2="266" style="stroke:var(--muted)"/><text x="115.4" y="279" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="258.9" x2="258.9" y1="262" y2="266" style="stroke:var(--muted)"/><text x="258.9" y="279" text-anchor="middle" style="fill:var(--muted)">200</text><line x1="402.5" x2="402.5" y1="262" y2="266" style="stroke:var(--muted)"/><text x="402.5" y="279" text-anchor="middle" style="fill:var(--muted)">300</text><line x1="546" x2="546" y1="262" y2="266" style="stroke:var(--muted)"/><text x="546" y="279" text-anchor="middle" style="fill:var(--muted)">400</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--muted)"/><text x="302" y="300" text-anchor="middle" style="fill:var(--ink)">g̅Na (mS/cm²)</text><text transform="translate(14 156) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">g̅K (mS/cm²)</text><path d="M58 211.5L86.7 191.3L115.4 171.1L144.1 151L172.8 130.8L201.5 110.6L230.2 95.4L258.9 80.3L287.6 70.2L316.4 60.1L345.1 60.1L373.8 60.1L402.5 60.1L431.2 60.1L459.9 60.1L488.6 60.1L517.3 60.1L546 60.1" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 251.9L86.7 246.9L115.4 246.9L144.1 241.8L172.8 241.8L201.5 236.8L230.2 236.8L258.9 231.7L287.6 231.7L316.4 226.7L345.1 226.7L373.8 221.6L402.5 221.6L431.2 216.6L459.9 216.6L488.6 211.5L517.3 211.5L546 206.5" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round;stroke-dasharray:5 3"/><circle cx="144.1" cy="80.3" r="5" style="fill:var(--ink);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Top of the firing band</text><line x1="242.4" x2="254.4" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2;stroke-dasharray:5 3"/><text x="258.4" y="40" style="fill:var(--muted)">Bottom of the firing band</text><circle cx="453.4" cy="36" r="4" style="fill:var(--ink)"/><text x="464.4" y="40" style="fill:var(--muted)">The 1952 values</text><text class="fibub-mark" x="546" y="300" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The band of maximal conductances at which the space-clamped model fires for ever with no current injected, from a grid of 720 runs. The 1952 values (dot) lie just above the band, so a moderate fall in potassium conductance alone is enough to tip the model into firing.</figcaption></figure>
<!-- /fig:band -->

The 1952 point (120, 36) sits just above the top of the band. Cutting potassium conductance by **39 %**, with nothing else changed, is enough to turn a silent axon into one that never stops. That is the paper's finding in two dimensions.

**Step 3: how much jitter gives 7.2 %?** We drew 600 parameter sets at each of three spreads, multiplying each conductance by an independent lognormal factor with a coefficient of variation of 10, 20 and 30 % (**our assumption**: the paper's spreads are per-rate-constant and not directly comparable). The fraction firing spontaneously was:

| Spread on each conductance | Sets that fire with no stimulus | Median spike height |
|---|---|---|
| 10 % | 0.0 % (0 of 600) | 106.2 mV |
| 20 % | 4.8 % (29 of 600) | 106.3 mV |
| 30 % | 13.3 % (80 of 600) | 106.3 mV |

The paper's **7.2 %** falls neatly between our 20 % and 30 % spreads. Two different parameterisations of "within the error bars", one in a cable of 80 compartments and one on a single patch, land on the same order of magnitude. That is a useful piece of reassurance for anyone reading the paper: the number is about the width of the error bars, not about the cable.

**Step 4: the 70 mV propagation bar is generous in a single patch.** The paper only counts a spike as having arrived if it is still 70 mV tall. In the space-clamped model the spike measured from rest is **106.3 mV** with the canonical values, and the median across all three ensembles stayed at 106 mV; not one of our 1,800 jittered sets fell below 70 mV. The spike height only drops below the bar when sodium conductance is cut to **26.4 mS/cm², just 22 % of the 1952 value** (75.2 mV at 30 mS/cm², 69.3 mV at 26). So the attrition the paper sees at its far electrode is about the cable (current leaking sideways into unexcited membrane), not about the local spike-generating machinery.

| Check | Paper | Space-clamped tool (our ensemble) |
|---|---|---|
| Sets firing with no stimulus | 7.2 % of 300,000 | 4.8 % at 20 % jitter per conductance, 13.3 % at 30 % |
| Regular versus phasic classes | 14 % regular at 8 µA | f–I curve jumps 0 → 57.5 Hz, so no slow-firing class exists |
| Spike height bar for propagation | at least 70 mV | 106.3 mV locally; under 70 mV only when g̅Na drops below 26.4 mS/cm² |
| Conduction velocity 5 to 15 m/s | yes | not testable: the tool has no cable |

## How we made the graphs

Both figures and every number above come from `scripts/blog-figures/hodgkin-huxley-parameter-variability-excitability.mjs` in fibub's public code. It imports `simulate`, `rate`, `threshold` and `DEFAULTS` from `src/lib/sci/hhsim.ts`, the maths behind the [[hodgkin-huxley-simulator]]: the 1952 equations in the modern convention (rest at −65 mV), integrated with fourth-order Runge-Kutta at 0.01 ms steps.

- Figure 1 calls `rate()` at 41 currents from 0 to 30 µA/cm², at 6.3 and 18.3 °C, and `threshold()` for the 1 ms and 5 ms pulses.
- Figure 2 is a grid of 18 sodium values by 40 potassium values. Each point is a 200 ms run with the stimulus amplitude set to zero; "fires on its own" means at least two spikes after 50 ms, so a single settling transient does not count.
- The ensembles are 600 draws each, with a fixed seed so the numbers repeat. The lognormal factors are scaled to have mean 1, so the ensemble is centred on the 1952 values.
- From the paper: the 7.2 % figure, the 14 % and 77.7 % classes, the 70 mV propagation bar and the −20 mV spike-detection level. **Our assumptions:** varying the three maximal conductances instead of 22 rate constants, the 10 to 30 % spreads, the 20 µA/cm² test pulse used to measure spike height, and the space-clamped geometry.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/hodgkin-huxley-simulator.mjs`, which pins the integrator against SciPy's `solve_ivp` (DOP853, relative tolerance 10⁻¹⁰) on the same equations:

- A 10 µA/cm² step from 5 to 45 ms must put spikes at 6.900779304, 21.82224836 and 36.47149026 ms, agreeing with SciPy to within 0.1 µs, with a peak of 40.26314149 mV.
- The same step at 16.3 °C (where the temperature factor is exactly 3) must give seven spikes at the SciPy times, starting at 6.531200669 ms.
- The threshold of a 1 ms pulse must be 6.910691969 µA/cm², from a bisection run in SciPy, and the firing rate must be exactly 70 Hz at 10 µA/cm² and 87.5 Hz at 20.
- The resting state must really be steady: at −65 mV with no current, dV/dt is under 0.01 mV/ms and m, h and n are 0.05293, 0.5961 and 0.3177.
- New with this article: with no current injected and g̅Na at the 1952 value, the model must fire repeatedly at g̅K of 4 and of 22 mS/cm² and stay silent at 3 and at 23, and the spike height from rest for a 20 µA/cm² pulse must be 106.29 mV with the canonical values and 69.30 mV at g̅Na 26.

## Check it yourself

On the [[hodgkin-huxley-simulator]] page:

1. Leave the stimulus on **Step**, with *Amplitude (µA/cm²)* **10**, *Start (ms)* **5**, *Duration (ms)* **40** and *Simulate for (ms)* **60**. You should see **3 spikes, the first at 6.901 ms, peak 40.3 mV**.
2. Set *Single pulse width (ms)* to **1** and press **Find threshold**: **6.911 µA/cm²**. Change it to **5** and press again: **2.348 µA/cm²**.
3. Set *f–I up to (µA/cm²)* to **30** with *Points* **41** and press **Draw f–I curve**. The curve stays at zero until about **6.75 µA/cm²**, then jumps to roughly **57 Hz**: the type II jump of Figure 1.
4. Open *Conductances (block channels)* and set *g̅K (mS/cm²)* to **18**. Now set *Amplitude* to **0** and *Simulate for (ms)* to **200**: the model fires repeatedly with nothing injected. Put *g̅K* back to **30** and the firing stops.
5. Set *g̅K* back to **36**, *g̅Na (mS/cm²)* to **30** and the stimulus back to a **20** µA/cm² step of **5 ms** from 20 ms. The peak is **10.2 mV**, which is **75.2 mV** above the −65 mV rest: still over the paper's 70 mV bar. At *g̅Na* **26** the height falls to **69.3 mV**, just under it.
6. Set *Temperature (°C)* to **18.3** with the 10 µA/cm² step and watch the spikes narrow and crowd together, about 185 Hz.

## What researchers can use it for

- **Show students that a model has a parameter space**, not a parameter set: the firing band of Figure 2 takes two minutes to find by hand with the conductance boxes.
- **Pick a stimulus for a real experiment**: the threshold search gives the charge needed for one spike at a chosen pulse width, before you waste a cell on it.
- **Sanity-check a published f–I curve**: a Hodgkin-Huxley style model that fires smoothly from 1 Hz upwards is not behaving like this one, and that is worth a sentence in the methods.
- **Separate local from cable effects**: if a spike shrinks in your model, run the same conductances space-clamped here; if the local spike is full height, the loss is in the geometry.
- **Teach the temperature factor**: the Q₁₀ of 3 changes firing rate several-fold over 12 °C, which matters when comparing recordings made at room and body temperature.

## The fine print

- The paper simulates a **cable**; the tool simulates a **single patch**. Conduction velocity, distal attenuation and propagation failure are outside what we can check.
- We varied three maximal conductances; the paper varied 22 rate-constant parameters within bootstrapped error bars. Our spreads of 10 to 30 % are our own choice, so the agreement with 7.2 % is a consistency check, not a reproduction.
- Our ensembles are 600 draws each, so a percentage carries a sampling error of about ±1 to ±1.5 points.
- This is a teaching model of a squid axon from 1952, not a model of a mammalian neuron.
