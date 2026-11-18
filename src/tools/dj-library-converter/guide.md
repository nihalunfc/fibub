---
name: Library converter
num: 3027
shelf: everyday
code: T1015
section: dj-library
title: "DJ library converter: move playlists, cue points and beat grids between Rekordbox XML, Traktor NML, VirtualDJ, M3U and Serato crates"
seoTitle: "DJ library converter: Rekordbox, Traktor, VirtualDJ, free"
summary: "Open a Rekordbox XML, Traktor NML or VirtualDJ database export, or M3U and Serato crate files, and save your playlists, cue points, loops and beat grids in another format. Change the file paths for a new computer. Nothing is uploaded."
status: live
ads: false
order: 3027
icon: convert
works: offline
updated: 2026-11-18
related: [music-tag-editor, music-library-cleaner, track-analyser, harmonic-mixing]
sources:
  - "File layouts as described publicly by their makers and users: Rekordbox XML (AlphaTheta), Traktor NML (Native Instruments), VirtualDJ database.xml (Atomix), Serato crate files, and the extended M3U playlist. Checked 2026-11-18; the apps change their formats, so check the official source. fibub is not affiliated with any of them. Camelot and Open Key tables are the standard circle-of-fifths numbering."
flow:
  - { icon: file, label: "Open export" }
  - { icon: table, label: "Check" }
  - { icon: convert, label: "Convert" }
  - { icon: download, label: "Save" }
---

## What it does

This converter reads one app's library export and writes the same tracks, playlists, cue points, loops and beat grids for another. It runs in your browser, so your library is never uploaded.

It reads and writes **Rekordbox XML**, **Traktor NML** and **VirtualDJ database.xml**, plus playlists in **M3U8** and **Serato .crate** files. Times are turned over between units (Rekordbox and VirtualDJ use seconds, Traktor milliseconds) and keys between notations. The formats belong to their makers; fibub is not affiliated with any of them. After the move, record your next set with the [[mix-recorder]] or count tempos with the [[metronome]].

## How to use it

1. Export your library: in Rekordbox, File › Export collection in xml format; in Traktor, export the collection as NML; VirtualDJ keeps `database.xml` in its home folder. Serato crates are in `_Serato_/Subcrates`.
2. Press **Open library files**.
3. Check the counts and first rows, tick the playlists you want and pick **Save as**.
4. Press **Download**. Several files come in one ZIP.

## What each setting does

- **Playlists to take**: only ticked playlists (and their folders) are written.
- **Also take tracks that are in no chosen playlist**: writes the whole collection.
- **Change paths**: swaps the start of every file path, for example `C:\Users\Sam\Music\` to `/Volumes/DJ USB/Music/`, for a new computer or drive.
- **More options**: the Mac system disk name Traktor uses, and the drive Serato crates belong to.

## What does not carry over

- **Serato cue points** live inside the music files' own tags, not in crates, so they are not converted in or out. Crates and M3U files carry playlists only.
- Traktor colours cues by type, so cue colours are lost there. A beat grid with tempo changes keeps only its first tempo. Smart playlists are skipped.

## Worked example

A Rekordbox export has "Night Drive" at 124 BPM in A minor, a hot cue at 61.937 s and a loop from 92.871 to 100.613 s. As Traktor NML, the key becomes MUSICAL_KEY 21 (Open Key 1m), the cue START is 61937 ms and the loop is TYPE 5 with LEN 7742 ms.

## FAQs

**Do I need to analyse my tracks again?** Usually not: BPM, key and beat grid move across.

**Why are some tracks missing in the new app?** The paths do not match where the files are. Use **Change paths** and convert again.
