---
name: Adduct calculator
num: 984
shelf: science
code: T716
section: metabolomics-and-lipidomics
title: "Adduct calculator"
summary: "Type a formula or a neutral monoisotopic mass and get the m/z of 25 common electrospray adducts in positive and negative mode, the ions left after common neutral losses (water, ammonia, CO2, sugars, phosphate and your own), and match a list of observed m/z values within a ppm tolerance. With no molecule, it turns observed m/z values into candidate neutral masses."
status: live
ads: true
order: 1
icon: flask
works: offline
updated: 2026-11-09
related: [isotope-pattern-calculator, molar-mass-calculator, metabolite-volcano-pca, peptide-mass-calculator, unsaturation-calculator, chromatography-calculator]
sources:
  - "Monoisotopic masses of the elements from the fibub element data (isotope masses from NIST/IUPAC via chemical-elements, MIT licence; see NOTICE) and the CODATA 2018 electron mass."
  - "Adduct and neutral loss formulas are standard electrospray chemistry, written by fibub; no adduct tables were copied."
  - "Checked against an independent Python calculation from the same atomic masses (for example glucose [M+Na]+ 203.05261, [M−H]− 179.05611). The example peaks are made up."
flow:
  - { icon: flask, label: "Molecule" }
  - { icon: sigma, label: "Adducts" }
  - { icon: search, label: "Match" }
---

## What it does

In electrospray mass spectrometry a molecule rarely flies as itself. It picks up a proton, a sodium or an ammonium ion in positive mode, or loses a proton or picks up chloride or formate in negative mode, and it often sheds a small neutral piece such as water on the way. One compound can therefore show up as many peaks. This calculator lists them all and tells you which of your peaks they explain.

- **Adducts:** the m/z of 25 common adducts, including [M+H]⁺, [M+Na]⁺, [M+NH₄]⁺, [M+K]⁺, [M+2H]²⁺, [2M+H]⁺, [M−H]⁻, [M+Cl]⁻, [M+HCOO]⁻ and [M−2H]²⁻, with the electron mass handled correctly.
- **Neutral losses:** the ions left after losing water, ammonia, CO, CO₂, formic acid, methanol, acetic acid, phosphoric acid, SO₃, a hexose, a pentose or glucuronic acid, or any formula you type.
- **Matching:** paste or open a peak list and see which ions each peak could be, with the error in ppm.
- **No molecule?** Choose "Nothing" and each observed m/z is turned into the neutral mass it would have as each common adduct, with pairs of peaks that agree on one mass pointed out.

Check the isotope peaks that go with a formula in the [[isotope-pattern-calculator]], and compare features across groups with the [[metabolite-volcano-pca|volcano plot and PCA tool]].

## How to use it

1. Type the **formula** of the neutral molecule (or its monoisotopic mass) and pick the **ion mode**.
2. Tick the **neutral losses** to consider and add any others as formulas.
3. Paste **observed m/z** values (one per line; extra columns are ignored) or open a CSV or Excel file, and set the **tolerance** in ppm (and an optional mDa window).
4. Read the matches, adducts and loss ions. Download the ions or the matches as CSV, or the report as an image, PDF or Word file.

## Worked example

The example molecule is a hexose, **C6H12O6**: the page shows **M = 180.06339 Da**, [M+H]⁺ 181.07066 and [M−H]⁻ 179.05611. Against the made-up peaks, **203.0530** is [M+Na]⁺ at +1.9 ppm, **181.0710** is [M+H]⁺ at +1.9 ppm, **163.0605** is [M+H−H₂O]⁺, the water loss, at +2.5 ppm, and **179.0560** is [M−H]⁻ at −0.6 ppm: all four peaks matched.

Switch "Give it as" to **Nothing** and the same peaks become candidate neutral masses; the page notices that 203.0530 as [M+Na]⁺ and 181.0710 as [M+H]⁺ agree on **M ≈ 180.06375**, a strong hint that both come from one compound.

## Tips

- Sodium and potassium adducts are common with glass vials and buffers; ammonium adducts with ammonium salts in the mobile phase.
- A peak 21.98 above [M+H]⁺ is usually [M+Na]⁺; 17.03 above is [M+NH₄]⁺.
- Use a tolerance that suits your instrument: about 5 ppm for Orbitrap and modern TOF, wider for older instruments.

## FAQ

**Why do two ions have the same m/z?** [M+H−H₂O]⁺ and "[M+H]⁺ minus water" are the same ion, listed once as an adduct and once as a loss.

**Does a match identify my compound?** No. Many formulas share a mass. Check the isotope pattern, retention time and fragmentation against a standard. For study and planning, not a substitute for professional judgement.
