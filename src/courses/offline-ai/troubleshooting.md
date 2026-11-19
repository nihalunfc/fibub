---
title: Fixing the common problems
summary: Out of memory, painfully slow, graphics card not used, garbled answers, model forgets the conversation. What each one means and how to fix it.
minutes: 25
updated: 2026-11-18
quiz:
  - q: Answers are fine at first, but in a long chat the model forgets what you said at the start. Why?
    choices: ['The model is broken', 'The conversation is longer than the context window', 'The internet dropped']
    ans: 1
    why: Once the chat passes the context length, the oldest parts are dropped. Raise the context (if memory allows) or start a new chat with a summary.
  - q: An NVIDIA graphics card is not being used at all. What should you check first?
    choices: ['The graphics driver is installed and up to date', 'Your monitor cable', 'The keyboard language']
    ans: 0
    why: Engines need the graphics driver (and CUDA support) to use an NVIDIA card. An old or missing driver means everything runs on the processor.
  - q: The model answers in strange symbols or repeats itself forever. A likely cause?
    choices: ['Wrong chat template or a broken download', 'Too much memory', 'The room is too cold']
    ans: 0
    why: Each model expects its own chat format (template). A wrong template or a corrupted file gives garbage. Re-download, or use a file with the template built in.
---

**Module 9 · about 25 minutes · read first: 9.1 to 9.3.** You'll be able to find the cause of the six commonest problems and fix them.

## 1. Why this matters

Almost every local AI problem is one of a handful. Recognise the symptom and the fix takes minutes instead of an evening of searching.

## 2. The six problems

| Symptom | What it means | Fix, in order |
|---|---|---|
| **"Out of memory"**, or the model will not load | The file plus its working space is bigger than free memory | Close other apps; pick a smaller quantisation (Q4 instead of Q8); pick a smaller model; lower the context length |
| **Very slow** (under 3 tokens per second) | All or part of the model is on the processor, or memory is so full the system swaps to disk | Check the GPU share (`ollama ps`, or the app's GPU setting); use a model that fits fully; close the browser tabs eating memory |
| **Graphics card not used** | Missing or old driver, or the wrong engine build | Update the graphics driver from NVIDIA, AMD or Intel; in llama.cpp use the build for your card (CUDA, Vulkan); set GPU layers to the maximum |
| **Forgets earlier messages** | The chat is longer than the context window | Raise the context length if memory allows; start a new chat with a short summary of the old one (Lesson 3.7) |
| **Garbled text, endless repetition** | Wrong chat template, broken download, or extreme settings | Re-download; use the publisher's file; reset temperature and repeat penalty to defaults (Lesson 10.1) |
| **Fine yesterday, broken today** | An update changed the app, driver or model | Check what updated; most apps let you go back a version; keep a note of versions that work |

## 3. A habit that saves hours

Change **one thing at a time** and test after each. Keep a short log: date, what you changed, the speed you saw. When something breaks, the log tells you what to undo.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** when memory runs out, the system moves data to disk ("swapping"), and disk is tens to hundreds of times slower than memory.

**Equation:** slowdown ≈ memory speed ÷ disk speed, for the share that is swapped.

**Analogy:** a desk and a filing cabinet in the basement. While everything fits on the desk you work fast; once papers go to the basement, every trip down costs minutes.

**Try it:** memory at 100 GB/s and a fast SSD at 5 GB/s? (100 ÷ 5 = 20 times slower for the swapped part. That is why a model that "just doesn't fit" crawls.)
</details>

## 4. Worked example

*Made-up numbers.* Kofi's model ran at 15 tokens per second last week and now runs at 2. His log says he updated nothing. Task Manager shows memory at 98%: 40 browser tabs. He closes the browser and speed returns to 15. Problem 2, memory pressure, fixed in a minute.

## 5. Practice

1. Open your system monitor (Task Manager, Activity Monitor) while the model writes. How full is memory?
2. Start a chat, then paste a very long document. What happens to speed and to the model's memory of the start?
3. Write your first log line: model, size, quantisation, context length, speed.

<details>
<summary>Answers</summary>

1. Above about 90% means you are close to swapping. Close things or pick a smaller model.
2. Speed drops while it reads the long text (Lesson 3.5), and early messages may be lost if the context is too short.
3. Example: "18 Nov · gemma4:e4b · Q4 · 8,192 · 14 tok/s".
</details>

**New words:** *swap* (using the disk as overflow memory), *driver* (the software that lets programs use a device), *chat template* (the exact format a model expects its conversation in).
