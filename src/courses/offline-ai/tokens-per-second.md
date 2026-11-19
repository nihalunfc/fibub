---
title: 'Tokens per second: reading speed and writing speed'
seoTitle: 'Tokens per second: prefill and decode | Offline AI'
summary: Local models have two speeds, a fast reading speed (prefill) and a slower writing speed (decode). What sets each, what is a good number, and how to measure yours.
minutes: 20
updated: 2026-11-18
sources:
  - 'Mac speeds measured with MLX (M5 Max, 128 GB, 4K context): ComputingForGeeks, checked 27 October 2026, https://computingforgeeks.com/best-mac-for-local-llm/'
quiz:
  - q: What mostly limits writing speed (decode) on a home machine?
    choices: ['Internet speed', 'Memory bandwidth: how fast the model can be read from memory', 'Screen size']
    ans: 1
    why: Each new token needs the whole model (or its active part) read from memory once, so memory speed sets the pace.
  - q: What mostly limits reading speed (prefill)?
    choices: ['Raw computing power of the graphics chip or processor', 'Disk space', 'The keyboard']
    ans: 0
    why: Prefill handles many tokens at once, so it is limited by how much maths the chip can do per second.
  - q: About what writing speed feels comfortable to read along with?
    choices: ['1 token per second', 'About 10 or more tokens per second', 'At least 1,000 tokens per second']
    ans: 1
    why: People read about 4 to 8 tokens per second, so 10 or more keeps ahead of you. Batch jobs benefit from more.
---

**Module 3 · about 20 minutes · read first: 3.4.** You'll be able to read the speed numbers your engine shows and know which part of your hardware sets each one.

## 1. Why this matters

"How fast is it?" has two answers. A model may read a long document in seconds but write slowly, or the other way round. Knowing which speed limits your job tells you whether a bigger graphics card, more memory or a smaller model will help.

## 2. Two phases

1. **Prefill (reading):** the model processes all your input tokens together. Because the work is done in parallel, it is fast, often hundreds to thousands of tokens per second on a graphics card. It is limited by **compute**, how much maths the chip does per second.
2. **Decode (writing):** it writes one token at a time, and each needs a pass through the model's weights. It is limited by **memory bandwidth**, how fast those weights can be read.

You see prefill as the pause before the first word ("time to first token"), and decode as the speed of the words after it.

## 3. What good looks like

- **Reading along:** 10 tokens per second or more feels smooth; people read about 4 to 8.
- **Batch jobs:** every extra token per second shortens the run.
- **A real example:** one test measured gpt-oss-120b writing at about 88 tokens per second on a 128 GB M5 Max Mac (4K context, MLX). It is a Mixture-of-Experts model, so only part of it is read per token (Lesson 2.5).

Speeds fall as the context grows, because there is more to look back over (often by a quarter or more at long lengths).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** decode reads every active weight once per token, so its ceiling is bandwidth divided by bytes read.

**Equation:** decode speed ≤ memory bandwidth (GB/s) ÷ active weights (GB).

**Analogy:** a reader who must flip through the whole reference book before writing each word. A thinner book (smaller model) or faster hands (more bandwidth) means more words per minute.

**Try it:** a graphics card at 448 GB/s and a 7.7 GB model? (448 ÷ 7.7 ≈ 58 tokens per second at most; real speeds are often 60 to 80% of the ceiling.)
</details>

## 4. Worked example

*Made-up numbers.* Chen's 12-page document (8,000 tokens) takes 16 seconds before the first word appears: prefill at 500 tokens per second on his laptop. The summary then writes at 12 tokens per second. To speed up the start, a graphics card would help most; to speed up the writing, a smaller or more tightly quantised model would.

## 5. Practice

1. In Ollama, run `ollama run gemma4:e4b --verbose` and ask a question. Find "prompt eval rate" (prefill) and "eval rate" (decode).
2. A Mac with 170 GB/s and a 16 GB model. What is the decode ceiling?
3. Your job reads 50 long documents and writes one line each. Which speed matters more?

<details>
<summary>Answers</summary>

1. The prompt eval rate is usually many times the eval rate.
2. About 10 tokens per second.
3. Prefill (reading), because almost all the tokens are input.
</details>

**New words:** *prefill* (reading the input), *decode* (writing the output), *time to first token* (the pause before the answer starts), *compute-bound* and *memory-bound*.
