---
name: Meal planner
num: 2018
shelf: everyday
code: T866
section: recipes
title: "Meal planner: weekly meal plan with an automatic shopping list"
summary: "Plan breakfast, lunch, dinner and a snack for each day of the week, list each meal's ingredients, and get a shopping list that adds up repeated ingredients and groups them by aisle. Print it, save it as PDF or download a .txt."
status: live
ads: false
order: 2018
icon: calendar
works: offline
updated: 2026-11-10
related: [recipe-scaler, ingredient-swaps, planner, roast-time]
sources:
  - "fibub's own working. The shopping list adds amounts only when the unit is the same; aisle groups are matched from common ingredient words."
flow:
  - { icon: calendar, label: "Plan" }
  - { icon: pencil, label: "Ingredients" }
  - { icon: table, label: "List" }
  - { icon: download, label: "Print" }
---

## What it does

A week of meals on one screen: Monday to Sunday, each with a breakfast, lunch, dinner and snack slot. Type a meal name and its ingredients, and the shopping list underneath fills itself in. When the same ingredient turns up in two meals with the same unit, it is added up, so two lots of 200 g rice become one line of 400 g rice.

The list is grouped roughly by aisle. To make a recipe serve more people first, use the [[recipe-scaler]]; if something on the list is missing at home, try [[ingredient-swaps]].

## How to use it

1. Press Clear for an empty week, or edit the example.
2. In any slot, type the meal name, then its ingredients one per line with the amount first: 200 g rice, 2 eggs, 1 can chopped tomatoes.
3. Read the shopping list at the bottom.
4. Press Print or save as PDF, Download .txt, or Copy list.

## What each setting does

- **Meal and ingredients boxes**: one pair per slot. Lines without a number at the start, like "salt", are listed once without an amount.
- **Remember my plan on this device**: off by default. When ticked, the plan is kept in this browser only and comes back next visit. Unticking it deletes the saved copy.
- **Clear**: empties every slot, unticks Remember and deletes any saved plan.
- **Print or save as PDF**: prints a table of the week and the shopping list. Pick "Save as PDF" to keep a file.
- **Download .txt**: a plain text file with the plan and a tick-box shopping list.

## Worked example

The example plans chicken fried rice on Monday and dal with rice on Tuesday, each with 200 g rice. The shopping list shows 400 g rice under Bread, grains and pasta. Porridge on two mornings, each with 50 g oats and 250 ml milk, gives 100 g oats and 500 ml milk, and two cloves of garlic in each of two dinners give 4 cloves garlic.

## FAQs

**Why are 200 g and 1 cup of rice on one line but not added?** They are different units, so the list shows "200 g + 1 cup rice" rather than guess.

**Is my plan sent anywhere?** No. It stays on this page, and in this browser only if you tick Remember.
