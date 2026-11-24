---
title: "Quinolinone EGFR/HER-2 inhibitors: which change really matters?"
summary: "A 2025 paper reports two quinolin-2(1H)-one series as dual EGFR/HER-2 inhibitors. Matched molecular pairs in fibub's SAR table builder show the substituent carries the potency and the scaffold swap barely registers."
tools: [sar-table, smiles-checker, dose-response]
updated: 2026-11-24
sources:
  - "Al-Wahaibi, L. H., Abou-Zied, H. A., Nieger, M., Bräse, S., Youssif, B. G. M. and Tawfeek, H. N. (2025), Design, synthesis, antiproliferative assessments, and computational studies of new quinolin-2(1H)-ones as dual EGFR/HER-2 inhibitors, Frontiers in Chemistry 13: 1638489, doi:10.3389/fchem.2025.1638489. Licence CC BY 4.0, stated on the article PDF and confirmed in Crossref (content-version vor), checked 2026-11-24. The record carries one correction, doi:10.3389/fchem.2025.1748491 (10 December 2025), and no retraction. Values used here: MCF-7 IC50 (nM) for the tosyl-sulfonohydrazide series 3a N1-Me 89, 3b 6-OMe 52, 3c 6-Me 48, 3d H 37, 3e N1-Et 61, 3f 6-Cl 43, 3g 7-Me 90, 3h 8-Me >100, and for the 2,4-dinitrophenylhydrazone series 5a H 34, 5b 6-Me 50, 5c 6-OMe 62, 5d 8-Me 67, 5e N1-Me 74, 5f 7-Me 83, 5g 6-Cl 78; erlotinib 40 nM on MCF-7; HER-2 IC50 3c 49, 3d 38, 3f 44, 5a 33, 5b 56 nM with lapatinib 26 nM; EGFR IC50 3c 99, 3d 91, 3f 95, 5a 87, 5b 106 nM with erlotinib 80 nM."
  - "Ligand efficiency constant 1.37 kcal mol⁻¹ per log unit (2.303RT at about 299 K), as used by the tool."
paper:
  title: "Design, synthesis, antiproliferative assessments, and computational studies of new quinolin-2(1H)-ones as dual EGFR/HER-2 inhibitors"
  authors: "Al-Wahaibi LH, Abou-Zied HA, Nieger M, Bräse S, Youssif BGM, Tawfeek HN"
  journal: "Frontiers in Chemistry"
  year: 2025
  doi: "10.3389/fchem.2025.1638489"
  url: "https://www.frontiersin.org/journals/chemistry/articles/10.3389/fchem.2025.1638489/full"
  licence: "CC BY 4.0"
  reviewed: true
---

When a medicinal chemistry paper makes fifteen compounds and one of them wins, the useful question is not "which compound?" but "which **change** made the difference?" A 2025 paper in *Frontiers in Chemistry* built two series of quinolin-2(1H)-ones, a tosyl sulfonohydrazide series and a 2,4-dinitrophenylhydrazone series, tested them on four cancer cell lines and then on EGFR and HER-2, and named compound 5a the best. Feeding its own table into the [[sar-table]] builder turns those fifteen numbers into **matched molecular pairs**: pairs of compounds that differ at one place only, so the effect of that one change can be averaged. The answer is clear, and it is not the one the title suggests. For what else you can do with a series like this, see the [[smiles-checker]] for drug-likeness and the [[dose-response]] for the IC50 values themselves.

## The paper in brief

The authors coupled a quinolin-2(1H)-one carbaldehyde either with tosylhydrazide (giving the "3" series, eight compounds) or with 2,4-dinitrophenylhydrazine (the "5" series, seven compounds), varying one substituent on the quinolinone ring: hydrogen, 6-Me, 7-Me, 8-Me, 6-OMe, 6-Cl, N1-Me or N1-Et.

They measured growth inhibition on A-549, MCF-7, Panc-1 and HT-29 cells (all the IC50 values fall between 34 and over 100 nM), checked that the compounds leave normal MCF-10A cells largely alone, and took five of them on to kinase assays. Compound **5a**, the unsubstituted dinitrophenylhydrazone, is the most potent everywhere: 34 nM on MCF-7, 87 nM on EGFR and 33 nM on HER-2, against 80 nM for erlotinib on EGFR and 26 nM for lapatinib on HER-2. The paper's reading is that the dinitrophenylhydrazone scaffold, plus a free quinolinone ring, gives a balanced dual inhibitor.

## Checked with the tools

Everything below is a **recomputation from the paper's published tables**. No data were simulated and nothing was refitted: the tool converts the IC50 values to pIC50 (−log₁₀ of the molar concentration), finds every pair of compounds that differ at exactly one position, and averages the change.

**Step 1: potency on one scale.** The fifteen MCF-7 values span **pIC50 7.00 to 7.47**, less than half a log unit from the worst to the best compound. The limit value 3h (>100 nM) is carried as a **censored** point at pIC50 < 7.00, so it never pulls an average the wrong way. Erlotinib sits at 7.398, between the two best compounds.

<!-- fig:potency -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="pIC50 against MCF-7 cells for every compound in the paper, grouped by the substituent and split by scaffold. The unsubstituted compound is the most potent in both series; the dashed line is erlotinib." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>MCF-7 potency by substituent, both scaffolds</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">MCF-7 potency by substituent, both scaffolds</text><line x1="58" x2="546" y1="235.2" y2="235.2" style="stroke:var(--line)"/><text x="52" y="239.2" text-anchor="end" style="fill:var(--muted)">7</text><line x1="58" x2="546" y1="167.8" y2="167.8" style="stroke:var(--line)"/><text x="52" y="171.8" text-anchor="end" style="fill:var(--muted)">7.2</text><line x1="58" x2="546" y1="100.5" y2="100.5" style="stroke:var(--line)"/><text x="52" y="104.5" text-anchor="end" style="fill:var(--muted)">7.4</text><line x1="83" x2="83" y1="252" y2="256" style="stroke:var(--muted)"/><text x="83" y="269" text-anchor="middle" style="fill:var(--muted)">H</text><line x1="145.6" x2="145.6" y1="252" y2="256" style="stroke:var(--muted)"/><text x="145.6" y="269" text-anchor="middle" style="fill:var(--muted)">6-Me</text><line x1="208.2" x2="208.2" y1="252" y2="256" style="stroke:var(--muted)"/><text x="208.2" y="269" text-anchor="middle" style="fill:var(--muted)">6-OMe</text><line x1="270.7" x2="270.7" y1="252" y2="256" style="stroke:var(--muted)"/><text x="270.7" y="269" text-anchor="middle" style="fill:var(--muted)">6-Cl</text><line x1="333.3" x2="333.3" y1="252" y2="256" style="stroke:var(--muted)"/><text x="333.3" y="269" text-anchor="middle" style="fill:var(--muted)">N1-Et</text><line x1="395.8" x2="395.8" y1="252" y2="256" style="stroke:var(--muted)"/><text x="395.8" y="269" text-anchor="middle" style="fill:var(--muted)">8-Me</text><line x1="458.4" x2="458.4" y1="252" y2="256" style="stroke:var(--muted)"/><text x="458.4" y="269" text-anchor="middle" style="fill:var(--muted)">N1-Me</text><line x1="521" x2="521" y1="252" y2="256" style="stroke:var(--muted)"/><text x="521" y="269" text-anchor="middle" style="fill:var(--muted)">7-Me</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Substituent on the quinolin-2(1H)-one</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">pIC50 (−log₁₀ M)</text><line x1="58" x2="546" y1="101.2" y2="101.2" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="96.2" text-anchor="end" style="fill:var(--muted)">erlotinib</text><circle cx="83" cy="89.8" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="145.6" cy="127.8" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="208.2" cy="139.6" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="270.7" cy="111.8" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="333.3" cy="162.9" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="395.8" cy="235.2" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="458.4" cy="218.1" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="521" cy="219.7" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="83" cy="77.4" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="145.6" cy="133.8" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="208.2" cy="165.3" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="270.7" cy="198.8" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="395.8" cy="176.6" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="458.4" cy="191.1" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="521" cy="207.9" r="4.5" style="fill:var(--c-tools);opacity:1"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Sulfonohydrazide (3)</text><circle cx="233" cy="36" r="4" style="fill:var(--c-tools)"/><text x="244" y="40" style="fill:var(--muted)">Dinitrophenylhydrazone (5)</text><text class="fibub-mark" x="546" y="290" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Every compound in the paper on one pIC50 scale, from the IC50 values in its MCF-7 table, worked out by the SAR table builder's maths. The limit value for 3h (&gt;100 nM) is plotted at its bound, pIC50 7.00.</figcaption></figure>
<!-- /fig:potency -->

**Step 2: the scaffold swap does almost nothing.** Six substituents appear in both series, so the tool finds six matched pairs for the change *sulfonohydrazide → dinitrophenylhydrazone*. Their mean effect is **−0.033 log units** (standard deviation 0.123, from −0.259 for 6-Cl to +0.080 for hydrogen). In plain words: on average the two scaffolds are the same, and the scatter between substituents is four times the average effect. The two best compounds, 3d and 5a, differ by **0.037 log units** (37 against 34 nM), smaller than the ±3 nM standard error the paper itself reports for those measurements.

**Step 3: the substituent carries the whole story.** Across all 48 matched pairs the tool scores each group by how it fares against its alternatives. The spread is **0.45 log units**, more than ten times the scaffold effect:

| Substituent | Average effect (log units) | Mean pIC50 | Matched pairs |
|---|---|---|---|
| H (none) | +0.260 | 7.450 | 12 |
| 6-Me | +0.096 | 7.310 | 12 |
| 6-OMe | +0.022 | 7.246 | 12 |
| 6-Cl | +0.012 | 7.237 | 12 |
| N1-Et | −0.035 | 7.215 | 6 |
| 8-Me | −0.042 | 7.174 | 6 |
| N1-Me | −0.159 | 7.091 | 12 |
| 7-Me | −0.191 | 7.063 | 12 |

<!-- fig:scores -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 290" role="img" aria-label="Each substituent average effect on pIC50, worked out from matched pairs across the whole series, with the average effect of swapping the entire scaffold shown for comparison." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Average effect of each substituent (matched pairs)</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Average effect of each substituent (matched pairs)</text><line x1="58" x2="546" y1="228.9" y2="228.9" style="stroke:var(--line)"/><text x="52" y="232.9" text-anchor="end" style="fill:var(--muted)">7-Me</text><line x1="58" x2="546" y1="203.6" y2="203.6" style="stroke:var(--line)"/><text x="52" y="207.6" text-anchor="end" style="fill:var(--muted)">N1-Me</text><line x1="58" x2="546" y1="178.4" y2="178.4" style="stroke:var(--line)"/><text x="52" y="182.4" text-anchor="end" style="fill:var(--muted)">8-Me</text><line x1="58" x2="546" y1="153.1" y2="153.1" style="stroke:var(--line)"/><text x="52" y="157.1" text-anchor="end" style="fill:var(--muted)">N1-Et</text><line x1="58" x2="546" y1="127.9" y2="127.9" style="stroke:var(--line)"/><text x="52" y="131.9" text-anchor="end" style="fill:var(--muted)">6-Cl</text><line x1="58" x2="546" y1="102.7" y2="102.7" style="stroke:var(--line)"/><text x="52" y="106.7" text-anchor="end" style="fill:var(--muted)">6-OMe</text><line x1="58" x2="546" y1="77.4" y2="77.4" style="stroke:var(--line)"/><text x="52" y="81.4" text-anchor="end" style="fill:var(--muted)">6-Me</text><line x1="58" x2="546" y1="52.2" y2="52.2" style="stroke:var(--line)"/><text x="52" y="56.2" text-anchor="end" style="fill:var(--muted)">H</text><line x1="125.8" x2="125.8" y1="244" y2="248" style="stroke:var(--muted)"/><text x="125.8" y="261" text-anchor="middle" style="fill:var(--muted)">-0.2</text><line x1="261.3" x2="261.3" y1="244" y2="248" style="stroke:var(--muted)"/><text x="261.3" y="261" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="396.9" x2="396.9" y1="244" y2="248" style="stroke:var(--muted)"/><text x="396.9" y="261" text-anchor="middle" style="fill:var(--muted)">0.2</text><line x1="532.4" x2="532.4" y1="244" y2="248" style="stroke:var(--muted)"/><text x="532.4" y="261" text-anchor="middle" style="fill:var(--muted)">0.4</text><line x1="58" x2="546" y1="244" y2="244" style="stroke:var(--muted)"/><text x="302" y="282" text-anchor="middle" style="fill:var(--ink)">Mean change in pIC50 when this group is present (log units)</text><text transform="translate(14 138) rotate(-90)" text-anchor="middle" style="fill:var(--ink)"></text><line x1="261.3" x2="261.3" y1="32" y2="244" style="stroke:var(--muted);stroke-dasharray:4 4"/><path d="M261.3 228.9L131.7 228.9" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M261.3 203.6L153.3 203.6" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M261.3 178.4L232.7 178.4" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M261.3 153.1L237.7 153.1" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M261.3 127.9L269.1 127.9" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M261.3 102.7L275.9 102.7" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M261.3 77.4L326.6 77.4" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M261.3 52.2L437.6 52.2" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="131.7" cy="228.9" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="153.3" cy="203.6" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="232.7" cy="178.4" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="237.7" cy="153.1" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="269.1" cy="127.9" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="275.9" cy="102.7" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="326.6" cy="77.4" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="437.6" cy="52.2" r="4.5" style="fill:var(--c-blog);opacity:1"/><circle cx="238.7" cy="29.5" r="4.5" style="fill:var(--c-tools);opacity:1"/><text x="246.7" y="33.5" text-anchor="start" style="fill:var(--ink)">whole scaffold swap</text><text class="fibub-mark" x="546" y="18" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. The average effect of each substituent, from all matched pairs in the series, with the average effect of swapping the whole scaffold for comparison. Positive is more potent.</figcaption></figure>
<!-- /fig:scores -->

**Step 4: the single changes worth quoting.** The tool also averages each change on its own, with its spread:

- **H → 7-Me: −0.387** log units, from two pairs that agree to 0.001. Putting a methyl at position 7 costs a factor of 2.4 in potency in both series.
- **N1-Me → H: +0.360** (two pairs, SD 0.031). Leaving the ring nitrogen free is worth as much as the best substituent choice.
- **6-Me → 7-Me: −0.247** (SD 0.037). Moving the same methyl one position round the ring is the difference.
- **H → 6-Cl: −0.213**, but with an SD of 0.209: it helps in one series and hurts in the other, so this one is not transferable.

**Step 5: the kinases say the same.** Run the five-compound HER-2 table through the same maths and the scaffold swap averages **+0.002 log units** (two pairs), while free-ring H beats 6-Me by about 0.13 to 0.26 log units. The ordering of the compounds is the same as in the cells, which is a real result: the cell potency is tracking the kinase potency, not some off-target effect.

| Check | Paper | Tool gives (from its own tables) |
|---|---|---|
| Best compound on MCF-7 | 5a, 34 nM | 5a, pIC50 7.469 |
| 5a better than the best sulfonohydrazide (3d) | "more balanced" | +0.037 log units, inside the stated error |
| Average effect of changing scaffold | not quantified | −0.033 ± 0.123 log units over 6 matched pairs |
| Average effect of the best substituent (H) | "unsubstituted is best" | +0.260 log units over 12 pairs |
| 3h (>100 nM) | excluded from discussion | carried as censored, pIC50 < 7.00 |

## How we made the graphs

The charts and every number come from `scripts/blog-figures/quinolinone-egfr-her2-substituent-matched-pairs.mjs` in fibub's public code. It calls `parseSeries`, `combos`, `matchedPairs`, `transforms`, `groupScores`, `matrix` and `toP` from `src/lib/sci/sar.ts`, the maths behind the [[sar-table]] builder, with `parseTable` from `src/lib/sci/num.ts`.

Every IC50 value, every substituent assignment and both reference-drug values come from the paper's tables; the two series are entered as two values of a first R position ("scaffold") so that the tool treats the scaffold swap as just another change. The grouping of the eight substituents, and the decision to analyse the MCF-7 column rather than the four-line average, are **ours**. No ligand efficiency is shown here, because the paper gives no heavy-atom counts.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs `tests/sci-tools/sar-table.mjs`, which pins the builder against an independent NumPy implementation (itertools for the pairs, `numpy.std` with ddof = 1) on the tool's example series and six random made-up series:

- A 5.6 nM compound must give pIC50 8.2518120, ligand efficiency 0.4522 and LLE 5.6518.
- The 25-compound example must give exactly 87 matched pairs and 25 distinct changes, with NHMe → morpholino at +0.5903 ± 0.4636 over 6 pairs.
- ">10000 nM" must become a censored pIC50 < 5, and the best and worst R1 groups must score +0.6528 and −0.5152.
- New with this article: the paper's MCF-7 series must give 15 compounds, 48 matched pairs and 28 distinct changes, a scaffold swap of −0.033450 ± 0.122747 over 6 pairs, substituent scores of +0.259953 for H and −0.191337 for 7-Me, and 3h censored at pIC50 7.

## Check it yourself

On the [[sar-table]] builder, in the *Your compound series* card:

1. Clear the big box (*One compound per line, with a header row*) and paste this header and the fifteen rows, exactly as they come from the paper's MCF-7 column:

   `ID,R1 scaffold,R2 substituent,IC50 (nM)`
   `3a,sulfonohydrazide,N1-Me,89` · `3b,sulfonohydrazide,6-OMe,52` · `3c,sulfonohydrazide,6-Me,48` · `3d,sulfonohydrazide,H,37` · `3e,sulfonohydrazide,N1-Et,61` · `3f,sulfonohydrazide,6-Cl,43` · `3g,sulfonohydrazide,7-Me,90` · `3h,sulfonohydrazide,8-Me,>100` · `5a,dinitrophenylhydrazone,H,34` · `5b,dinitrophenylhydrazone,6-Me,50` · `5c,dinitrophenylhydrazone,6-OMe,62` · `5d,dinitrophenylhydrazone,8-Me,67` · `5e,dinitrophenylhydrazone,N1-Me,74` · `5f,dinitrophenylhydrazone,7-Me,83` · `5g,dinitrophenylhydrazone,6-Cl,78`

   (one per line; the dots are only there to fit them on this page).
2. Leave *Units of the activity* on **From the header, e.g. "IC50 (nM)"**.
3. *Summary* reads **15 compounds**, pIC50 from **7.00 to 7.47**, with 3h marked as a limit.
4. Under *Substituent changes (matched pairs)* you get **48 pairs**. In *Each change, averaged*, find **sulfonohydrazide → dinitrophenylhydrazone**: n **6**, mean **−0.033**, SD **0.123**.
5. In *Best and worst groups* set *Position* to **R2 substituent**: **H** tops the list at **+0.260** and **7-Me** is last at **−0.191**.
6. Under *Potency matrix* set *Rows* to **R1 scaffold**, *Columns* to **R2 substituent** and *Order* to **Most potent first**: the H column leads in both rows, and the 8-Me cell of the first row is shown as a censored 7.00.

## What researchers can use it for

- **Separate a scaffold claim from a substituent claim** before writing the discussion, as above: a 0.04 log unit difference between two lead compounds is not a scaffold effect.
- **Find which changes repeat** across sub-series. A change with a small standard deviation over several pairs is one to carry into the next round; one like H → 6-Cl here, with an SD as large as its mean, is not.
- **Keep limits honest.** ">100 µM" is information, not a missing value, and censored handling stops it from flattering an average.
- **Plan the next compounds**: the potency matrix shows the empty cells, and the pair with the largest effect tells you which hole to fill first.
- **Sanity-check a published table** quickly: pIC50 values that do not match the stated IC50 units are a common copy-editing error, and the conversion takes seconds.

## The fine print

- We analysed the MCF-7 column. The paper's other three cell lines run almost parallel, so the conclusions do not change, but the exact numbers would.
- Matched pairs with six or twelve observations carry real uncertainty; two agreeing pairs are suggestive, not proof.
- The paper reports standard errors of a few nanomolar on these IC50 values. Differences under about 0.05 log units are inside that noise, which is the main point of Step 2.
- The paper carries a published correction (December 2025). We used the values as served in the article's own tables on the date checked.
- Nothing here is a comment on whether any compound is a useful drug candidate; cell potency is one early step.
