---
name: Electron diffraction indexer
num: 845
shelf: science
code: T581
section: crystallography
title: "Electron diffraction indexer: camera constant, ring ratios, d-spacings and zone axis for TEM patterns"
summary: "Index TEM and SAED patterns in the browser: the relativistic electron wavelength and camera constant λL, calibration with rings of a known standard, d-spacings from ring radii or spot distances, ring-ratio indexing of cubic lattices with the lattice parameter, and the zone axis of a two-spot pattern."
status: live
ads: true
order: 845
icon: target
works: offline
updated: 2026-11-09
related: [xrd-peak-calculator, miller-index-calculator, point-group-finder, cif-viewer, lattice-fft, uncertainty-calculator]
sources:
  - "The relativistic electron wavelength uses CODATA 2018 constants; the camera equation Rd = λL, ring-ratio indexing and the zone law are standard textbook electron microscopy. The code is written by fibub and checked in the tests against scipy.constants and NumPy."
  - "The example rings are made up by the page: a face-centred cubic standard with a = 4.08 Å and a body-centred cubic sample with a = 2.87 Å at 200 kV and 1000 mm, with small made-up measuring errors."
flow:
  - { icon: sliders, label: "Microscope" }
  - { icon: ruler, label: "Calibrate" }
  - { icon: target, label: "Rings" }
  - { icon: table, label: "hkl and a" }
---

## What it does

In a transmission electron microscope, a polycrystalline sample gives rings and a single crystal gives spots. Every ring or spot at distance R from the centre comes from planes of spacing d, through the camera equation **R d = λ L**: λ is the electron wavelength and L the camera length, and their product is the camera constant. This page does the whole chain:

- **Wavelength.** λ from the accelerating voltage, with the relativistic correction, which matters: at 200 kV the electrons travel at 0.70 c and λ is 2.508 pm rather than 2.742 pm.
- **Camera constant.** λL from the voltage and the nominal camera length, or better, from a calibration: rings of a standard with a known lattice parameter are indexed and λL = R d(hkl) is averaged over them. The page shows how far the nominal value was off.
- **d-spacings.** From radii or diameters in mm, pixels (with a pixel size or a calibration in pixels) or 1/nm from a calibrated image. An exact-geometry option uses tan 2θ = R/L instead of the small-angle rule.
- **Ring-ratio indexing.** For a cubic lattice R² is proportional to N = h² + k² + l². The page tries simple, body-centred, face-centred and diamond cubic, gives hkl for each ring and the lattice parameter a, and lists allowed rings that are missing.
- **Spot patterns.** Give two spot distances and the angle between them. The page finds the hkl pairs of the lattice that fit and their zone axis, the direction the beam runs along.

Measure spot spacings from lattice images with the [[lattice-fft|lattice FFT tool]], and compare with X-ray peaks in the [[xrd-peak-calculator|XRD peak calculator]].

## How to use it

1. **Microscope.** Type the voltage and camera length, and pick the units you measured in and whether you measured radii or diameters.
2. **Calibrate.** Enter the standard's lattice type and a, and its ring radii, measured under the same conditions. Set *Camera constant from* to the standard. Skip this to use the nominal value.
3. **Sample.** Enter your ring radii, smallest first. Read the lattice, a and the hkl of each ring.
4. **Spots.** For a single crystal, enter two spot distances and their angle to get the zone axis.
5. **Download** the ring table as CSV, or a PNG, PDF or Word report.

## Worked example

Press *Use the example*. At 200 kV, λ = 2.5079 pm and the nominal camera constant for L = 1000 mm is 25.079 Å·mm. The made-up standard's seven rings (10.69 to 26.87 mm) index as 111, 200, 220, 311, 222, 400 and 331, giving a calibrated **λL = 25.092 ± 0.081 Å·mm**, 0.05 % above the nominal.

The sample's eight rings, 12.31 to 34.99 mm, have R² ratios 1 : 2.03 : 3.01 : … : 8.08, which only body-centred cubic explains without missing rings: **body-centred cubic, a = 2.872 Å**, with rings 110, 200, 211, 220, 310, 222, 321 and 400. Face-centred cubic could only fit them by leaving out rings it should show.

The two example spots at 12.36 and 17.48 mm, 45° apart, are 110 and 020 of that lattice, and the zone axis is **[001]**.

## Tips

- Measure diameters across the pattern and halve them: it removes the error in finding the centre.
- Calibrate at the same voltage, camera length, lens currents and specimen height as the sample.
- Ring-ratio indexing needs the first rings. If a weak first ring is missing, a lattice may fit with a different first index; check the "not seen" column.
- Simple cubic and body-centred cubic give identical ratios up to the sixth ring; the seventh decides.

## FAQ

**Why is the relativistic correction needed?** At TEM voltages electrons move at a large fraction of the speed of light. Without the correction λ is about 9 % too long at 200 kV and every d would be wrong by as much.

**Can I index non-cubic patterns?** Not automatically. Use the d-spacings from the table with the Miller index calculator, which gives d for any cell.

**Are my measurements uploaded?** No. Everything is worked out on this page.
