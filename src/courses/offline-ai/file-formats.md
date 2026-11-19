---
title: 'File formats: GGUF, safetensors and MLX'
summary: The three model file formats you will meet, which engine reads which, and how to pick the right download on a model page.
minutes: 15
updated: 2026-11-19
sources:
  - 'GGUF file format: ggml project documentation (official page), https://github.com/ggml-org/ggml/blob/master/docs/gguf.md'
  - 'safetensors: Hugging Face documentation (official page), https://huggingface.co/docs/safetensors'
  - 'MLX community models on Hugging Face (official page), https://huggingface.co/mlx-community'
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

## 1. Why this matters

A single model can appear in dozens of versions: different formats and sizes. Downloading the wrong one wastes hours and gigabytes. Three formats cover almost everything you will do at home.

## 2. The three formats

| Format | Looks like | Read by | Notes |
|---|---|---|---|
| **GGUF** | `model-Q4_K_M.gguf` | llama.cpp, Ollama, LM Studio, many apps | One file with weights, tokenizer, chat template and settings. Comes in many quant sizes (Lesson 8.3). |
| **safetensors** | `model-00001-of-00004.safetensors` plus `config.json` | Python libraries, vLLM, MLX tools, converters | The maker's original release, usually 16-bit. Large. Safe: holds only data. |
| **MLX** | a folder of safetensors made for MLX | MLX and LM Studio on Macs | Converted and often quantised for Apple Silicon. |

Older formats such as `.bin` or `.pt` (pickle files) can run code when loaded. Avoid them from sources you do not trust (Lesson 7.6).

## 3. Picking the right file

1. Know your engine: Ollama or LM Studio on Windows means GGUF; LM Studio on a Mac can use MLX or GGUF; Python serving engines use safetensors.
2. On the model page, open **Files** or the list of **Quantizations**, or search for the model name plus "GGUF" or "MLX".
3. Choose the size that fits (Lesson 8.5); Q4_K_M is the usual starting point.
4. Prefer copies from the model maker or a well-known converter with many downloads.

Ollama hides all this: `ollama pull gemma4:12b` fetches a GGUF-style file for you.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the same weights can be packed in different boxes; the engine decides which box it can open.

**Equation:** file size ≈ parameters × bits per weight ÷ 8, plus a little for the tokenizer and settings.

**Analogy:** the same film as a DVD, a Blu-ray and a streaming file. Same story, but your player needs the right one.

**Try it:** a 12B model as a 16-bit safetensors release and as a Q4_K_M GGUF (about 4.8 bits)? (12 × 16 ÷ 8 = 24 GB against 12 × 4.8 ÷ 8 ≈ 7.2 GB.)
</details>

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
