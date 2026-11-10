---
name: Feynman diagram drawer
num: 949
shelf: science
code: T684
section: nuclear-and-particle-physics
title: "Feynman diagram maker: draw particle physics diagrams, download SVG or PNG, export TikZ-Feynman code"
summary: "Type the vertices and lines of a Feynman diagram (fermions, photons, gluons, W, Z, Higgs, ghosts, bent loops, momentum arrows) and get a clean drawing to download as SVG or PNG, plus TikZ-Feynman code for LaTeX. Eight textbook examples to start from."
status: live
ads: true
order: 5
icon: pencil
works: offline
updated: 2026-11-09
related: [relativistic-kinematics, plot-maker, decay-chain, spacetime-diagram, physical-constants, equation-converter]
sources:
  - "Line styles and LaTeX output follow the tikz-feynman package conventions: Ellis, J. P. (2017), TikZ-Feynman: Feynman diagrams with TikZ, Computer Physics Communications 210, 103 to 123 (style names only; no code copied)."
  - "Example diagrams are standard textbook processes (QED scattering, Compton scattering, beta and muon decay, gluon fusion), drawn with our own coordinates."
  - "Geometry checked against the circle through the end points with the TikZ 'bend left' exit angle, in tests written for this page."
flow:
  - { icon: pencil, label: "Describe" }
  - { icon: eye, label: "Preview" }
  - { icon: image, label: "SVG or PNG" }
  - { icon: copy, label: "TikZ code" }
---

## What it does

A Feynman diagram is a picture of a particle interaction: straight lines with arrows for electrons, quarks and other fermions, wavy lines for photons and W or Z bosons, curly lines for gluons and dashed lines for the Higgs and other scalars. This page draws one from a short text description, so you can change it quickly and get the same result every time.

You get the drawing on the page, an **SVG** (vector, for posters, slides and papers), a **PNG** at four times screen resolution, and **TikZ-Feynman** code to paste into a LaTeX document.

Check the energies and masses at each vertex with the [[relativistic-kinematics|relativistic kinematics calculator]], and plot what your data show with the [[plot-maker|plot maker]].

## How to use it

1. Start from an **example** or clear the box.
2. Place each **vertex** on its own line: `name x y`, with x to the right and y upwards (any units; 1 unit is 60 pixels by default). Add `dot`, `blob`, `cross` or `none` to choose the mark; by default, vertices where three or more lines meet get a dot.
3. Join vertices with **lines**: `from to type label`. The types are fermion, antifermion (arrow reversed), photon, gluon, W (wavy with an arrow), Z (wavy), higgs or scalar (dashed), ghost (dotted), plain and double.
4. Extras on a line: `bend=40` curves it to the left by 40° (negative to the right; two bent lines between the same vertices make a loop), `right` moves the label to the other side, and `p=k` adds a momentum arrow labelled k.
5. **Labels** use a simple notation: Greek names (gamma, mu, nu, tau, pi, ...), a trailing sign or zero as a superscript (`e-`, `mu+`, `pi0`), `^` and `_` for super- and subscripts (`W^+`, `nu_mu`), and `~` for a bar (`~nu_e` is the electron antineutrino).
6. Choose the size, line width and label size, then download.

## Worked example

The default example is electron-positron annihilation into a muon pair. Six vertices: the incoming e⁻ at (0, 2) and e⁺ at (0, 0), the two interaction points v1 at (1.5, 1) and v2 at (3.5, 1), and the outgoing μ⁻ and μ⁺ at (5, 2) and (5, 0). The photon line `v1 v2 photon gamma p=q` is drawn as a wave with the label γ and a momentum arrow q. The positron is written `v1 i2 fermion e+`, an arrow pointing back in time, as is usual for antiparticles. The page draws it with dots at v1 and v2, and the TikZ code starts `\vertex (i1) at (0, 2);` and contains `(v1) -- [photon, edge label=\(\gamma\), momentum'=\(q\)] (v2)`.

## Tips

- Keep vertices on a simple grid (whole or half units) and the drawing will look tidy.
- For a loop, join two vertices with two lines bent opposite ways, or one straight and one bent (see the electron self-energy example).
- The TikZ code needs `\usepackage{tikz-feynman}` in your preamble. Because every vertex has a position, it compiles with ordinary pdfLaTeX.

## FAQ

**Does it check that the diagram is physically allowed?** No. It draws what you describe; conservation of charge, lepton number and so on is up to you.

**Can I change the drawing afterwards?** Yes: the SVG is plain vector paths and text that any vector editor can open.

**Is anything uploaded?** No. The drawing, the files and the code are all made in your browser.
