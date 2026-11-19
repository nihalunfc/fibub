---
title: Watts at rest and at full load
summary: How much power AI machines draw while idle, while reading a prompt and while writing, and how to measure your own.
minutes: 15
updated: 2026-11-19
sources:
  - 'Graphics card board power (RTX 5060 Ti 180 W, RTX 3090 350 W, RTX 5090 575 W): NVIDIA product pages via Compute Market, updated 1 November 2026, https://compute-market.com'
  - 'India: about US$0.077 per kWh for homes, 2023 to 2025 average (about ₹6.5), GlobalPetrolPrices, https://www.globalpetrolprices.com/India/electricity_prices/'
  - 'Canada (Ontario): time-of-use prices from 1 November 2026, 9.1¢, 14.6¢ and 18.9¢ per kWh, Ontario Energy Board via NOW Toronto, https://nowtoronto.com/news/ontario-electricity-rates-dropping-november-2026-what-to-know/'
  - 'USA: average home price 18.2¢ per kWh in August 2026 (EIA data), ElectricRates.org, https://electricrates.org/states/report/2026-08/'
  - 'UK: price cap 1 October to 31 December 2026, 26.32p per kWh and 54.83p a day, Ofgem, https://www.ofgem.gov.uk/news/changes-energy-price-cap-between-1-october-and-31-december-2026'
quiz:
  - q: Your PC draws 250 W while the model writes and 60 W idle. Which number matters most for the bill?
    choices: ['Whichever state it spends most hours in, times its watts', 'Only the 250 W', 'Only the 60 W']
    ans: 0
    why: Energy is watts × hours for each state. A PC left on idle all day can use more than short bursts of work.
  - q: What is a kilowatt-hour?
    choices: ['1,000 watts for one hour, the unit on your bill', 'A kind of battery', 'The speed of a graphics card']
    ans: 0
    why: "Bills charge per kWh: 250 W for 4 hours is 1 kWh."
  - q: What is the most reliable way to know your machine's real power draw?
    choices: ['A plug-in power meter between the wall and the machine', 'The box label', 'Guessing from the fan noise']
    ans: 0
    why: Labels give maximums; a meter shows what your machine actually draws for your work.
---

**Module 6 · about 15 minutes · read first: 4.4.** You'll be able to estimate how many kWh your AI machine uses.

## 1. Why this matters

Local AI has no per-token bill, but it does have an electricity bill. For a laptop it is tiny; for a big graphics card used all day it can be a real monthly cost. Knowing the watts is the first step to knowing the money (Lesson 6.2).

<!--fig:power-bill-->

## 2. Three states

- **Idle** (model loaded, nobody asking): a Mac mini a few watts to about 10 W, a desktop with a graphics card about 50 to 90 W, a 128 GB box somewhere between.
- **Reading a prompt (prefill):** short bursts at close to full power.
- **Writing:** the graphics card often runs below its rated power because it waits on memory (Lesson 4.2), but still high.

Rough whole-machine figures while writing (at the wall, estimates):

| Machine | While writing |
|---|---|
| Laptop or Mac mini | about 20 to 40 W |
| Mac mini Pro or Mac Studio | about 50 to 120 W |
| PC with RTX 5060 Ti (180 W card) | about 200 to 280 W |
| PC with RTX 3090 (350 W card) | about 350 to 500 W |
| PC with RTX 5090 (575 W card) | about 500 to 800 W |
| 128 GB AI box | about 150 to 250 W |

## 3. Measure, do not guess

A plug-in power meter (an inexpensive gadget sold in hardware shops) shows real watts. Note idle, writing and peak. You can also lower a card's power limit by 20 to 30% with the maker's tool: since writing is memory-bound, speed often drops only a little.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** energy is power multiplied by time, added up for each state.

**Equation:** kWh = (W writing × h writing + W idle × h idle) ÷ 1,000.

**Analogy:** a tap: watts are how far it is open, hours how long it runs, kWh the water in the bucket.

**Try it:** 250 W for 2 hours of writing plus 60 W idle for 6 hours? ((500 + 360) ÷ 1,000 = 0.86 kWh a day.)
</details>

## 4. Worked example

*Made-up numbers.* Sana measures her PC: 70 W idle, 260 W writing. She had been leaving it on all day. Switching it to sleep when not in use saves about 0.5 kWh a day, more than her actual AI use costs.

## 5. Practice

1. Pick your machine in the calculator and set your hours.
2. Why does a graphics card often draw less than its rated power while writing?
3. How could you halve your idle energy?

<details>
<summary>Answers</summary>

1. Note the kWh per month; Lesson 6.2 turns it into money.
2. It waits on memory, so its maths units are not fully busy.
3. Sleep or shut down the machine when idle, or unload the model if the engine keeps the card busy.
</details>

**New words:** *watt (W)*, *kilowatt-hour (kWh)*, *power limit*, *plug-in power meter*.
