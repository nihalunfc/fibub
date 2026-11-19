---
title: Laptops, desktops, Macs, mini PCs and AI boxes
summary: The five kinds of machine people run local AI on, what each is good at, and which one fits your work.
minutes: 20
updated: 2026-11-19
sources:
  - 'Mac configurations and US prices: Daring Fireball, August 2026, https://daringfireball.net/2026/08/configurations_and_pricing_for_new_mac_minis_and_mac_studios'
  - 'DGX Spark and Ryzen AI Halo prices: LAVX News, 13 June 2026, https://news.lavx.hu/article/amd-prices-ryzen-ai-halo-at-3-999-as-dgx-spark-moves-to-4-699'
quiz:
  - q: You need to run 70B-class or large mixture-of-experts models quietly on a desk. Which type fits best?
    choices: ['A gaming laptop with an 8 GB card', 'A 128 GB unified-memory box or Mac Studio', 'A phone']
    ans: 1
    why: Only large unified memory pools hold these models in one machine at a home price.
  - q: Which type gives the fastest writing for models up to about 30B?
    choices: ['A desktop with a 24 to 32 GB graphics card', 'A thin laptop', 'A mini PC without graphics']
    ans: 0
    why: Graphics cards have the highest bandwidth, so models that fit run fastest there.
  - q: What is the main drawback of a big gaming desktop for AI?
    choices: ['It cannot run AI', 'Power draw, heat and noise under load', 'It needs the internet']
    ans: 1
    why: Fast cards draw hundreds of watts, which means heat, fan noise and a higher bill.
---

**Module 4 · about 20 minutes · read first: 4.1 to 4.3.** You'll be able to pick the kind of machine before you pick the model of machine.

## 1. Why this matters

Most bad purchases come from choosing a machine type that cannot grow with your work. A laptop that cannot fit a bigger model, or a power-hungry tower in a hot room, is hard to fix later.

## 2. The five types

| Type | Fast memory | Strength | Weakness |
|---|---|---|---|
| Laptop (Windows) | 8 to 16 GB shared, or a small graphics chip | Already owned, portable | Small models, throttles (6.4) |
| Desktop with graphics card | 16 to 32 GB on the card | Fastest writing and prompt reading | Power, heat, noise; card limits size |
| Mac (mini, Studio, MacBook Pro) | 16 to 512 GB unified | Big models, quiet, low power | Slower prompt reading; memory not upgradeable |
| Mini PC | Shared, usually slow | Small, cheap, quiet | Slow unless it is an AI-class chip |
| 128 GB AI box (DGX Spark, Ryzen AI Max class) | 128 GB unified | Very large models at a fixed price | Medium bandwidth; newer software |

## 3. How to choose

1. Write down the largest model you need (Lesson 4.1 simulation).
2. Pick types that can hold it with room for your context.
3. Among those, choose by speed need (Lesson 4.2), noise and power, and what software you prefer.

## 4. Upgrades

A desktop can take a bigger card later. Macs and most AI boxes cannot change memory after purchase: buy the memory you will need in two years, not today.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** memory size sets the type of machine; bandwidth and price pick the model within the type.

**Equation:** right type = smallest type where usable memory ≥ biggest model + context + 1 GB.

**Analogy:** choose a car, a van or a lorry by the load first, then the brand by price and comfort.

**Try it:** you need a 27B at 4-bit with 32K context (about 16 + 9 + 1 = 26 GB)? (A 32 GB graphics card, a 48 GB or larger Mac, or an AI box. Not a 16 GB card.)
</details>

## 5. Worked example

*Made-up numbers.* A small clinic, Meadow Health, wants private note summaries for three staff. A 128 GB box can run a large mixture-of-experts model all day at about 200 W, silently in a cupboard. A gaming tower would be faster on 30B models but louder and hotter. They choose the box for privacy and quiet (Lesson 5.5 covers sharing it).

## 6. Practice

1. Which type do you own today? Which type would you buy next, and why?
2. Why buy more memory than you need on a Mac but not on a desktop?
3. A student wants quick chat with a 12B model and also plays games. Which type?

<details>
<summary>Answers</summary>

1. Any answer that starts from "the largest model I need" is right.
2. Mac memory cannot be upgraded later; a desktop can take a new card.
3. A desktop (or gaming laptop) with a 16 GB graphics card.
</details>

**New words:** *mini PC*, *AI box*, *upgrade path*.
