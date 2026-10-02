/* ─────────────────────────────────────────
   PORTFOLIO DATA – Single source of truth
   ───────────────────────────────────────── */

// ── Projects ──────────────────────────────

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  image: string;
  description: string;
  longDescription: string;
  technologies: string[];
  metrics: { label: string; value: string }[];
  challenges: string[];
  role: string;
  duration: string;
  link?: string;
  github?: string;
}

export const projects: Project[] = [
  {
    id: "aether-ai",
    title: "Aether AI",
    subtitle: "Intelligent Analytics Platform",
    category: "Machine Learning",
    year: "2026",
    image: "/images/project-ai-dashboard.jpg",
    description:
      "An enterprise-grade AI analytics platform that processes terabytes of streaming data in real-time, delivering predictive insights through an elegant neural network visualization interface.",
    longDescription:
      "Aether AI represents the culmination of two years of research into real-time predictive analytics. The platform ingests streaming data from multiple sources, runs it through a proprietary ensemble of transformer models, and delivers actionable insights through an intuitive dashboard. The neural network architecture visualization allows engineers to debug model behavior in real-time, while the anomaly detection system catches edge cases before they impact production systems. Built to handle enterprise-scale workloads, the system processes over 4.2TB of data per second with sub-12ms latency.",
    technologies: [
      "Python",
      "PyTorch",
      "Apache Kafka",
      "React",
      "D3.js",
      "Kubernetes",
      "PostgreSQL",
      "Redis",
    ],
    metrics: [
      { label: "Accuracy", value: "89.4%" },
      { label: "Latency", value: "12ms" },
      { label: "Data Processed", value: "4.2TB/s" },
      { label: "Active Users", value: "2,400+" },
    ],
    challenges: [
      "Designing a real-time neural network visualization that remained performant at scale",
      "Optimizing transformer inference to achieve sub-15ms latency on streaming data",
      "Building a fault-tolerant data pipeline that handles 4TB/s without data loss",
    ],
    role: "Lead ML Engineer & Architect",
    duration: "14 months",
    link: "https://aether-ai.demo",
    github: "https://github.com/arjun-mehta/aether-ai",
  },
  {
    id: "lexicon-nlp",
    title: "Lexicon NLP",
    subtitle: "Natural Language Understanding Engine",
    category: "NLP / AI",
    year: "2025",
    image: "/images/project-nlp-platform.jpg",
    description:
      "A state-of-the-art NLP platform providing sentiment analysis, entity extraction, and contextual understanding for enterprise document workflows.",
    longDescription:
      "Lexicon NLP was born from the need to understand unstructured text at massive scale. The platform combines fine-tuned large language models with custom entity recognition pipelines to extract structured insights from any document type. The sentiment analysis module achieves 94% accuracy across 12 languages, while the entity extraction system can identify domain-specific entities with minimal training data. The platform now processes over 2 million documents daily for Fortune 500 clients.",
    technologies: [
      "Python",
      "Hugging Face Transformers",
      "spaCy",
      "FastAPI",
      "Next.js",
      "ElasticSearch",
      "Docker",
      "AWS",
    ],
    metrics: [
      { label: "Accuracy", value: "94%" },
      { label: "Languages", value: "12" },
      { label: "Docs/Day", value: "2M+" },
      { label: "Enterprise Clients", value: "18" },
    ],
    challenges: [
      "Training multilingual models that maintain accuracy across 12 languages",
      "Building a zero-shot entity extraction system for domain-specific use cases",
      "Scaling the inference pipeline to handle 2M+ documents per day",
    ],
    role: "Senior AI Engineer",
    duration: "10 months",
    github: "https://github.com/arjun-mehta/lexicon-nlp",
  },
  {
    id: "sentinel-vision",
    title: "Sentinel Vision",
    subtitle: "Computer Vision Detection System",
    category: "Computer Vision",
    year: "2025",
    image: "/images/project-computer-vision.jpg",
    description:
      "Real-time multi-camera object detection and segmentation platform processing 60 FPS across distributed camera networks for urban traffic and retail analytics.",
    longDescription:
      "Sentinel Vision pushes the boundaries of real-time computer vision at scale. Using a custom ResNet-101 backbone with feature pyramid networks, the system achieves 92% mAP on complex urban scenes while maintaining 60 FPS across multiple camera feeds. The platform supports both cloud and edge deployment, with optimized TensorRT models running on NVIDIA Jetson devices for low-latency inference. Currently deployed across 340+ locations for smart city and retail applications.",
    technologies: [
      "Python",
      "PyTorch",
      "TensorRT",
      "OpenCV",
      "CUDA",
      "React",
      "gRPC",
      "NVIDIA Jetson",
    ],
    metrics: [
      { label: "mAP Score", value: "92.1%" },
      { label: "FPS", value: "60" },
      { label: "Cameras", value: "340+" },
      { label: "Object Classes", value: "48" },
    ],
    challenges: [
      "Achieving real-time inference at 60 FPS on edge devices",
      "Building a scalable multi-camera synchronization system",
      "Handling extreme lighting variations in outdoor urban environments",
    ],
    role: "Computer Vision Lead",
    duration: "12 months",
    link: "https://sentinel-vision.demo",
  },
  {
    id: "chainscope",
    title: "ChainScope",
    subtitle: "Blockchain Intelligence Platform",
    category: "Web3 / Data",
    year: "2024",
    image: "/images/project-blockchain.jpg",
    description:
      "An on-chain analytics platform providing real-time wallet tracking, transaction graph analysis, and token metrics for DeFi research and compliance teams.",
    longDescription:
      "ChainScope brings institutional-grade blockchain analytics to DeFi researchers and compliance teams. The platform indexes over 15 EVM-compatible chains in real-time, building a comprehensive transaction graph that enables whale tracking, flow analysis, and risk scoring. The wallet clustering algorithm identifies related addresses with 96% precision, while the anomaly detection system flags suspicious patterns within seconds of on-chain activity. Used by 4 of the top 10 crypto exchanges for compliance monitoring.",
    technologies: [
      "TypeScript",
      "Next.js",
      "Python",
      "Neo4j",
      "Apache Spark",
      "Ethers.js",
      "GraphQL",
      "ClickHouse",
    ],
    metrics: [
      { label: "Chains Indexed", value: "15" },
      { label: "Clustering Precision", value: "96%" },
      { label: "Alert Latency", value: "<3s" },
      { label: "Exchange Partners", value: "4/10" },
    ],
    challenges: [
      "Building a real-time graph database that scales to billions of transactions",
      "Developing wallet clustering algorithms with 96% precision",
      "Processing and indexing data from 15 different blockchain protocols simultaneously",
    ],
    role: "Full Stack Engineer & Data Architect",
    duration: "8 months",
    link: "https://chainscope.demo",
    github: "https://github.com/arjun-mehta/chainscope",
  },
];

// ── Experience ────────────────────────────

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export const experiences: Experience[] = [
  {
    id: "deepmind",
    company: "Google DeepMind",
    role: "Senior Research Engineer",
    period: "2025 — Present",
    location: "Bengaluru, India",
    description:
      "Leading research engineering on large-scale foundation models, focusing on efficient inference, model distillation, and multi-modal architectures for production deployment.",
    achievements: [
      "Designed a novel model distillation pipeline that reduced inference costs by 62% while maintaining 98% of teacher model performance",
      "Led a cross-functional team of 8 engineers shipping a production-grade multi-modal system processing 500K queries/day",
      "Contributed to 3 research papers accepted at NeurIPS and ICML on efficient transformer architectures",
      "Built internal tooling that reduced model evaluation turnaround from 48 hours to 3 hours",
    ],
    technologies: [
      "Python",
      "JAX",
      "TPU",
      "PyTorch",
      "Kubernetes",
      "C++",
      "TensorFlow",
    ],
  },
  {
    id: "microsoft",
    company: "Microsoft Research",
    role: "ML Engineer II",
    period: "2023 — 2025",
    location: "Hyderabad, India",
    description:
      "Worked on the Responsible AI team developing fairness-aware ML systems and bias detection tooling integrated into Azure ML.",
    achievements: [
      "Built a bias detection framework adopted by 12 internal product teams, identifying fairness issues before deployment",
      "Reduced model retraining costs by 40% through intelligent data curation and active learning pipelines",
      "Shipped a production fairness dashboard used by 500+ ML engineers across Microsoft",
      "Mentored 4 junior engineers, 2 of whom received promotions within 12 months",
    ],
    technologies: [
      "Python",
      "PyTorch",
      "Azure ML",
      "TypeScript",
      "React",
      "Spark",
      "MLflow",
    ],
  },
  {
    id: "flipkart",
    company: "Flipkart",
    role: "Software Engineer — ML Platform",
    period: "2021 — 2023",
    location: "Bengaluru, India",
    description:
      "Built and maintained the core ML infrastructure powering product recommendations, search ranking, and pricing optimization across India's largest e-commerce platform.",
    achievements: [
      "Redesigned the recommendation engine serving 300M+ users, increasing click-through rate by 23%",
      "Built a real-time feature store reducing model serving latency from 120ms to 15ms",
      "Implemented A/B testing infrastructure for ML models, enabling rapid experimentation across 50+ models",
      "Reduced infrastructure costs by 35% through model optimization and intelligent autoscaling",
    ],
    technologies: [
      "Python",
      "Java",
      "TensorFlow",
      "Apache Flink",
      "Redis",
      "Kubernetes",
      "gRPC",
    ],
  },
  {
    id: "intern-amazon",
    company: "Amazon",
    role: "SDE Intern — Alexa AI",
    period: "Summer 2020",
    location: "Bengaluru, India",
    description:
      "Developed intent classification improvements for Alexa's natural language understanding pipeline during a 12-week summer internship.",
    achievements: [
      "Improved intent classification accuracy by 4.2% for low-resource languages using few-shot learning",
      "Built an automated test pipeline reducing regression testing time by 60%",
      "Received a return offer and commendation from the team lead for exceptional contribution",
    ],
    technologies: [
      "Python",
      "PyTorch",
      "AWS SageMaker",
      "Java",
      "DynamoDB",
    ],
  },
];

// ── Blog Posts ─────────────────────────────

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "transformer-attention-mechanisms",
    title: "Rethinking Attention: Beyond Vanilla Transformers",
    excerpt:
      "How emerging attention mechanisms like FlashAttention-3 and multi-query attention are reshaping model architecture for production workloads.",
    category: "Deep Learning",
    date: "Sep 2026",
    readTime: "8 min read",
    image: "/images/project-ai-dashboard.jpg",
    content: `
## The Attention Bottleneck

The self-attention mechanism, while revolutionary, has always been the Achilles heel of transformer architectures. Its quadratic complexity with respect to sequence length has forced engineers to make uncomfortable trade-offs between model capability and computational feasibility.

But 2025–2026 has seen a renaissance in attention mechanism research. Innovations like **FlashAttention-3**, **Multi-Query Attention (MQA)**, and **Grouped-Query Attention (GQA)** are fundamentally changing how we think about the attention operation itself.

## FlashAttention-3: The Memory Revolution

FlashAttention-3 builds on its predecessors by introducing **asynchronous pipelining** between memory operations and compute. On modern hardware (H100s, TPU v5), this means:

- **2.5x faster** inference compared to standard attention
- **73% less memory** usage for long sequences
- Support for sequences up to **128K tokens** without approximation

The key insight is treating attention computation as a series of **tiled matrix operations** that can be overlapped with memory transfers, rather than materializing the full attention matrix.

\`\`\`python
# Pseudocode for FlashAttention-3's tiled computation
def flash_attention_v3(Q, K, V, block_size=256):
    """Tiled attention with async memory pipelining."""
    output = torch.zeros_like(Q)
    for i in range(0, Q.shape[1], block_size):
        q_block = Q[:, i:i+block_size]
        # Async prefetch next block while computing current
        async_prefetch(Q[:, i+block_size:i+2*block_size])
        
        for j in range(0, K.shape[1], block_size):
            k_block = K[:, j:j+block_size]
            v_block = V[:, j:j+block_size]
            
            # Online softmax update (numerically stable)
            scores = q_block @ k_block.T / sqrt(d_k)
            output[:, i:i+block_size] += softmax(scores) @ v_block
    
    return output
\`\`\`

## Multi-Query vs. Grouped-Query Attention

**MQA** uses a single key-value head shared across all query heads. This dramatically reduces KV-cache memory during autoregressive decoding:

| Attention Type | KV-Cache Size | Quality (vs MHA) | Speed |
|---|---|---|---|
| Multi-Head (MHA) | 1x | Baseline | 1x |
| Multi-Query (MQA) | 1/n_heads | -0.5% | 1.7x |
| Grouped-Query (GQA) | 1/n_groups | -0.1% | 1.5x |

GQA strikes the sweet spot — grouping query heads into clusters that share KV projections delivers nearly all of MQA's speed benefits while maintaining MHA-level quality.

## Production Implications

For teams deploying large language models in production, these innovations translate directly to **cost savings**. At Google DeepMind, switching our inference pipeline from standard MHA to GQA with FlashAttention-3 reduced our serving costs by **41%** while maintaining output quality within 0.2% of the original.

The lesson? Attention mechanism choice is no longer an academic exercise — it's a **business-critical infrastructure decision**.

---

*If you're evaluating attention mechanisms for your production models, I'd love to discuss the trade-offs. Reach out via the contact page.*
    `,
  },
  {
    id: "building-feature-stores",
    title: "The Art of Feature Store Architecture",
    excerpt:
      "Lessons learned building a feature store serving 300M+ users at Flipkart — from 120ms to 15ms latency.",
    category: "ML Infrastructure",
    date: "Aug 2026",
    readTime: "12 min read",
    image: "/images/project-nlp-platform.jpg",
    content: `
## Why Feature Stores Matter

Every ML system is only as good as its features. But serving features at scale — with low latency, high freshness, and point-in-time correctness — is one of the hardest infrastructure problems in ML engineering.

At Flipkart, our recommendation engine serves **300 million users** with personalized product suggestions. When I joined the ML Platform team, our feature serving latency was 120ms — acceptable for batch processing, but painfully slow for real-time recommendations.

## The Architecture

We built a three-tier feature store:

1. **Online Store** (Redis Cluster): Sub-5ms reads for hot features, pre-computed at serving time
2. **Nearline Store** (Apache Flink + Kafka): Real-time feature computation with <30s freshness
3. **Offline Store** (Apache Hive + Spark): Historical features for training and backfill

The critical innovation was our **feature gateway** — a unified API layer that abstracts the underlying store, allowing ML engineers to request features without knowing (or caring) where they're served from.

## The 120ms → 15ms Journey

The latency reduction came from three key optimizations:

**1. Feature Pre-computation**: Instead of computing features at serving time, we shifted to a continuous pre-computation model using Flink streaming jobs. User features are updated within 30 seconds of any interaction event.

**2. Intelligent Caching**: Not all features change at the same rate. We implemented a tiered caching strategy where static features (user demographics) are cached for 24h, behavioral features (recent clicks) for 5 minutes, and contextual features (time of day, device) are computed on-the-fly.

**3. Request Batching**: Instead of making individual Redis lookups per feature, we batch all feature requests for a single prediction into a single MGET operation, reducing round trips by 85%.

## Results

| Metric | Before | After | Improvement |
|---|---|---|---|
| P50 Latency | 120ms | 15ms | 8x faster |
| P99 Latency | 340ms | 45ms | 7.5x faster |
| Feature Freshness | 1 hour | 30 seconds | 120x fresher |
| Infrastructure Cost | $2.1M/yr | $1.4M/yr | 35% cheaper |

The click-through rate improvement of 23% was primarily driven by the freshness improvement — users were seeing recommendations based on their behavior from seconds ago, not hours ago.

---

*Feature stores are foundational infrastructure for any serious ML team. If you're building one, learn from our mistakes — start with the online store and work backwards.*
    `,
  },
  {
    id: "responsible-ai-in-practice",
    title: "Responsible AI: From Principles to Production",
    excerpt:
      "How we built fairness-aware ML systems at Microsoft Research — practical lessons, not just theory.",
    category: "Responsible AI",
    date: "Jul 2026",
    readTime: "10 min read",
    image: "/images/project-computer-vision.jpg",
    content: `
## The Gap Between Principles and Practice

Every major tech company has published AI ethics principles. Few have figured out how to systematically enforce them in production systems. At Microsoft Research, I spent two years bridging this gap — building tools that make fairness a **measurable, testable property** of ML systems.

## The Fairness Dashboard

Our most impactful contribution was a fairness dashboard integrated directly into Azure ML. Before any model ships, engineers can:

1. **Measure disparities** across protected attributes (race, gender, age)
2. **Simulate interventions** — what happens if we apply different thresholds per group?
3. **Generate compliance reports** with one click for regulatory review

The dashboard now has **500+ active users** across Microsoft.

## Key Lessons

### 1. Fairness is a spectrum, not a binary

There's no single "fair" threshold. Different contexts demand different fairness metrics:
- **Demographic parity** for hiring systems (equal selection rates)
- **Equalized odds** for medical diagnosis (equal error rates)
- **Calibration** for risk scoring (predicted probabilities match outcomes)

### 2. Bias enters through data, not algorithms

In 90% of the cases our team investigated, bias was introduced through **training data**, not model architecture. Common culprits:
- Historical bias in labeled data
- Underrepresentation of minority groups
- Proxy features that correlate with protected attributes

### 3. Testing must be continuous, not one-time

Models drift. Data distributions change. A model that was fair at deployment can become biased over time. We implemented **continuous fairness monitoring** that alerts teams when disparity metrics exceed thresholds.

## Impact

Our bias detection framework is now used by **12 internal product teams**. It has caught fairness issues in:
- A language model that generated more negative sentiment for certain demographics
- A hiring recommendation system with disparate impact across age groups
- A content moderation system with different error rates across languages

---

*Responsible AI isn't about perfection — it's about building systems that allow us to measure, monitor, and improve. The tools matter as much as the principles.*
    `,
  },
  {
    id: "edge-ai-deployment",
    title: "Deploying ML Models at the Edge: A Practical Guide",
    excerpt:
      "From cloud-first to edge-optimized — how we shipped 60 FPS computer vision on $200 hardware.",
    category: "Edge Computing",
    date: "Jun 2026",
    readTime: "9 min read",
    image: "/images/project-blockchain.jpg",
    content: `
## The Edge Imperative

Not every ML workload belongs in the cloud. For real-time computer vision — where latency, bandwidth, and privacy are critical — edge deployment is not a nice-to-have, it's a requirement.

With Sentinel Vision, we faced a clear challenge: deploy a state-of-the-art object detection model that runs at **60 FPS on a $200 NVIDIA Jetson device**. No cloud fallback. No compromises on accuracy.

## The Optimization Stack

### Model Architecture

We started with a standard ResNet-101 + FPN (Feature Pyramid Network) backbone trained on our custom dataset. The cloud version ran at 15 FPS on an A100 GPU — nowhere near our target.

### Quantization

Post-training quantization (INT8) was the first major win:
- **FP32 → FP16**: 1.8x speedup, <0.1% accuracy loss
- **FP16 → INT8**: 2.4x speedup, 0.3% accuracy loss (acceptable)

### TensorRT Optimization

NVIDIA's TensorRT compiler performed:
- **Layer fusion**: Combining Conv → BatchNorm → ReLU into single kernels
- **Kernel auto-tuning**: Selecting optimal CUDA kernels for each operation
- **Memory optimization**: Reusing buffers between layers

### Architecture Modifications

The final push came from architecture changes:
- Replaced standard convolutions with **depthwise separable convolutions** in the detection head
- Implemented **dynamic resolution scaling** — lower resolution for easy scenes, higher for complex ones
- Used **temporal coherence** — leveraging predictions from previous frames to reduce computation

## Results

| Configuration | FPS | mAP | Power |
|---|---|---|---|
| Cloud (A100, FP32) | 15 | 94.2% | 300W |
| Edge (Jetson, FP32) | 8 | 94.2% | 15W |
| Edge (Jetson, INT8 + TRT) | 42 | 93.1% | 12W |
| Edge (Optimized Architecture) | **62** | **92.1%** | **10W** |

We achieved **62 FPS** with only a 2.1% accuracy trade-off — well within our requirements.

## Deployment at Scale

The real challenge wasn't optimization — it was **fleet management**. With 340+ edge devices:
- Over-the-air model updates with A/B testing
- Remote health monitoring and automatic recovery
- Edge-cloud hybrid inference for complex edge cases

---

*Edge AI is the future of real-time ML. The optimization journey is challenging, but the results are worth it.*
    `,
  },
];

// ── Skills / Expertise ────────────────────

export const skills = {
  "Machine Learning": [
    "PyTorch",
    "TensorFlow",
    "JAX",
    "Hugging Face",
    "scikit-learn",
    "XGBoost",
  ],
  "Deep Learning": [
    "Transformers",
    "CNNs",
    "GANs",
    "Diffusion Models",
    "Graph Neural Networks",
    "Reinforcement Learning",
  ],
  "MLOps & Infrastructure": [
    "Kubernetes",
    "Docker",
    "MLflow",
    "Apache Kafka",
    "Apache Spark",
    "Apache Flink",
  ],
  "Languages": [
    "Python",
    "TypeScript",
    "Java",
    "C++",
    "Rust",
    "SQL",
  ],
  "Cloud & DevOps": [
    "AWS",
    "GCP",
    "Azure",
    "Terraform",
    "CI/CD",
    "gRPC",
  ],
  "Frontend": [
    "React",
    "Next.js",
    "Three.js",
    "D3.js",
    "Tailwind CSS",
    "WebGL",
  ],
};

// ── Stats ─────────────────────────────────

export const stats = [
  { value: 12, suffix: "+", label: "Research Papers Published" },
  { value: 300, suffix: "M+", label: "Users Impacted" },
  { value: 5, suffix: "", label: "Years of Experience" },
  { value: 4, suffix: "", label: "Enterprise Projects Shipped" },
];
