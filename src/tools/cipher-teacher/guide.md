---
name: Classical cipher and hash teaching tool
num: 581
shelf: science
section: information-theory-and-cryptography
title: "Cipher and hash teaching tool: Caesar, Vigenère, affine, Atbash, rail fence, and SHA-256 step by step"
summary: "Encrypt and decrypt with the classical ciphers (Caesar, Vigenère, affine, Atbash, rail fence) and see the working and the letter frequencies of your text. Then follow SHA-256 through padding, the message schedule and all 64 rounds, and watch one flipped bit change about half the hash."
status: live
ads: true
order: 581
icon: lock
works: offline
updated: 2026-11-09
related: [entropy-calculator, error-correcting-codes, huffman-coding]
sources:
  - "Methods: the classical ciphers as described in general cryptography textbooks; SHA-256 as specified in NIST FIPS 180-4 (a public standard; its round constants are part of the specification)."
  - "Checked against Python's hashlib (8 fixed messages, including empty, 55, 56 and 64 bytes and multi-block, and 20 random ones), a separate Python SHA-256 for every round and message-schedule word, the FIPS 180-2 worked example for \"abc\", and textbook cipher examples plus a Python reference for each cipher."
  - "Example texts are made up for this tool."
flow:
  - { icon: pencil, label: "Type text" }
  - { icon: lock, label: "Encrypt" }
  - { icon: chart, label: "Letter chart" }
  - { icon: sigma, label: "SHA-256" }
---

## What it does

This is a teaching tool for the first steps of cryptography: the hand ciphers people used for centuries, and a modern hash function opened up so you can see every step.

**Classical ciphers**, with encrypt and decrypt:

- **Caesar**: every letter moves the same number of places.
- **Vigenère**: the shift changes letter by letter, following a keyword.
- **Affine**: each letter number x becomes a·x + b, counted round the alphabet.
- **Atbash**: the alphabet reversed, A↔Z.
- **Rail fence**: the text written in a zigzag over several rails and read off row by row. Letters move but do not change.

For each one the tool shows its working (the letter mapping, the keyword under the text, or the zigzag) and a **letter-frequency chart** of your input and output side by side, with the index of coincidence: the chance that two letters picked at random are the same. You can see why substitution ciphers leak the shape of the language, and why Vigenère flattens it.

**SHA-256 step by step**, for any text or bytes:

1. **Padding** to whole 512-bit blocks, shown in hex.
2. The **message schedule**: the 64 words W₀ to W₆₃ of the block, and what each is made from.
3. The **64 rounds**: the eight working registers a to h after every round, with the round constant Kₜ and word Wₜ.
4. The **final addition** that gives the hash, checked against your browser's own SHA-256.
5. An **avalanche** demo: flip any single bit of the message and see how many of the 256 hash bits change, drawn as a grid.

## How to use it

1. Choose **Classical ciphers** or **SHA-256 step by step**.
2. For a cipher, choose it, the direction and the key, and type your text. **Use the output as input, and reverse** sends the result back through, to check that it decrypts.
3. For SHA-256, type text (or hex bytes). For long messages, choose which block's working to show.
4. Change the bit number in the avalanche box to flip a different bit.
5. Download the working as an image, PDF or Word file, or the rounds as CSV.

## Worked example

**Caesar.** With a shift of 3, "Meet me at the old oak tree at noon" becomes "Phhw ph dw wkh rog rdn wuhh dw qrrq". The letter chart of the output has exactly the same bars as the input, moved three places to the right: E, the most common letter here, has become H.

**Vigenère.** The classic example ATTACKATDAWN with the keyword LEMON gives LXFOPVEFRNHR. The two As in ATTACK become L and O, so letter counts no longer give the game away so easily.

**SHA-256.** The hash of abc is ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad. After round 0 the register a holds 5d6aebcd and after round 63 it holds 506e3058, the values in the standard's own worked example. Flip bit 23 (the last bit of the c, so the message becomes abb) and the hash changes to 715edf8b…, with 124 of the 256 bits different.

## Tips

- An affine cipher with a = 1 is a Caesar cipher; with a = 25 and b = 25 it is Atbash.
- English text has an index of coincidence near 0.066; random letters give about 0.038. Caesar, affine and Atbash keep it unchanged, a good clue that a text is a simple substitution.
- A hash is not encryption: it cannot be reversed, and the same input always gives the same output.

## What it does not do

It does not break ciphers or search for keys, and it is not meant for protecting anything: none of these classical ciphers is secure. It does not do password hashing or other hash functions.

## FAQ

**Why does SHA-256 add 0x80 and the length?** The single 1 bit marks where the message ends, and the length stops two different messages from padding to the same blocks.

**Is my text sent anywhere?** No. Everything runs in your browser.
