---
title: 'Hybrid: local first, cloud for the hardest jobs'
seoTitle: 'Hybrid AI: local first, cloud when needed | Offline AI'
summary: Most teams end up with both. Write clear rules for what stays local and what may go to the cloud, and a few lines of Python that apply them every time.
minutes: 25
updated: 2026-11-22
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

<div class="bigidea">Write down what must stay local and what may go to the cloud, then let a few lines of code apply those rules to every request, so nobody has to decide in a hurry.</div>

## 1. Why this matters

Local models are private, free per use and always there. The biggest cloud models are still stronger on the hardest work (Lesson 17.1). Choosing by hand each time is slow and error-prone: someone in a hurry will paste a client file into a cloud chat. A simple **router** (a function that picks where each request goes) that applies written rules fixes both problems.

## 2. Write the rules first

A good hybrid policy fits on one page:

1. **Data that must stay:** for example patient details, client files, salaries, ID numbers, anything under a contract that says so. Always local.
2. **Jobs local does well:** summaries, drafts, classification, document search, coding help on your own code. Local by default.
3. **Jobs that may go to the cloud:** very hard reasoning, very long documents, the newest knowledge, when the data is allowed to leave.
4. **Cleaning before sending:** remove names and numbers when a job needs the cloud but the text has details it does not need.
5. **Money limit:** a monthly cloud budget, with a spending cap set in the provider's dashboard.

Try it: choose a 32B model at 4-bit, then slide the GPU memory from none up to 24 GB.

<figure class="fig" data-fig="@ai-gpu-offload"><figcaption>Every generated token reads every layer, so the slow part (layers left on the CPU) sets the speed. Each extra layer moved to the GPU helps a little, and the last ones help most.</figcaption></figure>

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

Four requests through the router, one after another:

<div class="steps">
<div class="step"><p><b>"Summarise this patient note..."</b> with <code>needs_best=True</code>. The word "patient" is on the list, so rule 1 wins: <b>local</b>. Privacy beats the wish for the best model.</p></div>
<div class="step"><p><b>"Comment on our public grant draft"</b> with <code>needs_best=True</code>. No private words, and a cloud key is set: <b>cloud</b>.</p></div>
<div class="step"><p><b>"Draft a thank-you email to volunteers."</b> No private words, and not marked as needing the best: <b>local</b>, the default.</p></div>
<div class="step"><p><b>The same grant draft on a train with no signal.</b> No cloud key set on this laptop, so <b>local</b>. The script still works and nothing can leave by accident.</p></div>
<div class="step"><p><b>The log.</b> Each line printed "[sent to local]" or "[sent to cloud]". At month end the log shows how many went out, what they cost, and that private text stayed home.</p></div>
</div>

## 4. Where hybrid usually lands

In most offices, 80 to 95% of requests stay local and a few hard ones go out. Coding teams often run a local model for autocomplete and quick questions, and a cloud plan for big changes across many files (Lesson 13.3). Writers draft locally and ask a cloud model for a final check on text that is already public.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** pay the cloud only for the share of work that needs it.

**Equation:** monthly cost = local running cost + (share sent to cloud × jobs × tokens per job × price per token).

**Analogy:** a family car and a taxi. The car does the daily trips; the taxi does the airport run.

**Try it:** 4,000 jobs a month, 5% to the cloud, 5,000 tokens each, at US$10 per million output tokens? (200 × 5,000 = 1,000,000 tokens, about US$10 a month, plus the local power bill.)
</details>

<div class="meaning">

<dl>
<dt>local running cost</dt><dd>electricity (and wear) for your own machine, about the same however many jobs it does</dd>
<dt>share sent to cloud</dt><dd>the fraction of jobs your rules let out, often 5 to 20%</dd>
<dt>tokens per job × price per token</dt><dd>what one cloud job costs; prices are usually quoted per million tokens, so check current prices</dd>
<dt>Physical meaning</dt><dd>A family car and a taxi. The car does the daily trips at almost no extra cost per trip; the taxi does the airport run, and you pay only for those rides. Rules about who may take the taxi keep the bill, and the risk, small.</dd>
</dl>

</div>

<div class="problem" data-problem="hybrid-cloud-cost"></div>

<div class="myth">

**"The router checks for private data, so we can relax."** A word list only catches the words on it. "Mrs Shah's blood results" contains no word on the list above. The router is a first guard; the written policy, staff training, a local model that classifies text first, and treating any doubt as local are what actually keep data home.

</div>

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

<div class="keypoints">

- Write a one-page policy first: data that must stay, jobs local does well, jobs that may go out, cleaning before sending, and a money limit.
- A router applies the rules on every request: private data always local, cloud only for hard jobs when allowed, local by default.
- With no cloud key set, everything stays local, so the script works offline and cannot leak by accident.
- Monthly cost = local running cost + share sent to cloud × jobs × tokens per job × price per token.
- Word lists miss things; add a local classification step and log where each request went.

</div>
