---
title: "Shading set expressions on a Venn diagram, with counting"
summary: "How the Venn diagram calculator reads set notation, shades the right regions, tests two expressions for equality and counts elements, with a worked example on the numbers 1 to 20."
tools: [venn-diagram, logic-simplifier, combinatorics-calculator]
updated: 2026-11-10
sources:
  - "Union, intersection, complement, difference, symmetric difference, De Morgan's laws and inclusion–exclusion: standard set theory."
  - "The sets in the worked example are made up; the results come from the tool's own code."
---

The Venn diagram calculator lets you type set notation such as A − (B ∪ C) and see exactly which part of a two- or three-circle diagram it means. It can also put two expressions side by side to show whether they are the same set, and it fills the circles with your own elements so you can check counting answers. It is made for Class 11 students and anyone revising sets. The same laws appear in true/false logic, which the [[logic-simplifier]] works through; for counting selections and arrangements go to the [[combinatorics-calculator]]; and to turn regions into probabilities, open the [[blog:howto/how-to-find-probability-with-a-venn-diagram|guide to probability with a Venn diagram]].

## What it is

A **set** is a collection of things, called elements. The rectangle stands for the **universal set** U, everything under discussion. Each circle is one set.

With three circles, the rectangle splits into 8 separate **regions**, and every element sits in exactly one of them. Each region is described by being in or out of each set, such as A ∩ B′ ∩ C (in A and C, but not B). Any set expression, however long, picks out some of those 8 regions. That is why two expressions are equal exactly when they shade the same regions.

The operations:

- **A ∪ B** (union): in A or B or both.
- **A ∩ B** (intersection): in both.
- **A′** (complement): in U but not in A.
- **A − B** (difference): in A but not in B.
- **A Δ B** (symmetric difference): in exactly one of the two.

For counting, the **inclusion–exclusion** rule stops you counting shared elements twice:

n(A ∪ B) = n(A) + n(B) − n(A ∩ B)

n(A ∪ B ∪ C) = n(A) + n(B) + n(C) − n(A ∩ B) − n(B ∩ C) − n(A ∩ C) + n(A ∩ B ∩ C)

where n( ) means "the number of elements in".

## How to use it

1. Pick **2 sets** or **3 sets** at the top.
2. Type in the **Expression** box, use the symbol keys, or choose from **Examples**. On a keyboard, u means ∪, n means ∩, an apostrophe means ′ and a minus sign means −.
3. Read the heading above the diagram to see how the tool understood you, then the line under it that names every shaded region.
4. Under **Compare with another expression**, type a second expression, or press one of the ready-made buttons (the two De Morgan laws, or the distributive law). The tool says "Equal" or lists the regions where they differ, with a second diagram.
5. Tick **Put real elements in the sets** in **Use my own elements** and fill in U, A, B and C. Ranges like 1-20 and lists like 2, 4, 6 both work, and so do words.
6. Try the five practice questions at the bottom; each has a worked answer.

## A worked example

Let U be the whole numbers 1 to 20. A is the even numbers, B is the multiples of 3, and C is the primes:

- A = {2, 4, 6, 8, 10, 12, 14, 16, 18, 20}, so n(A) = 10
- B = {3, 6, 9, 12, 15, 18}, so n(B) = 6
- C = {2, 3, 5, 7, 11, 13, 17, 19}, so n(C) = 8

**Question: which even numbers are neither multiples of 3 nor prime?** Type **A − (B ∪ C)**. One region is shaded, A ∩ B′ ∩ C′, and the result is **{4, 8, 10, 14, 16, 20}**, so n = 6.

**Check it another way.** Put A ∩ B′ ∩ C′ in the second box. The tool says the two are equal, because both shade only that one region.

**Pairs and the triple.** A ∩ B = {6, 12, 18} (3 elements), B ∩ C = {3} (1), A ∩ C = {2} (1), and A ∩ B ∩ C is empty (0), because no prime is a multiple of 6.

**Inclusion–exclusion.** n(A ∪ B ∪ C) = 10 + 6 + 8 − 3 − 1 − 1 + 0 = **19**. Only one number from 1 to 20 is in none of the sets: (A ∪ B ∪ C)′ = **{1}**, and 20 − 19 = 1 agrees.

**Two sets only.** n(A ∪ B) = 10 + 6 − 3 = **13**, so 20 − 13 = **7** numbers are neither even nor a multiple of 3: n(A′ ∩ B′) = 7, as De Morgan's law predicts.

## Where it is used

- **Surveys.** "How many people use neither app?" is n(A′ ∩ B′), worked from the totals with inclusion–exclusion.
- **Databases and search.** Filters with AND, OR and NOT are intersections, unions and complements, so a Venn diagram shows what a query really returns.
- **Probability.** Events are sets of outcomes, and the same addition rule gives P(A or B).

## Common mistakes

- **Leaving out brackets.** Union and difference are read left to right, so A − B ∪ C means (A − B) ∪ C. On the sets above that gives 14 elements, not the 6 you wanted. Write A − (B ∪ C).
- **Taking the complement of each set inside a union.** (A ∪ B)′ is A′ ∩ B′, not A′ ∪ B′. The compare box shows the difference at once.
- **Adding the overlaps instead of subtracting.** In inclusion–exclusion the pairs are taken away and the triple added back. Fill in your own elements and the tool shows the full sum.
- **Forgetting elements outside every circle.** Counting questions often ask about the region outside A, B and C. It belongs to U, so subtract from n(U).

## Questions people ask

**Is A − B the same as A ∩ B′?** Yes. Type both, and the compare box says they are equal.

**What does it do with an element that is in A but not in U?** It leaves it out and tells you which elements it dropped, since everything must belong to the universal set.

**Can the sets hold words?** Yes. Type U = cat, dog, fish, bird and so on, and the regions show the words instead of numbers.
