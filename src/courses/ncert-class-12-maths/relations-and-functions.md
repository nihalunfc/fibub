---
title: Relations and Functions
seoTitle: 'Relations and Functions Class 12 notes and examples'
summary: 'Class 12 Relations and Functions with animations: equivalence relations, one-one and onto, composition and inverse functions, with live problems.'
minutes: 75
updated: 2026-11-22
quiz:
  - q: 'On the integers, a ~ b means a − b is a multiple of 3. This relation is:'
    choices: ['an equivalence relation', 'reflexive only', 'symmetric but not transitive', 'transitive but not symmetric']
    ans: 0
    why: 'a − a = 0 is a multiple of 3 (reflexive); if 3 divides a − b it divides b − a (symmetric); if 3 divides a − b and b − c it divides their sum a − c (transitive).'
  - q: 'f(x) = x² from the real numbers to the real numbers is:'
    choices: ['neither one-one nor onto', 'one-one but not onto', 'onto but not one-one', 'bijective']
    ans: 0
    why: 'f(2) = f(−2) = 4, so it is not one-one, and no real x gives −1, so it is not onto.'
  - q: 'If f(x) = x + 2 and g(x) = 3x, then (g∘f)(1) is:'
    choices: ['9', '5', '3', '11']
    ans: 0
    why: 'g∘f means f first: f(1) = 3, then g(3) = 9. The other order, f(g(1)) = f(3) = 5, is different.'
sources:
  - 'NCERT Class 12 Mathematics, Chapter 1 “Relations and Functions” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard definitions of relations, equivalence classes and functions (set theory); every worked count was checked a second way in code.'
---

**Maths · Class 12 · Chapter 1 · about 75 minutes.** By the end you will be able to test a relation for reflexive, symmetric and transitive, recognise an equivalence relation and its classes, decide whether a function is one-one, onto or bijective, compose two functions, and find the inverse of a bijection.

<div class="bigidea">A relation is a set of pairs. A function is a relation in which every input has exactly one output. Three questions sort functions: does every output come from at most one input (one-one), is every point of the codomain hit (onto), and if both, can the machine be run backwards (invertible)? Everything in this chapter is a way of asking those questions with pictures, tables and algebra.</div>

## 1. From the Cartesian product to relations

If `$A = \{1, 2, 3\}$` and `$B = \{p, q\}$`, the **Cartesian product** `$A \times B$` is the set of all ordered pairs `$(a, b)$` with `$a \in A$` and `$b \in B$`. Here it has `$3 \times 2 = 6$` pairs. Order matters: `$(1, p) \ne (p, 1)$`.

A **relation** `$R$` from `$A$` to `$B$` is any subset of `$A \times B$`. If `$(a, b) \in R$` we write `$a \mathrel{R} b$` and say "a is related to b". On the railway, "train number a stops at station b" is a relation between a set of trains and a set of stations. The **domain** is the set of first coordinates that actually appear; the **range** is the set of second coordinates that appear; the **codomain** is the whole set `$B$` (the range may be smaller).

If `$A$` has `$m$` elements and `$B$` has `$n$`, then `$A \times B$` has `$mn$` pairs and every pair is either in or out, so there are `$2^{mn}$` relations. Build one yourself below. The domain and range light up, and the figure tells you when your relation happens to be a function.

<figure class="fig" data-fig="c12m-rel-cart"><figcaption>Tap pairs in the grid to put them in your relation. There are 2^(m×n) possible relations. If every column holds exactly one point, your relation is a function.</figcaption></figure>

Two special relations: the **empty relation** has no pairs at all, and the **universal relation** on `$A$` contains every pair of `$A \times A$`. A relation **on a set** `$A$` means a relation from `$A$` to itself.

## 2. Reflexive, symmetric, transitive

Three tests describe how a relation on `$A$` behaves.

<div class="meaning">
<dl>
<dt>Reflexive</dt><dd>every element is related to itself: `$(a, a) \in R$` for all `$a$`. On a grid, the whole diagonal is filled.</dd>
<dt>Symmetric</dt><dd>if `$a \mathrel{R} b$` then `$b \mathrel{R} a$`. The grid is a mirror image across its diagonal.</dd>
<dt>Transitive</dt><dd>if `$a \mathrel{R} b$` and `$b \mathrel{R} c$` then `$a \mathrel{R} c$`. Whenever two arrows follow each other, a shortcut arrow must exist.</dd>
<dt>Equivalence relation</dt><dd>all three at once. It behaves like "is equal to" in some sense.</dd>
</dl>
</div>

Everyday examples: "is a classmate of" is reflexive (you count as your own classmate), symmetric and transitive. "Is the mother of" is none of the three. "Is at least as tall as" is reflexive and transitive but not symmetric. To prove a relation has a property, you argue for *any* elements. To disprove it, one counter-example is enough.

Tap the grid below to build a relation on `$\{1, 2, 3, 4\}$`. The arrow diagram redraws, and each test names the first pair that breaks it. Try the presets, then change one cell and watch which test fails.

<figure class="fig" data-fig="c12m-rel-props"><figcaption>A relation on {1, 2, 3, 4} as a grid and as an arrow diagram. The three tests report the first failing pair. All three passing means an equivalence relation.</figcaption></figure>

<div class="myth">

**"If a relation is symmetric and transitive, it must be reflexive."** The argument sounds good: `$a \mathrel{R} b$`, then `$b \mathrel{R} a$`, then `$a \mathrel{R} a$`. But it only works for elements that are related to *something*. On `$\{1, 2, 3\}$` the relation `$\{(1,1), (2,2)\}$` is symmetric and transitive, yet `$(3, 3)$` is missing, so it is not reflexive.

</div>

### Worked example: a relation on integers

Let `$a \mathrel{R} b$` mean `$a - b$` is divisible by 3 on the set of integers.

1. **Reflexive.** `$a - a = 0 = 3 \times 0$`, so `$a \mathrel{R} a$`.
2. **Symmetric.** If `$a - b = 3k$` then `$b - a = 3(-k)$`, so `$b \mathrel{R} a$`.
3. **Transitive.** If `$a - b = 3k$` and `$b - c = 3l$`, adding gives `$a - c = 3(k + l)$`.

So `$R$` is an equivalence relation.

<div class="problem" data-problem="c12m-rel-reflexive"></div>

## 3. Equivalence classes

An equivalence relation sorts a set into groups of elements that are "the same" for that relation. The **equivalence class** of `$a$` is `$[a] = \{x : x \mathrel{R} a\}$`. Two key facts: every element lies in its own class (reflexive), and two classes are either identical or share nothing. So the classes cut the set into **non-overlapping pieces that cover everything**, a partition. The reverse is also true: any partition gives an equivalence relation ("lies in the same piece").

Take the numbers 1 to 12 and say two numbers are related when they leave the same remainder on division by `$n$`. For `$n = 3$` the classes are `$\{3, 6, 9, 12\}$`, `$\{1, 4, 7, 10\}$` and `$\{2, 5, 8, 11\}$`. Slide `$n$` and tap a number to see its class.

<figure class="fig" data-fig="c12m-rel-classes"><figcaption>"Same remainder on division by n" cuts 1 to 12 into n classes with no overlap. Tap a number to highlight its class.</figcaption></figure>

Think of a school with sections: "is in the same section as" is an equivalence relation, and the sections are its classes. A student belongs to exactly one section.

<div class="problem" data-problem="c12m-rel-class-size"></div>

## 4. Functions

A **function** `$f : A \to B$` is a relation in which every element of `$A$` has **exactly one** partner in `$B$`. We write `$y = f(x)$`. `$A$` is the domain, `$B$` the codomain, and the set of actual outputs is the range, a subset of the codomain.

In an arrow diagram, the test is simple: every dot of `$A$` sends out exactly one arrow. Zero arrows means the rule is not defined there; two arrows means the output is not single-valued. Try it: tap an element of `$A$` to move its arrow, and change the sizes of the sets.

<figure class="fig" data-fig="c12m-rel-map"><figcaption>Build an arrow diagram. Red dots have no arrow, so it is not a function. Orange dots receive two arrows, so the function is not one-one. Grey dots in B receive none, so it is not onto.</figcaption></figure>

On a graph, the matching test is the **vertical line test**: any vertical line meets the graph at most once.

### Domain, codomain and range

The three sets are separate things. For `$f(x) = x^2$`:

- with domain and codomain both `$\mathbb{R}$`, the range is `$[0, \infty)$`, smaller than the codomain;
- with domain `$\mathbb{R}$` and codomain `$[0, \infty)$`, the range fills the codomain;
- changing the domain to `$[0, \infty)$` removes the negative inputs.

Changing the domain or the codomain makes a *different* function, even with the same formula. That matters for the next two ideas.

## 5. One-one, onto and bijective

<div class="meaning">
<dl>
<dt>One-one (injective)</dt><dd>different inputs give different outputs: `$f(x_1) = f(x_2) \Rightarrow x_1 = x_2$`. On a graph, every horizontal line meets the curve at most once.</dd>
<dt>Onto (surjective)</dt><dd>every element of the codomain is an output: range = codomain. Every horizontal line across the codomain meets the curve at least once.</dd>
<dt>Bijective</dt><dd>one-one and onto: every codomain element is hit exactly once. These are the functions that can be reversed.</dd>
</dl>
</div>

Slide the horizontal line below. If any position meets the curve twice, the function is not one-one on that domain. If some position in the codomain misses the curve, it is not onto. Compare `$x^2$` on all of ℝ and on `$x \ge 0$`, and see how restricting the domain repairs one-one.

<figure class="fig" data-fig="c12m-rel-hline"><figcaption>The horizontal line test. Choose a function and a domain, then slide y = c. Two meetings: not one-one. No meeting: not onto ℝ.</figcaption></figure>

And now the codomain. Same formula `$x^2$`; choose which set is the domain and which is the codomain, and see when the function becomes onto.

<figure class="fig" data-fig="c12m-rel-range"><figcaption>Blue bar: the range (what is actually hit). Amber bar: the codomain. Onto exactly when the blue covers the amber. One-one depends only on the domain.</figcaption></figure>

### How to prove it, step by step

To prove **one-one**: assume `$f(x_1) = f(x_2)$` and show `$x_1 = x_2$`. To prove **onto**: take any `$y$` in the codomain, solve `$f(x) = y$` for `$x$`, and check the `$x$` lies in the domain. To disprove, give one counter-example (two inputs with the same output; one codomain value never reached).

<div class="steps" data-fig="c12m-rel-bijproof">
<div class="step">We want to prove f(x) = 2x + 3 is a bijection from the real numbers to the real numbers.</div>
<div class="step">One-one: assume f(x₁) = f(x₂), so 2x₁ + 3 = 2x₂ + 3.</div>
<div class="step">Subtract 3 and divide by 2: x₁ = x₂. Equal outputs force equal inputs: one-one.</div>
<div class="step">Onto: take any real y. We look for an x with 2x + 3 = y.</div>
<div class="step">Solve: x = (y − 3)/2, a real number for every real y. So it lies in the domain.</div>
<div class="step">Check: f((y − 3)/2) = y. Every y is reached, so f is onto. One-one and onto: bijective.</div>
</div>

<!--fig:tool function-type-->

<div class="myth">

**"A function is onto if every input is used."** Mixed up. Every input is *always* used (that is what a function is). Onto is about the **codomain**: is every point there an output of something?

</div>

### Counting functions

When the sets are small you can count. From an `$m$`-element set to an `$n$`-element set:

- all functions: `$n^m$` (each input chooses an output freely);
- one-one functions: `$n(n-1)(n-2)\cdots(n-m+1)$`, which is zero if `$m > n$` (inputs cannot find distinct outputs);
- if `$m = n$`, one-one and onto are the same, and the number of bijections is `$n!$`;
- onto functions exist only if `$m \ge n$`.

<figure class="fig" data-fig="c12m-rel-count"><figcaption>Bars (log scale) for the number of all, one-one, onto and bijective functions from m to n elements, plus the number of relations. Notice when a bar disappears.</figcaption></figure>

<div class="problem" data-problem="c12m-rel-count-fn"></div>

<div class="problem" data-problem="c12m-rel-count-oneone"></div>

## 6. Composition of functions

If `$f : A \to B$` and `$g : B \to C$`, the **composite** `$g \circ f : A \to C$` is defined by `$(g \circ f)(x) = g(f(x))$`: apply `$f$` first, then `$g$`. The output of `$f$` must lie in the domain of `$g$`. It is two machines in a row: a dosa batter machine feeding a griddle, with the output of one as the input of the next.

Composition is **not commutative**: `$g \circ f$` and `$f \circ g$` usually differ, and one of them may not even exist. It *is* associative: `$h \circ (g \circ f) = (h \circ g) \circ f$`. Pick `$f$` and `$g$` below and watch a number travel through both machines, in either order.

<figure class="fig" data-fig="c12m-rel-compose"><figcaption>A number passes through two machines. g∘f means f first. Swap the order and compare the answers. Pause the animation to read the numbers.</figcaption></figure>

Worked example. `$f(x) = 2x + 1$`, `$g(x) = x^2$`. Then `$(g \circ f)(x) = (2x + 1)^2 = 4x^2 + 4x + 1$`, while `$(f \circ g)(x) = 2x^2 + 1$`. At `$x = 3$` these are 49 and 19.

<div class="problem" data-problem="c12m-rel-compose-num"></div>

## 7. Invertible functions

A function `$f : A \to B$` is **invertible** if there is `$g : B \to A$` with `$g \circ f$` = identity on `$A$` and `$f \circ g$` = identity on `$B$`. Then `$g = f^{-1}$`. The key theorem: **`$f$` is invertible exactly when it is one-one and onto.** Onto means every `$y$` has a source; one-one means that source is unique, so "go back" is well defined.

How to find an inverse: write `$y = f(x)$`, solve for `$x$` in terms of `$y$`, then rename. The steps for `$f(x) = 3x + 2$`:

<div class="steps" data-fig="c12m-rel-invsteps">
<div class="step">f takes x, triples it and adds 2: y = 3x + 2.</div>
<div class="step">To undo it, solve for x: 3x = y − 2.</div>
<div class="step">Divide by 3: x = (y − 2)/3.</div>
<div class="step">Rename the input as x: f⁻¹(x) = (x − 2)/3.</div>
<div class="step">Check both ways: f(f⁻¹(x)) = x and f⁻¹(f(x)) = x.</div>
<div class="step">The graph of f⁻¹ is the mirror image of the graph of f in the line y = x.</div>
</div>

The mirror picture explains why we need one-one: reflecting `$y = x^2$` in `$y = x$` gives a sideways parabola that fails the vertical line test. Cut the domain to `$x \ge 0$` first, and the reflected curve is a function: the square root. Fold the paper yourself:

<figure class="fig" data-fig="@math-inverse-mirror"><figcaption>A function and its inverse as mirror images in y = x. Why x² needs a restricted domain before it has an inverse.</figcaption></figure>

<div class="myth">

**"f⁻¹(x) means 1/f(x)."** No. The little −1 on a function means *inverse function*, not reciprocal. For `$f(x) = 3x + 2$`, `$f^{-1}(x) = (x-2)/3$`, while `$1/f(x) = 1/(3x+2)$`.

</div>

<div class="problem" data-problem="c12m-rel-inverse-num"></div>

For a composite, the inverse reverses the order: `$(g \circ f)^{-1} = f^{-1} \circ g^{-1}$`. To undo "put on socks, then shoes" you take off shoes first, then socks.

## 8. Try it with the tools

Run a relation through the checker, then switch to the function tools. See also the [Function Grapher](/science/function-grapher/) for plotting your own formulas and the [Function Gallery](/learn/function-gallery/) for the standard shapes.

<!--fig:tool relation-checker-->

<div class="history">

- **1837:** Peter Dirichlet gives the modern idea of a function as a rule that attaches one value to each input, whatever the formula.
- **1870s:** Georg Cantor builds set theory; relations and functions become sets of ordered pairs.
- **1930s:** The Bourbaki group popularises the words injective, surjective and bijective.

</div>

<div class="myth">

**Beyond the syllabus.** Binary operations (a rule `$*$` that combines two elements, with identity and inverse) were removed from the rationalised Class 12 book. They return in university algebra as groups. You do not need them for the board exam.

</div>

<div class="keypoints">

- A relation from A to B is a subset of A × B; with |A| = m and |B| = n there are 2^(mn) of them.
- Reflexive: every (a, a) is there. Symmetric: pairs come mirrored. Transitive: two-step paths have shortcuts. All three: equivalence relation.
- An equivalence relation splits a set into non-overlapping classes (a partition).
- A function gives every input exactly one output. Domain, codomain and range are three different sets.
- One-one: equal outputs force equal inputs. Onto: range = codomain. Bijective: both.
- From m to n elements: n^m functions, n(n−1)…(n−m+1) one-one, m! bijections if m = n.
- (g∘f)(x) = g(f(x)): f first. Composition is associative but not commutative.
- f has an inverse exactly when it is bijective; find it by solving y = f(x) for x. (g∘f)⁻¹ = f⁻¹∘g⁻¹.

</div>

Going further for JEE/NEET: [Sets, relations and functions](/learn/courses/engineering-entrance/sets-relations-functions/) has the exam-level problem sets on counting relations and functions, domain and range, and inverses.
