---
title: 'Chemistry: electrochemistry'
seoTitle: 'Electrochemistry for CUET: cells, Nernst, conductance'
summary: 'Galvanic cells, standard electrode potentials, the Nernst equation, Gibbs energy and emf, conductance and Kohlrausch''s law, electrolysis, batteries and corrosion, with a live cell emf problem.'
minutes: 22
updated: 2026-11-22
quiz:
  - q: 'In a galvanic cell, oxidation happens at the:'
    choices: ['anode', 'cathode', 'salt bridge']
    ans: 0
    why: 'An Ox, Red Cat: oxidation at the anode, reduction at the cathode, in every kind of cell.'
  - q: 'ΔG° and E°cell are related by:'
    choices: ['ΔG° = −nFE°', 'ΔG° = nFE°', 'ΔG° = −RT/E°']
    ans: 0
    why: 'A positive E° gives a negative ΔG°, which means the cell reaction is spontaneous.'
  - q: 'On dilution, the molar conductivity of a weak electrolyte:'
    choices: ['rises sharply', 'falls', 'stays constant']
    ans: 0
    why: 'A weak electrolyte dissociates much more when dilute, so the number of ions per mole rises steeply.'
sources:
  - 'NCERT, Chemistry Part I (Class 12), Electrochemistry'
  - 'National Testing Agency, CUET (UG) Chemistry syllabus https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 7 · about 22 minutes.** By the end you will build a cell from E° values, use the Nernst equation and Faraday's laws, and explain conductance.

<div class="bigidea">A redox reaction moves electrons. Put the oxidation and the reduction in separate beakers joined by a wire and a salt bridge, and the electrons must travel through the wire: that flow is electricity.</div>

**Everyday picture:** a water tank on a roof. The higher the tank (the bigger the difference in E°), the harder the water pushes through the pipe. A cell's voltage is the "height difference" between the two electrodes' tendency to take electrons.

## 1. Cells and electrode potentials

<div class="steps" data-title="Building the Daniell cell">
<div class="step"><b>Anode (−):</b> Zn → Zn²⁺ + 2e⁻. Zinc dissolves.</div>
<div class="step"><b>Cathode (+):</b> Cu²⁺ + 2e⁻ → Cu. Copper plates out.</div>
<div class="step"><b>Salt bridge</b> (KCl or KNO₃ in agar) lets ions move to keep each beaker neutral, completing the circuit.</div>
<div class="step"><b>Notation:</b> Zn | Zn²⁺ (1 M) || Cu²⁺ (1 M) | Cu. Anode on the left.</div>
<div class="step"><b>emf:</b> E° = E°cathode − E°anode = 0.34 − (−0.76) = 1.10 V.</div>
</div>

Standard potentials are measured against the standard hydrogen electrode (0 V). The more positive E°, the stronger the oxidising agent (F₂ +2.87 V); the more negative, the stronger the reducing agent (Li −3.05 V).

<div class="problem" data-problem="cell-emf"></div>

## 2. Nernst equation and Gibbs energy

```math
E = E^\circ - \frac{0.0591}{n}\log Q\ \ (298\ \text{K}) \qquad \Delta G^\circ = -nFE^\circ \qquad \Delta G^\circ = -2.303RT\log K
```

<div class="meaning">

<dl>
<dt>Q</dt><dd>reaction quotient, products over reactants (pure solids left out). For the Daniell cell Q = [Zn²⁺]/[Cu²⁺].</dd>
<dt>F</dt><dd>Faraday constant, 96,500 C per mole of electrons.</dd>
<dt>Physical meaning</dt><dd>as the cell runs, Q grows and E falls; at equilibrium E = 0 and the battery is "dead".</dd>
</dl>

</div>

## 3. Conductance and electrolysis

| Idea | Formula or fact |
|---|---|
| Conductivity κ | κ = G × (l/A), cell constant l/A |
| Molar conductivity | Λ_m = κ × 1000 / C (S cm² mol⁻¹) |
| Strong electrolyte | Λ_m = Λ°_m − A√C (Debye-Hückel-Onsager), falls gently with √C |
| Kohlrausch's law | Λ°_m = sum of the ions' limiting conductivities; gives Λ° for weak electrolytes and α = Λ_m/Λ°_m |
| Faraday's first law | mass deposited m = (M/nF) × I × t |
| Batteries | dry cell, mercury cell (primary); lead storage, Ni-Cd (secondary); H₂-O₂ fuel cell |
| Corrosion | rusting of iron is electrochemical; galvanising (zinc coat) protects it sacrificially |

<div class="myth">

**"E° doubles if you double the reaction."** E° is an intensive property, like temperature. Multiplying a half-equation by 2 changes ΔG° but not E°.

</div>

## 4. Practice

<div class="qbank" data-bank="entrance-chemistry" data-topics="electrochemistry" data-exam="cuet" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- Anode oxidation (−), cathode reduction (+) in a galvanic cell.
- E°cell = E°cathode − E°anode; positive means spontaneous.
- Nernst: E = E° − (0.0591/n) log Q; ΔG° = −nFE°.
- Λ_m = 1000κ/C; Kohlrausch adds ionic conductivities.
- m = MIt/(nF).

</div>
