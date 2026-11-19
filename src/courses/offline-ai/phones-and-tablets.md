---
title: AI on phones and tablets
summary: What small models can do on a phone or tablet with no internet, which apps run them, and the limits of battery, heat and memory.
minutes: 15
updated: 2026-11-19
sources:
  - 'Gemma 4 small models (E2B, E4B) built for phones and laptops: Google, Gemma model card (official page), https://ai.google.dev/gemma'
  - 'Google AI Edge Gallery, an app that runs open models on Android offline (official page), https://github.com/google-ai-edge/gallery'
quiz:
  - q: Which Gemma 4 sizes are made for phones?
    choices: ['E2B and E4B', '31B', '26B mixture-of-experts']
    ans: 0
    why: The E (effective) models are designed to run in a phone's limited memory.
  - q: Why does a phone slow down after a few minutes of heavy AI use?
    choices: ['It is running out of tokens', 'It heats up and lowers its own speed to stay cool', 'The model gets bigger']
    ans: 1
    why: Phones have no fans; they throttle to protect the battery and the chip (Lesson 6.4).
  - q: Which job suits an offline phone model best?
    choices: ['Writing a 50-page report from a large folder of files', 'Short rewrites, translations and quick questions on the go', 'Training a model']
    ans: 1
    why: Small models and limited memory suit short jobs. Long, heavy work belongs on a computer.
---

**Module 4 · about 15 minutes · read first: 4.1.** You'll be able to put a small model on your phone and know what to expect from it.

## 1. Why this matters

Your phone is the device you always carry, including on flights, trains and in places with poor signal. A small offline model there can draft, rewrite, translate and answer short questions with nothing leaving the phone.

## 2. What fits

Phones in 2026 have about 8 to 16 GB of memory, shared with the system and apps. Usable for a model: about 2 to 6 GB. That means models of roughly 1 to 4 billion parameters at 4-bit, such as Gemma 4 E2B and E4B, which Google designed for phones and laptops. Phone makers also build in their own small on-device models for features such as summaries and smart replies.

## 3. How to try it

- **Android:** Google AI Edge Gallery (open source) downloads Gemma models and runs them offline.
- **iPhone and iPad:** apps from the App Store that run open models on device. Check that the app says the model runs on the device and works in flight mode.
- Download the model on Wi-Fi first (phone versions are usually 1.5 to 4 GB), then switch on flight mode to test (Lesson 9.6).

## 4. Limits

- **Speed:** often 10 to 30 tokens per second for the smallest models on a recent phone; older phones are slower.
- **Heat and battery:** phones have no fan. Long sessions warm the phone, then it slows itself down. A long session can use a noticeable share of the battery.
- **Context:** keep prompts short; long documents eat the little memory left.
- **Quality:** small models make more mistakes (Lesson 2.7). Check facts.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a phone is a tiny-memory, no-fan computer: small models, short jobs.

**Equation:** largest model ≈ usable GB × 8 ÷ bits per weight. With 3 GB at 4.8 bits: 3 × 8 ÷ 4.8 = 5 billion parameters at most, before context.

**Analogy:** a pocket dictionary. Not the whole library, but always with you.

**Try it:** your tablet can spare 6 GB. Largest model at 4.8 bits? (6 × 8 ÷ 4.8 = 10B, but leave room for context: realistically 4B to 8B.)
</details>

## 5. Worked example

*Made-up numbers.* Leena travels by train through areas with no signal. She installs an offline app with Gemma 4 E2B on Wi-Fi at home. On the train she rewrites emails and translates a few menus; each answer arrives in a few seconds. After 20 minutes of steady use the phone is warm and slower, so she saves long jobs for her laptop.

## 6. Practice

1. How much memory does your phone have? (Settings > About.)
2. Install an offline model app, switch on flight mode and ask it to rewrite a paragraph.
3. Why should you not paste a 40-page document into a phone model?

<details>
<summary>Answers</summary>

1. Note it; usable memory for a model is roughly a third of it.
2. If it answers in flight mode, it is truly offline.
3. The context would not fit in the little memory left, and the phone would heat and slow down.
</details>

**New words:** *on-device*, *effective parameters* (the E in E2B), *flight-mode test*.
