---
name: MOI calculator
num: 199
shelf: science
code: T199
section: virology-and-immunology
title: "MOI calculator: multiplicity of infection, virus volume to add and Poisson infection odds"
summary: "Work out the MOI from your cell number and virus titre (PFU, TCID₅₀ or transducing units), or the volume of virus to add for a target MOI. See how many cells get 0, 1, 2 or more particles, the MOI needed for a target % infected, and a plate plan with predilutions for several MOIs. Everything stays in your browser."
status: live
ads: true
order: 2
icon: flask
works: offline
updated: 2026-11-09
related: [hemocytometer, cell-doubling-time, transfection-planner, plate-layout, tcid50-calculator, solution-calculator, counting-statistics]
sources:
  - "The arithmetic (MOI = infectious units ÷ cells, volume = MOI × cells ÷ titre) and the Poisson shares are standard formulas, written by fibub and checked in the tests against hand working and an independent Python script."
  - "The TCID₅₀ conversion uses ln 2 = 0.693 infectious units per TCID₅₀, which follows from the Poisson distribution itself (a dose infecting half the wells holds ln 2 particles on average). The factor is editable."
  - "The example numbers (2 × 10⁵ cells, 5 × 10⁷ PFU/mL, a 200 µL inoculum) are rounded values made up by fibub, not from any paper, kit or database. Type your own."
flow:
  - { icon: flask, label: "Virus" }
  - { icon: calculator, label: "MOI" }
  - { icon: chart, label: "Per cell" }
  - { icon: table, label: "Plate plan" }
---

## What it does

MOI, the multiplicity of infection, is the number of infectious particles you add for every cell in the well. It sounds like one division, and it is, but the numbers are awkward: titres in powers of ten, cells in hundreds of thousands, volumes in microlitres, and a stock so strong that the volume you need is smaller than your smallest tip. This page does the whole job:

- **MOI from a volume.** Type the cells per well, the titre and the microlitres of virus you added, and get the MOI.
- **Volume for a target MOI.** Switch the buttons round and get the volume of stock to add instead.
- **Any titre unit.** PFU/mL and transducing or infectious units (TU/mL, used for lentivirus and other vectors) are used as they stand. TCID₅₀/mL is multiplied by 0.693 (ln 2) to turn 50 % end-point doses into infectious units, the usual "PFU ≈ 0.7 × TCID₅₀". You can set that factor to 1 if you would rather count one TCID₅₀ as one unit.
- **How many cells get how many particles.** Particles land on cells at random, so an MOI of 1 does not mean every cell gets one particle. The page gives the Poisson shares for 0, 1, 2 … particles per cell, with a bar chart.
- **MOI for a target % infected.** Say you want 90 % of cells to get at least one particle, and it gives the MOI.
- **A plate plan.** List several MOIs and get one mix per MOI: how much stock (or predilution) and how much medium, the working titre, the units per well, and the predilution to make first when the volume of stock would be too small to pipette.
- **Downloads.** The Poisson table and the plate plan as CSV, and the whole lot as an image, PDF or Word report.

Find the virus titre first with the [[tcid50-calculator|TCID50 and plaque assay calculator]], and count your cells with the [[hemocytometer]].

## How to use it

1. **Cells per well.** Use the number of cells in the well at the moment of infection, not the number you seeded a day earlier. Count them, or work them out from your seeding density and doubling time.
2. **Titre and unit.** Type the titre of the stock you will pipette from, and pick its unit.
3. **MOI or volume.** Use the two buttons to choose which one you know.
4. **Particles per cell.** Type the MOI you plan to use (or press *Use this MOI above* to send an MOI back up to the top) and read the table.
5. **Plate plan.** List the MOIs with commas, set the wells per MOI, the inoculum volume per well, a little spare, and the smallest volume you are willing to pipette.

## Worked example

Press **Use the example**: 2 × 10⁵ cells per well, a stock of 5 × 10⁷ PFU/mL, 4 µL added.

4 µL of 5 × 10⁷ PFU/mL is 2 × 10⁵ PFU, on 2 × 10⁵ cells, so the page shows **MOI 1**, with 63.2 % of cells infected and 36.8 % (e⁻¹) missed. Switch to *Volume for an MOI* and ask for MOI 3: it needs **12 µL**. At MOI 3 the table shows 4.98 % of cells with no particle, 14.9 % with exactly one, 22.4 % with two, and 57.7 % with three or more — a useful reminder that a "high MOI" infection is a mixture. To get 90 % of cells infected you need **MOI 2.303** (that is −ln 0.1), and 99 % needs MOI 4.605.

The plate plan for 0, 0.01, 0.1, 1 and 10 with three wells each, a 200 µL inoculum and 10 % spare makes **660 µL** of each mix. MOI 10 takes 132 µL of stock plus 528 µL of medium. MOI 1 takes 13.2 µL. MOI 0.1 would take 1.32 µL, under the 2 µL you said you pipette, so the page makes a 1 : 10 predilution (2 µL of stock + 18 µL of medium) and takes 13.2 µL of that. MOI 0.01 gets a 1 : 100 predilution. MOI 0 is the mock-infected control: medium only.

## Tips

- MOI counts what you *add*. How much of it ends up inside cells depends on the cell type, the receptor, the temperature and the adsorption time, so two labs with the same MOI can see different infections.
- The Poisson shares assume particles land independently and that every cell is equally reachable. Clumped virus, uneven monolayers and spinoculation all break that assumption.
- Keep the inoculum small during adsorption so the virus is concentrated, then top up with medium afterwards.
- PFU and TCID₅₀ count infectious particles. Genome copies, viral particles by electron microscopy and p24 do not, so never put them in as a titre without a measured particle-to-infectivity ratio.
- For a single-round experiment where you want one particle per cell, people usually work at MOI 0.1 or lower, so that most infected cells have exactly one.

## FAQ

**Is MOI 1 the same as infecting every cell?** No. At MOI 1, 37 % of cells get nothing and 26 % get two or more. You need about MOI 3 for 95 % and MOI 4.6 for 99 %.

**Should I use PFU or TCID₅₀?** Whichever your titration gave. The page converts TCID₅₀ for you with the ln 2 factor; say in your methods which unit and which factor you used.

**Does it store my numbers?** No. Nothing is uploaded, saved or sent anywhere; the page works offline once it has loaded.
