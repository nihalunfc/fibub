---
name: Knot and braid diagram drawer
num: 546
shelf: science
section: geometry-and-topology
title: "Braid and knot diagram drawer: braid words, closures, writhe, components and the Alexander polynomial"
summary: "Type a braid word such as σ1 σ2^-1 σ1 σ2^-1 and see the braid drawn, with its closure as a knot or link. Get the crossing count, writhe, permutation, number of components, linking numbers and the Alexander polynomial, worked out exactly from the Burau representation."
status: live
ads: true
order: 546
icon: link
works: offline
updated: 2026-11-09
related: [group-explorer]
sources:
  - "Standard knot theory: Artin's braid group, Alexander's theorem (every knot is a closed braid) and the Burau formula Δ(t) ≐ det(I − B(β)) (1 − t)/(1 − t^n). The braid words of the named knots are standard ones and are mathematical facts."
  - "Checked against sympy, which worked the Alexander polynomials out a different way (unreduced Burau matrix, deleting a row and column), for the named knots and 25 random braids; the named values match the usual knot tables."
flow:
  - { icon: pencil, label: "Braid word" }
  - { icon: link, label: "Closure" }
  - { icon: sigma, label: "Invariants" }
---

## What it does

A **braid** is a set of strands running down the page that cross each other. Any braid can be written as a word in the generators σ1, σ2, …: σi crosses the strands in places i and i + 1, and σi⁻¹ crosses them the other way. Joining the bottom of each strand back to its top gives the **closure**, which is a knot or a link. By Alexander's theorem, every knot can be drawn this way.

This tool reads a braid word and:

- **draws the braid**, crossing by crossing, with the over-strand shown unbroken, and its closure, with each component in its own colour;
- counts the **crossings** and the **writhe** (exponent sum: +1 for each σi, −1 for each σi⁻¹);
- gives the **permutation** of the strands and the **number of components** of the closure (one for each cycle of the permutation);
- for links, the **linking number** of each pair of components;
- works out the **Alexander polynomial** Δ(t) of the closure exactly, plus the knot **determinant** |Δ(−1)| and a lower bound for the genus;
- says which knot in the named table has the same Δ.

## How to use it

1. Choose a named knot, or type your own braid word. Write it as `σ1 σ2^-1`, `s1 s2^-1`, `1 -2` or with letters `a B` (a = σ1, A = σ1⁻¹, b = σ2, …). Powers and brackets work: `(σ1 σ2)^4`.
2. The number of strands is one more than the largest index. Type a larger number to add strands that do not cross (each adds a separate unknot to the closure).
3. Switch the closure and component colours on or off. Download the drawing and facts as an image, PDF or Word file.

## How the Alexander polynomial is found

Each σi is sent to an (n − 1) × (n − 1) matrix with entries in t (the reduced Burau representation), and the braid to the product of these matrices B. Then Δ(t) is det(I − B) × (1 − t)/(1 − t^n), computed with exact whole-number polynomials. It is only defined up to multiplying by ±t^k, so for a knot the page writes it symmetric with Δ(1) = 1, and for a link with lowest power t^0.

## Worked example

The page opens with the figure-eight knot, σ1 σ2⁻¹ σ1 σ2⁻¹ on 3 strands. It has 4 crossings and writhe 0, the permutation is the 3-cycle (1 2 3), so the closure is a knot. Its Alexander polynomial is **−t + 3 − t^-1**, the determinant is 5 and the genus is at least 1. The trefoil σ1^3 gives t − 1 + t^-1 (determinant 3), and the Hopf link σ1^2 has 2 components with linking number 1 and Δ = t − 1. The Borromean rings (σ1 σ2⁻¹)^3 have 3 components, every pair has linking number 0, yet Δ = t^4 − 4t^3 + 6t^2 − 4t + 1, so they are linked.

## Frequently asked questions

**Does the same Alexander polynomial mean the same knot?** No. Different knots can share Δ (for example, some knots have Δ = 1 like the unknot). A match is a hint, not a proof.

**Why is the crossing count not the knot's crossing number?** A braid usually uses more crossings than the simplest diagram of its closure. The figure-eight needs 4 either way, but many knots need extra crossings as a braid.

**Is anything sent anywhere?** No. Everything runs in your browser.
