---
title: "Standard sirens: measuring with gravitational waves"
seoTitle: "Standard sirens: Hubble constant from gravitational waves"
summary: "Merging neutron stars and black holes announce their own distance in gravitational waves, with no distance ladder. How standard sirens work, what GW170817 gave, dark sirens, and LISA and the next detectors."
minutes: 16
updated: 2026-11-22
quiz:
  - q: "Why is a merger called a 'standard siren'?"
    choices: ["Because it makes a loud sound in space","General relativity predicts how strong its waves are at the source, so the measured strength gives its distance, as a standard candle's brightness does","Because all mergers are the same distance away"]
    ans: 1
    why: "How fast the pitch rises gives the chirp mass, and the chirp mass fixes how strong the waves are at the source. Compare with the measured strength and you have the distance, with no ladder."
  - q: "What can gravitational waves NOT tell us on their own?"
    choices: ["The redshift: the wave gives distance, but redshift and mass are tangled together in its shape","The distance","Whether the objects merged"]
    ans: 0
    why: "A heavier pair nearby and a lighter pair farther away, stretched by redshift, chirp the same way. The redshift has to come from light (a host galaxy) or from statistics (dark sirens)."
  - q: "GW170817 gave H0 = 70 (+12, −8) km/s/Mpc. What limited its precision most?"
    choices: ["The tilt of the orbit: a face-on pair far away looks like a tilted pair closer by","The speed of light","The size of the Earth"]
    ans: 0
    why: "The wave's strength depends on both distance and viewing angle. Measuring the angle another way (for GW170817, from its radio jet) tightens the answer."
sources:
  - "B. F. Schutz (1986), Determining the Hubble constant from gravitational wave observations, Nature 323, 310 https://doi.org/10.1038/323310a0"
  - "D. E. Holz and S. A. Hughes (2005), Using gravitational-wave standard sirens, ApJ 629, 15 https://doi.org/10.1086/431341"
  - "B. P. Abbott et al. (LIGO, Virgo and partners) (2017), A gravitational-wave standard siren measurement of the Hubble constant, Nature 551, 85 https://doi.org/10.1038/nature24471"
  - "K. Hotokezaka et al. (2019), A Hubble constant measurement from superluminal motion of the jet in GW170817, Nature Astronomy 3, 940 https://doi.org/10.1038/s41550-019-0820-1"
  - "H.-Y. Chen, M. Fishbach and D. E. Holz (2018), A two per cent Hubble constant measurement from standard sirens within five years, Nature 562, 545 https://doi.org/10.1038/s41586-018-0606-0"
  - "LIGO Scientific, Virgo and KAGRA Collaborations (2023), Constraints on the cosmic expansion history from GWTC-3, ApJ 949, 76 https://doi.org/10.3847/1538-4357/ac74bb"
  - "P. Amaro-Seoane et al. (2017), Laser Interferometer Space Antenna, arXiv:1702.00786 https://arxiv.org/abs/1702.00786"
---

**Module 12 · about 16 minutes.** Read first: [3.9 Gravitational waves](/learn/courses/cosmology/gravitational-waves/), which introduces the chirp and GW170817, and [12.2 The Hubble tension](/learn/courses/cosmology/hubble-tension/). Every distance in the ladder leans on the rung below it. Gravitational waves offer a ruler that leans on nothing but Einstein's equations. By the end you will be able to explain how a merger reveals its own distance, work out H<sub>0</sub> from one event, and say why dozens of events are needed and what the next detectors will add.

<div class="bigidea">A pair of merging neutron stars or black holes tells us, in the shape of its gravitational waves, how strong those waves were at the source. Compare with how strong they are here and you have the distance, with no ladder at all. Add the redshift from light, and you have the expansion rate.</div>

## 1. How a merger tells its distance

The idea is Bernard Schutz's, from 1986; Daniel Holz and Scott Hughes named such sources **standard sirens** in 2005, by analogy with standard candles ([Lesson 2.2](/learn/courses/cosmology/standard-candles/)). It works in five steps. Press play.

<div class="steps" data-fig="standard-sirens">
<div class="step">Two neutron stars spiral together. Their gravitational waves rise in pitch and strength: the chirp. Detectors record the wave's shape over seconds to minutes.</div>
<div class="step">How fast the pitch rises depends on one combination of the two masses, the chirp mass 𝓜. Heavier pairs sweep up in pitch faster. So the shape of the chirp gives 𝓜.</div>
<div class="step">General relativity then says how strong the waves must be at the source. They weaken as 1/distance on the way to us (not 1/distance², because detectors measure the wave's amplitude, not its energy). Measured strength ÷ expected strength gives the distance. Slide the distance to see the wave weaken.</div>
<div class="step">A flash of light from the merger (for neutron stars, a kilonova) shows which galaxy it happened in. That galaxy's redshift gives its speed away from us.</div>
<div class="step">Speed ÷ distance = H₀. One point on Hubble's law, with a ruler that used no Cepheids, no supernovae and no CMB.</div>
</div>

The two key formulas, for a pair whose orbit faces us:

```math
\dot f = \frac{96}{5}\,\pi^{8/3} \left(\frac{G\mathcal{M}}{c^3}\right)^{5/3} f^{11/3}, \qquad h = \frac{4}{d_L} \left(\frac{G\mathcal{M}}{c^2}\right)^{5/3} \left(\frac{\pi f}{c}\right)^{2/3}
```

<div class="meaning">

<dl>
<dt>f, ḟ</dt><dd>the wave's frequency (twice the orbit's) and how fast it rises</dd>
<dt>𝓜</dt><dd>the chirp mass, (m<sub>1</sub>m<sub>2</sub>)<sup>3/5</sup>/(m<sub>1</sub> + m<sub>2</sub>)<sup>1/5</sup>: for GW170817 about 1.19 Suns</dd>
<dt>h</dt><dd>the strain: how much the detector's arms stretch, per metre (around 10<sup>−22</sup>)</dd>
<dt>d<sub>L</sub></dt><dd>the luminosity distance (<a href="/learn/courses/cosmology/cosmological-distances/">Lesson 5.8</a>)</dd>
<dt>Physical meaning</dt><dd>The first equation turns "how fast the pitch rises" into 𝓜. The second then turns "how strong" into distance. Nothing else is needed but general relativity, which is why sirens are self-calibrating.</dd>
</dl>

</div>

<div class="problem" data-problem="standard-sirens-distance"></div>

## 2. GW170817: the first siren

On 17 August 2017 LIGO and Virgo caught two neutron stars merging; 1.7 seconds later a burst of gamma rays arrived, and telescopes found the kilonova in the galaxy NGC 4993. The waves put it about 44 Mpc away (130 million light-years). The galaxy's speed with the expansion, after correcting for its own motion within its group, was about 3,017 km/s. Result: **H<sub>0</sub> = 70 (+12, −8) km/s/Mpc** (Abbott et al. 2017).

<div class="problem" data-problem="standard-sirens-h0"></div>

Why such wide error bars? The wave's strength also depends on how the orbit is tilted towards us: a face-on pair far away looks like a tilted pair closer by. Radio telescopes later tracked the jet from the merger and measured its viewing angle, which narrowed the result to about 70 ± 5 (Hotokezaka et al. 2019). A second problem at such small distances: the galaxy's own motion, a few hundred km/s, is a sizeable fraction of 3,000 km/s. Farther sirens avoid that.

## 3. Dark sirens, and why we need many

Most mergers, all black-hole pairs so far, give no flash. They are **dark sirens**. Their distance is still known; their redshift is not. One trick: list every galaxy in the patch of sky where the waves came from, treat each one's redshift as a possible answer, and combine many events so that the right H<sub>0</sub> stands out. Another, "spectral sirens", uses features in the population of black-hole masses. Results from the first three observing runs, combined with GW170817, came out near 68, still uncertain by roughly 10% (LVK 2023).

<figure class="fig" data-fig="standard-sirens-2"><figcaption>Simulated sirens, each uncertain by 15%. Combining them narrows the answer as 1/√N. Choose which H₀ is "true" in this toy universe, then add sirens until the combined curve can tell 67.4 from 73.</figcaption></figure>

In 2018 Chen, Fishbach and Holz estimated that about 50 neutron-star mergers with flashes would reach 2%, enough to judge the Hubble tension, and hoped for it within five years. Nature has been less generous: the fourth observing run (O4, from May 2023 into late 2025) found hundreds of candidate signals, but, as of late 2025, no second neutron-star merger with a flash. Some loud events are spectacular tests of gravity instead, such as [GW250114](/blog/discoveries/gw250114-black-hole-area-law/), which checked Hawking's black hole area law. You can play with chirps in fibub's [gravitational wave chirp tool](/science/gw-chirp/).

## 4. The next ears

- **Upgraded LIGO, Virgo and KAGRA** (the O5 run, planned for the late 2020s) will hear farther; **LIGO-India**, approved in 2023, will help locate sources on the sky ([Lesson 12.8](/learn/courses/cosmology/india-in-cosmology/)), making host galaxies easier to find.
- **Einstein Telescope** (Europe, underground, arms about 10 km) and **Cosmic Explorer** (USA, arms 20 to 40 km), planned for the late 2030s, would hear neutron-star mergers across much of the observable universe: hundreds of thousands of sirens a year.
- **LISA**, adopted by ESA in January 2024 for launch around 2035: three spacecraft 2.5 million km apart, listening at millihertz to merging giant black holes from the early universe. Sirens at redshift 1 to 10 could test whether dark energy changes.
- **Pulsar timing arrays** already hear a nanohertz background, probably from giant black hole pairs (2023; India's part in [Lesson 12.8](/learn/courses/cosmology/india-in-cosmology/)).

<div class="history">

**Sirens, from idea to first measurement.**

<ul class="timeline">
<li><b>1986</b> Schutz: gravitational waves could measure H<sub>0</sub> without a ladder.</li>
<li><b>2005</b> Holz and Hughes name them "standard sirens".</li>
<li><b>2015</b> First detection of gravitational waves (14 September).</li>
<li><b>2017</b> GW170817: the first siren, H<sub>0</sub> = 70 (+12, −8).</li>
<li><b>2019</b> The radio jet's angle tightens it to about 70 ± 5.</li>
<li><b>2023-2025</b> The O4 run: hundreds of candidates; dark-siren methods mature.</li>
<li><b>2024</b> ESA adopts LISA.</li>
</ul>

</div>

<div class="myth">

**"Gravitational waves measure the redshift as well as the distance."** They do not. Redshift stretches the whole signal in time, which looks exactly like a heavier pair. The wave only reveals the redshifted chirp mass, (1 + z)𝓜, and the distance. The redshift must come from light, a host galaxy or statistics. That is why the flash from GW170817 mattered so much.

</div>

<div class="keypoints">

- A merger's chirp gives its chirp mass; general relativity then fixes the source strength, so the measured strength gives the distance: a standard siren, no ladder needed.
- Waves weaken as 1/distance (amplitude), and the orbit's tilt is the main source of error.
- GW170817 (2017): about 44 Mpc, 3,017 km/s, H<sub>0</sub> = 70 (+12, −8); about 70 ± 5 with the jet's angle.
- Dark sirens use galaxy catalogues or mass features instead of a flash; precision grows as 1/√N, so about 50 bright sirens are needed for 2%.
- Coming: O5, LIGO-India, Einstein Telescope, Cosmic Explorer and LISA (around 2035).

</div>
