---
title: 'Photosynthesis in higher plants'
seoTitle: 'Photosynthesis in higher plants: NEET biology'
summary: 'The early experiments, chloroplast and pigments, the light reaction (photosystems, the Z scheme, water splitting, cyclic and non-cyclic photophosphorylation, chemiosmosis), the Calvin cycle and its ATP and NADPH cost, the C4 pathway, photorespiration and limiting factors, with live problems and the traps NEET asks most.'
minutes: 36
updated: 2026-11-22
quiz:
  - q: 'The first stable product of CO₂ fixation in the Calvin cycle is:'
    choices: ['oxaloacetic acid', '3-phosphoglyceric acid', 'RuBP', 'malic acid']
    ans: 1
    why: 'RuBisCO joins CO₂ to the 5-carbon RuBP, and the product splits into two molecules of 3-PGA, a 3-carbon acid, which is why this is called the C3 pathway. OAA is the first product in C4 plants.'
  - q: 'Cyclic photophosphorylation produces:'
    choices: ['ATP and NADPH', 'only NADPH', 'only ATP', 'ATP, NADPH and O₂']
    ans: 2
    why: 'Only PS I works; its electrons return to it through the electron transport chain. ATP is made, but no NADPH and no O₂ because water is not split.'
  - q: 'Who showed that the O₂ released in photosynthesis comes from water?'
    choices: ['Joseph Priestley', 'Jan Ingenhousz', 'Cornelis van Niel', 'Julius von Sachs']
    ans: 2
    why: 'Van Niel compared green plants with sulphur bacteria that use H₂S and release sulphur, not O₂, and concluded that the hydrogen donor (water in plants) is oxidised. Priestley found plants restore air; Ingenhousz showed light is needed; Sachs showed glucose is made and stored as starch.'
sources:
  - 'NCERT Biology Class 11 (2023 rationalised), chapter Photosynthesis in higher plants: topics followed, no text copied'
  - 'National Medical Commission, NEET (UG) syllabus: Plant physiology https://www.nmc.org.in'
  - 'Mitchell P. (1961), Coupling of phosphorylation to electron and hydrogen transfer by a chemi-osmotic type of mechanism, Nature 191, 144-148 https://doi.org/10.1038/191144a0'
  - 'NOAA Global Monitoring Laboratory, Trends in atmospheric carbon dioxide (about 420 ppm in 2024) https://gml.noaa.gov/ccgg/trends/'
---

**Biology · Class 11 · about 36 minutes.** By the end you will be able to name the experiments that built our picture of photosynthesis, trace an electron from water to NADPH, count the ATP and NADPH used to make one glucose in C3 and C4 plants, and explain why C4 plants beat C3 plants in hot, bright places.

<div class="bigidea">Photosynthesis runs in two linked stages. In the thylakoids, light splits water, releases O₂ and charges two "batteries", ATP and NADPH. In the stroma, those batteries power the fixing of CO₂ into sugar. Everything else (C4, photorespiration, limiting factors) is about keeping the second stage fed.</div>

## 1. How we found out

| Scientist | Finding |
|---|---|
| Joseph Priestley (1770) | a mint plant restored air that a burning candle or a mouse had "used up" |
| Jan Ingenhousz | only green parts in sunlight did this; aquatic plants gave bubbles in light, not in dark |
| Julius von Sachs (1854) | green parts make glucose, stored as starch; chlorophyll is in chloroplasts |
| T. W. Engelmann | split light with a prism over the alga <i>Cladophora</i>; oxygen-loving bacteria gathered in blue and red light: the first action spectrum |
| Cornelis van Niel | in sulphur bacteria H₂S is the hydrogen donor and sulphur is released; so in plants O₂ comes from water, not CO₂ |

The balanced equation: **6CO₂ + 12H₂O → C₆H₁₂O₆ + 6H₂O + 6O₂** (in light, with chlorophyll). Twelve waters are written so that all six O₂ come from water.

## 2. Where and with what

Photosynthesis happens in chloroplasts, mostly in mesophyll cells. The membranes (**grana** thylakoids) trap light and make ATP and NADPH; the **stroma** holds the enzymes that fix CO₂.

Pigments seen by paper chromatography: **chlorophyll a** (bright or blue-green, the chief pigment at the reaction centres), **chlorophyll b** (yellow-green), **xanthophylls** (yellow) and **carotenoids** (yellow to yellow-orange). The **absorption spectrum** of chlorophyll a peaks in blue and red, and the **action spectrum** (rate of photosynthesis against wavelength) matches it closely. The other pigments, the accessory pigments, absorb more colours and pass the energy on; they also protect chlorophyll a from damage by light.

## 3. The light reaction

Pigments are grouped into **light-harvesting complexes** around a reaction centre of chlorophyll a. In **PS I** the reaction centre absorbs best at 700 nm (**P700**); in **PS II** at 680 nm (**P680**). They are numbered by the order of discovery, not the order in which they work.

<div class="steps" data-ms="8500">
<div class="step"><b>1. PS II fires.</b> Light at 680 nm excites an electron in P680; it jumps to a primary acceptor.</div>
<div class="step"><b>2. Water is split.</b> PS II replaces its lost electrons from water, on the inner (lumen) side of the thylakoid: 2H₂O → 4H⁺ + O₂ + 4e⁻. This is where all the O₂ comes from.</div>
<div class="step"><b>3. Downhill through cytochromes.</b> The electron passes along an electron transport chain to PS I, losing energy that pumps protons into the lumen.</div>
<div class="step"><b>4. PS I fires.</b> Light at 700 nm excites an electron in P700 to a second acceptor (its own hole is filled by the electron from PS II).</div>
<div class="step"><b>5. NADP⁺ reduced.</b> The electron goes downhill again to NADP⁺, which with H⁺ becomes NADPH + H⁺. The up-down-up-down path of energy is called the <b>Z scheme</b>. This one-way flow is <b>non-cyclic photophosphorylation</b>: ATP, NADPH and O₂.</div>
<div class="step"><b>Cyclic photophosphorylation.</b> Only PS I works, in the <b>stroma lamellae</b> (which lack PS II and NADP reductase), or when only light beyond 680 nm is available. The excited electron cycles back to PS I through the chain. Product: ATP only; no NADPH, no O₂.</div>
</div>

<div class="problem" data-problem="phs-water-split"></div>

**Chemiosmosis** (Peter Mitchell). ATP is made because protons pile up in the lumen: (1) water splitting releases H⁺ inside; (2) an electron carrier picks up H⁺ from the stroma and drops it inside as electrons move along; (3) NADP reductase, on the stroma side, uses up H⁺ from the stroma. The gradient drives protons back out through **ATP synthase**, which has a channel part in the membrane (**CF₀**) and a knob in the stroma (**CF₁**) that makes ATP.

Try both kinds of flow and move the light slider: follow the red electrons uphill at each photosystem and downhill between them.

<figure class="fig" data-fig="@bio-z-scheme"><figcaption>Notice what each route makes: non-cyclic gives ATP, NADPH and O₂; cyclic gives only ATP.</figcaption></figure>

## 4. The Calvin cycle (C3 pathway)

Melvin Calvin traced radioactive ¹⁴C in the alga *Chlorella* and found the first product to be **3-phosphoglyceric acid** (3-PGA, three carbons). The CO₂ acceptor is the five-carbon **RuBP**.

1. **Carboxylation:** RuBP + CO₂ → 2 × 3-PGA, by **RuBisCO** (RuBP carboxylase-oxygenase).
2. **Reduction:** 3-PGA is turned into sugar using 2 ATP and 2 NADPH per CO₂.
3. **Regeneration:** RuBP is remade using 1 ATP per CO₂.

So each CO₂ costs **3 ATP + 2 NADPH**, and one glucose (6 CO₂, six turns) costs **18 ATP + 12 NADPH**.

<div class="problem" data-problem="phs-atp-cost"></div>

Step through three turns of the Calvin cycle and count the carbon atoms (each dot is one C).

<div class="steps" data-fig="@bio-calvin-steps">
<div class="step"><b>Fixation.</b> RuBisCO joins each CO₂ to a 5-carbon RuBP: 3 RuBP + 3 CO₂ = 18 carbons.</div>
<div class="step"><b>The first product.</b> The unstable 6-carbon compound splits into 6 molecules of PGA (3 C each).</div>
<div class="step"><b>Reduction.</b> 6 ATP and 6 NADPH turn the 6 PGA into 6 G3P.</div>
<div class="step"><b>The net gain.</b> One G3P leaves the cycle (3 C); five G3P stay.</div>
<div class="step"><b>Regeneration.</b> 3 more ATP rearrange the five G3P into three RuBP. The cycle is ready again.</div>
</div>

## 5. The C4 pathway and photorespiration

**Photorespiration.** RuBisCO can also bind O₂. When O₂ is high relative to CO₂, RuBP + O₂ → one PGA + one phosphoglycolate. No sugar and no ATP are made; ATP is used and CO₂ is released. It is a waste in C3 plants.

**C4 plants** (maize, sorghum, many tropical grasses) avoid it with **Kranz anatomy**: large **bundle sheath cells** around the veins, with many chloroplasts, thick gas-tight walls and no air spaces.

- In **mesophyll** cells (which lack RuBisCO), **PEP carboxylase** joins CO₂ to the 3-carbon **PEP**, making 4-carbon **oxaloacetic acid** (OAA), then malic or aspartic acid.
- These move to the **bundle sheath**, where they release CO₂ and a 3-carbon acid. The CO₂ concentration around RuBisCO is now high, so it acts as a carboxylase and the Calvin cycle runs there.
- The 3-carbon acid returns to the mesophyll and is turned back into PEP, which costs 2 more ATP per CO₂ (30 ATP per glucose in all).

C4 plants have no photorespiration, tolerate higher temperatures and are more productive in hot, bright places.

<div class="myth">

**"C4 plants do not use the Calvin cycle."** They do, in the bundle sheath cells. The C4 cycle is a pump that feeds CO₂ to the Calvin cycle, not a replacement for it.

</div>

Switch between C3 and C4 and slide the temperature: follow the carbon in the leaf diagram and compare the two rate curves.

<figure class="fig" data-fig="@bio-c3-c4"><figcaption>Notice that the C3 rate peaks near 25 °C and falls as photorespiration grows, while the C4 plant keeps rising to about 35 °C because CO₂ is concentrated around RuBisCO.</figcaption></figure>

## 6. Limiting factors

**Blackman's law (1905):** when a process depends on several factors, its rate is set by the factor closest to its minimum. Move light and CO₂ to see which one limits.

<figure class="fig" data-fig="photo-limiting"><figcaption>Rate against CO₂ for C3 and C4 plants (an illustrative model). C4 plants saturate near 360 µL/L; C3 plants keep gaining past 450 µL/L. At low light, light is the limit for both.</figcaption></figure>

- **Light:** rate rises with intensity at first and saturates at about 10% of full sunlight; too much light can damage chlorophyll.
- **CO₂:** the main limiting factor in nature, since air holds only about 0.04%. C3 plants gain from extra CO₂, so greenhouse tomatoes and bell peppers are grown in CO₂-rich air.
- **Temperature:** the stroma reactions are enzymatic and depend on temperature; C4 plants have a higher optimum.
- **Water:** acts indirectly: shortage closes stomata (less CO₂) and wilts leaves.

<div class="meaning">
<dl>
<dt>P680, P700</dt><dd>reaction centres of PS II and PS I</dd>
<dt>RuBP, PEP</dt><dd>CO₂ acceptors: 5-carbon (C3), 3-carbon (C4 mesophyll)</dd>
<dt>RuBisCO</dt><dd>enzyme of the Calvin cycle; binds CO₂ or O₂</dd>
<dt>Kranz anatomy</dt><dd>wreath of bundle sheath cells in C4 leaves</dd>
<dt>CF₀, CF₁</dt><dd>channel and catalytic parts of ATP synthase</dd>
<dt>Physical meaning</dt><dd>Light charges ATP and NADPH; the Calvin cycle spends them. Anything that starves RuBisCO of CO₂ (closed stomata, high O₂) wastes the charge.</dd>
</dl>
</div>

<div class="keypoints">

- Priestley (plants restore air), Ingenhousz (light needed), Sachs (glucose, starch), Engelmann (action spectrum), van Niel (O₂ from water).
- Chlorophyll a is the reaction-centre pigment; accessory pigments widen the range and protect it.
- PS II (P680) splits water and releases O₂; PS I (P700) reduces NADP⁺; Z scheme.
- Non-cyclic: ATP, NADPH, O₂. Cyclic (PS I, stroma lamellae): ATP only.
- Chemiosmosis: protons build up in the lumen; ATP synthase CF₀ and CF₁.
- Calvin cycle: RuBP acceptor, 3-PGA first product; 3 ATP + 2 NADPH per CO₂; 18 ATP + 12 NADPH per glucose.
- C4: PEP acceptor, OAA first product, Kranz anatomy, no photorespiration; 30 ATP per glucose.
- Blackman's law; light saturates near 10% of sunlight; CO₂ is the main limit; C4 saturate near 360 µL/L, C3 beyond 450.

</div>

Next: [question types and traps](/learn/courses/medical-entrance/photosynthesis-questions/).
