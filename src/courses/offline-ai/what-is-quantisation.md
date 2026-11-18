---
title: What quantisation is
summary: Models are shrunk by storing each number with fewer bits, like saving a photo as a smaller JPEG. How it works, what it saves, and what it costs in quality.
minutes: 20
updated: 2026-11-18
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

## 1. Why this matters

Without quantisation, a 12B model needs about 24 GB, too much for most laptops. With it, the same model fits in about 7 to 8 GB and runs faster. It is the reason local AI works on ordinary machines.

## 2. Rounding the numbers

A model's weights are numbers such as 0.0183427. Training stores them with 16 bits each. **Quantisation** stores them with fewer bits by rounding them to the nearest of a smaller set of values, in small groups that each keep their own scale so the rounding stays close. It is like saving a photo as a JPEG: much smaller, and at sensible settings you barely see the difference.

| Bits per weight | Size of a 12B model's weights | Quality |
|---|---|---|
| 16 (original) | about 24 GB | reference |
| 8 | about 12 GB | almost identical |
| 6 | about 9 GB | very close |
| 4 (Q4_K_M, about 4.8 on average) | about 7 GB | small loss, the usual choice |
| 3 | about 5 GB | noticeable on harder tasks |
| 2 | about 3.5 GB | often poor |

## 3. Two gains, one cost

- **Smaller:** fits machines it otherwise would not.
- **Faster:** fewer bytes read per token (Lesson 3.5).
- **Cost:** some quality, small at 4 bits and above, larger below. Bigger models usually lose less from quantisation than small ones, so a large model at 4 bits often beats a smaller one at 8.

Lesson 8.2 measures the loss, and 8.3 explains the file names (Q4_K_M, AWQ, MLX 4-bit, FP4).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** storing a number with b bits allows 2^b different values; fewer values mean bigger rounding steps.

**Equation:** weight memory = parameters × b ÷ 8 bytes; levels = 2^b.

**Analogy:** measuring with a ruler marked only in centimetres instead of millimetres. Most measurements are still close enough; fine detail is lost.

**Try it:** how many levels at 4 bits, and at 8? (16 and 256.)
</details>

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

**New words:** *quantisation* (storing weights with fewer bits), *bits per weight*, *precision* (how finely a number is stored).
