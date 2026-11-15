---
title: "How to count cells with a hemocytometer (and work out cells per mL)"
seoTitle: "How to count cells with a hemocytometer, step by step"
summary: "Count live and dead cells in a Neubauer chamber, turn the tally into cells per mL and viability, then work out the volumes to seed a plate."
seoDescription: "How to count cells on a hemocytometer: which squares to count, the cells per mL formula, trypan blue dilution and viability, with three worked examples."
tools: [hemocytometer, cell-doubling-time, plate-layout, solution-calculator]
updated: 2026-11-15
sources:
  - "Improved Neubauer chamber: each large square is 1 mm × 1 mm with a 0.1 mm depth, so it holds 0.1 µL; the centre large square is ruled into 25 squares of 0.2 mm and those into 16 of 0.05 mm (standard chamber dimensions)."
  - "Trypan blue exclusion for viability and the 1/√N counting error for randomly scattered cells are general laboratory facts."
  - "The counts in the examples are made up. The cell numbers, viability, counting error and seeding volumes were worked out with the fibub hemocytometer counter's own code."
---

To count cells with a hemocytometer, you tally the cells in a few large squares, take the average per square, multiply by 10,000 to get cells per mL, and then multiply by any dilution such as trypan blue. The [[hemocytometer|hemocytometer cell counter]] keeps the tally while you look down the microscope and does the sums, viability and seeding volumes included.

**The short version:** cells per mL = (cells counted ÷ squares counted) × 10,000 × dilution factor. Count the four corner squares, mix 1 : 1 with trypan blue (dilution factor 2), and aim for 20 to 200 cells in each square.

## What you need

- A hemocytometer (an improved Neubauer chamber is the most common) and its thick coverslip. Clean both with 70 % ethanol and let them dry.
- A well-mixed cell suspension. Cells settle within a minute or two, so flick or pipette the tube just before you take a sample.
- Trypan blue (usually 0.4 %), if you want to tell live cells from dead ones. Live cells keep the dye out and look bright and clear; dead cells take it up and look blue.
- The dilution you used. Mixing cells and trypan blue 1 : 1 halves the cell density, so the dilution factor is 2.
- A tally counter, or the [[hemocytometer|online cell counter]] open on a phone or laptop next to the microscope.

## The hemocytometer grid, and why the numbers work

The chamber has two counting areas, each with a ruled grid 3 mm across and a gap of exactly 0.1 mm under the coverslip. The grid is split into nine large squares of 1 mm × 1 mm. The four corner squares are ruled into 16 smaller squares to help your eye; the centre square is ruled into 25 squares of 0.2 mm, each split again into 16 tiny squares of 0.05 mm.

<!-- fig:neubauer-grid --><figure class="fig"><svg viewBox="0 0 360 342" width="100%" style="max-width:400px" role="img" aria-label="The improved Neubauer grid, one chamber. Corner squares 1 to 4 (1 mm × 1 mm, 0.1 µL each) are counted for cultured cells; the five R squares (0.2 mm, 4 nL each) for small, crowded cells."><rect x="30" y="14" width="100" height="100" style="fill:var(--accent);fill-opacity:0.16"/><rect x="230" y="14" width="100" height="100" style="fill:var(--accent);fill-opacity:0.16"/><rect x="30" y="214" width="100" height="100" style="fill:var(--accent);fill-opacity:0.16"/><rect x="230" y="214" width="100" height="100" style="fill:var(--accent);fill-opacity:0.16"/><rect x="130" y="114" width="20" height="20" style="fill:var(--accent);fill-opacity:0.45"/><rect x="210" y="114" width="20" height="20" style="fill:var(--accent);fill-opacity:0.45"/><rect x="170" y="154" width="20" height="20" style="fill:var(--accent);fill-opacity:0.45"/><rect x="130" y="194" width="20" height="20" style="fill:var(--accent);fill-opacity:0.45"/><rect x="210" y="194" width="20" height="20" style="fill:var(--accent);fill-opacity:0.45"/><line x1="55" y1="14" x2="55" y2="114" style="stroke:var(--muted)" stroke-width="0.6"/><line x1="30" y1="39" x2="130" y2="39" style="stroke:var(--muted)" stroke-width="0.6"/><line x1="80" y1="14" x2="80" y2="114" style="stroke:var(--muted)" stroke-width="0.6"/><line x1="30" y1="64" x2="130" y2="64" style="stroke:var(--muted)" stroke-width="0.6"/><line x1="105" y1="14" x2="105" y2="114" style="stroke:var(--muted)" stroke-width="0.6"/><line x1="30" y1="89" x2="130" y2="89" style="stroke:var(--muted)" stroke-width="0.6"/><line x1="255" y1="14" x2="255" y2="114" style="stroke:var(--muted)" stroke-width="0.6"/><line x1="230" y1="39" x2="330" y2="39" style="stroke:var(--muted)" stroke-width="0.6"/><line x1="280" y1="14" x2="280" y2="114" style="stroke:var(--muted)" stroke-width="0.6"/><line x1="230" y1="64" x2="330" y2="64" style="stroke:var(--muted)" stroke-width="0.6"/><line x1="305" y1="14" x2="305" y2="114" style="stroke:var(--muted)" stroke-width="0.6"/><line x1="230" y1="89" x2="330" y2="89" style="stroke:var(--muted)" stroke-width="0.6"/><line x1="55" y1="214" x2="55" y2="314" style="stroke:var(--muted)" stroke-width="0.6"/><line x1="30" y1="239" x2="130" y2="239" style="stroke:var(--muted)" stroke-width="0.6"/><line x1="80" y1="214" x2="80" y2="314" style="stroke:var(--muted)" stroke-width="0.6"/><line x1="30" y1="264" x2="130" y2="264" style="stroke:var(--muted)" stroke-width="0.6"/><line x1="105" y1="214" x2="105" y2="314" style="stroke:var(--muted)" stroke-width="0.6"/><line x1="30" y1="289" x2="130" y2="289" style="stroke:var(--muted)" stroke-width="0.6"/><line x1="255" y1="214" x2="255" y2="314" style="stroke:var(--muted)" stroke-width="0.6"/><line x1="230" y1="239" x2="330" y2="239" style="stroke:var(--muted)" stroke-width="0.6"/><line x1="280" y1="214" x2="280" y2="314" style="stroke:var(--muted)" stroke-width="0.6"/><line x1="230" y1="264" x2="330" y2="264" style="stroke:var(--muted)" stroke-width="0.6"/><line x1="305" y1="214" x2="305" y2="314" style="stroke:var(--muted)" stroke-width="0.6"/><line x1="230" y1="289" x2="330" y2="289" style="stroke:var(--muted)" stroke-width="0.6"/><line x1="135" y1="114" x2="135" y2="214" style="stroke:var(--line)" stroke-width="0.3"/><line x1="130" y1="119" x2="230" y2="119" style="stroke:var(--line)" stroke-width="0.3"/><line x1="140" y1="114" x2="140" y2="214" style="stroke:var(--line)" stroke-width="0.3"/><line x1="130" y1="124" x2="230" y2="124" style="stroke:var(--line)" stroke-width="0.3"/><line x1="145" y1="114" x2="145" y2="214" style="stroke:var(--line)" stroke-width="0.3"/><line x1="130" y1="129" x2="230" y2="129" style="stroke:var(--line)" stroke-width="0.3"/><line x1="155" y1="114" x2="155" y2="214" style="stroke:var(--line)" stroke-width="0.3"/><line x1="130" y1="139" x2="230" y2="139" style="stroke:var(--line)" stroke-width="0.3"/><line x1="160" y1="114" x2="160" y2="214" style="stroke:var(--line)" stroke-width="0.3"/><line x1="130" y1="144" x2="230" y2="144" style="stroke:var(--line)" stroke-width="0.3"/><line x1="165" y1="114" x2="165" y2="214" style="stroke:var(--line)" stroke-width="0.3"/><line x1="130" y1="149" x2="230" y2="149" style="stroke:var(--line)" stroke-width="0.3"/><line x1="175" y1="114" x2="175" y2="214" style="stroke:var(--line)" stroke-width="0.3"/><line x1="130" y1="159" x2="230" y2="159" style="stroke:var(--line)" stroke-width="0.3"/><line x1="180" y1="114" x2="180" y2="214" style="stroke:var(--line)" stroke-width="0.3"/><line x1="130" y1="164" x2="230" y2="164" style="stroke:var(--line)" stroke-width="0.3"/><line x1="185" y1="114" x2="185" y2="214" style="stroke:var(--line)" stroke-width="0.3"/><line x1="130" y1="169" x2="230" y2="169" style="stroke:var(--line)" stroke-width="0.3"/><line x1="195" y1="114" x2="195" y2="214" style="stroke:var(--line)" stroke-width="0.3"/><line x1="130" y1="179" x2="230" y2="179" style="stroke:var(--line)" stroke-width="0.3"/><line x1="200" y1="114" x2="200" y2="214" style="stroke:var(--line)" stroke-width="0.3"/><line x1="130" y1="184" x2="230" y2="184" style="stroke:var(--line)" stroke-width="0.3"/><line x1="205" y1="114" x2="205" y2="214" style="stroke:var(--line)" stroke-width="0.3"/><line x1="130" y1="189" x2="230" y2="189" style="stroke:var(--line)" stroke-width="0.3"/><line x1="215" y1="114" x2="215" y2="214" style="stroke:var(--line)" stroke-width="0.3"/><line x1="130" y1="199" x2="230" y2="199" style="stroke:var(--line)" stroke-width="0.3"/><line x1="220" y1="114" x2="220" y2="214" style="stroke:var(--line)" stroke-width="0.3"/><line x1="130" y1="204" x2="230" y2="204" style="stroke:var(--line)" stroke-width="0.3"/><line x1="225" y1="114" x2="225" y2="214" style="stroke:var(--line)" stroke-width="0.3"/><line x1="130" y1="209" x2="230" y2="209" style="stroke:var(--line)" stroke-width="0.3"/><line x1="150" y1="114" x2="150" y2="214" style="stroke:var(--muted)" stroke-width="1"/><line x1="130" y1="134" x2="230" y2="134" style="stroke:var(--muted)" stroke-width="1"/><line x1="170" y1="114" x2="170" y2="214" style="stroke:var(--muted)" stroke-width="1"/><line x1="130" y1="154" x2="230" y2="154" style="stroke:var(--muted)" stroke-width="1"/><line x1="190" y1="114" x2="190" y2="214" style="stroke:var(--muted)" stroke-width="1"/><line x1="130" y1="174" x2="230" y2="174" style="stroke:var(--muted)" stroke-width="1"/><line x1="210" y1="114" x2="210" y2="214" style="stroke:var(--muted)" stroke-width="1"/><line x1="130" y1="194" x2="230" y2="194" style="stroke:var(--muted)" stroke-width="1"/><line x1="30" y1="14" x2="30" y2="314" style="stroke:var(--ink)" stroke-width="2"/><line x1="30" y1="14" x2="330" y2="14" style="stroke:var(--ink)" stroke-width="2"/><line x1="130" y1="14" x2="130" y2="314" style="stroke:var(--ink)" stroke-width="2"/><line x1="30" y1="114" x2="330" y2="114" style="stroke:var(--ink)" stroke-width="2"/><line x1="230" y1="14" x2="230" y2="314" style="stroke:var(--ink)" stroke-width="2"/><line x1="30" y1="214" x2="330" y2="214" style="stroke:var(--ink)" stroke-width="2"/><line x1="330" y1="14" x2="330" y2="314" style="stroke:var(--ink)" stroke-width="2"/><line x1="30" y1="314" x2="330" y2="314" style="stroke:var(--ink)" stroke-width="2"/><text x="80" y="72" text-anchor="middle" style="fill:var(--ink);font:700 22px system-ui,sans-serif">1</text><text x="280" y="72" text-anchor="middle" style="fill:var(--ink);font:700 22px system-ui,sans-serif">2</text><text x="80" y="272" text-anchor="middle" style="fill:var(--ink);font:700 22px system-ui,sans-serif">3</text><text x="280" y="272" text-anchor="middle" style="fill:var(--ink);font:700 22px system-ui,sans-serif">4</text><text x="140" y="128" text-anchor="middle" style="fill:var(--ink);font:700 11px system-ui,sans-serif">R</text><text x="220" y="128" text-anchor="middle" style="fill:var(--ink);font:700 11px system-ui,sans-serif">R</text><text x="180" y="168" text-anchor="middle" style="fill:var(--ink);font:700 11px system-ui,sans-serif">R</text><text x="140" y="208" text-anchor="middle" style="fill:var(--ink);font:700 11px system-ui,sans-serif">R</text><text x="220" y="208" text-anchor="middle" style="fill:var(--ink);font:700 11px system-ui,sans-serif">R</text><text x="180" y="334" text-anchor="middle" style="fill:var(--muted);font:14px system-ui,sans-serif">3 mm across: 3 × 3 squares of 1 mm</text></svg><figcaption>The improved Neubauer grid, one chamber. Corner squares 1 to 4 (1 mm × 1 mm, 0.1 µL each) are counted for cultured cells; the five R squares (0.2 mm, 4 nL each) for small, crowded cells.</figcaption></figure><!-- /fig -->

Each square holds a known volume, so a count turns straight into a concentration:

| Square | Size | Volume | Multiply the average count by |
|---|---|---|---|
| Large (corner) square | 1 mm × 1 mm | 0.1 µL (1 × 10⁻⁴ mL) | 10,000 |
| Medium centre square | 0.2 mm × 0.2 mm | 4 nL (4 × 10⁻⁶ mL) | 250,000 |
| Tiny square | 0.05 mm × 0.05 mm | 0.25 nL (2.5 × 10⁻⁷ mL) | 4,000,000 |

The general rule behind every row is:

Cells per mL = cells counted ÷ (squares counted × volume of one square in mL) × dilution factor

For large squares this is the familiar (average per square) × 10,000 × dilution.

## Step by step

1. **Mix the cells with trypan blue.** For example, 10 µL of cells with 10 µL of trypan blue (1 : 1, dilution factor 2). Count within about 5 minutes: left longer, the dye starts to get into live cells too and the viability looks worse than it is.
2. **Load the chamber.** Put the coverslip on, then touch the pipette tip to the edge and let about 10 µL run under it by capillary action. The liquid should just fill the grid area, with no bubbles and no spill into the side channels. If it overflows, the depth (and so the volume) changes: clean and load again.
3. **Focus on the grid.** Use the 10× objective. Find the triple lines that frame the large squares, then move to the top left corner square.
4. **Set up the counter.** On the tool, choose how many large squares you will count (four corners is the usual choice), how the cells were mixed with trypan blue, and any earlier dilution.
5. **Tally square by square.** Press **Live** or **Dead (blue)** for each cell in the current square, then **Next square**. On a keyboard, L or Space adds a live cell, D a dead one, N or Enter moves on, and Backspace undoes the last press, so your eyes can stay on the eyepiece. You can also type each square's totals straight into the table.
6. **Use the edge rule.** Count cells that touch the top and left lines of a square, and skip those touching the bottom and right lines. That way no cell is counted twice. Count a clump of two or three cells as separate cells if you can see them; if clumps are common, mix the suspension better first.
7. **Read the result.** The tool shows live, dead and total cells per mL, the viability, how many cells you counted with the likely counting error, and how evenly the cells were spread across the squares.
8. **Seed your plate (optional).** In the seeding box, type the live cells you want in each well, how many wells, the medium per well and a spare margin. The tool says how much cell suspension to mix with how much medium.

Behind the result are two formulas. With n large squares counted, each 0.1 µL (1 × 10⁻⁴ mL):

Cells per mL = (cells counted ÷ n) × 10,000 × dilution factor

Viability = live cells ÷ (live cells + dead cells) × 100 %

If you count the same culture each day, feed the counts into the [[cell-doubling-time|doubling time calculator]], dilute to the density you need with the [[solution-calculator]], and map out the wells with the [[plate-layout]].

## Choosing the dilution

A good count has roughly 20 to 200 cells in each large square. With fewer, the counting error is large; with more, cells overlap and you lose your place. The dilution factor is the total volume divided by the volume of cells:

Dilution factor = (cell volume + diluent volume) ÷ cell volume

| You mix | Dilution factor |
|---|---|
| 10 µL cells + 10 µL trypan blue (1 : 1) | 2 |
| 90 µL cells + 10 µL trypan blue (9 : 1) | 1.11 |
| 20 µL cells + 80 µL trypan blue (1 : 4) | 5 |
| 10 µL cells + 90 µL medium, then 1 : 1 with trypan blue | 10 × 2 = 20 |

When you dilute twice, multiply the factors. In the counter, pick the trypan blue mix and type the earlier dilution in its own box, so neither is forgotten or counted twice.

## A worked example: a routine count

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

## A second example: a dense culture

A flask is nearly full, so you mix 20 µL of cells with 80 µL of trypan blue (1 : 4, dilution factor 5) and count the four corners: 62, 58, 66 and 54 live cells, and 9, 7, 11 and 8 dead.

Live cells = 240, so 60 per square. Live cells per mL = 60 × 10,000 × 5 = **3.0 × 10⁶ cells/mL**.
All cells = 275, so 68.75 per square and 3.44 × 10⁶ cells/mL in all.
Viability = 240 ÷ 275 = **87.3 %**, a little low for routine work, so look for a reason (the cells may have been left too long before splitting).

The cells were resuspended in 12 mL, so the tube holds 3.0 × 10⁶ × 12 = **3.6 × 10⁷ live cells**. To seed six wells of a 6-well plate with 300,000 live cells in 2 mL each, plus 10 % spare, mix **0.66 mL** of cells with **12.54 mL** of medium.

## A third example: small cells in the centre squares

Yeast and red blood cells are small and crowded, so you count the five R squares in the centre (four corners of the centre square and its middle) instead. You dilute a yeast culture 1 : 100 in water and count 180 cells in the five R squares.

Volume counted = 5 × 4 × 10⁻⁶ mL = 2 × 10⁻⁵ mL.
Cells per mL = 180 ÷ (2 × 10⁻⁵) × 100 = **9.0 × 10⁸ cells/mL**.

To use the counter for this, note that the 25 centre squares make one large square: 5 of them is a fifth, so 180 cells in five R squares is the same as 900 in one large square. Choose 1 square, no stain, an earlier dilution of 100, and type 900. It gives the same 9.0 × 10⁸ cells/mL (and warns that 900 is crowded for a large square, which is why you counted the small ones).

## How many cells to count

Cells land in the chamber at random, so even a perfect count wobbles. The error is about 1 ÷ √N, where N is the number of cells you counted. The counter works this out for every count; here it is for a range of counts.

<!-- fig:count-error --><figure class="fig"><svg viewBox="0 0 300 202" width="100%" style="max-width:420px" role="img" aria-label="Counting error for the number of live cells counted, from the hemocytometer counter&#39;s own maths (1 ÷ √N). Count at least 100 cells for about ±10 %; 400 cells halve it to ±5 %."><text x="78" y="27" text-anchor="end" style="fill:var(--ink);font:14px system-ui,sans-serif">25 cells</text><rect x="86" y="10" width="150.0" height="22" rx="3" style="fill:var(--accent)"/><text x="242.0" y="27" text-anchor="start" style="fill:var(--ink);font:14px system-ui,sans-serif">±20 %</text><text x="78" y="59" text-anchor="end" style="fill:var(--ink);font:14px system-ui,sans-serif">50 cells</text><rect x="86" y="42" width="105.8" height="22" rx="3" style="fill:var(--accent)"/><text x="197.75" y="59" text-anchor="start" style="fill:var(--ink);font:14px system-ui,sans-serif">±14.1 %</text><text x="78" y="91" text-anchor="end" style="fill:var(--ink);font:14px system-ui,sans-serif">100 cells</text><rect x="86" y="74" width="75.0" height="22" rx="3" style="fill:var(--accent)"/><text x="167.0" y="91" text-anchor="start" style="fill:var(--ink);font:14px system-ui,sans-serif">±10 %</text><text x="78" y="123" text-anchor="end" style="fill:var(--ink);font:14px system-ui,sans-serif">200 cells</text><rect x="86" y="106" width="53.2" height="22" rx="3" style="fill:var(--accent)"/><text x="145.25" y="123" text-anchor="start" style="fill:var(--ink);font:14px system-ui,sans-serif">±7.1 %</text><text x="78" y="155" text-anchor="end" style="fill:var(--ink);font:14px system-ui,sans-serif">400 cells</text><rect x="86" y="138" width="37.5" height="22" rx="3" style="fill:var(--accent)"/><text x="129.5" y="155" text-anchor="start" style="fill:var(--ink);font:14px system-ui,sans-serif">±5 %</text><text x="78" y="187" text-anchor="end" style="fill:var(--ink);font:14px system-ui,sans-serif">800 cells</text><rect x="86" y="170" width="26.2" height="22" rx="3" style="fill:var(--accent)"/><text x="118.25" y="187" text-anchor="start" style="fill:var(--ink);font:14px system-ui,sans-serif">±3.5 %</text></svg><figcaption>Counting error for the number of live cells counted, from the hemocytometer counter&#39;s own maths (1 ÷ √N). Count at least 100 cells for about ±10 %; 400 cells halve it to ±5 %.</figcaption></figure><!-- /fig -->

The lesson: counting more squares, or both chambers, helps far more than counting one square very carefully. If you count both chambers, add the squares from both to the counter, and expect the two halves to agree within about 10 to 15 %.

## Check your answer

- Each large square should hold roughly 20 to 200 cells. Fewer and the error is large; more and cells overlap. The tool warns you either way.
- Your answer should be about (average per square) × 10⁴ × dilution. If it is out by a factor of 10 or 2, check that you used the large squares, not the small ones, and that you included the trypan blue dilution once, not twice.
- A count of 100 cells gives about ±10 %; aim for at least that, by counting more squares if needed.
- If the squares differ a lot (the tool flags a spread above 25 %), the cells were not well mixed or the chamber was badly loaded. Clean it and count again.

## Common mistakes

- **Letting the cells settle.** Take the sample straight after mixing, or the count depends on where in the tube the pipette went.
- **Overfilling the chamber.** Liquid in the side channels lifts the coverslip and makes the volume larger than 0.1 µL per square.
- **Counting cells on all four edges.** Use the top-and-left rule, or you count border cells twice.
- **Leaving trypan blue too long.** After about 5 to 10 minutes live cells start to take up the dye, and viability looks lower than it is.
- **Forgetting an earlier dilution.** Write every dilution down; the final factor is all of them multiplied together.

## Questions people ask

**Why multiply by 10,000?** One large square holds 0.1 µL, which is 0.0001 mL. Dividing by 0.0001 is the same as multiplying by 10,000.

**Should I count the small squares in the centre?** For red blood cells, yeast and other tiny cells, yes, and use 250,000 for each 0.2 mm square (see the table above). For most cultured cells, the large corner squares give enough cells and fewer mistakes.

**How do I count cells without trypan blue?** Mix the cells with medium or buffer instead, or load them neat, and choose "No stain" in the counter. You then get total cells per mL but no viability.

**What viability is good enough?** Many labs want above about 90 % for routine passaging and experiments, but the right cut-off depends on your cells and your protocol.

**How many cells are in my whole tube?** Multiply cells per mL by the volume of the suspension. 8.0 × 10⁵ cells/mL in 5 mL is 4.0 × 10⁶ cells.

**Is an automated cell counter better?** It is faster and avoids tired eyes, but it still counts a small sample, so the same 1 ÷ √N error applies. A careful manual count of a few hundred cells is just as accurate, and it is a good check when an automated counter gives an odd number.
