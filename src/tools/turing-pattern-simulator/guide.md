---
name: Turing pattern simulator
num: 352
shelf: science
section: developmental-biology
title: "Turing pattern simulator: reaction-diffusion (Gray-Scott, Gierer-Meinhardt) spots and stripes, and a morphogen gradient French flag (free)"
summary: "Watch spots and stripes form from noise with the Gray-Scott and Gierer-Meinhardt reaction-diffusion models, with presets, editable parameters, a seed, a Turing stability check and a PNG download. Plus a morphogen gradient from a source with diffusion and decay, and where French-flag thresholds fall. Runs in your browser."
status: live
ads: true
order: 352
icon: curve
works: offline
updated: 2026-11-09
related: [plot-maker, wave-calculator, uncertainty-calculator, reaction-kinetics-fitter, embryo-development-timer, ode-solver, agent-based-models, cellular-automata]
sources:
  - "A. M. Turing, The chemical basis of morphogenesis, Phil. Trans. R. Soc. B 237 (1952) 37–72. A. Gierer and H. Meinhardt, Kybernetik 12 (1972) 30–39 (activator-inhibitor model; saturation as in Meinhardt's later work). P. Gray and S. K. Scott (1984) and J. E. Pearson, Science 261 (1993) 189–192 (Gray-Scott patterns; diffusion constants rescaled to grid units). L. Wolpert, J. Theor. Biol. 25 (1969) 1–47 (French flag). Equations only; the parameter sets were chosen and tested by fibub."
  - "Checked in the tests: steady states (Gray-Scott u = 1, v = 0; Gierer-Meinhardt a = μh/μa, h = ρμh/μa²) stay put; the wrap-around Laplacian conserves the total; the 1-D finite-difference gradient relaxes to the exact cosh steady state; the Turing band and fastest wavelength match NumPy eigenvalues (18.39 cells)."
  - "Patterns start from seeded random noise made up by the page."
flow:
  - { icon: curve, label: "Gradient" }
  - { icon: sliders, label: "Preset" }
  - { icon: target, label: "Run" }
  - { icon: download, label: "PNG" }
---

## What it does

How does a ball of identical cells lay down stripes, spots and body parts in the right places? This page lets you play with the two classic answers from developmental biology.

**Morphogen gradient and the French flag** (Lewis Wolpert's idea). A group of cells at one end makes a signalling molecule (a morphogen). It spreads by diffusion and is broken down as it goes, so its level falls with distance. At steady state the level is C₀·e^(−x/λ) with the **decay length λ = √(D/k)**; if the far end of the tissue is sealed, C₀·cosh((L − x)/λ) / cosh(L/λ). Cells above threshold 1 become "blue", between the thresholds "white", below threshold 2 "red", and the page shows where each boundary falls.

**Reaction-diffusion (Turing) patterns.** Two substances react with each other and diffuse at different speeds. Alan Turing showed in 1952 that this can turn an even mixture into regular spots or stripes, with a spacing set by the chemistry, not by the size of the tissue. The page simulates two standard models on a square grid that wraps around at the edges:

- **Gierer-Meinhardt**: an activator *a* that boosts its own production and that of a fast-spreading inhibitor *h*: ∂a/∂t = Da∇²a + ρa²/((1 + κa²)h) − μa·a and ∂h/∂t = Dh∇²h + ρa² − μh·h. With κ = 0 it makes spots; a little saturation (κ) gives stripes.
- **Gray-Scott**: a substance *u* fed in at rate F and turned into *v* by u + 2v → 3v, with *v* removed at rate F + k. Different F and k give spots that split, mazes of stripes, and more (Pearson 1993).

Solve the same equations step by step with the [[ode-solver]], and compare with rule-based patterns in [[cellular-automata]].

## How to use it

1. In the gradient card, set the source level, diffusion D (µm²/s), decay rate k (per second), tissue length and the two thresholds. λ and the two boundaries update at once.
2. In the pattern card, pick a **preset**, then press **Run** (press again to pause) or **Jump 2,000 steps**. Gierer-Meinhardt needs about 20,000 steps; Gray-Scott about 6,000–8,000.
3. Change any parameter while it runs to see the pattern respond, or press **Start again** to restart from the seed. The **seed** fixes the starting noise, so the same settings always give the same picture.
4. Download the current pattern (and the gradient) as a PNG image, PDF or Word file.

## What each setting does

- **Grid**: the number of cells per side. Bigger grids show more spots but run slower.
- **Time step**: how far each step moves in time. The page refuses steps that would make the explicit method blow up (4 × D × step must stay under 1).
- **Steps per frame**: how many steps are computed between pictures while running.
- **Turing check** (the line under the buttons): for Gierer-Meinhardt the page linearises the equations around the even state and reports whether it is stable without diffusion and which wavelengths grow with it, with the fastest-growing one. For the preset that is about **18.4 cells**, which you can see as the spacing of the spots.

## Worked example

With the defaults, D = 1 µm²/s and k = 0.0001 per s give **λ = 100 µm**. On a 500 µm tissue with a sealed far end, the level falls to 50 at 69.33 µm and to 20 at 161.1 µm (an open-ended tissue would give 69.31 and 160.9 µm), so the flag is blue to 69.33 µm, white to 161.1 µm and red beyond. Halve k and λ grows by √2 to 141.4 µm: every boundary moves out.

For **Gierer-Meinhardt: spots** (Da 0.02, Dh 1, ρ 0.01, μa 0.01, μh 0.02, κ 0) the even state is a = 2, h = 2. The Turing check reports growing waves between 9.29 and 42.3 cells, fastest about 18.4 cells. Run 20,000 steps on a 128-cell grid and regular spots appear, about 18 cells apart.

## Tips

- Turing patterns need the inhibitor to spread much faster than the activator. Set Dh close to Da and the check reports that no wavelength grows.
- Gray-Scott is very sensitive: changing F or k in the third decimal can switch spots to stripes or wipe the pattern out.
- The models use dimensionless grid units; they show the mechanism, not a particular animal's skin.

## FAQ

**Are these real biological values?** No. The gradient inputs are in realistic units, but you choose the numbers; the reaction-diffusion parameters are dimensionless model settings.

**Why does the pattern look different with another seed?** The spots form where the starting noise happened to tip the balance first. Their spacing stays the same.

**Does anything leave my device?** No. The simulation runs in your browser.
