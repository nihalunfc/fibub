---
title: 'Derivatives and the gradient: which way is downhill'
seoTitle: 'Derivatives and the gradient, for machine learning'
summary: 'The derivative is the slope of a curve at one point. Step against it and you go downhill. That single rule, gradient descent, is how almost every model learns. Roll a ball down a curve and change the step size.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'For f(x) = x², what is the slope (derivative) at x = 3?'
    choices: ['3', '6', '9']
    ans: 1
    why: The derivative of x² is 2x, so at x = 3 the slope is 6.
  - q: 'At x = 3 the slope of a loss curve is +6. Which way should x move to lower the loss?'
    choices: ['Increase x', 'Decrease x', 'Stay put']
    ans: 1
    why: A positive slope means the curve rises to the right, so downhill is to the left. Gradient descent moves against the slope.
  - q: What happens if the learning rate is far too large?
    choices: ['Training is slow but safe', 'Steps overshoot the bottom and can bounce or fly away', 'Nothing changes']
    ans: 1
    why: Each step is rate × slope. Too big and you jump right over the valley, sometimes landing higher than before.
sources:
  - 'Goodfellow, I., Bengio, Y. and Courville, A. (2016), Deep Learning, MIT Press, Section 4.3 (gradient-based optimisation) https://www.deeplearningbook.org/'
  - 'Strang, G. (2019), Linear Algebra and Learning from Data, Wellesley-Cambridge Press, Part VI (optimisation and gradient descent)'
  - 'Cauchy, A.-L. (1847), Méthode générale pour la résolution des systèmes d''équations simultanées, Comptes rendus de l''Académie des sciences 25, 536-538 (the first description of gradient descent)'
---

**Module 1 · about 25 minutes · read first: 1.3.** You'll be able to explain what a derivative is, work out simple ones, say what a gradient is, and run gradient descent by hand.

<div class="bigidea">The derivative tells you which way is uphill and how steep it is; step the other way, again and again, and you walk down to the smallest error.</div>

## 1. Why this matters

Training a model means making its error as small as possible. The error depends on the parameters (the dials), so you can draw it as a curve or a landscape. Making the error small means finding the bottom of a valley. The derivative tells you which way is downhill from wherever you stand. Linear regression (Lesson 3.3), logistic regression, neural networks and language models are all trained by walking downhill this way.

## 2. The derivative is a slope at one point

A curve like `$f(x) = x^2$` has no single slope: it is gentle near 0 and steep further out. The **derivative** `$f'(x)$` (say "f prime of x") is the slope of the curve at one point. Picture a ruler laid so it just touches the curve at that point without cutting it: that is the **tangent**, and its slope is the derivative. On a road, it is the steepness right under your wheels, not the average over the whole hill.

You can estimate it with two points very close together:

```math
f'(x) \approx \frac{f(x + h) - f(x)}{h} \quad \text{for a tiny } h
```

This is just rise ÷ run (Lesson 1.3) over a tiny run. As `$h$` shrinks to zero, the estimate becomes exact.

Try it: press Play on the long valley, then raise the learning rate until it zig-zags and finally flies off; add momentum to calm the zig-zag. Click the picture to choose another start.

<figure class="fig" data-fig="@ai-sgd-landscape"><figcaption>A small learning rate crawls, a big one overshoots and diverges, and momentum smooths the zig-zag in a narrow valley. On the two-valley surface the start point decides which minimum you reach: gradient descent finds a nearby low point, not necessarily the lowest.</figcaption></figure>

## 3. Rules you'll use

You don't need to compute limits each time. A few rules cover this course:

| Function | Derivative | Example |
|---|---|---|
| `$c$` (a constant) | `$0$` | `$f(x) = 7$` → `$0$` |
| `$x^n$` | `$n\,x^{n-1}$` | `$x^2$` → `$2x$`; `$x^3$` → `$3x^2$` |
| `$a\,g(x)$` | `$a\,g'(x)$` | `$5x^2$` → `$10x$` |
| `$g(x) + h(x)$` | `$g'(x) + h'(x)$` | `$x^2 + 3x$` → `$2x + 3$` |
| `$e^x$` | `$e^x$` | used in Lesson 4.2 |
| `$\ln x$` | `$1/x$` | used in Lesson 4.3 |
| `$g(h(x))$` (chain rule) | `$g'(h(x)) \cdot h'(x)$` | `$(x - 2)^2$` → `$2(x - 2)$` |

The **chain rule** in the last row says: for a function inside a function, multiply the outer slope by the inner slope. It is the heart of backpropagation in neural networks (Lesson 9.4).

Step through one training step of the smallest possible network, forward first, then backwards.

<figure class="fig" data-fig="@ai-backprop-player"><figcaption>The forward pass makes the prediction and the loss. The backward pass multiplies slopes link by link (the chain rule) so every weight learns how it should change. Then each weight takes a small step against its slope.</figcaption></figure>

## 4. Walking downhill: gradient descent

Here is the idea that trains models. Stand at some `$x$`. Look at the slope. If it is positive, the curve rises to the right, so step left. If negative, step right. Make the step proportional to the slope, so you take big steps where it is steep and small ones near the bottom:

```math
x_{\text{new}} = x - \eta \, f'(x)
```

`$\eta$` (the Greek letter eta) is the **learning rate**, the step size. Here is one small walk, three steps long, on the curve `$f(x) = (x - 2)^2 + 1$`, whose bottom is at `$x = 2$`. Its slope is `$f'(x) = 2(x - 2)$`, and we use rate 0.25:

<div class="steps" data-fig="derivatives-gradient-steps">
<div class="step"><b>Start at x = 0.</b> The slope there is 2 × (0 − 2) = −4: the curve falls to the right. Step: x − 0.25 × (−4) = 0 + 1 = <b>1</b>. The error drops from 5 to 2.</div>
<div class="step"><b>At x = 1.</b> Slope 2 × (1 − 2) = −2, gentler now. Step: 1 + 0.25 × 2 = <b>1.5</b>. Error 2 → 1.25.</div>
<div class="step"><b>At x = 1.5.</b> Slope −1. Step: 1.5 + 0.25 = <b>1.75</b>. Error 1.25 → 1.0625.</div>
<div class="step"><b>The pattern.</b> Each step halves the gap to the bottom (2 → 1 → 0.5 → 0.25). Steps shrink by themselves, because the slope shrinks near the bottom. No one has to tell the ball to slow down.</div>
</div>

<div class="problem" data-problem="derivatives-gradient-step"></div>

Now try it with your own rate and curve:

<!--fig:downhill-->

Experiments worth doing:

- **Rate 0.2 on the bowl:** the ball slides smoothly to x = 2, taking smaller and smaller steps.
- **Rate 0.95:** each step jumps across the valley and back, zig-zagging slowly in.
- **Rate 1.05:** each jump lands higher than the last, and the ball flies off. Too large a learning rate makes training blow up.
- **Bumpy curve, start at the right:** the ball settles in the right-hand valley, though the left one is deeper. Gradient descent finds *a* bottom, not always *the* lowest one.

<div class="myth">

**"Gradient descent always finds the lowest point."** It only feels the ground under its feet, so it stops in the first valley it rolls into, a **local minimum**. For the bowl-shaped errors of linear and logistic regression there is only one valley, so that is fine. For neural networks there are many, and in practice the valleys it finds are usually good enough, but there is no guarantee of the very lowest.

</div>

## 5. Many parameters: the gradient

Real models have many parameters, so the error is a surface over many directions, not a curve. For each parameter you take the **partial derivative**: the slope in that one direction with all the others held still. Listed together they form the **gradient**, written `$\nabla f$` (say "grad f"):

```math
\nabla f(w_1, w_2) = \left( \frac{\partial f}{\partial w_1},\ \frac{\partial f}{\partial w_2} \right)
```

The gradient is a vector (Lesson 1.4) that points uphill, the steepest way up. Gradient descent steps the opposite way, for all parameters at once:

```math
\mathbf{w}_{\text{new}} = \mathbf{w} - \eta \, \nabla f(\mathbf{w})
```

A language model does exactly this with billions of parameters at every training step.

<div class="meaning">

<dl>
<dt>f′(x)</dt><dd>The slope of the curve right at x: how fast the error changes if you nudge x a tiny bit.</dd>
<dt>∇f (gradient)</dt><dd>The list of slopes, one per parameter. Together they point straight uphill.</dd>
<dt>η (learning rate)</dt><dd>How big a step to take. Too small is slow; too big overshoots.</dd>
<dt>x − η f′(x)</dt><dd>The new setting: the old one, moved a little against the slope.</dd>
<dt>Physical meaning</dt><dd>A walker in thick fog on a hillside. They can't see the valley, but they can feel which way the ground tilts under their feet. They take a step downhill, feel again, and repeat. Steep ground gives long strides; nearly flat ground near the bottom gives tiny shuffles. That is all "training" is.</dd>
</dl>

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the derivative is the slope of a function at a point. Moving a small step against it lowers the function.

**Equation:** `$f'(x) = \lim_{h \to 0} \dfrac{f(x+h) - f(x)}{h}$`; gradient descent `$x \leftarrow x - \eta f'(x)$`.

**Why it works:** near `$x$`, the curve is almost its tangent line, so `$f(x - \eta f'(x)) \approx f(x) - \eta\, f'(x)^2$`. Since `$f'(x)^2$` is never negative, a small step always lowers `$f$` (unless the slope is already 0, at the bottom).

**Analogy:** walking down a hill in thick fog. You can't see the valley, but you can feel which way the ground slopes under your feet, so you step that way and feel again.

**Try it:** `$f(x) = (x - 2)^2 + 1$`, start at `$x = 0$`, rate 0.25. The slope is `$2(x - 2) = -4$`, so `$x_{\text{new}} = 0 - 0.25 \times (-4) = 1$`. Next: slope `$-2$`, `$x = 1.5$`. Then 1.75, 1.875, ... halving the gap to 2 each step.
</details>

## 6. Worked example

*Made-up numbers.* A café sets one price `$p$` (in dollars) for a sandwich. Its owner estimates that profit is roughly `$P(p) = -20(p - 7)^2 + 500$` dollars a day: too cheap loses money on each sandwich, too dear loses customers. We want the top of the hill, so we walk **up** the slope (gradient ascent, or descent on `$-P$`).

The derivative is `$P'(p) = -40(p - 7)$`. Start at `$p = 5$` with rate 0.01:

- `$P'(5) = -40 \times (-2) = 80$`, so `$p = 5 + 0.01 \times 80 = 5.8$`.
- `$P'(5.8) = 48$`, so `$p = 6.28$`.
- `$P'(6.28) = 28.8$`, so `$p = 6.568$`. Each step closes 40 % of the remaining gap, heading for $7.

Setting the derivative to zero gets there in one go: `$-40(p - 7) = 0$` gives `$p = 7$`. For a simple curve, solving `$f'(x) = 0$` is quickest. For a model with a million parameters there is no such shortcut, and stepping downhill is the practical way.

## 7. Practice

1. Find the derivative of `$f(x) = 3x^2 - 4x + 1$`, and the `$x$` where the slope is zero.
2. From `$x = 4$` on `$f(x) = x^2$`, take one gradient descent step with rate 0.1.
3. Use the chain rule on `$f(x) = (3x + 1)^2$`.

<details>
<summary>Answers</summary>

1. `$f'(x) = 6x - 4$`; zero at `$x = 2/3$`.
2. Slope `$2 \times 4 = 8$`; `$x = 4 - 0.1 \times 8 = 3.2$`.
3. Outer `$2(3x + 1)$` times inner `$3$`: `$f'(x) = 6(3x + 1)$`.
</details>

**Try it yourself:** plot `$f(x)$` and the derivative you worked out, such as `x^2` and `2*x`, together in the [[function-grapher]], and check that the second is zero exactly where the first bottoms out.

**New words:** *derivative*, *tangent*, *chain rule*, *learning rate*, *gradient descent*, *partial derivative*, *gradient*, *local minimum* (a valley that isn't the lowest).

<div class="keypoints">

- The derivative is the slope of a curve at one point: rise over a tiny run.
- Gradient descent: new x = x − η × slope. Step against the slope and the error goes down.
- The learning rate η sets the step size; too large and training bounces or blows up.
- With many parameters the slopes form the gradient, a vector that points uphill; descent steps the opposite way.
- Gradient descent finds a valley, not always the lowest one.

</div>
