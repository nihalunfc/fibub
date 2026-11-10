---
title: "Rutherford scattering: how the gold foil experiment found the nucleus"
summary: "Why alpha particles bouncing off gold foil proved atoms have a tiny nucleus, with the formulas for closest approach and scattering angle and a worked example on silver foil."
tools: [rutherford-scattering, states-of-matter, hydrogen-spectrum, hydrogen-orbitals]
updated: 2026-11-10
sources:
  - "Rutherford scattering by a fixed point charge: head-on distance d = k(2e)(Ze)/K, tan(θ/2) = d/(2b), closest approach (d/2)(1 + √(1 + (2b/d)²)); standard physics, Class 12 level."
  - "e²/(4πε₀) = 1.43996448 MeV fm (CODATA 2018)."
---

Around 1910, a simple experiment changed our picture of the atom. Fast alpha particles were fired at a very thin sheet of gold, and while almost all of them went straight through, a tiny number came flying back. The [[rutherford-scattering]] tool lets you repeat that experiment on screen, with a beam of particles or a single aimed shot, and compare the result with the older "plum pudding" model. It works at two levels: Class 9 for the ideas and Class 12 for the formulas. To see why matter is made of particles at all, start with [[states-of-matter]]. After the nucleus, the [[hydrogen-spectrum]] shows how electrons sit in energy levels, and [[hydrogen-orbitals]] shows the modern picture of where they are.

## What it is

An **alpha particle** is a helium nucleus: two protons and two neutrons, with a charge of +2e (e is the charge of one proton). In J. J. Thomson's **plum pudding** model, an atom was a ball of thinly spread positive charge with electrons scattered through it. Spread-out charge pushes weakly, so an alpha particle should barely be deflected. Ernest Rutherford's team, Hans Geiger and Ernest Marsden, found otherwise. The only way to send a fast particle straight back is to pack all the positive charge, and nearly all the mass, into a tiny **nucleus**.

The push between the alpha particle and the nucleus is the electric (Coulomb) force, which weakens as 1/r². Three results follow from it.

**Head-on closest approach.** Fire the particle straight at the nucleus and it slows until all its kinetic energy K has turned into electric energy:

d = k × (2e) × (Ze) / K

Here Z is the number of protons in the nucleus and k e² = 1.44 MeV fm. One femtometre (fm) is 10⁻¹⁵ m, and an MeV is a million electronvolts, a unit of energy.

**Scattering angle.** If the particle is aimed off-centre by a distance b (the **impact parameter**), it is turned through an angle θ given by

tan(θ/2) = d / (2b)

At b = 0 it comes straight back (180°).

**Closest approach for any aim.** The particle never gets nearer than

r_min = (d/2) × (1 + √(1 + (2b/d)²))

which is d itself when b = 0, and grows as the aim moves further out.

## How to use it

1. Choose **Nucleus** or **Plum pudding** at the top to pick the model of the atom.
2. Leave **A beam** selected and watch particles fly in at random heights. Three counters keep score: almost straight (under 10°), turned 10° to 90°, and bounced back (over 90°), each with a percentage. **Pause** stops the motion and **Reset counts** starts the tally again.
3. Pick a **Foil** (gold, silver, copper or aluminium) and move the **Alpha particle energy** slider, which runs from 1 to 10 MeV.
4. Switch the level to **Class 12** to see the head-on distance worked out, along with a graph of angle against aim.
5. Choose **One particle** and slide the aim from 0 to 5 times d. The tool shows the path, the angle θ and the closest approach, with a dashed circle marking how close it got.
6. Work through the five **Check yourself** questions.

## A worked example

Take **silver** foil (Z = 47) and alpha particles of **7.5 MeV**.

**Head-on distance:**
d = 1.44 MeV fm × 2 × 47 / 7.5 MeV = **18.0 fm** (18.05 fm with the full constant).

**Aim b = 2 d = 36.1 fm.** Then tan(θ/2) = 1 / (2 × 2) = 0.25, so θ/2 = 14.04° and **θ = 28.1°**. The closest approach is (d/2)(1 + √17) = 2.56 d = **46.2 fm**.

**Aim b = 0.25 d = 4.5 fm.** Then tan(θ/2) = 1 / (2 × 0.25) = 2, so θ/2 = 63.43° and **θ = 126.9°**: the particle comes back towards where it started. Its closest approach is (d/2)(1 + √1.25) = **19.1 fm**, only a little more than the head-on distance.

Notice how sharply the angle depends on the aim. Moving in from 2 d to 0.25 d, an eighth of the distance, takes the deflection from under 30° to well over 90°. That is why the beam counters show so few bounce-backs.

## Where it is used

- **Measuring nuclear size.** When fast particles get close enough to touch the nucleus, the results stop following the formula. The energy where this starts gives the size of the nucleus.
- **Rutherford backscattering spectrometry.** Labs fire helium ions at a material and measure the energy of the ones that bounce back. Heavier atoms return more energy, so the method shows which elements are in a thin film and how deep they lie.
- **Particle physics.** The same "fire things and count where they go" approach, with electrons at much higher energy, later showed that protons have smaller parts inside them.

## Common mistakes

1. **Mixing up b and the closest approach.** b is how far the particle would miss if there were no push. The closest approach is always larger, because the push bends the path away.
2. **Thinking a higher energy means more bounce-backs.** Faster particles get closer, but they also bend less. In the counters, fewer particles come back at higher energy.
3. **Forgetting the 2 for the alpha charge.** The alpha particle carries 2e, so the formula has 2 × Z, not Z.
4. **Reading the picture as true scale.** The view is zoomed in hugely on one nucleus.
5. **Using the formula when the particle touches the nucleus.** For light nuclei and high energies, the strong nuclear force joins in and the simple result no longer holds.

## Questions people ask

**Why gold?** Gold can be beaten into foil less than a micrometre thick, and its large charge (Z = 79) gives strong, easy-to-see deflections.

**Which aim gives a 90° turn?** Half the head-on distance: b = 0.5 d gives tan(θ/2) = 1, so θ = 90°.
