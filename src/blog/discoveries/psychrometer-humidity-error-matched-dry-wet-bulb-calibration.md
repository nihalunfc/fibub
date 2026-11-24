---
title: "Psychrometer humidity error: calibrating the dry and wet bulbs as a pair"
summary: "A 2026 study cuts the humidity error of a cheap psychrometer by matching its two thermometers' errors. We recompute its error cases with fibub's psychrometrics maths."
tools: [psychrometric-calculator, heat-stress, weather-log]
updated: 2026-11-24
sources:
  - "de Araújo, J. W. B., Ferrando, D. F. C., Ferrari, F., Kuroda, P. A. B. and Kakuno, E. M. (2026), A Simple Method to Minimize Humidity Measurement Error in Psychrometers, J 9(1): 7, doi:10.3390/j9010007. Licence CC BY, checked on the MDPI article PDF, 2026-11-24. Values used here: the worked case at 292.15 K (19 °C), 66.8 % RH and 101 325 Pa with ±1 K transducers, error up to 15.6 %; a table case at 70 % RH with the dry bulb 1 K low and the wet bulb 1 K high giving 100.5 % (30.5 points); Tetens saturation pressure and a psychrometer coefficient of 6.514 × 10⁻⁴ per kelvin; LM35D transducers (±0.9 K), Pt100 class AA reference better than ±0.05 K; experiment at 288.65 to 292.15 K, 98 000.88 Pa and about 62 to 82 % RH; dry-bulb transducer S3d off by +0.24 K; uncorrected error about −7.6 % for one pair; improvements of 22 to 25 times at 62 % RH and 18 times at 80 %, and up to 75 times in simulation."
  - "ASHRAE Handbook, Fundamentals (2017, SI), chapter 1, Psychrometrics: Hyland-Wexler saturation pressure and the thermodynamic wet bulb equations used by the tool."
paper:
  title: "A Simple Method to Minimize Humidity Measurement Error in Psychrometers"
  authors: "de Araújo JWB, Ferrando DFC, Ferrari F, Kuroda PAB, Kakuno EM"
  journal: "J"
  year: 2026
  doi: "10.3390/j9010007"
  url: "https://doi.org/10.3390/j9010007"
  licence: "CC BY"
  reviewed: true
---

A **psychrometer** measures humidity with two thermometers: a dry one that reads the air, and a wet one wrapped in a damp wick, cooled by evaporation. The drier the air, the bigger the gap between them. It is one of the oldest humidity instruments and still one of the cheapest to build from electronic sensors, but it has a weakness: a small error in either thermometer becomes a large error in humidity. A 2026 paper in the MDPI journal *J* shows that most of that error can be cancelled by calibrating the two thermometers **against each other**, so they share the same error, instead of trying to make each one perfect. This article rebuilds the paper's error cases with the [[psychrometric-calculator|Psychrometrics]] tool's maths and shows where the trick works best. To use humidity once you have it, see the [[heat-stress]] calculator for wet-bulb globe temperature, and the [[weather-log]] for keeping daily readings.

## The paper in brief

The authors built a ventilated psychrometer from LM35D temperature sensors, small chips that cost little but are only good to about ±0.9 K. They compared them with two Pt100 class AA platinum sensors read to better than ±0.05 K, at 15.5 to 19 °C and about 62 to 82 % relative humidity (RH), at a pressure of 98 kPa.

They first worked out how transducer errors spread into RH. At 19 °C and 66.8 % RH, with ±1 K sensors, they found RH could be wrong by up to **15.6 percentage points**; in one table case at 70 % RH, a dry bulb reading 1 K low and a wet bulb reading 1 K high gave an impossible **100.5 %**. The reason: RH depends mostly on the **difference** between the two readings (the wet-bulb depression), which at 19 °C and 67 % RH is only about 4 K. Two opposite 1 K errors change that difference by 2 K, about half of it.

Their fix is simple. If both sensors are off by the **same** amount, the depression is right and the RH error nearly vanishes. So they offset one sensor to match the other, using the reference only to measure each sensor's error once. In the experiment, one pair whose uncorrected error was about −7.6 points improved by about **22 to 25 times at 62 % RH** and **18 times at 80 %**; their simulation suggests up to **75 times** is possible.

## Checked with the tools

We recomputed the error cases with the tool's ASHRAE equations (Hyland-Wexler saturation pressure and the thermodynamic wet bulb). The paper uses the older Tetens formula and a fixed psychrometer coefficient, so small differences are expected. Everything here is a **recomputation** from the stated conditions, not the paper's measured data.

**Step 1: the worked case.** At 19 °C, 66.8 % RH and sea-level pressure (101.325 kPa), the tool puts the wet bulb at **15.14 °C**. Now add errors of 1 K:

| Error in dry bulb, wet bulb | RH error (tool) | Paper |
|---|---|---|
| −1 K, +1 K | +16.2 points | up to 15.6 |
| +1 K, −1 K | −14.2 points | |
| +1 K, 0 | −6.8 points | |
| 0, +1 K | +8.2 points | |
| +1 K, +1 K (matched) | +0.84 points | small |
| −1 K, −1 K (matched) | −0.89 points | small |

The worst case comes out at 16.2 points, close to the paper's 15.6; at the experiment's 98 kPa it is 16.0. The rest of the gap is the formula: the paper's Tetens and fixed coefficient against the tool's ASHRAE wet bulb. A matched error of 1 K leaves less than a point. Figure 1 shows the same four cases across humidity.

<!-- fig:error -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="Error in relative humidity from ±1 K transducer errors at 19 °C and sea-level pressure. Opposite errors give 16.18 and -14.23 points at 66.8 % RH; matched errors (both +1 K) give only 0.842." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>A ±1 K psychrometer at 19 °C: error in relative humidity</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">A ±1 K psychrometer at 19 °C: error in relative humidity</text><line x1="58" x2="546" y1="218.3" y2="218.3" style="stroke:var(--line)"/><text x="52" y="222.3" text-anchor="end" style="fill:var(--muted)">-20</text><line x1="58" x2="546" y1="151" y2="151" style="stroke:var(--line)"/><text x="52" y="155" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="83.7" y2="83.7" style="stroke:var(--line)"/><text x="52" y="87.7" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="58" y1="252" y2="256" style="stroke:var(--muted)"/><text x="58" y="269" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="197.4" x2="197.4" y1="252" y2="256" style="stroke:var(--muted)"/><text x="197.4" y="269" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="336.9" x2="336.9" y1="252" y2="256" style="stroke:var(--muted)"/><text x="336.9" y="269" text-anchor="middle" style="fill:var(--muted)">60</text><line x1="476.3" x2="476.3" y1="252" y2="256" style="stroke:var(--muted)"/><text x="476.3" y="269" text-anchor="middle" style="fill:var(--muted)">80</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">True relative humidity (%)</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Error in RH (points)</text><line x1="58" x2="546" y1="151" y2="151" style="stroke:var(--muted);stroke-dasharray:4 4"/><path d="M58 112.6L71.9 111.9L85.9 111.3L99.8 110.6L113.8 109.9L127.7 109.2L141.7 108.5L155.6 107.9L169.5 107.2L183.5 106.5L197.4 105.8L211.4 105.1L225.3 104.4L239.3 103.7L253.2 103.1L267.1 102.4L281.1 101.7L295 101L309 100.3L322.9 99.6L336.9 98.9L350.8 98.2L364.7 97.5L378.7 96.8L392.6 96.1L406.6 95.4L420.5 94.7L434.5 94L448.4 93.3L462.3 92.6L476.3 91.9L490.2 91.2" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 184.4L71.9 185L85.9 185.6L99.8 186.2L113.8 186.9L127.7 187.5L141.7 188.1L155.6 188.7L169.5 189.3L183.5 189.9L197.4 190.6L211.4 191.2L225.3 191.8L239.3 192.4L253.2 193L267.1 193.7L281.1 194.3L295 194.9L309 195.5L322.9 196.1L336.9 196.8L350.8 197.4L364.7 198L378.7 198.6L392.6 199.3L406.6 199.9L420.5 200.5L434.5 201.2L448.4 201.8L462.3 202.4L476.3 203L490.2 203.7L504.2 204.3L518.1 204.9L532.1 205.6L546 206.2" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M58 143.8L71.9 144L85.9 144.2L99.8 144.4L113.8 144.6L127.7 144.8L141.7 145L155.6 145.2L169.5 145.4L183.5 145.6L197.4 145.7L211.4 145.9L225.3 146.1L239.3 146.3L253.2 146.5L267.1 146.7L281.1 146.8L295 147L309 147.2L322.9 147.4L336.9 147.6L350.8 147.7L364.7 147.9L378.7 148.1L392.6 148.3L406.6 148.4L420.5 148.6L434.5 148.8L448.4 149L462.3 149.1L476.3 149.3L490.2 149.5L504.2 149.6L518.1 149.8L532.1 150L546 150.2" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Dry −1 K, wet +1 K</text><line x1="213.6" x2="225.6" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="229.6" y="40" style="fill:var(--muted)">Dry +1 K, wet −1 K</text><line x1="369.2" x2="381.2" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="385.2" y="40" style="fill:var(--muted)">Both +1 K (matched)</text><text class="fibub-mark" x="546" y="290" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Error in relative humidity caused by ±1 K errors in the dry and wet bulbs of a psychrometer at 19 °C and 101.325 kPa, worked out with the Psychrometrics tool's ASHRAE maths. Opposite errors are the worst case; the same error in both bulbs nearly cancels.</figcaption></figure>
<!-- /fig:error -->

**Step 2: the 30.5-point case.** At 19 °C and 70 % RH the tool gives +16.5 points for the "dry low, wet high" case, not 30.5. An error that big needs colder air, where the wet-bulb depression is smaller: **22.6 points at 10 °C**, **27.9 at 5 °C** and **29.9 at 3.5 °C**. Below about 3 °C, at 70 % RH, the wet bulb reading would rise above the dry bulb reading and no humidity fits at all; the tool refuses it, which is the same "RH above 100 %" the paper had to fence off. The paper does not say what temperature that table row used; our guess is the cold end of its 1 to 61 °C range.

**Step 3: the experiment's −7.6 points.** One dry-bulb sensor (S3d) read 0.24 K high. At about 19 °C and 70 % RH and 98 kPa, the tool says a wet-bulb sensor reading **0.75 K low** would produce the reported −7.6 points. That is **our inference**, not a value from the paper, but it is well within the LM35D's ±0.9 K, and it shows how two in-spec sensors can still give a humidity that is 7 points off.

**Step 4: how much does matching help?** We divided the worst-case error (opposite ±1 K errors) by the matched error (+1 K in both), across humidity and temperature (Figure 2). At 19 °C the gain is **11 times at 50 % RH**, **16 times at 62 %** and **35 times at 80 %**; at 60 °C and 90 % RH it reaches **100 times**. So the paper's "up to 75 times" is within reach in warm, humid air, and its measured 22 to 25 times at 62 % RH fits the 16 to 22 times we find at 19 °C between 62 and 70 % for ±1 K errors. The gain grows with humidity because, as the air nears saturation, the depression shrinks and a matched error cancels almost completely.

<!-- fig:ratio -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="Ratio of the RH error with opposite ±1 K errors to the error with the same +1 K error in both bulbs, at 5, 19 and 40 °C. The ratio is largest in humid, cool air." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>How much matching the two errors helps</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">How much matching the two errors helps</text><line x1="58" x2="546" y1="250.8" y2="250.8" style="stroke:var(--line)"/><text x="52" y="254.8" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="195.8" y2="195.8" style="stroke:var(--line)"/><text x="52" y="199.8" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="140.8" y2="140.8" style="stroke:var(--line)"/><text x="52" y="144.8" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="546" y1="85.8" y2="85.8" style="stroke:var(--line)"/><text x="52" y="89.8" text-anchor="end" style="fill:var(--muted)">60</text><line x1="119" x2="119" y1="252" y2="256" style="stroke:var(--muted)"/><text x="119" y="269" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="241" x2="241" y1="252" y2="256" style="stroke:var(--muted)"/><text x="241" y="269" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="363" x2="363" y1="252" y2="256" style="stroke:var(--muted)"/><text x="363" y="269" text-anchor="middle" style="fill:var(--muted)">60</text><line x1="485" x2="485" y1="252" y2="256" style="stroke:var(--muted)"/><text x="485" y="269" text-anchor="middle" style="fill:var(--muted)">80</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">True relative humidity (%)</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Worst-case error ÷ matched error</text><path d="M58 237L73.3 236.5L88.5 236L103.8 235.4L119 234.9L134.3 234.3L149.5 213L164.8 214L180 215L195.3 216L210.5 225.1L225.8 223.7L241 222.3L256.3 220.7L271.5 218.9L286.8 217L302 214.9L317.3 212.6L332.5 210L347.8 207.1L363 203.8L378.3 200.1L393.5 195.9L408.8 191.1L424 185.4" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 239L73.3 238.3L88.5 237.6L103.8 236.8L119 236L134.3 235.2L149.5 234.2L164.8 233.3L180 232.2L195.3 231.1L210.5 229.8L225.8 228.5L241 227.1L256.3 225.5L271.5 223.8L286.8 222L302 219.9L317.3 217.6L332.5 215.1L347.8 212.3L363 209.1L378.3 205.5L393.5 201.3L408.8 196.5L424 191L439.3 184.4L454.5 176.5L469.8 166.8L485 154.7" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M58 241.2L73.3 240.3L88.5 239.4L103.8 238.5L119 237.5L134.3 236.4L149.5 235.3L164.8 234L180 232.7L195.3 231.3L210.5 229.8L225.8 228.2L241 226.4L256.3 224.5L271.5 222.4L286.8 220.1L302 217.6L317.3 214.8L332.5 211.7L347.8 208.3L363 204.4L378.3 200L393.5 195L408.8 189.3L424 182.6L439.3 174.6L454.5 165.1L469.8 153.5L485 139L500.3 120.4L515.5 95.6L530.8 60.8" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">5 °C</text><line x1="112.8" x2="124.8" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="128.8" y="40" style="fill:var(--muted)">19 °C</text><line x1="174.8" x2="186.8" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="190.8" y="40" style="fill:var(--muted)">40 °C</text><text class="fibub-mark" x="546" y="290" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The worst-case error divided by the matched-pair error, for ±1 K transducers. Matching gains most in cool, humid air. Our calculation, not the paper's simulation.</figcaption></figure>
<!-- /fig:ratio -->

## How we made the graphs

All numbers and both charts come from `scripts/blog-figures/psychrometer-humidity-error-matched-dry-wet-bulb-calibration.mjs` in fibub's public code. It calls `air` from `src/lib/sci/psychro.ts`, the maths behind [[psychrometric-calculator|Psychrometrics]]: first with the true temperature and RH to get the true wet bulb, then with the shifted dry and wet readings to get the RH a faulty psychrometer would show.

From the paper: 19 °C, 66.8 % RH, 101 325 Pa, ±1 K, the 98 000.88 Pa experiment pressure, the +0.24 K sensor offset and the −7.6-point error. **Our choices**: the temperatures and humidities scanned, and treating the errors as fixed offsets (real sensors also drift and have scale errors).

## How we test the maths

On every change to fibub, `tests/sci.mjs` checks the psychrometric equations against ASHRAE Fundamentals:

- Saturation pressure at 20 °C is 2338.8 Pa and at −10 °C (over ice) 259.9 Pa, as in ASHRAE's table.
- ASHRAE's worked example, 40 °C dry bulb and 20 °C wet bulb at 101.325 kPa, gives a humidity ratio of 0.0064, an enthalpy of 56.7 kJ/kg and 14 % RH.
- New with this article, in `tests/sci-tools/psychrometric-calculator.mjs`: 19 °C and 66.8 % give a wet bulb of 15.14 °C; opposite ±1 K errors give +16.2 and −14.2 points and a matched +1 K error 0.84 points; and the readings typed below give 83.0 % and 67.6 %.

## Check it yourself

On [[psychrometric-calculator|Psychrometrics]], leave *Altitude (m)* at **0** (sea-level pressure):

1. Type **19** in *Dry bulb (air) temperature*, choose **Wet bulb** in *And*, and type **15.14**. The headline reads **66.8 % RH**: the true air.
2. Now pretend the dry bulb reads 1 K low and the wet bulb 1 K high: dry bulb **18**, wet bulb **16.14**. The tool shows **83 % RH**, about 16 points too high.
3. Swap the errors: dry bulb **20**, wet bulb **14.14**. It shows **52.6 %**, about 14 points too low.
4. Now give both the same error: dry bulb **20**, wet bulb **16.14**. It shows **67.6 %**, less than a point off. That is the whole idea of the paper.
5. Try the same four steps at a dry bulb of 5 °C and watch the errors grow.

## What researchers can use it for

- **Set a sensor budget** for a home-built psychrometer: put in the true air, shift each reading by its tolerance and see the RH error ([[psychrometric-calculator|Psychrometrics]]).
- **Check a humidity error table** in a paper or a data sheet in a minute, at any pressure or altitude.
- **Find the conditions where a psychrometer is weakest** (cold air, small depressions) before a field campaign.
- **Turn psychrometer readings into heat stress**: wet bulb and air temperature go straight into the [[heat-stress]] calculator.
- **Teach error propagation** with a real instrument: the same 1 K matters ten times more in the difference than in the readings.

## The fine print

- The tool uses ASHRAE's equations; the paper uses Tetens and a fixed psychrometer coefficient, so our numbers differ by a few tenths of a point.
- The wet bulb here is the ideal (thermodynamic) one. A real psychrometer needs enough airflow over the wick to reach it, and a poorly ventilated one reads high.
- Below 0 °C the wick freezes and the tool switches to ice; that is why the 5 °C curve in Figure 2 bends at low humidity.
- Matching removes a shared offset, not random noise or drift; the sensors still need checking from time to time.
