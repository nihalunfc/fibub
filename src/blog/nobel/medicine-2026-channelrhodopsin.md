---
title: "Channelrhodopsin: the protein that is both a light sensor and a gate"
seoTitle: "Channelrhodopsin explained: Medicine Nobel 2026, part 2"
summary: "How Georg Nagel, Peter Hegemann and Ernst Bamberg put two algal genes into frog eggs and human kidney cells and found a channel opened by light: channelrhodopsin-1 in 2002 and channelrhodopsin-2 in 2003. The evidence, the physics of the photon and the pore, rebuilt with fibub tools."
tools: [membrane-potential, em-spectrum, curve-fitter]
updated: 2026-11-19
sources:
  - "Nobel Prize in Physiology or Medicine 2026: Karl Deisseroth, Peter Hegemann and Georg Nagel, 'for their discoveries concerning light-gated ion channels and optogenetics'. NobelPrize.org; ASBMB Today (2026); Al Jazeera (5 October 2026)."
  - "Nagel G, Möckel B, Büldt G, Bamberg E (1995), 'Functional expression of bacteriorhodopsin in oocytes allows direct measurement of voltage dependence of light induced H+ pumping', FEBS Letters 377: 263-266."
  - "Harz H, Hegemann P (1991), 'Rhodopsin-regulated calcium currents in Chlamydomonas', Nature 351: 489-491."
  - "Nagel G, Ollig D, Fuhrmann M, Kateriya S, Musti AM, Bamberg E, Hegemann P (2002), 'Channelrhodopsin-1: a light-gated proton channel in green algae', Science 296: 2395-2398."
  - "Sineshchekov OA, Jung K-H, Spudich JL (2002), 'Two rhodopsins mediate phototaxis to low- and high-intensity light in Chlamydomonas reinhardtii', PNAS 99: 8689-8694."
  - "Nagel G, Szellas T, Huhn W, Kateriya S, Adeishvili N, Berthold P, Ollig D, Hegemann P, Bamberg E (2003), 'Channelrhodopsin-2, a directly light-gated cation-selective membrane channel', PNAS 100: 13940-13945."
  - "Kato HE, Zhang F, Yizhar O, Ramakrishnan C, Nishizawa T, Hirata K, Ito J, Aita Y, Tsukazaki T, Hayashi S, Hegemann P, Maturana AD, Ishitani R, Deisseroth K, Nureki O (2012), 'Crystal structure of the channelrhodopsin light-gated cation channel', Nature 482: 369-374."
  - "Peak wavelengths of the proteins (ChR2 about 470 nm, rod rhodopsin about 498 nm, bacteriorhodopsin about 568 nm, Chrimson about 590 nm) are rounded values from the literature. The proton-to-sodium permeability ratio of about a million is the order of magnitude reported for ChR2; we use a round number."
---

This is the heart of the 2026 Nobel Prize in Physiology or Medicine. In 2002 and 2003 **Georg Nagel**, **Peter Hegemann** and their colleague **Ernst Bamberg** showed that two genes from the green alga *Chlamydomonas* make proteins that are a **light sensor and an ion channel in one molecule**. They named them **channelrhodopsin-1** and **channelrhodopsin-2**. Light opens the pore; ions flow; the cell's voltage changes, all within a millisecond and with nothing else needed except a little vitamin A. This part tells how they proved it, and rebuilds three pieces of the evidence with fibub tools: the energy of the photon with the [[em-spectrum|EM spectrum explorer]], the pH test with the [[membrane-potential|Membrane potential calculator]], and the closing time with the [[curve-fitter|Curve fitter]].

<div class="nb-short">

**In short**
- The alga's eyespot reacts to light in **microseconds** (part 1), so its light sensor had to open a channel directly.
- Nagel, an expert in recording currents from **frog eggs** (oocytes) loaded with foreign proteins, put the alga's genes into them. In the dark: nothing. With light: a current. **ChR1** (2002) passed mostly **protons**; **ChR2** (2003) passed **sodium, potassium and calcium** too, and worked in **human cells**.
- Proof that the protein *is* the channel: the current reverses at the voltage the ions predict and **shifts when you change the pH or the salts** outside, exactly as a pore would, not as a pump would.
- ChR2 opens in about **a millisecond**, closes about **10 ms** after the light goes off, and responds best to **blue light near 470 nm**. That speed is what made optogenetics (part 3) possible.

</div>

## Pumps and channels: why the difference matters

There are two ways to move ions across a membrane. A **pump** uses energy to push ions one at a time, even uphill against their concentration. Bacteriorhodopsin and halorhodopsin (part 1) are pumps: one photon, one ion. A **channel** is a gated hole: when open, ions run downhill on their own, millions per second, until the voltage balances their concentration difference.

For a neuron, the difference is huge. A pump driven by light moves at most one ion per absorbed photon, so you need intense light to move enough charge. A channel lets through many ions per opening, so a modest light can make a current big enough to fire a nerve cell. Hegemann's 1991 measurement, a current that started within microseconds of a flash, argued for a channel. But a guess is not a proof. You need the protein alone, in a cell that has no other light machinery, and you need to measure the ions it passes.

## The frog egg trick

Georg Nagel trained as a biophysicist and spent years at the Max Planck Institute of Biophysics in Frankfurt, in Ernst Bamberg's department, measuring currents through membrane proteins. A favourite tool was the **egg cell of the African clawed frog**, *Xenopus laevis*. The egg is about a millimetre across, big enough to stick two electrodes in and hold its voltage while measuring the current (a **two-electrode voltage clamp**). Inject the messenger RNA for any membrane protein, wait a couple of days, and the egg makes that protein and puts it in its membrane. Frog eggs have no light sensors of their own, so any light-driven current must come from the new protein.

In 1995 Nagel, Bamberg and colleagues used exactly this to measure bacteriorhodopsin pumping protons in frog eggs, and to show how the pump slows down as the voltage opposes it. So when Hegemann, who had been chasing the alga's sensor since the 1980s, had candidate genes, Nagel had the ideal test bench.

The candidates came from a large Japanese effort sequencing *Chlamydomonas* genes. Two of them, later called *chop1* and *chop2*, coded for proteins whose first part looked like a microbial rhodopsin, seven helices crossing the membrane and a lysine that binds retinal, followed by a long tail of unknown purpose. Three groups noticed them around the same time. John Spudich's group in Houston showed in 2002, by switching the genes down in the alga with a gene-silencing method, that the two proteins control the alga's photocurrents and its steering at low and high light. That pointed the same way, but did not show what each protein does on its own. Nagel and Hegemann's recordings did.

## 2002: channelrhodopsin-1, a light-gated proton channel

Nagel put the first gene into frog eggs, added all-trans retinal, held the egg at a set voltage and shone light. A current flowed, inward at negative voltages and outward at positive ones, and stopped when the light went off. A pump would push ions one way whatever the voltage; this current **reversed**, which is the signature of a channel letting ions run downhill.

Which ions? The team changed the outside solution. Changing sodium or potassium hardly mattered, but making the outside more acidic (more protons) shifted the reversal voltage strongly positive, and making it alkaline shifted it negative. The current was carried mainly by **protons**. The paper, in *Science* in June 2002, was titled plainly: "Channelrhodopsin-1: a light-gated proton channel in green algae". It was the first ion channel ever found that is opened directly by light.

<div data-nx="channel-light"><p class="nx-noscript">Interactive simulation: shine light on channelrhodopsin and record the current (needs JavaScript).</p></div>

## 2003: channelrhodopsin-2 lets sodium in

The second gene did something more useful. In frog eggs, and also in **human embryonic kidney (HEK293) cells**, channelrhodopsin-2 made large currents carried not only by protons but also by **sodium, potassium and calcium**, the ions that matter for nerve cells. The paper in *PNAS* in November 2003 called it "a directly light-gated cation-selective membrane channel". It reported several features that would matter later:

- **A short version is enough.** Only the first 315 or so amino acids, the rhodopsin part, were needed. The long tail could be cut off, which made the gene small enough to fit into the viruses later used to deliver it to neurons.
- **It works in mammalian cells.** HEK cells are human; a light-sensitive current there meant that ChR2 folds, picks up retinal and works in cells like ours.
- **It depolarises.** Opening ChR2 in a cell at rest lets positive ions in and pushes the voltage up, towards firing. The authors wrote that ChR2 could be used to depolarise animal cells simply by illumination.
- **It is fast, and it adapts.** Under steady light the current jumps to a peak and then settles to a lower plateau as some channels enter a "desensitised" state; after the light, channels close within tens of milliseconds.

You can see all four behaviours in the simulation above: switch the light on, watch the peak and the plateau, switch it off and watch the current close.

<details class="deeper"><summary>Proton channel or cation channel? Both, and why the pH test works</summary>

Channelrhodopsin-2 is far more permeable to protons than to sodium: estimates put the ratio around a million to one. But there are about a million times more sodium ions than protons in body fluids (145 mM sodium against about 0.00004 mM protons at pH 7.4), so at normal pH the two carry comparable currents, and sodium carries much of the charge. In an acid bath the proton concentration rises tenfold per pH unit and the protons take over. That is why the pH of the outside solution moves the reversal voltage: the Goldman–Hodgkin–Katz equation weights each ion's concentration by its permeability, and a million-fold permeability makes even tiny proton concentrations count. Our second graph below shows this calculation.
</details>

## Inside the channel: retinal flips, the pore opens

How can a rhodopsin also be a pore? In all microbial rhodopsins, retinal is bound to a lysine on the seventh helix through a link called a protonated Schiff base. A photon flips the retinal from the all-trans to the **13-cis** shape in less than a picosecond. The protein then runs through a cycle of intermediate states (the **photocycle**) over milliseconds, and in channelrhodopsin one of those states has a water-filled path through the protein. When the cycle returns to the start, the path closes.

In 2012 a team led by Osamu Nureki in Tokyo, with Hegemann and Deisseroth, solved the **crystal structure** of a channelrhodopsin (a chimera of ChR1 and ChR2) at 2.3 Å. It showed the channel is a **dimer**, two proteins side by side, and that each has its own pore lined by helices 1, 2, 3 and 7, with negatively charged amino acids that attract cations. Later structures caught the protein in its dark and light states. The structures let engineers change single amino acids to make channels that are faster, slower, more sensitive, red-shifted or even chloride-passing (part 3).

Each channel lets through only a small current (a single ChR2 channel is estimated in the tens of femtosiemens, much smaller than most nerve channels), so a cell needs many thousands of copies. That turned out not to be a problem: neurons make plenty when given a strong promoter.

## Why blue light?

Retinal on its own absorbs ultraviolet light. Bound in a protein, the charges around it shift the absorption to longer wavelengths, by a different amount in each protein. In ChR2 the peak is near **470 nm**, blue. In our rod cells it is about 498 nm, in bacteriorhodopsin about 568 nm (purple membrane looks purple because it absorbs green-yellow), and in the engineered red-shifted channel Chrimson about 590 nm. A photon's energy is E = hc/λ: shorter wavelengths, more energy per photon. Our first graph shows it.

## Checked with the tools

**1. Energy per photon.** With the [[em-spectrum|EM spectrum explorer]]'s maths, a 470 nm photon carries **2.64 eV** and a 590 nm photon **2.10 eV**. Both are far more than the thermal energy at body temperature (about 0.027 eV), which is why the retinal flip happens only when light arrives, not by chance.

<!-- fig:photon-energy -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 300" role="img" aria-label="placeholder" xmlns="http://www.w3.org/2000/svg"><text class="fibub-mark" x="550" y="292">fibub.com</text></svg><figcaption>Placeholder.</figcaption></figure>
<!-- /fig:photon-energy -->

**2. The pH test.** We redid the logic of the 2002 and 2003 ion-replacement experiments with the [[membrane-potential|Membrane potential calculator]]'s Goldman–Hodgkin–Katz equation: sodium 145 mM out and 12 mM in, potassium 4 out and 140 in, protons from the pH, inside pH 7.2, at 22 °C (room temperature, as in the recordings), and proton permeability a million times that of sodium. The reversal potential comes out at **+6 mV at pH 7.4**, climbs to **+53 mV at pH 6.0** and drops to about **0 mV at pH 9**. If the channel passed only sodium and potassium, the line would be flat, at about +15 mV. A strong shift with pH is the fingerprint of a proton-conducting pore, and it is what the papers saw.

<!-- fig:reversal-ph -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 300" role="img" aria-label="placeholder" xmlns="http://www.w3.org/2000/svg"><text class="fibub-mark" x="550" y="292">fibub.com</text></svg><figcaption>Placeholder.</figcaption></figure>
<!-- /fig:reversal-ph -->

**3. Reading the closing time.** How fast a channel closes after the light goes off sets how fast you can flash it. Experimenters fit an exponential to the "off" current. We made a noisy recording with a true closing time of 10 ms and fitted it with the same Levenberg–Marquardt method the [[curve-fitter|Curve fitter]] uses: **τ = 10.4 ± 0.3 ms**, recovering the true value within its error.

<!-- fig:tau-off -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 300" role="img" aria-label="placeholder" xmlns="http://www.w3.org/2000/svg"><text class="fibub-mark" x="550" y="292">fibub.com</text></svg><figcaption>Placeholder.</figcaption></figure>
<!-- /fig:tau-off -->

| | Published | Our check |
|---|---|---|
| ChR2 peak sensitivity | about 470 nm (blue) | 2.64 eV per photon at 470 nm |
| Effect of acid outside | reversal voltage shifts positive | +6 mV at pH 7.4 → +53 mV at pH 6.0 |
| ChR2 closing time | about 10 to 20 ms | fit recovers 10 ms as 10.4 ± 0.3 ms |

Our pH curve is a calculation from round numbers, not the papers' data: we did not copy any measured values. It shows that the published behaviour follows from the textbook equation plus one assumption, a very high proton permeability.

## How we made the graphs

`scripts/blog-figures/nobel-medicine-2026.mjs` uses `photon()` from `src/lib/sci/em-spectrum.ts` (the EM spectrum explorer), `ghkVoltage()` from `src/lib/sci/ghk.ts` (the Membrane potential calculator) with a third ion, H⁺, added to sodium and potassium, and `levenbergMarquardt()` from `src/lib/sci/fit.ts`, the fitting engine behind the Curve fitter. The noisy recording uses a seeded random number generator, so the figure is the same every time. The simulation in the article is our own three-state model (closed, open, desensitised) with rounded rates.

## How we test the maths

`tests/sci-tools/em-spectrum.mjs` checks photon energies against hand calculations (green light at 2.36 eV, a 254 nm UV lamp at 4.88 eV), that every example sits in the right band and that the visible colours come out right. `tests/sci-tools/membrane-potential.mjs` checks the Nernst and GHK voltages and currents at 37 °C and 25 °C. `tests/sci-tools/curve-fitter.mjs` checks fits of an exponential decay with offset, weighted and unweighted, against SciPy's `curve_fit` to six significant figures, plus the chi-square and p-value. All run on every change to the site.

## Check it yourself

1. Open the [[em-spectrum|EM spectrum explorer]], type **470 nm** in **Wavelength** and read the photon energy: about **2.64 eV**. Try 590 nm: about 2.10 eV. Try 254 nm (a germicidal lamp): 4.88 eV, enough to break chemical bonds in DNA.
2. Open the [[membrane-potential|Membrane potential calculator]] and choose **Permeabilities: As typed**. Type K⁺ 4 outside and 140 inside with permeability 1, Na⁺ 145 outside and 12 inside with permeability 2 (sodium passes twice as well as potassium, our round guess for the cation part of ChR2), Cl⁻ and Ca²⁺ permeability 0, and **Temperature (°C)** 22. The membrane potential, which here is the voltage where the light current reverses, comes out at about **+15 mV**: that is our "no protons" line. Now halve the outside sodium to 72 mM: it drops to about −3 mV. That is the ion-replacement test the papers used, done in a second. (The calculator has no proton row, so the pH part of the graph needs our script.)
3. Open the [[curve-fitter|Curve fitter]], paste a column of times and a column of currents (from your own lab, or from the CSV under our graph), choose **Exponential decay with offset** and press **Fit**. The parameter **t** is the closing time with its standard error.
4. Try the simulation above at 600 nm and full brightness: the current almost vanishes. Then go back to 470 nm at 20 %: dim blue light beats bright yellow.

## What you can use it for

- **Biophysics classes:** pump against channel, reversal potentials and ion selectivity, with the [[membrane-potential|Membrane potential calculator]].
- **Lab work:** fit on- and off-kinetics of any channel or sensor with the [[curve-fitter|Curve fitter]]; for fluorescent indicators of voltage or calcium, the [[fluorescence-image-analyser|Fluorescence image analyser]] handles the images.
- **Choosing a light source:** compare photon energies and colours of LEDs and lasers with the [[em-spectrum|EM spectrum explorer]].
- **Next:** how Karl Deisseroth's lab put ChR2 into neurons in 2005 and turned it into a tool used in thousands of labs, in [[blog:nobel/medicine-2026-optogenetics|part 3]].
