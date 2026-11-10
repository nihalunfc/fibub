---
name: Passport photo
num: 1709
shelf: documents
section: images-scans
title: "Passport photo maker: crop to Canada, US, UK and India sizes, free"
summary: "Crop your own photo to the right passport size with head-height guide lines, whiten the background, and print a 4 x 6 in or 10 x 15 cm sheet. Nothing is uploaded."
status: live
ads: false
order: 1709
icon: camera
works: offline
updated: 2026-11-10
related: [image-resizer, compress-file]
sources:
  - "Canada, 50 x 70 mm, face 31 to 36 mm: https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos (read 2026-11-10)"
  - "United States, 2 x 2 in (51 x 51 mm), head 1 to 1 3/8 in (25 to 35 mm): https://travel.state.gov/en/passports/apply/help/photos.html (read 2026-11-10)"
  - "United Kingdom, 45 x 35 mm, head 29 to 34 mm: https://gov.uk/photos-for-passports/photo-requirements (read 2026-11-10)"
  - "India, 2 x 2 in (51 x 51 mm), head 35 to 40 mm: Consulate General of India, Toronto photo specification, https://cgitoronto.gov.in/docs/1717007167Photo_Specification.pdf (read 2026-11-10). Check passportindia.gov.in for your own application."
  - "Not included: Gulf states and Schengen, because no official page could be confirmed."
flow:
  - { icon: image, label: "Photo" }
  - { icon: crop, label: "Align" }
  - { icon: sliders, label: "Options" }
  - { icon: download, label: "Save" }
---

## What it does

Passport photo crops a picture of your face to the exact size a passport office asks for. Pick a country, drag and zoom your photo under the frame, and use the guide lines to check how big your head is. Then save a single photo, or a print sheet that fills a 4 x 6 inch or 10 x 15 cm piece of photo paper.

Everything happens on your device and nothing is stored. The sizes come from the government pages listed under Sources, but rules change and offices can reject photos for other reasons, so always check the official page. Resize or shrink the result with [[image-resizer]] and [[compress-file]] if an online form wants a smaller file.

## How to use it

1. Take a photo facing the camera, in even light, in front of a plain light wall. Ask someone to take it so the camera is at eye level.
2. Choose the photo, then your country.
3. Drag the photo until the top of your head touches the blue line and your chin falls between the two red lines. Use Zoom to make your head bigger or smaller.
4. Tick **Make the background white** if the wall is not white.
5. Press **Download photo** for one picture, or **Download print sheet** and print it at 100% size.

## What each setting does

- **Photo size**: the width and height of the print, saved at 300 dpi.
- **Guide lines**: the blue line marks the top of the head; the red lines mark the smallest and largest head height allowed.
- **White background**: turns pixels close to the colour in the top corners white. It works best on a plain, evenly lit wall.
- **Print sheet**: repeats the photo as many times as it fits on the paper, with small marks at the edges for cutting.

## Worked example

Canada asks for 50 x 70 mm with a face 31 to 36 mm tall. At 300 dpi that is 591 x 827 pixels. Four of them fit on a 4 x 6 inch sheet, so one print gives you four photos.

## FAQs

**Can I smile or wear glasses?** The rules differ by country and change; read the official page for expressions, glasses and head coverings.

**Does it check my photo for me?** No. It only helps with size and position.

**Why is the print too small or large?** Print at 100% or actual size and turn off fit-to-page.

**Are my photos kept?** No. They never leave your browser.
