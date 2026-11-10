---
title: "How to calculate half-life and the amount left (worked examples)"
summary: "Amount left = start × (1/2)^(t ÷ half-life). How to use it both ways, a worked iodine-131 example, finding a half-life from two readings, and quick checks."
tools: [decay-calculator, decay-dice]
updated: 2026-11-10
sources:
  - "Half-life of iodine-131 (8.0252 days): NNDC (ENSDF, US Brookhaven National Laboratory) and DDEP recommended values."
  - "Law of radioactive decay N = N₀ e^(−λt), with λ = ln 2 ÷ T½: standard school physics."
---

The amount of a radioactive sample left after a time t is the starting amount × (1/2)^(t ÷ T½), where T½ is the half-life. To find the half-life from two readings, turn it round: T½ = t × ln 2 ÷ ln(start ÷ end). The [[decay-calculator]] does the first sum from dates and times and tells you when a sample will drop to any level you type.

## What you need

- **A starting amount.** This can be a mass, a number of atoms, a count rate or an activity in becquerels (Bq). The formula works the same for all of them.
- **The half-life**, the time it takes for half of the sample to decay. Or, if that is the unknown, a second reading taken later.
- **The time that has passed**, in the same unit as the half-life.

## Step by step

Each half-life, whatever is left is cut in half. So after 1 half-life you have 1/2, after 2 you have 1/4, after 3 you have 1/8. In general:

**N = N₀ × (1/2)^n, where n = t ÷ T½**

- N₀ is the amount at the start, N the amount left.
- t is the time passed and T½ the half-life, in the same units.
- n is the number of half-lives. It does not have to be a whole number.

To find the half-life when you know the start, the end and the time, take logs of both sides:

**T½ = t × ln 2 ÷ ln(N₀ ÷ N)**

You may also meet the decay constant λ (lambda), the fraction of nuclei that decay per second: λ = ln 2 ÷ T½ = 0.693 ÷ T½.

With the tool:

1. Pick the **Nuclide** from the list, or choose "Your own half-life…" and type the half-life and its unit.
2. Type the **Activity at the reference time** and pick its unit.
3. Set the **Reference date and time** and the **Wanted date and time**. The large result shows the activity at the wanted time and the percentage left.
4. Under the result, "Time between" also tells you how many half-lives have passed.
5. Optionally type a value in **When will it fall to** to get the date and time it reaches that level.
6. Set the step of the **Decay table** to the half-life to see the halving row by row.

## A worked example

A lab receives iodine-131 with an activity of 200 MBq. Its half-life is 8.0252 days. How much is left 24 days later?

**Number of half-lives.** n = 24 ÷ 8.0252 = 2.991.

**Amount left.** N = 200 × (1/2)^2.991 = **25.16 MBq**, which is 12.58 % of the start.

A rough check: 24 days is about 3 half-lives, and 200 → 100 → 50 → 25. Our answer is just above 25, because 2.991 is slightly less than 3.

In the decay calculator, choose I-131, type 200 with MBq, and set the wanted date 24 days after the reference. It gives 25.16 MBq (12.58 % of the reference) and 2.991 half-lives. Type 10 in "When will it fall to" and it says 34.68 days after the reference.

**Finding a half-life from two readings.** A detector reads 640 counts per second from a source. Ten hours later it reads 200. What is the half-life?

T½ = 10 × ln 2 ÷ ln(640 ÷ 200) = 10 × 0.6931 ÷ 1.1632 = **5.96 hours**

To check it on the page, choose "Your own half-life…", type 5.96 hours, set 640 Bq at the reference time and the wanted time 10 hours later. The result comes out at 200 Bq.

## Check your answer

- **Count the halvings.** If the time is close to a whole number of half-lives, halve the start that many times in your head. Your answer should be near that.
- **The answer is never zero.** A sample halves forever. After 10 half-lives about 0.1 % is still there.
- **Less time, more left.** If less than one half-life has passed, more than half must remain.
- **Units must match.** A half-life in days with a time in hours gives nonsense. Convert one of them first.
- **Plug the half-life back in.** For the second example, 640 × (1/2)^(10 ÷ 5.96) is about 200, so the answer holds.

## Questions people ask

**Why does the same fraction decay each half-life, no matter how much there is?**
Each nucleus has the same fixed chance of decaying in a given second, and it has no memory of how long it has waited. The [[decay-dice]] page shows this with hundreds of dice: remove every six on each throw and a steady half-life appears.

**Is half-life only for radioactivity?**
No. Anything that falls by a fixed fraction in each equal time has one, such as a drug leaving the blood or a first-order chemical reaction. The same formula applies.

**How do I find the half-life from a graph?**
Read the starting value, find half of it on the vertical axis, go across to the curve and down to the time axis. That time is one half-life. Repeat from there and you should get the same gap.
