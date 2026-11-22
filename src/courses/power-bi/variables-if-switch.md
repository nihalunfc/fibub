---
title: Variables, IF and SWITCH
seoTitle: 'DAX VAR, IF and SWITCH with examples'
summary: VAR names a step so long measures read like a recipe and run faster. IF and SWITCH choose between results. Rewrite a measure with variables and build a SWITCH(TRUE()) band.
minutes: 15
updated: 2026-11-22
quiz:
  - q: When is a VAR evaluated?
    choices: ['Every time it is used', 'Once, where it is defined, in the filter context at that point', 'Never']
    ans: 1
    why: A variable is computed once and then fixed. Using it three times costs one calculation, and it doesn't change if CALCULATE changes filters later.
  - q: In SWITCH(TRUE(), [S] >= 100, "Big", [S] >= 50, "Medium", "Small"), what does 120 give?
    choices: ['"Big"', '"Medium"', 'Both']
    ans: 0
    why: SWITCH(TRUE(), ...) returns the result of the first test that is true. Put the strictest test first.
  - q: How do you show 0 instead of blank?
    choices: ['IF(ISBLANK([M]), 0, [M]) or [M] + 0', 'You cannot', 'BLANK(0)']
    ans: 0
    why: Both turn blank into 0. Use it only where zeros help, because visuals then show every row, even products a store never sells.
---

**Module 4 · about 15 minutes · read first: 4.2.** You'll be able to use VAR, IF and SWITCH to write readable measures.

## 1. Why this matters

Real measures grow: "growth vs last year, but blank if the store didn't exist last year". Variables keep them readable, and readable DAX is what reviewers and interviewers look for.

## 2. Variables

```
Measure =
VAR Name1 = <expression>
VAR Name2 = <expression using Name1>
RETURN <result using the names>
```

<!--fig:dax-pad v-margin-->

Benefits: each step has a name (self-documenting), each is computed once (faster), and you can debug by temporarily writing `RETURN Cost` to see a step's value.

## 3. IF and SWITCH

`IF(test, then, else)`: if `else` is left out, it returns blank.

`SWITCH(value, match1, result1, match2, result2, …, else)` compares one value to a list. With `TRUE()` as the value, it becomes "first test that is true wins", which is the clean way to write bands:

<!--fig:dax-pad v-band-->

## 4. Blank or zero?

<!--fig:dax-pad v-if-blank-->

With blanks, Forks Market's months before it opened disappear from the visual. With zeros, they appear as 0. Choose on purpose: zeros are right for "we sold nothing" on a day the store was open; blanks are right for "this didn't exist".

<details class="maths" open>
<summary>Principle</summary>

**Principle:** a VAR is evaluated once, in the filter context where it is defined. That makes measures faster and predictable, and it has one consequence to remember: if you define `VAR S = [Total Sales]` and later use `CALCULATE(S, ...)`, the CALCULATE cannot change S, which was already computed. Put measures, not variables, inside CALCULATE when the filter should apply.

**Try it:** what does `VAR X = 5 RETURN X * X` give? (25.)
</details>

## 5. Worked example

*Growth that respects new stores.*

```
Growth % =
VAR ThisYear = [Total Sales]
VAR LastYear = CALCULATE([Total Sales], SAMEPERIODLASTYEAR('Date'[Date]))
RETURN IF(ISBLANK(LastYear), BLANK(), DIVIDE(ThisYear - LastYear, LastYear))
```

Forks Market opened in 2025, so its growth is blank instead of a misleading figure. You'll build this properly in Lesson 6.2.

## 6. Practice

1. Rewrite `Average Line` with two variables.
2. Write `Season` for `'Date'[MonthNo]` with SWITCH: 12, 1, 2 → "Winter"; 6, 7, 8 → "Summer"; else "Spring/Autumn". (Hint: SWITCH(TRUE(), [M] IN {12, 1, 2}, …) with `VAR M = SELECTEDVALUE('Date'[MonthNo])`.)
3. Why might `[Total Sales] + 0` be a bad idea in a table of products by store?

<details>
<summary>Answers</summary>

1. `VAR S = SUM(Sales[Amount]) VAR L = COUNTROWS(Sales) RETURN DIVIDE(S, L)`.
2. `VAR M = SELECTEDVALUE('Date'[MonthNo]) RETURN SWITCH(TRUE(), M IN {12, 1, 2}, "Winter", M IN {6, 7, 8}, "Summer", "Spring/Autumn")`.
3. Every combination shows, including products a store never stocked, so the table becomes long and noisy.
</details>
