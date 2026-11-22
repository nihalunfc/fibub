---
title: 'Classification of elements and periodicity: question types and traps'
seoTitle: 'Periodic trends questions for JEE and NEET: types and traps'
summary: 'Every way entrance exams ask about the periodic table: placing elements, ordering radii and isoelectronic ions, ionisation and electron gain exceptions, successive ionisation data, electronegativity scales, oxides and diagonal pairs, each with a method and its trap. Then practise.'
minutes: 24
updated: 2026-11-22
quiz:
  - q: 'Arrange in order of increasing radius: Na⁺, F⁻, Mg²⁺, O²⁻.'
    choices: ['Mg²⁺ < Na⁺ < F⁻ < O²⁻', 'O²⁻ < F⁻ < Na⁺ < Mg²⁺', 'Na⁺ < Mg²⁺ < F⁻ < O²⁻', 'F⁻ < O²⁻ < Mg²⁺ < Na⁺']
    ans: 0
    why: 'All have 10 electrons. More protons pull the same cloud tighter: Mg (12) smallest, O (8) largest.'
  - q: 'Successive ionisation enthalpies of an element are 578, 1817, 2745 and 11 577 kJ/mol. Its group is:'
    choices: ['1', '2', '13', '14']
    ans: 2
    why: 'The big jump comes after the third electron, so it has 3 valence electrons: group 13 (this is aluminium).'
  - q: 'Which pair shows a diagonal relationship?'
    choices: ['Li and Na', 'Be and Al', 'B and Al', 'C and N']
    ans: 1
    why: 'Be (group 2, period 2) and Al (group 13, period 3) sit diagonally and have similar charge-to-size ratios: both form amphoteric oxides and covalent chlorides.'
sources:
  - 'JEE Main, JEE Advanced 2026 and NEET (UG) syllabi: Classification of elements and periodicity in properties; question patterns studied from published papers (no questions copied)'
  - 'NIST Atomic Spectra Database: ionisation energies https://physics.nist.gov/PhysRefData/ASD/ionEnergy.html'
---

**Chemistry · Class 11 · about 24 minutes.** Read [Classification of elements and periodicity](/learn/courses/engineering-entrance/periodic-table/) first. Here are the question types, worked examples and practice.

<div class="bigidea">Almost every periodic table question is an ordering question. Find what changes (shells, nuclear charge, electrons) and you have the general trend; then check the short list of exceptions before you answer.</div>

## The question types

<div class="steps" data-ms="8000">
<div class="step"><b>1. Position from configuration.</b> Period = highest n; group from the block rule. <i>Trap:</i> for p-block add 10 (group 15, not 5); for d-block count (n−1)d plus ns.</div>
<div class="step"><b>2. IUPAC names for Z above 100.</b> Digit roots nil, un, bi, tri, quad, pent, hex, sept, oct, enn + ium. <i>Trap:</i> "enn" before "nil" drops an n (Z = 190 is unennilium); "bi" and "tri" before "ium" drop the i (Z = 112 is ununbium).</div>
<div class="step"><b>3. Ordering radii.</b> Down a group bigger, across smaller. Isoelectronic: more protons, smaller. <i>Trap:</i> lanthanoid contraction makes Zr ≈ Hf and Nb ≈ Ta.</div>
<div class="step"><b>4. Ionisation enthalpy orders.</b> <i>Method:</i> general trend, then exceptions Be > B, N > O, Mg > Al, P > S. <i>Trap:</i> second IE orders: Na⁺ has a neon core, so IE₂ of Na is far above IE₂ of Mg.</div>
<div class="step"><b>5. Successive IE data.</b> Find the biggest jump; the number of electrons before it is the valence. <i>Trap:</i> compare ratios, not differences, when numbers are large.</div>
<div class="step"><b>6. Electron gain enthalpy.</b> Cl > F, S > O (most negative). Noble gases, Be, Mg, N positive or near zero. <i>Trap:</i> the second electron gain is always positive.</div>
<div class="step"><b>7. Electronegativity and ionic character.</b> Pauling from bonds, Mulliken = (IE + EA)/2 in eV, Pauling ≈ Mulliken/2.8. <i>Trap:</i> units: convert kJ/mol to eV by dividing by 96.5.</div>
<div class="step"><b>8. Oxides and diagonal pairs.</b> Basic, amphoteric, acidic, neutral; Li-Mg, Be-Al, B-Si. <i>Trap:</i> CO, NO and N₂O are neutral, not acidic.</div>
<div class="step"><b>9. Effective nuclear charge (JEE Advanced).</b> Slater's 0.35, 0.85, 1.00. <i>Trap:</i> do not count the electron itself in its own shell.</div>
</div>

## Worked examples

**Example 1 (level 3, IE order with exceptions).** Arrange B, C, N, O by first ionisation enthalpy. *Solution.* The general rise gives B < C < N < O, but O dips below N (paired 2p electron). So **B < C < O < N** (801, 1086, 1314, 1402 kJ/mol).

**Example 2 (level 3, second ionisation).** Which has the highest second ionisation enthalpy: Na, Mg, Al or Si? *Solution.* After losing one electron, Na⁺ has the neon configuration; its second electron comes from the 2p core, close to the nucleus. So **Na** has by far the highest IE₂ (about 4562 kJ/mol against 1451 for Mg).

**Example 3 (level 4, Mulliken in kJ/mol).** An element has IE = 1251 kJ/mol and electron affinity 349 kJ/mol. Estimate its Pauling electronegativity. *Solution.* Convert to eV: 1251/96.5 = 12.96 eV and 349/96.5 = 3.62 eV. Mulliken = (12.96 + 3.62)/2 = 8.29. Pauling ≈ 8.29/2.8 = **2.96**, close to chlorine's 3.0.

**Example 4 (level 5, Slater and size).** Why is K⁺ smaller than Cl⁻ though both have 18 electrons? Show with Slater's rules for a 3p electron. *Solution.* Both are [Ne] 3s² 3p⁶. Shielding for one 3p electron: 7 × 0.35 + 8 × 0.85 + 2 × 1.00 = 11.25. Cl⁻: Z<sub>eff</sub> = 17 − 11.25 = 5.75. K⁺: Z<sub>eff</sub> = 19 − 11.25 = **7.75**. The same cloud feels a much stronger pull in K⁺, so it is smaller.

<div class="myth">

**"Noble gases have the largest radius in their period, so they break the trend."** Tables list van der Waals radii for noble gases and covalent radii for the rest, which are not the same kind of size. Compare like with like; most exam questions leave noble gases out for this reason.

</div>

<div class="meaning">
<dl>
<dt>Isoelectronic</dt><dd>same number of electrons (Na⁺, Ne, F⁻ all have 10)</dd>
<dt>1 eV per atom</dt><dd>96.485 kJ/mol</dd>
<dt>Physical meaning</dt><dd>A bigger Z<sub>eff</sub> means a smaller, harder-to-ionise atom that pulls on shared electrons more. Every ordering question reduces to comparing Z<sub>eff</sub> and the shell number.</dd>
</dl>
</div>

## Practise

<div class="qbank" data-bank="entrance-chemistry" data-topics="periodic-table" data-mode="practice"></div>

<div class="keypoints">

- Position: period = highest n; p-block group = 10 + s + p electrons.
- Isoelectronic ions: size falls as the proton number rises.
- IE exceptions: Be > B, N > O, Mg > Al, P > S; Ga ≈ Al.
- A big jump in successive IE gives the number of valence electrons.
- Most negative electron gain: Cl > F and S > O.
- 1 eV/atom = 96.5 kJ/mol; Pauling ≈ Mulliken (eV) / 2.8.
- CO, NO and N₂O are neutral oxides; Al₂O₃, BeO, ZnO are amphoteric.

</div>
