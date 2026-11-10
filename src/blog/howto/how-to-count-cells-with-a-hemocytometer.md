---
title: "How to count cells with a hemocytometer (and work out cells per mL)"
summary: "Count live and dead cells in a Neubauer chamber, turn the tally into cells per mL and viability, then work out the volumes to seed a plate."
tools: [hemocytometer, cell-doubling-time, plate-layout]
updated: 2026-11-10
sources:
  - "Improved Neubauer chamber: each large square is 1 mm × 1 mm with a 0.1 mm depth, so it holds 0.1 µL (a standard chamber dimension)."
  - "Trypan blue exclusion for viability and the 1/√N counting error for randomly scattered cells are general laboratory facts."
  - "The counts in the example are made up."
---

To count cells with a hemocytometer, you tally the cells in a few large squares, take the average per square, multiply by 10,000 to get cells per mL, and then multiply by any dilution such as trypan blue. The [[hemocytometer|hemocytometer cell counter]] keeps the tally while you look down the microscope and does the sums, viability included.

## What you need

- A hemocytometer (an improved Neubauer chamber is the most common) and its coverslip.
- A well-mixed cell suspension. Cells settle within a minute or two, so flick or pipette the tube just before you load.
- Trypan blue, if you want to tell live cells from dead ones. Live cells keep the dye out and look clear; dead cells take it up and look blue.
- The dilution you used. Mixing cells and trypan blue 1 : 1 halves the cell density, so the dilution factor is 2.

## Step by step

1. **Load the chamber.** Put the coverslip on, then let about 10 µL of the cell and dye mix run under it by capillary action. Do not overfill, or the depth (and so the volume) changes.
2. **Set up the counter.** On the tool, choose how many large squares you will count (four corners is the usual choice), how the cells were mixed with trypan blue, and any earlier dilution.
3. **Tally square by square.** Press **Live** or **Dead (blue)** for each cell in the current square, then **Next square**. On a keyboard, L or Space adds a live cell, D a dead one, N or Enter moves on, and Backspace undoes the last press, so your eyes can stay on the eyepiece. You can also type each square's totals straight into the table.
4. **Use the edge rule.** Count cells that touch the top and left lines of a square, and skip those touching the bottom and right lines. That way no cell is counted twice.
5. **Read the result.** The tool shows live, dead and total cells per mL, the viability, how many cells you counted with the likely counting error, and how evenly the cells were spread across the squares.

Behind the result are two formulas. With n large squares counted, each 0.1 µL (1 × 10⁻⁴ mL):

Cells per mL = (cells counted ÷ n) × 10,000 × dilution factor

Viability = live cells ÷ (live cells + dead cells) × 100 %

6. **Seed your plate (optional).** In the seeding box, type the live cells you want in each well, how many wells, the medium per well and a spare margin. The tool says how much cell suspension to mix with how much medium.

If you count the same culture each day, feed the counts into the [[cell-doubling-time|doubling time calculator]], and map out the wells with the [[plate-layout]].

## A worked example

You mix your cells 1 : 1 with trypan blue and count the four corner squares.

| Square | Live | Dead |
|---|---|---|
| 1 | 38 | 3 |
| 2 | 44 | 2 |
| 3 | 41 | 4 |
| 4 | 37 | 3 |
| Total | 160 | 12 |

Live cells per square = 160 ÷ 4 = 40.
Live cells per mL = 40 × 10,000 × 2 = **8.0 × 10⁵ cells/mL**.
All cells per mL = (172 ÷ 4) × 10,000 × 2 = 8.6 × 10⁵ cells/mL, so dead cells are 6.0 × 10⁴ cells/mL.
Viability = 160 ÷ 172 = **93.0 %**.

With 160 live cells counted, the counting error is about 1 ÷ √160, or ±7.9 %. The squares hold 41, 46, 45 and 40 cells, a spread (coefficient of variation) of about 6.8 %, so the cells were well mixed.

Now seed a 96-well plate with 10,000 live cells in 0.1 mL per well, plus 10 % spare. You need 96 × 1.1 = 105.6 wells' worth: 1,056,000 cells in 10.56 mL, at 1.0 × 10⁵ cells/mL. Cell suspension = 1,056,000 ÷ 800,000 = **1.32 mL**, topped up with **9.24 mL** of medium. Put 100 µL in each well, and mix the tube now and then as you go.

## Check your answer

- Each large square should hold roughly 20 to 200 cells. Fewer and the error is large; more and cells overlap. The tool warns you either way.
- Your answer should be about (average per square) × 10⁴ × dilution. If it is out by a factor of 10 or 2, check that you used the large squares, not the small ones, and that you included the trypan blue dilution once, not twice.
- A count of 100 cells gives about ±10 %; aim for at least that, by counting more squares if needed.

## Questions people ask

**Why multiply by 10,000?** One large square holds 0.1 µL, which is 0.0001 mL. Dividing by 0.0001 is the same as multiplying by 10,000.

**Should I count the small squares in the centre?** For red blood cells and other tiny cells, yes. For most cultured cells, the large corner squares give enough cells and fewer mistakes.

**What viability is good enough?** Many labs want above about 90 % for routine passaging and experiments, but the right cut-off depends on your cells and your protocol.
