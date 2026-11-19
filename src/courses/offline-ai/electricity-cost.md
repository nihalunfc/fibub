---
title: What an hour of AI costs in electricity
summary: Turn watts into rupees, dollars and pounds with today's home electricity prices in India, Canada, the USA and the UK.
minutes: 15
updated: 2026-11-19
sources:
  - 'India: about US$0.077 per kWh for homes, 2023 to 2025 average (about ₹6.5), GlobalPetrolPrices, https://www.globalpetrolprices.com/India/electricity_prices/'
  - 'Canada (Ontario): time-of-use prices from 1 November 2026, 9.1¢, 14.6¢ and 18.9¢ per kWh, Ontario Energy Board via NOW Toronto, https://nowtoronto.com/news/ontario-electricity-rates-dropping-november-2026-what-to-know/'
  - 'USA: average home price 18.2¢ per kWh in August 2026 (EIA data), ElectricRates.org, https://electricrates.org/states/report/2026-08/'
  - 'UK: price cap 1 October to 31 December 2026, 26.32p per kWh and 54.83p a day, Ofgem, https://www.ofgem.gov.uk/news/changes-energy-price-cap-between-1-october-and-31-december-2026'
quiz:
  - q: A PC draws 250 W while writing. UK price-cap electricity is 26.32p per kWh. What does one hour of writing cost?
    choices: ['About 6.6p', 'About 66p', 'About £6.60']
    ans: 0
    why: 0.25 kWh × 26.32p ≈ 6.6p.
  - q: Why can the same machine cost four times as much to run in one country as another?
    choices: ['Home electricity prices differ a lot between countries and regions', 'The machine uses more power abroad', 'It does not']
    ans: 0
    why: About ₹6.5 (roughly 8 US cents) in India against about 35 US cents in the UK per kWh.
  - q: How can Ontario users lower the cost of long batch jobs?
    choices: ['Run them at night on the ultra-low overnight or off-peak price', 'Run them at 5 p.m.', 'Use a bigger card']
    ans: 0
    why: Time-of-use prices are lowest overnight; schedule long jobs then.
---

**Module 6 · about 15 minutes · read first: 6.1.** You'll be able to put a price on an hour, a month and a year of local AI where you live.

## 1. Why this matters

When people compare local AI with a subscription (Module 16), they often forget electricity, or overestimate it. A few numbers settle it.

## 2. Today's home prices (check your bill)

| Country | Typical price per kWh | Note |
|---|---|---|
| India | about ₹5 to ₹9 per unit | varies by state and slab; average about ₹6.5 |
| Canada | 9.1¢ to 18.9¢ (Ontario, from 1 Nov 2026) | plus delivery; Quebec lower |
| USA | 18.2¢ average (Aug 2026) | 12.7¢ Nevada to 47.2¢ Hawaii |
| UK | 26.32p (price cap, Oct to Dec 2026) | plus 54.83p a day standing charge |

Sources are listed below. **Your own bill is the official source for you**, since tariffs depend on your supplier, region and plan.

<!--fig:power-bill-->

## 3. Typical results

A PC with an RTX 5060 Ti writing for 2 hours a day, 22 days a month (11 kWh):

- India: about ₹72 a month.
- Ontario off-peak: about CA$1.00 a month (before delivery charges).
- USA average: about US$2.00 a month.
- UK price cap: about £2.90 a month.

Even a big RTX 5090 rig used 4 hours a day costs only tens of pounds or dollars a month. The bigger cost of owning hardware is the purchase price (Module 16).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** electricity cost is energy multiplied by price.

**Equation:** cost = W × h × days ÷ 1,000 × price per kWh.

**Analogy:** petrol for a car: litres used times price per litre.

**Try it:** a 750 W rig, 4 hours a day, 30 days, at 18.2¢? (750 × 4 × 30 ÷ 1,000 = 90 kWh × US$0.182 ≈ US$16.40 a month.)
</details>

## 4. Worked example

*Made-up numbers.* Kofi in Ottawa runs a long batch job (summarising 2,000 documents) on a 450 W PC for 8 hours. At 18.9¢ on-peak it costs about CA$0.68; overnight at 9.1¢ it costs about CA$0.33. He schedules big jobs overnight.

## 5. Practice

1. Find the price per kWh on your last bill and enter it in the calculator.
2. What does your expected use cost per month and per year?
3. Compare it with one month of an AI subscription you know.

<details>
<summary>Answers</summary>

1. Use the energy charge per kWh (unit rate), not the bill total.
2. For most single users it is a small amount; heavy daily use of big cards is the exception.
3. Usually electricity is far less than a subscription; the hardware price is what decides it (Module 16).
</details>

**New words:** *tariff*, *unit rate*, *standing charge*, *time-of-use*.
