---
title: 'Starter tier: a 16 GB graphics card or a 32 GB Mac'
summary: The two most popular first purchases for local AI, with today's prices in India, Canada, the USA and the UK, and which one suits whom.
minutes: 20
updated: 2026-11-24
sources:
  - 'RTX 5060 Ti 16 GB, India: gpuprix.com, lowest ₹44,767, three-month median ₹48,295, read 18 November 2026, https://gpuprix.com/india/gpus/geforce-rtx-5060-ti-16gb'
  - 'RTX 5060 Ti 16 GB, Canada: gpuprix.com Canada listings, lowest CA$1,170, three-month median CA$1,073, read 18 November 2026, https://gpuprix.com'
  - 'RTX 5060 Ti 16 GB, UK: Cloudzat, £639.98 to £874.99, 2 November 2026, https://cloudzat.com'
  - 'RTX 5060 Ti 16 GB, USA: list price $429, street $429 to $479, Compute Market, updated 1 November 2026, https://compute-market.com'
  - 'Mac mini M6 US prices by memory: Daring Fireball, August 2026, https://daringfireball.net/2026/08/configurations_and_pricing_for_new_mac_minis_and_mac_studios'
  - 'Mac mini M6 base, India ₹99,900 and UK £899: OpenTheRank, 15 November 2026, https://opentherank.com/apple-pricing/mac-mini/'
  - 'Mac mini M6 base, Canada CA$1,249: iPhone in Canada, 22 September 2026, https://www.iphoneincanada.ca/2026/09/22/mac-mini-mac-studio-canada-available/'
quiz:
  - q: You already own a desktop PC with a good power supply. Which starter upgrade gives the most speed per rupee or dollar?
    choices: ['A 16 GB graphics card', 'A new Mac mini', 'A new laptop']
    ans: 0
    why: The card drops into the PC you own and has fast memory (448 GB/s).
  - q: Why might someone pick a 32 GB Mac mini over a 16 GB card?
    choices: ['It writes faster', 'It fits bigger models (27B to 31B) quietly and at low power', 'It is always cheaper']
    ans: 1
    why: More memory fits bigger models; the card is faster on models that fit in 16 GB.
  - q: Why do prices of the same card differ so much between countries?
    choices: ['Import duties, taxes, shop margins and local shortages', 'The cards are different', 'Exchange rates only']
    ans: 0
    why: Same card, different taxes, duties and stock levels, especially during the 2026 memory shortage.
---

**Module 5 · about 20 minutes · read first: 4.1, 4.2 and 5.1.** You'll be able to choose a first upgrade and price it in your country.

<div class="bigidea">A 16 GB graphics card is the fast choice for models up to about 14B; a 24 to 32 GB Mac mini is the roomy, quiet choice for 27B to 31B models.</div>

## 1. Why this matters

For most people who outgrow their laptop, the choice is between a 16 GB graphics card for a desktop and a Mac mini with 24 to 32 GB. One is fast, the other fits bigger models. Picking the right one saves you a second purchase.

## 2. The two choices

**16 GB graphics card (RTX 5060 Ti 16 GB class):** 448 GB/s, fits models up to about 14B fully, reads prompts fast, draws about 180 W. Needs a desktop PC (Lesson 4.4).

**Mac mini M6 with 24 or 32 GB:** fits 27B to 31B models at 4-bit, quiet, about 25 to 40 W under load. Writes more slowly on the same model, and is slower to read long prompts.

Try it: choose a 32B model at 4-bit, then slide the GPU memory from none up to 24 GB.

<figure class="fig" data-fig="@ai-gpu-offload"><figcaption>Every generated token reads every layer, so the slow part (layers left on the CPU) sets the speed. Each extra layer moved to the GPU helps a little, and the last ones help most.</figcaption></figure>

## 3. Prices today

<!--fig:build-rig-->

| | India | Canada | USA | UK |
|---|---|---|---|---|
| RTX 5060 Ti 16 GB (card only) | ₹44,767 to ₹48,295 | CA$1,073 to CA$1,170 | US$429 to US$479 | £640 to £875 |
| Mac mini M6, 16 GB | ₹99,900 | CA$1,249 | US$899 | £899 |
| Mac mini M6, 32 GB | check Apple | check Apple | US$1,299 | check Apple |

Prices read between 2 and 18 November 2026; sources are listed below this lesson. They move every week during the memory shortage (Lesson 5.7). **Check the official store and a price tracker before you buy.**

## 4. Comparing them fairly

Price alone misleads. Compare what you get for the money, the way you buy rice by the kilo and not by the bag. Here is the comparison with the US prices above:

<div class="steps">
<div class="step"><b>Usable memory.</b> The card gives about 15 GB to the model. A 32 GB Mac gives about two thirds, so about 21 GB.</div>
<div class="step"><b>Price per GB.</b> Card: US$429 ÷ 15 ≈ US$29 per GB. Mac: US$1,299 ÷ 24 ≈ US$54 per GB. The card is cheaper per GB.</div>
<div class="step"><b>Speed on a model both can hold.</b> Gemma 4 12B (7.7 GB). Card: 448 ÷ 7.7 ≈ 58 tokens per second ceiling. Base Mac mini class (about 120 GB/s): 120 ÷ 7.7 ≈ 16.</div>
<div class="step"><b>What only one can do.</b> A 27B model (about 16 GB at 4-bit) does not fit on the card. It does fit in the 32 GB Mac.</div>
<div class="step"><b>The catch.</b> The card needs a desktop PC with a good power supply. The Mac is a whole computer. If you have no desktop, add one to the card's price.</div>
</div>

```math
\text{price per GB} = \frac{\text{price}}{\text{usable GB}}
```

<div class="problem" data-problem="starter-tier-per-gb"></div>

<div class="meaning">

<dl>
<dt>Usable GB</dt><dd>The memory the model can actually use: about 15 of a 16 GB card, about two thirds of a Mac's memory (three quarters above 36 GB).</dd>
<dt>Price per GB</dt><dd>How much each GB of usable fast memory costs. Lower is better value for fitting models.</dd>
<dt>Speed per money</dt><dd>(bandwidth ÷ model GB) ÷ price: how many tokens per second each unit of money buys.</dd>
<dt>Physical meaning</dt><dd>You are paying for two things: room to hold the model and speed to read it. The card sells speed cheaply; the Mac sells room, quiet and low power. Which is the bargain depends on which one you are short of.</dd>
</dl>

</div>

<div class="myth">

**"A 16 GB Mac and a 16 GB graphics card hold the same models."** The card gives nearly all its 16 GB to the model. The Mac shares its 16 GB with macOS and your apps, so only about 10 to 11 GB is usable (about two thirds). That is why this lesson says to skip the 16 GB Mac if you can.

</div>

## 5. Who should pick which

- Already have a desktop and want speed on small to medium models: the **card**.
- Want bigger models, silence and low power, or do not own a desktop: the **Mac mini with 24 or 32 GB**. Skip 16 GB if you can: it is the size you are leaving behind.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** compare price per GB of fast memory and price per token per second, not price alone.

**Equation:** price per GB = price ÷ usable GB. Speed per money = (bandwidth ÷ model GB) ÷ price.

**Analogy:** buying rice by the kilo, not by the bag: a bigger bag can be the better deal.

**Try it:** US$429 for 15 usable GB versus US$1,299 for about 21 usable GB? (About $29 per GB versus about $61 per GB. The card is cheaper per GB but needs a PC; the Mac is a whole computer.)
</details>

## 6. Worked example

*Made-up numbers.* Priya in Pune has a three-year-old desktop with a 650 W supply. A 16 GB card at about ₹46,000 runs Gemma 4 12B at 40 to 50 tokens per second. A 32 GB Mac mini would cost well over twice that. She buys the card and keeps the Mac idea for when she needs 27B models.

## 7. Practice

1. Use the calculator for your country. Which option costs less per GB?
2. Does your desktop's power supply meet the card maker's recommendation?
3. Find today's price in your country on two shops. How far apart are they?

<details>
<summary>Answers</summary>

1. Usually the card, if you already own the PC.
2. If not, add a power supply to the budget (Lesson 4.4).
3. Differences of 10 to 30% are common in 2026; buy from shops with clear return terms.
</details>

**New words:** *street price* (what shops charge), *list price* (the maker's suggested price), *price per GB*.

<div class="keypoints">

- A 16 GB card is fast (448 GB/s) and cheap per GB but needs a desktop and holds models up to about 14B.
- A 24 to 32 GB Mac mini holds 27B to 31B models, quietly and at low power, but writes more slowly.
- Compare price per usable GB and speed per money, not the sticker price.
- Prices move weekly in 2026: check the official store and a price tracker in your own country.

</div>
