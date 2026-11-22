---
title: 'Conditional logic: if, only if, unless'
seoTitle: 'LSAT conditional logic: if, only if, unless'
summary: 'Sufficient and necessary conditions explained with circles, the contrapositive, the two classic errors, chains of conditionals, and how to translate "only if", "unless", "requires" and "no ... without".'
minutes: 24
updated: 2026-11-22
quiz:
  - q: '"You can enter only if you have a ticket." Which must be true?'
    choices: ['If you entered, you have a ticket', 'If you have a ticket, you can enter', 'If you do not enter, you have no ticket']
    ans: 0
    why: '"Only if" introduces the necessary condition: enter → ticket.'
  - q: 'If A, then B. Which is the contrapositive?'
    choices: ['If not B, then not A', 'If B, then A', 'If not A, then not B']
    ans: 0
    why: 'Reverse and negate both parts. The other two are the converse and the inverse, which do not follow.'
  - q: '"The plant will die unless it is watered." What is the rule?'
    choices: ['If not watered, the plant will die', 'If watered, the plant will live', 'If the plant dies, it was not watered']
    ans: 0
    why: '"Unless" means "if not": if it is not watered, it will die. Watering is not promised to save it.'
sources:
  - 'LSAC, Logical Reasoning questions (description) https://www.lsac.org/lsat/prepare/types-lsat-questions/logical-reasoning-questions'
  - 'fibub LSAT question bank, conditional logic drills (original) https://fibub.com/learn/courses/lsat/conditional-logic/'
---

**Module 2 · about 24 minutes · read first: [2.1](/learn/courses/lsat/argument-anatomy/).** By the end you will translate any conditional statement, draw only the valid conclusions, and spot the two errors the LSAT tests most.

<div class="bigidea">"If P, then Q" means P is enough to guarantee Q, and Q is needed for P. Picture P as a small circle inside a bigger circle Q: being in P puts you in Q, and being outside Q puts you outside P. Nothing else follows.</div>

## 1. Sufficient and necessary

"If you live in Toronto, you live in Canada." Living in Toronto is **sufficient** (enough) for living in Canada. Living in Canada is **necessary** (required) for living in Toronto. But living in Canada does not mean you live in Toronto, and not living in Toronto does not mean you are outside Canada.

<figure class="fig" data-fig="venn" data-mode="cond" data-p="you live in Toronto" data-q="you live in Canada"><figcaption>"If P, then Q" as circles. Choose what we learn: the filled dots show where we could be. Only two facts let you conclude anything.</figcaption></figure>

| We learn | Valid? | What follows |
|---|---|---|
| P is true | ✓ | Q is true |
| Q is false | ✓ | P is false (the **contrapositive**) |
| Q is true | ✗ | nothing (the **converse** error: "she lives in Canada, so she lives in Toronto") |
| P is false | ✗ | nothing (the **inverse** error: "he does not live in Toronto, so he is not in Canada") |

```math
P \rightarrow Q \;\equiv\; \neg Q \rightarrow \neg P
```

<div class="meaning">

<dl>
<dt>P (sufficient)</dt><dd>enough to guarantee the other; the "if" part</dd>
<dt>Q (necessary)</dt><dd>required for the other; the "then" part</dd>
<dt>¬</dt><dd>"not"</dd>
<dt>Contrapositive</dt><dd>reverse the arrow and negate both sides; always says exactly the same as the original</dd>
<dt>Physical meaning</dt><dd>A rule only promises something when its "if" happens. When the "if" does not happen, the rule is silent.</dd>
</dl>

</div>

## 2. Translating the tricky words

<div class="steps">
<div class="step"><b>"If" and "when", "whenever", "every", "all":</b> introduce the sufficient condition. "All members get a discount" → member → discount.</div>
<div class="step"><b>"Only if":</b> introduces the <i>necessary</i> condition. "You may drive only if you have a licence" → drive → licence.</div>
<div class="step"><b>"Requires", "depends on", "must", "needs":</b> introduce the necessary condition. "Success requires effort" → success → effort.</div>
<div class="step"><b>"Unless", "until", "without":</b> mean "if not". "The shop closes unless it gets a loan" → no loan → closes. (Equivalently: shop stays open → it got a loan.)</div>
<div class="step"><b>"No A are B", "none":</b> A → not B. "No reptiles are warm-blooded" → reptile → not warm-blooded.</div>
<div class="step"><b>"No A without B":</b> A → B. "No promotion without a review" → promotion → review.</div>
</div>

## 3. Chains

Rules link when the end of one is the start of the next: A → B and B → C give A → C, and its contrapositive, not C → not A. Draw them in a line and only travel forward along the arrows (or backward with "not" on everything).

**Try it:** Place people in seats and watch the counter of orders that still obey every rule.

<figure class="fig" data-fig="@tp-logic-board"><figcaption>When the count reaches one, the rest of the board is forced.</figcaption></figure>

**Try it:** Pick a statement and a fact and see what follows.

<figure class="fig" data-fig="@tp-contrapositive"><figcaption>Only P true and Q false give an answer; the other two are the classic traps.</figcaption></figure>

## 4. Practise until it is automatic

Read each one, decide your answer, then open it. Focus on the form of the rule, not the topic: the logic is the same whatever the sentences are about.

<details class="try">
<summary>Try it: what must be true?</summary>

"The festival will be held outdoors only if the forecast is dry. The forecast is not dry."

What must be true?

**Answer:** the festival will not be held outdoors. Rule: outdoors → dry forecast. The necessary condition failed, so by the contrapositive the sufficient one cannot happen.

</details>

<details class="try">
<summary>Try it: spot the error</summary>

"Anyone who trains every day will finish the marathon. Sam finished the marathon, so Sam must have trained every day."

**Answer:** the converse error. The rule is trains daily → finishes. Sam finishing (the necessary part) tells us nothing about whether Sam trained daily: maybe Sam is just very fit.

</details>

<div class="myth">

**"'Unless' means 'if and only if'."** "I will go to the party unless I am tired" promises only that if you are not tired, you will go. If you are tired, the sentence does not say you will stay home. Translate "unless" as "if not" and nothing more.

</div>

## Practice set

Fresh drills made from templates, so you can keep practising until each step is automatic. Press New set for more; every question has a full explanation.

<div class="qbank" data-bank="lsat" data-topics="conditional-logic" data-exam="lsat" data-n="10"></div>

<div class="keypoints">

- If P, then Q: P is sufficient, Q is necessary. Draw P inside Q.
- Valid: P, so Q. Not Q, so not P (contrapositive). Invalid: Q, so P (converse); not P, so not Q (inverse).
- "Only if", "requires", "must" introduce the necessary condition; "if", "all", "every", "when" introduce the sufficient one.
- "Unless", "without" and "until" mean "if not"; "no A are B" means A → not B.
- Chains link end to start; follow arrows forward, or backward with everything negated.

</div>
