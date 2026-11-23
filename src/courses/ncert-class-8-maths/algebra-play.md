---
title: 'Algebra Play'
seoTitle: 'Algebra Class 8 notes: expressions and equations'
summary: 'Class 8 Maths: expressions, matchstick patterns, equations as a balance, x on both sides, word problems and number tricks, with scales you can play with.'
minutes: 55
updated: 2026-11-23
quiz:
  - q: 'Solve 3x + 5 = 20.'
    choices: ['x = 5', 'x = 25/3', 'x = 15', 'x = 7']
    ans: 0
    why: 'Take 5 from both sides: 3x = 15. Divide both sides by 3: x = 5.'
  - q: 'Think of a number n, add 6, double it, subtract 12. The result is:'
    choices: ['2n', 'n', '2n + 24', 'n + 6']
    ans: 0
    why: '2(n + 6) − 12 = 2n + 12 − 12 = 2n.'
  - q: 'Squares in a row need 3n + 1 matchsticks for n squares. How many sticks for 12 squares?'
    choices: ['37', '36', '39', '13']
    ans: 0
    why: '3 × 12 + 1 = 37.'
sources:
  - 'NCERT Class 8 Mathematics (Ganita Prakash), Chapter 13 “Algebra Play” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard school algebra (linear expressions and equations in one variable). Every solution was checked by substituting the answer back into the original equation.'
---

**Maths · Class 8 · Chapter 13 · about 55 minutes.** By the end you will be able to write rules for patterns as expressions, solve equations by keeping a balance, solve equations with the letter on both sides, turn a story into an equation, and explain why number tricks always work.

<div class="bigidea">Algebra is arithmetic with a letter standing for a number we do not yet know, or for any number at all. An equation is a balance: do the same thing to both sides and it stays balanced. Using that one idea you can solve puzzles, explain tricks and describe patterns.</div>

## 1. Letters, expressions and patterns

An **expression** is a mix of numbers and letters, with no equals sign: `$3n + 2$`, `$5x - 1$`. A **variable** is the letter, because its value can vary. When you put a number in place of the letter you get a value: if `$n = 4$` then `$3n + 2 = 14$`.

Patterns give expressions naturally. Make a row of triangles with matchsticks. One triangle needs 3 sticks. Each new triangle shares a side and needs only 2 more. For `$n$` triangles you need `$2n + 1$` sticks. A row of squares: the first needs 4, each new one needs 3 more, so `$3n + 1$` sticks.

<figure class="fig" data-fig="c8-alg-match"><figcaption>Choose triangles or squares and add shapes. The picture counts the sticks; the table shows the same numbers from the expression 2n + 1 or 3n + 1. The “+ 1” is the extra shared side at the start.</figcaption></figure>

<div class="meaning">
<dl>
<dt>Variable</dt><dd>a letter such as `$n$` or `$x$` that stands for a number.</dd>
<dt>Coefficient</dt><dd>the number in front of the letter: in `$3n$` it is 3, the amount that grows each time.</dd>
<dt>Expression</dt><dd>`$3n + 2$`. It has no equals sign, so there is nothing to “solve”: you can only simplify it or find its value.</dd>
<dt>Physical meaning</dt><dd>a rule that tells you the answer for any number of steps, without counting.</dd>
</dl>
</div>

<div class="problem" data-problem="c8m-alg-match"></div>

You can add or subtract **like terms**, those with the same letter part: `$5x + 2x = 7x$`, `$3 - 1 = 2$`. So `$5x + 3 + 2x - 1 = 7x + 2$`. You cannot mix unlike terms: `$7x + 2$` cannot be made simpler.

<div class="problem" data-problem="c8m-alg-perim"></div>

## 2. Equations: a balance

An **equation** says two expressions are equal: `$3x + 5 = 20$`. To solve it is to find the value of `$x$` that makes it true. Think of a balance scale. On the left pan are 3 bags (each holds an unknown `$x$` stones) and 5 loose stones. On the right pan are 20 stones. The scale is level. If you take the 5 stones off the left pan only, the scale tips. But if you take 5 stones off **both** pans, it stays level. This is the rule:

**Do the same to both sides.**

Play with the scale. Try the “wrong” button first, to see the tilt.

<figure class="fig" data-fig="c8-alg-balance"><figcaption>Bags of unknown weight x and loose stones. “Take the stones off both pans” keeps it level. “Take them off the left only” tips it. “Share both pans equally” divides everything by the number of bags and leaves one bag alone: that gives x.</figcaption></figure>

<div class="problem" data-problem="c8m-alg-solve"></div>

Try more with the tool below.

<!--fig:tool balance-scale-->

<div class="myth">

**“Move the number across and change its sign: that is the rule.”** That is a shortcut for “do the same to both sides”, and it works, but only because of the balance. If you forget why, you will slip. Say each step: “I subtract 5 from both sides.”

</div>

## 3. Letters on both sides

Sometimes `$x$` is on both sides: `$5x - 3 = 2x + 9$`. First collect all the x on one side by taking `$2x$` from both sides. Then clear the number, then divide.

<div class="steps" data-fig="c8-alg-sidesteps">
<div class="step">5x − 3 = 2x + 9. We want x alone. First, move the x terms to one side.</div>
<div class="step">Subtract 2x from both sides: 3x − 3 = 9.</div>
<div class="step">Add 3 to both sides: 3x = 12.</div>
<div class="step">Divide both sides by 3: x = 4.</div>
<div class="step">Check: 5(4) − 3 = 17 and 2(4) + 9 = 17. Both sides agree.</div>
</div>

**Always check.** Put your answer back into the original equation. If both sides are equal, you are right.

<div class="problem" data-problem="c8m-alg-sides"></div>

Brackets are opened first: `$2(x - 3) = x + 4$` becomes `$2x - 6 = x + 4$`, then `$x = 10$`. Be careful: the 2 multiplies **both** terms in the bracket.

## 4. Equations from stories

Most algebra helps with real puzzles. The steps are: (1) let a letter stand for the unknown; (2) write what the story says as an equation; (3) solve it; (4) check against the story.

A taxi charges ₹ 20 to start and ₹ 12 for every km. How far can you go for ₹ 116? Let the distance be `$k$` km. The fare is `$20 + 12k = 116$`, so `$12k = 96$` and `$k = 8$`. Use the slider to find the distance by trial, then see how the equation does it in one go.

<figure class="fig" data-fig="c8-alg-taxi"><figcaption>The orange block is the ₹ 20 start; each blue block is 1 km at ₹ 12. Slide the distance until the fare meets the target line. The equation 20 + 12k = target finds the same answer without guessing.</figcaption></figure>

Another: Meena’s mother is 3 times as old as Meena, and together they are 48. Let Meena be `$x$`. Then `$x + 3x = 48$`, so `$4x = 48$` and `$x = 12$`. Meena is 12 and her mother 36.

<div class="problem" data-problem="c8m-alg-age"></div>

## 5. Number tricks

“Think of a number. Add 5. Double it. Subtract 4. Halve it. Subtract your first number. You have got 3!” It feels like magic, but it is algebra. Let your number be `$n$`.

Watch the numbers on the left and the letter on the right.

<figure class="fig" data-fig="c8-alg-trick"><figcaption>Choose any n. The left column does the trick with your number; the right column does it with the letter. The last line is 3 for every n, because the n in “n + 3” cancels the n you take away.</figcaption></figure>

Why does it work for everyone? Because the algebra shows that the answer never depends on `$n$`. That is also how to **make up** a trick: pick steps whose letters cancel. “Multiply by 3, add 12, divide by 3, subtract your number” always gives 4.

Try more tricks in the tool.

<!--fig:tool algebra-tricks-->

## 6. Equation, identity or neither

`$x + 3 = 7$` is true only for `$x = 4$`: an equation. `$2(x + 1) = 2x + 2$` is true for **every** `$x$`: an identity (the two sides are the same expression written two ways). `$x + 1 = x + 2$` is true for no value of `$x$` at all.

Slide x and watch whether the two sides ever meet.

<figure class="fig" data-fig="c8-alg-kinds"><figcaption>The blue line is the left side and the orange line is the right side. An equation: they cross at one point. An identity: they lie on top of each other. No solution: parallel lines that never meet.</figcaption></figure>

<div class="keypoints">

- An expression has no equals sign; an equation does. A letter stands for a number.
- Patterns give rules: triangles in a row `$2n + 1$`, squares in a row `$3n + 1$`.
- Combine only like terms: `$5x + 2x = 7x$`.
- Solve by doing the same to both sides. Collect the x terms on one side, clear the number, then divide.
- Always check the answer in the original equation.
- To solve a story: name the unknown, write the equation, solve, check against the story.
- A number trick works because the letter cancels. An identity is true for all x; some equations are true for no x.

</div>

Other tools to explore: the [Balance scale](/learn/balance-scale/), [Algebra tricks](/learn/algebra-tricks/) and [Symbolic algebra](/science/symbolic-algebra/) tools work on their own too. Ready for exam-style questions? Go to [Algebra Play: practice questions](/learn/courses/ncert-class-8-maths/algebra-play-practice/).
