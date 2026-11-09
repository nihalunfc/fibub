---
name: Tree builder
num: 308
shelf: science
section: evolutionary-biology-and-phylogenetics
title: "Build a phylogenetic tree online: neighbour joining, UPGMA and maximum parsimony from a DNA alignment"
summary: "Paste aligned DNA sequences (FASTA) and build a tree by neighbour joining or UPGMA on p, Jukes-Cantor or Kimura 2-parameter distances, or by maximum parsimony with an exact branch and bound search. See the distances, root the tree and download it as Newick. Runs in your browser."
status: live
ads: true
order: 308
icon: chart
works: offline
updated: 2026-11-09
related: [tree-viewer, sequence-alignment, sequence-tools, kmer-counter, molecular-clock, dnds-calculator, coalescent-simulator]
sources:
  - "Methods: Jukes and Cantor (1969); Kimura (1980); Sokal and Michener (1958) for UPGMA; Saitou and Nei (1987) with Studier and Keppler (1988) for neighbour joining; Fitch (1971) for parsimony scores; Hendy and Penny (1982) for branch and bound. Textbook: Felsenstein, Inferring Phylogenies (2004)."
  - "Code written by fibub. Checked in the tests against an independent Python version of the three distances, Biopython 1.88 (identity distances, neighbour joining tip-to-tip lengths, and its ParsimonyScorer run on all 10,395 unrooted trees of the 8-sequence example to confirm the best score and that it is unique) and SciPy 1.18 average linkage for UPGMA."
  - "The example alignment is made up (simulated on an invented tree)."
flow:
  - { icon: file, label: "Alignment" }
  - { icon: sigma, label: "Distances" }
  - { icon: chart, label: "Tree" }
  - { icon: download, label: "Newick" }
---

## What it does

A phylogenetic tree shows how a set of sequences are related: which share a more recent common ancestor, and (with branch lengths) how much change happened along each branch. This tool builds one from a small alignment of DNA or RNA sequences, the way it is taught in evolution and bioinformatics courses, using the three classic methods:

- **Neighbour joining (NJ)**: a fast distance method that allows each branch its own rate. It gives an unrooted tree, which you root on an outgroup or at the midpoint.
- **UPGMA**: a distance method that assumes a molecular clock (all lineages change at the same rate), so the tree is rooted and every tip ends at the same line.
- **Maximum parsimony (MP)**: the tree that needs the fewest base changes. With up to 12 sequences, an exact **branch and bound** search guarantees the best tree and lists any ties; above that a fast search (stepwise addition, then subtree pruning and regrafting) finds a good tree.

You see the tree, the distance matrix, the Newick text, and can download them. Nothing is uploaded.

Line up your sequences first with [[sequence-alignment|pairwise sequence alignment]], then root and style the tree in the [[tree-viewer|phylogenetic tree viewer]] and date its splits with the [[molecular-clock|molecular clock calculator]].

## How to use it

1. Paste your **aligned** sequences in FASTA format (a line `>name`, then the sequence), or open a FASTA file. All sequences must have the same length; use `-` for gaps. If they are not aligned yet, align them first. The tree is only as good as the alignment.
2. Pick the **method**.
3. For NJ and UPGMA, pick the **distance**: the **p-distance** is the share of sites that differ; **Jukes-Cantor** corrects it for sites that changed more than once; **Kimura 2-parameter** also lets transitions (A↔G, C↔T) happen more often than transversions, which is usual in real DNA.
4. **Gaps and N**: pairwise deletion skips a column only for the pair of sequences where one has a gap or N; complete deletion drops that column for everyone, so all distances use the same sites.
5. **Root**: the midpoint (the middle of the longest tip-to-tip path) or an outgroup, a sequence you know branched off first. Parsimony trees are rooted on an outgroup.
6. Download the tree as **Newick** (opens in the phylogenetic tree viewer and other tree programs), the distances as CSV, or the report as an image, PDF or Word file.

## Worked example

The made-up example has 8 sequences of 80 bases, with a gap in Epsilon and an N in Theta.

- **Distances**: Alpha and Theta differ at 21 of the 79 sites they both have bases at (9 transitions, 12 transversions): p = 0.266, Jukes-Cantor 0.328, Kimura 2-parameter 0.329.
- **Neighbour joining** on K2P distances, midpoint rooted, groups Alpha with Beta, Gamma with Delta, and Epsilon with Zeta, with Eta and then Theta next to them. The total branch length is 0.7362. One branch comes out very slightly negative (NJ can do that); it is drawn as 0.
- **UPGMA** on K2P gives a rooted tree with the root 0.204 substitutions per site above the tips.
- **Maximum parsimony**: 42 sites vary and 26 are parsimony-informative. The exact search finds a single best tree of 52 changes among the 10,395 possible unrooted trees: (Alpha, Beta, ((Gamma, Delta), (((Epsilon, Zeta), Eta), Theta))).

## Tips

- Use a few hundred sites or more for real work: with short alignments many trees are nearly as good, and the parsimony search may report ties.
- Very distant sequences can make the Jukes-Cantor or Kimura correction undefined (more than about 75 % or so different). The page tells you which pair; check the alignment or use the p-distance.
- These methods give one tree but no measure of support. For publication, use bootstrapping and model-based methods (maximum likelihood or Bayesian) in dedicated software; this tool is for learning, quick looks and teaching.

## Frequently asked questions

**Can I use protein sequences?** Not yet: the distances and parsimony here are for DNA and RNA. U is read as T.

**How are gaps and ambiguity codes handled?** For distances, any site where either sequence has a gap, N or other ambiguity code is skipped. For parsimony, gaps and N mean "any base" (missing data) and ambiguity codes such as R or Y mean "one of these bases".

**Why is my NJ tree different from UPGMA?** UPGMA assumes every lineage changes at the same rate. When rates differ, it can join the wrong pairs; NJ does not make that assumption.

**How big can the alignment be?** Up to 200 sequences and 20,000 columns for the distance methods, and 40 sequences for parsimony (exact up to 12).

**Is my data sent anywhere?** No. Everything runs in your browser and works offline once the page has loaded.
