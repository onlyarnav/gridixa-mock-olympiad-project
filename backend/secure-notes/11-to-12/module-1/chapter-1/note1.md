# Multi-Head Attention (MHA)

When we study **Transformers**, one of the most important mechanisms to understand is **Multi-Head Attention (MHA)**.

To understand this concept, imagine I am your **AI teacher** explaining how a model reads and understands a sentence.

When humans read a sentence, we do not focus on just one thing. At the same time, we notice:

* grammar
* meaning
* relationships between words
* overall context

A Transformer works in a similar way.

In basic attention, the model looks at the sentence once and tries to understand the relationships between words. However, this single view is limited.

To improve this process, Transformers use **Multi-Head Attention**.

Instead of using just **one attention mechanism**, the model uses **multiple attention heads** running in parallel. Each head learns to focus on a **different type of relationship inside the text**.

For example, while reading a sentence:

* One attention head may focus on **grammar relationships**
* Another head may focus on **long-distance context between words**
* Another head may focus on **semantic meaning**

This allows the model to **analyze the same sentence from multiple perspectives at the same time**, making the understanding much richer.

Inside this process, the model stores special vectors called **Keys (K)** and **Values (V)**. These vectors help the model remember and retrieve information when calculating attention.

However, there is a challenge.

Because **every attention head stores its own Keys and Values**, the amount of data that must be stored in memory increases significantly.

This creates two important problems:

* **Higher memory usage**
* **Slower system performance**

As models become larger and the number of attention heads increases, this memory cost becomes a serious engineering challenge.

This is one of the reasons why researchers later invented improved techniques such as **Grouped Query Attention (GQA)** and **Multi-Head Latent Attention (MLA)** to make Transformers more efficient.

**Key Idea**

Multi-Head Attention allows Transformers to analyze text using **multiple parallel attention heads**, where each head focuses on different relationships in the sentence. While this improves understanding, it also increases memory usage because each head must store its own **Keys and Values**.
