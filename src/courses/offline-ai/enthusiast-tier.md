---
title: 'Enthusiast tier: 24 to 128 GB'
summary: For people who want 27B to 31B models running fast, or bigger. Used RTX 3090s, the RTX 5090, Mac mini Pro and Mac Studio, with prices in four countries.
minutes: 20
updated: 2026-11-22
sources:
  - 'Graphics card US list and street prices (RTX 5070 Ti, 5090, used 3090): Compute Market, prices from September 2026, updated 1 November 2026, https://compute-market.com'
  - 'RTX 5090, India: gpuprix.com median about ₹3.32 lakh, read 18 November 2026, https://gpuprix.com'
  - 'Mac mini M5 Pro and Mac Studio US prices by memory: Daring Fireball, August 2026, https://daringfireball.net/2026/08/configurations_and_pricing_for_new_mac_minis_and_mac_studios'
  - 'Mac mini M5 Pro and Mac Studio, India launch prices (₹2,09,900 and ₹2,79,900): Cyberkendra, 25 August 2026'
  - 'Mac mini M5 Pro CA$2,399, Mac Studio M5 Max CA$3,499: iPhone in Canada, 22 September 2026, https://www.iphoneincanada.ca/2026/09/22/mac-mini-mac-studio-canada-available/'
  - 'Mac Studio UK from £2,499: GadgetScout, 2026, https://www.gadgetscout.co.uk/articles/apple-unveils-m6-mac-mini-and-m5-ultra-mac-studio.html'
quiz:
  - q: Why is a used RTX 3090 popular for local AI in 2026?
    choices: ['It has 24 GB of fast memory for much less than a new 32 GB card', 'It uses the least power', 'It comes with a warranty']
    ans: 0
    why: 24 GB at 936 GB/s fits 27B to 31B models fast. It is second-hand, power-hungry and needs testing.
  - q: Which gives the most memory for large models in one quiet machine?
    choices: ['RTX 5090', 'Mac Studio with 128 GB', 'RTX 5070 Ti']
    ans: 1
    why: Unified memory reaches 128 GB or more; the biggest consumer card has 32 GB.
  - q: An RTX 5070 Ti has 16 GB. What does it add over an RTX 5060 Ti 16 GB?
    choices: ['Bigger models', 'Faster writing on the same models', 'Nothing']
    ans: 1
    why: Same 16 GB (same models), about twice the bandwidth (896 against 448 GB/s).
---

**Module 5 · about 20 minutes · read first: 4.2, 4.5 and 5.2.** You'll be able to choose a machine for serious daily work with 27B-class models or larger.

<div class="bigidea">Above 24 GB, every option gives you two of three things, speed, memory size and a low price, so decide which one you can give up.</div>

## 1. Why this matters

27B to 31B models (Gemma 4 31B, Qwen3.8-27B) are where local AI starts to feel close to the cloud for many jobs. They need 20 to 32 GB of fast memory. This tier is where money buys real capability, and also where it is easiest to overspend.

<!--fig:build-rig-->

## 2. The options

| Option | Fast memory | India | Canada | USA | UK |
|---|---|---|---|---|---|
| Used RTX 3090 (card only) | 24 GB, 936 GB/s | check local listings | check local listings | US$699 to US$999 | check local listings |
| RTX 5090 (card only) | 32 GB, 1,792 GB/s | about ₹3,32,000 | check the store | list US$1,999, street US$2,500 to US$5,000 | check the store |
| Mac mini M5 Pro | 24, 48 or 64 GB | from ₹2,09,900 | from CA$2,399 | US$1,699 / 2,299 / 2,699 | check Apple |
| Mac Studio M5 Max | 36 to 128 GB | from ₹2,79,900 | from CA$3,499 | US$2,499 (36 GB) to US$5,099 (128 GB) | from £2,499 |

Prices read between August and 18 November 2026 (sources below). **Check the official store before you buy;** "check the store" means we found no reliable recent figure.

## 3. Fast, roomy, cheap: pick two

Like a builder's saying, "good, fast, cheap: pick two", every machine here gives up one thing. Here are three options for one model, Gemma 4 31B at 4-bit (about 19 GB), using the US prices above:

<div class="steps">
<div class="step"><b>Does it fit?</b> Used 3090: 24 GB, yes. RTX 5090: 32 GB, yes. Mac mini M5 Pro with 64 GB: about 48 GB usable, yes, with lots to spare.</div>
<div class="step"><b>Speed ceiling.</b> Bandwidth ÷ 19 GB. 3090: 936 ÷ 19 ≈ 49 tokens per second. 5090: 1,792 ÷ 19 ≈ 94. Mac mini M5 Pro (about 270 GB/s): ≈ 14.</div>
<div class="step"><b>Price per usable GB.</b> 3090 at about US$850: ≈ US$35 per GB. 5090 at a US$2,500 street price: ≈ US$78. Mac mini at US$2,699 for 48 usable GB: ≈ US$56.</div>
<div class="step"><b>What each gives up.</b> The 3090 is fast and cheap but not roomy (24 GB, no warranty, 350 W). The 5090 is fast and fairly roomy but not cheap. The Mac is roomy and quiet but not fast.</div>
</div>

<div class="problem" data-problem="enthusiast-tier-speed"></div>

<div class="meaning">

<dl>
<dt>M</dt><dd>The model's size in GB (what is read for each token).</dd>
<dt>Speed ≈ bandwidth ÷ M</dt><dd>The writing-speed ceiling in tokens per second (Lesson 4.2).</dd>
<dt>Fits if usable ≥ M + context + 1</dt><dd>The size check from Lesson 4.1.</dd>
<dt>Physical meaning</dt><dd>Fast memory that is also large and cheap does not exist yet. Graphics cards buy speed, unified memory buys room, and the used market buys price, each at a cost in one of the other two.</dd>
</dl>

</div>

## 4. How to choose

- **Fastest 27B to 31B on a budget:** a used RTX 3090 in a desktop with a 750 W or larger supply. Test it before paying (Lesson 5.6).
- **Fastest overall, if you can find one near list price:** the RTX 5090. It draws up to about 575 W.
- **Quiet, big memory, low power:** Mac mini M5 Pro with 48 or 64 GB, or Mac Studio for 128 GB (large mixture-of-experts models such as gpt-oss-120b).

<div class="problem" data-problem="enthusiast-tier-value"></div>

<div class="myth">

**"An RTX 5070 Ti runs bigger models than an RTX 5060 Ti."** Both have 16 GB, so exactly the same models fit. The 5070 Ti has about twice the bandwidth (896 against 448 GB/s), so it writes about twice as fast. It is a speed upgrade, not a size upgrade.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** above 24 GB, every option trades two of three things: speed, memory size and price.

**Equation:** for a model of M GB: speed ≈ bandwidth ÷ M; fits if usable memory ≥ M + context + 1.

**Analogy:** fast, roomy, cheap: pick two.

**Try it:** a 19 GB Gemma 4 31B on a used 3090 (936 GB/s) versus a 64 GB Mac mini M5 Pro (about 270 GB/s)? (About 49 against 14 tokens per second ceiling. The Mac can also hold far larger models.)
</details>

## 5. Worked example

*Made-up numbers.* Dev, a developer in Toronto, wants Qwen3.8-27B for coding all day. A used 3090 in his existing PC writes 25 to 35 tokens per second; he budgets for a new power supply. His colleague, who wants gpt-oss-120b for long reports, saves for a 128 GB Mac Studio instead.

## 6. Practice

1. Which option in your country gives the lowest price per GB of fast memory?
2. Why is a 16 GB RTX 5070 Ti a speed upgrade but not a size upgrade?
3. Name two risks of a used card.

<details>
<summary>Answers</summary>

1. Usually the used 3090 where available, then the Mac mini M5 Pro 64 GB.
2. Same memory, so the same models fit; only bandwidth (speed) doubles.
3. Worn fans or memory, no warranty, mining or overheating history (Lesson 5.6 has a checklist).
</details>

**New words:** *list price* (MSRP), *second-hand risk*, *capability tier*.

<div class="keypoints">

- 27B to 31B models need 20 to 32 GB of fast memory and are where local AI starts to feel close to the cloud.
- A used RTX 3090 is fast and cheap but second-hand and power-hungry; the RTX 5090 is fastest but costly; Macs are roomy and quiet but slower.
- Speed ceiling = bandwidth ÷ model GB; check fit first, then compare speed and price per GB.
- Same memory means same models: a faster card with equal memory only writes faster.

</div>
