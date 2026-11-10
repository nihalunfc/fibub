---
name: Fill PDF
num: 1705
shelf: documents
section: pdf-sign
title: "Fill PDF form online: type into any PDF, free"
summary: "Fill in a PDF form on your phone or computer, or type, tick and date anywhere on a PDF that has no fields. Nothing is uploaded."
status: live
ads: false
order: 1705
icon: pencil
works: offline
updated: 2026-11-10
related: [sign-pdf, compress-file]
sources:
  - "Form fields are read and written with pdf-lib (MIT); page pictures use pdf.js (Apache 2.0). Both run in your browser. No figures or rules."
flow:
  - { icon: file, label: "Open PDF" }
  - { icon: pencil, label: "Fill in" }
  - { icon: check, label: "Tick" }
  - { icon: download, label: "Download" }
---

## Fill in a PDF form on any device

Open a PDF and fibub looks for its form fields. If it finds any, they appear as an ordinary form: text boxes, tick boxes, drop-down lists and choices. Fill them in and download the PDF. If the PDF has no fields (a scanned form, or a document someone printed to PDF), use **Type anywhere**: tap the page to put text, a tick mark or a date exactly where you want it.

Everything happens in your browser. Your PDF, and what you type into it, are never uploaded, and the page keeps working with no internet once it is open. Nothing you type is saved after you close the page.

When the form needs your signature too, use [[sign-pdf]] on the filled copy; to make a big filled-in file smaller for email, use the [[compress-file|file compressor]].

## How to use it

1. Choose your PDF, or drop it on the box.
2. If form fields are found, fill them in under **Form fields**. Choose from the lists, tick the boxes.
3. For anything else, type the words in **Text** (or use the **Date text** box), press **Add text**, **Add date** or **Add tick mark**, then tap the page. Drag the box to move it and pull the square corner to change the size. The **x** removes it.
4. Press **Download filled PDF**. Open the file and check it before you send it.

## What each setting does

- **Flatten the form**: turns the fields into plain page content. Use it when the form must not be changed again, or when a viewer shows the fields blank. Leave it off if you still want to edit the fields later.
- **Add text / date / tick**: marks that are drawn straight onto the page, not form fields.
- **Arrow keys**: nudge a selected mark (hold Shift for bigger steps).

## Worked example

A tenancy form with Name, Address, a "Smoker" tick box and a "Term" drop-down: type your name and address, leave the box un-ticked, choose "12 months", and download. Opening the file in any PDF viewer shows those values in the right places, and a form reader sees the same values you typed.

## FAQs

**Why are my typed values not shown on the page picture above?** The picture shows the PDF as it was opened. Your values are written into the downloaded file.

**Some fields are missing.** Only the standard form field types are read: text, tick box, drop-down, list and radio choices. Signature fields are left alone; use [[sign-pdf]] for those.

**It says the PDF is locked.** Password-protected PDFs cannot be changed. Remove the password in the program that made it, then try again.

**Are my files stored?** No. Everything happens on your device.
