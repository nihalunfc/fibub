---
title: Five myths about running AI at home
summary: You do not need a supercomputer, local models are not useless, it is not free, offline is not automatically safe, and local is not always slow.
minutes: 20
updated: 2026-11-22
sources:
  - 'llama.cpp, official repository (runs models on ordinary CPUs as well as GPUs) https://github.com/ggml-org/llama.cpp'
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

<div class="bigidea">Local AI is neither magic nor useless: it runs on ordinary computers, costs real money and time, and is only as safe and as fast as you set it up to be.</div>

## 1. Why this matters

Myths cost money in both directions. Some people buy a powerful machine they do not need. Others never start because they think they need one. A clear view of each myth sets your expectations right for the rest of the course.

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

**Reality:** speed depends on two things: how fast the memory is, and how big the model is (Module 4). A small model on a graphics card can write faster than you can read. Even large models can be quick on the right hardware: one test measured gpt-oss-120b at about 88 tokens per second on a 128 GB M5 Max Mac. (A **token** is a word or piece of a word; Module 3 explains.) Local is slow with big models on modest machines, and with very long documents.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** writing speed is limited by how fast the machine can read the model's numbers from memory, once per word piece (token).

**Equation:** top speed (tokens per second) ≈ memory bandwidth (GB/s) ÷ model size in memory (GB).

**Analogy:** a librarian who must walk the whole library once for every word. A smaller library or a faster librarian means more words per minute. It breaks down for Mixture-of-Experts models, where only part of the library is visited each time (Lesson 2.5), which is why gpt-oss-120b is faster than its size suggests.

**Try it:** memory at 100 GB/s and a 5 GB model? (100 ÷ 5 = at most 20 tokens per second, a comfortable reading pace.)
</details>

<div class="meaning">

<dl>
<dt>bandwidth (GB/s)</dt><dd>how many gigabytes the memory can hand to the processor each second</dd>
<dt>model size (GB)</dt><dd>how much memory the model's numbers take up</dd>
<dt>tokens per second</dt><dd>how many word pieces the model can write each second, at most</dd>
<dt>Physical meaning</dt><dd>To write each word piece, the machine has to read through the whole model once. A machine with fast memory and a small model writes quickly; a big model on a slow laptop writes slowly. That is why "local is slow" is true for some setups and false for others.</dd>
</dl>

</div>

## 7. Worked example

*Made-up numbers.* A teacher assumes she must buy a new computer. Step through her check.

<div class="steps">
<div class="step"><p><b>Her laptop.</b> 16 GB of memory that reads at about <b>100 GB/s</b>.</p></div>
<div class="step"><p><b>The model.</b> An 8-billion-parameter model at 4 bits: 8 × 4 ÷ 8 = 4 GB of weights, about <b>5 GB</b> with everything it needs.</p></div>
<div class="step"><p><b>Top speed.</b> Every token means one pass through those 5 GB: 100 ÷ 5 = <b>20 tokens per second</b> at most.</p></div>
<div class="step"><p><b>Her reading speed.</b> About 5 words a second, roughly <b>7 tokens</b>. The model writes about 20 ÷ 7 ≈ <b>3 times</b> faster than she reads. She does not need new hardware to start.</p></div>
</div>

<div class="problem" data-problem="local-ai-myths-speed"></div>

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

<div class="keypoints">

- You can start on an ordinary 8 to 16 GB laptop; bigger hardware buys bigger models and more speed.
- Good open models now handle most everyday work; the best cloud models still lead on the hardest tasks.
- Local AI has no usage meter, but hardware, electricity and your time are real costs.
- Offline keeps your data home; it does not protect against tampered files, prompt injection or wrong answers.
- Top speed ≈ memory bandwidth (GB/s) ÷ model size (GB) tokens per second.

</div>
