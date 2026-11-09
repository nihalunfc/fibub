---
name: Quantum circuit simulator
num: 927
shelf: science
section: quantum-mechanics
title: "Quantum circuit simulator: state vector up to 20 qubits, OpenQASM 2.0 import and export"
summary: "Write or open an OpenQASM 2.0 program, or build a circuit gate by gate, and simulate it exactly in your browser for up to 20 qubits: circuit diagram, outcome probabilities and simulated shot counts, each qubit's Bloch vector, the full state vector, and the circuit saved back as OpenQASM 2.0."
status: live
ads: true
order: 5
icon: table
works: offline
updated: 2026-11-09
related: [bloch-sphere, hydrogen-orbitals, operator-algebra, error-correcting-codes, cipher-teacher, logic-simplifier, matrix-calculator]
sources:
  - "OpenQASM 2.0 language and the qelib1.inc gate definitions: Cross, A. W., Bishop, L. S., Smolin, J. A. and Gambetta, J. M. (2017), Open Quantum Assembly Language, arXiv:1707.03429 (the specification; no code from it is used)."
  - "State-vector simulation and gate matrices: standard textbook results, for example Nielsen, M. A. and Chuang, I. L., Quantum Computation and Quantum Information."
  - "Checked against an independent NumPy simulator built from Kronecker products and scipy.linalg.expm, written for the tests."
  - "The example circuit is made up."
flow:
  - { icon: pencil, label: "QASM" }
  - { icon: calculator, label: "Simulate" }
  - { icon: chart, label: "Outcomes" }
  - { icon: download, label: "Export" }
---

## What it does

A quantum computer's state for n qubits is a list of 2ⁿ complex numbers, the **amplitudes** of every basis state from |00…0⟩ to |11…1⟩. Each gate mixes them, and measuring at the end picks one basis state with probability |amplitude|². This simulator keeps the whole list and applies each gate exactly, so for up to 20 qubits (about a million amplitudes) it gives the exact answer a perfect, noise-free quantum computer would.

Circuits are written in **OpenQASM 2.0**, the plain-text format that Qiskit and many other tools read and write, so you can paste a circuit from elsewhere, check it here and save it again. You can also build one with the gate picker.

Follow one qubit's state on the [[bloch-sphere|Bloch sphere]], and check gate matrices with the [[operator-algebra|operator algebra helper]].

## How to use it

1. Edit the program, **open a .qasm file**, or start from the example or an empty circuit.
2. To add a gate without typing, pick it, give its angle (pi/2, 0.3, 2*pi/3 ...) and its qubit numbers, and press **Add gate**. Gates go in before any measurements. **Measure all** adds a measurement of every qubit.
3. Set the number of **shots**: the simulated repeat runs, for counts like those from real hardware. The random draws repeat exactly for the same circuit.
4. Read the results and download the outcomes, the state vector (up to 16 qubits) or the circuit as OpenQASM 2.0. The saved file has one register q and one c, and any gates you defined yourself are written out in full.

## What the results mean

- **Outcomes:** the exact probability of each result, as a string of classical bits c[n−1] … c[0] (or of all qubits if nothing is measured), and the counts from the simulated shots.
- **Each qubit on its own:** the qubit's Bloch vector after tracing out the rest. A length of 1 means a pure state; a length below 1 means the qubit is **entangled** with others (0 for a maximally entangled one).
- **State vector:** the non-zero amplitudes, largest first, with probability and phase.

Bit order follows Qiskit: **q[0] is the rightmost bit**. So after `x q[0];` on three qubits the outcome is 001.

## Worked example

The example makes a three-qubit **GHZ state**: H on q[0], then CNOTs from q[0] to q[1] and q[1] to q[2], then an rz(π/4) on q[2], and measures everything. The page shows **3 qubits, 4 gates: 2 possible outcomes**: 000 and 111, each with probability 0.5, and roughly 512 counts each out of 1,024 shots. Every qubit's Bloch vector has length 0, the signature of full entanglement. The state vector shows the rz as a phase: |000⟩ with phase −22.5° and |111⟩ with +22.5°, 45° apart, which no measurement in the computational basis can see.

## FAQ

**Why only 20 qubits?** Each extra qubit doubles the memory and time. 20 qubits is about a million amplitudes, which a phone handles in a moment; 30 would need gigabytes.

**Does it model noise?** No. It is an ideal simulator, for study and planning rather than a substitute for professional judgement or real hardware results.

**Is my circuit uploaded?** No. Everything runs in your browser and the circuit never leaves your device.
