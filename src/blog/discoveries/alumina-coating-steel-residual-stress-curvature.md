---
title: "Residual stress in alumina coatings on steel, measured from the bend"
summary: "A furnace with a camera watches alumina-coated steel bars bend and flatten as they heat. We check the Stoney stresses, and where Stoney stops working, with fibub's thermal mismatch tool."
tools: [thermal-mismatch-stress, stress-strain-analyser]
updated: 2026-11-16
sources:
  - "Li, H., Zhang, L., Mao, Y., Zhang, J., Wan, D. and Bao, Y. (2025), Research on the Temperature Dependence of Deformation and Residual Stress via Image Relative Method, Coatings 15(8), 913, doi:10.3390/coatings15080913. Licence CC BY 4.0, checked on the journal page, 2026-11-16. Values used here: 304 steel bar 70 x 5 x 1 mm, steel modulus 200 GPa and Poisson's ratio 0.29; coatings 0.2 mm (S1), 0.7 mm (S2) and 1.0 mm (S3); heating and cooling at 8 °C per minute; flat (stress-free) at 280 °C (S1) and 540 °C (S2); largest residual stress after the second cooling 803.3 MPa (S1) and 780.3 MPa (S2), 14.5% and 2.7% below the first cooling."
  - "Stoney, G. G. (1909), The tension of metallic films deposited by electrolysis, Proc. R. Soc. Lond. A 82, 172-175 (the formula)."
  - "Timoshenko, S. (1925), Analysis of bi-metal thermostats, J. Opt. Soc. Am. 11, 233-255 (the two-layer beam the tool's strip and layer solution follows)."
  - "Our assumptions, typical handbook values, not from the paper: expansion coefficient of 304 steel 17.3 ppm/K and of alumina 8.1 ppm/K near room temperature; minimum yield strength of annealed 304 steel about 205 MPa (ASTM A240); modulus of plasma-sprayed alumina 80 GPa (sprayed coatings are porous and much less stiff than dense alumina) and Poisson's ratio 0.2."
paper:
  title: "Research on the Temperature Dependence of Deformation and Residual Stress via Image Relative Method"
  authors: "Li, H.; Zhang, L.; Mao, Y.; Zhang, J.; Wan, D.; Bao, Y."
  journal: "Coatings"
  year: 2025
  doi: "10.3390/coatings15080913"
  url: "https://www.mdpi.com/2079-6412/15/8/913"
  licence: "CC BY 4.0"
  reviewed: true
---

Ceramic coatings protect steel from heat, wear and corrosion, but the two materials expand by different amounts when heated. The mismatch leaves **residual stress**: a stress locked into the coating with no load applied. Too much, and the coating cracks or peels. A 2025 study in *Coatings* measures it in a neat way: it films alumina-coated steel bars inside a furnace and works out the stress from how much they bend. This article shows how the [[thermal-mismatch-stress]] tool lets anyone check those stresses, and see where the textbook formula behind them stops working. For the steel's own strength, the [[stress-strain-analyser]] reads a tensile test.

## The paper in brief

The team sprayed alumina (aluminium oxide, Al₂O₃) onto one face of thin 304 stainless steel bars, 70 mm long and 1 mm thick, with coatings of 0.2 mm (sample S1), 0.7 mm (S2) and 1.0 mm (S3). A furnace with a window and a camera heated and cooled them at 8 °C a minute while photographs tracked the bend. Comparing photos taken at different temperatures gives the **curvature** (how sharply the bar bends), and **Stoney's formula** turns curvature into the coating's stress.

The bars bent while hot, went **flat** at one temperature (280 °C for S1, 540 °C for S2), and bent again on cooling. The flat temperature is where the coating carries no stress. Back at room temperature the thin coating held the most stress, about **803 MPa** of compression after the second cooling, against 780 MPa for the thicker S2. Both were lower than after the first cooling, as the hot cycle let some stress relax. The thickest coating never went flat, a sign the steel had yielded, so the authors treated it as a layered composite instead.

## Checked with the tools

We used the paper's sizes, steel properties and stresses with the tool's own maths. Everything about the coating's stiffness and the expansion coefficients is our assumption (see the sources), and we say where it matters.

**Step 1: the bend behind 803 MPa.** Stoney's formula run backwards (stress to curvature) gives S1 a radius of curvature of **292 mm**: a bow of **2.10 mm** at the middle of the 70 mm bar, easy for a camera to see. For S2 the same formula gives a radius of only **86 mm** and a bow of **7.45 mm**.

**Step 2: is Stoney fair here?** Stoney assumes the coating is much thinner than the substrate. Here it is a fifth of the steel's thickness (S1) or 70% of it (S2). The tool's bonded-layer solution handles thick layers: it finds the stress in each layer from ordinary beam theory, with no thin-film shortcut. Giving it the same curvature, it puts the **average** coating stress at about **671 MPa** for S1 (706 at the bottom of the coating, 637 at the top) and **515 MPa** for S2. So, for the same bend, Stoney reads about **20% high for S1** and **51% high for S2** (Figure 1). These ratios depend a little on the coating stiffness we assumed (80 GPa); the trend does not.

<!-- fig:ratio -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 270" role="img" aria-label="Stoney's formula agrees with a full two-layer beam solution for thin coatings but overestimates the coating stress as the coating thickens: by 20% for S1 and 51% for S2." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Stoney's answer over the full beam answer</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Stoney's answer over the full beam answer</text><line x1="58" x2="546" y1="202.7" y2="202.7" style="stroke:var(--line)"/><text x="52" y="206.7" text-anchor="end" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="149.3" y2="149.3" style="stroke:var(--line)"/><text x="52" y="153.3" text-anchor="end" style="fill:var(--muted)">1.5</text><line x1="58" x2="546" y1="96" y2="96" style="stroke:var(--line)"/><text x="52" y="100" text-anchor="end" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="42.7" y2="42.7" style="stroke:var(--line)"/><text x="52" y="46.7" text-anchor="end" style="fill:var(--muted)">2.5</text><line x1="58" x2="58" y1="224" y2="228" style="stroke:var(--muted)"/><text x="58" y="241" text-anchor="middle" style="fill:var(--muted)">0.001</text><line x1="220.7" x2="220.7" y1="224" y2="228" style="stroke:var(--muted)"/><text x="220.7" y="241" text-anchor="middle" style="fill:var(--muted)">0.01</text><line x1="383.3" x2="383.3" y1="224" y2="228" style="stroke:var(--muted)"/><text x="383.3" y="241" text-anchor="middle" style="fill:var(--muted)">0.1</text><line x1="546" x2="546" y1="224" y2="228" style="stroke:var(--muted)"/><text x="546" y="241" text-anchor="middle" style="fill:var(--muted)">1</text><line x1="58" x2="546" y1="224" y2="224" style="stroke:var(--muted)"/><text x="302" y="262" text-anchor="middle" style="fill:var(--ink)">Coating thickness / steel thickness (log scale)</text><text transform="translate(14 128) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Stoney ÷ beam stress</text><line x1="58" x2="546" y1="202.7" y2="202.7" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="197.7" text-anchor="end" style="fill:var(--muted)">thin-film limit</text><path d="M58 202.6L70.2 202.5L82.4 202.5L94.6 202.5L106.8 202.5L119 202.4L131.2 202.4L143.4 202.3L155.6 202.2L167.8 202.2L180 202.1L192.2 202L204.4 201.8L216.6 201.7L228.8 201.5L241 201.2L253.2 201L265.4 200.7L277.6 200.3L289.8 199.8L302 199.3L314.2 198.7L326.4 197.9L338.6 197L350.8 195.9L363 194.7L375.2 193.2L387.4 191.4L399.6 189.3L411.8 186.8L424 183.9L436.2 180.6L448.4 176.6L460.6 172.1L472.8 167.1L485 161.6L497.2 156.1L509.4 151L521.6 147.5L533.8 147.2L546 151.9" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><circle cx="432.3" cy="181.7" r="4.5" style="fill:var(--c-tools);opacity:1"/><text x="424.3" y="173.7" text-anchor="end" style="fill:var(--ink)">S1</text><circle cx="520.8" cy="147.7" r="4.5" style="fill:var(--c-tools);opacity:1"/><text x="512.8" y="139.7" text-anchor="end" style="fill:var(--ink)">S2</text></svg><figcaption>Figure 1. For the same measured bend, how much larger Stoney's coating stress is than the average coating stress from a full two-layer beam solution, for a 1 mm steel bar and an assumed 80 GPa coating. The paper's two coatings are marked.</figcaption></figure>
<!-- /fig:ratio -->

**Step 3: the steel itself.** The same beam solution puts the stress in the steel just under an S2 coating near **2,000 MPa**, about ten times the yield strength of annealed 304 steel (about 205 MPa). The real steel cannot carry that elastically, so the bend of a thick coating is partly permanent. That fits the paper's finding that the thickest bar never went flat, and it warns against reading Stoney stresses for thick coatings literally.

**Step 4: how much comes from the expansion mismatch?** Steel expands about twice as much as alumina. Starting flat at 280 °C and cooling to 20 °C, the mismatch alone leaves **−239 MPa** (compression) in an 80 GPa coating; from S2's 540 °C, **−478 MPa** (Figure 2). Those are smaller than the measured values: sprayed coatings also lock in stress as hot droplets freeze and shrink on the surface, and the coating's real stiffness and expansion are uncertain. The tool makes it easy to try other values.

<!-- fig:mismatch -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 288" role="img" aria-label="With handbook expansion coefficients, cooling from the stress-free temperature to 20 °C leaves -239 MPa (S1) and -478 MPa (S2) in the coating; negative is compression." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Coating stress from the expansion mismatch alone (simulated)</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Coating stress from the expansion mismatch alone (simulated)</text><line x1="58" x2="546" y1="210" y2="210" style="stroke:var(--line)"/><text x="52" y="214" text-anchor="end" style="fill:var(--muted)">-400</text><line x1="58" x2="546" y1="146" y2="146" style="stroke:var(--line)"/><text x="52" y="150" text-anchor="end" style="fill:var(--muted)">-200</text><line x1="58" x2="546" y1="82" y2="82" style="stroke:var(--line)"/><text x="52" y="86" text-anchor="end" style="fill:var(--muted)">0</text><line x1="123.1" x2="123.1" y1="242" y2="246" style="stroke:var(--muted)"/><text x="123.1" y="259" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="204.4" x2="204.4" y1="242" y2="246" style="stroke:var(--muted)"/><text x="204.4" y="259" text-anchor="middle" style="fill:var(--muted)">200</text><line x1="285.7" x2="285.7" y1="242" y2="246" style="stroke:var(--muted)"/><text x="285.7" y="259" text-anchor="middle" style="fill:var(--muted)">300</text><line x1="367.1" x2="367.1" y1="242" y2="246" style="stroke:var(--muted)"/><text x="367.1" y="259" text-anchor="middle" style="fill:var(--muted)">400</text><line x1="448.4" x2="448.4" y1="242" y2="246" style="stroke:var(--muted)"/><text x="448.4" y="259" text-anchor="middle" style="fill:var(--muted)">500</text><line x1="529.7" x2="529.7" y1="242" y2="246" style="stroke:var(--muted)"/><text x="529.7" y="259" text-anchor="middle" style="fill:var(--muted)">600</text><line x1="58" x2="546" y1="242" y2="242" style="stroke:var(--muted)"/><text x="302" y="280" text-anchor="middle" style="fill:var(--ink)">Temperature (°C)</text><text transform="translate(14 146) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Coating stress (MPa)</text><line x1="58" x2="546" y1="82" y2="82" style="stroke:var(--muted);stroke-dasharray:4 4"/><path d="M58 158.5L66.1 155.6L74.3 152.7L82.4 149.7L90.5 146.8L98.7 143.8L106.8 140.9L114.9 137.9L123.1 135L131.2 132L139.3 129.1L147.5 126.2L155.6 123.2L163.7 120.3L171.9 117.3L180 114.4L188.1 111.4L196.3 108.5L204.4 105.6L212.5 102.6L220.7 99.7L228.8 96.7L236.9 93.8L245.1 90.8L253.2 87.9L261.3 84.9L269.5 82L277.6 79.1L285.7 76.1L293.9 73.2L302 70.2L310.1 67.3L318.3 64.3L326.4 61.4L334.5 58.4L342.7 55.5L350.8 52.6L358.9 49.6L367.1 46.7L375.2 43.7L383.3 40.8L391.5 37.8L399.6 34.9L407.7 32L415.9 29L424 26.1L432.1 23.1L440.3 20.2L448.4 17.2L456.5 14.3L464.7 11.3L472.8 8.4L480.9 5.5L489.1 2.5L497.2 -0.4L505.3 -3.4L513.5 -6.3L521.6 -9.3L529.7 -12.2L537.9 -15.2L546 -18.1" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 235.1L66.1 232.1L74.3 229.2L82.4 226.3L90.5 223.3L98.7 220.4L106.8 217.4L114.9 214.5L123.1 211.5L131.2 208.6L139.3 205.6L147.5 202.7L155.6 199.8L163.7 196.8L171.9 193.9L180 190.9L188.1 188L196.3 185L204.4 182.1L212.5 179.2L220.7 176.2L228.8 173.3L236.9 170.3L245.1 167.4L253.2 164.4L261.3 161.5L269.5 158.5L277.6 155.6L285.7 152.7L293.9 149.7L302 146.8L310.1 143.8L318.3 140.9L326.4 137.9L334.5 135L342.7 132L350.8 129.1L358.9 126.2L367.1 123.2L375.2 120.3L383.3 117.3L391.5 114.4L399.6 111.4L407.7 108.5L415.9 105.6L424 102.6L432.1 99.7L440.3 96.7L448.4 93.8L456.5 90.8L464.7 87.9L472.8 84.9L480.9 82L489.1 79.1L497.2 76.1L505.3 73.2L513.5 70.2L521.6 67.3L529.7 64.3L537.9 61.4L546 58.4" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">S1: stress-free at 280 °C</text><line x1="264" x2="276" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="280" y="40" style="fill:var(--muted)">S2: stress-free at 540 °C</text></svg><figcaption>Figure 2. The coating stress that the difference in thermal expansion alone would cause, starting stress-free at each sample's flat temperature from the paper. Handbook expansion values and an assumed coating stiffness: a simulation, not the measured stresses.</figcaption></figure>
<!-- /fig:mismatch -->

| Quantity | Paper | Tool |
|---|---|---|
| S1 residual stress (Stoney) | 803.3 MPa | radius 292 mm, bow 2.10 mm over 70 mm |
| S1 average stress, full beam solution | not given | about 671 MPa (assumed 80 GPa coating) |
| S2 residual stress (Stoney) | 780.3 MPa | radius 86 mm, bow 7.45 mm |
| S2 average stress, full beam solution | not given | about 515 MPa |
| Mismatch stress, S1 from 280 °C | not given | −239 MPa (handbook values) |

## How we made the graphs

Both charts and every number above come from `scripts/blog-figures/alumina-coating-steel-residual-stress-curvature.mjs` in fibub's public code. It calls the [[thermal-mismatch-stress]] tool's own functions from `src/lib/sci/thermalstress.ts`:

- `stoneyCurvature` and `curvatureToBow` for Step 1 (the tool's *Stress from wafer bow* mode uses the same pair the other way round).
- `multilayer` for Steps 2 and 3: the bonded-layer beam solution behind the *Bonded strip* mode. The script searches for the coating misfit that gives the Stoney curvature, then reads the stresses.
- `filmStress` for Step 4 and Figure 2 (the *Film on a substrate* mode).

The bar's sizes, the steel's modulus and Poisson's ratio, the flat temperatures and the stresses come from the paper. The coating's modulus and Poisson's ratio and both expansion coefficients are our handbook assumptions. Figure 2 is a **simulation** of the mismatch alone, not the measured stresses. We treated the bars as plates (biaxial stiffness), as Stoney's formula does; a narrow bar is closer to a beam, which changes the numbers by a few per cent.

## How we test the maths

On every change to fibub, `tests/sci-tools/thermal-mismatch-stress.mjs` (run by `tests/sci.mjs`) checks the functions against independent answers:

- The film stress for a 23 ppm/K film on a 3 ppm/K substrate cooled from 300 °C to 20 °C must be **650.60 MPa**, matching a NumPy calculation.
- The full beam solution must equal **Timoshenko's bimetal formula** for two layers (curvature 0.0026154 per mm for the test strip) and must close in on Stoney as the film thins.
- New with this article: a 0.2 mm coating at 803.3 MPa on 1 mm of steel (200 GPa, ν 0.29) must give a curvature of **0.003422 per mm**, a bow of **2.104 mm** over 70 mm, and 803.3 MPa again when the bow is turned back into a stress.

## Check it yourself

**Stress from the bend, on the [[thermal-mismatch-stress]] tool:**

1. Press **Stress from wafer bow**.
2. Type **200** in *Substrate modulus E<sub>s</sub> (GPa)*, **0.29** in *Substrate Poisson's ratio ν<sub>s</sub>*, **1000** in *Substrate thickness h<sub>s</sub> (µm)* and **200** in *Film thickness h<sub>f</sub> (µm)*.
3. Leave *I measured* on **the bow (height of the middle) over a diameter**. Type **-2104** in *Bow after (µm)*, **0** in *Bow before, bare wafer (µm)* and **70** in *Over a diameter of (mm)*. The minus sign means the coated side bulges.
4. It reads a *Film stress* of about **−803 MPa**, compression, with a radius of about 292 mm.

**The mismatch stress:** press **Film on a substrate**. Type **280** in *Stress-free temperature T<sub>0</sub>* and **20** in *Final temperature T<sub>1</sub>*; **80** in *Film modulus E<sub>f</sub> (GPa)*, **0.2** in *Film Poisson's ratio ν<sub>f</sub>*, **8.1** in *Film CTE α<sub>f</sub>* and **17.3** in *Substrate CTE α<sub>s</sub>*. It reads a *Film stress* of about **−239 MPa** (compression). Change T<sub>0</sub> to **540** for S2: about −478 MPa.

## What researchers can use it for

- **Turn a measured bend into a stress** (bow or radius) for coatings, thin films and wafers, with Stoney's formula and the sign spelled out, in the *Stress from wafer bow* mode.
- **See when Stoney is not enough:** model a thick coating as two bonded layers in the *Bonded strip* mode and compare the stress in each layer.
- **Separate the thermal part** of a residual stress from the deposition part, by setting the stress-free temperature and the two expansion coefficients in *Film on a substrate*.
- **Plan an experiment:** check that the bend a given stress causes is big enough for a camera or profilometer to measure before making samples.
- **Teach** why ceramic coatings on metal end up in compression on cooling, and why thicker coatings bend the substrate so much more.

## The fine print

- Stoney's formula assumes a thin, uniform film, a small bend and an elastic substrate. The paper's coatings are thick, so their Stoney values are upper estimates; the paper itself switches to a laminate model for the thickest one.
- Our beam solution needs the coating's stiffness, which the paper does not give; 80 GPa is our assumption for a porous sprayed coating.
- Expansion coefficients change with temperature. The tool can take a slope (tick *CTE changes with temperature*); we used constant values.
- Plastic yielding of the steel and stress relaxation in the coating, both seen in the paper, are outside the tool's elastic maths.
