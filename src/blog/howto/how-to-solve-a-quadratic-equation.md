---
title: "How to solve a quadratic equation (with a worked example)"
summary: "Find the discriminant b² − 4ac, then use x = (−b ± √D) / 2a, or split the middle term when the roots are whole numbers or fractions. Worked example and checks."
tools: [quadratic-explorer, function-grapher, symbolic-algebra]
updated: 2026-11-10
sources:
  - "The quadratic formula, the discriminant, the vertex at x = −b/2a, splitting the middle term and the sum and product of roots: standard school algebra."
---

To solve ax² + bx + c = 0, work out the discriminant D = b² − 4ac first, then put it into x = (−b ± √D) / 2a; when D is a perfect square you can also factorise by splitting the middle term. The [[quadratic-explorer]] does every one of these steps for the numbers you type and draws the parabola, so you can see the roots as the points where the curve meets the x axis.

## What you need

- **The equation in standard form**, ax² + bx + c = 0, with 0 on one side. For example, 2x² = 7x − 3 becomes 2x² − 7x + 3 = 0.
- **The three numbers a, b and c**, with their signs. a is the number in front of x², b the number in front of x, and c the number on its own. If a term is missing, its number is 0.
- **a must not be 0.** With no x² term the equation is linear.

## Step by step

1. Open the quadratic explorer and type a, b and c into the boxes beside the sliders. Check the equation printed above the graph for sign slips.
2. Look at the card headed **The discriminant decides**. It shows D = b² − 4ac with your numbers in it, and a coloured label for what D tells you:
   - D > 0: two different real roots (the curve crosses the x axis twice),
   - D = 0: one repeated root (the lowest or highest point sits on the axis),
   - D < 0: no real roots (the curve never reaches the axis).
3. Under that, the formula line fills in x = (−b ± √D) / 2a and gives both answers.
4. For a factorised answer, scroll to **Split the middle term**. It looks for two whole numbers that add to b and multiply to a × c and shows the two brackets, or tells you no such pair exists.
5. The **Completing the square** card lists a third method line by line, with tiles that show where the extra square comes from.

The formula, x = (−b ± √(b² − 4ac)) / 2a, gives two answers: one with plus, one with minus. The part under the root is D, which is why it decides how many real roots there are.

## A worked example

Solve 2x² − 7x + 3 = 0.

- Here a = 2, b = −7 and c = 3.
- D = (−7)² − 4 × 2 × 3 = 49 − 24 = **25**. That is positive, so there are two real roots, and because 25 = 5² they are rational.
- Formula: x = (7 ± 5) / 4. With plus, x = 12 / 4 = **3**. With minus, x = 2 / 4 = **0.5**.
- Splitting the middle term: a × c = 6, and the two numbers that add to −7 and multiply to 6 are −6 and −1. So 2x² − 6x − x + 3 = 2x(x − 3) − 1(x − 3) = **(2x − 1)(x − 3)**, which is zero when x = 1/2 or x = 3.
- The graph opens upwards (a is positive), with its lowest point at (1.75, −3.125) and the two green dots at 0.5 and 3.

Now try one that does not factorise: x² − 6x + 7 = 0. Here D = 36 − 28 = 8, which is not a perfect square, so the split card finds no whole-number pair. The formula still works: x = (6 ± √8) / 2 = 3 ± √2, which is about **1.586** and **4.414**.

And one with no real answer: x² + 4x + 5 = 0 gives D = 16 − 20 = −4. The curve floats above the axis with its lowest point at (−2, 1). Switch the level to **Class 11** and the page gives the complex roots, −2 ± i.

## Check your answer

- **Put each root back in.** For x = 3: 2 × 9 − 21 + 3 = 0. For x = 0.5: 2 × 0.25 − 3.5 + 3 = 0. If you do not get 0, a sign slipped.
- **Sum and product.** The two roots always add to −b/a and multiply to c/a. Here 3 + 0.5 = 3.5 = 7/2 and 3 × 0.5 = 1.5 = 3/2. Both match, so the pair is right.
- **Symmetry.** The roots sit the same distance either side of x = −b/2a. 1.75 − 0.5 = 1.25 and 3 − 1.75 = 1.25.

To compare several parabolas on one set of axes, draw them in the [[function-grapher]]; to expand or factorise longer expressions with every step shown, use [[symbolic-algebra]].

## Questions people ask

**Which method should I use in a test?**
Work out D first. If it is a perfect square, splitting the middle term is quick; if not, go straight to the formula.

**Why do I sometimes get the same root twice?**
When D = 0 the ± part adds and takes away nothing, so both answers are −b/2a. On the graph the curve just touches the axis at its vertex instead of crossing it.

**Can a quadratic have only one root when D is positive?**
No. A positive D always gives two different real roots; you probably forgot the minus version of ±.
