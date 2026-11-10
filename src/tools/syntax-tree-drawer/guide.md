---
name: Syntax tree drawer
num: 734
shelf: science
code: T502
section: linguistics-and-phonetics
title: "Syntax tree drawer: labelled bracket notation to a tree, with triangles, movement arrows, SVG/PNG and LaTeX (forest, qtree)"
summary: "Type a sentence in labelled brackets such as [S [NP the dog] [VP barked]] and get a clean syntax tree with triangles, subscripts and movement arrows. Download SVG or PNG, or copy LaTeX for forest or qtree. Clear messages for unbalanced brackets."
status: live
ads: true
order: 734
icon: pencil
works: offline
updated: 2026-11-09
related: [plot-maker, plasmid-map, interlinear-gloss, corpus-concordancer, toy-compiler, regex-fsm-visualiser]
sources:
  - "Notation: the labelled bracketing used across syntax textbooks; LaTeX output follows the documented syntax of the forest and qtree packages. Example sentences written for this tool."
flow:
  - { icon: pencil, label: "Brackets" }
  - { icon: eye, label: "Tree" }
  - { icon: download, label: "SVG, LaTeX" }
---

## What it does

Syntax homework, papers and slides need tree diagrams, and drawing them by hand in a slide program is slow. This tool turns **labelled bracket notation** into a neat tree as you type. Each phrase is written as a bracket that starts with its label, followed by its parts: `[S [NP [D the] [N dog]] [VP [V barked]]]`. The tree updates straight away, and you can download it as an **SVG** (sharp at any size, editable in Inkscape or Illustrator) or a **PNG** image, or copy **LaTeX** code for the `forest` or `qtree` packages.

Set out the example sentence itself with the [[interlinear-gloss|interlinear gloss formatter]], and see how a computer parses code into a tree in the [[toy-compiler|compiler stage visualiser]].

## How to use it

1. Type or paste your tree in the box, or start from one of the examples.
2. Words go straight inside the bracket of their label: `[N dog]`. Several words in a row form one group: `[NP the dog]` puts "the dog" under NP.
3. Add the extras you need:
   - **Subscripts**: `NP_i` or `t_i` writes the i small and lowered. Use `_{ij}` for more than one letter.
   - **Triangles**: `[NP^ the old man]` (or `[^NP …]`) draws the words under a triangle, the usual way to skip the inside of a phrase.
   - **Movement arrows**: mark the landing site with `#1` and the place the phrase came from with `->1`: `[DP#1 what] … [DP t->1]`. The arrow runs under the tree from the trace to the moved phrase. Use other numbers or letters (`#2`, `#a`) for more arrows.
   - Put a word in "double quotes" if it contains a bracket.
4. Options: **Movement arrows** turns the arrows on or off; **All words on one line** lines the words up along the bottom, as many textbooks do; **Fit to screen** shrinks a wide tree to the page (untick it to scroll at full size); **Text size** sets the size of labels and words.
5. Download the SVG or PNG, or pick forest or qtree and press Copy or Download .tex.

## When the brackets do not match

The tool checks the brackets and tells you what is wrong in plain words, with the line and character: a "[" that is never closed (with the count of "[" and "]" so you can see how many are missing), an extra "]", a bracket with no label, text after the tree has ended, an arrow `->k` with no `#k`, or a landing site used twice. Press **Show me where** to jump to the spot in the box.

## Worked example

The "Question with movement" example is

`[CP [DP#1 what] [C' [C did] [TP [DP you] [T' [T ∅] [VP [V see] [DP t->1]]]]]]`

The tool draws a tree with **11 phrases**, **6 word groups** and a **depth of 6 levels**, reads off the sentence "what did you ∅ see t", and draws **1 arrow** from the trace t under VP back up to "what" in the specifier of CP. In LaTeX the forest version names the two ends (`name=t1` and `name=s1x1`) and adds `\draw[->] (s1x1) to[out=south, in=south] (t1);` after the tree. The ∅ sign becomes `$\emptyset$`.

## Tips

- Labels can be anything: X-bar labels like `N'` or `V'`, labels with brackets in "quotes", such as `["T[+past]" will]`, or Merge-style labels.
- Keep the tree on one line or spread it over many lines with indents; spaces and line breaks do not matter.
- For a handout, untick Fit to screen to see the true size, then download the SVG.

## FAQ

**Does it check that my tree is grammatical?** No. It draws whatever structure you write; whether the analysis is right is up to you and your framework.

**Why are there no arrows in the qtree version?** The qtree package cannot draw them. Use forest (with `\usepackage[linguistics]{forest}`), which can.

**Is my sentence sent anywhere?** No. Everything is drawn in your browser.
