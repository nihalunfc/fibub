---
title: "How to calculate CFU/mL from a serial dilution (with a worked example)"
summary: "Divide the colonies on a countable plate by the volume plated times its dilution. How to pool duplicate plates, which plates to leave out, and a worked culture example."
tools: [cfu-counter, solution-calculator, hemocytometer]
updated: 2026-11-10
sources:
  - "Viable plate count method and the 30 to 300 colony countable range: standard microbiology practice; check the range your own method or standard asks for."
  - "Exact Poisson confidence interval and chi-square agreement test: standard statistics."
  - "Worked example counts: made up for this article."
---

To get colony-forming units per mL, take a plate with a countable number of colonies and divide that count by the volume you spread times the dilution of the tube it came from. When two or more plates are countable, add up all their colonies and divide by all the sample they received together. The [[cfu-counter]] does this from a typed table of plates, and can count the colonies on a plate photo too.

## What you need

- **Your dilution series.** Write each tube as a fraction of the original sample: a 1 in 10 step from the neat culture is 10⁻¹, the next tube 10⁻², and so on.
- **The volume spread or poured on each plate**, usually 0.1 mL (100 µL) for spread plates or 1 mL for pour plates.
- **The colony count on every plate** after incubation. Write TNTC (too numerous to count) for a crowded plate rather than guessing.
- **Your countable range.** 30 to 300 colonies is common; some methods use 25 to 250.

## Step by step

One colony is taken to grow from one live cell or clump, called a colony-forming unit (CFU). For a single plate:

**CFU/mL = colonies ÷ (volume plated in mL × dilution)**

So 150 colonies from 0.1 mL of the 10⁻⁵ tube means 150 ÷ (0.1 × 0.00001) = 1.5 × 10⁸ CFU/mL.

When several plates are countable, do not average their separate answers. Pool them instead:

**CFU/mL = (sum of colonies) ÷ (sum of volume × dilution for those plates)**

A plate that saw ten times more sample then has ten times the say.

With the tool:

1. Go to the **Plates and dilutions** box and type one plate per line: dilution, volume plated, colonies, and an optional name. Dilutions can be written as 1e-6, 10^-6 or 1:1000000; volumes as 0.1 or 100 µL.
2. Set **Countable from** and **Countable up to** to your method's range.
3. Choose the **Confidence** level (95 % is usual) and whether the **Result per** is mL or g of sample.
4. Read the result, its confidence interval, which plates were used and whether they agree.
5. If you have a photo of a plate, open it in the **Plate photo** box, check the rings the page draws on each colony, and type that plate's dilution and volume. Its count joins the table.

## A worked example

An overnight E. coli culture is diluted in 1 in 10 steps, and 0.1 mL of the 10⁻⁵, 10⁻⁶ and 10⁻⁷ tubes is spread on duplicate plates. After incubation:

| Plate | Dilution | Colonies |
|---|---|---|
| A5, B5 | 10⁻⁵ | TNTC, TNTC |
| A6, B6 | 10⁻⁶ | 212, 236 |
| A7, B7 | 10⁻⁷ | 25, 19 |

Typed into the tool as lines such as `1e-6, 0.1, 212, A6`, with the range left at 30 to 300, only the two 10⁻⁶ plates count. Their colonies add to 448, and each received 0.1 × 10⁻⁶ = 1 × 10⁻⁷ mL of culture, so 2 × 10⁻⁷ mL in all:

448 ÷ (2 × 10⁻⁷) = **2.24 × 10⁹ CFU/mL**, shown as **2.2 × 10⁹ CFU/mL** to two significant figures.

The page gives a 95 % interval of 2.04 × 10⁹ to 2.46 × 10⁹ CFU/mL. Its agreement check gives χ² = 1.29 with p = 0.26, so the two duplicates differ by no more than counting alone would explain. One colony on these plates stands for 5 × 10⁶ CFU/mL.

If your lab uses 25 to 250 instead, plate A7 (25 colonies) joins in. Now 473 colonies over 2.1 × 10⁻⁷ mL gives 2.25 × 10⁹, rounded to 2.3 × 10⁹ CFU/mL. The answer barely moves, which is a good sign.

## Check your answer

- **Neighbouring dilutions should differ about tenfold.** The 10⁻⁶ plates averaged 224 colonies and the 10⁻⁷ plates 22. That roughly 10 to 1 ratio says the dilution steps were made correctly.
- **Each plate alone should give a similar answer.** 212 and 236 colonies on 10⁻⁷ mL give 2.12 × 10⁹ and 2.36 × 10⁹, either side of the pooled result.
- **Look at the size.** A dense overnight culture of E. coli is usually in the range of 10⁹ CFU/mL. A result of 10¹² or 10⁵ almost always means a dilution was entered one place wrong, or the plated volume was typed as 100 instead of 100 µL.

Plan the dilution tubes beforehand with the [[solution-calculator|dilution calculator]], and if you want a total cell count to set beside your live count, use the [[hemocytometer]] (there is a how-to on [[blog:howto/how-to-count-cells-with-a-hemocytometer|counting cells with a hemocytometer]]).

## Questions people ask

**What if no plate falls in the countable range?** The tool uses the plate nearest the range and labels the result "Estimated". Report it that way.

**How do I get CFU per gram for food or soil?** Count the first suspension (say 10 g in 90 mL of diluent) as your 10⁻¹ step, so every dilution includes it, and pick "g of sample" under Result per.

**Why can CFU/mL be lower than a microscope count?** Dead cells are counted under the microscope but make no colony, and a chain or clump of several cells grows into just one colony.
