---
name: Embryo development timer
num: 351
shelf: science
section: developmental-biology
title: "Embryo development timer: zebrafish hpf at any temperature (Kimmel formula) and degree-hours for any species (free)"
summary: "Convert embryo development time between incubation temperatures: zebrafish with the Kimmel et al. (1995) formula, or any species with a degree-hours model and your own base temperature. Plan when each stage in your own editable list should be reached, and add up a temperature history. Runs in your browser."
status: live
ads: true
order: 351
icon: clock
works: offline
updated: 2026-11-09
related: [time-zone-planner, planner, uncertainty-calculator, plot-maker]
sources:
  - "Zebrafish: C. B. Kimmel, W. W. Ballard, S. R. Kimmel, B. Ullmann and T. F. Schilling, Stages of embryonic development of the zebrafish, Developmental Dynamics 203 (1995) 253–310: the formula H_T = h / (0.055 T − 0.57) only, cited as the method. No stage table from the paper is copied."
  - "Degree-hours (thermal time) model: development rate proportional to temperature above a base, a standard textbook model. Checked in the tests by hand arithmetic (for example 24 h at 28.5 °C = 24 / 0.805 = 29.81 h at 25 °C) and by consistency checks (equal degree-hours at every temperature)."
  - "The stage list on the page is an illustrative, rounded, made-up example, not a staging table. Replace it with times from your own staging reference."
flow:
  - { icon: sliders, label: "Model" }
  - { icon: calculator, label: "Convert" }
  - { icon: calendar, label: "Plan stages" }
  - { icon: clock, label: "History" }
---

## What it does

Embryos of fish, amphibians, insects and birds develop faster when warm and slower when cool. Stage times are usually published for one temperature (28.5 °C for zebrafish), but incubators, room-temperature benches and field nests run at others. This tool converts development time between temperatures, plans when each stage should be reached, and adds up time spent at several temperatures.

- **Zebrafish (Kimmel et al. 1995)**: H(T) = h ÷ (0.055 T − 0.57), where h is the time at 28.5 °C and H(T) the time at T °C. The authors give it for about 25–33 °C; the page warns outside that range.
- **Any species (degree-hours)**: development speed rises in a straight line with temperature above a **base temperature**, so hours × (T − base) is the same for a stage at every temperature. Give the base for your species and the **reference temperature** your stage times are for.

The two agree: Kimmel's formula is a degree-hours model with a base of 10.36 °C (0.57 ÷ 0.055).

## How to use it

1. Pick the **model**. For degree-hours, type the base temperature and the reference temperature.
2. **Convert a time**: type hours at one temperature and the temperature you want; the page shows the time to the same stage there, in hours and in days, hours and minutes.
3. **Plan the stages**: type your incubation temperature and when the eggs were fertilised. Each stage in the list gets its hours at your temperature and the date and time you should see it. The list is yours to edit: a name, a comma and the hours at the reference temperature on each line. The list shown first is an **illustrative, rounded example, not a staging table**; replace it with the times from your own staging reference.
4. **Temperature history**: list hours and °C for each period in order (for example a night at room temperature). The page adds up the equivalent time at the reference temperature, the last stage reached and how long the next one will take at the last temperature.
5. Download the stage plan as CSV (times in UTC), or a report.

## Worked example

With the zebrafish model, **24 h at 28.5 °C = 29.81 h (1 d 5 h 49 min) at 25 °C**, because 0.055 × 25 − 0.57 = 0.805 and 24 ÷ 0.805 = 29.81. At 26 °C the factor is 0.86, so the example stage at 24 h takes 27.91 h and the one at 48 h takes 55.81 h.

The example temperature history is 6 h at 28.5 °C, then 16 h at 25 °C, then 2 h at 22 °C: 6 + 16 × 0.805 + 2 × 0.64 = **20.16 hpf at 28.5 °C**, after 24 h on the clock.

For a degree-hours example: with a base of 12 °C, a stage that takes 40 h at 20 °C needs 40 × 8 = 320 degree-hours, so 320 ÷ 12 = 26.67 h at 24 °C.

## Tips

- Keep within the range where your model was measured. Near the base temperature and near the upper limit for the species, real development stops being linear and embryos may not develop normally.
- Kimmel's factor is 0.9975 at 28.5 °C rather than exactly 1; as in the paper, a time at 28.5 °C is used directly as h.
- Check actual stages under the microscope: clutches and strains vary, and incubators drift.

## FAQ

**Where do I get a base temperature?** From development-rate studies for your species: it is where a straight line through rate against temperature reaches zero. The tool does not supply values for other species.

**Is the stage list from the Kimmel paper?** No. It is a rounded, made-up example so the page has something to show. Enter the stage times you use.

**Does anything leave my device?** No. All sums run in your browser and nothing is stored.
