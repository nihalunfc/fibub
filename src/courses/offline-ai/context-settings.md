---
title: Context length settings and their memory cost
summary: Why local engines start with a short context, how to raise it in Ollama, LM Studio and llama.cpp, and how to pick a length your memory can hold.
minutes: 15
updated: 2026-11-22
sources:
  - 'Ollama default context by graphics memory (4,096 tokens under 24 GiB, 32,768 for 24 to 48 GiB, 256,000 at 48 GiB or more) and how to change it: Fast.io, last reviewed 31 October 2026, https://fast.io/resources/ollama-context-length/'
  - 'Ollama FAQ: context window size (official page), https://docs.ollama.com/faq'
  - 'llama.cpp server options (-c, --ctx-size), project documentation, https://github.com/ggml-org/llama.cpp/tree/master/tools/server'
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

<div class="bigidea">The context length you set is how much text the model can hold at once; too short and it silently drops the start, too long and the memory runs out.</div>

## 1. Why this matters

A model card may say "128K context", but your engine may start at 4,096 tokens to save memory. Long documents then get cut off without any warning. Setting the right length is one of the most common fixes for "it ignored my file".

## 2. Defaults

- **Ollama:** depends on graphics memory. A late-2026 guide reports 4,096 tokens under 24 GB, 32,768 for 24 to 48 GB, and 256,000 at 48 GB or more. Check your version's documentation.
- **LM Studio:** shows a context length slider when you load a model, with an estimate of the memory it will use.
- **llama.cpp:** `-c 16384` sets it; `-c 0` uses the model's maximum.

The context is like a desk. A bigger desk holds more papers at once, but it takes up more of the room (memory). Whatever does not fit on the desk falls off, usually from the oldest end.

<div class="steps">
<div class="step"><p><b>The document.</b> A contract of 7,500 words is about 7,500 ÷ 0.75 = 10,000 tokens. Add a 200-token system prompt.</p></div>
<div class="step"><p><b>The default is too small.</b> The engine is set to 4,096 tokens. Only the last part fits; roughly the first 6,000 tokens never reach the model. It summarises the second half as if it were the whole contract.</p></div>
<div class="step"><p><b>Work out what you need.</b> 10,000 (contract) + 200 (system) + 1,000 (room for the answer) = 11,200 tokens.</p></div>
<div class="step"><p><b>Pick a setting.</b> The next common size above 11,200 is 16,384. Set <code>num_ctx</code> to 16384.</p></div>
<div class="step"><p><b>Check the memory.</b> The KV cache grows with the context, roughly four times bigger at 16,384 than at 4,096. Use the calculator below: model + cache + 1 GB must fit (Lesson 4.1).</p></div>
</div>

Try it: press Play and watch the oldest messages fall out of the window; compare the three ways of handling a full window.

<figure class="fig" data-fig="@ai-context-slide"><figcaption>The model only sees what fits in the window. Dropping the oldest messages loses early facts like the user's name; pinning the system prompt or summarising keeps what matters at a small cost.</figcaption></figure>

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

<div class="myth">

**"The model card says 128K, so my model reads 128K."** The card gives the most the model can handle. Your engine decides how much it actually reserves, and it often starts much lower to save memory. Check the setting, not the card.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** reserve the context you need, not the most the model allows.

**Equation:**

```math
\text{context needed} \approx \frac{\text{input words}}{0.75} + \text{answer tokens} + \text{system prompt}
```

**Analogy:** booking a hall: book for the guests you expect, not the building's fire limit.

**Try it:** a 9,000-word report, a 1,000-token answer and a 200-token system prompt? (9,000 ÷ 0.75 = 12,000 + 1,000 + 200 = 13,200 tokens, so 16,384 is a good setting.)
</details>

<div class="meaning">

<dl>
<dt>context length (num_ctx)</dt><dd>the number of tokens the engine reserves room for: prompt, document, chat so far and the answer together</dd>
<dt>words ÷ 0.75</dt><dd>turns an English word count into an approximate token count</dd>
<dt>answer tokens</dt><dd>space you leave for the model to write its reply; it shares the same budget</dd>
<dt>truncation</dt><dd>what happens when the text is longer than the setting: part of it is cut and the model never sees it</dd>
<dt>Physical meaning</dt><dd>The context is the size of the model's desk. Make it big enough for today's papers plus a notepad for the answer, but every extra inch costs memory, and if the desk no longer fits in the room the model will not load or will crawl.</dd>
</dl>

</div>

<div class="problem" data-problem="context-settings-needed"></div>

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

<div class="keypoints">

- The model card gives the most a model can read; the engine's setting decides what it actually reads.
- Engines often start at a few thousand tokens, and longer input is cut off without warning.
- Context needed ≈ input words ÷ 0.75 + answer tokens + system prompt; round up to the next common size.
- In Ollama set `num_ctx` (per chat, per request or in a Modelfile) or `OLLAMA_CONTEXT_LENGTH` for the whole server.
- A longer context means a bigger KV cache: check that model + cache + 1 GB still fits.

</div>
