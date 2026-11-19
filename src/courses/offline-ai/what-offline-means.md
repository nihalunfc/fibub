---
title: What "offline" really means
summary: Download once, run forever. What needs the internet during setup, what never does, and what always will.
minutes: 20
updated: 2026-11-18
quiz:
  - q: You have downloaded a model and its app. The Wi-Fi goes down. What happens when you ask it a question?
    choices: ['It stops working until the Wi-Fi is back', 'It answers as normal', 'It answers, but only in short sentences']
    ans: 1
    why: Once the files are on your machine, the model runs entirely on it. The internet is not part of answering.
  - q: Which of these still needs an internet connection, even with a local model?
    choices: ['Summarising a PDF on your laptop', 'Translating a paragraph', "Looking up today's news on the web"]
    ans: 2
    why: The model only knows what it learned before its cut-off date and what you give it. Live news has to be fetched from the internet.
  - q: About how big is a typical download for a model that runs well on a 16 GB laptop?
    choices: ['About 5 to 10 MB', 'About 5 to 10 GB', 'About 5 to 10 TB']
    ans: 1
    why: Models for laptops are a few gigabytes. Small models are 1 to 3 GB; very large ones reach 60 GB and more.
---

**Module 1 · about 20 minutes · read first: 1.2.** You'll be able to say exactly which steps need the internet, and plan a setup that keeps working when the connection does not.

## 1. Why this matters

"Offline" is the reason many people want local AI: on a plane, at a remote site, in a secure office, or simply when the broadband drops. But "offline" has fine print. Knowing it saves you from finding out at the worst moment that one piece still wanted the internet.

## 2. Two phases: setup and use

Local AI has two phases.

**Setup (online, once).** You download the program that runs models (an app such as LM Studio or Ollama) and one or more model files. A small model is 1 to 3 GB; a good laptop model is about 5 to 10 GB; the largest you might run at home are 60 GB or more. Downloading them is the only heavy internet use.

**Use (offline, every day).** You type, the program loads the model into memory, and the answer is worked out by your own processor. No connection is needed and nothing is sent anywhere.

<!--fig:what-travels-->

## 3. What still needs the internet

A model is frozen at the moment it was trained. It cannot know what happened after that date (its **knowledge cut-off**), and it cannot reach out to the world unless you connect it to something that can. So these still need a connection:

- searching the web, reading live prices, news or weather;
- sending email or messages on your behalf;
- downloading a newer model or an update to the app.

Later modules show how to bring some of these inside your machine: an offline copy of an encyclopedia, your own documents (Module 12), offline speech (13.4).

## 4. Traps that break "offline"

Some setups look offline but quietly are not:

- **Apps that check for updates or send usage reports.** Many let you switch this off; Lesson 9.6 shows how to test by pulling the cable.
- **Plug-ins and extensions** that call a cloud service, for example a "web search" tool switched on by default.
- **Models that are not fully downloaded.** Some programs fetch parts of a model the first time you use it. Run each model once before you go offline.
- **Python libraries** that download extra files on first use. Lesson 9.6 shows how to pre-fetch them.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** download time depends on file size and connection speed; it happens once, so plan it on a fast connection.

**Equation:** time (seconds) = size (GB) × 8,000 ÷ speed (Mbit/s). (1 GB = 8,000 megabits.)

**Analogy:** filling a water tank. The tank is the model size, the pipe is your connection. Once the tank is full, you can draw water for years without the pipe. It breaks down because some apps keep a small pipe open for updates unless you close it.

**Try it:** an 8 GB model on a 50 Mbit/s connection? (8 × 8,000 ÷ 50 = 1,280 seconds, about 21 minutes.)
</details>

## 5. Worked example

*Made-up numbers.* Tom is a field engineer who spends weeks on a site with no signal. Before leaving he downloads an app (0.5 GB), a general model (7 GB) and an offline speech-to-text model (1.5 GB): 9 GB in all. On his home connection of 100 Mbit/s that takes 9 × 8,000 ÷ 100 = 720 seconds, 12 minutes. He then switches Wi-Fi off and checks each tool works before he goes. On site he dictates notes, and the laptop turns them into tidy reports, with nothing sent anywhere.

## 6. Practice

1. How long would a 20 GB model take on a 30 Mbit/s connection?
2. Name two things you do with AI that would still need the internet.
3. Your laptop has 256 GB of storage with 40 GB free. Could you keep three models of 8 GB each and still have room to work?

<details>
<summary>Answers</summary>

1. 20 × 8,000 ÷ 30 ≈ 5,333 seconds, about 89 minutes.
2. Anything live: today's prices, news, flight times, or anything that sends messages.
3. Yes: 24 GB for models leaves 16 GB. It is tight; keep at least 10 to 20 GB free so the system runs smoothly.
</details>

**New words:** *knowledge cut-off* (the last date the model learned about), *setup phase* and *use phase*, *Mbit/s* (megabits per second, how internet speed is quoted).
