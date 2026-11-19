---
title: Cooling, noise and where to put the machine
summary: Keep an AI machine cool and quiet. Airflow, room heat, fan noise, dust and where to place a home or office machine.
minutes: 15
updated: 2026-11-19
sources:
  - 'Graphics card board power: NVIDIA product pages via Compute Market, updated 1 November 2026, https://compute-market.com'
quiz:
  - q: Where does almost all the electricity an AI machine uses end up?
    choices: ['As heat in the room', 'Stored in the model', 'Sent back to the grid']
    ans: 0
    why: A 400 W machine heats the room like a 400 W heater.
  - q: Which placement is worst for a busy graphics PC?
    choices: ['Inside a closed cupboard with no airflow', 'On a desk with space around it', 'In a ventilated rack']
    ans: 0
    why: Hot air has nowhere to go, the chip throttles and fans run loud.
  - q: A free way to make a graphics card quieter and cooler for AI work?
    choices: ['Lower its power limit by 20 to 30%', 'Overclock it', 'Cover the vents']
    ans: 0
    why: Writing is memory-bound, so a lower power limit costs little speed but cuts heat and fan noise.
---

**Module 6 · about 15 minutes · read first: 6.1.** You'll be able to place and set up a machine so it stays fast, quiet and safe.

## 1. Why this matters

A machine that overheats slows itself down (Lesson 6.4), wears out sooner and annoys everyone with fan noise. In hot climates, such as summers in India and the Gulf, this matters even more.

## 2. Heat goes into the room

Every watt becomes heat. A 450 W machine running for hours warms a small room like a small heater. In summer, that can mean more air-conditioning cost; in a Canadian or UK winter, it is free heat.

## 3. Placement checklist

1. Give the case 10 to 15 cm of space at the back and sides.
2. Never close it in a cupboard without vents or a fan.
3. Keep it off carpets and away from direct sun.
4. Clean dust filters every month or two (more often in dusty cities).
5. For an office server (Lesson 5.5), a ventilated room or a quiet corner away from desks works best.

## 4. Noise

Macs and AI boxes are near-silent under typical use. Graphics PCs can be loud under long loads. Fixes: lower the card's power limit, set a gentler fan curve, choose a larger case with bigger, slower fans, or put the machine in another room and use it over the network (Lesson 11.1).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** all electrical power ends up as heat; remove it or the chip slows itself.

**Equation:** heat added (W) ≈ power drawn (W). Air needed rises with heat and falls with the temperature rise you allow.

**Analogy:** a crowded room: more people means more heat, and you need to open a window.

**Try it:** a 450 W PC runs 6 hours. How much heat goes into the room? (450 × 6 = 2,700 Wh = 2.7 kWh, the same as a 450 W heater for 6 hours.)
</details>

## 5. Worked example

*Made-up numbers.* Rahul in Chennai runs an RTX 3090 PC in a small bedroom in May. Speeds fall after 20 minutes as the card throttles. He lowers the power limit to 280 W, moves the PC off the floor to a desk near the window and cleans the filters. The card stays cooler and keeps its speed with only a small loss.

## 6. Practice

1. How much space is around your machine's vents?
2. When did you last clean its dust filters?
3. Would your machine's heat help or hurt in your season now?

<details>
<summary>Answers</summary>

1. Aim for 10 cm or more.
2. If you cannot remember, now is a good time.
3. Winter in Canada or the UK: helps a little. Summer in India or the Gulf: hurts; schedule heavy jobs for cooler hours.
</details>

**New words:** *airflow*, *fan curve*, *dust filter*.
