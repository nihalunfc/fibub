---
title: "Tiny ripples in the first light"
seoTitle: "Why does the CMB have tiny ripples? Anisotropies explained"
summary: "Take away our motion and the Milky Way, and the CMB shows ripples of about 1 part in 100,000: tens of millionths of a degree. They are the seeds of every galaxy. Where they come from, why big dense regions look cold, and how the power spectrum sorts them by size."
minutes: 16
updated: 2026-11-22
quiz:
  - q: "How big are the CMB's temperature ripples?"
    choices: ["About 1 part in 100: a few hundredths of a kelvin", "About 1 part in 100,000: tens of millionths of a kelvin", "About 1 part in a billion"]
    ans: 1
    why: "Typical ripples are tens of microkelvin on 2.7255 K, about 1 part in 100,000. COBE found them in 1992."
  - q: "On the largest scales, why does a region that was slightly denser look slightly colder?"
    choices: ["Light climbing out of its deeper gravity well loses energy (the Sachs-Wolfe effect)", "Dense regions are made of colder gas", "Dense regions block the light"]
    ans: 0
    why: "The region is a little hotter to start with, but its light loses more energy climbing out of the well. The climb wins: ΔT/T = Φ/(3c²), with Φ negative in a well."
  - q: "What does the multipole ℓ in the power spectrum stand for?"
    choices: ["The temperature of a spot", "The number of the satellite", "The size of the ripple on the sky, roughly 180° divided by ℓ"]
    ans: 2
    why: "The power spectrum sorts the ripples by size, like a graphic equaliser sorting music by pitch. ℓ = 2 is the biggest pattern; ℓ = 200 means spots about 1° across."
sources:
  - "G. F. Smoot et al. (1992), Structure in the COBE differential microwave radiometer first-year maps, ApJ 396, L1 https://doi.org/10.1086/186504"
  - "R. K. Sachs and A. M. Wolfe (1967), Perturbations of a cosmological model and angular variations of the microwave background, ApJ 147, 73 https://doi.org/10.1086/148982"
  - "W. Hu and S. Dodelson (2002), Cosmic microwave background anisotropies, Annual Review of Astronomy and Astrophysics 40, 171 https://doi.org/10.1146/annurev.astro.40.060401.093926"
  - "Planck Collaboration (2020), Planck 2018 results. I. Overview and the cosmological legacy of Planck, A&A 641, A1 https://doi.org/10.1051/0004-6361/201833880"
---

**Module 7 · about 16 minutes.** Read first: [7.3 The CMB dipole](/learn/courses/cosmology/cmb-dipole/). Take away our motion, and the CMB is the same in every direction to 1 part in 100,000. That last little bit is the most valuable signal in cosmology. By the end you will be able to say how big the ripples are, where they come from, and how cosmologists sort them by size.

<div class="bigidea">The CMB is not perfectly smooth. Ripples of 1 part in 100,000, frozen at 380,000 years, are the seeds that gravity later grew into galaxies, and their pattern of sizes holds a recipe for the universe.</div>

## 1. Cleaning the sky

A raw microwave map of the sky shows three things on top of each other: the dipole from our motion (Lesson 7.3), a bright band along the Milky Way, and the faint ripples we want. The dipole is easy to subtract. The Milky Way is harder: electrons spiralling in its magnetic field glow brightest at low frequencies, and warm dust brightest at high frequencies. The CMB alone has the same blackbody temperature at every frequency. Measure the sky at several frequencies and you can separate them, like picking out one voice from a choir by its pitch. That is why every CMB satellite carries several bands.

## 2. Ripples of one part in 100,000

What is left is a pattern of slightly warmer and slightly cooler patches, all over the sky, typically **tens of microkelvin** (millionths of a kelvin) from the average, with the strongest only a few hundred.

<figure class="fig" data-fig="cmb-anisotropies"><figcaption>A patch of CMB-like sky, made from the measured mix of ripple sizes (a simplified model). Zoom from 40° to 2° across: the commonest spots are about 1°, twice the full Moon. Switch to "True" contrast to see the sky as it really is: ripples this small are invisible on 2.7 K.</figcaption></figure>

To feel how small they are: if the CMB were an ocean 100 metres deep, its biggest waves would be about a millimetre high. Yet that is plenty. Regions just 1 part in 100,000 denser than average pulled in more and more matter for 13.8 billion years, helped by dark matter, and became the galaxies, clusters and filaments of the cosmic web (Module 10).

<div class="problem" data-problem="cmb-anisotropies-ripple"></div>

## 3. Where the ripples come from

The early universe already had tiny differences in density from place to place (where those came from is the story of inflation, [Lesson 11.3](/learn/courses/cosmology/quantum-seeds/)). They show up in the CMB in a few ways.

**On big scales, more than about 2°: climbing out of wells.** A region with a little extra matter is a dip in gravity, a gravity well. Its light starts out slightly hotter, but must then climb out of the well, losing energy, which makes it look cooler. The climb wins. In 1967 Rainer Sachs and Arthur Wolfe worked out the result:

```math
\frac{\Delta T}{T} = \frac{\Phi}{3c^2}
```

<div class="meaning">

<dl>
<dt>ΔT/T</dt><dd>how much warmer (positive) or cooler (negative) a patch looks, as a fraction of 2.7255 K</dd>
<dt>Φ</dt><dd>the gravitational potential at last scattering in that place: negative in a well (a dense region), positive on a hill (an emptier region)</dd>
<dt>c<sup>2</sup></dt><dd>the speed of light squared, turning the potential into a pure number</dd>
<dt>Physical meaning</dt><dd>On the largest scales, cold spots mark the denser regions, where galaxy clusters later grew, and hot spots the emptier ones. A ΔT/T of 10<sup>−5</sup> means wells only about 3 × 10<sup>−5</sup> c² deep.</dd>
</dl>

</div>

**On scales of about 1° and smaller: sound waves.** Inside each well, the hot gas and light were sloshing in and out, squeezed and released: sound waves. This makes the ripples about 1° across the strongest of all. It is the subject of the [next lesson](/learn/courses/cosmology/acoustic-peaks/).

**Along the way.** On their 13.8-billion-year trip, a few photons scattered again off electrons freed by the first stars ([Lesson 7.7](/learn/courses/cosmology/cmb-polarisation/)), some bounced off the hot gas in galaxy clusters, and all were gently bent by the gravity of everything they passed ([Lesson 3.8](/learn/courses/cosmology/gravitational-lensing/)). These leave smaller fingerprints that cosmologists also read.

## 4. Sorting the ripples by size

A map of millions of spots is hard to compare with theory spot by spot, because theory does not predict where each spot is, only how strong the ripples are on each size. So cosmologists break the map into patterns of different sizes, the way a graphic equaliser breaks music into bass, middle and treble. Each size is labelled by a whole number, the **multipole ℓ**:

- ℓ = 1 is the dipole (one hot half, one cold half);
- ℓ = 2, the quadrupole, has two hot and two cold patches;
- a pattern with multipole ℓ has spots about **180° ÷ ℓ** across, so ℓ = 200 means spots about 1° across.

Plot the strength of the ripples against ℓ and you get the **power spectrum**, the most important graph in cosmology. Its big peak near ℓ ≈ 220 is the 1° spots you saw in the figure. The next two lessons explain it.

There is a limit no telescope can beat. On the largest scales there are only a few patterns on the whole sky (only 5 at ℓ = 2), so we have only a few samples of a random process, like guessing whether a die is fair from five throws. This is called **cosmic variance**, and it makes the biggest scales uncertain however good the telescope.

<div class="problem" data-problem="cmb-anisotropies-angle"></div>

<div class="history">

**A long search.** Cosmologists expected ripples from the 1960s on and searched for 25 years without finding them. Each failure lowered the limit, and by the 1980s it was clear that ripples big enough to grow galaxies from ordinary matter alone should already have been seen. Dark matter, which can start clumping before recombination, solved the problem (Lesson 8.4). On 23 April 1992 the COBE DMR team, led by George Smoot, announced the ripples: about 30 µK on 10° scales. Stephen Hawking called it "the discovery of the century, if not of all time".

<ul class="timeline">
<li><b>1967</b> Sachs and Wolfe predict the large-scale ripples</li>
<li><b>1970s–80s</b> Searches set ever tighter limits</li>
<li><b>1992</b> COBE DMR finds the ripples, with a 7° beam</li>
<li><b>2003, 2013</b> WMAP and Planck map them in detail (Lesson 7.6)</li>
</ul>

</div>

<div class="myth">

**"Hot spots in the CMB are where the matter was."** On the largest scales it is the other way round: denser regions look colder, because their light had to climb out of deeper gravity wells. On smaller scales, the sound waves mix hot and cold in more complicated ways. A CMB map is a map of light, not directly of matter.

</div>

<div class="keypoints">

- After removing the dipole and the Milky Way (using several frequencies), the CMB shows ripples of about 1 part in 100,000: tens of microkelvin.
- On large scales, denser regions look colder (Sachs-Wolfe effect, ΔT/T = Φ/3c²); on about 1° and smaller, sound waves dominate.
- The ripples are the seeds of all later structure; their small size needs dark matter to grow galaxies in time.
- The power spectrum sorts ripples by size: multipole ℓ ≈ 180° ÷ spot size. Cosmic variance limits the largest scales.

</div>
