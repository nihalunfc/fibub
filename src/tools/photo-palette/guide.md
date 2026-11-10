---
name: Photo palette
num: 2011
shelf: everyday
code: T859
section: web-colours
title: "Photo palette: get the main colours from a photo or image"
summary: "Choose a photo and get its 5 to 10 main colours with HEX and RGB codes and how much of the picture each one covers. Copy them as CSS or save a swatch strip."
status: live
ads: false
order: 2011
icon: image
works: offline
updated: 2026-11-10
related: [colour-converter, favicon-maker, image-resizer]
sources:
  - "k-means clustering with k-means++ starting points (Arthur and Vassilvitskii, 2007): fibub's own working."
flow:
  - { icon: image, label: "Photo" }
  - { icon: sliders, label: "Colours" }
  - { icon: copy, label: "Copy" }
---

## What it does

This page finds the main colours in a picture, such as the sky, the walls or the brand colours of a logo. Choose a photo and you get between 5 and 10 colours, each with its HEX and RGB code and the share of the picture it covers. You can copy any colour, copy the whole set as CSS variables, or download a PNG strip of swatches.

The photo never leaves your device: it is read on this page and the colours are worked out in your browser. To turn one of the colours into HSL, CMYK or a CSS name, open it in the [[colour-converter]]; to build a site icon in your new colours, try the [[favicon-maker]].

## How to use it

1. Choose a photo. A drawn example is shown until you do.
2. Pick how many colours you want, from 5 to 10.
3. Sort the list by share, from dark to light, or by hue.
4. Copy a single code, press **Copy CSS**, or download the swatch strip.

## What each setting does

- **Colours**: how many groups the pixels are split into. If the picture has fewer distinct colours (a flat logo, say), you get fewer and the page says so.
- **Sort by**: only changes the order. Share puts the biggest areas first; dark to light uses brightness; hue goes round the colour wheel, with greys first.
- **Use the example**: goes back to the drawn example and the default settings.

## How it works

The photo is shrunk to at most 120 pixels on its long side and see-through pixels are skipped. The pixels are then grouped by k-means: starting colours are picked far apart (k-means++), and each moves to the average of the pixels nearest to it, up to 25 times. A fixed seed means the same photo always gives the same palette.

## Worked example

A picture that is red on its left half and blue on its right half gives two colours, #ff0000 and #0000ff, each about 50% of the image, even with 6 colours asked for. The drawn example gives 6 colours at the default and 8 when you choose 8.

## FAQs

**Why is a colour slightly off?** Each swatch is the average of a group of similar pixels.

**Does it work with PNG logos?** Yes, and see-through parts are ignored.
