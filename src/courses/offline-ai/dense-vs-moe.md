---
title: Dense models and Mixture-of-Experts
summary: Dense models use every parameter for every token; Mixture-of-Experts models use only a few experts. Why that makes big MoE models fast, and why they still need lots of memory.
minutes: 20
updated: 2026-11-19
sources:
  - 'gpt-oss-120b (117B total, 5.1B active) and other MoE sizes: Morph, November 2026, https://www.morphllm.com/best-open-source-llm'
quiz:
  - q: gpt-oss-120b has 117B parameters but only 5.1B active. What decides its memory need?
    choices: ['The 5.1B active', 'The full 117B, because every expert must be stored', 'Neither']
    ans: 1
    why: Any expert may be picked for the next token, so all must be in memory.
  - q: What decides its writing speed?
    choices: ['The 5.1B active parameters read per token', 'The full 117B', 'The internet']
    ans: 0
    why: Only the active experts are read for each token, so speed is like a 5B model's (on memory big enough to hold it).
  - q: Which machine suits a big MoE model best?
    choices: ['A small, very fast graphics card', 'A machine with a lot of memory, even if it is not the fastest', 'A phone']
    ans: 1
    why: MoE models need capacity more than speed, which is why 128 GB unified-memory machines run them well.
---

**Module 2 · about 20 minutes · read first: 2.2.** You'll be able to tell dense and MoE models apart and pick the right hardware for each.

## 1. Why this matters

Many of the best open models are now **Mixture-of-Experts (MoE)**. They break the simple rule "bigger means slower", and they change which hardware is the better buy.

## 2. Dense: everyone works on everything

In a **dense** model, every parameter is used for every token. A 31B dense model reads all 31B for each token. Simple and predictable: memory and speed both follow its size.

## 3. MoE: a team of specialists

An MoE model splits the feed-forward part of each layer (Lesson 2.4) into many **experts**, plus a small **router**. For each token, the router picks a few experts (often 2 to 8 out of dozens or more) and only those run.

<!--fig:experts-->

So two numbers matter:

- **Total parameters** (all experts): sets **memory**. Gemma 4 26B A4B needs memory for 26B.
- **Active parameters** (experts used per token): sets **speed**. It writes like a 4B model.

## 4. What it means for buying

- **Small fast graphics card (8 to 16 GB):** dense models of the right size are the better fit; big MoE models do not fit.
- **Large unified memory (64 to 128 GB Macs, AI boxes):** big MoE models shine: plenty of room, and only a little has to be read per token. gpt-oss-120b (117B total, 5.1B active) is the classic example.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** memory scales with total parameters; time per token scales with active parameters.

**Equation:** memory ≈ total × bits ÷ 8; speed ceiling ≈ bandwidth ÷ (active × bits ÷ 8).

**Analogy:** a hospital. The building must hold every specialist, but each patient sees two, so patients flow quickly.

**Try it:** 117B total, 5.1B active, 4 bits, 273 GB/s? (Memory ≈ 58.5 GB; speed ceiling ≈ 273 ÷ 2.55 ≈ 107 tokens per second.)
</details>

## 5. Worked example

*Made-up numbers.* Two machines, same price: one with a 24 GB graphics card at 936 GB/s, one with 128 GB unified memory at 273 GB/s. A 31B dense model at 4 bits (16 GB) runs about three times faster on the graphics card. gpt-oss-120b (about 65 GB) does not fit on the card at all, but runs smoothly on the 128 GB machine.

## 6. Practice

1. What are the memory and speed classes of "60B A6B"?
2. Which machine above would you pick for a coding helper using a 27B dense model? For gpt-oss-120b?
3. Why don't all models use MoE?

<details>
<summary>Answers</summary>

1. Memory like a 60B model (about 30 to 36 GB at 4 bits); speed like a 6B model.
2. The graphics card for the 27B; the 128 GB machine for gpt-oss-120b.
3. MoE needs more memory for the same ability, is harder to train well, and is less efficient on small machines.
</details>

**New words:** *dense model*, *Mixture-of-Experts (MoE)*, *expert*, *router*, *total and active parameters*.
