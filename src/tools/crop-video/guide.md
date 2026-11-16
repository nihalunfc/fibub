---
name: Crop video
num: 2261
shelf: everyday
code: T978
section: video-audio
title: "Crop video: cut the edges off a video, square, 9:16 or any size"
seoTitle: "Crop video to square, 9:16 or any size, free online tool"
summary: "Crop a video to a square, 9:16 for Reels and Shorts, 4:5, 16:9 or any size: drag the box to choose what stays. Nothing is uploaded."
status: live
ads: false
order: 2261
icon: crop
works: offline
updated: 2026-11-16
related: [rotate-video, video-compressor, video-trimmer]
sources:
  - "Reading, writing and converting video with Mediabunny (MPL-2.0, credited in NOTICE), using the browser's own WebCodecs encoder and decoder (W3C). Nothing is uploaded."
flow:
  - { icon: file, label: "Open video" }
  - { icon: crop, label: "Place box" }
  - { icon: convert, label: "Crop" }
  - { icon: download, label: "Download" }
---

## What it does

Cropping keeps part of the picture and cuts the rest away: black bars, a messy edge, or everything except the person speaking. Social sites want particular shapes, such as square for some feeds, 9:16 for Reels, Shorts and TikTok, and 4:5 for portrait posts, so this tool has those shapes ready. It runs in your browser, so the video is not uploaded.

Choose a shape, then drag the box over the preview to choose what stays; the darker area is cut away. To turn a sideways video first, use [[rotate-video]]; to make the result smaller, the [[video-compressor]]; to cut it shorter, the [[video-trimmer]].

## How to use it

1. Press **Open a video**. A box shows the largest crop of the chosen shape, centred.
2. Choose the **Shape**, and use **Size** to make the box smaller.
3. Drag the box (or select it and use the arrow keys) to choose what stays. For an exact crop, type **Left**, **Top**, **Width** and **Height** in pixels.
4. Press **Crop the video**, check the result in the page, then **Download**.

## What each setting does

- **Shape**: square 1:1, tall 9:16, portrait 4:5, wide 16:9, 4:3, or Free to type any size.
- **Size**: 100% is the biggest box of that shape that fits; smaller zooms in.
- **Left, Top, Width, Height**: the crop in the video's own pixels. Sizes are rounded to even numbers, which video encoders need.

## Worked example

A 320 × 240 video cropped to a square at 100% keeps a 240 × 240 box from 40 px in from the left. The result is a 240 × 240 video, with the sound unchanged. The checks for this page do exactly this and check the size of the new video.

## FAQs

**Does cropping lower the quality?** The picture is encoded again, at a high quality setting. The cropped part keeps its pixels: nothing is stretched.

**Can I crop and turn at once?** Turn first with [[rotate-video]] (the quick way takes seconds), then crop.

**Is my video uploaded?** No. Everything happens on this device.
