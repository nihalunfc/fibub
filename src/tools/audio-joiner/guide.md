---
name: Audio joiner
num: 2247
shelf: everyday
code: T964
section: video-audio
title: "Audio joiner: merge MP3, WAV and M4A files into one, with gaps or crossfades"
seoTitle: "Audio joiner: merge MP3 and WAV files, free online tool"
summary: "Put sound files in order and merge them into one MP3 or WAV, straight, with silence between, or with a smooth crossfade. Mixed formats and rates are matched for you. Nothing is uploaded."
status: live
ads: false
order: 2247
icon: link
works: offline
updated: 2026-11-16
related: [audio-converter, audio-trimmer, loudness-normaliser, voice-recorder]
sources:
  - "Decoding by the browser's Web Audio API (W3C); MP3 encoding by lamejs, a JavaScript port of LAME (LGPL-3.0, credited in NOTICE). Joining, resampling and the equal-gain crossfade are fibub's own code."
flow:
  - { icon: file, label: "Add files" }
  - { icon: sliders, label: "Order" }
  - { icon: link, label: "Join" }
  - { icon: download, label: "Download" }
---

## What it does

The audio joiner puts several sound files together into one, in the order you choose: chapters of an audiobook, the parts of a voice memo, an intro and outro around a podcast, songs for a dance routine or a phone menu built from separate prompts. It can join them straight, leave a few seconds of silence between them, or blend each into the next with a crossfade.

The files can be different kinds (MP3, WAV, M4A and so on), sample rates and channel counts. The joiner matches them: everything is brought to the highest sample rate, and if any file is stereo the result is stereo. It all runs in your browser, so nothing is uploaded. Trim the pieces first with the [[audio-trimmer]], and even out the final volume with the [[loudness-normaliser]].

## How to use it

1. Press **Add sound files** and pick two or more (or drop them on the box). You can add more later.
2. Use ↑ and ↓ to put them in order, and ✕ to remove one.
3. Under **Between files**, choose a straight join, silence or a crossfade, and how many seconds.
4. Press **Play the joined sound** to check, then **Download**.

## What each setting does

- **Straight join**: each file starts the moment the last one ends.
- **Silence**: adds that many seconds of quiet between files, like the pause between tracks on a CD.
- **Crossfade**: the end of one file fades out while the next fades in over that many seconds, so the join has no gap or bump. The total gets shorter by the overlap.
- **Save as**: MP3 (64 to 320 kbps), WAV (16 or 24-bit) or u-law for a phone system.

## Worked example

Three files: a 10 s intro (mono, 44.1 kHz), a 20 min interview (stereo, 48 kHz) and a 15 s outro. With 1 s of silence between, the result is stereo at 48,000 Hz and lasts 10 + 1 + 1,200 + 1 + 15 = 1,227 s (20 min 27 s). As MP3 at 128 kbps that is about 1,227 × 16,000 = 19.6 MB. With 2 s crossfades instead, it would be 1,225 − 4 = 1,221 s.

## FAQs

**Does it re-encode MP3s?** Yes. Joining decodes every file and writes one new file. At 192 kbps or more the change is not audible; for no loss at all, save as WAV.

**How many files can I join?** Up to 50 files and 1 GB together. The joined sound is held in memory, so very long results need a computer rather than a phone.

**Is anything uploaded?** No. The files are read and joined in this browser tab.
