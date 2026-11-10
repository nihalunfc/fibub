---
name: Audio spectrum analyser
num: 940
shelf: science
code: T675
section: acoustics-and-wave-physics
title: "Audio spectrum analyser: live microphone FFT, spectrogram and peak frequency (or open an audio file)"
summary: "See the frequencies in a sound: a live spectrum and scrolling spectrogram from your microphone, or the averaged spectrum of an audio file, with the strongest peaks found to a fraction of a hertz and named as musical notes. Choose the FFT size and window, and download the spectrum as CSV. The sound stays on your device."
status: live
ads: false
order: 3
icon: chart
works: offline
updated: 2026-11-09
related: [room-acoustics, decibel-distance, period-finder, standing-waves, harmonics-analyser, tuning-calculator, doppler-beats, fft-workbench, bird-song-spectrogram]
sources:
  - "Fast Fourier transform (Cooley and Tukey, 1965), Hann, Hamming and Blackman windows, Welch's averaged periodogram (Welch, 1967) and parabolic peak interpolation: standard signal processing, written by fibub."
  - "Equal-tempered note names from f = 440 · 2^((n − 69)/12) (A4 adjustable)."
  - "Checked against NumPy (numpy.fft.rfft) and SciPy (scipy.signal.get_window and scipy.signal.welch), and against tones of known frequency. The test sound is made up."
flow:
  - { icon: sliders, label: "Sound" }
  - { icon: sigma, label: "FFT" }
  - { icon: chart, label: "Spectrum" }
  - { icon: target, label: "Peaks" }
---

## What it does

Every sound is a mix of pure tones. This analyser splits a sound into its frequencies with a **fast Fourier transform (FFT)** and shows:

- the **spectrum**: how loud each frequency is, in dBFS (decibels below the loudest level the recording can hold);
- a **spectrogram**: frequency up, time across, brighter for louder, so you can watch a whistle rise or a note decay;
- the **strongest peaks**, refined between FFT bins to a fraction of a hertz, with the nearest **musical note** and how many cents sharp or flat it is.

It works **live from the microphone** or on an **audio file** (WAV, MP3, OGG, FLAC and others your browser can decode). For a file, the spectra of overlapping slices are averaged (Welch's method), which gives a steady, low-noise picture. The page never records, saves or uploads the sound: it is analysed in the browser and thrown away. There are no adverts on this tool.

Analyse a recorded file in more depth with the [[fft-workbench]], or study an instrument's overtones with the [[harmonics-analyser|instrument harmonics analyser]].

## How to use it

1. Press **Start microphone** and allow it when the browser asks, or **open an audio file**, or press **Try a test sound**.
2. Choose the **FFT size**. Bigger sizes separate close frequencies better (the resolution is the sample rate divided by the size) but follow changes more slowly.
3. Choose a **window**: Hann suits most sounds; Blackman keeps a loud tone from hiding a quiet one next to it; rectangular gives the sharpest peak for a tone that fits the frame exactly.
4. Set the **frequency axis** (logarithmic is how we hear), the **lowest level shown**, the live **smoothing** and **peak hold**.
5. Read the peaks table. **Freeze** holds the live picture; **Stop** switches the microphone off. Download the spectrum as **CSV**, or the report as an image, PDF or Word file.

## Worked example

Press **Try a test sound**: a made-up 2-second sound at 44.1 kHz with a 1 kHz tone at half of full scale and a quieter 3.15 kHz tone at a twentieth. With the default 4096-point Hann window the page averages 42 frames at a resolution of 10.8 Hz and shows **Peak 999.9 Hz (B5 +21 cents), −6.0 dBFS**. The second peak is **3.1499 kHz** at −25.8 dBFS, a G7. The overall level is −9.0 dBFS. A tone at half of full scale has a peak of 20·lg 0.5 = −6.0 dBFS, as shown. Switch to 16384 points and the resolution becomes 2.69 Hz and the peak reads 1000.0 Hz. Change the tuning to A4 = 432 Hz and the same tone becomes C6 −47 cents.

## Tips

- Phone and laptop microphones are not calibrated and often cut below about 100 Hz, so treat levels as relative. For sound pressure levels use a calibrated sound level meter.
- To tune an instrument, play one steady note and read the top peak; the cents show how far it is from the nearest note.
- Hum at 50 or 60 Hz and their multiples is mains interference.

## FAQ

**Is my sound recorded or sent anywhere?** No. The microphone samples go straight into the analysis in this page and are discarded; nothing is saved or uploaded, and the page works offline.

**Why does the browser say the microphone is switched off for this site?** The site can block the microphone for all pages. You can still open an audio file.

**Why is the peak not exactly the frequency I played?** The FFT measures in steps (bins); the page fits a parabola across the top three bins, which is accurate to a small fraction of a bin for a steady tone. Use a bigger FFT size for more precision.
