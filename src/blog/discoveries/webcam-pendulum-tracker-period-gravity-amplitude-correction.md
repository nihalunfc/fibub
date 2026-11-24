---
title: "Webcam pendulum tracker: period, gravity and the large-swing correction"
summary: "A 2025 browser tool times a pendulum with a phone camera. Its period comes out 0.25 % long; the exact large-amplitude formula shows an 11.5° swing explains it."
tools: [pendulum-analyser, video-motion-tracker, uncertainty-calculator]
updated: 2026-11-24
sources:
  - "de Souza, M. P. M., Maia, J. G. and de Andrade, L. N. (2025), Pendulum Tracker – SimuFísica: A Web-based Tool for Real-time Measurement of Oscillatory Motion, Physics Education 60: 055024, doi:10.1088/1361-6552/adf406; author version arXiv:2506.07301. Licence CC BY 4.0, checked on the arXiv page, 2026-11-24. Values used here: length 45.8 ± 0.1 cm; measured period 1.3630 ± 0.0004 s (frequency 0.7337 ± 0.0002 Hz) against 1.3595 s from the small-angle formula; amplitudes under 20° recommended; local g 9.7821671 m/s² at latitude 10.88° S; g from the length series 9.7 ± 0.2 m/s² with exponent 0.499 ± 0.003; damped run with length 31.2 cm, starting amplitude 6.3°, damping rate 0.005 per second over 150 s."
  - "Exact pendulum period 2π√(L/g) × 2K(sin(θ₀/2))/π, with K the complete elliptic integral of the first kind: standard mechanics (for example Abramowitz and Stegun, Handbook of Mathematical Functions, chapter 17, for K)."
paper:
  title: "Pendulum Tracker – SimuFísica: A Web-based Tool for Real-time Measurement of Oscillatory Motion"
  authors: "de Souza MPM, Maia JG, de Andrade LN"
  journal: "Physics Education"
  year: 2025
  doi: "10.1088/1361-6552/adf406"
  url: "https://arxiv.org/abs/2506.07301"
  licence: "CC BY 4.0 (arXiv version)"
  reviewed: true
---

A pendulum is the oldest way to measure gravity, and still one of the best first experiments in a physics class. The hard part has always been the timing. A 2025 paper in *Physics Education* describes **Pendulum Tracker**, a free web page that watches a swinging bob through a phone, tablet or laptop camera, follows it with computer vision and plots its angle against time as it swings. Their measured period came out a quarter of a percent longer than the textbook formula predicts, just outside their error bar. This article shows, with the [[pendulum-analyser]], that the size of the swing explains it. To track your own video frame by frame, use the [[video-motion-tracker]]; to carry the length and timing errors through to g, use the [[uncertainty-calculator]].

## The paper in brief

The authors built the tracker on OpenCV.js, a computer-vision library that runs inside the browser, so nothing needs installing and the data can be exported for analysis. They tested it in three ways. First, the **period**: for a 45.8 ± 0.1 cm pendulum, a Fourier fit to the tracked angle gave a frequency of 0.7337 ± 0.0002 Hz, a period of **1.3630 ± 0.0004 s**. The textbook small-angle formula, T = 2π√(L/g) with the local g of 9.7821671 m/s², predicts **1.3595 s**. The authors note that this lies slightly outside their uncertainty. Second, **gravity**: timing several lengths and fitting a power law gave an exponent of 0.499 ± 0.003 (theory 0.5) and **g = 9.7 ± 0.2 m/s²**. Third, **damping**: a 31.2 cm pendulum released at 6.3° lost amplitude at a rate of 0.005 per second over 150 s.

The paper recommends keeping swings under 20°, but it does not say how large the swing was in the period run.

## Checked with the tools

The small-angle formula assumes tiny swings. A real pendulum swung through a few degrees takes slightly longer, and the exact answer multiplies the small-angle period by 2K(sin(θ₀/2))/π, where θ₀ is the amplitude (the largest angle from vertical) and K is the complete elliptic integral. The Pendulum lab analyser uses this exact factor. This is a **recomputation** from the paper's stated length, period and g.

**Step 1: how big a swing explains the gap?** The measured period is 0.254 % longer than 1.3595 s. Solving the exact formula for the amplitude that gives 1.3630 s returns **11.5°** (Figure 1). Within the period's own ±0.0004 s error, the answer is 10.8° to 12.2°. That is a perfectly ordinary classroom swing, well inside the paper's 20° advice. A 0.1 cm error in the length moves the answer more, to between 8.7° and 13.8°, so length matters as much as timing.

<!-- fig:amp -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 260" role="img" aria-label="The exact period of a 45.8 cm pendulum rises from 1.3595 s for tiny swings to 1.3700 s at 20 degrees. It equals the measured 1.3630 s at an amplitude of 11.5 degrees." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Period of the 45.8 cm pendulum against swing size</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Period of the 45.8 cm pendulum against swing size</text><line x1="58" x2="546" y1="188" y2="188" style="stroke:var(--line)"/><text x="52" y="192" text-anchor="end" style="fill:var(--muted)">1.36</text><line x1="58" x2="546" y1="123" y2="123" style="stroke:var(--line)"/><text x="52" y="127" text-anchor="end" style="fill:var(--muted)">1.365</text><line x1="58" x2="546" y1="58" y2="58" style="stroke:var(--line)"/><text x="52" y="62" text-anchor="end" style="fill:var(--muted)">1.37</text><line x1="58" x2="58" y1="214" y2="218" style="stroke:var(--muted)"/><text x="58" y="231" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="180" x2="180" y1="214" y2="218" style="stroke:var(--muted)"/><text x="180" y="231" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="302" x2="302" y1="214" y2="218" style="stroke:var(--muted)"/><text x="302" y="231" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="424" x2="424" y1="214" y2="218" style="stroke:var(--muted)"/><text x="424" y="231" text-anchor="middle" style="fill:var(--muted)">15</text><line x1="546" x2="546" y1="214" y2="218" style="stroke:var(--muted)"/><text x="546" y="231" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="214" y2="214" style="stroke:var(--muted)"/><text x="302" y="252" text-anchor="middle" style="fill:var(--ink)">Amplitude (degrees from vertical)</text><text transform="translate(14 123) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Period (s)</text><line x1="58" x2="546" y1="149" y2="149" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="144" text-anchor="end" style="fill:var(--muted)">measured 1.3630 s</text><line x1="58" x2="546" y1="194.5" y2="194.5" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="189.5" text-anchor="end" style="fill:var(--muted)">small-angle 1.3595 s</text><line x1="338.6" x2="338.6" y1="32" y2="214" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="342.6" y="44" text-anchor="start" style="fill:var(--muted)">11.5°</text><path d="M58 193.9L64.1 193.9L70.2 193.7L76.3 193.7L82.4 193.5L88.5 193.3L94.6 193.1L100.7 192.8L106.8 192.6L112.9 192.2L119 191.8L125.1 191.3L131.2 190.9L137.3 190.3L143.4 189.7L149.5 189.2L155.6 188.5L161.7 187.7L167.8 187.1L173.9 186.3L180 185.4L186.1 184.6L192.2 183.7L198.3 182.7L204.4 181.8L210.5 180.7L216.6 179.7L222.7 178.5L228.8 177.3L234.9 176.2L241 174.9L247.1 173.6L253.2 172.3L259.3 171L265.4 169.5L271.5 168.1L277.6 166.6L283.7 165L289.8 163.4L295.9 161.9L302 160.2L308.1 158.5L314.2 156.7L320.3 154.9L326.4 153L332.5 151.2L338.6 149.3L344.7 147.3L350.8 145.2L356.9 143.3L363 141.1L369.1 139L375.2 136.8L381.3 134.6L387.4 132.4L393.5 130L399.6 127.7L405.7 125.3L411.8 122.9L417.9 120.4L424 117.8L430.1 115.3L436.2 112.7L442.3 110L448.4 107.3L454.5 104.5L460.6 101.8L466.7 99L472.8 96.1L478.9 93.2L485 90.2L491.1 87.3L497.2 84.3L503.3 81.1L509.4 78L515.5 74.8L521.6 71.7L527.7 68.4L533.8 65L539.9 61.6L546 58.3" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><text class="fibub-mark" x="546" y="252" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The exact period of a 45.8 cm pendulum against amplitude, from the Pendulum lab analyser's maths with the paper's local g. The measured period (upper dashed line) matches a swing of about 11.5°; the small-angle formula gives the lower line.</figcaption></figure>
<!-- /fig:amp -->

**Step 2: what the swing does to g.** Turn the formula round and work out g from this one length and period, assuming different swings:

| Assumed amplitude | Period the tool predicts | g from 45.8 cm and 1.3630 s |
|---|---|---|
| 0° (small-angle formula) | 1.3595 s | 9.733 m/s² |
| 5° | 1.3602 s | 9.742 m/s² |
| 10° | 1.3621 s | 9.770 m/s² |
| 15° | 1.3654 s | 9.817 m/s² |
| 20° | 1.3700 s | 9.883 m/s² |

Ignoring the swing makes g 0.5 % too low; assuming 20° when it was 10° makes it 1 % too high. The other route is the length: if the true pivot-to-centre length were 46.03 cm instead of 45.8, the small-angle formula alone would fit. A bob's centre a couple of millimetres lower than measured does the same job as an 11.5° swing, which is why careful experiments record both.

**Step 3: a length series.** To show what this means for a fit of several lengths, we **simulated** nine lengths from 20 to 60 cm, all swung at 11.5°, with 0.4 ms of random timing scatter (**our assumption**, not the paper's data). Fitting T² against L, as the analyser does, gives **g = 9.732 m/s²** without the amplitude correction and **9.781 ± 0.001 m/s²** with it, against the true 9.782 (Figure 2). The correction does not change the straight line's quality, only its slope, so a good R² alone will never reveal a forgotten amplitude.

<!-- fig:fit -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 278" role="img" aria-label="Simulated periods for nine lengths, all swung at 11.5 degrees. Fitting T squared against L without the amplitude correction gives g = 9.732; with it, g = 9.781 m/s², against the true 9.782." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Same swings, two answers for g (simulated)</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Same swings, two answers for g (simulated)</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--line)"/><text x="52" y="236" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="164.6" y2="164.6" style="stroke:var(--line)"/><text x="52" y="168.6" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="97.2" y2="97.2" style="stroke:var(--line)"/><text x="52" y="101.2" text-anchor="end" style="fill:var(--muted)">2</text><line x1="58" x2="58" y1="232" y2="236" style="stroke:var(--muted)"/><text x="58" y="249" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="208.2" x2="208.2" y1="232" y2="236" style="stroke:var(--muted)"/><text x="208.2" y="249" text-anchor="middle" style="fill:var(--muted)">0.2</text><line x1="358.3" x2="358.3" y1="232" y2="236" style="stroke:var(--muted)"/><text x="358.3" y="249" text-anchor="middle" style="fill:var(--muted)">0.4</text><line x1="508.5" x2="508.5" y1="232" y2="236" style="stroke:var(--muted)"/><text x="508.5" y="249" text-anchor="middle" style="fill:var(--muted)">0.6</text><line x1="58" x2="546" y1="232" y2="232" style="stroke:var(--muted)"/><text x="302" y="270" text-anchor="middle" style="fill:var(--ink)">Length L (m)</text><text transform="translate(14 141) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Period squared T² (s²)</text><circle cx="208.2" cy="177.4" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="245.7" cy="163.7" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="283.2" cy="149.9" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="320.8" cy="136.3" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="358.3" cy="122.6" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="395.8" cy="108.9" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="433.4" cy="95.3" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="470.9" cy="81.6" r="3" style="fill:var(--c-blog);opacity:1"/><circle cx="508.5" cy="68" r="3" style="fill:var(--c-blog);opacity:1"/><path d="M58 232L546 54.3" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round;stroke-dasharray:true"/><path d="M58 232L546 55.1" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Simulated periods at 11.5°</text><line x1="271.2" x2="283.2" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2;stroke-dasharray:true"/><text x="287.2" y="40" style="fill:var(--muted)">No correction: g = 9.732</text><line x1="470" x2="482" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="486" y="40" style="fill:var(--muted)">Corrected: g = 9.781</text><text class="fibub-mark" x="546" y="270" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Simulated periods (our assumption: nine lengths, all at 11.5°, 0.4 ms scatter), fitted with the analyser's T² against L fit with and without its amplitude correction. Not the paper's data.</figcaption></figure>
<!-- /fig:fit -->

**Step 4: the damped run.** For the 31.2 cm pendulum, the small-angle period is 1.1221 s. At 6.3° the exact period is 0.85 ms longer; after 150 s at the paper's damping rate the swing has shrunk to 3.0° and the extra is only 0.19 ms. So the period drifts by well under a millisecond during the whole run, and treating it as constant, as the paper does, is fine.

## How we made the graphs

The charts and every number come from `scripts/blog-figures/webcam-pendulum-tracker-period-gravity-amplitude-correction.mjs` in fibub's public code. It calls `smallPeriod`, `largeFactor` (the exact elliptic-integral factor) and `fitG` (the least-squares fit of T² against L, with each period first corrected for its amplitude) from `src/lib/sci/phpendulum.ts`, the maths behind the [[pendulum-analyser]].

The length, period, local g, damping rate and amplitudes of the damped run come from the paper's text. The amplitude of 11.5° is our result, not a value the paper reports. The nine-length series and its timing scatter are **our assumptions** and are simulated.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/pendulum-analyser.mjs`, which pins the analyser against SciPy and SymPy:

- The elliptic integral K(sin 45°) must equal 1.854075, and the large-angle factor must match SciPy's `ellipk` from 5° to 170° (1.017409 at 30°, 1.180341 at 90°).
- The series 1 + θ²/16 + 11θ⁴/3072 must agree with the exact factor to 1 part in 10⁷ at 10°.
- On a made-up six-length data set swung at 15°, the fit must give g = 9.82503 ± 0.01683 m/s² (NumPy least squares), and 9.741 without the amplitude correction.
- New with this article: a 45.8 cm pendulum swung at 11.5° with g = 9.7821671 m/s² must take 1.36298 s, a factor of 1.0025237 over the small-angle period.

## Check it yourself

On the [[pendulum-analyser]]:

1. In the *Large-angle correction* card, type **0.458** in *Length (m)*, **11.5** in *Amplitude (°)* and **9.7821671** in *g (m/s²)*.
2. It shows *Small-angle period* **1.3595 s** and *Exact period* **1.3630 s**, the paper's measured value, with the small-angle formula **0.252 %** short.
3. In the *Your measurements* card, clear the box and paste our simulated lengths and periods, one pair per line: **0.20, 0.9004**; **0.25, 1.0067**; **0.30, 1.1033**; **0.35, 1.1917**; **0.40, 1.2740**; **0.45, 1.3515**; **0.50, 1.4242**; **0.55, 1.4937**; **0.60, 1.5599**.
4. Leave *Length unit* on **metres** and *Each time is for this many full swings* on **1**, set *Expected g to compare with* to **9.782**, and type **11.5** in *Amplitude for rows without one (°)*.
5. The result reads **g = 9.7808 ± 0.0011 m/s²**, and *Amplitude correction* says g would be **9.7316** without it. Set the amplitude back to **0** and watch g drop by half a percent.

## What researchers can use it for

- **Explain a small, stubborn offset** in a period or g measurement: solve for the amplitude that would cause it and ask whether that swing was plausible, with the [[pendulum-analyser]].
- **Set an amplitude limit** for a target accuracy: the *Large-angle correction* table shows how far the small-angle formula is off at each swing.
- **Fit g with an unknown length offset**, such as the distance from the clamp to the bob's centre, using the analyser's *T² = 4π²(L + δ)/g* option.
- **Get periods from your own video** by tracking the bob with the [[video-motion-tracker]], then paste them into the analyser.
- **Teach error budgets**: compare the effect of a 1 mm length error with a 0.4 ms timing error, then combine them with the [[uncertainty-calculator]].

## The fine print

- The paper does not report the amplitude of its period run. Our 11.5° is the swing that would explain the gap on its own; a length error, the bob's size or the string's stretch could share the blame.
- The exact formula is for a point mass on a light, rigid string. A real bob of finite size is a physical pendulum and swings a little slower again.
- The paper is published in *Physics Education*; we worked from the author version on arXiv, which carries the CC BY licence.
- Our nine-length series is simulated. The paper's own length series is shown only in its figure.
