---
title: 'Naive Bayes: counting words to catch spam'
seoTitle: 'Naive Bayes spam filter explained, step by step'
summary: 'Bayes'' rule turns "how often does this word appear in spam?" into "how likely is this email spam?". Naive Bayes multiplies those clues for every word. Type a message into a tiny spam filter and follow the sums.'
minutes: 25
updated: 2026-11-21
quiz:
  - q: 'Bayes'' rule gives P(spam | word) from:'
    choices: ['P(word | spam), P(spam) and P(word)', 'Only P(spam)', 'The number of words in the email']
    ans: 0
    why: P(spam | word) = P(word | spam) × P(spam) ÷ P(word).
  - q: What is "naive" about naive Bayes?
    choices: ['It ignores the prior', 'It treats every word as independent of the others, given the class', 'It only works on short emails']
    ans: 1
    why: '"Free" and "prize" clearly go together, but the model multiplies their chances as if they were unrelated. Surprisingly, it still classifies well.'
  - q: Why add 1 to every word count (Laplace smoothing)?
    choices: ['To make the numbers bigger', 'So that a word never seen in one class doesn''t give that class probability zero', 'To remove common words']
    ans: 1
    why: Without it, one unseen word would multiply the whole product by zero and veto every other clue.
---

**Module 4 · about 25 minutes · read first: 1.6.** You'll be able to apply Bayes' rule, build a naive Bayes text classifier by hand, and explain smoothing and why it works in log space.

## 1. Why this matters

Naive Bayes powered the first spam filters that really worked (in the early 2000s) and is still a fast, strong baseline for text: sorting support tickets, tagging articles, detecting language. It needs very little data and trains by counting. It is also the clearest example of **Bayes' rule**, the logic of updating a belief with evidence, which runs through statistics and machine learning.

## 2. Bayes' rule

You know how often a word appears in spam, `$P(\text{word} \mid \text{spam})$`. You want the reverse: how likely an email is spam given that it contains the word. Bayes' rule turns one into the other:

```math
P(\text{spam} \mid \text{word}) = \frac{P(\text{word} \mid \text{spam}) \; P(\text{spam})}{P(\text{word})}
```

- `$P(\text{spam})$` is the **prior**: the share of all email that is spam, before reading a word.
- `$P(\text{word} \mid \text{spam})$` is the **likelihood**: how typical the word is of spam.
- `$P(\text{spam} \mid \text{word})$` is the **posterior**: the updated belief.
- `$P(\text{word})$` just makes the answers for spam and not-spam add up to 1.

## 3. Many words: the naive step

An email has many words. Assuming, naively, that each word appears independently of the others once we know the class, the likelihoods simply multiply:

```math
P(\text{spam} \mid w_1, \dots, w_m) \;\propto\; P(\text{spam}) \prod_{k=1}^{m} P(w_k \mid \text{spam})
```

Do the same for "normal", then scale the two so they add to 1. The independence assumption is plainly false ("free" makes "prize" more likely), so the probabilities come out too extreme. But the **ranking** of spam over normal is usually right, which is what classification needs.

<!--fig:spam-bayes-->

## 4. Two practical fixes

- **Smoothing.** If "invoice" never appeared in the spam examples, `$P(\text{invoice} \mid \text{spam}) = 0$`, and one word would veto all the others. Add 1 to every count (**Laplace** or add-one smoothing), so unseen words get a small chance instead of none.
- **Logs.** Multiplying hundreds of small probabilities underflows to 0 in a computer. Add their logarithms instead: `$\ln P(\text{spam}) + \sum_k \ln P(w_k \mid \text{spam})$`. The class with the bigger total wins.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** Bayes' rule updates a prior belief with evidence; naive Bayes assumes the pieces of evidence are independent given the class.

**Word probabilities with smoothing:** if spam messages contain `$N_{\text{spam}}$` words in total, the word `$w$` appears `$n_{w,\text{spam}}$` times, and the vocabulary has `$V$` different words,

```math
P(w \mid \text{spam}) = \frac{n_{w,\text{spam}} + 1}{N_{\text{spam}} + V}
```

**The decision in log space:**

```math
\text{score}(c) = \ln P(c) + \sum_{k} \ln P(w_k \mid c), \qquad \hat{y} = \arg\max_c \text{score}(c)
```

**Analogy:** a detective adding clues. Each clue shifts the odds a little; together they tip the case. The "naive" detective counts two clues that always come together as two separate pieces of evidence.

**Try it:** 1 % of patients have a disease. A test catches 90 % of cases and wrongly flags 5 % of healthy people. Someone tests positive. Chance they have it? (`$\frac{0.9 \times 0.01}{0.9 \times 0.01 + 0.05 \times 0.99} = \frac{0.009}{0.0585} \approx 15\%$`.)
</details>

## 5. Worked example

*Made-up numbers.* Training set: 40 spam emails with 400 words in total, 60 normal emails with 900 words; vocabulary of 1,000 distinct words. "Prize" appears 20 times in spam, 1 time in normal; "meeting" 2 times in spam, 30 in normal.

- Priors: `$P(\text{spam}) = 0.4$`, `$P(\text{normal}) = 0.6$`.
- `$P(\text{prize} \mid \text{spam}) = 21/1400 = 0.0150$`; `$P(\text{prize} \mid \text{normal}) = 2/1900 = 0.00105$`.
- `$P(\text{meeting} \mid \text{spam}) = 3/1400 = 0.00214$`; `$P(\text{meeting} \mid \text{normal}) = 31/1900 = 0.0163$`.

For the email "prize meeting":

- Spam: 0.4 × 0.0150 × 0.00214 = 1.29 × 10⁻⁵
- Normal: 0.6 × 0.00105 × 0.0163 = 1.03 × 10⁻⁵
- `$P(\text{spam}) = 1.29 / (1.29 + 1.03) \approx 0.56$`. The two clues nearly cancel: a coin-flip, slightly towards spam.

## 6. Practice

1. In the simulation, which single word pushes a message hardest towards spam?
2. Why do we work with sums of logs rather than products?
3. A word appears in every email of both classes equally often. How does it affect the decision?

<details>
<summary>Answers</summary>

1. Look for the largest "spam ×" ratio in the table; words such as "free", "claim" and "prize" appear only in spam examples.
2. Products of many small numbers underflow to zero on a computer; sums of logs stay in a safe range and give the same winner.
3. Not at all: it multiplies both classes by the same amount. Such words ("the", "and") are often removed as "stop words".
</details>

**Try it on your own data:** the [[topic-modeller]] counts words across your own texts, the first step of any text classifier.

**New words:** *Bayes' rule*, *prior*, *likelihood*, *posterior*, *naive Bayes*, *conditional independence*, *Laplace smoothing*, *log probabilities*, *stop words*.
