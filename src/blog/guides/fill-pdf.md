---
title: "How to fill in a PDF form without printing it, on any device"
summary: "Fill a PDF's form fields, or type, tick and date on a scanned form that has none, then save a copy to send. How PDF forms work, text sizes, flattening and the checks to do before you send."
tools: [fill-pdf, sign-pdf, compress-file, scan-to-pdf]
updated: 2026-11-10
sources:
  - "How PDF form fields (AcroForm text boxes, check boxes, drop-downs, lists and radio groups) and flattening work is general knowledge of the PDF format, explained in fibub's own words."
  - "Page sizes: A4 is 210 × 297 mm (595 × 842 points); US Letter is 8.5 × 11 in (612 × 792 points). One point is 1/72 inch."
---

Printing a form, writing on it and scanning it back is slow. The [[fill-pdf]] tool lets you do it on the screen. If the PDF has real form fields, it lists them as an ordinary web form. If it is a scan or a flat document, you tap the page to drop text, a tick or a date where it belongs. The finished copy is saved to your device and never sent anywhere. To add your signature afterwards, open the filled copy in [[sign-pdf]]; if you only have a paper form, turn it into a PDF first with [[scan-to-pdf]].

## What it is

There are two kinds of PDF form, and they need different handling.

A **fillable form** has **form fields** built into the file. Each field has a name and a type: a text box, a tick box, a drop-down list, a list where you can pick several, or a group of round radio buttons where you pick one. The value is stored in the file, so any PDF reader shows it.

A **flat form** is just a picture of lines and boxes, like a scan or a document "printed to PDF". The only way to fill it is to draw text onto the page.

The tool handles both. It reads the fields if there are any and shows them under **Form fields**, labelled with the names the form's maker gave them. The **Type anywhere** panel works on every PDF.

**Flattening** a form turns its fields into ordinary page content. The values stay visible but can no longer be edited, and readers that hide field values will show them.

For marks you place yourself, the letter size follows the height of the box. The text is 0.8 × the box height, so on an A4 page (842 points tall) the first box is 0.022 of the page height and gives text of about **14.8 pt**. Pulling the corner changes the height, and the text grows or shrinks with it.

## How to use it

1. Press **Choose a PDF to fill in**, or drop the file on the box. A note says how many form fields were found.
2. If there are fields, fill them under **Form fields**: type in the boxes, tick **Ticked** where it applies, and pick from the lists and round buttons.
3. For anything else, type in **Text** and press **Add text**, or press **Add tick mark**. **Add date** uses the **Date text** box, which starts with today's date (year-month-day); change it to the format your form asks for.
4. Tap the page where the mark should go. Drag it to move it and pull the square corner to change its size. The arrow keys nudge a selected mark; hold Shift for bigger steps. The **×** removes it.
5. Tick **Flatten the form** if the form must not be changed after you send it.
6. Press **Download filled PDF**, then open the file and check every page.

## A worked example

You have a two-page A4 club membership form that was scanned, so it has no fields. You need to fill in your name, address, phone number and email, tick two boxes and add the date.

1. Open it. The note says the PDF has no form fields.
2. Type your name, press **Add text** and tap the "Name" line. Repeat for the address, phone and email lines: **4 text marks**.
3. Press **Add tick mark** and tap each box: **2 ticks**. A tick starts at 0.03 of the page height, which on A4 is 0.03 × 297 mm = **8.9 mm** tall. Drag the corner if the printed boxes are smaller.
4. The form wants the date as 10/11/2026. Type that in **Date text**, press **Add date** and tap the date line: **1 mark**.
5. The lines on the form are small, and the new text at 14.8 pt looks too big. To get 10 pt, make the box 10 ÷ 14.8 ≈ **0.68** of its first height: about 4.4 mm tall instead of 6.5 mm.
6. Fine-tune: one arrow press moves a mark 0.005 of the page, which is **1.05 mm** across or **1.5 mm** down on A4. With Shift it is 0.02 of the page: **4.2 mm** across or **5.9 mm** down.
7. Download. The message reads "Saved. 0 form fields changed and 7 marks added." The file keeps its name with "-filled" added.

## Where it is used

- **Job seekers and renters.** Application forms that ask for the same details again and again.
- **Parents.** School trip and consent slips sent by email.
- **Small offices.** Supplier and onboarding forms, filled once and saved for the records.
- **Travel and admin.** Claim and request forms. For official forms, check the official source for whether a typed copy is accepted.

## Common mistakes

- **Expecting to see your field values on the page picture.** The picture shows the PDF as you opened it. Your values are written into the downloaded copy, so open that to check.
- **Flattening too early.** Once flattened, the fields cannot be changed. Keep an unflattened copy if you might need to edit it.
- **Forgetting the signature.** This tool leaves signature fields alone. Sign the filled copy with [[sign-pdf]].
- **Sending a huge file.** Scanned forms can be big. Shrink the filled copy with the [[compress-file|file compressor]] before you email it.

## Questions people ask

**Why are the field names odd, like "Text1" or "txtAddr"?** The tool shows the names stored in the file by whoever built the form. Match them to the page picture to see which box is which.

**Can I type in letters that are not in English?** Yes. Marks you place in scripts the standard PDF font lacks, such as Arabic or the rupee sign, are drawn onto the page as a small picture instead of text.

**Does a typed form count as signed?** No. Typing your name is not a signature. Add one with a signing tool, and check what the organisation accepts.
