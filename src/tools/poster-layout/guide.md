---
name: Poster layout
num: 809
shelf: science
code: T545
section: figures-and-data-presentation
title: "Scientific poster layout: A0, A1 and 36 × 48 in templates with columns and text sizes"
summary: "Pick a poster size and orientation, set the columns, margins, gutters and title band, and see the layout to scale next to an A4 sheet. Get the font sizes that stay readable from where people stand, and download a full-size SVG or PDF template with guides and dimensions."
status: live
ads: true
order: 809
icon: ruler
works: offline
updated: 2026-11-09
related: [figure-checker, science-colour-palette, plot-maker, scientific-notation-formatter, author-list-formatter, abstract-word-counter, image-resizer, readability-checker]
sources:
  - "ISO 216 A sizes and the inch sizes are standard paper dimensions. The column grid is plain arithmetic, checked in the tests against numbers worked out separately in Python."
  - "Text sizes use visual angle: the smallest letters readable with normal (6/6 or 20/20) sight span 5 minutes of arc, and the page asks for 3 times that by default (editable), taking sans-serif capitals as 0.7 of the font size."
  - "Starting settings (margins, gutters, bands, reading distances) are rounded, made-up values to edit, not any conference's rules."
flow:
  - { icon: file, label: "Size" }
  - { icon: table, label: "Columns" }
  - { icon: eye, label: "Text size" }
  - { icon: download, label: "Template" }
---

## What it does

A conference poster is read standing up, from a metre or more away, often in a crowded hall. Most poster problems come from two things decided at the start: a grid that does not suit the paper, and text too small to read from where people stand. This page sets both before you open a design program.

- **Size and orientation.** A0, A1, A2 and A3, the common inch sizes (36 × 48, 42 × 56, 24 × 36 and a 4 × 8 ft board), or any custom size in mm, portrait or landscape.
- **Grid.** Columns, the margin round the edge, the gutter between columns, a title band across the top and a footer band for logos, references and contact details. The page works out each column's width and height and the share of the poster left for content.
- **To scale.** The layout is drawn to scale with an A4 sheet and a 100 mm bar beside it, so you can feel how big the poster really is.
- **Text sizes.** For the title, section headings, body text and captions, it gives the font size whose capital letters stay comfortably readable from the distance you set, and how many characters fit on one line of a column at the body size.
- **Templates.** Full-size SVG and PDF files with the guides as dashed boxes and every size written in, ready to open in Inkscape, Illustrator, Affinity, Scribus or PowerPoint.

Check each figure first with the [[figure-checker]], and format the author line with the [[author-list-formatter]].

## How to use it

1. **Size.** Check the conference instructions for the board size and whether it is portrait or landscape, then pick it (or type a custom size).
2. **Grid.** Three columns suit portrait A0; four or five suit landscape. Keep a margin of 2 to 3 cm, since printers trim and boards have pins.
3. **Reading distances.** The defaults (title from 5 m, headings 3 m, body 1.5 m, captions 1 m) are rough starting points. Raise *Comfort* for older audiences or dim halls.
4. **Download** the SVG or PDF template, place your text and figures on it, and delete the notes before printing.

## Worked example

The page opens with A0 portrait (841 × 1189 mm), 3 columns, 25 mm margins, 20 mm gutters, a 150 mm title band and a 60 mm footer. Each column is 250.3 mm wide and 889 mm tall and starts 195 mm from the top; the columns hold 67 % of the poster. With comfort 3 (capitals spanning 15 minutes of arc):

- Body text read from 1.5 m needs capitals 6.5 mm tall: 26.5 pt, so use **28 pt**. A column line then holds about 50 characters, a comfortable length.
- Section headings from 3 m: 53.0 pt, use **54 pt**.
- The title from 5 m: 88.3 pt, use **90 pt**.
- Captions and references from 1 m: 17.7 pt, use **18 pt**.

The headline reads *3 columns 250.3 mm wide; body text 28 pt, title 90 pt*. Switch to 5 columns and the line drops to about 28 characters, which the page flags as short.

## Tips

- **Less text.** A poster is a visual summary: aim for a few hundred words, large figures and a clear take-home message in the title band.
- **Check figures at size.** A figure 250 mm wide at 300 dpi needs about 2950 pixels across. The [figure checker](/science/figure-checker/) tells you whether yours is enough.
- **Print a tile.** Print one A4 section at 100 % to check the text size before paying for the full poster.

## Questions

**Why visual angle?** Whether text can be read depends on how big it looks, which is its height divided by the distance. Letters of the same angular size are equally readable at any distance, so the sizes scale in proportion.

**Why does the PDF say "x" instead of "×"?** The PDF uses the built-in Helvetica font, which keeps the file small and opens anywhere; the SVG keeps every character.

**Can I change the guides later?** Yes. The guides are ordinary boxes in the template; move or delete them in your design program.
