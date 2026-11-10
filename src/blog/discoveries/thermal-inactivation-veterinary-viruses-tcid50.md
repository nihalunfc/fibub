---
title: "Moist heat beats dry heat: TCID50 titres of ten livestock viruses after 50 to 70 °C"
summary: "Ten veterinary viruses were heated on surfaces, in feed and in blood, and titrated by the Reed-Muench endpoint. Here is how to turn your own infected-well counts into a titre and a log drop."
tools: [tcid50-calculator, moi-calculator, hemocytometer]
updated: 2026-11-10
sources:
  - "Roman IJ et al. (2025), Pathogens 14(12): 1243, CC BY, the paper described here."
  - "Reed and Muench (1938) and Spearman (1908) with Karber (1931): the two endpoint methods, named for the methods only."
  - "The titres and intervals in the worked example were computed with the repo's own src/lib/sci/tcid50.ts code from made-up well counts."
paper:
  title: "Thermal Inactivation of Multiple Veterinary-Relevant Viruses: Effects of Environmental Conditions, Surface Type, and Organic Matrix"
  authors: "Roman IJ, Merchioratto I, da Fonseca RN, Maggioli MF, Bauermann FV"
  journal: "Pathogens"
  year: 2025
  doi: "10.3390/pathogens14121243"
  url: "https://www.mdpi.com/2076-0817/14/12/1243"
  licence: "CC BY"
  reviewed: true
---

How hot, and for how long, does a lorry, a boot or a sack of feed have to get before the virus on it stops being infectious? A group at Oklahoma State University put that question to ten viruses of farm animals at once, heating them at 50, 60 and 70 °C on four hard surfaces and in blood, straw and feed, and reading the survivors as a tissue culture infectious dose. Their answer, in *Pathogens* in December 2025 under a CC BY licence, is that damp heat is in a different league from dry heat. The [[tcid50-calculator|TCID50 calculator]] turns your own plate of infected wells into the same kind of number.

## What they found

The ten viruses ranged from a calicivirus and picornaviruses to a coronavirus, a pestivirus, an influenza A virus, a herpesvirus and a parvovirus, several of them stand-ins for agents that cannot be handled outside high-containment labs. Each was dried or kept damp on a hard surface, or mixed into blood, straw or feed, then heated.

Wet heat at 60 to 70 °C cleared every enveloped virus and most non-enveloped ones within five minutes. Dry heat was far weaker: the authors report the calicivirus and one picornavirus still infectious after more than 24 hours at 50 to 70 °C on a dry surface, and the parvovirus surviving 24 hours dry at every temperature. Organic material protected too, with most RNA viruses needing 5 to 60 minutes at 70 °C in feed, straw or blood. Their suggestion is humid heat at 70 °C for about ten minutes, longer where a parvovirus is the worry.

## Why it matters

Disinfection guidance for farms and transport often quotes one temperature and time, as if every virus and surface behaved alike. This study heated them side by side under the same read-out, and showed how much the matrix matters: the 70 °C that clears a wet steel plate in minutes leaves infectious virus in dry feed for hours. Moisture is a free ingredient worth adding on purpose.

## How they did it

1. Stocks were grown in cell culture and titrated by the Reed-Muench method as TCID50 per mL.
2. For surfaces, 100 µL of virus went onto 2.5 cm² coupons; dry ones air-dried about 50 minutes at 25 to 35 % relative humidity, wet ones sat in a humidity chamber. For matrices, virus was mixed into blood from a different species (to avoid antibody interference), wheat straw, or two feeds.
3. Samples were held at 70 °C first, selected time points repeated at 50 and 60 °C, then survivors titrated in duplicate inside each of two biological replicates.
4. Wells were scored by cytopathic effect, with immunofluorescence confirming one virus. The detection limit was 10^1.9 TCID50/mL, and anything below it counted as not detected.

## Check it yourself with fibub

Every number below is made up by us to show the method; none of it is from the paper's tables.

**Step 1: count the cells you will infect.** On the [[hemocytometer]] page, tally the four corner squares: 41, 47, 44 and 48 live cells at a 1:1 trypan blue dilution average 45, so the suspension holds 45 × 10,000 × 2 = **9.0 × 10⁵ live cells/mL**.

**Step 2: titrate the untreated stock.** On the TCID50 page, open *Make a dilution series*, set the strongest dilution to 10^-1, the step to 10, seven dilutions and 8 wells each, press *Make the rows* and type the infected wells: 8, 8, 8, 6, 3, 1, 0. Leave the inoculum at 0.1 mL per well.

Spearman-Kärber puts the endpoint at the 10⁻⁴·⁷⁵ dilution, which is **5.62 × 10⁵ TCID50/mL**, with a standard error of 0.275 log₁₀ and a 95 % interval of 1.62 × 10⁵ to 1.95 × 10⁶ per mL. Reed-Muench crosses 50 % between the 10⁻⁵ row (83.3 % cumulative) and the 10⁻⁶ row (36.4 %) and gives 5.12 × 10⁵ per mL, 0.04 log₁₀ away. The plaque-equivalent line reads 3.90 × 10⁵ PFU/mL, because a dose that infects half the wells carries ln 2 ≈ 0.69 particles on average.

**Step 3: titrate the heated sample.** Press *Start empty* and type a shorter series, 10⁻¹ to 10⁻⁵ with 8 wells each: 8, 6, 2, 0, 0. The endpoint is 10⁻²·⁵, so the titre is **3.16 × 10³ TCID50/mL** (standard error 0.231 log₁₀, 95 % interval 1.11 × 10³ to 8.99 × 10³).

**Step 4: report the log drop with its error.** 5.62 × 10⁵ down to 3.16 × 10³ is a fall of **2.25 log₁₀**. The two standard errors add in quadrature, √(0.275² + 0.231²) = 0.360 log₁₀, so the 95 % interval on the drop is about 2.25 ± 0.71, that is 1.5 to 3.0 log₁₀ — and that width is why eight wells per dilution beats four.

**Step 5: plan the next infection.** Feed the untreated titre into the [[moi-calculator|MOI calculator]] with 9.0 × 10⁵ cells per well: an MOI of 0.01 PFU per cell needs 9,000 infectious units, which at 3.90 × 10⁵ PFU/mL is 23 µL of stock, and the Poisson panel shows that only about 1 % of cells get a particle. If you read plaques rather than wells, the lower half of the TCID50 page pools the plates inside your countable range and gives an exact Poisson interval.

## The fine print

- "Not detected" is not sterility: virus below the 10^1.9 TCID50/mL limit may still be there, so they advise a margin past the first clear time point.
- Most agents were surrogates, chosen to match a family rather than to be the pathogen of concern, and time points differed by virus and matrix, so not every combination compares like for like.
- Two biological replicates rank conditions rather than fit kinetics, and the text and abstract disagree on one virus's dry-heat survival time.
