---
title: Cleaning with Claude Code and open models
summary: 'Use an AI coding assistant without losing control, and turn invoices and free text into validated rows with a schema, checks and a cost-aware cascade.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: The AI assistant changes a test so that its new code passes. What should you do?
    choices: ['Accept it; the tests are green', 'Reject the change and ask why the original test fails', 'Delete the test']
    ans: 1
    why: Tests are the contract. Changing them to pass hides a bug.
  - q: An extracted invoice's lines do not add up to its total. What is the best action?
    choices: ['Load it anyway', 'Overwrite the total with the sum of the lines', 'Send it to the next tier (a bigger model or a person) and log it']
    ans: 2
    why: Validation failures move up the cascade. They never pass silently.
  - q: When is a local open model a better choice than a hosted frontier model?
    choices: ['High volume, a simple schema, and data that must not leave your machines', 'Complex layouts where accuracy is critical and volume is tiny', 'Always']
    ans: 0
    why: Match the tool to volume, difficulty and privacy.
sources:
  - 'Anthropic: Claude Code documentation (docs.anthropic.com)'
  - 'Pydantic documentation: JSON Schema and validation https://docs.pydantic.dev/'
  - 'Ollama documentation and model library https://ollama.com/'
  - 'Agresti, A. and Coull, B. A. (1998), Approximate Is Better than "Exact" for Interval Estimation of Binomial Proportions, The American Statistician 52(2), 119-126 https://doi.org/10.1080/00031305.1998.10480550'
---

**Module 2 · about 40 minutes · read first: 2.1, 2.3.** You'll be able to run a safe loop with an AI coding assistant for data work, write a project rules file, extract invoices and free text into validated rows with a JSON schema, and design a cascade that sends each document to the cheapest tool that can handle it.

<div class="bigidea">An AI model is a fast, clever intern: let it draft the code and read the messy paperwork, but give it written rules, check every answer against a test or a total, and keep the final say yourself.</div>

## 1. Why this matters

Done well, AI-assisted cleaning turns a day of parsing work into an hour. Done badly, it produces plausible code that quietly drops rows. The difference is a **workflow**: the AI proposes, tests prove, you decide.

## 2. A safe loop for data work

1. **Context first.** Put a rules file in the repository (Claude Code reads `CLAUDE.md`): what the project is, where the raw data lives, and the hard rules.
2. **Ask for a plan, not code.** "Read `docs/profiles/qsr_pos.md` and `clean/rules.py`. Propose how to handle re-sent till batches. Do not write code yet."
3. **Tests before code.** "Write failing tests for the duplicate rule, using the examples in the profile."
4. **Write code until the tests pass**, then ask it to explain any line you do not understand.
5. **Evidence.** Row counts before and after every step, saved with the query that produced them.
6. **Review the diff yourself.** Reject anything that changes a test to make it pass.

```markdown
<!-- CLAUDE.md (excerpt) -->
## Rules
- data/raw/ is read-only. Never write, move or delete there.
- Every cleaning rule lives in clean/rules.py with a docstring (source, why, date confirmed) and a test.
- Report row counts in and out for every transform. Dropped rows go to data/rejects/ with a reason column.
- Never print values from columns named *email*, *phone* or *card*. Mask them in output.
- Propose schema changes; do not apply them.
```

When you repeat a task (profiling a new source, say), turn it into a short written procedure the assistant can follow every time: the Lesson 2.1 checklist, the severity table and the test-first loop. Keep such procedures short and step by step.

## 3. Models for unstructured data

Some sources are not tables: supplier invoices as PDFs, guest reviews, free-text delivery notes. A language model can turn them into rows when you give it a **schema** (the exact fields and types you want) and **validate the output**.

```python
from typing import Literal
from pydantic import BaseModel, Field

class InvoiceLine(BaseModel):
    sku: str | None
    description: str
    qty: float = Field(gt=0)
    unit_price: float = Field(ge=0)

class Invoice(BaseModel):
    supplier: str
    invoice_no: str
    invoice_date: str = Field(description="ISO date YYYY-MM-DD")
    currency: Literal["CAD", "USD"]
    lines: list[InvoiceLine]
    total: float

# Local and free: Ollama with structured output
import ollama
resp = ollama.chat(model="qwen2.5:7b", format=Invoice.model_json_schema(),
                   messages=[{"role": "user", "content": f"Extract this invoice as JSON.\n\n{pdf_text}"}],
                   options={"temperature": 0})
inv = Invoice.model_validate_json(resp.message.content)
assert abs(sum(l.qty * l.unit_price for l in inv.lines) - inv.total) < 0.05, "lines do not add up to the total"
```

The same pattern works with a hosted model's API (structured output or tool use) when accuracy matters more than cost. Get the PDF text with `pdfplumber` or `pymupdf` first; send page images only when the layout matters. Model names change quickly, so check the Ollama library for what is current and fits your machine. The [Offline AI course](/learn/courses/offline-ai/) covers running models locally in depth.

Watch one invoice go through the checks:

<div class="steps">
<div class="step"><b>Text in.</b> <code>pdfplumber</code> pulls the text from a supplier's PDF: three lines of produce and a total of $412.80.</div>
<div class="step"><b>Model out.</b> The local model returns JSON in the Invoice schema. Pydantic checks every field: the date is a string, the currency is CAD, every quantity is above zero. Pass.</div>
<div class="step"><b>The money check.</b> 12 × $18.40 + 6 × $22.50 + 4 × $5.60 = $378.20, not $412.80. The model misread one line. Fail.</div>
<div class="step"><b>Escalate.</b> The invoice goes to the next tier, a hosted model, which reads the second line as 6 × $28.25 = $169.50. Now 220.80 + 169.50 + 22.40 = $412.70, still 10 cents short of the total.</div>
<div class="step"><b>A person decides.</b> Still not within 5 cents, so it goes to the review queue. A clerk sees the PDF shows a $0.10 rounding line the models ignored, fixes the row, and the log records which tier handled it and what it cost.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** never trust a single extraction; trust a **checked** one. Checks inside the document (lines add up to the total) catch most errors for free.

**Equation:** accept only if

```math
\Big|\sum_i q_i p_i - T\Big| < \varepsilon
```

and every field passes the schema. To measure accuracy, label a sample of `$n$` documents by hand: if `$k$` are right, `$\hat a = k/n$`, with a rough 95% range of `$\hat a \pm 1.96\sqrt{\hat a(1-\hat a)/n}$`.

**Analogy:** an accountant's ledger must balance; if it does not, something was entered wrong. Where it breaks: a model can misread *both* a line and the total in the same way, so the check passes. Keep a hand-checked sample.

**Try it:** 47 of 50 sampled invoices are correct. Rough 95% range? *(0.94 ± 0.066, about 87% to 100%. Label more before promising "95% accurate". The [Statistics course](/learn/courses/statistics/) explains these ranges.)*
</details>

## 4. Choosing the model: a cascade

| Option | Cost | Privacy | Good for |
|---|---|---|---|
| Rules and regular expressions | Free | Local | Fixed layouts. Always try first |
| Local open model (through Ollama) | Free after the hardware | Data never leaves | High volume, simple schemas, private data |
| Hosted frontier model | Per token | Check the data agreement | Messy layouts and reasoning; low volume, high value |
| A person | Per hour | Local | Whatever still fails |

The professional move is a **cascade**: rules first, a small local model for what rules miss, a hosted model only for what fails validation, and a person for what still fails. Log which tier handled each document and what it cost. That table is how you justify the approach to a finance manager.

<div class="problem" data-problem="cleaning-with-ai-cascade"></div>

<div class="meaning">

<dl>
<dt>Rules file</dt><dd>A short file in the repository that tells the AI assistant the project's hard rules.</dd>
<dt>Schema</dt><dd>The exact fields and types an extraction must return. Anything else is rejected.</dd>
<dt>Validation</dt><dd>Checking the output against the schema and against facts inside the document (lines add up to the total).</dd>
<dt>Cascade</dt><dd>Sending each document to the cheapest tier first, and only failures up to dearer tiers.</dd>
<dt>Physical meaning</dt><dd>A grocery chain gets a few thousand supplier invoices a month in a dozen layouts. A cascade means most never touch a paid model, the hard few get the best one, and a clerk sees only the handful that nothing could read. The cost per invoice, the share handled by each tier and the measured accuracy go in one small table, and that table, not a demo, is what gets the project approved.</dd>
</dl>

</div>

<div class="myth">

**"The AI wrote it and the tests are green, so it is right."** Green only means the tests that exist pass. Check whether the assistant changed or deleted a test, whether row counts in and out still match, and whether you can explain each line. And never paste real customer data or passwords into a chat window: use an approved API with a data-processing agreement, or a local model. The course data is synthetic, so practise freely.

</div>

## 5. Try it

1. Write `CLAUDE.md` for `qsr-clean` with the rules above. Run the six-step loop to build **removal of re-sent till batches**. Save your prompts in `docs/ai-log.md`, with what you accepted and rejected.
2. Make 10 fake supplier invoices: ask your assistant to write `make_invoices.py`, which draws random invoices to PDF with `reportlab` in a few different layouts and saves the true values in a JSON answer key.
3. Install Ollama, pull a small model (pick one that fits your memory), and extract all 10 with the code above.
4. Score against the answer key: accuracy per field, and how many documents pass the total check. Put the table in the README.
5. Stretch: add a tier that sends failures to a hosted model's API, and log the cost per document.

Commit: `feat(clean): LLM invoice extraction with schema validation and scored accuracy`.

**What to check:** your score table counts every one of the 10 invoices exactly once, as passed, escalated or failed, and `docs/ai-log.md` shows at least one suggestion you rejected and why.

## 6. Practice

1. Why ask for a plan before code?
2. The model returns `"qty": "twelve"`. What catches it?
3. 400 invoices a month, all in one fixed layout from one supplier. Which tier?

<details>
<summary>Answers</summary>

1. You can catch a wrong approach (dropping rows instead of quarantining them, say) before any code exists, which is cheaper than reviewing a big diff.
2. The schema: Pydantic rejects a string where a number is required, so the document fails validation and moves up the cascade.
3. Rules. A fixed layout is exactly what regular expressions or a table parser handle for free; keep a model only as the fallback.
</details>

**New words:** *rules file*, *schema*, *structured output*, *validation*, *cascade*, *local model*, *hosted model*.

<div class="keypoints">

- Let the AI propose and the tests prove: plan first, tests before code, evidence for every step, and review the diff yourself.
- Never accept a change that edits a test to make it pass.
- Extract unstructured documents into a strict schema, and validate with checks inside the document.
- Use a cascade (rules, local model, hosted model, person) and log the tier and cost of every document.

</div>
