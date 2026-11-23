---
title: Sets
seoTitle: 'Sets Class 11 notes: subsets, Venn diagrams'
summary: 'Class 11 Sets with animations: set notation, subsets and power sets, intervals, Venn diagrams, union, intersection, complement, De Morgan laws and counting.'
minutes: 80
updated: 2026-11-23
quiz:
  - q: 'A set has 5 elements. How many subsets does it have?'
    choices: ['32', '25', '10', '31']
    ans: 0
    why: 'Each element is either in a subset or out of it: 2 choices each, so 2⁵ = 32. (31 is the number of proper subsets.)'
  - q: 'In a class, 30 students like tea, 20 like coffee and 10 like both. How many like tea or coffee?'
    choices: ['40', '50', '60', '30']
    ans: 0
    why: 'n(A ∪ B) = 30 + 20 − 10 = 40. Adding without subtracting the overlap counts the 10 twice.'
  - q: 'By De Morgan, (A ∪ B)′ equals:'
    choices: ['A′ ∩ B′', 'A′ ∪ B′', 'A ∩ B', '(A ∩ B)′']
    ans: 0
    why: 'Not in (A or B) means not in A and not in B, which is A′ ∩ B′.'
sources:
  - 'NCERT Class 11 Mathematics, Chapter 1 “Sets” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard set theory (e.g. Halmos, P. R., Naive Set Theory, Springer); every count and interval answer in the figures was recomputed in code.'
---

**Maths · Class 11 · Chapter 1 · about 80 minutes.** By the end you will be able to write a set in two ways, name its subsets, use intervals, draw and shade Venn diagrams for union, intersection, difference and complement, and count how many things lie in overlapping groups.

<div class="bigidea">A set is a collection of things with one clear rule: anything either belongs or does not. Once you have that, everything else is bookkeeping: pieces of a set (subsets), combining sets (union, intersection), the leftovers (difference, complement) and counting without counting twice. The whole of the rest of mathematics is built on this tidy idea.</div>

## 1. What is a set?

Your cricket team of eleven players is a set. The vowels of the English alphabet are a set. The even numbers are a set. A **set** is a well-defined collection of objects, "well-defined" meaning that for any object you can say for sure: it is in, or it is not. "The five best batters in India" is not a set, because people disagree. "The batters who have scored more than 50 centuries" is.

The objects are the **elements** (or members). We write `$a \in A$` for "a belongs to A" and `$a \notin A$` for "a does not belong to A". Sets are named with capital letters and their elements go inside curly brackets. Order does not matter and repeating an element changes nothing: {1, 2, 3} is the same set as {3, 2, 1, 1}.

Some number sets have fixed names: `$\mathbb{N}$` natural numbers 1, 2, 3, ...; `$\mathbb{Z}$` integers; `$\mathbb{Q}$` rational numbers; `$\mathbb{R}$` real numbers.

### 1.1 Two ways of writing a set

- **Roster (listing) form:** write every element, for example `$A = \{2, 4, 6, 8\}$`.
- **Set-builder form:** write the rule, for example `$A = \{x : x \text{ is an even natural number},\ x < 10\}$`. Read the colon as "such that".

Pick a rule and a limit below. The numbers that follow the rule light up, and both ways of writing the same set appear.

<figure class="fig" data-fig="c11m-sets-builder"><figcaption>One set, two ways of writing it. Change the rule or the limit: the set-builder form says the rule, the roster form lists the numbers that obey it.</figcaption></figure>

The roster form is easy for small sets. The set-builder form is the only way for big or infinite ones, such as all multiples of 3.

## 2. Kinds of sets

- The **empty set** `$\varnothing$` has no elements. For example `$\{x : x \in \mathbb{N},\ 1 < x < 2\}$` is empty because no natural number lies between 1 and 2.
- A **singleton** has exactly one element, like `$\{5\}$`.
- A **finite** set has a countable number of elements; its count is `$n(A)$`. An **infinite** set (like the natural numbers) never ends.
- Two sets are **equal**, `$A = B$`, when they have exactly the same elements.

<div class="myth">

**"{0} is the empty set."** No. `$\{0\}$` has one element, the number zero. And `$\{\varnothing\}$` is not empty either: it holds one element, which is the empty set (a box containing an empty box is not an empty box).

</div>

## 3. Subsets and the power set

`$A$` is a **subset** of `$B$`, written `$A \subseteq B$`, when every element of A is also in B. If B also has something that A does not have, we say A is a **proper subset**, `$A \subset B$`. Two facts are used constantly: every set is a subset of itself, and the empty set is a subset of every set (there is no element of ∅ that could fail to be in B).

The **power set** `$P(A)$` is the set of all the subsets of A. How big is it? Build a subset by asking about each element, "in or out?". That is two choices per element, so a set with `$n$` elements has `$2^n$` subsets. Tap the letters below to build a subset and see all the others listed; change n to see the count double each time.

<figure class="fig" data-fig="c11m-sets-subsets"><figcaption>Every subset of {a, b, c, ...} is one in/out choice per letter, which is a binary number. With n elements there are 2ⁿ subsets, 2ⁿ − 1 of them proper.</figcaption></figure>

<!--fig:tool power-set-->

<div class="meaning">
<dl>
<dt>`$A \subseteq B$`</dt><dd>every element of A is in B (A may equal B).</dd>
<dt>`$A \subset B$`</dt><dd>A is a proper subset: A is inside B and B has extra elements.</dd>
<dt>`$n(P(A)) = 2^n$`</dt><dd>`$n$` is the number of elements of A.</dd>
<dt>`$\in$` and `$\subset$`</dt><dd>`$\in$` links an element to a set; `$\subset$` links a set to a set. `$2 \in A$` but `$\{2\} \subset A$`.</dd>
</dl>
</div>

<div class="problem" data-problem="c11m-sets-contain"></div>

## 4. Intervals

Subsets of the real numbers that are unbroken stretches of the number line are called **intervals**. A square bracket includes the end point (closed), a round bracket leaves it out (open):

- `$[a, b]$` = all x with `$a \le x \le b$`; `$(a, b)$` = all x with `$a < x < b$`;
- `$[a, b)$` and `$(a, b]$` have one end in and one out;
- `$[a, \infty)$` goes on for ever to the right. The symbol ∞ is not a number, so its bracket is always round.

Drag the end points of A and B, choose how each end is drawn, and pick an operation. The answer is written as an interval below. Notice how an open end can make an end point disappear from an intersection.

<figure class="fig" data-fig="c11m-sets-intervals"><figcaption>Two intervals A and B and their union, intersection or difference on the number line. Filled dot = included end, hollow dot = excluded.</figcaption></figure>

<div class="problem" data-problem="c11m-sets-interval"></div>

## 5. Universal set and Venn diagrams

For any question we pick a **universal set** `$U$` that contains everything we talk about (for example all students in a school). Every other set in the question is a subset of U. A **Venn diagram** draws U as a rectangle and sets as circles inside it. The elements in each region are the elements with that membership.

## 6. Operations on sets

For the sets A = {1, ..., 7} and B = {5, ..., 10} in the figure below (U = {1, ..., 12}), choose an operation and watch the region light up.

<figure class="fig" data-fig="c11m-sets-venn"><figcaption>Choose an operation: the shaded region and the list of its elements update. Compare A − B with B − A, and A′ with B′.</figcaption></figure>

- **Union** `$A \cup B$`: elements in A **or** B (or both).
- **Intersection** `$A \cap B$`: elements in **both**. If `$A \cap B = \varnothing$` the sets are **disjoint**.
- **Difference** `$A - B$`: in A but **not** in B. Note `$A - B \ne B - A$`.
- **Complement** `$A'$`: in U but not in A; so `$A' = U - A$` and `$(A')' = A$`.
- **Symmetric difference** `$A \triangle B$`: in exactly one of the two, `$(A - B) \cup (B - A)$` (a handy extension).

Some facts you will use all the time: `$A \cup A' = U$`, `$A \cap A' = \varnothing$`, `$A \cup B = B \cup A$`, `$A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$`, and `$A \cup \varnothing = A$`.

<!--fig:tool venn-diagram-->

For three sets, the circles cut U into eight regions. Pick a combination to light up its regions and add the counts.

<figure class="fig" data-fig="c11m-sets-three"><figcaption>Three sets, eight regions. Each combination is a different collection of regions; the readout adds the counts inside it.</figcaption></figure>

### 6.1 De Morgan's laws

Two laws tell you how a complement passes through a union or an intersection:

```math
(A \cup B)' = A' \cap B' \qquad\qquad (A \cap B)' = A' \cup B'
```

In words: not (A or B) means not A **and** not B. Watch the first law build up step by step.

<div class="steps" data-fig="c11m-sets-demorgan">
<div class="step">Left picture: shade A ∪ B, everything in A or in B.</div>
<div class="step">Now shade the complement (A ∪ B)′: everything outside both circles.</div>
<div class="step">Right picture: shade A′, everything outside circle A.</div>
<div class="step">Also shade B′, everything outside circle B (a different colour). Where the colours overlap is outside both.</div>
<div class="step">Keep only the overlap: A′ ∩ B′ = outside both circles.</div>
<div class="step">The two pictures match. So (A ∪ B)′ = A′ ∩ B′. The second law works the same way.</div>
</div>

<div class="myth">

**"(A ∪ B)′ = A′ ∪ B′."** This is the most common slip. When the complement passes through, **the symbol flips**: union becomes intersection and intersection becomes union. A quick check: take A and B as two overlapping circles and shade both sides.

</div>

## 7. Counting with sets

When groups overlap, adding the sizes counts the overlap twice. The fix is the **counting rule**:

```math
n(A \cup B) = n(A) + n(B) - n(A \cap B)
```

Drag the three sliders to change how many people like only chai, both, or only coffee. See the overlap counted twice and then taken away once.

<figure class="fig" data-fig="c11m-sets-count"><figcaption>n(A) + n(B) counts the overlap twice; subtracting n(A ∩ B) once gives the true count n(A ∪ B). What is left of the 60 students likes neither.</figcaption></figure>

Now a full worked example, one step at a time.

<div class="steps" data-fig="c11m-sets-survey">
<div class="step">A class of 60: 35 like chai (A), 28 like coffee (B), 12 like both. How many like at least one, and how many neither?</div>
<div class="step">n(A) = 35 for chai lovers.</div>
<div class="step">n(B) = 28 for coffee lovers. Adding gives 63, which is more than 60 students: something was counted twice.</div>
<div class="step">The 12 who like both are inside both counts. Subtract them once.</div>
<div class="step">n(A ∪ B) = 35 + 28 − 12 = 51. Only chai 23, both 12, only coffee 16.</div>
<div class="step">Neither: 60 − 51 = 9 students.</div>
</div>

<div class="problem" data-problem="c11m-sets-neither"></div>

For three sets the rule gains terms: subtract each overlap of two and add back the overlap of all three, because that was removed once too often:

```math
n(A \cup B \cup C) = n(A) + n(B) + n(C) - n(A \cap B) - n(B \cap C) - n(C \cap A) + n(A \cap B \cap C)
```

<div class="problem" data-problem="c11m-sets-three"></div>

<div class="problem" data-problem="c11m-sets-multiples"></div>

<div class="problem" data-problem="c11m-sets-symdiff"></div>

<div class="history">

- **1847:** Augustus De Morgan, born in Madurai, India, states the laws that carry his name.
- **1874:** Georg Cantor publishes the first theory of sets and shows that some infinities are bigger than others.
- **1880:** John Venn introduces his circle diagrams for logic (Euler had used something similar a century earlier).
- **Today:** every database query that says AND, OR or NOT is a set operation (intersection, union, complement).

</div>

<div class="keypoints">

- A set is a well-defined collection; order and repeats do not matter. Two forms: roster and set-builder.
- ∅ is the empty set; `{0}` and `{∅}` are not empty. ∅ is a subset of every set; every set is a subset of itself.
- A set with n elements has 2ⁿ subsets (2ⁿ − 1 proper).
- Intervals: square bracket includes the end, round excludes it, ∞ always gets a round bracket.
- Union (or), intersection (and), difference A − B, complement A′ = U − A. A − B ≠ B − A.
- De Morgan: (A ∪ B)′ = A′ ∩ B′ and (A ∩ B)′ = A′ ∪ B′.
- n(A ∪ B) = n(A) + n(B) − n(A ∩ B); for three sets add back the triple overlap.

</div>

Going further for JEE/NEET: [Sets, relations and functions](/learn/courses/engineering-entrance/sets-relations-functions/) has the exam-level counting and De Morgan problems.
