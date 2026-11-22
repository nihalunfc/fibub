---
title: 'Ollama: models from the terminal'
summary: Install Ollama, pull Gemma 4 with one command, chat in the terminal, and learn the six commands you will use every day.
minutes: 25
updated: 2026-11-22
sources:
  - 'Ollama downloads and documentation, https://ollama.com'
  - 'Gemma 4 tags and sizes in the Ollama library (gemma4:e2b, e4b, 12b, 26b-a4b, 31b), read 16 November 2026 via BenchLM, https://benchlm.ai/best/ollama-models'
  - 'Ollama FAQ: where models are stored, OLLAMA_MODELS and how ollama ps shows the CPU/GPU split (official page), https://docs.ollama.com/faq'
  - 'Ollama source code and command reference (open source, MIT licence), https://github.com/ollama/ollama'
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

<div class="bigidea">Ollama is a small program that runs in the background and serves models to you and to other programs; six short commands are all you need to download, run, check and remove them.</div>

## 1. Why this matters

Ollama runs quietly in the background and gives every other program on your machine one easy way to reach the model. It is what most of the Python in Module 11 talks to. Learning its few commands now saves you hours later.

Think of it as a kitchen behind a counter: you (or any program) hand in an order, and the kitchen cooks it with whatever model you name.

## 2. Install

- **Windows and macOS:** download the installer from **ollama.com** and run it. Ollama then runs in the background (you will see its icon).
- **Linux:** the site gives a one-line install script. Read any script before you run it.

Then open a **terminal** (a window where you type commands; Windows: Terminal or PowerShell; Mac: Terminal) and check it works:

```
ollama --version
```

Try it: lower the bits to 3 or 2, then compare one scale for everything against one per block of 32.

<figure class="fig" data-fig="@ai-quant-grid"><figcaption>Fewer bits means fewer levels, so every weight is rounded more. One outlier stretches a shared scale and crushes the small weights, which is why formats give each small block its own scale.</figcaption></figure>

## 3. Get Gemma 4 and chat

```
ollama pull gemma4:e4b
ollama run gemma4:e4b
```

The first command downloads about 6.6 GB. The second opens a chat: type a question and press Enter. Type `/bye` to leave.

Pick the tag that fits your memory, as in Lesson 9.1: `gemma4:e2b` (8 GB machines), `gemma4:e4b` or `gemma4:12b` (16 GB), `gemma4:26b-a4b` or `gemma4:31b` (24 GB graphics card or 32 GB Mac). The **tag** is the part after the colon: it picks the size or version.

Try it: choose a 32B model at 4-bit, then slide the GPU memory from none up to 24 GB.

<figure class="fig" data-fig="@ai-gpu-offload"><figcaption>Every generated token reads every layer, so the slow part (layers left on the CPU) sets the speed. Each extra layer moved to the GPU helps a little, and the last ones help most.</figcaption></figure>

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

## 6. Why the CPU/GPU split matters

`ollama ps` may show something like `30%/70% CPU/GPU`. That means part of the model did not fit on the graphics card and is running from the processor's memory, which is read several times more slowly. Every token has to read both parts, so the slow part sets the pace.

### Watch it happen: one token with a split model

An 8 GB model. The graphics card reads its memory at 300 GB/s; the processor's memory reads at 50 GB/s.

<div class="steps" data-fig="ollama-split">
<div class="step"><p><b>All on the card.</b> 8 GB ÷ 300 GB/s = 0.027 s per token: about <b>37 tokens per second</b>.</p></div>
<div class="step"><p><b>The card is too small.</b> Only 6 GB fits. Reading that part: 6 ÷ 300 = <b>0.020 s</b>.</p></div>
<div class="step"><p><b>The rest on the processor.</b> The other 2 GB: 2 ÷ 50 = <b>0.040 s</b>. A quarter of the model takes twice as long as the other three quarters.</p></div>
<div class="step"><p><b>Add them up.</b> 0.020 + 0.040 = 0.060 s per token: about <b>17 tokens per second</b>, less than half the speed. A smaller model that fits fully would be faster.</p></div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the share of the model on the slower processor sets the speed, much more than the share on the graphics chip.

**Equation:** time per token ≈ (GB on GPU ÷ GPU bandwidth) + (GB on CPU ÷ CPU bandwidth).

```math
t = \frac{G_{\text{gpu}}}{B_{\text{gpu}}} + \frac{G_{\text{cpu}}}{B_{\text{cpu}}}, \qquad \text{speed} = \frac{1}{t}
```

**Analogy:** a relay race where one runner is much slower. Even a short leg for the slow runner adds a lot to the total time.

**Try it:** an 8 GB model, 6 GB on a GPU at 300 GB/s and 2 GB on a CPU at 50 GB/s? (6 ÷ 300 + 2 ÷ 50 = 0.02 + 0.04 = 0.06 s per token, about 17 tokens per second. All on the GPU would be 8 ÷ 300 ≈ 0.027 s, about 37 tokens per second.)
</details>

<div class="meaning">

<dl>
<dt>G<sub>gpu</sub>, G<sub>cpu</sub></dt><dd>how many GB of the model sit on the graphics card and in the processor's memory</dd>
<dt>B<sub>gpu</sub>, B<sub>cpu</sub></dt><dd>how many GB per second each memory can be read (bandwidth)</dd>
<dt>t</dt><dd>the time to write one token: every part of the model is read once</dd>
<dt>speed</dt><dd>tokens per second, 1 ÷ t</dd>
<dt>Physical meaning</dt><dd>A model split between two memories is only as fast as its slow part lets it be. "100% GPU" in <code>ollama ps</code> is the goal; any CPU share is a sign to try a smaller model or quantisation.</dd>
</dl>

</div>

<div class="problem" data-problem="ollama-split"></div>

<div class="myth">

**"If most of the model is on the graphics card, I get most of the speed."** Speed is set by time, not by share. In the example above, 75% on the card still gave less than half the speed, because the 25% on the processor took twice as long as everything else.

</div>

## 7. Worked example

*Made-up numbers.* Meera has a desktop with an 8 GB graphics card. She runs `ollama run gemma4:12b` and it feels slow. `ollama ps` shows `30%/70% CPU/GPU`: the 7.7 GB file plus its working space does not fit in 8 GB. She switches to `gemma4:e4b`, `ollama ps` shows `100% GPU`, and it writes about three times faster. For harder questions she goes back to the 12B and accepts the speed.

## 8. Practice

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

<div class="keypoints">

- Ollama runs in the background and serves models to you and to other programs.
- Six commands: pull, run, list, ps, stop, rm. The tag after the colon picks the size.
- Models live in .ollama/models; set OLLAMA_MODELS to move them to another drive.
- `ollama ps` shows the CPU/GPU split; time per token = GB on GPU ÷ GPU speed + GB on CPU ÷ CPU speed.
- Aim for 100% GPU: a smaller model that fits often beats a bigger one that spills.

</div>
