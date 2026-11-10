---
title: "Oxidation numbers and redox balancing, step by step"
summary: "How to find the oxidation number of every atom in a formula or ion, and how to balance a redox equation in acid or base by the half-reaction method. Worked example: sulfite and dichromate."
tools: [oxidation-number, formula-writer, equation-balancer, galvanic-cell, nernst-calculator]
updated: 2026-11-10
sources:
  - "Rules for assigning oxidation numbers and the half-reaction (ion-electron) method: standard general chemistry, Class 11 level, following IUPAC usage."
---

Redox chemistry is all about electrons moving from one atom to another, and oxidation numbers are the bookkeeping that lets you follow them. The [[oxidation-number]] finder does both halves of the job: type a formula or ion and it gives every element's oxidation number with the rule behind it, then pick two half-reactions and it balances the full equation in acidic or basic solution, one step at a time. It suits Class 11 and first-year chemistry. If you are unsure how to write the formula in the first place, start with the [[formula-writer]]; for equations that are not redox, use the [[equation-balancer]]; and to see a redox pair produce a voltage, try the [[galvanic-cell]].

## What it is

An **oxidation number** is a pretend charge: the charge an atom would carry if the more electron-hungry atom in every bond kept both shared electrons. Only for a simple ion such as Na⁺ is it a real charge.

The numbers are set by a short list of rules, used from the top down:

- An uncombined element, such as O₂ or Zn, is 0.
- A one-element ion takes its own charge.
- Fluorine is −1. Group 1 metals are +1, group 2 metals +2, aluminium +3.
- Hydrogen is +1, but −1 when bonded only to a metal (a metal hydride).
- Oxygen is −2, apart from peroxides (−1), superoxides (−½) and OF₂ (+2).
- Everything else is found from the sum: the oxidation numbers of all atoms add up to the overall charge.

For one unknown element: (sum of known values) + n × x = q, where n is its number of atoms, x its oxidation number and q the charge on the whole formula.

**Oxidation** is a rise in oxidation number (electrons lost). **Reduction** is a fall (electrons gained). The substance that is oxidised is the **reducing agent**; the one that is reduced is the **oxidising agent**. In a balanced equation, the electrons lost always equal the electrons gained.

To balance a half-reaction in acid you fix the main element first, then add water to fix oxygen, then H⁺ to fix hydrogen, then electrons to fix the charge. In base you then add enough OH⁻ to both sides to turn every H⁺ into water.

## How to use it

1. Type a formula in the **Formula** box, writing charges with a caret (SO4^2-, Fe^3+), or tap one of the example chips such as KMnO₄ or Fe₃O₄.
2. Read the oxidation number printed above each symbol, then the table that gives the atom count and the reason for each value.
3. Look at the **Check** line, which adds the values up and shows they equal the charge. Open the rules list to see which ones were used, in bold.
4. In **Balance a redox reaction**, choose a reducing agent and an oxidising agent from the two lists.
5. Press **Acidic solution** or **Basic solution**. Each half shows its numbered steps and multiplier, then the final equation with an atom and charge check.
6. Try the five questions in **Check yourself**, and press **New questions** for a fresh set.

## A worked example

Sulfite ions are oxidised to sulfate by acidified dichromate. Here is the full working.

**Oxidation numbers.** In Cr₂O₇²⁻, oxygen is −2 and the charge is −2:
2x + 7 × (−2) = −2, so 2x = 12 and x = **+6** for chromium.

In SO₃²⁻: x + 3 × (−2) = −2, so sulfur is **+4**. In SO₄²⁻: x + 4 × (−2) = −2, so sulfur is **+6**.

**Oxidation half.** Sulfur rises from +4 to +6, losing 2 electrons.
SO₃²⁻ + H₂O → SO₄²⁻ + 2H⁺ + 2e⁻

**Reduction half.** Each chromium falls from +6 to +3. There are two chromium atoms, so 6 electrons are gained.
Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O

**Match the electrons.** Multiply the sulfite half by 3 (6 electrons each), add, and cancel the 6 H⁺ and 3 H₂O that appear on both sides:

3SO₃²⁻ + Cr₂O₇²⁻ + 8H⁺ → 3SO₄²⁻ + 2Cr³⁺ + 4H₂O

**Check.** Charge on the left: 3 × (−2) + (−2) + 8 = 0. On the right: 3 × (−2) + 2 × (+3) = 0. Oxygen: 9 + 7 = 16 on the left, 12 + 4 = 16 on the right.

Switch to **Basic solution** and the tool adds OH⁻ to soak up the H⁺. The result is

3SO₃²⁻ + Cr₂O₇²⁻ + 4H₂O → 3SO₄²⁻ + 2Cr³⁺ + 8OH⁻

with a charge of −8 on each side. The 3 : 1 ratio is unchanged, because the electrons fix it.

## Where it is used

- **Titrations.** Permanganate and dichromate titrations depend on the mole ratio in the balanced equation.
- **Batteries and corrosion.** Each electrode is a half-reaction. Knowing which atom is oxidised tells you which side is the negative terminal, and the [[nernst-calculator]] then gives the voltage.

## Common mistakes

1. **Forgetting the atom count.** In Cr₂O₇²⁻ the six electrons belong to two chromium atoms. Multiply each atom's change by how many of those atoms there are.
2. **Setting the sum to zero for an ion.** The total equals the charge on the ion, so for SO₄²⁻ it is −2, not 0.
3. **Treating oxygen as −2 every time.** In H₂O₂ oxygen is −1.
4. **Adding electrons to the wrong side.** In an oxidation half the electrons appear on the products side; in a reduction half they appear with the reactants.
5. **Leaving H⁺ in a basic equation.** If the reaction is in base, the final equation should show OH⁻ and water, with no H⁺ left over.

## Questions people ask

**Can an oxidation number be a fraction?** Yes, as an average. In Fe₃O₄ the three iron atoms share +8, so the average is +8/3. The real atoms are a mix of +2 and +3.

**Is a reaction redox if nothing changes charge?** No. If no oxidation number changes, it is not a redox reaction. Neutralising an acid with a base is a common example.
