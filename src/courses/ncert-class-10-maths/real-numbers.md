---
title: Real Numbers
seoTitle: 'Real Numbers Class 10 notes, HCF, LCM, irrational'
summary: 'Class 10 Real Numbers with animations: prime factor trees, fundamental theorem of arithmetic, HCF and LCM, proving root 2 irrational, decimal expansions.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'The HCF of two numbers is 6 and their LCM is 180. If one number is 36, the other is:'
    choices: ['30', '18', '60', '15']
    ans: 0
    why: 'HCF × LCM = product of the numbers, so the other number is (6 × 180) ÷ 36 = 30.'
  - q: 'Which fraction has a terminating decimal expansion?'
    choices: ['7/40', '5/12', '2/15', '4/21']
    ans: 0
    why: '40 = 2³ × 5 has only the primes 2 and 5, so 7/40 = 0.175 ends. 12, 15 and 21 each have a factor 3 or 7, so their decimals repeat forever.'
  - q: 'Which of these is irrational?'
    choices: ['3 + √5', '√49', '0.4545…', '22/7']
    ans: 0
    why: '√5 is irrational, and a rational number plus an irrational number is irrational. √49 = 7, 0.4545… = 5/11 and 22/7 are all rational.'
sources:
  - 'NCERT Class 10 Maths, Chapter 1 “Real Numbers” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Euclid, Elements, Book IX proposition 14 (the fundamental theorem of arithmetic in its oldest form) and Book X (incommensurable lengths, the idea behind irrational numbers)'
  - 'Hardy and Wright, An Introduction to the Theory of Numbers, 6th edition (2008), chapters 1 and 4, for the uniqueness of prime factorisation'
---

**Maths · Class 10 · Chapter 1 · about 45 minutes.** By the end you will be able to break any number into primes, use that to find an HCF and LCM, prove that numbers like √2 are irrational, and tell by looking at a fraction whether its decimal stops or repeats.

<div class="bigidea">Primes are the atoms of whole numbers: every number above 1 is made of primes in exactly one way. That single fact gives us HCF and LCM, proofs that some numbers are not fractions at all, and a quick test for decimals.</div>

## 1. The fundamental theorem of arithmetic

A **prime number** has exactly two factors, 1 and itself: 2, 3, 5, 7, 11, 13… A **composite number** has more. The number 1 is neither. Every composite number can be broken into primes, like a Lego model into bricks. Do it with a **factor tree**: split the number into two factors, split any factor that is not prime, and stop when every leaf is prime.

<div class="steps" data-fig="c10-real-tree">
<div class="step">Start with 360. It is not prime, so we will split it.</div>
<div class="step">360 is even, so 2 divides it: 360 = 2 × 180. The 2 is prime and stays as a leaf.</div>
<div class="step">180 is even too: 180 = 2 × 90.</div>
<div class="step">90 is even: 90 = 2 × 45. Now 45 is odd, so we need another prime.</div>
<div class="step">The digits of 45 add to 9, so 3 divides it: 45 = 3 × 15.</div>
<div class="step">15 = 3 × 5, both prime. All leaves are primes, so the tree stops.</div>
<div class="step">Collect the leaves: 360 = 2 × 2 × 2 × 3 × 3 × 5 = 2³ × 3² × 5.</div>
</div>

You could have started 360 = 36 × 10 or 360 = 18 × 20 and the leaves would still be the same bricks. That is the big theorem of this chapter.

<div class="meaning">
<dl>
<dt>Fundamental theorem of arithmetic</dt><dd>Every composite number can be written as a product of primes, and this can be done in only one way, apart from the order of the primes.</dd>
<dt>Physical meaning</dt><dd>A number’s prime factorisation is like its fingerprint. Two different numbers never share the same set of bricks, so the bricks tell you everything about the number: what divides it, what it shares with other numbers, and what it can never be.</dd>
</dl>
</div>

Try any number below 500. Shuffle the bricks and watch the product so far under each brick: the order changes, the final number does not.

<figure class="fig" data-fig="c10-real-bricks"><figcaption>The prime bricks of a number. The little number under each brick is the product so far. Press Shuffle: whatever the order, the last one is always n, and the bricks themselves never change. A prime number is a single brick.</figcaption></figure>

<div class="myth">

**“Every number can be split into primes in several different ways.”** The *trees* can look different (360 = 36 × 10 or 18 × 20), but the *leaves* are always the same primes. If someone shows you two different prime factorisations of one number, one of them has a mistake.

</div>

**Using the theorem to test a number.** Does 6<sup>n</sup> ever end in the digit 0? A number ends in 0 when it is divisible by 10 = 2 × 5, so its prime factors must include both 2 **and** 5. Now 6 = 2 × 3, so 6<sup>n</sup> = 2<sup>n</sup> × 3<sup>n</sup> has no 5. By uniqueness, no other factorisation can sneak a 5 in. So 6<sup>n</sup> never ends in 0, for any n.

<figure class="fig" data-fig="c10-real-ends"><figcaption>Pick m and n. The rows count the 2s and the 5s hiding in m<sup>n</sup>. Each pair of one 2 and one 5 makes a 10, which is one zero at the end. With no 5 (or no 2) there are no zeros, whatever the power.</figcaption></figure>

## 2. HCF and LCM by prime factors

The **HCF** (highest common factor, also called GCD) of two numbers is the largest number that divides both. The **LCM** (lowest common multiple) is the smallest number that both divide into. Once you have the prime bricks, both are easy:

- **HCF** = the product of each **common** prime, taken with its **smallest** power.
- **LCM** = the product of **every** prime that appears, taken with its **greatest** power.

<div class="steps" data-fig="c10-real-hcfsteps">
<div class="step">Find the HCF and LCM of 72 and 120.</div>
<div class="step">Factorise: 72 = 2×2×2×3×3 and 120 = 2×2×2×3×5. Line up equal primes in the same column.</div>
<div class="step">Primes in both rows, joined by lines: three 2s and one 3.</div>
<div class="step">HCF = 2 × 2 × 2 × 3 = 24.</div>
<div class="step">LCM = every column once: 2×2×2×3 from the common part, then the extra 3 from 72 and the 5 from 120. LCM = 2³ × 3² × 5 = 360.</div>
<div class="step">Check: HCF × LCM = 24 × 360 = 8640, and 72 × 120 = 8640.</div>
</div>

The last step is a rule worth remembering. For two positive integers a and b:

```math
\text{HCF}(a, b) \times \text{LCM}(a, b) = a \times b
```

It works because each prime appears in the HCF with its smaller power and in the LCM with its larger power, so between them they use up the powers of both numbers exactly once.

<div class="meaning">
<dl>
<dt>HCF</dt><dd>the biggest number that divides both a and b with nothing left over</dd>
<dt>LCM</dt><dd>the smallest number that is a multiple of both a and b</dd>
<dt>Physical meaning</dt><dd>The HCF answers “what is the biggest piece I can cut both lengths into?” The LCM answers “when do two repeating events meet again?”.</dd>
</dl>
</div>

Draw it as a Venn diagram: the primes in the overlap multiply to the HCF, and everything inside the two circles, the overlap counted once, multiplies to the LCM.

<figure class="fig" data-fig="c10-real-venn"><figcaption>Slide the two numbers. The middle holds the shared primes (HCF), the sides hold each number’s extra primes, and the whole picture is the LCM. The readout checks HCF × LCM = a × b every time.</figcaption></figure>

Now try it yourself with the full HCF and LCM tool, which also shows the factor trees:

<!--fig:tool hcf-lcm-venn-->

<div class="problem" data-problem="c10m-real-hcflcm"></div>

<div class="problem" data-problem="c10m-real-product"></div>

**Where HCF and LCM show up in real life.**

- **HCF: cut into equal pieces.** The largest square tile that covers a rectangular floor without cutting has a side equal to the HCF of the length and width. A shopkeeper packing 84 pencils and 120 pens into identical boxes, with no leftovers of either, can make at most HCF(84, 120) = 12 boxes.
- **LCM: events that repeat.** Two buses leave a stand every 12 and 18 minutes. They leave together again after LCM(12, 18) = 36 minutes. Planets, traffic lights and temple bells all work like this.

<div class="problem" data-problem="c10m-real-tiles"></div>

<div class="problem" data-problem="c10m-real-bells"></div>

*Beyond the syllabus:* there is a faster way to find an HCF of huge numbers without factorising them, Euclid’s division algorithm, which the [Algorithm stepper](/learn/algorithm-stepper/) shows. The [Number theory toolkit](/science/number-theory-toolkit/) factorises, finds HCF and LCM, and tests primes for any number you type.

## 3. Revisiting irrational numbers

You already know the families of numbers: natural numbers (1, 2, 3…), integers (…, −2, −1, 0, 1, 2…), and **rational numbers**, which can be written as p/q with integers p and q and q ≠ 0. So 3/4, −7, 0.25 and 0.333… (which is 1/3) are all rational.

A real number that is **not** rational is **irrational**: its decimal goes on forever with no repeating block. Examples: √2, √3, π.

<figure class="fig" data-fig="c10-real-sets"><figcaption>Choose a number and see which box it sits in. Natural numbers sit inside the integers, the integers inside the rationals, the rationals inside the real numbers. The irrationals are the real numbers outside the rationals. Notice √16 is rational: it equals 4.</figcaption></figure>

Is it just a guess that √2 is not a fraction? No: we can prove it. The proof is a classic of mathematics, about 2,300 years old, and it uses the primes (the parity argument is the simplest case of the fundamental theorem).

The proof is by **contradiction**: assume the opposite, follow the logic, and reach something impossible. Then the assumption must have been wrong.

<div class="steps" data-fig="c10-real-proof">
<div class="step">Suppose √2 = a/b, where a and b are whole numbers with no common factor (the fraction is in its lowest terms).</div>
<div class="step">Square both sides: 2 = a²/b², so a² = 2b².</div>
<div class="step">So a² is even. If a were odd, a² would be odd, so a must be even. Write a = 2c.</div>
<div class="step">Put it back: (2c)² = 2b², so 4c² = 2b² and b² = 2c². Now b² is even, so b is even too.</div>
<div class="step">So a and b are both even: they have the common factor 2. But we said they had no common factor!</div>
<div class="step">The assumption led to nonsense, so it is false. √2 cannot be written as a fraction: it is irrational.</div>
</div>

The same method proves √3, √5, √7 and in general √p for any prime p are irrational: swap “even” for “divisible by p” (it uses the fundamental theorem: if p divides a², then p divides a).

<div class="myth">

**“√4, √9 and √16 are irrational because they have square roots.”** The square root of a perfect square is a whole number: √9 = 3 is rational. Only the roots of numbers that are *not* perfect squares (and not square of a fraction) are irrational. √2, √3, √5, √6, √7, √8 are; √4 and √25 are not.

</div>

Look at it numerically. For each denominator b, take the best numerator a and compare a² with 2b². They get closer and closer to equal, but never are:

<figure class="fig" data-fig="c10-real-hunt"><figcaption>Move b. Each dot is a fraction a/b that gets near √2 (the dashed line). Press Next best fraction to jump to 3/2, 7/5, 17/12, 41/29, 99/70 and 239/169. The difference a² − 2b² is always at least 1 in size, never 0: so no fraction equals √2.</figcaption></figure>

Zoom into the number line and see how the irrational points never fall on a fraction:

<!--fig:tool number-line-zoom-->

And a step player for the proof, with a line you can follow, is in the [Irrational √2](/learn/irrational-proof/) tool, which also lets you try √3 and others:

<!--fig:tool irrational-proof-->

**Sums and products with irrational numbers.** Two useful facts:

1. A rational number added to, subtracted from or multiplied (by a non-zero rational) with an irrational number gives an irrational number. Example: show that 3 + 2√5 is irrational. Suppose it were rational, say r. Then 2√5 = r − 3 is rational, so √5 = (r − 3)/2 is rational, which is false. So 3 + 2√5 is irrational.
2. The sum or product of two irrational numbers **can** be rational or irrational. √2 + (−√2) = 0 and √2 × √2 = 2 are both rational, but √2 + √3 is irrational.

## 4. Revisiting rational numbers and their decimals

Every rational number p/q has a decimal expansion that either **ends** (terminating, like 3/8 = 0.375) or **repeats** a block forever (non-terminating repeating, like 1/7 = 0.142857142857…). Which one happens depends only on the denominator, once the fraction is in lowest terms.

<div class="meaning">
<dl>
<dt>Terminating test</dt><dd>Let p/q be a rational number in lowest terms. Its decimal ends if and only if q = 2<sup>m</sup> × 5<sup>k</sup> for some whole numbers m and k.</dd>
<dt>Physical meaning</dt><dd>Our number system has base 10 = 2 × 5, so a fraction ends only if its denominator can be turned into a power of 10 using just those two primes. Any other prime in the denominator can never be cleared, so the long division keeps going.</dd>
</dl>
</div>

Why does this work? Take 7/40. Since 40 = 2³ × 5, multiply the top and bottom by 5² to make 5³ × 2³ = 1000: 7/40 = 175/1000 = 0.175. If the denominator had a 3 in it, no multiplication by 2s and 5s could ever make it a power of 10.

Choose any fraction below and watch the long division produce digits. If the denominator has a prime other than 2 and 5, the remainders must start repeating (there are only q − 1 possible remainders), and then the digits repeat in a block.

<figure class="fig" data-fig="c10-real-decimal"><figcaption>Change p and q. Shaded digits form the repeating block. The readout shows the denominator’s prime factors: only 2s and 5s means the decimal stops. Try 1/7, 1/8, 5/12, 3/20 and 7/30.</figcaption></figure>

<div class="problem" data-problem="c10m-real-decimal"></div>

**Going the other way.** A decimal that ends or repeats is always rational. For instance 0.375 = 375/1000 = 3/8, and 0.333… = 1/3. A decimal that neither ends nor repeats, such as 0.101001000100001…, is irrational: the pattern grows but never repeats a block.

<div class="myth">

**“A fraction like 1/3 is irrational because its decimal never stops.”** Never stopping is not enough. 0.3333… repeats, and a repeating decimal is always a fraction. Irrational means neither stopping *nor* repeating.

</div>

<div class="history">

<ul class="timeline">
<li><b>about 300 BCE</b> Euclid writes the proof that there are infinitely many primes, and the uniqueness idea behind the fundamental theorem.</li>
<li><b>about 400 BCE</b> Greek mathematicians discover that the diagonal of a square cannot be measured against its side by any fraction.</li>
<li><b>about 500 CE</b> Aryabhata and later Indian mathematicians work with square roots and approximate irrational numbers very accurately.</li>
<li><b>1761</b> Johann Lambert proves π is irrational.</li>
</ul>

</div>

<div class="keypoints">

- Every composite number is a product of primes in exactly one way (apart from order): the fundamental theorem of arithmetic.
- HCF = common primes with the smallest powers; LCM = all primes with the greatest powers; HCF × LCM = a × b for two numbers.
- HCF cuts into equal pieces; LCM tells you when repeating events meet again.
- A number is irrational if it is not p/q; √2, √3, √5 and π are irrational. Proofs go by contradiction.
- Rational ± irrational and rational × irrational (non-zero rational) are irrational.
- p/q in lowest terms terminates if and only if q = 2<sup>m</sup> × 5<sup>k</sup>; otherwise its decimal repeats forever.
- m<sup>n</sup> ends in 0 only if m has both 2 and 5 as prime factors.

</div>
