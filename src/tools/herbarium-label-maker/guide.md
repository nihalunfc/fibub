---
name: Herbarium label maker
num: 326
shelf: science
section: botany-and-plant-science
title: "Herbarium label maker: printable plant specimen labels from Darwin Core fields or a CSV, as PDF"
summary: "Make herbarium specimen labels in your browser. Fill in a Darwin Core form or paste a CSV of many specimens, choose the heading, date and coordinate style, and print several labels per page or download a PDF and a clean Darwin Core CSV."
status: live
ads: false
order: 326
icon: file
works: offline
updated: 2026-11-09
related: [field-sampling-planner, plate-layout, data-cleaner, qr-code-generator, observing-log]
sources:
  - "Field names: Darwin Core terms, Biodiversity Information Standards (TDWG), dwc.tdwg.org/terms (CC BY 4.0). Term names only."
  - "Label layout follows common herbarium practice (heading, family, name in italics with authors in roman, locality, coordinates, elevation, habitat, collector and number, date, determiner). Written by fibub."
  - "Checked in the tests against Python's standard library: CSV written by csv.DictWriter is read correctly here and our CSV is read back by csv.DictReader (quotes, commas and line breaks inside fields); dates checked with datetime; degrees-minutes-seconds checked against an independent conversion."
  - "The example specimens are made up."
flow:
  - { icon: pencil, label: "Specimens" }
  - { icon: sliders, label: "Style" }
  - { icon: file, label: "Labels" }
  - { icon: download, label: "PDF, CSV" }
---

## What it does

Every pressed plant in a herbarium carries a **label** with what it is, where and when it was collected, and by whom. This tool turns specimen records into neat, consistent labels, several to a page, ready to print on archival paper. The records use **Darwin Core**, the standard field names used by GBIF and most herbarium databases, so the same data can go straight into a collection database.

## How to use it

1. **Add specimens.** Either fill in the form and press **Add to the list**, or paste a table into the Specimens box, or open a CSV, TSV, TXT or Excel file. The first row names the columns with Darwin Core terms such as scientificName, recordedBy, recordNumber, eventDate, locality, decimalLatitude and decimalLongitude. A dwc: prefix, any capitals and common names (collector, date, latitude, elevation) are understood. Other columns are ignored.
2. **Check the warnings.** The tool flags a missing name, latitudes outside −90 to 90, longitudes outside −180 to 180, dates that are not YYYY-MM-DD or do not exist, and elevations that are not numbers.
3. **Choose the style** and look at the preview.
4. **Download PDF**, **Print**, or **Download CSV** to keep a clean Darwin Core table of your specimens.

## Options

- **Heading**: the top line. Use any field in braces, such as `Plants of {stateProvince}, {country}` or `{institutionCode} Herbarium`. Empty fields are left out with their commas.
- **Dates**: 14 May 2026, short months, the herbarium style 14.v.2026 with a Roman-numeral month (which cannot be misread as day/month or month/day), or ISO 2026-05-14.
- **Coordinates**: degrees-minutes-seconds (45°24'36.0"N), decimal degrees, or both. The uncertainty in metres is added when given.
- **Elevation**: metres, or metres with feet.
- **Paper**, **labels per page** (1, 2, 4, 6 or 8 in two columns) and **copies of each** specimen (for duplicates sent to other herbaria).
- **Cut lines**: dashed lines around each label for trimming.

Scientific names are set in bold italics, with rank words (subsp., var., f., cf.) and the authors in roman, as botanical convention asks. When a label has too much text for its space, the text shrinks to fit.

## Worked example

The three made-up specimens make **3 labels on 1 page** at four per A4 page. The second label reads, from the top: PLANTS OF ONTARIO, CANADA; CYPERACEAE; ***Carex flava*** subsp. ***jemtlandica*** (Palmgr.) Palmgr.; "Fen margin near the north shore, Ontario, Canada."; 45°23'16.8"N 78°09'15.8"W ±15 m. Elev. 395 m.; the habitat and remarks; "A. Example; B. Sample 102   30.vi.2026"; "Det. B. Sample, 2.vii.2026"; and XYZ 000124 at the bottom right.

## Tips

- Print on acid-free, archival paper with a laser printer; inkjet ink can run when wet.
- The PDF uses the standard Times fonts, which cover Western European letters (é, ñ, ü, ×, °). For other scripts use **Print**, which uses your computer's fonts. The page tells you if any character was left out of the PDF.
- Keep your CSV: it is your specimen database in a standard form.

## FAQs

**Is anything saved?** No. Nothing is stored in your browser or sent anywhere, so download the CSV before closing the page.

**Can it make barcodes?** Not yet; the catalogue number is printed as text.

**Is my data uploaded?** No. Everything runs in your browser.
