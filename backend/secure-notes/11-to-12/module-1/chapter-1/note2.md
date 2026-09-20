# Grouped-Query Attention (GQA)

As your AI teacher, let’s continue exploring how engineers make **Transformer models more efficient**.

In **Multi-Head Attention (MHA)**, every attention head stores its own **Keys (K)** and **Values (V)**. While this allows the model to analyze text from many perspectives, it also creates a problem: **large memory usage**.

When models become very large and process long pieces of text, storing separate Keys and Values for every head can slow down the system and require a lot of computational resources.

To solve this problem, researchers developed a technique called **Grouped-Query Attention (GQA)**.

In **GQA**, multiple **Query heads** are allowed to **share the same Keys and Values** instead of each head storing its own copy.

You can think of this as several students in a classroom asking different questions while referring to the **same textbook**. The students may ask different questions, but the information they consult comes from the **same shared source**.

In the same way, Query heads in GQA may search for different relationships in the text, but they all use a **shared set of Keys and Values**.

This design significantly **reduces the amount of memory required** while still allowing the model to maintain strong performance.

Because of this balance between **efficiency and performance**, GQA is especially useful when models need to process **very large inputs or long documents**.

**Key Idea**

Grouped-Query Attention improves efficiency by allowing **multiple Query heads to share the same Keys and Values**, which reduces memory usage while still preserving strong model performance.
