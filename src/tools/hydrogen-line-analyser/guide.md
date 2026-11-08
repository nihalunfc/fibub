---
name: Hydrogen line analyser
num: 73
shelf: science
section: radio-astronomy
title: "Hydrogen 21 cm line analyser: LSR velocity, terminal velocity and the Milky Way rotation curve"
summary: "Paste a 21 cm hydrogen spectrum from a backyard radio telescope and get LSR velocities, the terminal velocity, kinematic distances, column density and the Milky Way's rotation curve."
status: live
ads: true
order: 21
icon: chart
works: offline
updated: 2026-11-08
related: [radio-telescope-calculator, uv-coverage, link-budget-calculator, rotation-curve-fitter, sky-coordinates]
sources:
  - "21 cm line frequency: 1420.405751768 MHz."
  - "Galactic constants: the IAU 1985 values (R₀ 8.5 kpc, V₀ 220 km/s) and modern round values."
  - "Solar motion for the local standard of rest: the standard 20 km/s towards RA 18 h, Dec +30° (1900)."
flow:
  - { icon: table, label: "Spectrum" }
  - { icon: sliders, label: "To LSR" }
  - { icon: curve, label: "Rotation" }
---

## What it does

Cold hydrogen gas fills the disc of the Milky Way, and every atom of it can give off radio waves at 1420.4058 MHz, a wavelength of 21 cm. Gas moving towards or away from us shifts the line by the Doppler effect, so a spectrum taken along one line of sight shows a bump for each spiral arm, at the speed that arm moves relative to us. A small dish of 1 to 3 metres, a low-noise amplifier and a software-defined radio are enough to see it. This is one of the classic amateur radio astronomy projects.

This tool turns such a spectrum into science. It converts frequency to velocity, corrects for the Earth's orbit and the Sun's own motion so velocities are relative to the **local standard of rest** (LSR), fits and removes the baseline, and measures the line. Looking inside the Sun's orbit (galactic longitude 0° to 90°, or 270° to 360°), the fastest gas lies at the **tangent point**, where the line of sight passes closest to the galactic centre. The tool finds that **terminal velocity** and turns it into the rotation speed at that radius. Several pointings together trace the Milky Way's **rotation curve**. It stays flat instead of falling, which is the galaxy's own evidence for dark matter.

## How to use it

1. Paste the spectrum: frequency in MHz (or velocity in km/s) and power or antenna temperature, one channel per line, or open the text or CSV file your software saved.
2. Give the pointing in galactic l and b, or in RA and Dec, and the UTC date and time of the middle of the observation. The time matters because the Earth's orbital speed adds up to ±30 km/s.
3. Choose the baseline shape. Use a straight line for a flat spectrum; use a curve if your receiver's bandpass bends. The fit leaves out the line itself.
4. Smoothing averages neighbouring channels to beat down noise, at the cost of resolution.
5. Press **Add this pointing** to put the terminal velocity into the rotation curve list, then point elsewhere and repeat.

## How it is worked out

- Velocity uses the radio convention: v = c (f₀ − f) / f₀.
- The LSR correction projects the Earth's barycentric velocity and the standard solar motion (20 km/s towards RA 18h, Dec +30°, B1900) onto the line of sight.
- Terminal velocity: the outermost peak above five times the noise, followed out to where it falls to half its height.
- Tangent point: R = R₀ |sin l| and V(R) = |v_t| + V₀ |sin l|.
- Column density: N_HI = 1.823 × 10¹⁸ ∫ T_b dv cm⁻², for optically thin gas.

## Worked example

The example is a simulated 2.4 MHz spectrum towards l = 30°, b = 0°, observed at 04:00 UTC on 15 July 2026. The gas follows a flat 220 km/s rotation curve with three spiral arms. The LSR correction for that moment is +11.7 km/s. After the baseline is removed, the line runs from about −20 to +125 km/s, with its brightest arm near +60 km/s. The terminal velocity comes out at 114.6 km/s, about 4 km/s above the 110 km/s the model's rotation alone would give, because of the gas's own random motions. So at the tangent point, 4.25 kpc from the centre, the Milky Way turns at about 225 km/s. The example set of nine pointings, from l = 20° to 80° and two in the fourth quadrant, gives a curve that stays flat between 3 and 8 kpc.

## Frequently asked questions

**My line has a dip in the middle. Why?** Often a radio-frequency interference spike was removed, or cold foreground gas absorbs. Smoothing will not fix it, but the terminal velocity uses only the outer edge.

**My spectrum is not in kelvin.** Choose "any unit". Velocities and the rotation curve do not need calibration; only the column density does.

**Why only between 0° and 90°?** Outside the Sun's orbit there is no tangent point, so the terminal velocity method does not apply. The peaks table still gives kinematic distances there.

**Is my data uploaded?** No. Everything is worked out in your browser, and it works offline.
