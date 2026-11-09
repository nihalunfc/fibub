---
name: Dental chart
num: 499
shelf: science
section: dentistry
title: "Dental chart and tooth numbering converter: FDI, Universal and Palmer, odontogram with surfaces"
summary: "Convert tooth numbers between FDI (ISO 3950), Universal and Palmer for permanent and primary teeth, and mark caries, fillings, crowns, missing teeth, implants and notes on a clickable chart by tooth and surface. DMFT count, CSV, image and PDF. Nothing is stored unless you save the file."
status: live
ads: false
order: 39
icon: table
works: offline
updated: 2026-11-09
related: [audiogram, visual-acuity-converter, reliability-analysis, plate-layout, clinical-scores, body-measures]
sources:
  - "FDI two-digit notation: FDI World Dental Federation, adopted as ISO 3950 (Dentistry: designation system for teeth and areas of the oral cavity). Universal numbering: American Dental Association. Palmer notation: Palmer C (1891) and Zsigmondy A (1861)."
  - "DMFT index: Klein H, Palmer CE, Knutson JW (1938) Studies on dental caries I, Public Health Rep 53:751; as used in WHO Oral health surveys: basic methods (5th ed., 2013)."
  - "Code written by fibub; numbering checked in the tests against a separate Python table built by walking the Universal order round the mouth. The example findings are made up."
flow:
  - { icon: pointer, label: "Tap teeth" }
  - { icon: pencil, label: "Mark" }
  - { icon: table, label: "Findings" }
  - { icon: download, label: "Save" }
---

## What it does

Dental students and assistants meet three ways of numbering teeth. The **FDI** two-digit system (ISO 3950) is used in most of the world: the first digit is the quadrant (1 upper right, 2 upper left, 3 lower left, 4 lower right; 5 to 8 for primary teeth) and the second is the tooth counted from the midline, so 36 is the lower left first molar. The **Universal** system used in the US numbers permanent teeth 1 to 32, starting at the upper right third molar and going round to the lower right third molar, and primary teeth A to T. **Palmer** notation draws a quadrant bracket beside the tooth number, 1 to 8 or A to E: 6┘ is the upper right first molar.

This tool converts between the three and gives you a chart (odontogram) to mark findings tooth by tooth and surface by surface, with a findings table, the DMFT count and downloads.

For study and teaching, not medical advice. Check with a qualified professional.

Hearing and eyesight have their own charts: the [[audiogram|audiogram plotter]] and the [[visual-acuity-converter]].

## How to use it

1. Choose **Permanent** or **Primary** teeth and how to **label** them (FDI, Universal or Palmer). The chart is drawn as you face the patient: the patient's right is on your left.
2. Pick a mark: **Caries** or **Filled** go on a surface; tap the surface. **Crown**, **Missing** and **Implant** go on the whole tooth; tap anywhere on it. Tap again to remove a mark. **Note** lets you type a note for a tooth, and **Clear tooth** removes everything on it.
3. Each tooth has five surfaces: mesial (towards the midline), distal, occlusal or incisal (the centre), buccal or labial (the outer side: top of the box for upper teeth, bottom for lower teeth) and lingual or palatal (the tongue or palate side).
4. The **Findings** table lists every mark, with surfaces as letters (M, O or I, D, B or F, L or P). The DMFT (permanent) or dmft (primary) count is the number of decayed, missing and filled teeth.
5. **Download CSV** saves the chart; **Open a saved CSV** brings it back later. Image, PDF and Word make a printable copy.
6. **Convert tooth numbers** takes a list in one system and gives all three plus the tooth's name. The full table of all 52 teeth is under "All teeth in the three systems".

## Worked example

The chart opens with made-up findings: caries on the mesial and occlusal surfaces of 16, a mesio-occluso-distal (MOD) filling on 24, an occlusal filling on 26, a crown on 11, 36 missing, an implant at 46 and a note on 21. The page shows **DMFT 6**: D 1 (tooth 16), M 2 (36, and 46, which is an implant), F 3 (11, 24, 26). In the converter, the typed Universal numbers 3, 8, 19, 30, A and K are FDI 16, 11, 36, 46, 55 and 75: upper right first molar, upper right central incisor, lower left first molar, lower right first molar, and the upper right and lower left second primary molars.

## Tips

- In the CSV, the surfaces column uses I for incisal, F for facial (labial) and P for palatal on the right teeth; the chart reads them back.
- DMFT here assumes missing teeth were lost to caries; in a survey, teeth missing for other reasons (orthodontics, trauma) are not counted, so adjust by hand.
- Palmer brackets need a font with box-drawing characters; the text form UR6, UL6, LL6 and LR6 is shown beside it and used in files.

## FAQ

**Is my chart saved anywhere?** No. Nothing is stored or sent. The chart lives only in this page until you download it, and it is gone when you close or reload the page.

**Is this a clinical record?** No. It is a teaching and practice tool. Use your clinic's approved record system for patients.

**Why is the upper right first molar 3 in Universal but 16 in FDI?** Universal counts round the mouth from the upper right third molar (1), so the first molar is the third tooth. FDI names the quadrant (1) and the sixth tooth from the midline (6).
