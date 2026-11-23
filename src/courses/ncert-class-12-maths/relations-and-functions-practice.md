---
title: 'Relations and Functions: practice questions'
seoTitle: 'Relations and Functions Class 12 questions with answers'
summary: 'Practice for Class 12 Relations and Functions: equivalence relations, one-one and onto proofs, composition and inverses, with 1 to 5 mark questions.'
minutes: 60
updated: 2026-11-22
quiz:
  - q: 'The number of functions from a set with 2 elements to a set with 4 elements is:'
    choices: ['16', '8', '6', '2']
    ans: 0
    why: 'Each of the 2 inputs has 4 choices: 4² = 16.'
  - q: 'Which of these functions from the real numbers to the real numbers is one-one?'
    choices: ['f(x) = x³', 'f(x) = x²', 'f(x) = |x|', 'f(x) = sin x']
    ans: 0
    why: 'x³ is strictly increasing. x² and |x| repeat values for x and −x, and sin x repeats every 2π.'
  - q: 'The relation “is perpendicular to” on lines in a plane is:'
    choices: ['symmetric only', 'an equivalence relation', 'reflexive and transitive', 'reflexive only']
    ans: 0
    why: 'If l ⊥ m then m ⊥ l. A line is not perpendicular to itself, and l ⊥ m ⊥ n makes l parallel to n.'
sources:
  - 'CBSE Class 12 Mathematics question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 12 Maths · Chapter 1.** Read the lesson, [Relations and Functions](/learn/courses/ncert-class-12-maths/relations-and-functions/), first. Try each question on paper before you open the answer.

<div class="bigidea">For every relation, name the three tests and check each one on arbitrary elements. For every function, ask three questions in order: is it a function, is it one-one, is it onto? A proof works with a general element; a disproof needs one counter-example.</div>

## How to set out answers

1. Write the definition you are testing, for example "one-one: `$f(x_1) = f(x_2) \Rightarrow x_1 = x_2$`".
2. Take general elements (`$x_1, x_2$` or `$y$`), not numbers, when you prove something. Use specific numbers only to disprove.
3. For onto, always check that the `$x$` you found lies in the domain.
4. State the conclusion in words: "Hence `$f$` is a bijection, so `$f^{-1}$` exists".

## 1-mark questions

1. Define a reflexive relation on a set `$A$`.
<details><summary>Answer</summary>`$R$` is reflexive if `$(a, a) \in R$` for every `$a \in A$`.</details>

2. Is `$R = \{(1,2), (2,1)\}$` on `$\{1, 2\}$` reflexive?
<details><summary>Answer</summary>No. The pairs `$(1,1)$` and `$(2,2)$` are missing.</details>

3. How many functions are there from `$\{1, 2\}$` to `$\{a, b, c\}$`?
<details><summary>Answer</summary>`$3^2 = 9$`. Each of the two inputs has three choices.</details>

4. State the condition for a function to have an inverse.
<details><summary>Answer</summary>It must be one-one and onto (a bijection).</details>

5. If `$f(x) = x + 1$` and `$g(x) = x^2$`, find `$(f \circ g)(2)$`.
<details><summary>Answer</summary>`$g(2) = 4$`, then `$f(4) = 5$`. So the value is 5.</details>

## 2-mark and 3-mark questions

6. On `$A = \{1, 2, 3\}$`, test `$R = \{(1,1), (2,2), (3,3), (1,2), (2,3)\}$` for reflexive, symmetric and transitive. *(3 marks)*
<details><summary>Answer</summary>

Reflexive: yes, all of `$(1,1), (2,2), (3,3)$` are present.

Symmetric: no. `$(1,2) \in R$` but `$(2,1) \notin R$`.

Transitive: no. `$(1,2)$` and `$(2,3)$` are in `$R$` but `$(1,3)$` is not.

</details>

7. Show that `$f : \mathbb{R} \to \mathbb{R}$` given by `$f(x) = 5x - 7$` is one-one and onto. *(3 marks)*
<details><summary>Answer</summary>

One-one: if `$5x_1 - 7 = 5x_2 - 7$` then `$x_1 = x_2$`.

Onto: for any real `$y$`, take `$x = (y + 7)/5$`, which is real, and `$f(x) = y$`.

So `$f$` is a bijection.

</details>

8. `$f : \mathbb{N} \to \mathbb{N}$` given by `$f(x) = x^2$`. Is it one-one? Is it onto? *(2 marks)*
<details><summary>Answer</summary>

One-one: yes. For natural numbers `$x_1^2 = x_2^2$` gives `$x_1 = x_2$` (both positive).

Onto: no. For example 2 is not the square of any natural number.

</details>

9. Find the inverse of the bijection `$f(x) = \dfrac{3x - 2}{5}$`. *(2 marks)*
<details><summary>Answer</summary>

`$y = \dfrac{3x - 2}{5}$` gives `$5y = 3x - 2$`, so `$x = \dfrac{5y + 2}{3}$`.

Hence `$f^{-1}(x) = \dfrac{5x + 2}{3}$`.

</details>

10. On the set of all people, `$a \mathrel{R} b$` means "a has the same birthday (day and month) as b". Show that `$R$` is an equivalence relation. *(3 marks)*
<details><summary>Answer</summary>

Reflexive: you share your own birthday. Symmetric: if a shares b's birthday then b shares a's. Transitive: if a and b share a birthday and b and c share a birthday, then a and c do. All three hold, so `$R$` is an equivalence relation. Its classes are the (up to 366) groups of people with the same birthday.

</details>

11. `$f(x) = 2x + 1$` and `$g(x) = x^2 - 3$`. Find `$g \circ f$` and `$f \circ g$`, and compute both at `$x = 2$`. *(3 marks)*
<details><summary>Answer</summary>

`$(g \circ f)(x) = (2x+1)^2 - 3 = 4x^2 + 4x - 2$`, and `$(f \circ g)(x) = 2(x^2 - 3) + 1 = 2x^2 - 5$`.

At `$x = 2$`: `$(g \circ f)(2) = 22$` and `$(f \circ g)(2) = 3$`. They differ, so composition is not commutative.

</details>

<div class="problem" data-problem="c12m-rel-count-fn"></div>

<div class="problem" data-problem="c12m-rel-compose-num"></div>

## 5-mark questions

12. On the integers, `$a \mathrel{R} b$` when `$a - b$` is divisible by 4. Prove that `$R$` is an equivalence relation and list its equivalence classes. *(5 marks)*
<details><summary>Answer</summary>

Reflexive: `$a - a = 0 = 4 \times 0$`.

Symmetric: if `$a - b = 4k$` then `$b - a = 4(-k)$`.

Transitive: if `$a - b = 4k$` and `$b - c = 4l$` then `$a - c = 4(k + l)$`.

So `$R$` is an equivalence relation. Two integers are related when they have the same remainder on division by 4, so there are four classes: `$[0] = \{\dots, -4, 0, 4, 8, \dots\}$`, `$[1] = \{\dots, -3, 1, 5, 9, \dots\}$`, `$[2]$` and `$[3]$`. They do not overlap and together cover all integers.

</details>

13. Show that `$f : \mathbb{R} \to \mathbb{R}$` given by `$f(x) = x^3 + 1$` is invertible and find `$f^{-1}$`. *(5 marks)*
<details><summary>Answer</summary>

One-one: `$x_1^3 + 1 = x_2^3 + 1$` gives `$x_1^3 = x_2^3$`, and a real number has only one real cube root, so `$x_1 = x_2$`.

Onto: for any real `$y$`, `$x = \sqrt[3]{y - 1}$` is real and `$f(x) = (y - 1) + 1 = y$`.

So `$f$` is a bijection and `$f^{-1}(x) = \sqrt[3]{x - 1}$`. Check: `$f(f^{-1}(x)) = (x - 1) + 1 = x$`.

</details>

## Case-based question

14. A coaching centre has 60 students. Each student gets a unique roll number from 1 to 60. Let `$S$` be the set of students and `$f : S \to \{1, \dots, 60\}$` give the roll number. Students are also divided into three batches, morning, noon and evening, and `$R$` is the relation "is in the same batch as". *(4 marks)*

(a) Is `$f$` one-one? (b) Is `$f$` onto? (c) Is `$R$` an equivalence relation? What are its classes? (d) Is "is taller than" an equivalence relation on `$S$`?

<details><summary>Answer</summary>

(a) Yes: unique roll numbers mean different students get different numbers.

(b) Yes: 60 students and 60 numbers, each number used. So `$f$` is a bijection and each roll number points back to exactly one student.

(c) Yes: it is reflexive, symmetric and transitive. The classes are the three batches.

(d) No. "Is taller than" is not reflexive (nobody is taller than themselves) and not symmetric.

</details>

## Assertion and reason

For each, choose: (A) both true and R explains A, (B) both true but R does not explain A, (C) A true and R false, (D) A false and R true.

15. **Assertion:** `$f(x) = x^2$` on `$\mathbb{R}$` has no inverse function. **Reason:** `$f(2) = f(-2)$`.
<details><summary>Answer</summary>(A). `$f$` is not one-one because `$f(2) = f(-2)$`, so it cannot be inverted.</details>

16. **Assertion:** On `$\{1,2,3\}$` the relation `$\{(1,1), (2,2)\}$` is symmetric and transitive but not reflexive. **Reason:** The pair `$(3,3)$` is missing.
<details><summary>Answer</summary>(A). Symmetric and transitive hold (nothing breaks them), but reflexive needs all three pairs `$(a,a)$`, and `$(3,3)$` is absent.</details>

17. **Assertion:** The number of one-one functions from a 4-element set to a 3-element set is zero. **Reason:** Four inputs cannot all get different outputs from only three.
<details><summary>Answer</summary>(A). By the pigeonhole principle two inputs must share an output.</details>

## Question set

Mix of 1-mark to 5-mark problems from the chapter's bank, with fresh numbers:

<div class="qbank" data-bank="ncert-class-12-maths" data-topics="relations-and-functions" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- To prove a relation property use general elements; one counter-example disproves.
- Equivalence = reflexive + symmetric + transitive; the classes partition the set.
- One-one: `$f(x_1) = f(x_2) \Rightarrow x_1 = x_2$`. Onto: solve `$f(x) = y$` and check the domain. Bijective: both.
- m to n elements: `$n^m$` functions, `$nPm$` one-one.
- `$g \circ f$` means f first; the inverse of a composite reverses the order.

</div>
