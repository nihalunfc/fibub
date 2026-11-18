---
name: Tag editor
num: 3019
shelf: everyday
code: T1018
section: dj-library
title: "Tag editor: edit MP3, FLAC, WAV and M4A tags, cover art and file names in bulk"
seoTitle: "Music tag editor for MP3, FLAC, M4A, WAV: free online tool"
summary: "Edit the title, artist, genre, BPM, key, cover art and other tags of many music files at once, fill tags from file names or rename files from tags. The sound is never re-encoded and nothing is uploaded."
status: live
ads: false
order: 3019
icon: pencil
works: offline
updated: 2026-11-18
related: [music-library-cleaner, track-analyser, audio-converter, audio-trimmer]
sources:
  - "ID3 tag version 2.3.0 and 2.4.0 informal standards (id3.org), ID3v1 and its genre list; FLAC format (IETF RFC 9639, metadata blocks, Vorbis comment and PICTURE); Vorbis comment field names as in the Xiph.org Vorbis I specification; MP4 item atoms as documented by common open-source taggers; RIFF LIST/INFO (Microsoft/IBM Multimedia Programming Interface, 1991). Checked 2026-11-18. Not affiliated with any music or DJ software."
flow:
  - { icon: file, label: "Open files" }
  - { icon: pencil, label: "Edit tags" }
  - { icon: image, label: "Cover art" }
  - { icon: download, label: "Save" }
---

## What it does

A tidy library makes tracks easy to find on a gig: the right artist, title, genre, BPM, key and cover. This editor opens many MP3, FLAC, WAV and M4A files at once (Ogg and Opus read only) and lets you change their tags in a table, cell by cell or on all ticked files together. Only the tags are rewritten: the sound is copied byte for byte. Everything happens in your browser, so unreleased promos never leave your computer.

Find the problems first with the [[music-library-cleaner]], and fill in BPM and key with the [[track-analyser]].

## How to use it

1. Press **Open music files**, or in Chrome and Edge **Open a folder (save in place)**.
2. Type in the table, or use **Apply to ticked files** to set one field (say, the genre) on all ticked files.
3. Open **More options** for the other tools, then press **Download changed files** or **Save changes in place**.

## What each option does

- **Find and replace**: swaps text in one field or all of them.
- **Title Case**: capital on each word; small words such as "of" stay small, and DJ stays DJ.
- **Fill tags from the file name**: reads the name with a pattern such as `%artist% - %title%`.
- **Rename files from tags**: builds new names such as `%track% %artist% - %title%`.
- **Cover art**: choose a JPEG or PNG, check the preview, then set or remove covers.
- **BPM and key from a CSV**: matches rows to files by name.

## Worked example

`Artist A - Song B.mp3` has no tags. With the pattern `%artist% - %title%`, **Fill ticked files** sets the artist to "Artist A" and the title to "Song B". Set the genre to "Deep House" and download: the file now has an ID3v2.3 tag with all three, and the same sound.

## FAQs

**Which tag version is written?** MP3 gets ID3v2.3 with UTF-16 text, the most widely read version (an old ID3v1 tag is updated too). FLAC gets Vorbis comments, M4A its item atoms, WAV an ID3 chunk plus LIST/INFO.

**Are other tags kept?** Yes. Fields this page does not show, such as composer, lyrics and ReplayGain, are carried across.

**Why can I not save in place?** It needs the File System Access API, which only Chrome, Edge and similar browsers have. Elsewhere, download the changed files (several come as one ZIP).
