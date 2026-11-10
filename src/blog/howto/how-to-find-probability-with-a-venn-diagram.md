---
title: "How to find probability using a Venn diagram (P(A or B) explained)"
summary: "Count the outcomes in each region of the Venn diagram, then divide by the total: P(A ∪ B) = P(A) + P(B) − P(A ∩ B). Worked example, a survey shortcut and checks."
tools: [venn-diagram, sample-space, probability-tree]
updated: 2026-11-10
sources:
  - "The addition rule P(A ∪ B) = P(A) + P(B) − P(A ∩ B), complements and equally likely outcomes: standard school probability and set theory."
---

To find a probability from a Venn diagram, count how many equally likely outcomes fall in the region you want and divide by the total number in the universal set; for "A or B" use P(A ∪ B) = P(A) + P(B) − P(A ∩ B), so the overlap is not counted twice. The [[venn-diagram]] calculator shades any region you type, sorts real elements into the right parts of the picture and gives the counts, which you then turn into probabilities.

## What you need

- **The universal set U**: every possible outcome, all equally likely. Picking a whole number from 1 to 30 gives 30.
- **The events A and B**, written as lists of outcomes (or as counts from a survey).
- **The words of the question** turned into set symbols:
  - "A or B" (or both) is A ∪ B, the union,
  - "A and B" is A ∩ B, the intersection,
  - "not A" is A′, the complement,
  - "A but not B" is A − B,
  - "neither" is (A ∪ B)′, which by De Morgan's law equals A′ ∩ B′.

## Step by step

The rule behind every answer is:

P(event) = number of outcomes in the event ÷ number of outcomes in U

and for two events,

P(A ∪ B) = P(A) + P(B) − P(A ∩ B).

The minus is there because adding P(A) and P(B) counts the overlap twice.

With the tool:

1. Open the Venn diagram calculator and press **2 sets**.
2. Type the event you want in the **Expression** box. The symbol keys add ∪, ∩, ′ and brackets, or you can type u, n and an apostrophe instead. The diagram shades that region, and the line under it names each shaded part.
3. Tick **Put real elements in the sets**. Type U, A and B as lists. Commas separate elements, and a dash gives a run, so 1-30 means every whole number from 1 to 30.
4. The result line writes your event out in full and gives n, its number of elements.
5. The counting facts below give n(U), n(A), n(B), n(A ∩ B), n(A ∪ B) with the subtraction shown, and the number in neither set.
6. Divide each count by n(U). The tool counts; turning a count into a probability is the one step you do yourself.

## A worked example

A whole number from 1 to 30 is picked at random. A is "a multiple of 3" and B is "a multiple of 5". Find the probability that the number is a multiple of 3 or 5, and the probability that it is neither.

- In the tool, type U as `1-30`, A as `3, 6, 9, 12, 15, 18, 21, 24, 27, 30` and B as `5, 10, 15, 20, 25, 30`.
- The counts: n(A) = 10, n(B) = 6, and the overlap A ∩ B = {15, 30}, so n(A ∩ B) = 2.
- n(A ∪ B) = 10 + 6 − 2 = **14**, so P(A ∪ B) = 14/30 = **7/15 ≈ 0.467**.
- With probabilities instead: 10/30 + 6/30 − 2/30 = 14/30, the same answer.
- Neither: n(A′ ∩ B′) = 30 − 14 = 16, so P(neither) = 16/30 = **8/15 ≈ 0.533**.
- Only a multiple of 3: type A − B as the expression. The result has 8 elements, so P = 8/30 = 4/15.

**A survey shortcut.** Many questions give counts, not lists: "In a class of 40, 22 play cricket, 15 play football and 7 play both." Give each set a run of numbers that overlaps by the right amount. Type U as `1-40`, A as `1-22` and B as `16-30`. Then A has 22 members, B has 15, and they share 16 to 22, which is 7. The tool gives n(A ∪ B) = 30 and 10 in neither, so P(plays at least one) = 30/40 = **0.75** and P(plays neither) = 10/40 = **0.25**.

## Check your answer

- **Regions add up.** The four parts of a two-set diagram (A only, B only, both, neither) must add to n(U). Here 8 + 4 + 2 + 16 = 30.
- **Complements add to 1.** P(A ∪ B) + P(neither) = 7/15 + 8/15 = 1.
- **Size limits.** P(A ∪ B) can never be smaller than the bigger of P(A) and P(B), nor larger than their sum. 14/30 lies between 10/30 and 16/30.
- **Count a few by hand.** Run down 1 to 30 and tick each multiple of 3 or 5. You should tick 14 numbers.

## Questions people ask

**When can I just add P(A) and P(B)?**
Only when A and B cannot happen together, so the overlap is empty. Rolling a 2 and rolling a 5 on one die is such a pair. Then P(A ∩ B) = 0 and the rule becomes a plain sum.

**What about dice, coins and cards?**
Writing out U gets long there. The [[sample-space]] builder lists every outcome of two dice, coins or a deck and shades the event for you; the counting rule is the same.

**How do I handle "B given A" questions?**
Conditional probability looks only inside A: P(B | A) = n(A ∩ B) ÷ n(A). In the first example that is 2/10 = 0.2. For problems built in stages, a [[probability-tree]] lays out each branch and its probability.
