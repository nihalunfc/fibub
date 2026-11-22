---
title: 'Sequences and series: question types and traps'
seoTitle: 'Sequences and series JEE questions: types and traps'
summary: 'Every way entrance exams test progressions and series: nth terms and sums of APs and GPs, terms from sums, three numbers in AP or GP, infinite GPs and recurring decimals, HPs and the three means, AM-GM greatest and least values, arithmetico-geometric series, standard sums, differences and telescoping, each with its method and its trap.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: 'If Sₙ = 3n² + 2n for a sequence, its 10th term is:'
    choices: ['59', '320', '62', '57']
    ans: 0
    why: 'a₁₀ = S₁₀ − S₉ = 320 − 261 = 59. (In general aₙ = 6n − 1, an AP with d = 6.)'
  - q: 'If a, b, c are in AP and also in GP, then:'
    choices: ['a = b = c', 'a, b, c are in HP but not equal', 'b = 0', 'nothing follows']
    ans: 0
    why: '2b = a + c and b² = ac give (a + c)²/4 = ac, so (a − c)² = 0. Then a = c = b.'
  - q: 'Σ from k = 1 to 20 of 1/(k(k + 1)) equals:'
    choices: ['20/21', '1/21', '21/20', '19/20']
    ans: 0
    why: 'Each term is 1/k − 1/(k + 1). The sum telescopes to 1 − 1/21 = 20/21.'
sources:
  - 'JEE Main and JEE Advanced 2026 syllabi: Sequences and series; question patterns studied from published papers (no questions copied)'
---

**Maths · Class 11 · about 26 minutes.** Read [Sequences and series](/learn/courses/engineering-entrance/sequences-series/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Name the pattern first. Is each step an addition (AP), a multiplication (GP), both (AGP), or neither? If neither, look at the differences or try to write each term as a difference. Once the pattern has a name, a formula finishes the job.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. nth term and sum of an AP.</b> Two term conditions give a and d. <i>Trap:</i> (n − 1)d, not nd.</div>
<div class="step"><b>2. Term from the sum.</b> aₙ = Sₙ − Sₙ₋₁ for n ≥ 2. <i>Trap:</i> if Sₙ has a constant term, a₁ = S₁ does not fit the pattern of the rest.</div>
<div class="step"><b>3. Choosing terms.</b> a − d, a, a + d or a/r, a, ar, so the given sum or product fixes a at once. <i>Trap:</i> using a, a + d, a + 2d makes the algebra long.</div>
<div class="step"><b>4. GP sums and infinite GP.</b> a(1 − rⁿ)/(1 − r); a/(1 − r) for |r| &lt; 1. <i>Trap:</i> using the infinite formula when |r| ≥ 1.</div>
<div class="step"><b>5. Recurring decimals and repunits.</b> 0.ab̄ = ab/99; 1 + 11 + 111 + … via (10ᵏ − 1)/9. <i>Trap:</i> a non-repeating part before the repeat.</div>
<div class="step"><b>6. HP and the means.</b> Flip to an AP; A ≥ G ≥ H, G² = AH. <i>Trap:</i> trying to add an HP directly.</div>
<div class="step"><b>7. AM-GM extremes.</b> Fixed product or fixed sum; split terms to balance powers. <i>Trap:</i> negative parts, or an equality case that cannot happen.</div>
<div class="step"><b>8. Arithmetico-geometric series.</b> S − rS. <i>Trap:</i> sign slips when r is negative.</div>
<div class="step"><b>9. Standard sums.</b> Write Tₖ, expand, use Σk, Σk², Σk³. <i>Trap:</i> the general term of 1·3 + 3·5 + … is (2k − 1)(2k + 1), not k(k + 2).</div>
<div class="step"><b>10. Differences and telescoping.</b> Fit a polynomial to Tₙ, or split into f(k) − f(k + 1). <i>Trap:</i> leaving out the first or last surviving term.</div>
</div>

## Worked examples

**Example 1 (level 3, choosing terms).** Three numbers in GP have product 216 and the sum of their products in pairs 156. Find them. *Solution.* Take a/r, a, ar: a³ = 216, so a = 6. Pairwise products: a²/r + a² + a²r = 36(1/r + 1 + r) = 156, so r + 1/r = 10/3 and r = 3 or 1/3. **The numbers are 2, 6, 18.**

**Example 2 (level 4, AM-GM with a split).** For positive a, b, c with a + b + c = 1, find the least value of (1/a − 1)(1/b − 1)(1/c − 1). *Solution.* 1/a − 1 = (b + c)/a, and b + c ≥ 2√(bc), and so on. Multiplying the three, the product is at least 8√(b²c²a²)/(abc) = 8. Equality at a = b = c = 1/3. **Least value 8.**

**Example 3 (level 4, method of differences).** Find the nth term and the sum of n terms of 2, 5, 10, 17, 26, … *Solution.* The differences 3, 5, 7, 9 are an AP, so Tₙ is a quadratic. Fit: Tₙ = n² + 1. Then Sₙ = Σk² + n = **n(n + 1)(2n + 1)/6 + n**.

**Example 4 (level 5, telescoping with factorials).** Find Σ from k = 1 to n of k · k!. *Solution.* k · k! = (k + 1)! − k!. The sum telescopes: (n + 1)! − 1!. **Answer (n + 1)! − 1.**

<div class="myth">

**"If a, b, c are in AP, then a², b², c² are in AP too."** Squaring breaks the pattern: 1, 2, 3 are in AP but 1, 4, 9 are not. What does stay true: adding, subtracting, multiplying or dividing every term by the same non-zero number keeps an AP an AP.

</div>

<div class="meaning">
<dl>
<dt>AGP</dt><dd>arithmetico-geometric series, each term an AP term times a GP term</dd>
<dt>Telescoping</dt><dd>a sum whose terms are differences, so the middle terms cancel in pairs</dd>
<dt>Physical meaning</dt><dd>Every summing trick is a way to make the sum shorter: pair terms (AP), multiply and subtract (GP, AGP), or cancel neighbours (telescoping).</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-maths" data-topics="sequences-series" data-mode="practice"></div>

<div class="keypoints">

- aₙ = Sₙ − Sₙ₋₁; a quadratic Sₙ with no constant term means an AP.
- Choose symmetric terms so the given sum or product fixes the middle term.
- Infinite GP only for |r| &lt; 1; recurring decimals are infinite GPs.
- HP: work with reciprocals. A ≥ G ≥ H, G² = AH.
- AM-GM needs positive parts and a possible equality case.
- Differences in AP mean a quadratic nth term; k · k! = (k + 1)! − k!.

</div>
