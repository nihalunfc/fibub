---
title: "Natural-fibre silicone phantoms that mimic skin and muscle in ultrasound"
summary: "A 2025 open-access study designs anisotropic ultrasound phantoms from natural fibres in a silicone matrix. Here is what their speed of sound means for a scanner, worked through with a free tool."
tools: [ultrasound-calculator, decibel-distance]
updated: 2026-11-10
sources:
  - "Fernandes NATC, Alves DI, Ferreira DP, Monteiro M, Arieira A, Silva F, Hinckel B, Leal A and Carvalho Ó (2025), Sustainable Tunable Anisotropic Ultrasound Medical Phantoms for Skin, Skeletal Muscle, and Other Fibrous Biological Tissues Using Natural Fibers and a Bio-Elastomeric Matrix, Journal of Composites Science 9(7), 370. Open access, CC BY. Details checked on the publisher's page, 2026-11-10."
  - "Acoustic impedance Z = ρc, normal-incidence intensity reflection ((Z₂ − Z₁)/(Z₂ + Z₁))², echo time 2d/c and attenuation α·f·d: standard ultrasound physics. The 1540 m/s speed that scanners assume is the usual soft-tissue convention."
paper:
  title: "Sustainable Tunable Anisotropic Ultrasound Medical Phantoms for Skin, Skeletal Muscle, and Other Fibrous Biological Tissues Using Natural Fibers and a Bio-Elastomeric Matrix"
  authors: "Fernandes N A T C, Alves D I, Ferreira D P, Monteiro M, Arieira A, Silva F, Hinckel B, Leal A, Carvalho Ó"
  journal: "Journal of Composites Science"
  year: 2025
  doi: "10.3390/jcs9070370"
  url: "https://www.mdpi.com/2504-477X/9/7/370"
  licence: "CC BY"
  reviewed: true
---

A phantom is a block of material that behaves like body tissue under an ultrasound probe, so that doctors can practise and engineers can test scanners without a patient. Most phantoms are made of gels or plastics that look the same in every direction, but skin and muscle are full of fibres, and they stretch and carry waves differently along and across them. A 2025 open-access paper in the *Journal of Composites Science* designs phantoms from renewable natural fibres set in a silicone-based elastomer, aimed at skin, skeletal muscle and other fibrous tissues. The [[ultrasound-calculator]] shows what their acoustic numbers mean for an image: where the echoes land, how bright they are and how deep the probe can see.

## What they found

The authors report stiffness values (Young's modulus) of about 7 to 11 MPa for their skin-like versions and about 0.5 to 1.7 MPa for the muscle-like ones, and shear wave speeds of about 1.5 to 5.9 m/s. Those shear speeds matter for elastography, the ultrasound mode that maps tissue stiffness. In their dynamic tests between 10 and 100 Hz, the storage and loss moduli (how much of the energy is stored and how much is lost as the material flexes) fell in the kilopascal range.

For ordinary ultrasound the abstract gives longitudinal sound speeds of about 1086 to 1127 m/s and sound absorption of about 0.13 to 0.76 dB per cm per MHz. The paper's key claim is that the response changes with direction, as it does in real fibrous tissue, and that the fibre type and amount can tune it.

## Why it matters

Training phantoms are used in large numbers and often thrown away, and many are made from petroleum-based plastics. A phantom built from plant fibres and a softer, partly bio-based matrix could be cheaper and greener. Direction-dependent behaviour is also something most phantoms lack, yet it is exactly what clinicians see when they scan a tendon or a muscle along and then across its fibres.

## How they did it

The team characterised the silicone matrix with tensile tests and fitted the curves to several standard models for rubber-like materials (Neo-Hookean, Mooney-Rivlin and Ogden). They then used finite-element simulations in COMSOL: a pulled strip to predict stiffness, a small square sample treated as a spring and damper in parallel (a Kelvin-Voigt model) to predict the dynamic moduli, and a time-stepping solver for the acoustic wave equation to follow sound through the fibre-filled material.

## Check it yourself with fibub

The paper's sound speed is well below the **1540 m/s** that almost every scanner assumes for soft tissue. Here is what that does to an image. The density below is **our own assumption** (silicones are typically a little denser than water), not a value from the paper.

1. Open the [[ultrasound-calculator]]. Set the frequency to **5 MHz**, **3** cycles per pulse, a **10 mm** transducer and a depth of interest of **3 cm**.
2. For medium 1 choose "My own values": density **1100 kg/m³**, speed of sound **1100 m/s** and attenuation **0.5 dB/cm/MHz** (a round number inside the paper's range). For medium 2 choose "Soft tissue (average)" (the page starts on Liver).
3. Read the echo timing: a reflector 3 cm deep returns after about **54.5 µs**. A scanner that assumes 1540 m/s converts that time to 54.5 µs × 1540 m/s ÷ 2 ≈ **4.2 cm**. Everything in the phantom would look **1.4 times deeper** than it is, a known problem with silicone phantoms that has to be corrected or designed out.
4. Look at the boundary results. The phantom's impedance is about **1.21 MRayl** against about **1.63 MRayl** for soft tissue, so about **2.2 per cent** of the sound intensity reflects at the interface. That is a visible but gentle echo, a sign the materials are reasonably matched.
5. Try an angle of **20°**. Because sound travels faster in tissue, the beam bends away to about **28.6°**, and beyond about **45.6°** it would be totally reflected.
6. Change the attenuation to the two ends of the paper's range. At **0.13** dB/cm/MHz the half-value layer is about **4.6 cm**; at **0.76** it is about **0.8 cm**, and with a 60 dB dynamic range the deepest useful echo drops from about 46 cm to about **7.9 cm**. Fibre content clearly changes how deep a probe can see.

Slower sound also shrinks the wavelength, from about 0.31 mm in soft tissue to about **0.22 mm** here, so the axial resolution in the phantom (about **0.33 mm**) is finer than the scanner would deliver in a patient. For how sound fades with distance in air, a different problem, the [[decibel-distance]] tool covers the inverse square law.

## The fine print

Much of the paper's analysis is computational, built on tensile data for the matrix and literature models for the fibres, and it reports results as ranges across formulations rather than one tuned recipe. The Kelvin-Voigt model is a simple picture of how tissue loses energy. The sound speeds in the abstract are far from the 1540 m/s scanners assume, so any image of these phantoms needs that kept in mind. Before anyone trains on them, it would also help to see how the plant fibres hold up over months of use and cleaning.
