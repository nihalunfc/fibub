---
name: Password generator
num: 2053
shelf: everyday
code: T936
section: passwords
title: "Password generator: strong random passwords, made on your device"
summary: "Make strong random passwords from 8 to 128 characters with letters, digits and symbols, leave out look-alike characters, and see how many bits of randomness each one has. Nothing is sent or saved."
status: live
ads: false
order: 2053
icon: lock
works: offline
updated: 2026-11-10
related: [password-strength, hash-checker, uuid-generator]
sources:
  - "Random numbers from the Web Crypto API (crypto.getRandomValues), with rejection sampling so every character is equally likely. Entropy is the base-2 logarithm of the number of possible passwords. fibub's own working."
flow:
  - { icon: sliders, label: "Choose" }
  - { icon: lock, label: "Generate" }
  - { icon: copy, label: "Copy" }
---

## What it does

A good password is long and truly random, so nobody can guess it from your name, a word or a pattern. This page makes passwords from the characters you choose, using your browser's secure random number source, the same one used for encryption.

It also shows the entropy: how many bits of randomness each password has, which tells you how many guesses an attacker would need. The passwords are made on your device and are never sent or saved. To test a password you already have, use the [[password-strength|password strength checker]]; for random IDs rather than passwords, try the [[uuid-generator]].

## How to use it

1. Set the length. 20 characters is filled in.
2. Tick the character sets you want.
3. Five passwords appear straight away. Press **Copy** next to one, or **Copy all**.
4. Press **Make new ones** for a fresh set (changing a setting does too).

## What each setting does

- **Length**: from 8 to 128 characters. Each extra character multiplies the number of possible passwords.
- **How many**: 1 to 100 passwords at once.
- **Use these characters**: lower case, upper case, digits and 27 symbols. Untick symbols for sites that refuse them.
- **Leave out look-alikes**: removes 0, O, o, 1, l and I, so a password is easy to read and type from paper.
- **At least one from each ticked set**: for sites that demand a digit or a symbol. Passwords that miss a set are thrown away and drawn again, so the result stays fully random.

## Worked example

With length 20 and all four sets ticked there are 89 possible characters. Without the "each set" rule that gives 20 × log2(89) = 129.5 bits. Requiring every set leaves out the few passwords that miss one, so the page shows 129.4 bits. Leaving out look-alikes cuts the pool to 83 characters and gives 127.3 bits, still far beyond any guessing attack.

## FAQs

**How many bits do I need?** 80 bits or more is out of reach of guessing attacks today; this page calls 100 bits and above very strong.

**Why is there no word-based (passphrase) mode?** Not yet: it needs an open word list, which this page does not include so far.

**Is the password stored anywhere?** No. Close the page and it is gone, so copy it into your password manager first.
