---
title: "How to redact a PDF properly, so hidden words cannot be copied back"
summary: "Why a black box in an editor often hides nothing, how true redaction works, and a step-by-step example that removes a name, a card number and an email from a letter."
tools: [redact-pdf, metadata-cleaner, sign-pdf, organise-pdf]
updated: 2026-11-10
sources:
  - "The Luhn check digit test for card numbers is a public standard (ISO/IEC 7812); 4111 1111 1111 1111 is a widely published test number, not a real card."
  - "How PDF text layers, page pictures and DPI (dots per inch, with 72 points to the inch) work is general knowledge of the PDF format, explained in fibub's own words."
---

Sharing a document with one or two things blacked out is a common job: a bank letter for a landlord, a contract for a colleague, a court bundle, a screenshot of an invoice. The [[redact-pdf]] tool finds the words and numbers you name, lets you draw extra boxes, and then rebuilds each affected page so the covered text is not in the file any more. It runs in your browser, so the PDF stays on your device. Before you send the result, strip the hidden details such as author and software with [[metadata-cleaner]], and if pages need removing or reordering first, use [[organise-pdf]].

## What it is

A PDF page usually has two layers you never think about. One is the **text layer**: the actual letters, stored as characters with positions, which is why you can search and copy them. The other is everything drawn on top: lines, pictures, shapes. A black rectangle added in an ordinary editor joins the drawn layer. The letters below it are still in the text layer, and anyone can select them and paste them into a message.

**Redaction** means removing the information, not covering it. This tool does that by turning each page that has a box into a **raster image**: a grid of pixels, like a photo. It draws the page, paints the black boxes into the pixels, and puts that picture on a fresh page of the same size. The old text layer for that page is thrown away. Pages with no boxes are copied across untouched, so they keep their searchable text.

The sharpness of the picture is set in **DPI**, dots per inch. A PDF measures pages in points, 72 to the inch, so the picture's width in pixels is:

pixels = page width in points ÷ 72 × DPI

To keep phones from running out of memory, the tool limits one page picture to 16 million pixels and lowers the DPI on very large pages to fit.

## How to use it

1. Open the PDF with **Choose a PDF to redact**, or drop it on the box.
2. In the words box, type each name or phrase on its own line. Tick any number shapes you want caught too, such as email addresses, phone numbers or card numbers.
3. Press **Find on all pages**. Each hit gets a box on the page and a line in the list. Press **Keep this** beside anything that should stay visible.
4. Drag on the page to cover anything search missed: a photo, a signature, a stamp, handwriting. Move a box by dragging it and resize it with its corner.
5. Pick a quality in **Quality of the redacted pages** and press **Redact and download**.
6. Read the report. It re-opens the new file and checks that the redacted pages hold no text at all.

## A worked example

You have a one-page US Letter bank letter (612 × 792 points) to send to a letting agent. You want to hide your surname, your card number, your email and your phone number.

1. Type **Rivera** in the words box. Tick **Email address**, **Phone number** and **Card number**.
2. Press **Find on all pages**. The list shows 5 places: the surname twice ("Dear Ms Rivera" and the signature "Ana Rivera"), the card 4111 1111 1111 1111, the email a.rivera@example.com and the phone number 416-555-0199. The word search does not add a separate box for the "rivera" inside the email, because the email box already covers it.
3. Further down, a payment reference reads 4111 1111 1111 1112. It is not flagged, because it fails the Luhn check that real card numbers pass. That is what you want here.
4. You drag one more box over the bank's scanned signature: 6 boxes on 1 page.
5. At 200 DPI the page becomes 612 ÷ 72 × 200 = **1,700 pixels** wide and 792 ÷ 72 × 200 = **2,200 pixels** tall, about 3.7 million pixels. At 300 DPI it would be 2,550 × 3,300, about 8.4 million.
6. The report says the redacted page now contains no text. Try searching the new file for "Rivera": nothing comes up.

## Where it is used

- **Renting and loans.** Show income on a payslip while hiding your tax number and bank details.
- **Workplaces and HR.** Share a complaint or report with names removed.
- **Legal and freedom of information work.** Release a document with personal details of other people taken out.

## Common mistakes

- **Trusting search on a scan.** A scanned page is already a picture, so it has no text to find. The tool tells you which pages have none; draw boxes there by hand.
- **Missing a split number.** A number broken across two lines, or written with odd spacing, may not match a shape. Read every page before you press save.
- **Forgetting other copies of the data.** Bookmarks, file names and hidden details can still name people. Rename the file and clean it with the [[metadata-cleaner]].
- **Choosing 300 DPI for a long file.** Every redacted page becomes a picture, so 40 pages at 300 DPI can make a large file. 200 DPI is enough for most letters.
- **Signing before you redact.** Redacting turns a signed page into a picture, which breaks a digital signature. Redact first, then sign the redacted copy with [[sign-pdf]].

## Questions people ask

**Can someone undo the black boxes?** Not on the redacted pages. The covered pixels were painted black and the old text was dropped, so there is nothing underneath to recover.

**Why can I no longer copy text from a page I redacted?** Because that page is now a picture. If you need searchable text again, run the redacted copy through a text reader such as [[ocr]]; the black areas stay black.

**Can I redact only part of a word?** Yes. Draw a box over just the letters you want gone, such as all but the last four digits of an account number.
