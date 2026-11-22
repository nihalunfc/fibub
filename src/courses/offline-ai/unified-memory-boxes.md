---
title: 128 GB AI boxes
summary: Small machines with 128 GB of unified memory, such as NVIDIA DGX Spark, AMD Ryzen AI Halo boxes and the Mac Studio, that run very large models at home.
minutes: 20
updated: 2026-11-22
sources:
  - 'DGX Spark US$4,699 and AMD Ryzen AI Halo US$3,999: LAVX News, 13 June 2026, https://news.lavx.hu/article/amd-prices-ryzen-ai-halo-at-3-999-as-dgx-spark-moves-to-4-699'
  - 'Mac Studio M5 Max 128 GB US$5,099: Daring Fireball, August 2026, https://daringfireball.net/2026/08/configurations_and_pricing_for_new_mac_minis_and_mac_studios'
  - 'gpt-oss-120b download size 65 GB: Ollama library, read 17 November 2026 via BenchLM, https://benchlm.ai/best/ollama-models'
  - 'Shazeer, N. et al. (2017), Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer, arXiv:1701.06538 https://arxiv.org/abs/1701.06538'
quiz:
  - q: What is the main reason to buy a 128 GB box?
    choices: ['To run very large models (such as gpt-oss-120b) on one quiet machine', 'For the fastest 8B model', 'For gaming']
    ans: 0
    why: Only large unified memory holds 60 GB+ models at a home price.
  - q: Why do mixture-of-experts models suit these boxes well?
    choices: ['They are small files', 'They read only a few billion parameters per token, so medium bandwidth still writes quickly', 'They need no memory']
    ans: 1
    why: The box holds the whole model; each token reads just the active experts (about 5B for gpt-oss-120b).
  - q: How does a DGX Spark differ from a Mac Studio?
    choices: ['It runs Linux and NVIDIA software; the Mac runs macOS with Metal and MLX', 'It has no memory', 'It is a laptop']
    ans: 0
    why: Same memory size class, different software worlds. Pick the one your tools support.
---

**Module 5 · about 20 minutes · read first: 2.5, 4.2 and 5.3.** You'll be able to decide whether a 128 GB box is worth it for you.

<div class="bigidea">A 128 GB box has room for a huge Mixture-of-Experts model, and because each token reads only a small part of it, medium-speed memory still writes quickly.</div>

## 1. Why this matters

Models such as gpt-oss-120b (65 GB) and other large mixture-of-experts models are much stronger than 12B models at reasoning and long documents. In 2026 a box the size of a book can hold them. It costs as much as a used car in some countries, so be sure you need it.

<!--fig:build-rig-->

## 2. The three main choices

| Box | Memory and speed | Software | USA price |
|---|---|---|---|
| AMD Ryzen AI Halo class | 128 GB, about 256 GB/s | Windows or Linux; llama.cpp, LM Studio, Ollama | US$3,999 |
| NVIDIA DGX Spark | 128 GB, 273 GB/s | Linux, CUDA; most AI tools | US$4,699 |
| Mac Studio M5 Max, 128 GB | 128 GB, about 614 GB/s | macOS; MLX, LM Studio, Ollama | US$5,099 |

Prices in India, Canada and the UK change often and partner models vary: **check the official store or an authorised seller.** The Mac Studio's base model starts at ₹2,79,900, CA$3,499 and £2,499 with 36 GB, and 128 GB costs much more.

Try it: choose a 32B model at 4-bit, then slide the GPU memory from none up to 24 GB.

<figure class="fig" data-fig="@ai-gpu-offload"><figcaption>Every generated token reads every layer, so the slow part (layers left on the CPU) sets the speed. Each extra layer moved to the GPU helps a little, and the last ones help most.</figcaption></figure>

## 3. Why big MoE models suit these boxes

A Mixture-of-Experts model is like a hospital full of specialists. Every patient needs a bed in the building, but each one sees only one or two doctors. The box must hold every expert (the whole file), but each token only reads the few experts a small "router" picks for it.

<div class="steps">
<div class="step"><b>Load the whole model.</b> gpt-oss-120b is a 65 GB download. It fits in 128 GB with room for a long conversation and other apps.</div>
<div class="step"><b>One token arrives.</b> The router picks a few experts. Only about 5.1 billion parameters are used for this token, out of about 117 billion.</div>
<div class="step"><b>Bytes read.</b> At about 4.25 bits per weight: 5.1 × 4.25 ÷ 8 ≈ 2.7 GB read for this token, not 65 GB.</div>
<div class="step"><b>Speed.</b> On a 273 GB/s box: 273 ÷ 2.7 ≈ 100 tokens per second ceiling. Real engines get perhaps 30 to 50, because of overheads.</div>
<div class="step"><b>Compare a dense 70B.</b> It reads all its weights, about 40 GB, for every token: 273 ÷ 40 ≈ 7 tokens per second. The bigger model writes far faster.</div>
</div>

With `$A$` the active parameters in billions and `$b$` the bits per weight:

```math
\text{tokens per second} \lesssim \frac{\text{bandwidth}}{A \times b / 8}
```

<div class="problem" data-problem="unified-memory-boxes-moe"></div>

<div class="meaning">

<dl>
<dt>A (active parameters)</dt><dd>The parameters actually used for one token: about 5.1 billion for gpt-oss-120b.</dd>
<dt>A × b ÷ 8</dt><dd>GB read from memory for each token.</dd>
<dt>Total parameters</dt><dd>All the experts together. They decide how much memory you need, not how fast it writes.</dd>
<dt>Physical meaning</dt><dd>You need a building big enough for every specialist, but each visit only walks to one or two rooms. Big memory pays for the building; medium bandwidth is enough for the short walks.</dd>
</dl>

</div>

<div class="myth">

**"A 120B model must be slower than a 70B model."** Only if both are dense. A 120B Mixture-of-Experts model that reads about 5B parameters per token writes many times faster than a dense 70B that reads all 70B. Size tells you the memory; active parameters tell you the speed.

</div>

## 4. What they are good at, and not

- **Good:** big mixture-of-experts models at 20 to 40 tokens per second, several models loaded at once, a quiet office server (Lesson 5.5).
- **Less good:** big dense models (a dense 70B reads about 40 GB per token: 273 ÷ 40 ≈ 7 tokens per second), and reading very long prompts compared with a big graphics card.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** big memory plus mixture-of-experts gives large-model quality at medium bandwidth.

**Equation:** speed ≈ bandwidth ÷ (active parameters × bits ÷ 8). For gpt-oss-120b at about 4.25 bits: 5.1 × 4.25 ÷ 8 ≈ 2.7 GB per token.

**Analogy:** a huge library where each question needs only one shelf: you need room for all shelves, but you only walk to one.

**Try it:** gpt-oss-120b on a 273 GB/s box? (273 ÷ 2.7 ≈ 100 tokens per second ceiling; real engines get perhaps 30 to 50 because of overheads.)
</details>

## 5. Worked example

*Made-up numbers.* A small law office, Northbank Legal, compares one 128 GB box (US$4,699) against cloud plans for five staff. They need client files kept in the office. The box runs gpt-oss-120b for drafting and summaries all day. Module 16 shows how to check the break-even; here, privacy settles it.

## 6. Practice

1. Which of the three would run your favourite tools today?
2. Why is a dense 70B slow on these boxes but a 120B mixture-of-experts quick?
3. What would you check before buying one outside the USA?

<details>
<summary>Answers</summary>

1. Linux and NVIDIA tools: Spark; Windows: Ryzen AI box; macOS and MLX: Mac Studio.
2. The dense model reads all 70B parameters per token; the MoE reads about 5B.
3. Local price and tax, warranty in your country, plug type and import duty (Lesson 5.6).
</details>

**New words:** *unified-memory box*, *active parameters*, *authorised seller*.

<div class="keypoints">

- 128 GB boxes (Ryzen AI Halo class, DGX Spark, Mac Studio) hold 60 GB+ models in one quiet machine.
- Memory needed depends on total parameters; speed depends on active parameters read per token.
- Speed ceiling ≈ bandwidth ÷ (active billions × bits ÷ 8): about 100 tokens per second for gpt-oss-120b on 273 GB/s.
- Big dense models are slow on these boxes; pick the box whose software matches your tools.

</div>
