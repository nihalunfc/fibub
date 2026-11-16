---
name: WAV to u-law
num: 2239
shelf: everyday
code: T956
section: video-audio
title: "WAV to u-law: convert WAV to 8 kHz G.711 ulaw or alaw for phone systems"
seoTitle: "WAV to u-law and A-law converter (8 kHz), free online tool"
summary: "Convert WAV files to 8 kHz mono G.711 u-law or A-law, as a raw .ulaw/.alaw file or a CCITT u-law WAV, for Asterisk, 3CX, Cisco and other PBXs. Batch and ZIP. Nothing is uploaded."
status: live
ads: false
order: 2239
icon: phone
works: offline
updated: 2026-11-16
related: [mp3-to-ulaw, ulaw-to-wav, voice-recorder, tone-generator, audio-trimmer]
sources:
  - "ITU-T Recommendation G.711 (1988); encoding follows the public-domain Sun Microsystems g711.c reference used by sox, checked against ffmpeg. WAV format codes 6 (A-law) and 7 (mu-law) from the Microsoft RIFF specification (1991)."
flow:
  - { icon: file, label: "Open WAV" }
  - { icon: sliders, label: "Pick format" }
  - { icon: play, label: "Listen" }
  - { icon: download, label: "Download" }
---

## What it does

A PBX upload page that says "the file must be 8 kHz, 8-bit, mono, CCITT u-law" turns away the 44.1 kHz or 48 kHz WAV your recording app made. This tool converts WAV files into exactly that, or into a raw `.ulaw`, `.alaw` or `.sln` file for Asterisk, without installing sox or Audacity. It runs in your browser; the files stay on your device.

Any WAV works: 8, 16, 24 or 32-bit, floating point, mono or stereo, any sample rate. It also reads WAVs that are already u-law or A-law, so you can switch one to the other. Recorded the prompt yourself? Make it with the [[voice-recorder]] first. Starting from MP3 instead? Use [[mp3-to-ulaw]]. To listen to raw phone files, use [[ulaw-to-wav]].

## How to use it

1. Press **Open WAV files**, or drop up to 50 files on the box.
2. Under **Save as**, choose the format your phone system names.
3. Press **Play** to hear the 8 kHz version as a caller will.
4. Press **Download** on each file, or **Download all as a ZIP**.

## What each setting does

- **Save as**: raw u-law or A-law (one byte per sample, no header, Asterisk's `.ulaw` and `.alaw`), raw 16-bit `.sln`, WAV with u-law or A-law inside (format 7 or 6, with the "fact" chunk the format needs), or a plain 16-bit PCM WAV at 8 kHz.
- **Even out the volume**: makes the loudest point −3 dB. Leave it on for voice prompts recorded at different levels so callers hear them all at the same volume.

Stereo files are mixed to mono (the average of the two sides). Sound above 3.6 kHz is removed with a sharp filter before the rate drops to 8 kHz; without it, high notes fold back as whistles.

## Worked example

A 10-second, 16-bit stereo WAV at 48 kHz is 10 × 48,000 × 2 × 2 = 1,920,000 bytes. As u-law WAV it becomes 80,000 bytes of sound plus a 58-byte header: 80,058 bytes, 24 times smaller. As raw `.ulaw` it is exactly 80,000 bytes.

## FAQs

**What is the difference between u-law WAV and .ulaw?** The sound bytes are the same. The WAV has a header that says "u-law, 8 kHz, mono", so Windows and most PBX web pages can open it; the `.ulaw` file has no header, which is what Asterisk expects.

**My PBX says the file is the wrong format.** Some systems want 16-bit PCM at 8 kHz rather than u-law. Try the "16-bit WAV, 8 kHz mono" choice.

**Can I go back to a normal WAV?** Yes, open the file in [[ulaw-to-wav]]. The sound will be phone quality, because G.711 keeps only what a call carries.

**Is anything uploaded?** No. Your browser reads and writes the files on this device.
