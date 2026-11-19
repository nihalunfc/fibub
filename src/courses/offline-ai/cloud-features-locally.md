---
title: Every cloud feature and its local equivalent
seoTitle: Cloud AI features and their local versions | Offline AI
summary: Chat, files, projects, memory, web search, code, voice, images, video, apps and sync. For each cloud feature, the local tool that does the same job, how close it gets, and which lesson shows you how.
minutes: 20
updated: 2026-11-19
sources:
  - 'Open WebUI features: documents, web search, tools, voice (official documentation), https://docs.openwebui.com'
  - 'whisper.cpp (offline speech to text), https://github.com/ggml-org/whisper.cpp'
  - 'Piper (offline text to speech), https://github.com/OHF-Voice/piper1-gpl'
  - 'ComfyUI (local image and video generation), https://github.com/comfyanonymous/ComfyUI'
  - 'SearXNG (self-hosted search that Open WebUI can call), https://docs.searxng.org'
quiz:
  - q: Which local tool most closely matches the cloud chat website, with history and accounts?
    choices: ['A chat front end such as Open WebUI', 'A spreadsheet', 'The terminal only']
    ans: 0
    why: Open WebUI (Lesson 9.5) gives chats, history, accounts, documents and model switching.
  - q: You add web search to a local chat. What changes about privacy?
    choices: ['Your search queries now go to a search engine, even though the model stays local', 'Nothing at all', 'Everything goes to the cloud model']
    ans: 0
    why: The model is local, but each search sends the query out. Use it only where that is acceptable.
  - q: Which cloud feature is hardest to match at home today?
    choices: ['High-quality video generation at cloud speed', 'Chat history', 'Copying text']
    ans: 0
    why: Local video models exist but need strong hardware and time; cloud services are faster and higher quality.
---

**Module 17 · about 20 minutes · read first: 9.5.** You'll be able to rebuild the cloud features you rely on with local tools, and know which ones are not worth the effort.

## 1. Why this matters

People rarely use a cloud AI for "just the model". They use projects, file uploads, voice, search and the phone app. Going local works when you replace the features you actually use, not all of them.

## 2. The map

| Cloud feature | Local equivalent | How close | Lesson |
|---|---|---|---|
| Chat website with history | Open WebUI, LM Studio | Very close | 9.1, 9.5 |
| Accounts for a team | Open WebUI users and groups | Very close | 15.4 |
| Upload files and ask | Open WebUI documents, your own search pipeline | Close; quality depends on retrieval | Module 12 |
| Projects (shared instructions and files) | Open WebUI workspaces, saved system prompts | Close | 10.2 |
| Memory across chats | Saved notes in the system prompt, front end memory features | Partial | 10.2 |
| Web search, deep research | Search tool via SearXNG or a search API | Partial; queries leave the machine | 13.2 |
| Code assistant in the editor | Local coding assistant extensions with Ollama or llama-server | Close for small tasks, behind on big changes | 13.3 |
| Cloud coding agent | Local agent with file and terminal tools | Partial; slower, smaller model | 13.1 to 13.8 |
| Voice in and out | whisper.cpp for listening, Piper for speaking | Close, a little less natural | 13.4 |
| Reading images and PDFs | Vision models such as Gemma 4 | Close for documents, behind on hard images | 13.5 |
| Image generation | ComfyUI or similar with open image models | Close with a good graphics card | 13.6 |
| Video generation | Open video models in ComfyUI | Far: slow and needs strong hardware | 13.6 |
| Scheduled tasks | Scripts with Task Scheduler or cron | Very close | 13.7 |
| Phone app | Open WebUI in the phone browser on your network or VPN; on-device apps | Close at home, partial away | 4.6, 15.4 |
| Sync across devices | One home server reached by every device | Close on your network | 15.4 |
| Newest knowledge | Your documents, search tool | Partial | 17.4 |
| Strongest reasoning | The biggest model your hardware fits | Behind on the hardest tasks | 17.1 |

## 3. How to choose what to rebuild

List the features you used in the last month and how often. Rebuild the top three locally. For anything you use rarely (video, deep web research), keep a cloud option rather than building it.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** effort should follow use.

**Equation:** worth building ≈ uses per month × minutes saved per use − setup hours spread over a year.

**Analogy:** fitting out a home kitchen. Buy the pans you cook with every week; borrow the fondue set.

**Try it:** a feature used 40 times a month, saving 3 minutes each, that takes 4 hours to set up? (120 minutes saved a month; the setup pays back in two months.)
</details>

## 4. Worked example

*Made-up person.* Lena, a freelance translator, used a cloud plan for chat, uploading client files, voice dictation and occasional web lookups. Locally she sets up Open WebUI with Gemma 4 (chat and files), whisper.cpp for dictation, and leaves web search off so client text never leaves. For the rare lookup she uses her normal browser. Three features rebuilt in a weekend; the one she skipped she did not miss.

## 5. Practice

1. List the cloud AI features you used this month, with rough counts.
2. Which feature in the table sends data out even in a local setup?
3. Which feature would you keep in the cloud, and why?

<details>
<summary>Answers</summary>

1. Your answer.
2. Web search (the queries), and any plug-in that calls an outside service.
3. Often video generation or deep research: rare, heavy, and much better in the cloud today.
</details>

**New words:** *front end*, *workspace*, *search tool*, *on-device app*.
