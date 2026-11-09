---
name: IPA keyboard
num: 732
shelf: science
section: linguistics-and-phonetics
title: "IPA keyboard online: type phonetic symbols by clicking the IPA chart or with X-SAMPA (free)"
summary: "Click consonants, vowels, diacritics, stress marks and tones laid out like the IPA chart, or type X-SAMPA and get IPA. Copy the transcription and see the name and Unicode code point of every symbol in it."
status: live
ads: true
order: 732
icon: pencil
works: offline
updated: 2026-11-09
related: [data-cleaner, ipa-feature-matrix, interlinear-gloss, vowel-formant-chart, corpus-concordancer, pitch-contour-tracker]
sources:
  - "Symbols and their phonetic descriptions: the International Phonetic Alphabet as organised by the International Phonetic Association; characters and code points from the Unicode Standard."
  - "X-SAMPA: J. C. Wells (1995), Computer-coding the IPA: a proposed extension of SAMPA (University College London)."
flow:
  - { icon: pointer, label: "Click symbol" }
  - { icon: pencil, label: "Or X-SAMPA" }
  - { icon: copy, label: "Copy" }
---

## What it does

Phonetic transcription needs symbols that are not on any ordinary keyboard: ʃ, ŋ, ɛ, ʔ, a stress mark ˈ, a length mark ː, tone marks and dozens of diacritics. This page puts them all one click away, laid out the way the IPA chart is, and adds three things that save time when you transcribe a lot:

- **X-SAMPA input.** Type `D@ k{t` and get ðə kæt. X-SAMPA is the standard way of writing every IPA symbol with plain ASCII characters, so you can transcribe at full typing speed.
- **Names and code points.** Every key shows its full name (for example "voiced retroflex lateral approximant") and its Unicode code point, so you can be sure you used ɡ (U+0261) and not the keyboard's g, or ʼ (U+02BC) and not an apostrophe.
- **What is in the transcription.** A table lists every character you used, its code point, its name and how often it appears, and flags anything that is not an IPA symbol.

Look up the features of the symbols you typed in the [[ipa-feature-matrix]], and set out glossed examples with the [[interlinear-gloss|interlinear gloss formatter]].

## How to use it

1. Put the cursor where you want a symbol in the **Transcription** box, then click keys below. They go in at the cursor.
2. The **Keyboard** has six groups: *Consonants* (the pulmonic chart, places across and manners down, voiceless left and voiced right in each cell; scroll sideways on a phone), *Other consonants* (clicks, implosives, ejectives, other symbols, affricates with a tie bar), *Vowels* (height down, backness across, unrounded left and rounded right), *Diacritics*, *Stress, length* and *Tones*.
3. **Diacritics** are combining characters: type the base symbol first, then the diacritic. They are shown on a dotted circle ◌ so you can see where they sit.
4. **X-SAMPA**: type in the X-SAMPA box and the IPA appears beneath it as you type; press *Add to the transcription*. *Transcription to X-SAMPA* does the reverse, handy for software that only takes ASCII.
5. **Copy** puts the transcription on the clipboard, ready to paste into a document, Praat, ELAN or a spreadsheet.

## Worked example

The page opens with ðə ˈnɔːθ ˌwɪnd ən ðə ˈsʌn already in the box. The table below lists 13 different characters in 20, including ˈ (U+02C8, primary stress), ˌ (U+02CC, secondary stress) and ː (U+02D0, long). In the X-SAMPA box, `"fA:D@`` shows ˈfɑːðɚ. Change it to `t_hIN` and you get tʰɪŋ: `_h` is aspiration, `I` is ɪ and `N` is ŋ. `t_S` gives t͡ʃ with a tie bar, `a_H` gives á with a high tone, and `b_<` gives the implosive ɓ.

## X-SAMPA in brief

Most lowercase letters stand for themselves. Capitals and digits give other symbols (S ʃ, Z ʒ, T θ, D ð, N ŋ, E ɛ, O ɔ, @ ə, { æ, 1 ɨ, 2 ø, 3 ɜ, 9 œ, ? ʔ). A backslash makes a related symbol (r\ ɹ, h\ ɦ, ?\ ʕ), a backtick makes a retroflex (t` ʈ, s` ʂ), and an underscore starts a diacritic (_h aspirated, _0 voiceless, _w labialised, _j palatalised, _d dental, _> ejective, _< implosive). An underscore before a letter that is not a diacritic is a tie bar (t_S). " and % are stress, : is long, ~ nasalised and = syllabic.

## FAQ

**Why do some symbols look odd?** The page uses fonts already on your device. Windows, macOS, Android and iOS all include fonts with the IPA, but combining diacritics on top of each other can look cramped in some of them. Fonts made for phonetics, such as Charis SIL or Doulos SIL, are used automatically if you have one installed.

**Is the text saved?** No. Nothing is stored or sent anywhere; copy your transcription before leaving the page.

**Which IPA version?** The symbols and categories of the current IPA chart. ᵻ and ᵿ are common convenience symbols that are not on the chart; they are marked as such.
