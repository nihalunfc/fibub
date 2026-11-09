---
name: "Stylometry: Burrows' Delta"
num: 413
shelf: science
section: digital-humanities
title: "Stylometry with Burrows' Delta: authorship attribution from word frequencies, in your browser"
summary: "Paste or open several texts, compare them on their most frequent words with Burrows' Delta, see a clustered heat map of the distances, and find the closest candidate author for a disputed text. Nothing is uploaded."
status: live
ads: false
order: 413
icon: book
works: offline
updated: 2026-11-09
related: [kmer-counter, sequence-alignment, topic-modeller, correspondence-network, manuscript-annotator, corpus-concordancer, lexical-diversity-readability]
sources:
  - "Method: J. Burrows (2002), \"'Delta': a measure of stylistic difference and a guide to likely authorship\", Literary and Linguistic Computing 17(3), 267-287. Average-linkage (UPGMA) clustering as in Sokal and Michener (1958)."
  - "Checked against an independent Python implementation (numpy, scipy.cluster.hierarchy.linkage with average linkage) on the example and four random corpora: word lists identical, every Delta and every merge height to 1e-15."
  - "The example texts are made up for this tool in three invented voices; they are not by real authors."
flow:
  - { icon: file, label: "Open texts" }
  - { icon: table, label: "Top words" }
  - { icon: sigma, label: "z-scores" }
  - { icon: target, label: "Closest" }
---

## What it does

Writers differ less in their rare words than in how often they use the common ones: *the*, *of*, *and*, *I*, *which*, *just*. Burrows' Delta turns that into a distance. This tool takes several texts and:

- counts every word and picks the **most frequent words** of the whole set;
- works out each word's **relative frequency** (% of the text's words) in every text, and turns it into a **z-score**: how many standard deviations the text sits above or below the mean of the texts;
- gives **Delta** for every pair of texts: the mean absolute difference of their z-scores. Smaller is more alike;
- draws a **clustered heat map** with an average-linkage tree, and lists the **closest author** for a disputed text.

Everything runs in your browser. Your texts are never uploaded and the page works offline once loaded.

Look at what the texts are about with the [[topic-modeller|topic modeller]], and check how words are used in context with the [[corpus-concordancer|corpus concordancer]].

## How to use it

1. Press **Open text files** and choose plain .txt files (you can pick many at once), or paste texts into the box. Each text starts with a line `### Author_title`. The part before the first underscore is the author, the same naming the R package stylo uses, so `Austen_Emma` and `Austen_Persuasion` count as one author.
2. Set **Most frequent words used**. 100 is a common start; studies often try 100 to 1,000 and check the answer does not change.
3. To attribute a text, choose it as the **Disputed text**. The means and spreads of the words then come from the other texts only, as Burrows did, so the disputed text does not shape its own yardstick.
4. Read the ranking, the heat map and the tables, then download the Delta matrix or the word table as CSV, or the whole report as an image, PDF or Word file.

## Worked example

Press **Use the example**. It loads seven short texts written for this tool: two formal letters by "Ashworth", two chatty diary entries by "Brennan", two quiet stories by "Coyle", and an "Unsigned_note". With 100 most frequent words and the note as the disputed text, two words (they had the same frequency in all six known texts) are left out, so 98 are used. The page shows **Unsigned_note is closest to Brennan (mean Delta 0.784)**. Its Delta to Brennan_diary-one is 0.764 and to Brennan_diary-two 0.804, while Ashworth averages 1.227 and Coyle 1.253. In the tree, the two Ashworth letters join first (Delta 0.548), and the note joins the Brennan texts.

These texts are only about 150 words each, which is far too short for real work; they are just big enough to show how the tool behaves.

## Tips

- **Length matters most.** Delta becomes trustworthy with texts of several thousand words. For long works, split them into equal chunks (say 5,000 words) and give each chunk its own `###` line.
- **Delta always names somebody.** It only says which of *your* candidates is closest, not that any of them wrote the text. Include as many plausible authors as you can, and look at how much closer the winner is than the runner-up.
- **Keep genre and period alike.** Letters, plays and novels use common words differently, and so do the 1700s and the 1900s. A genre signal can drown the author signal.
- **Modernised spelling, editors' notes and headers** change the counts. Strip page headers and footnotes first.

## FAQ

**How are words counted?** Letters in any alphabet, lower-cased, with inner apostrophes kept (*don't* is one word). Numbers and punctuation are ignored.

**Which standard deviation?** The sample one (dividing by n − 1), as in stylo's classic Delta.

**Why are some words left out?** A word with exactly the same frequency in every reference text has no spread, so its z-score cannot be worked out. The page lists them.

**Is my text uploaded?** No. Files are read by your browser only, and nothing leaves your device.
