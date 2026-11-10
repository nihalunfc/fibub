---
name: Spectral line identifier
num: 70
shelf: science
code: T70
section: stellar-astrophysics
title: "Spectral line identifier: match spectrum lines and find the redshift"
summary: "Paste a spectrum or a list of wavelengths and match each line to hydrogen, helium, metals, nebular lines, lamps, light pollution or the atmosphere, and find the redshift where several lines agree."
status: live
ads: true
order: 21
icon: search
works: offline
updated: 2026-11-08
related: [redshift-calculator, cosmology-calculator, radial-velocity-fitter, rotation-curve-fitter, plot-maker]
sources:
  - "Line wavelengths: NIST Atomic Spectra Database (US government), rounded to 0.01 Å; molecular bands give the band head."
flow:
  - { icon: table, label: "Spectrum" }
  - { icon: search, label: "Match lines" }
  - { icon: target, label: "Redshift" }
---

## What it does

Every bright or dark line in a spectrum is a fingerprint: hydrogen, sodium, oxygen and the rest each absorb and give off light only at their own wavelengths. This tool takes a spectrum, or just the wavelengths you have measured, and says which line each one most likely is.

For galaxies and quasars the lines are all shifted to longer wavelengths by the same factor, 1 + z. The tool tries every pairing of your lines with the strong lines it knows and looks for the **redshift where several of them agree at once**. One line alone can be anything; three lines at the same redshift are hard to argue with. The tool then gives the mean redshift with its uncertainty, the velocity, a rough distance for nearby galaxies, and a table of every line with how far it sits from where it should be, in km/s.

Some lines never shift: the oxygen and water bands of **Earth's atmosphere**, lines of **calibration lamps** (neon, argon, mercury) and of **light pollution** (mercury and sodium street lights, the green airglow line at 5577 Å). The tool matches those at zero redshift and leaves them out of the redshift search, so they cannot fool it.

Turn the line shifts into velocities with the [[redshift-calculator]], and the velocities into an orbit with the [[radial-velocity-fitter]].

## How to use it

1. Paste a spectrum as two columns, wavelength and flux, or open a text or CSV file. The tool picks out the lines that stand at least five times the noise above (or below) a running-median continuum. Or paste a short list of wavelengths you have measured yourself, one per line.
2. Choose the **unit** (Å, nm or µm) and whether the wavelengths are in **air** or **vacuum**. Ground-based spectra are usually calibrated in air; SDSS and space telescopes use vacuum. The difference is about 1.8 Å at Hα, which matters for a tight match.
3. Say whether the spectrum shows **bright** emission lines (nebulae, star-forming galaxies, quasars, lamps) or **dark** absorption lines (most stars, old galaxies).
4. Tick the groups of lines to look among, and set how close a match must be. Three ångströms suits a small spectrograph; use less for a high-resolution spectrum.
5. Leave the redshift on **find it**, or type it in if you know it. When more than one redshift fits, buttons let you try each.

## What the results mean

- **Redshift z** is the mean of (measured ÷ rest − 1) over the identified lines, with its standard error.
- **Velocity cz** is the speed of recession for small redshifts. A star in our own galaxy shows a few tens of km/s, towards (negative) or away from us.
- **Rough distance** uses Hubble's law with H₀ = 70 km/s/Mpc. It is only a guide below z ≈ 0.1; beyond that use the cosmology calculator.
- **Offset** in km/s shows how far each line sits from its expected place. A line far off the others is probably a different line or a blend.

## Worked example

The example is a simulated star-forming galaxy. The tool finds ten bright lines between 4000 and 7300 Å. Pairing them with the strong-line list, ten of them agree at **z = 0.0832**: [O II] 3727 at 4037 Å, Hγ, Hβ at 5266 Å, both [O III] lines, Hα at 7109 Å with [N II] on either side, and the [S II] doublet. That is a recession speed of about 24,900 km/s, or roughly 360 Mpc by Hubble's law. Switch to dark lines and the tool finds calcium H and K at 4261 and 4299 Å, magnesium b and sodium D at the same redshift, plus the oxygen A and B bands of our atmosphere at 7600 and 6875 Å, which it marks as not shifted.

## Frequently asked questions

**Why is a line marked "no match"?** It may be noise, a cosmic ray hit, a blend of lines, or a line not in the list. Widen the tolerance a little or tick more groups.

**My star's lines are all a little off. Why?** The star moves. A shift of 1 Å at 6563 Å is 46 km/s. Let the tool find the redshift; for a star it gives the radial velocity.

**Where do the wavelengths come from?** The NIST Atomic Spectra Database for atoms and ions, and standard band heads for the molecular bands. Lines below 2000 Å are vacuum wavelengths, as is the custom.

**Is my spectrum uploaded?** No. Everything runs in your browser, and it works offline.
