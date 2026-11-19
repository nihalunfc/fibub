---
title: 'Hybrid: local first, cloud for the hardest jobs'
seoTitle: 'Hybrid AI: local first, cloud when needed | Offline AI'
summary: Most teams end up with both. Write clear rules for what stays local and what may go to the cloud, and a few lines of Python that apply them every time.
minutes: 25
updated: 2026-11-19
sources:
  - 'OpenAI-compatible endpoints: Ollama (official page), https://docs.ollama.com/openai'
  - 'Anthropic Claude API documentation: OpenAI SDK compatibility (official page), https://platform.claude.com/docs'
quiz:
  - q: What should decide whether a job may go to the cloud?
    choices: ['What the data is and what the job needs, written as clear rules', 'Whoever is in a hurry', 'Random choice']
    ans: 0
    why: Data rules come first (may it leave?), then need (does local do it well enough?).
  - q: The router finds a patient name in a request marked "needs the best model". Where should it go?
    choices: ['Local, because private data rules win', 'Cloud, because quality matters', 'Both']
    ans: 0
    why: Privacy rules override quality wishes. Remove the private details first if the cloud is truly needed.
  - q: Why log which jobs went to the cloud?
    choices: ['To check the rules are followed and to know the cloud bill', 'To slow things down', 'There is no reason']
    ans: 0
    why: The log shows cost and lets you prove that private data stayed home.
---

**Module 15 · about 25 minutes · read first: 11.4.** You'll be able to send each job to the right place automatically, with private data never leaving.

## 1. Why this matters

Local models are private, free per use and always there. The biggest cloud models are still stronger on the hardest work (Lesson 17.1). Choosing by hand each time is slow and error-prone: someone in a hurry will paste a client file into a cloud chat. A simple router that applies written rules fixes both problems.

## 2. Write the rules first

A good hybrid policy fits on one page:

1. **Data that must stay:** for example patient details, client files, salaries, ID numbers, anything under a contract that says so. Always local.
2. **Jobs local does well:** summaries, drafts, classification, document search, coding help on your own code. Local by default.
3. **Jobs that may go to the cloud:** very hard reasoning, very long documents, the newest knowledge, when the data is allowed to leave.
4. **Cleaning before sending:** remove names and numbers when a job needs the cloud but the text has details it does not need.
5. **Money limit:** a monthly cloud budget, with a spending cap set in the provider's dashboard.

## 3. A router in a few lines

This builds on the three settings from Lesson 11.4: one set for local, one for the cloud.

```python
import os
from openai import OpenAI

PRIVATE_WORDS = ("patient", "diagnosis", "salary", "passport", "account number", "social insurance", "aadhaar")

def choose(text: str, needs_best: bool = False) -> str:
    """Return 'local' or 'cloud' by the written rules."""
    t = text.lower()
    if any(w in t for w in PRIVATE_WORDS):
        return "local"              # rule 1: private data never leaves
    if needs_best and os.getenv("CLOUD_API_KEY"):
        return "cloud"              # rule 3: hard job, data allowed to leave
    return "local"                  # rule 2: everything else

def client_for(where: str):
    if where == "cloud":
        return OpenAI(base_url=os.environ["CLOUD_BASE_URL"], api_key=os.environ["CLOUD_API_KEY"]), os.environ["CLOUD_MODEL"]
    return OpenAI(base_url="http://localhost:11434/v1", api_key="local"), os.getenv("LOCAL_MODEL", "gemma4:12b")

def ask(text: str, needs_best: bool = False) -> str:
    where = choose(text, needs_best)
    client, model = client_for(where)
    reply = client.chat.completions.create(model=model, messages=[{"role": "user", "content": text}])
    print(f"[sent to {where}: {model}]")
    return reply.choices[0].message.content
```

A word list is a simple first guard, not a guarantee: it misses things written differently. Stronger set-ups ask the local model itself to classify the text first ("does this contain personal data? answer yes or no") and treat "yes" or any doubt as local.

## 4. Where hybrid usually lands

In most offices, 80 to 95% of requests stay local and a few hard ones go out. Coding teams often run a local model for autocomplete and quick questions, and a cloud plan for big changes across many files (Lesson 13.3). Writers draft locally and ask a cloud model for a final check on text that is already public.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** pay the cloud only for the share of work that needs it.

**Equation:** monthly cost = local running cost + (share sent to cloud × jobs × tokens per job × price per token).

**Analogy:** a family car and a taxi. The car does the daily trips; the taxi does the airport run.

**Try it:** 4,000 jobs a month, 5% to the cloud, 5,000 tokens each, at US$10 per million output tokens? (200 × 5,000 = 1,000,000 tokens, about US$10 a month, plus the local power bill.)
</details>

## 5. Worked example

*Made-up numbers.* A 15-person charity uses a 27B model locally for everything. Twice a month they write a grant application and want the strongest model's comments. The router keeps any text with donor names local; for the grant text, which will be public anyway, `needs_best=True` sends it to the cloud. The log shows 31 cloud requests last month at a cost under US$5.

## 6. Practice

1. Write three words or phrases for your own `PRIVATE_WORDS`.
2. Change `choose` so that texts longer than 100,000 characters go to the cloud when allowed.
3. Why does the router choose local when no cloud key is set?

<details>
<summary>Answers</summary>

1. Depends on your work: for example "invoice", "client", "date of birth".
2. Add before the last line: `if len(t) > 100_000 and os.getenv("CLOUD_API_KEY"): return "cloud"` (after the private check).
3. So the script still works offline and nobody sends data out by accident.
</details>

**New words:** *hybrid*, *router*, *data policy*, *redaction* (removing details before sending).
