# Inside the Vector Database: Cosine Similarity

As your AI teacher, let us now step inside the **core search engine of a RAG system**, known as the **vector database**.

In the previous section, we learned that an embedding model converts pieces of text into **vectors**, which are numerical representations of meaning. Once these embeddings are created, they must be stored somewhere so that the system can search them quickly when a user asks a question.

This is the job of a **vector database**.

A vector database stores millions or even billions of embeddings and allows the system to **quickly find which pieces of text are most similar to a user’s query**.

---

### How the Search Process Works

When a user asks a question, the system first converts that question into an embedding vector using the same embedding model used during data preparation.

This query vector now represents the **meaning of the user's question** in mathematical form.

The vector database then compares the query vector with all stored vectors that represent document chunks. The goal is to determine which stored vectors point in the **most similar direction in the vector space**.

To perform this comparison, engineers use a mathematical measurement called **cosine similarity**.

---

### The Idea Behind Cosine Similarity

Cosine similarity measures the **angle between two vectors**.

If two vectors point in almost the same direction, the angle between them is small, and their cosine similarity score is high. This indicates that the meanings of the two pieces of text are closely related.

If the vectors point in completely different directions, the angle between them is large, and the similarity score becomes low. This indicates that the meanings are unrelated.

The mathematical definition of cosine similarity is shown below.

\cos(\theta)=\frac{A\cdot B}{|A||B|}

In this equation, the vectors (A) and (B) represent two embeddings, the numerator represents the dot product between them, and the denominator normalizes the vectors by their lengths.

The result is a value between **−1 and 1**, where higher values indicate stronger similarity.

---

### Finding the Most Relevant Chunks

Using cosine similarity, the vector database calculates similarity scores between the query embedding and every stored embedding.

The system then selects the **top few chunks with the highest similarity scores**.

These chunks are considered the most relevant pieces of information for answering the user’s question.

They are then passed to the language model as context so that the final answer can be generated using real information rather than guesses.

---

### Why Vector Databases Are Important

Vector databases are specifically designed for **high-speed similarity search across massive datasets**.

Unlike traditional databases that search through text directly, vector databases operate on embeddings and mathematical relationships. This allows them to find semantically related information even if the wording is different.

Because of this capability, vector databases have become a **critical infrastructure component for modern AI systems**, especially those built using Retrieval-Augmented Generation.

---

### The Key Idea

A vector database stores embeddings representing document chunks and uses cosine similarity to compare them with a query embedding. By measuring the angle between vectors, the system can identify which pieces of information are most semantically similar to the user’s question and retrieve them for the language model to use when generating a response.
