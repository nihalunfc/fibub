---
title: Work, Energy, and Simple Machines
seoTitle: 'Work, Energy and Simple Machines Class 9 notes'
summary: 'Class 9 Work, Energy and Simple Machines with animations: work, kinetic and potential energy, conservation, power, kWh, levers, pulleys and ramps.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'A porter walks along a level platform carrying a suitcase on his head. The work done by his lifting force on the suitcase is:'
    choices: ['zero', 'positive', 'negative', 'equal to the weight of the suitcase']
    ans: 0
    why: 'The lifting force is upward and the movement is sideways, at 90° to it. W = F s cos 90° = 0. Being tired is not the same as doing work on the suitcase.'
  - q: 'A cyclist doubles her speed. Her kinetic energy becomes:'
    choices: ['two times', 'four times', 'half', 'the same']
    ans: 1
    why: 'KE = ½ m v². The speed is squared, so doubling v gives 2² = 4 times the energy.'
  - q: 'A lever has a load arm of 20 cm and an effort arm of 100 cm. What effort lifts a 300 N load?'
    choices: ['60 N', '300 N', '1500 N', '15 N']
    ans: 0
    why: 'Effort × effort arm = load × load arm, so E × 100 = 300 × 20 and E = 60 N. The mechanical advantage is 5.'
sources:
  - 'NCERT Class 9 Science (Exploration), Chapter 7 “Work, Energy, and Simple Machines” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard gravity g = 9.80665 m/s², 1 horsepower (metric) = 735.5 W, mechanical horsepower = 745.7 W: BIPM SI Brochure, 9th edition (2019), and NIST Special Publication 811 (2008)'
  - 'Typical efficiencies (hydro turbines about 90%, filament bulbs about 5% as light): IEA and US Department of Energy public fact sheets, rounded for teaching'
---

**Science · Class 9 · Chapter 7 · about 45 minutes.** By the end you will be able to decide when a force does work, calculate work, kinetic and potential energy, use conservation of energy, find power and an electricity bill, and explain how levers, pulleys and ramps make jobs easier.

<div class="bigidea">Work is energy being moved by a force. Energy comes in forms (movement, height) that can swap but never disappear. Power says how fast the energy is moved. Simple machines do not give you free energy: they let you swap a big force for a long distance, or the other way round.</div>

## 1. Work: force that makes things move

In daily life “work” means anything that tires you. In science it has a strict meaning: **work is done when a force moves an object**. Two things must be present: a force, and a displacement in the direction of (part of) that force.

If the force and the movement are along the same line:

```math
W = F \times s
```

The unit is the **joule (J)**: 1 J is the work done when a force of 1 N moves an object 1 m (1 J = 1 N m). Lifting a 100 g chocolate bar from the table to your mouth is about 1 J. Pushing a stuck scooter 10 m with 200 N is 2000 J.

<div class="meaning">
<dl>
<dt>W</dt><dd>work done by the force, in joules</dd>
<dt>F</dt><dd>the force, in newtons (the one whose work you are asking about)</dd>
<dt>s</dt><dd>displacement of the object, in metres, measured along the line of motion</dd>
<dt>Physical meaning</dt><dd>Work is the energy the force hands over to the object (or takes from it). Positive work adds energy, negative work removes energy.</dd>
</dl>
</div>

<div class="problem" data-problem="c9s-work-angle"></div>

**When the force is at an angle.** A rope pulling a box is usually tilted upwards. Only the part of the force that points along the motion pulls the box forward. The upward part just lightens the box and does no work along the floor. If θ is the angle between the force and the motion:

```math
W = F\, s \cos\theta
```

Play with the box below. At 0° all of the pull works; at 90° none of it does.

<figure class="fig" data-fig="c9-work-angle"><figcaption>The pull F splits into F cos θ along the floor (green, does the work) and F sin θ upward (no work along the floor). Raise the angle and the work for the same 5 m drops, because cos θ falls from 1 to 0.</figcaption></figure>

### Positive, zero and negative work

- **Positive work:** force and motion in the same direction (θ = 0°). Pushing a cart forward.
- **Negative work:** force opposite to the motion (θ = 180°, cos θ = −1). Friction or a brake: it takes energy away.
- **Zero work:** the force is zero, or nothing moves (s = 0), or the force is at 90° to the motion.

<figure class="fig" data-fig="c9-work-cases"><figcaption>Choose a case. Pushing a wall: s = 0. Carrying a bag along a level road: the force is up, the motion is sideways. Braking: the force opposes the motion, so the work is negative. The Moon and satellites in circular orbits are the same: gravity is at 90° to the motion.</figcaption></figure>

<div class="myth">

**“If I get tired, I must have done work.”** You can sweat pushing a wall that never moves: the wall gets no energy from you, so the work done on it is zero. Your muscles do use up chemical energy (to keep contracting), but in physics we only count work done on the object that is moved.

</div>

## 2. Energy: the ability to do work

An object has **energy** if it can do work. We measure energy in joules too, because doing work is how energy gets moved. Two forms matter in this chapter.

### Kinetic energy (energy of motion)

A moving cricket ball can hit the stumps and knock them down: it does work, so it has energy. Why does this energy depend on speed in such a strong way? Follow the argument step by step.

<div class="steps" data-fig="c9-work-keder">
<div class="step">A block of mass m sits at rest. Its kinetic energy is zero.</div>
<div class="step">A constant force F pushes it over a distance s. It speeds up to a speed v.</div>
<div class="step">The work the force does is W = F × s.</div>
<div class="step">From Newton’s second law F = m a. For a block starting from rest, v² = 2 a s, so s = v²/(2a).</div>
<div class="step">Multiply: W = m a × v²/(2a) = ½ m v². The acceleration cancels.</div>
<div class="step">The work done on the block is now stored as its energy of motion: the kinetic energy KE = ½ m v².</div>
</div>

```math
KE = \tfrac{1}{2} m v^2
```

<div class="meaning">
<dl>
<dt>KE</dt><dd>kinetic energy in joules</dd>
<dt>m</dt><dd>mass in kilograms</dd>
<dt>v</dt><dd>speed in metres per second</dd>
<dt>Physical meaning</dt><dd>It is the work needed to bring the object from rest up to speed v, and also the work it can do while coming to rest. Because v is squared, a fast vehicle is far more dangerous than a slow one: this is why speed limits matter near schools.</dd>
</dl>
</div>

<div class="problem" data-problem="c9s-work-ke"></div>

### Potential energy (stored energy of position)

Lift a book onto a shelf. You did work against gravity, and that work is now stored. If the book falls it can do work (for example, press a spring). The stored energy due to height is **gravitational potential energy**. Lifting a mass m through a height h needs a force m g (its weight), so the work, and the stored energy, is

```math
PE = m\,g\,h
```

where g is the acceleration due to gravity, 9.8 m/s² (we use 10 m/s² for quick sums). Two more everyday stores of potential energy: a stretched rubber band or catapult, and a wound-up toy spring.

<figure class="fig" data-fig="c9-work-kepe"><figcaption>Change the mass, speed and height. KE depends on the <i>square</i> of the speed (double the speed, four times the KE); PE depends on h only once (double the height, double the PE). The heavy ball stores more of both.</figcaption></figure>

Try the interactive energy track, where a skater on a curved ramp turns height into speed:

<!--fig:tool energy-track-->

<div class="problem" data-problem="c9s-work-pe"></div>

## 3. Conservation of energy

Let a ball roll down a hill. Its height falls, so its PE falls; its speed grows, so its KE rises. Energy is **not made or destroyed; it only changes form**. This is the **law of conservation of energy**. For an object moving only under gravity (no friction),

```math
KE + PE = \text{constant}
```

At the top of a swing all the energy is PE; at the bottom it is all KE. Watch it happen:

<figure class="fig" data-fig="c9-work-swing"><figcaption>Choose a pendulum, a roller coaster or a ball thrown up. The PE and KE bars rise and fall in opposite ways, but their sum stays level. Switch friction on and the total slowly drops: that energy leaves as heat and sound, and the swing dies away. It is not destroyed.</figcaption></figure>

A falling stone from height h reaches the ground with ½ m v² = m g h, so **v = √(2 g h)**. The mass cancels, so a heavy stone and a light stone fall with the same speed (apart from air). A 20 m fall gives v = √(2 × 10 × 20) = 20 m/s.

Energy changes form in every device we use: a dam turns the PE of water into electricity, a bulb turns electricity into light and heat, your body turns food into movement.

<figure class="fig" data-fig="c9-work-chain"><figcaption>Pick a device and follow 100 J of energy through each change. At every step some of it spreads out as heat. The useful part plus the heat always adds to 100 J: the total never changes.</figcaption></figure>

<div class="myth">

**“A moving ball slows down and stops, so its energy is lost.”** The ball’s KE went into warming the ground and the air a tiny bit, and into sound. The energy has spread out into forms that are hard to collect, but none has vanished.

</div>

## 4. Power: how fast the work is done

Two people carry the same 20 bricks up to the same roof. One takes 5 minutes and the other 20. They do the same work, but the first is more powerful. **Power is the rate of doing work**:

```math
P = \frac{W}{t}
```

The unit is the **watt (W)**: 1 W = 1 J/s. A 60 W fan converts 60 J of electrical energy every second. Larger units: 1 kW = 1000 W, 1 MW = 10⁶ W. For engines the older unit **horsepower** is still used: 1 hp ≈ 746 W (a scooter engine is about 5 to 8 hp).

<figure class="fig" data-fig="c9-work-power"><figcaption>Both cranes lift the same 100 kg by 10 m, so the work is the same. Crane B takes 20 s; change the time for crane A. Less time means more power.</figcaption></figure>

<div class="problem" data-problem="c9s-work-power"></div>

### The commercial unit of energy: the kilowatt hour

The joule is tiny for a house, and the second is short. The electricity board therefore sells energy in **kilowatt hours (kWh)**. One kWh is the energy used by a 1 kW appliance running for 1 hour. One kWh is called **one unit** on your bill.

```math
1\ \text{kWh} = 1000\ \text{W}\times 3600\ \text{s} = 3.6\times 10^{6}\ \text{J}
```

Energy in kWh = power in kW × time in hours. A 2000 W geyser running half an hour uses 1 unit. At ₹6 per unit that costs ₹6; a 10 W LED lamp on for 10 hours uses 0.1 unit (60 paise).

<!--fig:tool power-bill-->

<div class="problem" data-problem="c9s-work-kwh"></div>

## 5. Simple machines

A machine is any device that makes work easier by changing the size or direction of a force, or by giving it where it is convenient. The three jobs in this chapter are the lever, the pulley and the inclined plane. In every one of them:

- **Load (L)** is the force you want to overcome (a weight, a stuck nut).
- **Effort (E)** is the force you apply.
- **Mechanical advantage** MA = load ÷ effort. If MA is 4, a 25 N effort lifts a 100 N load.

No machine gives you more work than you put in. What you gain in force, you pay for in distance: **work in = work out** (ideally; friction makes work in a bit larger).

### Levers

A lever is a rigid bar that turns about a fixed point, the **fulcrum**. It balances when

```math
\text{effort}\times\text{effort arm} = \text{load}\times\text{load arm}
```

where an arm is the distance from the fulcrum to the force. So MA = effort arm ÷ load arm. A long effort arm gives a big MA: this is why a long crowbar lifts a heavy rock.

Levers come in three classes, set by which of the three points is in the middle:

| Class | In the middle | Examples |
|---|---|---|
| 1 | fulcrum | seesaw, scissors, pliers, crowbar |
| 2 | load | wheelbarrow, nutcracker, bottle opener |
| 3 | effort | tweezers, fishing rod, cricket bat, your forearm |

Class 1 can have MA more or less than 1. Class 2 always has MA above 1 (the effort arm is longer). Class 3 always has MA below 1: it gives up force to gain speed and reach.

<figure class="fig" data-fig="c9-work-lever"><figcaption>Drag the fulcrum triangle, the load and the effort along the beam. The effort needed to balance is worked out for you, together with the class of lever. Put the fulcrum right under the load and the effort needed becomes tiny.</figcaption></figure>

<div class="problem" data-problem="c9s-work-lever"></div>

### Pulleys

A **pulley** is a grooved wheel with a rope over it. A **fixed pulley** only changes the direction of the pull (it is easier to pull down than up), so MA = 1: a flagpole or a well. A **movable pulley** moves with the load, and two rope strands share the weight, so MA = 2. A **block and tackle** with n strands holding the load has MA = n.

The catch: to lift the load 1 m, each of the n strands must get 1 m shorter, so you pull n metres of rope.

<figure class="fig" data-fig="c9-work-pulley"><figcaption>Choose how many strands hold the load. The effort is the load divided by that number, but the rope you pull is that many times longer. Effort × rope pulled = load × height raised.</figcaption></figure>

### Inclined plane

Lifting a heavy drum straight onto a truck needs a force equal to its weight. Rolling it up a ramp needs much less force because the ramp does part of the work of holding the drum up. Without friction, the force on a ramp of length L and height h is

```math
E = W\,\frac{h}{L}
```

and MA = L ÷ h. A longer, gentler ramp needs less force over a longer distance: the same work. This is why mountain roads zig-zag up in hairpin bends, and why a wheelchair ramp is long and gentle.

<figure class="fig" data-fig="c9-work-ramp"><figcaption>Make the ramp longer and the push falls (green bar), while the distance grows. Check the work in the readout. Turn friction on: you now need a little more push, and the extra work becomes heat.</figcaption></figure>

Try them all together, and make your own machine:

<!--fig:tool simple-machines-->

Other related tools: [Collision lab and carts](/learn/collision-lab/) (energy in crashes), [Spring energy](/learn/spring-energy/).

<div class="history">

<ul class="timeline">
<li><b>c. 250 BCE</b> Archimedes explains the lever. The line “give me a place to stand and I will move the Earth” is attributed to him.</li>
<li><b>1807</b> Thomas Young uses the word “energy” in its modern sense.</li>
<li><b>1840s</b> James Prescott Joule shows that heat and work are exchangeable; the joule is named after him.</li>
<li><b>1882</b> The watt unit is adopted, after James Watt, who also defined the horsepower to sell steam engines.</li>
</ul>

</div>

<div class="keypoints">

- Work W = F s cos θ, in joules. It is positive along the force, negative against it, and zero when nothing moves or the force is at 90° to the motion.
- Kinetic energy KE = ½ m v² (speed squared); potential energy PE = m g h.
- Conservation of energy: energy changes form but the total stays the same; without friction KE + PE is constant. Falling from height h gives v = √(2 g h).
- Power P = W/t, in watts (1 W = 1 J/s). 1 hp is about 746 W.
- 1 kWh (one unit) = 3.6 × 10⁶ J; energy in kWh = kW × hours.
- Mechanical advantage MA = load ÷ effort. A lever balances when effort × effort arm = load × load arm; three classes by what is in the middle.
- A pulley with n supporting strands has MA = n; a ramp has MA = L/h. No machine gives more work than it takes in.

</div>
