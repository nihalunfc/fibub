---
name: BibTeX cleaner and reference formatter
num: 802
shelf: science
section: writing-and-publishing
title: "BibTeX cleaner: fix ADS exports, merge duplicates, expand \\apj journal macros, protect capitals, export RIS, CSL-JSON or a formatted reference list"
summary: "Paste or open a .bib file and get it back clean: duplicates merged by DOI or title, journal macros such as \\apj and \\mnras written out, acronyms protected, page dashes, months and DOIs tidied, fields you don't want removed and entries sorted. Export the clean .bib, an APA-like, numbered or AAS-like reference list, RIS or CSL-JSON."
status: live
ads: true
order: 802
icon: book
works: offline
updated: 2026-11-09
related: [author-list-formatter, data-cleaner, file-converter, equation-converter, table-converter, abstract-word-counter, reviewer-response, metadata-builder]
sources:
  - "The parser follows the BibTeX file format (entries, @string, @preamble, @comment, # joins) and BibTeX's rules for splitting names, as general knowledge. It was checked against the bibtexparser and pylatexenc Python libraries."
  - "Journal macro names (\\apj, \\mnras, \\aap and others) and the journal names they stand for are general facts used by the AAS macro file and ADS exports."
  - "The reference styles are written by fibub to resemble APA, IEEE and AAS reference lists; they are not the official styles."
  - "The example entries, bibcodes and DOIs (10.5555 is a test prefix) are made up."
flow:
  - { icon: file, label: "BibTeX" }
  - { icon: sliders, label: "Clean-up" }
  - { icon: check, label: "Duplicates" }
  - { icon: download, label: "Export" }
---

## What it does

A reference list built over years from journal websites, Google Scholar and ADS usually has the same paper twice under two keys, journals written as `\apj` that break without the AAS macro file, titles whose acronyms come out as "Dna" and page ranges with the wrong dash. This page reads your BibTeX and fixes all of that in one go, on your device:

- **Reads anything BibTeX reads**: entries in braces or parentheses, `@string` abbreviations, `#` joins, `@preamble` and `@comment`. A broken entry (a missing brace, say) is reported with its line number and the rest of the file is still read.
- **Merges duplicates**: entries with the same DOI (ignoring `https://doi.org/` and letter case), or with the same title and first author when there is no DOI. The fuller entry is kept and gains any fields only the other had, and the page tells you which key to cite.
- **Writes journal macros out** as the short name (ApJ, MNRAS, A\&A) or the full name, for about 55 AAS macros used by ADS.
- **Protects capitals**: words such as DNA, pH, CO2 or HII are wrapped in braces so styles that lower-case titles leave them alone. *Protect every capital* also keeps proper names such as Milky Way.
- **Tidies fields**: field names in lower case, page ranges with `--`, months as `jan` to `dec`, DOIs without the URL part, empty fields and the fields you list (by default abstract, file, keywords and adsnote) removed, biblatex `journaltitle` and `date` turned into `journal`, `year` and `month`, and a key made for any entry that has none.
- **Exports** the clean .bib, a reference list in an APA-like, numbered (IEEE-like) or AAS-like style, RIS for EndNote, Zotero or Mendeley, and CSL-JSON for Zotero or Pandoc.

Format the author line with the [[author-list-formatter]], and move tables into LaTeX with the [[table-converter]].

## How to use it

1. **BibTeX.** Paste your entries or open your .bib file.
2. **Clean-up.** Choose how to write journal macros, how to protect capitals, the order and the fields to remove. Each option takes effect at once.
3. **Duplicates.** Read the list under *Result*: each merged duplicate names the key that was kept, so you can change your `\cite` commands. *What changed* lists every edit, entry by entry.
4. **Export.** Pick what to show, then copy or download it. A reference list can be copied for Word with its italics, or downloaded as an image, PDF or Word file.

## Worked example

Press *Use the example*. It has five made-up entries in the shape of an ADS export. The page reads **5 entries**, merges **1 duplicate** (the entry `lovelace2021` has the same DOI as `2021ApJ...900...12L`, written as a URL in capitals) and writes **4 entries**, 3 of them changed. In the cleaned file, `journal = {\apj}` becomes `journal = {ApJ}`, the title loses the braces ADS put around it and becomes `Faint {HII} regions in the outer disk of a made-up galaxy`, pages `12-20` become `12--20`, and the keyless conference entry gets the key `smith2020`.

The APA-like list then starts with `Babbage, C. (2018). Engines of Calculation. Example Press.`, and the AAS-like list gives `Lovelace, A., Babbage, C., & van der Berg, M. 2021, ApJ, 900, 12, doi: 10.5555/example.0001`.

## Tips

- Keep a copy of the original file. Cleaning changes keys only for entries that had none or clashed, but merged duplicates disappear.
- If your journal provides the AAS macros (AAS journals, MNRAS and A&A do), you can keep `\apj` as it is; otherwise write the names out.
- Check names in braces such as `{van der Berg}` or `{The Example Collaboration}`: braces keep them together as a family name, which is usually what you want.
- The reference lists are a quick, readable version of your references, not a replacement for the journal's own BibTeX style.

## FAQ

**Will it change my citation keys?** Only when an entry has no key, or two different entries share one; the page tells you which. Merged duplicates keep the key of the fuller entry.

**Why does my title still come out in lower case?** Choose *Protect every capital*, or put braces around the words yourself. The journal's style decides the case of anything not in braces.

**Is my file uploaded?** No. It is read and cleaned on this page and never leaves your device.
