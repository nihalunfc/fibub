---
title: 'The perceptron: a neuron as a weighted vote'
seoTitle: 'The perceptron explained: the first artificial neuron'
summary: 'An artificial neuron adds up its weighted inputs and fires if the total passes a threshold. The perceptron learns those weights by nudging them after each mistake. Teach one AND and OR, and watch it fail at XOR.'
minutes: 20
updated: 2026-11-21
quiz:
  - q: 'A perceptron computes:'
    choices: ['1 if w·x + b ≥ 0, else 0', 'The average of its inputs', 'A probability with the sigmoid']
    ans: 0
    why: A weighted sum and a hard threshold. Replacing the threshold with a smooth function gives logistic regression.
  - q: After a mistake where the answer should have been 1, the perceptron
    choices: ['Adds the input to its weights', 'Subtracts the input from its weights', 'Leaves the weights alone']
    ans: 0
    why: Adding x raises w·x for that input next time, pushing the output towards 1.
  - q: Why can't one perceptron learn XOR?
    choices: ['Its decision boundary is a single straight line, and XOR needs two', 'XOR has too many rows', 'Its learning rate is too small']
    ans: 0
    why: XOR's 1s sit in opposite corners. No one line puts both on the same side (Lesson 4.4).
---

**Module 9 · about 20 minutes · read first: 1.4, 4.4.** You'll be able to compute a neuron's output, run the perceptron learning rule by hand, and explain why one neuron is not enough.

## 1. Why this matters

Every neural network, including the large language models at the end of this course, is built from one simple unit repeated billions of times. The perceptron (Frank Rosenblatt, 1958) is that unit in its first form. Its story also explains a famous setback: when Minsky and Papert showed in 1969 that one perceptron can't learn XOR, interest in neural networks collapsed for over a decade.

## 2. One neuron

A neuron takes inputs `$x_1, \dots, x_d$`, multiplies each by a **weight**, adds a **bias**, and passes the total through an **activation**:

```math
z = w_1 x_1 + \dots + w_d x_d + b = \mathbf{w} \cdot \mathbf{x} + b
```

```math
\hat{y} = \begin{cases} 1 & z \ge 0 \\ 0 & z < 0 \end{cases}
```

It is a weighted vote: each input pushes the total up or down by its weight, and the neuron "fires" if the total passes 0. The boundary between firing and not is the line (or plane) `$\mathbf{w} \cdot \mathbf{x} + b = 0$`, as in Lesson 4.4.

## 3. Learning from mistakes

The **perceptron rule**: go through the examples; whenever the neuron is wrong, nudge the weights towards the right answer.

- Should be 1, said 0: `$\mathbf{w} \leftarrow \mathbf{w} + \eta \mathbf{x}$`, `$b \leftarrow b + \eta$`.
- Should be 0, said 1: `$\mathbf{w} \leftarrow \mathbf{w} - \eta \mathbf{x}$`, `$b \leftarrow b - \eta$`.
- Right: change nothing.

One pass through all the examples is an **epoch**. If some line separates the two classes, the rule is guaranteed to find one in a finite number of steps (the perceptron convergence theorem). If no line exists, it never stops.

<!--fig:perceptron-->

## 4. The fix: more neurons

XOR needs two lines: "at least one input is on" and "not both". Two neurons can each draw one line, and a third can combine their answers. That is a network with a **hidden layer**, and it can solve XOR. But the perceptron rule only trains a single layer: it needs to know each neuron's correct answer, and hidden neurons have none. Training hidden layers needed two more ideas: smooth activations (Lesson 9.2) and backpropagation (Lesson 9.4).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a weighted sum with a threshold, trained by correcting mistakes.

**The update** with label `$y \in \{0, 1\}$` and prediction `$\hat{y}$`:

```math
\mathbf{w} \leftarrow \mathbf{w} + \eta \, (y - \hat{y}) \, \mathbf{x}
```

```math
b \leftarrow b + \eta \, (y - \hat{y})
```

`$y - \hat{y}$` is +1, −1 or 0, giving the three cases above.

**Why it moves the right way:** after adding `$\mathbf{x}$`, the new score for the same input is `$(\mathbf{w} + \mathbf{x}) \cdot \mathbf{x} + b + 1 = z + \lVert \mathbf{x} \rVert^2 + 1$`, strictly bigger than before.

**Neurons as logic gates:** with `$w_1 = w_2 = 1$`, the bias `$-1.5$` gives AND and `$-0.5$` gives OR.

**Analogy:** a committee vote where each member's vote counts by their weight, and members who keep backing the wrong side lose influence.

**Try it:** weights (2, 1), bias −3. Output for (1, 1)? For (1, 0)? (`$z = 0$`: 1. `$z = -1$`: 0. This neuron computes AND.)
</details>

## 5. Worked example

Learning AND (output 1 only for (1, 1)), starting from `$\mathbf{w} = (0, 0)$`, `$b = 0$`, `$\eta = 1$`, visiting (0, 0), (0, 1), (1, 0), (1, 1) in order:

| epoch | input | z | said | should | new w, b |
|---|---|---|---|---|---|
| 1 | (0, 0) | 0 | 1 | 0 | (0, 0), −1 |
| 1 | (0, 1) | −1 | 0 | 0 | unchanged |
| 1 | (1, 0) | −1 | 0 | 0 | unchanged |
| 1 | (1, 1) | −1 | 0 | 1 | (1, 1), 0 |
| 2 | (0, 0) | 0 | 1 | 0 | (1, 1), −1 |
| 2 | (0, 1) | 0 | 1 | 0 | (1, 0), −2 |
| 2 | (1, 0) | −1 | 0 | 0 | unchanged |
| 2 | (1, 1) | −1 | 0 | 1 | (2, 1), −1 |

It carries on the same way; by epoch 6 it reaches `$\mathbf{w} = (2, 1)$`, `$b = -3$` and makes no more mistakes: the AND neuron of the "Try it" above.

## 6. Practice

1. In the simulation, how many epochs does OR take? And AND?
2. Which bias makes the neuron with weights (1, 1) compute OR?
3. Why does the rule never stop on XOR?

<details>
<summary>Answers</summary>

1. OR settles in a few epochs; AND takes a few more (6 in the order used here).
2. Any bias between −1 and 0, for example −0.5: then one input on is enough.
3. Every line misclassifies at least one corner, so each epoch has a mistake, and each mistake changes the weights.
</details>

**Try it on your own data:** the [[neural-network-toys]] lets you click your own points and watch a perceptron's line move epoch by epoch.

**New words:** *artificial neuron*, *weight*, *bias*, *activation*, *perceptron*, *perceptron rule*, *epoch*, *linearly separable*.
