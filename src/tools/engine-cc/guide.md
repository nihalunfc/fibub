---
name: Engine CC
num: 1811
shelf: money
code: T901
section: two-wheelers
title: "Engine CC calculator: displacement from bore, stroke and cylinders"
summary: "Work out engine size in cc, litres and cubic inches from bore, stroke and number of cylinders, plus compression ratio and the bore to stroke ratio."
status: live
ads: false
order: 1811
icon: sliders
works: offline
updated: 2026-11-10
related: [sprocket-ratio, unit-converter, fuel-cost]
sources:
  - "Displacement = pi / 4 x bore squared x stroke x number of cylinders; 1 cc = 1,000 mm3 and 1 cubic inch = 16.387064 cc. Compression ratio = (swept volume of one cylinder + combustion chamber volume) / combustion chamber volume. Tax, licence and insurance classes that depend on cc are set by your own authority: check the official source. Drawings are fibub's own."
flow:
  - { icon: sliders, label: "Bore, stroke" }
  - { icon: calculator, label: "Displace" }
  - { icon: check, label: "cc" }
---

## What it does

Engine size, the "cc" in a 150 cc scooter, is the volume the pistons sweep in one turn. Enter the bore (cylinder width), the stroke (how far the piston travels) and the number of cylinders, and you get the size in cc, litres and cubic inches.

It also works out the bore to stroke ratio, which tells you whether the engine is built to rev freely or to pull from low speed, and the compression ratio if you type the combustion chamber volume. Once you know the size, see what the chain and gearing do with [[sprocket-ratio]], compare fuel use with [[fuel-cost]], or switch units with [[unit-converter]].

## How to use it

1. Type the bore and stroke and pick millimetres or inches.
2. Type the number of cylinders.
3. Read the displacement. Add the chamber volume if you want the compression ratio.

## What each setting does

- **Bore / stroke**: the cylinder width and the piston travel from the spec sheet.
- **Cylinders**: the volume is multiplied by this number.
- **Combustion chamber volume**: the space left above the piston at the top of its stroke. It sets the compression ratio.
- **Bore / stroke ratio**: above 1 is over-square (short stroke, revs freely), below 1 is under-square (long stroke, more low-down pull).

## Worked example

A bike has a 57 mm bore and a 58.6 mm stroke, one cylinder. Volume = 0.7854 x 57 x 57 x 58.6 = 149,533 mm3, which is 149.5 cc, or 9.1 cubic inches. The maker sells it as a "150 cc". With a 14.5 cc chamber the compression ratio is (149.5 + 14.5) / 14.5 = 11.3 : 1.

## FAQs

**Why is my cc different from the badge?** Makers round the badge, and the real figure is often a little below or above it.

**Does cc mean power?** Not directly. Tuning, revs, fuel and the number of valves matter too.

**How do I turn cc into litres?** Divide by 1,000: 1,998 cc is about 2.0 L.

Class and tax limits depend on cc, so check your own authority's rules.
