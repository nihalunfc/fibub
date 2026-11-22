---
title: A server for a team or office
summary: Sharing one local AI machine with a team over the office network. What size to buy, how many people it can serve and what to set up.
minutes: 20
updated: 2026-11-22
sources:
  - 'Ollama server and network settings (OLLAMA_HOST), Ollama documentation (official page), https://docs.ollama.com'
  - 'vLLM, a serving engine built for many users, project documentation (official page), https://docs.vllm.ai'
  - 'Kwon, W. et al. (2023), Efficient Memory Management for Large Language Model Serving with PagedAttention (the paper behind vLLM), arXiv:2309.06180 https://arxiv.org/abs/2309.06180'
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

<div class="bigidea">People who type, read and think only keep a model busy a small share of the time, so one machine that is fast for one person can serve a whole small office.</div>

## 1. Why this matters

Buying one strong machine for five people often costs less than five strong laptops, and keeps data in one place you control. It needs a little planning: memory for the model, speed for the moments when requests overlap, and network safety.

## 2. How many people can one machine serve?

Think of the office kettle. Ten people share one kettle happily, because they rarely all want tea at the same moment, except at 11 o'clock. An AI machine is the same. Office use is **bursty**: people type, read and think between questions. If each person keeps the model busy about 5% of the working day, a machine that is fast for one person can serve 10 to 20 light users. Heavy users (agents, batch jobs, coding assistants) need more, and a serving engine that **batches** requests (handles several at once, Module 15).

<div class="steps" data-fig="team-server-busy">
<div class="step"><b>Twelve light users.</b> Each row is one person over an hour. The marks show the minutes when they are waiting on the model, about 5% of the time each.</div>
<div class="step"><b>Count the overlaps.</b> The strip underneath counts how many people are busy in each minute. Most minutes nobody is; red means two or more at once.</div>
<div class="step"><b>The maths.</b> On average 12 × 0.05 = 0.6 people are busy. Nobody is busy 54% of the time, one person 34%, two or more only 12%.</div>
<div class="step"><b>Twelve heavy users.</b> If each is busy 20% of the time (coding assistants, agents), the average is 2.4, and two or more are busy 73% of the time. Now batching or a second machine is needed.</div>
</div>

With `$n$` users, each busy a share `$p$` of the time:

```math
\text{average busy at once} = n \times p, \qquad P(\text{nobody busy}) = (1 - p)^n
```

<div class="problem" data-problem="team-server-busy"></div>

<div class="meaning">

<dl>
<dt>n</dt><dd>The number of people who share the machine.</dd>
<dt>p</dt><dd>The share of the working day each person keeps the model busy, as a decimal (5% = 0.05).</dd>
<dt>n × p</dt><dd>How many people are using it at the same moment, on average.</dd>
<dt>(1 − p)<sup>n</sup></dt><dd>The chance that nobody is using it at a random moment.</dd>
<dt>Physical meaning</dt><dd>A shared machine is like one kettle for an office: most of the time it sits idle, sometimes one person uses it, and only at the busiest moments does anyone queue. Size for those busy moments, not for the number of names on the list.</dd>
</dl>

</div>

<div class="problem" data-problem="team-server-idle"></div>

<div class="myth">

**"Ten users need ten times the machine."** Only if all ten ask at the same moment all day. Light office users overlap rarely, so one machine that is fast for one person often feels personal-speed to all of them. Heavy, constant users are the exception.

</div>

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

<div class="keypoints">

- Office use is bursty: n users each busy a share p of the time means about n × p busy at once.
- Below about 1 busy at once, one machine that is fast for one person serves the whole team.
- Heavy users (agents, coding assistants) need a batching serving engine such as vLLM, or more machines.
- Keep the server on the office network with logins; never open its port to the internet.

</div>
