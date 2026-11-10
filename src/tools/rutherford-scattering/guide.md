---
name: Rutherford scattering
num: 1069
shelf: learn
code: L33
section: school-physics
title: "Rutherford scattering"
summary: "Fire alpha particles at a gold atom. With the plum pudding model they all go straight through; with a tiny nucleus most still do, but a few bounce right back. Then aim one particle and see its scattering angle and how close it gets to the nucleus."
status: live
ads: false
order: 1069
icon: target
works: offline
updated: 2026-11-09
related: [hydrogen-spectrum, hydrogen-orbitals, states-of-matter]
sources:
  - "Rutherford scattering of alpha particles by a point nucleus: head-on closest approach d = k(2e)(Ze)/K, tan(θ/2) = d/(2b), closest approach (d/2)(1 + √(1 + (2b/d)²)); Thomson's plum pudding model: standard physics."
  - "e²/(4πε₀) = 1.43996448 MeV fm (CODATA 2018)."
  - "Checked against an independent Python calculation and a step-by-step integration of the Coulomb path (angles within 0.1°, closest approach within 1%)."
flow:
  - { icon: target, label: "Fire" }
  - { icon: eye, label: "Watch" }
  - { icon: curve, label: "Angle" }
  - { icon: check, label: "Check" }
---

## What it does

In 1909 Geiger and Marsden, working with Ernest Rutherford, fired fast alpha particles (helium nuclei, charge +2e) at a very thin gold foil. The accepted picture of the atom then was Thomson's **plum pudding**: positive charge spread through the whole atom with electrons dotted in it. That predicts every alpha particle should go almost straight through. Most did, but about 1 in 8,000 bounced back, which Rutherford compared to a shell bouncing off tissue paper. The only explanation was a tiny, heavy, positive **nucleus**. This page lets you fire a beam at either model and count where the particles go, and, on the Class 12 level, aim a single particle and see its **scattering angle** and **closest approach**.

It follows the school topics on atomic structure: Class 9 Science, Structure of the Atom (Thomson's model, Rutherford's alpha-particle scattering experiment, Rutherford's model), and Class 12 Physics, Atoms (alpha-particle scattering and Rutherford's nuclear model, alpha-particle trajectory, impact parameter, distance of closest approach). Before this, [[states-of-matter]] shows that matter is made of particles; afterwards, [[hydrogen-spectrum]] shows how Bohr added energy levels, and [[hydrogen-orbitals]] shows the modern picture.

## How to use it

1. Choose the model: **Nucleus** (Rutherford) or **Plum pudding** (Thomson).
2. With **A beam**, particles fly in at random heights. The counters show how many went almost straight (under 10°), were turned 10° to 90°, or bounced back (over 90°). **Reset counts** starts again.
3. Change the **foil** and the **alpha particle energy**. Faster particles and lighter nuclei mean less bending.
4. Switch the **Level** to **Class 12** for the formulas, then choose **One particle** and slide its **aim b** (the impact parameter, the distance by which it would miss the nucleus if it were not pushed). The graph shows the angle against the aim.

## Worked example

With the page as it opens (gold, Z = 79, alpha particles of 5 MeV), a particle aimed straight at the nucleus stops where all its energy has become electric energy: d = 1.44 MeV fm × 2 × 79 / 5 MeV = 45.5 fm (1 fm = 10⁻¹⁵ m). That is much smaller than the atom (about 140,000 fm across) but larger than the gold nucleus itself (about 7 fm), so the particle never touches it.

On **One particle** with aim b = 1.00 d = 45.5 fm, tan(θ/2) = d / 2b = 0.5, so the particle is turned through θ = 53.13°, and it comes no closer than (d/2)(1 + √5) = 73.6 fm. With b = 0.5 d it turns through exactly 90°.

## Check yourself

Five questions, fresh each time: the head-on closest approach, the angle for a given aim, what the experiment showed about empty space and about the nucleus, and how the closest approach changes with energy. Nothing is saved.

## Tips

- The picture is zoomed in thousands of times on one nucleus. In a real foil the nuclei are so far apart that almost every particle passes far from all of them, which is why only about 1 in 8,000 bounced back.
- The paths are hyperbolas: the push of the nucleus gets weaker as 1/r², exactly like gravity but repelling.
- Rutherford's formula breaks down for very fast alpha particles on light nuclei, when they get close enough to touch: the first hint of the strong nuclear force.

## FAQ

**Why do the electrons not stop the alpha particles?** An electron is about 7,000 times lighter than an alpha particle, so it is like a fly hitting a bus.

**Why does the plum pudding model fail?** Its positive charge is spread over the whole atom, so the push on a passing alpha particle is never strong: it can only turn it by a tiny fraction of a degree.

**Is this from NCERT?** No. It is an independent study aid that follows the same school topics, with its own pictures and numbers.
