# The Transformer Architecture — Encoders & Decoders

In the previous topics, we learned how **Self-Attention** allows Transformers to understand relationships between words in a sentence.

Now let’s look at the **complete Transformer architecture**.

A Transformer is usually divided into **two major components**:

- **Encoder**
- **Decoder**

You can think of them as two different roles working together.

---

# The Encoder: The Reader

The **Encoder** is responsible for **reading and understanding the input text**.

When you type a sentence or prompt, the encoder processes it and builds a detailed mathematical representation of the meaning.

The encoder performs several important tasks:

- Reads all the words in the input
- Uses **Self-Attention (Q, K, V)** to find relationships between words
- Understands context and meaning
- Converts the text into a structured **map of numbers**

This map is sometimes called an **embedding representation**, which stores the meaning of the sentence in numerical form.

---

# Analogy: A Research Analyst

Imagine a **research analyst preparing a report for a debate**.

Their job is to carefully read all the documents and organize the information into clear notes.

The encoder works similarly.

It **reads the input text carefully** and transforms it into a structured set of information that the next stage can use.

---

# The Decoder: The Writer

The **Decoder** is responsible for **generating the output**.

It takes the encoded information and begins **predicting the response one token at a time**.

While generating text, the decoder uses two types of attention:

1. **Self-Attention on the generated words**  
   This helps the model remember what it has already written.

2. **Attention to the Encoder output**  
   This allows the model to reference the meaning of the original input.

This ensures that the response stays **relevant, grammatically correct, and logically consistent**.

---

# Analogy: A Skilled Writer

Imagine a **writer who is preparing an article based on research notes**.

The writer:

- Looks at the organized notes prepared by the analyst
- Writes the article step by step
- Continuously checks what has already been written to maintain flow and grammar

The decoder behaves in a similar way.

It uses the **encoded knowledge** and generates a **coherent response word by word**.

---

# How Encoders and Decoders Work Together

The process follows a clear flow:

1. **User Input** → The text prompt enters the model.
2. **Encoder Stage** → The input is analyzed using self-attention and converted into a numerical representation.
3. **Decoder Stage** → The decoder uses this representation to generate the output token by token.
4. **Final Response** → The completed sentence or answer is produced.

---

# Where Transformers Are Used

The Encoder–Decoder structure is widely used in tasks such as:

- Language translation
- Text summarization
- Question answering
- Chatbots
- Speech recognition

Some modern models may use **only the encoder or only the decoder**, depending on the task.

---

# Key Ideas to Remember

- The Transformer architecture has two main parts: **Encoder and Decoder**.
- The **Encoder reads and understands the input text**.
- It uses **Self-Attention** to capture relationships between words.
- The **Decoder generates the response one token at a time**.
- The decoder also uses attention to keep track of both the **input context and previously generated words**.
- Together, the encoder and decoder allow Transformers to **understand language and produce meaningful responses**.