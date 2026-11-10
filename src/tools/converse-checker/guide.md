---
name: Converse checker
num: 1281
shelf: learn
code: L162
section: school-maths
title: "Converse checker"
summary: "Pick an if-then statement from geometry or numbers, swap it round into its converse, and test either one on random quadrilaterals, triangles, angles or numbers. Hunt through a thousand cases for a counterexample and see why a converse can be false."
status: live
ads: false
order: 1281
icon: check
works: offline
updated: 2026-11-09
related: [quadrilateral-explorer, pythagoras-proofs, logic-simplifier, relation-checker]
sources:
  - "The statements are standard school geometry and number facts (properties of parallelograms, rhombuses, rectangles and isosceles triangles, Pythagoras' theorem and its converse, divisibility). Written for fibub; the figures are random."
  - "Checked by testing every true direction on 3 000 random figures with no counterexample, and finding a counterexample for every false converse (rectangle, kite, parallelogram, 9)."
flow:
  - { icon: pencil, label: "Statement" }
  - { icon: convert, label: "Converse" }
  - { icon: search, label: "Hunt" }
  - { icon: check, label: "Practise" }
---

## What it does

Many facts in maths have the form **"if P, then Q"**: if a quadrilateral is a square, then its diagonals are equal. Swap the two parts and you get the **converse**, "if Q, then P": if a quadrilateral has equal diagonals, then it is a square. The converse of a true statement can be true or false, and this page lets you find out by experiment.

- Pick one of 12 statements about quadrilaterals, triangles, angles and whole numbers.
- Choose **Test the statement** or **Test the converse**; the "if" and "then" parts are shown separately.
- Make **random figures** one at a time, with their sides, angles and diagonals measured, and see whether each one agrees.
- **Hunt** through 100 or 1 000 random cases for a **counterexample**: a case where the "if" part is true and the "then" part is false. One counterexample proves a statement false.

It follows the Class 9 maths chapter on **propositions and their converses** (statements, proof and counterexamples).

The quadrilateral facts are easier to see by dragging corners in the [[quadrilateral-explorer]]; the converse of Pythagoras' theorem is proved in [[pythagoras-proofs]], and if-then logic itself is in the [[logic-simplifier]].

## How to use it

1. Choose a **Statement**.
2. Press **Test the converse** to swap the parts (or stay on the statement).
3. Press **New random figure** a few times. Under the picture you get the measurements and two answers: is the "if" part true, and is the "then" part true? A figure where the "if" part is false tells you nothing, so try another.
4. Press **Test 100** or **Test 1 000**. The page reports how many cases met the "if" part, and whether any broke the "then" part. If it finds a counterexample, **Draw the counterexample** shows it in a warning colour.
5. Open **Show the answer and the reason** to check yourself.

## A worked example

Take "If a quadrilateral is a square, then its diagonals are equal." Every square the page makes has equal diagonals, so the hunt finds no counterexample. The **converse** is "If a quadrilateral has equal diagonals, then it is a square." Hunt 1 000 figures: about a third have equal diagonals (squares, rectangles, isosceles trapeziums) and the page soon draws a rectangle with diagonals of the same length that is not a square. So the converse is **false**.

Now take "If a quadrilateral is a parallelogram, then its diagonals bisect each other." Both it and its converse survive every hunt, and both can be proved, so it can be stated as one fact: *a quadrilateral is a parallelogram* **if and only if** *its diagonals bisect each other*.

## Tips

- Random testing is evidence, not proof: a true direction needs a proof, but a false one needs only one counterexample.
- Shapes are checked by measuring, the way you would with a ruler and protractor, to a tiny tolerance.
- Some families (rectangles, kites, isosceles trapeziums) are made on purpose so that the interesting cases turn up often.

## Check yourself

Four fresh true-or-false questions each time: three converses and one statement. Type **true** or **false** (or t / f) and press **Check**. Nothing is saved.

## FAQ

**Is "if P then Q" the same as "if not Q then not P"?** Yes. That is the **contrapositive**, and it is always true when the statement is. The converse is different.

**Is this from the NCERT book?** It covers the same topic with fibub's own statements and figures. fibub is not part of NCERT.
