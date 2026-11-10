---
name: Stress-strain
num: 1340
shelf: learn
section: school-physics
title: "Stress-strain"
summary: "Hang loads on a wire of steel, copper, aluminium or rubber and follow its stress-strain curve: Hooke's law, the elastic limit, plastic stretch, the permanent set and the breaking point. Then do Searle's experiment with micrometer readings and work out Young's modulus from the slope, even for a mystery wire."
status: live
ads: false
order: 1340
icon: ruler
works: offline
updated: 2026-11-09
related: [stress-strain-analyser, simple-machines, newtons-laws, hydraulic-lift]
sources:
  - "Stress = F/A, strain = ΔL/L, Hooke's law (stress = Y × strain), the shape of a ductile metal's stress-strain curve (elastic limit, strain hardening, necking and fracture), unloading along a line of slope Y (permanent set), rubber's curve (the simple neo-Hookean model) and Searle's method Y = g L/(A × slope): standard school physics found in any textbook."
  - "The material values (Young's modulus, elastic limit, greatest stress, strains) are made-up, rounded teaching numbers that behave like the named material, not data for any real grade. g = 9.8 m/s²."
  - "Checked by hand: a 2 m, 0.5 mm steel wire (Y 200 GPa) stretches 2.496 mm under 5 kg; Y comes back exactly from the slope of noise-free readings; the curve is continuous and its inverse matches it to 1 part in a million."
flow:
  - { icon: sliders, label: "Load" }
  - { icon: ruler, label: "Stretch" }
  - { icon: curve, label: "Curve" }
  - { icon: check, label: "Find Y" }
---

## What it does

Every wire stretches when you hang a load on it. For small loads it stretches in proportion to the load and springs back when you take it off: **Hooke's law**. Load it more and it goes past its **elastic limit**, flows like soft clay, keeps a **permanent stretch**, thins at one spot and finally **breaks**. This tool lets you do all of that safely with wires of steel, copper, aluminium and rubber, and shows where you are on the **stress-strain curve** as you go.

The second mode is **Searle's experiment**, the school practical for Young's modulus: add loads half a kilogram at a time, read the stretch on the micrometer, and the tool fits the best straight line and works out Young's modulus from its slope. Pick the mystery wire to find an unknown modulus yourself.

It follows the school topics on the mechanical properties of solids: stress, strain, Hooke's law, the stress-strain curve and the elastic moduli (Class 11 Physics), with Searle's apparatus from the practical list. To read a curve from a real test file use [[stress-strain-analyser]]; for forces and machines see [[simple-machines]], and for pressure in liquids [[hydraulic-lift]].

## How to use it

1. Pick **Pull a wire** or **Searle's experiment**.
2. Choose the **wire**, its **length** and its **thickness**. A thicker wire has more area, so the same load gives less stress.
3. In Pull a wire, drag the **load**. The dot on the curve and the facts show the stress, the strain, the stretch, and what happens if you take the load off. "Zoom on the start" shows the straight Hooke's law part, which is too small to see on the whole curve. "New wire" gives you a fresh one after a break.
4. In Searle's experiment, tap **Add 0.5 kg** and **Take 0.5 kg off** to take readings, and read Young's modulus from your slope. "Start again" clears the table.

## Worked example

Open the page: a **steel** wire 2 m long and 1 mm thick with **10 kg** hanging on it. The area is π × (0.0005 m)² = 7.854 × 10⁻⁷ m², the force 10 × 9.8 = 98 N, so the stress is 98 ÷ 7.854 × 10⁻⁷ = **124.78 MPa**. With Young's modulus 200 GPa the strain is 124.78 × 10⁶ ÷ 200 × 10⁹ = **6.24 × 10⁻⁴** and the stretch is 6.24 × 10⁻⁴ × 2 m = **1.248 mm**. That is inside the elastic limit (250 MPa, about 20 kg here), so the wire springs back.

Now raise the load to **25 kg**: the stress is 311.94 MPa, past the elastic limit, and the stretch jumps to about 63 mm. Lower the load to 0: the wire stays **59.70 mm** longer for good. The wire breaks above **33.7 kg** (420 MPa).

## Tips

- Strain has no unit: it is a length divided by a length.
- Young's modulus depends on the material, not on the size of the wire. The breaking load depends on both.
- In Searle's experiment, keep the loads well inside the elastic limit, or the points stop lying on a line.

## FAQ

**Why does Searle's apparatus use two wires?** The second, unloaded wire carries the spirit level and the scale, so a change in room temperature or a sagging support stretches both and cancels out.

**Why does the curve go down before it breaks?** It plots the force over the wire's starting area. Near the end the wire thins at one spot (necking), so it carries less force.

**Are these real values?** They are rounded teaching numbers that behave like each material. Real metals vary with how they were made.

**Is anything stored?** No. It all runs in your browser.
