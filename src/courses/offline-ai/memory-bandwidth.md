---
title: 'Memory bandwidth: the real speed limit'
summary: Why writing speed depends on how fast memory can be read, not on how fast the chip is, and how to estimate tokens per second for any machine.
minutes: 20
updated: 2026-11-22
sources:
  - 'Graphics card memory speeds: NVIDIA product pages via Compute Market, prices from September 2026, updated 1 November 2026, https://compute-market.com'
  - 'DGX Spark memory and bandwidth: LAVX News, 13 June 2026, https://news.lavx.hu/article/amd-prices-ryzen-ai-halo-at-3-999-as-dgx-spark-moves-to-4-699'
  - 'Model download sizes: Ollama library, read 16 November 2026 via BenchLM, https://benchlm.ai/best/ollama-models'
  - 'Williams, S., Waterman, A. and Patterson, D. (2009), Roofline: an insightful visual performance model for multicore architectures, Communications of the ACM 52(4), 65-76 (memory-bound and compute-bound work) https://doi.org/10.1145/1498765.1498785'
quiz:
  - q: A graphics card reads memory at 448 GB/s. A model's weights are 7.7 GB. What is the rough ceiling on writing speed?
    choices: ['About 6 tokens per second', 'About 58 tokens per second', 'About 3,450 tokens per second']
    ans: 1
    why: 448 ÷ 7.7 ≈ 58. Every new token needs every weight read once, so this is the ceiling; real speed is lower.
  - q: Why does a Mixture-of-Experts model with 120B parameters write faster than a dense 27B model on the same box?
    choices: ['Its file is smaller', 'Only about 5B parameters are read for each token', 'It skips the attention step']
    ans: 1
    why: Only the chosen experts are read per token, so far fewer bytes travel from memory for each word piece.
  - q: Which change speeds up writing the most on a machine where the model already fits?
    choices: ['A faster processor clock with the same memory', 'Faster memory (higher GB/s)', 'A bigger SSD']
    ans: 1
    why: Writing is limited by reading weights from memory. A faster clock waits on memory just the same.
---

**Module 4 · about 20 minutes · read first: 4.1 and 3.5.** You'll be able to guess a machine's writing speed before you buy it.

<div class="bigidea">To write each word, the chip must read the whole model from memory, so the speed of that memory, not the chip, sets how fast the AI writes.</div>

## 1. Why this matters

Lesson 4.1 asked "does it fit?". This lesson asks "how fast will it write?". The answer is mostly one number on the spec sheet, **memory bandwidth**, which shops rarely print in big letters. Knowing it saves you from paying for a fast chip that sits waiting.

## 2. One token, one full read

To write each new token, the chip combines the conversation with every weight in the model (Lesson 2.1). The weights live in memory. So for every token, all of them travel from memory to the chip. A 7.7 GB model means 7.7 GB read per token.

The chip itself could do the maths much faster. It spends most of its time waiting for the next batch of weights to arrive. That is why we say writing is **memory-bound**: memory is the bottleneck.

Picture a cook who needs every jar in the pantry for every single dish. A faster cook does not help if the pantry door is narrow. A wider door does. Bandwidth is the width of the door.

<div class="steps" data-fig="memory-bandwidth-read">
<div class="step"><b>Token 1.</b> A 7.7 GB model on a card that reads 448 GB/s. Reading every weight once takes 7.7 ÷ 448 ≈ 0.017 s, or 17 ms.</div>
<div class="step"><b>The maths is quick.</b> Once the weights arrive, the sums take only a sliver of that time. For the rest, the chip waits.</div>
<div class="step"><b>Tokens 2, 3, 4 ...</b> Every new token needs the whole read again. In the first 100 ms there is room for about 5 tokens.</div>
<div class="step"><b>Per second.</b> 448 ÷ 7.7 ≈ 58 full reads a second, so at most about 58 tokens per second. Real engines reach about 50 to 80% of this: roughly 30 to 45.</div>
<div class="step"><b>Double the door.</b> The same model on a 936 GB/s card reads in about 8 ms, so the ceiling rises to about 120 tokens per second. Same model, same maths, faster memory.</div>
</div>

<!--fig:speed-limit-->

In symbols, with `$B$` the bandwidth in GB/s and `$M$` the GB read for each token:

```math
\text{tokens per second} \le \frac{B}{M}
```

<div class="problem" data-problem="memory-bandwidth-ceiling"></div>

<div class="meaning">

<dl>
<dt>B (bandwidth)</dt><dd>How many GB the memory can hand to the chip each second. It is on the spec sheet as GB/s.</dd>
<dt>M</dt><dd>GB read for each token: the whole model for a normal (dense) model, only the active part for a Mixture-of-Experts model.</dd>
<dt>Memory-bound</dt><dd>The chip spends its time waiting for memory, not doing sums.</dd>
<dt>Physical meaning</dt><dd>Every word the AI writes is a full trip through its memory. A machine with twice the bandwidth makes that trip twice as fast and writes about twice as many words per second, whatever its chip is called.</dd>
</dl>

</div>

Try it: choose a 32B model at 4-bit, then slide the GPU memory from none up to 24 GB.

<figure class="fig" data-fig="@ai-gpu-offload"><figcaption>Every generated token reads every layer, so the slow part (layers left on the CPU) sets the speed. Each extra layer moved to the GPU helps a little, and the last ones help most.</figcaption></figure>

## 3. Reading the speed off a spec sheet

Memory bandwidth is written in GB/s (gigabytes per second):

- Laptop memory (two DDR5 sticks): about 60 to 100 GB/s.
- Base Mac mini class: about 120 GB/s; Pro and Max chips: 270 to over 600 GB/s.
- 128 GB AI boxes (DGX Spark, Ryzen AI Max class): about 256 to 273 GB/s.
- Graphics cards: RTX 5060 Ti 448 GB/s, used RTX 3090 936 GB/s, RTX 5090 1,792 GB/s.

A Mixture-of-Experts model (Lesson 2.5) reads only its active experts for each token, so `$M$` is much smaller than the file. That is why big MoE models can write quickly even on medium bandwidth.

<div class="problem" data-problem="memory-bandwidth-moe"></div>

<div class="myth">

**"A faster processor makes the AI write faster."** While writing, the chip mostly waits for memory. A higher clock speed or more "AI TOPS" with the same memory changes little. Look for the GB/s number instead.

</div>

Try it: pick the gaming GPU, then slide the users from 1 to 128 and find where the curves bend.

<figure class="fig" data-fig="@ai-batch-throughput"><figcaption>One token costs one read of the whole model, shared by every user in the batch, so total speed climbs almost for free while each person's speed barely drops. Once arithmetic is the limit, extra users slow everybody.</figcaption></figure>

## 4. Reading time versus writing time

Reading your prompt (prefill, Lesson 3.5) is different. The chip handles many prompt tokens together, so each weight it reads is used many times. Prefill is **compute-bound**: here the chip's raw power matters, and graphics cards beat Macs and AI boxes by a wide margin. That is why a long document can take a while to "start" on a Mac even when the writing is quick.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** writing speed is capped by how many times per second memory can hand over every active weight.

**Equation:** top tokens per second ≈ bandwidth (GB/s) ÷ bytes read per token (GB). Real engines reach about 50 to 80% of it.

**Analogy:** a cook who needs every ingredient in the pantry for each dish. A faster cook does not help if the pantry door is narrow; a wider door does.

**Try it:** a 16 GB model on a 1,792 GB/s card? (1,792 ÷ 16 = 112 tokens per second ceiling, about 56 to 90 in practice.)
</details>

## 5. Worked example

*Made-up numbers.* Arjun compares a 128 GB AI box (273 GB/s) with a Mac Studio (about 614 GB/s) for a 27B model at 4-bit (about 16 GB). The box: 273 ÷ 16 ≈ 17 tokens per second ceiling, so about 9 to 14 in practice. The Mac: 614 ÷ 16 ≈ 38, so about 19 to 31. For a mixture-of-experts model that reads only 3 GB per token, both feel quick, and the box's lower price wins for him.

## 6. Practice

1. Your laptop has 80 GB/s. How fast could Gemma 4 E2B (about 1.6 GB) write at best?
2. Why does a long pasted report feel slower to start on a Mac than on a graphics card?
3. Two cards both have 16 GB: one 448 GB/s, one 896 GB/s. Which models can each run, and how do they differ?

<details>
<summary>Answers</summary>

1. 80 ÷ 1.6 = 50 tokens per second ceiling, about 25 to 40 in practice.
2. Reading the prompt is compute-bound, and graphics cards have much more raw compute.
3. The same models (same memory), but the 896 GB/s card writes about twice as fast.
</details>

**New words:** *bandwidth* (GB moved per second), *memory-bound* (waiting on memory), *compute-bound* (waiting on the maths).

<div class="keypoints">

- Every new token needs every active weight read from memory once.
- Speed ceiling ≈ bandwidth (GB/s) ÷ GB read per token; real engines reach about 50 to 80% of it.
- Writing is memory-bound, so faster memory helps more than a faster chip.
- Reading a long prompt is compute-bound, which is where graphics cards pull far ahead.
- Mixture-of-Experts models read only their active part, so they write fast for their size.

</div>
