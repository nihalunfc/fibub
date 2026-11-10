---
name: Ion exchange pH
num: 184
shelf: science
section: biochemistry
title: "Ion exchange pH"
summary: "Paste one or more protein sequences to get each pI and charge curve on one plot, a buffer pH for anion exchange (above the pI) and cation exchange (below it) with the charge there, the pH where your proteins differ most in charge on each resin, and where each one stops on an isoelectric focusing strip. Nothing is uploaded."
status: live
ads: false
order: 4
icon: flask
works: offline
updated: 2026-11-09
related: [protein-calculator, buffer-recipe-calculator, peptide-mass-calculator, hydropathy-plot, protein-assay, chromatography-calculator, gel-densitometry]
sources:
  - "Net charge and pI come from fibub's protein calculator code (Henderson–Hasselbalch for each ionisable group). Checked against pyteomics (electrochem.charge and pI with the same pKa values typed in): pI and charges agree to better than 1 part in a million."
  - "The best-separation scan and the IEF positions are written by fibub (a linear gradient is a straight line from the + end to the − end) and checked against an independent NumPy scan and by hand."
  - "pKa values: fibub's own rounded, approximate values of the kind printed in biochemistry books, not copied from any one table, and editable on the page."
  - "The three example proteins are made up for this tool; they are not real proteins."
flow:
  - { icon: pencil, label: "Paste" }
  - { icon: curve, label: "Charge" }
  - { icon: target, label: "Buffer pH" }
  - { icon: ruler, label: "IEF strip" }
---

## What it does

Ion exchange chromatography and isoelectric focusing (IEF) both sort proteins by charge, and charge depends on pH. Paste your protein sequences and this page works out, for each one:

- **The pI**, the pH where its net charge is zero, and its **charge curve** from about pH 2 to 12, all proteins on one plot.
- **A buffer pH for anion exchange** (Q or DEAE resin). The resin is positive, so the protein must be negative: the buffer goes a set distance above the pI, one pH unit by default.
- **A buffer pH for cation exchange** (S, SP or CM resin), the same distance below the pI, where the protein is positive.
- **The net charge at each suggested pH**, so you can see if it will bind firmly (several charges) or weakly (under 2).
- **For two or more proteins, the best pH to separate them** on each resin, inside the buffer range you choose.
- **An IEF helper:** where each protein stops on a linear pH strip of the range and length you give.

Everything runs in your browser. Your sequences are never uploaded or stored.

Make up the running buffer with the [[buffer-recipe-calculator]], and get the full protein parameters from the [[protein-calculator|protein parameter calculator]].

## How to use it

1. Paste sequences in one-letter codes, with a FASTA header line (starting with `>`) before each protein, or open a FASTA file. Press **Use the example** to try three made-up proteins.
2. Set the **distance from the pI** (1 pH unit is a common start; 0.5 gives weaker binding and gentler conditions) and the **buffer pH range** you are willing to use. Suggestions outside that range are flagged, and the best separation is only searched inside it.
3. Read the table and the charge plot. Below them, with two or more proteins, the page gives the best pH for each resin and a plot of how well the hardest pair is split at every pH.
4. For IEF, set the strip's pH range and length and the smallest gap you can tell apart. The strip picture and table show where each protein focuses, measured from the + end (anode, acidic end).
5. Download the table or the charge curves as CSV, or the whole report as an image, PDF or Word file.

**The pKa values are approximate and editable.** Open "pKa values" to type your own. Folded proteins shift their groups' pKa values, so a real pI can differ from any sequence-based one by a few tenths or more. Treat the results as a starting point and check by experiment.

## How the best separation is found

On an anion exchanger only negative charge holds a protein; on a cation exchanger only positive charge. At each buffer pH the page works out every protein's holding charge (a protein with the wrong sign does not bind and counts as 0), then the smallest difference between any two proteins, the hardest pair to split. The best pH is where that smallest difference is largest. The "good" range is the stretch around it where the difference stays within 90 % of the best.

## Worked example

Press **Use the example** with the default settings (1 pH unit from the pI, buffer pH 4 to 9, strip pH 3 to 11 over 70 mm). The page shows:

| Protein | pI | Anion pH (charge) | Cation pH (charge) |
|---|---|---|---|
| 1. Acidic example | 4.15 | 5.2 (−7.0) | 3.2 (+8.1) |
| 2. Neutral example | 6.91 | 7.9 (−2.4) | 5.9 (+3.4) |
| 3. Basic example | 10.42 | 11.4 (−4.0) | 9.4 (+4.7) |

It flags pH 3.2 and 11.4 and 9.4 as outside the 4 to 9 range: protein 3 is better run on a cation exchanger near pH 9 or lower, and protein 1 on an anion exchanger.

To separate all three, **anion exchange** is best at pH 9.00 (good from 8.85 to 9.00). There protein 1 carries −18.2, protein 2 carries −6.6 and protein 3 is +6.1 and flows through; the hardest pair, 2 and 3, are 6.59 charges apart, and the difference is still rising at the end of the range. **Cation exchange** is best at pH 4.30 (good from 4.05 to 4.45): protein 1 is −1.4 and flows through, protein 2 is +8.8 and protein 3 is +17.6; the hardest pair, 1 and 2, are 8.78 apart.

On the 70 mm IEF strip from pH 3 to 11 (1.14 pH units per cm), protein 1 stops 10.1 mm from the + end, protein 2 at 34.2 mm and protein 3 at 65.0 mm.

## Tips

- If a protein carries less than about 2 charges at the suggested pH, move the buffer further from the pI.
- Check that your protein is stable and soluble at the chosen pH; many proteins precipitate near their pI.
- Pick a buffer whose own pKa is within about 1 unit of the pH you want; the buffer recipe calculator helps.
- In IEF, a narrow strip (for example pH 4 to 7) spreads close pI values further apart.

## FAQ

**Why does my pI differ from another tool's?** Each tool uses its own pKa set. Type the other tool's values under "pKa values" and the results will match.

**Are disulfide bonds counted?** No: every cysteine is counted as free. Cysteine's pKa is high, so this mostly affects the charge above about pH 8.

**Does the page consider protein size or charge spread?** No. Charge here is per molecule. Two proteins with the same net charge can still separate on a gradient because of where their charges sit.

**Is anything saved?** No. Nothing is stored or sent anywhere.
