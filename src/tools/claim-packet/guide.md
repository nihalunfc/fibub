---
name: Claim packet builder
num: 1972
shelf: money
code: T847
section: medical-bills
title: "Health insurance claim packet: receipts into one PDF"
summary: "Drop your medical receipts, fill in who, what and how much, and get one PDF with a cover sheet, a summary table and every receipt, ready to upload to your insurer."
status: live
ads: false
order: 1972
icon: file
works: offline
updated: 2026-11-10
related: [medical-bill-checker, medical-expense-tax, records-organiser]
sources:
  - "Totals are added up from the amounts you type. Layout and wording are fibub's own. Nothing is looked up and nothing is sent anywhere."
flow:
  - { icon: file, label: "Add receipts" }
  - { icon: pencil, label: "Fill amounts" }
  - { icon: check, label: "Check total" }
  - { icon: download, label: "Download" }
---

## What it does

Claiming back medical costs usually means a pile of receipts and a form that asks for totals by person. This tool puts them together: add your receipts, fill in a few fields for each, and it makes one PDF with a cover sheet, a summary table by patient and service, and every receipt behind it. PDF receipts are copied in; photos are placed on their own pages. Everything runs in your browser and nothing is uploaded. Open the result yourself, then upload it to your insurer's own site or app.

Before you start, you may want to check a hospital bill with the [[medical-bill-checker]], and afterwards the same list helps with the [[medical-expense-tax|medical expense tax helper]].

## How to use it

1. Add receipts as PDF, JPG or PNG. You can add more later.
2. For each receipt, check the date and fill in provider, patient, service, the amount you paid and any amount already claimed.
3. Look at the summary and the amount to claim.
4. Type the plan member, policy number and insurer for the cover sheet, then download the PDF. A CSV of the table is there too.

## What each option does

- **Dates are written**: how a date such as 03/04/2026 is read when guessed from a PDF.
- **Currency**: only changes how amounts are shown.
- **Already claimed**: amounts an insurer or plan has already paid, subtracted to give the amount to claim.

Scanned paper and photos have no text layer. Tick **Read dates from photos and scans** and the tool reads the words on your device (the reader, about 4 MB, loads once) to guess the date; otherwise type it.

## Worked example

Two receipts for the same patient: a dentist visit of 120.00 and a pharmacy purchase of 45.50 with 10.00 already claimed. The summary shows two services, paid 165.50, claimed 10.00, and 155.50 to claim. With two photo receipts the PDF has a cover page, a summary page and two receipt pages.

## FAQs

**Does fibub send the packet to my insurer?** No. You upload the file yourself.

**Are my receipts or the policy number stored?** No. They are only in the page until you close it.

**Does it say what my plan covers?** No. Your insurer decides that.

This is not tax, billing or legal advice.
