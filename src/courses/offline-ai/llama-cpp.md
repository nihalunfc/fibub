---
title: 'llama.cpp: the engine underneath'
summary: Run a GGUF model file directly with llama.cpp, start its built-in web chat and server, and learn the settings that matter most.
minutes: 25
updated: 2026-11-18
sources:
  - 'llama.cpp (open source, MIT licence), https://github.com/ggml-org/llama.cpp'
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

## 1. Why this matters

Most desktop apps, and Ollama itself in parts, are built on **llama.cpp**, an open-source engine. Using it directly means no hidden defaults: you choose exactly how much goes on the graphics card, how long the context is and which port it serves on. It is also how you run models on a server with no screen.

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

| Setting | What it does | Start with |
|---|---|---|
| `-m` | The model file | your GGUF file |
| `-c` | Context length in tokens | 8192 |
| `-ngl` | Layers on the graphics card | 99 (as many as fit) |
| `--port` | The address number for the server | 8080 |
| `-t` | Processor threads | leave out at first |

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a model is a stack of layers; each layer you move to the graphics card is read at graphics-card speed.

**Equation:** layers that fit ≈ (graphics memory − room for context) ÷ (file size ÷ number of layers).

**Analogy:** loading boxes into a fast van and a slow trailer. Every box in the van arrives sooner; you load the van first and only use the trailer for what is left.

**Try it:** an 8 GB file with 40 layers, 6 GB of graphics memory and 1 GB set aside for context? (Each layer is 0.2 GB; 5 ÷ 0.2 = 25 layers on the graphics card, 15 on the processor.)
</details>

## 5. Worked example

*Made-up numbers.* Sam's office has an old Linux server with a 12 GB graphics card and no monitor. He copies a 7.7 GB Gemma 4 12B file to it over the network, runs `llama-server` with `-ngl 99 -c 8192 --port 8080`, and opens `http://<server-address>:8080` from his laptop. The whole office can now try it in a browser (Module 15 shows how to do that safely).

## 6. Practice

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
