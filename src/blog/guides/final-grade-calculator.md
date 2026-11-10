---
title: "How much your final exam can move your grade, worked out"
summary: "The algebra behind the score you need on a final exam, how exam weight changes it, and a worked example with a 40% final and a full letter-grade table."
tools: [final-grade-calculator, weighted-grade-calculator, gpa-converter, rubric-grade-calculator]
updated: 2026-11-10
sources:
  - "Weighted-average algebra: needed = (target − current × (1 − weight)) ÷ weight. fibub's own working."
  - "Letter cut-offs of 90, 80, 70 and 60 are a common default, not a rule; schools set their own scales."
---

The final grade calculator answers the question every student asks in exam week: what do I have to score on the final to finish the course with the grade I want? You give it three numbers (your grade so far, the share of the course the final is worth, and your target), and it gives back one score, plus a small table of what each letter grade would take. It suits high school and university students, and teachers who want to show a class where they stand. If your grade so far is a mix of quizzes, labs and tests, build it first with the [[weighted-grade-calculator]]; afterwards, the [[gpa-converter]] turns the finished percent into a grade point.

## What it is

A course grade with a final exam is a weighted average of two parts: everything you have done already, and the final itself. If the final carries weight *w* (as a fraction, so 40% is 0.4), then your earlier work carries 1 − *w*. Your end grade is:

**end = current × (1 − w) + final × w**

Here *current* is your grade before the final, and *final* is your exam score, both in percent. Turn that around to solve for the exam score, and you get:

**needed = (target − current × (1 − w)) ÷ w**

The top line is the gap between where you want to end up and the points you have already banked. Dividing by *w* scales that gap up to a full exam score. This is why heavy finals feel so decisive: when *w* is small, every point you are short has to be made up many times over on the exam, and when *w* is large, the exam can rescue a weak term or sink a strong one.

Two edge cases follow straight from the algebra. If the answer is above 100%, the target cannot be reached on a normal exam. If it is 0% or below, you already have the target banked.

## How to use it

1. Type your **current grade** as a percent, such as 76.
2. Type the **final exam weight**, the percent of the course grade the final makes up. Your syllabus usually lists it.
3. Type your **target grade**, the course grade you hope to finish with. The big number updates as you type.
4. Read the sentence under it. When the target is out of reach, it also tells you the best grade a perfect 100% would give you.
5. Look at the **Score needed for each grade** table, which repeats the sum for A, B, C and D.
6. If your school's letters start at other percents, edit the four cut-off boxes under the table. **Reset to the example** puts the starting numbers back.

## A worked example

Priya has 76% in chemistry before the final. The final is worth 40% of the course, and she wants 80%.

- Her earlier work counts for 1 − 0.4 = 0.6 of the grade, so it is worth 76 × 0.6 = 45.6 points.
- She needs 80 − 45.6 = 34.4 more points from the final.
- The final is worth 0.4, so the score needed is 34.4 ÷ 0.4 = **86.0%**.

The table, with the default cut-offs:

| Grade | Course grade | Final exam score |
|---|---|---|
| A | 90% | 111.0%: not possible |
| B | 80% | 86.0% |
| C | 70% | 61.0% |
| D | 60% | 36.0% |

An A is out of reach: even 100% on the final gives 45.6 + 40 = 85.6%. A C, on the other hand, is safe with 61%. That range tells Priya her revision time is best spent pushing from the low 80s into the high 80s, not chasing a grade the maths rules out.

## Where it is used

- **Planning revision.** Students with several finals can work out the needed score for each course and spend more hours where the gap is biggest.
- **Teaching percentages.** Maths and business teachers use it as a real-life weighted-average problem, since students care about the answer.
- **Advising and tutoring.** Tutors and academic advisers can show a student quickly whether a scholarship or entry cut-off is still possible.
- **Any pass mark with a weighted last step.** The same sum fits a training course with a final assessment, or a certificate where the last module counts for a fixed share.

## Common mistakes

- **Using a rounded or old current grade.** If your portal shows 76 but the real figure is 75.6, the needed score shifts. Use the most exact number you can find, or work it out with the [[weighted-grade-calculator]].
- **Mixing up weight and points.** A final "out of 150 points" is not a 150% weight. The weight is the share of the course grade, which the syllabus gives as a percent.
- **Forgetting other work still to come.** If a lab report is also still unmarked, the final is not the only thing left, and this simple two-part sum will be off. Put all the remaining work into the weighted grade calculator's what-if box instead.
- **Assuming your school's letter scale.** Some schools start an A at 93 or 85. Change the cut-offs before reading the table.
- **Trusting a borderline result.** The tool shows one decimal place. Ask how your teacher rounds before you aim for exactly the needed score.

## Questions people ask

**Can a final exam lower my grade?** Yes. If you score below your current grade, your end grade drops towards the exam score. With Priya's numbers, a 60% final would give 45.6 + 24 = 69.6%.

**What if my teacher drops the lowest test or curves the final?** The calculator cannot know those rules. Work out your current grade after any drop, and treat a curve as a bonus rather than something to plan on.

**Does the weight have to be a whole number?** No. A final worth 37.5% works fine; type 37.5.
