---
name: MP3 to u-law
num: 2238
shelf: everyday
code: T955
section: video-audio
title: "MP3 to u-law: convert MP3 to 8 kHz G.711 ulaw for Asterisk and PBX phone systems"
seoTitle: "MP3 to u-law converter for Asterisk and PBX phones"
summary: "Turn MP3 files into 8 kHz mono G.711 u-law (or A-law) for Asterisk, FreePBX, 3CX and other phone systems: raw .ulaw, u-law WAV or 16-bit .sln. Several files at once. Nothing is uploaded."
status: live
ads: false
order: 2238
icon: phone
works: offline
updated: 2026-11-16
related: [wav-to-ulaw, ulaw-to-wav, tone-generator, voice-recorder, audio-trimmer]
sources:
  - "ITU-T Recommendation G.711 (1988), Pulse code modulation of voice frequencies; encoding follows the public-domain Sun Microsystems g711.c reference used by sox, and is checked against ffmpeg. WAV layout as published by Microsoft and IBM (1991). Asterisk file extensions (.ulaw, .alaw, .sln) as in the Asterisk documentation, checked 2026-11-16."
flow:
  - { icon: file, label: "Open MP3" }
  - { icon: sliders, label: "Pick format" }
  - { icon: play, label: "Listen" }
  - { icon: download, label: "Download" }
---

## What it does

Phone systems do not play MP3 files well. Asterisk, FreePBX, Issabel, 3CX, Cisco and most other PBXs want hold music, greetings and menu prompts ("press 1 for sales") in the same form a phone call carries: 8,000 samples a second, one channel, coded with G.711 u-law (North America and Japan) or A-law (Europe, India and most other places). This tool converts MP3 files into that form on your own device. Nothing is uploaded, so recordings of staff voices or customer names never leave your computer.

It mixes stereo down to mono, filters out sound above 3.6 kHz so music does not turn into a whistle, resamples to 8 kHz and can even out the volume. You can convert up to 50 files at once and download them one by one or in a ZIP. If your files are WAV, the [[wav-to-ulaw]] page does the same job; to check a recording that came off the phone system, open it in [[ulaw-to-wav]].

## How to use it

1. Press **Open MP3 files** (or drop files on the box). WAV, M4A, OGG and FLAC work too.
2. Pick the format your phone system wants under **Save as**.
3. Press **Play** on a file to hear how it will sound on a call.
4. Press **Download**, or **Download all as a ZIP**.

## Which format to choose

- **Raw u-law .ulaw**: Asterisk and FreePBX's own sound format in North America. Copy it to `/var/lib/asterisk/sounds/custom/` and play it with `Playback(custom/name)`, leaving off the extension.
- **Raw A-law .alaw**: the same for systems on A-law trunks (Europe, India, the Gulf, Australia).
- **Raw 16-bit .sln**: Asterisk's uncoded 8 kHz format. Asterisk converts it to whatever the call uses.
- **u-law or A-law WAV**: one file with a header, which 3CX, Cisco CallManager, Avaya and many hosted PBXs ask for as "CCITT u-law 8 kHz 8-bit mono".
- **16-bit WAV, 8 kHz mono**: the safest choice for a PBX upload page that says "8 kHz 16-bit mono WAV".
- **Even out the volume**: scales each file so its loudest point is 3 dB below full scale. Untick it to keep the original level.

## Worked example

A 30-second MP3 greeting, stereo at 44.1 kHz, is about 480 KB. As raw u-law it becomes 30 × 8,000 = 240,000 bytes (240 KB), one byte per sample. As .sln it is twice that (480 KB), and as u-law WAV it is 240 KB plus a 58-byte header. The test for this page checks those sizes byte for byte.

## FAQs

**Is this the same as sox or ffmpeg?** The encoder follows the ITU G.711 reference code that sox uses. It was checked against ffmpeg on every 16-bit value: decoding matches exactly, and encoding matches or picks the neighbouring level at a boundary (ffmpeg rounds where the reference cuts down), which nobody can hear.

**Why does it sound worse than the MP3?** Phone calls only carry sound up to about 3.4 kHz, so cymbals and the "s" sounds go. That is what callers will hear anyway; the Play button lets you check it first.

**u-law or A-law?** Use what your phone lines use: u-law in the USA, Canada and Japan; A-law almost everywhere else. If you are not sure, a 16-bit WAV or .sln lets the PBX convert it.

**Does it use my data?** No. The files are decoded by your browser on this device and nothing is sent anywhere.
