---
title: 'Limits in practice: setup, updates, heat and noise'
seoTitle: 'Practical limits of local AI | Offline AI'
summary: The everyday costs of running AI yourself that nobody puts in the advert. Setup time, drivers and updates, heat, noise and battery, missing features like web search, and how to keep each small.
minutes: 15
updated: 2026-11-19
sources:
  - 'Lessons 6.3 (cooling and noise), 6.4 (laptops and throttling), 9.7 (troubleshooting) of this course'
  - 'NVIDIA driver release notes and CUDA compatibility (official page), https://docs.nvidia.com/cuda/cuda-toolkit-release-notes/'
quiz:
  - q: What is the most common reason a local setup breaks after it worked fine?
    choices: ['An update to the driver, engine or operating system', 'The model wears out', 'Cosmic rays']
    ans: 0
    why: Updates change versions underneath. Update on purpose, one thing at a time, and note what changed.
  - q: Your local chat cannot answer "what happened today". Why?
    choices: ['It has no web search unless you add a search tool', 'Local models never know anything', 'The context is too small']
    ans: 0
    why: Cloud chats bundle search; locally you add it yourself (Lesson 17.8).
  - q: A laptop runs a model at full speed for two minutes, then slows. What is happening?
    choices: ['It gets hot and throttles to protect itself', 'It runs out of words', 'The model is downloading']
    ans: 0
    why: Thin laptops cannot shed heat for long (Lesson 6.4). Plug in, raise it for airflow, or use a smaller model.
---

**Module 17 · about 15 minutes · read first: 6.3 and 9.7.** You'll be able to plan for the hidden chores of local AI so they stay small.

## 1. Why this matters

Cloud AI is someone else's job to keep running. Local AI is yours. None of these chores is hard, but together they are the main reason people give up on local setups. Planning for them is how you keep going.

## 2. The list

| Limit | What it looks like | Keep it small by |
|---|---|---|
| **Setup time** | An evening to a weekend the first time | Starting with LM Studio or Ollama (Module 9), not the most advanced engine |
| **Updates** | Engines update weekly, drivers monthly, models every few months | Updating on purpose, once a month, one thing at a time; writing down versions |
| **Drivers** | A graphics driver update breaks the engine | Keeping the last working driver installer; on Linux, holding the driver package |
| **Heat** | Fans, warm room, throttling | Airflow, a power limit on the card (Lesson 6.3) |
| **Noise** | A desktop at full fan in a quiet office | A Mac or AI box, or the machine in another room on the network (Lesson 15.4) |
| **Battery** | A laptop drains in an hour at full load | Plug in for long jobs; small models on battery |
| **Missing features** | No web search, phone app or sync out of the box | Add only what you need (Lesson 17.8) |
| **Model churn** | New models every month tempt you to switch | Switch only when a test on your tasks shows a real gain (Lesson 17.1) |
| **Disk space** | Models of 5 to 70 GB each pile up | `ollama rm` or deleting old files; keep two or three models |

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** chores are a cost; count them in hours.

**Equation:** yearly upkeep hours ≈ setup + 12 × monthly update time + fixes. Multiply by your hourly value for Lesson 16.3.

**Analogy:** a bicycle against the bus. The bike is cheaper and yours, but you pump the tyres.

**Try it:** 6 hours setup, 1 hour a month updates, 4 hours of fixes a year? (6 + 12 + 4 = 22 hours in the first year.)
</details>

## 3. Worked example

*Made-up office.* A dental clinic's AI machine stopped working one Monday after Windows installed a new graphics driver overnight. Fix: roll back the driver, then set Windows to stop installing drivers automatically, and put "AI machine updates" in the calendar for the first Friday of each month. No more surprise Mondays.

## 4. Practice

1. Which three chores in the table would affect you most?
2. Write a one-line monthly update routine for your machine.
3. How many models do you really need on disk?

<details>
<summary>Answers</summary>

1. Your answer.
2. For example: "First Friday: note versions, update engine, test three saved prompts; update drivers only if needed."
3. Usually two or three: a fast small one, a strong everyday one, maybe one special-purpose model.
</details>

**New words:** *driver*, *rollback*, *model churn*, *upkeep*.
