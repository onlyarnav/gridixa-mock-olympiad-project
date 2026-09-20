# Tokenization in Practice

In earlier classes, we learned that a **Token** is a small chunk of text, such as a word or part of a word.

However, in a real-world AI system—especially when using platforms like HuggingFace—**tokenization is much more precise and mathematical**.

AI models cannot directly understand human language.

Instead, every piece of text must be translated into **numbers** before the model can process it.

This translation is performed by a special component called the **Tokenizer**.

---

# The Model Vocabulary

Every Large Language Model (LLM) has its own unique **Vocabulary**.

A vocabulary is a **dictionary that maps words or word pieces to specific numbers called Token IDs**.

For example:

| Word | Token ID |
|-----|---------|
| Youth | 4092 |
| debate | 1029 |
| speech | 5501 |

These numbers represent the tokens that the AI model actually processes.

Different models may use **different vocabularies**.

For example:

| Model | Token ID for "Youth" |
|------|---------------------|
| Model A | 4092 |
| Model B | 881 |

Because of this, **each model must use its own tokenizer**.

If the wrong tokenizer is used, the model will interpret the numbers incorrectly and produce **nonsensical output**.

---

# The Tokenization Process

In a HuggingFace pipeline, tokenization happens in three main stages.

---

# 1. Encoding (Text → Numbers)

The **encoding step** converts human language into a sequence of numerical tokens.

For example:

**Input Prompt**
Write a debate speech

After tokenization, the sentence might become:
[892, 44, 1029, 5501]


Each number corresponds to a token stored in the model’s vocabulary.

This numerical sequence is what the AI model processes internally.

---

# 2. Attention Masks

When working with batches of text, sentences may have different lengths.

To keep the data organized, shorter sentences are often padded with empty tokens so that all inputs have the same length.

The tokenizer creates something called an **Attention Mask**.

An attention mask is a sequence of **1s and 0s** that tells the AI which tokens are real words and which tokens are padding.

Example:
Tokens: [892, 44, 1029, 5501, 0, 0]
Attention Mask: [1, 1, 1, 1, 0, 0]


Here:

- **1** indicates a real token
- **0** indicates padding that should be ignored

This helps the model focus only on **meaningful parts of the input**.

---

# 3. Decoding (Numbers → Text)

After the AI model processes the input tokens, it produces **another sequence of numbers** as output.

The tokenizer then performs the reverse process called **decoding**.

Decoding converts the output tokens back into readable text.

Example:
[104, 5501, 329, 88]

might be decoded into a sentence such as:

**"Here is your speech."**

This final text is what appears on the user’s screen.

---

# Analogy: Language Translation

Tokenization works like a **translation system between humans and machines**.

- Humans speak **English or other languages**
- AI models speak **numbers**

The tokenizer acts as the **translator** that converts language back and forth between these two forms.

---

# Key Ideas to Remember

- AI models cannot directly read human language; they process **numbers called tokens**.  
- Every model has its own **vocabulary that maps words to token IDs**.  
- The correct **tokenizer must always match the model** being used.  
- The tokenization process includes:
  - **Encoding** (text → numbers)  
  - **Attention Masks** (marking real tokens vs padding)  
  - **Decoding** (numbers → readable text)  
- Tokenizers act as the **translation bridge between human language and machine computation**.