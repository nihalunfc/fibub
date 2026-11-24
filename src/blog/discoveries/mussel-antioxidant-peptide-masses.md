---
title: "Five mussel antioxidant peptides: what their masses alone can prove"
summary: "A 2025 Marine Drugs study names five antioxidant peptides from mussel protein. We work out their exact masses and fragment ions and count how many other sequences fit the same mass."
tools: [peptide-mass-calculator, protein-calculator, hydropathy-plot]
updated: 2026-11-24
sources:
  - "Lu, J., Shi, P., Cao, Y., Shi, B., Shen, H., Zhao, S., Gao, Y., Chi, H., Wang, L. and Shi, Y. (2025), Isolation and Purification of Novel Antioxidant Peptides from Mussel (Mytilus edulis) Prepared by Marine Bacillus velezensis Z-1 Protease, Marine Drugs 23(8): 294, doi:10.3390/md23080294. Licence CC BY 4.0 (checked in the Crossref record for the DOI, 2026-11-24; the MDPI article page states the Creative Commons Attribution licence). Values used here: the five peptide sequences VPPFY, IMLFP, LPFLF, FLPF and FPRIM; hydrolysate made with the protease of a marine Bacillus velezensis strain, not trypsin; identification on a Thermo Fisher Orbitrap with Byonic, precursor tolerance 20 ppm and fragment tolerance 0.02 Da; VPPFY scavenged about 60 % of DPPH radicals at 0.1 mg/mL and all five peptides above 60 % of superoxide anion at 0.025 mg/mL."
  - "Residue masses are worked out by fibub from each amino acid's chemical formula with exact isotope masses; the proton mass is the CODATA value. The b and y ion definitions are the standard ones (Roepstorff and Fohlman, 1984; Biemann, 1990)."
paper:
  title: "Isolation and Purification of Novel Antioxidant Peptides from Mussel (Mytilus edulis) Prepared by Marine Bacillus velezensis Z-1 Protease"
  authors: "Lu J, Shi P, Cao Y, Shi B, Shen H, Zhao S, Gao Y, Chi H, Wang L, Shi Y"
  journal: "Marine Drugs"
  year: 2025
  doi: "10.3390/md23080294"
  url: "https://www.mdpi.com/1660-3397/23/8/294"
  licence: "CC BY 4.0"
  reviewed: true
---

A mussel protein hydrolysate holds thousands of peptides, and a paper that names five of them is making a precise claim: these exact strings of amino acids, in this exact order. A 2025 study in *Marine Drugs* digested mussel (*Mytilus edulis*) protein with the protease of a marine *Bacillus velezensis* strain, chased the antioxidant activity through the fractions and reported five peptides, **VPPFY, IMLFP, LPFLF, FLPF and FPRIM**. This article uses the [[peptide-mass-calculator|peptide mass calculator]] to work out what those sequences weigh, which fragment ions separate them from their own rearrangements, and how many other sequences would fit the same measured mass. For the charge and solubility side of the same peptides, use the [[protein-calculator|protein parameter calculator]], and for how greasy they are, the [[hydropathy-plot]].

## The paper in brief

The authors screened marine bacteria for a protease, used the best one (strain Z-1) to break down mussel protein, and split the hydrolysate by ultrafiltration and chromatography, testing radical scavenging at each step. The active fraction went into an Orbitrap mass spectrometer; peptides were identified with a database search at a precursor tolerance of 20 ppm and a fragment tolerance of 0.02 Da, and five candidates were then **synthesised** and retested. VPPFY scavenged about 60 % of DPPH radicals at 0.1 mg/mL, and all five removed more than 60 % of superoxide anion at 0.025 mg/mL, close to the glutathione reference. Molecular docking suggested they sit in the active site of an antioxidant enzyme.

Synthesising the peptides is the strong part of that design: it tests the sequence, not just the mass. The arithmetic below shows why that step matters so much.

## Checked with the tools

**Step 1: the exact masses.** Feeding each sequence to the calculator's one-peptide card gives its formula and both masses. These are the values a mass spectrometer should see, and they are facts about the sequences, not about the paper's samples.

| Peptide | Formula | Monoisotopic mass (Da) | Average mass (Da) | [M+H]⁺ | [M+2H]²⁺ |
|---|---|---|---|---|---|
| VPPFY | C₃₃H₄₃N₅O₇ | 621.3162 | 621.735 | 622.3235 | 311.6654 |
| IMLFP | C₃₁H₄₉N₅O₆S | 619.3404 | 619.822 | 620.3476 | 310.6775 |
| LPFLF | C₃₅H₄₉N₅O₆ | 635.3683 | 635.806 | 636.3756 | 318.6914 |
| FLPF | C₂₉H₃₈N₄O₅ | 522.2842 | 522.646 | 523.2915 | 262.1494 |
| FPRIM | C₃₁H₅₀N₈O₆S | 662.3574 | 662.851 | 663.3647 | 332.1860 |

**Step 2: one peptide's mass is another's fragment.** Run the calculator's fragment table on LPFLF and its **y4 ion**, the piece left after the first residue falls off, comes out at **523.2915**. That is the same number, to all four decimal places and 0.000 ppm, as the whole of FLPF. The two reported peptides differ by one leucine at the front, and FLPF is a rearrangement of what is left. So in a mixture, a singly charged peak at 523.29 is ambiguous: it could be the peptide FLPF or a fragment of LPFLF. Only the chromatography and the MS/MS pattern can tell which, and anyone repeating this work should check that the two peptides really separate on the column.

**Step 3: which ions distinguish an order from a rearrangement?** Mass cannot see order at all. Figure 1 compares the b-ion ladder of LPFLF with two rearrangements of the same five residues that we invented, PLFLF and FLPLF. The three ladders are identical from the third ion onwards (358.213, 471.297, 618.365); they differ only at b1 and b2. On the y side the same is true from the other end. In practice that means the sequence rests on one or two small ions, exactly the ones that are weakest in a spectrum and nearest the noise.

<!-- fig:ladders -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 308" role="img" aria-label="b-ion m/z against position for LPFLF and two sequences made of the same residues. The ladders meet from the third residue on, so only the first two ions separate the three sequences, although all three have the same precursor mass of 636.376." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>b-ion ladders: the same five residues, three orders</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">b-ion ladders: the same five residues, three orders</text><line x1="58" x2="546" y1="214.1" y2="214.1" style="stroke:var(--line)"/><text x="52" y="218.1" text-anchor="end" style="fill:var(--muted)">200</text><line x1="58" x2="546" y1="145.7" y2="145.7" style="stroke:var(--line)"/><text x="52" y="149.7" text-anchor="end" style="fill:var(--muted)">400</text><line x1="58" x2="546" y1="77.4" y2="77.4" style="stroke:var(--line)"/><text x="52" y="81.4" text-anchor="end" style="fill:var(--muted)">600</text><line x1="80.2" x2="80.2" y1="262" y2="266" style="stroke:var(--muted)"/><text x="80.2" y="279" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="191.1" x2="191.1" y1="262" y2="266" style="stroke:var(--muted)"/><text x="191.1" y="279" text-anchor="middle" style="fill:var(--muted)">2</text><line x1="302" x2="302" y1="262" y2="266" style="stroke:var(--muted)"/><text x="302" y="279" text-anchor="middle" style="fill:var(--muted)">3</text><line x1="412.9" x2="412.9" y1="262" y2="266" style="stroke:var(--muted)"/><text x="412.9" y="279" text-anchor="middle" style="fill:var(--muted)">4</text><line x1="523.8" x2="523.8" y1="262" y2="266" style="stroke:var(--muted)"/><text x="523.8" y="279" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--muted)"/><text x="302" y="300" text-anchor="middle" style="fill:var(--ink)">Residue counted from the N end</text><text transform="translate(14 156) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">b ion m/z (singly charged)</text><path d="M80.2 243.5L191.1 210.3L302 160L412.9 121.4L523.8 71.1" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M80.2 249L191.1 210.3L302 160L412.9 121.4L523.8 71.1" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M80.2 231.9L191.1 193.2L302 160L412.9 121.4L523.8 71.1" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">LPFLF (the paper)</text><line x1="206.4" x2="218.4" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="222.4" y="40" style="fill:var(--muted)">PLFLF (our permutation)</text><line x1="398" x2="410" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="414" y="40" style="fill:var(--muted)">FLPLF (our permutation)</text><text class="fibub-mark" x="546" y="300" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Singly charged b ions against position, from the Peptide mass calculator's fragment table, for the paper's LPFLF and for two rearrangements of the same five residues that we made up. All three share the precursor mass; the ladders separate only at the first two ions.</figcaption></figure>
<!-- /fig:ladders -->

**Step 4: how many sequences fit the mass?** We walked every composition of four or five of the 20 standard amino acids with the same residue masses the tool uses, and counted how many distinct sequences land within a given window of the measured mass (Figure 2). At the paper's **20 ppm**, **1,480** five-residue sequences fit the mass of LPFLF, and 144 four-residue sequences fit FLPF. Even at an impossible 0.5 ppm, **120** sequences remain for LPFLF: its own 30 rearrangements, times four, because leucine and isoleucine weigh exactly the same and either of its two L positions could be an I. For FLPF, 24 remain.

<!-- fig:candidates -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 308" role="img" aria-label="The number of distinct amino-acid sequences whose monoisotopic mass falls within a given tolerance of the paper's peptides, counted over the 20 standard residues. At 20 ppm about 1,480 five-residue sequences fit the mass of LPFLF." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Sequences that fit the mass, as the window tightens</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Sequences that fit the mass, as the window tightens</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--line)"/><text x="52" y="266" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="194.5" y2="194.5" style="stroke:var(--line)"/><text x="52" y="198.5" text-anchor="end" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="127.1" y2="127.1" style="stroke:var(--line)"/><text x="52" y="131.1" text-anchor="end" style="fill:var(--muted)">1,000</text><line x1="58" x2="546" y1="59.6" y2="59.6" style="stroke:var(--line)"/><text x="52" y="63.6" text-anchor="end" style="fill:var(--muted)">10,000</text><line x1="58" x2="58" y1="262" y2="266" style="stroke:var(--muted)"/><text x="58" y="279" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="155.6" x2="155.6" y1="262" y2="266" style="stroke:var(--muted)"/><text x="155.6" y="279" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="253.2" x2="253.2" y1="262" y2="266" style="stroke:var(--muted)"/><text x="253.2" y="279" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="350.8" x2="350.8" y1="262" y2="266" style="stroke:var(--muted)"/><text x="350.8" y="279" text-anchor="middle" style="fill:var(--muted)">60</text><line x1="448.4" x2="448.4" y1="262" y2="266" style="stroke:var(--muted)"/><text x="448.4" y="279" text-anchor="middle" style="fill:var(--muted)">80</text><line x1="546" x2="546" y1="262" y2="266" style="stroke:var(--muted)"/><text x="546" y="279" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--muted)"/><text x="302" y="300" text-anchor="middle" style="fill:var(--ink)">Precursor tolerance (ppm)</text><text transform="translate(14 156) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Matching sequences (log scale)</text><line x1="155.6" x2="155.6" y1="50" y2="262" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="159.6" y="62" text-anchor="start" style="fill:var(--muted)">paper's 20 ppm</text><path d="M60.4 189.2L62.9 189.2L67.8 189.2L72.6 189.2L82.4 189.2L92.2 128.9L106.8 128.9L131.2 115.6L155.6 115.6L204.4 99.4L302 86L424 74.3L546 63.5" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M60.4 236.4L62.9 236.4L67.8 236.4L72.6 236.4L82.4 236.4L92.2 204.2L106.8 189.2L131.2 183.9L155.6 183.9L204.4 168.9L302 166.1L424 153.4L546 143.9" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">5 residues (mass of LPFLF)</text><line x1="271.2" x2="283.2" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="287.2" y="40" style="fill:var(--muted)">4 residues (mass of FLPF)</text><text class="fibub-mark" x="546" y="300" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. How many amino-acid sequences fit the measured mass, against the precursor tolerance, counted by walking every composition of four or five of the 20 standard residues. The dashed line is the 20 ppm window the paper's search used.</figcaption></figure>
<!-- /fig:candidates -->

**Step 5: the enzyme is not trypsin, and the peptides show it.** Run the in-silico digest over these sequences and trypsin cuts nowhere inside four of the five (it cuts after K and R, and only FPRIM has an R, in the middle). None of the five ends in K or R. That fits the paper's use of a broad bacterial protease, and it is a warning for anyone trying to reproduce the work with a trypsin-only search: these peptides would not be in the candidate list. Chymotrypsin, which cuts after F, Y and W, would cut inside VPPFY, LPFLF and FLPF.

| Check | Paper | Peptide mass calculator |
|---|---|---|
| Precursor window | 20 ppm | leaves 1,480 possible five-residue sequences at the mass of LPFLF |
| Best window imaginable | - | 120 sequences remain at 0.5 ppm (rearrangements plus Leu/Ile) |
| Fragment window | 0.02 Da | the ions that separate LPFLF from a rearrangement differ by 16.03 Da at b1, far more than the tolerance |
| LPFLF and FLPF | reported as two peptides | FLPF's [M+H]⁺ equals LPFLF's y4 ion to 0.000 ppm |
| Enzyme | bacterial protease, not trypsin | no tryptic ends in any of the five peptides |

The paper is on the right side of all of this, because it synthesised the five sequences and retested them. The arithmetic simply shows the size of the gap that step closes: a mass alone, however precise, leaves over a thousand candidate sequences, and the fragments that narrow them down are the first one or two ions in the ladder.

## How we made the graphs

Both charts and every number above come from `scripts/blog-figures/mussel-antioxidant-peptide-masses.mjs` in fibub's public code. It calls `peptideProps` (formula, monoisotopic and average mass), `mz` (m/z at a given charge), `fragments` (b, y and a ions) and `sites` (where an enzyme cuts) from `src/lib/sci/peptide.ts`, the maths behind the [[peptide-mass-calculator|peptide mass calculator]]. The candidate counts in Figure 2 use the same residue masses, read out of the library one residue at a time, with a plain walk over every composition of four or five residues and the number of arrangements of each.

From the paper: the five sequences, the enzyme, and the 20 ppm and 0.02 Da search tolerances. **Our own**: the two rearrangements PLFLF and FLPLF in Figure 1, which are not peptides anybody has reported, and the choice of the 20 standard amino acids with no modifications for the counting. No measured spectrum, peak list or data table from the paper was used; the paper reports none for these peptides.

## How we test the maths

`npm test` runs `tests/sci.mjs`, which pins the peptide maths against **pyteomics**, the standard Python library for this arithmetic:

- On the tool's made-up example protein and four random proteins, the trypsin, chymotrypsin and Asp-N peptide lists must match pyteomics exactly, and all 369 monoisotopic masses must agree to one part in a billion.
- The average masses and the a, b and y ions of the same peptides must match too.
- The example peptide DFSLQGECK must have a monoisotopic mass of 1082.4703, so [M+H]⁺ is 1083.4775, with b2 at 263.1026 and y1 at 147.1128.
- Trypsin must not cut the GHK-PTC site, because it does not cut before proline, which the test checks on the example protein.
- New with this article: `tests/sci-tools/peptide-mass-calculator.mjs` pins all five of the paper's peptides to the masses and formulas in the table above, checks that LPFLF's y4 ion equals FLPF's [M+H]⁺ to nine decimal places, and checks that trypsin cuts only inside FPRIM.

Residue masses come from each amino acid's chemical formula with exact isotope masses, so the same numbers feed the digest, the fingerprint and the fragment table; there is no separate table of residue masses to drift out of step.

## Check it yourself

On the [[peptide-mass-calculator|peptide mass]] page:

1. In the first card, *Peptide sequence (one-letter codes)*, clear the example and type **LPFLF**. Leave *N-terminus* on **Free (NH₂)** and *C-terminus* on **Free acid (COOH)**.
2. It shows a monoisotopic mass of **635.3683**, an average mass of **635.806**, the formula **C₃₅H₄₉N₅O₆**, and m/z **636.3756** at 1+ and **318.6914** at 2+.
3. Type **FLPF** instead: monoisotopic **522.2842**, [M+H]⁺ **523.2915**.
4. Scroll to *Fragment ions*, put **LPFLF** in *Peptide* and leave *Fragment charge* on **1+**. The table gives b1 **114.0913**, b2 **211.1441**, b3 **358.2125**, b4 **471.2966** and y4 **523.2915**, the same number as FLPF's whole mass in step 3.
5. Change *Peptide* to **PLFLF**. Only b1 moves, to **98.0600**; b3 and b4 do not budge.
6. In the digest card, paste **LPFLFVPPFYFPRIMIMLFP** as a toy protein, set *Enzyme* to **Trypsin (after K, R; not before P)**, *Missed cleavages* to **0** and *Shortest peptide* to **4**. Trypsin finds a single cut, after the R of FPRIM. Switch *Enzyme* to **Chymotrypsin (after F, Y, W; not before P)** and the same 20 residues break into many short pieces.

## What researchers can use it for

- **Check a reported peptide before you cite it**: work out its exact mass and ask whether the paper's precursor tolerance could have separated it from its own rearrangements.
- **Plan an MS/MS check** of a synthesised peptide: print the b and y ladders at 1+ and 2+ and mark the one or two ions that prove the order.
- **Spot fragment-versus-peptide confusion** in a peak list, as with LPFLF and FLPF here, before reporting two peptides where there may be one.
- **Pick the right enzyme** for a reproduction attempt: run the in-silico digest and see whether your enzyme can even produce the peptides you are hunting.
- **Teach why mass is not sequence**, with the candidate count in Figure 2 as the headline, then move to the [[protein-calculator|protein parameter calculator]] for charge and pI and the [[hydropathy-plot]] for the greasy stretches that make a peptide sit in a membrane.

## The fine print

- The masses and ion ladders here are properties of the **sequences the paper reports**, worked out from chemical formulas. They are not a reanalysis: the paper publishes no peak list or spectrum for these five peptides, and we used none.
- The candidate counts use the 20 standard amino acids with free ends and no modifications. Allowing modifications, non-standard residues or other peptide lengths would raise them further.
- Our two rearrangements, PLFLF and FLPLF, are made up for the figure. Nobody has reported them as natural peptides.
- The paper's activity results are percentages of radicals removed at one concentration, not IC50 values, so they cannot be ranked against other papers' IC50 tables.
- Antioxidant activity in a test tube is not a health claim. This is general science education, not advice.
