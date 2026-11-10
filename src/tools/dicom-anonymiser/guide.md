---
name: DICOM anonymiser
num: 483
shelf: science
code: T334
section: medical-imaging
title: "DICOM anonymiser: remove patient names, IDs and dates from DICOM files in your browser"
summary: "De-identify DICOM files on your own device before you share them: replace the name and ID, shift or remove dates, give new consistent UIDs, remove private tags and staff names, and see every change. Download one file or a ZIP. Nothing is uploaded."
status: live
ads: false
order: 23
icon: lock
works: offline
updated: 2026-11-09
related: [dicom-viewer, zip-checker, compress-file, file-converter, fits-viewer, checksum-checker, metadata-builder]
sources:
  - "Rules written by fibub after the principles of the DICOM basic application level confidentiality profile (NEMA PS3.15 Annex E). The tag list and its wording are our own selection, not a copy of the standard's table."
  - "DICOM reading and writing written by fibub (see the DICOM viewer). Checked in the tests by re-reading every cleaned file in pydicom 3.0.2 in strict mode: 1157 checks over 14 synthetic files and three date options."
  - "The sample is three made-up files with fictional names, IDs and a made-up hospital. No real patient data."
flow:
  - { icon: file, label: "Open DICOM" }
  - { icon: sliders, label: "Options" }
  - { icon: lock, label: "Clean" }
  - { icon: download, label: "Download" }
---

## What it does

A DICOM file carries more than a picture. Its header can hold the patient's name, ID, birth date and address, the hospital, the doctors' and radiographers' names, the dates of every scan, the machine's serial number and maker-specific (private) tags that may repeat any of these. Before you share a scan for teaching, a talk, a research project or a second opinion, those details should come out. This tool removes them **on your own device**: the files are read and rewritten by this page and never uploaded.

It follows the principles of the DICOM standard's basic confidentiality profile (PS3.15 Annex E): remove or blank what identifies a person, replace UIDs, remove private tags and record that it was done. It is a careful helper, not a guarantee. Your organisation's rules come first.

Look through the scans first with the [[dicom-viewer]], and make the shared folder smaller with the [[compress-file|file compressor]].

## How to use it

1. **Choose DICOM files** or drop them on the box: one file, a series or a whole study. Files that are not DICOM are listed and skipped.
2. Set the **options**:
   - **New patient name** and **New patient ID**: what goes in their place (default ANONYMOUS and ANON-0001). Use a study code if the receiver needs to tell patients apart.
   - **Dates**: **Shift** moves every date by the same number of days, so the time between scans stays right while the real dates are hidden; **Remove** blanks every date and time; **Keep** leaves them. Pick your own shift and keep it secret: anyone who knows it can undo it.
   - **Keep sex, age, size and weight**: off by default. Turn it on only when the receiver needs them (for example, for dose or growth studies).
   - **Keep descriptions**: off by default. Study, series and protocol descriptions are free text, and people sometimes type names into them.
3. Check the **Cleaned files** table and the **Before and after** list for each file. The picture of each file is shown so you can look for text burned into it.
4. **Download** the cleaned file, or all of them as a ZIP. Files are renamed anon-0001.dcm and so on, because file names often contain the patient's name. The **change list** CSV has the new values only, never the originals.

## What is changed

- Patient's name and ID: replaced by your choices. Birth date: blanked. Other names and IDs, birth name, mother's name, address, phone, country, ethnic group, occupation, religion, military service, smoking, pregnancy, alerts, allergies, history and comments: removed.
- Sex: blanked, and age, height and weight removed, unless you keep them.
- Hospital name, address and department; station name, device serial number, plate, cassette and detector IDs: removed.
- Referring physician's name, accession number and study ID: blanked (they stay as empty tags because some software expects them). Every other person name anywhere in the file, also inside sequences, is blanked.
- Requests, procedure IDs, free-text comments, overlay pictures and copies of original values: removed. Descriptions: removed unless you keep them.
- Every date and date-time: shifted, removed or kept, as you choose.
- Every UID that is not a standard DICOM UID (study, series, instance, frame of reference and every reference to them): replaced by a new random UID. The same old UID always gets the same new one in a batch, so a series stays a series and references still point to the right image.
- Every private tag: removed.
- Added: Patient Identity Removed = YES, the method (with the date shift), and whether dates were changed.
- The pixels are not touched: they are written back byte for byte, and compressed images stay compressed.

## What it cannot do

**Text burned into the pixels is not removed.** Ultrasound, screen captures, scanned request forms and some X-rays print the name or date in the image itself. The page shows each picture and warns more strongly for these kinds of images and for files whose header says Burned In Annotation = YES. Faces in 3D head scans can also identify someone. If in doubt, don't share the file.

## Worked example

The page opens with three made-up files that hold a fictional patient (Sample^Phantom, ID SAMPLE-0001), a made-up hospital, a referring doctor, an operator, an address, an accession number, a comment that repeats the name, and a private tag that repeats the ID. With the default options (dates shifted by -100 days), each file gets 26 changes and the summary shows 3 files cleaned, 30 tags removed (6 of them private), 15 blanked and 6 different UIDs replaced (one study, one series, one frame of reference and three images). The study date 20240101 becomes 20230923. Turn on **Keep sex, age, size and weight** and the age 024Y and sex O stay.

## Tips

- Clean a whole study in one go so the new UIDs line up across series. If you must do it in parts, use the same options and date shift each time (the UIDs will then differ between parts).
- Open a cleaned file in the DICOM viewer and search its tags for any name or ID you know, as a final check.

## FAQ

**Are my files uploaded?** No. Everything happens in this page, in your browser's memory.

**Can the shift be undone?** Only by someone who knows the number of days. Keep it to yourself, or remove dates if the gaps between scans don't matter.

**Is this enough for my ethics board or the law where I live?** It depends on their rules. This tool follows the principles of the standard's basic profile, but you and your organisation decide what must be removed.
