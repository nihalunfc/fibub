---
title: Bits per weight and what you lose
summary: How much quality a model loses at 8, 6, 4, 3 and 2 bits per weight, how it is measured, and why a bigger model squeezed small often beats a smaller one kept large.
minutes: 20
updated: 2026-11-22
sources:
  - 'llama.cpp quantisation tool and its quality measurements (perplexity and KL divergence), project documentation (official page), https://github.com/ggml-org/llama.cpp/tree/master/tools/quantize'
  - 'Dettmers, T. and Zettlemoyer, L. (2023), The case for 4-bit precision: k-bit Inference Scaling Laws, ICML 2023 https://arxiv.org/abs/2212.09720'
  - 'Jurafsky, D. and Martin, J. H., Speech and Language Processing, 3rd edition draft, chapter on n-gram language models (perplexity) https://web.stanford.edu/~jurafsky/slp3/'
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

<div class="bigidea">Each bit you remove halves the number of values a weight can take; down to about 4 bits the model barely notices, below 3 bits the errors start to show.</div>

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

Why do the levels matter so much? Each bit doubles the number of allowed values: 8 bits give 256 values, 4 bits give 16, 2 bits only 4. With 4 values, almost every weight is moved a long way.

### Watch it happen: one weight at four bit levels

Take a block whose largest weight is 1.0 and follow the weight **0.30** as the bits drop. (Signed scheme: at b bits the whole numbers go from −(2^(b−1) − 1) to 2^(b−1) − 1.)

<div class="steps">
<div class="step"><p><b>8 bits.</b> Whole numbers −127 to 127, step 1 ÷ 127 = 0.0079. 0.30 ÷ 0.0079 = 38.1 → 38 → <b>0.299</b>. Error 0.001: invisible.</p></div>
<div class="step"><p><b>6 bits.</b> −31 to 31, step 0.032. 0.30 ÷ 0.032 = 9.3 → 9 → <b>0.290</b>. Error 0.010: still tiny.</p></div>
<div class="step"><p><b>4 bits.</b> −7 to 7, step 0.143. 0.30 ÷ 0.143 = 2.1 → 2 → <b>0.286</b>. Error 0.014: small, and errors in other weights partly cancel out.</p></div>
<div class="step"><p><b>2 bits.</b> Only −1, 0, 1 (step 1.0). 0.30 → 0 → <b>0</b>. The weight is gone completely. Do that to millions of weights and the model starts to make real mistakes.</p></div>
</div>

## 3. How quality loss is measured

- **Perplexity:** how surprised the model is by real text. A score of 10 means it is, on average, as unsure as if it were choosing between 10 equally likely next tokens. Lower is better; quantised copies score a little higher.
- **KL divergence:** how far the quantised model's next-word choices drift from the original's. Closer to zero is better.
- **Your own tasks** (Lesson 7.4): the measure that counts.

## 4. Bigger and smaller, or smaller and bigger?

At the same memory, a bigger model with fewer bits usually beats a smaller model with more bits, down to about 4 bits. Below about 3 bits, the bigger model's advantage shrinks or reverses. Mixture-of-experts models and very large models tolerate low bits better than small dense ones.

<!--fig:will-it-fit-->

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** each weight is rounded to one of 2^bits levels; fewer levels mean more rounding error, which adds up over many layers.

**Equation:** levels = 2^bits. 8 bits: 256 levels; 4 bits: 16; 2 bits: 4.

```math
P_{\max} = \frac{(\text{memory} - \text{reserve}) \times 8}{b}
```

**Analogy:** describing paint colours with 256 names against 16 against 4. With 16 you can still paint a good picture; with 4 the sunset looks wrong.

**Try it:** how many levels does 3 bits give? (2^3 = 8.)
</details>

<div class="meaning">

<dl>
<dt>b</dt><dd>bits per weight: about 8.5 for Q8_0, 6.6 for Q6_K, 4.8 for Q4_K_M, 3.9 for Q3_K_M</dd>
<dt>2<sup>b</sup></dt><dd>how many different values each weight can take</dd>
<dt>P<sub>max</sub></dt><dd>the largest model, in billions of parameters, whose weights fit</dd>
<dt>reserve</dt><dd>memory kept free for the conversation (KV cache, Lesson 8.4) and the system</dd>
<dt>Physical meaning</dt><dd>Fewer bits buy you a bigger model in the same memory, and a bigger model knows more. The trade pays off until the rounding gets so coarse, below about 3 bits, that the bigger model's extra knowledge is lost in the noise.</dd>
</dl>

</div>

<div class="problem" data-problem="bits-per-weight-largest"></div>

<div class="myth">

**"More bits always means a better answer, so use the biggest file I can."** On the same memory, a model twice the size at 4 bits usually beats a smaller one at 8 bits. Spend memory on parameters first, bits second, and stop going lower at about 4 bits.

</div>

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

<div class="keypoints">

- Each bit removed halves the allowed values: 256 at 8 bits, 16 at 4, 4 at 2.
- 8 and 6 bits are almost lossless; about 4.8 (Q4_K_M) is a small loss; 3 bits and below hurt exact work.
- Perplexity and KL divergence measure the loss; your own tasks decide.
- On the same memory, a bigger model at 4 bits usually beats a smaller one at 8.
- Largest model that fits ≈ (memory − reserve) × 8 ÷ bits per weight.

</div>
