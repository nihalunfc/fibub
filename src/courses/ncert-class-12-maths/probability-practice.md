---
title: 'Probability: practice questions'
seoTitle: 'Probability Class 12 questions with answers'
summary: 'Class 12 Probability practice: 1 to 5 mark questions on conditional probability, Bayes, random variables and binomial, a case study and assertion-reason.'
minutes: 65
updated: 2026-11-22
quiz:
  - q: 'If P(A ∩ B) = 0.15 and P(B) = 0.5, then P(A | B) is:'
    choices: ['0.3', '0.75', '0.15', '0.5']
    ans: 0
    why: 'P(A | B) = 0.15/0.5 = 0.3.'
  - q: 'A fair coin is tossed 5 times. The probability of exactly 3 heads is:'
    choices: ['5/16', '3/5', '1/32', '3/8']
    ans: 0
    why: 'C(5, 3)/32 = 10/32 = 5/16.'
  - q: 'The mean of the binomial distribution B(10, 0.4) is:'
    choices: ['4', '6', '2.4', '0.4']
    ans: 0
    why: 'np = 10 × 0.4 = 4.'
sources:
  - 'NCERT Class 12 Mathematics, Chapter 13 “Probability” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Questions follow the CBSE board pattern (1, 2, 3 and 5 mark, case-based and assertion-reason) as in the CBSE sample question papers; all numbers and stories are original and every answer was checked a second way (counting out of 1000 or 10000 cases, or listing every sequence).'
---

Back to the chapter: [Probability](/learn/courses/ncert-class-12-maths/probability/).

## How to set out answers

Name the events (A, B, `$E_1, E_2$`) and write what each probability means. Write the formula (conditional, multiplication, total probability, Bayes or binomial), then substitute, then simplify to a fraction or a decimal. Draw a tree for two-stage problems. For Bayes questions, first find `$P(A)$` by total probability, then divide.

## 1-mark questions

**Q1.** `$P(A) = 0.4$`, `$P(B) = 0.5$` and `$A$`, `$B$` are independent. Find `$P(A\cap B)$`.

<details><summary>Answer</summary>

`$P(A)P(B) = 0.4\times0.5 = 0.2$`.

</details>

**Q2.** `$P(A\cap B) = 0.15$` and `$P(B) = 0.5$`. Find `$P(A\mid B)$`.

<details><summary>Answer</summary>

`$\dfrac{0.15}{0.5} = 0.3$`.

</details>

**Q3.** A random variable X takes the values 0, 1, 2 with probabilities 0.3, `$k$`, 0.5. Find `$k$`.

<details><summary>Answer</summary>

The probabilities add to 1: `$0.3 + k + 0.5 = 1$`, so `$k = 0.2$`.

</details>

**Q4.** Find the mean of the binomial distribution `$B(10, 0.4)$`.

<details><summary>Answer</summary>

`$np = 10\times0.4 = 4$`.

</details>

## 2-mark and 3-mark questions

**Q5.** Two dice are thrown. Find the probability that the sum is 8, given that the first die shows 3.

<details><summary>Answer</summary>

With the first die 3, the second must be 5 to make 8. The sample space is now the 6 outcomes with the first die 3, and 1 of them works: `$\dfrac16$`.

</details>

**Q6.** A bag has 4 red and 6 blue marbles. Two are drawn one after another without replacement. Find the probability that both are blue.

<details><summary>Answer</summary>

`$P(\text{both blue}) = \dfrac{6}{10}\times\dfrac{5}{9} = \dfrac{30}{90} = \dfrac13$`.

</details>

**Q7.** `$A$` and `$B$` are independent with `$P(A) = 0.3$` and `$P(B) = 0.6$`. Find `$P(A\cup B)$` and the probability that neither happens.

<details><summary>Answer</summary>

`$P(A\cap B) = 0.3\times0.6 = 0.18$`, so `$P(A\cup B) = 0.3 + 0.6 - 0.18 = 0.72$`.

Neither: `$1 - 0.72 = 0.28$` (check: `$0.7\times0.4 = 0.28$`).

</details>

**Q8.** X is the number of heads when a fair coin is tossed 3 times. Write its distribution and find the mean.

<details><summary>Answer</summary>

| X | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| P(X) | 1/8 | 3/8 | 3/8 | 1/8 |

`$E(X) = 0\cdot\tfrac18 + 1\cdot\tfrac38 + 2\cdot\tfrac38 + 3\cdot\tfrac18 = \tfrac{12}{8} = 1.5$` (this is `$np = 3\times\tfrac12$`).

</details>

**Q9.** A fair coin is tossed 5 times. Find the probability of exactly 3 heads.

<details><summary>Answer</summary>

`$\binom53\left(\tfrac12\right)^3\left(\tfrac12\right)^2 = \dfrac{10}{32} = \dfrac5{16}$`.

</details>

## 5-mark questions

**Q10.** A fair coin is tossed. If it shows heads, a ball is drawn from Bag I (3 red, 2 blue); if tails, from Bag II (1 red, 4 blue). (a) Find the probability that the ball is red. (b) The ball is red: find the probability that it came from Bag I.

<details><summary>Answer</summary>

Let `$E_1$` = heads (Bag I) and `$E_2$` = tails (Bag II), each with probability `$\tfrac12$`. Let `$R$` = the ball is red. `$P(R\mid E_1) = \tfrac35$`, `$P(R\mid E_2) = \tfrac15$`.

(a) Total probability: `$P(R) = \tfrac12\cdot\tfrac35 + \tfrac12\cdot\tfrac15 = \tfrac{3}{10} + \tfrac{1}{10} = \tfrac25$`.

(b) Bayes: `$P(E_1\mid R) = \dfrac{\tfrac12\cdot\tfrac35}{\tfrac25} = \dfrac{3/10}{2/5} = \dfrac34$`.

Check by counting 100 rounds: 50 use Bag I, giving 30 red; 50 use Bag II, giving 10 red. Of the 40 red balls, 30 came from Bag I: `$\tfrac{30}{40} = \tfrac34$`.

</details>

**Q11.** 2% of people have a certain condition. A test is positive for 95% of those who have it and for 4% of those who do not. A person tests positive. What is the probability that they have the condition?

<details><summary>Answer</summary>

Let `$D$` = has the condition, `$T$` = tests positive. `$P(D) = 0.02$`, `$P(T\mid D) = 0.95$`, `$P(T\mid D') = 0.04$`.

Total probability: `$P(T) = 0.02\times0.95 + 0.98\times0.04 = 0.019 + 0.0392 = 0.0582$`.

Bayes: `$P(D\mid T) = \dfrac{0.019}{0.0582} = \dfrac{19}{58} \approx 0.33$`.

So even with a positive result the chance is only about one in three, because the condition is rare and the healthy are many. (Count: in 10000 people, 190 true positives and 392 false positives.)

</details>

**Q12.** A shooter hits the target with probability 0.6 on each shot, independently. In 4 shots, find the probability of at least 2 hits, and the mean number of hits.

<details><summary>Answer</summary>

`$X\sim B(4, 0.6)$`, `$q = 0.4$`.

`$P(X = 0) = 0.4^4 = 0.0256$`. `$P(X = 1) = 4(0.6)(0.4)^3 = 4\times0.6\times0.064 = 0.1536$`.

`$P(X \ge 2) = 1 - 0.0256 - 0.1536 = 0.8208$`.

Mean `$= np = 4\times0.6 = 2.4$` hits.

</details>

## Case-based question

**Q13.** In a class of 40 students, 24 play cricket, 16 play football and 8 play both. A student is picked at random. Let C be “plays cricket” and F be “plays football”.

(i) Find `$P(C)$`. (ii) Find `$P(F\mid C)$`. (iii) Find `$P(C\mid F)$`. (iv) Are C and F independent?

<details><summary>Answer</summary>

(i) `$P(C) = \dfrac{24}{40} = 0.6$`.

(ii) `$P(F\mid C) = \dfrac{P(C\cap F)}{P(C)} = \dfrac{8/40}{24/40} = \dfrac13$`.

(iii) `$P(C\mid F) = \dfrac{8/40}{16/40} = \dfrac12$`.

(iv) `$P(C)P(F) = 0.6\times0.4 = 0.24$` but `$P(C\cap F) = \dfrac{8}{40} = 0.2$`. They are not equal, so C and F are not independent. (Check: `$P(C\mid F) = 0.5 \ne P(C) = 0.6$`.)

</details>

## Assertion and reason

**Q14.** **Assertion (A):** If A and B are mutually exclusive events with non-zero probabilities, they cannot be independent. **Reason (R):** For such events `$P(A\cap B) = 0$` but `$P(A)P(B) > 0$`. Choose: (a) both true and R explains A; (b) both true, R does not explain A; (c) A true, R false; (d) A false, R true.

<details><summary>Answer</summary>

(a). Both are true and R is exactly why independence fails.

</details>

**Q15.** **Assertion (A):** A person who tests positive on a 99% accurate test for a rare disease is almost certainly ill. **Reason (R):** The probability of a false positive is small. Choose (a) to (d) as above.

<details><summary>Answer</summary>

(d). A is false: if the disease is rare, the false positives from the many healthy people can outnumber the true positives, so the chance of being ill can be low (see Q11). R is a true statement about the test, but it ignores how many healthy people there are, so it does not support A.

</details>

## Live problems

<div class="problem" data-problem="c12m-prob-bayes"></div>

<div class="problem" data-problem="c12m-prob-binom"></div>

<div class="problem" data-problem="c12m-prob-cond"></div>

## More questions

<div class="qbank" data-bank="ncert-class-12-maths" data-topics="probability" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- `$P(A\mid B) = \dfrac{P(A\cap B)}{P(B)}$`; `$P(A\cap B) = P(A)P(B\mid A)$`; independent means `$P(A\cap B) = P(A)P(B)$`.
- Total probability `$P(A) = \sum P(E_i)P(A\mid E_i)$`; Bayes `$P(E_i\mid A) = \dfrac{P(E_i)P(A\mid E_i)}{P(A)}$`. Count out of 1000 to check.
- Distribution: probabilities add to 1; `$E(X) = \sum x_ip_i$`.
- Binomial: `$P(X = k) = \binom nk p^kq^{n-k}$`, mean `$np$`; “at least one” is `$1 - q^n$`.

</div>
