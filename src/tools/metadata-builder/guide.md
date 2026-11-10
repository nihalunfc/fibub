---
name: Metadata builder
num: 816
shelf: science
code: T552
section: data-management
title: "Dataset metadata builder: DataCite, Dublin Core and Darwin Core records with validation, as XML, JSON or CSV"
summary: "Fill in a form for DataCite 4.5, Dublin Core or a Darwin Core occurrence, and get a checked record: required fields, ISO 8601 dates, ORCID iD check digits, DOI form and coordinate ranges. Download it as XML, JSON or CSV."
status: live
ads: false
order: 816
icon: pencil
works: offline
updated: 2026-11-09
related: [science-file-converter, checksum-checker, biodiversity-indices, dataset-readme, data-dictionary, data-management-plan, author-list-formatter]
sources:
  - "Term names, namespaces and controlled lists are those of the standards: the DCMI Metadata Element Set 1.1 (Dublin Core Metadata Initiative), the DataCite Metadata Schema 4.5 (DataCite) and the Darwin Core terms (Biodiversity Information Standards, TDWG). Help lines are fibub's own words."
  - "ORCID iD check digits follow ISO 7064 MOD 11-2 as ORCID documents it; dates follow ISO 8601."
  - "Checked in the tests against the DataCite 4.5 JSON schema and XML writer of the datacite Python package, python-dwca-reader's Darwin Core term list, and Python's date parser."
  - "The examples are made up. 0000-0002-1825-0097 is ORCID's own test record and 10.5555 is a test DOI prefix."
flow:
  - { icon: flag, label: "Standard" }
  - { icon: pencil, label: "Fill in" }
  - { icon: check, label: "Check" }
  - { icon: download, label: "XML or CSV" }
---

## What it does

Repositories, data journals and biodiversity portals ask for metadata in a standard form, so that data can be found, cited and combined. This page gives you a form for three of the most used standards, checks what you type, and writes the record for you:

- **DataCite** (Metadata Schema 4.5): what you need for a dataset DOI. The six mandatory properties (Identifier, Creator, Title, Publisher, PublicationYear, ResourceType), the recommended ones (Subject, Contributor, Date, RelatedIdentifier, Description, GeoLocation) and some optional ones (Language, Version, Rights, Format, Size, FundingReference).
- **Dublin Core**: the 15 elements (title, creator, subject, description, publisher, contributor, date, type, format, identifier, source, language, relation, coverage, rights) as an `oai_dc` record.
- **Darwin Core**: one occurrence record (a species seen or collected at a place and time) with the terms biodiversity portals expect: occurrenceID, basisOfRecord, scientificName, eventDate, coordinates and their datum and uncertainty, countryCode and more.

Write the human-readable side with the [[dataset-readme|dataset README builder]], and list your columns and units with the [[data-dictionary|data dictionary generator]].

## How to use it

1. Pick the **standard**. Each field shows its standard term name, whether it is required, recommended or optional, and one line on what it means.
2. Type in the fields. Lists such as creators go one per line. For DataCite creators write `Family, Given; ORCID iD; Affiliation` (a line without a comma is an organisation). Dates go as `Type: date`, such as `Collected: 2026-03-01/2026-05-31`. Related identifiers go as `IsSupplementTo DOI 10.5555/12345678`.
3. The **Check** card updates as you type. Errors must be fixed; warnings are worth a look. Tap a message to jump to its field. The checks are:
   - required fields are filled in;
   - dates are ISO 8601 (YYYY, YYYY-MM, YYYY-MM-DD, a time with a zone, or an interval start/end), real calendar dates (no 30 February), with the end not before the start;
   - ORCID iDs have the right check digit (the last character, 0 to 9 or X);
   - DOIs look like `10.` + 4 to 9 digits + `/` + the rest;
   - latitudes are from −90 to 90 and longitudes from −180 to 180, given as a pair;
   - values from controlled lists (resource types, date types, relation types, basisOfRecord) are spelled as the standard spells them.
4. Choose **XML, JSON or CSV** and download or copy the record. Licences are written with their SPDX identifier and link.

## Worked example

Press **Fill in the example** on the DataCite form. It is a made-up stream temperature dataset with DOI `10.5555/example.2026`, two creators (Ana Rivera with ORCID's test iD `0000-0002-1825-0097`, and an organisation), a collection date range, a related article, a point at 45.42, −75.69 and a CC BY 4.0 licence. The check reads **Valid: all checks pass**, and the XML starts with `<identifier identifierType="DOI">10.5555/example.2026</identifier>`.

Now change the last digit of the ORCID iD from 7 to 8. The check shows "1 problem to fix": `"0000-0002-1825-0098" is not a valid ORCID iD`. A typo in a digit almost always breaks the check digit, which is why it is there. Change the latitude to 95 and a second problem appears: latitude must be from −90 to 90.

## Tips

- The DataCite XML can be pasted into the DataCite Fabrica form's XML upload, or sent with a repository deposit that accepts DataCite XML.
- For more than one Darwin Core occurrence, download the CSV for the first, then add rows below it in a spreadsheet: the header is the occurrence core layout.
- Keep the README of your dataset in step with the metadata; the dataset README builder on this site writes one.

## FAQ

**Is anything sent or saved?** No. The form and the record stay on this page. Nothing is uploaded or kept after you close it, so download the record first.

**Does a valid result mean a repository will accept it?** It means the record follows the standard's structure and the checks above. Repositories can have their own extra rules (a required licence, for example); check their guidance.

**Does it check that an ORCID iD or DOI exists?** No. That would mean contacting another website. It checks the form and the check digit only.
