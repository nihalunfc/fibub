---
name: PID tuning simulator
num: 636
shelf: science
code: T433
section: control-and-robotics
title: "PID tuning simulator: step response, Bode plot, gain and phase margins and Ziegler-Nichols gains"
summary: "Pick a plant (first or second order, or any transfer function) with dead time, set the PID gains with sliders and see the closed-loop step response with rise time, overshoot, settling time and steady-state error, the controller output, the Bode plot with gain and phase margins, and Ziegler-Nichols starting values. Nothing is uploaded."
status: live
ads: true
order: 636
icon: sliders
works: offline
updated: 2026-11-09
related: [dh-kinematics, reaction-kinetics-fitter, impedance-fitter, pole-placement, kalman-filter-playground, ode-solver, digital-filter-designer]
sources:
  - "PID control with a filtered derivative, closed-loop simulation, Bode plots, gain and phase margins and the Ziegler-Nichols tuning rules (ultimate-gain and reaction-curve forms) are standard control textbook material, written out by fibub."
  - "Checked against python-control 0.10.2 (step_response, step_info, margin, poles) on 8 loops, and against an independent numpy simulation for loops with dead time."
  - "The example plant and gains are made up for this tool."
flow:
  - { icon: curve, label: "Plant" }
  - { icon: sliders, label: "PID gains" }
  - { icon: chart, label: "Step" }
  - { icon: target, label: "Margins" }
---

## What it does

A PID controller sets its output from the error between what you want (the setpoint) and what you measure: a **proportional** part (Kp × error), an **integral** part (Ki × the error added up over time, which removes steady offsets) and a **derivative** part (Kd × how fast the error changes, which damps the response). This simulator closes the loop around a plant you describe and shows what the gains do:

- **Step response** of the output to a setpoint step, with the **rise time** (10 to 90 %), **settling time** (into ±2 % or ±5 %), **overshoot**, peak and **steady-state error**, plus the **controller output** u so you can see how hard the actuator works.
- **Closed-loop poles** and whether the loop is stable.
- **Bode plot** of the open loop C(s)·G(s) with the **gain margin**, **phase margin** and **delay margin**.
- **Ziegler-Nichols** starting gains from the ultimate gain and period, and from the reaction curve (the tangent to the plant's own step response). Press **Use** to try them.
- An optional **load disturbance**: a step added to the plant input part way through, to test how well the loop holds the setpoint.

For a model in state-space form, place the poles directly with [[pole-placement|state space and pole placement]], and clean up a noisy sensor first with the [[kalman-filter-playground]].

## The plant

- **First order + dead time**: G(s) = K e^(−Ls) / (τs + 1), the usual model of a heater, a tank level or a speed loop.
- **Second order + dead time**: G(s) = K ωn² e^(−Ls) / (s² + 2ζωn s + ωn²), for something springy such as a motor and load.
- **Transfer function + dead time**: type the numerator and denominator coefficients, highest power of s first ("1 3 3 1" is s³ + 3s² + 3s + 1). It must be proper (no more zeros than poles).

## The controller

C(s) = Kp + Ki/s + Kd·s/(Tf·s + 1). Tf filters the derivative so it does not amplify noise without limit; leave it empty for Td/10, where Td = Kd/Kp. **Derivative acts on output only** avoids the spike ("derivative kick") a setpoint step would cause. The sliders run from 0 to three times the value in each box.

## Worked example

The page opens with a made-up first-order plant: K = 2, τ = 5 s and a dead time of 1 s, with Kp = 1.2, Ki = 0.3 and Kd = 0.5 (Tf = 0.0417 s). The loop is stable with a rise time of 2.59 s, an overshoot of 4.78 % (peak 1.048 at 7.55 s) and a settling time of 12.3 s (±2 %); the steady-state error is 0 because of the integral action. The Bode plot gives a gain margin of 10.9 dB (× 3.5) at 2.32 rad/s and a phase margin of 67.7° at 0.468 rad/s, so the loop could take 2.52 s more dead time before going unstable.

For this plant the phase reaches −180° at 1.689 rad/s, so the ultimate gain is Ku = 4.251 and the period Pu = 3.721 s, giving Ziegler-Nichols PID gains Kp = 2.551, Ki = 1.371 and Kd = 1.186. The reaction curve gives back K = 2, T = 5 s and L = 1 s, and Kp = 3, Ki = 1.5, Kd = 1.5. Press **Use** on either row: the response is much faster but overshoots a lot, which is what Ziegler-Nichols gains do.

## Tips

- Start with P only, raise Kp until the response is quick but not ringing, add Ki to remove the offset, then a little Kd to calm the overshoot.
- Aim for a phase margin of about 45° to 60° and a gain margin of 6 dB or more.
- Dead time limits how fast any controller can be: the delay margin tells you how much extra delay the loop can take.

## FAQ

**How is the response worked out?** Without dead time the loop is a linear system that is stepped exactly with a matrix exponential. With dead time it is integrated with fourth-order Runge-Kutta, with a whole number of steps per dead time. The list of closed-loop poles uses a 6th-order Padé approximation of the dead time; the time response and the Bode plot use the exact delay.

**Does it model output limits or integral windup?** No, the loop is linear. Watch the controller output plot: if it goes beyond what your actuator can give, the real response will be slower.

**Is anything uploaded?** No. Everything runs in your browser and works offline.
