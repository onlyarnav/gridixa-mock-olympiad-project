# Knowledge Graphs: The Relational Web

As your AI teacher, let us now explore one of the most powerful ideas used to overcome the limitations of standard RAG systems.

Earlier, we saw that traditional RAG treats documents as **separate chunks of text** stored in a vector database. While this works well for many questions, it does not always capture the **relationships between different pieces of information**.

To solve this, engineers often combine retrieval systems with **knowledge graphs**.

A knowledge graph represents information as a **connected network**, where concepts are linked together through meaningful relationships.

Instead of treating knowledge as isolated paragraphs, the system organizes it as a **web of interconnected ideas**.

---

### Nodes: Representing Entities

In a knowledge graph, the basic units of information are called **nodes**.

Each node represents an **entity**, which could be a person, location, object, or abstract concept.

For example, in a knowledge graph related to international diplomacy, nodes might represent entities such as a country, a diplomatic organization, or a policy agreement.

These nodes act like **points on a map of knowledge**.

---

### Edges: Representing Relationships

Nodes alone do not create understanding. What makes a knowledge graph powerful is the **connections between nodes**, known as **edges**.

Edges represent the **relationships between entities**.

For example, a node representing a country might be connected to another node representing a treaty through a relationship such as “signed.” A node representing a delegate might connect to a committee through a relationship such as “represents.”

Through these relationships, the system can understand **how pieces of knowledge interact with one another**.

---

### Why Knowledge Graphs Improve Reasoning

Traditional text retrieval focuses on finding documents that are similar to a query.

Knowledge graphs go further by enabling the system to **trace relationships between concepts**.

For example, suppose a user asks a question about how a specific international agreement influences diplomatic negotiations. The answer may require combining information about the agreement, the participating countries, and the historical context.

A knowledge graph allows the AI system to **navigate through these relationships**, following connections between nodes to gather the relevant information.

This approach helps the AI build a more **structured understanding of knowledge**, rather than relying only on text similarity.

---

### Combining Knowledge Graphs with RAG

Modern AI systems increasingly combine **vector databases and knowledge graphs**.

Vector databases are excellent at quickly retrieving text with similar meaning, while knowledge graphs are powerful for representing **relationships between entities**.

By combining both approaches, engineers create systems that can both **retrieve relevant information and understand how that information is connected**.

---

### The Key Idea

Knowledge graphs represent information as a network of entities and relationships. Nodes represent concepts or objects, while edges describe how they are connected. This relational structure allows AI systems to reason across multiple pieces of information, improving context understanding and enabling deeper insights than standard text retrieval alone.
