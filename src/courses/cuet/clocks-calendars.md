---
title: 'Clocks and calendars'
seoTitle: 'Clock angle and calendar questions for CUET'
summary: 'The angle between clock hands from one formula, when the hands overlap, and the day of the week for any date using odd days and leap years. An interactive clock, live problems and practice.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: 'What is the angle between the hands at 3:00?'
    choices: ['90°', '75°', '180°']
    ans: 0
    why: Each hour mark is 30° apart, and 3 × 30 = 90°.
  - q: 'Which of these years is a leap year?'
    choices: ['2000', '1900', '2100']
    ans: 0
    why: Century years are leap years only if divisible by 400. 2000 is; 1900 and 2100 are not.
  - q: 'If today is Monday, what day is it after 30 days?'
    choices: ['Wednesday', 'Tuesday', 'Thursday']
    ans: 0
    why: 30 = 4 weeks + 2 days, so two days after Monday is Wednesday.
sources:
  - 'National Testing Agency, CUET (UG) syllabus for the General Test (logical and analytical reasoning) https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Gregorian calendar leap-year rule (introduced 1582)'
---

**Module 4 · about 15 minutes.** By the end you will find clock angles with one formula and the day of the week for any date.

<div class="bigidea">Clocks: the minute hand gains 5.5° on the hour hand every minute. Calendars: only the days left over after full weeks ("odd days") change the day of the week.</div>

## 1. Clock angles

<figure class="fig" data-fig="clock-angle"><figcaption>Set any time. The shaded angle is the smaller one between the hands.</figcaption></figure>

```math
\theta = \left| 30H - 5.5M \right|
```

<div class="meaning">

<dl>
<dt>H, M</dt><dd>the hour and the minutes on the clock</dd>
<dt>30H</dt><dd>where the hour hand would be on the hour: 360° ÷ 12 = 30° per hour</dd>
<dt>5.5M</dt><dd>the minute hand moves 6° a minute, the hour hand 0.5° a minute, so the minute hand gains 5.5° a minute</dd>
<dt>Physical meaning</dt><dd>if the answer is over 180°, the smaller angle is 360° minus it. The hands overlap 11 times in 12 hours (every 65 5/11 minutes), not 12.</dd>
</dl>

</div>

<div class="problem" data-problem="clock-hands"></div>

## 2. Calendars with odd days

<div class="steps" data-title="What day was 15 August 2047?">
<div class="step">Odd days are the days left over after whole weeks. An ordinary year has 365 = 52 weeks + <b>1</b> odd day; a leap year has <b>2</b>.</div>
<div class="step">Leap years: divisible by 4, except century years, which must be divisible by 400.</div>
<div class="step">Start from a date you know. 15 August 2026 is a Saturday. From 2026 to 2047 is 21 years, with 5 leap days on the way (Feb 2028, 2032, 2036, 2040, 2044).</div>
<div class="step">Odd days = 21 + 5 = 26 = 3 weeks + 5 days. Saturday + 5 days = <b>Thursday</b>.</div>
</div>

<div class="myth">

**"Every year divisible by 4 is a leap year."** Century years break the rule: 1900 and 2100 are not leap years, 2000 is. Questions with a century year in the range test exactly this.

</div>

## 3. Practice

<div class="qbank" data-bank="cuet-general-test" data-topics="clocks-calendars" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- Angle between hands = |30H − 5.5M|; take 360° minus it if over 180°.
- Hands overlap every 65 5/11 minutes, 11 times in 12 hours.
- Ordinary year = 1 odd day, leap year = 2.
- Leap year: divisible by 4; century years only if divisible by 400.
- Count odd days from a date you know.

</div>
