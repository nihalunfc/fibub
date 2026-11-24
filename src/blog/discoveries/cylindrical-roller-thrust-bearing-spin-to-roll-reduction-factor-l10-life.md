---
title: "Cylindrical roller thrust bearings: a revised η cuts L10 life by 27 %, not 42 %"
summary: "A 2025 study models roller spin in thrust bearings and raises the ISO load-rating factor η from 0.85 to 0.91. We check the 42 % and 27 % life cuts with fibub's bearing life maths."
tools: [shaft-bearing-life, gear-train-calculator, fatigue-sn-calculator]
updated: 2026-11-24
sources:
  - "Sauvage, P., Terwey, T., Lehmann, B. and Jacobs, G. (2025), Improved Calculation of Dynamic Load Capacity for Cylindrical Roller Thrust Bearings: Numerical Update of the Lifetime Reduction Factor η for Bearings with Small and Medium Spin-to-Roll Ratios, Lubricants 13(2): 65, doi:10.3390/lubricants13020065. Licence CC BY 3.0 (Creative Commons Attribution), checked on the MDPI article page, 2026-11-24. Values used here: η = 0.85 from ISO/TR 1281-1 at a 90° contact angle and 0.91 from the revised calculation; life reductions of 42 % and 27 %; the ISO fit η = 1 − 0.15 sin α (0.89 at 48°); spin-to-roll ratios γ = 0.3 (baseline, sized like an SRB 29452) and 0.2; reference speeds of about 150 rpm for such bearings."
  - "Basic rating life L10 = (C/P)^p with p = 10/3 for roller bearings: ISO 281:2007, Rolling bearings — Dynamic load ratings and rating life; ISO/TR 1281-1:2008 (explanatory notes)."
paper:
  title: "Improved Calculation of Dynamic Load Capacity for Cylindrical Roller Thrust Bearings: Numerical Update of the Lifetime Reduction Factor η for Bearings with Small and Medium Spin-to-Roll Ratios"
  authors: "Sauvage P, Terwey T, Lehmann B, Jacobs G"
  journal: "Lubricants"
  year: 2025
  doi: "10.3390/lubricants13020065"
  url: "https://www.mdpi.com/2075-4442/13/2/65"
  licence: "CC BY 3.0"
  reviewed: true
---

A **cylindrical roller thrust bearing** carries a load along the shaft, with straight rollers lying like spokes between two flat washers. Because the inner end of each roller travels a shorter circle than the outer end, the rollers cannot simply roll: they also twist on the washers, called **spinning**, and that extra rubbing shortens their life. The ISO rating method allows for it with a blunt factor η that cuts the bearing's load rating by 15 %. A 2025 paper in *Lubricants* models the spin directly and finds a gentler factor, η = 0.91, so that the life is cut by about 27 % instead of 42 %. Those two percentages follow from one formula, the basic rating life used in the [[shaft-bearing-life]] calculator, and we checked them with it. Thrust bearings sit in gearboxes, so the [[gear-train-calculator]] gives the speeds they run at, and the [[fatigue-sn-calculator]] shows the same kind of stress–life curve for other machine parts.

## The paper in brief

A bearing's **dynamic load rating** C is the load it can carry for one million revolutions with 90 % of a batch surviving. Its **basic rating life** L10, the life 90 % of bearings reach, is (C/P)^p million revolutions, where P is the actual load and p is 10/3 for roller bearings. Because of that power, a small change in C makes a large change in life.

For thrust roller bearings, the ISO method multiplies C by a reduction factor η. It covers uneven load along the rollers and the extra shear stress from spinning, and depends only on the **contact angle** α (90° for a flat thrust bearing). The authors note that ISO/TR 1281-1 fits it as η = 1 − 0.15 sin α, giving 0.89 at 48° and **0.85** at 90°. How much a roller spins, though, depends on its size relative to the bearing: the **spin-to-roll ratio** γ, the roller diameter over the pitch diameter for a flat thrust bearing. A long, thin ring of rollers spins less than a short, fat one.

The authors computed the stresses under a spinning roller with a semi-analytical contact model, including the friction of the lubricant film, and turned them into a life with the Ioannides–Harris method, once with spin and once without. The ratio of the two gives a spin part of η. For the bearing geometries they modelled (γ = 0.3, the size of a common spherical roller thrust bearing, and γ = 0.2), they find **η = 0.91**. In their words, the life reduction falls from **42 %** with the ISO value to **27 %** with theirs. The study is numerical; the authors say tests are still to come.

## Checked with the tools

This is a **recomputation**. If η multiplies C, then the life with the factor divided by the life without it is (ηC/P)^p ÷ (C/P)^p = η^p, whatever the load. We worked it out with the `L10` function behind the [[shaft-bearing-life]] calculator.

**Step 1: the two life cuts.** With the roller exponent p = 10/3, η = 0.85 leaves **58.17 %** of the life, a cut of **41.83 %**, and η = 0.91 leaves **73.02 %**, a cut of **26.98 %**. Those round to the paper's 42 % and 27 % (Figure 1). As a side check, the ball-bearing exponent p = 3 would give 38.59 % and 24.64 %, which do not match: the paper's numbers come from the roller exponent, as they should.

<!-- fig:life -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 288" role="img" aria-label="Share of the L10 life left when the load rating is multiplied by η. For a roller bearing, η 0.85 leaves 58.2 % and η 0.91 leaves 73.0 %." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Life left after a load-rating reduction η</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Life left after a load-rating reduction η</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--line)"/><text x="52" y="246" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="546" y1="178" y2="178" style="stroke:var(--line)"/><text x="52" y="182" text-anchor="end" style="fill:var(--muted)">60</text><line x1="58" x2="546" y1="114" y2="114" style="stroke:var(--line)"/><text x="52" y="118" text-anchor="end" style="fill:var(--muted)">80</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">100</text><line x1="58" x2="58" y1="242" y2="246" style="stroke:var(--muted)"/><text x="58" y="259" text-anchor="middle" style="fill:var(--muted)">0.8</text><line x1="180" x2="180" y1="242" y2="246" style="stroke:var(--muted)"/><text x="180" y="259" text-anchor="middle" style="fill:var(--muted)">0.85</text><line x1="302" x2="302" y1="242" y2="246" style="stroke:var(--muted)"/><text x="302" y="259" text-anchor="middle" style="fill:var(--muted)">0.9</text><line x1="424" x2="424" y1="242" y2="246" style="stroke:var(--muted)"/><text x="424" y="259" text-anchor="middle" style="fill:var(--muted)">0.95</text><line x1="546" x2="546" y1="242" y2="246" style="stroke:var(--muted)"/><text x="546" y="259" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--muted)"/><text x="302" y="280" text-anchor="middle" style="fill:var(--ink)">Reduction factor η (share of C kept)</text><text transform="translate(14 146) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">L10 life, % of unreduced</text><line x1="180" x2="180" y1="50" y2="242" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="176" y="62" text-anchor="end" style="fill:var(--muted)">η 0.85: 58.2 %</text><line x1="326.4" x2="326.4" y1="50" y2="242" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="330.4" y="78" text-anchor="start" style="fill:var(--muted)">η 0.91: 73.0 %</text><path d="M58 217.9L70.2 214.7L82.4 211.5L94.6 208.2L106.8 204.8L119 201.5L131.2 198L143.4 194.6L155.6 191.1L167.8 187.5L180 183.9L192.2 180.2L204.4 176.4L216.6 172.7L228.8 168.8L241 164.9L253.2 161L265.4 157L277.6 153L289.8 148.9L302 144.8L314.2 140.6L326.4 136.3L338.6 132L350.8 127.7L363 123.2L375.2 118.8L387.4 114.2L399.6 109.6L411.8 105L424 100.3L436.2 95.5L448.4 90.7L460.6 85.8L472.8 80.9L485 75.9L497.2 70.8L509.4 65.7L521.6 60.5L533.8 55.3L546 50" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 206.2L70.2 203.1L82.4 200L94.6 196.8L106.8 193.6L119 190.3L131.2 187L143.4 183.7L155.6 180.3L167.8 176.9L180 173.5L192.2 170L204.4 166.4L216.6 162.9L228.8 159.3L241 155.6L253.2 151.9L265.4 148.2L277.6 144.4L289.8 140.6L302 136.7L314.2 132.8L326.4 128.8L338.6 124.8L350.8 120.8L363 116.7L375.2 112.6L387.4 108.4L399.6 104.2L411.8 100L424 95.6L436.2 91.3L448.4 86.9L460.6 82.4L472.8 77.9L485 73.4L497.2 68.8L509.4 64.2L521.6 59.5L533.8 54.8L546 50" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round;stroke-dasharray:5 4"/><circle cx="180" cy="183.9" r="4" style="fill:var(--ink);opacity:1"/><circle cx="326.4" cy="136.3" r="4" style="fill:var(--ink);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Roller bearing, p = 10/3</text><line x1="256.8" x2="268.8" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2;stroke-dasharray:5 4"/><text x="272.8" y="40" style="fill:var(--muted)">Ball bearing, p = 3</text><text class="fibub-mark" x="546" y="280" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Share of the basic rating life L10 that is left when the dynamic load rating is multiplied by a reduction factor η, from the Bearing life calculator's L10 = (C/P)^p. Dots: the paper's ISO value 0.85 and revised value 0.91. The dashed ball-bearing curve is for comparison only.</figcaption></figure>
<!-- /fig:life -->

**Step 2: what it means for a real bearing.** As a worked example (**our assumption**, not the paper's bearing), take a thrust bearing whose rating would be 2000 kN with no reduction, under a steady axial load of 500 kN at 150 rpm, a speed the paper mentions for bearings of this size. The calculator gives:

| Load rating used | C (kN) | L10 (million revolutions) | L10 at 150 rpm |
|---|---|---|---|
| No reduction, η = 1 | 2000 | 101.59 | 11,288 hours |
| ISO, η = 0.85 | 1700 | 59.10 | 6,567 hours |
| Revised, η = 0.91 | 1820 | 74.19 | 8,243 hours |

The revised factor adds about 1,680 hours of rated life to the same bearing on paper. Seen the other way, to reach the full 11,288 hours a designer using η = 0.85 must pick a bearing with a nominal rating of 2353 kN (17.6 % more), while with η = 0.91 a 2198 kN bearing (9.9 % more) is enough. That is often one size smaller, which is why the factor matters to gearbox and slewing-ring designers.

**Step 3: the ISO factor across contact angles.** Figure 2 draws the ISO fit as the paper gives it. Between 45° and 90°, η falls from 0.894 to 0.85, and the roller life left falls from 68.8 % to 58.2 %. The paper's revised 0.91 for a 90° bearing leaves more life (73 %) than the ISO value gives even at 45°, which shows how much the old factor was holding in reserve for spin.

<!-- fig:angle -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 278" role="img" aria-label="The ISO reduction factor falls from 0.894 at 45 degrees to 0.85 at 90 degrees, and the roller life left from 69 % to 58 %." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>ISO/TR 1281-1 reduction against contact angle</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">ISO/TR 1281-1 reduction against contact angle</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--line)"/><text x="52" y="236" text-anchor="end" style="fill:var(--muted)">50</text><line x1="58" x2="546" y1="195.6" y2="195.6" style="stroke:var(--line)"/><text x="52" y="199.6" text-anchor="end" style="fill:var(--muted)">60</text><line x1="58" x2="546" y1="159.2" y2="159.2" style="stroke:var(--line)"/><text x="52" y="163.2" text-anchor="end" style="fill:var(--muted)">70</text><line x1="58" x2="546" y1="122.8" y2="122.8" style="stroke:var(--line)"/><text x="52" y="126.8" text-anchor="end" style="fill:var(--muted)">80</text><line x1="58" x2="546" y1="86.4" y2="86.4" style="stroke:var(--line)"/><text x="52" y="90.4" text-anchor="end" style="fill:var(--muted)">90</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">100</text><line x1="112.2" x2="112.2" y1="232" y2="236" style="stroke:var(--muted)"/><text x="112.2" y="249" text-anchor="middle" style="fill:var(--muted)">50</text><line x1="220.7" x2="220.7" y1="232" y2="236" style="stroke:var(--muted)"/><text x="220.7" y="249" text-anchor="middle" style="fill:var(--muted)">60</text><line x1="329.1" x2="329.1" y1="232" y2="236" style="stroke:var(--muted)"/><text x="329.1" y="249" text-anchor="middle" style="fill:var(--muted)">70</text><line x1="437.6" x2="437.6" y1="232" y2="236" style="stroke:var(--muted)"/><text x="437.6" y="249" text-anchor="middle" style="fill:var(--muted)">80</text><line x1="546" x2="546" y1="232" y2="236" style="stroke:var(--muted)"/><text x="546" y="249" text-anchor="middle" style="fill:var(--muted)">90</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--muted)"/><text x="302" y="270" text-anchor="middle" style="fill:var(--ink)">Contact angle α (degrees)</text><text transform="translate(14 141) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Share (%)</text><line x1="58" x2="546" y1="148.2" y2="148.2" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="143.2" text-anchor="end" style="fill:var(--muted)">revised η 0.91: 73 % life</text><path d="M58 88.6L68.8 89.3L79.7 89.9L90.5 90.6L101.4 91.2L112.2 91.8L123.1 92.4L133.9 93L144.8 93.6L155.6 94.2L166.4 94.7L177.3 95.3L188.1 95.8L199 96.3L209.8 96.8L220.7 97.3L231.5 97.8L242.4 98.2L253.2 98.7L264 99.1L274.9 99.5L285.7 99.9L296.6 100.3L307.4 100.6L318.3 101L329.1 101.3L340 101.6L350.8 101.9L361.6 102.2L372.5 102.5L383.3 102.7L394.2 103L405 103.2L415.9 103.4L426.7 103.6L437.6 103.8L448.4 103.9L459.2 104.1L470.1 104.2L480.9 104.3L491.8 104.4L502.6 104.5L513.5 104.5L524.3 104.6L535.2 104.6L546 104.6" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 163.5L68.8 165.2L79.7 166.9L90.5 168.5L101.4 170.1L112.2 171.7L123.1 173.2L133.9 174.7L144.8 176.1L155.6 177.5L166.4 178.9L177.3 180.2L188.1 181.5L199 182.7L209.8 183.9L220.7 185.1L231.5 186.2L242.4 187.3L253.2 188.4L264 189.4L274.9 190.4L285.7 191.3L296.6 192.2L307.4 193.1L318.3 193.9L329.1 194.7L340 195.4L350.8 196.1L361.6 196.8L372.5 197.4L383.3 198L394.2 198.5L405 199L415.9 199.5L426.7 199.9L437.6 200.3L448.4 200.7L459.2 201L470.1 201.3L480.9 201.6L491.8 201.8L502.6 201.9L513.5 202.1L524.3 202.2L535.2 202.2L546 202.3" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">η = 1 − 0.15 sin α</text><line x1="213.6" x2="225.6" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="229.6" y="40" style="fill:var(--muted)">L10 life left (p = 10/3)</text><text class="fibub-mark" x="546" y="270" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The ISO/TR 1281-1 reduction factor for thrust roller bearings, η = 1 − 0.15 sin α, as the paper writes it, and the roller-bearing life it leaves, between a 45° and a 90° contact angle.</figcaption></figure>
<!-- /fig:angle -->

| Check | Paper | Bearing life maths |
|---|---|---|
| Life cut with η = 0.85 | 42 % | 41.83 % (p = 10/3) |
| Life cut with η = 0.91 | 27 % | 26.98 % (p = 10/3) |
| Same cuts with the ball exponent | not used | 38.59 % and 24.64 % (do not match) |
| η at 48° from 1 − 0.15 sin α | 0.89 | 0.889 |

What we cannot check is the 0.91 itself: it comes out of the paper's contact-stress and Ioannides–Harris calculation, which no fibub tool reproduces. What the tool confirms is that the step from η to the life cut is the standard rating-life formula, and how big that step is in hours for a given bearing.

## How we made the graphs

The charts and every number come from `scripts/blog-figures/cylindrical-roller-thrust-bearing-spin-to-roll-reduction-factor-l10-life.mjs` in fibub's public code. It calls `L10` (the basic rating life (C/P)^p), `hours` (millions of revolutions to hours at a speed) and `requiredC` (the rating needed for a given life) from `src/lib/sci/eng-shaft.ts`, the maths behind the [[shaft-bearing-life]] calculator.

The two η values, the 42 % and 27 % cuts, the ISO fit 1 − 0.15 sin α and the speed of about 150 rpm come from the paper's text. The 2000 kN rating and the 500 kN load in Step 2 are **our assumptions**, chosen to give a load ratio C/P of 4.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/shaft-bearing-life.mjs`, which checks the calculator against NumPy and SciPy:

- A ball bearing with C 30.7 kN under 4.2 kN must last 390.54 million revolutions, or 5424.19 hours at 1200 rpm; with the roller exponent, 757.93 million revolutions.
- The Weibull reliability factor must equal SciPy's: 0.61885 at 95 % and 0.20877 at 99 % reliability for a slope of 1.5.
- New with this article: η = 0.85 and 0.91 must cut a roller bearing's L10 by 41.83 % and 26.98 %, and the worked thrust bearing must give 11,288, 6,567 and 8,243 hours.

## Check it yourself

On the [[shaft-bearing-life]] calculator, in the *Bearing life* card:

1. Set *Bearing type* to **Roller (exponent 10/3)** and *Find* to **Life from the rating C**.
2. A thrust bearing takes only axial load, so type *Radial load Fr (kN)* **0**, *Axial load Fa (kN)* **500**, *X* **0**, *Y* **1** and *Load factor fa* **1**.
3. Type *Speed (rpm)* **150**, *Reliability (%)* **90** and *Life modification factor aISO* **1**.
4. Type *Dynamic load rating C (kN)* **2000**. The result reads *L10 life* about **11290 hours** and *Basic life L10* about **101.6 million revolutions**.
5. Change *C* to **1700** (η = 0.85): about **6567 hours**. Change it to **1820** (η = 0.91): about **8243 hours**. Divide each by 11,288 to see the 58 % and 73 % of life left.

## What researchers can use it for

- **Turn a rating factor into hours**: any change to C, from a new η, a material factor or a catalogue update, becomes a life change you can read at once.
- **Check stated life percentages** in bearing papers and see which exponent they used.
- **Size a bearing for a target life**: switch *Find* to **C needed for a life** and see how much bigger the bearing must be under each η.
- **Add duty cycles and reliability**: combine several loads into one equivalent load and read the life at 95 % or 99 % reliability, not just 90 %.
- **Link to the drive**: get the shaft speeds of a gearbox from the [[gear-train-calculator]] and feed them in.

## The fine print

- The paper's η = 0.91 is a numerical result for the geometries it modelled; it has not yet been confirmed by bearing tests, and it is not part of the ISO standard.
- We took the life cut as η^(10/3), which is how a factor on C acts in the basic rating life. The paper's own life model (Ioannides–Harris) is more detailed than that formula.
- The worked bearing in Step 2 is made up; real ratings come from a manufacturer's catalogue.
- The life modification factor aISO (lubrication, contamination) is left at 1 throughout.
