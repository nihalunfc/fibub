---
title: 'Matrices: practice questions'
seoTitle: 'Matrices Class 12 questions with answers'
summary: 'Practice for Class 12 Matrices: orders, multiplication, transpose, symmetric and skew-symmetric matrices and inverses, with 1 to 5 mark and case questions.'
minutes: 60
updated: 2026-11-22
quiz:
  - q: 'A is 3 × 2 and B is 2 × 5. The order of (AB)ᵀ is:'
    choices: ['5 × 3', '3 × 5', '2 × 2', '5 × 2']
    ans: 0
    why: 'AB is 3 × 5, so its transpose is 5 × 3. (Also BᵀAᵀ is (5 × 2)(2 × 3) = 5 × 3.)'
  - q: 'The inverse of [[2, 1], [5, 3]] is:'
    choices: ['[[3, −1], [−5, 2]]', '[[3, 1], [5, 2]]', '[[−3, 1], [5, −2]]', '[[1/2, 1], [1/5, 1/3]]']
    ans: 0
    why: 'Determinant = 6 − 5 = 1. Swap the diagonal, change the signs of the other two: [[3, −1], [−5, 2]].'
  - q: 'If A is a square matrix, A − Aᵀ is always:'
    choices: ['skew-symmetric', 'symmetric', 'the zero matrix', 'the identity']
    ans: 0
    why: '(A − Aᵀ)ᵀ = Aᵀ − A = −(A − Aᵀ).'
sources:
  - 'CBSE Class 12 Mathematics question paper design 2025-26 (question types and mark pattern only)'
  - 'All questions and answers are original fibub work; none is copied from NCERT exercises or past papers'
---

**Practice · Class 12 Maths · Chapter 3.** Read the lesson, [Matrices](/learn/courses/ncert-class-12-maths/matrices/), first. Try each question on paper before you open the answer.

<div class="bigidea">Before computing, check the orders: for a sum they must be equal, for a product the inner numbers must match. Then work row by column, line by line, and write the order of the answer.</div>

## How to set out answers

1. Write the order of each matrix, then check the operation is defined.
2. For a product, write the sum for each entry (row times column) before simplifying.
3. For proofs about transposes, use the rules `$(AB)^T = B^TA^T$`, `$(A+B)^T = A^T + B^T$`.
4. After finding an inverse, check `$AA^{-1} = I$`.

## 1-mark questions

1. A matrix has 3 rows and 5 columns. Write its order and the number of entries.
<details><summary>Answer</summary>Order `$3 \times 5$`; it has 15 entries.</details>

2. Can you add a `$2 \times 3$` matrix to a `$3 \times 2$` matrix?
<details><summary>Answer</summary>No. Addition needs the same order.</details>

3. If `$A$` is `$4 \times 3$` and `$B$` is `$3 \times 2$`, write the order of `$AB$`.
<details><summary>Answer</summary>`$4 \times 2$`.</details>

4. Write the transpose of `$\begin{pmatrix}1 & 2 & 3\end{pmatrix}$`.
<details><summary>Answer</summary>The column matrix with entries 1, 2, 3 (order `$3 \times 1$`).</details>

5. What is the value of the diagonal entries of a skew-symmetric matrix?
<details><summary>Answer</summary>All 0.</details>

## 2-mark and 3-mark questions

6. If `$A = \begin{pmatrix}1 & 2\\3 & 4\end{pmatrix}$` and `$B = \begin{pmatrix}0 & 1\\1 & 0\end{pmatrix}$`, find `$AB$` and `$BA$`. *(3 marks)*
<details><summary>Answer</summary>

`$AB = \begin{pmatrix}1\cdot0 + 2\cdot1 & 1\cdot1 + 2\cdot0\\3\cdot0 + 4\cdot1 & 3\cdot1 + 4\cdot0\end{pmatrix} = \begin{pmatrix}2 & 1\\4 & 3\end{pmatrix}$` (the columns of `$A$` swapped).

`$BA = \begin{pmatrix}3 & 4\\1 & 2\end{pmatrix}$` (the rows of `$A$` swapped). So `$AB \ne BA$`.

</details>

7. Find `$x$` and `$y$` if `$\begin{pmatrix}x + y & 2\\5 & x - y\end{pmatrix} = \begin{pmatrix}7 & 2\\5 & 1\end{pmatrix}$`. *(2 marks)*
<details><summary>Answer</summary>

Equal matrices have equal entries: `$x + y = 7$` and `$x - y = 1$`. Adding: `$2x = 8$`, so `$x = 4$` and `$y = 3$`.

</details>

8. Give an example of two non-zero `$2 \times 2$` matrices whose product is the zero matrix. *(2 marks)*
<details><summary>Answer</summary>

`$A = \begin{pmatrix}0 & 1\\0 & 0\end{pmatrix}$` and `$B = \begin{pmatrix}1 & 0\\0 & 0\end{pmatrix}$`. Then `$AB = \begin{pmatrix}0 & 0\\0 & 0\end{pmatrix}$` (row 1 of `$A$` with each column of `$B$` gives `$0\cdot1 + 1\cdot0 = 0$` and `$0$`; row 2 is all zeros).

</details>

9. Express `$A = \begin{pmatrix}3 & 5\\1 & -1\end{pmatrix}$` as the sum of a symmetric and a skew-symmetric matrix. *(3 marks)*
<details><summary>Answer</summary>

`$A^T = \begin{pmatrix}3 & 1\\5 & -1\end{pmatrix}$`. `$P = \tfrac12(A + A^T) = \begin{pmatrix}3 & 3\\3 & -1\end{pmatrix}$` (symmetric) and `$Q = \tfrac12(A - A^T) = \begin{pmatrix}0 & 2\\-2 & 0\end{pmatrix}$` (skew-symmetric). Check: `$P + Q = \begin{pmatrix}3 & 5\\1 & -1\end{pmatrix} = A$`.

</details>

10. If `$A = \begin{pmatrix}1 & 2\\0 & 1\end{pmatrix}$`, find `$A^2$` and `$A^3$` and guess `$A^n$`. *(3 marks)*
<details><summary>Answer</summary>

`$A^2 = \begin{pmatrix}1 & 4\\0 & 1\end{pmatrix}$`, `$A^3 = A^2A = \begin{pmatrix}1 & 6\\0 & 1\end{pmatrix}$`. The pattern is `$A^n = \begin{pmatrix}1 & 2n\\0 & 1\end{pmatrix}$`.

</details>

11. Find the inverse of `$A = \begin{pmatrix}3 & 4\\2 & 3\end{pmatrix}$` and verify it. *(3 marks)*
<details><summary>Answer</summary>

`$D = 9 - 8 = 1$`, so `$A^{-1} = \begin{pmatrix}3 & -4\\-2 & 3\end{pmatrix}$`.

Check: `$AA^{-1} = \begin{pmatrix}9 - 8 & -12 + 12\\6 - 6 & -8 + 9\end{pmatrix} = I$`.

</details>

<div class="problem" data-problem="c12m-mat-entry"></div>

<div class="problem" data-problem="c12m-mat-inverse"></div>

## 5-mark questions

12. If `$A$` and `$B$` are symmetric matrices of the same order, prove that `$AB$` is symmetric if and only if `$AB = BA$`. *(5 marks)*
<details><summary>Answer</summary>

`$A^T = A$` and `$B^T = B$`. Then `$(AB)^T = B^TA^T = BA$`.

If `$AB$` is symmetric then `$(AB)^T = AB$`, so `$BA = AB$`.

Conversely, if `$AB = BA$` then `$(AB)^T = BA = AB$`, so `$AB$` is symmetric. Hence `$AB$` is symmetric exactly when `$AB = BA$`.

</details>

13. Prove that `$(AB)^{-1} = B^{-1}A^{-1}$` for invertible `$A$` and `$B$` of the same order, and use it to find `$(AB)^{-1}$` for `$A = \begin{pmatrix}1 & 1\\0 & 1\end{pmatrix}$`, `$B = \begin{pmatrix}1 & 0\\1 & 1\end{pmatrix}$`. *(5 marks)*
<details><summary>Answer</summary>

`$(AB)(B^{-1}A^{-1}) = A(BB^{-1})A^{-1} = AIA^{-1} = AA^{-1} = I$`, and similarly `$(B^{-1}A^{-1})(AB) = I$`. By uniqueness of the inverse, `$(AB)^{-1} = B^{-1}A^{-1}$`.

`$A^{-1} = \begin{pmatrix}1 & -1\\0 & 1\end{pmatrix}$` and `$B^{-1} = \begin{pmatrix}1 & 0\\-1 & 1\end{pmatrix}$`. Then `$B^{-1}A^{-1} = \begin{pmatrix}1 & -1\\-1 & 2\end{pmatrix}$`.

Check: `$AB = \begin{pmatrix}2 & 1\\1 & 1\end{pmatrix}$` has determinant 1, so its inverse is `$\begin{pmatrix}1 & -1\\-1 & 2\end{pmatrix}$`. They match.

</details>

## Case-based question

14. Two bakeries, Anand and Bhavani, sell cakes, biscuits and pastries. In one week Anand sells 20 cakes, 50 packets of biscuits and 30 pastries; Bhavani sells 10 cakes, 80 packets and 40 pastries. The prices are ₹300 per cake, ₹40 per packet and ₹60 per pastry. *(4 marks)*

(a) Write the sales as a `$2 \times 3$` matrix `$S$` and the prices as a column matrix `$P$`. (b) Find the order of `$SP$` and compute it. (c) What does each entry of `$SP$` mean? (d) Find the total of both bakeries.

<details><summary>Answer</summary>

(a) `$S = \begin{pmatrix}20 & 50 & 30\\10 & 80 & 40\end{pmatrix}$`, `$P = \begin{pmatrix}300\\40\\60\end{pmatrix}$`.

(b) `$SP$` is `$2 \times 1$`: entry 1 is `$20\cdot300 + 50\cdot40 + 30\cdot60 = 6000 + 2000 + 1800 = 9800$`; entry 2 is `$10\cdot300 + 80\cdot40 + 40\cdot60 = 3000 + 3200 + 2400 = 8600$`.

(c) Each entry is the week's income of one bakery in rupees.

(d) `$9800 + 8600 = 18400$`, that is ₹18,400.

</details>

## Assertion and reason

For each, choose: (A) both true and R explains A, (B) both true but R does not explain A, (C) A true and R false, (D) A false and R true.

15. **Assertion:** `$AB \ne BA$` for matrices in general. **Reason:** Row-by-column multiplication depends on the order of the factors.
<details><summary>Answer</summary>(A). Swapping the factors swaps which one supplies the rows and which the columns, so the products usually differ.</details>

16. **Assertion:** If `$AB = O$` then `$A = O$` or `$B = O$`. **Reason:** For real numbers `$ab = 0$` implies `$a = 0$` or `$b = 0$`.
<details><summary>Answer</summary>(D). The assertion is false for matrices (`$\begin{pmatrix}0&1\\0&0\end{pmatrix}^2 = O$`); the reason is true for numbers, but it does not carry over.</details>

17. **Assertion:** Every diagonal entry of a skew-symmetric matrix is zero. **Reason:** `$a_{ii} = -a_{ii}$` holds for a skew-symmetric matrix.
<details><summary>Answer</summary>(A). `$a_{ii} = -a_{ii}$` gives `$2a_{ii} = 0$`.</details>

## Question set

Mix of 1-mark to 5-mark problems from the chapter's bank, with fresh numbers:

<div class="qbank" data-bank="ncert-class-12-maths" data-topics="matrices" data-mode="practice" data-n="25"></div>

<div class="keypoints">

- Check orders first: equal for a sum, inner numbers equal for a product.
- Each entry of `$AB$` is a row of `$A$` times a column of `$B$`.
- `$AB \ne BA$` in general; `$(AB)^T = B^TA^T$`; `$(AB)^{-1} = B^{-1}A^{-1}$`.
- `$A + A^T$` is symmetric, `$A - A^T$` is skew-symmetric; `$A$` is their half-sum.
- For a 2 × 2 matrix, `$A^{-1} = \frac{1}{ad - bc}\begin{pmatrix}d & -b\\-c & a\end{pmatrix}$`.

</div>
