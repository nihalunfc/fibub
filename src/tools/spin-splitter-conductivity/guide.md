---
name: Spin splitter conductivity
num: 147
shelf: science
code: T147
section: condensed-matter-physics
title: "Spin splitter conductivity: transverse spin current and spin polarisation of an altermagnet (Boltzmann model)"
summary: "Work out how much spin current an altermagnet sends sideways when you push a charge current through it, for any field direction. It uses the same toy tight-binding models as the band explorer and the Boltzmann equation with one scattering time. It shows the charge and spin conductivity tensors, the spin splitter ratio against field angle, and the Fermi lines with the current directions."
status: live
ads: true
order: 4
icon: flask
works: offline
updated: 2026-11-08
related: [altermagnet-bands, altermagnet-checker, anomalous-hall-checker, chiral-magnon-bands, band-structure, hall-effect, brillouin-zone]
sources:
  - "Method: semiclassical Boltzmann transport in the constant relaxation-time approximation, σij = e²τ ∫ vi vj (−∂f/∂E) d²k/(2π)² for each spin (standard solid-state textbook result). The spin splitter effect itself was proposed for altermagnets in the literature from 2021 onwards; it is cited here for the idea only."
  - "Models: the same made-up two-sublattice and one-band models as the Altermagnet band explorer, written and solved by fibub. No paper's parameters or numbers are used."
  - "Checked in the tests against an independent NumPy calculation of the same integrals."
flow:
  - { icon: sliders, label: "Model" }
  - { icon: pointer, label: "Field angle" }
  - { icon: calculator, label: "Boltzmann" }
  - { icon: chart, label: "Spin current" }
---

## What it does

In an **altermagnet**, spin-up and spin-down electrons have Fermi surfaces that are copies of each other rotated by 90°. So the two spins conduct differently along a given direction: spin up might move easily along x and spin down along y. Push a current at 45° to these axes and the two spins are steered in opposite sideways directions. You get a **transverse spin current** with no net sideways charge current. This is the **spin splitter effect**.

It works like the spin Hall effect, but it does not need spin–orbit coupling and can be much stronger. That makes it interesting for spintronics, where a spin current is used to switch a magnet.

The tool computes the effect in a toy model you control, using the Boltzmann equation. Every state has the same scattering time τ, and τ cancels out of the ratios shown.

See the bands that make the spin current in the [[altermagnet-bands|altermagnet band explorer]], and the Hall signals the crystal allows with the [[anomalous-hall-checker]].

## How to use it

1. **Pick a model.** The two-sublattice model is a d-wave altermagnet made from anisotropic hopping. The one-band model lets you choose the splitting form: d-wave cos kx − cos ky, d-wave sin kx sin ky, or g-wave. These are the same models as in the Altermagnet band explorer.
2. **Set J and μ.** J is the exchange splitting. μ sets where the Fermi level sits, and so which Fermi lines conduct.
3. **Set kT.** It smooths the Fermi edge, in units of the hopping. It must be at least 0.02 so the grid of 300 × 300 points can resolve it.
4. **Set the field angle** measured from x.

## What each result means

- **Spin splitter ratio**: the sideways spin current (in units of ħ/2e) divided by the charge current along the field. A positive value means spin up drifts to the left of the field and spin down to the right.
- **Largest ratio**: the field angle where the ratio peaks. For cos kx − cos ky splitting the peak is at 45°. For sin kx sin ky it is along x. Either way, it is zero 45° away from the peak and changes sign 90° away.
- **Spin polarisation along the field**: the spin-up minus spin-down share of the current that flows along the field. It is largest where the splitter ratio is zero.
- **Charge and spin conductivity**: the tensors σ↑ + σ↓ and σ↑ − σ↓, in units of e²τt/ħ² per cell.
- **Chart**: the splitter ratio (solid) and the spin polarisation (dashed) against field angle.
- **Fermi lines**: both spins' Fermi lines, with an arrow for the field and one for the way spin up drifts.

## Worked example

Take the default two-sublattice model (t1 = 1, ta = 0.3, tb = −0.1, J = 0.8, μ = −2, kT = 0.1, all made up).

- **Spin up:** σxx = 0.219 and σyy = 0.359, so spin up conducts more easily along y.
- **Spin down:** the reverse, σxx = 0.359 and σyy = 0.219.
- **Charge conductivity:** 0.579 in every direction, so a magnetometer or an ordinary resistance measurement sees nothing special.

With the field at **45°**, the **spin splitter ratio is 0.242**. With the field along x, nothing flows sideways, but the current is spin polarised by −0.242: more spin-down electrons carry it. At 30° the ratio is 0.209 (0.242 × sin 60°).

Set ta = tb and the two sublattices become alike. The bands are then spin-degenerate, as in a plain antiferromagnet, and every spin current vanishes.

Choose the one-band **g-wave** form and the ratio is also zero. In linear response, a g-wave splitting averages out of the conductivity tensor, because each spin's tensor already has the full square symmetry. g-wave altermagnets need other effects to show their spin splitting.

## FAQs

**Why does τ not matter?** Every state gets the same τ, so every conductivity is proportional to τ, and the ratios cancel it. With a k-dependent τ this would no longer be exact.

**Why are the values so large?** The models are toys with a strong splitting. Real materials predicted to show the effect have smaller ratios, and disorder lowers them further.

**Is this the same as the anomalous Hall effect?** No. That is a sideways **charge** current that needs spin–orbit coupling, and it is covered by the Anomalous Hall checker. The spin splitter current carries spin, not charge, and needs only the exchange splitting.

**Is anything sent anywhere?** No. Everything runs in your browser.
