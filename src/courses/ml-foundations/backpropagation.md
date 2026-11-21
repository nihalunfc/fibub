---
title: 'Backpropagation: the chain rule, step by step'
seoTitle: 'Backpropagation explained step by step with numbers'
summary: 'To train a network we need the slope of the loss for every weight. Backpropagation gets all of them in one backward pass, by the chain rule. Follow a tiny network forward and backward with real numbers.'
minutes: 30
updated: 2026-11-21
quiz:
  - q: 'Backpropagation computes:'
    choices: ['The gradient of the loss with respect to every weight', 'The best learning rate', 'The network''s accuracy']
    ans: 0
    why: It is an efficient way to get all the partial derivatives; gradient descent then uses them to update the weights.
  - q: 'With a sigmoid output and log-loss, the error at the output''s weighted sum is:'
    choices: ['p − y', '(p − y)²', 'log p']
    ans: 0
    why: The sigmoid's slope cancels against the log-loss's, leaving the simple p − y, as in logistic regression (Lesson 4.3).
  - q: 'A weight''s gradient equals:'
    choices: ['The error arriving at its neuron times the input that the weight multiplied', 'The weight itself', 'The output of the network']
    ans: 0
    why: Since z = w·a + ..., ∂z/∂w = a, so ∂L/∂w = ∂L/∂z × a.
---

**Module 9 · about 30 minutes · read first: 1.5, 4.3, 9.3.** You'll be able to run a forward and a backward pass by hand on a small network, explain the chain rule as multiplying local slopes, and say why backpropagation is fast.

## 1. Why this matters

Backpropagation (popularised by Rumelhart, Hinton and Williams in 1986) is how every neural network learns, from a 17-weight toy to a language model with hundreds of billions of weights. Libraries do it automatically ("autograd"), but knowing what it computes explains vanishing gradients, why ReLU helps, why scaling inputs matters, and what "training" actually is.

## 2. The problem

Gradient descent (Lesson 3.3) needs `$\partial L / \partial w$` for every weight `$w$`: how much the loss `$L$` would change if `$w$` were nudged. Nudging each weight one by one and rerunning the network would take one forward pass per weight: billions of passes for a large model. Backpropagation gets every gradient with **one forward and one backward pass**.

## 3. The chain rule

The loss depends on a weight through a chain of steps. If `$L$` depends on `$p$`, which depends on `$z$`, which depends on `$w$`, then

```math
\frac{\partial L}{\partial w} = \frac{\partial L}{\partial p} \cdot \frac{\partial p}{\partial z} \cdot \frac{\partial z}{\partial w}
```

Each factor is a **local slope**, easy to compute at its own step. Backpropagation works from the loss backwards, multiplying in one local slope per step, and reuses each partial product for every weight further back. Nothing is computed twice.

<!--fig:backprop-chain-->

## 4. The recipe

1. **Forward:** compute and keep every layer's weighted sums `$z$` and outputs `$a$`.
2. **Output error:** with a sigmoid and log-loss, `$\delta_{\text{out}} = p - y$`.
3. **Backward, layer by layer:** a hidden neuron's error is the sum of the errors of the neurons it feeds, each times the connecting weight, times its own activation's slope at its `$z$`.
4. **Gradients:** each weight's gradient is the error at the neuron it feeds times the input it multiplied; each bias's gradient is that neuron's error.
5. **Update:** `$w \leftarrow w - \eta \, \partial L / \partial w$` for every weight.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the chain rule, applied from the output back, sharing work between weights.

**Errors (deltas)** for layer `$l$`, with `$\odot$` meaning multiply element by element:

```math
\boldsymbol{\delta}^{(L)} = \mathbf{p} - \mathbf{y}, \qquad \boldsymbol{\delta}^{(l)} = \big(\mathbf{W}^{(l+1)\top} \boldsymbol{\delta}^{(l+1)}\big) \odot g'\big(\mathbf{z}^{(l)}\big)
```

**Gradients:**

```math
\frac{\partial L}{\partial W^{(l)}_{ij}} = \delta^{(l)}_i \, a^{(l-1)}_j, \qquad \frac{\partial L}{\partial b^{(l)}_i} = \delta^{(l)}_i
```

**Why `$p - y$`:** for log-loss `$L = -[y \ln p + (1-y)\ln(1-p)]$` and `$p = \sigma(z)$`, `$\partial L/\partial p = (p - y)/(p(1-p))$` and `$\partial p / \partial z = p(1-p)$`; the product is `$p - y$`.

**Analogy:** a factory finding who is responsible for a fault. Start at the faulty product, ask each station how much its output contributed, and pass the blame back along the line in proportion.

**Try it:** a neuron computes `$z = w a$` with `$a = 3$`, and the error arriving at `$z$` is `$\partial L/\partial z = -0.2$`. Gradient for `$w$`? New `$w$` with `$\eta = 0.5$` if `$w = 1$`? (`$-0.6$`; `$1 + 0.3 = 1.3$`.)
</details>

## 5. Worked example

The network in the picture: input `$x = 2$`; `$z_1 = w_1 x$` with `$w_1 = 0.5$`; `$h = \operatorname{ReLU}(z_1)$`; `$z_2 = w_2 h + b$` with `$w_2 = 1.5$`, `$b = -0.5$`; `$p = \sigma(z_2)$`; the true answer is `$y = 1$`.

**Forward:** `$z_1 = 1$`, `$h = 1$`, `$z_2 = 1.5 - 0.5 = 1$`, `$p = \sigma(1) = 0.731$`, `$L = -\ln 0.731 = 0.313$`.

**Backward:**

- `$\partial L/\partial z_2 = p - y = -0.269$`.
- `$\partial L/\partial w_2 = -0.269 \times h = -0.269$`; `$\partial L/\partial b = -0.269$`.
- `$\partial L/\partial h = -0.269 \times w_2 = -0.403$`.
- `$\partial L/\partial z_1 = -0.403 \times \operatorname{ReLU}'(1) = -0.403 \times 1 = -0.403$`.
- `$\partial L/\partial w_1 = -0.403 \times x = -0.807$`.

**Update** with `$\eta = 0.5$`: `$w_1 = 0.5 + 0.403 = 0.903$`, `$w_2 = 1.5 + 0.134 = 1.634$`, `$b = -0.5 + 0.134 = -0.366$`. Forward again: `$z_1 = 1.807$`, `$z_2 = 1.634 \times 1.807 - 0.366 = 2.586$`, `$p = 0.930$`, loss 0.073. One step cut the loss by more than three quarters.

## 6. Practice

1. In the worked example, why is `$w_1$`'s gradient twice `$h$`'s error?
2. If `$z_1$` had been −1, what would `$w_1$`'s gradient be, and why?
3. Why is one backward pass enough for all the weights?

<details>
<summary>Answers</summary>

1. Because `$w_1$` multiplied the input `$x = 2$`: its gradient is the error at `$z_1$` times 2.
2. 0: ReLU's slope is 0 for negative inputs, so no signal reaches `$w_1$` (a "dead" neuron for this example).
3. Each step's error is computed once and reused by all the weights behind it; the work is about the same as one forward pass.
</details>

**Try it on your own data:** the simulation in Lesson 9.3 runs exactly this recipe thousands of times a second; watch its log-loss fall.

**New words:** *backpropagation*, *chain rule*, *forward pass*, *backward pass*, *error (delta)*, *autograd*, *gradient*.
