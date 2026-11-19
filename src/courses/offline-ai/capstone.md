---
title: 'Capstone: an offline AI setup for one sector'
seoTitle: 'Capstone: design an offline AI setup | Offline AI'
summary: Bring the whole course together. Choose a sector and an organisation, design its offline AI setup, build a working piece of it, cost it against cloud plans, and write a one-page brief a manager could approve.
minutes: 60
updated: 2026-11-19
sources:
  - 'All modules of this course; prices from prices.ts (hardware checked 18 November 2026, plans 19 November 2026)'
quiz:
  - q: What should the one-page brief lead with?
    choices: ['The recommendation, its cost and what it delivers', 'The history of AI', 'A list of every model you tried']
    ans: 0
    why: A manager reads the first lines; put the decision there, and the detail below.
  - q: Why must the capstone include a working piece, not just a plan?
    choices: ['It proves the setup works on real-style tasks and gives measured numbers for the brief', 'Plans are not allowed', 'To use more electricity']
    ans: 0
    why: Measured speed and accuracy turn a guess into evidence.
  - q: Which number belongs in the cost sheet?
    choices: ['Break-even months against the cloud plans it replaces', 'The number of pages in the course', 'The model''s release date']
    ans: 0
    why: The cost sheet answers "will it pay for itself, and when?" (Lesson 16.4).
---

**Module 18 · about 60 minutes to plan, a few evenings to build · read first: the lesson for your chosen sector.** You'll design, build, cost and present a complete offline AI setup.

## 1. The task

Pick one organisation, real or made up, from any sector in this module: a clinic, a law office, a school, a shop, a lab, a ship. Then produce four things:

1. **Design:** hardware, model, engine, front end, network and data rules.
2. **Working piece:** one real workflow running on your machine with real-style data.
3. **Cost sheet:** hardware, power, time and cloud plans replaced, with break-even.
4. **One-page brief** for the decision-maker.

## 2. Design checklist

| Question | Course |
|---|---|
| Who uses it, how many, how often? | 5.5, 15.1 |
| What data may never leave? | 15.6, 17.6, 17.7 |
| Which model passes your quality test? | 7.3, 17.1 |
| Will it fit, and how fast? | 4.1, 17.2, 17.3 |
| Which engine and front end? | Module 9, 15.2 |
| How is it reached, secured, backed up? | 15.4, 15.5 |
| What stays in the cloud, if anything? | 15.6, 16.5 |

## 3. The working piece

Choose one: document search with citations (Module 12), a reply drafter (mini project 9), an SQL helper (mini project 8), a scheduled summary job (Lesson 13.7), or speech-to-notes (Lesson 13.4). Measure it: 10 to 20 test tasks, how many it gets right, time per task, tokens per second.

## 4. The cost sheet

Use the calculator, with prices for your country and the date you checked them:

<!--fig:break-even-->

List: hardware (only the extra), extras, electricity, setup and upkeep hours, resale, cloud plans or API spend replaced, plans kept. State the break-even month.

## 5. The one-page brief

```
Title: Private AI assistant for <organisation>
Recommendation: <one sentence: what to buy and run, and why>
What it does: <2-3 workflows, with measured results from your test>
Data: <what stays on site; what may use the cloud and under which rule>
Cost: <upfront, monthly, break-even month; prices checked on <date>>
Risks and controls: <3 lines: accuracy checks, security, upkeep owner>
Next step: <a 30-day pilot with named users and a success measure>
```

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a good proposal is a claim, evidence and a cost.

**Equation:** decision value = measured time saved × value of time − total monthly cost, with risks controlled.

**Analogy:** an architect's proposal: a drawing, a model of one room, a quote and a timeline.

**Try it:** 6 staff each save 30 minutes a day, 22 days a month, time worth 25 an hour, setup costs 60 a month over its life? (6 × 0.5 × 22 × 25 = 1,650 a month of time saved, against 60: an easy yes, if the measured saving is real.)
</details>

## 6. How to judge your capstone

- Does the design respect every data rule you listed?
- Does the working piece run with the network cable out (Lesson 9.6)?
- Are all prices dated and sourced, and all usage numbers measured or marked as estimates?
- Could a manager approve the brief in five minutes?

## 7. Worked example

*Made-up capstone.* Aisha designs "Private AI for a 10-person immigration law office": a 64 GB Mac mini, a 27B model, Open WebUI with a collection per client, nightly encrypted backup. Her working piece searches 300 sample public immigration guidance documents and answers 18 of 20 test questions with correct citations. Cost sheet: about CA$3,800 up front, about CA$3 a month of power, replacing eight of ten plans (about CA$250 a month); break-even about 15 months before resale. Her brief proposes a 30-day pilot with three lawyers.

## 8. Share it

Put the design, code, test results, cost sheet and brief in a public repository (with no private data) and link it from your CV (Lesson 18.11).

**New words:** *pilot*, *one-page brief*, *success measure*.
