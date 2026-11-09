---
name: Field note organiser
num: 763
shelf: science
section: anthropology
title: "Field note organiser for ethnography: dated notes with place, pseudonyms and tags, search, tag counts, Markdown/CSV/JSON export"
summary: "Write fieldwork notes with a date, place, the people involved (as pseudonyms) and tags. Search and filter them, see how often each tag and person comes up, and export to Markdown, CSV or JSON. Kept only in your browser if you choose."
status: live
ads: false
order: 763
icon: pencil
works: offline
updated: 2026-11-09
related: [data-cleaner, planner]
sources:
  - "No outside data. Example notes are made up for this tool."
flow:
  - { icon: pencil, label: "Write" }
  - { icon: search, label: "Find" }
  - { icon: chart, label: "Tag counts" }
  - { icon: download, label: "Export" }
---

## What it does

Ethnographers, anthropology and sociology students, user researchers and anyone doing fieldwork write notes every day: where they were, who was there, what happened, and their own reflections. After a few weeks those notes are hard to search. This tool is a simple, private notebook for them. Each note has a **date**, a **place**, the **people** involved (as pseudonyms) and **tags**, and you can search, filter and count them, then export everything for your analysis software or your thesis.

## Privacy first

Field notes are sensitive. This page never sends your notes anywhere. By default they live only on the open page and are gone when you close it. Tick **Keep my notes in this browser** to save them in this browser on this device, so they are there next time; untick it or press **Clear all** to remove them from the browser. To move notes to another device or keep a backup, export a **JSON** file and import it there. Always use pseudonyms or codes for people, and keep any key that links codes to real names separately and securely, as your ethics approval will require.

## How to use it

1. **Write a note.** The date starts as today. Type the place and the people and tags separated by commas; places, people and tags you have used before are suggested as you type. Press **Save note**.
2. **Edit or delete** a note with the buttons under it.
3. **Find notes.** Type words in Search (a note must contain every word, in any field), or choose a tag, person, place or date range. The tag and people chips show how many of the shown notes carry each one; tap a chip to filter by it, tap again to clear. **Show all** clears every filter.
4. **Export** the notes shown, or all notes, as **Markdown** (readable, for a thesis appendix or a notes app), **CSV** (one row per note, for a spreadsheet or for coding in qualitative analysis software; people and tags are joined with "; ") or **JSON** (everything, for backup and import).
5. **Import JSON** adds the notes from a file exported here. Notes already in the list (same id, or the same date, place and text) are skipped, and entries without a valid date are listed and left out.

## Worked example

Press **Add made-up example notes** to load three notes from an imaginary harbour town. The tag chips then read **trade · 3**, **kinship · 1**, **morning · 1** and **transport · 1**, and the people chips **Fisher A · 2**, **Vendor B · 2** and **Ferry worker C · 1**. Search for **fisher trade** and 2 of 3 notes remain: the ones that mention a fisher and carry the trade tag. Choose the tag **kinship** and only the tea stall note from 2026-10-03 is shown. Export it as CSV and the row reads `2026-10-03,Tea stall,Vendor B,kinship; trade,…`.

## Tips

- Keep a consistent tag list from the start (for example, place types, themes from your research questions, and "reflection" for your own thoughts). Tag counts then give a quick picture of what your notes cover.
- Mark your own interpretations inside the note, for example in [square brackets], so they stay separate from what you observed.
- Export JSON at the end of each day as a backup, even if you keep notes in the browser: clearing browser data removes them.

## FAQ

**Can anyone else see my notes?** No. Nothing is uploaded, and notes kept in the browser can only be read on this device in this browser.

**Can I attach photos or audio?** No. Keep media files in your own folders and refer to them by file name in the note.

**Will the CSV open in Excel with accents intact?** Yes. It is saved as UTF-8 with a marker that Excel recognises.
