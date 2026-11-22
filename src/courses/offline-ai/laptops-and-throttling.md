---
title: Laptop batteries and thermal throttling
summary: Why laptops and phones slow down during long AI jobs, how much battery local AI uses, and settings that keep speed steady.
minutes: 15
updated: 2026-11-22
sources:
  - 'Apple, About Low Power Mode and High Power Mode on Mac, Apple Support (official page), https://support.apple.com'
  - 'Microsoft, Change the power mode for your Windows PC, Microsoft Support (official page), https://support.microsoft.com'
  - 'Williams, S., Waterman, A. and Patterson, D. (2009), Roofline: an insightful visual performance model for multicore architectures, Communications of the ACM 52(4), 65-76 (why memory-bound work slows less when the chip clocks down) https://doi.org/10.1145/1498765.1498785'
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

<div class="bigidea">A laptop can only go as fast, for as long, as its small cooler can carry the heat away, so long jobs need power, a performance mode and air.</div>

## 1. Why this matters

Laptops and phones are where many people run their first local model. They are small, with little room for cooling and a battery to protect. Long jobs can start fast and then slow down by a third or more. Simple settings fix most of it. Think of a sprinter running a marathon: fast for the first minutes, then they must slow down to keep going.

## 2. Throttling

Chips have a safe temperature limit. When a long job heats them up, they lower their **clock speed** (how many steps the chip takes per second). This is **thermal throttling**. Since writing is mostly memory-bound (Lesson 4.2), the drop is often smaller than in games, but reading long prompts (compute-bound) slows a lot.

Signs: speed falls after a few minutes, fans get loud, the laptop's underside gets hot.

<div class="steps" data-fig="laptops-and-throttling-curve">
<div class="step"><b>A cool start.</b> On battery, on a sofa, a 40-minute summary job starts at 12 tokens per second. The chip is cool.</div>
<div class="step"><b>Heat builds up.</b> The soft sofa blocks the air vents. After about 5 minutes the chip reaches its safe limit.</div>
<div class="step"><b>The chip slows itself.</b> To stay safe, it lowers its clock speed. Writing falls to about 7 tokens per second for the rest of the job.</div>
<div class="step"><b>Same job, better setup.</b> Plugged in, on the best performance mode, on a desk with the back raised. The cooler keeps up, and speed holds at about 11.</div>
<div class="step"><b>Count the words.</b> Tokens written = speed × time, the area under each line. On the sofa about 18,700 tokens; on the desk about 26,800, over 40% more for the same 40 minutes.</div>
</div>

<div class="problem" data-problem="laptops-and-throttling-tokens"></div>

<div class="myth">

**"If my laptop slows down during a long job, something is broken."** Throttling is a safety feature, working as designed. The chip protects itself and the battery by slowing down when it gets hot. Better airflow, a performance mode and mains power usually bring the speed back.

</div>

## 3. Battery

On battery, laptops usually switch to power-saving modes that cap the chip. A thin laptop writing with a local model may use 20 to 40 W: on a 60 Wh battery that is about 1.5 to 3 hours of steady AI use. A **watt-hour (Wh)** is the battery's store of energy: a 60 Wh battery can give 60 W for one hour, or 30 W for two. Phones (Lesson 4.6) drain faster in proportion and heat up quicker.

```math
\text{battery hours} \approx \frac{\text{battery size (Wh)}}{\text{power drawn (W)}}
```

<div class="problem" data-problem="laptops-and-throttling-battery"></div>

<div class="meaning">

<dl>
<dt>Battery size (Wh)</dt><dd>How much energy the battery holds, printed on the label or shown in system information.</dd>
<dt>Power drawn (W)</dt><dd>How fast the laptop uses energy while the model writes, often 20 to 40 W.</dd>
<dt>Thermal throttling</dt><dd>The chip lowering its own speed to stay below a safe temperature.</dd>
<dt>Physical meaning</dt><dd>A battery is a fuel tank and the watts are how hard you press the pedal. The heat the chip makes is like a runner's body heat: if it cannot escape fast enough, the only way to keep going is to slow down.</dd>
</dl>

</div>

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

<div class="keypoints">

- When a chip gets too hot it lowers its clock speed (thermal throttling), so tokens per second fall.
- Writing slows less than prompt reading, because writing waits on memory rather than on the chip.
- Battery hours ≈ battery Wh ÷ watts drawn; a thin laptop gets about 1.5 to 3 hours of steady AI use.
- For long jobs: plug in, choose the best performance mode, use a hard surface and keep the vents clear.

</div>
