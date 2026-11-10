---
title: "How to do a mail merge from a CSV (one letter per person)"
summary: "Write one Word letter with {{placeholders}}, add a CSV list, and get a finished letter for every row in a ZIP. How file names are chosen, with a worked example."
tools: [mail-merge, merge-csv, file-converter, invoice-maker]
updated: 2026-11-10
sources:
  - "Placeholder filling, file naming (-2 for repeats, merged-001 for blanks) and the 1,000-row limit from fibub's own src/lib/docs/mailmerge.ts and src/tools/mail-merge/Tool.astro; the example output was produced with that code."
  - "The training list in the example is made up."
---

A mail merge fills one template with each row of a list, so a list of 40 people becomes 40 personal letters. The [[mail-merge]] tool does it in your browser: add a CSV list and a Word template with `{{Heading}}` placeholders, check the preview, and download every finished letter in one ZIP.

## What you need

- **A list as CSV**, with headings in the first line and one row per person. Commas, semicolons or tabs between values all work. From Excel or Google Sheets, use Save as CSV, or convert the workbook with the [[file-converter]]. If the list is spread across several exports, join them first with [[merge-csv]].
- **A Word template (.docx)** for letters, or just the text for an email.
- **Placeholders that match your headings.** If the list has a column called `Course`, the template says `{{Course}}` where the course name should go.

## Step by step

The rule behind every mail merge is short:

**number of finished files = number of rows in the list** (up to 1,000 at a time)

**each `{{Heading}}` → the value in that column for the current row**

Capital letters in a placeholder do not matter, so `{{name}}` and `{{Name}}` both pick up a column called Name. A placeholder with no matching column is left exactly as typed.

File names come from a column you choose. Letters and numbers are kept, spaces become dashes, and a repeated name gets `-2`, `-3` added. A row with an empty name is called `merged-` plus its row number with three digits.

With the tool:

1. Pick **Word letter (.docx)** or **Text or email** at the top.
2. Under **1. Your list**, choose the CSV file, or open **Or paste the rows here** and paste them. A status line lists the row count and the column names it found.
3. Under **2. Your template**, choose your .docx. Need a starting point? Press **Download a sample template**. In text mode, type an optional subject and the message instead.
4. Look at the chips under the template. Each placeholder shows as a chip; a red one has no matching column in your list.
5. Under **3. Check and download**, choose **Name each file after**. Step through the rows with the arrows and read each filled letter.
6. Press **Download all (ZIP)**, or **Download this one** for just the row on screen.

In text mode you also get **One combined text file**, **Copy this message** and **Open in my email app**, which starts a new email to the address in the column you pick under **Email address column**.

## A worked example

A training coordinator has four bookings in `bookings.csv`:

| Name | Course | Date | Email |
|---|---|---|---|
| Asha Rao | First aid | 14 March | a@example.com |
| Ben Ode | Fire safety | 21 March | |
| Asha Rao | Fire safety | 21 March | |
| *(blank)* | First aid | 14 March | |

The template line reads:

`Dear {{name}}, your place on {{Course}} on {{Date}} is booked. {{Room}}`

After adding both, the status says 4 rows, columns: Name, Course, Date, Email. The chips show name, Course and Date as matched, and Room in red. Below the preview, a warning says there is no column named "Room", so it is left as written.

The first row's preview reads:

"Dear Asha Rao, your place on First aid on 14 March is booked. {{Room}}"

That stray `{{Room}}` would go out on every letter. Either add a Room column to the CSV, or delete the placeholder from the template, then load it again.

With **Name each file after** set to Name, the ZIP holds 4 files, one per row:

- `Asha-Rao.docx`
- `Ben-Ode.docx`
- `Asha-Rao-2.docx` (the same name again, so a number is added)
- `merged-004.docx` (row 4 has no name)

The blank row also says "Dear ," in its letter. Fill in the name or delete that row before you send anything.

## Check your answer

- **Files equal rows.** The ZIP should hold as many files as the status line counted rows. A list longer than 1,000 rows is cut there, and the status says so.
- **No red chips.** A red chip means some text in braces will appear in every letter.
- **Step through a few rows**, including the first and the last. Look for blank values and odd spacing.

## Questions people ask

**My list is in Excel. Do I have to retype it?** No. Save it as CSV from Excel, or turn the .xlsx into CSV with the [[file-converter]], then add that file.

**Can I send the emails straight from the tool?** It opens each one in your own email app, one at a time, with the address, subject and message filled in. You press send there. Nothing is sent from the page.

**Can I merge invoices instead of letters?** A template can hold any fields, such as amount and due date. For a single, fully laid-out invoice, the [[invoice-maker]] is quicker.
