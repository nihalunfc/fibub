---
name: Gene network viewer
num: 987
shelf: science
section: systems-biology
title: "Gene regulatory network viewer: open SIF or GraphML, see activation and repression, degrees and feed-forward loops"
summary: "Open or paste a gene regulatory network as SIF or GraphML and see it drawn with a force-directed layout, activating edges as arrows and repressing edges as bars, with in- and out-degree for every gene, connected parts, autoregulation, two-gene feedback loops and feed-forward loops sorted into coherent and incoherent. Your file stays on your device."
status: live
ads: false
order: 2
icon: link
works: offline
updated: 2026-11-09
related: [pathway-ode-builder]
sources:
  - "Simple Interaction Format (SIF) and GraphML as used by Cytoscape and other tools; force-directed drawing after Fruchterman, T. M. J. and Reingold, E. M. (1991), Software: Practice and Experience 21, 1129 to 1164; network motifs and the coherent/incoherent feed-forward loop classes after Mangan, S. and Alon, U. (2003), PNAS 100, 11980 to 11985: used as methods, written by fibub."
  - "Checked against NetworkX 3 (degrees, density, weakly connected components, GraphML written by write_graphml, and feed-forward loops counted with DiGraphMatcher) on the example and on a random 40-gene network. The example network is made up."
flow:
  - { icon: file, label: "Open" }
  - { icon: link, label: "Network" }
  - { icon: sigma, label: "Degrees" }
  - { icon: target, label: "Motifs" }
---

## What it does

A gene regulatory network lists which genes (usually transcription factors) switch which other genes on or off. As a list it is hard to read; as a picture with a few numbers, its structure jumps out: the hubs that regulate many genes, the genes that switch themselves off, and the small recurring wiring patterns called **network motifs**.

This page reads a network in **SIF** or **GraphML**, draws it, and works out:

- **In-degree and out-degree** of every gene: how many regulators it has and how many genes it regulates, split into activation and repression.
- **Density**, the share of all possible links that exist, and the **connected parts** of the network.
- **Autoregulation**: genes that regulate themselves, positive or negative.
- **Two-gene feedback loops**: pairs that regulate each other.
- **Feed-forward loops**: X regulates Y, and both regulate Z. They are **coherent** when the direct path has the same sign as the path through Y, and **incoherent** when the signs differ. The best-known kinds are named: **C1** (all activation, a sign-sensitive delay) and **I1** (X activates Y and Z, Y represses Z, a pulse generator).

Nothing is uploaded; the file is read and drawn in your browser.

## How to use it

1. Paste a network, or press **Open a file** to read a .sif or .graphml file exported from Cytoscape, yEd, NetworkX or igraph. In SIF each line is `source interaction target`, with more targets allowed on one line; a name alone is a gene with no links.
2. Choose the **Layout**: force-directed (linked genes close together) or a circle. **New layout** tries another start if genes overlap.
3. **Highlight** feed-forward loops or feedback, so the rest of the network fades.
4. Size nodes **by number of links** or keep them all the same, and switch **gene names** on or off.
5. Read the facts and tables, download the degrees and the motifs as CSV, or the report as an image, PDF or Word file.

## Worked example

The example is a made-up network of 13 genes and 17 interactions: 13 activating and 4 repressing. MasterA, switched on by Sensor, regulates TF1, TF2, GeneX, GeneY and GeneZ; TF3 represses itself, TF4 activates itself, and TF4 and TF5 form a negative two-gene loop. Orphan has no links.

The page finds a density of 0.109, three parts (9, 3 and 1 genes) and **4 feed-forward loops**: MasterA → TF1 → GeneX and MasterA → TF1 → GeneY are coherent C1, MasterA → TF2 ⊣ GeneY is incoherent I1, and MasterA → TF2 → GeneZ with MasterA repressing GeneZ is incoherent too. MasterA is the biggest hub, with 6 links (5 out, 1 in). NetworkX gives the same degrees, parts and loops.

## Tips

- Interaction words are matched loosely: activates, activation, induces, stimulates, + and 1 are activation; represses, inhibits, suppresses, −, -1 and -| are repression. Others (binds, pp) are drawn as plain lines and count as unsigned.
- A repeated line for the same pair of genes is counted once; the facts say how many were left out.
- Big networks are drawn on a circle above 800 genes; the numbers are worked out for up to 3,000.

## FAQ

**Are loops counted once?** Yes. Each feed-forward loop is one X, Y, Z triple; extra links between the three (such as Z regulating X) do not hide it.

**Why does the picture change with New layout?** Force-directed layouts start from random positions. The same seed always gives the same picture, so a download matches the screen.

**Does my file leave the device?** No. It is read with the browser's own file reader, and the page works offline. For study and planning, not a substitute for professional judgement.
