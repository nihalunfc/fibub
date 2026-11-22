---
title: Reading images and screenshots locally
seoTitle: Read images and receipts with a local AI model | Offline AI
summary: Send photos, receipts, charts and screenshots to a local vision model and get descriptions or clean JSON back. Know what vision models read well, what they get wrong, and what an image costs in tokens.
minutes: 25
updated: 2026-11-22
sources:
  - 'ollama Python library, images in chat messages, https://github.com/ollama/ollama-python'
  - 'Gemma 4 model card (multimodal input), https://ai.google.dev/gemma/docs'
  - 'Dosovitskiy et al. (2020), An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale, https://arxiv.org/abs/2010.11929'
quiz:
  - q: How does a vision model "see" an image?
    choices: ['It turns the picture into a set of image tokens that sit in the context with your text', 'It searches the internet for the image', 'It reads the file name']
    ans: 0
    why: An image encoder cuts the picture into patches and turns them into tokens. They take up context space like text does.
  - q: Which job suits a local vision model least?
    choices: ['Describing a photo', 'Reading a receipt total', 'Counting 300 small items in a crowded photo exactly']
    ans: 2
    why: Vision models are good at reading and describing, weak at exact counting and fine measurement.
  - q: Why check numbers that a vision model reads from a receipt?
    choices: ['Models can misread or invent digits, especially on blurry images', 'Receipts are copyrighted', 'JSON cannot hold numbers']
    ans: 0
    why: Like OCR, vision models make mistakes, and unlike OCR they can produce a plausible wrong number. Spot-check totals.
---

**Module 13 · about 25 minutes · read first: 11.3.** You'll be able to send images to a local model and get descriptions or structured data back.

<div class="bigidea">A vision model cuts a picture into small squares and turns them into a few hundred tokens that sit next to your words, so it can read and describe images but loses detail finer than that budget.</div>

## 1. Why this matters

A lot of work information is in pictures: receipts, whiteboard photos, scanned forms, screenshots of error messages, charts in reports. A local vision model reads them without uploading anything. That matters for ID cards, medical images and internal dashboards.

## 2. Which models can see

Gemma 4 models take images as well as text, so the model you installed in Module 9 may already do this. Other families have vision versions too (look for "VL" or "vision" in the name in the Ollama library). Bigger is better for small print and dense documents: E4B reads a clear receipt; 12B and up handle forms and charts far better.

**How the model sees.** A part called the **image encoder** shrinks the picture to a fixed size, cuts it into small squares called **patches**, and turns each patch into numbers the model can read, much like text tokens. Many models then merge neighbouring patches to save room. The numbers below follow one common design (an 896-pixel square, 14-pixel patches, 4 × 4 merging); your model may differ, but the idea is the same.

<div class="steps">
<div class="step"><p><b>The photo.</b> A receipt photo of 3,000 × 4,000 pixels. Far too many to read one by one.</p></div>
<div class="step"><p><b>Resize.</b> The encoder squeezes it to a fixed 896 × 896 square, whatever its original size. Tiny print may already blur here.</p></div>
<div class="step"><p><b>Cut into patches.</b> 896 ÷ 14 = 64 patches across and 64 down: 64 × 64 = 4,096 patches.</p></div>
<div class="step"><p><b>Merge.</b> Each block of 4 × 4 = 16 neighbouring patches becomes one token: 4,096 ÷ 16 = <b>256 image tokens</b>.</p></div>
<div class="step"><p><b>Read with your words.</b> The 256 image tokens go into the context next to your prompt ("Read this receipt..."), and the model answers in text, or in JSON if you ask (section 4).</p></div>
</div>

Try it: lower the bits to 3 or 2, then compare one scale for everything against one per block of 32.

<figure class="fig" data-fig="@ai-quant-grid"><figcaption>Fewer bits means fewer levels, so every weight is rounded more. One outlier stretches a shared scale and crushes the small weights, which is why formats give each small block its own scale.</figcaption></figure>

## 3. Describe an image

```python
import ollama

reply = ollama.chat(model="gemma4:12b", messages=[{
    "role": "user",
    "content": "What does this screenshot show? If it is an error, explain it and suggest a fix.",
    "images": ["error.png"],
}])
print(reply["message"]["content"])
```

The `images` list takes file paths (or raw bytes). In the terminal, `ollama run gemma4:12b` also accepts a path typed in the prompt, and chat apps such as LM Studio and Open WebUI let you drag an image in.

Try it: pick a filter, then step the stage from Convolve to ReLU to Max-pool while the window slides.

<figure class="fig" data-fig="@ai-conv-pool"><figcaption>A filter lights up where its pattern appears. ReLU keeps only the matches, and max-pooling shrinks the map while keeping the strongest responses, so a small shift of the picture barely changes the result.</figcaption></figure>

## 4. Turn receipts into data

Combine vision with a JSON schema (Lesson 11.3):

```python
from pydantic import BaseModel
import ollama

class Receipt(BaseModel):
    shop: str
    date: str
    total: float
    currency: str

reply = ollama.chat(
    model="gemma4:12b",
    messages=[{"role": "user", "content": "Read this receipt and fill in the fields. Date as YYYY-MM-DD.",
               "images": ["receipt.jpg"]}],
    format=Receipt.model_json_schema(),
    options={"temperature": 0},
)
print(Receipt.model_validate_json(reply["message"]["content"]))
```

Loop over a folder of receipt photos and write each to a CSV row, as in Lesson 11.2, and you have a private expense tracker.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** an image becomes a fixed budget of tokens; detail beyond what those tokens can hold is lost.

**Equation:** image tokens ≈ (width ÷ patch size) × (height ÷ patch size) ÷ pooling. Many models resize every image to a fixed grid and spend a few hundred tokens per image, whatever its original size.

**Analogy:** describing a painting to someone over the phone in exactly 250 words. A portrait fits easily; a page of small print does not, so you summarise and details vanish. Where it breaks: some engines tile large images into several pieces, which keeps detail but multiplies tokens and time.

**Try it:** a model spends 256 tokens per image and your context is 8,192 tokens. Leaving 2,000 tokens for text, how many images fit? ((8,192 − 2,000) ÷ 256 ≈ 24.)
</details>

<div class="meaning">

<dl>
<dt>width, height</dt><dd>the size of the picture after the encoder resizes it, in pixels</dd>
<dt>patch size</dt><dd>the side of each small square the picture is cut into (often 14 or 16 pixels)</dd>
<dt>pooling</dt><dd>how many neighbouring patches are merged into one token</dd>
<dt>image tokens</dt><dd>what the picture costs in the context window, just like words do</dd>
<dt>Physical meaning</dt><dd>Describing a painting over the phone in exactly 250 words. A face fits easily; a page of small print does not, so details vanish. That is why a vision model reads a clear receipt well but misses tiny print, and why each image eats into the room left for text.</dd>
</dl>

</div>

<div class="problem" data-problem="local-vision-tokens"></div>

<div class="myth">

**"If the model read a number off the receipt, the number must be there."** Unlike ordinary OCR, which garbles unclear digits, a vision model can write a neat, believable number that is not on the page, especially from a blurry or faded photo. Spot-check totals against another record, such as the bank statement.

</div>

## 5. Worked example

*Made-up numbers.* A small builder photographs 140 supplier receipts a month. The receipt script with Gemma 4 12B on a 16 GB graphics card takes about 6 seconds a receipt, 14 minutes in all. Checking the totals against the bank statement finds 3 misreads (two blurry photos, one faded thermal print), which are fixed by hand. Before, the job took an evening.

## 6. Practice

1. Take a photo of any printed page and ask the model to transcribe it. Compare with OCRmyPDF from Lesson 12.6.
2. Run the receipt script on three receipts. Did any field come back wrong?
3. Screenshot a chart and ask "what is the highest value and when?". Check it yourself.

<details>
<summary>Answers</summary>

1. On clean print, OCR is usually more exact; on photos at an angle or with handwriting, the vision model often does better.
2. Dates in other formats and faded totals are the usual mistakes. Saying "YYYY-MM-DD" in the prompt helps.
3. Models read labels well but can misjudge values between gridlines. Never use a vision model's reading of a chart as data without checking.
</details>

**New words:** *vision model* or *multimodal model* (takes images as well as text), *image tokens* (an image turned into tokens), *image encoder* (the part that turns pixels into tokens), *patch* (one small square of the picture).

<div class="keypoints">

- Gemma 4 and other "vision" or "VL" models take images as well as text; pass file paths in the `images` list.
- The image encoder resizes the picture, cuts it into patches and turns them into a fixed budget of image tokens, often a few hundred.
- Image tokens use context space like text, so many images in one request leave less room for words.
- Combine vision with a JSON schema to turn receipts and forms into clean data.
- Vision models read and describe well but miscount, misjudge chart values and can invent digits: check numbers.

</div>
