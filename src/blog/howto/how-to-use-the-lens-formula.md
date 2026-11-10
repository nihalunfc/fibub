---
title: "How to use the lens formula to find image distance (with a worked example)"
summary: "Put the object distance and focal length into 1/v − 1/u = 1/f with the right signs, solve for v, then get magnification and power. Worked example and checks."
tools: [lens-ray-diagram, mirror-ray-diagram, microscope-telescope]
updated: 2026-11-10
sources:
  - "Thin lens formula 1/v − 1/u = 1/f, magnification m = v/u, power P = 1/f (f in metres) and the New Cartesian sign convention: standard school optics."
---

To find where a lens forms an image, write the object distance u as a negative number, give the focal length f a plus sign for a convex lens or a minus sign for a concave one, and solve 1/v = 1/f + 1/u. The [[lens-ray-diagram]] does this for any numbers you type, draws the rays to scale and prints every line of the working with signs.

## What you need

- **The focal length f** of the lens, in cm. A convex (converging) lens is fatter in the middle; a concave (diverging) lens is thinner in the middle.
- **The object distance**, measured from the centre of the lens to the object, in cm.
- **The sign convention.** Light travels left to right and every distance starts at the optical centre O. Left of O is negative, right is positive, so an object in front of the lens has a negative u.
- Optional: the **object height** h, if you also want the height of the image.

## Step by step

1. Open the lens tool and press **Convex** or **Concave** at the top.
2. Type your numbers into the **Object distance (cm)** and **Focal length (cm)** boxes. Type plain sizes; the tool adds the signs. You can also drag the object, use the sliders, or tap a standard position such as **At 2F₁**.
3. Read the line at the top of **The image**: real or virtual, bigger or smaller, and where it forms.
4. Look under **Lens formula, with signs**. It shows the steps you would write in a test:

   1/v = 1/f + 1/u, then v, then m = v/u, then P = 1/f.

   Here v is the image distance, m the magnification (image height divided by object height) and P the power in dioptres, with f in metres.
5. If you need the image height, switch to **Class 12**, type the object height, and the tool adds h′ = m × h.

What the signs tell you: a positive v means the image is on the far side of the lens, where light really meets, so it is **real** and can be caught on a screen. A negative v means it sits on the same side as the object and is **virtual**. A negative m means the image is upside down; a positive m means it is upright.

## A worked example

A convex lens has a focal length of 15 cm. A candle stands 25 cm in front of it, and the flame is 4 cm tall. Where is the image, and how big?

- Signs first: u = −25 cm and f = +15 cm.
- 1/v = 1/15 + 1/(−25) = 0.0667 − 0.04 = 0.0267, so **v = +37.5 cm**.
- m = v/u = 37.5 ÷ (−25) = **−1.5**.
- Image height: h′ = −1.5 × 4 cm = **−6 cm**.
- Power: P = 1/0.15 m = **+6.67 D**.

So a sharp, upside-down flame 6 cm tall appears on a screen 37.5 cm behind the lens. That fits the rule for a convex lens: an object between F₁ and 2F₁ (15 to 30 cm here) gives a real, inverted, enlarged image beyond 2F₂.

Now move the candle to 10 cm, inside the focal length. Then 1/v = 1/15 − 1/10 = −0.0333, so v = −30 cm and m = +3. The image is upright, three times taller and on the candle's side of the lens. That is how a magnifying glass works.

Last, swap in a concave lens of the same 15 cm, with the object at 30 cm. Now f = −15 cm and 1/v = −1/15 − 1/30 = −0.1, so v = −10 cm and m = +0.33: upright, a third of the size, and virtual. A concave lens gives this kind of image wherever the object stands. Curved mirrors use a near-identical formula with a plus sign, 1/v + 1/u = 1/f, which you can try in the [[mirror-ray-diagram]]; two lenses working together make the instruments in [[microscope-telescope]].

## Check your answer

- **Look at the picture.** The rays in the diagram should meet where your v says. A positive v with only dashed rays on the object's side means a sign slipped.
- **Use the size rule (convex lens).** At 2F₁ the image is the same size (m = −1). Between F₁ and 2F₁, |m| is more than 1; beyond 2F₁, less than 1.
- **Put v back in.** Work out 1/v − 1/u with your numbers. It should give 1/f. For the first example: 1/37.5 + 1/25 = 0.0267 + 0.04 = 0.0667 = 1/15.
- **Units.** Keep u, v and f all in cm while you solve, then change f to metres only for the power.

## Questions people ask

**Why is u negative when the distance is clearly 25 cm?**
The minus sign is a direction, not a size: the side light comes from counts as negative. That keeps one formula working for every case.

**What if the object sits exactly at the focus?**
Then 1/v works out to zero and the image is "at infinity": the rays leave the lens parallel and never meet. A spotlight puts its bulb at this point to make a parallel beam; a projector puts its slide just outside it.

**Some books use 1/f = 1/u + 1/v. Which is right?**
Both, with different sign rules. That older form treats real distances as positive. The tool, and Class 10 and 12 books in India, use the New Cartesian rule with 1/v − 1/u = 1/f. Pick one convention and stick to it for the whole problem.
