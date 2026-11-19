---
title: Context length settings and their memory cost
summary: Why local engines start with a short context, how to raise it in Ollama, LM Studio and llama.cpp, and how to pick a length your memory can hold.
minutes: 15
updated: 2026-11-19
sources:
  - 'Ollama default context by graphics memory (4,096 tokens under 24 GiB, 32,768 for 24 to 48 GiB, 256,000 at 48 GiB or more) and how to change it: Fast.io, last reviewed 31 October 2026, https://fast.io/resources/ollama-context-length/'
  - 'Ollama FAQ: context window size (official page), https://docs.ollama.com/faq'
quiz:
  - q: You paste a 20-page report into Ollama and the answer ignores the beginning. Likely cause?
    choices: ['The context length is set shorter than the report, so the start was cut off', 'The model cannot read reports', 'The disk is full']
    ans: 0
    why: Engines often default to a few thousand tokens; anything beyond is dropped or shifted out.
  - q: Why not always set the maximum context the model supports?
    choices: ['The KV cache would take far more memory, and the model may not fit', 'It is against the licence', 'It makes answers shorter']
    ans: 0
    why: Memory grows with the context you reserve (Lesson 8.4).
  - q: In Ollama, which setting changes the context for one request from code?
    choices: ['num_ctx in the options', 'temperature', 'seed']
    ans: 0
    why: "Pass options={\"num_ctx\": 16384}, or set OLLAMA_CONTEXT_LENGTH for the whole server."
---

**Module 10 · about 15 minutes · read first: 3.3 and 8.4.** You'll be able to set a context length that holds your documents and still fits in memory.

## 1. Why this matters

A model card may say "128K context", but your engine may start at 4,096 tokens to save memory. Long documents then get cut off silently. Setting the right length is one of the most common fixes for "it ignored my file".

## 2. Defaults

- **Ollama:** depends on graphics memory. A late-2026 guide reports 4,096 tokens under 24 GB, 32,768 for 24 to 48 GB, and 256,000 at 48 GB or more. Check your version's documentation.
- **LM Studio:** shows a context length slider when you load a model, with an estimate of the memory it will use.
- **llama.cpp:** `-c 16384` sets it; `-c 0` uses the model's maximum.

## 3. How to change it

- **Ollama, whole server:** set `OLLAMA_CONTEXT_LENGTH=16384` before starting it, or use the context slider in the desktop app's settings.
- **Ollama, one chat:** `/set parameter num_ctx 16384`.
- **Ollama, from code:** `options={"num_ctx": 16384}`.
- **Ollama, saved model:** `PARAMETER num_ctx 16384` in a Modelfile.
- **LM Studio:** move the slider before loading.

## 4. Picking a length

1. Estimate your longest input: words ÷ 0.75 = tokens (Lesson 3.1), plus room for the answer.
2. Use the calculator to check the KV cache for that length.
3. Check that model + cache + 1 GB fits (Lesson 4.1).

<!--fig:kv-cache-->

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** reserve the context you need, not the most the model allows.

**Equation:** context needed ≈ (input words ÷ 0.75) + answer tokens + system prompt.

**Analogy:** booking a hall: book for the guests you expect, not the building's fire limit.

**Try it:** a 9,000-word report, a 1,000-token answer and a 200-token system prompt? (9,000 ÷ 0.75 = 12,000 + 1,000 + 200 = 13,200 tokens, so 16,384 is a good setting.)
</details>

## 5. Worked example

*Made-up numbers.* Ritu's summaries miss the first half of long contracts. Her Ollama default is 4,096 tokens; contracts run to 10,000. She sets `num_ctx` to 16,384 in her script. The KV cache adds about 1 GB for her model, which still fits on her 16 GB card.

## 6. Practice

1. Find your engine's current context length.
2. Work out the tokens of your longest regular document.
3. Set a context length with room to spare and test a long document.

<details>
<summary>Answers</summary>

1. Ollama: `ollama ps` shows loaded models and their context in recent versions; LM Studio shows it on the model load panel.
2. Words ÷ 0.75.
3. If the answer now mentions the start of the document, it worked.
</details>

**New words:** *num_ctx*, *context slider*, *truncation* (cutting off text that does not fit).
