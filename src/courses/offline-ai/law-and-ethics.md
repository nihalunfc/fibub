---
title: Licences, law and sector rules in four countries
seoTitle: 'AI licences, law and sector rules | Offline AI'
summary: A plain guide to the rules around running AI yourself in India, Canada, the USA and the UK. Model licences, who owns AI output, privacy laws, and the extra rules for health, finance and law. Not legal advice.
minutes: 25
updated: 2026-11-22
sources:
  - 'India: Digital Personal Data Protection Act 2023 and DPDP Rules 2025 (MeitY, official page), https://www.meity.gov.in/data-protection-framework'
  - 'India: Reserve Bank of India, FREE-AI framework report (responsible AI in finance), August 2025, https://www.rbi.org.in'
  - 'Canada: PIPEDA (Office of the Privacy Commissioner, official page), https://www.priv.gc.ca; Ontario PHIPA, https://www.ipc.on.ca'
  - 'Canada: OSFI Guideline E-23, Model Risk Management (official page), https://www.osfi-bsif.gc.ca'
  - 'USA: HIPAA Privacy Rule (HHS, official page), https://www.hhs.gov/hipaa'
  - 'USA: Copyright Office, "Copyright and Artificial Intelligence, Part 2: Copyrightability", January 2025, https://www.copyright.gov/ai/'
  - 'UK: UK GDPR and Data Protection Act 2018 (ICO, official page), https://ico.org.uk'
  - 'Licences: Apache License 2.0, https://www.apache.org/licenses/LICENSE-2.0; Llama community licences, https://www.llama.com'
quiz:
  - q: Does running a model locally remove your duties under privacy law?
    choices: ['No: you still handle personal data and must follow the law, but you avoid sending it to a third party', 'Yes, local data has no rules', 'Only in the UK']
    ans: 0
    why: Privacy laws apply to how you handle personal data anywhere. Local makes compliance easier, not optional.
  - q: You want to use a model in a product you sell. What do you check first?
    choices: ['The model''s licence: commercial use, limits and required notices', 'Its download speed', 'Its colour scheme']
    ans: 0
    why: Apache 2.0 and MIT allow commercial use with notices; some licences add limits or conditions.
  - q: According to the US Copyright Office's 2025 report, is text written entirely by AI protected by copyright?
    choices: ['Not on its own; human creative input is needed', 'Yes, fully', 'Only if it is long']
    ans: 0
    why: Protection depends on human authorship, such as meaningful selection, arrangement or editing.
---

**Module 17 · about 25 minutes · read first: 7.2.** You'll be able to spot the legal questions in a local AI project and know where to look. **This is general information, not legal advice:** for a real project, ask a lawyer or your organisation's privacy officer.

<div class="bigidea">Running AI locally makes many legal questions easier, because personal data stays with you, but the model's licence, who owns the output, privacy law and sector rules still apply.</div>

## 1. Why this matters

Local AI makes many legal worries smaller, because personal data stays with you. It does not make them disappear. Three things are true everywhere: the model has a licence, the output may or may not be yours, and some sectors have extra rules.

## 2. Model licences

A **licence** is the permission slip that comes with a model: what you may do with it and what you must do in return.

- **Apache 2.0 and MIT** (Gemma 4, gpt-oss, Qwen, DeepSeek and many others): use, change and sell; keep the licence notice.
- **Community or custom licences** (for example some Llama versions): usually free for most uses, with conditions such as a limit on very large companies, naming rules or an acceptable-use policy.
- **Research-only or non-commercial:** fine for learning, not for paid work.

Check the licence file on the model page every time, including for fine-tuned versions, which inherit their base model's terms (Lesson 7.2).

Try it: slide the style from honest to over-confident and watch the bars drop below the diagonal.

<figure class="fig" data-fig="@ai-calibration"><figcaption>A calibrated model's confidence can be trusted. An over-confident model sounds sure when it should not, which is how confident wrong answers, called hallucinations, appear.</figcaption></figure>

## 3. Who owns the output

In the USA, the Copyright Office said in 2025 that purely AI-generated material is not protected; human creative input (choosing, arranging, editing) can be. The UK has an unusual rule for "computer-generated works" with no human author, which is under review. India and Canada have no settled answer yet. Practical rule: if ownership matters, make sure a person does real creative work on the result and keep records.

Also: a model can reproduce text it was trained on. Do not publish output that looks like someone else's work without checking.

## 4. Privacy laws

| Country | Main law | What it means for local AI |
|---|---|---|
| **India** | Digital Personal Data Protection Act 2023, with rules notified in November 2025 and phased in | Consent and purpose limits, security safeguards, breach reporting. Local keeps data in your control. |
| **Canada** | PIPEDA federally; provincial laws such as Quebec's Law 25; health laws such as Ontario's PHIPA | Consent, safeguards, limits on sending data outside Canada for some bodies. Local avoids cross-border transfer. |
| **USA** | Sector laws (HIPAA for health, GLBA for finance) and state laws such as California's CCPA | Health data needs safeguards and agreements with any vendor; local means no vendor in the loop. |
| **UK** | UK GDPR and the Data Protection Act 2018 | Lawful basis, data minimisation, impact assessments for risky processing. Local simplifies the vendor part. |

One idea runs through all four: **data minimisation**. Use only the personal data the job needs, and keep it only as long as needed.

## 5. Sector rules

- **Health:** patient data has the strictest rules in all four countries (HIPAA, PHIPA, the UK's NHS data rules, India's DPDP). Local is a strong fit; still log access, encrypt disks and keep a human in charge of clinical decisions (Lesson 18.1).
- **Finance:** regulators expect you to manage model risk: test, document and monitor models. Examples: OSFI's Guideline E-23 in Canada (effective 2027), the RBI's FREE-AI framework in India, and existing model-risk and consumer-duty rules in the UK and USA (Lesson 18.3).
- **Law:** confidentiality duties to clients apply to any tool. Bar and law society guidance in all four countries says lawyers must understand the tools they use and protect client information (Lesson 18.2).

<div class="steps">
<div class="step"><p><b>Tell people.</b> An Ontario physiotherapy clinic wants AI-written visit summaries. First item: the clinic's privacy notice tells patients how AI is used.</p></div>
<div class="step"><p><b>Keep it in the building.</b> The model runs on a clinic machine with an encrypted disk. No vendor contract and no cross-border question: the two hardest items, gone.</p></div>
<div class="step"><p><b>Limit who sees what.</b> Each clinician has their own Open WebUI account, and chats are deleted after 90 days instead of being kept forever.</p></div>
<div class="step"><p><b>Keep a person in charge.</b> A clinician reviews and signs every summary. The model's licence (Apache 2.0 for Gemma 4) is recorded.</p></div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** minimise data: use only what the job needs, keep it only as long as needed.

**Equation:** risk ≈ amount of personal data × how sensitive × how many places it is copied.

**Analogy:** a doctor's waiting room. Only the people who need a file see it, and old files are shredded on time.

**Try it:** which lowers risk more: sending 1,000 full patient files to a cloud model, or sending 1,000 files with names removed to a local model? (The second: fewer identifiers and fewer copies.)
</details>

<div class="meaning">

<dl>
<dt>amount</dt><dd>how many records and how many personal details in each (names, dates of birth, notes)</dd>
<dt>sensitivity</dt><dd>how much harm a leak would do: health and children's data rank highest</dd>
<dt>copies</dt><dd>every place the data sits: the machine, backups, a vendor, chat history</dd>
<dt>Physical meaning</dt><dd>Risk is a pile you can make smaller from three sides: hold fewer details, avoid the most sensitive ones where you can, and keep fewer copies for less time. Local AI cuts the copies (no vendor); a short retention period cuts the amount.</dd>
</dl>

</div>

Retention is the easiest of the three to change:

<div class="problem" data-problem="law-and-ethics-retention"></div>

<div class="myth">

**"It runs on our own machine, so privacy law does not apply."** Privacy laws cover how you handle personal data anywhere, not just when you send it to a vendor. Local AI makes compliance easier (no cross-border transfer, no vendor contract), but you still need a lawful reason, security, limits on use and keeping, and a way to answer people's requests.

</div>

## 6. Worked example

*Made-up case.* An Ontario physiotherapy clinic wants AI-written visit summaries. The privacy officer's checklist: patients told in the clinic's privacy notice; model runs on a clinic machine with an encrypted disk; Open WebUI accounts per clinician; chats deleted after 90 days; a clinician reviews and signs every summary; Gemma 4 licence (Apache 2.0) recorded. Local removes the vendor contract and cross-border questions, which were the hardest items on the list.

## 7. Practice

1. Find the licence of the model you use and write down whether commercial use is allowed.
2. Which privacy law applies to your work?
3. Name one thing local AI does not change about your privacy duties.

<details>
<summary>Answers</summary>

1. On its model page, in the licence file or model card.
2. Your answer from the table, plus any sector law.
3. You still need a lawful reason, security, limits on use and keeping, and a way to answer people's requests about their data.
</details>

**New words:** *licence*, *data minimisation*, *model risk management*, *privacy impact assessment*.

<div class="keypoints">

- Check every model's licence: Apache 2.0 and MIT allow commercial use with a notice; others add conditions or forbid it.
- Purely AI-generated work may not be protected by copyright; real human creative work on it helps.
- Privacy laws in India, Canada, the USA and the UK still apply locally; local removes the vendor and cross-border parts.
- Health, finance and law add sector rules: access logs, model risk management, client confidentiality.
- Minimise data: fewer details, fewer copies, shorter retention. Not legal advice: ask a lawyer for a real project.

</div>
