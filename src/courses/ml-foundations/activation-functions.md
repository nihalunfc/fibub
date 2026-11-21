---
title: Activation functions
seoTitle: 'Activation functions explained: ReLU, sigmoid and tanh'
summary: 'A neuron''s activation bends its weighted sum. Without it, a deep network collapses into one straight line; with the wrong one, learning stalls. Compare step, sigmoid, tanh and ReLU and their slopes.'
minutes: 20
updated: 2026-11-21
quiz:
  - q: A network stacks 10 layers with no activation function (just weighted sums). It can draw
    choices: ['Only straight boundaries, like one layer', 'Any shape', 'Only circles']
    ans: 0
    why: A weighted sum of weighted sums is still a weighted sum, so all the layers collapse into one linear model.
  - q: 'Why did ReLU replace sigmoid in hidden layers?'
    choices: ['Its slope is 1 for every positive input, so gradients don''t fade through many layers', 'It outputs probabilities', 'It is smooth everywhere']
    ans: 0
    why: Sigmoid's slope is at most 0.25 and nearly 0 for large inputs; multiplied over many layers, the learning signal vanishes.
  - q: 'For the output of a yes/no classifier, the usual activation is:'
    choices: ['Sigmoid, giving a probability between 0 and 1', 'ReLU', 'None']
    ans: 0
    why: As in logistic regression (Lesson 4.2). For several classes, softmax; for a number, no activation.
---

**Module 9 · about 20 minutes · read first: 1.5, 9.1.** You'll be able to explain why networks need activations, compare the common ones and their slopes, and choose one for hidden and output layers.

## 1. Why this matters

The activation function is the small bend that makes a neural network more than a linear model. The switch from sigmoid to ReLU around 2010 was one of the simple changes that made deep learning work; most modern networks, language models included, use ReLU or a smooth cousin of it (GELU, SiLU).

## 2. Why bend at all?

Without an activation, a layer computes `$\mathbf{W}\mathbf{x} + \mathbf{b}$`. Two such layers give `$\mathbf{W}_2(\mathbf{W}_1\mathbf{x} + \mathbf{b}_1) + \mathbf{b}_2$`, which is again just one weight matrix times `$\mathbf{x}$` plus a bias. However many layers you stack, the result is one linear model with a straight boundary. A non-linear activation between layers stops the collapse and lets each layer bend the space a little.

## 3. The common ones

<!--fig:activations-->

| name | formula | output range | slope | used for |
|---|---|---|---|---|
| step | 1 if z ≥ 0, else 0 | 0 or 1 | 0 (no learning signal) | the original perceptron |
| sigmoid | 1 / (1 + e⁻ᶻ) | 0 to 1 | at most 0.25 | output of yes/no models |
| tanh | (eᶻ − e⁻ᶻ) / (eᶻ + e⁻ᶻ) | −1 to 1 | at most 1 | small networks, older recurrent nets |
| ReLU | max(0, z) | 0 and up | 0 or 1 | hidden layers of most networks |

Gradient descent (Lesson 3.3) needs slopes, and backpropagation (Lesson 9.4) multiplies by the activation's slope once per layer. That explains the history:

- The **step** has slope 0, so there is nothing to follow downhill.
- **Sigmoid** and **tanh** saturate: for large inputs their slope is almost 0, and the product over many layers **vanishes**. Deep networks with them learned painfully slowly.
- **ReLU** passes the gradient through unchanged wherever it is active, so deep networks train. Its weakness: a neuron whose input is always negative outputs 0 and gets slope 0, and can "die". Variants such as leaky ReLU keep a small slope for negative inputs.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a non-linear function between layers lets a network build curved boundaries; its slope carries the learning signal back.

**Slopes:**

```math
\sigma'(z) = \sigma(z)\,\big(1 - \sigma(z)\big), \qquad \tanh'(z) = 1 - \tanh^2(z)
```

```math
\operatorname{ReLU}'(z) = \begin{cases} 1 & z > 0 \\ 0 & z < 0 \end{cases}
```

**The vanishing product:** the sigmoid's slope is largest at `$z = 0$`, where it is 0.25. Through 10 sigmoid layers the signal is multiplied by at most `$0.25^{10} \approx 10^{-6}$`.

**Analogy:** a dimmer switch versus an on/off switch. You can feel which way to turn a dimmer to get brighter; an on/off switch gives no hint until it flips.

**Try it:** `$\sigma(0) = 0.5$`. What is `$\sigma'(0)$`, and `$\sigma'(4)$` if `$\sigma(4) \approx 0.982$`? (0.5 × 0.5 = 0.25; 0.982 × 0.018 ≈ 0.018.)
</details>

## 4. Worked example

One hidden neuron with weights (0.8, −0.5), bias 0.1, and input (2, 1): `$z = 1.6 - 0.5 + 0.1 = 1.2$`.

| activation | output | slope at 1.2 |
|---|---|---|
| step | 1 | 0 |
| sigmoid | 0.769 | 0.178 |
| tanh | 0.834 | 0.305 |
| ReLU | 1.2 | 1 |

If the input were (−2, 1), `$z = -2.0$`: ReLU outputs 0 with slope 0 (this example teaches its weights nothing), sigmoid outputs 0.119 with slope 0.105, tanh −0.964 with slope 0.071.

## 5. Practice

1. In the simulation, at z = 4, what are the sigmoid's and ReLU's slopes, and their tenth powers?
2. Why does stacking linear layers add nothing?
3. What activation would you put on the output of a model predicting a house price?

<details>
<summary>Answers</summary>

1. Sigmoid about 0.018, tenth power about 3 × 10⁻¹⁸; ReLU 1, tenth power 1.
2. A linear function of a linear function is linear, so the stack equals one layer.
3. None (the identity): a price can be any number. ReLU would also work if prices must be positive.
</details>

**Try it on your own data:** the [[neural-network-toys]] shows a perceptron's hard threshold at work on points you place.

**New words:** *activation function*, *non-linearity*, *sigmoid*, *tanh*, *ReLU*, *saturation*, *vanishing gradient*, *dead neuron*.
