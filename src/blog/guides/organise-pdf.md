---
title: "How to merge, split and rearrange PDF pages without uploading them"
summary: "Put several PDFs together, cut one into parts, turn sideways pages and drop blank ones, all on your own device. How page order, ranges and rotation work, with a full example."
tools: [organise-pdf, compress-file, page-numbers, scan-to-pdf]
updated: 2026-11-10
sources:
  - "How PDF pages, page order and the page rotation setting (in steps of 90 degrees) work is general knowledge of the PDF format, explained in fibub's own words."
---

An application pack, a set of receipts, a report with an appendix: real jobs often need pages from several PDFs in one file, in the right order and the right way up. The [[organise-pdf]] tool shows every page as a small picture, lets you move, turn and remove pages, and then saves one file, several parts in a ZIP, or only the pages you picked. The files never leave your browser. If some pages are still on paper, photograph them into a PDF with [[scan-to-pdf]] first; when the pack is ready, add numbers with [[page-numbers]] and shrink it for email with [[compress-file]].

## What it is

A PDF is a list of pages. Each page is a self-contained drawing with its own size and a **rotation setting**, a number that tells readers to show the page turned by 0, 90, 180 or 270 degrees. Organising a PDF means building a new list from pages of the files you already have.

The tool does exactly that. When you add files, each page joins one long row in the order the files were added. Moving a page changes its place in the row. Turning a page adds 90 degrees to its rotation setting, so four turns bring it back where it started. Deleting a page drops it from the row; the original file is not touched.

When you save, the tool copies each page in the row into a new PDF. Because the page is copied, not redrawn, the text stays sharp and searchable.

**Ranges** describe groups of pages by their place in the row: `2-4` means places 2, 3 and 4, a single number means one page, and commas separate groups. Each group becomes its own PDF when you split by ranges.

## How to use it

1. Press **Add one or more PDFs** and pick your files. You can add more later; their pages go to the end.
2. Under each page, use the left and right arrows to move it one place, the turn arrow to rotate it a quarter turn, and the cross to delete it. The label shows its place, the file it came from and its original page number.
3. Tap a page picture to select it, or use **Select all** and **Select none**. Selected pages get a coloured border.
4. Save in one of four ways: **Download all pages as one PDF**, **Download selected pages**, **Split every N pages** or **Split by ranges**. Both split buttons are called **Split to ZIP**.

## A worked example

You are putting together a job application pack from three PDFs:

- `report.pdf`: 5 pages, where page 3 is blank.
- `letter.pdf`: a 1-page cover letter.
- `cert.pdf`: 2 pages, scanned sideways.

1. Add all three. The row shows 5 + 1 + 2 = **8 pages**.
2. The cover letter is at place 6. Press its left arrow 5 times to bring it to place 1. The report now fills places 2 to 6.
3. The blank report page was its page 3, now at place 4. Press its cross. The row has **7 pages**.
4. The two certificate pages, now at places 6 and 7, lie on their side. Press the turn arrow once on each to rotate them 90 degrees.
5. Press **Download all pages as one PDF**. Because the pages came from more than one file, the saved file is called `organised-organised.pdf`, with 7 pages. (With a single file it would take that file's name, such as `report-organised.pdf`.)
6. The website you are applying through wants each document separately. In **Split by ranges** type `1,2-5,6-7` and press **Split to ZIP**. The ZIP holds 3 PDFs: the letter (1 page), the report (4 pages) and the certificate (2 pages), 1 + 4 + 2 = 7 pages in all.
7. If you instead set **Split every** to 3 pages, the 7 pages make parts of 3, 3 and 1 page, because the last part takes whatever is left.

## Where it is used

- **Job and visa applications.** Combine a cover letter, certificates and references into one file in the order asked for.
- **Accounts and expense claims.** Merge a month of receipts, or pull single invoices out of a long statement.
- **Teaching.** Split a class set of scanned worksheets into one file per student with **Split every N pages**.
- **Offices and legal work.** Rebuild a bundle with exhibits in order, then number it with the page numbers tool.

## Common mistakes

- **Typing original page numbers into ranges.** Ranges follow the places shown on screen after your moves and deletions, not the numbers in the source files. Check the number at the start of each label.
- **Selecting pages and pressing the merge button.** **Download all pages as one PDF** always saves the whole row. To save only your picks, use **Download selected pages**.
- **Turning a page the wrong way.** Each press turns it a quarter turn clockwise. If it ends up upside down, press twice more.
- **Expecting a blank page to be found for you.** The tool does not hunt for blank pages. Look along the row and delete them yourself.
- **Merging files with fillable forms.** Form boxes may not survive the copy. Fill and save forms first, for example with [[fill-pdf]].

## Questions people ask

**Can I reverse the order of a whole file?** Not in one press. Move pages one at a time with the arrows. A reversed range such as `7-5` still saves pages 5, 6 and 7 in normal order.

**Is the page quality lowered?** No. Pages are copied as they are, so text and pictures keep their original quality. Only the rotation number changes when you turn a page.

**What happens if one file will not open?** The tool says which file failed and stops reading the rest of that batch. A file locked with a password needs unlocking in the program that made it first.
