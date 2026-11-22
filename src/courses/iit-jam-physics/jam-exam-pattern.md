---
title: 'The JAM paper: sections, marking and timing'
seoTitle: IIT JAM Physics exam pattern, marking and time plan
summary: 'How the IIT JAM Physics paper is built (three sections of MCQ, MSQ and NAT questions), how negative marking really works and when guessing pays, a minute-by-minute plan for the 180 minutes, and how to use fibub''s mock tests and practice pages to get ready.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'In Section A a 2-mark MCQ is answered wrongly. What happens to your score?'
    choices: ['You lose 2/3 of a mark', 'You lose 2 marks', 'Nothing: there is no negative marking', 'You lose 1/3 of a mark']
    ans: 0
    why: 'Wrong MCQs cost one third of their marks: 1/3 for a 1-mark question and 2/3 for a 2-mark question. MSQ and NAT questions have no negative marks.'
  - q: 'You are unsure of a Section B (MSQ) question. Should you leave it blank?'
    choices: ['No: a wrong MSQ answer costs nothing, so a reasoned attempt can only help', 'Yes: a wrong answer loses marks', 'Yes, unless you are sure of every option', 'Only if it is worth 2 marks']
    ans: 0
    why: 'MSQs carry no negative marks (and no partial credit). A blank scores zero for certain; an attempt scores zero or full marks.'
  - q: 'You can rule out one of the four options of a Section A MCQ and guess among the other three. On average, is the guess worth making?'
    choices: ['Yes: the expected mark is positive', 'No: the expected mark is negative', 'It makes no difference on average', 'Only for 1-mark questions']
    ans: 0
    why: 'With p = 1/3, the expected mark is (1/3)m − (2/3)(m/3) = m/9 > 0. Only a completely blind guess (p = 1/4) breaks even at zero.'
sources:
  - 'Information brochure and syllabus of the Joint Admission Test for Masters (JAM), published each year by the organising IIT on the official JAM website'
  - 'S. Mahajan, Street-Fighting Mathematics (MIT Press, 2010; free under CC BY-NC-SA), chapter 1 on checking answers'
  - 'G. Pólya, How to Solve It, 2nd ed. (Princeton, 1957)'
---

**Module 8 · about 25 minutes.** By the end you will know how the JAM Physics paper is put together, how each section is marked, when a guess helps and when it hurts, how to split your 180 minutes, and how to use the fibub mock tests and practice pages so that exam day holds no surprises.

<div class="bigidea">JAM rewards marks per minute. Know the marking rules cold, take every free chance in Sections B and C, guess in Section A only when you can rule something out, and never let one hard question eat your time.</div>

**Check the official site first.** The pattern below follows the papers of recent years (types, counts and marks). The organising IIT changes every year and can change details; always read the current year's information brochure on the official JAM website before you plan.

## 1. The three sections

The paper is a 3-hour computer-based test with 60 questions worth 100 marks, all on screen, with an on-screen virtual calculator (no physical calculator).

| Section | Type | Questions | Marks each | Total | Wrong answer |
|---|---|---|---|---|---|
| A | MCQ: four options, exactly one right | 10 + 20 | 1 or 2 | 50 | lose 1/3 of its marks |
| B | MSQ: four options, one or more right | 10 | 2 | 20 | nothing lost |
| C | NAT: type a number | 10 + 10 | 1 or 2 | 30 | nothing lost |

- **MSQ** (multiple select): you get the marks only if you pick exactly the right set of options. One option missing or one extra, and you score zero. No partial credit, no penalty.
- **NAT** (numerical answer type): you type a number; an answer inside the stated range is marked right. Read the requested units and decimal places, and do not round in the middle of a calculation.
- The syllabus covers mathematical methods, mechanics and general properties of matter, oscillations, waves and optics, electricity and magnetism, kinetic theory and thermodynamics, modern physics, and solid state physics, devices and electronics: modules 1 to 7 of this course.

<div class="meaning">

<dl>
<dt>MCQ</dt><dd>one correct option; +1 or +2 if right, −1/3 or −2/3 if wrong, 0 if blank</dd>
<dt>MSQ</dt><dd>one or more correct options; full marks only for exactly the right set; never negative</dd>
<dt>NAT</dt><dd>typed numerical answer within a tolerance; never negative</dd>
<dt>Expected mark of a guess</dt><dd>p × m − (1 − p) × m/3 for an MCQ worth m, if p is your chance of being right</dd>
<dt>Physical meaning</dt><dd>The penalty is set so that a blind guess among four options is worth exactly zero on average. Any real knowledge tips it positive.</dd>
</dl>

</div>

## 2. Negative marking: when does a guess pay?

Suppose an MCQ is worth `$m$` marks and your chance of being right is `$p$`. On average the answer earns

```math
\langle\text{marks}\rangle = p\,m - (1 - p)\frac{m}{3} = \frac{m}{3}(4p - 1)
```

This is zero at `$p = 1/4$`, a blind guess among four options. So:

- **Blind guess** (`$p = 1/4$`): expected 0. It adds nothing on average, only luck either way. Skip it unless the clock is about to run out and you have nothing better to do (even then it is a coin toss).
- **One option ruled out** (`$p = 1/3$`): expected `$+m/9$`. Worth it.
- **Two ruled out** (`$p = 1/2$`): expected `$+m/3$`. Clearly worth it.
- **"Fairly sure"** (`$p \approx 0.8$`): expected `$+0.73m$`. Always answer.

For MSQ and NAT the expected value of any attempt is `$p\,m \ge 0$`, so a blank there is always a lost chance. For an MSQ, a reasoned attempt (rule options in or out one by one, as in the statements questions of this course) has a far better chance than the 1 in 15 of a blind pick among the non-empty sets.

<figure class="fig" data-fig="jam-expected-score"><figcaption>Expected marks for one question against your chance of being right. The solid line is a Section A MCQ (with the one-third penalty); it crosses zero at p = 1/4. The dashed line is an MSQ or NAT question, which can never go below zero. Choose how many options you can rule out to see the expected gain from a set of such guesses.</figcaption></figure>

**Worked example.** On eight 2-mark MCQs you can rule out exactly one option each and then guess. Expected gain: `$8\times\frac{2}{3}(4\times\frac13 - 1) = 8\times\frac{2}{9} = 1.78$` marks. On ten blind 1-mark guesses: `$10\times0 = 0$`, with a real chance of losing a few marks.

<div class="problem" data-problem="guess-expected"></div>

**Expected value is not the whole story.** Guesses also add spread: ten blind guesses could land anywhere from about −3 to +5 marks. If you are comfortably ahead of your target, skipping pure guesses lowers your risk; if you need a big score, the spread can help you. Either way, the first job is to raise `$p$` by eliminating options, which [lesson 8.2](/learn/courses/iit-jam-physics/problem-solving-tricks/) is all about.

## 3. A plan for the 180 minutes

The paper has 100 marks in 180 minutes, so the going rate is **1.8 minutes per mark**: about 2 minutes for a 1-mark question and 3.5 minutes for a 2-mark one. Nobody should spend 10 minutes on one question in the first pass.

| Time | What to do |
|---|---|
| 0–5 min | Scroll through the whole paper. Note the questions that look quick, and the topics you are strongest in. |
| 5–80 min | **First pass.** Answer everything you can finish within its time budget, in any order (the sections are on screen together). Mark the rest for review. Do not guess yet. |
| 80–150 min | **Second pass.** Go back to the marked questions, easiest first. Longer calculations, NATs that need care, MSQs where you check every statement. |
| 150–170 min | **MSQ and NAT sweep.** Every MSQ and NAT left blank gets your best reasoned answer: they cost nothing if wrong. |
| 170–180 min | **MCQ decisions.** For each unanswered MCQ: can you rule out at least one option? Then guess among the rest. If not, leave it. Check that every answer you meant to save is saved. |

A few habits that save marks:

- **Read the last line first.** Many JAM questions describe a set-up at length and ask for one small thing: units, a ratio, a sign.
- **Use the virtual calculator sparingly.** It is slow to click. Keep numbers in powers of ten in your head and use the calculator only for the final digits.
- **Write the NAT answer in the form asked.** "To two decimal places" and units such as `$10^{-3}$` or MeV are part of the question.
- **One check per answer.** A quick dimension check or limiting case (lesson 8.2) catches most slips in seconds.

## 4. How to use fibub to prepare

1. **Learn each topic** with its lesson, working the live problems (they give new numbers every time) until you can do them without the hint.
2. **Practise by topic** on the [practice pages](/learn/courses/iit-jam-physics/practice/): every topic has hundreds of questions that start easy and climb to top-rank level, with full solutions and the usual trap explained. Filter by level, type (MCQ, MSQ, NAT) and sub-topic.
3. **Sit full mock papers** on the [mock test page](/learn/courses/iit-jam-physics/mock-test/): 60 questions in the real section pattern, a 3-hour timer and JAM marking, including negative marks. Treat it like the real day: one sitting, no notes, the on-screen calculator only.
4. **Review every mock**: for each question lost, decide whether it was knowledge (go back to the lesson), method (redo similar practice questions) or exam craft (time, misreading, a bad guess). Track that split from one mock to the next.
5. **Space it out.** In the last months, one mock a week plus targeted practice beats three mocks in the last week.

<div class="myth">

**"Never guess when there is negative marking."** Wrong in both directions. A guess after ruling out even one option has a positive expected value, and in Sections B and C there is no negative marking at all, so a blank is always a lost chance.

**"Answer the paper in order."** You may move freely between questions. Taking all the quick marks first, then coming back, protects you from running out of time on the questions you could have done.

</div>

<div class="keypoints">

- 3 hours, 60 questions, 100 marks: Section A 30 MCQs (50 marks), Section B 10 MSQs (20 marks), Section C 20 NATs (30 marks). Check the current year's brochure.
- MCQ: wrong costs 1/3 of its marks. MSQ and NAT: no negative marks, no partial credit.
- Expected mark of an MCQ guess `$= \frac{m}{3}(4p - 1)$`: zero for a blind guess, positive once one option is ruled out.
- 1.8 minutes per mark. Two passes, then an MSQ/NAT sweep, then MCQ guessing decisions.
- Prepare with lessons and live problems, practice pages by topic, then timed mock papers with honest review.

</div>

## Practise: a mixed set from across the syllabus

A mixed run of exam-level questions from several modules, the way the real paper jumbles them. Time yourself: aim for about 2 minutes on 1-mark and 3.5 minutes on 2-mark questions.

<div class="qbank" data-bank="physics" data-topics="central-forces,interference,first-law,photons,electrostatics-gauss,semiconductors,matrices,simple-harmonic-motion" data-exam="jam" data-n="12"></div>

**Next:** [lesson 8.2](/learn/courses/iit-jam-physics/problem-solving-tricks/) shows how to raise your chance of being right on every question: dimensions, limiting cases, symmetry and elimination. Then take a full [mock test](/learn/courses/iit-jam-physics/mock-test/).
