---
name: U-law to WAV
num: 2240
shelf: everyday
code: T957
section: video-audio
title: "U-law to WAV: play and convert .ulaw, .alaw and .sln phone recordings"
seoTitle: "U-law to WAV converter and .ulaw player, free online tool"
summary: "Open raw .ulaw, .alaw and .sln files from Asterisk and other phone systems, or u-law and A-law WAVs, listen to them and save a normal 16-bit WAV. Nothing is uploaded."
status: live
ads: false
order: 2240
icon: phone
works: offline
updated: 2026-11-16
related: [mp3-to-ulaw, wav-to-ulaw, audio-trimmer, audio-spectrum-analyser]
sources:
  - "ITU-T Recommendation G.711 (1988), decoding as in the public-domain Sun Microsystems g711.c reference and checked against ffmpeg for all 256 codes. Sun/NeXT .au header and Microsoft RIFF WAV layouts; Asterisk file names (.ulaw, .alaw, .sln, .sln16) from the Asterisk documentation, checked 2026-11-16."
flow:
  - { icon: file, label: "Open file" }
  - { icon: play, label: "Listen" }
  - { icon: download, label: "Save WAV" }
---

## What it does

Phone systems keep voicemail, call recordings and menu prompts in formats that ordinary players will not open: a raw `.ulaw` or `.alaw` file has no header at all, just one byte per sample of 8 kHz G.711 sound, and many media players refuse a WAV with u-law inside. This tool decodes those files in your browser so you can listen to them, and saves each one as a standard 16-bit WAV that every player, editor and transcription app opens. Call recordings are private, so nothing is uploaded: the files never leave your device.

It reads raw u-law, raw A-law, raw 16-bit signed linear (`.sln`, `.sln16` and others), Sun `.au` files and WAVs coded as u-law, A-law, PCM or floating point. To make phone files from your own sound, go the other way with [[mp3-to-ulaw]] or [[wav-to-ulaw]]; to cut a recording down, open the WAV in the [[audio-trimmer]].

## How to use it

1. Press **Open phone recordings** and choose one or more files (or drop them on the box).
2. Press **Play** to listen.
3. Press **Download WAV**, or **Download all as a ZIP** for several.

## What each setting does

- **Raw files are**: how a file with no header is coded. "Guess from the name" uses the extension: `.ulaw`, `.ul`, `.mu` and `.pcm` are u-law (`.pcm` is u-law in Asterisk); `.alaw` and `.al` are A-law; `.sln` and `.raw` are 16-bit. If a file sounds like loud hiss, it is probably the other law: switch and it is read again.
- **Raw file sample rate**: raw files do not record their speed. Phone audio is 8,000 Hz. If a voice sounds like a chipmunk or very slow, try 16,000 Hz.

WAV and `.au` files carry their own settings, so these two choices do not change them.

## Worked example

Asterisk saves a 45-second voicemail as `msg0001.ulaw`: 45 × 8,000 = 360,000 bytes. Opened here it is read as raw u-law at 8,000 Hz and shown as 45 seconds, mono. The WAV it saves holds 16-bit samples, so it is 360,000 × 2 + 44 = 720,044 bytes.

## FAQs

**Why is the WAV bigger than the .ulaw file?** u-law squeezes each sample into 8 bits; a normal WAV stores 16. The sound is the same; there is just more room per sample.

**Will it sound better as WAV?** No. Phone audio stops at about 3.4 kHz, and converting cannot bring back what the call did not carry. It only makes the file easier to open.

**Can it read .gsm or .g729 files?** Not yet; those codecs need their own decoders. Most PBXs can be set to record in u-law (wav49 and gsm are the usual alternatives).

**Is anything uploaded?** No. Everything happens in your browser on this device.
