---
title: "Platelet-rich plasma spins: why 1200 x g needs a rotor radius"
summary: "A 2026 review of platelet-rich plasma in orthopedics found that only 12 of 23 studies gave their spin settings. We turn its two forces into rpm for six rotor radii."
tools: [centrifuge-calculator, hemocytometer, solution-calculator]
updated: 2026-11-24
sources:
  - "Berdini M, Clementi G, Torcianti M, Del Bianco D, Cantori I, Procaccini R, Gigante A (2026), Standardization of Platelet-Rich Plasma Preparation in Orthopedics: A Review of the Literature and Proposal for a Reproducible Protocol, LabMed 3(1): 8, doi:10.3390/labmed3010008. Licence CC BY 4.0 (taken from the Crossref record, checked 2026-11-24, because the publisher's own metadata is not reliable on this point); no retraction or correction in Crossref. Values used here: 23 orthopedic studies included, 7,330 records retrieved; centrifugation parameters (RCF or rpm, and duration) reported in 12 of 23 studies and platelet counts in 6 of 23; the formula RCF = 1.118 x 10^-5 x r x rpm^2; the proposed protocol of a soft spin at 1200 x g for 10 minutes and a hard spin at 1900 x g for 10 minutes with a target platelet concentration of 1.0 x 10^6 per microlitre (plus or minus 20 %); two quoted included studies, 1889 x g for 4 minutes with 2009 x g for 3 minutes, and 100 x g for 15 minutes with 1600 x g for 20 minutes; a minimum dataset of force, time and rotor information for every spin. The full text was read on the publisher's page."
  - "RCF and k-factor: standard physics of circular motion and sedimentation, as used by the Centrifuge calculator (RCF = omega squared x r / g; standard gravity 9.80665 m/s^2, exact by definition)."
paper:
  title: "Standardization of Platelet-Rich Plasma Preparation in Orthopedics: A Review of the Literature and Proposal for a Reproducible Protocol"
  authors: "Berdini M, Clementi G, Torcianti M, Del Bianco D, Cantori I, Procaccini R, Gigante A"
  journal: "LabMed"
  year: 2026
  doi: "10.3390/labmed3010008"
  url: "https://www.mdpi.com/2813-9038/3/1/8"
  licence: "CC BY 4.0"
  reviewed: true
---

Platelet-rich plasma, or PRP, is a patient's own blood spun in a centrifuge so that the platelets collect in a small volume of plasma, then injected into a joint or tendon. A 2026 review in LabMed looked at 23 orthopedic studies and found that only 12 of them reported how the blood was spun, and the proposed protocol it ends with gives its forces without a rotor radius or a speed. That is a small gap with a large effect, because the same force needs a different speed in every rotor. This article turns the review's numbers into the settings a lab would need, and shows how big the differences are. For the maths behind it see [[centrifuge-calculator]]; for counting what ends up in the tube, [[hemocytometer]]; for making up the solutions around it, [[solution-calculator]].

## The paper in brief

The review searched the literature, retrieved **7,330 records** and kept **23 orthopedic studies** that prepared PRP. Its main complaint is about reporting. Centrifugation parameters (force or rpm, and time) were stated in **12 of the 23**, and platelet counts, before or after, in only **6 of 23**. Without these, no one can repeat a preparation or compare one study with another.

The authors give the relation between speed and force, RCF = 1.118 x 10^-5 x r x rpm^2, where r is the rotor radius in centimetres. They then propose a protocol of two spins: a **soft spin at 1200 x g for 10 minutes** and a **hard spin at 1900 x g for 10 minutes**, aiming for a final platelet concentration of 1.0 x 10^6 per microlitre, give or take 20 %. They also ask every paper to report a minimum dataset: force, time and rotor information for each spin.

Two of the studies they quote show how far protocols differ: one used 1889 x g for 4 minutes and then 2009 x g for 3 minutes, another 100 x g for 15 minutes and then 1600 x g for 20 minutes. Force is given, but nothing says what to set on the dial.

## Checked with the tools

The review's key point, that force alone is not enough to repeat a spin, is a statement about maths we can check. The [[centrifuge-calculator]] converts both ways between speed and force at any radius. Everything below is our recomputation from the paper's stated forces and times; the rotor radii are **our assumption**, since the paper gives none.

**Step 1: the paper's constant.** The tool's own constant is 1.1182 x 10^-5, which agrees with the review's 1.118 x 10^-5 to four digits.

**Step 2: the speed for each spin.** Solving the formula for speed at six radii that cover the range of benchtop rotors:

| Rotor radius (cm) | Speed for 1200 x g (rpm) | Speed for 1900 x g (rpm) | Force at 3000 rpm (x g) |
|---|---|---|---|
| 6 | 4,229 | 5,321 | 604 |
| 8 | 3,662 | 4,609 | 805 |
| 9.5 | 3,361 | 4,229 | 956 |
| 11 | 3,123 | 3,930 | 1,107 |
| 13 | 2,873 | 3,615 | 1,308 |
| 15 | 2,675 | 3,366 | 1,510 |

The same protocol needs **4,229 rpm in a 6 cm rotor and 2,675 rpm in a 15 cm rotor** for the soft spin: the small rotor must turn 1.58 times as fast. And a lab that sets 3000 rpm "because the paper's group did" gets between **604 and 1,510 x g** depending on the machine, a factor of 2.5. A hard spin intended as 1900 x g would be well under half of that in the small rotor.

<!-- fig:rpm -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 283" role="img" aria-label="Speed in rpm needed to reach 1200 x g and 1900 x g, the two spins of the proposed platelet-rich plasma protocol, for rotor radii from 5 to 15 cm. A small rotor needs about 1.6 times the speed of a large one." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Same force, different speed</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Same force, different speed</text><line x1="58" x2="546" y1="237" y2="237" style="stroke:var(--line)"/><text x="52" y="241" text-anchor="end" style="fill:var(--muted)">2e+3</text><line x1="58" x2="546" y1="190.3" y2="190.3" style="stroke:var(--line)"/><text x="52" y="194.3" text-anchor="end" style="fill:var(--muted)">3e+3</text><line x1="58" x2="546" y1="143.5" y2="143.5" style="stroke:var(--line)"/><text x="52" y="147.5" text-anchor="end" style="fill:var(--muted)">4e+3</text><line x1="58" x2="546" y1="96.8" y2="96.8" style="stroke:var(--line)"/><text x="52" y="100.8" text-anchor="end" style="fill:var(--muted)">5e+3</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">6e+3</text><line x1="58" x2="58" y1="237" y2="241" style="stroke:var(--muted)"/><text x="58" y="254" text-anchor="middle" style="fill:var(--muted)">5</text><line x1="180" x2="180" y1="237" y2="241" style="stroke:var(--muted)"/><text x="180" y="254" text-anchor="middle" style="fill:var(--muted)">7.5</text><line x1="302" x2="302" y1="237" y2="241" style="stroke:var(--muted)"/><text x="302" y="254" text-anchor="middle" style="fill:var(--muted)">10</text><line x1="424" x2="424" y1="237" y2="241" style="stroke:var(--muted)"/><text x="424" y="254" text-anchor="middle" style="fill:var(--muted)">12.5</text><line x1="546" x2="546" y1="237" y2="241" style="stroke:var(--muted)"/><text x="546" y="254" text-anchor="middle" style="fill:var(--muted)">15</text><line x1="58" x2="546" y1="237" y2="237" style="stroke:var(--muted)"/><text x="302" y="275" text-anchor="middle" style="fill:var(--ink)">Rotor radius (cm)</text><text transform="translate(14 143.5) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Speed needed (rpm)</text><path d="M58 58L70.2 64.5L82.4 70.7L94.6 76.4L106.8 81.7L119 86.7L131.2 91.5L143.4 96L155.6 100.2L167.8 104.2L180 108L192.2 111.6L204.4 115L216.6 118.3L228.8 121.5L241 124.5L253.2 127.4L265.4 130.1L277.6 132.8L289.8 135.3L302 137.8L314.2 140.2L326.4 142.4L338.6 144.6L350.8 146.8L363 148.8L375.2 150.8L387.4 152.7L399.6 154.6L411.8 156.4L424 158.1L436.2 159.8L448.4 161.5L460.6 163.1L472.8 164.6L485 166.2L497.2 167.6L509.4 169.1L521.6 170.5L533.8 171.8L546 173.1" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><text x="542" y="165.1" text-anchor="end" style="fill:var(--ink)">1900 x g</text><path d="M58 113.9L70.2 119.1L82.4 124L94.6 128.5L106.8 132.8L119 136.8L131.2 140.6L143.4 144.1L155.6 147.5L167.8 150.7L180 153.6L192.2 156.5L204.4 159.3L216.6 161.9L228.8 164.4L241 166.8L253.2 169.1L265.4 171.3L277.6 173.4L289.8 175.4L302 177.3L314.2 179.2L326.4 181L338.6 182.8L350.8 184.5L363 186.1L375.2 187.7L387.4 189.2L399.6 190.7L411.8 192.1L424 193.5L436.2 194.9L448.4 196.2L460.6 197.4L472.8 198.7L485 199.9L497.2 201L509.4 202.2L521.6 203.3L533.8 204.4L546 205.4" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><text x="542" y="197.4" text-anchor="end" style="fill:var(--ink)">1200 x g</text><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">1900 x g</text><line x1="141.6" x2="153.6" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="157.6" y="40" style="fill:var(--muted)">1200 x g</text><text class="fibub-mark" x="546" y="275" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 1. The speed needed for each of the two spins of the proposed protocol, by rotor radius. Because force grows with radius, a protocol written only in x g needs a different dial setting in every rotor.</figcaption></figure>
<!-- /fig:rpm -->

<!-- fig:force -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 283" role="img" aria-label="Relative centrifugal force against speed for rotor radii of 6, 9.5 and 15 cm. At 3000 rpm the three rotors give about 600, 960 and 1510 times gravity." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>One dial setting, three different forces</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">One dial setting, three different forces</text><line x1="58" x2="546" y1="237" y2="237" style="stroke:var(--line)"/><text x="52" y="241" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="183.6" y2="183.6" style="stroke:var(--line)"/><text x="52" y="187.6" text-anchor="end" style="fill:var(--muted)">1e+3</text><line x1="58" x2="546" y1="130.1" y2="130.1" style="stroke:var(--line)"/><text x="52" y="134.1" text-anchor="end" style="fill:var(--muted)">2e+3</text><line x1="58" x2="546" y1="76.7" y2="76.7" style="stroke:var(--line)"/><text x="52" y="80.7" text-anchor="end" style="fill:var(--muted)">3e+3</text><line x1="58" x2="58" y1="237" y2="241" style="stroke:var(--muted)"/><text x="58" y="254" text-anchor="middle" style="fill:var(--muted)">1.5e+3</text><line x1="180" x2="180" y1="237" y2="241" style="stroke:var(--muted)"/><text x="180" y="254" text-anchor="middle" style="fill:var(--muted)">2.25e+3</text><line x1="302" x2="302" y1="237" y2="241" style="stroke:var(--muted)"/><text x="302" y="254" text-anchor="middle" style="fill:var(--muted)">3e+3</text><line x1="424" x2="424" y1="237" y2="241" style="stroke:var(--muted)"/><text x="424" y="254" text-anchor="middle" style="fill:var(--muted)">3.75e+3</text><line x1="546" x2="546" y1="237" y2="241" style="stroke:var(--muted)"/><text x="546" y="254" text-anchor="middle" style="fill:var(--muted)">4.5e+3</text><line x1="58" x2="546" y1="237" y2="237" style="stroke:var(--muted)"/><text x="302" y="275" text-anchor="middle" style="fill:var(--ink)">Speed (rpm)</text><text transform="translate(14 143.5) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Force (x g)</text><line x1="58" x2="546" y1="172.9" y2="172.9" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="167.9" text-anchor="end" style="fill:var(--muted)">1200 x g</text><line x1="58" x2="546" y1="135.5" y2="135.5" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="130.5" text-anchor="end" style="fill:var(--muted)">1900 x g</text><path d="M58 228.9L70.2 228.1L82.4 227.2L94.6 226.3L106.8 225.4L119 224.4L131.2 223.4L143.4 222.3L155.6 221.2L167.8 220.1L180 218.8L192.2 217.6L204.4 216.4L216.6 215L228.8 213.7L241 212.3L253.2 210.9L265.4 209.4L277.6 207.9L289.8 206.3L302 204.7L314.2 203.1L326.4 201.4L338.6 199.7L350.8 197.9L363 196.2L375.2 194.3L387.4 192.4L399.6 190.5L411.8 188.6L424 186.6L436.2 184.5L448.4 182.4L460.6 180.4L472.8 178.2L485 176L497.2 173.7L509.4 171.5L521.6 169.1L533.8 166.8L546 164.4" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 224.2L70.2 222.9L82.4 221.6L94.6 220.1L106.8 218.6L119 217.1L131.2 215.4L143.4 213.7L155.6 212L167.8 210.1L180 208.3L192.2 206.3L204.4 204.3L216.6 202.2L228.8 200.1L241 197.9L253.2 195.6L265.4 193.3L277.6 190.9L289.8 188.4L302 185.9L314.2 183.3L326.4 180.7L338.6 178L350.8 175.2L363 172.4L375.2 169.5L387.4 166.5L399.6 163.4L411.8 160.3L424 157.2L436.2 154L448.4 150.7L460.6 147.3L472.8 143.9L485 140.4L497.2 136.9L509.4 133.3L521.6 129.6L533.8 125.9L546 122.1" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round"/><path d="M58 216.9L70.2 214.8L82.4 212.6L94.6 210.3L106.8 208L119 205.5L131.2 202.9L143.4 200.2L155.6 197.5L167.8 194.6L180 191.6L192.2 188.5L204.4 185.4L216.6 182.1L228.8 178.7L241 175.2L253.2 171.7L265.4 168L277.6 164.2L289.8 160.3L302 156.3L314.2 152.3L326.4 148.1L338.6 143.8L350.8 139.4L363 134.9L375.2 130.4L387.4 125.7L399.6 120.8L411.8 116L424 111L436.2 105.9L448.4 100.7L460.6 95.4L472.8 90L485 84.5L497.2 78.9L509.4 73.2L521.6 67.4L533.8 61.5L546 55.5" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">6 cm</text><line x1="112.8" x2="124.8" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2"/><text x="128.8" y="40" style="fill:var(--muted)">9.5 cm</text><line x1="182" x2="194" y1="36" y2="36" style="stroke:var(--ink);stroke-width:2"/><text x="198" y="40" style="fill:var(--muted)">15 cm</text><text class="fibub-mark" x="546" y="275" text-anchor="end" style="fill:var(--ink);opacity:.5;font:600 11px system-ui,sans-serif">fibub.com</text></svg><figcaption>Figure 2. Force against speed for three rotor radii. A protocol written only in rpm gives forces that differ by a factor of 2.5 between a small and a large rotor.</figcaption></figure>
<!-- /fig:force -->

**Step 3: force and time together.** The studies the review quotes also trade force against time, so we multiplied the two (our arithmetic, in x g x minutes): 1889 x g for 4 minutes is 7,556 and 2009 x g for 3 minutes is 6,027, while 100 x g for 15 minutes is 1,500 and 1600 x g for 20 minutes is 32,000. The proposed protocol is 12,000 for the soft spin and 19,000 for the hard spin. That product is only a rough yardstick of how hard a spin is, but it shows protocols differing by a factor of more than twenty while all being called "PRP".

**Step 4: moving the hard spin to another rotor.** Matching force alone ignores how far platelets must travel through the tube. The tool's k-factor does count that distance. We took two imaginary rotors, A with radii 4 to 9 cm and B with radii 5 to 12 cm, each run at the speed that gives 1900 x g at its largest radius (4,345 rpm for A, 3,763 rpm for B). Their k-factors are 10,881 and 15,662, so a 10 minute spin in A becomes **14.4 minutes in B** for the same separation. This scaling is built for particles with a sedimentation coefficient and is a rough guide for platelets, not a validated rule.

| Check | Paper says | Tool gives |
|---|---|---|
| Constant in RCF = C x r x rpm^2 | 1.118 x 10^-5 | 1.1182 x 10^-5 |
| Speed for the 1900 x g hard spin | not stated (no radius) | 4,229 rpm at 9.5 cm; 5,321 rpm at 6 cm |
| Force at 3000 rpm | not stated | 604 to 1,510 x g for radii of 6 to 15 cm |
| 10 min hard spin moved from rotor A to rotor B | not stated | 14.4 min (our assumed rotors) |

## How we made the graphs

The charts and numbers come from `scripts/blog-figures/platelet-rich-plasma-centrifugation-rcf-rpm-rotor-radius.mjs` in fibub's public code. It calls `rpmFor`, `rcf`, `RCF_CONST`, `kFactor` and `convertTime` from `src/lib/sci/centrifuge.ts`, the maths behind the [[centrifuge-calculator]]. From the paper: the two forces (1200 and 1900 x g), the 10 minute times, the two quoted studies and the constant. **Ours:** the six rotor radii, the two imaginary rotors and the product of force and time used as a yardstick.

## How we test the maths

On every change to fibub, `tests/sci.mjs` runs the checks in `tests/sci-tools/centrifuge-calculator.mjs`, which pin the tool's round trip and constant. New with this article, the tool must keep giving 4,229 rpm for 1200 x g and 5,321 rpm for 1900 x g at 6 cm, 3,361 and 4,229 rpm at 9.5 cm, a force of 1,510 at 3000 rpm and 15 cm, a constant of 1.1182 x 10^-5, and a rotor-to-rotor time of 14.4 minutes for our two assumed rotors. The rpm for a force must also turn back into the same force.

## Check it yourself

On the [[centrifuge-calculator]] page, in the speed and force card:

1. Leave *Radius unit* at **cm** and set *Radius* to **9.5**.
2. Type **1900** in *Or force (x g)* and read the speed: about **4,229 rpm**.
3. Change *Radius* to **6** and the speed rises to about **5,321 rpm**; set *Radius* to **15** and it falls to about **3,366 rpm**.
4. Clear the force box, type **3000** in *Speed (rpm)* and compare the force at radius 6 (**604 x g**), 9.5 (**956 x g**) and 15 (**1,510 x g**).
5. Open the k-factor card, enter *Minimum radius* **4**, *Maximum radius* **9** and *Speed (rpm)* **4345** to see a k-factor near **10,881**; repeat with **5**, **12** and **3763** for about **15,662**, then use the protocol card to move **10** minutes from the first to the second.

## What researchers can use it for

- **Write a method that others can repeat.** Give force, time, rotor radius (and which radius, since force differs along the tube) and the rpm used, as the review asks.
- **Translate a published protocol to your own rotor** by solving for speed at your radius with the [[centrifuge-calculator]], before any blood or cell culture is used.
- **Audit a methods section.** If a paper gives rpm but no radius, the force is unknown by up to a factor of 2.5 across ordinary rotors.
- **Check the product, not only the spin,** by counting platelets or cells with the [[hemocytometer]] to see whether the target concentration was reached.
- **Teach why units matter.** The same dial setting in two rotors makes a clear classroom example of a quantity (force) that must be stated, not a setting (rpm).

## The fine print

- The review gives forces and times but no radii or speeds, so every rpm in this article is **our recomputation at assumed radii**, not a setting used in any study.
- The two assumed rotors, and the use of a k-factor for platelets, are our own device to show the effect of rotor geometry. The k-factor method is built for particles with a sedimentation coefficient; platelets in plasma are a rough fit.
- The review did not produce new measurements of platelet recovery here; we make no claim about which spin gives the best product.
- This article describes the maths of a preparation step in a published paper. It is general education, not medical advice or a clinical protocol.
