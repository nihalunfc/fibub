---
name: Library cleaner
num: 3022
shelf: everyday
code: T1016
section: dj-library
title: "Library cleaner: find duplicate songs, missing tags and low or fake bitrates in a music folder"
seoTitle: "Duplicate song finder and fake MP3 checker, free online tool"
summary: "Check a music folder for duplicate tracks, missing tags, low bitrates, likely fake 320 kbps files, very short or silent files and unusual sample rates, then download a CSV report. Nothing is uploaded or deleted."
status: live
ads: false
order: 3022
icon: search
works: offline
updated: 2026-11-18
related: [music-tag-editor, track-analyser, audio-converter, audio-spectrum-analyser]
sources:
  - "Tag and header layouts: ID3 v2.3/2.4 (id3.org), MPEG audio frame headers and Xing/VBRI headers, FLAC STREAMINFO (IETF RFC 9639), MP4 movie header, RIFF WAVE fmt chunk. The fake-bitrate check is a rule of thumb (stated 256 kbps or more but nothing above 16.5 kHz), not a standard. Checked 2026-11-18. Not affiliated with any music or DJ software."
flow:
  - { icon: file, label: "Pick folder" }
  - { icon: search, label: "Check" }
  - { icon: table, label: "Report" }
  - { icon: check, label: "Tidy up" }
---

## What it does

Years of downloads and promos leave a DJ library full of the same track three times, files with no artist or key, and MP3s worse than they look. This page reads the tags and header of every file in a folder and lists what needs attention. It runs in your browser, and it changes or deletes nothing.

Fix the tags it finds missing with the [[music-tag-editor]], and add BPM and key with the [[track-analyser]].

## How to use it

1. Press **Pick a music folder** (sub-folders are included) or **Pick files**.
2. Tap a category in the summary to show only those files.
3. Press **Download the report (CSV)**, and copy the list of lower-quality duplicates if you want to remove them yourself.

## What each check does

- **Duplicates**: the same artist and title (ignoring "(Original Mix)", "feat." credits, capitals and punctuation), or the same size and length. The suggested keeper is lossless first, then the highest bitrate.
- **Missing tags**: no artist, title, genre, BPM, key or cover (choose fewer under More options).
- **Low bitrate**: lossy files under the bitrate you choose (192 kbps unless you change it).
- **Likely fake bitrate** (optional, slower): decodes each file and finds where the high frequencies stop. Says 256 kbps or more but nothing above about 16.5 kHz? It was probably made from a lower-quality file. A hint, not proof: some recordings have little top end.
- **Very short or silent**: shorter than 30 seconds, or (with the slower check) a peak below −60 dBFS.
- **Unusual sample rate**: anything other than 44.1 or 48 kHz, which some older players cannot play.

## Worked example

A folder holds `Artist - Song (Original Mix).mp3` at 320 kbps and `artist - song.mp3` at 128 kbps. They form one duplicate group; the 320 kbps copy is marked **Keep**, the 128 kbps one is flagged as low bitrate and goes on the list of files you could remove.

## FAQs

**Why does it not delete the duplicates?** Browsers cannot delete files on your computer. Use the list in your file manager or DJ software, after checking by ear.

**Is the deep check slow?** It decodes each file, so a big folder takes minutes. Files over 80 MB are skipped.
