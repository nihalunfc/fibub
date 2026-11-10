---
name: Coupled oscillators
num: 907
shelf: science
code: T642
section: classical-mechanics
title: "Coupled oscillators"
summary: "Line up to 12 masses joined by springs, between walls or floating free, and get every normal mode: its frequency, period and shape. Watch a single mode or any starting push move, see how the energy is shared between the modes, and download the motion."
status: live
ads: true
order: 7
icon: curve
works: offline
updated: 2026-11-09
related: [pendulum-analyser, moment-of-inertia, collision-calculator, wave-calculator, lagrangian-helper, standing-waves, matrix-calculator, ode-solver, fourier-visualiser]
sources:
  - "Small oscillations, the generalised eigenproblem K v = ω² M v and normal-mode superposition: standard classical mechanics. Eigenvalues by the cyclic Jacobi method (own code)."
  - "Checked against SciPy eigh for the generalised problem, the closed form ω = 2√(k/m) sin(jπ/2(N+1)) for a uniform chain, and the matrix exponential of the equations of motion (SciPy expm)."
  - "The example masses and springs are made up."
flow:
  - { icon: sliders, label: "Springs" }
  - { icon: sigma, label: "Eigenmodes" }
  - { icon: chart, label: "Shapes" }
  - { icon: curve, label: "Motion" }
---

## What it does

Join two pendulums with a spring, or line up masses on springs, and the motion looks complicated: energy sloshes from one to another and back. Underneath, every such system has a set of **normal modes**: special patterns in which all the masses swing at the **same frequency**, in step or in opposition, with fixed proportions. Any motion at all is just a sum of these modes, each swinging at its own frequency. Molecules vibrate this way, crystals carry sound this way, and buildings sway this way.

This tool takes up to **12 masses in a line** joined by springs, with both ends tied to walls, one end free, or both ends free, and finds all the normal modes by solving the eigenvalue problem K v = ω² M v. It lists each mode's **angular frequency, frequency and period** and its **shape**, draws the shapes, and **animates** the chain either in one mode or from any starting displacement. It also shows **how the energy is shared** between the modes and plots every mass's displacement against time.

Derive the equations for your own system with the [[lagrangian-helper]], and look at the frequencies in the motion with the [[fourier-visualiser|Fourier and FFT visualiser]].

## How to use it

1. Choose the **ends**: two walls, one wall, or a floating chain.
2. Set the **number of masses**.
3. Type the **masses** in kg from left to right, or one number for all.
4. Type the **spring constants** in N/m from left to right, or one number for all. The page says how many springs are needed: one more than the masses with two walls, the same number with one wall, one fewer for a floating chain.
5. Under **Watch it move**, choose a single mode, "pull mass 1 aside", or your own starting displacements. **Pause**, **Play** and the **speed** slider control the animation.
6. Download the motion as a CSV file or the whole report.

## Worked example

The made-up example has masses of **1, 2 and 1.5 kg** between two walls, with springs of **10, 20, 15 and 5 N/m**. The page finds three modes at **0.272, 0.672 and 1.01 Hz** (ω = 1.708, 4.221 and 6.333 rad/s; periods 3.679, 1.489 and 0.9922 s). In the slowest mode all three masses move the same way, the heavy middle one most; in the fastest, neighbours move against each other. Pull mass 1 aside and let go and the energy is shared **1.35 %, 13.2 % and 85.5 %** between modes 1, 2 and 3, which is why the motion looks irregular. For three equal 1 kg masses with four 10 N/m springs the shapes are the textbook (0.707, 1, 0.707), (1, 0, −1) and (0.707, −1, 0.707).

## Tips

- Start in a single mode and the shape never changes; that is the defining property of a normal mode.
- Two nearly equal frequencies give **beats**: energy passes slowly back and forth between masses. Try two equal masses joined by a weak middle spring.
- A floating chain has a **zero-frequency mode**: the whole chain drifting without stretching any spring.

## FAQ

**Why are the frequencies not simply √(k/m)?** Each mass feels several springs, and its neighbours move too, so the modes mix every mass and spring together.

**What about damping?** Ideal springs and no friction are assumed. Light damping makes each mode die away slowly at almost the same frequency.

**Are the shapes unique?** Up to a sign and a scale, yes (unless two frequencies are exactly equal). Here each shape is scaled so its largest entry is 1. The tool is for study and planning, not a substitute for professional judgement.
