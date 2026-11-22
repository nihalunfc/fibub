---
title: 'File formats: GGUF, safetensors and MLX'
summary: The three model file formats you will meet, which engine reads which, and how to pick the right download on a model page.
minutes: 15
updated: 2026-11-22
sources:
  - 'GGUF file format: ggml project documentation (official page), https://github.com/ggml-org/ggml/blob/master/docs/gguf.md'
  - 'safetensors: Hugging Face documentation (official page), https://huggingface.co/docs/safetensors'
  - 'MLX community models on Hugging Face (official page), https://huggingface.co/mlx-community'
  - 'Pickle scanning and the risks of pickle files: Hugging Face Hub documentation (official page), https://huggingface.co/docs/hub/security-pickle'
quiz:
  - q: Which format do llama.cpp, LM Studio (on most PCs) and Ollama use?
    choices: ['GGUF', 'Word documents', 'MP4']
    ans: 0
    why: GGUF is one self-contained file with the weights, the tokenizer and the settings, made for llama.cpp-style engines.
  - q: Why is safetensors safer than older .bin or .pt files?
    choices: ['It stores only numbers and cannot run code when loaded', 'It is encrypted', 'It is smaller']
    ans: 0
    why: Older pickle-based files can run hidden code when opened. Safetensors holds only data.
  - q: You have a Mac and want the fastest Apple-native engine. Which download do you pick?
    choices: ['An MLX version (often from mlx-community)', 'A GPTQ version for NVIDIA cards', 'The original 16-bit safetensors only']
    ans: 0
    why: MLX models are converted and quantised for Apple Silicon (Lesson 9.4).
---

**Module 7 · about 15 minutes · read first: 7.1 and 8.1.** You'll be able to look at a model page and pick the right file for your engine.

<div class="bigidea">The same model can be packed in different boxes; your engine can only open some of them, so match the format to the engine first and the size to your memory second.</div>

## 1. Why this matters

A single model can appear in dozens of versions: different formats and sizes. Downloading the wrong one wastes hours and gigabytes. Three formats cover almost everything you will do at home.

## 2. The three formats

A **format** is the way the numbers are laid out in the file, like DOCX and PDF for documents. Here are the three you will meet:

| Format | Looks like | Read by | Notes |
|---|---|---|---|
| **GGUF** | `model-Q4_K_M.gguf` | llama.cpp, Ollama, LM Studio, many apps | One file with weights, tokenizer, chat template and settings. Comes in many quant sizes (Lesson 8.3). |
| **safetensors** | `model-00001-of-00004.safetensors` plus `config.json` | Python libraries, vLLM, MLX tools, converters | The maker's original release, usually 16-bit. Large. Safe: holds only data. |
| **MLX** | a folder of safetensors made for MLX | MLX and LM Studio on Macs | Converted and often quantised for Apple Silicon. |

Older formats such as `.bin` or `.pt` are **pickle** files. Pickle is a Python way of saving things that can also save instructions, so opening one can run code. Avoid them from sources you do not trust (Lesson 7.6).

## 3. Picking the right file

1. Know your engine: Ollama or LM Studio on Windows means GGUF; LM Studio on a Mac can use MLX or GGUF; Python serving engines use safetensors.
2. On the model page, open **Files** or the list of **Quantizations**, or search for the model name plus "GGUF" or "MLX".
3. Choose the size that fits (Lesson 8.5); Q4_K_M is the usual starting point.
4. Prefer copies from the model maker or a well-known converter with many downloads.

Ollama hides all this: `ollama pull gemma4:12b` fetches a GGUF-style file for you.

### Watch it happen: one 12B model in three boxes

<div class="steps" data-fig="file-formats-size">
<div class="step"><p><b>The maker's release.</b> 12 billion weights at 16 bits each: 12 × 16 ÷ 8 = <b>24 GB</b> of safetensors, split into several files. Python tools read it; Ollama and LM Studio on Windows do not.</p></div>
<div class="step"><p><b>An 8-bit GGUF.</b> Q8_0 uses about 8.5 bits per weight: 12 × 8.5 ÷ 8 = <b>12.75 GB</b>, in one file, with the tokenizer and chat template inside.</p></div>
<div class="step"><p><b>A 4-bit GGUF.</b> Q4_K_M uses about 4.8 bits per weight: 12 × 4.8 ÷ 8 = <b>7.2 GB</b>. Same model, less than a third of the size.</p></div>
<div class="step"><p><b>What fits a 16 GB laptop?</b> About 11 GB is usable, and a file needs about 1.2 × its size once a chat is going. Only the Q4_K_M (7.2 × 1.2 ≈ 8.6 GB) fits comfortably.</p></div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the same weights can be packed in different boxes; the engine decides which box it can open.

**Equation:** file size ≈ parameters × bits per weight ÷ 8, plus a little for the tokenizer and settings.

```math
\text{file (GB)} \approx \frac{P \times b}{8}
```

**Analogy:** the same film as a DVD, a Blu-ray and a streaming file. Same story, but your player needs the right one.

**Try it:** a 12B model as a 16-bit safetensors release and as a Q4_K_M GGUF (about 4.8 bits)? (12 × 16 ÷ 8 = 24 GB against 12 × 4.8 ÷ 8 ≈ 7.2 GB.)
</details>

<div class="meaning">

<dl>
<dt>P</dt><dd>the number of parameters (weights), in billions</dd>
<dt>b</dt><dd>bits per weight: 16 for the original, about 8.5 for Q8_0, about 4.8 for Q4_K_M</dd>
<dt>÷ 8</dt><dd>turns bits into bytes, so billions of parameters give GB</dd>
<dt>Format</dt><dd>the box: GGUF for llama.cpp-style engines, safetensors for Python tools, MLX for Macs</dd>
<dt>Physical meaning</dt><dd>Two choices, one after the other: the box your player can open, then the size of copy that fits on your shelf. Getting the first one wrong means the file will not load at all.</dd>
</dl>

</div>

<div class="problem" data-problem="file-formats-size"></div>

<div class="myth">

**"The biggest file is the real model; the small ones are cut-down versions."** All three are the same trained model. The small GGUF stores each weight with fewer bits, which costs a little quality (Module 8), but it has the same layers, the same knowledge and the same tokenizer.

</div>

## 4. Worked example

*Made-up numbers.* Nikhil on Windows downloads a 24 GB folder of safetensors, then finds LM Studio will not load it. He deletes it and picks the 7 GB Q4_K_M GGUF of the same model from the list in LM Studio's search. It loads at once.

## 5. Practice

1. Which format does your engine use?
2. On a model page, find a GGUF version and note the sizes on offer.
3. Why avoid `.pt` files from an unknown uploader?

<details>
<summary>Answers</summary>

1. Ollama, llama.cpp and LM Studio on a PC: GGUF. LM Studio on a Mac: MLX or GGUF.
2. Usually from Q2 to Q8 and 16-bit; Lesson 8.3 explains the names.
3. Pickle files can run hidden code on your computer when opened.
</details>

**New words:** *GGUF*, *safetensors*, *pickle*, *MLX format*, *quantisation list*.

<div class="keypoints">

- GGUF: one file for llama.cpp, Ollama and LM Studio. safetensors: the maker's original, for Python tools. MLX: for Macs.
- Pickle files (.bin, .pt, .pkl) can run code when opened; avoid them from unknown uploaders.
- File size ≈ billions of parameters × bits per weight ÷ 8.
- Choose the format for your engine first, then the quantisation that fits your memory (Q4_K_M to start).

</div>
