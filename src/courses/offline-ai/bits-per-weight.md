---
title: Bits per weight and what you lose
summary: How much quality a model loses at 8, 6, 4, 3 and 2 bits per weight, how it is measured, and why a bigger model squeezed small often beats a smaller one kept large.
minutes: 20
updated: 2026-11-19
sources:
  - 'llama.cpp quantisation tool and its quality measurements (perplexity and KL divergence), project documentation (official page), https://github.com/ggml-org/llama.cpp/tree/master/tools/quantize'
quiz:
  - q: Which is usually the safe default for most people?
    choices: ['About 4 to 5 bits (such as Q4_K_M)', '2 bits', '32 bits']
    ans: 0
    why: Around 4 to 5 bits keeps most of the quality at about a third of the 16-bit size.
  - q: You have 16 GB. Which usually gives better answers?
    choices: ['A 27B model at 4 bits that fits', 'A 7B model at 16 bits', 'They are always the same']
    ans: 0
    why: Usually more parameters at 4 bits beat fewer at 16 bits, as long as it fits with room for context.
  - q: Which jobs suffer first when bits are cut too far?
    choices: ['Exact work: maths, code, long reasoning, other languages', 'Casual chat', 'Nothing suffers']
    ans: 0
    why: Small errors add up in long chains of exact steps; casual chat hides them.
---

**Module 8 · about 20 minutes · read first: 8.1.** You'll be able to choose how far to shrink a model without losing what you need.

## 1. Why this matters

Fewer bits mean a smaller, faster model (Lesson 4.2). Too few, and the model starts to make mistakes it did not make before. Knowing where the line is lets you run bigger, better models on the same machine.

## 2. What you lose at each level

Rough guide for GGUF files of 7B to 70B models (smaller models lose more at each step):

| Bits per weight | Example | Size against 16-bit | Quality |
|---|---|---|---|
| 16 | F16, BF16 | 100% | the original |
| 8 | Q8_0 | about 53% | practically the same |
| 6 | Q6_K | about 41% | very hard to tell apart |
| about 4.8 | Q4_K_M | about 30% | small loss; the usual choice |
| about 3.9 | Q3_K_M | about 24% | noticeable on maths, code and other languages |
| about 2.6 to 3 | Q2_K | about 17% to 19% | clear loss; last resort for very large models |

## 3. How quality loss is measured

- **Perplexity:** how surprised the model is by real text. Lower is better; quantised copies score a little higher.
- **KL divergence:** how far the quantised model's next-word choices drift from the original's. Closer to zero is better.
- **Your own tasks** (Lesson 7.4): the measure that counts.

## 4. Bigger and smaller, or smaller and bigger?

At the same memory, a bigger model with fewer bits usually beats a smaller model with more bits, down to about 4 bits. Below about 3 bits, the bigger model's advantage shrinks or reverses. Mixture-of-experts models and very large models tolerate low bits better than small dense ones.

<!--fig:will-it-fit-->

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** each weight is rounded to one of 2^bits levels; fewer levels mean more rounding error, which adds up over many layers.

**Equation:** levels = 2^bits. 8 bits: 256 levels; 4 bits: 16; 2 bits: 4.

**Analogy:** describing paint colours with 256 names against 16 against 4. With 16 you can still paint a good picture; with 4 the sunset looks wrong.

**Try it:** how many levels does 3 bits give? (2^3 = 8.)
</details>

## 5. Worked example

*Made-up numbers.* Chen has 24 GB. Options: a 12B at Q8_0 (about 13 GB) or a 27B at Q4_K_M (about 17 GB). On his 20 test tasks the 27B scores 17 and the 12B scores 14, but the 12B writes faster. He keeps both: the 27B for hard jobs, the 12B for quick ones.

## 6. Practice

1. In the simulation, find the largest model that fits your machine at 4 bits, and at 8 bits.
2. Why are small models hurt more by low bits?
3. Which bits would you choose for a model that writes code for you?

<details>
<summary>Answers</summary>

1. Usually about twice the parameters at 4 bits.
2. They have fewer weights to spread the error over, so each rounding matters more.
3. 5 to 6 bits if it fits (Q5_K_M or Q6_K); code is exact work.
</details>

**New words:** *bits per weight*, *perplexity*, *KL divergence*, *rounding error*.
