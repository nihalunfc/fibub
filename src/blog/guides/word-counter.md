---
title: "How to count words and characters, and hit a word limit"
summary: "What a word counter actually counts, how reading time is worked out, and how to trim an essay, post or page description to fit its limit."
tools: [word-counter, readability-checker, text-cleaner, case-converter]
updated: 2026-11-10
sources:
  - "Reading rate of 238 words a minute: Brysbaert M (2019), How many words do we read per minute? A review and meta-analysis of reading rate, Journal of Memory and Language 109: 104047."
  - "Speaking rate of 150 words a minute is a common rule of thumb for presentations, not a fixed standard."
  - "The text in the worked example is made up for teaching."
---

Almost every form that asks you to write something also sets a cap: 280 characters for a post, 650 words for an application essay, 160 characters for the snippet a search engine shows under a page title. The [[word-counter]] gives you the numbers as you type, tells you how far over or under a cap you are, and lists the words you lean on most. If the text came from a PDF or email full of broken lines, run it through the [[text-cleaner]] first, and once it fits, the [[readability-checker]] shows whether it is easy to follow.

## What it is

A counter applies a few simple rules, and those rules are why two programs can disagree by a few words.

- **Words.** Any unbroken run of non-space characters counts as one word. So "hand-thrown" is one word, "350" is one word, and a dash with spaces on both sides ("well — known") counts as a word of its own.
- **Characters.** Every letter, digit, space, punctuation mark and emoji. **Without spaces** drops the spaces, tabs and line breaks.
- **Sentences.** A stretch of text that ends in a full stop, question mark, exclamation mark or ellipsis and has at least one letter or digit in it.
- **Paragraphs.** Blocks separated by an empty line. A single line break does not start a new paragraph.
- **Reading and speaking time.** Time = W ÷ R, where W is the number of words and R is a rate in words per minute. The tool uses R = 238 for silent reading and R = 150 for reading aloud.
- **Most used words.** Each word's share = (times it appears ÷ total words) × 100. The list shows the top ten, with common short words such as "the", "and" and "is" left out unless you untick the box.

## How to use it

1. Type into the **Your text** box, or paste text copied from anywhere else. Every number updates while you type.
2. Read the **Counts** panel: words, characters, characters without spaces, sentences, paragraphs, reading time and speaking time.
3. Open the **Preset** menu under **Check a limit**. Pick a ready-made cap, from a 60-character search page title up to a 1,000-word statement of purpose, or choose **My own limit**.
4. For your own limit, type the number and set the unit menu to words or characters.
5. If you are over, the leftover part appears in a highlighted box, starting at the exact word or character where the limit runs out. Edit your text until the box disappears.
6. Look at **Most used words** to catch repetition. Untick **Leave out common words** to see every word, small ones included.

## A worked example

Sam sells pottery online and is writing the description that search engines will show for a product page. The cap is 160 characters. Sam's first draft is:

> Hand-thrown clay mugs, glazed in small batches. Each mug holds 350 ml and is safe in the dishwasher. Order by Friday and your mug ships on Monday, wrapped in recycled paper.

The counter shows **31 words**, **173 characters** (143 without spaces) and **3 sentences**. Reading time is 31 ÷ 238 = 0.130 minutes, about **8 seconds**; spoken aloud it is 31 ÷ 150 = 0.207 minutes, about **12 seconds**.

With the **Meta description (160 characters)** preset chosen, the tool reports 173 of 160 characters, so **13 over**. The highlighted box shows "cycled paper.", because character 161 falls in the middle of "recycled".

Sam deletes ", wrapped in recycled paper". The new text has **27 words** and **146 characters**, so it is **14 characters under** the cap and the highlighted box goes away.

The most used words list puts "mug" at the top: 2 times out of 31 words, a share of 2 ÷ 31 × 100 = **6.5%**. "Mugs" is listed separately, because the tool matches exact spellings, not word families.

## Where it is used

- **School and university.** Essays, abstracts and personal statements nearly always have a word cap, and going over can mean the reader stops at the limit.
- **Job applications.** Online forms often cut off answers at a set number of characters, sometimes without warning.
- **Websites and shops.** Page titles and descriptions that run past what search engines show get trimmed with "...", so the key words should come first.
- **Speeches and videos.** Speaking time turns a script into a rough running time. A 600-word talk takes about 4 minutes at 150 words a minute.

## Common mistakes

- **Counting with the wrong unit.** "500" on a form can mean words or characters. Read the form's own wording, then set the unit to match.
- **Forgetting that spaces count.** Most character limits include spaces. If a box says "160 characters", use the main characters figure, not the one without spaces.
- **Trusting the sentence count with numbers.** A decimal point looks like a full stop to the counter, so "The dose is 2.5 ml a day" counts as two sentences. Words and characters are not affected.
- **Ignoring spaced dashes.** "well — known" is three words here. If a strict word cap matters, close up the dash or use a comma.
- **Cutting at the highlight blindly.** The box shows where the limit falls, not what to delete. Cut the weakest phrase anywhere in the text instead of chopping off the ending.

## Questions people ask

**Do emoji count as characters?** Yes. Most count as one here, but some sites count them as two or more, so leave a few characters spare.

**Why are 238 and 150 words a minute used?** They are averages from research and common practice. Treat the times as a guide.

**Does it work on other languages?** Characters and paragraphs work for any script. Word counts rely on spaces, so for languages written without spaces between words, such as Chinese or Thai, use the character count instead.
