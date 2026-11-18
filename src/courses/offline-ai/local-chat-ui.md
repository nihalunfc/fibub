---
title: A chat window that runs on your machine
summary: Give your local model a ChatGPT-style window with history, file uploads and several models, all running on your own computer.
minutes: 20
updated: 2026-11-18
sources:
  - 'Open WebUI (open source chat interface for local models), https://github.com/open-webui/open-webui'
  - 'Ollama desktop app, https://ollama.com'
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

## 1. Why this matters

The terminal is fine for testing, but for daily use you want what the cloud sites give you: a list of past chats, a model picker, file uploads, and a page your family or team can open. You can have all of that on your own machine.

## 2. Three options, from simplest

1. **The app you already have.** LM Studio has a chat window built in, and the Ollama desktop app has a simple one too.
2. **llama.cpp's own page.** `llama-server` serves a clean chat page at `http://localhost:8080` (Lesson 9.3).
3. **Open WebUI**, a free, open-source interface that looks and feels like the cloud chat sites, with chat history, several models, document upload and user accounts for a team. It talks to Ollama, or to any server that speaks the OpenAI-style API (Lesson 11.1).

## 3. Install Open WebUI

It is a Python program. It needs a recent Python (its install page names the version; at the time of writing it asks for Python 3.11). With Ollama already running:

```
python -m venv webui-env
# Windows: webui-env\Scripts\activate    Mac/Linux: source webui-env/bin/activate
pip install open-webui
open-webui serve
```

Open `http://localhost:8080`, create the first account (it stays on your machine and becomes the admin), and your Ollama models appear in the model picker. If something else already uses port 8080, start it with `open-webui serve --port 8081`.

Its pages also explain a Docker install, which many people prefer for keeping it updated; either way works.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the interface and the engine are separate programs that talk over a local address, so either can be swapped.

**Equation:** what you see = interface(engine(model, your messages)).

**Analogy:** a TV and a set-top box. Change the box and keep the TV, or the other way round, as long as both use the same cable.

**Try it:** Open WebUI on port 8080 and Ollama on 11434. Which address does your browser open? (8080. Open WebUI calls 11434 itself.)
</details>

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
