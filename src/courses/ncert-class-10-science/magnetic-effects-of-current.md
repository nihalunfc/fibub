---
title: Magnetic Effects of Electric Current
seoTitle: 'Magnetic Effects of Current Class 10 notes'
summary: 'Class 10 Magnetic Effects of Current with animations: field lines, thumb rule, solenoid, Fleming rule, motor, induction, generator and safe house wiring.'
minutes: 60
updated: 2026-11-22
quiz:
  - q: 'A straight wire carries current vertically upwards. Looking from above, the magnetic field lines around it go:'
    choices: ['Anticlockwise', 'Clockwise', 'Straight up', 'Radially outwards']
    ans: 0
    why: 'Point the right-hand thumb up along the current. The fingers curl anticlockwise when seen from above, and that is the direction of the field.'
  - q: 'A current flows east in a wire and the magnetic field points north. In which direction is the force on the wire?'
    choices: ['Upwards', 'Downwards', 'West', 'South']
    ans: 1
    why: 'Fleming left-hand rule: forefinger north (field), middle finger east (current). The thumb then points down, which is the direction of force. Check: east cross north points down.'
  - q: 'In a household circuit, the earth wire is connected to:'
    choices: ['The live wire', 'The metal body of the appliance', 'The fuse only', 'The neutral at the switch']
    ans: 1
    why: 'If the live wire touches the metal body, the large current flows safely into the earth through the earth wire and the fuse or MCB trips, so nobody gets a shock.'
sources:
  - 'NCERT Class 10 Science, Chapter 12 “Magnetic Effects of Electric Current” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Oersted, H. C. (1820), “Experimenta circa effectum conflictus electrici in acum magneticam”, Copenhagen'
  - 'Faraday, M. (1832), “Experimental researches in electricity”, Philosophical Transactions of the Royal Society 122, 125-162'
  - 'Field of a long straight wire B = μ0 I / 2πr with μ0 = 4π × 10⁻⁷ T m/A: SI Brochure, 9th edition, BIPM (2019)'
  - 'Domestic wiring, earthing and MCB practice in India: Bureau of Indian Standards, IS 732 (Code of practice for electrical wiring installations)'
---

**Science · Class 10 · Chapter 12 · about 60 minutes.** By the end you will be able to draw the magnetic field around magnets, wires and coils, find the direction of force on a current-carrying wire and explain how a safe house circuit is wired. An extra section at the end covers motors and generators (beyond the syllabus).

<div class="bigidea">Electricity and magnetism are two faces of one thing. A current makes a magnetic field. A magnetic field pushes on a current. A changing magnetic field makes a current. Motors and the power grid use these facts too (see the last section, beyond the syllabus).</div>

## 1. Magnetic field and field lines

Bring an iron nail near a magnet and it jumps. The magnet does not need to touch it. The space around a magnet where its force can be felt is the **magnetic field**. A small compass needle is a tiny magnet, so it lines up with the field.

We cannot see the field, so we draw **field lines**. Sprinkle iron filings on a sheet over a bar magnet and tap it: the filings arrange themselves along these lines.

<figure class="fig" data-fig="c10-mag-fieldlines"><figcaption>Drag the compass anywhere around the magnet and watch the needle follow the field line. Turn on the iron filings to see the pattern appear. Add a second magnet and flip it to see two poles that attract (lines join) or repel (lines push apart).</figcaption></figure>

Rules of field lines:

- Outside the magnet, lines go from the **north pole to the south pole**. Inside, they run from south to north, so each line is a closed loop.
- The direction of the line at a point is the direction a north pole would be pushed, the direction the compass needle points.
- Lines are **closer together where the field is stronger**: near the poles.
- Two field lines **never cross**. If they did, a compass at that point would have to point two ways at once.

<!--fig:tool magnetic-field-mapper-->

Try the lines of a real bar magnet, and drop in more magnets, in the [Field lines](/science/field-line-plotter/) plotter.

<div class="myth"><b>Common mistake.</b> Field lines are not real threads. They are a drawing aid. The field is everywhere in the space, even between two lines; the lines just show its direction, and their crowding shows its strength.</div>

## 2. Field due to a current in a straight wire

In 1820 a Danish teacher, Hans Christian Oersted, saw a compass needle twitch when a battery was switched on in a wire above it. **A current produces a magnetic field.** This was the first link between electricity and magnetism.

<div class="history">

- **1820:** Oersted notices the compass deflect near a current. Within weeks Ampère in France works out the forces between wires.
- **1831:** Faraday in London makes a current from a moving magnet.
- **1880s:** Generators and motors light up cities.

</div>

The field around a straight wire is a set of **circles** around it, with the wire at the centre. Close to the wire the circles are crowded, so the field is strong. Far away it is weak.

<figure class="fig" data-fig="c10-mag-wire"><figcaption>Drag the compass near the wire. Change the current and the distance: the field doubles when the current doubles and halves when you go twice as far away. Reverse the current and the needle turns around.</figcaption></figure>

```math
B = \frac{\mu_0 I}{2\pi r}
```

<div class="meaning">

`$B$` is the magnetic field in tesla (T). `$I$` is the current in amperes. `$r$` is the distance from the wire in metres. `$\mu_0 = 4\pi \times 10^{-7}$` T m/A is a constant of nature. Meaning: field is proportional to current and inversely proportional to distance. (NCERT Class 10 asks only for this idea in words; the formula is a bonus that lets you put numbers on it.)

</div>

For a current of 10 A at 5 cm: `$B = 2\times10^{-7} \times 10 / 0.05 = 4\times10^{-5}$` T, about the same as the Earth's own field.

<div class="problem" data-problem="c10s-mag-wire"></div>

### Right-hand thumb rule

Which way do the circles go? Use your **right hand**. Hold the wire in your fist with the thumb stretched along the current. The curled fingers show the direction of the field.

<div class="steps" data-fig="c10-mag-thumbrule">
<div class="step"><b>1. A wire carrying current upward.</b> The wire stands vertical and the current runs up. The field is circles around it, but which way?</div>
<div class="step"><b>2. Thumb along the current.</b> Make a fist with your right hand and stretch the thumb straight up, the same way as the current.</div>
<div class="step"><b>3. Fingers show the field.</b> The curled fingers go anticlockwise seen from above. That is the direction of the field lines and of a compass needle.</div>
<div class="step"><b>4. Reverse the current.</b> Now the thumb points down, so the fingers curl the other way. Reverse the current and the field reverses.</div>
<div class="step"><b>5. Same rule for a coil.</b> Curl your fingers the way the current goes round a coil. The thumb now points to the north pole of the coil.</div>
</div>

## 3. Field due to a current in a circular loop and a solenoid

Bend the wire into a **circle**. Every small piece of it makes circles of field around itself, and near the centre all of them point the same way through the loop. So at the centre the field is strong and straight. Use the thumb rule on the loop: curl fingers along the current, thumb gives the field through the loop.

Stack many loops side by side and you have a **solenoid**, a coil like a spring. Inside a long solenoid the field is strong, uniform (equal everywhere, parallel straight lines) and along the axis. Outside, the pattern looks exactly like a **bar magnet**: one end is a north pole and the other is a south pole.

<figure class="fig" data-fig="c10-mag-coils"><figcaption>Switch between one loop and a solenoid. Add turns and the field inside grows. Switch the iron core on and it grows a lot. Drag the compass around: outside the coil it behaves just as near a bar magnet.</figcaption></figure>

Three ways to make the field of a coil stronger: more current, more turns, and a **soft iron core** inside.

An **electromagnet** is a solenoid wound on a piece of soft iron. The iron becomes a strong magnet while the current flows and loses almost all magnetism when it is switched off. That is why the crane in a scrapyard can pick up a car and then drop it. A permanent magnet cannot be switched off. Electric bells, relays, MRI scanners and the Maglev train use electromagnets.

<div class="myth"><b>Common mistake.</b> The field inside a solenoid is not strongest at the ends and zero in the middle. It is nearly the same all along the inside, which is why we call it uniform. Only near the very ends does it weaken.</div>

## 4. Force on a current-carrying conductor in a magnetic field

Oersted showed a current pushes a magnet. By Newton's third law, a magnet must push a current. So a wire carrying current in a magnetic field feels a **force**. Put a metal rod across two rails between the poles of a horseshoe magnet and switch on the current: the rod rolls along the rails.

<figure class="fig" data-fig="c10-mag-force"><figcaption>Press the current on and the rod rolls. Reverse the current or flip the magnet and the rod rolls the other way. Raise the current and the field and the force grows. Watch the three hand arrows: field, current and force.</figcaption></figure>

The force is largest when the wire is at **right angles** to the field. If the wire lies along the field, there is no force at all.

```math
F = B I L \sin\theta
```

<div class="meaning">

`$F$` is the force in newtons. `$B$` is the field strength in tesla. `$I$` is the current in amperes. `$L$` is the length of wire inside the field in metres. `$\theta$` is the angle between the wire and the field. Meaning: more field, more current or more wire in the field means more push; at `$\theta = 90^\circ$` the push is maximum. (Class 10 NCERT does not use this formula; it shows how the push depends on the three things.)

</div>

A 20 cm wire carrying 5 A in a 0.4 T field at right angles feels `$F = 0.4 \times 5 \times 0.2 = 0.4$` N.

<div class="problem" data-problem="c10s-mag-force"></div>

### Fleming's left-hand rule

The three directions are always at right angles to one another. Stretch the **forefinger, middle finger and thumb of your left hand** so they are mutually perpendicular:

- **Fore**finger: direction of the magnetic **field** (north to south).
- **Middle** finger: direction of the **current** (positive to negative).
- **Thumb**: direction of the **force** (motion) on the wire.

A memory trick: **F**ore = **F**ield, **m**iddle = current (**C**entral), thumb = **t**hrust.

<!--fig:tool fleming-rule-->

<div class="myth"><b>Common mistake.</b> Using the right hand for force. The right-hand rule (section 2) is for the field made by a current. The left-hand rule is for force. Remember: the thumb rule (right hand) tells you the field a current makes; Fleming's left-hand rule tells you the push the field gives back.</div>

## 8. Domestic electric circuits

India's mains supply is alternating current (AC), 230 V at 50 Hz. It comes into a house as three wires:

- **Live (phase) wire**, usually red, at 230 V. It is the dangerous one.
- **Neutral wire**, usually black, at about 0 V. It completes the circuit.
- **Earth wire**, usually green, connected to a metal plate buried deep in the ground. It is for safety only and normally carries no current.

Appliances are connected **in parallel** across live and neutral, so each one gets the full 230 V and each can be switched off by itself. A switch is always put in the **live** wire, so when it is off, the appliance is not at high voltage.

<figure class="fig" data-fig="c10-mag-domestic"><figcaption>Switch appliances on and watch the total current climb. Pick the MCB rating and see it trip when the current is too high. Press "short circuit" to watch an enormous current flow. Then touch a faulty geyser body with the earth wire off and on.</figcaption></figure>

### Overloading and short circuit

- **Overloading:** too many appliances on one socket make the current larger than the wire can safely carry. The wire heats up and may start a fire. Example: a heater, an iron and a geyser all on one extension board.
- **Short circuit:** the live and neutral wire touch directly, perhaps because worn insulation lets them meet. The resistance becomes almost zero, so the current becomes huge for a moment.

Safety devices:

- A **fuse** is a thin wire of a metal alloy with a low melting point. If the current goes above its rating, the wire melts and breaks the circuit. It must be replaced.
- A **miniature circuit breaker (MCB)** does the same job but it trips a switch, so you simply switch it back on after fixing the fault.
- An **earth wire** gives a very low resistance path to the ground. If the live wire touches the metal body of an appliance (an iron, a fridge, a geyser), a large current flows down the earth wire instead of through your body, and the fuse or MCB cuts off the supply. Without earthing, the body of the appliance stays at 230 V and the next person to touch it gets a shock.

<div class="problem" data-problem="c10s-mag-fuse"></div>

<div class="problem" data-problem="c10s-mag-current"></div>

<div class="myth"><b>Common mistake.</b> A fuse of a higher rating does not make the wiring safer. A fuse rated higher than the wire can carry lets the wire overheat before it blows. Always use the rating the circuit was designed for. And never put a fuse or switch in the neutral wire.</div>

Safety checklist: never touch a switch with wet hands, switch off before changing a bulb, use a three-pin plug for any metal-bodied appliance and keep a tester or a residual current device (RCD) on bathroom circuits.

## 9. Beyond the syllabus: motors and generators

*The board exam no longer asks this part, and it returns in Class 12 (Electromagnetic Induction). Read it for the figures and for curiosity.*

### The electric motor

A motor turns electrical energy into rotation. Take a rectangular coil between the poles of a magnet. Current goes down one long side and up the other, so by the left-hand rule the two sides are pushed in **opposite directions**. One side goes up, the other goes down, and the coil turns. This is a turning effect, or a torque.

<figure class="fig" data-fig="c10-mag-motor"><figcaption>A working motor. Turn the split-ring commutator off and watch the coil stop after half a turn: it just rocks to and fro. Turn it on and it spins. Raise the current for a faster spin.</figcaption></figure>

There is a catch. After half a turn the sides swap places. The side that was going up would now be pushed down, and the coil would turn back. The cure is the **split-ring commutator**: two half rings that reverse the current in the coil every half turn, so the push always keeps the same turning direction.

<div class="steps" data-fig="c10-mag-motorsteps">
<div class="step"><b>1. Coil horizontal.</b> Current flows in through one brush. The two long sides carry current in opposite directions, so the left-hand rule gives an upward force on one side and a downward force on the other. The coil starts to turn.</div>
<div class="step"><b>2. Coil tilting.</b> The coil keeps turning. The force stays the same size but, as the coil tilts, the turning effect becomes smaller.</div>
<div class="step"><b>3. Coil vertical.</b> The forces now pull straight along the coil and give no turn. At this instant the two halves of the split ring change brushes, so the current reverses.</div>
<div class="step"><b>4. Past the vertical.</b> Because the current has reversed, the force on each side is again in the direction that keeps the coil turning the same way. This repeats every half turn.</div>
</div>

A real motor gets a stronger, steadier spin by using **many turns** of wire, a **stronger magnet** and a **soft iron core** (armature) the coil is wound on. A fan, a mixer in a kitchen, a washing machine, a metro train and an electric scooter all run on motors.

### Electromagnetic induction

A current makes a magnet field. Can a magnet make a current? Michael Faraday asked this and tried for ten years. In 1831 he found it: **move a magnet and the coil nearby gets a current, with no battery at all.**

This is **electromagnetic induction**. The current made in this way is an **induced current** and the push behind it is the **induced emf**.

<figure class="fig" data-fig="c10-mag-induction"><figcaption>Drag the magnet in and out of the coil. The galvanometer needle jumps while the magnet moves and rests when it stops. Swap the pole and the needle jumps the other way. Move faster, or use more turns, and the jump grows.</figcaption></figure>

What the figure shows:

- Magnet moving in: needle swings one way.
- Magnet at rest, inside or outside: **no current**. What counts is the **change** of the magnetic field through the coil.
- Magnet moving out: needle swings the other way.
- Faster motion, more turns, or a stronger magnet: a bigger current.

The same happens if the magnet stays still and the coil moves, or if the field of a nearby coil switches on and off. The direction of the induced current can be found with **Fleming's right-hand rule**: forefinger along the field, thumb along the motion of the conductor, and the middle finger gives the direction of the induced current.

<div class="myth"><b>Common mistake.</b> A magnet sitting still inside a coil does not give a current. Only a change does. That is why a dynamo needs rotation.</div>

### The electric generator, and AC versus DC

A generator is a motor played backwards. It turns **mechanical energy into electrical energy**. A coil is spun in a magnetic field by a turbine (steam, water, wind). As the coil turns, the field through it keeps changing, so an emf is induced all the time.

<figure class="fig" data-fig="c10-mag-generator"><figcaption>Spin the coil faster with the slider and watch the graph. Switch between slip rings (AC) and a split ring (DC). With slip rings the output reverses direction twice each turn. With the split ring it always has the same sign but rises and falls.</figcaption></figure>

- **Alternating current (AC)** reverses its direction at regular intervals. India's mains supply is AC at **50 Hz**: 50 complete cycles every second, so the current reverses direction 100 times a second.
- **Direct current (DC)** flows in one direction only, as in a battery or a cell.

Why do we use AC at home? AC can be sent over very long distances through the grid with much less loss, by using transformers to raise and lower the voltage. India's supply is 230 V AC at 50 Hz.

<div class="problem" data-problem="c10s-mag-freq"></div>

| | AC | DC |
|---|---|---|
| Direction | Reverses regularly | Always the same |
| Source | Power station generator, inverter | Cell, battery, solar panel |
| Over long distances | Little loss | Large loss |
| Frequency in India | 50 Hz | 0 Hz |

<div class="keypoints">

- A magnet has a field around it. Field lines run from N to S outside, are closed loops, are closer where the field is stronger and never cross.
- A current in a wire produces a magnetic field. Around a straight wire it is circles, found by the **right-hand thumb rule**. It grows with current and falls with distance.
- A solenoid makes a uniform field inside and looks like a bar magnet outside. An iron core makes an **electromagnet**.
- A wire carrying current in a magnetic field feels a force, found by **Fleming's left-hand rule**. It is largest at right angles and zero if parallel to the field.
- Indian mains is 230 V AC at 50 Hz.
- House wiring: live, neutral and earth. Appliances are in parallel. Fuse or MCB handles overload and short circuit; the earth wire protects from shock.

</div>

Now try the [practice questions](/learn/courses/ncert-class-10-science/magnetic-effects-of-current-practice/).

Beyond the syllabus (not examined): a motor uses the force on a coil with a split-ring commutator; induction makes a current from a changing field; a generator is a motor in reverse.
