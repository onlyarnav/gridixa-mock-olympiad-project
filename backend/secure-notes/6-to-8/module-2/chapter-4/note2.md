# How AI Reads — Tokens

Hello again.
I am **AIVA (Artificial Intelligence Virtual Assistant)**. In the previous topic, we learned that **Large Language Models (LLMs)** are trained on massive amounts of text and are able to understand and generate human language.

But there is an interesting difference between **how humans read** and **how AI reads**.

Humans read **words**, but AI reads **tokens**.

---

# What is a Token?

A **token** is a small piece of text that an AI uses to process language.

Instead of reading full words, the AI breaks text into **smaller chunks** called tokens.

A helpful rule of thumb is:

**1 token ≈ about 4 characters in English**

This means a word might be:

* **One token**
* **Multiple tokens**
* **Or sometimes part of a token**

---

# Simple Examples

Let’s look at a few examples.

**Short word**

Cat → **1 token**

Because the word is short, the AI reads it as one unit.

**Longer word**

Hamburger → might be broken into **3 tokens**

Example:

* Ham
* bur
* ger

Each part is processed separately by the AI.

---

# How a Sentence is Tokenized

Consider the sentence:

> “The cat jumped.”

The AI might split it into tokens like:

* The
* cat
* jump
* ed
* .

Even punctuation marks like **periods and commas** can become tokens.

---

# Why AI Uses Tokens Instead of Words

Human language changes constantly.

New words, slang, and brand names appear all the time.

If an AI only learned whole words, it would need to constantly update its dictionary.

Tokens solve this problem.

By breaking words into **smaller reusable pieces**, the AI can understand:

* Prefixes (un-, re-, pre-)
* Suffixes (-ing, -ed, -ly)
* New slang words
* Unfamiliar names or brands

Even if the AI has never seen a word before, it can still understand its parts.

---

# A Helpful Analogy

Imagine a **graphic designer creating a large poster**.

At first glance, the poster looks like one big image.

But when you zoom in, you see that it is actually made of **thousands of tiny pixels**.

Each pixel contributes to the final picture.

Language works the same way for AI.

Instead of seeing a sentence as one large block of text, the AI sees it as **many small tokens** that together create meaning.

---

# Tokens in Modern AI Systems

Large language models like:

* ChatGPT
* Gemini

process text entirely through tokens.

Every prompt you type and every response the AI generates is actually handled as a sequence of tokens inside the model.

This is why AI systems sometimes talk about **token limits**, which means the maximum number of tokens they can process at once.

---

# Think Like an AI Engineer

Suppose an AI encounters the new word:

> “Cybersecurity”

Even if the AI has never seen this word before, it might split it into tokens like:

* cyber
* secur
* ity

Because it understands these smaller parts, the AI can still understand the overall meaning.

Which concept allows the AI to do this?

A) Pixels
B) Tokens
C) Parameters

Correct answer: **B**

Tokens allow the AI to break words into smaller pieces so it can understand language more flexibly.

---

# Key Points to Remember

**Tokens**

Small pieces of text that AI models use to process language.

**Approximate Size**

1 token is roughly **4 characters in English**.

**Why Tokens Exist**

They help AI handle new words, prefixes, suffixes, and changing language.

**How AI Reads**

AI processes sentences as **sequences of tokens**, not full words.
