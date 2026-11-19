---
title: When the cloud wins and when local wins
summary: A fair scorecard. The cloud wins on the strongest models, bursts and zero upfront cost; local wins on privacy, volume, offline use and no limits. A decision tree to choose for each job.
minutes: 20
updated: 2026-11-19
sources:
  - 'Lessons 16.1 to 16.4 (prices and break-even) and 17.1 (quality gap) of this course'
  - 'Morph, "Best Open Source LLMs (November 2026)" (third-party ranking), https://www.morphllm.com/best-open-source-llm'
quiz:
  - q: A student needs AI for two weeks of exam revision, then rarely. Which wins?
    choices: ['Cloud: a free tier or one month of a plan, no hardware', 'Buying a 128 GB box', 'Renting a data centre']
    ans: 0
    why: Short bursts with no upfront money are the cloud's home ground.
  - q: A clinic must summarise patient notes every day. Which wins?
    choices: ['Local: the data should not leave, and the volume is steady', 'Cloud, because it is newer', 'Neither']
    ans: 0
    why: Privacy rules and steady volume both point to local (Lesson 18.1).
  - q: What is the strongest reason the cloud still wins for some experts?
    choices: ['The best frontier models still beat the open models you can run at home on the hardest tasks', 'Cloud is always cheaper', 'Local models cannot write']
    ans: 0
    why: On the hardest reasoning, coding and long-context work, frontier cloud models still lead (Lesson 17.1).
---

**Module 16 · about 20 minutes · read first: 16.4.** You'll be able to decide, job by job, whether the cloud or your own machine is the better home.

## 1. Why this matters

This course is about running AI yourself, but it is not against the cloud. Choosing well means knowing where each side is genuinely better, so you neither overspend on hardware nor send private data out when you did not need to.

## 2. The scorecard

| Need | Cloud | Local |
|---|---|---|
| Strongest model on hard tasks | **Wins** (frontier models) | Close on many tasks, behind on the hardest |
| Money up front | **Wins** (none) | Hardware first |
| Short bursts, occasional use | **Wins** | Hardware sits idle |
| Web search, video, phone apps, syncing | **Wins** out of the box | Possible with work (Lesson 17.8) |
| Privacy and data rules | Depends on contract and settings | **Wins**: nothing leaves |
| Works with no internet | No | **Wins** |
| High steady volume | Bills grow with use | **Wins** after break-even |
| No usage limits or rate limits | Windows, caps, queues at busy times | **Wins**: only your speed |
| Same model for years, no surprise changes | Models retire and change | **Wins**: your files stay the same |
| Upkeep | **Wins** (none) | Updates, drivers, heat |

## 3. A decision tree

1. **Is the data allowed to leave?** No: local (or a rented machine in an approved region, Lesson 15.7). Yes: go on.
2. **Do you need to work offline?** Yes: local.
3. **Does a local model do the job well enough?** Test it on 10 real examples (Lesson 12.7 shows how). Yes: go on. No: cloud for this job.
4. **Is the volume high and steady?** Yes: local, after checking break-even. No: cloud is fine.
5. **Still unsure?** Use both (Lesson 16.6).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** choose by the job, not by the tool.

**Equation:** best home = the cheapest option that (a) may see the data and (b) passes your quality test.

**Analogy:** printing at home against a print shop. Daily letters at home; the wedding invitations at the shop.

**Try it:** a translator with 200 public web pages a month and 20 confidential contracts. Where does each go? (Pages: either, choose by cost; contracts: local.)
</details>

## 4. Worked example

*Made-up firm.* An engineering consultancy lists its AI jobs: drafting emails (local, fine quality), summarising client drawings and reports (local, data rule), checking long technical standards that are public (cloud, needs the long context and best reasoning), and a yearly market report (cloud, needs web search). Three of four jobs go local, so they buy one office machine and keep two cloud seats instead of twelve.

## 5. Practice

1. Put your five most common AI jobs through the decision tree.
2. Which row of the scorecard matters most in your work?
3. Why does "models retire and change" matter for a business process?

<details>
<summary>Answers</summary>

1. Your answer; write down why for each.
2. For many people it is privacy or limits; for some it is the strongest model.
3. A process tested on one model can behave differently when the provider swaps it; a local file stays identical until you change it.
</details>

**New words:** *frontier model*, *decision tree*, *rate limit*.
