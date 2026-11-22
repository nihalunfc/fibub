---
title: Activation functions
seoTitle: 'Activation functions explained: ReLU, sigmoid and tanh'
summary: 'A neuron''s activation bends its weighted sum. Without it, a deep network collapses into one straight line; with the wrong one, learning stalls. Compare step, sigmoid, tanh and ReLU and their slopes.'
minutes: 20
updated: 2026-11-22
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
sources:
  - 'Goodfellow, Bengio and Courville (2016), Deep Learning, MIT Press, Section 6.3 (hidden units) https://www.deeplearningbook.org/'
  - 'Glorot, Bordes and Bengio (2011), Deep sparse rectifier neural networks, Proceedings of AISTATS 2011, PMLR 15, 315-323 https://proceedings.mlr.press/v15/glorot11a.html'
  - 'Glorot and Bengio (2010), Understanding the difficulty of training deep feedforward neural networks, Proceedings of AISTATS 2010, PMLR 9, 249-256 https://proceedings.mlr.press/v9/glorot10a.html'
  - 'PyTorch documentation, torch.nn non-linear activations https://pytorch.org/docs/stable/nn.html'
---

**Module 9 · about 20 minutes · read first: 1.5, 9.1.** You'll be able to explain why networks need activations, compare the common ones and their slopes, and choose one for hidden and output layers.

<div class="bigidea">Without a bend between layers, a deep network is just one straight line in disguise; the activation adds that bend, and its slope decides whether the learning signal survives the trip back.</div>

## 1. Why this matters

The activation function is the small bend that makes a neural network more than a linear model. The switch from sigmoid to ReLU around 2010 was one of the simple changes that made deep learning work. Most modern networks, language models included, use ReLU or a smooth cousin of it (GELU, SiLU).

## 2. Why bend at all?

Without an activation, a layer computes `$\mathbf{W}\mathbf{x} + \mathbf{b}$`: a weighted sum. Two such layers give `$\mathbf{W}_2(\mathbf{W}_1\mathbf{x} + \mathbf{b}_1) + \mathbf{b}_2$`, which is again just one weight matrix times `$\mathbf{x}$` plus a bias. However many layers you stack, the result is one linear model with a straight boundary.

It's like folding paper. Stretching or sliding a sheet keeps every straight line straight. Only a fold, a bend, lets you make new shapes. A non-linear activation between layers is that fold.

### Watch it happen

<div class="steps">
<div class="step"><p><b>Layer 1, no activation.</b> It computes y = 2x + 1. A straight line.</p></div>
<div class="step"><p><b>Layer 2, no activation.</b> It computes 3y − 4. Put the first in: 3(2x + 1) − 4 = 6x − 1. Still one straight line. Two layers did the work of one.</p></div>
<div class="step"><p><b>Add ReLU between them.</b> ReLU(y) = max(0, y) keeps positives and turns negatives into 0. Now the output is 3 × max(0, 2x + 1) − 4.</p></div>
<div class="step"><p><b>A bend appears.</b> For x below −0.5 the output is flat at −4; above, it climbs with slope 6. One kink. Many neurons, each with its own kink, can be added up to follow any curve.</p></div>
</div>

<div class="meaning">

<dl>
<dt>g(z)</dt><dd>the activation: a function applied to a neuron's weighted sum z</dd>
<dt>σ(z) (sigmoid)</dt><dd>squashes any number into 0 to 1, like a probability</dd>
<dt>ReLU(z)</dt><dd>max(0, z): pass positives through, block negatives</dd>
<dt>g′(z) (slope)</dt><dd>how much the output changes when z changes a little; learning travels back through this</dd>
<dt>Physical meaning</dt><dd>A dimmer switch versus an on/off switch. With a dimmer you can feel which way to turn to get brighter (a useful slope). An on/off switch gives no hint until it flips (slope 0). And a dimmer that is already fully up (a saturated sigmoid) barely responds however you turn it.</dd>
</dl>

</div>

## 3. The common ones

<!--fig:activations-->

| name | formula | output range | slope | used for |
|---|---|---|---|---|
| step | 1 if z ≥ 0, else 0 | 0 or 1 | 0 (no learning signal) | the original perceptron |
| sigmoid | 1 / (1 + e⁻ᶻ) | 0 to 1 | at most 0.25 | output of yes/no models |
| tanh | (eᶻ − e⁻ᶻ) / (eᶻ + e⁻ᶻ) | −1 to 1 | at most 1 | small networks, older recurrent nets |
| ReLU | max(0, z) | 0 and up | 0 or 1 | hidden layers of most networks |

<div class="problem" data-problem="activation-functions-sigmoid"></div>

Gradient descent (Lesson 3.3) needs slopes, and backpropagation (Lesson 9.4) multiplies by the activation's slope once per layer. That explains the history:

- The **step** has slope 0, so there is nothing to follow downhill.
- **Sigmoid** and **tanh** **saturate**: for large inputs they flatten out and their slope is almost 0. The product over many layers **vanishes**, so deep networks with them learned painfully slowly.
- **ReLU** passes the gradient through unchanged wherever it is active, so deep networks train. Its weakness: a neuron whose input is always negative outputs 0, gets slope 0, and can "die". Variants such as leaky ReLU keep a small slope for negative inputs.

<div class="problem" data-problem="activation-functions-vanish"></div>

<div class="myth">

**"More layers always means a more powerful network."** Only with an activation between them. Without one, a hundred layers compute exactly what one layer computes. And with a saturating activation like sigmoid, extra layers can make things worse: the learning signal fades before it reaches the early layers, so they barely train.

</div>

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

<div class="keypoints">

- Without an activation, any stack of layers collapses into a single linear model; the activation's bend is what lets networks draw curves.
- Sigmoid squashes to 0 to 1 (used for yes/no outputs); tanh to −1 to 1; ReLU = max(0, z) is the usual choice for hidden layers.
- Backpropagation multiplies by the activation's slope at every layer: sigmoid's slope is at most 0.25, so the signal vanishes in deep stacks, while ReLU's is 1 where active.
- Output layers match the task: sigmoid for yes/no, softmax for several classes, none for a number.

</div>
