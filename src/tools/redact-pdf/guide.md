---
name: Redact PDF
num: 1706
shelf: documents
section: privacy-clean
title: "Redact PDF: black out text in a PDF for good, free"
summary: "Black out names, numbers and areas in a PDF. Redacted pages become pictures, so the hidden text is truly gone. Nothing is uploaded."
status: live
ads: false
order: 1706
icon: eye
works: offline
updated: 2026-11-10
related: [sign-pdf]
sources:
  - "Text positions come from pdf.js (Apache 2.0) and the new PDF is built with pdf-lib (MIT), both in your browser. Number shapes (card with Luhn check, SSN, SIN, Aadhaar, PAN, UK NI number) are common public formats and can match other numbers; always check."
flow:
  - { icon: file, label: "Open PDF" }
  - { icon: search, label: "Find" }
  - { icon: eye, label: "Cover" }
  - { icon: download, label: "Download" }
---

## Redact a PDF so the hidden text is really gone

Putting a black rectangle over text in a PDF editor often hides nothing: the words are still in the file and can be copied out. This tool does it properly. Pages you redact are re-drawn as pictures with the black boxes burned into the pixels, so there is no text underneath to find. The page is rebuilt from scratch.

Everything happens in your browser. Your PDF is never uploaded, and the page keeps working with no internet once it is open. The cost: **redacted pages become pictures** and can no longer be searched or selected. Pages you did not redact are kept exactly as they were.

To sign the file once it is redacted, use [[sign-pdf]].

## How to use it

1. Choose your PDF.
2. Type the words to hide, one per line. Tick the kinds of numbers to hide too: email addresses, phone numbers, card numbers (checked with the Luhn test so random digits are skipped), US Social Security numbers, Canadian SIN, Aadhaar, PAN, and UK National Insurance numbers. Press **Find on all pages**.
3. Check the list and the black boxes on the pages. Press **Keep this** on anything that should stay visible.
4. Drag on a page to draw extra boxes for things search cannot see: pictures, signatures, handwriting. Drag a box to move it, pull the corner to resize it.
5. Choose the quality (150, 200 or 300 DPI) and press **Redact and download**. The tool then re-reads its own file and tells you whether any text is left on the redacted pages.

## What each setting does

- **DPI**: the sharpness of redacted pages. 150 makes the smallest file, 300 the sharpest and largest. 200 suits most pages.
- **Match capital letters exactly**: off by default, so "smith" also finds "Smith".
- **Drawing is on/off**: turn it off on a phone to scroll with your finger.

## Worked example

A one-page letter has an email address and a card number in the text. Tick **Email address** and **Card number**, press Find, and two boxes appear. Download the file: the page is now a picture, searching it for the email finds nothing, and the report says the redacted page contains no text.

## FAQs

**Does it find text inside scanned pages?** No. A scan has no text to search, so draw boxes over it.

**Can the number shapes be wrong?** Yes. They are guesses from the look of the number, so a long reference number might match, and a number split over two lines might not. Always look at the result.

**Is the original changed?** No. You get a new file with "-redacted" in its name.

**What is lost?** Redacted pages lose text, links and form fields. The new file also starts with fresh document details, so the old title and author are not carried over.
