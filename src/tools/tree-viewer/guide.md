---
name: Phylogenetic tree viewer
num: 177
shelf: science
code: T177
section: evolutionary-biology-and-phylogenetics
title: "Phylogenetic tree viewer: open Newick or NEXUS trees, reroot, colour and download as SVG, in your browser"
summary: "Open a Newick or NEXUS tree file and draw it as a rectangular or circular tree, with branch lengths and support values. Reroot it at the midpoint or on any branch, ladderize, swap branches and colour groups. Download SVG, Newick, tip distances (CSV) or a report. Nothing is uploaded."
status: live
ads: false
order: 1
icon: chart
works: offline
updated: 2026-11-09
related: [sequence-alignment, sequence-tools, kmer-counter, biodiversity-indices]
sources:
  - "Newick and NEXUS reading, rerooting, midpoint rooting, ladderizing and drawing written by fibub. Tip-to-tip distances, total branch length and the root-to-tip distances after midpoint rooting were checked against Biopython's Bio.Phylo on the example and six random trees."
  - "The example tree is made up: 14 invented taxa with invented branch lengths and support values. It is not a published tree."
flow:
  - { icon: file, label: "Open tree" }
  - { icon: sliders, label: "Style" }
  - { icon: target, label: "Reroot" }
  - { icon: download, label: "SVG" }
---

## What it does

A phylogenetic tree shows how sequences, genes or species are related. Programs such as tree-building software save trees as **Newick** text, like `((A:0.1,B:0.2)95:0.05,C:0.3);`, or inside a **NEXUS** file. This tool reads that text and draws the tree, so you can look at it, tidy it up for a figure and save it, without installing anything. The file never leaves your device.

Compare two of the sequences in detail with [[sequence-alignment|pairwise sequence alignment]], or the whole set by word counts with the [[kmer-counter|k-mer counter]].

## How to use it

1. **Open a tree file**, paste the Newick text, or press **Use the example**. If the file holds several trees (for example bootstrap trees, or several trees in a NEXUS TREES block), pick one from the list.
2. Choose **Rectangular** or **Circular**, and the options:
   - **Use branch lengths**: draw branches to scale. Turn it off to draw a cladogram, where only the branching order counts.
   - **Line up tip names**: put every name at the right edge, joined to its tip with a dotted line.
   - **Show support values**: the numbers on branch points, such as bootstrap percentages or posterior probabilities.
   - **Show branch lengths**: write each branch's length under it.
   - **Italic names**: for species names.
   - **Text size** and **Line width** set the look of the drawing and the downloads.
3. Tap a tip or a branch point on the tree (or choose a tip from the list) to pick it. Then you can:
   - **Root here**: put the root on the branch above it, half-way along the branch.
   - **Swap its branches**: flip the order of its branches. The tree means the same thing; only the drawing changes.
   - **Colour this group**: draw it and everything below it in the colour you choose.
4. **Root at the midpoint** puts the root half-way along the longest path between two tips. This is a common choice when there is no outgroup. **Ladderize** sorts the branches so smaller groups come first, which makes big trees easier to read. **Undo all changes** brings back the tree as it was opened.
5. Download the drawing as **SVG** (sharp at any size, editable in Inkscape or Illustrator), the changed tree as **Newick**, the **distances between tips** as a CSV table (up to 1,000 tips), or a report as an image, PDF or Word file.

## Worked example

Press **Use the example**. It is a made-up tree of 14 taxa (Taxon A to Taxon N) with branch lengths and support values. It has 13 branch points, every one splitting in two, and a total branch length of 2.35.

Press **Root at the midpoint**. The longest path between two tips runs from Taxon N to Taxon C (0.30 + 0.07 + 0.10 + 0.12 + 0.04 + 0.17 = 0.80), so the root moves to 0.40 from each end, on the branch between the old root and the group of Taxon I to N, 0.07 from the old root. Taxon N and Taxon C are then both 0.40 from the root. The distance between any two tips stays the same; only the place of the root changes. Then pick **Taxon N** and press **Root here** to see the tree rooted on Taxon N's branch instead.

## Support values when rerooting

A number on a branch point usually describes the branch above it, such as "95 % of bootstrap trees have this group". When you reroot, some branches turn round, so the tool moves each number with its branch instead of leaving it on the node. Names on branch points that are not numbers stay where they are.

## FAQ

**Which files can it open?** Newick files (.nwk, .newick, .tre, .tree, .ph) and NEXUS files with a TREES block, including a TRANSLATE table that swaps numbers for full names. Up to 50 MB.

**Why are underscores shown as spaces?** In Newick, an underscore in an unquoted name stands for a space. Names in 'single quotes' are kept exactly.

**Is there a limit on tree size?** Trees with up to 5,000 tips are drawn. Bigger trees still get their counts and downloads.

**Is my tree uploaded?** No. Everything runs in your browser and works offline once the page has loaded.
