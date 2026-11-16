---
title: "Christiana, Santorini's older neighbour: argon dating puts it at 2.6 million years"
summary: "The Christiana islands near Santorini were thought to be about as old as Santorini itself. New argon-argon ages make their lavas about 2 million years older. We show how fibub's radiometric age calculator handles the J factor, the isochron and trapped argon."
tools: [radiometric-age-calculator]
updated: 2026-11-16
sources:
  - "Vroon, P. Z., Beemster, T., Zhou, X., Nomikou, P., Klaver, M., Wijbrans, J. R. and Kuiper, K. F. (2026), 40Ar/39Ar constraints on the eruption history of the Christiana Volcano of the Christiana-Santorini-Kolumbo volcanic field, Greece, Geochronology 8, 279-295, published 27 May 2026, doi:10.5194/gchron-8-279-2026. Licence CC BY 4.0, checked on the journal page, 2026-11-16. Values used here: five accepted plateau ages 2.57 to 2.69 Ma (2σ 0.02 to 0.03 Ma), mean 2.63 ± 0.05 Ma (1 sd); obsidian clast 133 ± 14 ka (2σ); Middle Pumice eruption of Santorini about 145 ka and Akrotiri dacites 650 to 550 ka, as cited in the paper; Fish Canyon sanidine standard 28.201 Ma; atmospheric 40Ar/36Ar 298.56; Min et al. (2000) decay constants; some isochron intercepts below the air ratio (for example about 288 and 285)."
  - "Fish Canyon sanidine age 28.201 ± 0.023 Ma: Kuiper, K. F. et al. (2008), Science 320, 500-504, as used in the paper."
  - "Total 40K decay constant 5.463 × 10⁻¹⁰ per year: Min, K. et al. (2000), Geochimica et Cosmochimica Acta 64, 73-98. The Radiometric age calculator uses 5.543 × 10⁻¹⁰ per year: Steiger, R. H. and Jäger, E. (1977), Earth and Planetary Science Letters 36, 359-362."
  - "Atmospheric 40Ar/36Ar = 298.56: Lee, J.-Y. et al. (2006), Geochimica et Cosmochimica Acta 70, 4507-4512, as used in the paper."
paper:
  title: "40Ar/39Ar constraints on the eruption history of the Christiana Volcano of the Christiana-Santorini-Kolumbo volcanic field, Greece"
  authors: "Vroon, P. Z.; Beemster, T.; Zhou, X.; Nomikou, P.; Klaver, M.; Wijbrans, J. R.; Kuiper, K. F."
  journal: "Geochronology"
  year: 2026
  doi: "10.5194/gchron-8-279-2026"
  url: "https://gchron.copernicus.org/articles/8/279/2026/"
  licence: "CC BY 4.0"
  reviewed: true
---

About 20 km southwest of Santorini, three small uninhabited islands poke out of the Aegean Sea. They are the top of an old volcano called Christiana. It had been assumed to be roughly as old as the start of Santorini, about 600,000 years. A team of geochronologists has now dated its lavas with the argon-argon method and found them to be about **2.6 million years old**. This article shows how the [[radiometric-age-calculator]] works through the same steps: from argon ratios to an age, the J factor, isochrons and the trap of "excess" or "missing" argon.

## The paper in brief

The **⁴⁰Ar/³⁹Ar method** dates volcanic rock from the slow decay of potassium-40 into argon-40. The rock is first placed in a nuclear reactor, where neutrons turn a fixed share of its potassium-39 into argon-39. The ratio of radiogenic argon-40 to argon-39 then measures how much argon-40 has built up per unit of potassium. A standard mineral of known age, irradiated alongside, gives the conversion factor called **J**. The team used Fish Canyon sanidine (28.201 million years) as the standard.

They heated tiny grains of each lava step by step with a laser and measured the argon released at each step. When several steps in a row give the same age, that is a **plateau age**. Five lavas from the Upper Lava formation passed all the checks and gave **2.57 to 2.69 million years**, averaging **2.63 ± 0.05 million years**. That is about 2 million years older than the Santorini rocks Christiana had been linked with, so Christiana belongs to an earlier phase of volcanism, which died away before Santorini, Kolumbo and the Poseidon centre began. One obsidian clast, a lump of volcanic glass in a younger deposit, gave **133 ± 14 thousand years**: probably debris thrown out by Santorini's Middle Pumice eruption, about 145,000 years ago. The same volcanic field was in the news in 2025 for an [[blog:discoveries/santorini-amorgos-2025-earthquake-swarm-relocation|earthquake swarm between Santorini and Amorgos]].

## Checked with the tools

We used the paper's standard age, air argon ratio and ages, and fibub's maths. The paper's measured argon ratios are not reproduced here: the isochrons in Steps 4 and 5 are **simulated** and labelled as such.

**Step 1: from age to argon ratio and back.** J comes from the standard: J = (e^(λ × 28.201 Ma) − 1) ÷ R_std, where λ is the decay constant of potassium-40 and R_std is the standard's measured ⁴⁰Ar*/³⁹Ar. Labs measure their own R_std; we assumed **12.0**, the tool's default. That gives J = **0.00131289**. A lava 2.63 million years old would then show a ⁴⁰Ar*/³⁹Ar ratio of **1.1112**, and the obsidian (133 thousand years) only **0.0562**. Typing those ratios back into the Radiometric age calculator returns **2.6300 million years** and **133.0 thousand years**. A young rock has very little radiogenic argon, which is why the obsidian's error, 14 thousand years, is about 10% of its age, while the lavas' errors are under 1%.

**Step 2: how precise must the measurement be?** An age of 2.60 ± 0.02 million years (2σ) is a 0.38% error at 1σ. If J is known to 0.2% (our assumption, the tool's default), the sample's argon ratio must be measured to about **0.33%** for the total to stay that small. With J error alone, the tool gives 2.6000 ± 0.0052 million years at 1σ.

**Step 3: does the choice of decay constant matter?** The paper uses the decay constant of Min and others (2000), 5.463 × 10⁻¹⁰ per year. The calculator uses the older Steiger and Jäger (1977) value, 5.543 × 10⁻¹⁰, which is 1.5% larger. For a rock dated against a standard, the effect nearly cancels: with the same standard age and ratios, the age shifts from 2.6300 to **2.6297 million years**, just 0.27 thousand years, far below the measurement error. (For the standard's own age, the choice matters much more, which is why Fish Canyon's 28.201 million years is always quoted together with its decay constants.)

**Step 4: isochrons and trapped argon.** Not all argon-40 in a rock is radiogenic: some is trapped from the air or magma when it cooled. A plateau age assumes the trapped argon has the air ratio, ⁴⁰Ar/³⁶Ar = 298.56. An **isochron** does not. Plot ⁴⁰Ar/³⁶Ar against ³⁹Ar/³⁶Ar for each heating step: the points fall on a line whose slope is the radiogenic ratio, ⁴⁰Ar*/³⁹Ar, and whose intercept is the trapped ratio. We simulated seven heating steps for a 2.63-million-year-old lava with 0.3% errors, once with air argon and once with trapped argon of 288.4, and fitted them with the calculator's York line fit (Figure 1).

<!-- fig:iso -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="Two simulated sets of heating steps for the same lava: the lines' slopes give the same age, about 2.63 and 2.64 Ma, while the intercepts recover the trapped argon, 299.0 and 286.7." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Simulated isochrons for a 2.63-million-year-old lava</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Simulated isochrons for a 2.63-million-year-old lava</text><line x1="58" x2="546" y1="211.5" y2="211.5" style="stroke:var(--line)"/><text x="52" y="215.5" text-anchor="end" style="fill:var(--muted)">400</text><line x1="58" x2="546" y1="130.7" y2="130.7" style="stroke:var(--line)"/><text x="52" y="134.7" text-anchor="end" style="fill:var(--muted)">600</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">800</text><line x1="58" x2="58" y1="272" y2="276" style="stroke:var(--muted)"/><text x="58" y="289" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="174.2" x2="174.2" y1="272" y2="276" style="stroke:var(--muted)"/><text x="174.2" y="289" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="290.4" x2="290.4" y1="272" y2="276" style="stroke:var(--muted)"/><text x="290.4" y="289" text-anchor="middle" style="fill:var(--muted)">200</text><line x1="406.6" x2="406.6" y1="272" y2="276" style="stroke:var(--muted)"/><text x="406.6" y="289" text-anchor="middle" style="fill:var(--muted)">300</text><line x1="522.8" x2="522.8" y1="272" y2="276" style="stroke:var(--muted)"/><text x="522.8" y="289" text-anchor="middle" style="fill:var(--muted)">400</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">³⁹Ar/³⁶Ar</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">⁴⁰Ar/³⁶Ar</text><circle cx="103.9" cy="233.8" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="139.2" cy="221.5" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="185.7" cy="203.3" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="243.1" cy="180.4" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="314.5" cy="153.8" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="405.6" cy="117.8" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="523.4" cy="72.1" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="104.4" cy="239.4" r="3.5" style="fill:var(--c-tools);opacity:1"/><circle cx="139.2" cy="225.8" r="3.5" style="fill:var(--c-tools);opacity:1"/><circle cx="185.8" cy="206.9" r="3.5" style="fill:var(--c-tools);opacity:1"/><circle cx="244.1" cy="184.8" r="3.5" style="fill:var(--c-tools);opacity:1"/><circle cx="314.1" cy="157.9" r="3.5" style="fill:var(--c-tools);opacity:1"/><circle cx="406.6" cy="122" r="3.5" style="fill:var(--c-tools);opacity:1"/><circle cx="524.1" cy="77" r="3.5" style="fill:var(--c-tools);opacity:1"/><path d="M58 252.2L546 63.9" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 257.2L546 67.8" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round;stroke-dasharray:5 4"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Trapped argon = air (298.56)</text><circle cx="290.6" cy="36" r="4" style="fill:var(--c-tools)"/><text x="301.6" y="40" style="fill:var(--muted)">Trapped argon = 288.4</text><text class="fibub-mark" x="546" y="310" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Two simulated sets of heating steps for a lava 2.63 million years old, fitted with the Radiometric age calculator's York isochron maths. Simulated, not the paper's measurements.</figcaption></figure>
<!-- /fig:iso -->

With air argon, the fit gives a slope of 1.1110 and an intercept of **299.0 ± 0.9**: an age of **2.630 million years**. With trapped argon of 288.4, the fit gives an intercept of **286.7 ± 0.9**, within about 2σ of the true value, and an age of **2.643 million years**. Simulated noise is the only reason it is not exactly 2.630.

**Step 5: what goes wrong if you assume air.** Correct the second set of steps with the air ratio instead, as a plateau does, and the age comes out **2.507 million years**: 123 thousand years too young. For these simulated steps, every unit the trapped ratio sits below 298.56 makes an air-corrected age about **11.5 thousand years too young** (Figure 2). That is why the paper reports isochron intercepts for every sample, and why its samples with intercepts below the air ratio have isochron ages older than their plateau ages. The size of the effect in our figure depends on our simulated steps; real rocks with more radiogenic argon are less sensitive.

<!-- fig:trap -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 300" role="img" aria-label="For the simulated heating steps, every unit that the trapped ratio falls below air makes the air-corrected age about 12 thousand years too young." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Age error if trapped argon is not air</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Age error if trapped argon is not air</text><line x1="58" x2="546" y1="230.1" y2="230.1" style="stroke:var(--line)"/><text x="52" y="234.1" text-anchor="end" style="fill:var(--muted)">-200</text><line x1="58" x2="546" y1="144.1" y2="144.1" style="stroke:var(--line)"/><text x="52" y="148.1" text-anchor="end" style="fill:var(--muted)">-100</text><line x1="58" x2="546" y1="58" y2="58" style="stroke:var(--line)"/><text x="52" y="62" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="58" y1="254" y2="258" style="stroke:var(--muted)"/><text x="58" y="271" text-anchor="middle" style="fill:var(--muted)">280</text><line x1="180" x2="180" y1="254" y2="258" style="stroke:var(--muted)"/><text x="180" y="271" text-anchor="middle" style="fill:var(--muted)">285</text><line x1="302" x2="302" y1="254" y2="258" style="stroke:var(--muted)"/><text x="302" y="271" text-anchor="middle" style="fill:var(--muted)">290</text><line x1="424" x2="424" y1="254" y2="258" style="stroke:var(--muted)"/><text x="424" y="271" text-anchor="middle" style="fill:var(--muted)">295</text><line x1="546" x2="546" y1="254" y2="258" style="stroke:var(--muted)"/><text x="546" y="271" text-anchor="middle" style="fill:var(--muted)">300</text><line x1="58" x2="546" y1="254" y2="254" style="stroke:var(--muted)"/><text x="302" y="292" text-anchor="middle" style="fill:var(--ink)">True trapped ⁴⁰Ar/³⁶Ar</text><text transform="translate(14 143) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Air-corrected age minus true age (thousand years)</text><line x1="58" x2="546" y1="58" y2="58" style="stroke:var(--muted);stroke-dasharray:4 4"/><line x1="510.9" x2="510.9" y1="32" y2="254" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="506.9" y="44" text-anchor="end" style="fill:var(--muted)">air 298.56</text><path d="M58 242.1L70.2 237.1L82.4 232.1L94.6 227.1L106.8 222.1L119 217.1L131.2 212.1L143.4 207.1L155.6 202.1L167.8 197.1L180 192.1L192.2 187.1L204.4 182.2L216.6 177.2L228.8 172.2L241 167.2L253.2 162.3L265.4 157.3L277.6 152.3L289.8 147.4L302 142.4L314.2 137.5L326.4 132.5L338.6 127.6L350.8 122.6L363 117.7L375.2 112.7L387.4 107.8L399.6 102.9L411.8 97.9L424 93L436.2 88.1L448.4 83.2L460.6 78.3L472.8 73.3L485 68.4L497.2 63.5L509.4 58.6L521.6 53.7L533.8 48.8L546 43.9" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><text class="fibub-mark" x="546" y="292" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. How far an age corrected with the air ratio drifts when the rock's trapped argon is different, for the same simulated heating steps. Simulated.</figcaption></figure>
<!-- /fig:trap -->

**Step 6: is the obsidian from Santorini?** The obsidian (133 ± 14 thousand years, 2σ) and the Middle Pumice eruption (about 145 thousand years) are 12 thousand years apart, less than the 14 thousand year error. They agree, as the paper says, although the age alone cannot rule out a neighbouring eruption.

| Check | Paper | Our tool result |
|---|---|---|
| Mean of the five accepted lava ages | 2.63 ± 0.05 Ma (1 sd) | 2.630 Ma, sd 0.047 Ma |
| ⁴⁰Ar*/³⁹Ar for 2.63 Ma | (measured; not reproduced) | 1.1112 with our assumed J |
| Decay constant choice | Min et al. (2000) | shifts a 2.63 Ma age by 0.27 ka |
| Trapped argon below air | some intercepts near 285 to 288 | air-corrected age about 11.5 ka too young per unit (simulated) |
| Obsidian vs Middle Pumice | 133 ± 14 ka vs about 145 ka | 12 ka apart, inside the 2σ error |

## How we made the graphs

The charts and every number above come from `scripts/blog-figures/christiana-volcano-santorini-argon-argon-ages.mjs` in fibub's public code. It calls the [[radiometric-age-calculator]]'s own functions from `src/lib/sci/geochron.ts`:

- `jFromStandard` and `arArAge` for the J factor and the ⁴⁰Ar/³⁹Ar ages (the calculator's ⁴⁰Ar/³⁹Ar method).
- `york` for the straight-line fit with errors on both axes (the calculator's Isochron card).

From the paper: the standard age, the air argon ratio, the accepted ages, the obsidian age and the cited Santorini eruption ages. Our assumptions, labelled in the script: the standard's ratio of 12.0, the 0.2% J error, the seven heating steps and their 0.3% errors, and the trapped ratio of 288.4. Run the script and it prints every number and the simulated data, and redraws both charts.

## How we test the maths

On every change to fibub, `tests/sci.mjs` checks the age maths against known answers, among them:

- The York fit must reproduce the classic Pearson-York test data: slope −0.48053 and intercept 5.47991 (to 0.0001), with a slope error of 0.0576.
- J worked out from a 28.2 Ma standard with a ratio of 12 must give back the standard's own age, 28.2 million years, and a K-Ar age must survive a round trip from age to argon and back (100 million years).
- A perfect made-up isochron must return its age of 1.25 billion years, its initial ratio of 0.7035 and an MSWD of zero, and the potassium-40 half-life from the decay constant must be 1.250 billion years.

## Check it yourself

**The age from a ratio, on the [[radiometric-age-calculator]]:**

1. In the **Age from a ratio** card, set *Method* to **⁴⁰Ar/³⁹Ar**.
2. Type **28.201** in *Standard age (Ma)*, **12.0** in *Standard ⁴⁰Ar*/³⁹Ar* and **0.2** in *J ± 1σ, % (optional)*.
3. Type **1.1112** in *Sample ⁴⁰Ar*/³⁹Ar* and **0.002** in *± 1σ (optional)*. It reads **⁴⁰Ar/³⁹Ar age: 2.6300 ± 0.0071 Ma**, and *J factor* shows 1.31289e-3.
4. Change the sample ratio to **0.05615** and the error to **0.003**: it reads **133.0 ± 7.1 ka**.

**The isochron:**

1. In the **Isochron** card, set *Errors are* to **absolute, 1σ**. Paste these seven simulated steps (³⁹Ar/³⁶Ar, error, ⁴⁰Ar/³⁶Ar, error):

```
39.51 0.120 344.52 1.029
69.90 0.210 375.07 1.129
109.92 0.330 420.29 1.262
159.31 0.480 477.03 1.429
220.79 0.660 542.76 1.629
299.13 0.900 632.14 1.896
400.53 1.200 745.37 2.229
```

2. Set *Decay system* to **⁴⁰Ar/³⁹Ar: ⁴⁰K → ⁴⁰Ar (needs J)**, type the J from Step 1, **0.00131289**, in *J factor*, and leave *J error* at 0.2 %.
3. Read *Slope* (**1.11103**, the radiogenic ⁴⁰Ar*/³⁹Ar), the trapped argon in the *Initial* line (**299.0484 ± 1.0063**, with the error scaled up by √MSWD because MSWD is above 1) and *MSWD* (**1.27**). The *Isochron age* reads **2.630 ± 0.016 million years**, from age = ln(1 + J × slope)/λ.
4. To check the age by hand, go back to the ⁴⁰Ar/³⁹Ar method in the first card and type the slope, **1.11103**, as the sample ratio: it gives the same **2.630 million years**.

## What researchers can use it for

- **Check an age table:** recompute ages from reported ratios and J with the [[radiometric-age-calculator]], and spot typing errors.
- **Plan an irradiation:** work out the ⁴⁰Ar*/³⁹Ar ratio a sample of an expected age will give, and the precision needed to reach a target error.
- **Fit isochrons** with errors on both axes, and read off the trapped argon ratio and MSWD for any step-heating data.
- **Test how sensitive an age is** to the trapped ratio or the decay constant before deciding which age to report.
- **Teach** how radiometric dating works from atoms to ages.

## The fine print

- The standard ratio of 12.0, the J error and all isochron data are our assumptions or simulations, not the paper's measurements; real J values and step data are in the paper and its supplement.
- The calculator uses the Steiger and Jäger (1977) decay constants; the paper uses Min and others (2000). For young rocks dated against a standard the difference is tiny (Step 3), but for exact comparisons use the same constants as the lab.
- Our "plateau" in Step 5 is a weighted mean of air-corrected heating steps, a simplification of the paper's plateau criteria (at least three steps, more than half the argon-39, and a fit probability above 0.05).
- We checked the arithmetic linking the paper's numbers, not its sample selection or geological interpretation.
