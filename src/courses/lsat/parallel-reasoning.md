---
title: 'Parallel reasoning and parallel flaw'
seoTitle: 'LSAT parallel reasoning: match the form, not the topic'
summary: 'Parallel questions ask for the answer whose reasoning has the same shape as the passage. Reduce each argument to its skeleton (conclusion type, conditional form, certainty level), then match skeletons.'
minutes: 22
updated: 2026-11-22
quiz:
  - q: 'What must match in a parallel reasoning answer?'
    choices: ['The logical form of the reasoning', 'The topic', 'The order of the sentences']
    ans: 0
    why: 'Topic and sentence order can change freely; the structure (and its validity or flaw) must be the same.'
  - q: 'The passage concludes "probably". An answer concludes "certainly". What should you do?'
    choices: ['Usually eliminate it: the strength of the conclusion should match', 'Keep it: strength does not matter', 'Pick it: stronger is better']
    ans: 0
    why: 'Matching the conclusion''s type and strength is a fast first filter.'
  - q: 'In a parallel flaw question, the right answer...'
    choices: ['Commits the same error as the passage', 'Fixes the passage''s error', 'Has a different error']
    ans: 0
    why: 'Parallel flaw asks for the same mistake in a different setting.'
sources:
  - 'LSAC, Logical Reasoning questions (description) https://www.lsac.org/lsat/prepare/types-lsat-questions/logical-reasoning-questions'
  - 'fibub LSAT question bank (original arguments) https://fibub.com/learn/courses/lsat/parallel-reasoning/'
---

**Module 4 · about 22 minutes · read first: [2.4](/learn/courses/lsat/conditional-logic/), [2.6](/learn/courses/lsat/common-flaws/).** By the end you will strip arguments down to their skeletons and match them quickly.

<div class="bigidea">Parallel questions ignore the topic. Replace the subjects with letters (A, B, C), keep the logical words (all, some, if, only if, probably), and find the answer with the same skeleton.</div>

## 1. The question stems

- *"Which one of the following arguments is most similar in its reasoning to the argument above?"* (parallel reasoning: the passage may be valid)
- *"The flawed pattern of reasoning in the argument above is most similar to that in which one of the following?"* (parallel flaw: same mistake)

## 2. Build the skeleton

<div class="steps">
<div class="step"><b>Passage:</b> "Every violinist in the orchestra practises daily. Ama practises daily. So Ama is a violinist in the orchestra."</div>
<div class="step">Replace topics with letters: violinist = V, practises daily = P. Premise 1: V → P.</div>
<div class="step">Premise 2: Ama is P. Conclusion: Ama is V.</div>
<div class="step">Skeleton: <b>V → P; x is P; so x is V.</b> That is the converse error (Lesson 2.4).</div>
<div class="step">Now find an answer with the same skeleton, e.g. "All of the bakery's cakes contain sugar. This dessert contains sugar. So it is one of the bakery's cakes." Same error, new topic.</div>
</div>

<div class="meaning">

<dl>
<dt>Skeleton</dt><dd>the argument with topics replaced by letters but logic words kept</dd>
<dt>Conclusion type</dt><dd>certain, probable, recommendation ("should"), comparison, or "some"/"most"</dd>
<dt>Physical meaning</dt><dd>Two arguments are parallel when they would stand or fall for the same reason. Swap in any topic and the strength of the reasoning stays the same.</dd>
</dl>

</div>

## 3. Fast filters

1. **Conclusion type.** If the passage concludes with "should", eliminate answers concluding with a fact; if it says "probably", drop "definitely".
2. **Quantifiers.** "Most" must be matched with "most", not "all".
3. **Valid or flawed.** In parallel reasoning, a valid passage needs a valid answer; in parallel flaw, the answer must make the same error.
4. Only then compare full skeletons. Order of sentences does not matter.

<details class="try">
<summary>Try it: a full question</summary>

"If the reservoir is low, the town restricts watering. The town has not restricted watering, so the reservoir is not low."

Which one of the following is most similar in its reasoning?

(A) If a student studies, she passes. She passed, so she studied.
(B) If the alarm sounds, the staff leave the building. The staff have not left, so the alarm has not sounded.
(C) If it snows, school closes. It did not snow, so school is open.
(D) Whenever the bakery has fresh bread, it opens early. It opened early today, so it has fresh bread.
(E) If the price falls, sales rise. The price fell, so sales probably rose.

**Answer: (B).** Passage skeleton: L → R; not R; so not L (a valid contrapositive). (B): A → L; not L; so not A. (A) and (D) are converse errors, (C) is the inverse error, and (E) changes the conclusion to "probably" and uses the plain forward direction.

</details>

<div class="myth">

**"The answer about the same topic is the parallel one."** The LSAT often puts a same-topic answer in as a trap. Topic is irrelevant; only the form matters.

</div>

**Try it:** Tap each sentence to label it as background, premise or conclusion, then press Check.

<figure class="fig" data-fig="@tp-argument-build" data-set="2"><figcaption>The dashed gap between reasons and conclusion is the assumption.</figcaption></figure>

## Practice set

Original questions in the LSAT's own five-option format, from warm-up to test level. Read the argument, predict the answer, then choose; every question has a full explanation of why the right answer is right and the others are not.

<div class="qbank" data-bank="lsat" data-topics="parallel-reasoning" data-exam="lsat" data-n="6"></div>

<div class="keypoints">

- Replace topics with letters and keep the logic words; compare skeletons.
- Filter first by conclusion type and strength, then by quantifiers and validity.
- Parallel flaw: the answer must commit the same error.
- Sentence order and topic do not matter.

</div>
