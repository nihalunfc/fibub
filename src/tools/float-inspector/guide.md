---
name: Float inspector
num: 575
shelf: science
code: T403
section: computer-science
title: "Float inspector"
summary: "See how a computer really stores 0.1 or any other number: the sign, exponent and mantissa bits in half, single and double precision, the exact stored value to the last digit, the rounding error, the next float up and down, and the ULP. Flip bits to see what any pattern means."
status: live
ads: true
order: 575
icon: calculator
works: offline
updated: 2026-11-09
related: [big-o-plotter, algorithm-visualiser, uncertainty-calculator, cache-simulator, toy-compiler, sig-fig-checker, scientific-notation-formatter, number-theory-toolkit]
sources:
  - "The IEEE 754 binary16, binary32 and binary64 formats and round-to-nearest, ties-to-even rounding (general computer science)."
  - "Checked against Python for 62 numbers in each format, including overflow, subnormal and halfway cases: bit patterns from numpy and struct, the correctly rounded float of each exact decimal (fractions.Fraction), exact stored values and rounding errors (Fraction), next up and down (np.nextafter), ULP (np.spacing) and the shortest round-trip decimal (numpy's repr)."
flow:
  - { icon: pencil, label: "Number" }
  - { icon: table, label: "Bits" }
  - { icon: eye, label: "Exact value" }
  - { icon: target, label: "Error" }
---

## What it does

Computers store most numbers as binary floating point, defined by the IEEE 754 standard. Many simple decimals, such as 0.1, have no exact binary form, so the computer keeps the nearest value it can. That is why 0.1 + 0.2 is not exactly 0.3 in most programming languages. This inspector shows exactly what is stored:

- The **bits**, coloured by part: 1 sign bit, the exponent bits and the mantissa (fraction) bits, in **half** (16-bit), **single** (32-bit, float in C and Java) or **double** (64-bit, the number type of JavaScript and Python).
- The **exponent** with its bias removed, the **significand** 1.xxx in binary and decimal, and the value as significand × 2 to a power.
- The **exact stored value**, every digit of it, worked out with whole-number arithmetic so nothing is rounded on the way.
- The **shortest decimal** that gives the same bits (what most languages print).
- The **rounding error**: stored value minus what you typed, exactly, relative to the number, and in ULPs.
- The **ULP** (unit in the last place), the gap to the next larger float, and the **next float up and down**.
- A table of the same number in all three formats.

See how rounding adds up in a measured result with the [[uncertainty-calculator]], and count significant figures with the [[sig-fig-checker]].

## How to use it

1. Type a number: 0.1, -2.5e-3, 6.02214076e23, inf, -inf or NaN.
2. Choose **Half 16**, **Single 32** or **Double 64**.
3. Read the coloured bits and the facts below them.
4. Press any bit to flip it. The page then shows what that pattern means. You can also type a pattern in hex (like 0x3FB999999999999A) or choose one of the **Special values**: zero, negative zero, the smallest subnormal, the smallest normal, one, one plus machine epsilon, the largest finite value, infinity and NaN.
5. **Next up** and **Next down** walk to the neighbouring floats, one bit pattern at a time.
6. Save the format table as CSV, or everything as an image, PDF or Word file.

## Worked example

Type **0.1** and choose double. The bits are 0x3FB999999999999A: sign 0, exponent bits 01111111011 = 1019, minus the bias 1023 = −4, and a mantissa of 1001 1001 … 1010. The page shows "0.1 is stored as 0.1000000000000000055511151231257827021181583404541015625". The rounding error is 0.0000000000000000055511151231257827021181583404541015625, which is 0.4 ULP; the ULP here is 2^−56 = 0.00000000000000001387778780781445675529539585113525390625.

In the all-formats table, half precision stores 0.1 as 0.0999755859375 (bits 0x2E66, error −2.441e-5, −0.4 ULP) and single as 0.100000001490116119384765625 (0x3DCCCCCD, error 1.490e-9, 0.2 ULP).

## Terms

- **Bias:** the exponent is stored as a whole number with a fixed offset added (15, 127 or 1023), so it needs no sign bit.
- **Normal numbers** have an implied leading 1 before the mantissa. **Subnormal numbers** (exponent bits all zero) drop it, filling the gap down to zero with less precision.
- **Infinity** and **NaN** have exponent bits all one. NaN, "not a number", comes from sums like 0 ÷ 0.
- **Machine epsilon** is the gap from 1 to the next float: 2^−10, 2^−23 and 2^−52 for the three formats.
- **Round to nearest, ties to even:** the standard rule. A value exactly halfway between two floats goes to the one whose last bit is 0.

## Tips

- Any whole number up to 2^53 (9,007,199,254,740,992) is exact in double; 9007199254740993 is not, and rounds down.
- Half precision only reaches 65,504. 65520 is exactly halfway to the next step and rounds to infinity.
- Programs that convert a decimal to single by going through double first can, very rarely, round twice and land one float off. This tool rounds the exact decimal directly.

## What it does not do

It covers the three binary formats. It does not do decimal floating point (decimal64), bfloat16, extended 80-bit precision, other rounding modes, or the payload bits and signalling flag of NaNs beyond showing them.

## FAQ

**Why does 0.1 + 0.2 give 0.30000000000000004?** Both are stored slightly off, and the sum rounds to the double just above the one nearest 0.3. Type 0.3 and press Next up to see that neighbour.

**Is anything sent anywhere?** No. Everything is worked out in your browser and the page keeps working offline.
