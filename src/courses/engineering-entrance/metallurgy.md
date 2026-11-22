---
title: 'Metals and metallurgy'
seoTitle: 'Metals and metallurgy: JEE chemistry'
summary: 'Ores and minerals, concentration (gravity, froth flotation, magnetic, leaching), calcination and roasting, reduction and the thermodynamics behind it (Ellingham diagrams), extraction of iron, copper, zinc and aluminium, and refining methods, for KEAM, CUSAT, COMEDK and JEE.'
minutes: 32
updated: 2026-11-22
quiz:
  - q: 'Froth flotation is used mainly to concentrate:'
    choices: ['oxide ores', 'sulphide ores', 'carbonate ores', 'halide ores']
    ans: 1
    why: 'Sulphide particles are wetted by oil (pine oil, xanthates) and carried up by air bubbles, while the earthy gangue sinks with water. Galena (PbS) and copper pyrites are concentrated this way.'
  - q: 'In an Ellingham diagram, the line for 2C + O₂ → 2CO slopes downwards because:'
    choices: ['the reaction is endothermic', 'gas moles increase, so ΔS is positive', 'carbon is a solid', 'CO is a poisonous gas']
    ans: 1
    why: 'One mole of O₂ gives two moles of CO, so entropy rises. ΔG° = ΔH° − TΔS° becomes more negative as T rises: the line falls, which is why carbon becomes a better reducing agent when hot.'
  - q: 'Which metal is refined by the van Arkel method?'
    choices: ['Nickel', 'Copper', 'Zirconium', 'Zinc']
    ans: 2
    why: 'Impure Zr (or Ti) is heated with iodine to form volatile ZrI₄, which decomposes on a hot tungsten filament to deposit pure metal. Nickel uses the Mond process (Ni(CO)₄).'
sources:
  - 'JEE Main and JEE Advanced 2026 syllabi; KEAM, CUSAT CAT and COMEDK chemistry syllabi (metallurgy is not in the current NEET syllabus; check each exam''s latest notice)'
  - 'Standard Gibbs energies of formation for Ellingham lines: NIST-JANAF Thermochemical Tables https://janaf.nist.gov'
  - 'IUPAC Gold Book: ore, mineral, gangue, flux, slag https://goldbook.iupac.org'
---

**Chemistry · Class 12 · about 32 minutes.** By the end you will be able to choose the right concentration, roasting and reduction steps for an ore, read an Ellingham diagram, describe the extraction of iron, copper, zinc and aluminium, and match each refining method to its metal. This chapter is mainly asked in KEAM, CUSAT, COMEDK and JEE Advanced; check your exam's current syllabus.

<div class="bigidea">Metals sit in the ground as compounds, mostly oxides and sulphides, mixed with rock. Extraction is three jobs: get rid of the rock (concentration), turn the compound into an oxide, and take the oxygen away (reduction) with something that wants it more. An Ellingham diagram is the chart that tells you which "something" works and how hot it must be.</div>

## 1. Ores and minerals

A **mineral** is a naturally occurring compound of a metal; an **ore** is a mineral from which the metal can be extracted profitably. The unwanted earthy material is **gangue**.

| Metal | Main ores |
|---|---|
| Aluminium | bauxite AlOₓ(OH)₃₋₂ₓ (often written Al₂O₃·xH₂O), cryolite Na₃AlF₆ |
| Iron | haematite Fe₂O₃, magnetite Fe₃O₄, siderite FeCO₃, iron pyrites FeS₂ |
| Copper | copper pyrites CuFeS₂, copper glance Cu₂S, malachite CuCO₃·Cu(OH)₂, cuprite Cu₂O |
| Zinc | zinc blende ZnS, calamine ZnCO₃, zincite ZnO |
| Lead | galena PbS |

Iron pyrites is not used for iron (too much sulphur). Reactive metals (Na, Mg, Al) occur as compounds only; gold and platinum occur free (native).

## 2. Concentration

- **Hydraulic washing (gravity separation):** heavy ore particles settle, light gangue is washed away (haematite, tin stone).
- **Magnetic separation:** one component is magnetic (magnetite, or wolframite from cassiterite).
- **Froth flotation:** for **sulphide** ores. Oil (pine oil) with **collectors** (xanthates) wets the sulphide, **froth stabilisers** (cresols) hold the foam, and air bubbles carry the ore up. **Depressants** separate two sulphides: NaCN stops ZnS from frothing, so PbS can be floated off first.
- **Leaching:** dissolving the ore chemically. Bauxite in hot NaOH (**Bayer process**): Al₂O₃ dissolves as Na[Al(OH)₄], silica and iron oxide stay behind; CO₂ then precipitates pure Al(OH)₃. Gold and silver in dilute NaCN with air (**cyanide process**), then displaced by zinc: 2[Au(CN)₂]⁻ + Zn → [Zn(CN)₄]²⁻ + 2Au.

## 3. Calcination and roasting

**Calcination:** heating in limited or no air to drive off water or CO₂: ZnCO₃ → ZnO + CO₂; Al₂O₃·xH₂O → Al₂O₃ + xH₂O.

**Roasting:** heating **in air** below the melting point, mainly for sulphides: 2ZnS + 3O₂ → 2ZnO + 2SO₂; 2PbS + 3O₂ → 2PbO + 2SO₂. It also burns off arsenic and sulphur impurities. The SO₂ is used for sulphuric acid.

## 4. Reduction and the Ellingham diagram

For an oxide MO to be reduced by a reducing agent R, the coupled reaction must have negative ΔG°: ΔG°(R → RO) must be **more negative** than ΔG°(M → MO). An **Ellingham diagram** plots ΔG° for forming oxides (per mole of O₂) against temperature.

```math
\Delta G^\circ = \Delta H^\circ - T\,\Delta S^\circ
```

- Most metal-to-oxide lines **slope upward**, because a gas (O₂) is used up, so ΔS° is negative.
- 2C + O₂ → 2CO slopes **downward** (gas doubles, ΔS° positive). So carbon becomes a better reducing agent the hotter it gets, eventually beating almost any metal.
- C + O₂ → CO₂ is nearly flat; 2CO + O₂ → 2CO₂ slopes upward.
- **Any element whose line lies below another's can reduce that other oxide.** Where two lines cross, the reduction becomes possible above (or below) that temperature.
- A sudden change of slope means a phase change (for example, Zn boiling at 1180 K).

<figure class="fig" data-fig="metal-ellingham"><figcaption>Choose an oxide and slide the temperature. The bold lines are the oxide, carbon to CO and CO to CO₂. Where the C → CO line passes below the oxide line, carbon can reduce it. The data are rounded; real lines bend at melting and boiling points.</figcaption></figure>

<div class="meaning">
<dl>
<dt>ΔG°</dt><dd>standard Gibbs energy change for forming the oxide, per mole of O₂ (kJ)</dd>
<dt>ΔH°, ΔS°</dt><dd>enthalpy change (kJ) and entropy change (kJ/K) of that reaction</dd>
<dt>T</dt><dd>temperature in kelvin</dd>
<dt>Gangue, flux, slag</dt><dd>unwanted rock; substance added to remove it; the fusible waste they form (CaO + SiO₂ → CaSiO₃)</dd>
<dt>Physical meaning</dt><dd>The lower a line, the more an element wants oxygen at that temperature. The lower one steals oxygen from the higher one.</dd>
</dl>
</div>

<div class="problem" data-problem="met-ellingham-cross"></div>

**Aluminium cannot be reduced by carbon** at practical temperatures: its line is far below. It is made by **electrolysis** instead. Aluminium itself reduces Cr₂O₃ and Fe₂O₃ (**thermite** process, aluminothermy), since its line is below theirs.

## 5. Extraction of four metals

**Iron (blast furnace).** Charge: haematite, coke and limestone; hot air blown in at the bottom.
- Bottom (about 2000 K): C + O₂ → CO₂, then CO₂ + C → 2CO.
- Middle and top (500 to 900 K): Fe₂O₃ + 3CO → 2Fe + 3CO₂ (reduction by CO in the cooler zone). Lower down, FeO + C → Fe + CO.
- Limestone decomposes to CaO (flux), which removes silica as **slag** CaSiO₃, which floats on the molten iron.
- **Pig iron** (about 4% C) → **cast iron** (3% C, hard, brittle) → **wrought iron** (purest, under 0.2% C) or **steel** (0.2 to 1.5% C plus alloy metals).

**Copper from copper pyrites.** Froth flotation → roasting (FeS → FeO) → smelting with silica: FeO + SiO₂ → FeSiO₃ (slag), leaving **copper matte** (Cu₂S + FeS) → in a Bessemer converter, the rest of the FeS is oxidised and slagged, and **self-reduction** gives copper: 2Cu₂O + Cu₂S → 6Cu + SO₂. Escaping SO₂ leaves a blistered surface: **blister copper** (98%), then refined electrolytically.

**Zinc.** Roast ZnS → ZnO, reduce with coke at about 1673 K: ZnO + C → Zn + CO. Zinc boils at 1180 K, so it distils off and is condensed.

**Aluminium (Hall-Héroult).** Pure Al₂O₃ from the Bayer process is dissolved in molten **cryolite** with some CaF₂ (lowers the melting point from about 2300 K to about 1250 K and improves conductivity). Steel cell lined with carbon (cathode), graphite anodes. Cathode: Al³⁺ + 3e⁻ → Al. Anode: carbon burns to CO and CO₂, so the anodes must be replaced.

<div class="problem" data-problem="met-hall-heroult"></div>

<div class="problem" data-problem="met-ore-iron"></div>

<div class="myth">

**"Roasting and calcination are the same, just with different ores."** Roasting needs **air** and is an oxidation (sulphide to oxide). Calcination is heating with little or no air and is a decomposition (carbonate or hydrate to oxide). The gas given off tells you which: SO₂ from roasting, CO₂ or water from calcination.

</div>

## 6. Refining

| Method | Idea | Used for |
|---|---|---|
| Distillation | metal boils lower than impurities | Zn, Hg |
| Liquation | metal melts lower, flows off | Sn |
| Electrolytic refining | impure anode dissolves, pure metal on cathode; noble metals fall as **anode mud** (Ag, Au, Pt from copper) | Cu, Zn, Al |
| Zone refining | impurities stay in the molten zone as a heater moves along a rod | Si, Ge, Ga (semiconductors) |
| Vapour phase: Mond | Ni + 4CO → Ni(CO)₄ at 330 to 350 K, decomposes at 450 to 470 K | Ni |
| Vapour phase: van Arkel | M + 2I₂ → MI₄, decomposes on a hot W filament | Zr, Ti |
| Chromatography | components move at different rates over an adsorbent | elements in tiny amounts |

<div class="myth">

**"Electrolytic refining dissolves the impurities into the solution, and they are thrown away."** Only the more reactive impurities (Fe, Zn) dissolve and stay in solution. The less reactive ones (silver, gold, platinum) do not dissolve at all: they drop under the anode as anode mud, which is valuable and is processed for these metals.

</div>

<div class="keypoints">

- Froth flotation for sulphides; NaCN depresses ZnS. Leaching: Bayer (bauxite in NaOH), cyanide (Au, Ag).
- Calcination: no air, decomposition. Roasting: air, sulphide to oxide.
- Ellingham: lower line reduces the oxide of a higher line; C → CO slopes down, so carbon gets better when hot.
- Blast furnace: CO reduces Fe₂O₃ at the top; CaO removes SiO₂ as slag.
- Copper: matte, then self-reduction in a converter to blister copper.
- Aluminium: electrolysis of Al₂O₃ in molten cryolite; carbon anodes burn away.
- Refining: zone (Si, Ge), Mond (Ni), van Arkel (Zr, Ti), electrolytic (Cu) with anode mud.

</div>
