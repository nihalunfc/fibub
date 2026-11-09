---
name: Entropy and channel capacity calculator
num: 578
shelf: science
section: information-theory-and-cryptography
title: "Entropy calculator: Shannon entropy, mutual information, KL divergence and channel capacity (Blahut-Arimoto)"
summary: "Shannon entropy of a probability distribution, of text or of any file's bytes; joint and conditional entropy and mutual information from a table; Kullback-Leibler and Jensen-Shannon divergence; and the capacity of binary symmetric, erasure, Z and any discrete channel by the Blahut-Arimoto algorithm. Nothing is uploaded."
status: live
ads: false
order: 578
icon: sigma
works: offline
updated: 2026-11-09
related: [biodiversity-indices, link-budget-calculator, compress-file]
sources:
  - "Formulas: Shannon (1948); Cover and Thomas, Elements of Information Theory (general textbook definitions). Blahut-Arimoto as in Blahut (1972) and Arimoto (1972), with Blahut's upper and lower bounds."
  - "Checked against scipy.stats.entropy, scipy's Jensen-Shannon distance, scikit-learn's mutual_info_score and, for channel capacity, a separate scipy.optimize maximisation of I(X;Y) plus the closed forms for the binary symmetric, erasure and Z channels."
  - "The example numbers (the weather and umbrella counts, the channel matrix, the sentence) are made up for this tool."
flow:
  - { icon: pencil, label: "Type or open" }
  - { icon: sigma, label: "Entropy" }
  - { icon: link, label: "Channel" }
  - { icon: chart, label: "Chart" }
---

## What it does

Entropy measures uncertainty: how many yes-or-no questions, on average, it takes to learn the outcome. It is the number behind compression, coding, cryptography, machine learning loss functions and diversity indices. This calculator works out the main quantities of information theory, with the working shown:

- **Distribution**: the Shannon entropy H of probabilities or counts, the maximum log n, efficiency and redundancy, perplexity, and two Rényi entropies used in cryptography: the **min-entropy** H∞ (guessing the most likely value) and the **collision entropy** H₂.
- **Text or file**: the entropy per character, byte or word of text you paste, or of the bytes of any file on your device, with the most common symbols charted and the order-0 coding limit (the smallest size a code that treats each symbol on its own can reach).
- **Joint table**: H(X), H(Y), the joint entropy H(X,Y), the conditional entropies H(X|Y) and H(Y|X) and the **mutual information** I(X;Y), drawn as an information diagram.
- **Divergence**: the **Kullback-Leibler divergence** D(P‖Q) both ways, the cross-entropy H(P, Q) and the Jensen-Shannon divergence.
- **Channel**: the capacity of the binary symmetric channel (bits flip), the binary erasure channel (bits go missing), the Z channel, and any channel you type as a matrix, found by the **Blahut-Arimoto** algorithm with its upper and lower bounds at each step.

Every answer can be shown in bits (log base 2), nats (natural log) or hartleys (log base 10).

## How to use it

1. Choose what to measure at the top, and the units.
2. Type or paste your numbers. Commas, spaces or new lines all work, and fractions such as 1/3 are fine. Counts are turned into probabilities for you. A distribution can also be "label, value" lines straight from a spreadsheet, and the tables take a header row and a first column of names. **Open a file** reads CSV, TSV, text or Excel.
3. For text, choose whether to count characters, UTF-8 bytes or words. **Measure a file's bytes** reads any file (up to 200 MB) on your device: a photo, a zip, a program. It is never uploaded.
4. For a channel, choose its type and type the probability p, or type the matrix P(y | x): one row per input, one column per output.
5. Download the table as CSV, or the whole result as an image, PDF or Word file.

## Worked example

**A distribution.** The values 0.5, 0.25, 0.125, 0.125 give H = 1.75 bits. The maximum for four values is log₂ 4 = 2 bits, so the efficiency is 87.5 % and the redundancy 12.5 %. The perplexity is 2^1.75 ≈ 3.364: the distribution is as uncertain as a fair choice among 3.4 values. The min-entropy is 1 bit, because the best single guess is right half the time.

**A joint table.** The made-up example counts how often 100 people took an umbrella on sunny, cloudy and rainy days. The weather has H(X) = 1.513 bits and the umbrella H(Y) = 0.958 bits. Together H(X,Y) = 2.178 bits, so the mutual information is I(X;Y) = 1.513 + 0.958 − 2.178 = 0.2929 bits: seeing the umbrella tells you about 0.29 bits about the weather.

**A channel.** The example 3-input channel (each input mostly arrives right, sometimes slips) has capacity C = 0.67919287 bits per use. Blahut-Arimoto reaches it with inputs used in proportions 0.384, 0.210 and 0.406, not equally: the middle input is the noisiest, so it is used least. A binary symmetric channel with p = 0.11 has C = 1 − h(0.11) = 0.5001 bits: about half a bit gets through per use.

## Tips

- Text entropy here is order-0: it treats every symbol as independent. English letters measure about 4.1 bits each this way, though the true entropy of English is near 1 bit per letter because of spelling and grammar. Compression programs use that structure.
- A file near 8 bits per byte is already compressed, encrypted or random. Plain text sits near 4 to 5.
- D(P‖Q) is not symmetric and becomes infinite if Q gives zero probability to something P allows. The table shows which value is to blame.

## What it does not do

It does not estimate entropy rates of sources with memory (Markov or Lempel-Ziv estimates), continuous (differential) entropy, or channels with continuous signals such as Shannon-Hartley; the link budget calculator covers that one.

## FAQ

**Why does the channel answer give a lower and an upper bound?** Blahut-Arimoto improves an input distribution step by step. At every step the true capacity is known to lie between the two bounds; the tool stops when they are within 10⁻¹² of each other.

**Is anything sent anywhere?** No. Text and files are read in your browser and never leave your device.
