---
title: 'Sets, relations and functions: question types and traps'
seoTitle: 'Sets, relations and functions JEE questions: types and traps'
summary: 'Every way JEE, KEAM and COMEDK ask about sets, relations and functions: Venn counting, counting relations and functions, testing relation properties, domain and range, composition and inverse, greatest-integer and fractional-part functions, and functional equations, each with a method and its trap.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'The number of reflexive relations on a set with 3 elements is:'
    choices: ['8', '64', '512', '27']
    ans: 1
    why: 'The 3 diagonal pairs must be in; each of the other 9 − 3 = 6 pairs may or may not be: 2⁶ = 64. In general 2^(n² − n).'
  - q: 'The domain of f(x) = 1/√(x − [x]) is:'
    choices: ['all real numbers', 'all real numbers except integers', 'integers only', 'x > 0']
    ans: 1
    why: 'x − [x] = {x} must be positive (it is under a root in a denominator). {x} = 0 exactly at integers, so integers are excluded.'
  - q: 'If f(x) = 2x + 1 and g(x) = x², then (f∘g)(2) is:'
    choices: ['9', '25', '10', '5']
    ans: 0
    why: '(f∘g)(2) = f(g(2)) = f(4) = 9. (g∘f)(2) = g(5) = 25, a different answer: composition is not commutative.'
sources:
  - 'JEE Main and JEE Advanced 2026 syllabi: Sets, relations and functions; question patterns studied from published papers (no questions copied)'
---

**Maths · Class 11 and 12 · about 25 minutes.** Read [Sets, relations and functions](/learn/courses/engineering-entrance/sets-relations-functions/) first. Here are the question types, worked examples and practice.

<div class="bigidea">This chapter's questions are counting (sets, relations, functions) or checking (properties, domain, range). Both reward one habit: write out the definition and test it, instead of guessing from the look of the expression.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Venn counting.</b> Two or three sets with overlaps; "only A", "exactly two", "at least one". <i>Method:</i> fill the Venn regions from the centre outwards.</div>
<div class="step"><b>2. Counting relations.</b> All: 2^(mn); reflexive: 2^(n² − n); symmetric: 2^(n(n+1)/2); reflexive and symmetric: 2^(n(n−1)/2).</div>
<div class="step"><b>3. Testing properties.</b> Reflexive, symmetric, transitive, equivalence; equivalence classes. <i>Trap:</i> the empty relation and relations like "a divides b".</div>
<div class="step"><b>4. Counting functions.</b> nᵐ, one-one, onto (inclusion-exclusion), bijections, and functions with extra conditions (f(1) fixed, f(i) ≠ i).</div>
<div class="step"><b>5. Domain and range.</b> Roots, logs, fractions, inverse trig; range by solving for x or by the discriminant.</div>
<div class="step"><b>6. One-one, onto, inverse, composition.</b> <i>Method:</i> one-one if f(a) = f(b) forces a = b (or f is strictly monotonic); onto if range = codomain.</div>
<div class="step"><b>7. Special functions.</b> [x], {x}, |x|, sgn x: graphs, equations and periodicity.</div>
<div class="step"><b>8. Even, odd, periodic, functional equations.</b> f(x + y) = f(x) + f(y) and similar: substitute x = y = 0, y = −x, and so on.</div>
</div>

## Worked examples

**Example 1 (level 2, Venn).** In a class of 60, 35 take Physics, 30 Chemistry and 12 both. How many take neither? *Solution.* n(P ∪ C) = 35 + 30 − 12 = 53, so **7** take neither.

**Example 2 (level 3, counting functions).** How many onto functions are there from {1, 2, 3, 4} to {a, b, c}? *Solution.* 3⁴ − 3·2⁴ + 3·1⁴ = 81 − 48 + 3 = **36**.

**Example 3 (level 3, range).** Find the range of f(x) = x/(x² + 1). *Solution.* y(x² + 1) = x ⇒ yx² − x + y = 0. For real x (y ≠ 0): D = 1 − 4y² ≥ 0 ⇒ −½ ≤ y ≤ ½; y = 0 occurs at x = 0. **Range [−½, ½].**

**Example 4 (level 4, equivalence).** On ℤ, define a R b if a − b is divisible by 5. Is R an equivalence relation, and how many classes are there? *Solution.* a − a = 0 (reflexive); a − b divisible ⇒ b − a divisible (symmetric); a − b and b − c divisible ⇒ a − c divisible (transitive). Yes, with **5 classes** (remainders 0 to 4).

**Example 5 (level 5, functional equation).** f is continuous and f(x + y) = f(x) + f(y) for all real x, y, with f(1) = 3. Find f(x). *Solution.* x = y = 0 gives f(0) = 0; then f(n) = 3n for integers, f(p/q) = 3p/q for rationals, and continuity extends it: **f(x) = 3x**.

<div class="myth">

**"[−x] = −[x]."** Only for integers. [−2.3] = −3 but −[2.3] = −2. In general [x] + [−x] = −1 when x is not an integer.

</div>

<div class="meaning">
<dl>
<dt>One-one test</dt><dd>f(a) = f(b) ⇒ a = b, or f strictly increasing or decreasing</dd>
<dt>Onto test</dt><dd>range equals codomain</dd>
<dt>Physical meaning</dt><dd>A function is a machine with one output per input; one-one means no two inputs share an output, onto means every possible output is used.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-maths" data-topics="sets-relations-functions" data-mode="practice"></div>

<div class="keypoints">

- Venn questions: fill from the centre out; use inclusion-exclusion.
- Relations on n elements: 2^(n²) in all, 2^(n² − n) reflexive, 2^(n(n+1)/2) symmetric.
- Onto functions m → n: Σ(−1)ᵏC(n, k)(n − k)ᵐ.
- Range: solve for x and require it to be real (often a discriminant ≥ 0).
- [−x] = −[x] − 1 for non-integers; {x} has period 1.
- Functional equations: substitute 0, −x and equal values first.

</div>
