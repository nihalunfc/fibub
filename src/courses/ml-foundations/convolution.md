---
title: 'Images: convolution and filters'
seoTitle: 'Convolutional neural networks explained: filters and pooling'
summary: 'A picture is a grid of numbers. A convolution slides a small filter over it and scores how well each patch matches, wherever it is. Slide edge and blur filters over a pixel picture and see how CNNs see.'
minutes: 25
updated: 2026-11-21
quiz:
  - q: Why not feed a 1,000 × 1,000 photo to a fully connected layer?
    choices: ['Each neuron would need 1 million weights per colour, and it would not know that patterns can move', 'Photos cannot be numbers', 'It would be too accurate']
    ans: 0
    why: Convolution shares one small filter across all positions, so a cat's ear is found anywhere with a few weights.
  - q: A 3 × 3 filter on a 12 × 12 image (no padding, stride 1) gives an output of
    choices: ['10 × 10', '12 × 12', '9 × 9']
    ans: 0
    why: The filter fits in 12 − 3 + 1 = 10 positions across and down.
  - q: 'In a trained CNN, the first layer''s filters usually look like:'
    choices: ['Edge and colour detectors', 'Whole faces', 'Random noise']
    ans: 0
    why: Early layers find simple local patterns; deeper layers combine them into textures, parts and objects.
---

**Module 9 · about 25 minutes · read first: 1.4, 9.3.** You'll be able to compute a convolution by hand, explain why filters are shared across the image, and describe how a CNN builds up from edges to objects.

## 1. Why this matters

Convolutional neural networks (CNNs) made computers see: reading cheques in the 1990s (LeCun's LeNet), winning the ImageNet contest in 2012 (AlexNet), and now checking X-rays, sorting parcels and steering cars. The same sliding-filter idea is used for sound, sensor signals and text.

## 2. A picture is a grid of numbers

A black-and-white picture is a grid of brightness values; a colour one is three grids (red, green, blue). A small 256 × 256 colour photo is 196,608 numbers. A fully connected layer of 1,000 neurons on it would need nearly 200 million weights, and would have to learn "an eye at the top left" and "an eye at the top right" separately.

## 3. Convolution

A **filter** (or kernel) is a small grid of weights, say 3 × 3. Slide it over the picture; at each position, multiply each of the 9 pixels under it by the matching weight and add them up. The results form a new grid, the **feature map**, which is bright where the patch looks like the filter's pattern.

<!--fig:conv-filter-->

The trick is **weight sharing**: the same 9 weights are used at every position, so a pattern is found wherever it appears, with very few weights to learn.

## 4. A CNN

A typical image network repeats:

1. **Convolution layer:** many filters (say 32), each producing its own feature map, followed by ReLU.
2. **Pooling:** shrink each map, for example by keeping the largest value in each 2 × 2 square. The network becomes less sensitive to exact positions, and the maps get smaller.

After several rounds, the small, deep stack of maps is flattened and fed to fully connected layers for the final answer. The filter weights are **learned** by backpropagation, not designed. Early layers end up as edge, colour and texture detectors; middle layers as parts (wheels, eyes, letters); late layers as whole objects.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** look for the same small pattern everywhere, with one shared set of weights.

**Convolution** (as used in deep learning, strictly a cross-correlation) of image `$I$` with a `$k \times k$` filter `$K$`:

```math
S(r, c) = \sum_{i=0}^{k-1} \sum_{j=0}^{k-1} I(r + i,\, c + j)\, K(i, j)
```

**Output size** for an `$n \times n$` image with no padding and stride 1: `$(n - k + 1) \times (n - k + 1)$`. Padding the border with zeros keeps the size `$n \times n$`.

**Weights in a layer:** `$k \times k \times c_{\text{in}} \times c_{\text{out}}$` plus `$c_{\text{out}}$` biases, however big the image.

**Analogy:** reading a page with a small magnifying glass shaped like the letter "e", noting every spot where the glass lines up with an "e".

**Try it:** apply the filter [[1, 0], [0, −1]] to the 3 × 3 image [[1, 2, 3], [4, 5, 6], [7, 8, 9]]. (Each output is top-left minus bottom-right: 1 − 5, 2 − 6, 4 − 8, 5 − 9, all −4. The image is a smooth ramp, so this diagonal-change detector sees the same change everywhere.)
</details>

## 5. Worked example

A 5-pixel-wide strip, dark on the left and bright on the right: `0 0 0 9 9`. The 1-D edge filter `[1, 0, −1]` gives:

- position 1: 0 × 1 + 0 × 0 + 0 × (−1) = 0
- position 2: 0 + 0 − 9 = −9
- position 3: 0 + 0 − 9 = −9

Strong (negative) responses where the brightness jumps; zero on the flat part. Flip the filter's sign and the response is positive. A first-layer filter in a CNN, trained on photos, typically learns something very like this, in two dimensions and at many angles.

## 6. Practice

1. In the simulation, where does the vertical-edge filter respond strongly, and where is it zero?
2. How many weights does a layer of 32 filters of size 3 × 3 on a colour image have?
3. Why does pooling help a network recognise a shifted object?

<details>
<summary>Answers</summary>

1. Along the walls and the door's sides (left-right changes in brightness); zero on flat areas and along horizontal edges.
2. 3 × 3 × 3 × 32 = 864 weights, plus 32 biases.
3. Keeping only the strongest response in each small square means a pattern moved by a pixel or two gives almost the same pooled map.
</details>

**Try it on your own data:** the [[neural-network-toys]] lets you draw small black-and-white patterns and see how a network stores and recalls them.

**New words:** *convolution*, *filter* (kernel), *feature map*, *weight sharing*, *stride*, *padding*, *pooling*, *CNN*.
