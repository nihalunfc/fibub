---
title: "Convert files in your browser: pictures, PDF, Word, Excel, CSV and JSON"
seoTitle: "Convert files privately in your browser | fibub"
summary: "How in-browser file conversion works, which formats turn into which, what is kept and what is lost, with a worked JSON to CSV example and the common traps."
tools: [file-converter, compress-file, csv-profiler, merge-csv]
updated: 2026-11-10
sources:
  - "Page sizes for pictures placed in a PDF use the usual screen assumption of 96 pixels per inch and the PDF unit of 72 points per inch (so 1 pixel = 0.75 point)."
  - "CSV follows the common rules of RFC 4180 (quotes around values that hold commas, quotes or line breaks)."
---

Most of us meet the wrong file format at the worst moment: a form wants a PDF and you have photos, a colleague sends JSON and you want a spreadsheet, or a PDF needs to become pictures for a slide. The [[file-converter]] handles these common swaps on your own device, so the file never travels to a server. It suits office staff, students, small businesses and anyone handling private papers. When the result is too big for an email, shrink it with the [[compress-file|file compressor]], and before you share a converted table, look it over with the [[csv-profiler]].

## What it is

Every file format is a way of packing the same kind of content. A JPG and a PNG both hold a grid of coloured dots. A CSV, an Excel sheet and a JSON list can all hold rows of values. Converting means opening the file, reading the content out of it, and packing it again in the new format.

Modern browsers can do this themselves. They already know how to draw pictures, and small code libraries loaded with the page can read PDFs, Word and Excel files. So the work happens in the tab you have open, and the page keeps working with no internet once it has loaded.

The tool sorts files into five groups and offers only the targets that make sense for each:

- **Pictures** (JPG, PNG, WebP, AVIF, GIF, BMP) become another picture format your browser can write, or a PDF.
- **PDF** becomes JPG or PNG pictures (one per page), Markdown or plain text.
- **Word (.docx)** becomes a web page (HTML), Markdown or plain text.
- **Excel (.xlsx)** becomes CSV or JSON.
- **CSV** and **JSON** become each other or an Excel file.

When a picture goes into a PDF, each picture gets its own page sized to it. The page size in points is the pixel size × 0.75, because a screen is taken as 96 pixels per inch and a PDF counts 72 points per inch.

## How to use it

1. Press **Choose a file**, or drag one onto the box. You can pick several pictures together, but other files go one at a time.
2. Check the line that shows the file name and size. The size limit for your device is shown in the box.
3. Under **Convert to**, pick the format you want. The first one is already chosen.
4. Press **Convert**. A short status line shows progress, such as which page is being drawn.
5. Press the **Download** button. The result line gives the new file's name and size, and a note on what was kept.
6. Press **Convert another file** to start again, or **Choose other files** before converting to change your mind.

## A worked example

A shop exports its customer list as JSON:

```json
[
  {"name": "Asha", "phone": "0412 555 019", "address": {"city": "Pune", "pin": "411001"}, "orders": 3},
  {"name": "Ben", "address": {"city": "Leeds"}, "orders": 7}
]
```

Choose the file, pick **CSV**, and press Convert. The download holds three lines:

```
name,phone,address.city,address.pin,orders
Asha,0412 555 019,Pune,411001,3
Ben,,Leeds,,7
```

Three things happened. The nested address was spread into two columns, `address.city` and `address.pin`. Ben had no phone and no PIN, so those cells are empty rather than missing. And every column that appears in any record got its own header, so 2 records with up to 5 fields gave a table 5 columns wide.

A second example, with pictures: three phone photos of 1,200 × 1,600 pixels turned into one PDF give three pages of 900 × 1,200 points each (1,200 × 0.75 = 900; 1,600 × 0.75 = 1,200). That is 12.5 × 16.7 inches, so print with "fit to page".

## Where it is used

- **Forms and applications**: many upload boxes accept only PDF. Photos of a signed page or receipts become one PDF with a page each.
- **Slides and social posts**: a PDF chart or poster becomes PNG pictures that drop straight into a presentation.
- **Data work**: an API gives JSON, but a manager wants Excel. Or a sheet with several tabs needs to become CSV files for a database; each tab turns into its own CSV in one ZIP.
- **Writing and AI tools**: a Word file or PDF turned into Markdown keeps headings and lists in a light form that note apps and chat tools read well.
- **Websites**: WebP and AVIF are often much smaller than PNG for the same picture.

## Common mistakes

1. **Expecting a scanned PDF to give text.** A scan is a picture of a page, with no letters inside. The tool says so. Convert it to JPG or PNG instead.
2. **Losing transparency.** JPG cannot hold see-through areas, so a logo with a clear background gets a white one. Pick PNG or WebP to keep it.
3. **Expecting formulas to survive.** Excel to CSV keeps the values you see, not the formulas, colours or charts behind them. Keep the original workbook.
4. **Mixing file kinds in one go.** Several pictures together are fine, but a PDF and a Word file together are not. Convert them one after the other.
5. **Expecting the same layout from text formats.** Markdown, HTML and text keep the words, headings and lists, not columns, pictures or page design.

## Questions people ask

**Why does a phone number keep its leading zero when I go from CSV to Excel?** The tool stores values that start with 0 as text, so numbers like `0412 555 019` or postcodes do not lose the zero.

**Can I join several CSV files into one?** Not here. Use [[merge-csv]] for that, then convert the joined file if you need Excel.

**What happens with a 20-page PDF to JPG?** You get one ZIP holding 20 pictures, numbered by page, drawn at 150 dots per inch.

**Why is my HEIC photo not accepted?** Many browsers cannot open HEIC files. Export the photo as JPG on your phone or computer first.
