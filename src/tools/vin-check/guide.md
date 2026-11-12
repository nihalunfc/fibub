---
name: VIN check
num: 1820
shelf: vehicles
code: T909
section: vehicle-buying
title: "VIN check: is this vehicle identification number valid?"
summary: "Type a 17-character VIN to check its characters and check digit, and read the maker region, the model year and the plant code. Works offline, with no lookups."
status: live
ads: false
order: 1820
icon: search
works: offline
updated: 2026-11-10
related: [used-car-checklist, car-loan, car-depreciation]
sources:
  - "VIN layout and check digit: the 17-character standard (ISO 3779) and the North American rule in US federal regulation 49 CFR Part 565 (weights 8 7 6 5 4 3 2 10 0 9 8 7 6 5 4 3 2, letters turned into numbers, remainder of 11, 10 shown as X). Checked 2026-11-10; check the official source."
  - "Model year code in position 10 repeats every 30 years (the letters I, O, Q, U and Z and the digit 0 are not used). Drawings are fibub's own."
flow:
  - { icon: pencil, label: "Type VIN" }
  - { icon: check, label: "Check" }
  - { icon: search, label: "Read" }
---

## What it does

A vehicle identification number (VIN) is the 17-character code stamped on a car, bike or truck. This tool checks that the characters are allowed, works out the check digit in position 9, and reads the maker region, the model year code and the plant code.

Everything is worked out on this page: no database is asked, so it cannot tell you the make, model or history. A valid check digit only shows the number was typed correctly and is internally consistent; it does not prove the vehicle is genuine. Use it before [[used-car-checklist]], and see [[car-loan]] and [[depreciation]] for the money side.

## How to use it

1. Type or paste the VIN. Spaces and dashes are ignored.
2. Read the character and length checks.
3. See whether the check digit matches. Then read the region, year and plant.

## What each setting does

- **Characters**: a VIN never uses the letters I, O or Q, so they are flagged as likely typing mistakes (1 and 0).
- **Check digit**: required on vehicles made for North America. Other regions often do not use the same rule, so a mismatch there is only a hint.
- **Model year**: position 10 repeats every 30 years, so two years are shown. On North American vehicles, a letter in position 7 usually points to the later one.
- **Plant code**: position 11 is a code the maker sets; it is not decoded here.

## Worked example

1M8GDM9AXKP042788: the weighted sum is 351, and 351 divided by 11 leaves 10, shown as X. Position 9 is X, so it is valid. Region is North America, year code K means 1989 or 2019, plant code K. Change the X to 1 and it no longer matches.

## FAQs

**Does it say what car this is?** No. Looking up the make and model needs a database; this tool works fully offline.

**My VIN fails the check digit.** Re-check the stamp for look-alike characters. Many vehicles made outside North America do not follow this rule.

**Can I trust a valid VIN?** No. Compare it with the papers and the plate on the vehicle, and check the official records where you live.

Not legal or buying advice.
