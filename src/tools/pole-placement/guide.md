---
name: Pole placement
num: 638
shelf: science
code: T435
section: control-and-robotics
title: "Pole placement"
summary: "Enter the state-space matrices A, B, C and D to get controllability and observability (matrices and ranks), the open-loop eigenvalues, the state-feedback gain K that places your chosen poles (Ackermann), an observer gain L by duality, and the closed-loop step response. Nothing is uploaded."
status: live
ads: true
order: 638
icon: sliders
works: offline
updated: 2026-11-09
related: [pid-simulator, kalman-filter-playground, matrix-calculator, ode-solver]
sources:
  - "Own code: controllability and observability matrices, Ackermann's formula, observer design by duality, Faddeev-LeVerrier characteristic polynomial with Aberth root finding, Jacobi SVD for ranks, and exact zero-order-hold step response through the matrix exponential (standard control theory methods)."
  - "Checked against python-control (acker, place, ctrb, obsv, step_info), NumPy (eigvals, matrix_rank, svd) and SciPy (expm, signal.step) on the example and four random systems of 2 to 5 states."
  - "The example servo system and its pole choices are made up for fibub."
flow:
  - { icon: table, label: "A, B, C, D" }
  - { icon: check, label: "Rank tests" }
  - { icon: target, label: "Place poles" }
  - { icon: curve, label: "Step" }
---

## What it does

In state-space form a linear system is ẋ = Ax + Bu, y = Cx + Du. With **state feedback** u = N·r − Kx, the closed-loop dynamics are set by the eigenvalues (poles) of A − BK, and if the system is controllable you can put them anywhere you like. This tool:

- checks **controllability** and **observability**: it builds [B AB … Aⁿ⁻¹B] and [C; CA; … CAⁿ⁻¹] and gives their ranks;
- lists the **open-loop eigenvalues** and says whether the system is stable;
- finds the gain **K** that places your chosen poles with **Ackermann's formula** (single input), and checks the result by working out the eigenvalues of A − BK again;
- scales the reference with **N** so the output settles at 1;
- finds the **observer gain L** that places the poles of A − LC, by duality (single output);
- draws the **closed-loop step response** (computed exactly with the matrix exponential) with rise time, overshoot and settling time, and downloads it all as CSV, PNG, PDF or Word.

Multi-input pole placement has many possible answers and needs a robust method; this tool does not try it and says so.

Compare with simple feedback tuning in the [[pid-simulator|PID tuning simulator]], and add a state estimator with the [[kalman-filter-playground]].

## How to use it

1. Type or paste the matrices, one row per line, or press **Use the example**. D may be left empty.
2. Type the closed-loop poles, one for each state, such as −2±2j, −10. Faster poles (further left) give a quicker response but larger gains and inputs.
3. Optionally give observer poles; empty means 4 times faster than the controller's.

## Worked example

The made-up servo has A = [0 1 0; 0 −0.5 1; 0 −2 −8], B = [0; 0; 4], C = [1 0 0]. Its open-loop eigenvalues are 0, −0.7769 and −7.723 (the 0 is the integrator from velocity to position), and it is controllable and observable (rank 3). Placing the poles at −2 ± 2j and −10 gives **K = [20, 9.8125, 1.375]** and N = 20. The step response rises in about 0.79 s, overshoots by 4.1 % and settles within 2 % in about 2.2 s. Observer poles at −8 ± 8j and −40 give L = [47.5, 358.25, 1969].

## FAQ

**Why must complex poles come in pairs?** So that K is real; a real system's poles are always real or in conjugate pairs.

**Is anything uploaded?** No. Everything runs in your browser and works offline.
