---
name: Harris matrix builder
num: 403
shelf: science
section: archaeology
title: "Harris matrix builder: stratigraphic sequence from context relations, with loop checks (free, in your browser)"
summary: "Type or open your context relations (above, below, cuts, same as, contemporary with), find impossible loops and contradictions, drop redundant relations, and get a layered Harris matrix as SVG, PNG, PDF or CSV. Nothing is uploaded."
status: live
ads: false
order: 403
icon: table
works: offline
updated: 2026-11-09
related: [radiocarbon-calibration, tree-viewer, plot-maker]
sources:
  - "Method: E. C. Harris, Principles of Archaeological Stratigraphy (2nd ed., 1989), for the matrix and its rules (only direct relations are drawn; same-as units share a box). Transitive reduction and layered drawing are standard graph methods (Aho, Garey and Ullman 1972; Sugiyama, Tagawa and Toda 1981)."
  - "Checked against the Python library networkx on 300 random graphs of up to 40 contexts: the same transitive reduction on every acyclic one, and every loop found on the 57 with loops."
  - "The example contexts and relations are made up for this tool."
flow:
  - { icon: pencil, label: "Relations" }
  - { icon: check, label: "Check loops" }
  - { icon: scissors, label: "Reduce" }
  - { icon: download, label: "Matrix" }
---

## What it does

A Harris matrix shows the order in which the layers, cuts, fills and walls of a site were formed, latest at the top and earliest at the bottom. You record relations between pairs of contexts on site ("102 cuts 105", "105 overlies 107"); this tool turns that list into the matrix and checks it:

- **Loops**: if your records say A is above B, B above C and C above A, the sequence is impossible. The tool names each loop so you can find the wrong record.
- **Same as**: contexts recorded under two numbers but known to be one deposit share a box. If one of them is also recorded above the other, you get a warning.
- **Contemporary with**: two units formed at the same time are drawn on one level, joined by a dashed double line. If the rest of the sequence puts one above the other, the pair is flagged.
- **Redundant relations**: if 5 is above 6 and 6 is above 7, then "5 above 7" is true but adds nothing. Harris's rule is to draw only direct relations, so these are removed (a transitive reduction) and listed, with the chain that implies each.

Date the contexts with [[radiocarbon-calibration]], and order the finds by type with [[seriation-analyser|seriation]].

## How to use it

Write one relation per line, in plain words: **above**, **over**, **overlies**, **covers**, **cuts**, **fills**, **seals** or **later than** all mean the first context is later; **below**, **under**, **cut by**, **filled by**, **covered by** or **earlier than** mean it is earlier. Use **same as** (or =) and **contemporary with** (or ~). You can also open a CSV or Excel sheet with three columns: context, relation, context. A line with a single number adds a context that has no relations yet.

The matrix updates as you type. Download it as an SVG (vector, for editing or publication), a PNG, or a PDF or Word report with the lists. The two CSV files list every context (its level, what is directly above and below it) and every relation with its status (kept, redundant or contradicted) and the line it came from.

## Worked example

Press **Use the example** (it also loads when the page opens). It has 15 made-up relations between 11 contexts. Contexts 8 and 9 are the same deposit, so there are 10 units. The tool reports **11 contexts in 10 units and 6 levels; 11 relations kept, 1 redundant**. The redundant one is "5 above 7", implied by 5 > 6 > 7. Contexts 3 and 4 are contemporary and sit side by side on level 3; context 11 is contemporary with 6 and is drawn level with it, although nothing else ties it there.

Now add a line "7 above 1". The tool reports an impossible sequence and names the shortest loop: 1 above 2 above 3 above 5 above 7 above 1.

## Tips

- Keep the numbering as on your context sheets: any text without spaces works as a name (for example F12 or 1005a).
- Phase and period groupings are not drawn; use the levels CSV in a spreadsheet to add them.
- Large sites are fine: hundreds of contexts lay out in a second or two.

## FAQ

**Why is a level not a phase?** Levels only place each unit one below the lowest unit above it. Units on the same level are not necessarily of the same date unless you record them as contemporary.

**Is my site data uploaded?** No. Everything runs in your browser, works offline, and nothing is kept after you close the page.
