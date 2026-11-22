---
title: 'Memory is king: the model must fit'
summary: The single most important number for local AI is how much fast memory your machine can give the model. Work out what fits on yours, with a simulation.
minutes: 25
updated: 2026-11-22
sources:
  - 'Model download sizes (Gemma 4, Qwen3.8, gpt-oss) from the Ollama library, read 16 November 2026 via BenchLM, https://benchlm.ai/best/ollama-models'
  - 'Mac memory and bandwidth figures: ComputingForGeeks, checked 27 October 2026, https://computingforgeeks.com/best-mac-for-local-llm/'
  - 'DGX Spark memory and bandwidth: LAVX News, 13 June 2026, https://news.lavx.hu/article/amd-prices-ryzen-ai-halo-at-3-999-as-dgx-spark-moves-to-4-699'
  - 'Dettmers, T., Lewis, M., Belkada, Y. and Zettlemoyer, L. (2022), LLM.int8(): 8-bit Matrix Multiplication for Transformers at Scale (memory per weight at lower precision), arXiv:2208.07339 https://arxiv.org/abs/2208.07339'
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

<div class="bigidea">A model only runs fast when all of it fits in fast memory, so the first question about any machine is "how much fast memory can the model have?"</div>

## 1. Why this matters

Most buying mistakes, most "which model?" questions and most speed problems come back to one question: does the model fit in fast memory? Get this right and you will never buy the wrong machine, or download a model your computer cannot run.

## 2. Two kinds of memory

Think of a kitchen. The worktop next to the cooker is small, but everything on it is in reach. The pantry down the hall holds more, but every trip costs time. Computers have both.

- **Graphics memory (VRAM)** sits on a separate graphics card. It is very fast, but usually only 8 to 32 GB. This is the worktop.
- **Main memory (RAM)** is larger but much slower for AI on most PCs. This is the pantry.
- **Unified memory** (Apple Silicon Macs, and AI boxes such as DGX Spark or Ryzen AI Max machines) is one large pool that the graphics side can use at good speed, up to 128 GB or more. A big worktop.

The model runs fastest when all of it, plus the conversation's memory, sits in the fast kind.

## 3. What a model needs

A model needs room for three things:

1. **Weights.** These are the model's learned numbers. Billions of parameters × bits per weight ÷ 8 = GB (8 bits make one byte). A 12B model at 4 bits is about 6 GB of weights. Real files are a little bigger (7.7 GB for Gemma 4 12B) because some parts are kept at higher precision.
2. **Conversation memory (KV cache).** The model keeps notes on every token in the chat so far. It grows with the context length (Lesson 8.4).
3. **Working room** for the engine, about 1 GB.

Here is a 16 GB graphics card filling up, one part at a time:

<div class="steps" data-fig="memory-is-king-stack">
<div class="step"><b>An empty card.</b> The card has 16 GB. The screen and system take about 1 GB, so about 15 GB is left for the model.</div>
<div class="step"><b>Load the weights.</b> Gemma 4 12B at 4-bit is a 7.7 GB file. It goes on the card first. 8.7 GB used.</div>
<div class="step"><b>Add the conversation.</b> For a chat of about 8,000 tokens, the KV cache takes roughly 1.5 GB. 10.2 GB used.</div>
<div class="step"><b>Add working room.</b> The engine needs about 1 GB for its sums. Total 11.2 GB: it fits, with almost 5 GB to spare.</div>
<div class="step"><b>Try a 27B model.</b> At 4-bit its weights are about 27 × 4.8 ÷ 8 ≈ 16.2 GB. The total is now about 19.7 GB. Nearly 4 GB spills over into slow main memory, and writing slows down a lot.</div>
</div>

The sum in one line, where `$P$` is the number of parameters in billions and `$b$` is the bits per weight:

```math
\text{GB needed} \approx \frac{P \times b}{8} + \text{KV cache} + 1
```

<div class="problem" data-problem="memory-is-king-fit"></div>

Now try combinations of your own here:

<!--fig:will-it-fit-->

<div class="meaning">

<dl>
<dt>P</dt><dd>The number of parameters (weights) in the model, in billions. "12B" means P = 12.</dd>
<dt>b</dt><dd>Bits per weight: how precisely each number is stored. 16 is full size; 4 to 5 is the usual shrunk size (Module 8).</dd>
<dt>÷ 8</dt><dd>Turns bits into bytes, so billions of bytes come out as GB.</dd>
<dt>KV cache</dt><dd>The model's notes on the conversation so far. Longer chats need more.</dd>
<dt>Physical meaning</dt><dd>Every one of those billions of numbers must sit in fast memory, ready to be read for every word the model writes. If they do not all fit, some live in slow memory and every word waits for them.</dd>
</dl>

</div>

## 4. The headline rules

- **8 GB laptop:** small models only (Gemma 4 E2B class).
- **16 GB laptop:** up to about 12B at 4-bit.
- **16 GB graphics card:** up to about 14B fully on the card, fast.
- **24 to 32 GB graphics card, or 32 GB Mac:** 27B to 31B models at 4-bit.
- **96 to 128 GB unified memory:** large Mixture-of-Experts models such as gpt-oss-120b (65 GB download).

<div class="problem" data-problem="memory-is-king-largest"></div>

<div class="myth">

**"If the model runs, it fits."** Not quite. Most engines will still start a model that is too big: they quietly put the part that does not fit in main memory. It works, but it can be several times slower (Lesson 4.3). Check that the whole model, plus the conversation, sits in fast memory.

</div>

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

<div class="keypoints">

- A model needs room for its weights, its conversation memory (KV cache) and about 1 GB of working room, all in fast memory.
- Weights in GB ≈ billions of parameters × bits per weight ÷ 8. A 12B model at 4 bits is about 6 GB.
- Graphics memory is fast but small; unified memory on Macs and AI boxes is large and fairly fast; ordinary main memory is slow for AI.
- If a model does not fit, it still runs, but the part in slow memory sets the pace.

</div>
