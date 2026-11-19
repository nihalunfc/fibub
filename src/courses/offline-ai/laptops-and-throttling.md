---
title: Laptop batteries and thermal throttling
summary: Why laptops and phones slow down during long AI jobs, how much battery local AI uses, and settings that keep speed steady.
minutes: 15
updated: 2026-11-19
sources:
  - 'Apple, About Low Power Mode and High Power Mode on Mac, Apple Support (official page), https://support.apple.com'
  - 'Microsoft, Change the power mode for your Windows PC, Microsoft Support (official page), https://support.microsoft.com'
quiz:
  - q: What is thermal throttling?
    choices: ['The chip slowing itself down to stay within a safe temperature', 'The internet slowing down', 'The model losing quality']
    ans: 0
    why: When a chip gets too hot, it lowers its clock speed, so tokens per second fall.
  - q: Why does a laptop often run local AI slower on battery?
    choices: ['Power-saving modes limit the chip to stretch the battery', 'Batteries change the model', 'Wi-Fi turns off']
    ans: 0
    why: Plugged in and on a performance mode, the chip may use more power.
  - q: You run a 30-minute batch job on a laptop. Which helps keep speed steady?
    choices: ['Plug in, choose the best performance mode and raise the back for airflow', 'Run it on a soft bed', 'Open many browser tabs']
    ans: 0
    why: Power, performance mode and airflow all reduce throttling.
---

**Module 6 · about 15 minutes · read first: 6.1 and 6.3.** You'll be able to keep a laptop fast through a long AI job and know what it costs in battery.

## 1. Why this matters

Laptops and phones are where many people run their first local model. They are small, with little room for cooling and a battery to protect. Long jobs can start fast and then slow down by a third or more. Simple settings fix most of it.

## 2. Throttling

Chips have a safe temperature limit. When a long job heats them up, they reduce their clock speed. Since writing is mostly memory-bound (Lesson 4.2), the drop is often smaller than in games, but reading long prompts (compute-bound) slows a lot.

Signs: speed falls after a few minutes, fans get loud, the laptop's underside gets hot.

## 3. Battery

On battery, laptops usually switch to power-saving modes that cap the chip. A thin laptop writing with a local model may use 20 to 40 W: on a 60 Wh battery that is about 1.5 to 3 hours of steady AI use. Phones (Lesson 4.6) drain faster in proportion and heat up quicker.

## 4. Settings that help

1. **Plug in** for long jobs.
2. **Performance mode:** Windows Settings > Power > Power mode > Best performance; on a Mac laptop with the option, High Power Mode while plugged in.
3. **Airflow:** use a hard, flat surface; raise the back a little; a laptop stand or cooling pad helps.
4. **Smaller load:** a smaller model or quant (Lesson 8.2) and shorter prompts heat the chip less.
5. **Split long jobs** into chunks with short pauses, or run them overnight on a desktop.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** sustained speed is limited by how much heat the cooler can remove, not by the chip's peak speed.

**Equation:** battery hours ≈ battery Wh ÷ watts drawn.

**Analogy:** a sprinter in a marathon: fast for the first minutes, then they must slow down to keep going.

**Try it:** a 70 Wh battery and 28 W while writing? (70 ÷ 28 = 2.5 hours.)
</details>

## 5. Worked example

*Made-up numbers.* Ana runs a 40-minute summary job on her laptop on battery on a sofa. It starts at 12 tokens per second and falls to 7. Plugged in, in performance mode, on a desk with the back raised, it holds about 11 tokens per second throughout.

## 6. Practice

1. Find your laptop's power mode setting.
2. Run a model for 10 minutes and note tokens per second at the start and end (Lesson 3.10).
3. How many hours of AI use would your battery give at 30 W?

<details>
<summary>Answers</summary>

1. Windows: Settings > System > Power & battery. Mac: System Settings > Battery.
2. A drop of more than 20% means throttling: try the settings above.
3. Battery Wh (on the label or in system info) ÷ 30.
</details>

**New words:** *thermal throttling*, *clock speed*, *watt-hour (Wh)*, *performance mode*.
