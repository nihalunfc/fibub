---
name: IR spectrum band finder
num: 109
shelf: science
section: organic-chemistry
title: "IR spectrum interpreter: functional group band table and peak finder (cm⁻¹)"
summary: "Type the peaks of an infrared spectrum, or open the spectrum itself, and see which bonds and functional groups each band could belong to: carbonyls, O–H, N–H, nitriles, aromatics and more, with groups that need several bands checked together and a searchable band table."
status: live
ads: true
order: 4
icon: search
works: offline
updated: 2026-11-08
related: [nmr-impurity-checker, isotope-pattern-calculator, beer-lambert-calculator, molar-mass-calculator]
sources:
  - "Band ranges: general textbook knowledge of characteristic infrared absorptions, written and rounded to 10 cm⁻¹ by fibub. Not a copy of any published table."
  - "Example spectrum: simulated by fibub."
flow:
  - { icon: chart, label: "Spectrum" }
  - { icon: target, label: "Peaks" }
  - { icon: search, label: "Bands" }
  - { icon: flask, label: "Groups" }
---

## What it does

An infrared spectrum shows which bonds a molecule contains. Each kind of bond absorbs in a typical range: a carbonyl C=O near 1700 cm⁻¹, an alcohol O–H as a broad band near 3300, a nitrile C≡N as a sharp band near 2250. This tool reads your peak positions and lists every bond that could absorb there.

Single bands are rarely enough, so it also checks **functional groups that need several bands together**:

- An **ester** needs a C=O near 1740 and a strong C–O between 1150 and 1300, with no broad acid O–H.
- A **carboxylic acid** needs the very broad O–H from about 2500 to 3300 together with a C=O near 1710.
- An **aldehyde** needs a C=O and the weak pair of C–H bands near 2820 and 2720.

Each group is marked as having all its key bands, only some of them, or as ruled out by another band. A ketone, for example, is ruled out by an aldehyde C–H or an ester C–O.

The second card **picks the peaks from a whole spectrum**. Paste or open it as two columns, wavenumber and either % transmittance or absorbance, and the tool finds the bands and marks the broad ones. It draws the spectrum the usual way, with wavenumber falling to the right. One button sends the picked peaks to the first card.

The third card is the **band table**. Search it by group, by bond or by a wavenumber, and convert cm⁻¹ to µm and nm.

## How to use it

1. Type your peaks in cm⁻¹, separated by commas or one per line. Copy them straight from a characterisation line such as "3350 (br), 2960, 1715 (s)". Write "br" after a broad band. A range such as "3300–2500 br" counts as one broad band.
2. The tolerance widens each range a little (±10 cm⁻¹ by default). Raise it for a low-resolution instrument.
3. Or open the spectrum (CSV, TSV, TXT or Excel, two columns) and press **Check these peaks above**. If small peaks are missed, lower the "smallest peak" setting. If noise is picked up, raise it.

## Worked example

The example spectrum is a simulated ester with peaks at 2984, 2940, 1744, 1448, 1372, 1240 and 1048 cm⁻¹. The tool reports that the spectrum is **consistent with an ester and an alkyl chain**. The C=O at 1744 and the strong C–O at 1240 are the ester. The C–H stretches just below 3000 and the bends at 1448 and 1372 are the alkyl chain. An ether is ruled out because a carbonyl is present. Alcohols and amines show as only partly matched, because there is no O–H or N–H band.

## Questions

**Can it name my compound?** No. IR shows which groups are present, not the whole structure. Combine it with NMR and mass spectrometry, or compare the fingerprint region below 1500 cm⁻¹ with a reference spectrum of the expected compound.

**Why is there a band near 2350 in my spectrum?** It is usually carbon dioxide in the instrument's beam path, not your sample. Run a fresh background.

**My carbonyl is at 1685, not 1715.** Conjugation with a C=C or an aromatic ring lowers a C=O band by about 20 to 40 cm⁻¹, and ring strain raises it. The table lists conjugated carbonyls separately.

**Is anything sent anywhere?** No. Your spectrum stays in your browser, and the page works offline once loaded.
