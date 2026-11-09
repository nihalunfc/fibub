---
name: Pitch contour tracker
num: 735
shelf: science
section: linguistics-and-phonetics
title: "Pitch tracker: F0 contour of a voice recording in Hz and semitones, by YIN or autocorrelation (free)"
summary: "Open a WAV recording and track its pitch (F0) every 10 ms with the YIN method or autocorrelation. Set the pitch range, voicing threshold and smoothing; see the contour in Hz and semitones with mean, range and SD; download CSV. Nothing is uploaded."
status: live
ads: false
order: 735
icon: curve
works: offline
updated: 2026-11-09
related: [plot-maker, trend-analyser, period-finder, vowel-formant-chart, audio-spectrum-analyser, tuning-calculator, ipa-keyboard]
sources:
  - "Methods: YIN, de Cheveigné and Kawahara (2002), J. Acoust. Soc. Am. 111, 1917; normalised autocorrelation pitch detection (textbook method, e.g. Rabiner and Schafer, Digital Processing of Speech Signals). Semitones: 12 log2(f / reference)."
  - "Example sound: made up for this page (a synthetic voice with an invented pitch contour)."
flow:
  - { icon: file, label: "Open a WAV" }
  - { icon: sliders, label: "Pitch range" }
  - { icon: curve, label: "Contour" }
  - { icon: download, label: "CSV" }
---

## What it does

Pitch is how high or low a voice sounds; its physical measure is the **fundamental frequency, F0**, the number of times the vocal folds vibrate per second. Intonation (a question rising at the end, a statement falling), lexical tone in languages such as Mandarin or Yoruba, stress and emotion all show up in the F0 contour.

This tool tracks F0 every 10 ms through a recording and draws the contour in hertz and in semitones. It runs in your browser, so recordings never leave your device.

Measure the vowels in the same recording with the [[vowel-formant-chart]], and look at its full spectrum with the [[audio-spectrum-analyser]].

## How to use it

1. **Open a sound file** (WAV of any bit depth and sample rate; MP3, M4A or OGG are decoded by your browser) or press **Load the made-up example**. Sounds above 16 kHz are resampled to 16 kHz, which is plenty for pitch. Up to 120 seconds are analysed.
2. **Method.** *YIN* (the default) looks for the delay at which the waveform best matches itself, using a normalised difference that avoids most octave errors. *Autocorrelation* looks for the delay with the highest correlation, the classic method; it is included for comparison.
3. **Lowest and highest pitch.** Set these around the speaker's voice: about 75 to 250 Hz for most men, 120 to 500 Hz for most women and children. A tighter range is the best cure for octave jumps.
4. **Voicing threshold.** Decides whether a frame has a pitch at all. For YIN a frame is voiced when its normalised difference dips below the threshold (0.10 to 0.20 usual; lower is stricter). For autocorrelation it is voiced when the correlation peak is above the threshold (0.4 to 0.6 usual; higher is stricter).
5. **Silence below** marks frames quieter than this share of the loudest frame as unvoiced, so pauses and breath noise do not get a pitch.
6. **Smoothing** replaces each value by the median of 3, 5 or 7 neighbouring frames inside the same voiced stretch, which removes single-frame jumps without blurring real rises.
7. **Semitones relative to** 100 Hz, or to the median of the recording, which makes speakers with different voice heights comparable.
8. Download the contour as CSV (time, smoothed and unsmoothed F0, semitones, voicing strength, loudness), or the charts and summary as an image, PDF or Word file.

## Worked example

Press **Load the made-up example**. It is a synthetic voice: a statement whose pitch falls smoothly from 180 to 120 Hz, a quarter-second pause, then a question rising from 130 to 220 Hz. With the defaults (YIN, 75 to 500 Hz, threshold 0.15, smoothing 5 frames) the tool reports **median pitch 155 Hz, range 10.1 semitones**, lowest and highest 121 and 217 Hz, and 79 % of the frames voiced; the pause and the silence at the ends are correctly left without a pitch. The true range of the example is 120 to 220 Hz, 10.5 semitones; the smoothing and the 10 ms frame step trim a little off each end. In semitones relative to 100 Hz the statement falls from about 10 to 3 st and the question rises from about 4.5 to 13.6 st.

## Tips

- Check the contour for sudden jumps to half or double the surrounding values: those are octave errors. Narrow the pitch range around the voice to remove them.
- Creaky voice at the ends of phrases often gives scattered low points; raising the lowest pitch hides them if they are not what you study.
- Use semitones when comparing speakers: a rise of 3 semitones sounds the same size in a low and a high voice, while the same rise in hertz does not.

## FAQ

**How accurate is it?** On steady tones and on a gliding tone, YIN here agrees with an independent Python implementation to 10⁻⁹ Hz and with the true pitch to within 0.5 %. Real voices are less regular, so always look at the contour.

**Will it match Praat?** Closely for clear voices, not exactly: Praat's default pitch method is a different autocorrelation algorithm with path finding between frames.

**Can I record with the microphone here?** Not on this page. Record with any voice recorder and open the file.

**Is my recording uploaded?** No. Everything runs in your browser, and the page keeps working offline once it has loaded.
