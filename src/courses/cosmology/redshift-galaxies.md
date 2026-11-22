---
title: "Slipher's discovery: galaxies are rushing away"
seoTitle: "Galaxy redshift: how Slipher found galaxies rushing away"
summary: "How Vesto Slipher measured the speeds of spiral nebulae from 1912 by the shift of their spectral lines, why Andromeda is coming towards us while almost every other galaxy is moving away, and what redshift means."
minutes: 13
updated: 2026-11-22
quiz:
  - q: "What did Slipher measure to find a galaxy's speed?"
    choices: ["How quickly it grew brighter","How far its spectral lines had shifted along the spectrum","How fast it moved across the sky"]
    ans: 1
    why: "Lines shifted towards red mean moving away; towards blue mean coming closer. The size of the shift gives the speed."
  - q: "Andromeda's lines are shifted towards blue. What does that tell us?"
    choices: ["Andromeda is moving away from us","Andromeda is moving towards us","Andromeda is very hot"]
    ans: 1
    why: "A blueshift means approach. Andromeda and the Milky Way are falling towards each other at about 300 km/s, held by their mutual gravity."
  - q: "By 1917, what pattern had Slipher found among the spirals he measured?"
    choices: ["They were all at rest","Most were moving away, many at hundreds of km/s or more","Half were coming, half going, evenly"]
    ans: 1
    why: "Of 25 spirals, 21 were moving away, some faster than 1,000 km/s, far faster than any star in our galaxy. Nobody yet knew why."
sources:
  - "V. M. Slipher (1913), The radial velocity of the Andromeda Nebula, Lowell Observatory Bulletin 2, 56 https://ui.adsabs.harvard.edu/abs/1913LowOB...2...56S"
  - "V. M. Slipher (1917), Nebulae, Proceedings of the American Philosophical Society 56, 403 https://www.jstor.org/stable/983748"
  - "C. O'Raifeartaigh (2013), The contribution of V. M. Slipher to the discovery of the expanding universe, in Origins of the Expanding Universe, ASP Conference Series 471 https://arxiv.org/abs/1212.5499"
---

**Module 4 · about 13 minutes.** Read first: [Spectral lines](/learn/courses/astronomy/spectral-lines/) and [The Doppler shift](/learn/courses/astronomy/doppler-shift/) in the Astronomy course, which explain how atoms leave dark lines in starlight and why motion shifts them. Here we use that tool on galaxies. By the end you will be able to turn a measured line shift into a galaxy's speed.

<div class="bigidea">The spectra of galaxies told us they are moving, and almost all of them are moving away from us. It was the first clue that the universe is expanding.</div>

## 1. A patient man with a slow camera

In 1912 Vesto Slipher, at the Lowell Observatory in Flagstaff, Arizona, set out to photograph the spectra of the "spiral nebulae". Nobody yet knew they were galaxies: the [Great Debate](/learn/courses/cosmology/great-debate/) was still eight years away. The spirals were faint, so a single spectrum needed exposures spread over several nights, sometimes tens of hours of light gathered onto one small glass plate.

His first target was Andromeda. Its dark lines were in the right pattern, but every one sat a little towards the blue end. Andromeda was **coming towards us at about 300 km/s**, faster than any star then measured.

## 2. Reading a speed from a spectrum

Each element absorbs light at its own exact wavelengths. Calcium, hydrogen, magnesium and sodium make a pattern of lines as recognisable as a barcode. When a source moves away, every wavelength is stretched by the same factor, so the whole barcode slides towards red. When it approaches, the barcode slides towards blue.

```math
z = \frac{\lambda_{\text{seen}} - \lambda_{\text{lab}}}{\lambda_{\text{lab}}}, \qquad v \approx c\,z \quad (\text{for } v \ll c)
```

<div class="meaning">

<dl>
<dt>z</dt><dd>the redshift: the fraction by which every wavelength has grown (negative for a blueshift)</dd>
<dt>λ<sub>seen</sub>, λ<sub>lab</sub></dt><dd>where a line appears in the galaxy, and where it sits in a lab on Earth</dd>
<dt>c</dt><dd>the speed of light, 299,792 km/s</dd>
<dt>Physical meaning</dt><dd>The same fractional shift for every line is the signature of motion. A shift of 0.1% means about 300 km/s.</dd>
</dl>

</div>

<figure class="fig" data-fig="spectrum-shift"><figcaption>A lab spectrum above a galaxy spectrum. Slide the speed or pick a galaxy: every line moves by the same factor. The zoom box shows how small the shift is for nearby galaxies.</figcaption></figure>

**Worked example.** In a galaxy, the hydrogen line that sits at 656.3 nm in the lab is seen at 658.5 nm. Then z = (658.5 − 656.3) ÷ 656.3 = 0.00335, and the speed is 0.00335 × 299,792 ≈ **1,000 km/s, moving away**. That is roughly what Slipher found for the Sombrero galaxy in 1913.

<div class="problem" data-problem="slipher-speed"></div>

## 3. The surprise: nearly all of them are leaving

Slipher kept going. By 1917 he had speeds for 25 spirals. **21 were moving away**, some at over 1,000 km/s, and his fastest later reached about 1,800 km/s. Stars in our galaxy move at tens of km/s. Whatever the spirals were, they were moving far faster than anything known, and mostly away from us.

<div class="history">

**A discovery without an explanation.** Slipher presented his results at the American Astronomical Society in 1914 and received a standing ovation, which was rare. But he could not say why the spirals were fleeing. Some suggested the Sun was moving through space and the spirals only looked like they were leaving. The real reason needed two more things: distances to the spirals ([Lesson 2.3](/learn/courses/cosmology/hubble-andromeda/)) and Einstein's new theory of gravity ([Module 3](/learn/courses/cosmology/curved-spacetime/)).

</div>

## 4. Why Andromeda is the odd one out

Andromeda is only 2.5 million light-years away, and the Milky Way and Andromeda are the two big members of a small family of galaxies, the **Local Group**. Their gravity holds them together against the general expansion, so they fall towards each other. In about 4 to 5 billion years they will merge. Beyond the Local Group, almost every galaxy shows a redshift, and the next lesson shows the pattern behind it.

<div class="myth">

**"Redshift means the galaxy looks red."** No. The whole spectrum slides, so the galaxy's colour barely changes for small shifts: light that was blue becomes slightly less blue, and ultraviolet slides into view to replace it. Astronomers measure the lines, not the colour.

</div>

<div class="keypoints">

- Spectral lines are a barcode; motion slides the whole barcode by one factor, 1 + z.
- Redshift (towards red) means moving away; blueshift means coming closer; for small speeds v ≈ cz.
- From 1912 Vesto Slipher measured spiral nebulae: Andromeda approaches at about 300 km/s, but 21 of the 25 spirals he had by 1917 were moving away, some faster than 1,000 km/s.
- Andromeda approaches because it is bound to the Milky Way by gravity in the Local Group.

</div>
