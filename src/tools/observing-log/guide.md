---
name: Observing log
num: 17
shelf: science
section: observing
title: "Astronomy observing log: record observations and build your own database (CSV)"
summary: "Log what you see at the eyepiece or camera: object, equipment, seeing, transparency and notes. Each time you save, choose a new log file or add to an existing one, so your files grow into a database of every observation."
status: live
ads: false
order: 18
icon: book
works: offline
updated: 2026-11-07
related: [sky-tonight, object-altitude, fits-viewer, astro-time]
sources:
  - "Sun, Moon and planet positions: astronomy-engine by Don Cross (MIT licence), accurate to about an arcminute."
  - "Deep-sky objects: the OpenNGC catalogue by Mattia Verga (CC BY-SA 4.0)."
  - "City coordinates and time zones: public geographic facts, typed by fibub."
flow:
  - { icon: eye, label: "Observe" }
  - { icon: pencil, label: "Write notes" }
  - { icon: file, label: "New or add" }
  - { icon: table, label: "Build a log" }
---

## A logbook that stays yours

Keeping a log is how observers improve. You learn what your telescope can show, which nights are worth it, and how many Messier objects you have ticked off. Most logging apps want an account and keep your notes on their servers. This one keeps your log in a plain **CSV file on your own device**: one row per observation, with clear column names. It opens in Excel, Google Sheets, LibreOffice, Python or any database, and nothing is ever uploaded.

Plan the session with the [[observing-session|observing session planner]], and keep variable star estimates in the [[variable-star-log]].

## How to use it

1. **Set your place** at the top. It is written into each observation along with the latitude and longitude. Your location stays on your device.
2. Type the **object**. Catalogue names (M13, NGC 7000) fill in the type, constellation and position for you, and planets and the Moon are recognised too. Anything else is kept as you type it.
3. Add your **telescope**, **eyepiece or camera**, **magnification** and **filter**. These stay filled in for the next object, so a night's log is quick.
4. Rate the **seeing** (how steady the air is), **transparency** (how clear), the sky's **Bortle** darkness, and how good the view was. Write your **notes**. On a phone, the microphone on your keyboard lets you dictate them.
5. Press **Save observation**. Every time, you are asked where it should go:
   - **Save as a new log file**: starts a new CSV file, for example one per night, per season or per project.
   - **Add to an existing log file**: pick your log, and the observation is added as a new row. In Chrome and Edge on a computer the file is updated in place, and later saves offer **Add to (your file) again** in one tap. In other browsers, the updated file downloads with the same name, ready to replace the old copy.
   - **Keep in this tab for now**: holds it until you next save to a file. That's handy when you are logging quickly at the telescope.
6. **Your log** shows what you saved in this tab. Press **Open a log file** to see a whole log, with totals for observations, nights, different objects and **Messier objects seen out of 110**.
7. **Download** a log as an image, PDF or Word file to print, share with your club, or keep as a tidy record.

## Red light

Press **Red light** at the top of the page to turn the whole screen red and black. Red light keeps your eyes adapted to the dark, which takes 20 to 30 minutes to build and seconds to lose. Turn your screen brightness down too.

## What's in the file

Columns: `id, utc_time, local_date, local_time, object, type, constellation, ra_j2000, dec_j2000, place, latitude, longitude, telescope, eyepiece_or_camera, magnification, filter, seeing_1_to_5, transparency_1_to_5, bortle, rating_1_to_5, notes`. You can add your own columns in a spreadsheet. The log reads columns by name, so your extra columns are kept when you add new rows.

## Worked example

On a Saturday you observe M13, M57 and Saturn with an 8-inch Dobsonian. Save the first as a new file, `observing-log-2026-11-07.csv`, and add the next two with **Add to … again**. A month later, open that file to add the Orion Nebula. The summary shows 4 observations over 2 nights, with 3 Messier objects seen.

## Questions

**Where is my log stored?** Only in the files you save. Observations kept in the tab are removed when you close it, so save to a file before you go.

**Can I edit old entries?** Yes. Open the CSV in a spreadsheet, edit it and save it as CSV. The log reads it back.
