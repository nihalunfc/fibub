---
title: "How to draw a Feynman diagram and export it to LaTeX (TikZ-Feynman)"
summary: "Describe vertices and lines in plain text, get a clean Feynman diagram as SVG or PNG plus TikZ-Feynman code. The line types, labels, loops and a worked e⁺e⁻ → γγ example."
tools: [feynman-diagram, relativistic-kinematics, decay-chain, spacetime-diagram]
updated: 2026-11-10
sources:
  - "Feynman diagram conventions (straight arrowed fermion lines, wavy photons, curly gluons, dashed scalars): standard particle physics notation, as in any introductory particle physics course."
  - "TikZ-Feynman style names: Ellis J.P. (2017), Computer Physics Communications 210: 103-123."
  - "The worked example (electron-positron annihilation into two photons) is a standard textbook process; the coordinates are our own."
---

The Feynman diagram drawer turns a few lines of plain text into a neat particle physics diagram. You list the points where particles meet and the lines that join them, and the page draws the picture, lets you download it as SVG or PNG, and writes matching TikZ-Feynman code for a LaTeX document. It suits students, teachers and researchers who want a quick, repeatable figure. To check whether the energies in your process add up, use the [[relativistic-kinematics|relativistic kinematics calculator]]; for chains of unstable particles over time, try [[decay-chain]], and for the space-and-time picture behind the arrows, the [[spacetime-diagram]].

## What it is

A **Feynman diagram** is a shorthand for one way particles can interact. Each line is a particle, and each **vertex** (a point where lines meet) is an interaction, such as an electron giving off or soaking up a photon.

The line styles carry meaning:

- **Fermions** (electrons, muons, quarks, neutrinos): straight lines with an arrow. An arrow pointing against the flow of time stands for the antiparticle, such as a positron.
- **Photons**: wavy lines. The **W** and **Z** bosons of the weak force are wavy too; the tool puts an arrow on the W, since it carries charge.
- **Gluons**, which carry the strong force between quarks: curly lines.
- **Scalars**, such as the Higgs boson: dashed lines. **Ghosts**, a bookkeeping device in some calculations: dotted lines.

Positions and lengths mean nothing; only the way the lines connect matters. That is why a short text description is enough.

The tool does not check the physics. Charge, lepton number and the rest must balance at every vertex, and that part is up to you.

## How to use it

1. Pick one of the eight **examples** in the list (photon exchange, electron scattering, Compton scattering, beta decay, gluon emission, Higgs from gluon fusion, electron self-energy, muon decay), or select all the text in the box and start fresh.
2. Write one **vertex** per line as `name x y`, with x to the right and y upwards. You may add `dot`, `blob`, `cross` or `none` after it to choose its mark.
3. Write one **line** per row as `from to type label`, using fermion, antifermion, photon, gluon, W, Z, higgs, scalar, ghost, plain or double for the type.
4. Add extras at the end of a line if needed: `bend=40` to curve it (negative numbers curve the other way), `right` to put the label on the other side, and `p=k` for a momentum arrow labelled k. Rows that start with # are ignored, so you can leave yourself notes.
5. Set the **size** in pixels per unit (20 to 300), the **line width** (thin, normal or thick) and the **label size** (8 to 40 px). The drawing updates as you type, and mistakes are named with their line number.
6. Press **Download SVG** or **Download PNG**, or **Copy code** and **Download .tex** for the TikZ-Feynman version.

## A worked example

Let us draw an electron and a positron annihilating into two photons, e⁻ e⁺ → γ γ. The electron emits one photon, then, as a short-lived (virtual) electron, meets the positron and becomes the second.

Six vertices: the incoming electron `e1` at (0, 2) and positron `e2` at (0, 0) on the left, two interaction points `a` at (2, 2) and `b` at (2, 0), and the outgoing photons `g1` at (4, 2.5) and `g2` at (4, −0.5).

```
e1 0 2
e2 0 0
a 2 2
b 2 0
g1 4 2.5
g2 4 -0.5
e1 a fermion e-
a b fermion e- p=k
b e2 fermion e+ right
a g1 photon gamma
b g2 photon gamma right
```

The fermion line runs from e1 down through a and b and back out to e2, so the positron's arrow points back towards the left, as it should for an antiparticle. The virtual electron between a and b gets a momentum arrow k. At 60 pixels per unit the drawing is **300 × 279 px**, with dots at a and b because three lines meet at each.

The TikZ code places every vertex by its coordinates, for example `\vertex [dot] (a) at (2, 2);`, and the virtual electron becomes `(a) -- [fermion, edge label=\(e^{-}\), momentum'=\(k\)] (b)`. Paste it into a document with `\usepackage{tikz-feynman}` and it compiles with ordinary pdfLaTeX.

Swap the y values of g1 and g2 and the two photon lines cross. That is the second diagram for the same process, which a full calculation adds to the first.

## Where it is used

- **Lab reports and theses**: the SVG keeps sharp edges at any size, and the TikZ code matches the fonts of the rest of a LaTeX document.
- **Teaching**: change one line and redraw, to show how the t-channel and s-channel versions of a process differ.
- **Slides and posters**: the PNG is drawn at four times screen size, so it stays crisp on a projector.

## Common mistakes

- **Forgetting the vertex first.** A line can only join two names that already have positions. The error message names the missing one.
- **Arrows the wrong way.** Antiparticles have arrows pointing back in time. Either write the line in reverse order as a fermion, or use `antifermion`.
- **A loop from one vertex to itself.** That is not allowed. Use two vertices joined by two lines bent opposite ways, or one straight and one bent.

## Questions people ask

**Which way should time run?** Most textbooks put time from left to right, as in the examples. Some put it upwards. The tool draws whatever coordinates you give, so pick one and say so in the caption.

**Why use explicit positions instead of automatic layout?** Automatic layout in TikZ-Feynman needs LuaLaTeX and can shift when you add a line. Fixed coordinates give the same picture every time, in any LaTeX engine.

**Is my diagram sent anywhere?** No. The drawing, the image files and the code are all made in your browser.
