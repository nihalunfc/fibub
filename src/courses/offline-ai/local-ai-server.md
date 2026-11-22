---
title: Your computer as an AI server
summary: Every local engine can answer programs at a local address. Learn the addresses, test one with a single command, and see why the OpenAI-style format matters.
minutes: 20
updated: 2026-11-22
sources:
  - 'Ollama API and OpenAI compatibility, https://docs.ollama.com'
  - 'llama.cpp server, https://github.com/ggml-org/llama.cpp'
  - 'LM Studio developer docs: local server and OpenAI-compatible endpoints, https://lmstudio.ai/docs'
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

<div class="bigidea">Your AI engine waits at a local address on your own computer, and any program that sends it a request in the agreed format gets an answer back, without anything leaving the machine.</div>

## 1. Why this matters

Chatting is the start. The real power comes when your own programs send work to the model: a script that summarises 200 files, a spreadsheet macro, a nightly report. They all reach the model the same way, through a local address.

## 2. The addresses

| Engine | Default address | OpenAI-style routes |
|---|---|---|
| Ollama | `http://localhost:11434` | `http://localhost:11434/v1` |
| LM Studio (start its server first) | `http://localhost:1234` | `http://localhost:1234/v1` |
| llama.cpp `llama-server` | `http://localhost:8080` (or your `--port`) | `http://localhost:8080/v1` |
| MLX `mlx_lm.server` | `http://localhost:8080` (or your `--port`) | `http://localhost:8080/v1` |

**localhost** means "this computer". The number after the colon is the **port**, like a door number on the same building: each program listens behind its own door. Nothing sent to localhost leaves your computer.

Try it: pick the gaming GPU, then slide the users from 1 to 128 and find where the curves bend.

<figure class="fig" data-fig="@ai-batch-throughput"><figcaption>One token costs one read of the whole model, shared by every user in the batch, so total speed climbs almost for free while each person's speed barely drops. Once arithmetic is the limit, extra users slow everybody.</figcaption></figure>

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

<div class="steps" data-fig="local-ai-server-request">
<div class="step"><p><b>Build the request.</b> Your script writes a small block of JSON: which model, the messages, and <code>"stream": false</code>.</p></div>
<div class="step"><p><b>Send it to the local address.</b> It posts that JSON to <code>http://localhost:11434/api/chat</code>. The request travels from one program to another inside the same computer; no network cable is needed.</p></div>
<div class="step"><p><b>The engine runs the model.</b> Ollama reads the tokens, writes the answer one token at a time, and stops at the end marker.</p></div>
<div class="step"><p><b>The reply comes back.</b> Ollama sends JSON back to the script. The words are in <code>message.content</code>: "Hello there, nice day!". The script prints it, saves it or puts it in a spreadsheet.</p></div>
</div>

## 4. The shape of a request

Every chat request, local or cloud, has the same three parts:

- **model**: which model to use;
- **messages**: the conversation so far, each with a **role** (`system` for standing instructions, `user` for you, `assistant` for the model's earlier replies) and **content**;
- **options**: settings such as temperature and maximum length (Lesson 10.1).

The **OpenAI-style** format (the routes under `/v1`) is the same idea with slightly different names. It is a common format, not a connection to OpenAI: code written for it works with every engine above and with many cloud services. Lesson 11.4 uses that to switch between local and cloud by changing one setting.

<div class="myth">

**"Using the OpenAI-style address sends my data to OpenAI."** No. "OpenAI-style" only describes the shape of the request, like a standard envelope size. The address decides where it goes, and `localhost` is your own computer.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a server is a function your programs call by address.

**Equation:** answer = f(model, messages, options), where f runs on localhost. The model keeps no memory between requests, so request k carries everything so far:

```math
\text{tokens in request } k = S + (k-1)(u + a) + u
```

for a system prompt of `$S$` tokens, user messages of `$u$` tokens and replies of `$a$` tokens.

**Analogy:** a vending machine in your own kitchen. Every caller presses the same buttons (the request format) and gets a result out of the same slot; nobody needs to know how it works inside.

**Try it:** a script sends 3 messages (system, user, assistant) plus one new user message. How many messages are in the request? (4. The model sees the whole conversation every time, Lesson 3.3.)
</details>

<div class="meaning">

<dl>
<dt>localhost</dt><dd>the name every computer uses for itself; requests to it never leave the machine</dd>
<dt>port (11434, 1234, 8080)</dt><dd>the door number a program listens behind, so several servers can share one computer</dd>
<dt>endpoint (/api/chat, /v1)</dt><dd>one address on the server that does one job, such as chatting</dd>
<dt>model, messages, options</dt><dd>the three parts of every request: which model, the conversation so far, and the settings</dd>
<dt>Physical meaning</dt><dd>Your computer now has an AI desk with its own door number. Any program in the building can slide a note under the door in the agreed format and get a written answer back, and the whole exchange stays inside your walls.</dd>
</dl>

</div>

<div class="problem" data-problem="local-ai-server-resend"></div>

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

**New words:** *API* (the agreed way programs talk to a service), *endpoint* or *route* (one address on the server, such as /api/chat), *JSON* (the text format for structured data), *role* (system, user or assistant), *port* (the door number a server listens on).

<div class="keypoints">

- Every local engine answers programs at a local address: Ollama on `localhost:11434`, LM Studio on 1234, llama.cpp and MLX on 8080 by default.
- localhost means this computer; by default other machines cannot reach it and nothing leaves.
- A request has three parts: model, messages (with roles) and options; the answer comes back as JSON in `message.content`.
- The OpenAI-style format under `/v1` is a shared shape, not a link to OpenAI, so one program can talk to any engine.
- The model keeps no memory between requests: each one re-sends the whole conversation.

</div>
