---
name: Add audio
num: 2270
shelf: everyday
code: T977
section: video-audio
title: "Add audio to video: put music or a voice-over on a video"
seoTitle: "Add music to video, free online tool"
seoDescription: "Add music or a voice-over to a video: replace or mix its sound, with volume, start time, loop and fades. No quality lost, nothing uploaded."
summary: "Add music or a voice-over to a video, replacing its sound or mixing under it, with volume, start time, loop and fades. The picture is copied without loss. Nothing is uploaded."
status: live
ads: false
order: 2270
icon: mic
works: offline
updated: 2026-11-16
related: [mute-video, extract-audio, audio-trimmer, video-joiner]
sources:
  - "Reading, writing and converting video with Mediabunny (MPL-2.0, credited in NOTICE), using the browser's own WebCodecs encoder and decoder (W3C). Nothing is uploaded."
  - "Sound read with the browser's Web Audio decoder; mixing, fades and resampling are fibub's own working."
flow:
  - { icon: file, label: "Open video" }
  - { icon: mic, label: "Open sound" }
  - { icon: sliders, label: "Mix" }
  - { icon: download, label: "Download" }
---

## What it does

This tool puts a sound file on a video: background music for a holiday clip, a voice-over for a tutorial, or a cleaner recording to replace noisy sound. It can replace the video's own sound or keep it and mix the new sound in, with volumes, a start time, fades and looping. The picture is copied exactly as it is, so nothing is lost and even long videos take seconds. It runs in your browser, so neither file is uploaded.

Trim the music to the right part first with the [[audio-trimmer]], take the sound off a video with [[mute-video]], or take sound out of another video with [[extract-audio]]. To join several clips before adding music, use the [[video-joiner]].

## How to use it

1. Press **Open the video**, then **Open the sound**.
2. Choose whether to **Replace** the video's own sound or **Keep it, mixed under the new sound**.
3. Set the volumes, where the sound starts, fades and looping. The line under the settings says how the lengths fit.
4. Press **Add the sound**, check it in the page, then **Download**.

## What each setting does

- **New sound volume** and **Video's own sound volume**: 100% is as it is; 50% is about 6 dB quieter. If the mix would clip, it is turned down for you, and the result says by how much.
- **Start the sound at**: seconds into the video before the new sound begins.
- **Skip the start of the sound**: leaves out the first seconds of the sound file, such as a long intro.
- **Fade in** and **Fade out**: smooth starts and ends; the fade-out ends where the sound ends or the video ends.
- **Repeat the sound**: loops a short track until the video ends.

## Worked example

A 2 s video and a 1 s sound with "Start at" 0.5 s: the sound plays from 0.5 s to 1.5 s and the rest is silent. With **Repeat** it plays again from 1.5 s to the end. The checks for this page do exactly this and measure where the sound is in the result.

## FAQs

**Can I use any song?** Only music you have the right to use. Many sites mute or block videos with copyrighted music.

**Which sound files work?** MP3, WAV, M4A, OGG and FLAC; Chrome and Edge read the most kinds.

**Is anything uploaded?** No. Everything happens on this device.
