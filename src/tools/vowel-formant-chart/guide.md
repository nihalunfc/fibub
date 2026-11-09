---
name: Vowel formant chart
num: 730
shelf: science
section: linguistics-and-phonetics
title: "Vowel formant chart: measure F1, F2, F3 from a recording and plot an F2-F1 vowel chart (free)"
summary: "Open a WAV recording, pick a vowel and measure its formants F1, F2 and F3 by linear prediction (LPC), then plot vowels on an F2-F1 chart in Hz or Lobanov z-scores. Paste formant tables from Praat too. Nothing is uploaded."
status: live
ads: false
order: 730
icon: chart
works: offline
updated: 2026-11-09
related: [plot-maker, data-cleaner, trend-analyser, pitch-contour-tracker, ipa-feature-matrix, ipa-keyboard]
sources:
  - "Method: linear prediction by the autocorrelation method with the Levinson-Durbin recursion (Makhoul 1975, Proc. IEEE 63, 561); formant settings follow Praat's documented defaults (Boersma and Weenink). Normalisation: Lobanov (1971), J. Acoust. Soc. Am. 49, 606."
  - "Example sound and example table: made up for this page (synthetic vowels and invented speakers A and B)."
flow:
  - { icon: file, label: "Open a WAV" }
  - { icon: pointer, label: "Pick vowel" }
  - { icon: chart, label: "F2-F1 chart" }
  - { icon: download, label: "Download" }
---

## What it does

Formants are the resonances of the vocal tract. The first two, **F1** and **F2**, are what make one vowel sound different from another: F1 rises as the jaw and tongue lower (so [a] has a high F1 and [i] a low one), and F2 rises as the tongue moves forward (so [i] has a high F2 and [u] a low one). Plot F2 across and F1 down, both reversed, and the vowels fall roughly where they sit on the IPA vowel chart.

This tool measures formants from your own recording and draws that chart. It reads the sound in your browser, so recordings of yourself, your students or your participants never leave the device.

## How to use it

1. **Open a sound file.** WAV is read exactly as recorded (8, 16, 24 or 32-bit, or float, any sample rate; stereo is mixed to one channel). MP3, M4A and OGG go through your browser's own decoder. Up to 60 seconds are analysed. Record with any voice recorder app, Audacity or Praat, then open the file. Or press **Load the made-up example**.
2. **Settings.** *Highest formant* is the top of the range searched: 5000 Hz suits most adult men, 5500 Hz most adult women and 6500 Hz children. *Formants below that* is how many resonances the analysis expects (5 is the usual choice). *Window* is the length of each analysis slice (25 ms is standard).
3. **Pick a vowel.** The tool finds the loud stretches and offers a button for each; a button takes the middle half, where a vowel is steadiest. Or drag across the picture, or type the start and end times. The picture shows the waveform and the F1, F2 and F3 dots of every window, so you can see where the tracks are flat.
4. Read the **median F1, F2 and F3** over the chosen stretch, with their spread (SD) across windows. Give the vowel a label and a speaker name and press **Add to the chart**.
5. **Vowel chart.** The table under it can also be pasted from Praat or a spreadsheet: vowel, F1, F2, then F3 and speaker if you have them. Choose **Hz** or **Lobanov z-scores**, and every vowel or vowel means.
6. Download the chart as an image, PDF or Word report, the chart data as CSV (with z-scores), or the frame-by-frame formant track as CSV.

## How the measurement works

The sound is resampled to twice the highest formant (11,000 Hz for 5500 Hz), pre-emphasised from 50 Hz to lift the higher formants, and cut into overlapping windows every 5 ms. Each window is shaped by a Hamming window, and its autocorrelation gives a linear prediction (LPC) filter of order 2 × the number of formants by the Levinson-Durbin recursion. The roots of the prediction polynomial are found numerically; each pair of complex roots is a resonance with frequency f = angle × fs / 2π and bandwidth −ln|z| × fs / π. Resonances wider than 700 Hz are dropped, and the lowest three become F1, F2 and F3.

## Worked example

Press **Load the made-up example**. It is a synthetic voice saying three vowels built with formants of 300, 2300 and 3000 Hz ([i]), 750, 1300 and 2500 Hz ([a]) and 320, 800 and 2300 Hz ([u]). With the default settings the tool finds three loud stretches. *Vowel 1* measures **F1 295 Hz, F2 2306 Hz, F3 3014 Hz**, within 2 % of the formants the sound was built with. *Vowel 2* gives 776, 1279 and 2479 Hz: F1 is 3 % high, a typical LPC error when the voice's harmonics (every 200 Hz here) are sparse around F1. The made-up example table below has two invented speakers, A and B; B's vowels sit lower and further left in Hz because their numbers are higher, and switching to Lobanov z-scores lays the two vowel spaces on top of each other. Speaker A's [i] then has a mean z of −0.96 for F1 and 1.31 for F2.

## Tips

- Measure in the middle of the vowel, away from the consonants on either side.
- If F1 and F2 of a back vowel such as [u] or [o] come out as one, or an extra formant appears between them, change *Formants below that* by one, or the highest formant by 500 Hz. This is the same advice as for Praat.
- Very high voices (children, some sopranos) are hard for any LPC method: the harmonics are far apart and F1 can lock on to a harmonic.
- Lobanov needs each speaker's whole vowel system; with only two or three vowels the z-scores mean little.

## FAQ

**Why are the axes reversed?** So the chart has the same layout as the IPA vowel trapezoid: front vowels on the left, close vowels at the top.

**Will I get the same numbers as Praat?** Close, not identical. Praat uses Burg's method and a Gaussian window; this tool uses the autocorrelation method with a Hamming window. Its LPC steps match numpy and scipy to 10 decimal places.

**Can I record with the microphone here?** Not on this page. Record with any voice recorder and open the file; the analysis is the same.

**Is my recording uploaded?** No. Everything runs in your browser, and the page keeps working offline once it has loaded.
