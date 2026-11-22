---
title: "WMAP and Planck: mapping the baby universe"
seoTitle: "WMAP and Planck: how we mapped the CMB"
summary: "NASA's WMAP (2001 to 2010) and ESA's Planck (2009 to 2013) mapped the cosmic microwave background over the whole sky, each far sharper than the one before. How they worked, how they removed the Milky Way, and what they found."
minutes: 14
updated: 2026-11-22
quiz:
  - q: "Why did WMAP and Planck observe the sky at several frequencies?"
    choices: ["To see different times in the universe's history","To take colour photographs","To separate the CMB, which has the same blackbody temperature at every frequency, from the Milky Way's glow, which does not"]
    ans: 2
    why: "The Milky Way's dust and radio glow change strongly with frequency; the CMB does not. Comparing bands lets them subtract the foreground."
  - q: "Roughly how sharp was Planck's view, at its best?"
    choices: ["About 7°","About 1 arcsecond","About 5 arcminutes, a sixth of the full Moon"]
    ans: 2
    why: "Planck's best beam was about 5 arcminutes (0.08°), compared with WMAP's 13 arcminutes and COBE's 7°."
  - q: "Why did both satellites orbit the L2 point, 1.5 million km from Earth?"
    choices: ["Sun, Earth and Moon all stay behind them, so the telescope can look away from their heat and glow while it scans the sky","To be closer to the CMB","To escape the solar wind"]
    ans: 0
    why: "From L2 the Sun, Earth and Moon are always on the same side, so a sunshield keeps the instruments cold and dark while they spin and map the whole sky."
sources:
  - "C. L. Bennett et al. (2003), First-year Wilkinson Microwave Anisotropy Probe (WMAP) observations: preliminary maps and basic results, ApJS 148, 1 https://doi.org/10.1086/377253"
  - "C. L. Bennett et al. (2013), Nine-year WMAP observations: final maps and results, ApJS 208, 20 https://doi.org/10.1088/0067-0049/208/2/20"
  - "Planck Collaboration (2020), Planck 2018 results. I. Overview and the cosmological legacy of Planck, A&A 641, A1 https://doi.org/10.1051/0004-6361/201833880"
  - "Planck Collaboration (2020), Planck 2018 results. VI. Cosmological parameters, A&A 641, A6 https://doi.org/10.1051/0004-6361/201833910"
  - "ESA, Planck mission pages https://www.esa.int/Science_Exploration/Space_Science/Planck"
---

**Module 7 · about 14 minutes.** Read first: [7.5 Sound waves in the early universe](/learn/courses/cosmology/acoustic-peaks/). COBE found the ripples, but with eyes 7° wide it could not see the sound waves, whose spots are about 1°. Two satellites changed that. By the end you will be able to say what WMAP and Planck did differently, how they cleaned the sky, and what they found.

<div class="bigidea">Each new satellite saw the baby universe in finer detail: COBE's blobs became WMAP's spots and then Planck's sharp map, sharp enough to read seven sound-wave peaks.</div>

## 1. Sharper and sharper

What a telescope can see is set by its **beam**, the smallest patch of sky it can tell apart. Anything smaller is blurred together, the way a photo taken out of focus loses the fine print.

<figure class="fig" data-fig="wmap-planck"><figcaption>The same patch of CMB-like sky, 30° by 18°, through three satellites' beams (the circle shows each beam to scale). COBE sees only the biggest blobs; WMAP resolves the 1° spots; Planck sees nearly everything down to a few arcminutes.</figcaption></figure>

A rough count of how many independent readings a satellite gets from the whole sky:

```math
N \approx \frac{41{,}253\ \text{deg}^2}{\theta^2}
```

<div class="meaning">

<dl>
<dt>41,253 deg²</dt><dd>the area of the whole sky in square degrees</dd>
<dt>θ</dt><dd>the beam size in degrees (5 arcminutes = 0.083°)</dd>
<dt>N</dt><dd>roughly how many separate patches, so separate temperature readings, fit on the sky</dd>
<dt>Physical meaning</dt><dd>Halving the beam gives four times as many readings. More readings at smaller sizes means more peaks measured, and each parameter of the universe pinned more tightly.</dd>
</dl>

</div>

<div class="problem" data-problem="wmap-planck-patches"></div>

## 2. WMAP: the precision era begins

NASA's **Microwave Anisotropy Probe** launched on 30 June 2001. It was renamed WMAP in 2003 to honour David Wilkinson of Princeton (the same Wilkinson of Lesson 7.1), a leader of the mission, who had died in 2002. WMAP flew to the **L2 point**, 1.5 million km from Earth on the side away from the Sun, where Sun, Earth and Moon always stay behind a sunshield. It had two telescopes pointing back to back and measured only the *difference* in temperature between two directions 141° apart, a trick that cancels most instrument drifts. Spinning and slowly turning, it covered the whole sky every six months, in five bands from 23 to 94 GHz, with a beam of 13 arcminutes at its sharpest.

In February 2003 the first-year results made headlines: the universe is 13.7 billion years old (give or take 0.2 billion), space is flat (to within 2%), and it is made of about 4% atoms, 23% dark matter and 73% dark energy. WMAP also found that the first stars had re-ionised the universe earlier than expected ([Lesson 7.7](/learn/courses/cosmology/cmb-polarisation/)). It observed for nine years, until August 2010.

## 3. Planck: the definitive map

ESA's **Planck** launched with the Herschel space telescope on 14 May 2009, also to L2. It carried two instruments: a radiometer for 30 to 70 GHz, and detectors called bolometers, cooled to a tenth of a degree above absolute zero, for 100 to 857 GHz. Nine bands in all, from long microwaves to the far infrared, with a best beam of about 5 arcminutes and a sensitivity of a few millionths of a kelvin per beam. The coldest detectors ran out of coolant in January 2012, after five full sky surveys; the radiometers carried on until Planck was switched off on 23 October 2013.

Planck released results in 2013, 2015 and 2018. Its temperature power spectrum shows seven acoustic peaks, matching the standard model of cosmology so well that the universe's main numbers are now known to 1% or better (Lesson 7.8).

## 4. Cleaning the sky

The famous Planck map is not a photograph. It is built by combining all nine bands: the Milky Way's radio glow from electrons is brightest below about 70 GHz, its dust brightest above about 100 GHz, and the CMB is the one signal with the same blackbody temperature in every band. Clever weighted mixes of the bands cancel the foregrounds and keep the CMB. The cleanest region, around 70 to 100 GHz, is where both foregrounds are weakest. Galaxy clusters and distant dusty galaxies are found and removed the same way, and are useful science in their own right.

<div class="history">

**Three generations.**

<ul class="timeline">
<li><b>1989–1993</b> COBE: 7° beam, ripples found in 1992</li>
<li><b>1998–2000</b> Balloons and ground telescopes (BOOMERanG, MAXIMA, TOCO, DASI) find the first peak</li>
<li><b>2001–2010</b> WMAP: 5 bands, 13′ beam, the first precise recipe in 2003</li>
<li><b>2009–2013</b> Planck: 9 bands, 5′ beam; final results 2018</li>
<li><b>Today</b> Ground telescopes such as the Atacama Cosmology Telescope and the South Pole Telescope map the smallest scales; the Simons Observatory and Japan's planned LiteBIRD satellite will chase polarisation</li>
</ul>

</div>

<div class="myth">

**"The Planck map shows the universe's galaxies when it was young."** There were no galaxies then: the map shows temperature differences of a few hundred millionths of a degree in a nearly smooth fog, coloured red and blue so we can see them. A few odd features, such as a large "Cold Spot" and slightly weak ripples on the very largest scales, are still debated; most cosmologists think they are flukes of chance, which a single sky makes hard to rule out.

</div>

<div class="keypoints">

- WMAP (NASA, 2001–2010): L2 orbit, differential measurements, 5 bands, 13′ beam. In 2003 it gave the first precise recipe: 13.7 billion years, flat, 4% atoms.
- Planck (ESA, 2009–2013): 9 bands from 30 to 857 GHz, 5′ beam, detectors at 0.1 K; seven peaks; final results 2018.
- Several frequencies let the CMB, which is the same blackbody in every band, be separated from the Milky Way's dust and radio glow.
- A smaller beam gives more independent readings (N ≈ 41,253 deg²/θ²) and so more peaks and tighter numbers.

</div>
