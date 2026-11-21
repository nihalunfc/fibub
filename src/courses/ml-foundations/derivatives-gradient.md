---
title: 'Derivatives and the gradient: which way is downhill'
seoTitle: 'Derivatives and the gradient, for machine learning'
summary: 'The derivative is the slope of a curve at one point. Step against it and you go downhill. That single rule, gradient descent, is how almost every model learns. Roll a ball down a curve and change the step size.'
minutes: 25
updated: 2026-11-21
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
---

**Module 1 · about 25 minutes · read first: 1.3.** You'll be able to explain what a derivative is, work out simple ones, say what a gradient is, and run gradient descent by hand.

## 1. Why this matters

Training a model means making its error as small as possible. The error depends on the parameters, so it is a function, and making a function small means finding the bottom of its curve. The derivative tells you which way is downhill from wherever you stand. Linear regression (Lesson 3.3), logistic regression, neural networks and language models are all trained by walking downhill this way.

## 2. The derivative is a slope at one point

A curve like `$f(x) = x^2$` has no single slope: it is gentle near 0 and steep further out. The **derivative** `$f'(x)$` is the slope of the curve at one point, the slope of the straight line that just touches it there (the **tangent**).

You can estimate it with two points very close together:

```math
f'(x) \approx \frac{f(x + h) - f(x)}{h} \quad \text{for a tiny } h
```

This is just rise ÷ run (Lesson 1.3) over a tiny run. As `$h$` shrinks to zero, the estimate becomes exact.

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

## 4. Walking downhill: gradient descent

Here is the idea that trains models. Stand at some `$x$`. Look at the slope. If it is positive, the curve rises to the right, so step left. If negative, step right. Make the step proportional to the slope, so you take big steps where it is steep and small ones near the bottom:

```math
x_{\text{new}} = x - \eta \, f'(x)
```

`$\eta$` (the Greek letter eta) is the **learning rate**, the step size. Try it:

<!--fig:downhill-->

Experiments worth doing:

- **Rate 0.2 on the bowl:** the ball slides smoothly to x = 2, taking smaller and smaller steps.
- **Rate 0.95:** each step jumps across the valley and back, zig-zagging slowly in.
- **Rate 1.05:** each jump lands higher than the last, and the ball flies off. Too large a learning rate makes training blow up.
- **Bumpy curve, start at the right:** the ball settles in the right-hand valley, though the left one is deeper. Gradient descent finds *a* bottom, not always *the* lowest one.

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
