---
title: A chat window that runs on your machine
summary: Give your local model a ChatGPT-style window with history, file uploads and several models, all running on your own computer.
minutes: 20
updated: 2026-11-22
sources:
  - 'Open WebUI (open source chat interface for local models), https://github.com/open-webui/open-webui'
  - 'Open WebUI documentation: installing with pip or Docker and connecting to Ollama (official page), https://docs.openwebui.com'
  - 'Ollama desktop app, https://ollama.com'
  - 'llama.cpp server and its built-in chat page, project documentation (official page), https://github.com/ggml-org/llama.cpp/tree/master/tools/server'
quiz:
  - q: Where does a local chat interface such as Open WebUI keep your chats?
    choices: ['On its makers’ servers', 'On your own machine', 'In your email']
    ans: 1
    why: Run locally, it stores chats in a database file on your machine. Nothing is sent out unless you connect a cloud service.
  - q: Two programs both want port 8080. What happens?
    choices: ['They share it happily', 'The second one fails to start, so give one of them another port', 'The computer restarts']
    ans: 1
    why: Only one program can listen on a port. Use, say, --port 8081 for the second.
  - q: Which part actually runs the model when you use Open WebUI with Ollama?
    choices: ['Open WebUI', 'Ollama', 'The browser']
    ans: 1
    why: Open WebUI is the window; it passes your messages to Ollama, which runs the model.
---

**Module 9 · about 20 minutes · read first: 9.2.** You'll be able to use your local model in a full chat window with saved history and documents.

<div class="bigidea">The chat window and the engine are two separate programs on your machine that pass messages through a local address, so you get a cloud-style chat with everything, including your history, staying at home.</div>

## 1. Why this matters

The terminal is fine for testing, but for daily use you want what the cloud sites give you: a list of past chats, a model picker, file uploads, and a page your family or team can open. You can have all of that on your own machine.

## 2. Three options, from simplest

1. **The app you already have.** LM Studio has a chat window built in, and the Ollama desktop app has a simple one too.
2. **llama.cpp's own page.** `llama-server` serves a clean chat page at `http://localhost:8080` (Lesson 9.3).
3. **Open WebUI**, a free, open-source interface that looks and feels like the cloud chat sites, with chat history, several models, document upload and user accounts for a team. It talks to Ollama, or to any server that speaks the OpenAI-style API (Lesson 11.1).

Step through the pipeline from a pile of text to a cited answer.

<figure class="fig" data-fig="@ai-rag-pipeline"><figcaption>Retrieval-augmented generation does not teach the model anything new: it finds the few relevant chunks, pastes them into the prompt, and asks the model to answer from them.</figcaption></figure>

## 3. Install Open WebUI

It is a Python program. It needs a recent Python (its install page names the version; at the time of writing it asks for Python 3.11). With Ollama already running:

```
python -m venv webui-env
# Windows: webui-env\Scripts\activate    Mac/Linux: source webui-env/bin/activate
pip install open-webui
open-webui serve
```

Open `http://localhost:8080`, create the first account (it stays on your machine and becomes the **admin**, the account that manages the others), and your Ollama models appear in the model picker. If something else already uses port 8080, start it with `open-webui serve --port 8081`.

Its pages also explain a **Docker** install (Docker runs a program in a sealed box with everything it needs), which many people prefer for keeping it updated; either way works.

### Watch it happen: one message, four hops, no internet

<div class="steps">
<div class="step"><p><b>You type.</b> In the browser you open <code>http://localhost:8080</code> and ask "Plan a week of school lunches". The browser sends it to Open WebUI on port <b>8080</b>, on this same computer.</p></div>
<div class="step"><p><b>The window passes it on.</b> Open WebUI adds the earlier messages of this chat and sends the lot to Ollama on port <b>11434</b>, also on this computer.</p></div>
<div class="step"><p><b>The engine writes.</b> Ollama runs Gemma 4 12B, which writes the answer at, say, 20 tokens per second. A 400-token answer takes 20 seconds.</p></div>
<div class="step"><p><b>Back to you, and saved.</b> The words stream back through Open WebUI to your browser, and the chat is saved in a database file on your disk. At no point did anything leave the house.</p></div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the interface and the engine are separate programs that talk over a local address, so either can be swapped.

**Equation:** what you see = interface(engine(model, your messages)).

```math
\text{answers per hour} = \frac{\text{tokens per second} \times 3600}{\text{tokens per answer}}
```

**Analogy:** a TV and a set-top box. Change the box and keep the TV, or the other way round, as long as both use the same cable.

**Try it:** Open WebUI on port 8080 and Ollama on 11434. Which address does your browser open? (8080. Open WebUI calls 11434 itself.)
</details>

<div class="meaning">

<dl>
<dt>Interface</dt><dd>the window you use: chat list, model picker, uploads (Open WebUI, LM Studio's chat, llama-server's page)</dd>
<dt>Engine</dt><dd>the program that actually runs the model (Ollama, llama.cpp, MLX)</dd>
<dt>Port</dt><dd>the number that picks which program answers: 8080 for the window, 11434 for Ollama</dd>
<dt>Answers per hour</dt><dd>how many replies one engine can give, one after another, at its writing speed</dd>
<dt>Physical meaning</dt><dd>A shared chat window is like one cook serving a family: everyone gets their own plate and their own history, but the cook makes one dish at a time. Writing speed sets how many people can share it comfortably.</dd>
</dl>

</div>

<div class="problem" data-problem="local-chat-ui-queue"></div>

<div class="myth">

**"A chat window that looks like ChatGPT must be sending my chats to the cloud."** Looks say nothing about where the data goes. Run locally and connected only to Ollama, Open WebUI keeps every chat in a file on your own disk. Test it: pull the cable and it keeps working (Lesson 9.6).

</div>

Try it: press Play and watch the oldest messages fall out of the window; compare the three ways of handling a full window.

<figure class="fig" data-fig="@ai-context-slide"><figcaption>The model only sees what fits in the window. Dropping the oldest messages loses early facts like the user's name; pinning the system prompt or summarising keeps what matters at a small cost.</figcaption></figure>

## 4. Worked example

*Made-up numbers.* A family shares one desktop with a 16 GB graphics card. Dad installs Ollama and Open WebUI, pulls `gemma4:12b`, and makes accounts for three people. Each sees only their own chats. Homework help, recipes and letter drafts all stay in the house.

## 5. Practice

1. Open your app's chat window or `llama-server`'s page and save one useful chat.
2. Install Open WebUI and pick your Gemma 4 model from its list.
3. Upload a short text file and ask a question about it.

<details>
<summary>Answers</summary>

1. Any chat that saves and reopens is the goal.
2. If no models appear, check Ollama is running (`ollama list` in a terminal).
3. Open WebUI reads the file and adds the relevant parts to your question. Module 12 explains how this document search works and how to make it better.
</details>

**New words:** *interface* (the window you use), *admin* (the first account, which manages the others), *Docker* (a way to run a program in a sealed box with everything it needs).

<div class="keypoints">

- Three ways to get a chat window: your app's own, llama-server's page, or Open WebUI.
- Open WebUI is the window; Ollama (or another engine) runs the model; they talk on local ports (8080 and 11434).
- Chats and accounts are stored on your own machine.
- One program per port: if 8080 is taken, use --port 8081.
- Answers per hour = tokens per second × 3,600 ÷ tokens per answer.

</div>
