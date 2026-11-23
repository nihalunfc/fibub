---
title: 'A Story of Numbers'
seoTitle: 'A Story of Numbers Class 8 notes: place value, bases'
summary: 'Class 8 Maths: how people counted (tally, Roman, Egyptian, Mayan), why zero and place value matter, and numbers in base 2, 5 and other bases.'
minutes: 50
updated: 2026-11-23
quiz:
  - q: 'In the Roman system, what does XLVII stand for?'
    choices: ['47', '67', '37', '43']
    ans: 0
    why: 'XL is 40 (10 before 50 is subtracted) and VII is 7. 40 + 7 = 47.'
  - q: 'What is 1011 in base 2 as an ordinary number?'
    choices: ['11', '13', '9', '15']
    ans: 0
    why: 'From the right the places are worth 1, 2, 4, 8. So 1011 = 8 + 0 + 2 + 1 = 11.'
  - q: 'Why did the Hindu-Arabic system with a zero beat older systems?'
    choices: ['The place of a digit gives its value, and zero keeps empty places', 'It uses more symbols for every number', 'It was easier to write on stone', 'It has no place value']
    ans: 0
    why: 'With place value and a zero, a few digits can write any number and calculations become easy.'
sources:
  - 'NCERT Class 8 Mathematics (Ganita Prakash), Chapter 3 “A Story of Numbers” (topic list only; all text, figures and questions here are original fibub work)'
  - 'History: Brahmi numerals and the Bakhshali manuscript (India, zero as a dot placeholder, about 3rd to 7th century CE; carbon-dated by Oxford in 2017); Brahmagupta, Brahmasphutasiddhanta (628 CE), rules for zero; Mayan base-20 numerals; Egyptian hieroglyphic numerals; Roman numerals. Standard history of mathematics.'
---

**Maths · Class 8 · Chapter 3 · about 50 minutes.** By the end you will be able to read numbers written in older systems, explain why place value and zero changed everything, and write numbers in base 2 and other bases.

<div class="bigidea">Counting began with scratches and stones. A great step was place value: the same digit can mean different amounts depending on where it stands. Add a zero for empty places and you can write any number with ten symbols.</div>

## 1. How people counted

A shepherd with 47 sheep could make a scratch on a stick for each sheep. That is **tally marking**, the oldest way of counting. To make it easier to read, tally marks are grouped in fives: four lines and a slanting line across them. It works for small numbers, but writing 4700 would need 4700 scratches!

So different peoples invented shorter ways. Watch four of them side by side. Slide the number up and see which system needs the most space.

<figure class="fig" data-fig="c8-num-systems"><figcaption>Tally, Roman, Egyptian and Hindu-Arabic for the same number. The tally stops at 50 marks; the others keep going. Which one stays shortest?</figcaption></figure>

**Egyptian** numbers (about 5000 years ago) used a new sign for each power of ten: a stroke for 1, an arch for 10, a coil for 100. To write a number you repeat the signs. 234 is two coils, three arches and four strokes. The order did not matter, and there was no zero.

**Roman** numerals use letters: I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000. Letters are added (VII = 5 + 1 + 1 = 7). A smaller letter before a bigger one is subtracted (IV = 4, IX = 9, XL = 40, XC = 90). You still see them on clock faces and in the names of kings. They are hard for calculation: try multiplying XXIV by XVII.

<div class="problem" data-problem="c8m-num-roman"></div>

<div class="myth">

**“Roman numerals have a zero.”** They do not. The Romans had no symbol for zero, and no place value, so there is no way to write “nothing in the tens place”.

</div>

**Mayan** numbers (Central America, about 2000 years ago) are written downwards in **base 20**. A dot is 1, a bar is 5, and a shell stands for 0. The lowest level counts ones (0 to 19), the one above counts twenties, and so on. So a number with 4 on the upper level and 7 on the lower is 4 × 20 + 7 = 87. Try it.

<figure class="fig" data-fig="c8-num-mayan"><figcaption>Slide the number from 0 to 399. Two levels are enough: dots are 1, bars are 5. The upper level is worth 20 each.</figcaption></figure>

<div class="problem" data-problem="c8m-num-mayan"></div>

## 2. Place value and the magic of zero

In the Hindu-Arabic number system we use today, the **place** of a digit gives its value. In 5 555 the same digit 5 means 5, 50, 500 and 5000. Ten ones are swapped for one ten, ten tens for one hundred, and so on. A **base** of ten means every place is worth ten times the one to its right. This system grew in India, was carried to the Arab world and then to Europe, which is why it is called Hindu-Arabic.

The abacus shows this clearly. Add beads to a column. When a column reaches ten beads you swap them for one bead in the next column.

<figure class="fig" data-fig="c8-num-abacus"><figcaption>An abacus with thousands, hundreds, tens and ones. Use +1, +10 and so on, and watch ten beads in a column turn into one bead on the left (a carry).</figcaption></figure>

The number 4 036 means 4 × 1000 + 0 × 100 + 3 × 10 + 6 × 1. The 0 does an important job: it keeps the empty hundreds place, so the 4 and the 3 stay in the right places. Without it 4036 would look like 436.

<figure class="fig" data-fig="c8-num-zero"><figcaption>Take the zero away and 25, 205 and 250 all look alike. Switch the zero on and each number is clear again.</figcaption></figure>

<div class="history">

**Zero comes from India.** Indian scholars used a dot as a place-holder in the Bakhshali manuscript (the birch-bark pages found near Peshawar, now in Oxford; its earliest pages were dated by carbon to about the 3rd century CE). In 628 CE the mathematician Brahmagupta wrote the rules for using zero: a number plus zero is the same number, and a number times zero is zero. Zero made written arithmetic simple enough for everyone.

</div>

Our number system needs only ten symbols, 0 to 9, to write any number however big, because place value does the rest. Compare this with the Roman system, which needs a new letter for every new size.

<div class="problem" data-problem="c8m-num-place"></div>

## 3. Other bases: counting in 2, 5, 8

Why ten? Most likely because we have ten fingers. If we had counted on the four-finger spaces of a hand, or only used two states such as on and off, we would have chosen another base. In **base b** each place is worth b times the one on its right, and we need only the digits 0 to b − 1.

In base 2 (**binary**) the places are 1, 2, 4, 8, 16, 32 … and only the digits 0 and 1 are used. The number 1011 in base 2 is `$1\times 8 + 0\times 4 + 1\times 2 + 1\times 1 = 11$`. Choose a base and a number below and see how it is built.

<figure class="fig" data-fig="c8-num-bases"><figcaption>Pick base 2, 5, 8 or 10 and slide the number. Each box shows a digit, its place value, and dots to show how many bundles of that size you have.</figcaption></figure>

**Computers use base 2** because a switch is either on (1) or off (0). Tap the eight switches below. The values of the switches that are on add up to the number.

<figure class="fig" data-fig="c8-num-bits"><figcaption>Eight bits, with place values 128, 64, 32, 16, 8, 4, 2, 1. Tap a switch to flip it, or use +1 to count up.</figcaption></figure>

<div class="problem" data-problem="c8m-num-bin"></div>

**Changing a number from base 10 to base 2.** Divide by 2 again and again. Each remainder is a binary digit, and you read them from last to first.

<div class="steps" data-fig="c8-num-divide">
<div class="step">Start with 45. Divide by 2, write the remainder, and repeat with the quotient.</div>
<div class="step">45 ÷ 2 = 22 remainder 1.</div>
<div class="step">22 ÷ 2 = 11 remainder 0.</div>
<div class="step">11 ÷ 2 = 5 remainder 1.</div>
<div class="step">5 ÷ 2 = 2 remainder 1.</div>
<div class="step">2 ÷ 2 = 1 remainder 0.</div>
<div class="step">1 ÷ 2 = 0 remainder 1. The quotient is 0, so we stop.</div>
<div class="step">Read the remainders from bottom to top: 101101. Check: 32 + 8 + 4 + 1 = 45.</div>
</div>

<div class="problem" data-problem="c8m-num-tobin"></div>

The same ideas work for any base. In base 5, the places are 1, 5, 25, 125. The number 243 in base 5 is 2 × 25 + 4 × 5 + 3 = 73 in base 10.

<div class="problem" data-problem="c8m-num-base5"></div>

<div class="myth">

**“Base 2 numbers are written with the digits 0, 1 and 2.”** In base b the digits go only from 0 to b − 1. In base 2 only 0 and 1 are used; “2” in base 2 is written 10, just as ten is written 10 in base ten.

</div>

You can explore all these systems in the number systems tool, and use the number theory toolkit for primes and factors.

<!--fig:tool number-systems-->

<div class="keypoints">

- Tally marks, Egyptian, Roman and Mayan numbers each had good ideas, but only place value with zero makes writing and calculation easy.
- In the Hindu-Arabic system a digit’s value depends on its place; zero keeps empty places. It came from India.
- Mayan numbers are base 20 (dot 1, bar 5, shell 0); Roman numerals add letters and subtract when a smaller one comes before a bigger one.
- In base b the places are powers of b, and digits go from 0 to b − 1.
- Binary (base 2) uses only 0 and 1, and it is how computers store numbers. Convert by dividing by 2 and reading the remainders from last to first.

</div>
