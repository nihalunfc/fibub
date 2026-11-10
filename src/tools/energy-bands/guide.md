---
name: Energy bands
num: 1429
shelf: learn
code: L265
section: school-physics
title: "Energy bands: conductor, semiconductor and insulator, band gap, doping and LED colour"
summary: "See the valence and conduction bands of copper, germanium, silicon, gallium arsenide and diamond. Heat the crystal and watch electrons jump the band gap, dope silicon n-type or p-type and check n × p = nᵢ², then find the colour of an LED from its band gap."
status: live
ads: false
order: 1429
icon: chart
works: offline
updated: 2026-11-09
related: [pn-junction, band-structure, carrier-concentration, hydrogen-spectrum]
sources:
  - "Band gaps near room temperature (germanium 0.66 eV, silicon 1.12 eV, gallium arsenide 1.42 eV, diamond about 5.5 eV), the donor and acceptor levels 0.045 eV from the band edges (phosphorus and boron in silicon) and the free-electron density of copper are general physics facts, rounded."
  - "h·c = 1239.84 eV nm and the Boltzmann constant 8.617 × 10⁻⁵ eV/K are CODATA values. The carrier model nᵢ = N (T/300)^1.5 e^(−Eg/2kT) uses one rough teaching value N = 2.5 × 10¹⁹ cm⁻³ for every material; real values differ by a few times."
  - "The wavelength-to-colour fit is Dan Bruton's well-known piecewise approximation. The maths was checked in the tests against an independent Python version (scipy brentq for the doped case). Drawings are fibub's own. Nothing you enter is stored or sent anywhere."
flow:
  - { icon: sliders, label: "Material" }
  - { icon: chart, label: "Bands" }
  - { icon: pencil, label: "Dope" }
  - { icon: eye, label: "LED colour" }
---

## What it does

In a single atom an electron can only have certain energies. In a crystal, billions of atoms sit close together and those sharp levels spread out into **bands**. Two bands matter: the **valence band**, full of the electrons that hold the atoms together, and the **conduction band** above it, where an electron is free to wander and carry a current. The energy step between them is the **band gap**, Eg.

- **Material.** Copper has no gap: its bands overlap, so it always conducts. Germanium (0.66 eV), silicon (1.12 eV) and gallium arsenide (1.42 eV) are semiconductors. Diamond (about 5.5 eV) is an insulator.
- **Temperature.** Heat lifts a few electrons across the gap. Each one leaves a **hole** behind in the valence band, so a pure semiconductor has equal numbers of free electrons and holes, nᵢ. Slide the temperature and watch the dots: the number grows very fast as it warms.
- **Doping.** Add phosphorus (five outer electrons) and you get **n-type** silicon, with a donor level just under the conduction band. Add boron (three outer electrons) and you get **p-type**, with an acceptor level just above the valence band. The page shows the majority and minority carriers and checks that n × p = nᵢ².
- **LED colour.** When an electron drops back across the gap it can give out light with energy about Eg. Slide Eg and see the wavelength, λ = 1240 / Eg (λ in nm, Eg in eV), and the colour.

This fits **Class 12 Physics: semiconductor electronics** (energy bands, intrinsic and extrinsic semiconductors, n-type and p-type) and links back to the energy levels of **atoms**. Next, join p-type and n-type silicon in the [[pn-junction]]; for the full physics of bands see [[band-structure]], and for real carrier numbers use the [[carrier-concentration]] calculator.

## How to use it

1. Pick a material. The diagram shows the two bands and the gap, drawn to scale.
2. Move **T**. Filled dots are free electrons, open circles are holes. The picture is on a log scale: every extra pair of dots means about ten times more carriers.
3. For germanium, silicon or GaAs, choose **n-type** or **p-type** and set the number of dopant atoms N per cubic centimetre.
4. In the second card, move **Eg** to change the LED.
5. Try the **Check yourself** questions; **New questions** gives a fresh set.

## Worked example

Silicon at 300 K: the page shows nᵢ = 9.78 × 10⁹ cm⁻³ (the textbook value is about 1 to 1.5 × 10¹⁰; this page uses one rough model for every material). Warm it to 400 K and there are about 346 times more carriers. That is why a semiconductor's resistance falls when it is heated, while a metal's rises.

Now choose n-type with N = 1.00 × 10¹⁶ cm⁻³. Every phosphorus atom gives one electron, so nₑ ≈ 1.00 × 10¹⁶ cm⁻³, and the holes fall to nₕ = nᵢ² / nₑ = (9.78 × 10⁹)² / 10¹⁶ ≈ 9.57 × 10³ cm⁻³.

LED: with Eg = 1.90 eV, λ = 1240 / 1.90 = 653 nm, which is red. A band gap of about 2.7 eV gives blue (459 nm); silicon's 1.12 eV gives 1107 nm, which is infrared.

## Tips

- Doping is tiny: 10¹⁶ atoms per cm³ is about one phosphorus atom for every five million silicon atoms, yet it raises the electrons a million times.
- An n-type crystal is still electrically neutral: each free electron is balanced by a positive phosphorus ion.
- Silicon is a poor light emitter; LEDs use compounds such as gallium arsenide phosphide or indium gallium nitride.

## FAQ

**Why does the gap decide the colour?** The light comes from an electron falling across the gap, so the photon's energy is close to Eg, and E = hc/λ.

**Are the numbers exact?** No. The band gaps are rounded and the carrier formula uses one rough constant for every material, so the carrier numbers are "about". The trends (huge rise with temperature, n × p constant) are right.

**Is anything saved?** No. Everything runs in your browser and nothing is stored or sent.

**Is this an official textbook tool?** No. It is an independent practice page that follows the same school topics.
