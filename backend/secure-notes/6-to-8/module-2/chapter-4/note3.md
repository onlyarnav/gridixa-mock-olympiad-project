# The Context Window (The AI’s Short-Term Memory)

Hello again.
I am **AIVA (Artificial Intelligence Virtual Assistant)**. In the previous lesson, we learned that AI reads text using **tokens** instead of full words.

Now we will learn about something equally important: **how much information an AI can remember at once**.

This concept is called the **Context Window**.

---

# What is a Context Window?

Every **Large Language Model (LLM)** has a limit to how much information it can keep in its **working memory** during a conversation or task.

This limit is called the **Context Window**.

The context window tells us **how many tokens the AI can process and remember at the same time**.

Remember:

* AI reads text in **tokens**
* The **context window is measured in tokens**

---

# Think of it Like Short-Term Memory

The context window works like a person’s **short-term memory**.

When you are reading a long paragraph, you remember the sentences you just read. But if the text is extremely long, it becomes harder to remember everything from the beginning.

LLMs behave in a similar way.

They can only hold a **limited amount of information in their active memory at once**.

---

# Example: Summarizing a Large Report

Imagine you are asking an AI to summarize a **200-page report about Gen Z education trends**.

Suppose the AI has a **context window of 3,000 tokens**, which is roughly **4–5 pages of text**.

This means:

* The AI can only read **about 4–5 pages at one time**.
* If you paste the entire report into the prompt, the model **cannot process all of it simultaneously**.

As the AI reads new text, the **earliest parts of the text may drop out of memory**.

In simple terms:

> By the time the AI reaches the end of the document, it may have **forgotten the beginning**.

---

# Why Context Window Size Matters

A **larger context window** allows an AI to handle much bigger tasks.

For example, with a larger context window an AI could:

* Analyze **entire books**
* Read **long research papers**
* Understand **large codebases**
* Summarize **long conversations**
* Analyze **video transcripts**

Because of this, technology companies constantly try to **increase the context window size** when they build new AI models.

---

# Context Windows in Modern AI

Modern systems such as:

* ChatGPT
* Gemini

have been designed with **larger and larger context windows**, allowing them to handle longer conversations and larger documents than earlier AI systems.

Increasing the context window is one of the **major improvements in modern LLM development**.

---

# A Simple Analogy

Imagine trying to read a long story through a **small window**.

You can only see **a few lines at a time**.

To read the whole story, you must keep **moving the window forward**.

The **bigger the window**, the more of the story you can see at once.

This is exactly how the **context window works in AI models**.

---

# Think Like an AI Engineer

Suppose an AI model has a **context window of 2,000 tokens**.

You provide a document that contains **10,000 tokens**.

What will happen?

A) The AI will read the entire document at once
B) The AI may forget earlier parts while processing later parts
C) The AI will refuse to process the document

Correct answer: **B**

If the text is larger than the context window, the AI may **lose earlier information while reading new tokens**.

---

# Key Points to Remember

**Context Window**

The maximum amount of text an AI can process and remember at one time.

**Measured in Tokens**

Because LLMs read tokens instead of words.

**Short-Term Memory**

It works like the AI’s **working memory** during a task or conversation.

**Why It Matters**

Larger context windows allow AI systems to analyze **longer documents and conversations**.
