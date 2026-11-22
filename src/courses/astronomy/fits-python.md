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

**Module 5 · about 25 minutes · read first: [5.4 Spectroscopy: from raw frame to line](/learn/courses/astronomy/spectroscopy-pipeline/), [Sky watching 6.3 Calibration frames: darks, flats and bias](/learn/courses/sky-watching/calibration-frames/) · maths: arrays and indexing.** You'll be able to describe what is inside a FITS file, open one in Python, read its header and measure part of its image.

<div class="bigidea">Astronomy images and tables come as FITS files, a plain-text header that describes the data followed by the numbers, and with Python you can open one, read it and measure it in a few lines.</div>

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

Open a FITS image the way a researcher does:

<div class="steps">
<div class="step"><b>Open.</b> <code>hdul = fits.open("m51.fits")</code> lists the parts (HDUs). Most images are in the first one.</div>
<div class="step"><b>Read the header.</b> <code>hdr["EXPTIME"]</code>, <code>hdr["FILTER"]</code>, <code>hdr["NAXIS1"]</code>: every fact about the observation as keyword = value.</div>
<div class="step"><b>Get the numbers.</b> <code>data = hdul[0].data</code> gives a NumPy array. Rows are y, columns are x: <code>data[y, x]</code>.</div>
<div class="step"><b>Slice.</b> <code>cut = data[500:600, 800:900]</code> takes a 100 × 100 patch around a star.</div>
<div class="step"><b>Measure.</b> <code>np.median(sky)</code> for the background and <code>1.4826 * MAD</code> for robust noise that ignores stars and cosmic rays.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Mean and median** of `$n$` values: the mean is `$\bar x = \frac{1}{n}\sum x_i$`; the median is the middle value when sorted.

**Standard deviation**: `$\sigma = \sqrt{\frac{1}{n}\sum (x_i - \bar x)^2}$`. Over blank sky it measures the noise per pixel.

**Robust noise**: astronomers often use `$\sigma \approx 1.4826\times\text{MAD}$`, where MAD is the median of `$|x_i - \text{median}|$`; it ignores stars and cosmic rays.

**Pixel to sky** (simple tangent-plane WCS): offset in degrees `$\approx (x - x_\text{ref})\times\text{CDELT1}$`.
</details>

Use the steps (or the Frame buttons) to clean the raw frame, and watch the single row of pixels below.

<figure class="fig" data-fig="@astro-ccd-steps"><figcaption>Subtracting bias and dark removes the offset and hot pixels. Dividing by the flat removes vignetting and dust shadows. After both, equal stars read equal counts anywhere on the chip, and the real signal stands above a flat sky.</figcaption></figure>

## 3. What it means physically

Each number in the image is a count of electrons freed by photons in one pixel during the exposure (plus noise and offsets you calibrate away; [Sky watching 6.3](/learn/courses/sky-watching/calibration-frames/)). The header is the lab notebook that travels with the data: without the exposure time, filter and date, the numbers can't be turned into brightness or compared with anyone else's.


<div class="meaning">

<dl>
<dt>NAXIS1, NAXIS2</dt><dd>Image width and height in pixels.</dd>
<dt>BITPIX</dt><dd>Bits per pixel; negative means floating point.</dd>
<dt>σ ≈ 1.4826 × MAD</dt><dd>Robust noise from the median absolute deviation.</dd>
<dt>Physical meaning</dt><dd>A FITS file is a labelled box. The label (header) says what is inside, where the telescope pointed, how long it exposed and through which filter; the box holds the raw numbers. Because the label is plain text, a file written in 1981 can still be read today.</dd>
</dl>

</div>

<div class="myth">

**"FITS images are just pictures like JPEGs."** A FITS image holds the actual measured numbers, often 16- or 32-bit, with no compression losses and a full header. A JPEG keeps only 8 bits of display brightness and throws the science away.

</div>

## 4. Worked example

*An 8 × 8 box of blank sky in a 120 s exposure has median 200 counts and standard deviation 14 counts. Is that what photon noise alone predicts if the camera gain is 1 electron per count?*

Pure photon noise: `$\sqrt{200} = 14.1$` counts. The measured 14 matches, so the sky noise is almost all from photons, and read noise is small. Sky rate: `$200/120 = 1.7$` electrons per second per pixel, which you would use in the SNR formula ([Sky watching 6.2](/learn/courses/sky-watching/signal-to-noise/)).

## 5. Practice

<div class="problem" data-problem="fits-size"></div>

**More practice** (answers below):

1. Write the NumPy slice for rows 100 to 149 and columns 200 to 299.
2. A header says `EXPTIME = 30` and a star gives 9,000 counts. What is its count rate?
3. Why is FITS still used after more than 40 years?

<details>
<summary>Answers</summary>

1. `data[100:150, 200:300]`.
2. 300 counts per second.
3. It is open, simple, self-describing (the header), and every tool can read it, so old data stay usable forever.
</details>

<div class="keypoints">

- FITS = header (keyword = value text) + data (arrays or tables).
- astropy.io.fits opens files; data comes as NumPy arrays indexed [y, x].
- Median and MAD give robust sky level and noise.
- The WCS keywords map pixels to sky coordinates.

</div>

**Try it with real numbers:** open any FITS file in your browser with the [[fits-viewer]], and stack frames with the [[image-stacker]].

**New words:** *FITS*, *HDU*, *header*, *keyword*, *WCS*, *NumPy array*, *slice*, *median absolute deviation*.
