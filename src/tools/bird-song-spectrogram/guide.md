---
name: Bird song spectrogram
num: 318
shelf: science
code: T233
section: zoology-and-animal-behaviour
title: "Bird song spectrogram: see a WAV recording, measure peak frequency, bandwidth and note lengths (free, no upload)"
summary: "Open a WAV recording of a bird, frog, bat (if your recorder captures it) or insect and see its spectrogram. Set the FFT size, window, overlap, frequency range and contrast, then drag over a phrase to get its peak frequency, bandwidth and the length of every note. Your recording never leaves your device."
status: live
ads: false
order: 318
icon: chart
works: offline
updated: 2026-11-09
related: [period-finder, wave-calculator, biodiversity-indices, plot-maker, audio-spectrum-analyser, fft-workbench, notch-filter-psd, ethogram-logger, pitch-contour-tracker]
sources:
  - "Short-time Fourier transform and one-sided power spectral density as in SciPy (scipy.signal.spectrogram, density scaling, periodic windows); Hann, Hamming and Blackman windows from F. J. Harris, Proc. IEEE 66 (1978) 51–83. Written by fibub."
  - "Checked in the tests against scipy.signal.spectrogram 1.18 (same window, overlap, no detrending) to 1 part in 100 000, and against Parseval's theorem for a pure tone. Viridis colours: the polynomial fit by Matt Zucker of the matplotlib map (CC0)."
  - "The example song is synthetic and made up for this page."
flow:
  - { icon: file, label: "Open WAV" }
  - { icon: sliders, label: "Settings" }
  - { icon: target, label: "Select" }
  - { icon: chart, label: "Measure" }
---

## What it does

A spectrogram shows a sound as a picture: time runs left to right, pitch (frequency) runs bottom to top, and the darker a spot is, the louder that pitch is at that moment. It is how ornithologists, bioacousticians and students compare songs, count notes and measure how high or how fast a call is. This tool draws one from a WAV recording and measures any part you select: the **peak frequency**, the **bandwidth**, and the **start, end and length of each note**, with the gaps between them.

Everything happens in your browser. The recording is read by this page on your own device and is never uploaded or stored.

Log what the birds were doing while they sang with the [[ethogram-logger|ethogram logger]], and trace the pitch of each note with the [[pitch-contour-tracker|pitch contour tracker]].

## How to use it

1. Press **Open a WAV file** (or drop the file on the page). Stereo files are mixed to mono. If your phone or recorder saves MP3 or M4A, convert it to WAV first, for example in Audacity (File, Export, WAV). The page opens with a made-up example song so you can try everything first.
2. Choose what to show: **Show from / to** picks the stretch of time (up to about 30 s is drawn at once with the default settings), and the **lowest and highest frequency** crop the picture to the band your animal uses.
3. **Drag across the spectrogram** to put a box around a note, a phrase or a whole song. The numbers and the notes table update at once. You can also type the box edges.
4. Download the result as an image, PDF or Word file, or the notes as CSV for a spreadsheet.

## What each setting does

- **FFT size**: how many samples go into each slice. A bigger size gives finer frequency steps (sample rate ÷ FFT size) but blurs timing; a smaller one sharpens timing but smears pitch. 512 at 22–48 kHz suits most songbirds.
- **Window**: the taper applied to each slice. Hann is a good default; Blackman leaks less between frequencies (cleaner pure whistles); Hamming sits between; rectangular is sharpest but leaks the most.
- **Overlap**: how much each slice shares with the next. More overlap makes the picture smoother in time without changing its resolution.
- **Contrast**: how many decibels below the loudest point are still drawn. Lower it to hide background noise, raise it to see faint harmonics.
- **Colours**: grey (loud is dark) or the colour-blind safe viridis map.
- **Bandwidth level**: the bandwidth is measured where the average spectrum of the selection falls this many dB below its peak (10 dB is common; 3 or 6 dB give narrower values).
- **Note threshold**: a slice belongs to a note when the sound power in the selected band is within this many dB of the loudest slice. **Shortest note** drops blips shorter than this; **Join gaps under** merges notes separated by less than this.

## Worked example

The made-up example is 2 s of synthetic song at 22 050 samples per second: four whistles that fall from 5 to 3 kHz, each 0.15 s long, then a trill of six 40 ms notes at 4 kHz. With the default settings (FFT 512, Hann, 75 % overlap) each slice covers 23.2 ms, the frequency step is 43.07 Hz and the time step is 5.80 ms.

With everything selected the tool finds **10 notes**. The whistles measure **163 ms** and the trill notes **46.4 ms**: a little longer than they really are (150 and 40 ms), because each slice is 23 ms wide and catches the start of a note early and its end late. With FFT size 256 the timing is sharper and the lengths come closer to the truth. The table shows each whistle starting at 4.95 kHz and ending at 3.06 kHz (peak 4.867 kHz), and the trill notes at 4.005 kHz. The average spectrum of the whole selection peaks at 4.001 kHz with a −10 dB bandwidth of 1.84 kHz (3.08 to 4.92 kHz).

## Tips

- Note lengths can never be sharper than the time step and are stretched by up to about one slice. For short, fast notes use a smaller FFT size; for pitch, use a bigger one.
- Select just the band of your bird to keep wind and traffic (usually below 1 kHz) out of the note detection.
- Measure several renditions of a song and average them; one song is one sample.
- A sample rate of 44.1 or 48 kHz records up to 22–24 kHz. Bat calls need a bat detector that records at a much higher rate.

## FAQ

**Can I record with the microphone here?** Not on this page yet. Record with your phone's recorder app, save or convert to WAV, and open the file.

**Why is the peak frequency not exactly a multiple of the frequency step?** The tool fits a curve through the loudest step and its neighbours, which pins the peak to within a few hertz.

**Is my recording uploaded?** No. It is read in your browser and nothing is sent anywhere.

**Is the decibel scale calibrated?** No. Levels are relative to the file's full scale, so compare them only within one recording.
