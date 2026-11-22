---
title: 'What "95 % confident" really means'
summary: 'A 95 % confidence interval comes from a method that catches the truth in 95 % of samples. What that does and does not say about your one interval, the common misreadings, and how to explain it to a manager in one sentence.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: 'Which statement about a 95 % confidence interval of 28 to 36 minutes is correct?'
    choices: ['95 % of deliveries take 28 to 36 minutes', 'If we repeated the sampling many times, about 95 % of the intervals built this way would contain the true mean', 'There is a 95 % chance the sample mean is between 28 and 36']
    ans: 1
    why: 'The 95 % describes the method''s long-run hit rate for the true mean. It is not about individual deliveries, and the sample mean is always inside its own interval.'
  - q: 'You build 100 different 95 % intervals from 100 independent samples. About how many miss the truth?'
    choices: ['0', 'About 5', 'About 50']
    ans: 1
    why: 'A 95 % method misses about 5 % of the time. You cannot tell which ones missed.'
  - q: 'Does collecting more data make a 95 % interval more likely to contain the truth?'
    choices: ['Yes, it becomes 99 % likely', 'No: it stays a 95 % method, but the interval gets narrower', 'It becomes less likely']
    ans: 1
    why: 'The hit rate is fixed by the level. More data makes each interval shorter, so you learn more, but at the same 95 % reliability.'
---

**Module 5 · about 15 minutes · no new maths.** You'll be able to explain correctly what a confidence level means, avoid the common misreadings, and say it plainly to non-statisticians.

## 1. The method, not the interval

The true mean is a fixed number. Your interval either contains it or it doesn't. The "95 %" describes the **method**: build intervals this way from many random samples, and about 95 % of them will catch the truth.

<!--fig:ci-coverage-->

Draw 100 samples a few times. Around 5 of every 100 intervals miss (the highlighted ones), and the running total settles near 95 %. Change n: the intervals get shorter, but the miss rate stays at 5 %. Change the level to 80 %: intervals get shorter and about 1 in 5 misses.

## 2. Common misreadings

| People say | Problem |
|---|---|
| "95 % of customers spend between $38 and $42." | No. The interval is for the **average**, not individuals. Individual spending is far more spread out (that would be a *prediction* or *reference* interval). |
| "There's a 95 % chance the true value is in this interval." | Close enough for everyday talk, but strictly the true value is fixed; the 95 % is about the method. (A Bayesian *credible* interval, Lesson 7.7, does mean this directly.) |
| "The intervals overlap, so there's no difference." | Not quite. Two 95 % intervals can overlap a little while the difference is still significant. Test the difference (Lesson 6.3). |
| "The result is 4.2 % ± 0.8, so it's definitely positive." | It's *probably* positive; 5 % of such intervals miss. And bias isn't covered at all. |
| "A wider interval means a worse analysis." | It means less information. Saying so honestly is good analysis. |

## 3. Saying it plainly

For a manager: "Our best estimate is 32 minutes, and we're fairly sure the true average is between 28 and 36. With more orders we could narrow that down."

Or, when deciding: "Even at the low end, 1.2 %, the lift pays for the display. At the high end it's 4.3 %."

That second framing, **what would we do at each end of the interval?**, is the most useful way to use an interval at work. If you'd make the same decision anywhere in the range, you have enough data. If not, you need more, or a decision that holds up either way.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** coverage. A 95 % CI procedure satisfies `$P(\text{lower} \le \mu \le \text{upper}) = 0.95$`, where the randomness is in the interval's endpoints (which come from the random sample), not in `$\mu$`.

**Link to tests:** a 95 % CI contains exactly the values that a two-sided test at the 5 % level would *not* reject (Lesson 6.1). If 0 is outside the interval for a difference, the difference is significant at 5 %.

**Analogy:** a ring toss where you can't see the peg. A good thrower rings it 95 % of the time. After one throw you know the method, not whether this ring landed.
</details>

## 4. Worked example

*Made-up numbers.* Two regions' average basket, each from 400 baskets:

- North: $41.20 (95 % CI $39.10 to $43.30). South: $44.00 (95 % CI $41.80 to $46.20).
- The intervals overlap ($41.80 to $43.30). Is South's higher basket real?
- Test the difference: SEs are about 2.10 ÷ 1.96 ≈ 1.07 and 2.20 ÷ 1.96 ≈ 1.12. SE of difference = √(1.07² + 1.12²) ≈ 1.55.
- Difference $2.80; 95 % CI for the difference: 2.80 ± 1.96 × 1.55 = **−$0.24 to $5.84**. It includes 0, so not clearly different at 5 %, though it leans that way.

Here the overlap did agree with the test. But with slightly narrower intervals they could overlap while the difference's interval excludes 0. Always compute the interval for the difference directly.

## 5. Practice

1. An analyst says "95 % of our stores have revenue in the CI $1.2M to $1.4M." Correct it.
2. If you build 20 independent 95 % intervals, what is the chance all 20 contain their truths?
3. The 95 % CI for a lift is −0.5 % to 3.5 %. The change costs nothing to keep. What would you do?

<details>
<summary>Answers</summary>

1. The interval is for the average store revenue, not individual stores. Individual stores vary much more.
2. 0.95²⁰ ≈ 0.36. Most of the time at least one misses (Lesson 6.8 returns to this).
3. If keeping it is free and the downside is small (−0.5 % at worst), keeping it is reasonable; but it's not proven to help. Running longer would narrow the range.
</details>

**Try it on your own data:** the [[bootstrap-permutation]] tool shows intervals from your own data; run it on two halves of a file to see how much intervals move.

**New words:** *coverage*, *confidence level*, *prediction interval*, *credible interval*.
