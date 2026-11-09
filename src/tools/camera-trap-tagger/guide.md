---
name: Camera-trap tagger
num: 856
shelf: science
section: conservation-science
title: "Camera trap photo tagger: species, counts and behaviour by hotkey, independent detections, RAI and activity by hour"
summary: "Open a folder of camera-trap photos (never uploaded). The page reads each photo's EXIF time, groups bursts into events, and lets you tag species, count and behaviour with one key. It works out independent detections, detections per 100 trap-nights (RAI), naive occupancy and activity by hour, and exports CSV. Tags can be kept in this browser."
status: live
ads: false
order: 856
icon: camera
works: offline
updated: 2026-11-09
related: [biodiversity-indices, field-sampling-planner, sample-size, sample-label-maker, occupancy-estimator, habitat-connectivity, ethogram-logger, mark-recapture]
sources:
  - "The EXIF reader, event grouping, independent detections (a gap rule applied per station and species), the relative abundance index (detections per 100 trap-nights) and naive occupancy are written by fibub. The tests check the EXIF reader against exifread and Pillow on JPEGs made with Pillow, and the detection counts and summaries against the same rules in pandas on made-up records."
  - "EXIF 2.3 (JEITA CP-3451) tags DateTimeOriginal, DateTimeDigitized and DateTime: open specification."
  - "The example survey (three cameras, species, times and counts) is made up by fibub; its pictures are drawn placeholders."
  - "Photos you open are read on the page only and never uploaded. Tags are kept in this browser only if you tick the box (off at first)."
flow:
  - { icon: camera, label: "Photos" }
  - { icon: clock, label: "Events" }
  - { icon: pencil, label: "Tag" }
  - { icon: chart, label: "Summary" }
---

## What it does

Camera traps take thousands of photos, most of them bursts of the same animal or empty frames set off by wind. This page helps you get from a folder of photos to the numbers a survey needs, without uploading anything:

- reads the **date and time** from each photo's EXIF data,
- groups photos taken close together at one camera into **events**, so a burst of ten photos is tagged once,
- lets you tag **species, count and behaviour** with one key each, and add notes,
- works out **independent detections**, **detections per 100 trap-nights** (the relative abundance index, RAI), **naive occupancy** and **activity by hour**,
- exports the photos with their tags, and the detections, as **CSV**.

**Your photos stay on this device.** They are read by your browser and never uploaded; the page works offline once loaded.

Plan where to put the cameras with the [[field-sampling-planner]], and turn your detections into occupancy with the [[occupancy-estimator]].

## How to use it

1. Press **Choose a folder** and pick the folder of a survey. Each sub-folder is taken as one station (camera); photos picked one by one go to the station named in the box.
2. Set the **event gap** (photos closer than this at one station form an event; 5 minutes suits most bursts) and the **independence interval** (photos of one species at one station closer than this count as one detection; 30 minutes is common, some studies use 60).
3. Type your **species** and **behaviours**. Keys 1 to 9 tag the species in order, 0 marks an empty event, Q W E R T set the behaviour, + and − change the count, the arrow keys move between events, N jumps to the next untagged event and Backspace clears a tag.
4. Type the real number of **trap-nights** for each camera (the first guess is the number of days from its first to its last photo).
5. Read the summary table and the activity chart, and download the CSVs or a report as PNG, PDF or Word.

## Worked example

The page opens with a made-up survey: three cameras over two weeks, already tagged. The summary reads "70 detections of 5 species in 40 trap-nights" (14 + 14 + 12 nights). Deer have the most detections (23, an RAI of 57.50 per 100 trap-nights); the badger was never seen at camera C, so its naive occupancy is 2 of 3 stations, 0.67. Choose **Fox** under "Activity of" and the chart shows detections only between 21:00 and 03:59, a nocturnal pattern; birds show only in daylight.

Change the independence interval from 30 to 60 minutes and visits that came back within the hour merge, so the number of detections can only stay the same or fall.

## Tips

- Check the camera clocks before a survey and note any that were wrong; the times here are the camera's own, with no time zone applied.
- RAI depends on camera placement, trigger speed and the interval you choose, so compare it only between surveys done the same way.
- Naive occupancy ignores animals that were present but not photographed. For true occupancy you need repeated surveys and a detection model (for example in R with the unmarked package).
- The photos CSV has one row per photo with its event and detection number, ready for R or a spreadsheet.

## FAQ

**Are my photos uploaded?** No. They are read on this device. Only the file name, size and time are used to remember tags, and only in this browser.

**Where are my tags kept?** In this browser's local storage on this device, by file name, size and time, but only after you tick "Remember my tags in this browser" (it is off at first, so nothing is saved unless you ask). They come back if you open the same photos again. Untick "Remember my tags in this browser" to stop and delete them, or press **Clear saved tags**.

**My photos have no date.** Some cameras or editing programs strip EXIF data. The page then uses the file's date, which may be the date it was copied, and says so in the caption and the CSV.

**Why is one detection counted as the most animals in any photo?** Animals in a burst are usually the same individuals photographed again, so adding them up would count them twice.
