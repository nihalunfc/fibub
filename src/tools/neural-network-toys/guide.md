---
name: Neural network toys
num: 729
shelf: science
code: T497
section: cognitive-science
title: "Perceptron and Hopfield network simulator: watch a neuron learn AND, OR and fail on XOR (free)"
summary: "Two classic neural network models to play with in the browser. Click points and watch a perceptron move its decision line epoch by epoch, converging on AND and OR and failing on XOR. Draw small black-and-white patterns, store them in a Hopfield network and recall them from a noisy cue while the energy falls."
status: live
ads: true
order: 729
icon: pointer
works: offline
updated: 2026-11-09
related: [plot-maker, sample-size, factor-analysis, memory-attention-tasks, small-model-trainer, confusion-matrix, embedding-visualiser, hodgkin-huxley-simulator]
sources:
  - "Perceptron learning rule: Rosenblatt (1958); limits on XOR: Minsky and Papert (1969). Hopfield network with Hebbian weights and energy: Hopfield (1982); storage limit about 0.138 N: Amit, Gutfreund and Sompolinsky (1985). Methods only; no data or tables are copied."
  - "Written by fibub and checked in the tests against an independent NumPy implementation with the same update order and the same seeded random numbers."
  - "The example points and patterns are made up."
flow:
  - { icon: pointer, label: "Points" }
  - { icon: curve, label: "Learn line" }
  - { icon: table, label: "Patterns" }
  - { icon: check, label: "Recall" }
---

## What it does

This page holds two of the oldest ideas in neural networks, small enough to watch step by step. They are often taught in cognitive science and psychology courses because they show, in a few lines of maths, how learning can live in connection weights.

- **Perceptron.** One artificial neuron adds up its two inputs, each times a weight, plus a bias, and outputs 1 when the sum is above zero and 0 otherwise. That rule draws a straight line through the plane. Training nudges the line after every mistake.
- **Hopfield network.** A set of on/off units, every one connected to every other. Storing a pattern strengthens the connections between units that agree (Hebb's rule, "cells that fire together wire together"). Given a damaged copy, each unit follows the vote of the others until the network settles into a stored memory.

Train a real small model on your own data with the [[small-model-trainer]], and see how a single brain cell fires in the [[hodgkin-huxley-simulator]].

## Perceptron: how to use it

1. Pick a starting set: **AND**, **OR** or **XOR** on the four corners (0, 0), (0, 1), (1, 0) and (1, 1), two made-up clouds, or an empty plane.
2. Click the picture to add points. Choose class 1 (filled circles) or class 0 (open squares) first. "Remove last" and "Clear" undo.
3. Set the **learning rate** (how far the weights move after a mistake), the **most epochs** (passes through all points) and the **starting weights** (zero, or small fixed random numbers).
4. Slide **Show epoch**, or step forward and back, to watch the line move. Shaded is the side called class 1; points on the wrong side are circled.

The rule: for each point in turn, error = target − output. Each weight changes by learning rate × error × input, and the bias by learning rate × error. Training stops after a pass with no mistakes.

## Hopfield network: how to use it

1. Choose a grid size. The 7 × 7 grid starts with three made-up shapes stored. Tap squares to draw your own and press **Store this pattern**, or use **Random pattern**.
2. Choose a stored pattern, how many units to flip, and a noise seed. The **cue** shows flipped units outlined in red; tap it to change units by hand.
3. Choose the update: **one unit at a time** in random order (always settles, because each change lowers the energy E = −½ Σ wᵢⱼ sᵢ sⱼ), or **all at once** (can swing between two states).
4. Slide **Show sweep** to watch the state clean up. The table gives the overlap with every stored pattern.

## Worked examples

**AND** with zero starting weights and learning rate 0.1 converges after **6 epochs**, ending with weights 0.2 and 0.1 and bias −0.2: the line x₂ = −2 x₁ + 2 leaves only (1, 1) on the class 1 side. **OR** at rate 0.1 also converges. **XOR** never does: after 50 epochs 2 of the 4 points are still wrong, because no straight line puts (0, 1) and (1, 0) on one side and (0, 0) and (1, 1) on the other.

**Hopfield:** with the three 7 × 7 shapes stored, pattern 1 with 10 flipped units (seed 1) is recalled exactly. Raise the flips towards 20 or more and some cues land on a mixed (spurious) state or on the negative of a pattern, which the network stores too.

## Frequently asked questions

**Why does the learning rate not matter for AND?** With zero starting weights, the rate only scales every weight by the same amount, so the line and the number of epochs stay the same. It matters when you start from random weights.

**How many patterns fit?** For random patterns, about 0.138 × the number of units: about 6 on a 7 × 7 grid. Patterns that look alike interfere sooner.

**Is anything sent anywhere?** No. Everything runs in your browser and nothing is stored.
