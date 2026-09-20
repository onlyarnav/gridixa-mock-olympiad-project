# RNN (Recurrent Neural Networks) — The “Memory” of AI

Hello again.
I am **AIVA (Artificial Intelligence Virtual Assistant)**, continuing our study of how different neural networks evolved to handle different types of information.

In the previous topic, we learned about **Convolutional Neural Networks (CNNs)**, which specialize in analyzing images and visual patterns.

However, not all data is visual. Some types of information occur in **a specific order over time**. To handle such ordered data, scientists created another special type of neural network called the **Recurrent Neural Network**, or **RNN**.

---

# What Is a Recurrent Neural Network (RNN)?

A **Recurrent Neural Network (RNN)** is a type of neural network designed to process **sequential data**.

While CNNs analyze images that remain fixed, RNNs analyze **information that changes over time or follows a sequence**.

Because RNNs remember information from earlier steps in the sequence, they are often described as the **“memory” of Artificial Intelligence**.

---

# Understanding Sequences

A **sequence** is a set of data points arranged in a specific order.

If the order of a sequence changes, the meaning of the data may also change.

Examples of sequences include:

* Daily temperature changes over a week
* The rise and fall of cultural trends over a month
* Words in a sentence
* Musical notes in a song

In all these cases, the **order of information matters**.

For example, consider the two sentences below:

* "AI will change the world."
* "World the change will AI."

Both contain the same words, but the second sentence loses meaning because the **sequence is incorrect**.

RNNs help computers understand such ordered information.

---

# How RNNs Remember Information

A key feature of RNNs is their **looping structure**.

Unlike traditional neural networks that process information only once, RNNs can **pass information from one step to the next**.

This means the network remembers what happened **just moments earlier**.

The process can be summarized as:

```id="rnn1"
Previous Information → Current Input → Updated Memory → Next Prediction
```

By using this looping memory system, the network can analyze patterns that unfold over time.

---

# Example: Predictive Text on Smartphones

A common example of RNN technology is **predictive text** on smartphone keyboards.

When you type a sentence, the keyboard often suggests the next word.

To do this, the AI system analyzes the sequence of words you have already typed.

For example, if you type:

> "I am going to the..."

The AI might predict the next word as **school**, **store**, or **park**.

The system remembers the earlier words in the sentence and uses that information to **predict what comes next**.

This prediction ability relies on the sequence-learning capability of **Recurrent Neural Networks**.

---

# The Major Limitation of RNNs

Although RNNs were an important breakthrough, they had a significant weakness.

They struggled with **long sequences of information**.

For short sequences, the system works well. However, when the sequence becomes very long, the network begins to **forget earlier information**.

For example, imagine giving an RNN a **10-page essay** to analyze.

By the time the network reaches the final page, it may have already **forgotten the important ideas from the first paragraph**.

This limitation is often described as **poor long-term memory**.

Because of this challenge, scientists began searching for better solutions to process long sequences of information.

---

# Why RNNs Were Still Important

Despite their limitations, RNNs played a major role in the development of modern AI systems.

They were widely used for tasks involving sequences, such as:

* Text prediction
* Language translation
* Speech recognition
* Time-series forecasting

RNNs demonstrated that machines could **remember past information and use it to make future predictions**.

This concept became a foundation for more advanced AI architectures.

---

# Think Like an AI Engineer

Consider the following situation.

An AI system analyzes the sequence of words in a sentence and predicts the next word while you are typing a message.

Which type of neural network is most suitable for this task?

A) Convolutional Neural Network (CNN)
B) Recurrent Neural Network (RNN)
C) Image Processing Network

Correct answer: **B**

RNNs are designed to analyze **sequences of information**, such as words in a sentence.

---

# Key Points to Remember

**RNN (Recurrent Neural Network)**

* Designed to process **sequential data**.

**Special Feature**

* Contains a **looping structure** that allows the network to remember previous information.

**Examples of Sequences**

* Words in sentences
* Temperature changes over time
* Trends or patterns that evolve gradually

**Limitation**

* RNNs struggle to remember information from **very long sequences**.
