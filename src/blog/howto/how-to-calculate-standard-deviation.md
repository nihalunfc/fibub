---
title: "How to calculate standard deviation (step by step, with an example)"
summary: "Find the mean, square each distance from it, average the squares and take the square root. A worked example by hand and with a live tool, plus the n − 1 sample version."
tools: [spread-explorer, grouped-data-stats, histogram-builder]
updated: 2026-11-10
sources:
  - "Population and sample standard deviation and the coefficient of variation: standard descriptive statistics, as in any introductory statistics text."
  - "The plant height data in the example are made up for this article."
---

The standard deviation is the square root of the average squared distance of your values from their mean: subtract the mean from each value, square the results, average them, then take the square root. The [[spread-explorer]] works it out as you type, draws each value's distance from the mean, and opens the full working table so you can follow every line.

## What you need

- **A list of numbers**, at least two, such as test marks, heights or reaction times. The explorer takes 2 to 30 values in each box.
- **To know whether you want the population or the sample version.** If your list is the whole group you care about (every pupil in one class), divide by n. If it is a sample used to estimate a bigger group, divide by n − 1. The second gives a slightly larger number.
- A second list is useful too. The explorer always shows two sets side by side, which is the best way to see what the number means.

## Step by step

1. Open the [[spread-explorer]]. It starts with an example; that is fine, because you will replace the numbers.
2. Type your list into the **first box**, separated by commas or spaces. Type a second list for comparison into the second box. The labels stay as the example's names, so read the first column as your first list.
3. Read the table under the picture. It gives n, the mean, the median, the range, the mean deviation, the variance σ² and the standard deviation σ for both sets, plus the coefficient of variation.
4. Use the two buttons next to **Show** to switch the bars between plain distances |x − x̄| and blocks for the squared distances (x − x̄)², which are what the variance adds up.
5. Open **Show the working** for a table of x, x − x̄, |x − x̄| and (x − x̄)² for the first set, with the sums at the bottom.
6. Drag any dot along the number line to see how one value changes the spread. Dragged dots snap to whole numbers.

The formulas, with x̄ the mean and n the number of values:

- Population: σ = √[ Σ(x − x̄)² ÷ n ]
- Sample: s = √[ Σ(x − x̄)² ÷ (n − 1) ]

The explorer uses the first (divide by n), the version taught in school. For the sample version, take its variance, multiply by n ÷ (n − 1), and take the square root.

## A worked example

Six bean seedlings in one tray are 12, 15, 11, 18, 14 and 14 cm tall.

1. Mean: (12 + 15 + 11 + 18 + 14 + 14) ÷ 6 = 84 ÷ 6 = 14 cm
2. Distances from the mean: −2, +1, −3, +4, 0, 0 cm
3. Squares: 4, 1, 9, 16, 0, 0 cm², which add up to 30 cm²
4. Variance: 30 ÷ 6 = 5 cm²
5. Standard deviation: √5 = **2.24 cm**

If these six are a sample from a whole field of seedlings, use n − 1 instead: 30 ÷ 5 = 6 cm², and s = √6 = **2.45 cm**.

Now put 12, 15, 11, 18, 14, 14 in the first box and a second tray, 8, 20, 6, 22, 14, 14, in the second. Both trays have a mean and median of 14 cm. The table shows a standard deviation of 2.24 for the first and 5.77 for the second, and coefficients of variation of 15.97 % and 41.24 %. The line under the table names the second tray as more variable. The working table for the first tray shows the same 30 ÷ 6 = 5 you did by hand.

## Check your answer

- **It can never be negative**, and it is zero only when every value is the same.
- **It is never more than half the range** (for the divide-by-n version). Here the range is 18 − 11 = 7 cm and the SD is 2.24 cm. A standard deviation bigger than the whole range means a slip.
- **Shift test.** Add 10 cm to every seedling. The mean becomes 24 cm, but the standard deviation stays 2.24 cm. Try it in the box: the spread figures do not move.
- **Units.** The standard deviation has the same units as the data (cm); the variance has squared units (cm²).

## Questions people ask

**Why square the distances instead of just averaging them?** Positive and negative distances would cancel to zero. Squaring removes the signs and gives far-off values more weight. Averaging the plain distances is also a measure, the mean deviation, and the explorer shows it on the row above the variance.

**My calculator gives a different number. Which is right?** Both, probably. Many calculators show σₙ (divide by n) and sₙ₋₁ (divide by n − 1) on separate keys. Check which key you pressed against the two formulas above.

**What if my data are in a frequency table?** Start with [[grouped-data-stats]] for the mean of grouped data. Then square each class midpoint's distance from that mean, multiply by its frequency, add, divide by the total frequency and take the root. To see the spread as a shape, draw the values with the [[histogram-builder]].
