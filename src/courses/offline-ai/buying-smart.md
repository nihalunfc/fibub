---
title: New or used, import or local, warranty and tax
summary: How to buy AI hardware without regret. New against used, buying locally against importing, warranties, taxes and a checklist for second-hand graphics cards.
minutes: 20
updated: 2026-11-19
sources:
  - 'Canada GST/HST rates by province: Canada Revenue Agency (official source), https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate.html'
  - 'UK VAT rates: GOV.UK (official source), https://www.gov.uk/vat-rates'
  - 'India GST: Central Board of Indirect Taxes and Customs (official source), https://cbic-gst.gov.in'
  - 'Mac mini M6 Canadian education price CA$1,109: iPhone in Canada, 22 September 2026, https://www.iphoneincanada.ca/2026/09/22/mac-mini-mac-studio-canada-available/'
  - 'Mac mini M6 base price with and without tax by country: OpenTheRank, 15 November 2026, https://opentherank.com/apple-pricing/mac-mini/'
quiz:
  - q: Why can an imported card cost more than the shop price suggests?
    choices: ['Import duty, sales tax on import, shipping and no local warranty', 'Cards get heavier when shipped', 'Exchange rates are always fixed']
    ans: 0
    why: Add duty, tax, shipping and the cost of sending it back abroad if it fails.
  - q: What is the most important test when buying a used graphics card?
    choices: ['Run a long AI or graphics load and watch temperature, errors and fan noise', 'Check the box is shiny', 'Weigh it']
    ans: 0
    why: A sustained load shows overheating, memory errors or failing fans that a quick look misses.
  - q: A US shop price says US$899. Why might you pay about US$960 or more at the till?
    choices: ['US shelf prices usually exclude state sales tax', 'There is a fixed AI tax', 'Card fees are always 10%']
    ans: 0
    why: US prices are shown before state sales tax; prices in India, the UK and most of Europe include tax.
---

**Module 5 · about 20 minutes · read first: 5.2 and 5.3.** You'll be able to work out the real price of a machine in your country and buy used parts safely.

## 1. Why this matters

The sticker price is rarely what you pay. Taxes, duties, shipping and the cost of a failure can add a fifth or more. A careful buyer saves that, and avoids the worst outcome: an expensive part that dies after the return window.

## 2. Tax in the four countries (check the official source)

- **India:** shop prices include GST. Business buyers registered for GST may claim input credit.
- **Canada:** shelf prices exclude GST/HST and provincial sales tax, about 5% to 15% depending on the province.
- **USA:** shelf prices exclude state and local sales tax, from 0% to about 10%.
- **UK:** shop prices include 20% VAT. VAT-registered businesses may reclaim it.

Students may get education prices on Macs (in Canada, CA$1,109 against CA$1,249 for the base Mac mini M6 at launch).

## 3. Import or buy locally?

Importing can look cheaper, but add: import duty and tax at the border, shipping, currency fees, a different plug, and a warranty that may only work in the country of sale. Unless the saving is large after all of these, buy locally from a shop with clear returns.

## 4. New or used?

New gives warranty and returns. Used gives more memory per money (the used RTX 3090 is the classic, Lesson 5.3). Used checklist:

1. Meet in person or buy from a seller with buyer protection.
2. See it run a long load (a game benchmark or a local model writing for 15 minutes).
3. Watch temperature (it should settle, not climb past the maker's limit), listen to the fans, look for screen glitches or crashes.
4. Check the memory size in the system (Task Manager or `nvidia-smi`).
5. Ask for the receipt; check if any maker's warranty is left.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** compare the landed price, not the sticker price.

**Equation:** landed price = sticker + tax + duty + shipping + fees + (chance of failure × cost of replacing).

**Analogy:** a cheap flight with paid bags, seat and food can cost more than the honest fare.

**Try it:** a US$800 used card, 10% chance it fails in a year with no warranty, against a US$1,000 new card with warranty? (800 + 0.1 × 800 = US$880 expected. Used still wins on expected cost, but you carry the risk.)
</details>

## 5. Worked example

*Made-up numbers.* Hamza in Manchester sees a card for US$700 on an American site and £640 locally. Adding shipping (£40), import VAT (20%) and a card fee, the import costs about £720 with no UK warranty. He buys locally.

## 6. Practice

1. What sales tax applies where you live?
2. Write the landed price of one machine from Lesson 5.2 in your country.
3. What two things would you check first on a used card?

<details>
<summary>Answers</summary>

1. Check your government's tax site; it is the official source.
2. Sticker + tax (+ duty and shipping if imported).
3. A long load test (heat, stability) and the memory size shown by the system.
</details>

**New words:** *landed price*, *GST/HST*, *VAT*, *import duty*, *buyer protection*.
