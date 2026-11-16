---
name: Cut list
num: 3008
shelf: everyday
code: T1011
section: woodwork
title: "Cut list calculator: fit your pieces onto the fewest boards, with saw kerf"
summary: "Type the length of the boards you can buy, the saw kerf and the pieces you need. The cut list packs them onto the fewest boards, draws each board with its cuts and offcut, and gives the waste and a list to copy or print. Millimetres or inches."
seoTitle: "Cut list calculator: fewest boards with saw kerf"
status: live
ads: false
order: 3008
icon: scissors
works: offline
updated: 2026-11-16
related: [know-hand-tools, measure-and-mark, deck-calculator, stair-calculator]
sources:
  - "The packing is fibub's own: first-fit decreasing (each piece, longest first, goes on the first board with room), then an exact search for the fewest boards when the job is small. Each cut removes one kerf of wood; a 3 mm (1/8 in) kerf is typical of hand saws and circular saw blades, but check your own blade."
flow:
  - { icon: ruler, label: "Board size" }
  - { icon: pencil, label: "Pieces" }
  - { icon: check, label: "Cut plan" }
---

## What it does

Before you go to the timber yard, you need to know how many boards to buy. The cut list takes the length of the boards you can buy, the width of your saw cut (the **kerf**) and the list of pieces you need, and fits the pieces onto the fewest boards. Each board is drawn as a bar with its pieces and the offcut left at the end, and you get the total boards to buy, how much is wasted, and a list to copy or print and take to the saw.

It packs pieces longest first, and for jobs of up to 24 pieces it also searches every arrangement to prove the board count is the lowest possible. It works in millimetres or inches, with fractions. To mark the pieces accurately, see [[measure-and-mark]]; for the tools you will cut them with, see [[know-hand-tools]]; and for a whole deck, use the [[deck-calculator]].

## How to use it

1. Choose **Millimetres** or **Inches**.
2. Type the **board length** you can buy, for example 2400 mm or 96 in (8 ft). Width is optional and only labels the shopping list.
3. Set the **saw kerf**. 3 mm (1/8 in) suits most saws. Thin Japanese pull saws cut about 1 mm wide.
4. Add each piece: a name, its finished length and how many. Press **Add a piece** for more rows, or **×** to remove one.
5. Read the cut plan. **Copy cut list** puts it on your clipboard; **Print** prints just the plan.

## What each setting does

- **Board length:** the stock length. If the board ends are split or rough, type the length after trimming them off.
- **Kerf:** each saw cut turns this width into dust. Three pieces on a board need two cuts between them, plus one more if there is an offcut.
- **Pieces:** finished lengths. The plan cuts across the board only, so it assumes every piece is the board's width. For pieces of different widths, make a separate list per width.

## Worked example

A small bookcase needs two sides of 1200 mm, four shelves of 764 mm and a top of 800 mm, cut from 2400 mm boards with a 3 mm kerf. Without the kerf, two sides would fit exactly on one board, but the cut between them needs 3 mm, so they cannot. The cut list puts three shelves on one board (764 × 3 + 2 cuts = 2298 mm, plus a final cut, leaving a 99 mm offcut), a side and the top on the second (394 mm offcut) and a side and a shelf on the third (430 mm offcut). That is 3 boards, the fewest possible, with 6256 mm of 7200 mm used: 13.1% waste.

## FAQs

**Why does it want more boards than I expected?** Usually the kerf. Pieces that add up to exactly a board's length never fit on it, because each cut eats a few millimetres.

**Is it always the best plan?** For up to 24 pieces it proves the fewest boards. For bigger lists it packs longest first, which is usually within one board of the best, and says so.

**Can it plan sheets like plywood?** No, it plans lengths only. For sheets, plan rips (cuts along the length) by hand first, then use this for the cross-cuts.

**Does it save my list?** No. Nothing is stored or sent. Copy or print the list before you close the page.
