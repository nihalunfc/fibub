---
title: Merging and sharing your adapter
seoTitle: Merge a LoRA adapter and run it in Ollama | Offline AI
summary: Run your fine-tuned adapter in Ollama, LM Studio or llama.cpp, merge it into a single model file, and share it responsibly. Covers GGUF export, base-model licences and what an adapter may have memorised.
minutes: 25
updated: 2026-11-19
sources:
  - 'Ollama Modelfile reference (FROM and ADAPTER), https://github.com/ollama/ollama/blob/main/docs/modelfile.md'
  - 'llama.cpp, convert_lora_to_gguf.py and the --lora option, https://github.com/ggml-org/llama.cpp'
  - 'MLX LM, fusing adapters, https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/LORA.md'
  - 'Carlini et al. (2021), Extracting Training Data from Large Language Models, https://arxiv.org/abs/2012.07805'
quiz:
  - q: What is the difference between using an adapter and merging it?
    choices: ['Using it keeps the base model and adds the adapter when loading; merging bakes it in to make one model file', 'There is no difference', 'Merging makes the model bigger than the original']
    ans: 0
    why: An adapter is loaded alongside its base model. Merging adds the LoRA changes into the weights and saves a single model of the original size.
  - q: You fine-tuned a model under a licence that requires its name in derivatives. You share the merged model. What must you do?
    choices: ['Nothing', 'Follow the base licence: keep its notice and naming rules', 'Rename it to hide the base']
    ans: 1
    why: A fine-tune is a derivative of the base model. The base licence still applies to what you share.
  - q: Why think twice before sharing an adapter trained on client emails?
    choices: ['Adapters are too large to upload', 'The model may have memorised names or details and can repeat them', 'Sharing is always illegal']
    ans: 1
    why: Models can memorise rare strings from training data. An adapter trained on private data can leak it to anyone who uses it.
---

**Module 14 · about 25 minutes · read first: 14.3.** You'll be able to run your adapter in your everyday tools, merge it into one file, and decide what is safe to share.

## 1. Why this matters

A fine-tune is only useful once it runs where you work: Ollama, LM Studio or your Python scripts from Module 11. And if it helps you, it might help colleagues, which raises licence and privacy questions worth answering before you hit upload.

## 2. Two ways to run it

1. **Base model + adapter:** keep the original model and load the small adapter with it. Good for trying several adapters on one base.
2. **Merged model:** add the adapter's changes into the weights and save one model. Simplest to share and to run anywhere.

## 3. Into Ollama

The dependable route is a merged GGUF file (Lesson 7.5). From Unsloth, after training:

```python
model.save_pretrained_gguf("my-model", tokenizer, quantization_method="q4_k_m")
```

On a Mac with MLX LM, fuse first, then convert with llama.cpp's `convert_hf_to_gguf.py`:

```
mlx_lm.fuse --model mlx-community/Llama-3.2-3B-Instruct-4bit --adapter-path adapters --save-path fused --de-quantize
```

Then write a `Modelfile` that points at the file and keeps the system prompt you trained with:

```
FROM ./my-model/unsloth.Q4_K_M.gguf
SYSTEM "You write product notes for Hill Pottery."
PARAMETER temperature 0.7
```

```
ollama create hill-notes -f Modelfile
ollama run hill-notes
```

Use the actual `.gguf` file name your export produced. Ollama can also load an unmerged adapter with an `ADAPTER` line on top of the exact base model (`FROM gemma4:12b` then `ADAPTER ./my-adapter`) for supported model families; check its Modelfile reference. Now every script from Module 11 can call `model="hill-notes"`.

**llama.cpp** loads a GGUF adapter at run time: `llama-cli -m base.gguf --lora my-adapter.gguf`. **LM Studio** imports a GGUF file through its model folder.

## 4. Sharing responsibly

Before you share a model or adapter, inside your team or publicly:

- **Base licence:** your fine-tune is a derivative. Apache 2.0 (Gemma 4, Qwen, gpt-oss) lets you share with the notice kept; some community licences add naming or user-count rules (Lesson 7.2).
- **Training data rights:** did you have the right to train on it? Client work, purchased content and scraped text may not allow it.
- **Memorisation:** models can repeat rare strings from training, such as names, phone numbers or account codes. Anything trained on private data stays private.
- **A model card:** a short README: base model, what it was trained for, how many examples, the test result from Lesson 14.4, known weaknesses, licence.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** merging is a one-time addition; afterwards the model is the same size and speed as the base.

**Equation:** W_merged = W + (α ÷ r) × B A for every adapted matrix. The shape of W is unchanged, so the merged file is the same size as the base at the same quantisation.

**Analogy:** writing corrections in the margins of a book (adapter) versus printing a new edition with the corrections in the text (merge). Margins let you swap sets of notes; a new edition is easier to hand to someone. Where it breaks: merging into a 4-bit base adds rounding error; for best quality, merge into the 16-bit base, then quantise once.

**Try it:** the base model is 7.7 GB at 4-bit and the adapter 84 MB. How big is the merged 4-bit file? (About 7.7 GB: the adapter's changes are folded into existing weights.)
</details>

## 5. Worked example

*Made-up numbers.* The pottery shop from Lesson 14.4 exports a Q4_K_M GGUF of its tuned 3B model (2.0 GB), creates `hill-notes` in Ollama, and points its product-note script (Lesson 11.2) at it. Notes for 80 new products take 4 minutes. The owner shares the model with a part-time helper on the shop laptop only, because the training data included a few customer names, and writes a one-page model card.

## 6. Practice

1. Write a Modelfile for your mini project 6 model and create it in Ollama.
2. Your adapter was trained on Gemma 4 12B. A friend has Gemma 4 31B. Can they use it?
3. List three things your model card should say.

<details>
<summary>Answers</summary>

1. `FROM` the exported `.gguf` file, the same `SYSTEM` prompt you trained with, then `ollama create <name> -f Modelfile`.
2. No: an adapter only fits the exact base model it was trained on. They would need the merged 12B model, or to train their own adapter on 31B.
3. Base model and licence, what it was trained to do and on how many examples, and the blind-test result with known weaknesses.
</details>

**New words:** *merge* or *fuse* (fold an adapter into the base weights), *Modelfile* (Ollama's recipe for a custom model), *derivative model* (a model made from another, under its licence), *model card* (a short description of a model, its data and its limits).
