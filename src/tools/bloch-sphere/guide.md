---
name: Spin and Bloch sphere
num: 926
shelf: science
section: quantum-mechanics
title: "Bloch sphere: apply qubit gates and rotations, and simulate Rabi oscillations with T1 and T2"
summary: "Start a spin-½ or qubit in any state, apply H, X, Y, Z, S, T and rotations about any axis, and watch its path on a turnable Bloch sphere with the final amplitudes and probabilities. Drive it with a Rabi frequency and detuning, add T1 and T2 relaxation, and see the oscillation, the π-pulse length and the steady state."
status: live
ads: true
order: 4
icon: orbit
works: offline
updated: 2026-11-09
related: [hydrogen-orbitals, schrodinger-solver, plot-maker, quantum-circuit, operator-algebra, mri-bloch-simulator, polarisation-calculator]
sources:
  - "Bloch sphere representation, single-qubit gates as SU(2) rotations, the Rabi formula and the optical Bloch equations with T1 and T2 (Torrey steady state): standard textbook results, for example Nielsen, M. A. and Chuang, I. L., Quantum Computation and Quantum Information, and Allen, L. and Eberly, J. H., Optical Resonance and Two-Level Atoms."
  - "Checked against NumPy/SciPy (scipy.linalg.expm of the Pauli matrices and scipy.integrate.solve_ivp of the Bloch equations) written for the tests."
  - "All example numbers are made up."
flow:
  - { icon: target, label: "Start" }
  - { icon: sliders, label: "Gates" }
  - { icon: orbit, label: "Sphere" }
  - { icon: chart, label: "Rabi" }
---

## What it does

Any state of a spin-½ particle, or of a qubit, can be written as cos(θ/2)|0⟩ + e^{iφ} sin(θ/2)|1⟩, a point on a sphere: the **Bloch sphere**. |0⟩ (spin up) is the north pole, |1⟩ the south pole, and equal superpositions sit on the equator. Every operation on a single qubit is a rotation of this sphere, which makes it the clearest picture of what gates and magnetic resonance do.

The tool has two parts:

- **Gates and rotations.** Pick a start state and type or tap a list of gates. The tool applies them one after another, draws the path the state takes on the sphere, and gives the final amplitudes, Bloch vector, angles and the measurement probabilities along z, x and y, with a table of every step.
- **Rabi oscillations.** A qubit driven by an oscillating field at Rabi frequency Ω, detuned by Δ, swings between |0⟩ and |1⟩. The tool solves the Bloch equations in the rotating frame, with optional T1 (energy relaxation) and T2 (dephasing), and plots the probability of |1⟩ against time, alongside the path on the sphere.

Put several qubits together in the [[quantum-circuit|quantum circuit simulator]], and work out spin matrices with the [[operator-algebra|operator algebra helper]].

## How to use it

1. Choose the **start state**: one of the six poles of the sphere, or any angles θ and φ.
2. Type gates separated by semicolons, or tap the gate buttons. Angles are in degrees (Rx(90)) or radians if you write pi (Rx(pi/2)). R(θ, x, y, z) rotates by θ about any axis.
3. For Rabi oscillations, set Ω/2π and Δ/2π in MHz and the drive time in µs. Leave T1 and T2 blank for a perfect qubit; with only T1 given, T2 is taken as 2 × T1, its largest possible value.
4. Turn and tilt the spheres with the sliders, and download the results.

## Worked example

The page opens with |0⟩ and the gates **H; T; Rx(90)**. H takes the north pole to |+⟩ on the equator; T turns it 45° round the z axis; Rx(90) tips it up towards the north. The result is **0.9239 |0⟩ + (0.3827) |1⟩**, Bloch vector (0.7071, 0, 0.7071), θ = 45°: a 85.36 % chance of measuring 0.

In the Rabi part, Ω/2π = 1 MHz and Δ/2π = 0.5 MHz. The π-pulse on resonance would be 0.5 µs, but the detuning raises the oscillation to 1.118 MHz and caps the largest P(1) at 0.8. After 3 µs, **P(1) = 0.6434**. Type T1 = 2 and T2 = 1.5 and the oscillation dies away towards the steady state 0.4181.

## Tips

- Gates that differ only by a global phase (Z and Rz(180), for example) give the same point on the sphere; the amplitudes are shown with the |0⟩ part made real and positive.
- With T2 shorter than T1 the path spirals inwards, off the surface: the state becomes mixed.
- The units only need to match: GHz with ns works as well as MHz with µs.

## FAQ

**Why is H a rotation about the diagonal?** H swaps the z and x axes, which is a half-turn about the axis halfway between them.

**Can this design a real pulse?** It is for study and planning, not a substitute for professional judgement on real hardware, where pulse shapes, leakage and noise matter.

**Does anything get uploaded?** No. Everything runs in your browser.
