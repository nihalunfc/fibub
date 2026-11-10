---
name: Gear trains
num: 643
shelf: science
code: T440
section: mechanical-engineering
title: "Gear trains"
summary: "Work out the speeds, directions, torques and power of each shaft in a simple, idler or compound gear train with mesh efficiencies and centre distances; solve a planetary gear set with the Willis equation (any member held or driven, assembly checks, torque split); and find the belt length, wrap angles and driven speed of an open or crossed belt drive, or the centre distance for a belt length."
status: live
ads: true
order: 643
icon: sliders
works: offline
updated: 2026-11-09
related: [bolt-torque-calculator, beam-calculator, shaft-bearing-life, spring-designer, tolerance-stackup, unit-converter]
sources:
  - "Gear train speed and torque ratios, centre distance from the module, and the Willis (tabular) equation for epicyclic gear sets, as in standard machine design texts such as Shigley's Mechanical Engineering Design and Norton's Design of Machinery (equations only)."
  - "Planetary assembly conditions (ring minus sun even, sun plus ring divisible by the number of equally spaced planets, neighbouring planets clear) are standard geometric rules."
  - "Exact open and crossed belt length from the common tangents and wrapped arcs, and the usual approximate formula, as in machine design texts (equations only)."
  - "Mesh efficiency and belt slip values are rounded examples chosen by fibub. The example trains are made up."
  - "Checked against an independent NumPy calculation: planetary speeds from the rolling constraints at the sun-planet and planet-ring contacts, and belt length from explicit tangent-point geometry."
flow:
  - { icon: sliders, label: "Gears" }
  - { icon: orbit, label: "Planetary" }
  - { icon: link, label: "Belt" }
  - { icon: table, label: "Shafts" }
---

## What it does

Three calculators for passing rotation from one shaft to another:

- **Gear train.** List the meshes from the input onward and get the speed, direction, torque and power of every shaft, the overall ratio and efficiency, and the centre distance of each pair from the module.
- **Planetary gear set.** A sun, a ring and planets on a carrier. Give any two speeds (one is usually 0, the held member) and the Willis equation gives the third, the planet spin, the ratio, the ideal torques, and whether the planets fit.
- **Belt drive.** The exact belt length and wrap angles for an open or crossed belt, the driven speed with slip, the belt speed, or the centre distance for a belt you already have.

Once you know the speeds and torques, size the shafts and bearings with the [[shaft-bearing-life|shaft and bearing life calculator]], and check the fits in the [[tolerance-stackup]].

## How to use it

**Gear train.** Type the input speed (rpm) and torque (N·m). Each row is one pair of gears: driver teeth and driven teeth. The driven gear of one row is on the same shaft as the driver of the next, so two rows make a compound train. For an idler (a gear in between that only changes direction), use the idler as the driven gear of one row and again as the driver of the next. Choose *internal* for a ring gear, which turns the same way as its pinion, and *chain* for sprockets. Efficiency is per mesh; 98 % is a rounded example for good spur gears.

**Planetary.** Give the sun and ring teeth and the number of planets. Fill two of the three speeds and leave the third empty. Type 0 for the held member. Negative speeds turn the other way.

**Belt.** Give the pitch diameters of the driving and driven pulleys, open or crossed, and the centre distance (or switch **Find** to work out the centre distance for a belt length).

## Worked example

The example values are made up. A motor at 1440 rpm and 20 N·m drives a two-stage train, 18 to 54 teeth and then 20 to 60 teeth, at 98 % per mesh with module 2 mm. The ratio is 3 × 3 = **9 : 1**, so the output turns at **160 rpm** in the same direction as the input (two reversals), with 20 × 9 × 0.98² = **172.9 N·m**. Power in is 3.016 kW and out 2.896 kW. The centre distances are 72 and 80 mm.

The planetary set has a 24-tooth sun, a 72-tooth ring held still and the sun at 1500 rpm. Willis gives the carrier at **375 rpm**, a 4 : 1 reduction. Each 24-tooth planet spins at −750 rpm, and three planets fit because (24 + 72) / 3 = 32 is whole. With 10 N·m on the sun the ring holds 30 N·m and the carrier delivers 40 N·m.

The belt drive has a 100 mm driving pulley at 1440 rpm, a 300 mm driven pulley and 500 mm between centres. The open belt is **1648 mm** long, wraps 156.9° of the small pulley and 203.1° of the large one, and drives the large pulley at 480 rpm. The belt runs at 7.54 m/s.

## Tips

- Torque goes up by the same ratio the speed goes down, less the losses: power in = power out ÷ efficiency.
- Gears in mesh must have the same module. The pitch diameter is module × teeth.
- In a planetary set the carrier always turns the same way as the sun when the ring is held, and the ring turns backwards when the carrier is held.

## FAQ

**Why is my output direction "reversed"?** Each external mesh reverses the direction. An even number of external meshes gives the same direction as the input.

**Does it check tooth strength?** No. It gives speeds, torques and geometry. Tooth bending and contact stresses need a gear rating method.

**Why does the quick belt formula differ from the exact length?** The quick formula is a series approximation. It is very close when the centre distance is large compared with the pulleys.
