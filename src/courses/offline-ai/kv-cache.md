---
title: 'The KV cache: the hidden memory cost of long context'
summary: Why long conversations and big documents need extra memory on top of the model, how to work out how much, and the settings that shrink it.
minutes: 20
updated: 2026-11-19
sources:
  - 'Llama 3.1 8B and Llama 2 7B architecture (layers, key-value heads, head size): config.json on each model page, Meta (official page), https://huggingface.co/meta-llama'
  - 'Qwen2.5-32B architecture: config.json, Qwen (official page), https://huggingface.co/Qwen/Qwen2.5-32B-Instruct'
  - 'Ollama FAQ: flash attention and KV cache type settings (official page), https://docs.ollama.com/faq'
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

## 1. Why this matters

People load a model that fits, paste a long report, and the machine slows to a crawl or the app crashes. The model did not grow: the **KV cache** did. It is the main reason long context costs memory.

## 2. What it is

In every layer, attention (Lesson 2.4) turns each token into a **key** (what it is about) and a **value** (what it says). New tokens compare themselves with all earlier keys. Rather than recompute them for every new token, the engine keeps them: that store is the KV cache.

Its size grows with: the number of layers, the number of key-value heads, the head size, the bytes per number, and the number of tokens.

<!--fig:kv-cache-->

## 3. Shrinking it

1. **Shorter context:** set only what you need (Lesson 10.3). 8K instead of 128K saves a lot.
2. **8-bit cache:** llama.cpp `--cache-type-k q8_0 --cache-type-v q8_0`; Ollama `OLLAMA_KV_CACHE_TYPE=q8_0` with `OLLAMA_FLASH_ATTENTION=1`; LM Studio has KV cache options in its advanced settings.
3. **Models with grouped heads** (most new models) or sliding windows (Gemma, gpt-oss) need far less than older designs.
4. **Start new chats** for new tasks (Lesson 3.7).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** every token kept costs a key and a value in every layer.

**Equation:** KV bytes = 2 × layers × KV heads × head size × bytes per number × tokens.

**Analogy:** a meeting where every speaker leaves a note on the table for every later speaker. More speakers, more notes; smaller handwriting (8-bit) fits more.

**Try it:** Llama 3.1 8B (32 layers, 8 KV heads, size 128) at 16 bits, 8,192 tokens? (2 × 32 × 8 × 128 × 2 = 131,072 bytes = 128 KB per token; × 8,192 = 1 GB.)
</details>

## 4. Worked example

*Made-up numbers.* Kiran runs a 32B model (about 19 GB at 4 bits) on a 24 GB card. At 32K context the cache needs 8 GB more: it no longer fits. With an 8-bit cache it needs about 4.25 GB, and 19 + 4.25 + 1 = 24.25 GB, still just over. He sets context to 16K with an 8-bit cache (about 2.1 GB) and it fits.

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
