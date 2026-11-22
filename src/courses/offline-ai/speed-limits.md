---
title: Speed limits and where they come from
summary: Why local models write at the speed they do. The memory bandwidth ceiling, the difference between reading the prompt and writing the answer, why long chats slow down, and what thinking tokens cost in time.
minutes: 20
updated: 2026-11-22
sources:
  - 'Pope et al., "Efficiently Scaling Transformer Inference" (memory-bound decoding, compute-bound prefill), 2022, https://arxiv.org/abs/2211.05102'
  - 'NVIDIA and Apple product pages for memory bandwidth (see Lesson 4.1 sources)'
  - 'llama.cpp (official repository; llama-bench reports prompt-processing and generation speed separately), https://github.com/ggml-org/llama.cpp'
  - 'Vaswani et al., "Attention Is All You Need" (every token attends to all earlier tokens), 2017, https://arxiv.org/abs/1706.03762'
quiz:
  - q: What sets the top writing speed for one user on a home machine?
    choices: ['Memory bandwidth ÷ the size of the weights read per token', 'The screen size', 'The internet speed']
    ans: 0
    why: Each token needs one read of the active weights. Bandwidth divided by that size is the ceiling (Lesson 4.2).
  - q: Why does reading a long prompt go much faster per token than writing?
    choices: ['The prompt is processed in one parallel pass, limited by compute, not memory', 'The model skips the prompt', 'Prompts are shorter words']
    ans: 0
    why: Prefill handles many tokens per read of the weights; decoding handles one.
  - q: Why does a chat slow down as it gets very long?
    choices: ['Each new token must also read the growing KV cache and attend to every earlier token', 'The model gets tired', 'The keyboard lags']
    ans: 0
    why: More context means more to read and compare for every token.
---

**Module 17 · about 20 minutes · read first: 4.2 and 3.5.** You'll be able to explain the speed you see, and know which upgrades would make it faster.

<div class="bigidea">A local model's speed follows a few physical limits: writing is capped by how fast memory can be read, reading a prompt by raw arithmetic, and every extra token of context or thinking adds time.</div>

## 1. Why this matters

Speed decides whether local AI feels pleasant or painful. It is not a mystery: it follows a few physical limits. Once you know them, you can predict the speed of a machine before you buy it, and you will not waste money on upgrades that cannot help.

## 2. The ceiling: bandwidth

<!--fig:speed-limit-->

To write each token, the chip reads every active weight once. **Memory bandwidth** is how many gigabytes per second the chip can read from its memory. So tokens per second can never pass bandwidth ÷ gigabytes read per token. Think of a librarian who must walk the whole library once for every word they write: the walking speed sets the writing speed.

That is why a mixture-of-experts model (Lesson 2.5) with few active weights can be fast even when it is large, and why more memory alone does not mean more speed.

<div class="problem" data-problem="speed-limits-ceiling"></div>

## 3. Two phases: reading and writing

- **Prefill** (reading your prompt): all prompt tokens go through at once. Limited by the chip's raw arithmetic (**compute-bound**), so a graphics card reads a long prompt far faster than a laptop CPU. This sets the **time to first token**.
- **Decode** (writing the answer): one token at a time. Limited by bandwidth (**memory-bound**), as above.

A machine can be great at one and poor at the other. Macs with high bandwidth write quickly but read very long prompts more slowly than big graphics cards, which matters for document search with long contexts.

## 4. Long contexts slow both

Every new token compares itself with all earlier tokens (attention, Lesson 2.4) and reads their KV cache (Lesson 8.4). At 100 tokens that is nothing; at 100,000 it can halve the speed or worse, and prefill of a very long prompt can take minutes on modest hardware.

## 5. Thinking tokens cost time

A reasoning model (Lesson 10.4) may write 2,000 tokens of thinking before a 200-token answer. At 20 tokens per second, that is 100 seconds of waiting before the first word of the answer. Turn thinking down for easy tasks.

Watch where the seconds go for one 400-token answer on a 16 GB card:

<div class="steps" data-fig="speed-limits-time">
<div class="step"><p><b>A short chat.</b> A 200-token prompt is read in a blink (0.1 s). The answer is written at 45 tokens per second: 400 ÷ 45 ≈ 8.9 s.</p></div>
<div class="step"><p><b>Paste a 40,000-token document.</b> Reading it takes about 15 s before the first word. With so much context, writing also slows to about 30 tokens per second: 400 ÷ 30 ≈ 13.3 s.</p></div>
<div class="step"><p><b>Switch thinking on.</b> The model writes 1,200 tokens of thinking first, at the same 30 tokens per second: another 40 s. Total about 68 s.</p></div>
<div class="step"><p><b>The fix.</b> Send only the 4,000 relevant tokens (document search, Module 12) and turn thinking off. Reading takes 1.5 s, writing about 10 s: under 12 s in all, with no new hardware.</p></div>
</div>

```math
t \approx \frac{P}{s_\text{read}} + \frac{T + A}{s_\text{write}}, \qquad s_\text{write} \le \frac{B}{G}
```

<div class="meaning">

<dl>
<dt>P</dt><dd>prompt tokens: everything sent, including pasted documents and the chat so far</dd>
<dt>s<sub>read</sub></dt><dd>prefill speed in tokens per second, set by the chip's arithmetic</dd>
<dt>T, A</dt><dd>thinking tokens and answer tokens the model writes</dd>
<dt>s<sub>write</sub></dt><dd>decode speed in tokens per second</dd>
<dt>B ÷ G</dt><dd>memory bandwidth (GB/s) over gigabytes read per token: the ceiling on writing speed</dd>
<dt>Physical meaning</dt><dd>Reading is a team of clerks scanning a request together; writing is one clerk fetching one book at a time from the stacks. You can speed up the clerks with a stronger chip, but the fetching only gets faster with faster memory or smaller books (a smaller model or quant).</dd>
</dl>

</div>

<div class="problem" data-problem="speed-limits-answer-time"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** time = waiting + reading + thinking + writing, each with its own limit.

**Equation:** answer time ≈ prompt tokens ÷ prefill speed + (thinking + answer tokens) ÷ decode speed; decode speed ≤ bandwidth ÷ GB per token.

**Analogy:** a library. Reading the request is quick for a team of clerks working together (prefill); fetching each book is one trip to the stacks at a time (decode).

**Try it:** 273 GB/s box, 3.1 GB per token (gpt-oss-120b at 4-bit)? (Ceiling ≈ 88 tokens per second; expect perhaps 45 to 70 in practice.)
</details>

<div class="myth">

**"More memory will make my model faster."** More memory lets a bigger model fit; it does not make reading it quicker. Writing speed follows memory bandwidth, not size. A machine with twice the memory but the same bandwidth writes the same model at about the same speed.

</div>

## 6. Worked example

*Made-up measurements.* Jordan's 16 GB card writes 45 tokens per second with a 12B model in a short chat. With a 40,000-token document pasted in, the first word takes 15 seconds and writing drops to about 30 tokens per second. Turning on a thinking mode adds 40 seconds. Jordan keeps thinking off for summaries and uses document search (Module 12) to send only the relevant 4,000 tokens instead of the whole file.

## 7. Practice

1. Work out the ceiling for your machine and model.
2. Your first word takes ages but writing is quick. Which phase is slow?
3. Name two ways to make a long-document task faster without new hardware.

<details>
<summary>Answers</summary>

1. Bandwidth ÷ (active parameters × bits ÷ 8, in GB).
2. Prefill (or a queue, Lesson 15.1).
3. Send less text (search for the relevant parts) and turn thinking down; a smaller quant also helps decode.
</details>

**New words:** *prefill*, *decode*, *time to first token*, *compute-bound*, *memory-bound*.

<div class="keypoints">

- Writing speed can never pass memory bandwidth ÷ GB of active weights read per token.
- Prefill (reading the prompt) is limited by arithmetic and sets the time to first token; decode (writing) is limited by bandwidth.
- Long contexts slow both phases; thinking tokens add their own writing time before the answer.
- Answer time ≈ prompt ÷ reading speed + (thinking + answer) ÷ writing speed.
- Send less text and turn thinking down before buying new hardware.

</div>
