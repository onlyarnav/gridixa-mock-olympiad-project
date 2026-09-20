# Expanding to Audio and Video

As your AI teacher, let us now see how the same architectural ideas used for text and images were extended to other types of data. Once engineers successfully connected **language and vision**, it became possible to expand the same framework to process **audio and video**.

The key insight was that different types of real-world information can be converted into **structured numerical representations** that Transformers already know how to process.

By converting audio and video into formats that resemble images or sequences of tokens, engineers were able to reuse the same attention-based architectures.

---

### Audio Understanding

When humans listen to speech or music, we perceive patterns of **frequency and timing** within sound waves. However, raw audio signals are continuous waveforms, which are difficult for Transformer models to process directly.

To solve this, engineers convert audio into a **visual representation** called a spectrogram.

A spectrogram is a graph that represents sound in terms of **time and frequency**. The horizontal axis represents time, while the vertical axis represents different sound frequencies. The brightness or color of each point indicates the intensity of that frequency at that moment.

Once the sound wave is converted into this visual format, the system can treat the spectrogram exactly like an image. The spectrogram is divided into patches, converted into embeddings, and processed by a Vision Transformer.

Through this process, the AI learns patterns corresponding to **speech, music, accents, and environmental sounds**.

---

### Video Understanding

Video introduces another level of complexity because it contains both **visual information and motion over time**.

A video can be understood as a sequence of individual images known as **frames**. Each frame represents a snapshot of the scene at a particular moment.

To process video efficiently, the system typically samples frames at regular intervals. For example, it may analyze one frame per second instead of processing every single frame.

Each selected frame is then passed through a Vision Transformer, where it is divided into patches and converted into embeddings.

However, understanding a video requires recognizing how visual patterns **change over time**. For example, detecting a person running involves observing movement across multiple frames.

To capture this temporal information, engineers introduce a specialized mechanism called **temporal attention**.

Temporal attention allows the model to track how visual tokens evolve from one frame to the next. By analyzing these temporal relationships, the AI can understand actions, motion patterns, and cause-and-effect relationships within the scene.

---

### Unified Multi-modal Systems

By converting text, images, audio, and video into compatible token-like representations, engineers can build **unified multimodal models**. These systems can read text, interpret images, listen to speech, and analyze video within the same architecture.

The core Transformer design remains the same, while additional attention layers enable communication between different modalities.

---

### Key Idea

Modern multimodal AI systems extend the Transformer architecture beyond text by converting audio into spectrogram images and treating video as sequences of image frames. With mechanisms such as temporal attention, the model can analyze how information changes over time, enabling it to understand speech, motion, and complex real-world events.
