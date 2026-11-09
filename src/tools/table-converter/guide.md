---
name: Table converter (LaTeX, Markdown, HTML)
num: 804
shelf: science
section: writing-and-publishing
title: "Excel and CSV to LaTeX table converter (booktabs, siunitx), plus Markdown and HTML tables"
summary: "Paste cells from Excel, Google Sheets or LibreOffice, or open a CSV or Excel file, and get a LaTeX table (booktabs rules, caption and label, siunitx decimal alignment), a Markdown table or an HTML table. Special characters are escaped and numbers can be rounded the way you would on paper."
status: live
ads: false
order: 804
icon: table
works: offline
updated: 2026-11-09
related: [equation-converter, plot-maker, sql-playground, file-converter, bibtex-cleaner, scientific-notation-formatter, data-cleaner, science-file-converter, csv-profiler]
sources:
  - "The table reader, rounding and the LaTeX, Markdown and HTML writers are written by fibub. Rounding is checked in the tests against Python's decimal module on 3,000 random numbers; the LaTeX output is compiled with pdflatex (booktabs and siunitx packages) and the HTML and Markdown are read back with pandas and python-markdown."
  - "The example table is made up."
  - "A file you open is read on the page only. It is never uploaded or stored."
flow:
  - { icon: table, label: "Paste" }
  - { icon: sliders, label: "Options" }
  - { icon: eye, label: "Preview" }
  - { icon: copy, label: "Copy" }
---

## What it does

Typing a table into LaTeX by hand means an ampersand between every cell, a double backslash at the end of every row and a backslash before every percent sign and underscore. This page does it for you. Copy the cells in your spreadsheet, paste them here and copy the LaTeX out. It also writes **Markdown** tables (for GitHub, notebooks and many note apps) and **HTML** tables (for web pages and online submission systems).

- **Escaping.** The ten characters LaTeX treats specially (`# $ % ^ & _ { } ~ \`) are escaped, and °, µ, ± and × become commands that work in any document. In Markdown a `|` inside a cell is escaped; in HTML `&`, `<` and `>` are.
- **Numbers.** A column counts as numeric when every filled cell in it is a number (a % sign and e-notation such as `1.2e-3` are fine). Numbers in e-notation become proper powers of ten: $1.2 \times 10^{-3}$, 1.2 × 10⁻³.
- **Rounding.** Round to a number of decimal places or significant figures, digit by digit as on paper: 1.005 to two places is 1.01, not the 1.00 that many programs give. Trailing zeros that count are kept, so 2.5 to three figures is 2.50.
- **Alignment.** Text left and numbers right by default, or all left, centred or right. *On the decimal point* uses siunitx `S` columns in LaTeX (with a `table-format` worked out from your numbers) and pads with figure spaces in Markdown and HTML.

Check the numbers for gaps and odd values first in the [[csv-profiler]], and format the equations in the same paper with the [[equation-converter]].

## How to use it

1. **Paste.** Select the cells in Excel, Sheets or LibreOffice, copy, and paste into the box. Or press *Open a file* for a CSV, TSV or .xlsx file. The page says how many rows and columns it read and how they were split.
2. **Options.** Pick LaTeX, Markdown or HTML. Untick *First row is the header* if your table has no header row. Choose alignment and rounding.
3. **Preview.** Check the table drawn below the options.
4. **Copy.** Press Copy and paste into your document, or download the file. For LaTeX, the page lists the packages to add to your preamble, such as `\usepackage{booktabs, siunitx}`.

## LaTeX options

- **booktabs rules:** three clean horizontal rules (`\toprule`, `\midrule`, `\bottomrule`), the style most journals ask for. Untick for `\hline`.
- **Table float with caption:** wraps the tabular in a `table` environment with `\centering`, your `\caption` above the table and a `\label` for `\ref`.
- **True minus signs:** writes −0.4 as `$-$0.4`, so the minus is not a short hyphen.

## Worked example

Press *Use the example table*: four made-up reactions with a product mass, a yield and a rate constant. As typed, the LaTeX row for reaction D is `D, heated & 1.005 & 7.05 & $2.675 \times 10^{-5}$ \\`. Choose *Round numbers: To decimal places, 2* and *Numbers line up: On the decimal point*: the columns become `S[table-format=-2.2]`, `S[table-format=3.2]` and `S[table-format=1.2e-1]`, 1.005 becomes 1.01, 62.375 becomes 62.38, and 9.995e-4 rounds up to 1.00e-3 (not 10.00e-4).

## Tips

- Round in the table, not in the spreadsheet, so your data keeps its full precision.
- For uncertainties written as value ± error, use the scientific notation formatter, which rounds both together.
- Merged cells are not copied by spreadsheets as merged; add `\multicolumn` by hand afterwards.

## FAQ

**Is my data uploaded?** No. Everything happens on this page, and it works offline.

**Why did a column stay left-aligned?** One of its cells is not a number (such as "n/a"). Leave it empty or use "–" and the column counts as numeric again.

**Can it read decimal commas?** "1,234.5" is read as one thousand two hundred and thirty-four. Values such as "1,5" stay as text; change them to points first.
