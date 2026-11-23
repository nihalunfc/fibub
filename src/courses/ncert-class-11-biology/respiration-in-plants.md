---
title: Respiration in Plants
seoTitle: 'Respiration in Plants Class 11 notes: glycolysis, Krebs'
summary: 'Class 11 Respiration in Plants: glycolysis, fermentation, Krebs cycle, electron transport, ATP balance sheet, amphibolic pathway and RQ, with step players.'
minutes: 75
updated: 2026-11-22
quiz:
  - q: 'The net gain of ATP in glycolysis from one glucose molecule is:'
    choices: ['2', '4', '8', '38']
    ans: 0
    why: 'Glycolysis uses 2 ATP and makes 4, so the net gain is 2 (plus 2 NADH).'
  - q: 'The respiratory quotient (RQ) when fat is the substrate is about:'
    choices: ['0.7', '1.0', '1.5', 'infinite']
    ans: 0
    why: 'Fats contain little oxygen, so more O₂ is used than CO₂ is released: RQ about 0.7.'
  - q: 'Where does the Krebs cycle take place?'
    choices: ['cytoplasm', 'mitochondrial matrix', 'inner mitochondrial membrane', 'stroma of chloroplast']
    ans: 1
    why: 'The enzymes of the Krebs cycle lie in the matrix (one, succinate dehydrogenase, is in the inner membrane).'
sources:
  - 'NCERT Class 11 Biology, Chapter 12 “Respiration in Plants” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Krebs, H. A. and Johnson, W. A., The role of citric acid in intermediate metabolism in animal tissues, Enzymologia 4, 148-156 (1937)'
  - 'Embden, G., Meyerhof, O. and Parnas, J. K., glycolytic pathway (1930s)'
  - 'Mitchell, P., Nature 191, 144-148 (1961), chemiosmotic coupling'
  - 'Hinkle, P. C., P/O ratios of mitochondrial oxidative phosphorylation, Biochimica et Biophysica Acta 1706, 1-11 (2005)'
---

**Biology · Class 11 · Chapter 12 · about 75 minutes.** By the end you will be able to follow glucose through glycolysis, the Krebs cycle and the electron transport chain, count the ATP, compare aerobic respiration with fermentation, explain why respiration is called amphibolic and calculate a respiratory quotient.

<div class="bigidea">A cell cannot use the energy in glucose directly, as a car cannot run on a log of wood. Respiration unlocks it slowly, in many small steps, passing the energy to the carrier ATP, the "rupee note" of the cell that can be spent anywhere. Plants do this in every living cell, all day and all night.</div>

## 1. Do plants breathe?

Plants have no lungs, but every cell takes in O₂ and gives out CO₂. Gases move by **diffusion**: through the **stomata** in leaves, through **lenticels** in woody stems, and straight into the root cells from the air spaces of the soil. Because each part needs far less O₂ than an animal's body does, and because a plant has air spaces between cells and a short diffusion distance, this is enough. Roots flooded by monsoon rain, however, may run short of O₂.

**Respiration** is the breakdown of food (usually glucose) to release energy, which is stored in ATP. Photosynthesis makes sugar in green cells during the day; respiration burns it in all cells all the time.

```math
C_6H_{12}O_6 + 6\,O_2 \rightarrow 6\,CO_2 + 6\,H_2O + \text{energy (about 2870 kJ/mol)}
```

Not all of that energy is lost as heat: about 40 % is caught in ATP. Burning is done in **steps** (like a ball rolling down a staircase, not dropped off a cliff) so the energy comes out in packets small enough to catch. Follow the steps below.

<div class="steps" data-fig="c11b-resp-where">
<div class="step">Glucose, the fuel.</div>
<div class="step">Glycolysis in the cytoplasm.</div>
<div class="step">Pyruvate becomes acetyl CoA.</div>
<div class="step">The Krebs cycle in the matrix.</div>
<div class="step">Electron transport on the inner membrane.</div>
</div>

<div class="myth">

**“Plants respire only at night, animals all the time.”** Plants respire day and night. In daytime photosynthesis is faster and uses the CO₂, so we notice only the O₂ released. Net gas exchange differs, but respiration never stops.

</div>

## 2. Glycolysis

**Glycolysis** (Embden-Meyerhof-Parnas pathway) happens in the **cytoplasm** of every cell, in all organisms. A 6-carbon glucose is changed into two 3-carbon **pyruvic acid** molecules by ten reactions, none of which needs oxygen. It has two phases:

1. **Investment:** glucose is phosphorylated by 2 ATP (to glucose 6-phosphate and fructose 1,6-bisphosphate), then split into two 3-carbon sugars.
2. **Pay-off:** each 3-carbon sugar is oxidised (NAD⁺ → NADH) and passes its phosphates to ADP, making 2 ATP each.

```math
\text{glucose} + 2\,NAD^+ + 2\,ADP + 2\,P_i \rightarrow 2\,\text{pyruvate} + 2\,NADH + 2\,ATP \text{ (net)}
```

<div class="steps" data-fig="c11b-resp-glyco">
<div class="step">One glucose in the cytoplasm.</div>
<div class="step">ATP is spent on glucose.</div>
<div class="step">A second ATP is spent: investment phase done.</div>
<div class="step">The 6-carbon sugar splits in two; NADH forms.</div>
<div class="step">4 ATP are made: net 2 ATP, 2 NADH, 2 pyruvate.</div>
</div>

<div class="problem" data-problem="c11b-resp-glyco-count"></div>

## 3. Fermentation: when there is no oxygen

Without O₂ the NADH from glycolysis cannot give up its electrons to the chain. NAD⁺ must be remade or glycolysis stops, so pyruvate is used as the acceptor. This is **fermentation** (anaerobic respiration).

- **Alcoholic fermentation** (yeast; also plant roots in flooded soil): pyruvate → acetaldehyde + CO₂ → **ethanol**. Used for bread, idli and dosa batter, and wine and beer.
- **Lactic acid fermentation** (bacteria that curdle milk into dahi; our muscles in a sprint): pyruvate → **lactic acid**, no CO₂.

Both give only **2 ATP** per glucose, less than 7 % of the glucose energy, and the products (ethanol, lactic acid) still hold plenty of energy. Yeast stops when ethanol reaches about 13 %, since it poisons them. Muscle that makes lactic acid aches when it builds up.

<figure class="fig" data-fig="@bio-yeast-fermentation"><figcaption>Yeast in a sugar solution. Warm the flask or add sugar and the bubbles of CO₂ speed up; very high temperatures kill the enzymes.</figcaption></figure>

<figure class="fig" data-fig="c11b-resp-fate"><figcaption>Lower the oxygen and watch the pyruvate switch routes. At 21 % oxygen almost everything goes through the mitochondria for about 38 ATP.</figcaption></figure>

## 4. Aerobic respiration

If O₂ is available, pyruvate enters the **mitochondria**. The mitochondrion has an outer membrane, a folded inner membrane (cristae) and a fluid **matrix**.

**Link reaction.** Pyruvate loses a CO₂ and joins coenzyme A to form **acetyl CoA** (2 C); NAD⁺ becomes NADH. It is the gate to the Krebs cycle.

### The Krebs (citric acid, TCA) cycle

Hans Krebs worked out this cycle in 1937. Acetyl CoA (2 C) joins **oxaloacetic acid (OAA, 4 C)** to make **citric acid** (6 C). Through a series of steps two CO₂ are released and OAA is regenerated.

<div class="steps" data-fig="c11b-resp-krebs">
<div class="step">Acetyl CoA meets oxaloacetic acid.</div>
<div class="step">Citric acid (6 C) forms.</div>
<div class="step">First CO₂ lost; first NADH.</div>
<div class="step">Second CO₂ lost; second NADH.</div>
<div class="step">One ATP and FADH₂.</div>
<div class="step">Malic acid to OAA; third NADH. Cycle closed.</div>
</div>

Per turn: **3 NADH, 1 FADH₂, 1 ATP (GTP), 2 CO₂**. One glucose makes two acetyl CoA, so the cycle runs **twice**: 6 NADH, 2 FADH₂, 2 ATP, 4 CO₂. Counting the link reaction, all 6 carbons of glucose have left as 6 CO₂.

<div class="problem" data-problem="c11b-resp-krebs-turns"></div>

### Electron transport and oxidative phosphorylation

The NADH and FADH₂ made so far carry electrons. On the **inner membrane** are four complexes (I to IV) and mobile carriers (ubiquinone, cytochrome c). The steps:

1. NADH gives its electrons to complex I; FADH₂ gives its electrons to complex II (so FADH₂ enters later and yields less ATP).
2. The electrons pass downhill from complex to complex, and three of them pump H⁺ out of the matrix into the space between the membranes.
3. At complex IV (cytochrome c oxidase) the electrons are given to **O₂**, which combines with H⁺ to make **water**. This is why we need O₂: it is the final electron acceptor.
4. The H⁺ gradient drives **ATP synthase** (complex V), which makes ATP: **oxidative phosphorylation**, by the same chemiosmosis idea as in the chloroplast.

<figure class="fig" data-fig="@bio-etc-chain"><figcaption>Cyanide stops complex IV, so the chain jams and ATP making stops. An uncoupler lets H⁺ leak, so the chain runs fast but little ATP is made.</figcaption></figure>

<!--fig:tool respiration-pathways-->

<div class="meaning">

<dl>
<dt>NADH, FADH₂</dt><dd>carriers holding high-energy electrons (like full water cans)</dd>
<dt>ATP synthase</dt><dd>a rotating enzyme in the inner membrane, a tiny turbine turned by H⁺ flowing through it</dd>
<dt>Physical meaning</dt><dd>Think of a dam. The chain pumps water uphill (H⁺ across the membrane); letting it run back down through the turbine generates the electricity (ATP).</dd>
</dl>

</div>

## 5. The respiratory balance sheet

Using the textbook values of **3 ATP per NADH** and **2 ATP per FADH₂**, one glucose gives, in a eukaryotic cell:

| Stage | Direct ATP | NADH | FADH₂ | ATP total |
|---|---|---|---|---|
| Glycolysis | 2 | 2 | 0 | 2 + 6 = 8 |
| Link reaction | 0 | 2 | 0 | 6 |
| Krebs cycle (2 turns) | 2 | 6 | 2 | 2 + 18 + 4 = 24 |
| **Total** | | | | **38** |

<figure class="fig" data-fig="c11b-resp-tally"><figcaption>The stacked bar adds the stages. Try the "modern" count: newer measurements give about 2.5 ATP per NADH and 1.5 per FADH₂, and some ATP is spent in moving things across the membranes, so the real figure is nearer 30 than 38.</figcaption></figure>

<div class="problem" data-problem="c11b-resp-atp-total"></div>

These are theoretical maxima. In a real cell the yield is often lower, and the number depends on the cell and the conditions.

## 6. The amphibolic pathway

Glucose is not the only fuel. **Fats** are broken into glycerol and fatty acids; the fatty acids become acetyl CoA. **Proteins** are broken into amino acids, which enter at pyruvate, acetyl CoA or a Krebs cycle acid. So the breakdown of all three meets in the same pathway: it is a **catabolic** (breaking-down) pathway.

But when the cell needs to **build** fatty acids, amino acids or other molecules, it draws on intermediates of the pathway (acetyl CoA for fatty acids; Krebs cycle acids for amino acids). A pathway that is both catabolic and anabolic is **amphibolic**. Respiration is amphibolic; so is the Krebs cycle.

<div class="steps" data-fig="c11b-resp-amphi">
<div class="step">Carbohydrates enter at glucose.</div>
<div class="step">Fats enter as acetyl CoA.</div>
<div class="step">Proteins enter as Krebs cycle acids.</div>
<div class="step">The hub also supplies building blocks.</div>
</div>

## 7. Respiratory quotient

The **respiratory quotient** (respiratory ratio) is

```math
RQ = \frac{\text{volume of CO}_2\text{ released}}{\text{volume of O}_2\text{ consumed}}
```

<div class="meaning">

<dl>
<dt>RQ</dt><dd>tells which fuel the cells are burning</dd>
<dt>Carbohydrate</dt><dd>`$RQ = 6/6 = 1$`</dd>
<dt>Fat</dt><dd>`$RQ \approx 0.7$` (the molecule has little oxygen, so more O₂ is needed)</dd>
<dt>Protein</dt><dd>`$RQ \approx 0.9$`</dd>
<dt>Physical meaning</dt><dd>Fat is like petrol (lots of energy per kg and a lot of air needed to burn it); sugar is like paper (it carries its own oxygen).</dd>
</dl>

</div>

When organic acids are burnt, the RQ is **above 1** (oxalic acid: 4). In anaerobic respiration CO₂ is released without any O₂ used, so the RQ is infinity. In real life the substrate is a mixture, so the RQ is between these. It is measured with a **respirometer**: a closed flask in which a chemical absorbs the CO₂.

<figure class="fig" data-fig="c11b-resp-rq"><figcaption>Choose a fuel and compare the bar of O₂ used with the bar of CO₂ released.</figcaption></figure>

<div class="problem" data-problem="c11b-resp-rq-calc"></div>

Work out your own RQ values with the [respirometry calculator](/science/respirometry-calculator/) and see how the [ATP yield](/learn/respiration-atp/) changes when oxygen runs out.

<div class="history">

**Beyond the syllabus.** The tally of 38 ATP is the older textbook number. Modern measurements give about 30 to 32, because a fraction of the proton gradient is used to move pyruvate, phosphate and ATP across the membrane, and because the H⁺ to ATP ratio is not a whole number.

</div>

<div class="keypoints">

- Plants exchange gases by diffusion (stomata, lenticels, root surface). Respiration breaks food down in steps and stores energy in ATP.
- Glycolysis: cytoplasm, glucose → 2 pyruvate, net 2 ATP + 2 NADH, no O₂ needed.
- Fermentation: 2 ATP only; alcohol (yeast, CO₂ released) or lactic acid (muscle, no CO₂).
- Link reaction: pyruvate → acetyl CoA + CO₂ + NADH. Krebs cycle (matrix): per turn 3 NADH, 1 FADH₂, 1 ATP, 2 CO₂; two turns per glucose.
- ETC (inner membrane): O₂ is the last electron acceptor; ATP synthase makes ATP by chemiosmosis. Textbook total 38 ATP per glucose.
- Amphibolic: catabolism of carbohydrate, fat and protein, and anabolic supply of building blocks.
- RQ = CO₂ ÷ O₂: carbohydrate 1, protein 0.9, fat 0.7, organic acid above 1, anaerobic infinite.

</div>

Going further for JEE/NEET: the exam-level version of this chapter is [Respiration in Plants for NEET](/learn/courses/medical-entrance/plant-respiration/).
