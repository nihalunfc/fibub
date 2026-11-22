---
title: "The dark ages and 21 cm cosmology"
seoTitle: "21 cm cosmology: seeing the cosmic dark ages"
summary: "Before the first stars, the universe held only hydrogen, helium and fading light. Hydrogen's faint 21 cm radio line can map that era in 3D. EDGES, SARAS 3, HERA, SKA and the far side of the Moon."
minutes: 17
updated: 2026-11-22
quiz:
  - q: "At what frequency should a radio telescope listen for hydrogen at redshift z = 17?"
    choices: ["1,420 MHz, the same as in the lab","About 25,000 MHz","About 79 MHz: 1,420 MHz divided by 18"]
    ans: 2
    why: "The expansion stretches the 21 cm wave by 1 + z = 18 times, to 3.8 m, so its frequency drops by the same factor: 1,420.4 ÷ 18 ≈ 79 MHz."
  - q: "Why does cold hydrogen during cosmic dawn show up as an absorption dip against the CMB?"
    choices: ["Because hydrogen is black","Because the CMB was switched off","Starlight locks the hydrogen's spin temperature to the cold gas, below the CMB's temperature, so the gas absorbs more CMB radio waves than it emits"]
    ans: 2
    why: "The signal is set by the spin temperature compared with the CMB. Colder than the CMB means absorption, hotter means emission."
  - q: "What is the status of the EDGES 2018 claim of a deep dip at 78 MHz?"
    choices: ["Confirmed by every experiment","It proved dark matter is made of neutrinos","Unconfirmed: SARAS 3, from India, saw no such dip (2022), and the result is widely thought to need independent checks"]
    ans: 2
    why: "EDGES reported a dip about twice as deep as standard physics allows. SARAS 3 rejected that profile with about 95% confidence. New experiments are still testing it."
sources:
  - "J. D. Bowman, A. E. E. Rogers, R. A. Monsalve, T. J. Mozdzen and N. Mahesh (2018), An absorption profile centred at 78 megahertz in the sky-averaged spectrum, Nature 555, 67 https://doi.org/10.1038/nature25792"
  - "S. Singh et al. (2022), On the detection of a cosmic dawn signal in the radio background, Nature Astronomy 6, 607 https://doi.org/10.1038/s41550-022-01610-5"
  - "S. R. Furlanetto, S. P. Oh and F. H. Briggs (2006), Cosmology at low frequencies: the 21 cm transition and the high-redshift Universe, Physics Reports 433, 181 https://doi.org/10.1016/j.physrep.2006.08.002"
  - "J. R. Pritchard and A. Loeb (2012), 21 cm cosmology in the 21st century, Reports on Progress in Physics 75, 086901 https://doi.org/10.1088/0034-4885/75/8/086901"
  - "A. Loeb and M. Zaldarriaga (2004), Measuring the small-scale power spectrum of cosmic density fluctuations through 21 cm tomography prior to the epoch of structure formation, PRL 92, 211301 https://doi.org/10.1103/PhysRevLett.92.211301"
  - "R. Barkana (2018), Possible interaction between baryons and dark-matter particles revealed by the first stars, Nature 555, 71 https://doi.org/10.1038/nature25791"
  - "H. I. Ewen and E. M. Purcell (1951), Observation of a line in the galactic radio spectrum, Nature 168, 356 https://doi.org/10.1038/168356a0"
  - "SKA Observatory, SKA-Low telescope https://www.skao.int/"
---

**Module 12 · about 17 minutes.** Read first: [6.9 Recombination](/learn/courses/cosmology/recombination/) and [10.5 The first stars and reionisation](/learn/courses/cosmology/first-stars-reionisation/). Between the release of the CMB, 380,000 years after the start, and the first stars, a hundred million years later, the universe was dark. No telescope has yet seen anything from that time. One faint radio signal from hydrogen could change that, and it may become the richest map in all of cosmology. By the end you will be able to explain where the 21 cm line comes from, tune a radio to any era, read the predicted signal, and judge the EDGES claim.

<div class="bigidea">Hydrogen gives out radio waves 21 cm long. Stretched by the expansion, they arrive at frequencies that label their era: tune a radio telescope and you slice the young universe, layer by layer. The signal is tiny and buried under radio noise from our own galaxy about ten thousand times brighter, but it reaches times nothing else can.</div>

## 1. The dark ages

After recombination ([Lesson 6.9](/learn/courses/cosmology/recombination/)) the universe was a smooth, thin gas of hydrogen and helium, bathed in the cooling glow of the CMB. That glow started orange-hot and slid into the infrared within a few million years; there were no stars yet. These are the **dark ages**, ending when the first stars lit up around 100 to 200 million years (cosmic dawn, [Lesson 10.5](/learn/courses/cosmology/first-stars-reionisation/)). Within the first billion years, starlight had stripped the electrons off almost all the hydrogen between galaxies again: reionisation, the knob τ of [Lesson 12.1](/learn/courses/cosmology/lambda-cdm/).

The gas did one useful thing all along: it held its own tiny radio beacon.

## 2. Hydrogen's 21 cm line

<div class="steps" data-fig="dark-ages-21cm-2">
<div class="step">A hydrogen atom is a proton and an electron, and each is a tiny magnet (it has "spin"). When the two spins point the same way, the atom has a very little extra energy: 5.9 millionths of an electronvolt.</div>
<div class="step">Now and then the electron flips to the opposite direction and the atom gives out a photon of exactly 1,420.4 MHz: a radio wave 21.1 cm long. One atom does this only about once in 11 million years, but the universe holds so much hydrogen that the line is easy to see in our galaxy.</div>
<div class="step">On its way to us, the expansion stretches the wave by (1 + z): hydrogen at z = 6 arrives 1.5 m long, at z = 17 about 3.8 m. Everything from that era arrives at the same stretched frequency.</div>
<div class="step">So each frequency is one shell of space at one moment in time. Radio maps at many frequencies stack into a 3D movie of the young universe: 21 cm tomography.</div>
</div>

```math
\nu_\text{obs} = \frac{1420.4\ \text{MHz}}{1+z}
```

<div class="meaning">

<dl>
<dt>1,420.4 MHz</dt><dd>the frequency hydrogen's spin flip gives out, measured in the lab to many decimal places</dd>
<dt>ν<sub>obs</sub></dt><dd>the frequency it arrives at after being stretched by the expansion</dd>
<dt>z</dt><dd>the redshift of the gas, which labels both its distance and its time</dd>
<dt>Physical meaning</dt><dd>Frequency is a time machine. 200 MHz is the end of reionisation (z ≈ 6); 50 to 100 MHz is cosmic dawn; below about 30 MHz are the dark ages themselves. That last range is where Earth's sky gets in the way (section 5).</dd>
</dl>

</div>

<div class="problem" data-problem="dark-ages-21cm-freq"></div>

## 3. Absorbing or glowing: the spin temperature

The gas does not glow on its own against an empty sky; it sits in front of the CMB. Whether it adds radio light or takes some away depends on the **spin temperature** T<sub>S</sub>, a measure of how many atoms are in the upper state. If T<sub>S</sub> is below the CMB's temperature, the gas absorbs; above it, the gas glows. Three things set T<sub>S</sub>: collisions between atoms (pulling it to the gas temperature), CMB photons (pulling it to the CMB's), and ultraviolet starlight (which, through a process found by Wouthuysen and Field in the 1950s, also pulls it to the gas temperature).

```math
\delta T_b \approx 27\,\text{mK} \; x_\text{HI} \sqrt{\frac{1+z}{10}} \left(1 - \frac{T_\text{CMB}}{T_S}\right)
```

<div class="meaning">

<dl>
<dt>δT<sub>b</sub></dt><dd>the signal: how much brighter (+) or dimmer (−) the sky is than the CMB alone, in millikelvin</dd>
<dt>x<sub>HI</sub></dt><dd>the fraction of hydrogen still neutral: 1 in the dark ages, 0 after reionisation</dd>
<dt>T<sub>CMB</sub>, T<sub>S</sub></dt><dd>the CMB temperature then, 2.7255 × (1 + z) K, and the spin temperature</dd>
<dt>Physical meaning</dt><dd>The signal is at most a few hundred millikelvin, while our galaxy's radio glow at these frequencies is thousands of kelvin. The 27 mK depends on the amount of atoms (Ω<sub>b</sub>h²) and the matter density, which the CMB already fixes (Furlanetto, Oh and Briggs 2006).</dd>
</dl>

</div>

Follow the gas through time. After about z = 150 the gas stops being warmed by the CMB and cools faster than it (gas cools as (1 + z)², light as (1 + z)), so in the dark ages it absorbs a little. Collisions fade as the universe thins, and the signal fades with them. Then the first stars' ultraviolet light couples the spin temperature to the cold gas again: a deep **cosmic dawn dip**. X-rays from early black holes and stellar remnants heat the gas above the CMB, so it glows; finally reionisation removes the neutral hydrogen and the signal disappears.

<figure class="fig" data-fig="dark-ages-21cm"><figcaption>The sky-averaged 21 cm signal against the frequency we receive (illustrative standard curve; real predictions vary in depth and timing). Slide to tune the radio and see which era you hear. Show the EDGES 2018 claim to compare its depth. Shaded: the FM radio band and the low frequencies the ionosphere spoils.</figcaption></figure>

<div class="problem" data-problem="dark-ages-21cm-depth"></div>

## 4. EDGES and SARAS 3

In 2018 the **EDGES** team, using a table-sized antenna in the Western Australian outback, reported a dip in the radio sky centred at **78 MHz** (z ≈ 17), about 0.5 K deep and flat-bottomed (Bowman et al. 2018). The timing fitted cosmic dawn. The depth did not: it was about twice the deepest dip standard physics allows, since the gas cannot be colder than adiabatic cooling makes it. Explanations ranged from dark matter particles cooling the gas (Barkana 2018) to an extra radio background, or an error in removing our galaxy's glow, which is about 10,000 times brighter.

In 2022 **SARAS 3**, built by the Raman Research Institute in Bengaluru and floated on lakes in Karnataka to keep the ground's influence even, looked for the same dip and did not find it, rejecting the EDGES profile with about 95% confidence (Singh et al. 2022). As of late 2025 the EDGES signal is unconfirmed, and further experiments are testing it. This is how hard and how exciting the field is: one antenna and very careful calibration can challenge physics.

## 5. Mapping it, and going to the Moon

Rather than one sky-average, arrays of antennas can map the 21 cm **fluctuations**, the cosmic web at cosmic dawn. LOFAR (Europe), the MWA (Western Australia), the GMRT (India) and HERA (350 dishes in South Africa) have set ever-tighter limits; HERA's showed that the gas had been heated by X-rays by z ≈ 8. The big leap will be **SKA-Low**, being built in Western Australia since 2022, with about 131,000 antennas; its early science is expected from about 2027, and it should make the first true images of reionisation.

The dark ages themselves, at 10 to 30 MHz, are hard to reach from Earth: the ionosphere distorts or blocks these waves, and radio stations drown them. The far side of the Moon is shielded from Earth's radio noise and has no ionosphere, so lunar radio telescopes are being planned, starting with small pathfinders. The prize is enormous: 21 cm maps of the dark ages would hold far more independent ripples than the CMB, because they are 3D and keep detail on very small scales (Loeb and Zaldarriaga 2004). They could test inflation, neutrino masses and dark matter, perhaps better than anything else. GMRT and other radio telescopes are explained further in [Lesson 12.8](/learn/courses/cosmology/india-in-cosmology/); fibub's [radio telescope calculator](/science/radio-telescope-calculator/) works out how sharp a dish or array can see.

<div class="history">

**A line predicted in wartime.**

<ul class="timeline">
<li><b>1944</b> Hendrik van de Hulst, in occupied Netherlands, predicts the 21 cm line.</li>
<li><b>1951</b> Harold Ewen and Edward Purcell detect it at Harvard; Dutch and Australian teams confirm within weeks. It soon maps the Milky Way's spiral arms.</li>
<li><b>1952-1958</b> Wouthuysen and Field explain how starlight sets the spin temperature.</li>
<li><b>2004</b> Loeb and Zaldarriaga show the dark ages could hold the richest map in cosmology.</li>
<li><b>2018</b> EDGES claims a deep dip at 78 MHz.</li>
<li><b>2022</b> SARAS 3 does not see it; SKA-Low construction begins.</li>
</ul>

</div>

<div class="myth">

**"The dark ages were dark because the universe was empty."** It was full: nearly all the hydrogen and helium that would ever make stars was there, along with the CMB's light. It was "dark" because no stars shone and the CMB's glow had moved into the infrared. To radio telescopes it is not dark at all.

</div>

<div class="keypoints">

- The dark ages run from the CMB (380,000 years) to the first stars (about 100 to 200 million years); no light from them has been detected yet.
- Hydrogen's spin flip gives out radio waves of 1,420.4 MHz (21.1 cm), stretched to 1,420.4/(1 + z) MHz: each frequency is a slice of cosmic time.
- The signal against the CMB depends on the spin temperature: absorption in the dark ages and at cosmic dawn, glow after X-ray heating, nothing after reionisation.
- EDGES (2018) claimed a 0.5 K dip at 78 MHz, twice the standard maximum; SARAS 3 (2022, India) did not see it.
- HERA, LOFAR, MWA and GMRT set limits now; SKA-Low (early science around 2027) and future lunar far-side telescopes aim to map cosmic dawn and the dark ages in 3D.

</div>
