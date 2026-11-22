---
title: 'The easiest path: a desktop app'
seoTitle: 'Run an AI model with a desktop app | Offline AI'
summary: Install a free desktop app, download Gemma 4, and chat with it on your own computer in about 20 minutes, with no typing of commands.
minutes: 25
updated: 2026-11-22
sources:
  - 'LM Studio (free desktop app for Windows, macOS and Linux), https://lmstudio.ai'
  - 'LM Studio documentation (official page), https://lmstudio.ai/docs'
  - 'Gemma 4 sizes and download sizes from the Ollama library, read 16 November 2026 via BenchLM, https://benchlm.ai/best/ollama-models'
  - 'llama.cpp, the engine inside many desktop apps (open source, MIT licence), https://github.com/ggml-org/llama.cpp'
quiz:
  - q: You have a laptop with 16 GB of memory. Which Gemma 4 size is the safest first download?
    choices: ['Gemma 4 31B', 'Gemma 4 E4B or 12B at 4-bit', 'gpt-oss-120b']
    ans: 1
    why: The E4B (about 6.6 GB) and 12B (about 7.7 GB) downloads leave room for the system and your other apps. The 31B needs about 19 GB.
  - q: What does "4-bit" or "Q4" in a download name tell you?
    choices: ['The model was trained for 4 days', 'Each number in the model is stored in about 4 bits, making the file smaller', 'It needs 4 GB of memory exactly']
    ans: 1
    why: Quantisation stores each weight in fewer bits. Q4 files are about a quarter of the full 16-bit size, with a small loss in quality (Module 8).
  - q: The app shows a speed of 4 tokens per second and the laptop fan is loud. What is the most likely fix?
    choices: ['Pick a smaller model or a smaller quantisation', 'Restart the router', 'Type shorter words']
    ans: 0
    why: Slow speed usually means the model is too big for the memory or is running on the processor instead of the graphics chip. A smaller model fits better and runs faster.
---

**Module 9 · about 25 minutes · read first: 1.4 and 4.1.** You'll be able to install a desktop app, download a Gemma 4 model and chat with it with the Wi-Fi switched off.

<div class="bigidea">A desktop app puts a model shop, an engine and a chat window in one program, so you can run AI on your own computer by clicking, with no commands and no internet once the model is downloaded.</div>

## 1. Why this matters

This is the fastest way to see local AI working on your own machine. You click instead of typing commands, and the app shows you the things later lessons explain: model size, memory use and speed. Many people never need more than this.

## 2. What the app does

A desktop app such as **LM Studio** (free, on Windows, macOS and Linux) bundles three things, like a games console that comes with a shop, the console itself and a screen:

1. a **catalogue** where you search for models and download them;
2. an **engine** (llama.cpp on most machines, MLX on Apple Silicon Macs) that runs the model on your processor and graphics chip;
3. a **chat window**, plus a local server for programs to use (Module 11).

Other apps do the same job in a similar way. The steps below are general so they still make sense when the screens change.

## 3. Step by step

1. **Check your memory.** Windows: Settings, System, About, "Installed RAM". Mac: Apple menu, About This Mac. Write it down.
2. **Install the app.** Download it from the maker's own site (lmstudio.ai), not from a third-party download page. Open the installer and accept the defaults.
3. **Find the model.** In the app's model search, type `gemma 4`. You will see several sizes: E2B, E4B, 12B, 26B A4B and 31B, each in several file versions.
4. **Pick the size that fits.** Use the table below. Choose a file marked **Q4_K_M** or **4-bit** to start; the app usually marks the ones that fit your machine.
5. **Download it** on a good connection (5 to 20 minutes for most).
6. **Load it** into memory. The first load takes a little longer.
7. **Chat.** Ask it something you know the answer to, then something useful: "Summarise this paragraph in three bullet points" and paste a paragraph.
8. **Switch Wi-Fi off and ask again.** It still answers. That is local AI.

| Your memory | First Gemma 4 to try | About the download |
|---|---|---|
| 8 GB | E2B, 4-bit | 4.6 GB |
| 16 GB | E4B or 12B, 4-bit | 6.6 GB / 7.7 GB |
| 32 GB Mac, or 24 GB graphics card | 26B A4B or 31B, 4-bit | 16 GB / 19 GB |

Download sizes are from the Ollama library listing read on 16 November 2026; files in other apps are similar. Models change often, so check the size shown before you download.

### Watch it happen: from click to first answer

<div class="steps">
<div class="step"><p><b>Check the room.</b> Ravi's laptop has <b>16 GB</b>. Windows, a browser and email already use about 5 GB, so about 11 GB is free.</p></div>
<div class="step"><p><b>Pick a file.</b> Gemma 4 E4B at 4-bit is 6.6 GB. With room for the chat: 6.6 × 1.2 ≈ <b>7.9 GB</b>. That fits in 11 GB with some to spare.</p></div>
<div class="step"><p><b>Download.</b> On a 100 Mbit/s line: 6.6 × 8,000 ÷ 100 = 528 seconds, about <b>9 minutes</b>. This is the last time the internet is needed.</p></div>
<div class="step"><p><b>Load.</b> The app copies the file from the disk into memory. Memory used jumps by about 7 GB; the first load takes 10 to 30 seconds.</p></div>
<div class="step"><p><b>Ask.</b> "Summarise this paragraph in three bullet points." The answer streams in at about <b>14 tokens per second</b>: 100 words (about 130 tokens) in about 9 seconds, faster than he reads. Wi-Fi off, same speed.</p></div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the model file has to fit in memory with room to spare for your system and the conversation.

**Equation:** free memory needed ≈ file size × 1.2. (The extra 20% holds the conversation, see Lesson 8.4.)

```math
\text{free after loading} = \text{total} - \text{in use} - 1.2 \times \text{file}
```

**Analogy:** parking a car in a garage. The car is the model file, the garage is your memory. A car that only just fits leaves no room to open the doors: everything still works, but slowly and awkwardly.

**Try it:** a 7.7 GB file? (7.7 × 1.2 ≈ 9.2 GB free. On a 16 GB laptop with a browser open, that is about right; close heavy apps first.)
</details>

<div class="meaning">

<dl>
<dt>total</dt><dd>the memory (RAM) your computer has, from Settings or About This Mac</dd>
<dt>in use</dt><dd>what the system and your open apps already take</dd>
<dt>file</dt><dd>the size of the model download in GB</dd>
<dt>1.2</dt><dd>the file plus 20% for the conversation's memory (the KV cache)</dd>
<dt>Physical meaning</dt><dd>What is left after loading is your breathing room. Above 1 or 2 GB, everything feels normal. Near zero, the computer starts using the disk as overflow and the model slows to a crawl.</dd>
</dl>

</div>

<div class="problem" data-problem="lm-studio-memory"></div>

## 4. Reading the numbers the app shows

- **Tokens per second (tok/s):** how fast it writes. Above about 10 feels smooth to read; below 5 feels slow.
- **Memory used:** if this is close to your total, close other programs or pick a smaller model.
- **GPU offload** (on PCs with a graphics card): how much of the model sits on the graphics chip. All of it is fastest. Lesson 9.7 covers what to do when it will not go there.

A token is about three quarters of an English word, so 1 word ≈ 1.3 tokens (Lesson 3.1). That lets you turn the speed into waiting time.

<div class="problem" data-problem="lm-studio-wait"></div>

<div class="myth">

**"A desktop app is a toy; real local AI needs the command line."** The app runs the very same engine (llama.cpp or MLX) as the command-line tools, at the same speed. The terminal gives you more settings and scripting, not better answers.

</div>

## 5. Worked example

*Made-up numbers.* Ravi's Windows laptop has 16 GB and no separate graphics card. He installs the app, downloads Gemma 4 E4B at 4-bit (6.6 GB) in 9 minutes, and loads it. It writes at 14 tokens per second, comfortably faster than he reads. He tries the 12B: it writes at 8 tokens per second but gives better summaries of his work emails. He keeps both and uses E4B for quick jobs and 12B when quality matters.

## 6. Practice

1. Install the app and download the Gemma 4 size from the table that fits your machine.
2. Ask the same question with Wi-Fi on and off. Note the speed both times.
3. Your laptop has 8 GB and the app says a file needs 9 GB. What do you do?

<details>
<summary>Answers</summary>

1. If the download fails, check free disk space: you need the file size plus about 10 GB spare.
2. The speed should be the same. The internet plays no part in answering.
3. Pick a smaller model (E2B) or a smaller quantisation. A file bigger than your memory will either refuse to load or crawl.
</details>

**New words:** *engine* (the program that runs the model), *load* (copy the model into memory), *GPU offload* (putting the model on the graphics chip), *Q4_K_M* (a common 4-bit file type).

<div class="keypoints">

- A desktop app such as LM Studio bundles a model catalogue, an engine and a chat window.
- Pick the Gemma 4 size for your memory (8 GB: E2B; 16 GB: E4B or 12B; 32 GB Mac or 24 GB card: 26B A4B or 31B), at 4-bit.
- Memory needed ≈ file × 1.2; keep a GB or two free after loading.
- Above about 10 tokens per second the text appears faster than you read; waiting time ≈ words × 1.3 ÷ speed.
- Once downloaded, the model answers with the Wi-Fi off at the same speed.

</div>
