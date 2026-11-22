---
title: 'Naive Bayes: counting words to catch spam'
seoTitle: 'Naive Bayes spam filter explained, step by step'
summary: 'Bayes'' rule turns "how often does this word appear in spam?" into "how likely is this email spam?". Naive Bayes multiplies those clues for every word. Type a message into a tiny spam filter and follow the sums.'
minutes: 25
updated: 2026-11-22
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
sources:
  - 'Manning, Raghavan and Schütze (2008), Introduction to Information Retrieval, Cambridge University Press, Chapter 13 (Text classification and naive Bayes) https://nlp.stanford.edu/IR-book/'
  - 'Sahami, Dumais, Heckerman and Horvitz (1998), A Bayesian approach to filtering junk e-mail, AAAI Workshop on Learning for Text Categorization'
  - 'scikit-learn user guide: Naive Bayes https://scikit-learn.org/stable/modules/naive_bayes.html'
---

**Module 4 · about 25 minutes · read first: 1.6.** You'll be able to apply Bayes' rule, build a naive Bayes text classifier by hand, and explain smoothing and why it works in log space.

<div class="bigidea">Start with how common spam is, then let every word nudge that belief up or down, and add up the nudges.</div>

## 1. Why this matters

Naive Bayes powered the first spam filters that really worked, in the early 2000s, and it is still a fast, strong first try for text: sorting support tickets, tagging articles, spotting a language. It needs very little data and learns just by counting. It is also the clearest example of **Bayes' rule**, the logic of updating a belief when new evidence arrives, which runs right through statistics and machine learning.

## 2. Bayes' rule

You know how often a word turns up in spam: `$P(\text{word} \mid \text{spam})$`, read "the probability of the word, given spam". You want the reverse: how likely an email is spam, given that it contains the word. Bayes' rule turns one into the other:

```math
P(\text{spam} \mid \text{word}) = \frac{P(\text{word} \mid \text{spam}) \; P(\text{spam})}{P(\text{word})}
```

<div class="meaning">

<dl>
<dt>P(spam)</dt><dd>The prior: the share of all email that is spam, before reading a single word.</dd>
<dt>P(word | spam)</dt><dd>The likelihood: how typical the word is of spam.</dd>
<dt>P(spam | word)</dt><dd>The posterior: your updated belief after seeing the word.</dd>
<dt>P(word)</dt><dd>How common the word is overall. It just makes the answers for spam and not-spam add up to 1.</dd>
<dt>Physical meaning</dt><dd>A detective adding clues. You start with a hunch (the prior). Each clue that fits spam better than normal mail shifts the odds towards spam; each clue that fits normal mail shifts them back.</dd>
</dl>

</div>

<div class="problem" data-problem="naive-bayes-test"></div>

Try it: slide the share of positives down to 1% while watching the two curves and the counts.

<figure class="fig" data-fig="@ai-pr-curve"><figcaption>The ROC curve does not move when positives become rare, but the precision-recall curve collapses: a small false-positive rate applied to a huge pile of negatives swamps the few true positives. For rare events, read precision.</figcaption></figure>

## 3. Many words: the naive step

An email has many words. Assume, naively, that each word appears independently of the others once we know the class. Then the likelihoods simply multiply (the symbol `$\propto$` means "is proportional to", and `$\prod$` means "multiply all of these"):

```math
P(\text{spam} \mid w_1, \dots, w_m) \;\propto\; P(\text{spam}) \prod_{k=1}^{m} P(w_k \mid \text{spam})
```

Do the same for "normal", then scale the two answers so they add to 1.

<div class="steps">
<div class="step"><p><b>Start with the prior.</b> 40 % of training emails were spam: P(spam) = 0.4, P(normal) = 0.6.</p></div>
<div class="step"><p><b>First clue: "prize".</b> It is 14 times more common in spam (0.0150 against 0.00105). Spam score: 0.4 × 0.0150 = 0.0060. Normal: 0.6 × 0.00105 = 0.00063.</p></div>
<div class="step"><p><b>Second clue: "meeting".</b> It is 7.6 times more common in normal mail (0.0163 against 0.00214). Spam: 0.0060 × 0.00214 = 1.29 × 10⁻⁵. Normal: 0.00063 × 0.0163 = 1.03 × 10⁻⁵.</p></div>
<div class="step"><p><b>Scale to add to 1.</b> P(spam) = 1.29 ÷ (1.29 + 1.03) ≈ 0.56. The two clues nearly cancel: slightly more likely spam than not.</p></div>
</div>

The independence assumption is plainly false ("free" makes "prize" more likely), so the probabilities come out too extreme. But the **ranking** of spam over normal is usually right, and that is what classification needs.

<!--fig:spam-bayes-->

Try it: slide the style from honest to over-confident and watch the bars drop below the diagonal.

<figure class="fig" data-fig="@ai-calibration"><figcaption>A calibrated model's confidence can be trusted. An over-confident model sounds sure when it should not, which is how confident wrong answers, called hallucinations, appear.</figcaption></figure>

## 4. Two practical fixes

- **Smoothing.** If "invoice" never appeared in the spam examples, `$P(\text{invoice} \mid \text{spam}) = 0$`, and that one word would veto every other clue. Add 1 to every count (**Laplace** or add-one smoothing), so unseen words get a small chance instead of none.
- **Logs.** Multiplying hundreds of tiny probabilities gives a number too small for a computer to store, and it rounds to 0. Add their logarithms instead: `$\ln P(\text{spam}) + \sum_k \ln P(w_k \mid \text{spam})$`. The class with the bigger total wins.

<div class="problem" data-problem="naive-bayes-spam"></div>

<div class="myth">

**"P(word | spam) and P(spam | word) are the same thing."** They can be wildly different. Almost every spam email contains the word "the", so P("the" | spam) is near 1. But seeing "the" tells you almost nothing about whether an email is spam, because normal emails are full of it too. Bayes' rule is exactly the tool for turning one into the other correctly.

</div>

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

**Try it:** 1 % of patients have a disease. A test catches 90 % of cases and wrongly flags 5 % of healthy people. Someone tests positive. Chance they have it? (`$\frac{0.9 \times 0.01}{0.9 \times 0.01 + 0.05 \times 0.99} = \frac{0.009}{0.0585} \approx 15\%$`.)
</details>

## 5. Worked example

*Made-up numbers.* Training set: 40 spam emails with 400 words in total, 60 normal emails with 900 words; vocabulary of 1,000 different words. "Prize" appears 20 times in spam, 1 time in normal; "meeting" 2 times in spam, 30 in normal.

- Priors: `$P(\text{spam}) = 0.4$`, `$P(\text{normal}) = 0.6$`.
- `$P(\text{prize} \mid \text{spam}) = 21/1400 = 0.0150$`; `$P(\text{prize} \mid \text{normal}) = 2/1900 = 0.00105$`.
- `$P(\text{meeting} \mid \text{spam}) = 3/1400 = 0.00214$`; `$P(\text{meeting} \mid \text{normal}) = 31/1900 = 0.0163$`.

For the email "prize meeting":

- Spam: 0.4 × 0.0150 × 0.00214 = 1.29 × 10⁻⁵
- Normal: 0.6 × 0.00105 × 0.0163 = 1.03 × 10⁻⁵
- `$P(\text{spam}) = 1.29 / (1.29 + 1.03) \approx 0.56$`. The two clues nearly cancel: a coin flip, slightly towards spam.

## 6. Practice

1. In the simulation, which single word pushes a message hardest towards spam?
2. Why do we work with sums of logs rather than products?
3. A word appears in every email of both classes equally often. How does it affect the decision?

<details>
<summary>Answers</summary>

1. Look for the largest "spam ×" ratio in the table; words such as "free", "claim" and "prize" appear only in spam examples.
2. Products of many small numbers become too small for the computer and round to zero; sums of logs stay in a safe range and give the same winner.
3. Not at all: it multiplies both classes by the same amount. Such words ("the", "and") are often removed as "stop words".
</details>

<div class="keypoints">

- Bayes' rule turns P(evidence | class) and the prior P(class) into P(class | evidence).
- Naive Bayes multiplies the clues from every word, as if words were independent given the class.
- Add-one (Laplace) smoothing stops an unseen word from vetoing everything.
- Real filters add logarithms instead of multiplying, to avoid numbers too small to store.
- The probabilities are often too extreme, but the ranking is usually right.

</div>

**Try it on your own data:** the [[topic-modeller]] counts words across your own texts, the first step of any text classifier.

**New words:** *Bayes' rule*, *prior*, *likelihood*, *posterior*, *naive Bayes*, *conditional independence*, *Laplace smoothing*, *log probabilities*, *stop words*.
