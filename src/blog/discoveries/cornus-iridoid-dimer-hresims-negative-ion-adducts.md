---
title: "Six new iridoid dimers: checking their formulas from one m/z each"
summary: "A 2025 paper names six new iridoid glycoside dimers from Cornus officinalis fruit. We recompute every reported [M-H]- mass from the formulas, and show how few other formulas fit."
tools: [adduct-calculator, molar-mass-calculator, unsaturation-calculator, isotope-pattern-calculator]
updated: 2026-11-24
sources:
  - "Shi, Y.-C., Yu, Y.-X., Gao, J.-X., Wang, X., Shang, X.-Y. and Xu, J. (2025), Iridoid glycoside dimers from fruits of Cornus officinalis and their anti-inflammatory activity, Frontiers in Chemistry 13: 1558075, doi:10.3389/fchem.2025.1558075. Licence CC BY 4.0, checked in the Crossref record (licence URL creativecommons.org/licenses/by/4.0/, version of record) on 2026-11-24; no update-to (retraction or correction) field. Values used here: the six new compounds corndiridosides A to F, their molecular formulas (C34H48O20, C40H54O23 twice and C33H46O19 three times), their observed HRESIMS m/z values as [M-H]- ions (775.26660, 901.29828, 901.29816, 745.25659, 745.25513, 745.25549), the plant source (10 kg of dried Cornus officinalis fruit, June 2023) and the assay (nitric oxide release by LPS-stimulated RAW 264.7 cells, tested at 12.5, 25 and 50 uM)."
  - "Monoisotopic atomic masses and the electron mass behind the tool's arithmetic: CODATA and the AME atomic mass evaluation, as used in src/lib/sci/chem.ts."
paper:
  title: "Iridoid glycoside dimers from fruits of Cornus officinalis and their anti-inflammatory activity"
  authors: "Shi Y-C, Yu Y-X, Gao J-X, Wang X, Shang X-Y, Xu J"
  journal: "Frontiers in Chemistry"
  year: 2025
  doi: "10.3389/fchem.2025.1558075"
  url: "https://www.frontiersin.org/journals/chemistry/articles/10.3389/fchem.2025.1558075/full"
  licence: "CC BY 4.0"
  reviewed: true
---

When chemists announce a new natural product, the first hard number in the paper is a mass. One accurate mass, measured to five decimal places, is what pins the molecular formula down before any nuclear magnetic resonance work begins. A 2025 paper in *Frontiers in Chemistry* reports six new **iridoid glycoside dimers** from the dried fruit of *Cornus officinalis*, a widely used medicinal fruit, and gives each one as a single negative-mode ion. This article takes those six numbers and rebuilds them with the [[adduct-calculator]], then asks how many other formulas could have produced the same ion. For the pieces around it, the [[molar-mass-calculator]] handles the formula arithmetic and the [[unsaturation-calculator]] the rings-and-double-bonds count that rules most rival formulas out.

## The paper in brief

The authors extracted 10 kg of dried *Cornus officinalis* fruit, collected in June 2023, and separated out 17 iridoid glycosides. Six were new, and they named them **corndiridosides A to F** (compounds 1 to 6). Iridoids are the bitter glycosides that give the fruit much of its chemistry; a *dimer* here means two iridoid units joined together, which is why the formulas are large (33 to 40 carbons, 19 to 23 oxygens).

Each new compound was measured by **HRESIMS**, high-resolution electrospray ionisation mass spectrometry. In electrospray a molecule does not fly as itself: it flies as an *ion*, and in negative mode the usual ion is the molecule minus one proton, written [M−H]⁻. All six compounds were reported this way, with observed masses from 745.25513 to 901.29828. The paper then tested the compounds on nitric-oxide release by stimulated mouse macrophages at 12.5, 25 and 50 µmol per litre, where compounds 2 and 3 were the most active; those numbers sit in a figure rather than the text, so we do not touch them here.

One small thing in the paper is worth explaining, because it confuses students every year: the text gives formulas such as C34H48O20 while the *calculated* mass beside it is labelled C34H47O20. Both are right. The first is the neutral molecule; the second is the ion that was actually weighed, one hydrogen lighter.

## Checked with the tools

Everything below is a **recomputation** from two things the paper states: each compound's molecular formula and its observed m/z. Nothing is simulated and no data table is copied.

**Step 1: do the reported masses match the formulas?** The Adduct calculator's maths takes a neutral formula, works out its monoisotopic mass from the lightest stable isotope of each element, then removes a proton (1.00727646 Da, a hydrogen atom minus an electron) for the [M−H]⁻ ion. For compound 1, C34H48O20 gives a neutral mass of **776.27389 Da** and an ion at **775.26662**. The paper observed 775.26660, an error of **−0.02 ppm**. All six agree to better than 1.3 parts per million (Figure 1).

<!-- fig:ppm -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 250" role="img" aria-label="Mass error in parts per million for the six new iridoid glycoside dimers, from the adduct calculator's [M-H]- masses against the paper's observed m/z values. All six sit inside 1.3 ppm, well within the usual 5 ppm band." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Six new dimers: observed minus calculated mass</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Six new dimers: observed minus calculated mass</text><line x1="58" x2="546" y1="189.7" y2="189.7" style="stroke:var(--line)"/><text x="52" y="193.7" text-anchor="end" style="fill:var(--muted)">-5</text><line x1="58" x2="546" y1="146.7" y2="146.7" style="stroke:var(--line)"/><text x="52" y="150.7" text-anchor="end" style="fill:var(--muted)">-2</text><line x1="58" x2="546" y1="118" y2="118" style="stroke:var(--line)"/><text x="52" y="122" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="89.3" y2="89.3" style="stroke:var(--line)"/><text x="52" y="93.3" text-anchor="end" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="46.3" y2="46.3" style="stroke:var(--line)"/><text x="52" y="50.3" text-anchor="end" style="fill:var(--muted)">5</text><line x1="98.7" x2="98.7" y1="204" y2="208" style="stroke:var(--muted)"/><text x="98.7" y="221" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="180" x2="180" y1="204" y2="208" style="stroke:var(--muted)"/><text x="180" y="221" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="261.3" x2="261.3" y1="204" y2="208" style="stroke:var(--muted)"/><text x="261.3" y="221" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="342.7" x2="342.7" y1="204" y2="208" style="stroke:var(--muted)"/><text x="342.7" y="221" text-anchor="middle" style="fill:var(--muted)">4</text><line x1="424" x2="424" y1="204" y2="208" style="stroke:var(--muted)"/><text x="424" y="221" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="505.3" x2="505.3" y1="204" y2="208" style="stroke:var(--muted)"/><text x="505.3" y="221" text-anchor="middle" style="fill:var(--muted)">6</text><line x1="58" x2="546" y1="204" y2="204" style="stroke:var(--muted)"/><text x="302" y="242" text-anchor="middle" style="fill:var(--ink)">Compound number</text><text transform="translate(14 118) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Mass error (ppm)</text><line x1="58" x2="546" y1="118" y2="118" style="stroke:var(--muted);stroke-dasharray:4 4"/><line x1="58" x2="546" y1="46.3" y2="46.3" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="41.3" text-anchor="end" style="fill:var(--muted)">+5 ppm</text><line x1="58" x2="546" y1="189.7" y2="189.7" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="184.7" text-anchor="end" style="fill:var(--muted)">−5 ppm</text><line x1="58" x2="546" y1="89.3" y2="89.3" style="stroke:var(--muted);stroke-dasharray:4 4"/><line x1="58" x2="546" y1="146.7" y2="146.7" style="stroke:var(--muted);stroke-dasharray:4 4"/><circle cx="98.7" cy="118.3" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="180" cy="118.4" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="261.3" cy="120.4" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="342.7" cy="107.7" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="424" cy="135.8" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="505.3" cy="128.9" r="4" style="fill:var(--c-blog);opacity:1"/><text class="fibub-mark" x="546" y="242" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. How far each reported ion sits from the mass the Adduct calculator works out for the paper's own formula, as an [M−H]⁻ ion. The dashed lines mark the ±5 ppm band most high-resolution instruments are held to.</figcaption></figure>
<!-- /fig:ppm -->

| Compound | Formula (neutral) | Tool: [M−H]⁻ | Paper: observed | Error |
|---|---|---|---|---|
| 1 Corndiridoside A | C34H48O20 | 775.26662 | 775.26660 | −0.02 ppm |
| 2 Corndiridoside B | C40H54O23 | 901.29831 | 901.29828 | −0.03 ppm |
| 3 Corndiridoside C | C40H54O23 | 901.29831 | 901.29816 | −0.17 ppm |
| 4 Corndiridoside D | C33H46O19 | 745.25605 | 745.25659 | +0.72 ppm |
| 5 Corndiridoside E | C33H46O19 | 745.25605 | 745.25513 | −1.24 ppm |
| 6 Corndiridoside F | C33H46O19 | 745.25605 | 745.25549 | −0.76 ppm |

In absolute terms the largest disagreement is 0.92 mDa, for compound 5. Compounds 4, 5 and 6 are **isomers**: the same formula, so the same mass, and the 1.9 ppm spread between their three measurements is a fair picture of the instrument's own scatter rather than any chemical difference.

**Step 2: read the molecule back out of the mass.** The tool also runs backwards. Give it 775.26660 and tell it the ion is [M−H]⁻ and it returns a neutral mass of **776.27388 Da**, within 0.01 mDa of the formula's own value. That is the mode to use when you have a peak list and no structure yet.

**Step 3: how many formulas fit?** This is the question an accurate mass is really answering. We asked the tool's arithmetic for every formula made of carbon, hydrogen, nitrogen and oxygen (our choice of elements) within 25 ppm of compound 4's ion, keeping only those whose **rings-plus-double-bonds** count is a whole number, which an ordinary, even-electron molecule must have. Just **one** candidate lands inside the usual ±5 ppm acceptance band: C33H46O19, the paper's formula, at 0.72 ppm. The nearest rival, C28H46N2O21, is 6.1 ppm away, and it would need two nitrogens that the compound's chemistry does not support (Figure 2).

<!-- fig:formulas -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 270" role="img" aria-label="Candidate molecular formulas for the ion at m/z 745.25659 in negative mode. Only C33H46O19, the formula the paper gives, lands inside 5 parts per million; the next whole-RDBE candidate is 6 ppm away." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Which formula fits m/z 745.25659 as [M−H]⁻?</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Which formula fits m/z 745.25659 as [M−H]⁻?</text><line x1="58" x2="546" y1="224" y2="224" style="stroke:var(--line)"/><text x="52" y="228" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="176" y2="176" style="stroke:var(--line)"/><text x="52" y="180" text-anchor="end" style="fill:var(--muted)">5</text><line x1="58" x2="546" y1="128" y2="128" style="stroke:var(--line)"/><text x="52" y="132" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="80" y2="80" style="stroke:var(--line)"/><text x="52" y="84" text-anchor="end" style="fill:var(--muted)">15</text><line x1="58" x2="546" y1="32" y2="32" style="stroke:var(--line)"/><text x="52" y="36" text-anchor="end" style="fill:var(--muted)">20</text><line x1="67.4" x2="67.4" y1="224" y2="228" style="stroke:var(--muted)"/><text x="67.4" y="241" text-anchor="middle" style="fill:var(--muted)">-25</text><line x1="255.1" x2="255.1" y1="224" y2="228" style="stroke:var(--muted)"/><text x="255.1" y="241" text-anchor="middle" style="fill:var(--muted)">-5</text><line x1="302" x2="302" y1="224" y2="228" style="stroke:var(--muted)"/><text x="302" y="241" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="348.9" x2="348.9" y1="224" y2="228" style="stroke:var(--muted)"/><text x="348.9" y="241" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="536.6" x2="536.6" y1="224" y2="228" style="stroke:var(--muted)"/><text x="536.6" y="241" text-anchor="middle" style="fill:var(--muted)">25</text><line x1="58" x2="546" y1="224" y2="224" style="stroke:var(--muted)"/><text x="302" y="262" text-anchor="middle" style="fill:var(--ink)">Mass error if this formula is right (ppm)</text><text transform="translate(14 128) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Rings plus double bonds (RDBE)</text><line x1="348.9" x2="348.9" y1="32" y2="224" style="stroke:var(--muted);stroke-dasharray:4 4"/><line x1="255.1" x2="255.1" y1="32" y2="224" style="stroke:var(--muted);stroke-dasharray:4 4"/><circle cx="308.8" cy="118.4" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="359.4" cy="156.8" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="241.3" cy="32" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="234.8" cy="204.8" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="382.7" cy="32" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="433.4" cy="70.4" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="167.3" cy="118.4" r="4" style="fill:var(--c-blog);opacity:1"/><circle cx="308.8" cy="118.4" r="0.1" style="fill:var(--c-tools);opacity:1"/><text x="316.8" y="122.4" text-anchor="start" style="fill:var(--ink)">C33H46O19</text><circle cx="359.4" cy="156.8" r="0.1" style="fill:var(--ink);opacity:1"/><text x="367.4" y="160.8" text-anchor="start" style="fill:var(--ink)">C28H46N2O21</text><circle cx="241.3" cy="32" r="0.1" style="fill:var(--muted);opacity:1"/><text x="249.3" y="36" text-anchor="start" style="fill:var(--ink)">C39H42N2O13</text><circle cx="234.8" cy="204.8" r="0.1" style="fill:var(--c-blog);opacity:1"/><text x="242.8" y="208.8" text-anchor="start" style="fill:var(--ink)">C26H50O24</text><circle cx="382.7" cy="32" r="0.1" style="fill:var(--c-tools);opacity:1"/><text x="390.7" y="36" text-anchor="start" style="fill:var(--ink)">C40H42O14</text><circle cx="433.4" cy="70.4" r="0.1" style="fill:var(--ink);opacity:1"/><text x="425.4" y="74.4" text-anchor="end" style="fill:var(--ink)">C35H42N2O16</text><circle cx="167.3" cy="118.4" r="0.1" style="fill:var(--muted);opacity:1"/><text x="175.3" y="122.4" text-anchor="start" style="fill:var(--ink)">C32H46N2O18</text><text class="fibub-mark" x="546" y="262" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Every carbon-hydrogen-nitrogen-oxygen formula within 25 ppm of the ion at m/z 745.25659, plotted against its rings-plus-double-bonds count. Only the paper's formula lands inside 5 ppm. The element set and the ranges searched are our choice.</figcaption></figure>
<!-- /fig:formulas -->

**Step 4: the same molecule in other ions.** A peak list rarely shows only [M−H]⁻. For compound 1 the tool gives [M+H]⁺ at 777.2812, [M+Na]⁺ at 799.2631, [M+K]⁺ at 815.2371, [M+NH4]⁺ at 794.3077, [M+Cl]⁻ at 811.2433, the formate adduct [M+HCOO]⁻ at 821.2721, the doubly charged [M−2H]²⁻ at 387.1297 and the dimer-of-dimers [2M−H]⁻ at 1551.5405. Those are the masses to search for in the raw file before deciding a peak is a different compound. Note how little the doubly charged ion looks like the molecule: at m/z 387 it is easy to mistake for something half the size, which is why charge state matters more than mass alone.

## How we made the graphs

The charts and every number in this article come from `scripts/blog-figures/cornus-iridoid-dimer-hresims-negative-ion-adducts.mjs` in fibub's public code. It calls `formulaMass`, `adductMz`, `neutralFrom` and `ppmError` from `src/lib/sci/mbadduct.ts`, the maths behind the [[adduct-calculator]], and uses the same `ADDUCT_LIST` the tool page shows.

The six molecular formulas and the six observed m/z values come from the paper's text. The ±5 ppm band is the common instrument specification, not the paper's own criterion (**our assumption**). In the formula search, the elements (C, H, N, O), the ranges (up to 48 carbons, 84 hydrogens, 3 nitrogens, 32 oxygens) and the rings-plus-double-bonds window (0 to 20) are **our choices**; the paper reports only the winning formula.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/adduct-calculator.mjs`, which pins the adduct maths against an independent Python calculation built from published atomic masses:

- Glucose, C6H12O6, must have a monoisotopic mass of 180.06338810 Da, and its [M+Na]⁺ must be 203.0526088, the value quoted in metabolomics handbooks.
- All 25 adducts must invert: feeding an ion's m/z back through `neutralFrom` must return the neutral mass to within 10⁻⁹ Da, including the multiply charged and multimer ions.
- A match on 203.0530 against glucose must be reported as [M+Na]⁺ at +1.93 ppm.
- New with this article: the paper's three distinct formulas must give [M−H]⁻ masses of 775.26662, 901.29831 and 745.25605, and the six reported ions must come out between −1.24 and +0.72 ppm, with exactly one carbon-hydrogen-nitrogen-oxygen formula inside 5 ppm of m/z 745.25659.

## Check it yourself

On the [[adduct-calculator]] page:

1. In the *Molecule* card, leave *Give it as* on **Formula** and type **C33H46O19** in *Formula*.
2. Set *Ion mode* to **Negative only**.
3. In *Observed m/z (optional)*, clear the box and paste the paper's three isomer measurements, one per line: **745.25659**, **745.25513**, **745.25549**. Leave *Tolerance (ppm)* on **5**.
4. The *Matches* table should show all three as **[M−H]⁻** against a theoretical **745.25605**, with errors of about **+0.72, −1.24 and −0.76 ppm**.
5. The *Adducts* table gives the rest of the negative ladder for this formula, including **[M+Cl]⁻ 781.2327** and **[M+HCOO]⁻ 791.2615**.
6. Now set *Give it as* to **Nothing: find masses from m/z** and keep the same three values: the *Neutral mass for each observed m/z* table reads **746.26387, 746.26241 and 746.26277 Da** as [M−H]⁻, the neutral masses the formula search starts from.

## What researchers can use it for

- **Check a paper or a referee report in seconds**: type the formula, read the ion, compare the ppm error. A reported mass more than a few ppm out usually means a typo in the formula, not a new element.
- **Build a target list before you look at the raw file**: the adduct table gives every ion the same molecule can make, so a "missing" compound can be found as its sodium or formate adduct.
- **Turn a peak list into candidate masses** with the reverse mode, then narrow the formulas with the rings-plus-double-bonds rule from the [[unsaturation-calculator]].
- **Teach why high resolution matters**: at 5 ppm one formula fits the ion in this paper; at 50 ppm a dozen do. The same search run with a wider window makes the point better than any lecture slide.
- **Predict the isotope pattern** of the winning formula with the [[isotope-pattern-calculator]], then compare its shape with the measured peak cluster as a second, independent check on the formula.

## The fine print

- We checked the paper's **mass assignments**, not its structures. Where two iridoid units join, and the stereochemistry, come from NMR work this tool cannot touch.
- Compounds 4, 5 and 6 share a formula, so mass alone cannot tell them apart; only their NMR and chromatographic behaviour can.
- The bioassay numbers are in the paper's figures, so we neither used nor checked them.
- Our formula search covers only C, H, N and O. A sulfur or chlorine would open other candidates, and a real unknown should be searched with the elements its chemistry allows.
- The paper labels two compounds' ions "HREISMS" rather than "HRESIMS", and gives the neutral formula in the text beside the ion formula in the calculated value. Neither affects the masses.
