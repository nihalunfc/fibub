---
title: 'Functions: notation, graphs and transformations'
seoTitle: 'SAT functions: notation, composition, transformations'
summary: 'Read function notation, evaluate and compose functions, read values from graphs and tables, and predict how f(x − h) + k moves a graph, with a live transformation explorer.'
minutes: 18
updated: 2026-11-22
quiz:
  - q: 'f(x) = 3x − 2. What is f(4)?'
    choices: ['10', '12', '14']
    ans: 0
    why: 'Replace x with 4: 3(4) − 2 = 10.'
  - q: 'f(x) = x + 1 and g(x) = 2x. What is f(g(3))?'
    choices: ['7', '8', '6']
    ans: 0
    why: 'Inside first: g(3) = 6. Then f(6) = 7.'
  - q: 'How does the graph of y = f(x + 2) compare with y = f(x)?'
    choices: ['Moved 2 units left', 'Moved 2 units right', 'Moved 2 units up']
    ans: 0
    why: 'Changes inside the brackets move the graph the opposite way to the sign: + 2 moves it left.'
sources:
  - 'College Board, SAT Math content domains: Advanced Math (public test specifications) https://satsuite.collegeboard.org/digital'
  - 'fibub SAT question bank, functions (original questions) https://fibub.com/learn/courses/sat/functions/'
---

**Module 3 · about 18 minutes · read first: [2.2](/learn/courses/sat/linear-functions/), [3.2](/learn/courses/sat/quadratics/).** By the end you will read and use function notation, compose functions, and move graphs with transformations.

<div class="bigidea">A function is a machine: put an input in, get exactly one output. f(3) = 10 is just shorthand for "input 3, output 10", which is the point (3, 10) on the graph.</div>

## 1. Notation without fear

f(x) = x² + 1 is a rule. f(4) means "use the rule with 4": 4² + 1 = 17. Put brackets around a negative input: f(−3) = (−3)² + 1 = 10, not −9 + 1.

| Notation | Means |
|---|---|
| f(2) = 5 | the input 2 gives 5; (2, 5) is on the graph |
| f(x) = 0 | find the inputs that give 0 (the x-intercepts) |
| f(x + 1) | use the rule with x + 1 in place of x |

<div class="problem" data-problem="fn-g01"></div>

<div class="problem" data-problem="fn-g05"></div>

## 2. Composition: one machine into another

f(g(x)) means put x into g, then put the result into f. Work from the inside out.

<div class="steps">
<div class="step">f(x) = 2x + 1 and g(x) = x² − 3. <b>Find f(g(2)).</b></div>
<div class="step">Inside first: g(2) = 2² − 3 = 1.</div>
<div class="step">Feed that into f: f(1) = 2(1) + 1 = 3.</div>
<div class="step">So f(g(2)) = <b>3</b>. (g(f(2)) would be g(5) = 22: order matters.)</div>
</div>

<div class="problem" data-problem="fn-g02"></div>

## 3. Moving graphs

Pick a parent graph and slide it. Watch which way the minus sign moves it.

<figure class="fig" data-fig="graph" data-mode="transform"><figcaption>The dashed curve is the parent f(x); the solid one is f(x − h) + k. Inside the brackets the shift goes the opposite way to the sign.</figcaption></figure>

<div class="meaning">

<dl>
<dt>f(x) + k</dt><dd>moves the graph up k (down if k is negative)</dd>
<dt>f(x − h)</dt><dd>moves the graph right h (left for f(x + h))</dd>
<dt>−f(x)</dt><dd>flips it upside down across the x-axis</dd>
<dt>Physical meaning</dt><dd>f(x − 3) reaches every height 3 units <i>later</i> than f(x) does, because you need an input 3 bigger to feed the same number into f. Later means further right.</dd>
</dl>

</div>

<div class="problem" data-problem="fn-g03"></div>

## 4. Finding a missing constant

"f(x) = ax + 7 and f(2) = 1. What is a?" Put the input and output in: 1 = 2a + 7, so a = −3.

<div class="problem" data-problem="fn-g04"></div>

<div class="myth">

**"f(x − 3) moves the graph left because of the minus."** It moves right. Test it: f(x) = x² has its vertex at x = 0; (x − 3)² is zero at x = 3, so the vertex moved right to 3.

</div>

<div class="keypoints">

- f(a) = b means input a, output b: the point (a, b) on the graph.
- Use brackets for negative inputs; f(g(x)) is worked inside out.
- f(x) + k shifts up k; f(x − h) shifts right h; −f(x) flips over the x-axis.
- To find a constant, substitute a known input and output and solve.

</div>
