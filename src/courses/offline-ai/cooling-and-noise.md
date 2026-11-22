---
title: Cooling, noise and where to put the machine
summary: Keep an AI machine cool and quiet. Airflow, room heat, fan noise, dust and where to place a home or office machine.
minutes: 15
updated: 2026-11-22
sources:
  - 'Graphics card board power: NVIDIA product pages via Compute Market, updated 1 November 2026, https://compute-market.com'
  - 'NVIDIA System Management Interface (nvidia-smi) documentation, including the power limit setting (official page), https://docs.nvidia.com/deploy/nvidia-smi/index.html'
  - 'Halliday, D., Resnick, R. and Walker, J., Fundamentals of Physics (Wiley), chapters on energy and the first law of thermodynamics (electrical energy used ends up as heat)'
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

<div class="bigidea">Almost every watt an AI machine uses becomes heat in the room, and that heat must be carried away or the chip slows itself down.</div>

## 1. Why this matters

A machine that overheats slows itself down (Lesson 6.4), wears out sooner and annoys everyone with fan noise. In hot climates, such as summers in India and the Gulf, this matters even more.

## 2. Heat goes into the room

Every watt becomes heat. The computing itself stores almost no energy: the electricity flows in, the sums get done, and the energy leaves as warmth. A 450 W machine running for hours warms a small room like a small heater. In summer, that can mean more air-conditioning cost; in a Canadian or UK winter, it is free heat.

<div class="steps">
<div class="step"><b>Power in.</b> A PC draws 450 W for a 6-hour batch job: 450 × 6 = 2,700 Wh = 2.7 kWh of electricity.</div>
<div class="step"><b>Heat out.</b> Nearly all of it becomes heat in the room: 2.7 kWh, exactly what a 450 W heater gives in 6 hours.</div>
<div class="step"><b>In winter.</b> In a cold Canadian or UK room, that heat is not wasted: the heating does a little less work.</div>
<div class="step"><b>In summer.</b> In Chennai in May, the air conditioner must pump that heat outside. One that moves about 3 kWh of heat per kWh of electricity uses about 2.7 ÷ 3 = 0.9 kWh extra.</div>
</div>

```math
\text{heat added (kWh)} \approx \text{electricity used (kWh)} = \frac{W \times h}{1000}
```

<div class="problem" data-problem="cooling-and-noise-heat"></div>

<div class="meaning">

<dl>
<dt>W × h ÷ 1,000</dt><dd>The electricity the machine used, in kWh.</dd>
<dt>Heat added</dt><dd>The warmth released into the room: about the same number of kWh.</dd>
<dt>Air-conditioner efficiency</dt><dd>How many kWh of heat it moves outside for each kWh of electricity, often about 2.5 to 4.</dd>
<dt>Physical meaning</dt><dd>A computer is, in energy terms, an electric heater that does sums on the way. Like a crowded room that needs a window opened, the heat has to go somewhere, or the chip gets hot and slows down.</dd>
</dl>

</div>

<div class="myth">

**"A computer turns electricity into computing, not heat."** Energy is never used up, only changed. The sums carry away almost none of it, so nearly all the electricity ends up as heat in the room. A 400 W PC warms a room just like a 400 W heater.

</div>

<div class="problem" data-problem="cooling-and-noise-ac"></div>

## 3. Placement checklist

1. Give the case 10 to 15 cm of space at the back and sides.
2. Never close it in a cupboard without vents or a fan.
3. Keep it off carpets and away from direct sun.
4. Clean dust filters every month or two (more often in dusty cities).
5. For an office server (Lesson 5.5), a ventilated room or a quiet corner away from desks works best.

## 4. Noise

Macs and AI boxes are near-silent under typical use. Graphics PCs can be loud under long loads. Fixes: lower the card's power limit, set a gentler **fan curve** (the setting that decides how fast the fans spin at each temperature), choose a larger case with bigger, slower fans, or put the machine in another room and use it over the network (Lesson 11.1).

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

<div class="keypoints">

- Nearly all the electricity a machine uses becomes heat: heat in kWh ≈ W × h ÷ 1,000.
- That heat is free warmth in winter, and extra air-conditioning work in a hot summer.
- Give the case 10 to 15 cm of space, never shut it in a closed cupboard, and clean dust filters often.
- A lower power limit, a gentler fan curve or a bigger case makes a graphics PC cooler and quieter.

</div>
