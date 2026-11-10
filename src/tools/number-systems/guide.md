---
name: Number systems translator
num: 1235
shelf: learn
section: school-maths
title: "Number systems translator: Roman, Egyptian, Mayan, Babylonian, binary and Indian place value"
summary: "Type a whole number and see it written six ways: Indian place value with lakh and crore, Roman numerals, Egyptian signs, Mayan dots and bars, Babylonian wedges, and any base from 2 to 16 with place value blocks."
status: live
ads: false
order: 1235
icon: sigma
works: offline
updated: 2026-11-09
related: [doubling-power, hcf-lcm-venn, number-theory-toolkit]
sources:
  - "Roman, Egyptian, Mayan and Babylonian numerals, Indian place value and number bases are standard history of mathematics. The signs are drawn simply by fibub (no outside fonts); wording and examples are fibub's own."
  - "Checked against Python (divmod for bases 20 and 60, bin and hex) and JavaScript's toString(base) for every number up to 20,000 in every base 2 to 16; every Roman numeral 1 to 3999 is read back to its number."
flow:
  - { icon: pencil, label: "Type it" }
  - { icon: eye, label: "Six ways" }
  - { icon: sliders, label: "Pick a base" }
  - { icon: check, label: "Check" }
---

## What it does

People have written numbers in very different ways. Type one whole number from 0 to 9,999,999 and this page writes it in six of them at once, with the working for each:

- **Indian place value**: grouped the Indian way (12,34,567), named in lakh and crore, and in words both the Indian and the international way, with a table of what each digit is worth.
- **Roman numerals**: I, V, X, L, C, D, M with the take-away pairs (IV, IX, XL, XC, CD, CM), broken into pieces. They stop at 3,999 and have no zero.
- **Egyptian hieroglyph numerals**: a stroke, a heel bone, a coil of rope, a lotus, a finger, a tadpole and a kneeling god for 1 up to 1,000,000, each repeated up to nine times.
- **Mayan numerals**: base 20 with dots (1), bars (5) and a shell for zero, stacked in levels.
- **Babylonian numerals**: base 60 with thin wedges (1) and corner wedges (10), one group per place.
- **Any base from 2 to 16**: the digits, a column of place value blocks for each digit, and the sum that turns it back into an ordinary number. You can also type a number in that base.

It fits Class 8 Mathematics, *a story of numbers* (counting and number systems through history, place value, zero and bases), and helps with binary numbers in computer science. To see how fast powers grow, try the [[doubling-power]] page; to take numbers apart into primes, the [[hcf-lcm-venn|HCF and LCM factor trees]].

## How to use it

1. Type a whole number, or tap a quick example.
2. Every card updates at once. The pictures grow when the number needs more signs.
3. In the last card, pick a base (2, 5, 8, 10, 12, 16, or type any base from 2 to 16). Each column of blocks is one place; the label on top says what one block in that column is worth. Type into "Or type a number in this base" to go the other way.

## A worked example

The page starts with 2026.

- Indian: 2,026, two thousand twenty-six; 2 thousands, 0 hundreds, 2 tens and 6 ones.
- Roman: MMXXVI = M (1000) + M (1000) + X (10) + X (10) + V (5) + I (1).
- Egyptian: 2 lotuses, 2 heel bones and 6 strokes: 10 signs.
- Mayan: 5 × 20² + 1 × 20 + 6 = 2,000 + 20 + 6. The top level is one bar, the middle one dot, the bottom one bar and one dot.
- Babylonian: 33 × 60 + 46 = 1,980 + 46: three corner wedges and three thin ones, then four corner wedges and six thin ones.
- Base 2: 11111101010, since 1024 + 512 + 256 + 128 + 64 + 32 + 8 + 2 = 2026. Base 16: 7EA = 7 × 256 + 14 × 16 + 10.

## Why place value and zero matter

Without place value (Roman, Egyptian) you need new signs for bigger and bigger numbers and long strings of them. With place value the same few digits do everything, but you need a way to show an empty place. The Babylonians first left a gap, which made 61 (1, 1) and 3,601 (1, 0, 1) easy to mix up; the Mayans had a shell; Indian mathematicians made zero a number in its own right, and that system spread around the world.

## Check yourself

Five fresh questions: a Roman numeral, a number in base 2, a Mayan number, a Babylonian number and a base 16 number. Type a number, press **Check**, and open the worked answer if you need it. Nothing is saved.

## FAQ

**Why are the Egyptian signs so simple?** They are drawn by the page itself, so it works offline with no special fonts. Real carvings are more detailed.

**Is base 20 exactly what the Maya used?** For counting, yes. Their calendar count used 18 × 20 for the third level, which the page notes but does not use.

**Is this from the NCERT book?** It covers the same topic with fibub's own pictures and examples. fibub is not part of NCERT.
