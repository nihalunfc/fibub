---
name: Binding energy
num: 1070
shelf: learn
code: L34
section: school-physics
title: "Binding energy"
summary: "See the binding energy per nucleon curve rise steeply, peak near iron and fall slowly. Work out the mass defect and binding energy of real nuclei, break the liquid drop formula into its terms, and see fission of uranium and fusion of hydrogen as moves up the curve."
status: live
ads: false
order: 1070
icon: chart
works: offline
updated: 2026-11-09
related: [rutherford-scattering, decay-calculator, decay-chain]
sources:
  - "Mass defect and binding energy B = (Z m_H + N m_n − M) c², the semi-empirical (liquid drop) mass formula with a common textbook set of coefficients (a_V 15.75, a_S 17.8, a_C 0.711, a_A 23.7, a_P 11.18 MeV), and Q values of fission and fusion from mass differences: standard physics."
  - "Atomic masses of the eleven nuclei shown: AME2020 (Atomic Mass Evaluation 2020), rounded to six decimals. Neutron mass and 1 u = 931.49410242 MeV: CODATA 2018."
  - "Checked against an independent Python calculation and well-known results (helium-4 about 28.3 MeV, deuterium–tritium fusion 17.6 MeV, the peak near iron)."
flow:
  - { icon: chart, label: "Curve" }
  - { icon: calculator, label: "Mass defect" }
  - { icon: flask, label: "Fission" }
  - { icon: check, label: "Check" }
---

## What it does

A helium-4 nucleus weighs less than the two protons and two neutrons it is made of. The missing mass, the **mass defect**, became energy when the nucleus formed (E = mc²), and the same energy, the **binding energy**, is needed to pull it apart again. Dividing by the number of nucleons gives the **binding energy per nucleon**, a measure of how tightly each one is held. Plotted against the mass number it makes one of the most important graphs in physics: it climbs steeply for light nuclei, peaks near **iron**, and slopes gently down for heavy ones. That shape is why splitting heavy nuclei (**fission**) and joining light ones (**fusion**) both release energy.

This page draws the curve from the **liquid drop formula** with real nuclei marked as dots, lets you slide along it and see the formula's terms, works out the mass defect and binding energy of real nuclei from their masses, and shows fission and fusion as arrows up the curve with the energy they release. It follows the school topic Class 12 Physics, Nuclei (atomic masses and composition of the nucleus, mass–energy and nuclear binding energy, the binding energy per nucleon curve, nuclear fission and fusion). Before this, see [[rutherford-scattering]] for how the nucleus was found; afterwards, [[decay-calculator]] and [[decay-chain]] cover radioactive decay.

## How to use it

1. Slide the **mass number A**. The page shows the nucleus used (the real one where it is in the list, otherwise the most tightly bound one in the model), its binding energy, and the five terms of the liquid drop formula.
2. In the **mass defect calculator**, pick a nucleus, or choose **My own nucleus** and type Z, A and an atomic mass in u.
3. Press **Fission** or **Fusion** to draw the reaction on the curve and see the energy given out, per nucleon and per kilogram of fuel.

## Worked example

Helium-4 has atomic mass 4.002603 u. Two hydrogen atoms (1.007825 u each) and two neutrons (1.008665 u each) weigh 4.032980 u, so the mass defect is Δm = 0.030377 u. Then B = 0.030377 × 931.494 = 28.296 MeV, or 7.074 MeV per nucleon.

With the slider at A = 56 (iron, Z = 26), the liquid drop formula gives B = 882 (volume) − 260.5 (surface) − 120.8 (Coulomb) − 6.77 (asymmetry) + 1.49 (pairing) = 495.4 MeV, 8.846 MeV per nucleon; iron's measured masses give 8.790.

**Fission** of uranium-235 by a neutron into barium-141, krypton-92 and three neutrons loses 0.186 u, which is 173.3 MeV (about 0.734 MeV per nucleon, 7.1 × 10¹³ J per kilogram). **Fusion** of deuterium and tritium into helium-4 and a neutron gives 17.59 MeV, only a tenth as much per reaction, but 3.52 MeV per nucleon and 3.4 × 10¹⁴ J per kilogram.

## Check yourself

Five questions, fresh each time: binding energy from a mass defect, binding energy per nucleon, the binding energy of a real nucleus from its mass, which nucleus is most (or least) tightly bound, and why fission and fusion both give out energy. Nothing is saved.

## Tips

- The higher a nucleus sits on the curve, the more stable it is. Any reaction that moves nucleons up the curve releases energy.
- The liquid drop formula treats the nucleus like a drop of charged liquid: bulk (volume), skin (surface), proton push (Coulomb), a preference for N ≈ Z (asymmetry), and pairing.
- Helium-4 sits well above the curve near it: it is unusually tightly bound, which is why alpha particles are what heavy nuclei throw out.

## FAQ

**Why use atomic masses, not nuclear masses?** Tables list the masses of whole atoms. Using the hydrogen atom's mass for each proton brings in the same number of electrons on both sides, so they cancel.

**Why is fusion not used in power stations yet?** The nuclei repel each other strongly, so fusion needs temperatures of over 100 million kelvin, which are very hard to hold.

**Is this from NCERT?** No. It is an independent study aid that follows the same school topics, with its own pictures and numbers.
