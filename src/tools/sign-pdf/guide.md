---
name: Sign PDF
num: 1704
shelf: documents
code: T738
section: pdf-sign
title: "Sign PDF: add your signature to a PDF online, free"
summary: "Draw, type or upload your signature, tap the page to place it, add the date and initials, and download the signed PDF. Nothing is uploaded."
status: live
ads: false
order: 1704
icon: pencil
works: offline
updated: 2026-11-10
related: [fill-pdf, compress-file, organise-pdf, page-numbers]
sources:
  - "PDF drawing uses pdf-lib (MIT) and page pictures use pdf.js (Apache 2.0), both running in your browser. No figures or rules; signatures are drawn by you."
flow:
  - { icon: file, label: "Open PDF" }
  - { icon: pencil, label: "Sign" }
  - { icon: pointer, label: "Place it" }
  - { icon: download, label: "Download" }
---

## Sign a PDF without printing it

Open your PDF, make a signature, and tap the page where it should go. fibub draws it into the file and gives you a signed copy to download. Your PDF and your signature stay in your browser; nothing is uploaded, and the page keeps working with no internet once it is open.

This makes a **simple electronic signature**: a picture of your handwriting on the page, the same as signing a printout and scanning it. It is accepted for most everyday forms, leases, permission slips and agreements. It is not a certificate-based digital signature, so it does not lock the file or prove who signed it. If a form asks for that kind, use the service it names.

To fill in the form fields first, use [[fill-pdf]]; to make the signed file smaller for email, [[compress-file|the file compressor]].

## How to use it

1. Choose your PDF, or drop it on the box.
2. Make your signature. **Draw** it with a finger, stylus or mouse; **Type** your name and pick one of three writing styles; or **Upload** a photo of a signature on white paper.
3. Press **Add signature**, then tap the page. Drag the box to move it, pull the square corner to resize it, and press the **x** to remove it. Arrow keys nudge the selected box.
4. Add the **date**, your **initials** or any short **text** the same way. Tick "Put my initials on every page" to repeat the first initials in the same spot on all pages.
5. Press **Download signed PDF** and open it to check.

## What each setting does

- **Draw, Type, Upload**: three ways to make the same thing, a transparent picture of your signature, trimmed to the ink.
- **Make the white background clear**: for uploads, turns the paper white into see-through so the signature does not hide the line it sits on.
- **Date text**: filled with today's date; change it to any format you like, for example 10 Nov 2026.
- **Initials on every page**: copies the initials you placed to the same spot on the other pages.

## Worked example

A three-page rental agreement: type your name in the Script style, press **Add signature** and tap the signature line on page 3. Press **Add date** and tap next to it. Press **Add initials**, tap the bottom corner of page 1, tick "Put my initials on every page", and download. Pages 1 to 3 have initials, and page 3 has your name and the date.

## FAQs

**Is this legally binding?** Electronic signatures are valid for many documents in Canada, the US, the UK, India and the Gulf states, but some documents (wills, property transfers, some government forms) have special rules. Check the rules for yours.

**Can someone remove the signature afterwards?** The picture is flattened into the page, so it is not a movable object, but anyone could still edit a PDF. A certificate signature is what protects against that.

**Why does it say my PDF is locked?** Password-protected PDFs cannot be changed. Remove the password in the program that made it, then try again.

**Are my files stored?** No. Everything happens on your device.
