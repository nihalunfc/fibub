---
title: AI on phones and tablets
summary: What small models can do on a phone or tablet with no internet, which apps run them, and the limits of battery, heat and memory.
minutes: 15
updated: 2026-11-22
sources:
  - 'Gemma 4 small models (E2B, E4B) built for phones and laptops: Google, Gemma model card (official page), https://ai.google.dev/gemma'
  - 'Google AI Edge Gallery, an app that runs open models on Android offline (official page), https://github.com/google-ai-edge/gallery'
  - 'Dettmers, T., Lewis, M., Belkada, Y. and Zettlemoyer, L. (2022), LLM.int8(): 8-bit Matrix Multiplication for Transformers at Scale (why fewer bits per weight shrink memory), arXiv:2208.07339 https://arxiv.org/abs/2208.07339'
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

<div class="bigidea">A phone is a computer with little spare memory and no fan, so it suits small models doing short jobs, anywhere, with nothing leaving the phone.</div>

## 1. Why this matters

Your phone is the device you always carry, including on flights, on trains and in places with poor signal. A small offline model there can draft, rewrite, translate and answer short questions with nothing leaving the phone. Think of it as a pocket dictionary: not the whole library, but always with you.

## 2. What fits

Phones in 2026 have about 8 to 16 GB of memory, shared with the system and your apps. What is left for a model is about 2 to 6 GB. That means models of roughly 1 to 4 billion parameters at 4-bit, such as Gemma 4 E2B and E4B, which Google designed for phones and laptops. (The "E" stands for *effective* parameters: the model runs in about the memory of a 2B or 4B model, even though it holds more parameters in total, because some of them can stay out of fast memory.) Phone makers also build in their own small on-device models for features such as summaries and smart replies.

Here is the sum for a typical phone:

<div class="steps">
<div class="step"><b>The phone.</b> 12 GB of memory. The system, the home screen and your open apps already use most of it. About 3 GB can be spared for a model.</div>
<div class="step"><b>Keep room for the chat.</b> Set aside about 0.5 GB for the conversation memory. That leaves 2.5 GB for the weights.</div>
<div class="step"><b>Turn GB into parameters.</b> At 4.8 bits per weight, each billion parameters takes 4.8 ÷ 8 = 0.6 GB. So 2.5 ÷ 0.6 ≈ 4 billion parameters at most.</div>
<div class="step"><b>Pick below the limit.</b> A 2B to 4B phone model such as Gemma 4 E2B or E4B fits with a little to spare, so the phone stays responsive.</div>
</div>

```math
\text{largest model (billions)} \approx \frac{\text{GB for weights} \times 8}{\text{bits per weight}}
```

<div class="problem" data-problem="phones-and-tablets-largest"></div>

<div class="meaning">

<dl>
<dt>GB for weights</dt><dd>What the phone can spare, minus a little for the conversation.</dd>
<dt>× 8 ÷ bits</dt><dd>Turns GB into billions of parameters: 8 bits per byte, divided by the bits each weight uses.</dd>
<dt>Effective parameters (E2B, E4B)</dt><dd>Phone models that run in about the memory of a 2B or 4B model, though they hold more parameters in total.</dd>
<dt>Physical meaning</dt><dd>A phone has a small desk and no fan. The model must fit on that small desk, and the work must be short enough that the phone does not overheat and slow down.</dd>
</dl>

</div>

Try it: lower the bits to 3 or 2, then compare one scale for everything against one per block of 32.

<figure class="fig" data-fig="@ai-quant-grid"><figcaption>Fewer bits means fewer levels, so every weight is rounded more. One outlier stretches a shared scale and crushes the small weights, which is why formats give each small block its own scale.</figcaption></figure>

## 3. How to try it

- **Android:** Google AI Edge Gallery (open source) downloads Gemma models and runs them offline.
- **iPhone and iPad:** apps from the App Store that run open models on the device. Check that the app says the model runs on the device and works in flight mode.
- Download the model on Wi-Fi first (phone versions are usually 1.5 to 4 GB), then switch on flight mode to test (Lesson 9.6).

<div class="problem" data-problem="phones-and-tablets-download"></div>

<div class="myth">

**"If an app has AI in it, it works offline."** Many phone AI apps send your words to a server in the cloud. Only apps that download a model to the phone can work with no signal. The flight-mode test settles it: if it still answers with every connection off, it is truly on the device.

</div>

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

<div class="keypoints">

- A phone can usually spare 2 to 6 GB for a model: enough for about 1B to 4B parameters at 4-bit.
- Largest model (billions) ≈ GB for weights × 8 ÷ bits per weight; pick something smaller to leave room.
- Download on Wi-Fi, then use the flight-mode test to prove the app really runs on the device.
- No fan means heat and slowdown on long jobs: keep phone jobs short and check facts.

</div>
