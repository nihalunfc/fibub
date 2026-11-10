---
name: Field form builder
num: 827
shelf: science
code: T563
section: citizen-science
title: "Field form builder"
summary: "Design a field data form with text, numbers with an allowed range, choices, dates and times, photo notes and a GPS location. Fill in records outdoors, even with no signal once the page is open; records stay on your device, kept in this browser only if you tick the box. Export them as CSV or GeoJSON, and share the form as a small file."
status: live
ads: false
order: 827
icon: compass
works: offline
updated: 2026-11-09
related: [field-sampling-planner, gps-track-analyser, biodiversity-indices, data-cleaner, weather-log, camera-trap-tagger, sample-label-maker, data-dictionary, metadata-builder, quadrat-transect-analyser, csv-profiler]
sources:
  - "The form layout, checks and exports are written by fibub. CSV follows RFC 4180 and GeoJSON follows RFC 7946 (longitude before latitude, WGS 84)."
  - "The example form (a roadside pollinator count) is made up."
  - "Location comes from your device's Geolocation API only when you tap Get my location. Records are kept in this browser only if you tick the box (off at first) and never leave your device."
flow:
  - { icon: pencil, label: "Design" }
  - { icon: compass, label: "Record" }
  - { icon: table, label: "Records" }
  - { icon: download, label: "Export" }
---

## What it does

Citizen-science projects, student field trips and small surveys need a simple form on a phone: the same questions every time, numbers that make sense, and a location. This page is that form, made by you and kept on your device.

- **Design** a form from eight kinds of field: *text*, *number* (with a unit and an allowed range), *choice* (one option, or a checklist when "more than one" is ticked), *date*, *time*, *date and time*, *photo note* (the photo number and what it shows; the photo itself stays in your camera) and *location (GPS)*. Mark fields as required and add a hint under any of them.
- **Fill** a record in the field. Numbers outside the range, impossible dates and missing required answers are pointed out before the record is saved. *Today* and *Now* buttons fill in the date and time.
- **Location only when you ask.** Tap *Get my location* and the browser asks your device for one fix (latitude, longitude and its accuracy in metres). Nothing reads your location at any other time. You can also type the coordinates, for example from a handheld GPS.
- **Records** are listed in a table where you can edit or delete them, and, once you tick *Keep the form and records in this browser* (off at first), are kept in this browser so they survive closing the page with no signal.
- **Export** as CSV for a spreadsheet or R and Python, or as GeoJSON to put the points on a map in QGIS or another GIS. Save the form as a .json file so a whole team fills in exactly the same form.

Plan where and when to sample with the [[field-sampling-planner]], and check the returned sheets for gaps and odd values with the [[csv-profiler]].

## How to use it

1. **Design.** Start from the example (a roadside pollinator count) or *New empty form*. Add fields, set labels, column names, units and ranges, and options for choices. Save the form file and send it to your team.
2. **Fill a record.** Open the page while you have a connection. In the field it keeps working offline. Fill in the form, tap *Get my location* and *Save record*.
3. **Records.** Check the table and edit anything you mistyped.
4. **Export.** Download the CSV, and the GeoJSON if the form has a location field.

## Worked example

With the example form, fill in Site name *Verge A*, Date and time *2026-06-14 11:20*, location 51.5, −0.12 with an accuracy of 8 m, Air temperature 21.5 °C, Sky *Sunny*, Groups seen *Bumblebees* and *Hoverflies*, and a count of 17, then save. The CSV row reads `1,Verge A,2026-06-14T11:20,51.5,-0.12,8,,21.5,Sunny,Bumblebees; Hoverflies,17,,,…` under the header `record,site,when,location_lat,location_lon,location_accuracy_m,location_time,temperature_c,sky,groups,count,photo,notes,saved`. The GeoJSON holds one Point feature at coordinates `[-0.12, 51.5]` (longitude first, as the standard requires) with the other answers as properties. Type a temperature of 50 and the page refuses to save: "The largest allowed value is 45 °C."

## Tips

- Accuracy matters: a fix of ±5 m is good, ±50 m or more is rough. Stand in the open, away from buildings, and wait a moment before tapping.
- Column names become CSV headings and GeoJSON property names; keep them short and stable. If you change a form during a survey, keep the column names the same so old and new records line up.
- Export often. Records live in this browser only, so clearing site data, a private window or a different phone means they are not there.
- Multi-choice answers are joined with "; " in the CSV.

## FAQ

**Does anything leave my phone?** No. Nothing is saved at all until you tick *Keep the form and records in this browser*; then the form, the records and the location are kept in this browser on this device, and only you can export them. Untick *Keep the form and records in this browser* to remove the stored copy, and *Delete all records* to clear them.

**Can I attach photos?** Not in the form. Photos are large and the page keeps everything on your device without uploading, so the *photo note* field records the photo number and what it shows; match them up later.

**Why is my location missing or rough?** The browser may need permission for this site, indoors fixes are poor, and some laptops guess from Wi-Fi. Type the coordinates if you have them from another device.

**Which coordinate system is used?** WGS 84 latitude and longitude in decimal degrees, as phones and GeoJSON use.
