---
title: "Proteinase K degradation of PLA films: amorphous vs semi-crystalline (DSC)"
summary: "A 2025 study found the enzyme proteinase K removed 73 % of amorphous PLA film but 40 % of semi-crystalline film. Here is how to check DSC crystallinity and test the claim with a mass balance."
tools: [dsc-tga-analyser, polymer-molar-mass, glass-transition-calculator]
updated: 2026-11-10
sources:
  - "Crystallinity from DSC, Xc = (ΔHm − ΔHcc) / ΔH⁰m, is the standard method; the paper uses ΔH⁰m = 93.7 J/g for PLA."
  - "The DSC scans in the worked example are simulated by fibub (8 mg samples at 10 K/min); they are not data from the paper."
paper:
  title: "Enzymatic Degradation of PLA: Preferential Degradation of the Amorphous Fraction"
  authors: "Shrestha S, Snowdon M, Levin DB"
  journal: "Polymers"
  year: 2025
  doi: "10.3390/polym17223042"
  url: "https://doi.org/10.3390/polym17223042"
  licence: "CC BY"
  reviewed: true
---

Polylactic acid (PLA) is the most common plastic sold as compostable, yet it breaks down slowly unless it is warm and wet, and how fast it goes depends on how much of it is crystalline. A November 2025 paper in Polymers soaked amorphous and semi-crystalline PLA films in proteinase K, an enzyme known to cut PLA chains, and found that the amorphous films lost far more mass. Crystallinity was measured by differential scanning calorimetry (DSC), and the [[dsc-tga-analyser]] does that sum from an exported scan in your browser, including the cold crystallisation step that is easy to forget.

## What they found

After one 8-day treatment at 37 °C, amorphous films had lost about 15 % of their mass and semi-crystalline films about 10 %. When the enzyme solution was replaced every few days, the losses grew to about 73 % for amorphous films and about 40 % for semi-crystalline films. Lactic acid, the product of chain cutting, was released fastest in the first hours and then levelled off, as the solution turned acidic (pH fell from 8.5 to about 4 to 5). Electron microscopy showed holes in amorphous films after 1 hour, but only after 4 hours in semi-crystalline ones, which tended to crack instead. The paper reports that the overall crystallinity of the films did not change significantly.

## Why it matters

Tightly packed crystalline regions are harder for enzymes to reach, so a PLA product's crystallinity, set by how it is cooled or annealed, can decide whether it breaks down in months or years. The falling pH also suggests that the acid PLA releases can slow its own enzymatic breakdown, a point for anyone designing composting or enzyme-recycling processes.

## How they did it

Amorphous cast films (220 µm thick, 0 to 3 % crystalline) were compared with a high-L-lactide PLA annealed at 90 °C for 1 hour to reach 47 to 50 % crystallinity. Pieces of about 1.5 × 1.25 cm were placed in 2 mg/mL proteinase K in Tris buffer at pH 8.5 and 37 °C for 1 hour to 8 days, in triplicate. The team weighed them, measured lactic acid by liquid chromatography, and checked structure by DSC at 10 °C/min, X-ray diffraction and electron microscopy.

## Check it yourself with fibub

The worked example uses **two simulated DSC scans**, not the paper's data: 8 mg of film heated at 10 K/min, exported in mW, plotted exothermic up. One is an amorphous film; the other is an annealed film.

1. Paste temperature and heat flow. Set *Heat flow unit* to mW, *Sample mass* to 8 mg, *Heating rate* to 10 K/min and *The plot shows* to Exothermic up.
2. Set the event windows so each starts and ends on flat baseline: a glass transition from 45 to 75 °C, a peak from 80 to 125 °C and a peak from 155 to 190 °C.
3. Under *Polymer, for crystallinity*, choose *Your own ΔH⁰m* and type 93.7 J/g, the paper's value. The page's built-in PLA entry uses 93 J/g, which changes the answer slightly.

For the amorphous film the page finds **Tg 60.0 °C** at the midpoint with a heat capacity step of 0.500 J/(g·K), a cold crystallisation exotherm at 100 °C releasing **27.97 J/g** and melting at 170 °C taking **30.00 J/g**. The crystallinity before the scan is (30.00 − 27.97) / 93.7 = **2.2 %**. Almost all the crystals that melted formed during the heating itself. Forget to subtract the cold crystallisation and you get 30.00 / 93.7 = 32.0 %, a badly wrong answer that makes an amorphous film look semi-crystalline.

For the annealed film there is no cold crystallisation, and melting near 175 °C takes **45.01 J/g**, so **Xc = 48.0 %**. With the built-in 93 J/g instead, it is 48.4 %.

Now test the paper's title with a mass balance, using the paper's headline numbers. Suppose a film starts 48 % crystalline and loses 39.7 % of its mass. If the enzyme removed only amorphous material, the 48 g of crystal per 100 g would remain in 60.3 g of film, and the crystallinity would rise to 48 / 60.3 = **79.6 %**. That is a jump DSC would show at once. For the crystallinity to stay at 51 % or below, at least 43 % of the lost mass must have been crystalline. So an unchanged crystallinity means the enzyme must also have eaten into crystalline regions, probably from the surface inwards, even though amorphous material went faster.

To see whether chains were also shortened, which this paper did not measure, analyse a gel permeation trace with the [[polymer-molar-mass]] tool; to compare a measured Tg with a prediction for a blend, use the [[glass-transition-calculator]].

## The fine print

- The two film types came from different PLA grades and processes, not only different crystallinity, so other differences could add to the effect.
- Crystallinity values after degradation are shown only in figures, and individual melting and cold crystallisation enthalpies are not listed, so the DSC sums cannot be redone from the text.
- The methods and conclusions describe the repeated-treatment schedule differently, and a few percentages differ between sections.
- Weight loss alone does not prove the polymer became small molecules; the authors say other measures are needed.
- The acid released lowered the pH far from the enzyme's best range, which may explain why degradation slowed.
