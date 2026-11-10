---
title: "Student noise in reverberant lecture halls: an in-field study"
summary: "A 2025 study recorded 13 real lectures in three university halls with long reverberation times. Here is what it found about student noise, and how to check the halls' acoustics yourself."
tools: [room-acoustics, decibel-distance]
updated: 2026-11-10
sources:
  - "Fratoni, G., De Salvio, D., Tardini, V., Garai, M., Valdiserri, P., Biserni, C. and D'Orazio, D. (2025), Student Activity in Suboptimal Thermal and Acoustic Conditions: An In-Field Study in Active Classrooms, Applied Sciences 15(6), 3119, published 13 March 2025. Open access under CC BY 4.0. Details checked on the publisher's page and the article PDF, 2026-11-10."
  - "Sabine's reverberation formula T = 0.161 V / A and Eyring's correction: standard room acoustics."
paper:
  title: "Student Activity in Suboptimal Thermal and Acoustic Conditions: An In-Field Study in Active Classrooms"
  authors: "Fratoni G, De Salvio D, Tardini V, Garai M, Valdiserri P, Biserni C, D'Orazio D"
  journal: "Applied Sciences"
  year: 2025
  doi: "10.3390/app15063119"
  url: "https://www.mdpi.com/2076-3417/15/6/3119"
  licence: "CC BY 4.0"
  reviewed: true
---

Anyone who has taught in a big echoing hall knows the background murmur from the seats can swamp the lecture. A 2025 open-access study in *Applied Sciences* measured that murmur during real lessons in three university lecture halls whose sound lingers far longer than is comfortable for speech, and asked whether heat, humidity or the number of students made it louder. The halls' echo is the kind of thing you can explore with the [[room-acoustics|room acoustics calculator]], and the [[decibel-distance|decibel distance calculator]] shows how quickly a speaker's voice fades towards the back rows.

## What they found

The team recorded 13 lessons, each about an hour and a half, in three halls of 850 to 1,000 cubic metres at the University of Bologna. Empty, the halls had reverberation times of about 1.8 to 2.5 seconds at the middle frequencies of speech. With students in the seats the authors estimate that this falls to around 1 second in two halls and about 1.5 seconds in the third, a long narrow room.

The surprise was in the noise from the students themselves, which the authors call student activity. It did not follow temperature or humidity at all. It did follow the size of the audience, but the wrong way round from a simple crowd model: fuller halls were, on average, quieter (a correlation of about −0.57). A published formula for predicting classroom noise also levelled off at about 40 to 45 dBA, while the measured levels were spread more widely and were often several decibels higher. The authors suggest the Lombard effect, people raising their voices to be heard over others, as one reason the formula falls short.

## Why it matters

Reverberation is the time it takes for a sound to die away after the source stops, usually given as the time to fall by 60 decibels (RT60). In a hall with long reverberation, each syllable is still ringing when the next one starts, so speech gets muddy and listeners strain. Rules for school and university rooms usually aim much lower than the empty-hall values here. The study is useful because it links that design problem to what actually happens during teaching, rather than to tests in empty rooms.

## How they did it

The reverberation was measured in the furnished, empty halls following the international standard for room acoustics measurements (ISO 3382). The occupied values were then estimated with Sabine's formula, adding the sound soaked up by the seated students, worked out from the number of people present and a tabulated value per person. Two sound level meters in the seating area logged the level ten times a second during lessons. To separate the students' noise from the teacher's voice, the team used a statistical method (a Gaussian mixture model) that splits the spread of levels into overlapping groups.

## Check it yourself with fibub

The [[room-acoustics]] tool works for a rectangular, shoebox-shaped room. The hall below is **our own made-up example**, not one of the halls in the paper, and the absorption values are the tool's illustrative ones.

1. Type a length of **15** m, a width of **9** m and a height of **6** m (810 m³). Leave the air at 20 °C and 50 % humidity.
2. Set the floor to *Hard, smooth floor*, and the ceiling, end walls and side walls all to *Plasterboard wall*.
3. In the extra absorption box, type **10, 12, 15, 15, 15, 15** square metres for empty seats and a lectern.
4. The headline reads about **2.66 s (Eyring) and 2.77 s (Sabine)** at 500 Hz to 1 kHz. That is in the same long range as the empty halls in the paper.
5. Now fill the hall with 160 made-up students. At around 0.5 m² of absorption each at mid frequencies, and less at low frequencies, add 40, 60, 75, 80, 80, 80 to the extra absorption, making **50, 72, 90, 95, 95, 95**.
6. The headline drops to about **0.93 s (Eyring) and 1.05 s (Sabine)**. The audience alone has cut the echo by more than half.

You can check the Sabine number by hand. At 1 kHz the band table shows a total absorption of about 123 m² with students present, and 0.161 × 810 ÷ 123 = 1.06 s, close to the tool's 1.03 s (the tool works out the 0.161 from the speed of sound and adds the air's own absorption).

This also shows why the occupied values in the paper are estimates. Change the per-person absorption by 20 % and the occupied reverberation time moves by roughly 10 to 15 %. Try it in step 5.

To see how far a lecturer's voice carries, put a speech level of about 60 dB at 1 m into the [[decibel-distance]] tool and step back to 15 m. Remember that it treats open air: in a reverberant hall the level stops falling once the reflected sound takes over.

## The fine print

- **Three halls, 13 lessons, three days.** The authors point out that this is a small dataset, so the link with audience size is a first look, not a rule.
- **Correlation is not cause.** Fuller halls may differ in other ways, such as the type of lecture or the time of day.
- **Occupied reverberation was calculated, not measured,** using standard values for seated students.
- **No observation of behaviour.** There were no videos or questionnaires, so the noise levels cannot be tied to what students were doing.
- Our tool assumes a simple box with absorption spread around the room. Raked amphitheatre seating and real materials need measurement. Our numbers are made up; for the study's measured values, read the paper itself.
