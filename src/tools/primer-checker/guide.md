---
name: Primer checker
num: 167
shelf: science
section: molecular-biology
title: "PCR primer checker: Tm, GC content, GC clamp, hairpins, primer-dimers and product size on a template"
summary: "Check a PCR primer pair before you order it. Get the length, GC %, melting temperature by three simple formulas, the G/C clamp, runs and repeats, the longest hairpin, self- and cross-dimers with a picture of the worst one, and, with a template, every binding site and the product size."
status: live
ads: true
order: 15
icon: check
works: offline
updated: 2026-11-09
related: [pcr-master-mix, sequence-tools, ligation-calculator, qpcr-analyser]
sources:
  - "Tm by the Wallace rule (2 °C per A/T, 4 °C per G/C), the basic formula 64.9 + 41 × (G+C − 16.4) ÷ N and the sodium-adjusted formula 81.5 + 16.6 log₁₀[Na⁺] + 0.41 × %GC − 675 ÷ N: textbook formulas, checked against Biopython 1.88 MeltingTemp. No nearest-neighbour parameter tables are used."
  - "Hairpin, dimer, run and clamp checks and template search written by fibub, checked in the tests against an independent brute-force Python search. The ranges are common rules of thumb, not a standard."
  - "The example primers and template are random made-up sequence."
flow:
  - { icon: pencil, label: "Primers" }
  - { icon: search, label: "Checks" }
  - { icon: link, label: "Dimers" }
  - { icon: ruler, label: "Product" }
---

## What it does

A primer that folds on itself, sticks to its partner or binds in the wrong place wastes a PCR run. This page checks a primer or a pair against the usual design rules, entirely in your browser:

- **Basics:** length, GC % and the number of G or C bases among the last five at the 3′ end (the "GC clamp").
- **Melting temperature (Tm)** by three simple formulas: the basic GC formula (used for the summary), a sodium-adjusted GC formula, and the Wallace rule for short oligos. All three ignore the order of the bases, so treat them as estimates.
- **Runs and repeats:** the longest run of one base and the longest dinucleotide repeat (such as ATATAT).
- **Hairpins:** the longest stem of paired bases that closes a loop of at least three.
- **Primer-dimers:** for each primer with itself and for the pair, the longest stretch of complementary bases, and how much of it sits at a 3′ end, where the polymerase can extend it. The worst one is drawn.
- **Template:** paste the target DNA to see where each primer binds (both strands, with up to two mismatches but a matching 3′ end), the products and their sizes, and any extra sites.

Make up the reaction with the [[pcr-master-mix]], and see where the primers sit on the [[plasmid-map]].

## How to use it

1. **Primers.** Type or paste each one 5′ to 3′, exactly as you would order it. The reverse primer is optional.
2. **Sodium.** Only the salt-adjusted Tm uses it; 50 mM is a common PCR buffer value.
3. **Template.** Optional: paste the sequence (FASTA headers are skipped), choose how many mismatches to allow and the largest product to report.
4. **Read the checks.** Anything outside the usual ranges is marked "(check)" and listed at the top.

## Worked example

The made-up example pair is ACTCACATCGGTGTCACCTG and TACTTCACGGCGTGTGCATC. Both are 20 nt with 55 % GC, so the basic formula gives **53.8 °C** for each (62 °C by the Wallace rule, 48.7 °C salt-adjusted at 50 mM). Each ends with 3 G or C in its last five bases, has no run longer than 2, a hairpin stem of only 3 bp, and dimers of at most 4 bp with no more than 2 at a 3′ end. On the 1,500-base made-up template the forward primer binds at 201–220 and the reverse at 901–920 on the other strand, giving **one 720 bp product**: "Pair looks good: Tm 53.8 / 53.8 °C, 720 bp product".

## Good to know

- Formula Tm values differ from nearest-neighbour calculators by several degrees. For the annealing temperature, use your polymerase supplier's calculator, then fine-tune with a gradient.
- A dimer that ends at a 3′ end matters far more than one in the middle.
- The template search is exact apart from the mismatches you allow; it does not search a whole genome.

## FAQ

**Why is my reverse primer not found?** Type it 5′ to 3′ as ordered; the tool looks for its reverse complement on the top strand itself.

**Can I check degenerate primers?** Not yet: only A, C, G and T.

**Is my sequence uploaded?** No. Everything runs in your browser.
