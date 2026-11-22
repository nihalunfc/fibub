---
title: "Stacking: why many short shots beat one long one"
summary: "Averaging many aligned frames keeps the signal and cuts random noise by the square root of the number of frames. Stacking also rejects satellite trails and aircraft, and lets cheaper mounts make deep images."
minutes: 20
updated: 2026-11-22
quiz:
  - q: "You stack 25 frames. By how much does random noise fall compared with one frame?"
    choices: ["25 times", "5 times", "2.5 times"]
    ans: 1
    why: "Noise falls as √n: √25 = 5."
  - q: "What does sigma-clipping do in stacking?"
    choices: ["Rejects pixel values far from the others at that spot, such as satellite trails", "Sharpens stars", "Removes colour"]
    ans: 0
    why: "Values more than a few standard deviations from the median are thrown out before averaging."
  - q: "Why must frames be aligned (registered) before stacking?"
    choices: ["Stars drift slightly between frames, so the same star must land on the same pixel", "To change the colour", "To remove dark current"]
    ans: 0
    why: "Without alignment, stacking would smear the stars."
sources: []
---

**Module 6 · about 20 minutes · square roots and averages.** You'll be able to explain why stacking works, choose between few long or many short frames, and describe registration and outlier rejection.

## 1. Why this matters

Stacking is how a modest camera on a small mount produces images that rival professional photos from decades ago. The same averaging logic is behind every survey's deep co-added images ([Astronomy 5.6](/learn/courses/astronomy/open-archives/)).

## 2. Averages cancel noise

Each frame of the same target has the same signal plus its own random noise. Add `$n$` frames: the signal adds up `$n$` times, the random noise only `$\sqrt n$` times (it partly cancels). So the SNR improves by `$\sqrt n$`.

<!--fig:stack-noise-->

Things to notice:

- 4 frames halve the noise; to halve it again you need 16, then 64. Returns diminish: plan total time, not frame count.
- The galaxy itself never changes; only the noise around it fades.

## 3. The steps

1. **Calibrate** each frame (Lesson 6.3).
2. **Register:** find stars in each frame and shift, rotate (and sometimes scale) frames so they line up.
3. **Combine:** average or median each pixel across frames, with **outlier rejection** (sigma clipping): values far from the others at that pixel, like a satellite trail, a plane or a cosmic-ray hit, are dropped.

## 4. Long or short?

- **Read noise** is added once per frame, so very short frames pay more read noise per minute of total time.
- **Long frames** risk tracking errors, saturated stars and losing a whole frame to a gust of wind or a plane.
- Rule of thumb: make each frame long enough that the sky's noise swamps the read noise (often a few minutes in a city, longer under dark skies or with narrowband filters), then take as many as you can.

<details class="maths" open>
<summary>Maths and principle</summary>

**Stack of `$n$` frames,** each with signal `$S$` and random noise `$\sigma$`:

```math
\text{signal} = nS, \qquad \text{noise} = \sqrt n\,\sigma, \qquad \text{SNR}_n = \sqrt n \,\frac{S}{\sigma}
```

(Averaging instead of summing divides both by `$n$`, same SNR.)

**When read noise matters:** for a sky signal per frame `$B t$` (electrons per pixel), read noise `$R$` adds little once `$B t \gg R^2$`; a common target is `$B t \approx 10 R^2$`, which keeps the total noise within about 5% of the read-noise-free value.

**Try it:** read noise 3 e⁻, sky 0.5 e⁻/s per pixel: `$t \approx 10 \times 9/0.5 = 180$` s per frame.
</details>

## 5. Worked example

*Two plans for 2 hours on a galaxy, read noise 5 e⁻, sky 1 e⁻/s per pixel.*

- 4 frames of 30 minutes: sky per frame 1,800 e⁻, read noise per frame 25 e⁻², total noise² per pixel `$4 \times (1800 + 25) = 7300$`.
- 120 frames of 1 minute: sky per frame 60 e⁻, total noise² `$120 \times (60 + 25) = 10\,200$`.

The 1-minute plan has `$\sqrt{10200/7300} = 1.18$` times more noise: a loss, but small, and in return a plane or a wind gust only ruins 1 minute instead of 30. Two- to five-minute frames would get most of both benefits.

## 6. Practice

1. How many frames would cut noise by 10 times?
2. One frame has SNR 8. What SNR do 36 frames give?
3. Why is the median better than the mean at removing satellite trails when you have few frames?

<details>
<summary>Answers</summary>

1. 100.
2. `$8 \times 6 = 48$`.
3. A single very bright value shifts the mean a lot but barely moves the median.
</details>

**Try it with your own files:** align and stack frames in your browser with the [[image-stacker]].

**New words:** *stacking*, *registration*, *sigma clipping*, *outlier rejection*, *sub-exposure*, *integration time*.
