---
title: "CRISPR screen finds RNF6 helps Zika virus grow in brain endothelial cells"
summary: "A genome-wide screen in tree shrew brain cells put RNF6 at the top of the list of host helpers. Here is how to plan the same MOIs and titrate the stock yourself."
tools: [moi-calculator, tcid50-calculator, hemocytometer]
updated: 2026-11-10
sources:
  - "Qi M et al. (2026), Viruses 18(3): 323, CC BY, the paper described here."
  - "Spearman–Kärber endpoint, Reed–Muench endpoint, and the Poisson shares of cells receiving k particles (e^−m m^k / k!): standard methods, computed here with the fibub tools' own code."
  - "The well scores, titre and volumes in the worked example are made up by fibub."
paper:
  title: "Tree Shrew Genome-Wide CRISPR Screen Identifies RNF6 as a Proviral Host Factor for Zika Virus Replication in Brain Microvascular Endothelial Cells"
  authors: "Qi M, Liu X, Wang W, Lu M, Zeng Q, Li N, Han Y, Fan S, Lu C, Dai J"
  journal: "Viruses"
  year: 2026
  doi: "10.3390/v18030323"
  url: "https://www.mdpi.com/1999-4915/18/3/323"
  licence: "CC BY"
  reviewed: true
---

A virus cannot replicate on its own equipment alone; it borrows proteins from the cell it has entered. Finding out which ones is now done by knocking out every gene in turn and seeing which cells survive an infection. A team in Kunming ran such a screen in brain microvascular endothelial cells from the tree shrew, a small mammal closer to primates than mice are, and infected them with Zika virus. One gene came out on top: RNF6. The paper was published in Viruses in March 2026 under a CC BY licence. The step every reader can copy is the dose arithmetic, which the [[moi-calculator]] handles.

## What they found

The screen covered about 15,471 protein-coding genes with six guide RNAs each, plus a thousand non-targeting controls. It returned 873 candidate genes, and RNF6 was first, with all six of its guides enriched; a gene already known to help flaviviruses served as the positive control.

Follow-up work pointed the same way. Lowering RNF6 cut viral genome copies and titres, raising it increased virus production, and deleting it reduced infection, which putting the gene back reversed. RNF6 was found bound to NS5, one of the virus's own proteins, and it appears to hold down the interferon response: with less RNF6, interferon-stimulated genes rose. Tree shrew and human RNF6 are 87 % identical.

## Why it matters

Zika virus reaches the brain by crossing the blood-brain barrier, whose inner lining is made of exactly these endothelial cells, so a host factor found in that cell type matters more than one found in a kidney cell line. A gene the virus leans on is also a candidate target, because a cell protein is harder for the virus to mutate around. The tree shrew gains a genome-wide screening toolkit from the work as well.

## How they did it

1. Primary endothelial cells were isolated from tree shrew brain and transduced with a pooled guide RNA library at a low multiplicity of infection (0.3) so that most cells received one guide.
2. The library cells were infected with Zika virus at a high multiplicity (5) and the survivors sequenced to see which guides were enriched.
3. Candidates were tested one at a time by silencing with siRNA (infection at 0.01) and by making knockout and add-back cell lines (0.1 and 0.01).
4. Virus stocks were titrated as TCID50 in Vero cells, worked out by Kärber's method.
5. Protein partners were found by pulling RNF6 down and identifying what came with it, and the interferon and MAPK pathways were read out by expression and protein measurements.

## Check it yourself with fibub

Every number below is invented by us.

**Step 1: titrate the stock.** In the [[tcid50-calculator]], type seven ten-fold dilutions with 6 wells each and 0.1 mL per well, with infected wells of 6, 6, 6, 6, 4, 2 and 0. Spearman–Kärber gives an endpoint of **10⁻⁵·⁵**, which is 10⁵·⁵ ÷ 0.1 mL = **3.16 × 10⁶ TCID50/mL**, with a standard error of 0.298 log₁₀ and a 95 % interval of 10⁴·⁹² to 10⁶·⁰⁸. Reed–Muench lands on the same endpoint here, which is reassuring but not guaranteed.

**Step 2: turn TCID50 into infectious units.** The MOI calculator multiplies a TCID50 titre by ln 2 = 0.693, because one TCID50 infects half the wells, so the stock counts as **2.19 × 10⁶ infectious units/mL**. If you prefer to treat one TCID50 as one unit, set that factor to 1 and every volume below shrinks by 31 %.

**Step 3: check what a volume gives you.** With 120,000 cells per well at the moment of infection, adding 5 µL of that stock gives an MOI of **0.091**: close to the 0.1 used for knockout experiments, and a useful reminder to count the cells rather than assume the seeding density.

**Step 4: plan the plate.** Ask for MOIs of 0, 0.01, 0.1, 1 and 5, three wells each, 200 µL of inoculum per well and 10 % spare. Each mix is **660 µL**:

- MOI 0.1 takes **18.1 µL** of stock plus 642 µL of medium.
- MOI 0.01 needs 1.81 µL, under a sensible minimum, so the tool makes a 1 : 10 predilution first (2.17 µL of stock in 19.5 µL of medium) and takes 18.1 µL of that.
- MOI 1 takes 181 µL of stock.
- MOI 5 is **refused**: it would need 274 µL of stock per well, more than the 200 µL inoculum. Concentrate the stock, use fewer cells or a larger inoculum. A screen at MOI 5, as in the paper, needs a much stronger stock than our made-up one.

**Step 5: read the Poisson table.** At MOI 0.1, 90.5 % of cells get nothing and 9.05 % get exactly one particle, so a "low MOI" infection is a single-hit experiment. At MOI 5 only 0.7 % escape, 3.4 % get exactly one, and 87.5 % get three or more. Count the cells first with the [[hemocytometer]].

## The fine print

- Everything is in cultured cells. The authors say human cells and live animals still have to be tested, and human RNF6 was not tested directly.
- The NS5 contact residues come from a docking model, not a structure.
- How RNF6 restrains interferon is unsettled, and the ubiquitin-tagging step its family is named for was not measured.
- A survival-based screen misses genes the cells need to stay alive, so the 873 candidates are not a complete list.
- Titres are reported as directions of change rather than fold changes, so those numbers cannot be reused. This page is general science education, not medical advice.
