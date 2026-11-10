---
name: Fuse heating
num: 1216
shelf: learn
code: L102
section: school-physics
title: "Fuse heating"
summary: "Turn up the current through fuse wire, a nichrome heater coil or copper and watch it warm, glow and melt. Then switch on appliances at home until the fuse blows. Class 10 adds H = I²Rt and I = P/V."
status: live
ads: false
order: 1216
icon: target
works: offline
updated: 2026-11-09
related: [simple-circuit-lab, ohms-law-lab, series-parallel, electromagnet-builder]
sources:
  - "Joule's law of heating H = I²Rt, electric power P = VI, 230 V household supply (India), and the approximate glow colours of hot solids (dull red from about 500 °C to white-hot above about 1300 °C): standard school physics."
  - "Melting points: tin-lead fuse alloy about 230 °C (rounded), copper 1085 °C, nichrome about 1400 °C. Wire temperatures use made-up constants (rise proportional to I²); appliance powers are rounded typical values."
  - "Checked by hand and with a short Python calculation: melt currents, temperatures, home currents and heat."
flow:
  - { icon: sliders, label: "Current" }
  - { icon: target, label: "Wire glows" }
  - { icon: calculator, label: "Add load" }
  - { icon: check, label: "Fuse blows" }
---

## What it does

When current flows through a wire, the wire gets warm. The heat made each second is **I²R**: it grows with the **square** of the current, so twice the current makes four times the heat. This **heating effect** is what makes a heater coil, an electric iron and an old-style bulb work. It is also what a **fuse** uses to keep a home safe: a fuse is a short piece of wire with a low melting point. If too much current flows, the fuse wire melts first and breaks the circuit, before the house wiring can overheat.

The page has two parts. In the first, choose a wire (a 5 A fuse wire, a nichrome heater coil or thin copper) and slide the current up: watch the temperature rise, the wire glow red, orange and yellow, and finally melt. In the second, choose a fuse rating, switch on appliances and watch the current meter. When the total goes over the rating, the fuse blows and everything turns off.

It follows the school topics Class 8 Science, electricity (heating effect of current, fuses and safety) and Class 10 Physics, electricity (Joule's law of heating and electric power). Before this, the [[simple-circuit-lab]] tests conductors and insulators; afterwards, the [[ohms-law-lab]] links current, voltage and resistance.

## How to use it

1. Pick a **wire** and move the **current** slider. Read the temperature and the glow colour.
2. If it melts, press **Fit a new wire**.
3. In part 2, pick a **fuse rating** and tap appliances to switch them on or off.
4. Press **Short circuit** to see what a fault does, and **Replace the fuse** to start again.
5. The **Level** switch (Class 10) shows the heat per second from H = I²Rt for a 0.5 Ω wire.

## Worked example

The nichrome coil reaches 505 °C (dull red) at 4 A, 775 °C (cherry red) at 5 A and 1105 °C (yellow) at 6 A; the rise above room temperature goes up as the square of the current. The fuse wire reaches its melting point of 230 °C at exactly 5 A and melts just above.

At home on 230 V, a 1500 W kettle draws I = P ÷ V = 1500 ÷ 230 = 6.52 A, which a 10 A fuse allows. Add a 2000 W heater and the total is 3500 ÷ 230 = 15.2 A, more than 10 A, so the fuse blows.

## Check yourself

Five fresh questions: current from power, whether a fuse holds, heat from H = I²Rt, how heat changes when current doubles, and why fuse wire melts easily. Nothing is saved.

## Tips

- A fuse must be the right rating: too big and it will not protect the wiring.
- Many homes now use miniature circuit breakers (MCBs), which switch off instead of melting and can be reset.
- Never replace a fuse with a thicker wire or touch mains wiring. Call a qualified electrician.

## FAQ

**Why doesn't copper house wiring glow?** Copper has a very low resistance and the wires are thick, so the heat made is small at normal currents.

**Are these exact temperatures?** No. The constants are made up so each wire behaves as described. Real temperatures depend on the wire's thickness, length and cooling.

**Is this from NCERT?** No. It is an independent study aid that follows the same school topics, with its own pictures and numbers.
