---
title: "Probiotic lactobacilli on eggshell membrane: Gompertz growth rates and doubling times"
summary: "A 2026 study grows three probiotic lactobacilli on eggshell membrane protein and fits Gompertz curves. We use fibub's growth curve tool to show how the growth rate's log base changes the doubling time."
tools: [growth-curve-od600, microbe-growth]
updated: 2026-11-16
sources:
  - "Ozcan, T., Yilmaz-Ersan, L., Keser, G., Narli, M. B. and Ozcan, M. O. (2026), Growth Prediction and Metabolite Profiling of Probiotic Lactobacilli Cultivated with Eggshell Membrane Protein: A Comparison of Kinetic Models and Machine Learning Methods, Fermentation 12(11): 534, doi:10.3390/fermentation12110534, published 15 November 2026. Open access under a Creative Commons Attribution (CC BY) licence, checked on the article page 2026-11-16. Values used here: L. acidophilus LA-5, L. paracasei 431 and L. rhamnosus LGG in MRS broth and in a medium where 25 g/L eggshell membrane powder replaced peptone, yeast and meat extract; 37 °C, plate counts every 3 h for 24 h; modified Gompertz µmax 0.94 per h, lag 3.22 h, doubling time 0.74 h for LA-5 in MRS, and µmax 0.47 per h, lag 7.61 h, doubling time 1.46 h, A 2.43 log10 and plateau 8.06 log10 CFU/mL in the membrane medium; Baranyi-Roberts µmax 1.07 and 0.56 per h, lag 3.58 and 8.58 h; mean cross-validated RMSE 0.134 (GPR), 0.136 (SVR), 0.153 (Baranyi-Roberts), 0.166 (Gompertz) log10 CFU/mL."
  - "Zwietering, M. H., Jongenburger, I., Rombouts, F. M. and van 't Riet, K. (1990), Modeling of the bacterial growth curve, Applied and Environmental Microbiology 56: 1875-1881 (the modified Gompertz model the tool fits)."
paper:
  title: "Growth Prediction and Metabolite Profiling of Probiotic Lactobacilli Cultivated with Eggshell Membrane Protein: A Comparison of Kinetic Models and Machine Learning Methods"
  authors: "Ozcan T, Yilmaz-Ersan L, Keser G, Narli MB, Ozcan MO"
  journal: "Fermentation"
  year: 2026
  doi: "10.3390/fermentation12110534"
  url: "https://www.mdpi.com/2311-5637/12/11/534"
  licence: "CC BY"
  reviewed: true
---

Eggshell membrane, the thin skin inside an egg's shell, is a by-product of egg processing and is rich in protein. A study published in Fermentation on 15 November 2026 asks whether it can replace the expensive peptone, yeast and meat extracts in the broth used to grow **probiotic lactobacilli**, the lactic acid bacteria added to yoghurts and supplements. The authors counted the bacteria every 3 hours for a day and fitted growth curves with two classic models and two machine-learning methods. This article shows how the [[growth-curve-od600]] tool fits the same kind of curve, and uses it to make one check every reader of a growth paper should make: which logarithm the growth rate is on. For the idea of exponential growth itself, see [[microbe-growth]].

## The paper in brief

Three strains (*Lactobacillus acidophilus* LA-5, *Lacticaseibacillus paracasei* 431 and *L. rhamnosus* LGG) grew at 37 °C in normal MRS broth and in a version where 25 g/L of eggshell membrane powder replaced the usual protein sources. The bacteria were counted as colony-forming units (CFU, the colonies that grow on a plate) per millilitre.

A growth curve has a **lag** (the bacteria adjust before dividing), an **exponential phase** (they double at a steady rate) and a **plateau**. The **modified Gompertz model** of Zwietering and colleagues describes this S-shape with three numbers: the total rise A, the steepest growth rate µmax and the lag λ. All three strains grew in the membrane medium, so the by-product can feed them, but LA-5 grew more slowly there: in the paper's Gompertz fit its µmax halved (0.94 to 0.47 per hour) and its lag rose from 3.2 to 7.6 hours. The machine-learning methods predicted the counts slightly better than the two classic models.

## Checked with the tools

The paper gives A and the plateau on a **log10** scale (2.43 log10 units, up to 8.06 log10 CFU/mL) and turns µmax into a doubling time with ln 2 ÷ µmax: 0.693 ÷ 0.47 = 1.47 hours, close to its 1.46. That formula is right when µmax is a slope on the **natural-log (ln)** scale. If µmax is a slope on the log10 scale, like A, the doubling time is log10 2 ÷ µmax = 0.301 ÷ 0.47 = **0.64 hours**, and the true specific growth rate is 0.47 × ln 10 = **1.08 per hour**. The two readings differ by a factor of 2.3, so it matters which one a paper means.

We **simulated** both readings from the paper's parameters (they are not the measured counts), sampled them every 3 hours as the authors did, and gave them to the growth curve tool's maths. The tool always works on the ln scale and says so.

<!-- fig:curves -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="Read as log10 units, the culture rises 2.43 logs in about 5.2 h after the lag; read as ln units, it takes about 11.9 h." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Same Gompertz parameters, two meanings of µ</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Same Gompertz parameters, two meanings of µ</text><line x1="58" x2="546" y1="210.2" y2="210.2" style="stroke:var(--line)"/><text x="52" y="214.2" text-anchor="end" style="fill:var(--muted)">6</text><line x1="58" x2="546" y1="140.6" y2="140.6" style="stroke:var(--line)"/><text x="52" y="144.6" text-anchor="end" style="fill:var(--muted)">7</text><line x1="58" x2="546" y1="70.9" y2="70.9" style="stroke:var(--line)"/><text x="52" y="74.9" text-anchor="end" style="fill:var(--muted)">8</text><line x1="58" x2="58" y1="252" y2="256" style="stroke:var(--muted)"/><text x="58" y="269" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="119" x2="119" y1="252" y2="256" style="stroke:var(--muted)"/><text x="119" y="269" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="180" x2="180" y1="252" y2="256" style="stroke:var(--muted)"/><text x="180" y="269" text-anchor="middle" style="fill:var(--muted)">6</text><line x1="241" x2="241" y1="252" y2="256" style="stroke:var(--muted)"/><text x="241" y="269" text-anchor="middle" style="fill:var(--muted)">9</text><line x1="302" x2="302" y1="252" y2="256" style="stroke:var(--muted)"/><text x="302" y="269" text-anchor="middle" style="fill:var(--muted)">12</text><line x1="363" x2="363" y1="252" y2="256" style="stroke:var(--muted)"/><text x="363" y="269" text-anchor="middle" style="fill:var(--muted)">15</text><line x1="424" x2="424" y1="252" y2="256" style="stroke:var(--muted)"/><text x="424" y="269" text-anchor="middle" style="fill:var(--muted)">18</text><line x1="485" x2="485" y1="252" y2="256" style="stroke:var(--muted)"/><text x="485" y="269" text-anchor="middle" style="fill:var(--muted)">21</text><line x1="546" x2="546" y1="252" y2="256" style="stroke:var(--muted)"/><text x="546" y="269" text-anchor="middle" style="fill:var(--muted)">24</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Hours</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">log10 CFU/mL</text><line x1="212.7" x2="212.7" y1="50" y2="252" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="216.7" y="62" text-anchor="start" style="fill:var(--muted)">lag 7.61 h</text><path d="M58 236L63.1 236L68.2 236L73.3 236L78.3 236L83.4 236L88.5 236L93.6 236L98.7 236L103.8 236L108.8 236L113.9 236L119 236L124.1 236L129.2 236L134.3 236L139.3 236L144.4 236L149.5 236L154.6 236L159.7 236L164.8 236L169.8 235.9L174.9 235.8L180 235.7L185.1 235.4L190.2 234.7L195.3 233.6L200.3 232L205.4 229.6L210.5 226.5L215.6 222.5L220.7 217.5L225.8 211.7L230.8 205.1L235.9 197.9L241 190.3L246.1 182.3L251.2 174.1L256.3 165.9L261.3 157.9L266.4 150.1L271.5 142.6L276.6 135.5L281.7 128.8L286.8 122.7L291.8 116.9L296.9 111.6L302 106.8L307.1 102.5L312.2 98.5L317.3 94.9L322.3 91.7L327.4 88.9L332.5 86.3L337.6 84L342.7 82L347.8 80.2L352.8 78.6L357.9 77.2L363 75.9L368.1 74.8L373.2 73.8L378.3 73L383.3 72.2L388.4 71.5L393.5 71L398.6 70.4L403.7 70L408.8 69.6L413.8 69.2L418.9 68.9L424 68.7L429.1 68.4L434.2 68.2L439.3 68L444.3 67.9L449.4 67.7L454.5 67.6L459.6 67.5L464.7 67.4L469.8 67.3L474.8 67.3L479.9 67.2L485 67.1L490.1 67.1L495.2 67L500.3 67L505.3 66.9L510.4 66.9L515.5 66.9L520.6 66.9L525.7 66.9L530.8 66.9L535.8 66.9L540.9 66.8L546 66.8" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 236L63.1 236L68.2 236L73.3 236L78.3 236L83.4 236L88.5 236L93.6 236L98.7 236L103.8 236L108.8 236L113.9 235.9L119 235.9L124.1 235.8L129.2 235.8L134.3 235.8L139.3 235.6L144.4 235.5L149.5 235.3L154.6 235.1L159.7 234.7L164.8 234.4L169.8 233.9L174.9 233.3L180 232.6L185.1 231.8L190.2 230.9L195.3 229.8L200.3 228.5L205.4 227.1L210.5 225.5L215.6 223.8L220.7 221.9L225.8 219.8L230.8 217.6L235.9 215.2L241 212.6L246.1 209.9L251.2 207L256.3 204L261.3 200.9L266.4 197.7L271.5 194.5L276.6 191.1L281.7 187.6L286.8 184.2L291.8 180.7L296.9 177.1L302 173.6L307.1 170L312.2 166.5L317.3 163L322.3 159.5L327.4 156L332.5 152.6L337.6 149.3L342.7 146L347.8 142.8L352.8 139.6L357.9 136.6L363 133.6L368.1 130.7L373.2 127.9L378.3 125.2L383.3 122.5L388.4 120L393.5 117.6L398.6 115.2L403.7 112.9L408.8 110.7L413.8 108.6L418.9 106.6L424 104.6L429.1 102.7L434.2 101L439.3 99.2L444.3 97.6L449.4 96.1L454.5 94.6L459.6 93.2L464.7 91.8L469.8 90.5L474.8 89.3L479.9 88.1L485 87.1L490.1 85.9L495.2 85L500.3 84L505.3 83.1L510.4 82.3L515.5 81.4L520.6 80.6L525.7 79.9L530.8 79.2L535.8 78.5L540.9 77.9L546 77.3" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><circle cx="58" cy="236" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="119" cy="236" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="180" cy="235.7" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="241" cy="190.3" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="302" cy="106.8" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="363" cy="75.9" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="424" cy="68.7" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="485" cy="67.1" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="546" cy="66.8" r="3.5" style="fill:var(--c-blog);opacity:1"/><circle cx="58" cy="236" r="3.5" style="fill:var(--c-tools);opacity:1"/><circle cx="119" cy="235.9" r="3.5" style="fill:var(--c-tools);opacity:1"/><circle cx="180" cy="232.6" r="3.5" style="fill:var(--c-tools);opacity:1"/><circle cx="241" cy="212.6" r="3.5" style="fill:var(--c-tools);opacity:1"/><circle cx="302" cy="173.6" r="3.5" style="fill:var(--c-tools);opacity:1"/><circle cx="363" cy="133.6" r="3.5" style="fill:var(--c-tools);opacity:1"/><circle cx="424" cy="104.6" r="3.5" style="fill:var(--c-tools);opacity:1"/><circle cx="485" cy="87.1" r="3.5" style="fill:var(--c-tools);opacity:1"/><circle cx="546" cy="77.3" r="3.5" style="fill:var(--c-tools);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">µ = 0.47 log10 units per h</text><line x1="271.2" x2="283.2" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="287.2" y="40" style="fill:var(--muted)">µ = 0.47 ln units per h</text><text class="fibub-mark" x="546" y="290" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Simulated from the paper's Gompertz parameters for L. acidophilus in the eggshell-membrane medium, read two ways. Dots: the paper's 3-hourly sampling times. Not the measured plate counts.</figcaption></figure>
<!-- /fig:curves -->

| | µmax read as log10 per h | µmax read as ln per h |
|---|---|---|
| Gompertz fit by the tool: µm (ln, per h) | **1.082** | 0.470 |
| Doubling time from the fit | **0.640 h (38 min)** | 1.475 h (89 min) |
| Lag λ from the fit | 7.61 h | 7.61 h |
| Steepest straight line through 3 readings (tangent method) | 0.710 per h, doubling 0.98 h | 0.435 per h, doubling 1.59 h |
| The paper's doubling time | 1.46 h | 1.46 h |

What the checks show:

- **The model fit recovers what went in.** From nine readings, the tool's Gompertz fit returns µm and λ to four figures, in ln units.
- **The paper's doubling times match the ln reading.** They are right if the authors fitted µmax on the ln scale; if it was on the log10 scale, like A, the doubling times would be 2.3 times shorter (0.32 hours for LA-5 in MRS rather than 0.74). The article page does not settle this, so we flag it rather than call it an error. Either way, the eggshell-membrane medium roughly halves LA-5's growth rate: that comparison does not depend on the log base.
- **Three-hourly sampling is coarse for a fast grower.** The tangent method, which fits a straight line through the steepest few readings, underestimates the growth rate (0.71 against 1.08 per hour) because the exponential phase lasts only about 5 hours and holds just two or three samples. The tool warns about this (*not on a straight line on a log scale*); a model fit or more frequent sampling fixes it.

## How we made the graphs

The chart and numbers come from `scripts/blog-figures/probiotic-lactobacilli-eggshell-membrane-gompertz-growth-rate.mjs` in fibub's public code. It calls `zwietering` (the Gompertz curve) and `analyse` (the tangent method, the window search and the Gompertz fit by Levenberg-Marquardt) from `src/lib/sci/growthcurve.ts`, the maths behind the [[growth-curve-od600]] tool. Inputs: A, the plateau, µmax and λ for LA-5 in the membrane medium, and the 3-hour sampling, all from the paper. The counts are simulated from those parameters; the two readings of µmax are our framing. Because the tool expects OD, the counts are typed as CFU/mL ÷ 10⁹; any quantity proportional to cell number gives the same growth rate.

## How we test the maths

On every change to fibub, `tests/sci-tools/growth-curve-od600.mjs` checks the tool against hand results and NumPy:

- Readings that double every 30 minutes must give **µ = 1.386 per hour**, a doubling time of **0.5 h** and a lag of **1 h**.
- The tool's example Strain A must give **µ 0.8088 per h, doubling time 51.4 min, lag 1.32 h**, and a Gompertz fit of **µm 0.8386, λ 1.363 h**, matching a NumPy fit.
- New with this article: exact Gompertz counts with A 2.43 log10, µm 0.47 log10 per h and λ 7.61 h, sampled every 3 h, must come back as **µm 1.0822 per h** (0.47 × ln 10), **doubling time 0.640 h** and **λ 7.610 h**.

## Check it yourself

On the [[growth-curve-od600]] tool:

1. Press **Start empty** and paste this table (time in hours, then the counts as CFU/mL ÷ 10⁹, simulated for the log10 reading):

   ```
   Time (h),LA-5
   0,0.000427
   3,0.000427
   6,0.000431
   9,0.00193
   12,0.0305
   15,0.0847
   18,0.108
   21,0.113
   24,0.114
   ```

2. Under the blank, press **None**.
3. Keep **Find it** for the window, and set *Readings in the window* to **3** and *Lowest OD to use* to **0.0001**.
4. Set *Fit a model* to **Gompertz**.
5. Read *µm* about **1.083 per h** with *doubling time* **38.4 min (0.640 h)**, and *Lag λ* about **7.61 h**. The tangent result above it, *Growth rate µ*, is about **0.710 per h**, with a warning that the window is not straight.

## What researchers can use it for

- **Get growth rate, doubling time and lag** from plate-reader OD600 or from plate counts, with a 95% interval, in the [[growth-curve-od600]] tool.
- **Check a paper's units**: put its parameters into a simulated curve, as here, and see which doubling time comes back.
- **Plan sampling**: simulate a curve with expected rates and see how many readings land in the exponential phase.
- **Compare media or strains**: paste one column per culture and the tool fits them all and tabulates the results.
- **Teach** lag, exponential and stationary phases with [[microbe-growth]] before moving on to real data.

## The fine print

- The curves here are simulated from the paper's published parameters, not the measured counts, which are only shown in a figure.
- Plate counts have a counting error of several per cent; a real fit would be less exact than the one shown.
- The Gompertz µmax is the slope at the curve's steepest point; the Baranyi-Roberts model the paper also used defines it slightly differently, so its values (1.07 and 0.56 per h for LA-5) are not directly interchangeable.
- The study tested one membrane concentration at one temperature.
