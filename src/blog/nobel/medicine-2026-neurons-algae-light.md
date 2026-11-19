---
title: "How nerve cells signal, and the green alga that taught them to see light"
seoTitle: "Nerve signals and algae that see: Medicine Nobel 2026, part 1"
summary: "The electric language of nerve cells, why scientists wanted a way to switch single kinds of brain cell on and off, and the decades-long hunt for the light sensor of a tiny green alga. The roots of the 2026 Nobel Prize in Physiology or Medicine."
tools: [hodgkin-huxley-simulator, membrane-potential, action-potential]
updated: 2026-11-19
sources:
  - "Nobel Prize in Physiology or Medicine 2026, announced 5 October 2026: Karl Deisseroth (Stanford University), Peter Hegemann (Humboldt University of Berlin) and Georg Nagel (University of Würzburg), 'for their discoveries concerning light-gated ion channels and optogenetics'. NobelPrize.org; ASBMB Today (2026); Al Jazeera (5 October 2026)."
  - "Hodgkin AL, Huxley AF (1952), 'A quantitative description of membrane current and its application to conduction and excitation in nerve', J. Physiol. 117: 500-544. Nobel Prize 1963."
  - "Crick FHC (1979), 'Thinking about the brain', Scientific American 241(3): 219-232 (the wish for a way to control one type of cell)."
  - "Oesterhelt D, Stoeckenius W (1971), 'Rhodopsin-like protein from the purple membrane of Halobacterium halobium', Nature New Biology 233: 149-152."
  - "Matsuno-Yagi A, Mukohata Y (1977), Biochem. Biophys. Res. Commun. 78: 237-243 (halorhodopsin, a light-driven chloride pump)."
  - "Foster KW, Saranak J, Patel N, Zarilli G, Okabe M, Kline T, Nakanishi K (1984), 'A rhodopsin is the functional photoreceptor for phototaxis in the unicellular eukaryote Chlamydomonas', Nature 311: 756-759."
  - "Harz H, Hegemann P (1991), 'Rhodopsin-regulated calcium currents in Chlamydomonas', Nature 351: 489-491."
  - "Zemelman BV, Lee GA, Ng M, Miesenböck G (2002), 'Selective photostimulation of genetically chARGed neurons', Neuron 33: 15-22."
  - "Ion concentrations: illustrative textbook values for a mammalian neuron, rounded (as in the Membrane potential calculator)."
---

The 2026 Nobel Prize in Physiology or Medicine went to **Karl Deisseroth**, **Peter Hegemann** and **Georg Nagel** for discovering proteins that turn light into electric current across a cell membrane, and for **optogenetics**, the method that uses them to switch chosen brain cells on and off with flashes of light. It began, of all places, with a single-celled green alga swimming towards the sun. This first part sets the scene: how nerve cells talk with electricity, why that made neuroscientists dream of a light switch, and the long hunt for the alga's light sensor. You can test the electrical side yourself with the [[hodgkin-huxley-simulator|Hodgkin-Huxley simulator]] and the [[membrane-potential|Membrane potential calculator]].

<div class="nb-short">

**In short**
- Nerve cells keep their inside about **70 millivolts negative**. A signal is a brief **spike** in which sodium ions rush in and potassium ions flow out, all or nothing.
- In 1979 Francis Crick wished for a way to **switch just one type of brain cell** on or off, fast. Electrodes hit every cell nearby; drugs are slow.
- Some microbes have light-sensing proteins called **rhodopsins**, like the ones in our eyes. The green alga *Chlamydomonas* steers towards light with one. Peter Hegemann spent years showing that its light sensor works astonishingly fast, which pointed to a sensor that is **also an ion channel** (part 2).

</div>

## The electric language of the brain

Every cell has a thin oily membrane that keeps salty water inside apart from salty water outside. The two are different: inside is rich in **potassium** (K⁺), outside in **sodium** (Na⁺) and **chloride** (Cl⁻). Pumps in the membrane keep it that way. Because potassium can leak out through always-open channels and leaves negative charge behind, the inside settles at about **−70 mV**: the **resting potential**.

Each ion on its own would pull the voltage to a value set by its concentrations, its **Nernst** (equilibrium) potential: about −95 mV for potassium and +65 mV for sodium in a typical mammalian neuron. The actual resting voltage is a weighted average that depends on how easily each ion gets through (the **Goldman–Hodgkin–Katz** equation). We plot all of these below with the [[membrane-potential|Membrane potential calculator]]'s maths.

A **nerve impulse** (action potential) flips this for about a millisecond. In 1952 Alan Hodgkin and Andrew Huxley, working on the giant nerve fibre of a squid, worked out how: voltage-sensitive **sodium channels** open when the inside becomes less negative, sodium rushes in, the inside swings to about +40 mV; then the sodium channels close and **potassium channels** open, bringing the voltage back. Their equations still describe it, and won them the 1963 Nobel Prize. Poke the cell below: small pokes fade, but past a threshold the cell fires a full spike, whatever the size of the poke.

<div data-nx="hh-neuron"><p class="nx-noscript">Interactive simulation: a Hodgkin–Huxley neuron you can poke (needs JavaScript).</p></div>

<details class="deeper"><summary>What the gates m, h and n are</summary>

Hodgkin and Huxley described the sodium conductance as g_Na·m³·h and the potassium conductance as g_K·n⁴, where m, h and n are "gates" between 0 and 1 that relax towards voltage-dependent values with voltage-dependent time constants. m opens fast with depolarisation, h closes more slowly (inactivation), n opens slowly. The cubes and fourth powers were fitted to the data; later they were read as several identical subunits that must all move for a channel to open. Potassium channels really are made of four subunits, as Roderick MacKinnon's 1998 crystal structure showed (Nobel Prize 2003). The model predicts the threshold, the refractory period and the speed of conduction without any further assumptions, one of the great successes of theoretical biology.
</details>

## The wish for a switch

By the 1970s scientists could record from single neurons and stimulate them with electrodes. But the brain packs together hundreds of cell types, intertwined like the wires in a cable. An electrode excites every cell and fibre near its tip; a drug spreads slowly and acts for minutes. To learn what a particular type of cell does for a behaviour, you need to switch **that type only**, on a **millisecond** timescale, in a **living, behaving** animal.

In 1979 Francis Crick, by then working on the brain, wrote in *Scientific American* that what was needed was a method by which all neurons of one particular type could be inactivated, leaving the others more or less unaltered. Later he suggested that light might do it, if a way could be found to make cells sensitive to it. It sounded far-fetched. Genes could already be delivered to chosen cell types (using cell-type-specific "promoters", the switches that decide where a gene is read), so the missing piece was a protein that would turn light directly into current.

Early attempts were clever but complicated. In 2002 Gero Miesenböck's group made fly and mammalian neurons light-sensitive with "chARGe", three fruit-fly genes for the visual system's rhodopsin and its partners. It worked, but slowly (spikes followed light after hundreds of milliseconds to seconds) and only in cells with the right helpers. Others used light to release "caged" chemicals. What was needed was one protein that does everything.

## Microbes that use light directly

Animal eyes use **rhodopsins**: proteins holding a molecule of **retinal** (a form of vitamin A) that changes shape when it absorbs a photon. In our eyes the protein then sets off a chain of chemical signals, which takes tens of milliseconds.

Microbes have their own family of rhodopsins that skip the chain. In 1971 Dieter Oesterhelt and Walther Stoeckenius found **bacteriorhodopsin** in the purple membrane of a salt-loving microbe, *Halobacterium salinarum*: a protein that, each time it absorbs a photon, **pumps one proton** across the membrane. In 1977 a light-driven **chloride pump**, **halorhodopsin**, was found in the same kind of microbe. These pumps move one ion per photon, too few to change a neuron's voltage much, but they showed that a single retinal protein can move ions with light. (Halorhodopsin will be back in part 3, as an "off switch".)

## An alga that swims to the light

*Chlamydomonas reinhardtii* is a green alga a hundredth of a millimetre long. It swims with two whip-like flagella, spinning as it goes, and steers towards moderate light (to photosynthesise) and away from light that is too strong. It sees with an **eyespot**: an orange-red patch of pigment layers next to a light-sensitive patch of membrane. As the cell spins, the eyespot sweeps across the light, and the cell adjusts the beat of its flagella.

In 1984 Kenneth Foster and colleagues showed that the sensor is a rhodopsin: a **blind mutant** that could not make retinal regained its steering when retinal was added to the water. Try it below: drag the lamp; switch to the blind mutant; then add retinal.

<div data-nx="phototaxis"><p class="nx-noscript">Interactive simulation: algae steering towards a lamp (needs JavaScript).</p></div>

## Hegemann's clue: too fast for a chain

Peter Hegemann, trained in Oesterhelt's department at the Max Planck Institute for Biochemistry near Munich, set out to find how the alga's rhodopsin works. With Hartmut Harz he measured the electric currents across the eyespot's membrane when a flash of light hit the cell (*Nature*, 1991). The current started within **microseconds** of the flash: far too fast for a chain of chemical messengers like the one in our eyes. The simplest explanation was startling: the rhodopsin itself, or something bolted to it, had to be an **ion channel** opened directly by light.

Proving it took another decade. The obvious candidate, an abundant rhodopsin-like protein in the eyespot, turned out to be the wrong one. The breakthrough came from genome sequencing: in 2001 a Japanese project sequencing *Chlamydomonas* genes turned up two genes that looked like microbial rhodopsins attached to long extra tails. Hegemann's group, with Georg Nagel's expertise in recording from cells, put them to the test. What they found is part 2.

## Checked with the tools

**1. All or nothing.** With the [[hodgkin-huxley-simulator|Hodgkin-Huxley simulator]]'s engine, the threshold for a 1 ms pulse comes out at **6.91 µA/cm²**. A pulse 10 % below it makes a bump that dies away (peak −60 mV). A pulse 10 % above it fires a full spike to about **+37 mV**; doubling the pulse barely changes the spike (+40 mV).

<!-- fig:all-or-nothing -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 300" role="img" aria-label="placeholder" xmlns="http://www.w3.org/2000/svg"><text class="fibub-mark" x="550" y="292">fibub.com</text></svg><figcaption>Placeholder.</figcaption></figure>
<!-- /fig:all-or-nothing -->

**2. The strength–duration curve.** Searching for the threshold at pulse lengths from 0.1 to 10 ms traces the curve physiologists have drawn since Louis Lapicque in 1907: short pulses need much more current (about **65 µA/cm²** at 0.1 ms) and long ones level off (about **2.2 µA/cm²** at 10 ms). The pulse length at twice the long-pulse threshold, the "chronaxie", falls between **1.5 and 2 ms** in this model. Optogenetics lives on the same curve: shorter flashes need brighter light.

<!-- fig:strength-duration -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 300" role="img" aria-label="placeholder" xmlns="http://www.w3.org/2000/svg"><text class="fibub-mark" x="550" y="292">fibub.com</text></svg><figcaption>Placeholder.</figcaption></figure>
<!-- /fig:strength-duration -->

**3. Where each ion pulls the voltage.** With textbook concentrations at 37 °C the Nernst potentials are K⁺ −95 mV, Cl⁻ −64 mV, Na⁺ +67 mV and Ca²⁺ +132 mV, and the Goldman–Hodgkin–Katz resting potential is **−69 mV**, close to potassium. Any channel that lets sodium in will push the cell towards firing; any that lets chloride in, or pumps it in, holds the cell near rest. That is the whole logic of optogenetic on and off switches.

<!-- fig:nernst -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 300" role="img" aria-label="placeholder" xmlns="http://www.w3.org/2000/svg"><text class="fibub-mark" x="550" y="292">fibub.com</text></svg><figcaption>Placeholder.</figcaption></figure>
<!-- /fig:nernst -->

| | Textbook or published | Our check |
|---|---|---|
| Hodgkin–Huxley threshold, 1 ms pulse | 6.91 µA/cm² (SciPy reference in our tests) | 6.91 µA/cm² |
| Spike peak | about +40 mV in the model | +37 to +40 mV |
| Mammalian resting potential | about −65 to −70 mV | −69 mV (GHK, 37 °C) |

## How we made the graphs

`scripts/blog-figures/nobel-medicine-2026.mjs` uses `simulate()` and `threshold()` from `src/lib/sci/hhsim.ts`, the engine of the Hodgkin-Huxley simulator and the Nerve impulse lab (squid-axon parameters at 6.3 °C, rest −65 mV, fourth-order Runge–Kutta in 0.01 ms steps), and `nernst()` and `ghkVoltage()` from `src/lib/sci/ghk.ts`, the Membrane potential calculator's maths. The ion concentrations are rounded textbook values, our choice.

## How we test the maths

`tests/sci-tools/hodgkin-huxley-simulator.mjs` checks the simulator against SciPy's `solve_ivp`: spike times for a 10 µA/cm² step to within 0.1 µs, the peak voltage, seven spikes at 16.3 °C, firing rates of 70 Hz at 10 µA/cm² and 87.5 Hz at 20 µA/cm², and the 1 ms threshold of **6.9107 µA/cm²**. `tests/sci-tools/membrane-potential.mjs` checks the Nernst and GHK voltages at 37 °C and 25 °C and the GHK currents. These run on every change.

## Check it yourself

1. Open the [[hodgkin-huxley-simulator|Hodgkin-Huxley simulator]]. Under **Threshold and f–I curve**, set **Single pulse width (ms)** to 1 and press **Find threshold**. It should report about **6.91 µA/cm²**.
2. Change the pulse width to 0.1, then 10, and press **Find threshold** each time: about 65 and about 2.2 µA/cm².
3. In **Current clamp**, choose **Step**, set **Amplitude (µA/cm²)** to 6 and **Duration (ms)** to 1: no spike. Set it to 8: one full spike.
4. Open the [[membrane-potential|Membrane potential calculator]], keep the example concentrations and choose **Permeabilities: Resting: 1 : 0.05 : 0.45** at 37 °C. The resting voltage comes out at about −67 mV (its example has 5 mM potassium outside). Change to **Spike peak: 1 : 20 : 0.45** and watch the voltage swing positive, towards sodium's Nernst potential.
5. For younger students, the [[action-potential|Nerve impulse lab]] shows the same spike and how fast it travels along thin and thick axons.

## What you can use it for

- **Physiology classes:** threshold, refractory period, strength–duration and firing rate, all from one model in the [[hodgkin-huxley-simulator|Hodgkin-Huxley simulator]].
- **Lab planning:** predict what a change in outside potassium or sodium does to the resting voltage with the [[membrane-potential|Membrane potential calculator]].
- **Pharmacology:** block channels (set g̅Na or g̅K to zero in the simulator) to see what drugs like tetrodotoxin or tetraethylammonium do.
- **Next:** the light-gated channel itself, and how Nagel and Hegemann proved it, in [[blog:nobel/medicine-2026-channelrhodopsin|part 2]].
