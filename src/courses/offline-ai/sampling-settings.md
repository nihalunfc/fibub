---
title: Temperature, top-p and the other dials
summary: What temperature, top-p, top-k, min-p, repeat penalty and seed do to a local model's answers, with settings for facts, writing and code.
minutes: 20
updated: 2026-11-19
sources:
  - 'Ollama Modelfile parameters (temperature, top_k, top_p, min_p, repeat_penalty, seed, num_predict), official documentation, https://docs.ollama.com/modelfile'
  - 'llama.cpp server sampling options, project documentation (official page), https://github.com/ggml-org/llama.cpp/tree/master/tools/server'
quiz:
  - q: You want the same answer every time for a data extraction job. What do you set?
    choices: ['Temperature 0 (or a fixed seed)', 'Temperature 1.5', 'top-p 1 and a random seed']
    ans: 0
    why: Temperature 0 always picks the most likely token; a fixed seed repeats the same random choices.
  - q: What does top-p 0.9 do?
    choices: ['Keeps only the most likely tokens that together make up 90% of the chance, then picks among them', 'Makes answers 90% shorter', 'Uses 90% of the GPU']
    ans: 0
    why: It cuts off the long tail of unlikely tokens.
  - q: A model keeps repeating the same phrase. Which setting helps?
    choices: ['A slightly higher repeat penalty, or the maker''s recommended settings', 'A lower context length', 'A smaller font']
    ans: 0
    why: Repeat penalty lowers the chance of tokens that already appeared. Wrong chat templates (Lesson 10.2) also cause loops.
---

**Module 10 · about 20 minutes · read first: 2.1.** You'll be able to tune a model's answers from careful and repeatable to varied and creative.

## 1. Why this matters

The same model can feel dull, wild or just right depending on a few settings. Cloud apps hide them; local engines let you set them. Getting them right fixes many "this model is bad" complaints.

## 2. The dials

At each step the model gives every possible next token a score (Lesson 2.1). The dials decide how one is picked:

- **Temperature:** 0 always picks the top token; 0.7 is balanced; above 1 gets adventurous.
- **top-k:** keep only the k most likely tokens (for example 40).
- **top-p:** keep the most likely tokens until their chances add up to p (for example 0.9).
- **min-p:** drop tokens less than a share of the top token's chance (for example 0.05). Works well at higher temperatures.
- **Repeat penalty:** make already-used tokens a little less likely (about 1.05 to 1.1).
- **Seed:** a fixed number that makes the random choices repeatable.
- **Max tokens** (`num_predict` in Ollama): a cap on the answer's length.

<!--fig:next-word-->

## 3. Starting points

| Job | Temperature | Other |
|---|---|---|
| Extraction, JSON, classification | 0 to 0.2 | fixed seed |
| Facts and summaries | 0.2 to 0.5 | top-p 0.9 |
| Writing and ideas | 0.7 to 1.0 | min-p 0.05 |
| Code | 0.2 or the maker's value | |
| Reasoning models | the maker's value | many suggest about 0.6 to 1.0 |

Always check the model card first: makers publish recommended settings, and they matter.

## 4. Where to set them

- **LM Studio:** the right-hand panel of the chat.
- **Ollama:** in the chat type `/set parameter temperature 0.2`; in code, `options={"temperature": 0.2}` (Lesson 11.2); permanently in a Modelfile with `PARAMETER temperature 0.2`.
- **llama.cpp:** `--temp 0.2 --top-p 0.9` on the command line.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** temperature divides the scores before turning them into chances; the other dials cut the list before the pick.

**Equation:** chance of token i = e^(score_i ÷ T) ÷ Σ e^(score_j ÷ T).

**Analogy:** a quiz contestant. Low temperature: always says their first instinct. High: sometimes takes a wild guess. top-p: only guesses from answers they think are plausible.

**Try it:** two tokens with scores 2 and 1 at T = 1, then T = 0.5? (T = 1: e² : e¹ ≈ 7.4 : 2.7, about 73% and 27%. T = 0.5: e⁴ : e² ≈ 54.6 : 7.4, about 88% and 12%.)
</details>

## 5. Worked example

*Made-up numbers.* Bilal extracts invoice totals to JSON. At temperature 0.8 one file in ten has a made-up field. At temperature 0 with a JSON schema (Lesson 11.3), every file comes out the same and checks pass.

## 6. Practice

1. Ask your model for five names for a bakery at temperature 0, then 1.0. Compare.
2. Find the recommended settings on the model card of your main model.
3. Set them permanently in a Modelfile or LM Studio preset.

<details>
<summary>Answers</summary>

1. At 0 you get the same list every time; at 1.0 it varies.
2. Often in a section called "Best practices" or "Usage".
3. Ollama: `ollama create mymodel -f Modelfile`; LM Studio: save a preset.
</details>

**New words:** *temperature*, *top-k*, *top-p*, *min-p*, *repeat penalty*, *seed*.
