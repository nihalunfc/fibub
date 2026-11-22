---
title: 'Pull the cable: testing it fully offline'
summary: A ten-minute test that proves your setup needs no internet, and how to fix the pieces that quietly still reach out.
minutes: 20
updated: 2026-11-22
sources:
  - 'Hugging Face offline mode (HF_HUB_OFFLINE), https://huggingface.co/docs/huggingface_hub/package_reference/environment_variables'
  - 'Hugging Face Transformers installation guide: offline mode (official page), https://huggingface.co/docs/transformers/installation'
  - 'Ollama FAQ: settings, proxies and where models are kept (official page), https://docs.ollama.com/faq'
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

<div class="bigidea">A setup works offline only if every single part does, so the only proof is to cut the connection and use every part before you depend on it.</div>

## 1. Why this matters

"It should work offline" is not the same as "it works offline". If you rely on local AI on a plane, at a site with no signal or in a secure room, find the gaps at your desk, not there.

## 2. The ten-minute test

1. **Prepare online:** open each tool you will use and run each model once.
2. **Cut the connection:** switch off Wi-Fi *and* unplug any network cable. Turn on **flight mode** (all wireless off) on a laptop.
3. **Restart** the apps (some only notice on start-up).
4. **Use every part:** chat, load each model, run your scripts, upload a document.
5. **Write down** anything that hangs, shows an error or says "connecting".
6. **Reconnect,** fix each item (below), and test again.

## 3. Why one gap breaks everything

Your setup is a chain: app, models, scripts, document search. If any link needs the internet, the job fails. Small doubts multiply.

### Watch it happen: five links, each "probably fine"

<div class="steps" data-fig="going-offline-chain">
<div class="step"><p><b>One part.</b> The chat app is 90% likely to work offline untested. The chance the job works: <b>90%</b>.</p></div>
<div class="step"><p><b>Two parts.</b> Add a model, also 90%. Both must work: 0.9 × 0.9 = <b>81%</b>.</p></div>
<div class="step"><p><b>Five parts.</b> App, model, script, documents, search tool, each 90%: 0.9 × 0.9 × 0.9 × 0.9 × 0.9 = 0.9⁵ ≈ <b>59%</b>. Little better than a coin toss.</p></div>
<div class="step"><p><b>After the test.</b> You pull the cable, use every part, fix the two that failed and test again. Now each link is checked, not guessed: the job works.</p></div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a chain works offline only if every link does.

**Equation:** chance the whole setup works = product of the chance each part works offline.

```math
P_{\text{all}} = p_1 \times p_2 \times \dots \times p_n
```

**Analogy:** Christmas lights wired in a line: one dead bulb and the whole string is dark. Testing each bulb is quicker than guessing.

**Try it:** five parts, each 90% likely to be fine untested? (0.9⁵ ≈ 0.59: only a 59% chance the untested setup works. Testing turns guesses into certainties.)
</details>

<div class="meaning">

<dl>
<dt>p<sub>1</sub> … p<sub>n</sub></dt><dd>the chance that each part works with no connection (an app, a model, a script)</dd>
<dt>n</dt><dd>how many parts the job needs</dd>
<dt>P<sub>all</sub></dt><dd>the chance the whole job works: all the chances multiplied</dd>
<dt>Physical meaning</dt><dd>Every part you add is another bulb in the string. Even parts that are "almost certainly fine" add up to real risk, which is why a ten-minute test before a trip is worth more than any amount of reading settings pages.</dd>
</dl>

</div>

<div class="problem" data-problem="going-offline-chain"></div>

## 4. Common gaps and fixes

| Symptom offline | Likely cause | Fix |
|---|---|---|
| Python script stalls at "loading model" | The library checks Hugging Face for updates | Download once, then set `HF_HUB_OFFLINE=1` |
| App shows "checking for updates" | Update check on start | Turn off automatic updates in its settings |
| Document upload fails | The embedding model (Module 12) was never downloaded | Upload one document while online first |
| A tool says "web search failed" | A search plug-in is switched on | Turn the tool off for offline use |
| Model missing | Only one size was downloaded | `ollama list` before you leave |

Setting the variable: on Windows PowerShell `$env:HF_HUB_OFFLINE="1"`; on Mac or Linux `export HF_HUB_OFFLINE=1`. Lesson 11.2 shows how to set it inside a script.

<div class="myth">

**"I'll just ask the model whether it is working offline."** The model has no idea whether your computer is connected; it only predicts text. It may happily say "yes, I'm offline" while a script in the background waits for a website. Only pulling the cable tells you.

</div>

## 5. Worked example

*Made-up numbers.* Jo is flying 14 hours and wants to draft a report. She runs the test the night before. Chat works; her summarising script stalls. The cause is a Hugging Face check at start-up. She adds `HF_HUB_OFFLINE=1`, tests again with the cable out, and it runs. On the plane everything works.

## 6. Practice

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

<div class="keypoints">

- "Should work offline" is a guess; cutting the connection and using every part is the proof.
- Prepare online first: open each tool and run each model once so all files are cached.
- The chance a setup works is the product of each part's chance: five parts at 90% give only 59%.
- Common fixes: HF_HUB_OFFLINE=1, update checks off, embedding model downloaded, web tools off.

</div>
