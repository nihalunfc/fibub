---
title: 'Capstone: an offline AI setup for one sector'
seoTitle: 'Capstone: design an offline AI setup | Offline AI'
summary: Bring the whole course together. Choose a sector and an organisation, design its offline AI setup, build a working piece of it, cost it against cloud plans, and write a one-page brief a manager could approve.
minutes: 60
updated: 2026-11-22
sources:
  - 'All modules of this course; prices from prices.ts (hardware checked 18 November 2026, plans 19 November 2026)'
  - 'Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks", 2020, https://arxiv.org/abs/2005.11401'
  - 'Ollama documentation (running and serving models locally), https://docs.ollama.com'
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

<div class="bigidea">A good proposal for local AI is a design that respects the data rules, one working piece with measured results, an honest cost sheet with a break-even month, and a one-page brief a manager can approve in five minutes.</div>

## 1. The task

Pick one organisation, real or made up, from any sector in this module: a clinic, a law office, a school, a shop, a lab, a ship. Then produce four things:

1. **Design:** hardware, model, engine, front end, network and data rules.
2. **Working piece:** one real workflow running on your machine with real-style data.
3. **Cost sheet:** hardware, power, time and cloud plans replaced, with break-even.
4. **One-page brief** for the decision-maker.

It is an architect's proposal: a drawing, a model of one room, a quote and a timeline.

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

<div class="steps">
<div class="step"><p><b>Design.</b> Aisha picks "a 10-person immigration law office": a 64 GB Mac mini, a 27B model, Open WebUI with a collection per client, nightly encrypted backup, no internet tools. Client files never leave.</p></div>
<div class="step"><p><b>Working piece.</b> She loads 300 public immigration guidance documents into a local document search and writes 20 test questions. It answers <b>18 of 20</b> with correct citations.</p></div>
<div class="step"><p><b>Cost sheet.</b> About CA$3,800 up front and CA$3 a month of power. It replaces eight of ten plans, about CA$250 a month. Break-even: 3,800 ÷ (250 − 3) ≈ <b>15 months</b>, before resale.</p></div>
<div class="step"><p><b>Brief.</b> One page that leads with the recommendation, the measured 18 of 20, the cost and break-even, three risks with their controls, and a 30-day pilot with three lawyers.</p></div>
</div>

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

```math
V = s \times h \times D \times v - C
```

<div class="meaning">

<dl>
<dt>s</dt><dd>staff who use it</dd>
<dt>h</dt><dd>hours each saves a day, measured in the pilot, not guessed</dd>
<dt>D</dt><dd>working days a month</dd>
<dt>v</dt><dd>what an hour of their time is worth</dd>
<dt>C</dt><dd>the setup's total monthly cost: hardware share, power and upkeep (Lesson 16.3)</dd>
<dt>Physical meaning</dt><dd>The decision is a balance: on one side, staff hours handed back each month; on the other, the machine's monthly cost. The working piece is what turns h from a hope into a measurement, which is what lets a manager say yes.</dd>
</dl>

</div>

<div class="problem" data-problem="capstone-value"></div>

<div class="myth">

**"A detailed plan is enough; building a piece is optional."** A plan full of estimates is a guess. One working workflow with 10 to 20 measured test tasks turns the guess into evidence, shows the setup runs with the cable out, and gives the brief real numbers for speed, accuracy and time saved.

</div>

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

<div class="keypoints">

- The capstone has four parts: a design, a working piece, a cost sheet and a one-page brief.
- The design must respect every data rule; the working piece must run with the cable out.
- Measure the working piece on 10 to 20 test tasks: accuracy, time per task, tokens per second.
- Monthly value = staff × hours saved a day × days × value of an hour − monthly cost; state the break-even month with dated prices.
- Lead the brief with the recommendation and propose a 30-day pilot with a success measure.

</div>
