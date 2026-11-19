---
title: Five myths about running AI at home
summary: You do not need a supercomputer, local models are not useless, it is not free, offline is not automatically safe, and local is not always slow.
minutes: 20
updated: 2026-11-18
sources:
  - 'Open model list and sizes: Morph, "Best Open Source LLMs (November 2026)", https://www.morphllm.com/best-open-source-llm'
  - 'Mac speeds (gpt-oss-120b on M5 Max, measured with MLX): ComputingForGeeks, prices checked 27 October 2026, https://computingforgeeks.com/best-mac-for-local-llm/'
  - 'Graphics card prices in 2026: Compute Market, updated 1 November 2026, https://www.compute-market.com/blog/gpu-market-trends-pricing-2026'
quiz:
  - q: Which statement is true?
    choices: ['Local AI is free once installed, with no costs at all', 'Local AI costs hardware, electricity and your time, but has no usage limit', 'Local AI is always slower than the cloud']
    ans: 1
    why: There is no meter on use, but the hardware, power and setup time are real costs.
  - q: Why is a model file from an unknown website a risk even if you run it offline?
    choices: ['It may contain harmful code or have been tampered with', 'It will use up your internet data', 'Offline models cannot be risky']
    ans: 0
    why: Some file formats can carry code, and a changed model can behave badly. Lesson 7.6 covers safe downloads.
  - q: Do you need a graphics card to start?
    choices: ['Yes, at least 24 GB', 'No, small models run on an ordinary laptop', 'Only on Windows']
    ans: 1
    why: Small models run on the main processor of an ordinary 8 to 16 GB laptop. A graphics card makes them faster.
---

**Module 1 · about 20 minutes · read first: 1.2 and 1.3.** You'll be able to answer the five things people most often get wrong about local AI.

## 1. Why this matters

Myths cost money in both directions: some people buy a powerful machine they do not need, others never start because they think they need one. A clear view of each myth sets your expectations right for the rest of the course.

## 2. Myth 1: "You need a supercomputer"

**Reality:** you can start on the laptop you have. Small models of 1 to 4 billion parameters run on 8 GB of memory, and some, such as Google's Gemma 4 E2B, are made to run on phones. A 16 GB laptop runs models of about 12 billion parameters, which handle summaries, rewriting and everyday questions well. Bigger hardware buys you bigger, smarter models and more speed, not the ability to start.

## 3. Myth 2: "Local models are useless compared with the cloud"

**Reality:** the best cloud models still lead on the hardest tasks, but the gap has narrowed a lot. In late 2026 open models such as Qwen3.8-27B and Gemma 4 31B run on a single 24 to 32 GB machine, and gpt-oss-120b runs on 128 GB machines. For a large share of daily work (drafting, summarising, extracting, coding help, searching your own files) a good local model is enough. Lesson 17.1 maps where the gap remains.

## 4. Myth 3: "Once it's installed, it's free"

**Reality:** there is no meter on use, which is a big deal (Lesson 3.9), but there are costs:

- **hardware**, unless you use what you own, and graphics card prices rose sharply in 2026 because of a memory shortage (Lesson 5.7);
- **electricity**, small for a laptop, noticeable for a big desktop running all day (Module 6);
- **your time** to set it up and keep it updated.

## 5. Myth 4: "Offline means safe"

**Reality:** offline protects your data from being sent away. It does not protect you from:

- a **tampered model file** or a file format that can carry code, from an untrusted source (Lesson 7.6);
- **plug-ins** that quietly go online (Lesson 1.3);
- **prompt injection**: a document that contains hidden instructions the model follows (Lesson 17.6);
- **wrong answers**, which a local model gives as confidently as a cloud one (Lesson 2.7).

## 6. Myth 5: "Local is always slow"

**Reality:** speed depends on memory speed and model size (Module 4). A small model on a graphics card can write faster than you can read. Even large models can be quick on the right hardware: one test measured gpt-oss-120b at about 88 tokens per second on a 128 GB M5 Max Mac. Where local is slow is with big models on modest machines, and with very long documents.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** writing speed is limited by how fast the machine can read the model's numbers from memory, once per word piece (token).

**Equation:** top speed (tokens per second) ≈ memory bandwidth (GB/s) ÷ model size in memory (GB).

**Analogy:** a librarian who must walk the whole library once for every word. A smaller library or a faster librarian means more words per minute. It breaks down for Mixture-of-Experts models, where only part of the library is visited each time (Lesson 2.5), which is why gpt-oss-120b is faster than its size suggests.

**Try it:** memory at 100 GB/s and a 5 GB model? (100 ÷ 5 = at most 20 tokens per second, a comfortable reading pace.)
</details>

## 7. Worked example

*Made-up numbers.* A teacher assumes she must buy a new computer. Her laptop has 16 GB and memory that reads at about 100 GB/s. A 4-bit, 8-billion-parameter model takes about 5 GB, so the top speed is about 100 ÷ 5 = 20 tokens per second. She reads at about 5 words a second (roughly 7 tokens), so the model writes about three times faster than she reads. She does not need new hardware to start.

## 8. Practice

1. Which myth did you believe before this lesson?
2. A machine has memory bandwidth of 400 GB/s. About how fast could it run a 20 GB model?
3. Name one risk that offline does not remove.

<details>
<summary>Answers</summary>

1. Most people pick 1 or 3. Both are why the course starts with what you already have.
2. 400 ÷ 20 = at most 20 tokens per second; real speeds are a bit lower.
3. Any of: tampered model files, plug-ins that go online, prompt injection, confident wrong answers.
</details>

**New words:** *memory bandwidth* (how fast memory can be read, in GB/s), *prompt injection* (hidden instructions inside content the model reads), *tokens per second* (how fast a model writes).
