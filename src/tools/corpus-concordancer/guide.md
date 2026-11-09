---
name: Corpus concordancer
num: 733
shelf: science
section: linguistics-and-phonetics
title: "Corpus concordancer: KWIC lines, word frequency list, n-grams and collocations (MI, t-score, log-likelihood)"
summary: "Paste text or open your own .txt files to see every use of a word in context (KWIC), sorted by the words around it, plus a word frequency list, repeated n-grams and collocates ranked by MI, t-score or log-likelihood G². Nothing is uploaded."
status: live
ads: false
order: 733
icon: search
works: offline
updated: 2026-11-09
related: [kmer-counter, plot-maker, data-cleaner, lexical-diversity-readability, interlinear-gloss, qualitative-coding, stylometry-delta, topic-modeller]
sources:
  - "Formulas: Church and Hanks (1990) for mutual information; Dunning (1993) for log-likelihood G²; t-score as in Church et al. (1991); window counts as described by Evert (2008). Example text written for this tool."
flow:
  - { icon: file, label: "Your texts" }
  - { icon: search, label: "Search" }
  - { icon: table, label: "Lines, lists" }
  - { icon: download, label: "CSV" }
---

## What it does

A concordancer shows every place a word appears in a body of text (a **corpus**), lined up with the words before and after it. Linguists, language teachers, translators and anyone studying how words are really used read these **key word in context (KWIC)** lines to see patterns a dictionary does not show. This tool works on your own texts, entirely in your browser: your files are read on your device and never uploaded.

It has four views:

- **Concordance**: every hit with up to 30 words of context each side, sorted by the order in the text, the search word, or the 1st, 2nd or 3rd word to its left or right.
- **Word list**: how often each word appears, its share of all words, and (with several files) in how many files it appears.
- **N-grams**: repeated sequences of 2 to 5 words, such as "at the end of".
- **Collocations**: words that turn up near your search word more often than chance would give, scored three ways.

Measure how varied the vocabulary is with [[lexical-diversity-readability|lexical diversity and readability]], and compare authors with [[stylometry-delta]].

## How to use it

1. Paste text into the box, or press **Open .txt files** and pick one or more plain text files (up to 20 MB in all). Each file is kept separate, so context lines and n-grams never run from one file into the next. Remove a file with its Remove button; empty the box if you only want the files.
2. Choose a view. In Concordance and Collocations, type a word or phrase. A `*` stands for any letters (`teach*` finds teach, teacher, teaching) and `?` for one letter. Tick **Regular expression** to use a pattern instead, which must match a whole word: `colou?r` finds color and colour. **Match case** treats "Strong" and "strong" as different words.
3. Set the options. **Context** is the number of words shown each side. **Sort lines by** groups the lines by a neighbouring word, which is how repeated patterns jump out. For n-grams, **Stop at sentence ends** keeps an n-gram from running across . ! ? ; : or a blank line. For collocations, set the **window** (words to the left and right) and the minimum number of times two words must be seen together.
4. Press **Download CSV** for the whole table, or download a report as an image, PDF or Word file (first 200 rows).

## How words and scores are counted

A word is a run of letters, accent marks and digits; an apostrophe or hyphen inside a word keeps it whole, so "don't" and "well-known" are one word each. Upper and lower case are merged unless Match case is on.

For collocations, the windows around all hits are joined (a word near two hits counts once) and the hits themselves are left out. With **O** the times a word is in the window, **f** its frequency in the whole corpus, **W** the number of words in all windows and **N** the corpus size, the expected count is **E = W × f ÷ N**. Then:

- **MI** = log₂(O ÷ E). Above 3 is a common rule of thumb for a strong pair. It favours rare words that occur almost only near the search word.
- **t-score** = (O − E) ÷ √O. Above 2 is the usual rule of thumb. It favours frequent, reliable pairs such as grammar words.
- **G²** (log-likelihood) from the 2 × 2 table of in-window and out-of-window counts. Above 3.84 would be p < 0.05 and above 10.83 p < 0.001 if words were independent; they are not, so read it as a ranking.

## Worked example

The made-up text in the box has **136 words** and **83 different words**. Searching for **ferry** gives **6 hits**. Sorted by the 1st word right, lines with "ferry is" group together, and the trigram list (stopping at sentence ends) shows **"the ferry is" 3 times**. In Collocations with 3 words each side and "seen together at least 2", **is** comes first: seen 4 times against 1.32 expected, MI 1.60, t-score 1.34, G² 6.53. Search for **tea** instead and **strong** tops the list: all 3 uses of "strong" sit just left of "tea" (MI 2.63, G² 11.29).

## Tips

- Small corpora give noisy scores. Use the minimum count to hide one-off pairs, and compare MI with t-score: a word high on both is a solid collocate.
- To compare two texts, open them as separate files and look at the Files column in the word list.
- Save a text as UTF-8 plain text first if it comes from Word or a PDF.

## FAQ

**Are my files uploaded?** No. They are read by your browser and stay on your device. Nothing is kept after you close the page.

**Does it lemmatise or tag parts of speech?** No. It counts word forms as written, so "ferry" and "ferries" are separate; use `ferr*` to find both.

**Why do my numbers differ from another concordancer?** Tools differ in how they split words, whether windows overlap and how they count expected frequency. This tool's rules are written out above, so you can report them.
