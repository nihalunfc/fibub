---
title: 'Ollama: models from the terminal'
summary: Install Ollama, pull Gemma 4 with one command, chat in the terminal, and learn the six commands you will use every day.
minutes: 25
updated: 2026-11-18
sources:
  - 'Ollama downloads and documentation, https://ollama.com'
  - 'Gemma 4 tags and sizes in the Ollama library (gemma4:e2b, e4b, 12b, 26b-a4b, 31b), read 16 November 2026 via BenchLM, https://benchlm.ai/best/ollama-models'
quiz:
  - q: Which command downloads a model without starting a chat?
    choices: ['ollama run gemma4:12b', 'ollama pull gemma4:12b', 'ollama ps']
    ans: 1
    why: pull only downloads. run downloads it if needed and then opens a chat. ps lists models that are loaded right now.
  - q: What does the part after the colon in gemma4:e4b mean?
    choices: ['The size or version of the model, called a tag', 'Your user name', 'The port number']
    ans: 0
    why: A tag picks a version of the model, usually the size. gemma4:e4b and gemma4:31b are different files.
  - q: "ollama ps shows 45%/55% CPU/GPU. What does that mean?"
    choices: ['The model fits fully on the graphics card', 'Part of the model did not fit on the graphics card, so it runs slower', 'Ollama is updating']
    ans: 1
    why: When the graphics memory is too small, the rest of the model runs on the processor, which is much slower. A smaller model or quantisation fixes it.
---

**Module 9 · about 25 minutes · read first: 9.1.** You'll be able to install Ollama, download Gemma 4 and manage your models with a handful of commands.

## 1. Why this matters

Ollama runs quietly in the background and gives every other program on your machine one easy way to reach the model. It is what most of the Python in Module 11 talks to. Learning its few commands now saves you hours later.

## 2. Install

- **Windows and macOS:** download the installer from **ollama.com** and run it. Ollama then runs in the background (you will see its icon).
- **Linux:** the site gives a one-line install script. Read any script before you run it.

Then open a terminal (Windows: Terminal or PowerShell; Mac: Terminal) and check it works:

```
ollama --version
```

## 3. Get Gemma 4 and chat

```
ollama pull gemma4:e4b
ollama run gemma4:e4b
```

The first command downloads about 6.6 GB. The second opens a chat: type a question and press Enter. Type `/bye` to leave.

Pick the tag that fits your memory, as in Lesson 9.1: `gemma4:e2b` (8 GB machines), `gemma4:e4b` or `gemma4:12b` (16 GB), `gemma4:26b-a4b` or `gemma4:31b` (24 GB graphics card or 32 GB Mac).

## 4. The six everyday commands

| Command | What it does |
|---|---|
| `ollama pull <model>` | Download a model |
| `ollama run <model>` | Chat with it (downloads first if needed) |
| `ollama list` | Show the models you have and their sizes |
| `ollama ps` | Show what is loaded now, and how much is on the processor (CPU) and graphics chip (GPU) |
| `ollama stop <model>` | Unload it to free memory |
| `ollama rm <model>` | Delete it from disk |

You can also ask a single question without a chat:

```
ollama run gemma4:e4b "Explain what a token is in two sentences."
```

## 5. Where the files go

Models are saved in a folder called `.ollama/models` inside your home folder (on Windows, `C:\Users\<you>\.ollama\models`). They are big, so if your main drive is small you can tell Ollama to use another drive by setting the `OLLAMA_MODELS` environment variable to a folder there, then restarting Ollama.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the share of the model on the slower processor sets the speed, much more than the share on the graphics chip.

**Equation:** time per token ≈ (GB on GPU ÷ GPU bandwidth) + (GB on CPU ÷ CPU bandwidth).

**Analogy:** a relay race where one runner is much slower. Even a short leg for the slow runner adds a lot to the total time.

**Try it:** an 8 GB model, 6 GB on a GPU at 300 GB/s and 2 GB on a CPU at 50 GB/s? (6 ÷ 300 + 2 ÷ 50 = 0.02 + 0.04 = 0.06 s per token, about 17 tokens per second. All on the GPU would be 8 ÷ 300 ≈ 0.027 s, about 37 tokens per second.)
</details>

## 6. Worked example

*Made-up numbers.* Meera has a desktop with an 8 GB graphics card. She runs `ollama run gemma4:12b` and it feels slow. `ollama ps` shows `30%/70% CPU/GPU`: the 7.7 GB file plus its working space does not fit in 8 GB. She switches to `gemma4:e4b`, `ollama ps` shows `100% GPU`, and it writes about three times faster. For harder questions she goes back to the 12B and accepts the speed.

## 7. Practice

1. Install Ollama and run `ollama --version`.
2. Pull the Gemma 4 tag that fits your machine and ask it one question with `ollama run`.
3. Run `ollama ps` while it is loaded. What split does it show?
4. How would you free the memory without deleting the model?

<details>
<summary>Answers</summary>

1. If the command is not found, close and reopen the terminal so it picks up the new program.
2. Any answer that comes back means it is working.
3. On a Mac it will show GPU, since the memory is shared. On a PC without a graphics card it will show CPU.
4. `ollama stop <model>`. It also unloads by itself after a few idle minutes.
</details>

**New words:** *terminal* (a window where you type commands), *tag* (the version or size after the colon), *environment variable* (a named setting that programs read when they start).
