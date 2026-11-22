---
title: 'Memory limits: model, context and cache'
summary: What fills your machine's memory when a model runs (weights, KV cache, working space), why long contexts are the hidden cost, and every way to make a model fit.
minutes: 20
updated: 2026-11-22
sources:
  - 'llama.cpp: KV cache types (--cache-type-k, --cache-type-v) and context size (official README), https://github.com/ggml-org/llama.cpp'
  - 'Ainslie et al., "GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints", 2023, https://arxiv.org/abs/2305.13245'
  - 'Kwon et al., "Efficient Memory Management for Large Language Model Serving with PagedAttention" (KV cache memory), 2023, https://arxiv.org/abs/2309.06180'
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

<div class="bigidea">Weights, the KV cache for the context and the engine's working space must all fit in fast memory at once, and the cache, which grows with every token of context, is the part people forget.</div>

## 1. Why this matters

"Out of memory" is the most common local AI error. The second most common is a model that quietly spills into slower normal memory and crawls. Both come from the same budget: everything must fit in the fast memory at once.

## 2. The three shares

Picture a desk. The weights are the reference books that never leave it; the KV cache is the pile of notes that grows with every page you read; working space is the elbow room you need to write.

1. **Weights:** parameters × bits per weight ÷ 8. A 27B model at 4.5 bits is about 15 GB. Fixed.
2. **KV cache:** the model's notes on every token it has read so far, so it does not reread them (Lesson 8.4). It grows with every token of context, for every parallel user (Lesson 15.1).
3. **Working space:** the engine's scratch memory, plus whatever the operating system and other apps hold. On a Mac or AI box, the system shares the same memory.

Try a model, quant, context and device:

<!--fig:will-it-fit-->

And the KV cache on its own, from real model designs:

<!--fig:kv-cache-->

<div class="steps">
<div class="step"><p><b>The weights.</b> Sam's 16 GB card holds a 12B model at Q4: about <b>7.7 GB</b>. That part never changes.</p></div>
<div class="step"><p><b>A huge context.</b> Sam sets 131,072 tokens. At about 0.125 MB per token (16-bit cache, a round number for illustration) the engine wants 131,072 × 0.125 MB = <b>16 GB</b> of cache. 7.7 + 16 is more than the card: it refuses to load.</p></div>
<div class="step"><p><b>Right-size the context.</b> 32,768 tokens is plenty for Sam's work. Cache: 32,768 × 0.125 MB = <b>4 GB</b>. With about 1.5 GB of working space: 13.2 GB.</p></div>
<div class="step"><p><b>Shrink the cache.</b> An 8-bit cache halves it to <b>2 GB</b>. Total about 11.2 GB, leaving room for the system, with little loss of quality.</p></div>
</div>

Try it: lower the bits to 3 or 2, then compare one scale for everything against one per block of 32.

<figure class="fig" data-fig="@ai-quant-grid"><figcaption>Fewer bits means fewer levels, so every weight is rounded more. One outlier stretches a shared scale and crushes the small weights, which is why formats give each small block its own scale.</figcaption></figure>

## 3. Ways to make it fit, cheapest first

1. **Use only the context you need.** Engines reserve memory for the full context you set (Lesson 10.3).
2. **Quantise the KV cache** to 8-bit (`--cache-type-k q8_0 --cache-type-v q8_0` in llama.cpp; Ollama has a similar setting).
3. **A smaller quant of the weights** (Q4_K_M instead of Q6_K; Lesson 8.5).
4. **Fewer parallel slots** on a shared server.
5. **A smaller or MoE model** whose active part fits (Lesson 2.5).
6. **Offload some layers** to normal memory: it fits, but it is much slower.
7. **More memory:** a bigger card, a second card (Lesson 15.3) or a unified-memory machine.

Try it: choose a 32B model at 4-bit, then slide the GPU memory from none up to 24 GB.

<figure class="fig" data-fig="@ai-gpu-offload"><figcaption>Every generated token reads every layer, so the slow part (layers left on the CPU) sets the speed. Each extra layer moved to the GPU helps a little, and the last ones help most.</figcaption></figure>

## 4. Hard limits

Some things memory cannot fix at home. Frontier-scale open models at full quality need hundreds of gigabytes to terabytes, and a million-token context on a large model needs far more memory than any home machine has. Those jobs belong in the cloud or on rented hardware (Lesson 15.7).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** fast memory needed = weights + KV cache + working space, and all of it must fit at once.

**Equation:** KV cache = 2 × layers × KV heads × head size × bytes per number × tokens (× users).

**Analogy:** a desk. The weights are the reference books that never leave; the KV cache is the pile of notes, growing with every page you read.

**Try it:** an 8B model with 0.125 MB per token, at 32,768 tokens, 16-bit cache? (32,768 × 0.125 MB = 4 GB, on top of the weights. At 8-bit, about 2 GB.)
</details>

```math
\text{KV} = 2 \times L \times H_{kv} \times d \times b \times T \times U
```

<div class="meaning">

<dl>
<dt>2</dt><dd>one key and one value are stored for every token</dd>
<dt>L</dt><dd>layers in the model; each layer keeps its own notes</dd>
<dt>H<sub>kv</sub></dt><dd>key-value heads per layer (often fewer than the attention heads, which saves memory)</dd>
<dt>d</dt><dd>head size: how many numbers describe one token in one head (often 128)</dd>
<dt>b</dt><dd>bytes per number: 2 at 16-bit, 1 at 8-bit</dd>
<dt>T × U</dt><dd>tokens of context times parallel users</dd>
<dt>Physical meaning</dt><dd>Every token the model has read leaves a small, fixed-size note in every layer. Double the context and the notes double; serve four people and they quadruple. The weights are the book; the cache is your highlighting, and long books get a lot of it.</dd>
</dl>

</div>

<div class="problem" data-problem="memory-limits-kv"></div>

<div class="myth">

**"If the model file fits in memory, the model fits."** The file is only the weights. The KV cache for your context and the engine's working space come on top, and at long contexts the cache can be as big as the model itself. Leave room, or set a smaller context.

</div>

Try it: press Play and watch the oldest messages fall out of the window; compare the three ways of handling a full window.

<figure class="fig" data-fig="@ai-context-slide"><figcaption>The model only sees what fits in the window. Dropping the oldest messages loses early facts like the user's name; pinning the system prompt or summarising keeps what matters at a small cost.</figcaption></figure>

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

<div class="keypoints">

- Fast memory must hold the weights, the KV cache and working space all at once.
- KV cache = 2 × layers × KV heads × head size × bytes × tokens × users: it grows with context and users.
- Cheapest fixes first: a smaller context, an 8-bit cache, a smaller quant, fewer parallel slots.
- Offloading layers to normal memory makes it fit but much slower.
- Frontier-size models and million-token contexts are beyond any home machine.

</div>
