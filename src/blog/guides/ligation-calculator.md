---
title: "Ligation calculator: insert to vector molar ratio, ng and µL"
summary: "Why ligations are mixed by molecules, how to turn a 3:1 molar ratio into ng and µL, and how to fit buffer, ligase, DNA and water into one tube, with a worked example."
tools: [ligation-calculator, nucleic-acid-concentration, plasmid-map, pcr-master-mix]
updated: 2026-11-10
sources:
  - "Molar mass of linear double-stranded DNA and the pmol = ng ÷ molar mass × 1000 conversion: standard molecular biology arithmetic."
  - "The 3:1 insert to vector ratio, 10× ligase buffer and 2× assembly master mix are common lab starting points, not a kit's instructions."
  - "The fragments in the worked example are made up for teaching."
---

The ligation calculator works out how much of each DNA piece to add when you join an insert into a vector, or several pieces in one assembly. You give lengths, concentrations and the molar ratio you want, and it gives the ng, fmol and µL of each piece, plus the buffer, enzyme and water to bring the tube to volume. It is for students doing their first cloning, lab technicians setting up many reactions, and anyone moving between ligase and Gibson-style kits. Before you start, measure each piece with the [[nucleic-acid-concentration|DNA concentration tool]]; afterwards, sketch the finished plasmid on a [[plasmid-map]], or set up the screening PCR with the [[pcr-master-mix]] calculator.

## What it is

A ligase joins DNA ends. For it to join an insert into a vector, the two ends have to meet, so what matters is how many **molecules** of each are in the tube, not how many nanograms.

Longer DNA weighs more per molecule. Each base pair of double-stranded DNA weighs roughly 618 g/mol, so a 3,000 bp vector molecule is four times as heavy as a 750 bp insert molecule. If you mix equal ng, you have four times more insert molecules than vector molecules.

The tool converts with:

- **pmol = ng ÷ M × 1000**, where M is the molar mass of the DNA in g/mol (worked out from its length). 1 pmol is 1,000 fmol (femtomoles).
- **insert fmol = vector fmol × ratio**, where the ratio is insert molecules per vector molecule (3 means 3:1).
- **ng = fmol × M ÷ 1,000,000**, to turn it back into a weight.

A quick check for a single insert: insert ng = vector ng × ratio × insert bp ÷ vector bp.

Then volumes: **µL = ng ÷ concentration**. The buffer volume is total ÷ strength (2 µL of a 10× buffer in 20 µL). Water fills whatever is left after buffer, DNA and enzyme.

## How to use it

1. Pick the **Kind** of reaction: a ligation with 10× buffer and a separate ligase, an assembly with a 2× master mix that already holds the enzyme, or your own set-up.
2. Check the **Total volume**, **Buffer or master mix strength** and **Enzyme volume**. Changing any of them switches the kind to your own set-up.
3. Type the **Vector amount** in ng.
4. In the **Fragments** box, put one line per piece: name, length in bp, concentration in ng/µL and ratio. The first line is the vector. You can also load a CSV or spreadsheet.
5. Read the pipetting table from top to bottom. The stacked bar shows how the volume is shared out, and the notes warn if the DNA does not fit or a volume is too small to pipette.
6. Open **at other ratios** to see the first insert at 1:1 up to 10:1, then download the list as CSV, PDF, image or Word.

## A worked example

Made-up pieces: a 3,000 bp vector at 50 ng/µL and a 750 bp insert at 20 ng/µL. You want 50 ng of vector and a 3:1 insert to vector ratio, in a 20 µL ligation.

1. **Vector moles.** 50 ng of 3,000 bp DNA is about 27.0 fmol.
2. **Insert moles.** 27.0 fmol × 3 = 80.9 fmol.
3. **Insert weight.** That is 37.5 ng. The shortcut agrees: 50 ng × 3 × 750 ÷ 3,000 = 37.5 ng.
4. **Volumes.** Vector: 50 ng ÷ 50 ng/µL = 1.00 µL. Insert: 37.5 ng ÷ 20 ng/µL = 1.88 µL. DNA in total: 2.875 µL, shown as 2.88 µL.
5. **The rest of the tube.** Buffer: 20 µL ÷ 10 = 2 µL. Ligase: 1 µL. Water: 20 − 2 − 1 − 2.875 = 14.125 µL, shown as 14.1 µL.

The tool also says up to about 296 ng of vector would still fit at these ratios and concentrations.

At 5:1 the insert would be 62.5 ng (3.13 µL); at 1:1 it would be 12.5 ng (0.63 µL).

Switch the kind to the 2× master mix assembly. The mix now takes 10 µL and there is no separate enzyme, so water drops to 7.12 µL, and the most vector that fits falls to about 174 ng.

## Where it is used

- **Restriction cloning:** classic cut-and-paste of a gene into a plasmid with T4 ligase.
- **Gibson and HiFi style assembly:** joining three, four or more overlapping pieces in one tube, each at its own ratio.
- **Golden Gate cloning:** several parts at equal molar amounts, which is the same molecule-counting problem.
- **Library building:** keeping the insert to vector balance steady across many reactions.
- **Teaching labs:** a clear way to show why moles, not grams, decide how molecules meet, the same idea as in chemistry stoichiometry.

## Common mistakes

- **Mixing by ng instead of molecules.** A "3:1" by weight can be far from 3:1 by number. Always give lengths so the tool can convert.
- **Using concentrations from before clean-up.** Leftover primers and nucleotides raise the A260 reading, so the real DNA is less than you think. Measure after purification.
- **Pipetting tiny volumes.** Below about 0.5 µL, errors get large. Dilute the stock first; the tool suggests a fold dilution.
- **Forgetting the buffer when the DNA is dilute.** Weak stocks can overfill the tube. If the tool says the DNA does not fit, use less vector, concentrate the DNA or raise the total volume.
- **Adding the enzyme first.** Put the ligase or master mix in last, after everything else is mixed, and keep it cold.

## Questions people ask

**Does the ratio matter for blunt ends?** Blunt ends join less readily, so people often try higher insert excess. The tool lets you set any ratio; use your kit's advice as the starting point.

**Can I use single-stranded oligos?** The masses assume linear double-stranded DNA. Anneal oligos into a duplex first, then enter the duplex length.

**Why give the vector amount and not a total DNA amount?** The vector sets the number of possible products. Every insert amount follows from it, so changing one number rescales the whole reaction.
