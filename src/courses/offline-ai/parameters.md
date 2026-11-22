---
title: 'Parameters: what "7B" and "120B" mean'
seoTitle: 'What model parameters (7B, 120B) mean | Offline AI'
summary: A model's parameters are the numbers it learned. What the B in 12B means, how parameters turn into gigabytes, and why more is usually smarter but not always.
minutes: 20
updated: 2026-11-22
sources:
  - 'Kaplan, J. et al. (2020), Scaling Laws for Neural Language Models https://arxiv.org/abs/2001.08361'
  - 'Hoffmann, J. et al. (2022), Training Compute-Optimal Large Language Models (the "Chinchilla" paper: data matters as much as size) https://arxiv.org/abs/2203.15556'
  - 'Hugging Face Hub documentation, model cards (where parameter counts and file sizes are listed) https://huggingface.co/docs/hub/model-cards'
quiz:
  - q: What does the 12B in Gemma 4 12B mean?
    choices: ['12 billion parameters, the learned numbers in the model', '12 bytes', 'Version 12, beta']
    ans: 0
    why: B means billion. The model holds about 12 billion learned numbers.
  - q: How big are the weights of a 12B model at 16 bits per parameter?
    choices: ['About 1.2 GB', 'About 24 GB', 'About 240 GB']
    ans: 1
    why: 16 bits is 2 bytes, so 12 billion × 2 bytes = 24 GB. Quantisation shrinks this (Module 8).
  - q: Is a model with more parameters always better?
    choices: ['Yes, always', 'Usually more capable, but training data and method matter, and newer small models often beat older big ones', 'No, smaller is always better']
    ans: 1
    why: Size helps, but a well-trained 12B model from this year can beat a 70B model from three years ago.
---

**Module 2 · about 20 minutes · read first: 2.1.** You'll be able to read a model's size, turn it into gigabytes and judge what it says about ability.

<div class="bigidea">A parameter is one number the model learned; the count in its name (7B, 120B) tells you how much memory it needs, how fast it runs and, roughly, how capable it is.</div>

## 1. Why this matters

The number in a model's name is the first thing to read. It tells you roughly three things: how capable the model is, how much memory it needs and how fast it will run.

## 2. What a parameter is

A **parameter** (also called a **weight**) is one number the model learned during training. The scores in Lesson 2.1 come from multiplying your tokens by these numbers, layer after layer. A model is, quite literally, a very large file of numbers plus the recipe for using them.

Picture a mixing desk in a recording studio with billions of tiny knobs. Training turns each knob until the music (the predictions) sounds right. Each knob's final position is one parameter.

- **B** = billion. **E2B** and **E4B** in Gemma 4 mean "effectively" 2 or 4 billion working at a time, with some extra stored parts.
- For Mixture-of-Experts models the name may give two numbers: **26B A4B** means 26 billion in total, about 4 billion **active** per token (Lesson 2.5).

Try it: lower the bits to 3 or 2, then compare one scale for everything against one per block of 32.

<figure class="fig" data-fig="@ai-quant-grid"><figcaption>Fewer bits means fewer levels, so every weight is rounded more. One outlier stretches a shared scale and crushes the small weights, which is why formats give each small block its own scale.</figcaption></figure>

## 3. From parameters to gigabytes

Bytes per parameter depend on precision: 16 bits = 2 bytes, 8 bits = 1 byte, 4 bits = half a byte. So:

| Model | 16-bit | 8-bit | 4-bit |
|---|---|---|---|
| 4B | 8 GB | 4 GB | 2 GB |
| 12B | 24 GB | 12 GB | 6 GB |
| 31B | 62 GB | 31 GB | about 16 GB |
| 120B | 240 GB | 120 GB | 60 GB |

Real files are a little bigger, because some parts are kept at higher precision.

Watch the 12B row being worked out.

<div class="steps" data-fig="parameters-memory">
<div class="step"><p><b>Count the knobs.</b> A 12B model has 12 billion parameters.</p></div>
<div class="step"><p><b>16 bits each.</b> 16 bits = 2 bytes. 12 billion × 2 bytes = <b>24 GB</b>. Too big for a 16 GB laptop.</p></div>
<div class="step"><p><b>8 bits each.</b> 8 bits = 1 byte. 12 × 1 = <b>12 GB</b>. Fits, but leaves little room.</p></div>
<div class="step"><p><b>4 bits each.</b> Half a byte. 12 × 0.5 = <b>6 GB</b>. Comfortable on a 16 GB laptop. Storing each number less precisely is called <b>quantisation</b> (Module 8); quality drops only a little.</p></div>
</div>

Try it: slide the rank from 1 up to 12 and watch the rebuilt grid catch up with the original.

<figure class="fig" data-fig="@ai-lowrank"><figcaption>A big table of numbers can often be rebuilt from a few stripes, each a column times a row. That is exactly why a small LoRA adapter can change a big model: it stores r times (rows + columns) numbers instead of rows times columns.</figcaption></figure>

## 4. Size and ability

More parameters can store more patterns, so bigger models usually reason better, know more facts and handle more languages. But data quality and training method matter as much. Small models improve every year, and a new 12B model often beats a 70B model from a few years ago. Test on your own tasks (Lesson 7.4).

<div class="myth">

**"A 70B model is always smarter than a 12B one."** Size is only one ingredient. How much text the model was trained on, how clean it was and how it was taught to follow instructions matter just as much. Research on training (the "Chinchilla" paper in the sources) showed many big models were under-trained for their size. A newer, well-trained small model often wins, and it runs faster too.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** memory for weights is parameters times bytes per parameter.

**Equation:** GB = parameters (billions) × bits ÷ 8.

**Analogy:** a library's size is books × pages per book. Parameters are the books; precision is how many pages each takes up.

**Try it:** a 27B model at 8 bits? (27 GB.)
</details>

<div class="meaning">

<dl>
<dt>P</dt><dd>the number of parameters, in billions (the "B" in the name)</dd>
<dt>bits</dt><dd>how many bits store each parameter: 16, 8 or 4 are common</dd>
<dt>÷ 8</dt><dd>turns bits into bytes, since 8 bits make 1 byte</dd>
<dt>GB = P × bits ÷ 8</dt><dd>the size of the weights in gigabytes</dd>
<dt>Physical meaning</dt><dd>Every parameter has to sit in memory while the model works, so this number is the floor on how much memory you need. Halve the bits and you halve the memory, which is how a model that needs a data-centre card at 16 bits ends up running on a laptop at 4 bits.</dd>
</dl>

</div>

<div class="problem" data-problem="parameters-gb"></div>

Try it: move the two inputs, tap a line or neuron and change its weight or bias with the slider, and switch the activation.

<figure class="fig" data-fig="@ai-forward-pass"><figcaption>Every neuron does the same small job: add up weight times input over its lines, add its bias, apply the activation. A network is just many of these. Learning means moving the weights and biases until the output is right.</figcaption></figure>

## 5. Worked example

*Made-up numbers.* Two models score the same on Pooja's five real tasks: a 12B and a 27B. The 12B needs 7.7 GB and writes at 18 tokens per second on her machine; the 27B needs 18 GB and writes at 7. She keeps the 12B.

## 6. Practice

1. How many GB is a 20B model at 4 bits?
2. What does "60B A6B" tell you?
3. Why might you choose a 12B over a 27B?

<details>
<summary>Answers</summary>

1. 20 × 4 ÷ 8 = 10 GB.
2. 60 billion parameters in total, 6 billion active per token: memory like a 60B, speed like a 6B.
3. It fits more easily, runs faster, and may be good enough for your tasks.
</details>

**New words:** *parameter* or *weight* (one learned number), *B* (billion), *active parameters* (those used per token in an MoE model), *precision* (bits per number).

<div class="keypoints">

- A parameter (weight) is one number the model learned; B in a model's name means billion parameters.
- Weights in GB = parameters (billions) × bits per parameter ÷ 8: a 12B model is 24 GB at 16 bits, 6 GB at 4 bits.
- "26B A4B" means 26 billion in total (sets memory) and about 4 billion active per token (sets speed).
- Bigger usually means more capable, but data and training matter as much; newer small models often beat older big ones.
- Pick the smallest model that does your tasks well: it fits more easily and runs faster.

</div>
