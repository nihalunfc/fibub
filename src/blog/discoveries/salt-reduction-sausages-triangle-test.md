---
title: "Salt reduction in sausages: can tasters tell? Triangle test study"
summary: "A 2025 Czech study cut the salt in grilling sausages and frankfurters and asked trained panels to spot the difference. Here is how to test such panel results yourself."
tools: [sensory-difference-test, sample-size, recipe-nutrition-calculator]
updated: 2026-11-10
sources:
  - "Jůzl M et al. (2025), Foods 14(18): 3150, CC BY, the paper described here."
  - "Triangle test and its chance level of one in three: ISO 4120 (sensory analysis, triangle test). Exact binomial test, proportion of distinguishers (guessing model) and Thurstonian d′: standard sensory statistics."
paper:
  title: "The Effect of Salt Reduction on Sensory, Physicochemical, and Microbial Quality in Selected Meat Products"
  authors: "Jůzl M, Kameník J, Saláková A, Macharáčková B, Ježek F, Janík Piechowiczová M, Slováček J"
  journal: "Foods"
  year: 2025
  doi: "10.3390/foods14183150"
  url: "https://www.mdpi.com/2304-8158/14/18/3150"
  licence: "CC BY"
  reviewed: true
---

Most of the salt people eat comes from processed food, and cooked sausages are a big part of that in Central Europe. A meat science team in the Czech Republic made two classic products with four salt levels and asked trained tasters whether they could tell a lower-salt sausage from the usual one. Their answer, in the journal Foods (2025, CC BY): a big cut was noticed, a small step mostly was not. The tasters did this with triangle tests, where each person gets three samples and must pick the odd one. This page explains the study in our own words and shows how the [[sensory-difference-test]] turns "how many got it right" into a p-value, a size of difference and a panel-size plan. To plan a panel in general terms, see the [[sample-size|sample size calculator]], and to see what a salt cut does to a label, the [[recipe-nutrition-calculator]].

## What they found

The team made Špekáčky (thick Czech grilling sausages) and frankfurters with 1.4, 1.6, 1.8 and 2.0 % salt, where 2.0 % was the normal recipe. In triangle tests, the paper reports that about 64 % of a 73-person panel picked out the odd sample when 1.4 % sausages were set against 2.0 % ones, and about 62 % of a 63-person panel did so for frankfurters. When the gap was only 1.6 against 1.8 %, the share correct fell to about 52 % and 44 %.

In profile tests, saltiness was the only trait that changed in a clear way. Colour after cooking, microbial counts during two weeks of cold storage and most other traits did not differ much. The authors suggest 1.6 to 1.8 % salt as a sensible target for both products.

## Why it matters

Health agencies ask meat makers to cut salt, but salt also binds water, helps texture and slows spoilage. Makers need to know how far they can go before shoppers notice. A triangle test is the industry's standard way to ask that question, and the answer depends on how many tasters you use and how you read the count.

## How they did it

1. They made both sausage types in a pilot plant, in two separate batches, changing only the salt.
2. They measured salt content by two lab methods and found that the method mattered a great deal for the result.
3. Trained panelists, selected to ISO 8586, tasted the products three weeks after production.
4. Triangle tests compared pairs of salt levels; a ranking test asked panelists to order samples by saltiness; a profile test scored several traits.
5. They tested the triangle results with the exact binomial test and the other scores with standard analysis of variance.
6. They also measured colour, dry matter and bacterial counts.

## Check it yourself with fibub

Here is a worked example with **our own invented numbers**, not the paper's data. Imagine a soup maker testing a 25 % salt cut with 60 tasters in a triangle test.

1. Open the [[sensory-difference-test]]. Set **Test** to Triangle, **Answers (n)** to 60, **Correct** to 30, and leave α at 0.05.
2. The headline reads **Significant: 30 of 60 correct, p = 0.0056**. The facts list shows that 27 correct would have been the fewest needed, that the proportion of distinguishers is 25.0 ± 9.7 %, and that d′ = 1.47 ± 0.34. The proportion of distinguishers is the share of tasters who truly noticed, once lucky guesses are taken out.
3. Now change **Correct** to 25. The result becomes **Not significant, p = 0.1101**, with 12.5 ± 9.5 % distinguishers and d′ 0.99. The page reminds you that this does not prove the soups taste the same.
4. In the **Power and sample size** card, keep "Distinguishers (%)", type 20 and keep 80 % power. With n = 60 the page gives a power of **65.0 %**, and says **87 answers** are needed for 80 %. It also notes that 20 % distinguishers means a 46.7 % chance of a right answer and d′ 1.29.
5. Switch **Test** to Tetrad, set the difference as d′ and type 1.29. The same real difference now needs only **29 answers** for 80 % power. Tetrads (four samples, sort into two pairs) give tasters more to compare, so they are more sensitive.
6. In the last card, set n from 60 to 75 to see the fewest correct answers at each α, then download the table as CSV.

You can also try the headline shares the paper reports. A panel of 73 needs 32 correct out of 73 at α 0.05 in a triangle test, so a share near 64 % (about 47 people) is far past the line. For 63 tasters the line is 28, so 44 % (about 28) sits right at the edge. Which of the smaller steps passed depends on the panel behind each share, so use the paper's own tables for the exact numbers.

## The fine print

- The study covers two sausage types from one pilot plant, two batches each, tasted at one time point.
- The panel was trained, so ordinary shoppers may notice less, or more if they eat these products often.
- Fat and protein can mask saltiness, so other recipes may behave differently.
- Salt content measured by two methods disagreed in places, which adds doubt to the exact levels.
- A non-significant triangle test is not proof that two products are the same; that needs a test planned for similarity, with enough tasters for high power.
- This is food science, not dietary advice. For salt intake, check the official guidance where you live.
