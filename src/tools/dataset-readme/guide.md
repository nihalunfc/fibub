---
name: Dataset README builder
num: 819
shelf: science
code: T555
section: data-management
title: "Dataset README builder: write a FAIR README for research data, with licence, files and variables, as Markdown or text"
summary: "Fill in a form and get a README for your dataset: authors, description, licence, citation, a file list (pick the files to add their names and sizes), methods and a table of variables. Live preview, a checklist of what is missing, and Markdown or plain-text downloads."
status: live
ads: false
order: 819
icon: book
works: offline
updated: 2026-11-09
related: [metadata-builder, checksum-checker, science-file-converter, data-dictionary, data-management-plan, author-list-formatter, bibtex-cleaner]
sources:
  - "The section order follows the widely used readme-style metadata layout for research data (general information, sharing and access, data and file overview, methods, data-specific information), as recommended by university research data services. Wording is fibub's own."
  - "Licences are named by their SPDX identifiers; the citation follows the order DataCite recommends (creator, year, title, version, publisher, identifier)."
  - "Markdown output checked in the tests with markdown-it-py (CommonMark with tables)."
  - "The example is made up. Picked files give only their names and sizes; they are not opened, uploaded or stored."
flow:
  - { icon: pencil, label: "Fill in" }
  - { icon: file, label: "Files" }
  - { icon: eye, label: "Preview" }
  - { icon: download, label: "README" }
---

## What it does

A README is the first file people open in a dataset. A good one lets someone who has never met you understand the data, use it correctly and cite it, years from now. That is what the **FAIR** principles ask for: data that are **F**indable, **A**ccessible, **I**nteroperable and **R**eusable. This page builds that README from a form:

- **General information**: title, authors with ORCID iDs and affiliations, a contact, a description, when and where the data were collected, keywords and funding.
- **Sharing and access**: a licence chosen from the common open licences (with a one-line explanation of each), restrictions, DOI, version and a recommended citation written for you.
- **Files**: a table of file names, sizes and descriptions. Pick the files from your device to add their names and sizes; only those two facts are read.
- **Methods**: how the data were collected and processed, instruments and software, and quality checks.
- **Variables**: a table of column names, descriptions, units and missing-value codes.

Make the machine-readable record with the [[metadata-builder]], and build the variables table with the [[data-dictionary|data dictionary generator]].

## How to use it

1. Fill in what you can. Every part is optional, and empty parts are left out of the README.
2. Authors go one per line as `Name; ORCID iD; affiliation; email`.
3. Under **Files**, press **Add files from your device** or **Add a folder**. Each file becomes a line `name | size | ` with room for a description after the last bar. Picking again keeps the descriptions you wrote.
4. Variables go one per line as `name | description | unit | missing value code`.
5. Watch the **Checklist**: it counts the 12 parts a reader most needs (title, authors, ORCID iDs, contact, description, dates, licence, identifier or citation, file list, methods, variables and missing-value codes) and lists mistakes such as an ORCID iD with a wrong check digit, a date that is not YYYY-MM-DD, or an end date before the start.
6. Switch between **Preview**, **Markdown** and **Plain text**, then download `README.md` or `README.txt`, or copy it.

## Worked example

The page opens with a made-up example: three temperature loggers in a stream. The checklist reads **11 of 12 parts filled in**: the second author has no ORCID iD. The file table lists `site-a.csv` at 41.3 kB (41,250 bytes), and below it "3 files, 122 kB in all". With no citation typed, the page writes one from the fields:

> Rivera, A. & Okafor, C. (2026). Stream temperature at three sites, spring 2026 (example) (Version 1.0) [Data set]. Example Data Repository. https://doi.org/10.5555/example.2026

Type a wrong last digit into Ana Rivera's ORCID iD, and the checklist adds "1 to fix" with the reason.

## Tips

- Put the README next to your data files, and send it with every copy. Markdown shows as formatted text on GitHub, GitLab, Zenodo and many repositories; plain text opens everywhere.
- Name the unit of every numeric column, and say what an empty cell or a code such as -999 means.
- Pair it with a checksum manifest (from the checksum checker) and a metadata record (from the metadata builder) when you deposit data.

## FAQ

**Is anything uploaded or saved?** No. The form stays on this page, and picked files are not opened: only their names and sizes are read. Nothing is kept after you close the page, so download the README first.

**Which licence should I choose?** Many funders and repositories ask for CC BY 4.0 or CC0 for research data. Each choice shows one line on what it allows. When in doubt, ask your repository or library.

**Can I edit the README afterwards?** Yes, it is a plain text file. Open it in any text editor.
