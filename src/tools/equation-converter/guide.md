---
name: Equation converter
num: 803
shelf: science
section: writing-and-publishing
title: "Equation converter"
summary: "Type or paste LaTeX maths and get MathML you can paste into Word, LibreOffice or a web page, with a live preview drawn from that MathML. Or paste MathML and get LaTeX back. Fractions, roots, sums, integrals, matrices, accents and Greek letters. Errors say what is wrong and where."
status: live
ads: true
order: 803
icon: sigma
works: offline
updated: 2026-11-09
related: [plot-maker, uncertainty-calculator, graph-digitizer, table-converter, bibtex-cleaner, scientific-notation-formatter, symbolic-algebra]
sources:
  - "The LaTeX reader, the MathML writer and the MathML reader are written by fibub. Command meanings follow the LaTeX and amsmath manuals; characters follow the Unicode and MathML standards (W3C MathML Core)."
  - "Checked in the tests against latex2mathml 3.81.1 (Python, MIT licence) on 87 expressions, and by converting every expression to MathML, back to LaTeX and to MathML again."
  - "The examples are textbook formulas (quadratic formula, Gaussian integral, Maxwell's equations)."
flow:
  - { icon: pencil, label: "LaTeX" }
  - { icon: convert, label: "MathML" }
  - { icon: eye, label: "Preview" }
  - { icon: copy, label: "Paste" }
---

## What it does

Word and LibreOffice do not read LaTeX, but both read **MathML**, the maths language of the web. This page turns LaTeX maths into MathML as you type, draws the equation from that MathML so you can check it, and gives you a Copy button. It also works the other way: paste MathML from Word, a web page or another program and get LaTeX you can drop into a paper.

It understands the LaTeX most papers use:

- **Fractions and roots:** `\frac`, `\dfrac`, `\tfrac`, `\binom`, `\sqrt`, `\sqrt[n]`.
- **Scripts:** `x^2`, `a_{ij}`, primes such as `f'(x)`, and `{}^{14}C`.
- **Large operators with limits:** `\sum`, `\prod`, `\int`, `\oint`, `\lim`, `\max` and more, with `\limits` and `\nolimits`.
- **Brackets:** `\left( ... \right)`, `\middle|`, `\big` to `\Bigg`, and `\left.` for no bracket.
- **Matrices and layouts:** `matrix`, `pmatrix`, `bmatrix`, `Bmatrix`, `vmatrix`, `Vmatrix`, `cases`, `aligned`, `gathered` and `array`.
- **Accents and fonts:** `\hat`, `\bar`, `\vec`, `\dot`, `\tilde`, `\overline`, `\underbrace`; `\mathbf`, `\mathbb`, `\mathcal`, `\mathrm`, `\boldsymbol`; and `\text{...}`.
- **Greek letters, operators, relations and arrows**, with the full list on the page.

Simplify the maths first with [[symbolic-algebra]], and convert the tables around it with the [[table-converter]].

## How to use it

1. **LaTeX.** Type your equation in the box, or pick an example. Dollar signs, `\[ ... \]` and `\begin{equation}` around it are fine; they are taken off.
2. **MathML.** The MathML appears below as you type. Choose *On its own line* for a displayed equation (limits go above and below a sum) or *In a line of text*.
3. **Preview.** Your browser draws the equation from the MathML itself, so a mistake in the preview is a mistake in the MathML.
4. **Paste.** Press **Copy MathML** and paste into Word with Ctrl+V (⌘+V on a Mac): Word turns it into an equation you can edit. In LibreOffice, open a formula object and use Tools, *Import MathML from Clipboard*. Or download the .mml file.

To go the other way, press **MathML to LaTeX** and paste MathML. Switching direction carries the current result across, so you can check a round trip.

## Options

- **Show the equation:** display (its own line) or inline. Only changes the `display` setting of the MathML.
- **Keep the LaTeX inside the MathML:** adds your LaTeX as an annotation, so programs that understand it can show the source again.
- **Indent the MathML:** puts each element on its own line, easier to read; the maths is the same.

## Worked example

The quadratic formula `x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}` becomes

`<math display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>−</mo><mi>b</mi><mo>±</mo><msqrt>...</msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>`

Letters become `<mi>`, numbers `<mn>`, operators `<mo>` (the hyphen becomes a true minus sign, −), and the fraction an `<mfrac>` with the numerator and denominator inside. Switch to MathML to LaTeX and the same MathML comes back as `x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}`.

## When something is wrong

Errors name the problem and its place, with a caret under the spot. For example `\frac{a}` says "the denominator is missing here", `x^2^3` says "Double superscript", and `\left(` without `\right` points at the `\left`. Unknown commands, such as your own `\newcommand` macros, are named so you can write them out.

## FAQ

**Does Word really accept pasted MathML?** Yes, Word 2016 and newer, on Windows and Mac, convert MathML text on paste. If your copy arrives as plain text, paste it into an empty equation box.

**Why do bold and blackboard letters look like special characters?** `\mathbf{F}` becomes the Unicode letter 𝐅 and `\mathbb{R}` becomes ℝ, as MathML Core recommends, so they look right in every program.

**Is anything sent anywhere?** No. The conversion runs on this page and works offline.

**What is not supported?** Your own macros, colours, lines inside arrays, chemistry (`\ce`) and commutative diagrams.
