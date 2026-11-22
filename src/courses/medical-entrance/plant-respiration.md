---
title: 'Respiration in plants'
seoTitle: 'Respiration in plants: NEET biology'
summary: 'Glycolysis step by step, alcoholic and lactic acid fermentation, the link reaction, the Krebs cycle, the electron transport system and ATP synthase, the ATP balance sheet for one glucose, the amphibolic pathway and the respiratory quotient, with live problems and the traps NEET asks most.'
minutes: 34
updated: 2026-11-22
quiz:
  - q: 'Where does glycolysis take place?'
    choices: ['Mitochondrial matrix', 'Inner mitochondrial membrane', 'Cytoplasm', 'Chloroplast stroma']
    ans: 2
    why: 'Glycolysis runs in the cytoplasm of every living cell and needs no oxygen. The link reaction and Krebs cycle are in the matrix; the ETS is on the inner membrane.'
  - q: 'The RQ of a fat such as tripalmitin is about:'
    choices: ['1.0', '0.7', '1.3', '4.0']
    ans: 1
    why: 'Fats are poor in oxygen, so they need much O₂: 2C₅₁H₉₈O₆ + 145O₂ → 102CO₂ + 98H₂O, giving RQ = 102/145 ≈ 0.7. Carbohydrates give 1, proteins about 0.9 and organic acids more than 1.'
  - q: 'Substrate-level phosphorylation in the Krebs cycle happens when:'
    choices: ['citric acid forms', 'succinyl CoA becomes succinic acid', 'malic acid becomes OAA', 'isocitrate is decarboxylated']
    ans: 1
    why: 'Converting succinyl CoA to succinic acid makes one GTP directly (which gives ATP). The other steps make NADH or FADH₂, or release CO₂.'
sources:
  - 'NCERT Biology Class 11 (2023 rationalised), chapter Respiration in plants: topics followed, no text copied'
  - 'National Medical Commission, NEET (UG) syllabus: Plant physiology https://www.nmc.org.in'
  - 'Rich P. R. (2003), The molecular machinery of Keilin''s respiratory chain, Biochemical Society Transactions 31(6) 1095-1105 https://doi.org/10.1042/bst0311095 (for the modern 30 to 32 ATP estimate)'
---

**Biology · Class 11 · about 34 minutes.** By the end you will be able to follow glucose from glycolysis to CO₂ and water, name where each stage happens and what it produces, add up the ATP from one glucose, explain why fermentation pays so little, and work out the RQ of any substrate.

<div class="bigidea">Respiration takes the hydrogen (with its electrons) off food bit by bit and hands it to oxygen at the very end. Each hand-off releases a small packet of energy that is stored as ATP. Without oxygen at the end, the line jams and only the first stage, glycolysis, can run.</div>

## 1. Glycolysis

Plants have no special breathing organs: each part exchanges gases on its own through stomata and lenticels, and most cells are close to the air. Respiration breaks the C–C bonds of food by oxidation; the usual **respiratory substrate** is glucose (from sucrose, split by invertase, or from starch).

**Glycolysis** (the **EMP pathway**, after Embden, Meyerhof and Parnas) runs in the **cytoplasm** of all cells and is the only energy pathway in anaerobic organisms. One glucose (6C) becomes **two pyruvic acid** (3C).

<div class="steps" data-ms="7500">
<div class="step"><b>Investment.</b> Glucose → glucose-6-phosphate (hexokinase, uses 1 ATP) → fructose-6-phosphate → fructose-1,6-bisphosphate (uses a second ATP).</div>
<div class="step"><b>Split.</b> Fructose-1,6-bisphosphate splits into two 3-carbon sugars: dihydroxyacetone phosphate and 3-phosphoglyceraldehyde (PGAL). From here every step happens twice per glucose.</div>
<div class="step"><b>First payoff.</b> PGAL → 1,3-bisphosphoglyceric acid (BPGA), making <b>NADH</b>. BPGA → 3-phosphoglyceric acid (PGA), making <b>ATP</b>.</div>
<div class="step"><b>Second payoff.</b> PGA → 2-PGA → phosphoenolpyruvate (PEP, by removing water) → pyruvic acid, making another <b>ATP</b>.</div>
<div class="step"><b>Net per glucose.</b> 4 ATP made − 2 used = <b>2 ATP</b>, plus <b>2 NADH</b> and 2 pyruvic acid. What happens next depends on oxygen.</div>
</div>

## 2. Fermentation

Without oxygen, the cell must turn NADH back into NAD⁺ or glycolysis stops. It does this by dumping hydrogen onto pyruvic acid.

- **Alcoholic fermentation** (yeast): pyruvic acid → acetaldehyde + CO₂ (pyruvic acid decarboxylase) → ethanol (alcohol dehydrogenase, uses NADH).
- **Lactic acid fermentation** (some bacteria, and muscle short of oxygen during hard exercise): pyruvic acid → lactic acid (lactate dehydrogenase, uses NADH).

Net gain is only the **2 ATP** of glycolysis; less than 7% of the energy in glucose is released, and the products are toxic. Yeast die when alcohol reaches about 13%.

<div class="myth">

**"Fermentation releases no CO₂."** Alcoholic fermentation does release CO₂ (that is what makes bread rise). Lactic acid fermentation does not.

</div>

## 3. Aerobic respiration in the mitochondrion

**Link reaction** (matrix). Pyruvic acid + CoA + NAD⁺ → **acetyl CoA** + CO₂ + NADH, by the **pyruvate dehydrogenase** complex (needs Mg²⁺). Per glucose: 2 NADH, 2 CO₂.

**Krebs cycle** (Hans Krebs; also called the TCA or citric acid cycle; matrix). Acetyl (2C) joins **oxaloacetic acid** (OAA, 4C) and water to make **citric acid** (6C), by citrate synthase. Citric acid becomes isocitrate, then loses two CO₂ in two steps (giving α-ketoglutaric acid, 5C, then succinyl CoA). Succinyl CoA → succinic acid makes **one GTP** (substrate-level phosphorylation). Succinic acid → fumaric acid makes **FADH₂**; then malic acid; then OAA again, making NADH.

Per turn: **3 NADH, 1 FADH₂, 1 GTP (ATP), 2 CO₂**. One glucose turns the cycle **twice**.

**Electron transport system** (inner mitochondrial membrane). NADH hands electrons to **complex I** (NADH dehydrogenase); FADH₂ from succinate enters at **complex II**. Electrons pass to **ubiquinone**, then **complex III** (cytochrome bc₁), the small mobile protein **cytochrome c**, and **complex IV** (cytochrome c oxidase, with cytochromes a and a₃ and two copper centres). **Oxygen** is the final acceptor and becomes water. Pumped protons flow back through **complex V, ATP synthase**: F₀ forms the channel in the membrane and F₁, the knob, makes ATP. This is **oxidative phosphorylation**. Oxygen's job is only at the very end, yet without it the whole chain stops.

## 4. The ATP balance sheet

NCERT counts **3 ATP per NADH** and **2 per FADH₂**, and assumes that the pathway runs in sequence, NADH from glycolysis enters the mitochondrion, no intermediate is drawn off and only glucose is respired. Change the count to compare with the modern estimate.

<figure class="fig" data-fig="atp-ledger"><figcaption>ATP from one glucose by stage. NCERT count: glycolysis 8, link reaction 6, Krebs cycle 24, total 38. Fermentation stops at the 2 ATP of glycolysis.</figcaption></figure>

| Stage | Direct | NADH | FADH₂ | ATP (NCERT) |
|---|---|---|---|---|
| Glycolysis | 2 | 2 | 0 | 2 + 6 = 8 |
| Link reaction | 0 | 2 | 0 | 6 |
| Krebs cycle (×2) | 2 | 6 | 2 | 2 + 18 + 4 = 24 |
| **Total** | 4 | 10 | 2 | **38** |

<div class="problem" data-problem="presp-atp-mix"></div>

## 5. Amphibolic pathway and RQ

Fats break into glycerol (enters as PGAL) and fatty acids (become acetyl CoA); proteins break into amino acids that enter as pyruvic acid, acetyl CoA or Krebs intermediates. The same intermediates are drawn off to **build** fatty acids, amino acids and more. Because respiration both breaks down (catabolism) and supplies building blocks (anabolism), it is called an **amphibolic** pathway rather than purely catabolic.

The **respiratory quotient** is RQ = volume of CO₂ released ÷ volume of O₂ used.

- Carbohydrates: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O, **RQ = 1**.
- Fats: tripalmitin, **RQ ≈ 0.7** (oxygen-poor, so more O₂ is needed).
- Proteins: about **0.9**. Organic acids (oxygen-rich, such as malic or oxalic acid): **more than 1**.
- In anaerobic respiration CO₂ is released but no O₂ is used, so RQ is infinite.

<div class="problem" data-problem="presp-rq"></div>

<div class="meaning">
<dl>
<dt>Substrate-level phosphorylation</dt><dd>ATP (or GTP) made directly in a reaction step (glycolysis, succinyl CoA step)</dd>
<dt>Oxidative phosphorylation</dt><dd>ATP made by ATP synthase using the proton flow set up by the ETS</dd>
<dt>Acetyl CoA</dt><dd>the 2-carbon unit that enters the Krebs cycle</dd>
<dt>RQ</dt><dd>CO₂ released ÷ O₂ used</dd>
<dt>Physical meaning</dt><dd>Most of the ATP comes at the end, when NADH meets oxygen. Cut the oxygen and you keep only the small down payment from glycolysis.</dd>
</dl>
</div>

<div class="keypoints">

- Glycolysis (EMP) in the cytoplasm: glucose → 2 pyruvic acid; net 2 ATP + 2 NADH; ATP used at hexokinase and fructose-1,6-bisphosphate steps.
- Fermentation: ethanol + CO₂ (yeast) or lactic acid (muscle); only 2 ATP; regenerates NAD⁺.
- Link reaction: pyruvate dehydrogenase, acetyl CoA, 1 NADH and 1 CO₂ per pyruvic acid.
- Krebs cycle per turn: 3 NADH, 1 FADH₂, 1 GTP, 2 CO₂; two turns per glucose; starts with citric acid from acetyl CoA + OAA.
- ETS: complexes I to IV, ubiquinone, cytochrome c; O₂ final acceptor; ATP synthase F₀ (channel) and F₁ (makes ATP).
- NCERT total: 38 ATP per glucose (3 per NADH, 2 per FADH₂).
- Respiration is amphibolic; RQ: carbohydrate 1, fat 0.7, protein 0.9, organic acids above 1.

</div>

Next: [question types and traps](/learn/courses/medical-entrance/plant-respiration-questions/).
