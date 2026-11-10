---
name: Statement to CSV
num: 1752
shelf: documents
section: convert-files
title: "Statement to CSV: turn a PDF bank statement into a spreadsheet"
summary: "Turn a PDF bank or card statement into a table you can open in Excel or Google Sheets. It runs in your browser, so your statement is never uploaded."
status: live
ads: false
order: 1752
icon: table
works: offline
updated: 2026-11-10
related: [file-converter, redact-pdf, statement-analyser]
sources:
  - "Reads the text and positions already inside the PDF with pdf.js (Apache 2.0). It does not read pictures, so scanned statements need a CSV export from your bank instead."
flow:
  - { icon: file, label: "Open PDF" }
  - { icon: table, label: "Check table" }
  - { icon: download, label: "Get CSV" }
---

## What it does

Bank statements are the one document everyone has and nobody can use. The numbers are on the page, but you cannot sort them, add them up or paste them into a budget. This tool reads the PDF, finds the lines of the statement and the columns they sit in, and gives you a table. Download it as a CSV that opens in Excel, Numbers and Google Sheets.

Your statement is read on your own device. It is not uploaded, and nothing is kept after you close the page. Because it opens bank data, the page carries no ads. To share a statement safely, black out names and account numbers first with [[redact-pdf]]. Once you have the CSV, the [[statement-analyser]] sorts the spending into categories, and [[file-converter]] changes other file types.

## How to use it

1. Choose your statement PDF. It must be a statement your bank made as a PDF, not a photo or scan.
2. Look at the table. Each number in **Column starts** is where a column begins on the page. If two columns have run together, add a number between them; if one column was split in two, delete a number.
3. Tick or untick the options until the table looks right, then press **Download CSV**, or **Copy for a spreadsheet** to paste straight into a sheet.

## What each setting does

- **Column starts**: the distance in points (about 1/72 inch) from the left edge of the page to where each column begins. The tool guesses them for you.
- **Keep only lines that have a date**: drops opening balances, page headings and notes, so only transactions stay.
- **Join a description that wraps onto the next line**: when a long description continues on a second line, it is joined to the line above.
- **Tidy dates and amounts**: writes dates as 2026-01-31 and amounts as plain numbers such as -1234.56, which sorts and adds up correctly.
- **Put the first kept line as column headings**: only changes how the table is shown.

## Worked example

A statement has the columns Date, Description, Debit, Credit and Balance. The tool finds five column starts and four transactions: Coffee Corner 4.50 out, Salary 2,000.00 in, Rent 950.00 out, and a Grocery Mart 82.15 out. You get four rows plus a heading row, ready for a spreadsheet.

## FAQs

**Why is my table empty or messy?** Some banks draw the page in unusual ways. Try **Find columns again**, then adjust the column numbers by hand.

**Does it work on scanned statements?** No. A scan is a picture and has no text to read. Ask your bank for the digital PDF or a CSV export.

**Is my statement sent anywhere?** No. It is processed in your browser and works offline once the page has loaded.

**What about a password-protected PDF?** Remove the password in the bank's own app first; this tool cannot open locked files.
