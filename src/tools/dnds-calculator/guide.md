---
name: dN/dS calculator
num: 311
shelf: science
code: T226
section: evolutionary-biology-and-phylogenetics
title: "dN/dS calculator (Ka/Ks): Nei-Gojobori method with Jukes-Cantor correction for two coding sequences"
summary: "Paste two aligned protein-coding DNA sequences and get dN, dS and dN/dS (Ka/Ks) by the Nei-Gojobori method with the Jukes-Cantor correction: synonymous and nonsynonymous sites and differences, standard errors, a Z test for selection and a codon-by-codon table. Runs in your browser."
status: live
ads: true
order: 311
icon: sigma
works: offline
updated: 2026-11-09
related: [sequence-alignment, sequence-tools, protein-calculator, tree-viewer, molecular-clock, tree-builder, wright-fisher-simulator]
sources:
  - "Method: Nei and Gojobori (1986), Mol. Biol. Evol. 3: 418-426; Jukes and Cantor (1969) correction; variances and the Z test as in Nei and Kumar, Molecular Evolution and Phylogenetics (2000). Standard genetic code (NCBI translation table 1)."
  - "Code written by fibub. Checked in the tests against Biopython 1.88 (Bio.codonalign cal_dn_ds with method NG86: sites, differences, dN and dS agree to 1e-15 on the example) and Python with SciPy 1.18 for the standard errors and the Z test. Unlike Biopython, and as in the original method, pathways through a stop codon are left out; that case is checked by hand."
  - "The example sequences are made up (simulated)."
flow:
  - { icon: file, label: "Two genes" }
  - { icon: table, label: "Codons" }
  - { icon: sigma, label: "dN/dS" }
  - { icon: download, label: "Report" }
---

## What it does

When a gene is copied down the generations, some mutations change the protein (**nonsynonymous**) and some do not, because the genetic code has several codons for most amino acids (**synonymous**). Comparing how often each kind of change has happened between two species tells you how natural selection has treated the protein:

- **dN/dS < 1**: amino-acid changes have been removed more often than silent ones. This is **purifying (negative) selection**, typical of most genes.
- **dN/dS ≈ 1**: both kinds accumulate at the same rate, as expected for a **neutral** sequence such as a pseudogene.
- **dN/dS > 1**: amino-acid changes have been favoured: **positive (adaptive) selection**.

This calculator works out **dN** (nonsynonymous substitutions per nonsynonymous site) and **dS** (synonymous substitutions per synonymous site) for two coding sequences by the classic **Nei-Gojobori (1986)** method, with the **Jukes-Cantor** correction for sites that changed more than once. The ratio is also called **Ka/Ks** or **ω**. Nothing is uploaded.

Align the coding sequences first with [[sequence-alignment|pairwise sequence alignment]], and put the genes on a tree with the [[tree-builder]].

## How to use it

1. Paste two **aligned** coding sequences in FASTA format (or open a FASTA file). They must be **in frame from the first base** and have the same length; any gaps must cover whole codons. The usual way to get this is to align the proteins and then thread the DNA onto them.
2. A stop codon at the end is fine and is skipped. A stop codon inside the gene means the frame is wrong, and the page will say so.
3. Pick the **correction**: Jukes-Cantor gives dN and dS; "None" gives the raw proportions pN and pS.
4. Read the result, and download the codon table (CSV) or the report as an image, PDF or Word file.

## How the method works

- **Sites**: each codon has 3 positions, and each position can mutate to 3 other bases. The share of those 9 changes that keep the amino acid is the codon's number of **synonymous sites** (changes to a stop codon count as nonsynonymous). For example TTA (Leu) has 2/3 of a synonymous site and CTG (Leu) has 4/3. S is the total over the gene, averaged over the two sequences; N = 3 × codons − S.
- **Differences**: a codon that differs at one position is a synonymous or a nonsynonymous difference. A codon that differs at two or three positions could have changed in 2 or 6 orders; each order is counted and the results averaged, leaving out orders that pass through a stop codon.
- **pS = Sd / S** and **pN = Nd / N**, then **d = −¾ ln(1 − 4p/3)** for each.
- The **standard errors** use Var(d) = p(1 − p) / [L (1 − 4p/3)²], and the **Z test** compares dN with dS.

## Worked example

The made-up example is a gene of 60 codons plus a stop, from two related species.

- 60 codons are compared (the final stop is skipped). S = 45.33 synonymous and N = 134.67 nonsynonymous sites.
- 17 codons differ, giving Sd = 14.5 and Nd = 4.5 (codon 44, ACA → AGC, Thr → Ser, differs at two positions and scores 0.5 synonymous and 1.5 nonsynonymous).
- pS = 0.3199 and pN = 0.0334, so **dS = 0.4170 ± 0.1208** and **dN = 0.0342 ± 0.0162**.
- **dN/dS = 0.082**. The Z test gives Z = −3.14, p = 0.002: strong purifying selection, as expected for most working genes.

## Tips and limits

- dN/dS averaged over a whole gene is a blunt tool: positive selection on a few codons is usually swamped by purifying selection on the rest. The running-total chart helps you spot regions with many amino-acid changes.
- If dS is above about 1.5, synonymous sites are saturated and dS is underestimated, so the ratio is unreliable. Compare closer relatives.
- Very close sequences (few differences) give large uncertainties, and dS = 0 makes the ratio infinite.
- Nei-Gojobori treats transitions and transversions alike and ignores codon usage bias. Methods that model these (such as Yang and Nielsen 2000, or codon models in PAML) can give somewhat different values.

## Frequently asked questions

**Is dN/dS the same as Ka/Ks?** Yes, they are two names for the same ratio.

**Why do my numbers differ a little from another program?** Programs differ in how they handle stop codons in pathways, gaps and ambiguous bases. This tool follows the original Nei-Gojobori method; Biopython's NG86 gives the same answer whenever no pathway passes through a stop codon.

**Is my data sent anywhere?** No. Everything runs in your browser and keeps working offline once the page has loaded.
