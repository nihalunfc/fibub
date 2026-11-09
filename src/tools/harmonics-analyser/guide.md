---
name: Instrument harmonics analyser
num: 422
shelf: science
section: musicology-and-music-acoustics
title: "Instrument harmonics analyser: spectrum, fundamental, harmonic levels, inharmonicity and spectral centroid from a sound file"
summary: "Open a recording of one note (or record it with your microphone after pressing a button) and get its spectrum, fundamental frequency and nearest note, the level and tuning of each harmonic, the inharmonicity of stiff strings and the spectral centroid, with charts and CSV. The sound never leaves your device."
status: live
ads: false
order: 422
icon: chart
works: offline
updated: 2026-11-09
related: [tuning-calculator, wave-calculator, period-finder, tempo-detector, audio-spectrum-analyser, fft-workbench, standing-waves, bird-song-spectrogram]
sources:
  - "Discrete Fourier transform with Hann, Hamming, Blackman or rectangular windows and frame averaging (Welch), parabolic interpolation of spectral peaks, the stiff-string partial formula fₙ = n f₀ √(1 + B n²) (Fletcher), and the spectral centroid: standard signal processing and musical acoustics."
  - "Checked against NumPy (rfft) and SciPy windows on a synthetic tone with stretched partials and noise: spectrum values to 10⁻¹², the five strongest peak frequencies and levels to 10⁻⁹ and the centroid to 10⁻⁸; f₀ and B recovered from tones of known f₀ (41 to 1047 Hz) and B."
  - "The example tone is synthesised by the page; it is not a recording."
flow:
  - { icon: file, label: "Sound" }
  - { icon: sliders, label: "Settings" }
  - { icon: chart, label: "Spectrum" }
  - { icon: table, label: "Harmonics" }
---

## What it does

A musical note is a mix of a fundamental and its overtones. How strong each overtone is gives an instrument its colour, and how far the overtones sit from exact whole-number multiples tells you about the string, pipe or bar that made them. This analyser takes one note and shows:

- the **spectrum** (level in dB against frequency), averaged over overlapping frames with the window you choose;
- the **fundamental** frequency, the nearest note and how many cents it is off 12-tone equal temperament (A4 = 440 Hz);
- each **harmonic**: its measured frequency, how many cents it sits above or below n × f₀, and its level in dB, also relative to the strongest;
- the **inharmonicity coefficient B** from fₙ = n f₀ √(1 + B n²): near 0 for winds and bowed strings, clearly above 0 for pianos, guitars and bells;
- the **spectral centroid**, the amplitude-weighted mean frequency, a common measure of brightness, also as a multiple of f₀.

Compare the partials you find with ideal tunings in the [[tuning-calculator|tuning calculator]], and look at the whole sound over time with the [[audio-spectrum-analyser|audio spectrum analyser]].

## How to use it

1. Press **Open an audio file** and pick a recording of one sustained note (WAV, MP3, OGG, FLAC or M4A). Or press **Record from the microphone**: your browser asks first, the recording lasts the time you choose, and it stays in the page's memory only. If the microphone is blocked, record with another app and open the file.
2. Set **Analyse from** and **Length** to a steady part of the note, after the attack.
3. Choose the **FFT size** and **window**. Hann is a good default; Blackman shows weak partials next to strong ones better; a longer FFT separates partials that are close together.
4. If the pitch is found an octave off, type the **fundamental** yourself.

## Worked example

Press **Use the example**: the page makes a stiff-string tone at 110 Hz with 24 partials stretched by B = 0.0003. Analysing 1 s from 0.1 s with a 16,384-point Hann window (4 frames averaged, 2.69 Hz per bin), it reports **Fundamental 109.99 Hz (A2 −0.1 ¢)**, inharmonicity B = 3.01 × 10⁻⁴ and 16 of 16 harmonics found. The partials run progressively sharp: the 2nd harmonic is 0.9 cents above 2 × f₀, the 8th 16.6 cents, the 16th 64.2 cents, exactly the stretching a piano tuner meets. The 2nd harmonic is 7.2 dB below the fundamental and the 16th 28.6 dB below.

## Tips

- Record close to the instrument in a quiet room, without clipping. The page warns if the analysed part reaches full scale.
- Compare instruments or playing styles with the same settings and segment length.
- The spectrum CSV has every bin, for your own plots; the harmonics CSV has the table.

## FAQ

**Why is the fundamental an octave off?** Some sounds have a weak or missing fundamental, or very strong even harmonics. The page uses all the harmonics to decide, but you can type the fundamental to override it.

**Is my recording kept or uploaded?** No. The file or recording is decoded in your browser, held only while the page is open, and never sent anywhere.
