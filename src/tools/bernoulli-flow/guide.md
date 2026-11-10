---
name: Bernoulli, Venturi and Torricelli
num: 1342
shelf: learn
section: school-physics
title: "Bernoulli's principle simulator: Venturi tube, pressure drop where the pipe narrows, and Torricelli's tank (speed of efflux and jet range)"
summary: "Watch water or air speed up where a pipe narrows while water columns show its pressure falling, with continuity and Bernoulli's equation worked out live. Then open a hole in a tank: the jet's speed √(2gh), where it lands and how long the tank takes to drain."
status: live
ads: false
order: 1342
icon: curve
works: offline
updated: 2026-11-09
related: [hydraulic-lift, potential-flow, stokes-terminal-velocity, projectile-drag]
sources:
  - "The equation of continuity A₁v₁ = A₂v₂, Bernoulli's equation p + ½ρv² + ρgh = constant along a streamline, the Venturi meter, Torricelli's speed of efflux √(2gh), projectile motion for the jet and the draining time (A/a)√(2h/g): standard school physics found in any textbook. g = 9.8 m/s², water 1000 kg/m³, air 1.2 kg/m³ (rounded)."
  - "Checked by hand: a 10 cm pipe narrowing to 5 cm at 2 m/s gives 8 m/s and a 30 kPa drop; the Venturi meter run backwards returns the flow; the draining level matches a step-by-step simulation to 10⁻⁵ m."
flow:
  - { icon: sliders, label: "Pipe" }
  - { icon: curve, label: "Flow" }
  - { icon: calculator, label: "Pressure" }
  - { icon: check, label: "Check" }
---

## What it does

Squeeze a garden hose and the water shoots out faster. Where a pipe narrows, the same amount of water per second has to pass through a smaller hole, so it moves faster (**continuity**). And where a fluid moves faster, its pressure is lower (**Bernoulli's principle**). This tool shows both in a **Venturi tube**: dots flow along the pipe and race through the narrow throat, while two open water columns show the pressure dropping there.

The second picture is **Torricelli's tank**: water pours from a hole in the side of a tank. It comes out exactly as fast as a stone dropped from the height of the water surface, √(2gh), and the tool draws the jet, says where it lands and how long the tank takes to drain.

It follows the school topics on streamline flow, the equation of continuity, Bernoulli's principle, the speed of efflux and the Venturi meter (Class 11 Physics, mechanical properties of fluids). For pressure in still liquids see [[hydraulic-lift]], for the stickiness of real liquids [[stokes-terminal-velocity]], and for flow round shapes [[potential-flow]].

## How to use it

1. Pick **Venturi tube** or **Torricelli's tank**.
2. In the Venturi tube, choose water or air, set the widths of the wide part and the throat, and the speed in the wide part. Read the speed in the throat, the pressure drop, the height difference of the water columns and the flow.
3. In the tank, set the depth of water above the hole and the height of the hole above the floor. Read the speed of the jet, where it lands, the flow and the time to drain.

The water columns are drawn on a squeezed scale so big and small drops both fit; the label gives the real height.

## Worked example

Open the page: water at **2 m/s** in a pipe **10 cm** across that narrows to **5 cm**. The throat has a quarter of the area, so the water moves 2 × 4 = **8 m/s** there. Bernoulli gives the pressure drop: ½ × 1000 × (8² − 2²) = **30 000 Pa** (30 kPa). That would hold up a column of water 30 000 ÷ (1000 × 9.8) = **306.1 cm** high, so the water in the throat's tube stands about 3 m lower. The flow is 0.007854 m² × 2 m/s = **15.71 litres/s**.

Switch to the tank: water **0.8 m** above a hole that is **0.45 m** above the floor. The jet leaves at √(2 × 9.8 × 0.8) = **3.960 m/s**, takes √(2 × 0.45 ÷ 9.8) = 0.303 s to fall, and lands **1.2 m** from the tank. A tank 1 m across with a 1 cm hole takes about **67.3 min** to drain down to the hole.

## Tips

- Pressure and speed trade off along the flow; height trades off too, if the pipe goes up or down.
- Lift on a wing, a spinning ball curving, and a shower curtain pulled inwards are all explained with this idea.
- Real liquids are sticky (viscous), so real pressure drops are bigger than Bernoulli alone predicts.

## FAQ

**Why does the jet speed not depend on the hole's size?** Every bit of water falls through the same height h, gaining the same energy per kilogram. A bigger hole lets out more water, not faster water.

**Why does the tank drain slower and slower?** The speed √(2gh) falls as the level falls.

**Is anything stored?** No. It all runs in your browser.
