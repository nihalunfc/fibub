---
title: Model families today and what each is good at
seoTitle: Open AI model families in late 2026 | Offline AI
summary: The main open-weight model families in late 2026, their sizes, licences and strengths, and how to choose one for your machine and your job.
minutes: 25
updated: 2026-11-18
sources:
  - 'Open models, sizes, licences and context lengths: Morph, "Best Open Source LLMs (November 2026)", https://www.morphllm.com/best-open-source-llm'
  - 'Download sizes and Ollama tags, read 16 November 2026 via BenchLM, https://benchlm.ai/best/ollama-models'
quiz:
  - q: What does "26B A4B" in Gemma 4 26B A4B mean?
    choices: ['26 billion parameters in total, about 4 billion active per token', '26 bits and 4 bytes', 'Version 26, build 4']
    ans: 0
    why: 'It is a Mixture-of-Experts model: 26B in total, but only about 4B are used for each token, so it writes faster than a 26B dense model.'
  - q: Why can't most people run the largest open models such as Kimi K3 at home?
    choices: ['They are secret', 'They have hundreds of billions to trillions of parameters and need hundreds of GB of memory', 'They only speak Chinese']
    ans: 1
    why: Kimi K3 has 2.8 trillion parameters. Even shrunk, that needs data-centre hardware.
  - q: Before using a model at work, what must you check?
    choices: ['Its logo', 'Its licence, for commercial use and any limits', 'Its file name length']
    ans: 1
    why: 'Licences differ: Apache 2.0 and MIT allow commercial use; some community licences have conditions; some are non-commercial.'
---

**Module 7 · about 25 minutes · read first: 4.1 and 7.1.** You'll be able to name the main families, what fits your machine, and which to try first for your job.

## 1. Why this matters

New models appear every few weeks, so names date quickly. What lasts is knowing the families, their size classes and their licences, so you can place any new release in seconds.

## 2. The families you can run at home (November 2026)

| Family | Sizes you can run | Licence | Good at |
|---|---|---|---|
| **Gemma 4** (Google) | E2B, E4B, 12B, 26B A4B (MoE), 31B | Apache 2.0 | All-rounder; images in, and audio on the smaller sizes; long context (256K for 31B); phones to desktops |
| **Qwen3.8** (Alibaba) | 27B dense, plus larger MoE models | Apache 2.0 for 27B; others vary | Strong reasoning and coding for its size; long context (262K) |
| **gpt-oss** (OpenAI) | 20B, 120B (MoE, 5.1B active) | Apache 2.0 | Reasoning and tool use; 120B is fast for its size on 128 GB machines |

## 3. The big ones (data-centre size)

Kimi K3 (Moonshot AI, 2.8T parameters), DeepSeek-V4.1-Flash (MIT licence), GLM-5.3 (Z.ai), Meta's Muse Spark Open and others are open too, but need hundreds of GB of memory. They matter for teams that rent servers (Lesson 15.7) and as a sign of where home-sized models will be in a year or two.

## 4. Choosing

1. **Fit:** pick the biggest size class that fits your fast memory with room for context (Lesson 4.1).
2. **Job:** coding and maths favour strong reasoners; document work and many languages favour broad all-rounders; images or audio need a multimodal model.
3. **Licence:** check it matches your use.
4. **Try two:** run the same five real tasks on two candidates and keep the one that does your work better. Benchmarks guide; your own tasks decide (Lesson 7.4).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a Mixture-of-Experts model needs memory for all its parameters but reads only its active ones per token.

**Equation:** memory ∝ total parameters; writing speed ∝ 1 ÷ active parameters.

**Analogy:** a hospital with many specialists. The building must hold them all, but each patient sees only two or three, so patients move through quickly.

**Try it:** gpt-oss-120b has 117B total and 5.1B active. How many times fewer weights are read per token than a 117B dense model? (117 ÷ 5.1 ≈ 23 times.)
</details>

## 5. Worked example

*Made-up numbers.* A small accounting firm has a 32 GB Mac. They try Gemma 4 31B and Qwen3.8-27B on five real tasks (two summaries, a spreadsheet formula, an email draft, a policy question). Qwen wins the formula; Gemma wins the summaries and emails. They keep both and choose per job.

## 6. Practice

1. Which family and size would you try first on your machine?
2. Write five real tasks from your own work to test models with.
3. A new model is announced as "60B A6B, Apache 2.0, 128K". Place it: memory class, speed, licence.

<details>
<summary>Answers</summary>

1. Use your result from the simulation in 4.1.
2. Keep them; you will reuse them in Lesson 7.4 and the capstone.
3. Memory like a 60B model (about 36 GB at 4-bit, so a 48 to 64 GB machine); speed like a 6B model; free for commercial use.
</details>

**New words:** *family* (models from one maker that share a design and tokenizer), *dense* (every parameter used per token), *MoE* (only some experts used per token), *multimodal* (reads images or audio as well as text).
