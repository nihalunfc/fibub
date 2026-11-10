---
title: "How to make a passport photo at home and print it"
summary: "How passport photo sizes, head height and print resolution fit together, with a worked example for a 2 x 2 inch photo on 4 x 6 inch and 10 x 15 cm paper."
tools: [passport-photo, image-resizer, compress-file]
updated: 2026-11-10
sources:
  - "Photo and head sizes are those built into the tool, each taken from an official page read on 2026-11-10: Canada (canada.ca), United States (travel.state.gov), United Kingdom (gov.uk) and India (Consulate General of India, Toronto photo specification; passportindia.gov.in for your own application). Rules change, so check the official source."
  - "1 inch = 25.4 mm (exact). Prints are made at 300 dots per inch."
---

Photo booths and studios charge for something your phone can already do. The [[passport-photo]] tool crops a picture of your face to a country's passport size, shows guide lines for head height, can whiten the wall behind you, and lays copies out on a sheet ready for a photo print shop or home printer. It works in your browser, so your face is never uploaded. If an online form wants a smaller file or a different pixel size, finish with [[compress-file]] or the [[image-resizer]].

## What it is

A passport photo has two size rules: the size of the **print**, and the size of your **head** inside it, measured from chin to the top of the head. The tool knows four sets of rules, each from a government page named under sources, read on 10 November 2026:

- **Canada** (canada.ca): 50 × 70 mm, face 31 to 36 mm.
- **United States** (travel.state.gov): 2 × 2 in (50.8 mm square), head 25 to 35 mm.
- **United Kingdom** (gov.uk): 35 × 45 mm, head 29 to 34 mm.
- **India** (Consulate General of India, Toronto; see passportindia.gov.in): 2 × 2 in, head 35 to 40 mm.

Rules change, and offices also judge light, expression and background. Always check the official source before you print.

To turn millimetres into pixels for printing, the tool uses 300 **dpi** (dots per inch):

pixels = mm ÷ 25.4 × 300

rounded to a whole pixel, where 25.4 is the number of millimetres in an inch. The blue guide line sits 8% of the way down the photo. The two red lines sit the smallest and largest allowed head height below it, so your chin must land between them.

## How to use it

1. Press **Choose a photo of your face**. A photo taken by someone else, at eye level, against a plain light wall works best.
2. Pick your country in **Photo size**. The line below it repeats the size rule and reminds you to check the official page.
3. Drag the photo inside the frame, and use the **Zoom** slider to make your head bigger, until the top of your head touches the blue line and your chin sits between the two red lines. The thin blue line down the middle helps you centre your face.
4. Tick **Make the background white** if the wall is grey or cream. It brightens colours close to those in the top corners.
5. Choose a **Print sheet** of 4 x 6 in or 10 x 15 cm. The note under the buttons says how many photos fit.
6. Press **Download photo (JPG)** for a single photo, or **Download print sheet (JPG)**. Print the sheet at 100% size, with any "fit to page" option turned off.

## A worked example

Noor needs a US-size photo, 2 × 2 in, which is 50.8 mm on each side.

**Pixels.** 50.8 ÷ 25.4 × 300 = **600 px**, so the photo is 600 × 600 px.

**Guide lines.** The blue line is 8% down: 0.08 × 50.8 mm ≈ **4.1 mm** from the top. The chin must fall between 4.1 + 25 = **29.1 mm** and 4.1 + 35 = **39.1 mm** from the top. Noor zooms in until her chin sits about halfway, near 34 mm.

**The 4 × 6 in sheet.** It is 4 × 300 = 1200 px by 6 × 300 = 1800 px. Across, 1200 ÷ 600 = 2 photos; down, 1800 ÷ 600 = 3. That gives 2 × 3 = **6 photos** on one print.

**The 10 × 15 cm sheet.** It is 100 ÷ 25.4 × 300 ≈ **1181 px** by 150 ÷ 25.4 × 300 ≈ **1772 px**. Only one 600 px photo fits across 1181 px, and two fit down, so the tool reports **2 photos**. Turning the sheet sideways gives the same 2. Noor picks the 4 × 6 in sheet and gets three times as many photos for the same print.

## Where it is used

- **Passport renewals** in the four countries the tool covers, by post or at a counter that accepts your own prints.
- **Visa and ID forms.** Many ask for a photo of a set size. Crop to the nearest size, then fine-tune with the image resizer if the form gives exact pixels.
- **School and work ID cards.** A square or small portrait photo with a plain background looks neat.
- **Online applications.** Some portals want a light JPG under a set size; the file compressor gets it there.

## Common mistakes

- **Measuring to the hairline instead of the top of the head.** The blue line marks the top of the head. Line up the very top, including hair, unless your country's rule says otherwise.
- **Printing with fit-to-page on.** The printer scales the sheet and the photos come out the wrong size. Choose actual size or 100%.
- **Picking the wrong sheet.** As the example shows, 10 × 15 cm is slightly smaller than 4 × 6 in, and some photo sizes fit fewer times on it. Read the count before you download.
- **Using a busy or dark background.** The whitening only works when the wall is plain and evenly lit. Shadows and patterns stay.
- **Trusting old rules.** Sizes and rules can change. Check the official source every time you apply.

## Questions people ask

**Can I use a selfie?** It is better not to. Arm's-length selfies make the nose look bigger and the head tilt. A timer on a shelf at eye level, about 1 to 1.5 m away, works better.

**Why is the saved photo sharper than the preview?** The preview is drawn small to fit the screen. The download is made at 300 dpi from your full photo.

**Does the tool check if my photo will be accepted?** No. It helps with size and position only. Expression, glasses, lighting and other rules are for you to check on the official page.

**Is Schengen or a Gulf state included?** Not yet. Those sizes were left out because no official page could be confirmed.
