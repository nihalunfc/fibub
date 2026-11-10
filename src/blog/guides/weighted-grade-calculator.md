---
title: "Working out a course grade when marks count differently"
summary: "Why a plain average of your marks gives the wrong course grade, how a weighted average fixes it, and a worked example with points, a missing final and a what-if score."
tools: [weighted-grade-calculator, final-grade-calculator, gpa-converter, rubric-grade-calculator]
updated: 2026-11-10
sources:
  - "Weighted arithmetic mean: sum of (score × weight) ÷ sum of weights. Standard definition; fibub's own working."
  - "Letter cut-offs of 90, 80, 70 and 60 are a common default, not a rule; schools set their own scales."
---

The weighted grade calculator turns a list of marks into your real course grade, counting each one by how much it is worth in the syllabus. Type each item, its score and its weight; it gives your weighted average as a percent and a letter, and it can tell you where you would end up if you scored a given mark on the work you have not done yet. It is for students checking their standing mid-term, and for teachers or parents who want to see how a syllabus adds up. Once you have the grade so far, the [[final-grade-calculator]] works out the exam score you need, the [[gpa-converter]] turns a percent into grade points, and the [[rubric-grade-calculator]] scores a single piece of work against its criteria.

## What it is

A plain average treats every mark the same. That is fine when every quiz counts equally, but most courses do not work like that. A quiz worth 5% of the course should move your grade far less than a midterm worth 25%.

A weighted average fixes this by multiplying each score by its weight before adding up:

**average = (s₁ × w₁ + s₂ × w₂ + …) ÷ (w₁ + w₂ + …)**

Each *s* is a score in percent and each *w* is that item's weight, the share of the course it is worth. Dividing by the sum of the weights does two useful jobs. If the weights add up to 100, it simply gives the course grade. If they add up to less, because some work is not marked yet, it gives the average of the part you have finished, as if that part were the whole course.

Points are turned into percents first: 41 out of 50 is 41 ÷ 50 × 100 = 82%.

## How to use it

1. In each row, type the item's name, its score and its weight. A score can be a percent, like 88, or points, like 41/50.
2. Press **Add a row** for each extra item, and the **×** button at the end of a row to delete it.
3. Read the big result: your weighted average and its letter. A note appears if the weights do not total 100, or if a row could not be read.
4. For work not yet marked, keep the weight but leave the score box empty. It is left out of the average.
5. Type a score into the **What if** box to see the course grade you would end on if you got that score on every empty item.
6. Under **Letter scale**, change the lowest percent for A, B, C and D to match your school. **Reset to the example** brings back the sample rows.

## A worked example

Sam's biology syllabus has four parts:

| Item | Score | Weight |
|---|---|---|
| Quizzes | 15/20 | 15% |
| Labs | 88 | 25% |
| Midterm | 41/50 | 25% |
| Final exam | (not yet) | 35% |

First the points become percents: 15/20 is 75% and 41/50 is 82%.

Then each score is multiplied by its weight: 75 × 15 = 1,125; 88 × 25 = 2,200; 82 × 25 = 2,050. Those add up to 5,375.

The marked weight is 15 + 25 + 25 = 65, so the average so far is 5,375 ÷ 65 = **82.7%**, a B on the default scale. The tool notes that the weights total 100 but only 65% has a mark.

Now Sam types 75 into What if. The final adds 75 × 35 = 2,625, so the end grade is (5,375 + 2,625) ÷ 100 = **80.0%**, still a B. At 85 the result is 83.5%; at 70 it falls to 78.3%, a C.

As a cross-check, putting 82.7% and a 35% final into the final grade calculator with a target of 80% gives the same answer from the other side: 75.0% needed.

## Where it is used

- **Tracking a term.** Updating the rows after each test shows whether a grade is drifting before it is too late to act.
- **Checking a report card.** If an online grade book looks wrong, entering the syllabus weights shows what the number should be.
- **Teaching averages.** It is a clear example of why a mean can be weighted, the same idea used in price indexes and survey results.
- **Training and work assessments.** Courses for certificates or staff training often weight modules differently; the sum is the same.
- **Scholarship and entry targets.** With What if, a student can see the lowest mark on the remaining work that keeps them above a cut-off.

## Common mistakes

- **Averaging the scores without weights.** Sam's three marks average 81.7% plainly, but the weighted figure is 82.7%. Always use the syllabus weights.
- **Typing points as a percent.** "41" for a test out of 50 reads as 41%, not 82%. Type 41/50.
- **Typing a zero for work not done yet.** A 0 counts as a real mark and pulls your grade down hard. Leave the score empty instead.
- **Weighting by points instead of share.** If a test is "worth 50 points" in a 400-point course, its weight is 12.5%, not 50.
- **Forgetting a different letter scale.** Change the cut-offs before reading the letter.

## Questions people ask

**What if my teacher grades by category, like "Tests 40%", with many tests inside?** Average the tests in that category first, then enter one row for the category with its 40% weight.

**Can a weight be zero?** Yes. A practice item with weight 0 shows in your list but does not change the average.

**Can I use a score above 100?** Yes. Bonus marks such as 105 or 21/20 are counted as typed, so extra credit lifts the average the way it would in a grade book.
