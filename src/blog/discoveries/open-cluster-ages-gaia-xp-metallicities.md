---
title: "Open cluster ages from Gaia DR3 isochrone fits with XP spectra metallicities"
summary: "A 2025 A&A study shows that metallicities from Gaia's low-resolution XP spectra pin down open cluster ages almost as well as high-resolution spectroscopy. Try the colour-magnitude step with fibub."
tools: [hr-diagram, blackbody-calculator, magnitude-flux-converter]
updated: 2026-11-10
sources:
  - "Nizovkina M, Larsen SS, Brown AGA, Helmi A (2025), Refining open cluster parameters with Gaia XP metallicities, Astronomy & Astrophysics 703, A100. Open access under CC BY 4.0, as shown on the publisher's page, checked 2026-11-10."
  - "Distance modulus and extinction: m − M = 5 log10(d / 10 pc) + A, the standard relation."
paper:
  title: "Refining open cluster parameters with Gaia XP metallicities"
  authors: "Nizovkina M, Larsen SS, Brown AGA, Helmi A"
  journal: "Astronomy & Astrophysics"
  year: 2025
  doi: "10.1051/0004-6361/202555437"
  url: "https://www.aanda.org/articles/aa/abs/2025/11/aa55437-25/aa55437-25.html"
  licence: "CC BY 4.0"
  reviewed: true
---

An open cluster is a family of stars born together, so they share one age, one distance and one chemical make-up. That makes clusters the standard clocks of the Milky Way. Reading the clock means fitting model tracks, called isochrones, to the cluster's colour-magnitude diagram, and the fit goes wrong if you guess the metal content badly. A November 2025 paper in *Astronomy & Astrophysics* tests a cheap fix: take the metallicity from the low-resolution spectra that Gaia recorded for millions of stars, and use it to steady the fit. The first step, turning a star list into a clean colour-magnitude diagram, is something you can do with the [[hr-diagram]] tool; the [[blackbody-calculator]] and [[magnitude-flux-converter]] help you sanity-check single stars.

## What they found

For 20 open clusters, the authors compared ages from fits that used Gaia XP metallicities with ages from fits that used metallicities from high-resolution spectra. The XP metallicities themselves were off by a steady 0.1 to 0.15 dex, a known offset that can be corrected. The ages, though, came out close: the average difference was below 0.03 dex in log age, with a spread of about 0.13 dex. The typical age error for a single cluster was about 0.065 dex, or roughly 16 %.

Compared with ages from neural network methods that ignore metallicity, the differences were larger (below 0.08 dex on average, spread about 0.21 dex), and the XP-based fits gave smaller error bars. The method helps most for clusters without many red giants, where the diagram alone says little about the metal content.

## Why it matters

Age and metallicity trade off. A slightly more metal-rich star looks redder and fainter, much like a slightly older one, so the same diagram can fit two quite different ages. High-resolution spectra break this tie, but only a minority of clusters have them. Gaia's XP spectra exist for almost every cluster star brighter than about 17.5 magnitudes, so if they are good enough, every cluster in the Gaia catalogue could get a better age. Better ages feed into how the Galactic disc formed and how stars evolve.

## How they did it

The team used the synthetic cluster method in ASteCA, a public code that builds fake clusters from isochrones and compares them with the observed diagram. Instead of a classic best fit, it uses approximate Bayesian computation: it keeps the parameter sets whose fake clusters look most like the real one, which yields age, distance modulus and extinction with uncertainties. The XP metallicities, taken from several published catalogues, entered as priors, a starting belief that the fit can move away from if the data insist. Strict quality cuts removed stars whose XP values were unreliable.

## Check it yourself with fibub

Here is a tiny invented star list, made up for practice and not taken from the paper or any real cluster. It has two stars near the turn-off (where stars leave the main sequence), two on the main sequence and two in the red clump (helium-burning giants):

```
name,bp_rp,G,parallax,parallax_error
TO-1,0.78,13.20,1.250,0.020
TO-2,0.80,13.35,1.262,0.022
MS-1,1.05,14.60,1.240,0.030
MS-2,1.40,16.10,1.255,0.045
RC-1,1.42,10.45,1.248,0.018
RC-2,1.44,10.40,1.258,0.017
```

1. Paste it into the [[hr-diagram]] tool. The header names tell it which column is the colour, the magnitude and the parallax.
2. Under **Photometric system**, pick **Gaia BP − RP with G**. The extinction factor R fills in as 2.0.
3. Under **Distance and extinction**, keep **Each star's parallax**, and type a reddening E of **0.20**. The tool then subtracts A = 2.0 × 0.20 = 0.40 magnitudes from every star and makes the colours 0.20 bluer.
4. Read the summary: 6 stars placed, median distance **800 pc**, distance modulus **9.52**.
5. Look at the stars. TO-1 lands at a dereddened colour of 0.58 and an absolute magnitude M_G of **3.28**. MS-1 sits at 0.85 and **4.67**, which is the Sun's own place in this system. The red clump stars sit near M_G = **0.5**, as red clump stars should.
6. Switch the plot to **HR diagram**. TO-1 comes out near 6,500 K, MS-1 near 5,700 K and the clump stars near 4,850 K, with the clump about 50 times as luminous as the Sun (log L about 1.7).

Now set the reddening back to 0 and watch every star move 0.4 magnitudes fainter and 0.2 redder. That shift is the size of mistake a wrong extinction makes, and it is why the paper fits extinction along with age. Tick **Error bars from parallax errors**: at 800 pc, a 0.02 mas parallax error is worth only about 0.035 magnitudes, so for nearby clusters the distance is rarely the weak link. To check one star by hand, type its temperature into the [[blackbody-calculator]] with a radius and distance, or convert between magnitude and flux with the [[magnitude-flux-converter]].

Our tool does not fit isochrones, so it will not give you an age. What it gives you is the clean, dereddened diagram that any isochrone fit starts from, so you can see the turn-off, the clump and the gap between them before you hand the list to a fitting code.

## The fine print

- **Twenty clusters.** The test sample is small, and the clusters were chosen because they have high-resolution metallicities to compare against.
- **An offset to correct.** XP metallicities differ systematically from high-resolution ones, so the priors need that correction.
- **Model dependence.** Every age depends on the isochrone set used; another set could shift them all.
- **Quality cuts matter.** The good agreement holds after strict cuts; loose cuts would let poor XP values in.
- **Not a free lunch for clusters with giants.** Where a cluster has a well-populated red giant branch, the diagram already constrains metallicity, so the gain is smaller.
- Our six stars are invented. For the measured cluster parameters, read the paper.
