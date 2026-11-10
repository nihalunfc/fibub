---
name: Error-correcting codes playground
num: 580
shelf: science
code: T408
section: information-theory-and-cryptography
title: "Error-correcting codes playground: parity, Hamming (7,4) and SECDED, CRC and Reed-Solomon, step by step"
summary: "Encode a message, damage it by tapping bits or bytes, and watch the decoder find and fix the errors: parity bits, Hamming (7,4) and (15,11) with SECDED, CRC-8, CRC-16 and CRC-32 with the long division shown, and Reed-Solomon over GF(2⁸) with Berlekamp-Massey and Forney."
status: live
ads: true
order: 580
icon: check
works: offline
updated: 2026-11-09
related: [huffman-coding, entropy-calculator, link-budget-calculator, cipher-teacher, checksum-checker, constellation-ber]
sources:
  - "Methods: Hamming (1950); CRC parameters in the Rocksoft model with the standard check values; Reed-Solomon (1960) decoded with Berlekamp-Massey and Forney as in common textbooks (general methods)."
  - "Checked against the reedsolo Python package (encodings, error positions and decodings of ten random blocks with up to nsym/2 errors, and a block with too many errors), crcmod and zlib (eight CRCs on three inputs), and exhaustive single and double error tests of every Hamming code."
  - "Example messages are made up for this tool."
flow:
  - { icon: pencil, label: "Encode" }
  - { icon: pointer, label: "Add errors" }
  - { icon: search, label: "Syndrome" }
  - { icon: check, label: "Correct" }
---

## What it does

Every phone call, QR code, hard disk and space probe relies on codes that add a little redundancy so that errors can be found, and often fixed. This playground lets you send a message through each of the classic codes, damage it yourself, and see exactly how the receiver reacts:

- **Single parity bit**: one extra bit makes the count of 1s even (or odd). It detects any odd number of flipped bits, misses an even number, and cannot correct anything.
- **Hamming (7,4) and (15,11)**: three or four parity bits at positions 1, 2, 4 and 8. The failed checks spell out, in binary, the position of a single wrong bit, which is then flipped back.
- **SECDED (8,4) and (16,11)**: Hamming plus one overall parity bit. It still corrects one error, and now also detects two (single error correction, double error detection), as in computer memory.
- **CRC**: CRC-8, CRC-16 (ARC, CCITT, XMODEM, Modbus) and CRC-32 (zip, PNG, Ethernet) and CRC-32C of any text or bytes, with the polynomial long division worked out by hand for short bit strings.
- **Reed-Solomon** over GF(2⁸), the code in QR codes, CDs and deep-space links: choose the number of check bytes, tap bytes to damage them, and see the syndromes, the Berlekamp-Massey steps, the error locator, the positions from a Chien search and the error values from Forney's formula.

Work out how much a noisy channel can carry with the [[entropy-calculator]], and make CRC and SHA checksums for real files with the [[checksum-checker]].

## How to use it

1. Choose the code at the top.
2. **Parity and Hamming**: type the data bits. The sent codeword appears with its parity bits marked p. Tap bits in the received row to flip them. The table shows each parity check, which ones fail, and the syndrome.
3. **CRC**: choose a CRC and type text, or switch to hex bytes. Below, type message and generator bits to see the long division; the received bits box checks a codeword (change a bit to see the remainder become non-zero).
4. **Reed-Solomon**: type a message and choose the number of check bytes. Tap any byte to damage it, or add random errors. Up to half the number of check bytes can be fixed, wherever they are.
5. Download the result as an image, PDF or Word file, or the Reed-Solomon bytes as CSV.

## Worked example

**Hamming (7,4).** The data 1011 is sent as 0110011. The page starts with the fifth bit flipped, so 0110111 arrives. Check p1 (positions 1, 3, 5, 7) fails, p2 (2, 3, 6, 7) passes and p4 (4, 5, 6, 7) fails: the syndrome is 101 in binary, which is 5, so bit 5 is flipped back and 1011 is recovered. Flip a second bit and plain Hamming "corrects" the wrong bit; switch to (8,4) SECDED and the same two errors are reported as uncorrectable.

**CRC.** The CRC-32 of the text 123456789 is 0xCBF43926, the standard check value. By hand, the message 11010011101100 divided by the generator 1011 (x³ + x + 1) leaves the remainder 100, so the codeword 11010011101100100 is sent.

**Reed-Solomon.** "Hello, fibub!" is 13 bytes; with 4 check bytes it becomes a 17-byte block, RS(17, 13). Damage any two bytes, even check bytes, and the decoder finds both positions and their values and returns the original text. Damage three, and it reports that there are too many errors.

## Tips

- A Hamming code with r parity bits protects 2^r − 1 − r data bits. The overhead shrinks as blocks grow, but so does the chance that the block has only one error.
- CRCs only detect errors, but they catch every burst shorter than their width, which is why they guard network packets and files.
- Reed-Solomon works on whole bytes, so a burst that ruins eight bits in a row costs only one or two byte errors. That is why scratched CDs still play.

## What it does not do

Reed-Solomon here corrects errors but does not use erasures (known bad positions), which could double what it can fix. It does not cover convolutional, turbo, LDPC or BCH codes.

## FAQ

**Can a code with too many errors give the wrong answer?** Yes. With more errors than it can correct, a decoder may land on a different valid codeword. The page says so when it happens.

**Is my message sent anywhere?** No. All the coding runs in your browser.
