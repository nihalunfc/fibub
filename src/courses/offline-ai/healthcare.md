---
title: Healthcare and clinics
summary: How clinics, hospitals and health researchers use local AI for notes, letters and document search while patient data stays on their own machines, and the rules that apply in India, Canada, the USA and the UK.
minutes: 20
updated: 2026-11-22
sources:
  - 'USA: HIPAA Privacy and Security Rules (HHS, official page), https://www.hhs.gov/hipaa'
  - 'Canada: Ontario Personal Health Information Protection Act (IPC Ontario, official page), https://www.ipc.on.ca'
  - 'UK: NHS England guidance on AI and digital technology, and the ICO on health data (official pages), https://www.england.nhs.uk and https://ico.org.uk'
  - 'India: Digital Personal Data Protection Act 2023 (MeitY, official page), https://www.meity.gov.in/data-protection-framework'
quiz:
  - q: Who is responsible for a clinical summary written with a local AI?
    choices: ['The clinician who reviews and signs it', 'The model', 'The software maker']
    ans: 0
    why: AI drafts; the clinician checks and owns the record.
  - q: Why is local AI a strong fit for patient notes?
    choices: ['Patient data stays on the clinic''s machine, with no outside vendor to vet', 'It is always more accurate', 'It needs no checking']
    ans: 0
    why: Keeping data in-house removes the hardest privacy questions. Accuracy still needs checking.
  - q: Which use is NOT suitable for a general local model?
    choices: ['Deciding a diagnosis or dose on its own', 'Drafting a referral letter from notes', 'Searching clinic policies']
    ans: 0
    why: Decisions about diagnosis and treatment need a clinician; in many places such software is also a regulated medical device.
---

**Module 18 · about 20 minutes · read first: 17.6 and 17.7.** You'll be able to plan a local AI setup for a clinic that respects patient privacy.

<div class="bigidea">In a clinic, a local model drafts notes, letters and answers from policies while patient data stays in the building, and a clinician checks, decides and signs every time.</div>

## 1. Why this sector

Health workers spend hours on paperwork, and patient data is among the most protected information in every country. Cloud AI needs contracts, vendor checks and often rules about where data is stored. A local model avoids most of that, which is why clinics are among the keenest users.

## 2. Top uses

1. **Visit notes to summaries:** turn typed or dictated notes (whisper.cpp, Lesson 13.4) into a structured summary for the chart.
2. **Letters:** referral letters, discharge summaries and patient-friendly explanations, drafted for the clinician to edit.
3. **Policy and guideline search:** ask questions of the clinic's own protocols with document search (Module 12), with citations.
4. **Coding help:** suggest billing or diagnosis codes for a person to confirm.

The model is like a fast scribe: it writes the first draft, but every page needs the doctor's signature.

<div class="steps" data-fig="healthcare-note">
<div class="step"><p><b>By hand.</b> A doctor types a visit note in about <b>8 minutes</b>.</p></div>
<div class="step"><p><b>Draft, then check.</b> The doctor dictates; the local model drafts the note in the clinic's template in about 30 seconds of machine time, while the doctor sees the next patient. Reading and correcting it takes about <b>3 minutes</b>.</p></div>
<div class="step"><p><b>Over a day.</b> 25 notes × 5 minutes saved = <b>125 minutes</b>, about two hours a day per doctor.</p></div>
<div class="step"><p><b>Over a week.</b> Five days: about <b>10 hours</b> per doctor, with no patient data leaving the building.</p></div>
</div>

## 3. Rules to respect

- **USA:** HIPAA. With local AI there is no outside vendor handling the data, but the Security Rule still applies: access control, audit logs, encryption.
- **Canada:** provincial health privacy laws (Ontario's PHIPA, others similar), plus professional college guidance.
- **UK:** UK GDPR special-category data, NHS data security standards and Caldicott principles.
- **India:** DPDP Act duties on personal data, plus clinical establishment rules.
- **Everywhere:** software that diagnoses or recommends treatment can be a regulated **medical device**. Keep AI to drafting and search, with a clinician deciding.

## 4. A sensible setup

A 32 to 64 GB Mac mini or a desktop with a 16 to 24 GB card in a locked room; a 12B to 27B model; Open WebUI with an account per clinician; disk encryption; chat history kept 30 to 90 days; no internet tools switched on. An **audit log** records who asked what and when. Cost: Lesson 16.3.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** time saved must outweigh time checking.

**Equation:** net minutes saved per note = minutes to write by hand − minutes to review the draft.

**Analogy:** a scribe who writes fast but needs every page signed.

**Try it:** 8 minutes by hand, 3 minutes to review an AI draft, 25 notes a day? ((8 − 3) × 25 = 125 minutes a day.)
</details>

<div class="meaning">

<dl>
<dt>minutes by hand</dt><dd>how long a clinician takes to write the note or letter alone</dd>
<dt>minutes to review</dt><dd>how long a careful check and correction of the AI draft takes; never zero</dd>
<dt>net minutes saved</dt><dd>the difference, multiplied by notes a day and clinicians</dd>
<dt>Physical meaning</dt><dd>The model moves the clinician's work from typing to checking. The saving is real only while checking stays faster than writing; if a model's drafts need heavy fixing, the saving shrinks to nothing, which is why you measure it on real notes.</dd>
</dl>

</div>

<div class="problem" data-problem="healthcare-minutes-saved"></div>

<div class="myth">

**"If the model is private, it can make the diagnosis."** Privacy and safety are different questions. A local model keeps data in the building, but it can still be wrong, and software that diagnoses or sets doses can be a regulated medical device. The AI drafts; the clinician decides and signs.

</div>

## 5. Worked scenario

*Made-up clinic.* A four-doctor family practice in Kochi dictates notes into whisper.cpp on a Mac mini, and a local 27B model drafts the summary in the clinic's template. Doctors edit and sign. They save about 90 minutes a day each; no patient data leaves the building, and the clinic's privacy notice says so.

## 6. Practice

1. Pick one health task and write the "AI drafts, person decides" line for it.
2. Which internet-using tools should be off on a clinic machine?
3. Why keep chat history for a limited time?

<details>
<summary>Answers</summary>

1. For example: "AI drafts the referral letter from the notes; the doctor checks every fact and signs."
2. All of them: web search, cloud sync, any plug-in that calls out.
3. Less stored health data means less to protect and less harm if something goes wrong.
</details>

**New words:** *clinical summary*, *medical device software*, *audit log*.

<div class="keypoints">

- Good clinic uses: visit summaries, letters, policy search with citations and code suggestions, all checked by a clinician.
- Local removes the outside vendor, but health privacy law (HIPAA, PHIPA, UK GDPR, DPDP) still needs access control, logs and encryption.
- Software that diagnoses or sets treatment can be a regulated medical device: keep AI to drafting and search.
- Net time saved = (minutes by hand − minutes to review) × notes; measure it on real notes.

</div>
