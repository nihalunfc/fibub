---
title: Finance and banking
summary: Analysts, banks and insurers use local AI to read reports, check documents and write code against data that may not leave the building. What works, what regulators expect, and a sensible setup.
minutes: 20
updated: 2026-11-19
sources:
  - 'Canada: OSFI Guideline E-23, Model Risk Management, final September 2025 (official page), https://www.osfi-bsif.gc.ca'
  - 'India: Reserve Bank of India, Framework for Responsible and Ethical Enablement of AI (FREE-AI), August 2025, https://www.rbi.org.in'
  - 'USA: Federal Reserve and OCC, SR 11-7 Guidance on Model Risk Management (official page), https://www.federalreserve.gov/supervisionreg/srletters/sr1107.htm'
  - 'UK: Financial Conduct Authority, AI update and Consumer Duty (official pages), https://www.fca.org.uk'
quiz:
  - q: What do finance regulators in all four countries expect for AI models used in decisions?
    choices: ['Model risk management: testing, documentation, monitoring and accountable people', 'Nothing', 'Only that the model is open source']
    ans: 0
    why: Rules such as OSFI E-23, SR 11-7 and the RBI's FREE-AI framework expect models to be governed like any other model.
  - q: Why do banks like that a local model "stays the same"?
    choices: ['A tested, documented model does not change under them, which helps validation', 'It is faster', 'It never makes mistakes']
    ans: 0
    why: Model validation is easier when the exact model file and settings are fixed and recorded.
  - q: Which task should never rest on a general language model alone?
    choices: ['Approving a loan', 'Summarising an annual report for an analyst', 'Drafting SQL for a data analyst to check']
    ans: 0
    why: Credit decisions affect customers and carry fairness and explanation duties; they need proper models and people.
---

**Module 18 · about 20 minutes · read first: 17.7.** You'll be able to plan local AI for an analyst team or a finance firm.

## 1. Why this sector

Banks, insurers and investment firms hold customer data and market-sensitive information under strict rules, often with policies that bar sending it to outside AI services. They also already know how to govern models. Local AI fits both facts.

## 2. Top uses

1. **Reading reports:** summarise annual reports, filings and research notes; pull out key figures with page references.
2. **Analyst coding help:** draft SQL and Python against internal data (Lesson 13.3), checked before running.
3. **Document checks:** know-your-customer files, loan documents and claims checked for missing items.
4. **Search across policies and procedures** with citations (Module 12).

## 3. What regulators expect

- **Canada:** OSFI's Guideline E-23 on model risk (effective 2027) covers AI models in federally regulated banks and insurers.
- **USA:** the long-standing SR 11-7 model risk guidance, plus fair-lending and consumer rules.
- **UK:** the FCA and PRA apply existing rules, including the Consumer Duty and model risk principles.
- **India:** the RBI's FREE-AI framework (2025) sets out responsible AI expectations for regulated entities.

In practice: an inventory of models, testing before use, documented limits, monitoring, and named owners. A local model file with a fixed version is easy to inventory.

## 4. A sensible setup

A server with a strong card (Lesson 5.5) inside the firm's network, a serving engine (Lesson 15.2), access through existing logins, logs kept per policy, and a model record: file name, hash, licence, tests, owner.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** you can only validate what you can pin down.

**Equation:** a model record = file + checksum + settings + test results + owner + review date.

**Analogy:** a laboratory instrument with a calibration certificate.

**Try it:** what changes would make you re-test? (A new model file, a new quant, new settings or a new system prompt.)
</details>

## 5. Worked scenario

*Made-up team.* A credit research team of 10 at a Mumbai bank reads 300 company filings a quarter. A local model on the bank's server extracts 25 fields from each filing with page references; analysts check the flagged ones. Reading time per filing falls from 50 to 20 minutes, and the model record satisfies the bank's model risk team.

## 6. Practice

1. Write a model record for the model you use.
2. Why is a page reference important in finance extraction?
3. Name one finance task to keep away from AI decisions.

<details>
<summary>Answers</summary>

1. File name, checksum (`sha256sum` or `certutil -hashfile`), quant, settings, prompt, tests, owner, review date.
2. Analysts can check each figure quickly against the source.
3. Credit, claims or fraud decisions about a customer, unless built and governed as proper models.
</details>

**New words:** *model risk management*, *model inventory*, *checksum*, *validation*.
