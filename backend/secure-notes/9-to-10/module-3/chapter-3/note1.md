# The “Black Box” Problem: Launching Your AI

Imagine you spent weeks building a **custom RAG chatbot** for the **The Youth Talks** **MUN conference**.

You carefully completed all the technical steps:

* **Chunked the PDFs**
* Stored them in a **Vector Database**
* Built the pipeline using **Hugging Face** tools

Finally, you launch your chatbot, and **hundreds of students start using it**.

But then you realize a **serious problem**:

> You have no idea what the AI is actually saying to users.

---

## 1. The “Black Box” Problem

Large Language Models (LLMs) are often called **“Black Boxes.”**

A **Black Box** is a system where:

* You know the **input** (the prompt)
* You see the **output** (the response)
* But you **cannot clearly see how the AI made the decision inside**

This happens because LLMs generate responses using **billions of internal parameters**.

Every time a user asks a question, the AI **creates new text dynamically**, which means:

* The answer can **change every time**
* Developers **cannot perfectly predict the response**

---

## 2. Why This is Dangerous

Without monitoring the AI, several problems can happen.

### Prompt Injection Attacks

A user might try to **trick the AI** into doing something wrong.

Example:

* Trying to make the AI **swear**
* Trying to **break safety rules**

This is called a **Prompt Injection attack**.

---

### Hallucinations

Sometimes AI may **generate false information** even if it sounds convincing.

Example:

* The AI might **invent fake debate rules**
* Or give **incorrect information about the conference**

These mistakes are called **AI hallucinations**.

---

## 3. The Solution: Observability 👀

To solve this problem, developers use **LLM Observability**.

**Observability** means **monitoring and tracking what the AI is doing** after it is launched.

It helps developers:

* See **what users are asking**
* See **what the AI is replying**
* Detect **errors, hallucinations, or unsafe answers**
* Fix problems **quickly**

---

✅ **Key Idea:**
Large Language Models behave like **Black Boxes**, meaning their responses cannot always be predicted.
**Observability tools help developers monitor the AI’s behavior and quickly detect problems such as hallucinations or prompt injection attacks.**
