---
title: 'Cleaning: types, blanks, trims and splits'
seoTitle: 'Clean data in Power Query: types, blanks, trim, split'
summary: The cleaning steps you'll use on almost every file, what each one does to the data, and the mistakes that make refreshes fail.
minutes: 16
updated: 2026-11-22
quiz:
  - q: A Qty column holds "2", "1" and "N/A". What happens when you change its type to Whole number?
    choices: ['Power Query refuses', '"N/A" becomes an Error value; replace errors (or the text) with null first or after', 'N/A becomes 0']
    ans: 1
    why: 'Text that can''t be a number gives an Error in that cell. Replace values or Replace errors turns it into null, which is honest: the quantity is unknown.'
  - q: '"03/01/2025" should be 3 January. What controls how Power Query reads it?'
    choices: ['The font', 'The locale used for the type change (Using locale…)', 'The column name']
    ans: 1
    why: Day/month order depends on the locale. Change type > Using locale lets you say "English (Canada)" or "English (United States)" for that column.
  - q: Why is null better than 0 for a missing quantity?
    choices: ['It isn''t', 'Null says "unknown" and is skipped by averages and counts; 0 pretends you know it was zero', 'Null uses less space']
    ans: 1
    why: A 0 drags averages down and hides the problem. A null is ignored by AVERAGE and COUNT and can be counted as missing.
---

**Module 2 · about 16 minutes · read first: 2.1.** You'll be able to pick the right cleaning step for each problem and avoid the ones that break refreshes.

## 1. Why this matters

Most of a BI developer's time goes on getting data right, not on charts. These steps fix 90 % of what you'll meet.

## 2. The steps in one picture

<!--fig:pq-steps clean-->

## 3. The cleaning toolkit

| Problem | Step (where to find it) | What it does |
|---|---|---|
| First row holds the headers | Home > **Use first row as headers** | Promotes the row to column names |
| Spaces at the start or end | Transform > Format > **Trim** | `"  falls centre "` → `"falls centre"` |
| Hidden characters (line breaks) | Transform > Format > **Clean** | Removes non-printing characters |
| Mixed case | Format > **Capitalize Each Word** / UPPERCASE | Makes spellings match |
| Text instead of numbers or dates | **Data type** icon on the column header | Converts; bad values become Error |
| Day/month order | Data type > **Using locale…** | Reads dates with the right country rules |
| "N/A", "-", "?" | Transform > **Replace values** | Replace with null |
| Error cells | Right-click > **Replace errors** or **Remove errors** | Deal with failed conversions |
| Empty rows | Home > Remove rows > **Remove blank rows** | Drops rows that are all blank |
| Totals, subtotals, notes | Column filter arrow > untick, or **Text filters** | Keeps only real data rows |
| Two facts in one column | Transform > **Split column** > By delimiter | `"Desk lamp - Large"` → two columns |
| Same row twice | Home > Remove rows > **Remove duplicates** | Keeps the first of each identical row (on the selected columns) |
| A new calculated value | Add column > **Custom column** | e.g. `[Qty] * [Price]` row by row |

## 4. Types: the part that breaks refreshes

Power Query guesses types when it loads a file ("Changed Type" step). Guesses go wrong: product codes like `00123` become the number 123, and a column that was numbers last month gets "N/A" this month. Rules:

- Set types **yourself**, after cleaning, in one step you've checked.
- Keep codes and IDs that start with 0 as **text**.
- Use **Fixed decimal number** (currency) for money: it avoids floating-point rounding surprises.
- After a type change, check **View > Column quality** for Errors and Empty percentages.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** clean data has one meaning per column, one type per column, one spelling per value and one row per event. Each step in the table above restores one of those four.

**Try it:** which of the four does "Remove duplicates" restore? (One row per event.) And "Capitalize Each Word"? (One spelling per value.)
</details>

## 5. Worked example

*Northbay's Rideau store sends a file with "Qty" values 2, 1, N/A, 3.* Change type to Whole number: the N/A cell becomes Error. Replace errors with null. Now `SUM` of Qty is 6 and `COUNT` is 3, and a data quality card can show "1 line missing quantity", which you report to the store instead of hiding it.

## 6. Practice

1. Which step fixes "Queen Street", "QUEEN STREET" and "queen street " so they group together? (Two steps.)
2. A column of postal codes became numbers and lost letters. What went wrong and how do you fix it?
3. When should you use Remove duplicates, and when is it dangerous?

<details>
<summary>Answers</summary>

1. Trim, then Capitalize Each Word.
2. The type was guessed wrongly (or set to number). Remove that Changed Type step or set the column to Text.
3. Use it when an export repeats identical rows by mistake. It is dangerous on a fact table where two identical order lines really happened (same product, same day, same quantity): you'd delete a real sale. Remove duplicates on a key column instead, if one exists.
</details>
