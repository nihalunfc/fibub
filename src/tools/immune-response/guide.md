---
name: Immune response timeline
num: 1451
shelf: learn
code: L280
section: school-biology
title: "Primary and secondary immune response: antibody curves, vaccines, boosters and memory cells"
summary: "Put vaccine doses and infections on a timeline and watch the antibody level rise and fall: a slow, small primary response the first time, a fast, big secondary response after that. See IgM and IgG, a protective level, memory cells, and a tappable antibody with its heavy and light chains. A teaching model."
status: live
ads: false
order: 1451
icon: curve
works: offline
updated: 2026-11-09
related: [cell-explorer, herd-immunity, epidemic-model]
sources:
  - "Standard school immunology: primary and secondary (anamnestic) responses, IgM before IgG, memory B cells, active and passive immunity, vaccination and boosters, and the H₂L₂ antibody structure. Written for fibub; no textbook text, figures or exercises are used."
  - "The curves are a teaching model with round, made-up numbers in arbitrary units (lags of 6 and 2 days, half-lives of 5, 20 and 40 days, a 10-fold memory boost you can change). They show the pattern, not real measurements, and are not medical advice."
  - "Checked against a separate Python version of the same model (plain loops and numpy) for the levels, peaks and protected days of two stories."
flow:
  - { icon: calendar, label: "Timeline" }
  - { icon: curve, label: "Antibodies" }
  - { icon: target, label: "Protected?" }
  - { icon: check, label: "Check" }
---

## What it shows

The first time your body meets a germ, the **primary immune response** is slow and small: it takes about a week before antibodies appear, and the level stays fairly low. But the body keeps **memory cells**. The next time the same germ (or a vaccine made from it) turns up, the **secondary response** starts within a couple of days, climbs many times higher and lasts much longer. Vaccines and boosters work by giving the body that first meeting safely.

This page draws the antibody level against time for up to three events (a vaccine dose or the real germ), a dashed **protective level**, and a table of each response's lag, peak and memory. A second card shows one antibody molecule: tap its parts to learn what each does.

It fits **Class 12 Biology: human health and disease** (immunity: innate and acquired, active and passive, vaccination and immunisation, the structure of an antibody). The cells involved are drawn in [[cell-explorer]]; what happens across a whole town is in [[epidemic-model]], and why vaccinating most people protects everyone is in [[herd-immunity]].

This is a **teaching model**. The numbers are round and made up, in arbitrary units. Real responses differ between people and germs. Not medical advice.

## How to use it

1. Pick a **story**, or set your own: each of the three events can be *Nothing*, a *Vaccine dose* or a *Germ (infection)*, on any day from 0 to 330.
2. Slide the **protective level**: above it, the model says the germ is stopped before it can make the person ill.
3. Slide the **memory boost**: how many times bigger the IgG peak of the first secondary response is than in the primary one.
4. Switch **Total antibodies** to **IgM and IgG** to see the two classes separately, and tick **Log scale** to see small levels too.
5. Read the sentence under the graph, the facts (days protected, rounds of memory, second peak ÷ first) and the table.

## Worked example

In *Infection, then the same germ again*, the germ arrives on day 10 and again on day 100, with protective level 2 and memory boost × 10. The first response starts 6 days later and peaks at **1.3** on day **21**: below the protective line. The second starts after only 2 days and peaks at about **6.47** on day **107**, five times higher, and it falls much more slowly. The second peak ÷ first is **× 5**, and the level is at or above 2 on **67** days of the year.

## Options explained

- **Vaccine dose**: in this model a dose triggers 60 % of the response a germ would, because a vaccine does not multiply.
- **Germ**: if the level is already above the protective line on the day it arrives, the page says the person is protected.
- **IgM and IgG**: IgM (dashed) is the first antibody made and fades fast. IgG takes over and dominates the secondary response.

## Check yourself

Five questions: three on ideas (which response is faster, active and passive immunity, antibody chains, which cells make antibodies) and two with numbers (halving after the peak, and the day a second response starts). Nothing is saved.

## FAQ

**Why do some vaccines need boosters?** One dose gives a primary response and some memory cells. A booster gives a secondary response: a far higher, longer-lasting level and more memory.

**Are these real antibody numbers?** No. They are teaching values chosen to show the shape. Real levels are measured in labs in many different units.

**Is this from my textbook?** It covers the standard school topic with its own model and examples. It is an independent study aid, not part of any board or publisher.
