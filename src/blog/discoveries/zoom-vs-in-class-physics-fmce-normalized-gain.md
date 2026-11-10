---
title: "Zoom versus in-class physics: normalised gain and effect size on the FMCE"
summary: "A 2025 study compared a Zoom section and an in-person section of the same mechanics course on the FMCE concept test. See how to work out Hake's gain and Cohen's d yourself."
tools: [effect-size-learning-gain, effect-size-converter, sample-size, hypothesis-tests]
updated: 2026-11-10
sources:
  - "Dhungana R (2025), Physical Review Physics Education Research 21: 020145, CC BY 4.0, the paper described here."
  - "Hake RR (1998), American Journal of Physics 66: 64-74 (normalised gain). Cohen J (1988), Statistical Power Analysis for the Behavioral Sciences (d and its rough size bands)."
  - "The two class sections in the worked example are made up by fibub."
paper:
  title: "Comparing conceptual learning in Zoom and in-class sections of college physics"
  authors: "Dhungana R"
  journal: "Physical Review Physics Education Research"
  year: 2025
  doi: "10.1103/j4st-rj18"
  url: "https://journals.aps.org/prper/abstract/10.1103/j4st-rj18"
  licence: "CC BY 4.0"
  reviewed: true
---

After the pandemic, many universities kept some courses on video. Does a physics student learn as much in a live Zoom class as in the room? A study published in Physical Review Physics Education Research in November 2025 compared two sections of the same introductory mechanics course, taught at the same time by the same instructor, one face to face and one on Zoom. Both groups learned a good deal, and their average gains were close, but the in-person results were more even from student to student. This page explains the study and shows how to work out the same measures, Hake's normalised gain and Cohen's d, with the [[effect-size-learning-gain]] tool. To turn an effect size from one form into another (say d into a correlation) for a review, use the [[effect-size-converter]], and to plan how many students a follow-up study needs, try [[sample-size]].

## What they found

Students took the Force and Motion Conceptual Evaluation (FMCE), a 47-point test of how well they understand Newton's laws, at the start and end of the term. In the study's numbers, 46 in-person and 47 Zoom students took both tests. The two groups started almost level, near 11 points. The in-person section reached a normalised gain of about 30 % and the Zoom section about 25 %, a difference that was not statistically significant, and the two groups' end-of-term scores differed by an effect size of only 0.19.

The author's pre-to-post effect sizes were larger for the in-person section (1.27 against 0.72). An analysis of covariance (a regression of end score on start score and class type) showed that a strong start turned into a strong finish more reliably in the room than on Zoom. In short: similar averages, but more scatter online.

## Why it matters

Colleges deciding whether to keep online sections often look only at average grades. This study suggests that the spread matters too: a format that works well for some students and poorly for others can hide behind a fair average. It also shows how to compare formats fairly, with a standard concept test, pre and post, rather than course grades that differ between sections.

## How they did it

Both sections used the same pre-class tasks, clicker questions, weekly worksheets and tests in autumn 2023 at an urban public university in the United States. The analysis used Hake's gain, Cohen's d within each group and between the groups, and an analysis of covariance with the pretest as the covariate.

**Hake's normalised gain** is the share of the possible improvement that a class made: g = (post − pre) ÷ (maximum − pre), using class means. **Cohen's d** is a difference in means divided by a standard deviation, so it is in units of spread, not points.

## Check it yourself with fibub

Here are two **made-up sections** of our own on a 30-point concept test (not the paper's data):

- Section A: 38 students, pre-test mean 9.0 (SD 4.2), post-test 18.6 (SD 5.1), correlation between each student's two scores 0.55.
- Section B: 41 students, pre-test mean 8.4 (SD 4.6), post-test 15.9 (SD 6.3), correlation 0.40.

1. Choose **Learning gain**, switch the entry to class means, set the maximum score to 30 and enter Section A's means: g is about 0.46. Section B gives about 0.35. Both count as "medium" gains on Hake's scale (0.3 to 0.7).
2. Choose **Before and after**, enter Section A's means, SDs, 38 people and r = 0.55. The tool gives dz (the change divided by the SD of each student's change) of about 2.14 and dav (the change divided by the average of the two SDs) of about 2.06. For Section B, with r = 0.40, dz is about 1.22 and dav about 1.38.
3. Choose **Two groups** and compare the post-tests: group 1 is A (18.6, SD 5.1, n 38), group 2 is B (15.9, SD 6.3, n 41). Hedges' g is about 0.46, with a 95 % interval from about 0.02 to 0.91, and the t test gives p of about 0.04.

Step 2 shows why a within-group d needs care: the lower correlation in Section B (students' end scores track their start scores less closely) pulls dz and dav apart. When we put the paper's reported means and SDs into the same tool, Hake's gain came out at 30.5 % and 25.0 % and the between-group d at 0.19, matching the paper. The within-group values depend on which formula is used: the tool's dz and dav gave about 1.15 to 1.21 for the in-person group and 0.83 to 0.96 for Zoom, not exactly the 1.27 and 0.72 reported, so read the methods before comparing such numbers across studies.

## The fine print

One instructor, one term, one university. Students were not randomly assigned: the Zoom section met at 8 am and the in-person one at 10 am. About a fifth of each class did not take both tests and were left out. Most Zoom students also went to labs in person, so they were not fully online. Starting spreads differed between the groups. The paper reports the class-type term of its regression in two ways that do not match, which the reader should check against the tables.
