---
name: Plasmid map
num: 170
shelf: science
code: T170
section: molecular-biology
title: "Plasmid map"
summary: "Open or paste a GenBank or FASTA file and get a clean circular or linear plasmid map with feature arrows, single-cutter sites and a size ruler. Rename, recolour, move or add features, move the origin, and download the map as SVG, PNG or PDF and the plasmid as GenBank."
status: live
ads: true
order: 18
icon: orbit
works: offline
updated: 2026-11-09
related: [restriction-digest, sequence-tools, primer-checker, ligation-calculator, gel-band-sizer]
sources:
  - "GenBank reader and writer written by fibub from the public GenBank flat file layout. Feature positions, strands, joined pieces and qualifiers are checked in the tests against Biopython 1.88 SeqIO."
  - "Recognition sites of the 12 built-in enzymes are textbook facts, shared with the restriction digest simulator. No enzyme database or supplier catalogue is copied."
  - "The example plasmid pDemo1 is random made-up sequence with made-up features. It is not a real vector."
flow:
  - { icon: file, label: "Open" }
  - { icon: orbit, label: "Map" }
  - { icon: pencil, label: "Edit" }
  - { icon: download, label: "Download" }
---

## What it does

A plasmid map shows at a glance where the genes, promoters, origin and handy cut sites sit on a circle of DNA. This page draws one from your own file, in your browser:

- **Reads GenBank files**, the format most plasmid editors and sequence databases export, including features in several pieces (join), on the reverse strand (complement), crossing base 1, and with partial ends (< and >). FASTA or plain sequence also works, with no features.
- **Circular or linear map.** Features become arrows that point along their strand. Overlapping features stack on inner tracks, labels are spread apart so they don't overlap, and a ruler shows positions.
- **Enzyme sites.** Shows where the 12 classic enzymes cut once (the usual choice for cloning), all their sites, or none.
- **Edit.** Rename, retype, recolour, move or hide any feature, add new ones, and move the origin so any base becomes base 1.
- **Download.** The map as SVG (for posters and papers, sharp at any size) or in a PNG, PDF or Word report with a feature table, and the edited plasmid as a GenBank file.

To see which enzymes cut it and where, use the [[restriction-digest]]; to design primers on it, the [[primer-checker]].

## How to use it

1. **Open.** Open a .gb or .gbk file, or paste the text. The first record is used.
2. **Map.** Choose circular or linear and which enzyme sites to show.
3. **Edit.** Change features in the list under the map. On a circular plasmid, a start larger than the end makes a feature that crosses base 1.
4. **Download.** Save the map and the GenBank file.

## Worked example

The example, pDemo1, is 3,000 bp of random made-up sequence with seven made-up features: a promoter, a forward primer site, a forward gene called reporterX (201..1106), a terminator, an origin (1301..1889), a reverse-strand marker gene (complement(1981..2841)) and a cloning site that crosses base 1, join(2961..3000,1..40). A full-length source feature is listed but hidden.

Seven of the 12 classic enzymes cut it exactly once, among them EcoRV at 319, BamHI at 1,151 and HindIII at 2,211, and these are the enzymes you would try first to open this plasmid. XhoI, KpnI and NotI do not cut it at all. Type 1301 into **Move the origin** and the origin feature now starts at base 1, every other feature is renumbered, and the cloning site becomes one piece again because it no longer crosses base 1.

## Tips

- Colours are only for the map. The GenBank download keeps names, types, positions and notes, and other programs use their own colours.
- Features with several pieces (such as a gene with introns) keep their pieces when you edit names and colours. Change their pieces in the GenBank text.
- Large records such as whole bacterial genomes open, but a map with hundreds of features is crowded. Hide the ones you don't need, or use the linear view.

## FAQ

**Is my sequence uploaded?** No. The file is read and drawn in this page and never leaves your device.

**Why is a feature missing?** Features whose location points into another record (such as AB000001.1:1..50) cannot be drawn and are left out, with a note.

**Can I open SnapGene .dna files?** Not directly. Export GenBank from your editor first.
