---
title: 'Probability: question types and traps'
seoTitle: 'Probability JEE questions: types and traps'
summary: 'Every way entrance exams ask about probability: counting with dice, cards and selections, the addition rule, conditional probability and independence, total probability and Bayes, distributions with mean and variance, the binomial distribution, and games of alternate turns, each with a method and its trap.'
minutes: 26
updated: 2026-11-22
quiz:
  - q: 'Two cards are drawn without replacement from a pack of 52. The probability that both are aces is:'
    choices: ['1/169', '1/221', '1/26', '4/221']
    ans: 1
    why: '(4/52) × (3/51) = 12/2652 = 1/221. With replacement it would be 1/169.'
  - q: 'If P(A) = 0.6, P(B) = 0.5 and P(A | B) = 0.4, then P(A ∩ B) is:'
    choices: ['0.2', '0.24', '0.3', '0.4']
    ans: 0
    why: 'P(A ∩ B) = P(B) × P(A | B) = 0.5 × 0.4 = 0.2. Multiplying by P(A) would be the wrong conditional.'
  - q: 'A binomial variable has mean 6 and variance 2. Its n is:'
    choices: ['9', '12', '18', '8']
    ans: 0
    why: 'q = npq/np = 2/6 = 1/3, so p = 2/3 and n = 6 ÷ (2/3) = 9.'
sources:
  - 'JEE Main and JEE Advanced 2026 syllabi: Statistics and probability; question patterns studied from published papers (no questions copied)'
---

**Maths · Class 12 · about 26 minutes.** Read [Probability](/learn/courses/engineering-entrance/probability/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Most probability questions are lost before any formula: the sample space was not equally likely, "given" was missed, or the trials were not independent. Write the sample space or draw a tree first; the arithmetic is then short.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Classical counting.</b> Dice, coins, cards, numbers 1 to N, letters. Count with ⁿCᵣ for selections. <i>Trap:</i> treating sums or unordered outcomes as equally likely.</div>
<div class="step"><b>2. Addition rule and complements.</b> Union, exactly one, neither, at least one. <i>Trap:</i> forgetting to subtract the overlap; for multiples of a or b the overlap is multiples of lcm(a, b).</div>
<div class="step"><b>3. Conditional probability.</b> "Given that", "if it is known". Shrink the sample space. <i>Trap:</i> confusing P(A | B) with P(B | A).</div>
<div class="step"><b>4. Independence.</b> Test P(A ∩ B) = P(A)P(B); problems solved by several people. <i>Trap:</i> calling exclusive events independent.</div>
<div class="step"><b>5. Total probability and Bayes.</b> Bags, machines, medical tests, a truth-teller. <i>Method:</i> a tree, then the share of one branch. <i>Trap:</i> forgetting the prior probabilities.</div>
<div class="step"><b>6. Distributions, mean and variance.</b> Find k so the probabilities add to 1, then E(X) and Var(X). <i>Trap:</i> Var = Σpx² − μ², not Σpx² alone.</div>
<div class="step"><b>7. Binomial.</b> Exactly r, at least r, given mean and variance, the least n for a target. <i>Trap:</i> sampling without replacement is not binomial.</div>
<div class="step"><b>8. Games and repeated trials.</b> Alternate turns, first success on trial k, expected gain, geometric probability. <i>Method:</i> a geometric series.</div>
</div>

## Worked examples

**Example 1 (level 3, Bayes with a truth-teller).** A speaks the truth 3 times in 4. A die is thrown and A says it shows a six. Find the probability that it really is a six. *Solution.* Causes: six (1/6) or not six (5/6). P(says six | six) = 3/4; P(says six | not six) = 1/4 (a lie; take it that a lying A always claims six). P = (1/6 × 3/4) ÷ (1/6 × 3/4 + 5/6 × 1/4) = (3/24) ÷ (8/24) = **3/8**.

**Example 2 (level 4, alternate turns with three players).** A, B, C toss a coin in that order until someone gets a head. Find P(C wins). *Solution.* C wins on toss 3, 6, 9, …: P = q²p + q⁵p + … = q²p/(1 − q³) = (1/8)/(7/8) = **1/7**. (A gets 4/7 and B 2/7; check they add to 1.)

**Example 3 (level 4, mean and variance of a distribution).** X takes the values 0, 1, 2, 3 with probabilities k, 2k, 3k, 4k. Find Var(X). *Solution.* 10k = 1 gives k = 0.1. E(X) = 0.2 + 0.6 + 1.2 = 2. E(X²) = 0.2 + 1.2 + 3.6 = 5. **Var = 5 − 4 = 1**.

**Example 4 (level 5, conditional binomial).** A fair coin is tossed 6 times. Given that at least one head appeared, find the probability of exactly two heads. *Solution.* P(exactly 2) = ⁶C₂/64 = 15/64. P(at least one) = 63/64. Since "exactly two" is inside "at least one", P = (15/64) ÷ (63/64) = **15/63 = 5/21**.

**Example 5 (level 5, geometric probability).** x and y are chosen at random in [0, 2]. Find P(|x − y| < 1). *Solution.* The square has area 4. The region |x − y| ≥ 1 is two corner triangles each of area 1/2. So P = (4 − 1)/4 = **3/4**.

<div class="myth">

**"Drawing two balls at once is different from drawing one after the other without putting back."** They give the same probabilities. ⁵C₂/⁸C₂ = (5/8)(4/7) = 10/28. Use whichever is easier; just never mix "with replacement" into it.

</div>

<div class="meaning">
<dl>
<dt>Tree rule</dt><dd>multiply along a branch, add across branches</dd>
<dt>Bayes</dt><dd>one branch ÷ sum of all branches that end in the observed effect</dd>
<dt>Turns</dt><dd>first player wins with p/(1 − qᵏ) for k players taking turns</dd>
<dt>Physical meaning</dt><dd>A probability is a share of the possibilities. Conditioning changes which possibilities are still in the room, not the counting rule.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-maths" data-topics="probability" data-mode="practice"></div>

<div class="keypoints">

- Count in an equally likely sample space; dice give 36 ordered pairs.
- Overlap of "divisible by a" and "divisible by b" is "divisible by lcm(a, b)".
- P(A | B) = P(A ∩ B)/P(B); read carefully which event is given.
- Bayes: draw a tree with the priors, then take one branch's share.
- Var(X) = E(X²) − [E(X)]²; binomial mean np, variance npq, so q = variance ÷ mean.
- Alternate turns: sum a geometric series; check that all players' chances add to 1.

</div>
