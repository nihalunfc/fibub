---
title: 'Pull the cable: testing it fully offline'
summary: A ten-minute test that proves your setup needs no internet, and how to fix the pieces that quietly still reach out.
minutes: 20
updated: 2026-11-18
sources:
  - 'Hugging Face offline mode (HF_HUB_OFFLINE), https://huggingface.co/docs/huggingface_hub/package_reference/environment_variables'
quiz:
  - q: What is the most reliable way to prove a setup works offline?
    choices: ['Read the app’s settings page', 'Switch off Wi-Fi and unplug the network cable, then use every part', 'Ask the model if it is offline']
    ans: 1
    why: Only a real test with no connection shows what still tries to reach out. The model cannot know.
  - q: A Python script works online but fails offline on its first line that loads a model from Hugging Face. What helps?
    choices: ['Set HF_HUB_OFFLINE=1 after downloading the files once', 'Delete the model', 'Use a longer prompt']
    ans: 0
    why: With HF_HUB_OFFLINE=1 the library uses the files already in its cache and does not try to check online.
  - q: Why run every model once before you travel?
    choices: ['To warm up the battery', 'Some programs fetch extra files the first time a model is used', 'It makes the model smarter']
    ans: 1
    why: Tokenizer files, templates or speech models can be fetched on first use. Running each once fills the cache.
---

**Module 9 · about 20 minutes · read first: 9.1 to 9.5.** You'll be able to prove your setup works with no connection and fix the parts that do not.

## 1. Why this matters

"It should work offline" is not the same as "it works offline". If you rely on local AI on a plane, at a site with no signal or in a secure room, find the gaps at your desk, not there.

## 2. The ten-minute test

1. **Prepare online:** open each tool you will use and run each model once.
2. **Cut the connection:** switch off Wi-Fi *and* unplug any network cable. Turn on flight mode on a laptop.
3. **Restart** the apps (some only notice on start-up).
4. **Use every part:** chat, load each model, run your scripts, upload a document.
5. **Write down** anything that hangs, shows an error or says "connecting".
6. **Reconnect,** fix each item (below), and test again.

## 3. Common gaps and fixes

| Symptom offline | Likely cause | Fix |
|---|---|---|
| Python script stalls at "loading model" | The library checks Hugging Face for updates | Download once, then set `HF_HUB_OFFLINE=1` |
| App shows "checking for updates" | Update check on start | Turn off automatic updates in its settings |
| Document upload fails | The embedding model (Module 12) was never downloaded | Upload one document while online first |
| A tool says "web search failed" | A search plug-in is switched on | Turn the tool off for offline use |
| Model missing | Only one size was downloaded | `ollama list` before you leave |

Setting the variable: on Windows PowerShell `$env:HF_HUB_OFFLINE="1"`; on Mac or Linux `export HF_HUB_OFFLINE=1`. Lesson 11.2 shows how to set it inside a script.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a chain works offline only if every link does.

**Equation:** chance the whole setup works = product of the chance each part works offline.

**Analogy:** Christmas lights wired in a line: one dead bulb and the whole string is dark. Testing each bulb is quicker than guessing.

**Try it:** five parts, each 90% likely to be fine untested? (0.9⁵ ≈ 0.59: only a 59% chance the untested setup works. Testing turns guesses into certainties.)
</details>

## 4. Worked example

*Made-up numbers.* Jo is flying 14 hours and wants to draft a report. She runs the test the night before. Chat works; her summarising script stalls. The cause is a Hugging Face check at start-up. She adds `HF_HUB_OFFLINE=1`, tests again with the cable out, and it runs. On the plane everything works.

## 5. Practice

1. Run the ten-minute test on your own setup.
2. Which parts of your setup are "online once" and which "offline always"? (Use the diagram in 1.3.)
3. Your chat window works offline but its document upload does not. What is the most likely cause?

<details>
<summary>Answers</summary>

1. Keep the list of fixes: it is your setup's offline checklist.
2. Online once: app install, model downloads, embedding model. Offline always: chats, scripts, documents already indexed.
3. The embedding model it uses for documents was never downloaded. Upload one document while online.
</details>

**New words:** *flight mode* (all wireless off), *cache* (files kept locally so they need not be fetched again), *embedding model* (a small model that turns text into numbers for search, Module 12).
