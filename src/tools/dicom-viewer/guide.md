---
name: DICOM viewer
num: 482
shelf: science
code: T333
section: medical-imaging
title: "DICOM viewer online: open CT and MRI DICOM files in your browser, window, measure and reslice"
summary: "Open DICOM files (CT, MR, X-ray) on your own device: window and level with approximate CT presets, zoom and pan, measure distances, angles and ROI mean and SD in HU, search every header tag, scroll a whole series and reslice it. Nothing is uploaded."
status: live
ads: false
order: 22
icon: image
works: offline
updated: 2026-11-09
related: [fits-viewer, image-resizer, compress-file, zip-checker, image-stacker, file-converter]
sources:
  - "DICOM reader, writer and pixel decoding written by fibub from the DICOM standard (NEMA PS3.5 data encoding, PS3.3 C.7.6.3 image pixel module and C.11.2.1.2 linear VOI window, PS3.6 tag keywords). Checked in the tests against pydicom 3.0.2 on synthetic files: every tag and every pixel of 14 files."
  - "Window presets are rounded, commonly quoted starting points (labelled approximate), not taken from any one source; sites differ."
  - "The sample is a made-up CT-like phantom drawn from ellipses with round values (air -1000, lung -800, fat -90, soft tissue 40, bone 650 HU). It is not a real patient or scan."
flow:
  - { icon: file, label: "Open DICOM" }
  - { icon: sliders, label: "Window" }
  - { icon: ruler, label: "Measure" }
  - { icon: table, label: "Tags" }
---

## What it does

DICOM is the file format of medical imaging: CT, MRI, X-ray, ultrasound and nuclear medicine scanners all write it. A DICOM file holds the picture and a long header of **tags** about the scan, the machine and the patient. This viewer opens DICOM files in your browser, on your own device. It never uploads anything, so you can look at a teaching case or your own scan without sending it anywhere.

It is a study and teaching tool, not a diagnostic workstation. It is not certified for diagnosis, and a screen in a browser is not a reading room.

Before you send scans to anyone, remove the names with the [[dicom-anonymiser]]; for astronomy images in FITS, use the [[fits-viewer]].

## How to use it

1. **Choose DICOM files** or drop them on the box. One file opens as an image. To see a whole series, choose all its slices at once (on a computer, select every file in the folder). The viewer sorts the slices by their position in the body, not by file name, so the order is right even when the files are numbered oddly. If the files hold more than one series, the largest is shown and the page says so.
2. Scroll through the slices with the **Slice** slider, the mouse wheel over the image, or the up and down arrow keys.
3. Set the **window**. CT values are in Hounsfield units (HU), from about -1000 for air to +1000 and more for bone, far more than a screen's 256 grey levels. The window chooses which part of that range you see: the **centre** (level) is the value shown mid-grey and the **width** is the range spread from black to white. Choose the window stored in the file, **Auto** (fits the data), a CT preset, or type your own numbers. With **Window** chosen under the image, drag left and right to change the width and up and down to change the centre.
4. **Zoom** with the buttons or a two-finger pinch, and choose **Pan** to drag the image around. **Fit** puts it back.
5. **Measure.** Choose **Distance** and drag between two points, **Angle** and tap three points (an end, the corner, the other end), or **ROI box** or **ROI oval** and drag over an area. Each result is drawn on the image and listed in the Measurements table, which you can download as CSV.
6. **Header tags** lists every tag with its number, value representation (VR), name and value. Type in the search box to find one, for example "spacing" or "0028". Tags inside sequences are indented and private (maker-specific) tags are grey.
7. **Download** the current view with its measurements as a PNG, PDF or Word file.

## The options in more detail

- **Window presets** for CT (soft tissue, lung, bone, brain, liver, mediastinum) are rounded starting points that are commonly quoted. They are approximate: every department tunes its own, so adjust by eye.
- **Invert** swaps black and white. MONOCHROME1 images (often X-rays, where higher values are darker) are already shown the right way round.
- **Distances** use the file's Pixel Spacing (row spacing, column spacing, in mm), so they are right even when pixels are not square. If only Imager Pixel Spacing is present (common for X-rays), the length is at the detector, which is a little larger than the patient because of magnification; the facts box says so. Without any spacing, lengths are in pixels.
- **ROI statistics** count the pixels whose centres fall inside the box or oval and give the mean, the standard deviation (with n - 1), the minimum, the maximum, the number of pixels and the area. Values are in modality units after the file's Rescale Slope and Intercept: Hounsfield units for CT.
- **View** appears when the series is a regular stack: same size, same angle, evenly spaced, not tilted. You can then reslice it along rows and along columns. For an axial CT these are the coronal and sagittal planes, with the head at the top. The reslice keeps true proportions from the slice gap and the pixel spacing. This is a simple multi-planar reformat (nearest slice, no interpolation between slices), good for teaching.

## What it reads

Part 10 DICOM files (with the "DICM" marker) and older bare data sets without one, in implicit VR little endian, explicit VR little endian, explicit VR big endian and deflated explicit VR little endian. Uncompressed pixels of 8, 16 or 32 bits, signed or unsigned, with Bits Stored less than Bits Allocated handled. Grey (MONOCHROME1 and MONOCHROME2) and colour (RGB, YBR_FULL) images, single or multi-frame.

**Compressed pixel data is not supported.** Files compressed with JPEG, JPEG-LS, JPEG 2000, HTJ2K or RLE show their tags, and the page says plainly that the picture cannot be drawn. Ask the scanner, PACS or CD viewer for an uncompressed export (often called "explicit VR little endian" or "uncompressed").

## Worked example

The page opens with a made-up phantom: 24 axial slices, 128 by 128 pixels of 2.5 mm, 5 mm apart, stored as value + 1024 with a Rescale Intercept of -1024 so the page shows Hounsfield units. On slice 12 with the file's soft-tissue window (centre 40, width 400), the lungs are dark, the spine is white and the soft tissue is mid-grey. An ROI oval in the soft tissue between the lungs reads a mean close to 40 HU with an SD of about 8 HU: the phantom's soft tissue is exactly 40 HU plus made-up noise with a standard deviation of 8. Dragging a distance across the outer edge of the body from left to right gives about 275 mm (0.86 of the 320 mm field on each side of the centre). Switch the view to **Coronal (reslice)** to see the lungs grow and shrink from slice to slice.

## Tips

- Choose every file in the series folder at once; a CD or download often splits a series into hundreds of files with names like IM0001.
- If reslicing is off, the page says why: uneven slice gaps, mixed series, or a tilted gantry are common reasons.
- Header tags hold names, dates and IDs. Before you share a file, remove them with the DICOM anonymiser.

## FAQ

**Is my scan uploaded?** No. The file is read by JavaScript in this page and stays in your browser's memory. Close the tab and it is gone.

**Why is my image black or white?** The window is far from the values in the image. Choose Auto, or a window stored in the file.

**Can I use it for diagnosis?** No. It is for study and teaching. Diagnosis needs a qualified professional with a certified viewer.

**Does it open DICOMDIR?** A DICOMDIR file is only an index. Open the image files it points to instead (often in folders named DICOM or IMAGES).
