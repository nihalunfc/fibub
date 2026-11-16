---
title: "Acteoside, a plant compound that slows copper corrosion in nitric acid"
summary: "A 2025 study finds that acteoside, from a desert plant, cuts copper's corrosion in nitric acid by up to 94%. We check its impedance and Tafel tables with fibub's Impedance fitter and Tafel corrosion rate tool."
tools: [impedance-fitter, tafel-corrosion-rate]
updated: 2026-11-16
sources:
  - "Al-Qudah, M. A., Bataineh, T. T., Abu Orabi, F. M., Abu-Orabi, S. T., Al-Mazaideh, G. M. and Alakhras, A. I. (2025), Acteoside: a novel green inhibitor for the corrosion of copper in 1.0 M HNO3 solution: experimental and theoretical investigation, RSC Advances, doi:10.1039/d5ra01657f. Licence CC BY 3.0 (checked on the article page, 2026-11-16). Values used here: Table 5 (corrosion potential, corrosion current density, Tafel slopes, inhibition efficiency and polarisation resistance for 0 to 500 ppm) and Table 6 (solution resistance, charge-transfer resistance, double-layer capacitance, CPE exponent and inhibition efficiency at 303 K)."
  - "Copper's equivalent weight (31.77 g) and density (8.96 g/cm³), and the ASTM G102 conversion from corrosion current to penetration rate, are the standard values built into fibub's Tafel corrosion rate tool."
paper:
  title: "Acteoside: a novel green inhibitor for the corrosion of copper in 1.0 M HNO3 solution: experimental and theoretical investigation"
  authors: "Al-Qudah, M. A.; Bataineh, T. T.; Abu Orabi, F. M.; Abu-Orabi, S. T.; Al-Mazaideh, G. M.; Alakhras, A. I."
  journal: "RSC Advances"
  year: 2025
  doi: "10.1039/d5ra01657f"
  url: "https://pubs.rsc.org/en/content/articlehtml/2025/ra/d5ra01657f"
  licence: "CC BY 3.0"
  reviewed: true
---

Copper is used in pipes, heat exchangers and electronics, and acids are used to clean it. Nitric acid attacks copper fast, so cleaning baths need an inhibitor: a substance that sticks to the metal and slows the attack. Many inhibitors are toxic. A 2025 study tests acteoside, a natural compound the team extracted from a desert plant, and finds it protects copper well. This article checks the study's electrochemistry tables with the [[impedance-fitter]] and the [[tafel-corrosion-rate]] tool; for the same kind of test on steel, see [[blog:discoveries/leaf-extract-corrosion-inhibitor-mild-steel]].

## The paper in brief

The team put pure copper in 1.0 M nitric acid with 0 to 500 ppm (milligrams per litre) of acteoside. They measured the attack three ways: weight loss over hours, a **polarisation scan** (sweeping the metal's voltage and recording the current) and **electrochemical impedance spectroscopy (EIS)** (a small AC signal at many frequencies). Both electrical methods show the same trend. More acteoside means a lower corrosion current and a higher resistance to the reaction at the metal surface. At 500 ppm the impedance gives an inhibition efficiency of 93.7%, and the polarisation scan gives 87.0%. The team also fitted adsorption isotherms and ran quantum-chemistry calculations to explain how the molecule binds.

Two terms come up below. The **corrosion current density** (icorr) is how fast the metal dissolves, written as an electric current per area. The **charge-transfer resistance** (Rct) is how hard it is for that reaction to happen at the surface. A good inhibitor lowers the first and raises the second.

## Checked with the tools

We used the paper's Tables 5 and 6. We did not have the measured scans, so the charts are **simulated** from the paper's fitted values and say so.

**Step 1: do the polarisation numbers hang together?** For each row, the Tafel slopes give the Stern–Geary constant B = βa βc / (2.303 (βa + βc)), and B divided by icorr should equal the polarisation resistance the paper lists. With the Tafel tool's `sternGeary` maths, the blank gives B = 20.8 mV and Rp = **29.79 Ω cm²**, against the paper's 29.80. All six rows agree to within 0.4%. The worst one is 300 ppm, at 229.6 against 230.5.

**Step 2: how fast does the copper go?** The ASTM G102 conversion in the Tafel tool turns icorr into a loss of thickness. The blank's 0.697 mA/cm² is **8.08 mm a year**. With 500 ppm acteoside it falls to **1.06 mm a year**. That is still fast by engineering standards, but a cleaning bath only runs for minutes to hours. The efficiencies from icorr (61.8, 69.9, 81.9, 85.2 and 86.9%) match the paper's column to within 0.1 point.

**Step 3: the impedance arcs.** We built a simulated spectrum for the blank and for 500 ppm from the paper's Rs, Rct, capacitance and CPE exponent. A CPE (constant phase element) is a "leaky" capacitor that flattens the arc. We added 0.5% noise and let the Impedance fitter's Rs + (Rct ‖ CPE) model fit it without the answer. It returned Rct = **240.0** and **3,790 Ω cm²**, exponents 0.770 and 0.750, and effective capacitances of 286 and 197 µF/cm², all as put in (Figure 1). The arc grows nearly sixteen times wider with the inhibitor. Rct gives efficiencies of 86.04, 87.84, 89.50, 90.81 and 93.67%, exactly the paper's column.

<!-- fig:nyq -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="The blank gives a small flattened arc about 240 ohm square centimetres wide; with 500 ppm acteoside the arc is about 3,800 wide, sixteen times larger." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Simulated Nyquist plots from the paper's circuit values</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Simulated Nyquist plots from the paper's circuit values</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--line)"/><text x="52" y="256" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="184.7" y2="184.7" style="stroke:var(--line)"/><text x="52" y="188.7" text-anchor="end" style="fill:var(--muted)">500</text><line x1="58" x2="546" y1="117.3" y2="117.3" style="stroke:var(--line)"/><text x="52" y="121.3" text-anchor="end" style="fill:var(--muted)">1e+3</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">1.5e+3</text><line x1="58" x2="58" y1="252" y2="256" style="stroke:var(--muted)"/><text x="58" y="269" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="180" x2="180" y1="252" y2="256" style="stroke:var(--muted)"/><text x="180" y="269" text-anchor="middle" style="fill:var(--muted)">1e+3</text><line x1="302" x2="302" y1="252" y2="256" style="stroke:var(--muted)"/><text x="302" y="269" text-anchor="middle" style="fill:var(--muted)">2e+3</text><line x1="424" x2="424" y1="252" y2="256" style="stroke:var(--muted)"/><text x="424" y="269" text-anchor="middle" style="fill:var(--muted)">3e+3</text><line x1="546" x2="546" y1="252" y2="256" style="stroke:var(--muted)"/><text x="546" y="269" text-anchor="middle" style="fill:var(--muted)">4e+3</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">Z′ (Ω cm²)</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">−Z″ (Ω cm²)</text><circle cx="58.2" cy="252" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="58.2" cy="252" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="58.2" cy="252" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="58.2" cy="252" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="58.2" cy="252" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="58.2" cy="252" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="58.2" cy="251.9" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="58.2" cy="251.9" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="58.2" cy="251.9" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="58.3" cy="251.9" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="58.3" cy="251.8" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="58.3" cy="251.8" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="58.3" cy="251.7" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="58.4" cy="251.5" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="58.4" cy="251.4" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="58.5" cy="251.2" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="58.6" cy="250.9" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="58.8" cy="250.5" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="59.1" cy="250" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="59.4" cy="249.3" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="59.9" cy="248.4" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="60.7" cy="247.3" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="61.7" cy="245.9" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="63.3" cy="244.4" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="65.4" cy="242.9" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="68.1" cy="241.7" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="71.2" cy="241" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="74.6" cy="240.9" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="77.7" cy="241.6" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="80.3" cy="243" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="82.6" cy="244.5" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="84" cy="246" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="85.1" cy="247.3" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="85.9" cy="248.4" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="86.3" cy="249.3" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="86.7" cy="250" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="86.8" cy="250.5" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="87.2" cy="250.9" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="87.1" cy="251.2" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="87.2" cy="251.4" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="87.2" cy="251.5" r="2.6" style="fill:var(--c-blog);opacity:1"/><circle cx="58.1" cy="252" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="58.1" cy="252" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="58.1" cy="251.9" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="58.2" cy="251.9" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="58.2" cy="251.9" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="58.2" cy="251.9" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="58.2" cy="251.8" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="58.2" cy="251.8" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="58.2" cy="251.7" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="58.3" cy="251.6" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="58.3" cy="251.5" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="58.4" cy="251.3" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="58.5" cy="251" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="58.6" cy="250.7" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="58.8" cy="250.2" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="59" cy="249.5" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="59.4" cy="248.7" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="59.8" cy="247.6" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="60.5" cy="246" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="61.3" cy="243.9" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="62.5" cy="241.1" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="64.1" cy="237.3" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="66.3" cy="232.3" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="69.5" cy="225.7" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="74" cy="217.2" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="80.3" cy="205.9" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="89.2" cy="191.9" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="102.1" cy="174.3" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="120.3" cy="154.2" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="145.5" cy="131.6" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="178.6" cy="109.6" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="221.4" cy="92" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="269.3" cy="82.9" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="320.1" cy="83.7" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="365.4" cy="94.9" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="406.5" cy="114.4" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="438.8" cy="135.7" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="462" cy="158.6" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="480.8" cy="177.9" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="492.4" cy="195" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="498.8" cy="208.5" r="2.6" style="fill:var(--c-tools);opacity:1"/><circle cx="63" cy="36" r="4" style="fill:var(--c-blog)"/><text x="74" y="40" style="fill:var(--muted)">Blank (simulated)</text><circle cx="211.4" cy="36" r="4" style="fill:var(--c-tools)"/><text x="222.4" y="40" style="fill:var(--muted)">500 ppm acteoside (simulated)</text></svg><figcaption>Figure 1. Simulated impedance spectra (Nyquist plots), 10 mHz to 100 kHz, built from the paper's Rs, Rct, double-layer capacitance and CPE exponent for the blank and 500 ppm, with 0.5% noise. Simulated, not the measured data.</figcaption></figure>
<!-- /fig:nyq -->

**Step 4: a pitfall with flat Tafel lines.** At 500 ppm the paper's cathodic slope is 1,095 mV per decade: the cathodic current hardly changes with voltage. We simulated the scan (Figure 2) and ran the Tafel tool's two methods on it. Straight lines fitted 80 to 200 mV from Ecorr give icorr = **82 µA/cm²**, 10% low, because a branch that steep never reaches a clean straight section within 200 mV. The full Wagner–Traud fit, which the tool also runs, recovers the true 91.0 µA/cm². For the blank, both methods agree within 2%.

<!-- fig:pol -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 298" role="img" aria-label="Both curves dip to a sharp minimum at the corrosion potential; the inhibited curve sits about a factor of eight lower and has a much steeper cathodic branch." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Simulated polarisation curves</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Simulated polarisation curves</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--line)"/><text x="52" y="256" text-anchor="end" style="fill:var(--muted)">1e-7</text><line x1="58" x2="546" y1="215.3" y2="215.3" style="stroke:var(--line)"/><text x="52" y="219.3" text-anchor="end" style="fill:var(--muted)">1e-6</text><line x1="58" x2="546" y1="178.5" y2="178.5" style="stroke:var(--line)"/><text x="52" y="182.5" text-anchor="end" style="fill:var(--muted)">1e-5</text><line x1="58" x2="546" y1="141.8" y2="141.8" style="stroke:var(--line)"/><text x="52" y="145.8" text-anchor="end" style="fill:var(--muted)">1e-4</text><line x1="58" x2="546" y1="105.1" y2="105.1" style="stroke:var(--line)"/><text x="52" y="109.1" text-anchor="end" style="fill:var(--muted)">1e-3</text><line x1="58" x2="546" y1="68.4" y2="68.4" style="stroke:var(--line)"/><text x="52" y="72.4" text-anchor="end" style="fill:var(--muted)">1e-2</text><line x1="110.3" x2="110.3" y1="252" y2="256" style="stroke:var(--muted)"/><text x="110.3" y="269" text-anchor="middle" style="fill:var(--muted)">-200</text><line x1="197.4" x2="197.4" y1="252" y2="256" style="stroke:var(--muted)"/><text x="197.4" y="269" text-anchor="middle" style="fill:var(--muted)">-100</text><line x1="284.6" x2="284.6" y1="252" y2="256" style="stroke:var(--muted)"/><text x="284.6" y="269" text-anchor="middle" style="fill:var(--muted)">0</text><line x1="371.7" x2="371.7" y1="252" y2="256" style="stroke:var(--muted)"/><text x="371.7" y="269" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="458.9" x2="458.9" y1="252" y2="256" style="stroke:var(--muted)"/><text x="458.9" y="269" text-anchor="middle" style="fill:var(--muted)">200</text><line x1="546" x2="546" y1="252" y2="256" style="stroke:var(--muted)"/><text x="546" y="269" text-anchor="middle" style="fill:var(--muted)">300</text><line x1="58" x2="546" y1="252" y2="252" style="stroke:var(--muted)"/><text x="302" y="290" text-anchor="middle" style="fill:var(--ink)">E (mV, as printed in the paper)</text><text transform="translate(14 151) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Current density (A/cm²)</text><path d="M63.1 -32.6L68.3 -29.2L73.5 -25.7L78.7 -22.3L84 -18.8L89.2 -15.4L94.4 -12L99.7 -8.5L104.9 -5.1L110.1 -1.6L115.3 1.8L120.6 5.3L125.8 8.7L131 12.1L136.3 15.6L141.5 19L146.7 22.5L151.9 25.9L157.2 29.4L162.4 32.8L167.6 36.3L172.9 39.7L178.1 43.2L183.3 46.7L188.5 50.1L193.8 53.6L199 57.1L204.2 60.6L209.5 64.1L214.7 67.7L219.9 71.2L225.1 74.9L230.4 78.6L235.6 82.4L240.8 86.3L246.1 90.4L251.3 94.8L256.5 99.6L261.7 105L267 111.6L272.2 120.4L277.4 136.3L282.7 148.5L287.9 127.5L293.1 119.5L298.3 114.6L303.6 111.2L308.8 108.5L314 106.2L319.3 104.3L324.5 102.6L329.7 101.1L334.9 99.6L340.2 98.3L345.4 96.9L350.6 95.7L355.9 94.4L361.1 93.2L366.3 91.9L371.5 90.7L376.8 89.6L382 88.3L387.2 87.2L392.5 86L397.7 84.8L402.9 83.6L408.1 82.5L413.4 81.3L418.6 80.2L423.8 79L429.1 77.8L434.3 76.6L439.5 75.5L444.7 74.3L450 73.1L455.2 72L460.4 70.8L465.7 69.6L470.9 68.5L476.1 67.3L481.3 66.1L486.6 64.9L491.8 63.8L497 62.6" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M100.4 135L105.6 135.1L110.8 135.4L116 135.5L121.3 135.8L126.5 136L131.7 136.2L137 136.4L142.2 136.6L147.4 136.8L152.6 137L157.9 137.2L163.1 137.4L168.3 137.6L173.6 137.9L178.8 138.1L184 138.3L189.2 138.5L194.5 138.8L199.7 139L204.9 139.2L210.2 139.5L215.4 139.8L220.6 140.1L225.8 140.4L231.1 140.7L236.3 141.1L241.5 141.5L246.8 141.9L252 142.4L257.2 142.9L262.4 143.5L267.7 144.3L272.9 145.2L278.1 146.2L283.4 147.5L288.6 149.1L293.8 151.1L299 153.9L304.3 157.8L309.5 164.1L314.7 177.6L320 187.3L325.2 163.9L330.4 153.6L335.6 146.5L340.9 140.9L346.1 136.1L351.3 131.8L356.6 127.9L361.8 124.2L367 120.8L372.2 117.4L377.5 114.2L382.7 111.1L387.9 108.1L393.2 105.1L398.4 102.1L403.6 99.2L408.8 96.3L414.1 93.4L419.3 90.6L424.5 87.8L429.8 85L435 82.1L440.2 79.3L445.4 76.6L450.7 73.8L455.9 71L461.1 68.3L466.4 65.5L471.6 62.7L476.8 60L482 57.2L487.3 54.4L492.5 51.7L497.7 48.9L503 46.1L508.2 43.4L513.4 40.6L518.6 37.9L523.9 35.1L529.1 32.4L534.3 29.6" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">Blank (simulated)</text><line x1="206.4" x2="218.4" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="222.4" y="40" style="fill:var(--muted)">500 ppm (simulated)</text></svg><figcaption>Figure 2. Simulated polarisation curves from the paper's Tafel parameters for the blank and 500 ppm, with the Tafel tool's Wagner–Traud maths. Simulated, not the measured scans.</figcaption></figure>
<!-- /fig:pol -->

| Check | Paper | Our tool result |
|---|---|---|
| Rp from Tafel slopes and icorr (blank, 500 ppm) | 29.80, 356.88 Ω cm² | 29.79, 356.26 Ω cm² |
| Corrosion rate, blank and 500 ppm | (icorr 0.697 and 0.091 mA/cm²) | 8.08 and 1.06 mm/year |
| Inhibition efficiency from icorr (500 ppm) | 87.0% | 86.9% |
| Inhibition efficiency from Rct (500 ppm) | 93.67% | 93.67% |
| Rct recovered from a simulated spectrum (500 ppm) | 3,789.5 Ω cm² | 3,790 Ω cm² |
| icorr from Tafel lines vs full fit (500 ppm, simulated) | 0.091 mA/cm² | 82 vs 91.0 µA/cm² |

## How we made the graphs

The charts and every number above come from `scripts/blog-figures/copper-acteoside-corrosion-inhibitor-nitric-acid-eis-tafel.mjs` in fibub's public code. It calls the tools' own functions:

- `MODELS`, `fitEIS` and `cEff` from `src/lib/sci/eis.ts`, the maths of the [[impedance-fitter]].
- `bv`, `tafel`, `fitBV`, `sternGeary` and `rateMmY` from `src/lib/sci/corrosion.ts`, the maths of the [[tafel-corrosion-rate]] tool.

Inputs: every Tafel and impedance value is from the paper's Tables 5 and 6. Copper's equivalent weight and density are the literature values in the tool. Our assumptions, labelled in the script: the paper's double-layer capacitance is the Hsu–Mansfeld effective capacitance (we turned it back into a CPE value with it); the spectra run from 10 mHz to 100 kHz with 0.5% noise; the scans run ±250 mV in 2 mV steps. The spectra and scans are **simulated**.

## How we test the maths

On every change to fibub, `tests/sci.mjs` checks these functions against known answers:

- Each of the Impedance fitter's five circuits must recover its exact made-up values to one part in a million (for R(RQ): Rs 15 Ω, Rct 200 Ω, Q 10⁻⁵, α 0.85). On its noisy example cell, Rct must come back as 100 ± 0.3 Ω.
- The exchange current density for 1 Ω cm² at 25 °C must be 0.025693 A/cm², and the Hsu–Mansfeld capacitance must equal Q when α is 1.
- The Tafel tool's ASTM G102 rate for 1 µA/cm² on iron must be 0.0116 mm a year, and the Stern–Geary B for 60 and 120 mV per decade must be 17.372 mV. On a simulated steel scan, the B/Rp current must come back as 10 ± 0.3 µA/cm².

## Check it yourself

**The corrosion rate, on the [[tafel-corrosion-rate]] tool.** Paste this simulated scan of the blank (potential in mV, current density in mA/cm², made from the paper's Table 5) into *Potential and current, one pair per line*:

```
-244.23	-3919
-224.23	-1909
-204.23	-929.4
-184.23	-452.5
-164.23	-220.3
-144.23	-107.2
-124.23	-52.11
-104.23	-25.25
-84.23	-12.13
-64.23	-5.700
-44.23	-2.511
-24.23	-0.8851
-4.23	0
15.77	0.5500
35.77	0.9697
55.77	1.368
75.77	1.809
95.77	2.339
115.77	3.000
135.77	3.836
155.77	4.899
175.77	6.253
195.77	7.980
215.77	10.18
235.77	13.00
```

1. Set *Potential unit* to **mV** and *Current unit* to **mA/cm²**. Leave *Tafel range from (mV)* at 80 and *to (mV from Ecorr)* at 200.
2. Choose **Copper (Cu²⁺)** in *Metal*.
3. The headline reads **icorr 697 µA/cm²: about 8.081 mm per year**. The Wagner–Traud row of the table shows βa 188.9 and βc 64.0 mV/dec, as in the paper.

**The impedance, on the [[impedance-fitter]].** Paste this simulated blank spectrum (frequency in Hz, Z′ and Z″ in Ω for 1 cm²) into *Frequency and impedance, three columns, one frequency per line*:

```
100000 1.7729 -0.060456
31620 1.8055 -0.14666
10000 1.885 -0.35566
3162 2.0791 -0.86166
1000 2.5578 -2.0827
316.2 3.7625 -5.0049
100 6.9241 -11.849
31.62 15.772 -26.938
10 41.213 -54.505
3.162 100.62 -81.185
1 174.61 -71.541
0.3162 217.12 -40.452
0.1 232.92 -18.672
0.03162 238.4 -8.0213
0.01 240.43 -3.3591
```

1. Keep *Columns are* on **f, Z′, Z″** and choose **R(RQ)** in *Equivalent circuit*.
2. Type **1** in *Electrode area (cm², optional)*.
3. The fit gives Rs **1.75 Ω**, Rct **240 Ω**, α **0.770**, and *Effective capacitance (Rct arc)* about **287 µF/cm²**, the paper's blank row. Note that the tool says a double layer is typically 10 to 50 µF/cm², so the paper's values sit well above the usual range.

## What researchers can use it for

- **Audit a corrosion table**: Stern–Geary turns Tafel slopes and icorr into Rp, so a row that disagrees stands out ([[tafel-corrosion-rate]]).
- **Turn icorr into mm per year** for any common metal, with the ASTM G102 conversion.
- **Fit impedance spectra** to common circuits and get Rct, the CPE and its effective capacitance in one go ([[impedance-fitter]]).
- **Spot a misleading Tafel fit**: compare straight-line extrapolation with the full Wagner–Traud fit when one branch is very flat.
- **Teach** why impedance and polarisation give different efficiencies for the same inhibitor.

## The fine print

- The paper's tables give the polarisation results without a stated temperature and the impedance at 303 K. The electrode area for the electrical tests is not given, so we worked per cm² throughout.
- The paper prints the corrosion potentials with the unit "mV s⁻¹" and shows the inhibited values as positive. We used them as printed. Only the shift matters for our checks: +43 mV at 500 ppm.
- Our spectra and scans are **simulated** from the paper's fitted values. They show that the tools recover those values, not what the measured data look like.
- The impedance and polarisation efficiencies differ (93.7% against 87.0% at 500 ppm). Different methods often give different values, and the flat cathodic branch (Step 4) is one reason why.
