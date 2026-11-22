---
title: What fine-tuning takes on home hardware
seoTitle: Fine-tune a model at home with QLoRA | Offline AI
summary: The memory, time and tools you need to fine-tune a small model at home. Unsloth on NVIDIA graphics cards, MLX on Macs, what a training run looks like, and how to read the loss.
minutes: 35
updated: 2026-11-22
sources:
  - 'Unsloth documentation and notebooks (Apache 2.0), https://docs.unsloth.ai'
  - 'MLX LM, LoRA fine-tuning on Apple silicon (MIT), https://github.com/ml-explore/mlx-lm'
  - 'Hugging Face TRL, SFTTrainer, https://huggingface.co/docs/trl'
  - 'Dettmers et al. (2023), QLoRA, https://arxiv.org/abs/2305.14314'
quiz:
  - q: Training loss keeps falling but validation loss starts rising. What is happening?
    choices: ['The model is memorising the training examples (overfitting); stop earlier', 'Training is going perfectly', 'The GPU is too slow']
    ans: 0
    why: Validation examples are ones the model never trains on. When their loss rises, the model is learning the training set by heart instead of the pattern.
  - q: Which tool is the usual choice for LoRA fine-tuning on a Mac?
    choices: ['MLX LM', 'Ollama', 'whisper.cpp']
    ans: 0
    why: Apple's MLX LM trains LoRA and QLoRA adapters on Apple silicon with one command. Ollama runs models but does not train them.
  - q: Does fine-tuning need the internet?
    choices: ['Yes, always', 'Only once, to download the base model and libraries; training itself runs offline', 'Only on Windows']
    ans: 1
    why: Once the base model and the tools are on disk, training reads your local data and writes a local adapter.
---

**Module 14 · about 35 minutes · read first: 14.2.** You'll be able to judge whether your machine can fine-tune a model, choose a tool, and read a training run.

<div class="bigidea">With QLoRA, a 16 GB graphics card or a 32 GB Mac can fine-tune a 7B to 12B model in about an hour, and you judge the run by watching the loss on examples it never trains on.</div>

## 1. Why this matters

Fine-tuning used to mean renting data-centre GPUs. With QLoRA and today's tools, a 16 GB graphics card or a 32 GB Mac can fine-tune a 7B to 12B model in an hour or so, with your data never leaving the room.

## 2. What your machine can train (QLoRA, rough guide)

| Your memory | Model size you can fine-tune |
|---|---|
| 8 GB graphics card | 3B to 4B (Gemma 4 E4B, Llama 3.2 3B) |
| 12 to 16 GB graphics card, or 32 GB Mac | 7B to 12B (Gemma 4 12B, Llama 3.1 8B) |
| 24 to 32 GB graphics card, or 64 GB Mac | 27B to 32B (Gemma 4 31B, Qwen3.8-27B) |
| 128 GB unified memory box | Up to about 70B, slowly |

Laptops without a graphics card can technically train tiny models on the CPU, but it is too slow to be worth it; borrow a bigger machine or rent a GPU by the hour for the training run only, then run the result offline.

## 3. Tools

- **Unsloth** (Windows, Linux, NVIDIA cards): fast, memory-efficient QLoRA, with ready-made notebooks for each popular model, and it exports straight to GGUF for Ollama.
- **MLX LM** (Mac): one command trains a LoRA adapter on Apple silicon.
- **Hugging Face TRL + PEFT:** the standard libraries underneath many tools; most flexible, more setup.

## 4. A training run on a Mac (MLX LM)

Put `train.jsonl` and `valid.jsonl` (Lesson 14.4) in a folder called `data`, then:

```
pip install mlx-lm
mlx_lm.lora --model mlx-community/Llama-3.2-3B-Instruct-4bit --train --data ./data --iters 600 --batch-size 2
mlx_lm.generate --model mlx-community/Llama-3.2-3B-Instruct-4bit --adapter-path adapters --prompt "Write a product note for a blue mug."
```

A 4-bit model name means MLX trains with QLoRA automatically. Swap in any MLX model from the mlx-community collection on Hugging Face; the first run downloads it.

## 5. A training run on an NVIDIA card (Unsloth)

The surest path is to open Unsloth's notebook for your model and change only the data file. Its core looks like this:

```python
from datasets import load_dataset
from trl import SFTConfig, SFTTrainer
from unsloth import FastLanguageModel

BASE = "unsloth/Llama-3.2-3B-Instruct-bnb-4bit"   # or the 4-bit name from Unsloth's page for your model

model, tokenizer = FastLanguageModel.from_pretrained(BASE, max_seq_length=2048, load_in_4bit=True)
model = FastLanguageModel.get_peft_model(
    model, r=16, lora_alpha=16,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
)
data = load_dataset("json", data_files={"train": "data/train.jsonl", "valid": "data/valid.jsonl"})
data = data.map(lambda ex: {"text": tokenizer.apply_chat_template(ex["messages"], tokenize=False)})

trainer = SFTTrainer(
    model=model, processing_class=tokenizer,
    train_dataset=data["train"], eval_dataset=data["valid"],
    args=SFTConfig(dataset_text_field="text", per_device_train_batch_size=2,
                   gradient_accumulation_steps=4, num_train_epochs=2, learning_rate=2e-4,
                   eval_strategy="steps", eval_steps=20, logging_steps=10, output_dir="out"),
)
trainer.train()
model.save_pretrained("my-adapter")
```

These libraries change often; if a name or argument fails, the notebook for your model has the current form.

## 6. Reading the loss

Training prints a **loss** every few steps: a score for how wrong the model's guesses of your example answers are. Lower is better. **Training loss** should fall. **Validation loss**, on examples held back, should fall too and then level off. If validation loss turns upwards while training loss keeps falling, the model is memorising (**overfitting**): use the adapter from before the turn, train for fewer epochs, or add more varied data.

Follow one real-sized run (the publisher in section 7):

<div class="steps" data-fig="finetune-at-home-loss">
<div class="step"><p><b>Count the steps.</b> 600 examples, batch 2 with gradient accumulation 4, so the adapter is updated after every 2 × 4 = 8 examples: 600 ÷ 8 = 75 steps per pass, and 2 passes (epochs) make <b>150 steps</b>.</p></div>
<div class="step"><p><b>Early steps.</b> Both losses fall fast, from about 1.9: the model is picking up the obvious parts of the style.</p></div>
<div class="step"><p><b>Middle.</b> Validation loss slows and levels off near 1.2 around step 110. The model has learned the pattern.</p></div>
<div class="step"><p><b>Late.</b> Training loss keeps falling, but validation loss creeps up. The model is starting to learn the training examples by heart.</p></div>
<div class="step"><p><b>Keep the best.</b> Use the checkpoint saved at step 120, just after the low point. At about 9 seconds a step, the whole run took 150 × 9 = 1,350 s, about 23 minutes.</p></div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** training repeats one step: predict, measure the error (loss), nudge the adapter weights to reduce it.

**Equation:** steps = (examples ÷ effective batch) × epochs, with effective batch = batch size × gradient accumulation. Time ≈ steps × seconds per step.

**Analogy:** practising a piece of music with a teacher. Each run-through (step) gets a mark (loss), and you adjust. Practising one passage a thousand times makes it perfect (low training loss) but you may stumble on a new piece (high validation loss). Where it breaks: a low loss does not prove the answers are good; you still read them (Lesson 14.4).

**Try it:** 800 examples, batch 2, accumulation 4, 2 epochs. How many steps? (800 ÷ 8 × 2 = 200.)
</details>

<div class="meaning">

<dl>
<dt>batch size</dt><dd>how many examples the card works on at once</dd>
<dt>gradient accumulation</dt><dd>how many batches it adds up before it changes the adapter once</dd>
<dt>effective batch</dt><dd>batch size × accumulation: examples per update</dd>
<dt>epochs</dt><dd>how many times training goes through all the examples</dd>
<dt>steps</dt><dd>examples ÷ effective batch × epochs: how many updates the run makes</dd>
<dt>Physical meaning</dt><dd>Practising music with a teacher. Each run-through is a step and gets a mark (the loss). Playing one passage a thousand times makes it perfect, but you may stumble on a new piece: that is a falling training loss with a rising validation loss. Stop when new pieces stop improving.</dd>
</dl>

</div>

<div class="problem" data-problem="finetune-at-home-time"></div>

<div class="myth">

**"The lower the training loss, the better the model."** Training loss can keep falling while the model simply memorises its examples. Judge by validation loss on held-back examples, and then read real answers (Lesson 14.4). A low number is not proof of good writing.

</div>

## 7. Worked example

*Made-up numbers.* A small publisher fine-tunes Llama 3.1 8B with Unsloth on a 16 GB graphics card: 600 examples of about 700 tokens, effective batch 8, 2 epochs = 150 steps at about 9 seconds each, 23 minutes. Peak memory 9.5 GB. Validation loss falls from 1.9 to 1.2, levels off at step 110 and rises a little by step 150, so they keep the checkpoint from step 120. Electricity for the run: about 0.12 kWh.

## 8. Practice

1. From the table, which model sizes can your own machine fine-tune?
2. 1,200 examples, batch 1, accumulation 8, 3 epochs. How many steps?
3. Validation loss is still falling at the end of training. What could you try?

<details>
<summary>Answers</summary>

1. Use your graphics memory (or about half your Mac's unified memory) and the table; the LoRA calculator in 14.2 gives a closer figure.
2. 1,200 ÷ 8 × 3 = 450 steps.
3. Train for another epoch; the model has not finished learning the pattern.
</details>

**New words:** *loss* (a number for how wrong predictions are; lower is better), *validation set* (examples held back to check learning), *overfitting* (memorising examples instead of learning the pattern), *epoch* (one pass over all training examples), *checkpoint* (a saved copy partway through training).

<div class="keypoints">

- QLoRA lets an 8 GB card train 3B to 4B models, a 12 to 16 GB card or 32 GB Mac 7B to 12B, and 24 to 32 GB 27B to 32B.
- Unsloth (NVIDIA) and MLX LM (Mac) are the easy tools; Hugging Face TRL and PEFT sit underneath.
- Steps = examples ÷ (batch × accumulation) × epochs; time ≈ steps × seconds per step.
- Watch validation loss: when it turns up while training loss falls, the model is overfitting, so keep an earlier checkpoint.
- Only the downloads need the internet; training reads local data and writes a local adapter.

</div>
