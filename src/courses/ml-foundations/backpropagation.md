---
title: 'Backpropagation: the chain rule, step by step'
seoTitle: 'Backpropagation explained step by step with numbers'
summary: 'To train a network we need the slope of the loss for every weight. Backpropagation gets all of them in one backward pass, by the chain rule. Follow a tiny network forward and backward with real numbers.'
minutes: 30
updated: 2026-11-22
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
sources:
  - 'Rumelhart, Hinton and Williams (1986), Learning representations by back-propagating errors, Nature 323, 533-536 https://doi.org/10.1038/323533a0'
  - 'Goodfellow, Bengio and Courville (2016), Deep Learning, MIT Press, Section 6.5 (back-propagation) https://www.deeplearningbook.org/'
  - 'PyTorch documentation, A gentle introduction to torch.autograd https://pytorch.org/tutorials/beginner/blitz/autograd_tutorial.html'
---

**Module 9 · about 30 minutes · read first: 1.5, 4.3, 9.3.** You'll be able to run a forward and a backward pass by hand on a small network, explain the chain rule as multiplying local slopes, and say why backpropagation is fast.

<div class="bigidea">To learn, every weight needs to know how much it is to blame for the error; backpropagation passes the blame backwards through the network, one step at a time, in a single sweep.</div>

## 1. Why this matters

Backpropagation (popularised by Rumelhart, Hinton and Williams in 1986) is how every neural network learns, from a 17-weight toy to a language model with hundreds of billions of weights. Libraries do it automatically ("autograd"), but knowing what it computes explains vanishing gradients, why ReLU helps, why scaling inputs matters, and what "training" actually is.

## 2. The problem

Gradient descent (Lesson 3.3) needs `$\partial L / \partial w$` for every weight `$w$`. Read it as "how much the loss `$L$` would change if `$w$` were nudged a tiny bit". Nudging each weight one at a time and rerunning the network would take one forward pass per weight: billions of passes for a large model. Backpropagation gets every gradient with **one forward and one backward pass**.

## 3. The chain rule

The loss depends on a weight through a chain of steps. Think of gears: turn the first gear, and the last one turns by the product of all the gear ratios in between. If `$L$` depends on `$p$`, which depends on `$z$`, which depends on `$w$`, then

```math
\frac{\partial L}{\partial w} = \frac{\partial L}{\partial p} \cdot \frac{\partial p}{\partial z} \cdot \frac{\partial z}{\partial w}
```

Each factor is a **local slope**, easy to compute at its own step. Backpropagation works from the loss backwards, multiplying in one local slope per step, and reuses each partial product for every weight further back. Nothing is computed twice.

<!--fig:backprop-chain-->

### Watch it happen

The network in the picture: input x = 2, w₁ = 0.5, a ReLU, w₂ = 1.5, bias b = −0.5, a sigmoid, and the true answer y = 1.

<div class="steps" data-fig="backpropagation-chain">
<div class="step"><p><b>Forward, part 1.</b> z₁ = w₁x = 0.5 × 2 = 1. The ReLU passes it on: h = 1.</p></div>
<div class="step"><p><b>Forward, part 2.</b> z₂ = w₂h + b = 1.5 − 0.5 = 1. p = sigmoid(1) = 0.731. The loss is −ln 0.731 = 0.313. Keep every one of these numbers: the backward pass needs them.</p></div>
<div class="step"><p><b>Error at the output.</b> With a sigmoid and log-loss the error at z₂ is simply p − y = −0.269. So ∂L/∂w₂ = −0.269 × h = −0.269, and ∂L/∂b = −0.269.</p></div>
<div class="step"><p><b>Back through w₂.</b> How much is h to blame? Its error is −0.269 × w₂ = −0.269 × 1.5 = −0.403.</p></div>
<div class="step"><p><b>Back through the ReLU to w₁.</b> ReLU's slope at z₁ = 1 is 1, so z₁'s error is also −0.403. The weight w₁ multiplied x = 2, so ∂L/∂w₁ = −0.403 × 2 = −0.807.</p></div>
<div class="step"><p><b>Update.</b> Step against each gradient with η = 0.5: w₁ = 0.903, w₂ = 1.634, b = −0.366. Run forward again: p = 0.930 and the loss falls from 0.313 to 0.073.</p></div>
</div>

<div class="meaning">

<dl>
<dt>∂L/∂w</dt><dd>the gradient: how much the loss changes per tiny nudge of weight w; its sign says which way to move</dd>
<dt>δ (delta, error)</dt><dd>the blame arriving at a neuron's weighted sum z</dd>
<dt>p − y</dt><dd>the blame at the output: how far the prediction is from the truth</dd>
<dt>g′(z)</dt><dd>the activation's slope, which the blame is multiplied by on its way back through each neuron</dd>
<dt>a (input to the weight)</dt><dd>a weight's gradient is the blame at its neuron times the input it multiplied</dd>
<dt>Physical meaning</dt><dd>A factory tracing a faulty product. Start at the end, ask each station how much its output added to the fault, and pass the blame back along the line in proportion. Every station then adjusts its machine a little, and the next product comes out better.</dd>
</dl>

</div>

## 4. The recipe

1. **Forward:** compute and keep every layer's weighted sums `$z$` and outputs `$a$`.
2. **Output error:** with a sigmoid and log-loss, `$\delta_{\text{out}} = p - y$`.
3. **Backward, layer by layer:** a hidden neuron's error is the sum of the errors of the neurons it feeds, each times the connecting weight, times its own activation's slope at its `$z$`.
4. **Gradients:** each weight's gradient is the error at the neuron it feeds times the input it multiplied; each bias's gradient is that neuron's error.
5. **Update:** `$w \leftarrow w - \eta \, \partial L / \partial w$` for every weight.

<div class="problem" data-problem="backpropagation-grad"></div>

<div class="myth">

**"Backpropagation is how a network learns."** Backpropagation only *measures*: it works out every weight's gradient. The learning, the actual change of weights, is done by gradient descent or a cousin such as Adam (Lesson 9.5). The two always work as a pair, but they are different jobs: one says "which way and how much is each weight to blame", the other takes the step.

</div>

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

<div class="keypoints">

- Gradient descent needs ∂L/∂w for every weight; backpropagation gets them all with one forward and one backward pass.
- The chain rule multiplies local slopes along the path from the loss back to each weight; shared parts are computed once.
- With a sigmoid output and log-loss the output error is p − y; a hidden neuron's error is the weighted sum of the errors it feeds, times its activation's slope.
- A weight's gradient is the error at its neuron times the input it multiplied; gradient descent then steps each weight against its gradient.

</div>
