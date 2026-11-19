---
title: Open weights, open source and reading a licence
summary: What "open" means for AI models, the difference between open weights and open source, and how to check whether you may use a model for work.
minutes: 15
updated: 2026-11-19
sources:
  - 'Gemma 4 released under Apache 2.0, replacing Google''s earlier custom Gemma licence: Implicator, 2 April 2026, https://www.implicator.ai/google-releases-gemma-4-under-apache-2-0-dropping-its-custom-ai-license/'
  - 'Apache License 2.0, full text: Apache Software Foundation (official page), https://www.apache.org/licenses/LICENSE-2.0'
  - 'The Open Source AI Definition 1.0: Open Source Initiative (official page), https://opensource.org/ai/open-source-ai-definition'
quiz:
  - q: What does "open weights" usually mean?
    choices: ['You can download and run the trained model files', 'You get the training data and all the code', 'The model is free of any conditions']
    ans: 0
    why: Open weights means the model files are public. The training data, and sometimes commercial use, may not be.
  - q: Under Apache 2.0, may a business use the model in a paid product?
    choices: ['Yes, if it keeps the licence and notices', 'No, never', 'Only with written permission each time']
    ans: 0
    why: Apache 2.0 allows commercial use. You must keep the licence text and notices, and say what you changed.
  - q: Where do you find a model's licence?
    choices: ['On the model page and in the LICENSE file that ships with it', 'In a news article', 'It has no licence']
    ans: 0
    why: The model card and LICENSE file are the official source. News summaries can be out of date.
---

**Module 7 · about 15 minutes · read first: 7.1.** You'll be able to check, in two minutes, whether you may use a model for your job or product.

## 1. Why this matters

"Free to download" does not always mean "free to use for anything". A licence can forbid some uses, cap the size of companies that may use it, or ask you to pass rules on to your users. Checking first avoids rebuilding a project later.

## 2. Three kinds of "open"

- **Open source (in the strict sense):** weights, code, and enough detail about the training data to rebuild it, under a licence that lets anyone use, change and share. Few big models meet this fully.
- **Open weights, permissive licence:** you get the model files under a standard licence such as **Apache 2.0** or **MIT**. Commercial use is allowed. Gemma 4 (since April 2026), gpt-oss and many Qwen models are in this group.
- **Open weights, custom licence:** you get the files, but the maker's own terms add conditions, such as a list of banned uses, a limit on very large companies, or a rule to show the maker's name.

## 3. A two-minute licence check

1. Open the model's page (Lesson 7.1) and find the **License** field.
2. If it names a standard licence (Apache 2.0, MIT), commercial use is fine: keep the licence file and notices.
3. If it says "custom", "community" or "other", open the licence and search for: *commercial*, *users*, *prohibited*, *attribution*, *derivative*.
4. Check the licence for **fine-tuned copies** (Module 14) too: a copy usually inherits the original's licence.
5. Note the licence and date in your project notes.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the licence travels with the weights, including any copy you change.

**Equation:** what you may do = the most restrictive of (base model licence, fine-tune licence, data licence, your country's law).

**Analogy:** renting a flat: the lease decides what you may do, not the fact that you hold the keys.

**Try it:** a fine-tune of an Apache 2.0 base, published under a "non-commercial" licence by its author. May you sell a product with it? (No: the fine-tune's own licence is the stricter one. Use the base model or ask the author.)
</details>

## 4. Worked example

*Made-up numbers.* Lakeside Tutors wants a homework helper app. Their first choice is a fine-tune with a non-commercial licence. They switch to the Apache 2.0 base model it came from, keep its LICENSE file in their app's notices, and record the check in their project notes.

## 5. Practice

1. Find the licence of the model you use most.
2. Is it standard or custom? Does it allow commercial use?
3. What file should ship with your app if you use an Apache 2.0 model?

<details>
<summary>Answers</summary>

1. It is on the model page, under License.
2. Write the answer in your notes with today's date.
3. The licence text and any NOTICE file, plus a note of your changes.
</details>

**New words:** *open weights*, *permissive licence*, *custom licence*, *attribution*, *derivative* (a changed copy).
