---
title: "How to calculate percentage increase (and decrease)"
summary: "Take the new value minus the old one, divide by the old value and multiply by 100. A worked pay-rise example, quick checks and the common traps."
tools: [percentage-calculator, hourly-salary, sales-tax-calculator]
updated: 2026-11-10
sources:
  - "Standard percent change formula. Example numbers worked with fibub's own src/lib/money/shopping.ts."
---

Percentage increase is the change divided by where you started: (new − old) ÷ old × 100. A negative answer is a decrease. The **% change** tab of the [[percentage-calculator]] does it as you type and writes the answer out as a sentence, so you can see it measured the right way round.

## What you need

- **The old value**: the starting price, pay, score or count.
- **The new value**: the same thing, measured the same way, at the later time.
- **The same units for both.** Compare a yearly salary with a yearly salary, not with an hourly rate. If one offer is hourly and the other is yearly, turn them into the same period first with the [[hourly-salary|salary converter]].

## Step by step

The formula is:

**Percent change = (new − old) ÷ old × 100**

- **new − old** is the change. It is positive when the value went up and negative when it went down.
- **÷ old** compares the change with the starting point, because a rise of 10 means a lot on 20 and very little on 2,000.
- **× 100** turns the fraction into a percent.

The base is always the old value. That single choice is behind most mistakes with percentages.

With the calculator:

1. Open the page and press the **% change** tab at the top.
2. Type the starting number in **From (old value)**.
3. Type the later number in **To (new value)**.
4. Read the large answer, shown with a plus sign for a rise and a minus sign for a fall.
5. Read the sentence underneath. It says "an increase of" or "a decrease of", which is a quick way to spot that you swapped the two boxes.

The old value cannot be zero, because nothing can be divided by zero. The page tells you so if you try.

The same page has five other tabs for related questions, such as **X% of Y** to find the size of a rise before it happens, and **Add or remove %** to apply one.

## A worked example

Alex earned 48,000 a year and has just been offered 51,600.

- Change: 51,600 − 48,000 = 3,600.
- Divide by the old pay: 3,600 ÷ 48,000 = 0.075.
- Times 100: **7.5% increase**.

Typing 48000 in **From** and 51600 in **To** gives +7.5%, with the sentence "From 48,000 to 51,600 is an increase of 7.5%."

Now go the other way. Suppose Alex later moves to a role paying 48,000 again. From 51,600 down to 48,000 is:

- Change: 48,000 − 51,600 = −3,600.
- Divide by the old value, which is now 51,600: −3,600 ÷ 51,600 = −0.0698.
- Times 100: about **6.98% decrease**.

The same 3,600 is a 7.5% rise but only a 6.98% fall, because the starting point changed.

A second, everyday case: a loaf of bread went from 1.20 to 0.96 in a sale. (0.96 − 1.20) ÷ 1.20 × 100 = **−20%**, a 20% decrease.

## Check your answer

- **Work it backwards.** Use the **X% of Y** tab: 7.5% of 48,000 is 3,600, and 48,000 + 3,600 = 51,600. If you land back on the new value, the answer is right.
- **Look at the sign.** If the value went up, the answer must be positive. A minus sign on a pay rise means the boxes are swapped.
- **Rough size.** 3,600 is a bit less than a tenth of 48,000, so the answer should be a bit under 10%. 7.5% fits; 75% or 0.75% would not.
- **Double means 100%.** Going from 50 to 100 is a 100% increase, not 50%. Halving is a 50% decrease.

## Questions people ask

**What is the difference between percent and percentage points?** If an interest rate moves from 4% to 5%, it rose by 1 percentage point, but by 25% in percent terms, because 1 ÷ 4 = 0.25. News reports and bank letters may use either, so check which one is meant.

**Can a percentage decrease be more than 100%?** Not for something that cannot go below zero, like a price. A 100% decrease already takes it to zero. Values that can turn negative, such as profit, can show changes larger than 100%.

**How do I find the original price after a percent was added, such as tax?** Do not just take the percent off again, because that uses the wrong base. Divide by (1 + rate ÷ 100) instead, or use **Add or remove %** with "Amount already includes it". The [[sales-tax-calculator]] does the same for sales tax, GST and VAT, but tax rates change by place, so check the official source for yours.
