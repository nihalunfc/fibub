---
name: Genetic circuit designer
num: 980
shelf: science
section: synthetic-biology
title: "Genetic circuit designer: draw SBOL Visual style diagrams of promoters, RBS, genes and terminators"
summary: "Type a genetic design as a list of parts and regulatory interactions and get a clean SBOL Visual style diagram with repression and activation arcs, its transcription units, and checks for missing RBSs, promoters and terminators. Download as SVG or PNG."
status: live
ads: true
order: 1
icon: link
works: offline
updated: 2026-11-09
related: [plasmid-map, sequence-tools, restriction-digest, primer-checker]
sources:
  - "Glyph shapes follow the descriptions in the SBOL Visual standard (Synthetic Biology Open Language Visual, sbolstandard.org); fibub draws its own versions of the shapes."
  - "The example is the repressilator design idea (Elowitz, M. B. and Leibler, S. (2000), Nature 403, 335), written with generic part names."
  - "Checked against hand-worked designs: the repressilator, a reverse-strand unit with an operator, and broken designs for each warning."
flow:
  - { icon: pencil, label: "Parts" }
  - { icon: link, label: "Interactions" }
  - { icon: check, label: "Checks" }
  - { icon: download, label: "SVG, PNG" }
---

## What it does

Synthetic biologists draw genetic designs with a shared set of symbols, the **SBOL Visual** glyphs: a bent arrow for a **promoter**, a half circle for a **ribosome binding site** (RBS), a block arrow for a **coding sequence** (CDS), a T for a **terminator**, and so on. This tool turns a plain text list of parts into such a diagram, with lines for **repression** (a flat bar end) and **activation** (an arrow head) between a gene and the promoter it regulates.

It also reads the design like a careful colleague would:

- **Transcription units**: from each promoter along its strand to the first terminator, with the genes in it.
- **Checks**: a gene with no RBS just upstream, a gene no promoter reaches, a promoter with no terminator after it (read-through), an interaction that names a part that is not there, a regulator acting on something that is not a promoter or operator, and duplicate names.

Glyph types: promoter, operator, rbs, cds (or gene), terminator, insulator, ori (origin of replication), spacer and generic.

## How to use it

1. Type the parts in order, as **name:type**, separated by commas or new lines, for example `pTet:promoter, B1:rbs, gfp:cds, T1:terminator`. Put **&lt;** before a part on the reverse strand: `<lacI:cds`.
2. Add interactions on their own lines: `tetR -| pTet` (tetR represses pTet) or `araC -> pBAD` (activates).
3. Or use the **Add a part** and **Add an interaction** boxes.
4. Download the diagram as **SVG** (for papers and slides) or **PNG**, or the whole report as an image, PDF or Word file.

## Worked example

The example is the **repressilator**: three genes, each repressing the next one's promoter, in a ring. The parts are `pLlacO1, rbs1, tetR, T1`, `pLtetO1, rbs2, cI, T2` and `pR, rbs3, lacI, T3`, with `lacI -| pLlacO1`, `tetR -| pLtetO1` and `cI -| pR`. The page shows **12 parts, 3 transcription units, 3 interactions**, three red repression arcs on separate levels so they do not cross, and "No problems found". Delete `rbs2` and the checks report that cI has no ribosome binding site just upstream; delete `T3` and they report that pR reads through to the end.

## Tips

- Names must be unique so interactions point at the right part.
- Operators and spacers between an RBS and its gene are allowed by the checks.
- The SVG uses plain shapes and text, so you can restyle it in any vector editor.

## FAQ

**Is this an official SBOL file?** No: it draws pictures in the SBOL Visual style. It does not write SBOL data files.

**Does it simulate the circuit?** No. The checks catch drawing slips, not biology; a design that passes may still not behave as hoped.
