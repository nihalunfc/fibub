---
name: Nerve impulse lab
num: 1128
shelf: learn
section: school-biology
title: "Nerve impulse lab: resting potential, the all-or-none spike, myelinated axons and your reaction time"
summary: "Push a nerve membrane past threshold and watch an all-or-none spike, see Na⁺ rush in and K⁺ flow out, race an impulse along an axon with and without myelin, and test your own reaction time. Class 10 and Class 11 levels."
status: live
ads: false
order: 1128
icon: target
works: offline
updated: 2026-11-09
related: [cardiac-cycle, hodgkin-huxley-simulator, reaction-time-experiments]
sources:
  - "The spike is the Hodgkin and Huxley (1952) squid giant axon model (fibub's hhsim.ts), checked in the tests against a separate Python version."
  - "Speeds use rules of thumb: about √d m/s for an unmyelinated axon of diameter d µm and about 6 × d m/s for a myelinated one (Hursh 1939). They are rounded teaching values; real nerves vary."
  - "The reaction-time box measures taps in your browser only; nothing is stored or sent anywhere. Drawings are fibub's own."
flow:
  - { icon: sliders, label: "Push" }
  - { icon: curve, label: "Spike" }
  - { icon: pointer, label: "Race" }
  - { icon: clock, label: "React" }
---

## What it does

Nerve cells (neurons) carry messages as tiny electrical **impulses**. At rest, the inside of the membrane is negative compared with the outside, about −70 mV in most textbooks (−65 mV in the model used here). When a stimulus pushes it past a **threshold**, sodium channels open, Na⁺ rushes in and the inside turns positive for a moment: a **spike** (action potential). Then potassium channels open, K⁺ flows out and the membrane goes back to rest. The spike sets off the next patch of membrane, so the impulse travels along the axon.

This lab has three parts:

- **One spike.** Slide the stimulus strength. Below threshold nothing happens; above it you get a full spike every time: the **all-or-none** law. At Class 11 level a second graph shows the Na⁺ and K⁺ channels opening.
- **Along the axon.** Send an impulse along 10 cm of an unmyelinated axon and a myelinated one of the same thickness. On the myelinated axon the impulse jumps from gap to gap (the **nodes of Ranvier**): **saltatory conduction**.
- **How fast are you?** A reaction-time test, compared with how long the nerve part takes.

It fits **Class 10 Science: control and coordination** (neurons, how impulses travel, reflexes) and **Class 11 Biology: neural control and coordination** (resting potential, depolarisation, Na⁺ and K⁺, myelinated fibres). It is a teaching model. To run the full equations with your own currents, use [[hodgkin-huxley-simulator]]; for proper reaction-time experiments, use [[reaction-time-experiments]]; and see electrical timing in the heart with [[cardiac-cycle]].

## How to use it

1. **Pick the level.** *Class 10* keeps to the spike, the speed sum and reaction time. *Class 11* adds the after-spike dip (hyperpolarisation), the Na⁺ current and a graph of Na⁺ and K⁺ channels.
2. **Slide the stimulus.** Watch for the sudden jump from no spike to a full spike between 6 and 7.
3. **Slide the axon thickness** and press **Send an impulse**. The race is shown 50 times slower than real life. The sum below gives the speeds and times.
4. **Reaction test.** Tap the box, wait until it turns dark, tap again. Five goes give an average, a middle value and your best.
5. **Check yourself** gives fresh questions every time.

## Worked example

With the stimulus at 10 the page shows **Spike! It peaks at +39 mV**. Set it to 6 and it says **Too weak: no impulse**; 7 gives a full spike again. For a 4 µm axon, the speed without myelin is about √4 = **2 m/s**, so 10 cm takes 0.1 ÷ 2 = **50 ms**; with myelin it is about 6 × 4 = **24 m/s**, so 10 cm takes **4.17 ms**, 12 times faster. If your median reaction time is 250 ms, the nerve travel (about 1.5 m at 60 m/s) is only **25 ms** of it; the rest is synapses, the brain deciding and muscles getting going.

## FAQ

**Why does a stronger stimulus not make a bigger spike?** Once threshold is passed, the Na⁺ channels open themselves in a chain reaction, so every spike is the same size. Stronger stimuli give more spikes per second instead.

**Why is the resting potential −65 mV here?** The model is fitted to the squid giant axon; many textbooks quote about −70 mV for a typical neuron. The idea is the same.

**Does tapping on a phone measure my true reaction time?** Roughly. Screens and touch sensors add a few tens of milliseconds, so compare your own goes rather than other people's.
