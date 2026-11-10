---
name: Password strength
num: 2054
shelf: everyday
code: T937
section: passwords
title: "Password strength checker: how long would it take to crack?"
summary: "Type a password to see a rough strength rating, how many guesses it would take and how long that is at four attack speeds, with the reasons: common passwords, sequences, keyboard runs, repeats and dates. Never sent anywhere."
status: live
ads: false
order: 2054
icon: lock
works: offline
updated: 2026-11-10
related: [password-generator, hash-checker]
sources:
  - "fibub's own estimator: character-set entropy, with patterns (a short built-in list of widely reused passwords, sequences, keyboard runs, repeats, years and dates) counted as a few guesses instead. Attack speeds are round example figures, not measurements."
flow:
  - { icon: pencil, label: "Type" }
  - { icon: search, label: "Check" }
  - { icon: lock, label: "Strength" }
---

## What it does

Type a password and this page estimates how many guesses an attacker would need to find it, and how long that would take at four attack speeds. It explains why: whether the password is on a list of passwords people use again and again, or contains a sequence like 123, a keyboard run like qwerty, a repeat, a year or a date.

The check runs on this page only. The box is a password field with autocomplete off, and nothing you type is sent or saved. If the result is weak, make a new one with the [[password-generator]].

## How to use it

1. Type or paste a password into the box.
2. Read the rating, the guesses, the crack times and **Why**.
3. Tick **Show the password** to check what you typed, and press **Clear** when you are done.

## What the results mean

- **Bits**: the estimate in bits; each extra bit doubles the guesses. Under 28 bits is very weak, under 40 weak, under 60 fair, under 80 strong, and 80 or more very strong. Any password found whole in the list is very weak.
- **Attack speeds**: online with the site limiting tries (100 guesses an hour), online with no limit (10 a second), offline after a leak with a slow password hash (10,000 a second) and with a fast hash on many graphics cards (10 billion a second).

The times are for trying every guess; on average an attacker finds it in about half that time.

## Worked example

"password" is on the built-in list of 179 entries, so it counts as about 7.5 bits: very weak. "P@ssw0rd2024" is the same word with swapped letters and a capital, plus a year: about 16.6 bits, still very weak. "Tr0ub4dor&3" has no pattern this page knows, so it counts as 11 random characters from 95: 72.3 bits. "correct horse battery staple" is 28 characters of lower case and spaces: 164.7 bits.

## FAQs

**Is Tr0ub4dor&3 really that strong?** Probably not. It is a dictionary word with common swaps, and real cracking tools know far more words than this page's short list.

**Does a strong rating mean it is safe?** No. A password used on two sites is unsafe if either one leaks. Use a different password for each site.
