---
title: "Hunting for dark matter"
seoTitle: "How do scientists search for dark matter? LZ, XENONnT, ADMX"
summary: "Liquid xenon deep underground, gamma-ray telescopes, the LHC and tuned microwave cavities: how physicists hunt dark matter, and what they have ruled out so far."
minutes: 16
updated: 2026-11-22
quiz:
  - q: "Why are direct detection experiments built deep underground?"
    choices: ["Dark matter only exists underground","It is warmer down there","Rock blocks cosmic rays, whose particles would swamp the rare dark matter signals"]
    ans: 2
    why: "Cosmic ray particles hit the surface constantly. A kilometre or more of rock stops almost all of them, while dark matter passes straight through the rock."
  - q: "What does a direct detection experiment like LZ look for?"
    choices: ["Dark matter glowing in the dark","Gamma rays from the centre of the Galaxy","The tiny flash and electric charge from a xenon nucleus kicked by a passing dark matter particle"]
    ans: 2
    why: "A WIMP bumping a nucleus gives it a few to tens of keV. The recoiling nucleus makes a flash of light and frees some electrons, which the detector records."
  - q: "As of 2025, has any experiment confirmed a detection of dark matter particles?"
    choices: ["Yes, at the LHC in 2012","No: there are hints and claims, but no confirmed detection","Yes, by the LZ experiment"]
    ans: 1
    why: "The LHC found the Higgs boson in 2012, not dark matter. LZ, XENONnT and PandaX have set ever tighter limits. Claims such as DAMA's yearly signal and the galactic centre gamma-ray excess are not confirmed."
sources:
  - "LZ Collaboration (2024), Dark matter search results from 4.2 tonne-years of exposure of the LUX-ZEPLIN (LZ) experiment, arXiv:2410.17036 https://arxiv.org/abs/2410.17036"
  - "XENON Collaboration (2024), First indication of solar ⁸B neutrinos via coherent elastic neutrino-nucleus scattering, Physical Review Letters 133, 191002 https://doi.org/10.1103/PhysRevLett.133.191002"
  - "M. W. Goodman and E. Witten (1985), Detectability of certain dark-matter candidates, Physical Review D 31, 3059 https://doi.org/10.1103/PhysRevD.31.3059"
  - "P. Sikivie (1983), Experimental tests of the invisible axion, Physical Review Letters 51, 1415 https://doi.org/10.1103/PhysRevLett.51.1415"
  - "M. Ackermann et al. (Fermi-LAT) (2015), Searching for dark matter annihilation from Milky Way dwarf spheroidal galaxies with six years of Fermi Large Area Telescope data, Physical Review Letters 115, 231301 https://doi.org/10.1103/PhysRevLett.115.231301"
---

**Module 8 · about 16 minutes.** Read first: [8.5 What could dark matter be?](/learn/courses/cosmology/dark-matter-candidates/). If dark matter is made of particles, they are streaming through you right now. Physicists hunt them in three ways, nicknamed "shake it, break it, make it", plus special tricks for axions. By the end you will be able to explain how each kind of search works, and what "no detection yet" does and does not mean.

<div class="bigidea">We are flying through the Milky Way's dark matter halo at about 230 km/s. If its particles touch ordinary matter at all, even extremely rarely, a big enough, quiet enough detector should feel the bumps.</div>

## 1. The wind we cannot feel

The Sun carries us round the Galaxy at about 230 km/s, through a halo of dark matter that does not rotate with the disc. Near the Sun the halo holds roughly 0.3 to 0.5 GeV of mass per cubic centimetre: about one WIMP of 100 GeV in every coffee mug, or trillions of axions. Because we move through it, it is like walking through still air: we feel a steady "wind" of dark matter.

<div class="problem" data-problem="dark-matter-searches-flux"></div>

## 2. Shake it: direct detection

The idea, worked out by Mark Goodman and Edward Witten in 1985, is to wait for a dark matter particle to bump into an atomic nucleus, like a snooker ball hitting another, and catch the recoil. Today's biggest detectors are tanks of **liquid xenon**, a heavy, very pure element: **LZ** (7 tonnes, 1,480 m under South Dakota), **XENONnT** (under the Gran Sasso mountain in Italy) and **PandaX-4T** (2,400 m under a mountain in China). A recoiling nucleus makes a flash of light, then electrons freed by it drift up to a layer of gas and make a second flash. The two flashes give the position and the kind of particle that hit.

The kick is tiny. In a head-on collision, the most energy a particle of mass *m* moving at speed *v* can give a nucleus of mass *M* is

```math
E_{\max} = \frac{2\,\mu^{2} v^{2}}{M}, \qquad \mu = \frac{m\,M}{m + M}
```

<div class="meaning">

<dl>
<dt>E<sub>max</sub></dt><dd>the largest recoil energy the nucleus can get (from a head-on hit)</dd>
<dt>μ</dt><dd>the "reduced mass" of the pair: close to the lighter of the two masses</dd>
<dt>v</dt><dd>the speed of the dark matter particle relative to the detector, a few hundred km/s</dd>
<dt>Physical meaning</dt><dd>Like snooker, the transfer works best when the masses match: a WIMP of about 100 GeV kicks a xenon nucleus (122 GeV) hardest. A very light particle bounces off like a ping-pong ball off a bowling ball, giving too little energy to see.</dd>
</dl>

</div>

<div class="problem" data-problem="dark-matter-searches-recoil"></div>

Everything else that makes a flash, natural radioactivity in the rock, the steel and even the xenon itself, and cosmic rays, has to be removed or blocked. That is why the detectors sit a kilometre or more underground, surrounded by water and extra detectors that veto anything coming in from outside. Try a run yourself:

<figure class="fig" data-fig="dark-matter-searches"><figcaption>A toy xenon detector. Set a WIMP mass, how often it bumps into nuclei (its cross-section, in cm²) and how long you run, then press Run. Signal and background flashes look the same, so all you can do is count and compare with the background you expect. The sensitivity is a simplified version of LZ's 2024 result: at about 2 × 10⁻⁴⁸ cm² near 40 GeV, a WIMP would give only a few events.</figcaption></figure>

So far, no detector has seen more events than expected from background. In 2024 LZ, after 4.2 tonne-years of exposure, set the strongest limits yet for WIMPs heavier than about 9 GeV: if they bump into nuclei, it is less often than a cross-section of about 2 × 10⁻⁴⁸ cm², nearly 10²⁴ times smaller than the target a nucleus offers a passing neutron (about 10⁻²⁴ cm²). In the same year XENONnT and PandaX-4T saw the first signs of a background that will one day limit them all: **neutrinos from the Sun** bumping xenon nuclei. Physicists call this the "neutrino fog".

One experiment, DAMA/LIBRA in Italy, has reported since 1998 that its sodium iodide crystals see a yearly rise and fall in events, as the Earth's orbit adds to and subtracts from the Sun's motion through the halo. Experiments using the same crystals, COSINE-100 in South Korea and ANAIS-112 in Spain, do not see it, and the xenon experiments rule out the simplest explanations.

## 3. Break it: indirect detection

Where dark matter is dense, if two particles meet and destroy each other they would make gamma rays, neutrinos, or pairs of particles and antiparticles. NASA's **Fermi** gamma-ray telescope (launched 2008) has looked hard. From the centre of the Galaxy it sees more gamma rays than expected, the **galactic centre excess**, with roughly the shape dark matter would give; but a crowd of faint millisecond pulsars can explain it too, and the debate continues. Small dark-matter-rich satellite galaxies show no signal, which rules out the simplest WIMPs lighter than about 100 GeV that destroy each other at the "miracle" rate.

## 4. Make it: colliders

If dark matter particles can be made at the **Large Hadron Collider**, they would fly out of the detectors unseen, and show up as missing momentum: the debris of a collision would be lopsided. After more than a decade of searches, nothing of the kind has turned up, and the Higgs boson found in 2012 does not decay into invisible particles more than about a tenth of the time.

## 5. Tune it: axion haloscopes

Axions need a different trap. In a strong magnetic field an axion can turn into a microwave photon, whose frequency matches the axion's mass. Pierre Sikivie suggested in 1983 putting a tunable microwave cavity inside a big magnet and listening, like tuning an old radio, very slowly, for a faint station. **ADMX** in Seattle has reached the sensitivity needed for the most likely axion models, but only over a narrow slice of masses around a few millionths of an electronvolt. Newer experiments are trying to cover more of the range faster.

<div class="history">

<ul class="timeline">
<li><b>1983-85</b> Sikivie proposes the axion haloscope; Goodman and Witten propose direct detection of WIMPs.</li>
<li><b>1998</b> DAMA reports its yearly signal (not confirmed by others since).</li>
<li><b>2008</b> Fermi launches; the LHC switches on.</li>
<li><b>2009-11</b> Dan Hooper and Lisa Goodenough report the galactic centre gamma-ray excess.</li>
<li><b>2022-24</b> LZ, XENONnT and PandaX-4T run with multi-tonne xenon targets; LZ's 2024 results are the strongest yet.</li>
</ul>

</div>

<div class="myth">

**"Decades without a detection mean dark matter does not exist."** The searches test whether dark matter touches ordinary matter in particular ways: by bumping nuclei, turning into photons, or being made at the LHC. Dark matter might do none of these, or do them more weakly. The evidence that it exists comes from its gravity, on every scale, and that stands. What the searches have done is rule out many of the simplest ideas of what it is.

</div>

<div class="keypoints">

- Shake it: xenon detectors (LZ, XENONnT, PandaX-4T) deep underground look for nuclei kicked by dark matter. None seen yet; LZ's 2024 limits are the strongest.
- Break it: telescopes look for gamma rays and other products of dark matter destroying itself. The galactic centre excess is debated.
- Make it: the LHC looks for invisible particles; none found.
- Axion haloscopes such as ADMX tune microwave cavities in strong magnets; only narrow mass slices are covered so far.

</div>
