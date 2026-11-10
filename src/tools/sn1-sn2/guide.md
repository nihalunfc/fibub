---
name: SN1 vs SN2
num: 1108
shelf: learn
section: school-chemistry
title: "SN1 vs SN2"
summary: "Choose a methyl, primary, secondary, tertiary or benzylic halide, a strong or weak nucleophile, a protic or aprotic solvent and the leaving group, and see which substitution route wins and why. Compare the one-step and two-step energy profiles, watch backside attack flip the molecule (Walden inversion) or the flat carbocation give a racemic mixture in 3D, and test yourself."
status: live
ads: false
order: 1108
icon: flask
works: offline
updated: 2026-11-09
related: [chirality-checker, carbon-chain-namer, vsepr-shapes]
sources:
  - "SN1/SN2 rules (substrate class, nucleophile strength, solvent, leaving group, rate laws, inversion and racemisation) are general organic chemistry, written fresh for fibub. The points and the energy profiles are a schematic teaching model, not measured values."
  - "Checked against the standard textbook outcomes (methyl and primary halides go SN2, tertiary go SN1 in protic solvents and never SN2, secondary depends on conditions) and, with the CIP model of the chirality checker, that backside attack on (R)-2-bromobutane gives (S)-butan-2-ol while the carbocation route gives both."
flow:
  - { icon: sliders, label: "Conditions" }
  - { icon: chart, label: "Profiles" }
  - { icon: eye, label: "Watch it" }
  - { icon: check, label: "Check" }
---

## What it does

When a nucleophile (an electron-rich group like OH⁻) replaces the halogen in an alkyl halide, it can happen in one step, **SN2**, or in two steps through a carbocation, **SN1**. This page lets you change the conditions and see which route wins, with a reason for every choice. Two bars show the points each route collects from the rules, an **energy profile** shows one hump for SN2 and two humps with a carbocation valley for SN1, and a 3D **animation** shows what happens to the carbon.

It follows the Class 12 Chemistry chapter on haloalkanes and haloarenes (nucleophilic substitution, SN1 and SN2, stereochemistry, optical activity, retention and inversion, elimination). Assign R and S yourself with the [[chirality-checker]], name the halides with the [[carbon-chain-namer]], and see why the carbocation is flat with the [[vsepr-shapes]] tool.

## How to use it

1. Choose the **Substrate**: methyl, primary, secondary, tertiary or benzylic bromide, and the **Leaving group** (I, Br, Cl, F).
2. Choose a **Nucleophile**: strong and charged (OH⁻, CN⁻) or weak and neutral (H₂O, alcohols).
3. Choose a **Solvent**: polar aprotic (acetone, DMSO) or polar protic (water, ethanol).
4. Read the verdict, the two point bars and the reasons. A red note warns when elimination also competes.
5. In **Watch it happen**, pick SN2 or SN1, drag the progress slider or press **Play**, and turn the molecule with your finger. For SN1 choose which side the nucleophile attacks.

## Worked example: 2-bromobutane

Start with the secondary halide, a strong nucleophile and an aprotic solvent: SN2 gets 0 + 2 + 1 = 3 points, SN1 0 + 0 − 1 = −1, so **SN2 is favoured**. Play the animation: OH⁻ comes in from the side opposite the bromine, the transition state has five groups round the carbon, and the other three groups flip like an umbrella. (R)-2-bromobutane becomes **(S)-butan-2-ol**: inversion.

Now pick a weak nucleophile and a protic solvent: SN1 has 0 + 1 + 2 = 3, SN2 0 − 1 + 0 = −1, so **SN1 is favoured**. Bromide leaves first, leaving a flat carbocation; water or OH attacks either face equally, giving a **50 : 50 racemic mixture** of R and S.

## Tips

- **Crowding stops SN2**: tertiary halides can't be attacked from behind.
- **Stability helps SN1**: tertiary and benzylic carbocations are stable enough to form.
- **SN2 rate = k[R–X][Nu⁻]**, second order; **SN1 rate = k[R–X]**, first order, because only the halide is in the slow step.

## FAQ

**Are the points real numbers?** No. They are a simple way to weigh the textbook rules; real reactions can give mixtures.

**Is this an NCERT tool?** No. It is a free fibub page made for this chapter; it runs on your device.
