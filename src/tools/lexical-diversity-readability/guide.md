---
name: Readability
num: 736
shelf: science
code: T504
section: linguistics-and-phonetics
title: "Readability"
summary: "Paste a text to get type-token ratio, root TTR, MATTR, MTLD, HD-D and Yule's K, plus Flesch reading ease, Flesch-Kincaid grade, Gunning fog, SMOG, Coleman-Liau and ARI, with a moving-window chart. Free, in your browser."
status: live
ads: false
order: 736
icon: book
works: offline
updated: 2026-11-09
related: [kmer-counter, plot-maker, reliability-analysis, corpus-concordancer, readability-checker, stylometry-delta, abstract-word-counter]
sources:
  - "Formulas: Guiraud (1954) root TTR; Herdan (1960) log TTR; Covington and McFall (2010) MATTR; McCarthy and Jarvis (2007, 2010) HD-D and MTLD; Yule (1944) K; Flesch (1948); Kincaid et al. (1975); Gunning (1952); McLaughlin (1969) SMOG; Coleman and Liau (1975); Smith and Senter (1967) ARI. Example text written for this tool."
flow:
  - { icon: pencil, label: "Paste text" }
  - { icon: sigma, label: "Diversity" }
  - { icon: book, label: "Readability" }
  - { icon: download, label: "Report" }
---

## What it does

**Lexical diversity** is how varied the vocabulary of a text is. Language teachers, second-language researchers, speech therapists and corpus linguists use it to compare essays, transcripts or learner writing. **Readability** formulas estimate how hard a text is to read from sentence length and word length. This tool works out the measures most often reported in research, from the same text, in your browser. Nothing is uploaded.

Look at the words in context with the [[corpus-concordancer]], and check a draft's plain-English score with the [[readability-checker]].

## How to use it

1. Paste your text, or press **Open a .txt file**. The tool counts words as runs of letters and digits; "don't" and "well-known" are one word each. Upper and lower case are merged unless you tick **Match case**.
2. Read the diversity table and the chart, then the readability table below it.
3. Change the settings only if you need to match a study: **MATTR window** (50 words by default), **MTLD threshold** (0.72) and **HD-D sample** (42 words).
4. Download a CSV of every value, or a report as an image, PDF or Word file.

## The diversity measures

- **TTR** = types ÷ tokens. Simple but falls as a text gets longer, so only compare texts of equal length.
- **Root TTR** (Guiraud) = types ÷ √tokens, and **log TTR** (Herdan) = log types ÷ log tokens: attempts to correct for length.
- **MATTR**: the TTR of every window of 50 words, moving one word at a time, averaged. Not affected by text length once the text is longer than the window. The chart shows each window's TTR.
- **MTLD**: reads through the text keeping a running TTR; each time it falls to 0.72 or below, one "factor" is complete and the count restarts. The leftover piece counts as a part factor, (1 − TTR) ÷ (1 − 0.72). MTLD = words ÷ factors, averaged over a forward and a backward pass. Higher means more varied.
- **HD-D**: the expected TTR of a random 42-word sample, worked out exactly from the hypergeometric distribution.
- **Yule's K** = 10⁴ × (Σ f² − N) ÷ N², where f is each word's count. It measures repetition: higher K, more repetition.

## The readability formulas

With W words, S sentences and Y syllables: **Flesch reading ease** = 206.835 − 1.015 W/S − 84.6 Y/W; **Flesch-Kincaid grade** = 0.39 W/S + 11.8 Y/W − 15.59; **Gunning fog** = 0.4 (W/S + 100 × complex words ÷ W); **SMOG** = 1.043 √(30 × words of 3+ syllables ÷ S) + 3.1291; **Coleman-Liau** = 0.0588 L − 0.296 S₁₀₀ − 15.8 (letters and sentences per 100 words); **ARI** = 4.71 characters/W + 0.5 W/S − 21.43. Sentences end at . ! or ? followed by a capital letter or a number.

Syllables are counted by **rule of thumb**: groups of vowels, after dropping a silent final e and -es or -ed endings that add no syllable. Most words come out right, some are off by one ("measurement" counts 4). Open "Longest words" to see the counts used.

## Worked example

The made-up school garden text has **158 tokens** and **116 types**: TTR **0.734**, root TTR **9.228**, MATTR **0.837**, MTLD **147.0**, HD-D **0.858** and Yule's K **122.6**. It has **11 sentences** and **228 syllables**, giving Flesch reading ease **70.2** ("fairly easy"), Flesch-Kincaid grade **7.0**, fog **9.5**, SMOG **10.2**, Coleman-Liau **10.5** and ARI **8.4**.

## FAQ

**Which diversity measure should I report?** MTLD and MATTR are the most widely recommended because they depend least on text length. Report the settings with them.

**Why do readability tools disagree?** Each counts sentences and syllables a little differently. Use one tool for all your texts and compare like with like.

**Does it work for other languages?** The diversity measures do. The readability formulas and syllable rules are for English.
