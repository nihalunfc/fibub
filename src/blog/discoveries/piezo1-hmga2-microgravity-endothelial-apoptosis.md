---
title: "PIEZO1 and HMGA2 drive endothelial apoptosis in simulated microgravity (clinostat, HUVECs)"
summary: "Rotating HUVECs on a clinostat raised the mechanosensitive channel PIEZO1, calcium and HMGA2, and killed cells. Here is how to measure blot bands and fold changes from your own gels and Cq values."
tools: [gel-densitometry, qpcr-analyser, protein-assay]
updated: 2026-11-10
sources:
  - "Wang Y, Wang R, Qin X, Pan Y, Li C, Sun X (2026), International Journal of Molecular Sciences 27(3): 1425, CC BY, the paper described here."
  - "Livak and Schmittgen (2001) for the 2^-DDCq method, cited for the method only."
  - "The fold changes and band ratios in the worked example were computed with the repo's own src/lib/sci/qpcr.ts code and plain arithmetic from made-up numbers."
paper:
  title: "PIEZO1 Mediates Apoptosis of Endothelial Cells via Enhancing HMGA2 Expression Under Simulated Microgravity"
  authors: "Wang Y, Wang R, Qin X, Pan Y, Li C, Sun X"
  journal: "International Journal of Molecular Sciences"
  year: 2026
  doi: "10.3390/ijms27031425"
  url: "https://www.mdpi.com/1422-0067/27/3/1425"
  licence: "CC BY"
  reviewed: true
---

Astronauts come back with stiffer blood vessels, and part of the reason seems to be that the cells lining them can tell when gravity stops pulling. A group at the Air Force Medical University in Xi'an spun human umbilical vein endothelial cells on a clinostat for two days and watched a mechanical sensor switch on: PIEZO1, a channel that opens when the membrane is stretched, let calcium in, calcium pushed up a chromatin protein called HMGA2, and the cells began to die. The work appeared in the *International Journal of Molecular Sciences* in January 2026 under a CC BY licence. Its two workhorse measurements, blot bands and qPCR fold changes, are what [[gel-densitometry|the gel densitometry page]] and [[qpcr-analyser|the qPCR analyser]] were built for.

## What they found

After 48 hours on a clinostat at 30 rpm, PIEZO1 went up as both mRNA and protein, and apoptosis rose with it. siRNA against PIEZO1 cut that apoptosis and undid the shift in the Bax-to-Bcl-2 balance that marks cells heading for death.

Proteomics gave the mechanism a candidate. Microgravity changed 1,259 proteins against the static control (776 down, 483 up); knocking down PIEZO1 in microgravity changed 1,064 (490 down, 574 up), and 369 overlapped. HMGA2 stood out: up with microgravity, down when PIEZO1 was silenced. Calcium imaging tied them together, since the calcium rise shrank after PIEZO1 knockdown and a chelator stopped HMGA2 rising at all. Knocking down HMGA2 reduced, but did not abolish, the apoptosis.

## Why it matters

Vascular problems in spaceflight are usually described, not explained. A named channel with a named downstream effector gives something to test, and the logic reaches past spaceflight: endothelial cells in a stent, a graft or a bedridden patient also live with unusual mechanical loading.

## How they did it

1. HUVECs in high-glucose DMEM with 10 % serum were rotated at 30 rpm for 48 hours on a clinostat, with static controls in identical chambers.
2. Protein was extracted in RIPA buffer, quantified by a BCA assay, blotted to PVDF, and the bands quantified in ImageJ and normalised to GAPDH as the loading control.
3. RNA went through TRIzol extraction and SYBR Green qPCR, with GAPDH as the reference gene and the 2^−ΔΔCt method.
4. Apoptosis was read by annexin V and propidium iodide on a flow cytometer, and calcium by Fluo-4 AM confocal imaging with a chelator control.
5. siRNAs against PIEZO1 and HMGA2, plus a control, were lipid-transfected at about 70 % confluence and assayed 48 hours later.
6. Results were mean ± SEM of three independent experiments, by one-way ANOVA with Dunnett's test.

## Check it yourself with fibub

All the numbers below are invented by us to show the workings. The paper's own fold changes are in its figures, not here.

**Step 1: how much protein to load.** The [[protein-assay|protein assay page]] fits your BCA standards, reads the unknowns off the curve and gives the µL of each lysate that carries 20 µg, so the lanes start equal.

**Step 2: measure the bands.** Open your blot scan on the gel densitometry page (the original imager file, no contrast adjustment), tap *Set the lane area* and tap two opposite corners around the lanes, then set *Number of lanes* to 3 and name them "Static, Clinostat, Clinostat + siPIEZO1". Keep *Dark on a light background* for film, or *Light on a dark background* for a fluorescent scan, and leave the background on *Straight line under each band*.

Suppose the Bax band volumes come back as 8,200, 15,100 and 9,400, and GAPDH in the same lanes as 20,500, 22,600 and 19,800. Pick lane 1 as the reference lane and GAPDH as the loading control. The raw Bax band would say 184 % for the clinostat lane, but the ratios to GAPDH are 0.400, 0.668 and 0.475, so the table reports **167 %** and **119 %** of the static lane. That 17-point gap is the reason for a loading control, and the saturation check warns you when the strongest band hit the top of the camera's range and so reads too low.

**Step 3: fold changes from Cq values.** On the qPCR analyser, paste one row per well as sample, gene, Cq. With PIEZO1 at 26.4, 26.6, 26.5 in static cells and 25.1, 25.3, 25.0 after the clinostat, and GAPDH at 18.2, 18.3, 18.1 and 18.3, 18.2, 18.4, set GAPDH as the reference gene and "Static" as the control sample. ΔCq falls from 8.30 to 6.83, so ΔΔCq is −1.47 and PIEZO1 is up **2.76×** (2.44 to 3.14 from the replicate spread). Add PIEZO1 at 27.2, 27.0, 27.1 with GAPDH at 18.1, 18.2, 18.3 and the knockdown reads **0.66×** (0.60 to 0.73), below the static baseline.

The page raises two cautions. Its replicate panel flags any group spreading more than 0.5 cycles, and its reference-gene line warns you if GAPDH itself drifts by more than a cycle between samples, which happens often under stress treatments; add a second reference gene and the tool combines them by their geometric mean. With a dilution series, switch *Efficiencies* to *From the standard curves*.

## The fine print

- A clinostat is not weightlessness. It averages the direction of gravity, and the authors say openly that proper mechanical controls are needed before calling PIEZO1 the cause.
- One cell type, from umbilical vein, in three independent experiments, with blot and flow cytometry results shown as figures rather than tabulated numbers.
- Whether HMGA2 acts on apoptosis genes directly or just makes cells easier to kill is unresolved, knockdown is not the same as blocking the channel, and other stretch-sensitive channels could feed the calcium rise.
- This is cell biology, not medicine: nothing here is advice about anyone's circulation.
