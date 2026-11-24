---
title: "Lesion expansion coefficients, and why colour beats grey for disease severity"
summary: "A 2025 study multiplies automatically segmented rust lesions by 2.74 to get wheat severity right. We draw leaves of known severity, measure them with fibub's Leaf disease severity tool, and show where that coefficient comes from."
tools: [leaf-disease-severity, disease-progress-audpc, leaf-area-analyser]
updated: 2026-11-24
sources:
  - "Qin, F., Wang, H., Jiang, Q. and Wang, H. (2025), A novel method based on lesion expansion to assess plant disease severity, Frontiers in Plant Science 16: 1510663, doi:10.3389/fpls.2025.1510663. Licence CC BY 4.0, taken from the Crossref record and the journal page, checked 2026-11-24. Values used here: 400 images of single wheat leaves with stripe rust, 50 in each of the eight severity classes of China's GB/T 15795-2011 scale (1, 5, 10, 20, 40, 60, 80, 100 %); leaf and lesion outlines drawn by hand in Photoshop 2022, and automatic lesion segmentation in MATLAB by rgb2gray, Otsu binarisation and connected components; lesion expansion coefficients Grate 2.74 for all classes, minrate 1.28 to 3.31 and meanrate 3.31 to 4.21 by class; severity-class accuracy 89.91 to 93.34 % with no coefficient and 92.57 to 96.16 % with Grate 2.74; the best combination being Grate 2.74 with the third expansion method at 96.16 %."
  - "Otsu's automatic threshold: Otsu, N. (1979), IEEE Transactions on Systems, Man, and Cybernetics 9: 62-66 (method only)."
paper:
  title: "A novel method based on lesion expansion to assess plant disease severity"
  authors: "Qin F, Wang H, Jiang Q, Wang H"
  journal: "Frontiers in Plant Science"
  year: 2025
  doi: "10.3389/fpls.2025.1510663"
  url: "https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2025.1510663/full"
  licence: "CC BY 4.0"
  reviewed: true
---

Disease severity is the share of a leaf's area that is diseased, and it decides how a variety is rated, when a field is sprayed and whether a fungicide trial worked. Measuring it from a photo sounds easy and is not: an automatic threshold finds the obvious part of each lesion and misses the faded tissue around it. A 2025 paper in *Frontiers in Plant Science* takes that miss seriously. On 400 photographs of wheat leaves with stripe rust, the authors compare hand-drawn lesions with automatically segmented ones, measure how much bigger the real lesion is, and then **multiply the machine's lesions by a single coefficient of 2.74** before working out severity, lifting class accuracy to 96.16 %. This article draws leaves whose severity we know exactly, measures them with the maths behind fibub's [[leaf-disease-severity]] tool, and shows where a coefficient like 2.74 comes from — and when you do not need one. Afterwards, turn severities over time into one number with [[disease-progress-audpc]], or measure the leaf itself with the [[leaf-area-analyser]].

## The paper in brief

The authors photographed single wheat leaves on white paper with three cameras, 50 leaves in each of the eight severity classes of China's national scale (1, 5, 10, 20, 40, 60, 80 and 100 %). They outlined every leaf and every lesion by hand in Photoshop, then segmented lesions automatically: grey the image, split it with Otsu's threshold, keep the connected groups.

Comparing the two gave **expansion coefficients**: one global value, 2.74, and two class-wise sets (1.28 to 3.31, and 3.31 to 4.21). Applied through three slightly different expansion methods, the global 2.74 did best, raising severity-class accuracy from 89.91–93.34 % to **92.57–96.16 %**. The paper's claim is modest and practical: automatic segmentation systematically under-reads lesions, and one empirical multiplier fixes most of it.

## Checked with the tools

fibub's tool works differently. It finds the leaf against the background with Otsu's threshold, then sorts every pixel **inside** the leaf by **colour**: a pixel is healthy if its hue lies between 65° and 170° with at least 15 % colour strength, and anything else — yellow, brown, black, grey — is lesion. No coefficient, because the faded tissue is yellow, and yellow is not green.

To compare the two ideas we **drew** 140 leaves, 28 in each of five classes (1, 5, 10, 20 and 40 %). Each leaf is a green ellipse carrying pustules: a dark reddish-brown core inside a pale yellow halo four pixels wide. Both count as diseased, and we know their exact pixel count. We then measured each leaf twice, using the same library both times: once with the tool's colour rule, and once with the paper's automatic step (grey the picture, Otsu inside the leaf, take the minority side as lesion).

| Severity drawn | Colour rule (tool) | Grey + Otsu | True ÷ grey |
|---|---|---|---|
| 1.81 % | 1.81 % | 0.98 % | 1.86 |
| 6.04 % | 6.04 % | 3.16 % | 1.92 |
| 10.96 % | 10.96 % | 5.48 % | 2.01 |
| 20.91 % | 20.91 % | 10.75 % | 1.95 |
| 40.64 % | 40.64 % | 21.15 % | 1.93 |

The colour rule is **exact**: over all 140 leaves the largest difference between measured and drawn severity is 0.00 percentage points, and the leaf mask itself matches the drawn leaf pixel for pixel. The grey rule finds about half the diseased area, because the chlorotic halo is *brighter* than healthy green while the pustule core is darker, and one threshold can only ever catch one side of the healthy tissue. In our leaves the halo is 49.9 % of the diseased area, so the expansion coefficient needed is **1.93 on average, and 1.86 to 2.01 by class**.

<!-- fig:rules -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 288" role="img" aria-label="On 140 drawn leaves (five classes, bars showing the spread) the tool's hue rule follows the drawn severity to within 0.00 percentage points, while a grey Otsu threshold sees only the dark pustule cores and reads far too low." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Two lesion rules on the same drawn leaves</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Two lesion rules on the same drawn leaves</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--line)"/><text x="52" y="246" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="202" y2="202" style="stroke:var(--line)"/><text x="52" y="206" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="162" y2="162" style="stroke:var(--line)"/><text x="52" y="166" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="122" y2="122" style="stroke:var(--line)"/><text x="52" y="126" text-anchor="end" style="fill:var(--muted)">30</text><line x1="58" x2="546" y1="82" y2="82" style="stroke:var(--line)"/><text x="52" y="86" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="58" y1="242" y2="246" style="stroke:var(--muted)"/><text x="58" y="259" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="159.7" x2="159.7" y1="242" y2="246" style="stroke:var(--muted)"/><text x="159.7" y="259" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="261.3" x2="261.3" y1="242" y2="246" style="stroke:var(--muted)"/><text x="261.3" y="259" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="363" x2="363" y1="242" y2="246" style="stroke:var(--muted)"/><text x="363" y="259" text-anchor="middle" style="fill:var(--muted)">30</text><line x1="464.7" x2="464.7" y1="242" y2="246" style="stroke:var(--muted)"/><text x="464.7" y="259" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--muted)"/><text x="302" y="280" text-anchor="middle" style="fill:var(--ink)">Severity drawn (% of leaf area)</text><text transform="translate(14 146) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Severity measured (%)</text><circle cx="76.4" cy="234.8" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="119.4" cy="217.8" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="169.4" cy="198.2" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="270.6" cy="158.4" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="471.2" cy="79.4" r="4" style="fill:var(--c-blog);opacity:1"/><line x1="76.4" x2="76.4" y1="238.2" y2="231.3" style="stroke:var(--c-blog)"/><line x1="119.4" x2="119.4" y1="222.9" y2="212.8" style="stroke:var(--c-blog)"/><line x1="169.4" x2="169.4" y1="203.4" y2="193" style="stroke:var(--c-blog)"/><line x1="270.6" x2="270.6" y1="162.8" y2="153.9" style="stroke:var(--c-blog)"/><line x1="471.2" x2="471.2" y1="82.5" y2="76.4" style="stroke:var(--c-blog)"/><circle cx="76.4" cy="238.1" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="119.4" cy="229.4" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="169.4" cy="220.1" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="270.6" cy="199" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="471.2" cy="157.4" r="4" style="fill:var(--c-tools);opacity:1"/><line x1="76.4" x2="76.4" y1="239.8" y2="236.4" style="stroke:var(--c-tools)"/><line x1="119.4" x2="119.4" y1="231.6" y2="227.2" style="stroke:var(--c-tools)"/><line x1="169.4" x2="169.4" y1="225.2" y2="215" style="stroke:var(--c-tools)"/><line x1="270.6" x2="270.6" y1="203.9" y2="194.1" style="stroke:var(--c-tools)"/><line x1="471.2" x2="471.2" y1="165.8" y2="149" style="stroke:var(--c-tools)"/><path d="M58 242L546 50" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round;stroke-dasharray:4 4"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Colour rule (the tool)</text><circle cx="247.4" cy="36" r="4" style="fill:var(--c-tools)"/><text x="258.4" y="40" style="fill:var(--muted)">Grey + Otsu, minority side</text><text class="fibub-mark" x="546" y="280" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. 140 drawn rust leaves (20 in each of seven severity classes), measured two ways with the same library: the tool’s hue-and-saturation rule, and a grey picture with Otsu’s threshold inside the leaf. The dashed line is perfect agreement. Drawn leaves, not the paper’s photographs.</figcaption></figure>
<!-- /fig:rules -->

**That is where 2.74 comes from.** It is not a property of rust; it is the inverse of the fraction of each lesion that happens to pass a grey threshold, which depends on the lesion's colours, its halo and the camera. The paper's own class-wise coefficients wander between 1.28 and 3.31, and ours between 1.86 and 2.01, for exactly the same reason. A coefficient fitted on one image set should not be carried to another.

<!-- fig:coef -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 288" role="img" aria-label="The ratio of true to grey-threshold lesion area against severity class, for our drawn leaves and for the paper's own class-wise coefficients. Both move with the class, so a single number is a compromise." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Why one expansion coefficient cannot fit every class</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Why one expansion coefficient cannot fit every class</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--line)"/><text x="52" y="246" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="188.7" y2="188.7" style="stroke:var(--line)"/><text x="52" y="192.7" text-anchor="end" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="135.3" y2="135.3" style="stroke:var(--line)"/><text x="52" y="139.3" text-anchor="end" style="fill:var(--muted)">3</text><line x1="58" x2="546" y1="82" y2="82" style="stroke:var(--line)"/><text x="52" y="86" text-anchor="end" style="fill:var(--muted)">4</text><line x1="58" x2="58" y1="242" y2="246" style="stroke:var(--muted)"/><text x="58" y="259" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="166.4" x2="166.4" y1="242" y2="246" style="stroke:var(--muted)"/><text x="166.4" y="259" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="274.9" x2="274.9" y1="242" y2="246" style="stroke:var(--muted)"/><text x="274.9" y="259" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="383.3" x2="383.3" y1="242" y2="246" style="stroke:var(--muted)"/><text x="383.3" y="259" text-anchor="middle" style="fill:var(--muted)">30</text><line x1="491.8" x2="491.8" y1="242" y2="246" style="stroke:var(--muted)"/><text x="491.8" y="259" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--muted)"/><text x="302" y="280" text-anchor="middle" style="fill:var(--ink)">Severity class drawn (%)</text><text transform="translate(14 146) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">True ÷ grey-threshold lesion area</text><line x1="58" x2="546" y1="149.2" y2="149.2" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="144.2" text-anchor="end" style="fill:var(--muted)">paper’s single coefficient 2.74</text><line x1="58" x2="546" y1="192.4" y2="192.4" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="187.4" text-anchor="end" style="fill:var(--muted)">ours, 1.93</text><circle cx="68.8" cy="196.1" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="112.2" cy="192.9" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="166.4" cy="188.1" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="274.9" cy="191.3" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="491.8" cy="192.4" r="4" style="fill:var(--c-blog);opacity:1"/><line x1="68.8" x2="68.8" y1="222.8" y2="169.5" style="stroke:var(--c-blog)"/><line x1="112.2" x2="112.2" y1="210.5" y2="175.3" style="stroke:var(--c-blog)"/><line x1="166.4" x2="166.4" y1="201.5" y2="174.8" style="stroke:var(--c-blog)"/><line x1="274.9" x2="274.9" y1="205.2" y2="177.5" style="stroke:var(--c-blog)"/><line x1="491.8" x2="491.8" y1="202.5" y2="182.3" style="stroke:var(--c-blog)"/><circle cx="68.8" cy="227.1" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="112.2" cy="132.7" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="166.4" cy="133.2" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="274.9" cy="126.3" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="491.8" cy="141.7" r="4" style="fill:var(--c-tools);opacity:1"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Our drawn leaves</text><circle cx="204.2" cy="36" r="4" style="fill:var(--c-tools)"/><text x="215.2" y="40" style="fill:var(--muted)">Paper’s class-wise coefficients</text><text class="fibub-mark" x="546" y="280" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. How much a grey threshold has to be expanded to recover the whole diseased area, by severity class: ours from drawn leaves, beside the paper’s own class-wise coefficients. The two sets are not comparable in value, only in shape.</figcaption></figure>
<!-- /fig:coef -->

**A caution about accuracy as a score.** Scoring severity by which class it lands in, as the paper does, is forgiving, because the classes are wide. On our leaves, using the paper's own eight-class scale:

| Method | Severity-class accuracy |
|---|---|
| Colour rule (tool) | 100 % |
| Grey + Otsu, no coefficient | 8.6 % |
| Grey + Otsu × our fitted 1.93 | 86.4 % |
| Grey + Otsu × the paper's 2.74 | 97.1 % |

A coefficient 42 % too large for our leaves still scores *better* on class accuracy than the right one, because over-expansion pushes borderline leaves up into the class the wide bins happen to want. Class accuracy therefore cannot tell a well-fitted coefficient from a roughly-fitted one. If you publish a severity method, report the error in **percentage points of severity** as well.

## How we made the graphs

Both charts and every number come from `scripts/blog-figures/wheat-stripe-rust-lesion-expansion-severity.mjs` in fibub's public code. It calls `severity`, `severityClass`, `parseScale`, `luminance`, `histogram`, `otsu`, `threshold`, `countOnes`, `minChannel` and `noise` from `src/lib/sci/plantimg.ts`, the maths behind the [[leaf-disease-severity]] tool. The grey comparison rule is built from the same functions, so the two measurements differ only in the rule, not in the code quality.

From the paper: the eight severity classes, the automatic segmentation recipe, the coefficients 2.74 / 1.28–3.31 / 3.31–4.21 and the accuracy figures. **Our assumptions**: the leaves themselves (ellipse 340 × 120 px), the pustule colours, the four-pixel halo, 28 leaves per class, ± 5 grey levels of noise, and reading the minority side of the grey threshold as lesion. The leaves are **drawn, not photographed**, and no number in our tables is the paper's measurement.

## How we test the maths

`tests/sci.mjs` runs `tests/sci-tools/leaf-disease-severity.mjs` on every change to fibub:

- The example leaf is drawn with 150,781 leaf pixels and 10,246 lesion pixels, and the tool must read exactly those, giving 6.795 % severity.
- On a noisy light-background leaf the automatic leaf threshold must be 80 with 150,781 leaf pixels and 10,437 lesion pixels, against NumPy's 10,439 (two pixels sit on the hue boundary).
- The dark-background rule with a typed threshold must match NumPy exactly: 273,816 leaf pixels, 163,131 lesion pixels, 9 spots.
- Severity classes: 0 % → class 0, 4.9 → 1, 5 → 1, 6.8 → 2, 50.1 → 5, 100 → 5 on the scale 0, 5, 10, 25, 50, 100, and bad scales are refused.
- New with this article: drawn leaves at five severities must come back to within 0.01 percentage points by the colour rule, while the grey-threshold rule must need an expansion coefficient between 1.7 and 2.3, leaf by leaf, to agree.

## Check it yourself

On the [[leaf-disease-severity]] page, with no photo of your own:

1. Press **Use the example**. It draws a leaf with six brown lesions on pale paper.
2. Keep the *Colour rules* at their defaults: *Background* **Light**, *Leaf threshold* empty, *Healthy colour from hue* **65** to **170**, *colour strength at least* **15 %**, *Smallest spot counted* **20 px**.
3. It reads **Severity: 6.8 % of the leaf, class 2 (over 5 up to 10 %)**, with *Leaf* **150,781 px** at leaf threshold **55 (Otsu)**, *Lesion* **10,246 px** and *Spots* **6**. Those are exactly the pixels the page drew.
4. Set *Severity scale* to **1, 5, 10, 20, 40, 60, 80, 100**, the paper's national scale. The class table grows to eight rows and this leaf still sits in **class 2 (over 5 up to 10 %)** — the severity never changes, only the bin it is reported in, which is why two papers using different scales cannot be compared class for class.
5. Now break it on purpose: set *Healthy colour from hue* to **20**. The yellow-brown lesions now fall inside the healthy window, so severity collapses to **0.1 %** with **0 spots**. That hue window, not an expansion coefficient, is what decides a colour-based severity, so write yours into your methods.

## What researchers can use it for

- **Measure severity from a phone photo** in the browser, leaf by leaf, with the hue window and threshold written into the result so a reader can repeat it.
- **Calibrate any automatic method** against leaves of known severity — drawn, or printed and re-photographed — before trusting a coefficient from a paper.
- **Report percentage points, not just class accuracy**, as the table above shows why.
- **Keep a severity list** across a trial and hand it to [[disease-progress-audpc]] for the area under the disease progress curve.
- **Separate leaf area from severity**: the [[leaf-area-analyser]] measures the leaf, which matters when disease curls or shrinks it.

## The fine print

- Our leaves are **drawn**, so they test the measuring rules and the geometry, not wheat, rust or any camera.
- Our grey rule is our own faithful reconstruction of the paper's automatic step. The paper used MATLAB's `rgb2gray`, Otsu and connected components; small differences in the rule change the coefficient, which is the article's point.
- We used the five classes from 1 to 40 %. Above that the disease is no longer the minority of the leaf, and a single grey threshold has nothing meaningful to find.
- Our coefficient (1.93) and the paper's (2.74) are not comparable in value, only in behaviour: both are the inverse of how much of a lesion a grey threshold happens to catch.
- Real leaves bring shadows, specular highlights, curled edges and senescent tissue that is yellow but not diseased. Any colour rule needs checking against a human rating on the crop in front of you.
