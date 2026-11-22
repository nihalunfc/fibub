---
title: 'Tokenizers differ: languages, code and counts'
seoTitle: 'Why token counts differ by language | Offline AI'
summary: The same text gives different token counts in different models and languages. Why that happens and what it means for Hindi, Malayalam, code and your limits.
minutes: 20
updated: 2026-11-22
sources:
  - 'Petrov, A. et al. (2023), Language Model Tokenizers Introduce Unfairness Between Languages https://arxiv.org/abs/2305.15425'
  - 'Sennrich, R., Haddow, B. and Birch, A. (2016), Neural Machine Translation of Rare Words with Subword Units https://arxiv.org/abs/1508.07909'
  - 'Kudo, T. and Richardson, J. (2018), SentencePiece: A simple and language independent subword tokenizer https://arxiv.org/abs/1808.06226'
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

<div class="bigidea">Each model family learns its own set of word pieces, mostly from English, so the same meaning can cost a few tokens in one language or model and several times more in another.</div>

## 1. Why this matters

If you work in Hindi, Tamil, Malayalam, Arabic or with code and spreadsheets, your token counts can be much higher than the English rule of thumb. That means shorter documents per request and slower jobs, locally or in the cloud.

## 2. Each family learns its own pieces

A tokenizer's vocabulary is learned from training text: pieces that appear often become single tokens. It is like a shorthand writer who invented quick symbols for the words they hear most. Their English is fast; a language they rarely hear is spelled out letter by letter. So:

- **Different families split differently.** Gemma, Qwen and gpt-oss each have their own tokenizer, so the same document gives different counts.
- **Bigger vocabularies split less.** Newer models have vocabularies of about 200,000 to 260,000 pieces and handle more languages efficiently than older ones of about 32,000.
- **Languages common in training text do best.** English is cheapest almost everywhere. Languages with less training text, and scripts with many combining marks, are split more finely, often costing several times more tokens for the same meaning.
- **Code and data cost more.** Indentation, brackets, long identifiers and numbers all add pieces.

Use the language buttons in the toy tokenizer in Lesson 3.1 to see the effect (exaggerated by its tiny vocabulary).

<div class="myth">

**"A page is a page: it costs the same tokens whatever the model or language."** Token counts belong to the tokenizer, not the text. Switch model family and an English document can change by 10 to 30%. Research comparing many languages (Petrov and colleagues, 2023, in the sources) found the same meaning can take several times as many tokens in some languages as in English. Always measure with the model you will actually use.

</div>

Step through a few merges and watch letters become chunks.

<figure class="fig" data-fig="@ai-bpe-merge"><figcaption>A tokeniser is built by repeatedly merging the commonest neighbouring pair. Common chunks become single tokens (cheap), rare words stay in several pieces (costly). This is why token counts differ from word counts.</figcaption></figure>

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

<div class="meaning">

<dl>
<dt>characters</dt><dd>how long the text is, counting every letter, space and mark</dd>
<dt>c</dt><dd>average characters per token: about 4 for English, often 1.5 to 3 for text the vocabulary fits badly</dd>
<dt>tokens = characters ÷ c</dt><dd>the token count; a smaller c means more tokens for the same text</dd>
<dt>Physical meaning</dt><dd>c measures how well the model's word pieces fit your text. A low c means your documents fill the context window sooner, take longer to read and cost more on a cloud API, even though they say the same thing.</dd>
</dl>

</div>

## 4. Worked example

*Made-up numbers.* A Kerala school wants summaries of 2,000-word Malayalam notices. Step through their planning.

<div class="steps">
<div class="step"><p><b>In English</b> a 2,000-word notice would be about 2,000 ÷ 0.75 ≈ <b>2,700 tokens</b>.</p></div>
<div class="step"><p><b>In Malayalam</b> their model's tokenizer gives about <b>7,000 tokens</b> for the same notice: about 2.6 times as many.</p></div>
<div class="step"><p><b>Room in the window.</b> Their context is 8,192 tokens. Keep 1,000 for the summary and about 200 for the instructions: 8,192 − 1,200 = <b>6,992 tokens</b> left for the notice.</p></div>
<div class="step"><p><b>Check the fit.</b> 7,000 is just over 6,992, so they trim the summary allowance to 800 tokens and one notice fits. Two notices (14,000) never would.</p></div>
<div class="step"><p><b>Plan.</b> The script sends one notice per request, with the instructions in English (cheapest) and the notice in Malayalam.</p></div>
</div>

<div class="problem" data-problem="tokenizers-differ-fit"></div>

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

<div class="keypoints">

- Each model family learns its own vocabulary, so the same document gives different token counts.
- Bigger vocabularies (about 200,000 to 260,000 pieces) split less and handle more languages well.
- Languages and scripts less common in training text, and code and data, are split into more tokens.
- Tokens = characters ÷ c, where c is about 4 for English and lower when the vocabulary fits badly.
- Measure with your own model, keep instructions in English, and allow a bigger context for non-English work.

</div>
