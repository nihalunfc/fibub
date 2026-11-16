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
  - "Passphrases use a short list of 618 plain English words written for fibub (no outside word list), so each word is log2(618) = 9.27 bits; a PIN digit is log2(10) = 3.32 bits. Example attack time uses 10 billion guesses a second, a round example figure, not a measurement."
flow:
  - { icon: sliders, label: "Choose" }
  - { icon: lock, label: "Generate" }
  - { icon: copy, label: "Copy" }
---

## What it does

A good password is long and truly random, so nobody can guess it from your name, a word or a pattern. This page makes random-character passwords, word passphrases or numeric PINs, using your browser's secure random number source, the same one used for encryption.

It also shows the entropy: how many bits of randomness each password has, which tells you how many guesses an attacker would need. The passwords are made on your device and are never sent or saved. To test a password you already have, use the [[password-strength|password strength checker]]; for random IDs rather than passwords, try the [[uuid-generator]].

## How to use it

1. Choose the kind (random characters, passphrase or PIN), or tap a quick setting: Wi-Fi, everyday or very long.
2. Drag the slider or type the length (20 characters is filled in) and tick the character sets you want. For a passphrase pick the number of words and the separator.
3. Five passwords appear straight away, with their bits of randomness and an example of how long trying every possibility would take. Press **Copy** next to one, or **Copy all**.
4. Press **Make new ones** for a fresh set (changing a setting does too).

## What each setting does

- **Length**: from 8 to 128 characters. Each extra character multiplies the number of possible passwords.
- **How many**: 1 to 100 passwords at once.
- **Use these characters**: lower case, upper case, digits and 27 symbols. Untick symbols for sites that refuse them.
- **Kind**: random characters (the strongest per character), a passphrase of random common words (easier to type and remember), or digits only for a PIN.
- **Passphrase**: 3 to 12 random words from a plain built-in list, with your choice of separator, capitals and one random digit. Each word adds about 9.3 bits, so the page starts at 9 words (83 bits, strong). Fewer words means fewer bits and the page says so.
- **PIN**: 4 to 12 random digits. A PIN has few combinations (6 digits is about 20 bits), so use one only where the app locks after a few wrong tries.
- **Quick settings**: Wi-Fi is 20 letters and digits without look-alikes; everyday is 20 of everything; very long is 64.
- **Fewer symbols**: keeps only ! @ # $ % & * ? - _ for sites that reject other symbols.
- **Leave out these characters**: type any characters you never want. If that leaves nothing, the page asks you to allow some.
- **Leave out look-alikes**: removes 0, O, o, 1, l and I, so a password is easy to read and type from paper.
- **At least one from each ticked set**: for sites that demand a digit or a symbol. Passwords that miss a set are thrown away and drawn again, so the result stays fully random.

## Worked example

With length 20 and all four sets ticked there are 89 possible characters. Without the "each set" rule that gives 20 × log2(89) = 129.5 bits. Requiring every set leaves out the few passwords that miss one, so the page shows 129.4 bits. Leaving out look-alikes cuts the pool to 83 characters and gives 127.3 bits, still far beyond any guessing attack.

## FAQs

**How many bits do I need?** 80 bits or more is out of reach of guessing attacks today; this page calls 100 bits and above very strong.

**Where do the passphrase words come from?** A short plain list of common English words written for this site and built into the page. Because the list is small, each word adds about 9.3 bits, so use 9 or more words for a strong passphrase. Words are picked with the same secure random numbers as the characters.

**Why does the time shown change so much?** It is an example at 10 billion guesses a second, a very fast attack on a stolen password file. Sites that limit tries are far slower to attack.

**Is the password stored anywhere?** No. Close the page and it is gone, so copy it into your password manager first.
