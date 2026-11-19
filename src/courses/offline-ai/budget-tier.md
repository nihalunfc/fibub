---
title: 'Budget tier: use what you have'
summary: Start local AI on the laptop or PC you already own. What it can run, how to squeeze more out of it, and when it is time to spend money.
minutes: 15
updated: 2026-11-19
sources:
  - 'Model download sizes: Ollama library, read 17 November 2026 via BenchLM, https://benchlm.ai/best/ollama-models'
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

## 1. Why this matters

The cheapest machine is the one you already have. Many people never need more than a 16 GB laptop and a small model. Testing first means any money you do spend fixes a real problem.

<!--fig:build-rig-->

## 2. What a typical machine runs

- **8 GB laptop:** Gemma 4 E2B (4.6 GB download): drafting, rewriting, short summaries. Close the browser while it works.
- **16 GB laptop or older Mac:** Gemma 4 E4B (6.6 GB) or 12B (7.7 GB): good everyday assistant, a few to 15 tokens per second.
- **Old gaming PC with 8 GB card:** 8B to 12B at 4-bit, partly on the card (Lesson 4.3), often faster than a laptop.

## 3. Five free speed-ups

1. Close memory-hungry apps (browsers, video calls).
2. Choose the smallest model that does the job (Module 7).
3. Use a 4-bit quant rather than 8-bit (Lesson 8.2).
4. Keep the context short: start a new chat for a new task (Lesson 3.7).
5. Plug in a laptop and set its power mode to best performance (Lesson 6.4).

## 4. When to upgrade

Keep a one-week log. If you hit the same wall often (a model you need will not load, or answers take so long you stop using it), that wall tells you what to buy: memory for size, bandwidth for speed. Lessons 5.2 to 5.4 cover the options.

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
