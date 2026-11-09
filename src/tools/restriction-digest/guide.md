---
name: Restriction digest simulator
num: 168
shelf: science
section: molecular-biology
title: "Restriction digest simulator: find cut sites, fragment sizes, plasmid map and a virtual agarose gel"
summary: "Paste a plasmid or other DNA, pick classic enzymes or type your own sites, and see every cut on both strands, the fragment sizes for single and combined digests, a circular or linear map, single cutters for cloning, and a virtual gel next to your ladder."
status: live
ads: true
order: 16
icon: scissors
works: offline
updated: 2026-11-09
related: [sequence-tools, ligation-calculator, primer-checker, nucleic-acid-concentration]
sources:
  - "Recognition sites of the 12 built-in enzymes (EcoRI, BamHI, HindIII, XhoI, SalI, XbaI, PstI, KpnI, SmaI, EcoRV, NcoI, NotI) are textbook facts. No enzyme database or supplier catalogue is copied; other enzymes are typed in by the user."
  - "Site search on both strands with IUPAC letters, cut positions, fragments for linear and circular DNA, and the log-linear gel model written by fibub. Cut positions checked in the tests against Biopython 1.88 Restriction."
  - "The example plasmid is random made-up sequence, and the default ladder is a made-up evenly spread one."
flow:
  - { icon: file, label: "Sequence" }
  - { icon: scissors, label: "Enzymes" }
  - { icon: table, label: "Fragments" }
  - { icon: eye, label: "Gel" }
---

## What it does

Before you cut a plasmid, it helps to know which enzymes cut once, what sizes you will see, and how the bands will sit against your ladder. This page simulates a restriction digest in your browser:

- **Sites on both strands.** Every recognition site, read on the strand you pasted and on its complement, including sites that cross the origin of a circular plasmid. IUPAC letters such as N, R and Y work.
- **Fragments.** Sizes, start and end, and which enzyme made each end, for a linear or circular molecule.
- **Single cutters.** Enzymes that cut exactly once, the usual choice for opening a vector.
- **Map.** A circular or linear map with every cut labelled.
- **Virtual gel.** A ladder lane, a lane for each enzyme on its own and one for all together, with brighter bands where more DNA runs.

## How to use it

1. **Sequence.** Paste DNA or open a FASTA file, and choose circular (plasmid) or linear.
2. **Enzymes.** Tick any of the 12 classic enzymes, or type your own, one per line: a name, a space and the site with ^ where the top strand is cut, for example `MyEnz GT^MKAC`. If the site reads differently on the two strands, add _ where the bottom strand is cut (`CC^TCA_GC`).
3. **Gel.** Type your ladder's band sizes and choose the lanes.
4. **Read the result.** The summary gives the fragment sizes of the combined digest; the table and the downloads list every fragment.

Positions are "after base": a cut at 381 falls between bases 381 and 382 of the strand you pasted.

## Worked example

The made-up example is a 3,000 bp circular plasmid. EcoRI cuts it twice (after bases 381 and 1,801), BamHI once (after 1,151) and HindIII once (after 2,211). Together they give **4 fragments: 1,170, 770, 650 and 410 bp**. On its own, EcoRI gives two pieces (1,580 and 1,420 bp), while BamHI or HindIII alone simply linearises the plasmid at 3,000 bp. Tick XhoI and the tool reports that it does not cut; tick SalI and it joins the single cutters.

## Good to know

- The gel is a simple model: real migration depends on the agarose percentage, buffer and voltage, and uncut supercoiled plasmid runs faster than its size suggests.
- Methylation (Dam, Dcm, CpG) can block some enzymes; the simulator ignores it.
- Star activity, partial digests and enzymes that cut outside their site are not modelled.

## FAQ

**Why only 12 built-in enzymes?** Enzyme lists come from curated databases and catalogues. The tool keeps a few classic ones and lets you add any other from your supplier's sheet.

**Does it read GenBank files?** Not yet; save the sequence as FASTA.

**Is my sequence uploaded?** No. Everything runs in your browser.
