---
title: "How umbilical cord stem cells are isolated changes their doubling time"
summary: "Three ways of getting mesenchymal stem cells out of Wharton's jelly gave cells that grew at different speeds. Here is how to work out a doubling time from your own counts."
tools: [cell-doubling-time, hemocytometer, growth-curve-od600]
updated: 2026-11-10
sources:
  - "Nguyen JL et al. (2026), PLOS ONE 21(3): e0345081, CC BY 4.0, the paper described here."
  - "Exponential growth, N = N₀ × 2^(t / Td), and the straight-line fit of ln(count) against time: standard arithmetic, computed here with the doubling time tool's own code."
  - "An improved Neubauer chamber holds 0.1 µL under each large square, so cells/mL = mean count per square × 10,000 × dilution."
paper:
  title: "Isolation methods influence the biological properties of Wharton's Jelly-derived mesenchymal stem cells: A comparative study of yield, viability, proliferation, differentiation potential, and proteomic profiles"
  authors: "Nguyen JL, Mohamed-Ahmed S, Saleem R, Mustafa K, Al-Sharabi N, Bentsen MHL"
  journal: "PLOS ONE"
  year: 2026
  doi: "10.1371/journal.pone.0345081"
  url: "https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0345081"
  licence: "CC BY 4.0"
  reviewed: true
---

Wharton's jelly is the soft tissue inside the umbilical cord. It is a popular source of mesenchymal stem cells, a kind of cell that can be grown in a dish and turned into bone or fat cells, because cords are discarded after birth and need no surgery to collect. A group in Norway asked a plain but neglected question: does the way you get the cells out of the jelly change the cells you end up with? Their answer, published in PLOS ONE in March 2026 under a CC BY licence, is yes, and one of the clearest differences is how fast the cells divide. If you want to repeat that part, the [[cell-doubling-time]] page does the arithmetic.

## What they found

The team compared three isolation methods on cords from three donors: letting cells crawl out of cut pieces of jelly (an explant), the same with the pieces scraped first, and digesting the tissue with the enzyme collagenase. Each method was run with and without bFGF, a growth factor added to the medium at 5 ng/mL.

Every method gave cells that looked and behaved like mesenchymal stem cells. The differences were in speed and robustness. Adding bFGF shortened the doubling time in all three methods, and without it the two explant methods were the slowest. Once bFGF was in the medium, the methods were no longer clearly different from each other. The enzyme method without bFGF was the fragile one: it failed early in two of the three cords, so that group had to be dropped.

## Why it matters

A doubling time is not a curiosity. It decides how long a batch of cells takes to reach a useful number, how many passages that takes, and therefore the cost and the risk that the cells drift or age in culture. Two labs following "the same" protocol but cutting versus digesting the tissue may be working with populations that reach a given dose weeks apart. The paper also compared the proteins the cells released, so it links a handling choice to what the cells actually do.

## How they did it

1. Cords from three full-term births were opened, the vessels removed, and the jelly either cut into pieces or digested with collagenase at 4 mg/mL for 30 minutes at 37 °C.
2. Cells were grown out, passaged, and checked by flow cytometry for the surface markers expected of mesenchymal stem cells.
3. For proliferation, cells at passage 3 were seeded at 2,000 cells per cm², grown for 7 days, then harvested and counted; a growth rate and a doubling time were worked out from the counts and times.
4. Metabolic activity was read on days 1, 4 and 7 with a resazurin (Alamar Blue) assay.
5. Cells were pushed towards bone and fat and stained, and the proteins in the spent medium were identified by mass spectrometry.

## Check it yourself with fibub

The numbers below are made up by us to show the method, not taken from the paper.

**Step 1: count the cells.** Open the [[hemocytometer]] page, keep 4 corner squares and the 1 : 1 trypan blue setting, and tally each square. Say the four squares give 52, 48, 61 and 55 live cells, with 6 blue ones in all. The mean is 54 live cells per square, so the suspension holds 54 × 10,000 × 2 = **1.08 × 10⁶ live cells/mL**, and viability is 216 ÷ 222 = **97.3 %**. With 4 mL in the tube that is 4.32 million cells.

**Step 2: fit the doubling time.** In the doubling time tool, type four counts in cells per cm²: 2,000 at 0 h, 5,200 at 48 h, 13,500 at 96 h and 52,000 at 168 h. The fit of ln(count) against time gives a **doubling time of 35.7 h** (1.49 days), a growth rate of 0.0194 per hour (0.466 per day), a 95 % interval of 34.0 to 37.6 h, R² = 0.9997, and 4.70 generations over the week — a 26-fold rise. The table between pairs of counts shows 34.8 h over the first interval and 37.0 h over the last, so growth is slowing slightly.

Repeat with a faster series, say 2,000, 7,000, 25,000 and 150,000, and the doubling time drops to **26.9 h**. That gap, about 9 hours per doubling, is the kind of difference a handling choice makes.

**Step 3: plan the next plate.** Scroll to the planner. With a doubling time of 35.73 h, a 12-hour lag, 30,000 cells per cm² for a full layer, 1.2 million cells from a T75 resuspended in 4 mL, and a target of 70 % confluence in 6 wells of a 6-well plate in 4 days, it says **seed 41,160 cells per well** (4,116 per cm², 13.7 % confluent), a 1 : 3.89 split, 137 µL of suspension plus 1.86 mL of medium per well, and 246,980 cells for the six wells.

For bacteria or yeast measured as turbidity instead of counts, the same exponential fit lives in the [[growth-curve-od600|OD600 growth curve]] page.

## The fine print

- Three donors only. The authors say the sample is too small for firm statistics, and cords differ by gestational age and maternal health.
- Doubling times are reported as a figure rather than a table of numbers, and come from a single 7-day stretch at one passage.
- The enzyme-without-bFGF group was dropped, so it cannot be compared fairly with the rest.
- Bone and fat differentiation was judged by staining alone, and the protein findings still need confirming by another method.
- Doubling times from a dish say nothing about how the cells would behave in a patient. This page is general science education, not medical advice.
