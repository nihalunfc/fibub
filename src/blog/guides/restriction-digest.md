---
title: "Restriction digests: from cut sites to fragments and a gel"
summary: "How restriction enzymes cut DNA at short sites, how to count the pieces from one or more enzymes in a plasmid, and how to predict the gel bands."
tools: [restriction-digest]
updated: 2026-11-10
sources:
  - "Restriction enzyme recognition sites and cut positions (for example EcoRI G^AATTC and BamHI G^GATCC) are standard textbook facts. The 2,400 bp plasmid and its cut positions are made up for this article."
---

Before you pour a gel, it helps to know how many pieces an enzyme will make from your DNA, how big they are and whether they will separate. The [[restriction-digest]] simulator works this out in your browser: paste a plasmid, choose enzymes, and it lists every cut, every fragment and a virtual gel. Check the sequence first with [[sequence-tools]], and after the digest size the real bands with [[gel-band-sizer|the gel band size estimator]] and join the pieces with [[ligation-calculator]].

## What it is

A restriction enzyme cuts DNA only where it finds a short **recognition site**. EcoRI, for example, recognises GAATTC. The notation G^AATTC means the enzyme cuts the top strand after the G. Most sites read the same on both strands, so the tool searches both.

Positions are "after base": a cut at 600 falls between bases 600 and 601 of the strand you pasted.

Counting fragments depends on the shape of the DNA:

- **Linear DNA** with *n* cuts gives *n* + 1 pieces.
- **Circular DNA** (a plasmid) with *n* cuts gives *n* pieces. Each piece is the gap to the next cut, and the last piece wraps round the origin.

For a circular molecule of length L with cuts at positions p₁ < p₂ < … < pₙ:

fragment between cut i and cut i + 1 = pᵢ₊₁ − pᵢ, and the wrap-around piece = L − pₙ + p₁

The two lengths always add up to L, which is a useful check.

## How to use it

1. **Sequence.** Paste DNA or open a FASTA file, and choose *Circular (plasmid)* or *Linear*.
2. **Enzymes.** Tick any of the 12 classic enzymes, or type your own, one per line, as a name, a space and the site with ^ where the top strand is cut, for example `MyEnz GT^MKAC`. If the two strands are cut at different places, add _ where the bottom strand is cut.
3. **Gel.** Type your ladder's band sizes in bp, and choose *Each enzyme alone, then all together* or *All together only*.
4. **Read the summary.** It gives the fragment sizes for the combined digest. The table lists every fragment with its start, its end and the enzyme that made each end.
5. **Keep the numbers.** Use *Download fragments (CSV)* or the report downloads for your lab book.

## A worked example

Take a made-up 2,400 bp circular plasmid. EcoRI cuts it after bases 600 and 1,900. BamHI cuts after 1,000 and HindIII after 2,200.

- **EcoRI alone:** two cuts, so two pieces. From 600 to 1,900 is 1,900 − 600 = **1,300 bp**. The wrap-around piece is 2,400 − 1,900 + 600 = **1,100 bp**.
- **BamHI alone** or **HindIII alone:** one cut, so the plasmid opens into one linear piece of **2,400 bp**. A single cutter like this is a common choice for opening a vector before you insert a gene.
- **EcoRI and BamHI together:** cuts at 600, 1,000 and 1,900 give **400, 900 and 1,100 bp**. The total is still 2,400 bp.
- **All three together:** cuts at 600, 1,000, 1,900 and 2,200 give **400, 900, 300 and 800 bp**. Add them up and you get 2,400 bp again.

The tool takes a sequence, not a list of positions, so the positions above are what it would report for a plasmid with sites in those places.

On a gel, the 300 bp and 400 bp pieces are close, so a ladder with a band near 300 and 400 bp helps you tell them apart.

## Where it is used

- **Cloning.** You open a vector with one or two enzymes that cut once in the place you want, then join your insert to it.
- **Mapping an unknown plasmid.** Several enzymes, each cutting a few times, give a pattern of sizes that points to where the sites lie.
- **Checking a construct.** After a ligation or mini-prep, the sizes on the gel show whether the insert went in.
- **Teaching.** Gel analysis is a standard school and university biology practical.
- **Genetic testing.** Restriction fragment length polymorphism (RFLP) tests were built on the same idea.

## Common mistakes

1. **Forgetting the plasmid is circular.** Choose *Circular*. For a linear molecule the wrap-around piece does not exist, so the sizes are wrong.
2. **Confusing a site with a cut.** The site is the recognition sequence; the cut is a point inside it. When you type your own enzyme, put the ^ inside the site, at the point where the top strand is cut.
3. **Expecting every site to be cut in the lab.** Chemical tags on the DNA (methylation) can stop some enzymes from cutting. The screen does not know about them, so read your supplier's notes before you trust a prediction.
4. **Trusting one band for two fragments.** Two pieces of nearly the same size run as a single band. Check the sum of all the pieces against the plasmid length.
5. **Reading the virtual gel as a photograph.** It places bands by a simple rule: the distance falls steadily with the logarithm of the size. A real gel also depends on the agarose percentage and the run, and an uncut, twisted plasmid does not run at its length.

## Questions people ask

**Why does my real gel show bands that the prediction does not?** Common reasons are an incomplete digest (some DNA left uncut), extra cutting at near-matching sites under harsh conditions, or the wrong sequence on screen. The simulator assumes every site is cut fully and only at the exact site you gave.

**Can I use an enzyme that is not in the list?** Yes. Type it on its own line, with its site and the ^ position from your supplier's data sheet.
