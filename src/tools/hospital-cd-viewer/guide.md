---
name: Hospital CD viewer
num: 1969
shelf: documents
code: T844
section: records-files
title: "Open a hospital scan CD or USB (DICOM) in your browser"
summary: "Pick the folder from a hospital scan CD or USB stick. See the studies and series by date and body part, look at the images, and save pictures or a PDF to share. Nothing is uploaded."
status: live
ads: false
order: 1969
icon: image
works: offline
updated: 2026-11-10
related: [dicom-viewer, dicom-anonymiser, records-organiser]
sources:
  - "Reads DICOM files with fibub's own reader, written from the DICOM standard (NEMA PS3.5 and PS3.6), the same one used by the DICOM viewer. Study, series, date, modality and body part come from the file headers."
  - "Brightness window presets are rounded, commonly quoted starting points, labelled approximate. This is a viewer for looking, not for diagnosis."
flow:
  - { icon: file, label: "Pick folder" }
  - { icon: table, label: "See studies" }
  - { icon: eye, label: "Open" }
  - { icon: download, label: "Export" }
---

## What it does

Hospitals often hand over a CD or USB stick with your scans. It usually comes with a Windows viewer that does not run on a phone or a Mac. This page reads the scan files directly in your browser, lists what is on the disc, and lets you look at the pictures.

It shows each study (one visit to the scanner) with its date, description, type of scan and body part, and the series inside it. The patient name is hidden until you ask to see it. It is a simple viewer and not for diagnosis. For measurements, try [[dicom-viewer]], and before you share files with anyone, [[dicom-anonymiser]] removes names from them.

## How to use it

1. Press **Choose a folder** and pick the whole disc or the DICOM folder on it. You can also drop a folder or files.
2. Read the list. Files that are not scans, such as DICOMDIR, the viewer program and autorun files, are skipped and counted.
3. Press **Open** on a series. Move the slider to scroll through its images.
4. Save the current image as PNG or JPG, or choose several with **Add to PDF** and make one PDF.

## What each option does

- **Show patient names** reveals the name stored in the files. It is off by default so you can show a screen without it.
- **Brightness window** changes how the grey levels are shown. Presets are approximate starting points. They change the picture on your screen, not the scan.
- **Invert** swaps black and white.

## Worked example

Priya opens a USB stick with 412 files. The page reads them, finds 1 study dated 15 March 2024 with 2 series (Lungs and Soft tissue), and says 3 other files were skipped. She opens the Lungs series, scrolls to an image, adds three images to the PDF, and emails the PDF to a relative.

## FAQs

**Are my scans uploaded?** No. Everything is read and drawn on your device.

**Why can't it show some images?** Some discs store images in a compressed form this viewer does not read. The page says so; ask the hospital for an uncompressed copy.

**Do saved pictures include my name?** They hold only the image, but a few scans have text burnt into the picture itself, so look before sharing.
