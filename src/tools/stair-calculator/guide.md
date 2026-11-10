---
name: Stair calculator
num: 2025
shelf: everyday
code: T873
section: building
title: "Stair calculator: risers, treads, stringer length and angle"
summary: "Work out the number of risers and treads, riser height, total run, stringer length and angle for a straight stair, and check them against editable code limits."
status: live
ads: false
order: 2025
icon: ruler
works: offline
updated: 2026-11-10
related: [deck-calculator, roof-calculator, drywall-calculator]
sources:
  - "International Code Council, 2021 International Residential Code, section R311.7 Stairways: riser at most 7¾ in, tread at least 10 in, headroom at least 6 ft 8 in."
  - "The 2R + T comfort rule (two risers plus one tread about 24 to 25 in, 600 to 640 mm) is a long-standing design rule of thumb. Everything else is fibub's own working."
flow:
  - { icon: ruler, label: "Rise" }
  - { icon: sliders, label: "Target" }
  - { icon: calculator, label: "Steps" }
  - { icon: check, label: "Code check" }
---

## What it does

Lay out a straight flight of stairs from the height it has to climb. Type the total rise and the riser height you would like, and the calculator gives the number of risers and treads, the exact riser height, the total run, the stringer length and the angle. It then checks the riser, the tread, the 2R + T comfort rule and the headroom against limits you can edit.

The default limits come from the 2021 International Residential Code (R311.7). Codes differ by place: check yours. To plan the deck the stairs lead to, use the [[deck-calculator]]; for the roof above, the [[roof-calculator]].

## How to use it

1. Choose Imperial (inches) or Metric (millimetres). Switching converts what you typed and loads that system's default limits.
2. Measure the total rise from the finished lower floor to the finished upper floor.
3. Type a target riser height and a tread depth. If the run is fixed, type the total run instead.
4. Read the results and the checks. **Reset example** brings the example back; **Clear** empties the sizes.

## What each setting does

- **Total rise**: the height the stair climbs, floor to floor.
- **Target riser height**: the number of risers is the rise ÷ target, rounded up, so no riser is taller than the target.
- **Tread depth**: used when the total run is left blank. There is one tread fewer than risers, because the top floor is the last step.
- **Total run (optional)**: when space is fixed, the tread becomes run ÷ treads.
- **Headroom you have (optional)**: checked against the least headroom.
- **Limits**: highest riser, shallowest tread, least headroom and the 2R + T comfort range, all editable.

## Worked example

A rise of 108 in with a 7.5 in target: 108 ÷ 7.5 = 14.4, rounded up to 15 risers of 7.2 in (7 3/16″). That makes 14 treads; at 10 in each the run is 140 in. The stringer diagonal is √(108² + 140²) = 176.82 in, and the stair angle is atan(7.2 ÷ 10) = 35.8°. 2R + T = 24.4 in, inside the comfort range.

With a 96 in rise and an 8 in target you get 12 risers of exactly 8 in, which is flagged as over the 7¾ in limit.

## FAQs

**Why is the stringer longer than the diagonal?** The board also needs room for the cut at the top and foot, so buy longer stock.

**Why 35.8° and not the angle of the diagonal?** The stair's slope is set by each riser over each tread.
