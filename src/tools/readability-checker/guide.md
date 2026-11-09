---
name: Readability checker
num: 821
shelf: science
section: ethics-and-planning
title: "Readability checker for consent forms and plain-language summaries: Flesch, Flesch-Kincaid, Fog, SMOG, Coleman-Liau, ARI"
summary: "Paste a consent form, information sheet or any English text and get six readability scores, a school grade, long sentences, passive-voice hints, long words, your own jargon and plainer-word suggestions, marked in the text. Nothing is uploaded."
status: live
ads: false
order: 821
icon: book
works: offline
updated: 2026-11-09
related: [data-management-plan]
sources:
  - "The six formulas are the published Flesch Reading Ease, Flesch-Kincaid grade, Gunning Fog, SMOG, Coleman-Liau and Automated Readability Index formulas. The tests feed the same counts through the formula code of the Python package textstat 0.7.13 and get the same numbers."
  - "Syllables are counted by rules written by fibub (no word list is copied). The tests compare them with the CMU Pronouncing Dictionary, which textstat uses: they agree on about 98 % of words in fibub's own guides and 95 % of other English words."
  - "The plainer-word suggestions and the example consent text are written by fibub; the example is made up."
flow:
  - { icon: pencil, label: "Paste" }
  - { icon: sigma, label: "Scores" }
  - { icon: search, label: "Hints" }
  - { icon: download, label: "Report" }
---

## What it does

Ethics boards, funders and patient groups often ask for consent forms and lay summaries that most adults can read easily. This page measures how hard a piece of English text is and shows where to make it easier:

- **Six scores.** Flesch Reading Ease (0 = very hard, 100 = very easy), and five grade scores that estimate the US school grade a reader needs: Flesch-Kincaid, Gunning Fog, SMOG, Coleman-Liau and the Automated Readability Index (ARI). An average of the five gives one rough number. Add 5 to a grade for an approximate age.
- **The counts behind them.** Sentences, words, syllables, words per sentence, syllables per word and words of three or more syllables.
- **Hints in the text.** Long sentences get a shaded background, possible passive voice is underlined, long words are bold, your own jargon words are red, and words with a plainer choice get a dotted green line (hover or long-press for the suggestion).
- **A syllable counter** for single words or phrases.

## How to use it

1. **Paste** your text, or open a .txt or .md file. For Word or PDF files, copy the text and paste it.
2. **Each new line starts a new sentence** is ticked at first, so headings and bullet points are not merged into one long sentence. Untick it for text copied from a PDF, where lines break mid-sentence.
3. Set the **long sentence** limit (25 words at first), the **syllables** that make a word "long" (3), your **target grade** (8 at first; leave it empty to hide the check) and any **jargon words** to flag, such as "cohort, randomised".
4. Read the **scores**, then work through the marked text, the list of long sentences, the passive hints and the plainer words. Download the sentence table as CSV, or the whole report as an image, PDF or Word file.

## Worked example

The example is a made-up consent paragraph of 8 sentences, 112 words and 196 syllables. It scores **Reading Ease 44.6 (difficult), about grade 11.4**: Flesch-Kincaid 10.5, Gunning Fog 13.5, SMOG 12.8, Coleman-Liau 11.4 and ARI 9.0. That is **above a target of grade 8 by 3.4**. The page finds one long sentence (29 words), four passive hints ("are invited", "be asked", "be stored", "be anonymised") and five words with a plainer choice: participate and participation (take part), discontinue (stop), prior (before) and receive (get). Replace the first sentence with "We are asking students to help with a study about sleep and exam marks." and the average falls to about grade 9.1 and Reading Ease rises to 59.8.

## How the counting works

- **Sentences** end at full stops, question marks and exclamation marks, but not after common abbreviations (Dr., e.g., etc.), initials or inside numbers like 3.5. Blank lines and bullet points also end a sentence.
- **Words** are runs of letters or digits; "long-term" and "don't" are one word each.
- **Syllables** are counted by rules: groups of vowels, a silent final e, -le, -ed and -es endings, compounds such as "baseline", and a short list of common exceptions. Abbreviations without vowels (ppm) count a syllable per letter, and numbers count as one.

## Differences from other checkers

The formulas are standard, but checkers count differently. We compared this page with the Python package **textstat**. Given the same counts, every score matches. On the same text the scores can differ by up to about 1.5 grades, because:

- textstat looks syllables up in the CMU Pronouncing Dictionary; this page uses rules, which agree on about 95 to 98 % of words (they differ on names and some words such as "entirely" or "fluorescent");
- textstat drops "sentences" of two words or fewer and splits at every full stop, including in "e.g.";
- textstat's ARI counts punctuation as characters, its Coleman-Liau uses 0.058 instead of 0.0588, and its Gunning Fog counts "difficult" words from a list of easy words instead of words of three or more syllables.

## FAQ

**What grade should a consent form be?** Many ethics boards ask for about grade 6 to 8 (ages 11 to 13), but rules differ: check your own board's guidance.

**Is a good score enough?** No. Short words in short sentences can still be unclear. Test the text with people like your readers.

**Is my text stored?** No. It is counted on this page and never uploaded or saved.
