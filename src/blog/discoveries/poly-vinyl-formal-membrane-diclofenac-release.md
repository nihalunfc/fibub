---
title: "Poly(vinyl formal) membranes for diclofenac release: reading the Peppas exponent"
summary: "Crosslinked poly(vinyl formal) membranes release the painkiller diclofenac at a nearly steady rate, with Peppas exponents just above 1. We check what those exponents can and cannot tell, with fibub's drug release fitter."
tools: [drug-release-fitter]
updated: 2026-11-16
sources:
  - "Garcia-Atutxa, I. and Villanueva-Flores, F. (2026), Designing Poly(vinyl formal) Membranes for Controlled Diclofenac Delivery: Integrating Classical Kinetics with GRNN Modeling, Applied Sciences 16(2), 562, doi:10.3390/app16020562. Licence CC BY, checked on the journal page, 2026-11-16. Values used here: Korsmeyer–Peppas exponents n = 1.029 ± 0.050 (30 % HCl) and 1.148 ± 0.094 (40 % HCl); release into 50 mM phosphate buffer, pH 7.0, 25 °C; cylindrical plugs about 3.16 mm thick, 0.10 cm³, releasing from the top face only (0.3165 cm²); nominal loading 1.0 mg/cm² (0.317 mg per membrane)."
  - "Release exponent limits for slabs, cylinders and spheres: Ritger, P. L. and Peppas, N. A. (1987), A simple equation for description of solute release I, Journal of Controlled Release 5, 23-36."
paper:
  title: "Designing Poly(vinyl formal) Membranes for Controlled Diclofenac Delivery: Integrating Classical Kinetics with GRNN Modeling"
  authors: "Garcia-Atutxa, I.; Villanueva-Flores, F."
  journal: "Applied Sciences"
  year: 2026
  doi: "10.3390/app16020562"
  url: "https://www.mdpi.com/2076-3417/16/2/562"
  licence: "CC BY"
  reviewed: true
---

**Controlled release** means letting a drug out of a material slowly and steadily rather than all at once. A 2026 study in *Applied Sciences* makes membranes of **poly(vinyl formal)**, polyvinyl alcohol crosslinked with formaldehyde under acid, loads them with the painkiller **diclofenac**, and tunes the release through the amount of acid used. It fits the release curves with the classic models and with a small neural network. This article shows how the [[drug-release-fitter|drug release curve fitter]] lets a researcher fit the same models, and what the **Korsmeyer–Peppas exponent** n can and cannot say about how the drug gets out.

## The paper in brief

Polyvinyl alcohol was crosslinked with formaldehyde at different hydrochloric acid levels to make spongy membranes. Disc-shaped plugs were loaded with diclofenac and sealed so that the drug could leave only through the top face, into a phosphate buffer at pH 7 and 25 °C. The authors fitted zero-order, first-order, Higuchi and Korsmeyer–Peppas models, all with R² above 0.94, and a neural network (a general regression neural network) to predict release from the making conditions. The Peppas exponent was **1.029 ± 0.050** for membranes made with 30 % acid and **1.148 ± 0.094** for 40 % acid.

In the Korsmeyer–Peppas model, F = k·tⁿ, the fraction released grows as a power of time. For a thin slab, n = 0.5 means simple diffusion (Fickian), n = 1 means a constant rate set by the polymer slowly relaxing or swelling (Case II, close to zero order), anything between is "anomalous", and above 1 is "super case II". For cylinders and spheres the limits are lower (0.45 and 0.89 for a cylinder).

## Checked with the tools

**Step 1: the dose and the shape.** A loading of 1.0 mg/cm² over the 0.3165 cm² face gives **0.3165 mg** per membrane, matching the stated 0.317 mg. A volume of 0.10 cm³ over that face means a thickness of **3.16 mm**, and the surface-to-volume ratio is **3.17 per cm**: both agree with the paper. Because the drug leaves through one flat face only, release is one-dimensional, so the **slab (thin film)** limits apply, not the cylinder ones, even though the plugs are cylinders.

**Step 2: what do the exponents mean?** With the slab limits, the drug release fitter labels n = 1.029 and n = 1.148 both as **super case II**, as it would with the cylinder limits. The paper calls the first "anomalous". The tool's answer is set by the point value alone; the next step shows why both readings are uncertain.

**Step 3: how sure is n?** If the stated ± is a standard error from about ten points, the 95 % range of n is **0.91 to 1.14** for the 30 % membrane and **0.93 to 1.36** for the 40 % membrane (Figure 1). Both ranges include **n = 1**, the zero-order (Case II) value, and the first reaches into the anomalous range. So the data are consistent with a **near-constant release rate** for both membranes; whether it is slightly anomalous or slightly super case II cannot be told apart. The drug release fitter now says this in its notes: when the 95 % range of n crosses a limit, it lists the other mechanisms the range allows.

<!-- fig:n -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 250" role="img" aria-label="Both exponents sit just above 1, and their 95 % ranges include the Case II value of 1 for a slab." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Peppas exponent n with its 95 % range, against the limits for a slab</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Peppas exponent n with its 95 % range, against the limits for a slab</text><line x1="58" x2="546" y1="187.6" y2="187.6" style="stroke:var(--line)"/><text x="52" y="191.6" text-anchor="end" style="fill:var(--muted)">0.5</text><line x1="58" x2="546" y1="146.7" y2="146.7" style="stroke:var(--line)"/><text x="52" y="150.7" text-anchor="end" style="fill:var(--muted)">0.75</text><line x1="58" x2="546" y1="105.7" y2="105.7" style="stroke:var(--line)"/><text x="52" y="109.7" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="64.8" y2="64.8" style="stroke:var(--line)"/><text x="52" y="68.8" text-anchor="end" style="fill:var(--muted)">1.25</text><line x1="180" x2="180" y1="204" y2="208" style="stroke:var(--muted)"/><text x="180" y="221" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="424" x2="424" y1="204" y2="208" style="stroke:var(--muted)"/><text x="424" y="221" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="204" y2="204" style="stroke:var(--muted)"/><text x="302" y="242" text-anchor="middle" style="fill:var(--ink)">Membrane (1: 30 % HCl, 2: 40 % HCl)</text><text transform="translate(14 118) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Release exponent n</text><line x1="58" x2="546" y1="187.6" y2="187.6" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="182.6" text-anchor="end" style="fill:var(--muted)">Fickian (slab)</text><line x1="58" x2="546" y1="105.7" y2="105.7" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="100.7" text-anchor="end" style="fill:var(--muted)">Case II (slab)</text><line x1="58" x2="546" y1="123.7" y2="123.7" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="118.7" text-anchor="end" style="fill:var(--muted)">Case II (cylinder)</text><circle cx="180" cy="101" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="424" cy="81.5" r="4" style="fill:var(--c-blog);opacity:1"/><line x1="180" x2="180" y1="119.8" y2="82.1" style="stroke:var(--c-blog)"/><line x1="424" x2="424" y1="117" y2="45.9" style="stroke:var(--c-blog)"/></svg><figcaption>Figure 1. The paper's exponents with 95 % ranges worked out by the Drug release curve fitter's new range check (taking the stated ± as a standard error on 8 degrees of freedom, our assumption), against the Ritger–Peppas limits.</figcaption></figure>
<!-- /fig:n -->

**Step 4: fitting a simulated run.** The paper's release curves are in a figure we cannot reuse, so we **simulated** two curves with the paper's exponents, each reaching 60 % at 24 hours (our assumed time scale), with scatter sized so that n comes out about ±0.05 (Figure 2). For the 30 % membrane, the fitter gives n = **1.007 ± 0.046**, R² 0.991 for both the zero-order and Peppas models, and picks **zero order** as best by AIC (the Akaike information criterion, which rewards a good fit and penalises extra parameters): with n so close to 1, the extra parameter does not earn its place. Its note reads *Super case II transport*, then that n's 95 % range, **0.91 to 1.11**, also allows **anomalous** and **Case II** transport. For the 40 % membrane, n = **1.12 ± 0.05**, and the Higuchi square-root model fits worst (R² 0.78), as expected for release that speeds up rather than slows.

<!-- fig:rel -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 268" role="img" aria-label="Two simulated release curves that both reach 60 % at 24 hours; the one with the larger exponent starts slower and curves upward more." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Simulated diclofenac release from the two membranes</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Simulated diclofenac release from the two membranes</text><line x1="58" x2="546" y1="222" y2="222" style="stroke:var(--line)"/><text x="52" y="226" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="169.1" y2="169.1" style="stroke:var(--line)"/><text x="52" y="173.1" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="116.2" y2="116.2" style="stroke:var(--line)"/><text x="52" y="120.2" text-anchor="end" style="fill:var(--muted)">40</text><line x1="58" x2="546" y1="63.2" y2="63.2" style="stroke:var(--line)"/><text x="52" y="67.2" text-anchor="end" style="fill:var(--muted)">60</text><line x1="58" x2="58" y1="222" y2="226" style="stroke:var(--muted)"/><text x="58" y="239" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="159.7" x2="159.7" y1="222" y2="226" style="stroke:var(--muted)"/><text x="159.7" y="239" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="261.3" x2="261.3" y1="222" y2="226" style="stroke:var(--muted)"/><text x="261.3" y="239" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="363" x2="363" y1="222" y2="226" style="stroke:var(--muted)"/><text x="363" y="239" text-anchor="middle" style="fill:var(--muted)">15</text><line x1="464.7" x2="464.7" y1="222" y2="226" style="stroke:var(--muted)"/><text x="464.7" y="239" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="222" y2="222" style="stroke:var(--muted)"/><text x="302" y="260" text-anchor="middle" style="fill:var(--ink)">Time (h)</text><text transform="translate(14 136) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Released (%)</text><circle cx="68.2" cy="218.8" r="3.2" style="fill:var(--c-blog);opacity:1"/><circle cx="78.3" cy="216.7" r="3.2" style="fill:var(--c-blog);opacity:1"/><circle cx="98.7" cy="208.9" r="3.2" style="fill:var(--c-blog);opacity:1"/><circle cx="119" cy="201.2" r="3.2" style="fill:var(--c-blog);opacity:1"/><circle cx="139.3" cy="198.9" r="3.2" style="fill:var(--c-blog);opacity:1"/><circle cx="180" cy="185.1" r="3.2" style="fill:var(--c-blog);opacity:1"/><circle cx="220.7" cy="166.2" r="3.2" style="fill:var(--c-blog);opacity:1"/><circle cx="261.3" cy="164.2" r="3.2" style="fill:var(--c-blog);opacity:1"/><circle cx="302" cy="140.5" r="3.2" style="fill:var(--c-blog);opacity:1"/><circle cx="383.3" cy="119.1" r="3.2" style="fill:var(--c-blog);opacity:1"/><circle cx="464.7" cy="80.9" r="3.2" style="fill:var(--c-blog);opacity:1"/><circle cx="546" cy="72.1" r="3.2" style="fill:var(--c-blog);opacity:1"/><circle cx="68.2" cy="220" r="3.2" style="fill:var(--c-tools);opacity:1"/><circle cx="78.3" cy="218.4" r="3.2" style="fill:var(--c-tools);opacity:1"/><circle cx="98.7" cy="212.3" r="3.2" style="fill:var(--c-tools);opacity:1"/><circle cx="119" cy="205.8" r="3.2" style="fill:var(--c-tools);opacity:1"/><circle cx="139.3" cy="203.3" r="3.2" style="fill:var(--c-tools);opacity:1"/><circle cx="180" cy="190.7" r="3.2" style="fill:var(--c-tools);opacity:1"/><circle cx="220.7" cy="173.1" r="3.2" style="fill:var(--c-tools);opacity:1"/><circle cx="261.3" cy="169.9" r="3.2" style="fill:var(--c-tools);opacity:1"/><circle cx="302" cy="146.9" r="3.2" style="fill:var(--c-tools);opacity:1"/><circle cx="383.3" cy="123.9" r="3.2" style="fill:var(--c-tools);opacity:1"/><circle cx="464.7" cy="84" r="3.2" style="fill:var(--c-tools);opacity:1"/><circle cx="546" cy="72.1" r="3.2" style="fill:var(--c-tools);opacity:1"/><path d="M58 222L68.2 218.8L78.3 215.6L88.5 212.4L98.7 209.1L108.8 205.9L119 202.7L129.2 199.4L139.3 196.2L149.5 192.9L159.7 189.7L169.8 186.4L180 183.1L190.2 179.9L200.3 176.6L210.5 173.3L220.7 170.1L230.8 166.8L241 163.5L251.2 160.3L261.3 157L271.5 153.7L281.7 150.4L291.8 147.2L302 143.9L312.2 140.6L322.3 137.3L332.5 134.1L342.7 130.8L352.8 127.5L363 124.3L373.2 121L383.3 117.7L393.5 114.4L403.7 111.1L413.8 107.8L424 104.5L434.2 101.3L444.3 98L454.5 94.7L464.7 91.4L474.8 88.1L485 84.8L495.2 81.5L505.3 78.2L515.5 75L525.7 71.7L535.8 68.4L546 65.1" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 222L68.2 220L78.3 217.6L88.5 215L98.7 212.3L108.8 209.6L119 206.8L129.2 203.9L139.3 201L149.5 198L159.7 195L169.8 191.9L180 188.8L190.2 185.7L200.3 182.6L210.5 179.4L220.7 176.2L230.8 173L241 169.8L251.2 166.5L261.3 163.3L271.5 159.9L281.7 156.6L291.8 153.3L302 149.9L312.2 146.6L322.3 143.2L332.5 139.8L342.7 136.4L352.8 132.9L363 129.5L373.2 126L383.3 122.6L393.5 119.1L403.7 115.5L413.8 112.1L424 108.5L434.2 105L444.3 101.4L454.5 97.9L464.7 94.3L474.8 90.7L485 87.1L495.2 83.5L505.3 79.9L515.5 76.3L525.7 72.7L535.8 69L546 65.4" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">30 % HCl (n = 1.029)</text><circle cx="233" cy="36" r="4" style="fill:var(--c-tools)"/><text x="244" y="40" style="fill:var(--muted)">40 % HCl (n = 1.148)</text></svg><figcaption>Figure 2. Release curves simulated with the paper's two Korsmeyer–Peppas exponents and our assumed time scale (60 % at 24 hours), with the Drug release curve fitter's fits. Not the paper's data.</figcaption></figure>
<!-- /fig:rel -->

| Check | Paper | Tool result |
|---|---|---|
| Drug per membrane | 0.317 mg | 1.0 mg/cm² × 0.3165 cm² = 0.3165 mg |
| Thickness from volume and face | about 3.16 mm | 3.16 mm |
| Limits to use | (cylindrical plugs) | slab: release through one face |
| n = 1.029, slab limits | anomalous | super case II by point value; 95 % range 0.91 to 1.14 allows Case II and anomalous |
| n = 1.148, slab limits | super case II | super case II; 95 % range 0.93 to 1.36 includes 1 |
| Simulated 30 % run | (n = 1.029) | n = 1.007 ± 0.046, zero order best by AIC |

## How we made the graphs

Everything above comes from `scripts/blog-figures/poly-vinyl-formal-membrane-diclofenac-release.mjs` in fibub's public code. It calls `fitAll`, `peppasMechanism` and the new `peppasRange` from `src/lib/sci/drugrelease.ts`, the maths behind the [[drug-release-fitter|drug release curve fitter]].

Where the inputs come from: the exponents, their ± values, the membrane size, face area and loading are from the paper; the Ritger–Peppas limits are from Ritger and Peppas (1987). Treating the ± as a standard error on 8 degrees of freedom, the 24-hour time scale and the scatter are **our assumptions**. Figure 2 is a **simulation**, not the paper's measurements.

## How we test the maths

On every change to fibub, `tests/sci-tools/drug-release-fitter.mjs` checks the fitter:

- Every model's parameters, standard errors, R² and AIC on a made-up example must agree with SciPy's `curve_fit` to about one part in a million.
- Noise-free curves must be recovered exactly, for example a Peppas curve 9·t^0.7 must give back k = 9 and n = 0.7.
- The mechanism labels must follow Ritger and Peppas: n = 0.45 is Fickian for a cylinder, n = 0.5 for a film, n = 0.95 is super case II for a sphere.
- **New with this article:** n = 1.029 ± 0.050 on 8 degrees of freedom must give a 95 % range of 0.914 to 1.144 (t = 2.306), flagged as also allowing Case II and anomalous transport for a film, and a tight n far from any limit must add nothing.

## Check it yourself

On the [[drug-release-fitter|drug release curve fitter]]:

1. Paste these simulated points (time in hours, percent released) into *Time and cumulative release*:

```
0.5	1.22
1	2.01
2	4.95
3	7.85
4	8.73
6	13.95
8	21.08
10	21.84
12	30.81
16	38.9
20	53.32
24	56.64
```

2. Set *Release given as* to **Percent (0 to 100)**, *Shape (for the Peppas n)* to **Thin film or slab** and *Fit Korsmeyer-Peppas up to (%)* to **60**.
3. Under *Model fits*, the Korsmeyer-Peppas row gives n about **1.007 ± 0.046**, and its note says the 95 % range, **0.91 to 1.11**, also allows **Anomalous** and **Case II transport**. Zero order is marked best.
4. Change *Shape* to **Cylinder (tablet)**: the label stays super case II, because n is above both shapes' Case II limits.

## What researchers can use it for

- **Fit all the usual release models at once** in the [[drug-release-fitter|drug release curve fitter]], on the untransformed data, and let AIC pick the simplest model the data support.
- **Read n with its uncertainty**: the fitter now flags when the 95 % range crosses a mechanism boundary, so a label is not over-read.
- **Pick the right shape**: a plug sealed on all but one face releases like a slab, whatever its outline.
- **Check a methods section**: dose per membrane, thickness and surface-to-volume ratio should follow from each other.
- **Teach** why n = 0.5 and n = 1 mean different physics, and why a release curve can look zero order without the polymer eroding.

## The fine print

- We do not know whether the paper's ± is a standard error, a standard deviation across replicates or something else; the 95 % ranges assume a standard error.
- The Peppas model is meant for the first 60 % of release; the ranges and labels apply only there.
- The release curves in Figure 2 are **simulated**; the paper's own curves and its neural-network model were not reused.
- This is materials research, not medical advice on diclofenac or any medicine.
