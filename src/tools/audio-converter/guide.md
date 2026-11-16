---
name: Audio converter
num: 2246
shelf: everyday
code: T963
section: video-audio
title: "Audio converter: convert M4A, WAV, FLAC, OGG and more to MP3 or WAV"
seoTitle: "Audio converter to MP3 and WAV, free online tool"
summary: "Convert M4A, WAV, FLAC, OGG, Opus, AAC and other sound files to MP3 (64 to 320 kbps), WAV (16 or 24-bit) or u-law. Change the sample rate, mix to mono, convert many files at once. Nothing is uploaded."
status: live
ads: false
order: 2246
icon: convert
works: offline
updated: 2026-11-16
related: [extract-audio, audio-joiner, audio-trimmer, loudness-normaliser, mp3-to-ulaw]
sources:
  - "MP3 encoding by lamejs, a JavaScript port of the LAME encoder (LGPL-3.0, credited in NOTICE). Decoding by the browser's Web Audio API (W3C). WAV layout as published by Microsoft and IBM (1991). Resampling and mixing are fibub's own code."
flow:
  - { icon: file, label: "Open files" }
  - { icon: sliders, label: "Pick format" }
  - { icon: download, label: "Download" }
---

## What it does

Phones record M4A, cameras and editors make WAV, music shops sell FLAC, and some old car stereos and websites only take MP3. This converter changes sound files from one format to another on your own device. Your browser decodes each file and fibub's code writes the new one, so nothing is uploaded, there is no queue, and there is no limit on how many times you use it.

It reads anything your browser can play: MP3, WAV, M4A and AAC, FLAC, OGG and Opus, WebM and more. It saves MP3 at four quality levels, WAV at 16 or 24 bits, or u-law for phone systems. You can also change the sample rate or mix stereo down to mono. To pull the sound out of a video instead, use [[extract-audio]]; to put several files into one, use the [[audio-joiner]]; to even out the volume first, use the [[loudness-normaliser]].

## How to use it

1. Press **Open sound files** (or drop up to 30 files on the box).
2. Choose the format under **Save as**, and change the sample rate or channels if you need to.
3. Press **Play** to check a file, then **Download**, or **Download all as a ZIP**.

## What each setting does

- **MP3, 192 kbps**: sounds the same as the original to most people, about 1.4 MB a minute. 320 kbps is the highest MP3 allows (2.4 MB a minute); 128 kbps is smaller with a little loss on music; 64 kbps mono is fine for speech and audiobooks.
- **WAV, 16-bit**: uncompressed CD quality that every program opens; about 10 MB a minute in stereo at 44.1 kHz. **24-bit** keeps more detail for editing and mixing.
- **u-law 8 kHz**: phone-system audio. For more phone formats, use [[mp3-to-ulaw]].
- **Sample rate**: "Keep" leaves it alone. 48,000 Hz suits video, 44,100 Hz music, 22,050 Hz speech when size matters.
- **Mix to mono**: averages the left and right channels into one, which halves a WAV's size.

## Worked example

A 3-minute M4A voice memo at 48 kHz mono becomes a WAV of 3 × 60 × 48,000 × 2 = 17.3 MB, or an MP3 at 64 kbps of 3 × 60 × 64,000 ÷ 8 = 1.44 MB. The page's test converts a WAV to MP3 and checks the size and the MP3 frame header.

## FAQs

**Does converting MP3 to WAV improve the sound?** No. It makes a bigger file that is easier to edit, but what MP3 removed does not come back.

**Why can't it open my file?** Each browser can play different formats. Chrome and Edge read the most; Safari reads M4A and AAC but not OGG on older versions. Try another browser.

**Is my file uploaded?** No. Everything happens in this browser tab.

**Which MP3 encoder is used?** LAME, the open-source encoder behind most MP3 software, through the lamejs port. It loads only when you save an MP3.
