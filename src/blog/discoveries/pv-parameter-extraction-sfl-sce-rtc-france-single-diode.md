---
title: "Solar cell parameter extraction: single- and double-diode models of the RTC France cell"
summary: "A 2026 hybrid optimiser fits diode models to a benchmark solar cell. We redraw its curve, compare its two models and test how well 1 mA of noise pins the parameters, with fibub's I-V analyser."
tools: [solar-cell-iv, solar-pv-yield, curve-fitter]
updated: 2026-11-16
sources:
  - "Faris, H., Mahmood, M. K., Rai, N., Al Dawsari, S. and Yahya, K. (2026), A Hybrid Shuffled Frog Leaping–Shuffled Complex Evolution Algorithm for Photovoltaic Parameter Identification, Energies 19, 1240, doi:10.3390/en19051240. Licence CC BY 4.0 (creativecommons.org/licenses/by/4.0), checked on the article, 2026-11-16. Values used here, for the RTC France cell at 33 °C and 1,000 W/m²: single-diode model Iph 0.7607755 A, I0 3.23021 × 10⁻⁷ A, n 1.481181, Rs 0.036377 Ω, Rsh 53.71853 Ω, RMSE 9.860219 × 10⁻⁴ A; double-diode model Iph 0.7607811 A, I01 7.49358 × 10⁻⁷ A with n1 = 2 (at its search bound), I02 2.25974 × 10⁻⁷ A with n2 1.451014, Rs 0.03674 Ω, Rsh 55.48545 Ω, RMSE 9.824848 × 10⁻⁴ A."
  - "The RTC France cell benchmark (a 57 mm silicon cell measured at 33 °C): Easwarakhanthan, T., Bottin, J., Bouhouch, I. and Boutrit, C. (1986), Int. J. Solar Energy 4, 1-12. We did not use its measured points."
  - "Thermal voltage kT/q from the 2019 SI values of the Boltzmann constant and the elementary charge."
paper:
  title: "A Hybrid Shuffled Frog Leaping–Shuffled Complex Evolution Algorithm for Photovoltaic Parameter Identification"
  authors: "Faris, H.; Mahmood, M. K.; Rai, N.; Al Dawsari, S.; Yahya, K."
  journal: "Energies"
  year: 2026
  doi: "10.3390/en19051240"
  url: "https://doi.org/10.3390/en19051240"
  licence: "CC BY 4.0"
  reviewed: true
---

Every solar cell's current-voltage (I-V) curve can be described by a small electrical model: a current source, one or two diodes and two resistors. Finding the five or seven numbers in that model, **parameter extraction**, is how engineers simulate panels, spot losses and compare cells. A 2026 paper adds a new hybrid optimiser to the long list tested on the classic RTC France cell. This article uses the [[solar-cell-iv]] analyser, which fits the same single-diode model in your browser, to redraw the cell, check the paper's two models against each other and ask how precisely the parameters can really be known. To go from one cell to a whole system's output, see the [[solar-pv-yield]] calculator; for other models, the [[curve-fitter]].

## The paper in brief

The **single-diode model** says a cell's current is a light-generated current *I*<sub>ph</sub>, minus what leaks back through a diode (set by the **saturation current** *I*<sub>0</sub> and the **ideality factor** *n*), minus what leaks through a **shunt resistance** *R*<sub>sh</sub>; a **series resistance** *R*<sub>s</sub> sits in the path to the terminals. The **double-diode model** adds a second diode for recombination losses.

Fitting these is hard because the equation is implicit (the current appears on both sides) and the parameters trade off against each other. The authors combine two search methods that work with groups of trial answers: the **shuffled frog leaping algorithm** and **shuffled complex evolution**. They tested the hybrid on the RTC France cell, a 57 mm silicon cell measured at 33 °C in 1986 and used as a benchmark ever since, and on two commercial modules.

For RTC France, the single-diode fit has an **RMSE** (root-mean-square error, the typical gap between measured and modelled current) of 0.986 mA; the double-diode fit 0.982 mA. The authors note that in the more complex models some parameters stick to the edge of the allowed range, so their physical meaning is limited: in the double-diode fit, the first ideality factor sits exactly at its bound of 2.

## Checked with the tools

The Solar cell I-V analyser uses an explicit form of the single-diode equation (with the Lambert W function, so no guessing loop is needed) and fits it by Levenberg-Marquardt, a standard least-squares method. We used the paper's parameters and the 33 °C cell temperature. The noise tests in Step 4 use **simulated** data, not the measured RTC France points.

**Step 1: the curve and its figures of merit.** At 33 °C the thermal voltage kT/q is 26.38 mV, so *n*kT/q = 39.08 mV. With the paper's single-diode parameters, the model gives a short-circuit current of **760.3 mA**, an open-circuit voltage of **0.5728 V**, and a maximum power of **310.65 mW** at 0.4506 V and 689.4 mA (Figure 1). The **fill factor**, how "square" the curve is, is **71.3%**. These match the values usually quoted for this benchmark.

<!-- fig:iv -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 318" role="img" aria-label="The current stays near 760 mA up to about 0.4 V and then falls to zero at 0.5728 V; power peaks at 310.7 mW." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>RTC France cell from the paper's single-diode parameters (33 °C)</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">RTC France cell from the paper's single-diode parameters (33 °C)</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--line)"/><text x="52" y="276" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="219.8" y2="219.8" style="stroke:var(--line)"/><text x="52" y="223.8" text-anchor="end" style="fill:var(--muted)">0.2</text><line x1="58" x2="546" y1="167.5" y2="167.5" style="stroke:var(--line)"/><text x="52" y="171.5" text-anchor="end" style="fill:var(--muted)">0.4</text><line x1="58" x2="546" y1="115.3" y2="115.3" style="stroke:var(--line)"/><text x="52" y="119.3" text-anchor="end" style="fill:var(--muted)">0.6</text><line x1="58" x2="546" y1="63.1" y2="63.1" style="stroke:var(--line)"/><text x="52" y="67.1" text-anchor="end" style="fill:var(--muted)">0.8</text><line x1="58" x2="58" y1="272" y2="276" style="stroke:var(--muted)"/><text x="58" y="289" text-anchor="middle" style="fill:var(--muted)">-0.2</text><line x1="184.2" x2="184.2" y1="272" y2="276" style="stroke:var(--muted)"/><text x="184.2" y="289" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="310.4" x2="310.4" y1="272" y2="276" style="stroke:var(--muted)"/><text x="310.4" y="289" text-anchor="middle" style="fill:var(--muted)">0.2</text><line x1="436.6" x2="436.6" y1="272" y2="276" style="stroke:var(--muted)"/><text x="436.6" y="289" text-anchor="middle" style="fill:var(--muted)">0.4</text><line x1="58" x2="546" y1="272" y2="272" style="stroke:var(--muted)"/><text x="302" y="310" text-anchor="middle" style="fill:var(--ink)">Voltage (V)</text><text transform="translate(14 161) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Current (A) and power (W)</text><line x1="468.6" x2="468.6" y1="50" y2="272" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="464.6" y="62" text-anchor="end" style="fill:var(--muted)">Pmax 310.7 mW</text><path d="M58 72.5L62.2 72.5L66.4 72.5L70.6 72.6L74.8 72.6L79 72.6L83.2 72.7L87.5 72.7L91.6 72.7L95.9 72.8L100.1 72.8L104.3 72.8L108.5 72.9L112.7 72.9L116.9 72.9L121.1 73L125.3 73L129.5 73L133.7 73L138 73.1L142.1 73.1L146.3 73.1L150.6 73.2L154.7 73.2L159 73.2L163.2 73.3L167.4 73.3L171.6 73.3L175.8 73.4L180 73.4L184.2 73.4L188.4 73.5L192.6 73.5L196.8 73.5L201.1 73.6L205.2 73.6L209.5 73.6L213.7 73.7L217.8 73.7L222.1 73.7L226.3 73.8L230.5 73.8L234.7 73.8L238.9 73.9L243.1 73.9L247.3 73.9L251.5 74L255.7 74L259.9 74L264.2 74.1L268.3 74.1L272.6 74.1L276.8 74.2L281 74.2L285.2 74.2L289.4 74.3L293.6 74.3L297.8 74.3L302 74.4L306.2 74.4L310.4 74.4L314.7 74.5L318.8 74.5L323 74.6L327.3 74.6L331.4 74.6L335.7 74.7L339.9 74.7L344.1 74.8L348.3 74.8L352.5 74.9L356.7 75L360.9 75L365.1 75.1L369.3 75.2L373.5 75.3L377.8 75.4L381.9 75.5L386.2 75.6L390.4 75.7L394.5 75.9L398.8 76.1L403 76.3L407.2 76.6L411.4 76.9L415.6 77.2L419.8 77.6L424 78.1L428.2 78.6L432.4 79.3L436.6 80L440.9 80.9L445 82L449.3 83.2L453.5 84.6L457.7 86.2L461.9 88.2L466.1 90.4L470.3 93.1L474.5 96.1L478.7 99.6L482.9 103.7L487.1 108.4L491.4 113.8L495.5 119.9L499.7 126.9L504 134.7L508.1 143.5L512.4 153.4L516.6 164.3L520.8 176.3L525 189.6L529.2 204L533.4 219.6L537.6 236.4L541.8 254.4L546 273.6" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 272L62.2 272L66.4 272L70.6 272L74.8 272L79 272L83.2 272L87.5 272L91.6 272L95.9 272L100.1 272L104.3 272L108.5 272L112.7 272L116.9 272L121.1 272L125.3 272L129.5 272L133.7 272L138 272L142.1 272L146.3 272L150.6 272L154.7 272L159 272L163.2 272L167.4 272L171.6 272L175.8 272L180 272L184.2 272L188.4 270.7L192.6 269.4L196.8 268L201.1 266.7L205.2 265.4L209.5 264.1L213.7 262.7L217.8 261.4L222.1 260.1L226.3 258.8L230.5 257.5L234.7 256.1L238.9 254.8L243.1 253.5L247.3 252.2L251.5 250.9L255.7 249.6L259.9 248.2L264.2 246.9L268.3 245.6L272.6 244.3L276.8 243L281 241.7L285.2 240.4L289.4 239L293.6 237.7L297.8 236.4L302 235.1L306.2 233.8L310.4 232.5L314.7 231.2L318.8 229.9L323 228.6L327.3 227.3L331.4 225.9L335.7 224.6L339.9 223.3L344.1 222L348.3 220.7L352.5 219.4L356.7 218.1L360.9 216.8L365.1 215.6L369.3 214.3L373.5 213L377.8 211.7L381.9 210.4L386.2 209.2L390.4 207.9L394.5 206.6L398.8 205.4L403 204.2L407.2 203L411.4 201.8L415.6 200.6L419.8 199.4L424 198.3L428.2 197.2L432.4 196.2L436.6 195.2L440.9 194.3L445 193.5L449.3 192.7L453.5 192L457.7 191.5L461.9 191.1L466.1 190.9L470.3 190.9L474.5 191.1L478.7 191.6L482.9 192.3L487.1 193.5L491.4 195L495.5 197L499.7 199.4L504 202.4L508.1 206.1L512.4 210.3L516.6 215.3L520.8 221L525 227.5L529.2 234.8L533.4 243L537.6 252.1L541.8 262L546 272.9" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round;stroke-dasharray:true"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Current</text><line x1="134.4" x2="146.4" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2;stroke-dasharray:true"/><text x="150.4" y="40" style="fill:var(--muted)">Power</text><text class="fibub-mark" x="546" y="310" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Current and power of the RTC France cell at 33 °C, drawn from the paper's single-diode parameters with the Solar cell I-V analyser's explicit model.</figcaption></figure>
<!-- /fig:iv -->

**Step 2: the fit gives back its own parameters.** We fed the tool 16 exact points computed from the paper's model (listed under Check it yourself) and let it fit blind. It returned *I*<sub>ph</sub> 0.760775 A, *I*<sub>0</sub> 3.2303 × 10⁻⁷ A, *n* 1.4812, *R*<sub>s</sub> 0.03638 Ω and *R*<sub>sh</sub> 53.717 Ω: the paper's values to four or five figures. So the tool's model and the paper's are the same equation.

**Step 3: one diode or two?** We worked out the double-diode current from the paper's second parameter set and subtracted the single-diode current. Between −0.2 V and 0.58 V the two never differ by more than **0.13 mA** (Figure 2), about one-eighth of the fitting error itself. The double-diode model lowers the RMSE by only 0.4%. With data this close, the extra diode cannot be pinned down, which is exactly why its ideality factor ran to the edge of the range.

<!-- fig:diff -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 270" role="img" aria-label="The two models' currents differ by less than the fit's own scatter of about 1 mA at every voltage." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Two-diode minus one-diode current</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Two-diode minus one-diode current</text><line x1="58" x2="546" y1="192" y2="192" style="stroke:var(--line)"/><text x="52" y="196" text-anchor="end" style="fill:var(--muted)">-1</text><line x1="58" x2="546" y1="128" y2="128" style="stroke:var(--line)"/><text x="52" y="132" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="64" y2="64" style="stroke:var(--line)"/><text x="52" y="68" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="58" y1="224" y2="228" style="stroke:var(--muted)"/><text x="58" y="241" text-anchor="middle" style="fill:var(--muted)">-0.2</text><line x1="183.1" x2="183.1" y1="224" y2="228" style="stroke:var(--muted)"/><text x="183.1" y="241" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="308.3" x2="308.3" y1="224" y2="228" style="stroke:var(--muted)"/><text x="308.3" y="241" text-anchor="middle" style="fill:var(--muted)">0.2</text><line x1="433.4" x2="433.4" y1="224" y2="228" style="stroke:var(--muted)"/><text x="433.4" y="241" text-anchor="middle" style="fill:var(--muted)">0.4</text><line x1="58" x2="546" y1="224" y2="224" style="stroke:var(--muted)"/><text x="302" y="262" text-anchor="middle" style="fill:var(--ink)">Voltage (V)</text><text transform="translate(14 128) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Difference (mA)</text><line x1="58" x2="546" y1="64.9" y2="64.9" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="59.900000000000006" text-anchor="end" style="fill:var(--muted)">paper's RMSE, +0.99 mA</text><line x1="58" x2="546" y1="191.1" y2="191.1" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="186.1" text-anchor="end" style="fill:var(--muted)">−0.99 mA</text><path d="M58 134.5L64.1 134.1L70.2 133.7L76.3 133.3L82.4 133L88.5 132.6L94.6 132.2L100.7 131.9L106.8 131.5L112.9 131.1L119 130.8L125.1 130.4L131.2 130L137.3 129.7L143.4 129.3L149.5 128.9L155.6 128.6L161.7 128.2L167.8 127.8L173.9 127.5L180 127.1L186.1 126.8L192.2 126.4L198.3 126.1L204.4 125.7L210.5 125.4L216.6 125L222.7 124.7L228.8 124.4L234.9 124L241 123.7L247.1 123.4L253.2 123.1L259.3 122.8L265.4 122.6L271.5 122.3L277.6 122.1L283.7 121.9L289.8 121.8L295.9 121.6L302 121.5L308.1 121.5L314.2 121.4L320.3 121.5L326.4 121.6L332.5 121.8L338.6 122L344.7 122.4L350.8 122.8L356.9 123.3L363 123.9L369.1 124.6L375.2 125.5L381.3 126.4L387.4 127.4L393.5 128.6L399.6 129.7L405.7 131L411.8 132.2L417.9 133.4L424 134.5L430.1 135.4L436.2 136.1L442.3 136.4L448.4 136.4L454.5 135.8L460.6 134.8L466.7 133.2L472.8 131.3L478.9 129.1L485 126.8L491.1 124.8L497.2 123.4L503.3 122.9L509.4 123.3L515.5 124.7L521.6 126.8L527.7 129.1L533.8 130.9L539.9 131.4L546 129.8" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><text class="fibub-mark" x="546" y="262" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Current from the paper's two-diode parameters minus the current from its single-diode parameters (two-diode solved with a short Newton loop of ours), against the size of the paper's fitting error.</figcaption></figure>
<!-- /fig:diff -->

**Step 4: how sharp are the numbers?** The paper gives parameters to six or seven figures. To see how many the data can support, we made 26 points from the single-diode curve, added random noise of 1 mA (the size of the paper's RMSE) and let the tool fit them, 50 times with fresh noise. In 49 runs the fit found the right answer; once it settled in a wrong, far-off minimum, a reminder of why the paper uses a global search. Across the 49, the middle 90% of the fits gave:

| Parameter | Paper (single diode) | 49 fits to simulated noisy data |
|---|---|---|
| *I*<sub>ph</sub> | 0.7607755 A | 0.7602 to 0.7612 A |
| *I*<sub>0</sub> | 3.23021 × 10⁻⁷ A | 2.1 to 4.2 × 10⁻⁷ A |
| *n* | 1.481181 | 1.440 to 1.507 |
| *R*<sub>s</sub> | 0.036377 Ω | 0.0349 to 0.0381 Ω |
| *R*<sub>sh</sub> | 53.71853 Ω | 47.3 to 59.6 Ω |
| RMSE | 0.986 mA | 0.86 mA (average) |

The photocurrent is pinned to about 0.1%, but *I*<sub>0</sub> to only about ±30% and *R*<sub>sh</sub> to about ±12%. Differences between optimisers in the fifth or sixth figure, common in this literature, are far smaller than what the data can tell apart. A better RMSE is still a fair test of a search method; it is not a sharper measurement of the cell.

## How we made the graphs

The charts and every number above come from `scripts/blog-figures/pv-parameter-extraction-sfl-sce-rtc-france-single-diode.mjs` in fibub's public code. It calls the Solar cell I-V analyser's functions from `src/lib/sci/solarcell.ts`:

- `thermalVoltage`, `currentAt` and `modelMpp` for the curve, the open-circuit voltage and the maximum power point;
- `normalise`, `metrics` and `fitDiode` for the blind fits in Steps 2 and 4, exactly as the tool runs them.

The single- and double-diode parameters, RMSE values and 33 °C are the paper's. The double-diode current is solved by a short Newton loop written in the script (the tool fits one diode only). The 1 mA noise, the 26 voltages from −0.2 to 0.59 V and the random seed are our choices, labelled in the script; the noisy data are **simulated**. Run the script and it prints every number and redraws both charts.

## How we test the maths

On every change to fibub, `tests/sci-tools/solar-cell-iv.mjs` checks the analyser against SciPy and pvlib, a widely used solar modelling library:

- The explicit current must solve the implicit diode equation to 10⁻¹⁵ A at every voltage, and match pvlib's current at 0 V, **0.1497504076 A**, for the made-up test cell.
- The model's open-circuit voltage must be **0.62833026 V** and its maximum power **64.885158 mW**, as pvlib's single-diode solver gives.
- The fit to the test data must return *I*<sub>0</sub> **9.93494 × 10⁻¹⁰ A**, *n* **1.299558** and *R*<sub>s</sub> **0.500207 Ω**, matching SciPy's least-squares fit, with the same standard errors to 1 part in 10,000.

## Check it yourself

On the [[solar-cell-iv]] analyser:

1. Paste these 16 points (voltage in V, current in mA, one per line), worked out from the paper's single-diode parameters:

```
-0.2 763.982
-0.1 762.121
0 760.26
0.1 758.392
0.2 756.431
0.3 753.275
0.35 748.72
0.4 734.969
0.45 690.327
0.5 555.71
0.52 454.217
0.54 315.623
0.56 136.285
0.57 31.091
0.58 -84.2
0.59 -209.215
```

2. Leave *Current column* on **Current (mA)**, type **33** in *Cell temperature (°C)* and **1** in *Cells in series*, and keep **Fit the single-diode model** ticked.
3. *Short-circuit current Isc* reads about **760.3 mA** and *Open-circuit voltage Voc* about **0.5727 V** (read by a straight line between the two points either side of zero current; the model's own value is 0.5728 V). *Maximum power Pmax* reads about **310.6 mW**.
4. In the model table, *Ideality factor n* reads about **1.4812**, *Series resistance Rs* about **0.03638 Ω**, *Shunt resistance Rsh* about **53.72 Ω** and *Saturation current I0* about **3.23 × 10⁻⁷ A**, and *Model Pmax, FF* about **310.65 mW, 71.34%**.
5. Change one current by 1 mA and fit again: watch *I0* and *Rsh* move far more than *Iph*.

If you have the measured RTC France points, paste them instead: the fit should land close to the paper's parameters, with an *RMS misfit* near 1,000 µA.

## What researchers can use it for

- **Check a published parameter set:** paste the measured curve into the [[solar-cell-iv]] analyser and see whether the quoted parameters really give the quoted RMSE.
- **Get honest error bars:** the analyser reports a standard error for every parameter, so you can see when *I*<sub>0</sub> or *R*<sub>sh</sub> are poorly fixed, as in Step 4.
- **A start point or referee for optimisers:** a fast local fit from good starting values gives a baseline any new metaheuristic should beat or match.
- **From cell to system:** feed the cell's efficiency into the [[solar-pv-yield]] calculator to estimate yearly energy.
- **Teach** how series and shunt resistance shape a cell's curve, by editing points and refitting.

## The fine print

- All model parameters and RMSE values are the paper's; the measured RTC France data were not used. The noisy curves in Step 4 are **simulated** from the paper's single-diode model with 1 mA of random noise.
- The parameter ranges in Step 4 depend on our choice of 26 evenly spaced points and of noise size; real measurements have their own spacing and errors, which can widen or narrow them.
- The analyser fits one diode only; the double-diode current was computed by our script from the paper's values.
- The paper also fits a three-diode model and two commercial modules; we did not check those.
