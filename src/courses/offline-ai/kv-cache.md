---
title: 'The KV cache: the hidden memory cost of long context'
summary: Why long conversations and big documents need extra memory on top of the model, how to work out how much, and the settings that shrink it.
minutes: 20
updated: 2026-11-22
sources:
  - 'Llama 3.1 8B and Llama 2 7B architecture (layers, key-value heads, head size): config.json on each model page, Meta (official page), https://huggingface.co/meta-llama'
  - 'Qwen2.5-32B architecture: config.json, Qwen (official page), https://huggingface.co/Qwen/Qwen2.5-32B-Instruct'
  - 'Ollama FAQ: flash attention and KV cache type settings (official page), https://docs.ollama.com/faq'
  - 'Ainslie, J. et al. (2023), GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints https://arxiv.org/abs/2305.13245'
quiz:
  - q: What is stored in the KV cache?
    choices: ['A key and a value for every token, in every layer, so they need not be recomputed', 'The model''s weights', 'Your files']
    ans: 0
    why: Each new token looks back at all earlier tokens through their keys and values; caching them saves recomputing.
  - q: What happens to KV cache memory when you double the context length?
    choices: ['It doubles', 'It stays the same', 'It halves']
    ans: 0
    why: It grows in a straight line with the number of tokens kept.
  - q: Which setting can roughly halve the KV cache with little quality loss?
    choices: ['An 8-bit (q8_0) KV cache', 'A higher temperature', 'A bigger model']
    ans: 0
    why: Storing the cache at 8 bits instead of 16 halves it; most people notice no difference.
---

**Module 8 · about 20 minutes · read first: 2.4, 3.3 and 4.1.** You'll be able to work out how much memory a long context needs, and shrink it.

<div class="bigidea">Every token the model is holding in its working memory leaves a small note in every layer, so memory grows in a straight line with the length of the chat or document, on top of the model itself.</div>

## 1. Why this matters

People load a model that fits, paste a long report, and the machine slows to a crawl or the app crashes. The model did not grow: the **KV cache** did. It is the main reason long context costs memory.

## 2. What it is

In every layer, attention (Lesson 2.4) turns each token into a **key** (a label saying what it is about) and a **value** (what it says). Each new token compares itself with all earlier keys and takes a blend of their values.

The engine could recompute every earlier key and value for every new token, but that would be very slow. So it keeps them. That store is the **KV cache** ("K" for keys, "V" for values; a cache is a store kept to save work).

Its size grows with five things: the number of **layers**, the number of **key-value heads** (parallel attention channels that keep their own keys and values), the **head size** (numbers per key), the bytes per number, and the number of tokens.

<!--fig:kv-cache-->

### Watch it happen: the cache fills a 12 GB card

Llama 3.1 8B has 32 layers, 8 key-value heads and a head size of 128. At 16 bits, one token costs 2 × 32 × 8 × 128 × 2 = 131,072 bytes = <b>128 KB</b>. So 8,192 tokens cost 1 GB.

<div class="steps" data-fig="kv-cache-grow">
<div class="step"><p><b>Just the model.</b> At about 4.8 bits the weights take <b>4.8 GB</b>, plus about 1 GB for the engine. Plenty of room on a 12 GB card.</p></div>
<div class="step"><p><b>A short chat, 8,192 tokens.</b> 8,192 × 128 KB = <b>1 GB</b> of cache. Total 6.8 GB.</p></div>
<div class="step"><p><b>A long report, 32,768 tokens.</b> Four times the tokens, four times the cache: <b>4 GB</b>. Total 9.8 GB. Still fits.</p></div>
<div class="step"><p><b>A whole book, 65,536 tokens.</b> <b>8 GB</b> of cache. Total 13.8 GB: more than the card. The app crashes, or spills into slow memory and crawls.</p></div>
<div class="step"><p><b>Turn on an 8-bit cache.</b> One byte per number instead of two halves it: 65,536 tokens now cost <b>4 GB</b>. Total 9.8 GB. It fits again, with answers that are almost always the same.</p></div>
</div>

## 3. Shrinking it

1. **Shorter context:** set only what you need (Lesson 10.3). 8K instead of 128K saves a lot.
2. **8-bit cache:** llama.cpp `--cache-type-k q8_0 --cache-type-v q8_0`; Ollama `OLLAMA_KV_CACHE_TYPE=q8_0` with `OLLAMA_FLASH_ATTENTION=1`; LM Studio has KV cache options in its advanced settings.
3. **Models with grouped heads** (most new models) or sliding windows (Gemma, gpt-oss) need far less than older designs. **Grouped heads (GQA)** let several attention heads share one set of keys and values; a **sliding window** keeps only the most recent few thousand tokens in some layers.
4. **Start new chats** for new tasks (Lesson 3.7).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** every token kept costs a key and a value in every layer.

**Equation:** KV bytes = 2 × layers × KV heads × head size × bytes per number × tokens.

```math
M_{KV} = 2 \times L \times H_{kv} \times d \times B \times T
```

**Analogy:** a meeting where every speaker leaves a note on the table for every later speaker. More speakers, more notes; smaller handwriting (8-bit) fits more.

**Try it:** Llama 3.1 8B (32 layers, 8 KV heads, size 128) at 16 bits, 8,192 tokens? (2 × 32 × 8 × 128 × 2 = 131,072 bytes = 128 KB per token; × 8,192 = 1 GB.)
</details>

<div class="meaning">

<dl>
<dt>2</dt><dd>one key and one value for each token</dd>
<dt>L</dt><dd>the number of layers; every layer keeps its own notes</dd>
<dt>H<sub>kv</sub></dt><dd>key-value heads: 8 in most new models, 32 in older ones without grouped heads</dd>
<dt>d</dt><dd>head size: how many numbers are in each key or value (often 128)</dd>
<dt>B</dt><dd>bytes per number: 2 at 16 bits, 1 with an 8-bit cache</dd>
<dt>T</dt><dd>the number of tokens held: your whole chat or document so far</dd>
<dt>Physical meaning</dt><dd>The model's notebook. Everything you have said, and everything it has said, takes a fixed amount of paper per token. Double the conversation and you double the paper, while the model itself stays the same size.</dd>
</dl>

</div>

<div class="problem" data-problem="kv-cache-size"></div>

<div class="myth">

**"The model fits in memory, so any length of document will work."** The weights are only part of the bill. A long document adds its own cache, and on older designs 32,000 tokens can need as much memory as the model itself. Always budget weights plus cache.

</div>

## 4. Worked example

*Made-up numbers.* Kiran runs a 32B model (about 19 GB at 4 bits) on a 24 GB card. At 32K context the cache needs 8 GB more: it no longer fits. With an 8-bit cache it needs about 4.25 GB, and 19 + 4.25 + 1 = 24.25 GB, still just over. He sets context to 16K with an 8-bit cache (about 2.1 GB) and it fits.

Going the other way: how much context fits in what is left? Divide the free memory by the cost per token.

<div class="problem" data-problem="kv-cache-tokens"></div>

## 5. Practice

1. Use the calculator for Qwen2.5-32B at 131,072 tokens and 16 bits. What do you get?
2. Why did Llama 2 7B need four times the cache of Llama 3.1 8B?
3. Turn on an 8-bit cache in your engine and compare speed and answers.

<details>
<summary>Answers</summary>

1. About 32 GB: more than most graphics cards hold for the cache alone.
2. 32 KV heads against 8: grouped heads share keys and values.
3. Usually the same answers with less memory; speed may change slightly either way.
</details>

**New words:** *KV cache*, *key*, *value*, *grouped heads (GQA)*, *sliding window*.

<div class="keypoints">

- The KV cache stores a key and a value for every token in every layer, so new tokens need not recompute them.
- Cache bytes = 2 × layers × KV heads × head size × bytes per number × tokens: double the tokens, double the cache.
- Llama 3.1 8B at 16 bits costs 128 KB per token, 1 GB per 8,192 tokens.
- Shrink it with a shorter context, an 8-bit cache, models with grouped heads, and fresh chats for new tasks.

</div>
