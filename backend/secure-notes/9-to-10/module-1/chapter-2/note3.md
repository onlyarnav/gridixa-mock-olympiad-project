# RNN (Recurrent Neural Networks) — The AI with a Memory

In the previous topic, we learned how **CNNs help AI understand images**.

However, CNNs are not suitable for tasks where **information comes in a sequence**.

Examples of sequential data include:

- Sentences in a paragraph  
- Speech and audio  
- Videos  
- Time-based data like weather or stock prices  

In these cases, the **order of information matters**.

Understanding the current input often depends on **remembering what came earlier**.

---

# Why Standard Neural Networks Struggle with Sequences

A standard neural network processes input values **independently**.

Once it processes one input, it moves to the next and **does not remember the previous one**.

This means the network behaves as if it has **no memory**.

For language or speech tasks, this becomes a big problem.

---

# Analogy: Understanding a Sentence

Consider the sentence:

**"I ate an apple because it was sweet."**

To understand what **"it"** refers to, you must remember the earlier word **"apple."**

If your brain forgot the earlier words, the sentence would make no sense.

Standard neural networks behave this way—they forget earlier information as soon as new input arrives.

---

# The Solution: Recurrent Neural Networks (RNNs)

To solve this problem, scientists developed **Recurrent Neural Networks (RNNs).**

RNNs are designed to **remember previous information while processing new data**.

They do this using a special **loop structure inside the network**.

This loop allows the network to **pass information from one step to the next**.

Because of this structure, the network can keep track of what happened earlier in the sequence.

---

# How RNN Memory Works

When an RNN processes a sequence:

1. It receives the **current input**.
2. It also receives **information from the previous step**.
3. It combines both pieces of information to produce a new output.
4. The updated memory is passed forward to the next step.

This means each new decision is based on:

- The **current input**
- The **memory of previous inputs**

---

# Analogy: Reading a Story

Imagine reading a **mystery story**.

Each page gives new information, but you must remember the **earlier clues** to understand the full plot.

Your brain continuously **connects past information with new details**.

An RNN works in a similar way.

It keeps track of previous inputs so that it can understand the **context of the sequence**.

---

# Where RNNs Are Used

Because they can remember previous information, RNNs are useful for many sequence-based tasks such as:

- Language translation  
- Speech recognition  
- Text prediction  
- Chatbots  
- Video analysis  

These systems rely on understanding **context and order**.

---

# Key Ideas to Remember

- Many types of data arrive in a **sequence where order matters**.
- Standard neural networks **cannot remember previous inputs**.
- **RNNs (Recurrent Neural Networks)** are designed to handle sequential data.
- RNNs include a **loop structure that carries memory forward**.
- This allows the network to combine **past information with new inputs**.
- RNNs are widely used in **language processing, speech recognition, and text prediction**.