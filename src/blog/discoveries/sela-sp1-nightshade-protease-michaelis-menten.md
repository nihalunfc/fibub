---
title: "Sela-SP1: a heat-loving protease from silverleaf nightshade, and how to measure its Km"
summary: "A weed's berries hold a protein-cutting enzyme that works best at 80 °C and pH 10 to 11. We use the Enzyme kinetics fitter to show how its Km and Vmax are measured, and why the straight-line plot misleads."
tools: [enzyme-kinetics-fitter]
updated: 2026-11-16
sources:
  - "Teutle-Paredes, J. G., Mazorra-Manzano, M. A., Huerta-Ocampo, J. A., Martínez-Porchas, M., Ramírez-Suárez, J. C. and Vallejo-Córdoba, B. (2026), Partial Purification and Characterization of Sela-SP1, a Subtilisin-like Serine Protease from Solanum elaeagnifolium, Catalysts 16(11), 1011, published 15 November 2026. Licence CC BY 3.0, checked on the journal page, 2026-11-16. Values used here, from the abstract: apparent mass 70 kDa, Km 77.8 µM, Vmax 2.4 µM/s, best pH 10 to 11 (active from 4 to 12), best temperature 80 °C (active from 40 to 90 °C), main thermal transition 87.6 °C, inhibited by PMSF."
  - "Why straight-line plots distort enzyme constants: Cornish-Bowden, A. (2012), Fundamentals of Enzyme Kinetics, 4th edition, Wiley-Blackwell, chapter on plotting and fitting."
paper:
  title: "Partial Purification and Characterization of Sela-SP1, a Subtilisin-like Serine Protease from Solanum elaeagnifolium"
  authors: "Teutle-Paredes, J. G.; Mazorra-Manzano, M. A.; Huerta-Ocampo, J. A.; Martínez-Porchas, M.; Ramírez-Suárez, J. C.; Vallejo-Córdoba, B."
  journal: "Catalysts"
  year: 2026
  doi: "10.3390/catal16111011"
  url: "https://www.mdpi.com/2073-4344/16/11/1011"
  licence: "CC BY 3.0"
  reviewed: true
---

Silverleaf nightshade is a tough, spiny weed from the dry lands of the Americas. In northern Mexico its berries have long been used to curdle milk for cheese, because they contain enzymes that cut proteins. A team has now pulled one of those enzymes out of the berries, named it **Sela-SP1**, and measured how it behaves. It turns out to like heat and alkaline conditions far more than most plant enzymes. This article uses the [[enzyme-kinetics-fitter]] to show how the two numbers at the heart of the paper, Km and Vmax, are measured, and why the way you fit them matters. For turning absorbance readings into rates first, see the [[enzyme-activity]] calculator.

## The paper in brief

Sela-SP1 is a **protease**, an enzyme that cuts proteins into smaller pieces. It belongs to the **subtilisin-like serine proteases**, a family named after an enzyme from the soil bacterium *Bacillus subtilis*, which uses a serine amino acid in its active site to make the cut. As expected for this family, it stopped working when the team added PMSF, a chemical that blocks that serine; other protease blockers had no effect. The team cleaned the enzyme up in three chromatography steps and found an apparent mass of **70 kDa** (kilodaltons, a unit of protein size).

The enzyme stayed active from pH 4 to 12 and from 40 to 90 °C, working best at **pH 10 to 11** and **80 °C**. Its main **thermal transition** (the temperature at which half its folded structure comes apart when heated) is **87.6 °C**. It cut gelatin and casein well, and broke down β-lactoglobulin, the main protein in whey, at pH 7. With a small test substrate, it had a **Km of 77.8 µM** and a **Vmax of 2.4 µM/s**.

Why it matters: enzymes that keep working when hot and alkaline are useful in industry, from making protein hydrolysates (pre-digested proteins) to detergents. Most such enzymes come from microbes; a robust one from a common weed is a cheap new source.

## Checked with the tools

**Km** and **Vmax** come from the **Michaelis–Menten equation**, which says how fast an enzyme works at each amount of its substrate (the molecule it acts on). Vmax is the top speed when the enzyme is flooded with substrate. Km is the substrate level that gives half that speed: a small Km means the enzyme grabs its substrate even when there is little of it. To get them, you measure the starting rate at several substrate levels and fit a curve.

We do not have the paper's rate measurements, so we **simulated** an experiment from its two numbers: seven substrate levels from 10 to 640 µM (our choice, about 0.13 to 8 times Km), with random measurement scatter of 0.06 µM/s (our assumption, 2.5% of Vmax). Every rate below is simulated, not the paper's.

**Step 1: fit the curve.** The Enzyme kinetics fitter's maths fits the Michaelis–Menten curve directly to the rates (a **non-linear fit**). On our simulated data it gives **Vmax 2.39 ± 0.08 µM/s** and **Km 77.9 ± 8.6 µM** (Figure 1), close to the paper's 2.4 and 77.8 that we started from. The fitter also tried a substrate-inhibition curve and a Hill (cooperative) curve, and the plain Michaelis–Menten curve won clearly: an 88% Akaike weight, a score of how well each model is supported once you allow for its number of parameters.

<!-- fig:fit -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="Seven simulated initial rates rise steeply and level off near 2.4 micromolar per second; the fitted curve passes through them and its half-way point sits near 78 micromolar." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>A simulated Sela-SP1 experiment and its fit</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">A simulated Sela-SP1 experiment and its fit</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--line)"/><text x="52" y="256" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="174.3" y2="174.3" style="stroke:var(--line)"/><text x="52" y="178.3" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="96.6" y2="96.6" style="stroke:var(--line)"/><text x="52" y="100.6" text-anchor="end" style="fill:var(--muted)">2</text><line x1="58" x2="58" y1="252" y2="256" style="stroke:var(--muted)"/><text x="58" y="269" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="197.4" x2="197.4" y1="252" y2="256" style="stroke:var(--muted)"/><text x="197.4" y="269" text-anchor="middle" style="fill:var(--muted)">200</text><line x1="336.9" x2="336.9" y1="252" y2="256" style="stroke:var(--muted)"/><text x="336.9" y="269" text-anchor="middle" style="fill:var(--muted)">400</text><line x1="476.3" x2="476.3" y1="252" y2="256" style="stroke:var(--muted)"/><text x="476.3" y="269" text-anchor="middle" style="fill:var(--muted)">600</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Substrate (µM)</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Initial rate (µM/s)</text><line x1="58" x2="546" y1="65.5" y2="65.5" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="60.5" text-anchor="end" style="fill:var(--muted)">Vmax 2.4 (paper)</text><line x1="112.2" x2="112.2" y1="50" y2="252" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="116.2" y="62" text-anchor="start" style="fill:var(--muted)">Km 77.8 µM (paper)</text><circle cx="65" cy="237.8" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="71.9" cy="221.2" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="85.9" cy="182.8" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="113.8" cy="154.5" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="169.5" cy="127" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="281.1" cy="104.9" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="504.2" cy="85.7" r="4" style="fill:var(--c-blog);opacity:1"/><path d="M58 252L64.1 233.2L70.2 217.9L76.3 205.1L82.4 194.4L88.5 185.1L94.6 177.1L100.7 170.2L106.8 164L112.9 158.5L119 153.6L125.1 149.2L131.2 145.3L137.3 141.6L143.4 138.4L149.5 135.3L155.6 132.5L161.7 130L167.8 127.6L173.9 125.4L180 123.3L186.1 121.4L192.2 119.6L198.3 118L204.4 116.4L210.5 114.9L216.6 113.5L222.7 112.2L228.8 110.9L234.9 109.8L241 108.6L247.1 107.6L253.2 106.6L259.3 105.6L265.4 104.7L271.5 103.8L277.6 103L283.7 102.1L289.8 101.4L295.9 100.6L302 99.9L308.1 99.3L314.2 98.6L320.3 98L326.4 97.4L332.5 96.8L338.6 96.2L344.7 95.7L350.8 95.2L356.9 94.7L363 94.2L369.1 93.7L375.2 93.3L381.3 92.8L387.4 92.4L393.5 92L399.6 91.6L405.7 91.2L411.8 90.8L417.9 90.5L424 90.1L430.1 89.8L436.2 89.4L442.3 89.1L448.4 88.8L454.5 88.5L460.6 88.2L466.7 87.9L472.8 87.6L478.9 87.3L485 87.1L491.1 86.8L497.2 86.6L503.3 86.3L509.4 86.1L515.5 85.8L521.6 85.6L527.7 85.4L533.8 85.1L539.9 84.9L546 84.7" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Simulated rates</text><line x1="192" x2="204" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="208" y="40" style="fill:var(--muted)">Michaelis–Menten fit (Km 77.9 µM)</text></svg><figcaption>Figure 1. Simulated initial rates (dots) made from the paper's Km and Vmax with 0.06 µM/s of random scatter (our assumption), fitted with the Enzyme kinetics fitter's maths. Simulated, not the paper's measurements.</figcaption></figure>
<!-- /fig:fit -->

**Step 2: the straight-line trap.** Before computers, people turned the curve into a straight line by plotting 1/rate against 1/substrate, the **Lineweaver–Burk plot**. On the same simulated data that line gives Vmax **4.75 µM/s** and Km **240 µM**, three times too high. Taking reciprocals blows up the smallest, least certain rates at low substrate, so one slightly low point tilts the whole line. The other two straight-line plots, Eadie–Hofstee and Hanes–Woolf, do better here (Km 91 and 94 µM) but are still further off than the curve fit.

**Step 3: many experiments.** One simulation could be bad luck, so we ran **2,000** simulated experiments and fitted each one both ways (Figure 2). The non-linear Km landed between **64 and 93 µM** in 95% of runs, centred on 78. The Lineweaver–Burk Km ranged from **39 to 355 µM**, and in 36 runs the line crossed below zero and gave no usable Km at all.

<!-- fig:mc -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 278" role="img" aria-label="The non-linear Km values bunch tightly around the true 77.8 micromolar; the Lineweaver-Burk values spread far wider, with a long tail towards high values." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Km from 2,000 simulated experiments</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Km from 2,000 simulated experiments</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--line)"/><text x="52" y="236" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="195.6" y2="195.6" style="stroke:var(--line)"/><text x="52" y="199.6" text-anchor="end" style="fill:var(--muted)">5</text><line x1="58" x2="546" y1="159.2" y2="159.2" style="stroke:var(--line)"/><text x="52" y="163.2" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="122.8" y2="122.8" style="stroke:var(--line)"/><text x="52" y="126.8" text-anchor="end" style="fill:var(--muted)">15</text><line x1="58" x2="546" y1="86.4" y2="86.4" style="stroke:var(--line)"/><text x="52" y="90.4" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">25</text><line x1="58" x2="58" y1="232" y2="236" style="stroke:var(--muted)"/><text x="58" y="249" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="166.4" x2="166.4" y1="232" y2="236" style="stroke:var(--muted)"/><text x="166.4" y="249" text-anchor="middle" style="fill:var(--muted)">60</text><line x1="274.9" x2="274.9" y1="232" y2="236" style="stroke:var(--muted)"/><text x="274.9" y="249" text-anchor="middle" style="fill:var(--muted)">80</text><line x1="383.3" x2="383.3" y1="232" y2="236" style="stroke:var(--muted)"/><text x="383.3" y="249" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="491.8" x2="491.8" y1="232" y2="236" style="stroke:var(--muted)"/><text x="491.8" y="249" text-anchor="middle" style="fill:var(--muted)">120</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--muted)"/><text x="302" y="270" text-anchor="middle" style="fill:var(--ink)">Fitted Km (µM)</text><text transform="translate(14 141) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Share of experiments (%)</text><line x1="263" x2="263" y1="50" y2="232" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="267" y="62" text-anchor="start" style="fill:var(--muted)">true 77.8</text><path d="M66.1 232L82.4 232L98.7 232L114.9 232L131.2 232L147.5 231.6L163.7 229.8L180 217.4L196.3 212.7L212.5 181.4L228.8 148.3L245.1 125.7L261.3 113.7L277.6 110.8L293.9 142.8L310.1 178.5L326.4 194.5L342.7 214.5L358.9 222.5L375.2 230.2L391.5 231.6L407.7 231.3L424 230.5L440.3 232L456.5 232L472.8 232L489.1 232L505.3 232L521.6 232L537.9 232" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M66.1 217.1L82.4 212L98.7 210.5L114.9 202.4L131.2 199.4L147.5 199.4L163.7 197.9L180 199L196.3 201.2L212.5 204.9L228.8 206.1L245.1 204.2L261.3 211.3L277.6 208.6L293.9 211.6L310.1 213.1L326.4 212L342.7 210.2L358.9 217.1L375.2 220.1L391.5 221.6L407.7 218.7L424 221.6L440.3 221.6L456.5 219.4L472.8 222L489.1 222.8L505.3 225.3L521.6 225.7L537.9 228.7" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Non-linear fit</text><line x1="184.8" x2="196.8" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="200.8" y="40" style="fill:var(--muted)">Lineweaver–Burk</text></svg><figcaption>Figure 2. Km fitted to 2,000 simulated experiments of seven rates each (10 to 640 µM), by the non-linear fit and by a Lineweaver–Burk straight line, both from the Enzyme kinetics fitter's maths. Simulated.</figcaption></figure>
<!-- /fig:mc -->

**Step 4: choose your substrate levels.** We repeated the 2,000 runs with substrate levels that stop at 160 µM, about twice Km. The non-linear 95% range widened to **57 to 111 µM**, and Lineweaver–Burk failed outright in **498** of the 2,000 runs. The fitter warns when the highest substrate is under 2 times Km for exactly this reason: without rates near the top of the curve, Vmax and Km cannot be told apart. At 640 µM the enzyme is still only at **89%** of Vmax, which is why a range up to about 5 to 10 times Km is the usual advice.

**Step 5: from Vmax to turnover.** Vmax depends on how much enzyme is in the tube; the **turnover number** kcat (cuts per enzyme molecule per second) does not. The abstract does not give the enzyme amount, so as an example only: if the assay held 1 µg/mL of a 70 kDa enzyme, that is 0.0143 µM, and 2.4 µM/s would mean about **168 cuts per second** per molecule, with kcat/Km about **2.2 × 10⁶ per molar per second**. That would be a fast enzyme, but the real figure depends on the purity and amount the team used.

| Check | Paper | Our tool result |
|---|---|---|
| Km | 77.8 µM | 77.9 ± 8.6 µM from simulated rates (non-linear fit) |
| Vmax | 2.4 µM/s | 2.39 ± 0.08 µM/s from simulated rates |
| Best model | Michaelis–Menten | Michaelis–Menten, 88% Akaike weight |
| Lineweaver–Burk on the same data | (not used here) | Km 240 µM, Vmax 4.75 µM/s: far off |
| Spread of Km over 2,000 simulated runs | (not applicable) | 64 to 93 µM non-linear; 39 to 355 µM Lineweaver–Burk |

## How we made the graphs

Both charts and every number above come from `scripts/blog-figures/sela-sp1-nightshade-protease-michaelis-menten.mjs` in fibub's public code. It calls the [[enzyme-kinetics-fitter]]'s own functions from `src/lib/sci/enzyme.ts`:

- `fitEnzyme` with the `MODELS` list: the non-linear least-squares fit of Michaelis–Menten, substrate inhibition and Hill curves.
- `akaikeWeights`: how strongly the data support each model.
- `linearised`: Vmax and Km from the Lineweaver–Burk, Eadie–Hofstee and Hanes–Woolf straight lines, as in the fitter's comparison table.

Where the inputs come from: Km (77.8 µM), Vmax (2.4 µM/s) and the 70 kDa mass are the paper's. The substrate levels, the 0.06 µM/s scatter, the 2,000 runs, the random seed and the 1 µg/mL enzyme amount are our assumptions, labelled in the script. All rates are **simulated**.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs checks on these functions:

- Each of the seven models, given exact rates made from known values (for Michaelis–Menten, Vmax 100 and Km 20), must recover those values to within 0.01%.
- On a built-in simulated inhibitor study, the competitive fit must give Vmax **98.13**, Km **19.20** and Ki **9.816**, and the Akaike weights must favour competitive and mixed inhibition while ruling the other two out; the straight-line plots on its no-inhibitor rates must give a Lineweaver–Burk Vmax of **102.07** and an Eadie–Hofstee Km of **19.83**.
- On perfect data (Vmax 60, Km 8), all three straight-line plots must give exactly 60 and 8, so the differences you see on real data come from the scatter, not the code.

## Check it yourself

On the [[enzyme-kinetics-fitter]]:

1. Clear the box *Substrate concentration and initial rate, two columns; or substrate, inhibitor and rate, three columns* and paste our seven **simulated** rates, one pair per line: **10 0.183**, **20 0.397**, **40 0.891**, **80 1.255**, **160 1.609**, **320 1.893**, **640 2.14**.
2. Leave *Concentration unit* as **µM** and set *Rate unit* to **µM/s**. Leave *Model* on **Best supported by the data (AICc)** and *Errors* on **About the same size for every rate**.
3. Type **0.0143** in *Enzyme concentration (optional, same unit)*: our example 1 µg/mL of a 70 kDa enzyme.
4. The result reads **Michaelis–Menten: Vmax 2.39 ± 0.084 µM/s, Km 77.9 ± 8.6 µM**, with R² 0.9923, a *Turnover number kcat* of **167 per s** and a *Catalytic efficiency kcat/Km* of **2.15 per µM per s**.
5. Under *Straight-line plots (no inhibitor)*, the Lineweaver–Burk row shows Vmax **4.75** and Km **240**, while the non-linear row shows 2.39 and 77.9.
6. Delete the 320 and 640 lines: the fitter warns *highest [S] is only 1.9 × Km*, and the result becomes Vmax 2.51 ± 0.32 µM/s and Km 84.5 ± 22 µM, with errors more than twice as large.

## What researchers can use it for

- **Get Km and Vmax with honest error bars** from a plate of initial rates in the [[enzyme-kinetics-fitter]], without trusting a straight-line plot.
- **Plan an assay before running it:** simulate rates at the substrate levels you can afford and see how well Km would be pinned down.
- **Tell models apart:** check whether substrate inhibition or cooperativity is really supported, rather than assumed.
- **Turn Vmax into kcat and kcat/Km** once you know the enzyme amount, to compare enzymes from different sources.
- **Re-check old Lineweaver–Burk values** in papers by re-fitting the rates, when they are published.

## The fine print

- Every rate and fit in this article is **simulated** from the paper's Km and Vmax. They show how the method behaves, not what the paper measured.
- The paper's abstract does not name the test substrate or the enzyme amount, so our kcat example is a what-if, not a result.
- The enzyme was partially purified; other proteins in the sample can change the apparent Vmax.
- Our scatter (a constant 0.06 µM/s) is a guess; real assays may have scatter that grows with the rate, which the *Errors* setting *About the same % of each rate* handles.
