# The Big Problem with LLMs: Hallucinations and Outdated Knowledge

As your AI teacher, let us begin this chapter with an important truth about modern language models. Despite their impressive abilities, **Large Language Models are not knowledge databases**. They are powerful pattern-recognition systems trained to predict the most likely next word in a sequence.

During training, an LLM reads enormous datasets of text and learns statistical relationships between words, phrases, and concepts. However, once training is complete, the model does not automatically update itself with new information.

Because of this design, two major problems appear.

---

### Hallucinations

One of the most famous limitations of LLMs is called **hallucination**.

In the context of AI, hallucination does not mean seeing imaginary objects. Instead, it refers to a model generating **incorrect or fabricated information while sounding completely confident**.

For example, if asked about a research paper that does not exist, the model might invent the title, authors, and conclusions. This happens because the model tries to generate text that *sounds plausible* based on patterns in its training data, even if the information is not real.

This limitation arises from the fundamental goal of language models: predicting the next token that has the highest probability of appearing in a sentence.

---

### Outdated Knowledge

Another major issue is that LLM knowledge becomes **frozen in time**.

When a model finishes training, it only knows information that existed in its dataset up to the training cutoff date. Any events, research discoveries, or policy changes that occur afterward are unknown to the model.

For example, if a model was trained on internet data up to 2023, it cannot automatically know about new scientific discoveries or updated regulations from 2025.

Without additional systems, the model cannot reliably answer questions that require **recent information or private organizational data**.

---

### Why This Is a Serious Problem

These two limitations make raw language models risky for real-world applications.

A company might want an AI assistant that answers questions using its internal documents. A hospital might want an AI system that references the latest medical guidelines. A conference like TYT MUN might want a chatbot that explains the **exact rules and schedules for the current event**.

If the model relies only on its training data, it may generate incorrect answers or outdated information.

This is where modern AI engineering introduces a powerful solution called **Retrieval-Augmented Generation**, commonly known as **RAG**.

---

### The Key Idea

Large Language Models generate responses based on patterns learned during training, which can lead to hallucinations and outdated knowledge. To make AI systems reliable for real-world applications, engineers must connect language models to external sources of verified information. This challenge led to the development of Retrieval-Augmented Generation systems and vector databases, which we will explore next.
