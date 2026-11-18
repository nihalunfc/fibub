---
name: Stem splitter
num: 3041
shelf: everyday
code: T1014
section: production
title: "Stem splitter: separate vocals, drums and bass from a song in your browser"
seoTitle: "Stem splitter: vocals, drums and bass, free online tool"
summary: "Split a song into vocals and instrumental, drums and melodic parts, or bass and the rest with classic signal maths. Preview each stem with solo and mute, save WAV or MP3. Nothing is uploaded."
status: live
ads: false
order: 3041
icon: sliders
works: offline
updated: 2026-11-18
related: [audio-repair, sample-chopper, pitch-shifter, audio-trimmer, extract-audio]
sources:
  - "Drums and melodic split: D. FitzGerald, \"Harmonic/percussive separation using median filtering\", Proc. 13th International Conference on Digital Audio Effects (DAFx-10), Graz, 2010."
  - "Centre (vocal) detection: C. Avendano and J.-M. Jot, \"A frequency-domain approach to multichannel upmix\", Journal of the Audio Engineering Society 52(7/8), 2004 (inter-channel similarity). The rest of the method and the code are fibub's own."
flow:
  - { icon: file, label: "Open song" }
  - { icon: sliders, label: "Pick split" }
  - { icon: play, label: "Solo, mute" }
  - { icon: download, label: "Save stems" }
---

## What it does

The Stem splitter pulls a mixed song apart into two stems: vocals and instrumental, drums and melodic parts, or bass and everything else. It uses classic signal maths, not an AI model, and never uploads the song. The results are rougher than AI separators: it works best on stereo mixes with the vocal in the centre, and a little of each part bleeds into the other. To cut the part you want first, open the song in the [[audio-trimmer]]; to clean a stem afterwards use [[audio-repair]], or move it to a new key with the [[pitch-shifter]].

## How to use it

1. Press **Open a song** (MP3, WAV, M4A, FLAC, OGG; up to 20 minutes).
2. Choose what to split into and press **Split**. A bar shows progress; **Cancel** stops it.
3. Press **Play**, then **Solo** or **Mute** each stem to hear it on its own.
4. Press **Save** on a stem, or **Save both as ZIP**.

## How each split works

- **Vocals and instrumental**: a sound that is the same in both speakers (panned to the centre), steady and pitched (not a drum hit), and between 100 Hz and 8 kHz goes to vocals. Everything else is the instrumental.
- **Drums and melodic parts**: notes are smooth along time, hits are smooth across frequency. A median filter along each direction tells them apart (FitzGerald, 2010).
- **Bass and everything else**: the pitched part below the **bass cutoff** (150 Hz unless you change it).

The two stems always add back up to the original, sample for sample.

## Worked example

A 3-second test with a 660 Hz tone in both speakers and a 523 Hz tone in the left speaker only, each at the same level, splits into 67 % vocals and 33 % instrumental: the centred tone (two speakers' worth of energy) goes to vocals and the side tone stays in the instrumental.

## FAQs

**Why does the vocal stem still have some music in it?** Anything centred, steady and in the voice band looks like a voice to this method, such as a centred lead guitar. Try **Strong** separation in More options.

**Does it work on mono recordings?** Drums and bass splits do. A mono file has no left and right to compare, so the vocal split is rough.

**Is my song uploaded?** No. Everything runs in your browser, offline too.
