---
name: Bolt torque
num: 642
shelf: science
code: T439
section: mechanical-engineering
title: "Bolt torque"
summary: "Work out the tightening torque for a target bolt preload (or the preload a torque gives) with the nut factor T = K F d or the thread and under-head friction split, the tensile stress area of ISO metric or UNC/UNF threads from the pitch, the bolt and clamped-part stiffness, the joint constant, the separation load and safety factors, with a joint diagram."
status: live
ads: true
order: 642
icon: calculator
works: offline
updated: 2026-11-09
related: [beam-calculator, uncertainty-calculator, tolerance-stackup, spring-designer, fatigue-sn-calculator, thermal-mismatch-stress, stress-strain-analyser]
sources:
  - "Tensile stress area from the mean of the pitch and minor diameters of the basic 60° thread profile, as defined for ISO metric threads (ISO 898-1) and unified inch threads (ASME B1.1); formulas only, no size tables."
  - "Torque T = K F d and the long-form torque split into pitch, thread friction and under-head friction terms, as in ISO 16047 and VDI 2230 and in Shigley's Mechanical Engineering Design (Budynas and Nisbett); equations only."
  - "Bolt stiffness (shank and threaded length in series) and clamped-member stiffness from 30° pressure-cone frustums, joint constant, separation load and load factors: Shigley's Mechanical Engineering Design, chapter on bolted joints (equations only)."
  - "Nut factor, friction coefficients, proof strength and preload percentages are rounded example values chosen by fibub and labelled as examples, not copied from any table. The example joint is made up."
  - "Checked against an independent NumPy/SciPy calculation: stress areas from the thread geometry, and the cone stiffness by numerical integration of dx/(E·A(x))."
flow:
  - { icon: target, label: "Thread" }
  - { icon: sliders, label: "Preload" }
  - { icon: calculator, label: "Torque" }
  - { icon: chart, label: "Joint" }
---

## What it does

A bolt holds a joint together by being stretched like a stiff spring. That stretch, the **preload**, clamps the parts; the **tightening torque** is how you put it in. This calculator links the two and then checks what happens when the joint is loaded:

- the **tensile stress area** of the thread from its diameter and pitch (ISO metric) or threads per inch (UNC/UNF),
- the **preload** as a percentage of the bolt's proof load,
- the **torque** from the short formula T = K F d, or from thread and under-head friction coefficients,
- the **stiffness** of the bolt and of the clamped parts, and the **joint constant** C, the share of an external load the bolt actually feels,
- the **separation load** that would open the joint, the bolt load and remaining clamp under your load, and safety factors.

Check how the joined parts fit together with the [[tolerance-stackup|tolerance stack-up]], and see how a bolt copes with repeated loads in the [[fatigue-sn-calculator]].

## How to use it

1. Pick **ISO metric** (mm, kN, N·m) or **unified inch** (in, lbf, lbf·ft) and give the diameter and pitch (or threads per inch).
2. Give the bolt's **proof strength** from its grade standard. For ISO classes, typing the class (such as 8.8) shows the nominal tensile and yield strengths that the class number stands for.
3. Choose the **preload** as a percentage of the proof load, or switch **Find** to work out the preload a known torque gives.
4. Choose the **method**: a nut factor K, or friction in the thread and under the head (with the bearing face and hole diameters, which default to 1.5 d and 1.1 d).
5. Describe the **joint**: the grip (total thickness clamped), how much of it the plain shank fills, E for the bolt and the parts, and the external tensile load per bolt.

## Worked example

A made-up joint: an M10 × 1.5 bolt with an example proof strength of 600 MPa, tightened to 75 % of its proof load, clamping 30 mm of steel with 10 mm of plain shank inside the grip, carrying 10 kN per bolt.

The stress area is (π/4)(10 − 0.9382 × 1.5)² = **57.99 mm²**, so the preload is 0.75 × 600 × 57.99 = **26.1 kN** (450 MPa). With K = 0.2 the torque is 0.2 × 26 095 N × 0.010 m = **52.2 N·m**. If the real K is 25 % higher or lower, the same torque gives 20.88 to 34.79 kN.

The bolt stiffness is 423.5 kN/mm and the clamped parts 1871 kN/mm, so C = **0.185**: the bolt feels only about 18 % of the external load. The joint would separate at **32 kN** (a factor of 3.2 on the 10 kN load). Under the load the bolt carries 27.94 kN (481.8 MPa, yield factor 1.25) and 17.94 kN of clamp is left.

With the friction method instead (μ = 0.12 in the thread and under the head, defaults for the bearing face), the equivalent K is 0.164 and the torque falls to 42.9 N·m; more than half of it goes to friction under the head.

## Tips

- Lubrication changes K a lot. Torque values are only meaningful with the same lubricant and finish they were set for.
- A stiff joint (small C) protects the bolt from fatigue, because most of a varying load goes into unclamping the parts rather than stretching the bolt.
- A gasket or a soft part in the grip makes the parts much less stiff, so C rises and the bolt sees more of the load.

## FAQ

**Is this enough to sign off a joint?** No. It is for study and planning, not a substitute for professional judgement. Real joints need the bolt standard's strengths, thread stripping, embedding and relaxation, fatigue, and checking by a qualified engineer.

**Where do the K values come from?** They are rounded examples. K depends on finish, plating and lubricant; measure it or use the fastener maker's figure.

**Why is the inch stress area formula different?** Unified threads use a slightly smaller minor diameter, so the constant is 0.9743 instead of 0.9382.
