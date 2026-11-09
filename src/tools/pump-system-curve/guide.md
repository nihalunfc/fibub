---
name: Pump and system curve
num: 662
shelf: science
section: thermal-and-fluid-engineering
title: "Pump and system curve calculator: operating point, affinity laws, parallel and series pumps, NPSH available"
summary: "Fit a pump curve to points read off the maker's chart, build the system curve from static head and pipe friction, and find the operating point with its efficiency and power. Try pumps in parallel or series, a new speed or a trimmed impeller (affinity laws), and check NPSH available against NPSH required."
status: live
ads: true
order: 662
icon: curve
works: offline
updated: 2026-11-09
related: [pipe-network-solver, steam-tables, trend-analyser, hvac-room-load, manning-weir-calculator, dimensionless-numbers, unit-converter, curve-fitter]
sources:
  - "Pump and system curves, operating point, affinity (similarity) laws, parallel and series operation and net positive suction head: standard pump hydraulics, for example Karassik et al., Pump Handbook, and fluid mechanics textbooks such as White, Fluid Mechanics (methods only)."
  - "Pipe friction by Darcy-Weisbach with Colebrook-White, shared with fibub's pipe network tool. Water density and vapour pressure from IAPWS-IF97 (IAPWS release, 2007)."
  - "The margin rule of thumb (1 m or 30 %) is a rounded general guideline, not taken from any standard. The example pump curve and system are made up."
  - "Checked against an independent NumPy and SciPy calculation (polyfit, brentq) and the Python iapws package, written for the tests."
flow:
  - { icon: table, label: "Pump points" }
  - { icon: curve, label: "System" }
  - { icon: target, label: "Duty point" }
  - { icon: check, label: "NPSH" }
---

## What it does

A centrifugal pump does not deliver a fixed flow. It runs where its **pump curve** (head it can give at each flow, falling as the flow rises) crosses the **system curve** (head the pipework needs at each flow: the static lift plus friction, which grows roughly with the square of the flow). This tool finds that **operating point** (duty point) and tells you what it means:

- the flow and head, the pump efficiency and the shaft power there;
- how far it is from the pump's **best efficiency point** (BEP);
- what happens with **two or more identical pumps in parallel** (more flow) or **in series** (more head);
- the **affinity laws** for a new speed (for example with a variable speed drive) or a trimmed impeller: flow scales with the ratio, head with its square and power with its cube;
- **NPSH available** at the suction, compared with the pump's **NPSH required**, to warn of cavitation.

Get the friction losses of the pipes from the [[pipe-network-solver|pipe network solver]], and check water properties at your temperature in the [[steam-tables|steam tables]].

## How to use it

1. Read four to eight points off the maker's pump curve and type them: flow, head, and if you have them the efficiency and NPSH required. Paste from a spreadsheet or open a CSV or Excel file. Choose the flow unit.
2. Choose one pump, or several identical pumps in parallel or series, and any change of speed or impeller diameter.
3. Describe the system: the static head (difference in liquid levels, plus any difference in surface pressure as head) and the friction, either as a loss you know at one flow, or as a pipe length, diameter, roughness and ΣK.
4. For the suction, give the pressure on the liquid surface (absolute), the water temperature, the static suction head (negative for a suction lift) and the suction pipe loss.

## Worked example

A made-up pump with points from 0 to 50 L/s (42 m at shut-off, 19 m at 50 L/s) works against 15 m of static head with 12 m of friction at 40 L/s. The fitted curve is H = 41.91 + 0.02054 Q − 0.009554 Q² (Q in L/s, R² = 0.9999). The curves cross at **40.33 L/s and 27.20 m**. Efficiency there is 71.06 %, so the shaft power is 15.11 kW. The best efficiency point is 31.25 L/s, so the pump runs at 129 % of its BEP flow: it would suit a slightly smaller system head or a bigger pump. With 3 m of suction lift, 0.5 m of suction loss at 40 L/s (0.508 m at the duty flow) and water at 20 °C, **NPSH available is 6.604 m** against 4.033 m required, a comfortable margin. Slowing the pump from 1450 to 1300 rpm moves the duty to 33.65 L/s at 23.49 m.

## Tips

- Parallel pumps never give double the flow on a real system, because more flow means more friction. The tool shows the gain.
- Pumps like to run near their BEP. Far to the left they recirculate and run hot; far to the right they need more NPSH and may overload the motor.
- Hot water has a high vapour pressure, so NPSH available falls fast as the temperature rises.

## FAQ

**Why a quadratic for the head?** Most centrifugal pump curves are close to a parabola over their working range, and a quadratic is the usual fit. Check the R² and the dots on the chart.

**Is this enough to select a pump?** It is for study and planning, not a substitute for professional judgement. Use the maker's own curves and data for a final choice.
