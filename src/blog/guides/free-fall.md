---
title: "Free fall: why a stone and a feather land together without air"
summary: "Why every object falls with the same acceleration in a vacuum, how to use v = gt and s = ½gt², and how air drag and terminal speed change the picture."
tools: [free-fall, projectile-launcher, motion-graphs, equations-of-motion]
updated: 2026-11-10
sources:
  - "g = 9.8 m/s², the standard school value for the acceleration due to gravity near Earth's surface."
  - "The terminal speeds in the tool (50 m/s for the stone, 2 m/s for the feather) are round teaching values, not measurements. Worked example numbers were produced with the tool's own formulas."
---

Drop a stone and a feather from the same height and the stone wins easily. Drop them inside a tube with the air pumped out and they hit the bottom together. The [[free-fall]] tool lets you see both cases side by side, change the height, and read off the speeds and landing times. It is made for Class 9 students meeting gravity for the first time, with a Class 11 setting that adds the drag formulas. For the full set of motion equations, see [[equations-of-motion]]; to turn a fall into a graph, open [[motion-graphs]], and for a ball thrown sideways, use the [[projectile-launcher]].

## What it is

An object is in **free fall** when gravity is the only force acting on it. Near the Earth's surface, gravity makes it speed up by about 9.8 metres per second every second. That number is called **g**, the acceleration due to gravity, written 9.8 m/s².

Why does mass not matter? A heavier object is pulled harder, but it is also harder to get moving. The two effects cancel exactly, so every object gains speed at the same rate.

Starting from rest, with no air:

- **v = gt** gives the speed v (m/s) after a time t (s).
- **s = ½gt²** gives the distance fallen s (m) after time t.
- **t = √(2h ÷ g)** gives the time to fall a height h (m).

With air, things change. Air pushes back on a falling object, and that push, called **drag**, grows as the object speeds up. When drag equals the object's weight, the forces balance and the speed stops rising. That top speed is the **terminal speed**, v_t. A feather has a large surface for its tiny weight, so its terminal speed is low and it reaches it almost at once.

The Class 11 setting shows the formulas the tool uses with drag. The speed after time t is v = v_t × tanh(gt ÷ v_t). Here tanh is a function that starts at 0 and levels off at 1, so the speed rises and then flattens at v_t.

## How to use it

1. Choose **Class 9** for the basic picture or **Class 11** to see the drag formulas as well.
2. Leave **No air (vacuum)** selected and press **Drop again**. Watch both objects fall and read their speeds under the picture.
3. Move the **Drop height** slider. It goes from 5 m to 80 m in steps of 5 m, and the landing time updates at once.
4. Switch to **With air** and drop again. The line under the picture now gives a separate landing time for each object.
5. Use **Pause** to freeze the fall and compare the two speeds at the same moment.
6. Answer the short quiz at the bottom. It uses fresh numbers each time.

## A worked example

Set the height to **45 m** with no air.

- Fall time: t = √(2 × 45 ÷ 9.8) = √9.18 ≈ **3.03 s**, the same for both objects.
- Landing speed: v = gt = 9.8 × 3.03 ≈ **29.7 m/s**. You can check it another way, with v = √(2gh) = √(2 × 9.8 × 45) = √882 ≈ 29.7 m/s.

Now count the first few seconds. After 1 s the stone moves at 9.8 m/s and has fallen 4.9 m. After 3 s it moves at 29.4 m/s and has fallen ½ × 9.8 × 9 = 44.1 m, so it is less than a metre from the ground.

Switch to **With air** at the same 45 m.

- The stone has a terminal speed of 50 m/s, far above anything it reaches here. It lands after about **3.12 s** at about 27.3 m/s, only a little slower than in a vacuum.
- The feather hits its 2 m/s terminal speed almost at once, then drifts down at that steady speed. It takes about **22.6 s**, more than seven times as long as the stone.

## Where it is used

- **Reaction-time tests.** Drop a ruler and see how far it falls before a friend catches it. A 20 cm fall means t = √(2 × 0.2 ÷ 9.8) ≈ 0.2 s of reaction time.
- **Skydiving.** A skydiver falling belly-down reaches a terminal speed of roughly 50 to 60 m/s. Opening the parachute raises the drag so much that the terminal speed drops to a few metres per second.
- **Engineering and safety.** Designers use s = ½gt² to work out how fast a dropped tool or package hits the ground, and what padding it needs.
- **Measuring g.** In a school lab, timing a ball through a known height and rearranging s = ½gt² gives a value for g.

## Common mistakes

1. **Thinking heavy things fall faster in a vacuum.** They do not. Air is the only reason a feather lags behind.
2. **Using s = vt for a fall.** That formula is for steady speed. A falling object speeds up, so use s = ½gt².
3. **Squaring the wrong thing.** In s = ½gt², only t is squared. Doubling the time makes the distance four times larger.
4. **Forgetting units.** Put heights in metres and times in seconds before using g = 9.8 m/s². A 20 cm drop is 0.2 m.
5. **Expecting terminal speed in every fall.** A dense object dropped from a few metres lands long before drag catches up with its weight.

## Questions people ask

**Is g the same everywhere on Earth?** Nearly. It is a little stronger at the poles and a little weaker on high mountains, but 9.8 m/s² is close enough for school work.

**Does a falling object ever stop speeding up without air?** No. In a vacuum it keeps gaining 9.8 m/s every second until it hits the ground.

**What would happen on the Moon?** The Moon's gravity is about one sixth of Earth's and there is no air, so a stone and a feather land together, just more slowly. Astronauts did this experiment on the Moon with a hammer and a feather.
