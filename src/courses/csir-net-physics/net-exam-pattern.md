---
title: 'The NET paper: Parts A, B and C, marking and cut-offs'
seoTitle: CSIR NET Physics exam pattern, marking and cut-offs
summary: 'How the CSIR NET Physical Sciences paper is built (Part A aptitude, Part B core physics, Part C advanced physics), how many questions you may answer in each part, how the 25% negative marking works and when a guess pays, how qualification for JRF and lectureship is decided, and a time plan for the three hours.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'In Part C a right answer earns 5 marks. How many marks does a wrong answer cost?'
    choices: ['1.25 marks', '5 marks', 'Nothing', '1.67 marks']
    ans: 0
    why: 'Wrong answers cost a quarter of the question''s marks in every part: 0.5 in Part A, 0.875 in Part B and 1.25 in Part C.'
  - q: 'With a 25% penalty and four options, what is the expected value of a completely blind guess on a question worth m marks?'
    choices: ['m/16, a small positive amount', 'Exactly zero', 'Negative: −m/4', 'm/4']
    ans: 0
    why: 'p·m − (1 − p)·m/4 with p = 1/4 gives m/4 − 3m/16 = m/16. A blind guess is slightly positive on average, but it also uses up one of your limited answer slots.'
  - q: 'In a part where you may answer only 20 of the questions shown, you answer 22. What happens?'
    choices: ['Only the first 20 answers you gave (in question order) are counted', 'All 22 are counted', 'The best 20 are counted', 'The whole part scores zero']
    ans: 0
    why: 'Recent notifications say that answers beyond the limit are ignored, and only the first ones up to the limit are evaluated. Check the current notification, and never answer more than the limit.'
sources:
  - 'CSIR-UGC NET Physical Sciences syllabus and scheme of examination, published by CSIR HRDG and the National Testing Agency (csirnet.nta.ac.in, csirhrdg.res.in); pattern as in recent information bulletins, checked 2026-11-22'
  - 'G. Pólya, How to Solve It, 2nd ed. (Princeton, 1957)'
  - 'S. Mahajan, Street-Fighting Mathematics (MIT Press, 2010; free under CC BY-NC-SA), on estimates and checks'
---

**Module 1 · about 25 minutes.** By the end you will know how the CSIR NET Physical Sciences paper is put together, how many questions you may answer in each part, how negative marking changes your choices, how qualification for JRF and lectureship works, and how to use this course's practice pages and mock tests.

<div class="bigidea">NET is a choice exam. In every part you see more questions than you may answer, so the skill is picking the questions you can get right, answering them cleanly, and never wasting an answer slot on a coin toss you did not need.</div>

**Check the official notification first.** The pattern below follows the information bulletins of recent sessions (the exam is held by the National Testing Agency, usually twice a year, as a computer-based test). Details such as question counts, answer limits and the qualification categories can change between sessions. Always read the current bulletin on the official CSIR NET website before you plan.

## 1. Three parts in one paper

The paper is a single 3-hour computer-based test of 200 marks. All three parts appear together and you may move between them freely.

| Part | What it tests | Questions shown | You may answer | Marks each | Total | Wrong answer |
|---|---|---|---|---|---|---|
| A | General aptitude: reasoning, numbers, graphs | 20 | 15 | 2 | 30 | −0.5 |
| B | Core physics (MSc first-year level) | 25 | 20 | 3.5 | 70 | −0.875 |
| C | Advanced physics, harder multi-step problems | 30 | 20 | 5 | 100 | −1.25 |

- Every question is a single-answer MCQ with four options. NET has no multiple-select or numerical-type questions.
- **Answer limits.** If you answer more than the limit in a part, only the first answers up to the limit (in question order) are evaluated. Choosing which questions to answer is part of the exam.
- **Negative marking.** A wrong answer loses a quarter of the question's marks in all three parts. Blank answers score zero.
- **Part A** is the same kind of aptitude test for all NET science subjects: number series, percentages, data in tables and charts, simple geometry, puzzles and estimation. [Lesson 1.3](/learn/courses/csir-net-physics/part-a-aptitude/) teaches the methods.
- **Part B** covers the core syllabus: mathematical methods, classical mechanics, electromagnetic theory, quantum mechanics, thermodynamics and statistical physics, and electronics and experimental methods. This overlaps strongly with GATE Physics, which is why this course links to the [GATE Physics lessons](/learn/courses/gate-physics/) for the core.
- **Part C** asks deeper questions on the same six areas plus atomic and molecular physics, condensed matter physics, and nuclear and particle physics. Questions often need two or three steps, a limiting case or a careful sign.

<div class="meaning">

<dl>
<dt>Answer slot</dt><dd>one of the 15, 20 or 20 answers you may give in Parts A, B and C</dd>
<dt>Penalty</dt><dd>a quarter of the marks: −0.5, −0.875 or −1.25</dd>
<dt>Expected mark of an answer</dt><dd>m(5p − 1)/4 for a question worth m, if p is your chance of being right</dd>
<dt>Physical meaning</dt><dd>With four options and a quarter penalty, a blind guess (p = 1/4) is worth m/16, a little above zero. But every answer uses a slot that a question you can actually solve might need.</dd>
</dl>

</div>

## 2. Negative marking: when does a guess pay?

For a question worth `$m$` marks that you get right with probability `$p$`, the expected mark is

```math
\langle\text{marks}\rangle = p\,m - (1 - p)\,\frac{m}{4} = \frac{m}{4}\,(5p - 1)
```

It is zero at `$p = 1/5$`, which is below the blind-guess value `$1/4$`. So with four options:

- **Blind guess** (`$p = 1/4$`): `$+m/16$`. For a Part C question, `$+0.31$` marks on average, with a 75% chance of losing 1.25.
- **One option ruled out** (`$p = 1/3$`): `$+m/6$`, which is `$+0.83$` in Part C.
- **Two ruled out** (`$p = 1/2$`): `$+3m/8$`, which is `$+1.875$` in Part C.
- **Fairly sure** (`$p = 0.8$`): `$+3m/4$`.

**The catch is the answer limit.** In Part C you see 30 questions and may answer 20. If you can solve 20 of them properly, a guess on a 21st is not just worthless, it is ignored or (worse, if it comes earlier in the paper) it pushes out a good answer. Guesses only make sense to fill slots you would otherwise leave empty, and only after the questions you can solve are answered.

**Worked example.** In Part C you have solved 13 questions and are fairly sure of them (`$p \approx 0.9$`). Of the rest, you can rule out two options in 4 questions and one option in 5 more. You have 7 free slots. Use 4 on the two-ruled-out questions (`$4\times1.875 = 7.5$` expected) and 3 on the one-ruled-out questions (`$3\times0.83 = 2.5$`). The 13 solved questions are worth `$13\times5\times(5\times0.9 - 1)/4 = 56.9$` on average. Expected Part C score `$\approx 67$` out of 100.

<div class="problem" data-problem="net-guess-value"></div>

## 3. Scores, JRF, lectureship and cut-offs

NET does not pass a fixed percentage. After each session the agencies publish minimum qualifying marks (cut-offs) for each subject and category, separately for:

- **JRF** (Junior Research Fellowship): a fellowship for a PhD, with a limited number of awards, so it needs the higher score. JRF qualifiers are also eligible for lectureship.
- **Lectureship / Assistant Professor (LS)**: eligibility to teach in colleges and universities, with a lower cut-off.
- Recent bulletins have also listed a category for **PhD admission only**. Check whether your session has it and what it gives.

Cut-offs move from session to session with the paper's difficulty and the number of candidates, and they differ by category, so this course gives no numbers. Look up the published cut-offs of the last few sessions on the official website to set a target. A practical aim: plan for a score that would have cleared the JRF line in every recent session, with a margin.

**The score you need comes mostly from Parts B and C.** Part A is worth only 30. A strong candidate takes 20 to 25 there, then builds the rest from Part B (70) and Part C (100).

**Worked example.** A candidate answers Part A: 12 right, 3 wrong; Part B: 14 right, 4 wrong; Part C: 10 right, 4 wrong. Score `$= (24 - 1.5) + (49 - 3.5) + (50 - 5) = 22.5 + 45.5 + 45 = 113$` out of 200. The wrong answers cost 10 marks in total; with better choices about which to answer, that is a large part of the gap between one result line and the next.

<div class="problem" data-problem="net-paper-score"></div>

## 4. A plan for the 180 minutes

At 200 marks in 180 minutes the going rate is about 0.9 minutes per mark: roughly 2 minutes for a Part A question, 3 minutes for Part B and 4 to 5 minutes for Part C.

| Time | What to do |
|---|---|
| 0–5 min | Scroll the whole paper. Mark the questions in your strong units. |
| 5–30 min | **Part A.** Answer the quick ones, up to 15. Skip any puzzle that is still unclear after 2 minutes. |
| 30–90 min | **Part B.** Answer what you can solve within about 3 minutes each, up to 20. Mark the rest. |
| 90–160 min | **Part C.** Choose your 20 from the 30: start with your strongest units. Set aside any question that runs past 6 minutes. |
| 160–175 min | **Fill free slots** with your best partial eliminations (two options ruled out first, then one). Never exceed a limit. |
| 175–180 min | Count the answers in each part (15, 20, 20 at most) and check that every intended answer is saved. |

Habits that win marks in NET:

- **Read all four options before solving.** Many Part C options differ by a factor of 2, a sign or a limiting behaviour, and the options tell you what form the answer takes.
- **Check a limit.** Put `$\omega \to 0$`, `$T \to \infty$` or a large mass into an option: the wrong ones often blow up or have the wrong units.
- **Keep a slot count** on your rough sheet for each part.

## 5. How to use this course

1. **Plan**: [lesson 1.2](/learn/courses/csir-net-physics/study-plan/) gives a 6-month week-by-week plan.
2. **Learn each unit** from its roadmap (lessons [2.1](/learn/courses/csir-net-physics/maths-roadmap/) to [10.1](/learn/courses/csir-net-physics/nuclear-roadmap/)), which lists the GATE and JAM lessons to study and the NET extras in this course.
3. **Practise by topic** on the [practice page](/learn/courses/csir-net-physics/practice/): filter by unit, topic and level. Choose the NET filter to see questions tagged for NET.
4. **Sit mocks** on the [mock test page](/learn/courses/csir-net-physics/mock-test/): a timed paper with NET marking (2, 3.5 and 5 marks, quarter penalty). The fibub mock gives you the 15 Part A, 20 Part B and 20 Part C questions you would answer on the day, 200 marks in all.
5. **Review every mock**: was each lost mark a knowledge gap, a method slip, or a bad choice of question? Track that from one mock to the next.

<div class="myth">

**"Never guess in NET."** Not quite: with a quarter penalty even a blind guess is slightly positive on average, and ruling out one option makes it clearly positive. The real rule is: never let a guess take the slot of a question you can solve, and never go over a limit.

**"Part A does not matter."** It is 30 marks of the easiest marks in the paper. Twenty minutes of method practice can be worth more than a week on a hard Part C topic.

</div>

<div class="keypoints">

- One 3-hour paper, 200 marks, all MCQs: Part A 15 of 20 (2 marks), Part B 20 of 25 (3.5 marks), Part C 20 of 30 (5 marks). Check the current bulletin.
- A wrong answer costs a quarter of its marks in every part. Expected mark of an answer `$= \frac m4(5p - 1)$`.
- Answers beyond a part's limit are not counted: choose your questions.
- JRF and lectureship cut-offs are set after each session, by category; use recent published cut-offs to set a target with a margin.
- Order: Part A quickly, Part B, then pick your best 20 in Part C; fill free slots with eliminations at the end.

</div>

## Practise: a mixed set across Part B and Part C

A mixed run of NET-tagged questions from across the core syllabus. Give yourself about 3 minutes per question.

<div class="qbank" data-bank="physics" data-topics="part-a-aptitude,matrices-eigenvalues,lagrangian-mechanics,potentials-gauges,harmonic-oscillator,partition-functions,op-amps,fine-structure,band-theory,nuclei-radioactivity" data-exam="net" data-n="12"></div>

**Next:** [lesson 1.2](/learn/courses/csir-net-physics/study-plan/) turns this into a week-by-week plan, and [lesson 1.3](/learn/courses/csir-net-physics/part-a-aptitude/) covers Part A.
