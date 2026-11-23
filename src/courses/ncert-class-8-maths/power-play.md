---
title: 'Power Play'
seoTitle: 'Power Play Class 8 notes: exponents, standard form'
summary: 'Class 8 Maths: powers, laws of exponents, zero and negative powers, powers of 10 and standard form, with paper folding and chessboard animations.'
minutes: 55
updated: 2026-11-23
quiz:
  - q: 'What is 3⁵ × 3² written as one power of 3?'
    choices: ['3⁷', '3¹⁰', '9⁷', '3³']
    ans: 0
    why: 'Same base, so add the powers: 5 + 2 = 7. The base stays 3.'
  - q: 'The value of 5⁰ + 2⁻² is:'
    choices: ['1¼', '1', '2', '¼']
    ans: 0
    why: '5⁰ = 1 and 2⁻² = 1/2² = 1/4. The sum is 1 + 1/4 = 1¼.'
  - q: 'The distance from Earth to the Sun is about 149 600 000 km. In standard form this is:'
    choices: ['1.496 × 10⁸ km', '1.496 × 10⁷ km', '14.96 × 10⁷ km', '1.496 × 10⁹ km']
    ans: 0
    why: 'Move the decimal point 8 places to the left to get 1.496, so the power of 10 is 8.'
sources:
  - 'NCERT Class 8 Mathematics (Ganita Prakash), Chapter 2 “Power Play” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Sizes in the powers-of-10 figure: proton about 10⁻¹⁵ m, atom about 10⁻¹⁰ m, Earth diameter about 1.3 × 10⁷ m, Sun diameter 1.4 × 10⁹ m, Earth–Sun 1.5 × 10¹¹ m, light-year 9.46 × 10¹⁵ m, Milky Way about 10²¹ m, visible universe about 10²⁶ m (rounded; standard astronomy values).'
---

**Maths · Class 8 · Chapter 2 · about 55 minutes.** By the end you will be able to read and write powers, use the laws of exponents, handle zero and negative powers, and write very big and very small numbers in standard form.

<div class="bigidea">A power is a short way to say “multiply by the same number again and again”. Once you see that, the laws of exponents are just about counting how many copies there are.</div>

## 1. Powers grow faster than you think

When we multiply a number by itself many times we write it as a **power**. `$2^5 = 2 \times 2 \times 2 \times 2 \times 2 = 32$`. The number 2 is the **base** and 5 is the **exponent** (or power). The exponent counts how many copies of the base are multiplied.

Powers explode. Take a sheet of paper and fold it in half. It has 2 layers. Fold again: 4. Again: 8. Each fold doubles the layers and the thickness. Slide the folds below to see how soon the stack passes a person, a mountain and the Moon.

<figure class="fig" data-fig="c8-pow-fold"><figcaption>Paper 0.1 mm thick, folded n times. The picture on the left shows the layers; the bar on the right is the height on a log scale (each tick is much taller than the one before). Go to 42 folds.</figcaption></figure>

In a famous story, a clever minister asks a king for a chessboard of rice: 1 grain on the first square, 2 on the second, 4 on the third, doubling each time. It sounds small. Move along the board to see why the king could never pay.

<figure class="fig" data-fig="c8-pow-chess"><figcaption>Square k holds 2^(k − 1) grains, so the first k squares hold 2^k − 1 in all. The readout turns the grains into tonnes of rice.</figcaption></figure>

By square 64 the total is 2⁶⁴ − 1 grains, about 1.8 × 10¹⁹. That is more rice than the whole world grows in several hundred years. Doubling beats adding by a huge margin; here is a race between adding ₹100 a day and doubling from ₹1.

<figure class="fig" data-fig="c8-pow-race"><figcaption>Plan A adds 100 each day. Plan B starts at 1 and doubles. Press Play, or slide the days: when does B pass A, and how far does it go by day 30?</figcaption></figure>

The [doubling power tool](/learn/doubling-power/) lets you test other starting numbers and growth rates.

## 2. Laws of exponents

We often meet products such as 2³ × 2⁴. Write them out as copies: (2 × 2 × 2) × (2 × 2 × 2 × 2) = seven 2’s, which is 2⁷. That one idea gives all the laws. For a non-zero number a and whole numbers m and n:

1. **Product law**: `$a^m \times a^n = a^{m+n}$` (same base, add the powers).
2. **Quotient law**: `$a^m \div a^n = a^{m-n}$` (same base, subtract the powers).
3. **Power of a power**: `$(a^m)^n = a^{mn}$` (multiply the powers).
4. **Same power, different bases**: `$a^n \times b^n = (ab)^n$` and `$a^n \div b^n = (a/b)^n$`.

<div class="meaning">
<dl>
<dt>a^m</dt><dd>m copies of a multiplied together.</dd>
<dt>m + n</dt><dd>joining a row of m copies and a row of n copies gives m + n copies.</dd>
<dt>m − n</dt><dd>cancelling n copies from the top and bottom of a fraction leaves m − n.</dd>
<dt>Physical meaning</dt><dd>exponents count repeated multiplications, just as multiplication counts repeated addition.</dd>
</dl>
</div>

Choose a law below and move m and n. The blocks show the copies being joined, cancelled or grouped.

<figure class="fig" data-fig="c8-pow-laws"><figcaption>Each block is one copy of a. Product law joins two rows, quotient law cancels blocks, and power of a power makes n groups of m blocks.</figcaption></figure>

<div class="problem" data-problem="c8m-pow-combine"></div>

Law 4 is handy for mental maths. 2⁵ × 5⁵ = (2 × 5)⁵ = 10⁵ = 100 000. And (6/3)⁴ = 2⁴ = 16 saves a lot of work.

<div class="problem" data-problem="c8m-pow-tens"></div>

<div class="myth">

**“2³ × 3² = 6⁵.”** The product law needs the **same base**. 2³ × 3² = 8 × 9 = 72, but 6⁵ = 7776. When the bases differ you cannot add the powers, unless the powers are the same and you multiply the bases (law 4).

</div>

Try the laws yourself in the exponent laws tool.

<!--fig:tool exponent-laws-->

## 3. Zero and negative powers

What is 2⁰? Not zero, and not 2. Look at the pattern. Going down the powers of 2, each step divides by 2. The pattern tells us what the next ones must be.

<div class="steps" data-fig="c8-pow-neg">
<div class="step">Start at 2⁴ = 16.</div>
<div class="step">One step down in the power divides the answer by 2: 2³ = 8.</div>
<div class="step">2² = 4.</div>
<div class="step">2¹ = 2.</div>
<div class="step">2⁰ = 1. Every non-zero number to the power 0 is 1.</div>
<div class="step">2⁻¹ = 1/2.</div>
<div class="step">2⁻² = 1/4 = 1/2².</div>
<div class="step">2⁻³ = 1/8 = 1/2³. So a negative power means “one over the power”: `$a^{-n} = 1/a^n$`.</div>
</div>

So `$a^0 = 1$` and `$a^{-n} = \dfrac{1}{a^n}$`. A negative power is not a negative number: 2⁻³ is 1/8, which is positive. It turns the power upside down, so `$(a/b)^{-n} = (b/a)^n$`. All the laws above still work with zero and negative powers: 2⁵ × 2⁻² = 2³ = 8.

<div class="problem" data-problem="c8m-pow-negexp"></div>

<div class="myth">

**“2⁻³ = −8.”** The minus sign in the power does not make the answer negative. 2⁻³ = 1/2³ = 1/8. The answer is small and positive.

</div>

## 4. Powers of 10 and standard form

Powers of 10 are special because our number system is based on ten. 10² = 100, 10³ = 1000, 10⁶ is 10 lakh, and 10⁷ is 1 crore. Going the other way, 10⁻¹ = 0.1 and 10⁻³ = 0.001. The exponent tells how many zeros (after the point for negative powers). Zoom along the powers of 10 from a proton to the whole universe.

<figure class="fig" data-fig="c8-pow-zoom"><figcaption>Each step to the right is 10 times bigger. Slide the exponent or press Play. The nearest real object is shown for each power, from a proton at 10⁻¹⁵ m to the visible universe at 10²⁶ m.</figcaption></figure>

Scientists write very big and very small numbers in **standard form** (scientific notation): a number between 1 and 10 times a power of 10, `$d \times 10^k$` with `$1 \le d < 10$`. For example 149 600 000 km is 1.496 × 10⁸ km. And 0.00007 m is 7 × 10⁻⁵ m. The rule is to count how many places the decimal point moves: **left for a big number (positive power), right for a tiny one (negative power).**

<figure class="fig" data-fig="c8-pow-sci"><figcaption>Choose a number and slide the places moved. When exactly one non-zero digit sits before the point, you have the standard form.</figcaption></figure>

<div class="problem" data-problem="c8m-pow-big"></div>

<div class="problem" data-problem="c8m-pow-small"></div>

Why bother? Standard form makes comparing easy. Which is bigger: 3.2 × 10⁸ or 9.5 × 10⁷? Compare the powers first: 10⁸ beats 10⁷, so the first is bigger (32 crore against 9.5 crore). If the powers are equal, compare the front numbers. To add or subtract, first write both with the same power of 10: 3 × 10⁴ + 5 × 10³ = 30 × 10³ + 5 × 10³ = 35 × 10³ = 3.5 × 10⁴.

The standard form ladder tool lets you climb up and down a ladder of powers of 10; the [scientific notation formatter](/science/scientific-notation-formatter/) and the [log scale calculator](/science/log-scale-calculator/) are good for checking.

<!--fig:tool standard-form-ladder-->

<div class="problem" data-problem="c8m-pow-grow"></div>

<div class="history">

**Big numbers in India.** The Indian counting system has its own names: lakh (10⁵), crore (10⁷), arab (10⁹) and kharab (10¹¹). The Sanskrit text *Lalitavistara* lists number names going up to 10⁵³, and ancient Indian mathematicians happily worked with such big numbers. Standard form is the modern way to write them in a line.

</div>

<div class="keypoints">

- `$a^n$` means n copies of a multiplied; a is the base and n is the exponent.
- Laws: `$a^m a^n = a^{m+n}$`, `$a^m \div a^n = a^{m-n}$`, `$(a^m)^n = a^{mn}$`, `$a^n b^n = (ab)^n$`.
- `$a^0 = 1$` and `$a^{-n} = 1/a^n$`. A negative power is still positive.
- Standard form is `$d \times 10^k$` with d from 1 to 10 (not including 10). Move the decimal point left for big numbers, right for small ones.
- Doubling (2ⁿ) quickly outgrows adding.

</div>
