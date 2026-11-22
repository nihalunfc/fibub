---
title: A coding assistant that runs on your machine
seoTitle: Local AI coding assistant with Ollama | Offline AI
summary: Point a code editor plug-in (Continue) and a command-line pair programmer (Aider) at a local model. Pick coding models by memory size, set the context right, and know where local still falls short.
minutes: 30
updated: 2026-11-22
sources:
  - 'Continue, open-source AI code assistant (Apache 2.0), https://docs.continue.dev'
  - 'Aider, AI pair programming in your terminal (Apache 2.0), connecting to Ollama, https://aider.chat/docs/llms/ollama.html'
  - 'Qwen3-Coder in the Ollama library, https://ollama.com/library/qwen3-coder'
quiz:
  - q: Why give a coding assistant a long context setting (16K tokens or more)?
    choices: ['Code files and edit instructions are long; a short context silently cuts them off', 'It makes the model smarter', 'Ollama requires it']
    ans: 0
    why: Coding tools send whole files plus instructions. If the context is too short, the start is dropped and edits go wrong.
  - q: What is a good model for tab autocomplete?
    choices: ['The biggest model you have', 'A small, fast coding model, because it runs on every key press', 'An embedding model']
    ans: 1
    why: Autocomplete must answer in well under a second, many times a minute. A 1.5B to 3B coding model is the usual pick.
  - q: Aider changes your files directly. What makes that safe to undo?
    choices: ['It commits each change to git, so you can roll back', 'It never changes files', 'It uploads a backup']
    ans: 0
    why: Aider works inside a git repository and commits each edit with a message, so /undo or git can restore the previous version.
---

**Module 13 · about 30 minutes · read first: 13.1 and 10.3.** You'll be able to use a local model inside your code editor and in the terminal. This lesson is **mini project 3: Local coding helper**.

<div class="bigidea">A local coding assistant is a coding model on your machine plus a plug-in that sends it your code; how much code it can see and how fast it answers set how useful it is.</div>

## 1. Why this matters

Coding help is the most popular use of AI at work, and the code is often confidential. A local assistant keeps company code on company machines, works on a plane, and has no monthly limit.

Two kinds of tool do the job. An **editor plug-in** sits inside the program you write code in and suggests or changes code there. A **terminal pair programmer** works from a chat window in the command line and edits the files for you. Both just send text to Ollama on `127.0.0.1` and show you what comes back.

## 2. Choose a coding model

| Your memory | Model to try (Ollama tag) | Notes |
|---|---|---|
| 8 to 16 GB laptop | `gemma4:12b` or `gpt-oss:20b` | Good for explaining and small edits |
| 24 to 32 GB GPU or Mac | `qwen3-coder:30b` | A Mixture-of-Experts with about 3B active, so it is fast (Lesson 2.5) |
| 64 to 128 GB | `gpt-oss:120b`, larger Qwen coder models | Closest to cloud quality for multi-file work |
| Autocomplete (any) | `qwen2.5-coder:1.5b` | Tiny and fast; fills in code as you type |

Pull them with `ollama pull <tag>`. Model names move fast; check the Ollama library for the newest coding models before you start.

## 3. In your editor: Continue

**Continue** is a free, open-source extension for VS Code and JetBrains. Install it from the editor's extension store, open its config file (`config.yaml`, from the gear icon in its panel) and add your local models:

```yaml
name: Local models
version: 1.0.0
schema: v1
models:
  - name: Qwen3 Coder 30B
    provider: ollama
    model: qwen3-coder:30b
    roles: [chat, edit, apply]
  - name: Qwen2.5 Coder 1.5B
    provider: ollama
    model: qwen2.5-coder:1.5b
    roles: [autocomplete]
```

Now select code and ask "explain this" or "add error handling", or just type and accept the grey suggestions with Tab. Turn off Continue's anonymous usage statistics in the extension settings if you want nothing at all to leave the machine. The config format can change between versions: if Continue complains, compare with its documentation.

## 4. In the terminal: Aider

**Aider** edits files in a git repository from a chat in your terminal, and commits each change so it is easy to undo.

```
python -m pip install aider-install
aider-install
# Mac/Linux:
export OLLAMA_API_BASE=http://127.0.0.1:11434
# Windows PowerShell:
#   $env:OLLAMA_API_BASE = "http://127.0.0.1:11434"
cd my-project
aider --model ollama_chat/qwen3-coder:30b
```

Then: `/add app.py` to give it a file, and ask "add a --dry-run flag that prints instead of deleting". It shows the change, writes it and commits it. `/undo` reverts the last commit. Aider asks before collecting anonymous analytics; answer no to keep everything local.

Give the model enough context: Aider sets Ollama's context window for you, but if answers seem to forget the file, raise it (Lesson 10.3).

Here is one edit request, from your question to the commit, with made-up but typical numbers:

<div class="steps">
<div class="step"><p><b>You ask.</b> "Add a --dry-run flag." Aider sends your instruction plus the whole of <code>app.py</code>: about 6,000 tokens.</p></div>
<div class="step"><p><b>Reading (prefill).</b> The model reads all 6,000 tokens before it writes anything. At 600 tokens a second that is 6,000 ÷ 600 = <b>10 seconds</b> of waiting with nothing on screen.</p></div>
<div class="step"><p><b>Writing (decode).</b> It writes the change, about 400 tokens, at 40 tokens a second: another <b>10 seconds</b>, this time with text appearing.</p></div>
<div class="step"><p><b>Apply and commit.</b> Aider writes the change into <code>app.py</code> and makes a git commit with a short message. Total wait: about 20 seconds.</p></div>
<div class="step"><p><b>Undo if needed.</b> Not happy? <code>/undo</code> rolls back that commit, and the file is exactly as it was.</p></div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a coding assistant's usefulness is limited by context (how much code it can see) and speed (how long you wait per edit).

**Equation:** wait per edit ≈ prompt tokens ÷ prefill speed + output tokens ÷ decode speed. A 6,000-token file at 600 tok/s prefill and a 400-token edit at 40 tok/s: 10 + 10 = 20 seconds.

**Analogy:** asking a colleague to review code. Show them one function and they answer fast but miss how it is used elsewhere; hand them the whole project and they need an afternoon. Where it breaks: cloud coding agents index the whole repository and use the strongest models; local tools see what you add, so choose the files carefully.

**Try it:** same file, but you upgrade to a graphics card with 2,000 tok/s prefill and 80 tok/s decode. New wait? (3 + 5 = 8 seconds.)
</details>

<div class="meaning">

<dl>
<dt>prompt tokens</dt><dd>everything sent to the model: your instruction plus the code files you added</dd>
<dt>prefill speed</dt><dd>how many tokens a second the model reads before it starts writing</dd>
<dt>output tokens</dt><dd>the length of the change or answer it writes</dd>
<dt>decode speed</dt><dd>how many tokens a second it writes</dd>
<dt>Physical meaning</dt><dd>The wait for an edit is reading time plus writing time. Adding more files makes the model read longer before you see anything; asking for a short, focused change cuts the writing time. That is why you add only the files that matter.</dd>
</dl>

</div>

<div class="problem" data-problem="local-coding-assistant-wait"></div>

<div class="myth">

**"Use your biggest model for autocomplete too."** Autocomplete runs on almost every pause in your typing, so it has to answer in well under a second. A big model makes the suggestions arrive after you have already typed the line. A tiny 1.5B coding model is the right tool there; save the big model for chat and edits.

</div>

## 5. Worked example

*Made-up numbers.* A data analyst on a 32 GB MacBook uses `qwen3-coder:30b` in Continue to write pandas code against confidential HR data. Chat answers start in 2 seconds and run at about 45 tokens a second; autocomplete with the 1.5B model appears in under half a second. For a tricky multi-file refactor, she still uses a cloud tool on a copy with the data removed: local by default, cloud for the hardest jobs (Lesson 15.6).

## 6. Mini project 3: Local coding helper

1. Install Continue, connect a chat model and an autocomplete model, and use them for one hour of real work.
2. Install Aider and ask it to add one feature to a small project of yours (or to `agent.py` from Lesson 13.1). Use `/undo` once to see the git history.
3. Write down three tasks where local was good enough and one where it was not.

## 7. Practice

1. Which model would you choose for autocomplete on a 16 GB laptop, and why?
2. Aider's edit ignores half your file. What do you check?
3. Turn the network off and confirm both tools still work.

<details>
<summary>Answers</summary>

1. `qwen2.5-coder:1.5b`: it answers in a fraction of a second and leaves memory for the chat model.
2. The context setting (raise it), and whether the model is too small for the file size.
3. They should, because both only talk to Ollama on `127.0.0.1`. If something hangs, look for a setting that checks for updates or sends statistics.
</details>

**New words:** *autocomplete* or *tab completion* (the model suggests the next code as you type), *fill-in-the-middle* (completing code between what is before and after the cursor), *pair programmer* (an assistant that edits code with you).

<div class="keypoints">

- Continue (in VS Code or JetBrains) and Aider (in the terminal) both talk to Ollama on your own machine.
- Pick models by memory: a 12B to 20B model on a laptop, a 30B Mixture-of-Experts coder on 24 to 32 GB, and a tiny 1.5B model for autocomplete.
- Wait per edit ≈ prompt tokens ÷ prefill speed + output tokens ÷ decode speed, so add only the files that matter.
- Aider commits every change to git, so `/undo` can always roll it back.
- Give coding tools a long context (16K tokens or more) and turn off usage statistics to keep everything local.

</div>
