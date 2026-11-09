---
name: Questionnaire scorer
num: 723
shelf: science
section: psychology-and-psychometrics
title: "Questionnaire and survey scale scorer: reverse items, subscales, missing answers (free)"
summary: "Score a questionnaire in your browser: reverse-keyed items, subscale sums or means, a clear rule for missing answers with prorating, Cronbach's alpha for each subscale and a CSV of everyone's scores."
status: live
ads: false
order: 723
icon: table
works: offline
updated: 2026-11-09
related: [reliability-analysis, data-cleaner, sample-size, plot-maker, factor-analysis, irt-item-analysis, item-analysis, likert-chart]
sources:
  - "Formulas: reverse keying as (lowest + highest) − answer; prorated sums as the mean of answered items × number of items; Cronbach (1951) alpha with Feldt (1965) interval."
  - "Example data: made up for this page."
flow:
  - { icon: table, label: "Paste" }
  - { icon: pencil, label: "Subscales" }
  - { icon: sigma, label: "Score" }
  - { icon: download, label: "CSV" }
---

## What it does

Most questionnaires are scored the same way: flip the negatively worded items, add up (or average) the items of each subscale, decide what to do about people who skipped a question, and check that each subscale hangs together. Doing this by hand in a spreadsheet is slow and easy to get wrong, especially the reverse keying and the missing answers. This tool does all of it at once from a pasted table or a CSV or Excel file, and gives you a score for every person and subscale, a summary table and **Cronbach's alpha** for each subscale. Everything runs in your browser. Nothing is uploaded, so it is safe for participant data.

It works with any questionnaire you are allowed to use. It contains no items or scoring keys from published instruments: you type in the item numbers, the reverse-keyed items and the subscales from your own scoring instructions.

## How to use it

1. **Paste the responses** with one row per person and one column per item, or open a file. A header row with item names and a first column of IDs are both optional. Leave a cell blank when an answer is missing.
2. **Lowest and highest answer** are the ends of the response scale (for example 1 and 5, or 0 and 3). They are used to reverse items and to catch typing mistakes: an answer outside the range stops the scoring and says which row it is in.
3. **Reverse-keyed items**: list them by column name or number. Each is scored as lowest + highest − answer, so on a 1 to 5 scale a 2 becomes a 4.
4. **Subscales**: one per line, written as a name, a colon and the items, such as `Calm: I1-I4`. Ranges and single items can be mixed (`I1, I3, I5-I7`). Leave the box empty to score every item as one total.
5. **Score as** a sum or a mean of the items.
6. **Items needed (%)**: a person gets a subscale score only if they answered at least this share of its items. For sums, a person with a few blanks is **prorated**: their mean on the answered items times the number of items, so their score is on the same scale as everyone else's. Set it to 100 % to score only complete answers.
7. Download the scores as CSV for your statistics program, or the report as an image, PDF or Word file.

## Worked example

The page opens with made-up answers from 14 people to 8 items on a 1 to 5 scale. Calm is I1 to I4 and Focus is I5 to I8, with I3 and I7 reverse keyed, scored as sums with the 75 % rule.

- **Calm**: 13 of 14 people are scored. P11 skipped two of the four items, which is below 75 %, so P11 has no Calm score. P04 skipped I2 but answered the other three (2, a reversed 4 that counts as 2, and 2), so their sum is prorated to 2 × 4 = 8. The mean is 10.92 (SD 4.443) and alpha is 0.903, with a 95 % interval of 0.766 to 0.969 from the 12 people who answered every Calm item.
- **Focus**: 13 of 14 scored (P08 answered only two items), mean 12.69, alpha 0.848.

## Tips

- If a subscale's alpha is unexpectedly low, check that every reverse-keyed item is listed. The **Reliability and agreement** tool shows item-rest correlations that point to an item that runs the wrong way.
- Write down the missing-answer rule you used in your methods section. The note under the table says how many scores were prorated or left out.
- Check your scoring manual: some instruments use means, some sums, and some do not allow prorating at all.

## Frequently asked questions

**Why is alpha based on fewer people than the scores?** Alpha needs a complete set of answers, so people with any blank in the subscale are left out of alpha, but can still get a prorated score.

**Can one item be in two subscales?** Yes. List it in both lines.

**Can I use text answers such as "Agree"?** Recode them to numbers first, for example with the **Data cleaner**.

**Is my data sent anywhere?** No. Everything runs in your browser and the page keeps working offline.
