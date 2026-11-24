---
title: "Weighing the eta meson from a beam momentum: threshold kinematics at COSY-ANKE"
summary: "A 2012 workshop paper finds the eta meson's mass from the exact beam momentum at which d + p starts to make 3He + eta. We recompute that threshold and its error budget with fibub's relativistic kinematics tool."
tools: [relativistic-kinematics, physical-constants, uncertainty-calculator]
updated: 2026-11-24
sources:
  - "Goslawski, P. (for the ANKE Collaboration) (2012), Precision measurement of the eta-meson mass at COSY-ANKE, EPJ Web of Conferences 37: 03004 (MESON 2012), doi:10.1051/epjconf/20123703004. The PDF states the article is open access under the Creative Commons Attribution Licence (it names version 2.0); the Crossref record carries no licence field and no update-to or correction entry (checked 2026-11-24), so the licence is taken from the PDF's own note. Values used here: eta mass 547.873 MeV/c2 with 0.005 (stat) and 0.027 (syst), threshold deuteron momentum 3141.688 +- 0.021 MeV/c, momentum precision 3e-5, a mass shift of 23 keV/c2 from the beam-momentum uncertainty, twelve energies with excess energy Q from 1.1 to about 11 MeV, an acceptance up to about 15 MeV, and the formulas for the final-state momentum, the invariant energy s and the mass sensitivity."
  - "Masses of the proton (938.27208943 MeV/c2), deuteron (1875.612945 MeV/c2) and helion, the 3He nucleus (2808.39161112 MeV/c2): CODATA 2022 recommended values (our own input; the paper prints no masses). The tool's built-in rounded names (d 1875.613, p 938.272) are used for the check-it-yourself values."
paper:
  title: "Precision measurement of the η-meson mass at COSY-ANKE"
  authors: "Goslawski P"
  journal: "EPJ Web of Conferences (MESON 2012)"
  year: 2012
  doi: "10.1051/epjconf/20123703004"
  url: "https://www.epj-conferences.org/articles/epjconf/pdf/2012/19/epjconf_meso2012_03004.pdf"
  licence: "CC BY (version 2.0, as stated in the PDF)"
  reviewed: true
---

A particle cannot be made from a collision until there is enough energy to pay for its mass, and the exact energy where that first becomes possible is called the **threshold**. Turn that around and a very precise beam energy at threshold becomes a very precise *mass*. A 2012 workshop paper from the ANKE experiment at the COSY storage ring does this for the eta meson, a neutral particle with about 58 % of a proton's mass, by sending deuterons at a hydrogen target and watching helium-3 and an eta appear. We recomputed the threshold, the excess energy and the error budget with the [[relativistic-kinematics]] calculator, using exact constants from the [[physical-constants]] page; the [[uncertainty-calculator]] is the natural next stop for the error budget.

## The paper in brief

The reaction is d + p → ³He + η: a deuteron beam hits a proton target at rest. The experiment measured how many ³He nuclei came out, with the beam set to twelve momenta just above threshold, so the **excess energy** Q (energy above the bare cost of the two products) ran from about 1 to 11 MeV. Close to threshold the helium nucleus carries a momentum in the centre-of-mass frame that grows with Q, and the paper combines that momentum at each energy with the beam momentum in a global fit for the mass. The key advantage is that the beam momentum is known to about 3 parts in 100,000, because the stored deuterons' spins are tuned to a resonance whose frequency depends on the particle's energy. The paper reports a threshold deuteron momentum of 3141.688 ± 0.021 MeV/c and an eta mass of 547.873 ± 0.005 (statistical) ± 0.027 (systematic) MeV/c². It quotes a mass shift of 23 keV/c² from the beam-momentum uncertainty alone, and about 20 keV/c² between its result and the world average of its time.

## Checked with the tools

Everything here is a **recomputation from the paper's printed formulas and numbers**, with particle masses from CODATA (the paper prints none). No data were refitted.

**Step 1: the threshold.** Put the paper's eta mass of 547.873 MeV/c² in, with beam d, target p and products ³He + η, and the tool's threshold calculator returns a beam momentum of **3141.6867 MeV/c** (total beam energy 3658.978 MeV, kinetic energy 1783.365 MeV, invariant energy √s = 3356.265 MeV). The paper's measured value is 3141.688 MeV/c. The difference is **1.3 keV/c**, which is 0.06 of the paper's own ±21 keV/c error bar: the kinematics and the measurement agree completely. The tool's built-in rounded masses (d 1875.613, p 938.272) give 3141.689 MeV/c, still within 1 keV/c.

**Step 2: the lever from momentum to mass.** The paper gives a formula for how a beam-momentum error moves the mass, Δm_η = m_p p_d / [(m_³He + m_η) E_d] · Δp_d. Evaluated at the threshold it is **0.24004**, and a numerical derivative of the tool's threshold function gives the same **0.24004**. So a relative momentum precision of 3 × 10⁻⁵ (an absolute 0.0943 MeV/c) moves the mass by **22.6 keV/c²**, the paper's "23 keV/c²". The quoted ±0.021 MeV/c alone would move it by only **5.0 keV/c²**, close to the paper's ±0.005 MeV/c² statistical error; the larger ±0.027 systematic error comes from elsewhere in the analysis.

Turned the other way, the mass changes the threshold by 4.166 MeV/c for each MeV/c². A mass 10 keV/c² lighter would put the threshold 41.7 keV/c lower, so a 20 keV/c² shift is an 83 keV/c shift in beam momentum, which the resonance method (about 100 keV/c at threshold) can just resolve; that is the whole point of the experiment.

<!-- fig:thr -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 308" role="img" aria-label="The threshold beam momentum for deuterons on protons rises by 4.17 MeV/c for each MeV/c² of eta mass. At the paper's eta mass of 547.873 the tool gives 3141.687 MeV/c, against the paper's measured 3141.688." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Threshold deuteron momentum against the eta mass</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Threshold deuteron momentum against the eta mass</text><line x1="58" x2="546" y1="258.2" y2="258.2" style="stroke:var(--line)"/><text x="52" y="262.2" text-anchor="end" style="fill:var(--muted)">3.14e+3</text><line x1="58" x2="546" y1="201.4" y2="201.4" style="stroke:var(--line)"/><text x="52" y="205.4" text-anchor="end" style="fill:var(--muted)">3.14e+3</text><line x1="58" x2="546" y1="144.6" y2="144.6" style="stroke:var(--line)"/><text x="52" y="148.6" text-anchor="end" style="fill:var(--muted)">3.14e+3</text><line x1="58" x2="546" y1="87.8" y2="87.8" style="stroke:var(--line)"/><text x="52" y="91.8" text-anchor="end" style="fill:var(--muted)">3.14e+3</text><line x1="119" x2="119" y1="262" y2="266" style="stroke:var(--muted)"/><text x="119" y="279" text-anchor="middle" style="fill:var(--muted)">547.6</text><line x1="241" x2="241" y1="262" y2="266" style="stroke:var(--muted)"/><text x="241" y="279" text-anchor="middle" style="fill:var(--muted)">547.8</text><line x1="363" x2="363" y1="262" y2="266" style="stroke:var(--muted)"/><text x="363" y="279" text-anchor="middle" style="fill:var(--muted)">548</text><line x1="485" x2="485" y1="262" y2="266" style="stroke:var(--muted)"/><text x="485" y="279" text-anchor="middle" style="fill:var(--muted)">548.2</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--muted)"/><text x="302" y="300" text-anchor="middle" style="fill:var(--ink)">Assumed eta mass (MeV/c²)</text><text transform="translate(14 156) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Threshold momentum (MeV/c)</text><line x1="58" x2="546" y1="162.3" y2="162.3" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="157.3" text-anchor="end" style="fill:var(--muted)">3141.688 MeV/c</text><line x1="285.5" x2="285.5" y1="50" y2="262" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="281.5" y="62" text-anchor="end" style="fill:var(--muted)">547.873</text><path d="M58 250.6L70.2 245.9L82.4 241.2L94.6 236.4L106.8 231.7L119 227L131.2 222.2L143.4 217.5L155.6 212.8L167.8 208L180 203.3L192.2 198.6L204.4 193.9L216.6 189.1L228.8 184.4L241 179.7L253.2 174.9L265.4 170.2L277.6 165.5L289.8 160.7L302 156L314.2 151.3L326.4 146.5L338.6 141.8L350.8 137.1L363 132.3L375.2 127.6L387.4 122.9L399.6 118.1L411.8 113.4L424 108.7L436.2 104L448.4 99.2L460.6 94.5L472.8 89.8L485 85L497.2 80.3L509.4 75.6L521.6 70.8L533.8 66.1L546 61.4" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="285.5" cy="162.3" r="5" style="fill:var(--c-tools);opacity:1"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Tool: d + p → 3He + eta</text><circle cx="254.6" cy="36" r="4" style="fill:var(--c-tools)"/><text x="265.6" y="40" style="fill:var(--muted)">Paper: measured threshold and mass</text><text class="fibub-mark" x="546" y="300" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Threshold deuteron momentum for d + p → 3He + eta against the assumed eta mass, from the Relativistic kinematics tool's threshold maths with CODATA 2022 masses for the three nuclei. The dot is the paper's measured threshold momentum and eta mass.</figcaption></figure>
<!-- /fig:thr -->

Inverting the tool's threshold numerically for the paper's 3141.688 MeV/c gives an eta mass of **547.8733 MeV/c²**, the paper's 547.873.

**Step 3: the excess energy and the helium momentum.** The invariant energy for a fixed target is s = 2 m_p E_d + m_d² + m_p², which the tool's √s function reproduces to better than 10⁻⁸ MeV². Solving for the beam momentum gives:

| Excess energy Q | Beam momentum | Helium-3 momentum in the centre of mass |
|---|---|---|
| 1.1 MeV (lowest point) | 3146.27 MeV/c | 31.77 MeV/c |
| 6.3 MeV (the paper's example) | 3167.93 MeV/c | 76.16 MeV/c |
| 11 MeV (highest point) | 3187.50 MeV/c | 100.78 MeV/c |
| 15 MeV (edge of the acceptance) | 3204.16 MeV/c | not computed |

The 76.16 MeV/c at Q = 6.3 MeV also comes out of the tool's two-body decay (a system of invariant mass m_³He + m_η + 6.3 MeV splitting into helium and eta), a second independent route to the same number. The paper's plots run over 3.14 to 3.20 GeV/c, which this table brackets.

<!-- fig:q -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 280" role="img" aria-label="Excess energy Q of the reaction d p → 3He eta against the deuteron beam momentum. Q is 1.1 MeV at 3146.3 MeV/c and 11 MeV at 3187.5 MeV/c." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Excess energy above the threshold</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Excess energy above the threshold</text><line x1="58" x2="546" y1="234" y2="234" style="stroke:var(--line)"/><text x="52" y="238" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="166.7" y2="166.7" style="stroke:var(--line)"/><text x="52" y="170.7" text-anchor="end" style="fill:var(--muted)">5</text><line x1="58" x2="546" y1="99.3" y2="99.3" style="stroke:var(--line)"/><text x="52" y="103.3" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="32" y2="32" style="stroke:var(--line)"/><text x="52" y="36" text-anchor="end" style="fill:var(--muted)">15</text><line x1="72.8" x2="72.8" y1="234" y2="238" style="stroke:var(--muted)"/><text x="72.8" y="251" text-anchor="middle" style="fill:var(--muted)">3.14e+3</text><line x1="220.7" x2="220.7" y1="234" y2="238" style="stroke:var(--muted)"/><text x="220.7" y="251" text-anchor="middle" style="fill:var(--muted)">3.16e+3</text><line x1="368.5" x2="368.5" y1="234" y2="238" style="stroke:var(--muted)"/><text x="368.5" y="251" text-anchor="middle" style="fill:var(--muted)">3.18e+3</text><line x1="516.4" x2="516.4" y1="234" y2="238" style="stroke:var(--muted)"/><text x="516.4" y="251" text-anchor="middle" style="fill:var(--muted)">3.2e+3</text><line x1="58" x2="546" y1="234" y2="234" style="stroke:var(--muted)"/><text x="302" y="272" text-anchor="middle" style="fill:var(--ink)">Deuteron beam momentum (MeV/c)</text><text transform="translate(14 133) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Excess energy Q (MeV)</text><line x1="58" x2="546" y1="32" y2="32" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="27" text-anchor="end" style="fill:var(--muted)">ANKE acceptance ~15 MeV</text><line x1="119.1" x2="119.1" y1="32" y2="234" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="123.1" y="44" text-anchor="start" style="fill:var(--muted)">Q = 1.1</text><line x1="424" x2="424" y1="32" y2="234" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="420" y="44" text-anchor="end" style="fill:var(--muted)">Q = 11</text><path d="M58 234L66.1 234L74.3 234L82.4 234L90.5 231.7L98.7 228.1L106.8 224.6L114.9 221L123.1 217.5L131.2 213.9L139.3 210.4L147.5 206.8L155.6 203.2L163.7 199.7L171.9 196.1L180 192.6L188.1 189L196.3 185.5L204.4 181.9L212.5 178.4L220.7 174.8L228.8 171.2L236.9 167.7L245.1 164.1L253.2 160.6L261.3 157L269.5 153.5L277.6 149.9L285.7 146.3L293.9 142.8L302 139.2L310.1 135.7L318.3 132.1L326.4 128.6L334.5 125L342.7 121.4L350.8 117.9L358.9 114.3L367.1 110.8L375.2 107.2L383.3 103.7L391.5 100.1L399.6 96.5L407.7 93L415.9 89.4L424 85.9L432.1 82.3L440.3 78.8L448.4 75.2L456.5 71.6L464.7 68.1L472.8 64.5L480.9 61L489.1 57.4L497.2 53.9L505.3 50.3L513.5 46.7L521.6 43.2L529.7 39.6L537.9 36.1L546 32.5" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><text class="fibub-mark" x="546" y="272" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Excess energy Q of the reaction against the deuteron beam momentum, over the range of the paper's twelve measurement points (our recomputation; the paper gives only the range of Q).</figcaption></figure>
<!-- /fig:q -->

## How we made the graphs

The script is `scripts/blog-figures/eta-meson-mass-threshold-beam-momentum-cosy-anke.mjs`. It calls `threshold`, `sqrtSFixed`, `twoBody` and `massOf` from `src/lib/sci/phrel.ts`, the maths behind the [[relativistic-kinematics]] calculator. The eta mass, threshold momentum, momentum precision and Q range are the paper's. The proton, deuteron and helion masses are CODATA 2022 values, **our own input**. Excess energy and the final-state momentum use the paper's own formulas. Nothing is fitted or simulated.

## How we test the maths

On every change, `tests/sci.mjs` runs `tests/sci-tools/relativistic-kinematics.mjs`, which checks the tool against a NumPy Lorentz-matrix implementation and textbook thresholds:

- the antiproton threshold p + p → p p p p̄ at a kinetic energy of 5629.6 MeV and a beam momentum of 6500.54 MeV/c;
- π⁰ photoproduction at 144.69 MeV;
- K⁺ → π⁺π⁰ with a pion momentum of 205.14 MeV/c in the kaon's rest frame.
- New with this article: d + p → ³He + η with the paper's eta mass must give a beam momentum of 3141.6867 MeV/c (within 21 keV/c of the paper's 3141.688), a lever dm/dp of 0.24004, and a helium momentum of 76.16 MeV/c at Q = 6.3 MeV.

## Check it yourself

On the [[relativistic-kinematics]] page:

1. Set *Energy, momentum and mass unit* to **MeV**.
2. In section 4, *Reaction threshold*, type *Beam particle* **d**, *Target particle (at rest)* **p**, and *Products* **2808.392 + 547.873**.
3. The page reads *Threshold beam kinetic energy* about **1783.4 MeV** and *Beam momentum* **3141.7 MeV**, with *√s at threshold* **3356.3 MeV**. The paper measured 3141.688 MeV/c.
4. Change the eta mass to **547.853** (about 20 keV lighter): the beam momentum falls by roughly 83 keV/c, a change of about 2.6 parts in 100,000, close to the experiment's stated precision of 3 parts in 100,000.

## What researchers can use it for

- **Plan a threshold run:** find the beam momentum for any reaction and mass and see how many keV/c an expected mass shift means (relativistic kinematics).
- **Turn a momentum error into a mass error** by differentiating the threshold, and check the answer against a published budget (relativistic kinematics, with the uncertainty calculator).
- **Check which constants a result depends on** before comparing it with an older value (physical constants).
- **Teach invariant mass:** show students why √s, not the beam energy, decides what can be made.

## The fine print

- The paper is a short workshop contribution. Its full analysis, with the momentum-resolution corrections that matter most for the systematic error, is in the authors' journal papers, not recomputed here.
- The paper prints no masses for the proton, deuteron or helion. We used CODATA 2022; the authors used values of their time, which differ by far less than the stated uncertainties.
- The threshold recomputed here uses only energy and momentum conservation. It cannot reproduce the paper's fit of the helium momentum distribution, its resolution correction, or its systematic error.
- The tool does not check that the reaction conserves charge or isospin; d + p → ³He + η does.
