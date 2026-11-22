---
title: 'Maths: relations and functions'
seoTitle: 'Relations and functions for CUET Maths'
summary: 'Reflexive, symmetric, transitive and equivalence relations, one-one and onto functions, composition and invertible functions, and counting relations and functions, with a live counting problem.'
minutes: 18
updated: 2026-11-22
quiz:
  - q: 'R = {(a, b) : a − b is divisible by 3} on the integers is:'
    choices: ['an equivalence relation', 'reflexive only', 'symmetric only']
    ans: 0
    why: 'a − a = 0 is divisible by 3 (reflexive); if 3 divides a − b it divides b − a (symmetric); add a − b and b − c to get a − c (transitive).'
  - q: 'f : R → R, f(x) = x² is:'
    choices: ['neither one-one nor onto', 'one-one and onto', 'onto but not one-one']
    ans: 0
    why: 'f(2) = f(−2), so not one-one; negative numbers are never outputs, so not onto R.'
  - q: 'A function has an inverse exactly when it is:'
    choices: ['one-one and onto (bijective)', 'one-one only', 'onto only']
    ans: 0
    why: 'Every output must come from exactly one input, so the rule can be run backwards.'
sources:
  - 'NCERT, Mathematics Part I (Class 12), Relations and Functions'
  - 'National Testing Agency, CUET (UG) Mathematics syllabus https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 8 · about 18 minutes.** By the end you will test any relation for the three properties and any function for one-one and onto.

<div class="bigidea">A relation pairs things up; a function is a relation where each input gets exactly one output. The vocabulary (reflexive, symmetric, transitive, one-one, onto) just names patterns in those pairings.</div>

**Everyday picture:** roll numbers in a class. Each student has exactly one roll number (a function), and no two students share one (one-one). If every roll number from 1 to 40 is used, it is also onto, so you can go back from a roll number to the student (an inverse).

## 1. Types of relations

| Property | Test | Example on "people in a family" |
|---|---|---|
| Reflexive | (a, a) ∈ R for every a | "is the same age as" |
| Symmetric | (a, b) ∈ R ⇒ (b, a) ∈ R | "is a sibling of" |
| Transitive | (a, b), (b, c) ∈ R ⇒ (a, c) ∈ R | "is older than" |
| Equivalence | all three | "was born in the same year as" |

An equivalence relation splits a set into non-overlapping **equivalence classes**: for "a − b divisible by 3" on integers the classes are numbers leaving remainder 0, 1 or 2.

## 2. Types of functions

<div class="steps" data-title="Checking one-one and onto">
<div class="step"><b>One-one (injective):</b> assume f(a) = f(b) and show a = b. Or find two inputs with the same output to disprove.</div>
<div class="step"><b>Onto (surjective):</b> take any y in the codomain and solve f(x) = y for x inside the domain.</div>
<div class="step"><b>Watch the sets:</b> x² is not one-one on R, but it is on [0, ∞). The same rule can pass or fail depending on the domain and codomain.</div>
<div class="step"><b>Bijective</b> (both) means invertible: f⁻¹(y) = the x with f(x) = y.</div>
</div>

Composition: (g ∘ f)(x) = g(f(x)), apply f first. If f and g are both bijections, so is g ∘ f. For finite sets with the same number of elements, one-one ⇔ onto.

<div class="problem" data-problem="count-relations"></div>

<div class="myth">

**"Symmetric and antisymmetric are opposites, so a relation must be one or the other."** "Is equal to" is both; "is a brother of" on all people is neither. Test each property separately.

</div>

## 3. Practice

<div class="qbank" data-bank="entrance-maths" data-topics="sets-relations-functions" data-level="1,2,3" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- Equivalence = reflexive + symmetric + transitive; it creates classes.
- One-one: f(a) = f(b) ⇒ a = b. Onto: every y is hit.
- Bijective ⇔ invertible.
- Counts (|A| = m, |B| = n): relations 2^(mn), functions nᵐ, bijections A → A m!.

</div>
