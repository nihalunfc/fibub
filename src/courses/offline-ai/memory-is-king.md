---
title: 'Memory is king: the model must fit'
summary: The single most important number for local AI is how much fast memory your machine can give the model. Work out what fits on yours, with a simulation.
minutes: 25
updated: 2026-11-18
sources:
  - 'Model download sizes (Gemma 4, Qwen3.8, gpt-oss) from the Ollama library, read 16 November 2026 via BenchLM, https://benchlm.ai/best/ollama-models'
  - 'Mac memory and bandwidth figures: ComputingForGeeks, checked 27 October 2026, https://computingforgeeks.com/best-mac-for-local-llm/'
  - 'DGX Spark memory and bandwidth: LAVX News, 13 June 2026, https://news.lavx.hu/article/amd-prices-ryzen-ai-halo-at-3-999-as-dgx-spark-moves-to-4-699'
quiz:
  - q: A model needs 14 GB. Your PC has 32 GB of main memory and an 8 GB graphics card. Where can it run fast?
    choices: ['Fully on the graphics card', 'Only partly on the graphics card; the rest runs slower on the processor', 'It cannot run at all']
    ans: 1
    why: 8 GB of graphics memory cannot hold 14 GB, so the engine splits it. It runs, but the processor part slows it down.
  - q: Why can a 32 GB Mac run bigger models than a PC with an 8 GB graphics card?
    choices: ['Macs have faster internet', 'The Mac can give most of its 32 GB to the model as fast unified memory', 'Macs use smaller models']
    ans: 1
    why: Apple Silicon shares one memory pool between processor and graphics, so about three quarters of it can hold the model.
  - q: What is the weight memory of an 8-billion-parameter model at 4 bits per weight?
    choices: ['About 1 GB', 'About 4 GB', 'About 32 GB']
    ans: 1
    why: 8 × 4 ÷ 8 = 4 GB, plus working room and the conversation's memory on top.
---

**Module 4 · about 25 minutes · read first: 3.3.** You'll be able to work out which models fit on any machine.

## 1. Why this matters

Buying advice, model choice and most speed problems come back to one question: does the model fit in fast memory? Get this right and you will never buy the wrong machine or download a model that cannot run.

## 2. Two kinds of memory

- **Graphics memory (VRAM)** on a separate graphics card: very fast, but usually 8 to 32 GB.
- **Main memory (RAM)**: larger but much slower for AI on most PCs.
- **Unified memory** (Apple Silicon Macs, and AI boxes such as DGX Spark or Ryzen AI Max machines): one large pool the graphics side can use at good speed, up to 128 GB or more.

The model runs fastest when all of it, plus the conversation's memory, sits in the fast kind.

## 3. What a model needs

1. **Weights:** billions of parameters × bits per weight ÷ 8 = GB. A 12B model at 4 bits is about 6 GB of weights (real files are a little bigger, 7.7 GB for Gemma 4 12B, because some parts are kept at higher precision).
2. **Conversation memory (KV cache):** grows with the context length (Lesson 8.4).
3. **Working room** for the engine.

Try combinations here:

<!--fig:will-it-fit-->

## 4. The headline rules

- **8 GB laptop:** small models only (Gemma 4 E2B class).
- **16 GB laptop:** up to about 12B at 4-bit.
- **16 GB graphics card:** up to about 14B fully on the card, fast.
- **24 to 32 GB graphics card, or 32 GB Mac:** 27B to 31B models at 4-bit.
- **96 to 128 GB unified memory:** large Mixture-of-Experts models such as gpt-oss-120b (65 GB download).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** fit first, then speed. A model that does not fit in fast memory is slow however fast the chip.

**Equation:** needed ≈ (parameters × bits ÷ 8) + KV cache + about 1 GB ≤ usable fast memory.

**Analogy:** a desk and a library. Work goes quickly when every book you need is on the desk. A bigger desk lets you take on bigger projects; a faster reader only helps once the books are there.

**Try it:** a 27B model at 4.8 bits with 1.5 GB of KV cache? (27 × 4.8 ÷ 8 ≈ 16.2 GB + 1.5 + 1 ≈ 18.7 GB: a 24 GB card, yes; a 16 GB card, no.)
</details>

## 5. Worked example

*Made-up numbers.* Divya plans to buy either a laptop with 16 GB or one with 32 GB, 200 dollars apart. In the simulation, the 16 GB laptop runs Gemma 4 12B at 4-bit with 8K context, but the 27B is red. She wants better document answers, so the 32 GB model is worth it to her.

## 6. Practice

1. Set the simulation to your own machine. What is the largest model that fits with 8,000 tokens of context?
2. Change only the context to 128,000 tokens. What happens?
3. On a 16 GB graphics card, which is faster: a 12B at 4-bit or a 27B at 3-bit that only just fits? Why?

<details>
<summary>Answers</summary>

1. Note it down: this is your model size class.
2. The conversation memory grows a lot, and models that fitted may no longer.
3. Usually the 12B: fewer bytes to read per token, and room to spare. The 27B may give better answers but writes more slowly, and 3-bit loses some quality (Lesson 8.2).
</details>

**New words:** *VRAM* (graphics card memory), *RAM* (main memory), *unified memory*, *usable memory* (what is left for the model after the system's share).
