---
title: The World of Numbers
seoTitle: 'Number Systems Class 9 notes: rational and irrational'
summary: 'Class 9 The World of Numbers with animations: natural to real numbers, decimal expansions, irrationals, the root spiral, rationalising and rational exponents.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'Which of these is an irrational number?'
    choices: ['√7', '√49', '0.1666…', '−22/7']
    ans: 0
    why: '√49 = 7 and 0.1666… = 1/6 and −22/7 are all ratios of integers, so they are rational. 7 is not a perfect square, so √7 is irrational: its decimal never ends and never repeats.'
  - q: 'The decimal expansion of 3/8 is:'
    choices: ['0.375, terminating', '0.375, recurring', '0.38, terminating', '0.3̅7̅5̅, recurring']
    ans: 0
    why: '3 ÷ 8 = 0.375 and then the remainder is 0, so it terminates. The denominator 8 = 2 × 2 × 2 has only the prime factor 2, which always gives a terminating decimal.'
  - q: 'Rationalising 1/(√5 − 2) gives:'
    choices: ['√5 + 2', '√5 − 2', '(√5 + 2)/9', '5 − 2']
    ans: 0
    why: 'Multiply top and bottom by √5 + 2: the bottom becomes (√5)² − 2² = 5 − 4 = 1, so the result is √5 + 2.'
sources:
  - 'NCERT Class 9 Mathematics (Ganita Manjari), Chapter 3 “The World of Numbers” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Euclid, Elements Book X (about 300 BCE), and the Sulba Sutras of Baudhayana (about 800 BCE), for early treatments of the square root of 2'
  - 'Theodorus of Cyrene (5th century BCE) for the root spiral'
---

**Maths · Class 9 · Chapter 3 · about 55 minutes.** By the end you will be able to place any number in the number family, write a fraction as a terminating or recurring decimal, explain why √2 is irrational and draw it on the number line, work with sums and products of real numbers, rationalise a denominator, and use the laws of exponents with rational powers.

<div class="bigidea">The numbers you meet grow in stages: counting numbers, then zero, negatives, fractions, and finally numbers like √2 and π that no fraction can capture. Together they fill the whole number line without gaps: the real numbers. Decimals tell them apart: rational numbers end or repeat; irrational numbers never do.</div>

## 1. From counting to real numbers

Every number family was invented to solve a problem the last one could not.

- **Natural numbers N** = 1, 2, 3, … are for counting (cows in a herd, runs in cricket).
- **Whole numbers W** add 0 (the herd is empty).
- **Integers Z** add the negatives: … −2, −1, 0, 1, 2 … (a bank balance below zero, temperatures in Ladakh).
- **Rational numbers Q** are all numbers that can be written as p/q with p and q integers and q ≠ 0: shares and parts, such as 3/4 of a pizza or −7/2 degrees.
- **Real numbers R** are all the points of the number line. They include the rationals and the **irrational numbers**, which cannot be written as p/q.

Each family sits inside the next: N ⊂ W ⊂ Z ⊂ Q ⊂ R, and the irrationals fill the part of R outside Q.

<figure class="fig" data-fig="c9-num-sets"><figcaption>Pick a number. The dot lands in its <b>smallest</b> box and the text says why. Try √9 (a natural number in disguise), 0 (whole but not natural), and √2 and π (real but outside Q).</figcaption></figure>

<div class="myth">

**“Every square root is irrational.”** Only the square roots of numbers that are not perfect squares. √9 = 3 and √(1/4) = 1/2 are rational. √2, √3, √5 and √10 are irrational.

</div>

<div class="problem" data-problem="c9m-num-classify"></div>

## 2. Rational numbers and their decimals

Write any rational number p/q as a decimal by long division. Two things can happen: the division stops (**terminating**), or a remainder returns and the digits start repeating (**recurring**). It can never do anything else, and the reason is neat: when you divide by q, the only possible remainders are 0, 1, …, q − 1. After at most q steps either you reach 0 or you must meet a remainder you have already seen, and from there everything repeats.

<div class="steps" data-fig="c9-num-divsteps">
<div class="step">Let us write 1/7 as a decimal. Start with remainder 1.</div>
<div class="step">1 is too small to divide by 7, so write 0 before the point. Multiply the remainder by 10: 10 ÷ 7 = 1, remainder 3. First digit: 1.</div>
<div class="step">Multiply 3 by 10: 30 ÷ 7 = 4, remainder 2. Next digit: 4.</div>
<div class="step">Multiply 2 by 10: 20 ÷ 7 = 2, remainder 6. Next digit: 2.</div>
<div class="step">60 ÷ 7 = 8, remainder 4. Next digit: 8.</div>
<div class="step">40 ÷ 7 = 5, remainder 5. Next digit: 5.</div>
<div class="step">50 ÷ 7 = 7, remainder 1. Next digit: 7. Remainder 1 is the one we started with!</div>
<div class="step">So the next digits will be 1, 4, 2, 8, 5, 7 all over again: 1/7 = 0.142857142857… The block 142857 repeats forever. We write it 0.1̅4̅2̅8̅5̅7̅.</div>
</div>

Try any fraction yourself. Change p and q and see whether it ends or repeats and how long the repeating block is.

<figure class="fig" data-fig="c9-num-decimal"><figcaption>The repeating block is coloured and underlined. The text shows the denominator in lowest terms and its prime factors: if only 2s and 5s appear, the decimal terminates; if any other prime appears, it recurs. Notice how the period of 1/7 is 6, the most it could be.</figcaption></figure>

<div class="meaning">
<dl>
<dt>Terminating</dt><dd>the decimal ends, like 3/8 = 0.375 (in lowest terms the denominator has only the prime factors 2 and 5)</dd>
<dt>Recurring (non-terminating repeating)</dt><dd>one block of digits repeats forever, like 4/11 = 0.363636…</dd>
<dt>Period</dt><dd>the number of digits in the repeating block (6 for 1/7, 2 for 4/11)</dd>
<dt>Physical meaning</dt><dd>Both kinds are exact: the decimal is just another way to write the same rational number. 0.333… is not “nearly” a third; it is exactly 1/3.</dd>
</dl>
</div>

<div class="problem" data-problem="c9m-num-term"></div>

<div class="problem" data-problem="c9m-num-period"></div>

**Turning a recurring decimal back into a fraction.** Let x = 0.363636… The block has 2 digits, so multiply by 100: 100x = 36.3636… Subtract: 100x − x = 36, so 99x = 36 and x = 36/99 = 4/11. Any recurring decimal can be written as p/q: that is why they are rational.

<div class="problem" data-problem="c9m-num-frac"></div>

## 3. Irrational numbers

A number that is **not** a ratio of two integers is **irrational**. Its decimal goes on forever and **never repeats**: 1.41421356…, 3.14159265…, 0.101001000100001… (the number of zeros grows each time).

The Greeks were shocked to find that the diagonal of a square of side 1 cannot be measured exactly by any fraction. In India the Baudhayana Sulba Sutra (about 800 BCE) gave √2 ≈ 1 + 1/3 + 1/(3·4) − 1/(3·4·34) = 1.41421568…, correct to about five decimal places, but only as an approximation.

**Why √2 is irrational (the idea).** Suppose √2 = p/q in lowest terms. Then p² = 2q²: the area of a square of side p would be exactly the area of two squares of side q. Check with real numbers: 7² = 49 and 2 × 5² = 50, so 7/5 is close, but off by 1. Use the slider to look for a q where the two sides match exactly. You will find the gap never closes.

<figure class="fig" data-fig="c9-num-near"><figcaption>For each q the page picks the whole number p that makes p² closest to 2q², and shows both areas. They differ by at least 1 every time. The full proof by contradiction shows p and q would both have to be even, which breaks “lowest terms”. Try the proof in the <a href="/learn/irrational-proof/">Irrationality proof tool</a>.</figcaption></figure>

<figure class="fig" data-fig="c9-num-zoom"><figcaption>Zoom into a number on the number line: every level shows one more decimal digit. 0.6 stops, 1/3 and 1/7 show a repeating pattern, but √2 and π keep producing new digits with no pattern. Slide the zoom to 6 and compare.</figcaption></figure>

<div class="myth">

**“22/7 equals π.”** 22/7 = 3.142857… (recurring) is rational, and π = 3.14159265… is irrational. 22/7 is only a handy approximation, correct to two decimal places. The same goes for 3.14.

</div>

Meet a few more facts you should know:

- √2, √3, √5, √6, √7… (square roots of non-squares) and π are irrational.
- The sum, difference, product and quotient of two rational numbers (not dividing by 0) are rational.
- A non-zero rational plus or times an irrational is irrational. For instance 3 + √2 and 5√3 are irrational.

## 4. Real numbers on the number line

Between any two rational numbers there are infinitely many more. And between any two **real** numbers there are infinitely many rationals and infinitely many irrationals. Even so the rationals leave gaps, the places where irrational numbers sit. Filling every gap gives the **real number line**: every point on it is a real number and every real number is a point.

Where is √2? **Construct** it: no ruler needed beyond the unit length.

<div class="steps" data-fig="c9-num-sqrt2">
<div class="step">Draw a number line and mark 0, 1 and 2. The distance from 0 to 1 is our unit.</div>
<div class="step">On the segment from 0 to 1 draw a square with all sides equal to 1.</div>
<div class="step">Draw the diagonal from 0 to the opposite corner. By Pythagoras its length is √(1² + 1²) = √2.</div>
<div class="step">Put the point of a compass at 0 and open it to the length of the diagonal. Swing the arc down towards the number line.</div>
<div class="step">The arc meets the number line at one point: that point is √2. We have drawn an irrational number exactly.</div>
<div class="step">The point lies between 1.4 and 1.5: 1.4² = 1.96 and 1.5² = 2.25, and 2 is in between. Zooming in further gives 1.41421…</div>
</div>

Zooming in on the number line gives a different view: locate the number between two decimals, then magnify that interval, over and over. Try it in the tool below (it works for any real number, such as √2 or π).

<!--fig:tool number-line-zoom-->

**The square-root spiral.** The same Pythagoras trick draws √3, √4, √5 and so on. Start with a triangle with both legs 1 (hypotenuse √2). Build the next triangle on that hypotenuse with a new leg of 1: its hypotenuse is √(2 + 1) = √3. Keep going.

<figure class="fig" data-fig="c9-num-spiral"><figcaption>Slide the number of triangles, or press Play to grow the spiral. Each new triangle has legs 1 and the previous hypotenuse, so the n-th hypotenuse is √(n + 1). The ones that are whole numbers (√4 = 2, √9 = 3) are the perfect squares. The spiral takes its name from the way the triangles wind around the origin.</figcaption></figure>

The spiral is also in the [Root spiral tool](/learn/root-spiral/), where you can also see the angle at each step.

<div class="problem" data-problem="c9m-num-spiral"></div>

<div class="problem" data-problem="c9m-num-floor"></div>

## 5. Operations on real numbers

Real numbers can be added, subtracted, multiplied and divided just like rationals, but be careful about what kind of number you get.

- (√2) + (−√2) = 0 and √2 × √2 = 2: two irrationals giving a **rational** result.
- √2 + √3 and √2 × √3 = √6 are irrational.
- 2 + √5 is irrational; 3√2 is irrational.

The useful rules for square roots, for a, b > 0:

```math
\sqrt{a}\,\sqrt{b} = \sqrt{ab}, \qquad \sqrt{\frac{a}{b}} = \frac{\sqrt a}{\sqrt b}, \qquad (\sqrt a + \sqrt b)(\sqrt a - \sqrt b) = a - b
```

<figure class="fig" data-fig="c9-num-ops"><figcaption>Pick two numbers and + or ×. The page works out the result, places it on a number line and says whether it is rational or irrational. Look at √2 × √2 and √2 + (−√2) for the surprise results.</figcaption></figure>

<div class="myth">

**“An irrational number added to an irrational number is always irrational.”** Not always: √2 + (−√2) = 0 and √2 × √2 = 2 are rational. Check each case; do not trust a pattern.

</div>

## 6. Rationalising the denominator

A fraction such as 1/√2 is hard to evaluate by hand because the denominator is irrational. Multiplying the top and bottom by √2 changes only the look: 1/√2 = √2/2 ≈ 1.414/2 = 0.707. This is called **rationalising**.

When the denominator has two terms, such as √3 + √2, use its **conjugate** (the same terms with the sign between them changed). Then (a + b)(a − b) = a² − b² kills the roots.

<div class="steps" data-fig="c9-num-ratsteps">
<div class="step">Our fraction is 1/(√3 + √2). We cannot compute the bottom exactly.</div>
<div class="step">Multiply the top and the bottom by the conjugate √3 − √2. This is the same as multiplying by 1, so the value does not change.</div>
<div class="step">The bottom becomes (√3 + √2)(√3 − √2), which is (√3)² − (√2)² by the identity (a + b)(a − b) = a² − b².</div>
<div class="step">Square the roots: 3 − 2.</div>
<div class="step">The bottom is now just 1.</div>
<div class="step">So 1/(√3 + √2) = √3 − √2 ≈ 0.318. Check: 1/(1.732 + 1.414) = 0.318, the same.</div>
</div>

Practise with the tool, which shows each step for any denominator you type:

<!--fig:tool rationalise-denominator-->

<div class="problem" data-problem="c9m-num-rat"></div>

You will use the identity (a + b)(a − b) = a² − b² a lot in the next chapter, [Exploring Algebraic Identities](/learn/courses/ncert-class-9-maths/exploring-algebraic-identities/), and the [Number theory toolkit](/science/number-theory-toolkit/) will help you explore factors and primes.

## 7. Laws of exponents with rational powers

You know that a<sup>3</sup> = a × a × a. What does a<sup>1/2</sup> mean? The laws of exponents must keep working: a<sup>1/2</sup> × a<sup>1/2</sup> = a<sup>1/2 + 1/2</sup> = a¹ = a, so a<sup>1/2</sup> is the number that multiplied by itself gives a: the **square root** of a. In the same way:

```math
a^{1/n} = \sqrt[n]{a}, \qquad a^{m/n} = \left(\sqrt[n]{a}\right)^{m}, \qquad a^{-n} = \frac{1}{a^{n}}
```

For a > 0 and rational p and q the laws are:

```math
a^p \cdot a^q = a^{p+q}, \qquad \frac{a^p}{a^q} = a^{p-q}, \qquad (a^p)^q = a^{pq}, \qquad a^p b^p = (ab)^p
```

For example 64<sup>2/3</sup>: first the cube root, 64<sup>1/3</sup> = 4 (since 4³ = 64), and then square it: 4² = 16.

<figure class="fig" data-fig="c9-num-exp"><figcaption>Choose a base a and two rational powers p and q. Each row works out the left and right sides of a law with a calculator and shows that they match. The base is always positive here.</figcaption></figure>

<div class="problem" data-problem="c9m-num-pow"></div>

<div class="problem" data-problem="c9m-num-law"></div>

<div class="myth">

**“a<sup>1/2</sup> is a ÷ 2.”** The exponent 1/2 means a square root, not half of a. 16<sup>1/2</sup> = 4, while 16 ÷ 2 = 8.

</div>

<div class="history">

<ul class="timeline">
<li><b>about 800 BCE</b> The Sulba Sutras of Baudhayana give a close approximation to √2 for building altars.</li>
<li><b>5th century BCE</b> Greek mathematicians prove the diagonal of a square is incommensurable with its side. Theodorus draws the spiral of square roots up to √17.</li>
<li><b>628 CE</b> Brahmagupta works with square roots (karani) and surds in his rules of arithmetic.</li>
<li><b>1761</b> Johann Lambert proves π is irrational.</li>
</ul>

</div>

<div class="keypoints">

- N ⊂ W ⊂ Z ⊂ Q ⊂ R. Rational numbers are p/q with q ≠ 0; irrational numbers cannot be written that way; together they make the real numbers.
- Rational numbers have terminating or recurring decimals; irrational numbers have non-terminating, non-recurring decimals.
- p/q (in lowest terms) terminates exactly when q has no prime factors except 2 and 5.
- √2 is irrational. It is drawn as the diagonal of a unit square; the root spiral draws √2, √3, √4, … with right triangles.
- Rational ± rational is rational; a non-zero rational with an irrational is irrational; two irrationals can give either.
- To rationalise a/(√b + √c) multiply by the conjugate (√b − √c) and use (x + y)(x − y) = x² − y².
- a^(1/n) is the n-th root of a; for a > 0: a^p·a^q = a^(p+q), a^p/a^q = a^(p−q), (a^p)^q = a^(pq).

</div>
