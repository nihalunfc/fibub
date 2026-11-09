---
name: Signal timing (Webster's method)
num: 684
shelf: science
section: transportation-engineering
title: "Traffic signal timing calculator: Webster's optimum cycle, green splits, degree of saturation and delay"
summary: "Enter each approach's phase, flow and saturation flow to get the critical flow ratios, total lost time, Webster's optimum cycle C0 = (1.5L + 5)/(1 − Y), effective and displayed greens, capacity, degree of saturation and Webster delay for every approach, with a timing diagram and a delay-against-cycle curve. For study and planning."
status: live
ads: true
order: 684
icon: clock
works: offline
updated: 2026-11-09
related: [traffic-flow]
sources:
  - "Method: Webster, F. V. (1958), Traffic signal settings, Road Research Technical Paper 39 (optimum cycle, green split in proportion to the critical flow ratios, and the three-term delay formula), as given in transportation engineering textbooks (general formulas)."
  - "Queues for uniform arrivals: vehicles arriving in the effective red, q·r, and the longest queue q·r/(1 − y) (deterministic queueing, general textbook formula)."
  - "Checked against a hand-worked made-up example (Y = 1/3 + 9/32, L = 8 s, C0 = 44.108 s), an independent NumPy evaluation of Webster's delay for every approach, the queue lengths against NumPy to 1e-8, and a scan of delay over cycle length that confirms the delay at C0 is within 3 % of the minimum."
  - "The example flows, saturation flows, lost time and intergreen are made up by fibub; they are not taken from any manual, agency or count."
flow:
  - { icon: table, label: "Approaches" }
  - { icon: sigma, label: "Flow ratios" }
  - { icon: clock, label: "Cycle" }
  - { icon: chart, label: "Delay" }
---

## What it does

A fixed-time traffic signal shares its cycle between phases. Webster's method, still the classic starting point, works out how long the cycle should be and how to split the green so that the average delay is near its lowest. For each approach (or lane group) you give the phase that serves it, its design flow and its saturation flow, and the page works out:

- the **flow ratio** y = flow ÷ saturation flow of every approach, and the **critical** (largest) one in each phase;
- **Y**, the sum of the critical ratios, and the **total lost time** L;
- Webster's **optimum cycle** C₀ = (1.5L + 5) ÷ (1 − Y), rounded up if you like, and the shortest workable cycle L ÷ (1 − Y);
- the **effective green** of each phase, in proportion to its critical ratio, and the **displayed green** (effective green + lost time − intergreen);
- each approach's **capacity** s·g/C, **degree of saturation** and average **delay** from Webster's formula, and the delay-weighted average for the junction;
- the **queue** at the end of red (flow × effective red) and the longest queue, flow × red ÷ (1 − y), in vehicles and in metres from a space per vehicle you give (uniform arrivals);
- a **timing diagram** of one cycle and a curve of **delay against cycle length**.

## How to use it

1. List the approaches: a name, a phase number, the flow and the saturation flow, in vehicles or passenger car units per hour. Or press **Open a file**.
2. Set the **lost time** per phase (start-up delay plus the unused end of the intergreen) and the **intergreen** (yellow plus all-red).
3. Choose how to **round** the cycle and, if your guidance sets them, the shortest and longest cycle. To test a cycle of your own, type it in **Use this cycle instead**.
4. Read the timing, the phase and approach tables and the curves, then download the CSV or the report as an image, PDF or Word file.

## Worked example

The made-up example has two phases. Phase 1 serves North (600 veh/h, saturation flow 1800) and South (500 and 1800); phase 2 serves East (450 and 1600) and West (400 and 1600). The critical ratios are North 0.333 and East 0.281, so Y = 0.615. With 4 s lost per phase, L = 8 s and C₀ = (1.5 × 8 + 5) ÷ (1 − 0.615) = 44.1 s, rounded up to 45 s. The 37 s of effective green split into 20.1 s for phase 1 and 16.9 s for phase 2. The critical approaches run at a degree of saturation of 0.747. Delays are 14.8 s per vehicle for North, 12.1 s for South, 18.0 s for East and 15.5 s for West, 15.0 s on average. North queues 4.2 vehicles by the end of red and up to 6.2 vehicles (44 m at a made-up 7 m per vehicle) before the queue clears.

## FAQ

**Where do saturation flows come from?** Measure them on site (count discharge in long greens) or estimate them from your local manual for the lane width, turning traffic and gradient. The example values are made up.

**Why is the cycle longer than the minimum?** At L ÷ (1 − Y) every critical approach would be exactly at capacity and queues would grow. Webster's optimum leaves spare capacity, which cuts random delay.

**Does it handle pedestrians, actuated or coordinated signals?** No. Check pedestrian crossing times separately; this page is for isolated fixed-time signals.

**Can I use it to set a real signal?** It is for study and planning. Check your local design manual and a qualified engineer.

**Is my data uploaded?** No. Everything runs in your browser and works offline.
