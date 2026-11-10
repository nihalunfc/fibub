---
name: Deck calculator
num: 2024
shelf: everyday
code: T872
section: building
title: "Deck calculator: deck boards, joists and screws for a new deck"
summary: "Count the deck boards, joists and screws or hidden clips for a deck from its size, board width, gap, the board lengths you can buy and joist spacing."
status: live
ads: false
order: 2024
icon: ruler
works: offline
updated: 2026-11-10
related: [concrete-calculator, stair-calculator, paint-calculator]
sources:
  - "Board, joist and fastener counts are fibub's own working from the sizes you type."
  - "Two screws per board at each joist and a 5 mm (3/16 in) gap are common rules of thumb; board makers give their own fixing and gap instructions. Span tables and permits are set by your local building code."
flow:
  - { icon: ruler, label: "Deck size" }
  - { icon: sliders, label: "Boards" }
  - { icon: calculator, label: "Count" }
  - { icon: check, label: "Buy list" }
---

## What it does

Plan the shopping list for a deck. Type the deck's size, the board width and gap, the board lengths your timber yard sells and the joist spacing, and the calculator works out how many rows of boards you need, which board lengths to buy for each row, the joists, and the screws or hidden clips.

It works in metric or imperial and runs entirely in your browser. Span tables and permits are local, so check your building code before you build. For the footings use the [[concrete-calculator]], and for steps down to the garden the [[stair-calculator]].

## How to use it

1. Choose Metric or Imperial. Switching loads the example in those units.
2. Type the deck length along the boards and the width across them.
3. Type the board width, the gap and the lengths you can buy, separated by commas.
4. Set the joist spacing and how the boards are fixed. **Reset example** brings the example back; **Clear** empties the sizes.

## What each setting does

- **Deck length, along the boards**: the direction the boards run. Joists run the other way.
- **Board width and gap**: rows = (deck width + gap) ÷ (board width + gap), rounded up, because there is one gap fewer than boards.
- **Board lengths you can buy**: for each row the calculator picks the combination of up to 4 boards with the least total length; joints must sit on a joist. Offcuts are not reused.
- **Joist spacing**: 400 or 600 mm (16 or 24 in) centres are common. Joists = deck length ÷ spacing, rounded up, plus one.
- **Fixing**: face screws (screws per board at each joist, 2 by default) or hidden clips, counted as one per board at each joist.

## Worked example

A deck 4 m long and 3 m wide with 140 mm boards and 5 mm gaps: 3005 ÷ 145 = 20.7, so 21 rows. The yard sells 3.6 m and 4.8 m boards, so each 4 m row takes one 4.8 m board: 21 boards of 4.8 m. Joists at 400 mm across 4 m: 4000 ÷ 400 = 10, plus one, so 11 joists of 3 m. Screws: 21 × 11 × 2 = 462.

## FAQs

**Does it count beams, posts and rim joists?** No. It counts the decking, the joists under it and the fixings.

**How many spare boards should I buy?** A board or two extra covers split ends and bad cuts.
