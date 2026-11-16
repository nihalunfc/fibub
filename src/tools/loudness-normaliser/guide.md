---
name: Loudness normaliser
num: 2243
shelf: everyday
code: T960
section: video-audio
title: "Loudness normaliser: measure LUFS and true peak, normalise audio to -14, -16 or -23 LUFS"
seoTitle: "LUFS meter and loudness normaliser, free online tool"
summary: "Measure a song, podcast or video sound track in LUFS (ITU-R BS.1770, EBU R 128) with loudness range and true peak, then save a copy at -14, -16, -23 LUFS or your own target. Nothing is uploaded."
status: live
ads: false
order: 2243
icon: chart
works: offline
updated: 2026-11-16
related: [audio-trimmer, voice-recorder, audio-spectrum-analyser, mp3-to-ulaw]
sources:
  - "ITU-R Recommendation BS.1770-4 (2015): K-weighting, gating, LKFS/LUFS and true peak; EBU R 128 (2020) and EBU Tech 3341/3342 (loudness range); ATSC A/85 (2013). Platform targets as the services publish them (Spotify, YouTube and Apple Music help pages, AES TD1004 for podcasts), checked 2026-11-16; services change them, so check the official source. Filter design as in the open-source libebur128 (MIT)."
flow:
  - { icon: file, label: "Open sound" }
  - { icon: chart, label: "Measure" }
  - { icon: sliders, label: "Target" }
  - { icon: download, label: "Save WAV" }
---

## What it does

Streaming services, podcast apps and broadcasters do not judge loudness by the peaks. They measure it the way people hear it, in LUFS (loudness units relative to full scale), using the ITU-R BS.1770 method. Spotify and YouTube turn songs louder than about −14 LUFS down; Apple Music and podcast apps aim for about −16; European TV uses −23 (EBU R 128) and North American TV −24 (ATSC A/85). This tool measures your file the same way and saves a copy at the level you choose. It runs in your browser, so unreleased songs and private recordings are never uploaded.

It shows the integrated loudness (the whole file), the loudest 3-second and 0.4-second moments, the loudness range (how much the level moves between quiet and loud parts) and the true peak, which catches peaks that fall between samples and can clip after MP3 or AAC encoding. To cut the file first, use the [[audio-trimmer]]; to see which frequencies are loud, open it in the [[audio-spectrum-analyser]].

## How to use it

1. Press **Open a sound file** (MP3, WAV, M4A, FLAC, OGG or the sound of a video).
2. Read the measurements.
3. Choose a **Target** or type your own loudness and peak limit.
4. Press **Play 10 s from the loudest part** to hear it, then **Download at the target**.

## What each number means

- **Integrated loudness (LUFS)**: the loudness of the whole file. Silent and very quiet parts are left out (gating), so pauses do not drag it down.
- **True peak (dBTP)**: the highest point of the real sound wave, worked out between samples by 4× oversampling. Keep it at −1 dBTP or lower for streaming.
- **Loudness range (LU)**: the spread between quieter and louder parts. Speech is often 3 to 8 LU; classical music can be 15 or more.
- **Short-term and momentary**: the loudest 3-second and 0.4-second stretches.
- **Sample peak (dBFS)**: the biggest single sample value.

## Worked example

A podcast episode measures −21.3 LUFS with a true peak of −4.2 dBTP. For Apple Podcasts (−16 LUFS, −1 dBTP) it needs +5.3 dB, but that would put the true peak at +1.1 dBTP. So the tool turns it up by 3.2 dB instead, to −18.1 LUFS with peaks at −1.0 dBTP, and tells you the peaks are what stopped it. A limiter in an editor such as Audacity can then hold the peaks down so the rest can come up.

The tool was checked with the BS.1770 test signal: a full-scale 997 Hz sine in one channel measures −3.01 LUFS, and a −20 dBFS 1 kHz sine measures −23.0 LUFS.

## FAQs

**Is it the same as ffmpeg loudnorm or a broadcast meter?** It uses the same standard (BS.1770-4 with gating), so integrated readings agree within about 0.1 LU. It does not compress or limit; it only changes the level.

**Does it handle mono files?** Yes. Following BS.1770, a mono file is measured as one channel; some apps add 3 dB to mono files (treating them as two speakers). The −19 LUFS mono podcast target allows for that.

**Is anything uploaded?** No. Measuring and saving both happen on this device.
