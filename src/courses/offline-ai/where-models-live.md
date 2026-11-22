---
title: Where models live
summary: Hugging Face, the Ollama library and the catalogues inside desktop apps. Where to find models, how to read a model page, and who to trust.
minutes: 20
updated: 2026-11-22
sources:
  - 'Hugging Face model hub, https://huggingface.co/models'
  - 'Hugging Face Hub documentation (official page), https://huggingface.co/docs/hub/index'
  - 'Ollama model library, https://ollama.com/library'
  - 'Mitchell, M. et al. (2019), Model Cards for Model Reporting, Proceedings of the Conference on Fairness, Accountability, and Transparency https://arxiv.org/abs/1810.03993'
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

<div class="bigidea">Models live on a few big public shelves; pick a copy from a maker you can name, with a clear page and many users, and you avoid almost every bad download.</div>

## 1. Why this matters

There are hundreds of thousands of models online. The popular ones have many copies, made by many different people. Some copies are great. Some are broken. A few are unsafe.

Knowing where to look, and what to check, saves you hours and keeps bad files off your computer.

## 2. The three main shelves

Think of a model as a book. These are the libraries that lend it out:

| Where | What you find | Best for |
|---|---|---|
| **Hugging Face** (huggingface.co) | Original models from their makers, plus converted versions (GGUF, MLX) by others | Choice, details, any engine |
| **Ollama library** (ollama.com/library) | Ready-to-run models with simple tags such as `gemma4:12b` | Ollama users, quick start |
| **App catalogues** (LM Studio and others) | A search inside the app, usually drawing on Hugging Face | Clicking instead of typing |

Some makers also publish on their own sites or on Kaggle.

A **publisher** is whoever uploaded a copy. A **conversion** is the same model saved in another file format (Lesson 7.5) or shrunk to a smaller size (Module 8). The model maker is one publisher; people who convert models are others.

## 3. Reading a model page

Every good model page is called a **model card**. It is like the label on a medicine box: who made it, what is inside, and what it is for. A model card tells you:

- **who made it** and when;
- **size**: parameters, and for MoE models, active parameters;
- **context length**;
- **licence** (Lesson 7.2): what you may and may not do with it;
- **intended use and limits**, languages, and known weaknesses;
- **files**: the formats and quantisations available, with sizes.

If a page has none of this, skip it.

## 4. Who to trust

Prefer, in this order:

1. the **original maker** (for example Google for Gemma, Alibaba's Qwen team, OpenAI for gpt-oss);
2. **well-known converters** whose files are widely downloaded;
3. everyone else, only if you have a good reason.

Lesson 7.6 covers checking a download once you have it.

### Watch it happen: picking one download from 300

<div class="steps">
<div class="step"><p><b>Search.</b> You type "gemma 4" on Hugging Face and get about <b>300</b> results. Most are copies, fine-tunes and experiments by other people.</p></div>
<div class="step"><p><b>Start at the maker.</b> You open Google's own Gemma 4 page. It names the maker, the sizes, the context length and the licence (Apache 2.0). Now you know what the real model is.</p></div>
<div class="step"><p><b>Pick a format.</b> Your app needs a GGUF file. The maker's page links to conversions; you look for a publisher you have heard of.</p></div>
<div class="step"><p><b>Check the signals.</b> Three candidate copies:</p><table class="lk-tbl"><tr><th>Copy</th><th>Licence</th><th>Format</th><th>Downloads</th></tr><tr><td>A</td><td>named</td><td>GGUF</td><td>1,200,000</td></tr><tr><td>B</td><td>none</td><td>GGUF</td><td>40</td></tr><tr><td>C</td><td>named</td><td>.pt</td><td>9,000</td></tr></table><p>Only A passes every check.</p></div>
<div class="step"><p><b>Choose the size.</b> Inside copy A you pick the <b>Q4_K_M</b> file that fits your memory (Lesson 8.5). Then you download it once and keep it.</p></div>
</div>

<div class="problem" data-problem="where-models-live-shortlist"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** trust grows with independent checks: a known maker, many users, and matching file fingerprints.

**Equation:** risk ≈ chance of a bad file × how much the file can do on your machine.

**Analogy:** buying medicine. A pharmacy brand with a sealed box beats an unlabelled bottle from a stranger, even if the label says the same thing.

**Try it:** two copies of a model, one downloaded 2 million times from the maker, one 40 times from an unknown account. Which first? (The maker's.)
</details>

<div class="meaning">

<dl>
<dt>Chance of a bad file</dt><dd>how likely this copy is broken, fake or booby-trapped. Low for the maker's own page, higher for unknown accounts.</dd>
<dt>What the file can do</dt><dd>data-only files (GGUF, safetensors) can only hold numbers; older pickle files can run code when opened.</dd>
<dt>Risk</dt><dd>the two multiplied: a safe format from a known maker is close to zero.</dd>
<dt>Physical meaning</dt><dd>Every check you add (maker, licence, downloads, format) cuts the chance of trouble. Thousands of other people using the same file have, in effect, tested it for you.</dd>
</dl>

</div>

<div class="myth">

**"Newer upload, better model."** A copy uploaded an hour ago is not an improved model; often it is a re-upload with a catchy name and no details. The model itself only changes when the maker releases a new version, and the maker's page will say so.

</div>

## 5. Worked example

*Made-up numbers.* Kwame searches "gemma 4" on Hugging Face and finds 300 results. He filters to the maker's own page, reads the card (Apache 2.0 licence, 256K context for the 31B), then picks a GGUF conversion by a well-known publisher with over a million downloads, at Q4_K_M.

How long will it take? Model files are big, so the download time is worth knowing. A 7.7 GB file on a 100 Mbit/s line: 7.7 × 8,000 = 61,600 megabits, ÷ 100 = 616 seconds, about 10 minutes.

<div class="problem" data-problem="where-models-live-download"></div>

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

<div class="keypoints">

- Three main shelves: Hugging Face (most choice), the Ollama library (ready to run) and the catalogue inside your desktop app.
- A model card says who made the model, its size, context, licence, limits and files. No card, no download.
- Trust in order: the original maker, then well-known converters with many downloads, then others only with good reason.
- Download time in minutes ≈ GB × 8,000 ÷ your speed in Mbit/s ÷ 60.

</div>
