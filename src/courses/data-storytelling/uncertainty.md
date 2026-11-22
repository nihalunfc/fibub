---
title: Being honest about uncertainty and caveats
seoTitle: 'How to show uncertainty and caveats in data stories'
summary: Good stories say how sure they are. How to state caveats without drowning the message, show ranges and forecasts honestly, and avoid reading meaning into noise.
minutes: 11
updated: 2026-11-22
quiz:
  - q: Where do caveats belong in a data story?
    choices: ['Hidden in the appendix', 'Next to the claim they affect, briefly', 'Before everything else, at length']
    ans: 1
    why: A short caveat where it matters keeps trust without burying the message.
  - q: One month dips 2 % below last year. Is that a trend?
    choices: ['Yes, definitely', 'Not on its own: one month can be noise; look at more months or the reason', 'Only in Power BI']
    ans: 1
    why: Single points move by chance. Patterns need several points or a known cause.
  - q: How should a forecast be drawn?
    choices: ['Exactly like actuals', 'Dashed or lighter, ideally with a range, clearly labelled as a forecast', 'Not at all']
    ans: 1
    why: Readers must be able to tell what happened from what might happen.
---

**Module 5 · about 11 minutes · read first: 5.1.** You'll be able to say how confident you are, in a way that builds trust instead of confusion.

## 1. Why this matters

Data is never perfect: months are noisy, data arrives late, definitions change, new stores distort comparisons. Hiding that makes your story fragile: the first sharp question breaks it. Burying the message under ten caveats makes it useless. The skill is in between: say the main uncertainty, briefly, where it matters.

## 2. The idea in one picture

<!--fig:ds-chart like-for-like-->

The caveat "includes a new store" changes the story from "29 % growth" to "14 % underlying growth". That's a caveat worth stating up front. "Two refunds were processed late" usually isn't.

## 3. How to handle uncertainty

1. **Rank your caveats.** Which ones could change the decision? State those. List the rest in the appendix.
2. **Put the caveat next to the claim:** "Sales grew 29 % (14 % excluding the new store)."
3. **Separate noise from signal.** One month moving 2 % is often noise. Ask: is it bigger than the usual month-to-month swing? Does it repeat? Is there a known cause?
4. **Show ranges for estimates and forecasts:** "We expect 2026 sales of $280k to $300k", drawn as a shaded band, with the forecast line dashed.
5. **Say what would change your mind:** "If March is also below last year, this is a trend, not a blip."
6. **Use plain confidence words consistently:** "likely", "possible", "we don't know yet". Avoid false precision ("sales will be $287,412").

<details class="maths" open><summary>Maths and principle</summary>

**Is a change bigger than normal noise?** Compare it with the typical spread. Northbay's 2025 monthly growth vs 2024 ranges from −2 % (Feb) to +41 % (Mar), with every other month between +22 % and +41 %. February at −2 % is far below the rest, so it's worth investigating, not just noise.

**Principle:** confidence is part of the message. "Probably" and "certainly" lead to different decisions, so don't leave the reader to guess which you meant.
</details>

Try it: change the number of people surveyed and run new surveys.

<figure class="fig" data-fig="@biz-sampling-error"><figcaption>Notice that bigger samples shrink the error bars, but only slowly.</figcaption></figure>

## 4. Worked example

*Draft claim:* "The new store will bring in $36k next year."
*Honest version:* "If Forks Market keeps its 2025 pace for 12 months, it would bring about $36k in 2026. That's an estimate from 10 months of data and doesn't include any seasonal effect we haven't seen yet (it opened in March, so it has no January or February history)."

## 5. Practice

1. Which caveat matters for a decision about store staffing: (a) refunds processed a week late, or (b) Saturday data is missing for two stores in June?
2. Rewrite with a range: "Next December will be $33,000."
3. Your manager says "just give me one number". What do you say?

<details><summary>Answers</summary>

1. (b): it directly affects the weekend vs weekday comparison staffing depends on.
2. For example: "We expect next December to be around $31k to $35k, depending mainly on how Forks Market's first Christmas goes."
3. Give the most likely number, with the main condition: "About $290k, assuming the older stores keep growing around 10 to 15 %."
</details>

Next, Module 6: presenting to managers.
