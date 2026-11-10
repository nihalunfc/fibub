---
title: "Derivative as a slope: from secant line to tangent as h → 0"
summary: "What a derivative really measures, how the slope of a secant line closes in on the tangent as the gap h shrinks, and how to spot points where no derivative exists."
tools: [derivative-slope, function-grapher, symbolic-algebra, numerical-methods]
updated: 2026-11-10
sources:
  - "The derivative as the limit of [f(a + h) − f(a)] / h and the power rule: standard school calculus."
  - "Worked example numbers were produced with the tool's own code (src/lib/sci/school-calculus.ts) and checked by hand."
---

A derivative is one number that says how steep a curve is at one point. The rule "the derivative of x² is 2x" is easy to memorise and easy to forget the meaning of. The [[derivative-slope]] tool lets you watch that number appear: two points on a curve, a straight line through them, and a gap you can shrink until the line just touches the curve. It suits Class 11 and 12 students meeting limits and differentiation, and anyone who wants the idea to feel real. To get a feel for a curve's shape first, use the [[function-grapher]]; afterwards, [[symbolic-algebra]] gives exact derivatives of any expression, and [[numerical-methods]] shows how computers estimate them.

## What it is

Pick a point P on the curve y = f(x), at x = a. Pick a second point Q a little further along, at x = a + h. The straight line through P and Q is called a **secant**. Its slope is rise over run:

slope of PQ = [f(a + h) − f(a)] ÷ h

- **f(a)** is the height of the curve at P.
- **f(a + h)** is the height at Q.
- **h** is the horizontal gap between them. It can be negative, which puts Q on the left of P.

Now let h get smaller and smaller. Q slides towards P, and the secant turns until it lies along the **tangent**, the line that just grazes the curve at P. The value the slope settles on is the **derivative**, written f′(a).

You cannot simply set h = 0, because the formula would become 0 ÷ 0. The derivative is the value the slope *heads towards*. That is what a **limit** means.

If the slopes from the right (h > 0) and from the left (h < 0) head for different numbers, the curve has a sharp corner there and no derivative exists at that point.

## How to use it

1. Choose a curve from the **Function f(x)** list, or pick *My own…* and type one, such as `x^4 - 2*x`.
2. Set P with the **Point P** slider or by dragging along the picture. Drag Q itself, or use the **Gap h** slider, to change the gap.
3. Press **Slide Q to P** and watch h fall to 0.001 while the blue secant turns onto the dashed tangent.
4. Tick **Q on the left (h < 0)** to approach P from the other side.
5. Read the facts: the secant slope, the tangent slope f′(a), the gap between them and the tangent line written as y = mx + c. The table below lists both sides for h = 1, 0.1, 0.01, 0.001 and 0.0001.
6. Switch **Level** to Class 12 to add the left-hand and right-hand slopes and a yes-or-no on whether f is differentiable at P. The *From first principles* card writes out the limit working for xⁿ (n = 1 to 6) or sin x.

## A worked example

Take f(x) = x³ − 3x and put P at x = 2. The height there is f(2) = 8 − 6 = 2.

With h = 1, Q is at x = 3, where f(3) = 27 − 9 = 18. The secant slope is (18 − 2) ÷ 1 = **16**.

Shrink the gap:

| h | slope from the right | slope from the left (−h) |
|---|---|---|
| 1 | 16 | 4 |
| 0.1 | 9.61 | 8.41 |
| 0.01 | 9.0601 | 8.9401 |
| 0.001 | 9.006001 | 8.994001 |

Both columns close in on **9**. Algebra shows why. Expand f(2 + h) − f(2) and divide by h, and you get 9 + 6h + h². As h shrinks, the 6h and h² parts vanish, leaving 9. The power rule gives the same answer: f′(x) = 3x² − 3, so f′(2) = 12 − 3 = 9.

The tangent passes through (2, 2) with slope 9, so y − 2 = 9(x − 2), which is **y = 9x − 16**.

Notice the gap between secant and tangent: about 0.6 when h = 0.1, and about 0.06 when h = 0.01. Cutting h by ten cuts the error by about ten too.

Try √x at P = 4 as a second check. The secant slopes are about 0.236 (h = 1), 0.248 (h = 0.1) and 0.2498 (h = 0.01). They head for 1 ÷ (2 × √4) = **0.25**.

## Where it is used

- **Speed from position.** If s(t) is the distance travelled by time t, its derivative is the speed at that instant. A car's speedometer shows a derivative.
- **Economics.** The extra cost of making one more item is the slope of the cost curve, called the marginal cost.
- **Finding peaks and dips.** Where f′(x) = 0 the tangent is flat, which marks a highest or lowest point. For x³ − 3x that happens at x = 1 and x = −1.

## Common mistakes

1. **Setting h to zero.** That gives 0 ÷ 0. Use a small h, or simplify the algebra first and only then let h go to 0.
2. **Using one side only.** At a corner, like |x| at 0, the right side alone gives 1 and suggests a derivative exists. Always check that the left side agrees.
3. **Mixing up the slope and the height.** f′(2) = 9 is a steepness, not a y-value. The point itself is (2, 2).
4. **Expecting a tiny h to be perfect on a computer.** An extremely small h, far below 0.0001, can give rounding noise. Moderate h values show the trend more cleanly.

## Questions people ask

**What does a negative derivative mean?** The curve is going down as x increases. For x³ − 3x, f′(0) = −3, so the curve falls there.

**Does a smooth-looking curve always have a derivative?** Almost always, but a curve can be continuous with a sharp corner, like |x|, or have a vertical tangent, like √x at 0. Neither has a finite slope there.
