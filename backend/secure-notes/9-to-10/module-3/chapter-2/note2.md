# Supervised Fine-Tuning (SFT)

The **most common method** used to train an AI to follow a new behavior is called **Supervised Fine-Tuning (SFT)**.

In **SFT**, humans guide the AI by showing it **examples of perfect answers**.

Think of it like a **teacher correcting a student's work** until the student learns the right way to answer.

---

## 1. How Supervised Fine-Tuning Works

To perform **SFT**, engineers create a **high-quality dataset** made of **Input/Output pairs**.

This means:

* The **Input** is the question or prompt given to the AI.
* The **Output** is the **ideal answer** that the AI should produce.

You act as the **supervisor**, showing the AI exactly what a **perfect response** looks like.

Example:

**Input (Prompt):**

> "Write a reminder for the MUN conference."

**Output (Perfect Answer):**

> "Hey delegates! 🚨 Quick reminder that the opening ceremony kicks off at 9 AM tomorrow. Don't forget your placards! See you there 🌍✨"

By learning from such examples, the AI understands:

* The **tone**
* The **style**
* The **structure of the response**

---

## 2. Training the AI with Many Examples

For SFT to work well, the AI must see **many examples**.

Example:

* 10 examples → Not enough learning
* 100 examples → Better learning
* **1,000+ examples → Strong learning**

After seeing many examples, the AI starts to **copy the same pattern when answering new prompts**.

---

## 3. What Happens Inside the AI

Inside every AI model are millions or billions of small mathematical settings called **parameters**.

These parameters include:

* **Weights**
* **Biases**

During **Supervised Fine-Tuning**, the AI **slightly adjusts these parameters**.

You can imagine them like **tiny control knobs** inside the AI's brain.

When these knobs change, the AI slowly **adopts the new behavior or personality permanently**.

---

## 4. Simple Analogy

Think of **Supervised Fine-Tuning** like **training a student using solved examples**.

* The teacher gives a **question**.
* Then shows the **correct answer**.
* After seeing many examples, the student **learns the correct pattern**.

AI learns in **exactly the same way during SFT**.

---

✅ **Key Idea:**

* **Supervised Fine-Tuning (SFT)** trains AI using **Input/Output example pairs**.
* By seeing **many perfect examples**, the AI adjusts its **parameters** and learns a **new behavior or style**.
