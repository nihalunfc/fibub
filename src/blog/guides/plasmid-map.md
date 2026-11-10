---
title: "Plasmid map: draw, edit and read a circular DNA map"
summary: "How a plasmid map shows features, strands and single-cut enzyme sites, how to make one from a GenBank or FASTA file, and a worked example with a site that crosses base 1."
tools: [plasmid-map, restriction-digest, primer-checker, ligation-calculator]
updated: 2026-11-10
sources:
  - "GenBank feature table conventions (join, complement, 1-based positions): the public GenBank flat file layout."
  - "Recognition sequences and cut points of EcoRI, BamHI and HindIII: standard textbook facts."
  - "The 120-base example sequence is made up for this guide. It is not a real vector."
---

The plasmid map tool takes the text of a plasmid, as a GenBank file, FASTA or bare letters, and draws it as a ring (or a straight line) with every feature as an arrow and the enzymes that cut only once marked around the edge. You can rename and recolour features, add your own, move base 1 to a new place, and save the result as a picture or as a new GenBank file. It suits students and anyone planning a cloning step. To plan the cut itself, go on to the [[restriction-digest]]; to design primers on the same sequence, use the [[primer-checker]]; and to work out insert and vector amounts for joining the pieces, the [[ligation-calculator]].

## What it is

A **plasmid** is a small ring of DNA that bacteria copy apart from their chromosome; labs use plasmids as carriers (vectors) for genes. A **map** draws it to scale, with labels for the parts that matter:

- **Features**: named stretches such as a gene (CDS, the coding sequence), a promoter that switches a gene on, a terminator that ends it, or the origin of replication (ori) where copying begins.
- **Strand**: DNA has two strands that run in opposite directions. A feature on the top strand reads clockwise, one on the bottom strand reads anticlockwise, and the arrow shows which.
- **Single cutters**: a restriction enzyme cuts DNA wherever it finds its short recognition sequence. An enzyme that finds its sequence exactly once opens the ring at one point, which is what you want when you insert a new piece.

Length is in **bp** (base pairs). A ring has no real start, so base 1 is only a convention, and a feature that runs past the last base into base 1 is written in GenBank as two pieces, such as `join(118..120,1..3)`.

A cut position is the number of bases before the cut on the top strand.

## How to use it

1. Paste a GenBank record, FASTA or plain sequence into the box, or press **Open a GenBank or FASTA file**. Only the first record is read, and FASTA arrives with no features.
2. Choose the **Shape** (circular or linear) and what the **Enzyme sites** box shows: single cutters, all sites of the 12 classic enzymes, or none.
3. Read the line above the map and the facts below it: length, GC content, which enzymes cut once and where, and which do not cut at all.
4. In **Features**, change a name, type, start, end, strand or colour, untick **Show** to hide one, press **Remove** to delete it, or press **Add a feature** for a new one.
5. Under **Move the origin**, type the base that should become base 1 and press **Move origin**.
6. Press **Download map (SVG)** or **Download GenBank**, or use the image, PDF and Word downloads for a report with a feature table.

## A worked example

Here is a made-up 120 bp ring, pasted as FASTA:

```
>toy1
TCCGCTCCGTGAGTCTAGGATCTTGCGGGGGAATTCCATCAAATTCAAGGCCACCAAGCT
AAGCTTGTTGACAAACATCGGCAAGAGATCAAGCTTCGTCTTGTCGATGGCGTCGGAGGA
```

**What the map reports.** The line above the map reads toy1: 120 bp, circular, 0 features, 2 single cutters. The sequence has 62 G or C bases, so GC is 62 ÷ 120 = **51.7 %**.

**Single cutters.** EcoRI cuts once, at **31**. BamHI also cuts once, at **118**, which is easy to miss: its site GGATCC is split across the join, with GGA at bases 118 to 120 and TCC at bases 1 to 3. Switch the shape to linear and BamHI disappears, because a straight molecule has no join to read across.

**Two-cutters.** Switch **Enzyme sites** to all sites. HindIII (AAGCTT) appears twice, at **61** and **91**. Cutting with it would drop out a 30 bp piece, so it cannot open the ring at one point. The other nine enzymes do not cut.

**Mark the BamHI site.** Press **Add a feature**, name it "BamHI site", and set start **118** and end **3**. A start larger than the end is allowed on a circular plasmid, and the location becomes join(118..120,1..3), 6 bp.

**Move the origin.** Type **118** and press **Move origin**. The sequence now begins GGATCC, the BamHI feature becomes one piece at **1..6**, and every cut shifts by 3: BamHI at **1**, EcoRI at **34**, HindIII at **64** and **94**. The ring itself is unchanged; only the numbering moved.

## Where it is used

- **Cloning plans.** The map shows which single cutters sit where you want an insert, and which would cut inside a gene you need.
- **Teaching, notebooks and theses.** A labelled ring explains a construct better than letters, and the SVG stays sharp at any size.
- **Other circular DNA.** Mitochondrial and many viral genomes are rings too; for large ones, hide most features or use the linear view.

## Common mistakes

- **Reading a linear map for a ring.** If the shape is wrong, sites across the join vanish or appear. Check the shape before you trust the single-cutter list.
- **Forgetting that FASTA has no features.** A FASTA file gives a bare ring. Add features by hand, or start from GenBank.
- **Editing the text box after editing features.** Changing the pasted text starts again from it. Download your GenBank first.
- **Mixing up cut position and site start.** The number shown is bases before the cut, not where the recognition sequence begins. For EcoRI and BamHI, which cut after the first base, the two numbers match; for SmaI (CCC^GGG) the cut number is two more than the site's first base.

## Questions people ask

**Why does an enzyme that cuts once still fail to open my plasmid?** Some enzymes are blocked when their site is methylated (chemically marked) by the host bacterium. The map only reads letters, so check the enzyme supplier's notes.

**Can I show sites for an enzyme that is not in the list?** Not on the map. The [[restriction-digest]] takes your own enzymes and draws the expected gel.
