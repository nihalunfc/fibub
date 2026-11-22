---
title: "FITS files and Python: astronomy data in your hands"
seoTitle: "FITS files and Python for astronomy beginners | Astronomy"
summary: "Astronomy images and tables come as FITS files: a text header that describes the data, then the numbers. With Python's astropy and NumPy you can open one, read its header, slice the image and measure it in a few lines."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "A FITS header holds:"
    choices: ["The image pixels", "Keyword = value lines describing the data", "Only the file's name"]
    ans: 1
    why: "Lines like EXPTIME = 120 and DATE-OBS record how, when and where the data were taken."
  - q: "In NumPy, data[10:20, 30:40] selects:"
    choices: ["Rows 10-19 and columns 30-39", "Columns 10-19 and rows 30-39", "Pixels 10 to 40"]
    ans: 0
    why: "Rows (y) come first, then columns (x); the end of a slice is not included."
  - q: "Why use the median rather than the mean for the sky level?"
    choices: ["It is less affected by stars and cosmic rays in the box", "It is always bigger", "NumPy has no mean"]
    ans: 0
    why: "A few very bright pixels pull the mean up but barely move the median."
sources:
  - "Wells, D. C., Greisen, E. W. and Harten, R. H. (1981), A&AS 44, 363 (the FITS standard); Astropy Collaboration (2022), ApJ 935, 167"
---

**Module 5 · about 25 minutes · arrays and indexing.** You'll be able to describe what is inside a FITS file, open one in Python, read its header and measure part of its image.

## 1. Why this matters

Nearly every professional observatory, space telescope and archive shares data as FITS (Flexible Image Transport System), a format created in 1981 and still readable today. Amateur cameras save FITS too. Being able to open and measure FITS files yourself is the step from looking at pretty pictures to doing science with the numbers.

## 2. Inside a FITS file

A FITS file is one or more **HDUs** (header and data units). Each has:

- a **header**: plain-text lines of `KEYWORD = value / comment`, such as `EXPTIME = 120.0 / exposure time in seconds`, `FILTER = 'V'`, `DATE-OBS`, and the world coordinate system (WCS) that ties pixels to RA and Dec;
- **data**: an image (a 2D grid of numbers), a cube, or a table.

In Python:

```python
from astropy.io import fits
import numpy as np

with fits.open("m42_v_120s.fits") as hdul:
    hdr = hdul[0].header
    data = hdul[0].data.astype(float)

print(hdr["EXPTIME"], hdr["FILTER"], data.shape)   # e.g. 120.0 V (48, 64)
sky = np.median(data[0:8, 0:8])
```

<!--fig:array-slice-->

Things to notice:

- The slice text always names rows first, then columns.
- Over empty sky the mean and median agree; over a star the mean jumps much more.

<details class="maths" open>
<summary>Maths and principle</summary>

**Mean and median** of `$n$` values: the mean is `$\bar x = \frac{1}{n}\sum x_i$`; the median is the middle value when sorted.

**Standard deviation**: `$\sigma = \sqrt{\frac{1}{n}\sum (x_i - \bar x)^2}$`. Over blank sky it measures the noise per pixel.

**Robust noise**: astronomers often use `$\sigma \approx 1.4826\times\text{MAD}$`, where MAD is the median of `$|x_i - \text{median}|$`; it ignores stars and cosmic rays.

**Pixel to sky** (simple tangent-plane WCS): offset in degrees `$\approx (x - x_\text{ref})\times\text{CDELT1}$`.
</details>

## 3. What it means physically

Each number in the image is a count of electrons freed by photons in one pixel during the exposure (plus noise and offsets you calibrate away; [Sky watching 6.3](/learn/courses/sky-watching/calibration-frames/)). The header is the lab notebook that travels with the data: without the exposure time, filter and date, the numbers can't be turned into brightness or compared with anyone else's.

## 4. Worked example

*An 8 × 8 box of blank sky in a 120 s exposure has median 200 counts and standard deviation 14 counts. Is that what photon noise alone predicts if the camera gain is 1 electron per count?*

Pure photon noise: `$\sqrt{200} = 14.1$` counts. The measured 14 matches, so the sky noise is almost all from photons, and read noise is small. Sky rate: `$200/120 = 1.7$` electrons per second per pixel, which you would use in the SNR formula ([Sky watching 6.2](/learn/courses/sky-watching/signal-to-noise/)).

## 5. Practice

1. Write the NumPy slice for rows 100 to 149 and columns 200 to 299.
2. A header says `EXPTIME = 30` and a star gives 9,000 counts. What is its count rate?
3. Why is FITS still used after more than 40 years?

<details>
<summary>Answers</summary>

1. `data[100:150, 200:300]`.
2. 300 counts per second.
3. It is open, simple, self-describing (the header), and every tool can read it, so old data stay usable forever.
</details>

**Try it with real numbers:** open any FITS file in your browser with the [[fits-viewer]], and stack frames with the [[image-stacker]].

**New words:** *FITS*, *HDU*, *header*, *keyword*, *WCS*, *NumPy array*, *slice*, *median absolute deviation*.
