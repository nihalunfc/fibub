---
title: "PCR primer checker: test Tm, GC clamp, hairpins and dimers before you order"
summary: "What each primer design rule means, how the three melting temperature formulas work, how to check a pair on a template, and a worked example with a primer that fails."
tools: [primer-checker, pcr-master-mix, sequence-tools, plasmid-map]
updated: 2026-11-10
sources:
  - "Wallace rule, basic GC formula and sodium-adjusted GC formula for melting temperature: standard molecular biology textbook formulas."
  - "Design ranges (18 to 30 nt, 40 to 60 % GC, 1 to 3 G or C in the last 5 bases, no runs of 4, Tm within 5 °C): common rules of thumb, not a standard."
  - "The primers and the 400-base template in the example are random made-up sequence."
---

The primer checker looks at one PCR primer, or a forward and reverse pair, and tells you whether it breaks any of the usual design rules: length, GC content, melting temperature, the bases at its 3′ end, runs of one letter, hairpins and primer-dimers. Paste a template too and it finds where each primer lands and how long the product will be. It is for students planning a first PCR and anyone checking an order sheet. Find a target region first with the [[sequence-tools]], see where the primers fall on your vector in the [[plasmid-map]], and when the pair passes, make up the reaction with the [[pcr-master-mix]].

## What it is

**PCR** (the polymerase chain reaction) copies one stretch of DNA millions of times. Two short single strands, the **primers**, stick to its two ends, and the polymerase enzyme extends each from its **3′ end**, where new bases are added.

**Melting temperature (Tm)** is the temperature at which half the primer has let go of its target. The tool gives three estimates. With N the length in bases and G+C the number of G and C bases:

- Wallace rule: Tm = 2 × (A+T) + 4 × (G+C), meant for very short oligos.
- Basic formula: Tm = 64.9 + 41 × (G+C − 16.4) ÷ N. This is the one in the summary.
- Salt-adjusted: Tm = 81.5 + 16.6 × log₁₀[Na⁺] + 0.41 × %GC − 675 ÷ N, with sodium in mol/L.

All three ignore the order of the bases, so they are only a guide.

The other checks:

- **GC clamp**: G or C bases among the last five at the 3′ end. One to three help the end grip; more can make it stick in the wrong places.
- **Runs and repeats**: four of one base, or a repeated pair like TGTG, can make the primer slip.
- **Hairpin**: the primer folding back and pairing with itself around a loop.
- **Primer-dimer**: two primers pairing with each other. The dangerous kind ends at a 3′ end, because the polymerase can extend it into a short junk product.

## How to use it

1. Type the **Forward primer** 5′ to 3′, exactly as it will be ordered. Add the **Reverse primer** the same way, or leave it blank to check one primer.
2. Set **Sodium (mM)**. Only the salt-adjusted Tm uses it.
3. To test binding, paste the target DNA into **Template**, choose **Mismatches allowed** (0, 1 or 2) and the **Largest product (bp)** to report.
4. Read the line at the top. Anything outside the usual range is counted there and marked "(check)" in the table.
5. Look at the **Strongest primer-dimer** drawing and, with a template, the list of sites and products.

## A worked example

Take a made-up pair:

- Forward: `CTGTCTTGACCGTGACGCAT`
- Reverse: `CGGGCTTGTGGTTACAGCAT`

Both are **20 nt** with **11 G or C**, so GC is 11 ÷ 20 = **55 %**.

**Basic Tm:** 64.9 + 41 × (11 − 16.4) ÷ 20 = 64.9 − 11.07 = **53.8 °C** for each.

**Wallace:** 2 × 9 + 4 × 11 = **62 °C**. **Salt-adjusted at 50 mM:** 81.5 + 16.6 × log₁₀(0.05) + 0.41 × 55 − 675 ÷ 20 = 81.5 − 21.60 + 22.55 − 33.75 = **48.7 °C**. The formulas disagree by 13 °C, which is why they are only estimates.

**Other checks.** The 3′ clamps are 3 G or C (CGCAT) and 2 (AGCAT). The longest run is GGG, below the limit of four. Hairpin stems are 3 bp, self-dimers 3 bp with 2 at the 3′ end, and the cross-dimer 4 bp with 2 at a 3′ end. Nothing is flagged. The suggested annealing start is 53.8 − 5 = **48.8 °C**.

**On a template.** Paste this made-up 400-base template:

```
CAGTGAGCGTACGCATTGTCCACATGCTGAAGCGCTGCATCTGTCTTGACCGTGACGCATATGCAGACGCGAATCAGTTAGAATGCCTAAAGTAGCGTCTTCTAACAGTACAAAACCAGCTATCGAAGATCACCCCGGCTCTTAAGGCCGGGCCTCCGTTTCCACTCTCCCTTCTATAATGCTATAGAGTCGGTGCCTTCAACTAAATATGTGGTTGGGGCCGGCCAGCCGTCGTTTCACAAGTTAGTAACATGGTATGGGCGCATTGCTAGAGGGAGTATGTCTGAGAAACAGACGGCCTCGATTGGCTGACCCTTGAGAAGATCCATGATGCTGTAACCACAAGCCCGATGGCTGTCATCCGACCACCCGGGAGACCTCCGAAAACACGACCACCAAA
```

The forward primer binds at **41–60** on the + strand and the reverse at **331–350** on the − strand, both with no mismatches. The product runs from base 41 to 350: 350 − 41 + 1 = **310 bp**, the only one. The top line reads "Pair looks good: Tm 53.8 / 53.8 °C, 310 bp product".

**Now break it.** Add GC to the end of the forward primer: `CTGTCTTGACCGTGACGCATGC`. It is now 22 nt with 13 G or C (59.1 %), and its basic Tm rises to **58.6 °C**. Its last six bases, GCATGC, read the same on both strands, so two copies pair with each other right at their 3′ ends: a **6 bp self-dimer, all 6 at the 3′ end**, which is flagged. Keep the original.

## Where it is used

- **Cloning and genotyping.** Every PCR starts with a primer pair, and a quick check saves a re-order.
- **Teaching labs.** Change one base and watch a flag appear.
- **qPCR assays.** Short products and dimer-free primers matter even more when a dye reads every double strand; analyse the run afterwards with the [[qpcr-analyser]].
- **Reusing published primers.** Paste them with your own template to confirm they still match your strain or construct.

## Common mistakes

- **Typing the reverse primer as its complement.** Enter it exactly as ordered, 5′ to 3′. The tool works out which strand it binds.
- **Taking the formula Tm as the annealing temperature.** Start from your polymerase supplier's calculator and fine-tune with a gradient PCR.
- **Ignoring where a dimer sits.** A 4 bp match in the middle is rarely a problem; 3 bp at the 3′ end can be.
- **Allowing too few mismatches when checking specificity.** With 0 allowed you only see perfect sites. Try 2 to catch near-matches that might also prime.

## Questions people ask

**What product size should I aim for?** For ordinary PCR, a few hundred to a couple of thousand bp is easy to see on a gel; qPCR products are usually much shorter, around 70 to 200 bp.

**Why does the tool demand a matching 3′ end?** The polymerase starts there. A mismatch near the 3′ end stops extension far more than one near the 5′ end, so the search treats the last three bases as fixed.
