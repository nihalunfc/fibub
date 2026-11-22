---
title: 'Electrochemistry'
seoTitle: 'Electrochemistry: JEE and NEET chemistry'
summary: 'Galvanic cells, electrode potentials and the electrochemical series, the Nernst equation, emf with Gibbs energy and equilibrium constant, conductance and Kohlrausch''s law, Faraday''s laws of electrolysis, products at each electrode, batteries, fuel cells and corrosion, from basics to JEE Advanced depth.'
minutes: 36
updated: 2026-11-22
quiz:
  - q: 'E° for Zn²⁺/Zn is −0.76 V and for Cu²⁺/Cu is +0.34 V. In the Daniell cell, which is the anode?'
    choices: ['Copper, because its E° is higher', 'Zinc, because it is oxidised', 'Whichever is larger', 'The salt bridge']
    ans: 1
    why: 'The electrode with the lower reduction potential gives up electrons more easily. Zinc is oxidised (anode, negative pole); Cu²⁺ is reduced at copper (cathode). E°cell = 0.34 − (−0.76) = 1.10 V.'
  - q: 'On diluting a solution of a weak electrolyte, its molar conductivity:'
    choices: ['falls sharply', 'rises sharply', 'stays the same', 'first rises then falls']
    ans: 1
    why: 'Dilution increases the degree of dissociation α, so many more ions share the same mole of solute. Λm of a weak electrolyte climbs steeply at low concentration; that is why Λ°m is found from Kohlrausch''s law, not by extrapolation.'
  - q: 'How many faradays are needed to deposit 1 mol of Al from Al³⁺?'
    choices: ['1', '2', '3', '6']
    ans: 2
    why: 'Al³⁺ + 3e⁻ → Al. One mole of Al needs 3 mol of electrons, that is 3 F = 289 500 C.'
sources:
  - 'NEET (UG), JEE Main and JEE Advanced 2026 syllabi: Electrochemistry'
  - 'Standard electrode potentials at 298 K: CRC Handbook of Chemistry and Physics, 97th edition (Electrochemical series)'
  - 'CODATA 2018: Faraday constant F = 96 485.332 C/mol (exams round to 96 500) https://physics.nist.gov/cuu/Constants/'
---

**Chemistry · Class 12 · about 36 minutes.** By the end you will be able to write any cell and its emf, use the Nernst equation, link emf to ΔG and K, work with conductivity and Kohlrausch's law, predict electrolysis products, and solve Faraday's-law problems.

<div class="bigidea">A redox reaction moves electrons from one substance to another. Split the two halves into separate beakers, join them with a wire, and the electrons are forced to travel through the wire: that is a battery. Push electrons the other way with a power supply and you drive a reaction that would not go by itself: that is electrolysis.</div>

## 1. Galvanic cells

In the **Daniell cell**, a zinc rod sits in ZnSO₄ and a copper rod in CuSO₄. Zinc atoms lose electrons (oxidation, at the **anode**); the electrons flow through the wire to copper, where Cu²⁺ ions take them (reduction, at the **cathode**). A **salt bridge** (KCl or KNO₃ in agar) lets ions move so that neither beaker builds up charge.

Cell notation puts the anode on the left: **Zn(s) | Zn²⁺(aq) || Cu²⁺(aq) | Cu(s)**. A single line is a phase boundary; the double line is the salt bridge.

Memory aid: **An Ox, Red Cat** (anode oxidation, reduction cathode). In a galvanic cell the anode is **negative**; in an electrolytic cell it is **positive**. Oxidation always happens at the anode in both.

**Try it:** press Run and watch the electrons, the salt-bridge ions and the voltmeter. Then slide [Zn²⁺] and [Cu²⁺] yourself and see how E changes.

<figure class="fig" data-fig="@chem-galvanic-cell"><figcaption>Electrons flow from Zn (anode, −) through the wire to Cu (cathode, +); anions in the salt bridge drift toward the Zn half-cell and cations toward the Cu half-cell. As the cell is used, [Zn²⁺] rises and [Cu²⁺] falls, so E drops.</figcaption></figure>

## 2. Electrode potentials

A single electrode's potential cannot be measured alone, so all are measured against the **standard hydrogen electrode** (SHE: Pt, H₂ at 1 bar, H⁺ at 1 M), given 0 V by agreement. **Standard reduction potentials** E° (298 K, 1 M, 1 bar) form the **electrochemical series**:

| Half-reaction | E° (V) |
|---|---|
| Li⁺ + e⁻ → Li | −3.04 |
| K⁺ + e⁻ → K | −2.93 |
| Zn²⁺ + 2e⁻ → Zn | −0.76 |
| Fe²⁺ + 2e⁻ → Fe | −0.44 |
| 2H⁺ + 2e⁻ → H₂ | 0.00 |
| Cu²⁺ + 2e⁻ → Cu | +0.34 |
| Ag⁺ + e⁻ → Ag | +0.80 |
| Cl₂ + 2e⁻ → 2Cl⁻ | +1.36 |
| F₂ + 2e⁻ → 2F⁻ | +2.87 |

Low E° (top): strong **reducing** agents, easily oxidised. High E° (bottom): strong **oxidising** agents. A metal with negative E° displaces H₂ from dilute acid; a metal displaces any metal below it from its salt solution.

```math
E^\circ_{cell} = E^\circ_{cathode} - E^\circ_{anode}
```

<div class="myth">

**"Doubling a half-reaction doubles its E°."** E° is an **intensive** property, like temperature: 2Ag⁺ + 2e⁻ → 2Ag still has E° = +0.80 V. Only when you **add** half-reactions to make a new half-reaction must you go through ΔG° = −nFE° (Example: Fe³⁺/Fe from Fe³⁺/Fe²⁺ and Fe²⁺/Fe).

</div>

## 3. The Nernst equation

Away from standard conditions, for a reaction with reaction quotient Q:

```math
E = E^\circ - \frac{2.303\,RT}{nF}\log Q = E^\circ - \frac{0.0591}{n}\log Q \quad (298\ \text{K})
```

Pure solids and liquids are left out of Q; gases enter as partial pressures in bar. When the cell runs, Q rises and E falls; at equilibrium **E = 0** and Q = K.

<figure class="fig" data-fig="echem-nernst"><figcaption>Choose a cell and move the two concentrations. The emf follows a straight line in log Q with slope −0.0591/n volts; where it meets zero, Q has become the equilibrium constant.</figcaption></figure>

<div class="meaning">
<dl>
<dt>E°, E</dt><dd>standard and actual cell emf (volts)</dd>
<dt>n</dt><dd>moles of electrons moved in the balanced reaction</dd>
<dt>F</dt><dd>Faraday constant, the charge on one mole of electrons, 96 500 C/mol</dd>
<dt>Q, K</dt><dd>reaction quotient now, and at equilibrium</dd>
<dt>κ, G*</dt><dd>conductivity (S/cm) and cell constant l/A (per cm)</dd>
<dt>Λm, Λ°m</dt><dd>molar conductivity, and its value at infinite dilution (S cm² mol⁻¹)</dd>
<dt>Physical meaning</dt><dd>emf is the "push" per unit charge. Multiply by the charge moved (nF) and you get the energy the reaction can give as work.</dd>
</dl>
</div>

<div class="problem" data-problem="ec-nernst"></div>

**Emf, energy and equilibrium.**

```math
\Delta G^\circ = -nFE^\circ,\qquad \log K = \frac{nE^\circ}{0.0591}
```

A positive E° means ΔG° is negative (spontaneous) and K > 1. For the Daniell cell, log K = 2 × 1.10/0.0591 = 37.2, so K ≈ 10³⁷: the reaction goes essentially to completion.

**Concentration cells** use the same electrode in two solutions: E° = 0 and E = (0.0591/n) log(c_cathode/c_anode). The dilute side is the anode. A hydrogen electrode dipped in a solution of unknown pH gives E = −0.0591 pH against the SHE, the basis of pH measurement.

## 4. Conductance of solutions

The **resistance** R of a solution depends on the cell. Divide out the geometry: **conductivity** κ = (1/R) × (l/A), where l/A is the **cell constant** G*, found by measuring a standard KCl solution. **Molar conductivity** Λm = κ × 1000/c (κ in S/cm, c in mol/L) gives the conductance of all the ions from one mole.

- κ **falls** on dilution (fewer ions per cm³).
- Λm **rises** on dilution. For a **strong** electrolyte it rises slowly and linearly with √c: Λm = Λ°m − A√c (Debye-Hückel-Onsager). For a **weak** electrolyte it rises steeply at low c, because more molecules ionise.

**Kohlrausch's law:** at infinite dilution, each ion contributes independently: Λ°m = ν₊λ°₊ + ν₋λ°₋. It gives Λ°m for weak electrolytes by adding and subtracting strong ones: Λ°(CH₃COOH) = Λ°(CH₃COONa) + Λ°(HCl) − Λ°(NaCl). Then the degree of dissociation is **α = Λm/Λ°m** and Ka = cα²/(1 − α). It also gives the solubility of a sparingly soluble salt: s = κ × 1000/Λ°m.

<div class="problem" data-problem="ec-weak-ka"></div>

## 5. Electrolysis and Faraday's laws

**First law:** the mass deposited is proportional to the charge passed: m = Z × Q, with Q = I × t. **Second law:** for the same charge, masses deposited are in the ratio of equivalent masses (M/n). Together:

```math
m = \frac{M\,I\,t}{n\,F}
```

**Which product forms?** In water, there is a competition. At the cathode, the species with the **higher** reduction potential wins: Cu²⁺ and Ag⁺ beat water, but Na⁺, K⁺, Mg²⁺ and Al³⁺ do not, so H₂ forms instead. At the anode, water (giving O₂) usually beats SO₄²⁻ and NO₃⁻, but concentrated Cl⁻ gives Cl₂ because oxygen needs extra voltage (**overpotential**). Molten NaCl gives Na and Cl₂; brine gives H₂, Cl₂ and NaOH; dilute H₂SO₄ gives H₂ and O₂ in a 2 : 1 volume ratio. A reactive anode (copper in CuSO₄) dissolves instead: the basis of electrorefining.

<div class="problem" data-problem="ec-faraday"></div>

<div class="myth">

**"In electrolysis, the metal ion always goes to the cathode and is deposited."** Only if it is easier to reduce than water. Electrolysis of aqueous NaCl gives no sodium at all: water is reduced to H₂ and OH⁻ at the cathode. Sodium needs molten NaCl.

</div>

## 6. Batteries, fuel cells and corrosion

- **Dry cell** (Leclanché): zinc anode, carbon rod with MnO₂ cathode, NH₄Cl paste; about 1.5 V. **Mercury cell**: Zn(Hg) anode, HgO cathode, steady 1.35 V because no ions in the overall reaction change concentration.
- **Lead storage battery** (rechargeable): Pb anode, PbO₂ cathode, 38% H₂SO₄. Discharge: Pb + PbO₂ + 2H₂SO₄ → 2PbSO₄ + 2H₂O, so the acid density falls. Charging reverses it. **Nickel-cadmium** and **lithium-ion** cells are also rechargeable.
- **H₂-O₂ fuel cell**: hydrogen oxidised at the anode, oxygen reduced at the cathode in hot KOH; product is water; about 70% efficient, used in spacecraft.
- **Corrosion** of iron is a tiny galvanic cell: iron is oxidised where the metal is under strain (anode, Fe → Fe²⁺), and oxygen is reduced at another spot (cathode, O₂ + 4H⁺ + 4e⁻ → 2H₂O). Rust is Fe₂O₃·xH₂O. Salt water speeds it up. Prevent it by paint, by **galvanising** (zinc coat that corrodes first even when scratched) or by **sacrificial anodes** of Mg or Zn.

<div class="keypoints">

- Anode = oxidation always; negative in a galvanic cell, positive in electrolysis.
- E°cell = E°cathode − E°anode; E° is intensive (do not multiply by coefficients).
- Nernst: E = E° − (0.0591/n) log Q at 298 K; E = 0 at equilibrium.
- ΔG° = −nFE°; log K = nE°/0.0591.
- κ falls on dilution, Λm rises; Λm = κ × 1000/c.
- Kohlrausch: Λ°m = sum of ion values; α = Λm/Λ°m for a weak electrolyte.
- Faraday: m = MIt/(nF); the product in water is decided by reduction potentials and overpotential.

</div>
