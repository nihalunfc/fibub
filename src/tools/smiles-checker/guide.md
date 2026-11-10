---
name: Drug-likeness
num: 212
shelf: science
section: medicinal-chemistry
title: "Drug-likeness"
summary: "Paste a SMILES string (or a whole list) and get the molecular formula, average and monoisotopic mass, H-bond donors and acceptors, rotatable bonds, rings and charge, with a pass or fail for Lipinski's rule of five and Veber's rules. Nothing is uploaded."
status: live
ads: false
order: 212
icon: flask
works: offline
updated: 2026-11-09
related: [molar-mass-calculator, molecule-viewer, unsaturation-calculator, isotope-pattern-calculator]
sources:
  - "Rule definitions as stated in Lipinski et al., Adv. Drug Deliv. Rev. 23 (1997) 3–25 (rule of five) and Veber et al., J. Med. Chem. 45 (2002) 2615–2623 (rotatable bonds and polar surface area or H-bond count). Only the rules' limits are used; no data from either paper."
  - "SMILES read as in the OpenSMILES specification (organic subset, brackets, charges, isotopes, aromatic atoms, ring closures, branches, dots). Atomic weights and isotope masses are general chemistry facts (IUPAC, AME), from the site's periodic table."
  - "Checked against RDKit (open source, BSD licence) on the example list and further molecules: formula, average and monoisotopic mass, heavy atoms, rings (smallest set of smallest rings), NH + OH count, N + O count, charge and rotatable bonds with the same definition: 4,422 checks on 67 molecules and 268 rewritings of them, none failed."
  - "The example peptide is made up for this tool; the other examples are well-known medicines whose structures are general chemistry facts."
flow:
  - { icon: pencil, label: "SMILES" }
  - { icon: calculator, label: "Properties" }
  - { icon: check, label: "Rules" }
  - { icon: table, label: "CSV" }
---

## What it does

Medicinal chemists use a few quick counts to judge whether a molecule could become a pill that the body absorbs. This checker reads a molecule written as **SMILES** (the one-line text format that most chemistry programs can copy and paste) and works out:

- the **molecular formula**, the **average mass** (from standard atomic weights) and the **monoisotopic mass** (from the most common isotope of each element, for mass spectrometry);
- the number of **heavy atoms** (everything but hydrogen), **rings** and the **formal charge**;
- **H-bond donors**, counted as Lipinski did: the number of hydrogens on nitrogen and oxygen (an NH₂ counts 2);
- **H-bond acceptors**, also as Lipinski did: every nitrogen and oxygen atom;
- **rotatable bonds**, as Veber defined them: single bonds outside rings between two atoms that each have another heavy neighbour, leaving out amide C–N bonds;
- a pass or fail for **Lipinski's rule of five** (molecular weight up to 500, logP up to 5, at most 5 donors and 10 acceptors; one rule may be broken) and **Veber's rules** (at most 10 rotatable bonds, and a polar surface area up to 140 Å² or at most 12 donors and acceptors together).

It does **not** work out logP, polar surface area or PAINS alerts: all three need published tables of atom or fragment contributions, which we do not copy. If you have values from another program, type them under Options and they join the rules. For the mass of any formula, use the [[molar-mass-calculator]]; to look at a molecule in 3D, the [[molecule-viewer]]; for rings plus double bonds, the [[unsaturation-calculator]].

## How to use it

1. Type or paste a SMILES string, such as `CC(=O)Oc1ccccc1C(=O)O`, and a name if you like. Results appear as you type.
2. Read the properties and the two pills: green is a pass, amber a pass with one Lipinski rule broken, red a fail.
3. For many molecules, paste a list (one per line: SMILES, then a space, tab or comma, then a name) or open a .smi file. Download the table as CSV, or the single result as an image, PDF or Word file.

## Options

- **Use only the largest part**: a salt such as `[Na+].[O-]C(=O)c1ccccc1O` has two parts. With this on (the default), the sodium ion is dropped and the salicylate is checked, as is usual for drug-likeness. Turn it off to count every part.
- **Count amide C–N bonds**: Veber left them out because they hardly turn. Tick this to count them.
- **Your logP** and **your polar surface area**: optional values from elsewhere. With a polar surface area, Veber's second rule uses it instead of the donor plus acceptor count.

## Worked example

Press **Use the example (aspirin)**. The SMILES `CC(=O)Oc1ccccc1C(=O)O` gives C₉H₈O₄, an average mass of 180.159 g/mol and a monoisotopic mass of 180.0423. Aspirin has 13 heavy atoms (21 with hydrogens), 1 ring, 1 H-bond donor (the acid O–H), 4 acceptors (the four oxygens) and 3 rotatable bonds. All rules hold: Lipinski passes with 0 of 3 broken (logP was not given) and Veber with 0 of 2.

Now press **Use the example list**. Of its 7 molecules, 6 pass both rule sets. The sodium ion of sodium salicylate is left out, so its formula reads C₇H₅O₃⁻. The made-up peptide GSDKY (C₂₄H₃₆N₆O₁₀, 568.58 g/mol) breaks three Lipinski rules (mass over 500, 12 donors, 16 acceptors) and both Veber rules (18 rotatable bonds, and 28 donors plus acceptors), which is why most peptides are not taken as tablets.

## Tips

- Aromatic atoms are written in lower case (`c1ccccc1` is benzene). A pyrrole-type nitrogen with a hydrogen must be written `[nH]`.
- Hydrogens are added by themselves outside brackets. Inside brackets, write them: `[NH4+]`, `[13CH3]`.
- Stereo marks (`@`, `/`, `\`) are read and ignored; they do not change any of these counts.
- The rules are rules of thumb for drugs taken by mouth. Many good medicines (antibiotics, natural products, anything carried by a transporter) break them.

## FAQ

**Why do my donor and acceptor numbers differ from another program?** Programs use different definitions. Lipinski's own counts (NH + OH, and N + O) are simple and generous; newer definitions leave out amide nitrogens or count only some hydrogens.

**Why no logP?** Every common logP method relies on a large published table of fitted contributions. Rather than copy one, the tool lets you type the value your own software gives.

**Is my molecule uploaded?** No. Everything runs in your browser and keeps working offline.
