---
name: Abstract word counter
num: 806
shelf: science
code: T542
section: writing-and-publishing
title: "Abstract word counter: words, characters and sentences against your journal's limit, with LaTeX removed"
summary: "Paste an abstract (plain text or LaTeX) and see its words, characters with and without spaces, sentences and keywords against a limit you set. The part over the limit is marked, LaTeX commands, citations and comments can be left out of the count, and the most repeated words are listed."
status: live
ads: false
order: 806
icon: pencil
works: offline
updated: 2026-11-09
related: [author-list-formatter, bibtex-cleaner, prompt-pruner, readability-checker, reviewer-response, lexical-diversity-readability, figure-checker, poster-layout]
sources:
  - "Word, character and sentence counting rules are written by fibub. Sentence counts were checked against the pysbd sentence splitter and word counts against Python and wc on made-up abstracts."
  - "The example limits (150, 250 and 300 words, 1,500 characters) are round numbers chosen as examples, not any journal's rule."
  - "The example abstract is made up."
flow:
  - { icon: pencil, label: "Paste" }
  - { icon: sliders, label: "Limit" }
  - { icon: calculator, label: "Count" }
  - { icon: check, label: "Trim" }
---

## What it does

Abstracts have hard limits, and a submission system that rejects 253 words at 11 pm is no fun. This page counts your abstract the way word processors do and shows exactly where the limit falls:

- **Words, characters with and without spaces, sentences and paragraphs**, plus the average sentence length, so you can spot a 60-word sentence.
- **Your limit** in words or characters. The bar turns red and the words over the limit are marked in the text, so you know how much to cut and where the cut falls.
- **LaTeX removed** if you paste from your .tex file: comments, `\cite` and `\label` are left out, maths such as `$r$` and each `\ref` count as one word, `\textit{in situ}` keeps its words and accents such as `caf\'e` become letters.
- **Keywords**: type them to count them against the keyword limit and see which ones also appear in the abstract.
- **Most used words**: words of four letters or more used more than once, to catch repetition.

Check how easy the abstract is to read with the [[readability-checker]], and get the author line right with the [[author-list-formatter]].

## How to use it

1. **Paste** your abstract, or open a .txt or .tex file. Leave *Remove LaTeX commands* ticked for LaTeX.
2. **Limit.** Type the limit from the journal's guide for authors and choose words or characters. The example buttons fill in round numbers to start from; they are only examples, since every journal and meeting sets its own.
3. **Count.** Read the count and the bar. Everything updates as you type.
4. **Trim.** Cut words in your own editor until the marked part is gone, or rewrite the long sentences.

## Worked example

Press *Use the example*. The made-up abstract has a citation, two bits of maths and a LaTeX comment. With LaTeX removed the page counts **112 of 250 words, 138 left**, in **6 sentences** (18.7 words per sentence). "e.g." inside the first sentence, "Fig. 3" and "et al. (2019)" do not end sentences. Untick *Remove LaTeX commands* and the count rises to 119 words, because the citation command and the comment are counted too.

Press *Example: Short abstract, 150 words*, then type 100 as the limit: the page says **Over the limit by 12** and marks the last 12 words, from "of star formation in galaxy outskirts" to the end. The most used word is "discs" (three times).

## Tips

- Count the final text. Journals count what will be printed, so a citation in the abstract usually turns into words; many ask for no citations in the abstract at all.
- Hyphenated words count as one word here and in most word processors, but some submission systems split them. If you are right at the limit, leave a few words of room.
- Characters limits usually include spaces; check which one your meeting means.

## FAQ

**Why does my word processor give a slightly different number?** Programs differ on symbols standing alone (such as ± or –) and on slashes. This page counts a token only if it has a letter or a digit in it, as Word and Google Docs do.

**What counts as a sentence?** A full stop, question mark or exclamation mark followed by a space and a capital letter or a number, unless the word before is a common abbreviation (e.g., i.e., et al., Fig., Eq., Dr.) or a single initial.

**Is my abstract stored or sent?** No. It is counted on this page and is gone when you close it.
