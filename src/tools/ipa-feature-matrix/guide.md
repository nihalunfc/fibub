---
name: IPA feature matrix
num: 731
shelf: science
section: linguistics-and-phonetics
title: "Distinctive feature matrix for IPA segments, natural classes and minimal feature sets (free)"
summary: "Type IPA segments and get their distinctive features (+, −, 0 for syllabic, consonantal, sonorant, continuant, nasal, voice, labial, coronal, dorsal, high, back, round and more). Find the features a set of sounds shares and the smallest set that picks it out. Export LaTeX or CSV."
status: live
ads: true
order: 731
icon: table
works: offline
updated: 2026-11-09
related: [data-cleaner, ipa-keyboard]
sources:
  - "Feature values are derived on this page by rule from each symbol's standard IPA description (place, manner and voicing; vowel height, backness and rounding), in the tradition of Chomsky and Halle (1968, The Sound Pattern of English) with place features as in modern textbooks (e.g. Hayes 2009, Introductory Phonology). No published feature chart is copied; frameworks differ on details."
flow:
  - { icon: pencil, label: "Type IPA" }
  - { icon: table, label: "Features" }
  - { icon: target, label: "Class" }
  - { icon: download, label: "LaTeX/CSV" }
---

## What it does

Phonology describes sounds as bundles of **distinctive features**: [±voice], [±sonorant], [±continuant] and so on. Sounds that pattern together in a rule (all voiceless stops, all high vowels) usually share features that no other sound in the language has, and are called a **natural class**. This tool does the bookkeeping that phonology exercises and papers need:

- a **feature matrix** for any list of IPA segments, with +, − and 0 (not applicable);
- the **features a chosen set shares**;
- the **smallest feature sets** that pick out exactly that set within your inventory, or a clear "not a natural class" with the extra segments that get in;
- **find by features**: type [+voice −sonorant] and see which segments match;
- export as a **LaTeX tabular** or **CSV**.

## How to use it

1. Type or paste the language's segments in the first box, separated by spaces. Affricates need a tie bar (t͡ʃ) or a ligature (ʧ), because "tʃ" is read as two segments. The buttons fill in an example inventory, every consonant on the IPA chart, or every vowel.
2. Diacritics after a symbol change its features: ʰ [+spread glottis], ̤ breathy [+spread glottis], ̰ creaky and ʼ ejective [+constricted glottis], ̥ [−voice], ̬ [+voice], ̃ [+nasal], ʷ [+labial, +round], ʲ [+high, +front], ˠ velarised, ˤ pharyngealised, ̩ [+syllabic], ̯ [−syllabic], ̪ dental, ː [+long]. Other diacritics are kept in the symbol but not turned into features; the page says which.
3. Tap column heads in the matrix, or type the segments in **Chosen segments**, to test a set as a natural class.
4. Tick **Hide features that are the same for every segment** to shorten the matrix.
5. Download the matrix as CSV or as a LaTeX tabular (features down, segments across). Compile the .tex with XeLaTeX or LuaLaTeX and a font with IPA symbols.

## How the values are set

Every value comes from the symbol's IPA description by a rule, not from a table: obstruents (plosives, fricatives, affricates, clicks, implosives, ejectives) are [−sonorant]; plosives, nasals and affricates are [−continuant]; affricates alone are [+delayed release]; central approximants and glottals are [−consonantal]; labials, coronals (dental to retroflex, plus alveolo-palatal) and dorsals (palatal to uvular, and every vowel) get their place features, and features such as [anterior], [distributed], [round], [high] and [back] are 0 where their place does not apply. Labiodental and sibilant fricatives and affricates are [+strident]. Close and close-mid vowels are [+tense]; the others are [−tense].

Frameworks differ. Some make laterals [−continuant], [h] and [ʔ] [+sonorant], palatals [+coronal] as well as dorsal, or use [ATR] instead of [tense]. Check the values against the framework your course or paper uses.

## Worked example

The example inventory opens with **p t k** chosen. They share 14 features, and the tool reports **p t k = [−delayed release, −voice]**: the voiceless segments that are stops. Choose **m n ŋ** instead and the answer is the single feature [+nasal]. Choose **s z ʃ ʒ t͡ʃ d͡ʒ** and two sets of two features each work: [−labial, +strident] or [+coronal, +strident]. Choose **p z** and the page says it is not a natural class: every segment with all their shared features also includes t b d f θ s ʃ v ð ʒ t͡ʃ d͡ʒ, the other obstruents made in front of the velum. In **Find segments by features**, [+voice −sonorant] lists b d ɡ v ð z ʒ d͡ʒ.

## FAQ

**Why is the minimal set not the one in my textbook?** The tool finds the *smallest* sets within *your* list, and lists every set of that size. Textbooks often add redundant features to make the class easier to read; [−sonorant, −continuant, −voice] for p t k is also correct, just longer.

**Can I change a value?** Not in the page; download the CSV and edit it, or adjust the LaTeX.

**Is anything stored?** No. Nothing is saved or sent; the page works offline once loaded.
