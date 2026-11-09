---
name: Interlinear gloss formatter
num: 737
shelf: science
section: linguistics-and-phonetics
title: "Interlinear gloss formatter and checker (Leipzig Glossing Rules): aligned glosses, small caps, LaTeX gb4e and expex"
summary: "Type an example as original, morpheme, gloss and translation lines. The tool checks that every word and morpheme has a gloss, lines them up with category labels in small capitals, lists the abbreviations, and exports plain text, HTML or LaTeX for gb4e or expex."
status: live
ads: true
order: 737
icon: table
works: offline
updated: 2026-11-09
related: [plot-maker, data-cleaner, ipa-keyboard, syntax-tree-drawer, corpus-concordancer, field-note-organiser]
sources:
  - "Conventions: the Leipzig Glossing Rules (Comrie, Haspelmath and Bickel, Max Planck Institute for Evolutionary Anthropology), described in our own words; the built-in abbreviation list is a short list written for this tool. LaTeX output follows the documented syntax of the gb4e and expex packages. Example sentences made up for this tool."
flow:
  - { icon: pencil, label: "Lines" }
  - { icon: check, label: "Check" }
  - { icon: eye, label: "Aligned" }
  - { icon: download, label: "LaTeX" }
---

## What it does

Linguistics papers, theses and fieldwork reports show examples from other languages as **interlinear glossed text**: the original sentence, the same sentence split into morphemes, a gloss for every morpheme, and a free translation. The **Leipzig Glossing Rules** are the conventions most journals ask for. Getting the glosses to line up by hand, and keeping every hyphen in the gloss matched to a hyphen in the word, is fiddly. This tool checks your examples against the rules, shows them aligned, and writes them out for your document. Everything happens in your browser.

Type the transcription line with the [[ipa-keyboard]], and draw the structure of the example with the [[syntax-tree-drawer]].

## How to use it

1. Type one example per block, with a blank line between examples. The lines are, in order:
   - an optional **title** starting with `#` (the language, or a source),
   - the **original** line as written (untick "Each example starts with the original line" if you do not use one),
   - the **morpheme** line, with morphemes separated,
   - the **gloss** line, one gloss per word,
   - the **free translation** (quotes are optional; it may be left out).
2. Separate morphemes as the rules describe: `-` between affixes and stems, `=` before or after a clitic, `~` for reduplication, and `< >` around an infix (in both lines). When one morpheme needs several words in the gloss, join them with dots: `give.IMP`, `go.out`. A colon `:` or backslash `\` marks a change that is not a separate morpheme and does not count as a boundary.
3. Write grammatical category labels in **capitals** (`PL`, `1SG`, `PST`). They are shown in small capitals, as the rules suggest, and listed with their meanings. Labels not in the short built-in list are marked: add your own under **Your own abbreviations** as `AV = actor voice`.
4. Pick an export format and press **Copy** or **Download file**.

## What is checked

- **Word by word** (rule 1): the morpheme line and the gloss line must have the same number of words.
- **Morpheme by morpheme** (rule 2): within each word, the gloss must have the same number of pieces, and the same kind of boundary in the same place (a hyphen against a hyphen, `=` against `=`, `~` against `~`).
- **Infixes** (rule 9): the number of `< >` pieces must match.
- The original and morpheme lines usually have the same number of words; if not, you get a note, not an error, as splitting or joining words can be on purpose.

Words with a problem are outlined in red in the preview; hover or tap to see why.

## Worked example

The two made-up examples in the box pass every check: **2 examples, 4 words**, no problems. The Turkish one shows as *Çocuk-lar okul-a git-ti* over "child-pl school-dat go-pst" with pl, dat and pst in small caps, and the abbreviation list reads PL plural, DAT dative, PST past, IMP imperative, 1 first person, SG singular, 3 third person, M masculine, ACC accusative. Change `go-PST` to `go` and the check reports: *Word 3: "git-ti." has 2 morphemes but its gloss "go" has 1.* The gb4e export for the first example is

`\glll Çocuklar okula gitti.\\` then `Çocuk-lar okul-a git-ti.\\`, `child-\textsc{pl} school-\textsc{dat} go-\textsc{pst}\\` and `` \trans `The children went to school.' ``.

## FAQ

**Does it gloss the language for me?** No. It checks and formats glosses you write; it has no dictionary.

**Which LaTeX package should I use?** Both are widely used. gb4e is simple and common in journals; expex gives finer control over spacing and numbering. Use the one your template uses.

**Why did my word turn small caps?** Any gloss piece written fully in capitals (or a person number such as 1, 2, 3) is treated as a category label. Write lexical glosses in lower case.
