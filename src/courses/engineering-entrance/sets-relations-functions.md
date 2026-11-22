---
title: 'Sets, relations and functions'
seoTitle: 'Sets, relations and functions: JEE maths explained'
summary: 'Sets and Venn diagrams, counting with inclusion and exclusion, relations and equivalence relations, functions and their domain and range, one-one and onto maps and how to count them, composition and inverse, and the special functions JEE loves: modulus, greatest integer, fractional part and signum.'
minutes: 34
updated: 2026-11-22
quiz:
  - q: 'How many functions are there from a set with 3 elements to a set with 4 elements?'
    choices: ['12', '24', '64', '81']
    ans: 2
    why: 'Each of the 3 elements can go to any of 4: 4 × 4 × 4 = 4³ = 64. (81 = 3⁴ counts the other direction.)'
  - q: 'A relation on {1, 2, 3} is {(1,1), (2,2), (3,3), (1,2)}. It is:'
    choices: ['reflexive and symmetric', 'reflexive and transitive, not symmetric', 'an equivalence relation', 'symmetric only']
    ans: 1
    why: 'All (a, a) are there: reflexive. (1,2) is there but (2,1) is not: not symmetric. No chain breaks transitivity: (1,1),(1,2) gives (1,2), which is there. So reflexive and transitive.'
  - q: 'The range of f(x) = x − [x] (fractional part) is:'
    choices: ['[0, 1]', '[0, 1)', '(0, 1)', 'all real numbers']
    ans: 1
    why: 'x − [x] is 0 at integers and grows towards 1 but never reaches it, then drops back to 0. So the range is [0, 1).'
sources:
  - 'NCERT Mathematics Class 11 (Sets; Relations and functions) and Class 12 (Relations and functions): topics followed, no text copied'
  - 'JEE Main and JEE Advanced 2026 syllabi: Sets, relations and functions'
---

**Maths · Class 11 and 12 · about 34 minutes.** By the end you will be able to count with Venn diagrams, test a relation for every property, find the domain and range of any function, count one-one and onto maps, and handle the greatest-integer and fractional-part functions.

<div class="bigidea">A set is a collection, a relation pairs elements of sets, and a function is a relation that gives every input exactly one output. Most of this chapter is careful counting and careful checking of definitions.</div>

## 1. Sets and Venn diagrams

A **set** is a well-defined collection. Write it as a list `{1, 2, 3}` or by a rule `{x : x is a prime less than 10}`. The **empty set** ∅ has no elements; a set with n elements has **2ⁿ subsets** (its power set) and 2ⁿ − 1 proper subsets.

Operations: union A ∪ B, intersection A ∩ B, difference A − B (in A, not in B), complement A′ (in the universal set, not in A). **De Morgan's laws:** (A ∪ B)′ = A′ ∩ B′ and (A ∩ B)′ = A′ ∪ B′.

**Counting (inclusion and exclusion):**

```math
n(A \cup B) = n(A) + n(B) - n(A \cap B)
```

```math
n(A \cup B \cup C) = \sum n(A) - \sum n(A \cap B) + n(A \cap B \cap C)
```

<div class="meaning">
<dl>
<dt>n(A)</dt><dd>number of elements in A</dd>
<dt>Inclusion-exclusion</dt><dd>add the singles, subtract the doubles, add back the triples</dd>
<dt>Physical meaning</dt><dd>Adding n(A) and n(B) counts the overlap twice; subtracting it once fixes the count. Every overlap problem is this idea repeated.</dd>
</dl>
</div>

## 2. Relations

A **relation** from A to B is any subset of A × B. With n(A) = m and n(B) = n there are m·n ordered pairs, so **2^(mn) relations**. A relation on A (from A to A) can be:

| Property | Means | Test |
|---|---|---|
| Reflexive | (a, a) for every a in A | all diagonal pairs present |
| Symmetric | (a, b) ⇒ (b, a) | every pair has its mirror |
| Transitive | (a, b) and (b, c) ⇒ (a, c) | every two-step chain closes |
| Equivalence | all three | splits A into disjoint classes |

<div class="myth">

**"A relation with no pairs fails every test."** The empty relation on a non-empty set is not reflexive, but it is symmetric and transitive, because there is no pair that could break those rules. Exams test this edge case.

</div>

## 3. Functions

A **function** f: A → B gives each element of A (the **domain**) exactly one element of B (the **codomain**); the outputs actually used form the **range**.

Play with arrow diagrams. The counts under the picture are the formulas you need:

<figure class="fig" data-fig="function-map"><figcaption>Functions from A to B: each element of A sends exactly one arrow. One-one: no two arrows meet. Onto: every element of B receives an arrow.</figcaption></figure>

| From m elements to n elements | Number |
|---|---|
| All functions | `$n^m$` |
| One-one (needs m ≤ n) | `$n(n-1)\cdots(n-m+1) = \dfrac{n!}{(n-m)!}$` |
| Onto (needs m ≥ n) | `$\sum_{k=0}^{n} (-1)^k \binom{n}{k} (n-k)^m$` |
| One-one and onto (m = n) | `$n!$` |

<div class="problem" data-problem="count-onto"></div>

**Domain and range: a routine.** For the domain, remove what breaks the formula: zero denominators, negative numbers under even roots, non-positive arguments of log, values outside [−1, 1] for sin⁻¹ and cos⁻¹. For the range, write y = f(x), solve for x, and ask which y give a valid x in the domain (or use the graph, or calculus for maxima and minima).

## 4. Composition and inverse

`$(g \circ f)(x) = g(f(x))$`: first f, then g. It is usually **not** commutative. f has an **inverse** only if it is one-one and onto (a bijection); then `$f^{-1}(f(x)) = x$`, and the graph of f⁻¹ is the mirror image of f in the line y = x.

<div class="steps">
<div class="step"><b>Find an inverse.</b> f(x) = (2x + 3)/(x − 1), x ≠ 1. Write y = (2x + 3)/(x − 1).</div>
<div class="step"><b>Solve for x.</b> y(x − 1) = 2x + 3 ⇒ x(y − 2) = y + 3 ⇒ x = (y + 3)/(y − 2).</div>
<div class="step"><b>Swap names.</b> f⁻¹(x) = (x + 3)/(x − 2), with x ≠ 2: so the range of f is all reals except 2.</div>
</div>

## 5. Special functions

| Function | Definition | Graph and range |
|---|---|---|
| Modulus \|x\| | x if x ≥ 0, −x if x < 0 | V shape; range [0, ∞) |
| Greatest integer [x] | largest integer ≤ x ([2.7] = 2, [−2.3] = −3) | steps; range all integers |
| Fractional part {x} | x − [x] | saw teeth; range [0, 1) |
| Signum sgn x | 1, 0 or −1 as x is positive, zero or negative | three pieces; range {−1, 0, 1} |

Useful facts: `$[x + n] = [x] + n$` for integer n; `$[x] + [-x] = 0$` if x is an integer, −1 otherwise; `$\{x\}$` has period 1. **Even** functions satisfy f(−x) = f(x) (graph symmetric about the y-axis), **odd** ones f(−x) = −f(x) (symmetric about the origin). Every function is the sum of an even and an odd part.

<div class="keypoints">

- A set with n elements has 2ⁿ subsets; n(A ∪ B) = n(A) + n(B) − n(A ∩ B), and the three-set version.
- Relations from A to B: 2^(mn). Check reflexive, symmetric, transitive one at a time; equivalence = all three.
- Functions m → n: nᵐ in all, n!/(n − m)! one-one, Σ(−1)ᵏC(n, k)(n − k)ᵐ onto, n! bijections.
- Domain: remove zero denominators, negatives under even roots, non-positive log arguments.
- Only bijections have inverses; the inverse graph is the mirror in y = x.
- [x] floors (also for negatives: [−2.3] = −3); {x} = x − [x] lies in [0, 1).

</div>
