---
title: LoRA and QLoRA in plain words
seoTitle: LoRA and QLoRA explained simply | Offline AI
summary: LoRA trains a small add-on instead of the whole model; QLoRA does it on top of a 4-bit model so it fits home hardware. See how few numbers change, and why the adapter file is only megabytes.
minutes: 25
updated: 2026-11-19
sources:
  - 'Hu et al. (2021), LoRA: Low-Rank Adaptation of Large Language Models, https://arxiv.org/abs/2106.09685'
  - 'Dettmers et al. (2023), QLoRA: Efficient Finetuning of Quantized LLMs, https://arxiv.org/abs/2305.14314'
  - 'Hugging Face PEFT documentation, https://huggingface.co/docs/peft'
  - 'Llama 3.1 8B and Llama 3.2 3B config.json (layer sizes used in the calculator), https://huggingface.co/meta-llama'
quiz:
  - q: What does LoRA train?
    choices: ['Every weight in the model', 'Two small matrices per chosen layer, while the original weights stay frozen', 'Only the tokenizer']
    ans: 1
    why: The big weight matrices are frozen. LoRA adds a small pair of matrices next to each and trains only those.
  - q: What does the Q in QLoRA add?
    choices: ['The frozen base model is stored in 4-bit, so it takes about a quarter of the memory', 'Quicker downloads', 'A quality check']
    ans: 0
    why: QLoRA keeps the base model quantised to 4-bit while training 16-bit LoRA matrices, which is what lets a 12B model train on a single home graphics card.
  - q: Rank r goes from 16 to 32. What happens to the number of trainable parameters?
    choices: ['It doubles', 'It stays the same', 'It squares']
    ans: 0
    why: Each LoRA pair has r × (d + k) parameters, which grows in step with r.
---

**Module 14 · about 25 minutes · read first: 14.1 and 8.1.** You'll be able to explain LoRA and QLoRA and estimate the size of an adapter.

## 1. Why this matters

Training a whole 8-billion-parameter model needs over 100 GB of memory for the weights, their gradients and the optimiser's bookkeeping: data-centre territory. LoRA and QLoRA cut that to something a 16 GB graphics card or a 32 GB Mac can do, which is why fine-tuning is now a home-hardware skill.

## 2. LoRA: a small add-on

Inside a model, most weights sit in big grids of numbers (matrices), for example 4,096 × 4,096 = 16.8 million numbers each. Full fine-tuning nudges every one.

**LoRA** (low-rank adaptation) leaves those grids **frozen** and adds, beside each one you choose, two thin matrices: one 4,096 × r and one r × 4,096, where the **rank** r is small, such as 16. Only those are trained. When the model runs, their product is added to the frozen grid's output. The thin pair can only express a limited kind of change, but research shows that the changes fine-tuning needs are mostly of that kind.

The trained pairs are saved as an **adapter**: a file of tens of megabytes that only works with the exact base model it was trained on.

<!--fig:lora-size-->

## 3. QLoRA: LoRA on a 4-bit model

**QLoRA** stores the frozen base model in 4-bit (Lesson 8.2), while the small LoRA pairs train in 16-bit. The base model takes about a quarter of the memory, the adapter is small, and quality ends up close to full 16-bit fine-tuning. This is the default for home fine-tuning.

## 4. The settings you will meet

- **Rank (r):** 8 to 64; 16 is a sensible start. Higher can learn more, and can also overfit small data sets.
- **Alpha:** scales the adapter's effect; often set equal to r or 2 × r.
- **Target modules:** which grids get adapters. Attention only (q, k, v, o) is smaller; adding the MLP layers (gate, up, down) learns more.
- **Learning rate, epochs:** how big each step is and how many passes over your data (Lesson 14.3).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a large change to a big matrix can often be written as the product of two thin matrices.

**Equation:** W' = W + (α ÷ r) × B A, with W frozen (d × k), B (d × r) and A (r × k) trained. Trainable numbers per matrix: r × (d + k) instead of d × k.

**Analogy:** editing a huge spreadsheet by adding a correction made from one column of row factors times one row of column factors (rank 1), or a few such pairs (rank r). You store two thin strips instead of a second full sheet. Where it breaks: if the change you need is truly spread everywhere, a low rank cannot capture it; that is when people raise r or do full fine-tuning.

**Try it:** a 4,096 × 4,096 matrix with r = 16. Trainable numbers? (16 × (4,096 + 4,096) = 131,072, about 0.8% of 16.8 million.)
</details>

## 5. Worked example

*Real layer sizes, Llama 3.1 8B.* With r = 16 on all seven grids in each of its 32 layers, LoRA trains 41.9 million numbers, about 0.5% of the model. Saved in 16-bit, the adapter is about 84 MB, against 16 GB for the full model. Training it with QLoRA needs roughly 6 to 10 GB of graphics memory, depending on text length and batch size.

## 6. Practice

1. Use the calculator: how big is the adapter for Llama 3.2 3B at r = 8, attention only?
2. Why can you not use an adapter trained on Gemma 4 12B with Gemma 4 E4B?
3. Your adapter learns the training examples word for word but does badly on new ones. Name two settings to change.

<details>
<summary>Answers</summary>

1. About 4.6 million numbers, roughly 9 MB in 16-bit.
2. The adapter's matrices are shaped for the 12B model's layers and were trained to correct that model's weights; the shapes and the weights both differ.
3. Lower the rank or the number of epochs (and check you have enough varied examples, Lesson 14.4). This is called overfitting.
</details>

**New words:** *LoRA* / *low-rank adaptation* / *W + BA*, *QLoRA* (LoRA on a 4-bit base model), *adapter* (the small trained add-on file), *rank* (how thin the add-on matrices are), *frozen* (weights that do not change in training).
