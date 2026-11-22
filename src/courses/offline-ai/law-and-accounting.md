---
title: Law and accounting
summary: Law firms and accountants handle confidential documents all day. How they use local AI for drafting, review and search without sending client files out, and the professional duties that come with it.
minutes: 20
updated: 2026-11-22
sources:
  - 'American Bar Association, Formal Opinion 512 on generative AI tools, July 2024 (official page), https://www.americanbar.org'
  - 'The Law Society (England and Wales), generative AI guidance (official page), https://www.lawsociety.org.uk'
  - 'Law Society of Ontario, generative AI guidance for licensees (official page), https://lso.ca'
  - 'Bar Council of India (official page), https://www.barcouncilofindia.org'
quiz:
  - q: What duty makes local AI attractive to lawyers and accountants?
    choices: ['Confidentiality of client information', 'A duty to type fast', 'A duty to use the newest tools']
    ans: 0
    why: Professional rules require protecting client information; keeping files on the firm's machine helps.
  - q: A local model drafts a case citation. What must the lawyer do?
    choices: ['Check that the case exists and says what the draft claims', 'File it as is', 'Ask the model if it is sure']
    ans: 0
    why: Courts have sanctioned lawyers for made-up AI citations. Every citation needs checking against the source.
  - q: Which job suits local AI best in an accounting firm?
    choices: ['Pulling figures and clauses out of client documents for a person to check', 'Signing an audit opinion', 'Filing tax returns without review']
    ans: 0
    why: Extraction and drafting save time; professional judgment and sign-off stay with people.
---

**Module 18 · about 20 minutes · read first: 17.6 and 17.7.** You'll be able to plan local AI for a law or accounting practice.

<div class="bigidea">Law and accounting firms use local models to draft, review and search client files without handing them to an outside company, with each client's files kept apart and every citation and figure checked by a qualified person.</div>

## 1. Why this sector

Contracts, case files, tax records and audit papers are confidential. Professional bodies in all four countries expect members to protect them and to understand any tool they use. Local AI gives the time savings without handing client files to an outside company.

## 2. Top uses

1. **Document review:** summarise contracts, flag unusual clauses, compare two versions.
2. **Drafting:** first drafts of letters, memos and standard agreements from the firm's own templates.
3. **Search across the firm's files:** "which leases have a break clause after year 3?" with citations (Module 12).
4. **Extraction:** pull figures from invoices, bank statements and returns into a spreadsheet (Lesson 11.3).

## 3. Duties to respect

- **Confidentiality and competence:** bar and law society guidance (for example ABA Formal Opinion 512 in the USA, the Law Society of England and Wales, the Law Society of Ontario) says lawyers must protect client data and understand the tools' limits. Accounting bodies say the same about client records.
- **Supervision:** AI output is like a junior's draft: a qualified person reviews it.
- **Made-up citations:** courts in several countries have sanctioned lawyers for filing AI-invented cases. Check every authority.
- **Client consent:** some firms tell clients how AI is used; some clients' contracts require it.

## 4. A sensible setup

An office server (Lesson 5.5) with a 27B model or larger, Open WebUI with separate document collections per client or **matter** (one client case), so one client's files never answer another's question, logs of who asked what, and a written AI policy.

<div class="steps">
<div class="step"><p><b>One big drawer.</b> A firm puts 200 clients' files into one shared search index. A lawyer asks: "What is the notice period in the lease?"</p></div>
<div class="step"><p><b>The wrong client answers.</b> Leases use similar wording, so the closest passage the search finds comes from another client's lease. The draft now quotes a confidential document from the wrong file.</p></div>
<div class="step"><p><b>One cabinet per matter.</b> Each matter gets its own collection. The same question searches only this client's files, so another client's text cannot come back at all.</p></div>
<div class="step"><p><b>Check before it leaves.</b> The draft cites a case. The lawyer looks it up in the official source to confirm it exists and says what the draft claims, then signs.</p></div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** separate collections stop cross-client leaks.

**Equation:** chance a search returns another client's text = 0 when each matter has its own index.

**Analogy:** separate filing cabinets per client, not one big drawer.

**Try it:** one shared index of 200 clients' files, or 200 indexes? Which can leak across clients? (Only the shared one.)
</details>

<div class="meaning">

<dl>
<dt>collection (index)</dt><dd>the set of documents one search looks through</dd>
<dt>matter</dt><dd>one client case or engagement, with its own files</dd>
<dt>one index per matter</dt><dd>a search for this matter can only ever find this matter's text</dd>
<dt>Physical meaning</dt><dd>Confidentiality is built into the filing, not left to the model's good behaviour. A model cannot leak a document it was never shown, so separate cabinets make a cross-client leak impossible instead of merely unlikely.</dd>
</dl>

</div>

The time saved is easy to measure in tax season:

<div class="problem" data-problem="law-and-accounting-season"></div>

<div class="myth">

**"The model gave a full citation with a case name and year, so the case must exist."** Language models write what citations look like, and can invent convincing ones. Courts have sanctioned lawyers for filing them. Every authority and every figure is checked against the original source before it leaves the firm.

</div>

## 5. Worked scenario

*Made-up firm.* A 12-person accounting practice in Mississauga uses a local model to pull totals from scanned bank statements during tax season. Staff check each extraction against the statement. Review time per client drops from 40 to 15 minutes, and no client document leaves the office server.

## 6. Practice

1. Write one rule for your firm's AI policy about citations or figures.
2. Why separate document collections by client?
3. Which professional body's guidance applies to you?

<details>
<summary>Answers</summary>

1. For example: "Every case citation and every figure from AI is checked against the original before it leaves the firm."
2. So a search for one client can never return another client's confidential text.
3. Your bar, law society or accounting body; check its website for AI guidance.
</details>

**New words:** *confidentiality*, *matter* (one client case), *extraction*, *supervision*.

<div class="keypoints">

- Good uses: contract review, drafting from the firm's templates, search across files with citations, and pulling figures out of documents.
- Professional duties of confidentiality, competence and supervision apply to any AI tool.
- Give each client or matter its own document collection so one client's text can never answer another's question.
- Check every citation and figure against the source: models can invent convincing cases.

</div>
