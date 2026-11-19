---
title: Calling it from Python and scripts
seoTitle: Call a local AI model from Python | Offline AI
summary: Install Python, send your first question to Gemma 4 from a script, then build a real workflow that summarises a whole folder of files into a spreadsheet, offline.
minutes: 30
updated: 2026-11-18
sources:
  - 'ollama Python library, https://github.com/ollama/ollama-python'
  - 'openai Python library (works with any OpenAI-style server), https://github.com/openai/openai-python'
quiz:
  - q: In client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama"), why is there an api_key at all?
    choices: ['Ollama charges per question', 'The library insists on a key; a local server ignores it', 'It unlocks bigger models']
    ans: 1
    why: The openai library requires some key. Local servers do not check it, so any text works.
  - q: Your folder has 300 files. Why does the script send them one at a time?
    choices: ['Each file must fit in the context window, and one at a time keeps memory steady', 'Python cannot read more than one file', 'The model gets bored']
    ans: 0
    why: Sending files one by one keeps each request inside the context window and lets the script save results as it goes.
  - q: What makes the workflow script work with no internet?
    choices: ['It only talks to localhost', 'It uses a VPN', 'It caches the internet']
    ans: 0
    why: Every request goes to the engine on your own machine at localhost. Nothing else is called.
---

**Module 11 · about 30 minutes · read first: 11.1.** You'll be able to call your local model from Python and run a workflow over a folder of files.

## 1. Why this matters

This is the step that turns local AI from a chat toy into a tool for your work. A short script can do in ten minutes what would take you a day by hand, on files you would never upload, with no usage limit.

## 2. Set up Python once

1. Install Python 3 from **python.org** (Windows: tick "Add python.exe to PATH" in the installer). macOS and Linux usually have it already as `python3`.
2. Make a project folder and a virtual environment inside it:

```
mkdir local-ai && cd local-ai
python -m venv .venv
# Windows: .venv\Scripts\activate     Mac/Linux: source .venv/bin/activate
pip install ollama openai
```

On a Mac, type `python3` where these steps say `python`.

## 3. Your first script

Save this as `hello.py` and run `python hello.py` with Ollama running:

```python
import ollama

reply = ollama.chat(
    model="gemma4:e4b",
    messages=[{"role": "user", "content": "Give me three tips for writing clear emails."}],
)
print(reply["message"]["content"])
```

The same thing with the **openai** library, which works with any engine's `/v1` address (Lesson 11.1):

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")  # the key is ignored locally
reply = client.chat.completions.create(
    model="gemma4:e4b",
    messages=[{"role": "user", "content": "Give me three tips for writing clear emails."}],
)
print(reply.choices[0].message.content)
```

Use the first for Ollama-only scripts; use the second when you might switch engines or go to the cloud later (Lesson 11.4).

## 4. A real workflow: summarise a folder

This script reads every `.txt` and `.md` file in a folder, asks the model for a two-sentence summary and three keywords, and writes the results to `summaries.csv`, which opens in Excel or Google Sheets.

```python
import csv
import sys
from pathlib import Path

import ollama

MODEL = "gemma4:e4b"
MAX_CHARS = 12000  # about 3,000 tokens: keeps each file well inside the context window

def summarise(text: str) -> str:
    reply = ollama.chat(
        model=MODEL,
        messages=[
            {"role": "system", "content": "You summarise documents for a busy reader. Be accurate and brief."},
            {"role": "user", "content": "Summarise this in two sentences, then give three keywords on a new line "
                                        "starting with 'Keywords:'.\n\n" + text[:MAX_CHARS]},
        ],
        options={"temperature": 0.2},
    )
    return reply["message"]["content"].strip()

def main(folder: str) -> None:
    files = sorted(p for p in Path(folder).iterdir() if p.suffix.lower() in {".txt", ".md"})
    with open("summaries.csv", "w", newline="", encoding="utf-8") as out:
        writer = csv.writer(out)
        writer.writerow(["file", "summary"])
        for i, path in enumerate(files, 1):
            text = path.read_text(encoding="utf-8", errors="ignore")
            writer.writerow([path.name, summarise(text)])
            print(f"{i}/{len(files)} {path.name}")
    print("Saved summaries.csv")

if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else ".")
```

Run it on a folder: `python summarise_folder.py "C:\Users\you\Documents\notes"` (Windows) or `python summarise_folder.py ~/Documents/notes` (Mac/Linux). Switch the Wi-Fi off first if you like: it makes no difference. PDFs and Word files need a reading step first, covered in Lesson 12.6.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a batch job's time is the number of items times the time per item, and the time per item is mostly the model writing.

**Equation:** total time ≈ files × (input tokens ÷ reading speed + output tokens ÷ writing speed).

**Analogy:** a checkout queue. Each customer's time is scanning (reading the file) plus bagging (writing the summary); the queue's time is the sum.

**Try it:** 200 files, each 2,000 tokens in and 80 tokens out, reading at 400 tokens per second and writing at 16? (Each: 5 + 5 = 10 s. All: 2,000 s, about 33 minutes.)
</details>

## 5. Worked example

*Made-up numbers.* Ben has 150 meeting notes as text files. He runs the script on his 16 GB laptop with `gemma4:e4b` before lunch. It takes 22 minutes. He sorts the spreadsheet by keyword and finds every meeting that mentioned the budget in seconds.

## 6. Practice

1. Run `hello.py` with both libraries.
2. Make a folder with three short text files and run the workflow on it.
3. Change the prompt so it also returns "Action needed: yes/no". Run it again.
4. How would you make the script use `gemma4:12b` instead?

<details>
<summary>Answers</summary>

1. If you see "connection refused", Ollama is not running: start the app, or `ollama serve` in another terminal.
2. Open `summaries.csv` in a spreadsheet to check.
3. Add the request to the user message; Lesson 11.3 shows how to get it back as clean JSON fields instead of text.
4. Change `MODEL = "gemma4:12b"` (and pull it first).
</details>

**New words:** *script* (a small program you run), *virtual environment* (a private set of Python packages for one project), *batch job* (the same task run over many items), *CSV* (a plain-text table any spreadsheet opens).
