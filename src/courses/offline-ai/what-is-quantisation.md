---
title: What quantisation is
summary: Models are shrunk by storing each number with fewer bits, like saving a photo as a smaller JPEG. How it works, what it saves, and what it costs in quality.
minutes: 20
updated: 2026-11-22
sources:
  - 'Jacob, B. et al. (2018), Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference, CVPR 2018 https://arxiv.org/abs/1712.05877'
  - 'Dettmers, T. et al. (2022), LLM.int8(): 8-bit Matrix Multiplication for Transformers at Scale https://arxiv.org/abs/2208.07339'
  - 'llama.cpp quantisation tool, project documentation (official page), https://github.com/ggml-org/llama.cpp/tree/master/tools/quantize'
quiz:
  - q: A model is stored at 16 bits per weight and quantised to 4 bits. About how much smaller is it?
    choices: ['Half the size', 'A quarter of the size', 'The same size']
    ans: 1
    why: 4 ÷ 16 = 1/4, so the weights take about a quarter of the memory (real files are a little bigger).
  - q: What is the main cost of quantisation?
    choices: ['A small loss in answer quality, growing as bits drop', 'It needs internet', 'It changes the licence']
    ans: 0
    why: Rounding the numbers loses detail. At 8 and 6 bits the loss is tiny; at 4 bits small; at 3 and 2 bits it becomes noticeable.
  - q: Why does quantisation also make models faster?
    choices: ['Fewer bytes have to be read from memory for each token', 'The model thinks less', 'It skips words']
    ans: 0
    why: Writing speed is limited by memory bandwidth, so smaller weights mean more tokens per second.
---

**Module 8 · about 20 minutes · read first: 4.1.** You'll be able to explain quantisation and why a "Q4" file is the usual starting point.

<div class="bigidea">Quantisation rounds every number in the model to one of a few allowed values, so each takes 4 bits instead of 16: the model gets about four times smaller and faster, and loses only a little.</div>

## 1. Why this matters

Without quantisation, a 12B model needs about 24 GB, too much for most laptops. With it, the same model fits in about 7 to 8 GB and runs faster. It is the reason local AI works on ordinary machines.

## 2. Rounding the numbers

A model's **weights** are its learned numbers, billions of them, such as 0.0183427. Training stores each one with 16 **bits** (16 ones and zeros).

**Quantisation** stores them with fewer bits. It rounds each weight to the nearest of a smaller set of allowed values. It works on small **blocks** of weights (often 32), and each block keeps its own **scale**, a single number that says how big the block's values are, so the rounding stays close.

It is like saving a photo as a JPEG: much smaller, and at sensible settings you barely see the difference.

| Bits per weight | Size of a 12B model's weights | Quality |
|---|---|---|
| 16 (original) | about 24 GB | reference |
| 8 | about 12 GB | almost identical |
| 6 | about 9 GB | very close |
| 4 (Q4_K_M, about 4.8 on average) | about 7 GB | small loss, the usual choice |
| 3 | about 5 GB | noticeable on harder tasks |
| 2 | about 3.5 GB | often poor |

### Watch it happen: four weights rounded to 4 bits

With 4 bits you can store 2⁴ = 16 different whole numbers. A common scheme uses −7 to 7. Here is one tiny block of four weights.

<div class="steps" data-fig="what-is-quantisation-round">
<div class="step"><p><b>The weights.</b> A block holds <b>0.42, −0.13, 0.91, −0.58</b>, each stored with 16 bits. Four weights, 64 bits.</p></div>
<div class="step"><p><b>Make a ruler.</b> The largest size in the block is 0.91. Divide it into 7 steps: scale s = 0.91 ÷ 7 = <b>0.13</b>. The allowed values are −0.91, −0.78, … 0, … 0.78, 0.91: 15 marks, 0.13 apart.</p></div>
<div class="step"><p><b>Snap to the nearest mark.</b> 0.42 ÷ 0.13 = 3.2, so 3. −0.13 ÷ 0.13 = −1. 0.91 ÷ 0.13 = 7. −0.58 ÷ 0.13 = −4.46, so −4.</p></div>
<div class="step"><p><b>Store whole numbers.</b> The file keeps <b>3, −1, 7, −4</b> (4 bits each) plus the scale 0.13 once. When the model runs it multiplies back: 0.39, −0.13, 0.91, −0.52.</p></div>
<div class="step"><p><b>What was lost.</b> The errors are 0.03, 0, 0 and 0.06. No weight moves more than half a step (0.065). Spread over billions of weights, these small nudges barely change the answers.</p></div>
</div>

<div class="problem" data-problem="what-is-quantisation-round"></div>

Try it: lower the bits to 3 or 2, then compare one scale for everything against one per block of 32.

<figure class="fig" data-fig="@ai-quant-grid"><figcaption>Fewer bits means fewer levels, so every weight is rounded more. One outlier stretches a shared scale and crushes the small weights, which is why formats give each small block its own scale.</figcaption></figure>

## 3. Two gains, one cost

- **Smaller:** fits machines it otherwise would not.
- **Faster:** fewer bytes read per token (Lesson 3.5).
- **Cost:** some quality, small at 4 bits and above, larger below. Bigger models usually lose less from quantisation than small ones, so a large model at 4 bits often beats a smaller one at 8.

Lesson 8.2 measures the loss, and 8.3 explains the file names (Q4_K_M, AWQ, MLX 4-bit, FP4).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** storing a number with b bits allows 2^b different values; fewer values mean bigger rounding steps.

**Equation:** weight memory = parameters × b ÷ 8 bytes; levels = 2^b.

```math
q = \operatorname{round}\!\left(\frac{w}{s}\right), \qquad \hat w = q \times s, \qquad s = \frac{\max |w|}{7}
```

**Analogy:** measuring with a ruler marked only in centimetres instead of millimetres. Most measurements are still close enough; fine detail is lost.

**Try it:** how many levels at 4 bits, and at 8? (16 and 256.)
</details>

<div class="meaning">

<dl>
<dt>w</dt><dd>the original weight, stored with 16 bits</dd>
<dt>s</dt><dd>the block's scale: the gap between neighbouring allowed values</dd>
<dt>q</dt><dd>the whole number actually saved in the file, from −7 to 7 at 4 bits</dd>
<dt>ŵ</dt><dd>the value the model uses when it runs, q × s, always within half a step of w</dd>
<dt>b</dt><dd>bits per weight; 2^b different values can be stored</dd>
<dt>Physical meaning</dt><dd>The model trades a little precision for a lot of space, like describing every height in a class to the nearest centimetre instead of the nearest tenth of a millimetre. Nobody's height really changes.</dd>
</dl>

</div>

<div class="myth">

**"A 4-bit model is a weaker, dumbed-down version."** It is the same model with the same layers and knowledge; only the numbers are rounded. At 4 bits and above the loss is small, and a big model at 4 bits usually beats a smaller model at full precision.

</div>

## 4. Worked example

*Made-up numbers.* Leo has a 16 GB graphics card. The 27B model at 8 bits (27 GB) does not fit. At 4 bits (about 16 GB with extras) it only just fits with a short context. He picks the 3-bit version for longer documents and the 4-bit for short, careful questions, and compares answers on his own tasks.

## 5. Practice

1. What is the weight size of a 31B model at 4.8 bits per weight?
2. Use the simulation in Lesson 4.1 and change only the bits. Watch memory and speed.
3. Would you rather run a 12B at 4 bits or a 4B at 16 bits on the same memory? Why?

<details>
<summary>Answers</summary>

1. 31 × 4.8 ÷ 8 ≈ 18.6 GB (the 31B download is about 19 GB).
2. Fewer bits: less memory and higher speed, at some cost in quality.
3. Usually the 12B at 4 bits: a bigger model loses little from rounding and knows much more.
</details>

**New words:** *quantisation* (storing weights with fewer bits), *bits per weight*, *precision* (how finely a number is stored), *scale* (the step size kept for each block).

<div class="keypoints">

- Quantisation rounds each weight to one of 2^b allowed values; 4 bits gives 16.
- Each block of weights keeps a scale, so the rounding stays close: error at most half a step.
- Weight memory ≈ parameters × bits ÷ 8: a 12B model drops from 24 GB at 16 bits to about 7 GB at 4.8 bits.
- Smaller weights also mean faster writing, because fewer bytes are read per token.
- 4-bit (Q4_K_M) is the usual starting point; quality falls noticeably at 3 bits and below.

</div>
