---
title: "How to copy text from a photo or scanned PDF (OCR explained)"
summary: "What OCR does, how to get clean text from phone photos, screenshots and scanned PDFs, and how to check the result before you trust it."
tools: [ocr, scan-to-pdf, text-cleaner, word-counter]
updated: 2026-11-10
sources:
  - "The reading engine is Tesseract OCR (Apache License 2.0), run in the browser through tesseract.js, as named on the tool page."
  - "A4 paper is 210 x 297 mm; a PDF point is 1/72 of an inch (standard values)."
---

A photo of a page looks like text to you, but to a computer it is only coloured dots. You cannot search it, paste it into an email or fix a typo in it. The [[ocr]] tool turns those dots back into real letters, inside your browser, so a lecture handout, a shop receipt, a screenshot of an error message or an old scanned letter becomes text you can edit. It suits students, office workers and anyone retyping things by hand. If your page is still on paper, straighten it into a clean PDF with [[scan-to-pdf]] first, then tidy the result with [[text-cleaner]] or check its length with [[word-counter]].

## What it is

OCR stands for **optical character recognition**: software that looks at a picture and decides which letters it shows. It works in three broad stages.

1. **Find the lines.** The reader looks for rows of dark marks on a light background and splits them into words.
2. **Guess each word.** A trained model, built from many thousands of printed samples, compares each word shape with what it has learned and picks the likeliest spelling.
3. **Score the guess.** Every word gets a **confidence** from 0 to 100: how sure the model is. A clean printed word often scores in the 90s; a smudged one may fall far lower.

The engine here is Tesseract, an open-source reader with one model file per language. Because the model learned from print, it does best on typed text with good contrast, and worst on handwriting, decorative fonts and curved pages.

## How to use it

1. Press **Add images or a PDF** to pick one or more files, or **Take a photo** on a phone. You can also paste a picture you copied, with Ctrl+V or ⌘+V.
2. Choose the **Language** from the list: English, Hindi, Malayalam or Arabic. The list shows how big each language file is.
3. Leave **Clean up first** ticked for photos taken in mixed light. Untick it for sharp screenshots. Changing either the language or this box reads the pages again.
4. Wait for the progress bar. The message line then reports how many words it found and how sure it is overall.
5. Compare the text box with the picture beside it. With **Show word boxes** on, blue outlines are confident words and orange ones scored under 60. For a PDF or several pictures, use **Previous** and **Next** to step through the pages.
6. If the text is gibberish because the photo was sideways, press **Turn and read again**. Then fix any slips in the box and press **Copy text** or **Download .txt**.

## A worked example

Priya photographs a two-page printed recipe with her phone. The camera saves pictures 4000 × 3000 pixels. She also has a one-page scanned A4 PDF of the shopping list.

**The photos.** Very large pictures are scaled so the longest side is at most 2,600 pixels. The scale factor is 2600 ÷ 4000 = 0.65, so each photo is read at 4000 × 0.65 = **2600 px** by 3000 × 0.65 = **1950 px**. That is still plenty of detail for normal print.

**The PDF.** An A4 page is 595.28 × 841.89 points. Each PDF page is drawn so its long side is 2,400 pixels, with a cap of three times its point size. The factor is 2400 ÷ 841.89 ≈ 2.85, so the page becomes about **1697 × 2400 px** before reading.

She adds all three files at once. The text box shows three blocks, each headed "--- Page 1 ---", "--- Page 2 ---" and "--- Page 3 ---". Two words on page 2 are boxed in orange: "1 tsp" came out as "l tsp". She fixes it and copies everything into her notes.

## Where it is used

- **Students** turn photographed handouts into notes they can search, highlight and quote.
- **Office work.** Old scanned contracts and letters become text you can search for a name or a date.
- **Accounts and receipts.** Reading the totals off paper receipts saves retyping them into a spreadsheet. Always double-check the amounts.
- **Accessibility.** Text pulled from a picture can be read aloud by a screen reader or enlarged, which a flat image cannot.
- **Researchers** pull quotes from printed books in Hindi, Malayalam or Arabic as well as English.

## Common mistakes

- **Picking the wrong language.** An English model reading Hindi gives nonsense. Match the language to the text before you judge the result.
- **Shooting at an angle.** Slanted or curved lines confuse the line finder. Hold the phone flat above the page, or flatten the page first with the scan tool.
- **Trusting numbers blindly.** Pairs such as 0 and O, 1 and l, or 5 and S look alike. Check every amount, date and phone number against the picture.
- **Running OCR on a PDF that already has text.** If you can select words in your PDF reader, copy them there instead. That text is exact; OCR is a guess.
- **Leaving Clean up first on for a clean screenshot.** The filter can thin out fine letters. If letters look broken, untick it and let it read again.

## Questions people ask

**Can it keep the layout, like columns and bold text?** No. You get plain text, one line after another. Columns may run into each other, so paste into a document and rebuild the layout there.

**Why do some words show no box at all?** The reader did not see them as text, often because they were too faint, too small or on a busy background. A closer, brighter photo usually fixes it.

**Does a higher confidence mean the word is right?** Usually, but not always. A model can be confident and still wrong, so treat the score as a guide to where to look first, not as proof.

**Can I read a page with two languages?** Pick the main language. Words in the other script will likely come out wrong, so read that part again with the other language chosen.
