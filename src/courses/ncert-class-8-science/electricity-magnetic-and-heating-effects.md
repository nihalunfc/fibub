---
title: 'Electricity: Magnetic and Heating Effects'
seoTitle: 'Class 8 Science Chapter 4 notes: electricity effects'
summary: 'Class 8 Science Chapter 4 with animations: circuits, conductors, the magnetic effect, electromagnets, the electric bell, the heating effect, fuses and safety.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'A wire carrying current is held above a compass needle. What happens to the needle?'
    choices: ['It turns, because the current makes a magnetic field', 'Nothing happens', 'It melts', 'It spins forever']
    ans: 0
    why: 'A current in a wire makes a magnetic field round the wire (Oersted), and the needle lines up with the combined field.'
  - q: 'Which change makes an electromagnet stronger?'
    choices: ['More turns of wire, more current and a soft iron core', 'Fewer turns and no core', 'Using a plastic rod as the core', 'Reversing the cell only']
    ans: 0
    why: 'The pull grows with the number of turns and the current, and a soft iron core makes it far stronger.'
  - q: 'The fuse in a house circuit is a piece of wire that:'
    choices: ['melts when too much current flows, breaking the circuit', 'never gets hot', 'stores electric charge', 'makes the current larger']
    ans: 0
    why: 'A fuse wire has a low melting point. Too much current heats it until it melts and the circuit is broken.'
sources:
  - 'NCERT Class 8 Science (Curiosity), Chapter 4 “Electricity: Magnetic and Heating Effects” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Oersted’s 1820 observation that a current deflects a compass needle: standard physics history reference'
  - 'Heating effect (Joule’s law) H = I²Rt and electrical power P = VI: standard physics textbook results; Indian mains supply is 230 V (Bureau of Indian Standards, IS 12360)'
  - 'Magnetic field of a long straight wire B = μ₀I/(2πd), μ₀ = 4π × 10⁻⁷ T m/A; Earth’s field about 4 × 10⁻⁵ T near the surface: standard physics reference values'
---

**Physics · Class 8 · Chapter 4 · about 45 minutes.** By the end you can say when a circuit works, explain why a current makes a compass needle turn, build an electromagnet and make it stronger, explain how an electric bell works and why a heater glows, and say how fuses keep homes safe.

<div class="bigidea">A current is never just "flow". Wherever it goes it does two things: it makes a <b>magnetic field</b> round the wire and it <b>heats</b> the wire. The first gives us electromagnets, bells, cranes and motors; the second gives us heaters, bulbs, irons and fuses.</div>

## 1. A quick recall: circuits and conductors

An **electric circuit** is a complete path for current. A simple one has a **cell** (or battery) that pushes the current, **wires** to carry it, a **bulb** (or another device) and a **switch**. Current flows only in a **closed** loop; an open switch breaks the loop and the current stops.

Materials that let current pass are **conductors** (copper, aluminium, iron, graphite, salty water). Materials that do not are **insulators** (rubber, plastic, wood, glass, dry cloth). Wires are copper inside (conductor) and plastic outside (insulator), so you can touch them safely.

By convention the current is drawn flowing from the **positive (+)** end of the cell, round the loop, to the **negative (−)** end. (In a metal wire it is actually tiny electrons moving the other way, but we keep the old convention.)

Try it: close the switch, change the material that bridges the gap and add cells.

<figure class="fig" data-fig="c8-elec-circuit"><figcaption>The bulb lights only if the switch is closed and the gap is bridged by a conductor. Insulators (rubber, plastic) block the current. More cells give a brighter bulb. The dots show the current going round from the + end of the cell.</figcaption></figure>

<div class="myth">

**"The current gets used up in the bulb, so less comes back."** The same current flows through every part of a simple loop. What the bulb uses is the **energy** that the cell gave to the current, not the current itself.

</div>

Build a circuit of your own, with different parts, here:

<!--fig:tool simple-circuit-lab-->

For voltage, current and resistance together, try the [Ohm's law lab](/learn/ohms-law-lab/), the [Series and parallel](/learn/series-parallel/) tool or the full [Circuit simulator](/science/circuit-simulator/).

## 2. The magnetic effect of current

In 1820 a Danish teacher, Hans Christian Oersted, was giving a demonstration when he noticed that a compass needle near a wire twitched when he switched the current on. A compass needle is a tiny magnet, so the wire must be acting like a magnet. **A current-carrying wire produces a magnetic field.** This is the **magnetic effect of current**.

<div class="history">

- **1820:** Oersted sees a compass needle deflect near a current-carrying wire.
- **1820 to 1831:** Ampère, then Faraday in England, work out how currents and magnets act on each other.
- **Today:** Electromagnets run cranes, hospital MRI scanners, electric motors and loudspeakers.

</div>

Hold a wire above a compass, lined up north to south. With no current the needle points north. Switch the current on and the needle swings sideways. Reverse the current and it swings the other way. Change the current and the swing changes.

<figure class="fig" data-fig="c8-elec-oersted"><figcaption>Top view of a compass under a north-south wire. Switch the current on and off, change its size and reverse it. The needle turns more for a bigger current and turns the opposite way when the current is reversed.</figcaption></figure>

Why does the needle not turn all the way east? Earth's own magnetic field is also pulling it north. The needle settles in the direction where the two pulls balance. A larger current makes a stronger field round the wire, so the needle turns further.

## 3. Electromagnets

A straight wire has a weak field. If you wind it into a **coil**, the field of every turn adds up and the coil acts like a bar magnet with a north and a south pole. If you also put a **soft iron core** inside the coil, the iron becomes a magnet too and the pull gets much stronger. This device is an **electromagnet**.

An electromagnet has a great advantage over a bar magnet: it is **switched on and off by the current**, and you can change its strength.

<div class="steps" data-fig="c8-elec-build">
<div class="step">Take a soft iron nail. It is not a magnet. It picks up nothing.</div>
<div class="step">Wind insulated copper wire round the nail in neat turns, all in the same direction.</div>
<div class="step">Connect the two ends to a cell and a switch. The switch is open, so there is no current.</div>
<div class="step">Close the switch. The nail becomes a magnet and the paper clips jump up to it.</div>
<div class="step">Open the switch. The magnetism vanishes and the clips fall.</div>
</div>

**What makes it stronger?**

1. **More turns** of wire.
2. **More current** (more cells).
3. A **soft iron core** (iron loses its magnetism when the current is switched off, so it is "soft"; steel would stay magnetised).

<figure class="fig" data-fig="c8-elec-magnet"><figcaption>Slide the turns and the current, and take the iron core out. Count how many paper clips the electromagnet can hold. Switch off and they all drop.</figcaption></figure>

Build and test it yourself:

<!--fig:tool electromagnet-builder-->

<div class="problem" data-problem="c8s-elec-turns"></div>

**Uses of electromagnets:** lifting heavy iron in scrap yards, separating iron from rubbish, electric bells and door locks, relays and circuit breakers, loudspeakers, hard drives, MRI machines and the motors in fans and mixers.

### The electric bell

An electric bell is an electromagnet with a clapper attached to a springy iron strip. Pressing the switch sends current through the coil, the electromagnet pulls the strip and the hammer hits the gong. As the strip moves, it breaks the circuit at a contact point, the coil loses its magnetism, the spring pulls the strip back and the contact closes again. This repeats many times a second, so the bell keeps ringing. See it work in the [Electric bell](/learn/electric-bell/) tool.

<div class="myth">

**"Any metal rod will make a good core."** Only magnetic materials such as soft iron strengthen the coil. Copper, aluminium and plastic do almost nothing.

</div>

## 4. The heating effect of current

Touch a mobile charger after a long call, or a room heater, or an iron: they warm up. When current flows through a wire, the moving electrons bump into the metal's atoms, the atoms shake faster and the wire gets hot. This is the **heating effect of current**.

The heat made in a wire depends on three things.

```math
H = I^{2} R\, t
```

<div class="meaning">
<dl>
<dt>H</dt><dd>heat produced, in joules (J)</dd>
<dt>I</dt><dd>current, in amperes (A)</dd>
<dt>R</dt><dd>resistance of the wire, in ohms (Ω): how much it opposes the current. Thin wires and some alloys have a high R</dd>
<dt>t</dt><dd>time, in seconds (s)</dd>
<dt>Physical meaning</dt><dd>doubling the current gives 4 times the heat (because of I²); a thinner wire (more R) gets hotter; the longer it runs, the more heat. That is why a wire that is fine for a lamp can glow dangerously with a heater's current.</dd>
</dl>
</div>

<figure class="fig" data-fig="c8-elec-heat"><figcaption>Raise the current. The wire glows from grey to dull red and then bright orange. Switch to the thick wire: for the same current it makes 5 times less heat and stays cooler. This is why heaters use thin high-resistance coils and house wires are thick.</figcaption></figure>

<div class="problem" data-problem="c8s-elec-heat"></div>

**Uses:** electric heaters, geysers, irons, toasters and kettles use coils of a high-resistance alloy (nichrome) that can glow red-hot without melting. A **bulb** has a thin tungsten filament that glows white-hot inside a glass bulb filled with an inert gas. An LED bulb makes less heat for the same light, so it saves electricity.

**Power and the electricity bill.** The **power** of an appliance, in watts (W), tells you how fast it uses energy. For mains at 230 V, the current it draws is:

```math
I = \frac{P}{V}
```

<div class="problem" data-problem="c8s-elec-power"></div>

Your electricity bill is in **units**: 1 unit = 1 kilowatt-hour (kWh) = a 1000 W appliance running for 1 hour.

```math
\text{units} = \frac{\text{power in watts}}{1000} \times \text{hours}
```

<div class="problem" data-problem="c8s-elec-units"></div>

## 5. Fuses, overloads and safety

If too much current flows, the wires heat up (H = I²Rt) and could start a fire. Two common causes:

- **Overloading:** too many appliances on one socket, so the total current is too large.
- **Short circuit:** the live and neutral wires touch (because the plastic coating has worn away), so there is almost no resistance and the current is huge.

A **fuse** protects against both. It is a short, thin piece of wire made from an alloy that melts at a low temperature, placed in series with the circuit. A **5 A fuse** is built to melt when the current goes above about 5 A. When it melts, the circuit is open, the current stops and the wiring is safe. Many homes now use an **MCB** (miniature circuit breaker), which switches off by itself and can be reset instead of being replaced.

<figure class="fig" data-fig="c8-elec-fuse"><figcaption>Choose a fuse rating, then switch on appliances. The current is the total watts divided by 230 volts. If it goes above the fuse rating, the fuse wire melts and everything goes off. The geyser alone draws almost 9 A.</figcaption></figure>

See how real fuse wire heats and melts here:

<!--fig:tool fuse-heating-->

<div class="problem" data-problem="c8s-elec-fuse"></div>

**Safety rules:**

1. Never touch bare wires or switches with wet hands; water conducts electricity.
2. Never put a coin or a thick wire in place of a fuse: the whole point of a fuse is that it melts first.
3. Do not plug many appliances into one socket.
4. Use sockets with an **earth** pin for fridges, geysers and metal-bodied appliances: the earth wire carries a fault current safely into the ground.
5. If someone gets a shock, switch off the main supply (or push them away with a dry wooden stick); do not touch them directly.

<div class="keypoints">

- A circuit needs a complete closed loop; conductors let current pass, insulators do not.
- A current makes a magnetic field (Oersted): a compass needle near a wire turns; reversing the current reverses the turn.
- An electromagnet is a coil with a soft iron core. It is stronger with more turns, more current and an iron core, and can be switched on and off.
- Electromagnets are used in bells, cranes, relays, motors and MRI. In a bell the contact breaks the circuit again and again.
- The heating effect of current: H = I²Rt. Doubling the current gives 4 times the heat.
- Heaters, irons and bulbs use it; a fuse is a thin low-melting wire that melts when the current is too high.
- Power P = V × I; units on the bill are kWh = kW × hours.
- Overloading and short circuits are dangers; use fuses or MCBs, earth wires and dry hands.

</div>
