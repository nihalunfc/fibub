---
title: Control and Coordination
seoTitle: 'Control and Coordination Class 10 notes'
summary: 'Class 10 Control and Coordination with animations: neurons, reflex arc, the brain, synapse, plant tropisms and hormones, and hormone feedback with insulin.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'Which of these is the correct path of a reflex action?'
    choices: ['receptor → motor neuron → brain → muscle', 'receptor → sensory neuron → spinal cord → motor neuron → muscle', 'muscle → spinal cord → receptor', 'brain → receptor → muscle']
    ans: 1
    why: 'The signal goes in through a sensory neuron, turns round in the spinal cord, and goes out through a motor neuron to the muscle, without waiting for the brain.'
  - q: 'A shoot bends toward the light because auxin:'
    choices: ['collects on the lighted side and slows growth', 'collects on the shaded side and makes the cells there grow longer', 'is destroyed by light everywhere', 'moves to the root']
    ans: 1
    why: 'Light pushes auxin to the shaded side. Cells with more auxin elongate more, so the shaded side is longer and the shoot curves toward the light.'
  - q: 'Blood sugar rises after a meal and the pancreas releases insulin, which lowers it. This is an example of:'
    choices: ['a reflex arc', 'positive phototropism', 'negative feedback', 'a synapse']
    ans: 2
    why: 'The change (high sugar) causes a response (insulin) that reverses the change. That is negative feedback, and it keeps the blood sugar steady.'
sources:
  - 'NCERT Class 10 Science, Chapter 6 “Control and Coordination” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Nerve conduction speeds, 1 to 120 m/s depending on fibre type: Kandel et al., Principles of Neural Science'
  - 'Ruler-drop reaction time, d = ½gt²: standard kinematics; typical human reaction time 0.2 to 0.25 s'
  - 'Fasting blood glucose thresholds (5.6 and 7.0 mmol/L): World Health Organization diabetes diagnostic criteria'
  - 'Iodisation of salt at 15 ppm at consumer level: Food Safety and Standards Authority of India (FSSAI)'
---

**Science · Class 10 · Chapter 6 · about 55 minutes.** By the end you will be able to describe how the nervous system carries messages, explain reflex actions and the parts of the brain, explain how plants respond to light, gravity and touch, and show how hormones control the body in animals and plants.

<div class="bigidea">A living thing must notice changes (a hot pan, a falling ball, a shaded leaf) and respond in time. Animals do it with two partners: fast electrical messages along nerves, and slower chemical messages (hormones) in the blood. Plants have no nerves; they use hormones alone.</div>

## 1. Control in animals: the nervous system

You touch a hot dosa tava and your hand jumps back before you even say "ouch". Your body detected a **stimulus** (heat), sent a message, and made a **response** (movement). The cells that detect stimuli are **receptors**: the eye (light), ear (sound and balance), nose (smell), tongue (taste), skin (touch, heat, cold). Receptors are in sense organs. The cells that carry the message are **neurons**, and the cells that respond are in **effectors**: muscles and glands.

### 1.1 The neuron

A **neuron** has a **cell body** (with the nucleus), many short **dendrites** that pick up signals, and one long **axon** that carries the signal away. The axon can be up to a metre long, and often has a fatty **myelin sheath** that makes the impulse travel faster. The signal travels as a weak electrical impulse, and always **from dendrite to axon end**: one direction only.

<div class="steps" data-fig="c10-ctrl-neuron">
<div class="step">A receptor detects a stimulus and starts a signal.</div>
<div class="step">The dendrite tip picks it up; a chemical reaction makes an electrical impulse.</div>
<div class="step">The impulse passes through the cell body.</div>
<div class="step">It runs along the axon, faster with a myelin sheath.</div>
<div class="step">At the axon end the impulse releases a chemical across the synapse.</div>
<div class="step">The next neuron or a muscle or gland receives it.</div>
</div>

See the electrical impulse itself, its rise and fall, with the real numbers of voltage and time:

<!--fig:tool action-potential-->

### 1.2 The synapse

Neurons do not touch. Between the axon end of one neuron and the dendrite of the next there is a tiny gap, about a millionth of a centimetre wide, called the **synapse**. When the electrical impulse arrives, the axon end releases a **chemical** that diffuses across the gap and fits on the next neuron, which starts a new electrical impulse there. The chemical-electrical hand-over also makes sure the signal goes only one way, just like a turnstile at a metro station.

<div class="steps" data-fig="c10-ctrl-synapse">
<div class="step">An impulse runs down the axon of the first neuron.</div>
<div class="step">Packets of chemical gather at the axon end.</div>
<div class="step">They release the chemical into the gap.</div>
<div class="step">It crosses and fits the receptors of the next neuron.</div>
<div class="step">A new impulse starts in the second neuron.</div>
</div>

<div class="problem" data-problem="c10s-ctrl-speed"></div>

### 1.3 Reflex action and the reflex arc

A **reflex action** is a sudden, automatic response to a stimulus, like pulling the hand from a flame, blinking when dust flies at the eye, sneezing, or a knee jerk when the doctor taps it. It happens without thinking, to save time, since the thinking route to the brain takes longer. The pathway is a **reflex arc**: receptor → sensory neuron → **spinal cord** (the relay) → motor neuron → effector (muscle). The spinal cord decides; the brain is told afterwards (that is when you feel the pain).

<figure class="fig" data-fig="c10-ctrl-reflex"><figcaption>Switch between a reflex and a voluntary action and slide the impulse speed. The signal is the orange dot. In the reflex it turns round at the spinal cord; in the voluntary action it goes up to the brain and down again, which adds distance and several more synapses. The total time is shown below.</figcaption></figure>

<div class="problem" data-problem="c10s-ctrl-reflex"></div>

<div class="myth">

**“Reflexes are controlled by the brain.”** The spinal cord controls most reflexes, with no help from the brain; that is why they are quick. Some reflexes, like the change in pupil size in bright light, do pass through the brain (the midbrain), but they are still involuntary.

</div>

Test your own reaction time, and see how it changes with practice and distraction:

<!--fig:tool reaction-time-test-->

There is more to try in the [Reaction time experiments](/science/reaction-time-experiments/).

### 1.4 Reaction time with a falling ruler

Ask a friend to hold a ruler vertically with its zero mark level with your open fingers. She drops it without warning, and you catch it as fast as you can. A freely falling ruler drops a distance d = ½gt². Read the mark at your fingers and you can work out how long you took:

```math
t = \sqrt{\frac{2d}{g}}
```

<figure class="fig" data-fig="c10-ctrl-ruler"><figcaption>Set the reaction time and press Drop. The ruler falls for exactly that long and you read the distance. A reaction time of 200 ms means the ruler falls about 20 cm; 250 ms gives about 31 cm. The curve shows how fast the distance grows: double the time, four times the distance.</figcaption></figure>

<div class="problem" data-problem="c10s-ctrl-ruler"></div>

<div class="problem" data-problem="c10s-ctrl-fall"></div>

### 1.5 The human brain

The brain is the main coordinating centre, inside the skull. It is protected by the **skull** (a hard box) and by a bag of **cerebrospinal fluid** inside layers of membranes (the meninges) that cushions it against shocks. It has three main parts.

- **Forebrain:** the **cerebrum** is the largest part. It is the seat of thinking, memory, speech, voluntary movement, and it receives all the senses (sight, hearing, touch, smell, taste). There are separate areas for each. Other parts: the **hypothalamus** controls hunger, thirst, body temperature and the pituitary gland.
- **Midbrain:** controls reflex movements of the eye (pupil size) and ear.
- **Hindbrain:** the **cerebellum** controls balance, posture and smooth, coordinated movement (riding a bicycle, threading a needle, a cricketer's batting stroke); the **pons** relays messages; the **medulla** controls the involuntary actions: heartbeat, breathing, blood pressure, swallowing, vomiting. The medulla continues into the **spinal cord**.

<figure class="fig" data-fig="c10-ctrl-brain"><figcaption>Choose a part of the brain to see where it is, what it does, and what goes wrong when it is damaged. The cerebellum is at the back below the cerebrum; the medulla joins the spinal cord.</figcaption></figure>

### 1.6 How does the nervous tissue make muscles move?

Muscle cells contain special proteins. When a nerve impulse arrives, the signal makes these proteins change shape and shorten the cell: the muscle **contracts**. Together, thousands of cells moving gives the movement of an arm or a leg. The brain, the spinal cord and their nerves together make the **nervous system**.

## 2. Coordination in plants

Plants do not have nerves or muscles, but they still respond to stimuli. There are two kinds of movement.

**Movement not dependent on growth.** The leaves of the "touch-me-not" plant (chhui-mui, *Mimosa pudica*) fold up and droop when touched. Pressure on the leaf sends a signal, and the cells at the base of the leaf quickly lose water and shrink, changing the shape of the cells and the leaf. No growth is involved, so it is fast. The signal moves from cell to cell by electrical and chemical means.

**Movement due to growth** is slow, and is a response to the direction of the stimulus. It is called a **tropism**: a **positive** tropism is toward the stimulus, a **negative** tropism is away from it.

- **Phototropism** (light): shoots bend toward light (positive); roots bend away from it (negative).
- **Geotropism** (gravity): roots grow down (positive); shoots grow up (negative).
- **Hydrotropism** (water): roots grow toward water (positive).
- **Chemotropism** (chemicals): a pollen tube grows toward the ovule, drawn by chemicals.
- **Thigmotropism** (touch): the tendrils of a pea or gourd coil around a support.

<figure class="fig" data-fig="c10-ctrl-tropism"><figcaption>Choose a response and drag the time slider. Pink dots are auxin. In phototropism, the auxin gathers on the shaded side of the shoot and makes those cells grow longer than the lit side, so the shoot curves toward the light. In geotropism the same hormone accumulates on the lower side but has opposite effects in the shoot (growth speeds up, so it bends up) and the root (growth slows, so it bends down).</figcaption></figure>

<div class="myth">

**“Plants move toward light because they see it.”** Plants have no eyes or brain. Light pushes the growth hormone auxin to the shaded side of the shoot; cells there grow longer, so the shoot curves. It is a purely chemical response.

</div>

### 2.1 Plant hormones

Plant hormones (growth regulators) are chemicals made in one place and sent to another, where they change growth in tiny amounts.

| Hormone | Where it works | What it does |
|---|---|---|
| **Auxin** | shoot tip | cells elongate; bending toward light |
| **Gibberellin** | stems, seeds | longer stems; seeds germinate |
| **Cytokinin** | fruits, seeds | cell division; keeps leaves green |
| **Abscisic acid** | leaves, seeds | stops growth; closes stomata; wilting; dormancy |
| **Ethylene** | fruits | ripening |

Auxin and gibberellin, cytokinin help growth; abscisic acid slows it down. They work together, and the balance decides what the plant does.

<figure class="fig" data-fig="c10-ctrl-planthorm"><figcaption>Pick a hormone and switch it from normal to high. Auxin and gibberellin lengthen the stem, cytokinin adds cells, abscisic acid closes the stomata and makes the leaves droop, and ethylene turns the green fruit orange.</figcaption></figure>

## 3. Hormones in animals

Some actions are controlled by chemical messengers called **hormones**, which are made by **endocrine glands** (ductless glands, with no tube) and carried by the blood to a **target organ**. They act in very small amounts and last longer than a nerve signal. Nerves are like a phone call, a fast message to one person; hormones are like a WhatsApp group message to everyone who is listening for it.

| Gland | Hormone | What it does |
|---|---|---|
| Pituitary | growth hormone | growth of body, bones |
| Thyroid | thyroxine | controls the use of carbohydrates, proteins and fats (needs iodine) |
| Pancreas | insulin | lowers blood sugar |
| Adrenal | adrenaline | emergency: faster heartbeat and breathing |
| Testes | testosterone | male changes at puberty |
| Ovaries | oestrogen | female changes at puberty |

<figure class="fig" data-fig="c10-ctrl-glands"><figcaption>Choose a gland to light it on the body. The hormone it releases and its job are shown, along with what goes wrong with too little or too much.</figcaption></figure>

- **Iodine and thyroxine.** Thyroxine needs iodine. If food has too little iodine, the thyroid swells (a **goitre**, a swelling in the neck). That is why salt is sold iodised, at about 15 mg iodine per kg in India.
- **Growth hormone.** Too little in childhood gives dwarfism; too much gives gigantism.
- **Adrenaline.** In a danger it speeds the heart and breathing and sends blood to muscles: fight or flight. Many people feel it before a match or exam.
- **Insulin.** Insulin lowers blood sugar. Too little insulin leads to **diabetes**, and the blood sugar remains high.
- **Puberty.** Testosterone and oestrogen bring the changes at puberty.

<div class="problem" data-problem="c10s-ctrl-iodine"></div>

### 3.1 Feedback: how the body knows when to stop

The release of a hormone is regulated by **feedback**. When blood sugar rises after a meal, the pancreas is signalled to release more insulin. Insulin lets cells and the liver take up sugar, so the level falls. When it falls, the signal that triggered insulin weakens, so less is released. The change in blood sugar is corrected, like a thermostat in an air conditioner that switches off when the room is cool. The same type of **feedback** controls growth hormone and other glands.

<figure class="fig" data-fig="c10-ctrl-feedback"><figcaption>Press <b>Eat a sweet meal</b>. In a healthy person the blue curve (blood glucose) rises, then the pink insulin bars appear and bring it back into the normal band. Switch the pancreas to no insulin and the same meal leaves the sugar high. Also see the same number in mg/dL and mmol/L.</figcaption></figure>

<div class="problem" data-problem="c10s-ctrl-glucose"></div>

<div class="history">

<ul class="timeline">
<li><b>1791</b> Luigi Galvani shows that electricity can make a frog's leg muscle twitch, the first hint that nerves are electrical.</li>
<li><b>1921</b> Frederick Banting and Charles Best, with John Macleod and James Collip, isolate insulin in Toronto. In 1922 it saves the life of a boy with diabetes.</li>
<li><b>1928</b> Frits Went shows that a chemical (auxin) from the tip of an oat shoot makes it bend.</li>
</ul>

</div>

<div class="keypoints">

- Receptors detect stimuli; neurons (dendrite, cell body, axon) carry electrical impulses one way; effectors (muscles, glands) respond. A synapse passes the signal by a chemical.
- Reflex arc: receptor → sensory neuron → spinal cord → motor neuron → effector. Quick and automatic.
- Brain: forebrain (cerebrum: thinking; hypothalamus), midbrain, hindbrain (cerebellum: balance; pons; medulla: involuntary actions). Protected by skull and fluid.
- Reaction time from a falling ruler: d = ½gt², so t = √(2d/g).
- Plants: touch-me-not leaves fold from changes in cell water; tropisms (photo-, geo-, hydro-, chemo-, thigmo-) are growth responses controlled by auxin.
- Plant hormones: auxin and gibberellin (growth), cytokinin (cell division), abscisic acid (inhibits), ethylene (ripening).
- Animal hormones from endocrine glands: thyroxine (iodine, goitre), growth hormone, insulin (diabetes), adrenaline, testosterone, oestrogen. Feedback keeps levels steady.

</div>
