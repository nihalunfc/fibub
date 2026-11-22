---
title: 'Predicting What Comes Next: Exploring Sequences and Progressions'
seoTitle: 'Sequences and AP Class 9 notes: nth term, patterns'
summary: 'Class 9 Sequences with animations: patterns, rules, figurate numbers, arithmetic progressions, the nth term and a first look at geometric growth.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'The 12th term of the AP 4, 7, 10, 13, ... is:'
    choices: ['37', '40', '34', '36']
    ans: 0
    why: 'a = 4, d = 3. The 12th term is a + 11d = 4 + 33 = 37.'
  - q: 'Which of these is NOT an arithmetic progression?'
    choices: ['2, 4, 8, 16, ...', '5, 8, 11, 14, ...', '20, 15, 10, 5, ...', '1.5, 2, 2.5, 3, ...']
    ans: 0
    why: 'The differences in 2, 4, 8, 16 are 2, 4, 8: not constant. (Each term is double the one before: that is geometric growth.)'
  - q: 'How many dots are in the 8th triangular pattern 1, 3, 6, 10, ...?'
    choices: ['36', '28', '64', '45']
    ans: 0
    why: 'Triangular number n is n(n + 1) ÷ 2. For n = 8: 8 × 9 ÷ 2 = 36.'
sources:
  - 'NCERT Class 9 Mathematics (Ganita Manjari), Chapter 8 “Predicting What Comes Next: Exploring Sequences and Progressions” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard school mathematics: sequences, arithmetic progressions, figurate numbers, and the pairing method for summing an AP (attributed by tradition to the schoolboy Carl Friedrich Gauss, a look ahead to Class 10). The sum section is beyond the Class 9 syllabus.'
---

**Maths · Class 9 · Chapter 8 · about 55 minutes.** By the end you will be able to continue a pattern and write its rule, recognise an arithmetic progression, find any term of it without writing all the terms before, see why dot patterns give triangular and square numbers, and tell steady adding from fast doubling.

<div class="bigidea">A sequence is a list of numbers that follows a rule. If you can find the rule, you can predict what comes next and also the 100th term without listing 99 others. The simplest rule is “add the same number every time”: an arithmetic progression. A faster rule is “multiply by the same number every time”.</div>

## 1. Patterns and sequences

Count the matchsticks it takes to make a row of triangles: 1 triangle needs 3 sticks, 2 triangles need 5, 3 need 7. The numbers 3, 5, 7, ... make a **sequence**: an ordered list of numbers, called **terms**, one after another. We write the terms as `$a_1, a_2, a_3, \dots$` with `$a_1$` the first term, `$a_2$` the second, and `$a_n$` the nth term (the term in position `$n$`).

Build the matchstick patterns yourself and see the sequence appear:

<figure class="fig" data-fig="c9-seq-sticks"><figcaption>Add one more shape: how many extra sticks do you need? For triangles it is 2 every time and for squares 3. The count of sticks is therefore 3, 5, 7, ... or 4, 7, 10, ... and the rule is a formula in n: 2n + 1 or 3n + 1.</figcaption></figure>

A **rule** tells you how to get each term. There are two usual kinds of rule:

- A **recursive** rule says how to get the next term from the one before: “add 2 to the previous term”.
- A **position** rule gives the term straight from its position n: “the nth term is 2n + 1”.

The position rule is more powerful, because for n = 100 it gives the 100th term at once: 2 × 100 + 1 = 201 sticks for 100 triangles.

<div class="problem" data-problem="c9m-seq-sticks"></div>

<div class="myth">

**“The pattern 2, 4, 8 must continue 16.”** It could also be 2, 4, 8, 14, 22 (add 2, then 4, then 6...). A few terms can fit more than one rule. To be sure of the rule we need to know *why* the pattern grows the way it does: for the matchsticks we know exactly that each new triangle adds 2 sticks.

</div>

## 2. Finding the rule: look at the differences

How do you work out the rule of a sequence you have not seen before? Look at how the terms change.

- Subtract each term from the next one: if the **differences** are all the same, you have an arithmetic progression.
- Divide each term by the one before: if the **ratios** are all the same, you have a geometric progression.
- If neither is constant, look at the differences of the differences, or try other ideas (squares, adding the two terms before).

Choose a sequence and switch on the differences and ratios:

<figure class="fig" data-fig="c9-seq-diff"><figcaption>For 2, 5, 8, 11 the difference is always 3 (an AP). For 3, 6, 12, 24 the ratio is always 2 (geometric). For the squares 1, 4, 9, 16 the differences are 3, 5, 7: not constant, but they climb steadily. The last sequence adds the two terms before it, 1, 1, 2, 3, 5, 8: the Fibonacci numbers, which you can find in the spirals of a sunflower.</figcaption></figure>

## 3. Dot patterns: figurate numbers

Some of the oldest sequences come from arranging dots in shapes. These are the **figurate numbers**.

**Triangular numbers.** Stack rows of 1, 2, 3, ... dots. The totals 1, 3, 6, 10, 15, ... are triangular numbers. Each new pattern adds one more row, so the pattern number n adds n dots. **Square numbers.** An n by n square of dots has n × n dots: 1, 4, 9, 16, ... **Oblong numbers.** n rows of n + 1 dots: 2, 6, 12, 20, ...

<figure class="fig" data-fig="c9-seq-dots"><figcaption>Drag the pattern number n, or press Play, and watch each shape grow. The green dots are the ones added to make the new pattern. Look at the sequence above the picture: spot the rule for each shape.</figcaption></figure>

Is there a shortcut for the nth triangular number? Put two copies of the triangle together:

<div class="steps" data-fig="c9-seq-trirect">
<div class="step">A triangle of dots with 5 rows: 1 + 2 + 3 + 4 + 5 dots. How many are there altogether?</div>
<div class="step">Make a second copy of the triangle.</div>
<div class="step">Turn the copy upside down.</div>
<div class="step">Fit the two triangles together. They make a perfect rectangle: 5 rows of 6 dots.</div>
<div class="step">The rectangle has 5 × 6 = 30 dots, and our triangle is half of it: 15 dots.</div>
<div class="step">In general, the nth triangular number is n(n + 1) ÷ 2. For 10 rows: 10 × 11 ÷ 2 = 55.</div>
</div>

```math
T_n = 1 + 2 + 3 + \dots + n = \frac{n(n+1)}{2}
```

<div class="problem" data-problem="c9m-seq-figurate"></div>

**A surprise.** Add the odd numbers: 1, then 1 + 3 = 4, then 1 + 3 + 5 = 9, then 1 + 3 + 5 + 7 = 16. You get the square numbers! Each new odd number is an L-shaped layer that wraps round the square you already have.

<figure class="fig" data-fig="c9-seq-odd"><figcaption>Every layer of dots is the next odd number: 1, 3, 5, 7, ... The layers fit together into a square, so the sum of the first n odd numbers is n × n.</figcaption></figure>

## 4. Arithmetic progressions (APs)

A sequence in which every term is found by **adding the same fixed number** to the one before is an **arithmetic progression**, or AP. That fixed number is the **common difference**, `$d$`. The first term is `$a$`.

- 3, 7, 11, 15, ... is an AP with a = 3, d = 4.
- 20, 17, 14, 11, ... is an AP with a = 20 and d = −3 (it goes down).
- 5, 5, 5, 5, ... is an AP with d = 0.
- 1, 2, 4, 8, ... is **not** an AP: the differences 1, 2, 4 are not all the same.

Picture an AP as a staircase: every step is the same amount higher (or lower) than the last. Change the first term and the common difference, and climb.

<figure class="fig" data-fig="c9-seq-stairs"><figcaption>Each bar is a term. The steps rise by d each time. Choose which term to highlight and read its value. With a negative d the staircase comes down.</figcaption></figure>

### The nth term of an AP

How tall is the 20th step? You do not have to climb 19 steps. Start at a and add d once for each step you climb. To reach term n you climb (n − 1) steps:

```math
a_n = a + (n - 1)\,d
```

<div class="meaning">
<dl>
<dt>a</dt><dd>the first term of the AP.</dd>
<dt>d</dt><dd>the common difference: any term minus the term before it.</dd>
<dt>n</dt><dd>the position of the term we want (1 for the first, 2 for the second ...).</dd>
<dt>aₙ</dt><dd>the nth term.</dd>
<dt>Physical meaning</dt><dd>to reach the nth step you start on the first step and climb (n − 1) times by d. The number of climbs is one less than the position, because you are already standing on step 1.</dd>
</dl>
</div>

<div class="steps" data-fig="c9-seq-apsteps">
<div class="step">The sequence 3, 7, 11, 15, ... goes up by the same amount each time.</div>
<div class="step">Common difference: 7 − 3 = 4, and 11 − 7 = 4, and 15 − 11 = 4. It is constant, so this is an AP with d = 4.</div>
<div class="step">Build the terms: a₁ = 3, a₂ = 3 + 4, a₃ = 3 + 2 × 4, a₄ = 3 + 3 × 4.</div>
<div class="step">Spot the pattern: the nth term has (n − 1) fours added. So aₙ = a + (n − 1)d.</div>
<div class="step">Here aₙ = 3 + (n − 1) × 4 = 4n − 1. Check with n = 4: 15. ✓</div>
<div class="step">The 20th term: a₂₀ = 3 + 19 × 4 = 79. No need to list 20 terms.</div>
</div>

<div class="myth">

**“The 10th term is a + 10d.”** It is a + 9d. The first term has no d added at all. Always check with n = 1: the formula must give a, and a + (1 − 1)d = a. ✓

</div>

<div class="problem" data-problem="c9m-seq-nth"></div>

We can also use the formula backwards. To find which term of 4, 9, 14, ... equals 99, write 4 + (n − 1) × 5 = 99. That gives (n − 1) × 5 = 95, n − 1 = 19, and n = 20. The number 99 is the 20th term. If the answer for n is not a whole number, or is negative, the number is not in the AP.

<div class="problem" data-problem="c9m-seq-which"></div>

**Graph of an AP.** Plot term against position. Equal steps along n give equal changes in height, so the points lie on a straight line whose slope is d. Compare with a geometric sequence, where the points curve upwards:

<figure class="fig" data-fig="c9-seq-graph"><figcaption>Flip between an AP and a geometric progression. The AP points lie exactly on a line: the steeper the line, the bigger d. The geometric points curve upwards faster and faster.</figcaption></figure>

Explore more APs with the explorer: set a and d, see the terms, graph and the nth term:

<!--fig:tool ap-explorer-->

### APs in daily life

APs are everywhere that something grows by a fixed amount each time. A taxi charging ₹50 to start and ₹12 per kilometre: fares for 1, 2, 3 km are 62, 74, 86, ... an AP with a = 62 and d = 12. A tank filling at 5 litres a minute: 5, 10, 15, ... An auto-rickshaw driver’s daily saving that goes up by ₹20 each day. The seats in a theatre where each row has 2 more seats than the one in front: 20, 22, 24, ...

## 5. A look ahead: the sum of an AP (beyond Class 9)

*This section goes beyond the Class 9 syllabus; you will study it in Class 10. It is here because it shows a lovely use of the pairing idea.*

How much have you saved if you put ₹1 in a box on day 1, ₹2 on day 2, and so on up to ₹10 on day 10? That is 1 + 2 + ... + 10. A famous story says that the young Carl Friedrich Gauss found the answer in seconds by pairing the numbers:

<div class="steps" data-fig="c9-seq-gauss">
<div class="step">Add 1 + 2 + 3 + ... + 10. Adding one by one is slow. Is there a quicker way?</div>
<div class="step">Write the numbers again underneath, but backwards: 10, 9, 8, ..., 1.</div>
<div class="step">Add each column: 1 + 10, 2 + 9, 3 + 8, ... Every pair makes 11.</div>
<div class="step">There are 10 columns, each 11. Together that is 10 × 11 = 110.</div>
<div class="step">We wrote the list twice, so 110 counts every number twice. The sum is 110 ÷ 2 = 55.</div>
<div class="step">Any AP works this way: sum = n ÷ 2 × (first term + last term). Here 10 ÷ 2 × (1 + 10) = 55.</div>
</div>

```math
S_n = \frac{n}{2}\,(a + l), \qquad l = \text{the last term}
```

<div class="problem" data-problem="c9m-seq-sum"></div>

## 6. A first look at geometric growth

Not every pattern grows by adding. Suppose a rumour starts with one person. The next day that person tells 2 friends. The day after, each of those 2 tells 2 more, and so on. The number of *new* people who hear the rumour each day is 1, 2, 4, 8, 16, 32, ... Each term is **2 times** the one before. We multiply instead of add, and the fixed multiplier is called the **common ratio**, `$r$`. This is a **geometric progression**, and its nth term is `$a \times r^{\,n-1}$`.

<figure class="fig" data-fig="c9-seq-double"><figcaption>The rumour tree. Day by day the number of new listeners doubles (or triples). By day 5 with ratio 2 there are 32 new listeners, and by day 10 there would be 1,024. Switch to “3 people” and watch it grow even faster.</figcaption></figure>

Adding and multiplying behave very differently over time. Which would you rather have: ₹100 on day 1 with ₹100 more every day (an AP), or ₹1 on day 1 doubling every day? At first the first plan is far better. Race them:

<figure class="fig" data-fig="c9-seq-race"><figcaption>The blue line is Plan A (add ₹100 each day) and the green line is Plan B (double from ₹1). For the first 11 days A is ahead. On day 12 B overtakes: ₹2,048 against ₹1,200. By day 20 A has ₹2,000 and B has ₹524,288!</figcaption></figure>

<div class="problem" data-problem="c9m-seq-gp"></div>

<div class="problem" data-problem="c9m-seq-race"></div>

<div class="myth">

**“Doubling is just adding a bit more each day.”** The amount you add to a doubling sequence keeps growing: it adds 1, then 2, then 4, then 8, ... This is why folding a paper in half again and again gives a thick stack so quickly: 1, 2, 4, 8, ... layers, and 20 folds would give over a million layers.

</div>

Try your own sequences, AP, geometric and more, and see them as numbers and as graphs:

<!--fig:tool sequence-explorer-->

<div class="keypoints">

- A sequence is an ordered list of terms a₁, a₂, a₃, ... following a rule. A position rule gives the nth term from n directly.
- To find a rule, look at the differences (constant means an AP) and the ratios (constant means geometric).
- Figurate numbers come from dot patterns: triangular n(n + 1) ÷ 2, square n², oblong n(n + 1). The sum of the first n odd numbers is n².
- An arithmetic progression adds a common difference d each time: aₙ = a + (n − 1)d. Its graph is a straight line of slope d.
- To find which term equals a given number, put a + (n − 1)d equal to it and solve for n; n must be a whole number.
- (Class 10 look ahead) The sum of an AP is n ÷ 2 × (first + last).
- A geometric progression multiplies by a common ratio r each time and grows much faster than an AP in the long run.

</div>

Other tools to explore: [AP explorer](/learn/ap-explorer/) and [Sequence explorer](/learn/sequence-explorer/) work on their own too. Ready for exam-style questions? Go to [Predicting What Comes Next: practice questions](/learn/courses/ncert-class-9-maths/sequences-and-progressions-practice/).
