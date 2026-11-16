---
name: Voice recorder
num: 2242
shelf: everyday
code: T959
section: video-audio
title: "Voice recorder: record your voice online and save it as WAV, with nothing uploaded"
summary: "Record from your microphone in the browser, listen back and save it as a WAV, a smaller compressed file or u-law for a phone system. The recording never leaves your device."
status: live
ads: false
order: 2242
icon: mic
works: offline
updated: 2026-11-16
related: [audio-trimmer, wav-to-ulaw, screen-recorder, tone-generator]
sources:
  - "Recording by the browser's MediaStream Recording API (W3C); WAV layout as published by Microsoft and IBM (1991); G.711 u-law from ITU-T Recommendation G.711 (1988)."
flow:
  - { icon: mic, label: "Record" }
  - { icon: play, label: "Listen" }
  - { icon: download, label: "Save" }
---

## What it does

This is a voice recorder that runs in your browser. Press record, speak, press stop and save it. Many online recorders send your voice to a server to make the file; this one does not. The sound goes from your microphone into this tab's memory and is saved straight to your device, so it is fine for private notes, interview answers or a voicemail greeting.

You can save it three ways: a WAV file that every editor opens, the smaller compressed file your browser made (WebM or OGG on most browsers, M4A on Safari), or raw u-law ready for an Asterisk or FreePBX phone system. To cut off the silence at the start and end, open the WAV in the [[audio-trimmer]]; for other phone formats, use [[wav-to-ulaw]].

## How to use it

1. Press **Start recording** and allow the microphone when your browser asks.
2. Watch the bar move as you speak. If it turns red, you are too close or too loud.
3. Press **Pause** to stop for a moment and **Carry on** to continue in the same file.
4. Press **Stop**, listen back with the player, then press a download button.

## What each setting does

- **Clean up the sound**: turns on the browser's own noise suppression, echo cancellation and automatic level. Good for speech in a noisy room; untick it for music or when you want the room as it really sounds.
- **Download WAV**: 16-bit mono at the rate your microphone used (usually 48,000 Hz). Large but plain.
- **Download smaller file**: the compressed recording as the browser made it, about a tenth of the size.
- **Download for a phone system**: 8 kHz G.711 u-law with the level evened out, for a PBX greeting or menu prompt.

## Worked example

A 30-second greeting at 48,000 Hz is 30 × 48,000 × 2 = 2,880,000 bytes as WAV (about 2.9 MB). The browser's compressed file is usually 200 to 500 KB. As u-law for a phone system it is 30 × 8,000 = 240,000 bytes.

## FAQs

**Where is my recording kept?** Only in this browser tab, in memory. Close or reload the page and it is gone, so save it first.

**Why does my browser ask for the microphone?** Websites cannot listen without your permission. You can take it back at any time in the address bar.

**Can it record for a long time?** Yes, but a long WAV gets big: an hour is about 345 MB. For long talks, save the smaller file.

**Is anything uploaded?** No. Nothing is sent anywhere; the page works with no internet once it has loaded.
