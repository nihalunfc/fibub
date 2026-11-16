---
name: Shelf load
num: 3012
shelf: everyday
code: T1012
section: woodwork
title: "Shelf load calculator: how much pull and weight each wall screw takes on a bracket shelf"
seoTitle: "Shelf load calculator: force on each wall screw"
summary: "Work out how hard a wall shelf pulls on each screw. Type what goes on it (or pick books, plates or plants), the shelf depth and the bracket size, and see the pull-out and downward load per screw in kg and newtons, compared with your wall fixing's rating, with a side-view drawing of the forces."
status: live
ads: false
order: 3012
icon: scale
works: offline
updated: 2026-11-16
related: [build-simple-shelf, drill-and-screw, beam-calculator]
sources:
  - "Physics: a bracket tips about its bottom edge, so the top screws resist the turning effect of the load, F = W × lever arm ÷ the height between the top and bottom screws; every screw also carries its share of the weight downwards (shear). fibub's own working of standard statics; a rough guide that ignores the bracket bending and the screw's angle."
  - "Weights per metre of shelf (books about 25 kg, plates and dishes about 30 kg, plants in pots about 15 kg, light ornaments about 8 kg) are fibub's rough estimates; weigh yours if in doubt."
  - "Safety factors of 2 to 4 on a fixing's failure load are common rules of thumb in DIY and fixing makers' guidance. Fixing makers' published safe loads always come first."
flow:
  - { icon: scale, label: "Load" }
  - { icon: ruler, label: "Brackets" }
  - { icon: check, label: "Per screw" }
---

## What it does

This shelf load calculator shows how hard a shelf on two or more brackets pulls on each screw in the wall. Most people think only about the weight pressing down, but the real job of the top screw on each bracket is to stop the bracket tipping forward: the deeper the shelf and the shorter the bracket, the harder it is pulled straight out of the wall. Type what goes on the shelf, its depth and the bracket size, and you get the pull-out and downward load per screw in kilograms and newtons, a check against your wall fixing's rating with a safety factor, and a side-view drawing of the forces.

To make and hang the shelf, follow [[build-simple-shelf|the build a simple shelf lesson]]; for screwing the brackets to the board, see [[drill-and-screw]].

## How to use it

1. **What's on it:** pick books, plates, plants or ornaments and type the shelf length, or choose "Type a weight" and enter the kilograms. Add the board and brackets.
2. **Where the weight sits:** "spread evenly" puts it halfway back (half the depth). Choose "at the front edge" for things that overhang or get leaned on.
3. **Shelf and brackets:** the depth from the wall, how many brackets, the height between the top and bottom wall screw of one bracket, and the screws per bracket.
4. **Your fixing:** type the load per fixing from the packet or the maker's table, and say whether it is a safe working load or a failure (ultimate) load. For a failure load, pick a safety factor.

## What each result means

- **Pull-out per top screw:** the force pulling the top screw straight out of the wall. This is usually the one that fails, so it is the main result.
- **Down (shear) per screw:** the weight shared by every wall screw, pushing down across it.
- **Combined on a top screw:** the two together, because the top screw carries both.
- **Safety factor:** how many times stronger than the load the fixing should be. Use 2 for light, well-known loads into solid masonry or studs, 3 for everyday shelves, and 4 for anything over people, things that get pulled on, or walls you are unsure about.

## Worked example

An 800 mm shelf of paperbacks at about 25 kg per metre is 20 kg, plus 2 kg for the board and brackets: 22 kg, which is W = 22 × 9.81 = 216 N. The shelf is 250 mm deep, so the load acts 125 mm from the wall. Each of the two brackets has its two wall screws 200 mm apart. The top screws must hold 216 × 125 ÷ 200 = 135 N between them, so each top screw is pulled out with about 67 N, about 6.9 kg. Each of the four screws also carries 216 ÷ 4 = 54 N (5.5 kg) down. Your plugs are rated 25 kg at failure; with a safety factor of 3 that allows 8.3 kg per screw, so 6.9 kg is within it. Make the brackets taller (screws 300 mm apart) and the pull drops to 4.6 kg.

## FAQs

**Why does bracket height matter so much?** The load's turning effect is shared between the top screw and the bottom edge of the bracket, which pushes into the wall. Double the gap between them and the pull on the top screw halves.

**Which number on the fixing packet do I use?** Packets for plasterboard fixings often give a recommended (safe) load, which already has a margin built in. Engineering tables often give the failure load, which needs a safety factor.

**Is this exact?** No. It is a rough guide that ignores the bracket bending, screws at an angle and how good the wall is. Fixing makers' ratings win, and heavy loads belong in studs or solid masonry.

**What about the shelf sagging?** That is the board bending between the brackets, a different question; the [[beam-calculator]] can work it out.
