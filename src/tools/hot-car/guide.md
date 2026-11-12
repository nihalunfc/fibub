---
name: Hot car
num: 2114
shelf: vehicles
code: T945
section: driving
title: "Hot car temperature: how fast a parked car heats up"
summary: "See how hot a parked car gets in the first hour, in sun or shade, with a simple chart and what to do if you see a child or pet inside."
status: live
ads: false
order: 2114
icon: curve
works: offline
updated: 2026-11-12
related: [stopping-distance, road-trip, tyre-pressure]
sources:
  - "Approximate shape of the warming curve from published measurements: McLaren, Null and Quinn 2005, Pediatrics, heat stress from enclosed vehicles; Grundstein et al. and later work on vehicle cabin heating. The numbers are fibub's own rough fit (about 24 C of rise in sun, half in shade, cracked windows barely help), not a copy of any table. Emergency numbers as checked November 2026; check the official source for your area. Drawings are fibub's own."
flow:
  - { icon: sliders, label: "Weather" }
  - { icon: curve, label: "Heat" }
  - { icon: check, label: "Safety" }
---

## What it does

A closed car in the sun heats up far faster than most people expect. This tool gives a rough guess of the temperature inside after a number of minutes, and draws the whole first hour so you can see how quickly it climbs. Most of the heat arrives in the first 20 to 30 minutes.

Never leave a child or a pet in a parked car, not even for a minute. This is a rough estimate and real cars can be hotter, especially dark ones. Plan a longer drive with [[road-trip]] and see how conditions change braking in [[stopping-distance]].

## How to use it

1. Pick the temperature unit and type the outside temperature.
2. Move the slider to the minutes the car has been parked.
3. Choose sun or shade, and windows shut or cracked.
4. Read the big number and look at where the line crosses the coloured bands.

## What each setting does

- **Outside temperature**: the air temperature in the shade, as a weather report gives it.
- **Minutes parked**: how long since the engine was switched off.
- **Sun or shade**: shade gives about half the rise of full sun.
- **Windows**: a small gap lowers the heat only a little, so do not count on it.

## Worked example

Outside is 30 C and the car sits in full sun for 30 minutes with the windows shut. The rise is 24 x (1 - e^(-30/22)), about 17.9 C, so the inside is about 48 C. A child's body overheats much faster than an adult's, so this is dangerous well before 30 minutes.

## If you see a child or pet alone in a hot car

Call the emergency number straight away: 911 (USA, Canada), 999 (UK, UAE police), 998 (UAE ambulance), 112 (India and the EU). Check your local emergency number. Stay nearby and follow what the call-taker tells you.

## FAQs

**Does cracking a window help?** Published measurements show very little difference, so the tool takes off only about 5 percent.

**Does it matter in cool weather?** Yes. On a mild day the inside can still rise by 10 C or more in sun.

**Is the number exact?** No. Colour, size, glass and air flow all matter. Treat it as a minimum warning, not a safe limit.
