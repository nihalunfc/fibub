---
title: Safe downloads and storage planning
summary: How to download models without picking up malware or fakes, check that files arrived intact, and plan disk space for a growing model collection.
minutes: 15
updated: 2026-11-19
sources:
  - 'Hugging Face security: malware and pickle scanning (official page), https://huggingface.co/docs/hub/security'
  - 'Model download sizes: Ollama library, read 17 November 2026 via BenchLM, https://benchlm.ai/best/ollama-models'
quiz:
  - q: Which download is safest?
    choices: ['A safetensors or GGUF file from the model maker or a well-known converter', 'A .pt file from a new account with no history', 'A zip from a chat message']
    ans: 0
    why: Data-only formats from known publishers are the lowest risk.
  - q: What does a checksum (SHA256) let you check?
    choices: ['That the file you have is exactly the file that was published', 'That the model is accurate', 'That the licence is valid']
    ans: 0
    why: Change one byte and the checksum changes. It proves the file is intact and unaltered.
  - q: Where should models go on a laptop with a small internal drive?
    choices: ['A fast external SSD, with the engine''s model folder pointed there', 'The desktop', 'A USB stick from 2010']
    ans: 0
    why: A fast external SSD works well; engines let you change where models are stored.
---

**Module 7 · about 15 minutes · read first: 7.1 and 7.5.** You'll be able to build a safe, tidy model collection that fits your disk.

## 1. Why this matters

Model files are large files that you download from the internet. Most are safe, but fakes and booby-trapped files exist. A few habits keep you safe and save disk space.

## 2. Safe habits

1. **Prefer known publishers:** the model maker's own account, or a converter with many downloads and a long history.
2. **Prefer data-only formats:** GGUF and safetensors. Avoid `.bin`, `.pt` and `.pkl` from unknown sources (Lesson 7.5).
3. **Check the name:** fakes copy famous names with small changes. Compare with the maker's official page.
4. **Do not run scripts** that come with a model unless you understand them; engines do not need them.
5. **Check the checksum** for big manual downloads: model sites list a SHA256 for each file. On Windows `certutil -hashfile file.gguf SHA256`; on Mac or Linux `shasum -a 256 file.gguf`. Ollama checks this for you automatically.

## 3. Storage planning

- Gemma 4 E2B 4.6 GB, E4B 6.6 GB, 12B 7.7 GB, 31B 19 GB, gpt-oss-120b 65 GB (Ollama sizes).
- Keep a short list: one small fast model, one strong model that fits, maybe one for code or images.
- Delete what you no longer use: `ollama list` then `ollama rm <name>`; LM Studio has a My Models page.
- Move the model folder to a bigger drive: Ollama uses the `OLLAMA_MODELS` setting; LM Studio lets you change its models directory in settings.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** trust the publisher, prefer data-only files, verify the bytes, and budget the disk.

**Equation:** disk needed ≈ sum of the model files you keep + 20% room for new versions.

**Analogy:** buying medicine: from a known pharmacy, sealed packet, check the expiry date, and keep the cupboard tidy.

**Try it:** you keep E4B, 12B and 31B. Disk budget? ((6.6 + 7.7 + 19) × 1.2 ≈ 40 GB.)
</details>

## 4. Worked example

*Made-up numbers.* Farah finds a "Gemma-4-31B-uncensored-FAST" upload from a two-day-old account, shipped as `.pt` files with a setup script. She skips it, pulls `gemma4:31b` with Ollama instead, and moves her models folder to a 1 TB external SSD.

## 5. Practice

1. Run `ollama list` (or open LM Studio's My Models). How much space do your models use?
2. Check the SHA256 of one downloaded GGUF against the model page.
3. Delete one model you have not used for a month.

<details>
<summary>Answers</summary>

1. Add up the sizes; compare with your free space.
2. If the two strings match exactly, the file is intact.
3. You can always download it again.
</details>

**New words:** *checksum (SHA256)*, *publisher*, *model folder*.
