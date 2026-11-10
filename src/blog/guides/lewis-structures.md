---
title: "How to draw Lewis structures, with formal charge and resonance"
summary: "Count valence electrons, place bonds and lone pairs, check octets and formal charges, and find resonance forms, with the sulfate ion worked through step by step."
tools: [lewis-structures, vsepr-shapes, unsaturation-calculator, electron-count-calculator]
updated: 2026-11-10
sources:
  - "Lewis structures, the octet and duet rules, formal charge (valence electrons − lone-pair electrons − bonds), resonance and expanded octets: general chemistry."
  - "Valence electron counts from the periodic table (S 6, O 6, C 4, N 5)."
---

The Lewis structures tool draws the electron dot structure of a molecule or ion and lets you change it. You tap a bond to make it single, double or triple, and the page moves the lone pairs to match, checks every atom's octet and, at Class 11 level, shows the formal charges. It can jump to the best structure, step through resonance forms and handle a molecule you build round one central atom. It is meant for Class 10 and Class 11 students. Once you have the structure, the [[vsepr-shapes]] tool turns it into a 3D shape; to see what a formula says about rings and double bonds, try the [[unsaturation-calculator]]; and for electron counts in metal complexes, see the [[electron-count-calculator]].

## What it is

Atoms bond using their outer, or **valence**, electrons. A **Lewis structure** shows all of them: each line is a shared pair (a bond) and each pair of dots a **lone pair** on one atom. Most atoms are most stable with eight electrons round them, the **octet rule**; hydrogen needs only two.

The method has four steps:

1. Add up the valence electrons of every atom. Add one for each minus charge and take one away for each plus charge.
2. Join the atoms with single bonds, two electrons each.
3. Fill the outer atoms to eight with lone pairs, then put any electrons left on the central atom.
4. If an atom is still short, turn a neighbour's lone pair into an extra bond.

When several structures satisfy the octets, **formal charge** picks the best:

formal charge = V − L − B

where V is the atom's valence electrons, L the electrons in its lone pairs and B the number of bonds it makes (a double bond counts as 2). The formal charges always add up to the charge on the whole molecule or ion. The best structure keeps them as close to zero as possible, with any minus charge on the more electronegative atom.

When the best arrangement can be drawn with the double bond in different places, those drawings are **resonance forms**. The real molecule is a blend, with equal bond lengths.

Atoms from period 3 downwards (P, S, Cl and so on) can hold more than eight electrons, an **expanded octet**, when that lowers the formal charges.

## How to use it

1. Pick a **Level**. Class 10 shows octets only; Class 11 adds formal charges, resonance and the expanded-octet option.
2. Choose a **Molecule or ion** from the list, or **Build your own**: pick the central atom, type the outer atoms separated by spaces (up to six, for example `H H H H`) and set the charge.
3. **Tap a bond** in the drawing to cycle it single → double → triple → single. Atoms that are short of, or over, their octet turn red, and messages list the problems.
4. Press **Best structure** for the answer, **Next resonance form** to step through equal forms, or **All single bonds** to start again.
5. At Class 11, tick **Allow expanded octets** to let P, S, Cl and similar atoms take more than eight electrons.
6. Read the **How to draw one, step by step** card for the working.

## A worked example

Take the **sulfate ion, SO₄²⁻**.

**Count electrons.** S has 6, each O has 6, and the 2− charge adds 2: 6 + 4 × 6 + 2 = **32 electrons**.

**Single bonds first.** Four S–O bonds use 4 × 2 = 8 electrons, leaving 24. Each oxygen takes three lone pairs, using all 24, and sulfur has 8 from its bonds: every atom has an octet.

**Formal charges.**

- S: 6 − 0 − 4 = **+2**
- each O: 6 − 6 − 1 = **−1**

Total: +2 + 4 × (−1) = **−2**, the charge of the ion. With expanded octets off, the tool calls this the best structure.

**Allow expanded octets.** Sulfur is in period 3, so turn two S–O bonds into double bonds. Sulfur now has 2 + 2 + 1 + 1 = 6 bonds and **12 electrons**.

- S: 6 − 0 − 6 = **0**
- each double-bonded O: 6 − 4 − 2 = **0**
- each single-bonded O: 6 − 6 − 1 = **−1**

Total: 0 + 0 + 0 − 1 − 1 = **−2**, still correct, and the charges are smaller. The two double bonds can be chosen from four oxygens in 4 × 3 ÷ 2 = **6 ways**, so there are **6 resonance forms**. Each S–O bond is double in half of them, giving an **average bond order of 1.5**.

Chemists still debate which picture is closer to the truth, so the tool lets you compare both.

## Where it is used

- **Predicting shape.** Counting bonds and lone pairs round the central atom is the first step of VSEPR, which predicts bond angles and whether a molecule is polar.
- **Reaction chemistry.** Formal charges show where a molecule is electron-rich or electron-poor, hinting where it will react.
- **Spotting radicals.** An odd electron count, as in NO₂, flags a reactive radical.

## Common mistakes

- **Forgetting the ion's charge.** Add electrons for a minus charge and remove them for a plus.
- **Counting bond electrons in the formal charge.** Use the number of bonds, not the electrons in them, alongside the lone-pair electrons.
- **Giving period 2 atoms more than eight.** C, N, O and F never expand their octets.
- **Skipping the final check.** Add up the formal charges. If they do not equal the overall charge, a sum is wrong.

## Questions people ask

**Why does boron in BF₃ have only six electrons?** Boron has just three valence electrons and fluorine strongly prefers no double bond, so the structure with an incomplete octet has the smallest formal charges.

**Can I draw a molecule with two central atoms?** Ethene, methanol and a few other chains are in the list, but the build-your-own option only joins outer atoms to one central atom.
