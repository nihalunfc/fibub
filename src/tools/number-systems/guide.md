---
name: Number systems
num: 1235
shelf: learn
code: L120
section: school-maths
title: "Number systems translator: Roman, Egyptian, Mayan, Babylonian, binary and Indian place value"
summary: "Type a whole number and see it written six ways: Indian place value with lakh and crore, Roman numerals, Egyptian signs, Mayan dots and bars, Babylonian wedges, and any base from 2 to 16 with place value blocks."
status: live
ads: false
order: 1235
icon: sigma
works: offline
updated: 2026-11-10
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

Type one whole number from 0 to 9,999,999 and see it written six ways, with the working:

- **Indian place value**: 12,34,567 grouping, lakh and crore, and words.
- **Roman numerals**: I, V, X, L, C, D, M with pairs like IV and IX. They stop at 3,999 and have no zero.
- **Egyptian signs**: a stroke for 1 up to a kneeling god for 1,000,000.
- **Mayan numerals**: base 20 with dots, bars and a shell for zero.
- **Babylonian numerals**: base 60 with thin and corner wedges.
- **Any base from 2 to 16**: digits, place-value blocks and the sum back to an ordinary number.

It fits Class 8 Mathematics, *a story of numbers* (place value, zero and bases). To see how fast powers grow, try [[doubling-power]]; for taking numbers apart, [[hcf-lcm-venn|HCF and LCM factor trees]] and the [[number-theory-toolkit]].

## How to use it

1. Type a whole number or tap an example.
2. Every card updates at once.
3. In the last card pick a base, or type any base from 2 to 16. Type into "Or type a number in this base" to go the other way.

## A worked example

The page starts with 2026.

- Roman: MMXXVI = 1000 + 1000 + 10 + 10 + 5 + 1.
- Mayan: 5 × 20² + 1 × 20 + 6 = 2,026.
- Babylonian: 33 × 60 + 46 = 2,026.
- Base 2: 11111101010, since 1024 + 512 + 256 + 128 + 64 + 32 + 8 + 2 = 2026. Base 16: 7EA = 7 × 256 + 14 × 16 + 10.

## Why place value and zero matter

Without place value you need new signs for ever bigger numbers. With it, a few digits do everything, but you need a way to show an empty place. Babylonians left a gap, which made 61 and 3,601 easy to confuse; the Maya had a shell; Indian mathematicians made zero a number, and that system spread worldwide.

## Check yourself

Five fresh questions: Roman, base 2, Mayan, Babylonian and base 16. Press **Check**; open the worked answer if needed. Nothing is saved.

## FAQ

**Why are the Egyptian signs so simple?** The page draws them itself so it works offline. Real carvings are more detailed.

**Is this from the NCERT book?** It covers the same topic with fibub's own pictures and examples. fibub is not part of NCERT.
