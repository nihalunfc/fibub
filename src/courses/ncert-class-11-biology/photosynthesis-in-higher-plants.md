---
title: Photosynthesis in Higher Plants
seoTitle: 'Photosynthesis Class 11 notes: light reactions, Calvin'
summary: 'Class 11 Photosynthesis in Higher Plants: pigments, light reactions, Calvin cycle, C4 pathway, photorespiration and limiting factors, with step players.'
minutes: 80
updated: 2026-11-22
quiz:
  - q: 'How many ATP and NADPH are needed to make one glucose molecule in a C3 plant?'
    choices: ['6 ATP and 6 NADPH', '12 ATP and 18 NADPH', '18 ATP and 12 NADPH', '30 ATP and 12 NADPH']
    ans: 2
    why: 'Each CO₂ fixed costs 3 ATP and 2 NADPH. Glucose needs 6 CO₂, so 18 ATP and 12 NADPH.'
  - q: 'The first stable product of CO₂ fixation in a C4 plant is:'
    choices: ['3-phosphoglyceric acid', 'oxaloacetic acid', 'ribulose bisphosphate', 'glucose']
    ans: 1
    why: 'PEP carboxylase joins CO₂ to the 3-carbon PEP, giving the 4-carbon oxaloacetic acid, which is why the pathway is called C4.'
  - q: 'Where do the light reactions take place?'
    choices: ['stroma', 'thylakoid membranes of the grana', 'outer membrane', 'cytoplasm']
    ans: 1
    why: 'Photosystems, electron carriers and ATP synthase sit in the thylakoid membranes; the Calvin cycle is in the stroma.'
sources:
  - 'NCERT Class 11 Biology, Chapter 11 “Photosynthesis in Higher Plants” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Calvin, M. and Benson, A. A., The path of carbon in photosynthesis, Science 109, 140-141 (1949)'
  - 'Engelmann, T. W., Botanische Zeitung 40, 419-426 (1882), on the action spectrum of photosynthesis'
  - 'Hill, R., Oxygen produced by isolated chloroplasts, Proceedings of the Royal Society B 127, 192-210 (1939)'
  - 'Mitchell, P., Coupling of phosphorylation to electron and hydrogen transfer by a chemi-osmotic type of mechanism, Nature 191, 144-148 (1961)'
  - 'Sage, R. F., The evolution of C4 photosynthesis, New Phytologist 161, 341-370 (2004)'
---

**Biology · Class 11 · Chapter 11 · about 80 minutes.** By the end you will be able to say where and how a plant turns light, water and CO₂ into sugar, follow the light reactions and the Calvin cycle step by step, explain the C4 pathway and photorespiration, and predict what limits photosynthesis on a given day.

<div class="bigidea">Photosynthesis is a two-part factory. In the first part (light reactions) chlorophyll catches light and uses it to split water, making O₂, ATP and NADPH. In the second part (the Calvin cycle) that ATP and NADPH are spent to turn CO₂ into sugar. Everything that eats, including you, runs on sugar made this way.</div>

## 1. What do we know about photosynthesis?

Early experiments pieced the story together one clue at a time.

<div class="history">

- **1770, Joseph Priestley:** a candle burning in a closed jar goes out, and a mouse dies; but with a green mint plant in the jar the air is "restored".
- **1779, Jan Ingenhousz:** the restoring needs **sunlight** and only the **green parts** do it.
- **1854, Julius von Sachs:** the green parts make **glucose, stored as starch**.
- **1882, T. W. Engelmann:** split white light with a prism over the alga *Spirogyra*; oxygen-loving bacteria gathered in the blue and red regions: the **action spectrum**.
- **1930s, C. B. van Niel:** in purple bacteria photosynthesis uses H₂S, not water; so the O₂ of plants must come from **water**. Later experiments with heavy oxygen (¹⁸O) proved it.
- **1950s, Melvin Calvin:** traced radioactive ¹⁴CO₂ in *Chlorella* and found the path of carbon: the **Calvin cycle**.

</div>

The overall equation (with O₂ coming from water):

```math
6\,CO_2 + 12\,H_2O \xrightarrow{\text{light, chlorophyll}} C_6H_{12}O_6 + 6\,O_2 + 6\,H_2O
```

<div class="myth">

**“The oxygen a plant releases comes from the CO₂.”** It comes from the **water**. The carbon of CO₂ ends up in sugar, and the oxygen atoms of CO₂ end up in the sugar and in the new water.

</div>

## 2. Where does it happen?

Photosynthesis happens in green parts, mainly the **mesophyll** cells of leaves, in the organelle called the **chloroplast**. Step down from the leaf to the chloroplast and see which stage goes where.

<div class="steps" data-fig="c11b-photo-site">
<div class="step">The leaf: light, CO₂ through stomata, water from the vein.</div>
<div class="step">A mesophyll cell with many chloroplasts.</div>
<div class="step">Inside the chloroplast: double membrane, grana of thylakoids, stroma.</div>
<div class="step">Light reactions in the thylakoids; Calvin cycle in the stroma.</div>
</div>

## 3. Pigments involved

Leaf pigments can be separated by **paper chromatography**: each pigment moves a different distance on the paper and forms its own coloured band. From the top down: **carotenoids** (yellow to orange), **xanthophylls** (yellow), **chlorophyll a** (bright blue-green, the main pigment) and **chlorophyll b** (yellow-green).

Only chlorophyll a takes part directly in the light reactions; the others are **accessory pigments** that pass light energy to it and protect the leaf from too much light. A pigment absorbs some colours and reflects others, so the leaf looks green because chlorophyll reflects green. Move the wavelength and compare the **absorption** of each pigment with the **action spectrum** of photosynthesis.

<figure class="fig" data-fig="c11b-photo-spectrum"><figcaption>Chlorophylls absorb in the blue-violet and the red. The action spectrum (dashed) follows the total absorption, which is what Engelmann's bacteria showed by crowding at blue and red light.</figcaption></figure>

Explore the pigments in the [pigment spectra](/learn/pigment-spectra/) tool.

## 4. The light reactions

Chlorophyll molecules are organised with the accessory pigments into **photosystems** in the thylakoid membrane. Each has an antenna of hundreds of pigment molecules that pass the energy to one special chlorophyll a, the **reaction centre**. In **photosystem II (PS II)** the reaction centre absorbs best at 680 nm (**P680**); in **photosystem I (PS I)** at 700 nm (**P700**).

**Non-cyclic photophosphorylation** (the Z scheme):

1. Light excites PS II; its electrons leave P680 and go to an acceptor.
2. The lost electrons are replaced by electrons from **water**: 2H₂O → 4H⁺ + O₂ + 4e⁻. This is the **splitting of water**, and the only place O₂ is made. It is done by the oxygen-evolving complex on the lumen side, which needs Mn²⁺, Ca²⁺ and Cl⁻.
3. The electrons run downhill through plastoquinone, the **cytochrome b6f** complex and plastocyanin to PS I. Their energy pumps H⁺ into the thylakoid lumen.
4. Light excites PS I; its electrons go uphill again, through ferredoxin, and **NADP⁺ reductase** gives them to NADP⁺ to make **NADPH**.

Plot energy against the path and the electrons make a "Z". Play it.

<figure class="fig" data-fig="@bio-z-scheme"><figcaption>Non-cyclic flow makes ATP, NADPH and O₂. In cyclic flow only PS I works: the electron returns to the chain, and only ATP is made, with no NADPH and no O₂.</figcaption></figure>

**Cyclic photophosphorylation** uses only PS I; the excited electron goes round the chain and back to P700. It makes ATP but **no NADPH and no O₂**. It happens when the Calvin cycle needs extra ATP, and in the stroma lamellae, where there is no PS II.

### Chemiosmosis: how ATP is made

ATP is made by **ATP synthase** (an enzyme with a CF₀ channel in the membrane and a CF₁ head in the stroma). The idea, due to Peter Mitchell, is that a **proton gradient** is a store of energy. Three things build it: water splitting releases H⁺ inside the lumen, the electron carriers pump H⁺ in, and NADP⁺ reduction removes H⁺ from the stroma. When H⁺ flow back out through ATP synthase, the enzyme makes ATP.

<div class="steps" data-fig="c11b-photo-chemi">
<div class="step"><b>Water is split</b> at PS II; H⁺ go into the lumen.</div>
<div class="step"><b>Electrons pump protons</b> as they flow down through the b6f complex.</div>
<div class="step"><b>PS I</b> gives the electrons to NADP⁺: NADPH is made.</div>
<div class="step"><b>ATP synthase</b> lets H⁺ out and makes ATP.</div>
</div>

The [Z-scheme tool](/learn/z-scheme/) lets you change the light on each photosystem.

## 5. Where are the products used? The Calvin cycle

The ATP and NADPH made in the light reactions never leave the chloroplast; they drive the **Calvin cycle** (the **C3 pathway**) in the stroma. It does not need light directly, but it stops soon after the light is off because ATP and NADPH run out. It has three stages:

1. **Carboxylation:** the enzyme **RuBisCO** (ribulose bisphosphate carboxylase-oxygenase, the most abundant enzyme on Earth) joins CO₂ to the 5-carbon sugar **RuBP**, giving two molecules of the 3-carbon **3-phosphoglyceric acid (PGA)**. This is why the first stable product is a three-carbon acid.
2. **Reduction:** PGA is changed to glyceraldehyde 3-phosphate (G3P, a sugar) using **2 ATP and 2 NADPH** per CO₂.
3. **Regeneration:** most of the G3P is used to rebuild RuBP, with **1 ATP** per CO₂.

<div class="steps" data-fig="@bio-calvin-steps">
<div class="step"><b>Fixation.</b> RuBisCO joins each CO₂ to a 5-carbon RuBP: 3 RuBP + 3 CO₂ = 18 carbons.</div>
<div class="step"><b>The first product.</b> The unstable 6-carbon compounds split into 6 molecules of PGA (3 C each).</div>
<div class="step"><b>Reduction.</b> 6 ATP and 6 NADPH turn the 6 PGA into 6 G3P.</div>
<div class="step"><b>The net gain.</b> One G3P leaves the cycle (3 C); five G3P stay.</div>
<div class="step"><b>Regeneration.</b> 3 more ATP rearrange the five G3P into three RuBP. The cycle is ready again.</div>
</div>

<div class="meaning">

<dl>
<dt>3 ATP + 2 NADPH</dt><dd>the cost of fixing one CO₂ (2 ATP + 2 NADPH for reduction, 1 ATP for regeneration)</dd>
<dt>18 ATP + 12 NADPH</dt><dd>the cost of one 6-carbon glucose (6 turns of the cycle, 6 CO₂)</dd>
<dt>Physical meaning</dt><dd>Think of a rice mill that must be paid in electricity (ATP) and workers (NADPH) for every grain it polishes. The light reactions are the power station that supplies both.</dd>
</dl>

</div>

Slide the number of CO₂ molecules fixed and compare a C3 and a C4 plant.

<figure class="fig" data-fig="c11b-photo-tally"><figcaption>Fix 6 CO₂ and read off the bars: 18 ATP, 12 NADPH and one glucose. Switch to C4 and the ATP bar grows, because the C4 shuttle costs 2 more ATP for every CO₂.</figcaption></figure>

<div class="problem" data-problem="c11b-photo-atp"></div>

<div class="problem" data-problem="c11b-photo-co2mass"></div>

<!--fig:tool calvin-c4-->

## 6. The C4 pathway

Plants of hot, dry places (maize, sugarcane, sorghum) have a different leaf anatomy: the vascular bundles are surrounded by a ring of large **bundle sheath cells** (**Kranz anatomy**, "wreath"). The two cell types share the work:

1. In the **mesophyll cell**, the enzyme **PEP carboxylase** (which has no affinity for O₂) joins CO₂ to the 3-carbon **PEP**, giving the 4-carbon **oxaloacetic acid (OAA)**; this is the first product, so the pathway is called C4. OAA becomes malic or aspartic acid.
2. The acid moves into the bundle sheath cell and is broken down, **releasing CO₂** right next to RuBisCO and giving back pyruvate.
3. The Calvin cycle runs in the bundle sheath cells, with CO₂ raised several-fold. Pyruvate goes back to the mesophyll and is turned into PEP again (this costs 2 ATP).

Only the bundle sheath cells of C4 plants have the Calvin cycle; the mesophyll cells make OAA.

<figure class="fig" data-fig="@bio-c3-c4"><figcaption>The C4 leaf concentrates CO₂ around RuBisCO. At high temperature the C4 curve keeps rising while the C3 curve falls, which is why maize beats wheat in a hot field.</figcaption></figure>

| Feature | C3 plants | C4 plants |
|---|---|---|
| Examples | wheat, rice, potato | maize, sugarcane, sorghum |
| Leaf anatomy | no Kranz anatomy | Kranz anatomy |
| First product | PGA (3 C) | OAA (4 C) |
| CO₂ acceptor | RuBP | PEP (then RuBP in the sheath) |
| Photorespiration | present, wasteful | almost none |
| Best temperature | 20 to 25 °C | 30 to 45 °C |
| ATP per CO₂ | 3 | 5 |

## 7. Photorespiration

RuBisCO has two jobs. When CO₂ is plentiful it **carboxylates** RuBP. When O₂ is high and CO₂ is low, it adds **O₂** to RuBP (**oxygenation**). The result is one PGA and one 2-carbon compound, which goes through the chloroplast, peroxisome and mitochondrion and ends with CO₂ **released**. No sugar and no ATP are made, and energy is spent: it is a loss. This is **photorespiration**, a problem in C3 plants in hot, dry weather, when stomata close and the inner CO₂ falls.

<figure class="fig" data-fig="c11b-photo-rubisco"><figcaption>Of 100 RuBisCO reactions, the red ones fix carbon and the amber ones waste it. Raise the O₂ or the temperature, and then press C4.</figcaption></figure>

<div class="myth">

**“Photorespiration is respiration done in light.”** It has nothing to do with making ATP; it is a wasteful side reaction of RuBisCO that uses O₂, releases CO₂ and **costs** the plant energy.

</div>

## 8. Factors affecting photosynthesis

F. F. Blackman's **law of limiting factors** (1905): when several factors control a process, its rate is set by the **one nearest its minimum**. Increasing another factor will not help.

- **Light:** rate rises with intensity and then levels off; very strong light can damage chlorophyll (**photo-oxidation**). It is the CO₂ that limits at high light.
- **CO₂:** the air has about 0.04 % (400 ppm). Rate rises with CO₂ for C3 plants up to about 0.05 to 0.1 %; C4 plants saturate at about 360 ppm. Growers of tomatoes and bell peppers in greenhouses add CO₂ to get a better yield.
- **Temperature:** the dark (enzyme) reactions are temperature-sensitive: the best temperature is about 25 °C for C3 and 30 to 45 °C for C4 plants.
- **Water:** water stress closes the stomata and cuts the CO₂ entering, and wilting leaves also lose their working enzymes.

<figure class="fig" data-fig="c11b-photo-limit"><figcaption>Raise the light with CO₂ low: the rate hits a ceiling set by CO₂. Raise CO₂ and the ceiling lifts until temperature takes over.</figcaption></figure>

<div class="problem" data-problem="c11b-photo-wavelength"></div>

Fit your own light and CO₂ readings with the [photosynthesis curve fitter](/science/photosynthesis-curve-fitter/), and run the full simulation here.

<!--fig:tool photosynthesis-lab-->

<div class="problem" data-problem="c11b-photo-c4"></div>

<div class="keypoints">

- Priestley (air restored), Ingenhousz (light, green parts), Sachs (starch), Engelmann (action spectrum), van Niel (O₂ from water), Calvin (path of carbon).
- Chloroplast: grana (thylakoids) for the light reactions; stroma for the Calvin cycle. Pigments: chlorophyll a (main), chlorophyll b, xanthophylls, carotenoids.
- Light reactions: PS II (P680) splits water (O₂, H⁺), electrons flow PS II → b6f → PS I (P700) → NADP⁺ → NADPH; H⁺ gradient drives ATP synthase (chemiosmosis). Cyclic flow: ATP only.
- Calvin cycle: carboxylation (RuBisCO, RuBP + CO₂ → 2 PGA), reduction, regeneration. 3 ATP + 2 NADPH per CO₂; 18 ATP + 12 NADPH per glucose.
- C4 (Kranz anatomy): PEP carboxylase makes OAA in the mesophyll; CO₂ is released in the bundle sheath; 5 ATP per CO₂ but no photorespiration, suiting hot, dry climates.
- Photorespiration: RuBisCO takes up O₂; CO₂ is lost and energy wasted; absent in C4 plants.
- Blackman: the factor in shortest supply limits the rate (light, CO₂, temperature, water).

</div>

Going further for JEE/NEET: the exam-level version of this chapter is [Photosynthesis for NEET](/learn/courses/medical-entrance/photosynthesis/).
