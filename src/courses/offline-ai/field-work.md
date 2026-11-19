---
title: Field work with no internet
summary: Farms, ships, mines, remote clinics, disaster zones and travellers often have no signal. How a laptop, phone or small box runs AI where the internet does not reach, and how to plan power and updates.
minutes: 20
updated: 2026-11-19
sources:
  - 'Gemma 4 model sizes, including E2B and E4B for phones and laptops (Google, official model page), https://ai.google.dev/gemma'
  - 'Lessons 4.6 (phones and tablets), 6.1 (watts) and 13.4 to 13.5 (speech and vision) of this course'
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

## 1. Why this sector

A ship's engineer, a farm adviser in a valley, a geologist at a remote camp, a doctor in a disaster zone and a traveller on a long flight all share one thing: no reliable internet. Cloud AI simply stops there. A local model keeps working, as long as there is power.

## 2. Top uses

- **Manuals and procedures:** document search over equipment manuals and safety procedures (Module 12).
- **Speech:** dictating reports by voice when hands are busy (whisper.cpp, Lesson 13.4).
- **Photos:** describing crop disease, rock samples or damage for a report (vision models, Lesson 13.5), always confirmed by an expert later.
- **Translation** between workers and local people.
- **Reports:** turning notes into a clean daily report to send when a connection appears.

## 3. Power planning

| Device | Typical draw while working | Model size |
|---|---|---|
| Phone or tablet | a few watts | Gemma 4 E2B or E4B |
| Efficient laptop or Mac | 20 to 40 W | up to 12B |
| Mini PC or Mac mini | 25 to 60 W | 12B to 27B |
| Desktop with a big graphics card | 300 W or more | Avoid off-grid |

## 4. Updates

Plan an update kit: on a trip to a connected place, download new models, engine versions and updated documents to a drive; at the site, check checksums and install. Lesson 18.7's import steps work here too, simplified.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** battery energy ÷ power draw = hours of use.

**Equation:** hours = battery Wh × 0.85 (losses) ÷ watts.

**Analogy:** a water tank: the size of the tank over how fast the tap runs.

**Try it:** a 500 Wh power station, a 30 W laptop working? (500 × 0.85 ÷ 30 ≈ 14 hours of model use.)
</details>

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
