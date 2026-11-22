---
title: Field work with no internet
summary: Farms, ships, mines, remote clinics, disaster zones and travellers often have no signal. How a laptop, phone or small box runs AI where the internet does not reach, and how to plan power and updates.
minutes: 20
updated: 2026-11-22
sources:
  - 'Gemma 4 model sizes, including E2B and E4B for phones and laptops (Google, official model page), https://ai.google.dev/gemma'
  - 'Lessons 4.6 (phones and tablets), 6.1 (watts) and 13.4 to 13.5 (speech and vision) of this course'
  - 'whisper.cpp (offline speech to text on laptops and phones), https://github.com/ggml-org/whisper.cpp'
  - 'Radford et al., "Robust Speech Recognition via Large-Scale Weak Supervision" (Whisper), 2022, https://arxiv.org/abs/2212.04356'
quiz:
  - q: What limits a field AI setup most often?
    choices: ['Power: batteries, solar or a generator', 'The colour of the case', 'The internet speed']
    ans: 0
    why: With no grid, every watt counts. Small models on efficient machines go furthest.
  - q: Which model size suits a phone or a laptop on battery in the field?
    choices: ['A small model such as Gemma 4 E2B or E4B', 'A 120B model', 'Any model, size does not matter']
    ans: 0
    why: Small models run on phones and sip power; large ones drain batteries in minutes.
  - q: How do you update a field device that never sees the internet?
    choices: ['Bring updates in on a laptop or USB drive during visits to town', 'You cannot ever update it', 'By radio']
    ans: 0
    why: 'Plan update trips: download models and documents where there is a connection, carry them out.'
---

**Module 18 · about 20 minutes · read first: 4.6, 6.1 and 9.6.** You'll be able to plan AI for places with no internet.

<div class="bigidea">Where the internet does not reach, a phone, laptop or small box keeps AI working, and the real limit becomes power: battery watt-hours divided by the watts the machine draws.</div>

## 1. Why this sector

A ship's engineer, a farm adviser in a valley, a geologist at a remote camp, a doctor in a disaster zone and a traveller on a long flight all share one thing: no reliable internet. Cloud AI simply stops there. A local model keeps working, as long as there is power.

## 2. Top uses

- **Manuals and procedures:** document search over equipment manuals and safety procedures (Module 12).
- **Speech:** dictating reports by voice when hands are busy (whisper.cpp, Lesson 13.4).
- **Photos:** describing crop disease, rock samples or damage for a report (vision models, Lesson 13.5), always confirmed by an expert later.
- **Translation** between workers and local people.
- **Reports:** turning notes into a clean daily report to send when a connection appears.

Step through the pipeline from a pile of text to a cited answer.

<figure class="fig" data-fig="@ai-rag-pipeline"><figcaption>Retrieval-augmented generation does not teach the model anything new: it finds the few relevant chunks, pastes them into the prompt, and asks the model to answer from them.</figcaption></figure>

## 3. Power planning

| Device | Typical draw while working | Model size |
|---|---|---|
| Phone or tablet | a few watts | Gemma 4 E2B or E4B |
| Efficient laptop or Mac | 20 to 40 W | up to 12B |
| Mini PC or Mac mini | 25 to 60 W | 12B to 27B |
| Desktop with a big graphics card | 300 W or more | Avoid off-grid |

A **watt-hour (Wh)** is an amount of stored energy: a 500 Wh battery could run a 500 W machine for one hour, or a 50 W machine for ten. A **portable power station** is a big rechargeable battery with ordinary plugs.

<div class="steps">
<div class="step"><p><b>The tank.</b> A field team carries a 500 Wh portable power station, charged before they leave.</p></div>
<div class="step"><p><b>The losses.</b> Turning battery power into mains power wastes some as heat, about 15%. Usable: 500 × 0.85 = <b>425 Wh</b>.</p></div>
<div class="step"><p><b>The tap.</b> Their laptop draws about 30 W while a 12B model works. Hours: 425 ÷ 30 ≈ <b>14 hours</b> of model use.</p></div>
<div class="step"><p><b>Plan the days.</b> At 3 hours of AI use a day, that is about 4.7 days. A phone running Gemma 4 E2B at a few watts would last weeks on the same battery.</p></div>
</div>

## 4. Updates

Plan an update kit: on a trip to a connected place, download new models, engine versions and updated documents to a drive; at the site, check checksums and install. Lesson 18.7's import steps work here too, simplified.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** battery energy ÷ power draw = hours of use.

**Equation:** hours = battery Wh × 0.85 (losses) ÷ watts.

**Analogy:** a water tank: the size of the tank over how fast the tap runs.

**Try it:** a 500 Wh power station, a 30 W laptop working? (500 × 0.85 ÷ 30 ≈ 14 hours of model use.)
</details>

```math
\text{hours} = \frac{E \times 0.85}{P}
```

<div class="meaning">

<dl>
<dt>E</dt><dd>battery energy in watt-hours (Wh), printed on the power station</dd>
<dt>0.85</dt><dd>the share that reaches the machine after conversion losses (about 15% is lost as heat)</dd>
<dt>P</dt><dd>the machine's power draw in watts while the model works</dd>
<dt>Physical meaning</dt><dd>Off-grid, every watt is borrowed from a tank you carried in. Halving the machine's draw doubles the hours, which is why small models on efficient machines go furthest, and why a 300 W desktop has no place in a field camp.</dd>
</dl>

</div>

<div class="problem" data-problem="field-work-battery"></div>

<div class="myth">

**"No internet means no AI."** Only cloud AI needs the internet. A model already on the device answers questions, reads manuals, transcribes speech and translates with no signal at all. The things to plan for are power and the update kit, not a connection.

</div>

## 5. Worked scenario

*Made-up crew.* A research vessel spends three weeks at sea with only an expensive satellite link for email. The crew runs a 12B model on a Mac mini (about 30 W) with the ship's manuals, safety procedures and a species guide loaded for search. Engineers ask about fault codes at 3 a.m.; scientists dictate log entries. The satellite link carries only the final daily report.

## 6. Practice

1. Choose a device and model for a week-long off-grid trip.
2. How many hours does a 300 Wh battery give a 40 W laptop?
3. What three things go into your update kit?

<details>
<summary>Answers</summary>

1. For example: a laptop with Gemma 4 E4B, plus a phone with E2B as backup.
2. 300 × 0.85 ÷ 40 ≈ 6.4 hours.
3. New model files with checksums, engine updates, updated documents and manuals.
</details>

**New words:** *off-grid*, *watt-hour (Wh)*, *power station*, *update kit*.

<div class="keypoints">

- A model on the device keeps working with no signal: manuals search, speech, photos, translation and reports.
- Off-grid, power is the limit: hours = battery Wh × 0.85 ÷ watts.
- Phones and efficient laptops with small models go furthest; avoid big graphics cards.
- Bring updates in on a drive during trips to town, and check checksums before installing.

</div>
