---
title: Permutations and combinations
seoTitle: 'Permutations and combinations: JEE maths'
summary: 'The counting principles, factorials, nPr and nCr with restrictions, objects together or apart (gaps method), identical objects, circular arrangements and necklaces, selections, counting in geometry, divisors, forming numbers, distributions with stars and bars, derangements, inclusion-exclusion, rank of a word and lattice paths.'
minutes: 38
updated: 2026-11-22
quiz:
  - q: 'In how many ways can 5 people sit round a round table?'
    choices: ['120', '24', '60', '12']
    ans: 1
    why: 'Turning the table does not change a seating, so fix one person and arrange the other 4: 4! = 24.'
  - q: 'How many diagonals does a polygon with 10 sides have?'
    choices: ['45', '35', '40', '90']
    ans: 1
    why: 'Any 2 of the 10 vertices give a line: 10C2 = 45. Ten of those are sides, so 45 − 10 = 35 diagonals.'
  - q: 'The number of non-negative integer solutions of x + y + z = 6 is:'
    choices: ['28', '20', '10', '56']
    ans: 0
    why: 'Stars and bars: 6 stars and 2 bars in a row, choose where the 2 bars go among 8 places: 8C2 = 28.'
sources:
  - 'NCERT Mathematics Class 11 (Permutations and combinations): topics followed, no text copied'
  - 'JEE Main and JEE Advanced 2026 syllabi: Permutations and combinations'
---

**Maths · Class 11 · about 38 minutes.** By the end you will be able to decide quickly whether order matters, count with restrictions, handle identical objects and circles, distribute objects into groups, and use derangements and inclusion-exclusion for the harder JEE questions.

<div class="bigidea">Counting is a sequence of decisions. If one decision can be made in m ways and then the next in n ways, together they can be made in m × n ways. Everything else in this chapter (nPr, nCr, circles, identical objects) is this one principle plus a correction for things you counted more than once.</div>

## 1. The two counting principles

- **Multiplication (AND).** A job done in stages: multiply the number of ways for each stage. A 4-digit PIN has 10 × 10 × 10 × 10 = 10⁴ choices.
- **Addition (OR).** A job done in one of several separate ways that do not overlap: add. If the ways overlap, subtract the overlap (inclusion-exclusion, section 6).

**Factorials.** n! = 1 × 2 × … × n is the number of ways to put n different objects in a row, with 0! = 1.

## 2. Permutations and combinations

```math
{}^nP_r = \frac{n!}{(n-r)!}, \qquad {}^nC_r = \binom{n}{r} = \frac{n!}{r!\,(n-r)!} = \frac{{}^nP_r}{r!}
```

<div class="meaning">
<dl>
<dt>n</dt><dd>the number of different objects available</dd>
<dt>r</dt><dd>how many are used</dd>
<dt>nPr</dt><dd>arrangements: ordered rows of r objects (president and secretary are different jobs)</dd>
<dt>nCr</dt><dd>selections: unordered groups of r objects (a team of r)</dd>
<dt>Physical meaning</dt><dd>Every group of r can be put in order in r! ways, so arrangements = selections × r!. Ask yourself, "if I swap two chosen objects, do I get something new?" Yes means permutation; no means combination.</dd>
</dl>
</div>

<figure class="fig" data-fig="pc-slots"><figcaption>Fill r slots from n objects. In a row the choices multiply; for groups, divide by the r! orders of each group; round a circle, divide by the n rotations.</figcaption></figure>

Useful facts: `$\binom nr = \binom n{n-r}$`, `$\binom nr + \binom n{r-1} = \binom{n+1}r$` (Pascal's rule), and `$\binom nr$` is largest at the middle value of r.

## 3. Arrangements with restrictions

- **Fixed places.** Fill the restricted places first, then the rest.
- **Together.** Tie the objects that must be together into one block, arrange the blocks, then arrange inside the block. 3 particular books together among 7: 5! × 3!.
- **Never together (gaps method).** Arrange the others first, then put the restricted objects into the gaps between them. With 5 boys in a row there are 6 gaps, so 4 girls with no two together: 5! × ⁶P₄.
- **Identical objects.** n objects with p alike of one kind, q alike of another: `$\dfrac{n!}{p!\,q!}$`.

<div class="problem" data-problem="pc-word"></div>

**Forming numbers.** Count digit by digit, starting with the most restricted place: the first digit cannot be 0; an even number must end in 0, 2, 4, 6 or 8; a number is divisible by 3 when its digit sum is. Split into cases when the 0 makes one place special.

**Rank of a word.** To find where a word stands in the dictionary list of its arrangements, go letter by letter: count the arrangements that start with each smaller letter, add them up, and add 1 at the end.

<div class="myth">

**"Never together = total − all together."** That subtracts only the arrangements where all of them are in one block. "No two together" is stricter: two can be together while the third is apart. For "no two together", use the gaps method.

</div>

## 4. Circles and necklaces

n different objects round a circle: `$(n-1)!$`, because turning the circle gives the same arrangement. If the circle can also be flipped over (beads on a necklace, flowers in a garland), clockwise and anticlockwise are the same, so `$\tfrac12(n-1)!$` for n ≥ 3.

## 5. Selections and their uses

- **At least / at most.** Add the separate cases, or subtract the unwanted ones from the total.
- **Any number of objects.** From n different objects, choosing at least one: 2ⁿ − 1. From p alike, q alike and r alike: (p + 1)(q + 1)(r + 1) − 1.
- **Geometry.** n points with no three collinear give `$\binom n2$` lines and `$\binom n3$` triangles. A polygon with n sides has `$\binom n2 - n$` diagonals. m horizontal and n vertical lines form `$\binom m2\binom n2$` rectangles.
- **Divisors.** If `$N = p^a q^b r^c$` (primes), N has (a + 1)(b + 1)(c + 1) divisors. Each divisor is a choice of how many times to use each prime.

<div class="problem" data-problem="pc-committee"></div>

## 6. Distributions, derangements and inclusion-exclusion (JEE Advanced)

**Stars and bars.** n identical objects into r different boxes, empty boxes allowed: `$\binom{n+r-1}{r-1}$` ways. If each box must get at least one: `$\binom{n-1}{r-1}$`. This also counts integer solutions of x₁ + … + xᵣ = n. Line up n stars and r − 1 bars; the bars split the stars into r boxes.

<div class="problem" data-problem="pc-stars"></div>

**Different objects into groups.** Dividing 2n different objects into two groups of n with no names on the groups: `$\dfrac{(2n)!}{2!\,(n!)^2}$`. Divide by the factorial of the number of equal-sized unnamed groups.

**Derangements.** The number of ways to put n letters in n envelopes with none in its own envelope is

```math
D_n = n!\left(1 - \frac1{1!} + \frac1{2!} - \frac1{3!} + \cdots + \frac{(-1)^n}{n!}\right)
```

D₁ = 0, D₂ = 1, D₃ = 2, D₄ = 9, D₅ = 44. "Exactly k in the right envelopes" is `$\binom nk D_{n-k}$`.

**Inclusion-exclusion.** `$|A \cup B \cup C| = |A| + |B| + |C| - |A\cap B| - |B\cap C| - |C\cap A| + |A\cap B\cap C|$`. Use it for "at least one condition fails" counts, such as onto functions or numbers divisible by 2, 3 or 5.

**Lattice paths.** Moving only right or up from (0, 0) to (m, n) takes m + n steps, of which m are right: `$\binom{m+n}{m}$` paths.

**Worked example.** In how many ways can 8 identical sweets be shared among 3 children so that each gets at least 2? Give each child 2 first. The other 2 are shared freely: `$\binom{2+2}{2} = 6$`.

<div class="keypoints">

- Multiply for "and", add for "or"; correct for double counting.
- Order matters: nPr = n!/(n − r)!. Order does not matter: nCr = nPr/r!.
- Together: make a block. No two together: gaps method.
- Identical objects: n!/(p! q! …). Circles: (n − 1)!; necklaces: half that.
- Stars and bars: C(n + r − 1, r − 1), or C(n − 1, r − 1) with no empty box.
- Divisors of pᵃqᵇrᶜ: (a + 1)(b + 1)(c + 1). Derangements D₄ = 9, D₅ = 44.

</div>
