---
name: Mail merge
num: 1710
shelf: documents
code: T744
section: templates
title: "Mail merge: fill a Word letter or email from a CSV list, one file per person"
summary: "Fill a Word template or a text message from a CSV list and get one finished letter per row in a ZIP. Preview the first row first. Your list never leaves your device."
status: live
ads: false
order: 1710
icon: table
works: offline
updated: 2026-11-10
related: [invoice-maker, file-converter]
sources:
  - "Word files are read and written as standard .docx (Office Open XML) with the fflate library. CSV follows the usual comma, semicolon or tab separated format."
flow:
  - { icon: table, label: "Your list" }
  - { icon: file, label: "Template" }
  - { icon: download, label: "ZIP" }
---

## What it does

Mail merge turns one template and a list of people into many finished letters. Write your letter once in Word and put {{Name}}, {{Address}} or any column heading in double curly brackets where the values go. Add your list as a CSV file and you get one Word file per row, named the way you choose, in a single ZIP.

It copes with Word's habit of splitting a placeholder into several pieces of text, and keeps the fonts and bold of your template. A second mode fills a plain text message or email body, with a subject line, and can open each one in your email app. Your list and letters stay in your browser, and the invoices you send can come from [[invoice-maker]]. If your list is in Excel, convert it first with [[file-converter]] or use Save as CSV.

## How to use it

1. Choose **Word letter** or **Text or email**.
2. Add your CSV (or paste the rows). The first line holds the column headings.
3. Add your Word template, or type your message. Placeholders written as {{Heading}} show as green chips when the list has that column, and red when it does not.
4. Look at the preview, flip through rows with the arrows, and choose which column names the files.
5. Press **Download all (ZIP)**, or **Download this one**.

## What each setting does

- **Name each file after**: a column such as Name or Invoice. Clashing names get -2, -3. Blank names become merged-001 and so on.
- **Email address column**: used by "Open in my email app", which fills a new message with the address, subject and body.
- **Case**: {{name}} and {{Name}} both work.
- A placeholder with no matching column is left as written, and a warning tells you which.

## Worked example

List: `Name,City` then `Asha,Pune` and `Ben,Leeds`. Template line: `Dear {{Name}} of {{City}},`. The ZIP holds Asha.docx saying "Dear Asha of Pune," and Ben.docx saying "Dear Ben of Leeds,".

## FAQs

**Can I use an Excel file?** Save it as CSV first (File, Save as, CSV). Commas, semicolons and tabs are all understood.

**How many rows?** Up to 1,000 at a time.

**Does it keep my data?** No. Close the page and everything is gone.
