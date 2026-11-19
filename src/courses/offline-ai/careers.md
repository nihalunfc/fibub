---
title: Local AI skills in job ads
summary: The local AI skills employers ask for in data, software, IT and research roles, the words they use in job ads, and how to show them with projects from this course.
minutes: 20
updated: 2026-11-19
sources:
  - 'Job boards searched for terms such as "Ollama", "vLLM", "RAG", "LLM" and "on-premise AI" (Indeed, LinkedIn Jobs, Naukri, Job Bank), November 2026; counts change daily, so search them yourself'
  - 'Lessons in Modules 9 to 15 of this course'
quiz:
  - q: Which project best shows local AI skill to an employer?
    choices: ['A working document search over real-style files, with a test set and a short write-up', 'A screenshot of a chat', 'A list of models you have heard of']
    ans: 0
    why: Employers look for something that works, is tested and is explained.
  - q: A job ad asks for "RAG". Which module covers it?
    choices: ['Module 12', 'Module 6', 'Module 2']
    ans: 0
    why: Retrieval-augmented generation is private document search (Module 12).
  - q: Why mention measured results in a CV?
    choices: ['Numbers show impact, for example "cut report time from 50 to 20 minutes"', 'CVs need numbers to be valid', 'It hides weak skills']
    ans: 0
    why: Clear, honest results are what hiring managers remember.
---

**Module 18 · about 20 minutes · read first: any of Modules 9 to 15.** You'll be able to describe your local AI skills in the words employers use, with projects to prove them.

## 1. Why this matters

Many organisations want AI but cannot send data to outside services. They need people who can run models in-house: data analysts, developers, IT staff, researchers. The skills in this course match those job ads closely.

## 2. Words in job ads, and where you learned them

| Job ad phrase | What it means | Course |
|---|---|---|
| LLM, generative AI | Large language models | Modules 2 and 3 |
| On-premise, self-hosted, private AI | Running models on the organisation's own hardware | Modules 5, 9, 15 |
| Ollama, llama.cpp, vLLM, LM Studio | Engines | Modules 9 and 15 |
| RAG, embeddings, vector database | Document search with AI | Module 12 |
| Agents, tool calling, function calling | Models that act with tools | Module 13 |
| Fine-tuning, LoRA | Teaching a model new habits | Module 14 |
| Quantisation, GGUF, inference optimisation | Making models fit and run fast | Module 8, 17.2, 17.3 |
| Prompt engineering | Writing instructions that work | Module 10 |
| Model evaluation | Testing models on real tasks | 12.7, 17.1 |
| AI governance, model risk | Rules, records, monitoring | 15.5, 17.7, 18.3 |
| Python, APIs, Docker, Linux | Tools around the models | Modules 11 and 15 |

## 3. Projects that prove it

Pick two or three, put the code on GitHub with a clear README, and write a short post about each:

1. **Private document search** over a public document set (Mini projects in Module 12), with a test set and accuracy.
2. **SQL helper** (mini project 8) against a sample database, with the questions it got right and wrong.
3. **Team server** (mini project 7) documented as a setup guide with security choices.
4. **Cost study** for a made-up company using the break-even calculator (Lesson 16.4) and a hybrid policy (Lesson 15.6).
5. **Capstone** (Lesson 18.12).

## 4. Writing it on a CV

Lead with the result, then the tools: "Built a private document search over 2,000 policy PDFs with Ollama and a local vector index; 88% of test questions answered with correct citations." Use only numbers you measured.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** show, measure, explain.

**Equation:** a strong bullet = action + tool + measured result.

**Analogy:** a cooking audition: they taste the dish, not the recipe list.

**Try it:** turn "used AI for SQL" into a strong bullet. (For example: "Built a local SQL assistant with Gemma 4 and SQLite; 17 of 20 test questions correct on first try.")
</details>

## 5. Worked scenario

*Made-up candidate.* A new graduate in data analytics adds two projects to GitHub: a document search over public government reports with a 50-question test set, and a cost study for a 20-person office. In interviews for data roles, both projects lead to long technical conversations, and one employer asks them to set up the same search for internal policies in the first month.

## 6. Practice

1. Pick two projects from section 3 to build first.
2. Write one CV bullet for a project you have done.
3. Search a job board for "Ollama" or "RAG" in your city and note three skills that keep appearing.

<details>
<summary>Answers</summary>

1. Your answer; document search is the most asked-for.
2. Action + tool + measured result.
3. Your answer; Python, RAG and Docker are common.
</details>

**New words:** *on-premise*, *self-hosted*, *portfolio project*, *README*.
