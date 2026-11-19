---
title: Where models live
summary: Hugging Face, the Ollama library and the catalogues inside desktop apps. Where to find models, how to read a model page, and who to trust.
minutes: 20
updated: 2026-11-18
sources:
  - 'Hugging Face model hub, https://huggingface.co/models'
  - 'Ollama model library, https://ollama.com/library'
quiz:
  - q: What is Hugging Face?
    choices: ['A chatbot', 'The largest public website for sharing model files and their descriptions', 'A graphics card maker']
    ans: 1
    why: Hugging Face hosts hundreds of thousands of models, each with a page (model card), files and a licence.
  - q: Two downloads of "Gemma 4 12B" come from different publishers. What should you prefer?
    choices: ['The one with the funniest name', 'The original maker or a well-known converter with many downloads and clear details', 'Whichever is newest by one hour']
    ans: 1
    why: Trusted publishers and widely used conversions are less likely to be broken or tampered with (Lesson 7.6).
  - q: Where does Ollama get the model when you run ollama pull gemma4:12b?
    choices: ['From its own library online', 'From your email', 'It writes the model itself']
    ans: 0
    why: Ollama downloads from its library, where each model has tags for sizes and versions.
---

**Module 7 · about 20 minutes · read first: 1.2.** You'll be able to find a model, read its page and judge whether to trust the download.

## 1. Why this matters

There are hundreds of thousands of models online, and many copies of the popular ones. Knowing where to look and what to check saves time and keeps broken or unsafe files off your machine.

## 2. The three main shelves

| Where | What you find | Best for |
|---|---|---|
| **Hugging Face** (huggingface.co) | Original models from their makers, plus converted versions (GGUF, MLX) by others | Choice, details, any engine |
| **Ollama library** (ollama.com/library) | Ready-to-run models with simple tags such as `gemma4:12b` | Ollama users, quick start |
| **App catalogues** (LM Studio and others) | A search inside the app, usually drawing on Hugging Face | Clicking instead of typing |

Some makers also publish on their own sites or on Kaggle.

## 3. Reading a model page

Every good model page (a **model card**) tells you:

- **who made it** and when;
- **size**: parameters, and for MoE models, active parameters;
- **context length**;
- **licence** (Lesson 7.2): what you may and may not do with it;
- **intended use and limits**, languages, and known weaknesses;
- **files**: the formats and quantisations available, with sizes.

If a page has none of this, skip it.

## 4. Who to trust

Prefer, in order: the **original maker** (for example Google for Gemma, Alibaba's Qwen team, OpenAI for gpt-oss); then **well-known converters** whose files are widely downloaded; then everyone else only if you have a good reason. Lesson 7.6 covers checking a download.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** trust grows with independent checks: a known maker, many users, and matching file fingerprints.

**Equation:** risk ≈ chance of a bad file × how much the file can do on your machine.

**Analogy:** buying medicine. A pharmacy brand with a sealed box beats an unlabelled bottle from a stranger, even if the label says the same thing.

**Try it:** two copies of a model, one downloaded 2 million times from the maker, one 40 times from an unknown account. Which first? (The maker's.)
</details>

## 5. Worked example

*Made-up numbers.* Kwame searches "gemma 4" on Hugging Face and finds 300 results. He filters to the maker's own page, reads the card (Apache 2.0 licence, 256K context for the 31B), then picks a GGUF conversion by a well-known publisher with over a million downloads, at Q4_K_M.

## 6. Practice

1. Open the Ollama library page for gemma4 and list its tags.
2. Open a Gemma 4 model card on Hugging Face. Find the licence and context length.
3. Name two warning signs on a model page.

<details>
<summary>Answers</summary>

1. You should see sizes such as e2b, e4b, 12b, 26b-a4b and 31b.
2. Licence and context are near the top of most cards.
3. No maker or licence named; very few downloads; a name copying a famous model; files in formats that can run code (Lesson 7.6).
</details>

**New words:** *model card* (a model's description page), *publisher* (who uploaded it), *conversion* (the same model in another file format).
