---
title: 'Quantifiers: all, most, some, none'
seoTitle: 'LSAT quantifiers: all, most, some and none'
summary: 'What all, most, some and none really mean on the LSAT, which ones can be reversed, and the few combinations that give a valid conclusion, with diagrams you can switch between.'
minutes: 18
updated: 2026-11-22
quiz:
  - q: 'On the LSAT, what does "some" mean?'
    choices: ['At least one, possibly all', 'A few but not all', 'About half']
    ans: 0
    why: '"Some" just means at least one. It does not rule out "all".'
  - q: 'Most A are B and most A are C. What must be true?'
    choices: ['Some B are C', 'Most B are C', 'All A are B or C']
    ans: 0
    why: 'Two majorities of the same group must overlap, so at least one A is both B and C.'
  - q: 'Which statement can be reversed safely?'
    choices: ['Some A are B', 'All A are B', 'Most A are B']
    ans: 0
    why: '"Some" and "no" statements reverse; "all" and "most" do not.'
sources:
  - 'LSAC, Logical Reasoning questions (description) https://www.lsac.org/lsat/prepare/types-lsat-questions/logical-reasoning-questions'
  - 'fibub LSAT question bank, quantifier drills (original) https://fibub.com/learn/courses/lsat/quantifiers/'
---

**Module 2 · about 18 minutes · read first: [2.4](/learn/courses/lsat/conditional-logic/).** By the end you will know exactly what each quantifier allows you to conclude, and which combinations produce a valid conclusion.

<div class="bigidea">"All" is a conditional (A → B). "Some" means at least one, maybe all. "Most" means more than half, maybe all. "None" means they never meet. Almost every quantifier trap is treating one of these as stronger than it is.</div>

## 1. Pictures of the four quantifiers

<figure class="fig" data-fig="venn" data-mode="quant"><figcaption>Switch between the four statements. Notice which ones say anything about the B group as a whole (none of them do, except "No").</figcaption></figure>

| Statement | Means | Reverses? |
|---|---|---|
| All A are B | every A is a B (A → B) | no: All B are A does not follow |
| Most A are B | more than half of the A are B (could be all) | no |
| Some A are B | at least one A is a B (could be all) | **yes**: some B are A |
| No A are B | A → not B | **yes**: no B are A |

<div class="meaning">

<dl>
<dt>Some</dt><dd>at least one; never "only some" unless the passage says "some but not all"</dd>
<dt>Most</dt><dd>more than half; "most" does not mean "not all"</dd>
<dt>Many</dt><dd>treated like "some" on the LSAT: a vague number, at least one</dd>
<dt>Physical meaning</dt><dd>Weaker quantifiers make safer claims. The LSAT rewards answers that claim no more than the evidence allows, so "some" answers are often right and "all" answers often wrong.</dd>
</dl>

</div>

## 2. The valid combinations

<div class="steps">
<div class="step"><b>All + All:</b> All A are B, all B are C → all A are C (a chain).</div>
<div class="step"><b>All + Some:</b> All A are B, some C are A → some C are B.</div>
<div class="step"><b>Most + All:</b> Most A are B, all B are C → most A are C.</div>
<div class="step"><b>Most + Most (same group):</b> Most A are B, most A are C → some B are C.</div>
<div class="step"><b>All + No:</b> All A are B, no B are C → no A are C.</div>
<div class="step"><b>Never valid:</b> Some + Some, Some + Most, Most + Most about different groups. Nothing follows.</div>
</div>

<details class="try">
<summary>Try it: what must be true?</summary>

"Most residents of the village keep chickens. Everyone who keeps chickens buys feed from the co-op."

**Answer:** most residents buy feed from the co-op. (Most + All.) It does not follow that most co-op customers are residents: the co-op may sell to many people from elsewhere.

</details>

<details class="try">
<summary>Try it: does it follow?</summary>

"Some lawyers are runners. Some runners are vegetarians. So some lawyers are vegetarians."

**Answer:** no. The lawyers who run and the runners who are vegetarian could be completely different people. Two "some" statements never combine.

</details>

<div class="myth">

**"'Most students passed' means some failed."** On the LSAT, "most" means more than half, and that includes all. Unless the text says "most but not all", you cannot conclude anyone failed.

</div>

## Practice set

Fresh drills made from templates, so you can keep practising until each step is automatic. Press New set for more; every question has a full explanation.

<div class="qbank" data-bank="lsat" data-topics="quantifiers" data-exam="lsat" data-n="10"></div>

<div class="keypoints">

- All A are B is A → B; it does not reverse.
- Some = at least one (maybe all) and reverses; no = never overlap and reverses; most = more than half (maybe all) and does not reverse.
- Valid combinations: all+all, all+some, most+all, most+most about the same group, all+no.
- Two "some" statements, or "some" with "most", give nothing.

</div>
