---
title: 'Coding and decoding'
seoTitle: 'Coding and decoding tricks for CUET reasoning'
summary: 'Letter shifts, reversed alphabets, number codes and word-for-word codes: compare the word with its code letter by letter and the rule appears. An interactive cipher strip and practice.'
minutes: 13
updated: 2026-11-22
quiz:
  - q: 'If CAT is coded as DBU, how is DOG coded?'
    choices: ['EPH', 'CNF', 'EPG']
    ans: 0
    why: Each letter moves forward by 1, so D → E, O → P, G → H.
  - q: 'In a code, A = 26, B = 25, ..., Z = 1. What is the code for E?'
    choices: ['22', '5', '21']
    ans: 0
    why: Reverse positions add to 27 with the normal position, 27 − 5 = 22.
  - q: '"sky is blue" = "ta na pa" and "blue is deep" = "pa ka na". What is the code for "blue is"?'
    choices: ['"na pa" in some order', '"ta ka"', '"ka pa"']
    ans: 0
    why: '"is" and "blue" appear in both sentences, as do "na" and "pa". The common words match the common codes.'
sources:
  - 'National Testing Agency, CUET (UG) syllabus for the General Test (logical and analytical reasoning) https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 4 · about 13 minutes.** By the end you will crack shift, reverse, number and word codes by comparing letter by letter.

<div class="bigidea">A code is a rule applied to each letter or word. Write the word and its code one above the other, and look at what happens to each letter.</div>

## 1. Letter shifts

<figure class="fig" data-fig="cipher"><figcaption>Choose a shift and a word. Every letter moves the same number of places, wrapping from Z back to A.</figcaption></figure>

<div class="steps" data-title="Find the rule: TABLE is written UCEPJ">
<div class="step">Write the positions of the word: T 20, A 1, B 2, L 12, E 5.</div>
<div class="step">And of the code: U 21, C 3, E 5, P 16, J 10.</div>
<div class="step">Changes, letter by letter: +1, +2, +3, +4, +5. The shift grows by one each time.</div>
<div class="step">So CHAIR would be C+1, H+2, A+3, I+4, R+5 = <b>DJDMW</b>. Had you stopped after the first letter (+1), you would have picked the wrong option.</div>
</div>

## 2. Other code types

- **Reverse alphabet:** A ↔ Z, B ↔ Y ... each pair adds to 27.
- **Number codes:** each letter replaced by its position (or reverse position), sometimes summed: CAT = 3 + 1 + 20 = 24.
- **Word codes:** several sentences in code; a word that appears in two sentences has the code that appears in both.
- **Reversed words:** the letters written backwards, sometimes then shifted.

<div class="myth">

**"I can see the pattern from the first two letters."** Many codes use a changing shift (+1, +2, +3) or treat odd and even positions differently. Always check every letter before you look at the options.

</div>

## 3. Practice

<div class="qbank" data-bank="cuet-general-test" data-topics="coding-decoding" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- Write positions above the word and its code, and compute every change.
- Reverse alphabet pairs add to 27.
- In word codes, words shared by two sentences share their codes.
- Shifts may grow (+1, +2, +3) or differ for odd and even positions.

</div>
