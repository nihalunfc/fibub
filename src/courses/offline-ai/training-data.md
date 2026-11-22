---
title: Building a small training set and checking the result
seoTitle: Build a fine-tuning dataset and test it | Offline AI
summary: Collect 100 to 1,000 good examples, write them as chat-format JSONL, split them into training, validation and test sets, and compare the tuned model with the original in a blind test. Mini project 6, Teach a small model your house style.
minutes: 35
updated: 2026-11-22
sources:
  - 'Zhou et al. (2023), LIMA: Less Is More for Alignment, https://arxiv.org/abs/2305.11206'
  - 'MLX LM, data formats for LoRA, https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/LORA.md'
  - 'Hugging Face TRL, dataset formats, https://huggingface.co/docs/trl/dataset_formats'
quiz:
  - q: You have 2,000 rushed examples or 300 carefully checked ones. Which usually trains a better adapter?
    choices: ['The 2,000 rushed ones', 'The 300 checked ones', 'They are always the same']
    ans: 1
    why: The model copies what it sees, mistakes included. For style and format, a few hundred excellent examples beat thousands of sloppy ones.
  - q: Why keep a test set that is never used during training?
    choices: ['To judge the final model on examples it has truly never seen', 'To make training faster', 'Because JSONL needs three files']
    ans: 0
    why: Training and validation examples have shaped the model. Only untouched examples give an honest final check.
  - q: Why compare base and tuned answers blind (without knowing which is which)?
    choices: ['People tend to prefer the one they expect to be better', 'Blind tests are faster', 'Models require it']
    ans: 0
    why: Knowing which answer came from the model you worked hard on biases your judgement. Shuffling the labels removes that.
---

**Module 14 · about 35 minutes · read first: 14.3.** You'll be able to build a clean training set and prove whether fine-tuning helped. This lesson is **mini project 6: Teach a small model your house style**.

<div class="bigidea">The examples are the fine-tune: a few hundred excellent ones, a share kept back that the model never sees, and a blind test tell you whether it worked.</div>

## 1. Why this matters

The data is the fine-tune. Settings matter far less than whether your examples show exactly the behaviour you want. A clean set and an honest test are what separate a useful adapter from a wasted afternoon.

Think of an apprentice who copies everything they watch, mistakes included. Show them 300 jobs done well and they learn your way. Show them 2,000 rushed jobs and they learn to rush.

## 2. What a good example looks like

Each example is one conversation: what a user would send, and the perfect reply.

```
{"messages": [{"role": "system", "content": "You write product notes for Hill Pottery."}, {"role": "user", "content": "Product: blue mug, 350 ml, dishwasher safe."}, {"role": "assistant", "content": "Morning coffee, sorted. Our blue mug holds 350 ml and..."}]}
```

One example per line: this file format is **JSONL**. MLX LM, Unsloth and TRL all read this chat format.

- **Quantity:** 100 examples can shift style; 300 to 1,000 is a comfortable range.
- **Quality:** every reply is one you would sign off. Fix or drop the rest.
- **Variety:** cover the range of real inputs: short and long, easy and awkward.
- **Same system prompt** in training as in use.
- **Privacy:** remove names and personal details you do not need. Models can memorise rare strings and repeat them.

Step through a few merges and watch letters become chunks.

<figure class="fig" data-fig="@ai-bpe-merge"><figcaption>A tokeniser is built by repeatedly merging the commonest neighbouring pair. Common chunks become single tokens (cheap), rare words stay in several pieces (costly). This is why token counts differ from word counts.</figcaption></figure>

## 3. Check and split the data

Save as `prepare.py` next to `all.jsonl`:

```python
import json
import pathlib
import random

rows = []
for n, line in enumerate(open("all.jsonl", encoding="utf-8"), 1):
    if not line.strip():
        continue
    ex = json.loads(line)                                  # fails loudly on a broken line
    roles = [m["role"] for m in ex["messages"]]
    assert roles[-1] == "assistant", f"line {n}: the last message must be the assistant's reply"
    assert all(m["content"].strip() for m in ex["messages"]), f"line {n}: empty message"
    rows.append(ex)

random.seed(1)
random.shuffle(rows)
cut1, cut2 = int(len(rows) * 0.8), int(len(rows) * 0.9)
pathlib.Path("data").mkdir(exist_ok=True)
for name, part in [("train", rows[:cut1]), ("valid", rows[cut1:cut2]), ("test", rows[cut2:])]:
    with open(f"data/{name}.jsonl", "w", encoding="utf-8") as f:
        f.writelines(json.dumps(ex, ensure_ascii=False) + "\n" for ex in part)
    print(name, len(part))
```

80% trains, 10% validates during training (Lesson 14.3), and 10% stays locked away for the final test.

<div class="problem" data-problem="training-data-split"></div>

Try it: press Generate 20 with 1 word of memory, then with 2 words.

<figure class="fig" data-fig="@ai-bigram-gen"><figcaption>A language model is a table of what tends to come next. More memory gives more sensible text but copies the source, because there is only one continuation. Real models do this with billions of numbers instead of a table.</figcaption></figure>

## 4. The blind test

After training, run every test prompt through the **base** model and the **tuned** model. Save each pair with the labels hidden and shuffled (A and B), read them, and pick the better one each time. Only then reveal which was which. If the tuned model wins clearly, say 15 of 20 or more, the fine-tune worked. Also look for damage: did it get worse at anything you did not train for?

The pottery shop's set, from export to verdict (section 5 has the story):

<div class="steps">
<div class="step"><p><b>Collect.</b> 420 product notes the owner wrote over five years.</p></div>
<div class="step"><p><b>Clean.</b> Drop 60: outdated ones, and ones with prices the model might learn as facts. <b>360</b> remain, every one a note the owner would sign off.</p></div>
<div class="step"><p><b>Split.</b> Shuffle, then 80% / 10% / 10%: 360 × 0.8 = <b>288</b> train, 36 validate, 36 test. The 36 test examples are locked away.</p></div>
<div class="step"><p><b>Blind pairs.</b> After training, each test prompt gets an answer from the base model and one from the tuned model, shuffled as A and B. The owner picks the better one without knowing which is which.</p></div>
<div class="step"><p><b>Reveal.</b> Tuned 29, base 5, ties 2. Win rate = 29 ÷ (29 + 5) = <b>85%</b>: a clear win.</p></div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** judge a model only on examples it never learned from, and remove your own bias with a blind comparison.

**Equation:** win rate = tuned wins ÷ (tuned wins + base wins). With 20 pairs and no real difference, a split as uneven as 15 to 5 happens by chance only about 4% of the time (a two-sided sign test).

**Analogy:** a blind taste test. Tasters who know which cola they are drinking pick the brand they like; with the labels hidden, the scores show the taste. Where it breaks: 20 pairs catches a clear improvement, not a subtle one. For small differences you need more test examples.

**Try it:** the tuned model wins 12 of 20. Is that convincing? (Not really; 12 to 8 or more lopsided happens by chance about half the time. Look for a bigger gap or test more.)
</details>

<div class="meaning">

<dl>
<dt>training set</dt><dd>the examples the model learns from (about 80%)</dd>
<dt>validation set</dt><dd>examples checked during training to spot memorising (about 10%)</dd>
<dt>test set</dt><dd>examples locked away until the very end, for the honest final check (about 10%)</dd>
<dt>win rate</dt><dd>tuned wins ÷ (tuned wins + base wins); ties are left out</dd>
<dt>Physical meaning</dt><dd>A blind taste test with questions the taster has never practised on. If you mark your own homework, or know which drink is your favourite brand, the score flatters you. Hidden labels and unseen examples make the result mean something.</dd>
</dl>

</div>

<div class="problem" data-problem="training-data-winrate"></div>

<div class="myth">

**"More examples always make a better fine-tune."** Only if they are good. The model copies what it sees, so typos, off-brand replies and old prices get learned too. For style and format, 300 checked examples usually beat 2,000 rushed ones; spend the time fixing and dropping, not collecting.

</div>

Try it: press Play to see a new random set of neurons switched off at every step, raise the drop chance, then flip to Predicting.

<figure class="fig" data-fig="@ai-dropout"><figcaption>Dropout trains many thinned networks that share weights. No neuron can be relied on, so none can memorise one training example alone. At prediction time all neurons are on, which acts like averaging the thinned networks.</figcaption></figure>

## 5. Worked example

*Made-up numbers.* A small pottery shop exports 420 product notes written by its owner over five years. 60 are dropped (outdated, or with prices that might be learned as facts). 360 remain: 288 train, 36 validate, 36 test. After a 15-minute fine-tune of Llama 3.2 3B on a 32 GB Mac, the owner judges 36 blind pairs: the tuned model wins 29, the base 5, two ties. The tuned 3B model now writes in the shop's voice, faster than a 12B model with a long style prompt.

Try it: pick the line, then degree 9, and slide the number of examples. Watch training and test error meet or stay apart.

<figure class="fig" data-fig="@ai-learning-curves"><figcaption>A line is too simple (both errors stay high: more data will not help). A flexible model has a big gap that shrinks as data grows (more data helps). No model gets below the noise floor.</figcaption></figure>

## 6. Mini project 6: Teach a small model your house style

1. Collect 150 or more examples of writing in one consistent style: your emails, product notes, report summaries or social posts.
2. Turn them into chat-format JSONL. Run `prepare.py`.
3. Fine-tune a 3B to 12B model with MLX LM or Unsloth (Lesson 14.3), watching the validation loss.
4. Run the blind test on the test set and record the win rate.
5. Write down one thing the tuned model does worse than the base model, if any.

## 7. Practice

1. Turn three of your own emails into JSONL examples (the user message is what prompted each email).
2. Your tuned model now writes "Hill Pottery" in every answer, even unrelated ones. What went wrong in the data?
3. Why should prices or dates usually be removed from style examples?

<details>
<summary>Answers</summary>

1. User: a one-line description of the situation; assistant: the email as sent (with personal details removed).
2. Every training reply mentioned the shop, so the model learned it as part of the style. Add varied examples where the name is not needed, and keep the system prompt the same as in use.
3. The model may learn them as facts and repeat them when they are out of date. Facts belong in RAG (Lesson 14.1).
</details>

**New words:** *JSONL* (one JSON object per line), *training / validation / test split*, *blind test* or *A/B test* (comparing outputs without knowing which is which), *win rate*.

<div class="keypoints">

- Each example is one chat conversation in JSONL: the user's message and the perfect reply.
- 100 good examples can shift style; 300 to 1,000 is comfortable. Quality and variety beat quantity.
- Split 80% train, 10% validation, 10% test, and never train on the test set.
- Judge with a blind A/B test against the base model; win rate = tuned wins ÷ (tuned + base wins).
- Remove personal details and facts such as prices: models can memorise and repeat them.

</div>
