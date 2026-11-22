---
title: Propositions and their Converses
seoTitle: 'Propositions and Converses Class 9 notes and proofs'
summary: 'Class 9 Propositions and their Converses with games: statements, if-then, converse, counterexamples, direct proof and proof by contradiction.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: 'The converse of “If a number is a multiple of 6, then it is a multiple of 3” is:'
    choices: ['If a number is a multiple of 3, then it is a multiple of 6', 'If a number is not a multiple of 6, then it is not a multiple of 3', 'A multiple of 6 is a multiple of 3', 'If a number is a multiple of 3, then it is not a multiple of 6']
    ans: 0
    why: 'The converse swaps the two parts: “if Q then P”. This converse is false: 9 is a multiple of 3 but not of 6.'
  - q: 'Which number is a counterexample to “every prime number is odd”?'
    choices: ['2', '3', '9', '15']
    ans: 0
    why: '2 is prime and it is even. One example where a claim fails is enough to show that the claim is false.'
  - q: 'Two straight lines cross, and one of the angles is 65°. The angle vertically opposite to it is:'
    choices: ['65°', '115°', '25°', '130°']
    ans: 0
    why: 'Vertically opposite angles are equal. (The angles next to it are 180° − 65° = 115°.)'
sources:
  - 'NCERT Class 9 Mathematics (Ganita Manjari), Chapter 9 “Propositions and their Converses” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Euclid, Elements, Book I, Propositions 5, 15 and 32 (isosceles base angles, vertically opposite angles, angle sum of a triangle), for the classical proofs'
---

**Maths · Class 9 · Chapter 9 · about 50 minutes.** By the end you will be able to tell a statement from other sentences, split an if-then statement into its two parts, write its converse and test it, disprove a claim with a counterexample, and write short proofs about angles and numbers.

<div class="bigidea">Mathematics does not say “it looks true”. It says “it must be true, and here is why”. A statement is true or false; if-then statements link two ideas; a proof is a chain of safe steps from what we know to what we want; and one counterexample is enough to break any claim about “every” case.</div>

## 1. Statements: true, false, or neither

A **statement** (also called a **proposition**) is a sentence that is **definitely true or definitely false**, never both and never neither.

- “Mumbai is in Maharashtra.” is a true statement.
- “Every month has 31 days.” is a false statement. It is still a statement, because we can say clearly that it is false.
- “Which train is this?” is a question, “Sit down!” is a command, and “Masala dosa is the best breakfast” is an opinion. None of these is true or false, so none is a statement.
- “x + 5 = 9” is not a statement by itself: it is true for x = 4 and false for other x. It becomes a statement when we say what x is, or add “for every x” or “for some x”.

Try the sorting game. Decide for each card, then read the reason.

<figure class="fig" data-fig="c9-logic-sort"><figcaption>Sort each sentence into true statement, false statement, or not a statement. A false statement is still a statement: it is just a wrong claim that we can show to be wrong.</figcaption></figure>

<div class="myth">

**“A statement has to be true.”** No. “2 + 2 = 5” is a perfectly good statement: it is false. Mathematicians spend a lot of time on false statements, because showing that something is false is as useful as showing it is true.

</div>

**Words like “all”, “every” and “some”.** “Every student in the class has a bicycle” says something about all students. One student without a bicycle makes it false. “Some student has a bicycle” is true as soon as one student has one. This difference decides how we prove or disprove claims.

## 2. If-then statements

Many mathematical facts have the form **“If P, then Q.”**

- P is the **hypothesis** (what we are given): “a number is a multiple of 6”.
- Q is the **conclusion** (what follows): “it is a multiple of 3”.

Think of it as a promise. A shopkeeper says, “If you buy two kilos of mangoes, you get one free.” The promise is broken in only one situation: you buy two kilos and do not get one free. If you buy nothing, the promise has not been broken, so we do not call it false. This is exactly how mathematics treats “if P then Q”.

<figure class="fig" data-fig="c9-logic-promise"><figcaption>Press the buttons for P and Q. The statement “If P then Q” is false only in the row where P is true and Q is false. When P is false the promise cannot be broken, so the statement stays true.</figcaption></figure>

Everyday sentences often hide the “if-then” form. “A square is a rectangle” means “If a shape is a square, then it is a rectangle.” “All multiples of 10 end in 0” means “If a number is a multiple of 10, then its last digit is 0.” Rewriting a sentence in the “if-then” form shows the hypothesis and the conclusion clearly.

<div class="meaning">
<dl>
<dt>P</dt><dd>the hypothesis, the “if” part: what we assume</dd>
<dt>Q</dt><dd>the conclusion, the “then” part: what we claim follows</dd>
<dt>If P then Q</dt><dd>whenever P is true, Q is true as well</dd>
<dt>Physical meaning</dt><dd>On a Venn diagram, “if P then Q” means the set of things where P holds sits entirely inside the set where Q holds. Every P is a Q.</dd>
</dl>
</div>

## 3. The converse

The **converse** of “If P then Q” is **“If Q then P”**: we swap the two parts.

Statement: “If a shape is a square, then it is a rectangle.” True.
Converse: “If a shape is a rectangle, then it is a square.” False: a 4 cm by 2 cm rectangle is not a square.

So **a true statement can have a false converse**. Never assume the converse is true. Toggle between the statement and its converse in the Venn picture: in the original, the small circle P sits inside the big circle Q. For the converse we ask whether everything in Q is also in P.

<figure class="fig" data-fig="c9-logic-ifthen"><figcaption>Choose a statement and switch between the original and its converse. If the converse is false, the red dot shows something that is in Q but not in P: that is the counterexample.</figcaption></figure>

Sometimes both directions are true. “If x + 3 = 7 then x = 4” and “If x = 4 then x + 3 = 7” both hold. Then P and Q say exactly the same thing, and we write **“P if and only if Q”**. A triangle has all angles 60° if and only if it is equilateral.

<div class="myth">

**“If it is true one way, it is true the other way too.”** “If it rains, the road gets wet” is true. “If the road is wet, it rained” is not: a tanker may have washed it. Always test the converse separately.

</div>

Test any statement and its converse in the Converse checker.

<!--fig:tool converse-checker-->

## 4. Counterexamples

To show that a claim about **all** cases is false, you need only **one case where it fails**. That one case is a **counterexample**.

Claim: “Every prime number is odd.” Counterexample: 2, which is prime and even.

Claim: “n² + n + 41 is a prime number for every whole number n.” It works for n = 1, 2, 3, … all the way to 39: the numbers 43, 47, 53, 61 … are all prime. It looks like a law! But n = 40 gives 1600 + 40 + 41 = 1681 = 41 × 41, which is not prime. One counterexample ends the claim.

The lesson goes the other way too: **many examples do not prove a claim**. Checking 39 numbers did not make it true for 40. To prove a claim for all numbers you need an argument that covers every case at once.

<figure class="fig" data-fig="c9-logic-counter"><figcaption>Choose a claim and move the slider to test numbers one at a time. Green means the claim holds for that n, red means it fails. Press Reveal all to see every counterexample at once. Try the n² + n + 41 claim: it stays green for a long time.</figcaption></figure>

<div class="problem" data-problem="c9m-logic-counter"></div>

<div class="keypoints">

- A statement is a sentence that is definitely true or definitely false.
- “If P then Q” is false only when P is true and Q is false.
- The converse “If Q then P” may be false even when the original is true.
- One counterexample disproves a claim about all cases; many examples never prove it.

</div>

## 5. What is a proof?

A **proof** is a short, careful argument that shows a statement is true in **every** case. It starts from things we already accept (definitions, facts proved earlier) and moves by small, safe steps. Each step must follow from the one before. In a **direct proof** we start from the hypothesis P and reach the conclusion Q.

Here are the geometry facts we will use. All are used as starting points:

- Angles on a straight line add up to 180°.
- When a line crosses two parallel lines, the alternate (zig-zag) angles are equal.
- In a triangle, angles opposite equal sides are equal (we prove this below).

### Vertically opposite angles are equal

When two straight lines cross, the angles facing each other (vertically opposite angles) are equal. Why must this be so for every pair of lines? Watch the proof.

<div class="steps" data-fig="c9-logic-vert">
<div class="step">Two straight lines cross. Four angles form: A, B, C and D. A and C are opposite each other; so are B and D.</div>
<div class="step">A and B lie together on one straight line, so A + B = 180°.</div>
<div class="step">B and C lie together on the other straight line, so B + C = 180°.</div>
<div class="step">Both sums are 180°, so A + B = B + C.</div>
<div class="step">Take B away from both sides: A = C. Vertically opposite angles are equal.</div>
<div class="step">The same argument with A + D and D + C gives B = D. The slider shows it for any crossing angle, but the proof covers every angle at once.</div>
</div>

Notice how this differs from measuring. A protractor shows it for the lines you drew. The proof shows it for all lines that ever cross, including ones nobody will draw.

<div class="problem" data-problem="c9m-logic-vert"></div>

### The angles of a triangle add up to 180°

<div class="steps" data-fig="c9-logic-tri">
<div class="step">Triangle ABC has three angles A, B and C. We want to show that A + B + C = 180°.</div>
<div class="step">Through A, draw a line parallel to the base BC.</div>
<div class="step">The side AB cuts the two parallel lines. The angle on the left at A and the angle B are alternate angles, so they are equal.</div>
<div class="step">In the same way, the angle on the right at A equals angle C.</div>
<div class="step">The three angles at A (left, A, right) lie on a straight line, so they add up to 180°. Since they are B, A and C, we get A + B + C = 180°.</div>
</div>

This one proof works for every triangle: drag A sideways and the numbers change, but the sum stays 180°.

<div class="problem" data-problem="c9m-logic-tri"></div>

### Equal sides, equal angles

**Statement:** if two sides of a triangle are equal, the angles opposite them are equal. **Converse:** if two angles of a triangle are equal, the sides opposite them are equal. Unlike many converses, this one is also true.

The proof of the statement: let AB = AC and draw the line from A to the middle of BC. The two small triangles have equal sides on all three sides (AB = AC, a shared line, and equal halves of BC), so they match exactly, and the angles at B and C match. Use the sliders to set B and C yourself.

<figure class="fig" data-fig="c9-logic-isos"><figcaption>Set angle B and angle C. When they are equal, the sides AB and AC are equal and a mirror line through A fits the triangle on itself. When they differ, the side opposite the bigger angle is longer. This is the converse in action.</figcaption></figure>

<div class="problem" data-problem="c9m-logic-isos"></div>

<div class="problem" data-problem="c9m-logic-isosx"></div>

<div class="myth">

**“I measured it carefully, so it is proved.”** Measuring tests only the cases you drew, and always with some error. A proof uses reasoning that covers all cases exactly. Use drawings to find the idea; use a proof to be certain.

</div>

## 6. Proof by contradiction

Sometimes a direct route is hard. Then we try the opposite: **assume the statement is false and show this leads to something impossible.** If the assumption leads to nonsense, it must be wrong, so the statement is true. This is a **proof by contradiction**.

**Claim:** If n² is even, then n is even.

<div class="steps" data-fig="c9-logic-contra">
<div class="step">We want to prove: if n² is even, then n is even.</div>
<div class="step">Suppose the opposite: n² is even, but n is odd.</div>
<div class="step">An odd number can be written n = 2k + 1. For example 7 = 2(3) + 1. In an n by n grid of dots, pair the dots up.</div>
<div class="step">n² = (2k + 1)² = 4k² + 4k + 1 = 2(2k² + 2k) + 1. That is an even number plus 1, so n² is odd: one dot is left over with no partner.</div>
<div class="step">But we started with n² even. n² cannot be both odd and even. This is a contradiction.</div>
<div class="step">The only thing we assumed was “n is odd”. So that was wrong, and n must be even. The claim is proved.</div>
</div>

Slide n in the figure to see odd squares always leave one dot unpaired.

A detective works the same way: “Suppose the thief came through the window. Then there would be footprints on the sill. There are none. So the thief did not come through the window.” The famous proof that √2 is not a rational number, which you may have met in Chapter 3, uses this very method.

<div class="history">

<ul class="timeline">
<li><b>about 300 BCE</b> Euclid, in Alexandria, writes the Elements: geometry built entirely from definitions and proofs, including vertically opposite angles and the angle sum of a triangle.</li>
<li><b>about 500 CE</b> Aryabhata and later Indian mathematicians give rules and proofs in verse, often with a diagram and the word “behold”.</li>
<li><b>1200s to 1300s</b> Madhava’s school in Kerala gives infinite series with careful arguments for their correctness.</li>
<li><b>1930s</b> Kurt Gödel shows that in any rich mathematical system there are true statements that cannot be proved.</li>
</ul>

</div>

## 7. Putting it together: how to write a proof

1. **Write the statement** in the form “If P, then Q”. Name what is given (P) and what to show (Q).
2. **Draw a figure** if it is geometry, and mark what you know.
3. **Write steps**, each with its reason: “angles on a straight line”, “alternate angles”, “given”.
4. **End with Q**, in words, and say what you have shown.
5. **Test the converse separately** and look for a counterexample if it is not true.

Want to check the logic of a compound statement (using “and”, “or”, “not”)? The logic simplifier builds truth tables for you.

<!--fig:tool logic-simplifier-->

<div class="keypoints">

- A statement is true or false, never both and never neither; questions, commands and opinions are not statements.
- “If P then Q” has a hypothesis P and a conclusion Q. It is false only when P is true and Q is false.
- The converse “If Q then P” must be checked separately: it can be false even when the original is true. If both are true, we say “P if and only if Q”.
- A counterexample (one case where the claim fails) disproves a claim about all cases. Many examples do not prove it.
- A direct proof goes step by step from the hypothesis to the conclusion, giving a reason for each step.
- Proof by contradiction: assume the opposite, reach an impossibility, and conclude the statement is true.
- Vertically opposite angles are equal; angles of a triangle add to 180°; angles opposite equal sides are equal; all are proved from a few earlier facts.

</div>
