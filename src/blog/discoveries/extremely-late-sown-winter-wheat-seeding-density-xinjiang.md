---
title: "Can a higher seeding rate rescue extremely late-sown winter wheat?"
summary: "A two-year trial in northern Xinjiang sowed winter wheat in late October and November at four seed rates. Here is what it found, and how to work out a seed rate and check your stand."
tools: [seeding-rate-calculator, yield-trial-anova, field-trial-designer]
updated: 2026-11-10
sources:
  - "Tian W et al. (2025), Agronomy 15(3): 607, CC BY, the paper described here."
  - "Seeds to sow = target plants / (germination x purity x field emergence); kg/ha = seeds per m2 x 10,000 x thousand-seed weight (g) / 1,000,000: standard seed-rate arithmetic."
paper:
  title: "Can Increased Density Compensate for Extremely Late-Sown Wheat Yield?"
  authors: "Tian W, Chen G, Zhang Q, Zhang Z, Zhang J, Yu S, Shi S, Zhang J"
  journal: "Agronomy"
  year: 2025
  doi: "10.3390/agronomy15030607"
  url: "https://www.mdpi.com/2073-4395/15/3/607"
  licence: "CC BY"
  reviewed: true
---

Winter wheat is normally sown early enough to grow a few tillers, side shoots that carry extra ears, before the cold arrives. In northern Xinjiang, China, farmers who follow maize with wheat often cannot sow until late October or November. A team in Tacheng asked whether simply sowing more seed could make up for the lost autumn growth. Over two seasons they combined three very late sowing dates with four seed rates. The paper was published in Agronomy in February 2025 under a CC BY licence. Below we explain it in our own words, and show how the [[seeding-rate-calculator]] turns a target plant number into kilograms of seed and checks the stand you actually got. To compare plots afterwards, [[yield-trial-anova]] tests whether yield differences are real.

## What they found

Sowing very late cost yield, but not as much as you might fear. Averaged over the late treatments, the authors report yields about 8 % below wheat sown at the normal time in late September. Late plants had fewer tillers, so most ears came from the main stems, and each ear held far fewer grains, roughly 37 to 39 % fewer. More seed made up part of that by giving more ears per square metre.

The best late combination was sowing on 4 November at 450 kg of seed per hectare. Its yield was only about 1 % below the normal-time control in both years. Going higher than that did not help: at the top rates, more ears were too small to carry grain.

## Why it matters

When a previous crop is harvested late, a farmer must choose between sowing wheat late, switching crops, or leaving the field bare. This trial suggests that, in this cold region, a late sowing with the right seed rate can come close to a normal yield. It also warns that "more seed" has a ceiling: crowded plants compete, and extra seed is a cost.

## How they did it

1. At a research station in Tacheng (about 415 m above sea level, sandy loam after maize), they used one winter wheat variety with a thousand-grain weight near 45 g.
2. They sowed on 25 October, 4 November and 14 November, plus a local control on 25 September.
3. Late plots got 337.5, 450, 562.5 or 675 kg of seed per hectare; the control got 270 kg/ha.
4. They used a split-plot design: sowing date on the main plots, seed rate on smaller subplots, with four replicates of 10 m² plots and rows 20 cm apart.
5. They counted emergence, tillers and ears, grains per ear and grain weight, and analysed them with analysis of variance and Duncan's test.

## Check it yourself with fibub

Seed rates are easiest to compare as seeds per square metre. With a thousand-seed weight of 45 g, our own arithmetic gives 270 kg/ha ÷ 0.045 g per seed ≈ 600 seeds/m², and 675 kg/ha ≈ 1,500 seeds/m². Those are high rates by world standards, which shows how hard late sowing is in this climate.

The rest of this example uses **our own made-up numbers**, not the paper's data.

**Step 1: seeds to sow.** In the [[seeding-rate-calculator]], keep metric units. Type a target of 450 plants per m², germination 95 %, purity 98 %, seed weight 45 g per 1,000 seeds and row spacing 20 cm.

- With field emergence of 80 %, typical of a good autumn seedbed, the tool says sow about **604 seeds/m², 271.9 kg/ha**, about 121 seeds per metre of row.
- Late, cold soil emerges worse. Set emergence to 60 % and the answer rises to about **806 seeds/m², 362.5 kg/ha**, about 161 seeds per metre.

Only the emergence changed, yet the seed bill rose by a third. The paper's lower emergence in late plots (about a quarter lower on average, the authors report) is exactly this effect.

**Step 2: check the stand.** In spring, count plants in 1 m of row at five places. Our made-up counts: 78, 85, 90, 74 and 82. With rows 20 cm apart, each metre of row covers 0.2 m², so the tool reports a mean of **409 plants/m²**, a range of 370 to 450, and a coefficient of variation of about 7.6 %.

**Step 3: read the result.** That is about 90.9 % of the 450 target. If you sowed the 806 seeds/m² from the 60 % case, real establishment was 409 ÷ 806 ≈ **50.8 %**. The tool suggests using that figure as your field emergence next time.

**Step 4: compare rates.** If you run your own strip trial with several seed rates, the [[field-trial-designer]] randomises the plots, and [[yield-trial-anova]] tells you which rates differ by more than chance.

## The fine print

- One variety, one site and two seasons. Results in milder regions, or with other varieties, may differ.
- The normal-time control used both a different date and a lower seed rate, so its comparison mixes the two effects.
- The latest date, 14 November, was hard to sow in practice because the soil was starting to freeze.
- Grain weight results are described in mixed ways in the text; read the paper's tables for the exact values.
- Our seed and stand numbers are invented for the example. Seed rate advice depends on region and variety: check with a local adviser or official source.
