---
name: Hydropathy plot
num: 182
shelf: science
section: proteomics-and-protein-science
title: "Hydropathy plot"
summary: "Paste a protein and see how water-repelling each stretch is: a sliding-window hydropathy plot, the grand average (GRAVY) and likely membrane-crossing helices from 19-residue windows above a threshold. Every scale value can be changed, or paste your own scale. Nothing is uploaded."
status: live
ads: false
order: 5
icon: chart
works: offline
updated: 2026-11-09
related: [protein-calculator, peptide-mass-calculator, sequence-tools, gel-densitometry, pdb-viewer, peptide-overlap-designer]
sources:
  - "The method (a sliding-window mean of a hydropathy scale, and 19-residue windows above about 1.6 for membrane-crossing helices) follows Kyte and Doolittle's 1982 description; the method is general science knowledge."
  - "The scale is fibub's own: the widely taught Kyte–Doolittle values rounded to the nearest 0.5. It is not the published table; every value can be edited, or a whole scale pasted in."
  - "Checked in the tests against Biopython (ProteinAnalysis.protein_scale) and a NumPy moving average on the example and four random proteins: every window mean, GRAVY and the segment edges."
  - "The example protein is made up for this tool; it is not a real protein."
flow:
  - { icon: pencil, label: "Paste" }
  - { icon: sliders, label: "Window" }
  - { icon: chart, label: "Plot" }
  - { icon: table, label: "Segments" }
---

## What it does

Some parts of a protein like water and sit on the outside; others repel water and hide in the core or cross a cell membrane. A **hydropathy plot** shows this along the chain. Every amino acid gets a number (positive for water-repelling, negative for water-loving), and the page averages those numbers over a short sliding window so the trend is easy to see. It also works out:

- **GRAVY**, the grand average of hydropathy: the mean value over the whole protein. Above 0 means water-repelling overall; most soluble proteins come out below 0.
- **Likely transmembrane segments**: a helix that crosses a membrane is about 19 to 21 residues long and mostly water-repelling. Any 19-residue window whose mean is above the threshold (1.6 by default) marks its residues; touching windows join into one segment.

This is the method Kyte and Doolittle described in 1982. Everything runs in your browser; the sequence is never uploaded.

For the protein's mass, pI and extinction coefficient, use the [[protein-calculator|protein parameter calculator]]; to see the helices in 3D, the [[pdb-viewer]].

## How to use it

1. Paste a protein in one-letter codes, open a FASTA file, or tap **Use the example**. FASTA headers, numbers and spaces are ignored; only the first protein is used.
2. Set the **plot window**. 9 is a good start: smaller windows are noisy, larger ones blur short features. Windows must be odd so each has a middle residue, where its point is drawn.
3. Set the **membrane window** (19) and **membrane threshold** (1.6) for the transmembrane search. The membrane curve is drawn dashed, with the threshold as a dashed line.
4. Read the plot, the facts and the segment table, then download the values as CSV, or the whole report as an image, PDF or Word file.

## The scale

The numbers are **fibub's own scale**: the widely taught Kyte–Doolittle values rounded to the nearest 0.5 (for example isoleucine 4.5, leucine and valine 4, arginine −4.5). Rounding moves window means by a few hundredths, so results differ slightly from tools that use the published decimals. Every value has its own box; a changed value is outlined and the scale is then called "your own". You can also paste a whole scale, one amino acid and a number per line ("A 1.8", "Arg, -4.5") or 20 numbers in alphabetical one-letter order, and tap **Use this scale**. **Reset to fibub's values** brings the shipped scale back. Letters with no value (such as U, selenocysteine) count as 0 in the windows and are left out of GRAVY; the page says so.

## Worked example

The example is a made-up protein of 148 amino acids with three water-repelling stretches. With fibub's scale, a window of 9 and the defaults above, the page shows **GRAVY −0.473 · 3 likely transmembrane segments**.

The first window covers MSDNKTPEQ: 2 − 1 − 3.5 − 3.5 − 4 − 0.5 − 1.5 − 3.5 − 3.5 = −19, so its mean is −19 ÷ 9 = −2.11, drawn at residue 5. The highest 9-window mean is 3.22 around residue 38 (inside the first stretch, WLAVLIGFAVLLSVIAFGL); the lowest is −3.22 around residue 135, in the charged tail.

The segment table lists residues 26–52 (27 long, highest 19-window mean 2.63), 65–90 (26 long, 2.58) and 105–132 (28 long, 2.63). Segments are longer than 19 because neighbouring windows above the threshold join up. Raise the threshold to 2.6 and only two shorter segments remain; change the membrane window to 21 and the edges move by a residue or so.

## Tips

- A clear transmembrane helix usually gives a broad peak well above 1.6 on the 19-residue curve. A peak right at the start of the protein is often a **signal peptide**, not a membrane helix.
- Buried stretches of soluble proteins can cross the threshold too. Treat the result as a first look and check it with a dedicated topology predictor and with experiments.
- For a quick look at surface regions, use a short window of 7 and look for the lowest dips.

## FAQ

**Why do my numbers differ from another tool?** Different tools use different scales, decimals, window edges and ways to place each point. Here each point is the plain mean of the window, drawn at its middle residue, with fibub's rounded scale.

**Can I use another hydrophobicity scale?** Yes: paste it in and tap Use this scale. The threshold 1.6 belongs to the Kyte–Doolittle scale, so set your own threshold for a scale with a different range.

**Is my sequence stored?** No. Nothing is uploaded or saved; close the page and it is gone.
