---
title: Choosing the right size for your machine
summary: A step-by-step way to pick the model size, quantisation and context length that give the best answers your machine can run, using the simulation and a quick test.
minutes: 20
updated: 2026-11-18
quiz:
  - q: You can just fit a 27B model at 3 bits, or a 12B at 6 bits. What should decide?
    choices: ['Always the bigger number', 'Run both on your own tasks and compare answers and speed', 'Always the smaller file']
    ans: 1
    why: Rules of thumb point the way, but a quick test on your real work is what tells you which is better for you.
  - q: Why leave 10 to 20 percent of memory free?
    choices: ['For the conversation memory to grow and for other apps', 'It is a legal requirement', 'To make the fan quieter']
    ans: 0
    why: Longer chats and documents grow the KV cache, and your system and other apps need room too.
  - q: Your model fits but writes at 3 tokens per second. What is the first thing to try?
    choices: ['A smaller model or fewer bits so it fits fully in fast memory', 'A bigger model', 'More browser tabs']
    ans: 0
    why: Slow writing usually means part of the model is in slow memory or the weights are too big for your bandwidth.
---

**Module 8 · about 20 minutes · read first: 4.1 and 8.1.** You'll be able to choose a model size, quantisation and context length for your machine in a few minutes.

## 1. Why this matters

Every machine has a best combination: the most capable model that still fits, at a speed you can live with, with enough context for your work. Finding it once saves a lot of trial and error.

## 2. Five steps

1. **Usable memory:** your graphics card's memory, or about three quarters of a Mac's, or your laptop's memory minus about 4 to 5 GB for the system.
2. **Context you need:** chat and short emails, 8K; long documents, 16K to 32K; whole reports or codebases, more.
3. **Start at 4 bits** (Q4_K_M or MLX 4-bit) and find the biggest model that fits with that context and 10 to 20% to spare. Use the simulation below.
4. **Check speed:** at least about 10 tokens per second for chat; for overnight jobs, slower is fine.
5. **Test on your own tasks:** compare with one size smaller at higher precision (for example 12B at 4 bits against 31B at 3 bits, or 12B at 6 bits). Keep the winner.

<!--fig:will-it-fit-->

## 3. Quick picks (November 2026)

| Usable fast memory | First choice | Also try |
|---|---|---|
| about 4 GB | Gemma 4 E2B, 4-bit | — |
| about 11 GB | Gemma 4 12B, 4-bit | Gemma 4 E4B for speed |
| about 15 GB (16 GB card) | Gemma 4 12B at 6 or 8 bits | Gemma 4 26B A4B, 4-bit, short context |
| about 23 to 31 GB | Gemma 4 31B or Qwen3.8-27B, 4-bit | 6-bit with a short context |
| about 96 GB or more | gpt-oss-120b | several smaller models side by side |

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** choose the point that maximises quality under two limits: memory and speed.

**Equation:** maximise quality(size, bits) subject to memory(size, bits, context) ≤ usable memory and speed ≥ your minimum.

**Analogy:** choosing a suitcase for a flight: the most useful things you can take, under the weight limit and still able to carry it.

**Try it:** usable memory 11 GB, need 16K context (about 1.9 GB of KV cache for a 12B model). Does a 12B at 4.8 bits fit? (7.2 + 1.9 + 1 ≈ 10.1 GB: yes, only just.)
</details>

## 4. Worked example

*Made-up numbers.* Sana has a 16 GB laptop and wants document summaries with 16K of context. Usable memory is about 11 GB. The simulation says Gemma 4 12B at 4-bit fits with 16K. A test on five real documents shows good summaries at 9 tokens per second, fine for a script that runs while he does something else. For quick questions he keeps Gemma 4 E4B, which is twice as fast.

## 5. Practice

1. Work through the five steps for your own machine and write down your pick.
2. Test your pick and one alternative on three real tasks. Which wins?
3. Your needs change to 64K context. What has to give?

<details>
<summary>Answers</summary>

1. Keep the note; it is your default model.
2. Count wins, and note speed; a slightly worse but twice-as-fast model can be the better tool.
3. The conversation memory grows a lot, so pick a smaller model, fewer bits, or more memory.
</details>

**New words:** *usable memory*, *headroom* (memory left free on purpose), *default model* (the one you reach for first).
