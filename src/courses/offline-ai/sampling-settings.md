---
title: Temperature, top-p and the other dials
summary: What temperature, top-p, top-k, min-p, repeat penalty and seed do to a local model's answers, with settings for facts, writing and code.
minutes: 20
updated: 2026-11-22
sources:
  - 'Ollama Modelfile parameters (temperature, top_k, top_p, min_p, repeat_penalty, seed, num_predict), official documentation, https://docs.ollama.com/modelfile'
  - 'llama.cpp server sampling options, project documentation (official page), https://github.com/ggml-org/llama.cpp/tree/master/tools/server'
  - 'Holtzman, A. et al. (2019), The Curious Case of Neural Text Degeneration (nucleus or top-p sampling), https://arxiv.org/abs/1904.09751'
  - 'Nguyen, M. et al. (2024), min-p sampling for creative and coherent outputs at high temperature, https://arxiv.org/abs/2407.01082'
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

<div class="bigidea">A few dials decide how the model picks each next word from its list of chances: turn them down for steady, repeatable answers and up for variety.</div>

## 1. Why this matters

The same model can feel dull, wild or just right, depending on a few settings. Cloud apps hide them. Local engines let you set them yourself. Getting them right fixes many "this model is bad" complaints.

## 2. The dials

At each step the model gives every possible next token a score (Lesson 2.1). The scores become chances, and one token is picked. The dials change how that pick happens:

- **Temperature:** how bold the pick is. 0 always takes the top token; 0.7 is balanced; above 1 gets adventurous.
- **top-k:** keep only the k most likely tokens (for example 40) and ignore the rest.
- **top-p:** keep the most likely tokens until their chances add up to p (for example 0.9), and ignore the rest.
- **min-p:** drop any token whose chance is less than a share of the top token's chance (for example 0.05, so under 5% of the leader's chance). Works well at higher temperatures.
- **Repeat penalty:** make tokens that were already used a little less likely (about 1.05 to 1.1).
- **Seed:** a fixed starting number for the dice, so the "random" choices repeat exactly.
- **Max tokens** (`num_predict` in Ollama): a cap on the answer's length.

Think of a waiter suggesting a dish. Temperature is how adventurous the waiter is. top-k, top-p and min-p take the dishes nobody orders off the menu before the waiter suggests anything.

<div class="steps" data-fig="sampling-settings-temperature">
<div class="step"><p><b>The scores.</b> After "The weather today is", the model scores four words: sunny 2, cloudy 1.5, rainy 1, purple −1. Higher means more likely.</p></div>
<div class="step"><p><b>Temperature 1.</b> Softmax turns the scores into chances: sunny 49%, cloudy 30%, rainy 18%, purple 2.5%. They add up to 100%.</p></div>
<div class="step"><p><b>Temperature 0.5.</b> Dividing the scores by 0.5 doubles the gaps, so the leader pulls ahead: sunny 66%, cloudy 24%, rainy 9%, purple 0.2%. Answers get steadier.</p></div>
<div class="step"><p><b>Temperature 1.5.</b> Dividing by 1.5 shrinks the gaps: sunny 42%, cloudy 30%, rainy 22%, purple 6%. Answers get more varied, and odd words creep in.</p></div>
<div class="step"><p><b>top-p 0.9 (at temperature 1).</b> Sunny + cloudy is 79%, not yet 90%; adding rainy makes 98%, so those three stay and purple is cut. Their chances are scaled back up to 100%: about 51%, 31% and 19%. Then one is picked.</p></div>
</div>

<!--fig:next-word-->

Try it: set temperature to 0.3, then 1.8, then cut the list with top-k and top-p, and press Draw 200 each time.

<figure class="fig" data-fig="@ai-sampling-topp"><figcaption>Temperature reshapes the odds; top-k and top-p remove the unlikely tail before choosing. Low settings give safe, repeatable text; high settings give variety and more risk of nonsense.</figcaption></figure>

## 3. Starting points

| Job | Temperature | Other |
|---|---|---|
| Extraction, JSON, classification | 0 to 0.2 | fixed seed |
| Facts and summaries | 0.2 to 0.5 | top-p 0.9 |
| Writing and ideas | 0.7 to 1.0 | min-p 0.05 |
| Code | 0.2 or the maker's value | |
| Reasoning models | the maker's value | many suggest about 0.6 to 1.0 |

Always check the model card first. Makers publish recommended settings, and they matter.

<div class="myth">

**"Temperature 0 makes the model tell the truth."** It only makes the model repeat its single most likely answer. If that answer is wrong, you get the same wrong answer every time. Low temperature buys consistency, not accuracy. For facts, give the model the source text (Lesson 10.5 and Module 12).

</div>

Try it: drag the score bars, press Add 2 to all, and move the temperature.

<figure class="fig" data-fig="@ai-softmax-lab"><figcaption>Softmax turns any scores into probabilities that are positive and add to 100%. Adding the same number to every score changes nothing; a low temperature makes the leader win nearly everything and a high one flattens the odds.</figcaption></figure>

## 4. Where to set them

- **LM Studio:** the right-hand panel of the chat.
- **Ollama:** in the chat type `/set parameter temperature 0.2`; in code, `options={"temperature": 0.2}` (Lesson 11.2); permanently in a Modelfile with `PARAMETER temperature 0.2`.
- **llama.cpp:** `--temp 0.2 --top-p 0.9` on the command line.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** temperature divides the scores before they are turned into chances; the other dials cut the list before the pick.

**Equation:** the chance of token i is

```math
p_i = \frac{e^{s_i / T}}{\sum_j e^{s_j / T}}
```

where `$s_i$` is token i's score and `$T$` is the temperature.

**Analogy:** a quiz contestant. Low temperature: always says their first instinct. High: sometimes takes a wild guess. top-p: only guesses from answers they think are plausible.

**Try it:** two tokens with scores 2 and 1 at T = 1, then T = 0.5? (T = 1: e² : e¹ ≈ 7.4 : 2.7, about 73% and 27%. T = 0.5: e⁴ : e² ≈ 54.6 : 7.4, about 88% and 12%.)
</details>

<div class="meaning">

<dl>
<dt>s<sub>i</sub> (score)</dt><dd>the model's raw rating of token i as the next token; bigger means more likely</dd>
<dt>T (temperature)</dt><dd>a number you choose that stretches or squeezes the gaps between scores; a small T makes the leader win more often</dd>
<dt>e<sup>s/T</sup></dt><dd>turns each score into a positive weight, so even low scores keep a small chance</dd>
<dt>÷ the sum</dt><dd>shares out 100% among all the tokens in proportion to their weights</dd>
<dt>Physical meaning</dt><dd>Temperature is a "boldness" knob. Near 0 the model always says the same safest thing, like a cautious clerk. Near 1.5 it takes risks, like a brainstorming friend. top-p and min-p remove the silly options before the dice are rolled.</dd>
</dl>

</div>

<div class="problem" data-problem="sampling-settings-softmax"></div>

## 5. Worked example

*Made-up numbers.* Bilal extracts invoice totals to JSON. At temperature 0.8, one file in ten has a made-up field. At temperature 0 with a JSON schema (Lesson 11.3), every file comes out the same and the checks pass.

## 6. Practice

1. Ask your model for five names for a bakery at temperature 0, then 1.0. Compare.
2. Find the recommended settings on the model card of your main model.
3. Set them permanently in a Modelfile or an LM Studio preset.

<details>
<summary>Answers</summary>

1. At 0 you get the same list every time; at 1.0 it varies.
2. Often in a section called "Best practices" or "Usage".
3. Ollama: `ollama create mymodel -f Modelfile`; LM Studio: save a preset.
</details>

**New words:** *temperature*, *top-k*, *top-p*, *min-p*, *repeat penalty*, *seed*.

<div class="keypoints">

- At each step the model scores every possible next token; the dials decide how one is picked.
- Temperature divides the scores: 0 always picks the top token, about 0.7 is balanced, above 1 is adventurous.
- top-k, top-p and min-p cut unlikely tokens from the list before the pick.
- Use 0 to 0.2 (and a fixed seed) for extraction and JSON, 0.7 to 1.0 for writing, and the model card's values when they exist.
- Low temperature gives the same answer every time, not a truer one.

</div>
