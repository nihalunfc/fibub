---
title: 'llama.cpp: the engine underneath'
summary: Run a GGUF model file directly with llama.cpp, start its built-in web chat and server, and learn the settings that matter most.
minutes: 25
updated: 2026-11-22
sources:
  - 'llama.cpp (open source, MIT licence), https://github.com/ggml-org/llama.cpp'
  - 'llama.cpp server: built-in web chat and OpenAI-style API, project documentation (official page), https://github.com/ggml-org/llama.cpp/tree/master/tools/server'
  - 'llama.cpp build guide: CUDA, Vulkan, Metal and CPU builds (official page), https://github.com/ggml-org/llama.cpp/blob/master/docs/build.md'
quiz:
  - q: What does the -ngl setting control in llama.cpp?
    choices: ['How many layers of the model go on the graphics card', 'The language of the answers', 'How long the answer can be']
    ans: 0
    why: -ngl (number of GPU layers) moves layers to the graphics card. A large number such as 99 means "as many as fit".
  - q: Why use llama.cpp directly instead of a desktop app?
    choices: ['It is the only way to run Gemma 4', 'Full control of every setting, and it runs on servers with no screen', 'It needs no model file']
    ans: 1
    why: Apps are built on engines like llama.cpp. Using it directly gives you every option and works on headless servers.
  - q: What does -c 8192 set?
    choices: ['8,192 users', 'A context window of 8,192 tokens', '8,192 MB of memory']
    ans: 1
    why: -c sets the context size in tokens. Bigger contexts hold more text but use more memory (Lesson 8.4).
---

**Module 9 · about 25 minutes · read first: 9.2.** You'll be able to run a model file with llama.cpp, open its web chat, and set the three options that matter most.

<div class="bigidea">llama.cpp is the engine inside most local AI apps; run it yourself and three settings, the file, the context length and how many layers go on the graphics card, decide whether a model fits and how fast it writes.</div>

## 1. Why this matters

Most desktop apps, and Ollama itself in parts, are built on **llama.cpp**, an open-source engine. Using it directly means no hidden defaults: you choose exactly how much goes on the graphics card, how long the context is and which port it serves on. It is also how you run models on a server with no screen.

If a desktop app is a car with an automatic gearbox, llama.cpp is the same engine with a manual one.

## 2. Install

- **Windows:** `winget install llama.cpp`, or download a ready-made build from the project's GitHub Releases page (pick the one for your graphics card: CUDA for NVIDIA, Vulkan for most others, CPU if unsure).
- **macOS:** `brew install llama.cpp` (with Homebrew installed).
- **Linux:** a package from your distribution, a release download, or build it from source.

Check it: `llama-cli --version`.

## 3. Get a model file

llama.cpp runs **GGUF** files. Two ways to get one:

- Reuse a file you already downloaded in an app (Lesson 9.1 shows where the app keeps them).
- Let llama.cpp download one from Hugging Face with `-hf <publisher>/<model>-GGUF`. Search Hugging Face for "gemma 4 gguf" and pick a repository from Google or a well-known publisher (Lesson 7.6 covers safe downloads). Copy its exact name.

## 4. Run it

Chat in the terminal:

```
llama-cli -m gemma-4-e4b-Q4_K_M.gguf -c 8192 -ngl 99
```

Start the server, which also gives you a chat page in the browser:

```
llama-server -m gemma-4-e4b-Q4_K_M.gguf -c 8192 -ngl 99 --port 8080
```

Then open `http://localhost:8080` in your browser. The same address answers programs (Module 11). Your file name will differ: use the one you downloaded.

**localhost** means "this same computer". The **port** (8080 here) is a number that picks which program on the computer answers, like a flat number in a building.

| Setting | What it does | Start with |
|---|---|---|
| `-m` | The model file | your GGUF file |
| `-c` | Context length in tokens | 8192 |
| `-ngl` | Layers on the graphics card | 99 (as many as fit) |
| `--port` | The address number for the server | 8080 |
| `-t` | Processor threads | leave out at first |

## 5. How -ngl splits the model

A model is a stack of **layers**, slices that each do part of the work, one after another. `-ngl` (number of GPU layers) says how many of them go on the graphics card. The rest stay with the processor.

### Watch it happen: placing 40 layers on a 6 GB card

<div class="steps" data-fig="llama-cpp-layers">
<div class="step"><p><b>The file.</b> An 8 GB GGUF with 40 layers. Each layer is about 8 ÷ 40 = <b>0.2 GB</b>.</p></div>
<div class="step"><p><b>The card.</b> 6 GB of graphics memory. Keep about <b>1 GB</b> for the context (8,192 tokens), so 5 GB is left for layers.</p></div>
<div class="step"><p><b>Fill it.</b> 5 ÷ 0.2 = <b>25 layers</b> fit on the card. They are read at graphics-card speed.</p></div>
<div class="step"><p><b>The rest.</b> The other <b>15 layers</b> (3 GB) run on the processor, more slowly. Every token passes through all 40, so the slow ones hold things up (Lesson 9.2).</p></div>
<div class="step"><p><b>The setting.</b> <code>-ngl 25</code> does exactly this. <code>-ngl 99</code> means "as many as fit", and llama.cpp works it out for you.</p></div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a model is a stack of layers; each layer you move to the graphics card is read at graphics-card speed.

**Equation:** layers that fit ≈ (graphics memory − room for context) ÷ (file size ÷ number of layers).

```math
n_{\text{gpu}} = \left\lfloor \frac{V - R}{F / N} \right\rfloor
```

**Analogy:** loading boxes into a fast van and a slow trailer. Every box in the van arrives sooner; you load the van first and only use the trailer for what is left.

**Try it:** an 8 GB file with 40 layers, 6 GB of graphics memory and 1 GB set aside for context? (Each layer is 0.2 GB; 5 ÷ 0.2 = 25 layers on the graphics card, 15 on the processor.)
</details>

<div class="meaning">

<dl>
<dt>F</dt><dd>the size of the GGUF file in GB</dd>
<dt>N</dt><dd>how many layers the model has (it is in the model card, and llama.cpp prints it when loading)</dd>
<dt>V</dt><dd>your graphics card's memory in GB</dd>
<dt>R</dt><dd>memory kept for the context's KV cache and the engine</dd>
<dt>⌊ ⌋</dt><dd>round down: only whole layers can move</dd>
<dt>Physical meaning</dt><dd>The number of layers on the card is the number of boxes in the fast van. Every layer you can add there makes each token a little quicker; when they all fit, you get the card's full speed.</dd>
</dl>

</div>

<div class="problem" data-problem="llama-cpp-layers"></div>

<div class="myth">

**"-ngl 99 means the model needs 99 layers" or "it forces everything onto the card."** 99 is just a number bigger than most models' layer count, so it means "put every layer you can on the card". If they do not all fit, llama.cpp puts as many as it can and leaves the rest on the processor.

</div>

## 6. Worked example

*Made-up numbers.* Sam's office has an old Linux server with a 12 GB graphics card and no monitor. He copies a 7.7 GB Gemma 4 12B file to it over the network, runs `llama-server` with `-ngl 99 -c 8192 --port 8080`, and opens `http://<server-address>:8080` from his laptop. The whole office can now try it in a browser (Module 15 shows how to do that safely).

## 7. Practice

1. Install llama.cpp and run `llama-cli --version`.
2. Start `llama-server` with a model you have and open the web chat.
3. Halve `-c` and compare the memory used in your system monitor.

<details>
<summary>Answers</summary>

1. If Windows says the command is not found, open a new terminal after installing.
2. If the page does not open, check the terminal for the line saying the server is listening, and the port.
3. Memory use drops a little: the context cache shrinks. The model itself stays the same size.
</details>

**New words:** *GGUF* (the model file format llama.cpp uses), *layer* (one slice of the model's stack), *port* (the number that picks which program on a machine answers), *localhost* (this same computer).

<div class="keypoints">

- llama.cpp is the open-source engine inside most local AI apps; it runs GGUF files.
- `llama-cli` chats in the terminal; `llama-server` gives a browser chat at localhost:8080 and an API for programs.
- The three settings that matter: `-m` (file), `-c` (context in tokens), `-ngl` (layers on the graphics card).
- Layers that fit ≈ (card memory − context room) ÷ (file size ÷ layers), rounded down.

</div>
