---
name: Favicon maker
num: 2010
shelf: everyday
code: T858
section: web-colours
title: "Favicon maker: favicon.ico and PNG icons from an image or a letter"
summary: "Make a favicon.ico plus 16, 32, 48, 180, 192 and 512 px PNG icons from your image or a letter on a colour, with the HTML to paste. Download them all as a zip."
status: live
ads: false
order: 2010
icon: image
works: offline
updated: 2026-11-10
related: [image-resizer, colour-converter, photo-palette]
sources:
  - "Icon sizes: HTML Living Standard (link rel=icon), Apple's apple-touch-icon guidance (180 px) and the W3C Web App Manifest (192 and 512 px)."
  - "ICO file layout with PNG entries: fibub's own working from the published ICO format."
flow:
  - { icon: image, label: "Image" }
  - { icon: sliders, label: "Style" }
  - { icon: download, label: "Zip" }
---

## What it does

A favicon is the small icon in a browser tab, a bookmark or a phone's home screen. Each place wants a different size, so this page makes them all at once: PNG files at 16, 32, 48, 180 (Apple touch icon), 192 and 512 pixels, and a favicon.ico that holds the 16, 32 and 48 px versions in one file. You also get the HTML lines to paste into your page and a site.webmanifest for Android.

Start from your own logo, or type one or two letters on a coloured square, rounded square or circle. Everything is drawn in your browser and nothing is uploaded. To shrink a big logo first, use the [[image-resizer]]; to find the exact colour code for the background, try the [[colour-converter]] or pull one from a photo with [[photo-palette]].

## How to use it

1. Pick **Letter** or **Image**.
2. For a letter, type it and choose the letter colour and weight. For an image, choose the file.
3. Set the background and the shape. The previews update as you change them.
4. Press **Download all (.zip)**, or download favicon.ico or a single size by its link.
5. Copy the HTML into the `<head>` of your page and put the files at the root of your site.

## What each setting does

- **Letters**: one or two characters, centred. Two letters are drawn smaller so they fit.
- **Weight**: bold or regular letters.
- **Fit**: "Whole image" shows all of it; "Fill and crop" fills the square and trims the edges.
- **Padding**: an empty margin around the image.
- **Transparent background**: keeps see-through parts of a PNG. Untick it to fill the shape with the background colour.
- **Shape**: square, rounded square or circle. Corners outside the shape stay transparent.

## Worked example

Keep the example: the letter F in white, bold, on blue #1d4ed8, rounded square. Six previews appear. The zip holds favicon.ico, favicon-16x16.png, favicon-32x32.png, favicon-48x48.png, apple-touch-icon.png, favicon-192x192.png, favicon-512x512.png, site.webmanifest and the HTML as a text file. The favicon.ico starts with the bytes 00 00 01 00 and lists 3 images.

## FAQs

**Do I still need favicon.ico?** Most browsers read the PNG links, but some tools and older browsers ask for /favicon.ico, so keep it.

**Why does my icon look blurry at 16 px?** Fine detail cannot fit in 16 pixels. Use a simple shape or a letter.
