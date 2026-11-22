---
title: 'Layers: why stacking neurons can draw any shape'
seoTitle: 'Neural network layers explained, with a live simulation'
summary: 'A hidden layer turns the inputs into new features; the output layer is logistic regression on those features. Add neurons and layers and watch a network learn a ring, XOR and two moons live in your browser.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: A network has 2 inputs, one hidden layer of 4 neurons and 1 output. How many weights and biases?
    choices: ['17', '12', '8']
    ans: 0
    why: 'Hidden: 2 × 4 weights + 4 biases = 12. Output: 4 weights + 1 bias = 5. Total 17.'
  - q: 'The output layer of a yes/no network with a sigmoid is:'
    choices: ['Logistic regression on the features made by the hidden layer', 'A decision tree', 'k-means']
    ans: 0
    why: Everything before it is a learned feature map (Lesson 4.4); the last neuron does logistic regression on those features.
  - q: 'The universal approximation theorem says one hidden layer can:'
    choices: ['Approximate any reasonable function, given enough neurons', 'Learn any function from any data quickly', 'Never overfit']
    ans: 0
    why: It says such a network exists, not that training will find it or that it will generalise. Deeper networks usually need far fewer neurons.
sources:
  - 'Goodfellow, Bengio and Courville (2016), Deep Learning, MIT Press, Chapter 6 (deep feedforward networks) https://www.deeplearningbook.org/'
  - 'Cybenko (1989), Approximation by superpositions of a sigmoidal function, Mathematics of Control, Signals and Systems 2(4), 303-314 https://doi.org/10.1007/BF02551274'
  - 'Bishop (2006), Pattern Recognition and Machine Learning, Springer, Chapter 5 (neural networks)'
---

**Module 9 · about 25 minutes · read first: 4.4, 9.2.** You'll be able to describe a fully connected network, count its parameters, and explain how hidden layers create the features that make curved boundaries possible.

<div class="bigidea">Each hidden neuron draws one soft line and reports which side a point is on; the next layer combines those reports, so a few straight lines can be folded into rings, corners and curves.</div>

## 1. Why this matters

In Lesson 4.4 we bent a straight boundary into a circle by adding squared features by hand. A neural network finds such features itself. That is the whole trick behind deep learning: networks that learn their own features from raw pixels, sounds or words, where nobody could design the features by hand.

## 2. Layers of neurons

A **fully connected** (dense) network is built in layers, like a relay team where each runner hands over to every runner of the next leg:

- The **input layer** holds the columns `$\mathbf{x}$`.
- Each **hidden layer** has several neurons. "Hidden" just means you never see its values in the data. Every neuron takes all the outputs of the layer before, makes a weighted sum, adds its bias, and applies an activation (Lesson 9.2).
- The **output layer** makes the prediction: one sigmoid neuron for yes/no, one per class with softmax for several classes, one plain neuron for a number.

Each hidden neuron draws one soft line across the space (where its weighted sum is 0) and reports which side, and how far, a point is. The next layer combines those reports, so a handful of lines can be folded into a ring, a corner, or a curve.

<!--fig:net-playground-->

### Watch it happen: two hidden neurons solve XOR

Neuron A asks "is at least one input on?" (x₁ + x₂ − 0.5 ≥ 0). Neuron B asks "are both on?" (x₁ + x₂ − 1.5 ≥ 0). The output fires when A − 2B − 0.5 ≥ 0.

<div class="steps">
<div class="step"><p><b>(0, 0).</b> A: −0.5, so 0. B: −1.5, so 0. Output sum: 0 − 0 − 0.5 = −0.5, so 0. Correct.</p></div>
<div class="step"><p><b>(0, 1).</b> A: 0.5, so 1. B: −0.5, so 0. Output sum: 1 − 0 − 0.5 = 0.5, so 1. Correct.</p></div>
<div class="step"><p><b>(1, 0).</b> The same as (0, 1): A = 1, B = 0, output 1. Correct.</p></div>
<div class="step"><p><b>(1, 1).</b> A: 1. B: 0.5, so 1. Output sum: 1 − 2 − 0.5 = −1.5, so 0. Correct.</p></div>
<div class="step"><p><b>What happened.</b> The hidden layer moved the four corners to (A, B) = (0, 0), (1, 0), (1, 0), (1, 1). In that new space one straight line separates them. That is "learning features".</p></div>
</div>

## 3. Width and depth

- **Wider** (more neurons per layer): more lines to combine. One hidden layer with enough neurons can approximate any reasonable function: the **universal approximation theorem** (Cybenko, 1989).
- **Deeper** (more layers): features of features. Early layers find simple patterns; later ones combine them. For many real problems, deep and narrow beats shallow and wide with far fewer weights, which is why "deep learning" is deep.

More neurons means more weights, so more flexibility and more risk of overfitting (Lesson 3.7). Lesson 9.5 covers the defences.

<div class="problem" data-problem="layers-params"></div>

<div class="meaning">

<dl>
<dt>a⁽ˡ⁻¹⁾</dt><dd>the outputs of the layer before: this layer's inputs</dd>
<dt>W⁽ˡ⁾</dt><dd>the weight matrix: one row of weights per neuron in this layer</dd>
<dt>b⁽ˡ⁾</dt><dd>one bias per neuron</dd>
<dt>z⁽ˡ⁾ = Wa + b</dt><dd>every neuron's weighted sum at once</dd>
<dt>g</dt><dd>the activation, applied to each sum: the bend</dd>
<dt>Physical meaning</dt><dd>A factory line. The first workers sort parts by simple features (edges, colours). Later workers assemble those into bigger pieces (wheels, windows). The last one names the product (a car). Nobody told the workers what to look for; training taught them.</dd>
</dl>

</div>

<div class="myth">

**"One hidden layer can learn anything, so that's all you need."** The universal approximation theorem says a big enough network *exists*. It doesn't say training will find it, how many neurons it would take (sometimes astronomically many), or that it would work on new data. In practice deeper networks reach the same accuracy with far fewer weights, which is why modern networks have many layers.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** each layer applies a linear map and then a bend; stacking them gives a flexible function that is still trained by gradient descent.

**A layer:** with the previous layer's outputs `$\mathbf{a}^{(l-1)}$`, weight matrix `$\mathbf{W}^{(l)}$` and biases `$\mathbf{b}^{(l)}$`,

```math
\mathbf{z}^{(l)} = \mathbf{W}^{(l)} \mathbf{a}^{(l-1)} + \mathbf{b}^{(l)}, \qquad \mathbf{a}^{(l)} = g\big(\mathbf{z}^{(l)}\big)
```

**Counting parameters:** a layer from `$n_{\text{in}}$` to `$n_{\text{out}}$` neurons has `$n_{\text{in}} \times n_{\text{out}}$` weights and `$n_{\text{out}}$` biases.

**Why XOR needs only 2 hidden neurons:** one neuron fires for "`$x_1 + x_2 > 0.5$`" (at least one on), the other for "`$x_1 + x_2 > 1.5$`" (both on); the output fires for "first and not second".

**Analogy:** a factory line. The first workers sort parts by simple features; later workers assemble those into bigger pieces; the last one decides what the product is.

**Try it:** count the parameters of a network with layers 10, 32, 16, 1. (`$10 \times 32 + 32 = 352$`; `$32 \times 16 + 16 = 528$`; `$16 + 1 = 17$`. Total 897.)
</details>

## 4. Worked example

XOR with hand-picked weights and step activations. Inputs `$x_1, x_2 \in \{0, 1\}$`.

- Hidden neuron A: `$x_1 + x_2 - 0.5$` (OR).
- Hidden neuron B: `$x_1 + x_2 - 1.5$` (AND).
- Output: `$A - 2B - 0.5$`.

| x₁, x₂ | A | B | output sum | output |
|---|---|---|---|---|
| 0, 0 | 0 | 0 | −0.5 | 0 |
| 0, 1 | 1 | 0 | 0.5 | 1 |
| 1, 0 | 1 | 0 | 0.5 | 1 |
| 1, 1 | 1 | 1 | −1.5 | 0 |

The hidden layer moved the four corners to new positions, (0, 0), (1, 0), (1, 0) and (1, 1), where one straight line separates them. That is what "learning features" means.

## 5. Practice

1. In the simulation, what is the fewest hidden neurons that learns the ring? XOR?
2. Count the parameters of the 2-4-1 network in the quiz.
3. Why does a network with one hidden neuron behave like logistic regression?

<details>
<summary>Answers</summary>

1. Usually 3 for the ring (three lines make a triangle round it) and 2 for XOR, though training sometimes needs one more.
2. 17 (12 in the hidden layer, 5 in the output).
3. One hidden neuron gives one soft line; the output just rescales it, so the boundary is still a single straight line.
</details>

**Try it on your own data:** the [[neural-network-toys]] shows why one neuron fails on XOR; this lesson's simulation shows the hidden layer that fixes it.

**New words:** *fully connected layer*, *hidden layer*, *width*, *depth*, *feature learning*, *universal approximation*, *softmax*.

<div class="keypoints">

- A fully connected network has an input layer, hidden layers of neurons (weighted sum, bias, activation) and an output layer suited to the task.
- Each hidden neuron draws one soft line; later layers combine them into curved boundaries: the network learns its own features.
- A layer from n_in to n_out neurons has n_in × n_out weights plus n_out biases.
- Wider layers add lines, deeper layers add features of features; more weights also mean more risk of overfitting.

</div>
