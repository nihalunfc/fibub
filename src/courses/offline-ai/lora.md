---
title: LoRA and QLoRA in plain words
seoTitle: LoRA and QLoRA explained simply | Offline AI
summary: LoRA trains a small add-on instead of the whole model; QLoRA does it on top of a 4-bit model so it fits home hardware. See how few numbers change, and why the adapter file is only megabytes.
minutes: 25
updated: 2026-11-22
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

<div class="bigidea">LoRA freezes the big model and trains a pair of thin add-on grids beside some of its layers, so well under 1% of the numbers change and the result is a file of megabytes.</div>

## 1. Why this matters

Training a whole 8-billion-parameter model needs over 100 GB of memory for the weights, their gradients and the optimiser's bookkeeping: data-centre territory. LoRA and QLoRA cut that to something a 16 GB graphics card or a 32 GB Mac can do, which is why fine-tuning is now a home-hardware skill.

## 2. LoRA: a small add-on

Inside a model, most weights sit in big grids of numbers (matrices), for example 4,096 × 4,096 = 16.8 million numbers each. Full fine-tuning nudges every one.

**LoRA** (low-rank adaptation) leaves those grids **frozen** and adds, beside each one you choose, two thin matrices: one 4,096 × r and one r × 4,096, where the **rank** r is small, such as 16. Only those are trained. When the model runs, their product is added to the frozen grid's output. The thin pair can only express a limited kind of change, but research shows that the changes fine-tuning needs are mostly of that kind.

The trained pairs are saved as an **adapter**: a file of tens of megabytes that only works with the exact base model it was trained on.

An everyday picture: instead of rewriting a 500-page manual, you clip a few pages of corrections to it. The manual stays as it was; the clip-on pages change how it reads.

<div class="steps" data-fig="lora-adapter">
<div class="step"><p><b>One big grid.</b> A 4,096 × 4,096 weight matrix holds 16,777,216 numbers. LoRA <b>freezes</b> it: none of these change.</p></div>
<div class="step"><p><b>Add a tall strip.</b> B is 4,096 rows by r = 16 columns: 65,536 numbers.</p></div>
<div class="step"><p><b>Add a wide strip.</b> A is 16 rows by 4,096 columns: another 65,536 numbers. Only A and B are trained: 131,072 numbers.</p></div>
<div class="step"><p><b>How small?</b> 131,072 ÷ 16,777,216 = <b>0.78%</b> of that grid. When the model runs, B × A is the same shape as the big grid, and its effect is added to it.</p></div>
<div class="step"><p><b>The whole model.</b> Do this for all seven grids in each of Llama 3.1 8B's 32 layers: 41.9 million trained numbers, about 0.5% of the model. In 16-bit (2 bytes each) the adapter is about <b>84 MB</b>, against 16 GB for the model.</p></div>
</div>

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

<div class="meaning">

<dl>
<dt>W</dt><dd>one of the model's big weight grids, d rows by k columns; frozen during LoRA training</dd>
<dt>B, A</dt><dd>the two thin grids LoRA adds and trains: B is d × r, A is r × k</dd>
<dt>r (rank)</dt><dd>how thin the strips are; 16 is a common start, and doubling r doubles the trained numbers</dd>
<dt>α (alpha)</dt><dd>a dial for how strongly the add-on changes the output, often set to r or 2 × r</dd>
<dt>r × (d + k)</dt><dd>how many numbers LoRA trains for one grid, instead of all d × k</dd>
<dt>Physical meaning</dt><dd>A clip-on correction to a huge, fixed manual. The changes a fine-tune needs are mostly simple in shape, so two thin strips can carry them. That is why a 16 GB model can be customised with an 84 MB file, and why the file only fits the exact manual it was written for.</dd>
</dl>

</div>

<div class="problem" data-problem="lora-params"></div>

<div class="myth">

**"LoRA makes a small model of my own."** The adapter is not a model on its own. It is a set of corrections that only works on top of the exact base model it was trained with. You still need the base model (or a merged copy, Lesson 14.5) to run it.

</div>

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

<div class="keypoints">

- LoRA freezes the base model's big grids and trains two thin grids (B and A) beside each chosen one.
- Trained numbers per grid = r × (d + k) instead of d × k: well under 1% of the model.
- The adapter is a file of tens of megabytes that only works with the exact base model it was trained on.
- QLoRA keeps the frozen base in 4-bit, so a 7B to 12B model can be fine-tuned on one home graphics card.
- Start with rank 16 and alpha 16 or 32; higher rank learns more but can overfit small data.

</div>
