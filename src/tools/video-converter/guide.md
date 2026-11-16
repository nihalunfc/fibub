---
name: Video converter
num: 2406
shelf: everyday
code: T976
section: video-audio
title: "Video converter: convert MOV, MKV or WebM to MP4, and MP4 to WebM or MOV"
seoTitle: "Video converter: MOV, MKV, WebM to MP4, free online tool"
seoDescription: "Convert MOV, MKV and WebM to MP4, or MP4 to WebM, MOV or MKV. Copies without loss when it can. Runs in your browser; nothing is uploaded."
summary: "Convert videos between MP4, WebM, MOV and MKV. When the streams fit the new format they are copied without loss in seconds; otherwise they are encoded again. Nothing is uploaded."
status: live
ads: false
order: 2406
icon: convert
works: offline
updated: 2026-11-16
related: [video-compressor, extract-audio, video-info, gif-to-mp4]
sources:
  - "Reading, writing and converting video with Mediabunny (MPL-2.0, credited in NOTICE), using the browser's own WebCodecs encoder and decoder (W3C). Nothing is uploaded."
flow:
  - { icon: file, label: "Open video" }
  - { icon: sliders, label: "Choose" }
  - { icon: convert, label: "Convert" }
  - { icon: download, label: "Download" }
---

## What it does

A video file is a container (MP4, MOV, MKV or WebM) holding a picture stream and a sound stream. Some apps and sites only take certain containers: iPhones record MOV, screen recorders often save WebM or MKV, and many upload forms want MP4. This tool converts between them in your browser, so nothing is uploaded.

It copies streams as they are whenever the new container can hold them, which takes seconds and loses nothing: an iPhone MOV with H.264 becomes an MP4 almost at once. Only when needed does it encode again (to H.264 and AAC for MP4 and MOV, VP9 and Opus for WebM). To make the file smaller as well, use the [[video-compressor]]; to keep only the sound, use [[extract-audio]]; to see what is inside a file first, use [[video-info]].

## How to use it

1. Press **Open a video**.
2. Choose what to **Convert to**.
3. Press **Convert**. The result says whether the picture was copied or encoded again.
4. Check it in the page, then **Download**.

## What each setting does

- **MP4**: H.264 video and AAC sound, the pair that plays on every phone, TV, computer and site.
- **WebM**: VP9 (or VP8) and Opus, for web pages and some editors.
- **MOV**: Apple's container, for iMovie, Final Cut and QuickTime.
- **MKV**: holds almost anything, so it usually copies every stream.
- **Remove the sound**: leaves the sound out.

## Worked example

A WebM screen recording with VP8 video, converted to MP4: VP8 does not belong in MP4, so the picture is encoded to H.264, which takes about as long as the video plays. A 300 MB MOV from an iPhone (H.264 and AAC), converted to MP4, is copied in a few seconds and stays about 300 MB. The checks for this page convert a VP8 WebM test clip to MP4 and back.

## FAQs

**Can it open AVI or WMV?** Not yet: the browser has no reader for those old formats.

**Does converting lower the quality?** Not when streams are copied. When they are encoded again, the quality is set high; the difference is hard to see.

**Is my video uploaded?** No. Everything happens on this device.
