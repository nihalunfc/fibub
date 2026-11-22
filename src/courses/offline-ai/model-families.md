---
title: Model families today and what each is good at
seoTitle: Open AI model families in late 2026 | Offline AI
summary: The main open-weight model families in late 2026, their sizes, licences and strengths, and how to choose one for your machine and your job.
minutes: 25
updated: 2026-11-22
sources:
  - 'Open models, sizes, licences and context lengths: Morph, "Best Open Source LLMs (November 2026)", https://www.morphllm.com/best-open-source-llm'
  - 'Download sizes and Ollama tags, read 16 November 2026 via BenchLM, https://benchlm.ai/best/ollama-models'
  - 'gpt-oss-120b model card: OpenAI on Hugging Face (official page), https://huggingface.co/openai/gpt-oss-120b'
  - 'Shazeer, N. et al. (2017), Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer https://arxiv.org/abs/1701.06538'
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

<div class="bigidea">Model names change every few weeks, but every new release can be placed with three facts: its total size (what memory it needs), its active size (how fast it writes) and its licence.</div>

## 1. Why this matters

New models appear every few weeks, so names date quickly. What lasts is knowing the **families**, their size classes and their licences. A family is a set of models from one maker that share a design and a tokenizer, like car models from one brand. Once you know the families, you can place any new release in seconds.

## 2. The families you can run at home (November 2026)

| Family | Sizes you can run | Licence | Good at |
|---|---|---|---|
| **Gemma 4** (Google) | E2B, E4B, 12B, 26B A4B (MoE), 31B | Apache 2.0 | All-rounder; images in, and audio on the smaller sizes; long context (256K for 31B); phones to desktops |
| **Qwen3.8** (Alibaba) | 27B dense, plus larger MoE models | Apache 2.0 for 27B; others vary | Strong reasoning and coding for its size; long context (262K) |
| **gpt-oss** (OpenAI) | 20B, 120B (MoE, 5.1B active) | Apache 2.0 | Reasoning and tool use; 120B is fast for its size on 128 GB machines |

Two words in that table:

- **Dense:** every parameter is used for every token, like a choir where everyone sings every note.
- **MoE (Mixture-of-Experts):** the model is split into many "experts" and only a few work on each token (Lesson 2.5). "26B A4B" means 26 billion parameters in total, about 4 billion **a**ctive per token.

Try it: set a 3-point gap, then slide the number of questions from 20 to 5000 and press Run 100 tests.

<figure class="fig" data-fig="@ai-bench-noise"><figcaption>A benchmark score is a measurement with error. With few questions a small lead is often just luck; with thousands the better model reliably ranks first. Always ask how many questions.</figcaption></figure>

## 3. The big ones (data-centre size)

Kimi K3 (Moonshot AI, 2.8T parameters), DeepSeek-V4.1-Flash (MIT licence), GLM-5.3 (Z.ai), Meta's Muse Spark Open and others are open too, but need hundreds of GB of memory. They matter for teams that rent servers (Lesson 15.7) and as a sign of where home-sized models will be in a year or two.

## 4. Choosing

1. **Fit:** pick the biggest size class that fits your fast memory with room for context (Lesson 4.1).
2. **Job:** coding and maths favour strong reasoners; document work and many languages favour broad all-rounders; images or audio need a **multimodal** model (one that reads pictures or sound as well as text).
3. **Licence:** check it matches your use (Lesson 7.2).
4. **Try two:** run the same five real tasks on two candidates and keep the one that does your work better. Benchmarks guide; your own tasks decide (Lesson 7.4).

### Watch it happen: placing a new release in four reads

<div class="steps">
<div class="step"><p><b>The announcement.</b> "New model: <b>60B A6B</b>, Apache 2.0, 128K context." Three numbers and a licence. Here is what each tells you.</p></div>
<div class="step"><p><b>Memory from the total.</b> All 60B parameters must sit in memory. At about 4.8 bits each: 60 × 4.8 ÷ 8 = <b>36 GB</b>. That needs a 48 to 64 GB machine.</p></div>
<div class="step"><p><b>Speed from the active part.</b> Each token reads only the 6B active weights: 6 × 4.8 ÷ 8 = <b>3.6 GB</b> per token. It writes about as fast as a 6B model, ten times less reading than a 60B dense model.</p></div>
<div class="step"><p><b>Licence and context.</b> Apache 2.0: fine for paid work. 128K context: long reports fit, if you have memory left for it (Lesson 8.4).</p></div>
<div class="step"><p><b>Verdict.</b> A good fit for a 64 GB Mac; too big for a 16 GB laptop. Shortlist it, then test it on your own five tasks.</p></div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a Mixture-of-Experts model needs memory for all its parameters but reads only its active ones per token.

**Equation:** memory ∝ total parameters; writing speed ∝ 1 ÷ active parameters.

```math
\text{memory (GB)} \approx \frac{P_{\text{total}} \times b}{8}, \qquad \text{top speed} \approx \frac{\text{bandwidth}}{P_{\text{active}} \times b / 8}
```

**Analogy:** a hospital with many specialists. The building must hold them all, but each patient sees only two or three, so patients move through quickly.

**Try it:** gpt-oss-120b has 117B total and 5.1B active. How many times fewer weights are read per token than a 117B dense model? (117 ÷ 5.1 ≈ 23 times.)
</details>

<div class="meaning">

<dl>
<dt>P<sub>total</sub></dt><dd>all the parameters, in billions: the "26B" in "26B A4B"</dd>
<dt>P<sub>active</sub></dt><dd>the parameters actually used for each token: the "A4B"</dd>
<dt>b</dt><dd>bits per weight after quantisation, about 4.5 to 4.8 for a typical 4-bit file</dd>
<dt>bandwidth</dt><dd>how many GB per second your memory can be read</dd>
<dt>Physical meaning</dt><dd>The total decides whether the model fits in the building; the active part decides how fast patients get through. An MoE model is a big building with short queues.</dd>
</dl>

</div>

<div class="problem" data-problem="model-families-moe-memory"></div>

<div class="problem" data-problem="model-families-moe-speed"></div>

<div class="myth">

**"An MoE model with 4B active needs only as much memory as a 4B model."** It needs memory for all its parameters, because any expert may be chosen for the next token. The small active part makes it fast, not small.

</div>

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

<div class="keypoints">

- The home-sized families in late 2026: Gemma 4, Qwen3.8 and gpt-oss, all with Apache 2.0 options.
- Memory follows the total parameters; writing speed follows the active parameters.
- "26B A4B" means 26 billion in total, about 4 billion active per token.
- Choose by fit, job and licence, then test two candidates on your own tasks.

</div>
