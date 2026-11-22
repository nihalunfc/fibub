---
title: 'Budget tier: use what you have'
summary: Start local AI on the laptop or PC you already own. What it can run, how to squeeze more out of it, and when it is time to spend money.
minutes: 15
updated: 2026-11-22
sources:
  - 'Model download sizes: Ollama library, read 17 November 2026 via BenchLM, https://benchlm.ai/best/ollama-models'
  - 'Ollama documentation: running models on your own computer, including CPU-only machines (official page), https://docs.ollama.com'
  - 'llama.cpp project README: running quantised models on ordinary CPUs and graphics chips (official page), https://github.com/ggml-org/llama.cpp'
quiz:
  - q: What is the best first step before buying anything?
    choices: ['Buy the biggest graphics card', 'Run a small model on the machine you own and note where it falls short', 'Wait for next year']
    ans: 1
    why: Your own trial shows whether you need more memory, more speed or nothing at all.
  - q: A 16 GB laptop runs Gemma 4 12B slowly. Which change helps most for free?
    choices: ['Close other apps and use a smaller model or shorter context', 'Raise the temperature setting', 'Download a bigger model']
    ans: 0
    why: Freeing memory and reducing what must be read per token raises speed at no cost.
  - q: When is it time to buy?
    choices: ['When a model you need will not fit, or is too slow for real work', 'As soon as a new chip launches', 'Never']
    ans: 0
    why: Spend when a real job is blocked, not because of adverts.
---

**Module 5 · about 15 minutes · read first: 4.1 and 9.1.** You'll be able to get real work out of the machine you own and decide, with evidence, whether to upgrade.

<div class="bigidea">Start on the machine you already own, measure where it falls short, and only spend money to remove a wall you actually keep hitting.</div>

## 1. Why this matters

The cheapest machine is the one you already have. Many people never need more than a 16 GB laptop and a small model. Testing first means any money you do spend fixes a real problem. It is like walking a route before you buy a bike: you may find the bus is fine, or you may know exactly which bike you need.

<!--fig:build-rig-->

## 2. What a typical machine runs

- **8 GB laptop:** Gemma 4 E2B (4.6 GB download): drafting, rewriting, short summaries. Close the browser while it works.
- **16 GB laptop or older Mac:** Gemma 4 E4B (6.6 GB) or 12B (7.7 GB): a good everyday assistant, a few to 15 tokens per second.
- **Old gaming PC with an 8 GB card:** 8B to 12B at 4-bit, partly on the card (Lesson 4.3), often faster than a laptop.

Try it: lower the bits to 3 or 2, then compare one scale for everything against one per block of 32.

<figure class="fig" data-fig="@ai-quant-grid"><figcaption>Fewer bits means fewer levels, so every weight is rounded more. One outlier stretches a shared scale and crushes the small weights, which is why formats give each small block its own scale.</figcaption></figure>

## 3. Five free speed-ups

1. Close memory-hungry apps (browsers, video calls).
2. Choose the smallest model that does the job (Module 7).
3. Use a 4-bit quant rather than 8-bit (Lesson 8.2).
4. Keep the context short: start a new chat for a new task (Lesson 3.7).
5. Plug in a laptop and set its power mode to best performance (Lesson 6.4).

<div class="myth">

**"A newer laptop will run bigger models."** Not if it has the same memory. A brand-new 16 GB laptop holds the same models as an old 16 GB one; it may write a little faster, but the size wall stays where it was. If your wall is "the model will not fit", only more fast memory moves it.

</div>

Try it: choose a 32B model at 4-bit, then slide the GPU memory from none up to 24 GB.

<figure class="fig" data-fig="@ai-gpu-offload"><figcaption>Every generated token reads every layer, so the slow part (layers left on the CPU) sets the speed. Each extra layer moved to the GPU helps a little, and the last ones help most.</figcaption></figure>

## 4. When to upgrade

Keep a one-week log. If you hit the same wall often (a model you need will not load, or answers take so long you stop using it), that wall tells you what to buy: memory for size, bandwidth for speed. Lessons 5.2 to 5.4 cover the options.

Here is the whole process for one person:

<div class="steps">
<div class="step"><b>Day 1: measure.</b> Run Gemma 4 E4B on your laptop and note the speed (Lesson 3.10). Say it writes 9 tokens per second. That is your baseline.</div>
<div class="step"><b>Day 2: free speed-ups.</b> Close the browser, start fresh chats, plug in. Speed rises to 11 tokens per second at no cost.</div>
<div class="step"><b>Days 3 to 7: log the walls.</b> Each time a job is too slow or will not fit, write one line. By Friday: "12B will not load with long reports" appears four times.</div>
<div class="step"><b>Name the wall.</b> The problem is size, not speed. So the fix is more fast memory, not a faster chip with the same memory.</div>
<div class="step"><b>Put a value on it.</b> The upgrade would save about 5 hours a month. At 20 an hour for 24 months: 5 × 20 × 24 = 2,400. If the upgrade costs less, it is worth it.</div>
</div>

```math
\text{worth paying up to} = \text{hours saved per month} \times \text{value of an hour} \times \text{months of use}
```

<div class="problem" data-problem="budget-tier-worth"></div>

<div class="meaning">

<dl>
<dt>Hours saved per month</dt><dd>Time you would stop losing to waiting, or to doing a job by hand because the model could not.</dd>
<dt>Value of an hour</dt><dd>What an hour of your time is worth to you, in your own currency.</dd>
<dt>Months of use</dt><dd>How long you expect to use the upgrade, often 24 to 36 months.</dd>
<dt>Physical meaning</dt><dd>An upgrade is a machine that hands you back time. If the time it returns over its life is worth more than its price, it pays for itself; if not, the free speed-ups are the better deal.</dd>
</dl>

</div>

<div class="problem" data-problem="budget-tier-payback"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** measure before you buy. The upgrade should remove a wall you actually hit.

**Equation:** worth upgrading if (hours saved per month × value of your hour) × months of use > price of the upgrade.

**Analogy:** walk the route before buying a bike: you may find the bus is fine, or you may know exactly which bike you need.

**Try it:** an upgrade saves you 5 hours a month, your hour is worth 20 in your currency, and you will use it for 24 months. Worth paying up to? (5 × 20 × 24 = 2,400.)
</details>

## 5. Worked example

*Made-up numbers.* Tom runs Gemma 4 E4B on his 16 GB laptop for a week. Drafting emails is fine. Summarising 50-page reports is painfully slow and the 12B runs out of room. His wall is memory and prompt length, so he looks at 32 GB Macs and 16 GB cards in Lesson 5.2 rather than a faster laptop with the same 16 GB.

## 6. Practice

1. Run Gemma 4 E2B or E4B on your machine and note the tokens per second (Lesson 3.10).
2. Apply the five speed-ups. What changed?
3. Keep a week's log of the jobs that were too slow or would not fit.

<details>
<summary>Answers</summary>

1. Any number is a good start: it is your baseline.
2. Usually 10 to 50% faster, mainly from closing apps and shorter context.
3. The log decides your next lesson: 5.2 for memory, 5.3 for speed and size.
</details>

**New words:** *baseline* (your starting measurement), *wall* (the limit you keep hitting).

<div class="keypoints">

- Start with a small model on the machine you own and measure its speed: that is your baseline.
- Five free speed-ups: close apps, smaller model, 4-bit quant, short context, plug in on best performance.
- A week's log shows your wall: size (buy memory) or speed (buy bandwidth).
- An upgrade is worth up to hours saved per month × value of an hour × months of use.

</div>
