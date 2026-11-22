---
title: Switching between local and cloud with one setting
seoTitle: Switch between local and cloud AI | Offline AI
summary: Write your script once and point it at your own machine or a cloud service by changing three settings, so you can use local by default and the cloud only when you need it.
minutes: 20
updated: 2026-11-22
sources:
  - 'openai Python library: base_url and api_key settings (works with any OpenAI-style server), https://github.com/openai/openai-python'
  - 'Ollama API and OpenAI compatibility, official documentation, https://docs.ollama.com'
  - 'python-dotenv, load settings from a .env file, https://github.com/theskumar/python-dotenv'
  - 'The Twelve-Factor App: III. Config (keep settings in the environment), https://12factor.net/config'
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

<div class="bigidea">Write a script once and let three settings (address, model name and key) decide whether it talks to your own machine or a cloud service.</div>

## 1. Why this matters

Most people end up with a mix: local for everyday and private work, cloud for the hardest problems. If every script is written for one or the other, you keep two versions up to date. Written this way, you keep one.

## 2. Three settings, one script

The OpenAI-style format (Lesson 11.1) is spoken by every local engine and by many cloud services. So a script only needs to know three things. An **environment variable** is a named setting that lives in your terminal, outside the script, so you can change it without touching the code.

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

<div class="steps">
<div class="step"><p><b>Nothing set.</b> The script reads <code>AI_BASE_URL</code>, finds nothing, and uses the default <code>http://localhost:11434/v1</code> with model <code>gemma4:e4b</code>. The job runs on your laptop.</p></div>
<div class="step"><p><b>A hard job comes up.</b> A long contract comparison is too much for the local model. First check the rule: may this text leave the office? Client names are removed, so yes.</p></div>
<div class="step"><p><b>Set three variables in this terminal only.</b> <code>AI_BASE_URL</code> becomes the provider's address, <code>AI_MODEL</code> its model name, <code>AI_API_KEY</code> your secret key, read from a private <code>.env</code> file.</p></div>
<div class="step"><p><b>Run the same script.</b> Not one line of code changed. The request has the same shape; it just goes to a different address.</p></div>
<div class="step"><p><b>Back to local.</b> Close the terminal (or unset the variables) and the next run is local again. The key never appeared in the script.</p></div>
</div>

## 3. Keep keys out of your code

- Never paste a key into a script you share or upload.
- Put keys in environment variables, or in a `.env` file loaded with the `python-dotenv` package, and add `.env` to `.gitignore`.
- Give each key a spending limit in the provider's dashboard.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** route each job to the cheapest place that does it well enough and is allowed to see the data.

**Equation:**

```math
\text{monthly cloud cost} = \text{jobs sent to cloud} \times \text{tokens per job} \times \text{price per token}
```

**Analogy:** a home kitchen and a restaurant. Cook at home most nights; go out when the occasion needs it. The recipe card (your script) works in both.

**Try it:** 1,000 jobs a month, 10% to the cloud, 3,000 tokens each, at 5 per million tokens (made-up price)? (100 × 3,000 = 300,000 tokens; 0.3 × 5 = 1.5 a month.)
</details>

<div class="meaning">

<dl>
<dt>AI_BASE_URL</dt><dd>where requests go: your own machine or a provider's address</dd>
<dt>AI_MODEL</dt><dd>the model's name at that address; names differ between engines and providers</dd>
<dt>AI_API_KEY</dt><dd>a secret that tells a paid service who you are; local servers ignore it</dd>
<dt>jobs × tokens × price</dt><dd>what the cloud part costs each month; the local part costs only electricity</dd>
<dt>Physical meaning</dt><dd>Your script is a recipe card that works in two kitchens. The three settings are the address on the delivery slip. Cook at home by default, send out only the dishes that need a restaurant, and only ones you are allowed to send.</dd>
</dl>

</div>

<div class="problem" data-problem="swap-local-cloud-bill"></div>

<div class="myth">

**"If the key is only in my script on my own laptop, it is safe."** Scripts get copied, emailed, pasted into chats and pushed to GitHub, and the key goes with them. Anyone with the key can spend your money. Keep keys in environment variables or a `.env` file listed in `.gitignore`, and set a spending limit.

</div>

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

<div class="keypoints">

- The OpenAI-style format lets one script talk to local engines and many cloud services.
- Only three settings change: base address, model name and API key; keep them in environment variables.
- With nothing set, the script should default to your local machine.
- Never put keys in code you share; use a `.env` file listed in `.gitignore` and a spending limit.
- Decide in advance which data may leave your machine, and send only that to the cloud.

</div>
