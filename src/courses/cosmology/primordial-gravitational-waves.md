---
title: "Primordial gravitational waves and the BICEP2 lesson"
seoTitle: "Primordial gravitational waves, B-modes and BICEP2"
summary: "Inflation should have shaken space-time itself, leaving gravitational waves that twist the CMB's polarisation into B-modes. The 2014 BICEP2 claim, the dust that undid it, and today's limit r < 0.036."
minutes: 18
updated: 2026-11-22
quiz:
  - q: "Why would finding primordial B-modes be so important?"
    choices: ["They would prove dark matter exists","Their strength r fixes the energy of inflation, and density ripples alone cannot make them on degree scales","They are made by stars"]
    ans: 1
    why: "The gravitational-wave strength depends only on the expansion rate during inflation, so r gives the energy scale directly: about 10¹⁶ GeV × (r/0.01)^(1/4)."
  - q: "What went wrong with the BICEP2 result of March 2014?"
    choices: ["The telescope was pointed at the Sun","Polarised light from dust in our own galaxy, underestimated at the time, could explain the whole signal","The data were made up"]
    ans: 1
    why: "The B-mode pattern was real, but Planck's dust maps and a joint analysis in early 2015 showed it was consistent with dust. Only an upper limit on r survived."
  - q: "What does the limit r < 0.036 rule out?"
    choices: ["All of inflation","Gravitational waves from black holes","The simplest 'ball in a bowl' inflation model, V = ½m²φ², which predicts r ≈ 0.13"]
    ans: 2
    why: "Plateau models such as Starobinsky's predict r of about 0.003 to 0.004 and survive. The next experiments aim to reach that level."
sources:
  - "BICEP2 Collaboration (2014), Detection of B-mode polarization at degree angular scales by BICEP2, Physical Review Letters 112, 241101 https://doi.org/10.1103/PhysRevLett.112.241101"
  - "BICEP2/Keck and Planck Collaborations (2015), Joint analysis of BICEP2/Keck Array and Planck data, Physical Review Letters 114, 101301 https://doi.org/10.1103/PhysRevLett.114.101301"
  - "BICEP/Keck Collaboration (2021), Improved constraints on primordial gravitational waves using Planck, WMAP, and BICEP/Keck observations through the 2018 observing season, Physical Review Letters 127, 151301 https://doi.org/10.1103/PhysRevLett.127.151301"
  - "M. Tristram et al. (2022), Improved limits on the tensor-to-scalar ratio using BICEP and Planck data, Physical Review D 105, 083524 https://doi.org/10.1103/PhysRevD.105.083524"
  - "U. Seljak and M. Zaldarriaga (1997), Signature of gravity waves in the polarization of the microwave background, Physical Review Letters 78, 2054 https://doi.org/10.1103/PhysRevLett.78.2054"
  - "M. Kamionkowski, A. Kosowsky and A. Stebbins (1997), A probe of primordial gravity waves and vorticity, Physical Review Letters 78, 2058 https://doi.org/10.1103/PhysRevLett.78.2058"
  - "M. Kamionkowski and E. D. Kovetz (2016), The quest for B modes of the cosmic microwave background, Annual Review of Astronomy and Astrophysics 54, 227 https://doi.org/10.1146/annurev-astro-081915-023433"
---

**Module 11 · about 18 minutes.** Read first: [11.3 Quantum jitters become galaxies](/learn/courses/cosmology/quantum-seeds/), [3.9 Gravitational waves](/learn/courses/cosmology/gravitational-waves/) and [7.7 CMB polarisation](/learn/courses/cosmology/cmb-polarisation/). The inflaton was not the only thing jittering during inflation. Space-time itself did too. By the end you will be able to explain what the number r measures, why a swirling pattern in the CMB would reveal it, and what the BICEP2 episode teaches about doing science.

<div class="bigidea">Inflation should have left a faint sea of gravitational waves. They would twist the CMB's polarisation into swirls called B-modes, and their strength would tell us the energy of inflation. A famous claim to have seen them in 2014 turned out to be dust; the hunt goes on.</div>

## 1. Space-time jitters too

Gravitational waves are ripples in space-time itself ([Lesson 3.9](/learn/courses/cosmology/gravitational-waves/)). Quantum physics says the gravitational field jitters like any other, and during inflation those jitters were stretched and frozen exactly like the inflaton's (Lesson 11.3). Their strength depends on only one thing, the expansion rate H during inflation. Cosmologists compare it with the density ripples:

```math
\Delta_t^2 = \frac{2}{\pi^2}\frac{H^2}{\bar M_\text{P}^2}, \qquad r = \frac{\Delta_t^2}{\Delta_\zeta^2} = 16\,\varepsilon
```

<div class="meaning">

<dl>
<dt>Δ<sub>t</sub>²</dt><dd>the strength of the primordial gravitational waves (the "tensor" ripples)</dd>
<dt>M̄<sub>P</sub></dt><dd>the reduced Planck mass, 2.435 × 10<sup>18</sup> GeV, which sets how stiff space-time is</dd>
<dt>r</dt><dd>the <b>tensor-to-scalar ratio</b>: gravitational waves compared with density ripples (Δ<sub>ζ</sub>² = 2.1 × 10<sup>−9</sup>)</dd>
<dt>ε</dt><dd>the slow-roll parameter from Lesson 11.2: how fast H was falling</dd>
<dt>Physical meaning</dt><dd>Since H² is set by the energy density V, measuring r measures the energy of inflation: V<sup>1/4</sup> ≈ 1.0 × 10<sup>16</sup> GeV × (r/0.01)<sup>1/4</sup>. A detection would be our first direct look at physics a trillion times beyond the LHC.</dd>
</dl>

</div>

<div class="problem" data-problem="primordial-gravitational-waves-scale"></div>

## 2. The swirl test: E-modes and B-modes

The CMB is slightly polarised: its light waves vibrate a little more in one direction than another, set when it last scattered off electrons ([Lesson 7.7](/learn/courses/cosmology/cmb-polarisation/)). Draw that direction as a short stick at each point on the sky. Any such pattern splits into two kinds:

- **E-modes:** sticks point straight towards spots or run in rings around them. They look the same in a mirror. Density ripples make these.
- **B-modes:** the same sticks turned by 45°, making pinwheels that twist left or right. A mirror swaps the twists. Density ripples cannot make them (at first order). Gravitational waves, which stretch and squeeze space with a twist, can.

<figure class="fig" data-fig="primordial-gravitational-waves"><figcaption>The same bumpy field drawn as an E pattern and as a B pattern. Each B stick is the E stick turned by 45°. Try both with one spot and with many.</figcaption></figure>

Primordial gravitational waves would show up as B-modes on scales of about 1° to 2° (made at the time of the CMB), and on the largest scales (made when the first stars re-ionised the gas, [Lesson 10.5](/learn/courses/cosmology/first-stars-reionisation/)). Two impostors also make B-modes: **gravitational lensing**, which bends E-modes into B-modes on small scales (first detected in 2013), and **dust** in our own galaxy, whose spinning grains line up with the galaxy's magnetic field and glow with polarised light.

## 3. The BICEP2 story

<div class="steps" data-fig="primordial-gravitational-waves-2">
<div class="step">Before the data: models make sharp predictions. The simplest hill, ½m²φ², predicts r ≈ 0.13 to 0.16. Starobinsky's plateau predicts only about 0.004.</div>
<div class="step">17 March 2014. The BICEP2 telescope at the South Pole reports B-modes on degree scales: r = 0.20, far above zero. Press conferences, front pages, talk of Nobel prizes.</div>
<div class="step">BICEP2 had measured at only one frequency, 150 GHz, and relied on early, incomplete estimates of dust. In September 2014 Planck's dust maps showed dust was bright enough to matter even in BICEP2's "clean" patch. In January 2015 a joint BICEP2/Keck and Planck analysis found the signal consistent with dust alone: r &lt; 0.12.</div>
<div class="step">With more frequencies to separate dust from the CMB, the limits fell: r &lt; 0.06 (2018), r &lt; 0.036 (BICEP/Keck, 2021), r &lt; 0.032 adding Planck and other data (2022). The ½m²φ² model is out.</div>
<div class="step">The next goal: r of about 0.001 to 0.003, enough to test Starobinsky-like plateaus.</div>
</div>

The lesson is not that the team was careless: the B-mode pattern they saw was real, and their instrument was superb. The mistake was confidence in a foreground estimate and announcing before independent checks. Science corrected itself within a year, in public, with the same team as a partner in the correction.

<div class="problem" data-problem="primordial-gravitational-waves-models"></div>

## 4. Where the hunt stands

Today, **r &lt; 0.036** (BICEP/Keck 2021, 95% confidence) and r &lt; 0.032 with Planck data added. That already rules out the simplest model and pushes favoured models towards plateaus, which predict r around 0.003 to 0.004, or even smaller for other models. A non-detection would not kill inflation: many valid models predict r far below anything measurable.

The next experiments are the BICEP Array at the South Pole, the Simons Observatory in Chile's Atacama desert, and LiteBIRD, a Japanese-led satellite planned for launch in the 2030s that would map the largest scales from space. A larger US ground project, CMB-S4, was planned for the 2030s, but in 2025 the US funding agencies stepped back from it in its planned form.

What about gravitational-wave detectors? In 2023 pulsar-timing arrays found a background of very long gravitational waves, but it is most likely from pairs of supermassive black holes. Simple inflation predicts waves far too weak for LIGO, pulsar timing or the planned LISA mission; the CMB is the best place to look.

<div class="history">

**The B-mode hunt.**

<ul class="timeline">
<li><b>1997</b> Uroš Seljak and Matias Zaldarriaga, and Marc Kamionkowski, Arthur Kosowsky and Albert Stebbins, show that B-modes would single out gravitational waves.</li>
<li><b>2002</b> DASI detects the CMB's polarisation (E-modes).</li>
<li><b>2013</b> SPTpol detects B-modes from gravitational lensing.</li>
<li><b>Mar 2014</b> BICEP2 announces r = 0.20.</li>
<li><b>Jan 2015</b> The joint BICEP2/Keck/Planck analysis attributes the signal to dust (published March 2015).</li>
<li><b>2021</b> BICEP/Keck: r &lt; 0.036.</li>
</ul>

</div>

<div class="myth">

**"BICEP2 proved inflation, then disproved it."** Neither. The 2014 claim was withdrawn because dust could explain it, not because gravitational waves were shown to be absent. The limits since then rule out some models of inflation, not inflation itself. Inflation's case rests mainly on the evidence of Lesson 11.3.

</div>

<div class="keypoints">

- Inflation should have made primordial gravitational waves with strength Δ<sub>t</sub>² = 2H²/(π²M̄<sub>P</sub>²), set only by the energy of inflation.
- The tensor-to-scalar ratio r = 16ε gives that energy: V<sup>1/4</sup> ≈ 10<sup>16</sup> GeV × (r/0.01)<sup>1/4</sup>.
- Gravitational waves twist the CMB's polarisation into B-modes, which density ripples do not make; lensing and galactic dust also make B-modes.
- BICEP2 claimed r = 0.20 in March 2014; a joint analysis with Planck in 2015 showed the signal was consistent with dust.
- Today r &lt; 0.036 (BICEP/Keck 2021), &lt; 0.032 with Planck. ½m²φ² is ruled out; plateau models (r ≈ 0.003) are the next target.

</div>
