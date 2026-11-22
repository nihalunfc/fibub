---
title: Storage, RAM, power supply and cooling
summary: The supporting parts of a local AI machine. How much disk space models take, how much main memory you need, how big a power supply, and why cooling matters.
minutes: 15
updated: 2026-11-22
sources:
  - 'Model download sizes: Ollama library, read 16 November 2026 via BenchLM, https://benchlm.ai/best/ollama-models'
  - 'Graphics card board power: NVIDIA product pages via Compute Market, updated 1 November 2026, https://compute-market.com'
  - 'llama.cpp project README: model files are memory-mapped from disk when loaded (official page), https://github.com/ggml-org/llama.cpp'
quiz:
  - q: You plan to keep five models of 5 to 20 GB each. What disk space should you set aside?
    choices: ['About 10 GB', 'About 100 GB or more', 'About 1 TB at least']
    ans: 1
    why: Five models of up to 20 GB can reach 100 GB; leave room for new versions and tests.
  - q: Why does a fast SSD help?
    choices: ['It makes tokens come out faster', 'It loads the model into memory faster when you start it', 'It replaces graphics memory']
    ans: 1
    why: Loading a 16 GB file takes seconds from a fast SSD and much longer from a hard disk. Writing speed is unchanged once loaded.
  - q: A graphics card is rated at 180 W. Roughly what power supply should the PC have?
    choices: ['250 W', '550 W or more', '2,000 W']
    ans: 1
    why: The rest of the PC adds 100 to 200 W and you want headroom; follow the card maker's recommended size.
---

**Module 4 · about 15 minutes · read first: 4.1.** You'll be able to spec the rest of the machine around the memory.

<div class="bigidea">Memory decides what fits and bandwidth how fast it writes; the disk, main memory, power supply and cooling decide whether the machine is pleasant and stays up under load.</div>

## 1. Why this matters

The other parts decide whether the machine is nice to use: models that load in seconds, a PC that does not shut down under load, and fans you can live with. Think of a good chef. A fast knife (the graphics card) matters, but so do a big fridge (disk), a clear counter (main memory) and a strong gas line (power).

## 2. Storage

- Model files are big: Gemma 4 E2B about 4.6 GB, Gemma 4 12B about 7.7 GB, Qwen3.8-27B about 18 GB, gpt-oss-120b about 65 GB.
- You will keep several. Plan **100 to 500 GB** free on an NVMe SSD (a fast solid-state disk) for models.
- A fast SSD loads models in seconds. A hard disk works but takes minutes. Once loaded, the disk does not affect writing speed.
- Macs charge a lot for bigger internal storage; a fast external USB-C or Thunderbolt SSD is fine for model files.

Load time is simply size ÷ read speed:

```math
\text{load time (s)} = \frac{\text{file size (GB)}}{\text{disk read speed (GB/s)}}
```

<div class="problem" data-problem="storage-power-cooling-load"></div>

<div class="myth">

**"A faster SSD makes the model write faster."** The disk is only used to load the model into memory at the start. After that, every token is read from memory, not from disk. A faster SSD shortens the wait before the first answer, nothing more.

</div>

## 3. Main memory (RAM) on a PC with a graphics card

Even when the model runs on the card, it is loaded through main memory, and your other apps need room too. Rule of thumb: **main memory at least equal to graphics memory, ideally double.** A 16 GB card wants 32 GB of main memory.

## 4. Power supply

A graphics card's rated power (**board power**) is roughly what it draws at full load: about 180 W for an RTX 5060 Ti, 350 W for an RTX 3090 and 575 W for an RTX 5090. Add 100 to 200 W for the rest of the PC, then **headroom** (spare capacity, so the supply is never at its limit). Use the card maker's recommended power supply size and the right power cables. Module 6 turns watts into money.

Here is how to size one, for a used RTX 3090:

<div class="steps">
<div class="step"><b>Find the card's board power.</b> The RTX 3090 is rated at about 350 W.</div>
<div class="step"><b>Add the rest of the PC.</b> Processor, disks, fans and memory draw up to about 150 W. Peak: 350 + 150 = 500 W.</div>
<div class="step"><b>Add headroom.</b> Graphics cards draw short spikes above their rating, and supplies run cooler and quieter below their limit. 500 × 1.3 = 650 W.</div>
<div class="step"><b>Round up and check.</b> Supplies come in steps (550, 650, 750, 850 W). Choose 750 W, and check that it meets the card maker's own recommendation and has the right power plugs.</div>
</div>

```math
\text{power supply} \ge (\text{card} + \text{rest of PC}) \times 1.3
```

<div class="problem" data-problem="storage-power-cooling-psu"></div>

<div class="meaning">

<dl>
<dt>Board power</dt><dd>The most the graphics card is designed to draw, in watts.</dd>
<dt>Rest of PC</dt><dd>Processor, memory, disks and fans together, usually 100 to 200 W.</dd>
<dt>× 1.3</dt><dd>Headroom: at least 30% spare, for spikes and a cooler, quieter supply.</dd>
<dt>Physical meaning</dt><dd>The power supply is the pipe that feeds the whole machine. If it is too narrow, the moment the model starts writing and the card pulls hard, the PC can simply switch off.</dd>
</dl>

</div>

## 5. Cooling

Language models load the graphics chip in bursts: hard while writing, idle while you read. Long jobs (batch summaries, embeddings) load it for hours. A case with good airflow keeps the chip from slowing itself down (Lesson 6.4) and keeps fans quieter.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** size the supporting parts for the model, with headroom: disk for several models, main memory at least the card's memory, power supply above the peak.

**Equation:** power supply ≥ (card power + rest of PC) × 1.3 or more.

**Analogy:** a good chef needs a big fridge (disk), a clear counter (main memory) and a strong gas line (power), not only a fast knife.

**Try it:** a 350 W card in a PC whose other parts draw 150 W? ((350 + 150) × 1.3 = 650 W, so a 750 W supply is a comfortable choice.)
</details>

## 6. Worked example

*Made-up numbers.* Omar adds an RTX 5060 Ti 16 GB to an office PC with a 300 W supply and 16 GB of main memory. The card's maker asks for 550 W. He budgets for a 650 W supply and a second 16 GB memory stick. Without the supply upgrade the PC switches off when the model starts writing.

## 7. Practice

1. How much free SSD space do you have now?
2. Your PC has 16 GB main memory and you buy a 24 GB card. What should you add?
3. Does a faster SSD make tokens come out faster?

<details>
<summary>Answers</summary>

1. If it is under 100 GB, plan an external SSD for models.
2. At least another 16 GB of main memory (to 32 GB or more), and check the power supply.
3. No. It only shortens loading time.
</details>

**New words:** *NVMe SSD* (fast solid-state disk), *board power* (a card's rated draw), *headroom*.

<div class="keypoints">

- Keep 100 to 500 GB of fast SSD space for models; the disk only affects loading time, not writing speed.
- Main memory should be at least as large as the graphics card's memory, ideally double.
- Power supply ≥ (card + rest of PC) × 1.3, rounded up to the next size, and at least the card maker's recommendation.
- Good airflow stops the chip slowing itself down and keeps fans quieter.

</div>
