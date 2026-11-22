---
title: Electrochemistry
seoTitle: 'Electrochemistry Class 12 notes: Nernst, Faraday, cells'
summary: 'Class 12 Electrochemistry with animations: galvanic cells, E° and Nernst equation, conductance, Kohlrausch law, Faraday laws, batteries and corrosion.'
minutes: 95
updated: 2026-11-22
quiz:
  - q: 'In the cell Zn | Zn²⁺ || Cu²⁺ | Cu, electrons flow:'
    choices: ['from Zn to Cu through the external wire', 'from Cu to Zn through the external wire', 'from Zn to Cu through the salt bridge', 'from Cu to Zn through the salt bridge']
    ans: 0
    why: 'Zinc is oxidised at the anode, releasing electrons that travel through the wire to the copper cathode where Cu²⁺ is reduced. The salt bridge carries ions, never electrons.'
  - q: 'E° for the Daniell cell is 1.10 V (n = 2). If [Zn²⁺] is 100 times [Cu²⁺], the emf at 298 K is about:'
    choices: ['1.16 V', '1.04 V', '1.10 V', '0.00 V']
    ans: 1
    why: 'Q = 100, log Q = 2, E = 1.10 − (0.0592/2) × 2 = 1.10 − 0.059 = 1.04 V.'
  - q: 'How much charge is needed to deposit 1 mole of aluminium from Al³⁺?'
    choices: ['1 F', '2 F', '3 F', '6 F']
    ans: 2
    why: 'Al³⁺ + 3e⁻ → Al needs 3 moles of electrons per mole of metal, which is 3 faradays (3 × 96500 C).'
sources:
  - 'NCERT Class 12 Chemistry, Chapter 2 “Electrochemistry” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard electrode potentials at 298 K: CRC Handbook of Chemistry and Physics, 97th edition, “Electrochemical series”'
  - 'Limiting ionic conductivities (H⁺ 349.6, Na⁺ 50.1, Cl⁻ 76.4–76.6, CH₃COO⁻ 40.9 S cm² mol⁻¹): CRC Handbook of Chemistry and Physics, 97th edition, “Ionic conductivity and diffusion at infinite dilution”'
  - 'Faraday constant 96485 C/mol: CODATA 2018 recommended values (NIST)'
  - 'Lead-acid cell: Linden, D. and Reddy, T. B., Handbook of Batteries, 3rd edition, McGraw-Hill (2002)'
---

**Chemistry · Class 12 · Chapter 2 · about 95 minutes.** By the end you will be able to describe a galvanic cell, work out E° and the cell reaction, use the Nernst equation, relate E° to ΔG and the equilibrium constant, handle conductance and Kohlrausch’s law, solve Faraday’s-law problems, and explain batteries, fuel cells and corrosion.

<div class="bigidea">A redox reaction moves electrons from one substance to another. If you keep the two substances apart and give the electrons a wire to travel through, the moving electrons are an electric current: a <b>battery</b>. Push current in from outside and you drive the reaction the wrong way: <b>electrolysis</b>. Everything in this chapter is that one trade between chemical energy and electrical energy.</div>

## 1. Electrochemical cells and the galvanic cell

Put a zinc rod in copper sulphate solution and zinc dissolves while red copper coats the rod: Zn + Cu²⁺ → Zn²⁺ + Cu. Electrons jump from Zn to Cu²⁺ directly and the energy is lost as heat. A **galvanic (voltaic) cell** keeps the two half-reactions in **separate beakers** so the electrons must go through an outside wire. This is the Daniell cell.

- **Anode:** the electrode where **oxidation** happens (Zn → Zn²⁺ + 2e⁻). It is the negative electrode in a galvanic cell.
- **Cathode:** the electrode where **reduction** happens (Cu²⁺ + 2e⁻ → Cu). It is the positive electrode in a galvanic cell.
- **Salt bridge:** a U-tube of an inert salt (KCl, KNO₃) in gel. It lets ions move to keep each beaker electrically neutral (the left beaker is gaining Zn²⁺, the right losing Cu²⁺) and completes the circuit. Without it the reaction stops almost at once.

An easy memory: **An Ox, Red Cat**: Anode = Oxidation, Reduction = Cathode. Electrons leave the anode, run through the wire, enter the cathode: `$\text{anode}\xrightarrow{e^-}\text{cathode}$`. The conventional current goes the other way.

The shared figure below is a working Daniell cell with moving electrons and ions:

<figure class="fig" data-fig="@chem-galvanic-cell"><figcaption>The Daniell cell running. Electrons flow through the wire from zinc to copper; anions in the salt bridge drift toward the zinc side and cations toward the copper side. Change the concentrations and see the voltage respond.</figcaption></figure>

### Cell notation, read in six steps

<div class="steps" data-fig="c12c-echem-cellsteps">
<div class="step">The cell is written Zn(s) | Zn²⁺(aq) || Cu²⁺(aq) | Cu(s). A single bar is a phase boundary (solid | solution); the double bar is the salt bridge.</div>
<div class="step">By the convention, the <b>left</b> electrode is the anode: Zn → Zn²⁺ + 2e⁻. Zinc loses electrons and dissolves.</div>
<div class="step">The <b>right</b> electrode is the cathode: Cu²⁺ + 2e⁻ → Cu. Copper ions take electrons and plate out.</div>
<div class="step">Electrons run through the wire from Zn to Cu. In the salt bridge ions move: anions toward the anode side, cations toward the cathode side.</div>
<div class="step">Add the two half-reactions. The electrons cancel: Zn + Cu²⁺ → Zn²⁺ + Cu. They are carried, not left over.</div>
<div class="step">The cell voltage is E°cell = E°(right) − E°(left) = 0.34 − (−0.76) = 1.10 V, positive, so the reaction runs on its own.</div>
</div>

Practice the idea in the cell tool: [Galvanic cell tool](/learn/galvanic-cell/).

## 2. Electrode potential and the electrochemical series

Each half-cell has a tendency to gain electrons, its **electrode potential**. Only the **difference** between two can be measured, so a reference is chosen: the **standard hydrogen electrode (SHE)**, a platinum plate in 1 M H⁺ with H₂ gas at 1 bar, defined as **0.00 V**. The **standard electrode (reduction) potential E°** of any half-cell is measured against SHE at 298 K with all solutions at 1 M and gases at 1 bar.

Writing all half-reactions as **reductions** and sorting by E° gives the **electrochemical series**.

- A **more positive** E° means a stronger **oxidising agent** (F₂, Cl₂, Ag⁺): it grabs electrons easily.
- A **more negative** E° means a stronger **reducing agent** (Li, Mg, Zn): it gives electrons easily.
- A metal **above H** in the series (negative E°, such as Zn) displaces hydrogen from dilute acid. A metal below H (Cu, Ag) does not.
- A metal higher up the list displaces a lower one from its salt solution (Zn displaces Cu²⁺).

```math
E^\circ_{cell} = E^\circ_{cathode} - E^\circ_{anode} \qquad\text{(both written as reduction potentials)}
```

<figure class="fig" data-fig="c12c-echem-series"><figcaption>A ladder of standard reduction potentials. Pick any two half-cells with the sliders: the higher one is the cathode, the lower one the anode, and the bar between them is E°cell. If you swap the choice, the answer is the same: the cell always runs in the direction that gives a positive voltage.</figcaption></figure>

<div class="problem" data-problem="c12c-echem-ecell"></div>

<div class="meaning">

<dl>
<dt>E°</dt><dd>standard reduction potential of a half-cell in volts, measured against SHE</dd>
<dt>E°cell &gt; 0</dt><dd>the cell reaction is spontaneous as written</dd>
<dt>Never multiply E° by the coefficients</dt><dd>E° is an intensive property (like temperature): if you double the half-reaction, E° stays the same, only the number of electrons n changes.</dd>
<dt>Physical meaning</dt><dd>E° is the “push” on the electrons per coulomb, like the height of a waterfall. A taller fall (bigger E°cell) pushes more charge through a wire, and doubling the water does not make the fall taller.</dd>
</dl>

</div>

## 3. The Nernst equation, Gibbs energy and equilibrium

The values above are for 1 M solutions. In real cells the concentrations change as the reaction proceeds and the voltage falls. For the reaction `$aA + bB \to cC + dD$` the reaction quotient is `$Q = \dfrac{[C]^c[D]^d}{[A]^a[B]^b}$` (solids and pure liquids are left out), and the **Nernst equation** says

```math
E = E^\circ - \frac{RT}{nF}\ln Q \;=\; E^\circ - \frac{0.0592}{n}\log Q \quad (298\text{ K})
```

<div class="steps" data-fig="c12c-echem-nernststeps">
<div class="step">Thermodynamics gives the free energy change of a reaction in any mixture: ΔG = ΔG° + RT ln Q.</div>
<div class="step">For a cell the electrical work available per mole of reaction is charge × voltage, so ΔG = −nFE and ΔG° = −nFE°. (n is the number of electrons transferred, F = 96485 C/mol.)</div>
<div class="step">Put them together: −nFE = −nFE° + RT ln Q.</div>
<div class="step">Divide by −nF: E = E° − (RT/nF) ln Q. At 298 K, with ln = 2.303 log, RT ln10/F = 0.0592 V, so E = E° − (0.0592/n) log Q.</div>
<div class="step">As the cell runs, products build up and Q grows. E falls until E = 0 and Q = K: the cell is “dead”. Then log K = nE°/0.0592. For the Daniell cell, log K = 2 × 1.10/0.0592 = 37.2, so K ≈ 10³⁷: the reaction goes almost to completion.</div>
</div>

<figure class="fig" data-fig="c12c-echem-nernst"><figcaption>Cell voltage against log Q. Pick a cell, then change the log of the product side and the reactant side. The line falls by 0.0592/n volts for every tenfold increase in Q and reaches zero at the equilibrium constant. The readout also shows ΔG = −nFE.</figcaption></figure>

<div class="problem" data-problem="c12c-echem-nernst"></div>

Three relations connect E°, ΔG° and K:

```math
\Delta G^\circ = -nFE^\circ, \qquad \Delta G^\circ = -RT\ln K = -2.303\,RT\log K, \qquad \log K = \frac{nE^\circ}{0.0592}
```

<div class="problem" data-problem="c12c-echem-gibbs"></div>

Compute E for any concentrations, with the log shown:

<!--fig:tool nernst-calculator-->

<div class="myth">

**“A bigger beaker, or doubling the coefficients, gives a bigger voltage.”** E depends on the **concentrations** (through Q), not on the amount. A huge beaker of 1 M solution and a thimble of 1 M solution give the same voltage; the large one just lasts longer (it has more charge to give).

</div>

## 4. Conductance of electrolytic solutions

Metals conduct by electrons; **electrolytic solutions** conduct by **moving ions**. A solution has a **resistance R** (ohm), measured in a conductivity cell with two electrodes at distance l with area A. Its **conductance** is G = 1/R (siemens, S).

```math
\kappa=\frac{1}{\rho}=G\,\frac{l}{A}=\frac{\text{cell constant}}{R},\qquad \Lambda_m=\frac{\kappa\times1000}{c}\quad(\text{S cm}^2\text{ mol}^{-1},\ c\text{ in mol/L})
```

<div class="meaning">

<dl>
<dt>κ (kappa)</dt><dd>conductivity: conductance of a cube of the solution of 1 cm side (S/cm)</dd>
<dt>l/A</dt><dd>the cell constant (cm⁻¹), found by filling the cell with KCl of known κ</dd>
<dt>Λm</dt><dd>molar conductivity: conductivity of a solution containing 1 mole of electrolyte placed between two electrodes 1 cm apart. It lets you compare electrolytes on equal footing.</dd>
<dt>Physical meaning</dt><dd>κ rises with concentration (more ions per cm³). But each mole of the electrolyte conducts a little <i>less</i> in concentrated solutions, because the ions crowd and get in each other’s way; so Λm rises on dilution.</dd>
</dl>

</div>

<div class="problem" data-problem="c12c-echem-molar"></div>

### Variation with concentration and Kohlrausch’s law

- **Strong electrolytes** (KCl, HCl, NaOH) are fully ionised. Λm rises only slightly on dilution, following `$\Lambda_m=\Lambda_m^\circ - A\sqrt{c}$`: a straight line against √c, whose intercept is the **limiting molar conductivity Λ°m**.
- **Weak electrolytes** (CH₃COOH, NH₄OH) are barely ionised in concentrated solution, and ionise more and more as they are diluted, so Λm shoots up at low concentration. The curve does not cut the axis in a way you can extrapolate.

<figure class="fig" data-fig="c12c-echem-conduct"><figcaption>Molar conductivity against √c. For KCl, a straight line you can extrapolate to Λ°m. For ethanoic acid, a steep climb on dilution because α grows. Move the concentration dot; the weak electrolyte’s degree of ionisation α = Λm/Λ°m appears in the readout.</figcaption></figure>

**Kohlrausch’s law of independent migration of ions:** at infinite dilution each ion contributes its own fixed amount to Λ°m, whatever the other ion is: `$\Lambda_m^\circ=\nu_+\lambda_+^\circ+\nu_-\lambda_-^\circ$`. The law gives Λ°m for a **weak** electrolyte from the values for **strong** ones.

<div class="steps" data-fig="c12c-echem-kohlsteps">
<div class="step">Ions contribute independently: HCl is H⁺ + Cl⁻ and CH₃COOH is H⁺ + CH₃COO⁻. The H⁺ share is the same in both.</div>
<div class="step">Strong electrolytes can be extrapolated to c → 0: Λ°m(HCl) = 426.2, Λ°m(CH₃COONa) = 91.0 and Λ°m(NaCl) = 126.5 S cm² mol⁻¹.</div>
<div class="step">Add and subtract so that Na⁺ and Cl⁻ cancel: Λ°m(CH₃COOH) = 426.2 + 91.0 − 126.5 = 390.7 S cm² mol⁻¹.</div>
<div class="step">Check by adding the single-ion values: 349.6 (H⁺) + 40.9 (CH₃COO⁻) = 390.5 S cm² mol⁻¹. The two agree.</div>
</div>

For a weak electrolyte the degree of dissociation is α = Λm/Λ°m, and then `$K_a = \dfrac{c\alpha^2}{1-\alpha}$`.

<div class="problem" data-problem="c12c-echem-ka"></div>

Use Kohlrausch’s law on your own data here:

<!--fig:tool kohlrausch-law-->

## 5. Electrolytic cells and Faraday’s laws

In an **electrolytic cell** an external source pushes electrons the wrong way, driving a non-spontaneous reaction. Now the **anode is positive** and the **cathode negative** (the names still follow oxidation and reduction). Examples: decomposition of molten NaCl, electroplating, refining copper, and extraction of aluminium from Al₂O₃.

**Faraday’s first law:** the mass of a substance deposited is proportional to the charge passed. **Second law:** for the same charge, the masses of different substances are proportional to their equivalent masses (M/n).

```math
Q=It,\qquad m=\frac{Q}{nF}\times M=\frac{I\,t\,M}{n\,F},\qquad F = 96485\ \text{C mol}^{-1}\approx 96500
```

<div class="meaning">

<dl>
<dt>Q</dt><dd>charge in coulombs; 1 A for 1 s is 1 C</dd>
<dt>F (faraday)</dt><dd>charge of one mole of electrons</dd>
<dt>n</dt><dd>electrons needed per ion: Ag⁺ 1, Cu²⁺ 2, Al³⁺ 3</dd>
<dt>Physical meaning</dt><dd>Each ion needs a fixed number of electrons, like each parcel needing its own postage stamps. Count the electrons (charge) and you count the atoms deposited.</dd>
</dl>

</div>

<figure class="fig" data-fig="c12c-echem-electrolysis"><figcaption>Electrolysis of Cu²⁺, Ag⁺ or molten Al₂O₃. Set the current and time; electrons run in the wire and ions move to the cathode where metal grows. Doubling either I or t doubles the mass; a higher charge on the ion (n) means less metal for the same charge.</figcaption></figure>

<div class="problem" data-problem="c12c-echem-faraday"></div>

<div class="problem" data-problem="c12c-echem-time"></div>

Plan an electroplating job with the real numbers:

<!--fig:tool electroplating-calculator-->

For the large-scale electrolysis of brine into chlorine, hydrogen and sodium hydroxide, see [Chlor-alkali process](/learn/chlor-alkali/).

**Which product forms?** At each electrode the species that is easier to reduce (higher E°) at the cathode, or easier to oxidise at the anode, reacts. In aqueous solutions water competes: Cu²⁺ is reduced before water, but Na⁺ is not, so molten NaCl gives sodium while brine gives hydrogen at the cathode. The electrode material also matters (Cu anode dissolves, inert Pt does not).

## 6. Batteries and fuel cells

A **battery** is one or more galvanic cells in series. **Primary** batteries are used once; **secondary** ones can be recharged.

- **Dry cell (Leclanché):** zinc container as anode, graphite rod as cathode surrounded by MnO₂ and carbon, NH₄Cl + ZnCl₂ paste as electrolyte. About 1.5 V. Used in torches, clocks and remotes. Not rechargeable.
- **Lead storage battery** (car): anode of lead, cathode of lead dioxide on a lead grid, 38 % H₂SO₄. Each cell gives about 2 V, six in series give 12 V. Discharge: Pb + PbO₂ + 2H₂SO₄ → 2PbSO₄ + 2H₂O. Recharging with a dynamo reverses it. The acid’s density falls from about 1.28 to 1.10 g/mL as it discharges, so a hydrometer shows the charge level.
- **Fuel cells** burn a fuel electrochemically without flame, and keep being fed from outside. In the hydrogen–oxygen fuel cell, H₂ is oxidised at the anode, O₂ reduced at the cathode, and the only product is water. Efficiency is about 60–70 %, against about 40 % for a thermal power plant. They power spacecraft and some buses.

<figure class="fig" data-fig="c12c-echem-battery"><figcaption>One cell of a lead storage battery. Choose discharging or charging and drag the charge level: watch the plates coat with PbSO₄ as the acid is used and the density fall, and the electrons reverse direction when charging.</figcaption></figure>

<div class="history">

**Beyond the syllabus (trimmed or lighter in the rationalised book; check your board).** The nickel–cadmium cell (rechargeable, about 1.4 V) and the mercury cell are no longer examined in detail. The lithium-ion battery of your phone works like a secondary cell with Li⁺ moving between graphite and a metal-oxide electrode, and is the battery of electric vehicles.

</div>

## 7. Corrosion

**Corrosion** is the slow eating away of a metal by air and moisture; the rusting of iron is a tiny galvanic cell. In a drop of water on iron, one spot acts as the **anode** (Fe → Fe²⁺ + 2e⁻) and another, with oxygen available, as the **cathode** (O₂ + 4H⁺ + 4e⁻ → 2H₂O). The iron carries the electrons between them and the water is the electrolyte. Fe²⁺ is oxidised further to Fe³⁺ and appears as hydrated iron(III) oxide, Fe₂O₃·xH₂O, the rust.

<figure class="fig" data-fig="c12c-echem-corrosion"><figcaption>A drop of water on iron. Compare bare iron, salty water (a better electrolyte, faster rusting), iron with a zinc coat (zinc is oxidised instead of iron) and painted iron (no contact, no cell).</figcaption></figure>

**Prevention.** Keep out water and air by painting, oiling or coating. **Galvanising** covers iron with zinc: even if scratched, zinc (E° = −0.76 V, lower than iron’s −0.44 V) is oxidised first, which is **sacrificial protection**. Blocks of magnesium bolted to ship hulls and buried pipelines do the same job. Tinplate protects only while unbroken: if tin is scratched, iron (the more active metal) corrodes faster.

<div class="keypoints">

- Galvanic cell: anode = oxidation (−), cathode = reduction (+); electrons go anode → cathode through the wire; salt bridge keeps the solutions neutral.
- E°cell = E°(cathode) − E°(anode), both as reduction potentials; do not multiply E° by coefficients. E°cell > 0 means spontaneous.
- Nernst: E = E° − (0.0592/n) log Q at 298 K. At equilibrium E = 0 and log K = nE°/0.0592.
- ΔG° = −nFE° = −RT ln K. F = 96485 C/mol.
- κ = (l/A)/R; Λm = 1000 κ/c. Strong electrolytes: Λm = Λ°m − A√c. Weak: Λm rises steeply on dilution; α = Λm/Λ°m.
- Kohlrausch: Λ°m = Σ ν λ°; weak-electrolyte values come from strong ones.
- Faraday: m = I t M / (n F). Charge for 1 mol of an ion with charge n is n faradays.
- Batteries: dry cell (primary), lead storage (secondary, 2 V per cell, density of acid falls on discharge), fuel cells (continuous fuel, water product).
- Corrosion is a galvanic cell on the metal. Zinc coating protects by sacrificing itself.

</div>

Going further for JEE: the exam-level problems (concentration cells, conductance titration, electrolysis with several metals, equilibrium constants from E°) are in [Electrochemistry (JEE)](/learn/courses/engineering-entrance/electrochemistry/); NEET asks the same chemistry, so the same lesson serves both.
