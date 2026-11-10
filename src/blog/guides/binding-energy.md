---
title: "Binding energy per nucleon explained, with a worked example"
summary: "Why nuclei weigh less than their parts, how mass defect gives binding energy, and why fission and fusion both release energy. A clear guide to the binding energy lab."
tools: [binding-energy, decay-calculator, decay-chain]
updated: 2026-11-10
sources:
  - "Mass defect, binding energy B = (Z m_H + N m_n − M) c² and the shape of the binding-energy-per-nucleon curve: standard physics."
  - "Atomic masses: AME2020 (Atomic Mass Evaluation 2020); neutron mass and 1 u = 931.494 MeV: CODATA 2018. Rounded to six decimals."
---

The binding energy lab shows one of the most useful graphs in physics, and lets you calculate the numbers behind it. It is for school students in Class 12 physics, teachers, and anyone curious about why the Sun shines and why reactors work. To see how the nucleus was discovered first, read about [[rutherford-scattering]]. For what happens when unstable nuclei decay, go on to the [[decay-calculator]] and [[decay-chain]].

## What it is

A nucleus is made of protons and neutrons, together called nucleons. Weigh a helium-4 nucleus, then weigh two separate protons and two separate neutrons. The parts weigh more than the whole. The missing mass is the **mass defect**, Δm.

That mass did not vanish. It left as energy when the nucleus formed, following Einstein's E = mc². The same energy must be put in to pull the nucleus apart. This is the **binding energy**:

B = Δm × 931.494 MeV per u

Here Δm is in atomic mass units (u), and 931.494 MeV is the energy equivalent of one u. MeV is a million electron-volts, a tiny energy unit used for single nuclei.

Divide B by the number of nucleons A to get the **binding energy per nucleon**. It tells you how tightly an average nucleon is held. Plot it against A and you get a curve that climbs steeply, peaks near iron (A about 56) and then falls slowly. Higher means more stable. Any change that moves nucleons up the curve gives out energy: fusing light nuclei, or splitting very heavy ones.

## How to use it

1. Slide the mass number A along the curve. Watch the binding energy and the five terms of the liquid drop formula (volume, surface, Coulomb, asymmetry, pairing).
2. Look for the real nuclei shown as dots, and notice helium-4 sitting above its neighbours.
3. In the mass defect calculator, choose a nucleus from the list, or choose My own nucleus and type Z, A and an atomic mass.
4. Press Fission or Fusion to draw the reaction as an arrow on the curve, with the energy released per reaction, per nucleon and per kilogram.
5. Finish with Check yourself for fresh questions.

## A worked example

Take carbon-12. It has 6 protons and 6 neutrons, and by definition its atomic mass is exactly 12 u.

- Six hydrogen atoms (1.007825 u each): 6.046950 u.
- Six neutrons (1.008665 u each): 6.051990 u.
- Total of the parts: 12.098940 u.
- Mass defect: 12.098940 − 12 = 0.098940 u.
- Binding energy: 0.098940 × 931.494 = 92.16 MeV.
- Per nucleon: 92.16 ÷ 12 = 7.680 MeV.

Now a fusion check by hand. Suppose two deuterium atoms (2.014102 u each) joined into one helium-4 atom (4.002603 u). (In real reactors this route is rare: deuterium pairs usually make helium-3 or tritium instead, and the tool's Fusion button shows deuterium with tritium.) The mass lost is 4.028204 − 4.002603 = 0.025601 u. That is 23.85 MeV for the reaction, or 5.96 MeV for each of the 4 nucleons taking part. Helium-4 holds each nucleon with about 7.07 MeV, against about 1.11 MeV in deuterium, so the move runs up the curve.

## Where it is used

- **Power stations:** fission reactors split uranium, moving fragments up the curve. The mass defect of the reaction gives the energy per fission.
- **Stars:** fusion in the Sun builds helium from hydrogen. Stars stop making energy by fusion near iron because there is no more gain.
- **Medicine and industry:** knowing which nuclei are stable helps choose isotopes for imaging and treatment.
- **Nuclear safety and waste:** the same arithmetic tells you how much energy a given mass of fuel holds.
- **Chemistry comparison:** burning a fuel changes its mass by well under one part in a billion. Fission changes it by nearly one part in a thousand, so each atom of nuclear fuel gives millions of times more energy.

## Common mistakes

- **Using the bare proton mass.** Mass tables include the electrons. If you add 1.007276 u per proton, the electrons are left over and Δm comes out wrong. Add 1.007825 u (a hydrogen atom) per proton instead.
- **Mixing up B and B per nucleon.** The curve shows the per-nucleon value. Divide by A before you compare nuclei.
- **Forgetting units.** Δm is in u, B is in MeV. Do not mix them.
- **Thinking fusion gives more energy per reaction.** Uranium fission gives more per reaction. Fusion gives more per kilogram of fuel.
- **Expecting the formula to match exactly.** The liquid drop formula is a smooth model, so real nuclei sit a little above or below it.

## Questions people ask

**Why does the curve peak at iron?** Adding nucleons gains attraction, but the protons' growing electric push works against it. The two balance near iron and nickel.

**Is the missing mass really turned into energy?** Yes. When the nucleus forms, the energy leaves as radiation or motion, and the system's total mass drops by that energy divided by c².

**Why is helium-4 special?** All four of its nucleons fit in the lowest energy level, so it holds each one with about 7.07 MeV, more than lithium-7 (about 5.61 MeV) even though lithium is heavier. A heavy nucleus can lower its energy by throwing out such a tight bundle, and that bundle is the alpha particle.
