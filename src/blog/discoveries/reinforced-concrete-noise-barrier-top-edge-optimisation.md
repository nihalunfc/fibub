---
title: "Noise barrier top edge shape: optimising a reinforced concrete barrier with FEM"
summary: "A 2026 study finds a 3 m concrete noise barrier with a V-shaped top beats a 4.4 m plain wall of the same volume. We check the plain walls with fibub's Maekawa barrier maths."
tools: [noise-barrier, decibel-distance, noise-dose]
updated: 2026-11-16
sources:
  - "Jovanoska-Mitrevska, M., Samardzioska, T. and Mickovski, S. B. (2026), Application and Optimization of Reinforced Concrete Noise Barrier, Buildings 16(4), 745, doi:10.3390/buildings16040745. Licence CC BY, checked on the article page, 2026-11-16. Values used here: barrier 150 mm thick, 3 m high (NB1 to NB4) and 4.4 m high (NB5, plain, same volume as the V-topped designs); point source 1 m high, 5 m in front of the barrier; nine receivers 7, 14 and 21 m behind it at heights 1, 3.5 and 6 m; 1/3-octave bands 100 to 3,150 Hz; objective values J of 687.8 dB (NB1), 653 dB (NB2), 616.7 dB (NB3), 604.3 dB (NB4) and 641.7 dB (NB5)."
  - "Maekawa, Z. (1968), Noise reduction by screens, Applied Acoustics 1, 157-173 (the barrier chart); Kurze, U. J. and Anderson, G. S. (1971), Sound attenuation by barriers, Applied Acoustics 4, 35-53 (the closed form used by the tool)."
  - "Speed of sound in air at 20 °C, 343.2 m/s (our assumption for the calculations; standard formula)."
paper:
  title: "Application and Optimization of Reinforced Concrete Noise Barrier"
  authors: "Jovanoska-Mitrevska, M.; Samardzioska, T.; Mickovski, S. B."
  journal: "Buildings"
  year: 2026
  doi: "10.3390/buildings16040745"
  url: "https://www.mdpi.com/2075-5309/16/4/745"
  licence: "CC BY"
  reviewed: true
---

Noise barriers along roads and railways are usually plain walls, and the usual way to make one work better is to make it taller. Taller means more concrete, more wind load and bigger foundations. A 2026 study asks whether shaping the top edge does more for the same amount of material, and finds that it does. This article uses the [[noise-barrier]] calculator to check what a plain wall should give at the paper's receivers, and what raising it from 3 m to 4.4 m is worth by the classic rule. The [[decibel-distance]] calculator shows how a point source and a line source fade differently with distance and adds or averages levels, and [[noise-dose]] turns levels at a home or workplace into a daily exposure.

## The paper in brief

The authors modelled five reinforced concrete barriers, all 150 mm thick, with **COMSOL Multiphysics**, a finite-element (FEM) program that solves the sound field and the concrete's response together. Four are 3 m tall: a plain wall (NB1), a T-shaped top (NB2), a symmetric V-shaped top (NB3) and an asymmetric V-shaped top (NB4). The fifth, NB5, is a plain wall **4.4 m** tall, chosen to use the same volume of concrete as the V-topped designs. An optimiser (BOBYQA, a method that improves a design without needing slopes of the objective) then tuned the widths and angles of the top edges.

A sound source sits 1 m above the ground and 5 m in front of the wall. Nine listening points sit 7, 14 and 21 m behind it, at heights of 1, 3.5 and 6 m. The score, called *J*, adds up the average sound level at the nine points over sixteen **1/3-octave bands** (narrow slices of the frequency range) from 100 to 3,150 Hz. Lower is better.

The ranking: the asymmetric V top did best (J = 604.3 dB), then the symmetric V (616.7), the 4.4 m plain wall (641.7), the T top (653) and the plain 3 m wall (687.8). So a 3 m wall with a shaped top beat a plain wall nearly 50% taller built from the same concrete. The authors note that their model is two-dimensional, so effects along the wall's length are left out.

## Checked with the tools

The Noise barrier calculator uses the classic method for a long, thin, plain wall. It works out the **path difference** δ: how much further sound travels going over the top than straight through. With the wavelength λ that gives the **Fresnel number** N = 2δ/λ, and Maekawa's chart (in the closed form of Kurze and Anderson) turns N into an **insertion loss**, the drop in level the wall causes. It cannot model a T or V top, so we checked the two plain walls, NB1 and NB5, at the paper's own geometry. We assumed air at 20 °C and set no cap on the loss, as a numerical model has none.

**Step 1: who is in the shadow.** For the 3 m wall, the path difference at the middle receiver (14 m back, 3.5 m up) is **230 mm**. At the receiver 7 m back and 6 m up the straight line from the source just clears the top by about **8 cm**: that window is barely shaded, and the chart gives it the 5 dB of a grazing path. Raising the wall to 4.4 m lengthens every path difference, to **912 mm** at the middle receiver and 227 mm at the exposed one.

**Step 2: insertion loss across the bands.** Higher frequencies have shorter wavelengths and bend over the top less, so the loss climbs with frequency (Figure 1). At the middle receiver and 500 Hz the Fresnel number is 0.67 and the loss **11.5 dB** for the 3 m wall; the 4.4 m wall gives **17.2 dB**. Over the nine receivers the 3 m wall's loss at 500 Hz ranges from 5 dB (the exposed upper window) to 15.9 dB (the low point nearest the wall).

<!-- fig:il -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 308" role="img" aria-label="Insertion loss rises with frequency for both barriers; the 4.4 m barrier gives about 5 to 6 dB more than the 3 m one in every band." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Insertion loss behind the barrier, receiver 14 m back and 3.5 m up</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Insertion loss behind the barrier, receiver 14 m back and 3.5 m up</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--line)"/><text x="52" y="266" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="191.3" y2="191.3" style="stroke:var(--line)"/><text x="52" y="195.3" text-anchor="end" style="fill:var(--muted)">10</text><line x1="58" x2="546" y1="120.7" y2="120.7" style="stroke:var(--line)"/><text x="52" y="124.7" text-anchor="end" style="fill:var(--muted)">20</text><line x1="58" x2="546" y1="50" y2="50" style="stroke:var(--line)"/><text x="52" y="54" text-anchor="end" style="fill:var(--muted)">30</text><line x1="58" x2="58" y1="262" y2="266" style="stroke:var(--muted)"/><text x="58" y="279" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="156" x2="156" y1="262" y2="266" style="stroke:var(--muted)"/><text x="156" y="279" text-anchor="middle" style="fill:var(--muted)">200</text><line x1="285.7" x2="285.7" y1="262" y2="266" style="stroke:var(--muted)"/><text x="285.7" y="279" text-anchor="middle" style="fill:var(--muted)">500</text><line x1="383.7" x2="383.7" y1="262" y2="266" style="stroke:var(--muted)"/><text x="383.7" y="279" text-anchor="middle" style="fill:var(--muted)">1k</text><line x1="481.7" x2="481.7" y1="262" y2="266" style="stroke:var(--muted)"/><text x="481.7" y="279" text-anchor="middle" style="fill:var(--muted)">2k</text><line x1="58" x2="546" y1="262" y2="262" style="stroke:var(--muted)"/><text x="302" y="300" text-anchor="middle" style="fill:var(--ink)">Frequency (Hz, 1/3-octave bands)</text><text transform="translate(14 156) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Insertion loss (dB)</text><path d="M58 186.5L89.6 180.7L124.5 174L156 167.7L187.6 161.2L220.3 154.3L254.1 147L285.7 140.2L318.3 133.2L352.1 125.8L383.7 119L415.3 112.2L450.2 104.6L481.7 97.8L513.3 90.9L546 83.8" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/><path d="M58 212.2L89.6 209.2L124.5 205.4L156 201.4L187.6 197.1L220.3 192L254.1 186.2L285.7 180.5L318.3 174.2L352.1 167.4L383.7 160.9L415.3 154.2L450.2 146.7L481.7 140L513.3 133.1L546 126" style="fill:none;stroke:var(--c-tools);stroke-width:2;stroke-linejoin:round;stroke-dasharray:true"/><line x1="58" x2="70" y1="36" y2="36" style="stroke:var(--c-blog);stroke-width:2"/><text x="74" y="40" style="fill:var(--muted)">4.4 m vertical (NB5)</text><line x1="228" x2="240" y1="36" y2="36" style="stroke:var(--c-tools);stroke-width:2;stroke-dasharray:true"/><text x="244" y="40" style="fill:var(--muted)">3 m vertical (NB1)</text></svg><figcaption>Figure 1. Insertion loss of the 3 m and 4.4 m plain vertical barriers at the middle receiver, from the Noise barrier calculator's maths (Kurze–Anderson form of Maekawa's chart, point source, no ground). Geometry from the paper; air at 20 °C assumed.</figcaption></figure>
<!-- /fig:il -->

**Step 3: how much is the extra 1.4 m worth?** The paper's J values are sums of levels, not losses, but because the source and receivers are the same in every case, the difference between two designs' J values divided by sixteen bands is the average extra loss per band. For NB1 to NB5 that is (687.8 − 641.7) ÷ 16 = **2.9 dB**. The simple chart predicts **5.5 dB**: from 3.4 dB at 100 Hz to 7.0 dB at 3,150 Hz (Figure 2).

<!-- fig:extra -->
<figure class="blog-figure"><svg class="blog-fig" viewBox="0 0 560 280" role="img" aria-label="The simple chart predicts about 5.5 dB of extra loss per band from the taller barrier, while the paper's finite-element results average 2.9 dB." xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font:13px system-ui,sans-serif"><title>Extra loss from raising the barrier 3 m to 4.4 m</title><text x="58" y="18" style="fill:var(--ink);font-weight:600;font-size:14px">Extra loss from raising the barrier 3 m to 4.4 m</text><line x1="58" x2="546" y1="234" y2="234" style="stroke:var(--line)"/><text x="52" y="238" text-anchor="end" style="fill:var(--muted)">0</text><line x1="58" x2="546" y1="183.5" y2="183.5" style="stroke:var(--line)"/><text x="52" y="187.5" text-anchor="end" style="fill:var(--muted)">2</text><line x1="58" x2="546" y1="133" y2="133" style="stroke:var(--line)"/><text x="52" y="137" text-anchor="end" style="fill:var(--muted)">4</text><line x1="58" x2="546" y1="82.5" y2="82.5" style="stroke:var(--line)"/><text x="52" y="86.5" text-anchor="end" style="fill:var(--muted)">6</text><line x1="58" x2="546" y1="32" y2="32" style="stroke:var(--line)"/><text x="52" y="36" text-anchor="end" style="fill:var(--muted)">8</text><line x1="58" x2="58" y1="234" y2="238" style="stroke:var(--muted)"/><text x="58" y="251" text-anchor="middle" style="fill:var(--muted)">100</text><line x1="156" x2="156" y1="234" y2="238" style="stroke:var(--muted)"/><text x="156" y="251" text-anchor="middle" style="fill:var(--muted)">200</text><line x1="285.7" x2="285.7" y1="234" y2="238" style="stroke:var(--muted)"/><text x="285.7" y="251" text-anchor="middle" style="fill:var(--muted)">500</text><line x1="383.7" x2="383.7" y1="234" y2="238" style="stroke:var(--muted)"/><text x="383.7" y="251" text-anchor="middle" style="fill:var(--muted)">1k</text><line x1="481.7" x2="481.7" y1="234" y2="238" style="stroke:var(--muted)"/><text x="481.7" y="251" text-anchor="middle" style="fill:var(--muted)">2k</text><line x1="58" x2="546" y1="234" y2="234" style="stroke:var(--muted)"/><text x="302" y="272" text-anchor="middle" style="fill:var(--ink)">Frequency (Hz, 1/3-octave bands)</text><text transform="translate(14 133) rotate(-90)" text-anchor="middle" style="fill:var(--ink)">Mean extra loss, nine receivers (dB)</text><line x1="58" x2="546" y1="161.3" y2="161.3" style="stroke:var(--muted);stroke-dasharray:4 4"/><text x="542" y="156.3" text-anchor="end" style="fill:var(--muted)">Paper's FEM, mean of all bands: 2.9 dB</text><path d="M58 149.2L89.6 139.8L124.5 130L156 121.1L187.6 112.8L220.3 105L254.1 97.4L285.7 91.1L318.3 85L352.1 79.7L383.7 75.2L415.3 70.9L450.2 66.8L481.7 63.3L513.3 60L546 56.7" style="fill:none;stroke:var(--c-blog);stroke-width:2;stroke-linejoin:round"/></svg><figcaption>Figure 2. Extra insertion loss from raising a plain vertical barrier from 3 m to 4.4 m, averaged over the paper's nine receivers, band by band (line), against the average per band implied by the paper's published objective values (dashed level).</figcaption></figure>
<!-- /fig:extra -->

**Step 4: reading the gap.** The chart's prediction for the extra height is about twice the FEM result. Both are reasonable for what they model. Maekawa's chart was built from measurements with a point source and no ground, while the paper's two-dimensional model behaves like an infinitely long line source, and sound reflected from the ground can add paths the chart ignores. Both effects usually make a wall's extra height worth less than the chart says. Our numbers suggest that for this geometry the chart over-rates a plain wall's extra height by around 2 to 3 dB per band, which makes the paper's finding about shaped tops more striking, not less: per tonne of concrete, shaping the top beat simply adding height in the FEM model.

| Check | Paper | Our tool result |
|---|---|---|
| Path difference, middle receiver, 3 m wall | (not given) | 230 mm (912 mm at 4.4 m) |
| Insertion loss at 500 Hz, middle receiver | (not given) | 11.5 dB (3 m), 17.2 dB (4.4 m) |
| Exposed receiver, 7 m back and 6 m up | (not given) | line of sight clears the 3 m top by 8 cm |
| Extra loss from 3 m to 4.4 m, mean per band | 2.9 dB (from J: 687.8 to 641.7) | 5.5 dB by Maekawa's chart |
| Best design | asymmetric V top, J = 604.3 dB | not modelled (plain walls only) |

## How we made the graphs

The charts and every number above come from `scripts/blog-figures/reinforced-concrete-noise-barrier-top-edge-optimisation.mjs` in fibub's public code. It calls the Noise barrier calculator's own functions from `src/lib/sci/barrier.ts`:

- `pathDiff` for the path difference over the top at each receiver;
- `kurzeAnderson` for the insertion loss from the Fresnel number, band by band;
- `soundSpeed` for the speed of sound at 20 °C.

The source and receiver positions, wall heights, frequency bands and J values are the paper's. The air temperature and the 30 dB cap (which no band reaches) are our choices, labelled in the script. The tool itself works in full octave bands; the script calls the same formula at the paper's 1/3-octave centre frequencies. Nothing is simulated. Run the script and it prints every value and redraws both charts.

## How we test the maths

On every change to fibub, `tests/sci.mjs` checks the barrier maths against an independent NumPy implementation and known values:

- For a source 0.5 m high and 10 m from a 4 m wall, and a receiver 30 m behind it at 1.5 m, the path difference must be **0.68630 m**, and the insertion loss at 500 Hz **16.04 dB** (Kurze–Anderson) and **13.65 dB** (the simpler 10·lg(3 + 20δ/λ) form).
- A Fresnel number of 1 must give about **13.1 dB**, the value read from Maekawa's chart, and a grazing path (N = 0) exactly **5 dB**.
- With a clear line of sight the loss must be zero, and no band may exceed the chosen cap.

## Check it yourself

On the [[noise-barrier]] calculator, rebuild the middle receiver for the paper's plain 3 m wall:

1. Under *Cross-section*, type **1** in *Source height (m)*, **5** in *Source to barrier (m)*, **3** in *Barrier height (m)*, **14** in *Barrier to receiver (m)* and **3.5** in *Receiver height (m)*.
2. Type **20** in *Air temperature (°C)* and leave *Method* on **Kurze–Anderson (Maekawa curve)**. Type **30** in *Most a barrier can give (dB)*.
3. *Path difference δ* reads **230 mm** and *Fresnel number at 500 Hz* reads **0.671**. In the band table, the 500 Hz row's *Loss (dB)* is **11.5**.
4. Change *Barrier height (m)* to **4.4**. The path difference becomes **912 mm** and the 500 Hz loss **17.2 dB**.
5. Try *Barrier to receiver (m)* **7** and *Receiver height (m)* **6** with the 3 m wall: *Line of sight* reads **not broken**, the straight line passing just above the top.

The headline dB(A) figure depends on the levels you type under *Sound at the receiver without the barrier*; the paper used a source of about 94 dB, so its J values cannot be turned into dB(A) directly.

## What researchers can use it for

- **A first estimate before FEM:** the [[noise-barrier]] calculator gives the plain-wall loss at any receiver in seconds, a baseline against which a shaped top's extra benefit can be judged.
- **Spot exposed receivers:** the *Line of sight* line shows at once which upper-floor windows a wall barely shades, as for the 6 m receiver here.
- **Trade height against cost:** compare the chart's gain from extra height with what a numerical model or field test gives, as in Step 3.
- **Combine and average levels** across bands or receivers, and compare point and line sources, with the [[decibel-distance]] calculator, and turn the levels at a façade into a daily exposure with [[noise-dose]].
- **Teach diffraction:** the band table shows plainly why low-pitched traffic rumble gets through a barrier more easily than tyre hiss.

## The fine print

- The Noise barrier calculator handles a long, thin, plain wall over flat ground, with a point source; it does not model T, V or other top shapes, reflections from the ground or from a second wall, or wind. The paper's best designs are therefore not checked here.
- The 2.9 dB average comes from the paper's J values, which are averages of decibel levels at the nine receivers; we have not seen its per-receiver results.
- The paper's model is two-dimensional (in effect a line source along the wall), while Maekawa's chart is for a point source; that is one likely reason for the gap in Step 3, and is our reading, not the paper's.
- The 20 °C air temperature is our assumption; at 10 °C or 30 °C the losses change by under 0.1 dB.
