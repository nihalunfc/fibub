---
title: Healthcare and clinics
summary: How clinics, hospitals and health researchers use local AI for notes, letters and document search while patient data stays on their own machines, and the rules that apply in India, Canada, the USA and the UK.
minutes: 20
updated: 2026-11-19
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

## 1. Why this sector

Health workers spend hours on paperwork, and patient data is among the most protected information in every country. Cloud AI needs contracts, vendor checks and often data-location rules. A local model avoids most of that, which is why clinics are among the keenest users.

## 2. Top uses

1. **Visit notes to summaries:** turn typed or dictated notes (whisper.cpp, Lesson 13.4) into a structured summary for the chart.
2. **Letters:** referral letters, discharge summaries and patient-friendly explanations, drafted for the clinician to edit.
3. **Policy and guideline search:** ask questions of the clinic's own protocols with document search (Module 12), with citations.
4. **Coding help:** suggest billing or diagnosis codes for a person to confirm.

## 3. Rules to respect

- **USA:** HIPAA. With local AI there is no outside vendor handling the data, but the Security Rule still applies: access control, audit logs, encryption.
- **Canada:** provincial health privacy laws (Ontario's PHIPA, others similar), plus professional college guidance.
- **UK:** UK GDPR special-category data, NHS data security standards and Caldicott principles.
- **India:** DPDP Act duties on personal data, plus clinical establishment rules.
- **Everywhere:** software that diagnoses or recommends treatment can be a regulated medical device. Keep AI to drafting and search, with a clinician deciding.

## 4. A sensible setup

A 32 to 64 GB Mac mini or a desktop with a 16 to 24 GB card in a locked room; a 12B to 27B model; Open WebUI with an account per clinician; disk encryption; chat history kept 30 to 90 days; no internet tools switched on. Cost: Lesson 16.3.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** time saved must outweigh time checking.

**Equation:** net minutes saved per note = minutes to write by hand − minutes to review the draft.

**Analogy:** a scribe who writes fast but needs every page signed.

**Try it:** 8 minutes by hand, 3 minutes to review an AI draft, 25 notes a day? ((8 − 3) × 25 = 125 minutes a day.)
</details>

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
