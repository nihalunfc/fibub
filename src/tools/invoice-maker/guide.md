---
name: Invoice maker
num: 1711
shelf: documents
code: T745
section: templates
title: "Invoice maker: free invoice, quote, receipt and rent receipt PDF with GST or VAT"
summary: "Make an invoice, quote, receipt or rent receipt with your logo, tax lines (GST, HST, VAT, CGST/SGST/IGST) and the total in words. Download a PDF or print it. Nothing is uploaded."
status: live
ads: false
order: 1711
icon: pencil
works: offline
updated: 2026-11-10
related: [number-to-words, mail-merge, break-even]
sources:
  - "India GST: the usual split is CGST + SGST for a customer in your own state and IGST for another state, each at the rate you enter. Rent receipts follow the HRA practice of employers in India. Rates and rules change, so check the official source (cbic-gst.gov.in, incometax.gov.in) or your accountant."
flow:
  - { icon: pencil, label: "Fill in" }
  - { icon: percent, label: "Add tax" }
  - { icon: download, label: "Download" }
---

## What it does

Pick what you need: an invoice, a quote, a receipt, or rent receipts. Fill in who it is from and to, list the items, choose how tax is shown, and the page builds a clean document as you type. Download it as a PDF or print it.

Everything runs on your device. Your customers' details and your items are never uploaded or kept. You can choose to keep your own details (name, address, tax number, logo) so the next invoice starts filled in. The total is also written in words, the same way as in [[number-to-words]], and the invoice sums can be checked against a plan in [[break-even]] or a bulk run in [[mail-merge]].

## How to use it

1. Choose Invoice, Quote, Receipt or Rent receipt at the top.
2. Fill in your details and the customer's. Add a logo if you like (PNG or JPG).
3. Add items with a quantity and a price each. Add as many as you need.
4. Choose a tax style and a discount if any, then check the preview.
5. Press **Download PDF** or **Print**.

## What each setting does

- **No tax**: totals are the sum of the items.
- **One tax**: a single named tax (GST, HST, VAT, sales tax) at a usual rate. Each item can have its own rate; empty means the usual one. Items with different rates get separate tax lines.
- **India GST**: splits each rate into CGST and SGST halves, or shows IGST if the customer is in another state. Items can carry an HSN or SAC code, and it is a "Tax invoice" when your GSTIN is filled in.
- **Discount**: a percent or a fixed amount taken off before tax.
- **Round the total**: rounds to a whole number and shows the round-off line.
- **Rent receipt**: enter the monthly rent and a range of months. You get one receipt per month, three to a page, with the amount in words. Landlord PAN is optional.

## Worked example

Two hours of design at 1,500 and one item at 499.99, in rupees with India GST at 18% on the first and 5% on the second and a 10% discount: subtotal Rs. 3,499.99, discount Rs. 350.00, CGST and SGST 9% on 2,700.00 are Rs. 243.00 each, CGST and SGST 2.5% on 449.99 are Rs. 11.25 each, total Rs. 3,658.49.

## FAQs

**Is it legal to use as a tax invoice?** It shows the usual fields, but rules differ by country and business. Check with your tax office or accountant.

**Why does the PDF say "Rs." and not the rupee sign?** PDF standard fonts have no rupee sign, so the page uses "Rs.". Other currencies use their usual symbol or code.

**Is anything saved?** Only if you tick "Remember my details", and then only your own details, on this device. Press Clear to remove them.
