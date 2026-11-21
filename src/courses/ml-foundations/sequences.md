---
title: 'Sequences: why order matters'
seoTitle: 'Recurrent neural networks explained: RNN and LSTM basics'
summary: '"Dog bites man" and "man bites dog" use the same words. Sequence models read in order and carry a memory. See how a recurrent cell''s memory fades, why that makes long sequences hard, and what came next.'
minutes: 20
updated: 2026-11-21
quiz:
  - q: A bag-of-words model treats "dog bites man" and "man bites dog" as
    choices: ['The same', 'Opposites', 'Unrelated']
    ans: 0
    why: It only counts words, so order is lost. Sequence models keep it.
  - q: 'A recurrent network''s hidden state is:'
    choices: ['A running memory, updated from the old state and each new input', 'The final answer', 'The training data']
    ans: 0
    why: h(t) = g(W x(t) + U h(t−1) + b) mixes the new input with what came before.
  - q: Why do simple recurrent networks struggle with long sequences?
    choices: ['The memory and the gradients fade (or explode) as they pass through many steps', 'They cannot read numbers', 'They are too fast']
    ans: 0
    why: Each step multiplies by the same weights and activation slopes, as in a very deep network. LSTMs and attention address this.
---

**Module 9 · about 20 minutes · read first: 9.2, 9.4.** You'll be able to explain why order matters, follow a recurrent cell's memory step by step, and say why long-range memory is hard and what fixed it.

## 1. Why this matters

Text, speech, prices, sensor readings and clickstreams are **sequences**: their meaning depends on order. Recurrent networks were the standard tool for them from the 1990s to about 2017, powering early phone keyboards, speech recognition and machine translation. Their limits explain why the transformer (Module 10), the design behind today's language models, was invented.

## 2. Order matters

The models so far take a fixed set of columns. A sentence or a price history has a variable length and an order. Counting words (Lesson 4.8) loses the order: "not good, actually bad" and "not bad, actually good" have the same words. Taking only the last few values of a time series ignores what came before.

## 3. A recurrent cell

A **recurrent neural network** (RNN) reads one item at a time and keeps a **hidden state** `$\mathbf{h}$`, a running summary of everything so far:

```math
\mathbf{h}_t = \tanh\big(\mathbf{W}\mathbf{x}_t + \mathbf{U}\mathbf{h}_{t-1} + \mathbf{b}\big)
```

The same weights `$\mathbf{W}$`, `$\mathbf{U}$` are used at every step (weight sharing in time, like a convolution's filter in space). The final state, or the state at each step, feeds an output layer: the sentiment of a review, the next word, tomorrow's demand.

<!--fig:rnn-memory-->

## 4. Fading memory, and the fixes

Training unrolls the network through time: a 100-word sentence is a 100-layer network with shared weights. Backpropagation through it multiplies by `$\mathbf{U}$` and the activation's slope at every step, so the gradient from early words **vanishes** (or **explodes**) before it reaches them. In practice a plain RNN remembers only the last few items.

- **LSTM** (long short-term memory, Hochreiter and Schmidhuber, 1997) and **GRU** add **gates**: small learned switches that decide what to keep, what to forget and what to output. A separate memory line runs through the sequence with little change, so information and gradients survive for hundreds of steps.
- **Attention** (Lesson 10.4) drops the step-by-step chain altogether: every word can look directly at every other word. That also lets the whole sequence be processed in parallel, which is what made very large language models practical.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** carry a state through the sequence and update it with each new item, using the same weights every time.

**How a past input fades** in a one-number cell `$h_t = \tanh(w x_t + u h_{t-1})$`: for small values `$\tanh(z) \approx z$`, so an input at step 1 survives at step `$t$` roughly as

```math
h_t \approx u^{\,t-1} \, w \, x_1
```

With `$u = 0.5$`, after 10 steps only `$0.5^{9} \approx 0.002$` of it is left. The gradient back to `$x_1$` shrinks the same way; with `$\lvert u \rvert > 1$` it grows instead and explodes.

**Analogy:** a game of telephone. Each person passes on a slightly blurred version of the message plus their own words; after many people, the start is lost. An LSTM is a notebook passed along with the message.

**Try it:** with `$u = 0.9$` and no squashing, what share of a blip remains after 10 steps? (`$0.9^{10} \approx 0.35$`.)
</details>

## 5. Worked example

A one-number cell with `$w = 1$`, `$u = 0.7$`, reading the sequence 0, 1, 0, 0, 0:

| step | input | `$wx + uh_{\text{prev}}$` | `$h = \tanh(\cdot)$` |
|---|---|---|---|
| 1 | 0 | 0 | 0 |
| 2 | 1 | 1 | 0.762 |
| 3 | 0 | 0.533 | 0.488 |
| 4 | 0 | 0.341 | 0.329 |
| 5 | 0 | 0.230 | 0.226 |

The blip at step 2 echoes, shrinking by about a third at each step. Three steps later less than a third of it is left; a word 30 steps back would be practically forgotten.

## 6. Practice

1. In the simulation, which memory weight keeps about half of the blip after 10 steps?
2. Why is training an RNN on long sequences like training a very deep network?
3. What does an LSTM add?

<details>
<summary>Answers</summary>

1. Around u = 0.95 (a little below 1, as tanh also squashes).
2. Unrolled through time it is one layer per step, all multiplying the gradient by similar factors, so it vanishes or explodes.
3. Gates that learn what to keep, forget and output, and a memory line that carries information across many steps with little change.
</details>

**Try it on your own data:** Module 10 continues from here: the [[text-cleaner]] prepares raw text for the counting and embedding methods of the next lessons.

**New words:** *sequence*, *recurrent neural network*, *hidden state*, *unrolling*, *vanishing and exploding gradients*, *LSTM*, *GRU*, *gate*.
