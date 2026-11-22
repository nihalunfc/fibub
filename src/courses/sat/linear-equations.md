---
title: 'Linear equations in one variable'
seoTitle: 'SAT linear equations: solve, no solution, infinite'
summary: 'Solve linear equations step by step like balancing scales, spot equations with no solution or infinitely many, and use the shortcuts the SAT rewards, with live practice problems.'
minutes: 18
updated: 2026-11-22
quiz:
  - q: 'Solve 5x − 4 = 2x + 11.'
    choices: ['x = 5', 'x = 7/3', 'x = 15']
    ans: 0
    why: 'Subtract 2x: 3x − 4 = 11. Add 4: 3x = 15. Divide by 3: x = 5.'
  - q: 'How many solutions does 2(x + 3) = 2x + 7 have?'
    choices: ['None', 'One', 'Infinitely many']
    ans: 0
    why: 'Expanding gives 2x + 6 = 2x + 7. The x terms cancel and 6 = 7 is false, so there is no solution.'
  - q: 'If 6x + 9 = 33, what is 2x + 3?'
    choices: ['11', '4', '33']
    ans: 0
    why: '6x + 9 is 3 times 2x + 3, so 2x + 3 = 33 ÷ 3 = 11. No need to find x.'
sources:
  - 'College Board, SAT Math content domains: Algebra (public test specifications) https://satsuite.collegeboard.org/digital'
  - 'fibub SAT question bank, linear equations (original questions) https://fibub.com/learn/courses/sat/linear-equations/'
---

**Module 2 · about 18 minutes · read first: nothing, this is the place to start Math.** By the end you will solve any linear equation in one variable, know at a glance when one has no solution or infinitely many, and use the "solve for the expression" shortcut.

<div class="bigidea">An equation is a balance. Whatever you do to one side you must do to the other, and every step aims at one thing: getting x alone.</div>

## 1. The balance idea

Picture a see-saw scale with 3x + 5 on the left pan and 20 on the right. It balances, so both sides weigh the same. If you take 5 off the left, you must take 5 off the right to keep it level. Then divide both pans into 3 equal parts and keep one: x = 5.

<div class="steps" data-fig="balance" data-title="Watch it balance">
<div class="step" data-l="3x + 5" data-r="20" data-op="Start: the scale balances">The scale balances: 3x + 5 weighs the same as 20.</div>
<div class="step" data-l="3x + 5 − 5" data-r="20 − 5" data-op="Take 5 off both pans">Take 5 off <b>both</b> sides. The scale still balances.</div>
<div class="step" data-l="3x" data-r="15" data-op="Tidy up">Now 3x = 15. Three equal x's weigh 15.</div>
<div class="step" data-l="x" data-r="5" data-op="Divide both pans by 3">Divide both sides by 3: <b>x = 5</b>. Check: 3(5) + 5 = 20. ✓</div>
</div>

## 2. The four-step method

Every linear equation falls to the same routine:

1. **Clear brackets** (multiply out) and **fractions** (multiply every term by the bottom number).
2. **Collect x terms** on one side by adding or subtracting.
3. **Collect numbers** on the other side.
4. **Divide** by the number in front of x. Then put your answer back in to check.

```math
ax + b = cx + d \;\Rightarrow\; x = \frac{d - b}{a - c}
```

<div class="meaning">

<dl>
<dt>a, c</dt><dd>how many x's are on each side</dd>
<dt>b, d</dt><dd>the plain numbers on each side</dd>
<dt>a − c</dt><dd>how many x's are left after you collect them on one side</dd>
<dt>Physical meaning</dt><dd>If a = c, the x's cancel completely. Then there is nothing left to divide by: the equation is either always true or never true (section 3).</dd>
</dl>

</div>

<div class="problem" data-problem="le-g01"></div>

## 3. No solution or infinitely many?

The SAT loves this question. Expand both sides, then look:

| After expanding | Example | Number of solutions |
|---|---|---|
| Different numbers of x | 4x + 1 = 2x + 7 | **Exactly one** (x = 3) |
| Same x terms, different numbers | 4x + 1 = 4x + 7 | **None** (1 = 7 is never true) |
| Exactly the same both sides | 4x + 2 = 2(2x + 1) | **Infinitely many** (always true) |

A common version: "In the equation ax + 3 = 5x − 1, a is a constant. If the equation has no solution, what is a?" The x terms must cancel, so a = 5.

<div class="problem" data-problem="le-g06"></div>

## 4. The shortcut: solve for the expression

Read the question's last line before you start. If it asks for **2x + 3** and the equation says **6x + 9 = 33**, notice 6x + 9 = 3(2x + 3). So 2x + 3 = 11 in one step, with no need to find x.

<div class="problem" data-problem="le-g02"></div>

<div class="myth">

**"−3(x − 4) is −3x − 12."** The minus sign multiplies both terms in the brackets: −3 × −4 = +12, so −3(x − 4) = −3x + 12. Sign slips after a minus in front of a bracket are the single most common algebra mistake on the SAT.

</div>

## 5. Word problems become equations

"A plumber charges a $45 call-out fee plus $60 per hour. The bill was $285. How many hours?" The fixed fee is added once; the hourly rate is multiplied by the hours: 45 + 60h = 285, so 60h = 240 and h = 4.

<div class="problem" data-problem="le-g05"></div>

## 6. How the SAT asks it

- **Plain solve** (typed answer or four options). Do it by hand; check by substituting.
- **Number of solutions** (options: one, none, infinitely many, two). Expand first; "two" is never right for a linear equation.
- **Find the constant** that makes "no solution" or "infinitely many".
- **Solve for an expression**, as in section 4.
- **Rearrange a formula** to make another letter the subject: undo the operations in reverse order.

<div class="problem" data-problem="le-g07"></div>

<div class="keypoints">

- Do the same thing to both sides; aim to get x alone; check by substituting back.
- Method: clear brackets and fractions, collect x terms, collect numbers, divide.
- Same x terms with different numbers: no solution. Identical sides: infinitely many solutions.
- Read what the question asks for: often an expression like 2x + 3, which can be found without x.
- A minus sign before brackets changes the sign of every term inside.

</div>
