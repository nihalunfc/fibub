---
title: A server for a team or office
summary: Sharing one local AI machine with a team over the office network. What size to buy, how many people it can serve and what to set up.
minutes: 20
updated: 2026-11-19
sources:
  - 'Ollama server and network settings (OLLAMA_HOST), Ollama documentation (official page), https://docs.ollama.com'
  - 'vLLM, a serving engine built for many users, project documentation (official page), https://docs.vllm.ai'
quiz:
  - q: Five people share one machine but rarely ask at the same moment. What decides whether it feels fast?
    choices: ['Mostly the speed for one person, since requests rarely overlap', 'The number of hard disks', 'The keyboard']
    ans: 0
    why: Most office use is bursty. Single-user speed matters most; batching (Module 15) helps when requests overlap.
  - q: What should you never do with an office AI server?
    choices: ['Put it on the office network', 'Open its port to the whole internet without a login', 'Give it a fixed address']
    ans: 1
    why: An open port lets anyone use it and see what it is sent. Keep it inside the office network or behind a login.
  - q: Which engine is built to serve many users at once?
    choices: ['vLLM and similar serving engines', 'A notepad app', 'A web browser']
    ans: 0
    why: Serving engines batch many requests together. Ollama and LM Studio are simpler and fine for small teams.
---

**Module 5 · about 20 minutes · read first: 5.4 and 11.1.** You'll be able to size and set up one machine that a small team shares.

## 1. Why this matters

Buying one strong machine for five people often costs less than five strong laptops, and keeps data in one place you control. It needs a little planning: memory for the model, speed for overlapping requests, and network safety.

## 2. How many people can one machine serve?

Office use is bursty: people type, read and think. If each person keeps the model busy about 5% of the working day, a machine that is fast for one person can serve 10 to 20 light users. Heavy users (agents, batch jobs, coding assistants) need more, and a serving engine that **batches** requests (Module 15).

## 3. Sizing

- **2 to 5 light users, 12B to 27B model:** a desktop with a 24 to 32 GB card, or a 48 to 64 GB Mac mini.
- **5 to 20 users, large model:** a 128 GB box (Lesson 5.4), or a PC with two graphics cards.
- **Many users or heavy agents:** a server-class machine and a serving engine such as vLLM (Lesson 15.2).

## 4. Setting it up safely

1. Give the machine a fixed address on the office network.
2. Let the server listen on the network (Ollama: `OLLAMA_HOST=0.0.0.0`; LM Studio: "Serve on local network"; Lesson 11.1).
3. Share a chat front end such as Open WebUI with user logins (Lesson 9.5).
4. **Never** open the port to the internet. For remote staff, use the office VPN.
5. Decide what is logged, tell staff, and keep logs only as long as needed.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** size for the busiest few minutes, not the average day.

**Equation:** with n users each busy a share p of the time, the expected number busy at once is n × p.

**Analogy:** a single office kettle. Ten people can share it because they rarely all want tea at the same moment, except at 11 o'clock.

**Try it:** 12 users each busy 5% of the time? (12 × 0.05 = 0.6 busy at once on average: usually zero or one, occasionally two.)
</details>

## 5. Worked example

*Made-up numbers.* Riverbend Accounting has eight staff. They buy a 64 GB Mac mini M5 Pro, run Ollama with a 27B model and Open WebUI with logins, and keep it on the office network only. Each person waits a second or two more at the 9 a.m. rush, otherwise answers feel personal-speed.

## 6. Practice

1. Estimate n × p for your team.
2. Why is a login on the chat front end important even inside the office?
3. Which setting lets Ollama accept requests from other office computers?

<details>
<summary>Answers</summary>

1. Below 1: one strong machine is plenty. Above 2: plan batching or a second machine.
2. It keeps each person's chats separate and shows who used what.
3. `OLLAMA_HOST=0.0.0.0` (inside the office network only).
</details>

**New words:** *server*, *bursty use*, *batching*, *VPN* (a private tunnel into the office network).
