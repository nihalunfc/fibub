---
title: "Probability trees: how to read one and find P(A | B)"
summary: "How a two-stage probability tree works, how to multiply along its branches, and how Bayes' theorem reverses it: given a result, how likely is the cause?"
tools: [probability-tree]
updated: 2026-11-10
sources:
  - "Multiplication rule, theorem of total probability and Bayes' theorem: standard probability, taught in Class 12 maths. The factory and screening numbers are made up for this article and are not real data."
---

Many chance questions happen in two stages. First something happens or it does not; then something else happens, and its chance depends on the first. A probability tree lays this out as branches, so each path can be read off. The [[probability-tree]] tool draws the tree from three numbers you set with sliders, then works out every path, the total chance of the second event and the reverse chance. For the sets behind the same ideas, start with [[venn-diagram]]; for whole distributions, see [[distribution-explorer]]; and for real test figures, [[diagnostic-test-calculator]] uses the same reasoning.

## What it is

Call the first event A, and "not A" A′. The second event is B, and "not B" B′. The tree has two branches from the start, A and A′, and two branches from each of those, B and B′.

- **P(A)** is the chance of the first branch, A.
- **P(B | A)** is the chance of B given A. The bar means "given". From the A node, the two second-stage branches always add to 1, so P(B′ | A) = 1 − P(B | A).
- **P(A ∩ B)** is the chance of the whole path A then B. Multiply along the path: P(A ∩ B) = P(A) × P(B | A).
- **P(B)** adds the paths that end in B: P(B) = P(A ∩ B) + P(A′ ∩ B). This is the theorem of total probability.
- **P(A | B)** is the chance of A once you know B happened. Bayes' theorem divides the A path that ends in B by all paths that end in B: P(A | B) = P(A ∩ B) ÷ P(B).

Two events are **independent** when knowing one does not change the chance of the other, that is P(B | A) = P(B | A′).

## How to use it

1. Pick a **story** from the list (two bags of marbles, rain and a late bus, a screening test, two coin tosses), or choose *My own names* and type names for A and B.
2. Slide **P(A)**, **P(B | A)** and **P(B | A′)**. The tree, the facts and the dots all update as you move a slider.
3. Read the four path probabilities on the tree: P(A ∩ B), P(A ∩ B′), P(A′ ∩ B) and P(A′ ∩ B′). They always add to 1.
4. Read **P(A | B)** in the facts, with a sentence under it that says it in words.
5. In the 1000 dots, the filled dots are the cases where B happened. Count the blue ones (A as well): that fraction is P(A | B).

## A worked example

A factory checks parts with a sensor. Suppose 2 % of parts are faulty, so P(A) = 0.02. The sensor flags 95 % of faulty parts, P(B | A) = 0.95, and wrongly flags 3 % of good parts, P(B | A′) = 0.03.

- P(A ∩ B) = 0.02 × 0.95 = **0.019**
- P(A′) = 0.98, so P(A′ ∩ B) = 0.98 × 0.03 = **0.0294**
- P(B) = 0.019 + 0.0294 = **0.0484**
- P(A | B) = 0.019 ÷ 0.0484 ≈ **0.393**, so about **39 %**

Now the same in parts. Out of 10,000 parts there are 200 faulty ones, and 190 of them are flagged. The other 9,800 are good, and 294 of those are flagged by mistake. That makes 484 flags, of which 190 are real: 190 ÷ 484 ≈ 39 %. A flagged part is faulty only about 4 times in 10, even though the sensor catches 95 % of faults.

Change only one number. If 10 % of parts were faulty, P(A ∩ B) = 0.095 and P(A′ ∩ B) = 0.027, so P(A | B) ≈ 0.095 ÷ 0.122 ≈ **78 %**. The more common the fault, the more a flag means. All numbers are made up for teaching.

## Where it is used

- **Screening and diagnosis.** A positive result from a test for something rare is often a false alarm, because the many healthy people produce more false flags than the few sick people produce true ones.
- **Quality control.** A factory uses flags from sensors to decide which parts to inspect.
- **Spam filters.** Many filters ask how likely a message is to be spam, given that it contains a certain word. That is Bayes' theorem.
- **Weather.** Forecasters ask how likely rain is, given a cloudy morning.
- **Law and forensics.** Careful experts separate "the match is rare" from "the person is guilty", because the two chances are not the same.

## Common mistakes

1. **Mixing up P(B | A) and P(A | B).** Say the condition out loud: "given A" means the tree starts at A. P(A | B) starts from the result.
2. **Forgetting the A′ path.** Many false alarms come from the large group that does not have A. Always include P(A′ ∩ B) before you divide.
3. **Using numbers that do not add up.** From each node, the branches add to 1, so P(B′ | A) = 1 − P(B | A).
4. **Writing percentages as whole numbers.** 5 % is 0.05, not 5. A probability above 1 means a slip.
5. **Assuming independence.** Check it with P(B | A) = P(B | A′) before you multiply P(A) × P(B).

## Questions people ask

**Does the order of the two events matter?** For the tree, yes. You can start with B instead of A, but the branch numbers change. Start with the cause (the condition, the faulty part) when you know its chance, and the result second.

**What if I do not know P(B | A′)?** Then you cannot find P(B), and so cannot find P(A | B). You need the chance of the result among those without the cause, or a figure for P(B) from another source.
