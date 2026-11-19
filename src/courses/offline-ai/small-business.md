---
title: Small business, retail, hotels and logistics
summary: Shops, restaurants, hotels and delivery firms use local AI for customer replies, product text, schedules and paperwork with no monthly per-seat bill. Includes mini project 9, a reply drafter that answers from your own FAQ.
minutes: 25
updated: 2026-11-19
sources:
  - 'Ollama OpenAI-compatible API (official page), https://docs.ollama.com/openai'
  - 'Lessons 10.2 (system prompts), 11.2 (calling a model from Python) and 16.6 (budgets) of this course'
quiz:
  - q: Why give the model your FAQ text instead of letting it answer from memory?
    choices: ['So it answers with your real prices, hours and policies instead of guessing', 'It makes the model bigger', 'It is required by law']
    ans: 0
    why: The model knows nothing about your business; the FAQ is its source (Lesson 12.1).
  - q: Why does the reply drafter only draft, never send?
    choices: ['A person checks every reply before a customer sees it', 'Sending is impossible in Python', 'Drafts are cheaper']
    ans: 0
    why: Mistakes to customers cost trust; a quick human check catches them.
  - q: What is the main money advantage for a small business?
    choices: ['One machine serves all staff with no per-seat plan fees', 'The machine is free', 'There are no electricity costs']
    ans: 0
    why: Per-seat plans grow with staff numbers; one local machine does not (Lesson 16.4).
---

**Module 18 · about 25 minutes · read first: 10.2 and 11.2.** You'll be able to set up AI help for a small business, and you'll build mini project 9.

## 1. Why this sector

Small businesses have the same paperwork as big ones but no IT department and tight budgets. Per-seat AI plans add up fast across a team. One local machine, often a computer the business already has, can serve everyone with no monthly fee and keep customer details private.

## 2. Top uses

- **Retail:** product descriptions, replies to customer messages, sorting reviews into themes.
- **Restaurants and hotels:** answering booking questions, menu and allergen text from your own list, multilingual guest messages, staff rota drafts (check them against labour rules).
- **Logistics:** reading delivery notes and invoices into a spreadsheet, drafting delay notices, summarising driver reports.
- **Everyone:** emails, social posts, simple policies, translating messages.

## 3. Mini project 9: a reply drafter

Save your business's facts in `faq.txt` (hours, prices, delivery, returns, allergens). The script drafts a reply to a customer message using only those facts.

```python
from pathlib import Path
from openai import OpenAI

client = OpenAI(base_url="http://localhost:11434/v1", api_key="local")
FAQ = Path("faq.txt").read_text(encoding="utf-8")

SYSTEM = (
    "You draft replies for a small business. Use only the facts below. "
    "If the answer is not in the facts, say a staff member will reply soon. "
    "Be warm and brief. Reply in the customer's language.\n\nFACTS:\n" + FAQ
)

def draft(message: str) -> str:
    reply = client.chat.completions.create(
        model="gemma4:12b",
        messages=[{"role": "system", "content": SYSTEM}, {"role": "user", "content": message}],
        temperature=0.3,
    )
    return reply.choices[0].message.content

for msg in ["Are you open on Sunday?", "Do you deliver to Hamilton?", "Can I pay with crypto?"]:
    print("CUSTOMER:", msg, "\nDRAFT:", draft(msg), "\n")
```

Test with three questions: one in the FAQ, one partly covered, one not covered. The third should say a person will reply, not invent an answer. If it invents, strengthen the system prompt (Lesson 10.5).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a short FAQ fits in the context window, so no search system is needed.

**Equation:** fits if FAQ tokens + message + reply < context length. A 2-page FAQ is about 1,500 tokens.

**Analogy:** a new staff member with a laminated card of answers at the till.

**Try it:** a 1,500-token FAQ, 200-token message, 300-token reply, 8,192-token context? (2,000 tokens: plenty of room.)
</details>

## 4. Worked scenario

*Made-up hotel.* A 30-room hotel in Niagara Falls gets 60 guest emails a day, many asking the same things. A local 12B model on the front-desk PC drafts replies from the hotel's FAQ in English, French and Hindi. Staff check and send; average handling time falls from 4 minutes to 1. Compared with five per-seat plans, the hotel saves about US$100 a month (before tax and exchange), and guest details stay on the front-desk PC.

## 5. Practice

1. Write five lines of `faq.txt` for a business you know.
2. Run mini project 9 with one question your FAQ does not cover. What happened?
3. Which staff task in your business would save the most time?

<details>
<summary>Answers</summary>

1. For example: "Hours: Mon to Sat 9 to 6, closed Sunday. Delivery: within 20 km, free over CA$50."
2. It should say a person will reply. If it guessed, add "Never guess" to the system prompt and lower the temperature.
3. Your answer; replies to common questions are often the biggest.
</details>

**New words:** *FAQ*, *draft-only*, *per-seat cost*.
