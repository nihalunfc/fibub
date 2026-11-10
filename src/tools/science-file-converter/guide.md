---
name: Science file converter
num: 815
shelf: science
code: T551
section: data-management
title: "NetCDF and FITS to CSV converter: open .nc and .fits files, list variables and export to CSV or JSON"
summary: "Open a NetCDF classic or 64-bit offset file, a FITS image or table, or a CSV or Excel sheet, see every dimension, variable and attribute, and export one variable or table to CSV or JSON. Scale factors and fill values are handled. The file stays in your browser."
status: live
ads: false
order: 815
icon: convert
works: offline
updated: 2026-11-09
related: [fits-viewer, data-cleaner, sql-playground, plot-maker, data-dictionary, metadata-builder, checksum-checker, dataset-readme, csv-profiler]
sources:
  - "NetCDF reading follows Unidata's NetCDF Classic Format Specification (CDF-1, CDF-2 and CDF-5); FITS reading follows the FITS Standard 4.0 (IAU FITS Working Group). The readers are written by fibub."
  - "Checked in the tests against files written and read back by scipy.io.netcdf_file, netCDF4-python and astropy.io.fits."
  - "The example file is made up by the page (a small grid of invented temperatures), not real measurements."
  - "A file you open is read on the page only. It is never uploaded or stored."
flow:
  - { icon: file, label: "Open file" }
  - { icon: table, label: "Variables" }
  - { icon: download, label: "CSV or JSON" }
---

## What it does

Climate models, ocean floats, satellites and telescopes save their data in formats made for science: **NetCDF** (`.nc`) and **FITS** (`.fits`). Spreadsheets cannot open them. This page reads them in your browser, shows what is inside, and turns one variable or table into a CSV file you can open in Excel, R or Python, or into JSON.

- **NetCDF classic, 64-bit offset and 64-bit data** (CDF-1, CDF-2, CDF-5): every dimension (with the unlimited "record" dimension marked), every variable with its type and shape, and all global and variable attributes.
- **FITS**: every HDU with data. Images of any number of axes, binary tables (including vector columns, bit columns, complex numbers and variable-length arrays) and ASCII tables, with the full header.
- **CSV, TSV and Excel (.xlsx)**: each sheet as a table, with a guessed type for every column, so you can turn it into JSON.

**Not supported:** HDF5 and NetCDF-4 files (NetCDF-4 is HDF5 inside), and Parquet. Reading them needs a large library that this page does not load. The page recognises these files and tells you how to convert them: `nccopy -k classic in.nc out.nc` for NetCDF-4, or `pandas.read_parquet(...).to_csv(...)` for Parquet.

Describe each column of the converted table with the [[data-dictionary|data dictionary generator]], and fingerprint the files before you share them with the [[checksum-checker]].

## How to use it

1. **Open a file**, or drop it on the page. Gzipped files (`.fits.gz`, `.nc.gz`) are unzipped for you. Files up to 500 MB.
2. Read **What is inside**: the format, the dimensions, the list of variables (or HDUs, or sheets) with their sizes, and the global attributes.
3. Under **Export**, pick a variable. Its attributes and a preview of the CSV appear.
4. Choose the **CSV layout**:
   - **One row per value** has one column per dimension and one for the value, the "long" or "tidy" layout most analysis tools want. Where the file has a coordinate variable (a variable named after its dimension, such as `lat`), its values are used instead of 0, 1, 2.
   - **Grid** is for variables with two dimensions: the first dimension down the side and the second across the top, like a map.
5. **Unpack and mark missing values** (on by default) applies `scale_factor` and `add_offset`, and leaves `_FillValue` and `missing_value` cells empty. For FITS it applies `BSCALE`/`BZERO`, `TSCALn`/`TZEROn` and blanks `BLANK`/`TNULLn`. Untick it to get the numbers exactly as stored.
6. **Download CSV** or **Download JSON**. The JSON keeps the shape (nested arrays), the attributes and nulls for missing values. **Download the description** saves just the structure (dimensions, variables, attributes) as JSON, handy for a data management plan or a README.

## Worked example

Press **Use the example NetCDF**. It is a made-up file of 3 days of air temperature on a grid of 4 latitudes by 5 longitudes. The page shows 4 dimensions (time is unlimited, with 3 records), 5 variables and the global attributes `title`, `Conventions` and `source`.

The `temperature` variable is stored as short integers with `scale_factor` 0.01 and `add_offset` 15. In the preview, the second row reads time 0, lat 40, lon −77.5 and **20.75**: the stored number is 575, and 575 × 0.01 + 15 = 20.75. One value is the fill value −32767; it shows as an empty cell (time 0, lat 42.5, lon −75). Untick **Unpack** and the same cells show 575 and −32767. The CSV has 60 rows (3 × 4 × 5).

## Tips

- Text variables in NetCDF are stored as characters with a string-length dimension; the page joins them into strings.
- 64-bit integers keep every digit in CSV. In JSON, integers too large for JavaScript to hold exactly are written as text.
- FITS pixels are numbered from 1, as FITS does, with x along NAXIS1. Row y = 1 (the bottom of the image in most viewers) comes first.
- Exports are limited to 5 million values at a time to keep your browser responsive. Very large variables have no preview but can still be downloaded.

## FAQ

**Is my file uploaded?** No. It is read by code on this page and never leaves your device. The page works offline once open.

**Why not NetCDF-4?** NetCDF-4 files are HDF5 files, a complex format whose readers are megabytes of code. Many NetCDF-4 files can be converted to classic with `nccopy -k classic` (or `-k 64-bit-offset` for large ones) if they use no NetCDF-4-only features such as groups or strings.

**Are the numbers right?** The readers are checked against files written by scipy, netCDF4-python and astropy, value by value, including packed integers, fill values, record variables, unsigned and 64-bit types, and FITS tables.
