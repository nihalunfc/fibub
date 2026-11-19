---
title: 'Memory limits: model, context and cache'
summary: What fills your machine's memory when a model runs (weights, KV cache, working space), why long contexts are the hidden cost, and every way to make a model fit.
minutes: 20
updated: 2026-11-19
sources:
  - 'llama.cpp: KV cache types (--cache-type-k, --cache-type-v) and context size (official README), https://github.com/ggml-org/llama.cpp'
  - 'Ainslie et al., "GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints", 2023, https://arxiv.org/abs/2305.13245'
quiz:
  - q: What three things share the memory when a model runs?
    choices: ['The weights, the KV cache for the context, and working space', 'Only the weights', 'The download and the installer']
    ans: 0
    why: Weights are fixed; the KV cache grows with context length; the engine needs some working space too.
  - q: A model fits with a 4,096-token context but crashes at 131,072. Why?
    choices: ['The KV cache grew 32 times larger', 'The model changed', 'The disk filled']
    ans: 0
    why: KV cache size is proportional to the number of tokens in the context.
  - q: Which change frees the most memory with the least loss of quality, for a long-context job?
    choices: ['An 8-bit KV cache, and only as much context as the job needs', 'A 2-bit model', 'Closing the browser only']
    ans: 0
    why: An 8-bit cache roughly halves cache memory with little quality loss; right-sizing context avoids reserving memory you never use.
---

**Module 17 · about 20 minutes · read first: 4.1, 8.4 and 10.3.** You'll be able to tell why a model does not fit and pick the cheapest fix.

## 1. Why this matters

"Out of memory" is the most common local AI error, and the second most common is a model that quietly spills into slower normal memory and crawls. Both come from the same budget: everything must fit in the fast memory at once.

## 2. The three shares

1. **Weights:** parameters × bits per weight ÷ 8. A 27B model at 4.5 bits is about 15 GB. Fixed.
2. **KV cache:** grows with every token of context, for every parallel user (Lesson 15.1).
3. **Working space:** the engine's scratch memory, plus whatever the operating system and other apps hold. On a Mac or AI box, the system shares the same memory.

Try a model, quant, context and device:

<!--fig:will-it-fit-->

And the KV cache on its own, from real model designs:

<!--fig:kv-cache-->

## 3. Ways to make it fit, cheapest first

1. **Use only the context you need.** Engines reserve memory for the full context you set (Lesson 10.3).
2. **Quantise the KV cache** to 8-bit (`--cache-type-k q8_0 --cache-type-v q8_0` in llama.cpp; Ollama has a similar setting).
3. **A smaller quant of the weights** (Q4_K_M instead of Q6_K; Lesson 8.5).
4. **Fewer parallel slots** on a shared server.
5. **A smaller or MoE model** whose active part fits (Lesson 2.5).
6. **Offload some layers** to normal memory: it fits, but it is much slower.
7. **More memory:** a bigger card, a second card (Lesson 15.3) or a unified-memory machine.

## 4. Hard limits

Some things memory cannot fix at home: frontier-scale open models at full quality need hundreds of gigabytes to terabytes, and a million-token context on a large model needs far more memory than any home machine has. Those jobs belong in the cloud or on rented hardware (Lesson 15.7).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** fast memory needed = weights + KV cache + working space, and all of it must fit at once.

**Equation:** KV cache = 2 × layers × KV heads × head size × bytes per number × tokens (× users).

**Analogy:** a desk. The weights are the reference books that never leave; the KV cache is the pile of notes, growing with every page you read.

**Try it:** an 8B model with 0.125 MB per token, at 32,768 tokens, 16-bit cache? (32,768 × 0.125 MB = 4 GB, on top of the weights. At 8-bit, about 2 GB.)
</details>

## 5. Worked example

*Made-up machine.* Sam's 16 GB card holds a 12B model at Q4 (about 7.7 GB). With a 131,072-token context the engine refuses to load. Setting the context to 32,768 and an 8-bit KV cache brings the total under 13 GB, leaving room for the system. For the rare 100-page document, Sam uses document search instead of pasting it all in.

## 6. Practice

1. Add up weights, cache and working space for your favourite model at 8,192 and 65,536 tokens.
2. Which fix would you try first for a shared server that runs out of memory at busy times?
3. Why is offloading layers a last resort?

<details>
<summary>Answers</summary>

1. Use the two calculators above; add 1 to 2 GB of working space.
2. Fewer parallel slots, or a smaller context per slot.
3. Normal memory is many times slower, so speed falls sharply.
</details>

**New words:** *working space*, *KV cache quantisation*, *offloading*, *out of memory*.
