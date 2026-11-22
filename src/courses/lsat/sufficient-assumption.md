---
title: 'Sufficient assumptions'
seoTitle: 'LSAT sufficient assumption questions: bridge the gap'
summary: 'Sufficient Assumption questions ask for a premise that, added to the argument, makes the conclusion follow for certain. How to build the bridge with conditional logic, and how it differs from a necessary assumption.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'Which stem signals a sufficient assumption question?'
    choices: ['"The conclusion follows logically if which one of the following is assumed?"', '"The argument depends on which assumption?"', '"Which most weakens the argument?"']
    ans: 0
    why: '"Follows logically if assumed" or "allows the conclusion to be properly drawn" asks for a sufficient assumption.'
  - q: 'Premise: Ana is a pilot. Conclusion: Ana has good eyesight. Which answer is sufficient?'
    choices: ['All pilots have good eyesight', 'Some pilots have good eyesight', 'People with good eyesight become pilots']
    ans: 0
    why: 'Pilot → good eyesight, plus "Ana is a pilot", guarantees the conclusion. The third answer is the reverse arrow.'
  - q: 'Can a sufficient assumption be stronger than the argument strictly needs?'
    choices: ['Yes, as long as it guarantees the conclusion', 'No, it must be the minimum', 'Only if it is a necessary assumption too']
    ans: 0
    why: 'Sufficient answers are often strong. What matters is that, together with the premises, they force the conclusion.'
sources:
  - 'LSAC, Logical Reasoning questions (description) https://www.lsac.org/lsat/prepare/types-lsat-questions/logical-reasoning-questions'
  - 'fibub LSAT question bank (original arguments) https://fibub.com/learn/courses/lsat/sufficient-assumption/'
---

**Module 3 · about 20 minutes · read first: [2.4](/learn/courses/lsat/conditional-logic/), [3.1](/learn/courses/lsat/necessary-assumption/).** By the end you will build the exact bridge that makes an argument's conclusion follow for certain.

<div class="bigidea">A sufficient assumption is a missing premise that seals the argument: add it, and the conclusion must be true. Usually it is a conditional that links the new idea in the conclusion to the idea in the premises.</div>

## 1. Necessary versus sufficient

| | Necessary assumption | Sufficient assumption |
|---|---|---|
| Stem | "depends on", "requires" | "follows logically if assumed", "properly drawn if" |
| Job | something the argument can't do without | something that makes it airtight |
| Typical size | modest | often strong ("all", "any", "only") |
| Test | negate it: argument collapses | add it: conclusion is now guaranteed |

## 2. Build the bridge

<div class="steps" data-fig="arg-map" data-p1="The museum's new exhibit uses fragile paper artefacts." data-c="The exhibit must be kept in a room with controlled humidity." data-a="Any exhibit that uses fragile paper artefacts must be kept in a room with controlled humidity.">
<div class="step" data-show="">"The museum's new exhibit uses fragile paper artefacts. So it must be kept in a room with controlled humidity."</div>
<div class="step" data-show="p1">Premise idea: fragile paper.</div>
<div class="step" data-show="p1 c">Conclusion idea: controlled humidity. That idea appears nowhere in the premise.</div>
<div class="step" data-show="p1 c a">Bridge the two with a rule pointing from the premise idea to the conclusion idea: <b>fragile paper → controlled humidity</b>. Add it and the conclusion must follow.</div>
</div>

```math
\text{premise: } A \quad + \quad \text{bridge: } A \rightarrow C \quad \Longrightarrow \quad \text{conclusion: } C
```

<div class="meaning">

<dl>
<dt>A</dt><dd>the idea in the premises</dd>
<dt>C</dt><dd>the new idea in the conclusion</dd>
<dt>A → C</dt><dd>the bridge: the sufficient assumption</dd>
<dt>Physical meaning</dt><dd>The arrow must point from what you know to what you want to prove. An answer with the arrow reversed (C → A) is the most common trap.</dd>
</dl>

</div>

## 3. Chains and contrapositives

Longer arguments may have a chain with one link missing: "A → B. B → ... So A → D." Find which link is missing (here C → D or B → D) and look for it, or its contrapositive, among the answers.

<details class="try">
<summary>Try it: a full question</summary>

"Every candidate who speaks Spanish will be interviewed. Lucas speaks Spanish. Therefore, Lucas will be offered the job."

The conclusion follows logically if which one of the following is assumed?

(A) Everyone who is interviewed will be offered the job.
(B) Everyone who is offered the job speaks Spanish.
(C) Most candidates who are interviewed are offered the job.
(D) Lucas is the best-qualified candidate.
(E) Only candidates who speak Spanish are interviewed.

**Answer: (A).** The chain is Spanish → interviewed → ?, and the conclusion is "offered the job". The missing link is interviewed → offered: that is (A). (B) and (E) reverse arrows. (C) "most" cannot guarantee anything about Lucas. (D) is suggestive but does not guarantee an offer.

</details>

<div class="myth">

**"A sufficient assumption must also be necessary."** Not at all. "All pilots have perfect eyesight" is sufficient to show a pilot has good eyesight, but the argument does not need anything that strong. Do not apply the negation test here; apply the "does it guarantee?" test.

</div>

**Try it:** Pick a statement and a fact and see what follows.

<figure class="fig" data-fig="@tp-contrapositive"><figcaption>Only P true and Q false give an answer; the other two are the classic traps.</figcaption></figure>

## Practice set

Original questions in the LSAT's own five-option format, from warm-up to test level. Read the argument, predict the answer, then choose; every question has a full explanation of why the right answer is right and the others are not.

<div class="qbank" data-bank="lsat" data-topics="sufficient-assumption" data-exam="lsat" data-n="6"></div>

<div class="keypoints">

- Stems with "follows logically if assumed" or "properly drawn" ask for a sufficient assumption.
- Find the new idea in the conclusion and link it from the premise idea: premise → conclusion.
- Check the arrow's direction; reversed arrows and "most/some" answers fail.
- Sufficient answers can be strong; the test is whether the conclusion is now guaranteed.

</div>
