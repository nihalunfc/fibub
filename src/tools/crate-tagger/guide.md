---
name: Crate tagger
num: 3034
shelf: everyday
code: T1028
section: dj-library
title: "Crate tagger: add your own tags to a DJ music library"
summary: "Tag the tracks in your DJ library with vibe, set time and crowd labels, stars, energy and notes, then filter and export the list as a playlist, CSV or comment-field text. Your audio files are never touched or uploaded."
status: live
ads: false
order: 3034
icon: pencil
works: offline
updated: 2026-11-18
related: [track-analyser, music-tag-editor, harmonic-mixing, dj-set-planner]
sources:
  - "The ready-made tag names (deep, driving, euphoric, dark, warm-up, peak, closing, wedding, club, bar) are fibub's own suggestions, not a standard. M3U and M3U8 are plain playlist formats and CSV is plain text; fibub is not affiliated with any DJ software (checked 2026-11-18)."
flow:
  - { icon: file, label: "Open list" }
  - { icon: pencil, label: "Tag" }
  - { icon: search, label: "Filter" }
  - { icon: download, label: "Export" }
---

## What it does

A DJ library grows faster than anyone can remember it. This tool lets you add your own labels to each track: a vibe (deep, driving, euphoric, dark), when it works in a set (warm-up, peak, closing), the crowd (wedding, club, bar) and any tags of your own, plus stars, an energy number from 1 to 10 and a note. The tags are kept apart from your files, so nothing in your music is changed.

Start from a list made by the [[track-analyser]] or open audio files to read their names only. When you finish, plan the order with the [[harmonic-mixing]] planner.

## How to use it

1. Open a list (CSV, M3U or M3U8), open audio files or type a name. Files are never read, only their names are used.
2. Click a track, then tap tags. The ten ready-made tags have number keys: 1 to 9 and 0. Up and down arrows move between tracks, and [ and ] change the stars.
3. Filter with the tag buttons, the search box and the stars box. Choose **All chosen tags** (AND) to find tracks with every tag, or **Any chosen tag** (OR).
4. Export what is shown as an M3U8 playlist, a CSV table, or comment-field text.

## What each option does

- **Comment-field text**: one line per tagged track such as `Night Bus: #peak #dark`, to paste into the comment field of a tag editor.
- **Remember my tags in this browser**: off by default. When ticked, the list is kept in this browser only; **Clear the copy in this browser** removes it.
- **Save tag database (JSON)**: a backup file you can load again later, on this or another device. Tags in the file replace tags on the same tracks.

## Worked example

Import a list of 200 tracks. Select a track, press 6 (peak) and 4 (dark), and press ] three times for three stars. Choose the tags peak and dark with All chosen tags (AND), and the list shows only tracks with both. Press **Playlist (M3U8)** to get a playlist of just those tracks.

## FAQs

**Does it change my music files?** No. It never reads or writes audio; only names are used.

**Will my tags be lost when I close the page?** Yes, unless you saved the JSON database or ticked the browser box. Save a JSON backup for safety.

**Which tracks count as the same?** The same file name (or the same typed name). Importing a list again keeps your tags and updates BPM and key.
