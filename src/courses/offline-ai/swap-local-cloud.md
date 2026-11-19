---
title: Switching between local and cloud with one setting
seoTitle: Switch between local and cloud AI | Offline AI
summary: Write your script once and point it at your own machine or a cloud service by changing three settings, so you can use local by default and the cloud only when you need it.
minutes: 20
updated: 2026-11-18
quiz:
  - q: Which three settings change when you move a script from local to cloud?
    choices: ['Base address, model name and API key', 'Python version, folder and file name', 'Temperature, colour and font']
    ans: 0
    why: The request format stays the same; only where it goes, which model, and the key change.
  - q: Where should a cloud API key live?
    choices: ['Typed into the script and shared on GitHub', 'In an environment variable or a .env file that is never committed', 'In the prompt']
    ans: 1
    why: Keys in code get leaked. Keep them in environment variables or a .env file listed in .gitignore.
  - q: A script is set to local by default. When is it sensible to switch one job to the cloud?
    choices: ['Never', 'When a job needs a stronger model and the data is allowed to leave your machine', 'Every time, to be safe']
    ans: 1
    why: Local first for privacy and cost; cloud for the hard jobs, and only with data you may send.
---

**Module 11 · about 20 minutes · read first: 11.2.** You'll be able to run the same script against your local model or a cloud model by changing settings, not code.

## 1. Why this matters

Most people end up with a mix: local for everyday and private work, cloud for the hardest problems. If every script is written for one or the other, you maintain two versions. Written this way, you maintain one.

## 2. Three settings, one script

The OpenAI-style format (Lesson 11.1) is spoken by every local engine and by many cloud services. So a script only needs to know three things:

| Setting | Local example | Cloud example |
|---|---|---|
| `AI_BASE_URL` | `http://localhost:11434/v1` | the provider's OpenAI-compatible address, from its documentation |
| `AI_MODEL` | `gemma4:e4b` | the provider's model name |
| `AI_API_KEY` | anything, for example `local` | your secret key |

```python
import os
from openai import OpenAI

client = OpenAI(
    base_url=os.getenv("AI_BASE_URL", "http://localhost:11434/v1"),
    api_key=os.getenv("AI_API_KEY", "local"),
)
MODEL = os.getenv("AI_MODEL", "gemma4:e4b")

def ask(prompt: str) -> str:
    reply = client.chat.completions.create(model=MODEL, messages=[{"role": "user", "content": prompt}])
    return reply.choices[0].message.content

print(ask("One sentence on why local AI helps privacy."))
```

With nothing set, it uses your machine. To send one run to a cloud service, set the three variables in that terminal only (PowerShell: `$env:AI_MODEL="..."`; Mac/Linux: `export AI_MODEL=...`) and run it again.

Check each provider's documentation for its OpenAI-compatible address and model names; some also have their own Python library with extra features.

## 3. Keep keys out of your code

- Never paste a key into a script you share or upload.
- Put keys in environment variables, or in a `.env` file loaded with the `python-dotenv` package, and add `.env` to `.gitignore`.
- Give each key a spending limit in the provider's dashboard.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** route each job to the cheapest place that does it well enough and is allowed to see the data.

**Equation:** monthly cloud cost = jobs sent to cloud × tokens per job × price per token.

**Analogy:** a home kitchen and a restaurant. Cook at home most nights; go out when the occasion needs it. The recipe card (your script) works in both.

**Try it:** 1,000 jobs a month, 10% to the cloud, 3,000 tokens each, at 5 per million tokens (made-up price)? (100 × 3,000 = 300,000 tokens; 0.3 × 5 = 1.5 a month.)
</details>

## 4. Worked example

*Made-up numbers.* A small law office runs the JSON email script locally every morning. Once a week a partner needs a long contract comparison that the local 12B model struggles with. For that one job they send only the clauses that are allowed to leave the office, after removing client names, to a cloud model by setting the three variables. Same script, two destinations, one clear rule about what may leave.

## 5. Practice

1. Run the script with nothing set and confirm it answers from your machine.
2. Point it at a different local engine (for example LM Studio on `http://localhost:1234/v1`) with only the settings.
3. Write a one-line rule for your own work: which data may go to the cloud?

<details>
<summary>Answers</summary>

1. Switch Wi-Fi off to be sure: it still answers.
2. Set `AI_BASE_URL` and `AI_MODEL` to what LM Studio shows. No code changes.
3. Example: "Nothing with client names, health or money details leaves the laptop."
</details>

**New words:** *base URL* (the start of the address all requests go to), *API key* (a secret that identifies you to a paid service), *.env file* (a private file of settings that is never shared).
