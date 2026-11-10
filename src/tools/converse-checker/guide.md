---
name: Statement and converse checker
num: 1281
shelf: learn
section: school-maths
title: "Statement and converse checker: test \"if P then Q\" on random figures and hunt for a counterexample"
summary: "Pick a statement from school geometry or numbers (squares, parallelograms, rhombuses, isosceles triangles, Pythagoras, primes, multiples), read its converse, and test both on 50 random figures or numbers. One counterexample is drawn in red and is enough to sink a converse; a short reason shows why the true ones are always true."
status: live
ads: false
order: 1281
icon: check
works: offline
updated: 2026-11-09
related: [quadrilateral-explorer, pythagoras-proofs, logic-simplifier, geometry-construction]
sources:
  - "Statements, converses and their proofs are standard school geometry and number facts, written in fibub's own words. The random figures are made by fibub's code."
  - "Checked by making 500 seeded random examples for each \"if\" part and confirming the generator really makes it, by 200 tests of each direction against the known answer, and on hand-made figures (a square, a 5 by 3 rectangle, a kite, an isosceles trapezium, a 3-4-5 triangle)."
flow:
  - { icon: pointer, label: "Statement" }
  - { icon: convert, label: "Converse" }
  - { icon: target, label: "Test 50" }
  - { icon: check, label: "Why" }
---

## What it does

Many facts in mathematics have the form **"If P, then Q."** For example: *if a quadrilateral is a square, then its diagonals are equal.* Swap the two parts and you get the **converse**: *if a quadrilateral has equal diagonals, then it is a square.* A statement can be true while its converse is false, and that is one of the most common traps in proofs.

This page lets you check both directions like a scientist before you check them like a mathematician. Pick one of eight statements about squares, parallelograms, rhombuses, isosceles triangles, Pythagoras' theorem, multiples of 4, primes and numbers ending in 0. Press **Test the statement** or **Test the converse** and the page makes 50 random examples where the "if" part is true, then checks the "then" part for each. Each example is drawn with its side lengths and angles. A **counterexample** (an example where the "if" part holds but the "then" part fails) turns red, and one is enough to show the claim is false. For the claims that pass, a short reason explains why they hold every time.

It fits the Class 9 maths chapter on propositions and their converses, and it is useful for every proof chapter after it. To play with the shapes themselves, go to [[quadrilateral-explorer]]; the most famous converse in school maths is in [[pythagoras-proofs]], and the logic of "if … then" is in [[logic-simplifier]].

## How to use it

1. Choose a **statement**. The page writes it out and writes its converse underneath.
2. Decide which you think is always true.
3. Press **Test the statement**. Use **Previous** and **Next example** to step through the 50 examples.
4. Press **Test the converse**. If a counterexample turns up, **Show the counterexample** jumps to it.
5. Read **Why**: a short proof for the true ones, or the kind of shape or number that breaks the false ones.

## A worked example

Pick **Square and its diagonals**.

- *Statement:* if a quadrilateral is a square, then its diagonals are equal. All 50 random squares (of different sizes, turned different ways) have equal diagonals.
- *Converse:* if a quadrilateral has equal diagonals, then it is a square. The page draws quadrilaterals whose diagonals have the same length but cross at different angles and at different points. Almost every one fails: their sides are different, so they are not squares. The statement is true; its converse is false.

Now pick **Isosceles triangle**. Both directions pass all 50 tests, and the reasons (draw the bisector of the top angle) prove both. You can say: two sides of a triangle are equal *if and only if* the angles opposite them are equal.

## Tips

- To show a statement is false, one counterexample is enough.
- To show it is true, examples are never enough; you need a reason that works for all cases.
- Watch out for hidden extra conditions. "If a number is prime, then it is odd" is false because of 2, which is why the page says "a prime bigger than 2".

## Check yourself

Four fresh "if … then" statements each time. Decide whether the converse is always true (type 1) or not (type 0); the worked answer gives the reason or a counterexample. Nothing is saved.

## FAQ

**What about the inverse and the contrapositive?** The contrapositive (if not Q, then not P) is always true when the statement is. The inverse (if not P, then not Q) behaves like the converse. They come up in Class 11 mathematical reasoning.

**Is this from the NCERT book?** It covers the same topic with fibub's own examples. fibub is not part of NCERT.
