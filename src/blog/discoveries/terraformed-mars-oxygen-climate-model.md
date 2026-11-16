---
title: "Terraformed Mars with an oxygen atmosphere: 3D climate model limits"
summary: "A first 3D climate model of an oxygen-rich, terraformed Mars finds that 30 to 60 hPa of air could suit moss and even forests, but breathable air would take thousands of years. We checked both with simple sums."
tools: [energy-balance-model, carbon-cycle]
updated: 2026-11-16
sources:
  - "Braude, A. S., Kite, E. S., Kemeny, P. C., Pierrehumbert, R. T. et al. (2026), The climate and potential habitability of a warm and oxygenated Mars, arXiv:2611.13321 (posted 9 November 2026). Preprint, not yet peer-reviewed. Licence CC BY 4.0, checked on the arXiv page, 2026-11-16. Values used here, from the abstract: 30 hPa (about five times today's pressure) for lichen and moss, 60 hPa for forests."
  - "Mars gravity 3.71 m/s², surface area 1.448 × 10¹⁴ m², sunlight 586 W/m², albedo 0.25, day 88,775 s, year 687 Earth days, mean pressure about 6 hPa: NASA Mars Fact Sheet, rounded."
  - "CO₂ that could be released from known Martian reserves, about 20 hPa: Jakosky, B. M. and Edwards, C. S. (2018), Inventory of CO₂ available for terraforming Mars, Nature Astronomy 2, 634, rounded."
  - "Earth's average plant growth, about 0.2 kg of carbon per m² per year on land (roughly 100 billion tonnes a year over the land area): standard textbook figure, rounded."
paper:
  title: "The climate and potential habitability of a warm and oxygenated Mars"
  authors: "Braude, A. S.; Kite, E. S.; Kemeny, P. C.; Pierrehumbert, R. T. et al."
  journal: "arXiv preprint"
  year: 2026
  doi: "10.48550/arXiv.2611.13321"
  url: "https://arxiv.org/abs/2611.13321"
  licence: "CC BY 4.0"
  reviewed: false
---

Could Mars ever be made green, with plants growing in the open and oxygen in the air? A new study (a preprint, not yet peer-reviewed) runs the first three-dimensional climate model of a Mars that has already been warmed and given an atmosphere of oxygen and carbon dioxide. It finds that a few times today's air pressure would be enough for hardy plants in the warmest places, but that making air people could breathe would take thousands of years and more oxygen than Mars seems to have. Below we use the [[energy-balance-model]] to check why thicker air calms the day-night swing, and simple carbon bookkeeping, as in the [[carbon-cycle]] tool, to check the thousands of years.

## What they found

The team modelled a Mars whose air is oxygen and carbon dioxide, with an extra, evenly mixed "grey" greenhouse gas that traps heat at all infrared wavelengths, standing in for whatever gas engineers might add. They varied two things: the air pressure, and how strongly the grey gas traps heat. They left out dust storms, the water cycle, soil chemistry and nutrients.

Raising either the pressure or the heat-trapping narrows the gap between day and night temperatures. The seasons, though, barely soften, and the southern mid-latitudes stay harsher than the northern ones. At about **30 hPa**, five times today's pressure, conditions in places could suit lichens and mosses; at **60 hPa**, forests, starting in the deep Hellas Basin, where the air is thickest. But if plants made the oxygen at the rate Earth's plants do today, a breathable atmosphere would take **at least thousands of years**, and would need more oxygen than Mars's known carbon dioxide can supply, unless the carbon dioxide is recycled.

## Why it matters

Ideas for warming Mars have often stopped at "make it warm enough for liquid water". This study asks the next questions: once it is warm, what limits life, and how long would oxygen take? Its answer is that temperature and pressure for plants are reachable on paper long before breathable air. The study also shows the value of 3D models: a single global average temperature hides the deep basins, the harsh south and the seasons that decide where anything could grow.

## How they did it

The team used a global climate model, the kind used for weather and climate on Earth, adapted to Mars: its orbit, its tilted axis, its mountains and basins, and its thin air. They ran it for many combinations of pressure and grey-gas strength, then compared the temperatures and pressures at each place and season with the known limits for lichens, mosses and trees on Earth. The oxygen timescale came from comparing the oxygen needed with how fast Earth's living things produce it.

## Checked with the tools

We cannot run a 3D climate model here, so we checked the paper's two main ideas with simple physics, using standard values for Mars and the pressures in the paper's abstract. These are **our own back-of-envelope sums**, not the paper's model.

**Step 1: how much air is that?** On a planet the air pressure is the weight of the air above each square metre, so the mass of the whole atmosphere is pressure × area ÷ gravity. Mars's air today, about 6 hPa, weighs about **2.3 × 10¹⁶ kg**. At 30 hPa it would be about 1.2 × 10¹⁷ kg and at 60 hPa about 2.3 × 10¹⁷ kg: ten times today's air.

**Step 2: why thicker air calms the nights.** Each square metre of air holds heat in proportion to its mass, and loses heat by radiating to space. Dividing the heat it can hold by the rate it loses heat gives a cooling time, the same "e-folding time" the Energy balance model uses for oceans. Figure 1 shows the result for air at 220 K. Today the air above each square metre can lose most of its heat in **about 0.6 of a Mars day**, so nights get very cold. At 30 hPa the cooling time is about **3 Mars days** and at 60 hPa about **6**: the air simply cannot cool much in one night. But a Martian season lasts about **167 Mars days**, far longer than even 6, so the seasons still swing almost fully. That is just what the paper's model shows: a narrower day-night range, but seasons that barely change.

<!-- fig:cool -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 300" role="img" aria-label="The time for the air above each square metre to lose most of its heat rises in step with pressure, from under one Mars day today to several days at 60 hPa, still far shorter than a season." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>How many Mars days thicker air takes to cool</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">How many Mars days thicker air takes to cool</text><line x1="58" x2="546" y1="254" y2="254" style="stroke:var(--line)"/><text x="52" y="258" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="205" y2="205" style="stroke:var(--line)"/><text x="52" y="209" text-anchor="end" style="fill:var(--muted)">2.5</text><line x1="58" x2="546" y1="156.1" y2="156.1" style="stroke:var(--line)"/><text x="52" y="160.1" text-anchor="end" style="fill:var(--muted)">5</text><line x1="58" x2="546" y1="107.1" y2="107.1" style="stroke:var(--line)"/><text x="52" y="111.1" text-anchor="end" style="fill:var(--muted)">7.5</text><line x1="58" x2="546" y1="58.1" y2="58.1" style="stroke:var(--line)"/><text x="52" y="62.1" text-anchor="end" style="fill:var(--muted)">10</text><line x1="146.7" x2="146.7" y1="254" y2="258" style="stroke:var(--muted)"/><text x="146.7" y="271" text-anchor="middle" style="fill:var(--muted)">20</text><line x1="245.3" x2="245.3" y1="254" y2="258" style="stroke:var(--muted)"/><text x="245.3" y="271" text-anchor="middle" style="fill:var(--muted)">40</text><line x1="343.9" x2="343.9" y1="254" y2="258" style="stroke:var(--muted)"/><text x="343.9" y="271" text-anchor="middle" style="fill:var(--muted)">60</text><line x1="442.5" x2="442.5" y1="254" y2="258" style="stroke:var(--muted)"/><text x="442.5" y="271" text-anchor="middle" style="fill:var(--muted)">80</text><line x1="541.1" x2="541.1" y1="254" y2="258" style="stroke:var(--muted)"/><text x="541.1" y="271" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="58" x2="546" y1="254" y2="254" style="stroke:var(--muted)"/><text x="302" y="292" text-anchor="middle" style="fill:var(--ink)">Surface pressure (hPa)</text><text transform="translate(14 143) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Cooling time (Mars days)</text><line x1="58" x2="546" y1="234.4" y2="234.4" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="229.4" text-anchor="end" style="fill:var(--muted)">One Mars day</text><line x1="77.7" x2="77.7" y1="32" y2="254" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="81.7" y="44" text-anchor="start" style="fill:var(--muted)">Today</text><line x1="196" x2="196" y1="32" y2="254" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="200" y="44" text-anchor="start" style="fill:var(--muted)">30 hPa</text><line x1="343.9" x2="343.9" y1="32" y2="254" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="347.9" y="44" text-anchor="start" style="fill:var(--muted)">60 hPa</text><path d="M58 249.8L62.9 247.7L67.9 245.6L72.8 243.5L77.7 241.4L82.6 239.3L87.6 237.3L92.5 235.2L97.4 233.1L102.4 231L107.3 228.9L112.2 226.8L117.2 224.7L122.1 222.6L127 220.5L131.9 218.4L136.9 216.3L141.8 214.2L146.7 212.1L151.7 210L156.6 207.9L161.5 205.8L166.4 203.8L171.4 201.7L176.3 199.6L181.2 197.5L186.2 195.4L191.1 193.3L196 191.2L200.9 189.1L205.9 187L210.8 184.9L215.7 182.8L220.7 180.7L225.6 178.6L230.5 176.5L235.5 174.4L240.4 172.4L245.3 170.3L250.2 168.2L255.2 166.1L260.1 164L265 161.9L270 159.8L274.9 157.7L279.8 155.6L284.7 153.5L289.7 151.4L294.6 149.3L299.5 147.2L304.5 145.1L309.4 143L314.3 141L319.3 138.9L324.2 136.8L329.1 134.7L334 132.6L339 130.5L343.9 128.4L348.8 126.3L353.8 124.2L358.7 122.1L363.6 120L368.5 117.9L373.5 115.8L378.4 113.7L383.3 111.7L388.3 109.6L393.2 107.5L398.1 105.4L403.1 103.3L408 101.2L412.9 99.1L417.8 97L422.8 94.9L427.7 92.8L432.6 90.7L437.6 88.6L442.5 86.5L447.4 84.4L452.3 82.3L457.3 80.3L462.2 78.2L467.1 76.1L472.1 74L477 71.9L481.9 69.8L486.8 67.7L491.8 65.6L496.7 63.5L501.6 61.4L506.6 59.3L511.5 57.2L516.4 55.1L521.4 53L526.3 51L531.2 48.9L536.1 46.8L541.1 44.7L546 42.6" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><text class="fibub-mark" x="546" y="292" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. Time for the air above each square metre to lose most of its heat by radiating at 220 K (heat capacity ÷ cooling rate, as in the Energy balance model), in Mars days. Our simple sum, not the paper's climate model.</figcaption></figure>
<!-- /fig:cool -->

**Step 3: why a grey gas is needed.** The Energy balance model's one-layer greenhouse gives Mars an average temperature without any greenhouse effect of about **210 K** (−63 °C). A single layer of air that traps half of the outgoing heat raises the surface to about 226 K, and even a layer that traps all of it reaches only about **250 K** (−23 °C). A single layer cannot warm Mars above freezing on average. Real warming needs a thick, many-layered greenhouse, which is why the paper adds a strong grey gas, and why its warm places are the low basins.

**Step 4: how long to make the oxygen?** To breathe without a mask a person needs roughly the oxygen found at about 3,500 m on Earth, a partial pressure of about 130 hPa. Because Mars's gravity is weaker, that takes about **3,500 kg of oxygen above each square metre**. Plants free 32 kg of oxygen for every 12 kg of carbon they fix and keep out of the air. Earth's land plants fix about 0.2 kg of carbon per square metre per year on average, so the oxygen would take about **6,600 years**, and even rainforest growth everywhere (about 1 kg) would take about **1,300 years** (Figure 2). That is the paper's "at least thousands of years".

<!-- fig:oxygen -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 300" role="img" aria-label="At Earth-average plant growth it takes about 6,600 years to make 130 hPa of oxygen on Mars; even rainforest rates take over 1,000 years." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Years of plant growth to make breathable air</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Years of plant growth to make breathable air</text><line x1="58" x2="546" y1="254" y2="254" style="stroke:var(--line)"/><text x="52" y="258" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="198.5" y2="198.5" style="stroke:var(--line)"/><text x="52" y="202.5" text-anchor="end" style="fill:var(--muted)">10,000</text><line x1="58" x2="546" y1="143" y2="143" style="stroke:var(--line)"/><text x="52" y="147" text-anchor="end" style="fill:var(--muted)">20,000</text><line x1="58" x2="546" y1="87.5" y2="87.5" style="stroke:var(--line)"/><text x="52" y="91.5" text-anchor="end" style="fill:var(--muted)">30,000</text><line x1="58" x2="546" y1="32" y2="32" style="stroke:var(--line)"/><text x="52" y="36" text-anchor="end" style="fill:var(--muted)">40,000</text><line x1="121.7" x2="121.7" y1="254" y2="258" style="stroke:var(--muted)"/><text x="121.7" y="271" text-anchor="middle" style="fill:var(--muted)">0.2</text><line x1="206.5" x2="206.5" y1="254" y2="258" style="stroke:var(--muted)"/><text x="206.5" y="271" text-anchor="middle" style="fill:var(--muted)">0.4</text><line x1="291.4" x2="291.4" y1="254" y2="258" style="stroke:var(--muted)"/><text x="291.4" y="271" text-anchor="middle" style="fill:var(--muted)">0.6</text><line x1="376.3" x2="376.3" y1="254" y2="258" style="stroke:var(--muted)"/><text x="376.3" y="271" text-anchor="middle" style="fill:var(--muted)">0.8</text><line x1="461.1" x2="461.1" y1="254" y2="258" style="stroke:var(--muted)"/><text x="461.1" y="271" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="546" x2="546" y1="254" y2="258" style="stroke:var(--muted)"/><text x="546" y="271" text-anchor="middle" style="fill:var(--muted)">1.2</text><line x1="58" x2="546" y1="254" y2="254" style="stroke:var(--muted)"/><text x="302" y="292" text-anchor="middle" style="fill:var(--ink)">Plant growth (kg of carbon per m² per year)</text><text transform="translate(14 143) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Years</text><line x1="121.7" x2="121.7" y1="32" y2="254" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="125.7" y="44" text-anchor="start" style="fill:var(--muted)">Earth average</text><path d="M58 108.1L79.2 181.1L121.7 217.5L164.1 229.7L206.5 235.8L291.4 241.8L376.3 244.9L461.1 246.7L546 247.9" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><text class="fibub-mark" x="546" y="292" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Years to make 130 hPa of oxygen on Mars, if all the carbon that plants fix is kept out of the air. Plant growth from desert (left) to rainforest (right).</figcaption></figure>
<!-- /fig:oxygen -->

**Step 5: is there enough carbon dioxide?** Each molecule of carbon dioxide that plants split gives one molecule of oxygen, so by mass 44 kg of carbon dioxide gives 32 kg of oxygen. The carbon dioxide that could be released from known Martian reserves is about 20 hPa. Turned entirely into oxygen, that gives only about **15 hPa** of oxygen, roughly a ninth of the 130 hPa target. So, as the paper says, the oxygen cannot come from Mars's carbon dioxide alone unless the carbon is recycled back into the air and split again.

| Check | Paper | Our sum |
|---|---|---|
| Day-night range with thicker air | narrows | cooling time rises from 0.6 to 6 Mars days (6 to 60 hPa) |
| Seasons | barely change | a season (about 167 Mars days) is far longer than any cooling time |
| Time to make breathable air | at least thousands of years | about 6,600 years at Earth-average plant growth |
| Enough carbon dioxide? | no, unless recycled | about 15 hPa of oxygen from 20 hPa of carbon dioxide, against about 130 hPa needed |

## How we made the graphs

Both charts come from `scripts/blog-figures/terraformed-mars-oxygen-climate-model.mjs` in fibub's public code. It uses `oneLayer`, `efold`, `SIGMA` and `YEAR` from `src/lib/sci/ebm.ts`, the maths behind the [[energy-balance-model]]: the one-layer greenhouse and the "heat capacity ÷ cooling rate" time that the tool uses for oceans. The Mars values (gravity, area, sunlight, albedo, pressure) are standard and labelled in the script; the 130 hPa oxygen target and the plant growth rates are marked as our choices. Running the script prints every number quoted here.

## How we test the maths

The energy balance maths has its own checks (`tests/sci-tools/energy-balance-model.mjs`), run on every change:

- Doubling carbon dioxide must give a forcing of 3.708 W/m² (5.35 × ln 2), the standard value.
- With Earth's sunlight, albedo 0.3 and emissivity 0.612 the model must settle at 287.83 K (about 15 °C), and at 254.6 K with no greenhouse effect.
- With ice included, the snowball and melt-back tipping points must match an independent calculation in Python (SciPy) to eight decimal places, and 100 m of ocean must take 11.04 years to respond.

## Check it yourself

You can do Step 3's no-greenhouse temperature and the one-layer limit for Mars on the [[energy-balance-model]]:

1. Open the [[energy-balance-model]]. Type **586** in *Solar constant S (W/m²)*, Mars's sunlight, and **0.25** in *Albedo α (ice-free)*.
2. In the one-layer greenhouse card, set *Atmosphere long-wave emissivity εₐ* to **0**. *No-atmosphere temperature* and *Surface temperature* both read about **−63.3 °C (209.8 K)**, the no-greenhouse temperature in Step 3.
3. Move εₐ up to **1**, the thickest single layer. The surface reads about **−23.6 °C (249.5 K)**: 2^¼ times, or about 19 %, warmer than with no greenhouse, and still well below freezing. That is why one layer of ordinary air cannot warm Mars enough, and why the study adds a strong grey greenhouse gas.
4. For a second opinion, open the [[habitable-zone-calculator]], type **5772** in *Temperature (K)*, **1** in *Luminosity (Suns)*, **1** in *Mass (Suns)*, **1.524** in *Distance from the star (AU)* and **0.25** in *Albedo*: the equilibrium temperature again reads about **210 K**.

## What researchers can use it for

- **Back-of-envelope climate checks** before a full model run: the no-greenhouse temperature, the greenhouse needed and how fast a layer of air or water responds.
- **Teach climate feedbacks:** the [[energy-balance-model]] shows CO₂ forcing, the ice-albedo tipping points and response times with sliders.
- **Carbon and oxygen bookkeeping:** the [[carbon-cycle]] tool follows carbon between air, plants and soil.

## The fine print

- This is a **preprint, not yet peer-reviewed**, and the paper itself leaves out dust, water, soil chemistry and nutrients.
- Our sums are deliberately simple: one average temperature, one layer of air, and no heat stored in the ground, which also matters for Martian nights.
- The 130 hPa oxygen target and the plant growth rates are rounded choices for the sake of the sum; the paper's own targets may differ.
- Terraforming Mars is a thought experiment: no one is able to do it now. The study is about the physics limits, not a plan.
