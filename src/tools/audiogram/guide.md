---
name: Audiogram plotter
num: 495
shelf: science
section: audiology-and-vision-science
title: "Audiogram plotter: plot hearing thresholds, pure-tone average, degree of hearing loss, air-bone gap"
summary: "Type air and bone conduction thresholds for each ear and get a standard audiogram (O X < > [ ] symbols), pure-tone averages, the degree of loss by WHO 2021 or Clark 1981 grades (editable), air-bone gap and asymmetry flags, and a printable PNG or PDF. For study and teaching; not a hearing test."
status: live
ads: false
order: 35
icon: chart
works: offline
updated: 2026-11-09
related: [visual-acuity-converter, plot-maker, reliability-analysis, sample-size]
sources:
  - "Symbols: American Speech-Language-Hearing Association (1990) Guidelines for audiometric symbols, ASHA 32(Suppl 2):25–30."
  - "Degree cutoffs (formula-style boundaries, editable): World Health Organization (2021) World report on hearing, Geneva, from Humes LE (2019) The World Health Organization's hearing-impairment grading system: an evaluation for unaided communication in age-related hearing loss, Int J Audiol 58:12; Clark JG (1981) Uses and abuses of hearing loss classification, ASHA 23(7):493–500. Checked 2026-11-09."
  - "Pure-tone average, air-bone gap and type of loss: standard audiology teaching, e.g. Katz J (ed.) Handbook of Clinical Audiology, 7th ed. (2015)."
  - "Code written by fibub and checked against a separate Python implementation. The example thresholds are made up."
flow:
  - { icon: pencil, label: "Thresholds" }
  - { icon: sliders, label: "Rules" }
  - { icon: chart, label: "Audiogram" }
  - { icon: download, label: "Print" }
---

## What it does

An audiogram is the chart an audiologist draws after a pure-tone hearing test: the quietest level heard (the threshold, in dB HL) at each frequency, for each ear, by air conduction (headphones) and bone conduction (a vibrator behind the ear). This tool turns a table of thresholds into a standard audiogram and works out the numbers students are asked for:

- the **pure-tone average** (PTA) over 0.5, 1 and 2 kHz (PTA3) and over 0.5, 1, 2 and 4 kHz (PTA4);
- the **degree** of hearing loss for each ear and the better ear, from a named scheme whose cutoffs you can see and edit;
- the **air-bone gap** at each frequency, flagged when it reaches your limit, and the **type** of loss (conductive, sensorineural or mixed);
- an **asymmetry** flag when one ear is worse by your chosen amount at adjacent frequencies.

For study and teaching, not medical advice. Check with a qualified professional. **This is not a hearing test.** It only plots thresholds that were measured with a calibrated audiometer in a quiet room.

For eyesight rather than hearing, use the [[visual-acuity-converter]]; to plan how many people a hearing study needs, the [[sample-size|sample size calculator]].

## How to use it

1. Type or paste one row per frequency: frequency, right air, left air, right bone, left bone. Leave a cell empty if it was not tested. Add **m** for a masked threshold (35m) and **NR** for no response at the highest level tried (95NR). You can open a CSV, TSV or Excel file instead.
2. Choose the **degree scheme**. *WHO 2021 grades* use PTA4 of the better ear with cutoffs at 20, 35, 50, 65, 80 and 95 dB HL (each band is "up to but not including" the next cutoff). *Clark 1981* uses PTA3 with bands up to and including 15, 25, 40, 55, 70 and 90 dB HL. The cutoffs appear in the box below the settings; edit them to use your course's scheme. Check the official source before relying on any cutoff.
3. **Pure-tone average** chooses which average is graded.
4. **Air-bone gap flag** marks gaps of this size or more (15 dB, that is more than 10 dB in 5 dB steps).
5. **Normal limit** is used for the type of loss. **Asymmetry** flags a difference of at least the given dB at that many adjacent frequencies, with the same ear worse.
6. Download the audiogram and findings as an image, PDF or Word file, or the table as CSV.

## Symbols

Right ear in red, left ear in blue (ASHA 1990): O right air, X left air, triangle and square for masked air, < right bone and > left bone (unmasked), [ and ] masked bone. An arrow pointing down and out means no response. Air thresholds of each ear are joined by a line, solid for the right ear and dashed for the left.

## Worked example

The made-up example has a sloping right ear and a flat left ear with normal bone conduction. Right PTA4 = (20 + 25 + 35 + 55) ÷ 4 = 33.75 dB HL, and left PTA4 = (40 + 45 + 40 + 35) ÷ 4 = 40 dB HL. With WHO 2021 grades the page shows **Right: mild (PTA4 33.8 dB HL) · Left: moderate (PTA4 40 dB HL)**, and the better ear is the right, mild. The left ear's air-bone gaps are 30, 35, 25 and 20 dB with bone thresholds of 10 to 15 dB, so its type is **conductive**; the right ear's gaps are all 5 dB, so it is **sensorineural**. The ears differ by 15 to 20 dB at 250, 500 and 1000 Hz with the left worse, so the asymmetry flag is raised. Switch to Clark 1981 and the PTA3 values 26.7 and 41.7 dB HL give mild and moderate.

## Tips

- Thresholds are measured in 5 dB steps; the page notes any value that is not.
- The type-of-loss rule is a simple teaching rule based on the mean gap from 0.5 to 4 kHz. Real interpretation also uses masking, tympanometry, speech tests and the history.
- No-response values are counted at the level tested, so any average that uses them is "or more".

## FAQ

**Which scheme should I use?** The one your course or service uses. WHO 2021 is the international grading for population reports; Clark 1981 is common in North American teaching. Both are shown with their sources.

**Can I test my hearing here?** No. Online tones on ordinary headphones are not calibrated. See an audiologist.

**Is anything uploaded?** No. Everything is worked out and drawn in your browser.
