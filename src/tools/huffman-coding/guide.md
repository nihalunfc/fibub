---
name: Huffman and arithmetic coding visualiser
num: 579
shelf: science
section: information-theory-and-cryptography
title: "Huffman coding and arithmetic coding visualiser: tree, code table, encode and decode, step-by-step intervals"
summary: "Build a Huffman code from a message or from symbol probabilities: see the tree, the code table, the average length against the entropy, and encode or decode bits. Then watch the same message arithmetic coded, interval by interval, with exact fractions."
status: live
ads: true
order: 579
icon: table
works: offline
updated: 2026-11-09
related: [entropy-calculator, compress-file, error-correcting-codes, cipher-teacher, algorithm-visualiser, zip-checker]
sources:
  - "Methods: Huffman (1952), canonical Huffman codes as used in DEFLATE (RFC 1951), and arithmetic coding as in Cover and Thomas, Elements of Information Theory (general textbook methods)."
  - "Checked against a Python reference written for this tool: heapq Huffman with the same tie rule, and an exact fractions.Fraction arithmetic coder, on four messages and a probability list (codes, bits, final intervals and tags all equal)."
  - "The example messages are made up or traditional (abracadabra, a tongue twister)."
flow:
  - { icon: pencil, label: "Message" }
  - { icon: link, label: "Tree" }
  - { icon: table, label: "Code table" }
  - { icon: ruler, label: "Intervals" }
---

## What it does

Compression works by giving common symbols short codes and rare ones long codes. This tool shows the two classic ways to do it, step by step, for any message you type:

- **Huffman coding** joins the two least likely symbols again and again until one tree is left. Reading the path from the top to each symbol (left 0, right 1) gives its code. The tool draws the tree, lists every code, and compares the **average code length L** with the **entropy H**, the smallest average any code can reach. Huffman always lands within one bit: H ≤ L < H + 1.
- **Encode and decode**: your message as a string of bits, and a box to turn bits back into symbols with the same code.
- **Canonical codes**: the same code lengths with codes given out in order, so a file only needs to store the lengths. DEFLATE (zip, PNG) and JPEG do this.
- **Arithmetic coding** gives the whole message one number. It starts with the interval from 0 to 1, and for each symbol shrinks it to that symbol's share. The final interval's width is the probability of the whole message, and the code is the shortest binary fraction whose range fits inside it. The tool does every step with exact fractions, draws the first six, and lists them all.

Find the entropy limit for your symbols with the [[entropy-calculator]], and add check bits for a noisy channel with [[error-correcting-codes]].

## How to use it

1. Type a message, or switch to **Symbols and probabilities** and list each symbol with its probability or count, one per line (for example `a 0.4`). Write `space` for a space. Symbols can be whole words; then a message is split at spaces.
2. Read the tree and the code table. Tick **Canonical codes** to see the canonical version.
3. The encoded bits appear under the table. Type or paste any bits into **Decode bits** to read them back.
4. Scroll down for the arithmetic coding of the same message (up to 1,000 symbols).
5. Download the code table or the steps as CSV, or everything as an image, PDF or Word file.

## Worked example

The example, **abracadabra**, has 11 letters: a five times, b and r twice, c and d once. Huffman gives a the one-bit code 0, and b, r, c and d three-bit codes, so the average is 23 / 11 = 2.0909 bits per letter, against an entropy of 2.0404 bits: 97.58 % efficient. The whole word takes 23 bits, against 33 with a fixed 3-bit code and 88 as UTF-8 text.

Arithmetic coding of the same word ends with the interval from 0.2650551279 to 0.2650553031 (exactly 6874847395/25937424601 to 75623371345/285311670611). Its width is 2^−22.444, so the message carries 22.44 bits of information, and the shortest code that fits is **23 bits**, 01000011110110101010100. On longer messages arithmetic coding pulls ahead, because it is not limited to a whole number of bits per symbol.

With the probabilities 0.4, 0.2, 0.2, 0.1 and 0.1 the average Huffman length is 2.2 bits against an entropy of 2.1219.

## Tips

- Ties can be broken in different ways, giving different codes with the same average length. This tool always takes the lighter node first and, on a tie, the one made earliest; the first one taken gets 0.
- A symbol with probability above 0.4 always gets a code of one or two bits; one with probability 1 gets the code 0.
- The arithmetic coder here uses the counts of the message itself as its model, so the decoder needs those counts too. Real coders send them, or learn them as they go (adaptive coding).

## What it does not do

It is a teaching tool for short messages, not a file compressor: there is no adaptive model, no range-coder rounding and no file output. For compressing real files, use a compressor such as the file compressor on this site.

## FAQ

**Why is Huffman sometimes as good as arithmetic coding?** When every probability is a power of one half (1/2, 1/4, 1/8 ...), Huffman lengths equal −log₂ p exactly and both reach the entropy.

**Is my message sent anywhere?** No. Everything is worked out in your browser.
