---
name: Pitch shifter
num: 2265
shelf: everyday
code: T972
section: video-audio
title: "Pitch shifter: change the key of a song or voice without changing its speed"
seoTitle: "Pitch shifter: change key of audio, free online tool"
seoDescription: "Change the key of a song or voice by semitones and cents without changing its speed. Hear it, then save MP3 or WAV. Nothing is uploaded."
summary: "Move a song, backing track or voice up or down by semitones (and fine-tune in cents) while keeping its length and tempo. Plays in the page; saves MP3 or WAV. Nothing is uploaded."
status: live
ads: false
order: 2265
icon: wave
works: offline
updated: 2026-11-16
related: [audio-speed, instrument-tuner, audio-converter]
sources:
  - "Time-stretching by WSOLA (Verhelst and Roelands, 'An overlap-add technique based on waveform similarity', ICASSP 1993); resampling with a windowed-sinc filter. Code is fibub's own working, checked in tests/audio.mjs."
  - "Equal temperament: frequency ratio 2^(n/12) for n semitones. MP3 saving with LAME via lamejs (LGPL-3.0, credited in NOTICE)."
flow:
  - { icon: file, label: "Open sound" }
  - { icon: wave, label: "Set key" }
  - { icon: play, label: "Listen" }
  - { icon: download, label: "Download" }
---

## What it does

The pitch shifter raises or lowers every note in a sound by the same amount, without making it faster or slower. Singers use it to move a backing track into a key that suits their voice; players use it to match a recording that was tuned a little sharp or flat; teachers use it to make a piece easier to sing along with. It runs in your browser, so your file stays on your device.

Each semitone is one step on a piano keyboard; 12 semitones is an octave. Fine tune works in cents (hundredths of a semitone) for recordings that are slightly out from standard tuning. Check the tuning first with the [[instrument-tuner]], and use [[audio-speed]] if you want to change the tempo instead.

## How to use it

1. Press **Open a sound file**.
2. Set **Semitones** with the box or the slider: +2 moves a song in C up to D; −3 moves it from C down to A.
3. Add **Fine tune** in cents if needed, for example −20 for a record that plays sharp.
4. Press **Play the result**, then choose **Save as** and **Download**.

## What each setting does

- **Semitones**: whole steps from −12 (one octave down) to +12 (one octave up). The frequency of every note is multiplied by 2^(n/12): +1 is × 1.0595, +7 is × 1.4983, +12 is × 2.
- **Fine tune, cents**: from −50 to +50; 100 cents is a semitone.
- **Save as**: MP3 or WAV, as in the [[audio-converter]].

How it works: the sound is first stretched in time without changing its pitch (WSOLA), then resampled back to its original length, which moves the pitch by the same ratio.

## Worked example

A 440 Hz A shifted +4 semitones becomes 440 × 2^(4/12) = 554.4 Hz, a C♯, and the file stays exactly the same length. Shifted −12 it becomes 220 Hz. The checks for this page measure the result with the YIN pitch finder and expect it within 0.5 Hz.

## FAQs

**Why do voices sound odd after a big shift?** Moving a voice up a lot also moves the resonances of the singer's throat, which gives the "chipmunk" sound. Shifts of up to about 4 semitones sound natural.

**Does it change the speed?** No. The length is kept to the sample.

**Is my file uploaded?** No. Everything happens on this device.
