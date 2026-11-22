---
title: Writing it up for your portfolio
seoTitle: 'How to present a Power BI project in your portfolio'
summary: Turn the capstone into a portfolio page and an interview story. What to include, a template, screenshots, and how to talk about it in two minutes.
minutes: 12
updated: 2026-11-22
quiz:
  - q: What should the first line of a portfolio project say?
    choices: ['The tools you used', 'The business problem and who it helps', 'Your name']
    ans: 1
    why: Hiring managers care about the problem solved. Tools come after.
  - q: Which is the better way to describe a measure in an interview?
    choices: ['"I used CALCULATE"', '"Pace % compares year to date with the same days last year, so managers see if they''re ahead without one bad month swinging it"', '"I wrote lots of DAX"']
    ans: 1
    why: Explain what it does for the reader and why you chose it. That shows understanding, not just syntax.
  - q: The data is made up. Should you say so?
    choices: ['No, hide it', 'Yes: say it is a realistic synthetic dataset, and focus on the modelling and decisions', 'Only if asked']
    ans: 1
    why: Honesty builds trust. Synthetic data is normal for portfolio work; the skills are real.
---

**Module 9 · about 12 minutes · read first: 9.2.** You'll have a portfolio write-up and a two-minute interview story for the dashboard.

## 1. Why this matters

A dashboard on your laptop isn't visible to employers. A clear write-up with screenshots, on your portfolio site and linked from LinkedIn and your CV, is.

## 2. The page template

1. **Title and one line:** "Store performance dashboard for a 5-store retailer: weekly view of sales against last year and target."
2. **The problem:** managers answered "how are we doing?" with spreadsheets; numbers disagreed.
3. **The users and questions:** the table from Lesson 9.1, shortened.
4. **The model:** a screenshot of Model view; one sentence on the star schema and the date table; how targets at month grain were brought in (TREATAS).
5. **Key measures:** 3 or 4, with the DAX and one line each on why (Pace %, vs Target %, Margin %, Product Rank).
6. **The pages:** one screenshot each, with the question it answers.
7. **Security and performance:** RLS roles; Performance Analyzer result.
8. **What I'd do next:** like-for-like, stock data, a calculation group.
9. **Honest note:** "Data is a realistic synthetic dataset (Northbay Goods, fibub.com); the modelling and DAX are my own."

Keep it to one screen of text plus images. Put the .pbix and screenshots in a GitHub repository with a short README (the TMDL/.pbip format shows your model as readable code).

## 3. The two-minute story (STAR)

- **Situation:** a retailer whose store managers had no reliable weekly view.
- **Task:** one report for store, regional and head-office users, against last year and target.
- **Action:** modelled a star schema with a marked date table; wrote time intelligence for pace and growth; brought monthly targets to daily data with TREATAS; drill through from region to store; RLS by store; checked every total against a test query.
- **Result:** one Monday report for three audiences; numbers that reconcile; under one second per visual.

Practise it aloud until it takes two minutes.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** show decisions, not just results. "I chose single-direction relationships and counted products in the fact table instead of making the relationship bidirectional, because…" tells an interviewer more than any screenshot.

**Try it:** write down three decisions you made in the build and the reason for each.
</details>

## 4. Practice

1. Write your project's one-line description.
2. Pick the measure you're proudest of and explain it in two sentences without saying "CALCULATE".
3. What would you answer to "what would you improve?"

<details>
<summary>Answers</summary>

1. Example: "A weekly store performance report showing each manager their sales against last year and target, built in Power BI on a star schema."
2. Example: "Pace compares this year so far with the same days last year, so managers see whether the year is on track. It stays steady even when one week is unusual."
3. Example: "Add stock data to explain lost sales, like-for-like growth, and automated tests of key totals after each refresh."
</details>
