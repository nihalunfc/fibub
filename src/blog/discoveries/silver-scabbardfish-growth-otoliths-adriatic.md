---
title: "Silver scabbardfish age and growth in the Adriatic from otoliths (von Bertalanffy)"
summary: "A 2025 study ages silver scabbardfish from the eastern Adriatic by their ear stones and fits a von Bertalanffy growth curve. Here is how to fit one yourself and see why old fish matter."
tools: [von-bertalanffy-fitter, fish-length-weight, yield-per-recruit]
updated: 2026-11-10
sources:
  - "Rebac I, Ferri J (2025), Fishes 10(5): 194, CC BY, the paper described here. Title, authors, volume, article number and licence checked on the publisher's page, 2026-11-10."
  - "Von Bertalanffy growth function (von Bertalanffy 1938; Beverton and Holt 1957) and the growth performance index φ' = log10 K + 2 log10 L∞ (Pauly and Munro 1984, Fishbyte 2: 21)."
paper:
  title: "Age and Growth of the Silver Scabbardfish, Lepidopus caudatus (Euphrasen, 1788), in the Eastern Adriatic"
  authors: "Rebac I, Ferri J"
  journal: "Fishes"
  year: 2025
  doi: "10.3390/fishes10050194"
  url: "https://www.mdpi.com/2410-3888/10/5/194"
  licence: "CC BY"
  reviewed: true
---

The silver scabbardfish is a long, flat, ribbon-like fish with sharp teeth. It lives in deep water along the edges of the continental shelf, and fishers in several countries land it. Yet for the Adriatic Sea almost nothing was known about how fast it grows. An April 2025 paper in *Fishes* changes that. Two researchers from the University of Split in Croatia read the growth rings in the ear stones of 295 fish and fitted the classic von Bertalanffy growth curve. You can fit the same curve to your own length-at-age data with the [[von-bertalanffy-fitter]]. Then turn lengths into weights with the [[fish-length-weight]] tool, or feed the growth curve into the [[yield-per-recruit]] calculator to ask how hard a stock can be fished.

## What they found

The fish they caught were young. Ages ran from 0 to 4 years, and most fish were in their first year. Lengths ranged from about 21 cm to 123 cm. The fitted curve, for males, females and unsexed fish together, gave an asymptotic length (L∞, the average size a fish would reach if it lived for ever) of about 135 cm. The growth coefficient K, which says how quickly fish close in on that size, was about 0.32 per year.

Those numbers point to fast growth. The authors report that the Adriatic fish grow faster than Atlantic populations and at a rate similar to other Mediterranean ones. They read this as a sign that scabbardfish in different seas should be managed as separate stocks. They also showed that simple measurements of the ear stone, especially its length, track a fish's age and size closely, which could make ageing quicker.

## Why it matters

Growth parameters are the starting point for most fish stock assessments. They tell managers how long a fish takes to reach catchable or spawning size, and they go straight into models of yield and natural death rates. Borrowing values from the Atlantic would get this species wrong in the Adriatic. A local growth curve, even an early one, gives a better footing.

## How they did it

1. Fish were collected in spring 2010 to 2012 from a commercial bottom trawler working at 170 to 200 m in the central eastern Adriatic.
2. Each fish was measured, weighed and, where possible, sexed.
3. The sagittae, the largest pair of ear stones (otoliths), were ground and read. Each pair of opaque and clear bands counts as one year. Two readers worked separately and settled disagreements together.
4. The von Bertalanffy curve was fitted to length at age, and the growth performance index φ' was worked out from L∞ and K.
5. Otolith length, width, thickness and mass were regressed against fish length and age.

## Check it yourself with fibub

The growth curve is L(t) = L∞ × (1 − e^(−K(t − t₀))). Here t is age in years and t₀ is the age at which the curve would give zero length.

**Our own made-up sample**, not the paper's data. It holds 16 fish of a long, fast-growing species, aged 0 to 4 years, with total lengths in cm:

```
age (years),length (cm)
0,38
0,44
0,41
0,47
1,62
1,58
1,66
1,70
2,78
2,84
2,75
3,92
3,88
3,97
4,101
4,106
```

1. Paste the table into the length-at-age box and keep the unit on cm.
2. Read the headline. The fit gives **L∞ = 144 cm, K = 0.228 per year and t₀ = −1.55 years**, with R² = 0.97.
3. Now look at the intervals. L∞ is 144 ± 26 cm, with a 95 % interval running from 86 cm to 201 cm. K runs from 0.037 to 0.42. With no fish older than 4, the curve has barely started to bend, so the data cannot pin down where it levels off.
4. Check φ'. It comes out at **3.67**, and it is far steadier than L∞ or K alone, because a higher L∞ with a lower K gives almost the same φ'.
5. Open the Ford-Walford plot, which plots mean length at one age against mean length a year later. Its line, L(t+1) = 29.4 + 0.797 × L(t), gives L∞ ≈ 144 cm and K ≈ 0.227, close to the main fit.
6. To see what old fish add, add four more made-up rows at the end: `5,111`, `6,117`, `6,121` and `7,124`. L∞ becomes 147 cm and its interval shrinks to 127 to 166 cm. K becomes 0.218, with an interval of 0.145 to 0.291. φ' hardly moves, at 3.67.

Step 6 is the real lesson for a sample like the paper's, which is mostly young fish. The headline L∞ can look precise while resting on very few large fish. For the paper's own values, the formula gives φ' = log₁₀ 0.32 + 2 × log₁₀ 134.98 ≈ 3.77, which matches the figure they report.

## The fine print

- Only 20 of the 295 fish were known females and most could not be sexed, so males and females could not be given separate curves.
- All fish came from spring trawls no deeper than 200 m. Larger, older scabbardfish live deeper, so the largest sizes and ages are probably missing.
- Trawl nets favour some sizes, and here most fish were juveniles. The fitted curve puts length at age 0 near 40 cm, larger than the smallest fish caught, so its early part is an extrapolation, as the authors note.
- The two readers agreed on about 59 % of otoliths, and the bands were not checked against fish of known age. Ageing error spreads into L∞ and K.
- The samples are from 2010 to 2012. Growth may have changed since.
- Our numbers above are made up. Use the paper for the species values.
