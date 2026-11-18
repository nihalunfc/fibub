---
title: Your computer as an AI server
summary: Every local engine can answer programs at a local address. Learn the addresses, test one with a single command, and see why the OpenAI-style format matters.
minutes: 20
updated: 2026-11-18
sources:
  - 'Ollama API and OpenAI compatibility, https://docs.ollama.com'
  - 'llama.cpp server, https://github.com/ggml-org/llama.cpp'
quiz:
  - q: Which address does Ollama answer on by default?
    choices: ['http://localhost:11434', 'https://ollama.com/api', 'http://localhost:80']
    ans: 0
    why: Ollama listens on port 11434 of your own machine. The OpenAI-style routes are under /v1 on the same port.
  - q: Why is the OpenAI-style API format useful?
    choices: ['It sends your data to OpenAI', 'Most engines and many tools speak it, so one program can talk to any of them', 'It is faster']
    ans: 1
    why: It is a shared format, not a connection to OpenAI. Code written for it works with Ollama, LM Studio, llama.cpp, vLLM and many cloud services.
  - q: Can other computers on your network reach localhost:11434 on your machine?
    choices: ['Yes, always', 'No, by default it only answers your own computer', 'Only on Sundays']
    ans: 1
    why: Servers bind to localhost by default for safety. Opening them to the network is a deliberate step (Module 15).
---

**Module 11 · about 20 minutes · read first: 9.2 or 9.3.** You'll be able to find your engine's local address and test it with one command.

## 1. Why this matters

Chatting is the start. The real power comes when your own programs send work to the model: a script that summarises 200 files, a spreadsheet macro, a nightly report. They all reach the model the same way, through a local address.

## 2. The addresses

| Engine | Default address | OpenAI-style routes |
|---|---|---|
| Ollama | `http://localhost:11434` | `http://localhost:11434/v1` |
| LM Studio (start its server first) | `http://localhost:1234` | `http://localhost:1234/v1` |
| llama.cpp `llama-server` | `http://localhost:8080` (or your `--port`) | `http://localhost:8080/v1` |
| MLX `mlx_lm.server` | `http://localhost:8080` (or your `--port`) | `http://localhost:8080/v1` |

**localhost** means "this computer". Nothing leaves it.

## 3. Test it with one command

With Ollama running and `gemma4:e4b` pulled, paste this into a terminal on Mac or Linux:

```
curl http://localhost:11434/api/chat -d '{"model": "gemma4:e4b", "messages": [{"role": "user", "content": "Say hello in five words."}], "stream": false}'
```

On Windows PowerShell, use this instead:

```
Invoke-RestMethod http://localhost:11434/api/chat -Method Post -ContentType "application/json" -Body '{"model": "gemma4:e4b", "messages": [{"role": "user", "content": "Say hello in five words."}], "stream": false}'
```

You get back a block of JSON with the answer inside `message.content`. That block is all any program needs.

## 4. The shape of a request

Every chat request, local or cloud, has the same three parts:

- **model**: which model to use;
- **messages**: the conversation so far, each with a **role** (`system` for standing instructions, `user` for you, `assistant` for the model's earlier replies) and **content**;
- **options**: settings such as temperature and maximum length (Lesson 10.1).

The **OpenAI-style** format (the routes under `/v1`) is the same idea with slightly different names. It is a common format, not a connection to OpenAI: code written for it works with every engine above and with many cloud services. Lesson 11.4 uses that to switch between local and cloud by changing one setting.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a server is a function your programs call by address.

**Equation:** answer = f(model, messages, options), where f runs on localhost.

**Analogy:** a vending machine in your own kitchen. Every caller presses the same buttons (the request format) and gets a result out of the same slot; nobody needs to know how it works inside.

**Try it:** a script sends 3 messages (system, user, assistant) plus one new user message. How many messages are in the request? (4. The model sees the whole conversation every time, Lesson 3.3.)
</details>

## 5. Worked example

*Made-up numbers.* Ana writes a 10-line script that sends each customer email in a folder to `localhost:11434` and asks for "the customer's request in one sentence". 120 emails take 6 minutes on her laptop, and none of them leave it.

## 6. Practice

1. Run the test command for your engine and find the answer text in the reply.
2. Change the question and add `"options": {"temperature": 0}` to the request. Run it twice. Are the answers the same?
3. Your LM Studio server is on port 1234. What base address would OpenAI-style code use?

<details>
<summary>Answers</summary>

1. Look for `"content":` inside `"message"`.
2. Usually yes: temperature 0 makes the model pick the most likely word each time (Lesson 10.1).
3. `http://localhost:1234/v1`.
</details>

**New words:** *API* (the agreed way programs talk to a service), *endpoint* or *route* (one address on the server, such as /api/chat), *JSON* (the text format for structured data), *role* (system, user or assistant).
