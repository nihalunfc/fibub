---
title: 'Parameters: what "7B" and "120B" mean'
seoTitle: 'What model parameters (7B, 120B) mean | Offline AI'
summary: A model's parameters are the numbers it learned. What the B in 12B means, how parameters turn into gigabytes, and why more is usually smarter but not always.
minutes: 20
updated: 2026-11-19
quiz:
  - q: What does the 12B in Gemma 4 12B mean?
    choices: ['12 billion parameters, the learned numbers in the model', '12 bytes', 'Version 12, beta']
    ans: 0
    why: B means billion. The model holds about 12 billion learned numbers.
  - q: How big are the weights of a 12B model at 16 bits per parameter?
    choices: ['About 1.2 GB', 'About 24 GB', 'About 240 GB']
    ans: 1
    why: 16 bits is 2 bytes, so 12 billion × 2 bytes = 24 GB. Quantisation shrinks this (Module 8).
  - q: Is a model with more parameters always better?
    choices: ['Yes, always', 'Usually more capable, but training data and method matter, and newer small models often beat older big ones', 'No, smaller is always better']
    ans: 1
    why: Size helps, but a well-trained 12B model from this year can beat a 70B model from three years ago.
---

**Module 2 · about 20 minutes · read first: 2.1.** You'll be able to read a model's size, turn it into gigabytes and judge what it says about ability.

## 1. Why this matters

The number in a model's name is the first thing to read: it tells you roughly how capable it is, how much memory it needs and how fast it will run.

## 2. What a parameter is

A **parameter** (also called a **weight**) is one number the model learned during training. The scores in Lesson 2.1 come from multiplying your tokens by these numbers, layer after layer. A model is, quite literally, a very large file of numbers plus the recipe for using them.

- **B** = billion. **E2B** and **E4B** in Gemma 4 mean "effectively" 2 or 4 billion working at a time, with some extra stored parts.
- For Mixture-of-Experts models the name may give two numbers: **26B A4B** means 26 billion in total, about 4 billion **active** per token (Lesson 2.5).

## 3. From parameters to gigabytes

Bytes per parameter depend on precision: 16 bits = 2 bytes, 8 bits = 1 byte, 4 bits = half a byte. So:

| Model | 16-bit | 8-bit | 4-bit |
|---|---|---|---|
| 4B | 8 GB | 4 GB | 2 GB |
| 12B | 24 GB | 12 GB | 6 GB |
| 31B | 62 GB | 31 GB | about 16 GB |
| 120B | 240 GB | 120 GB | 60 GB |

Real files are a little bigger, because some parts are kept at higher precision.

## 4. Size and ability

More parameters can store more patterns, so bigger models usually reason better, know more facts and handle more languages. But data quality and training method matter as much: small models improve every year, and a new 12B model often beats a 70B model from a few years ago. Test on your own tasks (Lesson 7.4).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** memory for weights is parameters times bytes per parameter.

**Equation:** GB = parameters (billions) × bits ÷ 8.

**Analogy:** a library's size is books × pages per book. Parameters are the books; precision is how many pages each takes up.

**Try it:** a 27B model at 8 bits? (27 GB.)
</details>

## 5. Worked example

*Made-up numbers.* Two models score the same on Pooja's five real tasks: a 12B and a 27B. The 12B needs 7.7 GB and writes at 18 tokens per second on her machine; the 27B needs 18 GB and writes at 7. She keeps the 12B.

## 6. Practice

1. How many GB is a 20B model at 4 bits?
2. What does "60B A6B" tell you?
3. Why might you choose a 12B over a 27B?

<details>
<summary>Answers</summary>

1. 20 × 4 ÷ 8 = 10 GB.
2. 60 billion parameters in total, 6 billion active per token: memory like a 60B, speed like a 6B.
3. It fits more easily, runs faster, and may be good enough for your tasks.
</details>

**New words:** *parameter* or *weight* (one learned number), *B* (billion), *active parameters* (those used per token in an MoE model), *precision* (bits per number).
