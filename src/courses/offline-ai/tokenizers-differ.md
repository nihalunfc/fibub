---
title: 'Tokenizers differ: languages, code and counts'
seoTitle: 'Why token counts differ by language | Offline AI'
summary: The same text gives different token counts in different models and languages. Why that happens and what it means for Hindi, Malayalam, code and your limits.
minutes: 20
updated: 2026-11-18
quiz:
  - q: You switch from one model family to another. What happens to the token count of the same document?
    choices: ['It stays exactly the same', 'It changes, because each family has its own tokenizer', 'It always halves']
    ans: 1
    why: Each family learns its own vocabulary, so counts differ, often by 10 to 30% for English and more for other languages.
  - q: Why does Malayalam text often use more tokens than English text with the same meaning?
    choices: ['Malayalam words are always longer', 'The vocabulary has fewer ready-made pieces for it, so words are split into more parts', 'Models refuse Malayalam']
    ans: 1
    why: Tokenizers learn most pieces from the languages most common in their training text. Less common scripts get split more finely.
  - q: What does a higher token count mean for a local model?
    choices: ['Nothing', 'The text fills more of the context window and takes longer to process', 'It costs more per month']
    ans: 1
    why: Locally there is no fee, but more tokens fill memory and take more time.
---

**Module 3 · about 20 minutes · read first: 3.1.** You'll be able to predict when your text will cost more tokens and plan for it.

## 1. Why this matters

If you work in Hindi, Tamil, Malayalam, Arabic or with code and spreadsheets, your token counts can be much higher than the English rule of thumb. That means shorter documents per request and slower jobs, locally or in the cloud.

## 2. Each family learns its own pieces

A tokenizer's vocabulary is learned from training text: pieces that appear often become single tokens. So:

- **Different families split differently.** Gemma, Qwen and gpt-oss each have their own tokenizer, so the same document gives different counts.
- **Bigger vocabularies split less.** Newer models have vocabularies of about 200,000 to 260,000 pieces and handle more languages efficiently than older ones of about 32,000.
- **Languages common in training text do best.** English is cheapest almost everywhere. Languages with less training text, and scripts with many combining marks, are split more finely, often costing several times more tokens for the same meaning.
- **Code and data cost more.** Indentation, brackets, long identifiers and numbers all add pieces.

Use the language buttons in the toy tokenizer in Lesson 3.1 to see the effect (exaggerated by its tiny vocabulary).

## 3. What to do about it

- Measure, do not guess: Lesson 3.10 shows how to get exact counts from your engine.
- Prefer a model whose tokenizer handles your language well; model cards often say which languages were a focus.
- For mixed documents, keep the instructions in English (cheapest) and the content in its own language.
- Allow a bigger context for non-English work.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** token count = characters ÷ average characters per token, and that average depends on how well the vocabulary fits the text.

**Equation:** tokens = characters ÷ c, where c ≈ 4 for English and lower for text the vocabulary fits badly.

**Analogy:** packing with boxes made for someone else's things. When the boxes match your items, few boxes are needed; when they don't, you use many small ones.

**Try it:** 8,000 characters with c = 4, then with c = 1.5? (2,000 tokens, then about 5,300.)
</details>

## 4. Worked example

*Made-up numbers.* A Kerala school wants summaries of 2,000-word Malayalam notices. In English the notice would be about 2,700 tokens; their model's tokenizer gives about 7,000 for the Malayalam. With a context of 8,192, one notice fits but two do not, so the script sends them one at a time.

## 5. Practice

1. Write the same sentence in English and another language you know, and compare in the toy tokenizer.
2. A 5,000-character Python file at c = 3. About how many tokens?
3. Your model has a 16,000-token context. Roughly how many characters of text with c = 2 fit, leaving 2,000 tokens for the answer?

<details>
<summary>Answers</summary>

1. The non-English version will show more tokens in the toy; real tokenizers narrow the gap but rarely close it.
2. About 1,700 tokens.
3. 14,000 × 2 = 28,000 characters.
</details>

**New words:** *vocabulary size* (how many pieces a tokenizer knows), *characters per token* (how efficiently a text is cut).
