---
name: Tyre pressure
num: 1809
shelf: vehicles
code: T898
section: tyre-basics
title: "Tyre pressure converter: psi, bar, kPa and cold or hot correction"
summary: "Convert tyre pressure between psi, bar and kPa, see how temperature changes it, and find what to fill to today so the tyre is right on a hotter or colder day."
status: live
ads: false
order: 1809
icon: sliders
works: offline
updated: 2026-11-10
related: [stopping-distance, unit-converter, fuel-cost]
sources:
  - "Conversions: 1 psi = 6.894757 kPa, 1 bar = 100 kPa. Temperature change: absolute pressure (gauge plus 101.325 kPa) is proportional to temperature in kelvin, with the tyre volume treated as fixed. Real tyres flex and leak a little, so this is an estimate. Always use the pressure on your vehicle's own label or manual. Drawings are fibub's own."
flow:
  - { icon: sliders, label: "Pressure" }
  - { icon: curve, label: "Temperature" }
  - { icon: check, label: "Fill to" }
---

## What it does

Tyre pressure labels come in psi, bar or kPa, and the number on the gauge changes with the weather. This tool converts between the three units and works out how much the pressure moves when the air temperature changes.

Gauges show pressure above the outside air, but the physics works on absolute pressure, so the tool adds one atmosphere (101.325 kPa), scales it by temperature in kelvin, and takes the atmosphere off again. Check your drive costs with [[fuel-cost]], look at the road side with [[stopping-distance]], or convert other units with [[unit-converter]].

## How to use it

1. To convert, type a pressure and pick its unit: all three units show at once.
2. For a temperature change, type the gauge pressure, the temperature it was measured at and the new temperature.
3. To prepare for another day, use the last box: the pressure you want and the temperature you will drive in, then the temperature now.
4. Read the result and fill with a gauge you trust.

## What each setting does

- **Gauge pressure**: what a normal tyre gauge shows, not absolute pressure.
- **Temperature measured at / new temperature**: the air temperature in the tyre, in °C.
- **Fill to**: the pressure to put in today, with cold tyres, so that it comes out right at the other temperature.

## Worked example

A tyre is 35 psi on a 20 °C day. Absolute pressure is 35 + 14.7 = 49.7 psi at 293.15 K. At -10 °C (263.15 K) it is 49.7 x 263.15 / 293.15 = 44.6 psi absolute, or about 29.9 psi on the gauge. That is a drop of about 5 psi, which is why the warning light often comes on after a cold night.

## FAQs

**Should I let air out when the tyres are hot?** No. Driving warms the tyres and raises the pressure by design. Set pressure when they are cold.

**Where is the right pressure?** On the label in the door frame, fuel flap or manual. Never use the number moulded on the tyre wall: that is the maximum.

**Does altitude matter?** A gauge reads the same difference above the air outside, so moving to altitude changes the gauge reading only slightly.

Not safety advice. Check with a good gauge.
