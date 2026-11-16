---
name: Tone generator
num: 2241
shelf: everyday
code: T958
section: video-audio
title: "Tone generator: online test tones, frequency sweeps, white and pink noise, DTMF and dial tones"
summary: "Play or download a pure tone at any frequency, a sweep, white or pink noise, DTMF keypad tones or dial, ringing and busy signals, as WAV or u-law for phone systems. Made on your device."
status: live
ads: false
order: 2241
icon: wave
works: offline
updated: 2026-11-16
related: [audio-spectrum-analyser, mp3-to-ulaw, voice-recorder, wav-to-ulaw]
sources:
  - "DTMF frequency pairs from ITU-T Recommendation Q.23. Dial, ringing and busy tones from ITU-T Recommendation E.180 Supplement 2 (tones in national networks) for Canada and the USA, the UK and India, checked 2026-11-16; networks can differ, so check the official source for your operator. Pink noise filter by Paul Kellet (public domain). Waveform maths is fibub's own."
flow:
  - { icon: sliders, label: "Choose" }
  - { icon: play, label: "Play" }
  - { icon: download, label: "Save" }
---

## What it does

This tool makes test sounds: a pure tone at any frequency, a sweep from low to high, white or pink noise, touch-tone (DTMF) keys and the dial, ringing and busy signals that phone networks play. Play them through your speakers or headphones, or save them as a WAV file, or as raw u-law for a phone system. Everything is worked out on your device, so it keeps working with no internet once the page is open.

People use it to check speakers and headphones (a sweep shows where the bass fades out), to tune an instrument to a reference pitch, to find a rattle in a car, to test hearing ranges, to calibrate a sound meter, and to make DTMF and call-progress files for an Asterisk or FreePBX dial plan. To see the frequencies in a sound, play it into the [[audio-spectrum-analyser]]; to turn other sound files into phone audio, use [[mp3-to-ulaw]].

## How to use it

1. Pick **Tone**, **Sweep**, **Noise**, **Keypad (DTMF)** or **Phone signals**.
2. Set the frequency, length and volume. Start quiet.
3. Press **Play** to listen, or **Download WAV** / **Download .ulaw** to save.

## What each setting does

- **Frequency**: how high the tone is, in hertz (cycles a second). 440 Hz is the A above middle C; people hear roughly 20 Hz to 16,000 Hz, less with age.
- **Wave shape**: sine is a pure tone. Square, triangle and sawtooth add overtones, so they sound buzzier at the same pitch.
- **Sweep**: "even per octave" spends as long from 100 to 200 Hz as from 1,000 to 2,000 Hz, the usual speaker test; "even per hertz" moves at a steady rate.
- **Noise**: white noise has the same energy at every frequency and sounds like hiss; pink noise has the same energy in every octave and sounds softer, like rain. Pink is used to set up speakers and rooms.
- **Keypad**: each key plays its two tones (ITU-T Q.23) and is added to the box; save the sequence as one file.
- **Phone signals**: the dial, ringing and busy tones of North America, the UK and India.
- **Volume**: how far below full scale the loudest point is. −12 dB is a safe start; 0 dB is as loud as a file can be.
- **Sample rate**: 48,000 Hz for video and most uses, 44,100 Hz for music, 8,000 Hz for phone systems. A tone must be below half the sample rate.

## Worked example

Key 5 on a phone keypad is 770 Hz plus 1,336 Hz. Type `5#` with 100 ms per key and 100 ms gaps at 8,000 Hz and the file is 4 × 800 = 3,200 samples (0.4 s). The page's test measures both frequencies in the saved sound. The North American busy signal is 480 Hz plus 620 Hz, half a second on and half a second off.

## FAQs

**Is the frequency exact?** Yes, to well under 0.01 Hz: each sample is calculated, not looped from a table. Your speakers and room change what you hear, though.

**Why can I not hear a 19,000 Hz tone?** Most adults cannot hear that high, and many phone and laptop speakers cannot play it. That is normal.

**Can I put these tones on a phone system?** Yes. Choose 8,000 Hz and press **Download .ulaw** for Asterisk, or open the WAV in [[wav-to-ulaw]] for other formats.
