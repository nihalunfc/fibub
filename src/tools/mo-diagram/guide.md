---
name: MO diagram
num: 1103
shelf: learn
code: L48
section: school-chemistry
title: "MO diagram"
summary: "Pick a diatomic molecule or ion from H₂ to Ne₂ (O₂, O₂⁺, O₂⁻, N₂, B₂ …) and fill its molecular orbitals one electron at a time. See the energy diagram, the bond order with the working, unpaired electrons, whether it is paramagnetic, and what s–p mixing changes. With a table across the period and practice questions."
status: live
ads: false
order: 1103
icon: chart
works: offline
updated: 2026-11-09
related: [lewis-structures, huckel-mo-calculator, hydrogen-orbitals]
sources:
  - "Molecular orbital order for second-period homonuclear diatomics (with and without s–p mixing), Aufbau, Pauli and Hund filling, and bond order = ½ (bonding − antibonding electrons) are general chemistry, written fresh for fibub. The diagram is schematic, not to scale."
  - "Checked against the bond orders and magnetic behaviour quoted in general chemistry texts for H₂ to Ne₂ (B₂ and O₂ paramagnetic; He₂, Be₂, Ne₂ bond order 0) and for O₂⁺ (2.5), O₂⁻ (1.5), O₂²⁻ (1), N₂⁺ (2.5), H₂⁺ and He₂⁺ (0.5), and the textbook configurations of N₂ and O₂."
flow:
  - { icon: flask, label: "Pick X₂" }
  - { icon: sliders, label: "Fill" }
  - { icon: calculator, label: "Bond order" }
  - { icon: check, label: "Magnetic?" }
---

## What it does

When two atoms join, their atomic orbitals combine into **molecular orbitals** (MOs): bonding ones, lower in energy, and antibonding ones (marked *), higher in energy. This page draws the MO energy diagram for any two identical atoms from hydrogen to neon, with a charge from 2− to 2+, and fills it with electrons. Drag the **Electrons filled** slider to place them one at a time, lowest level first, one in each of two equal orbitals before any pair up (Hund's rule).

You get the **bond order** with the numbers filled in, the number of unpaired electrons, and whether the molecule is **paramagnetic** (drawn into a magnet) or **diamagnetic**. It follows the Class 11 Chemistry chapter on chemical bonding (molecular orbital theory, bonding in homonuclear diatomic molecules). Compare with the [[lewis-structures]] tool, which cannot explain why O₂ is magnetic; for π orbitals in larger molecules go on to the [[huckel-mo-calculator]]; for the shapes of the atomic orbitals see the [[hydrogen-orbitals]] viewer.

## How to use it

1. Choose the **Element** and the **Charge**. A minus charge adds electrons, a plus charge removes them.
2. **s–p mixing**: *Auto* puts π2p below σ2pz for B₂, C₂ and N₂ (and lighter), and above it from O₂ on. *On* and *Off* let you see what changes.
3. Drag **Electrons filled** from 0 to the end and watch the arrows go in. Solid lines are bonding MOs, dashed lines antibonding.
4. Read the bond order, unpaired electrons and the electron configuration below the diagram.
5. **Across the period** lists all ten molecules with the same charge, so you can see the pattern.

## Worked example: oxygen, O₂

Each oxygen atom has 8 electrons, so O₂ has 16. Filling in order: σ1s² σ*1s² σ2s² σ*2s² σ2pz² π2px² π2py², then the last two electrons go into the two equal π* orbitals, one each: π*2px¹ π*2py¹. Bonding electrons = 10, antibonding = 6, so bond order = ½ (10 − 6) = **2**, a double bond like the Lewis structure. But there are **2 unpaired electrons**, so O₂ is **paramagnetic**: liquid oxygen sticks between the poles of a magnet. Change the charge to 1+ and one π* electron goes: bond order 2½, a stronger bond.

## Tips

- **Bond order 0 means no molecule**: He₂, Be₂ and Ne₂ have as many antibonding as bonding electrons.
- **Higher bond order, shorter and stronger bond**: O₂²⁻ (1) < O₂⁻ (1½) < O₂ (2) < O₂⁺ (2½).
- **Half bond orders are fine**: H₂⁺ has one electron in σ1s and bond order ½.

## FAQ

**Why do B₂, C₂ and N₂ have a different order?** In lighter atoms the 2s and 2p energies are close, so σ2s and σ2pz mix and σ2pz is pushed up above the π2p pair. B₂ being paramagnetic is the experimental proof.

**Are the energies real numbers?** No, the diagram is schematic: it shows the order of the levels, not their sizes.

**Is this an NCERT tool?** No. It is a free fibub page made to help with this topic; it runs on your device.
